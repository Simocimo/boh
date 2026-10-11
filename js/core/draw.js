/* Drawing helpers shared by the generators: lettering, compass, scale bar,
   trees, hatching and irregular blobs. */
(function (Carto) {
  'use strict';

  const G = Carto.G, Svg = Carto.Svg;
  const FONT_TITLE = "'Carto Fell SC', 'IM Fell English SC', Georgia, serif";
  const FONT_LABEL = "'Carto Fell', 'IM Fell English', Georgia, serif";

  const Draw = {
    FONT_TITLE,
    FONT_LABEL,

    // Text with a halo in the paper colour so it stays readable over lines.
    label(svg, x, y, text, size, pal, o = {}) {
      svg.text(x, y, text, {
        fontFamily: o.title ? FONT_TITLE : FONT_LABEL,
        fontSize: size,
        fontStyle: o.italic ? 'italic' : null,
        textAnchor: o.anchor || 'middle',
        dominantBaseline: o.baseline || 'middle',
        letterSpacing: o.spacing || null,
        fill: o.color || pal.label,
        stroke: o.halo === false ? null : (o.haloColor || pal.paper),
        strokeWidth: o.halo === false ? null : size * (o.haloWidth || 0.28),
        strokeLinejoin: 'round',
        paintOrder: 'stroke',
        opacity: o.opacity || null,
        transform: o.rotate ? 'rotate(' + Svg.num(o.rotate) + ' ' + Svg.num(x) + ' ' + Svg.num(y) + ')' : null,
      });
    },

    // Approximate text extent, good enough to keep labels apart.
    textBox(x, y, text, size, o = {}) {
      const w = String(text).length * size * (o.title ? 0.62 : 0.47);
      const h = size * 1.05;
      const ax = o.anchor === 'start' ? 0 : o.anchor === 'end' ? 1 : 0.5;
      return { x0: x - w * ax, x1: x - w * ax + w, y0: y - h / 2, y1: y + h / 2 };
    },

    overlaps(a, b, pad = 0) {
      return a.x0 - pad < b.x1 && b.x0 - pad < a.x1 && a.y0 - pad < b.y1 && b.y0 - pad < a.y1;
    },

    /* Place labels without collisions. Each label: {x, y, text, size, italic,
       title, offsets?}. `taken` holds boxes already occupied (titles, icons). */
    placeLabels(svg, labels, pal, taken = [], bounds = null) {
      const placed = [];
      for (const l of labels) {
        const offs = l.offsets || [[0, 0], [0, -1.3], [0, 1.3], [1, 0], [-1, 0]];
        for (const [ox, oy] of offs) {
          const anchor = ox > 0 ? 'start' : ox < 0 ? 'end' : 'middle';
          const x = l.x + ox * (l.gap || l.size * 0.6), y = l.y + oy * l.size;
          const box = Draw.textBox(x, y, l.text, l.size, { title: l.title, anchor });
          if (bounds && (box.x0 < bounds.x0 || box.x1 > bounds.x1 || box.y0 < bounds.y0 || box.y1 > bounds.y1)) continue;
          if (taken.some((b) => Draw.overlaps(b, box, l.size * 0.15))) continue;
          taken.push(box);
          placed.push(l);
          Draw.label(svg, x, y, l.text, l.size, pal, { italic: l.italic, title: l.title, anchor, color: l.color, spacing: l.spacing });
          break;
        }
      }
      return placed;
    },

    // Map title on a ribbon-less cartouche: name plus optional subtitle.
    title(svg, x, y, text, size, pal, sub) {
      Draw.label(svg, x, y, text, size, pal, { title: true, spacing: size * 0.04, haloWidth: 0.35 });
      if (sub) Draw.label(svg, x, y + size * 0.85, sub, size * 0.42, pal, { italic: true, haloWidth: 0.4 });
    },

    compass(svg, x, y, r, pal) {
      const b = new Svg.Batch(), dark = new Svg.Batch();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2 - Math.PI / 2;
        const tip = G.add({ x, y }, G.fromAngle(a, r));
        const l = G.add({ x, y }, G.fromAngle(a - Math.PI / 4, r * 0.2));
        const rr = G.add({ x, y }, G.fromAngle(a + Math.PI / 4, r * 0.2));
        b.poly([{ x, y }, l, tip]);
        dark.poly([{ x, y }, tip, rr]);
        const st = G.add({ x, y }, G.fromAngle(a + Math.PI / 4, r * 0.55));
        const sl = G.add({ x, y }, G.fromAngle(a + Math.PI / 4 - 0.35, r * 0.13));
        const sr = G.add({ x, y }, G.fromAngle(a + Math.PI / 4 + 0.35, r * 0.13));
        b.poly([{ x, y }, sl, st, sr]);
      }
      svg.circle(x, y, r * 0.72, { fill: 'none', stroke: pal.ink, strokeWidth: r * 0.025 });
      svg.circle(x, y, r * 0.66, { fill: 'none', stroke: pal.ink, strokeWidth: r * 0.012 });
      svg.path(b.toString(), { fill: pal.paper, stroke: pal.ink, strokeWidth: r * 0.03, strokeLinejoin: 'round' });
      svg.path(dark.toString(), { fill: pal.ink, stroke: pal.ink, strokeWidth: r * 0.03, strokeLinejoin: 'round' });
      Draw.label(svg, x, y - r - r * 0.32, 'N', r * 0.42, pal, { title: true });
    },

    // Scale bar: `units` map units correspond to `value` real units (e.g. 100 m).
    scaleBar(svg, x, y, units, value, unitLabel, pal, ticks = 4) {
      const h = Math.max(2, units * 0.035);
      const seg = units / ticks;
      for (let i = 0; i < ticks; i++) {
        svg.rect(x + i * seg, y, seg, h, {
          fill: i % 2 ? pal.paper : pal.ink,
          stroke: pal.ink,
          strokeWidth: h * 0.25,
        });
      }
      const fs = Math.max(7, h * 3.2);
      Draw.label(svg, x, y + h + fs * 0.75, '0', fs, pal, {});
      Draw.label(svg, x + units, y + h + fs * 0.75, value + ' ' + unitLabel, fs, pal, { anchor: 'middle' });
    },

    // Irregular closed outline around a centre.
    blob(rng, cx, cy, r, n = 9, jag = 0.25) {
      const pts = [];
      const off = rng.float(0, Math.PI * 2);
      for (let i = 0; i < n; i++) {
        const a = off + (i / n) * Math.PI * 2;
        const rr = r * (1 - jag / 2 + rng.next() * jag);
        pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
      }
      return pts;
    },

    // Tree crown: a lumpy circle, drawn later with Batch.smooth.
    crown(rng, x, y, r) {
      return Draw.blob(rng, x, y, r, rng.int(6, 8), 0.3);
    },

    // A short cluster of parallel strokes, the cartographer's hatching.
    hatchCluster(batch, rng, x, y, size, ang, lines = 3) {
      const dir = G.fromAngle(ang, 1), nrm = G.perp(dir);
      const gap = size / (lines + 0.5);
      for (let i = 0; i < lines; i++) {
        const o = (i - (lines - 1) / 2) * gap;
        const len = size * (0.55 + rng.next() * 0.45) / 2;
        const c = { x: x + nrm.x * o + dir.x * rng.float(-0.1, 0.1) * size, y: y + nrm.y * o + dir.y * rng.float(-0.1, 0.1) * size };
        batch.line(G.add(c, G.scale(dir, -len)), G.add(c, G.scale(dir, len)));
      }
    },

    // Double frame around the whole sheet.
    frame(svg, w, h, pal, m) {
      svg.rect(m, m, w - 2 * m, h - 2 * m, { fill: 'none', stroke: pal.ink, strokeWidth: m * 0.12 });
      svg.rect(m * 1.35, m * 1.35, w - 2.7 * m, h - 2.7 * m, { fill: 'none', stroke: pal.ink, strokeWidth: m * 0.04 });
    },

    // Wrap text into lines no longer than `max` characters.
    wrap(text, max) {
      const words = String(text).split(/\s+/);
      const lines = [];
      let cur = '';
      for (const w of words) {
        if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; }
        else cur = cur ? cur + ' ' + w : w;
      }
      if (cur) lines.push(cur);
      return lines;
    },
  };

  Carto.Draw = Draw;
})(window.Carto = window.Carto || {});
