/* Fast Delaunay triangulation (sweep-hull with edge flips), O(n log n).
   Follows the approach of the Delaunator library (ISC, Mapbox).
   Output: triangles (point index triples) and halfedges (opposite edge or -1). */
(function (Carto) {
  'use strict';

  const EPSILON = Math.pow(2, -52);
  const EDGE_STACK = new Uint32Array(1024);

  function orient(rx, ry, qx, qy, px, py) {
    return (rx - px) * (qy - py) - (ry - py) * (qx - px) > 0;
  }
  function inCircle(ax, ay, bx, by, cx, cy, px, py) {
    const dx = ax - px, dy = ay - py, ex = bx - px, ey = by - py, fx = cx - px, fy = cy - py;
    const ap = dx * dx + dy * dy, bp = ex * ex + ey * ey, cp = fx * fx + fy * fy;
    return dx * (ey * cp - bp * fy) - dy * (ex * cp - bp * fx) + ap * (ex * fy - ey * fx) < 0;
  }
  function circum(ax, ay, bx, by, cx, cy) {
    const dx = bx - ax, dy = by - ay, ex = cx - ax, ey = cy - ay;
    const bl = dx * dx + dy * dy, cl = ex * ex + ey * ey;
    const d = 0.5 / (dx * ey - dy * ex);
    const x = (ey * bl - dy * cl) * d, y = (dx * cl - ex * bl) * d;
    return { x, y, r2: x * x + y * y };
  }
  function pseudoAngle(dx, dy) {
    const p = dx / (Math.abs(dx) + Math.abs(dy));
    return (dy > 0 ? 3 - p : 1 + p) / 4;
  }
  const dist2 = (ax, ay, bx, by) => (ax - bx) * (ax - bx) + (ay - by) * (ay - by);

  class Delaunator {
    // coords: flat array [x0, y0, x1, y1, ...]
    constructor(coords) {
      const n = coords.length >> 1;
      this.coords = coords;
      const maxTriangles = Math.max(2 * n - 5, 0);
      this._triangles = new Uint32Array(maxTriangles * 3);
      this._halfedges = new Int32Array(maxTriangles * 3);
      this._hashSize = Math.ceil(Math.sqrt(n));
      this._hullPrev = new Uint32Array(n);
      this._hullNext = new Uint32Array(n);
      this._hullTri = new Uint32Array(n);
      this._hullHash = new Int32Array(this._hashSize).fill(-1);
      this._build();
    }

    _build() {
      const coords = this.coords, hullPrev = this._hullPrev, hullNext = this._hullNext, hullTri = this._hullTri, hullHash = this._hullHash;
      const n = coords.length >> 1;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let i = 0; i < n; i++) {
        const x = coords[2 * i], y = coords[2 * i + 1];
        if (x < minX) minX = x; if (y < minY) minY = y;
        if (x > maxX) maxX = x; if (y > maxY) maxY = y;
      }
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
      let i0 = 0, i1 = 0, i2 = 0;
      let best = Infinity;
      for (let i = 0; i < n; i++) {
        const d = dist2(cx, cy, coords[2 * i], coords[2 * i + 1]);
        if (d < best) { i0 = i; best = d; }
      }
      const i0x = coords[2 * i0], i0y = coords[2 * i0 + 1];
      best = Infinity;
      for (let i = 0; i < n; i++) {
        if (i === i0) continue;
        const d = dist2(i0x, i0y, coords[2 * i], coords[2 * i + 1]);
        if (d < best && d > 0) { i1 = i; best = d; }
      }
      let i1x = coords[2 * i1], i1y = coords[2 * i1 + 1];
      let minRadius = Infinity;
      for (let i = 0; i < n; i++) {
        if (i === i0 || i === i1) continue;
        const r = circum(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]).r2;
        if (r < minRadius) { i2 = i; minRadius = r; }
      }
      let i2x = coords[2 * i2], i2y = coords[2 * i2 + 1];
      if (minRadius === Infinity) throw new Error('Delaunator: all points are collinear');
      if (orient(i0x, i0y, i1x, i1y, i2x, i2y)) {
        const i = i1, x = i1x, y = i1y;
        i1 = i2; i1x = i2x; i1y = i2y;
        i2 = i; i2x = x; i2y = y;
      }
      const c = circum(i0x, i0y, i1x, i1y, i2x, i2y);
      this._cx = i0x + c.x;
      this._cy = i0y + c.y;
      const dists = new Float64Array(n);
      for (let i = 0; i < n; i++) dists[i] = dist2(coords[2 * i], coords[2 * i + 1], this._cx, this._cy);
      const ids = Array.from({ length: n }, (_, i) => i).sort((a, b) => dists[a] - dists[b]);

      this._hullStart = i0;
      let hullSize = 3;
      hullNext[i0] = hullPrev[i2] = i1;
      hullNext[i1] = hullPrev[i0] = i2;
      hullNext[i2] = hullPrev[i1] = i0;
      hullTri[i0] = 0; hullTri[i1] = 1; hullTri[i2] = 2;
      hullHash.fill(-1);
      hullHash[this._hashKey(i0x, i0y)] = i0;
      hullHash[this._hashKey(i1x, i1y)] = i1;
      hullHash[this._hashKey(i2x, i2y)] = i2;
      this.trianglesLen = 0;
      this._addTriangle(i0, i1, i2, -1, -1, -1);

      let xp = 0, yp = 0;
      for (let k = 0; k < ids.length; k++) {
        const i = ids[k];
        const x = coords[2 * i], y = coords[2 * i + 1];
        if (k > 0 && Math.abs(x - xp) <= EPSILON && Math.abs(y - yp) <= EPSILON) continue;
        xp = x; yp = y;
        if (i === i0 || i === i1 || i === i2) continue;
        // A visible edge on the hull, found through the angular hash.
        let start = 0;
        for (let j = 0, key = this._hashKey(x, y); j < this._hashSize; j++) {
          start = hullHash[(key + j) % this._hashSize];
          if (start !== -1 && start !== hullNext[start]) break;
        }
        start = hullPrev[start];
        let e = start, q;
        while ((q = hullNext[e]), !orient(x, y, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1])) {
          e = q;
          if (e === start) { e = -1; break; }
        }
        if (e === -1) continue;
        let t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]);
        hullTri[i] = this._legalize(t + 2);
        hullTri[e] = t;
        hullSize++;
        let nn = hullNext[e];
        while ((q = hullNext[nn]), orient(x, y, coords[2 * nn], coords[2 * nn + 1], coords[2 * q], coords[2 * q + 1])) {
          t = this._addTriangle(nn, i, q, hullTri[i], -1, hullTri[nn]);
          hullTri[i] = this._legalize(t + 2);
          hullNext[nn] = nn;
          hullSize--;
          nn = q;
        }
        if (e === start) {
          while ((q = hullPrev[e]), orient(x, y, coords[2 * q], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1])) {
            t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]);
            this._legalize(t + 2);
            hullTri[q] = t;
            hullNext[e] = e;
            hullSize--;
            e = q;
          }
        }
        this._hullStart = hullPrev[i] = e;
        hullNext[e] = hullPrev[nn] = i;
        hullNext[i] = nn;
        hullHash[this._hashKey(x, y)] = i;
        hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
      }
      this.hull = new Uint32Array(hullSize);
      for (let i = 0, e = this._hullStart; i < hullSize; i++) { this.hull[i] = e; e = hullNext[e]; }
      this.triangles = this._triangles.subarray(0, this.trianglesLen);
      this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
    }

    _hashKey(x, y) {
      return Math.floor(pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
    }

    _legalize(a) {
      const triangles = this._triangles, halfedges = this._halfedges, coords = this.coords;
      let i = 0, ar = 0;
      for (;;) {
        const b = halfedges[a];
        const a0 = a - (a % 3);
        ar = a0 + ((a + 2) % 3);
        if (b === -1) {
          if (i === 0) break;
          a = EDGE_STACK[--i];
          continue;
        }
        const b0 = b - (b % 3);
        const al = a0 + ((a + 1) % 3);
        const bl = b0 + ((b + 2) % 3);
        const p0 = triangles[ar], pr = triangles[a], pl = triangles[al], p1 = triangles[bl];
        const illegal = inCircle(coords[2 * p0], coords[2 * p0 + 1], coords[2 * pr], coords[2 * pr + 1],
          coords[2 * pl], coords[2 * pl + 1], coords[2 * p1], coords[2 * p1 + 1]);
        if (illegal) {
          triangles[a] = p1;
          triangles[b] = p0;
          const hbl = halfedges[bl];
          if (hbl === -1) {
            let e = this._hullStart;
            do {
              if (this._hullTri[e] === bl) { this._hullTri[e] = a; break; }
              e = this._hullPrev[e];
            } while (e !== this._hullStart);
          }
          this._link(a, hbl);
          this._link(b, halfedges[ar]);
          this._link(ar, bl);
          const br = b0 + ((b + 1) % 3);
          if (i < EDGE_STACK.length) EDGE_STACK[i++] = br;
        } else {
          if (i === 0) break;
          a = EDGE_STACK[--i];
        }
      }
      return ar;
    }

    _link(a, b) {
      this._halfedges[a] = b;
      if (b !== -1) this._halfedges[b] = a;
    }

    _addTriangle(i0, i1, i2, a, b, c) {
      const t = this.trianglesLen;
      this._triangles[t] = i0;
      this._triangles[t + 1] = i1;
      this._triangles[t + 2] = i2;
      this._link(t, a);
      this._link(t + 1, b);
      this._link(t + 2, c);
      this.trianglesLen += 3;
      return t;
    }
  }

  Delaunator.nextHalfedge = (e) => (e % 3 === 2 ? e - 2 : e + 1);
  Delaunator.prevHalfedge = (e) => (e % 3 === 0 ? e + 2 : e - 1);

  Carto.Delaunator = Delaunator;
})(window.Carto = window.Carto || {});
