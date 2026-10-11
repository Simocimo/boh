/* Marching squares: iso-lines of a scalar grid, linked into polylines. */
(function (Carto) {
  'use strict';

  /**
   * grid: Float32Array (w*h), values sampled at points (x*cell + ox, y*cell + oy).
   * Returns [{ points, closed }]. Cells outside the grid count as "below",
   * so every region above `level` yields a closed ring.
   */
  function trace(grid, w, h, level, cell = 1, ox = 0, oy = 0) {
    const W = w + 2, H = h + 2;
    const val = (x, y) => (x <= 0 || y <= 0 || x > w || y > h ? -Infinity : grid[(x - 1) + (y - 1) * w]);
    const pos = (x, y) => ({ x: (x - 1) * cell + ox, y: (y - 1) * cell + oy });
    // Edge ids: 2*(x + y*W) for horizontal edge (x,y)-(x+1,y), +1 for vertical (x,y)-(x,y+1).
    const edgePoint = (id) => {
      const k = id >> 1, x = k % W, y = (k - x) / W;
      const x2 = id & 1 ? x : x + 1, y2 = id & 1 ? y + 1 : y;
      const a = val(x, y), b = val(x2, y2);
      let t;
      if (a === -Infinity) t = b === -Infinity ? 0.5 : 0.999;
      else if (b === -Infinity) t = 0.001;
      else t = (level - a) / (b - a);
      t = Math.max(0, Math.min(1, t));
      const p = pos(x, y), q = pos(x2, y2);
      return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t };
    };
    const segs = [];
    for (let y = 0; y < H - 1; y++) {
      for (let x = 0; x < W - 1; x++) {
        const a = val(x, y) >= level ? 1 : 0;
        const b = val(x + 1, y) >= level ? 1 : 0;
        const c = val(x + 1, y + 1) >= level ? 1 : 0;
        const d = val(x, y + 1) >= level ? 1 : 0;
        const code = a | (b << 1) | (c << 2) | (d << 3);
        if (code === 0 || code === 15) continue;
        const top = 2 * (x + y * W), bottom = 2 * (x + (y + 1) * W);
        const left = 2 * (x + y * W) + 1, right = 2 * (x + 1 + y * W) + 1;
        switch (code) {
          case 1: case 14: segs.push([left, top]); break;
          case 2: case 13: segs.push([top, right]); break;
          case 3: case 12: segs.push([left, right]); break;
          case 4: case 11: segs.push([right, bottom]); break;
          case 6: case 9: segs.push([top, bottom]); break;
          case 7: case 8: segs.push([left, bottom]); break;
          case 5: case 10: {
            const center = (val(x, y) + val(x + 1, y) + val(x + 1, y + 1) + val(x, y + 1)) / 4;
            const joined = (center >= level) === (code === 5);
            if (joined) { segs.push([left, bottom], [top, right]); }
            else { segs.push([left, top], [right, bottom]); }
            break;
          }
        }
      }
    }
    // Link segments sharing edge ids.
    const byEdge = new Map();
    segs.forEach((s, i) => {
      for (const e of s) {
        if (!byEdge.has(e)) byEdge.set(e, []);
        byEdge.get(e).push(i);
      }
    });
    const used = new Uint8Array(segs.length);
    const lines = [];
    for (let i = 0; i < segs.length; i++) {
      if (used[i]) continue;
      used[i] = 1;
      const chain = [segs[i][0], segs[i][1]];
      // extend forward
      for (let dir = 0; dir < 2; dir++) {
        for (;;) {
          const end = dir === 0 ? chain[chain.length - 1] : chain[0];
          const next = (byEdge.get(end) || []).find((j) => !used[j]);
          if (next === undefined) break;
          used[next] = 1;
          const s = segs[next];
          const other = s[0] === end ? s[1] : s[0];
          if (dir === 0) chain.push(other); else chain.unshift(other);
        }
      }
      const closed = chain.length > 3 && chain[0] === chain[chain.length - 1];
      if (closed) chain.pop();
      lines.push({ points: chain.map(edgePoint), closed });
    }
    return lines;
  }

  // Box blur of a scalar grid (in place copy returned).
  function blur(grid, w, h, radius = 1, passes = 1) {
    let src = Float32Array.from(grid);
    let dst = new Float32Array(w * h);
    for (let p = 0; p < passes; p++) {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let s = 0, c = 0;
          for (let dy = -radius; dy <= radius; dy++) {
            const yy = y + dy;
            if (yy < 0 || yy >= h) continue;
            for (let dx = -radius; dx <= radius; dx++) {
              const xx = x + dx;
              if (xx < 0 || xx >= w) continue;
              s += src[xx + yy * w]; c++;
            }
          }
          dst[x + y * w] = s / c;
        }
      }
      const t = src; src = dst; dst = t;
    }
    return src;
  }

  // Chamfer distance (in cells) from cells where mask is truthy.
  function distanceField(mask, w, h) {
    const INF = 1e9;
    const d = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) d[i] = mask[i] ? 0 : INF;
    const D1 = 1, D2 = Math.SQRT2;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = x + y * w;
        let v = d[i];
        if (x > 0) v = Math.min(v, d[i - 1] + D1);
        if (y > 0) {
          v = Math.min(v, d[i - w] + D1);
          if (x > 0) v = Math.min(v, d[i - w - 1] + D2);
          if (x < w - 1) v = Math.min(v, d[i - w + 1] + D2);
        }
        d[i] = v;
      }
    }
    for (let y = h - 1; y >= 0; y--) {
      for (let x = w - 1; x >= 0; x--) {
        const i = x + y * w;
        let v = d[i];
        if (x < w - 1) v = Math.min(v, d[i + 1] + D1);
        if (y < h - 1) {
          v = Math.min(v, d[i + w] + D1);
          if (x < w - 1) v = Math.min(v, d[i + w + 1] + D2);
          if (x > 0) v = Math.min(v, d[i + w - 1] + D2);
        }
        d[i] = v;
      }
    }
    return d;
  }

  Carto.Contour = { trace, blur, distanceField };
})(window.Carto = window.Carto || {});
