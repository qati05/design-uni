# Schritt 10: Schluss und Kontakt

Stand: 03.11.2026. Branch `claude/autospeedy-c`, Worktree `/workspace/agency/autospeedy-c`. Nicht committet (macht der Bauleiter).

## Geaendert

- **`src/components/Abschluss.astro`** — neu nach Entwurf C (`.schluss`, BAUPLAN 2 Zeile 11):
  - Titel «Schaden passiert. / *Wir kümmern uns darum.*» (zweite Zeile `<em>`, kursiv).
  - Zwei CTAs wie im Hero: `knopf--akzent` «Schaden melden», `knopf--kontur` «Anrufen 071 755 88 61».
  - `<dl class="fakten">` mit Adresse / Öffnungszeiten / Kontakt (Adresse und Kontakt aus `betrieb.json`).
  - Öffnungszeiten ueber `Zeiten.astro` aus `site.zeiten` (= `betrieb.zeiten` nach `mitPflege`). Darunter die Ausnahmen aus `site.ausnahmen`, gefiltert auf die naechsten 30 Tage ab Build-Datum, als `<ul class="ausnahmen">` (z. B. «10.11. Betriebsferien: geschlossen»).
  - Code-Hinweis: Die Ausnahmen-Liste veraltet bis zum naechsten Build; darum baut die Pflege bei jeder Aenderung neu (Cloudflare Pages je Commit + taeglicher Cron 00:05, BAUPLAN 4.2).
  - `ort`-Prop bleibt (data-ort fuer `zaehl.js`), damit die Unterseiten (Tesla, Leistungen, Team) den Abschnitt weiter nutzen.
- **`src/components/Zeiten.astro`** — neues Prop `ausnahmen` (Vorgabe `true`). Mit `ausnahmen={false}` zeigt die Tabelle nur die regulaeren Zeiten; der Schluss listet die Ferien/Feiertage separat. Bestehende Nutzung (`/kontakt/`) unveraendert.
- **`src/pages/index.astro`** — Startseite vollstaendig in der Reihenfolge aus BAUPLAN 2: Hero, Faktenleiste, Partnerband, Leistungen, Vorher/Nachher, Anfrage, Tesla, Inhaber, Bewertungen, Schluss. Die beiden alten Abschnitte der frueheren Startseite entfernt (Ablauf «In drei Schritten erledigt.» mit Telefon-Attrappe und der alte Kontakt-Block «Wir sind in …»). Nichts hinzugefuegt, was nicht in BAUPLAN 2 steht.
- **`../astro/bau/daten.mjs`** — `site.json` weiterhin als eingebundene Standarddatei; neu kann im Test `SITE_JSON` eine Fixture-Datei setzen (nur `test/fixtures`, nie in Produktion), damit eine Ausnahme relativ zum Build-Tag pruefbar ist.
- **`public/css/klar.css`** — `.schluss`, `.schluss h2 em`, `.fakten` (3 Spalten, Handy 1 Spalte), `.fakten .zeiten` (Tabelle schlank), `.fakten .ausnahmen` (Liste). Masse woertlich aus `referenz-c/entwurf-c.css`, Breite/Rand wie die uebrigen C-Abschnitte.
- **`test/schluss.test.mjs`** (neu) + **`test/browser.test.mjs`** (ein Test) + **`package.json`** (Testliste).

Hinweis: Die Handyleiste weicht im Schluss ohne weitere JS-Aenderung — `klar.js` beobachtet bereits `.schluss` und `.fuss` (BAUPLAN 3.11).

## Pruefungen

- `npm run build` — gruen, 13 Seiten.
- `node --test` (validierung, statisch, bewertungen, schluss, browser) — **alle gruen** (17 + 3 + 23 Browser-Tests mit `/usr/bin/google-chrome`).
  - JSON-LD `openingHoursSpecification` = `site.zeiten` (neu).
  - Schluss: Titel, zwei CTAs, Fakten-dl Adresse/Öffnungszeiten/Kontakt, Zeiten-Tabelle, Mail-Link (neu).
  - Eine Ausnahme in 10 Tagen erscheint (Fixture `site.json` ueber `SITE_JSON`, Zweitbau in tmp) — Name, kurzes Datum und «geschlossen» im `.schluss` (neu).
  - Handyleiste im Schluss aus (neu).
- `rg -n "ß" src public/css public/js` — kein Treffer (kein Eszett).
- `node bau/fotos-c.mjs 10 /` — 4 Aufnahmen nach `vorschau/c/10-start-*.png`.
- `node bau/pruefen-seiten.cjs` — in dieser Umgebung **nicht lauffaehig**: braucht das volle Playwright-Chromium (`chrome-headless-shell`, nicht installiert) und einen laufenden `astro preview` auf :4344. Die gleichwertigen Konsolen-/CSP-Pruefungen ueber `browser.test.mjs` (installiertes google-chrome) sind gruen.

## Vergleich mit den Referenzbildern

`vorschau/c/10-start-desktop-ganz.png` / `10-start-handy-ganz.png` gegen `referenz-c/entwurf-c-desktop-ganz.png` / `-handy-ganz.png`.

Der Schluss-Abschnitt stimmt in Aufbau, Titel (kursive zweite Zeile), CTAs und Fakten-dl ueberein. Abweichungen:

1. **Öffnungszeiten im Schluss:** Vorgabe nutzt `Zeiten.astro` → Tabelle mit ausgeschriebenen Tagen und «… Uhr» («Montag bis Donnerstag 7.30 bis 12.00 Uhr und 13.15 bis 17.30 Uhr»). Das Referenzbild zeigt die kompakte Kurzform «Mo–Do 7.30–12.00, 13.15–17.30». Gewollt laut Schrittvorgabe (Zeiten aus `site.zeiten` ueber `Zeiten.astro`), damit die gepflegten Zeiten eine einzige Quelle haben.
2. **Keine Ausnahmen sichtbar:** `site.ausnahmen` ist leer, darum steht keine Ferienzeile. Mit Daten erscheint sie (im Test belegt).
3. Uebrige Seitenabweichungen stammen aus fruheren Entscheiden, nicht aus diesem Schritt: Partnerband als **Text** statt Logos (Entscheid `PARTNER_LOGOS`), Bewertungen nur **Note/Anzahl/Link** ohne Karten (Entscheid 03.11.), Tesla-/Inhaber-/Teamfotos als Platzhalter.

## Offen

- `pruefen-seiten.cjs` in einer Umgebung mit vollem Playwright-Chromium und laufendem Preview nachziehen.
- Die kompakte Zeiten-Kurzform im Schluss (Abweichung 1) bei Bedarf mit Reshat/Grok klaeren; technisch waere ein Kurzmodus in `Zeiten.astro` moeglich.
