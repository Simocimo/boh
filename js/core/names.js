/* Fantasy proper names from a small Markov chain trained on invented names. */
(function (Carto) {
  'use strict';

  const CORPUS = {
    place: (
      'Aberon Adravel Aldmere Almora Amberlin Andovar Arvenna Balthorn Belcaris Beldora Bramavel ' +
      'Brennos Calmora Carvassa Castelmor Cendrill Corvanne Dallimor Darvesh Delmoran Doravel Dunmara ' +
      'Duskwold Edrassa Elvaran Emberwick Erathil Esmora Falcroft Fendral Feravin Galdrin Garmoth ' +
      'Glenmora Gorvath Halvenn Harrowdel Ilvarra Isembar Jhessil Kaldris Karveth Kelmora Korrin ' +
      'Lathmor Lindavar Lorvane Lyssara Maldren Marrowind Melkoth Mirvanna Morvayne Nalmora Nerevan ' +
      'Norwick Olvara Orvessa Ostrell Palavar Pellinor Quarvell Ravenmoor Redmara Rhovane Rivenna ' +
      'Saldrith Selmara Seravin Sorvath Talmora Tarvessa Tessarin Thalvara Thornwick Tyrella Ulvenna ' +
      'Umbrath Valdris Valmora Varneth Velloran Veridan Vesmara Wendrel Westmarrow Wyrmhold Xandris ' +
      'Yarvell Yssandre Zaravel Zelmora Zorvan Ambrosel Bellacqua Cardovel Fiorvane Montarel ' +
      'Pietravel Roccaldi Santoren Torrevan Valsorra Borgamel Castrena Lunaverde Serravalle Ombrino'
    ).split(' '),
    person: (
      'Aldric Amara Belen Brannoc Caelith Corwen Dagny Darian Edric Elowen Erevan Faelan Galen ' +
      'Gwendal Halvard Idris Isolde Jorah Kaelen Lirien Lucan Maelis Merrow Nerys Orsin Perrin ' +
      'Quillon Rhoswen Saelith Seren Talia Tamsin Theron Ulric Varra Vesna Wynn Yorick Zarek ' +
      'Ottavio Ilaria Corrado Benedetta Ruggero Fiammetta Tancredi Viviana Leandro Ginevra'
    ).split(' '),
  };

  class Markov {
    constructor(words, order = 2) {
      this.order = order;
      this.table = new Map();
      this.words = new Set(words.map((w) => w.toLowerCase()));
      for (const w of words) {
        const s = '^'.repeat(order) + w.toLowerCase() + '$';
        for (let i = 0; i + order < s.length; i++) {
          const key = s.substr(i, order);
          if (!this.table.has(key)) this.table.set(key, []);
          this.table.get(key).push(s[i + order]);
        }
      }
    }

    generate(rng, min = 4, max = 10) {
      for (let attempt = 0; attempt < 60; attempt++) {
        let key = '^'.repeat(this.order), out = '';
        for (;;) {
          const opts = this.table.get(key);
          if (!opts) break;
          const ch = rng.pick(opts);
          if (ch === '$') break;
          out += ch;
          key = (key + ch).substr(1);
          if (out.length > max) break;
        }
        if (out.length >= min && out.length <= max && !this.words.has(out) && !/(.)\1\1/.test(out)) {
          return out.charAt(0).toUpperCase() + out.slice(1);
        }
      }
      return rng.pick(Array.from(this.words)).replace(/^./, (c) => c.toUpperCase());
    }
  }

  const chains = {};
  const chain = (kind) => chains[kind] || (chains[kind] = new Markov(CORPUS[kind] || CORPUS.place));

  Carto.Names = {
    markov: (words, order = 2) => new Markov(words, order),
    place: (rng) => chain('place').generate(rng, 5, 10),
    person: (rng) => chain('person').generate(rng, 4, 8),
    // A set of distinct names.
    unique: (rng, count, kind = 'place') => {
      const seen = new Set(), out = [];
      let guard = 0;
      while (out.length < count && guard++ < count * 20) {
        const n = kind === 'person' ? Carto.Names.person(rng) : Carto.Names.place(rng);
        if (!seen.has(n)) { seen.add(n); out.push(n); }
      }
      return out;
    },
  };
})(window.Carto = window.Carto || {});
