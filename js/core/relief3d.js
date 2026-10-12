/* 3D export for terrain maps: a 16-bit heightmap, a colour texture and a
   Blender script that builds a relief model from them, packed in a ZIP.

   A generator opts in with `heightfield(model)`, which returns
   { cols, rows, data, sea, width, height, scale }: `data` holds cols × rows
   heights in 0..1 (row 0 is the top of the map), `sea` is the sea level in
   the same range, width × height the map size and `scale` the suggested
   height of the relief in Blender units for a model 10 units wide.
   `texture3d` lists the render options for a clean texture. */
(function (Carto) {
  'use strict';

  // ------------------------------------------------------------------ rasters

  // Heights known at scattered points (cell centres), interpolated linearly
  // over their Delaunay triangulation. `near` records the closest point of
  // each pixel so callers can tell land from sea exactly like the map does.
  function fromPoints(xs, ys, values, n, sx, sy, cols, rows, find) {
    const coords = new Float64Array(2 * n);
    for (let i = 0; i < n; i++) { coords[2 * i] = xs[i] * sx; coords[2 * i + 1] = ys[i] * sy; }
    const T = new Carto.Delaunator(coords).triangles;
    const data = new Float32Array(cols * rows).fill(NaN);
    const near = new Int32Array(cols * rows).fill(-1);
    for (let t = 0; t < T.length; t += 3) {
      const a = T[t], b = T[t + 1], c = T[t + 2];
      const ax = coords[2 * a], ay = coords[2 * a + 1], bx = coords[2 * b], by = coords[2 * b + 1], cx = coords[2 * c], cy = coords[2 * c + 1];
      const det = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
      if (Math.abs(det) < 1e-9) continue;
      const x0 = Math.max(0, Math.floor(Math.min(ax, bx, cx))), x1 = Math.min(cols - 1, Math.ceil(Math.max(ax, bx, cx)));
      const y0 = Math.max(0, Math.floor(Math.min(ay, by, cy))), y1 = Math.min(rows - 1, Math.ceil(Math.max(ay, by, cy)));
      const va = values[a], vb = values[b], vc = values[c];
      for (let y = y0; y <= y1; y++) {
        const py = y + 0.5;
        for (let x = x0; x <= x1; x++) {
          const px = x + 0.5;
          const l1 = ((by - cy) * (px - cx) + (cx - bx) * (py - cy)) / det;
          const l2 = ((cy - ay) * (px - cx) + (ax - cx) * (py - cy)) / det;
          const l3 = 1 - l1 - l2;
          if (l1 < -1e-6 || l2 < -1e-6 || l3 < -1e-6) continue;
          const p = x + y * cols;
          data[p] = l1 * va + l2 * vb + l3 * vc;
          const da = (px - ax) ** 2 + (py - ay) ** 2, db = (px - bx) ** 2 + (py - by) ** 2, dc = (px - cx) ** 2 + (py - cy) ** 2;
          near[p] = da <= db && da <= dc ? a : db <= dc ? b : c;
        }
      }
    }
    // Pixels outside the triangulation (the sheet's rim) take the nearest point.
    for (let p = 0; p < data.length; p++) {
      if (!Number.isNaN(data[p])) continue;
      const x = p % cols, y = (p - x) / cols;
      const i = find((x + 0.5) / sx, (y + 0.5) / sy);
      near[p] = i;
      data[p] = i >= 0 ? values[i] : 0;
    }
    return { data, near };
  }

  // Heights on a regular grid of gw × gh nodes spanning the map, resampled bilinearly.
  function fromGrid(values, gw, gh, cols, rows) {
    const data = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      const gy = (y / (rows - 1)) * (gh - 1), j = Math.min(gh - 2, Math.floor(gy)), fy = gy - j;
      for (let x = 0; x < cols; x++) {
        const gx = (x / (cols - 1)) * (gw - 1), i = Math.min(gw - 2, Math.floor(gx)), fx = gx - i;
        const k = i + j * gw;
        const top = values[k] * (1 - fx) + values[k + 1] * fx;
        const bot = values[k + gw] * (1 - fx) + values[k + gw + 1] * fx;
        data[x + y * cols] = top * (1 - fy) + bot * fy;
      }
    }
    return data;
  }

  // Separable box blur, repeated: close to a Gaussian, it hides triangle facets.
  function blur(data, cols, rows, r, passes) {
    const tmp = new Float32Array(Math.max(cols, rows));
    const line = (get, set, len) => {
      for (let i = 0; i < len; i++) tmp[i] = get(i);
      let acc = 0;
      for (let i = -r; i <= r; i++) acc += tmp[Math.min(len - 1, Math.max(0, i))];
      for (let i = 0; i < len; i++) {
        set(i, acc / (2 * r + 1));
        acc += tmp[Math.min(len - 1, i + r + 1)] - tmp[Math.max(0, i - r)];
      }
    };
    for (let k = 0; k < passes; k++) {
      for (let y = 0; y < rows; y++) line((i) => data[i + y * cols], (i, v) => { data[i + y * cols] = v; }, cols);
      for (let x = 0; x < cols; x++) line((i) => data[x + i * cols], (i, v) => { data[x + i * cols] = v; }, rows);
    }
    return data;
  }

  // ------------------------------------------------------------------ files

  const CRC = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(bytes, crc = 0) {
    let c = ~crc >>> 0;
    for (let i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 255] ^ (c >>> 8);
    return ~c >>> 0;
  }

  // zlib stream: real compression where the browser offers it, stored blocks otherwise.
  async function zlib(bytes) {
    if (typeof CompressionStream === 'function') {
      try {
        const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'));
        return new Uint8Array(await new Response(stream).arrayBuffer());
      } catch (e) { /* fall back below */ }
    }
    const blocks = Math.max(1, Math.ceil(bytes.length / 65535));
    const out = new Uint8Array(2 + bytes.length + blocks * 5 + 4);
    out[0] = 0x78; out[1] = 0x01;
    let o = 2;
    for (let b = 0; b < blocks; b++) {
      const start = b * 65535, len = Math.min(65535, bytes.length - start);
      out[o++] = b === blocks - 1 ? 1 : 0;
      out[o++] = len & 255; out[o++] = len >> 8; out[o++] = ~len & 255; out[o++] = (~len >> 8) & 255;
      out.set(bytes.subarray(start, start + len), o);
      o += len;
    }
    let s1 = 1, s2 = 0;
    for (let i = 0; i < bytes.length; i++) { s1 = (s1 + bytes[i]) % 65521; s2 = (s2 + s1) % 65521; }
    out[o++] = s2 >> 8; out[o++] = s2 & 255; out[o++] = s1 >> 8; out[o++] = s1 & 255;
    return out;
  }

  // Greyscale PNG with 16 bits per pixel: 65 536 height levels, no terracing.
  async function png16(data, cols, rows) {
    const stride = 1 + cols * 2;
    const raw = new Uint8Array(stride * rows);
    for (let y = 0; y < rows; y++) {
      const o = y * stride;
      raw[o] = 2; // "Up" filter: neighbouring rows are nearly identical
      for (let x = 0; x < cols; x++) {
        const v = Math.round(Math.max(0, Math.min(1, data[x + y * cols])) * 65535);
        raw[o + 1 + 2 * x] = v >> 8;
        raw[o + 2 + 2 * x] = v & 255;
      }
    }
    // Bottom-up, so each row is filtered against its unfiltered predecessor.
    for (let y = rows - 1; y > 0; y--) {
      const o = y * stride, u = o - stride;
      for (let i = 1; i < stride; i++) raw[o + i] = (raw[o + i] - raw[u + i]) & 255;
    }
    const idat = await zlib(raw);
    const chunks = [];
    const chunk = (type, body) => {
      const head = new Uint8Array(8);
      new DataView(head.buffer).setUint32(0, body.length);
      for (let i = 0; i < 4; i++) head[4 + i] = type.charCodeAt(i);
      const tail = new Uint8Array(4);
      new DataView(tail.buffer).setUint32(0, crc32(body, crc32(head.subarray(4))));
      chunks.push(head, body, tail);
    };
    const ihdr = new Uint8Array(13);
    const dv = new DataView(ihdr.buffer);
    dv.setUint32(0, cols); dv.setUint32(4, rows);
    ihdr[8] = 16; ihdr[9] = 0; // bit depth, greyscale
    chunk('IHDR', ihdr);
    chunk('IDAT', idat);
    chunk('IEND', new Uint8Array(0));
    return new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), ...chunks], { type: 'image/png' });
  }

  // ZIP archive without compression (the PNGs are compressed already).
  async function zip(files) {
    const enc = new TextEncoder();
    const parts = [], central = [];
    let offset = 0;
    const now = new Date();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    for (const f of files) {
      const bytes = f.data instanceof Blob ? new Uint8Array(await f.data.arrayBuffer()) : typeof f.data === 'string' ? enc.encode(f.data) : f.data;
      const name = enc.encode(f.name);
      const crc = crc32(bytes);
      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true); local.setUint16(6, 0x0800, true); local.setUint16(8, 0, true);
      local.setUint16(10, dosTime, true); local.setUint16(12, dosDate, true);
      local.setUint32(14, crc, true); local.setUint32(18, bytes.length, true); local.setUint32(22, bytes.length, true);
      local.setUint16(26, name.length, true); local.setUint16(28, 0, true);
      parts.push(new Uint8Array(local.buffer), name, bytes);
      const cen = new DataView(new ArrayBuffer(46));
      cen.setUint32(0, 0x02014b50, true);
      cen.setUint16(4, 20, true); cen.setUint16(6, 20, true); cen.setUint16(8, 0x0800, true); cen.setUint16(10, 0, true);
      cen.setUint16(12, dosTime, true); cen.setUint16(14, dosDate, true);
      cen.setUint32(16, crc, true); cen.setUint32(20, bytes.length, true); cen.setUint32(24, bytes.length, true);
      cen.setUint16(28, name.length, true);
      cen.setUint32(42, offset, true);
      central.push(new Uint8Array(cen.buffer), name);
      offset += 30 + name.length + bytes.length;
    }
    const size = central.reduce((s, b) => s + b.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, size, true); end.setUint32(16, offset, true);
    return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: 'application/zip' });
  }

  // ------------------------------------------------------------------ Blender

  const pyStr = (s) => JSON.stringify(String(s));
  const num = (v) => String(Math.round(v * 10000) / 10000);

  function blenderScript(info) {
    const w = 10, d = (10 * info.height) / info.width;
    return `# Il Cartografo Errante - ${info.title.replace(/\n/g, ' ')}
# Builds a relief model of the map in Blender (3.0 or later).
#
# Usage: open Blender, go to the "Scripting" tab, Text > Open this file
# (it must stay in the same folder as the PNG files), then press Run Script.
# From a terminal: blender --python crea-plastico.py
#
# Change the values below and run the script again to rebuild the model.

import os
import bpy
from math import radians

HEIGHT = ${num(info.scale)}          # relief height (Blender units; the model is ${w} wide)
TEXTURE = "${info.texture}"   # or "${info.alt}" for the map as drawn
WATER = True          # transparent sea at sea level
DETAIL = 9            # subdivision level for renders (8 = faster, 10 = finer)

WIDTH = ${num(w)}
DEPTH = ${num(d)}
SEA = ${num(info.sea)}          # sea level in the heightmap (0..1)
NAME = ${pyStr(info.title)}
WATER_COLOR = (${info.water.map(num).join(', ')}, 1.0)


def folder():
    try:
        text = bpy.context.space_data.text
        if text and text.filepath:
            return os.path.dirname(bpy.path.abspath(text.filepath))
    except AttributeError:
        pass
    try:
        return os.path.dirname(os.path.abspath(__file__))
    except NameError:
        return os.path.dirname(bpy.data.filepath)


DIR = folder()


def image(name, data):
    path = os.path.join(DIR, name)
    if not os.path.exists(path):
        raise FileNotFoundError("Missing " + path + ": keep the script next to the PNG files.")
    img = bpy.data.images.load(path, check_existing=True)
    if data:
        img.colorspace_settings.name = "Non-Color"
    return img


def material(name, color=None, img=None, roughness=0.8, alpha=1.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    if bpy.app.version < (5, 0, 0):
        mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    out.location = (300, 0)
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    bsdf.inputs["Roughness"].default_value = roughness
    if img:
        tex = nodes.new("ShaderNodeTexImage")
        tex.location = (-350, 0)
        tex.image = img
        tex.extension = "EXTEND"
        links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    elif color:
        bsdf.inputs["Base Color"].default_value = color
    if alpha < 1:
        bsdf.inputs["Alpha"].default_value = alpha
        for attr, value in (("surface_render_method", "BLENDED"), ("blend_method", "BLEND")):
            if hasattr(mat, attr):
                try:
                    setattr(mat, attr, value)
                except (TypeError, ValueError):
                    pass
    return mat


def replace(name, data):
    old = bpy.data.objects.get(name)
    if old:
        bpy.data.objects.remove(old, do_unlink=True)
    obj = bpy.data.objects.new(name, data)
    coll.objects.link(obj)
    return obj


def plane(name, w, d, z=0.0):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([(-w / 2, -d / 2, z), (w / 2, -d / 2, z), (w / 2, d / 2, z), (-w / 2, d / 2, z)], [], [(0, 1, 2, 3)])
    uv = mesh.uv_layers.new(name="UVMap")
    for loop, co in zip(uv.data, ((0, 0), (1, 0), (1, 1), (0, 1))):
        loop.uv = co
    return replace(name, mesh)


scene = bpy.context.scene

# The default cube would poke through the model and the default lamp
# would leave a hot spot on the sea.
cube = bpy.data.objects.get("Cube")
if cube and cube.type == "MESH" and len(cube.data.vertices) == 8:
    bpy.data.objects.remove(cube, do_unlink=True)
lamp = bpy.data.objects.get("Light")
if lamp and lamp.type == "LIGHT" and lamp.data.type == "POINT":
    bpy.data.objects.remove(lamp, do_unlink=True)

coll = bpy.data.collections.get("Cartografo")
if not coll:
    coll = bpy.data.collections.new("Cartografo")
    scene.collection.children.link(coll)

heights = image("heightmap.png", True)
colors = image(TEXTURE, False)

# Terrain: a plane subdivided and pushed up by the heightmap.
land = plane("Terreno", WIDTH, DEPTH)
sub = land.modifiers.new("Suddivisione", "SUBSURF")
sub.subdivision_type = "SIMPLE"
sub.levels = min(DETAIL, 8)
sub.render_levels = DETAIL
tex = bpy.data.textures.get("Rilievo") or bpy.data.textures.new("Rilievo", type="IMAGE")
tex.image = heights
tex.extension = "EXTEND"
disp = land.modifiers.new("Rilievo", "DISPLACE")
disp.texture = tex
disp.texture_coords = "UV"
disp.mid_level = 0.0
disp.strength = HEIGHT
land.data.materials.append(material("Mappa", img=colors))
for poly in land.data.polygons:
    poly.use_smooth = True

# Sea.
if WATER:
    sea = plane("Mare", WIDTH, DEPTH, SEA * HEIGHT)
    sea.data.materials.append(material("Acqua", color=WATER_COLOR, roughness=0.15, alpha=0.55))
elif bpy.data.objects.get("Mare"):
    bpy.data.objects.remove(bpy.data.objects["Mare"], do_unlink=True)

# Sunlight from the north-west, low enough to bring out the relief.
sun_data = bpy.data.lights.get("Sole") or bpy.data.lights.new("Sole", "SUN")
sun_data.energy = 3.5
sun_data.angle = radians(2)
sun = replace("Sole", sun_data)
sun.rotation_euler = (radians(58), 0, radians(-135))

# Camera looking down at the model from the south.
cam_data = bpy.data.cameras.get("Camera Cartografo") or bpy.data.cameras.new("Camera Cartografo")
cam_data.lens = 45
cam = replace("Camera Cartografo", cam_data)
dist = 1.12 * max(1.25 * WIDTH, 1.65 * DEPTH)
cam.location = (0, -dist * 0.72, dist * 0.70 + HEIGHT * SEA)
cam.rotation_euler = (radians(46), 0, 0)
scene.camera = cam
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080

world = scene.world or bpy.data.worlds.new("World")
scene.world = world
if bpy.app.version < (5, 0, 0):
    world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg:
    bg.inputs["Color"].default_value = (0.82, 0.84, 0.86, 1.0)
    bg.inputs["Strength"].default_value = 0.6

# Show materials in the viewport when run from the interface.
screen = getattr(bpy.context, "screen", None)
if screen:
    for area in screen.areas:
        if area.type == "VIEW_3D":
            area.spaces[0].shading.type = "MATERIAL"

print("Il Cartografo Errante: model of " + NAME + " ready.")
`;
  }

  function readme(info) {
    const it = Carto.I18n.lang === 'it';
    const lines = it ? [
      info.title,
      '',
      'Contenuto',
      '  heightmap.png    altitudini in scala di grigi a 16 bit (nero = fondale piu profondo, bianco = vetta piu alta)',
      '  ' + info.texture.padEnd(16) + ' colori del terreno, senza scritte, da usare come texture',
      '  ' + info.alt.padEnd(16) + ' la mappa cosi come la vedi nel Cartografo',
      '  crea-plastico.py script per Blender che costruisce il modello',
      '',
      'Blender (3.0 o successivo)',
      '  1. Estrai tutto lo ZIP in una cartella.',
      '  2. Apri Blender, vai nella scheda "Scripting".',
      '  3. Nell\'editor di testo: Text > Open e scegli crea-plastico.py.',
      '  4. Premi il pulsante Run Script (triangolo).',
      '  5. Torna nella scheda "Layout": trovi terreno, mare, sole e camera. F12 per il render.',
      '  In cima allo script puoi cambiare l\'altezza del rilievo (HEIGHT), la texture,',
      '  il mare e il dettaglio, poi rilanciarlo.',
      '',
      'A mano, o in altri programmi',
      '  Blender: piano > modificatore Subdivision (Simple) + Displace con heightmap.png,',
      '  coordinate UV, Midlevel 0, spazio colore Non-Color.',
      '  Unity, Unreal, Godot, Gaea, World Machine: importa heightmap.png come heightmap a 16 bit.',
      '  Livello del mare nella heightmap: ' + Math.round(info.sea * 100) + '% del bianco.',
      '  Le altezze sono relative ed esagerate rispetto alla scala reale, come in un plastico.',
    ] : [
      info.title,
      '',
      'Contents',
      '  heightmap.png    16-bit greyscale elevation (black = deepest sea floor, white = highest peak)',
      '  ' + info.texture.padEnd(16) + ' terrain colours without lettering, for use as a texture',
      '  ' + info.alt.padEnd(16) + ' the map as drawn in the Cartographer',
      '  crea-plastico.py Blender script that builds the model',
      '',
      'Blender (3.0 or later)',
      '  1. Extract the whole ZIP into a folder.',
      '  2. Open Blender and switch to the "Scripting" tab.',
      '  3. In the text editor: Text > Open and pick crea-plastico.py.',
      '  4. Press Run Script (the triangle).',
      '  5. Back in the "Layout" tab you get terrain, sea, sun and camera. F12 renders.',
      '  The top of the script sets relief height (HEIGHT), texture, sea and detail;',
      '  change them and run it again.',
      '',
      'By hand, or in other software',
      '  Blender: plane > Subdivision (Simple) + Displace modifier with heightmap.png,',
      '  UV coordinates, Midlevel 0, Non-Color colour space.',
      '  Unity, Unreal, Godot, Gaea, World Machine: import heightmap.png as a 16-bit heightmap.',
      '  Sea level in the heightmap: ' + Math.round(info.sea * 100) + '% of white.',
      '  Heights are relative and exaggerated, like a relief model.',
    ];
    return lines.join('\r\n') + '\r\n';
  }

  function hexToLinear(hex) {
    const v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => {
      const s = c / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
  }

  // Everything in one archive. `renderPng(opts)` rasterises the map with extra
  // render options and resolves a PNG blob.
  async function build(gen, model, renderPng, title) {
    const hf = gen.heightfield(model);
    const [height, texture, drawn] = await Promise.all([
      png16(hf.data, hf.cols, hf.rows),
      renderPng(Object.assign({ bare: true }, gen.texture3d || {})),
      renderPng({}),
    ]);
    const info = {
      title, width: hf.width, height: hf.height, sea: hf.sea, scale: hf.scale,
      texture: 'texture.png', alt: 'mappa.png', water: hexToLinear(hf.water || '#4f7f98'),
    };
    return zip([
      { name: 'heightmap.png', data: height },
      { name: info.texture, data: texture },
      { name: info.alt, data: drawn },
      { name: 'crea-plastico.py', data: blenderScript(info) },
      { name: Carto.I18n.lang === 'it' ? 'LEGGIMI.txt' : 'README.txt', data: readme(info) },
    ]);
  }

  Carto.Relief3D = { fromPoints, fromGrid, blur, png16, zip, crc32, blenderScript, build };
})(window.Carto = window.Carto || {});
