# Il Cartografo Errante

Generatori procedurali di mappe fantasy, ispirati a [Watabou's Procgen Arcana](https://watabou.github.io)
e ad [Azgaar's Fantasy Map Generator](https://azgaar.github.io/Fantasy-Map-Generator/).
Tutto gira nel browser: niente server, niente installazione, niente build.

| Generatore | Cosa disegna |
|---|---|
| **Mondo** | Interi continenti, ispirati a [Azgaar's Fantasy Map Generator](https://azgaar.github.io/Fantasy-Map-Generator/): rilievo da 7 modelli (continenti, Pangea, arcipelago, isola, mediterraneo, penisola, vulcano), clima, 13 biomi, fiumi e laghi, culture con lingue diverse, stati con forma di governo e diplomazia, province, religioni, città e porti, strade e rotte marittime, luoghi notevoli. Sei viste (politica, biomi, rilievo, culture, religioni, province), livelli attivabili e un ispettore: clicca un punto per leggerne clima, stato e cultura, clicca una città o un dungeon per aprirne la mappa. |
| **Regno** | Mappa regionale: coste, montagne, colline, foreste, fiumi che scendono al mare, laghi, insediamenti e strade. Clicca una città o un villaggio per aprirne la pianta. |
| **Città** | Borghi e città murate (diagramma di Voronoi): quartieri, porte, torri, cittadella, cattedrale, piazza del mercato, fiume con ponti, costa con porto, campagna. |
| **Villaggio** | Case lungo strade tortuose, piazza col pozzo, tempio, locanda, mulino sul ruscello, campi, frutteti e boschi. |
| **Caverna** | Grotte naturali con camere, gallerie, laghi sotterranei, stalagmiti e cristalli, oppure una **radura** nel bosco. |
| **Dungeon** | Sotterranei "su una pagina": stanze, corridoi, porte (anche segrete e chiuse a chiave), tratteggio della roccia e legenda delle stanze con mostri, tesori e trappole. |
| **Dimora** | Piante di edifici su più piani (casolari, case di città, locande, botteghe, ville) con porte, finestre, scale e arredi. |

## Come si usa

- **Nuova mappa** (o il tasto `N`) genera un luogo nuovo.
- Ogni mappa nasce da un **seme**: lo stesso seme con le stesse opzioni produce sempre la stessa mappa. Puoi scriverne uno a mano (anche una parola).
- L'indirizzo della pagina contiene seme e opzioni (`#city.12345.size-large`), quindi puoi salvarlo nei preferiti o condividerlo.
- Trascina per spostarti, usa la rotellina o il pizzico per lo zoom, doppio clic per ingrandire.
- **Esporta** in PNG (alta risoluzione) o in SVG vettoriale, modificabile con Inkscape o Illustrator. I font sono incorporati nel file.
- Quattro stili: Pergamena, Inchiostro (bianco e nero, ideale per la stampa), Notte, Cianografia.
- Interfaccia e testi generati in **italiano** e **inglese** (pulsanti IT/EN in alto).

Le mappe che generi sono tue: usale per giochi di ruolo, romanzi e campagne.

## Avviarlo

Apri `index.html` con un doppio clic: funziona anche senza connessione (serve internet solo per il font dell'interfaccia; senza, il browser usa un font di riserva).

### Pubblicarlo su GitHub Pages

1. Nel repository su GitHub apri **Settings → Pages**.
2. In *Build and deployment* scegli **Deploy from a branch**.
3. Seleziona il branch (per esempio `main`) e la cartella **/ (root)**, poi **Save**.
4. Dopo un minuto il sito è online su `https://<utente>.github.io/<repository>/`.

## Struttura

```
index.html            pagina unica: elenco dei generatori e banco di lavoro
css/style.css         stile dell'interfaccia (tema chiaro e scuro)
js/core/              libreria condivisa
  rng.js              numeri casuali con seme (mulberry32)
  noise.js            rumore simplex e frattale
  geom.js             geometria: poligoni, ritagli, campionamento di Poisson
  voronoi.js          triangolazione di Delaunay e diagramma di Voronoi
  delaunator.js       triangolazione veloce per decine di migliaia di punti (mondo)
  namebases.js        "lingue" per i nomi delle culture
  contour.js          marching squares, sfocatura, campi di distanza
  svg.js, draw.js     costruzione SVG, scritte, rosa dei venti, scala, alberi
  names.js            nomi fantasy con catene di Markov
  i18n.js             testi italiano / inglese
  palettes.js         stili delle mappe
  fonts.js            font IM FELL incorporati (generato)
  app.js              interfaccia: percorsi, opzioni, zoom, esportazione
js/gen/               un file per generatore
fonts/                font originali e relativa licenza (SIL OFL)
tools/                test e utilità per lo sviluppo
```

### Aggiungere un generatore

Ogni generatore è un file in `js/gen/` che si registra così:

```js
Carto.register({
  id: 'torre',                       // usato nell'indirizzo: #torre.123
  order: 7,                          // posizione nell'elenco
  options: [                         // diventano i controlli del pannello
    { id: 'piani', type: 'select', values: ['pochi', 'molti'], def: 'pochi' },
    { id: 'etichette', type: 'bool', def: true, renderOnly: true },
  ],
  generate(seed, opts) { /* restituisce il modello, senza toccare il DOM */ },
  render(model, opts)  { /* restituisce una stringa <svg>; opts.palette contiene i colori */ },
  notes(model)         { /* facoltativo: HTML per la legenda */ },
  inspect(model, x, y) { /* facoltativo: { html } per il clic sulla mappa */ },
  fileName(model)      { /* facoltativo: nome del file esportato */ },
});
```

Poi aggiungi lo `<script>` in `index.html` e i testi con `Carto.I18n.add({ it: {...}, en: {...} })`
(chiavi `gen.<id>.name`, `gen.<id>.desc`, `<id>.opt.<opzione>`, `<id>.opt.<opzione>.<valore>`).

### Sviluppo

```bash
node tools/smoke.js 50          # genera e disegna 50 mappe per generatore, segnala errori
node tools/smoke.js 50 city     # solo un generatore; alcuni SVG di esempio finiscono in tools/out/
node tools/build-fonts.js       # rigenera js/core/fonts.js dai file in fonts/
```

## Crediti

- Idea e stile ispirati ai generatori di Oleg Dolya ([watabou](https://watabou.github.io)) e al Fantasy Map Generator di Max Haniyeu ([Azgaar](https://github.com/Azgaar/Fantasy-Map-Generator)). Il codice di questo progetto è scritto da zero; la triangolazione veloce segue l'algoritmo della libreria Delaunator (Mapbox, licenza ISC).
- Font delle mappe: IM FELL English, di Igino Marini, con licenza SIL Open Font License (vedi `fonts/OFL.txt`).
- Font dell'interfaccia: Alegreya Sans, da Google Fonts.

---

**English summary.** *The Wandering Cartographer* is a set of procedural fantasy map generators
(world, realm, city, village, cave/glade, dungeon, dwelling) that run entirely in the browser. Open
`index.html`, press **New map**, tweak the options, and export to PNG or SVG. Seeds and options live
in the URL, so maps are reproducible and shareable. The interface and the generated text are
available in Italian and English.
