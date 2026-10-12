// Runs every generator over many seeds and option sets, outside the browser.
// Usage: node tools/smoke.js [count] [generatorId]   (writes sample SVGs to tools/out/)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
global.window = global;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]).filter((s) => !s.endsWith('main.js'));
for (const s of scripts) {
  const file = path.join(root, s);
  if (!fs.existsSync(file)) { console.warn('missing', s); continue; }
  vm.runInThisContext(fs.readFileSync(file, 'utf8'), { filename: s });
}

const count = parseInt(process.argv[2] || '30', 10);
const only = process.argv[3];
const outDir = path.join(__dirname, 'out');
fs.mkdirSync(outDir, { recursive: true });

function variants(gen) {
  const base = {};
  for (const o of gen.options) base[o.id] = o.def;
  const list = [base];
  for (const o of gen.options) {
    if (o.type === 'select') for (const v of o.values) if (v !== o.def) list.push(Object.assign({}, base, { [o.id]: v }));
    if (o.type === 'bool') list.push(Object.assign({}, base, { [o.id]: !o.def }));
  }
  return list;
}

// Minimum expectations, so a generator that silently produces empty maps fails too.
const checks = {
  world: (m) => m.burgs.length > 10 && m.states.length > 2 && m.rivers.length > 0,
  city: (m) => m.buildingCount > 60 && m.wards.length > 10,
  dungeon: (m) => m.rooms.length >= 5,
  realm: (m) => m.settlements.length >= 3 && m.coast.length > 0,
  village: (m) => m.houses.length >= (m.size === 'hamlet' ? 5 : 15),
  cave: (m) => m.chambers.length >= 3 && m.outline.length > 0,
  dwelling: (m) => m.floors.length >= 1 && m.floors.every((f) => f.rooms.length >= 2),
};

let failures = 0;
for (const gen of Carto.generators) {
  if (only && gen.id !== only) continue;
  const vs = variants(gen);
  let time = 0, runs = 0, maxT = 0;
  for (let i = 1; i <= count; i++) {
    const opts = vs[i % vs.length];
    const seed = i * (parseInt(process.env.SEED_STEP, 10) || 7919);
    try {
      const t0 = Date.now();
      const model = gen.generate(seed, opts);
      const svg = gen.render(model, Object.assign({ palette: Carto.Palettes.parchment }, opts));
      if (gen.notes) gen.notes(model, opts);
      const dt = Date.now() - t0;
      time += dt; runs++; maxT = Math.max(maxT, dt);
      if (!/^<svg[\s\S]*<\/svg>$/.test(svg) || /NaN|undefined/.test(svg)) throw new Error('bad svg output');
      if (checks[gen.id] && !checks[gen.id](model)) throw new Error('map below expectations');
      if (i <= 3) fs.writeFileSync(path.join(outDir, `${gen.id}-${i}.svg`), svg);
    } catch (e) {
      failures++;
      console.error(`FAIL ${gen.id} seed=${seed} opts=${JSON.stringify(opts)}\n  ${e.stack.split('\n').slice(0, 4).join('\n  ')}`);
    }
  }
  console.log(`${gen.id}: ${runs}/${count} ok, avg ${(time / Math.max(1, runs)).toFixed(0)} ms, max ${maxT} ms`);
}
process.exit(failures ? 1 : 0);
