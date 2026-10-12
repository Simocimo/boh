/* Saved maps, kept on this device and synchronised with a cloud backend when
   one is available: the Claude account (when the app runs as a claude.ai
   artifact) or Supabase (when configured in the installed app).

   A save is { id, gen, seed, opts, data?, title, updated, created } where
   `data` holds generator state such as the world edits. Deletions are kept
   as tombstones so they propagate between devices. */
(function (Carto) {
  'use strict';

  const LOCAL_KEY = 'carto.saves';
  const SUPA_KEY = 'carto.supabase';
  const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
  const TOMBSTONE_DAYS = 30;

  const listeners = [];
  let remote = null; // active cloud backend
  let status = { kind: 'local', state: 'idle', user: null, error: null };

  // ------------------------------------------------------------- local cache

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function writeLocal(map) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(map)); } catch (e) { /* storage full or blocked */ }
  }
  const emit = () => listeners.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });

  const uid = () => Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);

  // ------------------------------------------------------------- backends

  // claude.ai: the artifact's own database, private per person.
  async function claudeBackend() {
    if (!window.claude || typeof window.claude.use !== 'function') return null;
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    if (!db || !user) return null;
    const id = await user.id();
    if (!id) return null;
    const coll = db.collection('data/users/' + id);
    let me = null;
    try { const p = await user.me(); me = p && (p.name || null); } catch (e) { /* name is optional */ }
    return {
      kind: 'claude',
      user: me,
      async list() {
        const snap = await coll.get();
        return snap.docs.filter((d) => d.exists).map((d) => Object.assign({}, d.data()));
      },
      put: (s) => coll.doc(s.id).set(JSON.parse(JSON.stringify(s))),
      remove: (id2) => coll.doc(id2).delete(),
      subscribe(cb) {
        return coll.onSnapshot((snap) => cb(snap.docs.filter((d) => d.exists).map((d) => Object.assign({}, d.data()))), () => {});
      },
    };
  }

  // Supabase: email + password accounts, one row per save.
  function supaConfig() {
    const fixed = Carto.Config || {};
    if (fixed.supabaseUrl && fixed.supabaseKey) return { url: fixed.supabaseUrl, key: fixed.supabaseKey, fixed: true };
    try {
      const c = JSON.parse(localStorage.getItem(SUPA_KEY) || 'null');
      return c && c.url && c.key ? c : null;
    } catch (e) { return null; }
  }
  let supaClient = null;
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error('script'));
      document.head.appendChild(s);
    });
  }
  async function supaClientGet() {
    const cfg = supaConfig();
    if (!cfg) return null;
    if (supaClient) return supaClient;
    if (!window.supabase) await loadScript(SUPABASE_JS);
    supaClient = window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: true, autoRefreshToken: true } });
    supaClient.auth.onAuthStateChange(() => connect());
    return supaClient;
  }
  async function supabaseBackend() {
    const client = await supaClientGet();
    if (!client) return null;
    const { data } = await client.auth.getSession();
    const session = data && data.session;
    if (!session) { status = { kind: 'supabase', state: 'signedout', user: null, error: null }; return null; }
    const userId = session.user.id;
    const check = (res) => { if (res.error) throw res.error; return res.data; };
    return {
      kind: 'supabase',
      user: session.user.email,
      async list() {
        const rows = check(await client.from('saves').select('id,data,updated'));
        return rows.map((r) => Object.assign({}, r.data, { id: r.id, updated: Number(r.updated) }));
      },
      async put(s) { check(await client.from('saves').upsert({ id: s.id, user_id: userId, data: s, updated: s.updated }, { onConflict: 'user_id,id' })); },
      async remove(id) { check(await client.from('saves').delete().eq('id', id)); },
      subscribe: null,
    };
  }

  // ------------------------------------------------------------- sync

  let unsub = null;
  let syncing = null;

  function merge(remoteList) {
    const local = readLocal();
    const toPush = [];
    const byId = new Map(remoteList.map((s) => [s.id, s]));
    for (const [id, r] of byId) {
      const l = local[id];
      if (!l || (r.updated || 0) > (l.updated || 0)) local[id] = r;
    }
    for (const [id, l] of Object.entries(local)) {
      const r = byId.get(id);
      if (!r || (l.updated || 0) > (r.updated || 0)) toPush.push(l);
    }
    // Forget old tombstones.
    const cutoff = Date.now() - TOMBSTONE_DAYS * 864e5;
    for (const [id, s] of Object.entries(local)) if (s.deleted && s.updated < cutoff) delete local[id];
    writeLocal(local);
    return toPush;
  }

  async function sync() {
    if (!remote) return;
    if (syncing) return syncing;
    syncing = (async () => {
      status.state = 'syncing';
      emit();
      try {
        const list = await remote.list();
        const push = merge(list);
        for (const s of push) await remote.put(s);
        status.state = 'synced';
        status.error = null;
      } catch (e) {
        console.error(e);
        status.state = 'error';
        status.error = String(e && (e.message || e.code) || e);
      }
      emit();
    })();
    try { await syncing; } finally { syncing = null; }
  }

  async function connect() {
    if (unsub) { try { unsub(); } catch (e) { /* ignore */ } unsub = null; }
    remote = null;
    status = { kind: supaConfig() ? 'supabase' : 'local', state: 'idle', user: null, error: null };
    try {
      remote = (await claudeBackend()) || (await supabaseBackend());
    } catch (e) {
      console.error(e);
      status = { kind: supaConfig() ? 'supabase' : 'local', state: 'error', user: null, error: String(e.message || e) };
      emit();
      return;
    }
    if (!remote) {
      if (supaConfig()) status.state = 'signedout';
      emit();
      return;
    }
    status = { kind: remote.kind, state: 'syncing', user: remote.user, error: null };
    emit();
    await sync();
    if (remote.subscribe) {
      unsub = remote.subscribe((list) => {
        const push = merge(list);
        if (push.length) sync();
        else emit();
      });
    }
  }

  // ------------------------------------------------------------- public API

  const Saves = {
    get status() { return status; },
    onChange(fn) { listeners.push(fn); },
    list() {
      return Object.values(readLocal()).filter((s) => !s.deleted).sort((a, b) => b.updated - a.updated);
    },
    get(id) {
      const s = readLocal()[id];
      return s && !s.deleted ? s : null;
    },
    put(save) {
      const local = readLocal();
      const now = Date.now();
      const s = Object.assign({}, save, { id: save.id || uid(), updated: now, created: save.created || now });
      local[s.id] = s;
      writeLocal(local);
      emit();
      if (remote) remote.put(s).catch(() => { status.state = 'error'; emit(); });
      return s;
    },
    patch(id, fields) {
      const cur = readLocal()[id];
      if (!cur || cur.deleted) return null;
      return Saves.put(Object.assign({}, cur, fields));
    },
    remove(id) {
      const local = readLocal();
      if (!local[id]) return;
      local[id] = { id, deleted: true, updated: Date.now() };
      writeLocal(local);
      emit();
      if (remote) remote.put(local[id]).catch(() => { status.state = 'error'; emit(); });
    },
    // Accepts a single save, a list, or an exported bundle.
    importJSON(text) {
      const data = JSON.parse(text);
      const items = Array.isArray(data) ? data : data && data.saves ? data.saves : data && data.generator === 'world' ? [{ gen: 'world', seed: data.seed, opts: data.opts, data: data.edits, title: 'Import' }] : [data];
      let n = 0;
      for (const it of items) {
        if (!it || !it.gen || !it.seed) continue;
        Saves.put({ gen: it.gen, seed: it.seed, opts: it.opts || {}, data: it.data || null, title: it.title || it.gen });
        n++;
      }
      return n;
    },
    exportJSON() {
      return JSON.stringify({ app: 'il-cartografo-errante', version: 1, saves: Saves.list() }, null, 1);
    },
    sync,
    connect,
    // Supabase account handling for the installed app.
    supabase: {
      config: supaConfig,
      setConfig(url, key) {
        try { localStorage.setItem(SUPA_KEY, JSON.stringify({ url: url.trim(), key: key.trim() })); } catch (e) { /* ignore */ }
        supaClient = null;
        return connect();
      },
      clearConfig() {
        try { localStorage.removeItem(SUPA_KEY); } catch (e) { /* ignore */ }
        supaClient = null;
        return connect();
      },
      async signIn(email, password) {
        const c = await supaClientGet();
        const res = await c.auth.signInWithPassword({ email, password });
        if (res.error) throw res.error;
        await connect();
      },
      async signUp(email, password) {
        const c = await supaClientGet();
        const res = await c.auth.signUp({ email, password });
        if (res.error) throw res.error;
        await connect();
        return !!(res.data && res.data.session);
      },
      async signOut() {
        const c = await supaClientGet();
        if (c) await c.auth.signOut();
        await connect();
      },
    },
  };

  // Keep devices in step when the app comes back to the foreground.
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
    window.addEventListener('online', () => sync());
  }

  Carto.Saves = Saves;
})(window.Carto = window.Carto || {});
