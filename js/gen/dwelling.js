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
      // Present-day and cyberpunk plans: cores, services and outdoors.
      'room.stair': 'Scala',
      'room.lift': 'Ascensore',
      'room.shaft': 'Cavedio',
      'room.shaft@cyber': 'Condotto tecnico',
      'room.corridor': 'Disimpegno',
      'room.corridor@cyber': 'Corridoio',
      'room.bike': 'Locale bici',
      'room.bins': 'Locale rifiuti',
      'room.parking': 'Autorimessa',
      'room.parking@cyber': 'Parcheggio interrato',
      'room.wc': 'WC',
      'room.tavern': 'Taverna',
      'room.waiting': 'Sala d’attesa',
      'room.recovery': 'Recupero',
      'room.implants': 'Deposito innesti',
      'room.unit': 'Unità',
      'room.wetpod': 'Cella doccia',
      'room.showers': 'Docce',
      'room.lockers': 'Armadietti',
      'room.cloak': 'Guardaroba',
      'room.backroom': 'Retro',
      'room.reception': 'Reception',
      'room.restaurant@cyber': 'Noodle bar',
      'floor.3': 'Terzo piano',
      'floor.4': 'Quarto piano',
      'floor.5': 'Quinto piano',
      'floor.6': 'Sesto piano',
      'floor.3@cyber': 'Livello 3',
      'floor.4@cyber': 'Livello 4',
      'floor.5@cyber': 'Livello 5',
      'floor.6@cyber': 'Livello 6',
      'dwelling.typical': 'Piano tipo (dal {a}° al {b}°)',
      'dwelling.typical@cyber': 'Livelli {a}–{b} (tipo)',
      'dwelling.level': 'Livello {n}',
      'dwelling.area': 'Superficie',
      'dwelling.flats': 'Appartamenti per piano',
      'dwelling.flats@cyber': 'Unità per livello',
      'dwelling.3d.lift': 'Ascensore',
      'dwelling.out.street': 'Strada',
      'dwelling.out.garden': 'Giardino',
      'dwelling.out.terrace': 'Terrazza',
      'dwelling.out.pool': 'Piscina',
      'dwelling.out.pad': 'Piattaforma di atterraggio',
      'dwelling.out.hallway': 'Corridoio del blocco',
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
      'room.stair': 'Stairs',
      'room.lift': 'Lift',
      'room.shaft': 'Service shaft',
      'room.shaft@cyber': 'Service duct',
      'room.corridor': 'Corridor',
      'room.bike': 'Bike store',
      'room.bins': 'Bin store',
      'room.parking': 'Car park',
      'room.parking@cyber': 'Parking deck',
      'room.wc': 'WC',
      'room.tavern': 'Rec room',
      'room.waiting': 'Waiting room',
      'room.recovery': 'Recovery',
      'room.implants': 'Implant store',
      'room.unit': 'Unit',
      'room.wetpod': 'Shower pod',
      'room.showers': 'Showers',
      'room.lockers': 'Lockers',
      'room.cloak': 'Cloakroom',
      'room.backroom': 'Back room',
      'room.reception': 'Reception',
      'room.restaurant@cyber': 'Noodle bar',
      'floor.3': 'Third floor',
      'floor.4': 'Fourth floor',
      'floor.5': 'Fifth floor',
      'floor.6': 'Sixth floor',
      'floor.3@cyber': 'Level 3',
      'floor.4@cyber': 'Level 4',
      'floor.5@cyber': 'Level 5',
      'floor.6@cyber': 'Level 6',
      'dwelling.typical': 'Typical floor ({a}–{b})',
      'dwelling.typical@cyber': 'Levels {a}–{b} (typical)',
      'dwelling.level': 'Level {n}',
      'dwelling.area': 'Floor area',
      'dwelling.flats': 'Flats per floor',
      'dwelling.flats@cyber': 'Units per level',
      'dwelling.3d.lift': 'Lift',
      'dwelling.out.street': 'Street',
      'dwelling.out.garden': 'Garden',
      'dwelling.out.terrace': 'Terrace',
      'dwelling.out.pool': 'Pool',
      'dwelling.out.pad': 'Landing pad',
      'dwelling.out.hallway': 'Block corridor',
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
    if (Carto.Setting.current !== 'fantasy') return generateAlt(seed, opts, type);
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
    if (m.alt) return renderAlt(m, o);
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
    linen: { name: 'Biancheria', color: '#efebe3' },
    leaf: { name: 'Fogliame', color: '#5f8a4a', roughness: 0.9 },
    paving: { name: 'Pavimentazione esterna', color: '#c4beb2', roughness: 0.9 },
    asphalt: { name: 'Asfalto', color: '#4a4b4f', roughness: 1 },
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
    linen: { name: 'Tessuto tecnico', color: '#c9d2e0' },
    leaf: { name: 'Piante idroponiche', color: '#2f8f6a', roughness: 0.8 },
    paving: { name: 'Lastre composite', color: '#3d424e', roughness: 0.8 },
    asphalt: { name: 'Asfalto', color: '#1e1f24', roughness: 1 },
  });

  function model3d(m) {
    if (m.alt) return model3dAlt(m);
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

  // =====================================================================
  // Present day and cyberpunk. Real floor plans on a half-metre grid: stair
  // and lift cores with their landing, flats around them, open-plan living,
  // shops, bars, clubs and clinics. Drawn as an architect would: solid walls
  // of real thickness, doors with their swing, windows set in the wall, room
  // names with the floor area, and furniture to scale.

  const U = 0.5, PXU = 8, PXM = PXU / U;
  // Wall thickness (m): outer walls, walls of cores and between flats, partitions.
  const TH = { ext: 0.3, party: 0.24, int: 0.12, open: 0 };
  const CIRC = { hall: 1, corridor: 1, landing: 1, lobby: 1, checkpoint: 1 };
  const THICK = { stair: 1, lift: 1, shaft: 1, landing: 1, lobby: 1, vault: 1 };
  // Rooms without windows, rooms nobody walks through, tiled and bare floors.
  const DARK = { lift: 1, shaft: 1, storage: 1, closet: 1, cellar: 1, wine: 1, vault: 1, server: 1, boiler: 1, cinema: 1, coffin: 1, pantry: 1,
    lockers: 1, implants: 1, bins: 1, parking: 1, wetpod: 1, garage: 1, dancefloor: 1, vip: 1, cloak: 1, security: 1, recovery: 1, bike: 1 };
  const DEAD = { bath: 1, wc: 1, restroom: 1, wetpod: 1, closet: 1, vault: 1, server: 1, lift: 1, shaft: 1, stair: 1, showers: 1, lockers: 1, boiler: 1, pantry: 1 };
  const TILES = { bath: 1, wc: 1, restroom: 1, wetpod: 1, showers: 1, laundry: 1, kitchen: 1, clinic: 1, recovery: 1, lockers: 1 };
  const BARE = { garage: 1, parking: 1, boiler: 1, storage: 1, cellar: 1, wine: 1, bins: 1, bike: 1, shaft: 1, server: 1, implants: 1, backroom: 1 };
  // Window width (plan units) by room; 3 (1.5 m) otherwise.
  const WIN = { bath: 2, wc: 2, restroom: 2, showers: 2, stair: 2, corridor: 2, hall: 2, landing: 2, laundry: 2, wetpod: 2, living: 4, dining: 4, restaurant: 4, taproom: 4, gym: 4 };
  const HINGED = { door: 1, flat: 1, front: 1, back: 1, double: 1 };
  const hit = (a, b) => a.x0 < b.x1 - 1e-6 && b.x0 < a.x1 - 1e-6 && a.y0 < b.y1 - 1e-6 && b.y0 < a.y1 - 1e-6;
  const box = (x, y, w, h) => ({ x0: x, y0: y, x1: x + w, y1: y + h });

  // Furniture to scale, seen from the wall it stands against: w along the
  // wall, d into the room (metres). Parts: boxes [u0, v0, u1, v1, h0, h1,
  // material] and cylinders ['c', u, v, r, h0, h1, material]; 'l' lines, 'o'
  // circles and 'r' rectangles only show on the plan.
  const sofaParts = (w, d) => [[0, 0.22, w, d, 0, 0.42, 'cloth'], [0, 0, w, 0.22, 0, 0.82, 'cloth'], [0, 0.22, 0.2, d, 0.42, 0.62, 'cloth'], [w - 0.2, 0.22, w, d, 0.42, 0.62, 'cloth']];
  const lines = (w, d, n, across) => {
    const out = [];
    for (let i = 1; i < n; i++) out.push(across ? ['l', (w * i) / n, 0.04, (w * i) / n, d - 0.04] : ['l', 0.04, (d * i) / n, w - 0.04, (d * i) / n]);
    return out;
  };
  function tableParts(n) {
    return (w, d) => {
      const k = n / 2, out = [[0.3, 0.42, w - 0.3, d - 0.42, 0, 0.76, 'wood']];
      for (let i = 0; i < k; i++) {
        const u = 0.3 + ((w - 0.6) * (i + 0.5)) / k;
        out.push([u - 0.21, 0, u + 0.21, 0.38, 0, 0.46, 'wood'], [u - 0.21, d - 0.38, u + 0.21, d, 0, 0.46, 'wood']);
      }
      return out;
    };
  }
  const KIT = {
    bed2: [2.6, 2.05, (w, d) => {
      const s = (w - 1.6) / 2;
      return [[s, 0, w - s, d, 0, 0.45, 'cloth'], [s, 0, w - s, 0.07, 0, 0.95, 'wood'], [s + 0.12, 0.15, w / 2 - 0.05, 0.5, 0.45, 0.56, 'linen'],
        [w / 2 + 0.05, 0.15, w - s - 0.12, 0.5, 0.45, 0.56, 'linen'], ['l', s, d * 0.62, w - s, d * 0.62],
        [0.05, 0, s - 0.05, 0.42, 0, 0.5, 'wood'], [w - s + 0.05, 0, w - 0.05, 0.42, 0, 0.5, 'wood']];
    }],
    bed1: [0.95, 2.0, (w, d) => [[0, 0, w, d, 0, 0.45, 'cloth'], [0, 0, w, 0.07, 0, 0.85, 'wood'], [0.12, 0.15, w - 0.12, 0.5, 0.45, 0.56, 'linen'], ['l', 0, d * 0.62, w, d * 0.62]]],
    wardrobe: [1.8, 0.6, (w, d) => [[0, 0, w, d, 0, 2.2, 'wood'], ['l', 0.06, d * 0.55, w - 0.06, d * 0.55], ...lines(w, d, Math.max(2, Math.round(w / 0.6)), true).map((l) => ['l', l[1], d * 0.55, l[3], d - 0.04])]],
    sofa: [2.2, 0.9, sofaParts],
    armchair: [0.85, 0.85, sofaParts],
    tvunit: [1.8, 0.45, (w, d) => [[0, 0, w, d, 0, 0.45, 'wood'], [0.25, 0.12, w - 0.25, 0.2, 0.45, 1.2, 'screen']]],
    coffee: [1.1, 0.6, (w, d) => [[0, 0, w, d, 0, 0.4, 'wood']]],
    table4: [1.8, 1.7, tableParts(4)],
    table6: [2.6, 1.7, tableParts(6)],
    table8: [3.4, 1.8, tableParts(8)],
    round4: [1.5, 1.5, (w, d) => [['c', w / 2, d / 2, 0.4, 0, 0.75, 'wood'], ...[0, 1, 2, 3].map((i) => {
      const a = Math.PI / 4 + (i * Math.PI) / 2;
      return ['c', w / 2 + Math.cos(a) * 0.52, d / 2 + Math.sin(a) * 0.52, 0.19, 0, 0.46, 'cloth'];
    })]],
    bistro: [1.3, 0.7, (w, d) => [['c', w / 2, d / 2, 0.3, 0, 0.75, 'wood'], ['c', 0.2, d / 2, 0.18, 0, 0.46, 'cloth'], ['c', w - 0.2, d / 2, 0.18, 0, 0.46, 'cloth']]],
    desk: [1.4, 1.25, (w, d) => [[0, 0, w, 0.7, 0, 0.75, 'wood'], [w * 0.3, 0.08, w * 0.7, 0.14, 0.75, 1.15, 'screen'], ['c', w / 2, 0.98, 0.24, 0, 0.5, 'cloth']]],
    shelf: [1.6, 0.35, (w, d) => [[0, 0, w, d, 0, 2.0, 'wood'], ...lines(w, d, Math.max(2, Math.round(w / 0.4)), true)]],
    cabinet: [1.0, 0.45, (w, d) => [[0, 0, w, d, 0, 1.1, 'wood'], ['l', w / 2, 0.04, w / 2, d - 0.04]]],
    kitchen: [3.0, 0.62, (w, d) => {
      const out = [[0, 0, w, d, 0, 0.9, 'wood']];
      const fr = w >= 2.4;
      if (fr) out.push([w - 0.68, 0, w, 0.66, 0, 1.95, 'metal'], ['l', w - 0.68, 0.33, w, 0.33]);
      const top = fr ? w - 0.7 : w;
      // Sink near one end, hob in the middle.
      out.push(['r', 0.15, 0.1, 0.75, 0.5], ['o', 0.45, 0.3, 0.12]);
      const hu = Math.min(top - 0.35, Math.max(1.2, top * 0.62));
      for (const [a, b] of [[-0.15, 0.17], [0.15, 0.17], [-0.15, 0.43], [0.15, 0.43]]) out.push(['o', hu + a, b, 0.09]);
      return out;
    }],
    island: [2.2, 1.0, (w, d) => [[0, 0, w, d, 0, 0.92, 'wood'], ['c', 0.4, d + 0.3, 0.18, 0, 0.75, 'metal'], ['c', w / 2, d + 0.3, 0.18, 0, 0.75, 'metal'], ['c', w - 0.4, d + 0.3, 0.18, 0, 0.75, 'metal']]],
    steel: [2.4, 0.9, (w, d) => [[0, 0, w, d, 0, 0.9, 'metal'], ...[0.3, 0.7].map((v) => ['o', w * 0.3, d * v, 0.12]), ['r', w * 0.6, 0.15, w - 0.15, d - 0.15]]],
    wc: [0.5, 0.72, (w, d) => [[0.07, 0, w - 0.07, 0.18, 0, 0.8, 'ceramic'], ['c', w / 2, 0.45, 0.2, 0, 0.42, 'ceramic']]],
    basin: [0.6, 0.48, (w, d) => [[0, 0, w, d, 0.78, 0.88, 'ceramic'], ['o', w / 2, d / 2 + 0.02, 0.15]]],
    shower: [0.9, 0.9, (w, d) => [[0, 0, w, d, 0, 0.06, 'ceramic'], ['l', 0.05, 0.05, w - 0.05, d - 0.05], ['l', w - 0.05, 0.05, 0.05, d - 0.05], [0, d - 0.03, w, d, 0.06, 2.0, 'glass']]],
    tub: [1.7, 0.75, (w, d) => [[0, 0, w, d, 0, 0.56, 'ceramic'], ['r', 0.08, 0.08, w - 0.08, d - 0.08], ['o', 0.25, d / 2, 0.05]]],
    washer: [0.6, 0.6, (w, d) => [[0, 0, w, d, 0, 0.85, 'ceramic'], ['o', w / 2, d / 2, 0.2]]],
    boiler: [0.7, 0.7, (w, d) => [['c', w / 2, d / 2, 0.32, 0, 1.8, 'metal'], ['o', w / 2, d / 2, 0.18]]],
    genset: [2.4, 1.1, (w, d) => [[0, 0, w, d, 0, 1.5, 'metal'], ...lines(w, d, 6, true)]],
    car: [2.0, 4.6, (w, d) => [[0.12, 0.15, w - 0.12, d - 0.15, 0.15, 0.75, 'car'], [0.22, 1.35, w - 0.22, 3.25, 0.75, 1.35, 'glass'], ['l', 0.22, 1.35, w - 0.22, 1.35], ['l', 0.22, 3.25, w - 0.22, 3.25]]],
    // A painted parking bay, with a car in it or not.
    bay: [2.5, 5.0, (w, d, v) => [['l', 0, 0, 0, d], ['l', w, 0, w, d], ...(v ? KIT.car[2](2.0, 4.6).map((p) => (p[0] === 'l' ? ['l', p[1] + 0.25, p[2] + 0.2, p[3] + 0.25, p[4] + 0.2] : [p[0] + 0.25, p[1] + 0.2, p[2] + 0.25, p[3] + 0.2, p[4], p[5], p[6]])) : [])]],
    bike: [0.6, 1.8, (w, d) => [['o', w / 2, 0.35, 0.3], ['o', w / 2, d - 0.35, 0.3], ['l', w / 2, 0.35, w / 2, d - 0.35], [w / 2 - 0.03, 0.05, w / 2 + 0.03, d - 0.05, 0, 1.0, 'metal']]],
    bin: [0.75, 0.85, (w, d) => [[0, 0, w, d, 0, 1.1, 'metal'], ['l', 0, 0.2, w, 0.2]]],
    rack: [1.2, 0.5, (w, d) => [[0, 0, w, d, 0, 2.0, 'metal'], ['l', 0.04, d / 2, w - 0.04, d / 2]]],
    server: [0.6, 1.0, (w, d) => [[0, 0, w, d, 0, 2.0, 'metal'], ...lines(w, d, 4, false)]],
    bar: [3.0, 0.7, (w, d) => [[0, 0, w, d, 0, 1.1, 'wood'], ['l', 0.04, 0.22, w - 0.04, 0.22]]],
    backbar: [3.0, 0.45, (w, d) => [[0, 0, w, d, 0, 2.0, 'wood'], ...lines(w, d, Math.max(2, Math.round(w / 0.5)), true)]],
    stool: [0.45, 0.45, (w, d) => [['c', w / 2, d / 2, 0.19, 0, 0.75, 'metal']]],
    counter: [2.4, 0.6, (w, d) => [[0, 0, w, d, 0, 1.0, 'wood'], [0.2, 0.1, 0.6, 0.45, 1.0, 1.3, 'screen']]],
    gondola: [2.4, 0.9, (w, d) => [[0, 0, w, d, 0, 1.5, 'wood'], ['l', 0.04, d / 2, w - 0.04, d / 2], ...lines(w, d, Math.max(2, Math.round(w / 0.6)), true)]],
    dj: [2.2, 0.9, (w, d) => [[0, 0, w, d, 0, 1.05, 'metal'], ['o', 0.5, d / 2, 0.25], ['o', w - 0.5, d / 2, 0.25], ['r', w / 2 - 0.3, 0.2, w / 2 + 0.3, d - 0.2]]],
    speaker: [0.7, 0.6, (w, d) => [[0, 0, w, d, 0, 1.8, 'metal'], ['o', w / 2, d / 2, 0.22]]],
    // Sleep capsules, two high.
    pod: [1.15, 2.15, (w, d) => [[0.03, 0, w - 0.03, d, 0, 1.05, 'metal'], [0.03, 0, w - 0.03, d, 1.1, 2.15, 'metal'], ['l', 0.03, 0.55, w - 0.03, 0.55], ['r', 0.18, d - 0.12, w - 0.18, d - 0.04]]],
    surgery: [1.0, 2.3, (w, d) => [[0.15, 0.2, w - 0.15, d - 0.1, 0, 0.9, 'ceramic'], ['o', w / 2, d * 0.45, 0.48], ['c', w / 2, 0.1, 0.08, 0, 2.0, 'metal']]],
    recov: [1.1, 2.3, (w, d) => [[0.05, 0.05, w - 0.05, d - 0.05, 0, 0.7, 'metal'], [0.14, 0.3, w - 0.14, d - 0.14, 0.7, 1.05, 'glass'], ['l', 0.05, 0.3, w - 0.05, 0.3]]],
    lockers: [2.0, 0.5, (w, d) => [[0, 0, w, d, 0, 1.9, 'metal'], ...lines(w, d, Math.max(2, Math.round(w / 0.4)), true)]],
    console: [2.4, 1.2, (w, d) => [[0, 0, w, 0.75, 0, 0.75, 'metal'], [0.1, 0.05, w - 0.1, 0.12, 0.75, 1.5, 'screen'], ['c', w * 0.3, 1.0, 0.22, 0, 0.5, 'cloth'], ['c', w * 0.7, 1.0, 0.22, 0, 0.5, 'cloth']]],
    screens: [2.4, 0.12, (w, d) => [[0, 0, w, d, 1.0, 2.2, 'screen']]],
    treadmill: [0.85, 2.0, (w, d) => [[0.05, 0, w - 0.05, d, 0, 0.25, 'metal'], [0.05, 0, w - 0.05, 0.25, 0.25, 1.3, 'metal'], ...lines(w, d, 8, false)]],
    weights: [1.4, 0.6, (w, d) => [[0, 0, w, d, 0, 1.2, 'metal'], ['o', w * 0.25, d / 2, 0.15], ['o', w * 0.5, d / 2, 0.15], ['o', w * 0.75, d / 2, 0.15]]],
    bench: [1.6, 0.45, (w, d) => [[0, 0, w, d, 0, 0.45, 'wood']]],
    workbench: [2.0, 0.8, (w, d) => [[0, 0, w, d, 0, 0.9, 'metal'], ['r', 0.15, 0.15, 0.7, d - 0.15]]],
    vrchair: [0.9, 1.5, (w, d) => [[0.05, 0.1, w - 0.05, d - 0.1, 0, 0.5, 'cloth'], [0.05, 0.1, w - 0.05, 0.45, 0.5, 1.1, 'cloth'], ['o', w / 2, 0.3, 0.2]]],
    plant: [0.6, 0.6, (w, d) => [['c', w / 2, d / 2, 0.18, 0, 0.45, 'wood'], ['c', w / 2, d / 2, 0.27, 0.45, 1.2, 'leaf']]],
    seats: [3.0, 0.95, (w, d) => {
      const out = [], n = Math.max(1, Math.floor(w / 0.75));
      for (let i = 0; i < n; i++) { const u = (w * i) / n; out.push([u + 0.04, 0, u + w / n - 0.04, d, 0, 0.45, 'cloth'], [u + 0.04, 0, u + w / n - 0.04, 0.2, 0.45, 0.95, 'cloth']); }
      return out;
    }],
    lounger: [0.7, 1.9, (w, d) => [[0, 0, w, d, 0, 0.35, 'cloth'], [0, 0, w, 0.6, 0.35, 0.6, 'cloth']]],
    mailbox: [1.6, 0.3, (w, d) => [[0, 0, w, d, 0.9, 1.6, 'metal'], ...lines(w, d, 4, true)]],
    // Free-standing areas: a rug, a dance floor, an indoor pool.
    rug: [2.0, 1.4, (w, d) => [[0, 0, w, d, 0, 0.015, 'rug']]],
    dance: [4.0, 4.0, (w, d) => [[0, 0, w, d, 0, 0.02, 'rug'], ...lines(w, d, Math.round(w), true), ...lines(w, d, Math.round(d), false)]],
    pool: [6.0, 3.0, (w, d) => [[0, 0, w, d, 0, 0.03, 'water']]],
  };
  const tallOf = (k) => KIT[k][2](KIT[k][0], KIT[k][1], 0).some((p) => typeof p[0] === 'number' ? p[5] > 1.25 : p[0] === 'c' && p[5] > 1.25);

  // ------------------------------------------------------------ builder

  function addRoom(fl, type, x, y, w, h, o) {
    if (w <= 0 || h <= 0) return null;
    const r = Object.assign({ id: fl.rooms.length, type, x, y, w, h }, o);
    fl.rooms.push(r);
    return r;
  }
  const link = (fl, a, b, o) => { if (a && b) fl.links.push(Object.assign({ a: a.id, b: b.id }, o)); };
  const join = (fl, a, b) => { if (a && b) fl.opens.push([a.id, b.id]); };
  const exit = (fl, r, side, o) => { if (r) fl.exits.push(Object.assign({ r: r.id, side }, o)); };
  const wish = (type, min, pref, grow = 1, opt = false, o) => ({ type, min, pref, grow, opt, o });

  // Sizes for a list of wishes that add up to `len`, dropping the optional
  // ones (last first) when it is too short.
  function fit(len, list) {
    list = list.filter(Boolean);
    while (list.length > 1 && list.reduce((s, w) => s + w.min, 0) > len) {
      let i = -1;
      for (let k = list.length - 1; k >= 0; k--) if (list[k].opt) { i = k; break; }
      list.splice(i >= 0 ? i : list.length - 1, 1);
    }
    const size = list.map((w) => w.pref);
    let diff = len - size.reduce((a, b) => a + b, 0);
    for (let guard = 0; diff && guard < 500; guard++) {
      let best = -1, score = -Infinity;
      list.forEach((w, i) => {
        if (!w.grow || (diff < 0 && size[i] <= w.min)) return;
        const s = diff > 0 ? (w.grow * w.pref) / size[i] : (size[i] - w.min) * w.grow;
        if (s > score) { score = s; best = i; }
      });
      if (best < 0) best = diff > 0 ? size.length - 1 : size.findIndex((s, i) => s > list[i].min);
      if (best < 0) break;
      const d = Math.sign(diff);
      size[best] += d; diff -= d;
    }
    return list.map((w, i) => ({ type: w.type, size: size[i], o: w.o }));
  }

  // Cuts a rectangle into rooms side by side along x (or y); with `rev` the
  // first wish lands at the far end. Returns the rooms in wish order.
  function slice(fl, R, axis, wishes, o = {}) {
    const parts = fit(axis === 'x' ? R.w : R.h, wishes);
    if (o.rev) parts.reverse();
    const end = axis === 'x' ? R.x + R.w : R.y + R.h;
    let p = axis === 'x' ? R.x : R.y;
    const out = [];
    for (const s of parts) {
      const size = Math.min(s.size, end - p);
      const extra = Object.assign({ unit: o.unit }, s.o);
      const r = axis === 'x' ? addRoom(fl, s.type, p, R.y, size, R.h, extra) : addRoom(fl, s.type, R.x, p, R.w, size, extra);
      if (r) out.push(r);
      p += size;
    }
    if (o.rev) out.reverse();
    return out;
  }

  // Wall shared by two rooms: { vertical, line, s0, s1 }.
  function shared(a, b) {
    if (a.x + a.w === b.x || b.x + b.w === a.x) {
      const s0 = Math.max(a.y, b.y), s1 = Math.min(a.y + a.h, b.y + b.h);
      if (s1 > s0) return { vertical: true, line: a.x + a.w === b.x ? b.x : a.x, s0, s1 };
    }
    if (a.y + a.h === b.y || b.y + b.h === a.y) {
      const s0 = Math.max(a.x, b.x), s1 = Math.min(a.x + a.w, b.x + b.w);
      if (s1 > s0) return { vertical: false, line: a.y + a.h === b.y ? b.y : a.y, s0, s1 };
    }
    return null;
  }
  const overlapLen = (a, b) => { const s = shared(a, b); return s ? s.s1 - s.s0 : 0; };
  // Room that touches `r` most along the given side.
  function across(fl, r, side) {
    let best = null, bl = 0;
    for (const o of fl.rooms) {
      if (o === r) continue;
      const s = shared(r, o);
      if (!s) continue;
      const ok = side === 'n' ? !s.vertical && s.line === r.y : side === 's' ? !s.vertical && s.line === r.y + r.h
        : side === 'w' ? s.vertical && s.line === r.x : s.vertical && s.line === r.x + r.w;
      if (ok && s.s1 - s.s0 > bl) { bl = s.s1 - s.s0; best = o; }
    }
    return best;
  }

  function owners(fl) {
    const own = new Map();
    for (const r of fl.rooms) for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) own.set(x + ',' + y, r);
    return own;
  }

  // Square swept by a door leaf (or a narrow strip for sliding doors).
  function doorZone(d) {
    const n = HINGED[d.kind] ? (d.kind === 'double' ? d.len / 2 : d.len) : 1;
    if (d.vertical) { const x0 = d.dir > 0 ? d.x : d.x - n; return box(x0, d.y, n, d.len); }
    const y0 = d.dir > 0 ? d.y : d.y - n;
    return box(d.x, y0, d.len, n);
  }
  function tryDoor(fl, d) {
    for (const e of fl.doors) {
      if (e.vertical === d.vertical && (d.vertical ? e.x === d.x : e.y === d.y)) {
        const a0 = d.vertical ? d.y : d.x, b0 = e.vertical ? e.y : e.x;
        if (a0 < b0 + e.len + 1 && b0 < a0 + d.len + 1) return false;
      }
      if (hit(doorZone(d), doorZone(e))) return false;
    }
    for (const w of fl.windows) {
      if (w.vertical === d.vertical && (d.vertical ? w.x === d.x : w.y === d.y)) {
        const a0 = d.vertical ? d.y : d.x, b0 = w.vertical ? w.y : w.x;
        if (a0 < b0 + w.len + 1 && b0 < a0 + d.len + 1) return false;
      }
    }
    fl.doors.push(d);
    return true;
  }
  // Positions along [lo, hi], the preferred one first.
  function spots(lo, hi, at, rng) {
    const out = [];
    for (let p = lo; p <= hi; p++) out.push(p);
    const mid = (lo + hi) / 2;
    const pref = at === 'mid' ? mid : at === 'start' ? lo + 1 : at === 'end' ? hi - 1 : typeof at === 'number' ? lo + at : rng.bool() ? lo + 1 : hi - 1;
    return out.sort((a, b) => Math.abs(a - pref) - Math.abs(b - pref) || a - b);
  }

  function placeLink(fl, L, rng) {
    const a = fl.rooms[L.a], b = fl.rooms[L.b];
    const s = shared(a, b);
    if (!s || s.s1 - s.s0 < 2) return false;
    const len = Math.min(L.len || 2, s.s1 - s.s0);
    const dir = s.vertical ? (b.x >= s.line ? 1 : -1) : b.y >= s.line ? 1 : -1;
    const b0 = s.vertical ? b.y : b.x, b1 = s.vertical ? b.y + b.h : b.x + b.w;
    for (const p of spots(s.s0, s.s1 - len, L.at, rng)) {
      const d = { x: s.vertical ? s.line : p, y: s.vertical ? p : s.line, vertical: s.vertical, len, dir, hinge: p - b0 <= b1 - p - len ? 0 : 1, kind: L.kind || 'door', a: a.id, b: b.id };
      if (tryDoor(fl, d)) return true;
    }
    return false;
  }

  // Runs of a room side that face outside: [{ s, e }] offsets along the side.
  function outerRuns(r, side, own) {
    const runs = [];
    let cur = null;
    const n = side === 'n' || side === 's' ? r.w : r.h;
    for (let i = 0; i < n; i++) {
      const c = side === 'n' ? [r.x + i, r.y - 1] : side === 's' ? [r.x + i, r.y + r.h] : side === 'w' ? [r.x - 1, r.y + i] : [r.x + r.w, r.y + i];
      if (own.has(c[0] + ',' + c[1])) { cur = null; continue; }
      if (cur) cur.e = i + 1;
      else runs.push(cur = { s: i, e: i + 1 });
    }
    return runs;
  }
  const sideLine = (r, side) => (side === 'n' ? r.y : side === 's' ? r.y + r.h : side === 'w' ? r.x : r.x + r.w);

  function placeExit(fl, X, own, rng) {
    const r = fl.rooms[X.r];
    const runs = outerRuns(r, X.side, own).sort((a, b) => b.e - b.s - (a.e - a.s));
    const vertical = X.side === 'w' || X.side === 'e';
    const line = sideLine(r, X.side), start = vertical ? r.y : r.x;
    const dir = X.side === 'n' || X.side === 'w' ? 1 : -1;
    for (const run of runs) {
      const len = Math.min(X.len || 2, run.e - run.s);
      if (len < 2) continue;
      const at = typeof X.at === 'number' ? X.at - run.s : X.at || 'mid';
      for (const p of spots(start + run.s, start + run.e - len, at, rng)) {
        const d = { x: vertical ? line : p, y: vertical ? p : line, vertical, len, dir, hinge: 0, kind: X.kind || 'front', ext: true, r: r.id };
        if (tryDoor(fl, d)) return true;
      }
    }
    return false;
  }

  // Doors for every room that cannot be reached yet: through a corridor of
  // the same flat if there is one, else through the most public neighbour.
  function connectAll(fl, rng) {
    const rooms = fl.rooms;
    const adj = new Map(rooms.map((r) => [r.id, new Set()]));
    const tie = (a, b) => { adj.get(a).add(b); adj.get(b).add(a); };
    for (const d of fl.doors) if (d.a != null) tie(d.a, d.b);
    for (const [a, b] of fl.opens) tie(a, b);
    const roots = rooms.filter((r) => r.type === 'stair' || r.type === 'lift' || fl.doors.some((d) => d.ext && d.r === r.id));
    const pub = { living: 1, dining: 1, kitchen: 1, shop: 1, restaurant: 1, taproom: 1, waiting: 1, dancefloor: 1, backroom: 1, garage: 1, laundry: 1 };
    for (let round = 0; round < 40; round++) {
      const seen = new Set(roots.map((r) => r.id));
      const q = roots.map((r) => r.id);
      while (q.length) for (const n of adj.get(q.shift())) if (!seen.has(n)) { seen.add(n); q.push(n); }
      const lost = rooms.filter((r) => !seen.has(r.id) && r.type !== 'shaft');
      if (!lost.length) return;
      let progress = false;
      for (const r of lost) {
        const cands = rooms.filter((o) => seen.has(o.id) && o.type !== 'shaft' && o.type !== 'lift' && o.type !== 'stair' && overlapLen(r, o) >= 2)
          .map((o) => ({ o, s: (o.unit === r.unit ? 6 : 0) + (CIRC[o.type] ? 4 : pub[o.type] ? 2 : 0) - (DEAD[o.type] ? 9 : 0) + overlapLen(r, o) * 0.01 }))
          .sort((p, q2) => q2.s - p.s);
        for (const { o } of cands) {
          if (placeLink(fl, { a: o.id, b: r.id }, rng)) { tie(o.id, r.id); seen.add(r.id); progress = true; break; }
        }
      }
      if (!progress) return;
    }
  }

  function placeWindows(P, fl, own) {
    if (fl.level < 0) return;
    for (const r of fl.rooms) {
      if (DARK[r.type] || r.dark) continue;
      for (const side of ['n', 's', 'w', 'e']) {
        const vertical = side === 'w' || side === 'e';
        const line = sideLine(r, side), start = vertical ? r.y : r.x;
        if (vertical && P.party && (P.party.w === line || P.party.e === line)) continue;
        const kind = (r.win && r.win[side]) || (r.glass ? 'glass' : 'win');
        for (const run of outerRuns(r, side, own)) {
          const L = run.e - run.s;
          const busy = (p, n) => fl.doors.some((d) => d.vertical === vertical && (vertical ? d.x : d.y) === line && p < (vertical ? d.y : d.x) + d.len + 1 && (vertical ? d.y : d.x) < p + n + 1);
          const push = (p, n, k) => fl.windows.push({ x: vertical ? line : p, y: vertical ? p : line, vertical, len: n, kind: k, r: r.id });
          if (kind === 'glass' || kind === 'shop') {
            // Glass from corner to corner, broken only by doors.
            let p = start + run.s + (kind === 'shop' ? 1 : 0);
            const end = start + run.e - (kind === 'shop' ? 1 : 0);
            while (p < end) {
              let q = p;
              while (q < end && !fl.doors.some((d) => d.vertical === vertical && (vertical ? d.x : d.y) === line && q >= (vertical ? d.y : d.x) && q < (vertical ? d.y : d.x) + d.len)) q++;
              if (q - p >= 2) push(p, q - p, kind);
              p = q;
              while (p < end && fl.doors.some((d) => d.vertical === vertical && (vertical ? d.x : d.y) === line && p >= (vertical ? d.y : d.x) && p < (vertical ? d.y : d.x) + d.len)) p++;
            }
            continue;
          }
          let n = kind === 'patio' ? Math.min(6, L - 2) : WIN[r.type] || 3;
          if (L < n + 2) n = L - 2;
          if (n < 2) continue;
          const k = Math.max(1, Math.floor((L - 1) / (n + (kind === 'patio' ? 6 : 4))));
          for (let j = 0; j < k; j++) {
            const p = start + run.s + Math.round(((j + 0.5) * L) / k - n / 2);
            if (!busy(p, n)) push(p, n, kind);
          }
        }
      }
    }
  }

  // Every wall edge of a floor: class (ext, party, int, open) and the door or
  // window set in it, keyed 'h<x>,<y>' (along y = line) or 'v<x>,<y>'.
  function edgeMap(fl) {
    const own = owners(fl);
    const opens = new Set(fl.opens.map(([a, b]) => Math.min(a, b) + '|' + Math.max(a, b)));
    const E = new Map();
    const put = (k, v, x, y, r, n) => {
      if (E.has(k)) return;
      let cls;
      if (!n) cls = 'ext';
      else if (opens.has(Math.min(r.id, n.id) + '|' + Math.max(r.id, n.id))) cls = 'open';
      else if (r.unit !== n.unit || THICK[r.type] || THICK[n.type]) cls = 'party';
      else cls = 'int';
      E.set(k, { v, x, y, cls });
    };
    for (const r of fl.rooms) {
      for (let i = 0; i < r.w; i++) {
        const x = r.x + i;
        put('h' + x + ',' + r.y, false, x, r.y, r, own.get(x + ',' + (r.y - 1)));
        put('h' + x + ',' + (r.y + r.h), false, x, r.y + r.h, r, own.get(x + ',' + (r.y + r.h)));
      }
      for (let i = 0; i < r.h; i++) {
        const y = r.y + i;
        put('v' + r.x + ',' + y, true, r.x, y, r, own.get((r.x - 1) + ',' + y));
        put('v' + (r.x + r.w) + ',' + y, true, r.x + r.w, y, r, own.get((r.x + r.w) + ',' + y));
      }
    }
    const mark = (o, field) => {
      for (let i = 0; i < o.len; i++) {
        const e = E.get(o.vertical ? 'v' + o.x + ',' + (o.y + i) : 'h' + (o.x + i) + ',' + o.y);
        if (e) e[field] = o;
      }
    };
    for (const d of fl.doors) mark(d, 'door');
    for (const w of fl.windows) mark(w, 'win');
    return E;
  }

  // Straight runs of edges of the same kind along each grid line.
  function wallRuns(E) {
    const lines = new Map();
    for (const e of E.values()) {
      const lk = (e.v ? 'v' : 'h') + (e.v ? e.x : e.y);
      if (!lines.has(lk)) lines.set(lk, []);
      lines.get(lk).push(e);
    }
    const runs = [];
    for (const list of lines.values()) {
      list.sort((a, b) => (a.v ? a.y - b.y : a.x - b.x));
      let cur = null;
      for (const e of list) {
        const pos = e.v ? e.y : e.x, op = e.door || e.win || null;
        if (cur && cur.a1 === pos && cur.cls === e.cls && cur.op === op) { cur.a1++; continue; }
        cur = { v: e.v, line: e.v ? e.x : e.y, a0: pos, a1: pos + 1, cls: e.cls, op, kind: e.door ? 'door' : e.win ? 'win' : e.cls === 'open' ? 'open' : 'wall' };
        runs.push(cur);
      }
    }
    return runs;
  }

  // ------------------------------------------------------------ furniture

  // Places furniture in one room: against walls without doors (tall pieces
  // away from windows too), in the middle, in rows and grids; door swings and
  // the space in front of each piece stay clear.
  function furnisher(fl, r, E, rng) {
    const ins = 0.32;
    const solid = [], clear = [], swing = [];
    for (const d of fl.doors) {
      if (d.a !== r.id && d.b !== r.id && d.r !== r.id) continue;
      const k = HINGED[d.kind] ? (d.kind === 'double' ? d.len / 2 : d.len) : 1.6;
      swing.push(d.vertical ? box(d.x - k, d.y - 0.3, 2 * k, d.len + 0.6) : box(d.x - 0.3, d.y - k, d.len + 0.6, 2 * k));
    }
    const lineOf = (side) => sideLine(r, side);
    const edge = (side, i) => {
      const v = side === 'w' || side === 'e', line = lineOf(side);
      return E.get(v ? 'v' + line + ',' + i : 'h' + i + ',' + line);
    };
    const wallOK = (side, a0, a1, tall) => {
      for (let i = Math.floor(a0 + 1e-6); i < Math.ceil(a1 - 1e-6); i++) {
        const e = edge(side, i);
        if (!e || e.cls === 'open' || e.door || (tall && e.win)) return false;
      }
      return true;
    };
    const span = (side) => (side === 'w' || side === 'e' ? [r.y, r.y + r.h] : [r.x, r.x + r.w]);
    const info = {};
    for (const side of ['n', 'e', 's', 'w']) {
      const [a, b] = span(side);
      let door = 0, win = 0, open = 0;
      for (let i = a; i < b; i++) { const e = edge(side, i); if (!e || e.cls === 'open') open++; else if (e.door) door++; else if (e.win) win++; }
      info[side] = { len: b - a, door, win, open };
    }
    const inside = (b) => b.x0 >= r.x - 1e-6 && b.y0 >= r.y - 1e-6 && b.x1 <= r.x + r.w + 1e-6 && b.y1 <= r.y + r.h + 1e-6;
    const fits = (b, front, loose) => inside(b) && !solid.some((s) => hit(s, b)) && !swing.some((s) => hit(s, b))
      && (loose || !clear.some((s) => hit(s, b))) && (!front || !solid.some((s) => hit(s, front)));
    const add = (k, b, w, d, rot, front, v) => {
      const it = { k, x: b.x0, y: b.y0, w, d, r: rot };
      if (v) it.v = v;
      fl.items.push(it);
      solid.push(b);
      if (front) clear.push(front);
      return it;
    };
    const atWall = (k, w, d, side, p, o) => {
      const wl = w / U, dl = d / U, cl = (o.clear == null ? 0.6 : o.clear) / U;
      let b, fr, rot;
      if (side === 'n') { rot = 0; b = box(p, r.y + ins, wl, dl); fr = box(p, b.y1, wl, cl); }
      else if (side === 's') { rot = 2; b = box(p, r.y + r.h - ins - dl, wl, dl); fr = box(p, b.y0 - cl, wl, cl); }
      else if (side === 'w') { rot = 3; b = box(r.x + ins, p, dl, wl); fr = box(b.x1, p, cl, wl); }
      else { rot = 1; b = box(r.x + r.w - ins - dl, p, dl, wl); fr = box(b.x0 - cl, p, cl, wl); }
      if (!fits(b, cl > 0 ? fr : null)) return null;
      if (!wallOK(side, p, p + wl, o.tall == null ? tallOf(k) : o.tall)) return null;
      return add(k, b, w, d, rot, cl > 0 ? fr : null, o.v);
    };
    const opp = { n: 's', s: 'n', e: 'w', w: 'e' };
    const F = {
      r, rng, area: r.w * r.h * U * U, info, opp,
      // Against a wall: o.side, o.pref ('blank', 'window', 'long'), o.at ('mid', 'end').
      place(k, o = {}) {
        const w = o.w || KIT[k][0], d = o.d || KIT[k][1], wl = w / U;
        let sides = o.side ? [].concat(o.side) : rng.shuffle(['n', 'e', 's', 'w']);
        const score = (s) => (o.pref === 'blank' ? (info[s].door ? 0 : 4) + (info[s].win ? 0 : 2) + info[s].len * 0.05
          : o.pref === 'window' ? info[s].win * 2 - info[s].open : o.pref === 'long' ? info[s].len - info[s].door * 2 : 0);
        if (o.pref) sides = sides.sort((a, b) => score(b) - score(a));
        for (const s of sides) {
          const v = s === 'w' || s === 'e';
          const [a, b] = span(s);
          const lo = a + ins, hi = b - ins - wl;
          if (hi < lo - 1e-6) continue;
          const ps = [];
          for (let p = lo; p <= hi + 1e-6; p += 0.5) ps.push(p);
          if (hi - ps[ps.length - 1] > 0.01) ps.push(hi);
          const mid = (lo + hi) / 2;
          if (o.at === 'mid') ps.sort((p, q) => Math.abs(p - mid) - Math.abs(q - mid));
          else ps.sort((p, q) => Math.min(p - lo, hi - p) - Math.min(q - lo, hi - q));
          for (const p of ps) {
            const it = atWall(k, w, d, s, p, o);
            if (it) { it.side = s; return it; }
          }
          if (v && o.only) break;
        }
        return null;
      },
      // Free-standing, centred on (cx, cy) in plan units.
      at(k, cx, cy, rot, o = {}) {
        const w = o.w || KIT[k][0], d = o.d || KIT[k][1];
        const bw = (rot % 2 ? d : w) / U, bh = (rot % 2 ? w : d) / U;
        const b = box(cx - bw / 2, cy - bh / 2, bw, bh);
        if (!(o.force ? inside(b) : fits(b, null, o.loose))) return null;
        return add(k, b, w, d, rot, null, o.v);
      },
      // In the middle of the room (or of a part of it), lengthwise.
      centre(k, o = {}) {
        const R = o.in || r;
        const cx = R.x + R.w / 2 + (o.dx || 0), cy = R.y + R.h / 2 + (o.dy || 0);
        const along = R.w >= R.h ? 0 : 1;
        return F.at(k, cx, cy, o.rot != null ? o.rot : along, o) || (o.rot == null && F.at(k, cx, cy, 1 - along, o));
      },
      // As many as fit along one wall.
      row(k, side, o = {}) {
        const w = o.w || KIT[k][0], gap = (o.gap || 0) / U;
        const [a, b] = span(side);
        let n = 0;
        for (let p = a + ins; p + w / U <= b - ins + 1e-6; p += 0.5) {
          const it = atWall(k, w, o.d || KIT[k][1], side, p, o);
          if (it) { n++; it.side = side; p += w / U + gap - 0.5; if (o.max && n >= o.max) break; }
        }
        return n;
      },
      // A grid of free-standing pieces with the given spacing (metres).
      grid(k, sx, sy, o = {}) {
        const m = (o.margin == null ? 1.2 : o.margin) / U;
        const R = o.in || r;
        const x0 = R.x + m, y0 = R.y + m, x1 = R.x + R.w - m, y1 = R.y + R.h - m;
        // As many centres as fit between the margins, the outer ones on them.
        const nx = Math.max(1, Math.floor((x1 - x0) / (sx / U) + 1e-6) + 1), ny = Math.max(1, Math.floor((y1 - y0) / (sy / U) + 1e-6) + 1);
        const ox = (x1 - x0 - (nx - 1) * (sx / U)) / 2, oy = (y1 - y0 - (ny - 1) * (sy / U)) / 2;
        let n = 0;
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) if (F.at(k, x0 + ox + (i * sx) / U, y0 + oy + (j * sy) / U, o.rot || 0, o)) n++;
        return n;
      },
      // Something in front of a piece already placed (a coffee table,
      // stools), `off` metres off its middle.
      before(it, k, gap, o = {}) {
        if (!it) return null;
        const w = o.w || KIT[k][0], d = o.d || KIT[k][1];
        const g = gap / U + d / U / 2, off = (o.off || 0) / U;
        const bw = it.r % 2 ? it.d / U : it.w / U, bh = it.r % 2 ? it.w / U : it.d / U;
        const c = it.r === 0 ? [it.x + bw / 2 + off, it.y + bh + g] : it.r === 2 ? [it.x + bw / 2 - off, it.y - g]
          : it.r === 1 ? [it.x - g, it.y + bh / 2 + off] : [it.x + bw + g, it.y + bh / 2 - off];
        return F.at(k, c[0], c[1], it.r, Object.assign({}, o, { w, d, loose: true }));
      },
    };
    return F;
  }

  function furnishRoom(fl, r, E, rng, setting) {
    if (r.type === 'stair' || r.type === 'lift' || r.type === 'shaft') return;
    const F = furnisher(fl, r, E, rng);
    const cy = setting === 'cyber', A = F.area, long = r.w >= r.h ? ['n', 's'] : ['w', 'e'];
    switch (r.type) {
      case 'bedroom': case 'guest': {
        if (!F.place('bed2', { pref: 'blank', at: 'mid', clear: 0.7 })) F.place('bed1', { pref: 'blank', clear: 0.6 });
        F.place('wardrobe', { w: A > 14 ? 2.4 : 1.8, pref: 'long' });
        if (r.type === 'guest' && A > 15) F.place('bed1', { clear: 0.5 });
        if (A > 12) F.place(cy ? 'vrchair' : 'desk', { pref: 'window' });
        if (cy) F.place('screens', { w: 1.6, clear: 0 });
        break;
      }
      case 'kids':
        F.place('bed1', { pref: 'blank' });
        F.place('desk', { pref: 'window' });
        F.place('wardrobe', { w: 1.2 });
        F.place('shelf', { w: 1.2 });
        break;
      case 'unit':
        // A conapt unit: bed under the window, a kitchenette and a screen.
        F.place(A > 13 ? 'bed2' : 'bed1', { pref: 'window', clear: 0.5 });
        F.place('kitchen', { w: 1.8, clear: 0.7 });
        F.place('screens', { w: 1.6, clear: 0 });
        F.place('vrchair', { clear: 0.3 }) || F.place('armchair');
        break;
      case 'living': case 'tavern': {
        if (r.kitchenette) F.place('kitchen', { w: 2.4, pref: 'long', clear: 0.9 });
        const s = F.place('sofa', { w: A > 24 ? 2.8 : 2.2, pref: 'blank', at: 'mid', clear: 1.4 });
        if (s) {
          F.place('tvunit', { side: F.opp[s.side], at: 'mid' });
          F.before(s, 'coffee', 0.45, { w: 1.1, d: 0.6 });
        }
        F.place('armchair', { clear: 0.5 });
        if (A > 30 && !r.kitchenette) F.centre('table6', { dx: r.w / 4 });
        F.place('shelf', { w: 1.6 });
        if (r.type === 'tavern') { F.place('bar', { w: 2.0 }); F.centre('table6'); }
        F.place('plant', { clear: 0 });
        break;
      }
      case 'kitchen': {
        let k = null;
        for (const w of [4.2, 3.6, 3.0, 2.4, 1.8]) if ((k = F.place('kitchen', { w, pref: 'long', clear: 0.9 }))) break;
        if (A > 16) F.centre('island') || F.centre('table4');
        else if (A > 10) F.centre('table4');
        break;
      }
      case 'dining': F.centre(A > 22 ? 'table8' : 'table6') || F.centre('table4'); F.place('cabinet', { w: 1.6 }); F.place('plant', { clear: 0 }); break;
      case 'study': case 'office':
        F.place(cy && r.type === 'office' ? 'console' : 'desk', { pref: 'window' });
        F.place('shelf', { pref: 'blank' });
        F.place(cy ? 'server' : 'cabinet');
        if (A > 12) F.place('armchair');
        break;
      case 'bath':
        if (A > 5.5) F.place('tub', { clear: 0.5 }) || F.place('shower');
        else F.place('shower', { clear: 0.4 });
        F.place('wc', { clear: 0.5 });
        F.place('basin', { clear: 0.5 });
        if (A > 8) F.place('basin', { clear: 0.5 });
        break;
      case 'wc': F.place('wc', { clear: 0.5 }); F.place('basin', { clear: 0.4 }); break;
      case 'wetpod': F.place('shower', { clear: 0.3 }); F.place('wc', { clear: 0.3 }); F.place('basin', { clear: 0.3 }); break;
      case 'laundry': F.place('washer'); F.place('washer'); F.place('basin'); F.place('shelf', { w: 1.2 }); break;
      case 'restroom': for (let i = 0; i < 3; i++) F.place('wc', { clear: 0.6 }); F.place('basin'); F.place('basin'); break;
      case 'showers': for (let i = 0; i < 4; i++) F.place('shower', { clear: 0.4 }); F.place('basin'); F.place('bench'); break;
      case 'lockers': F.place('lockers', { w: 2.4 }); F.place('lockers', { w: 2.4 }); F.place('lockers', { w: 1.6 }); F.centre('bench'); break;
      case 'staff': F.place('lockers', { w: 1.6 }); F.place('bench'); F.place('table4') || F.centre('table4'); break;
      case 'servants': F.place('bed1'); F.place('bed1'); F.place('lockers', { w: 1.2 }); F.place('desk'); break;
      case 'closet': for (const s of long) F.row('wardrobe', s, { w: 1.2, clear: 0.6 }); break;
      case 'storage': case 'pantry': case 'backroom': case 'cellar': case 'implants':
        for (const s of rng.shuffle(['n', 'e', 's', 'w'])) F.row(r.type === 'pantry' ? 'shelf' : 'rack', s, { w: 1.2, clear: 0.7 });
        break;
      case 'wine': for (const s of ['n', 'e', 's', 'w']) F.row('rack', s, { w: 1.2, clear: 0.7 }); break;
      case 'boiler': F.place(cy ? 'genset' : 'boiler', { clear: 0.8 }); F.place('boiler'); F.place('cabinet'); break;
      case 'server': for (const s of long) F.row('server', s, { clear: 0.8 }); break;
      case 'garage': for (const s of ['n', 's', 'w', 'e']) if (F.row('car', s, { tall: false, clear: 0.8, max: 2, gap: 0.6 })) break; F.place('shelf'); F.place('workbench'); break;
      case 'parking': {
        // Painted bays along the walls, most of them taken.
        for (const s of ['n', 's']) F.row('bay', s, { tall: false, clear: 1.5, v: 1 });
        for (const it of fl.items) if (it.k === 'bay' && rng.bool(0.35)) it.v = 0;
        break;
      }
      case 'bike': for (const s of ['n', 's', 'w', 'e']) F.row('bike', s, { clear: 0.8, gap: 0.05 }); break;
      case 'bins': for (const s of ['n', 'e', 's', 'w']) F.row('bin', s, { clear: 0.8, max: 3 }); break;
      case 'lobby': F.place('mailbox', { pref: 'blank' }); F.place('plant', { clear: 0 }); if (A > 14) F.place('bench'); break;
      case 'hall': if (A > 4) F.place('cabinet', { w: 1.0, d: 0.35, clear: 0.6 }); break;
      case 'checkpoint': F.place('console', { w: 2.0 }); F.place('screens', { w: 2.0, clear: 0 }); F.place('plant', { clear: 0 }); break;
      case 'security': F.place('console', { w: 2.4 }); F.place('screens', { w: 2.4, clear: 0 }); F.place('lockers', { w: 1.2 }); break;
      case 'taproom': {
        const b = F.place('bar', { w: Math.min(5, Math.max(2.4, r.w * U - 2.4)), pref: 'long', clear: 1.5 });
        if (b) {
          F.place('backbar', { side: b.side, w: Math.min(4, b.w), clear: 0 });
          for (let u = -b.w / 2 + 0.5; u < b.w / 2 - 0.3; u += 0.7) F.before(b, 'stool', 0.12, { off: u });
        }
        F.grid('bistro', 2.2, 2.2, { margin: 1.4 });
        break;
      }
      case 'restaurant': F.grid(A > 40 ? 'table4' : 'round4', A > 40 ? 2.6 : 2.3, 2.6, { margin: A > 40 ? 1.2 : 1.0 }); F.place('cabinet', { w: 1.6 }); F.place('plant', { clear: 0 }); break;
      case 'dancefloor': {
        const dj = F.place('dj', { pref: 'blank', at: 'mid', clear: 1.5 });
        if (dj) { F.place('speaker', { side: dj.side }); F.place('speaker', { side: dj.side }); }
        const m = 4;
        if (r.w > 2 * m + 4 && r.h > 2 * m + 4) F.centre('dance', { w: Math.floor((r.w - 2 * m) * U), d: Math.floor((r.h - 2 * m) * U), force: true });
        for (const s of ['n', 'e', 's', 'w']) F.place('sofa', { side: s, w: 2.4, clear: 0.6 });
        break;
      }
      case 'vip': F.place('sofa', { w: 2.8, pref: 'blank', at: 'mid' }); F.place('sofa', { w: 2.4 }); F.centre('coffee'); F.place('bar', { w: 1.8 }); F.place('plant', { clear: 0 }); break;
      case 'cloak': for (const s of long) F.row('rack', s, { w: 1.6, clear: 0.7 }); F.place('counter', { w: 1.6 }); break;
      case 'coffin': {
        // Capsules on both long walls, the aisle in between.
        const sides = r.w >= r.h ? ['n', 's'] : ['w', 'e'];
        for (const s of sides) F.row('pod', s, { clear: 0.9, tall: false });
        break;
      }
      case 'clinic': F.centre('surgery', { rot: r.w >= r.h ? 1 : 0, force: true }); F.place('server'); F.place('rack', { w: 1.2 }); F.place('basin'); F.place('screens', { w: 1.6, clear: 0 }); break;
      case 'recovery': for (const s of long) F.row('recov', s, { clear: 0.8, gap: 0.3 }); break;
      case 'waiting': F.place('sofa', { w: 2.4, pref: 'blank' }); F.place('sofa', { w: 2.4 }); F.place('counter', { w: 2.0, pref: 'long' }); F.place('plant', { clear: 0 }); break;
      case 'reception': F.place('counter', { w: 2.4 }); F.place('sofa'); F.place('plant', { clear: 0 }); break;
      case 'workshop': F.place('workbench', { pref: 'window' }); F.place('workbench'); F.place('rack'); F.place(cy ? 'server' : 'shelf'); break;
      case 'shop': {
        F.place('counter', { w: 2.4, pref: 'long' });
        for (const s of rng.shuffle(['n', 'e', 'w'])) F.row('shelf', s, { w: 1.6, clear: 0.9, max: 3 });
        F.grid('gondola', 3.4, 2.6, { margin: 2.4 });
        break;
      }
      case 'gym': F.place('treadmill', { clear: 0.6 }); F.place('treadmill', { clear: 0.6 }); F.place('weights'); F.place('bench'); break;
      case 'cinema': F.place('screens', { w: Math.min(4, r.w * U - 1), pref: 'blank', at: 'mid', clear: 1.6 }); F.grid('seats', 4, 1.6, { margin: 1.6, w: Math.min(3.6, r.w * U - 2.4) }); break;
      case 'vrden': F.place('vrchair'); F.place('server'); F.place('screens', { w: 2.0, clear: 0 }); F.place('sofa'); break;
      case 'vault': if (cy) F.place('bed1'); F.place('rack'); F.place('cabinet'); F.place('screens', { w: 1.2, clear: 0 }); break;
      case 'pool': F.centre('pool', { w: Math.max(2, Math.floor(r.w * U - 2.4)), d: Math.max(2, Math.floor(r.h * U - 2.4)), force: true }); F.place('lounger'); F.place('lounger'); break;
      case 'unitentry': break;
    }
  }

  // ------------------------------------------------------------ building types

  function newFloor(P, level) {
    const fl = { level, rooms: [], links: [], opens: [], exits: [], doors: [], windows: [], items: [], outdoor: [] };
    P.floors.push(fl);
    return fl;
  }

  // Stair (two flights) with the lift beside it and a service shaft behind
  // the lift, opening south onto the landing at y = y0 + h.
  function core(fl, x, y0, h) {
    const st = addRoom(fl, 'stair', x, y0, 5, h, { entry: 's', unit: 'core' });
    if (h > 5) addRoom(fl, 'shaft', x + 5, y0, 4, h - 4, { unit: 'core' });
    const lf = addRoom(fl, 'lift', x + 5, y0 + Math.max(0, h - 4), 4, Math.min(4, h), { unit: 'core' });
    return { st, lf };
  }
  function coreLanding(fl, c, land) {
    join(fl, c.st, land);
    link(fl, land, c.lf, { kind: 'lift', at: 'mid' });
  }

  // Street, pavement and a garden with hedges and trees around a house.
  function street(fl, x0, x1, y, walk = 4) {
    fl.outdoor.push({ k: 'sidewalk', x: x0, y, w: x1 - x0, h: walk }, { k: 'road', x: x0, y: y + walk, w: x1 - x0, h: 12, label: 'street' });
  }
  function garden(P, fl, x0, y0, x1, y1, trees, avoid) {
    fl.outdoor.unshift({ k: 'lawn', x: x0, y: y0, w: x1 - x0, h: y1 - y0, label: 'garden' });
    fl.outdoor.push({ k: 'hedge', x: x0, y: y0, w: x1 - x0, h: 1.2 }, { k: 'hedge', x: x0, y: y0 + 1.2, w: 1.2, h: y1 - y0 - 1.2 }, { k: 'hedge', x: x1 - 1.2, y: y0 + 1.2, w: 1.2, h: y1 - y0 - 1.2 });
    street(fl, x0 - 6, x1 + 6, y1);
    const taken = avoid.slice();
    for (const o of fl.outdoor) if (o.k !== 'lawn' && o.k !== 'hedge' && o.k !== 'sidewalk' && o.k !== 'road') taken.push(box(o.x - 1, o.y - 1, o.w + 2, o.h + 2));
    for (let i = 0, n = 0; i < 40 && n < trees; i++) {
      const r = P.rng.int(3, 4), x = P.rng.int(x0 + 2, x1 - 2 - 2 * r), y = P.rng.int(y0 + 2, y1 - 2 - 2 * r);
      const b = box(x, y, 2 * r, 2 * r);
      if (taken.some((t) => hit(t, b))) continue;
      taken.push(box(x - 2, y - 2, 2 * r + 4, 2 * r + 4));
      fl.outdoor.push({ k: 'tree', x, y, w: 2 * r, h: 2 * r });
      n++;
    }
  }
  const footBox = (fl) => {
    const b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    for (const r of fl.rooms) { b.x0 = Math.min(b.x0, r.x); b.y0 = Math.min(b.y0, r.y); b.x1 = Math.max(b.x1, r.x + r.w); b.y1 = Math.max(b.y1, r.y + r.h); }
    return b;
  };

  // A flat beside the stair: hall and corridor across the middle, bedrooms
  // behind, living room and kitchen toward the street (with `ext`, the
  // strip in front of the stair as well).
  function flatAcross(P, fl, unit, R, door, yc, land, ext) {
    const rng = P.rng;
    const hl = Math.min(R.w, 6);
    const hall = addRoom(fl, 'hall', door === 'e' ? R.x + R.w - hl : R.x, yc, hl, 3, { unit });
    const corr = R.w - hl >= 3 ? addRoom(fl, 'corridor', door === 'e' ? R.x : R.x + hl, yc, R.w - hl, 3, { unit }) : null;
    join(fl, hall, corr);
    link(fl, land, hall, { kind: 'flat', at: 'mid' });
    const night = R.w >= 19 ? [wish('bedroom', 7, 8), wish('bath', 4, 5, 0.3), wish('kids', 5, 6)]
      : R.w >= 15 ? [wish('bedroom', 7, 7), wish('bath', 4, 4, 0.3), wish('kids', 4, 5)] : [wish('bedroom', 7, 8), wish('bath', 4, 4, 0.3)];
    const order = rng.pick([[0, 1, 2], [2, 1, 0], [1, 0, 2]]).filter((i) => night[i]).map((i) => night[i]);
    // From the door outwards.
    slice(fl, { x: R.x, y: R.y, w: R.w, h: yc - R.y }, 'x', order, { unit, rev: door === 'e' });
    const dx = ext && door === 'w' ? ext.x : R.x, dw = R.w + (ext ? ext.w : 0);
    const day = [wish('kitchen', 6, 7, 0.4), wish('living', 10, 13)];
    if (rng.bool()) day.reverse();
    if (dw >= 25) day.push(wish('study', 5, 6, 0.3));
    const rooms = slice(fl, { x: dx, y: yc + 3, w: dw, h: R.y + R.h - yc - 3 }, 'x', day, { unit, rev: door === 'e' });
    const kit = rooms.find((r) => r.type === 'kitchen'), liv = rooms.find((r) => r.type === 'living');
    if (rng.bool(0.6)) join(fl, kit, liv);
    else link(fl, liv, kit);
  }

  // A flat along a gallery: hall and corridor on the gallery side, rooms on
  // the façade, the bathroom at the bedroom end of the corridor.
  function flatAlong(P, fl, unit, R, door, land) {
    const rng = P.rng, band = 3;
    const cy = door === 'n' ? R.y : R.y + R.h - band, ry = door === 'n' ? R.y + band : R.y;
    const big = R.w >= 20;
    const list = [big ? wish('kitchen', 5, 6, 0.3) : null, wish('living', 8, 10, 1, false, { kitchenette: !big }), wish('bedroom', 7, 7, 0.5), R.w >= 22 ? wish('kids', 5, 6, 0.5, true) : null];
    const rev = rng.bool();
    const rooms = slice(fl, { x: R.x, y: ry, w: R.w, h: R.h - band }, 'x', list, { unit, rev });
    const end = rooms[rooms.length - 1];
    const atLeft = end.x === R.x;
    const bw = Math.min(5, end.w - 2);
    const bath = bw >= 3 ? addRoom(fl, 'bath', atLeft ? R.x : R.x + R.w - bw, cy, bw, band, { unit }) : null;
    const cx0 = bath && atLeft ? R.x + bw : R.x, cw = R.w - (bath ? bw : 0);
    const hl = Math.min(cw, 6);
    const hall = addRoom(fl, 'hall', atLeft ? cx0 + cw - hl : cx0, cy, hl, band, { unit });
    const corr = cw - hl >= 3 ? addRoom(fl, 'corridor', atLeft ? cx0 : cx0 + hl, cy, cw - hl, band, { unit }) : null;
    join(fl, hall, corr);
    link(fl, land, hall, { kind: 'flat', at: 'mid' });
    const kit = rooms.find((r) => r.type === 'kitchen'), liv = rooms.find((r) => r.type === 'living');
    if (kit) join(fl, kit, liv);
  }

  // Cellars in a row, the boiler room among them.
  function cellars(fl, R, unit, boiler) {
    const n = Math.max(1, Math.floor(R.w / 4.5));
    const rooms = slice(fl, R, 'x', Array.from({ length: n }, () => wish('cellar', 3, 4)), { unit });
    rooms.forEach((r, i) => { r.num = 'C' + (i + 1 + (fl.cellarN || 0)); });
    fl.cellarN = (fl.cellarN || 0) + rooms.length;
    if (boiler && rooms.length > 1) { rooms[0].type = 'boiler'; delete rooms[0].num; }
    return rooms;
  }

  // Underground car park in front of the cellars, running out under the front
  // garden, with the ramp up to the street alongside the building: the
  // garage door at the foot of the ramp, at the back end of the side wall.
  function carPark(P, fl, x0, x1, y, h, corr, rampX) {
    const pk = addRoom(fl, 'parking', x0, y, x1 - x0, h, { unit: 'park' });
    link(fl, corr, pk, { kind: 'door' });
    exit(fl, pk, rampX >= x1 ? 'e' : 'w', { kind: 'garage', len: 6, at: 'start' });
    return pk;
  }

  // Present day: apartment block (palazzina) with two flats per floor beside
  // the stair, or four along a gallery; shops on the ground floor, cellars
  // and a car park below.
  function modernTownhouse(P) {
    const rng = P.rng;
    const four = rng.bool(0.4), ups = rng.int(2, 4);
    let W, D, yc, x0;
    if (!four) { const fw = rng.int(16, 20); W = 2 * fw + 9; D = rng.int(22, 26); yc = rng.int(9, 10); x0 = fw; }
    else { W = 2 * rng.int(20, 23); yc = 10; D = yc + 3 + rng.int(11, 13); x0 = Math.floor((W - 9) / 2); }
    const xm = Math.floor(W / 2);
    // Typical floor.
    const t1 = newFloor(P, 1);
    const c1 = core(t1, x0, 0, yc);
    if (!four) {
      const land = addRoom(t1, 'landing', x0, yc, 9, 3, { unit: 'core' });
      coreLanding(t1, c1, land);
      flatAcross(P, t1, 'A', { x: 0, y: 0, w: x0, h: D }, 'e', yc, land, { x: x0, y: yc + 3, w: 9, h: D - yc - 3 });
      flatAcross(P, t1, 'B', { x: x0 + 9, y: 0, w: W - x0 - 9, h: D }, 'w', yc, land, null);
    } else {
      const land = addRoom(t1, 'landing', 0, yc, W, 3, { unit: 'core' });
      coreLanding(t1, c1, land);
      flatAlong(P, t1, 'A', { x: 0, y: 0, w: x0, h: yc }, 's', land);
      flatAlong(P, t1, 'B', { x: x0 + 9, y: 0, w: W - x0 - 9, h: yc }, 's', land);
      flatAlong(P, t1, 'C', { x: 0, y: yc + 3, w: xm, h: D - yc - 3 }, 'n', land);
      flatAlong(P, t1, 'D', { x: xm, y: yc + 3, w: W - xm, h: D - yc - 3 }, 'n', land);
    }
    t1.repeat = ups;
    P.flats = four ? 4 : 2;
    // Ground floor: the entrance hall from the street, shops or flats.
    const g = newFloor(P, 0);
    const c0 = core(g, x0, 0, yc);
    if (!four) {
      const lobby = addRoom(g, 'lobby', x0, yc, 9, D - yc, { unit: 'core' });
      coreLanding(g, c0, lobby);
      exit(g, lobby, 's', { kind: 'double', len: 4 });
      for (const [unit, R, door] of [['A', { x: 0, y: 0, w: x0, h: D }, 'e'], ['B', { x: x0 + 9, y: 0, w: W - x0 - 9, h: D }, 'w']]) {
        if (rng.bool(0.5)) {
          // A shop on the street, its back room and WC behind.
          const shop = addRoom(g, 'shop', R.x, yc, R.w, D - yc, { unit, win: { s: 'shop' } });
          exit(g, shop, 's', { kind: 'double', len: 3 });
          const [back] = slice(g, { x: R.x, y: 0, w: R.w, h: yc }, 'x', [wish('backroom', 5, 8), wish('wc', 3, 4, 0)], { unit, rev: door === 'e' });
          link(g, shop, back);
        } else flatAcross(P, g, unit, R, door, yc, lobby, null);
      }
    } else {
      const corr = addRoom(g, 'landing', 0, yc, W, 3, { unit: 'core' });
      coreLanding(g, c0, corr);
      const lobby = addRoom(g, 'lobby', xm - 3, yc + 3, 6, D - yc - 3, { unit: 'core' });
      join(g, corr, lobby);
      exit(g, lobby, 's', { kind: 'double', len: 4 });
      for (const [unit, R] of [['C', { x: 0, y: yc + 3, w: xm - 3, h: D - yc - 3 }], ['D', { x: xm + 3, y: yc + 3, w: W - xm - 3, h: D - yc - 3 }]]) {
        if (rng.bool(0.6)) {
          const [shop] = slice(g, R, 'x', [wish('shop', 8, 12), wish('wc', 3, 3, 0)], { unit, rev: R.x === 0 });
          shop.win = { s: 'shop' };
          exit(g, shop, 's', { kind: 'double', len: 3 });
        } else flatAlong(P, g, unit, R, 'n', corr);
      }
      // Bicycles, bins and storerooms at the back.
      slice(g, { x: 0, y: 0, w: x0, h: yc }, 'x', [wish('bike', 6, 8), wish('bins', 4, 5, 0.3), wish('storage', 3, 4, 0.5, true)], { unit: 'core' });
      flatAlong(P, g, 'B', { x: x0 + 9, y: 0, w: W - x0 - 9, h: yc }, 's', corr);
    }
    // The street beyond the front garden, which is deep enough for the car park
    // to stay within the plot.
    const sy = P.cellar ? Math.max(D + 12, yc + 36) : D + 12;
    // Basement: cellars off a corridor, the car park in front.
    if (P.cellar) {
      const b = newFloor(P, -1);
      const cb = core(b, x0, 0, yc);
      const corr = addRoom(b, 'corridor', 0, yc, W, 3, { unit: 'core' });
      coreLanding(b, cb, corr);
      cellars(b, { x: 0, y: 0, w: x0, h: yc }, 'cel', true);
      cellars(b, { x: x0 + 9, y: 0, w: W - x0 - 9, h: yc }, 'cel', false);
      carPark(P, b, 0, W, yc + 3, 32, corr, W);
      b.outdoor.push({ k: 'ramp', x: W + 1, y: yc + 3, w: 7, h: sy - yc - 3 });
    }
    // A strip of garden in front and the street.
    const fx0 = -6, fx1 = W + 9;
    g.outdoor.push({ k: 'lawn', x: fx0, y: -6, w: fx1 - fx0, h: sy + 6, label: 'garden' });
    g.outdoor.push({ k: 'paving', x: four ? xm - 3 : x0, y: D, w: four ? 6 : 9, h: sy - D });
    if (P.cellar) g.outdoor.push({ k: 'ramp', x: W + 1, y: yc + 3, w: 7, h: sy - yc - 3 });
    g.outdoor.push({ k: 'hedge', x: fx0, y: -6, w: fx1 - fx0, h: 1.2 });
    street(g, fx0 - 4, fx1 + 4, sy, 5);
  }

  // Cyberpunk: conapt block, a long corridor with tiny units on both sides
  // around the stair and lifts; one floor may be a capsule hotel.
  function cyberTownhouse(P) {
    const rng = P.rng;
    const W = 2 * rng.int(23, 28), rR = rng.int(10, 12), rF = rng.int(10, 12), yc = rR, D = rR + 3 + rF;
    const x0 = Math.floor((W - 9) / 2);
    const ups = rng.int(3, 5), capsule = rng.bool(0.5);
    // One unit: entry and shower pod on the corridor, the room on the façade.
    const unit = (fl, R, door, land, num) => {
      const band = 4, cy = door === 'n' ? R.y : R.y + R.h - band, ry = door === 'n' ? R.y + band : R.y;
      const id = 'u' + num, wl = (num % 2) === 0;
      const wet = addRoom(fl, 'wetpod', wl ? R.x : R.x + R.w - 3, cy, 3, band, { unit: id });
      const ent = addRoom(fl, 'hall', wl ? R.x + 3 : R.x, cy, R.w - 3, band, { unit: id });
      addRoom(fl, 'unit', R.x, ry, R.w, R.h - band, { unit: id, num: String(num).padStart(2, '0') });
      join(fl, ent, fl.rooms[fl.rooms.length - 1]);
      link(fl, ent, wet, { kind: 'slide' });
      link(fl, land, ent, { kind: 'flat', at: 'mid' });
    };
    const row = (fl, R, door, land, k) => {
      const n = Math.max(1, Math.round(R.w / 6.5));
      let x = R.x;
      for (const p of fit(R.w, Array.from({ length: n }, () => wish('u', 6, 6)))) { unit(fl, { x, y: R.y, w: p.size, h: R.h }, door, land, ++k); x += p.size; }
      return k;
    };
    const floorCore = (fl) => {
      const c = core(fl, x0, 0, yc);
      const corr = addRoom(fl, 'corridor', 0, yc, W, 3, { unit: 'core' });
      coreLanding(fl, c, corr);
      return corr;
    };
    if (capsule) {
      const c1 = newFloor(P, 1);
      floorCore(c1);
      slice(c1, { x: 0, y: 0, w: x0, h: yc }, 'x', [wish('lockers', 4, 5, 0.3), wish('coffin', 8, 12)], { unit: 'cap' });
      slice(c1, { x: x0 + 9, y: 0, w: W - x0 - 9, h: yc }, 'x', [wish('coffin', 8, 12), wish('showers', 5, 6, 0.3)], { unit: 'cap' });
      slice(c1, { x: 0, y: yc + 3, w: W, h: rF }, 'x', [wish('coffin', 10, 14), wish('coffin', 10, 14), wish('reception', 6, 7, 0.3), wish('coffin', 10, 14, 1, true)], { unit: 'cap', rev: rng.bool() });
    }
    const t = newFloor(P, capsule ? 2 : 1);
    const land = floorCore(t);
    let k = 0;
    k = row(t, { x: 0, y: 0, w: x0, h: yc }, 's', land, k);
    k = row(t, { x: x0 + 9, y: 0, w: W - x0 - 9, h: yc }, 's', land, k);
    row(t, { x: 0, y: yc + 3, w: W, h: rF }, 'n', land, k);
    t.repeat = ups - (capsule ? 1 : 0);
    P.flats = t.rooms.filter((r) => r.type === 'unit').length;
    // Ground level: lobby behind a security post, a noodle bar, a shop, the vehicle bay.
    const g = newFloor(P, 0);
    const corr = floorCore(g);
    const lobby = addRoom(g, 'lobby', x0, yc + 3, 9, rF, { unit: 'core' });
    join(g, corr, lobby);
    exit(g, lobby, 's', { kind: 'double', len: 4 });
    const [bar, sec] = slice(g, { x: 0, y: yc + 3, w: x0, h: rF }, 'x', [wish('restaurant', 8, 12), wish('security', 5, 6, 0.3)], { unit: 'g1' });
    bar.win = { s: 'shop' };
    exit(g, bar, 's', { kind: 'double', len: 3 });
    link(g, lobby, sec);
    const [, shop] = slice(g, { x: x0 + 9, y: yc + 3, w: W - x0 - 9, h: rF }, 'x', [wish('storage', 4, 4, 0.3), wish('shop', 8, 12)], { unit: 'g2' });
    shop.win = { s: 'shop' };
    exit(g, shop, 's', { kind: 'double', len: 3 });
    const gar = addRoom(g, 'garage', 0, 0, x0, yc, { unit: 'g3' });
    exit(g, gar, 'n', { kind: 'garage', len: 6 });
    slice(g, { x: x0 + 9, y: 0, w: W - x0 - 9, h: yc }, 'x', [wish('server', 4, 5, 0.3), wish('lockers', 5, 6, 0.3), wish('storage', 4, 6)], { unit: 'g4' });
    // Sub-level: generators and the parking deck.
    if (P.cellar) {
      const b = newFloor(P, -1);
      const cb = floorCore(b);
      slice(b, { x: 0, y: 0, w: x0, h: yc }, 'x', [wish('boiler', 6, 8), wish('storage', 4, 6)], { unit: 's1' });
      slice(b, { x: x0 + 9, y: 0, w: W - x0 - 9, h: yc }, 'x', [wish('server', 5, 6), wish('vault', 4, 5, 0.3), wish('storage', 4, 6)], { unit: 's2' });
      carPark(P, b, 0, W, yc + 3, 32, cb, W);
      b.outdoor.push({ k: 'ramp', x: W + 1, y: yc + 3, w: 7, h: rF });
      g.outdoor.push({ k: 'ramp', x: W + 1, y: yc + 3, w: 7, h: rF });
    }
    g.outdoor.push({ k: 'court', x: -4, y: -8, w: W + 8, h: 8 });
    street(g, -10, W + 12, D, 5);
  }

  // Present day: detached house. Open-plan living and kitchen toward the
  // garden, hall, WC, laundry and the stair on the street side, the garage
  // alongside; bedrooms upstairs off a corridor.
  function modernCottage(P) {
    const rng = P.rng;
    const W = rng.int(20, 26), D = rng.int(18, 21), rD = rng.int(10, 11), fD = D - rD, gEast = rng.bool();
    P.gable = true;
    const g = newFloor(P, 0);
    const [liv, kit] = slice(g, { x: 0, y: 0, w: W, h: rD }, 'x', [wish('living', 10, 14), wish('kitchen', 7, 8, 0.4)], { rev: !gEast });
    join(g, liv, kit);
    liv.win = { n: 'patio' };
    const [st, hall, , lau] = slice(g, { x: 0, y: rD, w: W, h: fD }, 'x', [wish('stair', 5, 5, 0, false, { entry: 'n' }), wish('hall', 5, 6), wish('wc', 4, 4, 0), wish('laundry', 4, 5, 0.6)], { rev: !gEast });
    join(g, st, across(g, st, 'n'));
    link(g, hall, across(g, hall, 'n'), { kind: 'door', at: 'mid' });
    exit(g, hall, 's', { kind: 'front' });
    const gar = addRoom(g, 'garage', gEast ? W : -7, D - 12, 7, 12, { unit: 'garage' });
    exit(g, gar, 's', { kind: 'garage', len: 5 });
    link(g, lau, gar);
    // Upstairs.
    const up = newFloor(P, 1);
    const st1 = addRoom(up, 'stair', st.x, rD, 5, fD, { entry: 'n' });
    const corr = addRoom(up, 'corridor', 0, rD - 3, W, 3);
    join(up, st1, corr);
    slice(up, { x: 0, y: 0, w: W, h: rD - 3 }, 'x', [wish('bedroom', 8, 9), wish('bath', 4, 5, 0.3), wish('kids', 6, 7), W >= 25 ? wish('kids', 5, 6, 1, true) : null], { rev: rng.bool() });
    slice(up, { x: gEast ? 5 : 0, y: rD, w: W - 5, h: fD }, 'x', [wish('bath', 4, 5, 0.3), wish(rng.bool() ? 'kids' : 'study', 6, 8), wish('closet', 3, 4, 0.5, true)], { rev: !gEast });
    if (P.cellar && rng.bool(0.7)) {
      const b = newFloor(P, -1);
      const stb = addRoom(b, 'stair', st.x, rD, 5, fD, { entry: 'n' });
      slice(b, { x: 0, y: 0, w: W, h: rD }, 'x', [wish('tavern', 10, 14), wish('boiler', 4, 5, 0.3)], { rev: !gEast });
      join(b, stb, across(b, stb, 'n'));
      slice(b, { x: gEast ? 5 : 0, y: rD, w: W - 5, h: fD }, 'x', [wish('cellar', 5, 8), wish('storage', 4, 5)], { rev: !gEast });
    }
    // The garden: terrace behind, path and drive in front.
    const x0 = gEast ? -9 : -16, x1 = gEast ? W + 16 : W + 9, y0 = -18, y1 = D + 10;
    g.outdoor.push({ k: 'paving', x: 0, y: -6, w: W, h: 6, label: 'terrace' });
    g.outdoor.push({ k: 'paving', x: hall.x + Math.max(0, Math.floor(hall.w / 2) - 2), y: D, w: Math.min(4, hall.w), h: y1 - D });
    g.outdoor.push({ k: 'drive', x: gar.x, y: D, w: 7, h: y1 - D });
    garden(P, g, x0, y0, x1, y1, rng.int(2, 4), [box(-1, -7, W + 2, D + 8), box(gar.x, gar.y, 7, 12)]);
  }

  // Present day: luxury villa. Kitchen, dining and living room in one space
  // toward the pool, double garage, master suite upstairs with a terrace
  // over part of the ground floor; cinema and gym below.
  function modernManor(P) {
    const rng = P.rng;
    const W = rng.int(32, 38), D = rng.int(22, 25), rD = rng.int(12, 13), fD = D - rD, gEast = rng.bool();
    const g = newFloor(P, 0);
    const [kit, din, liv] = slice(g, { x: 0, y: 0, w: W, h: rD }, 'x', [wish('kitchen', 8, 9, 0.5), wish('dining', 8, 9, 0.5), wish('living', 12, 14), wish('study', 6, 7, 0.4, true)], { rev: gEast });
    join(g, kit, din);
    join(g, din, liv);
    liv.win = { n: 'patio' };
    din.win = { n: 'patio' };
    const front = slice(g, { x: 0, y: rD, w: W, h: fD }, 'x', [wish('pantry', 4, 4, 0, true), wish('laundry', 5, 5, 0.3), wish('wc', 4, 4, 0), wish('hall', 7, 9),
      wish('stair', 5, 5, 0, false, { entry: 'n' }), wish('servants', 6, 7, 0.5, true), wish('cinema', 7, 8, 0.5, true)], { rev: gEast });
    const st = front.find((r) => r.type === 'stair'), hall = front.find((r) => r.type === 'hall');
    join(g, st, across(g, st, 'n'));
    link(g, hall, across(g, hall, 'n'), { kind: 'double', len: 3, at: 'mid' });
    exit(g, hall, 's', { kind: 'double', len: 3 });
    const gar = addRoom(g, 'garage', gEast ? W : -12, D - 12, 12, 12, { unit: 'garage' });
    exit(g, gar, 's', { kind: 'garage', len: 5, at: 'start' });
    exit(g, gar, 's', { kind: 'garage', len: 5, at: 'end' });
    link(g, across(g, gar, gEast ? 'w' : 'e'), gar);
    // Upstairs, set back: the rest of the ground floor roof is a terrace.
    const cut = rng.int(8, 10);
    const cutW = st.x - cut >= 4, cutE = st.x + 5 <= W - cut - 4;
    const ux = cutW ? cut : 0, UW = cutW || cutE ? W - cut : W;
    const up = newFloor(P, 1);
    const st1 = addRoom(up, 'stair', st.x, rD, 5, fD, { entry: 'n' });
    const corr = addRoom(up, 'corridor', ux, rD - 3, UW, 3);
    join(up, st1, corr);
    const suite = slice(up, { x: ux, y: 0, w: UW, h: rD - 3 }, 'x', [wish('bedroom', 9, 10), wish('closet', 4, 4, 0), wish('bath', 5, 6, 0.3), wish('guest', 7, 8)], { rev: rng.bool() });
    link(up, suite[0], suite[1]);
    link(up, suite[1], suite[2]);
    for (const seg of [{ x: ux, y: rD, w: st.x - ux, h: fD }, { x: st.x + 5, y: rD, w: ux + UW - st.x - 5, h: fD }]) {
      if (seg.w >= 11) slice(up, seg, 'x', [wish('kids', 7, 8), wish('bath', 4, 5, 0.3), wish('gym', 6, 7, 1, true)], { rev: rng.bool() });
      else if (seg.w >= 4) slice(up, seg, 'x', [wish(seg.w >= 6 ? 'study' : 'closet', 3, 5)]);
    }
    if (UW < W) up.outdoor.push({ k: 'paving', x: ux ? 0 : UW, y: 0, w: W - UW, h: D, label: 'terrace' });
    if (P.cellar && rng.bool(0.8)) {
      const b = newFloor(P, -1);
      const stb = addRoom(b, 'stair', st.x, rD, 5, fD, { entry: 'n' });
      slice(b, { x: 0, y: 0, w: W, h: rD }, 'x', [wish('cinema', 9, 10), wish('gym', 7, 8), wish('wine', 5, 6, 0.3), wish('boiler', 4, 5, 0.3)], { rev: rng.bool() });
      join(b, stb, across(b, stb, 'n'));
      for (const seg of [{ x: 0, y: rD, w: st.x, h: fD }, { x: st.x + 5, y: rD, w: W - st.x - 5, h: fD }]) if (seg.w >= 4) slice(b, seg, 'x', [wish('storage', 4, 6), wish('laundry', 5, 6, 0.5, true)]);
    }
    // Garden: terrace, pool and deck, drive.
    const x0 = gEast ? -10 : -20, x1 = gEast ? W + 20 : W + 10, y0 = -30, y1 = D + 12;
    g.outdoor.push({ k: 'paving', x: 0, y: -7, w: W, h: 7, label: 'terrace' });
    const px = rng.int(2, Math.max(2, W - 24));
    g.outdoor.push({ k: 'paving', x: px - 2, y: -25, w: 24, h: 13 }, { k: 'pool', x: px, y: -23, w: 20, h: 8, label: 'pool' });
    for (let i = 0; i < 3; i++) g.items.push({ k: 'lounger', x: px + 3 + i * 3, y: -14.6, w: 0.7, d: 1.9, r: 2 });
    g.outdoor.push({ k: 'paving', x: hall.x + Math.max(0, Math.floor(hall.w / 2) - 2), y: D, w: 4, h: y1 - D });
    g.outdoor.push({ k: 'drive', x: gar.x, y: D, w: 12, h: y1 - D });
    garden(P, g, x0, y0, x1, y1, rng.int(3, 5), [box(-1, -8, W + 2, D + 9), box(gar.x, gar.y, 12, 12)]);
  }

  // A building in a row on a street: the stair to the flat above and the
  // cellar rises at one side from its own street door; the business on the
  // ground floor takes the rest.
  function streetBlock(P, W, D, o) {
    const rng = P.rng;
    P.party = { w: 0, e: W };
    const upper = !!o.north, col = upper || P.cellar ? 5 : 0;
    const ym = Math.max(2, Math.round(D / 2) - 9), yc = ym + 8;
    const g = newFloor(P, 0);
    if (col) {
      addRoom(g, 'storage', 0, 0, 5, ym, { unit: 'B' });
      const st = addRoom(g, 'stair', 0, ym, 5, 8, { entry: 's', unit: 'A' });
      const hall = addRoom(g, 'hall', 0, yc, 5, D - yc, { unit: 'A' });
      join(g, st, hall);
      exit(g, hall, 's', { kind: 'front' });
    }
    o.ground(g, { x: col, y: 0, w: W - col, h: D });
    if (upper) {
      const u = newFloor(P, 1);
      const st = addRoom(u, 'stair', 0, ym, 5, 8, { entry: 's', unit: 'A' });
      const corr = addRoom(u, 'corridor', 0, yc, W, 3, { unit: 'A' });
      join(u, st, corr);
      addRoom(u, 'closet', 0, 0, 5, ym, { unit: 'A' });
      const n = slice(u, { x: 5, y: 0, w: W - 5, h: yc }, 'x', o.north, { unit: 'A', rev: rng.bool() });
      const s = slice(u, { x: 0, y: yc + 3, w: W, h: D - yc - 3 }, 'x', o.south, { unit: 'A', rev: rng.bool() });
      if (o.upper) o.upper(u, n.concat(s));
    }
    if (col && P.cellar) {
      const b = newFloor(P, -1);
      const st = addRoom(b, 'stair', 0, ym, 5, 8, { entry: 's', unit: 'A' });
      const corr = addRoom(b, 'corridor', 0, yc, W, 3, { unit: 'B' });
      join(b, st, corr);
      addRoom(b, 'storage', 0, 0, 5, ym, { unit: 'B' });
      slice(b, { x: 5, y: 0, w: W - 5, h: yc }, 'x', o.cellarN, { unit: 'B' });
      slice(b, { x: 0, y: yc + 3, w: W, h: D - yc - 3 }, 'x', o.cellarS, { unit: 'B' });
    }
    g.outdoor.push({ k: 'court', x: 0, y: -7, w: W, h: 7 });
    street(g, -8, W + 8, D, 6);
  }

  // Present day: bar and restaurant, kitchen and services at the back, the
  // owners' flat (or rooms to let) upstairs, tables outside.
  function modernTavern(P) {
    const rng = P.rng;
    const W = rng.int(18, 24), D = rng.int(26, 30), bnb = rng.bool(0.4);
    let rest = null;
    streetBlock(P, W, D, {
      ground(g, R) {
        const fD = rng.int(12, 14);
        const [tap, rs] = slice(g, { x: R.x, y: R.y + R.h - fD, w: R.w, h: fD }, 'x', [wish('taproom', 6, 8, 0.5), wish('restaurant', 7, 12)], { rev: rng.bool(), unit: 'B' });
        rest = rs;
        join(g, tap, rs);
        tap.win = { s: 'shop' };
        rs.win = { s: 'shop' };
        exit(g, tap, 's', { kind: 'double', len: 3 });
        const bD = R.h - fD, kw = Math.min(R.w - 5, rng.int(9, 11)), kl = rng.bool();
        const kit = addRoom(g, 'kitchen', kl ? R.x : R.x + R.w - kw, R.y, kw, bD, { unit: 'B' });
        const sv = slice(g, { x: kl ? R.x + kw : R.x, y: R.y, w: R.w - kw, h: bD }, 'y', [wish('storage', 3, 4, 0.5), wish('staff', 4, 5, 0.5, true), wish('office', 4, 4, 0.3, true), wish('restroom', 5, 6, 0.5)], { unit: 'B' });
        const rr = sv[sv.length - 1];
        link(g, across(g, rr, 's'), rr);
        link(g, across(g, kit, 's'), kit);
        exit(g, kit, 'n', { kind: 'back' });
      },
      north: bnb ? [wish('guest', 6, 7), wish('bath', 4, 4, 0.3), wish('guest', 6, 7)] : [wish('bedroom', 7, 8), wish('bath', 4, 5, 0.3), wish('kids', 5, 6)],
      south: bnb ? [wish('guest', 6, 8), wish('bath', 4, 4, 0.3), wish('office', 4, 5, 0.5, true)] : [wish('living', 9, 12), wish('kitchen', 6, 7, 0.5)],
      upper(u, rooms) { if (!bnb) join(u, rooms.find((r) => r.type === 'kitchen'), rooms.find((r) => r.type === 'living')); },
      cellarN: [wish('wine', 5, 7), wish('storage', 4, 6)],
      cellarS: [wish('storage', 5, 8), wish('boiler', 4, 5, 0.3)],
    });
    // Tables on the pavement in front of the restaurant.
    const g = P.floors.find((f) => f.level === 0);
    if (rest) for (let x = rest.x + 1.5; x + 2.8 <= rest.x + rest.w; x += 3.2) g.items.push({ k: 'bistro', x, y: D + 2, w: 1.3, d: 0.7, r: 0 });
  }

  // Present day: shop on the street with its back room, the flat above.
  function modernShop(P) {
    const rng = P.rng;
    const W = rng.int(12, 16), D = rng.int(22, 26);
    P.gable = true;
    streetBlock(P, W, D, {
      ground(g, R) {
        const fD = rng.int(11, 13);
        const shop = addRoom(g, 'shop', R.x, R.y + R.h - fD, R.w, fD, { unit: 'B', win: { s: 'shop' } });
        exit(g, shop, 's', { kind: 'double', len: 3 });
        const [back] = slice(g, { x: R.x, y: R.y, w: R.w, h: R.h - fD }, 'x', [wish('backroom', 4, 6), wish('wc', 3, 4, 0)], { rev: rng.bool(), unit: 'B' });
        link(g, shop, back);
        exit(g, back, 'n', { kind: 'back' });
      },
      north: [wish('bedroom', 7, 8), wish('bath', 4, 5, 0.3), wish('kids', 5, 6, 1, true)],
      south: [wish('living', 8, 10), wish('kitchen', 5, 6, 0.5)],
      upper(u, rooms) { join(u, rooms.find((r) => r.type === 'kitchen'), rooms.find((r) => r.type === 'living')); },
      cellarN: [wish('storage', 4, 8)],
      cellarS: [wish('storage', 4, 6), wish('boiler', 3, 4, 0.3)],
    });
  }

  // Cyberpunk: ripperdoc clinic. Waiting room on the street, surgery bays,
  // recovery pods and the implant store off a corridor; the doc lives above.
  function cyberShop(P) {
    const rng = P.rng;
    const W = rng.int(14, 18), D = rng.int(24, 28);
    streetBlock(P, W, D, {
      ground(g, R) {
        const fD = 8;
        const [wait] = slice(g, { x: R.x, y: R.y + R.h - fD, w: R.w, h: fD }, 'x', [wish('waiting', 6, 9), wish('restroom', 3, 4, 0)], { rev: rng.bool(), unit: 'B' });
        exit(g, wait, 's', { kind: 'double', len: 3 });
        const cl = rng.bool();
        const corr = addRoom(g, 'corridor', cl ? R.x : R.x + R.w - 3, R.y, 3, R.h - fD, { unit: 'B' });
        link(g, wait, corr);
        exit(g, corr, 'n', { kind: 'back' });
        slice(g, { x: cl ? R.x + 3 : R.x, y: R.y, w: R.w - 3, h: R.h - fD }, 'y', [wish('implants', 3, 4, 0.3), wish('recovery', 5, 6, 0.5), wish('clinic', 6, 7), wish('clinic', 6, 7, 1, true), wish('workshop', 5, 6, 0.5, true)], { unit: 'B' });
      },
      north: [wish('bedroom', 7, 8), wish('vrden', 4, 5, 0.5, true), wish('bath', 4, 4, 0.3)],
      south: [wish('living', 8, 10), wish('kitchen', 5, 6, 0.5), wish('server', 3, 4, 0.3, true)],
      upper(u, rooms) { join(u, rooms.find((r) => r.type === 'kitchen'), rooms.find((r) => r.type === 'living')); },
      cellarN: [wish('boiler', 5, 6), wish('vault', 4, 5, 0.3), wish('storage', 4, 6)],
      cellarS: [wish('implants', 5, 8), wish('server', 3, 4, 0.3)],
    });
  }

  // Cyberpunk: nightclub. Security post and cloakroom at the door, the bar
  // and the dance floor with the DJ booth, VIP lounge, back exit; maybe a
  // capsule hotel upstairs.
  function cyberTavern(P) {
    const rng = P.rng;
    const W = 2 * rng.int(18, 22), D = rng.int(28, 32), hotel = rng.bool(0.55);
    streetBlock(P, W, D, {
      ground(g, R) {
        const fD = 7, rD = 7;
        const front = slice(g, { x: R.x, y: R.y + R.h - fD, w: R.w, h: fD }, 'x', [wish('security', 5, 6, 0.3), wish('checkpoint', 8, 10), wish('cloak', 5, 6, 0.3), wish('restroom', 6, 8, 0.5)], { rev: rng.bool(), unit: 'B' });
        const chk = front.find((r) => r.type === 'checkpoint');
        exit(g, chk, 's', { kind: 'double', len: 4 });
        const back = slice(g, { x: R.x, y: R.y, w: R.w, h: rD }, 'x', [wish('vip', 9, 11), wish('storage', 4, 5, 0.3), wish('corridor', 3, 3, 0), wish('office', 4, 5, 0.3), wish('server', 3, 4, 0.2, true)], { rev: rng.bool(), unit: 'B' });
        const bc = back.find((r) => r.type === 'corridor');
        exit(g, bc, 'n', { kind: 'back' });
        const mid = slice(g, { x: R.x, y: R.y + rD, w: R.w, h: R.h - fD - rD }, 'x', [wish('taproom', 7, 8, 0.3), wish('dancefloor', 14, 20)], { rev: rng.bool(), unit: 'B' });
        join(g, mid[0], mid[1]);
        link(g, chk, across(g, chk, 'n'), { kind: 'double', len: 3, at: 'mid' });
        link(g, across(g, bc, 's'), bc);
      },
      north: hotel ? [wish('lockers', 4, 5, 0.2), wish('coffin', 10, 16), wish('showers', 5, 6, 0.3)] : null,
      south: [wish('coffin', 10, 14), wish('coffin', 10, 14, 1, true), wish('office', 5, 6, 0.3)],
      cellarN: [wish('boiler', 6, 8), wish('storage', 5, 8), wish('server', 4, 5, 0.3)],
      cellarS: [wish('storage', 6, 10), wish('vault', 4, 5, 0.3)],
    });
  }

  // Cyberpunk: hab unit in a megablock, off the block corridor.
  function cyberCottage(P) {
    const rng = P.rng;
    const W = rng.int(12, 16), D = rng.int(10, 13), band = 5, rev = rng.bool();
    P.party = { w: 0, e: W };
    P.levelBase = rng.int(12, 140);
    const g = newFloor(P, 0);
    const [hall] = slice(g, { x: 0, y: D - band, w: W, h: band }, 'x', [wish('hall', 4, 4, 0.3), wish('bath', 4, 4, 0), wish('vrden', 4, 5, 1, true)], { rev, unit: 'H' });
    const [liv, bed] = slice(g, { x: 0, y: 0, w: W, h: D - band }, 'x', [wish('living', 6, 8, 1, false, { kitchenette: true }), wish('bedroom', 5, 6, 0.5)], { rev, unit: 'H' });
    exit(g, hall, 's', { kind: 'front' });
    link(g, hall, liv, { at: 'mid' });
    link(g, liv, bed, { kind: 'slide' });
    g.outdoor.push({ k: 'hallway', x: -8, y: D, w: W + 16, h: 5, label: 'hallway' });
  }

  // Cyberpunk: corporate penthouse at the top of a tower. A private lift into
  // a security checkpoint, a glass-walled open plan, panic room and server
  // closet; the master suite above, with the landing pad on the terrace,
  // and a private spa on the level below.
  function cyberManor(P) {
    const rng = P.rng;
    const W = 2 * rng.int(18, 21), D = rng.int(26, 30), rD = 10, tw = 20, UW = W - tw;
    const x0 = rng.int(4, Math.max(4, UW - 11));
    P.levelBase = rng.int(60, 140);
    const g = newFloor(P, 0);
    const c = core(g, x0, 0, rD);
    const chk = addRoom(g, 'checkpoint', x0, rD, 9, 4, { unit: 'core' });
    coreLanding(g, c, chk);
    const cl = x0 >= 3 ? addRoom(g, 'corridor', 0, rD, x0, 4) : null;
    const cr = addRoom(g, 'corridor', x0 + 9, rD, W - x0 - 9, 4);
    link(g, chk, cl, { at: 'mid' });
    link(g, chk, cr, { at: 'mid' });
    if (x0 >= 3) slice(g, { x: 0, y: 0, w: x0, h: rD }, 'x', [wish('server', 3, 4, 0.3, true), wish('vault', 3, 5)]);
    slice(g, { x: x0 + 9, y: 0, w: W - x0 - 9, h: rD }, 'x', [wish('security', 5, 6, 0.3), wish('office', 7, 9), wish('servants', 6, 7, 0.5), wish('gym', 6, 8, 1, true)], { rev: rng.bool() });
    const open = slice(g, { x: 0, y: rD + 4, w: W, h: D - rD - 4 }, 'x', [wish('kitchen', 8, 9, 0.5), wish('dining', 8, 9, 0.5), wish('living', 12, 16), wish('library', 7, 8, 0.4, true)], { rev: rng.bool() });
    for (let i = 0; i + 1 < open.length; i++) if (open[i + 1].type !== 'library') join(g, open[i], open[i + 1]);
    for (const r of open) r.glass = true;
    link(g, chk, across(g, chk, 's'), { kind: 'double', len: 4, at: 'mid' });
    // Upper level, set back from the terrace and its landing pad.
    const u = newFloor(P, 1);
    const cu = core(u, x0, 0, rD);
    const land = addRoom(u, 'corridor', 0, rD, UW, 3);
    coreLanding(u, cu, land);
    if (x0 >= 3) addRoom(u, 'closet', 0, 0, x0, rD);
    if (UW - x0 - 9 >= 3) addRoom(u, UW - x0 - 9 >= 6 ? 'clinic' : 'server', x0 + 9, 0, UW - x0 - 9, rD);
    const suite = slice(u, { x: 0, y: rD + 3, w: UW, h: D - rD - 3 }, 'x', [wish('bedroom', 9, 10), wish('closet', 4, 4, 0), wish('bath', 5, 6, 0.3), wish('guest', 7, 8, 1, true)], { rev: rng.bool() });
    link(u, suite[0], suite[1]);
    link(u, suite[1], suite[2]);
    for (const r of suite) if (r.type === 'bedroom' || r.type === 'guest') r.glass = true;
    exit(u, land, 'e', { kind: 'slide', len: 3 });
    u.outdoor.push({ k: 'paving', x: UW, y: 0, w: tw, h: D, label: 'terrace' }, { k: 'pad', x: UW + 2, y: Math.round(D / 2) - 8, w: 16, h: 16, label: 'pad' });
    if (P.cellar && rng.bool(0.6)) {
      const b = newFloor(P, -1);
      const cb = core(b, x0, 0, rD);
      const corr = addRoom(b, 'corridor', 0, rD, W, 3, { unit: 'core' });
      coreLanding(b, cb, corr);
      if (x0 >= 3) addRoom(b, 'boiler', 0, 0, x0, rD);
      slice(b, { x: x0 + 9, y: 0, w: W - x0 - 9, h: rD }, 'x', [wish('server', 5, 6), wish('storage', 4, 6), wish('vault', 4, 5, 0.3, true)]);
      // A private spa below: indoor pool, home cinema, VR den.
      slice(b, { x: 0, y: rD + 3, w: W, h: D - rD - 3 }, 'x', [wish('pool', 16, 22), wish('cinema', 8, 10, 0.5), wish('vrden', 6, 8, 0.5, true)], { rev: rng.bool() });
    }
  }

  const PLANS = {
    modern: { cottage: modernCottage, townhouse: modernTownhouse, tavern: modernTavern, shop: modernShop, manor: modernManor },
    cyber: { cottage: cyberCottage, townhouse: cyberTownhouse, tavern: cyberTavern, shop: cyberShop, manor: cyberManor },
  };

  // ------------------------------------------------------------ assembly

  function generateAlt(seed, opts, type) {
    const setting = Carto.Setting.current;
    const P = { rng: new Carto.Random(seed).fork('plan'), setting, type, cellar: !!opts.cellar, floors: [], party: null, gable: false, levelBase: 0, flats: 0 };
    PLANS[setting][type](P);
    const floors = [];
    for (const fl of P.floors) {
      const own = owners(fl);
      for (const L of fl.links) placeLink(fl, L, P.rng);
      for (const X of fl.exits) placeExit(fl, X, own, P.rng);
      connectAll(fl, P.rng);
      placeWindows(P, fl, own);
      if (opts.furniture !== false) {
        const E = edgeMap(fl);
        for (const r of fl.rooms) furnishRoom(fl, r, E, P.rng, setting);
      }
      const n = fl.repeat || 1;
      delete fl.links; delete fl.exits; delete fl.repeat; delete fl.cellarN;
      if (n > 1) fl.span = [fl.level, fl.level + n - 1];
      floors.push(fl);
      // Identical floors above a typical one.
      for (let i = 1; i < n; i++) {
        const c = JSON.parse(JSON.stringify(fl));
        delete c.span;
        floors.push(Object.assign(c, { level: fl.level + i, copy: fl.level }));
      }
    }
    floors.sort((a, b) => a.level - b.level);
    const bounds = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    const grow = (x, y, w, h) => { bounds.x0 = Math.min(bounds.x0, x); bounds.y0 = Math.min(bounds.y0, y); bounds.x1 = Math.max(bounds.x1, x + w); bounds.y1 = Math.max(bounds.y1, y + h); };
    for (const fl of floors) {
      for (const r of fl.rooms) grow(r.x, r.y, r.w, r.h);
      for (const o of fl.outdoor) grow(o.x, o.y, o.w, o.h);
    }
    if (P.party) { bounds.x0 = Math.min(bounds.x0, P.party.w - 6); bounds.x1 = Math.max(bounds.x1, P.party.e + 6); }
    for (const k of ['x0', 'y0']) bounds[k] = Math.floor(bounds[k] - 1);
    for (const k of ['x1', 'y1']) bounds[k] = Math.ceil(bounds[k] + 1);
    const name = altName(new Carto.Random(seed).fork('name'), type, setting);
    return { seed, type, setting, alt: true, foot: [], blocks: [], stairs: [], floors, bounds, name, party: P.party, gable: P.gable, levelBase: P.levelBase, flats: P.flats };
  }

  function altFloorName(m, fl) {
    if (fl.span) return t('dwelling.typical', { a: fl.span[0], b: fl.span[1] });
    if (m.levelBase) return t('dwelling.level', { n: m.levelBase + fl.level });
    return t('floor.' + Math.max(-1, Math.min(6, fl.level)));
  }
  const netArea = (r) => Math.max(0, (r.w * U - 0.15) * (r.h * U - 0.15));
  const fmtArea = (a, digits = 1) => {
    const s = a.toFixed(digits);
    return (I18n.lang === 'it' ? s.replace('.', ',') : s) + ' m²';
  };

  // ------------------------------------------------------------ drawing

  // Diagonal hatching clipped to a rectangle (pixels).
  function hatch(batch, x0, y0, x1, y1, step) {
    for (let c = x0 + y0 + step; c < x1 + y1; c += step) {
      const a = { x: Math.max(x0, c - y1), y: 0 }, e = { x: Math.min(x1, c - y0), y: 0 };
      a.y = c - a.x; e.y = c - e.x;
      if (e.x > a.x) batch.line(a, e);
    }
  }

  // Local frame of a furniture piece in plan metres: (u, v) -> {x, y}.
  function frameOf(it) {
    const x = it.x * U, y = it.y * U, w = it.w, d = it.d;
    switch (it.r) {
      case 0: return (u, v) => ({ x: x + u, y: y + v });
      case 2: return (u, v) => ({ x: x + w - u, y: y + d - v });
      case 1: return (u, v) => ({ x: x + d - v, y: y + u });
      default: return (u, v) => ({ x: x + v, y: y + w - u });
    }
  }

  // Stair flights in the frame of the stair: a runs from the landing side
  // (entry) to the far end, c across.
  function stairFrame(r) {
    const e = r.entry || 's';
    const L = e === 'n' || e === 's' ? r.h : r.w, Wd = e === 'n' || e === 's' ? r.w : r.h;
    const f = e === 's' ? (a, c) => ({ x: r.x + c, y: r.y + r.h - a }) : e === 'n' ? (a, c) => ({ x: r.x + r.w - c, y: r.y + a })
      : e === 'w' ? (a, c) => ({ x: r.x + a, y: r.y + c }) : (a, c) => ({ x: r.x + r.w - a, y: r.y + r.h - c });
    return { L, Wd, f, land: Math.min(2.6, L * 0.32) };
  }

  function drawStair(r, sb, thin, P, up, down) {
    const { L, Wd, f, land } = stairFrame(r);
    const q = (a, c) => { const p = f(a, c); return { x: P(p.x), y: P(p.y) }; };
    const i = 0.15;
    sb.poly([q(i, i), q(L - i, i), q(L - i, Wd - i), q(i, Wd - i)]);
    const run = L - land;
    thin.line(q(i, Wd / 2), q(run, Wd / 2));
    for (let a = 0.56; a < run - 0.05; a += 0.56) { thin.line(q(a, i), q(a, Wd / 2 - 0.1)); thin.line(q(a, Wd / 2 + 0.1), q(a, Wd - i)); }
    thin.line(q(run, i), q(run, Wd - i));
    // Walking line: up the first flight, across the half landing, down the other.
    const c1 = Wd / 4, c2 = (3 * Wd) / 4;
    const path = [q(0.5, c1), q(run + land / 2, c1), q(run + land / 2, c2), q(0.7, c2)];
    if (up || down) {
      thin.poly(path, false);
      const tip = path[3], prev = path[2];
      const dir = G.norm(G.sub(tip, prev)), nrm = G.perp(dir);
      thin.poly([G.add(G.sub(tip, G.scale(dir, 4)), G.scale(nrm, 2.5)), tip, G.sub(G.sub(tip, G.scale(dir, 4)), G.scale(nrm, 2.5))], false);
    }
  }

  function drawOutdoor(svg, fl, pal, P, labels) {
    const B = {};
    const bat = (k) => B[k] || (B[k] = new Svg.Batch());
    const rect = (o, inset = 0) => G.rect(P(o.x + o.w / 2), P(o.y + o.h / 2), P(o.w) - inset * 2, P(o.h) - inset * 2);
    for (const o of fl.outdoor) {
      switch (o.k) {
        case 'lawn': bat('lawn').poly(rect(o)); break;
        case 'hedge': bat('hedge').poly(rect(o)); break;
        case 'tree': bat('tree').circle(P(o.x + o.w / 2), P(o.y + o.h / 2), P(o.w / 2)); bat('trunk').circle(P(o.x + o.w / 2), P(o.y + o.h / 2), P(o.w / 8)); break;
        case 'road': {
          bat('road').poly(rect(o));
          const yc = P(o.y + o.h / 2);
          bat('dash').line({ x: P(o.x), y: yc }, { x: P(o.x + o.w), y: yc });
          break;
        }
        case 'sidewalk': case 'court': case 'paving': case 'drive': case 'hallway': {
          bat(o.k === 'hallway' ? 'hall' : 'pave').poly(rect(o));
          if (o.k === 'paving') for (let x = o.x + 2; x < o.x + o.w; x += 2) bat('joint').line({ x: P(x), y: P(o.y) }, { x: P(x), y: P(o.y + o.h) });
          if (o.k === 'paving') for (let y = o.y + 2; y < o.y + o.h; y += 2) bat('joint').line({ x: P(o.x), y: P(y) }, { x: P(o.x + o.w), y: P(y) });
          break;
        }
        case 'ramp': {
          bat('pave').poly(rect(o));
          for (let y = o.y + 3; y < o.y + o.h - 1; y += 3) bat('joint').poly([{ x: P(o.x + 1), y: P(y + 1) }, { x: P(o.x + o.w / 2), y: P(y) }, { x: P(o.x + o.w - 1), y: P(y + 1) }], false);
          break;
        }
        case 'pool': bat('pool').poly(rect(o)); bat('poolIn').poly(rect(o, 3)); break;
        case 'pad': {
          const cx = P(o.x + o.w / 2), cy = P(o.y + o.h / 2), r = P(o.w / 2);
          bat('pad').circle(cx, cy, r);
          bat('padIn').circle(cx, cy, r * 0.82);
          const h = r * 0.35;
          bat('padH').line({ x: cx - h * 0.6, y: cy - h }, { x: cx - h * 0.6, y: cy + h });
          bat('padH').line({ x: cx + h * 0.6, y: cy - h }, { x: cx + h * 0.6, y: cy + h });
          bat('padH').line({ x: cx - h * 0.6, y: cy }, { x: cx + h * 0.6, y: cy });
          break;
        }
      }
      if (o.label) labels.push(o);
    }
    const draw = (k, a) => { if (B[k]) svg.path(B[k].toString(), a); };
    draw('lawn', { fill: pal.green });
    draw('road', { fill: pal.road, stroke: pal.inkSoft, strokeWidth: 0.6 });
    draw('dash', { stroke: pal.inkSoft, strokeWidth: 1, strokeDasharray: '10 8', fill: 'none' });
    draw('pave', { fill: pal.paperShade, stroke: pal.inkSoft, strokeWidth: 0.6 });
    draw('hall', { fill: pal.floor, stroke: pal.inkSoft, strokeWidth: 0.6 });
    draw('joint', { stroke: pal.grid, strokeWidth: 0.6, fill: 'none' });
    draw('pool', { fill: pal.water, stroke: pal.waterInk, strokeWidth: 1.2 });
    draw('poolIn', { fill: 'none', stroke: pal.waterInk, strokeWidth: 0.5, opacity: 0.6 });
    draw('pad', { fill: pal.paperShade, stroke: pal.accent, strokeWidth: 1.6 });
    draw('padIn', { fill: 'none', stroke: pal.accent, strokeWidth: 0.7, strokeDasharray: '4 3' });
    draw('padH', { stroke: pal.accent, strokeWidth: 2.4, fill: 'none', strokeLinecap: 'square' });
    draw('hedge', { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.6 });
    draw('tree', { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.8, opacity: 0.92 });
    draw('trunk', { fill: pal.greenInk, opacity: 0.5 });
  }

  function renderAlt(m, o) {
    const pal = o.palette, cyber = m.setting === 'cyber';
    const P = (v) => v * PXU;
    let shown = m.floors.filter((f) => f.copy == null);
    if (o.preview) shown = shown.filter((f) => f.level === 0);
    const order = shown.slice().sort((a, c) => (a.level < 0 ? 99 : a.level) - (c.level < 0 ? 99 : c.level));
    // Each plan framed on its own building and grounds, in a grid of two columns.
    const fbs = order.map((fl) => {
      const fb = footBox(fl);
      const q = { x0: fb.x0, y0: fb.y0, x1: fb.x1, y1: fb.y1 };
      for (const e of fl.outdoor) { q.x0 = Math.min(q.x0, e.x); q.y0 = Math.min(q.y0, e.y); q.x1 = Math.max(q.x1, e.x + e.w); q.y1 = Math.max(q.y1, e.y + e.h); }
      if (m.party && fl.level >= 0) { q.x0 = Math.min(q.x0, fb.x0 - 6); q.x1 = Math.max(q.x1, fb.x1 + 6); }
      return { x0: q.x0 - 1, y0: q.y0 - 1, x1: q.x1 + 1, y1: q.y1 + 1 };
    });
    const n = order.length, cols = Math.min(2, n);
    const rows = Math.ceil(n / cols);
    const gap = 44, pad = 32, head = o.preview ? 24 : 80, lab = 32;
    const colW = [], rowH = [];
    fbs.forEach((q, i) => {
      colW[i % cols] = Math.max(colW[i % cols] || 0, P(q.x1 - q.x0));
      rowH[Math.floor(i / cols)] = Math.max(rowH[Math.floor(i / cols)] || 0, P(q.y1 - q.y0));
    });
    const colX = colW.map((_, c) => pad + colW.slice(0, c).reduce((a, v) => a + v + gap, 0));
    const rowY = rowH.map((_, r) => head + rowH.slice(0, r).reduce((a, v) => a + v + lab + gap * 0.6, 0));
    const W = Math.max(pad * 2 + colW.reduce((a, v) => a + v, 0) + (cols - 1) * gap, o.preview ? 0 : 420);
    const H = rowY[rows - 1] + rowH[rows - 1] + lab + pad * 1.6;
    const svg = new Svg(W, H);
    svg.rect(0, 0, W, H, { fill: pal.paper });
    const furnInk = cyber ? pal.accent : pal.inkSoft;
    const cw = pal.fontLabel ? (/mono/.test(pal.fontLabel) ? 0.6 : 0.53) : 0.48;

    order.forEach((fl, idx) => {
      const col = idx % cols, row = Math.floor(idx / cols), q = fbs[idx];
      const cx0 = colX[col] + (colW[col] - P(q.x1 - q.x0)) / 2;
      const ox = cx0 - P(q.x0), oy = rowY[row] + lab - P(q.y0);
      svg.open({ transform: 'translate(' + Svg.num(ox) + ' ' + Svg.num(oy) + ')' });
      const outLabels = [];
      drawOutdoor(svg, fl, pal, P, outLabels);
      const fb = footBox(fl);
      // Buildings next door.
      if (m.party && fl.level >= 0) {
        const nb = new Svg.Batch(), hb = new Svg.Batch();
        for (const [x0, x1] of [[fb.x0 - 6, fb.x0], [fb.x1, fb.x1 + 6]]) {
          nb.poly(G.rect(P((x0 + x1) / 2), P((fb.y0 + fb.y1) / 2), P(x1 - x0), P(fb.y1 - fb.y0)));
          hatch(hb, P(x0), P(fb.y0), P(x1), P(fb.y1), 6);
        }
        svg.path(nb.toString(), { fill: pal.paperShade });
        svg.path(hb.toString(), { stroke: pal.hatch, strokeWidth: 0.5, fill: 'none', opacity: 0.6 });
      }
      // Floors: tiles in wet rooms, bare concrete in service rooms.
      const flo = new Svg.Batch(), bare = new Svg.Batch(), tiles = new Svg.Batch(), shafts = new Svg.Batch();
      for (const r of fl.rooms) {
        const poly = G.rect(P(r.x + r.w / 2), P(r.y + r.h / 2), P(r.w), P(r.h));
        (BARE[r.type] || fl.level < 0 ? bare : flo).poly(poly);
        if (TILES[r.type]) {
          for (let x = r.x + 1; x < r.x + r.w; x++) tiles.line({ x: P(x), y: P(r.y) }, { x: P(x), y: P(r.y + r.h) });
          for (let y = r.y + 1; y < r.y + r.h; y++) tiles.line({ x: P(r.x), y: P(y) }, { x: P(r.x + r.w), y: P(y) });
        }
        if (r.type === 'shaft') hatch(shafts, P(r.x), P(r.y), P(r.x + r.w), P(r.y + r.h), 5);
      }
      svg.path(flo.toString(), { fill: pal.floor });
      svg.path(bare.toString(), { fill: pal.paperShade });
      svg.path(tiles.toString(), { stroke: pal.grid, strokeWidth: 0.6, fill: 'none' });
      svg.path(shafts.toString(), { stroke: pal.inkSoft, strokeWidth: 0.5, fill: 'none' });

      // Furniture.
      const fb2 = {};
      const fbat = (k) => fb2[k] || (fb2[k] = new Svg.Batch());
      const CLS = { rug: 'rug', water: 'water', leaf: 'leaf', car: 'car', linen: 'top', screen: 'screen', glass: 'line' };
      for (const it of fl.items) {
        const f = frameOf(it);
        const pt = (u, v) => { const p = f(u, v); return { x: p.x * PXM, y: p.y * PXM }; };
        for (const p of KIT[it.k][2](it.w, it.d, it.v)) {
          if (p[0] === 'l') fbat('line').line(pt(p[1], p[2]), pt(p[3], p[4]));
          else if (p[0] === 'o') { const c = pt(p[1], p[2]); fbat('line').circle(c.x, c.y, p[3] * PXM); }
          else if (p[0] === 'r') fbat('line').poly([pt(p[1], p[2]), pt(p[3], p[2]), pt(p[3], p[4]), pt(p[1], p[4])]);
          else if (p[0] === 'c') { const c = pt(p[1], p[2]); fbat(CLS[p[6]] || 'base').circle(c.x, c.y, p[3] * PXM); }
          else fbat(CLS[p[6]] || 'base').poly([pt(p[0], p[1]), pt(p[2], p[1]), pt(p[2], p[3]), pt(p[0], p[3])]);
        }
      }
      const fdraw = (k, a) => { if (fb2[k]) svg.path(fb2[k].toString(), a); };
      fdraw('rug', { fill: pal.accent, opacity: 0.16, stroke: pal.accent, strokeWidth: 0.6 });
      fdraw('base', { fill: pal.floor, stroke: furnInk, strokeWidth: 0.7, strokeLinejoin: 'round' });
      fdraw('top', { fill: pal.paper, stroke: furnInk, strokeWidth: 0.6 });
      fdraw('car', { fill: pal.building, stroke: furnInk, strokeWidth: 0.7 });
      fdraw('leaf', { fill: pal.tree, stroke: pal.greenInk, strokeWidth: 0.6 });
      fdraw('water', { fill: pal.water, stroke: pal.waterInk, strokeWidth: 0.8 });
      fdraw('screen', { fill: furnInk, stroke: furnInk, strokeWidth: 0.5 });
      fdraw('line', { fill: 'none', stroke: furnInk, strokeWidth: 0.5 });

      // Stairs, lifts.
      const top = fl.level === Math.max(...m.floors.map((f) => f.level)), bottom = fl.level === Math.min(...m.floors.map((f) => f.level));
      const sb = new Svg.Batch(), thin = new Svg.Batch(), lifts = new Svg.Batch();
      const stairLabels = [];
      for (const r of fl.rooms) {
        if (r.type === 'stair') {
          drawStair(r, sb, thin, P, !top, !bottom);
          const lbl = (top ? '' : t('dwelling.up')) + (top || bottom ? '' : ' / ') + (bottom ? '' : t('dwelling.down'));
          const { f } = stairFrame(r);
          const p = f(1.2, (r.entry === 'n' || r.entry === 's' ? r.w : r.h) / 2);
          if (lbl) stairLabels.push([P(p.x), P(p.y), lbl]);
        }
        if (r.type === 'lift') {
          const i = 0.35, x0 = P(r.x + i), y0 = P(r.y + i), x1 = P(r.x + r.w - i), y1 = P(r.y + r.h - i);
          lifts.poly([{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }]);
          lifts.line({ x: x0, y: y0 }, { x: x1, y: y1 });
          lifts.line({ x: x1, y: y0 }, { x: x0, y: y1 });
        }
      }
      svg.path(sb.toString(), { fill: pal.floor, stroke: pal.ink, strokeWidth: 0.8 });
      svg.path(thin.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.55 });
      svg.path(lifts.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.6 });

      // Walls: solid, as thick as they are; windows and doors set in them.
      const E = edgeMap(fl), runs = wallRuns(E);
      const ends = new Set();
      for (const r of runs) { const lk = (r.v ? 'v' : 'h') + r.line; ends.add(lk + '|' + r.a0 + '|s'); ends.add(lk + '|' + r.a1 + '|e'); }
      const walls = new Svg.Batch(), wins = new Svg.Batch(), glass = new Svg.Batch();
      const leaves = new Svg.Batch(), swings = new Svg.Batch(), dashed = new Svg.Batch();
      const span = (r, a0, a1, half) => (r.v ? [P(r.line) - half, P(a0), P(r.line) + half, P(a1)] : [P(a0), P(r.line) - half, P(a1), P(r.line) + half]);
      const rectPx = ([x0, y0, x1, y1]) => [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
      const doneOps = new Set();
      for (const r of runs) {
        if (r.kind === 'open') continue;
        const th = TH[r.cls] / U, half = P(th) / 2, lk = (r.v ? 'v' : 'h') + r.line;
        if (r.kind === 'wall') {
          // Square ends where the wall stops or turns, flush against openings.
          const e0 = ends.has(lk + '|' + r.a0 + '|e') ? 0 : th / 2, e1 = ends.has(lk + '|' + r.a1 + '|s') ? 0 : th / 2;
          walls.poly(rectPx(span(r, r.a0 - e0, r.a1 + e1, half)));
          continue;
        }
        if (doneOps.has(r.op)) continue;
        doneOps.add(r.op);
        const op = r.op, a0 = op.vertical ? op.y : op.x, a1 = a0 + op.len;
        const line = op.vertical ? op.x : op.y;
        const pt = (a, off = 0) => (op.vertical ? { x: P(line) + off, y: P(a) } : { x: P(a), y: P(line) + off });
        if (r.kind === 'win') {
          wins.poly(rectPx(span(r, a0, a1, half)));
          if (op.kind === 'win') { glass.line(pt(a0, -half / 3), pt(a1, -half / 3)); glass.line(pt(a0, half / 3), pt(a1, half / 3)); }
          else {
            glass.line(pt(a0), pt(a1));
            const step = op.kind === 'patio' ? op.len / 2 : 3;
            for (let a = a0 + step; a < a1 - 0.5; a += step) glass.line(pt(a, -half), pt(a, half));
          }
          continue;
        }
        // Doors.
        const into = op.vertical ? { x: op.dir, y: 0 } : { x: 0, y: op.dir };
        const leaf = (h, j) => {
          const hp = pt(h), jp = pt(j), rad = Math.abs(jp.x - hp.x) + Math.abs(jp.y - hp.y);
          const tip = G.add(hp, G.scale(into, rad));
          leaves.line(hp, tip);
          const sweep = G.cross(G.sub(tip, hp), G.sub(jp, hp)) > 0 ? 1 : 0;
          swings.add('M' + Svg.num(tip.x) + ' ' + Svg.num(tip.y) + 'A' + Svg.num(rad) + ' ' + Svg.num(rad) + ' 0 0 ' + sweep + ' ' + Svg.num(jp.x) + ' ' + Svg.num(jp.y));
        };
        if (op.kind === 'double') { const mid = (a0 + a1) / 2; leaf(a0, mid); leaf(a1, mid); }
        else if (HINGED[op.kind]) { if (op.hinge) leaf(a1, a0); else leaf(a0, a1); }
        else if (op.kind === 'garage') dashed.line(pt(a0), pt(a1));
        else if (op.kind === 'slide' || op.kind === 'lift') {
          const m2 = (a0 + a1) / 2, o2 = half * 0.45;
          leaves.line(pt(a0 + 0.1, -o2), pt(m2 + 0.3, -o2));
          leaves.line(pt(m2 - 0.3, o2), pt(a1 - 0.1, o2));
        }
      }
      svg.path(wins.toString(), { fill: pal.paper, stroke: pal.ink, strokeWidth: 0.6 });
      svg.path(glass.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.5 });
      svg.path(walls.toString(), { fill: pal.ink });
      svg.path(swings.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.5 });
      svg.path(leaves.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 1.3, strokeLinecap: 'round' });
      svg.path(dashed.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 1, strokeDasharray: '3 2' });

      // Names and areas.
      if (o.labels !== false && !o.preview) {
        for (const [x, y, s] of stairLabels) Draw.label(svg, x, y, s, 7, pal, { haloColor: pal.floor });
        // Furniture footprints (pixels), so that names sit beside a table
        // rather than on it.
        const solids = fl.items.filter((it) => it.k !== 'rug' && it.k !== 'dance' && it.k !== 'pool').map((it) => {
          const bw = (it.r % 2 ? it.d : it.w) / U, bh = (it.r % 2 ? it.w : it.d) / U;
          return { x0: P(it.x), y0: P(it.y), x1: P(it.x + bw), y1: P(it.y + bh) };
        });
        const cover = (b) => {
          let a = 0;
          for (const s2 of solids) a += Math.max(0, Math.min(b.x1, s2.x1) - Math.max(b.x0, s2.x0)) * Math.max(0, Math.min(b.y1, s2.y1) - Math.max(b.y0, s2.y0));
          return a;
        };
        for (const r of fl.rooms) {
          // Shower pods inside the conapt units are plain enough without a name.
          if (r.type === 'stair' || r.type === 'lift' || r.type === 'shaft' || r.type === 'wetpod') continue;
          const name = r.num || t('room.' + r.type);
          const wpx = P(r.w) - 6, hpx = P(r.h) - 4;
          // Lengthwise in tall narrow rooms when the name does not fit across.
          const fitIn = (wpx, hpx) => {
            for (const sz of [r.num ? 9 : 8.5, 7.5, 6.5]) {
              const ls = name.length * sz * cw <= wpx ? [name] : Draw.wrap(name, Math.max(3, Math.floor(wpx / (sz * cw))));
              if (ls.every((l) => l.length * sz * cw <= wpx) && ls.length * sz * 1.1 <= hpx) return { size: sz, lines: ls };
            }
            return null;
          };
          let fit2 = fitIn(wpx, hpx), rot = false;
          if ((!fit2 || fit2.size < 7.5) && hpx > wpx * 1.4) { const f2 = fitIn(hpx, wpx); if (f2 && (!fit2 || f2.size > fit2.size)) { fit2 = f2; rot = true; } }
          if (!fit2) continue;
          const { size, lines } = fit2;
          const along = rot ? hpx : wpx, across = rot ? wpx : hpx;
          const area = r.type === 'cellar' && r.num ? '' : fmtArea(netArea(r));
          const showArea = area && across >= lines.length * size * 1.1 + 9 && area.length * 6.5 * cw <= along;
          let cx = P(r.x + r.w / 2), cy = P(r.y + r.h / 2);
          // Size of the text block; slide it off the furniture when there is room.
          const bl = Math.max(...lines.map((l) => l.length * size * cw), showArea ? area.length * 6.5 * cw : 0) + 2;
          const bt = lines.length * size * 1.05 + (showArea ? 9 : 0) + 2;
          const bw = rot ? bt : bl, bh = rot ? bl : bt;
          const rx0 = P(r.x) + 3 + bw / 2, rx1 = P(r.x + r.w) - 3 - bw / 2, ry0 = P(r.y) + 2 + bh / 2, ry1 = P(r.y + r.h) - 2 - bh / 2;
          const blk = (x, y) => ({ x0: x - bw / 2, y0: y - bh / 2, x1: x + bw / 2, y1: y + bh / 2 });
          let best = cover(blk(cx, cy));
          if (best > 0 && rx1 >= rx0 && ry1 >= ry0) {
            const c0 = { x: cx, y: cy };
            for (let y = ry0; y <= ry1 + 1e-6; y += 4) for (let x = rx0; x <= rx1 + 1e-6; x += 4) {
              const sc = cover(blk(x, y)) + Math.hypot(x - c0.x, y - c0.y) * 2.5;
              if (sc < best - 1e-6) { best = sc; cx = x; cy = y; }
            }
          }
          const halo = BARE[r.type] || fl.level < 0 ? pal.paperShade : pal.floor;
          const off0 = -((lines.length - 1) * size * 1.05) / 2 - (showArea ? 4 : 0);
          const at = (d) => (rot ? { x: cx + d, y: cy } : { x: cx, y: cy + d });
          lines.forEach((ln, i) => { const p = at(off0 + i * size * 1.05); Draw.label(svg, p.x, p.y, ln, size, pal, { haloColor: halo, haloWidth: 0.5, title: !!r.num, rotate: rot ? -90 : 0 }); });
          if (showArea) { const p = at(off0 + (lines.length - 1) * size * 1.05 + size * 0.6 + 4.5); Draw.label(svg, p.x, p.y, area, 6.5, pal, { haloColor: halo, haloWidth: 0.5, opacity: 0.75, rotate: rot ? -90 : 0 }); }
        }
        for (const l of outLabels) {
          const s = t('dwelling.out.' + l.label);
          // Lawns, and terraces with a pad or a pool on them, named in a corner.
          const big = l.k === 'lawn' || fl.outdoor.some((e) => e !== l && (e.k === 'pad' || e.k === 'pool') && e.x >= l.x && e.y >= l.y && e.x + e.w <= l.x + l.w && e.y + e.h <= l.y + l.h);
          const x = big ? P(l.x + 3) : P(l.x + l.w / 2), y = big ? P(l.y + 3.2) : P(l.y + l.h / 2) + (l.k === 'pad' ? P(l.h / 2) + 8 : 0);
          if (s.length * 7.5 * cw < P(l.w) - 4 || l.k === 'pad') Draw.label(svg, x, y, s, 7.5, pal, { italic: true, anchor: big ? 'start' : 'middle', haloColor: l.k === 'road' ? pal.road : l.k === 'lawn' ? pal.green : pal.paperShade });
        }
      }
      svg.close();
      if (!o.preview) Draw.label(svg, cx0 + P(q.x1 - q.x0) / 2, rowY[row] + lab * 0.45, altFloorName(m, fl), 13, pal, { title: true });
    });

    if (!o.preview) {
      const name = title(m);
      Draw.title(svg, W / 2, 34, name, pal.fontTitle ? Math.min(24, (W - pad) / (name.length * 0.62)) : 24, pal);
      Draw.scaleBar(svg, W - pad - 5 * PXM, H - pad * 0.95, 5 * PXM, 5, 'm', pal, 5);
    }
    return svg.toString();
  }

  // ------------------------------------------------------------ 3D

  function model3dAlt(m) {
    const FH = 3.1, SLAB = 0.25, DOORH = 2.1, SILL = 0.9, WTOP = 2.2, PAR = 1.0;
    const M = Carto.Mesh3D.Mesh;
    const b = m.bounds;
    const ox = -((b.x0 + b.x1) / 2) * U, os = -((b.y0 + b.y1) / 2) * U;
    const X = (v) => v * U + ox, S = (v) => v * U + os;
    const mats = m.setting === 'cyber' ? MAT3D_CYBER : MAT3D_MODERN;
    const levels = m.floors.map((f) => f.level), top = Math.max(...levels);
    const byLevel = new Map(m.floors.map((f) => [f.level, f]));
    const cellsOf2 = (fl) => { const s = new Set(); for (const r of fl.rooms) for (const [x, y] of cellsOf(r)) s.add(key(x, y)); return s; };
    const sameRoom = (fl, r) => fl && fl.rooms.some((o) => o.type === r.type && o.x === r.x && o.y === r.y && o.w === r.w && o.h === r.h);
    const groups = [];
    const roofs = new M(), roofPlant = new M();

    for (const fl of m.floors) {
      const z = fl.level * FH;
      const parts = [];
      const by = {};
      const mesh = (name, mat) => by[name + '|' + mat] || (by[name + '|' + mat] = (() => { const me = new M(); parts.push({ name, mesh: me, material: mat }); return me; })());
      const furn = (mat) => mesh(t('dwelling.3d.furniture') + ' · ' + mats[mat].name, mat);
      const gableTop = m.gable && fl.level === top;
      // Basement walls stop under the ground floor slab, out of sight below the garden.
      const extTop = gableTop || fl.level < 0 ? z + FH - SLAB : z + FH, inTop = z + FH - SLAB;
      const below = byLevel.get(fl.level - 1);

      // Floor slabs; stairwells, lift shafts and service shafts stay open above the bottom one.
      for (const r of fl.rooms) {
        if ((r.type === 'stair' || r.type === 'lift' || r.type === 'shaft') && sameRoom(below, r)) continue;
        const mat = BARE[r.type] || fl.level < 0 ? 'concrete' : TILES[r.type] ? 'stone' : 'boards';
        mesh(t('dwelling.3d.floor'), mat).box(X(r.x), S(r.y), X(r.x + r.w), S(r.y + r.h), z - SLAB, z);
      }

      // Walls, split where walls meet; posts at the joints so that no two
      // solids overlap.
      const runs = wallRuns(edgeMap(fl)).filter((r) => r.kind !== 'open');
      const touch = new Map();
      const tkey = (x, y) => x + ',' + y;
      for (const r of runs) for (const a of [r.a0, r.a1]) {
        const k = r.v ? tkey(r.line, a) : tkey(a, r.line);
        const e = touch.get(k) || { h: false, v: false, th: 0, top: 0, ext: false };
        e[r.v ? 'v' : 'h'] = true;
        e.th = Math.max(e.th, TH[r.cls]);
        e.top = Math.max(e.top, r.cls === 'ext' ? extTop : inTop);
        e.ext = e.ext || r.cls === 'ext';
        touch.set(k, e);
      }
      // A wall passing through a point where another one ends: cut it there.
      const cut = [];
      for (const r of runs) {
        let s = r.a0;
        for (let a = r.a0 + 1; a < r.a1; a++) {
          const e = touch.get(r.v ? tkey(r.line, a) : tkey(a, r.line));
          if (e && e[r.v ? 'h' : 'v']) { cut.push(Object.assign({}, r, { a0: s, a1: a })); s = a; }
        }
        cut.push(Object.assign({}, r, { a0: s, a1: r.a1 }));
      }
      for (const r of cut) for (const a of [r.a0, r.a1]) {
        const k = r.v ? tkey(r.line, a) : tkey(a, r.line);
        const e = touch.get(k) || { h: false, v: false, th: 0, top: 0, ext: false };
        e[r.v ? 'v' : 'h'] = true;
        e.th = Math.max(e.th, TH[r.cls]);
        e.top = Math.max(e.top, r.cls === 'ext' ? extTop : inTop);
        e.ext = e.ext || r.cls === 'ext';
        touch.set(k, e);
      }
      const outerName = t('dwelling.3d.outer'), innerName = t('dwelling.3d.inner');
      const wallMat = (cls) => (cls === 'ext' ? (fl.level < 0 ? 'cellarWall' : 'plaster') : 'inner');
      for (const [k, e] of touch) {
        if (!(e.h && e.v)) continue;
        const [x, y] = k.split(',').map(Number);
        mesh(e.ext ? outerName : innerName, e.ext ? wallMat('ext') : 'inner').box(X(x) - e.th / 2, S(y) - e.th / 2, X(x) + e.th / 2, S(y) + e.th / 2, z, e.top);
      }
      for (const r of cut) {
        const th = TH[r.cls], h1 = r.cls === 'ext' ? extTop : inTop;
        const target = mesh(r.cls === 'ext' ? outerName : innerName, wallMat(r.cls));
        const pk = (a) => { const e = touch.get(r.v ? tkey(r.line, a) : tkey(a, r.line)); return e && e.h && e.v ? e.th / 2 : 0; };
        const p0 = pk(r.a0), p1 = pk(r.a1);
        const piece = (h0, hTop, thick = th, me = target, inset = 0) => {
          if (hTop - h0 < 0.005) return;
          if (r.v) me.box(X(r.line) - thick / 2, S(r.a0) + p0 + inset, X(r.line) + thick / 2, S(r.a1) - p1 - inset, h0, hTop);
          else me.box(X(r.a0) + p0 + inset, S(r.line) - thick / 2, X(r.a1) - p1 - inset, S(r.line) + thick / 2, h0, hTop);
        };
        if (r.kind === 'wall') { piece(z, h1); continue; }
        const op = r.op;
        if (r.kind === 'win') {
          const sill = op.kind === 'win' ? SILL : op.kind === 'shop' ? 0.3 : 0.02, wtop = op.kind === 'glass' ? inTop - 0.15 : WTOP;
          piece(z, z + sill);
          piece(z + wtop, h1);
          piece(z + sill, z + wtop, 0.03, mesh(t('dwelling.3d.windows'), 'glass'));
          continue;
        }
        const dh = op.kind === 'garage' ? 2.4 : op.kind === 'double' ? 2.4 : DOORH;
        piece(z + dh, h1);
        if (op.ext || op.kind === 'lift' || op.kind === 'garage') piece(z, z + dh - 0.03, 0.06, mesh(t('dwelling.3d.doors'), op.kind === 'lift' || op.kind === 'garage' ? 'metal' : 'door'), 0.03);
        else if (HINGED[op.kind] && r.a0 === (op.vertical ? op.y : op.x)) {
          // Interior doors stand open against the swing.
          const hingeA = op.hinge ? (op.vertical ? op.y : op.x) + op.len : op.vertical ? op.y : op.x;
          const len = (op.kind === 'double' ? op.len / 2 : op.len) * U * 0.95, s0 = hingeA * U + (op.hinge ? -0.04 : 0.04);
          const w0 = (op.vertical ? op.x : op.y) * U + (op.dir * TH[r.cls]) / 2, w1 = w0 + op.dir * len;
          const lm = mesh(t('dwelling.3d.doors'), 'door');
          if (op.vertical) lm.box(Math.min(w0, w1) + ox, s0 - 0.02 + os, Math.max(w0, w1) + ox, s0 + 0.02 + os, z, z + DOORH - 0.03);
          else lm.box(s0 - 0.02 + ox, Math.min(w0, w1) + os, s0 + 0.02 + ox, Math.max(w0, w1) + os, z, z + DOORH - 0.03);
        }
      }

      // Two-flight stairs up to the next floor: first flight along one half,
      // a half landing, the second flight back along the other half.
      const next = byLevel.get(fl.level + 1);
      for (const r of fl.rooms) {
        if (r.type === 'lift' && !sameRoom(below, r)) mesh(t('dwelling.3d.lift'), 'metal').box(X(r.x + 0.6), S(r.y + 0.6), X(r.x + r.w - 0.6), S(r.y + r.h - 0.6), z, z + 2.3);
        if (r.type !== 'stair' || !sameRoom(next, r)) continue;
        const { L, Wd, f, land } = stairFrame(r);
        const steps = mesh(t('dwelling.3d.stairs'), 'concrete');
        const q = (a, c) => { const p = f(a, c); return [X(p.x), S(p.y)]; };
        const bx = (a0, c0, a1, c1, h0, h1) => { const p = q(a0, c0), e = q(a1, c1); steps.box(Math.min(p[0], e[0]), Math.min(p[1], e[1]), Math.max(p[0], e[0]), Math.max(p[1], e[1]), h0, h1); };
        const run = L - land, nst = 9, rise = FH / 2 / nst, tread = run / nst;
        for (let i = 0; i < nst; i++) {
          bx(i * tread, 0.2, (i + 1) * tread, Wd / 2 - 0.08, z, z + (i + 1) * rise);
          bx(run - (i + 1) * tread, Wd / 2 + 0.08, run - i * tread, Wd - 0.2, z + FH / 2, z + FH / 2 + (i + 1) * rise);
        }
        bx(run, 0.2, L - 0.2, Wd - 0.2, z + FH / 2 - 0.2, z + FH / 2);
      }

      // Furniture.
      for (const it of fl.items) {
        const f = frameOf(it);
        for (const p of KIT[it.k][2](it.w, it.d, it.v)) {
          if (p[0] === 'l' || p[0] === 'o' || p[0] === 'r') continue;
          if (p[0] === 'c') { const c = f(p[1], p[2]); furn(p[6]).cylinder(c.x + ox, c.y + os, p[3], z + p[4], z + p[5], 14); continue; }
          const a = f(p[0], p[1]), e = f(p[2], p[3]);
          furn(p[6]).box(Math.min(a.x, e.x) + ox, Math.min(a.y, e.y) + os, Math.max(a.x, e.x) + ox, Math.max(a.y, e.y) + os, z + p[4], z + p[5]);
        }
      }

      // Garden, street, terraces.
      const ground = t('dwelling.3d.ground');
      for (const o of fl.outdoor) {
        const bxo = (mat, h0, h1, i = 0) => mesh(ground, mat).box(X(o.x) + i, S(o.y) + i, X(o.x + o.w) - i, S(o.y + o.h) - i, h0, h1);
        const zz = fl.level > 0 ? z : 0;
        switch (o.k) {
          case 'lawn': bxo('grass', -0.15, -0.06); break;
          case 'paving': case 'court': case 'drive': bxo('paving', zz - 0.14, zz + (fl.level > 0 ? 0.04 : -0.02)); break;
          case 'sidewalk': bxo('paving', -0.15, 0); break;
          case 'road': bxo('asphalt', -0.16, -0.12); break;
          case 'hallway': bxo('boards', z - SLAB, z); break;
          case 'hedge': bxo('leaf', -0.06, 1.3); break;
          case 'tree': {
            const cx = X(o.x + o.w / 2), cs = S(o.y + o.h / 2), r = (o.w / 2) * U;
            mesh(ground, 'wood').cylinder(cx, cs, 0.15, -0.06, 2.2, 8);
            mesh(ground, 'leaf').cylinder(cx, cs, r, 2.2, 4.6, 12);
            break;
          }
          case 'pool': bxo('water', -0.15, -0.01); break;
          case 'pad': {
            const cx = X(o.x + o.w / 2), cs = S(o.y + o.h / 2), r = (o.w / 2) * U;
            mesh(ground, 'concrete').cylinder(cx, cs, r, z + 0.04, z + 0.12, 32);
            mesh(ground, 'rug').cylinder(cx, cs, r * 0.85, z + 0.12, z + 0.13, 32);
            mesh(ground, 'concrete').cylinder(cx, cs, r * 0.8, z + 0.13, z + 0.135, 32);
            break;
          }
          case 'ramp': {
            if (fl.level !== -1) break;
            const x0 = X(o.x), x1 = X(o.x + o.w), s0 = S(o.y), s1 = S(o.y + o.h);
            mesh(ground, 'concrete').quad([x0, s0, -FH], [x1, s0, -FH], [x1, s1, 0], [x0, s1, 0]);
            break;
          }
        }
      }

      // Roof over whatever no floor covers: flat with a parapet, or pitched.
      // Below ground the garden and the street cover it.
      const foot = cellsOf2(fl), above = next ? cellsOf2(next) : new Set();
      const open = [...foot].filter((k) => !above.has(k)).map((k) => k.split(',').map(Number));
      if (open.length && fl.level >= 0) {
        const fb = footBox(fl);
        const isRect = foot.size === (fb.x1 - fb.x0) * (fb.y1 - fb.y0);
        if (gableTop && isRect) {
          const eave = z + FH - SLAB, pitch = Math.tan((32 * Math.PI) / 180), over = 0.45;
          const x0 = X(fb.x0) - 0.15, x1 = X(fb.x1) + 0.15, s0 = S(fb.y0) - 0.15, s1 = S(fb.y1) + 0.15;
          if (x1 - x0 >= s1 - s0) {
            const mid = (s0 + s1) / 2, ridge = eave + ((s1 - s0) / 2) * pitch, low = eave - over * pitch;
            roofs.quad([x0 - over, s0 - over, low], [x1 + over, s0 - over, low], [x1 + over, mid, ridge], [x0 - over, mid, ridge]);
            roofs.quad([x0 - over, s1 + over, low], [x1 + over, s1 + over, low], [x1 + over, mid, ridge], [x0 - over, mid, ridge]);
            roofs.tri([x0, s0, eave], [x0, s1, eave], [x0, mid, ridge], [-1, 0]);
            roofs.tri([x1, s0, eave], [x1, s1, eave], [x1, mid, ridge], [1, 0]);
          } else {
            const mid = (x0 + x1) / 2, ridge = eave + ((x1 - x0) / 2) * pitch, low = eave - over * pitch;
            roofs.quad([x0 - over, s0 - over, low], [x0 - over, s1 + over, low], [mid, s1 + over, ridge], [mid, s0 - over, ridge]);
            roofs.quad([x1 + over, s0 - over, low], [x1 + over, s1 + over, low], [mid, s1 + over, ridge], [mid, s0 - over, ridge]);
            roofs.tri([x0, s0, eave], [x1, s0, eave], [mid, s0, ridge], [0, -1]);
            roofs.tri([x0, s1, eave], [x1, s1, eave], [mid, s1, ridge], [0, 1]);
          }
        } else {
          const has = new Set(open.map(([x, y]) => key(x, y)));
          for (const [x, y] of open) if (!has.has(key(x - 1, y))) {
            let x1 = x;
            while (has.has(key(x1 + 1, y))) x1++;
            roofs.box(X(x), S(y), X(x1 + 1), S(y + 1), z + FH - SLAB, z + FH);
          }
          const T = TH.ext, corners = new Set();
          for (const r of Carto.Mesh3D.boundaryRuns((x, y) => foot.has(key(x, y)), open)) {
            if (r.ns) roofs.box(X(r.x0) + T / 2, S(r.s0) - T / 2, X(r.x1) - T / 2, S(r.s0) + T / 2, z + FH, z + FH + PAR);
            else roofs.box(X(r.x0) - T / 2, S(r.s0) + T / 2, X(r.x0) + T / 2, S(r.s1) - T / 2, z + FH, z + FH + PAR);
            corners.add(key(r.x0, r.s0)); corners.add(key(r.x1, r.s1));
          }
          for (const c of corners) { const [x, y] = c.split(',').map(Number); roofs.box(X(x) - T / 2, S(y) - T / 2, X(x) + T / 2, S(y) + T / 2, z + FH, z + FH + PAR); }
          if (fl.level === top) {
            // Rooftop plant: air conditioning, or an antenna mast.
            const cx = X((fb.x0 + fb.x1) / 2), cs = S((fb.y0 + fb.y1) / 2);
            roofPlant.box(cx - 0.9, cs - 0.6, cx + 0.9, cs + 0.6, z + FH, z + FH + 1.1);
            if (m.setting === 'cyber') roofPlant.cylinder(cx + 2, cs, 0.08, z + FH, z + FH + 4.5, 8);
          }
        }
      }
      groups.push({ name: altFloorName(m, fl), parts });
    }
    const roofParts = [{ name: t('dwelling.3d.roof'), mesh: roofs, material: m.gable ? 'roof' : 'flat' }];
    if (!roofPlant.empty) roofParts.push({ name: t('dwelling.3d.furniture'), mesh: roofPlant, material: 'metal' });
    groups.push({ name: t('dwelling.3d.roof'), parts: roofParts });
    if (!m.levelBase) {
      const g = new M().prism([[X(b.x0) - 4, S(b.y0) - 4], [X(b.x1) + 4, S(b.y0) - 4], [X(b.x1) + 4, S(b.y1) + 4], [X(b.x0) - 4, S(b.y1) + 4]], -0.3, -0.16, { sides: false });
      groups.push({ name: t('dwelling.3d.ground'), parts: [{ name: t('dwelling.3d.ground'), mesh: g, material: m.setting === 'cyber' ? 'asphalt' : 'grass' }] });
    }
    return { name: title(m), groups, materials: mats };
  }

  function notesAlt(m) {
    const esc = Svg.esc;
    const total = m.floors.reduce((s, f) => s + f.rooms.reduce((a, r) => a + r.w * r.h * U * U, 0), 0);
    let h = '<h3>' + esc(title(m)) + '</h3><dl><dt>' + esc(t('dwelling.floors')) + '</dt><dd>' + m.floors.length + '</dd>' +
      '<dt>' + esc(t('dwelling.area')) + '</dt><dd>' + esc(fmtArea(Math.round(total / 5) * 5, 0)) + '</dd>' +
      (m.flats ? '<dt>' + esc(t('dwelling.flats')) + '</dt><dd>' + m.flats + '</dd>' : '') + '</dl>';
    const order = m.floors.filter((f) => f.copy == null).sort((a, c) => (a.level < 0 ? 99 : a.level) - (c.level < 0 ? 99 : c.level));
    for (const f of order) {
      const counts = {};
      for (const r of f.rooms) if (r.type !== 'shaft') counts[r.type] = (counts[r.type] || 0) + 1;
      const area = f.rooms.reduce((a, r) => a + r.w * r.h * U * U, 0);
      h += '<p class="tag">' + esc(altFloorName(m, f)) + ' · ' + esc(fmtArea(Math.round(area), 0)) + '</p><ul>' +
        Object.entries(counts).map(([k, c]) => '<li>' + esc(t('room.' + k)) + (c > 1 ? ' <span class="tag">×' + c + '</span>' : '') + '</li>').join('') + '</ul>';
    }
    return h;
  }

  function notes(m) {
    if (m.alt) return notesAlt(m);
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
