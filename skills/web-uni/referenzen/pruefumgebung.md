# Prüfumgebung: ein Prüflauf

Stand 2. November 2026. web-uni stellt die Umgebung; die Prüfungen liefern design-uni (DP6) und text-uni (TP7, dazu TP5 und TP6). Alle laufen **einmal am selben Stand** (gleicher Bau, gleiche Auslieferung), und das Ergebnis steht in einer Tabelle im Bericht.

**Stand:** Die einzelnen Werkzeuge gibt es. Ein Skript, das sie zusammen startet, ist `[nicht gebaut]`. axe und die Browser Firefox und WebKit sind in keinem Werkzeug verdrahtet `[nicht gebaut]`.

## Voraussetzungen

- Node in der Version, die der Stack verlangt (`engines` in `package.json`). Die Vorlage pinnt Astro 7.4.1 und läuft mit Node 22.22.0 ([stacks.md](stacks.md), Klasse B).
- Playwright mit Chromium für `pruefen.cjs` (design-uni).
- Lighthouse 13.6.0 (wie in [messungen.md](messungen.md)).
- Alle Pfade unten relativ zum Repo; `<projekt>` ist der Ordner des Betriebs.

## Ablauf

| Nr. | Was | Befehl | Prüfpunkt |
|---|---|---|---|
| 1 | Bau mit Bauprüfungen in der Stufe `abgabe` (Pflichtfelder, Titel, Beschreibung, Rechtsseiten, Links) | `cd <projekt>/astro && npm ci && npm run bau:abgabe` | WP4 |
| 2 | Selbsttest des Prüfwerkzeugs, einmal je Werkzeugstand (WL5) | `node skills/design-uni/werkzeuge/pruefen.cjs <projekt>/projekt.json --selbsttest` | DP6 |
| 3 | Maschinelle Prüfungen Gestaltung, Bedienung, Technik, fremde Hosts | `node skills/design-uni/werkzeuge/pruefen.cjs <projekt>/projekt.json --json <projekt>/pruefung/dp6-tp7.json` | DP6, TP7, WP5 (fremde Herkunft, Cookies) |
| 4 | Floskeln und KI-Klang; `--prueflauf` meldet jeden Treffer als HINWEIS mit Exit-Code 0, weil K1 nicht sperrt | `node skills/text-uni/werkzeuge/slop-de.js <projekt>/astro/dist --prueflauf --json <projekt>/pruefung/slop-de.json` | TP7 (K1) |
| 5 | Ausliefern mit Komprimierung | `npx serve <projekt>/astro/dist -l 8201` | WP5 |
| 6 | Messung, 3 Läufe je Seite, Median | `npx lighthouse@13.6.0 http://localhost:8201/ --form-factor=mobile --only-categories=performance --output=json --output-path=<projekt>/pruefung/lh-start-1.json` (dreimal) | WP5 |
| 7 | Grösse je Bildvariante, JS, HTML, Schriften | aus dem Netzwerkprotokoll von Lighthouse und `ls -l dist/bilder` | WP5 |
| 8a | Bilder ohne Metadaten (Standort, Kamera) | zum Beispiel `exiftool -gps:all -a <projekt>/astro/dist/bilder` `[nicht gebaut]`; bis dahin «nicht gelaufen» | WP4 |
| 8 | Technik der Suche ohne Netz (Nachbildung des Hosters) | nach text-uni Semester 4, Teil «Probe» | TP7 |

## Hinweise zum Zusammenspiel

- **Stufen der Ergebnisse** (zusammenspiel Teil 7): FEHLER sperrt, HINWEIS wird berichtet und sperrt nicht, «nicht geprüft» heisst nicht gelaufen. Exit-Code 1 nur bei FEHLER. Jede Prüfung trägt die Kennung ihres Besitzers und zählt einmal.
- **Stufe des Baus:** Während Gerüst und Vorschau baut die Vorlage mit `stufe: geruest` (fehlende Beschreibung und Rechtsseiten als HINWEIS); im Prüflauf vor der Abgabe mit `npm run bau:abgabe` (dieselben als FEHLER).

- **Verzeichnisformat:** Die Vorlage legt Seiten als `kontakt/index.html` ab. `pruefen.cjs` findet Seiten auch in Unterordnern und löst Links wie `/kontakt/` auf. Wer die Seiten ausdrücklich nennen will, schreibt sie in `projekt.json` mit Pfad: `"seiten": ["index", "kontakt/index", "impressum/index", "datenschutz/index", "404"]`, ebenso in `seitenOhneKontakt` und bei der Hauptaktion (`"href": "/kontakt/"`). `"site"` zeigt auf `astro/dist`.
- **Vorschau:** `projekt.json` mit `"vorschau": true` für die Vorschau; vor dem Livegang ein zweiter Lauf mit Bau und Prüfung bei `vorschau: false` ([livegang.md](livegang.md)).
- **Labor:** Lighthouse läuft ohne Netz und ohne GPU; die Zahlen sind Hinweise, keine Feldwerte.

## Ergebnis im Bericht

Eine Tabelle im Teil Technik von `LIESMICH.md`: Prüfung mit voller Kennung (zum Beispiel DP6, TP7, WP5), Ergebnis (bestanden, Fehler mit Anzahl, «nicht gelaufen» mit Grund), Datei mit den Rohdaten, Datum. Ein Werkzeug, das nicht lief, heisst «nicht gelaufen», nie «bestanden».
