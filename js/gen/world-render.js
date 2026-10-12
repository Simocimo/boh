/* World generator, drawing side: views, layers, labels, the key and the
   click inspector. The model comes from world.js. */
(function (Carto) {
  'use strict';

  const G = Carto.G, Svg = Carto.Svg, Draw = Carto.Draw, t = Carto.t, I18n = Carto.I18n;
  const World = Carto.World;
  const L = () => (I18n.lang === 'it' ? 0 : 1);
  const fantasy = () => !Carto.Setting || Carto.Setting.current === 'fantasy';

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

  // Present day ("@modern") and cyberpunk ("@cyber"): overrides of the keys
  // above, plus the forms, routes and landmarks only those settings have.
  I18n.add({
    it: {
      'gen.world.desc@modern': 'Continenti di oggi: nazioni con capitali e metropoli, regioni, religioni, autostrade, aeroporti, centrali e basi militari. Clicca la mappa per esplorarla.',
      'gen.world.desc@cyber': 'Continenti spartiti tra megacorporazioni e zone libere: arcologie, sprawl, culti dell’IA, spazioporti e zone tossiche. Clicca la mappa per esplorarla.',
      'world.group.people@modern': 'Popoli e nazioni',
      'world.group.people@cyber': 'Popoli e corporazioni',
      'world.opt.states@modern': 'Nazioni', 'world.opt.states@cyber': 'Territori',
      'world.opt.religions@cyber': 'Culti e credi',
      'world.opt.towns@modern': 'Città', 'world.opt.towns@cyber': 'Sprawl',
      'world.opt.view.religions@cyber': 'Culti',
      'world.opt.view.provinces@cyber': 'Distretti',
      'world.opt.relief@modern': 'Rilievo ombreggiato', 'world.opt.relief@cyber': 'Curve di livello',
      'world.opt.roads@modern': 'Strade e traghetti', 'world.opt.roads@cyber': 'Reti di trasporto',
      'world.opt.burgs@modern': 'Città', 'world.opt.burgs@cyber': 'Sprawl e arcologie',
      'world.opt.markers@modern': 'Punti d’interesse', 'world.opt.markers@cyber': 'Punti caldi',
      'world.hint@modern': 'Clicca un punto della mappa per sapere cosa c’è: nazione, regione, città, clima.',
      'world.hint@cyber': 'Clicca un punto della mappa per sapere chi lo controlla: territorio, distretto, sprawl, clima.',
      'world.states@modern': 'Nazioni', 'world.states@cyber': 'Territori',
      'world.state@modern': 'Nazione', 'world.state@cyber': 'Territorio',
      'world.religions@cyber': 'Culti e credi', 'world.religion@cyber': 'Credo',
      'world.province@modern': 'Area amministrativa', 'world.province@cyber': 'Distretto',
      'world.burgs@modern': 'Città più popolose', 'world.burgs@cyber': 'Sprawl principali',
      'world.markers@modern': 'Punti d’interesse', 'world.markers@cyber': 'Punti caldi',
      'world.diplomacy@modern': 'Relazioni internazionali', 'world.diplomacy@cyber': 'Rapporti tra poteri',
      'world.capital@cyber': 'Arcologia',
      'world.town@modern': 'Città', 'world.village@modern': 'Cittadina', 'world.town@cyber': 'Sprawl', 'world.village@cyber': 'Insediamento',
      'world.free@modern': 'Territori non rivendicati', 'world.free@cyber': 'Zone fuori controllo',
      'world.openCity@modern': 'Apri la pianta della città', 'world.openCity@cyber': 'Apri la mappa dello sprawl',
      'world.openVillage@modern': 'Apri la pianta della cittadina', 'world.openVillage@cyber': 'Apri la mappa dell’insediamento',
      'world.openDungeon@modern': 'Apri la pianta dei sotterranei', 'world.openDungeon@cyber': 'Apri la pianta interna',
      'world.openCave@modern': 'Apri la mappa della grotta', 'world.openCave@cyber': 'Apri la mappa dei tunnel',
      'world.openMine': 'Apri la mappa delle gallerie', 'world.openGlade': 'Apri la mappa della radura',
      'world.openGlade@modern': 'Apri la mappa del parco', 'world.openGlade@cyber': 'Apri la mappa della bioriserva',
      'world.sub.political@modern': 'carta politica · 2026', 'world.sub.political@cyber': 'territori corporativi',
      'world.sub.religions@cyber': 'carta dei culti', 'world.sub.provinces@cyber': 'carta dei distretti',
      'world.folk@modern': 'Fede tradizionale di {n}', 'world.folk@cyber': 'Vecchi dèi di {n}',
      'world.routes': 'Trasporti',
      'route.road': 'strade', 'route.trail': 'sentieri', 'route.sea': 'rotte marittime',
      'route.road@modern': 'autostrade e ferrovie', 'route.trail@modern': 'strade statali', 'route.sea@modern': 'linee di traghetti',
      'route.road@cyber': 'superstrade maglev', 'route.trail@cyber': 'strade di servizio', 'route.sea@cyber': 'rotte dei cargo automatici',
      // Forms of government, as titles and as kinds.
      'form.fedrepublic': 'Repubblica federale di {n}', 'form.constmonarchy': 'Regno di {n}', 'form.federation': 'Federazione di {n}',
      'form.union': 'Unione di {n}', 'form.confederation': 'Confederazione di {n}', 'form.peoplesrepublic': 'Repubblica popolare di {n}',
      'form.corporation': 'Territorio {n}', 'form.conglomerate': 'Dominio {n}', 'form.protectorate': 'Protettorato di {n}',
      'form.freezone': 'Zona libera di {n}', 'form.machinerepublic': 'Repubblica delle macchine di {n}',
      'ftype.republic': 'repubblica', 'ftype.fedrepublic': 'repubblica federale', 'ftype.constmonarchy': 'monarchia costituzionale',
      'ftype.federation': 'federazione', 'ftype.union': 'unione di stati', 'ftype.confederation': 'confederazione',
      'ftype.peoplesrepublic': 'repubblica popolare', 'ftype.principality': 'principato', 'ftype.emirate': 'emirato',
      'ftype.corporation': 'corporazione', 'ftype.conglomerate': 'conglomerato', 'ftype.protectorate': 'protettorato corporativo',
      'ftype.freezone': 'zona libera', 'ftype.machinerepublic': 'repubblica delle macchine',
      'prov.1@modern': 'Regione di {n}', 'prov.2@modern': 'Distretto di {n}', 'prov.3@modern': 'Contea di {n}', 'prov.4@modern': 'Dipartimento di {n}',
      'prov.0@cyber': 'Settore {n}', 'prov.1@cyber': 'Distretto {n}', 'prov.2@cyber': 'Zona {n}', 'prov.3@cyber': 'Blocco {n}', 'prov.4@cyber': 'Quadrante {n}',
      'rel.1@modern': 'Comunità di {n}', 'rel.3@modern': 'Confessione di {n}', 'rel.4@modern': 'Chiesa riformata di {n}', 'rel.5@modern': 'Movimento di {n}',
      'cult.0@modern': 'Setta di {n}', 'cult.1@modern': 'Nuova Era di {n}', 'cult.2@modern': 'Missione di {n}', 'cult.3@modern': 'Fondazione {n}',
      'cult.4@modern': 'Famiglia di {n}', 'cult.5@modern': 'Cerchio di {n}',
      'rel.0@cyber': 'Chiesa del Codice di {n}', 'rel.1@cyber': 'Credo aziendale {n}', 'rel.2@cyber': 'Via del Silicio di {n}', 'rel.3@cyber': 'Ordine della Rete di {n}',
      'rel.4@cyber': 'Luce binaria di {n}', 'rel.5@cyber': 'Figli della macchina {n}', 'rel.6@cyber': 'Tempio digitale di {n}',
      'cult.0@cyber': 'Culto dell’IA {n}', 'cult.1@cyber': 'Setta dei Potenziati di {n}', 'cult.2@cyber': 'Misteri del Codice {n}',
      'cult.4@cyber': 'Fratellanza cromata di {n}', 'cult.5@cyber': 'Vincolo neurale di {n}', 'cult.6@cyber': 'Voce nella Rete di {n}',
      'ctype.highland@modern': 'montana', 'ctype.nomadic@modern': 'pastorale', 'ctype.hunting@modern': 'forestale', 'ctype.generic@modern': 'urbana',
      'ctype.naval@cyber': 'portuale', 'ctype.highland@cyber': 'd’altura', 'ctype.hunting@cyber': 'di frontiera', 'ctype.generic@cyber': 'metropolitana',
      'rtype.organized@modern': 'confessione', 'rtype.cult@modern': 'nuovo movimento religioso',
      'rtype.folk@cyber': 'fede ancestrale', 'rtype.organized@cyber': 'credo', 'rtype.cult@cyber': 'culto dell’IA',
      'relation.ally@modern': 'alleanza', 'relation.friendly@modern': 'accordo commerciale', 'relation.suspicion@modern': 'sanzioni',
      'relation.rival@modern': 'rivalità', 'relation.war@modern': 'in guerra',
      'relation.ally@cyber': 'fusione', 'relation.friendly@cyber': 'patto di non aggressione', 'relation.suspicion@cyber': 'spionaggio industriale',
      'relation.rival@cyber': 'scalata ostile', 'relation.war@cyber': 'guerra corporativa',
      // Landmarks of today.
      'marker.volcano@modern': 'Vulcano attivo', 'marker.springs@modern': 'Terme', 'marker.ruins@modern': 'Sito archeologico',
      'marker.dungeon@modern': 'Bunker abbandonato', 'marker.cave@modern': 'Grotta turistica', 'marker.grove@modern': 'Parco nazionale',
      'marker.battlefield@modern': 'Base militare', 'marker.monster@modern': 'Piattaforma offshore',
      'marker.airport': 'Aeroporto', 'marker.powerplant': 'Centrale elettrica', 'marker.nuclear': 'Centrale nucleare',
      'note.volcano.0@modern': 'Monte {n}: vulcano attivo, sorvegliato giorno e notte dall’osservatorio.', 'note.volcano.1@modern': 'Il vulcano {n} è chiuso ai turisti dall’ultima eruzione.', 'note.volcano.2@modern': 'Sulle pendici di {n} i vigneti arrivano fino alle colate di lava.',
      'note.springs.0@modern': 'Terme di {n}: alberghi di lusso e piscine all’aperto.', 'note.springs.1@modern': 'Bagni di {n}, sorgenti calde frequentate dai pensionati.', 'note.springs.2@modern': 'Terme di {n}, chiuse per fallimento: la piscina è ancora piena.',
      'note.mine.0@modern': 'Miniera di {n}: rame estratto a cielo aperto, il giacimento più grande del paese.', 'note.mine.1@modern': 'Miniera abbandonata di {n}: le gallerie sono in parte crollate.', 'note.mine.2@modern': 'Cava di {n}: da qui viene il marmo della capitale.',
      'note.ruins.0@modern': 'Sito archeologico di {n}: scavi in corso, ingresso a pagamento.', 'note.ruins.1@modern': 'Necropoli di {n}, scoperta durante i lavori dell’autostrada.', 'note.ruins.2@modern': 'Rovine di {n}, patrimonio dell’umanità.',
      'note.dungeon.0@modern': 'Bunker di {n}: rifugio antiatomico della Guerra fredda, abbandonato.', 'note.dungeon.1@modern': 'Ex deposito militare di {n}, sigillato e sorvegliato dalle telecamere.', 'note.dungeon.2@modern': 'Gallerie di {n}: un ospedale sotterraneo dimenticato.',
      'note.cave.0@modern': 'Grotte di {n}: visite guidate ogni ora.', 'note.cave.1@modern': 'Grotta di {n}, meta di speleologi: tre sono dispersi da giorni.', 'note.cave.2@modern': 'Abisso di {n}: il fondo non è ancora stato esplorato.',
      'note.grove.0@modern': 'Parco nazionale di {n}: lupi, orsi e sentieri segnati.', 'note.grove.1@modern': 'Riserva naturale di {n}: vietato uscire dai sentieri.', 'note.grove.2@modern': 'Foresta di {n}, dove i telefoni perdono il segnale.',
      'note.lighthouse.0@modern': 'Faro di {n}, automatizzato da vent’anni.', 'note.lighthouse.1@modern': 'Faro di {n}, oggi un bed & breakfast.', 'note.lighthouse.2@modern': 'Faro di {n}: la luce si è spenta senza motivo.',
      'note.battlefield.0@modern': 'Base militare di {n}: zona interdetta, droni in volo.', 'note.battlefield.1@modern': 'Base aerea di {n}, a ridosso del confine conteso.', 'note.battlefield.2@modern': 'Poligono di tiro di {n}: esercitazioni ogni notte.',
      'note.monster.0@modern': 'Piattaforma petrolifera {n}: trecento operai in mezzo all’oceano.', 'note.monster.1@modern': 'Parco eolico offshore di {n}.', 'note.monster.2@modern': 'Piattaforma {n}: dismessa, eppure qualcuno vi accende ancora le luci.',
      'note.wreck.0@modern': 'Relitto della {n}: petroliera affondata, meta di sub.', 'note.wreck.1@modern': 'Relitto della {n}, mercantile con un carico mai dichiarato.', 'note.wreck.2@modern': 'Relitto della {n}, affondata durante la guerra.',
      'note.airport.0': 'Aeroporto internazionale di {n}.', 'note.airport.1': 'Aeroporto di {n}: voli low cost e un terminal mai finito.', 'note.airport.2': 'Aeroporto di {n}, scalo merci aperto giorno e notte.',
      'note.powerplant.0': 'Centrale idroelettrica di {n}, con la diga sul fiume.', 'note.powerplant.1': 'Centrale termoelettrica di {n}: le ciminiere si vedono da lontano.', 'note.powerplant.2': 'Centrale di {n}, contestata dagli ambientalisti.',
      'note.nuclear.0': 'Centrale nucleare di {n}: tre reattori e vigilanza armata.', 'note.nuclear.1': 'Centrale nucleare di {n}, in smantellamento da quindici anni.', 'note.nuclear.2': 'Centrale nucleare di {n}: un incidente mai chiarito ha svuotato i paesi vicini.',
      // Landmarks of the sprawl age.
      'marker.volcano@cyber': 'Impianto geotermico', 'marker.springs@cyber': 'Zona tossica', 'marker.mine@cyber': 'Miniera automatizzata',
      'marker.ruins@cyber': 'Rovine pre-Collasso', 'marker.dungeon@cyber': 'Fortezza dati', 'marker.cave@cyber': 'Mercato nero',
      'marker.grove@cyber': 'Bioriserva', 'marker.lighthouse@cyber': 'Torre radar', 'marker.battlefield@cyber': 'Zona di guerra',
      'marker.monster@cyber': 'Piattaforma galleggiante', 'marker.wreck@cyber': 'Relitto di cargo',
      'marker.spaceport': 'Spazioporto', 'marker.arcology': 'Arcologia', 'marker.crashed': 'Orbitale precipitato',
      'note.volcano.0@cyber': 'Impianto geotermico {n}: il vulcano alimenta mezzo continente.', 'note.volcano.1@cyber': 'Il vulcano {n} è proprietà privata, sorvegliata da droni armati.', 'note.volcano.2@cyber': 'Pozzi geotermici di {n}, dove i tecnici lavorano in esoscheletro.',
      'note.springs.0@cyber': 'Zona tossica di {n}: acque fumanti color ruggine, contatori Geiger impazziti.', 'note.springs.1@cyber': 'Paludi chimiche di {n}, discarica di tre corporazioni.', 'note.springs.2@cyber': 'Zona rossa di {n}: ci vivono solo scavenger e mutanti.',
      'note.mine.0@cyber': 'Miniera automatizzata di {n}: nessun umano ci scende da dieci anni.', 'note.mine.1@cyber': 'Gallerie di {n}: i robot minatori hanno smesso di rispondere.', 'note.mine.2@cyber': 'Estrazione di terre rare a {n}, sotto contratto militare.',
      'note.ruins.0@cyber': 'Rovine di {n}, una città morta prima del Collasso.', 'note.ruins.1@cyber': 'Torri crollate di {n}, coperte di rampicanti e antenne.', 'note.ruins.2@cyber': 'Vecchio centro di {n}: i nomadi lo spogliano del rame.',
      'note.dungeon.0@cyber': 'Fortezza dati di {n}: server blindati sotto la montagna.', 'note.dungeon.1@cyber': 'Laboratorio nero di {n}, che ufficialmente non è mai esistito.', 'note.dungeon.2@cyber': 'Caveau di {n}: un’IA custodisce ciò che resta di una banca.',
      'note.cave.0@cyber': 'Mercato nero di {n}: impianti di seconda mano, nessuna domanda.', 'note.cave.1@cyber': 'Tunnel di {n}: contrabbando di armi e farmaci.', 'note.cave.2@cyber': 'Bazar sotterraneo di {n}, dove i netrunner vendono i loro segreti.',
      'note.grove.0@cyber': 'Bioriserva di {n}: l’ultima foresta vera, sotto una cupola.', 'note.grove.1@cyber': 'Serre di {n}: colture geneticamente modificate.', 'note.grove.2@cyber': 'Bosco di {n}: alberi sintetici che respirano per la città.',
      'note.lighthouse.0@cyber': 'Torre radar di {n}: traccia tutto il traffico navale.', 'note.lighthouse.1@cyber': 'Antenna di {n}, ripetitore della rete pirata.', 'note.lighthouse.2@cyber': 'Faro di {n}: trasmette ancora un segnale che nessuno sa decifrare.',
      'note.battlefield.0@cyber': 'Zona di guerra di {n}: due corporazioni si contendono il confine.', 'note.battlefield.1@cyber': 'Campo minato di {n}, disseminato di droni abbattuti.', 'note.battlefield.2@cyber': 'Avamposto di {n}, presidiato da mercenari.',
      'note.monster.0@cyber': 'Piattaforma {n}: città galleggiante fuori da ogni giurisdizione.', 'note.monster.1@cyber': 'Server farm sommersa di {n}, raffreddata dall’oceano.', 'note.monster.2@cyber': 'Piattaforma pirata {n}: rifugio di hacker e contrabbandieri.',
      'note.wreck.0@cyber': 'Relitto della {n}: portacontainer carica di impianti illegali.', 'note.wreck.1@cyber': 'Scafo della {n}, nave autonoma andata alla deriva.', 'note.wreck.2@cyber': 'Relitto della {n}: la sua IA chiede ancora aiuto via radio.',
      'note.spaceport.0': 'Spazioporto di {n}: navette orbitali ogni sei ore.', 'note.spaceport.1': 'Spazioporto di {n}, porta d’accesso alle stazioni orbitali.', 'note.spaceport.2': 'Rampe di lancio di {n}, ferme per una guerra di tariffe.',
      'note.arcology.0': 'Arcologia {n}: un milione di persone che non escono mai.', 'note.arcology.1': 'Arcologia {n}, sede di una corporazione in ascesa.', 'note.arcology.2': 'Arcologia {n}, incompiuta: le bande occupano i piani alti.',
      'note.crashed.0': 'Orbitale precipitato di {n}: la stazione è caduta dieci anni fa.', 'note.crashed.1': 'Rottami di {n}: un satellite militare, ancora armato.', 'note.crashed.2': 'Cratere di {n}, dove giace un modulo orbitale che le corporazioni si contendono.',
    },
    en: {
      'gen.world.desc@modern': 'Present-day continents: nations with capitals and big cities, regions, religions, motorways, airports, power plants and military bases. Click the map to explore it.',
      'gen.world.desc@cyber': 'Continents carved up between megacorporations and free zones: arcologies, sprawls, AI cults, spaceports and toxic zones. Click the map to explore it.',
      'world.group.people@modern': 'Peoples and nations',
      'world.group.people@cyber': 'Peoples and corporations',
      'world.opt.states@modern': 'Nations', 'world.opt.states@cyber': 'Territories',
      'world.opt.religions@cyber': 'Cults and creeds',
      'world.opt.towns@modern': 'Cities', 'world.opt.towns@cyber': 'Sprawls',
      'world.opt.view.religions@cyber': 'Cults',
      'world.opt.view.provinces@cyber': 'Districts',
      'world.opt.relief@modern': 'Shaded relief', 'world.opt.relief@cyber': 'Contour lines',
      'world.opt.roads@modern': 'Roads and ferries', 'world.opt.roads@cyber': 'Transport network',
      'world.opt.burgs@modern': 'Cities', 'world.opt.burgs@cyber': 'Sprawls and arcologies',
      'world.opt.markers@cyber': 'Hot spots',
      'world.hint@modern': 'Click any point of the map to see what is there: nation, region, city, climate.',
      'world.hint@cyber': 'Click any point of the map to see who controls it: territory, district, sprawl, climate.',
      'world.states@modern': 'Nations', 'world.states@cyber': 'Territories',
      'world.state@modern': 'Nation', 'world.state@cyber': 'Territory',
      'world.religions@cyber': 'Cults and creeds', 'world.religion@cyber': 'Creed',
      'world.province@modern': 'Administrative area', 'world.province@cyber': 'District',
      'world.burgs@modern': 'Largest cities', 'world.burgs@cyber': 'Main sprawls',
      'world.markers@cyber': 'Hot spots',
      'world.diplomacy@modern': 'International relations', 'world.diplomacy@cyber': 'Balance of power',
      'world.capital@cyber': 'Arcology',
      'world.town@modern': 'City', 'world.village@modern': 'Small town', 'world.town@cyber': 'Sprawl', 'world.village@cyber': 'Settlement',
      'world.free@modern': 'Unclaimed land', 'world.free@cyber': 'Lawless zones',
      'world.openCity@modern': 'Open the city map', 'world.openCity@cyber': 'Open the sprawl map',
      'world.openVillage@modern': 'Open the town map', 'world.openVillage@cyber': 'Open the settlement map',
      'world.openDungeon@modern': 'Open the underground plan', 'world.openDungeon@cyber': 'Open the floor plan',
      'world.openCave@cyber': 'Open the tunnel map',
      'world.openMine': 'Open the map of the tunnels', 'world.openGlade': 'Open the glade map',
      'world.openGlade@modern': 'Open the park map', 'world.openGlade@cyber': 'Open the bio-reserve map',
      'world.sub.political@modern': 'political map · 2026', 'world.sub.political@cyber': 'corporate territories',
      'world.sub.religions@cyber': 'map of cults', 'world.sub.provinces@cyber': 'map of districts',
      'world.folk@modern': 'Traditional faith of {n}', 'world.folk@cyber': 'Old gods of {n}',
      'world.routes': 'Transport',
      'route.road': 'roads', 'route.trail': 'trails', 'route.sea': 'sea lanes',
      'route.road@modern': 'motorways and railways', 'route.trail@modern': 'main roads', 'route.sea@modern': 'ferry lines',
      'route.road@cyber': 'maglev highways', 'route.trail@cyber': 'service roads', 'route.sea@cyber': 'drone freighter lanes',
      'form.fedrepublic': 'Federal Republic of {n}', 'form.constmonarchy': 'Kingdom of {n}', 'form.federation': 'Federation of {n}',
      'form.union': '{n} Union', 'form.confederation': '{n} Confederation', 'form.peoplesrepublic': 'People’s Republic of {n}',
      'form.corporation': '{n} Territory', 'form.conglomerate': '{n} Dominion', 'form.protectorate': 'Protectorate of {n}',
      'form.freezone': 'Free Zone of {n}', 'form.machinerepublic': 'Machine Republic of {n}',
      'ftype.republic': 'republic', 'ftype.fedrepublic': 'federal republic', 'ftype.constmonarchy': 'constitutional monarchy',
      'ftype.federation': 'federation', 'ftype.union': 'union of states', 'ftype.confederation': 'confederation',
      'ftype.peoplesrepublic': 'people’s republic', 'ftype.principality': 'principality', 'ftype.emirate': 'emirate',
      'ftype.corporation': 'corporation', 'ftype.conglomerate': 'conglomerate', 'ftype.protectorate': 'corporate protectorate',
      'ftype.freezone': 'free zone', 'ftype.machinerepublic': 'machine republic',
      'prov.1@modern': '{n} Region', 'prov.2@modern': '{n} District', 'prov.3@modern': '{n} County', 'prov.4@modern': 'Department of {n}',
      'prov.0@cyber': '{n} Sector', 'prov.1@cyber': '{n} District', 'prov.2@cyber': '{n} Zone', 'prov.3@cyber': '{n} Block', 'prov.4@cyber': '{n} Quadrant',
      'rel.1@modern': 'Community of {n}', 'rel.3@modern': 'Confession of {n}', 'rel.4@modern': 'Reformed Church of {n}', 'rel.5@modern': '{n} Movement',
      'cult.0@modern': 'Sect of {n}', 'cult.1@modern': 'New Age of {n}', 'cult.2@modern': 'Mission of {n}', 'cult.3@modern': '{n} Foundation',
      'cult.4@modern': 'Family of {n}', 'cult.5@modern': 'Circle of {n}',
      'rel.0@cyber': 'Church of the Code of {n}', 'rel.1@cyber': '{n} Corporate Creed', 'rel.2@cyber': 'Silicon Way of {n}', 'rel.3@cyber': 'Order of the Net of {n}',
      'rel.4@cyber': 'Binary Light of {n}', 'rel.5@cyber': 'Children of the Machine {n}', 'rel.6@cyber': 'Digital Temple of {n}',
      'cult.0@cyber': 'Cult of the AI {n}', 'cult.1@cyber': 'Sect of the Augmented of {n}', 'cult.2@cyber': 'Mysteries of the Code {n}',
      'cult.4@cyber': 'Chrome Brotherhood of {n}', 'cult.5@cyber': 'Neural Bond of {n}', 'cult.6@cyber': 'Voice in the Net of {n}',
      'ctype.highland@modern': 'mountain', 'ctype.nomadic@modern': 'pastoral', 'ctype.hunting@modern': 'forest', 'ctype.generic@modern': 'urban',
      'ctype.naval@cyber': 'dockside', 'ctype.hunting@cyber': 'frontier', 'ctype.generic@cyber': 'metropolitan',
      'rtype.organized@modern': 'denomination', 'rtype.cult@modern': 'new religious movement',
      'rtype.folk@cyber': 'ancestral faith', 'rtype.organized@cyber': 'creed', 'rtype.cult@cyber': 'AI cult',
      'relation.ally@modern': 'alliance', 'relation.friendly@modern': 'trade agreement', 'relation.suspicion@modern': 'sanctions',
      'relation.rival@modern': 'rivalry', 'relation.war@modern': 'at war',
      'relation.ally@cyber': 'merger', 'relation.friendly@cyber': 'non-aggression pact', 'relation.suspicion@cyber': 'industrial espionage',
      'relation.rival@cyber': 'hostile takeover', 'relation.war@cyber': 'corporate war',
      'marker.volcano@modern': 'Active volcano', 'marker.springs@modern': 'Thermal spa', 'marker.ruins@modern': 'Archaeological site',
      'marker.dungeon@modern': 'Abandoned bunker', 'marker.cave@modern': 'Show cave', 'marker.grove@modern': 'National park',
      'marker.battlefield@modern': 'Military base', 'marker.monster@modern': 'Offshore platform',
      'marker.airport': 'Airport', 'marker.powerplant': 'Power plant', 'marker.nuclear': 'Nuclear power plant',
      'note.volcano.0@modern': 'Mount {n}: an active volcano, watched day and night by the observatory.', 'note.volcano.1@modern': 'The volcano {n} has been closed to tourists since the last eruption.', 'note.volcano.2@modern': 'On the slopes of {n}, vineyards reach right up to the lava flows.',
      'note.springs.0@modern': '{n} Spa: luxury hotels and open-air pools.', 'note.springs.1@modern': 'Baths of {n}, hot springs popular with pensioners.', 'note.springs.2@modern': '{n} Spa, closed after going bankrupt: the pool is still full.',
      'note.mine.0@modern': 'Mine of {n}: an open-pit copper mine, the largest in the country.', 'note.mine.1@modern': 'Abandoned mine of {n}: the tunnels have partly collapsed.', 'note.mine.2@modern': 'Quarry of {n}: the capital’s marble comes from here.',
      'note.ruins.0@modern': 'Archaeological site of {n}: digs in progress, paid entry.', 'note.ruins.1@modern': 'Necropolis of {n}, found while building the motorway.', 'note.ruins.2@modern': 'Ruins of {n}, a World Heritage site.',
      'note.dungeon.0@modern': 'Bunker of {n}: an abandoned Cold War fallout shelter.', 'note.dungeon.1@modern': 'Former military depot of {n}, sealed and watched by cameras.', 'note.dungeon.2@modern': 'Tunnels of {n}: a forgotten underground hospital.',
      'note.cave.0@modern': 'Caves of {n}: guided tours every hour.', 'note.cave.1@modern': 'Cave of {n}, popular with cavers: three have been missing for days.', 'note.cave.2@modern': 'Abyss of {n}: its bottom has not been explored yet.',
      'note.grove.0@modern': '{n} National Park: wolves, bears and marked trails.', 'note.grove.1@modern': '{n} Nature Reserve: no straying from the trails.', 'note.grove.2@modern': 'Forest of {n}, where phones lose their signal.',
      'note.lighthouse.0@modern': 'Lighthouse of {n}, automated twenty years ago.', 'note.lighthouse.1@modern': 'Lighthouse of {n}, now a bed & breakfast.', 'note.lighthouse.2@modern': 'Lighthouse of {n}: its light went out for no reason.',
      'note.battlefield.0@modern': '{n} Military Base: restricted area, drones overhead.', 'note.battlefield.1@modern': '{n} Air Base, right by the disputed border.', 'note.battlefield.2@modern': '{n} Firing Range: exercises every night.',
      'note.monster.0@modern': '{n} oil rig: three hundred workers in the middle of the ocean.', 'note.monster.1@modern': '{n} offshore wind farm.', 'note.monster.2@modern': '{n} platform: decommissioned, yet someone still turns on the lights.',
      'note.wreck.0@modern': 'Wreck of the {n}: a sunken tanker, popular with divers.', 'note.wreck.1@modern': 'Wreck of the {n}, a freighter with an undeclared cargo.', 'note.wreck.2@modern': 'Wreck of the {n}, sunk during the war.',
      'note.airport.0': '{n} International Airport.', 'note.airport.1': '{n} Airport: budget flights and a terminal never finished.', 'note.airport.2': '{n} Airport, a cargo hub open day and night.',
      'note.powerplant.0': '{n} hydroelectric plant, with its dam on the river.', 'note.powerplant.1': '{n} power station: its chimneys can be seen from afar.', 'note.powerplant.2': '{n} power plant, opposed by environmentalists.',
      'note.nuclear.0': '{n} nuclear power plant: three reactors and armed security.', 'note.nuclear.1': '{n} nuclear plant, fifteen years into its decommissioning.', 'note.nuclear.2': '{n} nuclear plant: an unexplained accident emptied the nearby towns.',
      'marker.volcano@cyber': 'Geothermal plant', 'marker.springs@cyber': 'Toxic zone', 'marker.mine@cyber': 'Automated mine',
      'marker.ruins@cyber': 'Pre-Collapse ruins', 'marker.dungeon@cyber': 'Data fortress', 'marker.cave@cyber': 'Black market',
      'marker.grove@cyber': 'Bio-reserve', 'marker.lighthouse@cyber': 'Radar tower', 'marker.battlefield@cyber': 'War zone',
      'marker.monster@cyber': 'Floating platform', 'marker.wreck@cyber': 'Cargo wreck',
      'marker.spaceport': 'Spaceport', 'marker.arcology': 'Arcology', 'marker.crashed': 'Crashed orbital',
      'note.volcano.0@cyber': '{n} geothermal plant: the volcano powers half the continent.', 'note.volcano.1@cyber': 'The volcano {n} is private property, guarded by armed drones.', 'note.volcano.2@cyber': '{n} geothermal wells, where technicians work in exoskeletons.',
      'note.springs.0@cyber': '{n} toxic zone: rust-coloured steaming waters, Geiger counters gone wild.', 'note.springs.1@cyber': 'Chemical marshes of {n}, a dump for three corporations.', 'note.springs.2@cyber': 'Red zone of {n}: only scavengers and mutants live here.',
      'note.mine.0@cyber': '{n} automated mine: no human has gone down in ten years.', 'note.mine.1@cyber': 'Tunnels of {n}: the mining robots stopped answering.', 'note.mine.2@cyber': 'Rare-earth extraction at {n}, under military contract.',
      'note.ruins.0@cyber': 'Ruins of {n}, a city that died before the Collapse.', 'note.ruins.1@cyber': 'Fallen towers of {n}, covered in creepers and antennas.', 'note.ruins.2@cyber': 'Old downtown of {n}: nomads strip it for copper.',
      'note.dungeon.0@cyber': '{n} data fortress: armoured servers under the mountain.', 'note.dungeon.1@cyber': '{n} black lab, which officially never existed.', 'note.dungeon.2@cyber': '{n} vault: an AI guards what is left of a bank.',
      'note.cave.0@cyber': '{n} black market: second-hand implants, no questions asked.', 'note.cave.1@cyber': 'Tunnels of {n}: weapons and drugs smuggled through.', 'note.cave.2@cyber': '{n} underground bazaar, where netrunners sell their secrets.',
      'note.grove.0@cyber': '{n} bio-reserve: the last real forest, under a dome.', 'note.grove.1@cyber': '{n} greenhouses: genetically modified crops.', 'note.grove.2@cyber': 'Woods of {n}: synthetic trees that breathe for the city.',
      'note.lighthouse.0@cyber': '{n} radar tower: it tracks all the shipping.', 'note.lighthouse.1@cyber': '{n} antenna, a relay for the pirate net.', 'note.lighthouse.2@cyber': 'Lighthouse of {n}: it still sends a signal no one can decode.',
      'note.battlefield.0@cyber': '{n} war zone: two corporations fight over the border.', 'note.battlefield.1@cyber': '{n} minefield, littered with downed drones.', 'note.battlefield.2@cyber': '{n} outpost, held by mercenaries.',
      'note.monster.0@cyber': '{n} platform: a floating city outside any jurisdiction.', 'note.monster.1@cyber': '{n} submerged server farm, cooled by the ocean.', 'note.monster.2@cyber': '{n} pirate platform: a haven for hackers and smugglers.',
      'note.wreck.0@cyber': 'Wreck of the {n}: a container ship full of illegal implants.', 'note.wreck.1@cyber': 'Hull of the {n}, a self-driving ship that drifted away.', 'note.wreck.2@cyber': 'Wreck of the {n}: its AI still calls for help on the radio.',
      'note.spaceport.0': '{n} spaceport: orbital shuttles every six hours.', 'note.spaceport.1': '{n} spaceport, gateway to the orbital stations.', 'note.spaceport.2': '{n} launch pads, idle because of a tariff war.',
      'note.arcology.0': '{n} arcology: a million people who never go outside.', 'note.arcology.1': '{n} arcology, headquarters of a rising corporation.', 'note.arcology.2': '{n} arcology, unfinished: gangs hold the upper floors.',
      'note.crashed.0': 'Crashed orbital of {n}: the station fell ten years ago.', 'note.crashed.1': 'Wreckage of {n}: a military satellite, still armed.', 'note.crashed.2': 'Crater of {n}, holding an orbital module the corporations are fighting over.',
    },
  });

  // ------------------------------------------------------------------ names

  const stateName = (s) => t('form.' + s.form, { n: s.name });
  const provName = (m, p) => p.customName || t('prov.' + p.form, { n: m.burgs[p.burg] ? m.burgs[p.burg].name : p.seatName || '?' });
  const relName = (m, r) => r.customName || (r.kind === 'folk' ? t('world.folk', { n: m.cultures[r.culture].name }) : t((r.kind === 'cult' ? 'cult.' : 'rel.') + r.form, { n: r.deity }));
  const markerNote = (mk) => mk.note || t('note.' + mk.type + '.' + mk.v, { n: mk.name });
  const fmt = (v) => Math.round(v).toLocaleString(I18n.lang);
  // A town's size on the fantasy scale (thousands): present-day and cyberpunk
  // towns are bigger, but their kind and their plan follow this.
  const basePop = (m, b) => (m ? b.population / (m.popScale || 1) : b.population);
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

  // Glyphs that change with the setting (a battlefield becomes a military base…).
  const GLYPH = {
    modern: { battlefield: 'base', monster: 'platform' },
    cyber: { battlefield: 'base', monster: 'platform', springs: 'toxic', dungeon: 'datafort' },
  };

  function markerGlyph(svg, mk, pal) {
    const x = mk.x, y = mk.y, r = 6.5;
    // A pin: circle on a short stem.
    svg.path('M' + Svg.num(x) + ' ' + Svg.num(y) + 'L' + Svg.num(x - 3) + ' ' + Svg.num(y - 8) + 'A' + r + ' ' + r + ' 0 1 1 ' + Svg.num(x + 3) + ' ' + Svg.num(y - 8) + 'Z',
      { fill: pal.paper, stroke: pal.accent, strokeWidth: 1.2 });
    const cx = x, cy = y - 12.5;
    const d = new Svg.Batch();
    const type = fantasy() ? mk.type : GLYPH[Carto.Setting.current][mk.type] || mk.type;
    const N = Svg.num, P2 = (dx, dy) => ({ x: cx + dx, y: cy + dy });
    switch (type) {
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
      // Present day and cyberpunk.
      case 'airport': d.line(P2(0, -3.8), P2(0, 3.2)); d.poly([P2(-3.8, 1), P2(0, -1.2), P2(3.8, 1)], false); d.line(P2(-1.6, 3.4), P2(1.6, 3.4)); break;
      case 'powerplant': d.poly([P2(1.2, -3.8), P2(-1.8, 0.4), P2(0.8, 0.4), P2(-1, 3.8)], false); break;
      case 'nuclear': d.circle(cx, cy, 3.4); for (const a of [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]) d.line(P2(Math.cos(a) * 0.9, Math.sin(a) * 0.9), P2(Math.cos(a) * 3.4, Math.sin(a) * 3.4)); break;
      case 'base': d.line(P2(-2.2, 3.6), P2(-2.2, -3.6)); d.poly([P2(-2.2, -3.6), P2(3, -2), P2(-2.2, -0.4)]); break;
      case 'platform': d.line(P2(-3.6, 0.4), P2(3.6, 0.4)); d.line(P2(-2.6, 0.4), P2(-2.6, 3.6)); d.line(P2(2.6, 0.4), P2(2.6, 3.6)); d.poly([P2(-1.3, 0.4), P2(0, -3.8), P2(1.3, 0.4)], false); break;
      case 'toxic': d.poly([P2(0, -3.8), P2(3.8, 3), P2(-3.8, 3)]); d.line(P2(0, -1.2), P2(0, 0.9)); d.line(P2(0, 1.9), P2(0, 2)); break;
      case 'datafort': d.poly([P2(-3, -3.4), P2(3, -3.4), P2(3, 3.4), P2(-3, 3.4)]); d.line(P2(-1.6, -1.2), P2(1.6, -1.2)); d.line(P2(-1.6, 1.2), P2(1.6, 1.2)); break;
      case 'spaceport':
        d.add('M' + N(cx) + ' ' + N(cy - 4) + 'Q' + N(cx + 2.2) + ' ' + N(cy - 1) + ' ' + N(cx + 1.4) + ' ' + N(cy + 2) + 'H' + N(cx - 1.4) + 'Q' + N(cx - 2.2) + ' ' + N(cy - 1) + ' ' + N(cx) + ' ' + N(cy - 4) + 'Z');
        d.line(P2(-1.4, 1), P2(-2.8, 3.6)); d.line(P2(1.4, 1), P2(2.8, 3.6)); break;
      case 'arcology': d.poly([P2(-3.6, 3.6), P2(-3.6, 1), P2(-2, 1), P2(-2, -1.6), P2(-0.8, -1.6), P2(-0.8, -4), P2(0.8, -4), P2(0.8, -1.6), P2(2, -1.6), P2(2, 1), P2(3.6, 1), P2(3.6, 3.6)]); break;
      case 'crashed': d.circle(cx + 1, cy + 1, 2.2); d.line(P2(-3.8, -3.8), P2(-0.8, -0.8)); d.line(P2(-1.4, -4), P2(0.2, -2)); d.line(P2(-4, -1.4), P2(-2, 0.2)); break;
    }
    svg.path(d.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 1.1, strokeLinecap: 'round', strokeLinejoin: 'round' });
  }

  // ------------------------------------------------------------------ links

  function burgLink(b, m) {
    const k = basePop(m, b);
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
    // Today's and tomorrow's mines and crash sites can be explored too.
    if (!fantasy() && mk.type === 'mine') return Carto.linkTo('dungeon', mk.seed, { theme: 'mine' });
    if (!fantasy() && mk.type === 'crashed') return Carto.linkTo('dungeon', mk.seed, {});
    return null;
  }
  // Label of the button that opens a point of interest.
  function markerOpen(mk) {
    if (fantasy()) return t(mk.type === 'dungeon' ? 'world.openDungeon' : 'world.openCave');
    return t(mk.type === 'dungeon' || mk.type === 'crashed' ? 'world.openDungeon' : mk.type === 'mine' ? 'world.openMine' : mk.type === 'grove' ? 'world.openGlade' : 'world.openCave');
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

  // ------------------------------------------------------------------ present-day relief

  // Land heights on a regular grid (a node every FCELL map units): 0 at sea
  // level, 1 on the highest possible summit. Kept per model.
  const FCELL = 4;
  const FIELD = new WeakMap();
  function heightGrid(m) {
    let g = FIELD.get(m);
    if (g) return g;
    const cols = Math.ceil(m.W / FCELL) + 1, rows = Math.ceil(m.H / FCELL) + 1;
    const { data } = Carto.Relief3D.fromPoints(m.grid.x, m.grid.y, m.h, m.grid.n, 1 / FCELL, 1 / FCELL, cols, rows, m.grid.find);
    const raw = Carto.Contour.blur(data, cols, rows, 1, 2);
    const f = Float32Array.from(raw, (v) => Math.max(0, (v - m.SEA) / (100 - m.SEA)));
    g = { f, raw, cols, rows };
    FIELD.set(m, g);
    return g;
  }
  // Relative height of an altitude in metres (world.js: elevation from h).
  const levelOf = (m, z) => (18 + 82 * Math.pow(z / 5200, 1 / 1.9) - m.SEA) / (100 - m.SEA);
  const FOREST = ['temperateDeciduous', 'tropicalSeasonal', 'tropicalRainforest', 'temperateRainforest', 'taiga'];

  /* Present day: hillshade lit from the north-west, contour lines and flat
     woods instead of the drawn mountains and trees. Cyberpunk: glowing
     isolines and hatched toxic land. Drawn inside the land clip. */
  function presentRelief(svg, m, o, pal, view) {
    const T = Carto.Terrain, cyber = Carto.Setting.current === 'cyber';
    const dark = T.luma(pal.paper) < 0.5;
    const { f, cols, rows } = heightGrid(m);
    const grid = m.grid;
    if (view !== 'biomes' && view !== 'heightmap') {
      const wood = new Set(FOREST.map((id) => World.BIOMES.findIndex((b) => b.id === id)));
      const isWood = (i) => !m.isWater(i) && wood.has(m.biome[i]);
      const loops = regionLoops(grid, (i) => (isWood(i) ? 1 : 0), (v) => v === 1).get(1) || [];
      const b = new Svg.Batch();
      for (const l of loops) b.smooth(G.chaikin(loopPts(grid, l), 1, true), true);
      if (cyber) {
        // Dead forests and swamps: toxic land, hatched.
        const tox = dark ? '#b6f23a' : pal.greenInk;
        const wet = World.BIOMES.findIndex((q) => q.id === 'wetland');
        const sw = regionLoops(grid, (i) => (!m.isWater(i) && m.biome[i] === wet ? 1 : 0), (v) => v === 1).get(1) || [];
        const sb = new Svg.Batch();
        for (const l of sw) sb.smooth(G.chaikin(loopPts(grid, l), 1, true), true);
        svg.path(b.toString(), { fill: tox, opacity: 0.06, fillRule: 'evenodd' });
        svg.path(sb.toString(), { fill: T.hatchPattern(svg, tox, 4, 0.7, 45), opacity: 0.55, fillRule: 'evenodd' });
        svg.path(sb.toString(), { fill: 'none', stroke: tox, strokeWidth: 0.6, strokeDasharray: '3 2', opacity: 0.6 });
      } else svg.path(b.toString(), { fill: dark ? pal.green : T.mix(pal.tree, '#6f9f55', 0.3), opacity: dark ? 0.45 : 0.35, fillRule: 'evenodd' });
    }
    T.hillshade(svg, f, cols, rows, FCELL, 0, 0, cyber ? { z: 80, dark: '#000000', opacity: dark ? 0.16 : 0.07, blur: 1.6 } :
      { z: 80, dark: dark ? '#000000' : '#3d3a52', light: dark ? null : '#ffffff', opacity: dark ? 0.16 : view === 'heightmap' ? 0.14 : 0.09, blur: 1.6 });
    const levels = cyber ? [250, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500] : [200, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500];
    const lines = T.contours(f, cols, rows, FCELL, 0, 0, levels.map((z) => levelOf(m, z)));
    if (cyber) {
      const high = lines.filter((l) => l.level > 0.4).map((l) => l.d).join('');
      svg.path(high, { fill: 'none', stroke: pal.ink, strokeWidth: 2, opacity: 0.3, filter: T.glowFilter(svg, 1.5) });
      lines.forEach((l, k) => svg.path(l.d, { fill: 'none', stroke: pal.ink, strokeWidth: levels[k] % 1000 ? 0.45 : 0.8, opacity: Math.min(1, 0.12 + 0.95 * Math.pow(k / (levels.length - 1), 1.2)) }));
    } else {
      const ink = dark ? pal.inkSoft : '#9a7a58';
      svg.path(lines.filter((_, k) => levels[k] % 1000).map((l) => l.d).join(''), { fill: 'none', stroke: ink, strokeWidth: 0.4, opacity: 0.5 });
      svg.path(lines.filter((_, k) => !(levels[k] % 1000)).map((l) => l.d).join(''), { fill: 'none', stroke: ink, strokeWidth: 0.75, opacity: 0.65 });
    }
  }

  // Built-up areas of the capitals and big cities, and the cyberpunk dead
  // zones around toxic sites, crash sites and war zones.
  function presentZones(svg, m, o, pal) {
    const T = Carto.Terrain, cyber = Carto.Setting.current === 'cyber';
    if (cyber && o.markers !== false && !o.preview) {
      const zb = new Svg.Batch();
      for (const mk of m.markers) if (mk.type === 'springs' || mk.type === 'crashed' || mk.type === 'battlefield') zb.smooth(Draw.blob(new Carto.Random(mk.seed + ':zone'), mk.x, mk.y, 18, 10, 0.35), true);
      const d = zb.toString();
      svg.path(d, { fill: pal.accent, opacity: 0.1 });
      svg.path(d, { fill: T.hatchPattern(svg, pal.accent, 4, 0.8, -45), opacity: 0.5 });
      svg.path(d, { fill: 'none', stroke: pal.accent, strokeWidth: 0.7, strokeDasharray: '3 2', opacity: 0.8 });
    }
    if (o.burgs === false) return;
    const big = new Svg.Batch();
    for (const b of m.burgs) {
      if (!b) continue;
      const k = basePop(m, b);
      if (!b.capital && k < 10) continue;
      T.urbanBlob(big, new Carto.Random(b.seed + ':urban'), b.x, b.y, Math.min(13, 2.5 + Math.sqrt(k) * (cyber ? 1.15 : 0.95)));
    }
    const d = big.toString();
    if (cyber) {
      svg.path(d, { fill: pal.accent, opacity: 0.6, filter: T.glowFilter(svg, 2.5) });
      svg.path(d, { fill: T.mix(pal.paper, pal.accent, 0.4), stroke: pal.accent, strokeWidth: 0.6 });
    } else {
      const dark = T.luma(pal.paper) < 0.5;
      const fill = dark ? T.mix(pal.paper, pal.building, 0.8) : T.mix(pal.building, '#e9dcc4', 0.35);
      svg.path(d, { fill, stroke: T.mix(fill, pal.ink, 0.35), strokeWidth: 0.5, opacity: 0.95 });
    }
  }

  // Road-atlas town symbols: a square for capitals, rings and dots for the
  // rest; neon diamonds and nodes in the cyberpunk future.
  function presentBurgs(svg, m, o, pal, taken) {
    const cyber = Carto.Setting.current === 'cyber';
    const caps = new Svg.Batch(), big = new Svg.Batch(), small = new Svg.Batch(), dots = new Svg.Batch();
    const s = o.preview ? 1.3 : 1;
    for (const b of m.burgs) {
      if (!b) continue;
      if (b.capital) {
        if (cyber) caps.poly(G.rect(b.x, b.y, 5.6 * s, 5.6 * s, Math.PI / 4));
        else caps.poly(G.rect(b.x, b.y, 6 * s, 6 * s, 0));
        dots.poly(G.rect(b.x, b.y, 2 * s, 2 * s, cyber ? Math.PI / 4 : 0));
      } else if (basePop(m, b) > 10) { big.circle(b.x, b.y, 2.5 * s); dots.circle(b.x, b.y, 0.9 * s); }
      else small.circle(b.x, b.y, 1.5 * s);
      taken.push({ x0: b.x - 4, x1: b.x + 4, y0: b.y - 4, y1: b.y + 4 });
    }
    if (cyber) {
      svg.path(caps.toString(), { fill: pal.accent, opacity: 0.7, filter: Carto.Terrain.glowFilter(svg, 2) });
      svg.path(caps.toString(), { fill: pal.paper, stroke: pal.accent, strokeWidth: 1.1 });
      svg.path(big.toString() + small.toString(), { fill: pal.paper, stroke: pal.ink, strokeWidth: 0.8 });
      svg.path(dots.toString(), { fill: pal.accent });
    } else {
      svg.path(small.toString(), { fill: pal.ink });
      svg.path(caps.toString() + big.toString(), { fill: pal.paper, stroke: pal.ink, strokeWidth: 1 });
      svg.path(dots.toString(), { fill: pal.ink });
    }
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
    const fillOpacity = o.paletteId === 'ink' ? 0.3 : o.paletteId === 'night' || o.paletteId === 'blueprint' ? 0.38 : o.paletteId === 'neon' ? 0.3 : 0.46;

    // Ocean depth in the relief view, ripples along the shore otherwise.
    if (view === 'heightmap' && !fantasy() && !o.bare) {
      // Present day and cyberpunk: smooth depth tints.
      const { raw, cols, rows } = heightGrid(m);
      const deep = Carto.Setting.current === 'cyber' ? pal.water : ramp(2);
      svg.rect(0, 0, W, H, { fill: deep });
      [6, 10, 14, 17.5].forEach((lv, k) => svg.path(Carto.Terrain.smoothRings(Carto.Contour.trace(raw, cols, rows, lv, FCELL, 0, 0)),
        { fill: Carto.Terrain.mix(deep, Carto.Setting.current === 'cyber' ? pal.ink : ramp(19), (k + 1) * (Carto.Setting.current === 'cyber' ? 0.01 : 0.2)), fillRule: 'evenodd' }));
    } else if (view === 'heightmap') {
      const depth = regionLoops(grid, (i) => (m.h[i] < 20 && !m.lake[i] ? Math.min(3, Math.floor(m.h[i] / 5)) : -1), (v) => v >= 0);
      for (const [v, loops] of depth) {
        const b = new Svg.Batch();
        for (const l of loops) b.poly(loopPts(grid, l));
        svg.path(b.toString(), { fill: ramp(v * 5 + 2), stroke: ramp(v * 5 + 2), strokeWidth: 0.6 });
      }
    }
    const landLoops = regionLoops(grid, (i) => (water(i) && !m.lake[i] ? 0 : 1), (v) => v === 1).get(1) || [];
    const landD = (() => { const b = new Svg.Batch(); for (const l of landLoops) b.smooth(G.chaikin(loopPts(grid, l), 1, true), true); return b.toString(); })();
    if (view !== 'heightmap' && !fantasy() && Carto.Setting.current === 'modern' && !o.bare) {
      // Present day: the sea pales towards the shore.
      const T = Carto.Terrain;
      svg.rect(0, 0, W, H, { fill: T.mix(pal.water, pal.waterInk, 0.22) });
      for (const [k, s] of [[3, 0.14], [2, 0.08], [1, 0.03]]) {
        const loops = regionLoops(grid, (i) => (!water(i) || (m.coast[i] < 0 && m.coast[i] >= -k) ? 1 : 0), (v) => v === 1).get(1) || [];
        const b = new Svg.Batch();
        for (const l of loops) b.smooth(G.chaikin(loopPts(grid, l), 1, true), true);
        svg.path(b.toString(), { fill: T.mix(pal.water, pal.waterInk, s), fillRule: 'evenodd' });
      }
    } else if (view !== 'heightmap') {
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
    else if (view === 'heightmap' && (fantasy() || o.bare)) fillRegions((i) => (water(i) ? 0 : 1 + Math.min(15, Math.floor((m.h[i] - 20) / 5))), (v) => ramp(20 + (v - 1) * 5 + 2.5), 1);
    if (!fantasy() && !o.bare) {
      // Present day and cyberpunk: smooth hypsometric tints, shaded relief.
      if (view === 'heightmap') {
        const { f, cols, rows } = heightGrid(m);
        Carto.Terrain.tints(svg, f, cols, rows, FCELL, 0, 0, Carto.Terrain.hypso(pal, Carto.Setting.current), 16);
      }
      if (o.relief !== false) presentRelief(svg, m, o, pal, view);
      presentZones(svg, m, o, pal);
    }
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
        if (fantasy() || o.bare) svg.path(pb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.6, strokeDasharray: '2 2', opacity: 0.55 });
        else if (Carto.Setting.current === 'modern') svg.path(pb.toString(), { fill: 'none', stroke: pal.inkSoft, strokeWidth: 0.5, strokeDasharray: '3 2', opacity: 0.9 });
        else svg.path(pb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.5, strokeDasharray: '1 2.5', opacity: 0.6, strokeLinecap: 'round' });
      }
      const chains = borderChains(grid, (i) => m.state[i], (a, b, i, j) => !water(i) && !water(j));
      const sb = new Svg.Batch();
      for (const ch of chains) sb.poly(G.chaikin(loopPts(grid, ch), 1, false), false);
      if (fantasy() || o.bare) {
        svg.path(sb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 2.6, opacity: 0.18, strokeLinejoin: 'round' });
        svg.path(sb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 1, strokeDasharray: '5 2 1 2', opacity: 0.8, strokeLinejoin: 'round' });
      } else if (Carto.Setting.current === 'modern') {
        // International borders: a solid grey line on a pale band.
        svg.path(sb.toString(), { fill: 'none', stroke: pal.paper, strokeWidth: 3.4, opacity: 0.55, strokeLinejoin: 'round' });
        svg.path(sb.toString(), { fill: 'none', stroke: Carto.Terrain.mix(pal.inkSoft, pal.ink, 0.35), strokeWidth: 1.2, strokeLinejoin: 'round' });
      } else {
        // Corporate frontiers: bright dashes over a glow.
        svg.path(sb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 3.5, opacity: 0.35, strokeLinejoin: 'round', filter: Carto.Terrain.glowFilter(svg, 2) });
        svg.path(sb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 1.1, strokeDasharray: '6 3', strokeLinejoin: 'round' });
      }
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
      if (fantasy()) {
        svg.path(road.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 1, opacity: 0.75, strokeLinecap: 'round' });
        svg.path(trail.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 0.7, strokeDasharray: '2 2', opacity: 0.7 });
      } else if (Carto.Setting.current === 'modern') {
        // Paved roads, and motorways with their casing.
        svg.path(trail.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 0.6, opacity: 0.6, strokeLinecap: 'round' });
        svg.path(road.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 2.2, opacity: 0.85, strokeLinecap: 'round', strokeLinejoin: 'round' });
        svg.path(road.toString(), { fill: 'none', stroke: pal.road, strokeWidth: 0.8, strokeLinecap: 'round', strokeLinejoin: 'round' });
      } else {
        // Service roads, and maglev highways with a glow.
        svg.path(trail.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.6, strokeDasharray: '4 1.5', opacity: 0.55 });
        svg.path(road.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 3, opacity: 0.22, strokeLinecap: 'round', strokeLinejoin: 'round' });
        svg.path(road.toString(), { fill: 'none', stroke: pal.accent, strokeWidth: 1, opacity: 0.95, strokeLinecap: 'round', strokeLinejoin: 'round' });
      }
    }

    // Relief icons, back to front.
    if (o.relief !== false && view !== 'heightmap' && (fantasy() || o.bare)) {
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

    // Cyberpunk: a faint hexagonal overlay on the whole sheet.
    if (!fantasy() && !o.bare && Carto.Setting.current === 'cyber') svg.path(Carto.Terrain.hexGrid(W, H, 20), { fill: 'none', stroke: pal.ink, strokeWidth: 0.5, opacity: 0.08 });

    // Graticule.
    if (o.grid) {
      const gb = new Svg.Batch();
      const latToY = (la) => ((m.lats[0] - la) / (m.lats[0] - m.lats[1])) * H;
      const lonToX = (lo) => ((lo - m.lons[0]) / (m.lons[1] - m.lons[0])) * W;
      for (let la = Math.ceil(m.lats[1] / 10) * 10; la <= m.lats[0]; la += 10) gb.line({ x: 0, y: latToY(la) }, { x: W, y: latToY(la) });
      for (let lo = Math.ceil(m.lons[0] / 10) * 10; lo <= m.lons[1]; lo += 10) gb.line({ x: lonToX(lo), y: 0 }, { x: lonToX(lo), y: H });
      if (fantasy() || o.bare) svg.path(gb.toString(), { fill: 'none', stroke: pal.ink, strokeWidth: 0.5, strokeDasharray: '1 4', opacity: 0.6 });
      else svg.path(gb.toString(), { fill: 'none', stroke: Carto.Setting.current === 'cyber' ? pal.ink : pal.waterInk, strokeWidth: 0.5, opacity: Carto.Setting.current === 'cyber' ? 0.3 : 0.6 });
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
    const showLabels = o.labels !== false && !o.bare;
    if (showLabels && !o.preview) {
      const groupLabel = (cell, text, size) => {
        if (cell < 0 || cell === undefined) return;
        let x = grid.x[cell];
        // The modern letterings run wider: keep them inside the frame.
        if (!fantasy()) { const hw = (text.length * size * 0.87) / 2; x = Math.max(16 + hw, Math.min(W - 16 - hw, x)); }
        Draw.label(svg, x, grid.y[cell], text.toUpperCase(), size, pal, { title: true, spacing: size * 0.25, opacity: 0.7, haloWidth: 0.12 });
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
    if (o.burgs !== false && !fantasy() && !o.bare) presentBurgs(svg, m, o, pal, taken);
    else if (o.burgs !== false) {
      const towns = new Svg.Batch(), caps = new Svg.Batch(), dots = new Svg.Batch();
      for (const b of m.burgs) {
        if (!b) continue;
        if (b.capital) { caps.circle(b.x, b.y, o.preview ? 4.5 : 3.6); dots.circle(b.x, b.y, 1.3); }
        else towns.circle(b.x, b.y, basePop(m, b) > 10 ? 2.1 : 1.6);
        taken.push({ x0: b.x - 4, x1: b.x + 4, y0: b.y - 4, y1: b.y + 4 });
      }
      svg.path(towns.toString(), { fill: pal.paper, stroke: pal.ink, strokeWidth: 0.8 });
      svg.path(caps.toString(), { fill: pal.paper, stroke: pal.ink, strokeWidth: 1.1 });
      svg.path(dots.toString(), { fill: pal.ink });
    }
    if (o.burgs !== false) {
      if (showLabels && !o.preview) {
        const labels = m.burgs.filter((b) => b).sort((a, b) => b.capital - a.capital || !!b.added - !!a.added || b.population - a.population).map((b) => ({
          x: b.x, y: b.y, text: b.name, size: b.capital ? 11.5 : basePop(m, b) > 10 ? 9 : 7.5, title: b.capital,
          offsets: [[1, 0], [-1, 0], [0, -1.5], [0, 1.5]], gap: b.capital ? 7.5 : 5.5,
        }));
        Draw.placeLabels(svg, labels, pal, taken, { x0: 8, y0: 8, x1: W - 8, y1: H - 8 });
      }
    }

    // Points of interest.
    if (o.markers !== false && !o.preview) for (const mk of m.markers) markerGlyph(svg, mk, pal);

    // Sheet furniture.
    if (o.bare) {
      // Texture for the 3D export: no lettering or frame.
    } else if (!o.preview) {
      const title = m.name;
      const sub = t('world.sub.' + view);
      let tw = Draw.textBox(0, 0, title, 30, { title: true }).x1 * 2;
      // Sans-serif and monospace subtitles run wider than the engraved face.
      if (!fantasy()) tw = Math.max(tw, sub.length * 12 * 0.62);
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

  const TELL_FORM = ['constmonarchy', 'corporation', 'conglomerate', 'protectorate'];

  function notes(m) {
    const totalPop = m.states.reduce((s, x) => s + (x && x.id ? x.pop : 0), 0);
    let h = '<h3>' + esc(m.name) + '</h3><p class="tag">' + esc(t('world.hint')) + '</p>';
    h += '<dl><dt>' + esc(t('world.states')) + '</dt><dd>' + (m.states.length - 1) + '</dd><dt>' + esc(t('world.population')) + '</dt><dd>' + popText(totalPop) + '</dd></dl>';
    const states = m.states.filter((s) => s && s.id).sort((a, b) => b.pop - a.pop);
    h += '<details open><summary>' + esc(t('world.states')) + '</summary><ul class="legend">';
    for (const s of states) {
      const cap = m.burgs[s.capital];
      // Some titles do not tell the form ("Regno di…" is a constitutional monarchy).
      const form = !fantasy() && TELL_FORM.includes(s.form) ? esc(t('ftype.' + s.form)) + ' · ' : '';
      h += '<li>' + swatch(s.color) + '<span><strong>' + esc(stateName(s)) + '</strong><br><span class="tag">' + form + esc(t('world.capital')) + ': <a href="' + esc(burgLink(cap, m)) + '">' + esc(cap.name) + '</a> · ' +
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
      const people = fantasy() ? fmt(b.population * 1000) : popText(b.population * 1000);
      h += '<li><a href="' + esc(burgLink(b, m)) + '">' + esc(b.name) + '</a> <span class="tag">' + esc(t('world.inhabitants', { n: people })) + '</span></li>';
    }
    h += '</ol></details>';
    if (!fantasy() && m.routes.length) {
      // Transport network: length of each kind of route.
      const len = { road: 0, trail: 0, sea: 0 };
      for (const r of m.routes) for (let i = 1; i < r.cells.length; i++) len[r.type] += Math.hypot(m.grid.x[r.cells[i]] - m.grid.x[r.cells[i - 1]], m.grid.y[r.cells[i]] - m.grid.y[r.cells[i - 1]]) * m.KM;
      h += '<details><summary>' + esc(t('world.routes')) + '</summary><ul>';
      for (const k of ['road', 'trail', 'sea']) if (len[k]) h += '<li>' + esc(t('route.' + k)) + ' <span class="tag">' + fmt(len[k]) + ' km</span></li>';
      h += '</ul></details>';
    }
    h += '<details><summary>' + esc(t('world.markers')) + '</summary><ul>';
    for (const mk of m.markers) {
      const link = markerLink(mk);
      const text = markerNote(mk);
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
        html: '<h3>' + esc(t('marker.' + mk.type)) + '</h3><p>' + esc(markerNote(mk)) + '</p>' + (link ? '<p><a class="btn primary" href="' + esc(link) + '">' + esc(markerOpen(mk)) + '</a></p>' : ''),
        mark: { x: mk.x, y: mk.y - 12, r: 9 },
      };
    }
    const b = m.burgs.filter((q) => q && near(q, q.capital ? 9 : 7)).sort((p, q) => Math.hypot(p.x - x, p.y - y) - Math.hypot(q.x - x, q.y - y))[0];
    if (b) {
      const s = m.states[b.state || 0];
      const big = basePop(m, b) >= 6;
      const kind = b.capital ? t('world.capital') : big ? t('world.town') : t('world.village');
      return {
        html: '<h3>' + esc(b.name) + '</h3><p class="tag">' + esc(kind) + (b.port ? ' · ' + esc(t('world.port')) : '') + '</p><dl>' +
          '<dt>' + esc(t('world.population')) + '</dt><dd>' + fmt(b.population * 1000) + '</dd>' +
          '<dt>' + esc(t('world.state')) + '</dt><dd>' + esc(s && s.id ? stateName(s) : t('world.free')) + '</dd>' +
          (b.province ? '<dt>' + esc(t('world.province')) + '</dt><dd>' + esc(provName(m, m.provinces[b.province])) + '</dd>' : '') +
          '<dt>' + esc(t('world.culture')) + '</dt><dd>' + esc((m.cultures[b.culture] || { name: '–' }).name) + '</dd>' +
          (b.religion ? '<dt>' + esc(t('world.religion')) + '</dt><dd>' + esc(relName(m, m.religions[b.religion])) + '</dd>' : '') +
          '</dl><p><a class="btn primary" href="' + esc(burgLink(b, m)) + '">' + esc(t(big ? 'world.openCity' : 'world.openVillage')) + '</a></p>',
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

  // ------------------------------------------------------------------ 3D export

  // Heights for the 3D export: cell heights interpolated across the sheet,
  // softened, given fine detail on land, and clamped so the coastline falls
  // on the same cell edges as the drawn map.
  function heightfield(m) {
    const cols = 2048, rows = 1280, grid = m.grid, SEA = m.SEA;
    const sx = cols / m.W, sy = rows / m.H;
    const R = Carto.Relief3D;
    const { data, near } = R.fromPoints(grid.x, grid.y, m.h, grid.n, sx, sy, cols, rows, grid.find);
    R.blur(data, cols, rows, 3, 3);
    const ocean = new Uint8Array(data.length);
    for (let p = 0; p < data.length; p++) ocean[p] = m.isWater(near[p]) && !m.lake[near[p]] ? 1 : 0;
    // Land rises gently from the shore instead of ending in a cliff.
    const shore = Carto.Contour.distanceField(ocean, cols, rows);
    const noise = new Carto.Noise(m.seed + ':relief3d');
    const eps = 0.25;
    let top = 100;
    for (let p = 0; p < data.length; p++) {
      let v = data[p];
      if (ocean[p]) v = Math.min(v, SEA - eps);
      else {
        const k = Math.min(1, shore[p] / 16), ramp = k * k * (3 - 2 * k);
        v = SEA + eps + Math.max(0, v - SEA) * ramp;
        if (!m.lake[near[p]]) {
          const x = (p % cols) / sx, y = Math.floor(p / cols) / sy;
          v = Math.max(SEA + eps, v + noise.fbm(x / 9, y / 9, 4, 2.1, 0.5) * (0.3 + (v - SEA) * 0.05) * ramp);
        }
      }
      data[p] = v;
      if (v > top) top = v;
    }
    for (let p = 0; p < data.length; p++) data[p] = Math.max(0, data[p]) / top;
    return { cols, rows, data, sea: SEA / top, width: m.W, height: m.H, scale: 1.4, water: '#3f6f8a' };
  }

  Carto.WorldText = { stateName, provName, relName, markerNote, burgLink, markerLink, regionLoops };

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
      { id: 'grid', type: 'bool', group: 'view', def: false, defs: { modern: true, cyber: true }, renderOnly: true },
    ],
    previewOptions: { cells: 'low' },
    generate: World.generate,
    render,
    notes,
    inspect,
    fileName: (m) => m.name,
    heightfield,
    texture3d: { view: 'biomes', relief: false, borders: false, roads: false, burgs: false, markers: false, labels: false, grid: false },
  });
})(window.Carto = window.Carto || {});
