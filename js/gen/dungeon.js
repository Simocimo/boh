/* Dungeon generator: rooms and corridors on a grid, drawn in the cross-hatched
   style of hand-made dungeon maps, with a keyed description of every room. */
(function (Carto) {
  'use strict';

  const G = Carto.G, Svg = Carto.Svg, Draw = Carto.Draw, t = Carto.t;
  const I18n = Carto.I18n;

  I18n.add({
    it: {
      'gen.dungeon.name': 'Dungeon',
      'dungeon.3d.corridors': 'Corridoi',
      'dungeon.3d.rock': 'Roccia',
      'dungeon.3d.doors': 'Porte',
      'dungeon.3d.iron': 'Grate e serrature',
      'dungeon.3d.secret': 'Porte segrete',
      'dungeon.3d.lintels': 'Architravi',
      'dungeon.3d.furniture': 'Arredi',
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
      // Present day (2026).
      'dungeon.opt.theme.tomb@modern': 'Ospedale',
      'dungeon.opt.theme.temple@modern': 'Setta',
      'dungeon.opt.theme.lair@modern': 'Gang',
      'dungeon.opt.theme.prison@modern': 'Bunker',
      'dungeon.opt.theme.mine@modern': 'Metro',
      'dungeon.opt.theme.sanctum@modern': 'Laboratorio',
      'dungeon.secret@modern': 'Un pannello nasconde una porta segreta in una parete.',
      'dungeon.locked@modern': 'Una porta blindata è chiusa a chiave.',
      'dungeon.legend@modern': 'S: porta segreta · ■: porta chiusa a chiave · ⋮: cancello a sbarre',
      'dungeon.3d.rock@modern': 'Muri',
      'dungeon.3d.iron@modern': 'Sbarre e serrature',
      'dungeon.3d.secret@modern': 'Pannelli nascosti',
      // Cyberpunk.
      'dungeon.opt.theme.tomb@cyber': 'Clinica',
      'dungeon.opt.theme.temple@cyber': 'Culto IA',
      'dungeon.opt.theme.lair@cyber': 'Gang',
      'dungeon.opt.theme.prison@cyber': 'Sito nero',
      'dungeon.opt.theme.mine@cyber': 'Sottocittà',
      'dungeon.opt.theme.sanctum@cyber': 'Centro dati',
      'dungeon.secret@cyber': 'Un pannello olografico nasconde un passaggio in una parete.',
      'dungeon.locked@cyber': 'Una porta è sigillata da una serratura elettronica.',
      'dungeon.legend@cyber': 'S: passaggio nascosto · ■: serratura elettronica · ⋮: barriera di sicurezza',
      'dungeon.3d.rock@cyber': 'Pareti',
      'dungeon.3d.iron@cyber': 'Barriere e serrature',
      'dungeon.3d.secret@cyber': 'Passaggi nascosti',
      'dungeon.3d.lintels@cyber': 'Telai',
    },
    en: {
      'gen.dungeon.name': 'Dungeon',
      'dungeon.3d.corridors': 'Corridors',
      'dungeon.3d.rock': 'Rock',
      'dungeon.3d.doors': 'Doors',
      'dungeon.3d.iron': 'Bars and locks',
      'dungeon.3d.secret': 'Secret doors',
      'dungeon.3d.lintels': 'Lintels',
      'dungeon.3d.furniture': 'Furniture',
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
      // Present day (2026).
      'dungeon.opt.theme.tomb@modern': 'Hospital',
      'dungeon.opt.theme.temple@modern': 'Cult',
      'dungeon.opt.theme.lair@modern': 'Gang',
      'dungeon.opt.theme.prison@modern': 'Bunker',
      'dungeon.opt.theme.mine@modern': 'Subway',
      'dungeon.opt.theme.sanctum@modern': 'Laboratory',
      'dungeon.secret@modern': 'A panel hides a secret door in one wall.',
      'dungeon.locked@modern': 'A steel door is locked.',
      'dungeon.legend@modern': 'S: secret door · ■: locked door · ⋮: barred gate',
      'dungeon.3d.rock@modern': 'Walls',
      'dungeon.3d.secret@modern': 'Hidden panels',
      // Cyberpunk.
      'dungeon.opt.theme.tomb@cyber': 'Clinic',
      'dungeon.opt.theme.temple@cyber': 'AI cult',
      'dungeon.opt.theme.lair@cyber': 'Gang',
      'dungeon.opt.theme.prison@cyber': 'Black site',
      'dungeon.opt.theme.mine@cyber': 'Undercity',
      'dungeon.opt.theme.sanctum@cyber': 'Server farm',
      'dungeon.secret@cyber': 'A holographic panel hides a passage in one wall.',
      'dungeon.locked@cyber': 'One door is sealed by a maglock.',
      'dungeon.legend@cyber': 'S: hidden passage · ■: maglock · ⋮: security bars',
      'dungeon.3d.rock@cyber': 'Walls',
      'dungeon.3d.iron@cyber': 'Barriers and locks',
      'dungeon.3d.secret@cyber': 'Hidden passages',
      'dungeon.3d.lintels@cyber': 'Frames',
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

  // Present day (2026): the same theme ids become an abandoned hospital, a
  // cult compound, a gang hideout, a Cold War bunker, disused metro tunnels and
  // a research lab. Titles are "place + name" (nouns per theme, the English
  // may put the place inside with {p}); story names can be companies.
  const TM = Object.assign({}, T, {
    places: {
      tomb: [['Ospedale', 'Hospital'], ['Sanatorio', 'Sanatorium'], ['Clinica', 'Clinic'], ['Ospedale psichiatrico', 'Asylum']],
      temple: [['Comunità', 'Community'], ['Tempio', 'Temple'], ['Rifugio', 'Retreat']],
      lair: [['Covo', 'Hideout'], ['Officina', 'Garage'], ['Magazzino', 'Warehouse']],
      prison: [['Bunker', 'Bunker'], ['Base', 'Base'], ['Rifugio antiatomico', 'Fallout Shelter']],
      mine: [['Stazione', 'Station'], ['Gallerie', 'Tunnels'], ['Fogne', 'Sewers'], ['Deposito', 'Depot']],
      sanctum: [['Laboratori', 'Laboratories'], ['Istituto', 'Institute'], ['Centro ricerche', 'Research Centre']],
    },
    nouns: {
      tomb: [['San Gerardo', 'St. Gerard'], ['Santa Lucia', 'St. Lucy'], ['Sant’Agata', 'St. Agatha'], ['Villa Serena', 'Villa Serena'],
        ['Villa Azzurra', 'Bluewater'], ['Le Querce', 'Oakwood'], ['Pineta', 'Pinewood'], ['Monteverde', 'Greenhill']],
      temple: [['della Nuova Alba', 'New Dawn'], ['della Luce Interiore', 'Inner Light'], ['dell’Ultimo Giorno', 'Last Day'], ['del Risveglio', 'Awakening'],
        ['della Seconda Nascita', 'Second Birth'], ['dei Figli del Sole', 'Children of the Sun'], ['della Grande Quiete', 'Great Stillness'], ['del Cerchio Bianco', 'White Circle']],
      lair: [['dei Lupi Neri', 'Black Wolves'], ['dei Corvi', 'Crows'], ['delle Vipere', 'Vipers'], ['dei Re della Strada', 'Street Kings'],
        ['dei Diavoli Rossi', 'Red Devils'], ['dei Cani Sciolti', 'Stray Dogs'], ['degli Scorpioni', 'Scorpions'], ['della Banda del Porto', 'Harbour Crew']],
      prison: [['Delta-7', 'Delta-7'], ['Sigma', 'Sigma'], ['Orione', 'Orion'], ['Cassiopea', 'Cassiopeia'], ['K-12', 'K-12'], ['Zulu', 'Zulu'], ['Aurora', 'Aurora']],
      mine: [['di Porta Nord', 'North Gate'], ['del Vecchio Mercato', 'Old Market'], ['di San Teodoro', 'St. Theodore'], ['dell’Arsenale', 'Arsenal'],
        ['della Cittadella', 'Citadel'], ['delle Fornaci', 'Furnace Street'], ['di Ponte Vecchio', 'Old Bridge']],
      sanctum: [['Prometeo', 'Prometheus'], ['Minerva', 'Minerva'], ['Galeno', 'Galen'], ['Atlante', 'Atlas'], ['Genesi', 'Genesis'],
        ['Iperione', 'Hyperion'], ['Chimera', 'Chimera'], ['Fenice', 'Phoenix']],
    },
    storyNames: { tomb: 'person', temple: 'person', lair: 'person', prison: 'corp', mine: 'place', sanctum: 'corp' },
    coinMul: 10,
    openings: [
      ['Da anni nessuno mette piede qui sotto.', 'No one has set foot down here in years.'],
      ['Un video girato da due ragazzi è diventato virale; poi i ragazzi sono spariti.', 'A video shot by two teenagers went viral; then the teenagers vanished.'],
      ['Uno scavo per i lavori stradali ha aperto un accesso dimenticato.', 'Roadworks have broken into a forgotten access shaft.'],
      ['Una fonte anonima ha mandato le coordinate e una sola parola: «sbrigatevi».', 'An anonymous source sent the coordinates and a single word: “hurry”.'],
      ['La polizia ha chiuso le indagini troppo in fretta.', 'The police closed the investigation far too quickly.'],
      ['Un giornalista ha lasciato un messaggio in segreteria, poi più nulla.', 'A journalist left a voicemail, then nothing more.'],
    ],
    rumors: {
      tomb: [['Si dice che {name}, ex medico del reparto, continui a operare qui sotto.', 'They say {name}, once a doctor here, still operates down below.'], ['Le cartelle dei pazienti di {name} sono sparite il giorno della chiusura.', 'The files of {name}’s patients vanished the day the hospital closed.']],
      temple: [['La comunità di {name} promette la salvezza a chi rinuncia a tutto.', 'The community of {name} promises salvation to those who give up everything.'], ['I seguaci di {name} si riuniscono qui sotto a ogni luna nuova.', 'The followers of {name} gather down here every new moon.']],
      lair: [['La gang di {name} usa questo posto come base.', '{name}’s gang uses this place as its base.'], ['Le rapine degli ultimi mesi portano tutte alla banda di {name}.', 'Every robbery of the last few months leads back to {name}’s crew.']],
      prison: [['Dismesso nel 1991, il bunker è stato comprato in segreto dalla {name}.', 'Decommissioned in 1991, the bunker was secretly bought by {name}.'], ['Chi lavora per la {name} non parla mai di cosa succede qui sotto.', 'No one who works for {name} ever talks about what happens down here.']],
      mine: [['La stazione di {name} fu chiusa nel 1987, dopo un incidente mai chiarito.', '{name} station was closed in 1987 after an accident that was never explained.'], ['Sotto {name} corre una linea della metropolitana che non compare su nessuna mappa.', 'Beneath {name} runs a metro line that appears on no map.']],
      sanctum: [['Qui la {name} conduceva ricerche che nessun comitato etico avrebbe approvato.', 'Here {name} ran research no ethics board would ever have approved.'], ['La {name} giura che questo laboratorio è chiuso da anni.', '{name} swears this laboratory has been closed for years.']],
    },
    goals: [
      ['Un cliente anonimo paga bene chi gli riporterà {treasure}.', 'An anonymous client pays well for whoever brings back {treasure}.'],
      ['Bisogna scoprire che cosa succede qui sotto prima che ci scappi il morto.', 'Someone has to find out what is going on down here before somebody gets killed.'],
      ['Una famiglia cerca notizie di una persona scomparsa, vista l’ultima volta qui.', 'A family is looking for a missing person, last seen here.'],
    ],
    rooms: {
      entrance: [['Ingresso. Una scala di servizio scende dal livello della strada.', 'Entrance. A service stair leads down from street level.'], ['Ingresso. Un portellone forzato si apre su gradini di cemento.', 'Entrance. A forced hatch opens onto concrete steps.']],
      guard: [['Guardiola. Monitor spenti e un posacenere traboccante.', 'Security booth. Dead monitors and an overflowing ashtray.'], ['Posto di controllo. Una sbarra e un tornello bloccano il passaggio.', 'Checkpoint. A barrier and a turnstile block the way.']],
      storage: [['Magazzino. Scatoloni sfondati e scaffali di metallo piegati.', 'Storeroom. Burst cardboard boxes and buckled metal shelving.'], ['Deposito. Fusti di plastica e bancali accatastati.', 'Depot. Plastic drums and stacked pallets.']],
      barracks: [['Dormitorio. Brandine da campo e sacchi a pelo ammuffiti.', 'Dormitory. Camp beds and mouldy sleeping bags.']],
      armory: [['Armeria. Rastrelliere vuote; resta solo una cassetta di munizioni.', 'Armoury. Empty racks; only an ammunition box remains.']],
      prison: [['Celle. Sbarre verniciate di grigio e brande fissate al muro.', 'Cells. Grey-painted bars and bunks bolted to the wall.'], ['Blocco di detenzione. Sulle porte, spioncini e numeri dipinti a stampo.', 'Detention block. Peepholes and stencilled numbers on the doors.']],
      hall: [['Atrio. Pilastri di cemento reggono un soffitto macchiato d’umidità.', 'Lobby. Concrete pillars hold up a damp-stained ceiling.']],
      kitchen: [['Mensa. Una cucina industriale e tavoli d’acciaio incrostati.', 'Canteen. An industrial kitchen and crusted steel tables.']],
      flooded: [['Locale allagato. L’acqua torbida arriva alle caviglie.', 'Flooded room. Murky water reaches the ankles.'], ['Vasca di raccolta. Una pozza d’acqua scura occupa gran parte della stanza.', 'Sump. A pool of dark water fills most of the room.']],
      collapsed: [['Crollo. Una soletta è venuta giù; si passa a fatica tra i calcinacci.', 'Collapse. A floor slab has come down; one squeezes through the rubble.']],
      well: [['Pozzo d’ispezione. Una grata copre un pozzo da cui sale aria fredda.', 'Inspection shaft. A grate covers a shaft breathing cold air.']],
      lab: [['Laboratorio. Banconi, provette rotte e un forte odore di solventi.', 'Laboratory. Benches, broken test tubes and a sharp smell of solvents.'], ['Laboratorio di analisi. Una centrifuga gira ancora.', 'Analysis lab. A centrifuge is still spinning.']],
      archive: [['Archivio. Schedari rovesciati e faldoni sparsi sul pavimento.', 'Archive. Overturned filing cabinets and binders strewn across the floor.']],
      shrine: [['Cappella. Un altare improvvisato coperto di candele e fotografie.', 'Chapel. A makeshift altar covered in candles and photographs.'], ['Sala di preghiera. Il simbolo della setta è dipinto sul muro.', 'Prayer room. The cult’s symbol is painted on the wall.']],
      ritual: [['Sala delle cerimonie. Un cerchio dipinto sul pavimento, circondato da sedie.', 'Ceremony hall. A circle painted on the floor, ringed by chairs.']],
      lair: [['Bivacco. Materassi lerci, lattine vuote e cartoni di pizza.', 'Squat. Filthy mattresses, empty cans and pizza boxes.']],
      throne: [['Ufficio del capo. Una poltrona di pelle sotto la bandiera della gang.', 'Boss’s office. A leather armchair under the gang’s flag.']],
      mine: [['Galleria. Binari arrugginiti si perdono nel buio.', 'Tunnel. Rusty tracks disappear into the dark.'], ['Galleria di servizio. Un carrello di manutenzione è abbandonato sui binari.', 'Service tunnel. A maintenance trolley stands abandoned on the tracks.']],
      platform: [['Banchina. Piastrelle sbeccate e un cartellone pubblicitario del 1985.', 'Platform. Chipped tiles and an advertising poster from 1985.']],
      sewer: [['Collettore. Un canale d’acqua scura scorre lentamente.', 'Sewer main. A channel of dark water flows sluggishly.']],
      fungus: [['Stanza della muffa. Chiazze nere coprono muri e soffitto; l’aria è irrespirabile.', 'Mould room. Black patches cover walls and ceiling; the air is barely breathable.']],
      morgue: [['Obitorio. Celle frigorifere aperte e tavoli d’acciaio.', 'Morgue. Open cold-storage drawers and steel tables.'], ['Camera mortuaria. Barelle abbandonate e un odore pungente di formalina.', 'Mortuary. Abandoned stretchers and a sharp smell of formalin.']],
      ward: [['Corsia. Letti arrugginiti in fila, con le flebo ancora appese.', 'Ward. Rows of rusty beds, IV drips still hanging.'], ['Reparto. Lenzuola ingiallite e cartelle cliniche sparse.', 'Ward. Yellowed sheets and scattered medical charts.']],
      surgery: [['Sala operatoria. Un lettino sotto la lampada scialitica; gli strumenti sono puliti.', 'Operating theatre. A table under the surgical lamp; the instruments are clean.'], ['Sala operatoria. Teli verdi strappati e un carrello di ferri arrugginiti.', 'Operating theatre. Torn green drapes and a trolley of rusty instruments.']],
      office: [['Uffici. Scrivanie, sedie girevoli e computer di vent’anni fa.', 'Offices. Desks, swivel chairs and twenty-year-old computers.']],
      garage: [['Garage. Auto senza targa e attrezzi sparsi sul pavimento.', 'Garage. Cars without plates and tools strewn across the floor.']],
      plant: [['Sala macchine. Un generatore diesel e tubi che gocciolano.', 'Plant room. A diesel generator and dripping pipes.']],
      control: [['Sala comando. Console spente e una mappa murale piena di puntine.', 'Control room. Dead consoles and a wall map full of pins.']],
      servers: [['Sala server. Gli armadi rack ronzano ancora, alimentati chissà da dove.', 'Server room. The racks are still humming, powered from who knows where.']],
      vats: [['Sala colture. Vasche di vetro piene di un liquido torbido.', 'Culture room. Glass tanks full of a cloudy liquid.']],
      vault: [['Caveau. Cassette di sicurezza forzate a metà coprono le pareti.', 'Vault. Half-forced safe-deposit boxes line the walls.']],
      empty: [['Stanza vuota. Polvere, calcinacci e silenzio.', 'Empty room. Dust, fallen plaster and silence.'], ['Stanza spoglia. Sul muro qualcuno ha scritto un avvertimento con la bomboletta.', 'Bare room. Someone has spray-painted a warning on the wall.']],
      exit: [['Vano scala. I gradini scendono verso livelli ancora più profondi.', 'Stairwell. Steps lead down to even deeper levels.']],
    },
    kinds: {
      tomb: { ward: 4, morgue: 2, surgery: 1.5, office: 1, storage: 1, hall: 1, kitchen: 0.7, lab: 0.7, collapsed: 1, flooded: 0.7, fungus: 0.7, empty: 1.5 },
      temple: { shrine: 3, ritual: 2, barracks: 1.5, kitchen: 1, archive: 1, office: 1, storage: 1, prison: 0.7, hall: 1, empty: 1 },
      lair: { lair: 2, storage: 2, garage: 2, guard: 2, barracks: 1, kitchen: 1, armory: 1, prison: 0.7, collapsed: 0.5, empty: 1 },
      prison: { prison: 3, guard: 2, barracks: 2, armory: 1.5, storage: 1.5, control: 1, plant: 1, kitchen: 1, flooded: 0.7, empty: 1 },
      mine: { mine: 4, platform: 2, sewer: 2, collapsed: 1.5, storage: 1, plant: 1, lair: 1, well: 1, fungus: 1, empty: 1 },
      sanctum: { lab: 3, office: 2, archive: 1.5, servers: 1, vats: 1, storage: 1, surgery: 0.5, hall: 1, flooded: 0.5, empty: 1 },
    },
    boss: { tomb: 'surgery', temple: 'ritual', lair: 'throne', prison: 'control', mine: 'lair', sanctum: 'lab' },
    monsters: {
      tomb: [['un saccheggiatore', 'saccheggiatori', 'a looter', 'looters'], ['un cane randagio', 'cani randagi', 'a stray dog', 'stray dogs'], ['un ladro di rame', 'ladri di rame', 'a copper thief', 'copper thieves'], ['un ratto', 'ratti', 'a rat', 'rats'], ['un chirurgo radiato', 'chirurghi radiati', 'a struck-off surgeon', 'struck-off surgeons', 1]],
      temple: [['un adepto', 'adepti', 'a cultist', 'cultists'], ['una guardia della setta', 'guardie della setta', 'a cult guard', 'cult guards'], ['un reclutatore', 'reclutatori', 'a recruiter', 'recruiters'], ['un dobermann', 'dobermann', 'a Dobermann', 'Dobermanns'], ['il guru', 'guru', 'the guru', 'gurus', 1]],
      lair: [['un membro della gang', 'membri della gang', 'a gang member', 'gang members'], ['una vedetta', 'vedette', 'a lookout', 'lookouts'], ['un pitbull', 'pitbull', 'a pit bull', 'pit bulls'], ['un picchiatore', 'picchiatori', 'an enforcer', 'enforcers'], ['il capobanda', 'capibanda', 'the gang leader', 'gang leaders', 1]],
      prison: [['un mercenario', 'mercenari', 'a mercenary', 'mercenaries'], ['una guardia armata', 'guardie armate', 'an armed guard', 'armed guards'], ['un drone di sorveglianza', 'droni di sorveglianza', 'a surveillance drone', 'surveillance drones'], ['un prigioniero in fuga', 'prigionieri in fuga', 'an escaped prisoner', 'escaped prisoners'], ['il comandante', 'comandanti', 'the commander', 'commanders', 1]],
      mine: [['un contrabbandiere', 'contrabbandieri', 'a smuggler', 'smugglers'], ['un ratto', 'ratti', 'a rat', 'rats'], ['un cane randagio', 'cani randagi', 'a stray dog', 'stray dogs'], ['un ricettatore', 'ricettatori', 'a fence', 'fences'], ['un alligatore', 'alligatori', 'an alligator', 'alligators', 1]],
      sanctum: [['una guardia giurata', 'guardie giurate', 'a security guard', 'security guards'], ['un drone di sicurezza', 'droni di sicurezza', 'a security drone', 'security drones'], ['una cavia fuggita', 'cavie fuggite', 'an escaped test subject', 'escaped test subjects'], ['un ricercatore', 'ricercatori', 'a researcher', 'researchers'], ['il Soggetto Zero', 'Soggetti Zero', 'Subject Zero', 'Subject Zeros', 1]],
    },
    monsterSentences: {
      one: [['{M} si aggira nella stanza.', '{M} prowls the room.'], ['{M} fa la guardia.', '{M} stands guard.'], ['{M} attende immobile nella penombra.', '{M} waits motionless in the gloom.']],
      many: [['{M} si aggirano nella stanza.', '{M} prowl the room.'], ['{M} fanno la guardia.', '{M} stand guard.'], ['{M} attendono immobili nella penombra.', '{M} wait motionless in the gloom.']],
    },
    treasures: [
      ['una busta con {coins} euro in contanti', 'an envelope holding {coins} euros in cash'],
      ['un portatile pieno di dati compromettenti', 'a laptop full of compromising data'],
      ['una chiavetta USB cifrata', 'an encrypted USB stick'],
      ['un mazzo di tessere magnetiche', 'a bundle of keycards'],
      ['un orologio d’oro', 'a gold wristwatch'],
      ['una pistola con due caricatori', 'a pistol with two magazines'],
      ['una valigetta di documenti riservati', 'a briefcase of classified documents'],
      ['la piantina dei livelli inferiori', 'a floor plan of the lower levels'],
      ['un taccuino pieno di codici e nomi', 'a notebook full of codes and names'],
      ['lingotti d’oro avvolti in un asciugamano', 'gold bars wrapped in a towel'],
      ['un telefono satellitare', 'a satellite phone'],
      ['un disco rigido con l’etichetta «NON APRIRE»', 'a hard drive labelled “DO NOT OPEN”'],
    ],
    treasureSentences: [['In una cassaforte a muro: {T}.', 'In a wall safe: {T}.'], ['In un armadietto: {T}.', 'In a locker: {T}.'], ['Sotto una piastrella smossa: {T}.', 'Under a loose tile: {T}.']],
    traps: [
      ['un filo teso fa esplodere una granata', 'a tripwire sets off a grenade'],
      ['un sensore di movimento fa scattare l’allarme', 'a motion sensor trips the alarm'],
      ['il pavimento marcio cede sul piano di sotto', 'the rotten floor gives way to the level below'],
      ['un cavo scoperto mette in tensione l’acqua a terra', 'a bare cable electrifies the water on the floor'],
      ['una porta tagliafuoco si chiude alle spalle degli intrusi', 'a fire door slams shut behind intruders'],
      ['una tagliola è nascosta tra i detriti', 'a bear trap is hidden in the debris'],
      ['una fuga di gas aspetta solo una scintilla', 'a gas leak is just waiting for a spark'],
    ],
  });

  // Cyberpunk: a back-alley clinic and body bank, the data temple of an AI
  // cult, a gang den, a corporate black site, the undercity's maintenance
  // tunnels and a corporate server farm.
  const TC = Object.assign({}, T, {
    places: {
      tomb: [['Clinica', 'Clinic'], ['Banca dei corpi', 'Body Bank'], ['Ambulatorio', 'Med Center']],
      temple: [['Tempio', 'Temple'], ['Santuario', 'Shrine'], ['Chiesa', 'Church']],
      lair: [['Covo', 'Den'], ['Tana', 'Lair'], ['Garage', 'Garage']],
      prison: [['Sito nero', 'Black Site'], ['Struttura', 'Facility'], ['Centro di detenzione', 'Detention Center']],
      mine: [['Sottocittà', 'Undercity'], ['Tunnel di servizio', 'Service Tunnels'], ['Condotti', 'Conduits']],
      sanctum: [['Centro dati', 'Data Center'], ['Server farm', 'Server Farm'], ['Laboratorio', 'Lab']],
    },
    nouns: {
      tomb: [['Loto Nero', 'Black Lotus'], ['Seconda Pelle', 'Second Skin'], ['Mano Ferma', 'Steady Hand'], ['Kitsune', 'Kitsune'],
        ['Rinascita', 'Rebirth'], ['Pezzi di Ricambio', 'Spare Parts'], ['Cuore d’Acciaio', 'Steel Heart']],
      temple: [['del Codice Vivente', '{p} of the Living Code'], ['della Mente Unica', '{p} of the One Mind'], ['del Segnale', '{p} of the Signal'],
        ['dell’Ascensione Digitale', '{p} of Digital Ascension'], ['della Rete Eterna', '{p} of the Eternal Net'], ['dell’Ultimo Algoritmo', '{p} of the Last Algorithm'],
        ['del Dio nella Macchina', '{p} of the God in the Machine'], ['del Silicio Sacro', '{p} of Holy Silicon']],
      lair: [['dei Serpenti Cromati', 'Chrome Serpents'], ['dei Neon Rossi', 'Red Neons'], ['dei Cani di Ferro', 'Iron Dogs'], ['dei Fantasmi', 'Ghosts'],
        ['delle Lame', 'Blades'], ['dei Mangiacromo', 'Chrome Eaters'], ['delle Tigri Elettriche', 'Electric Tigers'], ['dei Sei Teschi', 'Six Skulls']],
      prison: [['Omega', 'Omega'], ['Ade', 'Hades'], ['Tartaro', 'Tartarus'], ['Zero', 'Zero'], ['Cerbero', 'Cerberus'], ['Kappa-9', 'Kappa-9'], ['Abisso', 'Abyss']],
      mine: [['del Settore 9', 'Sector 9'], ['del Livello Zero', 'Level Zero'], ['di Ruggine', 'Rust'], ['del Vecchio Porto', 'Old Harbor'],
        ['della Linea Morta', 'Dead Line'], ['del Blocco 33', 'Block 33'], ['dello Snodo Est', 'East Junction'], ['del Sottolivello 7', 'Sublevel 7']],
      sanctum: [['Nodo Sigma', 'Node Sigma'], ['Iperione', 'Hyperion'], ['Kronos', 'Kronos'], ['Mnemosine', 'Mnemosyne'], ['Babele', 'Babel'],
        ['Labirinto', 'Labyrinth'], ['Oracolo', 'Oracle'], ['Zenith', 'Zenith']],
    },
    storyNames: { tomb: 'person', temple: 'person', lair: 'person', prison: 'corp', mine: 'place', sanctum: 'corp' },
    coinMul: 10,
    openings: [
      ['Le telecamere del quartiere non inquadrano mai questo ingresso.', 'The district cameras never point at this entrance.'],
      ['Un fixer ha un lavoro: pagamento alla consegna, nessuna domanda.', 'A fixer has a job: payment on delivery, no questions asked.'],
      ['Un blackout di tre minuti ha aperto porte che restavano chiuse da anni.', 'A three-minute blackout opened doors that had stayed shut for years.'],
      ['Un netrunner ha trovato questo posto su un server che non doveva esistere.', 'A netrunner found this place on a server that should not exist.'],
      ['Sulla rete circola un file corrotto con una mappa parziale.', 'A corrupted file with a partial map is circulating on the net.'],
      ['Un contatto è sparito qui sotto; il suo biomonitor trasmette ancora.', 'A contact disappeared down here; their biomonitor is still pinging.'],
    ],
    rumors: {
      tomb: [['Qui {name} installa impianti senza licenza e non fa domande.', 'Here {name} installs unlicensed chrome and asks no questions.'], ['Chi non paga i debiti con {name} finisce smontato pezzo per pezzo nella banca dei corpi.', 'Those who don’t pay their debts to {name} end up stripped for parts in the body bank.']],
      temple: [['{name} predica che l’IA salverà chi le cederà la propria mente.', '{name} preaches that the AI will save those who surrender their minds to it.'], ['Il culto di {name} ha trasformato un vecchio nodo di rete in un santuario.', '{name}’s cult has turned an old network node into a shrine.']],
      lair: [['La gang di {name} controlla il quartiere da qui.', '{name}’s gang runs the block from here.'], ['Le razzie di cromo partono da qui, agli ordini di {name}.', 'The chrome raids start here, on the orders of {name}.']],
      prison: [['Ufficialmente questo sito non esiste; i registri della {name} dicono altro.', 'Officially this site does not exist; the ledgers of {name} say otherwise.'], ['La {name} fa sparire qui i suoi nemici, e a volte i suoi dipendenti.', '{name} makes its enemies disappear here, and sometimes its own employees.']],
      mine: [['Sotto {name} si apre un dedalo di tunnel che nessuna corp si prende più la briga di mappare.', 'Beneath {name} lies a maze of tunnels no corp bothers to map any more.'], ['I tunnel di servizio di {name} sono la via preferita dei contrabbandieri.', 'The service tunnels of {name} are the smugglers’ favourite route.']],
      sanctum: [['I server della {name} custodiscono segreti che valgono una guerra.', 'The servers of {name} hold secrets worth a war.'], ['Qui la {name} tiene sotto chiave un’IA che ha imparato troppo.', 'Here {name} keeps an AI that learned too much under lock and key.']],
    },
    goals: [
      ['Il fixer paga in contanti puliti chi recupera {treasure}.', 'The fixer pays clean cash to whoever recovers {treasure}.'],
      ['Bisogna entrare, prendere i dati e uscire prima che arrivi la sicurezza.', 'The job: get in, grab the data and get out before security arrives.'],
      ['Qualcuno deve portare fuori un ostaggio prima che lo cancellino.', 'Someone has to extract a hostage before they get erased.'],
    ],
    rooms: {
      entrance: [['Ingresso. Un montacarichi scende dalla strada tra luci al neon tremolanti.', 'Entrance. A freight lift descends from the street under flickering neon.'], ['Ingresso. Una botola di manutenzione, con il lettore di badge forzato.', 'Entrance. A maintenance hatch, its badge reader hacked open.']],
      guard: [['Posto di sicurezza. Le immagini delle telecamere tremolano in ologramma sopra il bancone.', 'Security post. Camera holo-feeds flicker above the desk.'], ['Checkpoint. Uno scanner corporeo e una porta a tenuta stagna.', 'Checkpoint. A body scanner and an airtight door.']],
      storage: [['Magazzino. Container impilati con il logo di una corp cancellato.', 'Storeroom. Stacked containers with a corp logo scrubbed off.'], ['Deposito. Casse di componenti elettronici e fusti di refrigerante.', 'Depot. Crates of electronics and drums of coolant.']],
      barracks: [['Alloggi. Capsule letto impilate, ognuna con il suo schermo.', 'Quarters. Stacked sleep pods, each with its own screen.']],
      armory: [['Armeria. Rastrelliere a riconoscimento biometrico, quasi tutte vuote.', 'Armoury. Biometric weapon racks, almost all of them empty.']],
      prison: [['Celle. Porte di plexiglas e collari inibitori appesi al muro.', 'Cells. Plexiglass doors and inhibitor collars hanging on the wall.'], ['Blocco di contenimento. I prigionieri dormono collegati a una rete sedativa.', 'Containment block. Prisoners sleep wired into a sedation net.']],
      torture: [['Sala interrogatori. Una sedia di contenzione con un casco neurale.', 'Interrogation room. A restraint chair fitted with a neural helmet.']],
      hall: [['Atrio. Colonne d’acciaio e pubblicità olografiche che parlano al vuoto.', 'Atrium. Steel columns and holo-ads talking to no one.']],
      statues: [['Deposito androidi. File di androidi spenti fissano la porta.', 'Android storage. Rows of deactivated androids stare at the door.']],
      kitchen: [['Mensa. Distributori di cibo sintetico e tavoli di plastica.', 'Canteen. Synth-food dispensers and plastic tables.']],
      flooded: [['Locale allagato. Refrigerante e acqua piovana coprono il pavimento.', 'Flooded room. Coolant and rainwater cover the floor.']],
      collapsed: [['Crollo. Una trave di cemento armato ha sfondato il soffitto.', 'Collapse. A reinforced concrete beam has broken through the ceiling.']],
      well: [['Pozzo di ventilazione. Un vento caldo sale dai livelli inferiori.', 'Ventilation shaft. A warm draught rises from the lower levels.']],
      lab: [['Laboratorio. Bracci robotici immobili sopra banconi sterili.', 'Laboratory. Motionless robot arms above sterile benches.'], ['Laboratorio di bioingegneria. Una stampante di tessuti è ancora accesa.', 'Bioengineering lab. A tissue printer is still running.']],
      archive: [['Archivio dati. Scaffali di nastri olografici e terminali spenti.', 'Data archive. Shelves of holo-tapes and dead terminals.']],
      shrine: [['Cappella. Un altare di schermi rotti mostra lo stesso volto generato.', 'Chapel. An altar of broken screens shows the same generated face.'], ['Santuario. Candele a LED circondano un vecchio processore chiuso in una teca.', 'Shrine. LED candles surround an old processor enshrined in a glass case.']],
      ritual: [['Sala della connessione. Un anello olografico pulsa al centro; i fedeli si collegano qui.', 'Uplink hall. A holographic ring pulses at the centre; the faithful jack in here.']],
      lair: [['Tana. Materassi, cavi strappati e pezzi di cromo rubato.', 'Den. Mattresses, ripped cables and stolen chrome.']],
      throne: [['Sala del boss. Un trono di sedili d’auto saldati, sotto un’insegna al neon.', 'Boss’s hall. A throne of welded car seats under a neon sign.']],
      mine: [['Tunnel di servizio. I binari della vecchia monorotaia e fasci di cavi.', 'Service tunnel. Old monorail tracks and bundled cables.'], ['Condotto. Un carrello di manutenzione automatico è fermo sui binari.', 'Conduit. An automated maintenance cart sits idle on the tracks.']],
      sewer: [['Canale di scolo. Acqua iridescente scorre verso il basso.', 'Drainage channel. Iridescent water flows downwards.']],
      hydro: [['Serra idroponica. Alghe e funghi modificati crescono sotto lampade UV.', 'Hydroponic farm. Engineered algae and fungi grow under UV lamps.']],
      morgue: [['Banca dei corpi. Cassetti criogenici in fila, ognuno con il suo codice a barre.', 'Body bank. Rows of cryo-drawers, each with its own barcode.']],
      ward: [['Sala di degenza. Lettini con monitor che suonano a vuoto.', 'Recovery ward. Cots with monitors beeping at no one.']],
      surgery: [['Sala operatoria. Un lettino sotto un ragno di bracci chirurgici.', 'Operating room. A table under a spider of surgical arms.'], ['Ambulatorio. Un impianto oculare attende su un vassoio sterile, accanto al lettino.', 'Chrome bay. An ocular implant waits on a sterile tray beside the table.']],
      office: [['Uffici. Postazioni open space con gli schermi ancora accesi.', 'Offices. Open-plan workstations, screens still on.']],
      garage: [['Garage. Moto truccate e un’auto blindata a metà.', 'Garage. Souped-up bikes and a half-armoured car.']],
      plant: [['Sala macchine. Una turbina e tubi di refrigerante che fischiano.', 'Plant room. A turbine and hissing coolant pipes.']],
      control: [['Sala di controllo. Pareti di schermi mostrano ogni corridoio.', 'Control room. Walls of screens show every corridor.']],
      servers: [['Sala server. File di rack ronzano nel freddo, con i LED che ammiccano nel buio.', 'Server hall. Rows of racks hum in the cold, their LEDs winking in the dark.'], ['Nodo di rete. Fasci di fibra ottica pendono dal soffitto.', 'Network node. Bundles of optic fibre hang from the ceiling.']],
      vats: [['Sala delle vasche. Organi coltivati galleggiano in cilindri di vetro.', 'Tank room. Vat-grown organs float in glass cylinders.'], ['Vasche di clonazione. Corpi senza nome galleggiano nel liquido amniotico.', 'Cloning vats. Nameless bodies float in amniotic fluid.']],
      core: [['Nucleo. Un’IA ribelle parla da ogni altoparlante; i suoi server formano un anello.', 'Core. A rogue AI speaks through every speaker; its servers form a ring.']],
      vault: [['Caveau. Casseforti sigillate dietro uno scanner retinico.', 'Vault. Sealed strongboxes behind a retina scanner.']],
      empty: [['Stanza vuota. Graffiti al neon e un cartello: «zona morta».', 'Empty room. Neon graffiti and a sign: “dead zone”.'], ['Stanza spoglia. Le telecamere sono state accecate con la vernice.', 'Bare room. The cameras have been blinded with spray paint.']],
      exit: [['Pozzo dell’ascensore. Una scala d’emergenza scende ai sottolivelli.', 'Lift shaft. An emergency ladder leads down to the sublevels.']],
    },
    kinds: {
      tomb: { surgery: 3, vats: 3, ward: 2, morgue: 1.5, storage: 1, office: 0.7, guard: 1, lab: 1, empty: 1 },
      temple: { shrine: 3, ritual: 2, servers: 2, hall: 1, barracks: 1, archive: 1, prison: 0.7, hydro: 0.7, empty: 1 },
      lair: { lair: 2, garage: 2, storage: 2, guard: 2, armory: 1, barracks: 1, kitchen: 1, surgery: 0.5, empty: 1 },
      prison: { prison: 3, torture: 1.5, guard: 2, barracks: 1, armory: 1, control: 1.5, servers: 1, vats: 0.7, empty: 1 },
      mine: { mine: 3, plant: 2, sewer: 1.5, collapsed: 1.5, storage: 1, hydro: 1, lair: 1, well: 1, flooded: 0.7, empty: 1 },
      sanctum: { servers: 4, lab: 2, office: 1.5, vats: 1, control: 1, statues: 0.7, storage: 1, hall: 0.7, empty: 1 },
    },
    boss: { tomb: 'surgery', temple: 'ritual', lair: 'throne', prison: 'torture', mine: 'lair', sanctum: 'core' },
    monsters: {
      tomb: [['un buttafuori cromato', 'buttafuori cromati', 'a chromed bouncer', 'chromed bouncers'], ['un drone medico', 'droni medici', 'a med drone', 'med drones'], ['un trafficante di organi', 'trafficanti di organi', 'an organ trafficker', 'organ traffickers'], ['un chirurgo clandestino', 'chirurghi clandestini', 'a back-alley ripperdoc', 'back-alley ripperdocs', 1], ['un cyberpsicotico', 'cyberpsicotici', 'a cyberpsycho', 'cyberpsychos', 1]],
      temple: [['un adepto connesso', 'adepti connessi', 'a wired acolyte', 'wired acolytes'], ['un sacerdote del codice', 'sacerdoti del codice', 'a code priest', 'code priests'], ['un drone sentinella', 'droni sentinella', 'a sentinel drone', 'sentinel drones'], ['un avatar dell’IA', 'avatar dell’IA', 'an avatar of the AI', 'avatars of the AI', 1]],
      lair: [['un gangster cromato', 'gangster cromati', 'a chromed ganger', 'chromed gangers'], ['un netrunner', 'netrunner', 'a netrunner', 'netrunners'], ['un cane cibernetico', 'cani cibernetici', 'a cyber-dog', 'cyber-dogs'], ['il boss della gang', 'boss della gang', 'the gang boss', 'gang bosses', 1], ['un cyberpsicotico', 'cyberpsicotici', 'a cyberpsycho', 'cyberpsychos', 1]],
      prison: [['un agente della sicurezza corp', 'agenti della sicurezza corp', 'a corp security agent', 'corp security agents'], ['un drone da combattimento', 'droni da combattimento', 'a combat drone', 'combat drones'], ['una torretta automatica', 'torrette automatiche', 'an automated turret', 'automated turrets'], ['un prigioniero potenziato', 'prigionieri potenziati', 'an augmented prisoner', 'augmented prisoners'], ['l’interrogatore capo', 'interrogatori capo', 'the chief interrogator', 'chief interrogators', 1]],
      mine: [['uno scavenger', 'scavenger', 'a scavenger', 'scavengers'], ['un drone di manutenzione impazzito', 'droni di manutenzione impazziti', 'a rogue maintenance drone', 'rogue maintenance drones'], ['un ratto mutante', 'ratti mutanti', 'a mutant rat', 'mutant rats'], ['un contrabbandiere', 'contrabbandieri', 'a smuggler', 'smugglers'], ['un cyberpsicotico', 'cyberpsicotici', 'a cyberpsycho', 'cyberpsychos', 1]],
      sanctum: [['una guardia corp', 'guardie corp', 'a corp guard', 'corp guards'], ['un drone di sicurezza', 'droni di sicurezza', 'a security drone', 'security drones'], ['una torretta IA', 'torrette IA', 'an AI turret', 'AI turrets'], ['un netrunner della corp', 'netrunner della corp', 'a corp netrunner', 'corp netrunners'], ['un androide guardiano', 'androidi guardiani', 'a guardian android', 'guardian androids', 1]],
    },
    monsterSentences: {
      one: [['{M} sorveglia la stanza.', '{M} watches over the room.'], ['{M} fa la guardia.', '{M} stands guard.'], ['{M} attende immobile tra le luci al neon.', '{M} waits motionless in the neon glow.']],
      many: [['{M} sorvegliano la stanza.', '{M} watch over the room.'], ['{M} fanno la guardia.', '{M} stand guard.'], ['{M} attendono immobili tra le luci al neon.', '{M} wait motionless in the neon glow.']],
    },
    treasures: [
      ['un credstick con {coins} crediti', 'a credstick loaded with {coins} credits'],
      ['uno shard di dati cifrato', 'an encrypted data shard'],
      ['un impianto prototipo ancora sigillato', 'a sealed prototype implant'],
      ['una keycard di livello dirigenziale', 'an executive-level keycard'],
      ['un cyberdeck modificato', 'a modded cyberdeck'],
      ['un occhio cibernetico di grado militare', 'a military-grade cybereye'],
      ['una pistola smart con munizioni a ricerca', 'a smart pistol with homing rounds'],
      ['tre fiale di stimolanti da combattimento', 'three vials of combat stims'],
      ['un chip con ricordi rubati', 'a chip full of stolen memories'],
      ['la mappa della rete di sorveglianza', 'a map of the surveillance network'],
      ['una lama a monofilamento', 'a monofilament blade'],
      ['il codice sorgente di un’IA', 'the source code of an AI'],
    ],
    treasureSentences: [['In un armadietto blindato: {T}.', 'In an armoured locker: {T}.'], ['Dietro un pannello: {T}.', 'Behind a wall panel: {T}.'], ['In un vano sotto il pavimento: {T}.', 'In a cavity under the floor: {T}.']],
    traps: [
      ['una griglia laser si accende all’improvviso', 'a laser grid flicks on without warning'],
      ['una torretta con sensore di movimento cala dal soffitto', 'a motion-sensor turret drops from the ceiling'],
      ['un filo teso fa esplodere una granata a frammentazione', 'a tripwire sets off a frag grenade'],
      ['un ICE nero frigge gli impianti di chi si collega al terminale', 'black ICE fries the implants of anyone who jacks into the terminal'],
      ['un impulso EMP spegne impianti e armi smart', 'an EMP pulse shuts down implants and smart weapons'],
      ['le porte si sigillano e dalle bocchette esce gas soporifero', 'the doors seal and sleeping gas hisses from the vents'],
      ['il pavimento elettrificato scarica migliaia di volt', 'the electrified floor discharges thousands of volts'],
    ],
  });

  // Text tables of a setting; the model stores only indices into them.
  const tables = (s) => (s === 'modern' ? TM : s === 'cyber' ? TC : T);
  const tab = (m) => tables((m && m.setting) || Carto.Setting.current);
  // New room purposes furnished like an existing kind.
  const FURN = { morgue: 'crypt', ward: 'barracks', archive: 'library', platform: 'hall', sewer: 'flooded', hydro: 'fungus' };

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
        // Cyberpunk: a holographic ring, without the pentacle.
        if (Carto.Setting.is('cyber')) f[0].ring = true;
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
      // Present day and cyberpunk only.
      case 'surgery':
        f.push({ t: 'table', x: cx, y: cy, ang: w >= h ? 0 : 90 }, { t: 'lamp', x: cx, y: cy });
        if (walls.length) f.push({ t: 'shelf', ...alongWall(walls[0], 0.25) });
        f.push({ t: 'console', x: x + 0.7, y: y + h - 0.7, ang: 0 });
        break;
      case 'office':
        for (let j = y + 1; j <= y + h - 1; j += 2) {
          for (let i = x + 1; i <= x + w - 1; i += 2) {
            if (blocked(i, j) || blocked(i, j + 0.65)) continue;
            f.push({ t: 'table', x: i, y: j, ang: 0 }, { t: 'stool', x: i, y: j + 0.65 });
          }
        }
        break;
      case 'garage': {
        // Cars side by side, nose to the wall.
        const along = h >= w;
        const n = Math.max(1, Math.floor(((along ? h : w) - 0.4) / 1.6));
        for (let i = 0; i < n; i++) {
          const d = (i + 0.5) * ((along ? h : w) / n);
          f.push({ t: 'car', x: along ? cx : x + d, y: along ? y + d : cy, ang: along ? 90 : 0 });
        }
        f.push({ t: 'barrel', x: x + 0.5, y: y + 0.5 });
        break;
      }
      case 'plant':
        f.push({ t: 'machine', x: cx, y: cy, w: Math.max(1, Math.min(2.4, w - 1.4)), h: Math.max(1, Math.min(1.6, h - 1.4)) });
        f.push({ t: 'barrel', x: x + 0.5, y: y + 0.5 }, { t: 'barrel', x: x + w - 0.5, y: y + h - 0.5 });
        break;
      case 'control': {
        const s = alongWall(wall, 0.4);
        const len = Math.hypot(s.x1 - s.x0, s.y1 - s.y0);
        for (let d = 0.5; d <= len - 0.4; d += 1) f.push({ t: 'console', x: s.x0 + ((s.x1 - s.x0) * d) / Math.max(len, 0.01), y: s.y0 + ((s.y1 - s.y0) * d) / Math.max(len, 0.01), ang: s.ang });
        f.push({ t: 'table', x: cx, y: cy, ang: w >= h ? 0 : 90 });
        break;
      }
      case 'servers': {
        // Rows of racks along the longer side.
        const horiz = w >= h;
        const rows = horiz ? h : w, cols = horiz ? w : h;
        const n = Math.floor(rows / 2);
        for (let k = 0, r = (rows - 2 * (n - 1)) / 2; k < n; k++, r += 2) {
          for (let c = 1; c < cols - 1; c++) f.push({ t: 'server', x: horiz ? x + c + 0.5 : x + r, y: horiz ? y + r : y + c + 0.5, ang: horiz ? 0 : 90 });
        }
        break;
      }
      case 'vats':
        // The top left corner stays free for the room number.
        for (let j = y + 1; j <= y + h - 0.9; j += 1.5) for (let i = x + 1; i <= x + w - 0.9; i += 1.5) if (!blocked(i, j) && (i > x + 1 || j > y + 1)) f.push({ t: 'vat', x: i, y: j, r: 0.45 });
        break;
      case 'core':
        f.push({ t: 'circle', x: cx, y: cy, r: Math.max(1, Math.min(w, h) / 2 - 1.2), ring: true });
        for (const side of walls) {
          const s = alongWall(side, 0.4);
          const len = Math.hypot(s.x1 - s.x0, s.y1 - s.y0);
          for (let d = 0.5; d <= len - 0.4; d += 1) f.push({ t: 'server', x: s.x0 + ((s.x1 - s.x0) * d) / Math.max(len, 0.01), y: s.y0 + ((s.y1 - s.y0) * d) / Math.max(len, 0.01), ang: s.ang });
        }
        break;
    }
    return f.filter((q) => !(q.x !== undefined && q.t !== 'cells' && q.t !== 'rails' && q.t !== 'water' && q.t !== 'circle' && blocked(Math.floor(q.x), Math.floor(q.y)) && q.t !== 'stairs'));
  }

  // ------------------------------------------------------------- generation

  function generate(seed, opts) {
    const rng = new Carto.Random(seed);
    const D = tables(Carto.Setting.current);
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
    const kinds = Object.entries(D.kinds[theme]);
    const leaves = rooms.filter((r) => r !== rooms[0] && neighbours.get(r.id).length === 1);
    const deepest = rooms.slice(1).sort((a, b) => depth.get(b.id) - depth.get(a.id))[0];
    rooms[0].purpose = 'entrance';
    if (deepest) { deepest.purpose = D.boss[theme]; deepest.boss = true; }
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
    const monsters = D.monsters[theme];
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
      r.features = furnish(cr, r, FURN[r.purpose] || r.purpose, doorsIn);
      r.text = { v: cr.int(0, D.rooms[r.purpose].length - 1) };
      if (r.purpose !== 'entrance' && r.purpose !== 'exit' && (r.boss || cr.bool(0.42))) {
        let mi = r.boss ? monsters.findIndex((m) => m[4]) : cr.int(0, monsters.length - (D === T ? 1 : 2));
        // Present day and cyberpunk bosses are someone, met only in their room.
        if (D !== T && !r.boss && mi >= monsters.findIndex((m) => m[4])) mi++;
        const m = monsters[Math.max(0, mi)];
        const n = m[4] ? 1 : cr.int(1, 5);
        r.text.monster = { i: Math.max(0, mi), n, s: cr.int(0, 2) };
      }
      if (r.purpose === 'vault' || cr.bool(r.boss ? 0.8 : 0.22)) {
        r.text.treasure = { i: cr.int(0, D.treasures.length - 1), s: cr.int(0, D.treasureSentences.length - 1), coins: cr.int(5, 50) * 10 };
      }
      if (r.purpose !== 'entrance' && cr.bool(0.14)) r.text.trap = cr.int(0, D.traps.length - 1);
    }

    // Title and story.
    const tr = rng.fork('title');
    const title = { place: tr.int(0, D.places[theme].length - 1), noun: tr.int(0, (D.nouns[theme] || D.nouns).length - 1), adj: tr.int(0, D.adjs.length - 1) };
    const story = {
      opening: tr.int(0, D.openings.length - 1),
      rumor: tr.int(0, D.rumors[theme].length - 1),
      goal: tr.int(0, D.goals.length - 1),
      name: D.storyNames ? Carto.Names[D.storyNames[theme]](tr) : theme === 'mine' ? Carto.Names.place(tr) : Carto.Names.person(tr),
      treasure: tr.int(1, D.treasures.length - 1),
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
    const l = L(), D = tab(m);
    const place = D.places[m.theme][m.title.place][l];
    // Present day and cyberpunk: "place + name", no adjective.
    if (D !== T) {
      const nm = D.nouns[m.theme][m.title.noun];
      return l === 0 ? place + ' ' + nm[0] : nm[1].includes('{p}') ? nm[1].replace('{p}', place) : nm[1] + ' ' + place;
    }
    const noun = D.nouns[m.title.noun];
    const adj = D.adjs[m.title.adj];
    if (l === 1) return place + ' of the ' + adj[4] + ' ' + noun[2];
    const g = { ms: 0, fs: 1, mp: 2, fp: 3 }[noun[1]];
    return place + ' ' + noun[0] + ' ' + adj[g];
  }

  function storyText(m) {
    const l = L(), s = m.story, D = tab(m);
    const treasure = D.treasures[s.treasure][l].replace('{coins}', String(300 * (D.coinMul || 1)));
    return [
      D.openings[s.opening][l],
      D.rumors[m.theme][s.rumor][l].replace('{name}', s.name),
      D.goals[s.goal][l].replace('{treasure}', treasure),
    ].join(' ');
  }

  function roomText(m, r) {
    const l = L(), D = tab(m);
    const base = D.rooms[r.purpose][r.text.v % D.rooms[r.purpose].length][l];
    const dot = base.indexOf('. ');
    const head = dot > 0 ? base.slice(0, dot) : base;
    const parts = [dot > 0 ? base.slice(dot + 2) : ''];
    const tx = r.text;
    if (tx.monster) {
      const mm = D.monsters[m.theme][tx.monster.i];
      const n = tx.monster.n;
      const phrase = n === 1 ? mm[l === 0 ? 0 : 2] : D.numbers[n][l] + ' ' + mm[l === 0 ? 1 : 3];
      const sent = D.monsterSentences[n === 1 ? 'one' : 'many'][tx.monster.s][l];
      parts.push(sent.replace('{M}', cap(phrase)));
    }
    if (tx.treasure) {
      const tt = D.treasures[tx.treasure.i][l].replace('{coins}', tx.treasure.coins * (D.coinMul || 1));
      parts.push(D.treasureSentences[tx.treasure.s][l].replace('{T}', tt));
    }
    if (tx.trap !== undefined) parts.push(D.trapSentence[l].replace('{R}', D.traps[tx.trap][l]));
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
        if (f.ring) { out.accent.circle(P(f.x), P(f.y), P(f.r) * 0.45); break; }
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
      // Present day and cyberpunk.
      case 'server':
        out.dark.poly(G.rect(P(f.x), P(f.y), CS * (f.ang ? 0.7 : 1), CS * (f.ang ? 1 : 0.7)));
        out.accent.circle(P(f.x), P(f.y), CS * 0.08);
        break;
      case 'console': {
        const r = G.rect(P(f.x), P(f.y), CS * (f.ang ? 0.55 : 0.9), CS * (f.ang ? 0.9 : 0.55));
        out.dark.poly(r);
        out.accent.poly(G.scalePoly(r, 0.55));
        break;
      }
      case 'lamp':
        out.accent.circle(P(f.x), P(f.y), CS * 0.5);
        out.accent.circle(P(f.x), P(f.y), CS * 0.18);
        break;
      case 'car': {
        const body = G.rect(P(f.x), P(f.y), CS * (f.ang ? 2.6 : 1.1), CS * (f.ang ? 1.1 : 2.6));
        out.light.poly(body);
        // Windscreen and rear window.
        const cab = G.rect(P(f.x), P(f.y), CS * (f.ang ? 1.2 : 0.85), CS * (f.ang ? 0.85 : 1.2));
        out.thin.poly(cab);
        break;
      }
      case 'machine': {
        out.dark.poly(G.rect(P(f.x), P(f.y), P(f.w), P(f.h)));
        const rr = Math.min(f.w, f.h) * 0.32;
        out.thin.circle(P(f.x - f.w / 4), P(f.y), P(rr));
        out.thin.circle(P(f.x + f.w / 4), P(f.y), P(rr));
        break;
      }
      case 'vat':
        out.water.circle(P(f.x), P(f.y), P(f.r));
        out.thin.circle(P(f.x), P(f.y), P(f.r) * 1.15);
        break;
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
    // Monospaced lettering (cyberpunk) has wider characters.
    const mono = /mono/i.test(pal.fontLabel || '');
    const storyLines = showPage ? Draw.wrap(story, Math.floor(pageW / (fs * (mono ? 0.66 : 0.5)))) : [];
    if (showPage) {
      const nCols = pageW > 900 ? 3 : pageW > 560 ? 2 : 1;
      const colW = (pageW - 40 - (nCols - 1) * 22) / nCols;
      const maxChars = Math.floor(colW / (fs * (mono ? 0.62 : 0.47)));
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
                svg.raw('<text x="' + Svg.num(x) + '" y="' + Svg.num(cy) + '" font-family="' + (pal.fontLabel || Draw.FONT_LABEL) + '" font-size="' + fs + '" fill="' + pal.label + '">' +
                  '<tspan font-family="' + (pal.fontTitle || Draw.FONT_TITLE) + '">' + Svg.esc(first) + '</tspan>' + Svg.esc(rest) + '</text>');
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

  // ------------------------------------------------------------- 3D model

  // Walls of solid rock around the floors, 1 square = 1.5 m, 3 m high.
  const MAT3D = {
    floor: { name: 'Pavimento', color: '#8d8476' },
    rock: { name: 'Roccia', color: '#5f5850', roughness: 0.95 },
    wood: { name: 'Legno', color: '#6e4a2c' },
    iron: { name: 'Ferro', color: '#34343a', metallic: 0.7, roughness: 0.45 },
    stone: { name: 'Pietra lavorata', color: '#a39b8c' },
    dark: { name: 'Pietra scura', color: '#45403a' },
    water: { name: 'Acqua', color: '#2f6a86', alpha: 0.75, roughness: 0.1 },
    accent: { name: 'Sigillo', color: '#9c2a24' },
    bone: { name: 'Ossa', color: '#ddd3b8' },
    fungus: { name: 'Funghi', color: '#7a9a52' },
    gold: { name: 'Oro', color: '#c99a2e', metallic: 0.9, roughness: 0.35 },
  };
  // Present day: concrete floors, painted walls, steel doors.
  const MAT3D_MODERN = {
    floor: { name: 'Cemento', color: '#9a9893', roughness: 0.9 },
    rock: { name: 'Muri intonacati', color: '#d6d1c4', roughness: 0.9 },
    wood: { name: 'Mobili', color: '#8b7b63' },
    iron: { name: 'Ferro', color: '#3c3f44', metallic: 0.7, roughness: 0.45 },
    steel: { name: 'Acciaio verniciato', color: '#6d7980', metallic: 0.5, roughness: 0.5 },
    stone: { name: 'Calcestruzzo', color: '#b3b0a7' },
    dark: { name: 'Lamiera scura', color: '#4a4d52', metallic: 0.3, roughness: 0.6 },
    water: { name: 'Acqua torbida', color: '#4f6a5c', alpha: 0.8, roughness: 0.1 },
    accent: { name: 'Vernice rossa', color: '#c8362e' },
    bone: { name: 'Rifiuti', color: '#c9c2ae' },
    fungus: { name: 'Muffa', color: '#3e4a30' },
    gold: { name: 'Ottone', color: '#b8923a', metallic: 0.9, roughness: 0.35 },
  };
  // Cyberpunk: dark metal and neon.
  const MAT3D_CYBER = {
    floor: { name: 'Grigliato metallico', color: '#2a2e36', metallic: 0.6, roughness: 0.55 },
    rock: { name: 'Pareti in metallo', color: '#20242c', metallic: 0.5, roughness: 0.6 },
    wood: { name: 'Polimero', color: '#3b4150' },
    iron: { name: 'Acciaio', color: '#5a606b', metallic: 0.85, roughness: 0.35 },
    steel: { name: 'Porte blindate', color: '#454b57', metallic: 0.8, roughness: 0.4 },
    stone: { name: 'Cemento armato', color: '#4b505a' },
    dark: { name: 'Carbonio', color: '#14161b', roughness: 0.4 },
    water: { name: 'Refrigerante', color: '#1fb8c9', alpha: 0.7, roughness: 0.05 },
    accent: { name: 'Neon magenta', color: '#ff3fa4', roughness: 0.2 },
    bone: { name: 'Rottami', color: '#8c8f96', metallic: 0.6 },
    fungus: { name: 'Colture idroponiche', color: '#46e08a' },
    gold: { name: 'Neon ciano', color: '#3ff0ff', roughness: 0.2 },
  };

  function model3d(m) {
    const C = 1.5, HW = 3, M = Carto.Mesh3D.Mesh;
    const MAT = { modern: MAT3D_MODERN, cyber: MAT3D_CYBER }[m.setting] || MAT3D;
    const b = m.bounds;
    const ox = -((b.x0 + b.x1) / 2) * C, os = -((b.y0 + b.y1) / 2) * C;
    const X = (v) => v * C + ox, S = (v) => v * C + os;
    const floor = new Set();
    const k = (x, y) => x + ',' + y;
    for (const a of m.areas) {
      const cells = a.cells || [];
      if (!a.cells) for (let y = a.y; y < a.y + a.h; y++) for (let x = a.x; x < a.x + a.w; x++) cells.push([x, y]);
      for (const [x, y] of cells) floor.add(k(x, y));
    }
    const parts = [];
    const mesh = (name, material) => { const me = new M(); parts.push({ name, mesh: me, material }); return me; };

    // Floors: one object per room, named after the key, so rooms can be picked out.
    const corridors = mesh(t('dungeon.3d.corridors'), 'floor');
    for (const a of m.areas) {
      if (a.kind === 'corridor') { for (const [x, y] of a.cells) corridors.box(X(x), S(y), X(x + 1), S(y + 1), -0.2, 0); continue; }
      const me = mesh(a.num + '. ' + roomText(m, a).head, 'floor');
      me.box(X(a.x), S(a.y), X(a.x + a.w), S(a.y + a.h), -0.2, 0);
    }

    // Rock: every empty square touching a floor, as one block with only the
    // faces that can be seen.
    const rock = new Set(), rockCells = [];
    for (const key of floor) {
      const [x, y] = key.split(',').map(Number);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const q = k(x + dx, y + dy);
        if (!floor.has(q) && !rock.has(q)) { rock.add(q); rockCells.push([x + dx, y + dy]); }
      }
    }
    const walls = mesh(t('dungeon.3d.rock'), 'rock');
    for (const [x, y] of rockCells) walls.face([[X(x), HW, S(y)], [X(x + 1), HW, S(y)], [X(x + 1), HW, S(y + 1)], [X(x), HW, S(y + 1)]], [0, 1, 0]);
    for (const r of Carto.Mesh3D.boundaryRuns((x, y) => rock.has(k(x, y)), rockCells)) {
      walls.face([[X(r.x0), 0, S(r.s0)], [X(r.x1), 0, S(r.s1)], [X(r.x1), HW, S(r.s1)], [X(r.x0), HW, S(r.s0)]], [r.nx, 0, r.ns]);
    }
    // Round rooms: rock fills the corners of their square.
    for (const a of m.areas) {
      if (a.shape !== 'round') continue;
      const cx = a.x + a.w / 2, cy = a.y + a.h / 2, r = a.w / 2;
      for (let q = 0; q < 4; q++) {
        const sx = q === 0 || q === 3 ? 1 : -1, sy = q < 2 ? 1 : -1;
        const corner = [X(cx + sx * r), S(cy + sy * r)];
        const arc = [];
        const a0 = Math.atan2(sy, 0), a1 = Math.atan2(0, sx);
        let da = a1 - a0;
        if (da > Math.PI) da -= 2 * Math.PI;
        if (da < -Math.PI) da += 2 * Math.PI;
        for (let i = 0; i <= 10; i++) { const ang = a0 + (da * i) / 10; arc.push([X(cx + Math.cos(ang) * r), S(cy + Math.sin(ang) * r)]); }
        walls.prism([corner, ...arc], 0, HW, { center: corner });
      }
    }

    // Doors.
    const doors = mesh(t('dungeon.3d.doors'), MAT.steel ? 'steel' : 'wood'), iron = mesh(t('dungeon.3d.iron'), 'iron');
    const secret = mesh(t('dungeon.3d.secret'), 'rock'), lintels = mesh(t('dungeon.3d.lintels'), 'rock');
    for (const l of m.links) {
      const d = l.door, x = X(d.x), s = S(d.y), ang = d.vertical ? 90 : 0;
      if (l.type === 'door' || l.type === 'locked') {
        doors.boxAt(x, s, C * 0.82, 0.12, 0, 2.3, ang);
        lintels.boxAt(x, s, C, 0.5, 2.3, HW, ang);
        if (l.type === 'locked') iron.boxAt(x, s, 0.22, 0.2, 1.0, 1.25, ang);
      } else if (l.type === 'secret') {
        secret.boxAt(x, s, C, 0.6, 0, HW, ang);
      } else if (l.type === 'bars') {
        for (let i = -2; i <= 2; i++) {
          const off = (i * C) / 5.5;
          iron.cylinder(x + (d.vertical ? 0 : off), s + (d.vertical ? off : 0), 0.035, 0, 2.6, 8);
        }
        iron.boxAt(x, s, C, 0.08, 2.5, 2.6, ang);
        lintels.boxAt(x, s, C, 0.5, 2.6, HW, ang);
      }
    }

    // Furniture.
    const by = {};
    const of = (mat) => by[mat] || (by[mat] = mesh(t('dungeon.3d.furniture') + ' · ' + MAT[mat].name, mat));
    const rng = new Carto.Random(m.seed + 7);
    for (const r of m.rooms) {
      for (const f of r.features || []) {
        const fx = X(f.x), fs = S(f.y);
        switch (f.t) {
          case 'column': of('stone').cylinder(fx, fs, 0.32 * C, 0, HW, 14); break;
          case 'statue': of('stone').boxAt(fx, fs, 0.8 * C, 0.8 * C, 0, 0.5); of('stone').cylinder(fx, fs, 0.28 * C, 0.5, 2.3, 10); break;
          case 'sarcophagus': of('stone').boxAt(fx, fs, 0.85 * C, 1.9 * C, 0, 0.85, f.ang); break;
          case 'skull': of('bone').boxAt(fx, fs, 0.18, 0.18, 0, 0.16, rng.float(0, 90)); break;
          case 'altar': of('dark').boxAt(fx, fs, 1.8 * C, 0.8 * C, 0, 1.0, f.ang); break;
          case 'circle':
            for (let i = 0; i < 32; i++) {
              const a0 = (i / 32) * Math.PI * 2, a1 = ((i + 1) / 32) * Math.PI * 2, rr = f.r * C;
              of('accent').boxAt(fx + Math.cos((a0 + a1) / 2) * rr, fs + Math.sin((a0 + a1) / 2) * rr, rr * (a1 - a0) * 1.05, 0.08, 0, 0.01, ((a0 + a1) / 2) * (180 / Math.PI) + 90);
            }
            // A holographic ring floats above the floor.
            if (f.ring) of('gold').cylinder(fx, fs, f.r * C * 0.45, 0, 0.05, 24);
            break;
          case 'shelf': case 'rack2': {
            const len = Math.hypot(f.x1 - f.x0, f.y1 - f.y0) * C;
            of('wood').boxAt(X((f.x0 + f.x1) / 2), S((f.y0 + f.y1) / 2), f.ang ? 0.4 * C : len, f.ang ? len : 0.4 * C, 0, 2.0);
            break;
          }
          case 'table': of('wood').boxAt(fx, fs, (f.ang ? 0.8 : 1.6) * C, (f.ang ? 1.6 : 0.8) * C, 0, 0.78); break;
          case 'stool': of('wood').cylinder(fx, fs, 0.22 * C, 0, 0.45, 10); break;
          case 'barrel': of('wood').cylinder(fx, fs, 0.3 * C, 0, 0.95, 14); break;
          case 'crate': of('wood').boxAt(fx, fs, 0.6 * C, 0.6 * C, 0, 0.6 * C); break;
          case 'chest': of('wood').boxAt(fx, fs, (f.ang ? 0.5 : 0.8) * C, (f.ang ? 0.8 : 0.5) * C, 0, 0.55); of('gold').boxAt(fx, fs, 0.15, 0.15, 0.55, 0.62); break;
          case 'bed': { const v = f.side === 'n' || f.side === 's'; of('wood').boxAt(fx, fs, (v ? 0.75 : 1.5) * C, (v ? 1.5 : 0.75) * C, 0, 0.5); break; }
          case 'rack': of('wood').boxAt(fx, fs, (f.ang ? 0.9 : 2) * C, (f.ang ? 2 : 0.9) * C, 0, 0.9); break;
          case 'throne': of('dark').boxAt(fx, fs, 0.9 * C, 0.9 * C, 0, 0.55); of('gold').boxAt(fx, fs, 0.9 * C, 0.9 * C, 0.55, 0.62); break;
          case 'water': {
            const pts = [];
            for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; pts.push([fx + Math.cos(a) * f.rx * C * 0.92, fs + Math.sin(a) * f.ry * C * 0.92]); }
            of('water').prism(pts, 0, 0.04, { sides: false });
            break;
          }
          case 'rubble': of('rock').boxAt(fx, fs, f.r * 2 * C, f.r * 1.6 * C, 0, f.r * C * rng.float(0.6, 1.4), rng.float(0, 90)); break;
          case 'well': {
            const ring = [], inner = [];
            for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; ring.push([fx + Math.cos(a) * 0.75 * C, fs + Math.sin(a) * 0.75 * C]); }
            of('dark').prism(ring, 0, 0.8);
            for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; inner.push([fx + Math.cos(a) * 0.5 * C, fs + Math.sin(a) * 0.5 * C]); }
            of('water').prism(inner, 0.8, 0.81, { sides: false });
            break;
          }
          case 'nest': of('wood').cylinder(fx, fs, f.r * C, 0, 0.3, 14); break;
          case 'bone': of('bone').boxAt(fx, fs, 0.6, 0.08, 0, 0.06, f.ang); break;
          case 'hearth': { const v = f.side === 'e' || f.side === 'w'; of('dark').boxAt(fx, fs, (v ? 0.7 : 1.6) * C, (v ? 1.6 : 0.7) * C, 0, 1.2); break; }
          case 'rails': {
            const { x, y, w, h, horiz } = f;
            const c = horiz ? y + h / 2 : x + w / 2;
            for (const o of [-0.25, 0.25]) {
              if (horiz) of('iron').box(X(x), S(c + o) - 0.03, X(x + w), S(c + o) + 0.03, 0, 0.08);
              else of('iron').box(X(c + o) - 0.03, S(y), X(c + o) + 0.03, S(y + h), 0, 0.08);
            }
            break;
          }
          case 'mushroom': of('fungus').cylinder(fx, fs, f.r * C * 0.3, 0, f.r * 1.6, 8); of('fungus').cylinder(fx, fs, f.r * C, f.r * 1.6, f.r * 1.9, 12); break;
          case 'cells': {
            const { x, y, w, h } = f.room;
            const horiz = f.side === 'n' || f.side === 's';
            const depth = Math.min(2, Math.max(1, Math.floor((horiz ? h : w) / 2)));
            const len = horiz ? w : h;
            const line = f.side === 'n' ? y + depth : f.side === 's' ? y + h - depth : f.side === 'w' ? x + depth : x + w - depth;
            for (let i = 1.5; i < len; i += 1.5) {
              if (horiz) of('rock').box(X(x + i) - 0.12, S(f.side === 'n' ? y : y + h - depth), X(x + i) + 0.12, S(f.side === 'n' ? y + depth : y + h), 0, HW);
              else of('rock').box(X(f.side === 'w' ? x : x + w - depth), S(y + i) - 0.12, X(f.side === 'w' ? x + depth : x + w), S(y + i) + 0.12, 0, HW);
            }
            for (let i = 0.15; i < len; i += 0.3) {
              if (horiz) of('iron').cylinder(X(x + i), S(line), 0.03, 0, HW, 6);
              else of('iron').cylinder(X(line), S(y + i), 0.03, 0, HW, 6);
            }
            break;
          }
          case 'stairs': {
            const v = f.side === 'n' || f.side === 's';
            const n = 8, w = (v ? 1 : 2) * C, d = (v ? 2 : 1) * C;
            // Steps climb towards the wall.
            for (let i = 0; i < n; i++) {
              const tt = (i + 0.5) / n - 0.5;
              const dir = { n: [0, -1], s: [0, 1], w: [-1, 0], e: [1, 0] }[f.side] || [0, -1];
              const along = v ? d : w;
              const cxs = fx + dir[0] * tt * along, css = fs + dir[1] * tt * along;
              of('stone').boxAt(cxs, css, v ? w : along / n, v ? along / n : d, 0, ((i + 1) / n) * (f.down ? 0.9 : 1.8));
            }
            break;
          }
          // Present day and cyberpunk.
          case 'server': of('dark').boxAt(fx, fs, (f.ang ? 0.7 : 1) * C, (f.ang ? 1 : 0.7) * C, 0, 2.1); of('accent').boxAt(fx, fs, (f.ang ? 0.72 : 0.3) * C, (f.ang ? 0.3 : 0.72) * C, 1.6, 1.66); break;
          case 'console': of('dark').boxAt(fx, fs, (f.ang ? 0.55 : 0.9) * C, (f.ang ? 0.9 : 0.55) * C, 0, 1.0); of('gold').boxAt(fx, fs, (f.ang ? 0.3 : 0.8) * C, (f.ang ? 0.8 : 0.3) * C, 1.0, 1.04); break;
          case 'lamp': of('iron').cylinder(fx, fs, 0.03, 2.3, HW, 6); of('stone').cylinder(fx, fs, 0.5 * C, 2.2, 2.3, 16); break;
          case 'car':
            of('steel').boxAt(fx, fs, (f.ang ? 2.6 : 1.1) * C, (f.ang ? 1.1 : 2.6) * C, 0.2, 0.85);
            of('dark').boxAt(fx, fs, (f.ang ? 1.2 : 1.0) * C, (f.ang ? 1.0 : 1.2) * C, 0.85, 1.4);
            break;
          case 'machine': of('iron').boxAt(fx, fs, f.w * C, f.h * C, 0, 1.6); of('dark').cylinder(fx, fs, Math.min(f.w, f.h) * 0.3 * C, 1.6, 2.4, 14); break;
          case 'vat': of('iron').cylinder(fx, fs, f.r * C * 1.1, 0, 0.25, 16); of('water').cylinder(fx, fs, f.r * C, 0.25, 2.1, 16); of('iron').cylinder(fx, fs, f.r * C * 1.1, 2.1, 2.3, 16); break;
        }
      }
    }
    return { name: titleText(m), groups: [{ name: titleText(m), parts }], materials: MAT };
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
    model3d,
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
