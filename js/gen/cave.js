/* Cave and glade generator: organic chambers joined by winding passages.
   The same shape is drawn either as a cave in hatched rock or as a clearing
   in a dense wood. */
(function (Carto) {
  'use strict';

  const G = Carto.G, Svg = Carto.Svg, Draw = Carto.Draw, t = Carto.t;
  const Contour = Carto.Contour;
  const I18n = Carto.I18n;

  I18n.add({
    it: {
      'gen.cave.name': 'Caverna',
      'gen.cave.desc': 'Grotte naturali o radure nel bosco: camere, passaggi, laghetti e una legenda dei luoghi.',
      'cave.opt.type': 'Tipo',
      'cave.opt.type.cave': 'Caverna',
      'cave.opt.type.glade': 'Radura',
      'cave.opt.size': 'Dimensione',
      'cave.opt.size.small': 'Piccola',
      'cave.opt.size.medium': 'Media',
      'cave.opt.size.large': 'Grande',
      'cave.opt.water': 'Acqua',
      'cave.opt.grid': 'Griglia',
      'cave.opt.numbers': 'Numeri',
      'cave.title.cave': 'Grotte di {n}',
      'cave.title.glade': 'Radura di {n}',
      'cave.entrance': 'Ingresso',
    },
    en: {
      'gen.cave.name': 'Cave',
      'gen.cave.desc': 'Natural caves or woodland glades: chambers, passages, pools and a key of places.',
      'cave.opt.type': 'Type',
      'cave.opt.type.cave': 'Cave',
      'cave.opt.type.glade': 'Glade',
      'cave.opt.size': 'Size',
      'cave.opt.size.small': 'Small',
      'cave.opt.size.medium': 'Medium',
      'cave.opt.size.large': 'Large',
      'cave.opt.water': 'Water',
      'cave.opt.grid': 'Grid',
      'cave.opt.numbers': 'Numbers',
      'cave.title.cave': 'Caves of {n}',
      'cave.title.glade': '{n} Glade',
      'cave.entrance': 'Entrance',
    },
  });

  // [italian, english]; the model stores indices only.
  const PLACES = {
    cave: {
      mouth: ['Imboccatura. La luce del giorno si spegne dopo pochi passi.', 'Mouth. Daylight fades after a few steps.'],
      dripstone: ['Sala delle stalattiti. Gocce cadono a ritmo regolare da punte di pietra.', 'Dripstone hall. Drops fall steadily from stone spikes.'],
      lake: ['Lago sotterraneo. Acqua nera e immobile, più profonda di quanto sembri.', 'Underground lake. Still black water, deeper than it looks.'],
      den: ['Tana. Ossa spezzate e un odore selvatico.', 'Den. Broken bones and a wild smell.'],
      spiders: ['Nido di ragni. Ragnatele spesse come vele chiudono il passaggio.', 'Spider nest. Webs as thick as sails block the way.'],
      fungi: ['Fungaia. Funghi pallidi illuminano la grotta di un verde tenue.', 'Fungus grove. Pale mushrooms light the cave in a faint green.'],
      crystals: ['Camera dei cristalli. Le pareti scintillano di quarzo violaceo.', 'Crystal chamber. The walls glitter with violet quartz.'],
      bats: ['Colonia di pipistrelli. Il soffitto si muove; il suolo è coperto di guano.', 'Bat roost. The ceiling moves; the floor is covered in guano.'],
      shrine: ['Altare dimenticato. Una pietra piatta reca incisioni antichissime.', 'Forgotten altar. A flat stone bears ancient carvings.'],
      camp: ['Accampamento abbandonato. Ceneri fredde e un sacco a pelo strappato.', 'Abandoned camp. Cold ashes and a torn bedroll.'],
      chasm: ['Crepaccio. Una fenditura senza fondo divide la sala.', 'Chasm. A bottomless crack splits the hall.'],
      echo: ['Sala dell’eco. Ogni sussurro torna indietro moltiplicato.', 'Echo hall. Every whisper comes back many times over.'],
      hoard: ['Tesoro. Monete sparse tra le ossa di avventurieri sfortunati.', 'Hoard. Coins scattered among the bones of unlucky adventurers.'],
    },
    glade: {
      mouth: ['Sentiero. Un passaggio tra i rovi porta nella radura.', 'Trail. A path through the brambles leads into the glade.'],
      stones: ['Cerchio di pietre. Sette menhir coperti di licheni.', 'Stone circle. Seven lichen-covered standing stones.'],
      spring: ['Sorgente. Acqua limpida sgorga tra le radici.', 'Spring. Clear water wells up among the roots.'],
      oak: ['Quercia cava. Nel tronco c’è spazio per una persona in piedi.', 'Hollow oak. There is room for a standing person inside its trunk.'],
      camp: ['Bivacco di cacciatori. Pelli stese ad asciugare e un fuoco ancora caldo.', 'Hunters’ camp. Hides stretched to dry and a fire still warm.'],
      fairy: ['Anello di funghi. Chi entra nel cerchio sente una musica lontana.', 'Fairy ring. Whoever steps inside hears distant music.'],
      hut: ['Capanna. Una baracca di frasche, dimora di un eremita.', 'Hut. A shack of branches, home to a hermit.'],
      graves: ['Tumuli. Bassi rilievi d’erba coprono tombe antiche.', 'Barrows. Low grassy mounds cover ancient graves.'],
      thicket: ['Macchia. Cespugli fitti, dove qualcosa respira.', 'Thicket. Dense bushes where something breathes.'],
      altar: ['Altare druidico. Una pietra piatta macchiata di vino e sangue.', 'Druid altar. A flat stone stained with wine and blood.'],
      pond: ['Stagno. Rane e libellule; sul fondo luccica qualcosa.', 'Pond. Frogs and dragonflies; something glints on the bottom.'],
    },
  };
  const WEIGHTS = {
    cave: { dripstone: 3, lake: 1.5, den: 1.5, spiders: 1, fungi: 1.5, crystals: 1, bats: 1, shrine: 0.7, camp: 1, chasm: 0.8, echo: 1 },
    glade: { stones: 1.2, spring: 1, oak: 1.2, camp: 1.5, fairy: 1, hut: 1, graves: 0.8, thicket: 1.5, altar: 0.7, pond: 1.2 },
  };
  const WATERY = { lake: 1, spring: 1, pond: 1 };
  // [it, en] creature lines, chosen with a probability per chamber.
  const DWELLERS = {
    cave: [['Vi dorme un orso delle caverne.', 'A cave bear sleeps here.'], ['Tre coboldi fanno la guardia.', 'Three kobolds stand guard.'], ['Una melma grigia striscia lungo le pareti.', 'A grey ooze creeps along the walls.'], ['Trogloditi in agguato dietro le rocce.', 'Troglodytes lurk behind the rocks.'], ['Uno sciame di pipistrelli giganti.', 'A swarm of giant bats.'], ['Un ragno gigante attende immobile.', 'A giant spider waits, motionless.']],
    glade: [['Un branco di lupi riposa all’ombra.', 'A wolf pack rests in the shade.'], ['Folletti dispettosi osservano dai rami.', 'Mischievous sprites watch from the branches.'], ['Banditi hanno teso qui un’imboscata.', 'Bandits have set an ambush here.'], ['Un cervo bianco appare e scompare.', 'A white stag appears and vanishes.'], ['Un druido raccoglie erbe in silenzio.', 'A druid gathers herbs in silence.'], ['Un orso cerca miele nei tronchi.', 'A bear looks for honey in the trunks.']],
  };

  const GW = 120, GH = 90, CELL = 5;
  const W = GW * CELL, H = GH * CELL;

  function generate(seed, opts) {
    const rng = new Carto.Random(seed);
    const type = opts.type || 'cave';
    const noise = new Carto.Noise(rng.fork('noise'));
    const count = { small: [4, 5], medium: [6, 8], large: [9, 12] }[opts.size] || [6, 8];
    const n = rng.int(count[0], count[1]);

    // Chambers.
    const cr = rng.fork('chambers');
    // One chamber per cell of a coarse grid, so the cave spreads over the sheet.
    const chambers = [];
    const cols = Math.ceil(Math.sqrt((n * GW) / GH)), rows = Math.ceil(n / cols);
    const slots = cr.shuffle(Array.from({ length: cols * rows }, (_, i) => i)).slice(0, n);
    const sw = (GW - 12) / cols, sh = (GH - 16) / rows;
    for (const slot of slots) {
      const sx = slot % cols, sy = Math.floor(slot / cols);
      for (let tries = 0; tries < 30; tries++) {
        const r = Math.min(cr.float(type === 'glade' ? 6 : 5, type === 'glade' ? 11 : 10), Math.min(sw, sh) * 0.42);
        const x = 6 + sx * sw + cr.float(r, sw - r), y = 10 + sy * sh + cr.float(r, sh - r);
        if (chambers.some((c) => Math.hypot(c.x - x, c.y - y) < c.r + r + 4)) continue;
        chambers.push({ x, y, r });
        break;
      }
    }

    // Passages: minimum spanning tree plus a few loops.
    const links = [];
    const inTree = [0];
    const rest = chambers.map((_, i) => i).slice(1);
    const d = (a, b) => Math.hypot(chambers[a].x - chambers[b].x, chambers[a].y - chambers[b].y);
    while (rest.length) {
      let best = null;
      for (const a of inTree) for (const b of rest) if (!best || d(a, b) < best[2]) best = [a, b, d(a, b)];
      links.push(best);
      inTree.push(best[1]);
      rest.splice(rest.indexOf(best[1]), 1);
    }
    const extra = cr.int(1, Math.max(1, Math.floor(n / 3)));
    for (let k = 0; k < extra; k++) {
      const a = cr.int(0, n - 1), b = cr.int(0, n - 1);
      if (a === b || links.some((l) => (l[0] === a && l[1] === b) || (l[0] === b && l[1] === a)) || d(a, b) > 45) continue;
      links.push([a, b, d(a, b)]);
    }

    // Entrance: the chamber nearest to an edge opens off the sheet.
    let ent = 0, ed = Infinity, edgeP = null;
    chambers.forEach((c, i) => {
      const cand = [[c.x, -6], [c.x, GH + 6], [-6, c.y], [GW + 6, c.y]];
      for (const [ex, ey] of cand) {
        const dd = Math.hypot(ex - c.x, ey - c.y);
        if (dd < ed) { ed = dd; ent = i; edgeP = { x: ex, y: ey }; }
      }
    });

    // Carve a scalar field: cones for chambers, tubes for passages, plus noise.
    const f = new Float32Array(GW * GH).fill(-1);
    const carve = (cx, cy, r, wob) => {
      const R = Math.ceil(r * 1.5);
      for (let y = Math.max(0, Math.floor(cy - R)); y <= Math.min(GH - 1, Math.ceil(cy + R)); y++) {
        for (let x = Math.max(0, Math.floor(cx - R)); x <= Math.min(GW - 1, Math.ceil(cx + R)); x++) {
          const rr = r * (1 + wob * noise.get(x * 0.15 + 7, y * 0.15 - 3));
          const v = 1 - Math.hypot(x - cx, y - cy) / rr;
          const i = x + y * GW;
          if (v > f[i]) f[i] = v;
        }
      }
    };
    for (const c of chambers) carve(c.x, c.y, c.r, 0.3);
    const passages = [];
    const tube = (a, b, wide) => {
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const ctrl = G.add(mid, G.scale(G.norm(G.perp(G.sub(b, a))), cr.float(-0.35, 0.35) * len));
      const pts = [];
      const steps = Math.ceil(len * 2);
      for (let s = 0; s <= steps; s++) {
        const tt = s / steps;
        const p = { x: (1 - tt) * (1 - tt) * a.x + 2 * (1 - tt) * tt * ctrl.x + tt * tt * b.x, y: (1 - tt) * (1 - tt) * a.y + 2 * (1 - tt) * tt * ctrl.y + tt * tt * b.y };
        pts.push(p);
        const r = wide * (0.8 + 0.4 * (noise.get(p.x * 0.2, p.y * 0.2 + 50) + 1) / 2);
        carve(p.x, p.y, r, 0.1);
      }
      passages.push(pts);
    };
    for (const [a, b] of links) tube(chambers[a], chambers[b], cr.float(type === 'glade' ? 2.6 : 2.2, type === 'glade' ? 4 : 3.5));
    tube(chambers[ent], edgeP, type === 'glade' ? 3 : 2.6);
    for (let i = 0; i < f.length; i++) {
      const x = i % GW, y = (i - x) / GW;
      f[i] += 0.16 * noise.fbm(x * 0.11 + 100, y * 0.11, 3);
    }
    const level = 0.12;

    // Keep the main connected region only.
    const mask = Uint8Array.from(f, (v) => (v >= level ? 1 : 0));
    const seen = new Int32Array(GW * GH).fill(-1);
    let bestComp = -1, bestSize = 0, comp = 0;
    for (let i = 0; i < mask.length; i++) {
      if (!mask[i] || seen[i] >= 0) continue;
      let size = 0;
      const stack = [i];
      seen[i] = comp;
      while (stack.length) {
        const c = stack.pop();
        size++;
        const x = c % GW, y = (c - x) / GW;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
          const j = nx + ny * GW;
          if (mask[j] && seen[j] < 0) { seen[j] = comp; stack.push(j); }
        }
      }
      if (size > bestSize) { bestSize = size; bestComp = comp; }
      comp++;
    }
    for (let i = 0; i < f.length; i++) if (seen[i] !== bestComp) { f[i] = Math.min(f[i], level - 0.05); mask[i] = 0; }

    const outline = Contour.trace(f, GW, GH, level, CELL, CELL / 2, CELL / 2).filter((l) => l.points.length > 4);
    const dist = Contour.distanceField(mask, GW, GH);

    // Chamber purposes, numbering from the entrance outward.
    const pr = rng.fork('places');
    const adj = chambers.map(() => []);
    for (const [a, b] of links) { adj[a].push(b); adj[b].push(a); }
    const orderIdx = [ent];
    for (let k = 0; k < orderIdx.length; k++) for (const nb of adj[orderIdx[k]]) if (!orderIdx.includes(nb)) orderIdx.push(nb);
    for (let i = 0; i < chambers.length; i++) if (!orderIdx.includes(i)) orderIdx.push(i);
    const weights = Object.entries(WEIGHTS[type]).filter(([k]) => opts.water !== false || !WATERY[k]);
    const used = {};
    orderIdx.forEach((ci, k) => {
      const c = chambers[ci];
      c.num = k + 1;
      if (k === 0) c.kind = 'mouth';
      else if (type === 'cave' && k === orderIdx.length - 1 && pr.bool(0.5)) c.kind = 'hoard';
      else {
        const avail = weights.filter(([kk]) => !used[kk] || kk === 'dripstone' || kk === 'thicket' || kk === 'camp');
        c.kind = pr.weighted(avail.length ? avail : weights);
      }
      used[c.kind] = 1;
      if (k > 0 && pr.bool(0.4)) c.dweller = pr.int(0, DWELLERS[type].length - 1);
    });

    // Features.
    const fr = rng.fork('features');
    const water = [], rocks = [], spikes = [], marks = [], webs = [], crystals = [], shrooms = [], fires = [], stones = [], bigTrees = [], huts = [], mounds = [], chasms = [];
    const floorAt = (x, y) => {
      const gx = Math.round(x / CELL - 0.5), gy = Math.round(y / CELL - 0.5);
      return gx >= 0 && gy >= 0 && gx < GW && gy < GH && mask[gx + gy * GW] && dist[gx + gy * GW] === 0;
    };
    const wallDist = Contour.distanceField(Uint8Array.from(mask, (v) => 1 - v), GW, GH);
    const deep = (x, y, m) => {
      const gx = Math.round(x / CELL - 0.5), gy = Math.round(y / CELL - 0.5);
      return gx >= 0 && gy >= 0 && gx < GW && gy < GH && wallDist[gx + gy * GW] >= m;
    };
    for (const c of chambers) {
      const cx = (c.x + 0.5) * CELL, cy = (c.y + 0.5) * CELL, R = c.r * CELL;
      const scatter = (k, minWall, fn) => {
        for (let i = 0, tries = 0; i < k && tries < k * 20; tries++) {
          const a = fr.float(0, Math.PI * 2), rr = Math.sqrt(fr.next()) * R * 0.85;
          const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
          if (!deep(x, y, minWall)) continue;
          fn(x, y);
          i++;
        }
      };
      switch (c.kind) {
        case 'lake': case 'pond': case 'spring':
          if (opts.water !== false) water.push({ pts: Draw.blob(fr, cx, cy, R * (c.kind === 'spring' ? 0.35 : 0.6), 12, 0.35) });
          break;
        case 'dripstone': scatter(14, 1, (x, y) => spikes.push({ x, y, r: fr.float(1.2, 3) })); break;
        case 'crystals': scatter(10, 0.5, (x, y) => crystals.push({ x, y, r: fr.float(2, 4), a: fr.float(0, Math.PI) })); break;
        case 'fungi': case 'fairy':
          if (c.kind === 'fairy') { for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; shrooms.push({ x: cx + Math.cos(a) * R * 0.4, y: cy + Math.sin(a) * R * 0.4, r: fr.float(1, 1.8) }); } }
          else scatter(18, 0.5, (x, y) => shrooms.push({ x, y, r: fr.float(1, 3) }));
          break;
        case 'spiders': for (let i = 0; i < 2; i++) webs.push({ x: cx + fr.float(-R, R) * 0.4, y: cy + fr.float(-R, R) * 0.4, r: R * 0.45, a: fr.float(0, Math.PI) }); break;
        case 'den': case 'hoard': scatter(9, 1, (x, y) => marks.push({ x, y, a: fr.float(0, Math.PI), coin: c.kind === 'hoard' && fr.bool(0.6) })); break;
        case 'shrine': case 'altar': stones.push({ x: cx, y: cy, w: 12, h: 7, slab: true }); break;
        case 'stones': for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; stones.push({ x: cx + Math.cos(a) * R * 0.5, y: cy + Math.sin(a) * R * 0.5, w: 4.5, h: 4.5 }); } break;
        case 'camp': fires.push({ x: cx, y: cy }); break;
        case 'oak': bigTrees.push({ x: cx, y: cy, r: R * 0.32 }); break;
        case 'hut': huts.push({ x: cx + R * 0.2, y: cy, a: fr.float(0, Math.PI) }); break;
        case 'graves': for (let i = 0; i < 3; i++) mounds.push({ x: cx + fr.float(-0.4, 0.4) * R, y: cy + fr.float(-0.4, 0.4) * R, a: fr.float(0, Math.PI) }); break;
        case 'chasm': {
          const a = fr.float(0, Math.PI);
          const u = G.fromAngle(a), v = G.perp(u);
          const pts = [];
          for (let s = -1; s <= 1.001; s += 0.25) pts.push(G.add({ x: cx, y: cy }, G.add(G.scale(u, s * R * 0.9), G.scale(v, fr.float(-2, 2) + (1 - Math.abs(s)) * 4))));
          for (let s = 1; s >= -1.001; s -= 0.25) pts.push(G.add({ x: cx, y: cy }, G.add(G.scale(u, s * R * 0.9), G.scale(v, fr.float(-2, 2) - (1 - Math.abs(s)) * 4))));
          chasms.push(pts);
          break;
        }
      }
    }
    // Loose rocks along the walls everywhere.
    for (const p of G.poissonDisc(fr, 0, 0, W, H, 14)) {
      if (!floorAt(p.x, p.y) || deep(p.x, p.y, 2.2) || !fr.bool(type === 'glade' ? 0.25 : 0.45)) continue;
      rocks.push({ x: p.x, y: p.y, r: fr.float(1.4, 3.4) });
    }

    const name = Carto.Names.place(rng.fork('name'));
    return {
      seed, type, name, chambers: orderIdx.map((i) => chambers[i]), outline, mask, dist, passages,
      edge: { x: (edgeP.x + 0.5) * CELL, y: (edgeP.y + 0.5) * CELL, from: { x: (chambers[ent].x + 0.5) * CELL, y: (chambers[ent].y + 0.5) * CELL } },
      water, rocks, spikes, marks, webs, crystals, shrooms, fires, stones, bigTrees, huts, mounds, chasms,
    };
  }

  function render(m, o) {
    const pal = o.palette;
    const glade = m.type === 'glade';
    const svg = new Svg(W, H);
    const clip = Carto.uid('caveclip');
    svg.defs('<clipPath id="' + clip + '"><rect width="' + W + '" height="' + H + '"/></clipPath>');
    svg.rect(0, 0, W, H, { fill: glade ? pal.green : pal.paper });
    svg.open({ clipPath: 'url(#' + clip + ')' });

    const shape = new Svg.Batch();
    for (const l of m.outline) shape.smooth(G.chaikin(l.points, 2, l.closed), l.closed);
    const sd = shape.toString();
    const floorClip = Carto.uid('floor');
    svg.defs('<clipPath id="' + floorClip + '"><path d="' + sd + '" clip-rule="evenodd"/></clipPath>');
    const rng = new Carto.Random(m.seed + 7);
    const distAt = (x, y) => {
      const gx = Math.max(0, Math.min(GW - 1, Math.round(x / CELL - 0.5))), gy = Math.max(0, Math.min(GH - 1, Math.round(y / CELL - 0.5)));
      return m.dist[gx + gy * GW];
    };

    if (!glade) {
      // Rock hatching hugging the walls.
      const hatch = new Svg.Batch();
      for (let y = 0; y < H; y += 7) {
        for (let x = 0; x < W; x += 7) {
          const px = x + rng.next() * 7, py = y + rng.next() * 7;
          const d = distAt(px, py);
          if (d === 0 || d > 3.2) continue;
          if (d > 2 && !rng.bool(0.5)) continue;
          Draw.hatchCluster(hatch, rng, px, py, 9, rng.float(0, Math.PI), 3);
        }
      }
      svg.path(hatch.toString(), { stroke: pal.hatch, strokeWidth: 0.8, strokeLinecap: 'round', fill: 'none', opacity: 0.85 });
      svg.path(sd, { fill: pal.floor, stroke: pal.ink, strokeWidth: 3.2, fillRule: 'evenodd', strokeLinejoin: 'round' });
    } else {
      svg.path(sd, { fill: pal.field, fillRule: 'evenodd' });
      svg.path(sd, { fill: pal.green, fillRule: 'evenodd', opacity: 0.45 });
    }

    svg.open({ clipPath: 'url(#' + floorClip + ')' });
    if (o.grid !== false && !glade) {
      const grid = new Svg.Batch();
      for (let x = 0; x <= W; x += 15) grid.line({ x, y: 0 }, { x, y: H });
      for (let y = 0; y <= H; y += 15) grid.line({ x: 0, y }, { x: W, y });
      svg.path(grid.toString(), { stroke: pal.grid, strokeWidth: 0.5, fill: 'none' });
    }
    if (glade) {
      // Grass tufts and the trodden paths.
      const tufts = new Svg.Batch();
      for (const p of G.poissonDisc(rng, 0, 0, W, H, 11)) {
        if (distAt(p.x, p.y) !== 0) continue;
        tufts.line(p, { x: p.x - 1.4, y: p.y - 2.6 });
        tufts.line(p, { x: p.x + 1.2, y: p.y - 2.8 });
      }
      svg.path(tufts.toString(), { stroke: pal.greenInk, strokeWidth: 0.6, fill: 'none', opacity: 0.8 });
      const paths = new Svg.Batch();
      for (const ps of m.passages) paths.smooth(ps.map((p) => ({ x: (p.x + 0.5) * CELL, y: (p.y + 0.5) * CELL })).filter((_, i) => i % 3 === 0), false);
      svg.path(paths.toString(), { stroke: pal.fieldInk, strokeWidth: 2.4, fill: 'none', strokeDasharray: '5 4', strokeLinecap: 'round', opacity: 0.8 });
    }
    // Water.
    const wb = new Svg.Batch(), wr = new Svg.Batch();
    for (const w of m.water) { wb.smooth(w.pts, true); wr.smooth(G.scalePoly(w.pts, 0.72), true); wr.smooth(G.scalePoly(w.pts, 0.45), true); }
    svg.path(wb.toString(), { fill: pal.water, stroke: pal.waterInk, strokeWidth: 1 });
    svg.path(wr.toString(), { fill: 'none', stroke: pal.waterInk, strokeWidth: 0.6, opacity: 0.6 });
    // Chasms.
    const ch = new Svg.Batch();
    for (const c of m.chasms) ch.smooth(c, true);
    svg.path(ch.toString(), { fill: pal.ink, stroke: pal.ink, strokeWidth: 1 });
    svg.close();

    // Furniture of the places.
    const light = new Svg.Batch(), thin = new Svg.Batch(), dark = new Svg.Batch(), green = new Svg.Batch(), accent = new Svg.Batch(), gold = new Svg.Batch();
    for (const r of m.rocks) light.poly(Draw.blob(rng, r.x, r.y, r.r, 6, 0.45));
    for (const s of m.spikes) { light.circle(s.x, s.y, s.r); dark.circle(s.x, s.y, s.r * 0.35); }
    for (const c of m.crystals) accent.poly([G.add(c, G.fromAngle(c.a, c.r)), G.add(c, G.fromAngle(c.a + Math.PI / 2, c.r * 0.45)), G.add(c, G.fromAngle(c.a + Math.PI, c.r)), G.add(c, G.fromAngle(c.a - Math.PI / 2, c.r * 0.45))]);
    for (const s of m.shrooms) green.circle(s.x, s.y, s.r);
    for (const w of m.webs) {
      for (let i = 0; i < 8; i++) thin.line(w, G.add(w, G.fromAngle(w.a + (i * Math.PI) / 4, w.r)));
      for (const k of [0.35, 0.65, 0.95]) {
        const ring = [];
        for (let i = 0; i < 8; i++) ring.push(G.add(w, G.fromAngle(w.a + (i * Math.PI) / 4, w.r * k)));
        thin.poly(ring);
      }
    }
    for (const mk of m.marks) {
      if (mk.coin) gold.circle(mk.x, mk.y, 1.3);
      else { const d = G.fromAngle(mk.a, 3); thin.line(G.sub(mk, d), G.add(mk, d)); }
    }
    for (const s of m.stones) light.poly(s.slab ? G.rect(s.x, s.y, s.w, s.h, 0.2) : Draw.blob(rng, s.x, s.y, s.w / 2, 7, 0.3));
    for (const f of m.fires) {
      dark.circle(f.x, f.y, 3.2);
      accent.circle(f.x, f.y, 1.6);
      light.poly(G.rect(f.x + 9, f.y + 2, 9, 4, 0.4));
    }
    for (const h of m.huts) {
      const r = G.rect(h.x, h.y, 14, 10, h.a);
      light.poly(r);
      thin.line(G.mid(r[0], r[3]), G.mid(r[1], r[2]));
    }
    for (const mo of m.mounds) light.smooth(G.rect(mo.x, mo.y, 14, 7, mo.a), true);
    svg.path(light.toString(), { fill: pal.rock, stroke: pal.ink, strokeWidth: 0.8, strokeLinejoin: 'round' });
    svg.path(green.toString(), { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.6 });
    svg.path(accent.toString(), { fill: pal.accent, stroke: pal.ink, strokeWidth: 0.6, opacity: 0.85 });
    svg.path(gold.toString(), { fill: pal.accent, stroke: pal.ink, strokeWidth: 0.4 });
    svg.path(dark.toString(), { fill: pal.inkSoft });
    svg.path(thin.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.6 });

    if (glade) {
      // The wood: bushes along the edge, then a canopy of crowns.
      const bushes = new Svg.Batch(), crowns = new Svg.Batch();
      const pts = G.poissonDisc(rng, -10, -10, W + 20, H + 20, 7.5);
      const trees = [];
      for (const p of pts) {
        const d = distAt(p.x, p.y);
        if (d === 0) continue;
        if (d <= 1.2) { if (rng.bool(0.7)) bushes.smooth(Draw.blob(rng, p.x, p.y, rng.float(2.5, 4.2), 7, 0.3), true); }
        else trees.push({ x: p.x, y: p.y, r: rng.float(6, 9) });
      }
      for (const b of m.bigTrees) trees.push({ x: b.x, y: b.y, r: b.r, big: true });
      trees.sort((a, b) => a.y - b.y);
      for (const tr of trees) crowns.smooth(Draw.crown(rng, tr.x, tr.y, tr.r), true);
      svg.path(bushes.toString(), { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.6 });
      svg.path(crowns.toString(), { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.8 });
    }
    svg.close();

    // Numbers, entrance and title.
    const taken = [];
    if (o.numbers !== false) {
      for (const c of m.chambers) {
        const x = (c.x + 0.5) * CELL, y = (c.y + 0.5) * CELL;
        Draw.label(svg, x, y, String(c.num), 13, pal, { title: true, haloColor: glade ? pal.field : pal.floor, haloWidth: 0.45 });
        taken.push(Draw.textBox(x, y, String(c.num), 13, { title: true }));
      }
    }
    if (!o.preview) {
      const title = t('cave.title.' + m.type, { n: m.name });
      Draw.title(svg, W / 2, 30, title, 22, pal);
      taken.push(Draw.textBox(W / 2, 30, title, 22, { title: true }));
      const e = m.edge;
      const ex = Math.max(14, Math.min(W - 14, e.x)), ey = Math.max(16, Math.min(H - 14, e.y));
      const inward = G.norm(G.sub(e.from, { x: ex, y: ey }));
      const lx = ex + inward.x * 18, ly = ey + inward.y * 18;
      Draw.placeLabels(svg, [{
        x: lx, y: ly, text: t('cave.entrance'), size: 12, italic: true,
        offsets: [[0, 0], [0, -1.4], [0, 1.4], [1, 0], [-1, 0], [0, -2.6], [0, 2.6]], gap: 12,
      }], Object.assign({}, pal, { paper: glade ? pal.green : pal.paper }), taken, { x0: 8, y0: 8, x1: W - 8, y1: H - 8 });
      Draw.frame(svg, W, H, pal, 5);
      Draw.scaleBar(svg, 20, H - 26, 75, 50, I18n.lang === 'it' ? 'piedi' : 'ft', pal, 5);
    }
    return svg.toString();
  }

  function notes(m) {
    const esc = Svg.esc;
    const l = I18n.lang === 'it' ? 0 : 1;
    let h = '<h3>' + esc(t('cave.title.' + m.type, { n: m.name })) + '</h3><ol>';
    for (const c of m.chambers) {
      const txt = PLACES[m.type][c.kind][l];
      const dot = txt.indexOf('. ');
      h += '<li value="' + c.num + '"><strong>' + esc(txt.slice(0, dot)) + '.</strong> ' + esc(txt.slice(dot + 2)) +
        (c.dweller !== undefined ? ' ' + esc(DWELLERS[m.type][c.dweller][l]) : '') + '</li>';
    }
    return h + '</ol>';
  }

  Carto.register({
    id: 'cave',
    order: 4,
    options: [
      { id: 'type', type: 'select', values: ['cave', 'glade'], def: 'cave' },
      { id: 'size', type: 'select', values: ['small', 'medium', 'large'], def: 'medium' },
      { id: 'water', type: 'bool', def: true },
      { id: 'grid', type: 'bool', def: true, renderOnly: true },
      { id: 'numbers', type: 'bool', def: true, renderOnly: true },
    ],
    generate,
    render,
    notes,
    fileName: (m) => t('cave.title.' + m.type, { n: m.name }),
  });

  Carto.Cave = { generate, render };
})(window.Carto = window.Carto || {});
