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

## Modificare il Mondo

Clicca un punto della mappa del Mondo: nell'ispettore trovi, oltre alle informazioni, i moduli per modificare.

- **Rinominare** stati, città, province, culture, religioni, fiumi, mari, laghi, luoghi notevoli e il mondo stesso.
- **Ricolorare** stati, province, culture e religioni; cambiare la **forma di governo** (Regno, Impero, Repubblica…).
- **Spostare i confini**: "Assegna questa zona a" passa un'area (con il raggio scelto) a un altro stato o alle terre libere.
- **Città**: aggiungerne una nel punto cliccato, spostarla, eliminarla, cambiarne gli abitanti o renderla un porto.
- **Luoghi notevoli**: aggiungerli, spostarli, eliminarli e riscriverne la descrizione.
- **Note dell'autore** su città, stati e luoghi: storia, personaggi, segreti.

Le modifiche si salvano da sole nel browser, legate a quella mappa (seme e opzioni). `Ctrl+Z` annulla l'ultima.
Nella legenda trovi **Esporta progetto** (un file JSON con seme, opzioni e modifiche) e **Importa progetto**:
usali per conservare il lavoro, spostarlo su un altro computer o condividerlo.

## Modelli 3D (Blender)

Nel Mondo e nel Regno il pulsante **Modello 3D (Blender)** scarica uno ZIP con:

- `heightmap.png`: le altitudini in scala di grigi a **16 bit** (65 536 livelli, nessuno scalino);
- `texture.png`: i colori del terreno senza scritte (biomi nel Mondo, fasce d'altitudine nel Regno);
- `mappa.png`: la mappa così come la vedi;
- `crea-plastico.py`: uno script che in **Blender** costruisce il plastico con mare, sole e camera;
- `LEGGIMI.txt`: le istruzioni.

In Blender (3.0 o successivo): estrai lo ZIP, scheda **Scripting** → *Text → Open* → `crea-plastico.py` →
**Run Script**, poi `F12` per il render. In cima allo script puoi cambiare l'altezza del rilievo, la texture e il mare.
La heightmap si importa anche in Unity, Unreal, Godot, Gaea e World Machine.

## App per iPhone e PC

Il Cartografo è una **web app installabile** (PWA): una volta aperta dal sito pubblicato si installa
come un'app vera, con la sua icona, a schermo intero, e funziona anche **senza connessione**.

- **iPhone / iPad**: apri il sito in **Safari** → pulsante **Condividi** → **Aggiungi alla schermata Home**.
- **PC (Windows, macOS, Linux)**: apri il sito in **Chrome** o **Edge** → icona **Installa** nella barra
  dell'indirizzo (oppure il pulsante *Installa* che compare nella pagina iniziale).
- **Android**: Chrome → menu ⋮ → **Installa app**.

Sull'iPhone le esportazioni PNG/SVG/JSON aprono il foglio di condivisione, da cui puoi salvarle in *File* o in *Foto*.

## Salvataggi condivisi

Il pulsante **Salva** nel pannello mette la mappa (seme, opzioni e modifiche del Mondo) nella pagina
**Salvataggi** (icona in alto). Le mappe salvate restano sul dispositivo e funzionano offline;
quando c'è un account collegato si sincronizzano tra tutti i tuoi dispositivi (le modifiche più recenti vincono,
le eliminazioni si propagano). Da lì puoi aprire, rinominare, esportare, eliminare, ed esportare/importare tutto in un file.

- **Dentro Claude** (claude.ai, app per iPhone, desktop): la sincronizzazione è automatica con il tuo account Claude, nessuna configurazione.
- **App installata dal sito**: serve un progetto [Supabase](https://supabase.com) gratuito, da preparare una volta sola:
  1. Crea un progetto su supabase.com.
  2. Apri **SQL Editor**, incolla il contenuto di `supabase/schema.sql` ed eseguilo
     (crea la tabella `saves`, accessibile a ogni utente solo per le proprie righe).
  3. In **Project Settings → API** copia *Project URL* e la chiave **anon public**.
  4. Incollale in `js/config.js` (così valgono per tutti i dispositivi) oppure nella pagina **Salvataggi** dell'app.
  5. Su ogni dispositivo crea l'account (la prima volta) o accedi con la stessa email e password.
     Se non vuoi la mail di conferma: *Authentication → Providers → Email → Confirm email* disattivato.

La chiave *anon* è pensata per stare nel browser: i dati sono protetti dalle regole RLS dello schema.

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

Il workflow `.github/workflows/pages.yml` pubblica il sito a ogni push sul branch principale.
Se Pages non è ancora attivo: **Settings → Pages → Build and deployment → Source: GitHub Actions**,
poi in **Actions** rilancia "Pubblica su GitHub Pages". Il sito è online su
`https://<utente>.github.io/<repository>/`.
Da quell'indirizzo (https) si può installare come app.

Dopo aver modificato i file esegui `node tools/build-sw.js`: aggiorna l'elenco dei file e la versione
della cache offline, così le app installate scaricano la nuova versione.

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
  saves.js            salvataggi locali e sincronizzazione (Claude o Supabase)
  library.js          pagina Salvataggi e invito a installare l'app
  relief3d.js         export 3D: heightmap a 16 bit, ZIP e script per Blender
js/config.js          URL e chiave Supabase (facoltativi)
js/gen/               un file per generatore
manifest.webmanifest  descrizione dell'app installabile
sw.js                 service worker per l'uso offline (generato da tools/build-sw.js)
icons/                icone dell'app
supabase/schema.sql   tabella e regole per i salvataggi condivisi
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
  heightfield(model)   { /* facoltativo: altitudini per l'export 3D (vedi relief3d.js) */ },
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
available in Italian and English. It installs as an app (PWA) on iPhone and PC, works offline, and
syncs saved maps across devices through the Claude account (inside claude.ai) or a Supabase project.
