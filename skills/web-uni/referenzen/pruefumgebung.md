# Prüfumgebung: ein Prüflauf

Stand 2. November 2026. web-uni stellt die Umgebung; die Prüfungen liefern design-uni (DP6) und text-uni (TP7, dazu TP5 und TP6). Alle laufen **einmal am selben Stand** (gleicher Bau, gleiche Auslieferung), und das Ergebnis steht in einer Tabelle im Bericht.

**Stand:** Die einzelnen Werkzeuge gibt es. Ein Skript, das sie zusammen startet, ist `[nicht gebaut]`. axe und die Browser Firefox und WebKit sind in keinem Werkzeug verdrahtet `[nicht gebaut]`.

## Voraussetzungen

- Node in der Version, die der Stack verlangt (Astro 7.4.4: 22.23.4 oder neuer, `engines` in `package.json`).
- Playwright mit Chromium für `pruefen.cjs` (design-uni).
- Lighthouse 13.6.0 (wie in [messungen.md](messungen.md)).
- Alle Pfade unten relativ zum Repo; `<projekt>` ist der Ordner des Betriebs.

## Ablauf

| Nr. | Was | Befehl | Prüfpunkt |
|---|---|---|---|
| 1 | Bau mit Bauprüfungen (Pflichtfelder, Titel, Links) | `cd <projekt>/astro && npm ci && npm run build` | WP4 |
| 2 | Selbsttest des Prüfwerkzeugs, einmal je Werkzeugstand (WL5) | `node skills/design-uni/werkzeuge/pruefen.cjs <projekt>/projekt.json --selbsttest` | DP6 |
| 3 | Maschinelle Prüfungen Gestaltung, Bedienung, Technik | `node skills/design-uni/werkzeuge/pruefen.cjs <projekt>/projekt.json --json <projekt>/pruefung/dp6-tp7.json` | DP6, TP7 |
| 4 | Floskeln und KI-Klang | `node skills/text-uni/werkzeuge/slop-de.js <projekt>/astro/dist --json <projekt>/pruefung/slop-de.json` | TP7 (K1) |
| 5 | Ausliefern mit Komprimierung | `npx serve <projekt>/astro/dist -l 8201` | WP5 |
| 6 | Messung, 3 Läufe je Seite, Median | `npx lighthouse@13.6.0 http://localhost:8201/ --form-factor=mobile --only-categories=performance --output=json --output-path=<projekt>/pruefung/lh-start-1.json` (dreimal) | WP5 |
| 7 | Grösse je Bildvariante, JS, HTML, Schriften | aus dem Netzwerkprotokoll von Lighthouse und `ls -l dist/bilder` | WP5 |
| 8 | Technik der Suche ohne Netz (Nachbildung des Hosters) | nach text-uni Semester 4, Teil «Probe» | TP7 |

## Hinweise zum Zusammenspiel

- **Verzeichnisformat:** Die Vorlage legt Seiten als `kontakt/index.html` ab. `pruefen.cjs` sucht ohne Angabe nur Dateien `*.html` an der Wurzel; in `projekt.json` stehen die Seiten deshalb mit Pfad: `"seiten": ["index", "kontakt/index", "impressum/index", "datenschutz/index", "404"]`, ebenso in `seitenOhneKontakt` und bei der Hauptaktion (`"href": "/kontakt/"`). `"site"` zeigt auf `astro/dist`.
- **Vorschau:** `projekt.json` mit `"vorschau": true` für die Vorschau; vor dem Livegang ein zweiter Lauf mit Bau und Prüfung bei `vorschau: false` ([livegang.md](livegang.md)).
- **Labor:** Lighthouse läuft ohne Netz und ohne GPU; die Zahlen sind Hinweise, keine Feldwerte.

## Ergebnis im Bericht

Eine Tabelle im Teil Technik von `LIESMICH.md`: Prüfung mit voller Kennung (zum Beispiel DP6, TP7, WP5), Ergebnis (bestanden, Fehler mit Anzahl, «nicht gelaufen» mit Grund), Datei mit den Rohdaten, Datum. Ein Werkzeug, das nicht lief, heisst «nicht gelaufen», nie «bestanden».
