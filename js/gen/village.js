/* Village generator: houses strung along winding roads, a square with a well,
   a temple, an inn, a mill on the stream, and a patchwork of fields. */
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
    return {
      seed, name, size: opts.size, c, roads, stream, pond, bridges, square, houses, mill, fields, woods, trees, landmarks,
      population: Math.round(houses.filter((h) => h.kind === 'house').length * 4.6 / 5) * 5,
    };
  }

  function render(m, o) {
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
        Draw.title(svg, S / 2, 40, m.name, 26, pal, t('village.sub.' + (m.size || 'village')));
        taken.push(Draw.textBox(S / 2, 40, m.name, 26, { title: true }), Draw.textBox(S / 2, 62, 'x'.repeat(14), 11, {}));
        const labels = m.landmarks.map((l) => ({ x: l.x, y: l.y + 11, text: t(l.key), size: 10, italic: true }));
        Draw.placeLabels(svg, labels, pal, taken, { x0: 10, y0: 10, x1: S - 10, y1: S - 40 });
      }
      Draw.frame(svg, S, S, pal, 6);
      Draw.compass(svg, S - 36, S - 42, 17, pal);
      Draw.scaleBar(svg, 22, S - 30, 50, 50, 'm', pal);
    } else {
      Draw.label(svg, S / 2, 40, m.name, 30, pal, { title: true, haloWidth: 0.35 });
    }
    return svg.toString();
  }

  function notes(m) {
    const esc = Svg.esc;
    const n = m.houses.filter((h) => h.kind === 'house').length;
    let h = '<h3>' + esc(m.name) + '</h3><dl>' +
      '<dt>' + esc(t('village.population')) + '</dt><dd>' + m.population + '</dd>' +
      '<dt>' + esc(t('village.houses')) + '</dt><dd>' + n + '</dd></dl><ul>';
    for (const l of m.landmarks) h += '<li>' + esc(t(l.key)) + '</li>';
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
