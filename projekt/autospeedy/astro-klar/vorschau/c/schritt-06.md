# Schritt 06: Tesla und Ablauf

## Geändert
- **`src/components/TeslaTeil.astro`** (neu): Tesla-Abschnitt Entwurf C (BAUPLAN 2 Zeile 8). 5fr Titel + Text + `<dl class="spec">` (Zulassung/Teile/Versicherung/Lack) | 7fr Fotoband 21:9 (B7), `<ol class="ablauf">` 01 Melden · 02 Begutachten · 03 Reparieren, Vermerk «Entwurf: Ablauf vom Betrieb zu bestätigen.», Knopf «Tesla-Schaden melden» → `/schaden-melden/?tesla=1`. Texte wörtlich aus `referenz-c/entwurf-c.html`. Eigene Klasse `.tesla-teil`, damit die alte dunkle `.tesla`-Sektion der Unterseiten (/tesla/) unberührt bleibt.
- **`src/pages/index.astro`**: alte Inline-Tesla-Sektion durch `<TeslaTeil />` ersetzt.
- **`bau/stock-c.mjs`**: B7 `unsplash-wbZ-k80yOqI.jpg` → `public/bilder/stock/b7-tesla-{640,1280,1920}.webp` (sharp, webp). Dateien erzeugt.
- **`public/js/klar.js`**: Helfer `beobachte(selektor, {schwelle, rand})` mit IntersectionObserver, setzt einmal `.ist-da` und `unobserve`. Nur bei `html.js-bewegung`. Schon sichtbare Elemente bekommen sofort `.ist-da` ohne Transition (`.ohne-uebergang` für einen Frame). Aufrufe für `.foto-ein` (3.5) und `.tesla-teil .ablauf` (3.7).
- **`public/css/klar.css`**: Tesla-Layout (abschnitte) nach entwurf-c.css; Bewegung (bewegung) nach 3.7 (Linie `::before` scaleX desktop / scaleY ≤720px, 900 ms `--feder-weich`; Punkte `.6→1`+opacity 320 ms `--feder-knopf`, Verzögerung 0/300/600 ms; Texte 80/380/680 ms) und 3.5 (`.foto-ein` opacity + scale 1.05→1, 700 ms). Alles nur unter `.js-bewegung`; ohne JS und bei Reduced Motion voll sichtbar.
- **`astro/public/js/schaden.js`** (geteilte Quelle): Vorwahl akzeptiert zusätzlich `?tesla=1` (bestehendes `?fahrzeug=tesla` unverändert). Wird von `teilen.mjs` nach astro-klar kopiert.
- Credit Philipp Mandler / Unsplash (B7) steht bereits unter `/bildnachweise/`.

## Prüfungen (grün)
- `npm run build`: 13 Seiten, keine Fehler. B7-WebP erzeugt.
- `node --test test/statisch.test.mjs`: 6/6 (CSP ohne unsafe-inline, kein Inline-JS/`on…`, kein ß).
- `node --test test/browser.test.mjs`: 18/18, inkl. 3 neue Tesla-Ablauf-Tests: mit JS nach Scroll + 1.3 s → Linie `none`/Identität, alle Punkte opacity 1; Reduced Motion sofort sichtbar; ohne JS sichtbar (Linie, Punkte, Fotoband).
- `/schaden-melden/?tesla=1` wählt Tesla vor und zeigt die Modelle (gegen dist geprüft).

## Offen
- `bau/pruefen-tesla-formular.cjs` nicht in dieser Umgebung lauffähig (braucht volles `playwright`, Server auf 4344/4333 und externe Testfotos; Lack-`dist` fehlt). Die `?tesla=1`-Vorwahl wurde stattdessen direkt gegen die gebaute Klar-`dist` geprüft (grün); der `?fahrzeug=tesla`-Pfad des Skripts bleibt unverändert.
- «seit Oktober» im Hero bleibt unverändert (offen laut BAUPLAN).

## Screenshots
`vorschau/c/06-start-{desktop,desktop-ganz,handy,handy-ganz}.png`
