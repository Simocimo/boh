/* Tiny SVG string builder. Maps are built as strings so generation and
   rendering stay pure (they also run under Node for the smoke tests). */
(function (Carto) {
  'use strict';

  const f = (n) => {
    const r = Math.round(n * 10) / 10;
    return Object.is(r, -0) ? '0' : String(r);
  };

  const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const attrs = (a) => {
    if (!a) return '';
    let s = '';
    for (const k in a) {
      const v = a[k];
      if (v === undefined || v === null || v === false) continue;
      const name = k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
      s += ' ' + name + '="' + (typeof v === 'number' ? f(v) : esc(v)) + '"';
    }
    return s;
  };

  // Straight-segment path data.
  const d = (pts, closed = true) => {
    if (!pts.length) return '';
    let s = 'M' + f(pts[0].x) + ' ' + f(pts[0].y);
    for (let i = 1; i < pts.length; i++) s += 'L' + f(pts[i].x) + ' ' + f(pts[i].y);
    return closed ? s + 'Z' : s;
  };

  // Smooth Catmull-Rom curve through the points, as cubic Beziers.
  const smooth = (pts, closed = true, tension = 0.5) => {
    const n = pts.length;
    if (n < 3) return d(pts, closed);
    const get = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let s = 'M' + f(pts[0].x) + ' ' + f(pts[0].y);
    const m = closed ? n : n - 1;
    const k = tension / 3;
    for (let i = 0; i < m; i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      const c1x = p1.x + (p2.x - p0.x) * k, c1y = p1.y + (p2.y - p0.y) * k;
      const c2x = p2.x - (p3.x - p1.x) * k, c2y = p2.y - (p3.y - p1.y) * k;
      s += 'C' + f(c1x) + ' ' + f(c1y) + ' ' + f(c2x) + ' ' + f(c2y) + ' ' + f(p2.x) + ' ' + f(p2.y);
    }
    return closed ? s + 'Z' : s;
  };

  const circle = (x, y, r) =>
    'M' + f(x - r) + ' ' + f(y) + 'a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(2 * r) + ' 0' +
    'a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(-2 * r) + ' 0Z';

  const line = (a, b) => 'M' + f(a.x) + ' ' + f(a.y) + 'L' + f(b.x) + ' ' + f(b.y);

  class Svg {
    constructor(width, height, opts = {}) {
      this.width = width;
      this.height = height;
      this.opts = opts;
      this.parts = [];
      this.defsParts = [];
    }
    defs(s) { this.defsParts.push(s); return this; }
    raw(s) { this.parts.push(s); return this; }
    open(a) { this.parts.push('<g' + attrs(a) + '>'); return this; }
    close() { this.parts.push('</g>'); return this; }
    path(pathData, a) {
      if (pathData) this.parts.push('<path d="' + pathData + '"' + attrs(a) + '/>');
      return this;
    }
    poly(pts, a, closed = true) { return this.path(d(pts, closed), a); }
    rect(x, y, w, h, a) {
      this.parts.push('<rect' + attrs(Object.assign({ x, y, width: w, height: h }, a)) + '/>');
      return this;
    }
    circle(x, y, r, a) {
      this.parts.push('<circle' + attrs(Object.assign({ cx: x, cy: y, r }, a)) + '/>');
      return this;
    }
    text(x, y, str, a) {
      this.parts.push('<text' + attrs(Object.assign({ x, y }, a)) + '>' + esc(str) + '</text>');
      return this;
    }
    // Text along a path id defined in defs.
    textPath(id, str, a, ta) {
      this.parts.push('<text' + attrs(a) + '><textPath href="#' + id + '"' + attrs(ta) + '>' + esc(str) + '</textPath></text>');
      return this;
    }
    toString() {
      const o = this.opts;
      const head = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + f(this.width) + ' ' + f(this.height) +
        '" width="' + f(this.width) + '" height="' + f(this.height) + '"' + (o.cls ? ' class="' + o.cls + '"' : '') + '>';
      const defs = this.defsParts.length ? '<defs>' + this.defsParts.join('') + '</defs>' : '';
      return head + defs + this.parts.join('') + '</svg>';
    }
  }

  // Accumulates many sub-paths drawn with one style into one <path>,
  // which keeps the DOM small and panning fast.
  class Batch {
    constructor() { this.s = []; }
    add(pathData) { if (pathData) this.s.push(pathData); return this; }
    poly(pts, closed = true) { return this.add(d(pts, closed)); }
    smooth(pts, closed = true, t) { return this.add(smooth(pts, closed, t)); }
    circle(x, y, r) { return this.add(circle(x, y, r)); }
    line(a, b) { return this.add(line(a, b)); }
    get empty() { return this.s.length === 0; }
    toString() { return this.s.join(''); }
  }

  let uidCounter = 0;
  // Ids must be unique across the page: several maps can be in the DOM at once.
  Carto.uid = (prefix) => prefix + '-' + (++uidCounter).toString(36);

  Carto.Svg = Svg;
  Carto.Svg.Batch = Batch;
  Carto.Svg.d = d;
  Carto.Svg.smooth = smooth;
  Carto.Svg.circle = circle;
  Carto.Svg.line = line;
  Carto.Svg.esc = esc;
  Carto.Svg.num = f;
})(window.Carto = window.Carto || {});
