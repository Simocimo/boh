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
      const roadCell = new Uint8Array(N);
      pairs.sort((p, q) => (settlements[p[0]].type === 'capital' || settlements[p[1]].type === 'capital' ? -1 : 0) - (settlements[q[0]].type === 'capital' || settlements[q[1]].type === 'capital' ? -1 : 0));
      for (const [a, b] of pairs) {
        const path = route(cellOf(settlements[a].x, settlements[a].y), cellOf(settlements[b].x, settlements[b].y));
        if (!path) continue;
        // Skip the parts that already follow a road.
        let seg = [];
        for (const c of path) {
          if (roadCell[c] && seg.length) { seg.push(c); if (seg.length > 2) roads.push(seg.map((i) => ({ x: px(i), y: py(i) }))); seg = []; continue; }
          if (!roadCell[c]) seg.push(c);
        }
        if (seg.length > 1) roads.push(seg.map((i) => ({ x: px(i), y: py(i) })));
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

    return {
      seed, shape,
      name: opts.name || Carto.Names.place(rng.fork('realm')),
      kind: rng.fork('kind').int(0, 4),
      coast, lakes: lakeLines, ripples, forests, rivers, roads, mountains, hills, trees, settlements, features,
      T,
    };
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

  function render(m, o) {
    const pal = o.palette;
    const svg = new Svg(W, H);
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
    if (m.roads.length) {
      const rb = new Svg.Batch();
      for (const r of m.roads) rb.smooth(G.chaikin(r.filter((_, i) => i % 2 === 0 || i === r.length - 1), 2, false), false);
      svg.path(rb.toString(), { fill: 'none', stroke: pal.inkSoft, strokeWidth: 1.1, strokeDasharray: '4 3', strokeLinecap: 'round' });
    }

    // Relief and trees, drawn back to front.
    const items = [];
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

    // Settlements.
    const taken = [];
    const icons = new Svg.Batch(), dark = new Svg.Batch();
    for (const s of m.settlements) {
      if (s.type === 'capital') castle(icons, s.x, s.y);
      else if (s.type === 'town') { house(icons, s.x - 3, s.y + 1, 1); house(icons, s.x + 3, s.y - 1, 1.15); }
      else house(icons, s.x, s.y, 0.9);
      if (s.type === 'capital') dark.circle(s.x, s.y + 7, 1.6);
      taken.push({ x0: s.x - 9, x1: s.x + 9, y0: s.y - 10, y1: s.y + 6 });
    }
    svg.path(icons.toString(), { fill: pal.paper, stroke: pal.ink, strokeWidth: 1, strokeLinejoin: 'round' });
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
      const titleText = t('realm.title.' + m.kind, { n: m.name });
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
              box.x0 -= tx.length * 2; box.x1 += tx.length * 2;
              if (box.x0 < 20 || box.x1 > W - 20 || taken.some((b) => Draw.overlaps(b, box))) continue;
              Draw.label(svg, sp.x, sp.y, tx, 17, pal, { italic: true, spacing: 4, color: pal.waterInk, haloColor: pal.water, haloWidth: 0.2 });
              taken.push(box);
              break;
            }
          } else if (f.kind === 'mountains') {
            const tx = t('realm.mountains', { n: f.name });
            const box = Draw.textBox(f.x, f.y, tx, 13, {});
            if (!taken.some((b) => Draw.overlaps(b, box))) { Draw.label(svg, f.x, f.y, tx, 13, pal, { italic: true, spacing: 2.5 }); taken.push(box); }
          } else if (f.kind === 'forest') {
            const tx = t('realm.forest', { n: f.name });
            const box = Draw.textBox(f.x, f.y, tx, 12, {});
            if (!taken.some((b) => Draw.overlaps(b, box))) { Draw.label(svg, f.x, f.y, tx, 12, pal, { italic: true, spacing: 2, color: pal.greenInk }); taken.push(box); }
          }
        }
      }
    }
    if (!o.preview) {
      // Compass in the emptiest bottom corner, scale bar opposite.
      Draw.compass(svg, W - 52, H - 62, 30, pal);
      Draw.scaleBar(svg, 30, H - 40, 125, 10, t('realm.leagues'), pal, 5);
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
    let h = '<h3>' + esc(t('realm.title.' + m.kind, { n: m.name })) + '</h3><p class="tag">' + esc(t('realm.open')) + '</p><ul>';
    for (const s of m.settlements) {
      const link = settlementLink(s);
      h += '<li><a href="' + esc(link) + '">' + esc(s.name) + '</a> <span class="tag">' + esc(t('realm.' + s.type)) + '</span></li>';
    }
    return h + '</ul>';
  }

  Carto.register({
    id: 'realm',
    order: 1,
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
