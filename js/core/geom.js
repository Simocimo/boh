/* 2D geometry helpers. Points are plain {x, y} objects; polygons are arrays of points. */
(function (Carto) {
  'use strict';

  const G = {};
  const EPS = 1e-9;

  G.pt = (x, y) => ({ x, y });
  G.add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
  G.sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
  G.scale = (a, s) => ({ x: a.x * s, y: a.y * s });
  G.len = (a) => Math.hypot(a.x, a.y);
  G.dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  G.dist2 = (a, b) => (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
  G.dot = (a, b) => a.x * b.x + a.y * b.y;
  G.cross = (a, b) => a.x * b.y - a.y * b.x;
  G.lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  G.mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  G.perp = (a) => ({ x: -a.y, y: a.x });
  G.angle = (a) => Math.atan2(a.y, a.x);
  G.fromAngle = (ang, r = 1) => ({ x: Math.cos(ang) * r, y: Math.sin(ang) * r });
  G.norm = (a, l = 1) => {
    const d = Math.hypot(a.x, a.y);
    return d < EPS ? { x: 0, y: 0 } : { x: (a.x / d) * l, y: (a.y / d) * l };
  };
  G.rotate = (a, ang) => {
    const c = Math.cos(ang), s = Math.sin(ang);
    return { x: a.x * c - a.y * s, y: a.x * s + a.y * c };
  };
  G.eq = (a, b, eps = 1e-6) => Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps;

  // ---------------------------------------------------------------- polygons

  // Signed area; positive when the vertices run clockwise on screen (y down).
  G.signedArea = (poly) => {
    let s = 0;
    for (let i = 0, n = poly.length; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n];
      s += a.x * b.y - b.x * a.y;
    }
    return s / 2;
  };
  G.area = (poly) => Math.abs(G.signedArea(poly));

  G.centroid = (poly) => {
    let a = 0, cx = 0, cy = 0;
    for (let i = 0, n = poly.length; i < n; i++) {
      const p = poly[i], q = poly[(i + 1) % n];
      const f = p.x * q.y - q.x * p.y;
      a += f; cx += (p.x + q.x) * f; cy += (p.y + q.y) * f;
    }
    if (Math.abs(a) < EPS) return G.average(poly);
    return { x: cx / (3 * a), y: cy / (3 * a) };
  };

  G.average = (pts) => {
    let x = 0, y = 0;
    for (const p of pts) { x += p.x; y += p.y; }
    return { x: x / pts.length, y: y / pts.length };
  };

  G.perimeter = (poly) => {
    let s = 0;
    for (let i = 0, n = poly.length; i < n; i++) s += G.dist(poly[i], poly[(i + 1) % n]);
    return s;
  };

  // 1 for a circle, lower for elongated or ragged shapes.
  G.compactness = (poly) => {
    const p = G.perimeter(poly);
    return p < EPS ? 0 : (4 * Math.PI * G.area(poly)) / (p * p);
  };

  G.bbox = (pts) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of pts) {
      if (p.x < x0) x0 = p.x; if (p.y < y0) y0 = p.y;
      if (p.x > x1) x1 = p.x; if (p.y > y1) y1 = p.y;
    }
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
  };

  G.contains = (poly, p) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a.y > p.y) !== (b.y > p.y) &&
          p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  };

  G.reverse = (poly) => poly.slice().reverse();

  // Make the winding clockwise on screen (positive signed area).
  G.clockwise = (poly) => (G.signedArea(poly) < 0 ? G.reverse(poly) : poly.slice());

  G.longestEdge = (poly) => {
    let best = 0, bi = 0;
    for (let i = 0, n = poly.length; i < n; i++) {
      const d = G.dist2(poly[i], poly[(i + 1) % n]);
      if (d > best) { best = d; bi = i; }
    }
    return bi;
  };

  G.translate = (poly, dx, dy) => poly.map((p) => ({ x: p.x + dx, y: p.y + dy }));

  G.scalePoly = (poly, s, c = G.centroid(poly)) =>
    poly.map((p) => ({ x: c.x + (p.x - c.x) * s, y: c.y + (p.y - c.y) * s }));

  G.rect = (cx, cy, w, h, ang = 0) => {
    const c = Math.cos(ang), s = Math.sin(ang), hw = w / 2, hh = h / 2;
    return [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(([x, y]) => ({
      x: cx + x * c - y * s,
      y: cy + x * s + y * c,
    }));
  };

  G.regular = (cx, cy, r, n, ang = 0) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = ang + (i / n) * Math.PI * 2;
      out.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    return out;
  };

  // Remove consecutive duplicates and nearly collinear points.
  G.clean = (poly, eps = 1e-6) => {
    const out = [];
    for (const p of poly) {
      if (!out.length || !G.eq(out[out.length - 1], p, eps)) out.push(p);
    }
    if (out.length > 1 && G.eq(out[0], out[out.length - 1], eps)) out.pop();
    return out;
  };

  // ---------------------------------------------------------- clipping

  // Keep the part of `poly` on the left of the directed line a->b
  // (left meaning cross(b - a, p - a) >= 0, i.e. clockwise side on screen).
  G.clipHalfPlane = (poly, a, b) => {
    const d = G.sub(b, a);
    const side = (p) => G.cross(d, G.sub(p, a));
    const out = [];
    for (let i = 0, n = poly.length; i < n; i++) {
      const p = poly[i], q = poly[(i + 1) % n];
      const sp = side(p), sq = side(q);
      if (sp >= 0) out.push(p);
      if ((sp >= 0) !== (sq >= 0)) {
        const t = sp / (sp - sq);
        out.push(G.lerp(p, q, t));
      }
    }
    return G.clean(out);
  };

  // Clip a polygon by a convex clipping polygon.
  G.clipConvex = (poly, clip) => {
    let out = poly;
    const cw = G.clockwise(clip);
    for (let i = 0; i < cw.length && out.length >= 3; i++) {
      out = G.clipHalfPlane(out, cw[i], cw[(i + 1) % cw.length]);
    }
    return out;
  };

  // Inset a convex polygon: edge i (poly[i] -> poly[i+1]) moves inward by d[i].
  G.insetConvex = (poly, d) => {
    const cw = G.signedArea(poly) >= 0;
    const P = cw ? poly : G.reverse(poly);
    // When reversed, edge indices shift: original edge i becomes edge n-2-i.
    const n = P.length;
    const dist = typeof d === 'number' ? new Array(n).fill(d)
      : cw ? d : P.map((_, i) => d[(n - 2 - i + n) % n]);
    let out = P;
    for (let i = 0; i < n && out.length >= 3; i++) {
      if (dist[i] <= 0) continue;
      const a = P[i], b = P[(i + 1) % n];
      // Inward normal for a clockwise (screen) polygon is the right-hand perp.
      const nrm = G.norm(G.perp(G.sub(b, a)), dist[i]);
      out = G.clipHalfPlane(out, G.add(a, nrm), G.add(b, nrm));
    }
    return out.length >= 3 ? out : [];
  };

  // Split a convex polygon by the line through p with direction dir.
  // `gap` leaves an empty strip of that width between the halves.
  G.splitConvex = (poly, p, dir, gap = 0) => {
    const nrm = G.norm(G.perp(dir), gap / 2);
    const a1 = G.add(p, nrm), b1 = G.add(a1, dir);
    const a2 = G.sub(p, nrm), b2 = G.add(a2, dir);
    const left = G.clipHalfPlane(poly, a1, b1);
    const right = G.clipHalfPlane(poly, b2, a2);
    return [left, right].filter((q) => q.length >= 3);
  };

  // ------------------------------------------------------ intersections

  // Intersection of segments ab and cd; returns {x, y, t, u} or null.
  G.segmentIntersect = (a, b, c, d) => {
    const r = G.sub(b, a), s = G.sub(d, c);
    const den = G.cross(r, s);
    if (Math.abs(den) < EPS) return null;
    const ca = G.sub(c, a);
    const t = G.cross(ca, s) / den, u = G.cross(ca, r) / den;
    if (t < 0 || t > 1 || u < 0 || u > 1) return null;
    return { x: a.x + r.x * t, y: a.y + r.y * t, t, u };
  };

  G.lineIntersect = (a, b, c, d) => {
    const r = G.sub(b, a), s = G.sub(d, c);
    const den = G.cross(r, s);
    if (Math.abs(den) < EPS) return null;
    const t = G.cross(G.sub(c, a), s) / den;
    return { x: a.x + r.x * t, y: a.y + r.y * t, t };
  };

  // Chord of the infinite line p + t*dir through a convex polygon: [a, b] or null.
  G.lineConvex = (poly, p, dir) => {
    const P = G.signedArea(poly) >= 0 ? poly : G.reverse(poly);
    let tmin = -Infinity, tmax = Infinity;
    for (let i = 0, n = P.length; i < n; i++) {
      const a = P[i], e = G.sub(P[(i + 1) % n], a);
      const num = G.cross(e, G.sub(p, a)), den = G.cross(e, dir);
      if (Math.abs(den) < EPS) { if (num < 0) return null; continue; }
      const tt = -num / den;
      if (den > 0) tmin = Math.max(tmin, tt); else tmax = Math.min(tmax, tt);
    }
    if (!(tmin < tmax) || !isFinite(tmin) || !isFinite(tmax)) return null;
    return [G.add(p, G.scale(dir, tmin)), G.add(p, G.scale(dir, tmax))];
  };

  // Parallel chords across a convex polygon (furrows, planks, hatching).
  G.stripes = (poly, dir, spacing, phase = 0) => {
    const d = G.norm(dir), n = G.perp(d);
    let lo = Infinity, hi = -Infinity;
    for (const p of poly) { const v = G.dot(p, n); lo = Math.min(lo, v); hi = Math.max(hi, v); }
    const out = [];
    for (let v = lo + spacing * (0.5 + phase); v < hi; v += spacing) {
      const seg = G.lineConvex(poly, G.scale(n, v), d);
      if (seg) out.push(seg);
    }
    return out;
  };

  // Oriented frame of a polygon along one of its edges: centre, axes, extents.
  G.frame = (poly, edgeIndex = G.longestEdge(poly)) => {
    const a = poly[edgeIndex], b = poly[(edgeIndex + 1) % poly.length];
    const u = G.norm(G.sub(b, a)), v = G.perp(u);
    let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
    for (const p of poly) {
      const pu = G.dot(p, u), pv = G.dot(p, v);
      u0 = Math.min(u0, pu); u1 = Math.max(u1, pu); v0 = Math.min(v0, pv); v1 = Math.max(v1, pv);
    }
    const c = G.add(G.scale(u, (u0 + u1) / 2), G.scale(v, (v0 + v1) / 2));
    return { c, u, v, w: u1 - u0, h: v1 - v0 };
  };

  G.distToSegment = (p, a, b) => {
    const ab = G.sub(b, a);
    const l2 = G.dot(ab, ab);
    let t = l2 < EPS ? 0 : G.dot(G.sub(p, a), ab) / l2;
    t = Math.max(0, Math.min(1, t));
    return G.dist(p, { x: a.x + ab.x * t, y: a.y + ab.y * t });
  };

  G.distToPolyline = (p, line, closed = false) => {
    let best = Infinity;
    const n = line.length, m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) best = Math.min(best, G.distToSegment(p, line[i], line[(i + 1) % n]));
    return best;
  };

  // Separating-axis overlap test for two convex polygons.
  G.convexOverlap = (A, B, margin = 0) => {
    for (const poly of [A, B]) {
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length];
        const axis = G.norm(G.perp(G.sub(b, a)));
        let minA = Infinity, maxA = -Infinity, minB = Infinity, maxB = -Infinity;
        for (const p of A) { const v = G.dot(p, axis); minA = Math.min(minA, v); maxA = Math.max(maxA, v); }
        for (const p of B) { const v = G.dot(p, axis); minB = Math.min(minB, v); maxB = Math.max(maxB, v); }
        if (maxA + margin < minB || maxB + margin < minA) return false;
      }
    }
    return true;
  };

  // ----------------------------------------------------------- polylines

  G.polylineLength = (pts) => {
    let s = 0;
    for (let i = 1; i < pts.length; i++) s += G.dist(pts[i - 1], pts[i]);
    return s;
  };

  // Point and tangent at distance `d` along a polyline.
  G.along = (pts, d) => {
    for (let i = 1; i < pts.length; i++) {
      const l = G.dist(pts[i - 1], pts[i]);
      if (d <= l || i === pts.length - 1) {
        const t = l < EPS ? 0 : Math.min(1, d / l);
        return { p: G.lerp(pts[i - 1], pts[i], t), dir: G.norm(G.sub(pts[i], pts[i - 1])) };
      }
      d -= l;
    }
    return { p: pts[0], dir: { x: 1, y: 0 } };
  };

  // Evenly spaced points along a polyline (or closed ring).
  G.resample = (pts, step, closed = false) => {
    const src = closed ? pts.concat([pts[0]]) : pts;
    const total = G.polylineLength(src);
    const n = Math.max(closed ? 3 : 2, Math.round(total / step));
    const out = [];
    const count = closed ? n : n + 1;
    for (let i = 0; i < count; i++) out.push(G.along(src, (total * i) / n).p);
    return out;
  };

  // Chaikin corner cutting.
  G.chaikin = (pts, iterations = 2, closed = false) => {
    let cur = pts;
    for (let it = 0; it < iterations; it++) {
      const out = [];
      const n = cur.length;
      if (!closed) out.push(cur[0]);
      const m = closed ? n : n - 1;
      for (let i = 0; i < m; i++) {
        const a = cur[i], b = cur[(i + 1) % n];
        out.push(G.lerp(a, b, 0.25), G.lerp(a, b, 0.75));
      }
      if (!closed) out.push(cur[n - 1]);
      cur = out;
    }
    return cur;
  };

  // Shift a polyline sideways by d (positive = right-hand side on screen).
  G.offsetPolyline = (pts, d) => {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const prev = pts[Math.max(0, i - 1)], next = pts[Math.min(pts.length - 1, i + 1)];
      const n = G.norm(G.perp(G.sub(next, prev)), d);
      out.push({ x: pts[i].x + n.x, y: pts[i].y + n.y });
    }
    return out;
  };

  // Displace the interior of a polyline with noise, for a hand-drawn feel.
  G.wobble = (pts, noise, amp, freq = 0.05, closed = false) =>
    pts.map((p, i) => {
      if (!closed && (i === 0 || i === pts.length - 1)) return p;
      return {
        x: p.x + noise.get(p.x * freq, p.y * freq) * amp,
        y: p.y + noise.get(p.x * freq + 71.3, p.y * freq - 33.1) * amp,
      };
    });

  // ----------------------------------------------------------- sampling

  // Bridson Poisson-disc sampling inside [x0, x0+w] x [y0, y0+h].
  G.poissonDisc = (rng, x0, y0, w, h, r, accept = null, k = 20) => {
    const cell = r / Math.SQRT2;
    const gw = Math.ceil(w / cell), gh = Math.ceil(h / cell);
    const grid = new Int32Array(gw * gh).fill(-1);
    const pts = [], active = [];
    const put = (p) => {
      const gi = Math.floor((p.x - x0) / cell) + Math.floor((p.y - y0) / cell) * gw;
      grid[gi] = pts.length;
      pts.push(p);
      active.push(p);
    };
    const fits = (p) => {
      if (p.x < x0 || p.y < y0 || p.x >= x0 + w || p.y >= y0 + h) return false;
      const gx = Math.floor((p.x - x0) / cell), gy = Math.floor((p.y - y0) / cell);
      for (let y = Math.max(0, gy - 2); y <= Math.min(gh - 1, gy + 2); y++) {
        for (let x = Math.max(0, gx - 2); x <= Math.min(gw - 1, gx + 2); x++) {
          const i = grid[x + y * gw];
          if (i >= 0 && G.dist2(pts[i], p) < r * r) return false;
        }
      }
      return true;
    };
    let tries = 0;
    while (!pts.length && tries++ < 50) {
      const p = { x: x0 + rng.next() * w, y: y0 + rng.next() * h };
      if (!accept || accept(p)) put(p);
    }
    while (active.length) {
      const ai = Math.floor(rng.next() * active.length);
      const base = active[ai];
      let found = false;
      for (let i = 0; i < k; i++) {
        const ang = rng.next() * Math.PI * 2, rr = r * (1 + rng.next());
        const p = { x: base.x + Math.cos(ang) * rr, y: base.y + Math.sin(ang) * rr };
        if (fits(p) && (!accept || accept(p))) { put(p); found = true; break; }
      }
      if (!found) active.splice(ai, 1);
    }
    return pts;
  };

  Carto.G = G;
})(window.Carto = window.Carto || {});
