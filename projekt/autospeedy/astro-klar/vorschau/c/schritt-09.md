# Schritt 09: Bewertungen

Entscheid 03.11.2026 (Kasten BAUPLAN, Zeile 10) umgesetzt: **nur Note, Anzahl und Link, keine Bewertungstexte, keine Namen, keine Karten.**

## Geändert / neu
- **astro-klar/bau/bewertungen.mjs** (neu): liest `GOOGLE_PLACES_SCHLUESSEL` und `GOOGLE_PLACE_ID` aus der Umgebung. Fehlt eins → `{"status":"leer"}` nach `src/daten/bewertungen.json`, exit 0. Sonst `GET https://places.googleapis.com/v1/places/<id>` mit `X-Goog-Api-Key` und `X-Goog-FieldMask: rating,userRatingCount,googleMapsUri` (**ohne `reviews`**). Gespeichert nur `note, anzahl, maps_link, geholt_am, status`. Fehler → `status "fehler"`, Build läuft weiter. Schlüssel wird nie geloggt (nur die Fehlerart `e.name`), nur `fetch`, keine Bibliothek.
- **astro-klar/src/daten/bewertungen.json** (neu): Vorgabe `{"status":"leer"}` – keine Note in der echten Datei.
- **astro-klar/package.json**: `prebuild` ruft nach `teilen.mjs` zusätzlich `node bau/bewertungen.mjs` (ohne Schlüssel still); `test` um `bewertungen.test.mjs` erweitert.
- **gemeinsam/site.ts**: neues `bewertungen { zeigen: boolean }`, Vorgabe `true`, optional (bestehende site.json bleibt gültig), `strict`.
- **astro/src/daten/site.json**: `"bewertungen": { "zeigen": true }` ergänzt.
- **astro/bau/editor.mjs** (Sveltia, kein Cockpit): Schalter «Bewertungen auf der Website zeigen».
- **astro-klar/src/components/Bewertungen.astro** (neu): Kopf mit Note «x,x von 5 · n Bewertungen» (Zahlen in Archivo), 5 SVG-Sterne mit Teilfüllung über eine Breiten-Maske, Attribution «Bewertungen von Google», Links «Alle Bewertungen auf Google» (`maps_link`) und «Bewertung schreiben» (`betrieb.bewertungen.google`; fehlt er → `Luecke.astro`). Ohne Daten: «–,– von 5» + Platzhalterhinweis, keine Kartenplatzhalter. `site.bewertungen.zeigen === false` → Abschnitt fällt weg. Datenquelle normal `src/daten/bewertungen.json`, im Test `BEWERTUNGEN_DATEI` (nur `test/fixtures`).
- **astro-klar/src/pages/index.astro**: alten Klick-zum-Laden-Abschnitt durch `<Bewertungen />` ersetzt; ungenutzten `Luecke`-Import entfernt.
- **astro-klar/public/css/klar.css**: neue Stile `.bewertungen-teil`, `.bew-kopf`, `.sterne`/`.bew-stern` (graue Umrisse + Akzent-Füllung per Maske); Sterne-Einstieg nach 3.10 (nur `.bew-kopf--echt`, `.ist-da`, 240 ms `--aus`, 50 ms Staffel; Note und Teilstern statisch). Tote Platzhalter-Stile entfernt.
- **astro-klar/public/js/klar.js**: toten `[data-bewertungen]`-Klick-Handler entfernt (kein Google im Browser); `beobachte(".bew-kopf--echt", { schwelle: 0.5 })` ergänzt (IO, einmal).
- **astro-klar/astro.config.mjs**: `AUSGABE` setzt nur im Test ein eigenes `outDir` (Fixture-Bau überschreibt `dist/` nicht).
- **Tests**: `test/bewertungen.test.mjs` (neu, baut mit Fixture), Ergänzungen in `statisch.test.mjs` (3) und `validierung.test.mjs` (1) und `browser.test.mjs` (1). `test/fixtures/bewertungen-beispiel.json` (als «Beispiel, nicht echt» markiert, ohne `reviews`). `.gitignore`: `dist-bew/`.

## Prüfungen (grün)
- `node --test validierung + statisch` → 16/16: u. a. Platzhalter «–,– von 5», Attribution, **keine Karten**; `dist/` enthält weder `X-Goog-Api-Key` noch einen Schlüssel (kein `AIza…`); `src/daten/bewertungen.json` ohne `reviews`/Note; `bewertungen.zeigen` optional + Vorgabe true, fremde Felder scheitern.
- `node --test bewertungen.test.mjs` → 1/1: Fixture-Bau zeigt «4,7 von 5 · 128 Bewertungen», `bew-kopf--echt`, Attribution, Google-Link, **keine Karten**, kein `X-Goog-Api-Key`; Fixture und echte Datei ohne `reviews`.
- `node --test browser.test.mjs` (Chrome) → 22/22: neu «ohne Klick keine Anfrage an *.google*»; alle Seiten ohne Konsolen-/CSP-Fehler.
- Bau ohne Schlüssel: 0 FEHLER. Sternfüllung geprüft: 4×100 % + 70 % = 4,7.

## Offener Prüfpunkt (BAUPLAN 4.3)
- **Google-Nutzungsbedingungen**: Zwischenspeichern/Anzeigen von Places-Inhalten. Mit der Entscheid-Variante (nur Note/Anzahl/Link, keine Texte) ist das Risiko minimiert; die endgültige Freigabe der Maps-Platform-Bedingungen steht noch aus. Pflicht-Attribution «Bewertungen von Google» ist gesetzt. `betrieb.bewertungen.google` ist noch `null` → «Bewertung schreiben» zeigt bewusst eine Lücke statt `PLACE_ID_FOLGT`.

## Screenshots
`vorschau/c/09-start-{desktop,desktop-ganz,handy,handy-ganz}.png` (nur `/`, Platzhalterzustand ohne Schlüssel).

## Nicht committet
Änderungen bleiben ungestaged. Commit macht der Bauleiter: «Schritt 09: Bewertungen».
