/* Seeded pseudo-random numbers. Every map is a pure function of its seed. */
(function (Carto) {
  'use strict';

  // Hash any string into a 32-bit unsigned integer (cyrb53, truncated).
  function hashString(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h1 ^ h2) >>> 0;
  }

  class Random {
    constructor(seed) {
      this.seed = (typeof seed === 'string' ? hashString(seed) : seed >>> 0) || 1;
      this.state = this.seed;
    }

    // mulberry32
    next() {
      let t = (this.state = (this.state + 0x6d2b79f5) >>> 0);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    float(min = 0, max = 1) { return min + (max - min) * this.next(); }

    // Integer in [min, max] (inclusive).
    int(min, max) { return min + Math.floor(this.next() * (max - min + 1)); }

    bool(p = 0.5) { return this.next() < p; }

    sign() { return this.next() < 0.5 ? -1 : 1; }

    pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }

    // pairs: [[value, weight], ...]
    weighted(pairs) {
      let total = 0;
      for (const p of pairs) total += p[1];
      let r = this.next() * total;
      for (const p of pairs) {
        r -= p[1];
        if (r <= 0) return p[0];
      }
      return pairs[pairs.length - 1][0];
    }

    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(this.next() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }

    // Bell-shaped value in [0, 1], mean 0.5.
    bell(n = 3) {
      let s = 0;
      for (let i = 0; i < n; i++) s += this.next();
      return s / n;
    }

    // Approximately normal with the given mean and deviation.
    gauss(mean = 0, dev = 1) {
      const u = 1 - this.next(), v = this.next();
      return mean + dev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    // Independent stream derived from this seed and a label, so that changing
    // one part of a generator does not reshuffle every other part.
    fork(label) {
      return new Random(hashString(this.seed + ':' + label));
    }
  }

  Carto.Random = Random;
  Carto.hashString = hashString;
  Carto.randomSeed = function () {
    return 1 + Math.floor(Math.random() * 999999999);
  };
})(window.Carto = window.Carto || {});
