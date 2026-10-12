/* Name bases: small corpora of invented words, one per phonetic style, so that
   every culture of a world names its places in a recognisable "language". */
(function (Carto) {
  'use strict';

  const BASES = {
    romance: 'Valmora Belvenza Montarra Serravella Castellan Rocciano Fiorenzo Ambrosa Lucedda Valdarno Pietralba Sorvegna Calvario Terrazzo Bellona Marrena Orvallo Santerra Vescogna Ruvenna Campoleo Trevanni Altamira Selvana Corviano Borgaletto Fontara Lombrenza Ascaro Miravalle Palestra Rivolta Grifaldo Ostellina Tarcento Velloria Cardenza Spinazzo Orbetta Valcastro',
    germanic: 'Halbrecht Dornburg Kaltenfeld Rabensteg Eisenwald Holzheim Wendrich Grauburg Sturmfels Brachendorf Lindenhag Ottersee Falkenruh Mittelgard Rotenbach Schwarzach Ulmenrode Bergstadt Kesselfurt Adlerhorst Tannweil Hagenrath Wolfsried Steinhal Morgenau Brunnwick Lautenberg Herzfeld Wiesenbruck Eichengrund Dornholz Talheim Fichtenau Grimmstein Kronach Wasserlind',
    celtic: 'Glenmoragh Dunlaoch Bryncaer Ardvellin Kilcairn Tirnamor Carrowen Balvenny Lochcraig Aberdwyn Penrhos Cairnbeth Dromanagh Inverloch Rathmore Llanfair Dunmorrow Kinvara Morvhenn Ballyroan Tregarth Corran Glasbury Ennisval Caerlonn Strathaird Bannoch Talgarth Kilmory Duncreag Ardmhor Brennach Lismoyle',
    slavic: 'Volgorod Zelenka Brodnitsa Kraslav Moravets Dubrovka Sokolin Bielograd Velimir Chernavka Radoslav Lipovets Zvenigrad Borovsk Mstislav Ozernik Tvardosk Kamenitsa Gorislav Polyanka Vyshgorod Strelna Medvedin Rostova Svetlin Dobrovets Kozelsk Yaroslavka Pribor Zlatogor Vodnitsa Kurgan Belozersk',
    desert: 'Qasrah Almadin Sahrabad Zafirah Kharim Tamarzan Bayrut Nahrawan Samarqal Jazirah Dahrun Maktabar Ishfahan Ruqaya Kalimar Suhail Zahrani Harazad Mashrak Alqamar Tabarza Nizamar Qalibah Rashidun Sulamir Hajjaran Wadi Farazdun Kumarah Shirazan Iblarad Ma\'arab Saffiyah',
    hellenic: 'Thessalor Andrakos Mylonis Astrapos Kerameia Delphinor Pyrgossa Orestia Kallimos Theronia Lykandros Sparnion Halkyra Nikopolis Eurydos Zakynthe Mesogaia Argilos Palaiokos Thalassa Myrtilos Chrysos Akropia Ephyra Lamprion Korvinos Stavrinia Ithomene Kerkyros Peirassa Amphion',
    norse: 'Skarvik Hrafnheim Jorvald Ulfstad Tormund Brekkur Sigvaldr Haugarnes Kolfjord Ravnsby Eiriksgard Frostvik Hjalmar Skogarby Thrandheim Ormsvik Bjarnholt Grimsey Vargheim Aslund Dalsfjord Hrolfsby Svartaas Ingvarstad Kaldbak Hvitanes Gunnarsvik Ylvholm Torvik Steinvaag Halvarsund',
    eastern: 'Kaiyuan Shirokan Tenzhou Haruma Ryoshin Kanzai Mingtao Hoshiro Lianzhu Sakurei Taikun Yunhai Kagemori Shuhai Tenrai Jinwu Akizane Fenglin Nakamura Hokuzan Wuyang Seiryo Kumoshi Baizhou Hanaki Tsuruga Longhai Yoshimae Qingshan Mizuhara',
    elvish: 'Elarion Sylvanor Ithirel Aelindor Lothiriel Caladwen Faerimel Nimrodel Galathil Eruvanna Thalion Celebrin Ilmarethe Aranwe Melianor Oronthiel Lindorae Seraphel Valandil Yavaneth Amarthiel Elendrae Taurion Nimiriel Calenor Ithilwe Rhovanel Aelthas Ennoriel Silmaren',
  };

  const chains = {};

  Carto.NameBases = {
    ids: Object.keys(BASES),
    // A fresh proper name in the given style.
    name(base, rng, min = 4, max = 11) {
      if (!chains[base]) chains[base] = Carto.Names.markov((BASES[base] || BASES.romance).split(' '));
      return chains[base].generate(rng, min, max);
    },
  };
})(window.Carto = window.Carto || {});
