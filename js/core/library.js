/* The saves page, the sync account box and the install prompt. */
(function (Carto) {
  'use strict';

  const I18n = Carto.I18n, t = Carto.t;
  const esc = (s) => Carto.Svg.esc(s);
  const Saves = Carto.Saves;

  I18n.add({
    it: {
      'saves.title': 'I miei salvataggi',
      'saves.nav': 'Salvataggi',
      'saves.lede': 'Le mappe che salvi restano su questo dispositivo e, se la sincronizzazione è attiva, su tutti i tuoi dispositivi: iPhone, iPad e computer.',
      'saves.section': 'Salvataggio',
      'saves.save': 'Salva nella libreria',
      'saves.saved': 'Salvata · aggiorna',
      'saves.savedToast': 'Mappa salvata',
      'saves.updatedToast': 'Salvataggio aggiornato',
      'saves.open': 'Apri la libreria',
      'saves.autosave': 'Le modifiche a questa mappa si salvano da sole.',
      'saves.notSaved': 'Questa mappa non è ancora salvata.',
      'saves.empty': 'Nessun salvataggio. Apri un generatore e premi «Salva nella libreria».',
      'saves.openMap': 'Apri',
      'saves.rename': 'Rinomina',
      'saves.delete': 'Elimina',
      'saves.deleteConfirm': 'Conferma eliminazione',
      'saves.exportOne': 'Esporta',
      'saves.exportAll': 'Esporta tutto',
      'saves.import': 'Importa',
      'saves.imported': 'Importati {n} salvataggi',
      'saves.badFile': 'Il file non contiene salvataggi validi.',
      'saves.edited': 'con modifiche',
      'saves.seed': 'seme {n}',
      'saves.local': 'Solo su questo dispositivo',
      'saves.localHint': 'Per avere gli stessi salvataggi su iPhone e PC, attiva la sincronizzazione qui sotto, oppure usa l’app dentro Claude, dove è automatica.',
      'saves.claude': 'Sincronizzati con il tuo account Claude',
      'saves.claudeHint': 'Apri questa pagina da Claude su iPhone, iPad o computer: trovi gli stessi salvataggi.',
      'saves.supabase': 'Sincronizzati come {user}',
      'saves.signedOut': 'Sincronizzazione: accedi',
      'saves.syncing': 'Sincronizzazione in corso…',
      'saves.synced': 'Tutto sincronizzato',
      'saves.syncError': 'Sincronizzazione non riuscita: {e}. Riprovo quando torni online.',
      'saves.syncNow': 'Sincronizza ora',
      'saves.setup': 'Attiva la sincronizzazione',
      'saves.setupHint': 'Serve un progetto Supabase gratuito: la guida è nel README del progetto (5 minuti). Incolla qui l’indirizzo del progetto e la chiave pubblica “anon”.',
      'saves.url': 'Indirizzo del progetto (URL)',
      'saves.key': 'Chiave pubblica (anon key)',
      'saves.connect': 'Collega',
      'saves.disconnect': 'Scollega questo dispositivo',
      'saves.email': 'Email',
      'saves.password': 'Password',
      'saves.signIn': 'Accedi',
      'saves.signUp': 'Crea account',
      'saves.signOut': 'Esci',
      'saves.checkMail': 'Account creato. Conferma l’indirizzo dalla email che hai ricevuto, poi accedi.',
      'saves.authError': 'Accesso non riuscito: {e}',
      'install.title': 'Installa Il Cartografo Errante',
      'install.pc': 'Installa l’app sul computer: si apre nella sua finestra e funziona anche senza connessione.',
      'install.button': 'Installa l’app',
      'install.ios': 'Su iPhone e iPad: tocca Condividi, poi «Aggiungi alla schermata Home».',
      'install.dismiss': 'Non ora',
    },
    en: {
      'saves.title': 'My saves',
      'saves.nav': 'Saves',
      'saves.lede': 'Maps you save stay on this device and, when sync is on, on all your devices: iPhone, iPad and computer.',
      'saves.section': 'Saving',
      'saves.save': 'Save to library',
      'saves.saved': 'Saved · update',
      'saves.savedToast': 'Map saved',
      'saves.updatedToast': 'Save updated',
      'saves.open': 'Open the library',
      'saves.autosave': 'Changes to this map are saved automatically.',
      'saves.notSaved': 'This map is not saved yet.',
      'saves.empty': 'No saves yet. Open a generator and press “Save to library”.',
      'saves.openMap': 'Open',
      'saves.rename': 'Rename',
      'saves.delete': 'Delete',
      'saves.deleteConfirm': 'Confirm delete',
      'saves.exportOne': 'Export',
      'saves.exportAll': 'Export all',
      'saves.import': 'Import',
      'saves.imported': 'Imported {n} saves',
      'saves.badFile': 'The file holds no valid saves.',
      'saves.edited': 'with edits',
      'saves.seed': 'seed {n}',
      'saves.local': 'On this device only',
      'saves.localHint': 'To have the same saves on iPhone and PC, turn on sync below, or use the app inside Claude, where it is automatic.',
      'saves.claude': 'Synced with your Claude account',
      'saves.claudeHint': 'Open this page from Claude on iPhone, iPad or computer: you will find the same saves.',
      'saves.supabase': 'Synced as {user}',
      'saves.signedOut': 'Sync: sign in',
      'saves.syncing': 'Syncing…',
      'saves.synced': 'Everything is in sync',
      'saves.syncError': 'Sync failed: {e}. It will retry when you are back online.',
      'saves.syncNow': 'Sync now',
      'saves.setup': 'Turn on sync',
      'saves.setupHint': 'It needs a free Supabase project: the guide is in the project README (5 minutes). Paste the project URL and the public “anon” key here.',
      'saves.url': 'Project URL',
      'saves.key': 'Public key (anon key)',
      'saves.connect': 'Connect',
      'saves.disconnect': 'Disconnect this device',
      'saves.email': 'Email',
      'saves.password': 'Password',
      'saves.signIn': 'Sign in',
      'saves.signUp': 'Create account',
      'saves.signOut': 'Sign out',
      'saves.checkMail': 'Account created. Confirm your address from the email you received, then sign in.',
      'saves.authError': 'Sign-in failed: {e}',
      'install.title': 'Install The Wandering Cartographer',
      'install.pc': 'Install the app on your computer: it opens in its own window and works offline.',
      'install.button': 'Install the app',
      'install.ios': 'On iPhone and iPad: tap Share, then “Add to Home Screen”.',
      'install.dismiss': 'Not now',
    },
  });

  const $ = (id) => document.getElementById(id);
  const fmtDate = (ms) => new Date(ms).toLocaleString(I18n.lang, { dateStyle: 'medium', timeStyle: 'short' });
  const framed = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

  // -------------------------------------------------------------- sync box

  function syncBox() {
    const st = Saves.status;
    const cfg = Saves.supabase.config();
    let chip, hint = '', body = '';
    if (st.kind === 'claude') {
      chip = t('saves.claude');
      hint = t('saves.claudeHint');
    } else if (st.kind === 'supabase' && st.state !== 'signedout' && st.user) {
      chip = t('saves.supabase', { user: st.user });
      body = '<div class="export-row"><button class="btn" type="button" data-lib="sync">' + esc(t('saves.syncNow')) + '</button>' +
        '<button class="btn ghost" type="button" data-lib="signout">' + esc(t('saves.signOut')) + '</button></div>';
    } else if (cfg) {
      chip = t('saves.signedOut');
      body = '<form class="edit-col" data-lib="auth">' +
        '<label class="edit-field"><span>' + esc(t('saves.email')) + '</span><input name="email" type="email" autocomplete="email" required></label>' +
        '<label class="edit-field"><span>' + esc(t('saves.password')) + '</span><input name="password" type="password" autocomplete="current-password" minlength="6" required></label>' +
        '<div class="export-row"><button class="btn primary" type="submit" name="mode" value="in">' + esc(t('saves.signIn')) + '</button>' +
        '<button class="btn" type="submit" name="mode" value="up">' + esc(t('saves.signUp')) + '</button></div></form>' +
        (cfg.fixed ? '' : '<button class="btn ghost" type="button" data-lib="unconfig">' + esc(t('saves.disconnect')) + '</button>');
    } else {
      chip = t('saves.local');
      hint = t('saves.localHint');
      if (!framed || !window.claude) {
        body = '<details class="edit"><summary>' + esc(t('saves.setup')) + '</summary><p class="tag">' + esc(t('saves.setupHint')) + '</p>' +
          '<form class="edit-col" data-lib="config">' +
          '<label class="edit-field"><span>' + esc(t('saves.url')) + '</span><input name="url" type="url" placeholder="https://xxxx.supabase.co" required></label>' +
          '<label class="edit-field"><span>' + esc(t('saves.key')) + '</span><input name="key" required></label>' +
          '<button class="btn primary" type="submit">' + esc(t('saves.connect')) + '</button></form></details>';
      }
    }
    const stateLine = st.state === 'syncing' ? t('saves.syncing') : st.state === 'synced' ? t('saves.synced') : st.state === 'error' ? t('saves.syncError', { e: st.error || '?' }) : '';
    return '<div class="sync-chip sync-' + esc(st.kind) + '"><span class="dot"></span>' + esc(chip) + '</div>' +
      (stateLine ? '<p class="tag">' + esc(stateLine) + '</p>' : '') + (hint ? '<p class="muted">' + esc(hint) + '</p>' : '') + body;
  }

  // -------------------------------------------------------------- list

  function listHtml() {
    const all = Saves.list();
    if (!all.length) return '<p class="muted">' + esc(t('saves.empty')) + '</p>';
    return all.map((s) => '<article class="save-card" data-id="' + esc(s.id) + '">' +
      '<div class="save-main"><h3>' + esc(s.title || s.gen) + '</h3><p class="tag">' + esc(t('gen.' + s.gen + '.name')) + ' · ' + esc(t('saves.seed', { n: s.seed })) +
      (s.data ? ' · ' + esc(t('saves.edited')) : '') + ' · ' + esc(fmtDate(s.updated)) + '</p></div>' +
      '<div class="save-actions"><button class="btn primary" type="button" data-lib="open">' + esc(t('saves.openMap')) + '</button>' +
      '<details class="save-more"><summary class="btn ghost">⋯</summary><div class="save-menu">' +
      '<form class="edit-row" data-lib="rename"><label class="edit-field"><span>' + esc(t('saves.rename')) + '</span><input name="title" value="' + esc(s.title || '') + '" maxlength="80" required></label>' +
      '<button class="btn" type="submit">' + esc(t('edit.save')) + '</button></form>' +
      '<div class="export-row"><button class="btn" type="button" data-lib="export">' + esc(t('saves.exportOne')) + '</button>' +
      '<button class="btn ghost danger" type="button" data-lib="delete">' + esc(t('saves.delete')) + '</button></div></div></details></div></article>').join('');
  }

  function render() {
    const box = $('lib-sync'), list = $('lib-list');
    if (box) box.innerHTML = syncBox();
    if (list) list.innerHTML = listHtml();
    updateBadge();
  }

  function updateBadge() {
    const b = $('saves-count');
    if (b) {
      const n = Saves.list().length;
      b.textContent = n ? String(n) : '';
      b.hidden = !n;
    }
  }

  // -------------------------------------------------------------- events

  function wire() {
    const root = $('view-saves');
    root.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-lib]');
      if (!btn || btn.tagName === 'FORM') return;
      const card = btn.closest('.save-card');
      const id = card && card.dataset.id;
      switch (btn.dataset.lib) {
        case 'open': { const s = Saves.get(id); if (s) Carto.App.openSave(s); break; }
        case 'delete':
          if (!btn.dataset.confirmed) { btn.dataset.confirmed = '1'; btn.textContent = t('saves.deleteConfirm'); return; }
          Saves.remove(id);
          break;
        case 'export': {
          const s = Saves.get(id);
          if (s) Carto.App.saveBlob((s.title || s.gen).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.json', new Blob([JSON.stringify({ app: 'il-cartografo-errante', version: 1, saves: [s] }, null, 1)], { type: 'application/json' }));
          break;
        }
        case 'export-all':
          Carto.App.saveBlob('cartografo-salvataggi.json', new Blob([Saves.exportJSON()], { type: 'application/json' }));
          break;
        case 'sync': Saves.sync(); break;
        case 'signout': Saves.supabase.signOut(); break;
        case 'unconfig': Saves.supabase.clearConfig(); break;
      }
    });
    root.addEventListener('submit', async (e) => {
      const form = e.target.closest('form[data-lib]');
      if (!form) return;
      e.preventDefault();
      const fd = new FormData(form);
      const card = form.closest('.save-card');
      try {
        if (form.dataset.lib === 'rename') Saves.patch(card.dataset.id, { title: String(fd.get('title')).trim() });
        else if (form.dataset.lib === 'config') await Saves.supabase.setConfig(String(fd.get('url')), String(fd.get('key')));
        else if (form.dataset.lib === 'auth') {
          const mode = e.submitter && e.submitter.value;
          if (mode === 'up') {
            const live = await Saves.supabase.signUp(String(fd.get('email')), String(fd.get('password')));
            if (!live) Carto.App.toast(t('saves.checkMail'), 8000);
          } else await Saves.supabase.signIn(String(fd.get('email')), String(fd.get('password')));
        }
      } catch (err) {
        Carto.App.toast(t('saves.authError', { e: err && (err.message || err.code) || '?' }), 6000);
      }
    });
    root.addEventListener('change', (e) => {
      const el = e.target;
      if (el.dataset.lib !== 'import' || !el.files || !el.files[0]) return;
      el.files[0].text().then((text) => {
        let n = 0;
        try { n = Saves.importJSON(text); } catch (err) { n = 0; }
        Carto.App.toast(n ? t('saves.imported', { n }) : t('saves.badFile'));
      });
      el.value = '';
    });
    Saves.onChange(() => {
      if (!root.hidden) render();
      else updateBadge();
      Carto.App.refreshSaveState();
    });
  }

  // -------------------------------------------------------------- install

  let deferredPrompt = null;
  const standalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const dismissed = () => { try { return localStorage.getItem('carto.install.dismissed') === '1'; } catch (e) { return false; } };

  function renderInstall() {
    const box = $('install');
    if (!box) return;
    if (framed || standalone() || dismissed() || location.protocol === 'file:') { box.hidden = true; return; }
    let body = '';
    if (deferredPrompt) body = '<p>' + esc(t('install.pc')) + '</p><div class="export-row"><button class="btn primary" type="button" id="install-go">' + esc(t('install.button')) + '</button>';
    else if (isIOS()) body = '<p>' + esc(t('install.ios')) + '</p><div class="export-row">';
    else { box.hidden = true; return; }
    box.innerHTML = '<div><strong>' + esc(t('install.title')) + '</strong>' + body +
      '<button class="btn ghost" type="button" id="install-no">' + esc(t('install.dismiss')) + '</button></div></div>';
    box.hidden = false;
    const go = $('install-go');
    if (go) go.addEventListener('click', async () => {
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch (e) { /* ignore */ }
      deferredPrompt = null;
      renderInstall();
    });
    $('install-no').addEventListener('click', () => {
      try { localStorage.setItem('carto.install.dismissed', '1'); } catch (e) { /* ignore */ }
      box.hidden = true;
    });
  }

  if (typeof window.addEventListener === 'function') {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      renderInstall();
    });
    window.addEventListener('appinstalled', () => { deferredPrompt = null; renderInstall(); });
  }

  Carto.Library = {
    render,
    renderInstall,
    start() {
      wire();
      updateBadge();
      renderInstall();
      I18n.onChange(() => { if (!$('view-saves').hidden) render(); renderInstall(); });
      Saves.connect();
    },
  };
})(window.Carto = window.Carto || {});
