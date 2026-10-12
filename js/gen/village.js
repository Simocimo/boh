/* Village generator: houses strung along winding roads, a square with a well,
   a temple, an inn, a mill on the stream, and a patchwork of fields.
   Present day (a village of lots and side streets amid rectangular fields) and
   cyberpunk (a walled shanty town of containers) have their own layouts. */
(function (Carto) {
  'use strict';

  const G = Carto.G, Svg = Carto.Svg, Draw = Carto.Draw, t = Carto.t;

  Carto.I18n.add({
    it: {
      'gen.village.name': 'Villaggio',
      'gen.village.desc': 'Borghi di campagna: case lungo le strade, piazza col pozzo, tempio, locanda, mulino e campi.',
      'village.opt.size': 'Dimensione',
      'village.opt.size.hamlet': 'Casale',
      'village.opt.size.village': 'Villaggio',
      'village.opt.size.large': 'Paese',
      'village.opt.water': 'Acqua',
      'village.opt.water.none': 'Nessuna',
      'village.opt.water.stream': 'Ruscello',
      'village.opt.water.pond': 'Stagno',
      'village.opt.forest': 'Boschi',
      'village.opt.fields': 'Campi',
      'village.opt.labels': 'Nome e didascalie',
      'village.temple': 'Tempio',
      'village.inn': 'Locanda',
      'village.mill': 'Mulino',
      'village.well': 'Pozzo',
      'village.houses': 'Case',
      'village.population': 'Abitanti (stima)',
      'village.sub.hamlet': 'casale',
      'village.sub.village': 'villaggio',
      'village.sub.large': 'paese',
      // Present day (2026).
      'gen.village.desc@modern': "Paesi di campagna di oggi: chiesa, bar, municipio, distributore, fermata dell'autobus, campo sportivo e campi.",
      'village.opt.size.hamlet@modern': 'Frazione',
      'village.opt.size.village@modern': 'Paese',
      'village.opt.size.large@modern': 'Capoluogo',
      'village.opt.water.pond@modern': 'Laghetto',
      'village.temple@modern': 'Chiesa',
      'village.inn@modern': 'Bar',
      'village.mill@modern': 'Vecchio mulino',
      'village.well@modern': 'Fontana',
      'village.townhall': 'Municipio',
      'village.fuel': 'Distributore',
      'village.bus': "Fermata dell'autobus",
      'village.pitch': 'Campo sportivo',
      'village.mayor': 'Sindaco',
      'village.blocks': 'Palazzine',
      'village.road': 'SP {n}',
      'village.farm': 'Cascina {n}',
      'village.sub.hamlet@modern': 'frazione',
      'village.sub.village@modern': 'paese',
      'village.sub.large@modern': 'capoluogo di comune',
      // Cyberpunk.
      'gen.village.desc@cyber': 'Insediamenti di frontiera e baraccopoli di recuperatori: depuratore, sfasciacarrozze, campo solare e piattaforma per droni.',
      'village.opt.size.hamlet@cyber': 'Accampamento',
      'village.opt.size.village@cyber': 'Insediamento',
      'village.opt.size.large@cyber': 'Città di frontiera',
      'village.opt.water.stream@cyber': 'Canale',
      'village.opt.water.pond@cyber': 'Pozza tossica',
      'village.opt.forest@cyber': 'Boscaglia',
      'village.opt.fields@cyber': 'Orti e serre',
      'village.temple@cyber': 'Santuario della Rete',
      'village.inn@cyber': 'Bettola',
      'village.mill@cyber': 'Turbina idroelettrica',
      'village.well@cyber': "Depuratore d'acqua",
      'village.townhall@cyber': 'Clinica clandestina',
      'village.fuel@cyber': 'Sfasciacarrozze',
      'village.bus@cyber': 'Piattaforma per droni',
      'village.pitch@cyber': 'Campo solare',
      'village.mayor@cyber': 'Capobanda',
      'village.houses@cyber': 'Baracche',
      'village.scrap': 'Cumuli di rottami',
      'village.greenhouse': 'Serre idroponiche',
      'village.sub.hamlet@cyber': 'accampamento',
      'village.sub.village@cyber': 'insediamento di recuperatori',
      'village.sub.large@cyber': 'città di frontiera',
    },
    en: {
      'gen.village.name': 'Village',
      'gen.village.desc': 'Country villages: houses along the roads, a square with a well, temple, inn, mill and fields.',
      'village.opt.size': 'Size',
      'village.opt.size.hamlet': 'Hamlet',
      'village.opt.size.village': 'Village',
      'village.opt.size.large': 'Large village',
      'village.opt.water': 'Water',
      'village.opt.water.none': 'None',
      'village.opt.water.stream': 'Stream',
      'village.opt.water.pond': 'Pond',
      'village.opt.forest': 'Woods',
      'village.opt.fields': 'Fields',
      'village.opt.labels': 'Name and captions',
      'village.temple': 'Temple',
      'village.inn': 'Inn',
      'village.mill': 'Mill',
      'village.well': 'Well',
      'village.houses': 'Houses',
      'village.population': 'Population (estimate)',
      'village.sub.hamlet': 'hamlet',
      'village.sub.village': 'village',
      'village.sub.large': 'large village',
      // Present day (2026).
      'gen.village.desc@modern': 'Present-day country villages: church, café, town hall, petrol station, bus stop, sports ground and fields.',
      'village.opt.size.large@modern': 'Small town',
      'village.temple@modern': 'Church',
      'village.inn@modern': 'Café',
      'village.mill@modern': 'Old mill',
      'village.well@modern': 'Fountain',
      'village.townhall': 'Town hall',
      'village.fuel': 'Petrol station',
      'village.bus': 'Bus stop',
      'village.pitch': 'Sports ground',
      'village.mayor': 'Mayor',
      'village.blocks': 'Apartment blocks',
      'village.road': 'Route {n}',
      'village.farm': '{n} Farm',
      'village.sub.large@modern': 'small town',
      // Cyberpunk.
      'gen.village.desc@cyber': 'Frontier towns and scavenger shantytowns: water purifier, chop shop, solar farm and drone pad.',
      'village.opt.size.hamlet@cyber': 'Camp',
      'village.opt.size.village@cyber': 'Settlement',
      'village.opt.size.large@cyber': 'Frontier town',
      'village.opt.water.stream@cyber': 'Channel',
      'village.opt.water.pond@cyber': 'Toxic pool',
      'village.opt.forest@cyber': 'Scrubland',
      'village.opt.fields@cyber': 'Plots and greenhouses',
      'village.temple@cyber': 'Net shrine',
      'village.inn@cyber': 'Dive bar',
      'village.mill@cyber': 'Water turbine',
      'village.well@cyber': 'Water purifier',
      'village.townhall@cyber': 'Back-alley clinic',
      'village.fuel@cyber': 'Chop shop',
      'village.bus@cyber': 'Drone pad',
      'village.pitch@cyber': 'Solar farm',
      'village.mayor@cyber': 'Gang boss',
      'village.houses@cyber': 'Shacks',
      'village.scrap': 'Scrap heaps',
      'village.greenhouse': 'Hydroponic greenhouses',
      'village.sub.hamlet@cyber': 'camp',
      'village.sub.village@cyber': 'scavenger settlement',
      'village.sub.large@cyber': 'frontier town',
    },
  });

  const S = 460;
  const SIZE = { hamlet: { R: 62, branches: 1, lanes: 1 }, village: { R: 98, branches: 2, lanes: 3 }, large: { R: 136, branches: 3, lanes: 5 } };

  // A wandering line from a to b, pushed sideways by noise.
  function wander(a, b, noise, amp, step = 8, salt = 0) {
    const len = G.dist(a, b);
    const n = Math.max(2, Math.round(len / step));
    const dir = G.norm(G.sub(b, a)), nrm = G.perp(dir);
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const tt = i / n;
      const p = G.lerp(a, b, tt);
      const env = Math.sin(Math.PI * tt);
      const off = noise.fbm(tt * 2.2 + salt, salt * 0.37, 3) * amp * (0.35 + 0.65 * env);
      pts.push(G.add(p, G.scale(nrm, off)));
    }
    return G.chaikin(pts, 2, false);
  }

  // Point on the map edge in direction `ang` from the centre (beyond the sheet).
  const edgePoint = (c, ang) => G.add(c, G.fromAngle(ang, S * 0.75));

  function closestOnLine(line, p) {
    let best = { d: Infinity, i: 0, p: line[0] };
    for (let i = 0; i < line.length - 1; i++) {
      const a = line[i], b = line[i + 1];
      const ab = G.sub(b, a);
      const l2 = G.dot(ab, ab) || 1;
      const tt = Math.max(0, Math.min(1, G.dot(G.sub(p, a), ab) / l2));
      const q = G.add(a, G.scale(ab, tt));
      const d = G.dist(p, q);
      if (d < best.d) best = { d, i, p: q, dir: G.norm(ab) };
    }
    return best;
  }

  function generate(seed, opts) {
    // Present day and cyberpunk have their own layouts (further down).
    if (Carto.Setting.current === 'modern') return generateModern(seed, opts);
    if (Carto.Setting.current === 'cyber') return generateCyber(seed, opts);
    const rng = new Carto.Random(seed);
    const cfg = SIZE[opts.size] || SIZE.village;
    const noise = new Carto.Noise(rng.fork('noise'));
    const c = { x: S / 2 + rng.float(-20, 20), y: S / 2 + rng.float(-20, 20) };
    const water = opts.water || 'stream';

    // Water (the pond is placed once the roads exist).
    let stream = null, pond = null;
    if (water === 'stream') {
      const a = rng.float(0, Math.PI * 2);
      const off = G.scale(G.perp(G.fromAngle(a)), rng.float(35, 90) * rng.sign());
      const a1 = edgePoint(G.add(c, off), a), b1 = edgePoint(G.add(c, off), a + Math.PI + rng.float(-0.3, 0.3));
      stream = { pts: wander(a1, b1, noise, 70, 10, 3.1), w: rng.float(7, 10) };
    }

    // Roads: one through road, branches from near the centre, short lanes.
    const roads = [];
    const a0 = rng.float(0, Math.PI * 2);
    const main = wander(edgePoint(c, a0), edgePoint(c, a0 + Math.PI + rng.float(-0.4, 0.4)), noise, 60, 8, 11.7);
    roads.push({ pts: main, w: 7, kind: 'main' });
    const hub = closestOnLine(main, c).p;
    // The village grows around where the road actually passes.
    c.x = hub.x;
    c.y = hub.y;
    const angles = [a0, a0 + Math.PI];
    for (let i = 0; i < cfg.branches; i++) {
      let ang = null;
      for (let k = 0; k < 20; k++) {
        const cand = rng.float(0, Math.PI * 2);
        if (angles.every((q) => Math.abs(Math.atan2(Math.sin(cand - q), Math.cos(cand - q))) > 0.9)) { ang = cand; break; }
      }
      if (ang === null) break;
      angles.push(ang);
      const start = G.add(hub, G.fromAngle(ang, rng.float(4, 16)));
      const startOn = closestOnLine(main, start).p;
      const pts = wander(startOn, edgePoint(c, ang), noise, 45, 8, 20 + i * 7.3);
      roads.push({ pts, w: 5, kind: 'branch' });
    }
    for (let i = 0; i < cfg.lanes; i++) {
      const base = rng.pick(roads);
      const k = rng.int(2, base.pts.length - 3);
      const p = base.pts[k];
      if (G.dist(p, c) > cfg.R * 0.9) continue;
      const dir = G.norm(G.sub(base.pts[k + 1], base.pts[k - 1]));
      const nd = G.rotate(G.perp(dir), rng.float(-0.4, 0.4) + (rng.bool() ? 0 : Math.PI));
      const end = G.add(p, G.scale(nd, rng.float(30, 60)));
      roads.push({ pts: wander(p, end, noise, 10, 6, 40 + i), w: 3.6, kind: 'lane' });
    }
    const roadDist = (p) => {
      let d = Infinity;
      for (const r of roads) d = Math.min(d, G.distToPolyline(p, r.pts) - r.w / 2);
      return d;
    };
    if (water === 'pond') {
      const pr = rng.fork('pond');
      const rad = pr.float(22, 32);
      for (let k = 0; k < 60 && !pond; k++) {
        const p = G.add(c, G.fromAngle(pr.float(0, Math.PI * 2), pr.float(cfg.R * 0.55, cfg.R * 1.2)));
        if (roadDist(p) > rad + 9 && p.x > rad + 20 && p.y > rad + 20 && p.x < S - rad - 20 && p.y < S - rad - 20) pond = Draw.blob(pr, p.x, p.y, rad, 12, 0.3);
      }
    }
    const waterDist = (p) => {
      let d = Infinity;
      if (stream) d = Math.min(d, G.distToPolyline(p, stream.pts) - stream.w / 2);
      if (pond) d = Math.min(d, G.contains(pond, p) ? -1 : G.distToPolyline(p, pond, true));
      return d;
    };

    // Bridges.
    const bridges = [];
    if (stream) {
      for (const r of roads) {
        for (let i = 0; i < r.pts.length - 1; i++) {
          for (let j = 0; j < stream.pts.length - 1; j++) {
            const hit = G.segmentIntersect(r.pts[i], r.pts[i + 1], stream.pts[j], stream.pts[j + 1]);
            if (hit) bridges.push({ p: { x: hit.x, y: hit.y }, dir: G.norm(G.sub(r.pts[i + 1], r.pts[i])), w: r.w, len: stream.w + 8 });
          }
        }
      }
    }

    // Square and landmarks.
    const square = { x: hub.x, y: hub.y, r: cfg.R > 90 ? rng.float(13, 17) : 11 };
    const houses = [];
    const fits = (poly, margin = 1.6) => {
      for (const p of poly.concat([G.centroid(poly)])) {
        if (roadDist(p) < 1) return false;
        if (waterDist(p) < 3) return false;
        if (G.dist(p, square) < square.r + 1.5) return false;
        if (p.x < 6 || p.y < 6 || p.x > S - 6 || p.y > S - 6) return false;
      }
      for (let i = 0; i < poly.length; i++) {
        const m = G.mid(poly[i], poly[(i + 1) % poly.length]);
        if (roadDist(m) < 1) return false;
      }
      return !houses.some((h) => h.parts.some((q) => G.convexOverlap(q, poly, margin)));
    };
    const br = rng.fork('houses');
    const place = (center, ang, w, d, kind, back = 1) => {
      const box = G.rect(center.x, center.y, w, d, ang);
      if (!fits(box)) return null;
      const h = { poly: box, box, parts: [box], ang, w, d, kind };
      if (kind === 'house' && w > 9 && br.bool(0.3)) {
        // L-shaped house: a wing at one end, on the side away from the road.
        const u = G.fromAngle(ang), v = G.scale(G.perp(u), back);
        const ww = w * br.float(0.35, 0.5), wd = d * br.float(0.5, 0.8), s2 = br.sign();
        const hw = w / 2, hd = d / 2;
        const P = (x, y) => G.add(center, G.add(G.scale(u, x), G.scale(v, y)));
        const wc = P(s2 * (hw - ww / 2), hd + wd / 2);
        const wing = G.rect(wc.x, wc.y, ww, wd, ang);
        if (fits(wing)) {
          h.parts.push(wing);
          h.poly = s2 > 0
            ? [P(-hw, -hd), P(hw, -hd), P(hw, hd + wd), P(hw - ww, hd + wd), P(hw - ww, hd), P(-hw, hd)]
            : [P(-hw, -hd), P(hw, -hd), P(hw, hd), P(-hw + ww, hd), P(-hw + ww, hd + wd), P(-hw, hd + wd)];
        }
      }
      houses.push(h);
      return h;
    };

    // Temple and inn by the square.
    const mainAt = closestOnLine(main, square);
    const mainAng = Math.atan2(mainAt.dir.y, mainAt.dir.x);
    const landmarks = [];
    const nrm = G.perp(mainAt.dir);
    for (const [kind, w, d, side, shift] of [['temple', 18, 11, 1, 0], ['inn', 15, 10, -1, 18]]) {
      for (let k = 0; k < 14; k++) {
        const off = square.r + d / 2 + 2 + k * 2.5;
        const along = (shift + (k % 2 ? 1 : -1) * k * 3);
        const center = G.add(G.add(square, G.scale(nrm, side * off)), G.scale(mainAt.dir, along));
        const h = place(center, mainAng, w, d, kind);
        if (h) { landmarks.push({ key: 'village.' + kind, x: center.x, y: center.y }); break; }
      }
    }

    // Mill on the stream, close to the village.
    let mill = null;
    if (stream) {
      let best = null;
      for (let i = 2; i < stream.pts.length - 2; i++) {
        const p = stream.pts[i];
        const dc = G.dist(p, c);
        if (dc < cfg.R * 0.5 || dc > cfg.R * 1.3 || roadDist(p) < 25) continue;
        if (!best || dc < best.dc) best = { dc, i, p };
      }
      if (best) {
        const dir = G.norm(G.sub(stream.pts[best.i + 1], stream.pts[best.i - 1]));
        const side = G.perp(dir);
        const center = G.add(best.p, G.scale(side, stream.w / 2 + 8));
        const h = place(center, Math.atan2(dir.y, dir.x), 12, 9, 'mill');
        if (h) {
          mill = { x: best.p.x + side.x * (stream.w / 2 - 0.5), y: best.p.y + side.y * (stream.w / 2 - 0.5), ang: Math.atan2(dir.y, dir.x) };
          landmarks.push({ key: 'village.mill', x: center.x, y: center.y + 14 });
        }
      }
    }

    // Houses along the roads, dense near the centre.
    for (const r of roads) {
      const len = G.polylineLength(r.pts);
      for (const side of [-1, 1]) {
        let dpos = br.float(0, 8);
        while (dpos < len) {
          const { p, dir } = G.along(r.pts, dpos);
          const rc = G.dist(p, c);
          const prob = Math.max(0, Math.min(1, 1.55 - rc / cfg.R)) * (r.kind === 'lane' ? 1 : 0.95);
          const w = br.float(8, 13.5), d = br.float(6.5, 9);
          if (br.next() < prob) {
            const off = r.w / 2 + br.float(1, 3.5) + d / 2;
            const center = G.add(p, G.scale(G.perp(dir), side * off));
            const ang = Math.atan2(dir.y, dir.x) + br.float(-0.08, 0.08);
            const h = place(center, ang, w, d, 'house', side);
            if (h && rc < cfg.R * 0.75 && br.bool(0.45)) {
              const back = G.add(center, G.scale(G.perp(dir), side * (d + br.float(3, 7))));
              place(back, ang + br.float(-0.2, 0.2), br.float(6.5, 10), br.float(5.5, 7.5), 'house', side);
            }
          }
          dpos += w + br.float(1.5, 6) + (1 - prob) * 14;
        }
      }
    }

    // Fields: Voronoi parcels outside the village, cut by roads and water.
    const fr = rng.fork('fields');
    const fields = [], woods = [];
    const pts = G.poissonDisc(fr, -40, -40, S + 80, S + 80, 44);
    const { cells } = Carto.Voronoi.voronoi(pts);
    const fnoise = new Carto.Noise(rng.fork('fieldnoise'));
    const cutters = roads.map((r) => ({ pts: r.pts, gap: r.w + 3 }));
    if (stream) cutters.push({ pts: stream.pts, gap: stream.w + 8 });
    const cutPoly = (poly) => {
      let pieces = [poly];
      for (const cut of cutters) {
        const next = [];
        for (const q of pieces) {
          const inside = cut.pts.filter((p) => G.contains(q, p));
          if (inside.length < 1) {
            // A road may still clip a corner of the cell between two samples.
            const cl = closestOnLine(cut.pts, G.centroid(q));
            if (cl.d > Math.sqrt(G.area(q)) * 0.9) { next.push(q); continue; }
            const parts = G.splitConvex(q, cl.p, cl.dir, cut.gap);
            const keep = parts.filter((pp) => G.distToPolyline(G.centroid(pp), cut.pts) > cut.gap / 2);
            next.push(...keep);
            continue;
          }
          const a = inside[0], b = inside[inside.length - 1];
          const dir = G.dist(a, b) > 1 ? G.norm(G.sub(b, a)) : closestOnLine(cut.pts, a).dir;
          next.push(...G.splitConvex(q, G.mid(a, b), dir, cut.gap));
        }
        pieces = next.filter((q) => q.length >= 3 && G.area(q) > 60);
      }
      return pieces;
    };
    for (const cell of cells) {
      if (cell.open || cell.verts.length < 3) continue;
      const poly = G.clockwise(cell.verts.map((v) => ({ x: v.x, y: v.y })));
      const cc = G.centroid(poly);
      if (cc.x < -30 || cc.y < -30 || cc.x > S + 30 || cc.y > S + 30) continue;
      const dc = G.dist(cc, c);
      if (dc < cfg.R * 0.95) continue;
      if (pond && G.contains(pond, cc)) continue;
      const fn = fnoise.fbm(cc.x / 220, cc.y / 220, 3);
      const kind = opts.forest && fn > 0.22 && dc > cfg.R * 1.25 ? 'wood'
        : !opts.fields ? 'meadow' : fr.weighted([['field', 6], ['fieldAlt', 4], ['meadow', 2], ['orchard', dc < cfg.R * 1.7 ? 1.2 : 0]]);
      for (const piece of cutPoly(poly)) {
        const inset = G.insetConvex(piece, 1.6);
        if (inset.length < 3 || G.area(inset) < 80) continue;
        if (houses.some((h) => h.parts.some((q) => G.convexOverlap(q, inset, 2)))) continue;
        if (pond && inset.some((p) => G.contains(pond, p))) continue;
        if (kind === 'wood') { woods.push(inset); continue; }
        const f = G.frame(inset);
        const dir = fr.bool(0.6) ? f.u : f.v;
        fields.push({ poly: inset, kind, furrows: kind === 'field' || kind === 'fieldAlt' ? G.stripes(G.insetConvex(inset, 1), dir, 3.6, fr.next()) : [] });
      }
    }

    // Trees.
    const tr = rng.fork('trees');
    const trees = [];
    const clearOf = (p, r) => roadDist(p) > r + 1 && waterDist(p) > r && !houses.some((h) => G.contains(h.poly, p) || G.distToPolyline(p, h.poly, true) < r + 0.5) && G.dist(p, square) > square.r + r;
    for (const wd of woods) {
      const bb = G.bbox(wd);
      for (const p of G.poissonDisc(tr, bb.x0, bb.y0, bb.w, bb.h, 6.5)) if (G.contains(wd, p) && clearOf(p, 3)) trees.push({ x: p.x, y: p.y, r: tr.float(3.2, 4.8) });
    }
    for (const f of fields) {
      if (f.kind === 'orchard') {
        const fr2 = G.frame(f.poly);
        for (let a = -fr2.w / 2 + 5; a < fr2.w / 2 - 4; a += 9) {
          for (let b = -fr2.h / 2 + 5; b < fr2.h / 2 - 4; b += 9) {
            const p = G.add(fr2.c, G.add(G.scale(fr2.u, a), G.scale(fr2.v, b)));
            if (G.contains(f.poly, p) && G.distToPolyline(p, f.poly, true) > 3) trees.push({ x: p.x, y: p.y, r: 2.6 });
          }
        }
      } else if (f.kind === 'meadow' && tr.bool(0.5)) {
        const bb = G.bbox(f.poly);
        for (const p of G.poissonDisc(tr, bb.x0, bb.y0, bb.w, bb.h, 24)) if (G.contains(f.poly, p) && tr.bool(0.5)) trees.push({ x: p.x, y: p.y, r: tr.float(3, 4.5) });
      }
    }
    // Garden trees among the houses, and trees on the banks.
    for (const p of G.poissonDisc(tr, c.x - cfg.R * 1.1, c.y - cfg.R * 1.1, cfg.R * 2.2, cfg.R * 2.2, 10)) {
      if (G.dist(p, c) > cfg.R * 1.05) continue;
      const nearHouse = houses.some((h) => G.dist(G.centroid(h.box), p) < 22);
      if (!tr.bool(nearHouse ? 0.45 : 0.08)) continue;
      if (clearOf(p, 3.5)) trees.push({ x: p.x, y: p.y, r: tr.float(2.8, 4.2) });
    }
    if (stream) {
      const len = G.polylineLength(stream.pts);
      for (let d = 0; d < len; d += tr.float(7, 16)) {
        const { p, dir } = G.along(stream.pts, d);
        const q = G.add(p, G.scale(G.perp(dir), (stream.w / 2 + 4) * tr.sign()));
        if (tr.bool(0.55) && clearOf(q, 3)) trees.push({ x: q.x, y: q.y, r: tr.float(3, 4.3) });
      }
    }

    const name = opts.name || Carto.Names.place(rng.fork('name'));
    const model = {
      seed, name, size: opts.size, c, roads, stream, pond, bridges, square, houses, mill, fields, woods, trees, landmarks,
      population: Math.round(houses.filter((h) => h.kind === 'house').length * 4.6 / 5) * 5,
    };
    return model;
  }

  function render(m, o) {
    if (Carto.Setting.current === 'modern') return renderModern(m, o);
    if (Carto.Setting.current === 'cyber') return renderCyber(m, o);
    const pal = o.palette;
    const svg = new Svg(S, S);
    const clip = Carto.uid('vclip');
    svg.defs('<clipPath id="' + clip + '"><rect x="0" y="0" width="' + S + '" height="' + S + '"/></clipPath>');
    svg.rect(0, 0, S, S, { fill: pal.paper });
    svg.open({ clipPath: 'url(#' + clip + ')' });
    svg.rect(0, 0, S, S, { fill: pal.green, opacity: 0.28 });

    // Fields and woods.
    const fa = new Svg.Batch(), fb = new Svg.Batch(), fm = new Svg.Batch(), fo = new Svg.Batch(), furrows = new Svg.Batch(), wood = new Svg.Batch();
    for (const f of m.fields) {
      ({ field: fa, fieldAlt: fb, meadow: fm, orchard: fo }[f.kind] || fm).poly(f.poly);
      for (const s of f.furrows) furrows.line(s[0], s[1]);
    }
    for (const w of m.woods) wood.poly(w);
    svg.path(fm.toString(), { fill: pal.green, stroke: pal.fieldInk, strokeWidth: 0.6, opacity: 0.6 });
    svg.path(fo.toString(), { fill: pal.green, stroke: pal.fieldInk, strokeWidth: 0.6, opacity: 0.85 });
    svg.path(fa.toString(), { fill: pal.field, stroke: pal.fieldInk, strokeWidth: 0.6 });
    svg.path(fb.toString(), { fill: pal.fieldAlt, stroke: pal.fieldInk, strokeWidth: 0.6 });
    svg.path(furrows.toString(), { fill: 'none', stroke: pal.fieldInk, strokeWidth: 0.5, opacity: 0.8 });
    svg.path(wood.toString(), { fill: pal.green, opacity: 0.7 });

    // Water.
    if (m.pond) {
      const d = Svg.smooth(m.pond, true);
      svg.path(d, { fill: pal.water, stroke: pal.ink, strokeWidth: 1.1 });
      svg.path(Svg.smooth(G.scalePoly(m.pond, 0.78), true), { fill: 'none', stroke: pal.waterInk, strokeWidth: 0.6, opacity: 0.6 });
    }
    if (m.stream) {
      const d = Svg.smooth(m.stream.pts, false);
      svg.path(d, { fill: 'none', stroke: pal.ink, strokeWidth: m.stream.w + 2, strokeLinecap: 'round', strokeLinejoin: 'round' });
      svg.path(d, { fill: 'none', stroke: pal.water, strokeWidth: m.stream.w, strokeLinecap: 'round', strokeLinejoin: 'round' });
    }

    // Roads: casing, then surface.
    for (const pass of [0, 1]) {
      for (const r of m.roads) {
        svg.path(Svg.smooth(r.pts, false), {
          fill: 'none', stroke: pass ? pal.road : pal.inkSoft, strokeWidth: r.w + (pass ? 0 : 1.6),
          strokeLinecap: 'round', strokeLinejoin: 'round', opacity: pass ? 1 : 0.7,
        });
      }
    }
    svg.circle(m.square.x, m.square.y, m.square.r, { fill: pal.road, stroke: 'none' });
    const bridges = new Svg.Batch();
    for (const b of m.bridges) bridges.poly(G.rect(b.p.x, b.p.y, b.len, b.w + 2, Math.atan2(b.dir.y, b.dir.x)));
    svg.path(bridges.toString(), { fill: pal.road, stroke: pal.ink, strokeWidth: 0.9 });

    // Well.
    svg.circle(m.square.x, m.square.y, 2.6, { fill: pal.water, stroke: pal.ink, strokeWidth: 1 });

    // Mill wheel.
    if (m.mill) {
      const r = G.rect(m.mill.x, m.mill.y, 9, 2.6, m.mill.ang);
      svg.poly(r, { fill: pal.buildingSpecial, stroke: pal.ink, strokeWidth: 0.8 });
    }

    // Houses with roof ridges.
    const hb = new Svg.Batch(), sb = new Svg.Batch(), ridges = new Svg.Batch();
    for (const h of m.houses) {
      (h.kind === 'house' ? hb : sb).poly(h.poly);
      const u = G.fromAngle(h.ang);
      const ctr = G.centroid(h.box);
      const half = (h.w - h.d) / 2 + 0.5;
      if (half > 0.8) ridges.line(G.add(ctr, G.scale(u, -half)), G.add(ctr, G.scale(u, half)));
      if (h.kind === 'temple') {
        // Bell tower at the front end.
        const tw = G.add(ctr, G.scale(u, -h.w / 2 + 2.5));
        sb.poly(G.rect(tw.x, tw.y, 6, 6, h.ang));
      }
    }
    svg.path(hb.toString(), { fill: pal.building, stroke: pal.ink, strokeWidth: 0.8, strokeLinejoin: 'round' });
    svg.path(sb.toString(), { fill: pal.buildingSpecial, stroke: pal.ink, strokeWidth: 1, strokeLinejoin: 'round' });
    svg.path(ridges.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.5, opacity: 0.7 });

    // Trees.
    const crowns = new Svg.Batch();
    const rr = new Carto.Random(m.seed + 21);
    for (const tr of m.trees.slice().sort((a, b) => a.y - b.y)) crowns.smooth(Draw.crown(rr, tr.x, tr.y, tr.r), true);
    svg.path(crowns.toString(), { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.6 });
    svg.close();

    if (!o.preview) {
      const taken = [];
      if (o.labels !== false) {
        Draw.title(svg, S / 2, 40, pal.titleCase === 'upper' ? m.name.toUpperCase() : m.name, 26, pal, t('village.sub.' + (m.size || 'village')));
        taken.push(Draw.textBox(S / 2, 40, m.name, 26, { title: true }), Draw.textBox(S / 2, 62, 'x'.repeat(14), 11, {}));
        const labels = m.landmarks.map((l) => ({ x: l.x, y: l.y + 11, text: t(l.key), size: 10, italic: true }));
        Draw.placeLabels(svg, labels, pal, taken, { x0: 10, y0: 10, x1: S - 10, y1: S - 40 });
      }
      Draw.frame(svg, S, S, pal, 6);
      Draw.compass(svg, S - 36, S - 42, 17, pal);
      Draw.scaleBar(svg, 22, S - 30, 50, 50, 'm', pal);
    } else {
      Draw.label(svg, S / 2, 40, pal.titleCase === 'upper' ? m.name.toUpperCase() : m.name, 30, pal, { title: true, haloWidth: 0.35 });
    }
    return svg.toString();
  }

  // ================================================ present day and cyberpunk
  // Both layouts draw from their own random streams, so fantasy maps never
  // change. One map unit is one metre, as in the fantasy plan.

  // Roads bucketed for distance and crossing queries.
  function roadIndex() {
    const C = 32, cells = new Map();
    const span = (x0, y0, x1, y1, fn) => {
      for (let gy = Math.floor(y0 / C); gy <= Math.floor(y1 / C); gy++) {
        for (let gx = Math.floor(x0 / C); gx <= Math.floor(x1 / C); gx++) {
          const l = cells.get((gx + 512) * 2048 + gy + 512);
          if (l) fn(l);
        }
      }
    };
    return {
      add(road) {
        const hw = road.w / 2, pts = road.pts.length > 1 ? road.pts : [road.pts[0], road.pts[0]];
        for (let i = 0; i < pts.length - 1; i++) {
          const s = { a: pts[i], b: pts[i + 1], hw, road };
          const x0 = Math.floor((Math.min(s.a.x, s.b.x) - hw) / C), x1 = Math.floor((Math.max(s.a.x, s.b.x) + hw) / C);
          const y0 = Math.floor((Math.min(s.a.y, s.b.y) - hw) / C), y1 = Math.floor((Math.max(s.a.y, s.b.y) + hw) / C);
          for (let gy = y0; gy <= y1; gy++) {
            for (let gx = x0; gx <= x1; gx++) {
              const k = (gx + 512) * 2048 + gy + 512;
              let l = cells.get(k);
              if (!l) cells.set(k, (l = []));
              l.push(s);
            }
          }
        }
      },
      // Distance from p to the nearest road edge (negative on the road), capped at `far`.
      dist(p, skip = null, far = 40) {
        let d = far;
        span(p.x - far, p.y - far, p.x + far, p.y + far, (l) => {
          for (const s of l) if (!skip || !skip.has(s.road)) d = Math.min(d, G.distToSegment(p, s.a, s.b) - s.hw);
        });
        return d;
      },
      // Nearest point on a road accepted by `ok`: { d, q, dir, road }.
      nearest(p, far, ok) {
        let best = null;
        span(p.x - far, p.y - far, p.x + far, p.y + far, (l) => {
          for (const s of l) {
            if (ok && !ok(s.road)) continue;
            const ab = G.sub(s.b, s.a), l2 = G.dot(ab, ab) || 1;
            const tt = Math.max(0, Math.min(1, G.dot(G.sub(p, s.a), ab) / l2));
            const q = G.add(s.a, G.scale(ab, tt)), d = G.dist(p, q);
            if (d < far && (!best || d < best.d)) best = { d, q, dir: G.norm(ab), road: s.road };
          }
        });
        return best;
      },
      // First crossing of the segment a-b with a road, by distance from a.
      hit(a, b, skip = null) {
        let best = null;
        span(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.x, b.x), Math.max(a.y, b.y), (l) => {
          for (const s of l) {
            if (skip && skip.has(s.road)) continue;
            const h = G.segmentIntersect(a, b, s.a, s.b);
            if (h && (!best || h.t < best.t)) best = { x: h.x, y: h.y, t: h.t, road: s.road, dir: G.norm(G.sub(s.b, s.a)) };
          }
        });
        return best;
      },
    };
  }

  // Convex shapes bucketed for overlap tests.
  function shapeIndex() {
    const C = 24, cells = new Map();
    const each = (bb, fn) => {
      for (let gy = Math.floor(bb.y0 / C); gy <= Math.floor(bb.y1 / C); gy++) {
        for (let gx = Math.floor(bb.x0 / C); gx <= Math.floor(bb.x1 / C); gx++) fn((gx + 512) * 2048 + gy + 512);
      }
    };
    return {
      add(poly) {
        const it = { poly, bb: G.bbox(poly) };
        each(it.bb, (k) => {
          let l = cells.get(k);
          if (!l) cells.set(k, (l = []));
          l.push(it);
        });
      },
      // Does `poly` come closer than `margin` to a stored shape?
      hits(poly, margin = 0) {
        const bb = G.bbox(poly), m = Math.max(0, margin);
        const q = { x0: bb.x0 - m, y0: bb.y0 - m, x1: bb.x1 + m, y1: bb.y1 + m };
        let hit = false;
        each(q, (k) => {
          if (hit) return;
          const l = cells.get(k);
          if (!l) return;
          for (const it of l) {
            if (it.bb.x0 > q.x1 || it.bb.x1 < q.x0 || it.bb.y0 > q.y1 || it.bb.y1 < q.y0) continue;
            if (G.convexOverlap(it.poly, poly, margin)) { hit = true; return; }
          }
        });
        return hit;
      },
    };
  }

  // Keeps landmarks off the title, the compass and the scale bar.
  const decorFree = (p, r = 0) => !((p.y < 88 + r && Math.abs(p.x - S / 2) < 120 + r) || (p.x > S - 72 - r && p.y > S - 82 - r) || (p.x < 150 + r && p.y > S - 50 - r));

  // A line from a to b bent sideways by noise; both ends stay put.
  function bendLine(a, b, noise, amp, step, salt) {
    const n = Math.max(2, Math.round(G.dist(a, b) / step));
    const nrm = G.perp(G.norm(G.sub(b, a)));
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const tt = i / n;
      pts.push(G.add(G.lerp(a, b, tt), G.scale(nrm, noise.fbm(tt * 1.6 + salt, salt * 0.37, 2) * amp * Math.sin(Math.PI * tt))));
    }
    return G.chaikin(pts, 2, false);
  }

  // Points along the outline of a polygon, every `step` units.
  function outlineSamples(poly, step) {
    const out = [G.centroid(poly)];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const k = Math.max(1, Math.ceil(G.dist(a, b) / step));
      for (let j = 0; j < k; j++) out.push(G.lerp(a, b, j / k));
    }
    return out;
  }

  // Cut a convex polygon by lines (roads, water), leaving a gap along each.
  function cutPieces(poly, cutters) {
    let pieces = [poly];
    for (const cut of cutters) {
      const next = [];
      for (const q of pieces) {
        const inside = cut.pts.filter((p) => G.contains(q, p));
        if (inside.length < 1) {
          const cl = closestOnLine(cut.pts, G.centroid(q));
          if (cl.d > Math.sqrt(G.area(q)) * 0.9) { next.push(q); continue; }
          const parts = G.splitConvex(q, cl.p, cl.dir, cut.gap);
          next.push(...parts.filter((pp) => G.distToPolyline(G.centroid(pp), cut.pts) > cut.gap / 2));
          continue;
        }
        const a = inside[0], b = inside[inside.length - 1];
        const dir = G.dist(a, b) > 1 ? G.norm(G.sub(b, a)) : closestOnLine(cut.pts, a).dir;
        next.push(...G.splitConvex(q, G.mid(a, b), dir, cut.gap));
      }
      pieces = next.filter((q) => q.length >= 3 && G.area(q) > 60);
    }
    return pieces;
  }

  // ---------------------------------------------------------------- present day

  const MSIZE = {
    hamlet: { R: 92, streets: 3, levels: 1, cross: 0, farms: 2, square: [22, 15] },
    village: { R: 128, streets: 7, levels: 2, cross: 1, farms: 2, square: [32, 21] },
    large: { R: 178, streets: 14, levels: 2, cross: 2, farms: 3, square: [40, 26] },
  };

  /* A village or small town today: a provincial road through the middle with
     the piazza, church, town hall and bar; straight side streets (some ending
     in a turning circle) lined with fenced lots, detached houses set back in
     their gardens and a few apartment blocks near the centre; around it,
     rectangular fields, vineyards, orchards and farmsteads. */
  function generateModern(seed, opts) {
    const rng = new Carto.Random(seed);
    const R = rng.fork('modern');
    const cfg = MSIZE[opts.size] || MSIZE.village;
    const noise = new Carto.Noise(R.fork('noise'));
    const water = opts.water || 'stream';
    const c = { x: S / 2 + R.float(-25, 25), y: S / 2 + R.float(-25, 25) };
    const roads = [], ri = roadIndex(), si = shapeIndex(), wi = roadIndex();
    const addRoad = (r) => { roads.push(r); ri.add(r); return r; };
    const inSheet = (p, m = 0) => p.x > m && p.y > m && p.x < S - m && p.y < S - m;
    const houses = [], landmarks = [];

    // The stream meanders past the centre, across the main road; the pond comes
    // once the streets exist.
    const a0 = R.float(0, Math.PI * 2);
    let stream = null, pond = null;
    if (water === 'stream') {
      const a = a0 + Math.PI / 2 + R.float(-0.6, 0.6);
      const off = G.scale(G.perp(G.fromAngle(a)), (cfg.R * R.float(0.55, 1.05) + 15) * R.sign());
      stream = { pts: wander(edgePoint(G.add(c, off), a), edgePoint(G.add(c, off), a + Math.PI + R.float(-0.3, 0.3)), noise, 60, 10, 3.1), w: R.float(7, 10) };
      wi.add(stream);
    }
    const waterDist = (p) => {
      let d = stream ? wi.dist(p) : Infinity;
      if (pond) d = Math.min(d, G.contains(pond, p) ? -1 : G.distToPolyline(p, pond, true));
      return d;
    };

    // Provincial road through the centre, and the crossing road.
    const main = addRoad({ pts: wander(edgePoint(c, a0), edgePoint(c, a0 + Math.PI + R.float(-0.3, 0.3)), noise, 35, 12, 11.7), w: 8, kind: 'main', n: R.int(10, 320) });
    const hubAt = closestOnLine(main.pts, c);
    const hub = hubAt.p, u = hubAt.dir, n = G.perp(u), uAng = Math.atan2(u.y, u.x);
    c.x = hub.x;
    c.y = hub.y;
    const crossSide = R.sign(), cross = [];
    for (let i = 0; i < cfg.cross; i++) {
      const side = i ? -crossSide : crossSide;
      const ang = Math.atan2(n.y, n.x) + (side < 0 ? Math.PI : 0) + R.float(-0.25, 0.25);
      cross.push(addRoad({ pts: bendLine(hub, edgePoint(c, ang), noise, 30, 12, 30 + i * 5.3), w: 7, kind: 'road', n: R.int(10, 320) }));
    }

    // Shapes and buildings.
    const fits = (poly, gap = 1, margin = 1, step = 4) => {
      for (const p of outlineSamples(poly, step)) if (ri.dist(p) < gap || waterDist(p) < 4 || !inSheet(p, -20)) return false;
      for (let i = 0; i < poly.length; i++) if (ri.hit(poly[i], poly[(i + 1) % poly.length])) return false;
      return !si.hits(poly, margin);
    };
    const build = (kind, ctr, w, d, ang, o = {}) => {
      const box = G.rect(ctr.x, ctr.y, w, d, ang);
      if (!o.free && !fits(box, o.gap === undefined ? 1 : o.gap, 1)) return null;
      const h = { kind, poly: box, box, parts: [box], ang, w, d };
      if (o.ground) h.ground = true;
      houses.push(h);
      if (!o.free) si.add(box);
      if (o.label) landmarks.push({ key: 'village.' + o.label, x: ctr.x, y: ctr.y + (o.dy || 0) });
      return h;
    };
    const first = (cands, fn) => { for (const p of cands) { const h = fn(p); if (h) return h; } return null; };

    // The piazza by the road, the church facing it, the town hall and the bar.
    // It takes the first corner of the crossroads left free by the roads.
    const side0 = cfg.cross === 1 ? -crossSide : R.sign(), al0 = R.sign();
    let sw = cfg.square[0], sd = cfg.square[1], sqSide = side0, sqAlong = 0, sqC = null;
    const mainOnly = new Set([main]);
    for (const k of [1, 0.75]) {
      for (const side of [side0, -side0]) {
        for (const al of [0, 8, 14, 20, 28]) {
          for (const sg of al ? [al0, -al0] : [1]) {
            const w2 = cfg.square[0] * k, d2 = cfg.square[1] * k, along = al ? sg * (w2 / 2 + al) : 0;
            const ctr = G.add(hub, G.add(G.scale(u, along), G.scale(n, side * (main.w / 2 + 0.6 + d2 / 2))));
            const poly = G.rect(ctr.x, ctr.y, w2, d2, uAng);
            if (sqC || !outlineSamples(poly, 3).every((p) => ri.dist(p, mainOnly) > 2 && ri.dist(p) > 0.3 && waterDist(p) > 4)) continue;
            [sw, sd, sqSide, sqAlong, sqC] = [w2, d2, side, along, ctr];
          }
        }
      }
    }
    if (!sqC) sqC = G.add(hub, G.scale(n, sqSide * (main.w / 2 + 0.6 + sd / 2)));
    const square = { x: sqC.x, y: sqC.y, poly: G.rect(sqC.x, sqC.y, sw, sd, uAng), ang: uAng };
    si.add(square.poly);
    const At = (base, x, y) => G.add(base, G.add(G.scale(u, x), G.scale(n, sqSide * y)));
    const [cw, cd] = cfg.R < 100 ? [18, 10] : [25, 12];
    const church = first([0, 8, -8, 14, -14, 20, -20], (x) => build('temple', At(sqC, x, sd / 2 + 2 + cw / 2), cw, cd, Math.atan2(n.y, n.x), { label: 'temple' }));
    if (church) church.tower = R.sign();
    // Town hall and bar front the main road, following its bends.
    const hubS = G.polylineLength(main.pts.slice(0, hubAt.i + 1)) + G.dist(main.pts[hubAt.i], hub);
    const onMain = (kind, ds, side, w, d) => {
      const at = G.along(main.pts, hubS + ds);
      for (const back of [2.5, 5]) {
        const h = build(kind, G.add(at.p, G.scale(G.perp(at.dir), side * (main.w / 2 + back + d / 2))), w, d, Math.atan2(at.dir.y, at.dir.x), { label: kind });
        if (h) return h;
      }
      return null;
    };
    const sgn = sqAlong ? Math.sign(sqAlong) : R.sign();
    first([0, 1, 2, 3, 4, 5].map((k) => sqAlong + sgn * (sw / 2 + 9 + k * 6)).concat([0, 1, 2, 3].map((k) => sqAlong - sgn * (sw / 2 + 9 + k * 6))), (x) => onMain('townhall', x, sqSide, 14, 11));
    first([0, 10, -10, 16, -16, 22, -22, 28, -28, 36, -36].map((x) => sqAlong + x), (x) => onMain('inn', x, -sqSide, 12, 9));

    // Side streets, fairly straight, off the main roads and then off each other.
    const GAP = 56;
    const streets = [], junctions = [hub];
    const grow = (parent) => {
      // Somewhere along the stretch of the parent inside the built-up area.
      const span = parent.span || (parent.span = (() => {
        let lo = Infinity, hi = -Infinity, acc = 0;
        for (let i = 0; i < parent.pts.length; i++) {
          if (i) acc += G.dist(parent.pts[i - 1], parent.pts[i]);
          if (G.dist(parent.pts[i], c) < cfg.R * 0.9) { lo = Math.min(lo, acc); hi = Math.max(hi, acc); }
        }
        return hi > lo ? [lo, hi] : [0, 0];
      })());
      if (span[1] <= span[0]) return null;
      const at = G.along(parent.pts, R.float(span[0], span[1]));
      const p0 = at.p;
      if (G.dist(p0, c) > cfg.R * 0.9 || !inSheet(p0, 30) || waterDist(p0) < 20) return null;
      if (junctions.some((j) => G.dist(j, p0) < 16)) return null;
      let ang = Math.atan2(at.dir.y, at.dir.x) + R.sign() * Math.PI / 2 + R.float(-0.18, 0.18);
      const want = cfg.R * R.float(0.45, 0.95) + 25;
      const bend = R.bool(0.35) ? R.float(-0.4, 0.4) / want : 0;
      const street = { pts: [p0], w: 6, kind: 'street' };
      const skip = new Set([parent, street]);
      let q = p0, len = 0, join = false;
      while (len < want) {
        ang += bend * 6;
        const nq = G.add(q, G.fromAngle(ang, 6));
        // Streets meet others square-on; a glancing meeting ends the street instead.
        const square = (h) => Math.abs(G.cross(h.dir, G.fromAngle(ang))) > 0.6;
        const h = ri.hit(q, nq, skip);
        if (h) {
          if (square(h)) { street.pts.push({ x: h.x, y: h.y }); join = true; }
          break;
        }
        if (!inSheet(nq, 14) || waterDist(nq) < 10 || si.hits(G.rect(nq.x, nq.y, 8, 8, ang), 1.5)) break;
        if (len > 10 && ri.dist(nq, skip, GAP) < GAP - 6) {
          // Too close to another road for two rows of lots: meet it if it lies ahead, else stop.
          const h2 = ri.hit(nq, G.add(nq, G.fromAngle(ang, GAP * 1.3)), skip);
          if (h2 && square(h2)) { street.pts.push(nq, { x: h2.x, y: h2.y }); join = true; }
          break;
        }
        street.pts.push(nq);
        q = nq;
        len += 6;
      }
      const L = G.polylineLength(street.pts);
      if (street.pts.length < 2 || L < (join ? 28 : 40)) return null;
      addRoad(street);
      streets.push(street);
      const e = street.pts[street.pts.length - 1];
      junctions.push(p0);
      if (join) { junctions.push(e); return street; }
      // A dead end: a turning circle, or a farm track on into the fields.
      const dir = G.norm(G.sub(e, street.pts[street.pts.length - 2]));
      if (L > 50 && R.bool(0.55) && ri.dist(e, new Set([street])) > 12 && !si.hits(G.rect(e.x, e.y, 16, 16, ang), 1)) {
        addRoad({ pts: [e], w: 15, kind: 'cul' });
      } else if (R.bool(0.6)) {
        const tr = { pts: [e], w: 3, kind: 'track' };
        let tq = e, ta = Math.atan2(dir.y, dir.x);
        const tl = R.float(50, 160);
        for (let d = 0; d < tl; d += 8) {
          ta += R.float(-0.08, 0.08);
          const nq = G.add(tq, G.fromAngle(ta, 8));
          if (!inSheet(nq, -10) || waterDist(nq) < 6 || si.hits(G.rect(nq.x, nq.y, 4, 4, ta), 1)) break;
          const h = ri.hit(tq, nq, new Set([street]));
          if (h) { tr.pts.push({ x: h.x, y: h.y }); break; }
          tr.pts.push(nq);
          tq = nq;
        }
        if (tr.pts.length > 2) addRoad(tr);
      }
      return street;
    };
    const quota1 = cfg.levels > 1 ? Math.ceil(cfg.streets * 0.6) : cfg.streets;
    for (let k = 0; k < cfg.streets * 14 && streets.length < quota1; k++) grow(R.pick([main, main].concat(cross)));
    const lvl1 = streets.slice();
    if (cfg.levels > 1 && lvl1.length) for (let k = 0; k < cfg.streets * 14 && streets.length < cfg.streets; k++) grow(R.pick(lvl1));

    // The pond, out by the fields.
    if (water === 'pond') {
      for (let k = 0; k < 120 && !pond; k++) {
        const rad = R.float(15, 24);
        const p = G.add(c, G.fromAngle(R.float(0, Math.PI * 2), cfg.R * R.float(0.75, 1.5)));
        if (!inSheet(p, rad + 22) || !decorFree(p, rad) || ri.dist(p, null, 60) < rad + 12 || si.hits(G.regular(p.x, p.y, rad * 1.25, 10), 4)) continue;
        pond = Draw.blob(R, p.x, p.y, rad, 12, 0.3);
        si.add(G.regular(p.x, p.y, rad * 1.2, 10));
      }
    }

    // Bus stop, petrol station and sports ground.
    const mlen = G.polylineLength(main.pts);
    first(R.shuffle([28, -28, 36, -36, 44, -44, 52, -52, 60, -60, 70, -70]), (ds) => {
      const at = G.along(main.pts, hubS + ds), side = R.sign();
      const ctr = G.add(at.p, G.scale(G.perp(at.dir), side * (main.w / 2 + 1.6)));
      const h = build('bus', ctr, 5, 1.8, Math.atan2(at.dir.y, at.dir.x), { gap: 0.3, label: 'bus' });
      if (h) h.side = side;
      return h;
    });
    const fuelAt = [];
    for (let k = 0; k < 48; k++) fuelAt.push(mlen * (k + 0.5) / 48);
    // Preferably where the houses thin out, else anywhere along the road.
    const outskirts = (s) => { const p = G.along(main.pts, s).p, dc = G.dist(p, c); return (dc < cfg.R * 0.75 || dc > cfg.R * 1.2 + 25 ? 1 : 0) + (decorFree(p, 25) ? 0 : 2); };
    first(R.shuffle(fuelAt).sort((a, b) => outskirts(a) - outskirts(b)), (s) => {
      const at = G.along(main.pts, s);
      if (!inSheet(at.p, 40) || G.dist(at.p, c) < cfg.R * 0.4) return null;
      const side = R.sign();
      const ctr = G.add(at.p, G.scale(G.perp(at.dir), side * (main.w / 2 + 0.6 + 10)));
      const h = build('fuel', ctr, 30, 20, Math.atan2(at.dir.y, at.dir.x), { gap: 0.4, ground: true, label: 'fuel' });
      if (h) h.side = side;
      return h;
    });
    const [pw, pd] = cfg.R < 100 ? [56, 38] : [72, 48];
    for (let k = 0; k < 200; k++) {
      const p = G.add(c, G.fromAngle(R.float(0, Math.PI * 2), cfg.R * R.float(0.55, 1.3)));
      // Back from the provincial road, where it would take the frontage of the houses.
      if (!inSheet(p, 40) || !decorFree(p, pw / 2) || ri.dist(p, null, 80) > pd / 2 + 30 || (k < 120 && ri.dist(p, new Set(roads.filter((r) => r !== main)), 80) < pd / 2 + 32)) continue;
      const ang = uAng + (R.bool() ? 0 : Math.PI / 2) + R.float(-0.12, 0.12);
      const h = build('pitch', p, pw, pd, ang, { gap: 3, ground: true, label: 'pitch', dy: -pd * 0.3 });
      if (h) {
        // The changing rooms go on the side nearest the road.
        const near = ri.nearest(p, 120);
        const v = G.perp(G.fromAngle(ang));
        h.club = near && G.dot(G.sub(near.q, p), v) < 0 ? -1 : 1;
        break;
      }
    }

    // The old mill on the stream, out of the centre.
    if (stream) {
      let best = null;
      for (let i = 2; i < stream.pts.length - 2; i++) {
        const p = stream.pts[i], dc = G.dist(p, c);
        if (dc < cfg.R * 0.6 || dc > cfg.R * 1.4 || !inSheet(p, 30) || ri.dist(p) < 20) continue;
        if (!best || dc < best.dc) best = { dc, i, p };
      }
      if (best) {
        const dir = G.norm(G.sub(stream.pts[best.i + 1], stream.pts[best.i - 1]));
        build('mill', G.add(best.p, G.scale(G.perp(dir), stream.w / 2 + 7.5)), 14, 10, Math.atan2(dir.y, dir.x), { label: 'mill', dy: 4 });
      }
    }

    // Lots along the streets: old terraced houses at the very centre, a few
    // apartment blocks around it, then detached houses in their gardens.
    const lots = [];
    const lotFits = (poly) => fits(poly, 0.5, -0.3, 4);
    const fillLot = (lot, front, ud, v, f, dd, kind) => {
      const L = (x, y) => G.add(front, G.add(G.scale(ud, x), G.scale(v, y)));
      const ang = Math.atan2(ud.y, ud.x);
      lot.trees = [];
      if (kind === 'row') {
        const bd = Math.min(dd - 4, R.float(9, 13));
        build('house', L(0, bd / 2), f, bd, ang, { free: true }).row = true;
        lot.kind = 'court';
        return;
      }
      if (kind === 'block') {
        const bw = f - R.float(3, 5), bd = Math.min(dd - 9, R.float(11, 14)), sb = R.float(3, 5);
        const xo = R.float(-1, 1) * (f - bw) / 2 * 0.6;
        build('block', L(xo, sb + bd / 2), bw, bd, ang, { free: true });
        lot.kind = 'yard';
        // Parking behind, reached by a drive along one side.
        const pk = L(0, (sb + bd + dd) / 2), dr = L(xo > 0 ? -f / 2 + 2.2 : f / 2 - 2.2, (sb + bd + 1) / 2);
        lot.parking = G.rect(pk.x, pk.y, f - 3, dd - sb - bd - 2.5, ang);
        lot.drive = G.rect(dr.x, dr.y, 3, sb + bd + 1, ang);
        return;
      }
      lot.kind = 'garden';
      const hw = Math.min(f - 5.5, R.float(9, 13.5)), hd = R.float(8, 10.5), sb = Math.min(dd - hd - 2, R.float(4, 7));
      const xo = R.sign() * Math.max(0, (f - hw) / 2 - 1.2) * R.float(0.3, 1);
      const hc = L(xo, sb + hd / 2);
      const h = build('house', hc, hw, hd, ang, { free: true });
      let back = sb + hd;
      if (hw > 10 && R.bool(0.32)) {
        // L-shaped house: a wing at the back, on one side.
        const ww = hw * R.float(0.4, 0.55), wd = hd * R.float(0.5, 0.8), s2 = R.sign();
        if (sb + hd + wd < dd - 4) {
          const P = (x, y) => L(xo + x, sb + hd / 2 + y);
          const wc = P(s2 * (hw / 2 - ww / 2), hd / 2 + wd / 2);
          h.parts.push(G.rect(wc.x, wc.y, ww, wd, ang));
          const hw2 = hw / 2, hd2 = hd / 2;
          h.poly = s2 > 0
            ? [P(-hw2, -hd2), P(hw2, -hd2), P(hw2, hd2 + wd), P(hw2 - ww, hd2 + wd), P(hw2 - ww, hd2), P(-hw2, hd2)]
            : [P(-hw2, -hd2), P(hw2, -hd2), P(hw2, hd2), P(-hw2 + ww, hd2), P(-hw2 + ww, hd2 + wd), P(-hw2, hd2 + wd)];
          back += wd;
        }
      }
      // Driveway beside the house when there is room, else up to its door.
      const gs = xo > 0 ? -1 : 1;
      const room = f / 2 - Math.abs(xo) - hw / 2;
      if (room > 4) {
        const dx = xo + gs * (hw / 2 + 2.1), dl = sb + hd * 0.75;
        const dc = L(dx, dl / 2);
        lot.drive = G.rect(dc.x, dc.y, 3, dl, ang);
      } else {
        const dc = L(xo + R.float(-0.25, 0.25) * hw, sb / 2);
        lot.drive = G.rect(dc.x, dc.y, 2.6, sb, ang);
      }
      const yard = dd - back;
      if (yard > 10 && R.bool(0.14)) {
        const pc = L(R.float(-1, 1) * (f / 2 - 5), back + 3 + R.float(1.7, yard - 5.7));
        lot.pool = G.rect(pc.x, pc.y, 7, 3.4, ang);
      } else if (yard > 6 && R.bool(0.25)) {
        const sc = L(R.sign() * (f / 2 - 2.4), dd - 2.3);
        build('shed', sc, 3.2, 2.6, ang, { free: true });
      }
      // Garden trees: in the back garden and by the front fence.
      const nt = R.int(0, 3);
      for (let i = 0; i < nt; i++) {
        const y = yard > 7 ? R.float(back + 3, dd - 3) : R.float(1.8, Math.max(2, sb - 1.8));
        const x = yard > 7 ? R.float(-f / 2 + 3, f / 2 - 3) : (room > 4 ? -gs : gs) * (f / 2 - 2.6);
        const p = L(x, y);
        if (lot.pool && G.distToPolyline(p, lot.pool, true) < 3) continue;
        lot.trees.push({ x: p.x, y: p.y, r: R.float(2.4, 3.6) });
      }
    };
    for (const r of [main].concat(cross, streets)) {
      const len = G.polylineLength(r.pts);
      const central = r.kind !== 'street';
      for (const side of [-1, 1]) {
        let s = R.float(0, 5);
        while (s < len - 4) {
          const f = R.float(15, 22);
          const mid = G.along(r.pts, s + f / 2);
          const core = G.dist(mid.p, c) / cfg.R;
          const prob = central ? (core < 1 ? 0.97 : core < 1.6 ? 0.1 : 0.02) : core < 1.2 ? 0.96 : 0.35;
          if (!R.bool(prob)) { s += f; continue; }
          const v = G.scale(G.perp(mid.dir), side);
          const kind = core < 0.3 && central ? R.weighted([['row', 5], ['block', 3], ['house', 1]])
            : core < 0.5 && central ? R.weighted([['block', 2], ['house', 3]]) : core < 0.45 ? R.weighted([['block', 1], ['house', 4]]) : 'house';
          let done = false;
          for (const dd of [kind === 'row' ? R.float(16, 22) : R.float(24, 32), 17]) {
            const front = G.add(mid.p, G.scale(v, r.w / 2 + 1.6));
            const ctr = G.add(front, G.scale(v, dd / 2));
            const poly = G.rect(ctr.x, ctr.y, f, dd, Math.atan2(mid.dir.y, mid.dir.x));
            if (!lotFits(poly)) continue;
            const lot = { poly };
            fillLot(lot, front, mid.dir, v, f, dd, dd < 18 && kind === 'block' ? 'house' : kind);
            lots.push(lot);
            si.add(poly);
            done = true;
            break;
          }
          s += done ? f : 4;
        }
      }
    }

    // Farmsteads out in the fields, each with its track to the nearest road.
    const farms = [];
    for (let k = 0; k < 300 && farms.length < cfg.farms; k++) {
      const p = G.add(c, G.fromAngle(R.float(0, Math.PI * 2), cfg.R * R.float(1.15, 2.2)));
      if (!inSheet(p, 34) || !decorFree(p, 28)) continue;
      const near = ri.nearest(p, 110, (r) => r.kind === 'main' || r.kind === 'road' || r.kind === 'street');
      if (!near || near.d < 30 || near.d > 105) continue;
      const v = G.norm(G.sub(p, near.q)), ud = G.perp(v), ang = Math.atan2(ud.y, ud.x);
      const yard = G.rect(p.x, p.y, 44, 32, ang);
      if (!fits(yard, 5, 6)) continue;
      const gate = G.add(p, G.scale(v, -16));
      const start = G.add(near.q, G.scale(v, near.road.w / 2 - 0.5));
      const lane = G.rect(G.mid(start, gate).x, G.mid(start, gate).y, G.dist(start, gate), 4, Math.atan2(v.y, v.x));
      if (si.hits(lane, 1.5) || ri.hit(G.add(start, G.scale(v, 2)), gate) || (stream && wi.hit(start, gate)) || (pond && G.distToPolyline(G.mid(start, gate), pond, true) < 8)) continue;
      si.add(yard);
      addRoad({ pts: [near.q, gate], w: 3, kind: 'track' });
      const flip = R.sign();
      const F = (x, y) => G.add(p, G.add(G.scale(ud, x * flip), G.scale(v, y)));
      build('farm', F(-12, -7), 12, 10, ang, { free: true });
      build('barn', F(7, 6.5), 25, 12, ang, { free: true });
      build('shed', F(-12, 9), 11, 7, ang, { free: true });
      const silo = F(16, -9);
      farms.push({ poly: yard, silo: { x: silo.x, y: silo.y, r: 3.2 } });
      landmarks.push({ key: 'village.farm', params: { n: Carto.Names.person(R).split(' ').pop() }, x: p.x, y: p.y + 22 });
    }

    // Fields: blocks of strips in the frame of the main road, cut by roads and water.
    const fr = R.fork('fields');
    const fields = [], woods = [];
    const cutters = roads.filter((r) => r.kind !== 'cul').map((r) => ({ pts: r.pts, gap: r.w + 3 }));
    if (stream) cutters.push({ pts: stream.pts, gap: stream.w + 8 });
    const loc = [{ x: 0, y: 0 }, { x: S, y: 0 }, { x: S, y: S }, { x: 0, y: S }].map((p) => ({ a: G.dot(G.sub(p, c), u), b: G.dot(G.sub(p, c), n) }));
    const A0 = Math.min(...loc.map((q) => q.a)) - 10, A1 = Math.max(...loc.map((q) => q.a)) + 10;
    const B0 = Math.min(...loc.map((q) => q.b)) - 10, B1 = Math.max(...loc.map((q) => q.b)) + 10;
    const W = (a, b) => G.add(c, G.add(G.scale(u, a), G.scale(n, b)));
    const strip = (a, b, w, h) => {
      const poly = [W(a, b), W(a + w, b), W(a + w, b + h), W(a, b + h)];
      const cc = W(a + w / 2, b + h / 2), dc = G.dist(cc, c);
      if (!inSheet(cc, -Math.max(w, h) / 2)) return;
      const fn = noise.fbm(cc.x / 200 + 7.3, cc.y / 200, 3);
      const kind = opts.forest && fn > 0.16 && dc > cfg.R * 1.1 ? 'wood'
        : !opts.fields ? 'meadow'
          : fr.weighted([['field', 6], ['fieldAlt', 4], ['meadow', 2], ['vineyard', dc < cfg.R * 2 ? 1.6 : 0.6], ['orchard', 1]]);
      const long = w > h ? u : n;
      const pieces = [];
      for (const piece of cutPieces(G.insetConvex(G.clockwise(poly), 1.4), cutters)) {
        if (!si.hits(piece, 1.5)) { pieces.push(piece); continue; }
        // Land left between the lots becomes small plots and paddocks.
        const f = G.frame(piece), nu = Math.max(1, Math.round(f.w / 26)), nv = Math.max(1, Math.round(f.h / 22));
        for (let i = 0; i < nu; i++) {
          for (let j = 0; j < nv; j++) {
            const q = G.add(f.c, G.add(G.scale(f.u, (i + 0.5) / nu * f.w - f.w / 2), G.scale(f.v, (j + 0.5) / nv * f.h - f.h / 2)));
            const cell = G.clipConvex(G.rect(q.x, q.y, f.w / nu - 1.4, f.h / nv - 1.4, Math.atan2(f.u.y, f.u.x)), piece);
            if (cell.length >= 3 && G.area(cell) > 110 && !si.hits(cell, 1.5)) pieces.push(cell);
          }
        }
      }
      for (const piece of pieces) {
        if (G.area(piece) < 110) continue;
        if (piece.some((p) => ri.dist(p) < 0.5)) continue;
        if (pond && (piece.some((p) => G.contains(pond, p)) || pond.some((p) => G.contains(piece, p)))) continue;
        if (kind === 'wood') { woods.push(piece); continue; }
        const dir = kind === 'fieldAlt' ? G.perp(long) : long;
        fields.push({
          poly: piece, kind,
          furrows: kind === 'field' || kind === 'fieldAlt' ? G.stripes(G.insetConvex(piece, 1), dir, 3.6, fr.next())
            : kind === 'vineyard' ? G.stripes(G.insetConvex(piece, 1.5), long, 2.6, fr.next()) : [],
        });
      }
    };
    for (let b = B0; b < B1;) {
      const bh = fr.float(70, 120);
      for (let a = A0; a < A1;) {
        const aw = fr.float(80, 150);
        // Each block is split into parallel strips, the way farmland is parcelled.
        const along = fr.bool(), k = fr.int(1, 4);
        const ws = [];
        for (let i = 0; i < k; i++) ws.push(fr.float(0.6, 1.4));
        const tot = ws.reduce((x, y) => x + y, 0);
        let o = 0;
        for (const wgt of ws) {
          const sz = (along ? aw : bh) * wgt / tot;
          if (along) strip(a + o, b, sz, bh); else strip(a, b + o, aw, sz);
          o += sz;
        }
        a += aw;
      }
      b += bh;
    }

    // Trees: woods, orchards, gardens, the banks of the stream.
    const tr = R.fork('trees');
    const trees = [];
    const clearOf = (p, r) => ri.dist(p) > r + 0.5 && waterDist(p) > r && !si.hits(G.rect(p.x, p.y, r * 1.4, r * 1.4, 0), 0);
    for (const wd of woods) {
      const bb = G.bbox(wd);
      for (const p of G.poissonDisc(tr, bb.x0, bb.y0, bb.w, bb.h, 6.5)) if (G.contains(wd, p) && G.distToPolyline(p, wd, true) > 1.5) trees.push({ x: p.x, y: p.y, r: tr.float(3.2, 4.8) });
    }
    for (const f of fields) {
      if (f.kind === 'orchard') {
        const fr2 = G.frame(f.poly);
        for (let a = -fr2.w / 2 + 4; a < fr2.w / 2 - 3; a += 7) {
          for (let b = -fr2.h / 2 + 4; b < fr2.h / 2 - 3; b += 7) {
            const p = G.add(fr2.c, G.add(G.scale(fr2.u, a), G.scale(fr2.v, b)));
            if (G.contains(f.poly, p) && G.distToPolyline(p, f.poly, true) > 2.6) trees.push({ x: p.x, y: p.y, r: 2.3 });
          }
        }
      } else if (f.kind === 'meadow' && tr.bool(0.4)) {
        const bb = G.bbox(f.poly);
        for (const p of G.poissonDisc(tr, bb.x0, bb.y0, bb.w, bb.h, 26)) if (G.contains(f.poly, p) && G.distToPolyline(p, f.poly, true) > 4 && tr.bool(0.5)) trees.push({ x: p.x, y: p.y, r: tr.float(3, 4.5) });
      }
    }
    for (const lot of lots) for (const t2 of lot.trees) trees.push(t2);
    if (stream) {
      const len = G.polylineLength(stream.pts);
      for (let d = 0; d < len; d += tr.float(6, 12)) {
        const { p, dir } = G.along(stream.pts, d);
        const q = G.add(p, G.scale(G.perp(dir), (stream.w / 2 + 4) * tr.sign()));
        if (tr.bool(0.6) && clearOf(q, 3)) trees.push({ x: q.x, y: q.y, r: tr.float(2.8, 3.8) });
      }
    }
    if (pond) {
      const pc = G.centroid(pond);
      for (let a = 0; a < Math.PI * 2; a += tr.float(0.3, 0.7)) {
        const q = G.add(pc, G.fromAngle(a, G.dist(pc, pond[0]) + tr.float(6, 10)));
        if (tr.bool(0.55) && clearOf(q, 3)) trees.push({ x: q.x, y: q.y, r: tr.float(3, 4.2) });
      }
    }

    // Bridges where the roads cross the stream.
    const bridges = [];
    if (stream) {
      for (const r of roads) {
        if (r.kind === 'cul') continue;
        for (let i = 0; i < r.pts.length - 1; i++) {
          const hit = wi.hit(r.pts[i], r.pts[i + 1]);
          if (hit) bridges.push({ p: { x: hit.x, y: hit.y }, dir: G.norm(G.sub(r.pts[i + 1], r.pts[i])), w: r.w, len: stream.w + 8 });
        }
      }
    }

    // Road numbers, near the edge of the sheet.
    for (const r of [main].concat(cross)) {
      let best = null;
      for (const p of r.pts) {
        if (!inSheet(p, 48) || p.y < 84) continue;
        const d = G.dist(p, c);
        if (d > cfg.R * 0.8 && (!best || d > best.d) && d < S * 0.45) best = { d, p };
      }
      if (best) landmarks.push({ key: 'village.road', params: { n: r.n }, x: best.p.x, y: best.p.y, road: true });
    }

    const name = opts.name || Carto.Names.place(rng.fork('name'));
    const homes = houses.filter((h) => h.kind === 'house').length, blocks = houses.filter((h) => h.kind === 'block').length;
    return {
      seed, name, size: opts.size, c, roads, stream, pond, bridges, square, houses, lots, farms, fields, woods, trees, landmarks,
      population: Math.round((homes * 2.5 + blocks * 15) / 5) * 5,
      extra: { mayor: Carto.Names.person(R.fork('mayor')), blocks },
    };
  }

  // Hipped roof lines on a rectangular part: ridge and the four hips.
  function hipRoof(batch, part, gable) {
    const f = G.frame(part);
    const long = f.w >= f.h, L = long ? f.w : f.h, Wd = long ? f.h : f.w;
    const ax = long ? f.u : f.v, bx = long ? f.v : f.u;
    const half = gable ? L / 2 : Math.max(0, (L - Wd) / 2);
    const r1 = G.add(f.c, G.scale(ax, -half)), r2 = G.add(f.c, G.scale(ax, half));
    if (half > 0.3) batch.line(r1, r2);
    if (gable) return;
    for (const [r, s] of [[r1, -1], [r2, 1]]) {
      for (const t2 of [-1, 1]) batch.line(r, G.add(f.c, G.add(G.scale(ax, s * L / 2), G.scale(bx, t2 * Wd / 2))));
    }
  }

  function renderModern(m, o) {
    const pal = o.palette;
    const svg = new Svg(S, S);
    const clip = Carto.uid('vclip');
    svg.defs('<clipPath id="' + clip + '"><rect x="0" y="0" width="' + S + '" height="' + S + '"/></clipPath>');
    svg.rect(0, 0, S, S, { fill: pal.paper });
    svg.open({ clipPath: 'url(#' + clip + ')' });
    svg.rect(0, 0, S, S, { fill: pal.green, opacity: 0.22 });

    // Fields, vineyards, woods.
    const fa = new Svg.Batch(), fb = new Svg.Batch(), fm = new Svg.Batch(), fo = new Svg.Batch(), fv = new Svg.Batch();
    const furrows = new Svg.Batch(), vines = new Svg.Batch(), wood = new Svg.Batch();
    for (const f of m.fields) {
      ({ field: fa, fieldAlt: fb, meadow: fm, orchard: fo, vineyard: fv }[f.kind] || fm).poly(f.poly);
      for (const s of f.furrows) (f.kind === 'vineyard' ? vines : furrows).line(s[0], s[1]);
    }
    for (const w of m.woods) wood.poly(w);
    svg.path(fm.toString(), { fill: pal.green, stroke: pal.fieldInk, strokeWidth: 0.5, opacity: 0.55 });
    svg.path(fo.toString(), { fill: pal.green, stroke: pal.fieldInk, strokeWidth: 0.5, opacity: 0.8 });
    svg.path(fa.toString(), { fill: pal.field, stroke: pal.fieldInk, strokeWidth: 0.5 });
    svg.path(fb.toString(), { fill: pal.fieldAlt, stroke: pal.fieldInk, strokeWidth: 0.5 });
    svg.path(fv.toString(), { fill: pal.fieldAlt, stroke: pal.fieldInk, strokeWidth: 0.5 });
    svg.path(furrows.toString(), { fill: 'none', stroke: pal.fieldInk, strokeWidth: 0.45, opacity: 0.75 });
    svg.path(vines.toString(), { fill: 'none', stroke: pal.greenInk, strokeWidth: 0.9, strokeDasharray: '1.6 0.9', opacity: 0.85 });
    svg.path(wood.toString(), { fill: pal.green, stroke: pal.greenInk, strokeWidth: 0.4, opacity: 0.75 });

    // Lots: gardens with their fences, paved yards, driveways and pools.
    const gardens = new Svg.Batch(), yards = new Svg.Batch(), fences = new Svg.Batch(), drives = new Svg.Batch(), pools = new Svg.Batch(), parking = new Svg.Batch();
    for (const l of m.lots) {
      (l.kind === 'garden' ? gardens : yards).poly(l.poly);
      fences.poly(l.poly);
      if (l.drive) drives.poly(l.drive);
      if (l.pool) pools.poly(l.pool);
      if (l.parking) {
        const f = G.frame(l.parking);
        for (const s of G.stripes(l.parking, f.v, 2.6, 0.5)) parking.line(s[0], G.lerp(s[0], s[1], Math.min(1, 5 / G.dist(s[0], s[1]))));
      }
    }
    for (const f of m.farms) yards.poly(f.poly);
    svg.path(gardens.toString(), { fill: pal.green, opacity: 0.5 });
    svg.path(yards.toString(), { fill: pal.paperShade });
    svg.path(fences.toString(), { fill: 'none', stroke: pal.inkSoft, strokeWidth: 0.35, opacity: 0.8 });
    svg.path(drives.toString(), { fill: pal.road, stroke: pal.inkSoft, strokeWidth: 0.3 });
    svg.path(parking.toString(), { fill: 'none', stroke: pal.inkSoft, strokeWidth: 0.35 });
    svg.path(pools.toString(), { fill: pal.water, stroke: pal.waterInk, strokeWidth: 0.6 });

    // Water.
    if (m.pond) {
      svg.path(Svg.smooth(m.pond, true), { fill: pal.water, stroke: pal.waterInk, strokeWidth: 1 });
    }
    if (m.stream) {
      const d = Svg.smooth(m.stream.pts, false);
      svg.path(d, { fill: 'none', stroke: pal.waterInk, strokeWidth: m.stream.w + 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' });
      svg.path(d, { fill: 'none', stroke: pal.water, strokeWidth: m.stream.w, strokeLinecap: 'round', strokeLinejoin: 'round' });
    }

    // Grounds: the piazza, the sports ground, the petrol station forecourt.
    svg.poly(m.square.poly, { fill: pal.road, stroke: pal.inkSoft, strokeWidth: 0.5 });
    const sqf = G.frame(m.square.poly);
    const paving = new Svg.Batch();
    for (const s of G.stripes(G.insetConvex(m.square.poly, 1), sqf.u, 3, 0)) paving.line(s[0], s[1]);
    svg.path(paving.toString(), { fill: 'none', stroke: pal.inkSoft, strokeWidth: 0.2, opacity: 0.6 });
    for (const h of m.houses) {
      const u = G.fromAngle(h.ang), v = G.perp(u), ctr = G.centroid(h.box);
      if (h.kind === 'pitch') {
        svg.poly(h.box, { fill: pal.green, stroke: pal.greenInk, strokeWidth: 0.6 });
        const pitch = G.rect(ctr.x, ctr.y, h.w * 0.84, h.d * 0.78, h.ang);
        const lines = { fill: 'none', stroke: pal.road, strokeWidth: 0.7 };
        svg.poly(pitch, lines);
        const hv = G.scale(v, h.d * 0.39);
        svg.poly([G.add(ctr, hv), G.sub(ctr, hv)], lines, false);
        svg.circle(ctr.x, ctr.y, h.d * 0.12, lines);
        for (const s of [-1, 1]) {
          const g = G.add(ctr, G.scale(u, s * (h.w * 0.42 - h.w * 0.06)));
          svg.poly(G.rect(g.x, g.y, h.w * 0.12, h.d * 0.36, h.ang), lines);
        }
        const cl = G.add(ctr, G.scale(v, h.club * (h.d / 2 - 2.6)));
        svg.poly(G.rect(cl.x, cl.y, 13, 3.6, h.ang), { fill: pal.buildingSpecial, stroke: pal.ink, strokeWidth: 0.6 });
      } else if (h.kind === 'fuel') {
        svg.poly(h.box, { fill: pal.road, stroke: pal.inkSoft, strokeWidth: 0.5 });
        const cn = G.add(ctr, G.scale(v, -h.side * 2.5));
        svg.poly(G.rect(cn.x, cn.y, 15, 7, h.ang), { fill: pal.accent, stroke: pal.ink, strokeWidth: 0.6, opacity: 0.85 });
        const pumps = new Svg.Batch();
        for (const x of [-4.5, 0, 4.5]) { const q = G.add(cn, G.scale(u, x)); pumps.poly(G.rect(q.x, q.y, 1.2, 2.4, h.ang)); }
        svg.path(pumps.toString(), { fill: pal.paper, stroke: pal.ink, strokeWidth: 0.4 });
        const k = G.add(ctr, G.add(G.scale(v, h.side * 6.5), G.scale(u, 8)));
        svg.poly(G.rect(k.x, k.y, 9, 5, h.ang), { fill: pal.buildingSpecial, stroke: pal.ink, strokeWidth: 0.7 });
      }
    }

    // Roads: casings, then surfaces; dirt tracks; the centre line of the provincial road.
    const track = new Svg.Batch(), casing = [new Svg.Batch(), new Svg.Batch(), new Svg.Batch()], surf = [new Svg.Batch(), new Svg.Batch(), new Svg.Batch()];
    const culC = new Svg.Batch(), culS = new Svg.Batch();
    for (const r of m.roads) {
      if (r.kind === 'track') { track.smooth(r.pts, false); continue; }
      if (r.kind === 'cul') {
        const e = r.pts[0];
        culC.circle(e.x, e.y, r.w / 2 + 0.8);
        culS.circle(e.x, e.y, r.w / 2);
        continue;
      }
      const k = r.kind === 'main' ? 0 : r.kind === 'road' ? 1 : 2;
      casing[k].smooth(r.pts, false);
      surf[k].smooth(r.pts, false);
    }
    svg.path(track.toString(), { fill: 'none', stroke: pal.fieldInk, strokeWidth: 3.2, strokeLinecap: 'round', strokeLinejoin: 'round' });
    svg.path(track.toString(), { fill: 'none', stroke: pal.paperShade, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' });
    const W = [8, 7, 6];
    svg.path(culC.toString(), { fill: pal.inkSoft });
    for (let k = 2; k >= 0; k--) svg.path(casing[k].toString(), { fill: 'none', stroke: pal.inkSoft, strokeWidth: W[k] + 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' });
    svg.path(culS.toString(), { fill: pal.road });
    for (let k = 2; k >= 0; k--) svg.path(surf[k].toString(), { fill: 'none', stroke: pal.road, strokeWidth: W[k], strokeLinecap: 'round', strokeLinejoin: 'round' });
    for (const r of m.roads) if (r.kind === 'main' || r.kind === 'road') svg.path(Svg.smooth(r.pts, false), { fill: 'none', stroke: pal.inkSoft, strokeWidth: 0.45, strokeDasharray: '4 4' });
    const bridges = new Svg.Batch(), parapets = new Svg.Batch();
    for (const b of m.bridges) {
      const a = Math.atan2(b.dir.y, b.dir.x);
      bridges.poly(G.rect(b.p.x, b.p.y, b.len, b.w + 1.6, a));
      for (const s of [-1, 1]) {
        const o2 = G.add(b.p, G.scale(G.perp(b.dir), s * (b.w / 2 + 0.8)));
        parapets.line(G.add(o2, G.scale(b.dir, -b.len / 2 - 1)), G.add(o2, G.scale(b.dir, b.len / 2 + 1)));
      }
    }
    svg.path(bridges.toString(), { fill: pal.road, stroke: 'none' });
    svg.path(parapets.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.9 });

    // The fountain in the piazza.
    svg.circle(m.square.x, m.square.y, 3, { fill: pal.water, stroke: pal.ink, strokeWidth: 0.7 });

    // Buildings: hipped roofs on houses, flat roofs on blocks, the church with its bell tower.
    const hb = new Svg.Batch(), sb = new Svg.Batch(), flat = new Svg.Batch(), roofs = new Svg.Batch(), parapet = new Svg.Batch();
    for (const h of m.houses) {
      if (h.ground) continue;
      if (h.kind === 'block') {
        flat.poly(h.poly);
        parapet.poly(G.insetConvex(h.box, 1));
        const f = G.frame(h.box);
        parapet.poly(G.rect(f.c.x, f.c.y, 3, 3, h.ang));
        continue;
      }
      if (h.kind === 'bus') {
        sb.poly(h.poly);
        continue;
      }
      (h.kind === 'house' || h.kind === 'shed' ? hb : sb).poly(h.poly);
      if (h.kind === 'shed') continue;
      if (h.kind === 'temple') {
        // Gabled nave, apse at the back, bell tower beside the facade.
        const f = G.frame(h.box);
        const ax = f.w >= f.h ? f.u : f.v, bx = G.perp(ax), L = Math.max(f.w, f.h), Wd = Math.min(f.w, f.h);
        const facade = G.dot(G.sub(m.square, f.c), ax) > 0 ? 1 : -1;
        hipRoof(roofs, h.box, true);
        const ap = G.add(f.c, G.scale(ax, -facade * L / 2));
        sb.smooth(G.regular(ap.x, ap.y, Wd * 0.32, 10), true);
        const tw = G.add(f.c, G.add(G.scale(ax, facade * (L / 2 - 2.6)), G.scale(bx, h.tower * (Wd / 2 + 2.6))));
        sb.poly(G.rect(tw.x, tw.y, 5.2, 5.2, Math.atan2(ax.y, ax.x)));
        roofs.line(G.add(tw, { x: -2.6, y: -2.6 }), G.add(tw, { x: 2.6, y: 2.6 }));
        continue;
      }
      if (h.row) { hipRoof(roofs, h.box, true); continue; }
      h.parts.forEach((p, i) => hipRoof(roofs, p, i > 0));
    }
    svg.path(hb.toString(), { fill: pal.building, stroke: pal.ink, strokeWidth: 0.6, strokeLinejoin: 'round' });
    svg.path(flat.toString(), { fill: pal.roof, stroke: pal.ink, strokeWidth: 0.7, strokeLinejoin: 'round' });
    svg.path(sb.toString(), { fill: pal.buildingSpecial, stroke: pal.ink, strokeWidth: 0.8, strokeLinejoin: 'round' });
    svg.path(roofs.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.35, opacity: 0.6 });
    svg.path(parapet.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.35, opacity: 0.6 });
    const silos = new Svg.Batch();
    for (const f of m.farms) silos.circle(f.silo.x, f.silo.y, f.silo.r);
    svg.path(silos.toString(), { fill: pal.buildingSpecial, stroke: pal.ink, strokeWidth: 0.6 });

    // Trees.
    const crowns = new Svg.Batch();
    const rr = new Carto.Random(m.seed + 21);
    for (const tr of m.trees.slice().sort((a, b) => a.y - b.y)) crowns.smooth(Draw.crown(rr, tr.x, tr.y, tr.r), true);
    svg.path(crowns.toString(), { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.5 });
    svg.close();
    decorate(svg, m, o, pal);
    return svg.toString();
  }

  // ------------------------------------------------------------------ cyberpunk

  const CSIZE = {
    hamlet: { R: 72, branches: 1, alleys: 5, wall: false, heaps: 3, plots: 1 },
    village: { R: 112, branches: 2, alleys: 12, wall: true, heaps: 5, plots: 2 },
    large: { R: 150, branches: 3, alleys: 22, wall: true, heaps: 8, plots: 3 },
  };

  /* A frontier shanty town: container shacks and lean-tos packed along muddy
     tracks inside a ring of scrap barricades, the purifier tank in the yard,
     scrap heaps, the chop shop full of wrecks, a solar array, a drone pad, and
     a polluted canal or a toxic pond among dead scrub. */
  function generateCyber(seed, opts) {
    const rng = new Carto.Random(seed);
    const R = rng.fork('cyber');
    const cfg = CSIZE[opts.size] || CSIZE.village;
    const noise = new Carto.Noise(R.fork('noise'));
    const water = opts.water || 'stream';
    const c = { x: S / 2 + R.float(-20, 20), y: S / 2 + R.float(-15, 25) };
    const roads = [], ri = roadIndex(), si = shapeIndex(), wi = roadIndex();
    const addRoad = (r) => { roads.push(r); ri.add(r); return r; };
    const inSheet = (p, m = 0) => p.x > m && p.y > m && p.x < S - m && p.y < S - m;
    const houses = [], landmarks = [];

    // The canal: straight concrete reaches with hard bends, across the through track.
    const a0 = R.float(0, Math.PI * 2);
    let stream = null, pond = null;
    if (water === 'stream') {
      const a = a0 + Math.PI / 2 + R.float(-0.6, 0.6), d = G.fromAngle(a), nn = G.perp(d);
      const base = G.add(c, G.scale(nn, R.float(45, 95) * R.sign()));
      const pts = [G.add(base, G.scale(d, -S * 0.8))];
      for (const tt of [-0.45, -0.1, 0.25, 0.55]) pts.push(G.add(G.add(base, G.scale(d, S * tt)), G.scale(nn, R.float(-30, 30))));
      pts.push(G.add(base, G.scale(d, S * 0.85)));
      stream = { pts: G.resample(pts, 6), w: R.float(9, 12), canal: true };
      wi.add(stream);
    }
    const waterDist = (p) => {
      let d = stream ? wi.dist(p) : Infinity;
      if (pond) d = Math.min(d, G.contains(pond, p) ? -1 : G.distToPolyline(p, pond, true));
      return d;
    };

    // Muddy tracks: one through the settlement, branches from the yard, alleys.
    const main = addRoad({ pts: wander(edgePoint(c, a0), edgePoint(c, a0 + Math.PI + R.float(-0.4, 0.4)), noise, 55, 8, 11.7), w: 6, kind: 'main' });
    const hub = closestOnLine(main.pts, c).p;
    c.x = hub.x;
    c.y = hub.y;
    const angles = [a0, a0 + Math.PI];
    for (let i = 0; i < cfg.branches; i++) {
      let ang = null;
      for (let k = 0; k < 20 && ang === null; k++) {
        const cand = R.float(0, Math.PI * 2);
        if (angles.every((q) => Math.abs(Math.atan2(Math.sin(cand - q), Math.cos(cand - q))) > 0.9)) ang = cand;
      }
      if (ang === null) break;
      angles.push(ang);
      addRoad({ pts: bendLine(hub, edgePoint(c, ang), noise, 45, 8, 20 + i * 7.3), w: 5, kind: 'road' });
    }
    const yardR = cfg.R * 0.16 + 4;
    const yard = Draw.blob(R, hub.x, hub.y, yardR, 11, 0.3);
    const yardPoly = G.regular(hub.x, hub.y, yardR * 1.12, 10);
    for (let i = 0; i < cfg.alleys; i++) {
      const base = R.pick(roads.slice());
      const k = R.int(2, base.pts.length - 3);
      const p = base.pts[k];
      if (G.dist(p, c) > cfg.R * 0.85 || G.dist(p, c) < yardR + 6) continue;
      const dir = G.norm(G.sub(base.pts[k + 1], base.pts[k - 1]));
      const nd = G.rotate(G.perp(dir), R.float(-0.5, 0.5) + (R.bool() ? 0 : Math.PI));
      const end = G.add(p, G.scale(nd, R.float(22, 48)));
      if (waterDist(end) < 8 || ri.dist(end, new Set([base])) < 9) continue;
      addRoad({ pts: wander(p, end, noise, 9, 5, 40 + i), w: 3, kind: 'alley' });
    }

    // The toxic pond, away from the tracks.
    if (water === 'pond') {
      for (let k = 0; k < 120 && !pond; k++) {
        const rad = R.float(18, 28);
        const p = G.add(c, G.fromAngle(R.float(0, Math.PI * 2), cfg.R * R.float(0.8, 1.5)));
        if (!inSheet(p, rad + 22) || !decorFree(p, rad) || ri.dist(p, null, 60) < rad + 8) continue;
        pond = Draw.blob(R, p.x, p.y, rad, 13, 0.45);
        si.add(G.regular(p.x, p.y, rad * 1.25, 10));
      }
    }

    // Shapes and buildings.
    const fits = (poly, gap = 1, margin = 1, step = 4) => {
      for (const p of outlineSamples(poly, step)) if (ri.dist(p) < gap || waterDist(p) < 2.5 || !inSheet(p, -12)) return false;
      for (let i = 0; i < poly.length; i++) if (ri.hit(poly[i], poly[(i + 1) % poly.length])) return false;
      return !si.hits(poly, margin);
    };
    const build = (kind, ctr, w, d, ang, o = {}) => {
      const box = G.rect(ctr.x, ctr.y, w, d, ang);
      if (!o.free && !fits(box, o.gap === undefined ? 1 : o.gap, o.margin === undefined ? 1 : o.margin)) return null;
      const h = { kind, poly: box, box, parts: [box], ang, w, d };
      if (o.ground) h.ground = true;
      houses.push(h);
      si.add(box);
      if (o.label) landmarks.push({ key: 'village.' + o.label, x: ctr.x, y: ctr.y + (o.dy || 0) });
      return h;
    };
    si.add(yardPoly);

    // The barricade: scrap panels on a ring, open where the tracks pass.
    const wall = [], towers = [];
    let ring = null;
    if (cfg.wall) {
      ring = G.resample(G.chaikin(Draw.blob(R, hub.x, hub.y, cfg.R * 0.8, 14, 0.2), 1, true), 5.5, true);
      let gate = false;
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length], m = G.mid(a, b);
        const open = ri.dist(m) < 3.5 || waterDist(m) < 1.5;
        if (open) {
          if (!gate && ri.dist(m) < 3.5) {
            // A watchtower on each side of the gap.
            const prev = ring[(i - 1 + ring.length) % ring.length];
            towers.push(G.rect(prev.x, prev.y, 4.6, 4.6, Math.atan2(b.y - a.y, b.x - a.x)));
          }
          gate = true;
          continue;
        }
        if (gate && ri.dist(a) < 6) towers.push(G.rect(a.x, a.y, 4.6, 4.6, Math.atan2(b.y - a.y, b.x - a.x)));
        gate = false;
        const ang = Math.atan2(b.y - a.y, b.x - a.x) + R.float(-0.12, 0.12);
        const q = G.add(m, G.scale(G.perp(G.norm(G.sub(b, a))), R.float(-0.6, 0.6)));
        const panel = G.rect(q.x, q.y, G.dist(a, b) + R.float(0.2, 1.2), R.float(1.8, 2.8), ang);
        wall.push(panel);
        si.add(panel);
      }
      for (const tw of towers) si.add(tw);
    }

    // Landmarks round the yard: the dive bar, the net shrine, the clinic.
    const around = (kind, w, d, label) => {
      for (let k = 0; k < 40; k++) {
        const a = R.float(0, Math.PI * 2), p = G.add(hub, G.fromAngle(a, yardR + d / 2 + R.float(2, 10 + k)));
        const near = ri.nearest(p, 40);
        const ang = near && near.d < 25 ? Math.atan2(near.dir.y, near.dir.x) : a + Math.PI / 2;
        const h = build(kind, p, w, d, ang, { label, gap: 1.2 });
        if (h) return h;
      }
      return null;
    };
    around('inn', 14, 9, 'inn');
    around('temple', 9, 9, 'temple');
    around('townhall', 12, 8, 'townhall');
    // The drone pad, on a cleared patch near the yard.
    for (let k = 0; k < 80; k++) {
      const p = G.add(hub, G.fromAngle(R.float(0, Math.PI * 2), yardR + R.float(14, cfg.R * 0.6)));
      if (build('bus', p, 15, 15, R.float(0, Math.PI), { ground: true, label: 'bus', gap: 1.5 })) break;
    }
    // The chop shop, a fenced yard of wrecks on the through track.
    const mlen = G.polylineLength(main.pts), spots = [];
    for (let k = 0; k < 48; k++) spots.push(mlen * (k + 0.5) / 48);
    const outskirts = (s) => { const p = G.along(main.pts, s).p, dc = G.dist(p, c); return (dc < cfg.R * 0.7 || dc > cfg.R * 1.3 + 20 ? 1 : 0) + (decorFree(p, 28) ? 0 : 2); };
    for (const s of R.shuffle(spots).sort((a, b) => outskirts(a) - outskirts(b))) {
      const at = G.along(main.pts, s);
      if (!inSheet(at.p, 40) || G.dist(at.p, c) < cfg.R * 0.4) continue;
      const side = R.sign(), nn = G.perp(at.dir);
      const h = build('fuel', G.add(at.p, G.scale(nn, side * (main.w / 2 + 1 + 13))), 36, 26, Math.atan2(at.dir.y, at.dir.x), { ground: true, label: 'fuel', gap: 0.6 });
      if (!h) continue;
      const u = G.fromAngle(h.ang), v = G.scale(nn, side), ctr = G.centroid(h.box);
      const shed = G.add(ctr, G.add(G.scale(v, 13 - 4.5), G.scale(u, R.sign() * 9)));
      h.shed = G.rect(shed.x, shed.y, 14, 8, h.ang);
      h.wrecks = [];
      for (let i = 0; i < 40 && h.wrecks.length < 14; i++) {
        const p = G.add(ctr, G.add(G.scale(u, R.float(-15, 15)), G.scale(v, R.float(-10, 10))));
        const car = G.rect(p.x, p.y, 4.4, 2, R.float(0, Math.PI));
        if (!G.convexOverlap(car, h.shed, 0.8) && !h.wrecks.some((q) => G.convexOverlap(q, car, 0.5)) && G.convexOverlap(car, G.insetConvex(h.box, 1.2), -2.2)) h.wrecks.push(car);
      }
      break;
    }
    // The solar array, out past the barricade.
    for (let k = 0; k < 160; k++) {
      const p = G.add(c, G.fromAngle(R.float(0, Math.PI * 2), cfg.R * R.float(1.05, 1.7)));
      if (!inSheet(p, 40) || !decorFree(p, 32)) continue;
      const near = ri.nearest(p, 90);
      const ang = near ? Math.atan2(near.dir.y, near.dir.x) : R.float(0, Math.PI);
      if (build('pitch', p, 54, 36, ang, { ground: true, label: 'pitch', dy: -26, gap: 3 })) break;
    }
    // The water turbine on the canal.
    if (stream) {
      let best = null;
      for (let i = 2; i < stream.pts.length - 2; i++) {
        const p = stream.pts[i], dc = G.dist(p, c);
        if (dc < cfg.R * 0.5 || dc > cfg.R * 1.4 || !inSheet(p, 30) || ri.dist(p) < 14) continue;
        if (!best || dc < best.dc) best = { dc, i, p };
      }
      if (best) {
        const dir = G.norm(G.sub(stream.pts[best.i + 1], stream.pts[best.i - 1]));
        const ctr = G.add(best.p, G.scale(G.perp(dir), stream.w / 2 + 6));
        const h = build('mill', ctr, 10, 8, Math.atan2(dir.y, dir.x), { label: 'mill', dy: 3 });
        if (h) h.turbine = G.rect(best.p.x + G.perp(dir).x * (stream.w / 2 - 1), best.p.y + G.perp(dir).y * (stream.w / 2 - 1), 7, 3, Math.atan2(dir.y, dir.x));
      }
    }

    // Scrap heaps along the tracks outside the core.
    const heaps = [];
    for (let k = 0; k < 200 && heaps.length < cfg.heaps; k++) {
      const p = G.add(c, G.fromAngle(R.float(0, Math.PI * 2), cfg.R * R.float(0.75, 1.6)));
      const rad = R.float(6, 13);
      if (!inSheet(p, rad + 12) || !decorFree(p, rad)) continue;
      const hull = G.regular(p.x, p.y, rad * 1.1, 9);
      if (ri.dist(p, null, 40) < rad + 2 || ri.dist(p, null, 40) > rad + 30 || waterDist(p) < rad + 3 || si.hits(hull, 2)) continue;
      const blob = Draw.blob(R, p.x, p.y, rad, 10, 0.5);
      const junk = [];
      for (let i = 0; i < rad * 1.6; i++) {
        const q = G.add(p, G.fromAngle(R.float(0, Math.PI * 2), rad * Math.sqrt(R.next()) * 0.85));
        junk.push(G.rect(q.x, q.y, R.float(1.2, 3.4), R.float(0.8, 2), R.float(0, Math.PI)));
      }
      heaps.push({ poly: blob, junk });
      si.add(hull);
      if (heaps.length === 1) landmarks.push({ key: 'village.scrap', x: p.x, y: p.y + rad - 4 });
    }

    // Plots and greenhouses: patches of small beds near the barricade.
    const plots = [];
    if (opts.fields) {
      for (let g = 0, k = 0; g < cfg.plots && k < 150; k++) {
        const p = G.add(c, G.fromAngle(R.float(0, Math.PI * 2), cfg.R * R.float(0.95, 1.5)));
        if (!inSheet(p, 30) || !decorFree(p, 25) || ri.dist(p, null, 60) > 30) continue;
        const near = ri.nearest(p, 60);
        const ang = near ? Math.atan2(near.dir.y, near.dir.x) : 0, u = G.fromAngle(ang), v = G.perp(u);
        const nu = R.int(2, 4), nv = R.int(1, 3), bw = R.float(11, 16), bh = R.float(7, 10);
        let made = 0;
        for (let i = 0; i < nu; i++) {
          for (let j = 0; j < nv; j++) {
            const q = G.add(p, G.add(G.scale(u, (i - (nu - 1) / 2) * (bw + 2)), G.scale(v, (j - (nv - 1) / 2) * (bh + 2))));
            const poly = G.rect(q.x, q.y, bw, bh, ang);
            if (!fits(poly, 1.5, 1.2)) continue;
            si.add(poly);
            const glass = R.bool(0.45);
            plots.push({ poly, glass, rows: glass ? [] : G.stripes(G.insetConvex(poly, 0.8), u, 1.8, R.next()) });
            made++;
          }
        }
        if (made) {
          if (!g) landmarks.push({ key: 'village.greenhouse', x: p.x, y: p.y + (nv * (bh + 2)) / 2 });
          g++;
        }
      }
    }

    // Power line across the wasteland, and the shells of older buildings.
    const pylons = [];
    for (let k = 0; k < 30 && !pylons.length; k++) {
      const a = R.float(0, Math.PI), d = G.fromAngle(a), off = G.add(c, G.scale(G.perp(d), R.sign() * cfg.R * R.float(1.05, 1.5)));
      const line = [];
      for (let t2 = -S; t2 <= S; t2 += 38) {
        const p = G.add(off, G.scale(d, t2));
        if (inSheet(p, -20)) line.push(p);
      }
      if (line.length < 4 || line.some((p) => G.dist(p, c) < cfg.R * 0.95 || waterDist(p) < 4 || ri.dist(p) < 3 || si.hits(G.rect(p.x, p.y, 3, 3, a), 1))) continue;
      for (const p of line) { pylons.push({ x: p.x, y: p.y, a }); si.add(G.rect(p.x, p.y, 3, 3, a)); }
    }
    const ruins = [];
    for (let k = 0; k < 120 && ruins.length < 2 + cfg.heaps / 2; k++) {
      const p = G.add(c, G.fromAngle(R.float(0, Math.PI * 2), cfg.R * R.float(1, 2)));
      const w = R.float(10, 24), d = R.float(8, 14), ang = R.float(0, Math.PI);
      const box = G.rect(p.x, p.y, w, d, ang);
      if (!inSheet(p, 30) || !decorFree(p, 12) || !fits(box, 3, 3)) continue;
      si.add(box);
      // Only stretches of the old walls still stand.
      const walls = [];
      for (let i = 0; i < 4; i++) {
        const a = box[i], b = box[(i + 1) % 4];
        const t0 = R.float(0, 0.35), t1 = R.float(0.55, 1);
        if (R.bool(0.8)) walls.push([G.lerp(a, b, t0), G.lerp(a, b, t1)]);
      }
      const rubble = [];
      for (let i = 0; i < 8; i++) rubble.push(G.add(p, G.add(G.scale(G.fromAngle(ang), R.float(-w / 2, w / 2)), G.scale(G.perp(G.fromAngle(ang)), R.float(-d / 2, d / 2)))));
      ruins.push({ box, walls, rubble });
    }

    // Shacks: containers, lean-tos and huts crammed along the tracks, in clumps.
    const sr = R.fork('shacks');
    const inside = (p) => (ring ? G.contains(ring, p) : G.dist(p, c) < cfg.R * 0.85);
    const bb = cfg.R * 1.55;
    for (const p of G.poissonDisc(sr, c.x - bb, c.y - bb, bb * 2, bb * 2, 3.5)) {
      if (!inSheet(p, 2)) continue;
      const d = G.dist(p, c), rd = ri.dist(p, null, 30);
      const lump = Math.max(0.15, Math.min(1.2, 0.8 + noise.fbm(p.x / 34 + 3.3, p.y / 34, 2) * 1.1));
      const dens = (inside(p) ? 0.95 : Math.max(0, 0.6 - (d - cfg.R * 0.8) / (cfg.R * 0.75)) * (rd < 14 ? 1 : 0.25)) * lump;
      if (!sr.bool(dens)) continue;
      const type = sr.weighted([['container', 5], ['lean', 3], ['hut', 2]]);
      const [w, dd] = type === 'container' ? [sr.bool(0.75) ? 6.1 : 12.2, 2.5] : type === 'lean' ? [sr.float(3.5, 5.5), sr.float(2.5, 3.4)] : [sr.float(4.5, 7), sr.float(3.6, 5.2)];
      const near = rd < 18 && sr.bool(0.65) ? ri.nearest(p, 30) : null;
      const ang = near ? Math.atan2(near.dir.y, near.dir.x) + sr.float(-0.2, 0.2) + (sr.bool(0.25) ? Math.PI / 2 : 0) : sr.float(0, Math.PI);
      let h = build('house', p, w, dd, ang, { gap: 0.8, margin: 0.4 }), sub = type;
      // No room: squeeze a lean-to into the gap instead.
      if (!h && inside(p)) { h = build('house', p, sr.float(3, 4.2), sr.float(2.2, 3), ang + Math.PI / 2, { gap: 0.6, margin: 0.3 }); sub = 'lean'; }
      if (!h) continue;
      h.sub = sub;
      h.sign = d < cfg.R * 0.65 && sr.bool(0.16);
      if (sub === 'container' && sr.bool(0.35)) {
        // Containers side by side, in rows.
        const q = G.add(p, G.scale(G.perp(G.fromAngle(ang)), sr.sign() * (dd + 0.25)));
        const twin = build('house', q, w, dd, ang, { gap: 0.8, margin: 0.1 });
        if (twin) twin.sub = 'container';
      }
    }

    // Dead scrub out in the wasteland.
    const scrub = [];
    const br = R.fork('scrub');
    for (const p of G.poissonDisc(br, -10, -10, S + 20, S + 20, 7)) {
      const d = G.dist(p, c);
      if (d < cfg.R * 0.85) continue;
      const fn = noise.fbm(p.x / 120 + 9.1, p.y / 120, 3);
      const want = opts.forest ? (fn > 0.12 ? 0.8 : 0.04) : 0.02;
      if (!br.bool(want)) continue;
      const r = br.float(1.8, 3.4);
      if (ri.dist(p) < r + 1 || waterDist(p) < r + 1 || si.hits(G.rect(p.x, p.y, r * 2, r * 2, 0), 0.5)) continue;
      scrub.push({ x: p.x, y: p.y, r, a: br.float(0, Math.PI) });
    }

    // Bridges where tracks cross the canal.
    const bridges = [];
    if (stream) {
      for (const r of roads) {
        for (let i = 0; i < r.pts.length - 1; i++) {
          const hit = wi.hit(r.pts[i], r.pts[i + 1]);
          if (hit) bridges.push({ p: { x: hit.x, y: hit.y }, dir: G.norm(G.sub(r.pts[i + 1], r.pts[i])), w: r.w, len: stream.w + 6 });
        }
      }
    }

    const name = opts.name || Carto.Names.place(rng.fork('name'));
    // Families in the containers and huts; lean-tos are mostly sheds and stalls.
    const homes = houses.filter((h) => h.kind === 'house').reduce((sum, h) => sum + (h.sub === 'lean' ? 1 : 3.6), 0);
    return {
      seed, name, size: opts.size, c, roads, stream, pond, bridges, yard, square: { x: hub.x, y: hub.y }, houses, wall, towers, ring,
      heaps, plots, scrub, pylons, ruins, landmarks,
      population: Math.round(homes / 5) * 5,
      extra: { mayor: Carto.Names.person(R.fork('mayor')) },
    };
  }

  function renderCyber(m, o) {
    const pal = o.palette;
    const svg = new Svg(S, S);
    const clip = Carto.uid('vclip');
    svg.defs('<clipPath id="' + clip + '"><rect x="0" y="0" width="' + S + '" height="' + S + '"/></clipPath>');
    svg.rect(0, 0, S, S, { fill: pal.paper });
    svg.open({ clipPath: 'url(#' + clip + ')' });
    // Trodden ground inside the barricade.
    if (m.ring) svg.path(Svg.smooth(m.ring, true), { fill: pal.paperShade, opacity: 0.85 });
    else svg.circle(m.c.x, m.c.y, 70, { fill: pal.paperShade, opacity: 0.5 });

    // Dead scrub.
    const sc = new Svg.Batch();
    for (const s of m.scrub) {
      for (let i = 0; i < 4; i++) {
        const a = s.a + i * Math.PI / 4;
        sc.line(G.add(s, G.fromAngle(a, s.r)), G.add(s, G.fromAngle(a + Math.PI, s.r * 0.7)));
      }
    }
    svg.path(sc.toString(), { fill: 'none', stroke: pal.greenInk, strokeWidth: 0.5, opacity: 0.5, strokeLinecap: 'round' });

    // Plots and greenhouses.
    const beds = new Svg.Batch(), glass = new Svg.Batch(), rows = new Svg.Batch(), panes = new Svg.Batch();
    for (const p of m.plots) {
      (p.glass ? glass : beds).poly(p.poly);
      for (const s of p.rows) rows.line(s[0], s[1]);
      if (p.glass) {
        const f = G.frame(p.poly);
        for (const s of G.stripes(p.poly, f.v, 2, 0.5)) panes.line(s[0], s[1]);
      }
    }
    svg.path(beds.toString(), { fill: pal.field, stroke: pal.fieldInk, strokeWidth: 0.5 });
    svg.path(rows.toString(), { fill: 'none', stroke: pal.greenInk, strokeWidth: 0.7, opacity: 0.8 });
    svg.path(glass.toString(), { fill: pal.green, stroke: pal.greenInk, strokeWidth: 0.7, opacity: 0.9 });
    svg.path(panes.toString(), { fill: 'none', stroke: pal.greenInk, strokeWidth: 0.3, opacity: 0.8 });

    // Water: the canal between concrete banks, or the toxic pond.
    if (m.pond) {
      svg.path(Svg.smooth(m.pond, true), { fill: pal.water, stroke: pal.greenInk, strokeWidth: 1.2 });
      svg.path(Svg.smooth(G.scalePoly(m.pond, 0.7), true), { fill: 'none', stroke: pal.greenInk, strokeWidth: 0.6, strokeDasharray: '2 3', opacity: 0.7 });
      const rr = new Carto.Random(m.seed + 5), bub = new Svg.Batch(), pc = G.centroid(m.pond);
      for (let i = 0; i < 9; i++) { const q = G.add(pc, G.fromAngle(rr.float(0, 6.3), rr.float(0, 0.6) * G.dist(pc, m.pond[0]))); bub.circle(q.x, q.y, rr.float(0.5, 1.2)); }
      svg.path(bub.toString(), { fill: 'none', stroke: pal.greenInk, strokeWidth: 0.4 });
    }
    if (m.stream) {
      const d = Svg.d(m.stream.pts, false);
      svg.path(d, { fill: 'none', stroke: pal.rock, strokeWidth: m.stream.w + 4, strokeLinejoin: 'miter' });
      svg.path(d, { fill: 'none', stroke: pal.water, strokeWidth: m.stream.w, strokeLinejoin: 'miter' });
      // Sludge on the water, and the concrete edges.
      svg.path(d, { fill: 'none', stroke: pal.greenInk, strokeWidth: m.stream.w * 0.5, strokeLinejoin: 'miter', opacity: 0.16 });
      for (const k of [-1, 1]) svg.path(Svg.d(G.offsetPolyline(m.stream.pts, k * (m.stream.w / 2 + 2)), false), { fill: 'none', stroke: pal.ink, strokeWidth: 0.5, opacity: 0.8 });
      for (const k of [-1, 1]) svg.path(Svg.d(G.offsetPolyline(m.stream.pts, k * m.stream.w / 2), false), { fill: 'none', stroke: pal.waterInk, strokeWidth: 0.6 });
    }

    // Tracks: mud, then the ruts.
    const ruts = new Svg.Batch();
    for (const r of m.roads) {
      if (r.w >= 5) for (const s of [-1, 1]) ruts.smooth(G.offsetPolyline(r.pts, s * r.w * 0.22), false);
    }
    for (const w of [6, 5, 3]) {
      const b = new Svg.Batch();
      for (const r of m.roads) if (r.w === w) b.smooth(r.pts, false);
      svg.path(b.toString(), { fill: 'none', stroke: pal.inkSoft, strokeWidth: w + 2.4, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.55 });
    }
    for (const w of [6, 5, 3]) {
      const b = new Svg.Batch();
      for (const r of m.roads) if (r.w === w) b.smooth(r.pts, false);
      svg.path(b.toString(), { fill: 'none', stroke: pal.road, strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round' });
    }
    svg.path(ruts.toString(), { fill: 'none', stroke: pal.inkSoft, strokeWidth: 0.35, strokeDasharray: '3 2', opacity: 0.7 });
    svg.path(Svg.smooth(m.yard, true), { fill: pal.road, stroke: pal.inkSoft, strokeWidth: 0.6 });
    const bridges = new Svg.Batch(), planks = new Svg.Batch();
    for (const b of m.bridges) {
      const a = Math.atan2(b.dir.y, b.dir.x), box = G.rect(b.p.x, b.p.y, b.len, b.w + 1.2, a);
      bridges.poly(box);
      for (const s of G.stripes(box, G.perp(b.dir), 1.4, 0.5)) planks.line(s[0], s[1]);
    }
    svg.path(bridges.toString(), { fill: pal.building, stroke: pal.ink, strokeWidth: 0.7 });
    svg.path(planks.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.25, opacity: 0.6 });

    // Scrap heaps.
    const heap = new Svg.Batch(), junk = new Svg.Batch();
    for (const h of m.heaps) {
      heap.smooth(h.poly, true);
      for (const j of h.junk) junk.poly(j);
    }
    svg.path(heap.toString(), { fill: pal.rock, stroke: pal.inkSoft, strokeWidth: 0.6 });
    svg.path(junk.toString(), { fill: pal.building, stroke: pal.ink, strokeWidth: 0.35, opacity: 0.9 });

    // Ruins and the power line.
    const rw = new Svg.Batch(), rb = new Svg.Batch();
    for (const r of m.ruins) {
      for (const w of r.walls) rw.line(w[0], w[1]);
      for (const q of r.rubble) rb.circle(q.x, q.y, 0.6);
    }
    svg.path(rw.toString(), { fill: 'none', stroke: pal.inkSoft, strokeWidth: 1.4, strokeLinecap: 'square' });
    svg.path(rb.toString(), { fill: pal.inkSoft });
    if (m.pylons.length) {
      svg.poly(m.pylons, { fill: 'none', stroke: pal.ink, strokeWidth: 0.4, opacity: 0.6 }, false);
      const py = new Svg.Batch();
      for (const p of m.pylons) {
        const box = G.rect(p.x, p.y, 3, 3, p.a);
        py.poly(box);
        py.line(box[0], box[2]);
        py.line(box[1], box[3]);
      }
      svg.path(py.toString(), { fill: pal.paper, stroke: pal.ink, strokeWidth: 0.5 });
    }

    // Grounds: the solar array, the chop shop, the drone pad.
    for (const h of m.houses) {
      if (!h.ground) continue;
      const u = G.fromAngle(h.ang), ctr = G.centroid(h.box);
      if (h.kind === 'pitch') {
        svg.poly(h.box, { fill: pal.paperShade, stroke: pal.accent, strokeWidth: 0.7, strokeDasharray: '3 1.5' });
        const panels = new Svg.Batch();
        for (const s of G.stripes(G.insetConvex(h.box, 3), u, 4.2, 0.5)) panels.line(s[0], s[1]);
        svg.path(panels.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 2.2, opacity: 0.8 });
      } else if (h.kind === 'fuel') {
        svg.poly(h.box, { fill: pal.paperShade, stroke: pal.ink, strokeWidth: 0.7, strokeDasharray: '2 1' });
        const cars = new Svg.Batch(), glassB = new Svg.Batch();
        for (const w of h.wrecks || []) {
          cars.poly(w);
          const f = G.frame(w);
          const ax = f.w >= f.h ? f.u : f.v, bx = G.perp(ax), a = G.add(f.c, G.scale(ax, 0.7));
          glassB.line(G.add(a, G.scale(bx, 0.7)), G.sub(a, G.scale(bx, 0.7)));
        }
        svg.path(cars.toString(), { fill: pal.building, stroke: pal.ink, strokeWidth: 0.45 });
        svg.path(glassB.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 0.5 });
        if (h.shed) svg.poly(h.shed, { fill: pal.buildingSpecial, stroke: pal.accent, strokeWidth: 0.9 });
      } else if (h.kind === 'bus') {
        svg.poly(h.box, { fill: pal.paperShade, stroke: pal.inkSoft, strokeWidth: 0.5 });
        svg.circle(ctr.x, ctr.y, 6, { fill: pal.road, stroke: pal.accent, strokeWidth: 1.2 });
        const hh = new Svg.Batch(), v = G.perp(u);
        for (const s of [-1, 1]) hh.line(G.add(ctr, G.add(G.scale(u, s * 2), G.scale(v, -3))), G.add(ctr, G.add(G.scale(u, s * 2), G.scale(v, 3))));
        hh.line(G.sub(ctr, G.scale(u, 2)), G.add(ctr, G.scale(u, 2)));
        svg.path(hh.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 1 });
        const lights = new Svg.Batch();
        for (const q of h.box) { const l = G.lerp(q, ctr, 0.12); lights.circle(l.x, l.y, 0.7); }
        svg.path(lights.toString(), { fill: pal.ink, stroke: 'none' });
      }
    }

    // The purifier tank in the yard.
    svg.circle(m.square.x, m.square.y, 5, { fill: pal.water, stroke: pal.accent, strokeWidth: 1.2 });
    svg.circle(m.square.x, m.square.y, 2.6, { fill: 'none', stroke: pal.ink, strokeWidth: 0.5 });

    // Shacks: corrugated containers, lean-tos with one slope, huts, and the landmarks.
    const cont = new Svg.Batch(), lean = new Svg.Batch(), hut = new Svg.Batch(), spec = new Svg.Batch(), lines = new Svg.Batch(), neon = new Svg.Batch();
    for (const h of m.houses) {
      if (h.ground) continue;
      const u = G.fromAngle(h.ang), v = G.perp(u), ctr = G.centroid(h.box);
      if (h.kind !== 'house') {
        spec.poly(h.poly);
        if (h.kind === 'inn') neon.line(G.add(h.box[0], G.scale(u, 2)), G.sub(h.box[1], G.scale(u, 2)));
        if (h.kind === 'townhall') { neon.line(G.add(ctr, G.scale(u, -2)), G.add(ctr, G.scale(u, 2))); neon.line(G.add(ctr, G.scale(v, -2)), G.add(ctr, G.scale(v, 2))); }
        if (h.kind === 'temple') { neon.circle(ctr.x, ctr.y, 2.4); lines.line(ctr, G.add(ctr, G.scale(G.add(u, v), 2.6))); }
        if (h.kind === 'mill' && h.turbine) neon.poly(h.turbine);
        continue;
      }
      if (h.sub === 'container') {
        cont.poly(h.poly);
        for (const s of G.stripes(G.insetConvex(h.box, 0.35), v, 1, 0.5)) lines.line(s[0], s[1]);
      } else if (h.sub === 'lean') {
        lean.poly(h.poly);
        lines.line(G.add(G.lerp(h.box[0], h.box[3], 0.3), G.scale(u, 0)), G.lerp(h.box[1], h.box[2], 0.3));
      } else {
        hut.poly(h.poly);
        lines.line(h.box[0], h.box[2]);
        lines.line(h.box[1], h.box[3]);
      }
      if (h.sign) neon.line(G.lerp(h.box[0], h.box[1], 0.2), G.lerp(h.box[0], h.box[1], 0.8));
    }
    svg.path(lean.toString(), { fill: pal.roof, stroke: pal.ink, strokeWidth: 0.45, strokeLinejoin: 'round' });
    svg.path(hut.toString(), { fill: pal.building, stroke: pal.ink, strokeWidth: 0.5, strokeLinejoin: 'round' });
    svg.path(cont.toString(), { fill: pal.buildingSpecial, stroke: pal.ink, strokeWidth: 0.45 });
    svg.path(spec.toString(), { fill: pal.buildingSpecial, stroke: pal.accent, strokeWidth: 1, strokeLinejoin: 'round' });
    svg.path(lines.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.25, opacity: 0.55 });

    // The barricade and its watchtowers.
    const wb = new Svg.Batch(), tb = new Svg.Batch();
    for (const p of m.wall) wb.poly(p);
    for (const p of m.towers) tb.poly(p);
    svg.path(wb.toString(), { fill: pal.inkSoft, stroke: pal.ink, strokeWidth: 0.45, strokeLinejoin: 'round' });
    svg.path(tb.toString(), { fill: pal.buildingSpecial, stroke: pal.accent, strokeWidth: 0.9 });
    const tl = new Svg.Batch();
    for (const p of m.towers) { const q = G.centroid(p); tl.circle(q.x, q.y, 0.9); }
    svg.path(tl.toString(), { fill: pal.accent });
    svg.path(neon.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 1, strokeLinecap: 'round' });
    svg.close();
    decorate(svg, m, o, pal);
    return svg.toString();
  }

  // Title, labels, road numbers, frame, compass and scale (present day and cyberpunk).
  function decorate(svg, m, o, pal) {
    const name = pal.titleCase === 'upper' ? m.name.toUpperCase() : m.name;
    if (o.preview) {
      Draw.label(svg, S / 2, 40, name, 30, pal, { title: true, haloWidth: 0.35 });
      return;
    }
    if (o.labels !== false) {
      Draw.title(svg, S / 2, 40, name, 26, pal, t('village.sub.' + (m.size || 'village')));
      const taken = [Draw.textBox(S / 2, 40, name, 26, { title: true }), Draw.textBox(S / 2, 62, 'x'.repeat(14), 11, {})];
      // Road numbers in small shields on the road itself.
      for (const l of m.landmarks) {
        if (!l.road) continue;
        const txt = t(l.key, l.params), w = txt.length * 4.6 + 6;
        const box = { x0: l.x - w / 2, x1: l.x + w / 2, y0: l.y - 5, y1: l.y + 5 };
        if (taken.some((b) => Draw.overlaps(b, box, 2))) continue;
        taken.push(box);
        svg.rect(box.x0, box.y0, w, 10, { rx: 2, fill: pal.paper, stroke: pal.ink, strokeWidth: 0.8 });
        svg.text(l.x, l.y + 0.4, txt, { fontFamily: pal.fontLabel || Draw.FONT_LABEL, fontSize: 7.5, fontWeight: 'bold', textAnchor: 'middle', dominantBaseline: 'middle', fill: pal.ink });
      }
      // Like Draw.placeLabels, but measured for the wider sans-serif and monospaced lettering.
      const wf = Carto.Setting.current === 'cyber' ? 0.62 : 0.54;
      for (const l of m.landmarks) {
        if (l.road) continue;
        const text = t(l.key, l.params), size = 9, w = text.length * size * wf;
        for (const [ox, oy] of [[0, 0], [0, -1.3], [0, 1.3], [1, 0], [-1, 0], [0, -2.4]]) {
          const anchor = ox > 0 ? 'start' : ox < 0 ? 'end' : 'middle';
          const x = l.x + ox * size * 0.6, y = l.y + 11 + oy * size;
          const x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
          const box = { x0, x1: x0 + w, y0: y - size * 0.55, y1: y + size * 0.55 };
          if (box.x0 < 10 || box.x1 > S - 10 || box.y0 < 10 || box.y1 > S - 40) continue;
          if (taken.some((b) => Draw.overlaps(b, box, 1.5))) continue;
          taken.push(box);
          Draw.label(svg, x, y, text, size, pal, { italic: true, anchor });
          break;
        }
      }
    }
    Draw.frame(svg, S, S, pal, 6);
    Draw.compass(svg, S - 36, S - 42, 17, pal);
    Draw.scaleBar(svg, 22, S - 30, 100, 100, 'm', pal);
  }

  function notes(m) {
    const esc = Svg.esc;
    const n = m.houses.filter((h) => h.kind === 'house').length;
    let h = '<h3>' + esc(m.name) + '</h3><dl>' +
      '<dt>' + esc(t('village.population')) + '</dt><dd>' + m.population + '</dd>' +
      '<dt>' + esc(t('village.houses')) + '</dt><dd>' + n + '</dd>' +
      (m.extra && m.extra.blocks ? '<dt>' + esc(t('village.blocks')) + '</dt><dd>' + m.extra.blocks + '</dd>' : '') +
      (m.extra && m.extra.mayor ? '<dt>' + esc(t('village.mayor')) + '</dt><dd>' + esc(m.extra.mayor) + '</dd>' : '') + '</dl><ul>';
    for (const l of m.landmarks) if (!l.road) h += '<li>' + esc(t(l.key, l.params)) + '</li>';
    h += '<li>' + esc(t('village.well')) + '</li>';
    return h + '</ul>';
  }

  Carto.register({
    id: 'village',
    order: 3,
    options: [
      { id: 'size', type: 'select', values: ['hamlet', 'village', 'large'], def: 'village' },
      { id: 'water', type: 'select', values: ['none', 'stream', 'pond'], def: 'stream' },
      { id: 'forest', type: 'bool', def: true },
      { id: 'fields', type: 'bool', def: true },
      { id: 'labels', type: 'bool', def: true, renderOnly: true },
      { id: 'name', type: 'text', def: '', hidden: true },
    ],
    generate,
    render,
    notes,
    fileName: (m) => m.name,
  });

  Carto.Village = { generate, render };
})(window.Carto = window.Carto || {});
