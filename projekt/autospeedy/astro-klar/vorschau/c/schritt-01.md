# Schritt 01: Schriften, Tokens, Screenshots

Stand: 03.11.2026. Branch `claude/autospeedy-c`. Nichts committet, nichts gepusht.

## Schriften (public/fonts, woff2, subsettet: Latin + Latin-1 + U+2013 U+2019 U+00AB U+00BB U+20AC)
| Datei | KB |
|---|---|
| source-serif-4-latin-opsz-normal.woff2 | 42.6 |
| source-serif-4-latin-opsz-italic.woff2 | 45.2 |
| archivo-latin-wdth-normal.woff2 | 11.4 |
| hanken-grotesk-latin-400-normal.woff2 | 11.1 |
| hanken-grotesk-latin-500-normal.woff2 | 11.4 |
| hanken-grotesk-latin-600-normal.woff2 | 11.4 |

- Source Serif 4: Gewicht auf 400 festgesetzt, opsz-Achse behalten. Archivo: wght 400 / wdth 100 festgesetzt (statisch). Subsetting lokal mit pyftsubset (fontTools + brotli, nur lokal, nicht im Repo).
- OFL-Lizenzen mitkopiert (Source Serif 4, Archivo, Hanken). Instrument Serif samt @font-face und Lizenz entfernt.
- Alle Dateien unter 60 KB.

## Geaendert
1. public/fonts: neue Untermengen + OFL; Instrument Serif raus.
2. public/css/klar.css: in `@layer basis, bausteine, abschnitte, bewegung` geordnet. Farb-Tokens aus BAUPLAN 2 (--grund/--papier/--tinte/--leise/--linie/--akzent) und alle Bewegungs-Tokens aus BAUPLAN 3.1 woertlich inkl. `@supports`-Fallback. Archivo mit tabular-nums nur fuer `.zahl, .nr, .ziffer, .leiste-fakten dd, .spec dd, .fakten dd, .kopf-tel span`. Bestehende Unterseiten-Klassen nur auf die neuen Tokens umgestellt (alte Namen als Aliase), nichts geloescht.
3. src/layouts/Klar.astro: preload nur Source Serif 4 normal + kursiv (crossorigin); theme-color auf #f4f4f2.
4. bau/fotos-c.mjs: neu (Playwright via createRequire, Chrome /usr/bin/google-chrome --no-sandbox, Server auf dist, vier Aufnahmen je Seite).
5. test/statisch.test.mjs: Schrift-Test auf neue Dateien; zusaetzlicher Test «keine Schriftdatei groesser als 60 KB».

## Pruefungen (gruen)
- `npm run build`: 12 Seiten.
- `node --test test/statisch.test.mjs`: 6/6 (inkl. CSP ohne unsafe-inline, kein Inline-JS/on…, kein Eszett, 60-KB-Grenze).
- Browser-Tests (CHROME=/usr/bin/google-chrome): 5/5 (Slider, Handyleiste, Schadenmeldung, alle Seiten ohne CSP-Konsolenfehler).
- `node bau/fotos-c.mjs 01 / /leistungen/ /tesla/ /team/ /kontakt/ /schaden-melden/`: 24 Aufnahmen in vorschau/c/.

## Offen
- Seitenumbau nach Entwurf C folgt in spaeteren Schritten; hier nur Huelle (Schriften/Tokens) umgestellt.
