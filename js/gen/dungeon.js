/* Dungeon generator: rooms and corridors on a grid, drawn in the cross-hatched
   style of hand-made dungeon maps, with a keyed description of every room. */
(function (Carto) {
  'use strict';

  const G = Carto.G, Svg = Carto.Svg, Draw = Carto.Draw, t = Carto.t;
  const I18n = Carto.I18n;

  I18n.add({
    it: {
      'gen.dungeon.name': 'Dungeon',
      'gen.dungeon.desc': 'Sotterranei su una pagina: stanze, corridoi, porte segrete e una legenda pronta da giocare.',
      'dungeon.opt.size': 'Dimensione',
      'dungeon.opt.size.small': 'Piccolo',
      'dungeon.opt.size.medium': 'Medio',
      'dungeon.opt.size.large': 'Grande',
      'dungeon.opt.theme': 'Tema',
      'dungeon.opt.theme.auto': 'Casuale',
      'dungeon.opt.theme.tomb': 'Cripta',
      'dungeon.opt.theme.temple': 'Tempio',
      'dungeon.opt.theme.lair': 'Covo',
      'dungeon.opt.theme.prison': 'Prigione',
      'dungeon.opt.theme.mine': 'Miniera',
      'dungeon.opt.theme.sanctum': 'Laboratorio',
      'dungeon.opt.page': 'Legenda sulla pagina',
      'dungeon.opt.grid': 'Griglia',
      'dungeon.secret': 'Una porta segreta è nascosta in una parete.',
      'dungeon.locked': 'Una porta è chiusa a chiave.',
      'dungeon.legend': 'S: porta segreta · ■: porta chiusa a chiave · ⋮: grata',
    },
    en: {
      'gen.dungeon.name': 'Dungeon',
      'gen.dungeon.desc': 'One-page dungeons: rooms, corridors, secret doors and a key ready to play.',
      'dungeon.opt.size': 'Size',
      'dungeon.opt.size.small': 'Small',
      'dungeon.opt.size.medium': 'Medium',
      'dungeon.opt.size.large': 'Large',
      'dungeon.opt.theme': 'Theme',
      'dungeon.opt.theme.auto': 'Random',
      'dungeon.opt.theme.tomb': 'Crypt',
      'dungeon.opt.theme.temple': 'Temple',
      'dungeon.opt.theme.lair': 'Lair',
      'dungeon.opt.theme.prison': 'Prison',
      'dungeon.opt.theme.mine': 'Mine',
      'dungeon.opt.theme.sanctum': 'Laboratory',
      'dungeon.opt.page': 'Key on the page',
      'dungeon.opt.grid': 'Grid',
      'dungeon.secret': 'A secret door is hidden in one wall.',
      'dungeon.locked': 'One door is locked.',
      'dungeon.legend': 'S: secret door · ■: locked door · ⋮: bars',
    },
  });

  // ------------------------------------------------------------- text tables
  // Parallel Italian/English entries; the model stores only indices.

  const T = {
    places: {
      tomb: [['Cripta', 'Crypt'], ['Tomba', 'Tomb'], ['Catacombe', 'Catacombs'], ['Mausoleo', 'Mausoleum']],
      temple: [['Tempio', 'Temple'], ['Santuario', 'Sanctuary'], ['Sacrario', 'Shrine']],
      lair: [['Covo', 'Lair'], ['Tana', 'Den'], ['Rifugio', 'Hideout']],
      prison: [['Prigioni', 'Prison'], ['Segrete', 'Dungeons'], ['Carcere', 'Gaol']],
      mine: [['Miniere', 'Mines'], ['Gallerie', 'Delvings'], ['Scavi', 'Diggings']],
      sanctum: [['Laboratorio', 'Laboratory'], ['Archivio', 'Archive'], ['Sancta', 'Sanctum']],
    },
    // [italian with articled preposition, gender/number for the adjective, english]
    nouns: [
      ['del Re', 'ms', 'King'], ['della Regina', 'fs', 'Queen'], ['del Serpente', 'ms', 'Serpent'],
      ['del Profeta', 'ms', 'Prophet'], ['della Luna', 'fs', 'Moon'], ['delle Ombre', 'fp', 'Shadows'],
      ['del Negromante', 'ms', 'Necromancer'], ['del Drago', 'ms', 'Dragon'], ['del Corvo', 'ms', 'Raven'],
      ['della Fiamma', 'fs', 'Flame'], ['dell’Abisso', 'ms', 'Abyss'], ['dell’Occhio', 'ms', 'Eye'],
      ['dello Specchio', 'ms', 'Mirror'], ['dei Signori', 'mp', 'Lords'], ['degli Dei', 'mp', 'Gods'],
      ['delle Stelle', 'fp', 'Stars'], ['del Guardiano', 'ms', 'Warden'], ['del Cavaliere', 'ms', 'Knight'],
      ['dell’Imperatore', 'ms', 'Emperor'], ['della Strega', 'fs', 'Witch'], ['del Lupo', 'ms', 'Wolf'],
      ['del Ragno', 'ms', 'Spider'], ['del Verme', 'ms', 'Worm'], ['del Sole', 'ms', 'Sun'], ['del Tiranno', 'ms', 'Tyrant'],
    ],
    // [m sing, f sing, m plur, f plur, english]
    adjs: [
      ['Dimenticato', 'Dimenticata', 'Dimenticati', 'Dimenticate', 'Forgotten'],
      ['Perduto', 'Perduta', 'Perduti', 'Perdute', 'Lost'],
      ['Maledetto', 'Maledetta', 'Maledetti', 'Maledette', 'Cursed'],
      ['Caduto', 'Caduta', 'Caduti', 'Cadute', 'Fallen'],
      ['Eterno', 'Eterna', 'Eterni', 'Eterne', 'Eternal'],
      ['Nero', 'Nera', 'Neri', 'Nere', 'Black'],
      ['Cremisi', 'Cremisi', 'Cremisi', 'Cremisi', 'Crimson'],
      ['Silente', 'Silente', 'Silenti', 'Silenti', 'Silent'],
      ['Pallido', 'Pallida', 'Pallidi', 'Pallide', 'Pale'],
      ['Dormiente', 'Dormiente', 'Dormienti', 'Dormienti', 'Sleeping'],
      ['Senza Nome', 'Senza Nome', 'Senza Nome', 'Senza Nome', 'Nameless'],
      ['Profano', 'Profana', 'Profani', 'Profane', 'Profane'],
      ['Affamato', 'Affamata', 'Affamati', 'Affamate', 'Hungry'],
      ['Spezzato', 'Spezzata', 'Spezzati', 'Spezzate', 'Broken'],
      ['Velato', 'Velata', 'Velati', 'Velate', 'Veiled'],
      ['Sepolto', 'Sepolta', 'Sepolti', 'Sepolte', 'Buried'],
      ['Insonne', 'Insonne', 'Insonni', 'Insonni', 'Sleepless'],
      ['di Cenere', 'di Cenere', 'di Cenere', 'di Cenere', 'Ashen'],
    ],
    openings: [
      ['Da generazioni nessuno osa scendere qui.', 'For generations no one has dared to go down here.'],
      ['Un terremoto ha riaperto questo luogo dimenticato.', 'An earthquake has reopened this forgotten place.'],
      ['I contadini della zona parlano di luci tra gli alberi, di notte.', 'Local farmers speak of lights among the trees at night.'],
      ['Una mappa strappata, comprata al mercato, indica questo ingresso.', 'A torn map, bought at the market, marks this entrance.'],
      ['Il villaggio vicino è stato razziato tre volte in un mese.', 'The nearby village has been raided three times in a month.'],
      ['Un messaggero ferito è arrivato in città prima di spirare.', 'A wounded messenger reached town before passing away.'],
    ],
    rumors: {
      tomb: [['Qui riposa {name}, insieme al suo tesoro.', '{name} rests here, together with a hoard of gold.'], ['Si dice che {name} non trovi pace.', 'They say {name} finds no peace.']],
      temple: [['Il culto di {name} si riunisce qui a ogni luna nuova.', 'The cult of {name} gathers here every new moon.'], ['Qui si venera ancora {name}, un dio che il mondo ha scordato.', 'Here {name}, a god the world forgot, is still worshipped.']],
      lair: [['Una banda guidata da {name} vi ha stabilito il suo covo.', 'A band led by {name} has made its lair here.'], ['Le razzie partono da qui, agli ordini di {name}.', 'The raids start from here, on the orders of {name}.']],
      prison: [['Qui {name} scontava una condanna senza fine.', 'Here {name} served an endless sentence.'], ['Le guardie di {name} non hanno mai lasciato il loro posto.', 'The guards of {name} never left their posts.']],
      mine: [['I minatori di {name} scavarono troppo a fondo.', 'The miners of {name} dug too deep.'], ['La vena d’argento di {name} attira ancora cercatori incauti.', 'The silver vein of {name} still lures reckless prospectors.']],
      sanctum: [['Qui {name} conduceva esperimenti proibiti.', 'Here {name} conducted forbidden experiments.'], ['Gli scritti di {name} sono custoditi in queste sale.', 'The writings of {name} are kept in these halls.']],
    },
    goals: [
      ['Chi riporterà {treasure} sarà ricompensato.', 'Whoever brings back {treasure} will be rewarded.'],
      ['Il male va fermato prima che si risvegli del tutto.', 'The evil must be stopped before it fully awakens.'],
      ['Qualcuno deve scoprire che fine hanno fatto gli esploratori scomparsi.', 'Someone must find out what happened to the missing explorers.'],
    ],
    rooms: {
      entrance: [['Ingresso. Una scala consunta scende dalla superficie.', 'Entrance. A worn stair descends from the surface.'], ['Ingresso. Gradini coperti di muschio portano giù nel buio.', 'Entrance. Moss-covered steps lead down into the dark.']],
      guard: [['Corpo di guardia. Un tavolo rovesciato, dadi d’osso sul pavimento.', 'Guardroom. An overturned table, bone dice on the floor.'], ['Posto di guardia. Feritoie si affacciano sul corridoio.', 'Guard post. Arrow slits overlook the corridor.']],
      storage: [['Magazzino. Casse sfondate e sacchi di grano ammuffito.', 'Storeroom. Smashed crates and sacks of mouldy grain.'], ['Dispensa. Botti allineate lungo le pareti, alcune piene di vino acido.', 'Pantry. Barrels line the walls, some full of sour wine.']],
      barracks: [['Dormitorio. File di brande marce e coperte rosicchiate.', 'Barracks. Rows of rotten cots and gnawed blankets.']],
      armory: [['Armeria. Rastrelliere vuote; è rimasta solo una lancia arrugginita.', 'Armoury. Empty racks; only a rusty spear remains.']],
      crypt: [['Cripta. Sarcofagi di pietra con i coperchi spostati.', 'Crypt. Stone sarcophagi with their lids pushed aside.'], ['Sala delle sepolture. Nicchie scavate nella roccia, colme di ossa.', 'Burial hall. Niches cut into the rock, filled with bones.']],
      ossuary: [['Ossario. Teschi impilati formano pareti e archi.', 'Ossuary. Stacked skulls form walls and arches.']],
      shrine: [['Cappella. Un altare macchiato di cera nera.', 'Chapel. An altar stained with black wax.'], ['Santuario. Candele spente circondano una statua senza volto.', 'Shrine. Snuffed candles surround a faceless statue.']],
      ritual: [['Sala rituale. Un cerchio di rune inciso nel pavimento emana un debole bagliore.', 'Ritual chamber. A circle of runes carved in the floor gives off a faint glow.']],
      library: [['Biblioteca. Scaffali crollati, pergamene sparse e un leggio intatto.', 'Library. Collapsed shelves, scattered scrolls and one intact lectern.']],
      lab: [['Laboratorio. Alambicchi incrinati e un forte odore di zolfo.', 'Laboratory. Cracked alembics and a sharp smell of sulphur.'], ['Officina alchemica. Un crogiolo è ancora tiepido.', 'Alchemical workshop. A crucible is still warm.']],
      prison: [['Celle. Grate arrugginite e catene fissate al muro.', 'Cells. Rusty grates and chains fixed to the wall.'], ['Prigione. Sui muri, tacche di prigionieri contano giorni senza fine.', 'Prison. Prisoners’ marks on the walls count endless days.']],
      torture: [['Stanza delle torture. Un cavalletto e strumenti appesi a ganci.', 'Torture chamber. A rack and instruments hanging from hooks.']],
      throne: [['Sala del trono. Un trono di pietra domina la stanza, sotto drappi strappati.', 'Throne room. A stone throne dominates the room, under torn banners.']],
      vault: [['Camera del tesoro. Nicchie un tempo piene d’oro, protette da una porta rinforzata.', 'Treasury. Niches once full of gold, guarded by a reinforced door.']],
      flooded: [['Sala allagata. L’acqua nera arriva alle ginocchia.', 'Flooded hall. Black water reaches the knees.'], ['Cisterna. Una vasca profonda occupa gran parte della stanza.', 'Cistern. A deep pool fills most of the room.']],
      collapsed: [['Crollo. Parte del soffitto è caduta; si passa a fatica tra i massi.', 'Cave-in. Part of the ceiling has fallen; one squeezes between the boulders.']],
      well: [['Pozzo. Un pozzo senza fondo da cui sale un vento gelido.', 'Well. A bottomless shaft breathing an icy wind.']],
      hall: [['Grande sala. Colonne scolpite reggono una volta annerita dal fumo.', 'Great hall. Carved pillars hold up a smoke-blackened vault.']],
      statues: [['Galleria delle statue. Guerrieri di pietra fissano la porta.', 'Statue gallery. Stone warriors stare at the door.']],
      lair: [['Tana. Ossa rosicchiate e un giaciglio di pelli puzzolenti.', 'Den. Gnawed bones and a bed of stinking furs.']],
      kitchen: [['Cucina. Un grande camino e pentole incrostate.', 'Kitchen. A large hearth and crusted pots.']],
      mine: [['Galleria di scavo. Puntelli marci e un carrello rovesciato.', 'Digging gallery. Rotten props and an overturned cart.'], ['Filone. Una vena di minerale scintilla nella roccia.', 'Lode. A vein of ore glitters in the rock.']],
      fungus: [['Giardino di funghi. Funghi alti come uomini liberano spore luminose.', 'Fungus garden. Man-high mushrooms release glowing spores.']],
      empty: [['Stanza vuota. Polvere, ragnatele e silenzio.', 'Empty room. Dust, cobwebs and silence.'], ['Stanza spoglia. Sul muro qualcuno ha inciso un avvertimento illeggibile.', 'Bare room. Someone has scratched an illegible warning on the wall.']],
      exit: [['Scala verso il basso. I gradini scendono verso livelli ancora più profondi.', 'Stairs down. Steps descend to even deeper levels.']],
    },
    kinds: {
      tomb: { crypt: 4, ossuary: 2, shrine: 2, statues: 1.5, collapsed: 1, flooded: 1, empty: 1.5, guard: 0.5, well: 0.5, hall: 1 },
      temple: { shrine: 3, ritual: 2, library: 1, hall: 2, statues: 1, prison: 1, barracks: 1, storage: 1, crypt: 1, empty: 1 },
      lair: { lair: 3, storage: 2, barracks: 2, guard: 2, collapsed: 1, flooded: 1, kitchen: 1, prison: 1, empty: 1 },
      prison: { prison: 4, torture: 1.5, guard: 2.5, barracks: 1.5, storage: 1.5, kitchen: 1, armory: 1, well: 1, flooded: 0.7, empty: 1 },
      mine: { mine: 4, collapsed: 2, storage: 1.5, flooded: 1.5, fungus: 1.5, well: 1, barracks: 1, lair: 1, empty: 1 },
      sanctum: { lab: 3, library: 3, ritual: 1.5, statues: 1, storage: 1, hall: 1, flooded: 0.5, empty: 1, prison: 0.5 },
    },
    boss: { tomb: 'crypt', temple: 'ritual', lair: 'throne', prison: 'torture', mine: 'lair', sanctum: 'lab' },
    // [it singular, it plural, en singular, en plural, solo]
    monsters: {
      tomb: [['uno scheletro', 'scheletri', 'a skeleton', 'skeletons'], ['uno zombi', 'zombi', 'a zombie', 'zombies'], ['un ghoul', 'ghoul', 'a ghoul', 'ghouls'], ['uno spettro', 'spettri', 'a wraith', 'wraiths', 1], ['una mummia', 'mummie', 'a mummy', 'mummies', 1]],
      temple: [['un cultista', 'cultisti', 'a cultist', 'cultists'], ['un sacerdote oscuro', 'sacerdoti oscuri', 'a dark priest', 'dark priests', 1], ['un demone minore', 'demoni minori', 'a lesser demon', 'lesser demons', 1], ['un accolito', 'accoliti', 'an acolyte', 'acolytes']],
      lair: [['un goblin', 'goblin', 'a goblin', 'goblins'], ['un orco', 'orchi', 'an orc', 'orcs'], ['un lupo', 'lupi', 'a wolf', 'wolves'], ['un ragno gigante', 'ragni giganti', 'a giant spider', 'giant spiders'], ['un troll', 'troll', 'a troll', 'trolls', 1]],
      prison: [['una guardia', 'guardie', 'a guard', 'guards'], ['un ratto gigante', 'ratti giganti', 'a giant rat', 'giant rats'], ['un carceriere', 'carcerieri', 'a jailer', 'jailers', 1], ['un prigioniero', 'prigionieri', 'a prisoner', 'prisoners']],
      mine: [['un coboldo', 'coboldi', 'a kobold', 'kobolds'], ['una melma acida', 'melme acide', 'an acid ooze', 'acid oozes', 1], ['un verme delle rocce', 'vermi delle rocce', 'a rock worm', 'rock worms', 1], ['un pipistrello gigante', 'pipistrelli giganti', 'a giant bat', 'giant bats']],
      sanctum: [['un golem di carne', 'golem di carne', 'a flesh golem', 'flesh golems', 1], ['un costrutto', 'costrutti', 'a construct', 'constructs'], ['un’armatura animata', 'armature animate', 'an animated armour', 'animated armours'], ['un homunculus', 'homunculi', 'a homunculus', 'homunculi']],
    },
    numbers: [['', ''], ['uno', 'one'], ['due', 'two'], ['tre', 'three'], ['quattro', 'four'], ['cinque', 'five'], ['sei', 'six']],
    monsterSentences: {
      one: [['{M} si aggira nella stanza.', '{M} prowls the room.'], ['{M} fa la guardia.', '{M} stands guard.'], ['{M} riposa in un angolo.', '{M} rests in a corner.']],
      many: [['{M} si aggirano nella stanza.', '{M} prowl the room.'], ['{M} fanno la guardia.', '{M} stand guard.'], ['{M} si contendono una carcassa.', '{M} fight over a carcass.']],
    },
    treasures: [
      ['un forziere con {coins} monete d’oro', 'a chest holding {coins} gold coins'],
      ['una spada d’argento incisa di rune', 'a silver sword engraved with runes'],
      ['un anello con un rubino', 'a ring set with a ruby'],
      ['una pergamena con un incantesimo', 'a scroll bearing a spell'],
      ['tre pozioni di guarigione', 'three healing potions'],
      ['una corona d’oro ammaccata', 'a dented golden crown'],
      ['un idolo di giada', 'a jade idol'],
      ['una mappa dei livelli inferiori', 'a map of the lower levels'],
      ['un libro di preghiere rilegato in pelle', 'a leather-bound prayer book'],
      ['gemme nascoste dentro un teschio', 'gems hidden inside a skull'],
      ['un mantello elfico', 'an elven cloak'],
      ['una chiave d’osso', 'a bone key'],
    ],
    treasureSentences: [['Nascosto con cura: {T}.', 'Carefully hidden: {T}.'], ['Tra la polvere: {T}.', 'Among the dust: {T}.'], ['Sotto una lastra smossa: {T}.', 'Under a loose slab: {T}.']],
    traps: [
      ['una lastra a pressione fa partire dardi avvelenati', 'a pressure plate fires poisoned darts'],
      ['il pavimento cede su una fossa irta di pali', 'the floor gives way to a spiked pit'],
      ['una lama a pendolo scende dal soffitto', 'a pendulum blade swings down from the ceiling'],
      ['una runa esplode in fiamme se calpestata', 'a rune bursts into flame when stepped on'],
      ['una grata cala alle spalle degli intrusi', 'a portcullis drops behind intruders'],
      ['un gas soporifero esce dalle fessure', 'sleeping gas seeps from the cracks'],
      ['un filo teso fa crollare parte del soffitto', 'a tripwire brings down part of the ceiling'],
    ],
    trapSentence: ['Trappola: {R}.', 'Trap: {R}.'],
  };

  const THEMES = ['tomb', 'temple', 'lair', 'prison', 'mine', 'sanctum'];
  const L = () => (I18n.lang === 'it' ? 0 : 1);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // ------------------------------------------------------------- layout

  const DIRS = { n: { x: 0, y: -1 }, e: { x: 1, y: 0 }, s: { x: 0, y: 1 }, w: { x: -1, y: 0 } };
  const PERP = { n: ['e', 'w'], s: ['e', 'w'], e: ['n', 's'], w: ['n', 's'] };
  const ck = (x, y) => x + ',' + y;

  function layout(rng, target, loopsWanted) {
    const occ = new Map();
    const areas = [];
    const links = []; // {a, b, door: {x, y, vertical}}

    const cellsOf = (r) => {
      const out = [];
      for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) out.push([x, y]);
      return out;
    };
    const addArea = (a) => {
      a.id = areas.length;
      areas.push(a);
      const cells = a.cells || cellsOf(a);
      for (const [x, y] of cells) occ.set(ck(x, y), a.id);
      return a;
    };
    const makeRoom = (round) => {
      if (round) {
        const n = rng.pick([5, 5, 7]);
        return { kind: 'room', shape: 'round', w: n, h: n };
      }
      const big = rng.bool(0.3);
      const w = big ? rng.int(5, 8) : rng.int(3, 6);
      const h = big ? rng.int(4, 7) : rng.int(3, 5);
      return rng.bool() ? { kind: 'room', shape: 'rect', w, h } : { kind: 'room', shape: 'rect', w: h, h: w };
    };
    // Door slot on a side of a room: [cell inside room, first cell outside].
    const sideSlot = (r, d, k) => {
      if (d === 'e') return [[r.x + r.w - 1, r.y + k], [r.x + r.w, r.y + k]];
      if (d === 'w') return [[r.x, r.y + k], [r.x - 1, r.y + k]];
      if (d === 'n') return [[r.x + k, r.y], [r.x + k, r.y - 1]];
      return [[r.x + k, r.y + r.h - 1], [r.x + k, r.y + r.h]];
    };
    const sideLen = (r, d) => (d === 'e' || d === 'w' ? r.h : r.w);
    const doorBetween = (c1, c2) => ({ x: (c1[0] + c2[0]) / 2 + 0.5, y: (c1[1] + c2[1]) / 2 + 0.5, vertical: c1[0] !== c2[0] });

    const entrance = makeRoom(false);
    entrance.w = Math.max(3, Math.min(entrance.w, 5));
    entrance.h = Math.max(3, Math.min(entrance.h, 5));
    entrance.x = 0;
    entrance.y = 0;
    addArea(entrance);
    const rooms = [entrance];
    let box = { x0: 0, y0: 0, x1: entrance.w, y1: entrance.h };

    let attempts = 0;
    while (rooms.length < target && attempts++ < 3000) {
      // Prefer recent rooms and rooms with few links, for long branching paths.
      const A = rng.weighted(rooms.map((r, i) => [r, 1 + i / rooms.length + (r.links || 0 ? 0 : 0.5)]));
      const d = rng.pick(['n', 'e', 's', 'w']);
      const k = A.shape === 'round' ? (sideLen(A, d) - 1) / 2 : rng.int(0, sideLen(A, d) - 1);
      const [inside, start] = sideSlot(A, d, k);
      const len1 = rng.weighted([[1, 3], [2, 3], [3, 3], [4, 2], [5, 2], [6, 1], [8, 0.5]]);
      const bend = len1 >= 2 && rng.bool(0.3);
      const corridor = [];
      let cx = start[0], cy = start[1], dir = d;
      for (let i = 0; i < len1; i++) { corridor.push([cx, cy]); cx += DIRS[dir].x; cy += DIRS[dir].y; }
      if (bend) {
        dir = rng.pick(PERP[d]);
        const len2 = rng.int(2, 5);
        cx -= DIRS[d].x; cy -= DIRS[d].y;
        for (let i = 0; i < len2; i++) { cx += DIRS[dir].x; cy += DIRS[dir].y; corridor.push([cx, cy]); }
        cx += DIRS[dir].x; cy += DIRS[dir].y;
      }
      const end = corridor[corridor.length - 1];
      const R = makeRoom(rng.bool(0.14));
      const opposite = { n: 's', s: 'n', e: 'w', w: 'e' }[dir];
      const kk = R.shape === 'round' ? (sideLen(R, opposite) - 1) / 2 : rng.int(0, sideLen(R, opposite) - 1);
      // Position R so that its `opposite` side slot kk sits at (cx, cy).
      if (dir === 'e') { R.x = cx; R.y = cy - kk; }
      else if (dir === 'w') { R.x = cx - R.w + 1; R.y = cy - kk; }
      else if (dir === 's') { R.x = cx - kk; R.y = cy; }
      else { R.x = cx - kk; R.y = cy - R.h + 1; }
      // Rock must separate everything except where things connect.
      const allowA = new Map([[A.id, true]]);
      if (!fitsCells(corridor.slice(0, 1), allowA) || !fitsCells(corridor.slice(1), null, corridor.slice(0, 1))) continue;
      if (!fitsCells(cellsOf(R), null)) continue;
      if (touches(corridor, cellsOf(R), corridor[corridor.length - 1])) continue;
      // Keep the overall footprint compact rather than a long snake.
      const nb = { x0: Math.min(box.x0, R.x), y0: Math.min(box.y0, R.y), x1: Math.max(box.x1, R.x + R.w), y1: Math.max(box.y1, R.y + R.h) };
      const aspect = (q) => Math.max(q.x1 - q.x0, q.y1 - q.y0) / Math.max(1, Math.min(q.x1 - q.x0, q.y1 - q.y0));
      if (aspect(nb) > 1.45 && aspect(nb) > aspect(box) && rng.bool(0.8)) continue;
      box = nb;
      const C = addArea({ kind: 'corridor', cells: corridor });
      addArea(R);
      links.push({ a: A.id, b: C.id, door: doorBetween(inside, start) });
      const entryCell = [cx, cy];
      links.push({ a: C.id, b: R.id, door: doorBetween(end, entryCell) });
      A.links = (A.links || 0) + 1;
      R.links = 1;
      rooms.push(R);
    }

    function fitsCells(cells, allow, extra) {
      const own = new Set(cells.map(([x, y]) => ck(x, y)));
      if (extra) for (const [x, y] of extra) own.add(ck(x, y));
      for (const [x, y] of cells) {
        if (occ.has(ck(x, y))) return false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const kq = ck(x + dx, y + dy);
            if (own.has(kq)) continue;
            const o = occ.get(kq);
            if (o === undefined) continue;
            if (allow && allow.has(o)) continue;
            return false;
          }
        }
      }
      return true;
    }
    // Corridor cells (except the last) must not touch the new room.
    function touches(corr, roomCells, last) {
      const rs = new Set(roomCells.map(([x, y]) => ck(x, y)));
      for (const [x, y] of corr) {
        if (x === last[0] && y === last[1]) continue;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (rs.has(ck(x + dx, y + dy))) return true;
      }
      return false;
    }

    // Extra corridors that close loops.
    let loops = 0;
    for (let tries = 0; tries < 400 && loops < loopsWanted; tries++) {
      const A = rng.pick(rooms);
      const d = rng.pick(['n', 'e', 's', 'w']);
      const k = A.shape === 'round' ? (sideLen(A, d) - 1) / 2 : rng.int(0, sideLen(A, d) - 1);
      const [inside, start] = sideSlot(A, d, k);
      const corridor = [];
      let x = start[0], y = start[1];
      let B = null;
      for (let i = 0; i < 7; i++) {
        if (occ.has(ck(x, y))) break;
        corridor.push([x, y]);
        const nx = x + DIRS[d].x, ny = y + DIRS[d].y;
        const o = occ.get(ck(nx, ny));
        if (o !== undefined) {
          const area = areas[o];
          if (area.kind === 'room' && area !== A && !(area.shape === 'round' && !isMidSlot(area, nx, ny))) B = area;
          break;
        }
        x = nx; y = ny;
      }
      if (!B || corridor.length < 1) continue;
      if (links.some((l) => (areas[l.a] === A && linkedRoom(l.b) === B) || (areas[l.a] === B && linkedRoom(l.b) === A))) continue;
      const allow = new Map([[A.id, true], [B.id, true]]);
      if (!fitsCells(corridor, allow)) continue;
      const C = addArea({ kind: 'corridor', cells: corridor, loop: true });
      const last = corridor[corridor.length - 1];
      links.push({ a: A.id, b: C.id, door: doorBetween(inside, start), loop: true });
      links.push({ a: C.id, b: B.id, door: doorBetween(last, [last[0] + DIRS[d].x, last[1] + DIRS[d].y]), loop: true });
      loops++;
    }
    function isMidSlot(r, x, y) {
      const m = (r.w - 1) / 2;
      return (x === r.x + m) || (y === r.y + m);
    }
    function linkedRoom(corridorId) {
      const l = links.find((q) => q.a === corridorId);
      return l ? areas[l.b] : null;
    }

    return { areas, links, rooms };
  }

  // ------------------------------------------------------------- contents

  function furnish(rng, room, kind, doorsIn) {
    const f = [];
    const { x, y, w, h } = room;
    const blocked = (cx, cy) => doorsIn.some((d) => Math.abs(d[0] - cx) + Math.abs(d[1] - cy) < 1.6);
    // Walls without doors, for things standing against a wall.
    const walls = ['n', 's', 'e', 'w'].filter((side) => !doorsIn.some((d) =>
      (side === 'n' && d[1] === y) || (side === 's' && d[1] === y + h - 1) || (side === 'w' && d[0] === x) || (side === 'e' && d[0] === x + w - 1)));
    const wall = walls.length ? rng.pick(walls) : rng.pick(['n', 's', 'e', 'w']);
    const cx = x + w / 2, cy = y + h / 2;
    const round = room.shape === 'round';
    const alongWall = (side, depth) => {
      // centre line of a strip along the given wall
      if (side === 'n') return { x0: x + 0.5, x1: x + w - 0.5, y0: y + depth, y1: y + depth, ang: 0 };
      if (side === 's') return { x0: x + 0.5, x1: x + w - 0.5, y0: y + h - depth, y1: y + h - depth, ang: 0 };
      if (side === 'w') return { x0: x + depth, x1: x + depth, y0: y + 0.5, y1: y + h - 0.5, ang: 90 };
      return { x0: x + w - depth, x1: x + w - depth, y0: y + 0.5, y1: y + h - 0.5, ang: 90 };
    };
    const wallPoint = (side, depth) => {
      const s = alongWall(side, depth);
      return { x: (s.x0 + s.x1) / 2, y: (s.y0 + s.y1) / 2, ang: s.ang };
    };
    switch (kind) {
      case 'hall':
        if (!round && w >= 4 && h >= 4) {
          for (let i = x + 1; i < x + w - 1; i += 2) {
            for (const j of [y + 1, y + h - 1]) if (!blocked(i, j)) f.push({ t: 'column', x: i, y: j });
          }
        } else f.push({ t: 'statue', x: cx, y: cy });
        break;
      case 'crypt': {
        const n = Math.max(1, Math.min(4, Math.floor((round ? 2 : w * h) / 5)));
        const horiz = w >= h;
        for (let i = 0; i < n; i++) {
          const px = horiz ? x + ((i + 0.5) * w) / n : cx;
          const py = horiz ? cy : y + ((i + 0.5) * h) / n;
          f.push({ t: 'sarcophagus', x: px, y: py, ang: horiz ? 90 : 0 });
        }
        break;
      }
      case 'ossuary': {
        for (const side of walls.length ? walls : ['n']) {
          const s = alongWall(side, 0.3);
          const len = Math.hypot(s.x1 - s.x0, s.y1 - s.y0);
          for (let d = 0; d <= len; d += 0.45) f.push({ t: 'skull', x: s.x0 + ((s.x1 - s.x0) * d) / Math.max(len, 0.01), y: s.y0 + ((s.y1 - s.y0) * d) / Math.max(len, 0.01) });
        }
        break;
      }
      case 'shrine': {
        const p = wallPoint(wall, 0.75);
        f.push({ t: 'altar', x: p.x, y: p.y, ang: p.ang });
        if (w * h > 12) f.push({ t: 'statue', x: cx, y: cy });
        break;
      }
      case 'ritual':
        f.push({ t: 'circle', x: cx, y: cy, r: Math.max(1, Math.min(w, h) / 2 - 0.8) });
        break;
      case 'library': {
        for (const side of walls.slice(0, 2)) f.push({ t: 'shelf', side, ...alongWall(side, 0.25) });
        f.push({ t: 'table', x: cx, y: cy, ang: w >= h ? 0 : 90 });
        break;
      }
      case 'lab':
        f.push({ t: 'table', x: cx, y: cy, ang: w >= h ? 0 : 90 });
        if (walls.length) f.push({ t: 'shelf', ...alongWall(walls[0], 0.25) });
        f.push({ t: 'barrel', x: x + 0.6, y: y + 0.6 });
        break;
      case 'prison':
        if (!round) f.push({ t: 'cells', side: wall, room: { x, y, w, h } });
        break;
      case 'torture':
        f.push({ t: 'rack', x: cx, y: cy, ang: w >= h ? 0 : 90 });
        break;
      case 'throne': {
        const p = wallPoint(wall, 0.7);
        f.push({ t: 'throne', x: p.x, y: p.y, side: wall });
        if (!round && w >= 5) for (let i = x + 1; i < x + w - 1; i += 2) for (const j of [y + 1, y + h - 1]) if (!blocked(i, j)) f.push({ t: 'column', x: i, y: j });
        break;
      }
      case 'vault':
        for (let i = 0; i < rng.int(2, 4); i++) f.push({ t: 'chest', x: x + 0.6 + rng.next() * (w - 1.2), y: y + 0.6 + rng.next() * (h - 1.2), ang: rng.pick([0, 90]) });
        break;
      case 'flooded':
        f.push({ t: 'water', x: cx, y: cy, rx: w / 2, ry: h / 2, seed: rng.int(1, 1e6) });
        break;
      case 'collapsed':
        for (let i = 0; i < 7 + w * h / 2; i++) {
          const a = rng.float(0, Math.PI * 2), r = rng.float(0, 0.55);
          const side = rng.pick(['n', 's', 'e', 'w']);
          const p = wallPoint(side, 0.8);
          f.push({ t: 'rubble', x: p.x * 0.6 + (cx + Math.cos(a) * r * w) * 0.4, y: p.y * 0.6 + (cy + Math.sin(a) * r * h) * 0.4, r: rng.float(0.12, 0.32) });
        }
        break;
      case 'well':
        f.push({ t: 'well', x: cx, y: cy });
        break;
      case 'statues':
        if (round) { for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; f.push({ t: 'statue', x: cx + Math.cos(a) * (w / 2 - 1), y: cy + Math.sin(a) * (h / 2 - 1) }); } }
        else for (const side of ['n', 's']) {
          const s = alongWall(side, 0.7);
          for (let i = x + 1; i < x + w - 1; i += 2) if (!blocked(i, s.y0)) f.push({ t: 'statue', x: i + 0.5, y: s.y0 });
        }
        break;
      case 'lair':
        f.push({ t: 'nest', x: cx + rng.float(-0.5, 0.5), y: cy + rng.float(-0.5, 0.5), r: Math.min(w, h) * 0.28, seed: rng.int(1, 1e6) });
        for (let i = 0; i < 5; i++) f.push({ t: 'bone', x: x + 0.5 + rng.next() * (w - 1), y: y + 0.5 + rng.next() * (h - 1), ang: rng.float(0, 180) });
        break;
      case 'kitchen': {
        const p = wallPoint(wall, 0.45);
        f.push({ t: 'hearth', x: p.x, y: p.y, side: wall });
        f.push({ t: 'table', x: cx, y: cy, ang: w >= h ? 0 : 90 });
        break;
      }
      case 'mine':
        if (!round) f.push({ t: 'rails', horiz: w >= h, x, y, w, h });
        f.push({ t: 'crate', x: x + 0.7, y: y + 0.7 });
        break;
      case 'fungus':
        for (let i = 0; i < 6 + w * h / 3; i++) f.push({ t: 'mushroom', x: x + 0.4 + rng.next() * (w - 0.8), y: y + 0.4 + rng.next() * (h - 0.8), r: rng.float(0.12, 0.42) });
        break;
      case 'storage':
        for (let i = 0; i < 3 + rng.int(0, 4); i++) {
          const p = wallPoint(rng.pick(walls.length ? walls : ['n']), 0.5);
          const s2 = rng.float(-0.4, 0.4);
          f.push({ t: rng.bool() ? 'barrel' : 'crate', x: p.x + (p.ang ? 0 : s2 * (w - 1)), y: p.y + (p.ang ? s2 * (h - 1) : 0) });
        }
        break;
      case 'barracks': {
        const side = wall;
        const s = alongWall(side, 0.85);
        const len = Math.hypot(s.x1 - s.x0, s.y1 - s.y0);
        for (let d = 0.2; d <= len - 0.2; d += 1) f.push({ t: 'bed', x: s.x0 + ((s.x1 - s.x0) * d) / Math.max(len, 0.01), y: s.y0 + ((s.y1 - s.y0) * d) / Math.max(len, 0.01), side });
        break;
      }
      case 'armory':
        for (const side of walls.slice(0, 2)) f.push({ t: 'rack2', ...alongWall(side, 0.25) });
        break;
      case 'guard':
        f.push({ t: 'table', x: cx, y: cy, ang: 0 });
        f.push({ t: 'stool', x: cx - 0.9, y: cy }, { t: 'stool', x: cx + 0.9, y: cy });
        break;
      case 'entrance':
      case 'exit': {
        const p = wallPoint(wall, 1);
        f.push({ t: 'stairs', x: p.x, y: p.y, side: wall, down: kind === 'exit' });
        break;
      }
    }
    return f.filter((q) => !(q.x !== undefined && q.t !== 'cells' && q.t !== 'rails' && q.t !== 'water' && q.t !== 'circle' && blocked(Math.floor(q.x), Math.floor(q.y)) && q.t !== 'stairs'));
  }

  // ------------------------------------------------------------- generation

  function generate(seed, opts) {
    const rng = new Carto.Random(seed);
    const theme = opts.theme && opts.theme !== 'auto' ? opts.theme : rng.fork('theme').pick(THEMES);
    const sizes = { small: [6, 8, 1], medium: [10, 14, 2], large: [16, 22, 4] };
    const [lo, hi, loopMax] = sizes[opts.size] || sizes.medium;
    const lr = rng.fork('layout');
    let best = null;
    for (let i = 0; i < 6; i++) {
      const target = lr.int(lo, hi);
      const res = layout(lr, target, lr.int(Math.max(0, loopMax - 1), loopMax));
      if (!best || res.rooms.length > best.rooms.length) best = res;
      if (res.rooms.length >= target) { best = res; break; }
    }
    const { areas, links, rooms } = best;

    // Door types.
    const dr = rng.fork('doors');
    for (const l of links) {
      l.type = l.loop ? dr.weighted([['secret', 3], ['open', 2], ['door', 2], ['bars', 1]])
        : dr.weighted([['open', 4], ['door', 5], ['locked', 1], ['bars', 0.7]]);
    }

    // Room graph and numbering (breadth first from the entrance).
    const neighbours = new Map(areas.map((a) => [a.id, []]));
    for (const l of links) { neighbours.get(l.a).push(l.b); neighbours.get(l.b).push(l.a); }
    const depth = new Map([[0, 0]]);
    const queue = [0];
    const order = [];
    while (queue.length) {
      const id = queue.shift();
      if (areas[id].kind === 'room') order.push(id);
      for (const n of neighbours.get(id)) if (!depth.has(n)) { depth.set(n, depth.get(id) + 1); queue.push(n); }
    }
    order.forEach((id, i) => { areas[id].num = i + 1; });

    // Room purposes.
    const pr = rng.fork('purpose');
    const kinds = Object.entries(T.kinds[theme]);
    const leaves = rooms.filter((r) => r !== rooms[0] && neighbours.get(r.id).length === 1);
    const deepest = rooms.slice(1).sort((a, b) => depth.get(b.id) - depth.get(a.id))[0];
    rooms[0].purpose = 'entrance';
    if (deepest) { deepest.purpose = T.boss[theme]; deepest.boss = true; }
    const spare = leaves.filter((r) => !r.purpose);
    if (spare.length) pr.pick(spare).purpose = 'vault';
    const spare2 = leaves.filter((r) => !r.purpose);
    if (spare2.length && pr.bool(0.6)) pr.pick(spare2).purpose = 'exit';
    for (const r of rooms) {
      if (r.purpose) continue;
      r.purpose = pr.weighted(kinds);
      if (r.purpose === 'flooded' && r.shape === 'round') r.purpose = 'well';
    }

    // Contents.
    const cr = rng.fork('contents');
    const monsters = T.monsters[theme];
    for (const r of rooms) {
      const doorsIn = [];
      for (const l of links) {
        if (l.a !== r.id && l.b !== r.id) continue;
        // cell inside the room next to the door
        const cand = l.door.vertical ? [[Math.floor(l.door.x - 1), Math.floor(l.door.y)], [Math.floor(l.door.x), Math.floor(l.door.y)]]
          : [[Math.floor(l.door.x), Math.floor(l.door.y - 1)], [Math.floor(l.door.x), Math.floor(l.door.y)]];
        for (const c of cand) if (c[0] >= r.x && c[0] < r.x + r.w && c[1] >= r.y && c[1] < r.y + r.h) doorsIn.push(c);
        if (l.type === 'secret') r.secret = true;
        if (l.type === 'locked') r.locked = true;
      }
      r.features = furnish(cr, r, r.purpose, doorsIn);
      r.text = { v: cr.int(0, T.rooms[r.purpose].length - 1) };
      if (r.purpose !== 'entrance' && r.purpose !== 'exit' && (r.boss || cr.bool(0.42))) {
        const mi = r.boss ? monsters.findIndex((m) => m[4]) : cr.int(0, monsters.length - 1);
        const m = monsters[Math.max(0, mi)];
        const n = m[4] ? 1 : cr.int(1, 5);
        r.text.monster = { i: Math.max(0, mi), n, s: cr.int(0, 2) };
      }
      if (r.purpose === 'vault' || cr.bool(r.boss ? 0.8 : 0.22)) {
        r.text.treasure = { i: cr.int(0, T.treasures.length - 1), s: cr.int(0, T.treasureSentences.length - 1), coins: cr.int(5, 50) * 10 };
      }
      if (r.purpose !== 'entrance' && cr.bool(0.14)) r.text.trap = cr.int(0, T.traps.length - 1);
    }

    // Title and story.
    const tr = rng.fork('title');
    const title = { place: tr.int(0, T.places[theme].length - 1), noun: tr.int(0, T.nouns.length - 1), adj: tr.int(0, T.adjs.length - 1) };
    const story = {
      opening: tr.int(0, T.openings.length - 1),
      rumor: tr.int(0, T.rumors[theme].length - 1),
      goal: tr.int(0, T.goals.length - 1),
      name: theme === 'mine' ? Carto.Names.place(tr) : Carto.Names.person(tr),
      treasure: tr.int(1, T.treasures.length - 1),
    };

    // Bounds in cells.
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const a of areas) {
      const cells = a.cells || [[a.x, a.y], [a.x + a.w - 1, a.y + a.h - 1]];
      for (const [x, y] of cells) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    }
    return { seed, theme, areas, links, rooms: order.map((id) => areas[id]), title, story, bounds: { x0, y0, x1: x1 + 1, y1: y1 + 1 } };
  }

  // ------------------------------------------------------------- text

  function titleText(m) {
    const l = L();
    const place = T.places[m.theme][m.title.place][l];
    const noun = T.nouns[m.title.noun];
    const adj = T.adjs[m.title.adj];
    if (l === 1) return place + ' of the ' + adj[4] + ' ' + noun[2];
    const g = { ms: 0, fs: 1, mp: 2, fp: 3 }[noun[1]];
    return place + ' ' + noun[0] + ' ' + adj[g];
  }

  function storyText(m) {
    const l = L(), s = m.story;
    const treasure = T.treasures[s.treasure][l].replace('{coins}', '300');
    return [
      T.openings[s.opening][l],
      T.rumors[m.theme][s.rumor][l].replace('{name}', s.name),
      T.goals[s.goal][l].replace('{treasure}', treasure),
    ].join(' ');
  }

  function roomText(m, r) {
    const l = L();
    const base = T.rooms[r.purpose][r.text.v % T.rooms[r.purpose].length][l];
    const dot = base.indexOf('. ');
    const head = dot > 0 ? base.slice(0, dot) : base;
    const parts = [dot > 0 ? base.slice(dot + 2) : ''];
    const tx = r.text;
    if (tx.monster) {
      const mm = T.monsters[m.theme][tx.monster.i];
      const n = tx.monster.n;
      const phrase = n === 1 ? mm[l === 0 ? 0 : 2] : T.numbers[n][l] + ' ' + mm[l === 0 ? 1 : 3];
      const sent = T.monsterSentences[n === 1 ? 'one' : 'many'][tx.monster.s][l];
      parts.push(sent.replace('{M}', cap(phrase)));
    }
    if (tx.treasure) {
      const tt = T.treasures[tx.treasure.i][l].replace('{coins}', tx.treasure.coins);
      parts.push(T.treasureSentences[tx.treasure.s][l].replace('{T}', tt));
    }
    if (tx.trap !== undefined) parts.push(T.trapSentence[l].replace('{R}', T.traps[tx.trap][l]));
    if (r.secret) parts.push(t('dungeon.secret'));
    else if (r.locked && r.purpose === 'vault') parts.push(t('dungeon.locked'));
    return { head, body: parts.filter(Boolean).join(' ') };
  }

  // ------------------------------------------------------------- rendering

  const CS = 16; // map units per grid cell

  function floorPath(a) {
    if (a.kind === 'corridor') {
      const b = new Svg.Batch();
      for (const [x, y] of a.cells) b.poly(G.rect((x + 0.5) * CS, (y + 0.5) * CS, CS, CS));
      return b.toString();
    }
    if (a.shape === 'round') return Svg.circle((a.x + a.w / 2) * CS, (a.y + a.h / 2) * CS, (a.w / 2) * CS);
    return Svg.d(G.rect((a.x + a.w / 2) * CS, (a.y + a.h / 2) * CS, a.w * CS, a.h * CS));
  }

  // Distance (in cells) from a point to the floor of an area.
  function distToArea(a, px, py) {
    if (a.kind === 'corridor') {
      let best = Infinity;
      for (const [x, y] of a.cells) {
        const dx = Math.max(x - px, 0, px - (x + 1)), dy = Math.max(y - py, 0, py - (y + 1));
        best = Math.min(best, Math.hypot(dx, dy));
      }
      return best;
    }
    if (a.shape === 'round') return Math.max(0, Math.hypot(px - (a.x + a.w / 2), py - (a.y + a.h / 2)) - a.w / 2);
    const dx = Math.max(a.x - px, 0, px - (a.x + a.w)), dy = Math.max(a.y - py, 0, py - (a.y + a.h));
    return Math.hypot(dx, dy);
  }

  function drawFeature(f, out, pal, rng) {
    const P = (v) => v * CS;
    switch (f.t) {
      case 'column': out.solid.circle(P(f.x), P(f.y), CS * 0.32); break;
      case 'statue':
        out.light.circle(P(f.x), P(f.y), CS * 0.42);
        out.thin.line({ x: P(f.x) - CS * 0.25, y: P(f.y) }, { x: P(f.x) + CS * 0.25, y: P(f.y) });
        out.thin.line({ x: P(f.x), y: P(f.y) - CS * 0.25 }, { x: P(f.x), y: P(f.y) + CS * 0.25 });
        break;
      case 'sarcophagus': {
        const r = G.rect(P(f.x), P(f.y), CS * 0.85, CS * 1.9, (f.ang * Math.PI) / 180);
        out.light.poly(r);
        out.thin.poly(G.scalePoly(r, 0.7));
        break;
      }
      case 'skull': out.light.circle(P(f.x), P(f.y), CS * 0.14); break;
      case 'altar': {
        const r = G.rect(P(f.x), P(f.y), CS * 1.8, CS * 0.8, (f.ang * Math.PI) / 180);
        out.dark.poly(r);
        break;
      }
      case 'circle': {
        out.accent.circle(P(f.x), P(f.y), P(f.r));
        out.accent.circle(P(f.x), P(f.y), P(f.r) * 0.86);
        const star = [];
        for (let i = 0; i < 5; i++) star.push(G.add({ x: P(f.x), y: P(f.y) }, G.fromAngle(-Math.PI / 2 + (i * 4 * Math.PI) / 5, P(f.r) * 0.86)));
        out.accent.poly(star);
        break;
      }
      case 'shelf':
      case 'rack2': {
        const len = Math.hypot(f.x1 - f.x0, f.y1 - f.y0) * CS;
        const r = G.rect(P((f.x0 + f.x1) / 2), P((f.y0 + f.y1) / 2), f.ang ? CS * 0.4 : len, f.ang ? len : CS * 0.4);
        out.light.poly(r);
        const n = Math.floor(len / CS);
        for (let i = 1; i < n; i++) {
          const tt = i / n;
          if (f.ang) out.thin.line({ x: r[0].x, y: r[0].y + len * tt }, { x: r[1].x, y: r[0].y + len * tt });
          else out.thin.line({ x: r[0].x + len * tt, y: r[0].y }, { x: r[0].x + len * tt, y: r[2].y });
        }
        break;
      }
      case 'table': out.light.poly(G.rect(P(f.x), P(f.y), CS * (f.ang ? 0.8 : 1.6), CS * (f.ang ? 1.6 : 0.8))); break;
      case 'stool': out.light.circle(P(f.x), P(f.y), CS * 0.22); break;
      case 'barrel': out.light.circle(P(f.x), P(f.y), CS * 0.3); out.thin.circle(P(f.x), P(f.y), CS * 0.15); break;
      case 'crate': {
        const r = G.rect(P(f.x), P(f.y), CS * 0.6, CS * 0.6, 0);
        out.light.poly(r);
        out.thin.line(r[0], r[2]);
        break;
      }
      case 'chest': {
        const r = G.rect(P(f.x), P(f.y), CS * (f.ang ? 0.5 : 0.8), CS * (f.ang ? 0.8 : 0.5));
        out.dark.poly(r);
        break;
      }
      case 'bed': {
        const vertical = f.side === 'n' || f.side === 's';
        out.light.poly(G.rect(P(f.x), P(f.y), CS * (vertical ? 0.75 : 1.5), CS * (vertical ? 1.5 : 0.75)));
        break;
      }
      case 'rack': {
        const r = G.rect(P(f.x), P(f.y), CS * (f.ang ? 0.9 : 2), CS * (f.ang ? 2 : 0.9));
        out.light.poly(r);
        out.thin.line(r[0], r[2]);
        out.thin.line(r[1], r[3]);
        break;
      }
      case 'throne': {
        out.dark.poly(G.rect(P(f.x), P(f.y), CS * 0.9, CS * 0.9));
        break;
      }
      case 'water': {
        const wr = new Carto.Random(f.seed);
        const pts = Draw.blob(wr, P(f.x), P(f.y), Math.min(P(f.rx), P(f.ry)) * 0.95, 11, 0.35)
          .map((p) => ({ x: P(f.x) + (p.x - P(f.x)) * (f.rx >= f.ry ? f.rx / f.ry : 1), y: P(f.y) + (p.y - P(f.y)) * (f.ry > f.rx ? f.ry / f.rx : 1) }));
        out.water.smooth(pts, true);
        out.ripple.smooth(G.scalePoly(pts, 0.7), true);
        out.ripple.smooth(G.scalePoly(pts, 0.4), true);
        break;
      }
      case 'rubble': out.light.poly(Draw.blob(rng, P(f.x), P(f.y), P(f.r), 6, 0.5)); break;
      case 'well':
        out.dark.circle(P(f.x), P(f.y), CS * 0.75);
        out.waterDot.circle(P(f.x), P(f.y), CS * 0.48);
        break;
      case 'nest': {
        const nr = new Carto.Random(f.seed);
        out.shade.smooth(Draw.blob(nr, P(f.x), P(f.y), P(f.r), 9, 0.4), true);
        break;
      }
      case 'bone': {
        const d = G.fromAngle((f.ang * Math.PI) / 180, CS * 0.3);
        out.thin.line({ x: P(f.x) - d.x, y: P(f.y) - d.y }, { x: P(f.x) + d.x, y: P(f.y) + d.y });
        break;
      }
      case 'hearth': {
        const vertical = f.side === 'e' || f.side === 'w';
        out.dark.poly(G.rect(P(f.x), P(f.y), CS * (vertical ? 0.7 : 1.6), CS * (vertical ? 1.6 : 0.7)));
        break;
      }
      case 'rails': {
        const { x, y, w, h, horiz } = f;
        const c = horiz ? y + h / 2 : x + w / 2;
        const a0 = (horiz ? x : y) * CS, a1 = (horiz ? x + w : y + h) * CS;
        for (const o of [-0.25, 0.25]) {
          const v = (c + o) * CS;
          out.thin.line(horiz ? { x: a0, y: v } : { x: v, y: a0 }, horiz ? { x: a1, y: v } : { x: v, y: a1 });
        }
        for (let s = a0 + CS * 0.25; s < a1; s += CS * 0.5) {
          const v0 = (c - 0.4) * CS, v1 = (c + 0.4) * CS;
          out.thin.line(horiz ? { x: s, y: v0 } : { x: v0, y: s }, horiz ? { x: s, y: v1 } : { x: v1, y: s });
        }
        break;
      }
      case 'mushroom': out.fungus.circle(P(f.x), P(f.y), P(f.r)); break;
      case 'cells': {
        const { x, y, w, h } = f.room;
        const depth = Math.min(2, Math.max(1, Math.floor((f.side === 'n' || f.side === 's' ? h : w) / 2)));
        const len = f.side === 'n' || f.side === 's' ? w : h;
        for (let i = 0; i <= len; i += 1.5) {
          if (f.side === 'n') out.wall.line({ x: P(x + i), y: P(y) }, { x: P(x + i), y: P(y + depth) });
          if (f.side === 's') out.wall.line({ x: P(x + i), y: P(y + h) }, { x: P(x + i), y: P(y + h - depth) });
          if (f.side === 'w') out.wall.line({ x: P(x), y: P(y + i) }, { x: P(x + depth), y: P(y + i) });
          if (f.side === 'e') out.wall.line({ x: P(x + w), y: P(y + i) }, { x: P(x + w - depth), y: P(y + i) });
        }
        const a = f.side === 'n' ? [{ x: P(x), y: P(y + depth) }, { x: P(x + w), y: P(y + depth) }]
          : f.side === 's' ? [{ x: P(x), y: P(y + h - depth) }, { x: P(x + w), y: P(y + h - depth) }]
            : f.side === 'w' ? [{ x: P(x + depth), y: P(y) }, { x: P(x + depth), y: P(y + h) }]
              : [{ x: P(x + w - depth), y: P(y) }, { x: P(x + w - depth), y: P(y + h) }];
        out.bars.line(a[0], a[1]);
        break;
      }
      case 'stairs': {
        const vertical = f.side === 'n' || f.side === 's';
        const r = G.rect(P(f.x), P(f.y), CS * (vertical ? 1 : 2), CS * (vertical ? 2 : 1));
        out.light.poly(r);
        const steps = 6;
        for (let i = 1; i < steps; i++) {
          const tt = i / steps;
          if (vertical) out.thin.line(G.lerp(r[0], r[3], tt), G.lerp(r[1], r[2], tt));
          else out.thin.line(G.lerp(r[0], r[1], tt), G.lerp(r[3], r[2], tt));
        }
        break;
      }
    }
  }

  function render(m, o) {
    const pal = o.palette;
    const pad = 3;
    const b = m.bounds;
    const mapW = (b.x1 - b.x0 + 2 * pad) * CS, mapH = (b.y1 - b.y0 + 2 * pad) * CS;
    const titleH = o.preview ? 0 : 84;
    const showPage = o.page !== false && !o.preview;

    // Text block under the map, in balanced columns.
    const fs = 13, lh = fs * 1.32;
    const pageW = Math.max(mapW, showPage ? 640 : 0);
    let notesH = 0;
    const columns = [];
    const story = storyText(m);
    const storyLines = showPage ? Draw.wrap(story, Math.floor(pageW / (fs * 0.5))) : [];
    if (showPage) {
      const nCols = pageW > 900 ? 3 : pageW > 560 ? 2 : 1;
      const colW = (pageW - 40 - (nCols - 1) * 22) / nCols;
      const maxChars = Math.floor(colW / (fs * 0.47));
      const blocks = m.rooms.map((r) => {
        const tx = roomText(m, r);
        const lines = Draw.wrap(r.num + '. ' + tx.head + '. ' + tx.body, maxChars);
        return { lines, h: lines.length * lh + fs * 0.6, head: r.num + '. ' + tx.head + '.' };
      });
      const total = blocks.reduce((s, q) => s + q.h, 0);
      let cur = { blocks: [], h: 0 };
      for (const blk of blocks) {
        if (cur.h > 0 && cur.h + blk.h > total / nCols + lh && columns.length < nCols - 1) { columns.push(cur); cur = { blocks: [], h: 0 }; }
        cur.blocks.push(blk);
        cur.h += blk.h;
      }
      columns.push(cur);
      notesH = Math.max(...columns.map((c) => c.h)) + storyLines.length * lh * 1.1 + 64;
      columns.colW = colW;
    }
    const W = pageW, H = titleH + mapH + notesH;
    const svg = new Svg(W, H);
    svg.rect(0, 0, W, H, { fill: pal.paper });
    const ox = (W - mapW) / 2 + (pad - b.x0) * CS, oy = titleH + (pad - b.y0) * CS;
    svg.open({ transform: 'translate(' + Svg.num(ox) + ' ' + Svg.num(oy) + ')' });

    // Hatching around the walls.
    const rng = new Carto.Random(m.seed + 99);
    const hatch = new Svg.Batch();
    const rooms = m.areas;
    for (let y = b.y0 - pad; y < b.y1 + pad; y++) {
      for (let x = b.x0 - pad; x < b.x1 + pad; x++) {
        let d = Infinity;
        for (const a of rooms) {
          d = Math.min(d, distToArea(a, x + 0.5, y + 0.5));
          if (d === 0) break;
        }
        if (d === 0 || d > 2.1) continue;
        const n = d < 1.2 ? 2 : rng.bool(0.6) ? 1 : 0;
        for (let i = 0; i < n; i++) {
          Draw.hatchCluster(hatch, rng, (x + rng.next()) * CS, (y + rng.next()) * CS, CS * 0.78, rng.float(0, Math.PI), 3);
        }
      }
    }
    svg.path(hatch.toString(), { stroke: pal.hatch, strokeWidth: CS * 0.07, strokeLinecap: 'round', fill: 'none', opacity: 0.9 });

    // Walls: a thick outline of every floor shape, then the floors on top.
    const floors = new Svg.Batch();
    for (const a of rooms) floors.add(floorPath(a));
    const fd = floors.toString();
    svg.path(fd, { fill: pal.ink, stroke: pal.ink, strokeWidth: CS * 0.5, strokeLinejoin: 'round' });
    svg.path(fd, { fill: pal.floor });

    // Grid lines, clipped to the floors.
    if (o.grid !== false) {
      const gclip = Carto.uid('dgrid');
      svg.defs('<clipPath id="' + gclip + '"><path d="' + fd + '"/></clipPath>');
      const grid = new Svg.Batch();
      for (let x = b.x0; x <= b.x1; x++) grid.line({ x: x * CS, y: b.y0 * CS }, { x: x * CS, y: b.y1 * CS });
      for (let y = b.y0; y <= b.y1; y++) grid.line({ x: b.x0 * CS, y: y * CS }, { x: b.x1 * CS, y: y * CS });
      svg.path(grid.toString(), { stroke: pal.grid, strokeWidth: CS * 0.05, fill: 'none', clipPath: 'url(#' + gclip + ')' });
    }

    // Furniture.
    const out = {
      solid: new Svg.Batch(), light: new Svg.Batch(), dark: new Svg.Batch(), thin: new Svg.Batch(),
      water: new Svg.Batch(), ripple: new Svg.Batch(), waterDot: new Svg.Batch(), shade: new Svg.Batch(),
      fungus: new Svg.Batch(), wall: new Svg.Batch(), bars: new Svg.Batch(), accent: new Svg.Batch(),
    };
    const fr = new Carto.Random(m.seed + 5);
    for (const r of m.rooms) for (const f of r.features || []) drawFeature(f, out, pal, fr);
    svg.path(out.water.toString(), { fill: pal.water, stroke: pal.waterInk, strokeWidth: CS * 0.07 });
    svg.path(out.ripple.toString(), { fill: 'none', stroke: pal.waterInk, strokeWidth: CS * 0.05, opacity: 0.6 });
    svg.path(out.shade.toString(), { fill: pal.paperShade, stroke: pal.inkSoft, strokeWidth: CS * 0.05 });
    svg.path(out.fungus.toString(), { fill: pal.green, stroke: pal.greenInk, strokeWidth: CS * 0.05 });
    svg.path(out.accent.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: CS * 0.08 });
    svg.path(out.light.toString(), { fill: pal.floor, stroke: pal.ink, strokeWidth: CS * 0.075, strokeLinejoin: 'round' });
    svg.path(out.dark.toString(), { fill: pal.inkSoft, stroke: pal.ink, strokeWidth: CS * 0.075 });
    svg.path(out.waterDot.toString(), { fill: pal.water, stroke: pal.ink, strokeWidth: CS * 0.05 });
    svg.path(out.thin.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: CS * 0.05, strokeLinecap: 'round' });
    svg.path(out.solid.toString(), { fill: pal.ink });
    svg.path(out.wall.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: CS * 0.25 });
    svg.path(out.bars.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: CS * 0.12, strokeDasharray: (CS * 0.05) + ' ' + (CS * 0.16), strokeLinecap: 'round' });

    // Doors.
    const doors = new Svg.Batch(), doorsDark = new Svg.Batch(), secretWalls = new Svg.Batch(), barred = new Svg.Batch();
    for (const l of m.links) {
      const d = l.door;
      const x = d.x * CS, y = d.y * CS;
      const along = d.vertical ? { x: 0, y: 1 } : { x: 1, y: 0 };
      if (l.type === 'door' || l.type === 'locked') {
        const r = G.rect(x, y, CS * (d.vertical ? 0.36 : 0.8), CS * (d.vertical ? 0.8 : 0.36));
        doors.poly(r);
        if (l.type === 'locked') doorsDark.poly(G.rect(x, y, CS * 0.22, CS * 0.22));
      } else if (l.type === 'secret') {
        secretWalls.line(G.add({ x, y }, G.scale(along, -CS / 2)), G.add({ x, y }, G.scale(along, CS / 2)));
      } else if (l.type === 'bars') {
        for (const s of [-0.3, 0, 0.3]) barred.circle(x + along.x * s * CS, y + along.y * s * CS, CS * 0.08);
      }
    }
    svg.path(secretWalls.toString(), { stroke: pal.ink, strokeWidth: CS * 0.5, fill: 'none' });
    svg.path(doors.toString(), { fill: pal.floor, stroke: pal.ink, strokeWidth: CS * 0.09 });
    svg.path(doorsDark.toString(), { fill: pal.ink });
    svg.path(barred.toString(), { fill: pal.ink });
    for (const l of m.links) {
      if (l.type !== 'secret') continue;
      const d = l.door;
      const off = d.vertical ? { x: 0, y: -CS * 0.95 } : { x: -CS * 0.95, y: 0 };
      Draw.label(svg, d.x * CS + off.x, d.y * CS + off.y, 'S', CS * 0.75, pal, { title: true, halo: true, haloColor: pal.floor });
    }

    // Room numbers.
    for (const r of m.rooms) {
      const cx = (r.x + r.w / 2) * CS, cy = (r.y + r.h / 2) * CS;
      let px = cx, py = cy;
      // Keep numbers off central furniture.
      if ((r.features || []).some((f) => f.x !== undefined && Math.hypot(f.x * CS - cx, f.y * CS - cy) < CS * 0.9)) {
        px = (r.x + 0.75) * CS + (r.w > 2 ? CS * 0.1 : 0);
        py = (r.y + 0.8) * CS;
      }
      Draw.label(svg, px, py, String(r.num), CS * 0.95, pal, { haloColor: pal.floor, haloWidth: 0.4 });
    }
    svg.close();

    // Title, story and key.
    if (!o.preview) {
      Draw.title(svg, W / 2, 46, titleText(m), 34, pal);
      if (showPage) {
        let y = titleH + mapH + 22;
        for (const line of storyLines) {
          Draw.label(svg, W / 2, y, line, fs * 1.08, pal, { italic: true, halo: false });
          y += lh * 1.1;
        }
        y += 12;
        let x = 20;
        for (const col of columns) {
          let cy = y;
          for (const blk of col.blocks) {
            blk.lines.forEach((line, i) => {
              if (i === 0) {
                // Bold-ish heading: the room name in small capitals.
                const headEnd = blk.head.length;
                const first = line.length > headEnd ? line.slice(0, headEnd) : line;
                const rest = line.length > headEnd ? line.slice(headEnd) : '';
                svg.raw('<text x="' + Svg.num(x) + '" y="' + Svg.num(cy) + '" font-family="' + Draw.FONT_LABEL + '" font-size="' + fs + '" fill="' + pal.label + '">' +
                  '<tspan font-family="' + Draw.FONT_TITLE + '">' + Svg.esc(first) + '</tspan>' + Svg.esc(rest) + '</text>');
              } else {
                Draw.label(svg, x, cy, line, fs, pal, { anchor: 'start', halo: false, baseline: 'auto' });
              }
              cy += lh;
            });
            cy += fs * 0.6;
          }
          x += columns.colW + 22;
        }
      }
    }
    return svg.toString();
  }

  function notes(m) {
    const esc = Svg.esc;
    let h = '<h3>' + esc(titleText(m)) + '</h3><p class="story">' + esc(storyText(m)) + '</p><ol>';
    for (const r of m.rooms) {
      const tx = roomText(m, r);
      h += '<li value="' + r.num + '"><strong>' + esc(tx.head) + '.</strong> ' + esc(tx.body) + '</li>';
    }
    return h + '</ol><p class="tag">' + esc(t('dungeon.legend')) + '</p>';
  }

  Carto.register({
    id: 'dungeon',
    order: 5,
    options: [
      { id: 'size', type: 'select', values: ['small', 'medium', 'large'], def: 'medium' },
      { id: 'theme', type: 'select', values: ['auto', 'tomb', 'temple', 'lair', 'prison', 'mine', 'sanctum'], def: 'auto' },
      { id: 'page', type: 'bool', def: true, renderOnly: true },
      { id: 'grid', type: 'bool', def: true, renderOnly: true },
    ],
    previewOptions: { size: 'small' },
    generate,
    render,
    notes,
    fileName: (m) => titleText(m),
  });

  Carto.Dungeon = { generate, render, titleText };
})(window.Carto = window.Carto || {});
