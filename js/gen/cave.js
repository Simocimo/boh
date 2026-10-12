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
      'cave.title.mine': 'Miniera di {n}',
      'cave.title.show': 'Grotte di {n}',
      'cave.title.drain': 'Collettore di {n}',
      'cave.title.park': 'Parco di {n}',
      'cave.title.undercity': 'Sottocittà di {n}',
      'cave.title.den': 'Covo di {n}',
      'cave.title.grotto': 'Grotta tossica di {n}',
      'cave.title.deadwood': 'Bosco morto di {n}',
      'cave.sub.mine': 'miniera abbandonata',
      'cave.sub.show': 'grotta turistica',
      'cave.sub.drain': 'canale scolmatore',
      'cave.sub.park': 'riserva naturale',
      'cave.sub.undercity': 'gallerie sotto l’arcologia',
      'cave.sub.den': 'covo di contrabbandieri',
      'cave.sub.grotto': 'zona contaminata',
      'cave.sub.deadwood': 'zona di quarantena',
      'cave.opt.type.cave@modern': 'Sotterraneo',
      'cave.opt.type.glade@modern': 'Bosco',
      'cave.opt.type.cave@cyber': 'Sottosuolo',
      'cave.opt.type.glade@cyber': 'Bosco morto',
      'cave.entrance@cyber': 'Accesso',
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
      'cave.title.mine': '{n} Mine',
      'cave.title.show': '{n} Caverns',
      'cave.title.drain': '{n} Storm Drain',
      'cave.title.park': '{n} Park',
      'cave.title.undercity': '{n} Undercity',
      'cave.title.den': '{n} Smugglers’ Den',
      'cave.title.grotto': '{n} Toxic Grotto',
      'cave.title.deadwood': '{n} Deadwood',
      'cave.sub.mine': 'abandoned mine',
      'cave.sub.show': 'show cave',
      'cave.sub.drain': 'flood relief culvert',
      'cave.sub.park': 'nature reserve',
      'cave.sub.undercity': 'tunnels under the arcology',
      'cave.sub.den': 'smugglers’ den',
      'cave.sub.grotto': 'contaminated zone',
      'cave.sub.deadwood': 'quarantine zone',
      'cave.opt.type.cave@modern': 'Underground',
      'cave.opt.type.glade@modern': 'Woods',
      'cave.opt.type.cave@cyber': 'Underground',
      'cave.opt.type.glade@cyber': 'Deadwood',
      'cave.entrance@cyber': 'Access',
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
    // Present day (2026): the same places and props under other names.
    mine: {
      mouth: ['Imbocco della galleria. Una grata divelta e il cartello «Pericolo, vietato l’accesso».', 'Adit. A torn-off grate and a sign: “Danger, no entry”.'],
      dripstone: ['Camera a pilastri. Colonne di roccia lasciate a reggere la volta, segnate con vernice spray.', 'Room and pillar. Rock columns left to hold up the roof, marked with spray paint.'],
      lake: ['Livello allagato. L’acqua di falda ha invaso la galleria; sul bordo arrugginisce una pompa.', 'Flooded level. Groundwater has filled the drift; a pump rusts at the edge.'],
      den: ['Deposito attrezzi. Picconi, elmetti con la lampada rotta e un carrello rovesciato.', 'Tool store. Picks, helmets with broken lamps and an overturned mine cart.'],
      spiders: ['Cavi elettrici. Una ragnatela di vecchi cavi pende dal soffitto; alcuni sono ancora in tensione.', 'Power cables. A web of old cables hangs from the roof; some are still live.'],
      fungi: ['Muffa. Una patina bianca copre le armature di legno marcite.', 'Mould. A white film covers the rotting timber props.'],
      crystals: ['Vena di minerale. Il filone scintilla dove i minatori hanno smesso di scavare.', 'Ore vein. The lode glitters where the miners stopped digging.'],
      bats: ['Colonia di pipistrelli. Specie protetta: un cartello vieta di disturbarli.', 'Bat colony. A protected species; a sign forbids disturbing them.'],
      shrine: ['Nicchia di santa Barbara. La statuetta della patrona dei minatori e qualche lumino spento.', 'Saint Barbara’s niche. A statuette of the miners’ patron saint and a few burnt-out candles.'],
      camp: ['Bivacco di esploratori urbani. Una lampada da campeggio, sacchi a pelo e lattine vuote.', 'Urban explorers’ camp. A camping lantern, sleeping bags and empty cans.'],
      chasm: ['Pozzo. Un fornello senza protezioni scende al livello inferiore.', 'Winze. An unguarded shaft drops to the level below.'],
      echo: ['Galleria di carreggio. I binari si perdono nel buio; ogni passo rimbomba.', 'Haulage drift. The rails run off into the dark; every step echoes.'],
      hoard: ['Cassaforte della direzione. Buste paga mai ritirate e il registro dei crolli.', 'Manager’s safe. Uncollected pay packets and the log of the cave-ins.'],
    },
    show: {
      mouth: ['Biglietteria. Tornelli, un negozio di souvenir e il percorso illuminato che scende.', 'Ticket office. Turnstiles, a gift shop and the lit path leading down.'],
      dripstone: ['Sala delle stalattiti. Faretti colorati sulle colonne di calcite; vietato toccare.', 'Dripstone hall. Coloured spotlights on the calcite columns; do not touch.'],
      lake: ['Lago sotterraneo. Una passerella d’acciaio corre sopra l’acqua verde.', 'Underground lake. A steel walkway runs over the green water.'],
      den: ['Zona chiusa al pubblico. Transenne, attrezzi dei manutentori e un cartello di lavori in corso.', 'Closed section. Barriers, maintenance tools and a “works in progress” sign.'],
      spiders: ['Stazione di ricerca. Sensori e cavi tesi tra le rocce misurano umidità e radon.', 'Research station. Sensors and cables strung between the rocks measure humidity and radon.'],
      fungi: ['Lampenflora. Muschi e alghe verdi crescono attorno ai faretti.', 'Lampenflora. Moss and green algae grow around the spotlights.'],
      crystals: ['Sala dei cristalli. Cristalli di aragonite brillano dietro un vetro di protezione.', 'Crystal room. Aragonite crystals glitter behind protective glass.'],
      bats: ['Grotta dei pipistrelli. Qui le luci sono rosse, per non disturbare la colonia.', 'Bat grotto. The lights here are red, so as not to disturb the colony.'],
      shrine: ['Presepe. Ogni Natale le statuine vengono sistemate su una lastra di pietra.', 'Nativity scene. Every Christmas the figurines are set out on a stone slab.'],
      camp: ['Punto di sosta. Panchine, una lampada d’emergenza e la cassetta del pronto soccorso.', 'Rest stop. Benches, an emergency lamp and a first-aid box.'],
      chasm: ['Abisso. Un parapetto e un cartello: profondità 80 metri.', 'Abyss. A railing and a sign: 80 metres deep.'],
      echo: ['Sala dei concerti. Una volta all’anno qui suona un’orchestra.', 'Concert hall. Once a year an orchestra plays here.'],
      hoard: ['Ramo inesplorato. Oltre la transenna, monete antiche tra le ossa di un orso delle caverne.', 'Unexplored branch. Beyond the barrier, old coins among the bones of a cave bear.'],
    },
    drain: {
      mouth: ['Sbocco. Una grata arrugginita sul canale, intasata dai rifiuti dell’ultima piena.', 'Outfall. A rusty grate over the channel, clogged with debris from the last flood.'],
      dripstone: ['Sala dei pilastri. Pilastri di cemento reggono la volta; dalle crepe pendono stalattiti di calcare.', 'Pillar hall. Concrete pillars hold up the vault; limescale straws hang from the cracks.'],
      lake: ['Vasca di laminazione. Acqua stagnante e schiuma grigia; il livello sale quando piove.', 'Retention basin. Stagnant water and grey foam; the level rises when it rains.'],
      den: ['Rifugio di senzatetto. Cartoni, coperte e un carrello della spesa.', 'Rough sleepers’ shelter. Cardboard, blankets and a shopping trolley.'],
      spiders: ['Nodo di cavi. Fibra ottica e linee elettriche corrono lungo le pareti in fasci aggrovigliati.', 'Cable junction. Fibre and power lines run along the walls in tangled bundles.'],
      fungi: ['Muffe. Chiazze verdastre e un odore che toglie il fiato.', 'Mould. Greenish patches and a stench that takes your breath away.'],
      crystals: ['Galleria dei graffiti. Tag fluorescenti brillano alla luce della torcia.', 'Graffiti tunnel. Fluorescent tags glow in the torchlight.'],
      bats: ['Colonia di ratti. Il pavimento si muove; occhi rossi nel buio.', 'Rat colony. The floor moves; red eyes in the dark.'],
      shrine: ['Quadro di comando. Un armadio elettrico che manovra le paratoie del canale.', 'Control cabinet. An electrical box that works the sluice gates.'],
      camp: ['Punto di manutenzione. Una lampada da lavoro e una scala alla marinara fino a un tombino.', 'Maintenance point. A work lamp and a ladder up to a manhole.'],
      chasm: ['Pozzo di caduta. L’acqua precipita verso il livello inferiore.', 'Drop shaft. The water plunges to the level below.'],
      echo: ['Grande collettore. Una volta in mattoni dove ogni rumore rimbomba.', 'Main sewer. A brick vault where every sound echoes.'],
      hoard: ['Nascondiglio. Borsoni con il bottino di una rapina e un telefono usa e getta.', 'Stash. Holdalls with the loot from a robbery and a burner phone.'],
    },
    park: {
      mouth: ['Parcheggio. Uno sterrato, una sbarra e la bacheca con la mappa dei sentieri.', 'Car park. A gravel lot, a barrier and a board with the trail map.'],
      stones: ['Cerchio di massi. Sette massi disposti in tondo, dove si ritrovano gli scout.', 'Boulder ring. Seven boulders set in a circle, where the scouts meet.'],
      spring: ['Fontanella. Acqua potabile da un rubinetto di ghisa.', 'Drinking fountain. Fresh water from a cast-iron tap.'],
      oak: ['Quercia monumentale. Albero protetto, con una staccionata e un cartello.', 'Heritage oak. A protected tree with a fence and a sign.'],
      camp: ['Area campeggio. Piazzole per le tende e un barbecue in muratura.', 'Campsite. Tent pitches and a brick barbecue.'],
      fairy: ['Cerchio di funghi. Un fotografo naturalista si apposta qui all’alba.', 'Fairy ring. A wildlife photographer lies in wait here at dawn.'],
      hut: ['Casetta della forestale. Una radio, un estintore e il registro dei visitatori.', 'Ranger station. A radio, an extinguisher and the visitors’ log.'],
      graves: ['Discarica abusiva. Sacchi di rifiuti, pneumatici e un frigorifero abbandonato.', 'Fly-tipping. Rubbish bags, tyres and a dumped fridge.'],
      thicket: ['Macchia. Rovi fitti; un cinghiale grufola nel sottobosco.', 'Thicket. Dense brambles; a wild boar roots in the undergrowth.'],
      altar: ['Tavolo da picnic. Iniziali incise nel legno e una geocache nascosta sotto.', 'Picnic table. Initials carved into the wood and a geocache taped underneath.'],
      pond: ['Laghetto. Ninfee, rane e un pontile per la pesca sportiva.', 'Pond. Water lilies, frogs and a jetty for anglers.'],
    },
    // Cyberpunk.
    undercity: {
      mouth: ['Accesso di servizio. Una botola della metropolitana dismessa, con il sigillo forzato.', 'Service access. A hatch from the abandoned metro, its seal forced.'],
      dripstone: ['Fondamenta. Piloni di cemento armato reggono l’arcologia sopra; gocciola condensa.', 'Foundations. Ferroconcrete piers hold up the arcology above; condensation drips.'],
      lake: ['Cisterna allagata. Acqua nera, riflessi d’olio e una luce che pulsa sul fondo.', 'Flooded cistern. Black water, an oily sheen and a light pulsing on the bottom.'],
      den: ['Tana di scavenger. Ossa, protesi strappate e i graffiti di una gang.', 'Scavenger nest. Bones, ripped-out prosthetics and gang tags.'],
      spiders: ['Nido di cavi. Fasci di fibra pirata tessuti come una ragnatela; un netrunner ci ha innestato un nodo.', 'Cable nest. Bundles of pirate fibre woven like a web; a netrunner has spliced a node into it.'],
      fungi: ['Coltura idroponica. Funghi bioluminescenti cresciuti sotto lampade UV rubate.', 'Hydroponic farm. Bioluminescent fungi grown under stolen UV lamps.'],
      crystals: ['Server farm abusiva. Rack ronzanti tra le rocce, LED magenta che lampeggiano.', 'Rogue server farm. Racks humming among the rocks, magenta LEDs blinking.'],
      bats: ['Stormo di droni. Microdroni appesi al soffitto come pipistrelli, in ricarica.', 'Drone roost. Microdrones hang from the ceiling like bats, recharging.'],
      shrine: ['Altare della Macchina. Un vecchio mainframe venerato da un culto di tecnoasceti.', 'Machine altar. An old mainframe worshipped by a cult of techno-ascetics.'],
      camp: ['Accampamento di sbandati. Un bidone acceso, brande e una radio pirata.', 'Squatter camp. A burning barrel, cots and a pirate radio.'],
      chasm: ['Pozzo di ventilazione. Un condotto senza fondo; dal reattore sale aria calda.', 'Vent shaft. A bottomless duct; hot air rises from the reactor.'],
      echo: ['Stazione fantasma. Banchine della vecchia metro e schermi pubblicitari che si accendono da soli.', 'Ghost station. Old metro platforms and ad screens that flicker on by themselves.'],
      hoard: ['Cache. Chip di credito, impianti ancora sigillati e un deck militare.', 'Cache. Credit chips, still-sealed implants and a military-grade deck.'],
    },
    den: {
      mouth: ['Ingresso nascosto. Dietro un distributore automatico rotto, una porta blindata.', 'Hidden entrance. Behind a broken vending machine, an armoured door.'],
      dripstone: ['Deposito di fusti. Bidoni di solvente, e di chissà cos’altro.', 'Drum store. Barrels of solvent, and who knows what else.'],
      lake: ['Vasca di raffreddamento. Acqua tiepida in cui si raffreddano i rack di contrabbando.', 'Cooling pool. Warm water cooling the smuggled racks.'],
      den: ['Branda delle guardie. Mozziconi, lattine di energetico e un fucile smart.', 'Guards’ bunk. Cigarette ends, energy-drink cans and a smart rifle.'],
      spiders: ['Rete d’allarme. Fili laser tesi attraverso il passaggio.', 'Tripwire grid. Laser wires strung across the passage.'],
      fungi: ['Serra di droghe sintetiche. Muffe modificate sotto una luce viola.', 'Synth-drug farm. Engineered moulds under a violet light.'],
      crystals: ['Laboratorio di chip. Wafer pirata e una stampante di circuiti.', 'Chip lab. Pirate wafers and a circuit printer.'],
      bats: ['Nido dei droni corrieri. Quadricotteri pronti a decollare da un camino.', 'Courier drone roost. Quadcopters ready to lift off up a chimney.'],
      shrine: ['Banco del ricettatore. Una lastra di metallo, una bilancia e un lettore di chip.', 'Fence’s counter. A metal slab, a pair of scales and a chip reader.'],
      camp: ['Sala comune. Un fornello, un oloschermo e un tavolo da poker.', 'Common room. A hotplate, a holoscreen and a poker table.'],
      chasm: ['Scarico. Un pozzo dove finiscono le prove scomode.', 'Dump shaft. A pit where awkward evidence disappears.'],
      echo: ['Molo sotterraneo. Un canale dove attraccano barchini a luci spente.', 'Underground dock. A canal where skiffs moor with their lights off.'],
      hoard: ['Caveau. Crediti non tracciabili e un prototipo rubato a una corporazione.', 'Vault. Untraceable credits and a prototype stolen from a corp.'],
    },
    grotto: {
      mouth: ['Imboccatura. Cartelli di rischio biologico e una tuta protettiva strappata.', 'Mouth. Biohazard signs and a torn hazmat suit.'],
      dripstone: ['Sala delle stalattiti. Gocce acide scavano punte di pietra corrosa.', 'Dripstone hall. Acid drops eat away at corroded stone spikes.'],
      lake: ['Lago di percolato. Liquido verde e fosforescente, scaricato da una fabbrica.', 'Leachate lake. Phosphorescent green fluid, dumped by a factory.'],
      den: ['Tana dei mutanti. Ossa e stracci attorno a un giaciglio.', 'Mutant lair. Bones and rags around a bedding.'],
      spiders: ['Nido di ragni mutati. Tele spesse e appiccicose come resina.', 'Mutant spider nest. Webs as thick and sticky as resin.'],
      fungi: ['Funghi luminosi. Una foresta di funghi fluorescenti, nutrita dalle scorie.', 'Glowing fungi. A forest of fluorescent mushrooms, fed by the waste.'],
      crystals: ['Cristalli di scorie. Concrezioni tossiche che brillano di magenta.', 'Slag crystals. Toxic growths glowing magenta.'],
      bats: ['Colonia di pipistrelli. Senza pelo, con gli occhi lattiginosi.', 'Bat roost. Hairless, with milky eyes.'],
      shrine: ['Fusti abbandonati. Un bancale di bidoni con il logo di una corporazione grattato via.', 'Dumped drums. A pallet of barrels, a corp logo scratched off.'],
      camp: ['Campo di raccoglitori. Un fuoco, maschere antigas e sacchi di rottami.', 'Scavengers’ camp. A fire, gas masks and sacks of scrap.'],
      chasm: ['Faglia. Vapori acri salgono da una fenditura senza fondo.', 'Fault. Acrid fumes rise from a bottomless crack.'],
      echo: ['Sala dell’eco. Il contatore Geiger crepita e l’eco lo moltiplica.', 'Echo hall. The Geiger counter crackles, and the echo multiplies it.'],
      hoard: ['Relitto. Un drone corriere precipitato, con la valigetta blindata ancora chiusa.', 'Wreck. A crashed courier drone, its armoured case still locked.'],
    },
    deadwood: {
      mouth: ['Breccia. Un varco nella recinzione elettrificata, segnato da nastro di quarantena.', 'Breach. A gap in the electric fence, marked with quarantine tape.'],
      stones: ['Cerchio di antenne. Sette ripetitori arrugginiti trasmettono ancora un segnale.', 'Antenna ring. Seven rusting relays still broadcast a signal.'],
      spring: ['Pozza di condensa. Acqua distillata da un vecchio scambiatore di calore.', 'Condensate pool. Water distilled by an old heat exchanger.'],
      oak: ['Albero ingegnerizzato. L’unico ancora vivo: corteccia metallica e foglie che ronzano.', 'Engineered tree. The only one still alive: metallic bark and humming leaves.'],
      camp: ['Campo nomade. Moto elettriche, un fuoco e una tenda termica.', 'Nomad camp. Electric bikes, a fire and a thermal tent.'],
      fairy: ['Anello di funghi luminosi. Chi ne respira le spore sente voci nel rumore bianco.', 'Glowing ring. Whoever breathes its spores hears voices in white noise.'],
      hut: ['Bunker. Un container blindato, rifugio di un netrunner eremita.', 'Bunker. An armoured container, the hideout of a hermit netrunner.'],
      graves: ['Cimitero di droni. Cumuli di rottami e carcasse di robot.', 'Drone graveyard. Heaps of scrap and robot husks.'],
      thicket: ['Rovi sintetici. Spine di polimero; dentro qualcosa si muove.', 'Synthetic briars. Polymer thorns; something moves inside.'],
      altar: ['Terminale abbandonato. Uno schermo incrinato chiede ancora una password.', 'Abandoned terminal. A cracked screen still asks for a password.'],
      pond: ['Stagno chimico. Acqua iridescente e rane con tre occhi.', 'Chemical pond. Iridescent water and three-eyed frogs.'],
    },
  };
  // The variants of each setting, by type of map.
  const THEMES = {
    modern: { cave: ['mine', 'show', 'drain'], glade: ['park'] },
    cyber: { cave: ['undercity', 'den', 'grotto'], glade: ['deadwood'] },
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
    mine: [['Un gruppo di speleologi ha perso l’orientamento.', 'A group of cavers has lost its bearings.'], ['Un custode con un fucile da caccia fa la ronda.', 'A caretaker with a shotgun makes his rounds.'], ['Grisù: il rilevatore di gas comincia a suonare.', 'Firedamp: the gas detector starts beeping.'], ['Un trafficante nasconde qui la merce.', 'A trafficker stashes his goods here.'], ['Un cane randagio ringhia dal buio.', 'A stray dog growls from the dark.'], ['Qualcuno ha lasciato accesa una fototrappola.', 'Someone has left a trail camera running.']],
    show: [['Una scolaresca in gita, rumorosissima.', 'A very noisy school trip.'], ['Una guida racconta le leggende della grotta.', 'A guide tells the legends of the cave.'], ['Un turista si è staccato dal gruppo.', 'A tourist has wandered off from the group.'], ['Un addetto alla sicurezza con la torcia.', 'A security guard with a torch.'], ['Due speleologi preparano una discesa in corda.', 'Two cavers rig a rope descent.'], ['Blackout: si accendono le luci d’emergenza.', 'Power cut: the emergency lights come on.']],
    drain: [['Un tecnico dell’acquedotto ispeziona le tubature.', 'A water-board technician inspects the pipes.'], ['Una banda di ragazzi gira un video per i social.', 'A bunch of kids shoot a video for social media.'], ['Uno spacciatore aspetta un cliente.', 'A dealer waits for a customer.'], ['Centinaia di ratti affamati.', 'Hundreds of hungry rats.'], ['Un senzatetto sa più di quanto dice.', 'A homeless man knows more than he lets on.'], ['Un drone d’ispezione ronza lungo il canale.', 'An inspection drone buzzes along the channel.']],
    park: [['Una famiglia fa un picnic.', 'A family is having a picnic.'], ['Una guardia forestale controlla i permessi.', 'A ranger checks permits.'], ['Un branco di cinghiali in cerca di cibo.', 'A herd of wild boar looking for food.'], ['Un escursionista si è slogato una caviglia.', 'A hiker has sprained an ankle.'], ['Un cercatore di funghi, diffidente.', 'A wary mushroom forager.'], ['Un ragazzo pilota un drone sopra gli alberi.', 'A kid flies a drone over the trees.']],
    undercity: [['Una gang di sbandati con lame impiantate.', 'A gang of drifters with implanted blades.'], ['Un drone di sicurezza corporativo, smarrito.', 'A lost corporate security drone.'], ['Un netrunner in trance, collegato ai cavi.', 'A netrunner in a trance, jacked into the cables.'], ['Ratti modificati con occhi ottici.', 'Modded rats with optic eyes.'], ['Un androide guasto ripete sempre la stessa frase.', 'A broken android repeats the same sentence over and over.'], ['Un medico clandestino offre impianti di seconda mano.', 'A back-alley doc offers second-hand implants.']],
    den: [['Contrabbandieri contano la merce.', 'Smugglers tally the goods.'], ['Un ricettatore tratta con un cliente nervoso.', 'A fence haggles with a nervous buyer.'], ['Una guardia con un braccio cibernetico.', 'A guard with a cyberarm.'], ['Una torretta automatica ruota lentamente.', 'An automated turret slowly turns.'], ['Un informatore della polizia corporativa.', 'An informant for the corporate police.'], ['Un cane cibernetico dorme accanto alle casse.', 'A cyber-dog sleeps by the crates.']],
    grotto: [['Un mutante cieco segue gli odori.', 'A blind mutant follows the smells.'], ['Una squadra di bonifica corporativa, in tuta stagna.', 'A corporate clean-up crew in sealed suits.'], ['Ratti grandi come cani.', 'Rats the size of dogs.'], ['Uno scavenger con un contatore Geiger.', 'A scavenger with a Geiger counter.'], ['Una melma chimica striscia lungo le pareti.', 'A chemical sludge creeps along the walls.'], ['Un drone di sorveglianza con la batteria quasi scarica.', 'A surveillance drone with an almost flat battery.']],
    deadwood: [['Una banda di nomadi in moto.', 'A gang of nomads on bikes.'], ['Un drone da caccia corporativo pattuglia la zona.', 'A corporate hunter drone patrols the area.'], ['Cani selvatici con innesti cibernetici.', 'Feral dogs with cybernetic implants.'], ['Una botanica clandestina raccoglie campioni.', 'An underground botanist gathers samples.'], ['Un cervo albino, forse un ologramma.', 'An albino stag, maybe a hologram.'], ['Una squadra di mercenari tende un’imboscata.', 'A merc team sets an ambush.']],
  };

  const GW = 120, GH = 90, CELL = 5;
  const W = GW * CELL, H = GH * CELL;

  function generate(seed, opts) {
    const rng = new Carto.Random(seed);
    const type = opts.type || 'cave';
    const setting = Carto.Setting.current;
    // Present day and cyberpunk: which kind of place this is (a mine, a
    // storm drain, an undercity...), from a stream of its own.
    const theme = setting === 'fantasy' ? type : rng.fork('theme').pick(THEMES[setting][type]);
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
      if (k > 0 && pr.bool(0.4)) c.dweller = pr.int(0, DWELLERS[theme].length - 1);
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
    const model = {
      seed, type, name, chambers: orderIdx.map((i) => chambers[i]), outline, mask, dist, passages,
      edge: { x: (edgeP.x + 0.5) * CELL, y: (edgeP.y + 0.5) * CELL, from: { x: (chambers[ent].x + 0.5) * CELL, y: (chambers[ent].y + 0.5) * CELL } },
      water, rocks, spikes, marks, webs, crystals, shrooms, fires, stones, bigTrees, huts, mounds, chasms,
    };
    if (setting !== 'fantasy') model.theme = theme;
    return model;
  }

  // Present day and cyberpunk: what runs along the passages (rails in a
  // mine, a lit walkway with lamps in a show cave, the water channel of a
  // drain, cables in the undercity).
  function passageLines(svg, m, pal) {
    const lines = new Svg.Batch(), lamps = new Svg.Batch();
    for (const ps of m.passages) {
      const pts = ps.map((p) => ({ x: (p.x + 0.5) * CELL, y: (p.y + 0.5) * CELL }));
      lines.smooth(pts.filter((_, i) => i % 3 === 0 || i === pts.length - 1), false);
      for (let i = 10; i < pts.length - 6; i += 22) lamps.circle(pts[i].x, pts[i].y, 1.8);
    }
    const ls = lines.toString(), round = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (m.theme === 'mine') {
      // Sleepers, then two rails.
      svg.path(ls, { stroke: pal.inkSoft, strokeWidth: 6, strokeDasharray: '1.4 3', fill: 'none' });
      svg.path(ls, Object.assign({ stroke: pal.ink, strokeWidth: 3.6 }, round));
      svg.path(ls, Object.assign({ stroke: pal.floor, strokeWidth: 2.2 }, round));
    } else if (m.theme === 'show') {
      svg.path(ls, Object.assign({ stroke: pal.inkSoft, strokeWidth: 4, opacity: 0.35 }, round));
      svg.path(ls, Object.assign({ stroke: pal.inkSoft, strokeWidth: 1, strokeDasharray: '4 3' }, round));
      svg.path(lamps.toString(), { fill: pal.accent, stroke: pal.ink, strokeWidth: 0.5 });
    } else if (m.theme === 'drain') {
      svg.path(ls, Object.assign({ stroke: pal.water, strokeWidth: 5 }, round));
      svg.path(ls, Object.assign({ stroke: pal.waterInk, strokeWidth: 1, strokeDasharray: '6 4', opacity: 0.8 }, round));
    } else if (m.theme === 'undercity' || m.theme === 'den') {
      svg.path(ls, Object.assign({ stroke: pal.accent, strokeWidth: 3, opacity: 0.2 }, round));
      svg.path(ls, Object.assign({ stroke: pal.accent, strokeWidth: 0.8 }, round));
      svg.path(lamps.toString(), { fill: pal.ink, opacity: 0.9 });
    } else if (m.theme === 'grotto') {
      // A trickle of toxic seepage.
      svg.path(ls, Object.assign({ stroke: pal.greenInk, strokeWidth: 4, opacity: 0.25 }, round));
      svg.path(ls, Object.assign({ stroke: pal.greenInk, strokeWidth: 1, strokeDasharray: '2 5' }, round));
    }
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
    if (m.theme && !glade) passageLines(svg, m, pal);
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
    // Cyberpunk: crystals, fungi and fires glow.
    if (Carto.Setting.current === 'cyber') {
      const glow = new Svg.Batch();
      for (const c of m.crystals) glow.circle(c.x, c.y, c.r * 1.8);
      for (const s of m.shrooms) glow.circle(s.x, s.y, s.r * 2);
      for (const f of m.fires) glow.circle(f.x, f.y, 7);
      svg.path(glow.toString(), { fill: pal.accent, opacity: 0.18 });
    }
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
      const title = titleOf(m);
      // Present day and cyberpunk: a line under the title says what the place is.
      Draw.title(svg, W / 2, 30, title, 22, pal, m.theme ? t('cave.sub.' + m.theme) : undefined);
      taken.push(Draw.textBox(W / 2, 30, title, 22, { title: true }));
      if (m.theme) taken.push(Draw.textBox(W / 2, 30 + 22 * 0.85, t('cave.sub.' + m.theme), 22 * 0.42, {}));
      const e = m.edge;
      const ex = Math.max(14, Math.min(W - 14, e.x)), ey = Math.max(16, Math.min(H - 14, e.y));
      const inward = G.norm(G.sub(e.from, { x: ex, y: ey }));
      const lx = ex + inward.x * 18, ly = ey + inward.y * 18;
      Draw.placeLabels(svg, [{
        x: lx, y: ly, text: t('cave.entrance'), size: 12, italic: true,
        offsets: [[0, 0], [0, -1.4], [0, 1.4], [1, 0], [-1, 0], [0, -2.6], [0, 2.6]], gap: 12,
      }], Object.assign({}, pal, { paper: glade ? pal.green : pal.paper }), taken, { x0: 8, y0: 8, x1: W - 8, y1: H - 8 });
      Draw.frame(svg, W, H, pal, 5);
      // Fifty feet, or fifteen metres outside fantasy.
      if (m.theme) Draw.scaleBar(svg, 20, H - 26, 75, 15, 'm', pal, 5);
      else Draw.scaleBar(svg, 20, H - 26, 75, 50, I18n.lang === 'it' ? 'piedi' : 'ft', pal, 5);
    }
    return svg.toString();
  }

  const titleOf = (m) => t('cave.title.' + (m.theme || m.type), { n: m.name });

  function notes(m) {
    const esc = Svg.esc;
    const l = I18n.lang === 'it' ? 0 : 1;
    const theme = m.theme || m.type;
    let h = '<h3>' + esc(titleOf(m)) + '</h3>' + (m.theme ? '<p class="tag">' + esc(t('cave.sub.' + m.theme)) + '</p>' : '') + '<ol>';
    for (const c of m.chambers) {
      const txt = PLACES[theme][c.kind][l];
      const dot = txt.indexOf('. ');
      h += '<li value="' + c.num + '"><strong>' + esc(txt.slice(0, dot)) + '.</strong> ' + esc(txt.slice(dot + 2)) +
        (c.dweller !== undefined ? ' ' + esc(DWELLERS[theme][c.dweller][l]) : '') + '</li>';
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
    fileName: titleOf,
  });

  Carto.Cave = { generate, render };
})(window.Carto = window.Carto || {});
