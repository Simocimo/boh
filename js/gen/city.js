/* City generator: a walled medieval town grown from a Voronoi diagram.
   Patches (cells) become wards; rivers and roads are cut through the cell
   graph so that streets, bridges and walls all share exact edges. */
(function (Carto) {
  'use strict';

  const G = Carto.G, Svg = Carto.Svg, Draw = Carto.Draw, t = Carto.t;

  Carto.I18n.add({
    it: {
      'gen.city.name': 'Città',
      'gen.city.desc': 'Borghi e città murate con quartieri, porte, cittadella, fiume, porto e campagna.',
      'city.opt.size': 'Dimensione',
      'city.opt.size.small': 'Borgo',
      'city.opt.size.medium': 'Cittadina',
      'city.opt.size.large': 'Città',
      'city.opt.size.huge': 'Metropoli',
      'city.opt.water': 'Acqua',
      'city.opt.water.none': 'Nessuna',
      'city.opt.water.river': 'Fiume',
      'city.opt.water.coast': 'Costa',
      'city.opt.water.both': 'Fiume e costa',
      'city.opt.walls': 'Mura',
      'city.opt.citadel': 'Cittadella',
      'city.opt.plaza': 'Piazza del mercato',
      'city.opt.temple': 'Cattedrale',
      'city.opt.farms': 'Campi coltivati',
      'city.opt.labels': 'Nome e didascalie',
      'city.castle': 'Cittadella',
      'city.cathedral': 'Cattedrale',
      'city.market': 'Mercato',
      'city.harbour': 'Porto',
      'city.population': 'Abitanti (stima)',
      'city.buildings': 'Edifici',
      'city.gates': 'Porte',
      'city.districts': 'Quartieri',
      'ward.market': 'Piazza del mercato',
      'ward.temple': 'Cattedrale',
      'ward.castle': 'Cittadella',
      'ward.craftsmen': 'Artigiani',
      'ward.merchant': 'Mercanti',
      'ward.slum': 'Bassifondi',
      'ward.patriciate': 'Patrizi',
      'ward.administration': 'Palazzo del governo',
      'ward.military': 'Caserme',
      'ward.park': 'Giardini',
      'ward.harbour': 'Porto',
      'ward.shanty': 'Borgo fuori le mura',
      'ward.farm': 'Campi',
      'city.sub.small': 'borgo murato',
      'city.sub.medium': 'cittadina',
      'city.sub.large': 'città',
      'city.sub.huge': 'grande città',
      'city.sub.open': 'senza mura',
    },
    en: {
      'gen.city.name': 'City',
      'gen.city.desc': 'Towns and walled cities with districts, gates, citadel, river, harbour and countryside.',
      'city.opt.size': 'Size',
      'city.opt.size.small': 'Hamlet',
      'city.opt.size.medium': 'Town',
      'city.opt.size.large': 'City',
      'city.opt.size.huge': 'Metropolis',
      'city.opt.water': 'Water',
      'city.opt.water.none': 'None',
      'city.opt.water.river': 'River',
      'city.opt.water.coast': 'Coast',
      'city.opt.water.both': 'River and coast',
      'city.opt.walls': 'Walls',
      'city.opt.citadel': 'Citadel',
      'city.opt.plaza': 'Market square',
      'city.opt.temple': 'Cathedral',
      'city.opt.farms': 'Farmland',
      'city.opt.labels': 'Name and captions',
      'city.castle': 'Citadel',
      'city.cathedral': 'Cathedral',
      'city.market': 'Market',
      'city.harbour': 'Harbour',
      'city.population': 'Population (estimate)',
      'city.buildings': 'Buildings',
      'city.gates': 'Gates',
      'city.districts': 'Districts',
      'ward.market': 'Market square',
      'ward.temple': 'Cathedral',
      'ward.castle': 'Citadel',
      'ward.craftsmen': 'Craftsmen',
      'ward.merchant': 'Merchants',
      'ward.slum': 'Slums',
      'ward.patriciate': 'Patricians',
      'ward.administration': 'Government palace',
      'ward.military': 'Barracks',
      'ward.park': 'Gardens',
      'ward.harbour': 'Harbour',
      'ward.shanty': 'Outer borough',
      'ward.farm': 'Fields',
      'city.sub.small': 'walled hamlet',
      'city.sub.medium': 'market town',
      'city.sub.large': 'city',
      'city.sub.huge': 'great city',
      'city.sub.open': 'unwalled',
    },
  });

  const SIZES = { small: 12, medium: 22, large: 36, huge: 54 };
  const GATES = { small: 2, medium: 3, large: 4, huge: 5 };
  const CELL = 1700; // mean area of an inner patch, in square metres
  const W = { street: 6.5, alley: 2.4, road: 6, wall: 4.5, river: 13 };

  const key = (a, b) => (a.id < b.id ? a.id + '_' + b.id : b.id + '_' + a.id);

  // ------------------------------------------------------------- topology

  class Topo {
    constructor() {
      this.patches = [];
      this.byVertex = new Map();
      this.nextId = 0;
      this.edgeSets = [];
      this.paths = [];
    }
    vertex(x, y) { return { x, y, id: this.nextId++ }; }
    link(v, p) {
      let s = this.byVertex.get(v.id);
      if (!s) this.byVertex.set(v.id, (s = new Set()));
      s.add(p);
    }
    add(p) {
      this.patches.push(p);
      for (const v of p.verts) this.link(v, p);
      return p;
    }
    remove(p) {
      const i = this.patches.indexOf(p);
      if (i >= 0) this.patches.splice(i, 1);
      for (const v of p.verts) { const s = this.byVertex.get(v.id); if (s) s.delete(p); }
    }
    around(v) { return Array.from(this.byVertex.get(v.id) || []); }
    // Put q on the edge u-v everywhere it appears, keeping tracked edges and paths in sync.
    insert(u, v, q) {
      for (const p of this.around(u)) {
        const vs = p.verts, n = vs.length;
        for (let i = 0; i < n; i++) {
          const a = vs[i], b = vs[(i + 1) % n];
          if ((a === u && b === v) || (a === v && b === u)) {
            vs.splice(i + 1, 0, q);
            this.link(q, p);
            break;
          }
        }
      }
      const k = key(u, v);
      for (const set of this.edgeSets) {
        if (set.has(k)) { set.delete(k); set.add(key(u, q)); set.add(key(q, v)); }
      }
      for (const path of this.paths) {
        for (let i = 0; i + 1 < path.length; i++) {
          if ((path[i] === u && path[i + 1] === v) || (path[i] === v && path[i + 1] === u)) {
            path.splice(i + 1, 0, q);
            break;
          }
        }
      }
    }
    // Split a convex patch along the chord a-b (both are its vertices).
    split(p, a, b) {
      const vs = p.verts, n = vs.length;
      const ia = vs.indexOf(a), ib = vs.indexOf(b);
      const c1 = [], c2 = [];
      for (let i = ia; ; i = (i + 1) % n) { c1.push(vs[i]); if (i === ib) break; }
      for (let i = ib; ; i = (i + 1) % n) { c2.push(vs[i]); if (i === ia) break; }
      this.remove(p);
      return [this.add(Object.assign({}, p, { verts: c1 })), this.add(Object.assign({}, p, { verts: c2 }))];
    }
    edges() {
      const m = new Map();
      for (const p of this.patches) {
        const vs = p.verts, n = vs.length;
        for (let i = 0; i < n; i++) {
          const a = vs[i], b = vs[(i + 1) % n];
          const k = key(a, b);
          let e = m.get(k);
          if (!e) m.set(k, (e = { a, b, k, patches: [] }));
          e.patches.push(p);
        }
      }
      return m;
    }
  }

  function buildTopo(points, limit) {
    const { cells } = Carto.Voronoi.voronoi(points);
    const topo = new Topo();
    const grid = new Map();
    const cache = new Map();
    const canon = (v) => {
      const kx = Math.round(v.x), ky = Math.round(v.y);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const list = grid.get(kx + dx + ',' + (ky + dy));
          if (list) for (const w of list) if (G.dist2(w, v) < 0.5) return w;
        }
      }
      const w = topo.vertex(v.x, v.y);
      const k = kx + ',' + ky;
      if (!grid.has(k)) grid.set(k, []);
      grid.get(k).push(w);
      return w;
    };
    for (const c of cells) {
      if (c.open || G.len(c.site) > limit) continue;
      let vs = c.verts.map((v) => {
        let w = cache.get(v);
        if (!w) { w = canon(v); cache.set(v, w); }
        return w;
      });
      vs = vs.filter((v, i) => v !== vs[(i + 1) % vs.length]);
      if (vs.length < 3 || G.area(vs) < 1) continue;
      topo.add({ verts: vs, water: false, inner: false });
    }
    return topo;
  }

  // Patch that a ray from vertex v in direction dir enters.
  function enteredPatch(topo, v, dir, exclude) {
    for (const eps of [0.3, 1, 2.5]) {
      const probe = { x: v.x + dir.x * eps, y: v.y + dir.y * eps };
      for (const p of topo.around(v)) {
        if (exclude && exclude.includes(p)) continue;
        if (G.contains(p.verts, probe)) return p;
      }
    }
    return null;
  }

  function rayExit(p, cur, dir) {
    const vs = p.verts, n = vs.length;
    const far = { x: cur.x + dir.x * 1e5, y: cur.y + dir.y * 1e5 };
    let best = null;
    for (let i = 0; i < n; i++) {
      const a = vs[i], b = vs[(i + 1) % n];
      if (a === cur || b === cur) continue;
      const hit = G.segmentIntersect(cur, far, a, b);
      if (hit && hit.t > 1e-9 && (!best || hit.t < best.t)) best = { t: hit.t, point: { x: hit.x, y: hit.y }, u: a, v: b };
    }
    return best;
  }

  /* Walk from vertex `start`, cutting every patch crossed by the ray, steering
     as we go. Returns the vertices of the cut and the edges crossed. */
  function walkCut(topo, start, dir, o) {
    const path = [start];
    topo.paths.push(path);
    const crossed = [];
    let cur = start;
    let p = enteredPatch(topo, cur, dir);
    for (let step = 0; step < 300 && p; step++) {
      if (o.stop && o.stop(p)) break;
      const ex = rayExit(p, cur, dir);
      if (!ex) break;
      let q;
      const snap = o.snap || 3;
      if (G.dist(ex.point, ex.u) < snap) q = ex.u;
      else if (G.dist(ex.point, ex.v) < snap) q = ex.v;
      else {
        q = topo.vertex(ex.point.x, ex.point.y);
        crossed.push({ q, k: key(ex.u, ex.v), dir });
        topo.insert(ex.u, ex.v, q);
      }
      if (q === cur) break;
      const n = p.verts.length, i = p.verts.indexOf(cur), j = p.verts.indexOf(q);
      let halves = [p];
      if (j >= 0 && i >= 0 && (i + 1) % n !== j && (j + 1) % n !== i) halves = topo.split(p, cur, q);
      if (o.edges) o.edges.add(key(cur, q));
      path.push(q);
      cur = q;
      if (G.len(cur) > o.limit) break;
      let nd = o.steer ? o.steer(cur, dir) : dir;
      let np = enteredPatch(topo, cur, nd, halves);
      if (!np && nd !== dir) { nd = dir; np = enteredPatch(topo, cur, nd, halves); }
      dir = nd;
      p = np;
    }
    return { path, crossed };
  }

  // Link directed edges [a, b] into polylines: { pts, closed }.
  function linkEdges(edges) {
    const from = new Map();
    for (const e of edges) from.set(e[0].id, e);
    const hasIncoming = new Set(edges.map((e) => e[1].id));
    const used = new Set();
    const chains = [];
    const follow = (e0) => {
      const pts = [e0[0]];
      let e = e0;
      while (e && !used.has(e)) {
        used.add(e);
        pts.push(e[1]);
        e = from.get(e[1].id);
      }
      const closed = pts.length > 2 && pts[0] === pts[pts.length - 1];
      if (closed) pts.pop();
      chains.push({ pts, closed });
    };
    for (const e of edges) if (!hasIncoming.has(e[0].id) && !used.has(e)) follow(e);
    for (const e of edges) if (!used.has(e)) follow(e);
    return chains;
  }

  class Heap {
    constructor() { this.a = []; }
    get size() { return this.a.length; }
    push(pri, val) {
      const a = this.a;
      a.push([pri, val]);
      let i = a.length - 1;
      while (i > 0) {
        const j = (i - 1) >> 1;
        if (a[j][0] <= a[i][0]) break;
        [a[i], a[j]] = [a[j], a[i]];
        i = j;
      }
    }
    pop() {
      const a = this.a, top = a[0], last = a.pop();
      if (a.length) {
        a[0] = last;
        let i = 0;
        for (;;) {
          const l = 2 * i + 1, r = l + 1;
          let m = i;
          if (l < a.length && a[l][0] < a[m][0]) m = l;
          if (r < a.length && a[r][0] < a[m][0]) m = r;
          if (m === i) break;
          [a[i], a[m]] = [a[m], a[i]];
          i = m;
        }
      }
      return top;
    }
  }

  function shortestPath(adj, start, isTarget, cost) {
    const dist = new Map([[start.id, 0]]);
    const prev = new Map();
    const heap = new Heap();
    heap.push(0, start);
    while (heap.size) {
      const [d, v] = heap.pop();
      if (d > dist.get(v.id)) continue;
      if (isTarget(v)) {
        const path = [v];
        let c = v;
        while (prev.has(c.id)) { c = prev.get(c.id); path.unshift(c); }
        return path;
      }
      for (const e of adj.get(v.id) || []) {
        const nd = d + cost(e);
        if (nd < (dist.has(e.to.id) ? dist.get(e.to.id) : Infinity)) {
          dist.set(e.to.id, nd);
          prev.set(e.to.id, v);
          heap.push(nd, e.to);
        }
      }
    }
    return null;
  }

  // ------------------------------------------------------------- building lots

  function subdivide(rng, poly, o) {
    const out = [];
    const stack = [poly];
    let guard = 0;
    while (stack.length && guard++ < 5000) {
      const p = stack.pop();
      const a = G.area(p);
      if (a < o.min * (0.6 + rng.next() * 0.8)) { out.push(p); continue; }
      const i = G.longestEdge(p);
      const A = p[i], B = p[(i + 1) % p.length];
      const pt = G.lerp(A, B, 0.5 + rng.float(-0.22, 0.22) * o.chaos);
      const dir = G.rotate(G.perp(G.sub(B, A)), rng.float(-0.22, 0.22) * o.chaos);
      const gap = a > o.min * 5 && rng.bool(o.alleys) ? W.alley * 0.8 : 0;
      const parts = G.splitConvex(p, pt, dir, gap);
      if (parts.length < 2) { out.push(p); continue; }
      for (const q of parts) if (G.area(q) > o.min * 0.12) stack.push(q);
    }
    return out;
  }

  const WARD = {
    craftsmen: { min: 85, chaos: 0.6, alleys: 0.22, empty: 0.03, court: 0.55 },
    merchant: { min: 120, chaos: 0.4, alleys: 0.18, empty: 0.02, court: 0.45 },
    slum: { min: 42, chaos: 0.95, alleys: 0.35, empty: 0.1, court: 0.25 },
    patriciate: { min: 300, chaos: 0.35, alleys: 0.08, empty: 0.12, court: 0.9, garden: true },
    administration: { min: 520, chaos: 0.2, alleys: 0.05, empty: 0.05, court: 1, garden: true },
    military: { min: 230, chaos: 0.12, alleys: 0.3, empty: 0.08, court: 0.9 },
    harbour: { min: 140, chaos: 0.35, alleys: 0.25, empty: 0.06, court: 0.5 },
    shanty: { min: 48, chaos: 1, alleys: 0.3, empty: 0.3, court: 1 },
    temple: { min: 95, chaos: 0.5, alleys: 0.2, empty: 0.05, court: 0.6 },
  };

  function touchesBoundary(lot, block) {
    for (const p of lot) if (G.distToPolyline(p, block, true) < 0.6) return true;
    return false;
  }

  function buildings(rng, block, type) {
    const o = WARD[type] || WARD.craftsmen;
    const lots = subdivide(rng, block, o);
    const res = { buildings: [], gardens: [] };
    for (const lot of lots) {
      if (lot.length < 3 || G.compactness(lot) < 0.22) continue;
      const outer = touchesBoundary(lot, block);
      if (!outer && rng.bool(o.court)) {
        if (o.garden) res.gardens.push(lot);
        continue;
      }
      if (rng.bool(o.empty)) {
        if (o.garden) res.gardens.push(lot);
        continue;
      }
      let b = lot;
      if (o.garden && G.area(lot) > 160) {
        // Mansions stand back from the plot edges, surrounded by gardens.
        res.gardens.push(lot);
        b = G.insetConvex(lot, 2.2);
        if (b.length < 3) continue;
      }
      res.buildings.push(b);
    }
    return res;
  }

  function trees(rng, poly, spacing, rMin, rMax) {
    if (poly.length < 3) return [];
    const bb = G.bbox(poly);
    const pts = G.poissonDisc(rng, bb.x0, bb.y0, bb.w, bb.h, spacing, (p) => G.contains(poly, p) && G.distToPolyline(p, poly, true) > rMin * 0.8);
    return pts.map((p) => ({ x: p.x, y: p.y, r: rng.float(rMin, rMax) }));
  }

  // Cathedral outline: a nave with transept and apse, in local coordinates.
  function cathedralShape(L, Wd) {
    const hw = Wd / 2, u0 = L * 0.12, tw = Wd * 0.85, te = Wd * 0.95;
    const pts = [
      [-L / 2, -hw], [u0 - tw / 2, -hw], [u0 - tw / 2, -te], [u0 + tw / 2, -te], [u0 + tw / 2, -hw], [L / 2 - hw, -hw],
    ];
    for (let i = 1; i < 8; i++) {
      const a = -Math.PI / 2 + (i / 8) * Math.PI;
      pts.push([L / 2 - hw + Math.cos(a) * hw, Math.sin(a) * hw]);
    }
    pts.push([L / 2 - hw, hw], [u0 + tw / 2, hw], [u0 + tw / 2, te], [u0 - tw / 2, te], [u0 - tw / 2, hw], [-L / 2, hw]);
    return pts;
  }

  function placeShape(local, f, block, s0 = 1) {
    for (let s = s0; s > 0.3; s *= 0.9) {
      const pts = local.map(([x, y]) => G.add(f.c, G.add(G.scale(f.u, x * s), G.scale(f.v, y * s))));
      if (pts.every((p) => G.contains(block, p))) return pts;
    }
    return null;
  }

  function trimStart(pts, d) {
    const out = pts.slice();
    while (out.length > 1 && d > 0) {
      const l = G.dist(out[0], out[1]);
      if (l > d) { out[0] = G.lerp(out[0], out[1], d / l); return out; }
      d -= l;
      out.shift();
    }
    return out.length > 1 ? out : [];
  }
  const trimEnd = (pts, d) => trimStart(pts.slice().reverse(), d).reverse();

  // ------------------------------------------------------------- generation

  function generate(seed, opts) {
    const rng = new Carto.Random(seed);
    const nInner = SIZES[opts.size] || SIZES.medium;
    const Rc = Math.sqrt((nInner * CELL) / Math.PI);
    const M = Math.round(Rc * 1.45 + 70);
    const water = opts.water || 'river';
    const hasRiver = water === 'river' || water === 'both';
    const hasCoast = water === 'coast' || water === 'both';
    const noise = new Carto.Noise(rng.fork('noise'));

    // 1. Seed points: a sunflower spiral inside, a looser scatter outside.
    const pr = rng.fork('points');
    const pts = [];
    const s = Math.sqrt(CELL / Math.PI);
    const n1 = Math.round(nInner * 2.4);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const a0 = pr.float(0, Math.PI * 2);
    for (let i = 0; i < n1; i++) {
      const r = s * Math.sqrt(i + 0.5) * (1 + pr.float(-0.1, 0.1));
      const a = a0 + i * golden + pr.float(-0.3, 0.3);
      pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
    }
    const rIn = s * Math.sqrt(n1);
    const R = M * 1.6;
    const outer = G.poissonDisc(pr, -R, -R, 2 * R, 2 * R, 60, (p) => {
      const d = G.len(p);
      return d > rIn + 24 && d < R;
    });
    const relaxed = Carto.Voronoi.relax(pts.concat(outer), 2, (p) => G.len(p) < M * 1.35);
    const topo = buildTopo(relaxed, M * 1.5);

    // 2. Coast.
    let coastDir = null;
    if (hasCoast) {
      coastDir = G.fromAngle(rng.float(0, Math.PI * 2));
      const reach = Rc * rng.float(0.55, 0.9);
      for (const p of topo.patches) {
        const c = G.centroid(p.verts);
        if (G.dot(c, coastDir) + noise.fbm(c.x * 0.004, c.y * 0.004, 3) * Rc * 0.45 > reach) p.water = true;
      }
    }

    // 3. River, cut through the patches.
    const riverEdges = new Set(), roadEdges = new Set();
    topo.edgeSets.push(riverEdges, roadEdges);
    let river = null;
    const bridges = [];
    if (hasRiver) {
      const rr = rng.fork('river');
      const theta = coastDir ? G.angle(coastDir) + rr.float(-0.5, 0.5) : rr.float(0, Math.PI * 2);
      const side = G.scale(G.perp(G.fromAngle(theta)), Rc * rr.float(0.12, 0.32) * rr.sign());
      let start = null, best = Infinity;
      for (const p of topo.patches) {
        if (p.water) continue;
        for (const v of p.verts) {
          const d = G.dist(v, side);
          if (d < best && topo.around(v).every((q) => !q.water)) { best = d; start = v; }
        }
      }
      if (start) {
        const steerTo = (target) => (cur, dir) => {
          const wob = noise.get(cur.x * 0.012 + 40, cur.y * 0.012) * 0.55;
          return G.norm(G.add(G.scale(G.rotate(dir, wob), 0.72), G.scale(target, 0.28)));
        };
        const fwdDir = G.fromAngle(theta), backDir = G.fromAngle(theta + Math.PI);
        const opt = (target) => ({ steer: steerTo(target), stop: (p) => p.water, limit: M * 1.45, edges: riverEdges, snap: 4 });
        const fwd = walkCut(topo, start, fwdDir, opt(fwdDir));
        const back = walkCut(topo, start, backDir, opt(backDir));
        river = back.path.slice().reverse().concat(fwd.path.slice(1));
        topo.paths.push(river);
      }
    }

    // 4. Grow the city from the centre.
    let edges = topo.edges();
    const neighbours = (p) => {
      const out = [];
      const vs = p.verts;
      for (let i = 0; i < vs.length; i++) {
        const e = edges.get(key(vs[i], vs[(i + 1) % vs.length]));
        for (const q of e.patches) if (q !== p && !out.includes(q)) out.push(q);
      }
      return out;
    };
    const land = topo.patches.filter((p) => !p.water);
    let first = null, bd = Infinity;
    for (const p of land) {
      const d = G.len(G.centroid(p.verts));
      if (d < bd && G.area(p.verts) > CELL * 0.3) { bd = d; first = p; }
    }
    const heap = new Heap();
    const seen = new Set([first]);
    heap.push(0, first);
    let area = 0;
    const target = nInner * CELL;
    while (heap.size && area < target) {
      const [, p] = heap.pop();
      p.inner = true;
      area += G.area(p.verts);
      for (const q of neighbours(p)) {
        if (seen.has(q) || q.water) continue;
        seen.add(q);
        const c = G.centroid(q.verts);
        heap.push(G.len(c) * (1 + 0.3 * noise.get(c.x * 0.01, c.y * 0.01)), q);
      }
    }
    for (const p of land) {
      if (p.inner) continue;
      const nb = neighbours(p);
      if (nb.length >= 2 && nb.every((q) => q.inner || q.water)) p.inner = true;
    }
    const inner = () => topo.patches.filter((p) => p.inner);

    // 5. Landmarks: market square, cathedral, citadel.
    let plaza = null;
    {
      let bs = Infinity;
      for (const p of inner()) {
        const a = G.area(p.verts);
        if (a < CELL * 0.45) continue;
        const sc = G.len(G.centroid(p.verts)) / Math.sqrt(a);
        if (sc < bs) { bs = sc; plaza = p; }
      }
      if (!plaza) plaza = first;
      plaza.type = opts.plaza ? 'market' : null;
      plaza.plaza = true;
    }
    if (opts.temple) {
      let bt = null, ba = 0;
      for (const q of neighbours(plaza)) {
        if (!q.inner || q.type) continue;
        const a = G.area(q.verts) * G.compactness(q.verts);
        if (a > ba) { ba = a; bt = q; }
      }
      if (bt) bt.type = 'temple';
    }
    const isBoundary = (p) => neighbours(p).some((q) => !q.inner && !q.water);
    if (opts.citadel) {
      let bc = null, bs = 0;
      for (const p of inner()) {
        if (p.type || p.plaza || !isBoundary(p)) continue;
        const a = G.area(p.verts);
        if (a < CELL * 0.7) continue;
        const sc = a * Math.pow(G.compactness(p.verts), 2) * (0.5 + G.len(G.centroid(p.verts)) / Rc) * rng.float(0.8, 1.2);
        if (sc > bs) { bs = sc; bc = p; }
      }
      if (bc) bc.type = 'castle';
    }

    // 6. Walls and gates.
    const wallEdges = [];
    for (const p of inner()) {
      const vs = p.verts;
      for (let i = 0; i < vs.length; i++) {
        const a = vs[i], b = vs[(i + 1) % vs.length];
        const e = edges.get(key(a, b));
        const o = e.patches.find((q) => q !== p);
        if (o && (o.inner || o.water)) continue;
        if (riverEdges.has(e.k) || p.type === 'castle') continue;
        wallEdges.push([a, b]);
      }
    }
    const wallChains = linkEdges(wallEdges);
    const riverVerts = new Set((river || []).map((v) => v.id));
    const castleVerts = new Set();
    for (const p of inner()) if (p.type === 'castle') for (const v of p.verts) castleVerts.add(v.id);

    const gateCandidates = [];
    for (const ch of wallChains) {
      const n = ch.pts.length;
      for (let i = 0; i < n; i++) {
        if (!ch.closed && (i === 0 || i === n - 1)) continue;
        const v = ch.pts[i];
        if (riverVerts.has(v.id) || castleVerts.has(v.id)) continue;
        const around = topo.around(v);
        if (around.some((p) => p.water)) continue;
        if (!around.some((p) => !p.inner)) continue;
        const innerStreet = Array.from(edges.values()).some((e) => (e.a === v || e.b === v) &&
          e.patches.length === 2 && e.patches.every((q) => q.inner && q.type !== 'castle') && !riverEdges.has(e.k));
        if (innerStreet) gateCandidates.push(v);
      }
    }
    const gr = rng.fork('gates');
    const gates = [];
    const nGates = Math.min(gateCandidates.length, GATES[opts.size] || 3);
    if (nGates) gates.push(gr.pick(gateCandidates));
    while (gates.length < nGates) {
      let bv = null, bs = -1;
      for (const v of gateCandidates) {
        if (gates.includes(v)) continue;
        let m = Infinity;
        for (const g of gates) {
          let da = Math.abs(G.angle(v) - G.angle(g));
          if (da > Math.PI) da = 2 * Math.PI - da;
          m = Math.min(m, da);
        }
        m *= gr.float(0.85, 1.15);
        if (m > bs) { bs = m; bv = v; }
      }
      if (!bv || bs < 0.5) break;
      gates.push(bv);
    }

    // 7. Roads out of the gates, cut through the countryside.
    const roads = [];
    for (const g of gates) {
      const out = G.norm(g);
      let dir = null;
      for (const da of [0, 0.25, -0.25, 0.5, -0.5, 0.8, -0.8, 1.1, -1.1]) {
        const d = G.rotate(out, da);
        const p = enteredPatch(topo, g, d);
        if (p && !p.inner && !p.water) { dir = d; break; }
      }
      if (!dir) continue;
      const steer = (cur, d) => {
        const wob = noise.get(cur.x * 0.01, cur.y * 0.01 + 77) * 0.35;
        return G.norm(G.add(G.scale(G.rotate(d, wob), 0.8), G.scale(out, 0.2)));
      };
      const res = walkCut(topo, g, dir, { steer, stop: (p) => p.inner || p.water, limit: M * 1.45, edges: roadEdges, snap: 3 });
      roads.push(res.path);
    }
    // The river path is tracked by the topology, so crossings now appear in it.
    const riverNow = new Set((river || []).map((v) => v.id));

    // 8. Main streets from each gate to the market.
    edges = topo.edges();
    const adj = new Map();
    const addAdj = (a, b, e) => {
      if (!adj.has(a.id)) adj.set(a.id, []);
      adj.get(a.id).push({ to: b, k: e.k, len: G.dist(a, b) });
    };
    for (const e of edges.values()) {
      if (e.patches.length !== 2 || !e.patches.every((p) => p.inner) || riverEdges.has(e.k)) continue;
      addAdj(e.a, e.b, e);
      addAdj(e.b, e.a, e);
    }
    const plazaVerts = new Set(plaza.verts.map((v) => v.id));
    const streetEdges = new Set();
    const streets = [];
    for (const g of gates) {
      const path = shortestPath(adj, g, (v) => plazaVerts.has(v.id), (e) => e.len * (streetEdges.has(e.k) ? 0.45 : 1));
      if (!path) continue;
      streets.push(path);
      for (let i = 0; i + 1 < path.length; i++) streetEdges.add(key(path[i], path[i + 1]));
      for (let i = 1; i + 1 < path.length; i++) {
        if (riverNow.has(path[i].id)) {
          bridges.push({ p: path[i], dir: G.norm(G.sub(path[i + 1], path[i - 1])), w: W.street * 0.9 });
        }
      }
    }
    // Bridges where outer roads cross the river.
    if (river) {
      for (const road of roads) {
        for (let i = 1; i < road.length - 1; i++) {
          if (riverNow.has(road[i].id) && !bridges.some((b) => b.p === road[i])) {
            bridges.push({ p: road[i], dir: G.norm(G.sub(road[i + 1], road[i - 1])), w: W.road });
          }
        }
      }
    }

    // 9. Ward types.
    const wr = rng.fork('wards');
    let admin = false, parks = 0;
    const waterSide = (p) => neighbours(p).some((q) => q.water);
    for (const p of inner()) {
      if (p.type || p.plaza) continue;
      const a = G.area(p.verts);
      if (a < 160) { p.type = 'empty'; continue; }
      const c = G.centroid(p.verts);
      const d = Math.min(1.2, G.len(c) / Rc);
      const onStreet = p.verts.some((v, i) => streetEdges.has(key(v, p.verts[(i + 1) % p.verts.length])));
      const nearPlaza = neighbours(p).includes(plaza);
      const choices = [
        ['craftsmen', 3],
        ['merchant', (nearPlaza || onStreet ? 2.6 : 0.6) * (1.2 - d)],
        ['patriciate', d < 0.6 ? 1.6 * (1 - d) : 0.15],
        ['slum', d > 0.55 ? 1.8 * d : 0.08],
        ['military', opts.walls && isBoundary(p) ? 0.6 : 0],
        ['park', parks < 1 + (nInner > 30 ? 1 : 0) ? 0.3 : 0],
        ['administration', !admin && d < 0.55 ? 0.9 : 0],
        ['harbour', hasCoast && waterSide(p) ? 5 : 0],
      ];
      p.type = wr.weighted(choices);
      if (p.type === 'administration') admin = true;
      if (p.type === 'park') parks++;
    }
    for (const p of topo.patches) {
      if (p.inner || p.water) continue;
      const c = G.centroid(p.verts);
      const dc = G.len(c) / Rc;
      const roadside = p.verts.some((v, i) => roadEdges.has(key(v, p.verts[(i + 1) % p.verts.length])));
      const forest = noise.fbm(c.x * 0.006 + 300, c.y * 0.006, 3);
      if (opts.walls && roadside && dc < 1.55 && wr.bool(0.6)) p.type = 'shanty';
      else if (forest > 0.28 && dc > 1.2) p.type = 'wood';
      else if (opts.farms) p.type = wr.bool(0.12) ? 'meadow' : 'farm';
      else p.type = forest > 0 ? 'wood' : 'meadow';
    }

    // 10. Geometry of each ward.
    const br = rng.fork('buildings');
    const wards = [];
    let castle = null;
    const landmarks = [];
    for (const p of topo.patches) {
      if (p.water) continue;
      const vs = p.verts, n = vs.length;
      const ins = vs.map((a, i) => {
        const b = vs[(i + 1) % n];
        const k = key(a, b);
        const e = edges.get(k);
        const o = e.patches.find((q) => q !== p);
        if (riverEdges.has(k)) return W.river / 2 + 2.5;
        if (!o) return 1;
        if (o.water) return p.inner ? 2.5 : 1.5;
        if (p.inner) {
          if (!o.inner) return p.type === 'castle' ? 2 : opts.walls ? W.wall / 2 + 3.5 : 2;
          if (streetEdges.has(k)) return W.street / 2;
          if (o.plaza || p.plaza) return W.street / 2.6;
          return W.alley / 2;
        }
        if (roadEdges.has(k)) return W.road / 2;
        if (o.inner) return opts.walls ? W.wall / 2 + 9 : 3;
        return 1.2;
      });
      const block = G.insetConvex(vs, ins);
      if (block.length < 3 || G.area(block) < 30) continue;
      const w = { type: p.type, inner: p.inner, block, buildings: [], gardens: [], trees: [], fields: [] };
      const c = G.centroid(block);
      switch (p.type) {
        case 'market': {
          w.square = true;
          const fa = G.area(block);
          if (fa > 500) w.fountain = { x: c.x, y: c.y, r: 3.2 };
          const stalls = Math.round(fa / 260);
          const f = G.frame(block);
          for (let i = 0, tries = 0; i < stalls && tries < 200; tries++) {
            const q = G.add(c, G.add(G.scale(f.u, br.float(-0.45, 0.45) * f.w), G.scale(f.v, br.float(-0.45, 0.45) * f.h)));
            const r = G.rect(q.x, q.y, br.float(3.5, 5), br.float(2.4, 3), Math.atan2(f.u.y, f.u.x) + (br.bool() ? 0 : Math.PI / 2));
            if (!r.every((x) => G.contains(G.insetConvex(block, 2.5), x))) continue;
            if (w.fountain && G.dist(q, c) < 9) continue;
            if (w.buildings.some((b) => G.convexOverlap(b, r, 1.6))) continue;
            w.buildings.push(r);
            i++;
          }
          w.stalls = true;
          landmarks.push({ key: 'city.market', x: c.x, y: c.y + (w.fountain ? 9 : 0) });
          break;
        }
        case 'temple': {
          const f = G.frame(block);
          const L = f.w * 0.66, Wd = Math.min(f.h * 0.42, L * 0.36);
          const cath = placeShape(cathedralShape(L, Wd), f, G.insetConvex(block, 2));
          if (cath) {
            w.special = [cath];
            const bb = G.rect(f.c.x, f.c.y, L + 9, Wd * 2 + 9, Math.atan2(f.u.y, f.u.x));
            const res = buildings(br, block, 'temple');
            w.buildings = res.buildings.filter((b) => !G.convexOverlap(b, bb, 0));
            w.yard = true;
            landmarks.push({ key: 'city.cathedral', x: f.c.x, y: f.c.y - Wd * 1.1 - 5 });
          } else Object.assign(w, buildings(br, block, 'craftsmen'));
          break;
        }
        case 'castle': {
          const f = G.frame(block);
          const side = Math.min(f.w, f.h) * 0.36;
          const keep = placeShape([[-side / 2, -side / 2], [side / 2, -side / 2], [side / 2, side / 2], [-side / 2, side / 2]], f, G.insetConvex(block, 6));
          const innerArea = G.insetConvex(block, 6.5);
          const res = innerArea.length >= 3 ? buildings(br, innerArea, 'military') : { buildings: [] };
          w.buildings = res.buildings.filter((b) => touchesBoundary(b, innerArea) && (!keep || !G.convexOverlap(b, keep, 3)));
          if (keep) w.special = [keep];
          // Gate on the side facing the town centre.
          let gi = 0, gs = -Infinity;
          for (let i = 0; i < block.length; i++) {
            const m = G.mid(block[i], block[(i + 1) % block.length]);
            const sc = -G.len(m) + G.dist(block[i], block[(i + 1) % block.length]) * 0.3;
            if (sc > gs) { gs = sc; gi = i; }
          }
          castle = { wall: block, gate: gi };
          landmarks.push({ key: 'city.castle', x: c.x, y: c.y + (keep ? side * 0.5 + 8 : 0) });
          break;
        }
        case 'park': {
          w.green = true;
          w.trees = trees(br, G.insetConvex(block, 1.5), 7.5, 3, 4.6);
          break;
        }
        case 'harbour': {
          Object.assign(w, buildings(br, block, 'harbour'));
          w.piers = [];
          for (let i = 0; i < n; i++) {
            const a = vs[i], b = vs[(i + 1) % n];
            const e = edges.get(key(a, b));
            const o = e.patches.find((q) => q !== p);
            if (!o || !o.water) continue;
            const len = G.dist(a, b);
            const out = G.norm(G.perp(G.sub(a, b)));
            const cw = G.signedArea(vs) >= 0;
            const nrm = cw ? out : G.scale(out, -1);
            for (let k = 1; k * 20 < len; k++) {
              if (!br.bool(0.75)) continue;
              const q = G.lerp(a, b, (k * 20) / len);
              const L = br.float(14, 24);
              const m = G.add(q, G.scale(nrm, L / 2 - 1));
              w.piers.push(G.rect(m.x, m.y, 3.2, L, Math.atan2(nrm.y, nrm.x) + Math.PI / 2));
            }
          }
          if (!landmarks.some((l) => l.key === 'city.harbour')) landmarks.push({ key: 'city.harbour', x: c.x, y: c.y, offshore: true });
          break;
        }
        case 'farm': {
          let parts = [block];
          const cuts = br.int(0, 2);
          for (let i = 0; i < cuts; i++) {
            const big = parts.sort((x, y) => G.area(y) - G.area(x)).shift();
            const f = G.frame(big);
            const q = G.add(f.c, G.scale(f.u, br.float(-0.2, 0.2) * f.w));
            const halves = G.splitConvex(big, q, G.rotate(f.v, br.float(-0.3, 0.3)), 1.6);
            parts = parts.concat(halves.length ? halves : [big]);
          }
          for (const part of parts) {
            if (G.area(part) < 80) continue;
            const kind = br.weighted([['field', 5], ['fieldAlt', 3], ['meadow', 1.5]]);
            const f = G.frame(part);
            const dir = br.bool(0.7) ? f.u : f.v;
            w.fields.push({ poly: part, kind, furrows: kind === 'meadow' ? [] : G.stripes(G.insetConvex(part, 1), dir, 3.4, br.next()) });
          }
          if (br.bool(0.35)) {
            const i = br.int(0, block.length - 1);
            const a = block[i], b = block[(i + 1) % block.length];
            const dir = G.norm(G.sub(b, a));
            const q = G.add(G.lerp(a, b, 0.3), G.scale(G.norm(G.sub(c, a)), 7));
            const house = G.rect(q.x, q.y, br.float(8, 11), br.float(5.5, 7), Math.atan2(dir.y, dir.x));
            if (house.every((x) => G.contains(block, x))) {
              w.buildings.push(house);
              w.fields = w.fields.map((fl) => Object.assign(fl, { furrows: fl.furrows.filter((s2) => !G.convexOverlap([s2[0], s2[1], s2[0]], G.scalePoly(house, 1.6), 0)) }));
            }
          }
          // Hedgerow along one edge.
          if (br.bool(0.45)) {
            const i = br.int(0, block.length - 1);
            const a = block[i], b = block[(i + 1) % block.length];
            const len = G.dist(a, b);
            for (let d = 3; d < len - 3; d += br.float(4, 7)) {
              const q = G.lerp(a, b, d / len);
              w.trees.push({ x: q.x, y: q.y, r: br.float(2.4, 3.6) });
            }
          }
          break;
        }
        case 'wood': {
          w.wood = true;
          w.trees = trees(br, block, 6, 3.2, 4.8);
          break;
        }
        case 'meadow': {
          w.meadow = true;
          w.trees = trees(br, block, 22, 3, 4.5).filter(() => br.bool(0.6));
          break;
        }
        case 'shanty': {
          const res = buildings(br, block, 'shanty');
          const roadSegs = [];
          for (let i = 0; i < n; i++) {
            if (roadEdges.has(key(vs[i], vs[(i + 1) % n]))) roadSegs.push([vs[i], vs[(i + 1) % n]]);
          }
          w.buildings = res.buildings.filter((b) => {
            const bc = G.centroid(b);
            return roadSegs.some(([a, b2]) => G.distToSegment(bc, a, b2) < 18);
          });
          if (opts.farms) {
            const f = G.frame(block);
            w.fields.push({ poly: block, kind: 'meadow', furrows: [] });
            void f;
          }
          break;
        }
        case 'empty':
          break;
        default: {
          const type = p.type || 'craftsmen';
          Object.assign(w, buildings(br, block, type));
          if (WARD[type] && WARD[type].garden) {
            for (const gd of w.gardens) if (G.area(gd) > 120 && br.bool(0.7)) w.trees.push(...trees(br, gd, 8, 2.6, 3.8));
          }
        }
      }
      wards.push(w);
    }

    // 11. Wall polylines with gates cut out, and towers.
    const walls = [], towers = [], gateTowers = [];
    if (opts.walls) {
      const gateSet = new Set(gates.map((g) => g.id));
      for (const ch of wallChains) {
        let pts = ch.pts.slice();
        if (ch.closed) {
          // Start the ring at a gate so the cut is clean.
          const gi = pts.findIndex((v) => gateSet.has(v.id));
          if (gi >= 0) pts = pts.slice(gi).concat(pts.slice(0, gi + 1));
          else pts.push(pts[0]);
        }
        let cur = [pts[0]];
        const pieces = [];
        for (let i = 1; i < pts.length; i++) {
          cur.push(pts[i]);
          if (gateSet.has(pts[i].id) && i < pts.length - 1) { pieces.push(cur); cur = [pts[i]]; }
        }
        pieces.push(cur);
        for (let piece of pieces) {
          const startsAtGate = gateSet.has(piece[0].id);
          const endsAtGate = gateSet.has(piece[piece.length - 1].id);
          let line = piece.map((v) => ({ x: v.x, y: v.y }));
          if (startsAtGate) { gateTowers.push(trimStart(line, 7)[0]); line = trimStart(line, 7); }
          if (endsAtGate && line.length) { line = trimEnd(line, 7); gateTowers.push(line[line.length - 1]); }
          if (line.length < 2) continue;
          walls.push(line);
          for (let i = 0; i < line.length; i++) {
            if ((i === 0 && startsAtGate) || (i === line.length - 1 && endsAtGate)) continue;
            towers.push(line[i]);
            if (i + 1 < line.length) {
              const l = G.dist(line[i], line[i + 1]);
              const k = Math.floor(l / 42);
              for (let j = 1; j <= k; j++) towers.push(G.lerp(line[i], line[i + 1], j / (k + 1)));
            }
          }
        }
      }
    }
    // Remove towers that crowd each other.
    const towerList = [];
    for (const tw of towers) if (!towerList.some((q) => G.dist(q, tw) < 9)) towerList.push(tw);

    // 12. Sea outline.
    const seaEdges = [];
    for (const p of topo.patches) {
      if (!p.water) continue;
      const vs = p.verts;
      for (let i = 0; i < vs.length; i++) {
        const a = vs[i], b = vs[(i + 1) % vs.length];
        const e = edges.get(key(a, b));
        if (e.patches.some((q) => q !== p && q.water)) continue;
        seaEdges.push([a, b]);
      }
    }
    const sea = linkEdges(seaEdges).map((c) => ({ pts: c.pts.map((v) => ({ x: v.x, y: v.y })), closed: c.closed }));

    const name = opts.name ? opts.name : Carto.Names.place(rng.fork('name'));
    const nb = wards.reduce((s2, w) => s2 + (w.inner ? w.buildings.length : 0), 0);
    const total = wards.reduce((s2, w) => s2 + w.buildings.length, 0);
    const census = {};
    for (const p of inner()) if (p.type && p.type !== 'empty') census[p.type] = (census[p.type] || 0) + 1;

    return {
      seed, name, size: opts.size, M, Rc, walls: opts.walls,
      wards, sea, river: river ? river.map((v) => ({ x: v.x, y: v.y })) : null,
      roads: roads.map((r) => r.map((v) => ({ x: v.x, y: v.y }))),
      wallLines: walls, towers: towerList, gateTowers, castle, bridges, landmarks,
      population: Math.round((nb * 6.2 + (total - nb) * 4) / 50) * 50,
      buildingCount: total, gateCount: gates.length, census,
    };
  }

  // ------------------------------------------------------------- rendering

  function render(m, o) {
    const pal = o.palette;
    const M = m.M, S = 2 * M;
    const svg = new Svg(S, S);
    const clip = Carto.uid('cityclip');
    svg.defs('<clipPath id="' + clip + '"><rect x="' + -M + '" y="' + -M + '" width="' + S + '" height="' + S + '"/></clipPath>');
    svg.rect(0, 0, S, S, { fill: pal.paper });
    svg.open({ transform: 'translate(' + M + ' ' + M + ')', clipPath: 'url(#' + clip + ')' });

    const lw = 0.7; // building outline width

    // Countryside.
    const fieldA = new Svg.Batch(), fieldB = new Svg.Batch(), meadow = new Svg.Batch(), furrows = new Svg.Batch();
    const woods = new Svg.Batch();
    for (const w of m.wards) {
      for (const f of w.fields) {
        (f.kind === 'field' ? fieldA : f.kind === 'fieldAlt' ? fieldB : meadow).poly(f.poly);
        for (const s of f.furrows) furrows.line(s[0], s[1]);
      }
      if (w.wood) woods.poly(w.block);
      if (w.meadow) meadow.poly(w.block);
    }
    svg.path(meadow.toString(), { fill: pal.green, stroke: pal.fieldInk, strokeWidth: 0.6, opacity: 0.55 });
    svg.path(fieldA.toString(), { fill: pal.field, stroke: pal.fieldInk, strokeWidth: 0.6 });
    svg.path(fieldB.toString(), { fill: pal.fieldAlt, stroke: pal.fieldInk, strokeWidth: 0.6 });
    svg.path(furrows.toString(), { stroke: pal.fieldInk, strokeWidth: 0.5, fill: 'none', opacity: 0.8 });
    svg.path(woods.toString(), { fill: pal.green, opacity: 0.5 });

    // Roads outside the walls: a casing line and the road surface.
    const roadB = new Svg.Batch();
    for (const r of m.roads) roadB.poly(r, false);
    svg.path(roadB.toString(), { fill: 'none', stroke: pal.inkSoft, strokeWidth: W.road + 1.2, strokeLinejoin: 'round', strokeLinecap: 'round', opacity: 0.55 });
    svg.path(roadB.toString(), { fill: 'none', stroke: pal.road, strokeWidth: W.road, strokeLinejoin: 'round', strokeLinecap: 'round' });

    // Sea, with fading bands along the shore.
    if (m.sea.length) {
      const seaB = new Svg.Batch();
      for (const s of m.sea) seaB.smooth(G.chaikin(s.pts, 2, s.closed), s.closed);
      const sd = seaB.toString();
      const sclip = Carto.uid('seaclip');
      svg.defs('<clipPath id="' + sclip + '"><path d="' + sd + '"/></clipPath>');
      svg.path(sd, { fill: pal.water, fillRule: 'evenodd' });
      svg.open({ clipPath: 'url(#' + sclip + ')' });
      for (const [wd, op] of [[26, 0.12], [14, 0.2], [6, 0.35]]) {
        svg.path(sd, { fill: 'none', stroke: pal.waterInk, strokeWidth: wd, opacity: op, strokeLinejoin: 'round' });
      }
      svg.close();
      svg.path(sd, { fill: 'none', stroke: pal.ink, strokeWidth: 1.1, strokeLinejoin: 'round' });
    }

    // River.
    if (m.river && m.river.length > 1) {
      const rd = Svg.smooth(G.chaikin(m.river, 2, false), false);
      svg.path(rd, { fill: 'none', stroke: pal.ink, strokeWidth: W.river + 2.2, strokeLinejoin: 'round', strokeLinecap: 'round' });
      svg.path(rd, { fill: 'none', stroke: pal.water, strokeWidth: W.river, strokeLinejoin: 'round', strokeLinecap: 'round' });
      svg.path(rd, { fill: 'none', stroke: pal.waterInk, strokeWidth: 0.8, strokeDasharray: '6 9', opacity: 0.6 });
    }

    // Piers and bridges.
    const piers = new Svg.Batch();
    for (const w of m.wards) if (w.piers) for (const p of w.piers) piers.poly(p);
    for (const b of m.bridges) {
      const ang = Math.atan2(b.dir.y, b.dir.x);
      piers.poly(G.rect(b.p.x, b.p.y, W.river + 9, b.w + 1.5, ang));
    }
    svg.path(piers.toString(), { fill: pal.road, stroke: pal.ink, strokeWidth: 0.9, strokeLinejoin: 'round' });

    // Squares, yards, parks and gardens.
    const squares = new Svg.Batch(), greens = new Svg.Batch(), gardens = new Svg.Batch();
    for (const w of m.wards) {
      if (w.square || w.yard) squares.poly(w.block);
      if (w.green) greens.poly(w.block);
      for (const g of w.gardens) gardens.poly(g);
    }
    svg.path(squares.toString(), { fill: pal.paperShade });
    svg.path(greens.toString(), { fill: pal.green, stroke: pal.greenInk, strokeWidth: 0.5 });
    svg.path(gardens.toString(), { fill: pal.green, opacity: 0.75 });

    // Buildings.
    const houses = new Svg.Batch(), special = new Svg.Batch(), farmhouses = new Svg.Batch();
    for (const w of m.wards) {
      const target = w.inner ? houses : farmhouses;
      for (const b of w.buildings) target.poly(b);
      if (w.special) for (const s of w.special) special.poly(s);
    }
    svg.path(farmhouses.toString(), { fill: pal.building, stroke: pal.ink, strokeWidth: lw, strokeLinejoin: 'round' });
    svg.path(houses.toString(), { fill: pal.building, stroke: pal.ink, strokeWidth: lw, strokeLinejoin: 'round' });
    svg.path(special.toString(), { fill: pal.buildingSpecial, stroke: pal.ink, strokeWidth: lw * 1.6, strokeLinejoin: 'round' });

    // Fountains.
    for (const w of m.wards) {
      if (!w.fountain) continue;
      const f = w.fountain;
      svg.circle(f.x, f.y, f.r + 1.6, { fill: pal.paper, stroke: pal.ink, strokeWidth: 0.9 });
      svg.circle(f.x, f.y, f.r, { fill: pal.water, stroke: pal.ink, strokeWidth: 0.6 });
    }

    // Citadel walls.
    if (m.castle) {
      const cw = m.castle.wall, n = cw.length;
      const a = cw[m.castle.gate], b = cw[(m.castle.gate + 1) % n];
      const len = G.dist(a, b);
      const ring = [];
      for (let i = 0; i < n; i++) ring.push(cw[(m.castle.gate + 1 + i) % n]);
      // Open the gate in the middle of the chosen side.
      const g1 = G.lerp(a, b, Math.max(0.1, 0.5 - 5 / len)), g2 = G.lerp(a, b, Math.min(0.9, 0.5 + 5 / len));
      const line = [g2].concat(ring).concat([g1]);
      svg.poly(line, { fill: 'none', stroke: pal.ink, strokeWidth: W.wall + 1, strokeLinejoin: 'round', strokeLinecap: 'butt' }, false);
      const tb = new Svg.Batch();
      for (const v of cw) tb.circle(v.x, v.y, 4.6);
      tb.circle(g1.x, g1.y, 3.6);
      tb.circle(g2.x, g2.y, 3.6);
      svg.path(tb.toString(), { fill: pal.ink });
    }

    // City walls, towers and gatehouses.
    if (m.wallLines.length) {
      const wb = new Svg.Batch();
      for (const l of m.wallLines) wb.poly(l, false);
      svg.path(wb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: W.wall, strokeLinejoin: 'round', strokeLinecap: 'butt' });
      const tb = new Svg.Batch();
      for (const tw of m.towers) tb.circle(tw.x, tw.y, 3.7);
      for (const tw of m.gateTowers) if (tw) tb.circle(tw.x, tw.y, 4.6);
      svg.path(tb.toString(), { fill: pal.ink });
    }

    // Trees.
    const crowns = new Svg.Batch();
    const tr = new Carto.Random(m.seed + 17);
    for (const w of m.wards) for (const tree of w.trees) crowns.smooth(Draw.crown(tr, tree.x, tree.y, tree.r), true);
    svg.path(crowns.toString(), { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.6 });

    svg.close();

    // Lettering and furniture, in sheet coordinates.
    if (o.labels !== false && !o.preview) {
      const fs = S * 0.016;
      const taken = [Draw.textBox(S / 2, S * 0.075, m.name, S * 0.048, { title: true })];
      const labels = m.landmarks.map((l) => ({ x: l.x + M, y: l.y + M, text: t(l.key), size: fs, italic: true }));
      Draw.placeLabels(svg, labels, pal, taken, { x0: S * 0.04, y0: S * 0.04, x1: S * 0.96, y1: S * 0.9 });
    }
    const margin = S * 0.014;
    if (!o.preview) {
      Draw.frame(svg, S, S, pal, margin);
      if (o.labels !== false) {
        const sub = t('city.sub.' + (m.size || 'medium')) + (m.walls ? '' : ' · ' + t('city.sub.open'));
        Draw.title(svg, S / 2, S * 0.075, m.name, S * 0.048, pal, sub);
      }
      Draw.compass(svg, S - S * 0.075, S - S * 0.085, S * 0.032, pal);
      Draw.scaleBar(svg, S * 0.06, S - S * 0.07, 100, 100, 'm', pal);
    } else {
      Draw.label(svg, S / 2, S * 0.08, m.name, S * 0.06, pal, { title: true, haloWidth: 0.35 });
    }
    return svg.toString();
  }

  function notes(m) {
    const esc = Svg.esc;
    let h = '<h3>' + esc(m.name) + '</h3><dl>' +
      '<dt>' + esc(t('city.population')) + '</dt><dd>' + m.population.toLocaleString(Carto.I18n.lang) + '</dd>' +
      '<dt>' + esc(t('city.buildings')) + '</dt><dd>' + m.buildingCount.toLocaleString(Carto.I18n.lang) + '</dd>' +
      '<dt>' + esc(t('city.gates')) + '</dt><dd>' + m.gateCount + '</dd></dl>';
    const order = ['market', 'temple', 'castle', 'administration', 'merchant', 'patriciate', 'craftsmen', 'harbour', 'military', 'park', 'slum'];
    const items = order.filter((k) => m.census[k]).map((k) => '<li>' + esc(t('ward.' + k)) + (m.census[k] > 1 ? ' <span class="tag">×' + m.census[k] + '</span>' : '') + '</li>');
    if (items.length) h += '<p class="tag">' + esc(t('city.districts')) + '</p><ul>' + items.join('') + '</ul>';
    return h;
  }

  Carto.register({
    id: 'city',
    order: 2,
    options: [
      { id: 'size', type: 'select', values: ['small', 'medium', 'large', 'huge'], def: 'medium' },
      { id: 'water', type: 'select', values: ['none', 'river', 'coast', 'both'], def: 'river' },
      { id: 'walls', type: 'bool', def: true },
      { id: 'citadel', type: 'bool', def: true },
      { id: 'plaza', type: 'bool', def: true },
      { id: 'temple', type: 'bool', def: true },
      { id: 'farms', type: 'bool', def: true },
      { id: 'labels', type: 'bool', def: true, renderOnly: true },
      { id: 'name', type: 'text', def: '', hidden: true },
    ],
    previewOptions: { size: 'medium' },
    generate,
    render,
    notes,
    fileName: (m) => m.name,
  });

  // Exposed for the smoke tests.
  Carto.City = { generate, render, Topo, walkCut, linkEdges };
})(window.Carto = window.Carto || {});
