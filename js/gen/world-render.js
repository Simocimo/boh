/* World generator, drawing side: views, layers, labels, the key and the
   click inspector. The model comes from world.js. */
(function (Carto) {
  'use strict';

  const G = Carto.G, Svg = Carto.Svg, Draw = Carto.Draw, t = Carto.t, I18n = Carto.I18n;
  const World = Carto.World;
  const L = () => (I18n.lang === 'it' ? 0 : 1);

  I18n.add({
    it: {
      'gen.world.name': 'Mondo',
      'gen.world.desc': 'Interi continenti con clima, biomi, fiumi, culture, stati, province, religioni, città e rotte. Clicca la mappa per esplorarla.',
      'world.group.terrain': 'Terre e clima',
      'world.group.people': 'Popoli e stati',
      'world.group.view': 'Vista e livelli',
      'world.opt.template': 'Forma delle terre',
      'world.opt.template.continents': 'Continenti',
      'world.opt.template.pangea': 'Pangea',
      'world.opt.template.archipelago': 'Arcipelago',
      'world.opt.template.island': 'Isola',
      'world.opt.template.mediterranean': 'Mediterraneo',
      'world.opt.template.peninsula': 'Penisola',
      'world.opt.template.volcano': 'Vulcano',
      'world.opt.cells': 'Dettaglio',
      'world.opt.cells.low': 'Basso',
      'world.opt.cells.medium': 'Medio',
      'world.opt.cells.high': 'Alto',
      'world.opt.climate': 'Clima',
      'world.opt.climate.cold': 'Freddo',
      'world.opt.climate.temperate': 'Temperato',
      'world.opt.climate.warm': 'Caldo',
      'world.opt.states': 'Stati',
      'world.opt.cultures': 'Culture',
      'world.opt.religions': 'Religioni organizzate',
      'world.opt.towns': 'Città',
      'world.opt.towns.few': 'Poche',
      'world.opt.towns.normal': 'Normali',
      'world.opt.towns.many': 'Molte',
      'world.opt.view': 'Vista',
      'world.opt.view.political': 'Politica',
      'world.opt.view.biomes': 'Biomi',
      'world.opt.view.heightmap': 'Rilievo',
      'world.opt.view.cultures': 'Culture',
      'world.opt.view.religions': 'Religioni',
      'world.opt.view.provinces': 'Province',
      'world.opt.relief': 'Icone del rilievo',
      'world.opt.rivers': 'Fiumi',
      'world.opt.borders': 'Confini',
      'world.opt.roads': 'Strade e rotte',
      'world.opt.burgs': 'Città',
      'world.opt.markers': 'Luoghi notevoli',
      'world.opt.labels': 'Nomi',
      'world.opt.grid': 'Meridiani e paralleli',
      'world.hint': 'Clicca un punto della mappa per sapere cosa c’è: bioma, clima, stato, cultura, città.',
      'world.ocean': 'Oceano {n}',
      'world.sea': 'Mare di {n}',
      'world.lake': 'Lago {n}',
      'world.river': 'Fiume {n}',
      'world.states': 'Stati',
      'world.cultures': 'Culture',
      'world.religions': 'Religioni',
      'world.burgs': 'Città principali',
      'world.markers': 'Luoghi notevoli',
      'world.diplomacy': 'Diplomazia',
      'world.capital': 'Capitale',
      'world.area': 'Superficie',
      'world.population': 'Popolazione',
      'world.culture': 'Cultura',
      'world.religion': 'Religione',
      'world.state': 'Stato',
      'world.province': 'Provincia',
      'world.biome': 'Bioma',
      'world.elevation': 'Altitudine',
      'world.depth': 'Profondità',
      'world.temperature': 'Temperatura media',
      'world.precipitation': 'Precipitazioni',
      'world.coords': 'Coordinate',
      'world.port': 'Porto',
      'world.town': 'Città',
      'world.village': 'Villaggio',
      'world.free': 'Terre libere',
      'world.inhabitants': '{n} abitanti',
      'world.openCity': 'Apri la pianta della città',
      'world.openVillage': 'Apri la pianta del villaggio',
      'world.openDungeon': 'Apri la mappa del dungeon',
      'world.openCave': 'Apri la mappa della caverna',
      'world.river.label': 'Fiume',
      'world.lands': 'Terre emerse',
      'world.sub.political': 'carta politica',
      'world.sub.biomes': 'carta dei biomi',
      'world.sub.heightmap': 'carta fisica',
      'world.sub.cultures': 'carta delle culture',
      'world.sub.religions': 'carta delle religioni',
      'world.sub.provinces': 'carta delle province',
      'world.folk': 'Antica fede {n}',
      'form.kingdom': 'Regno di {n}', 'form.empire': 'Impero di {n}', 'form.duchy': 'Ducato di {n}', 'form.principality': 'Principato di {n}',
      'form.county': 'Contea di {n}', 'form.march': 'Marca di {n}', 'form.republic': 'Repubblica di {n}', 'form.khaganate': 'Khaganato di {n}',
      'form.sultanate': 'Sultanato di {n}', 'form.emirate': 'Emirato di {n}', 'form.grandduchy': 'Granducato di {n}', 'form.theocracy': 'Teocrazia di {n}',
      'prov.0': 'Provincia di {n}', 'prov.1': 'Contado di {n}', 'prov.2': 'Marca di {n}', 'prov.3': 'Baronia di {n}', 'prov.4': 'Viscontea di {n}',
      'rel.0': 'Chiesa di {n}', 'rel.1': 'Fede di {n}', 'rel.2': 'Via di {n}', 'rel.3': 'Ordine di {n}', 'rel.4': 'Luce di {n}', 'rel.5': 'Figli di {n}', 'rel.6': 'Tempio di {n}',
      'cult.0': 'Culto di {n}', 'cult.1': 'Setta di {n}', 'cult.2': 'Misteri di {n}', 'cult.3': 'Occhio di {n}', 'cult.4': 'Fratellanza di {n}', 'cult.5': 'Vincolo di {n}', 'cult.6': 'Voce di {n}',
      'ctype.naval': 'marinara', 'ctype.highland': 'montanara', 'ctype.nomadic': 'nomade', 'ctype.hunting': 'di cacciatori', 'ctype.river': 'fluviale', 'ctype.generic': 'agricola',
      'rtype.folk': 'tradizionale', 'rtype.organized': 'organizzata', 'rtype.cult': 'culto',
      'relation.ally': 'alleati', 'relation.friendly': 'amici', 'relation.neutral': 'neutrali', 'relation.suspicion': 'diffidenti', 'relation.rival': 'rivali', 'relation.war': 'in guerra',
      'biome.marine': 'Mare', 'biome.hotDesert': 'Deserto caldo', 'biome.coldDesert': 'Deserto freddo', 'biome.savanna': 'Savana', 'biome.grassland': 'Prateria',
      'biome.tropicalSeasonal': 'Foresta tropicale stagionale', 'biome.temperateDeciduous': 'Foresta temperata', 'biome.tropicalRainforest': 'Foresta pluviale tropicale',
      'biome.temperateRainforest': 'Foresta pluviale temperata', 'biome.taiga': 'Taiga', 'biome.tundra': 'Tundra', 'biome.glacier': 'Ghiacciaio', 'biome.wetland': 'Palude',
      'marker.volcano': 'Vulcano', 'marker.springs': 'Sorgenti calde', 'marker.mine': 'Miniera', 'marker.ruins': 'Rovine', 'marker.dungeon': 'Dungeon', 'marker.cave': 'Caverna',
      'marker.grove': 'Bosco sacro', 'marker.lighthouse': 'Faro', 'marker.battlefield': 'Campo di battaglia', 'marker.monster': 'Mostro marino', 'marker.wreck': 'Relitto',
      'note.volcano.0': 'Monte {n}: un vulcano che fuma ancora.', 'note.volcano.1': 'Il vulcano {n} è sacro ai popoli vicini.', 'note.volcano.2': 'Dalle pendici di {n} scende lava ogni cento anni.',
      'note.springs.0': 'Sorgenti calde di {n}: chi vi si immerge guarisce dalle ferite.', 'note.springs.1': 'Acque fumanti di {n}, meta di pellegrini.', 'note.springs.2': 'Le terme di {n}, contese da due signori.',
      'note.mine.0': 'Miniera di {n}: argento e ferro, ma anche guai.', 'note.mine.1': 'Gallerie abbandonate di {n}: qualcosa vi è rimasto.', 'note.mine.2': 'Cava di {n}, la pietra migliore del regno.',
      'note.ruins.0': 'Rovine di {n}, città di un impero dimenticato.', 'note.ruins.1': 'Torre spezzata di {n}.', 'note.ruins.2': 'Antico anfiteatro di {n}, invaso dai rovi.',
      'note.dungeon.0': 'Sotterranei di {n}: si dice nascondano un tesoro.', 'note.dungeon.1': 'Fortezza sepolta di {n}.', 'note.dungeon.2': 'Cripta di {n}, sigillata da secoli.',
      'note.cave.0': 'Grotte di {n}.', 'note.cave.1': 'Caverna di {n}, tana di qualcosa di grosso.', 'note.cave.2': 'Abisso di {n}: nessuno ne ha visto il fondo.',
      'note.grove.0': 'Bosco sacro di {n}, custodito dai druidi.', 'note.grove.1': 'Querce antiche di {n}: qui non si caccia.', 'note.grove.2': 'Radura di {n}, dove si radunano gli spiriti.',
      'note.lighthouse.0': 'Faro di {n}.', 'note.lighthouse.1': 'La lanterna di {n} guida le navi tra gli scogli.', 'note.lighthouse.2': 'Faro spento di {n}: il guardiano è scomparso.',
      'note.battlefield.0': 'Campo di battaglia di {n}: le ossa affiorano ancora.', 'note.battlefield.1': 'Piana di {n}, dove cadde un re.', 'note.battlefield.2': 'Colle di {n}, conteso da due eserciti.',
      'note.monster.0': 'Qui ci sono draghi: il serpente {n} affonda le navi.', 'note.monster.1': 'Acque di {n}: un kraken dorme sul fondo.', 'note.monster.2': 'Correnti di {n}, dove cantano le sirene.',
      'note.wreck.0': 'Relitto della {n}, carica d’oro.', 'note.wreck.1': 'Scafo spezzato della {n}.', 'note.wreck.2': 'Nave fantasma {n}, vista nelle notti di nebbia.',
      'world.km': 'km',
    },
    en: {
      'gen.world.name': 'World',
      'gen.world.desc': 'Whole continents with climate, biomes, rivers, cultures, states, provinces, religions, towns and routes. Click the map to explore it.',
      'world.group.terrain': 'Land and climate',
      'world.group.people': 'Peoples and states',
      'world.group.view': 'View and layers',
      'world.opt.template': 'Land shape',
      'world.opt.template.continents': 'Continents',
      'world.opt.template.pangea': 'Pangea',
      'world.opt.template.archipelago': 'Archipelago',
      'world.opt.template.island': 'Island',
      'world.opt.template.mediterranean': 'Inland sea',
      'world.opt.template.peninsula': 'Peninsula',
      'world.opt.template.volcano': 'Volcano',
      'world.opt.cells': 'Detail',
      'world.opt.cells.low': 'Low',
      'world.opt.cells.medium': 'Medium',
      'world.opt.cells.high': 'High',
      'world.opt.climate': 'Climate',
      'world.opt.climate.cold': 'Cold',
      'world.opt.climate.temperate': 'Temperate',
      'world.opt.climate.warm': 'Warm',
      'world.opt.states': 'States',
      'world.opt.cultures': 'Cultures',
      'world.opt.religions': 'Organised religions',
      'world.opt.towns': 'Towns',
      'world.opt.towns.few': 'Few',
      'world.opt.towns.normal': 'Normal',
      'world.opt.towns.many': 'Many',
      'world.opt.view': 'View',
      'world.opt.view.political': 'Political',
      'world.opt.view.biomes': 'Biomes',
      'world.opt.view.heightmap': 'Relief',
      'world.opt.view.cultures': 'Cultures',
      'world.opt.view.religions': 'Religions',
      'world.opt.view.provinces': 'Provinces',
      'world.opt.relief': 'Relief icons',
      'world.opt.rivers': 'Rivers',
      'world.opt.borders': 'Borders',
      'world.opt.roads': 'Roads and sea lanes',
      'world.opt.burgs': 'Towns',
      'world.opt.markers': 'Points of interest',
      'world.opt.labels': 'Names',
      'world.opt.grid': 'Meridians and parallels',
      'world.hint': 'Click any point of the map to see what is there: biome, climate, state, culture, town.',
      'world.ocean': '{n} Ocean',
      'world.sea': 'Sea of {n}',
      'world.lake': 'Lake {n}',
      'world.river': '{n} River',
      'world.states': 'States',
      'world.cultures': 'Cultures',
      'world.religions': 'Religions',
      'world.burgs': 'Main towns',
      'world.markers': 'Points of interest',
      'world.diplomacy': 'Diplomacy',
      'world.capital': 'Capital',
      'world.area': 'Area',
      'world.population': 'Population',
      'world.culture': 'Culture',
      'world.religion': 'Religion',
      'world.state': 'State',
      'world.province': 'Province',
      'world.biome': 'Biome',
      'world.elevation': 'Elevation',
      'world.depth': 'Depth',
      'world.temperature': 'Mean temperature',
      'world.precipitation': 'Precipitation',
      'world.coords': 'Coordinates',
      'world.port': 'Port',
      'world.town': 'Town',
      'world.village': 'Village',
      'world.free': 'Free lands',
      'world.inhabitants': '{n} inhabitants',
      'world.openCity': 'Open the town plan',
      'world.openVillage': 'Open the village plan',
      'world.openDungeon': 'Open the dungeon map',
      'world.openCave': 'Open the cave map',
      'world.river.label': 'River',
      'world.lands': 'Land',
      'world.sub.political': 'political map',
      'world.sub.biomes': 'map of biomes',
      'world.sub.heightmap': 'physical map',
      'world.sub.cultures': 'map of cultures',
      'world.sub.religions': 'map of religions',
      'world.sub.provinces': 'map of provinces',
      'world.folk': 'Old faith of {n}',
      'form.kingdom': 'Kingdom of {n}', 'form.empire': 'Empire of {n}', 'form.duchy': 'Duchy of {n}', 'form.principality': 'Principality of {n}',
      'form.county': 'County of {n}', 'form.march': 'March of {n}', 'form.republic': 'Republic of {n}', 'form.khaganate': 'Khaganate of {n}',
      'form.sultanate': 'Sultanate of {n}', 'form.emirate': 'Emirate of {n}', 'form.grandduchy': 'Grand Duchy of {n}', 'form.theocracy': 'Theocracy of {n}',
      'prov.0': 'Province of {n}', 'prov.1': 'Shire of {n}', 'prov.2': 'March of {n}', 'prov.3': 'Barony of {n}', 'prov.4': 'Viscounty of {n}',
      'rel.0': 'Church of {n}', 'rel.1': 'Faith of {n}', 'rel.2': 'Way of {n}', 'rel.3': 'Order of {n}', 'rel.4': 'Light of {n}', 'rel.5': 'Children of {n}', 'rel.6': 'Temple of {n}',
      'cult.0': 'Cult of {n}', 'cult.1': 'Sect of {n}', 'cult.2': 'Mysteries of {n}', 'cult.3': 'Eye of {n}', 'cult.4': 'Brotherhood of {n}', 'cult.5': 'Bond of {n}', 'cult.6': 'Voice of {n}',
      'ctype.naval': 'seafaring', 'ctype.highland': 'highland', 'ctype.nomadic': 'nomadic', 'ctype.hunting': 'hunting', 'ctype.river': 'river', 'ctype.generic': 'farming',
      'rtype.folk': 'traditional', 'rtype.organized': 'organised', 'rtype.cult': 'cult',
      'relation.ally': 'allied', 'relation.friendly': 'friendly', 'relation.neutral': 'neutral', 'relation.suspicion': 'suspicious', 'relation.rival': 'rivals', 'relation.war': 'at war',
      'biome.marine': 'Sea', 'biome.hotDesert': 'Hot desert', 'biome.coldDesert': 'Cold desert', 'biome.savanna': 'Savanna', 'biome.grassland': 'Grassland',
      'biome.tropicalSeasonal': 'Tropical seasonal forest', 'biome.temperateDeciduous': 'Temperate forest', 'biome.tropicalRainforest': 'Tropical rainforest',
      'biome.temperateRainforest': 'Temperate rainforest', 'biome.taiga': 'Taiga', 'biome.tundra': 'Tundra', 'biome.glacier': 'Glacier', 'biome.wetland': 'Wetland',
      'marker.volcano': 'Volcano', 'marker.springs': 'Hot springs', 'marker.mine': 'Mine', 'marker.ruins': 'Ruins', 'marker.dungeon': 'Dungeon', 'marker.cave': 'Cave',
      'marker.grove': 'Sacred grove', 'marker.lighthouse': 'Lighthouse', 'marker.battlefield': 'Battlefield', 'marker.monster': 'Sea monster', 'marker.wreck': 'Shipwreck',
      'note.volcano.0': 'Mount {n}: a volcano that still smokes.', 'note.volcano.1': 'The volcano {n} is sacred to nearby peoples.', 'note.volcano.2': 'Lava runs down {n} once every hundred years.',
      'note.springs.0': 'Hot springs of {n}: whoever bathes here heals from wounds.', 'note.springs.1': 'Steaming waters of {n}, a goal for pilgrims.', 'note.springs.2': 'The baths of {n}, disputed by two lords.',
      'note.mine.0': 'Mine of {n}: silver and iron, and trouble too.', 'note.mine.1': 'Abandoned tunnels of {n}: something stayed behind.', 'note.mine.2': 'Quarry of {n}, the finest stone in the realm.',
      'note.ruins.0': 'Ruins of {n}, a city of a forgotten empire.', 'note.ruins.1': 'Broken tower of {n}.', 'note.ruins.2': 'Ancient amphitheatre of {n}, overrun by brambles.',
      'note.dungeon.0': 'Dungeons of {n}: rumoured to hide a treasure.', 'note.dungeon.1': 'Buried fortress of {n}.', 'note.dungeon.2': 'Crypt of {n}, sealed for centuries.',
      'note.cave.0': 'Caves of {n}.', 'note.cave.1': 'Cavern of {n}, den of something big.', 'note.cave.2': 'Abyss of {n}: no one has seen its bottom.',
      'note.grove.0': 'Sacred grove of {n}, kept by druids.', 'note.grove.1': 'Ancient oaks of {n}: no hunting here.', 'note.grove.2': 'Glade of {n}, where the spirits gather.',
      'note.lighthouse.0': 'Lighthouse of {n}.', 'note.lighthouse.1': 'The lantern of {n} guides ships between the rocks.', 'note.lighthouse.2': 'Dark lighthouse of {n}: the keeper has vanished.',
      'note.battlefield.0': 'Battlefield of {n}: bones still surface.', 'note.battlefield.1': 'Plain of {n}, where a king fell.', 'note.battlefield.2': 'Hill of {n}, fought over by two armies.',
      'note.monster.0': 'Here be dragons: the serpent {n} sinks ships.', 'note.monster.1': 'Waters of {n}: a kraken sleeps on the bottom.', 'note.monster.2': 'Currents of {n}, where the sirens sing.',
      'note.wreck.0': 'Wreck of the {n}, laden with gold.', 'note.wreck.1': 'Broken hull of the {n}.', 'note.wreck.2': 'Ghost ship {n}, seen on foggy nights.',
      'world.km': 'km',
    },
  });

  // ------------------------------------------------------------------ names

  const stateName = (s) => t('form.' + s.form, { n: s.name });
  const provName = (m, p) => t('prov.' + p.form, { n: m.burgs[p.burg].name });
  const relName = (m, r) => (r.kind === 'folk' ? t('world.folk', { n: m.cultures[r.culture].name }) : t((r.kind === 'cult' ? 'cult.' : 'rel.') + r.form, { n: r.deity }));
  const fmt = (v) => Math.round(v).toLocaleString(I18n.lang);
  const popText = (v) => (v >= 1e6 ? (v / 1e6).toLocaleString(I18n.lang, { maximumFractionDigits: 1 }) + (L() === 0 ? ' mln' : ' M') : fmt(v));

  // ------------------------------------------------------------------ geometry

  // Closed outlines of every region: Map value -> array of loops (vertex ids).
  function regionLoops(grid, value, keep) {
    const n = grid.n;
    const byVal = new Map();
    for (let i = 0; i < n; i++) {
      const v = value(i);
      if (!keep(v)) continue;
      const vs = grid.verts[i], ac = grid.across[i];
      let starts = byVal.get(v);
      if (!starts) byVal.set(v, (starts = new Map()));
      for (let k = 0; k < vs.length; k++) {
        const nb = ac[k];
        if (nb < n && value(nb) === v) continue;
        const a = vs[k], b = vs[(k + 1) % vs.length];
        if (!starts.has(a)) starts.set(a, []);
        starts.get(a).push(b);
      }
    }
    const out = new Map();
    for (const [v, starts] of byVal) {
      const loops = [];
      for (const [a0] of starts) {
        while (starts.get(a0) && starts.get(a0).length) {
          const loop = [a0];
          let cur = starts.get(a0).pop();
          let guard = 0;
          while (cur !== a0 && guard++ < 200000) {
            loop.push(cur);
            const nx = starts.get(cur);
            if (!nx || !nx.length) break;
            cur = nx.pop();
          }
          if (loop.length > 2) loops.push(loop);
        }
      }
      out.set(v, loops);
    }
    return out;
  }

  // Open chains of the edges separating two different non-zero values.
  function borderChains(grid, value, accept) {
    const n = grid.n;
    const segs = [];
    for (let i = 0; i < n; i++) {
      const v = value(i);
      const vs = grid.verts[i], ac = grid.across[i];
      for (let k = 0; k < vs.length; k++) {
        const nb = ac[k];
        if (nb >= n || nb < i) continue;
        const w = value(nb);
        if (v === w || !accept(v, w, i, nb)) continue;
        segs.push([vs[k], vs[(k + 1) % vs.length]]);
      }
    }
    const adj = new Map();
    const add = (a, s) => { if (!adj.has(a)) adj.set(a, []); adj.get(a).push(s); };
    segs.forEach((s, i) => { add(s[0], i); add(s[1], i); });
    const used = new Uint8Array(segs.length);
    const chains = [];
    const walk = (startSeg, from) => {
      const chain = [from];
      let seg = startSeg, at = from;
      while (seg >= 0 && !used[seg]) {
        used[seg] = 1;
        const [a, b] = segs[seg];
        at = a === at ? b : a;
        chain.push(at);
        const list = adj.get(at);
        seg = list.length === 2 ? list.find((q) => !used[q]) : -1;
        if (seg === undefined) seg = -1;
      }
      return chain;
    };
    for (const [v, list] of adj) if (list.length !== 2) for (const s of list) if (!used[s]) chains.push(walk(s, v));
    for (let i = 0; i < segs.length; i++) if (!used[i]) chains.push(walk(i, segs[i][0]));
    return chains;
  }

  const P = (grid, v) => ({ x: grid.vx[v], y: grid.vy[v] });
  const loopPts = (grid, loop) => loop.map((v) => P(grid, v));
  const cellPoly = (grid, i) => grid.verts[i].map((v) => P(grid, v));

  // ------------------------------------------------------------------ glyphs

  function mountain(b, x, y, s, rng) {
    const w = 13 * s, hh = 10 * s;
    const peak = { x: x + rng.float(-0.12, 0.12) * w, y: y - hh };
    const l = { x: x - w / 2, y }, r = { x: x + w / 2, y };
    b.fill.poly([l, peak, r]);
    b.shade.poly([peak, r, { x: x + w * 0.08, y }]);
    b.line.poly([l, peak, r], false);
  }
  function hill(b, x, y, s) {
    const w = 10 * s, hh = 4.5 * s;
    const d = 'M' + Svg.num(x - w / 2) + ' ' + Svg.num(y) + 'Q' + Svg.num(x) + ' ' + Svg.num(y - hh * 2) + ' ' + Svg.num(x + w / 2) + ' ' + Svg.num(y);
    b.fill.add(d + 'Z');
    b.line.add(d);
  }
  function tree(b, kind, x, y, s, rng) {
    if (kind === 'conifer') {
      b.green.poly([{ x, y: y - 7 * s }, { x: x + 2.8 * s, y }, { x: x - 2.8 * s, y }]);
    } else if (kind === 'palm') {
      b.line.line({ x, y }, { x: x + 0.6 * s, y: y - 5.5 * s });
      for (const a of [-2.4, -1.6, -0.9, -0.2]) b.line.line({ x: x + 0.6 * s, y: y - 5.5 * s }, G.add({ x: x + 0.6 * s, y: y - 5.5 * s }, G.fromAngle(a, 3 * s)));
    } else if (kind === 'acacia') {
      b.line.line({ x, y }, { x, y: y - 3.5 * s });
      b.green.add('M' + Svg.num(x - 3.8 * s) + ' ' + Svg.num(y - 3.5 * s) + 'Q' + Svg.num(x) + ' ' + Svg.num(y - 7.5 * s) + ' ' + Svg.num(x + 3.8 * s) + ' ' + Svg.num(y - 3.5 * s) + 'Z');
    } else if (kind === 'deciduous') {
      b.line.line({ x, y }, { x, y: y - 2.5 * s });
      b.green.circle(x, y - 4.6 * s, 2.6 * s * rng.float(0.85, 1.15));
    } else if (kind === 'dune') {
      b.line.add('M' + Svg.num(x - 4 * s) + ' ' + Svg.num(y) + 'Q' + Svg.num(x - 1 * s) + ' ' + Svg.num(y - 3 * s) + ' ' + Svg.num(x + 4 * s) + ' ' + Svg.num(y));
    } else if (kind === 'swamp') {
      for (const dx of [-2, 0, 2]) b.line.line({ x: x + dx * s, y }, { x: x + dx * s * 1.3, y: y - 3 * s });
      b.line.line({ x: x - 3.5 * s, y: y + 0.3 }, { x: x + 3.5 * s, y: y + 0.3 });
    } else if (kind === 'grass') {
      b.line.line({ x, y }, { x: x - 1.2 * s, y: y - 2.6 * s });
      b.line.line({ x, y }, { x: x + 1.2 * s, y: y - 2.6 * s });
    }
  }

  function markerGlyph(svg, mk, pal) {
    const x = mk.x, y = mk.y, r = 6.5;
    // A pin: circle on a short stem.
    svg.path('M' + Svg.num(x) + ' ' + Svg.num(y) + 'L' + Svg.num(x - 3) + ' ' + Svg.num(y - 8) + 'A' + r + ' ' + r + ' 0 1 1 ' + Svg.num(x + 3) + ' ' + Svg.num(y - 8) + 'Z',
      { fill: pal.paper, stroke: pal.accent, strokeWidth: 1.2 });
    const cx = x, cy = y - 12.5;
    const d = new Svg.Batch();
    switch (mk.type) {
      case 'volcano': d.poly([{ x: cx - 3.5, y: cy + 2.5 }, { x: cx - 1, y: cy - 2.5 }, { x: cx + 1, y: cy - 2.5 }, { x: cx + 3.5, y: cy + 2.5 }]); break;
      case 'springs': for (const dx of [-2, 0, 2]) d.add('M' + Svg.num(cx + dx) + ' ' + Svg.num(cy + 3) + 'q-1 -1.5 0 -3 t0 -3'); break;
      case 'mine': d.line({ x: cx - 3, y: cy + 3 }, { x: cx + 3, y: cy - 3 }); d.line({ x: cx - 3, y: cy - 3 }, { x: cx + 3, y: cy + 3 }); break;
      case 'ruins': for (const dx of [-2.5, 0, 2.5]) d.line({ x: cx + dx, y: cy + 3 }, { x: cx + dx, y: cy - (dx ? 1.5 : 3) }); break;
      case 'dungeon': d.add('M' + Svg.num(cx - 2.8) + ' ' + Svg.num(cy + 3) + 'V' + Svg.num(cy - 0.5) + 'A2.8 2.8 0 0 1 ' + Svg.num(cx + 2.8) + ' ' + Svg.num(cy - 0.5) + 'V' + Svg.num(cy + 3) + 'Z'); break;
      case 'cave': d.add('M' + Svg.num(cx - 3.5) + ' ' + Svg.num(cy + 3) + 'Q' + Svg.num(cx) + ' ' + Svg.num(cy - 5) + ' ' + Svg.num(cx + 3.5) + ' ' + Svg.num(cy + 3)); break;
      case 'grove': d.circle(cx, cy - 0.8, 2.6); d.line({ x: cx, y: cy + 1.8 }, { x: cx, y: cy + 3.5 }); break;
      case 'lighthouse': d.poly([{ x: cx - 1.6, y: cy + 3.5 }, { x: cx - 1, y: cy - 2.5 }, { x: cx + 1, y: cy - 2.5 }, { x: cx + 1.6, y: cy + 3.5 }]); d.line({ x: cx - 3.5, y: cy - 3.5 }, { x: cx + 3.5, y: cy - 1.5 }); break;
      case 'battlefield': d.line({ x: cx - 3, y: cy - 3 }, { x: cx + 3, y: cy + 3 }); d.line({ x: cx + 3, y: cy - 3 }, { x: cx - 3, y: cy + 3 }); d.line({ x: cx - 1, y: cy + 3.2 }, { x: cx - 3.3, y: cy + 1 }); break;
      case 'monster': d.add('M' + Svg.num(cx - 4) + ' ' + Svg.num(cy + 1) + 'q2 -4 4 0 t4 0'); break;
      case 'wreck': d.line({ x: cx, y: cy - 3.5 }, { x: cx, y: cy + 2.5 }); d.add('M' + Svg.num(cx - 3.5) + ' ' + Svg.num(cy + 1) + 'Q' + Svg.num(cx) + ' ' + Svg.num(cy + 4.5) + ' ' + Svg.num(cx + 3.5) + ' ' + Svg.num(cy + 1)); break;
    }
    svg.path(d.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 1.1, strokeLinecap: 'round', strokeLinejoin: 'round' });
  }

  // ------------------------------------------------------------------ links

  function burgLink(b) {
    const k = b.population;
    if (k >= 6) {
      const size = k >= 60 ? 'huge' : k >= 22 ? 'large' : k >= 10 ? 'medium' : 'small';
      return Carto.linkTo('city', b.seed, { size, water: b.port ? (b.river ? 'both' : 'coast') : b.river ? 'river' : 'none', citadel: b.capital || k > 20, name: b.name });
    }
    return Carto.linkTo('village', b.seed, { size: k < 1.5 ? 'hamlet' : k < 3.5 ? 'village' : 'large', water: b.river ? 'stream' : 'none', name: b.name });
  }
  function markerLink(mk) {
    if (mk.type === 'dungeon') return Carto.linkTo('dungeon', mk.seed, {});
    if (mk.type === 'cave') return Carto.linkTo('cave', mk.seed, {});
    if (mk.type === 'grove') return Carto.linkTo('cave', mk.seed, { type: 'glade' });
    return null;
  }

  // ------------------------------------------------------------------ render

  const HEIGHT_RAMP = [
    [0, '#5b7f97'], [10, '#7d9fb3'], [19.9, '#a9c4cc'], [20, '#88ab78'], [30, '#a8bd7d'], [42, '#d2cd8d'], [55, '#d4b27d'], [68, '#b38a63'], [82, '#9c8a7f'], [92, '#d9d4cf'], [100, '#ffffff'],
  ];
  function ramp(v) {
    for (let i = 1; i < HEIGHT_RAMP.length; i++) {
      if (v <= HEIGHT_RAMP[i][0]) {
        const [a, ca] = HEIGHT_RAMP[i - 1], [b, cb] = HEIGHT_RAMP[i];
        const tt = (v - a) / (b - a || 1);
        const ha = parseInt(ca.slice(1), 16), hb = parseInt(cb.slice(1), 16);
        const ch = [16, 8, 0].map((sh) => Math.round(((ha >> sh) & 255) * (1 - tt) + ((hb >> sh) & 255) * tt));
        return '#' + ch.map((c) => c.toString(16).padStart(2, '0')).join('');
      }
    }
    return '#ffffff';
  }

  function render(m, o) {
    const pal = o.palette;
    const grid = m.grid, n = grid.n, W = m.W, H = m.H;
    const view = o.view || 'political';
    const svg = new Svg(W, H);
    const clip = Carto.uid('wclip');
    svg.defs('<clipPath id="' + clip + '"><rect width="' + W + '" height="' + H + '"/></clipPath>');
    svg.rect(0, 0, W, H, { fill: pal.water });
    svg.open({ clipPath: 'url(#' + clip + ')' });
    const rng = new Carto.Random(m.seed + 31);
    const water = (i) => m.isWater(i);
    const parchment = o.paletteId === 'parchment' || !o.paletteId;
    const fillOpacity = o.paletteId === 'ink' ? 0.3 : o.paletteId === 'night' || o.paletteId === 'blueprint' ? 0.38 : 0.46;

    // Ocean depth in the relief view, ripples along the shore otherwise.
    if (view === 'heightmap') {
      const depth = regionLoops(grid, (i) => (m.h[i] < 20 && !m.lake[i] ? Math.min(3, Math.floor(m.h[i] / 5)) : -1), (v) => v >= 0);
      for (const [v, loops] of depth) {
        const b = new Svg.Batch();
        for (const l of loops) b.poly(loopPts(grid, l));
        svg.path(b.toString(), { fill: ramp(v * 5 + 2), stroke: ramp(v * 5 + 2), strokeWidth: 0.6 });
      }
    }
    const landLoops = regionLoops(grid, (i) => (water(i) && !m.lake[i] ? 0 : 1), (v) => v === 1).get(1) || [];
    const landD = (() => { const b = new Svg.Batch(); for (const l of landLoops) b.smooth(G.chaikin(loopPts(grid, l), 1, true), true); return b.toString(); })();
    if (view !== 'heightmap') {
      for (const [k, op] of [[3, 0.12], [2, 0.22], [1, 0.4]]) {
        const loops = regionLoops(grid, (i) => (m.coast[i] >= -k || (!water(i)) ? 1 : 0), (v) => v === 1).get(1) || [];
        const b = new Svg.Batch();
        for (const l of loops) b.smooth(G.chaikin(loopPts(grid, l), 1, true), true);
        svg.path(b.toString(), { fill: 'none', stroke: pal.waterInk, strokeWidth: 0.8, opacity: op });
      }
    }

    // Land and the thematic fill, clipped to the smoothed coastline.
    const landClip = Carto.uid('wland');
    svg.defs('<clipPath id="' + landClip + '"><path d="' + landD + '"/></clipPath>');
    svg.path(landD, { fill: pal.paper });
    svg.open({ clipPath: 'url(#' + landClip + ')' });
    const fillRegions = (value, colorOf, opacity) => {
      const loops = regionLoops(grid, value, (v) => v > 0);
      for (const [v, ls] of loops) {
        const col = colorOf(v);
        if (!col) continue;
        const b = new Svg.Batch();
        for (const l of ls) b.poly(loopPts(grid, l));
        svg.path(b.toString(), { fill: col, stroke: col, strokeWidth: 0.7, opacity, fillRule: 'evenodd' });
      }
    };
    if (view === 'political') fillRegions((i) => m.state[i], (v) => m.states[v].color, fillOpacity);
    else if (view === 'provinces') fillRegions((i) => m.province[i], (v) => m.provinces[v].color, fillOpacity);
    else if (view === 'cultures') fillRegions((i) => m.culture[i], (v) => m.cultures[v].color, fillOpacity);
    else if (view === 'religions') fillRegions((i) => m.religion[i], (v) => m.religions[v].color, fillOpacity);
    else if (view === 'biomes') fillRegions((i) => (water(i) ? 0 : m.biome[i]), (v) => World.BIOMES[v].color, parchment ? 0.85 : 0.55);
    else if (view === 'heightmap') fillRegions((i) => (water(i) ? 0 : 1 + Math.min(15, Math.floor((m.h[i] - 20) / 5))), (v) => ramp(20 + (v - 1) * 5 + 2.5), 1);
    svg.close();

    // Lakes.
    const lakeLoops = regionLoops(grid, (i) => (m.lake[i] ? 1 : 0), (v) => v === 1).get(1) || [];
    const lb = new Svg.Batch();
    for (const l of lakeLoops) lb.smooth(G.chaikin(loopPts(grid, l), 1, true), true);
    svg.path(lb.toString(), { fill: pal.water, stroke: pal.waterInk, strokeWidth: 0.8 });

    // Rivers, widening downstream.
    if (o.rivers !== false) {
      for (const r of m.rivers) {
        const pts = r.cells.map((c) => ({ x: grid.x[c], y: grid.y[c] }));
        const sm = G.chaikin(pts, 2, false);
        const k = 4;
        for (let i = 0; i < sm.length - 1; i += k) {
          const seg = sm.slice(i, Math.min(sm.length, i + k + 1));
          const c = r.cells[Math.min(r.cells.length - 1, Math.floor(i / 4))];
          const w = Math.min(3.4, 0.5 + Math.sqrt(m.flux[c] / m.T) * 0.55);
          svg.path(Svg.d(seg, false), { fill: 'none', stroke: pal.waterInk, strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round' });
        }
      }
    }

    // Coastline.
    svg.path(landD, { fill: 'none', stroke: pal.ink, strokeWidth: 1.1, strokeLinejoin: 'round' });

    // Borders.
    if (o.borders !== false) {
      if (view === 'political' || view === 'provinces') {
        const pchains = borderChains(grid, (i) => m.province[i], (a, b, i, j) => a && b && m.state[i] === m.state[j]);
        const pb = new Svg.Batch();
        for (const ch of pchains) pb.poly(G.chaikin(loopPts(grid, ch), 1, false), false);
        svg.path(pb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.6, strokeDasharray: '2 2', opacity: 0.55 });
      }
      const chains = borderChains(grid, (i) => m.state[i], (a, b, i, j) => !water(i) && !water(j));
      const sb = new Svg.Batch();
      for (const ch of chains) sb.poly(G.chaikin(loopPts(grid, ch), 1, false), false);
      svg.path(sb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 2.6, opacity: 0.18, strokeLinejoin: 'round' });
      svg.path(sb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 1, strokeDasharray: '5 2 1 2', opacity: 0.8, strokeLinejoin: 'round' });
    }

    // Routes.
    if (o.roads !== false) {
      const road = new Svg.Batch(), trail = new Svg.Batch(), sea = new Svg.Batch();
      for (const r of m.routes) {
        const pts = r.cells.map((c) => ({ x: grid.x[c], y: grid.y[c] }));
        if (r.type === 'sea') {
          const b = m.burgs[m.burgAt[r.cells[0]]];
          if (b) pts[0] = { x: b.x, y: b.y };
        }
        const d = Svg.smooth(G.chaikin(pts, 1, false), false, 0.4);
        (r.type === 'road' ? road : r.type === 'trail' ? trail : sea).add(d);
      }
      svg.path(sea.toString(), { fill: 'none', stroke: pal.waterInk, strokeWidth: 0.8, strokeDasharray: '3 3', opacity: 0.85 });
      svg.path(road.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 1, opacity: 0.75, strokeLinecap: 'round' });
      svg.path(trail.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 0.7, strokeDasharray: '2 2', opacity: 0.7 });
    }

    // Relief icons, back to front.
    if (o.relief !== false && view !== 'heightmap') {
      const sp = Math.max(8, grid.spacing * 0.62);
      const pts = G.poissonDisc(rng, 6, 10, W - 12, H - 14, sp);
      const items = [];
      for (const p of pts) {
        const c = grid.find(p.x, p.y);
        if (c < 0 || water(c) || m.riverOf[c] || m.burgs.some((b) => b && Math.abs(b.x - p.x) < 9 && Math.abs(b.y - p.y) < 9)) continue;
        const hh = m.h[c];
        if (hh > 62) items.push({ y: p.y, k: 'm', x: p.x, s: 0.75 + (hh - 62) / 50 });
        else if (hh > 50) { if (rng.bool(0.55)) items.push({ y: p.y, k: 'h', x: p.x, s: 0.9 }); }
        else {
          const icon = World.BIOMES[m.biome[c]].icon;
          const dense = { deciduous: 0.8, conifer: 0.85, palm: 0.6, acacia: 0.25, dune: 0.35, swamp: 0.5, grass: 0.12 }[icon] || 0;
          if (icon && rng.bool(dense)) items.push({ y: p.y, k: icon, x: p.x, s: 0.9 });
        }
      }
      items.sort((a, b) => a.y - b.y);
      const bandH = 30;
      for (let i0 = 0; i0 < items.length;) {
        const b = { fill: new Svg.Batch(), shade: new Svg.Batch(), line: new Svg.Batch(), green: new Svg.Batch() };
        const yb = items[i0].y + bandH;
        let i = i0;
        for (; i < items.length && items[i].y < yb; i++) {
          const it = items[i];
          if (it.k === 'm') mountain(b, it.x, it.y, it.s, rng);
          else if (it.k === 'h') hill(b, it.x, it.y, it.s);
          else tree(b, it.k, it.x, it.y, it.s, rng);
        }
        svg.path(b.green.toString(), { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.5 });
        svg.path(b.fill.toString(), { fill: pal.mountain });
        svg.path(b.shade.toString(), { fill: pal.inkSoft, opacity: 0.4 });
        svg.path(b.line.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.7, strokeLinejoin: 'round', strokeLinecap: 'round' });
        i0 = i;
      }
    }

    // Graticule.
    if (o.grid) {
      const gb = new Svg.Batch();
      const latToY = (la) => ((m.lats[0] - la) / (m.lats[0] - m.lats[1])) * H;
      const lonToX = (lo) => ((lo - m.lons[0]) / (m.lons[1] - m.lons[0])) * W;
      for (let la = Math.ceil(m.lats[1] / 10) * 10; la <= m.lats[0]; la += 10) gb.line({ x: 0, y: latToY(la) }, { x: W, y: latToY(la) });
      for (let lo = Math.ceil(m.lons[0] / 10) * 10; lo <= m.lons[1]; lo += 10) gb.line({ x: lonToX(lo), y: 0 }, { x: lonToX(lo), y: H });
      svg.path(gb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.5, strokeDasharray: '1 4', opacity: 0.6 });
      for (let la = Math.ceil(m.lats[1] / 10) * 10; la <= m.lats[0]; la += 10) {
        Draw.label(svg, 16, latToY(la) - 5, Math.abs(la) + '°' + (la >= 0 ? 'N' : 'S'), 9, pal, { anchor: 'start', italic: true, haloColor: pal.water });
      }
      for (let lo = Math.ceil(m.lons[0] / 10) * 10; lo <= m.lons[1]; lo += 10) {
        Draw.label(svg, lonToX(lo) + 4, H - 16, Math.abs(lo) + '°' + (lo >= 0 ? 'E' : 'W'), 9, pal, { anchor: 'start', italic: true, haloColor: pal.water });
      }
    }
    svg.close();

    // State or theme names under everything else that is lettered.
    const taken = [];
    const showLabels = o.labels !== false;
    if (showLabels && !o.preview) {
      const groupLabel = (cell, text, size) => {
        if (cell < 0 || cell === undefined) return;
        Draw.label(svg, grid.x[cell], grid.y[cell], text.toUpperCase(), size, pal, { title: true, spacing: size * 0.25, opacity: 0.7, haloWidth: 0.12 });
      };
      if (view === 'political' || view === 'provinces') {
        for (const s of m.states) {
          if (!s || !s.id || s.cells < 8) continue;
          groupLabel(s.pole, s.name, Math.max(10, Math.min(26, Math.sqrt(s.cells) * 0.85)));
        }
      } else if (view === 'cultures') {
        for (const k of m.cultures) if (k) groupLabel(k.pole, k.name, 16);
      } else if (view === 'religions') {
        for (const r of m.religions) if (r && r.cells > 15 && r.pole >= 0) Draw.label(svg, grid.x[r.pole], grid.y[r.pole], relName(m, r), 12, pal, { italic: true, opacity: 0.8 });
      }
    }

    // Water names.
    if (showLabels && !o.preview) {
      for (const f of m.features) {
        if (!f || !f.name || f.pole === undefined || f.pole < 0) continue;
        const key = f.kind === 'ocean' ? 'world.ocean' : f.kind === 'sea' ? 'world.sea' : 'world.lake';
        const size = f.kind === 'ocean' ? 20 : f.kind === 'sea' ? 15 : 9;
        const text = t(key, { n: f.name });
        const x = grid.x[f.pole], y = grid.y[f.pole];
        const box = Draw.textBox(x, y, text, size, {});
        box.x0 -= text.length * size * 0.12; box.x1 += text.length * size * 0.12;
        if (taken.some((b) => Draw.overlaps(b, box))) continue;
        taken.push(box);
        Draw.label(svg, x, y, text, size, pal, { italic: true, spacing: f.kind === 'lake' ? 0.5 : size * 0.3, color: pal.waterInk, haloColor: pal.water, haloWidth: 0.15 });
      }
    }

    // Towns.
    if (o.burgs !== false) {
      const towns = new Svg.Batch(), caps = new Svg.Batch(), dots = new Svg.Batch();
      for (const b of m.burgs) {
        if (!b) continue;
        if (b.capital) { caps.circle(b.x, b.y, o.preview ? 4.5 : 3.6); dots.circle(b.x, b.y, 1.3); }
        else towns.circle(b.x, b.y, b.population > 10 ? 2.1 : 1.6);
        taken.push({ x0: b.x - 4, x1: b.x + 4, y0: b.y - 4, y1: b.y + 4 });
      }
      svg.path(towns.toString(), { fill: pal.paper, stroke: pal.ink, strokeWidth: 0.8 });
      svg.path(caps.toString(), { fill: pal.paper, stroke: pal.ink, strokeWidth: 1.1 });
      svg.path(dots.toString(), { fill: pal.ink });
      if (showLabels && !o.preview) {
        const labels = m.burgs.filter((b) => b).sort((a, b) => b.capital - a.capital || b.population - a.population).map((b) => ({
          x: b.x, y: b.y, text: b.name, size: b.capital ? 11.5 : b.population > 10 ? 9 : 7.5, title: b.capital,
          offsets: [[1, 0], [-1, 0], [0, -1.15], [0, 1.15]], gap: b.capital ? 6 : 4,
        }));
        Draw.placeLabels(svg, labels, pal, taken, { x0: 8, y0: 8, x1: W - 8, y1: H - 8 });
      }
    }

    // Points of interest.
    if (o.markers !== false && !o.preview) for (const mk of m.markers) markerGlyph(svg, mk, pal);

    // Sheet furniture.
    if (!o.preview) {
      const title = m.name;
      const sub = t('world.sub.' + view);
      const tw = Draw.textBox(0, 0, title, 30, { title: true }).x1 * 2;
      svg.rect(18, 18, Math.max(tw, 150) + 30, 64, { fill: pal.paper, stroke: pal.ink, strokeWidth: 1, opacity: 0.92 });
      svg.rect(22, 22, Math.max(tw, 150) + 22, 56, { fill: 'none', stroke: pal.ink, strokeWidth: 0.5 });
      Draw.label(svg, 33 + Math.max(tw, 150) / 2, 46, title, 30, pal, { title: true, halo: false });
      Draw.label(svg, 33 + Math.max(tw, 150) / 2, 68, sub, 12, pal, { italic: true, halo: false });
      Draw.compass(svg, W - 56, H - 64, 30, pal);
      Draw.scaleBar(svg, 30, H - 40, 120, Math.round(120 * m.KM), t('world.km'), pal, 4);
      svg.rect(0, 0, W, H, { fill: 'none', stroke: pal.paper, strokeWidth: 12 });
      svg.rect(6, 6, W - 12, H - 12, { fill: 'none', stroke: pal.ink, strokeWidth: 1.6 });
      svg.rect(10, 10, W - 20, H - 20, { fill: 'none', stroke: pal.ink, strokeWidth: 0.6 });
    } else {
      Draw.label(svg, W / 2, 70, m.name, 64, pal, { title: true, haloWidth: 0.3 });
    }
    return svg.toString();
  }

  // ------------------------------------------------------------------ key and inspector

  const esc = Svg.esc;
  const swatch = (c) => '<i class="swatch-dot" style="background:' + c + '"></i>';

  function notes(m) {
    const totalPop = m.states.reduce((s, x) => s + (x && x.id ? x.pop : 0), 0);
    let h = '<h3>' + esc(m.name) + '</h3><p class="tag">' + esc(t('world.hint')) + '</p>';
    h += '<dl><dt>' + esc(t('world.states')) + '</dt><dd>' + (m.states.length - 1) + '</dd><dt>' + esc(t('world.population')) + '</dt><dd>' + popText(totalPop) + '</dd></dl>';
    const states = m.states.filter((s) => s && s.id).sort((a, b) => b.pop - a.pop);
    h += '<details open><summary>' + esc(t('world.states')) + '</summary><ul class="legend">';
    for (const s of states) {
      const cap = m.burgs[s.capital];
      h += '<li>' + swatch(s.color) + '<span><strong>' + esc(stateName(s)) + '</strong><br><span class="tag">' + esc(t('world.capital')) + ': <a href="' + esc(burgLink(cap)) + '">' + esc(cap.name) + '</a> · ' +
        fmt(s.area) + ' km² · ' + popText(s.pop) + '</span></span></li>';
    }
    h += '</ul></details>';
    if (m.relations.length) {
      h += '<details><summary>' + esc(t('world.diplomacy')) + '</summary><ul>';
      for (const r of m.relations) h += '<li>' + esc(m.states[r.a].name) + ' – ' + esc(m.states[r.b].name) + ': <span class="tag">' + esc(t('relation.' + r.rel)) + '</span></li>';
      h += '</ul></details>';
    }
    h += '<details><summary>' + esc(t('world.cultures')) + '</summary><ul class="legend">';
    for (const k of m.cultures) if (k) h += '<li>' + swatch(k.color) + '<span>' + esc(k.name) + ' <span class="tag">' + esc(t('ctype.' + k.type)) + '</span></span></li>';
    h += '</ul></details><details><summary>' + esc(t('world.religions')) + '</summary><ul class="legend">';
    for (const r of m.religions) if (r && r.cells) h += '<li>' + swatch(r.color) + '<span>' + esc(relName(m, r)) + ' <span class="tag">' + esc(t('rtype.' + r.kind)) + '</span></span></li>';
    h += '</ul></details><details><summary>' + esc(t('world.burgs')) + '</summary><ol>';
    for (const b of m.burgs.filter((x) => x).sort((a, c) => c.population - a.population).slice(0, 20)) {
      h += '<li><a href="' + esc(burgLink(b)) + '">' + esc(b.name) + '</a> <span class="tag">' + esc(t('world.inhabitants', { n: fmt(b.population * 1000) })) + '</span></li>';
    }
    h += '</ol></details><details><summary>' + esc(t('world.markers')) + '</summary><ul>';
    for (const mk of m.markers) {
      const link = markerLink(mk);
      const text = t('note.' + mk.type + '.' + mk.v, { n: mk.name });
      h += '<li>' + (link ? '<a href="' + esc(link) + '">' + esc(text) + '</a>' : esc(text)) + '</li>';
    }
    return h + '</ul></details>';
  }

  function inspect(m, x, y) {
    const grid = m.grid;
    const near = (p, r) => Math.hypot(p.x - x, p.y - y) < r;
    const mk = m.markers.find((q) => near({ x: q.x, y: q.y - 12 }, 9));
    if (mk) {
      const link = markerLink(mk);
      return {
        html: '<h3>' + esc(t('marker.' + mk.type)) + '</h3><p>' + esc(t('note.' + mk.type + '.' + mk.v, { n: mk.name })) + '</p>' + (link ? '<p><a class="btn primary" href="' + esc(link) + '">' + esc(t(mk.type === 'dungeon' ? 'world.openDungeon' : 'world.openCave')) + '</a></p>' : ''),
        mark: { x: mk.x, y: mk.y - 12, r: 9 },
      };
    }
    const b = m.burgs.filter((q) => q && near(q, q.capital ? 9 : 7)).sort((p, q) => Math.hypot(p.x - x, p.y - y) - Math.hypot(q.x - x, q.y - y))[0];
    if (b) {
      const s = m.states[b.state || 0];
      const kind = b.capital ? t('world.capital') : b.population >= 6 ? t('world.town') : t('world.village');
      const big = b.population >= 6;
      return {
        html: '<h3>' + esc(b.name) + '</h3><p class="tag">' + esc(kind) + (b.port ? ' · ' + esc(t('world.port')) : '') + '</p><dl>' +
          '<dt>' + esc(t('world.population')) + '</dt><dd>' + fmt(b.population * 1000) + '</dd>' +
          '<dt>' + esc(t('world.state')) + '</dt><dd>' + esc(s && s.id ? stateName(s) : t('world.free')) + '</dd>' +
          (b.province ? '<dt>' + esc(t('world.province')) + '</dt><dd>' + esc(provName(m, m.provinces[b.province])) + '</dd>' : '') +
          '<dt>' + esc(t('world.culture')) + '</dt><dd>' + esc((m.cultures[b.culture] || { name: '–' }).name) + '</dd>' +
          (b.religion ? '<dt>' + esc(t('world.religion')) + '</dt><dd>' + esc(relName(m, m.religions[b.religion])) + '</dd>' : '') +
          '</dl><p><a class="btn primary" href="' + esc(burgLink(b)) + '">' + esc(t(big ? 'world.openCity' : 'world.openVillage')) + '</a></p>',
        mark: { x: b.x, y: b.y, r: 7 },
      };
    }
    const c = grid.find(x, y);
    if (c < 0) return null;
    const water = m.isWater(c);
    const lat = m.lats[0] - (grid.y[c] / m.H) * (m.lats[0] - m.lats[1]);
    const lon = m.lons[0] + (grid.x[c] / m.W) * (m.lons[1] - m.lons[0]);
    const coords = Math.abs(lat).toFixed(1) + '°' + (lat >= 0 ? 'N' : 'S') + ' ' + Math.abs(lon).toFixed(1) + '°' + (lon >= 0 ? 'E' : 'W');
    let title, rows = '';
    if (water) {
      const f = m.features[m.feature[c]];
      title = f && f.name ? t(f.kind === 'ocean' ? 'world.ocean' : f.kind === 'sea' ? 'world.sea' : 'world.lake', { n: f.name }) : t('biome.marine');
      rows += '<dt>' + esc(t('world.depth')) + '</dt><dd>' + fmt((20 - m.h[c]) * 160) + ' m</dd>';
    } else {
      const s = m.states[m.state[c]];
      title = s && s.id ? stateName(s) : t('world.free');
      rows += '<dt>' + esc(t('world.biome')) + '</dt><dd>' + esc(t('biome.' + World.BIOMES[m.biome[c]].id)) + '</dd>';
      rows += '<dt>' + esc(t('world.elevation')) + '</dt><dd>' + fmt(m.elev[c]) + ' m</dd>';
      rows += '<dt>' + esc(t('world.temperature')) + '</dt><dd>' + Math.round(m.temp[c]) + ' °C</dd>';
      rows += '<dt>' + esc(t('world.precipitation')) + '</dt><dd>' + fmt(m.prec[c]) + ' mm</dd>';
      if (m.province[c]) rows += '<dt>' + esc(t('world.province')) + '</dt><dd>' + esc(provName(m, m.provinces[m.province[c]])) + '</dd>';
      if (m.culture[c]) rows += '<dt>' + esc(t('world.culture')) + '</dt><dd>' + esc(m.cultures[m.culture[c]].name) + '</dd>';
      if (m.religion[c]) rows += '<dt>' + esc(t('world.religion')) + '</dt><dd>' + esc(relName(m, m.religions[m.religion[c]])) + '</dd>';
      if (m.riverOf[c]) rows += '<dt>' + esc(t('world.river.label')) + '</dt><dd>' + esc(t('world.river', { n: m.rivers[m.riverOf[c] - 1].name })) + '</dd>';
      rows += '<dt>' + esc(t('world.population')) + '</dt><dd>' + fmt(m.pop[c]) + '</dd>';
    }
    rows += '<dt>' + esc(t('world.coords')) + '</dt><dd>' + coords + '</dd>';
    return { html: '<h3>' + esc(title) + '</h3><dl>' + rows + '</dl>', poly: cellPoly(grid, c) };
  }

  Carto.register({
    id: 'world',
    order: 0,
    featured: true,
    options: [
      { id: 'template', type: 'select', group: 'terrain', values: ['continents', 'pangea', 'archipelago', 'island', 'mediterranean', 'peninsula', 'volcano'], def: 'continents' },
      { id: 'cells', type: 'select', group: 'terrain', values: ['low', 'medium', 'high'], def: 'medium' },
      { id: 'climate', type: 'select', group: 'terrain', values: ['cold', 'temperate', 'warm'], def: 'temperate' },
      { id: 'states', type: 'range', group: 'people', min: 2, max: 20, step: 1, def: 8 },
      { id: 'cultures', type: 'range', group: 'people', min: 2, max: 12, step: 1, def: 6 },
      { id: 'religions', type: 'range', group: 'people', min: 0, max: 8, step: 1, def: 3 },
      { id: 'towns', type: 'select', group: 'people', values: ['few', 'normal', 'many'], def: 'normal' },
      { id: 'view', type: 'select', group: 'view', values: ['political', 'biomes', 'heightmap', 'cultures', 'religions', 'provinces'], def: 'political', renderOnly: true },
      { id: 'relief', type: 'bool', group: 'view', def: true, renderOnly: true },
      { id: 'rivers', type: 'bool', group: 'view', def: true, renderOnly: true },
      { id: 'borders', type: 'bool', group: 'view', def: true, renderOnly: true },
      { id: 'roads', type: 'bool', group: 'view', def: true, renderOnly: true },
      { id: 'burgs', type: 'bool', group: 'view', def: true, renderOnly: true },
      { id: 'markers', type: 'bool', group: 'view', def: true, renderOnly: true },
      { id: 'labels', type: 'bool', group: 'view', def: true, renderOnly: true },
      { id: 'grid', type: 'bool', group: 'view', def: false, renderOnly: true },
    ],
    previewOptions: { cells: 'low' },
    generate: World.generate,
    render,
    notes,
    inspect,
    fileName: (m) => m.name,
  });
})(window.Carto = window.Carto || {});
