/* Dwelling generator: floor plans of a single building, every floor side by
   side, with rooms, doors, windows, stairs and furniture. */
(function (Carto) {
  'use strict';

  const G = Carto.G, Svg = Carto.Svg, Draw = Carto.Draw, t = Carto.t;
  const I18n = Carto.I18n;

  I18n.add({
    it: {
      'gen.dwelling.name': 'Dimora',
      'dwelling.3d.floor': 'Pavimento',
      'dwelling.3d.outer': 'Muri esterni',
      'dwelling.3d.inner': 'Muri interni',
      'dwelling.3d.windows': 'Finestre',
      'dwelling.3d.doors': 'Porte',
      'dwelling.3d.stairs': 'Scale',
      'dwelling.3d.furniture': 'Arredi',
      'dwelling.3d.roof': 'Tetto',
      'dwelling.3d.ground': 'Terreno',
      'gen.dwelling.desc': 'Piante di edifici su più piani: locande, case, ville e botteghe, arredate stanza per stanza.',
      'dwelling.opt.type': 'Edificio',
      'dwelling.opt.type.auto': 'Casuale',
      'dwelling.opt.type.cottage': 'Casolare',
      'dwelling.opt.type.townhouse': 'Casa di città',
      'dwelling.opt.type.tavern': 'Locanda',
      'dwelling.opt.type.shop': 'Bottega',
      'dwelling.opt.type.manor': 'Villa',
      'dwelling.opt.cellar': 'Cantina',
      'dwelling.opt.labels': 'Nomi delle stanze',
      'dwelling.opt.furniture': 'Arredi',
      'floor.-1': 'Cantina',
      'floor.0': 'Piano terra',
      'floor.1': 'Primo piano',
      'floor.2': 'Secondo piano',
      'room.hall': 'Ingresso',
      'room.landing': 'Pianerottolo',
      'room.kitchen': 'Cucina',
      'room.taproom': 'Sala comune',
      'room.dining': 'Sala da pranzo',
      'room.living': 'Soggiorno',
      'room.bedroom': 'Camera',
      'room.guest': 'Camera per ospiti',
      'room.study': 'Studio',
      'room.library': 'Biblioteca',
      'room.storage': 'Ripostiglio',
      'room.pantry': 'Dispensa',
      'room.workshop': 'Laboratorio',
      'room.shop': 'Negozio',
      'room.bath': 'Bagno',
      'room.chapel': 'Cappella',
      'room.cellar': 'Cantina',
      'room.wine': 'Cantina dei vini',
      'room.vault': 'Stanza segreta',
      'room.servants': 'Alloggio servitù',
      'dwelling.up': 'su',
      'dwelling.down': 'giù',
      'dwelling.scale': '1 quadretto = 1,5 m',
      'dwelling.house': 'Dimora di {n}',
      'dwelling.cottage': 'Casolare di {n}',
      'dwelling.shop': 'Bottega di {n}',
      'dwelling.manor': 'Villa {n}',
      'dwelling.rooms': 'Stanze',
      'dwelling.floors': 'Piani',
      // Present day (2026): the same building types, as they are today.
      'dwelling.opt.type.cottage@modern': 'Villetta',
      'dwelling.opt.type.townhouse@modern': 'Palazzina',
      'dwelling.opt.type.tavern@modern': 'Bar-ristorante',
      'dwelling.opt.type.shop@modern': 'Negozio con casa',
      'dwelling.opt.type.manor@modern': 'Villa di lusso',
      'dwelling.opt.cellar@modern': 'Seminterrato',
      'floor.-1@modern': 'Seminterrato',
      'dwelling.scale@modern': '1 quadretto = 1,5 m',
      'dwelling.cottage@modern': 'Casa di {n}',
      'dwelling.house@modern': 'Palazzina {n}',
      'dwelling.shop@modern': 'Negozio di {n}',
      'dwelling.manor@modern': 'Villa {n}',
      'room.cellar@modern': 'Cantina',
      'room.vault@modern': 'Stanza blindata',
      'room.servants@modern': 'Alloggio del personale',
      'room.taproom@modern': 'Sala bar',
      'room.living@modern': 'Soggiorno',
      'room.study@modern': 'Studio',
      // Cyberpunk: hab units, conapts, clubs, ripperdocs and corporate towers.
      'dwelling.opt.type.cottage@cyber': 'Modulo abitativo',
      'dwelling.opt.type.townhouse@cyber': 'Blocco conapt',
      'dwelling.opt.type.tavern@cyber': 'Night club',
      'dwelling.opt.type.shop@cyber': 'Clinica ripperdoc',
      'dwelling.opt.type.manor@cyber': 'Attico aziendale',
      'dwelling.opt.cellar@cyber': 'Sottolivello',
      'floor.-1@cyber': 'Sottolivello',
      'floor.0@cyber': 'Livello 0',
      'floor.1@cyber': 'Livello 1',
      'floor.2@cyber': 'Livello 2',
      'dwelling.scale@cyber': '1 quadretto = 1,5 m',
      'dwelling.cottage@cyber': 'Unità abitativa {u} · {n}',
      'dwelling.house@cyber': 'Blocco conapt {n}',
      'dwelling.shop@cyber': 'Clinica di {n}',
      'dwelling.manor@cyber': 'Attico {n}',
      'dwelling.up@cyber': 'su ▲',
      'dwelling.down@cyber': 'giù ▼',
      'dwelling.3d.ground@cyber': 'Asfalto',
      'dwelling.3d.roof@cyber': 'Copertura',
      'room.hall@cyber': 'Ingresso',
      'room.cellar@cyber': 'Vano tecnico',
      'room.vault@cyber': 'Stanza blindata',
      'room.servants@cyber': 'Alloggio della scorta',
      'room.taproom@cyber': 'Bar',
      'room.shop@cyber': 'Negozio di innesti',
      'room.workshop@cyber': 'Officina degli innesti',
      'room.library@cyber': 'Archivio dati',
      'room.living@cyber': 'Soggiorno',
      'room.gym@cyber': 'Palestra',
      // Rooms that exist only today or in the future.
      'room.lobby': 'Androne',
      'room.lobby@cyber': 'Atrio',
      'room.checkpoint': 'Varco di sicurezza',
      'room.garage': 'Garage',
      'room.garage@cyber': 'Rimessa veicoli',
      'room.laundry': 'Lavanderia',
      'room.boiler': 'Locale caldaia',
      'room.boiler@cyber': 'Sala generatori',
      'room.closet': 'Cabina armadio',
      'room.kids': 'Cameretta',
      'room.office': 'Ufficio',
      'room.restroom': 'Servizi igienici',
      'room.restaurant': 'Sala ristorante',
      'room.staff': 'Spogliatoio del personale',
      'room.gym': 'Palestra',
      'room.cinema': 'Sala cinema',
      'room.pool': 'Piscina coperta',
      'room.server': 'Stanzino dei server',
      'room.vrden': 'Tana VR',
      'room.clinic': 'Sala operatoria',
      'room.dancefloor': 'Pista da ballo',
      'room.vip': 'Privé',
      'room.coffin': 'Capsule per dormire',
      'room.security': 'Sala sicurezza',
    },
    en: {
      'gen.dwelling.name': 'Dwelling',
      'dwelling.3d.floor': 'Floor',
      'dwelling.3d.outer': 'Outer walls',
      'dwelling.3d.inner': 'Inner walls',
      'dwelling.3d.windows': 'Windows',
      'dwelling.3d.doors': 'Doors',
      'dwelling.3d.stairs': 'Stairs',
      'dwelling.3d.furniture': 'Furniture',
      'dwelling.3d.roof': 'Roof',
      'dwelling.3d.ground': 'Ground',
      'gen.dwelling.desc': 'Multi-storey floor plans: taverns, houses, manors and shops, furnished room by room.',
      'dwelling.opt.type': 'Building',
      'dwelling.opt.type.auto': 'Random',
      'dwelling.opt.type.cottage': 'Cottage',
      'dwelling.opt.type.townhouse': 'Townhouse',
      'dwelling.opt.type.tavern': 'Tavern',
      'dwelling.opt.type.shop': 'Shop',
      'dwelling.opt.type.manor': 'Manor',
      'dwelling.opt.cellar': 'Cellar',
      'dwelling.opt.labels': 'Room names',
      'dwelling.opt.furniture': 'Furniture',
      'floor.-1': 'Cellar',
      'floor.0': 'Ground floor',
      'floor.1': 'First floor',
      'floor.2': 'Second floor',
      'room.hall': 'Hall',
      'room.landing': 'Landing',
      'room.kitchen': 'Kitchen',
      'room.taproom': 'Taproom',
      'room.dining': 'Dining room',
      'room.living': 'Parlour',
      'room.bedroom': 'Bedroom',
      'room.guest': 'Guest room',
      'room.study': 'Study',
      'room.library': 'Library',
      'room.storage': 'Storeroom',
      'room.pantry': 'Pantry',
      'room.workshop': 'Workshop',
      'room.shop': 'Shop floor',
      'room.bath': 'Bathroom',
      'room.chapel': 'Chapel',
      'room.cellar': 'Cellar',
      'room.wine': 'Wine cellar',
      'room.vault': 'Secret room',
      'room.servants': 'Servants’ quarters',
      'dwelling.up': 'up',
      'dwelling.down': 'down',
      'dwelling.scale': '1 square = 5 ft',
      'dwelling.house': 'House of {n}',
      'dwelling.cottage': '{n}’s Cottage',
      'dwelling.shop': '{n}’s Shop',
      'dwelling.manor': '{n} Manor',
      'dwelling.rooms': 'Rooms',
      'dwelling.floors': 'Floors',
      'dwelling.opt.type.cottage@modern': 'Detached house',
      'dwelling.opt.type.townhouse@modern': 'Apartment block',
      'dwelling.opt.type.tavern@modern': 'Bar & restaurant',
      'dwelling.opt.type.shop@modern': 'Shop with flat',
      'dwelling.opt.type.manor@modern': 'Luxury villa',
      'dwelling.opt.cellar@modern': 'Basement',
      'floor.-1@modern': 'Basement',
      'dwelling.scale@modern': '1 square = 1.5 m (5 ft)',
      'dwelling.cottage@modern': '{n}’s House',
      'dwelling.house@modern': '{n} Apartments',
      'dwelling.shop@modern': '{n}’s Store',
      'dwelling.manor@modern': 'Villa {n}',
      'room.living@modern': 'Living room',
      'room.study@modern': 'Home office',
      'room.cellar@modern': 'Basement',
      'room.vault@modern': 'Safe room',
      'room.servants@modern': 'Staff quarters',
      'room.taproom@modern': 'Bar',
      'dwelling.opt.type.cottage@cyber': 'Hab unit',
      'dwelling.opt.type.townhouse@cyber': 'Conapt block',
      'dwelling.opt.type.tavern@cyber': 'Nightclub',
      'dwelling.opt.type.shop@cyber': 'Ripperdoc clinic',
      'dwelling.opt.type.manor@cyber': 'Corporate penthouse',
      'dwelling.opt.cellar@cyber': 'Sub-level',
      'floor.-1@cyber': 'Sub-level',
      'floor.0@cyber': 'Level 0',
      'floor.1@cyber': 'Level 1',
      'floor.2@cyber': 'Level 2',
      'dwelling.scale@cyber': '1 square = 1.5 m',
      'dwelling.cottage@cyber': 'Hab unit {u} · {n}',
      'dwelling.house@cyber': '{n} Conapt Block',
      'dwelling.shop@cyber': '{n}’s Clinic',
      'dwelling.manor@cyber': '{n} Penthouse',
      'dwelling.up@cyber': 'up ▲',
      'dwelling.down@cyber': 'down ▼',
      'dwelling.3d.ground@cyber': 'Pavement',
      'dwelling.3d.roof@cyber': 'Rooftop',
      'room.hall@cyber': 'Entrance',
      'room.living@cyber': 'Living room',
      'room.cellar@cyber': 'Utility bay',
      'room.vault@cyber': 'Panic room',
      'room.servants@cyber': 'Bodyguard quarters',
      'room.taproom@cyber': 'Bar',
      'room.shop@cyber': 'Implant shop',
      'room.workshop@cyber': 'Cyberware workshop',
      'room.library@cyber': 'Data archive',
      'room.lobby': 'Lobby',
      'room.checkpoint': 'Security checkpoint',
      'room.garage': 'Garage',
      'room.garage@cyber': 'Vehicle bay',
      'room.laundry': 'Laundry room',
      'room.boiler': 'Boiler room',
      'room.boiler@cyber': 'Generator room',
      'room.closet': 'Walk-in closet',
      'room.kids': 'Kids’ room',
      'room.office': 'Office',
      'room.restroom': 'Restrooms',
      'room.restaurant': 'Restaurant',
      'room.staff': 'Staff room',
      'room.gym': 'Home gym',
      'room.gym@cyber': 'Gym',
      'room.cinema': 'Home cinema',
      'room.pool': 'Indoor pool',
      'room.server': 'Server closet',
      'room.vrden': 'VR den',
      'room.clinic': 'Surgery bay',
      'room.dancefloor': 'Dance floor',
      'room.vip': 'VIP lounge',
      'room.coffin': 'Sleep pods',
      'room.security': 'Security room',
    },
  });

  const TAVERN = {
    animals: [['del Cinghiale', 0, 'Boar'], ['dell’Oca', 1, 'Goose'], ['del Grifone', 0, 'Griffin'], ['della Volpe', 1, 'Fox'], ['del Drago', 0, 'Dragon'],
      ['della Lepre', 1, 'Hare'], ['del Corvo', 0, 'Raven'], ['dell’Orso', 0, 'Bear'], ['della Sirena', 1, 'Mermaid'], ['del Gallo', 0, 'Rooster'], ['della Capra', 1, 'Goat']],
    adjs: [['Ubriaco', 'Ubriaca', 'Drunken'], ['d’Oro', 'd’Oro', 'Golden'], ['Zoppo', 'Zoppa', 'Lame'], ['Danzante', 'Danzante', 'Dancing'], ['Rosso', 'Rossa', 'Red'],
      ['Sorridente', 'Sorridente', 'Grinning'], ['Addormentato', 'Addormentata', 'Sleeping'], ['Verde', 'Verde', 'Green'], ['Grasso', 'Grassa', 'Fat'], ['Ribelle', 'Ribelle', 'Rebel']],
  };

  const SPECS = {
    cottage: { w: [5, 7], h: [4, 5], floors: [1, 1], wing: 0.4, cellar: 0.2, ground: ['kitchen', 'living', 'bedroom', 'pantry', 'storage'], upper: ['bedroom', 'storage'] },
    townhouse: { w: [4, 6], h: [6, 8], floors: [2, 3], wing: 0, cellar: 0.6, ground: ['kitchen', 'living', 'dining', 'pantry', 'study'], upper: ['bedroom', 'bedroom', 'study', 'bath', 'guest', 'storage'] },
    tavern: { w: [8, 11], h: [6, 8], floors: [2, 2], wing: 0.5, cellar: 0.85, ground: ['taproom', 'kitchen', 'pantry', 'storage', 'dining'], upper: ['guest', 'guest', 'guest', 'guest', 'bedroom', 'bath', 'storage'] },
    shop: { w: [5, 7], h: [6, 8], floors: [2, 2], wing: 0, cellar: 0.5, ground: ['shop', 'workshop', 'storage', 'kitchen'], upper: ['bedroom', 'living', 'bedroom', 'storage'] },
    manor: { w: [10, 14], h: [7, 9], floors: [2, 2], wing: 0.9, cellar: 0.7, ground: ['living', 'dining', 'kitchen', 'library', 'chapel', 'pantry', 'servants', 'study'], upper: ['bedroom', 'bedroom', 'guest', 'bath', 'study', 'guest', 'storage'] },
  };
  // Present day: bars and restaurants ("Trattoria del Porto", "Harbour Diner",
  // "Caffè da Marco"); cyberpunk: clubs ("Il Chiodo Arrugginito", "Neon Lotus").
  const BAR = {
    kinds: [['Bar', 'Bar'], ['Trattoria', 'Diner'], ['Osteria', 'Grill'], ['Pizzeria', 'Pizzeria'], ['Caffè', 'Café'], ['Birreria', 'Pub'], ['Bistrot', 'Bistro']],
    places: [['Centrale', 'Central'], ['della Stazione', 'Station'], ['del Porto', 'Harbour'], ['del Corso', 'Main Street'], ['al Ponte', 'Bridge'], ['dello Sport', 'Sports'],
      ['dell’Angolo', 'Corner'], ['del Mercato', 'Market'], ['Belvedere', 'Belvedere'], ['Aurora', 'Aurora'], ['della Piazza', 'Town Square'], ['del Teatro', 'Theatre']],
  };
  const CLUB = {
    nouns: [['Il Chiodo', 0, 'Nail'], ['Il Loto', 0, 'Lotus'], ['La Volpe', 1, 'Fox'], ['Il Circuito', 0, 'Circuit'], ['Lo Spettro', 0, 'Ghost'], ['La Geisha', 1, 'Geisha'],
      ['Il Drago', 0, 'Dragon'], ['La Falena', 1, 'Moth'], ['Il Santo', 0, 'Saint'], ['La Sirena', 1, 'Siren'], ['La Vipera', 1, 'Viper'], ['Il Gatto', 0, 'Cat']],
    adjs: [['Arrugginito', 'Arrugginita', 'Rusty'], ['al Neon', 'al Neon', 'Neon'], ['Elettrico', 'Elettrica', 'Electric'], ['Ubriaco', 'Ubriaca', 'Drunken'],
      ['Velenoso', 'Velenosa', 'Poison'], ['Nero', 'Nera', 'Black'], ['Statico', 'Statica', 'Static'], ['Sintetico', 'Sintetica', 'Synthetic'],
      ['Cromato', 'Cromata', 'Chrome'], ['Rotto', 'Rotta', 'Broken'], ['di Vetro', 'di Vetro', 'Glass'], ['Insonne', 'Insonne', 'Sleepless']],
  };

  // Room lists of each building outside fantasy (the plan stays the same,
  // the rooms change): cellar, ground floor, upper floors, and the extras used
  // when a list runs out.
  const ROOMS = {
    modern: {
      cellar: ['garage', 'storage', 'boiler', 'laundry', 'wine'],
      cottage: { ground: ['kitchen', 'living', 'bedroom', 'bath', 'kids', 'laundry'], upper: ['bedroom', 'kids', 'bath', 'storage'] },
      townhouse: { ground: ['garage', 'living', 'kitchen', 'bath', 'bedroom'], upper: ['living', 'kitchen', 'bedroom', 'bath', 'bedroom', 'study'] },
      tavern: { ground: ['restaurant', 'kitchen', 'restroom', 'storage', 'office'], upper: ['guest', 'guest', 'bath', 'office', 'staff', 'storage'] },
      shop: { ground: ['shop', 'storage', 'office', 'restroom'], upper: ['living', 'kitchen', 'bedroom', 'bath', 'kids', 'storage'] },
      manor: { ground: ['living', 'dining', 'kitchen', 'study', 'cinema', 'pool', 'laundry', 'servants', 'pantry'], upper: ['bedroom', 'bedroom', 'guest', 'bath', 'closet', 'gym', 'bath', 'guest'] },
      extras: (level, type) => (level < 0 ? ['cellar', 'storage'] : level === 0 ? (type === 'manor' ? ['staff', 'storage', 'study', 'laundry'] : ['storage', 'laundry', 'bath']) : ['bedroom', 'closet', 'storage', 'study']),
    },
    cyber: {
      cellar: ['server', 'storage', 'boiler', 'garage', 'vault'],
      cottage: { ground: ['kitchen', 'living', 'bedroom', 'bath', 'vrden', 'storage'], upper: ['bedroom', 'vrden', 'storage'] },
      townhouse: { ground: ['security', 'living', 'kitchen', 'bath', 'bedroom'], upper: ['living', 'kitchen', 'bedroom', 'bath', 'vrden', 'server'] },
      tavern: { ground: ['dancefloor', 'kitchen', 'restroom', 'storage', 'vip'], upper: ['vip', 'coffin', 'coffin', 'office', 'server', 'restroom', 'storage'] },
      shop: { ground: ['clinic', 'workshop', 'storage', 'restroom'], upper: ['bedroom', 'living', 'kitchen', 'server', 'vrden'] },
      manor: { ground: ['living', 'dining', 'kitchen', 'office', 'library', 'security', 'gym', 'pantry'], upper: ['bedroom', 'bedroom', 'guest', 'bath', 'closet', 'clinic', 'vault', 'office'] },
      extras: (level, type) => (level < 0 ? ['cellar', 'storage'] : level === 0 ? (type === 'manor' ? ['servants', 'storage', 'office'] : ['storage', 'server', 'bath']) : ['bedroom', 'vrden', 'storage', 'server']),
    },
  };
  // Entrance of each building outside fantasy.
  const HALL = { modern: { townhouse: 'lobby' }, cyber: { townhouse: 'lobby', tavern: 'checkpoint', manor: 'checkpoint' } };
  const BIG = { taproom: 1, living: 1, dining: 1, shop: 1, library: 1, chapel: 1, workshop: 1, restaurant: 1, cinema: 1, pool: 1, dancefloor: 1, garage: 1, clinic: 1 };
  // Rooms without windows (besides storerooms, pantries and vaults).
  const BLIND = { server: 1, boiler: 1, cinema: 1, coffin: 1, closet: 1 };

  const key = (x, y) => x + ',' + y;

  // Binary space partition of a rectangle into rooms.
  function partition(rng, r, maxArea, minSide, out) {
    const area = r.w * r.h;
    const canSplitW = r.w >= minSide * 2, canSplitH = r.h >= minSide * 2;
    if ((area <= maxArea && Math.max(r.w, r.h) <= minSide * 3) || (!canSplitW && !canSplitH)) { out.push(r); return; }
    if (area <= maxArea * 1.4 && rng.bool(0.35)) { out.push(r); return; }
    const vertical = canSplitW && (!canSplitH || r.w > r.h || (r.w === r.h && rng.bool()));
    if (vertical) {
      const s = rng.int(minSide, r.w - minSide);
      partition(rng, { x: r.x, y: r.y, w: s, h: r.h }, maxArea, minSide, out);
      partition(rng, { x: r.x + s, y: r.y, w: r.w - s, h: r.h }, maxArea, minSide, out);
    } else {
      const s = rng.int(minSide, r.h - minSide);
      partition(rng, { x: r.x, y: r.y, w: r.w, h: s }, maxArea, minSide, out);
      partition(rng, { x: r.x, y: r.y + s, w: r.w, h: r.h - s }, maxArea, minSide, out);
    }
  }

  function cellsOf(r) {
    const out = [];
    for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) out.push([x, y]);
    return out;
  }

  function generate(seed, opts) {
    const rng = new Carto.Random(seed);
    const type = opts.type && opts.type !== 'auto' ? opts.type : rng.fork('type').weighted([['cottage', 2], ['townhouse', 2], ['tavern', 2], ['shop', 1.5], ['manor', 1]]);
    const spec = SPECS[type];
    const setting = Carto.Setting.current;
    const alt = ROOMS[setting] || null;
    const w = rng.int(spec.w[0], spec.w[1]), h = rng.int(spec.h[0], spec.h[1]);
    const blocks = [{ x: 0, y: 0, w, h }];
    if (rng.bool(spec.wing)) {
      // A wing behind the main block (the street is along the bottom edge).
      const ww = Math.max(3, Math.round(w * rng.float(0.35, 0.55))), wh = rng.int(3, Math.max(3, Math.round(h * 0.7)));
      const side = type === 'manor' ? 'both' : rng.pick(['left', 'right']);
      if (side === 'left' || side === 'both') blocks.push({ x: 0, y: -wh, w: ww, h: wh });
      if (side === 'right' || side === 'both') blocks.push({ x: w - ww, y: -wh, w: ww, h: wh });
    }
    const foot = new Set();
    for (const b of blocks) for (const [x, y] of cellsOf(b)) foot.add(key(x, y));
    const floorsN = rng.int(spec.floors[0], spec.floors[1]);
    const hasCellar = opts.cellar && rng.bool(Math.max(spec.cellar, 0.5));

    // Ground partition; the hall touches the street and holds the stairs.
    const pr = rng.fork('partition');
    let ground = [];
    for (const [i, b] of blocks.entries()) {
      const out = [];
      const big = i === 0 && (type === 'tavern' || type === 'manor' || type === 'shop');
      partition(pr, b, big ? 16 : i > 0 ? 14 : 10, 2, out);
      ground = ground.concat(out);
    }
    // Hall: a front room, smallish, near the middle of the street side.
    const front = ground.filter((r) => r.y + r.h === h);
    front.sort((a, b) => Math.abs(a.x + a.w / 2 - w / 2) - Math.abs(b.x + b.w / 2 - w / 2) + (a.w * a.h - b.w * b.h) * 0.08);
    const hall = front[0];
    // Stairs: two cells along the hall's back or side wall.
    const stairs = [];
    if (floorsN > 1 || hasCellar) {
      if (hall.h >= 2 && hall.w >= 2) {
        const atLeft = pr.bool();
        const sx = atLeft ? hall.x : hall.x + hall.w - 1;
        stairs.push([sx, hall.y], [sx, hall.y + 1]);
      } else stairs.push([hall.x, hall.y]);
    }
    const stairSet = new Set(stairs.map(([x, y]) => key(x, y)));

    const floors = [];
    const levels = [];
    if (hasCellar) levels.push(-1);
    for (let f = 0; f < floorsN; f++) levels.push(f);
    for (const level of levels) {
      const fr = rng.fork('floor' + level);
      let rects;
      if (level <= 0) rects = ground.map((r) => Object.assign({}, r));
      else {
        rects = [];
        for (const r of ground) {
          if (r === hall) { rects.push(Object.assign({}, r)); continue; }
          const limit = type === 'manor' ? 14 : type === 'tavern' ? 8 : 10;
          if (r.w * r.h > limit + 1) partition(fr, r, limit, 2, rects);
          else rects.push(Object.assign({}, r));
        }
      }
      const rooms = rects.map((r) => ({ x: r.x, y: r.y, w: r.w, h: r.h }));
      const hallRoom = rooms.find((r) => r.x === hall.x && r.y === hall.y && r.w === hall.w && r.h === hall.h);
      hallRoom.type = level === 0 ? 'hall' : level === -1 ? 'cellar' : 'landing';
      if (alt && level === 0 && HALL[setting][type]) hallRoom.type = HALL[setting][type];
      if (level === 0 && type === 'tavern') {
        // In a tavern you walk straight into the taproom: make the biggest front room the hall.
        const tap = rooms.filter((r) => r !== hallRoom && r.y + r.h === h).sort((a, b) => b.w * b.h - a.w * a.h)[0];
        if (tap) tap.type = 'taproom';
      }
      if (level === 0 && type === 'shop') {
        const shop = rooms.filter((r) => r !== hallRoom && r.y + r.h === h).sort((a, b) => b.w * b.h - a.w * a.h)[0];
        if (shop) shop.type = 'shop';
      }
      const pool = alt ? (level === -1 ? alt.cellar : level === 0 ? alt[type].ground : alt[type].upper).slice()
        : level === -1 ? ['wine', 'storage', 'cellar', 'storage', 'vault'] : level === 0 ? spec.ground.slice() : spec.upper.slice();
      for (const r of rooms) if (r.type && pool.includes(r.type)) pool.splice(pool.indexOf(r.type), 1);
      // Once the list runs out, cycle through sensible extras for the floor.
      const extras = alt ? alt.extras(level, type) : level < 0 ? ['cellar', 'storage'] : level === 0 ? (type === 'manor' ? ['servants', 'storage', 'study', 'pantry'] : ['storage', 'workshop', 'pantry']) : ['bedroom', 'guest', 'storage', 'study'];
      let ex = 0;
      const rest = rooms.filter((r) => !r.type).sort((a, b) => b.w * b.h - a.w * a.h);
      for (const r of rest) {
        let pick = pool.find((tp) => (BIG[tp] ? r.w * r.h >= 6 : true));
        if (pick) pool.splice(pool.indexOf(pick), 1);
        else pick = extras[ex++ % extras.length];
        r.type = pick;
      }
      rooms.forEach((r, i) => { r.id = i; });

      // Cell -> room lookup.
      const at = new Map();
      for (const r of rooms) for (const [x, y] of cellsOf(r)) at.set(key(x, y), r);

      // Doors: connect every room to the hall through a spanning tree.
      const shared = new Map(); // "a|b" -> list of edges {x, y, vertical}
      for (const r of rooms) {
        for (const [x, y] of cellsOf(r)) {
          for (const [dx, dy] of [[1, 0], [0, 1]]) {
            const o = at.get(key(x + dx, y + dy));
            if (!o || o === r) continue;
            const k = Math.min(r.id, o.id) + '|' + Math.max(r.id, o.id);
            if (!shared.has(k)) shared.set(k, []);
            shared.get(k).push({ x: x + dx, y: y + (dy ? 1 : 0), vertical: dx === 1, cells: [[x, y], [x + dx, y + dy]] });
          }
        }
      }
      const doors = [];
      const connected = new Set([hallRoom.id]);
      const pairs = fr.shuffle(Array.from(shared.keys()));
      let changed = true;
      const okEdge = (e) => !e.cells.some(([x, y]) => stairSet.has(key(x, y)));
      const pickEdge = (list) => {
        const good = list.filter(okEdge);
        const pool2 = good.length ? good : list;
        // Prefer edges away from the ends of the shared wall.
        return pool2[Math.floor(pool2.length / 2 + fr.float(-0.3, 0.3) * (pool2.length - 1))] || pool2[0];
      };
      while (changed) {
        changed = false;
        for (const k of pairs) {
          const [a, b] = k.split('|').map(Number);
          if (connected.has(a) === connected.has(b)) continue;
          doors.push(Object.assign({ type: 'inner' }, pickEdge(shared.get(k))));
          connected.add(a); connected.add(b);
          changed = true;
        }
      }
      for (const k of pairs) {
        if (fr.bool(0.18) && !doors.some((d) => d.pair === k)) {
          const [a, b] = k.split('|').map(Number);
          if ((rooms[a].type === 'bath' || rooms[b].type === 'bath' || rooms[a].type === 'vault' || rooms[b].type === 'vault')) continue;
          if (alt && [rooms[a].type, rooms[b].type].some((tp) => tp === 'restroom' || tp === 'closet' || tp === 'server' || tp === 'security')) continue;
          const e = pickEdge(shared.get(k));
          if (!doors.some((d) => d.x === e.x && d.y === e.y && d.vertical === e.vertical)) doors.push(Object.assign({ type: 'inner', pair: k }, e));
        }
      }
      // Exterior edges of each room (for windows and outside doors).
      const outside = [];
      for (const r of rooms) {
        for (const [x, y] of cellsOf(r)) {
          if (!foot.has(key(x, y - 1))) outside.push({ r, x, y, vertical: false, side: 'n' });
          if (!foot.has(key(x, y + 1))) outside.push({ r, x, y: y + 1, vertical: false, side: 's' });
          if (!foot.has(key(x - 1, y))) outside.push({ r, x, y, vertical: true, side: 'w' });
          if (!foot.has(key(x + 1, y))) outside.push({ r, x: x + 1, y, vertical: true, side: 'e' });
        }
      }
      if (level === 0) {
        const fronts = outside.filter((e) => e.side === 's' && (e.r === hallRoom || e.r.type === 'taproom' || e.r.type === 'shop'));
        const fd = fronts.find((e) => e.r === hallRoom && !stairSet.has(key(e.x, e.y - 1))) || fronts[0];
        if (fd) doors.push({ x: fd.x, y: fd.y, vertical: false, type: 'front' });
        const kitchen = rooms.find((r) => r.type === 'kitchen');
        const back = kitchen && outside.filter((e) => e.r === kitchen && e.side !== 's');
        if (back && back.length && fr.bool(0.6)) {
          const e = back[Math.floor(back.length / 2)];
          doors.push({ x: e.x, y: e.y, vertical: e.vertical, type: 'back' });
        }
      }
      const windows = [];
      if (level >= 0) {
        for (const e of outside) {
          const isDoor = doors.some((d) => d.x === e.x && d.y === e.y && d.vertical === e.vertical);
          if (isDoor) continue;
          const along = e.vertical ? e.y : e.x;
          const r = e.r;
          const lo = e.vertical ? r.y : r.x, hi = e.vertical ? r.y + r.h - 1 : r.x + r.w - 1;
          if ((hi - lo >= 2 && (along === lo || along === hi)) || r.type === 'storage' || r.type === 'pantry' || r.type === 'vault' || BLIND[r.type]) continue;
          if ((along - lo) % 2 === (hi - lo >= 2 ? 1 : 0) || hi === lo) windows.push(e);
        }
      }

      // Furniture.
      const items = opts.furniture === false ? [] : furnish(fr, rooms, doors, stairSet, level, type);
      floors.push({ level, rooms, doors, windows, items });
    }

    // Name.
    const nr = rng.fork('name');
    let name;
    if (alt) name = altName(nr, type, setting);
    else if (type === 'tavern') name = { tavern: [nr.int(0, TAVERN.animals.length - 1), nr.int(0, TAVERN.adjs.length - 1)] };
    else name = { key: { cottage: 'dwelling.cottage', shop: 'dwelling.shop', manor: 'dwelling.manor' }[type] || 'dwelling.house', n: Carto.Names.person(nr) };
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const b of blocks) { x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.w); y1 = Math.max(y1, b.y + b.h); }
    return { seed, type, foot: Array.from(foot), blocks, floors, stairs, bounds: { x0, y0, x1, y1 }, name };
  }

  // Names outside fantasy: bars and clubs, flats, villas, clinics, corporate towers.
  function altName(rng, type, setting) {
    const surname = (n) => n.split(' ').pop();
    if (setting === 'modern') {
      if (type === 'tavern') {
        const k = rng.int(0, BAR.kinds.length - 1);
        return rng.bool(0.3) ? { bar: [k, -1], n: Carto.Names.person(rng).split(' ')[0] } : { bar: [k, rng.int(0, BAR.places.length - 1)] };
      }
      const n = Carto.Names.person(rng);
      return { key: { cottage: 'dwelling.cottage', shop: 'dwelling.shop', manor: 'dwelling.manor' }[type] || 'dwelling.house', n: type === 'cottage' || type === 'shop' ? n : surname(n) };
    }
    if (type === 'tavern') return { club: [rng.int(0, CLUB.nouns.length - 1), rng.int(0, CLUB.adjs.length - 1), rng.bool(0.4) ? 1 : 0] };
    if (type === 'townhouse' || type === 'manor') return { key: type === 'manor' ? 'dwelling.manor' : 'dwelling.house', n: Carto.Names.corp(rng) };
    const n = Carto.Names.person(rng);
    return type === 'cottage' ? { key: 'dwelling.cottage', n, u: rng.int(1, 40) + '-' + rng.int(100, 999) } : { key: 'dwelling.shop', n };
  }

  // Furniture of today and of the future; returns false for rooms furnished
  // as in fantasy (halls, studies, libraries, shops, wine cellars...).
  function furnishAlt(r, f, rng, setting, type) {
    const { wall, center, one } = f;
    const cyber = setting === 'cyber', area = r.w * r.h;
    switch (r.type) {
      case 'bedroom': case 'guest': case 'kids':
        wall('bed', 2);
        wall('chest', 1);
        if (area > 6) wall('wardrobe', 1);
        if (r.type === 'kids') { wall('desk', 1); center('rug', Math.max(1, r.w - 2), Math.max(1, r.h - 2)); }
        else if (cyber) wall('tv', 2);
        else if (area > 9) wall('desk', 1);
        if (r.type === 'guest' && area > 8) wall('bed', 2);
        return true;
      case 'kitchen':
        wall('stove', 1);
        wall('fridge', 1);
        wall('counter', 2);
        wall('sink', 1);
        center('table', 2, 1);
        return true;
      case 'living':
        wall('sofa', 2);
        wall('tv', 2);
        if (!cyber && (type === 'manor' || type === 'cottage')) wall('hearth', 2);
        center('rug', Math.max(1, r.w - 2), Math.max(1, r.h - 2));
        wall('chair', 1);
        return true;
      case 'taproom':
        wall('bar', Math.min(4, Math.max(2, r.w - 2)));
        wall('tv', 2);
        for (let i = 0; i < 4; i++) {
          const x = r.x + 1 + rng.int(0, Math.max(0, r.w - 3)), y = r.y + 1 + rng.int(0, Math.max(0, r.h - 3));
          one('roundtable', x, y);
        }
        return true;
      case 'restaurant':
        wall('cabinet', 1);
        for (let i = 0; i < 6; i++) {
          const x = r.x + 1 + rng.int(0, Math.max(0, r.w - 3)), y = r.y + 1 + rng.int(0, Math.max(0, r.h - 3));
          one('roundtable', x, y);
        }
        return true;
      case 'dancefloor':
        wall('dj', 2);
        wall('sofa', 2);
        center('dance', Math.max(1, r.w - 2), Math.max(1, r.h - 2));
        return true;
      case 'vip': wall('sofa', 2); wall('sofa', 2); wall('bar', 1); center('table', 1, 1); return true;
      case 'coffin': for (let i = 0; i < 5; i++) wall('pod', 2); return true;
      case 'office': wall('desk', 1); wall('chair', 1); wall('shelf', 2); wall(cyber ? 'server' : 'cabinet', 1); return true;
      case 'storage': case 'pantry': case 'cellar':
        for (let i = 0; i < 5; i++) wall(rng.pick(cyber ? ['crate', 'crate', 'rack', 'server'] : r.type === 'pantry' ? ['shelf', 'shelf', 'crate'] : ['crate', 'shelf', 'crate', 'rack']), 1);
        return true;
      case 'workshop': wall('bench', 2); wall(cyber ? 'server' : 'cabinet', 1); wall('crate', 1); wall('shelf', 2); return true;
      case 'garage': wall('car', Math.min(3, Math.max(r.w, r.h))) || wall('car', 2); wall('shelf', 2); wall(cyber ? 'server' : 'bench', 1); return true;
      case 'laundry': wall('washer', 1); wall('washer', 1); wall('sink', 1); wall('shelf', 1); return true;
      case 'boiler': wall('tank', 1); wall('tank', 1); wall('cabinet', 1); return true;
      case 'closet': for (let i = 0; i < 3; i++) wall('wardrobe', 1); wall('shelf', 2); return true;
      case 'bath':
        if (area >= 6) wall('tub', 2); else wall('shower', 1);
        wall('toilet', 1);
        wall('sink', 1);
        return true;
      case 'restroom': for (let i = 0; i < 3; i++) wall('toilet', 1); wall('sink', 1); wall('sink', 1); return true;
      case 'staff': case 'servants':
        if (r.type === 'servants') { wall('bed', 2); wall('bed', 2); }
        wall('cabinet', 1); wall('cabinet', 1); wall('bench', 2);
        return true;
      case 'gym': wall('treadmill', 2); wall('treadmill', 2); wall('weights', 1); wall('bench', 2); return true;
      case 'cinema': wall('tv', 3); center('pews', Math.max(1, r.w - 2), Math.max(1, r.h - 3)); return true;
      case 'pool':
        // As big as the room allows, clear of the doorways.
        [[2, 2], [1, 2], [2, 1], [1, 1], [2, 3], [3, 2]].some(([a, b]) => r.w - a >= 1 && r.h - b >= 1 && center('pool', r.w - a, r.h - b));
        wall('chair', 1); wall('chair', 1);
        return true;
      case 'server': for (let i = 0; i < 4; i++) wall('server', 1); wall('desk', 1); return true;
      case 'vrden': wall('vrchair', 1); wall('server', 1); wall('tv', 2); wall('sofa', 2); return true;
      case 'clinic': wall('surgery', 2); wall('cabinet', 1); wall('tv', 1); wall('sink', 1); wall('server', 1); return true;
      case 'security': wall('tv', 3); wall('desk', 2); wall('chair', 1); wall('cabinet', 1); return true;
      case 'vault': wall('cabinet', 1); wall('chest', 1); wall('tv', 1); if (cyber) wall('bed', 2); return true;
      case 'lobby': case 'checkpoint':
        if (r.type === 'checkpoint') { wall('desk', 1); wall('server', 1); } else wall('shelf', 1);
        if (area >= 6) center('rug', 1, 1);
        return true;
    }
    return false;
  }

  // Place furniture against free walls and in the middle of rooms.
  function furnish(rng, rooms, doors, stairSet, level, type) {
    const setting = Carto.Setting.current;
    const items = [];
    const doorCells = new Set();
    for (const d of doors) {
      if (d.cells) for (const [x, y] of d.cells) doorCells.add(key(x, y));
      else {
        doorCells.add(key(d.x, d.y));
        doorCells.add(d.vertical ? key(d.x - 1, d.y) : key(d.x, d.y - 1));
      }
    }
    for (const r of rooms) {
      const free = (x, y) => !doorCells.has(key(x, y)) && !stairSet.has(key(x, y));
      const used = new Set();
      const take = (cells) => {
        if (cells.some(([x, y]) => x < r.x || y < r.y || x >= r.x + r.w || y >= r.y + r.h || !free(x, y) || used.has(key(x, y)))) return false;
        for (const [x, y] of cells) used.add(key(x, y));
        return true;
      };
      const wallSpots = [];
      for (let x = r.x; x < r.x + r.w; x++) { wallSpots.push({ x, y: r.y, side: 'n' }); wallSpots.push({ x, y: r.y + r.h - 1, side: 's' }); }
      for (let y = r.y; y < r.y + r.h; y++) { wallSpots.push({ x: r.x, y, side: 'w' }); wallSpots.push({ x: r.x + r.w - 1, y, side: 'e' }); }
      const spots = rng.shuffle(wallSpots);
      const againstWall = (kind, len) => {
        for (const s of spots) {
          const horiz = s.side === 'n' || s.side === 's';
          const cells = [];
          for (let i = 0; i < len; i++) cells.push(horiz ? [s.x + i, s.y] : [s.x, s.y + i]);
          if (take(cells)) { items.push({ kind, x: s.x, y: s.y, len, side: s.side }); return true; }
        }
        return false;
      };
      const center = (kind, w, h) => {
        const cx = r.x + Math.floor((r.w - w) / 2), cy = r.y + Math.floor((r.h - h) / 2);
        const cells = [];
        for (let y = cy; y < cy + h; y++) for (let x = cx; x < cx + w; x++) cells.push([x, y]);
        if (r.w >= w + 2 && r.h >= h + 2 || (r.w >= w && r.h >= h && (kind === 'rug' || kind === 'pool'))) {
          if (take(cells)) { items.push({ kind, x: cx, y: cy, w, h }); return true; }
        }
        return false;
      };
      if (setting !== 'fantasy') {
        const one = (kind, x, y) => { if (take([[x, y]])) items.push({ kind, x, y }); };
        if (furnishAlt(r, { wall: againstWall, center, one }, rng, setting, type)) continue;
      }
      switch (r.type) {
        case 'bedroom': case 'guest':
          againstWall('bed', 2);
          againstWall('chest', 1);
          if (r.w * r.h > 6) againstWall('wardrobe', 1);
          if (r.type === 'guest' && r.w * r.h > 8) againstWall('bed', 2);
          break;
        case 'kitchen':
          againstWall('hearth', 2);
          againstWall('barrel', 1);
          center('table', 2, 1) || againstWall('counter', 2);
          break;
        case 'taproom':
          againstWall('bar', Math.min(4, Math.max(2, r.w - 2)));
          againstWall('hearth', 2);
          for (let i = 0; i < 4; i++) {
            const x = r.x + 1 + rng.int(0, Math.max(0, r.w - 3)), y = r.y + 1 + rng.int(0, Math.max(0, r.h - 3));
            if (take([[x, y]])) items.push({ kind: 'roundtable', x, y });
          }
          break;
        case 'dining': center('longtable', Math.max(2, r.w - 2), 1) || center('table', 2, 1); againstWall('cabinet', 1); break;
        case 'living': againstWall('hearth', 2); center('rug', Math.max(1, r.w - 2), Math.max(1, r.h - 2)); againstWall('chair', 1); againstWall('chair', 1); break;
        case 'study': againstWall('desk', 1); againstWall('shelf', 2); break;
        case 'library': againstWall('shelf', 3); againstWall('shelf', 3); againstWall('shelf', 2); center('table', 2, 1); break;
        case 'storage': case 'pantry': case 'cellar': case 'wine':
          for (let i = 0; i < 5; i++) againstWall(rng.pick(r.type === 'wine' ? ['barrel', 'barrel', 'rack'] : ['barrel', 'crate', 'sack']), 1);
          break;
        case 'workshop': againstWall('bench', 2); againstWall('anvil', 1); againstWall('crate', 1); break;
        case 'shop': againstWall('counter', Math.min(3, r.w - 1)); againstWall('shelf', 2); againstWall('shelf', 2); break;
        case 'bath': againstWall('tub', 2); break;
        case 'chapel': againstWall('altar', 2); center('pews', Math.max(1, r.w - 2), Math.max(1, r.h - 3)); break;
        case 'servants': againstWall('bed', 2); againstWall('bed', 2); againstWall('chest', 1); break;
        case 'vault': againstWall('chest', 1); againstWall('chest', 1); break;
        case 'hall': case 'landing': if (r.w * r.h >= 6) center('rug', 1, 1); break;
      }
    }
    return items;
  }

  // ------------------------------------------------------------- rendering

  const CS = 20;

  function drawItem(it, b, pal) {
    const P = (v) => v * CS;
    const horizWall = it.side === 'n' || it.side === 's';
    // Rect hugging the wall: depth d (cells), length len.
    const hug = (d, inset = 0.12) => {
      const len = (it.len || 1) - inset * 2;
      if (horizWall) {
        const y = it.side === 'n' ? it.y + inset : it.y + 1 - inset - d;
        return [P(it.x + inset), P(y), P(len), P(d)];
      }
      const x = it.side === 'w' ? it.x + inset : it.x + 1 - inset - d;
      return [P(x), P(it.y + inset), P(d), P(len)];
    };
    const rect = ([x, y, w, h]) => G.rect(x + w / 2, y + h / 2, w, h);
    switch (it.kind) {
      case 'bed': {
        const r = hug(0.85);
        b.light.poly(rect(r));
        const pil = horizWall ? [r[0] + 2, it.side === 'n' ? r[1] + 2 : r[1] + r[3] - 7, r[2] - 4, 5] : [it.side === 'w' ? r[0] + 2 : r[0] + r[2] - 7, r[1] + 2, 5, r[3] - 4];
        if (horizWall) b.light.poly(rect([r[0] + 2, r[1] + 2, r[2] - 4, 5]));
        else b.light.poly(rect(pil));
        break;
      }
      case 'chest': case 'wardrobe': case 'cabinet': { const r = hug(it.kind === 'chest' ? 0.45 : 0.5); b.dark.poly(rect(r)); break; }
      case 'hearth': {
        const r = hug(0.45, 0.05);
        b.stone.poly(rect(r));
        const c = G.centroid(rect(r));
        b.fire.circle(c.x, c.y, CS * 0.12);
        break;
      }
      case 'barrel': case 'tank': {
        const r = hug(0.7);
        const c = G.centroid(rect(r));
        b.light.circle(c.x, c.y, CS * 0.32);
        b.thin.circle(c.x, c.y, CS * 0.18);
        break;
      }
      case 'crate': { const r = rect(hug(0.65)); b.light.poly(r); b.thin.line(r[0], r[2]); b.thin.line(r[1], r[3]); break; }
      case 'sack': { const r = hug(0.6); const c = G.centroid(rect(r)); b.light.smooth(G.regular(c.x, c.y, CS * 0.25, 7), true); break; }
      case 'rack': { const r = rect(hug(0.4)); b.dark.poly(r); break; }
      case 'counter': case 'bar': case 'bench': case 'shelf': case 'altar': {
        const r = rect(hug(it.kind === 'shelf' ? 0.35 : 0.55));
        (it.kind === 'altar' ? b.dark : b.light).poly(r);
        if (it.kind === 'shelf') {
          const n = it.len * 3;
          for (let i = 1; i < n; i++) b.thin.line(G.lerp(r[0], r[1], i / n), G.lerp(r[3], r[2], i / n));
        }
        break;
      }
      case 'anvil': { const r = hug(0.4); b.dark.poly(rect([r[0] + 3, r[1] + 3, r[2] - 6, r[3] - 6])); break; }
      case 'desk': { const r = rect(hug(0.6)); b.light.poly(r); break; }
      case 'chair': { const r = hug(0.45, 0.28); b.light.poly(rect(r)); break; }
      case 'tub': { const r = hug(0.75); b.water.smooth(rect(r), true); break; }
      case 'table': case 'longtable': {
        const r = [P(it.x + 0.15), P(it.y + 0.2), P(it.w - 0.3), P(it.h - 0.4)];
        b.light.poly(rect(r));
        const n = Math.round(it.w * 1.5);
        for (let i = 0; i < n; i++) {
          const x = r[0] + (r[2] * (i + 0.5)) / n;
          b.light.circle(x, r[1] - CS * 0.16, CS * 0.12);
          b.light.circle(x, r[1] + r[3] + CS * 0.16, CS * 0.12);
        }
        break;
      }
      case 'roundtable': {
        const cx = P(it.x + 0.5), cy = P(it.y + 0.5);
        b.light.circle(cx, cy, CS * 0.3);
        for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2 + 0.6; b.light.circle(cx + Math.cos(a) * CS * 0.45, cy + Math.sin(a) * CS * 0.45, CS * 0.11); }
        break;
      }
      case 'rug': b.rug.poly(rect([P(it.x + 0.15), P(it.y + 0.15), P(it.w - 0.3), P(it.h - 0.3)])); break;
      case 'pews': for (let y = it.y; y < it.y + it.h; y++) b.light.poly(rect([P(it.x + 0.2), P(y + 0.3), P(it.w - 0.4), P(0.35)])); break;
      // Present day and cyberpunk.
      case 'stove': {
        const r = hug(0.6);
        b.light.poly(rect(r));
        for (const [u, v] of [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]]) b.thin.circle(r[0] + r[2] * u, r[1] + r[3] * v, CS * 0.08);
        break;
      }
      case 'fridge': case 'server': case 'dj': {
        const r = rect(hug(it.kind === 'fridge' ? 0.65 : 0.55));
        b.dark.poly(r);
        if (it.kind === 'server') for (let i = 1; i < 4; i++) b.thin.line(G.lerp(r[0], r[3], i / 4), G.lerp(r[1], r[2], i / 4));
        if (it.kind === 'dj') { const c = G.centroid(r), d = horizWall ? { x: CS * 0.3, y: 0 } : { x: 0, y: CS * 0.3 }; b.thin.circle(c.x - d.x, c.y - d.y, CS * 0.15); b.thin.circle(c.x + d.x, c.y + d.y, CS * 0.15); }
        break;
      }
      case 'sofa': b.light.poly(rect(hug(0.8, 0.1))); b.light.poly(rect(hug(0.25, 0.1))); break;
      case 'tv': b.dark.poly(rect(hug(0.12, 0.15))); break;
      case 'toilet': { const c = G.centroid(rect(hug(0.75, 0.25))); b.light.circle(c.x, c.y, CS * 0.2); b.light.poly(rect(hug(0.22, 0.25))); break; }
      case 'sink': { const r = hug(0.4, 0.2); b.light.poly(rect(r)); const c = G.centroid(rect(r)); b.thin.circle(c.x, c.y, CS * 0.1); break; }
      case 'shower': { const r = rect(hug(0.85, 0.08)); b.light.poly(r); b.thin.line(r[0], r[2]); b.thin.line(r[1], r[3]); break; }
      case 'washer': { const r = hug(0.7, 0.15); b.light.poly(rect(r)); const c = G.centroid(rect(r)); b.thin.circle(c.x, c.y, CS * 0.2); break; }
      case 'car': case 'pod': {
        const r = hug(it.kind === 'car' ? 0.9 : 0.75, 0.08), c = Math.min(r[2], r[3]) * 0.3;
        // Rounded off corners.
        b.light.poly([[r[0] + c, r[1]], [r[0] + r[2] - c, r[1]], [r[0] + r[2], r[1] + c], [r[0] + r[2], r[1] + r[3] - c],
          [r[0] + r[2] - c, r[1] + r[3]], [r[0] + c, r[1] + r[3]], [r[0], r[1] + r[3] - c], [r[0], r[1] + c]].map(([x, y]) => ({ x, y })));
        // Windscreen of the car, pillow end of the sleep pod.
        const q = rect(r), k = it.kind === 'car' ? 0.32 : 0.2;
        if (horizWall) b.thin.line(G.lerp(q[0], q[1], k), G.lerp(q[3], q[2], k));
        else b.thin.line(G.lerp(q[0], q[3], k), G.lerp(q[1], q[2], k));
        break;
      }
      case 'vrchair': { const c = G.centroid(rect(hug(0.7))); b.light.circle(c.x, c.y, CS * 0.3); b.thin.circle(c.x, c.y, CS * 0.15); break; }
      case 'surgery': { const r = rect(hug(0.6, 0.15)); b.light.poly(r); const c = G.centroid(r); b.thin.circle(c.x, c.y, CS * 0.35); break; }
      case 'treadmill': {
        const r = rect(hug(0.55, 0.1));
        b.light.poly(r);
        const n = it.len * 4;
        for (let i = 1; i < n; i++) {
          if (horizWall) b.thin.line(G.lerp(r[0], r[1], i / n), G.lerp(r[3], r[2], i / n));
          else b.thin.line(G.lerp(r[0], r[3], i / n), G.lerp(r[1], r[2], i / n));
        }
        break;
      }
      case 'weights': { const c = G.centroid(rect(hug(0.6))); b.dark.circle(c.x - CS * 0.15, c.y, CS * 0.12); b.dark.circle(c.x + CS * 0.15, c.y, CS * 0.12); break; }
      case 'pool': b.water.poly(rect([P(it.x + 0.2), P(it.y + 0.2), P(it.w - 0.4), P(it.h - 0.4)])); break;
      case 'dance': {
        b.rug.poly(rect([P(it.x + 0.1), P(it.y + 0.1), P(it.w - 0.2), P(it.h - 0.2)]));
        for (let x = it.x + 1; x < it.x + it.w; x++) b.thin.line({ x: P(x), y: P(it.y + 0.1) }, { x: P(x), y: P(it.y + it.h - 0.1) });
        for (let y = it.y + 1; y < it.y + it.h; y++) b.thin.line({ x: P(it.x + 0.1), y: P(y) }, { x: P(it.x + it.w - 0.1), y: P(y) });
        break;
      }
    }
  }

  function floorName(level) { return t('floor.' + Math.max(-1, Math.min(2, level))); }

  function title(m) {
    if (m.name.tavern) {
      const [ai, di] = m.name.tavern;
      const a = TAVERN.animals[ai], d = TAVERN.adjs[di];
      return I18n.lang === 'it' ? 'Locanda ' + a[0] + ' ' + d[a[1]] : 'The ' + d[2] + ' ' + a[2];
    }
    const it = I18n.lang === 'it';
    if (m.name.bar) {
      const [ki, pi] = m.name.bar;
      const k = BAR.kinds[ki], p = BAR.places[pi];
      if (!p) return it ? k[0] + ' da ' + m.name.n : m.name.n + '’s ' + k[1];
      return it ? k[0] + ' ' + p[0] : p[1] + ' ' + k[1];
    }
    if (m.name.club) {
      // Italian clubs often keep an English name.
      const [ni, ai, english] = m.name.club;
      const n = CLUB.nouns[ni], a = CLUB.adjs[ai];
      if (english) return a[2] + ' ' + n[2];
      return it ? n[0] + ' ' + a[n[1]] : 'The ' + a[2] + ' ' + n[2];
    }
    if (m.name.u) return t(m.name.key, { n: m.name.n, u: m.name.u });
    return t(m.name.key, { n: m.name.n });
  }

  function render(m, o) {
    const pal = o.palette;
    const b = m.bounds;
    const fw = (b.x1 - b.x0) * CS, fh = (b.y1 - b.y0) * CS;
    // Previews show the ground floor only, so the card stays readable.
    const shown = o.preview ? m.floors.filter((f) => f.level === 0) : m.floors;
    const n = shown.length;
    const cols = o.preview ? Math.min(2, n) : n <= 2 ? n : 2;
    const rows = Math.ceil(n / cols);
    const gap = CS * 2.4, pad = CS * 1.6, head = o.preview ? CS * 1.2 : CS * 4, lab = CS * 1.6;
    const W = pad * 2 + cols * fw + (cols - 1) * gap;
    const H = head + rows * (fh + lab) + (rows - 1) * gap * 0.6 + pad * 1.4;
    const svg = new Svg(W, H);
    svg.rect(0, 0, W, H, { fill: pal.paper });
    const foot = new Set(m.foot);
    const footCells = m.foot.map((k) => k.split(',').map(Number));
    const order = shown.slice().sort((a, c) => (a.level < 0 ? 99 : a.level) - (c.level < 0 ? 99 : c.level));

    order.forEach((fl, idx) => {
      const col = idx % cols, row = Math.floor(idx / cols);
      const ox = pad + col * (fw + gap) - b.x0 * CS, oy = head + lab + row * (fh + lab + gap * 0.6) - b.y0 * CS;
      svg.open({ transform: 'translate(' + Svg.num(ox) + ' ' + Svg.num(oy) + ')' });
      // Floors: planks for living spaces, flagstones for service rooms.
      const stone = { kitchen: 1, pantry: 1, storage: 1, cellar: 1, wine: 1, vault: 1, bath: 1, workshop: 1, chapel: 1,
        garage: 1, laundry: 1, boiler: 1, restroom: 1, pool: 1, server: 1, clinic: 1, gym: 1, coffin: 1, dancefloor: 1, checkpoint: 1 };
      const planks = new Svg.Batch(), flags = new Svg.Batch(), floorB = new Svg.Batch(), flagFill = new Svg.Batch();
      for (const r of fl.rooms) {
        const poly = G.rect((r.x + r.w / 2) * CS, (r.y + r.h / 2) * CS, r.w * CS, r.h * CS);
        const isStone = stone[r.type] || fl.level < 0;
        (isStone ? flagFill : floorB).poly(poly);
        if (isStone) {
          for (let x = r.x + 1; x < r.x + r.w; x++) flags.line({ x: x * CS, y: r.y * CS }, { x: x * CS, y: (r.y + r.h) * CS });
          for (let y = r.y + 1; y < r.y + r.h; y++) flags.line({ x: r.x * CS, y: y * CS }, { x: (r.x + r.w) * CS, y: y * CS });
        } else {
          const along = r.w >= r.h;
          const step = CS / 3;
          if (along) for (let y = r.y * CS + step; y < (r.y + r.h) * CS - 1; y += step) planks.line({ x: r.x * CS, y }, { x: (r.x + r.w) * CS, y });
          else for (let x = r.x * CS + step; x < (r.x + r.w) * CS - 1; x += step) planks.line({ x, y: r.y * CS }, { x, y: (r.y + r.h) * CS });
        }
      }
      svg.path(floorB.toString(), { fill: pal.floor });
      svg.path(flagFill.toString(), { fill: pal.paperShade });
      svg.path(planks.toString(), { stroke: pal.grid, strokeWidth: 0.7, fill: 'none' });
      svg.path(flags.toString(), { stroke: pal.grid, strokeWidth: 0.9, fill: 'none' });

      // Stairs.
      if (m.stairs.length) {
        const sb = new Svg.Batch();
        const xs = m.stairs.map(([x]) => x), ys = m.stairs.map(([, y]) => y);
        const sx0 = Math.min(...xs), sy0 = Math.min(...ys), sx1 = Math.max(...xs) + 1, sy1 = Math.max(...ys) + 1;
        const r = G.rect(((sx0 + sx1) / 2) * CS, ((sy0 + sy1) / 2) * CS, (sx1 - sx0) * CS - 4, (sy1 - sy0) * CS - 4);
        sb.poly(r);
        const steps = (sy1 - sy0) * 4;
        for (let i = 1; i < steps; i++) sb.line(G.lerp(r[0], r[3], i / steps), G.lerp(r[1], r[2], i / steps));
        svg.path(sb.toString(), { fill: pal.floor, stroke: pal.ink, strokeWidth: 0.9 });
        const top = fl.level === m.floors.reduce((mx, f) => Math.max(mx, f.level), -1);
        const bottom = fl.level === m.floors.reduce((mn, f) => Math.min(mn, f.level), 9);
        const lbl = (top ? '' : t('dwelling.up')) + (top || bottom ? '' : ' / ') + (bottom ? '' : t('dwelling.down'));
        if (lbl) Draw.label(svg, ((sx0 + sx1) / 2) * CS, sy1 * CS + 7, lbl, 8.5, pal, { italic: true, haloColor: pal.floor });
      }

      // Furniture.
      const fb = { light: new Svg.Batch(), dark: new Svg.Batch(), thin: new Svg.Batch(), stone: new Svg.Batch(), fire: new Svg.Batch(), water: new Svg.Batch(), rug: new Svg.Batch() };
      for (const it of fl.items) drawItem(it, fb, pal);
      svg.path(fb.rug.toString(), { fill: pal.accent, opacity: 0.25, stroke: pal.accent, strokeWidth: 0.8 });
      svg.path(fb.stone.toString(), { fill: pal.rock, stroke: pal.ink, strokeWidth: 0.9 });
      svg.path(fb.fire.toString(), { fill: pal.accent });
      svg.path(fb.water.toString(), { fill: pal.water, stroke: pal.ink, strokeWidth: 0.9 });
      svg.path(fb.light.toString(), { fill: pal.building, stroke: pal.ink, strokeWidth: 0.8, strokeLinejoin: 'round' });
      svg.path(fb.dark.toString(), { fill: pal.buildingSpecial, stroke: pal.ink, strokeWidth: 0.8 });
      svg.path(fb.thin.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.5 });

      // Walls: interior edges between rooms, exterior edges of the footprint.
      const at = new Map();
      for (const r of fl.rooms) for (const [x, y] of cellsOf(r)) at.set(key(x, y), r);
      const doorAt = new Set(fl.doors.map((d) => d.x + ',' + d.y + ',' + (d.vertical ? 'v' : 'h')));
      const winAt = new Set(fl.windows.map((d) => d.x + ',' + d.y + ',' + (d.vertical ? 'v' : 'h')));
      const inner = new Svg.Batch(), outer = new Svg.Batch(), wins = new Svg.Batch();
      for (const [x, y] of footCells) {
        // Edge to the right (vertical, at x+1) and below (horizontal, at y+1), plus outer edges on the other sides.
        const edges = [
          [x + 1, y, true, key(x + 1, y)], [x, y + 1, false, key(x, y + 1)],
          [x, y, true, key(x - 1, y)], [x, y, false, key(x, y - 1)],
        ];
        for (const [ex, ey, vertical, nk] of edges) {
          const out = !foot.has(nk);
          const isFwdEdge = (vertical && ex === x + 1) || (!vertical && ey === y + 1);
          if (!out && !isFwdEdge) continue;
          const id = ex + ',' + ey + ',' + (vertical ? 'v' : 'h');
          const a = { x: ex * CS, y: ey * CS }, c = vertical ? { x: ex * CS, y: (ey + 1) * CS } : { x: (ex + 1) * CS, y: ey * CS };
          if (doorAt.has(id)) {
            // Leave a doorway, with short jambs at both ends.
            const jamb = CS * 0.18;
            const dir = G.norm(G.sub(c, a));
            (out ? outer : inner).line(a, G.add(a, G.scale(dir, jamb)));
            (out ? outer : inner).line(G.sub(c, G.scale(dir, jamb)), c);
            continue;
          }
          if (out) {
            if (winAt.has(id)) {
              const dir = G.norm(G.sub(c, a));
              outer.line(a, G.add(a, G.scale(dir, CS * 0.25)));
              outer.line(G.sub(c, G.scale(dir, CS * 0.25)), c);
              const nrm = G.scale(G.perp(dir), CS * 0.09);
              wins.line(G.add(G.add(a, G.scale(dir, CS * 0.25)), nrm), G.add(G.sub(c, G.scale(dir, CS * 0.25)), nrm));
              wins.line(G.sub(G.add(a, G.scale(dir, CS * 0.25)), nrm), G.sub(G.sub(c, G.scale(dir, CS * 0.25)), nrm));
            } else outer.line(a, c);
          } else if (at.get(key(x, y)) !== at.get(nk)) inner.line(a, c);
        }
      }
      svg.path(inner.toString(), { stroke: pal.ink, strokeWidth: CS * 0.16, strokeLinecap: 'square', fill: 'none' });
      svg.path(outer.toString(), { stroke: pal.ink, strokeWidth: CS * 0.32, strokeLinecap: 'square', fill: 'none' });
      svg.path(wins.toString(), { stroke: pal.ink, strokeWidth: 0.9, fill: 'none' });

      // Door leaves with their swing.
      const leaves = new Svg.Batch(), swings = new Svg.Batch();
      for (const d of fl.doors) {
        const a = { x: d.x * CS, y: d.y * CS };
        const along = d.vertical ? { x: 0, y: 1 } : { x: 1, y: 0 };
        const hinge = G.add(a, G.scale(along, CS * 0.18));
        const span = CS * 0.64;
        // Open into the room on the inner side (below/right for interior doors, inside for exterior ones).
        let into = d.vertical ? { x: 1, y: 0 } : { x: 0, y: 1 };
        if (d.type === 'front' || d.type === 'back') {
          const probe = G.add(G.add(hinge, G.scale(along, span / 2)), G.scale(into, CS * 0.5));
          if (!foot.has(key(Math.floor(probe.x / CS), Math.floor(probe.y / CS)))) into = G.scale(into, -1);
        }
        const tip = G.add(hinge, G.scale(into, span));
        leaves.line(hinge, tip);
        const end = G.add(hinge, G.scale(along, span));
        const sweep = G.cross(along, into) > 0 ? 1 : 0;
        swings.add('M' + Svg.num(tip.x) + ' ' + Svg.num(tip.y) + 'A' + Svg.num(span) + ' ' + Svg.num(span) + ' 0 0 ' + sweep + ' ' + Svg.num(end.x) + ' ' + Svg.num(end.y));
      }
      svg.path(swings.toString(), { stroke: pal.inkSoft, strokeWidth: 0.7, fill: 'none', strokeDasharray: '2 2' });
      svg.path(leaves.toString(), { stroke: pal.ink, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round' });

      // Room names.
      if (o.labels !== false && !o.preview) {
        for (const r of fl.rooms) {
          const name = t('room.' + r.type);
          // Width of a character: the sans-serif and monospace letterings run
          // wider, and shrink a little in narrow rooms.
          const cw = pal.fontLabel ? (/mono/.test(pal.fontLabel) ? 0.6 : 0.52) : 0.48;
          const size = pal.fontLabel ? Math.max(7, Math.min(9, (r.w * CS - 4) / (Math.max(...name.split(' ').map((w) => w.length)) * cw))) : 9;
          const fits = name.length * size * cw < r.w * CS - 6;
          const lines = fits ? [name] : Draw.wrap(name, Math.max(4, Math.floor((r.w * CS - 4) / (size * cw))));
          const cx = (r.x + r.w / 2) * CS, cy = (r.y + r.h / 2) * CS - ((lines.length - 1) * size) / 2;
          lines.forEach((ln, i) => Draw.label(svg, cx, cy + i * size * 1.05, ln, size, pal, { italic: true, haloColor: pal.floor, haloWidth: 0.35 }));
        }
      }
      svg.close();
      if (!o.preview) Draw.label(svg, pad + col * (fw + gap) + fw / 2, head + row * (fh + lab + gap * 0.6) + lab * 0.45, floorName(fl.level), 13, pal, { title: true });
    });

    if (!o.preview) {
      const name = title(m);
      // Long company names would overflow narrow plans.
      Draw.title(svg, W / 2, CS * 1.7, name, pal.fontTitle ? Math.min(24, (W - pad) / (name.length * 0.62)) : 24, pal);
      Draw.label(svg, W - pad, H - pad * 0.5, t('dwelling.scale'), 9.5, pal, { italic: true, anchor: 'end' });
    }
    return svg.toString();
  }

  // ------------------------------------------------------------- 3D model

  // Floors stacked 3 m apart, walls with door and window openings, stairs,
  // furniture and a gabled roof. 1 square = 1.5 m.
  const MAT3D = {
    stone: { name: 'Pietra', color: '#9a9184' },
    boards: { name: 'Assi', color: '#8a6440' },
    plaster: { name: 'Intonaco', color: '#ddd2bc' },
    inner: { name: 'Pareti interne', color: '#e8dfcc' },
    cellarWall: { name: 'Muri di cantina', color: '#7d766b', roughness: 0.95 },
    wood: { name: 'Legno', color: '#6e4a2c' },
    door: { name: 'Porte', color: '#5a3a22' },
    glass: { name: 'Vetro', color: '#9cc3d5', alpha: 0.35, roughness: 0.05 },
    cloth: { name: 'Stoffa', color: '#b8a98a' },
    rug: { name: 'Tappeti', color: '#8e3b2e' },
    iron: { name: 'Ferro', color: '#3a3a40', metallic: 0.7, roughness: 0.45 },
    water: { name: 'Acqua', color: '#5b8fa8', alpha: 0.7, roughness: 0.1 },
    roof: { name: 'Tetto', color: '#7b3f2c', doubleSided: true },
    grass: { name: 'Prato', color: '#7f9a5c', roughness: 1 },
  };
  // Present day: plaster and concrete, tiles, parquet, steel and appliances.
  const MAT3D_MODERN = Object.assign({}, MAT3D, {
    stone: { name: 'Piastrelle', color: '#c9c5bd', roughness: 0.4 },
    boards: { name: 'Parquet', color: '#a8835a', roughness: 0.6 },
    plaster: { name: 'Intonaco', color: '#ece5d8' },
    inner: { name: 'Pareti interne', color: '#f3f0ea' },
    cellarWall: { name: 'Calcestruzzo', color: '#a3a19b', roughness: 0.95 },
    wood: { name: 'Legno chiaro', color: '#a07c58' },
    door: { name: 'Porte', color: '#6d5c4c' },
    cloth: { name: 'Tessuti', color: '#7d8894' },
    rug: { name: 'Tappeti', color: '#5d6f86' },
    concrete: { name: 'Calcestruzzo', color: '#b4b1aa', roughness: 0.9 },
    metal: { name: 'Acciaio', color: '#b9bec4', metallic: 0.8, roughness: 0.35 },
    ceramic: { name: 'Ceramica', color: '#f4f4f1', roughness: 0.2 },
    screen: { name: 'Schermi', color: '#16181c', roughness: 0.15 },
    car: { name: 'Carrozzeria', color: '#2f5d8a', metallic: 0.6, roughness: 0.3 },
    flat: { name: 'Copertura piana', color: '#8d8f91', roughness: 0.95 },
  });
  // Cyberpunk: raw concrete, metal grating, tinted glass, neon and screens.
  const MAT3D_CYBER = Object.assign({}, MAT3D_MODERN, {
    stone: { name: 'Grigliato metallico', color: '#4a4f5a', metallic: 0.5, roughness: 0.5 },
    boards: { name: 'Resina', color: '#2b2f3a', roughness: 0.3 },
    plaster: { name: 'Calcestruzzo', color: '#5d6370', roughness: 0.9 },
    inner: { name: 'Pannelli', color: '#3e4452' },
    cellarWall: { name: 'Calcestruzzo armato', color: '#3a3d45', roughness: 0.95 },
    wood: { name: 'Polimero', color: '#3b3f4a', roughness: 0.4 },
    door: { name: 'Porte blindate', color: '#2a2d33', metallic: 0.7, roughness: 0.4 },
    glass: { name: 'Vetro oscurato', color: '#3fb8d0', alpha: 0.35, roughness: 0.05 },
    cloth: { name: 'Similpelle', color: '#5a2d6e', roughness: 0.5 },
    rug: { name: 'Neon', color: '#ff3fa4', roughness: 0.3 },
    concrete: { name: 'Grigliato', color: '#4a4f5a', metallic: 0.5, roughness: 0.5 },
    metal: { name: 'Metallo', color: '#7a8494', metallic: 0.8, roughness: 0.35 },
    ceramic: { name: 'Plastica medica', color: '#d8e4ea', roughness: 0.25 },
    screen: { name: 'Schermi', color: '#3ff0ff', roughness: 0.1 },
    car: { name: 'Carrozzeria', color: '#1d1f26', metallic: 0.7, roughness: 0.25 },
    flat: { name: 'Copertura', color: '#2b2e35', roughness: 0.9 },
    grass: { name: 'Asfalto', color: '#2a2a2e', roughness: 1 },
  });

  function model3d(m) {
    const C = 1.5, FH = 3, SLAB = 0.2, TE = 0.25, TI = 0.12, DOORH = 2.1, SILL = 0.9, WTOP = 2.1;
    const M = Carto.Mesh3D.Mesh;
    const b = m.bounds;
    const ox = -((b.x0 + b.x1) / 2) * C, os = -((b.y0 + b.y1) / 2) * C;
    const X = (v) => v * C + ox, S = (v) => v * C + os;
    const levels = m.floors.map((f) => f.level);
    const top = Math.max(...levels);
    const eave = top * FH + FH - SLAB;
    const stairKeys = new Set(m.stairs.map(([x, y]) => key(x, y)));
    const groups = [];
    const setting = Carto.Setting.current;
    const mats = setting === 'cyber' ? MAT3D_CYBER : setting === 'modern' ? MAT3D_MODERN : MAT3D;

    for (const fl of m.floors) {
      const z = fl.level * FH, wallTop = z + FH - SLAB;
      const parts = [];
      const mesh = (name, material) => { const me = new M(); parts.push({ name, mesh: me, material }); return me; };
      const slab = mesh(t('dwelling.3d.floor'), fl.level <= 0 ? 'stone' : 'boards');
      const outer = mesh(t('dwelling.3d.outer'), fl.level < 0 ? 'cellarWall' : 'plaster');
      const inner = mesh(t('dwelling.3d.inner'), fl.level < 0 ? 'cellarWall' : 'inner');
      const glass = mesh(t('dwelling.3d.windows'), 'glass');
      const leaves = mesh(t('dwelling.3d.doors'), 'door');
      const steps = mesh(t('dwelling.3d.stairs'), setting === 'fantasy' ? 'wood' : 'concrete');
      const by = {};
      const furn = (mat) => by[mat] || (by[mat] = mesh(t('dwelling.3d.furniture') + ' · ' + mats[mat].name, mat));

      // Floor, with a hole where the stairs come up from below.
      const hole = levels.includes(fl.level - 1) ? stairKeys : new Set();
      for (const r of fl.rooms) {
        const cells = cellsOf(r);
        if (!cells.some(([x, y]) => hole.has(key(x, y)))) slab.box(X(r.x), S(r.y), X(r.x + r.w), S(r.y + r.h), z - SLAB, z);
        else for (const [x, y] of cells) if (!hole.has(key(x, y))) slab.box(X(x), S(y), X(x + 1), S(y + 1), z - SLAB, z);
      }

      // Walls on every edge between two rooms or facing outside. Each edge
      // stops short of the corner posts, so no two solids overlap (overlaps
      // render as dark stripes). Outer walls also cover the next floor's slab.
      const at = new Map();
      for (const r of fl.rooms) for (const [x, y] of cellsOf(r)) at.set(key(x, y), r);
      const edgeKey = (vertical, x, y) => (vertical ? 'v' : 'h') + x + ',' + y;
      const doorAt = new Map(fl.doors.map((d) => [edgeKey(d.vertical, d.x, d.y), d]));
      const windowAt = new Set(fl.windows.map((w) => edgeKey(w.vertical, w.x, w.y)));
      const outerTop = fl.level === top ? wallTop : z + FH;
      const edges = new Map();
      for (const r of fl.rooms) {
        for (const [x, y] of cellsOf(r)) {
          for (const [dx, dy, vertical, ex, ey] of [[0, -1, false, x, y], [0, 1, false, x, y + 1], [-1, 0, true, x, y], [1, 0, true, x + 1, y]]) {
            const other = at.get(key(x + dx, y + dy));
            if (other === r) continue;
            const ek = edgeKey(vertical, ex, ey);
            if (!edges.has(ek)) edges.set(ek, { vertical, ex, ey, ext: !other });
          }
        }
      }
      const posts = new Map();
      const post = (x, y, e) => {
        const pk = key(x, y), p = posts.get(pk) || { x, y, th: 0, top: wallTop, ext: false };
        p.th = Math.max(p.th, e.ext ? TE : TI);
        if (e.ext) { p.ext = true; p.top = outerTop; }
        posts.set(pk, p);
      };
      for (const e of edges.values()) {
        post(e.ex, e.ey, e);
        post(e.vertical ? e.ex : e.ex + 1, e.vertical ? e.ey + 1 : e.ey, e);
      }
      for (const p of posts.values()) (p.ext ? outer : inner).box(X(p.x) - p.th / 2, S(p.y) - p.th / 2, X(p.x) + p.th / 2, S(p.y) + p.th / 2, z, p.top);
      for (const [ek, e] of edges) {
        const { vertical, ex, ey, ext } = e;
        const th = ext ? TE : TI, me = ext ? outer : inner, h1 = ext ? outerTop : wallTop;
        const p0 = posts.get(key(ex, ey)).th / 2, p1 = posts.get(vertical ? key(ex, ey + 1) : key(ex + 1, ey)).th / 2;
        const piece = (h0, hTop, thick = th, inset = 0, target = me) => {
          if (vertical) target.box(X(ex) - thick / 2, S(ey) + p0 + inset, X(ex) + thick / 2, S(ey + 1) - p1 - inset, h0, hTop);
          else target.box(X(ex) + p0 + inset, S(ey) - thick / 2, X(ex + 1) - p1 - inset, S(ey) + thick / 2, h0, hTop);
        };
        const door = doorAt.get(ek);
        if (door) {
          piece(z + DOORH, h1);
          if (door.type === 'front' || door.type === 'back') piece(z, z + DOORH - 0.03, 0.07, 0.04, leaves);
        } else if (windowAt.has(ek) && fl.level >= 0) {
          piece(z, z + SILL);
          piece(z + WTOP, h1);
          piece(z + SILL, z + WTOP, 0.03, 0, glass);
        } else piece(z, h1);
      }

      // Stairs up to the next floor, climbing towards the back of the hall.
      if (levels.includes(fl.level + 1) && m.stairs.length) {
        const cells = m.stairs.slice().sort((p, q) => p[1] - q[1]);
        const sx = cells[0][0], y0 = cells[0][1], y1 = cells[cells.length - 1][1] + 1;
        const n = 7 * cells.length, run = ((y1 - y0) * C) / n;
        for (let i = 0; i < n; i++) {
          const s1 = S(y1) - i * run;
          steps.box(X(sx) + 0.12, s1 - run, X(sx + 1) - 0.12, s1, z, z + ((i + 1) * FH) / n);
        }
      }

      // Furniture.
      for (const it of fl.items) {
        const horizWall = it.side === 'n' || it.side === 's';
        const hug = (d, inset = 0.12) => {
          const len = (it.len || 1) - inset * 2;
          if (horizWall) return [it.x + inset, it.side === 'n' ? it.y + inset : it.y + 1 - inset - d, len, d];
          return [it.side === 'w' ? it.x + inset : it.x + 1 - inset - d, it.y + inset, d, len];
        };
        const put = (mat, r, h0, h1) => furn(mat).box(X(r[0]), S(r[1]), X(r[0] + r[2]), S(r[1] + r[3]), z + h0, z + h1);
        const shrink = (r, k) => [r[0] + k, r[1] + k, r[2] - 2 * k, r[3] - 2 * k];
        const round = (mat, r, rad, h) => furn(mat).cylinder(X(r[0] + r[2] / 2), S(r[1] + r[3] / 2), rad * C, z, z + h, 14);
        switch (it.kind) {
          case 'bed': { const r = hug(0.85); put('wood', r, 0, 0.32); put('cloth', shrink(r, 0.04), 0.32, 0.52); break; }
          case 'chest': put('wood', hug(0.45), 0, 0.5); break;
          case 'wardrobe': put('wood', hug(0.5), 0, 2.0); break;
          case 'cabinet': put('wood', hug(0.5), 0, 1.2); break;
          case 'hearth': { const r = hug(0.45, 0.05); put('stone', r, 0, 1.3); break; }
          case 'barrel': round('wood', hug(0.7), 0.32, 0.95); break;
          case 'crate': put('wood', hug(0.65), 0, 0.6); break;
          case 'sack': round('cloth', hug(0.6), 0.25, 0.5); break;
          case 'rack': put('wood', hug(0.4), 0, 1.8); break;
          case 'counter': case 'bar': put('wood', hug(0.55), 0, 1.05); break;
          case 'bench': put('wood', hug(0.55), 0, 0.85); break;
          case 'shelf': put('wood', hug(0.35), 0, 2.0); break;
          case 'altar': put('stone', hug(0.55), 0, 1.0); break;
          case 'anvil': put('iron', shrink(hug(0.4), 0.15), 0, 0.8); break;
          case 'desk': put('wood', hug(0.6), 0, 0.76); break;
          case 'chair': put('wood', hug(0.45, 0.28), 0, 0.46); break;
          case 'tub': { const r = hug(0.75); put('wood', r, 0, 0.6); furn('water').box(X(r[0] + 0.05), S(r[1] + 0.05), X(r[0] + r[2] - 0.05), S(r[1] + r[3] - 0.05), z + 0.6, z + 0.61); break; }
          case 'table': case 'longtable': put('wood', [it.x + 0.15, it.y + 0.2, it.w - 0.3, it.h - 0.4], 0, 0.76); break;
          case 'roundtable': furn('wood').cylinder(X(it.x + 0.5), S(it.y + 0.5), 0.3 * C, z, z + 0.76, 16); break;
          case 'rug': put('rug', [it.x + 0.15, it.y + 0.15, it.w - 0.3, it.h - 0.3], 0, 0.015); break;
          case 'pews': for (let y = it.y; y < it.y + it.h; y++) put('wood', [it.x + 0.2, y + 0.3, it.w - 0.4, 0.35], 0, 0.45); break;
          case 'stove': put('metal', hug(0.6), 0, 0.9); break;
          case 'fridge': put('metal', hug(0.65), 0, 1.85); break;
          case 'server': put('metal', hug(0.55), 0, 2.0); break;
          case 'dj': put('metal', hug(0.55), 0, 1.05); break;
          case 'sofa': put('cloth', hug(0.8, 0.1), 0, 0.42); put('cloth', hug(0.25, 0.1), 0.42, 0.85); break;
          case 'tv': put('screen', hug(0.12, 0.15), 0.9, 1.6); break;
          case 'toilet': round('ceramic', hug(0.75, 0.25), 0.2, 0.42); put('ceramic', hug(0.22, 0.25), 0, 0.8); break;
          case 'sink': put('ceramic', hug(0.4, 0.2), 0.75, 0.88); break;
          case 'shower': put('ceramic', hug(0.85, 0.08), 0, 0.06); break;
          case 'washer': put('ceramic', hug(0.7, 0.15), 0, 0.85); break;
          case 'tank': round('metal', hug(0.7), 0.32, 1.6); break;
          case 'car': { const r = hug(0.9, 0.08); put('car', r, 0.15, 0.8); put('glass', shrink(r, 0.12), 0.8, 1.35); break; }
          case 'pod': put('metal', hug(0.75, 0.08), 0, 1.0); break;
          case 'vrchair': round('cloth', hug(0.7), 0.3, 0.5); break;
          case 'surgery': put('metal', hug(0.6, 0.15), 0, 0.9); break;
          case 'treadmill': put('metal', hug(0.55, 0.1), 0, 0.25); break;
          case 'weights': round('iron', hug(0.6), 0.15, 0.4); break;
          case 'pool': put('water', [it.x + 0.2, it.y + 0.2, it.w - 0.4, it.h - 0.4], 0, 0.03); break;
          case 'dance': put('rug', [it.x + 0.1, it.y + 0.1, it.w - 0.2, it.h - 0.2], 0, 0.02); break;
        }
      }
      groups.push({ name: floorName(fl.level), parts });
    }

    // Gabled roof over each block of the building; flat roofs with a parapet
    // on apartment blocks today and on every cyberpunk building.
    const roof = new M();
    const pitch = Math.tan((38 * Math.PI) / 180), over = 0.45;
    const flat = setting === 'cyber' || (setting === 'modern' && m.type === 'townhouse');
    if (flat) {
      const foot = new Set(m.foot);
      const cells = m.foot.map((k) => k.split(',').map(Number));
      // Slab row by row inside the walls, parapet on the outer walls with
      // posts at the corners (so no two solids share a face).
      for (const [x, y] of cells) if (!foot.has(key(x - 1, y))) {
        let x1 = x;
        while (foot.has(key(x1 + 1, y))) x1++;
        roof.box(X(x), S(y), X(x1 + 1), S(y + 1), eave, eave + SLAB);
      }
      const PAR = 0.9;
      const corners = new Set();
      for (const r of Carto.Mesh3D.boundaryRuns((x, y) => foot.has(key(x, y)), cells)) {
        if (r.ns) roof.box(X(r.x0) + TE / 2, S(r.s0) - TE / 2, X(r.x1) - TE / 2, S(r.s0) + TE / 2, eave, eave + PAR);
        else roof.box(X(r.x0) - TE / 2, S(r.s0) + TE / 2, X(r.x0) + TE / 2, S(r.s1) - TE / 2, eave, eave + PAR);
        corners.add(key(r.x0, r.s0)); corners.add(key(r.x1, r.s1));
      }
      for (const c of corners) { const [x, y] = c.split(',').map(Number); roof.box(X(x) - TE / 2, S(y) - TE / 2, X(x) + TE / 2, S(y) + TE / 2, eave, eave + PAR); }
      // Rooftop plant over the main block: air conditioning, or a cyberpunk antenna mast.
      const bl = m.blocks[0], cx = X(bl.x + bl.w / 2), cs = S(bl.y + bl.h / 2);
      const plant = new M().box(cx - 0.9, cs - 0.6, cx + 0.9, cs + 0.6, eave + SLAB, eave + SLAB + 1.1);
      if (setting === 'cyber') plant.cylinder(cx + 2, cs, 0.08, eave + SLAB, eave + SLAB + 4.5, 8);
      groups.push({ name: t('dwelling.3d.roof'), parts: [{ name: t('dwelling.3d.roof'), mesh: roof, material: 'flat' }, { name: t('dwelling.3d.furniture'), mesh: plant, material: 'metal' }] });
    }
    for (const bl of flat ? [] : m.blocks) {
      const x0 = X(bl.x) - TE / 2, x1 = X(bl.x + bl.w) + TE / 2, s0 = S(bl.y) - TE / 2, s1 = S(bl.y + bl.h) + TE / 2;
      if (bl.w >= bl.h) {
        const mid = (s0 + s1) / 2, ridge = eave + ((s1 - s0) / 2) * pitch, low = eave - over * pitch;
        roof.quad([x0 - over, s0 - over, low], [x1 + over, s0 - over, low], [x1 + over, mid, ridge], [x0 - over, mid, ridge]);
        roof.quad([x0 - over, s1 + over, low], [x1 + over, s1 + over, low], [x1 + over, mid, ridge], [x0 - over, mid, ridge]);
        roof.tri([x0, s0, eave], [x0, s1, eave], [x0, mid, ridge], [-1, 0]);
        roof.tri([x1, s0, eave], [x1, s1, eave], [x1, mid, ridge], [1, 0]);
      } else {
        const mid = (x0 + x1) / 2, ridge = eave + ((x1 - x0) / 2) * pitch, low = eave - over * pitch;
        roof.quad([x0 - over, s0 - over, low], [x0 - over, s1 + over, low], [mid, s1 + over, ridge], [mid, s0 - over, ridge]);
        roof.quad([x1 + over, s0 - over, low], [x1 + over, s1 + over, low], [mid, s1 + over, ridge], [mid, s0 - over, ridge]);
        roof.tri([x0, s0, eave], [x1, s0, eave], [mid, s0, ridge], [0, -1]);
        roof.tri([x0, s1, eave], [x1, s1, eave], [mid, s1, ridge], [0, 1]);
      }
    }
    if (!flat) groups.push({ name: t('dwelling.3d.roof'), parts: [{ name: t('dwelling.3d.roof'), mesh: roof, material: 'roof' }] });
    const ground = new M().prism([[X(b.x0) - 5, S(b.y0) - 5], [X(b.x1) + 5, S(b.y0) - 5], [X(b.x1) + 5, S(b.y1) + 5], [X(b.x0) - 5, S(b.y1) + 5]], -0.25, -0.1, { sides: false });
    groups.push({ name: t('dwelling.3d.ground'), parts: [{ name: t('dwelling.3d.ground'), mesh: ground, material: 'grass' }] });
    return { name: title(m), groups, materials: mats };
  }

  function notes(m) {
    const esc = Svg.esc;
    let h = '<h3>' + esc(title(m)) + '</h3><dl><dt>' + esc(t('dwelling.floors')) + '</dt><dd>' + m.floors.length + '</dd></dl>';
    const order = m.floors.slice().sort((a, c) => (a.level < 0 ? 99 : a.level) - (c.level < 0 ? 99 : c.level));
    for (const f of order) {
      const counts = {};
      for (const r of f.rooms) counts[r.type] = (counts[r.type] || 0) + 1;
      h += '<p class="tag">' + esc(floorName(f.level)) + '</p><ul>' +
        Object.entries(counts).map(([k, c]) => '<li>' + esc(t('room.' + k)) + (c > 1 ? ' <span class="tag">×' + c + '</span>' : '') + '</li>').join('') + '</ul>';
    }
    return h;
  }

  Carto.register({
    id: 'dwelling',
    order: 6,
    model3d,
    options: [
      { id: 'type', type: 'select', values: ['auto', 'cottage', 'townhouse', 'tavern', 'shop', 'manor'], def: 'auto' },
      { id: 'cellar', type: 'bool', def: true },
      { id: 'furniture', type: 'bool', def: true },
      { id: 'labels', type: 'bool', def: true, renderOnly: true },
    ],
    previewOptions: { type: 'tavern' },
    generate,
    render,
    notes,
    fileName: (m) => title(m),
  });

  Carto.Dwelling = { generate, render };
})(window.Carto = window.Carto || {});
