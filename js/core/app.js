/* Application shell: routing, the hub, the generator workbench, pan/zoom and export.
   Generators register themselves with Carto.register({...}); see README.md. */
(function (Carto) {
  'use strict';

  const I18n = Carto.I18n, t = Carto.t;
  const gens = [];
  const byId = {};

  Carto.register = function (gen) {
    gens.push(gen);
    byId[gen.id] = gen;
    gens.sort((a, b) => (a.order || 0) - (b.order || 0));
  };
  Carto.generators = gens;

  // --------------------------------------------------------------- storage
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };

  const framed = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

  // ------------------------------------------------------------ option codec
  function defaults(gen) {
    const o = {};
    for (const opt of gen.options) o[opt.id] = opt.def;
    return o;
  }

  function decodeOpt(opt, raw) {
    if (raw === undefined) return opt.def;
    switch (opt.type) {
      case 'bool': return raw === '1';
      case 'range': {
        const v = parseFloat(raw);
        return isNaN(v) ? opt.def : Math.max(opt.min, Math.min(opt.max, v));
      }
      case 'select': return opt.values.includes(raw) ? raw : opt.def;
      default: return String(raw).replace(/_/g, ' ');
    }
  }

  function encodeOpt(opt, v) {
    switch (opt.type) {
      case 'bool': return v ? '1' : '0';
      case 'text': return String(v).replace(/[^A-Za-z0-9]+/g, '_');
      default: return String(v);
    }
  }

  function parseHash() {
    let h = '';
    try { h = decodeURIComponent(location.hash.replace(/^#/, '')); } catch (e) { h = ''; }
    const parts = h.split('.');
    const gen = byId[parts[0]];
    if (!gen) return { gen: null };
    const seed = /^\d+$/.test(parts[1] || '') ? parseInt(parts[1], 10) : null;
    const raw = {};
    for (const p of parts.slice(2)) {
      const i = p.indexOf('-');
      if (i > 0) raw[p.slice(0, i)] = p.slice(i + 1);
    }
    const opts = {};
    for (const opt of gen.options) opts[opt.id] = decodeOpt(opt, raw[opt.id]);
    return { gen, seed, opts };
  }

  function buildHash(gen, seed, opts) {
    let s = gen.id + '.' + seed;
    for (const opt of gen.options) {
      const v = opts[opt.id];
      if (v === undefined || v === opt.def || v === '') continue;
      s += '.' + opt.id + '-' + encodeOpt(opt, v);
    }
    return '#' + s;
  }
  Carto.linkTo = (id, seed, opts = {}) => {
    const gen = byId[id];
    return gen ? buildHash(gen, seed, Object.assign(defaults(gen), opts)) : '#';
  };

  // ------------------------------------------------------------------- DOM
  const $ = (id) => document.getElementById(id);
  let els;

  const state = {
    gen: null,
    seed: 1,
    opts: {},
    model: null,
    palette: Carto.Palettes[store.get('carto.palette')] ? store.get('carto.palette') : 'parchment',
    mapW: 100,
    mapH: 100,
    view: { cx: 50, cy: 50, z: 1 },
    svgEl: null,
  };

  function toast(html, ms = 2600) {
    const el = els.toast;
    el.innerHTML = html;
    el.hidden = false;
    clearTimeout(toast.timer);
    if (ms) toast.timer = setTimeout(() => { el.hidden = true; }, ms);
  }

  // ------------------------------------------------------------------ tabs
  function buildTabs() {
    els.tabs.innerHTML = '';
    for (const g of gens) {
      const a = document.createElement('a');
      a.href = '#' + g.id;
      a.textContent = t('gen.' + g.id + '.name');
      a.dataset.gen = g.id;
      els.tabs.appendChild(a);
    }
    markTabs();
  }
  function markTabs() {
    els.tabs.querySelectorAll('a').forEach((a) => {
      if (state.gen && a.dataset.gen === state.gen.id && !els.gen.hidden) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  // ------------------------------------------------------------------- hub
  const previews = {};

  function buildHub() {
    els.cards.innerHTML = '';
    for (const g of gens) {
      const card = document.createElement('article');
      card.className = 'card' + (g.featured ? ' featured' : '');
      card.innerHTML =
        '<a class="card-preview" data-gen="' + g.id + '" href="#' + g.id + '" tabindex="-1" aria-hidden="true"><span class="loading">…</span></a>' +
        '<div class="card-body">' +
        '<h3></h3><p></p>' +
        '<div class="card-actions">' +
        '<a class="btn primary" data-open="' + g.id + '" href="#' + g.id + '"></a>' +
        '<button type="button" class="btn ghost" data-reroll="' + g.id + '"></button>' +
        '</div></div>';
      els.cards.appendChild(card);
    }
    els.cards.addEventListener('click', (e) => {
      const b = e.target.closest('[data-reroll]');
      if (b) renderPreview(byId[b.dataset.reroll], true);
    });
    hubTexts();
  }

  function hubTexts() {
    els.cards.querySelectorAll('.card').forEach((card, i) => {
      const g = gens[i];
      card.querySelector('h3').textContent = t('gen.' + g.id + '.name');
      card.querySelector('.card-body p').textContent = t('gen.' + g.id + '.desc');
      card.querySelector('[data-open]').textContent = t('hub.open');
      card.querySelector('[data-reroll]').textContent = t('hub.reroll');
    });
  }

  function renderPreview(g, fresh) {
    let p = previews[g.id];
    if (!p || fresh) {
      const seed = Carto.randomSeed();
      const opts = Object.assign(defaults(g), g.previewOptions || {});
      try {
        p = previews[g.id] = { seed, opts, model: g.generate(seed, opts) };
      } catch (err) {
        console.error(err);
        return;
      }
    }
    const box = els.cards.querySelector('.card-preview[data-gen="' + g.id + '"]');
    const card = box.closest('.card');
    const href = buildHash(g, p.seed, p.opts);
    box.href = href;
    card.querySelector('[data-open]').href = href;
    try {
      box.innerHTML = g.render(p.model, { palette: Carto.Palettes[state.palette], paletteId: state.palette, preview: true });
      const svg = box.querySelector('svg');
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svg.setAttribute('aria-hidden', 'true');
    } catch (err) {
      console.error(err);
    }
  }

  function renderAllPreviews(fresh) {
    let i = 0;
    const step = () => {
      if (i >= gens.length) return;
      renderPreview(gens[i++], fresh);
      setTimeout(step, 16);
    };
    step();
  }

  // -------------------------------------------------------------- workbench
  function buildPanel() {
    const g = state.gen;
    els.title.textContent = t('gen.' + g.id + '.name');
    els.desc.textContent = t('gen.' + g.id + '.desc');
    els.seed.value = String(state.seed);
    const form = els.options;
    form.innerHTML = '';
    let group = null;
    for (const opt of g.options) {
      if (opt.hidden) continue;
      if (opt.group && opt.group !== group) {
        group = opt.group;
        const hd = document.createElement('h3');
        hd.className = 'opt-group';
        hd.textContent = t(g.id + '.group.' + group);
        form.appendChild(hd);
      }
      const label = t(g.id + '.opt.' + opt.id);
      const id = 'opt-' + g.id + '-' + opt.id;
      let node;
      if (opt.type === 'select') {
        node = document.createElement('fieldset');
        node.className = 'opt';
        let html = '<legend>' + Carto.Svg.esc(label) + '</legend><div class="segmented">';
        for (const v of opt.values) {
          html += '<label><input type="radio" name="' + id + '" id="' + id + '-' + v + '" value="' + v + '"' +
            (state.opts[opt.id] === v ? ' checked' : '') + '><span>' +
            Carto.Svg.esc(t(g.id + '.opt.' + opt.id + '.' + v)) + '</span></label>';
        }
        node.innerHTML = html + '</div>';
        node.addEventListener('change', (e) => setOption(opt.id, e.target.value));
      } else if (opt.type === 'bool') {
        node = document.createElement('label');
        node.className = 'opt toggle';
        node.innerHTML = '<span>' + Carto.Svg.esc(label) + '</span><input type="checkbox" role="switch" id="' + id + '"' +
          (state.opts[opt.id] ? ' checked' : '') + '>';
        node.querySelector('input').addEventListener('change', (e) => setOption(opt.id, e.target.checked));
      } else if (opt.type === 'range') {
        node = document.createElement('div');
        node.className = 'opt range';
        node.innerHTML = '<div class="range-head"><label for="' + id + '">' + Carto.Svg.esc(label) + '</label><output for="' + id + '"></output></div>' +
          '<input type="range" id="' + id + '" min="' + opt.min + '" max="' + opt.max + '" step="' + (opt.step || 1) + '" value="' + state.opts[opt.id] + '">';
        const input = node.querySelector('input'), out = node.querySelector('output');
        const show = () => { out.textContent = opt.format ? opt.format(+input.value) : input.value; };
        show();
        input.addEventListener('input', show);
        input.addEventListener('change', () => setOption(opt.id, +input.value));
      } else continue;
      form.appendChild(node);
    }
    buildSwatches();
    els.link.hidden = framed;
  }

  function buildSwatches() {
    els.palettes.innerHTML = '';
    for (const id of Carto.PaletteOrder) {
      const p = Carto.Palettes[id];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatch';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(id === state.palette));
      b.dataset.palette = id;
      b.innerHTML = '<i><b style="background:' + p.paper + '"></b><b style="background:' + p.building + '"></b><b style="background:' + p.ink + '"></b></i>' +
        Carto.Svg.esc(t('palette.' + id));
      b.addEventListener('click', () => setPalette(id));
      els.palettes.appendChild(b);
    }
  }

  function setPalette(id) {
    state.palette = id;
    store.set('carto.palette', id);
    els.palettes.querySelectorAll('.swatch').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.palette === id)));
    if (!els.gen.hidden && state.model) renderMap(true);
    if (!els.hub.hidden) renderAllPreviews(false);
  }

  function setOption(id, value) {
    state.opts[id] = value;
    // Options that only change the drawing do not need a new model.
    const opt = state.gen.options.find((o) => o.id === id);
    if (opt && opt.renderOnly) renderMap(true);
    else regenerate(false);
    updateHash();
  }

  function setSeed(seed) {
    state.seed = seed >>> 0 || 1;
    els.seed.value = String(state.seed);
    regenerate(false);
    updateHash();
  }

  function updateHash() {
    const h = buildHash(state.gen, state.seed, state.opts);
    if (location.hash === h) return;
    try { history.replaceState(null, '', h); } catch (e) { /* sandboxed: keep going */ }
  }

  function regenerate(keepView) {
    const g = state.gen;
    if (!keepView) state.pick = null;
    try {
      state.model = g.generate(state.seed, state.opts);
    } catch (err) {
      console.error(err);
      state.model = null;
      els.viewport.innerHTML = '<p class="map-error">' + Carto.Svg.esc(t('ui.error')) + '</p>';
      els.notesSection.hidden = true;
      return;
    }
    renderMap(keepView);
  }

  function renderMap(keepView) {
    const g = state.gen;
    if (!state.model) return;
    let svg;
    try {
      svg = g.render(state.model, Object.assign({ palette: Carto.Palettes[state.palette], paletteId: state.palette }, state.opts));
    } catch (err) {
      console.error(err);
      els.viewport.innerHTML = '<p class="map-error">' + Carto.Svg.esc(t('ui.error')) + '</p>';
      return;
    }
    state.svgString = svg;
    hideInspector();
    els.viewport.innerHTML = svg;
    const el = els.viewport.querySelector('svg');
    state.svgEl = el;
    const vb = el.getAttribute('viewBox').split(/\s+/).map(Number);
    state.mapW = vb[2];
    state.mapH = vb[3];
    el.removeAttribute('width');
    el.removeAttribute('height');
    if (!keepView) fit();
    else applyView();
    const notes = g.notes ? g.notes(state.model, state.opts) : '';
    els.notesSection.hidden = !notes;
    els.notes.innerHTML = notes || '';
  }

  // --------------------------------------------------------------- pan/zoom
  function baseScale() {
    const r = els.viewport.getBoundingClientRect();
    return Math.min(r.width / state.mapW, r.height / state.mapH) * 0.97 || 1;
  }

  function applyView() {
    if (!state.svgEl) return;
    const r = els.viewport.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const s = baseScale() * state.view.z;
    const vw = r.width / s, vh = r.height / s;
    state.svgEl.setAttribute('viewBox', [state.view.cx - vw / 2, state.view.cy - vh / 2, vw, vh].map((n) => n.toFixed(2)).join(' '));
  }

  function fit() {
    state.view = { cx: state.mapW / 2, cy: state.mapH / 2, z: 1 };
    applyView();
  }

  function clampView() {
    const v = state.view;
    v.z = Math.max(0.5, Math.min(20, v.z));
    v.cx = Math.max(0, Math.min(state.mapW, v.cx));
    v.cy = Math.max(0, Math.min(state.mapH, v.cy));
  }

  function zoomAt(px, py, factor) {
    const r = els.viewport.getBoundingClientRect();
    const s = baseScale() * state.view.z;
    const mx = state.view.cx + (px - r.width / 2) / s;
    const my = state.view.cy + (py - r.height / 2) / s;
    state.view.z *= factor;
    clampView();
    const s2 = baseScale() * state.view.z;
    state.view.cx = mx - (px - r.width / 2) / s2;
    state.view.cy = my - (py - r.height / 2) / s2;
    clampView();
    applyView();
  }

  function panBy(dx, dy) {
    const s = baseScale() * state.view.z;
    state.view.cx -= dx / s;
    state.view.cy -= dy / s;
    clampView();
    applyView();
  }

  function setupPanZoom() {
    const vp = els.viewport;
    const pointers = new Map();
    let moved = 0, last = null, raf = 0, pending = null;

    const local = (e) => {
      const r = vp.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const gesture = () => {
      const pts = Array.from(pointers.values());
      if (pts.length === 1) return { x: pts[0].x, y: pts[0].y, d: 0 };
      const [a, b] = pts;
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) };
    };

    vp.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      pointers.set(e.pointerId, local(e));
      if (pointers.size === 1) moved = 0;
      last = gesture();
      vp.classList.add('dragging');
    });
    vp.addEventListener('pointermove', (e) => {
      if (!pointers.has(e.pointerId)) return;
      const p = local(e);
      const prev = pointers.get(e.pointerId);
      moved += Math.abs(p.x - prev.x) + Math.abs(p.y - prev.y);
      // Capture only once a drag starts, so plain clicks still reach links in the map.
      if (moved > 4 && !vp.hasPointerCapture(e.pointerId)) {
        try { vp.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
      pointers.set(e.pointerId, p);
      const g = gesture();
      pending = { g, last };
      last = g;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          const { g: cur, last: before } = pending;
          if (cur.d && before.d) zoomAt(cur.x, cur.y, cur.d / before.d);
          panBy(cur.x - before.x, cur.y - before.y);
        });
      }
    });
    const end = (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      last = pointers.size ? gesture() : null;
      if (!pointers.size) vp.classList.remove('dragging');
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('click', (e) => {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); return; }
      const link = e.target.closest && e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        location.hash = link.getAttribute('data-link');
        return;
      }
      if (state.gen && state.model && state.svgEl && (state.pick || state.gen.inspect)) {
        const pt = state.svgEl.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const p = pt.matrixTransform(state.svgEl.getScreenCTM().inverse());
        if (state.pick) {
          const pick = state.pick;
          state.pick = null;
          els.viewport.classList.remove('picking');
          runAction(Object.assign({}, pick, { x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 }));
          return;
        }
        state.lastInspect = { x: p.x, y: p.y };
        showInspector(state.gen.inspect(state.model, p.x, p.y, state.opts));
      }
    }, true);
    vp.addEventListener('wheel', (e) => {
      e.preventDefault();
      const p = local(e);
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      zoomAt(p.x, p.y, Math.exp(-dy * 0.0016));
    }, { passive: false });
    vp.addEventListener('dblclick', (e) => {
      const p = local(e);
      zoomAt(p.x, p.y, e.shiftKey ? 0.5 : 2);
    });
    vp.addEventListener('keydown', (e) => {
      const step = 60;
      const keys = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      if (keys[e.key]) { e.preventDefault(); panBy(keys[e.key][0], keys[e.key][1]); }
    });
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => applyView()).observe(vp);
    else window.addEventListener('resize', applyView);

    const center = () => {
      const r = vp.getBoundingClientRect();
      return [r.width / 2, r.height / 2];
    };
    els.zoomIn.addEventListener('click', () => zoomAt(...center(), 1.5));
    els.zoomOut.addEventListener('click', () => zoomAt(...center(), 1 / 1.5));
    els.zoomFit.addEventListener('click', fit);
  }

  // -------------------------------------------------------------- inspector
  function showInspector(res) {
    hideInspector();
    if (!res) return;
    els.inspectorBody.innerHTML = res.html;
    els.inspector.hidden = false;
    // Outline what was picked, on top of the map.
    let mark = '';
    if (res.poly) mark = '<path d="' + Carto.Svg.d(res.poly) + '"/>';
    else if (res.mark) mark = '<circle cx="' + res.mark.x + '" cy="' + res.mark.y + '" r="' + res.mark.r + '"/>';
    if (mark && state.svgEl) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'pick');
      g.setAttribute('fill', 'none');
      g.setAttribute('stroke', '#c2412d');
      g.setAttribute('stroke-width', '2');
      g.innerHTML = mark;
      state.svgEl.appendChild(g);
    }
  }
  function hideInspector() {
    if (!els || !els.inspector) return;
    els.inspector.hidden = true;
    if (state.svgEl) state.svgEl.querySelectorAll('.pick').forEach((n) => n.remove());
  }

  // ---------------------------------------------------------------- editing
  /* Generators with an act(model, action, ctx) hook can offer forms in the
     inspector and in the key. Elements carry data-act; the result says what
     to refresh. */
  function runAction(payload, source) {
    if (!state.gen || !state.gen.act || !state.model) return;
    let res;
    try {
      res = state.gen.act(state.model, payload, { seed: state.seed, opts: state.opts });
    } catch (err) {
      console.error(err);
      toast(Carto.Svg.esc(t('ui.error')));
      return;
    }
    if (!res) return;
    if (res.confirm && source) {
      source.dataset.confirmed = '1';
      source.textContent = res.confirm.label;
      return;
    }
    if (res.download) saveBlob(res.download.name, res.download.blob);
    if (res.hash && location.hash !== res.hash) { location.hash = res.hash; if (res.toast) toast(Carto.Svg.esc(res.toast)); return; }
    const reopen = res.keepInspector && !els.inspector.hidden && state.lastInspect;
    if (res.regenerate) regenerate(true);
    else if (res.render) renderMap(true);
    if (reopen) showInspector(state.gen.inspect(state.model, state.lastInspect.x, state.lastInspect.y, state.opts));
    if (res.pick) {
      state.pick = res.pick;
      els.viewport.classList.add('picking');
      toast(Carto.Svg.esc(res.toast || ''), 0);
      return;
    }
    if (res.toast) toast(Carto.Svg.esc(res.toast));
  }

  function wireActions(root) {
    root.addEventListener('submit', (e) => {
      const form = e.target.closest('form[data-act]');
      if (!form) return;
      e.preventDefault();
      const data = Object.assign({}, form.dataset);
      new FormData(form).forEach((v, k) => { data[k] = v; });
      runAction(data, form);
    });
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-act]');
      if (!btn || btn.type === 'submit') return;
      runAction(Object.assign({}, btn.dataset), btn);
    });
    root.addEventListener('change', (e) => {
      const el = e.target;
      if (!el.matches('[data-act]') || el.closest('form[data-act]') && el.form && el.form.dataset.act) return;
      if (el.type === 'file') {
        const file = el.files && el.files[0];
        if (!file) return;
        file.text().then((text) => runAction(Object.assign({}, el.dataset, { text })));
        el.value = '';
        return;
      }
      runAction(Object.assign({}, el.dataset, { value: el.value }), el);
    });
  }

  // ----------------------------------------------------------------- export
  let downloadsPromise = null;
  function downloadsCapability() {
    if (!downloadsPromise) {
      downloadsPromise = (window.claude && typeof window.claude.use === 'function')
        ? window.claude.use('downloads').catch(() => null)
        : Promise.resolve(null);
    }
    return downloadsPromise;
  }

  function fileBase() {
    const g = state.gen;
    const name = g.fileName ? g.fileName(state.model) : g.id;
    return (name || g.id).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + state.seed;
  }

  function exportableSvg() {
    const svg = state.gen.render(state.model, Object.assign({ palette: Carto.Palettes[state.palette], paletteId: state.palette, exporting: true }, state.opts));
    return svg.replace(/^<svg([^>]*)>/, (m, a) => '<svg' + a + '><style>' + Carto.FONT_CSS + '</style>');
  }

  function svgToPng(svgText, w, h) {
    return new Promise((resolve, reject) => {
      const scale = Math.max(1, Math.min(4, 3200 / Math.max(w, h)));
      const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('svg load failed')); };
      img.src = url;
    });
  }

  async function saveBlob(name, blob) {
    const dl = await Promise.race([downloadsCapability(), new Promise((r) => setTimeout(() => r(null), 1500))]);
    if (dl) {
      try {
        await dl.save({ filename: name, data: blob });
        toast(Carto.Svg.esc(t('ui.saved', { name })));
        return;
      } catch (err) {
        if (err && err.code === 'declined') { toast(Carto.Svg.esc(t('ui.saveDeclined'))); return; }
        if (err && err.code === 'rate_limited') return;
      }
    }
    const url = URL.createObjectURL(blob);
    if (framed) {
      // Sandboxed frames may ignore download links: show the file for a manual save.
      els.overlayImg.src = url;
      els.overlay.hidden = false;
      els.overlayClose.focus();
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (!framed) toast(Carto.Svg.esc(t('ui.saved', { name })));
    setTimeout(() => { if (els.overlay.hidden) URL.revokeObjectURL(url); }, 60000);
  }

  async function exportAs(kind) {
    if (!state.model) return;
    toast(Carto.Svg.esc(t('ui.saving')), 0);
    try {
      const svg = exportableSvg();
      const name = fileBase() + '.' + kind;
      if (kind === 'svg') {
        await saveBlob(name, new Blob([svg], { type: 'image/svg+xml' }));
      } else {
        const png = await svgToPng(svg, state.mapW, state.mapH);
        await saveBlob(name, png);
      }
    } catch (err) {
      console.error(err);
      toast(Carto.Svg.esc(t('ui.error')));
    }
  }

  function copyLink() {
    const url = location.href.split('#')[0] + buildHash(state.gen, state.seed, state.opts);
    const manual = () => toast(Carto.Svg.esc(t('ui.linkManual')) + '<input readonly value="' + Carto.Svg.esc(url) + '">', 8000);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => toast(Carto.Svg.esc(t('ui.linkCopied'))), manual);
    } else manual();
  }

  // ----------------------------------------------------------------- routing
  function route() {
    const r = parseHash();
    if (!r.gen) {
      els.gen.hidden = true;
      els.hub.hidden = false;
      document.title = t('brand');
      markTabs();
      if (!els.cards.children.length) buildHub();
      renderAllPreviews(false);
      return;
    }
    const sameGen = state.gen === r.gen && !els.gen.hidden;
    els.hub.hidden = true;
    els.gen.hidden = false;
    state.gen = r.gen;
    state.opts = r.opts;
    state.seed = r.seed || Carto.randomSeed();
    document.title = t('gen.' + r.gen.id + '.name') + ' · ' + t('brand');
    markTabs();
    buildPanel();
    regenerate(false);
    updateHash();
    if (!sameGen) window.scrollTo(0, 0);
  }

  function applyLang() {
    document.documentElement.lang = I18n.lang;
    I18n.apply(document);
    els.langIt.setAttribute('aria-pressed', String(I18n.lang === 'it'));
    els.langEn.setAttribute('aria-pressed', String(I18n.lang === 'en'));
    els.tabs.setAttribute('aria-label', t('nav.all'));
  }

  Carto.start = function () {
    els = {
      hub: $('view-hub'), gen: $('view-gen'), cards: $('cards'), tabs: $('tabs'),
      title: $('gen-title'), desc: $('gen-desc'), seed: $('seed-input'), seedForm: $('seed-form'),
      options: $('options'), palettes: $('palettes'), notes: $('notes'), notesSection: $('notes-section'),
      viewport: $('viewport'), zoomIn: $('zoom-in'), zoomOut: $('zoom-out'), zoomFit: $('zoom-fit'),
      toast: $('toast'), link: $('btn-link'), langIt: $('lang-it'), langEn: $('lang-en'),
      overlay: $('save-overlay'), overlayImg: $('save-overlay-img'), overlayClose: $('save-overlay-close'),
      inspector: $('inspector'), inspectorBody: $('inspector-body'),
    };
    $('inspector-close').addEventListener('click', hideInspector);
    wireActions(els.inspectorBody);
    wireActions(els.notes);
    els.inspectorBody.addEventListener('click', (e) => { if (e.target.closest('a')) hideInspector(); });
    applyLang();
    buildTabs();
    setupPanZoom();

    $('btn-new').addEventListener('click', () => setSeed(Carto.randomSeed()));
    $('stage-new').addEventListener('click', () => setSeed(Carto.randomSeed()));
    els.seedForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = els.seed.value.trim();
      if (!raw) return;
      setSeed(/^\d+$/.test(raw) ? parseInt(raw, 10) : Carto.hashString(raw));
    });
    $('btn-png').addEventListener('click', () => exportAs('png'));
    $('btn-svg').addEventListener('click', () => exportAs('svg'));
    els.link.addEventListener('click', copyLink);
    els.overlayClose.addEventListener('click', () => {
      els.overlay.hidden = true;
      URL.revokeObjectURL(els.overlayImg.src);
    });
    [els.langIt, els.langEn].forEach((b) => b.addEventListener('click', () => I18n.set(b.dataset.lang)));

    I18n.onChange(() => {
      applyLang();
      buildTabs();
      if (els.cards.children.length) { hubTexts(); if (!els.hub.hidden) renderAllPreviews(false); }
      if (!els.gen.hidden && state.gen) {
        buildPanel();
        renderMap(true);
        document.title = t('gen.' + state.gen.id + '.name') + ' · ' + t('brand');
      } else document.title = t('brand');
    });

    document.addEventListener('keydown', (e) => {
      if (els.gen.hidden) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'Escape' && state.pick) {
        state.pick = null;
        els.viewport.classList.remove('picking');
        els.toast.hidden = true;
        return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z') && state.gen && state.gen.act) {
        e.preventDefault();
        runAction({ act: 'undo' });
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'n' || e.key === 'N') setSeed(Carto.randomSeed());
      else if (e.key === '+' || e.key === '=') els.zoomIn.click();
      else if (e.key === '-') els.zoomOut.click();
      else if (e.key === '0') fit();
    });

    window.addEventListener('hashchange', route);
    downloadsCapability();
    route();
  };
})(window.Carto = window.Carto || {});
