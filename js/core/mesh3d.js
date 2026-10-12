/* 3D models of floor plans as glTF binaries (.glb), which Blender, Unity,
   Godot, Unreal and most 3D viewers open directly.

   Plans are built in metres with map axes: x to the east, s to the south
   (down the page) and h up. glTF is Y-up, so a point (x, s, h) is stored as
   (x, h, s): north ends up at -Z, which Blender turns into +Y. */
(function (Carto) {
  'use strict';

  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const P = (x, s, h) => [x, h, s];

  class Mesh {
    constructor() { this.pos = []; this.nrm = []; this.idx = []; }
    get empty() { return this.idx.length === 0; }

    // A flat polygon (glTF coordinates) facing `normal`, as a fan from `center`
    // (or from its first corner): fine for convex and star-shaped outlines.
    face(pts, normal, center) {
      if (pts.length < 3) return;
      const base = this.pos.length / 3;
      const ring = center ? [center, ...pts] : pts;
      for (const p of ring) { this.pos.push(p[0], p[1], p[2]); this.nrm.push(normal[0], normal[1], normal[2]); }
      const tris = [];
      if (center) for (let i = 0; i < pts.length; i++) tris.push([0, 1 + i, 1 + ((i + 1) % pts.length)]);
      else for (let i = 1; i < pts.length - 1; i++) tris.push([0, i, i + 1]);
      // Wind every triangle counter-clockwise seen from the side it faces.
      for (const [a, b, c] of tris) {
        const n = cross(sub(ring[b], ring[a]), sub(ring[c], ring[a]));
        if (dot(n, normal) >= 0) this.idx.push(base + a, base + b, base + c);
        else this.idx.push(base + a, base + c, base + b);
      }
    }

    // Vertical prism over a plan outline [[x, s], ...] from height h0 to h1.
    prism(outline, h0, h1, opts = {}) {
      const n = outline.length;
      if (n < 3 || h1 <= h0) return this;
      // Orientation of the outline in plan (positive area: counter-clockwise
      // with x across and s down, i.e. clockwise as seen on the page).
      let area = 0;
      for (let i = 0; i < n; i++) { const a = outline[i], b = outline[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; }
      const sign = area >= 0 ? 1 : -1;
      if (opts.sides !== false) {
        for (let i = 0; i < n; i++) {
          const a = outline[i], b = outline[(i + 1) % n];
          const dx = b[0] - a[0], ds = b[1] - a[1], len = Math.hypot(dx, ds);
          if (len < 1e-6) continue;
          // Outward normal in plan.
          const nx = (sign * ds) / len, ns = (sign * -dx) / len;
          const outward = opts.inward ? [-nx, 0, -ns] : [nx, 0, ns];
          this.face([P(a[0], a[1], h0), P(b[0], b[1], h0), P(b[0], b[1], h1), P(a[0], a[1], h1)], outward);
        }
      }
      const c = opts.center || outline.reduce((s, p) => [s[0] + p[0] / n, s[1] + p[1] / n], [0, 0]);
      if (opts.top !== false) this.face(outline.map((p) => P(p[0], p[1], h1)), [0, 1, 0], P(c[0], c[1], h1));
      if (opts.bottom) this.face(outline.map((p) => P(p[0], p[1], h0)), [0, -1, 0], P(c[0], c[1], h0));
      return this;
    }

    // Axis-aligned box in plan coordinates.
    box(x0, s0, x1, s1, h0, h1, opts) {
      return this.prism([[x0, s0], [x1, s0], [x1, s1], [x0, s1]], h0, h1, Object.assign({ bottom: true }, opts));
    }

    // Box of size w × d centred on (x, s), turned by `ang` degrees.
    boxAt(x, s, w, d, h0, h1, ang = 0) {
      const a = (ang * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a);
      const pts = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]].map(([u, v]) => [x + u * c - v * sn, s + u * sn + v * c]);
      return this.prism(pts, h0, h1, { bottom: true });
    }

    cylinder(x, s, r, h0, h1, seg = 16) {
      const pts = [];
      for (let i = 0; i < seg; i++) { const a = (i / seg) * Math.PI * 2; pts.push([x + Math.cos(a) * r, s + Math.sin(a) * r]); }
      return this.prism(pts, h0, h1, { bottom: true });
    }

    // Sloped quad (roofs): four corners in plan coordinates with heights.
    quad(a, b, c, d) {
      const q = [P(a[0], a[1], a[2]), P(b[0], b[1], b[2]), P(c[0], c[1], c[2]), P(d[0], d[1], d[2])];
      const n = cross(sub(q[1], q[0]), sub(q[2], q[0]));
      const len = Math.hypot(n[0], n[1], n[2]) || 1;
      const nn = [n[0] / len, n[1] / len, n[2] / len];
      // Roof faces point up and outwards.
      this.face(q, nn[1] < 0 ? nn.map((v) => -v) : nn);
      return this;
    }

    tri(a, b, c, normalPlan) {
      this.face([P(a[0], a[1], a[2]), P(b[0], b[1], b[2]), P(c[0], c[1], c[2])], [normalPlan[0], 0, normalPlan[1]]);
      return this;
    }
  }

  // ------------------------------------------------------------------ glb

  function srgbToLinear(hex) {
    const v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => {
      const s = c / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
  }

  /**
   * groups: [{ name, parts: [{ name, mesh, material }] }]
   * materials: { id: { name, color: '#rrggbb', alpha?, roughness?, metallic? } }
   */
  function glb(groups, materials, sceneName) {
    const json = {
      asset: { version: '2.0', generator: 'Il Cartografo Errante' },
      scene: 0, scenes: [{ name: sceneName, nodes: [] }],
      nodes: [], meshes: [], materials: [], accessors: [], bufferViews: [], buffers: [],
    };
    const chunks = [];
    let offset = 0;
    const view = (typed, target) => {
      const bytes = new Uint8Array(typed.buffer, typed.byteOffset, typed.byteLength);
      chunks.push(bytes);
      const pad = (4 - (bytes.length % 4)) % 4;
      if (pad) chunks.push(new Uint8Array(pad));
      json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length, target });
      offset += bytes.length + pad;
      return json.bufferViews.length - 1;
    };
    const matIndex = {};
    const material = (id) => {
      if (id in matIndex) return matIndex[id];
      const m = materials[id];
      const c = srgbToLinear(m.color);
      const mat = {
        name: m.name || id,
        pbrMetallicRoughness: { baseColorFactor: [c[0], c[1], c[2], m.alpha == null ? 1 : m.alpha], metallicFactor: m.metallic || 0, roughnessFactor: m.roughness == null ? 0.85 : m.roughness },
      };
      if (m.alpha != null && m.alpha < 1) mat.alphaMode = 'BLEND';
      if (m.doubleSided) mat.doubleSided = true;
      json.materials.push(mat);
      return (matIndex[id] = json.materials.length - 1);
    };
    for (const g of groups) {
      const children = [];
      for (const part of g.parts) {
        const mesh = part.mesh;
        if (!mesh || mesh.empty) continue;
        const pos = Float32Array.from(mesh.pos), nrm = Float32Array.from(mesh.nrm);
        const count = pos.length / 3;
        const idx = count < 65536 ? Uint16Array.from(mesh.idx) : Uint32Array.from(mesh.idx);
        const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
        for (let i = 0; i < pos.length; i += 3) for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], pos[i + k]); max[k] = Math.max(max[k], pos[i + k]); }
        json.accessors.push({ bufferView: view(pos, 34962), componentType: 5126, count, type: 'VEC3', min, max });
        const pa = json.accessors.length - 1;
        json.accessors.push({ bufferView: view(nrm, 34962), componentType: 5126, count, type: 'VEC3' });
        const na = json.accessors.length - 1;
        json.accessors.push({ bufferView: view(idx, 34963), componentType: idx instanceof Uint16Array ? 5123 : 5125, count: idx.length, type: 'SCALAR' });
        const ia = json.accessors.length - 1;
        json.meshes.push({ name: part.name, primitives: [{ attributes: { POSITION: pa, NORMAL: na }, indices: ia, material: material(part.material) }] });
        json.nodes.push({ name: part.name, mesh: json.meshes.length - 1 });
        children.push(json.nodes.length - 1);
      }
      if (!children.length) continue;
      json.nodes.push({ name: g.name, children, translation: g.offset || undefined });
      json.scenes[0].nodes.push(json.nodes.length - 1);
    }
    json.buffers.push({ byteLength: offset });
    // Pad the UTF-8 bytes, not the characters: names may hold accented letters.
    const raw = new TextEncoder().encode(JSON.stringify(json));
    const jsonBytes = new Uint8Array(Math.ceil(raw.length / 4) * 4).fill(0x20);
    jsonBytes.set(raw);
    const header = new DataView(new ArrayBuffer(12));
    header.setUint32(0, 0x46546c67, true); // glTF
    header.setUint32(4, 2, true);
    header.setUint32(8, 12 + 8 + jsonBytes.length + 8 + offset, true);
    const jh = new DataView(new ArrayBuffer(8));
    jh.setUint32(0, jsonBytes.length, true); jh.setUint32(4, 0x4e4f534a, true); // JSON
    const bh = new DataView(new ArrayBuffer(8));
    bh.setUint32(0, offset, true); bh.setUint32(4, 0x004e4942, true); // BIN
    return new Blob([header.buffer, jh.buffer, jsonBytes, bh.buffer, ...chunks], { type: 'model/gltf-binary' });
  }

  // Unit-cell walls: merge the edges of a set of cells that face outside it
  // into straight runs. Returns [{ x0, s0, x1, s1, nx, ns }] in cell units,
  // where (nx, ns) points away from the cells.
  function boundaryRuns(has, cells) {
    const runs = [];
    const edges = { n: new Map(), s: new Map(), w: new Map(), e: new Map() };
    for (const [x, y] of cells) {
      if (!has(x, y - 1)) push(edges.n, y, x);
      if (!has(x, y + 1)) push(edges.s, y + 1, x);
      if (!has(x - 1, y)) push(edges.w, x, y);
      if (!has(x + 1, y)) push(edges.e, x + 1, y);
    }
    function push(map, line, at) { if (!map.has(line)) map.set(line, []); map.get(line).push(at); }
    for (const side of ['n', 's', 'w', 'e']) {
      for (const [line, list] of edges[side]) {
        list.sort((a, b) => a - b);
        let start = list[0], prev = list[0];
        const flush = () => {
          if (side === 'n' || side === 's') runs.push({ x0: start, s0: line, x1: prev + 1, s1: line, nx: 0, ns: side === 'n' ? -1 : 1 });
          else runs.push({ x0: line, s0: start, x1: line, s1: prev + 1, nx: side === 'w' ? -1 : 1, ns: 0 });
        };
        for (let i = 1; i < list.length; i++) {
          if (list[i] === prev + 1) { prev = list[i]; continue; }
          flush();
          start = prev = list[i];
        }
        flush();
      }
    }
    return runs;
  }

  Carto.Mesh3D = { Mesh, glb, boundaryRuns };
})(window.Carto = window.Carto || {});
