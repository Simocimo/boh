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
      // Present day (2026).
      'gen.city.desc@modern': 'Città di oggi: centro storico, quartieri, piazza, duomo, centro direzionale, porto e zone industriali.',
      'city.opt.size.small@modern': 'Paese',
      'city.opt.walls@modern': 'Mura storiche',
      'city.opt.citadel@modern': 'Centro direzionale',
      'city.opt.plaza@modern': 'Piazza principale',
      'city.opt.temple@modern': 'Duomo',
      'city.opt.farms@modern': 'Campagna coltivata',
      'city.castle@modern': 'Centro direzionale',
      'city.cathedral@modern': 'Duomo',
      'city.market@modern': 'Piazza principale',
      'city.harbour@modern': 'Porto commerciale',
      'city.gates@modern': 'Strade di accesso',
      'city.road': 'SP {n}',
      'city.road.main': 'SS {n}',
      'city.mayor': 'Sindaco',
      'city.surroundings': 'Dintorni',
      'ward.market@modern': 'Piazza principale',
      'ward.temple@modern': 'Duomo',
      'ward.castle@modern': 'Centro direzionale',
      'ward.oldtown': 'Centro storico',
      'ward.craftsmen@modern': 'Quartiere residenziale',
      'ward.merchant@modern': 'Zona commerciale',
      'ward.slum@modern': 'Case popolari',
      'ward.patriciate@modern': 'Quartiere signorile',
      'ward.administration@modern': 'Municipio',
      'ward.military@modern': 'Caserma',
      'ward.park@modern': 'Parco pubblico',
      'ward.harbour@modern': 'Porto commerciale',
      'ward.shanty@modern': 'Periferia',
      'ward.farm@modern': 'Campagna',
      'ward.wood': 'Boschi',
      'ward.fair': 'Quartiere fieristico',
      'ward.industrial': 'Zona industriale',
      'city.sub.small@modern': 'paese',
      'city.sub.medium@modern': 'cittadina',
      'city.sub.large@modern': 'città',
      'city.sub.huge@modern': 'metropoli',
      'city.sub.walled': 'centro storico murato',
      'city.station': 'Stazione',
      'city.stadium': 'Stadio',
      'city.ring': 'Tangenziale',
      'city.rail': 'Ferrovia',
      'city.marina': 'Porticciolo',
      'ward.station': 'Stazione ferroviaria',
      'ward.stadium': 'Stadio',
      // Cyberpunk.
      'gen.city.desc@cyber': 'Megalopoli cyberpunk: sprawl, arcologie corporative, mercati notturni, Combat Zone e porti per droni.',
      'city.opt.size.small@cyber': 'Enclave',
      'city.opt.size.medium@cyber': 'Distretto',
      'city.opt.size.large@cyber': 'Sprawl',
      'city.opt.size.huge@cyber': 'Megalopoli',
      'city.opt.walls@cyber': 'Muro corporativo',
      'city.opt.citadel@cyber': 'Arcologia',
      'city.opt.plaza@cyber': 'Mercato notturno',
      'city.opt.temple@cyber': 'Tempio dei dati',
      'city.opt.farms@cyber': 'Fattorie verticali',
      'city.castle@cyber': 'Arcologia',
      'city.arcology': 'Arcologia {n}',
      'city.cathedral@cyber': 'Tempio dei dati',
      'city.market@cyber': 'Mercato notturno',
      'city.harbour@cyber': 'Porto merci e droni',
      'city.gates@cyber': 'Arterie di accesso',
      'city.road@cyber': 'Arteria {n}',
      'city.road.main@cyber': 'Sopraelevata {n}',
      'city.corp': 'Corporazione dominante',
      'ward.market@cyber': 'Mercato notturno',
      'ward.temple@cyber': 'Tempio dei dati',
      'ward.castle@cyber': 'Arcologia',
      'ward.craftsmen@cyber': 'Sprawl',
      'ward.merchant@cyber': 'Bazar elettronico',
      'ward.slum@cyber': 'Combat Zone',
      'ward.patriciate@cyber': 'Enclave dei dirigenti',
      'ward.administration@cyber': 'Zona corporativa',
      'ward.military@cyber': 'Caserme della sicurezza',
      'ward.park@cyber': 'Parco sintetico',
      'ward.harbour@cyber': 'Porto merci e droni',
      'ward.shanty@cyber': 'Baraccopoli',
      'ward.farm@cyber': 'Fattorie verticali',
      'ward.wood@cyber': 'Terre desolate',
      'ward.industrial@cyber': 'Fonderie automatizzate',
      'city.sub.small@cyber': 'enclave',
      'city.sub.medium@cyber': 'distretto urbano',
      'city.sub.large@cyber': 'sprawl metropolitano',
      'city.sub.huge@cyber': 'megalopoli',
      'city.sub.walled@cyber': 'perimetro blindato',
      'city.station@cyber': 'Stazione maglev',
      'city.stadium@cyber': 'Arena',
      'city.rail@cyber': 'Linea maglev',
      'city.skyway': 'Sopraelevata',
      'ward.station@cyber': 'Stazione maglev',
      'ward.stadium@cyber': 'Arena',
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
      // Present day (2026).
      'gen.city.desc@modern': 'Present-day towns: old town, neighbourhoods, main square, cathedral, business district, port and industrial estates.',
      'city.opt.size.small@modern': 'Village',
      'city.opt.walls@modern': 'Old town walls',
      'city.opt.citadel@modern': 'Business district',
      'city.opt.plaza@modern': 'Main square',
      'city.opt.temple@modern': 'Cathedral',
      'city.opt.farms@modern': 'Farmland',
      'city.castle@modern': 'Business district',
      'city.cathedral@modern': 'Cathedral',
      'city.market@modern': 'Main square',
      'city.harbour@modern': 'Container port',
      'city.gates@modern': 'Access roads',
      'city.road': 'Route {n}',
      'city.road.main': 'Highway {n}',
      'city.mayor': 'Mayor',
      'city.surroundings': 'Surroundings',
      'ward.market@modern': 'Main square',
      'ward.temple@modern': 'Cathedral',
      'ward.castle@modern': 'Business district',
      'ward.oldtown': 'Old town',
      'ward.craftsmen@modern': 'Residential quarter',
      'ward.merchant@modern': 'Shopping district',
      'ward.slum@modern': 'Housing estates',
      'ward.patriciate@modern': 'Upmarket quarter',
      'ward.administration@modern': 'Town hall',
      'ward.military@modern': 'Army barracks',
      'ward.park@modern': 'Public park',
      'ward.harbour@modern': 'Container port',
      'ward.shanty@modern': 'Suburbs',
      'ward.farm@modern': 'Countryside',
      'ward.wood': 'Woods',
      'ward.fair': 'Exhibition district',
      'ward.industrial': 'Industrial estate',
      'city.sub.small@modern': 'village',
      'city.sub.medium@modern': 'town',
      'city.sub.large@modern': 'city',
      'city.sub.huge@modern': 'metropolis',
      'city.sub.walled': 'walled old town',
      'city.station': 'Station',
      'city.stadium': 'Stadium',
      'city.ring': 'Ring road',
      'city.rail': 'Railway',
      'city.marina': 'Marina',
      'ward.station': 'Railway station',
      'ward.stadium': 'Stadium',
      // Cyberpunk.
      'gen.city.desc@cyber': 'Cyberpunk megacities: sprawl, corporate arcologies, night markets, Combat Zones and drone ports.',
      'city.opt.size.small@cyber': 'Enclave',
      'city.opt.size.medium@cyber': 'District',
      'city.opt.size.large@cyber': 'Sprawl',
      'city.opt.size.huge@cyber': 'Megacity',
      'city.opt.walls@cyber': 'Corporate wall',
      'city.opt.citadel@cyber': 'Arcology',
      'city.opt.plaza@cyber': 'Night market',
      'city.opt.temple@cyber': 'Data temple',
      'city.opt.farms@cyber': 'Vertical farms',
      'city.castle@cyber': 'Arcology',
      'city.arcology': '{n} Arcology',
      'city.cathedral@cyber': 'Data temple',
      'city.market@cyber': 'Night market',
      'city.harbour@cyber': 'Cargo and drone port',
      'city.gates@cyber': 'Access arteries',
      'city.road@cyber': 'Artery {n}',
      'city.road.main@cyber': 'Skyway {n}',
      'city.corp': 'Ruling corporation',
      'ward.market@cyber': 'Night market',
      'ward.temple@cyber': 'Data temple',
      'ward.castle@cyber': 'Arcology',
      'ward.craftsmen@cyber': 'Sprawl',
      'ward.merchant@cyber': 'Electronics bazaar',
      'ward.slum@cyber': 'Combat Zone',
      'ward.patriciate@cyber': 'Executive enclave',
      'ward.administration@cyber': 'Corporate zone',
      'ward.military@cyber': 'Security barracks',
      'ward.park@cyber': 'Synthetic park',
      'ward.harbour@cyber': 'Cargo and drone port',
      'ward.shanty@cyber': 'Shantytown',
      'ward.farm@cyber': 'Vertical farms',
      'ward.wood@cyber': 'Wasteland',
      'ward.industrial@cyber': 'Automated foundries',
      'city.sub.small@cyber': 'enclave',
      'city.sub.medium@cyber': 'urban district',
      'city.sub.large@cyber': 'metropolitan sprawl',
      'city.sub.huge@cyber': 'megacity',
      'city.sub.walled@cyber': 'armoured perimeter',
      'city.station@cyber': 'Maglev station',
      'city.stadium@cyber': 'Arena',
      'city.rail@cyber': 'Maglev line',
      'city.skyway': 'Skyway',
      'ward.station@cyber': 'Maglev station',
      'ward.stadium@cyber': 'Arena',
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
      const gap = a > o.min * 5 && rng.bool(o.alleys) ? o.gap || W.alley * 0.8 : 0;
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
    if (Carto.Setting.current !== 'fantasy') return generateGrid(seed, opts);
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
    if (m.layout === 'grid') return renderGrid(m, o);
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
      const labels = m.landmarks.map((l) => ({ x: l.x + M, y: l.y + M, text: t(l.key, l.params), size: fs, italic: true }));
      Draw.placeLabels(svg, labels, pal, taken, { x0: S * 0.04, y0: S * 0.04, x1: S * 0.96, y1: S * 0.9 });
    }
    const margin = S * 0.014;
    if (!o.preview) {
      Draw.frame(svg, S, S, pal, margin);
      if (o.labels !== false) {
        const sub = t('city.sub.' + (m.size || 'medium')) + (m.walls ? '' : ' · ' + t('city.sub.open'));
        Draw.title(svg, S / 2, S * 0.075, pal.titleCase === 'upper' ? m.name.toUpperCase() : m.name, S * 0.048, pal, sub);
      }
      Draw.compass(svg, S - S * 0.075, S - S * 0.085, S * 0.032, pal);
      Draw.scaleBar(svg, S * 0.06, S - S * 0.07, 100, 100, 'm', pal);
    } else {
      Draw.label(svg, S / 2, S * 0.08, pal.titleCase === 'upper' ? m.name.toUpperCase() : m.name, S * 0.06, pal, { title: true, haloWidth: 0.35 });
    }
    return svg.toString();
  }

  function notes(m) {
    const esc = Svg.esc;
    let h = '<h3>' + esc(m.name) + '</h3><dl>' +
      '<dt>' + esc(t('city.population')) + '</dt><dd>' + m.population.toLocaleString(Carto.I18n.lang) + '</dd>' +
      '<dt>' + esc(t('city.buildings')) + '</dt><dd>' + m.buildingCount.toLocaleString(Carto.I18n.lang) + '</dd>' +
      '<dt>' + esc(t('city.gates')) + '</dt><dd>' + m.gateCount + '</dd></dl>';
    const x = m.extra;
    if (x && (x.mayor || x.corp)) {
      h = h.replace(/<\/dl>$/, '<dt>' + esc(t(x.mayor ? 'city.mayor' : 'city.corp')) + '</dt><dd>' + esc(x.mayor || x.corp) + '</dd></dl>');
    }
    const order = ['market', 'temple', 'castle', 'administration', 'oldtown', 'merchant', 'patriciate', 'craftsmen', 'harbour', 'fair', 'military', 'park', 'slum', 'shanty', 'industrial', 'stadium', 'station'];
    const items = order.filter((k) => m.census[k]).map((k) => '<li>' + esc(t('ward.' + k)) + (m.census[k] > 1 ? ' <span class="tag">×' + m.census[k] + '</span>' : '') + '</li>');
    if (items.length) h += '<p class="tag">' + esc(t('city.districts')) + '</p><ul>' + items.join('') + '</ul>';
    const outer = x && x.outer ? ['shanty', 'industrial', 'farm', 'wood'].filter((k) => x.outer[k]) : [];
    if (outer.length) h += '<p class="tag">' + esc(t('city.surroundings')) + '</p><ul>' + outer.map((k) => '<li>' + esc(t('ward.' + k)) + '</li>').join('') + '</ul>';
    // Present day and cyberpunk: what the line symbols mean.
    if (m.layout === 'grid') {
      const keys = [];
      if (m.ring && m.ring.length) keys.push('▬ ' + t('city.ring'));
      if (m.sky && m.sky.length) keys.push('▬ ' + t('city.skyway'));
      if (m.rail) keys.push('┅ ' + t('city.rail'));
      if (keys.length) h += '<p class="tag">' + esc(keys.join(' · ')) + '</p>';
    }
    return h;
  }

  // ------------------------------------------------------------- present day and cyberpunk

  /* Present-day towns: a small historic core (the medieval patchwork above,
     clipped to a convex outline and ringed by a boulevard) wrapped in an
     orthogonal street grid with avenues, a ring road, a railway and its
     station, zones for industry, trade fairs and housing estates, and
     rectangular fields outside. Cyberpunk megacities: a grid of megablocks
     around an arcology, elevated skyways on the diagonals, canals and a belt
     of shacks. Everything is in metres and comes from its own random streams,
     so fantasy maps never change. */

  // Half-extent of the sheet (M), radius of the built-up area (Ru), cells of the historic core.
  const LAYOUT = {
    modern: {
      small: { M: 560, Ru: 250, core: 10, river: 22, exits: 2, station: 200, harbour: 90 },
      medium: { M: 950, Ru: 520, core: 18, river: 30, exits: 3, station: 280, harbour: 210 },
      large: { M: 1400, Ru: 840, core: 32, river: 42, exits: 4, station: 360, harbour: 320 },
      huge: { M: 2000, Ru: 1250, core: 50, river: 56, exits: 5, station: 440, harbour: 440 },
    },
    cyber: {
      small: { M: 700, Ru: 440, river: 28, exits: 2, station: 260, harbour: 140 },
      medium: { M: 1100, Ru: 730, river: 34, exits: 3, station: 320, harbour: 280 },
      large: { M: 1550, Ru: 1080, river: 40, exits: 4, station: 400, harbour: 420 },
      huge: { M: 2150, Ru: 1560, river: 48, exits: 5, station: 480, harbour: 560 },
    },
  };
  // Block lengths along the two grid axes, street widths, an avenue every few lines.
  const STREETS = {
    modern: { bu: [85, 135], bv: [62, 92], street: 11, avenue: 22, every: [3, 5], ring: 26, road: 11, rail: 24, lane: 4 },
    cyber: { bu: [150, 230], bv: [130, 195], street: 18, avenue: 32, every: [2, 4], ring: 0, road: 18, rail: 30, lane: 6, sky: 28 },
  };
  // Storeys per ward type, for the population (floor area per person: 40 m², 15 m² in cyberpunk).
  const FLOORS = {
    modern: { oldtown: 3, administration: 1, craftsmen: 5, merchant: 2, patriciate: 2, slum: 8, shanty: 2 },
    cyber: { craftsmen: 40, merchant: 10, patriciate: 20, slum: 2, shanty: 1.5, military: 4, castle: 150 },
  };

  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const angDiff = (a, b) => {
    const d = Math.abs(a - b) % (2 * Math.PI);
    return d > Math.PI ? 2 * Math.PI - d : d;
  };

  // Convex hull, clockwise on screen.
  function hull(points) {
    const P = points.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lo = [], hi = [];
    for (const p of P) {
      while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
      lo.push(p);
    }
    for (let i = P.length - 1; i >= 0; i--) {
      while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], P[i]) <= 0) hi.pop();
      hi.push(P[i]);
    }
    lo.pop(); hi.pop();
    return G.clockwise(lo.concat(hi));
  }

  // Grow a convex polygon outwards by d (mitred corners).
  function grow(poly, d) {
    const P = G.clockwise(poly), n = P.length, lines = [];
    for (let i = 0; i < n; i++) {
      const a = P[i], b = P[(i + 1) % n], o = G.norm(G.perp(G.sub(b, a)), -d);
      lines.push([G.add(a, o), G.add(b, o)]);
    }
    return lines.map((l2, i) => {
      const l1 = lines[(i + n - 1) % n];
      const x = G.lineIntersect(l1[0], l1[1], l2[0], l2[1]);
      return x ? { x: x.x, y: x.y } : l2[0];
    });
  }

  // Douglas-Peucker: drop points closer than eps to the simplified line.
  function simplify(pts, eps) {
    if (pts.length < 3) return pts.slice();
    const keep = new Uint8Array(pts.length);
    keep[0] = keep[pts.length - 1] = 1;
    const stack = [[0, pts.length - 1]];
    while (stack.length) {
      const [i, j] = stack.pop();
      let bi = -1, bd = eps;
      for (let q = i + 1; q < j; q++) {
        const d = G.distToSegment(pts[q], pts[i], pts[j]);
        if (d > bd) { bd = d; bi = q; }
      }
      if (bi >= 0) { keep[bi] = 1; stack.push([i, bi], [bi, j]); }
    }
    return pts.filter((_, i) => keep[i]);
  }

  function segPolyDist(poly, a, b) {
    if (G.contains(poly, a) || G.contains(poly, b)) return 0;
    let d = Infinity;
    for (let i = 0, n = poly.length; i < n; i++) {
      const p = poly[i], q = poly[(i + 1) % n];
      if (G.segmentIntersect(a, b, p, q)) return 0;
      d = Math.min(d, G.distToSegment(p, a, b), G.distToSegment(a, p, q), G.distToSegment(b, p, q));
    }
    return d;
  }

  // A polyline with a half-width, split into segments with bounding boxes.
  function corridor(line, hw, closed = false) {
    const segs = [], n = line.length, m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) {
      const a = line[i], b = line[(i + 1) % n];
      if (G.dist(a, b) < 1e-6) continue;
      segs.push({ a, b, x0: Math.min(a.x, b.x) - hw, x1: Math.max(a.x, b.x) + hw, y0: Math.min(a.y, b.y) - hw, y1: Math.max(a.y, b.y) + hw });
    }
    return { segs, hw };
  }
  const segsNear = (cor, bb) => cor.segs.filter((s) => s.x0 < bb.x1 && s.x1 > bb.x0 && s.y0 < bb.y1 && s.y1 > bb.y0);

  // Cut a corridor out of convex pieces: a piece it crosses splits in two.
  function carveLine(pieces, cor) {
    let out = pieces;
    for (const s of cor.segs) {
      const next = [];
      for (const p of out) {
        const bb = G.bbox(p);
        if (bb.x0 > s.x1 || bb.x1 < s.x0 || bb.y0 > s.y1 || bb.y1 < s.y0 || segPolyDist(p, s.a, s.b) >= cor.hw) { next.push(p); continue; }
        for (const q of G.splitConvex(p, s.a, G.sub(s.b, s.a), 2 * cor.hw)) if (G.area(q) > 4) next.push(q);
      }
      out = next;
    }
    return out;
  }

  // Keep, of each piece, its largest part outside a convex obstacle.
  function carveConvex(pieces, obstacle) {
    const ob = G.clockwise(obstacle), out = [];
    for (const p of pieces) {
      if (!G.convexOverlap(p, ob)) { out.push(p); continue; }
      let best = null, ba = 0;
      for (let i = 0; i < ob.length; i++) {
        const q = G.clipHalfPlane(p, ob[(i + 1) % ob.length], ob[i]);
        if (q.length >= 3 && G.area(q) > ba) { ba = G.area(q); best = q; }
      }
      if (best) out.push(best);
    }
    return out;
  }

  const rotPoly = (poly, ang, c = G.centroid(poly)) => poly.map((p) => G.add(c, G.rotate(G.sub(p, c), ang)));
  const inside = (poly, pts) => pts.every((p) => G.contains(poly, p));
  const ellipse = (c, rx, ry, ang, n = 40) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      out.push(G.add(c, G.rotate({ x: Math.cos(a) * rx, y: Math.sin(a) * ry }, ang)));
    }
    return out;
  };

  // Frame of a polygon along the grid axes: centre, axes, extents.
  function gframe(poly, U) {
    const V = G.perp(U);
    let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
    for (const p of poly) {
      const pu = G.dot(p, U), pv = G.dot(p, V);
      u0 = Math.min(u0, pu); u1 = Math.max(u1, pu); v0 = Math.min(v0, pv); v1 = Math.max(v1, pv);
    }
    return { c: G.add(G.scale(U, (u0 + u1) / 2), G.scale(V, (v0 + v1) / 2)), u: U, v: V, w: u1 - u0, h: v1 - v0 };
  }
  // The same frame turned so that u runs along the long (or the short) side.
  const flong = (f) => (f.w >= f.h ? f : { c: f.c, u: f.v, v: G.perp(f.v), w: f.h, h: f.w });
  const fshort = (f) => (f.w < f.h ? f : { c: f.c, u: f.v, v: G.perp(f.v), w: f.h, h: f.w });
  const fpt = (f, x, y) => G.add(f.c, G.add(G.scale(f.u, x), G.scale(f.v, y)));
  const frect = (f, x, y, w, h) => {
    const p = fpt(f, x, y);
    return G.rect(p.x, p.y, w, h, Math.atan2(f.u.y, f.u.x));
  };

  // Lots along every edge of a convex block: a perimeter block. The longest
  // edges run to the corners, the others fill in between.
  function frontLots(r, block, depth, fmin, fmax) {
    const P = G.clockwise(block), n = P.length, out = [];
    const f = G.frame(P);
    depth = Math.min(depth, Math.min(f.w, f.h) / 2 - 0.5);
    if (depth < 5) return [{ poly: P }];
    const order = P.map((_, i) => i).sort((x, y) => G.dist2(P[(y + 1) % n], P[y]) - G.dist2(P[(x + 1) % n], P[x]));
    const done = [];
    for (const i of order) {
      const a = P[i], b = P[(i + 1) % n], len = G.dist(a, b);
      if (len < 5) continue;
      const e = G.norm(G.sub(b, a)), inN = G.perp(e);
      let strip = G.clipHalfPlane(P, G.add(b, G.scale(inN, depth)), G.add(a, G.scale(inN, depth)));
      for (const j of done) {
        if (strip.length < 3) break;
        const a2 = P[j], b2 = P[(j + 1) % n], n2 = G.norm(G.perp(G.sub(b2, a2)), depth);
        strip = G.clipHalfPlane(strip, G.add(a2, n2), G.add(b2, n2));
      }
      done.push(i);
      if (strip.length < 3) continue;
      let rest = strip, t = 0;
      for (;;) {
        t += r.float(fmin, fmax);
        if (t > len - fmin * 0.5) break;
        const p = G.add(a, G.scale(e, t)), q = G.add(p, inN);
        const lot = G.clipHalfPlane(rest, p, q);
        rest = G.clipHalfPlane(rest, q, p);
        if (lot.length >= 3) out.push({ poly: lot, a, e, inN });
        if (rest.length < 3) break;
      }
      if (rest.length >= 3) out.push({ poly: rest, a, e, inN });
    }
    return out;
  }

  // Back-to-back rows of lots across a block; `dir` points to the street.
  function rowLots(r, block, f, lotW, lotD) {
    const out = [];
    const nr = Math.max(1, Math.round(f.h / lotD));
    let rest = block;
    for (let q = 0; q < nr && rest.length >= 3; q++) {
      let row = rest;
      if (q < nr - 1) {
        const p = fpt(f, 0, -f.h / 2 + (f.h * (q + 1)) / nr), p2 = G.add(p, f.u);
        row = G.clipHalfPlane(rest, p2, p);
        rest = G.clipHalfPlane(rest, p, p2);
      }
      const dir = G.scale(f.v, q + 0.5 < nr / 2 ? -1 : 1);
      let x = -f.w / 2, cur = row;
      while (cur.length >= 3) {
        x += lotW * r.float(0.8, 1.2);
        if (x > f.w / 2 - lotW * 0.4) { out.push({ poly: cur, dir }); break; }
        const p = fpt(f, x, 0), p2 = G.add(p, f.v);
        const lot = G.clipHalfPlane(cur, p, p2);
        cur = G.clipHalfPlane(cur, p2, p);
        if (lot.length >= 3) out.push({ poly: lot, dir });
      }
    }
    return out;
  }

  // Up to n rectangles (or octagons) scattered in a polygon without touching.
  function scatter(r, poly, f, n, smin, smax, gap, oct = 0) {
    const out = [];
    if (poly.length < 3) return out;
    const ang = Math.atan2(f.u.y, f.u.x);
    for (let tries = 0; out.length < n && tries < n * 30; tries++) {
      const s = r.float(smin, smax);
      const c = fpt(f, r.float(-0.5, 0.5) * f.w, r.float(-0.5, 0.5) * f.h);
      const b = r.bool(oct) ? G.regular(c.x, c.y, s / 2, 8, Math.PI / 8 + ang) : G.rect(c.x, c.y, s, s * r.float(0.6, 1.4), ang);
      if (!inside(poly, b) || out.some((o) => G.convexOverlap(o, b, gap))) continue;
      out.push(b);
    }
    return out;
  }

  // Shacks: irregular alleys, then tiny huts crowded along them.
  function shacks(r, block, min, fill) {
    const out = [];
    for (const sb of subdivide(r, block, { min: min * 28, chaos: 1, alleys: 1, gap: 3.5 })) {
      for (const lot of subdivide(r, sb, { min, chaos: 1, alleys: 0.12, gap: 1.4 })) {
        if (G.area(lot) < min * 0.25 || !r.bool(fill)) continue;
        out.push(rotPoly(G.scalePoly(lot, r.float(0.68, 0.9)), r.float(-0.15, 0.15)));
      }
    }
    return out;
  }

  function randomIn(r, poly, tries = 12) {
    const bb = G.bbox(poly);
    for (let i = 0; i < tries; i++) {
      const p = { x: bb.x0 + r.next() * bb.w, y: bb.y0 + r.next() * bb.h };
      if (G.contains(poly, p)) return p;
    }
    return null;
  }

  // Buildings, yards and greenery of one block, by ward type.
  function fillBlock(r, w, X) {
    const B = w.block, A = G.area(B), f = gframe(B, X.U), fl = flong(f), cy = X.cyber;
    const put = (key, item) => (w[key] || (w[key] = [])).push(item);
    const add = (b) => { if (b && b.length >= 3 && G.area(b) > 6) w.buildings.push(b); };
    const perimeter = (depth, fmin, fmax, setback, gap) => {
      for (const lot of frontLots(r, B, depth, fmin, fmax)) {
        let b = lot.poly;
        if (setback && lot.e) {
          const a2 = G.add(lot.a, G.scale(lot.inN, setback));
          b = G.clipHalfPlane(b, a2, G.add(a2, lot.e));
        }
        if (gap && b.length >= 3) b = G.insetConvex(b, gap);
        if (b.length >= 3 && G.area(b) > 25 && G.compactness(b) > 0.2) w.buildings.push(b);
      }
      return Math.min(depth, Math.min(f.w, f.h) / 2);
    };
    const courtyard = (depth, treeP, gardenP) => {
      const inner = G.insetConvex(B, depth + 3);
      if (inner.length < 3 || G.area(inner) < 250) return;
      if (r.bool(gardenP)) put('gardens', inner);
      if (r.bool(treeP)) for (const t2 of trees(r, G.insetConvex(inner, 2), X.tree * 1.3, X.tr[0], X.tr[1])) put('trees', t2);
    };
    // Detached houses on their own lots: villas, suburbs, condominiums.
    const houses = (lotW, lotD, hw, hd, poolP, treeP) => {
      for (const lot of rowLots(r, B, fl, lotW, lotD)) {
        put('gardens', lot.poly);
        if (G.area(lot.poly) < lotW * lotD * 0.35) continue;
        const c = G.add(G.centroid(lot.poly), G.scale(lot.dir, lotD * 0.1));
        const room = G.insetConvex(lot.poly, 1.5);
        let h = null;
        for (let s = 1; s > 0.45 && !h && room.length >= 3; s *= 0.85) {
          const cand = G.rect(c.x, c.y, hw * s * r.float(0.85, 1.15), hd * s * r.float(0.85, 1.1), Math.atan2(fl.u.y, fl.u.x));
          if (inside(room, cand)) h = cand;
        }
        if (!h) continue;
        w.buildings.push(h);
        if (r.bool(poolP)) {
          const pc = G.add(c, G.scale(lot.dir, -lotD * 0.3));
          const pool = G.rect(pc.x, pc.y, 9, 4.5, Math.atan2(fl.u.y, fl.u.x));
          if (inside(lot.poly, pool) && !G.convexOverlap(pool, h, 1)) put('pools', pool);
        }
        for (let q = 0; q < 3; q++) {
          if (!r.bool(treeP)) continue;
          const p = randomIn(r, room);
          if (p && !G.contains(G.scalePoly(h, 1.5), p)) put('trees', { x: p.x, y: p.y, r: r.float(X.tr[0], X.tr[1]) });
        }
      }
    };
    // Parallel slabs (housing estates, barracks).
    const slabs = (thick, gapY, lenR, gapX) => {
      const o = r.bool(0.7) ? fl : fshort(f), inner = G.insetConvex(B, 6);
      if (inner.length < 3) return;
      for (let y = -o.h / 2 + 6 + thick / 2; y <= o.h / 2 - 6 - thick / 2; y += thick + gapY) {
        for (let x = -o.w / 2 + 6; x < o.w / 2 - 20;) {
          const len = Math.min(r.float(lenR[0], lenR[1]), o.w / 2 - 6 - x);
          if (len >= 18) {
            const b = frect(o, x + len / 2, y, len, thick);
            if (inside(inner, b)) w.buildings.push(b);
            else {
              const cut = G.clipConvex(b, inner);
              if (cut.length >= 3 && G.area(cut) > len * thick * 0.6) w.buildings.push(cut);
            }
          }
          x += len + r.float(gapX[0], gapX[1]);
        }
      }
    };
    // Plots split by service roads, each with a shed and a yard.
    const sheds = (plot, inset, parkP) => {
      const plots = [];
      let rest = B, x = -fl.w / 2;
      while (rest.length >= 3) {
        x += r.float(plot[0], plot[1]);
        if (x > fl.w / 2 - plot[0] * 0.5) { plots.push(rest); break; }
        const parts = G.splitConvex(rest, fpt(fl, x, 0), fl.v, 9);
        if (parts.length < 2) { plots.push(rest); break; }
        plots.push(parts[0]);
        rest = parts[1];
      }
      put('yards', B);
      for (const pl of plots) {
        if (G.area(pl) < 300) continue;
        if (r.bool(parkP)) { put('parking', G.insetConvex(pl, 3)); continue; }
        const s = G.insetConvex(pl, r.float(inset[0], inset[1]));
        if (s.length < 3) continue;
        const sf = flong(gframe(s, X.U));
        if (sf.w > 110 && r.bool(0.6)) for (const h of G.splitConvex(s, sf.c, sf.v, 8)) add(h);
        else add(s);
      }
    };
    const containers = (area, fill) => {
      const o = flong(gframe(area, X.U)), cw = 12.2, ch = 2.5;
      const inner = G.insetConvex(area, 4);
      if (inner.length < 3) return;
      for (let y = -o.h / 2 + 4; y < o.h / 2 - 4; y += ch * 4 + 5) {
        for (let x = -o.w / 2 + 4; x < o.w / 2 - cw; x += cw + 1.2) {
          if (!r.bool(fill)) continue;
          for (let q = 0; q < 4; q++) {
            const b = frect(o, x + cw / 2, y + q * ch + ch / 2, cw, ch * 0.92);
            if (inside(inner, b)) put('containers', b);
          }
        }
      }
    };

    switch (w.type) {
      case 'craftsmen': {
        if (cy) {
          // Megablocks: a ring of huge buildings round a courtyard, or a few towers with atria.
          if (r.bool(0.62)) {
            const d = perimeter(r.float(24, 36), 55, 120, 4, 1.6);
            if (r.bool(0.35)) for (const t2 of scatter(r, G.insetConvex(B, d + 14), f, 1, 30, 46, 0)) add(t2);
          } else {
            for (const t2 of scatter(r, G.insetConvex(B, 8), f, r.int(2, 4), 45, 85, 16)) {
              add(t2);
              if (r.bool(0.5)) put('courts', G.scalePoly(t2, 0.42));
            }
            put('lawns', G.insetConvex(B, 4));
          }
        } else if (w.d > 0.55 && r.bool(0.5)) {
          houses(r.float(30, 38), r.float(28, 34), 20, 13, 0, 0.2);
        } else {
          const d = perimeter(r.float(12, 16), 13, 28, r.bool(0.35) ? 3 : 0, r.bool(0.3) ? 1.1 : 0);
          courtyard(d, 0.45, 0.35);
        }
        break;
      }
      case 'merchant': {
        if (w.mall) {
          put('parking', G.insetConvex(B, 3));
          const m2 = frect(fl, 0, -fl.h * 0.1, fl.w * 0.62, fl.h * 0.5);
          if (inside(B, m2)) add(m2);
        } else if (cy) {
          const d = perimeter(r.float(16, 22), 12, 26, 0, 0.8);
          for (const k2 of scatter(r, G.insetConvex(B, d + 6), f, 10, 5, 9, 3)) put('stalls', k2);
        } else {
          const d = perimeter(r.float(16, 22), 18, 40, 0, 0);
          courtyard(d, 0.2, 0);
        }
        break;
      }
      case 'patriciate': {
        if (cy) {
          put('lawns', G.insetConvex(B, 3));
          put('fences', G.insetConvex(B, 2));
          for (const t2 of scatter(r, G.insetConvex(B, 12), f, r.int(2, 4), 26, 48, 22)) add(t2);
          for (const t2 of trees(r, G.insetConvex(B, 6), X.tree * 1.6, X.tr[0], X.tr[1])) if (!w.buildings.some((b) => G.contains(G.scalePoly(b, 1.3), t2))) put('trees', t2);
        } else houses(r.float(28, 36), r.float(34, 42), 15, 12, 0.3, 0.7);
        break;
      }
      case 'shanty': case 'slum': {
        if (cy || w.type === 'shanty' && w.band) {
          for (const s of shacks(r, B, X.shack, w.type === 'slum' ? 0.85 : 0.7)) add(s);
        } else if (w.type === 'shanty') houses(r.float(18, 24), r.float(24, 30), 10, 9, 0.08, 0.45);
        else {
          put('lawns', G.insetConvex(B, 2));
          slabs(r.float(11, 14), r.float(24, 32), [45, 85], [12, 20]);
        }
        break;
      }
      case 'castle': {
        if (cy) {
          // Arcology: a stepped octagon in a moat of plazas.
          put('yards', B);
          const R0 = Math.min(f.w, f.h) * 0.46;
          w.arcology = [1, 0.76, 0.54, 0.32].map((s) => G.regular(f.c.x, f.c.y, R0 * s, 8, Math.PI / 8 + Math.atan2(f.u.y, f.u.x)));
          w.special.push(w.arcology[0]);
        } else {
          w.square = true;
          const n = Math.max(2, Math.min(8, Math.round(A / 2600))), smax = Math.min(46, Math.min(f.w, f.h) * 0.5);
          for (const t2 of scatter(r, G.insetConvex(B, 6), f, n, Math.min(24, smax * 0.6), smax, 12, 0.15)) w.special.push(t2);
          for (const t2 of trees(r, G.insetConvex(B, 3), X.tree * 1.4, X.tr[0] * 0.8, X.tr[1] * 0.8)) if (!w.special.some((b) => G.contains(G.scalePoly(b, 1.25), t2))) put('trees', t2);
        }
        break;
      }
      case 'administration': {
        // Cyberpunk corporate zone: towers on plazas.
        w.square = true;
        for (const t2 of scatter(r, G.insetConvex(B, 8), f, r.int(2, 4), 38, 72, 18, 0.4)) w.special.push(t2);
        break;
      }
      case 'military': {
        put('yards', B);
        put('fences', G.insetConvex(B, 2));
        slabs(14, 22, [40, 64], [14, 22]);
        const pad = fpt(fl, fl.w * 0.32, 0);
        const ring = G.regular(pad.x, pad.y, 11, 16);
        if (inside(B, ring) && !w.buildings.some((b) => G.convexOverlap(b, ring, 2))) put('pads', ring);
        break;
      }
      case 'industrial': {
        sheds(cy ? [80, 140] : [55, 95], cy ? [8, 16] : [6, 12], 0.18);
        if (cy) {
          // Tank farms beside the foundries.
          const o = fpt(fl, -fl.w * 0.3, 0);
          for (let q = 0; q < 6; q++) {
            const c2 = G.add(o, G.add(G.scale(fl.u, (q % 3) * 26), G.scale(fl.v, (q < 3 ? -1 : 1) * 14)));
            const tk = G.regular(c2.x, c2.y, 10, 14);
            if (inside(B, tk) && !w.buildings.some((b) => G.convexOverlap(b, tk, 1))) put('tanks', tk);
          }
        }
        break;
      }
      case 'fair': {
        put('yards', B);
        const parts = G.splitConvex(B, fpt(fl, 0, fl.h * 0.14), fl.u, 16);
        const halls = parts.length === 2 ? parts[1] : B;
        if (parts.length === 2) put('parking', G.insetConvex(parts[0], 3));
        const hf = flong(gframe(halls, X.U));
        const n = Math.max(2, Math.round(hf.w / r.float(70, 100)));
        let rest = halls;
        for (let q = 1; q <= n && rest.length >= 3; q++) {
          let hall = rest;
          if (q < n) {
            const sp = G.splitConvex(rest, fpt(hf, -hf.w / 2 + (hf.w * q) / n, 0), hf.v, 18);
            if (sp.length < 2) break;
            hall = sp[0]; rest = sp[1];
          }
          const h = G.insetConvex(hall, 5);
          if (h.length >= 3) w.special.push(h);
        }
        break;
      }
      case 'stadium': {
        put('parking', G.insetConvex(B, 3));
        let rx = Math.min(fl.w * 0.42, 118), ry = Math.min(fl.h * 0.42, rx * 0.8);
        const ang = Math.atan2(fl.u.y, fl.u.x);
        let outer = ellipse(fl.c, rx, ry, ang, 48);
        for (let q = 0; q < 6 && !inside(B, outer); q++) { rx *= 0.9; ry *= 0.9; outer = ellipse(fl.c, rx, ry, ang, 48); }
        w.special.push(outer);
        w.stadium = { track: ellipse(fl.c, rx * 0.74, ry * 0.68, ang, 48), pitch: G.rect(fl.c.x, fl.c.y, rx * 0.98, ry * 0.8, ang) };
        break;
      }
      case 'park': {
        w.green = true;
        const inner = G.insetConvex(B, 2);
        if (inner.length < 3) break;
        if (cy) {
          // Synthetic park: a lattice of paths and trees in rows.
          for (const s of G.stripes(inner, f.u, 40, 0.5).concat(G.stripes(inner, f.v, 40, 0.5))) put('paths', s);
          for (let x = -f.w / 2 + 10; x < f.w / 2; x += 20) {
            for (let y = -f.h / 2 + 10; y < f.h / 2; y += 20) {
              const p = fpt(f, x, y);
              if (G.contains(inner, p)) put('trees', { x: p.x, y: p.y, r: 4 });
            }
          }
          break;
        }
        const ang = Math.atan2(fl.u.y, fl.u.x);
        for (const d of [G.norm(G.add(G.scale(fl.u, fl.w), G.scale(fl.v, fl.h))), G.norm(G.sub(G.scale(fl.u, fl.w), G.scale(fl.v, fl.h)))]) {
          const ch = G.lineConvex(inner, fl.c, d);
          if (ch) put('paths', ch);
        }
        const loop = ellipse(fl.c, fl.w * 0.3, fl.h * 0.3, ang, 36);
        if (inside(inner, loop)) put('paths', loop.concat([loop[0]]));
        if (A > 9000 && r.bool(0.55)) {
          const pc = fpt(fl, fl.w * 0.26 * r.sign(), fl.h * 0.24 * r.sign());
          const pond = ellipse(pc, fl.w * 0.11, fl.h * 0.1, ang + r.float(-0.3, 0.3), 20);
          if (inside(inner, pond)) put('ponds', pond);
        }
        const near = (p) => (w.paths || []).some((pa) => G.distToPolyline(p, pa) < 5) || (w.ponds || []).some((pd) => G.contains(G.scalePoly(pd, 1.3), p));
        for (const t2 of trees(r, inner, X.tree, X.tr[0], X.tr[1])) if (!near(t2)) put('trees', t2);
        break;
      }
      case 'forecourt': {
        w.square = true;
        for (const t2 of trees(r, G.insetConvex(B, 4), X.tree * 1.5, X.tr[0] * 0.8, X.tr[1] * 0.8)) if (G.distToPolyline(t2, B, true) < 9) put('trees', t2);
        break;
      }
      case 'market': {
        // Cyberpunk night market: rows of stalls under the neon.
        w.square = true;
        const inner = G.insetConvex(B, 7);
        if (inner.length < 3) break;
        const o = flong(gframe(inner, X.U));
        for (let y = -o.h / 2 + 3; y < o.h / 2 - 3; y += 9) {
          for (let x = -o.w / 2 + 3; x < o.w / 2 - 4; x += 6) {
            if (!r.bool(0.8)) continue;
            const s = frect(o, x + 2.2, y + 1.6, 4.4, 3.2);
            if (inside(inner, s)) put('stalls', s);
          }
        }
        break;
      }
      case 'temple': {
        // Cyberpunk data temple: nested diamonds with four pylons.
        w.square = true;
        const R0 = Math.min(f.w, f.h) * 0.4, a0 = Math.atan2(f.u.y, f.u.x);
        w.special.push(G.regular(f.c.x, f.c.y, R0, 4, a0), G.regular(f.c.x, f.c.y, R0 * 0.62, 4, a0 + Math.PI / 4));
        for (let q = 0; q < 4; q++) {
          const p = G.add(f.c, G.fromAngle(a0 + Math.PI / 4 + (q * Math.PI) / 2, R0 * 1.05));
          const py = G.regular(p.x, p.y, 5, 4, a0);
          if (inside(B, py)) put('stalls', py);
        }
        break;
      }
      case 'harbour': {
        put('yards', B);
        if (X.small) {
          // A marina: boatyards and sheds.
          sheds([30, 50], [5, 9], 0.3);
          break;
        }
        const parts = G.splitConvex(B, fl.c, fl.v, 12);
        if (parts.length === 2) {
          for (const t2 of scatter(r, G.insetConvex(parts[0], 5), flong(gframe(parts[0], X.U)), 3, 26, 60, 8)) add(t2);
          containers(parts[1], 0.75);
        } else containers(B, 0.75);
        break;
      }
      // ---- outside the town
      case 'farm': {
        if (cy) {
          // Vertical farms: arrays of glass towers.
          const inner = G.insetConvex(B, 10);
          if (inner.length < 3) break;
          const o = flong(gframe(inner, X.U));
          for (let x = -o.w / 2 + 12; x < o.w / 2 - 12; x += 30) {
            for (let y = -o.h / 2 + 22; y < o.h / 2 - 22; y += 50) {
              const b = frect(o, x, y, 18, 38);
              if (inside(inner, b)) put('farms', b);
            }
          }
          break;
        }
        const n = Math.max(1, Math.round(fl.h / r.float(35, 70)));
        let rest = B;
        for (let q = 1; q <= n && rest.length >= 3; q++) {
          let strip = rest;
          if (q < n) {
            const sp = G.splitConvex(rest, fpt(fl, 0, -fl.h / 2 + (fl.h * q) / n), fl.u, 2);
            if (sp.length < 2) break;
            strip = sp[1]; rest = sp[0];
          }
          if (G.area(strip) < 200) continue;
          const kind = r.weighted([['field', 5], ['fieldAlt', 3], ['meadow', 1.5]]);
          const inner = G.insetConvex(strip, 1.5);
          if (inner.length >= 3) put('fields', { poly: inner, kind, furrows: kind === 'meadow' ? [] : G.stripes(inner, r.bool(0.8) ? fl.u : fl.v, X.furrow, r.next()) });
        }
        if (A > 12000 && r.bool(0.25)) {
          // A farmstead: house, barn and shed round a yard.
          const corner = fpt(fl, (fl.w / 2 - 30) * r.sign(), (fl.h / 2 - 26) * r.sign());
          const yard = G.rect(corner.x, corner.y, 46, 38, Math.atan2(fl.u.y, fl.u.x));
          if (inside(B, yard)) {
            put('yards', yard);
            const yf = { c: corner, u: fl.u, v: fl.v };
            add(frect(yf, -10, -12, 22, 10));
            add(frect(yf, 13, 2, 14, 30));
            if (r.bool(0.6)) add(frect(yf, -12, 12, 12, 9));
            w.fields = (w.fields || []).map((fd) => Object.assign(fd, { furrows: fd.furrows.filter((s) => !G.convexOverlap([s[0], s[1], s[0]], G.scalePoly(yard, 1.1), 0)) }));
          }
        }
        if (r.bool(0.3)) {
          // Hedgerow along one edge.
          const q = r.int(0, B.length - 1), a = B[q], b = B[(q + 1) % B.length], len = G.dist(a, b);
          for (let d = 4; d < len - 4; d += r.float(7, 11)) {
            const p = G.lerp(a, b, d / len);
            put('trees', { x: p.x, y: p.y, r: r.float(X.tr[0], X.tr[1]) * 0.9 });
          }
        }
        break;
      }
      case 'meadow': {
        w.meadow = true;
        if (!cy) for (const t2 of trees(r, B, X.tree * 4, X.tr[0], X.tr[1])) if (r.bool(0.4)) put('trees', t2);
        break;
      }
      case 'wood': {
        w.wood = true;
        if (cy) {
          // Wasteland: scrub, rubble and the odd ruin.
          const bb = G.bbox(B);
          for (const p of G.poissonDisc(r, bb.x0, bb.y0, bb.w, bb.h, 26, (q) => G.contains(B, q))) put('scrub', { x: p.x, y: p.y, r: r.float(3, 7) });
          if (r.bool(0.3)) for (const t2 of scatter(r, G.insetConvex(B, 10), f, r.int(1, 3), 20, 50, 10)) put('ruins', t2);
        }
        break;
      }
      case 'outer': {
        // Cyberpunk: tank farm by the road.
        put('yards', B);
        const inner = G.insetConvex(B, 8);
        if (inner.length < 3) break;
        const o = flong(gframe(inner, X.U));
        for (let x = -o.w / 2 + 14; x < o.w / 2 - 14; x += 32) {
          for (let y = -o.h / 2 + 14; y < o.h / 2 - 14; y += 32) {
            const c2 = fpt(o, x, y), tk = G.regular(c2.x, c2.y, 12, 14);
            if (inside(inner, tk) && r.bool(0.8)) put('tanks', tk);
          }
        }
        break;
      }
      default:
        break;
    }
  }

  function generateGrid(seed, opts) {
    const setting = Carto.Setting.current, cyber = setting === 'cyber';
    const size = LAYOUT.modern[opts.size] ? opts.size : 'medium';
    const P = LAYOUT[cyber ? 'cyber' : 'modern'][size], Q = STREETS[cyber ? 'cyber' : 'modern'];
    const big = size === 'large' || size === 'huge';
    const root = new Carto.Random(seed);
    const fork = (l) => root.fork('grid:' + l);
    const noise = new Carto.Noise(fork('noise'));
    const M = P.M, Ru = P.Ru;
    const water = opts.water || 'river';
    const hasRiver = water === 'river' || water === 'both', hasCoast = water === 'coast' || water === 'both';
    const Rcore = cyber ? 0 : Math.sqrt((P.core * 2000) / Math.PI);
    const O = { x: 0, y: 0 };

    // The built-up area is a noisy disc: d < 1 is town.
    const fr = (a) => Ru * (1 + 0.2 * noise.fbm(Math.cos(a) * 1.4 + 5.5, Math.sin(a) * 1.4 + 2.5, 3));
    const dOf = (p) => G.len(p) / fr(G.angle(p)) + 0.07 * noise.get(p.x * 0.0035 + 9.1, p.y * 0.0035 - 4.7);

    // 1. Coast: the sea lies beyond a wavy line, nearly straight along the town's quays.
    let coast = null, sH = 0;
    if (hasCoast) {
      const cr = fork('coast');
      const n = G.fromAngle(cr.float(0, Math.PI * 2)), tg = G.perp(n);
      const reach = Math.max(Rcore * 1.9 + 60, Ru * cr.float(0.38, 0.6));
      const amp = (s) => Ru * ((cyber ? 0.012 : 0.03) + 0.3 * clamp01((Math.abs(s) - Ru * 0.75) / Ru));
      const off = (s) => noise.fbm(s * 0.0022 + 17.3, 4.1, 3) * amp(s);
      const pts = [];
      for (let s = -M * 1.9; s <= M * 1.9; s += 20) pts.push(G.add(G.scale(tg, s), G.scale(n, reach + off(s))));
      coast = { n, t: tg, reach, off, pts };
      sH = cr.sign() * Ru * cr.float(0.12, 0.4);
    }
    const seaAt = (p, margin = 0) => !!coast && G.dot(p, coast.n) + margin > coast.reach + coast.off(G.dot(p, coast.t));
    const shore = (s, o = 0) => G.add(G.scale(coast.t, s), G.scale(coast.n, coast.reach + coast.off(s) + o));

    // 2. The grid follows the coast, else the river.
    const rv = fork('river'), lr = fork('grid');
    const riverDir = hasRiver ? (coast ? G.rotate(coast.n, rv.float(-0.4, 0.4)) : G.fromAngle(rv.float(0, Math.PI * 2))) : null;
    const theta = coast ? G.angle(coast.t) : riverDir && !cyber ? G.angle(riverDir) : lr.float(0, Math.PI);
    const U = G.fromAngle(theta), V = G.perp(U);
    const toW = (u, v) => ({ x: U.x * u + V.x * v, y: U.y * u + V.y * v });
    const span = M * 1.5;
    const makeLines = (range) => {
      const out = [];
      let pos = -span - range[1], q = lr.int(0, 3), gap = lr.int(Q.every[0], Q.every[1]);
      while (pos < span + range[1]) {
        const ave = q >= gap;
        out.push({ pos, kind: ave ? 'avenue' : 'street', lane: lr.bool(0.12) });
        if (ave) { q = 0; gap = lr.int(Q.every[0], Q.every[1]); } else q++;
        pos += lr.float(range[0], range[1]);
      }
      // The line nearest the centre is the main axis, through the centre.
      let m0 = 0;
      out.forEach((l, i) => { if (Math.abs(l.pos) < Math.abs(out[m0].pos)) m0 = i; });
      const shift = out[m0].pos;
      for (const l of out) l.pos -= shift;
      Object.assign(out[m0], { kind: 'avenue', axis: true });
      return out;
    };
    const cols = makeLines(Q.bu), rows = makeLines(Q.bv);
    const lineW = (l) => (l.kind === 'avenue' ? Q.avenue : l.kind === 'rail' ? Q.rail : Q.street);

    // 3. River: long straight reaches between embankments in town, meanders outside;
    //    a canal along the grid in cyberpunk.
    let river = null;
    if (hasRiver && !cyber) {
      const a = riverDir, b = G.perp(a);
      // Beside the old town, clear of its boulevard.
      const base = rv.sign() * (Rcore * rv.float(1.25, 1.8) + Q.avenue + P.river / 2 + Ru * 0.07 + 30);
      const K = Math.max(160, Ru * rv.float(0.35, 0.55));
      const knots = [];
      for (let s = -M * 2; s <= M * 2 + 2 * K; s += K) knots.push(base + rv.float(-1, 1) * Ru * 0.07);
      const lin = (s) => {
        const x = (s + M * 2) / K, i = Math.min(knots.length - 2, Math.max(0, Math.floor(x)));
        return knots[i] + (knots[i + 1] - knots[i]) * (x - i);
      };
      const pts = [];
      for (let s = -M * 1.8; s <= M * 1.8; s += 15) {
        const mea = noise.fbm(s * 0.004 + 3.7, 9.1, 3) * Ru * 0.22 * clamp01((Math.abs(s) - Ru * 0.9) / (Ru * 0.8));
        const p = G.add(G.scale(a, s), G.scale(b, lin(s) + mea));
        pts.push(p);
        if (seaAt(p, -P.river)) break;
      }
      river = { pts: simplify(pts, 0.4), w: P.river };
    } else if (hasRiver) {
      // Along rows, or along columns down to the sea.
      const byCol = !!coast, fam = byCol ? cols : rows, oth = byCol ? rows : cols;
      const at = (s, o) => (byCol ? toW(o, s) : toW(s, o));
      const cand = (list, lo, hi) => list.filter((l) => !l.axis && Math.abs(l.pos) > lo && Math.abs(l.pos) < hi);
      for (let tries = 0; tries < 12 && !river; tries++) {
        const c1 = rv.pick(cand(fam, Ru * 0.1, Ru * 0.6)), c2 = rv.pick(cand(fam, Ru * 0.1, Ru * 0.7)), j = rv.pick(cand(oth, 0, Ru * 0.6));
        if (!c1) break;
        let pts = !j || !c2 || c1 === c2 ? [at(-M * 1.8, c1.pos), at(M * 1.8, c1.pos)] : [at(-M * 1.8, c1.pos), at(j.pos, c1.pos), at(j.pos, c2.pos), at(M * 1.8, c2.pos)];
        if (coast) {
          if (seaAt(pts[0])) pts = pts.reverse();
          if (pts.slice(0, -1).some((p) => seaAt(p, 40))) continue;
          const a = pts[pts.length - 2], b = pts[pts.length - 1], L = G.dist(a, b);
          let s = 0;
          while (s < L && !seaAt(G.lerp(a, b, s / L), -P.river)) s += 10;
          pts[pts.length - 1] = G.lerp(a, b, Math.min(1, s / L));
        }
        river = { pts, w: P.river, canal: true };
      }
    }
    if (river && coast) {
      // Keep the harbour clear of the river mouth.
      const sm = G.dot(river.pts[river.pts.length - 1], coast.t);
      if (Math.abs(sm - sH) < P.harbour + river.w + 60) sH = sm + Math.sign(sH - sm || 1) * (P.harbour + river.w + 70);
    }

    // 4. Roads out of town: the main axes first, then the diagonals.
    const er = fork('roads');
    const dry = (D) => !seaAt(G.scale(D, M * 0.95)) && !seaAt(G.scale(D, Ru * 0.9));
    const axes = er.shuffle([U, V, G.scale(U, -1), G.scale(V, -1)]).filter(dry).map((D) => ({ D, axis: true }));
    const diag = er.shuffle([G.add(U, V), G.sub(U, V), G.sub(V, U), G.scale(G.add(U, V), -1)]).map((D) => G.norm(D)).filter(dry).map((D) => ({ D, axis: false }));
    const exits = axes.concat(diag).slice(0, P.exits);

    // 5. Historic core (present day): a convex outline, its ring boulevard and its gates.
    let core = null;
    if (!cyber) {
      const kr = fork('core');
      const ring0 = [], a0 = kr.float(0, Math.PI * 2);
      for (let i = 0; i < 11; i++) ring0.push(G.fromAngle(a0 + ((i + kr.float(-0.3, 0.3)) / 11) * Math.PI * 2, Rcore * kr.float(0.84, 1.16)));
      const C = hull(ring0);
      const gb = opts.walls ? 18 : 3;
      core = { C, gb, rng: kr, boulevard: grow(C, gb + Q.avenue / 2), obstacle: grow(C, gb + Q.avenue + 1), gates: [] };
      for (const D of [U, V, G.scale(U, -1), G.scale(V, -1)].concat(exits.filter((e) => !e.axis).map((e) => e.D))) {
        const ch = G.lineConvex(C, O, D);
        if (ch && !seaAt(ch[1], 30)) core.gates.push(ch[1]);
      }
    }
    const roads = [];
    for (const ex of exits) {
      const D = ex.D;
      const start = core ? G.lineConvex(core.boulevard, O, D)[1] : G.scale(D, Q.bu[0]);
      let end = G.scale(D, fr(G.angle(D)) * 1.02);
      for (let q = 0; q < 20 && seaAt(end, 60); q++) end = G.scale(end, 0.95);
      const pts = [start, end];
      let cur = end, dir = D;
      for (let q = 0; q < 400 && Math.max(Math.abs(cur.x), Math.abs(cur.y)) < M * 1.15; q++) {
        const wob = noise.get(cur.x * 0.003 + 50, cur.y * 0.003 - 20);
        let nd = G.norm(G.add(G.scale(G.rotate(dir, wob * 0.3), 0.85), G.scale(D, 0.15)));
        if (coast && seaAt(G.add(cur, G.scale(nd, 30)), 70)) nd = G.norm(G.sub(nd, G.scale(coast.n, G.dot(nd, coast.n) + 0.6)));
        dir = nd;
        cur = G.add(cur, G.scale(nd, 30));
        pts.push(cur);
      }
      roads.push({ pts, axis: ex.axis, urban: [start, end], rural: pts.slice(1) });
    }

    // 6. Railway along a grid line through town, curving gently outside; the station near the centre.
    const rr = fork('rail');
    let rail = null, station = null;
    {
      const alongU = coast ? true : river ? (river.canal ? false : Math.abs(G.dot(riverDir, U)) < 0.7) : rr.bool();
      const fam = alongU ? rows : cols;
      const lo = cyber ? Ru * 0.16 : Rcore * 1.4 + 50, hi = Math.max(lo + 140, Ru * 0.5);
      const land = coast ? -Math.sign(G.dot(alongU ? V : U, coast.n)) : 0;
      const at = (s, o) => (alongU ? toW(s, o) : toW(o, s));
      for (const line of rr.shuffle(fam.filter((l) => !l.axis && Math.abs(l.pos) > lo && Math.abs(l.pos) < hi && (!land || l.pos * land > 0)))) {
        const pts = [];
        for (let s = -M * 1.8; s <= M * 1.8; s += 30) {
          const out = Math.max(0, Math.abs(s) - Ru * 1.05);
          let p = at(s, line.pos + noise.fbm(s * 0.0011 + 61, 7.7, 2) * out * 0.35);
          for (let g = 0; g < 40 && seaAt(p, 150); g++) p = G.sub(p, G.scale(coast.n, 15));
          pts.push(p);
        }
        if (river && pts.filter((p) => G.distToPolyline(p, river.pts) < river.w / 2 + 60).length > 12) continue;
        line.kind = 'rail';
        rail = { pts: simplify(pts, 0.4), alongU, pos: line.pos, dir: alongU ? U : V };
        break;
      }
    }
    if (rail) {
      const L = P.station, sc = cyber ? 1.15 : 1;
      const e = rail.dir, nC = G.scale(rail.alongU ? V : U, -Math.sign(rail.pos));
      // Beside the main axis, clear of the river and the sea.
      const sg = rr.sign();
      let R0 = null, zone = null;
      for (const ss of [1, -1, 2.6, -2.6, 4.2, -4.2].map((x) => sg * x * (L / 2 + Q.avenue))) {
        R0 = rail.alongU ? toW(ss, rail.pos) : toW(rail.pos, ss);
        const pt = (x, y) => G.add(R0, G.add(G.scale(e, x), G.scale(nC, y * sc)));
        zone = G.clockwise([pt(-L / 2, -Q.rail / 2 / sc - 2), pt(L / 2, -Q.rail / 2 / sc - 2), pt(L / 2, 58), pt(-L / 2, 58)]);
        if (!zone.some((p) => seaAt(p, 30)) && !(river && river.pts.some((p, i) => i && segPolyDist(zone, river.pts[i - 1], p) < river.w))) break;
      }
      const pt = (x, y) => G.add(R0, G.add(G.scale(e, x), G.scale(nC, y * sc)));
      const ang = Math.atan2(e.y, e.x), bc = pt(0, 48);
      station = {
        zone, R0,
        building: G.rect(bc.x, bc.y, L * 0.42, 16 * sc, ang),
        platforms: [12, 29, 38].map((o) => { const c = pt(0, o); return G.rect(c.x, c.y, L * (o > 30 ? 0.5 : 0.74), o > 30 ? 3.5 * sc : 5 * sc, ang); }),
        tracks: [7, 17, 24, 34].map((o) => [pt(-L / 2, 0), pt(-L / 2 + 16 + o * 2, o), pt(L / 2 - 16 - o * 2, o), pt(L / 2, 0)]),
        label: pt(0, 72),
      };
    }

    // 7. Ring road round the town (present-day cities), skyways on the diagonals (cyberpunk).
    let ring = [];
    if (!cyber && big) {
      const pts = [];
      for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; pts.push(G.fromAngle(a, fr(a) * 1.06 + 70)); }
      const sm = G.chaikin(pts, 3, true), ok = (p) => !seaAt(p, 90);
      if (sm.every(ok)) ring = [{ pts: sm, closed: true }];
      else {
        const s0 = sm.findIndex((p) => !ok(p));
        let run = null;
        for (let i = 1; i <= sm.length; i++) {
          const p = sm[(s0 + i) % sm.length];
          if (ok(p)) { if (!run) ring.push(run = { pts: [], closed: false }); run.pts.push(p); } else run = null;
        }
        ring = ring.filter((r2) => r2.pts.length > 4);
      }
    }
    const sky = [];
    if (cyber) {
      const sk = fork('sky');
      const n = size === 'small' ? 1 : size === 'huge' ? 3 : 2;
      let off0 = 0;
      for (let i = 0; i < n; i++) {
        const dir = G.norm(i % 2 ? G.sub(U, V) : G.add(U, V));
        const off = i === 2 ? -Math.sign(off0) * Math.max(sk.float(0.3, 0.45) * Ru, 380) : sk.sign() * Math.max(sk.float(0.12, 0.3) * Ru, 230);
        if (i === 0) off0 = off;
        const c0 = G.scale(G.perp(dir), off);
        let a = G.sub(c0, G.scale(dir, M * 2)), b = G.add(c0, G.scale(dir, M * 2));
        if (coast) {
          // Stop at the shore.
          const L = G.dist(a, b);
          let s1 = L / 2, s2 = L / 2;
          while (s1 > 0 && !seaAt(G.lerp(a, b, s1 / L), 40)) s1 -= 10;
          while (s2 < L && !seaAt(G.lerp(a, b, s2 / L), 40)) s2 += 10;
          [a, b] = [G.lerp(a, b, Math.max(0, s1) / L), G.lerp(a, b, Math.min(L, s2) / L)];
        }
        if (!seaAt(c0)) sky.push([a, b]);
      }
    }

    // Corporate wall (cyberpunk): down the middle of the streets round the inner district,
    // with checkpoints where the avenues pass.
    let wall = null;
    if (cyber && opts.walls) {
      const near = (list, x) => list.reduce((b, l, i) => (Math.abs(l.pos - x) < Math.abs(list[b].pos - x) ? i : b), 0);
      const i1 = near(cols, -Ru * 0.34), i2 = near(cols, Ru * 0.34), j1 = near(rows, -Ru * 0.34), j2 = near(rows, Ru * 0.34);
      if (i2 > i1 && j2 > j1) {
        const ring2 = [toW(cols[i1].pos, rows[j1].pos), toW(cols[i2].pos, rows[j1].pos), toW(cols[i2].pos, rows[j2].pos), toW(cols[i1].pos, rows[j2].pos)];
        const gates = [];
        for (let i = i1 + 1; i < i2; i++) if (cols[i].kind === 'avenue') gates.push(toW(cols[i].pos, rows[j1].pos), toW(cols[i].pos, rows[j2].pos));
        for (let j = j1 + 1; j < j2; j++) if (rows[j].kind === 'avenue') gates.push(toW(cols[i1].pos, rows[j].pos), toW(cols[i2].pos, rows[j].pos));
        if (!ring2.some((p) => seaAt(p, 20))) wall = { pts: ring2, gates: gates.filter((g) => !seaAt(g)) };
      }
    }

    // 8. Zoning directions: industry along the railway and inland, wealth on the other side.
    const zr = fork('zones');
    let aInd = rail ? G.angle(rail.dir) + (zr.bool() ? 0 : Math.PI) : zr.float(0, Math.PI * 2);
    if (coast) for (let q = 0; q < 8 && G.dot(G.fromAngle(aInd), coast.n) > 0.2; q++) aInd += 0.8;
    const aRich = aInd + Math.PI + zr.float(-0.7, 0.7), aFair = aInd + zr.sign() * zr.float(0.8, 1.3), aSlum = aInd + zr.sign() * zr.float(0.5, 0.9);

    // 9. Grid cells.
    const cells = [], cellMap = new Map(), cid = (i, j) => i * 100000 + j;
    for (let i = 0; i + 1 < cols.length; i++) {
      for (let j = 0; j + 1 < rows.length; j++) {
        const u0 = cols[i].pos + lineW(cols[i]) / 2, u1 = cols[i + 1].pos - lineW(cols[i + 1]) / 2;
        const v0 = rows[j].pos + lineW(rows[j]) / 2, v1 = rows[j + 1].pos - lineW(rows[j + 1]) / 2;
        const c = toW((u0 + u1) / 2, (v0 + v1) / 2);
        if (Math.abs(c.x) > M + 200 || Math.abs(c.y) > M + 200) continue;
        const cell = { i, j, u0, u1, v0, v1, c, d: dOf(c), a: G.angle(c), poly: [toW(u0, v0), toW(u1, v0), toW(u1, v1), toW(u0, v1)] };
        cell.avenue = [cols[i], cols[i + 1], rows[j], rows[j + 1]].some((l) => l.kind === 'avenue');
        cells.push(cell);
        cellMap.set(cid(i, j), cell);
      }
    }
    const cellAt = (i, j) => cellMap.get(cid(i, j));
    const lineIndex = (list, x) => {
      let lo = 0, hi = list.length - 1;
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (list[mid].pos <= x) lo = mid; else hi = mid; }
      return lo;
    };
    const cellOf = (p) => cellAt(lineIndex(cols, G.dot(p, U)), lineIndex(rows, G.dot(p, V)));
    const roadDist = (p) => roads.reduce((m2, r2) => Math.min(m2, G.distToPolyline(p, r2.rural)), Infinity);
    const riverDist = (p) => (river ? G.distToPolyline(p, river.pts) : Infinity);
    const harbourAt = (p) => !!coast && Math.abs(G.dot(p, coast.t) - sH) < P.harbour &&
      coast.reach + coast.off(G.dot(p, coast.t)) - G.dot(p, coast.n) < (cyber ? 330 : 190);
    for (const c of cells) {
      if (c.poly.every((p) => seaAt(p, -2))) c.state = 'sea';
      else if (core && G.contains(core.obstacle, c.c)) c.state = 'core';
      else if (c.d < 1) c.state = 'urban';
      else if (cyber && c.d < 1.3 && angDiff(c.a, aSlum) < 0.5) Object.assign(c, { state: 'urban', type: 'slum', band: true });
      else if (cyber && c.d < 1.12 && noise.get(c.c.x * 0.004 + 31, c.c.y * 0.004) > 0.1) Object.assign(c, { state: 'urban', type: 'shanty', band: true });
      else if (c.d < 1.5 && roadDist(c.c) < Q.bu[1] * (cyber ? 0.8 : 1.1)) Object.assign(c, { state: 'urban', type: 'shanty', band: cyber });
      else c.state = 'rural';
    }
    const urbanCells = cells.filter((c) => c.state === 'urban');

    // 10. Superblocks for the large landmarks, then the zones.
    const isFree = (c) => c && c.state === 'urban' && !c.type && !c.sb && !c.poly.some((p) => seaAt(p, 10)) && riverDist(c.c) > (river ? river.w + 70 : 0);
    const merge = (c, di, dj, type, dry2) => {
      const list = [];
      for (let a = 0; a <= di; a++) for (let b = 0; b <= dj; b++) { const q = cellAt(c.i + a, c.j + b); if (!isFree(q)) return null; list.push(q); }
      for (let a = 1; a <= di; a++) if (cols[c.i + a].kind === 'rail') return null;
      for (let b = 1; b <= dj; b++) if (rows[c.j + b].kind === 'rail') return null;
      if (dry2) return list;
      const last = list[list.length - 1];
      const sb = { type, u0: c.u0, v0: c.v0, u1: last.u1, v1: last.v1 };
      sb.poly = [toW(sb.u0, sb.v0), toW(sb.u1, sb.v0), toW(sb.u1, sb.v1), toW(sb.u0, sb.v1)];
      for (const q of list) Object.assign(q, { sb, type });
      return sb;
    };
    const special = (type, di, dj, score) => {
      let best = null, bs = -Infinity;
      for (const c of urbanCells) {
        if (!isFree(c)) continue;
        const s = score(c);
        if (s > bs && merge(c, di, dj, type, true)) { bs = s; best = c; }
      }
      return best && bs > -Infinity ? merge(best, di, dj, type) : null;
    };
    const band = (lo2, hi2) => (c) => (c.d >= lo2 && c.d <= hi2 ? zr.next() : -Infinity);
    if (station) {
      const fc = cellOf(G.add(G.centroid(station.building), G.scale(G.sub(station.label, station.R0), 0.9)));
      if (isFree(fc)) fc.type = 'forecourt';
    }
    if (cyber) {
      if (opts.citadel) {
        const i0 = cols.findIndex((l) => l.axis), j0 = rows.findIndex((l) => l.axis);
        const c0 = cellAt(i0 - 1, j0 - 1);
        if (!(c0 && merge(c0, 1, 1, 'castle')) && !special('castle', 1, 1, (c) => -c.d)) special('castle', 0, 0, (c) => -c.d);
      }
      if (opts.temple) special('temple', 0, 0, band(0.2, 0.5));
      if (opts.plaza) special('market', 0, 0, (c) => (c.avenue && c.d > 0.2 && c.d < 0.55 ? zr.next() : -Infinity));
      special('park', 0, 0, band(0.3, 0.7));
      for (let q = big ? 2 : 1; q > 0; q--) special('military', 0, 0, band(0.25, 0.5));
    } else {
      const toStation = (c) => (station ? -G.dist(c.c, station.R0) / Ru : -Math.abs(c.d - 0.4));
      if (opts.citadel) special('castle', size === 'small' ? 0 : 1, size === 'huge' ? 1 : 0, (c) => (c.d > 0.2 && c.d < 0.65 ? toStation(c) + zr.float(0, 0.25) : -Infinity));
      if (size !== 'small') special('fair', 1, big ? 1 : 0, (c) => (c.d > 0.72 && c.d < 1 && angDiff(c.a, aFair) < 0.9 ? zr.next() : -Infinity));
      if (big) special('stadium', 1, 1, (c) => (c.d > 0.6 && c.d < 0.95 && angDiff(c.a, aFair) > 0.9 ? zr.next() : -Infinity));
      if (big) special('park', 1, 1, band(0.3, 0.7));
      const nParks = Math.max(1, Math.round(urbanCells.length / 40));
      for (let q = 0; q < nParks; q++) special('park', 0, 0, (c) => (c.d < 0.9 ? zr.next() + (riverDist(c.c) < Q.bu[1] * 1.6 ? 0.6 : 0) : -Infinity));
      for (let q = size === 'huge' ? 2 : size === 'small' ? 0 : 1; q > 0; q--) {
        const mall = special('merchant', 0, 0, (c) => (c.d > 0.78 && c.d < 1 && c.avenue ? zr.next() : -Infinity));
        if (mall) mall.mall = true;
      }
    }
    for (const c of urbanCells) {
      if (c.type) continue;
      const d = c.d, a = c.a;
      if (harbourAt(c.c)) c.type = 'harbour';
      else if (cyber) {
        c.type = d < 0.3 ? 'administration'
          : d > 0.84 && angDiff(a, aSlum) < 0.5 ? 'slum'
            : d > 0.7 && angDiff(a, aInd) < 0.6 ? 'industrial'
              : d > 0.28 && d < 0.66 && angDiff(a, aRich) < 0.55 ? 'patriciate'
                : c.avenue && zr.bool(0.4) ? 'merchant' : 'craftsmen';
      } else {
        c.type = d > 0.78 && angDiff(a, aInd) < 0.62 ? 'industrial'
          : d > 0.3 && d < 0.85 && angDiff(a, aRich) < 0.45 ? 'patriciate'
            : d > 0.84 ? 'shanty'
              : d > 0.5 && angDiff(a, aInd) < 1.35 ? 'slum'
                : d < 0.6 && c.avenue && zr.bool(0.55) ? 'merchant' : 'craftsmen';
      }
    }

    // 11. Blocks: cells carved by the core, the station, water, railway and roads.
    const cutsU = [], cutsR = [];
    if (river) { cutsU.push(corridor(river.pts, river.w / 2 + Q.street + 2.5)); cutsR.push(corridor(river.pts, river.w / 2 + 4)); }
    if (coast) { const cp = simplify(coast.pts, 1); cutsU.push(corridor(cp, Q.street + 3)); cutsR.push(corridor(cp, 4)); }
    if (rail) { cutsU.push(corridor(rail.pts, Q.rail / 2 + 1)); cutsR.push(corridor(rail.pts, Q.rail / 2 + 3)); }
    for (const rg of ring) { cutsU.push(corridor(rg.pts, Q.ring / 2 + 3, rg.closed)); cutsR.push(corridor(rg.pts, Q.ring / 2 + 3, rg.closed)); }
    for (const rd of roads) {
      if (!rd.axis) { cutsU.push(corridor(rd.urban, Q.avenue / 2 + 1)); cutsR.push(corridor(rd.urban, Q.avenue / 2 + 2)); }
      cutsU.push(corridor(rd.rural, Q.road / 2 + 2));
      cutsR.push(corridor(rd.rural, Q.road / 2 + 3));
    }
    const obstacles = [];
    if (core) obstacles.push(core.obstacle);
    if (station) obstacles.push(station.zone);
    const carve = (poly, urban) => {
      let ps = [poly];
      for (const ob of obstacles) ps = carveConvex(ps, ob);
      for (const cor of urban ? cutsU : cutsR) ps = carveLine(ps, cor);
      return ps.filter((p) => G.area(p) > (urban ? 250 : 600) && !seaAt(G.centroid(p)) && !p.some((v) => seaAt(v, -4)));
    };

    const br = fork('buildings');
    const k = M / 500;
    const X = { U, cyber, small: size === 'small' && !cyber, tree: cyber ? 14 : 12, tr: cyber ? [3, 4.5] : [3.2, 5], furrow: 4 * k, shack: 60 + 14 * k };
    const wards = [];
    const newWard = (type, block, inner) => ({ type, inner, block, buildings: [], special: [] });
    const done = new Set();
    for (const c of urbanCells) {
      const unit = c.sb || c;
      if (done.has(unit)) continue;
      done.add(unit);
      let pieces = carve(c.sb ? c.sb.poly : c.poly, true);
      if (c.sb && pieces.length > 1) pieces.sort((x, y) => G.area(y) - G.area(x));
      pieces.forEach((piece, i) => {
        const type = i && c.sb ? (cyber ? 'craftsmen' : 'park') : unit.type;
        const w = newWard(type, piece, true);
        w.d = c.d;
        if (c.band) w.band = true;
        if (unit.mall && !i) w.mall = true;
        fillBlock(br, w, X);
        delete w.d;
        wards.push(w);
      });
    }

    // 12. The historic core: Voronoi patches clipped to the outline, with the medieval wards.
    const landmarks = [];
    const census = {};
    if (core) {
      const kr = core.rng, C = core.C;
      const s0 = Math.sqrt(2000 / Math.PI), golden = Math.PI * (3 - Math.sqrt(5)), b0 = kr.float(0, Math.PI * 2);
      const pts = [];
      for (let i = 0, n1 = Math.round(P.core * 3); i < n1; i++) {
        const rad = s0 * Math.sqrt(i + 0.5) * (1 + kr.float(-0.1, 0.1));
        const a = b0 + i * golden + kr.float(-0.3, 0.3);
        pts.push({ x: Math.cos(a) * rad, y: Math.sin(a) * rad });
      }
      const topo = buildTopo(Carto.Voronoi.relax(pts, 2, (p) => G.len(p) < Rcore * 1.3), Rcore * 1.8);
      const inCore = new Set(topo.patches.filter((p) => {
        const cl = G.clipConvex(p.verts, C);
        return cl.length >= 3 && G.area(cl) > Math.max(150, G.area(p.verts) * 0.35);
      }));
      const edges = topo.edges();
      const nbrs = (p) => {
        const out = [];
        for (let i = 0; i < p.verts.length; i++) {
          const e = edges.get(key(p.verts[i], p.verts[(i + 1) % p.verts.length]));
          for (const q of e.patches) if (q !== p && inCore.has(q) && !out.includes(q)) out.push(q);
        }
        return out;
      };
      let plaza = null, bs = Infinity;
      for (const p of inCore) {
        const a = G.area(p.verts);
        if (a < 700) continue;
        const sc = G.len(G.centroid(p.verts)) / Math.sqrt(a) + (river && riverDist(G.centroid(p.verts)) < river.w + 30 ? 9 : 0);
        if (sc < bs) { bs = sc; plaza = p; }
      }
      if (plaza) {
        plaza.type = opts.plaza ? 'market' : 'oldtown';
        plaza.plaza = true;
        const around = nbrs(plaza).sort((x, y) => G.area(y.verts) * G.compactness(y.verts) - G.area(x.verts) * G.compactness(x.verts));
        if (opts.temple && around.length) around.shift().type = 'temple';
        if (around.length) around.shift().type = 'administration';
      }
      // Main streets from the gates to the square.
      const adj = new Map();
      for (const e of edges.values()) {
        if (e.patches.length !== 2 || !e.patches.every((p) => inCore.has(p))) continue;
        for (const [a, b] of [[e.a, e.b], [e.b, e.a]]) {
          if (!adj.has(a.id)) adj.set(a.id, []);
          adj.get(a.id).push({ to: b, k: e.k, len: G.dist(a, b) });
        }
      }
      const streetEdges = new Set(), gateCuts = [];
      const vertsIn = [];
      for (const p of inCore) for (const v of p.verts) if (G.contains(C, v) && adj.has(v.id)) vertsIn.push(v);
      const plazaVerts = new Set(plaza ? plaza.verts.map((v) => v.id) : []);
      for (const g of core.gates) {
        let gv = null, gd = Infinity;
        for (const v of vertsIn) { const d = G.dist(v, g); if (d < gd) { gd = d; gv = v; } }
        if (!gv) continue;
        gateCuts.push(corridor([g, gv], 4.2));
        const path = plaza ? shortestPath(adj, gv, (v) => plazaVerts.has(v.id), (e) => e.len * (streetEdges.has(e.k) ? 0.45 : 1)) : null;
        if (path) for (let i = 0; i + 1 < path.length; i++) streetEdges.add(key(path[i], path[i + 1]));
      }
      const Cin = G.insetConvex(C, 3);
      const coreCuts = cutsU.filter((cor, i) => i < (river ? 1 : 0) + (coast ? 1 : 0)).concat(gateCuts);
      for (const p of inCore) {
        const vs = p.verts, n = vs.length;
        const ins = vs.map((a, i) => {
          const kk = key(a, vs[(i + 1) % n]), e = edges.get(kk), o = e.patches.find((q) => q !== p);
          if (streetEdges.has(kk)) return 4.2;
          if (o && (o.plaza || p.plaza)) return 3.5;
          return !o || !inCore.has(o) ? 1.5 : 1.3;
        });
        let block = G.insetConvex(vs, ins);
        if (block.length >= 3) block = G.clipConvex(block, Cin);
        if (block.length < 3) continue;
        let pieces = [block];
        for (const cor of coreCuts) pieces = carveLine(pieces, cor);
        pieces = pieces.filter((q) => G.area(q) > 40).sort((x, y) => G.area(y) - G.area(x));
        pieces.forEach((piece, i) => {
          const type = i && p.type !== 'oldtown' && p.type ? 'oldtown' : p.type || 'oldtown';
          const w = newWard(type, piece, true);
          w.core = true;
          const c = G.centroid(piece);
          if (type === 'market') {
            w.square = true;
            if (G.area(piece) > 500) w.fountain = { x: c.x, y: c.y, r: 4 };
            landmarks.push({ key: 'city.market', x: c.x, y: c.y + (w.fountain ? 12 : 0) });
          } else if (type === 'temple') {
            const f = G.frame(piece);
            const L = f.w * 0.66, Wd = Math.min(f.h * 0.42, L * 0.36);
            const cath = placeShape(cathedralShape(L, Wd), f, G.insetConvex(piece, 2));
            if (cath) {
              w.special = [cath];
              const bb = G.rect(f.c.x, f.c.y, L + 9, Wd * 2 + 9, Math.atan2(f.u.y, f.u.x));
              w.buildings = buildings(kr, piece, 'temple').buildings.filter((b) => !G.convexOverlap(b, bb, 0));
              w.square = true;
              landmarks.push({ key: 'city.cathedral', x: f.c.x, y: f.c.y - Wd * 1.1 - 8 });
            } else Object.assign(w, buildings(kr, piece, 'craftsmen'));
          } else if (type === 'administration') {
            Object.assign(w, buildings(kr, piece, 'administration'));
            w.trees = [];
            for (const gd of w.gardens) if (G.area(gd) > 120 && kr.bool(0.7)) w.trees.push(...trees(kr, gd, 8, 2.6, 3.8));
            landmarks.push(Object.assign({ key: 'ward.administration', district: true }, c));
          } else Object.assign(w, buildings(kr, piece, 'craftsmen'));
          wards.push(w);
        });
      }
      for (const t2 of ['market', 'temple', 'administration', 'oldtown']) if (wards.some((w) => w.core && w.type === t2)) census[t2] = 1;
      // Old town walls with bastions, opened at the gates.
      if (opts.walls) {
        const wl = G.insetConvex(C, 1);
        const lines = [];
        let cur = [];
        const n = wl.length;
        for (let i = 0; i <= n; i++) {
          const a = wl[i % n], b = wl[(i + 1) % n];
          cur.push(a);
          if (i === n) break;
          const cuts = core.gates.map((g) => ({ g, t: G.dot(G.sub(g, a), G.sub(b, a)) / G.dist2(a, b) }))
            .filter((x) => x.t > 0 && x.t < 1 && G.distToSegment(x.g, a, b) < 6).sort((x, y) => x.t - y.t);
          for (const x of cuts) {
            const len = G.dist(a, b), t1 = Math.max(0, x.t - 9 / len), t2 = Math.min(1, x.t + 9 / len);
            cur.push(G.lerp(a, b, t1));
            lines.push(cur);
            cur = [G.lerp(a, b, t2)];
          }
        }
        if (lines.length && cur.length) lines[0] = cur.concat(lines[0]);
        else if (cur.length) lines.push(cur);
        core.walls = lines.filter((l) => l.length > 1);
        core.bastions = wl.map((v, i) => {
          const e1 = G.norm(G.sub(wl[(i + n - 1) % n], v)), e2 = G.norm(G.sub(wl[(i + 1) % n], v));
          const o = G.scale(G.norm(G.add(e1, e2)), -1);
          return [G.add(v, G.scale(e1, 12)), G.add(v, G.scale(o, 16)), G.add(v, G.scale(e2, 12)), G.add(v, G.scale(o, -4))];
        }).filter((b) => !core.gates.some((g) => G.dist(g, b[3]) < 22));
      }
    }

    // 13. Countryside: parcels of up to 3 x 3 cells between the lanes, carved by roads and water.
    const rural = (c) => c && c.state === 'rural' && !c.used;
    for (const c of cells.slice().sort((x, y) => x.j - y.j || x.i - y.i)) {
      if (!rural(c)) continue;
      let ei = c.i, ej = c.j;
      for (let a = 1, di = zr.int(0, 2); a <= di; a++) {
        if (cols[c.i + a].lane || cols[c.i + a].kind === 'rail' || !rural(cellAt(c.i + a, c.j))) break;
        ei = c.i + a;
      }
      for (let b = 1, dj = zr.int(0, 2); b <= dj; b++) {
        let ok = !rows[c.j + b].lane && rows[c.j + b].kind !== 'rail';
        for (let a = c.i; a <= ei && ok; a++) ok = rural(cellAt(a, c.j + b));
        if (!ok) break;
        ej = c.j + b;
      }
      for (let a = c.i; a <= ei; a++) for (let b = c.j; b <= ej; b++) cellAt(a, b).used = true;
      // Fields reach the middle of the grid lines: only the lanes are tracks.
      const u0 = cols[c.i].pos, u1 = cols[ei + 1].pos, v0 = rows[c.j].pos, v1 = rows[ej + 1].pos;
      const poly = G.insetConvex([toW(u0, v0), toW(u1, v0), toW(u1, v1), toW(u0, v1)], 2);
      if (poly.length < 3) continue;
      const pc = G.centroid(poly), d = dOf(pc);
      const forest = noise.fbm(pc.x * 0.0016 + 300, pc.y * 0.0016, 3);
      let type;
      if (cyber) type = opts.farms && d < 1.8 && zr.bool(0.3) ? 'farm' : zr.bool(0.1) && roadDist(pc) < 260 ? 'outer' : 'wood';
      else if (forest > 0.3 && d > 1.25) type = 'wood';
      else type = opts.farms ? (zr.bool(0.1) ? 'meadow' : 'farm') : forest > 0.05 ? 'wood' : 'meadow';
      for (const piece of carve(poly, false)) {
        const w = newWard(type, piece, false);
        fillBlock(br, w, X);
        wards.push(w);
      }
    }

    // 14. Streets: grid segments between built cells, cut where they meet water, the core,
    //     the railway or the ring road; bridges where they cross the river.
    const streets = [], bridges = [], railBridges = [];
    const rcor = river ? corridor(river.pts, river.w / 2 + 1) : null;
    const railCor = rail ? corridor(rail.pts, Q.rail / 2) : null;
    const ringCor = ring.map((rg) => corridor(rg.pts, Q.ring / 2, rg.closed));
    const coreStop = core ? core.boulevard : null;
    const nearOf = (cor, a, b) => (cor ? segsNear(cor, { x0: Math.min(a.x, b.x), x1: Math.max(a.x, b.x), y0: Math.min(a.y, b.y), y1: Math.max(a.y, b.y) }) : []);
    const hit = (segs, p, hw) => segs.some((s) => G.distToSegment(p, s.a, s.b) < hw);
    const addStreet = (a, b, w, kind, bridge) => {
      const nr = nearOf(rcor, a, b), nl = nearOf(railCor, a, b);
      const ng = [].concat(...ringCor.map((rc) => nearOf(rc, a, b)));
      const len = G.dist(a, b), n = Math.max(1, Math.ceil(len / 4));
      const main = kind === 'road' || kind === 'ring';
      const pts = [], st = [];
      for (let q = 0; q <= n; q++) {
        const p = G.lerp(a, b, q / n);
        let s = 1;
        if (seaAt(p, 2) || (station && G.contains(station.zone, p))) s = 0;
        else if (!main && coreStop && G.contains(coreStop, p)) s = 0;
        else if (!main && kind !== 'avenue' && nl.length && hit(nl, p, Q.rail / 2 + 1)) s = 0;
        else if (kind !== 'avenue' && !main && ng.length && hit(ng, p, Q.ring / 2 + 1)) s = 0;
        else if (nr.length && hit(nr, p, river.w / 2 + 1)) s = bridge ? 2 : 0;
        pts.push(p);
        st.push(s);
      }
      // Bridges cross the river squarely: a street running along it stops at the bank instead.
      for (let q = 0; q <= n;) {
        if (st[q] !== 2) { q++; continue; }
        let e = q;
        while (e + 1 <= n && st[e + 1] === 2) e++;
        const long = G.dist(pts[q], pts[e]) > river.w * (main ? 2.4 : 1.25) + 8;
        if (long) for (let x = q; x <= e; x++) st[x] = 0;
        else {
          const d = G.norm(G.sub(b, a));
          bridges.push({ a: G.sub(pts[q], G.scale(d, 5)), b: G.add(pts[e], G.scale(d, 5)), w: w + 3 });
        }
        q = e + 1;
      }
      let run = null;
      for (let q = 0; q <= n; q++) {
        if (st[q]) { if (!run) { run = { a: pts[q], b: pts[q] }; streets.push(Object.assign(run, { w, kind })); } else run.b = pts[q]; } else run = null;
      }
    };
    const built = (c) => c && c.state === 'urban';
    const ruralLane = (c) => c && c.state === 'rural';
    for (const [fam, other, isCol] of [[cols, rows, true], [rows, cols, false]]) {
      for (let i = 1; i < fam.length - 1; i++) {
        const line = fam[i];
        if (line.kind === 'rail') continue;
        for (let j = 0; j + 1 < other.length; j++) {
          const A = isCol ? cellAt(i - 1, j) : cellAt(j, i - 1), Bc = isCol ? cellAt(i, j) : cellAt(j, i);
          if (!A && !Bc) continue;
          let kind = line.kind;
          if (A && Bc && A.sb && A.sb === Bc.sb) continue;
          if (!built(A) && !built(Bc)) {
            if (!(line.lane && ruralLane(A) && ruralLane(Bc))) continue;
            kind = 'lane';
          }
          const a = isCol ? toW(line.pos, other[j].pos) : toW(other[j].pos, line.pos);
          const b = isCol ? toW(line.pos, other[j + 1].pos) : toW(other[j + 1].pos, line.pos);
          addStreet(a, b, kind === 'lane' ? Q.lane : lineW(line), kind, kind === 'avenue' || (cyber && kind === 'street' && i % 3 === 0));
        }
      }
    }
    const each = (pts, closed, fn) => { for (let i = 0; i + 1 < pts.length + (closed ? 1 : 0); i++) fn(pts[i], pts[(i + 1) % pts.length]); };
    for (const rd of roads) {
      if (!rd.axis) addStreet(rd.urban[0], rd.urban[1], Q.avenue, 'avenue', true);
      each(rd.pts, false, (a, b) => addStreet(a, b, Q.road, 'road', true));
    }
    for (const rg of ring) each(rg.pts, rg.closed, (a, b) => addStreet(a, b, Q.ring, 'ring', true));
    if (core) each(core.boulevard, true, (a, b) => addStreet(a, b, Q.avenue, 'avenue', true));
    // Embankments and the seafront.
    const banks = [];
    if (river) {
      for (const side of [-1, 1]) {
        const off = G.offsetPolyline(river.pts, side * (river.w / 2 + Q.street / 2 + 1.5));
        const edge = G.offsetPolyline(river.pts, side * (river.w / 2));
        let cur = null;
        for (let i = 0; i + 1 < off.length; i++) {
          const mid = G.mid(off[i], off[i + 1]);
          if (dOf(mid) < 1.02 || river.canal) {
            addStreet(off[i], off[i + 1], Q.street, 'street', false);
            if (!cur) banks.push(cur = [edge[i]]);
            cur.push(edge[i + 1]);
          } else cur = null;
        }
      }
    }
    if (coast) {
      const sea2 = coast.pts.map((p) => G.sub(p, G.scale(coast.n, Q.street / 2 + 2)));
      each(sea2, false, (a, b) => { if (dOf(G.mid(a, b)) < 1.02) addStreet(a, b, Q.street, 'street', false); });
    }
    if (rail && river) {
      const near = segsNear(corridor(river.pts, river.w / 2 + 2), G.bbox(rail.pts));
      each(rail.pts, false, (a, b) => {
        const n = Math.ceil(G.dist(a, b) / 4);
        let wet = null;
        for (let q = 0; q <= n; q++) {
          const p = G.lerp(a, b, q / n);
          if (hit(near, p, river.w / 2 + 1)) { if (!wet) railBridges.push(wet = { a: p, b: p, w: Q.rail * 0.6 }); else wet.b = p; } else wet = null;
        }
      });
      for (const rb of railBridges) {
        const d = G.norm(G.sub(rb.b, rb.a));
        rb.a = G.sub(rb.a, G.scale(d, 6)); rb.b = G.add(rb.b, G.scale(d, 6));
      }
    }
    // Roundabouts where the roads out of town meet the ring road.
    const roundabouts = [];
    for (const rd of roads) {
      for (const rg of ring) {
        each(rg.pts, rg.closed, (a, b) => each(rd.pts, false, (c, d) => {
          const x = G.segmentIntersect(a, b, c, d);
          if (x && !roundabouts.some((q) => G.dist(q, x) < 40)) roundabouts.push({ x: x.x, y: x.y, r: 20 });
        }));
      }
    }
    // Trees along the avenues (neon strips in cyberpunk).
    const avenues = streets.filter((s) => s.kind === 'avenue' && dOf(G.mid(s.a, s.b)) < 1.05).map((s) => [s.a, s.b]);

    // 15. Harbour: piers into the sea, a breakwater, cranes and containers.
    let harbour = null;
    if (coast && wards.some((w) => w.type === 'harbour') || coast && size === 'small') {
      const hr = fork('harbour');
      const small = X.small;
      const pierL = (cyber ? 1.25 : 1) * { small: 55, medium: 140, large: 200, huge: 260 }[size];
      const pierW = small ? 4 : (cyber ? 62 : 46);
      harbour = { piers: [], cranes: [], containers: [], pads: [], breakwater: null };
      const ang = G.angle(coast.n);
      for (let s = sH - P.harbour + 30; s < sH + P.harbour - 20; s += small ? hr.float(24, 32) : hr.float(110, 160)) {
        const base = shore(s), len = pierL * hr.float(0.75, 1.1), w2 = pierW * hr.float(0.85, 1.15);
        const c = G.add(base, G.scale(coast.n, len / 2 - 8));
        const pier = G.rect(c.x, c.y, len + 16, w2, ang);
        if (river && G.distToPolyline(c, river.pts) < river.w + w2 + len / 2) continue;
        harbour.piers.push(pier);
        if (small) continue;
        // Cranes along one side, containers on the deck, drone pads at the tip.
        const side = hr.sign(), pf = { c, u: coast.n, v: coast.t };
        for (let x = -len / 2 + 14; x < len / 2 - 10; x += 34) harbour.cranes.push(frect(pf, x, side * (w2 / 2 - 2), 7, 24));
        for (let x = -len / 2 + 6; x < len / 2 - 24; x += 13.4) {
          for (let y = -w2 / 2 + 12; y < w2 / 2 - 14; y += 3) if (hr.bool(0.8)) harbour.containers.push(frect(pf, x + 6, -side * 2 + y, 12.2, 2.4));
        }
        if (cyber) { const t2 = fpt(pf, len / 2 - 4, 0); harbour.pads.push(G.regular(t2.x, t2.y, Math.min(14, w2 / 2 - 4), 20)); }
      }
      // Breakwater: parallel to the shore, open at one end.
      const far = pierL * 1.15 + (small ? 40 : 70), s1 = sH - P.harbour - 50, s2 = sH + P.harbour + 50;
      const o1 = coast.reach + Math.max(coast.off(s1), coast.off(s2)) + far;
      const mk = (s) => G.add(G.scale(coast.t, s), G.scale(coast.n, o1));
      harbour.breakwater = hr.bool() ? [shore(s2, -5), mk(s2), mk(s1 + (small ? 40 : 110))] : [shore(s1, -5), mk(s1), mk(s2 - (small ? 40 : 110))];
      landmarks.push({ key: small ? 'city.marina' : 'city.harbour', x: G.mid(shore(sH), mk(sH)).x, y: G.mid(shore(sH), mk(sH)).y, offshore: true });
    }

    // 16. Names on the map: landmarks, districts and road numbers.
    const nameR = fork('labels');
    const centre = (list) => {
      const avg = G.average(list.map((w) => G.centroid(w.block)));
      let best = null, bd = Infinity;
      for (const w of list) { const d = G.dist(G.centroid(w.block), avg); if (d < bd) { bd = d; best = w; } }
      return best ? G.centroid(best.block) : avg;
    };
    const byType = (t2, core2 = false) => wards.filter((w) => w.inner && w.type === t2 && !!w.core === core2);
    const castleW = byType('castle')[0];
    const extra = {};
    if (cyber) extra.corp = Carto.Names.corp(nameR); else extra.mayor = Carto.Names.person(nameR);
    if (castleW) {
      const c = G.centroid(castleW.block);
      landmarks.push(cyber ? { key: 'city.arcology', params: { n: extra.corp }, x: c.x, y: c.y + (castleW.arcology ? 0 : 20) } : { key: 'city.castle', x: c.x, y: c.y });
    }
    for (const [t2, key2] of [['temple', 'city.cathedral'], ['market', 'city.market']]) {
      if (!cyber) continue;
      const list = byType(t2);
      if (list.length) { const c = G.centroid(list[0].block); landmarks.push({ key: key2, x: c.x, y: c.y }); }
    }
    if (station) landmarks.push({ key: 'city.station', x: station.label.x, y: station.label.y });
    const stad = byType('stadium')[0];
    if (stad) { const c = G.centroid(stad.block); landmarks.push({ key: 'city.stadium', x: c.x, y: c.y }); }
    const named = cyber
      ? ['craftsmen', 'merchant', 'patriciate', 'administration', 'slum', 'military', 'shanty', 'industrial']
      : ['oldtown', 'merchant', 'patriciate', 'fair', 'slum', 'park', 'shanty', 'industrial'];
    for (const t2 of named) {
      const list = t2 === 'oldtown' ? byType(t2, true) : byType(t2);
      if (!list.length) continue;
      const c = t2 === 'oldtown' ? { x: 0, y: -Rcore * 0.62 } : centre(list);
      landmarks.push(Object.assign({ key: 'ward.' + t2, district: true }, c));
    }
    if (ring.length) {
      const pts = ring[0].pts;
      const at = pts[Math.floor(pts.length * 0.62)];
      landmarks.push({ key: 'city.ring', x: at.x, y: at.y, road: true });
    }
    const roadLabels = cyber ? sky.map((s) => ({ pts: s, main: true })).concat(roads.map((r2) => ({ pts: r2.pts }))) : roads.map((r2, i) => ({ pts: r2.pts, main: !i }));
    for (const rl of roadLabels) {
      const pts = rl.pts.length === 2 ? G.resample(rl.pts, 30) : rl.pts;
      const at = pts.find((v) => Math.max(Math.abs(v.x), Math.abs(v.y)) > M * (rl.main && cyber ? 0.62 : 0.8));
      if (at) landmarks.push({ key: rl.main ? 'city.road.main' : 'city.road', params: { n: rl.main ? nameR.int(1, 99) : nameR.int(10, 320) }, x: at.x, y: at.y, road: true });
    }

    // 17. Census: districts are runs of neighbouring cells of one type.
    const seen = new Set();
    for (const c of urbanCells) {
      if (seen.has(c) || !c.type || c.type === 'forecourt') continue;
      census[c.type] = (census[c.type] || 0) + 1;
      const stack = [c];
      seen.add(c);
      while (stack.length) {
        const q = stack.pop();
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const nb = cellAt(q.i + di, q.j + dj);
          if (nb && !seen.has(nb) && nb.state === 'urban' && nb.type === c.type) { seen.add(nb); stack.push(nb); }
        }
      }
    }
    if (station) census.station = 1;
    extra.outer = {};
    for (const w of wards) if (!w.inner) extra.outer[w.type === 'outer' ? 'industrial' : w.type] = (extra.outer[w.type === 'outer' ? 'industrial' : w.type] || 0) + 1;

    let floor = 0;
    const fl = FLOORS[cyber ? 'cyber' : 'modern'];
    for (const w of wards) {
      if (!w.inner || !fl[w.type]) continue;
      for (const b of w.buildings.concat(w.type === 'castle' ? w.special : [])) floor += G.area(b) * fl[w.type];
    }
    // Bigger towns build taller.
    floor *= { small: 0.8, medium: 1, large: 1.4, huge: 2 }[size];
    const population = cyber ? Math.round(floor / 15 / 1000) * 1000 : Math.round(floor / 40 / 100) * 100;
    const name = opts.name ? opts.name : Carto.Names.place(fork('name'));
    const sea = coast ? coast.pts.concat([G.add(coast.pts[coast.pts.length - 1], G.scale(coast.n, M * 4)), G.add(coast.pts[0], G.scale(coast.n, M * 4))]) : null;
    return {
      layout: 'grid', seed, name, size, M, Rc: Ru, walls: !!opts.walls, U,
      wards, bridges, railBridges, avenues, roundabouts, banks,
      sea, coastline: coast ? coast.pts : null,
      river: river ? { pts: river.pts, w: river.w, canal: !!river.canal } : null,
      rail: rail ? { pts: rail.pts } : null, station, ring, sky, harbour,
      wall,
      core: core ? { C: core.C, belt: opts.walls ? grow(core.C, core.gb) : null, walls: core.walls || [], bastions: core.bastions || [] } : null,
      roads: roads.map((r2) => r2.pts), landmarks,
      streets: streets.filter((s) => G.dist(s.a, s.b) > 1),
      wallLines: [], towers: [], gateTowers: [], castle: null,
      population, buildingCount: wards.reduce((s, w) => s + w.buildings.length + (w.type === 'castle' || w.type === 'fair' || w.type === 'temple' && w.core ? w.special.length : 0), 0),
      gateCount: roads.length, census, extra,
    };
  }

  function renderGrid(m, o) {
    const pal = o.palette;
    const cyber = Carto.Setting.current === 'cyber';
    const M = m.M, S = 2 * M, k = M / 500;
    const svg = new Svg(S, S);
    const clip = Carto.uid('cityclip'), woodPat = Carto.uid('woods');
    const tr = 4.2 * k;
    svg.defs('<clipPath id="' + clip + '"><rect x="' + -M + '" y="' + -M + '" width="' + S + '" height="' + S + '"/></clipPath>' +
      '<pattern id="' + woodPat + '" width="' + Svg.num(tr * 4) + '" height="' + Svg.num(tr * 4) + '" patternUnits="userSpaceOnUse">' +
      (cyber
        ? '<path d="M' + Svg.num(tr) + ' ' + Svg.num(tr * 1.4) + 'l' + Svg.num(tr * 0.8) + ' 0M' + Svg.num(tr * 2.6) + ' ' + Svg.num(tr * 3.2) + 'l' + Svg.num(tr * 0.6) + ' 0" stroke="' + pal.greenInk + '" stroke-width="' + Svg.num(k * 0.8) + '" opacity="0.6"/>'
        : '<circle cx="' + Svg.num(tr) + '" cy="' + Svg.num(tr) + '" r="' + Svg.num(tr * 0.8) + '" fill="' + pal.tree + '" stroke="' + pal.greenInk + '" stroke-width="' + Svg.num(k * 0.4) + '"/>' +
          '<circle cx="' + Svg.num(tr * 3) + '" cy="' + Svg.num(tr * 3) + '" r="' + Svg.num(tr * 0.9) + '" fill="' + pal.tree + '" stroke="' + pal.greenInk + '" stroke-width="' + Svg.num(k * 0.4) + '"/>') +
      '</pattern>');
    svg.rect(0, 0, S, S, { fill: pal.paper });
    svg.open({ transform: 'translate(' + M + ' ' + M + ')', clipPath: 'url(#' + clip + ')' });
    const lw = 0.32 * k + 0.25;
    const Bt = () => new Svg.Batch();
    const draw = (b, a) => svg.path(b.toString(), a);
    const all = (key2, fn) => { for (const w of m.wards) if (w[key2]) for (const x of w[key2]) fn(x, w); };

    // Countryside: fields, meadows, woods, wasteland.
    const fieldA = Bt(), fieldB = Bt(), meadow = Bt(), furrows = Bt(), woods = Bt();
    all('fields', (f) => {
      (f.kind === 'field' ? fieldA : f.kind === 'fieldAlt' ? fieldB : meadow).poly(f.poly);
      for (const s of f.furrows) furrows.line(s[0], s[1]);
    });
    for (const w of m.wards) {
      if (w.wood) woods.poly(w.block);
      if (w.meadow) meadow.poly(w.block);
    }
    draw(meadow, { fill: pal.green, opacity: 0.5 });
    draw(fieldA, { fill: pal.field, stroke: pal.fieldInk, strokeWidth: 0.4 * k });
    draw(fieldB, { fill: pal.fieldAlt, stroke: pal.fieldInk, strokeWidth: 0.4 * k });
    draw(furrows, { stroke: pal.fieldInk, strokeWidth: 0.3 * k, fill: 'none', opacity: 0.55 });
    if (cyber) draw(woods, { fill: pal.field, opacity: 0.6 });
    else draw(woods, { fill: pal.green, opacity: 0.55 });
    draw(woods, { fill: 'url(#' + woodPat + ')' });

    // Town ground: blocks, squares and yards, parks and gardens.
    const ground = Bt(), squares = Bt(), yards = Bt(), parks = Bt(), gardens = Bt(), lawns = Bt(), parking = Bt(), stalls = Bt();
    for (const w of m.wards) {
      if (!w.inner) continue;
      if (w.green) parks.poly(w.block);
      else if (w.square) squares.poly(w.block);
      else ground.poly(w.block);
    }
    all('yards', (y) => yards.poly(y));
    all('gardens', (g) => gardens.poly(g));
    all('lawns', (g) => lawns.poly(g));
    all('parking', (p) => {
      parking.poly(p);
      for (const s of G.stripes(G.insetConvex(p, 2.5), G.perp(m.U), 5.5, 0.5)) stalls.line(s[0], s[1]);
    });
    if (m.core) {
      if (m.core.belt) svg.poly(m.core.belt, { fill: pal.green, stroke: pal.greenInk, strokeWidth: 0.4 * k });
      svg.poly(m.core.C, { fill: pal.road });
    }
    draw(ground, { fill: pal.paperShade });
    draw(squares, { fill: pal.road, stroke: pal.inkSoft, strokeWidth: 0.25 * k });
    draw(yards, { fill: pal.rock, stroke: pal.inkSoft, strokeWidth: 0.25 * k });
    draw(lawns, { fill: pal.green, opacity: 0.45 });
    draw(gardens, { fill: pal.green, opacity: 0.55 });
    draw(parks, { fill: pal.green, stroke: pal.greenInk, strokeWidth: 0.4 * k });
    draw(parking, { fill: pal.grid, stroke: pal.inkSoft, strokeWidth: 0.3 * k });
    draw(stalls, { stroke: pal.inkSoft, strokeWidth: 0.2 * k, opacity: 0.6 });
    const paths = Bt(), ponds = Bt(), pools = Bt();
    all('paths', (p) => paths.poly(p, false));
    all('ponds', (p) => ponds.poly(p));
    all('pools', (p) => pools.poly(p));
    draw(paths, { fill: 'none', stroke: pal.road, strokeWidth: 2.2 + 0.6 * k, strokeLinecap: 'round', strokeLinejoin: 'round' });

    // Water: sea, river or canal, embankments.
    if (m.sea) {
      const sd = Svg.d(m.sea);
      svg.path(sd, { fill: pal.water });
      if (!cyber) {
        const sclip = Carto.uid('seaclip');
        svg.defs('<clipPath id="' + sclip + '"><path d="' + sd + '"/></clipPath>');
        svg.open({ clipPath: 'url(#' + sclip + ')' });
        for (const [wd, op] of [[34, 0.1], [18, 0.16], [8, 0.3]]) svg.poly(m.coastline, { fill: 'none', stroke: pal.waterInk, strokeWidth: wd * k, opacity: op, strokeLinejoin: 'round' }, false);
        svg.close();
      }
      svg.poly(m.coastline, { fill: 'none', stroke: cyber ? pal.ink : pal.waterInk, strokeWidth: (cyber ? 0.9 : 1.1) * k, strokeLinejoin: 'round', opacity: cyber ? 0.7 : 1 }, false);
    }
    if (m.river) {
      const rd = Svg.d(m.river.canal ? m.river.pts : G.chaikin(m.river.pts, 1, false), false);
      svg.path(rd, { fill: 'none', stroke: pal.waterInk, strokeWidth: m.river.w + 1.6 * k, strokeLinejoin: m.river.canal ? 'miter' : 'round', strokeLinecap: 'butt' });
      svg.path(rd, { fill: 'none', stroke: pal.water, strokeWidth: m.river.w, strokeLinejoin: m.river.canal ? 'miter' : 'round', strokeLinecap: 'butt' });
      if (cyber) svg.path(rd, { fill: 'none', stroke: pal.waterInk, strokeWidth: m.river.w, strokeLinejoin: 'miter', opacity: 0.22 });
      const bk = Bt();
      for (const b of m.banks) bk.poly(b, false);
      draw(bk, { fill: 'none', stroke: cyber ? pal.ink : pal.ink, strokeWidth: 1.2 * k, opacity: cyber ? 0.8 : 0.7 });
    }
    draw(ponds, { fill: pal.water, stroke: pal.waterInk, strokeWidth: 0.4 * k });
    draw(pools, { fill: pal.water, stroke: pal.waterInk, strokeWidth: 0.3 * k });

    // Piers and breakwater.
    if (m.harbour) {
      const pb = Bt();
      for (const p of m.harbour.piers) pb.poly(p);
      draw(pb, { fill: pal.rock, stroke: pal.ink, strokeWidth: 0.7 * k });
      if (m.harbour.breakwater) {
        svg.poly(m.harbour.breakwater, { fill: 'none', stroke: pal.ink, strokeWidth: 10 + 2 * k, strokeLinejoin: 'round', strokeLinecap: 'round' }, false);
        svg.poly(m.harbour.breakwater, { fill: 'none', stroke: pal.rock, strokeWidth: 10, strokeLinejoin: 'round', strokeLinecap: 'round' }, false);
      }
    }

    // Bridges, then the streets: every casing below every surface, so crossings stay clean.
    const deck = Bt();
    for (const b of m.bridges.concat(m.railBridges)) {
      const L = G.dist(b.a, b.b), c = G.mid(b.a, b.b);
      deck.poly(G.rect(c.x, c.y, L, b.w + 2.5 * k, Math.atan2(b.b.y - b.a.y, b.b.x - b.a.x)));
    }
    draw(deck, { fill: pal.road, stroke: pal.ink, strokeWidth: 0.8 * k });
    const KINDS = ['lane', 'street', 'road', 'avenue', 'ring'];
    const byKind = {};
    for (const kd of KINDS) byKind[kd] = Bt();
    const widths = {};
    for (const s of m.streets) { byKind[s.kind].line(s.a, s.b); widths[s.kind] = s.w; }
    for (const kd of KINDS) {
      if (byKind[kd].empty) continue;
      const strong = kd === 'ring' || kd === 'road';
      draw(byKind[kd], { fill: 'none', stroke: strong ? pal.ink : pal.inkSoft, strokeWidth: widths[kd] + (strong ? 1.6 : 1.1) * k, strokeLinecap: kd === 'lane' ? 'round' : 'square', opacity: kd === 'lane' ? 0.5 : strong ? 0.85 : 0.75 });
    }
    for (const kd of KINDS) {
      if (byKind[kd].empty) continue;
      draw(byKind[kd], { fill: 'none', stroke: pal.road, strokeWidth: widths[kd], strokeLinecap: kd === 'lane' ? 'round' : 'square' });
      if ((kd === 'road' || kd === 'ring') && !cyber) draw(byKind[kd], { fill: 'none', stroke: pal.accent, strokeWidth: widths[kd] * 0.55, strokeLinecap: 'square', opacity: 0.22 });
    }
    if (m.roundabouts.length) {
      const rb = Bt(), rin = Bt();
      for (const q of m.roundabouts) { rb.circle(q.x, q.y, q.r + 7); rin.circle(q.x, q.y, q.r - 4); }
      draw(rb, { fill: pal.road, stroke: pal.ink, strokeWidth: 0.9 * k });
      draw(rin, { fill: pal.green, stroke: pal.greenInk, strokeWidth: 0.5 * k });
    }
    const av = Bt();
    for (const s of m.avenues) {
      const d = G.norm(G.sub(s[1], s[0])), n = G.perp(d), wo = (cyber ? STREETS.cyber.avenue : STREETS.modern.avenue) / 2 - 3.5;
      if (cyber) av.line(s[0], s[1]);
      else for (const sg of [-1, 1]) av.line(G.add(s[0], G.scale(n, wo * sg)), G.add(s[1], G.scale(n, wo * sg)));
    }
    if (cyber) draw(av, { fill: 'none', stroke: pal.accent, strokeWidth: 0.9 * k, strokeDasharray: Svg.num(10 * k) + ' ' + Svg.num(6 * k), opacity: 0.55 });
    else {
      draw(av, { fill: 'none', stroke: pal.greenInk, strokeWidth: 3.6 + 0.9 * k, strokeLinecap: 'round', strokeDasharray: '0 ' + Svg.num(9 + 2 * k), opacity: 0.8 });
      draw(av, { fill: 'none', stroke: pal.tree, strokeWidth: 3 + 0.5 * k, strokeLinecap: 'round', strokeDasharray: '0 ' + Svg.num(9 + 2 * k) });
    }

    // Railway and station.
    if (m.station) {
      const st = m.station, tb = Bt(), pf = Bt();
      for (const t2 of st.tracks) tb.poly(t2, false);
      for (const p of st.platforms) pf.poly(p);
      draw(pf, { fill: pal.paperShade, stroke: pal.inkSoft, strokeWidth: 0.4 * k });
      draw(tb, { fill: 'none', stroke: pal.ink, strokeWidth: 1.1 * k, strokeLinejoin: 'round' });
    }
    if (m.rail) {
      const rd = Svg.d(m.rail.pts, false);
      svg.path(rd, { fill: 'none', stroke: pal.ink, strokeWidth: 3.6 * k, strokeLinejoin: 'round' });
      svg.path(rd, { fill: 'none', stroke: cyber ? pal.accent : pal.paper, strokeWidth: 1.8 * k, strokeDasharray: Svg.num(9 * k) + ' ' + Svg.num(9 * k), opacity: cyber ? 0.8 : 1 });
    }

    // Buildings.
    const houses = Bt(), specials = Bt(), sheds = Bt(), farms = Bt(), tanks = Bt(), cont = [Bt(), Bt(), Bt()], courts = Bt(), huts = Bt();
    const SHED = { industrial: 1, harbour: 1, outer: 1 };
    let ci = 0;
    for (const w of m.wards) {
      const target = SHED[w.type] ? sheds : cyber && (w.type === 'slum' || w.type === 'shanty') ? huts : houses;
      for (const b of w.buildings) target.poly(b);
      for (const s of w.special) if (!w.arcology) specials.poly(s);
      if (w.farms) for (const b of w.farms) farms.poly(b);
      if (w.tanks) for (const b of w.tanks) tanks.poly(b);
      if (w.courts) for (const b of w.courts) courts.poly(b);
      if (w.containers) for (const b of w.containers) cont[ci++ % 3].poly(b);
    }
    if (m.harbour) for (const b of m.harbour.containers) cont[ci++ % 3].poly(b);
    if (m.station) specials.poly(m.station.building);
    draw(houses, { fill: pal.building, stroke: pal.ink, strokeWidth: lw, strokeLinejoin: 'round' });
    draw(sheds, { fill: pal.roof, stroke: pal.ink, strokeWidth: lw, strokeLinejoin: 'round' });
    draw(huts, { fill: pal.roof, stroke: pal.inkSoft, strokeWidth: lw * 0.7, strokeLinejoin: 'round' });
    draw(courts, { fill: pal.paperShade, stroke: pal.ink, strokeWidth: lw * 0.8 });
    draw(tanks, { fill: pal.building, stroke: pal.ink, strokeWidth: lw });
    const cc = [pal.accent, pal.waterInk, pal.greenInk];
    cont.forEach((b, i) => draw(b, { fill: cc[i], opacity: 0.75 }));
    if (cyber) {
      draw(specials, { fill: 'none', stroke: pal.accent, strokeWidth: 3 * k, strokeLinejoin: 'round', opacity: 0.3 });
      draw(farms, { fill: 'none', stroke: pal.greenInk, strokeWidth: 2.4 * k, opacity: 0.35 });
    }
    draw(farms, { fill: pal.green, stroke: pal.greenInk, strokeWidth: lw });
    draw(specials, { fill: pal.buildingSpecial, stroke: cyber ? pal.accent : pal.ink, strokeWidth: lw * 1.5, strokeLinejoin: 'round' });
    if (cyber) {
      const st2 = Bt();
      all('stalls', (s) => st2.poly(s));
      draw(st2, { fill: pal.accent, opacity: 0.85 });
    }
    // Stadium: stands, running track and pitch.
    for (const w of m.wards) {
      if (!w.stadium) continue;
      svg.poly(w.stadium.track, { fill: pal.sand, stroke: pal.ink, strokeWidth: lw });
      svg.poly(w.stadium.pitch, { fill: pal.green, stroke: pal.road, strokeWidth: 0.8 * k });
      const p = w.stadium.pitch;
      svg.path(Svg.line(G.mid(p[0], p[1]), G.mid(p[2], p[3])), { stroke: pal.road, strokeWidth: 0.8 * k });
    }
    // Arcology: stepped tiers with a glowing crown.
    for (const w of m.wards) {
      if (!w.arcology) continue;
      svg.poly(w.arcology[0], { fill: 'none', stroke: pal.accent, strokeWidth: 14 * k, opacity: 0.18, strokeLinejoin: 'round' });
      w.arcology.forEach((tier, i) => svg.poly(tier, { fill: i % 2 ? pal.building : pal.buildingSpecial, stroke: pal.accent, strokeWidth: lw * (i === 3 ? 2.4 : 1.4), strokeLinejoin: 'round' }));
      svg.poly(w.arcology[3], { fill: pal.accent, opacity: 0.35 });
    }
    // Fences and pads (cyberpunk compounds).
    const fences = Bt(), pads = Bt();
    all('fences', (f) => fences.poly(f));
    all('pads', (p) => pads.poly(p));
    if (m.harbour) for (const p of m.harbour.pads) pads.poly(p);
    draw(fences, { fill: 'none', stroke: cyber ? pal.accent : pal.inkSoft, strokeWidth: 0.8 * k, strokeDasharray: Svg.num(4 * k) + ' ' + Svg.num(3 * k), opacity: 0.8 });
    draw(pads, { fill: pal.paperShade, stroke: cyber ? pal.accent : pal.ink, strokeWidth: 0.9 * k });
    // Cranes.
    if (m.harbour && m.harbour.cranes.length) {
      const cr = Bt();
      for (const c of m.harbour.cranes) cr.poly(c);
      draw(cr, { fill: 'none', stroke: pal.accent, strokeWidth: 1.6 * k, strokeLinejoin: 'round' });
    }

    // Fountain in the main square.
    for (const w of m.wards) {
      if (!w.fountain) continue;
      const f = w.fountain;
      svg.circle(f.x, f.y, f.r + 2, { fill: pal.paper, stroke: pal.ink, strokeWidth: 0.6 * k });
      svg.circle(f.x, f.y, f.r, { fill: pal.water, stroke: pal.ink, strokeWidth: 0.4 * k });
    }

    // The corporate wall and its checkpoints (cyberpunk).
    if (m.wall) {
      svg.poly(m.wall.pts, { fill: 'none', stroke: pal.accent, strokeWidth: 9 * k, opacity: 0.22, strokeLinejoin: 'miter' });
      svg.poly(m.wall.pts, { fill: 'none', stroke: pal.accent, strokeWidth: 2.2 * k, strokeLinejoin: 'miter' });
      const cb = Bt();
      for (const g of m.wall.gates) cb.poly(G.rect(g.x, g.y, 14 * k, 14 * k, Math.atan2(m.U.y, m.U.x)));
      draw(cb, { fill: pal.paper, stroke: pal.accent, strokeWidth: 1.2 * k });
    }
    // Old town walls (present day).
    if (m.core && m.core.walls.length) {
      const wb = Bt(), bb = Bt();
      for (const l of m.core.walls) wb.poly(l, false);
      for (const b of m.core.bastions) bb.poly(b);
      draw(bb, { fill: pal.inkSoft, stroke: pal.ink, strokeWidth: 0.5 * k });
      draw(wb, { fill: 'none', stroke: pal.inkSoft, strokeWidth: 3.2 + 0.4 * k, strokeLinejoin: 'round' });
    }

    // Trees and wasteland scrub.
    const crowns = Bt(), scrub = Bt(), ruins = Bt();
    all('trees', (t2) => crowns.circle(t2.x, t2.y, t2.r));
    all('scrub', (s) => scrub.circle(s.x, s.y, s.r));
    all('ruins', (r2) => ruins.poly(r2));
    draw(scrub, { fill: pal.greenInk, opacity: 0.22 });
    draw(ruins, { fill: 'none', stroke: pal.inkSoft, strokeWidth: 0.8 * k, strokeDasharray: Svg.num(5 * k) + ' ' + Svg.num(3 * k) });
    draw(crowns, { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.35 * k });

    // Skyways (cyberpunk): elevated, with a shadow on the blocks below.
    if (m.sky.length) {
      const sw = STREETS.cyber.sky, sb = Bt();
      for (const s of m.sky) sb.poly(s, false);
      const crossings = [];
      for (let i = 0; i < m.sky.length; i++) {
        for (let j = i + 1; j < m.sky.length; j++) {
          const x = G.segmentIntersect(m.sky[i][0], m.sky[i][1], m.sky[j][0], m.sky[j][1]);
          if (x) crossings.push(x);
        }
      }
      for (const x of crossings) sb.circle(x.x, x.y, 70);
      const sd = sb.toString();
      svg.path(sd, { fill: 'none', stroke: '#000', strokeWidth: sw + 4 * k, opacity: 0.45, transform: 'translate(' + Svg.num(7 * k) + ' ' + Svg.num(10 * k) + ')' });
      svg.path(sd, { fill: 'none', stroke: pal.ink, strokeWidth: sw + 2.6 * k, opacity: 0.9 });
      svg.path(sd, { fill: 'none', stroke: pal.road, strokeWidth: sw });
      svg.path(sd, { fill: 'none', stroke: pal.accent, strokeWidth: 0.8 * k, strokeDasharray: Svg.num(14 * k) + ' ' + Svg.num(10 * k), opacity: 0.7 });
    }

    svg.close();

    // Lettering and furniture, in sheet coordinates.
    if (o.labels !== false && !o.preview) {
      const fs = S * 0.016;
      const sub = t('city.sub.' + (m.size || 'medium')) + (m.walls ? ' · ' + t('city.sub.walled') : '');
      const taken = [Draw.textBox(S / 2, S * 0.075, m.name, S * 0.048, { title: true }), Draw.textBox(S / 2, S * 0.075 + S * 0.048 * 0.85, sub, S * 0.048 * 0.42, { title: true })];
      const labels = m.landmarks.map((l) => {
        const lab = { x: l.x + M, y: l.y + M, text: t(l.key, l.params), size: fs, italic: true };
        // District names in spaced capitals (measured as title type, which is wider).
        if (l.district) Object.assign(lab, { text: lab.text.toUpperCase(), size: fs * 0.72, italic: false, title: true, spacing: fs * 0.05, color: cyber ? pal.accent : pal.inkSoft });
        if (l.road) Object.assign(lab, { size: fs * 0.75, italic: false, title: true });
        return lab;
      });
      // Landmarks first, then districts, then road numbers.
      const rank = (l) => (l.road ? 2 : l.size < fs ? 1 : 0);
      labels.sort((a, b) => rank(a) - rank(b));
      Draw.placeLabels(svg, labels, pal, taken, { x0: S * 0.04, y0: S * 0.04, x1: S * 0.96, y1: S * 0.9 });
    }
    const margin = S * 0.014;
    if (!o.preview) {
      Draw.frame(svg, S, S, pal, margin);
      if (o.labels !== false) {
        const sub = t('city.sub.' + (m.size || 'medium')) + (m.walls ? ' · ' + t('city.sub.walled') : '');
        Draw.title(svg, S / 2, S * 0.075, pal.titleCase === 'upper' ? m.name.toUpperCase() : m.name, S * 0.048, pal, sub);
      }
      Draw.compass(svg, S - S * 0.075, S - S * 0.085, S * 0.032, pal);
      const len = [50, 100, 200, 250, 500, 1000, 2000].filter((x) => x <= S * 0.2).pop();
      Draw.scaleBar(svg, S * 0.06, S - S * 0.07, len, len >= 1000 ? len / 1000 : len, len >= 1000 ? 'km' : 'm', pal);
    } else {
      Draw.label(svg, S / 2, S * 0.08, pal.titleCase === 'upper' ? m.name.toUpperCase() : m.name, S * 0.06, pal, { title: true, haloWidth: 0.35 });
    }
    return svg.toString();
  }

  Carto.register({
    id: 'city',
    order: 2,
    options: [
      { id: 'size', type: 'select', values: ['small', 'medium', 'large', 'huge'], def: 'medium' },
      { id: 'water', type: 'select', values: ['none', 'river', 'coast', 'both'], def: 'river' },
      // Walls are medieval: off by default in the present day and in cyberpunk
      // (`defs`: per-setting defaults, for an app that supports them).
      { id: 'walls', type: 'bool', def: true, defs: { modern: false, cyber: false } },
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
