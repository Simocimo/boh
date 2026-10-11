/* Seeded 2D simplex noise and fractal sums. */
(function (Carto) {
  'use strict';

  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;
  const GRAD = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];

  class Noise {
    constructor(seed) {
      const rng = seed instanceof Carto.Random ? seed : new Carto.Random(seed);
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = Math.floor(rng.next() * (i + 1));
        const t = p[i]; p[i] = p[j]; p[j] = t;
      }
      this.perm = new Uint8Array(512);
      for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
    }

    // Simplex noise in [-1, 1].
    get(xin, yin) {
      const perm = this.perm;
      const s = (xin + yin) * F2;
      const i = Math.floor(xin + s), j = Math.floor(yin + s);
      const t = (i + j) * G2;
      const x0 = xin - (i - t), y0 = yin - (j - t);
      const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
      const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
      const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
      const ii = i & 255, jj = j & 255;
      let n = 0;
      let t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 > 0) {
        const g = GRAD[perm[ii + perm[jj]] & 7];
        t0 *= t0; n += t0 * t0 * (g[0] * x0 + g[1] * y0);
      }
      let t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 > 0) {
        const g = GRAD[perm[ii + i1 + perm[jj + j1]] & 7];
        t1 *= t1; n += t1 * t1 * (g[0] * x1 + g[1] * y1);
      }
      let t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 > 0) {
        const g = GRAD[perm[ii + 1 + perm[jj + 1]] & 7];
        t2 *= t2; n += t2 * t2 * (g[0] * x2 + g[1] * y2);
      }
      return 70 * n;
    }

    // Fractal Brownian motion, roughly in [-1, 1].
    fbm(x, y, octaves = 4, lacunarity = 2, gain = 0.5) {
      let sum = 0, amp = 1, norm = 0, freq = 1;
      for (let o = 0; o < octaves; o++) {
        sum += amp * this.get(x * freq + o * 17.31, y * freq - o * 9.77);
        norm += amp;
        amp *= gain;
        freq *= lacunarity;
      }
      return sum / norm;
    }

    // Ridged noise in [0, 1]: sharp crests, good for mountain chains.
    ridged(x, y, octaves = 4) {
      let sum = 0, amp = 1, norm = 0, freq = 1;
      for (let o = 0; o < octaves; o++) {
        const v = 1 - Math.abs(this.get(x * freq + o * 31.7, y * freq + o * 11.3));
        sum += amp * v * v;
        norm += amp;
        amp *= 0.5;
        freq *= 2;
      }
      return sum / norm;
    }
  }

  Carto.Noise = Noise;
})(window.Carto = window.Carto || {});
