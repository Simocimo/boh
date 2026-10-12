/* Realm generator: a regional map with coasts, mountains, forests, rivers that
   drain to the sea, settlements and the roads between them. Each settlement
   links to a full city map. */
(function (Carto) {
  'use strict';

  const G = Carto.G, Svg = Carto.Svg, Draw = Carto.Draw, t = Carto.t;
  const Contour = Carto.Contour;

  Carto.I18n.add({
    it: {
      'gen.realm.name': 'Regno',
      'gen.realm.desc': 'Mappe regionali con coste, montagne, foreste, fiumi e strade. Ogni città si apre in una mappa dettagliata.',
      'realm.opt.shape': 'Territorio',
      'realm.opt.shape.island': 'Isola',
      'realm.opt.shape.coast': 'Costa',
      'realm.opt.shape.archipelago': 'Arcipelago',
      'realm.opt.shape.continent': 'Entroterra',
      'realm.opt.density': 'Insediamenti',
      'realm.opt.density.few': 'Pochi',
      'realm.opt.density.normal': 'Normali',
      'realm.opt.density.many': 'Molti',
      'realm.opt.roads': 'Strade',
      'realm.opt.labels': 'Nomi',
      'realm.title.0': 'Regno di {n}',
      'realm.title.1': 'Ducato di {n}',
      'realm.title.2': 'Principato di {n}',
      'realm.title.3': 'Marca di {n}',
      'realm.title.4': 'Contea di {n}',
      'realm.sea.0': 'Mare di {n}',
      'realm.sea.1': 'Golfo di {n}',
      'realm.sea.2': 'Mare {n}',
      'realm.mountains': 'Monti {n}',
      'realm.forest': 'Bosco di {n}',
      'realm.capital': 'Capitale',
      'realm.town': 'Città',
      'realm.village': 'Villaggio',
      'realm.leagues': 'leghe',
      'realm.settlements': 'Insediamenti',
      'realm.open': 'Clicca un insediamento sulla mappa, o qui sotto, per aprirne la pianta.',
      'realm.forest.1': 'Bosco di {n}',
      'realm.road.main': 'Strada maestra',
      'realm.road.local': 'Sentiero',
      // Present day: administrative areas, motorways and kilometres.
      'realm.title.0@modern': 'Regione di {n}',
      'realm.title.1@modern': 'Provincia di {n}',
      'realm.title.2@modern': 'Contea di {n}',
      'realm.title.3@modern': 'Parco nazionale di {n}',
      'realm.title.4@modern': 'Area metropolitana di {n}',
      'realm.sea.1@modern': 'Golfo di {n}',
      'realm.sea.2@modern': 'Baia di {n}',
      'realm.forest@modern': 'Riserva naturale di {n}',
      'realm.forest.1@modern': 'Bosco di {n}',
      'realm.capital@modern': 'Capoluogo',
      'realm.town@modern': 'Città',
      'realm.village@modern': 'Paese',
      'realm.leagues@modern': 'km',
      'realm.road.main@modern': 'Autostrade e superstrade',
      'realm.road.local@modern': 'Strade provinciali',
      'realm.open@modern': 'Clicca un centro abitato sulla mappa, o qui sotto, per aprirne la pianta.',
      'realm.rail': 'Ferrovie',
      'realm.port': 'Aeroporto',
      'realm.port@cyber': 'Spazioporto',
      'realm.toxic': 'Zone tossiche',
      'realm.contours': 'Curve di livello ogni {n} m',
      // Cyberpunk: districts and corporate land, maglev lines, dead land.
      'realm.title.0@cyber': 'Distretto di {n}',
      'realm.title.1@cyber': 'Zona franca di {n}',
      'realm.title.2@cyber': 'Territorio {c}',
      'realm.title.3@cyber': 'Concessione {c}',
      'realm.title.4@cyber': 'Zona di esclusione di {n}',
      'realm.sea.1@cyber': 'Golfo di {n}',
      'realm.sea.2@cyber': 'Acque morte di {n}',
      'realm.mountains@cyber': 'Cresta di {n}',
      'realm.forest@cyber': 'Bosco morto di {n}',
      'realm.forest.1@cyber': 'Palude tossica di {n}',
      'realm.capital@cyber': 'Arcologia',
      'realm.town@cyber': 'Sprawl',
      'realm.village@cyber': 'Avamposto',
      'realm.leagues@cyber': 'km',
      'realm.road.main@cyber': 'Linee maglev',
      'realm.road.local@cyber': 'Superstrade',
      'realm.open@cyber': 'Clicca un nodo sulla mappa, o qui sotto, per aprirne la pianta.',
    },
    en: {
      'gen.realm.name': 'Realm',
      'gen.realm.desc': 'Regional maps with coasts, mountains, forests, rivers and roads. Every town opens as a detailed map.',
      'realm.opt.shape': 'Land',
      'realm.opt.shape.island': 'Island',
      'realm.opt.shape.coast': 'Coast',
      'realm.opt.shape.archipelago': 'Archipelago',
      'realm.opt.shape.continent': 'Inland',
      'realm.opt.density': 'Settlements',
      'realm.opt.density.few': 'Few',
      'realm.opt.density.normal': 'Normal',
      'realm.opt.density.many': 'Many',
      'realm.opt.roads': 'Roads',
      'realm.opt.labels': 'Names',
      'realm.title.0': 'Kingdom of {n}',
      'realm.title.1': 'Duchy of {n}',
      'realm.title.2': 'Principality of {n}',
      'realm.title.3': 'March of {n}',
      'realm.title.4': 'County of {n}',
      'realm.sea.0': 'Sea of {n}',
      'realm.sea.1': 'Bay of {n}',
      'realm.sea.2': '{n} Sea',
      'realm.mountains': '{n} Mountains',
      'realm.forest': '{n} Wood',
      'realm.capital': 'Capital',
      'realm.town': 'Town',
      'realm.village': 'Village',
      'realm.leagues': 'leagues',
      'realm.settlements': 'Settlements',
      'realm.open': 'Click a settlement on the map, or below, to open its plan.',
      'realm.forest.1': '{n} Wood',
      'realm.road.main': 'Main road',
      'realm.road.local': 'Track',
      'realm.title.0@modern': '{n} Region',
      'realm.title.1@modern': 'Province of {n}',
      'realm.title.2@modern': '{n} County',
      'realm.title.3@modern': '{n} National Park',
      'realm.title.4@modern': 'Greater {n}',
      'realm.sea.1@modern': 'Gulf of {n}',
      'realm.sea.2@modern': '{n} Bay',
      'realm.forest@modern': '{n} Nature Reserve',
      'realm.forest.1@modern': '{n} Woods',
      'realm.capital@modern': 'Capital',
      'realm.town@modern': 'City',
      'realm.village@modern': 'Town',
      'realm.leagues@modern': 'km',
      'realm.road.main@modern': 'Motorways and expressways',
      'realm.road.local@modern': 'Local roads',
      'realm.open@modern': 'Click a town on the map, or below, to open its plan.',
      'realm.rail': 'Railways',
      'realm.port': 'Airport',
      'realm.port@cyber': 'Spaceport',
      'realm.toxic': 'Toxic zones',
      'realm.contours': 'Contour lines every {n} m',
      'realm.title.0@cyber': '{n} District',
      'realm.title.1@cyber': '{n} Free Zone',
      'realm.title.2@cyber': '{c} Territory',
      'realm.title.3@cyber': '{c} Concession',
      'realm.title.4@cyber': '{n} Exclusion Zone',
      'realm.sea.1@cyber': 'Gulf of {n}',
      'realm.sea.2@cyber': '{n} Dead Waters',
      'realm.mountains@cyber': '{n} Ridge',
      'realm.forest@cyber': '{n} Deadwood',
      'realm.forest.1@cyber': '{n} Toxic Marsh',
      'realm.capital@cyber': 'Arcology',
      'realm.town@cyber': 'Sprawl',
      'realm.village@cyber': 'Outpost',
      'realm.leagues@cyber': 'km',
      'realm.road.main@cyber': 'Maglev lines',
      'realm.road.local@cyber': 'Highways',
      'realm.open@cyber': 'Click a node on the map, or below, to open its plan.',
    },
  });

  const W = 1000, H = 720, CELL = 5;
  const GW = W / CELL + 1, GH = H / CELL + 1, N = GW * GH;
  const NB = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];

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
      const top = v[0];
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
      return top;
    }
  }

  const px = (i) => (i % GW) * CELL;
  const py = (i) => Math.floor(i / GW) * CELL;
  const cellAt = (x, y) => Math.max(0, Math.min(GW - 1, Math.round(x / CELL))) + Math.max(0, Math.min(GH - 1, Math.round(y / CELL))) * GW;

  function components(mask, minSize) {
    const seen = new Uint8Array(N);
    const out = [];
    for (let i = 0; i < N; i++) {
      if (!mask[i] || seen[i]) continue;
      const comp = [];
      const stack = [i];
      seen[i] = 1;
      while (stack.length) {
        const c = stack.pop();
        comp.push(c);
        const x = c % GW, y = (c - x) / GW;
        for (let k = 0; k < 4; k++) {
          const nx = x + NB[k][0], ny = y + NB[k][1];
          if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
          const j = nx + ny * GW;
          if (mask[j] && !seen[j]) { seen[j] = 1; stack.push(j); }
        }
      }
      if (comp.length >= minSize) out.push(comp);
    }
    return out.sort((a, b) => b.length - a.length);
  }

  function generate(seed, opts) {
    const rng = new Carto.Random(seed);
    const shape = opts.shape || 'coast';
    const setting = Carto.Setting.current;
    const noise = new Carto.Noise(rng.fork('height'));
    const noise2 = new Carto.Noise(rng.fork('ridge'));
    const wet = new Carto.Noise(rng.fork('moisture'));

    // 1. Height field.
    const theta = rng.float(0, Math.PI * 2);
    const h = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const x = px(i), y = py(i);
      const u = (x / W) * 2 - 1, v = (y / H) * 2 - 1;
      const d = Math.sqrt(u * u + v * v * 0.85);
      const edge = Math.pow(Math.max(Math.abs(u), Math.abs(v)), 10);
      let mask;
      switch (shape) {
        case 'island': mask = 0.55 - 1.15 * d * d - edge * 2; break;
        case 'archipelago': mask = 0.25 - 0.55 * d * d - edge * 2; break;
        case 'continent': mask = 0.45 - 0.25 * d * d; break;
        default: mask = -0.75 * (u * Math.cos(theta) + v * Math.sin(theta)) + 0.15 - 0.2 * d * d;
      }
      const n = noise.fbm(x / 330, y / 330, 6, 2, 0.52);
      const r = noise2.ridged(x / 260, y / 260, 4) - 0.55;
      h[i] = mask + 0.62 * n + (shape === 'archipelago' ? 0.25 : 0.32) * r * Math.max(0, mask + 0.45);
    }
    const sorted = Float32Array.from(h).sort();
    const landFrac = { island: 0.36, coast: 0.56, archipelago: 0.27, continent: 0.8 }[shape] || 0.55;
    const sea = sorted[Math.floor(N * (1 - landFrac))];
    const hMax = sorted[N - 1];
    // Normalised elevation: 0..1 on land, negative at sea.
    const e = new Float32Array(N);
    for (let i = 0; i < N; i++) e[i] = h[i] >= sea ? (h[i] - sea) / (hMax - sea) : (h[i] - sea) / (sea - sorted[0]) * 0.5;
    const isLand = (i) => e[i] >= 0;

    // Drop tiny islets and fill tiny inland seas so the coast reads cleanly.
    {
      const landComps = components(Uint8Array.from(e, (v) => (v >= 0 ? 1 : 0)), 1);
      for (const c of landComps) if (c.length < 10) for (const i of c) e[i] = -0.01;
      const seaComps = components(Uint8Array.from(e, (v) => (v < 0 ? 1 : 0)), 1);
      for (const c of seaComps) {
        const touchesBorder = c.some((i) => { const x = i % GW, y = (i - x) / GW; return x === 0 || y === 0 || x === GW - 1 || y === GH - 1; });
        if (!touchesBorder && c.length < 60) for (const i of c) e[i] = 0.005;
      }
    }

    // 2. Drainage: priority flood from the sea and the map edge.
    const filled = Float32Array.from(e);
    const flow = new Int32Array(N).fill(-1);
    const visited = new Uint8Array(N);
    const heap = new Heap();
    for (let i = 0; i < N; i++) {
      const x = i % GW, y = (i - x) / GW;
      if (!isLand(i) || x === 0 || y === 0 || x === GW - 1 || y === GH - 1) {
        visited[i] = 1;
        heap.push(e[i], i);
      }
    }
    while (heap.size) {
      const c = heap.pop();
      const x = c % GW, y = (c - x) / GW;
      for (const [dx, dy] of NB) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
        const j = nx + ny * GW;
        if (visited[j]) continue;
        visited[j] = 1;
        filled[j] = Math.max(e[j], filled[c] + 1e-5);
        flow[j] = c;
        heap.push(filled[j], j);
      }
    }
    const order = Array.from({ length: N }, (_, i) => i).filter(isLand).sort((a, b) => filled[b] - filled[a]);
    const acc = new Float32Array(N);
    for (const i of order) {
      acc[i] += 0.6 + 0.8 * (wet.fbm(px(i) / 250, py(i) / 250, 3) + 1) / 2;
      if (flow[i] >= 0) acc[flow[i]] += acc[i];
    }
    // Lakes: deep depressions filled by the flood.
    const lakeMask = new Uint8Array(N);
    for (let i = 0; i < N; i++) if (isLand(i) && filled[i] - e[i] > 0.03) lakeMask[i] = 1;
    const lakes = components(lakeMask, 8).filter((c) => c.length < 160);
    lakeMask.fill(0);
    for (const c of lakes.slice(0, 4)) for (const i of c) lakeMask[i] = 1;

    // 3. Rivers.
    const landCells = order.length;
    const T = Math.max(55, landCells * 0.0065);
    const isRiver = (i) => isLand(i) && acc[i] >= T && !lakeMask[i];
    const hasRiverIn = new Uint8Array(N);
    for (const i of order) if (isRiver(i) && flow[i] >= 0) hasRiverIn[flow[i]] = 1;
    const used = new Uint8Array(N);
    const rivers = [];
    for (const i of order) {
      if (!isRiver(i) || hasRiverIn[i] || used[i]) continue;
      const pts = [];
      let c = i;
      while (c >= 0) {
        pts.push({ x: px(c), y: py(c), a: acc[c] });
        if (used[c] || !isLand(c) || lakeMask[c]) break;
        used[c] = 1;
        c = flow[c];
      }
      if (pts.length >= 4) rivers.push(pts);
    }
    const riverNear = new Uint8Array(N);
    for (let i = 0; i < N; i++) if (used[i]) riverNear[i] = 1;

    // 4. Relief and vegetation masks.
    const landE = order.map((i) => e[i]).sort((a, b) => a - b);
    const mThr = landE[Math.floor(landE.length * 0.86)] || 0.7;
    const hThr = landE[Math.floor(landE.length * 0.7)] || 0.5;
    const forestMask = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      if (!isLand(i) || lakeMask[i] || e[i] > mThr * 0.97) continue;
      const m = wet.fbm(px(i) / 170 + 50, py(i) / 170, 4);
      if (m > 0.12 + e[i] * 0.15) forestMask[i] = 1;
    }
    const mountainMask = Uint8Array.from(e, (v, i) => (v >= mThr && !lakeMask[i] ? 1 : 0));
    const cellOf = (x, y) => Math.max(0, Math.min(GW - 1, Math.round(x / CELL))) + Math.max(0, Math.min(GH - 1, Math.round(y / CELL))) * GW;

    // Sample the whole sheet, then keep what falls on the right terrain
    // (masked Bridson sampling would only grow inside one connected patch).
    const gr = rng.fork('glyphs');
    const mountains = G.poissonDisc(gr, 12, 16, W - 24, H - 24, 17)
      .filter((p) => mountainMask[cellOf(p.x, p.y)] === 1 && !riverNear[cellOf(p.x, p.y)])
      .map((p) => ({ x: p.x, y: p.y, s: 0.95 + Math.min(1, (e[cellOf(p.x, p.y)] - mThr) / (1 - mThr)) * 0.75 + gr.float(-0.1, 0.15) }));
    const hills = G.poissonDisc(gr, 12, 12, W - 24, H - 24, 19).filter((p) => {
      const i = cellOf(p.x, p.y);
      return e[i] >= hThr && e[i] < mThr && !forestMask[i] && !riverNear[i] && !lakeMask[i] && gr.bool(0.8);
    });
    const trees = G.poissonDisc(gr, 6, 6, W - 12, H - 12, 6.4).filter((p) => {
      const i = cellOf(p.x, p.y);
      return forestMask[i] === 1 && !riverNear[i] && !lakeMask[i];
    }).map((p) => ({ x: p.x, y: p.y, r: gr.float(2.7, 3.7) }));

    // 5. Settlements.
    const sr = rng.fork('settlements');
    const seaDist = Contour.distanceField(Uint8Array.from(e, (v) => (v < 0 ? 1 : 0)), GW, GH);
    const riverDist = Contour.distanceField(riverNear, GW, GH);
    const cand = [];
    for (let i = 0; i < N; i++) {
      const x = i % GW, y = (i - x) / GW;
      if (!isLand(i) || lakeMask[i] || e[i] > hThr || x < 6 || y < 6 || x > GW - 7 || y > GH - 7) continue;
      if (riverNear[i]) continue;
      let sc = 1 - e[i] * 1.2 + sr.next() * 0.6;
      if (seaDist[i] <= 2.5) sc += 1.1;
      if (riverDist[i] <= 2.5) sc += 1.3;
      if (forestMask[i]) sc -= 0.4;
      cand.push([sc, i]);
    }
    cand.sort((a, b) => b[0] - a[0]);
    const density = { few: [1, 2, 4], normal: [1, 4, 8], many: [1, 6, 14] }[opts.density] || [1, 4, 8];
    const tiers = [['capital', density[0], 150], ['town', density[1], 95], ['village', density[2], 55]];
    const settlements = [];
    const names = Carto.Names.unique(rng.fork('names'), 40);
    let ni = 0;
    for (const [type, count, spacing] of tiers) {
      let placed = 0;
      for (const [, i] of cand) {
        if (placed >= count) break;
        const p = { x: px(i), y: py(i) };
        if (settlements.some((s) => G.dist(s, p) < spacing * (s.type === 'village' && type === 'village' ? 1 : 0.9))) continue;
        settlements.push({
          type, x: p.x, y: p.y, name: names[ni++] || 'Nemo',
          coast: seaDist[i] <= 2.5, river: riverDist[i] <= 2.5,
          seed: Carto.hashString(seed + ':' + type + ':' + ni) % 1000000000,
        });
        placed++;
      }
    }

    // 6. Roads: a spanning tree plus a few shortcuts, routed over the terrain.
    const roads = [];
    // Present day and cyberpunk: which stretches belong to the main network
    // (motorways, maglev lines) between the larger centres.
    const roadMain = [];
    if (opts.roads && settlements.length > 1) {
      const pairs = [];
      const inTree = [0];
      const rest = settlements.map((_, i) => i).slice(1);
      while (rest.length) {
        let best = null;
        for (const a of inTree) for (const b of rest) {
          const d = G.dist(settlements[a], settlements[b]);
          if (!best || d < best[2]) best = [a, b, d];
        }
        pairs.push(best);
        inTree.push(best[1]);
        rest.splice(rest.indexOf(best[1]), 1);
      }
      for (let a = 0; a < settlements.length; a++) {
        for (let b = a + 1; b < settlements.length; b++) {
          const d = G.dist(settlements[a], settlements[b]);
          if (d < 190 && !pairs.some((p) => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a)) && sr.bool(0.25)) pairs.push([a, b, d]);
        }
      }
      // Present day and cyberpunk: the larger centres are all joined by the
      // main network (motorways, maglev lines), not only through villages.
      if (setting !== 'fantasy') {
        const big = settlements.map((_, i) => i).filter((i) => settlements[i].type !== 'village');
        const tree = big.slice(0, 1), left = big.slice(1);
        while (left.length) {
          let best = null;
          for (const a of tree) for (const b of left) {
            const d = G.dist(settlements[a], settlements[b]);
            if (!best || d < best[2]) best = [a, b, d];
          }
          if (!pairs.some((p) => (p[0] === best[0] && p[1] === best[1]) || (p[0] === best[1] && p[1] === best[0]))) pairs.push(best);
          tree.push(best[1]);
          left.splice(left.indexOf(best[1]), 1);
        }
      }
      const roadCell = new Uint8Array(N);
      const isMain =(p) => settlements[p[0]].type !== 'village' && settlements[p[1]].type !== 'village';
      // The main network is routed first, so the minor roads join it.
      if (setting !== 'fantasy') pairs.sort((p, q) => isMain(q) - isMain(p));
      else pairs.sort((p, q) => (settlements[p[0]].type === 'capital' || settlements[p[1]].type === 'capital' ? -1 : 0) - (settlements[q[0]].type === 'capital' || settlements[q[1]].type === 'capital' ? -1 : 0));
      for (const pair of pairs) {
        const [a, b] = pair;
        const path = route(cellOf(settlements[a].x, settlements[a].y), cellOf(settlements[b].x, settlements[b].y));
        if (!path) continue;
        const addRoad = (cells) => {
          roads.push(cells.map((i) => ({ x: px(i), y: py(i) })));
          if (setting !== 'fantasy') roadMain.push(isMain(pair));
        };
        // Skip the parts that already follow a road.
        let seg = [];
        for (const c of path) {
          if (roadCell[c] && seg.length) { seg.push(c); if (seg.length > 2) addRoad(seg); seg = []; continue; }
          if (!roadCell[c]) seg.push(c);
        }
        if (seg.length > 1) addRoad(seg);
        for (const c of path) roadCell[c] = 1;
      }
      function route(from, to) {
        const dist = new Float64Array(N).fill(Infinity);
        const prev = new Int32Array(N).fill(-1);
        const q = new Heap();
        dist[from] = 0;
        const tx = to % GW, ty = (to - tx) / GW;
        q.push(0, from);
        while (q.size) {
          const c = q.pop();
          if (c === to) break;
          const x = c % GW, y = (c - x) / GW;
          for (const [dx, dy] of NB) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
            const j = nx + ny * GW;
            if (!isLand(j) || lakeMask[j]) continue;
            const step = (dx && dy ? 1.414 : 1) * (1 + 40 * Math.abs(e[j] - e[c]) + (e[j] > mThr ? 8 : 0) + (riverNear[j] ? 3 : 0) + (forestMask[j] ? 0.5 : 0)) * (roadCell[j] ? 0.35 : 1);
            const nd = dist[c] + step;
            if (nd < dist[j]) {
              dist[j] = nd;
              prev[j] = c;
              q.push(nd + Math.hypot(nx - tx, ny - ty) * 0.35, j);
            }
          }
        }
        if (prev[to] < 0) return null;
        const path = [to];
        let c = to;
        while (c !== from) { c = prev[c]; path.unshift(c); }
        return path;
      }
    }

    // 7. Outlines for drawing.
    const landField = Float32Array.from(e);
    const coast = Contour.trace(landField, GW, GH, 0, CELL, 0, 0).filter((l) => l.points.length > 3);
    const lakeField = Contour.blur(Float32Array.from(lakeMask), GW, GH, 1, 1);
    const lakeLines = Contour.trace(lakeField, GW, GH, 0.5, CELL, 0, 0).filter((l) => l.closed && l.points.length > 4);
    const landMask = Uint8Array.from(e, (v) => (v >= 0 ? 1 : 0));
    const fromLand = Contour.distanceField(landMask, GW, GH);
    const ripples = [1.4, 3, 5].map((d) => Contour.trace(Float32Array.from(fromLand, (v) => -v), GW, GH, -d, CELL, 0, 0).filter((l) => l.points.length > 6));
    const forestField = Contour.blur(Float32Array.from(forestMask), GW, GH, 1, 2);
    const forests = Contour.trace(forestField, GW, GH, 0.45, CELL, 0, 0).filter((l) => l.points.length > 6);

    // 8. Names for seas, ranges and woods.
    const nr = rng.fork('features');
    const features = [];
    // Candidate spots for the sea name: open water, far from land, spread apart.
    const seaSpots = [];
    for (let i = 0; i < N; i++) {
      const x = i % GW, y = (i - x) / GW;
      if (isLand(i) || x < 24 || y < 12 || x > GW - 25 || y > GH - 12 || fromLand[i] < 5) continue;
      seaSpots.push([fromLand[i], i]);
    }
    seaSpots.sort((a, b) => b[0] - a[0]);
    const spots = [];
    for (const [, i] of seaSpots) {
      const p = { x: px(i), y: py(i) };
      if (spots.every((q) => G.dist(q, p) > 120)) spots.push(p);
      if (spots.length >= 6) break;
    }
    if (spots.length) features.push({ kind: 'sea', v: nr.int(0, 2), spots, x: spots[0].x, y: spots[0].y, name: Carto.Names.place(nr) });
    const ranges = components(mountainMask, 25);
    if (ranges.length) {
      const c = G.average(ranges[0].map((i) => ({ x: px(i), y: py(i) })));
      const maxY = Math.max(...ranges[0].map((i) => py(i)));
      features.push({ kind: 'mountains', x: c.x, y: Math.min(H - 30, maxY + 16), name: Carto.Names.place(nr) });
    }
    const woods = components(forestMask, 60);
    if (woods.length) {
      const c = G.average(woods[0].map((i) => ({ x: px(i), y: py(i) })));
      features.push({ kind: 'forest', x: c.x, y: c.y, name: Carto.Names.place(nr) });
    }

    const model = {
      seed, shape,
      name: opts.name || Carto.Names.place(rng.fork('realm')),
      kind: rng.fork('kind').int(0, 4),
      coast, lakes: lakeLines, ripples, forests, rivers, roads, mountains, hills, trees, settlements, features,
      T, elev: e,
    };
    if (setting !== 'fantasy') {
      // A separate stream, so the shared parts above stay as in fantasy.
      const xr = rng.fork('setting');
      model.roadMain = roadMain;
      // The corporation that owns the land (cyberpunk titles) and the kind
      // of wood: reserve or plain wood today, dead wood or toxic marsh later.
      if (setting === 'cyber') model.corp = Carto.Names.corp(xr);
      const wood = features.find((f) => f.kind === 'forest');
      if (wood) wood.v = xr.int(0, 1);
      // Height of the highest summit, for contour lines and spot heights.
      model.topM = Math.round(xr.float(1700, 3300) / 10) * 10;
      // Railways between the larger centres (present day), and the airport
      // or spaceport outside the capital: both follow the terrain, no dice.
      const roadNear = new Uint8Array(N);
      for (const r of roads) for (const p of r) for (const [dx, dy] of [[0, 0]].concat(NB)) roadNear[cellOf(p.x + dx * CELL, p.y + dy * CELL)] = 1;
      model.rails = setting === 'modern' && opts.roads ? railways(settlements.filter((s) => s.type !== 'village'), roadNear) : [];
      model.port = portSite(roadNear);
    }
    return model;

    // A spanning tree of rail lines, routed where the ground is flattest.
    function railways(big, roadNear) {
      if (big.length < 2) return [];
      const pairs = [];
      const inTree = [0], rest = big.map((_, i) => i).slice(1);
      while (rest.length) {
        let best = null;
        for (const a of inTree) for (const b of rest) {
          const d = G.dist(big[a], big[b]);
          if (!best || d < best[2]) best = [a, b, d];
        }
        pairs.push(best);
        inTree.push(best[1]);
        rest.splice(rest.indexOf(best[1]), 1);
      }
      const railCell = new Uint8Array(N);
      const lines = [];
      for (const [a, b] of pairs) {
        const from = cellOf(big[a].x, big[a].y), to = cellOf(big[b].x, big[b].y);
        const path = railRoute(from, to, railCell, roadNear);
        if (!path) continue;
        let seg = [];
        for (const c of path) {
          if (railCell[c] && seg.length) { seg.push(c); if (seg.length > 2) lines.push(seg.map((i) => ({ x: px(i), y: py(i) }))); seg = []; continue; }
          if (!railCell[c]) seg.push(c);
        }
        if (seg.length > 1) lines.push(seg.map((i) => ({ x: px(i), y: py(i) })));
        for (const c of path) railCell[c] = 1;
      }
      return lines;
    }
    function railRoute(from, to, railCell, roadNear) {
      const dist = new Float64Array(N).fill(Infinity);
      const prev = new Int32Array(N).fill(-1);
      const q = new Heap();
      dist[from] = 0;
      const tx = to % GW, ty = (to - tx) / GW;
      q.push(0, from);
      while (q.size) {
        const c = q.pop();
        if (c === to) break;
        const x = c % GW, y = (c - x) / GW;
        for (const [dx, dy] of NB) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
          const j = nx + ny * GW;
          if (!isLand(j) || lakeMask[j]) continue;
          // Trains climb badly: gradients cost much more than for roads.
          const step = (dx && dy ? 1.414 : 1) * (1 + 110 * Math.abs(e[j] - e[c]) + (e[j] > hThr ? 6 : 0) + (e[j] > mThr ? 20 : 0) +
            (riverNear[j] ? 2 : 0) + (roadNear[j] && j !== to ? 1.5 : 0)) * (railCell[j] ? 0.3 : 1);
          const nd = dist[c] + step;
          if (nd < dist[j]) {
            dist[j] = nd;
            prev[j] = c;
            q.push(nd + Math.hypot(nx - tx, ny - ty) * 0.35, j);
          }
        }
      }
      if (prev[to] < 0) return null;
      const path = [to];
      let c = to;
      while (c !== from) { c = prev[c]; path.unshift(c); }
      return path;
    }
    // Flat, open ground a short drive from the capital.
    function portSite(roadNear) {
      const cap = settlements[0];
      if (!cap) return null;
      let best = null, bs = Infinity;
      for (let i = 0; i < N; i++) {
        const x = i % GW, y = (i - x) / GW;
        if (x < 10 || y < 10 || x > GW - 11 || y > GH - 11) continue;
        const d = Math.hypot(px(i) - cap.x, py(i) - cap.y);
        if (d < 26 || d > 50 || !isLand(i) || lakeMask[i] || riverNear[i] || seaDist[i] < 3 || e[i] > hThr) continue;
        if (settlements.some((s) => G.dist(s, { x: px(i), y: py(i) }) < 24)) continue;
        let slope = 0;
        for (const [dx, dy] of NB) slope = Math.max(slope, Math.abs(e[i] - e[i + dx + dy * GW]));
        const sc = slope * 300 + forestMask[i] * 0.6 + roadNear[i] * 2 + (riverDist[i] < 4 ? 1 : 0) + Math.abs(d - 34) * 0.02;
        if (sc < bs) { bs = sc; best = { x: px(i), y: py(i), a: (Carto.hashString(seed + ':runway') % 4) * 45 - 45 }; }
      }
      return best;
    }
  }

  // ------------------------------------------------------------- glyphs

  function mountainGlyph(m, line, shade, fill, rng) {
    const s = m.s, w = 22 * s, hgt = 17 * s;
    const x = m.x, y = m.y;
    const lean = rng.float(-0.12, 0.12) * w;
    const peak = { x: x + lean, y: y - hgt };
    const left = { x: x - w / 2, y }, right = { x: x + w / 2, y };
    // Slightly concave slopes with a shoulder on one side.
    const l1 = G.lerp(left, peak, 0.45), r1 = G.lerp(right, peak, 0.5);
    l1.y += hgt * 0.06; r1.y += hgt * 0.04;
    const shoulder = { x: x + lean + w * 0.18, y: y - hgt * 0.62 };
    const body = [left, l1, peak, shoulder, r1, right];
    fill.poly(body.concat([{ x: right.x, y: y + 1 }, { x: left.x, y: y + 1 }]));
    // Shaded flank: from the peak down to a point right of centre.
    const foot = { x: x + lean * 0.4 + w * 0.06, y };
    shade.poly([peak, shoulder, r1, right, foot]);
    line.poly(body, false);
    line.add('M' + Svg.num(peak.x) + ' ' + Svg.num(peak.y) + 'Q' + Svg.num(peak.x + w * 0.02) + ' ' + Svg.num(y - hgt * 0.4) + ' ' + Svg.num(foot.x) + ' ' + Svg.num(y - hgt * 0.08));
    // Hatching on the shaded flank.
    for (let k = 1; k <= 3; k++) {
      const a = G.lerp(peak, right, 0.25 + k * 0.17), b = G.lerp(foot, right, 0.12 + k * 0.2);
      line.line(G.lerp(a, b, 0.15), G.lerp(a, b, 0.75));
    }
  }

  function hillGlyph(p, line, fill) {
    const w = 14, hgt = 6.5;
    const d = 'M' + Svg.num(p.x - w / 2) + ' ' + Svg.num(p.y) + 'C' + Svg.num(p.x - w / 4) + ' ' + Svg.num(p.y - hgt) + ' ' +
      Svg.num(p.x + w / 4) + ' ' + Svg.num(p.y - hgt) + ' ' + Svg.num(p.x + w / 2) + ' ' + Svg.num(p.y);
    fill.add(d + 'Z');
    line.add(d);
    line.line({ x: p.x + 2, y: p.y - 2.6 }, { x: p.x + 4.2, y: p.y - 0.6 });
    line.line({ x: p.x + 4.4, y: p.y - 2.4 }, { x: p.x + 5.8, y: p.y - 0.8 });
  }

  function house(b, x, y, s) {
    b.poly([{ x: x - 2.4 * s, y: y + 2 * s }, { x: x - 2.4 * s, y: y - 1.2 * s }, { x, y: y - 3.6 * s }, { x: x + 2.4 * s, y: y - 1.2 * s }, { x: x + 2.4 * s, y: y + 2 * s }]);
  }

  function castle(b, x, y) {
    const s = 1.25;
    const pts = [];
    const L = -7 * s, R = 7 * s, top = -6 * s, bottom = 3.5 * s;
    pts.push({ x: x + L, y: y + bottom }, { x: x + L, y: y + top - 3 * s });
    // crenellated left tower, keep, right tower
    const cren = (x0, x1, yy) => {
      const n = 3, wd = (x1 - x0) / (2 * n - 1);
      for (let i = 0; i < 2 * n - 1; i++) {
        const xa = x0 + i * wd, xb = xa + wd;
        if (i % 2 === 0) { pts.push({ x: x + xa, y: y + yy - 1.4 * s }, { x: x + xb, y: y + yy - 1.4 * s }); }
        else { pts.push({ x: x + xa, y: y + yy }, { x: x + xb, y: y + yy }); }
      }
    };
    cren(L, L + 3.4 * s, top - 3 * s);
    pts.push({ x: x + L + 3.4 * s, y: y + top });
    cren(L + 3.4 * s, R - 3.4 * s, top);
    pts.push({ x: x + R - 3.4 * s, y: y + top - 3 * s });
    cren(R - 3.4 * s, R, top - 3 * s);
    pts.push({ x: x + R, y: y + bottom });
    b.poly(pts);
  }

  // Present day: a road-map dot per centre (square for the capital).
  // Cyberpunk: a glowing tower for the arcology, blocks for the sprawl.
  function modernIcon(b, dark, s) {
    if (s.type === 'capital') { b.poly(G.rect(s.x, s.y, 9, 9, 0)); dark.poly(G.rect(s.x, s.y, 3.6, 3.6, 0)); }
    else if (s.type === 'town') { b.circle(s.x, s.y, 4.2); dark.circle(s.x, s.y, 1.7); }
    else dark.circle(s.x, s.y, 2.6);
  }

  function cyberIcon(b, glow, s) {
    if (s.type === 'capital') {
      glow.circle(s.x, s.y - 4, 9);
      b.poly([{ x: s.x - 4.5, y: s.y + 4 }, { x: s.x - 2, y: s.y - 13 }, { x: s.x, y: s.y - 16 }, { x: s.x + 2, y: s.y - 13 }, { x: s.x + 4.5, y: s.y + 4 }]);
    } else if (s.type === 'town') {
      glow.circle(s.x, s.y, 6);
      b.poly(G.rect(s.x - 3.2, s.y - 1, 3.6, 8, 0));
      b.poly(G.rect(s.x + 0.6, s.y - 2.5, 3.6, 11, 0));
      b.poly(G.rect(s.x + 3.8, s.y + 0.5, 3, 6, 0));
    } else b.poly([{ x: s.x, y: s.y - 3.6 }, { x: s.x + 3.2, y: s.y }, { x: s.x, y: s.y + 3.6 }, { x: s.x - 3.2, y: s.y }]);
  }

  // ------------------------------------------------------------- present-day relief

  /* Present-day and cyberpunk sheets draw the land like a modern atlas:
     hypsometric tints, a soft hillshade lit from the north-west and contour
     lines. Shared with the world map (Carto.Terrain). Every function works
     on a scalar grid sampled at (x*cell + ox, y*cell + oy). */
  const rgb = (h) => { const v = parseInt(h.slice(1, 7), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
  const mix = (a, b, k) => { const p = rgb(a), q = rgb(b); return '#' + p.map((c, i) => Math.round(c + (q[i] - c) * k).toString(16).padStart(2, '0')).join(''); };
  const luma = (h) => { const [r, g, b] = rgb(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  // Lowland green to bare rock and snow, by share of the highest summit.
  const HYPSO = [[0, '#a9cd8e'], [0.1, '#c4dc9c'], [0.22, '#e2e4ab'], [0.36, '#eedaa4'], [0.5, '#e2bf8f'], [0.64, '#cda07c'], [0.78, '#b48f7a'], [0.9, '#bdb2aa'], [1, '#f4f3f0']];
  function stops(list, v) {
    if (v <= list[0][0]) return list[0][1];
    for (let i = 1; i < list.length; i++) if (v <= list[i][0]) return mix(list[i - 1][1], list[i][1], (v - list[i - 1][0]) / (list[i][0] - list[i - 1][0]));
    return list[list.length - 1][1];
  }
  // Colour of land at a relative height 0..1 on this palette.
  function hypso(pal, setting) {
    if (setting === 'cyber') return (v) => mix(pal.paper, pal.ink, 0.02 + v * 0.13);
    if (luma(pal.paper) > 0.5) return (v) => mix(stops(HYPSO, v), pal.paper, 0.12);
    return (v) => mix(pal.paper, stops(HYPSO, v), 0.2 + v * 0.1);
  }

  // Rounded polylines: lighter than Bezier curves for the many relief rings.
  const smoothRings = (lines, it = 1) => {
    const b = new Svg.Batch();
    for (const l of lines) if (l.points.length > 2) b.poly(G.chaikin(l.points, it, l.closed), l.closed);
    return b.toString();
  };

  // Nested fills, one per band, so the top band shows.
  function tints(svg, f, w, h, cell, ox, oy, colour, bands) {
    for (let k = 0; k < bands; k++) {
      const lv = k / bands;
      const d = smoothRings(Contour.trace(f, w, h, lv, cell, ox, oy));
      svg.path(d, { fill: colour(lv + 0.5 / bands), fillRule: 'evenodd' });
    }
  }

  // Shading of a slope lit from the north-west, minus that of flat ground.
  function shadeField(f, w, h, cell, z) {
    const L = [-1, -1, 1.25], ll = Math.hypot(...L);
    const flat = L[2] / ll;
    const sh = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      const y0 = Math.max(0, y - 1), y1 = Math.min(h - 1, y + 1);
      for (let x = 0; x < w; x++) {
        const x0 = Math.max(0, x - 1), x1 = Math.min(w - 1, x + 1);
        const gx = ((f[x1 + y * w] - f[x0 + y * w]) / ((x1 - x0) * cell)) * z;
        const gy = ((f[x + y1 * w] - f[x + y0 * w]) / ((y1 - y0) * cell)) * z;
        sh[x + y * w] = (-gx * L[0] - gy * L[1] + L[2]) / ll / Math.hypot(gx, gy, 1) - flat;
      }
    }
    return Contour.blur(sh, w, h, 1, 1);
  }

  // Soft hillshade: a few stacked translucent layers, blurred together.
  function hillshade(svg, f, w, h, cell, ox, oy, o) {
    const sh = shadeField(f, w, h, cell, o.z);
    const blur = Carto.uid('shade');
    svg.defs('<filter id="' + blur + '"><feGaussianBlur stdDeviation="' + (o.blur || 1.4) + '"/></filter>');
    svg.open({ filter: 'url(#' + blur + ')' });
    const neg = Float32Array.from(sh, (v) => -v);
    for (const lv of [0.03, 0.09, 0.17, 0.28]) svg.path(smoothRings(Contour.trace(neg, w, h, lv, cell, ox, oy)), { fill: o.dark, opacity: o.opacity, fillRule: 'evenodd' });
    if (o.light) for (const lv of [0.04, 0.1]) svg.path(smoothRings(Contour.trace(sh, w, h, lv, cell, ox, oy)), { fill: o.light, opacity: o.opacity * 0.9, fillRule: 'evenodd' });
    svg.close();
  }

  // Contour lines at the given levels: [{ level, d }].
  function contours(f, w, h, cell, ox, oy, levels) {
    return levels.map((level) => ({ level, d: smoothRings(Contour.trace(f, w, h, level, cell, ox, oy).filter((l) => l.points.length > 4)) }));
  }

  // Faint hexagonal overlay of the cyberpunk sheets.
  function hexGrid(w, h, s) {
    const b = new Svg.Batch();
    const dy = Math.sqrt(3) * s;
    for (let c = 0, x = 0; x < w + s; c++, x += 1.5 * s) {
      for (let y = c % 2 ? dy / 2 : 0; y < h + dy; y += dy) {
        // Three edges per cell: the others belong to the neighbours.
        b.poly([{ x: x - s, y }, { x: x - s / 2, y: y - dy / 2 }, { x: x + s / 2, y: y - dy / 2 }, { x: x + s, y }], false);
        b.line({ x: x - s, y }, { x: x - s / 2, y: y + dy / 2 });
      }
    }
    return b.toString();
  }

  // Glow behind neon strokes and blobs.
  function glowFilter(svg, sd) {
    const id = Carto.uid('glow');
    svg.defs('<filter id="' + id + '" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="' + sd + '"/></filter>');
    return 'url(#' + id + ')';
  }

  // Built-up area around a centre: a ragged core and a few suburbs.
  function urbanBlob(b, rng, x, y, r) {
    b.smooth(Draw.blob(rng, x, y, r, 11, 0.45), true);
    const lobes = r > 9 ? rng.int(2, 4) : r > 6 ? rng.int(1, 2) : 0;
    for (let k = 0; k < lobes; k++) {
      const a = rng.float(0, Math.PI * 2), d = r * rng.float(0.65, 1);
      b.smooth(Draw.blob(rng, x + Math.cos(a) * d, y + Math.sin(a) * d, r * rng.float(0.35, 0.55), 8, 0.4), true);
    }
  }

  // Hatched fill pattern (toxic zones, dead land).
  function hatchPattern(svg, colour, gap, width, angle) {
    const id = Carto.uid('hatch');
    svg.defs('<pattern id="' + id + '" width="' + gap + '" height="' + gap + '" patternUnits="userSpaceOnUse" patternTransform="rotate(' + angle + ')">' +
      '<path d="M0 0V' + gap + '" stroke="' + colour + '" stroke-width="' + width + '"/></pattern>');
    return 'url(#' + id + ')';
  }

  Carto.Terrain = { mix, luma, hypso, tints, shadeField, hillshade, contours, hexGrid, glowFilter, urbanBlob, hatchPattern, smoothRings };

  // Contour interval in metres: sparser in the busier neon style.
  const contourStep = (top, cyber) => (cyber ? (top > 2400 ? 250 : 200) : top > 2400 ? 200 : 100);

  // Airport (today) or spaceport (cyberpunk) beside the capital.
  function portGlyph(svg, p, pal, cyber) {
    const a = p.a * Math.PI / 180, dir = { x: Math.cos(a), y: Math.sin(a) };
    const end = (k) => ({ x: p.x + dir.x * k, y: p.y + dir.y * k });
    if (cyber) {
      const glow = glowFilter(svg, 2.5);
      svg.circle(p.x, p.y, 8, { fill: pal.ink, opacity: 0.35, filter: glow });
      svg.circle(p.x, p.y, 6.5, { fill: pal.paper, stroke: pal.ink, strokeWidth: 1.1 });
      svg.circle(p.x, p.y, 3.6, { fill: 'none', stroke: pal.ink, strokeWidth: 0.7, strokeDasharray: '1.5 1.2' });
      svg.path(Svg.line({ x: p.x - 2, y: p.y - 2 }, { x: p.x + 2, y: p.y + 2 }) + Svg.line({ x: p.x + 2, y: p.y - 2 }, { x: p.x - 2, y: p.y + 2 }), { stroke: pal.accent, strokeWidth: 1 });
      return;
    }
    // Two crossing runways and the aeroplane sign.
    svg.path(Svg.line(end(-9), end(9)) + Svg.line({ x: p.x - dir.y * 6 - dir.x * 4, y: p.y + dir.x * 6 - dir.y * 4 }, { x: p.x + dir.y * 6 + dir.x * 3, y: p.y - dir.x * 6 + dir.y * 3 }),
      { stroke: pal.inkSoft, strokeWidth: 2.2, strokeLinecap: 'butt' });
    svg.circle(p.x, p.y, 5.6, { fill: pal.paper, stroke: pal.ink, strokeWidth: 0.9 });
    const P = (dx, dy) => ({ x: p.x + dx, y: p.y + dy });
    svg.path('M' + Svg.num(p.x) + ' ' + Svg.num(p.y - 4) + 'L' + Svg.num(p.x) + ' ' + Svg.num(p.y + 3.4) + Svg.d([P(-3.8, 0.6), P(0, -1.6), P(3.8, 0.6)], false) +
      Svg.line(P(-1.6, 3.4), P(1.6, 3.4)), { fill: 'none', stroke: pal.ink, strokeWidth: 1.1, strokeLinecap: 'round', strokeLinejoin: 'round' });
  }

  /* The land, water and networks of a present-day or cyberpunk sheet.
     Returns the boxes it occupies, for the lettering. */
  function renderPresent(svg, m, o, pal, setting) {
    const cyber = setting === 'cyber';
    const dark = luma(pal.paper) < 0.5;
    const taken = [];

    // Sea: deeper away from the shore, or dark with faint ripples.
    if (cyber) {
      svg.rect(0, 0, W, H, { fill: pal.water });
      [0.16, 0.1, 0.06].forEach((op, k) => svg.path(smoothRings(m.ripples[k].map((l) => ({ points: l.points, closed: l.closed }))), { fill: 'none', stroke: pal.ink, strokeWidth: 0.6, opacity: op }));
    } else {
      svg.rect(0, 0, W, H, { fill: mix(pal.water, pal.waterInk, 0.22) });
      [[2, 0.12], [1, 0.06], [0, 0]].forEach(([k, s]) => svg.path(smoothRings(m.ripples[k]), { fill: mix(pal.water, pal.waterInk, s), fillRule: 'evenodd' }));
    }

    // Land.
    const ld = smoothRings(m.coast);
    const landClip = Carto.uid('land');
    svg.defs('<clipPath id="' + landClip + '"><path d="' + ld + '" clip-rule="evenodd"/></clipPath>');
    const colour = hypso(pal, setting);
    svg.path(ld, { fill: colour(0), fillRule: 'evenodd' });
    svg.open({ clipPath: 'url(#' + landClip + ')' });
    const f = Float32Array.from(m.elev, (v) => Math.max(0, v));
    tints(svg, f, GW, GH, CELL, 0, 0, colour, cyber ? 8 : 18);

    // Woods: flat green today, hatched toxic land in the cyberpunk future.
    const fd = smoothRings(m.forests);
    if (cyber) {
      const tox = dark ? '#b6f23a' : pal.greenInk;
      svg.path(fd, { fill: tox, opacity: 0.07, fillRule: 'evenodd' });
      svg.path(fd, { fill: hatchPattern(svg, tox, 5, 0.8, 45), opacity: 0.4, fillRule: 'evenodd' });
      svg.path(fd, { fill: 'none', stroke: tox, strokeWidth: 0.8, strokeDasharray: '4 2.5', opacity: 0.55 });
    } else svg.path(fd, { fill: dark ? pal.green : mix(pal.tree, '#6f9f55', 0.25), opacity: dark ? 0.6 : 0.55, fillRule: 'evenodd' });

    hillshade(svg, f, GW, GH, CELL, 0, 0, cyber ? { z: 70, dark: '#000000', opacity: dark ? 0.22 : 0.08 } : { z: 70, dark: dark ? '#000000' : '#3d3a52', light: dark ? null : '#ffffff', opacity: dark ? 0.2 : 0.13 });

    // Contour lines every 100 or 200 m, thicker every 500 or 1000 m.
    const top = m.topM || 2400;
    const step = contourStep(top, cyber), index = cyber ? 1000 : step * 5;
    const levels = [];
    for (let z = step; z < top; z += step) levels.push(z);
    const lines = contours(f, GW, GH, CELL, 0, 0, levels.map((z) => z / top));
    if (cyber) {
      // Neon isolines, brighter the higher they run, over a soft glow.
      const glow = glowFilter(svg, 1.6);
      const high = lines.filter((l) => l.level > 0.35).map((l) => l.d).join('');
      svg.path(high, { fill: 'none', stroke: pal.ink, strokeWidth: 2, opacity: 0.3, filter: glow });
      lines.forEach((l, k) => svg.path(l.d, { fill: 'none', stroke: pal.ink, strokeWidth: levels[k] % index ? 0.5 : 0.9, opacity: Math.min(1, 0.1 + 0.9 * Math.pow(l.level, 1.4)) }));
    } else {
      const ink = dark ? pal.inkSoft : '#9a7a58';
      svg.path(lines.filter((_, k) => levels[k] % index).map((l) => l.d).join(''), { fill: 'none', stroke: ink, strokeWidth: 0.45, opacity: 0.55 });
      svg.path(lines.filter((_, k) => !(levels[k] % index)).map((l) => l.d).join(''), { fill: 'none', stroke: ink, strokeWidth: 0.85, opacity: 0.7 });
    }

    // Built-up areas, sized by the centre's rank.
    const ub = new Svg.Batch(), core = new Svg.Batch();
    for (const s of m.settlements) {
      const r = (s.type === 'capital' ? 17 : s.type === 'town' ? 10.5 : 5.5) * (cyber ? 1.2 : 1);
      urbanBlob(s.type === 'village' ? ub : core, new Carto.Random(s.seed + ':urban'), s.x, s.y, r);
    }
    if (cyber) {
      const glow = glowFilter(svg, 3);
      svg.path(core.toString(), { fill: pal.accent, opacity: 0.55, filter: glow });
      svg.path(core.toString(), { fill: mix(pal.paper, pal.accent, 0.35), stroke: pal.accent, strokeWidth: 0.8 });
      svg.path(core.toString(), { fill: hatchPattern(svg, pal.ink, 3, 0.5, 0), opacity: 0.35 });
      svg.path(ub.toString(), { fill: pal.ink, opacity: 0.4, filter: glow });
      svg.path(ub.toString(), { fill: mix(pal.paper, pal.ink, 0.3), stroke: pal.ink, strokeWidth: 0.6 });
    } else {
      const fill = dark ? mix(pal.paper, pal.building, 0.8) : mix(pal.building, '#e9dcc4', 0.35);
      const edge = mix(fill, pal.ink, 0.3);
      svg.path(ub.toString() + core.toString(), { fill, stroke: edge, strokeWidth: 0.6 });
    }
    svg.close();

    // Lakes and rivers.
    const lb = new Svg.Batch();
    for (const l of m.lakes) lb.smooth(l.points, true);
    svg.path(lb.toString(), { fill: cyber ? pal.water : mix(pal.water, pal.waterInk, 0.05), stroke: cyber ? pal.ink : pal.waterInk, strokeWidth: 0.8 });
    for (const r of m.rivers) {
      const pts = G.chaikin(r, 2, false);
      for (let i = 0; i < pts.length - 1; i += 6) {
        const seg = pts.slice(i, Math.min(pts.length, i + 7));
        const a = r[Math.min(r.length - 1, Math.floor(i / 4))].a;
        svg.path(Svg.d(seg, false), { fill: 'none', stroke: pal.waterInk, strokeWidth: Math.min(3.2, 0.6 + Math.sqrt(a / m.T) * 0.5), strokeLinecap: 'round', strokeLinejoin: 'round' });
      }
    }

    // Coastline.
    if (cyber) {
      svg.path(ld, { fill: 'none', stroke: pal.ink, strokeWidth: 3.5, opacity: 0.35, filter: glowFilter(svg, 2) });
      svg.path(ld, { fill: 'none', stroke: pal.ink, strokeWidth: 1.1, strokeLinejoin: 'round' });
      svg.path(hexGrid(W, H, 18), { fill: 'none', stroke: pal.ink, strokeWidth: 0.5, opacity: 0.09 });
    } else svg.path(ld, { fill: 'none', stroke: dark ? pal.ink : mix(pal.waterInk, pal.ink, 0.35), strokeWidth: 1, strokeLinejoin: 'round' });

    // Networks.
    const round = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
    const curve = (r) => G.chaikin(r.filter((_, i) => i % 2 === 0 || i === r.length - 1), 2, false);
    if (m.roads.length) {
      const main = new Svg.Batch(), local = new Svg.Batch();
      const mainAt = new Set();
      m.roads.forEach((r, k) => {
        (m.roadMain[k] ? main : local).smooth(curve(r), false);
        if (m.roadMain[k]) for (const p of r) mainAt.add(p.x + ',' + p.y);
      });
      // Junctions: where a local road joins the main network.
      const junctions = [];
      m.roads.forEach((r, k) => {
        if (m.roadMain[k]) return;
        for (const p of [r[0], r[r.length - 1]]) {
          if (mainAt.has(p.x + ',' + p.y) && !m.settlements.some((s) => G.dist(s, p) < 14) && !junctions.some((q) => G.dist(q, p) < 10)) junctions.push(p);
        }
      });
      const ls = local.toString(), ms = main.toString();
      if (cyber) {
        svg.path(ls, Object.assign({ stroke: pal.paper, strokeWidth: 2.6, opacity: 0.8 }, round));
        svg.path(ls, Object.assign({ stroke: mix(pal.inkSoft, pal.label, 0.45), strokeWidth: 1.1 }, round));
        svg.path(ms, Object.assign({ stroke: pal.accent, strokeWidth: 4, opacity: 0.6, filter: glowFilter(svg, 2) }, round));
        svg.path(ms, Object.assign({ stroke: pal.accent, strokeWidth: 1.6 }, round));
        svg.path(ms, Object.assign({ stroke: pal.label, strokeWidth: 0.5, strokeDasharray: '1 3', opacity: 0.8 }, round));
        const jb = new Svg.Batch();
        for (const p of junctions) jb.poly(G.rect(p.x, p.y, 4, 4, Math.PI / 4));
        svg.path(jb.toString(), { fill: pal.paper, stroke: pal.accent, strokeWidth: 0.9 });
      } else {
        const yellow = dark ? pal.road : mix(pal.road, '#f6d36b', 0.55);
        svg.path(ls, Object.assign({ stroke: dark ? pal.ink : pal.inkSoft, strokeWidth: 2.7, opacity: dark ? 0.5 : 0.9 }, round));
        svg.path(ls, Object.assign({ stroke: yellow, strokeWidth: 1.5 }, round));
        drawRails();
        svg.path(ms, Object.assign({ stroke: pal.ink, strokeWidth: 4.6 }, round));
        svg.path(ms, Object.assign({ stroke: pal.accent, strokeWidth: 3 }, round));
        svg.path(ms, Object.assign({ stroke: pal.road, strokeWidth: 0.6 }, round));
        // Motorway junctions: a white tab with a dark rim.
        const jb = new Svg.Batch();
        for (const p of junctions) jb.circle(p.x, p.y, 2.9);
        svg.path(jb.toString(), { fill: pal.road, stroke: pal.ink, strokeWidth: 1 });
      }
    } else if (!cyber) drawRails();
    function drawRails() {
      if (!m.rails || !m.rails.length) return;
      const b = new Svg.Batch();
      for (const r of m.rails) b.smooth(curve(r), false);
      const s = b.toString();
      svg.path(s, { fill: 'none', stroke: pal.ink, strokeWidth: 2.4, strokeLinejoin: 'round' });
      svg.path(s, { fill: 'none', stroke: pal.paper, strokeWidth: 1.2, strokeDasharray: '4 4', strokeLinejoin: 'round' });
    }

    if (m.port) {
      portGlyph(svg, m.port, pal, cyber);
      taken.push({ x0: m.port.x - 10, x1: m.port.x + 10, y0: m.port.y - 10, y1: m.port.y + 10 });
    }
    return taken;
  }

  function render(m, o) {
    const pal = o.palette;
    const setting = Carto.Setting.current;
    const svg = new Svg(W, H);
    // Present day and cyberpunk: a modern atlas instead of the engraving
    // (the 3D texture keeps the plain tints below).
    const present = setting !== 'fantasy' && !o.bare ? renderPresent(svg, m, o, pal, setting) : null;
    if (!present) {
      svg.rect(0, 0, W, H, { fill: pal.water });

      // Sea ripples hugging the coast.
      const rip = [0.45, 0.3, 0.18];
      m.ripples.forEach((lines, k) => {
        const b = new Svg.Batch();
        for (const l of lines) b.smooth(G.chaikin(l.points, 1, l.closed), l.closed);
        svg.path(b.toString(), { fill: 'none', stroke: pal.waterInk, strokeWidth: 0.8, opacity: rip[k] });
      });

      // Land.
      const land = new Svg.Batch();
      for (const l of m.coast) land.smooth(G.chaikin(l.points, 1, l.closed), l.closed);
      const ld = land.toString();
      const landClip = Carto.uid('land');
      svg.defs('<clipPath id="' + landClip + '"><path d="' + ld + '" clip-rule="evenodd"/></clipPath>');
      svg.path(ld, { fill: pal.paper, fillRule: 'evenodd' });

      svg.open({ clipPath: 'url(#' + landClip + ')' });
      // The 3D texture tints the land by elevation, as the illustrated
      // mountains are left out.
      if (o.bare) {
        const tints = [[0.02, '#c3cb93'], [0.15, '#d2cc99'], [0.3, '#cdb98b'], [0.45, '#b99f7b'], [0.6, '#a08b77'], [0.74, '#a8a49d'], [0.87, '#ebe9e4']];
        for (const [level, col] of tints) {
          const b = new Svg.Batch();
          for (const l of Contour.trace(m.elev, GW, GH, level, CELL, 0, 0)) b.smooth(G.chaikin(l.points, 1, true), true);
          svg.path(b.toString(), { fill: col, fillRule: 'evenodd' });
        }
      }
      // Forest floors.
      const fb = new Svg.Batch();
      for (const l of m.forests) fb.smooth(G.chaikin(l.points, 1, l.closed), l.closed);
      svg.path(fb.toString(), { fill: pal.green, fillRule: 'evenodd', opacity: 0.55 });
      svg.close();

      // Lakes and rivers.
      const lb = new Svg.Batch();
      for (const l of m.lakes) lb.smooth(l.points, true);
      svg.path(lb.toString(), { fill: pal.water, stroke: pal.ink, strokeWidth: 0.9 });
      for (const r of m.rivers) {
        const pts = G.chaikin(r, 2, false);
        // Split into stretches whose width follows the flow.
        const step = 6;
        for (let i = 0; i < pts.length - 1; i += step) {
          const seg = pts.slice(i, Math.min(pts.length, i + step + 1));
          const a = r[Math.min(r.length - 1, Math.floor(i / 4))].a;
          const wdt = Math.min(3.6, 0.7 + Math.sqrt(a / m.T) * 0.55);
          svg.path(Svg.d(seg, false), { fill: 'none', stroke: pal.waterInk, strokeWidth: wdt, strokeLinecap: 'round', strokeLinejoin: 'round' });
        }
      }

      // Coastline on top of everything that touches it.
      svg.path(ld, { fill: 'none', stroke: pal.ink, strokeWidth: 1.4, strokeLinejoin: 'round' });

      // Roads.
      if (m.roads.length && m.roadMain) {
        // Solid roads: cased motorways and local roads today, maglev lines
        // glowing over grey highways in the cyberpunk future.
        const main = new Svg.Batch(), local = new Svg.Batch();
        m.roads.forEach((r, k) => (m.roadMain[k] ? main : local).smooth(G.chaikin(r.filter((_, i) => i % 2 === 0 || i === r.length - 1), 2, false), false));
        const ls = local.toString(), ms = main.toString();
        const round = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
        if (setting === 'cyber') {
          svg.path(ls, Object.assign({ stroke: pal.inkSoft, strokeWidth: 1.3 }, round));
          svg.path(ms, Object.assign({ stroke: pal.accent, strokeWidth: 5, opacity: 0.25 }, round));
          svg.path(ms, Object.assign({ stroke: pal.accent, strokeWidth: 1.5 }, round));
        } else {
          svg.path(ls, Object.assign({ stroke: pal.inkSoft, strokeWidth: 2.6 }, round));
          svg.path(ls, Object.assign({ stroke: pal.road, strokeWidth: 1.4 }, round));
          svg.path(ms, Object.assign({ stroke: pal.ink, strokeWidth: 3.8 }, round));
          svg.path(ms, Object.assign({ stroke: pal.accent, strokeWidth: 2.2 }, round));
        }
      } else if (m.roads.length) {
        const rb = new Svg.Batch();
        for (const r of m.roads) rb.smooth(G.chaikin(r.filter((_, i) => i % 2 === 0 || i === r.length - 1), 2, false), false);
        svg.path(rb.toString(), { fill: 'none', stroke: pal.inkSoft, strokeWidth: 1.1, strokeDasharray: '4 3', strokeLinecap: 'round' });
      }

      // Relief and trees, drawn back to front (left out of the 3D texture).
      const items = [];
      if (o.bare) return svg.toString();
      for (const mt of m.mountains) items.push({ y: mt.y, k: 'm', v: mt });
      for (const hl of m.hills) items.push({ y: hl.y, k: 'h', v: hl });
      for (const tr of m.trees) items.push({ y: tr.y, k: 't', v: tr });
      items.sort((a, b) => a.y - b.y);
      // Batch per band of rows so overlaps stay correct without thousands of elements.
      const band = 24;
      let i0 = 0;
      const tr = new Carto.Random(m.seed + 3);
      while (i0 < items.length) {
        const yb = items[i0].y + band;
        const line = new Svg.Batch(), shade = new Svg.Batch(), fill = new Svg.Batch(), crowns = new Svg.Batch(), hillB = new Svg.Batch();
        let i = i0;
        for (; i < items.length && items[i].y < yb; i++) {
          const it = items[i];
          if (it.k === 'm') mountainGlyph(it.v, line, shade, fill, tr);
          else if (it.k === 'h') hillGlyph(it.v, hillB, fill);
          else crowns.smooth(Draw.blob(tr, it.v.x, it.v.y - it.v.r * 0.6, it.v.r, 7, 0.25), true);
        }
        svg.path(crowns.toString(), { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.6 });
        svg.path(fill.toString(), { fill: pal.mountain });
        svg.path(shade.toString(), { fill: pal.inkSoft, opacity: 0.35 });
        svg.path(line.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.9, strokeLinejoin: 'round', strokeLinecap: 'round' });
        svg.path(hillB.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.8, strokeLinecap: 'round' });
        i0 = i;
      }
    }

    // Settlements.
    const taken = present || [];
    const icons = new Svg.Batch(), dark = new Svg.Batch(), glow = new Svg.Batch();
    for (const s of m.settlements) {
      if (setting === 'modern') modernIcon(icons, dark, s);
      else if (setting === 'cyber') cyberIcon(icons, glow, s);
      else if (s.type === 'capital') castle(icons, s.x, s.y);
      else if (s.type === 'town') { house(icons, s.x - 3, s.y + 1, 1); house(icons, s.x + 3, s.y - 1, 1.15); }
      else house(icons, s.x, s.y, 0.9);
      if (s.type === 'capital' && setting === 'fantasy') dark.circle(s.x, s.y + 7, 1.6);
      taken.push({ x0: s.x - 9, x1: s.x + 9, y0: s.y - 10, y1: s.y + 6 });
    }
    if (setting === 'cyber') svg.path(glow.toString(), { fill: pal.accent, opacity: 0.22 });
    svg.path(icons.toString(), { fill: pal.paper, stroke: setting === 'cyber' ? pal.accent : pal.ink, strokeWidth: 1, strokeLinejoin: 'round' });
    svg.path(dark.toString(), { fill: pal.ink });
    if (!o.preview) {
      for (const s of m.settlements) {
        const link = settlementLink(s).slice(1);
        svg.raw('<g data-link="' + Svg.esc(link) + '" style="cursor:pointer"><title>' + Svg.esc(s.name) + '</title>' +
          '<circle cx="' + Svg.num(s.x) + '" cy="' + Svg.num(s.y - 2) + '" r="11" fill="transparent"/></g>');
      }
    }

    // Lettering.
    if (o.labels !== false) {
      const titleSize = o.preview ? 44 : 34;
      const titleText = title(m);
      // Put the title where it covers the fewest features.
      const reserved = o.preview ? [] : [{ x0: 0, x1: 200, y0: H - 75, y1: H }, { x0: W - 110, x1: W, y0: H - 120, y1: H }];
      const tw = Draw.textBox(0, 0, titleText, titleSize, { title: true }).x1 * 2;
      const xs = [tw / 2 + 30, W / 2, W - tw / 2 - 30];
      const corners = [];
      for (const yy of [56, H - 50]) for (const xx of xs) corners.push([xx, yy]);
      let best = corners[0], bs = Infinity;
      for (const c of corners) {
        const box = Draw.textBox(c[0], c[1], titleText, titleSize, { title: true });
        const inside = (q, pad) => q.x > box.x0 - pad && q.x < box.x1 + pad && q.y > box.y0 - pad && q.y < box.y1 + pad;
        const sc = m.settlements.filter((q) => inside(q, 25)).length * 12 +
          m.mountains.filter((q) => inside(q, 5)).length * 0.6 + m.trees.filter((q) => inside(q, 0)).length * 0.05 +
          reserved.filter((r) => Draw.overlaps(r, box)).length * 100 + (c[1] > H / 2 ? 0.5 : 0);
        if (sc < bs) { bs = sc; best = c; }
      }
      taken.push(...reserved);
      Draw.label(svg, best[0], best[1], titleText, titleSize, pal, { title: true, spacing: 1.5, haloWidth: 0.3 });
      taken.push(Draw.textBox(best[0], best[1], titleText, titleSize, { title: true }));
      if (!o.preview) {
        // The sans-serif and monospaced letterings run wider than the
        // engraved one: keep long names inside the frame.
        const inside = (x, tx, size, sp) => {
          if (setting === 'fantasy') return x;
          const hw = tx.length * (size * 0.6 + sp) / 2;
          return Math.max(18 + hw, Math.min(W - 18 - hw, x));
        };
        // Present day and cyberpunk: boxes that count the letter spacing.
        const widen = (box, tx, sp) => {
          if (!present) return box;
          const k = (tx.length * sp) / 2;
          return { x0: box.x0 - k, x1: box.x1 + k, y0: box.y0, y1: box.y1 };
        };
        const openWater = (box) => {
          for (let y = box.y0; y <= box.y1; y += CELL) for (let x = box.x0; x <= box.x1; x += CELL) if (m.elev[cellAt(x, y)] >= 0) return false;
          return true;
        };
        const labels = m.settlements.map((s) => ({
          x: s.x, y: s.y + (s.type === 'capital' ? 14 : 11), text: s.name,
          size: s.type === 'capital' ? 15 : s.type === 'town' ? 12.5 : 10.5,
          title: s.type === 'capital',
          offsets: [[0, 0], [1, -0.9], [-1, -0.9], [0, -2.4]],
          gap: 12,
        }));
        Draw.placeLabels(svg, labels, pal, taken, { x0: 8, y0: 8, x1: W - 8, y1: H - 8 });
        for (const f of m.features) {
          if (f.kind === 'sea') {
            const tx = t('realm.sea.' + f.v, { n: f.name });
            for (const sp of f.spots || [f]) {
              const box = Draw.textBox(sp.x, sp.y, tx, 17, {});
              const pad = setting === 'fantasy' ? 2 : 3.4;
              box.x0 -= tx.length * pad; box.x1 += tx.length * pad;
              if (box.x0 < 20 || box.x1 > W - 20 || taken.some((b) => Draw.overlaps(b, box))) continue;
              // The wider modern letterings must stay on open water.
              if (present && !openWater(box)) continue;
              Draw.label(svg, sp.x, sp.y, tx, 17, pal, { italic: true, spacing: 4, color: pal.waterInk, haloColor: pal.water, haloWidth: 0.2 });
              taken.push(box);
              break;
            }
          } else if (f.kind === 'mountains') {
            const tx = t('realm.mountains', { n: f.name });
            // A few nearby spots in the modern settings, where boxes are wider.
            const spots = present ? [[0, 0], [0, 18], [0, -26], [-70, 0], [70, 0], [0, 36]] : [[0, 0]];
            for (const [dx, dy] of spots) {
              const x = inside(f.x + dx, tx, 13, 2.5), y = Math.min(H - 30, f.y + dy);
              const box = widen(Draw.textBox(x, y, tx, 13, {}), tx, 2.5);
              if (taken.some((b) => Draw.overlaps(b, box))) continue;
              Draw.label(svg, x, y, tx, 13, pal, { italic: true, spacing: 2.5 });
              taken.push(box);
              break;
            }
          } else if (f.kind === 'forest') {
            const tx = t('realm.forest' + (f.v ? '.' + f.v : ''), { n: f.name });
            const x = inside(f.x, tx, 12, 2);
            const box = widen(Draw.textBox(x, f.y, tx, 12, {}), tx, 2);
            if (!taken.some((b) => Draw.overlaps(b, box))) { Draw.label(svg, x, f.y, tx, 12, pal, { italic: true, spacing: 2, color: pal.greenInk }); taken.push(box); }
          }
        }
        // Present day and cyberpunk: spot height on the highest summit.
        if (present && m.topM) {
          let top = 0;
          for (let i = 1; i < m.elev.length; i++) if (m.elev[i] > m.elev[top]) top = i;
          const x = px(top), y = py(top);
          const tx = m.topM.toLocaleString(Carto.I18n.lang) + ' m';
          const placed = Draw.placeLabels(svg, [{ x, y: y + 1, text: tx, size: 9, offsets: [[1, 0], [-1, 0], [0, 1.3]], gap: 6 }], pal, taken, { x0: 14, y0: 14, x1: W - 14, y1: H - 14 });
          if (placed.length) svg.poly([{ x, y: y - 3.4 }, { x: x + 3.2, y: y + 2.2 }, { x: x - 3.2, y: y + 2.2 }], { fill: setting === 'cyber' ? pal.accent : pal.ink });
        }
      }
    }
    if (!o.preview) {
      // Compass in the emptiest bottom corner, scale bar opposite.
      Draw.compass(svg, W - 52, H - 62, 30, pal);
      // Ten leagues, or the same span rounded to 50 km.
      Draw.scaleBar(svg, 30, H - 40, 125, setting === 'fantasy' ? 10 : 50, t('realm.leagues'), pal, 5);
      // Graduated border, with a clean paper margin outside it.
      const m0 = 6;
      svg.rect(0, 0, W, H, { fill: 'none', stroke: pal.paper, strokeWidth: 2 * m0 });
      svg.rect(m0, m0, W - 2 * m0, H - 2 * m0, { fill: 'none', stroke: pal.ink, strokeWidth: 1.6 });
      const tick = new Svg.Batch();
      for (let x = m0; x < W - m0; x += 40) {
        tick.poly([{ x, y: m0 }, { x: Math.min(W - m0, x + 20), y: m0 }, { x: Math.min(W - m0, x + 20), y: m0 + 4 }, { x, y: m0 + 4 }]);
        tick.poly([{ x, y: H - m0 - 4 }, { x: Math.min(W - m0, x + 20), y: H - m0 - 4 }, { x: Math.min(W - m0, x + 20), y: H - m0 }, { x, y: H - m0 }]);
      }
      for (let y = m0; y < H - m0; y += 40) {
        tick.poly([{ x: m0, y }, { x: m0 + 4, y }, { x: m0 + 4, y: Math.min(H - m0, y + 20) }, { x: m0, y: Math.min(H - m0, y + 20) }]);
        tick.poly([{ x: W - m0 - 4, y }, { x: W - m0, y }, { x: W - m0, y: Math.min(H - m0, y + 20) }, { x: W - m0 - 4, y: Math.min(H - m0, y + 20) }]);
      }
      svg.path(tick.toString(), { fill: pal.ink });
      svg.rect(m0 + 4, m0 + 4, W - 2 * m0 - 8, H - 2 * m0 - 8, { fill: 'none', stroke: pal.ink, strokeWidth: 0.7 });
    }
    return svg.toString();
  }

  // Heights for the 3D export: the elevation grid resampled, softened and
  // given fine detail on land. Sea level sits at a third of the range.
  function heightfield(m) {
    const cols = 2000, rows = 1440;
    const R = Carto.Relief3D;
    const data = R.fromGrid(m.elev, GW, GH, cols, rows);
    const coast = Uint8Array.from(data, (v) => (v >= 0 ? 1 : 0));
    R.blur(data, cols, rows, 3, 2);
    const noise = new Carto.Noise(m.seed + ':relief3d');
    for (let p = 0; p < data.length; p++) {
      let v = data[p];
      if (coast[p]) {
        const x = ((p % cols) / (cols - 1)) * W, y = (Math.floor(p / cols) / (rows - 1)) * H;
        v = Math.max(0.003, v + noise.fbm(x / 8, y / 8, 4, 2.1, 0.5) * (0.003 + v * 0.025));
      } else v = Math.min(v, -0.003);
      data[p] = Math.max(0, Math.min(1, (v + 0.5) / 1.5));
    }
    return { cols, rows, data, sea: 1 / 3, width: W, height: H, scale: 1.1, water: '#3f6f8a' };
  }

  const title = (m) => t('realm.title.' + m.kind, { n: m.name, c: m.corp || m.name });

  // Towns open in the city generator, villages in the village generator.
  function settlementLink(s) {
    if (s.type === 'village') {
      return Carto.linkTo('village', s.seed, { size: 'village', water: s.river ? 'stream' : 'none', name: s.name });
    }
    return Carto.linkTo('city', s.seed, {
      size: s.type === 'capital' ? 'large' : 'medium',
      water: s.coast && s.river ? 'both' : s.coast ? 'coast' : s.river ? 'river' : 'none',
      citadel: s.type === 'capital', name: s.name,
    });
  }

  function notes(m) {
    const esc = Svg.esc;
    let h = '<h3>' + esc(title(m)) + '</h3><p class="tag">' + esc(t('realm.open')) + '</p><ul>';
    for (const s of m.settlements) {
      const link = settlementLink(s);
      h += '<li><a href="' + esc(link) + '">' + esc(s.name) + '</a> <span class="tag">' + esc(t('realm.' + s.type)) + '</span></li>';
    }
    h += '</ul>';
    // Present day and cyberpunk: what the two road styles mean.
    if (m.roadMain) {
      const keys = [];
      if (m.roads.length) keys.push('━ ' + esc(t('realm.road.main')), '─ ' + esc(t('realm.road.local')));
      if (m.rails && m.rails.length) keys.push('┅ ' + esc(t('realm.rail')));
      if (m.port) keys.push((Carto.Setting.is('cyber') ? '◎ ' : '✈ ') + esc(t('realm.port')));
      if (Carto.Setting.is('cyber') && m.forests.length) keys.push('▨ ' + esc(t('realm.toxic')));
      if (m.topM) keys.push('▲ ' + esc(t('realm.contours', { n: contourStep(m.topM, Carto.Setting.is('cyber')) })));
      if (keys.length) h += '<p class="tag">' + keys.join(' · ') + '</p>';
    }
    return h;
  }

  Carto.register({
    id: 'realm',
    order: 1,
    heightfield,
    options: [
      { id: 'shape', type: 'select', values: ['island', 'coast', 'archipelago', 'continent'], def: 'coast' },
      { id: 'density', type: 'select', values: ['few', 'normal', 'many'], def: 'normal' },
      { id: 'roads', type: 'bool', def: true },
      { id: 'labels', type: 'bool', def: true, renderOnly: true },
      { id: 'name', type: 'text', def: '', hidden: true },
    ],
    generate,
    render,
    notes,
    fileName: (m) => m.name,
  });

  Carto.Realm = { generate, render };
})(window.Carto = window.Carto || {});
