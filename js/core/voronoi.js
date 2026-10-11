/* Delaunay triangulation (Bowyer-Watson) and the dual Voronoi diagram.
   Cells share vertex objects, so neighbouring cells agree exactly on their
   common edges: walls, streets and rivers can then follow those edges. */
(function (Carto) {
  'use strict';

  function circumcircle(ax, ay, bx, by, cx, cy) {
    const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
    if (Math.abs(d) < 1e-12) return null;
    const a2 = ax * ax + ay * ay, b2 = bx * bx + by * by, c2 = cx * cx + cy * cy;
    const x = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d;
    const y = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d;
    return { x, y, r2: (ax - x) * (ax - x) + (ay - y) * (ay - y) };
  }

  // Returns triangles as index triples into `points` (super-triangle removed
  // later by the caller through `isSuper`).
  function triangulate(points) {
    const n = points.length;
    const bb = Carto.G.bbox(points);
    const size = Math.max(bb.w, bb.h) * 20 + 10;
    const mx = (bb.x0 + bb.x1) / 2, my = (bb.y0 + bb.y1) / 2;
    const P = points.map((p) => ({ x: p.x, y: p.y }));
    P.push({ x: mx - size, y: my - size }, { x: mx + size, y: my - size }, { x: mx, y: my + size });
    const make = (a, b, c) => {
      const cc = circumcircle(P[a].x, P[a].y, P[b].x, P[b].y, P[c].x, P[c].y);
      return cc ? { a, b, c, x: cc.x, y: cc.y, r2: cc.r2 } : null;
    };
    let tris = [make(n, n + 1, n + 2)];
    for (let i = 0; i < n; i++) {
      const p = P[i];
      const edges = [];
      const keep = [];
      for (const t of tris) {
        const dx = p.x - t.x, dy = p.y - t.y;
        if (dx * dx + dy * dy < t.r2 * (1 + 1e-10)) {
          edges.push([t.a, t.b], [t.b, t.c], [t.c, t.a]);
        } else keep.push(t);
      }
      // Boundary of the cavity: edges appearing exactly once.
      const count = new Map();
      for (const [u, v] of edges) {
        const k = u < v ? u + ',' + v : v + ',' + u;
        count.set(k, (count.get(k) || 0) + 1);
      }
      for (const [u, v] of edges) {
        const k = u < v ? u + ',' + v : v + ',' + u;
        if (count.get(k) === 1) {
          const t = make(u, v, i);
          if (t) keep.push(t);
        }
      }
      tris = keep;
    }
    return { tris, n };
  }

  /**
   * Build a Voronoi diagram.
   * Returns { cells, vertices } where each cell = { index, site, verts (vertex
   * objects, clockwise on screen), neighbors (cell indices), open (bool) }.
   */
  function voronoi(points) {
    const { tris, n } = triangulate(points);
    const vertices = [];
    const cells = points.map((site, index) => ({ index, site, tris: [], neighbors: new Set(), open: false }));
    for (const t of tris) {
      const sup = t.a >= n || t.b >= n || t.c >= n;
      const v = { x: t.x, y: t.y, cells: [] };
      if (!sup) vertices.push(v);
      for (const k of [t.a, t.b, t.c]) {
        if (k >= n) continue;
        const cell = cells[k];
        if (sup) cell.open = true;
        else { cell.tris.push(v); v.cells.push(k); }
      }
      const idx = [t.a, t.b, t.c];
      for (let i = 0; i < 3; i++) {
        const u = idx[i], w = idx[(i + 1) % 3];
        if (u < n && w < n) { cells[u].neighbors.add(w); cells[w].neighbors.add(u); }
      }
    }
    for (const cell of cells) {
      const s = cell.site;
      cell.tris.sort((p, q) => Math.atan2(p.y - s.y, p.x - s.x) - Math.atan2(q.y - s.y, q.x - s.x));
      cell.verts = cell.tris;
      delete cell.tris;
      cell.neighbors = Array.from(cell.neighbors);
    }
    return { cells, vertices };
  }

  // Lloyd relaxation: move each selected site to its cell centroid.
  function relax(points, iterations, select) {
    let pts = points;
    for (let it = 0; it < iterations; it++) {
      const { cells } = voronoi(pts);
      pts = pts.map((p, i) => {
        const c = cells[i];
        if (c.open || c.verts.length < 3 || (select && !select(p, i))) return p;
        return Carto.G.centroid(c.verts);
      });
    }
    return pts;
  }

  Carto.Voronoi = { triangulate, voronoi, relax, circumcircle };
})(window.Carto = window.Carto || {});
