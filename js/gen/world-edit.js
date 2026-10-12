/* World editing: names, colours, forms, borders, towns and points of interest.
   Edits are stored per map (seed + generation options) in the browser, can be
   exported/imported as a JSON project, and are re-applied on every generation. */
(function (Carto) {
  'use strict';

  const G = Carto.G, Svg = Carto.Svg, t = Carto.t, I18n = Carto.I18n;
  const World = Carto.World, Txt = Carto.WorldText;
  const esc = Svg.esc;
  const gen = Carto.generators.find((g) => g.id === 'world');

  I18n.add({
    it: {
      'edit.title': 'Modifica',
      'edit.name': 'Nome',
      'edit.rename': 'Rinomina',
      'edit.save': 'Salva',
      'edit.color': 'Colore',
      'edit.form': 'Forma di governo',
      'edit.population': 'Abitanti (migliaia)',
      'edit.port': 'Porto',
      'edit.move': 'Sposta',
      'edit.delete': 'Elimina',
      'edit.notes': 'Note dell’autore',
      'edit.notesHint': 'Appunti tuoi: storia, personaggi, segreti…',
      'edit.state': 'Stato',
      'edit.culture': 'Cultura',
      'edit.religion': 'Religione',
      'edit.province': 'Provincia',
      'edit.river': 'Fiume',
      'edit.water': 'Specchio d’acqua',
      'edit.assign': 'Assegna questa zona a',
      'edit.radius': 'Raggio',
      'edit.free': 'Terre libere',
      'edit.apply': 'Applica',
      'edit.addTown': 'Aggiungi una città qui',
      'edit.addMarker': 'Aggiungi un luogo notevole qui',
      'edit.add': 'Aggiungi',
      'edit.pickMove': 'Clicca sulla mappa il nuovo punto per {n}. Esc per annullare.',
      'edit.notLand': 'Scegli un punto sulla terraferma.',
      'edit.count': 'Modifiche a questa mappa: {n}',
      'edit.none': 'Nessuna modifica: clicca un punto della mappa per rinominare, ricolorare o spostare.',
      'edit.export': 'Esporta progetto',
      'edit.import': 'Importa progetto',
      'edit.undo': 'Annulla ultima',
      'edit.reset': 'Cancella tutte le modifiche',
      'edit.resetConfirm': 'Conferma: cancella tutto',
      'edit.saved': 'Modifica salvata',
      'edit.undone': 'Modifica annullata',
      'edit.cleared': 'Modifiche cancellate',
      'edit.imported': 'Progetto importato',
      'edit.badFile': 'Questo file non è un progetto del Cartografo Errante.',
      'edit.local': 'Le modifiche restano in questo browser: esporta il progetto per conservarle o condividerle.',
      'edit.worldName': 'Nome del mondo',
      'edit.noteMarker': 'Descrizione',
    },
    en: {
      'edit.title': 'Edit',
      'edit.name': 'Name',
      'edit.rename': 'Rename',
      'edit.save': 'Save',
      'edit.color': 'Colour',
      'edit.form': 'Form of government',
      'edit.population': 'Inhabitants (thousands)',
      'edit.port': 'Port',
      'edit.move': 'Move',
      'edit.delete': 'Delete',
      'edit.notes': 'Author’s notes',
      'edit.notesHint': 'Your own notes: history, characters, secrets…',
      'edit.state': 'State',
      'edit.culture': 'Culture',
      'edit.religion': 'Religion',
      'edit.province': 'Province',
      'edit.river': 'River',
      'edit.water': 'Body of water',
      'edit.assign': 'Assign this area to',
      'edit.radius': 'Radius',
      'edit.free': 'Free lands',
      'edit.apply': 'Apply',
      'edit.addTown': 'Add a town here',
      'edit.addMarker': 'Add a point of interest here',
      'edit.add': 'Add',
      'edit.pickMove': 'Click the new spot for {n} on the map. Esc to cancel.',
      'edit.notLand': 'Pick a spot on land.',
      'edit.count': 'Edits to this map: {n}',
      'edit.none': 'No edits yet: click a point of the map to rename, recolour or move things.',
      'edit.export': 'Export project',
      'edit.import': 'Import project',
      'edit.undo': 'Undo last',
      'edit.reset': 'Clear all edits',
      'edit.resetConfirm': 'Confirm: clear everything',
      'edit.saved': 'Edit saved',
      'edit.undone': 'Edit undone',
      'edit.cleared': 'Edits cleared',
      'edit.imported': 'Project imported',
      'edit.badFile': 'This file is not a Wandering Cartographer project.',
      'edit.local': 'Edits stay in this browser: export the project to keep or share them.',
      'edit.worldName': 'World name',
      'edit.noteMarker': 'Description',
    },
  });

  const FORMS = ['kingdom', 'empire', 'duchy', 'grandduchy', 'principality', 'county', 'march', 'republic', 'theocracy', 'khaganate', 'sultanate', 'emirate'];
  const MARKER_TYPES = ['ruins', 'dungeon', 'cave', 'mine', 'volcano', 'springs', 'grove', 'battlefield', 'lighthouse', 'monster', 'wreck'];
  const GEN_KEYS = ['template', 'cells', 'climate', 'states', 'cultures', 'religions', 'towns'];

  // ------------------------------------------------------------------ storage

  const blank = () => ({ v: 1, names: {}, colors: {}, forms: {}, notes: {}, cells: {}, burgs: {}, added: [], markers: {}, addedMarkers: [] });
  const keyOf = (seed, opts) => 'carto.world.edits:' + seed + ':' + GEN_KEYS.map((k) => opts[k]).join(':');
  const history = new Map(); // storage key -> stack of previous JSON states

  function load(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? Object.assign(blank(), JSON.parse(raw)) : blank();
    } catch (e) { return blank(); }
  }
  function store(key, E) {
    try {
      if (count(E)) localStorage.setItem(key, JSON.stringify(E));
      else localStorage.removeItem(key);
    } catch (e) { /* storage unavailable: edits live until reload */ }
  }
  function count(E) {
    return Object.keys(E.names).length + Object.keys(E.colors).length + Object.keys(E.forms).length + Object.keys(E.notes).length +
      Object.keys(E.burgs).length + E.added.length + Object.keys(E.markers).length + E.addedMarkers.length + (Object.keys(E.cells).length ? 1 : 0);
  }

  // ------------------------------------------------------------------ applying

  function target(m, kind, id) {
    const list = { state: m.states, culture: m.cultures, religion: m.religions, province: m.provinces, burg: m.burgs, river: m.rivers, feature: m.features }[kind];
    if (!list) return null;
    return kind === 'river' ? list.find((r) => r.id === id) : list[id];
  }

  function setName(m, key, value) {
    if (key === 'world') { m.name = value; return; }
    const [kind, sid] = key.split(':');
    const id = Number(sid);
    if (kind === 'marker') { const mk = m.markers.find((q) => q.id === id); if (mk) mk.name = value; return; }
    const o = target(m, kind, id);
    if (!o) return;
    if (kind === 'religion' || kind === 'province') o.customName = value;
    else o.name = value;
  }

  function setColor(m, key, value) {
    const [kind, id] = key.split(':');
    const o = target(m, kind, Number(id));
    if (o) o.color = value;
  }

  function recompute(m) {
    const grid = m.grid, n = grid.n;
    for (const s of m.states) if (s) Object.assign(s, { cells: 0, area: 0, pop: 0, burgs: 0 });
    for (let i = 0; i < n; i++) {
      if (m.isWater(i)) continue;
      const s = m.states[m.state[i]];
      if (!s) continue;
      s.cells++;
      s.area += grid.area[i] * World.KM * World.KM;
      s.pop += m.pop[i];
      const p = m.provinces[m.province[i]];
      if (p && p.state !== m.state[i]) m.province[i] = 0;
    }
    m.burgAt.fill(0);
    for (const b of m.burgs) {
      if (!b) continue;
      b.state = m.state[b.cell];
      b.province = m.province[b.cell];
      b.culture = m.culture[b.cell] || b.culture;
      b.religion = m.religion[b.cell];
      b.river = m.riverOf[b.cell] > 0;
      m.burgAt[b.cell] = b.id;
      if (m.states[b.state]) m.states[b.state].burgs++;
    }
    const poles = World.poles(grid, m.state, m.states.length);
    for (const s of m.states) if (s && s.id) s.pole = poles[s.id] >= 0 ? poles[s.id] : s.pole;
  }

  function landCell(m, x, y) {
    const c = m.grid.find(x, y);
    return c >= 0 && !m.isWater(c) ? c : -1;
  }

  function addBurg(m, a) {
    const b = { id: m.burgs.length, cell: a.cell, x: a.x, y: a.y, capital: false, culture: m.culture[a.cell], name: a.name, port: !!a.port, population: a.population, seed: Carto.hashString(m.seed + ':added:' + a.uid), added: a.uid };
    m.burgs.push(b);
    return b;
  }

  function addMarker(m, a) {
    const id = m.markers.reduce((mx, q) => Math.max(mx, q.id), 0) + 1;
    const mk = { id, type: a.type, cell: a.cell, x: a.x, y: a.y, seed: Carto.hashString(m.seed + ':addedm:' + a.uid), v: 0, name: a.name, added: a.uid };
    m.markers.push(mk);
    return mk;
  }

  function apply(m, E) {
    for (const [c, s] of Object.entries(E.cells)) {
      const i = Number(c);
      if (i >= 0 && i < m.grid.n && !m.isWater(i) && (s === 0 || m.states[s])) m.state[i] = s;
    }
    for (const a of E.added) addBurg(m, a);
    for (const [id, e] of Object.entries(E.burgs)) {
      const b = m.burgs[Number(id)];
      if (!b) continue;
      if (e.deleted && !b.capital) {
        for (const p of m.provinces) if (p && p.burg === b.id) p.seatName = b.name;
        m.burgs[b.id] = null;
        continue;
      }
      if (e.x !== undefined) { b.x = e.x; b.y = e.y; b.cell = e.cell; }
      if (e.population !== undefined) b.population = e.population;
      if (e.port !== undefined) b.port = e.port;
    }
    for (const a of E.addedMarkers) addMarker(m, a);
    for (const [id, e] of Object.entries(E.markers)) {
      const i = m.markers.findIndex((q) => q.id === Number(id));
      if (i < 0) continue;
      if (e.deleted) m.markers.splice(i, 1);
      else if (e.x !== undefined) Object.assign(m.markers[i], { x: e.x, y: e.y, cell: e.cell });
    }
    for (const [k, v] of Object.entries(E.names)) setName(m, k, v);
    for (const [k, v] of Object.entries(E.colors)) setColor(m, k, v);
    for (const [id, f] of Object.entries(E.forms)) if (m.states[Number(id)]) m.states[Number(id)].form = f;
    for (const [k, v] of Object.entries(E.notes)) {
      if (k.startsWith('marker:')) { const mk = m.markers.find((q) => q.id === Number(k.slice(7))); if (mk) mk.note = v; }
    }
    m.authorNotes = E.notes;
    recompute(m);
    m.editCount = count(E);
    return m;
  }

  // ------------------------------------------------------------------ inspector forms

  const baseGenerate = gen.generate;
  const baseInspect = gen.inspect;
  const baseNotes = gen.notes;

  gen.generate = (seed, opts) => {
    const m = baseGenerate(seed, opts);
    m.editKey = keyOf(seed, opts);
    return apply(m, load(m.editKey));
  };

  const field = (label, html) => '<label class="edit-field"><span>' + esc(label) + '</span>' + html + '</label>';
  const nameForm = (key, value, label) =>
    '<form class="edit-row" data-act="rename" data-key="' + esc(key) + '">' +
    field(label || t('edit.name'), '<input name="value" value="' + esc(value) + '" maxlength="60" required>') +
    '<button class="btn" type="submit">' + esc(t('edit.save')) + '</button></form>';
  const colorInput = (key, value) => field(t('edit.color'), '<input type="color" data-act="color" data-key="' + esc(key) + '" value="' + esc(value) + '">');
  const notesForm = (m, key) =>
    '<form class="edit-col" data-act="note" data-key="' + esc(key) + '">' + field(t('edit.notes'),
      '<textarea name="value" rows="3" placeholder="' + esc(t('edit.notesHint')) + '">' + esc((m.authorNotes || {})[key] || '') + '</textarea>') +
    '<button class="btn" type="submit">' + esc(t('edit.save')) + '</button></form>';
  const section = (title, body, open) => '<details class="edit"' + (open ? ' open' : '') + '><summary>' + esc(title) + '</summary>' + body + '</details>';

  function pickTarget(m, x, y) {
    const near = (p, r) => Math.hypot(p.x - x, p.y - y) < r;
    const mk = m.markers.find((q) => near({ x: q.x, y: q.y - 12 }, 9));
    if (mk) return { type: 'marker', mk };
    const b = m.burgs.filter((q) => q && near(q, q.capital ? 9 : 7)).sort((p, q) => Math.hypot(p.x - x, p.y - y) - Math.hypot(q.x - x, q.y - y))[0];
    if (b) return { type: 'burg', b };
    const c = m.grid.find(x, y);
    return c < 0 ? null : { type: 'cell', c };
  }

  function stateForms(m, s) {
    return section(t('edit.state') + ': ' + Txt.stateName(s),
      nameForm('state:' + s.id, s.name) +
      '<div class="edit-row">' + field(t('edit.form'), '<select data-act="form" data-id="' + s.id + '">' +
        FORMS.map((f) => '<option value="' + f + '"' + (f === s.form ? ' selected' : '') + '>' + esc(t('form.' + f, { n: '…' })) + '</option>').join('') + '</select>') +
      colorInput('state:' + s.id, s.color) + '</div>' + notesForm(m, 'state:' + s.id));
  }

  gen.inspect = (m, x, y, opts) => {
    const base = baseInspect(m, x, y, opts);
    const tg = pickTarget(m, x, y);
    if (!base || !tg) return base;
    let h = '';
    if (tg.type === 'marker') {
      const mk = tg.mk;
      h += nameForm('marker:' + mk.id, mk.name);
      h += '<form class="edit-col" data-act="note" data-key="marker:' + mk.id + '">' + field(t('edit.noteMarker'), '<textarea name="value" rows="3">' + esc(Txt.markerNote(mk)) + '</textarea>') +
        '<button class="btn" type="submit">' + esc(t('edit.save')) + '</button></form>';
      h += '<div class="edit-row"><button class="btn" type="button" data-act="move-marker" data-id="' + mk.id + '">' + esc(t('edit.move')) + '</button>' +
        '<button class="btn ghost danger" type="button" data-act="delete-marker" data-id="' + mk.id + '">' + esc(t('edit.delete')) + '</button></div>';
      h = section(t('edit.title'), h, true);
    } else if (tg.type === 'burg') {
      const b = tg.b;
      h += nameForm('burg:' + b.id, b.name);
      h += '<form class="edit-row" data-act="burg" data-id="' + b.id + '">' +
        field(t('edit.population'), '<input name="population" type="number" min="0.1" max="2000" step="0.1" value="' + b.population + '">') +
        '<label class="edit-check"><input type="checkbox" name="port"' + (b.port ? ' checked' : '') + '> ' + esc(t('edit.port')) + '</label>' +
        '<button class="btn" type="submit">' + esc(t('edit.save')) + '</button></form>';
      h += notesForm(m, 'burg:' + b.id);
      h += '<div class="edit-row"><button class="btn" type="button" data-act="move-burg" data-id="' + b.id + '">' + esc(t('edit.move')) + '</button>' +
        (b.capital ? '' : '<button class="btn ghost danger" type="button" data-act="delete-burg" data-id="' + b.id + '">' + esc(t('edit.delete')) + '</button>') + '</div>';
      h = section(t('edit.title'), h, true);
      if (m.states[b.state] && b.state) h += stateForms(m, m.states[b.state]);
    } else {
      const c = tg.c;
      if (m.isWater(c)) {
        const f = m.features[m.feature[c]];
        if (f && f.name) h += section(t('edit.water'), nameForm('feature:' + f.id, f.name), true);
        h += section(t('edit.addMarker'), markerAdder(x, y, ['monster', 'wreck', 'lighthouse']));
      } else {
        const s = m.states[m.state[c]];
        if (s && s.id) h += stateForms(m, s);
        const opts2 = m.states.filter((q) => q && q.id).map((q) => '<option value="' + q.id + '"' + (q.id === m.state[c] ? ' selected' : '') + '>' + esc(Txt.stateName(q)) + '</option>').join('');
        h += section(t('edit.assign') + '…',
          '<form class="edit-col" data-act="assign" data-cell="' + c + '">' +
          field(t('edit.assign'), '<select name="state"><option value="0">' + esc(t('edit.free')) + '</option>' + opts2 + '</select>') +
          '<div class="edit-row">' + field(t('edit.radius'), '<select name="radius"><option>0</option><option selected>1</option><option>2</option><option>3</option><option>5</option></select>') +
          '<button class="btn" type="submit">' + esc(t('edit.apply')) + '</button></div></form>');
        const k = m.cultures[m.culture[c]];
        if (k) h += section(t('edit.culture') + ': ' + k.name, nameForm('culture:' + k.id, k.name) + '<div class="edit-row">' + colorInput('culture:' + k.id, k.color) + '</div>');
        const r = m.religions[m.religion[c]];
        if (r) h += section(t('edit.religion') + ': ' + Txt.relName(m, r), nameForm('religion:' + r.id, Txt.relName(m, r)) + '<div class="edit-row">' + colorInput('religion:' + r.id, r.color) + '</div>');
        const p = m.provinces[m.province[c]];
        if (p) h += section(t('edit.province') + ': ' + Txt.provName(m, p), nameForm('province:' + p.id, Txt.provName(m, p)) + '<div class="edit-row">' + colorInput('province:' + p.id, p.color) + '</div>');
        if (m.riverOf[c]) { const rv = m.rivers[m.riverOf[c] - 1]; h += section(t('edit.river') + ': ' + rv.name, nameForm('river:' + rv.id, rv.name)); }
        h += section(t('edit.addTown'), '<form class="edit-row" data-act="add-burg" data-x="' + x.toFixed(1) + '" data-y="' + y.toFixed(1) + '">' +
          field(t('edit.name'), '<input name="name" maxlength="40" placeholder="' + esc(Carto.NameBases.name((k || m.cultures[1]).base, new Carto.Random(c * 7 + 1))) + '">') +
          '<button class="btn" type="submit">' + esc(t('edit.add')) + '</button></form>');
        h += section(t('edit.addMarker'), markerAdder(x, y, MARKER_TYPES));
      }
    }
    return Object.assign({}, base, { html: base.html + '<div class="edit-area">' + h + '</div>' });
  };

  function markerAdder(x, y, types) {
    return '<form class="edit-row" data-act="add-marker" data-x="' + x.toFixed(1) + '" data-y="' + y.toFixed(1) + '">' +
      field(t('edit.title'), '<select name="type">' + types.map((ty) => '<option value="' + ty + '">' + esc(t('marker.' + ty)) + '</option>').join('') + '</select>') +
      '<button class="btn" type="submit">' + esc(t('edit.add')) + '</button></form>';
  }

  gen.notes = (m, opts) => {
    const n = m.editCount || 0;
    const tools = '<div class="edit-tools">' +
      nameForm('world', m.name, t('edit.worldName')) +
      '<p class="tag">' + esc(n ? t('edit.count', { n }) : t('edit.none')) + '</p>' +
      '<div class="export-row">' +
      (n ? '<button class="btn" type="button" data-act="undo">' + esc(t('edit.undo')) + '</button>' : '') +
      '<button class="btn" type="button" data-act="export">' + esc(t('edit.export')) + '</button>' +
      '<label class="btn file-btn">' + esc(t('edit.import')) + '<input type="file" accept=".json,application/json" data-act="import" hidden></label>' +
      (n ? '<button class="btn ghost danger" type="button" data-act="reset">' + esc(t('edit.reset')) + '</button>' : '') +
      '</div><p class="tag">' + esc(t('edit.local')) + '</p></div>';
    return tools + baseNotes(m, opts);
  };

  // ------------------------------------------------------------------ actions

  gen.act = (m, a, ctx) => {
    const key = m.editKey;
    let E = load(key);
    const push = () => {
      const stack = history.get(key) || [];
      stack.push(JSON.stringify(E));
      if (stack.length > 50) stack.shift();
      history.set(key, stack);
    };
    const done = (extra) => { store(key, E); m.editCount = count(E); return Object.assign({ render: true, keepInspector: true, toast: t('edit.saved') }, extra); };
    switch (a.act) {
      case 'rename': {
        const v = String(a.value || '').trim().slice(0, 60);
        if (!v) return null;
        push(); E.names[a.key] = v; setName(m, a.key, v);
        return done();
      }
      case 'color':
        push(); E.colors[a.key] = a.value; setColor(m, a.key, a.value);
        return done();
      case 'form':
        push(); E.forms[a.id] = a.value; m.states[Number(a.id)].form = a.value;
        return done();
      case 'note': {
        push();
        const v = String(a.value || '').trim();
        if (v) E.notes[a.key] = v; else delete E.notes[a.key];
        m.authorNotes = E.notes;
        if (a.key.startsWith('marker:')) { const mk = m.markers.find((q) => q.id === Number(a.key.slice(7))); if (mk) mk.note = v || null; }
        return done();
      }
      case 'burg': {
        const b = m.burgs[Number(a.id)];
        if (!b) return null;
        push();
        const e = E.burgs[a.id] || (E.burgs[a.id] = {});
        e.population = Math.max(0.1, Math.min(2000, parseFloat(a.population) || b.population));
        e.port = a.port === 'on';
        if (b.added) Object.assign(E.added.find((q) => q.uid === b.added), { population: e.population, port: e.port });
        b.population = e.population; b.port = e.port;
        return done();
      }
      case 'delete-burg': {
        const b = m.burgs[Number(a.id)];
        if (!b || b.capital) return null;
        push();
        if (b.added) E.added = E.added.filter((q) => q.uid !== b.added);
        else E.burgs[a.id] = { deleted: true };
        return done({ regenerate: true, keepInspector: false });
      }
      case 'add-burg': {
        const x = Number(a.x), y = Number(a.y);
        const c = landCell(m, x, y);
        if (c < 0) return { toast: t('edit.notLand') };
        push();
        const k = m.cultures[m.culture[c]] || m.cultures[1];
        const add = { uid: Date.now().toString(36) + Math.floor(Math.random() * 1e4), x, y, cell: c, population: 2.5, port: false,
          name: String(a.name || '').trim().slice(0, 40) || Carto.NameBases.name(k.base, new Carto.Random(c * 7 + 1)) };
        E.added.push(add);
        addBurg(m, add);
        recompute(m);
        return done({ keepInspector: false });
      }
      case 'add-marker': {
        const x = Number(a.x), y = Number(a.y);
        const c = m.grid.find(x, y);
        if (c < 0) return null;
        push();
        const k = m.cultures[m.culture[c]] || m.cultures[1];
        const add = { uid: Date.now().toString(36) + Math.floor(Math.random() * 1e4), type: a.type, x, y, cell: c, name: Carto.NameBases.name(k.base, new Carto.Random(c * 11 + 3)) };
        E.addedMarkers.push(add);
        addMarker(m, add);
        return done({ keepInspector: false });
      }
      case 'delete-marker': {
        const mk = m.markers.find((q) => q.id === Number(a.id));
        if (!mk) return null;
        push();
        if (mk.added) E.addedMarkers = E.addedMarkers.filter((q) => q.uid !== mk.added);
        else E.markers[a.id] = { deleted: true };
        m.markers.splice(m.markers.indexOf(mk), 1);
        return done({ keepInspector: false });
      }
      case 'move-burg': case 'move-marker': {
        const o = a.act === 'move-burg' ? m.burgs[Number(a.id)] : m.markers.find((q) => q.id === Number(a.id));
        if (!o) return null;
        return { pick: { act: a.act + '-to', id: a.id }, toast: t('edit.pickMove', { n: o.name }), keepInspector: false };
      }
      case 'move-burg-to': {
        const b = m.burgs[Number(a.id)];
        const c = landCell(m, a.x, a.y);
        if (!b || c < 0) return { toast: t('edit.notLand') };
        push();
        if (b.added) Object.assign(E.added.find((q) => q.uid === b.added), { x: a.x, y: a.y, cell: c });
        else E.burgs[a.id] = Object.assign(E.burgs[a.id] || {}, { x: a.x, y: a.y, cell: c });
        Object.assign(b, { x: a.x, y: a.y, cell: c });
        recompute(m);
        return done({ keepInspector: false });
      }
      case 'move-marker-to': {
        const mk = m.markers.find((q) => q.id === Number(a.id));
        const c = m.grid.find(a.x, a.y);
        if (!mk || c < 0) return null;
        push();
        const pos = { x: a.x, y: a.y, cell: c };
        if (mk.added) Object.assign(E.addedMarkers.find((q) => q.uid === mk.added), pos);
        else E.markers[a.id] = Object.assign(E.markers[a.id] || {}, pos);
        Object.assign(mk, pos);
        return done({ keepInspector: false });
      }
      case 'assign': {
        const start = Number(a.cell), sid = Number(a.state), radius = Number(a.radius) || 0;
        if (m.isWater(start)) return null;
        push();
        let ring = [start];
        const seen = new Set(ring);
        for (let r = 0; r <= radius; r++) {
          const next = [];
          for (const c of ring) {
            E.cells[c] = sid;
            m.state[c] = sid;
            if (r < radius) for (const nb of m.grid.nbs[c]) if (!seen.has(nb) && !m.isWater(nb)) { seen.add(nb); next.push(nb); }
          }
          ring = next;
        }
        recompute(m);
        return done();
      }
      case 'undo': {
        const stack = history.get(key) || [];
        if (!stack.length) return null;
        E = Object.assign(blank(), JSON.parse(stack.pop()));
        store(key, E);
        return { regenerate: true, toast: t('edit.undone') };
      }
      case 'reset': {
        if (!a.confirmed) return { confirm: { act: 'reset', label: t('edit.resetConfirm') } };
        push();
        E = blank();
        store(key, E);
        return { regenerate: true, toast: t('edit.cleared') };
      }
      case 'export': {
        const data = { app: 'il-cartografo-errante', generator: 'world', version: 1, seed: m.seed, opts: Object.fromEntries(GEN_KEYS.map((k) => [k, ctx.opts[k]])), edits: E };
        const name = (m.name || 'world').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + m.seed + '.json';
        return { download: { name, blob: new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' }) } };
      }
      case 'import': {
        let data;
        try { data = JSON.parse(a.text); } catch (e) { data = null; }
        if (!data || data.generator !== 'world' || !data.seed || !data.edits) return { toast: t('edit.badFile') };
        const opts = Object.assign({}, ctx.opts, data.opts);
        store(keyOf(data.seed, opts), Object.assign(blank(), data.edits));
        return { hash: Carto.linkTo('world', data.seed, opts), regenerate: true, toast: t('edit.imported') };
      }
    }
    return null;
  };
})(window.Carto = window.Carto || {});
