/* Settings: every map can be medieval fantasy, present day (2026) or
   cyberpunk. The setting is a regular option of each generator; while a
   generator works, Carto.Setting.current holds it so that names, texts
   (keys suffixed "@modern" / "@cyber") and links follow it. */
(function (Carto) {
  'use strict';

  const IDS = ['fantasy', 'modern', 'cyber'];
  let current = 'fantasy';

  // Lettering per setting; fantasy keeps the engraved IM Fell faces.
  const FONTS = {
    modern: { fontTitle: "'Avenir Next', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", fontLabel: "'Avenir Next', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", titleCase: 'upper' },
    cyber: { fontTitle: "'Eurostile', 'Bank Gothic', 'Arial Narrow', 'Roboto Condensed', sans-serif", fontLabel: "'JetBrains Mono', 'Consolas', 'Menlo', 'Courier New', monospace", titleCase: 'upper' },
  };
  const PALETTE = { fantasy: 'parchment', modern: 'modern', cyber: 'neon' };

  const Setting = {
    IDS,
    get current() { return current; },
    use(s) { current = IDS.includes(s) ? s : 'fantasy'; return current; },
    // The option every generator gets, first in its panel.
    option: () => ({ id: 'setting', type: 'select', values: IDS.slice(), def: 'fantasy' }),
    defaultPalette: (s) => PALETTE[s] || 'parchment',
    // Palette with the setting's lettering.
    style(pal, s) { return FONTS[s] ? Object.assign({}, pal, FONTS[s]) : pal; },
    // Pick by setting from { fantasy, modern, cyber } (fantasy is the fallback).
    pick(table) { return table[current] !== undefined ? table[current] : table.fantasy; },
    is: (s) => current === s,
  };

  // ------------------------------------------------------------------ names

  const CORPUS = {
    modernPlace: (
      'Ashford Bramley Carlton Dunmore Fairview Glenwood Harlow Kingsbury Linton Milford Newport Oakridge ' +
      'Preston Redfield Stanton Westbrook Ashby Brookfield Clifton Dalton Easton Fulton Greenville Hampton ' +
      'Kensington Lakewood Marlow Northgate Oakhurst Pinewood Riverton Sheffield Thornbury Waverly Weston ' +
      'Albarella Borgonuovo Castelverde Fontanella Montebello Pietrasanta Roccaforte Sanmartino Torrenova ' +
      'Valbruna Bellaria Campolongo Fiumara Lungomare Marinella Portofino Rivabella Sottomonte Villanova ' +
      'Beaumont Montclair Bellevue Valmont Lacombe Fontaine Marbella Alameda Solana Vistamar Halden Lindberg'
    ).split(' '),
    modernFirst: (
      'Marco Giulia Luca Sara Andrea Chiara Matteo Elena Davide Francesca Alessandro Martina Paolo Laura ' +
      'James Emma Daniel Olivia Michael Sophie Thomas Hannah David Grace Lucas Mia Noah Chloe Ethan Zoe ' +
      'Nadia Omar Leila Ivan Mei Kenji Aisha Carlos Ines Tobias Freya Mateo Sofia Yusuf Anya'
    ).split(' '),
    modernLast: (
      'Rossi Bianchi Romano Colombo Ricci Marino Greco Bruno Gallo Conti Esposito Ferrari Moretti Fontana ' +
      'Smith Johnson Carter Walker Hughes Bennett Foster Hayes Mitchell Parker Reed Sullivan Turner Ward ' +
      'Novak Kowalski Lindqvist Moreau Dubois Navarro Ortega Tanaka Sato Kim Haddad Petrov Weber Jansen'
    ).split(' '),
    cyberPlace: (
      'Kowloon Shinjuku Akihabara Nakano Haneda Kabuki Shibuya Ginza Daikan Zhongshan Xinyi Mongkok ' +
      'Tessaro Vantablack Helix Arkady Nimbus Zenith Obsidian Cobalt Ferrovia Halcyon Nexus Quanta ' +
      'Chrome Static Neon Carbon Vector Cipher Kairo Lagos Sprawl Ozone Rust Echo Prism Hydra Kuro Shiro'
    ).split(' '),
    cyberFirst: (
      'Kira Rei Jax Nova Vex Juno Kai Zed Lux Mika Rook Sable Taro Yuki Dex Echo Ivo Nyx Oz Pax Quinn ' +
      'Raven Sol Tess Uma Vito Wren Xan Yara Zia Marek Lena Haru Asha Bo Cass'
    ).split(' '),
    cyberLast: (
      'Sato Okada Kurogane Takeda Chen Wong Lin Novak Volkov Reyes Mbeki Okafor Vance Kade Strand ' +
      'Moreau Ishikawa Park Ruiz Arkwright Hale Voss Krieger Tanaka Wei Zhou Silva Ferro Nakamura'
    ).split(' '),
    corp: (
      'Hoshiko Veltrane Omnivex Kessler Daikon Sarissa Novacorp Halvorsen Takamura Brightline Ostrava ' +
      'Meridian Quorvex Ironbridge Solenne Kuraishi Vantor Helion Graymark Tessaract Zhenlong Auralis'
    ).split(' '),
  };

  const chains = {};
  const ORDER = { modernPlace: 3 };
  const chain = (k) => chains[k] || (chains[k] = Carto.Names.markov(CORPUS[k], ORDER[k] || 2));
  const fantasyPlace = Carto.Names.place, fantasyPerson = Carto.Names.person;

  // Prefixes only: suffixes like "City" or "Sprawl" would clash with the
  // settlement types the generators add ("Capoluogo", "Arcologia").
  function modernPlace(rng) {
    const base = chain('modernPlace').generate(rng, 5, 10);
    const it = Carto.I18n.lang === 'it';
    const forms = it
      ? [[base, 6], ['San ' + base, 1], ['Porto ' + base, 1], ['Monte ' + base, 0.6], [base + ' Marina', 0.5], ['Villa ' + base, 0.5]]
      : [[base, 6], ['Port ' + base, 1], ['New ' + base, 1], ['Fort ' + base, 0.8], ['Mount ' + base, 0.5], ['Lake ' + base, 0.5]];
    return rng.weighted(forms);
  }
  function cyberPlace(rng) {
    const base = chain('cyberPlace').generate(rng, 4, 9);
    const it = Carto.I18n.lang === 'it';
    return rng.weighted([
      [base, 4], ['Neo-' + base, 2], [base + '-' + rng.int(2, 99), 1.5], ['Nova ' + base, 1],
      [base + ' Prime', 0.8], ['Kuro-' + base, 0.8], [base + ' Zero', 0.6], [rng.pick(it ? ['Settore', 'Zona', 'Blocco'] : ['Sector', 'Zone', 'Block']) + ' ' + rng.int(1, 40), 0.4],
    ]);
  }
  const fullName = (rng, a, b) => rng.pick(CORPUS[a]) + ' ' + rng.pick(CORPUS[b]);

  Carto.Names.place = (rng) => (current === 'modern' ? modernPlace(rng) : current === 'cyber' ? cyberPlace(rng) : fantasyPlace(rng));
  Carto.Names.person = (rng) => (current === 'modern' ? fullName(rng, 'modernFirst', 'modernLast')
    : current === 'cyber' ? (rng.bool(0.35) ? rng.pick(CORPUS.cyberFirst) + ' “' + rng.pick(['Ghost', 'Static', 'Razor', 'Chrome', 'Zero', 'Glitch', 'Wire', 'Patch', 'Byte', 'Spider']) + '”' : fullName(rng, 'cyberFirst', 'cyberLast'))
      : fantasyPerson(rng));
  // Corporations (cyberpunk), companies (present day).
  Carto.Names.corp = (rng) => {
    const base = rng.bool(0.5) ? rng.pick(CORPUS.corp) : chain('corp').generate(rng, 4, 9);
    return base + ' ' + rng.pick(current === 'cyber' ? ['Corp', 'Dynamics', 'Industries', 'Biotech', 'Systems', 'Holdings', 'Kaisha', 'Group'] : ['S.p.A.', 'Group', 'Holding', 'Industries', 'Energy', 'Logistics']);
  };
  Carto.Names.firm = Carto.Names.corp;

  // ------------------------------------------------------------------ texts

  // t('key') looks for 'key@modern' / 'key@cyber' first.
  const baseT = Carto.I18n.t, baseHas = Carto.I18n.has;
  Carto.I18n.t = function (key, params) {
    if (current !== 'fantasy' && baseHas(key + '@' + current)) return baseT(key + '@' + current, params);
    return baseT(key, params);
  };
  Carto.t = Carto.I18n.t;

  Carto.I18n.add({
    it: {
      'opt.setting': 'Ambientazione',
      'opt.setting.fantasy': 'Fantasy',
      'opt.setting.modern': '2026',
      'opt.setting.cyber': 'Cyberpunk',
    },
    en: {
      'opt.setting': 'Setting',
      'opt.setting.fantasy': 'Fantasy',
      'opt.setting.modern': '2026',
      'opt.setting.cyber': 'Cyberpunk',
    },
  });

  Carto.Setting = Setting;
})(window.Carto = window.Carto || {});
