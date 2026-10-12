/* World generator, model side: a Voronoi world with relief, climate, biomes,
   rivers, cultures, states, provinces, religions, towns, routes and points
   of interest. Rendering lives in world-render.js. */
(function (Carto) {
  'use strict';

  const G = Carto.G;
  const Delaunator = Carto.Delaunator;
  const next = Delaunator.nextHalfedge;

  const W = 1600, H = 1000;
  const SEA = 20;
  const KM = 2.5; // kilometres per map unit
  const CELLS = { low: 3000, medium: 7000, high: 12000 };

  // ------------------------------------------------------------------ biomes

  const BIOMES = [
    // id, colour, habitability, movement cost, relief icon
    ['marine', '#9cbcc4', 0, 10, null],
    ['hotDesert', '#e9d59c', 4, 200, 'dune'],
    ['coldDesert', '#cfc7a4', 10, 150, 'dune'],
    ['savanna', '#d3cd82', 22, 60, 'acacia'],
    ['grassland', '#bdcc84', 30, 50, 'grass'],
    ['tropicalSeasonal', '#9cc06c', 50, 70, 'palm'],
    ['temperateDeciduous', '#8db571', 100, 70, 'deciduous'],
    ['tropicalRainforest', '#6aa45e', 80, 80, 'palm'],
    ['temperateRainforest', '#6a9f74', 90, 90, 'conifer'],
    ['taiga', '#8aa585', 12, 200, 'conifer'],
    ['tundra', '#c0c7b4', 4, 1000, 'grass'],
    ['glacier', '#eef2f3', 0, 5000, null],
    ['wetland', '#98b9a8', 12, 150, 'swamp'],
  ].map(([id, color, hab, cost, icon], i) => ({ i, id, color, hab, cost, icon }));
  const B = Object.fromEntries(BIOMES.map((b) => [b.id, b.i]));

  // ------------------------------------------------------------------ grid

  function buildGrid(rng, n) {
    const cols = Math.round(Math.sqrt((n * W) / H)), rows = Math.round(n / cols);
    const sx = W / cols, sy = H / rows;
    const spacing = (sx + sy) / 2;
    const pts = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) pts.push((x + 0.5 + rng.float(-0.42, 0.42)) * sx, (y + 0.5 + rng.float(-0.42, 0.42)) * sy);
    }
    const N = pts.length / 2;
    // A ring of points outside the sheet closes every real cell.
    const o = spacing * 0.75;
    for (let x = -o; x <= W + o + 0.1; x += spacing) pts.push(x, -o, x, H + o);
    for (let y = 0; y <= H; y += spacing) pts.push(-o, y, W + o, y);
    const d = new Delaunator(Float64Array.from(pts));
    const T = d.triangles, HE = d.halfedges;
    const nTri = T.length / 3;
    const vx = new Float32Array(nTri), vy = new Float32Array(nTri);
    for (let t = 0; t < nTri; t++) {
      const a = T[3 * t], b = T[3 * t + 1], c = T[3 * t + 2];
      const cc = Carto.Voronoi.circumcircle(pts[2 * a], pts[2 * a + 1], pts[2 * b], pts[2 * b + 1], pts[2 * c], pts[2 * c + 1]);
      vx[t] = cc ? cc.x : (pts[2 * a] + pts[2 * b] + pts[2 * c]) / 3;
      vy[t] = cc ? cc.y : (pts[2 * a + 1] + pts[2 * b + 1] + pts[2 * c + 1]) / 3;
    }
    const inedge = new Int32Array(pts.length / 2).fill(-1);
    for (let e = 0; e < T.length; e++) {
      const p = T[next(e)];
      if (inedge[p] === -1 || HE[e] === -1) inedge[p] = e;
    }
    const x = new Float32Array(N), y = new Float32Array(N), area = new Float32Array(N), border = new Uint8Array(N);
    const verts = new Array(N), nbs = new Array(N), across = new Array(N);
    for (let i = 0; i < N; i++) {
      x[i] = pts[2 * i]; y[i] = pts[2 * i + 1];
      const vs = [], ns = [];
      const start = inedge[i];
      let e = start;
      do {
        vs.push((e / 3) | 0);
        ns.push(T[e]);
        e = HE[next(e)];
      } while (e !== -1 && e !== start);
      verts[i] = vs;
      // across[k]: the cell on the other side of the edge verts[k] -> verts[k+1]
      across[i] = vs.map((_, k) => ns[(k + 1) % ns.length]);
      nbs[i] = ns.filter((q) => q < N);
      if (ns.some((q) => q >= N)) border[i] = 1;
      let s = 0;
      for (let k = 0; k < vs.length; k++) {
        const a = vs[k], b = vs[(k + 1) % vs.length];
        s += vx[a] * vy[b] - vx[b] * vy[a];
      }
      area[i] = Math.abs(s) / 2;
    }
    // Bucket index for point lookups.
    const bs = spacing, bw = Math.ceil(W / bs) + 1, bh = Math.ceil(H / bs) + 1;
    const buckets = Array.from({ length: bw * bh }, () => []);
    for (let i = 0; i < N; i++) buckets[Math.min(bw - 1, Math.max(0, Math.floor(x[i] / bs))) + Math.min(bh - 1, Math.max(0, Math.floor(y[i] / bs))) * bw].push(i);
    const find = (px, py) => {
      const bx = Math.floor(px / bs), by = Math.floor(py / bs);
      let best = -1, bd = Infinity;
      for (let r = 1; r <= 3 && best < 0; r++) {
        for (let yy = by - r; yy <= by + r; yy++) {
          if (yy < 0 || yy >= bh) continue;
          for (let xx = bx - r; xx <= bx + r; xx++) {
            if (xx < 0 || xx >= bw) continue;
            for (const i of buckets[xx + yy * bw]) {
              const dd = (x[i] - px) * (x[i] - px) + (y[i] - py) * (y[i] - py);
              if (dd < bd) { bd = dd; best = i; }
            }
          }
        }
      }
      return best;
    };
    return { n: N, spacing, x, y, area, border, verts, nbs, across, vx, vy, find };
  }

  // ------------------------------------------------------------------ heightmap

  const TEMPLATES = {
    continents: [
      'hill 1 80-90 60-80 35-65', 'hill 1 80-90 15-35 35-65', 'hill 6-8 15-30 20-80 15-85', 'multiply 0.65 land',
      'hill 7-9 6-12 10-90 15-85', 'range 2-3 35-55 10-40 20-80', 'range 2-3 35-55 60-90 20-80',
      'strait 2-3 vertical', 'smooth 2', 'trough 3-4 15-25 10-90 15-85', 'pit 3-4 10-20 15-85 20-80', 'mask 4',
    ],
    pangea: [
      'hill 1 85-95 40-60 40-60', 'hill 6-9 20-35 20-80 20-80', 'hill 4 15-25 10-90 10-90', 'smooth 2', 'multiply 0.75 land',
      'range 4-6 30-50 15-85 20-80', 'trough 3-5 20-30 10-90 10-90', 'pit 2-4 15-25 20-80 20-80', 'mask 5', 'smooth 1',
    ],
    archipelago: [
      'add 11 all', 'range 2-3 40-60 15-85 20-80', 'hill 6-8 15-25 10-90 20-80', 'hill 3 10-15 10-30 15-85',
      'hill 3 10-15 70-90 15-85', 'smooth 2', 'trough 9-12 20-30 5-95 5-95', 'strait 2 vertical', 'strait 2 horizontal', 'mask 2',
    ],
    island: [
      'hill 1 90-100 45-55 45-55', 'add 6 all', 'hill 5-6 25-35 30-70 30-70', 'range 2 35-50 35-65 35-65',
      'multiply 0.8 land', 'mask 3', 'smooth 2', 'trough 2-3 20-30 20-80 20-80', 'pit 2-3 10-25 25-75 25-75', 'hill 2 10-15 15-30 20-80',
    ],
    mediterranean: [
      'range 3-4 35-55 0-100 0-12', 'range 3-4 35-55 0-100 88-100', 'hill 5-6 30-60 0-100 0-8', 'hill 5-6 30-60 0-100 92-100',
      'smooth 1', 'hill 2-3 30-60 0-6 20-80', 'hill 2-3 30-60 94-100 20-80', 'multiply 0.9 land', 'mask -6', 'smooth 1',
      'pit 3-4 15-30 15-85 30-70', 'hill 3-5 10-25 15-85 35-65',
    ],
    peninsula: [
      'gradient 45 bottom', 'hill 1 70-85 35-65 70-95', 'range 2-3 30-45 35-65 30-90', 'hill 4-6 15-30 25-75 35-95',
      'trough 3-4 20-30 2-28 10-95', 'trough 3-4 20-30 72-98 10-95', 'hill 2-3 10-20 10-90 5-30', 'smooth 2', 'pit 2-3 10-20 20-80 20-60',
    ],
    volcano: [
      'hill 1 90-100 44-56 40-60', 'multiply 0.8 50-100', 'range 1-2 30-55 45-55 40-60', 'smooth 3',
      'hill 2 35-45 25-35 20-80', 'hill 1 35-55 70-80 25-75', 'hill 1 20-25 10-15 20-30', 'mask 3', 'pit 1-2 10-20 40-60 40-60',
    ],
  };

  function heightmap(grid, rng, template) {
    const n = grid.n, nbs = grid.nbs;
    const h = new Float32Array(n);
    const lerpPow = (a) => {
      const pts = [[1000, a[0]], [2000, a[1]], [5000, a[2]], [10000, a[3]], [20000, a[4]]];
      if (n <= pts[0][0]) return pts[0][1];
      for (let i = 1; i < pts.length; i++) if (n <= pts[i][0]) return pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * (n - pts[i - 1][0])) / (pts[i][0] - pts[i - 1][0]);
      return pts[pts.length - 1][1];
    };
    const blobPower = lerpPow([0.93, 0.95, 0.97, 0.98, 0.99]);
    const linePower = lerpPow([0.75, 0.77, 0.79, 0.81, 0.82]);
    const range = (s) => {
      const [a, b] = String(s).split('-').map(Number);
      return b === undefined ? a : rng.float(a, b);
    };
    const count = (s) => {
      const v = range(s);
      return Math.floor(v) + (rng.next() < v % 1 ? 1 : 0);
    };
    const startCell = (xr, yr, limit = 90) => {
      let c = 0;
      for (let k = 0; k < 50; k++) {
        c = grid.find((range(xr) / 100) * W, (range(yr) / 100) * H);
        if (c >= 0 && h[c] < limit) return c;
      }
      return Math.max(0, c);
    };
    const blob = (start, height, sign) => {
      const change = new Float32Array(n);
      change[start] = height;
      const q = [start];
      for (let qi = 0; qi < q.length; qi++) {
        const c = q[qi];
        for (const nb of nbs[c]) {
          if (change[nb]) continue;
          change[nb] = Math.pow(change[c], blobPower) * rng.float(0.9, 1.1);
          if (change[nb] > 1) q.push(nb);
        }
      }
      for (let i = 0; i < n; i++) h[i] = Math.max(0, Math.min(100, h[i] + sign * change[i]));
    };
    const pathBetween = (a, b) => {
      const used = new Uint8Array(n);
      const path = [a];
      used[a] = 1;
      let cur = a;
      while (cur !== b && path.length < n) {
        let min = Infinity, nx = -1;
        for (const nb of nbs[cur]) {
          if (used[nb]) continue;
          let d = (grid.x[b] - grid.x[nb]) ** 2 + (grid.y[b] - grid.y[nb]) ** 2;
          if (rng.next() > 0.85) d /= 2;
          if (d < min) { min = d; nx = nb; }
        }
        if (nx < 0) break;
        cur = nx;
        used[cur] = 1;
        path.push(cur);
      }
      return path;
    };
    const ridge = (path, height, sign) => {
      const used = new Uint8Array(n);
      let ring = path.slice();
      for (const c of ring) used[c] = 1;
      let hh = height;
      while (ring.length && hh > 2) {
        for (const c of ring) h[c] = Math.max(0, Math.min(100, h[c] + sign * hh * rng.float(0.85, 1.15)));
        hh = Math.pow(hh, linePower) - 1;
        const nextRing = [];
        for (const c of ring) for (const nb of nbs[c]) if (!used[nb]) { used[nb] = 1; nextRing.push(nb); }
        ring = nextRing;
      }
    };
    const filter = (f) => (f === 'land' ? (v) => v >= SEA : f === 'all' ? () => true : (v) => { const [a, b] = f.split('-').map(Number); return v >= a && v <= b; });

    for (const line of TEMPLATES[template] || TEMPLATES.continents) {
      const [op, a, b, c, d] = line.split(' ');
      if (op === 'hill' || op === 'pit') {
        const k = count(a);
        for (let i = 0; i < k; i++) blob(startCell(c, d, op === 'hill' ? 90 : 101), range(b), op === 'hill' ? 1 : -1);
      } else if (op === 'range' || op === 'trough') {
        const k = count(a);
        for (let i = 0; i < k; i++) {
          const s = startCell(c, d, op === 'range' ? 90 : 101);
          let e = s;
          for (let t = 0; t < 30; t++) {
            e = grid.find(grid.x[s] + rng.float(-0.35, 0.35) * W, grid.y[s] + rng.float(-0.3, 0.3) * H);
            const dist = Math.hypot(grid.x[e] - grid.x[s], grid.y[e] - grid.y[s]);
            if (e >= 0 && dist > W / 8 && dist < W / 2.5) break;
          }
          if (e < 0) continue;
          ridge(pathBetween(s, e), range(b), op === 'range' ? 1 : -1);
        }
      } else if (op === 'strait') {
        const width = count(a);
        const vertical = b === 'vertical';
        const s = vertical ? grid.find(rng.float(0.3, 0.7) * W, 2) : grid.find(2, rng.float(0.3, 0.7) * H);
        const e = vertical ? grid.find(rng.float(0.3, 0.7) * W, H - 2) : grid.find(W - 2, rng.float(0.3, 0.7) * H);
        let ring = pathBetween(s, e);
        const used = new Uint8Array(n);
        for (const cc of ring) used[cc] = 1;
        for (let step = 0; step <= width; step++) {
          for (const cc of ring) h[cc] = Math.min(h[cc], SEA - 9 + step * 4);
          const nr = [];
          for (const cc of ring) for (const nb of nbs[cc]) if (!used[nb]) { used[nb] = 1; nr.push(nb); }
          ring = nr;
        }
      } else if (op === 'smooth') {
        const f = Number(a) || 2;
        const nh = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          let s2 = h[i];
          for (const nb of nbs[i]) s2 += h[nb];
          nh[i] = (h[i] * (f - 1) + s2 / (nbs[i].length + 1)) / f;
        }
        h.set(nh);
      } else if (op === 'mask') {
        const power = Number(a);
        const fr = Math.abs(power);
        for (let i = 0; i < n; i++) {
          const nx = (2 * grid.x[i]) / W - 1, ny = (2 * grid.y[i]) / H - 1;
          let dist = (1 - nx * nx) * (1 - ny * ny);
          if (power < 0) dist = 1 - dist;
          h[i] = Math.max(0, (h[i] * (fr - 1) + h[i] * dist) / fr);
        }
      } else if (op === 'gradient') {
        // Raise the land toward one edge of the sheet.
        for (let i = 0; i < n; i++) {
          const f = b === 'bottom' ? grid.y[i] / H : b === 'top' ? 1 - grid.y[i] / H : b === 'right' ? grid.x[i] / W : 1 - grid.x[i] / W;
          h[i] = Math.max(0, Math.min(100, h[i] + Number(a) * f * f - Number(a) * 0.25));
        }
      } else if (op === 'add') {
        const ok = filter(b);
        for (let i = 0; i < n; i++) if (ok(h[i])) h[i] = Math.max(0, Math.min(100, h[i] + Number(a)));
      } else if (op === 'multiply') {
        const ok = filter(b);
        for (let i = 0; i < n; i++) if (ok(h[i])) h[i] = b === 'land' ? (h[i] - SEA) * Number(a) + SEA : h[i] * Number(a);
      }
    }
    // Keep the sheet's edge mostly at sea for every template but the inland ones.
    for (let i = 0; i < n; i++) if (grid.border[i] && template !== 'mediterranean' && template !== 'pangea' && template !== 'peninsula') h[i] = Math.min(h[i], 0);
    // Re-level the sea so each template keeps its share of land, and give
    // the land a lowland-heavy profile: plains common, peaks rare.
    const share = { continents: 0.4, pangea: 0.52, archipelago: 0.26, island: 0.3, mediterranean: 0.55, peninsula: 0.45, volcano: 0.22 }[template] || 0.4;
    const sorted = Float32Array.from(h).sort();
    const level = Math.max(1, sorted[Math.min(n - 1, Math.floor(n * (1 - share)))]);
    const top = Math.max(level + 1, sorted[n - 1]);
    for (let i = 0; i < n; i++) {
      h[i] = h[i] >= level ? SEA + 80 * Math.pow((h[i] - level) / (top - level), 1.35) : (h[i] / level) * (SEA - 1);
    }
    return h;
  }

  // ------------------------------------------------------------------ helpers

  class Heap {
    constructor() { this.k = []; this.v = []; }
    get size() { return this.k.length; }
    push(key, val) {
      const k = this.k, v = this.v;
      k.push(key); v.push(val);
      let i = k.length - 1;
      while (i > 0) {
        const j = (i - 1) >> 1;
        if (k[j] <= k[i]) break;
        [k[i], k[j]] = [k[j], k[i]]; [v[i], v[j]] = [v[j], v[i]];
        i = j;
      }
    }
    pop() {
      const k = this.k, v = this.v;
      const top = v[0], tk = k[0];
      const lk = k.pop(), lv = v.pop();
      if (k.length) {
        k[0] = lk; v[0] = lv;
        let i = 0;
        for (;;) {
          const l = 2 * i + 1, r = l + 1;
          let m = i;
          if (l < k.length && k[l] < k[m]) m = l;
          if (r < k.length && k[r] < k[m]) m = r;
          if (m === i) break;
          [k[i], k[m]] = [k[m], k[i]]; [v[i], v[m]] = [v[m], v[i]];
          i = m;
        }
      }
      this.lastKey = tk;
      return top;
    }
  }

  // Multi-source expansion: sources [{cell, id, weight}], cost(from, to, id) -> step cost or Infinity.
  function expand(grid, sources, cost, maxCost = Infinity) {
    const owner = new Int32Array(grid.n).fill(0);
    const best = new Float64Array(grid.n).fill(Infinity);
    const heap = new Heap();
    for (const s of sources) { best[s.cell] = 0; owner[s.cell] = s.id; heap.push(0, s.cell); }
    while (heap.size) {
      const c = heap.pop();
      const d = heap.lastKey;
      if (d > best[c]) continue;
      const id = owner[c];
      for (const nb of grid.nbs[c]) {
        const step = cost(c, nb, id);
        if (!isFinite(step)) continue;
        const nd = d + step;
        if (nd < best[nb] && nd <= maxCost) {
          best[nb] = nd;
          owner[nb] = id;
          heap.push(nd, nb);
        }
      }
    }
    return owner;
  }

  // Cheapest path between two cells; cost(from, to) -> step cost.
  function route(grid, from, to, cost) {
    const n = grid.n;
    const dist = new Float64Array(n).fill(Infinity);
    const prev = new Int32Array(n).fill(-1);
    const heap = new Heap();
    dist[from] = 0;
    heap.push(0, from);
    const tx = grid.x[to], ty = grid.y[to], sp = grid.spacing;
    while (heap.size) {
      const c = heap.pop();
      if (c === to) break;
      for (const nb of grid.nbs[c]) {
        const step = cost(c, nb);
        if (!isFinite(step)) continue;
        const nd = dist[c] + step;
        if (nd < dist[nb]) {
          dist[nb] = nd;
          prev[nb] = c;
          heap.push(nd + (Math.hypot(grid.x[nb] - tx, grid.y[nb] - ty) / sp) * 0.9, nb);
        }
      }
    }
    if (prev[to] < 0 && from !== to) return null;
    const path = [to];
    let c = to;
    while (c !== from) { c = prev[c]; path.unshift(c); }
    return path;
  }

  // For each region id, the cell farthest from the region's edge (a good label spot).
  function poles(grid, owner, count) {
    const n = grid.n;
    const dist = new Int32Array(n).fill(-1);
    const q = [];
    for (let i = 0; i < n; i++) {
      if (!owner[i]) continue;
      if (grid.border[i] || grid.nbs[i].some((nb) => owner[nb] !== owner[i])) { dist[i] = 0; q.push(i); }
    }
    for (let qi = 0; qi < q.length; qi++) {
      const c = q[qi];
      for (const nb of grid.nbs[c]) if (dist[nb] < 0 && owner[nb] === owner[c]) { dist[nb] = dist[c] + 1; q.push(nb); }
    }
    const best = new Array(count + 1).fill(-1), bd = new Array(count + 1).fill(-1);
    for (let i = 0; i < n; i++) if (owner[i] && dist[i] > bd[owner[i]]) { bd[owner[i]] = dist[i]; best[owner[i]] = i; }
    return best;
  }

  // Hue-spread colours that sit well on parchment.
  function colours(rng, k, sat = 0.42, light = 0.62) {
    const out = [];
    const h0 = rng.float(0, 360);
    for (let i = 0; i < k; i++) {
      const h = (h0 + i * 137.508) % 360;
      out.push(hsl(h, sat + rng.float(-0.06, 0.06), light + rng.float(-0.05, 0.05)));
    }
    return out;
  }
  function hsl(h, s, l) {
    const f = (nn) => {
      const k = (nn + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    const hex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
    return '#' + hex(f(0)) + hex(f(8)) + hex(f(4));
  }

  // ------------------------------------------------------------------ generation

  function generate(seed, opts) {
    const rng = new Carto.Random(seed);
    const timing = [];
    const mark = (label) => { timing.push([label, Date.now()]); if (typeof process !== 'undefined' && process.env && process.env.WORLD_DEBUG) console.error(label, Date.now() - timing[0][1]); };
    mark('start');
    const n0 = CELLS[opts.cells] || CELLS.medium;
    const grid = buildGrid(rng.fork('grid'), n0);
    const n = grid.n, nbs = grid.nbs;
    mark('grid');
    const h = heightmap(grid, rng.fork('height'), opts.template || 'continents');
    mark('height');
    const noise = new Carto.Noise(rng.fork('climate-noise'));

    // Drainage and lakes: priority flood from the sea and the sheet's edge.
    const filled = Float32Array.from(h);
    const flow = new Int32Array(n).fill(-1);
    {
      const seen = new Uint8Array(n);
      const heap = new Heap();
      for (let i = 0; i < n; i++) if (h[i] < SEA || grid.border[i]) { seen[i] = 1; heap.push(h[i], i); }
      while (heap.size) {
        const c = heap.pop();
        for (const nb of nbs[c]) {
          if (seen[nb]) continue;
          seen[nb] = 1;
          filled[nb] = Math.max(h[nb], filled[c] + 0.01);
          flow[nb] = c;
          heap.push(filled[nb], nb);
        }
      }
    }
    const lake = new Uint8Array(n);
    {
      const cand = new Uint8Array(n);
      for (let i = 0; i < n; i++) if (h[i] >= SEA && filled[i] - h[i] > 2.5) cand[i] = 1;
      const seen = new Uint8Array(n);
      const comps = [];
      for (let i = 0; i < n; i++) {
        if (!cand[i] || seen[i]) continue;
        const comp = [i];
        seen[i] = 1;
        for (let qi = 0; qi < comp.length; qi++) for (const nb of nbs[comp[qi]]) if (cand[nb] && !seen[nb]) { seen[nb] = 1; comp.push(nb); }
        if (comp.length >= 3 && comp.length < n * 0.006) comps.push(comp);
      }
      // A handful of lakes reads better than a sieve of ponds.
      comps.sort((a, b) => b.length - a.length);
      for (const comp of comps.slice(0, Math.round(6 * Math.sqrt(n / 7000)))) for (const c of comp) lake[c] = 1;
    }
    const isWater = (i) => h[i] < SEA || lake[i] === 1;

    mark('lakes');
    // Features: oceans, lakes and landmasses.
    const feature = new Int32Array(n);
    const features = [null];
    for (let i = 0; i < n; i++) {
      if (feature[i]) continue;
      const water = isWater(i);
      const id = features.length;
      const comp = [i];
      feature[i] = id;
      let touches = false;
      for (let qi = 0; qi < comp.length; qi++) {
        const c = comp[qi];
        if (grid.border[c]) touches = true;
        for (const nb of nbs[c]) if (!feature[nb] && isWater(nb) === water && (!water || (lake[nb] === lake[c]))) { feature[nb] = id; comp.push(nb); }
      }
      const type = water ? (lake[i] ? 'lake' : touches || comp.length > n * 0.05 ? 'ocean' : 'lake') : comp.length > n * 0.05 ? 'continent' : 'island';
      features.push({ id, type, cells: comp.length, first: i });
    }
    // Distance to the coast: +1, +2... on land, -1, -2... at sea.
    const coast = new Int8Array(n);
    {
      let q = [];
      for (let i = 0; i < n; i++) {
        const w = isWater(i);
        if (nbs[i].some((nb) => isWater(nb) !== w)) { coast[i] = w ? -1 : 1; q.push(i); }
      }
      for (let d = 2; d <= 6 && q.length; d++) {
        const nq = [];
        for (const c of q) for (const nb of nbs[c]) if (!coast[nb]) { coast[nb] = isWater(nb) ? -d : d; nq.push(nb); }
        q = nq;
      }
    }

    mark('features');
    // Climate.
    const lats = { cold: [74, 34], temperate: [60, 18], warm: [42, -6] }[opts.climate] || [60, 18];
    const lat = new Float32Array(n), temp = new Float32Array(n), prec = new Float32Array(n), elev = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      lat[i] = lats[0] - (grid.y[i] / H) * (lats[0] - lats[1]);
      elev[i] = h[i] < SEA ? 0 : Math.pow(Math.max(0, h[i] - 18) / 82, 1.9) * 5200;
      const a = (Math.abs(lat[i]) * Math.PI) / 180;
      temp[i] = 28 * Math.pow(Math.cos(a), 1.5) - (6 * Math.abs(lat[i])) / 90 - elev[i] * 0.0065 + noise.get(grid.x[i] / 300, grid.y[i] / 300) * 2;
    }
    const latBase = (l) => {
      const a = Math.abs(l);
      if (a < 12) return 1100;
      if (a < 28) return 1100 - ((a - 12) / 16) * 950;
      if (a < 38) return 150 + ((a - 28) / 10) * 500;
      if (a < 62) return 650;
      return 650 - Math.min(1, (a - 62) / 20) * 400;
    };
    for (let i = 0; i < n; i++) {
      if (isWater(i)) { prec[i] = 0; continue; }
      const a = Math.abs(lat[i]);
      const wind = a < 30 || a > 62 ? -1 : 1; // blowing toward +x (westerlies) or -x
      let moist = 0, shadow = 0, w = 1;
      for (let k = 1; k <= 16; k++) {
        const px = grid.x[i] - wind * k * grid.spacing, py = grid.y[i] + noise.get(i * 0.01, k) * grid.spacing * 0.5;
        w *= 0.86;
        if (px < 0 || px > W) { moist += w; continue; }
        const q = grid.find(px, Math.max(0, Math.min(H, py)));
        if (q < 0) continue;
        if (isWater(q)) moist += w;
        else if (k <= 8) shadow = Math.max(shadow, h[q] - h[i]);
      }
      let p = latBase(lat[i]) * 0.55 + moist * 260;
      if (shadow > 18) p *= 0.45;
      if (h[i] > 45 && shadow < 5) p *= 1.15;
      p *= 1 + noise.fbm(grid.x[i] / 250 + 40, grid.y[i] / 250, 3) * 0.35;
      prec[i] = Math.max(0, p);
    }

    mark('climate');
    // Flux and rivers.
    const order = Array.from({ length: n }, (_, i) => i).filter((i) => h[i] >= SEA).sort((a, b) => filled[b] - filled[a]);
    const flux = new Float32Array(n);
    const avgArea = (W * H) / n;
    for (const i of order) {
      flux[i] += (prec[i] / 100) * (grid.area[i] / avgArea);
      if (flow[i] >= 0) flux[flow[i]] += flux[i];
    }
    const landFlux = order.map((i) => flux[i]).sort((a, b) => a - b);
    const T = Math.max(25, landFlux[Math.floor(landFlux.length * 0.965)] || 25);
    const isRiver = (i) => h[i] >= SEA && !lake[i] && flux[i] >= T;
    const upstream = new Uint8Array(n);
    for (const i of order) if (isRiver(i) && flow[i] >= 0) upstream[flow[i]] = 1;
    const riverOf = new Int32Array(n);
    const rivers = [];
    for (const i of order) {
      if (!isRiver(i) || upstream[i] || riverOf[i]) continue;
      const cells = [];
      // A river leaving a lake starts at the lake shore.
      const fromLake = nbs[i].find((nb) => lake[nb] && flow[nb] === i);
      if (fromLake !== undefined) cells.push(fromLake);
      let c = i, mouth = -1;
      while (c >= 0) {
        cells.push(c);
        if (riverOf[c] || isWater(c)) { mouth = c; break; }
        riverOf[c] = rivers.length + 1;
        c = flow[c];
      }
      if (cells.length < 3) { for (const cc of cells) if (riverOf[cc] === rivers.length + 1) riverOf[cc] = 0; continue; }
      rivers.push({ id: rivers.length + 1, cells, mouth, flux: flux[cells[cells.length - 2]] || 0 });
    }

    mark('rivers');
    // Biomes.
    const br = rng.fork('biomes');
    const biome = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      if (isWater(i)) { biome[i] = B.marine; continue; }
      const tt = temp[i], p = prec[i] + (riverOf[i] ? 250 : 0);
      let b;
      if (tt < -6) b = B.glacier;
      else if (tt < 1) b = B.tundra;
      else if (tt < 6) b = p < 300 ? B.tundra : B.taiga;
      else if (tt < 14) b = p < 250 ? B.coldDesert : p < 520 ? B.grassland : p < 1100 ? (tt < 9 ? B.taiga : B.temperateDeciduous) : B.temperateRainforest;
      else if (tt < 21) b = p < 250 ? B.coldDesert : p < 580 ? B.grassland : p < 1300 ? B.temperateDeciduous : B.temperateRainforest;
      else b = p < 260 ? B.hotDesert : p < 700 ? B.savanna : p < 1500 ? B.tropicalSeasonal : B.tropicalRainforest;
      if (h[i] < 27 && tt > 2 && p > 850 && (riverOf[i] || Math.abs(coast[i]) === 1) && br.bool(0.35)) b = B.wetland;
      biome[i] = b;
    }

    // Habitability and population (people per cell).
    const suit = new Float32Array(n), pop = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      if (isWater(i)) continue;
      let s = BIOMES[biome[i]].hab;
      if (!s) continue;
      if (riverOf[i]) s += Math.min(40, (flux[i] / T) * 8);
      if (coast[i] === 1) s += nbs[i].some((nb) => features[feature[nb]].type === 'ocean') ? 18 : 10;
      if (h[i] > 50) s -= (h[i] - 50) * 1.4;
      s = Math.max(0, s);
      suit[i] = s;
      pop[i] = (s / 100) * grid.area[i] * KM * KM * 9;
    }
    const land = order.filter((i) => !lake[i]);
    const landArea = land.reduce((s, i) => s + grid.area[i], 0);

    mark('biomes');
    // Cultures.
    const cr = rng.fork('cultures');
    const nCult = Math.max(1, Math.min(12, opts.cultures || 6));
    const bases = cr.shuffle(Carto.NameBases.ids);
    const cultures = [null];
    {
      const cand = land.filter((i) => suit[i] > 5).sort((a, b) => suit[b] * cr.float(0.5, 1) - suit[a] * cr.float(0.5, 1));
      let spacing = Math.sqrt(landArea / nCult) * 0.7;
      while (cultures.length <= nCult && spacing > 5) {
        for (const c of cand) {
          if (cultures.length > nCult) break;
          if (cultures.some((k) => k && Math.hypot(grid.x[k.center] - grid.x[c], grid.y[k.center] - grid.y[c]) < spacing)) continue;
          const b = biome[c];
          const type = coast[c] === 1 && cr.bool(0.45) ? 'naval'
            : h[c] > 48 ? 'highland'
              : (b === B.grassland || b === B.savanna || b === B.hotDesert || b === B.coldDesert) && cr.bool(0.6) ? 'nomadic'
                : (b === B.taiga || b === B.temperateRainforest || b === B.tropicalRainforest) && cr.bool(0.5) ? 'hunting'
                  : riverOf[c] ? 'river' : 'generic';
          const base = bases[(cultures.length - 1) % bases.length];
          cultures.push({ id: cultures.length, center: c, type, base, name: Carto.NameBases.name(base, cr, 4, 9), expansion: cr.float(0.7, 1.6) });
        }
        spacing *= 0.8;
      }
      const cols = colours(cr, cultures.length - 1, 0.34, 0.66);
      cultures.forEach((k, i) => { if (k) k.color = cols[i - 1]; });
    }
    const biomeCost = (b, type) => {
      let c = BIOMES[b].cost;
      if (type === 'nomadic' && (b === B.grassland || b === B.savanna || b === B.hotDesert || b === B.coldDesert)) c *= 0.3;
      if (type === 'nomadic' && (b === B.temperateDeciduous || b === B.taiga || b === B.temperateRainforest || b === B.tropicalRainforest)) c *= 2.5;
      if (type === 'hunting' && (b === B.taiga || b === B.temperateDeciduous || b === B.temperateRainforest || b === B.tropicalRainforest)) c *= 0.5;
      return c;
    };
    const culture = expand(grid, cultures.slice(1).map((k) => ({ cell: k.center, id: k.id })), (a, b, id) => {
      const k = cultures[id];
      if (isWater(b)) return k.type === 'naval' ? 8 : 60;
      let c = biomeCost(biome[b], k.type) / 10 + 4;
      if (h[b] > 60) c += (h[b] - 60) * (k.type === 'highland' ? 0.4 : 2.5);
      if (k.type === 'highland' && h[b] < 40) c += 6;
      if (k.type === 'river' && !riverOf[b]) c += 4;
      if (k.type === 'naval' && coast[b] !== 1) c += 3;
      return c / k.expansion;
    });
    for (let i = 0; i < n; i++) if (isWater(i)) culture[i] = 0;

    mark('cultures');
    // Towns.
    const tr = rng.fork('burgs');
    const nStates = Math.max(1, Math.min(30, opts.states || 8));
    const burgs = [null];
    const harbour = (c) => coast[c] === 1 && nbs[c].some((nb) => isWater(nb) && (features[feature[nb]].type === 'ocean' || features[feature[nb]].cells > 20));
    const addBurg = (c, capital) => {
      const k = cultures[culture[c]] || cultures[1];
      const b = {
        id: burgs.length, cell: c, x: grid.x[c], y: grid.y[c], capital, culture: culture[c],
        name: Carto.NameBases.name(k.base, tr, 4, 10), port: harbour(c) && tr.bool(capital ? 0.9 : 0.6),
      };
      // Ports sit on the shore.
      if (b.port) {
        const w = nbs[c].find((nb) => isWater(nb));
        b.x = grid.x[c] * 0.6 + grid.x[w] * 0.4;
        b.y = grid.y[c] * 0.6 + grid.y[w] * 0.4;
      }
      b.seed = Carto.hashString(seed + ':burg:' + b.id);
      burgs.push(b);
      return b;
    };
    {
      const scored = land.filter((i) => suit[i] > 0).map((i) => [suit[i] * tr.float(0.5, 1.5) + (harbour(i) ? 10 : 0), i]).sort((a, b) => b[0] - a[0]);
      let spacing = Math.sqrt(landArea / nStates) * 0.65;
      while (burgs.length <= nStates && spacing > 4) {
        for (const [, c] of scored) {
          if (burgs.length > nStates) break;
          if (burgs.some((b) => b && Math.hypot(b.x - grid.x[c], b.y - grid.y[c]) < spacing)) continue;
          addBurg(c, true);
        }
        spacing *= 0.8;
      }
      const per = { few: 110, normal: 55, many: 28 }[opts.towns] || 55;
      const wanted = Math.round(land.length / per * (n0 / 7000) ** 0.15);
      let tspacing = Math.sqrt(landArea / Math.max(1, wanted)) * 0.55;
      let placed = 0;
      for (let pass = 0; pass < 3 && placed < wanted; pass++) {
        for (const [, c] of scored) {
          if (placed >= wanted) break;
          if (burgs.some((b) => b && Math.hypot(b.x - grid.x[c], b.y - grid.y[c]) < tspacing)) continue;
          addBurg(c, false);
          placed++;
        }
        tspacing *= 0.75;
      }
    }
    const burgAt = new Int32Array(n);
    for (const b of burgs) if (b) burgAt[b.cell] = b.id;

    mark('burgs');
    // States.
    const sr = rng.fork('states');
    const states = [{ id: 0, name: null, neutral: true }];
    const scols = colours(sr, nStates, 0.36, 0.64);
    for (const b of burgs) {
      if (!b || !b.capital) continue;
      const k = cultures[b.culture] || cultures[1];
      states.push({
        id: states.length, capital: b.id, culture: b.culture, color: scols[states.length - 1],
        name: Carto.NameBases.name(k.base, sr, 4, 9), type: k.type, expansion: sr.float(1, 2.2), center: b.cell,
      });
      b.state = states.length - 1;
    }
    const maxStateCost = Math.sqrt(land.length) * 14;
    const state = expand(grid, states.slice(1).map((s) => ({ cell: s.center, id: s.id })), (a, b, id) => {
      const s = states[id];
      if (isWater(b)) return s.type === 'naval' ? 12 : Infinity;
      let c = biomeCost(biome[b], s.type) / 20 + 5;
      if (culture[b] !== s.culture) c += 14;
      if (h[b] > 60) c += (h[b] - 60) * (s.type === 'highland' ? 0.5 : 2);
      if (riverOf[b] && !riverOf[a] && s.type !== 'river') c += 4;
      return c / s.expansion;
    }, maxStateCost);
    for (let i = 0; i < n; i++) if (isWater(i)) state[i] = 0;
    for (const b of burgs) if (b) b.state = state[b.cell];

    // State statistics, forms and names.
    for (const s of states) if (s) Object.assign(s, { cells: 0, area: 0, pop: 0, burgs: 0, urban: 0 });
    for (const i of land) {
      const s = states[state[i]];
      if (!s) continue;
      s.cells++;
      s.area += grid.area[i] * KM * KM;
      s.pop += pop[i];
    }
    for (const b of burgs) if (b) states[b.state || 0].burgs++;
    const real = states.filter((s) => s && s.id);
    const avg = real.reduce((s, x) => s + x.cells, 0) / Math.max(1, real.length);
    const sorted = real.slice().sort((a, b) => b.cells - a.cells);
    for (const s of real) {
      const base = cultures[s.culture] ? cultures[s.culture].base : 'romance';
      const rank = sorted.indexOf(s);
      let form;
      if (rank === 0 && s.cells > avg * 1.6) form = 'empire';
      else if (s.type === 'nomadic') form = 'khaganate';
      else if (base === 'desert') form = sr.bool(0.7) ? 'sultanate' : 'emirate';
      else if (s.cells < avg * 0.45) form = sr.pick(['duchy', 'principality', 'county', 'march']);
      else if (s.type === 'naval' && sr.bool(0.45)) form = 'republic';
      else form = sr.weighted([['kingdom', 6], ['grandduchy', 1], ['republic', 1], ['theocracy', 0.6]]);
      s.form = form;
    }

    // Neighbours and diplomacy.
    const adjacency = new Map();
    for (let i = 0; i < n; i++) {
      if (!state[i]) continue;
      for (const nb of nbs[i]) {
        if (state[nb] && state[nb] !== state[i]) {
          const a = Math.min(state[i], state[nb]), b = Math.max(state[i], state[nb]);
          adjacency.set(a + '|' + b, true);
        }
      }
    }
    const relations = [];
    for (const k of adjacency.keys()) {
      const [a, b] = k.split('|').map(Number);
      relations.push({ a, b, rel: sr.weighted([['ally', 1.2], ['friendly', 2], ['neutral', 3], ['suspicion', 2], ['rival', 1.5], ['war', 0.6]]) });
    }

    mark('states');
    // Provinces.
    const province = new Int32Array(n);
    const provinces = [null];
    for (const s of real) {
      const own = burgs.filter((b) => b && b.state === s.id).sort((a, b) => (b.capital - a.capital) || suit[b.cell] - suit[a.cell]);
      const k = Math.max(1, Math.min(own.length, Math.round(s.cells / 70)));
      const srcs = own.slice(0, k).map((b) => {
        provinces.push({ id: provinces.length, state: s.id, burg: b.id, form: sr.int(0, 4) });
        return { cell: b.cell, id: provinces.length - 1 };
      });
      const sub = expand(grid, srcs, (a, b) => (state[b] === s.id ? 1 + Math.abs(h[b] - h[a]) * 0.2 : Infinity));
      for (let i = 0; i < n; i++) if (state[i] === s.id && sub[i]) province[i] = sub[i];
    }
    for (const p of provinces) {
      if (!p) continue;
      const base = states[p.state].color;
      p.color = shade(base, sr.float(-0.18, 0.18));
    }

    mark('provinces');
    // Religions: a traditional faith per culture, then a few organised ones.
    const rr = rng.fork('religions');
    const religions = [null];
    for (const k of cultures) if (k) religions.push({ id: religions.length, kind: 'folk', culture: k.id, color: shade(k.color, -0.12) });
    const religion = new Int32Array(n);
    for (let i = 0; i < n; i++) if (culture[i]) religion[i] = culture[i];
    const nOrg = Math.max(0, Math.min(8, opts.religions === undefined ? 3 : opts.religions));
    const centres = rr.shuffle(burgs.filter((b) => b)).sort((a, b) => b.capital - a.capital);
    const orgSources = [];
    const rcols = colours(rr, nOrg + 1, 0.4, 0.58);
    for (let i = 0; i < nOrg && i < centres.length; i++) {
      const b = centres[i];
      if (orgSources.some((s) => Math.hypot(grid.x[s.cell] - b.x, grid.y[s.cell] - b.y) < W / 8)) continue;
      const k = cultures[b.culture] || cultures[1];
      const r = { id: religions.length, kind: rr.bool(0.75) ? 'organized' : 'cult', culture: b.culture, center: b.cell, color: rcols[i], deity: Carto.NameBases.name(k.base, rr, 4, 9), form: rr.int(0, 6), reach: rr.float(0.6, 1.6) };
      religions.push(r);
      orgSources.push({ cell: b.cell, id: r.id });
    }
    if (orgSources.length) {
      const spread = expand(grid, orgSources, (a, b, id) => {
        if (isWater(b)) return 30;
        const r = religions[id];
        return (BIOMES[biome[b]].cost / 20 + 5 + (culture[b] !== r.culture ? 6 : 0)) / r.reach;
      }, Math.sqrt(land.length) * 5);
      for (let i = 0; i < n; i++) if (spread[i] && !isWater(i)) religion[i] = spread[i];
    }
    for (const r of religions) if (r) r.cells = 0;
    for (const i of land) if (religion[i]) religions[religion[i]].cells++;
    for (const r of religions) if (r && r.kind === 'folk') r.name = cultures[r.culture].name;

    mark('religions');
    // Routes: roads inside states, between neighbouring capitals, and sea lanes.
    const routes = [];
    const used = new Set();
    const ekey = (a, b) => (a < b ? a + ':' + b : b + ':' + a);
    const addRoute = (path, type) => {
      if (!path || path.length < 2) return;
      let seg = [path[0]];
      for (let i = 1; i < path.length; i++) {
        const k = ekey(path[i - 1], path[i]);
        if (used.has(k)) {
          if (seg.length > 1) routes.push({ type, cells: seg });
          seg = [path[i]];
          continue;
        }
        used.add(k);
        seg.push(path[i]);
      }
      if (seg.length > 1) routes.push({ type, cells: seg });
    };
    const roadCell = new Uint8Array(n);
    const landCost = (a, b) => {
      if (isWater(b)) return Infinity;
      let c = BIOMES[biome[b]].cost / 25 + 1 + Math.abs(h[b] - h[a]) * 0.35;
      if (h[b] > 70) c += 4;
      if (riverOf[b] !== riverOf[a]) c += 1.5;
      return roadCell[b] ? c * 0.35 : c;
    };
    if (opts.routes !== false) {
      for (const r of relations) {
        const a = burgs[states[r.a].capital], b = burgs[states[r.b].capital];
        if (feature[a.cell] !== feature[b.cell]) continue;
        const p = route(grid, a.cell, b.cell, landCost);
        if (p) { addRoute(p, 'road'); for (const c of p) roadCell[c] = 1; }
      }
      for (const s of real) {
        const cap = burgs[s.capital];
        const own = burgs.filter((b) => b && !b.capital && b.state === s.id && feature[b.cell] === feature[cap.cell])
          .sort((a, b) => Math.hypot(a.x - cap.x, a.y - cap.y) - Math.hypot(b.x - cap.x, b.y - cap.y));
        for (const b of own) {
          const p = route(grid, b.cell, cap.cell, landCost);
          if (p) { addRoute(p, Math.hypot(b.x - cap.x, b.y - cap.y) < W / 6 ? 'road' : 'trail'); for (const c of p) roadCell[c] = 1; }
        }
      }
      // Free towns and towns on other islands: a trail to the nearest town.
      for (const b of burgs) {
        if (!b || b.capital || (b.state && feature[b.cell] === feature[burgs[states[b.state].capital].cell])) continue;
        const near = burgs.filter((o) => o && o !== b && feature[o.cell] === feature[b.cell]).sort((p, q) => Math.hypot(p.x - b.x, p.y - b.y) - Math.hypot(q.x - b.x, q.y - b.y))[0];
        if (near) addRoute(route(grid, b.cell, near.cell, landCost), 'trail');
      }
      // Sea lanes between ports.
      const ports = burgs.filter((b) => b && b.port);
      let seaTarget = -1;
      const seaCost = (a, b) => (isWater(b) && !lake[b] ? (coast[b] === -1 ? 1 : 1.2) : b === seaTarget ? 1 : Infinity);
      for (const p of ports) {
        const others = ports.filter((q) => q !== p).sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y)).slice(0, 2);
        for (const q of others) {
          if (Math.hypot(q.x - p.x, q.y - p.y) > W * 0.45) continue;
          seaTarget = q.cell;
          const start = nbs[p.cell].find((nb) => isWater(nb) && !lake[nb]);
          if (start === undefined) continue;
          const path = route(grid, start, q.cell, seaCost);
          if (path) addRoute([p.cell].concat(path), 'sea');
        }
      }
    }

    mark('routes');
    // Points of interest.
    const mr = rng.fork('markers');
    const markers = [];
    const freeCell = (c) => !burgAt[c] && !markers.some((m) => Math.hypot(m.x - grid.x[c], m.y - grid.y[c]) < 30);
    const addMarker = (type, c, extra) => {
      if (c === undefined || c < 0 || !freeCell(c)) return;
      markers.push(Object.assign({ id: markers.length + 1, type, cell: c, x: grid.x[c], y: grid.y[c], seed: Carto.hashString(seed + ':m:' + markers.length), v: mr.int(0, 2), name: Carto.NameBases.name((cultures[culture[c]] || cultures[1]).base, mr, 4, 9) }, extra || {}));
    };
    const pickCells = (filter, k) => mr.shuffle(land.filter(filter)).slice(0, k);
    const peaks = land.filter((c) => h[c] > 82).sort((a, b) => h[b] - h[a]);
    for (const c of peaks.slice(0, mr.int(0, 2))) addMarker('volcano', c);
    for (const c of pickCells((c) => h[c] > 50 && h[c] < 75 && !riverOf[c], mr.int(1, 3))) addMarker('springs', c);
    for (const c of pickCells((c) => h[c] > 55 && h[c] < 80, mr.int(2, 4))) addMarker('mine', c);
    for (const c of pickCells((c) => suit[c] > 5 && !state[c] ? true : mr.bool(0.02), mr.int(3, 5))) addMarker('ruins', c);
    for (const c of pickCells((c) => suit[c] >= 0 && h[c] > 30, mr.int(2, 4))) addMarker('dungeon', c);
    for (const c of pickCells((c) => h[c] > 45, mr.int(1, 3))) addMarker('cave', c);
    for (const c of pickCells((c) => BIOMES[biome[c]].icon === 'deciduous' || BIOMES[biome[c]].icon === 'conifer', mr.int(1, 2))) addMarker('grove', c);
    for (const b of mr.shuffle(burgs.filter((x) => x && x.port)).slice(0, mr.int(1, 3))) {
      const w = nbs[b.cell].find((nb) => isWater(nb) && !lake[nb]);
      if (w !== undefined) addMarker('lighthouse', w);
    }
    const warBorder = land.filter((c) => state[c] && nbs[c].some((nb) => state[nb] && state[nb] !== state[c] && relations.some((r) => (r.rel === 'war' || r.rel === 'rival') && ((r.a === state[c] && r.b === state[nb]) || (r.b === state[c] && r.a === state[nb])))));
    for (const c of mr.shuffle(warBorder).slice(0, mr.int(1, 2))) addMarker('battlefield', c);
    const deep = Array.from({ length: n }, (_, i) => i).filter((i) => h[i] < SEA && !lake[i] && coast[i] === 0);
    for (const c of mr.shuffle(deep).slice(0, mr.int(1, 2))) addMarker('monster', c);
    const shallow = Array.from({ length: n }, (_, i) => i).filter((i) => coast[i] === -2);
    for (const c of mr.shuffle(shallow).slice(0, mr.int(0, 2))) addMarker('wreck', c);

    mark('markers');
    // Names of seas and lakes.
    const nr = rng.fork('names');
    let oceanNamed = false;
    const sortedFeatures = features.filter((f) => f).sort((a, b) => b.cells - a.cells);
    for (const f of sortedFeatures) {
      if (f.type === 'ocean') { f.name = Carto.NameBases.name(nr.pick(Carto.NameBases.ids), nr, 4, 9); f.kind = oceanNamed ? 'sea' : 'ocean'; oceanNamed = true; }
      else if (f.type === 'lake' && f.cells >= 4) { f.name = Carto.NameBases.name((cultures[culture[nbs[f.first].find((nb) => culture[nb])] || 1] || cultures[1]).base, nr, 4, 9); f.kind = 'lake'; }
    }
    const featurePole = poles(grid, Int32Array.from(feature, (fid) => (features[fid] && features[fid].name ? fid : 0)), features.length);
    for (const f of features) if (f && f.name) f.pole = featurePole[f.id];
    for (const rv of rivers) {
      const mid = rv.cells[Math.floor(rv.cells.length / 2)];
      rv.name = Carto.NameBases.name((cultures[culture[mid]] || cultures[1]).base, nr, 3, 8);
    }

    // Label positions.
    const statePoles = poles(grid, state, states.length);
    for (const s of real) s.pole = statePoles[s.id] >= 0 ? statePoles[s.id] : s.center;
    const culturePoles = poles(grid, culture, cultures.length);
    for (const k of cultures) if (k) k.pole = culturePoles[k.id] >= 0 ? culturePoles[k.id] : k.center;
    const relPoles = poles(grid, religion, religions.length);
    for (const r of religions) if (r) r.pole = relPoles[r.id];

    // Burg populations (thousands).
    for (const b of burgs) {
      if (!b) continue;
      let p = (pop[b.cell] / 1000) * tr.float(0.3, 0.8) + suit[b.cell] / 30;
      if (b.capital) p *= 2.4;
      if (b.port) p *= 1.4;
      if (riverOf[b.cell]) p *= 1.2;
      b.population = Math.max(0.3, Math.round(p * 10) / 10);
      b.river = riverOf[b.cell] > 0;
      b.province = province[b.cell];
      b.religion = religion[b.cell];
    }

    mark('end');
    return {
      timing: timing.map(([l, t], i) => (i ? l + ':' + (t - timing[i - 1][1]) : '')).filter(Boolean).join(' '),
      seed, W, H, KM, SEA, grid, h, lake, feature, features, coast, temp, prec, elev, lat, biome, flux, riverOf, rivers, T,
      suit, pop, cultures, culture, states, state, relations, provinces, province, religions, religion, burgs, burgAt, routes, markers,
      lats, lons: [-((lats[0] - lats[1]) * W) / H / 2, ((lats[0] - lats[1]) * W) / H / 2],
      name: Carto.NameBases.name(rng.fork('world').pick(Carto.NameBases.ids), rng.fork('world-name'), 5, 10),
      isWater,
    };
  }

  function shade(hex, amt) {
    const v = parseInt(hex.slice(1), 16);
    const ch = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => Math.max(0, Math.min(255, Math.round(amt > 0 ? c + (255 - c) * amt : c * (1 + amt)))));
    return '#' + ch.map((c) => c.toString(16).padStart(2, '0')).join('');
  }

  Carto.World = { generate, BIOMES, TEMPLATES, buildGrid, shade, W, H, SEA };
})(window.Carto = window.Carto || {});
