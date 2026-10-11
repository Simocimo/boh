/* Italian / English strings. Generators add their own tables with I18n.add(). */
(function (Carto) {
  'use strict';

  const dict = { it: {}, en: {} };
  const listeners = [];
  let lang = 'it';

  try {
    const saved = localStorage.getItem('carto.lang');
    if (saved === 'it' || saved === 'en') lang = saved;
    else if (typeof navigator !== 'undefined' && navigator.language && !/^it/i.test(navigator.language)) lang = 'en';
  } catch (e) { /* storage unavailable: keep default */ }

  function format(s, params) {
    if (!params) return s;
    return s.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? params[k] : m));
  }

  const I18n = {
    get lang() { return lang; },
    add(tables) {
      for (const l in tables) Object.assign(dict[l] || (dict[l] = {}), tables[l]);
    },
    set(l) {
      if (l === lang || !dict[l]) return;
      lang = l;
      try { localStorage.setItem('carto.lang', l); } catch (e) { /* ignore */ }
      if (typeof document !== 'undefined') document.documentElement.lang = l;
      listeners.forEach((fn) => fn(l));
    },
    onChange(fn) { listeners.push(fn); },
    has(key) { return key in dict[lang] || key in dict.en; },
    t(key, params) {
      const s = key in dict[lang] ? dict[lang][key] : key in dict.en ? dict.en[key] : key;
      return format(s, params);
    },
    // Translate static markup: data-i18n (text), data-i18n-title, data-i18n-label (aria-label).
    apply(root) {
      root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = I18n.t(el.dataset.i18n); });
      root.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = I18n.t(el.dataset.i18nTitle); });
      root.querySelectorAll('[data-i18n-label]').forEach((el) => { el.setAttribute('aria-label', I18n.t(el.dataset.i18nLabel)); });
    },
  };

  I18n.add({
    it: {
      'brand': 'Il Cartografo Errante',
      'tagline': 'Generatori di mappe fantasy. Ogni mappa nasce da un seme: cambialo e ottieni un luogo nuovo, sempre riproducibile.',
      'hub.pick': 'Che cosa disegniamo oggi?',
      'hub.open': 'Apri',
      'hub.reroll': 'Altra anteprima',
      'hub.footer': 'Tutto gira nel browser, senza server. Le mappe esportate sono tue: usale per giochi, romanzi e campagne.',
      'hub.credit': 'Ispirato ai generatori di Oleg Dolya (watabou).',
      'nav.all': 'Tutti i generatori',
      'nav.lang': 'Lingua',
      'ui.new': 'Nuova mappa',
      'ui.newHint': 'Nuova mappa (tasto N)',
      'ui.seed': 'Seme',
      'ui.seedApply': 'Usa questo seme',
      'ui.options': 'Opzioni',
      'ui.style': 'Stile della mappa',
      'ui.export': 'Esporta',
      'ui.png': 'Immagine PNG',
      'ui.svg': 'Vettoriale SVG',
      'ui.copyLink': 'Copia link',
      'ui.linkCopied': 'Link copiato negli appunti',
      'ui.linkManual': 'Copia questo link:',
      'ui.zoomIn': 'Ingrandisci',
      'ui.zoomOut': 'Riduci',
      'ui.fit': 'Adatta alla finestra',
      'ui.notes': 'Legenda',
      'ui.saving': 'Preparo il file…',
      'ui.saved': 'File pronto: {name}',
      'ui.saveDeclined': 'Salvataggio annullato',
      'ui.saveFallback': 'Il download diretto non è disponibile qui: tieni premuto o fai clic destro sull’immagine per salvarla.',
      'ui.close': 'Chiudi',
      'ui.error': 'Qualcosa è andato storto con questo seme. Prova una nuova mappa.',
      'ui.mapLabel': 'Mappa generata',
      'ui.dragHint': 'Trascina per spostarti, rotella o pizzico per lo zoom.',
      'palette.parchment': 'Pergamena',
      'palette.ink': 'Inchiostro',
      'palette.night': 'Notte',
      'palette.blueprint': 'Cianografia',
      'opt.on': 'Sì',
      'opt.off': 'No',
      'opt.labels': 'Etichette',
      'opt.grid': 'Griglia',
      'map.scale': 'scala',
    },
    en: {
      'brand': 'The Wandering Cartographer',
      'tagline': 'Fantasy map generators. Every map grows from a seed: change it and you get a new place, always reproducible.',
      'hub.pick': 'What shall we draw today?',
      'hub.open': 'Open',
      'hub.reroll': 'Another preview',
      'hub.footer': 'Everything runs in your browser, no server involved. Exported maps are yours: use them for games, novels and campaigns.',
      'hub.credit': 'Inspired by the generators of Oleg Dolya (watabou).',
      'nav.all': 'All generators',
      'nav.lang': 'Language',
      'ui.new': 'New map',
      'ui.newHint': 'New map (N key)',
      'ui.seed': 'Seed',
      'ui.seedApply': 'Use this seed',
      'ui.options': 'Options',
      'ui.style': 'Map style',
      'ui.export': 'Export',
      'ui.png': 'PNG image',
      'ui.svg': 'SVG vector',
      'ui.copyLink': 'Copy link',
      'ui.linkCopied': 'Link copied to clipboard',
      'ui.linkManual': 'Copy this link:',
      'ui.zoomIn': 'Zoom in',
      'ui.zoomOut': 'Zoom out',
      'ui.fit': 'Fit to window',
      'ui.notes': 'Key',
      'ui.saving': 'Preparing the file…',
      'ui.saved': 'File ready: {name}',
      'ui.saveDeclined': 'Save cancelled',
      'ui.saveFallback': 'Direct download is not available here: long-press or right-click the image to save it.',
      'ui.close': 'Close',
      'ui.error': 'Something went wrong with this seed. Try a new map.',
      'ui.mapLabel': 'Generated map',
      'ui.dragHint': 'Drag to pan, wheel or pinch to zoom.',
      'palette.parchment': 'Parchment',
      'palette.ink': 'Ink',
      'palette.night': 'Night',
      'palette.blueprint': 'Blueprint',
      'opt.on': 'Yes',
      'opt.off': 'No',
      'opt.labels': 'Labels',
      'opt.grid': 'Grid',
      'map.scale': 'scale',
    },
  });

  Carto.I18n = I18n;
  Carto.t = I18n.t;
})(window.Carto = window.Carto || {});
