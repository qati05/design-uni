# QA-Abnahme Runde 2: Linie «Klar» nach Korrekturrunde 1 (Commit 4c87aad)

- **Arbeitsstand:** Commit `4c87aad` (Branch `claude/autospeedy-v2`), detached Worktree `/tmp/claude-0/qa-abnahme`, `projekt/autospeedy/astro-klar`
- **Build:** `npm ci` in `../gemeinsam` und `astro-klar`, `npm run build`: Exit 0, 21 Seiten, «0 FEHLER, 0 HINWEIS» (`logs/build.txt`). `dist/js/rueckruf.js` und `dist/js/schaden.js` sind identisch mit `astro/public/js/`.
- **Tests:** `CHROME=… npm test` einmal: **170 Tests, 170 grün, 0 rot** (`logs/npmtest.txt`)
- **Auslieferung:** `python3 -m http.server 4403 -d dist`
- **Browser:** Chromium Headless Shell `/opt/pw-browsers/chromium_headless_shell-1243`, Playwright aus `astro-klar/node_modules`
- **Datum:** 9.11.2026, ca. 11:55–12:30 (Europe/Zurich; die Statusanzeige «geschlossen, ab 13.15» stimmt zur Uhrzeit)
- **Viewports:** 320×700, 390×844, 430×932 (isMobile + Touch), 1280×720 (nur C04), 1024 (Team, nur Test), 1440×900
- **Testbedingungen:** wie Runde 1. `/api/**` per Playwright-Route gemockt (GET Token, POST `{ok:true}` / `{ok:false}` / leer / 500 / Netzabbruch, 300–600 ms Verzögerung). Fremde Server abgebrochen und gezählt. Leere `data-endpunkt` im Vorschau-HTML per Route auf `/api/schaden` bzw. `/api/rueckruf` gesetzt. Keine echte Sendung. Synthetische Daten («Testperson QA», 079 000 00 00, rotes 800×600-JPEG). Ganzseiten-Aufnahmen mit `reducedMotion: reduce`; fixe Elemente (Kopf, Handyleiste) erscheinen darin mitten im Bild (Artefakt). Der Kopf am Desktop ist absichtlich milchig-transparent (`backdrop-filter`); dass Text in Aufnahmen scharf durchscheint, werte ich als Aufnahme-Artefakt, nicht als Befund.
- **Skripte und Rohdaten:** `skripte/*.mjs` (aus Runde 1 übernommen, Port und Ordner angepasst; neu: `runde2.mjs`, `rr-sicht.mjs`, `pruef-oben.mjs`), `logs/*.json`
- **Hinweis zur eigenen Methode:** Im ersten Sweep-Lauf zeigten die Erst-Viewport-Aufnahmen die Seiten leicht gescrollt. Ursache: `scroll-behavior: smooth` und meine Aufnahme direkt nach `scrollTo(0,0)` (`pruef-oben.mjs`: frisch geladen `scrollY = 0`). Skript korrigiert, alle Aufnahmen neu erstellt. Kein Seitenfehler.
- Ein Mock-Erfolg beweist keine reale Zustellung.

## 1. Abnahmekriterien

| ID | Status | Beleg (Messung, Datei) |
|---|---|---|
| N01 | **bestanden** | Rückruf nach `{ok:true}`: `activeElement` = `P.rueckmeldung` auf Kontakt (390, 1440), Flotten und Occasionen (390, Absenden per Enter). Der Knopf ist danach gesperrt. `logs/runde2.json` C08/N01, `c08-rueckruf-390-erfolg.png` |
| N02 | **bestanden** | Leer absenden: Name und Telefon haben `aria-invalid="true"` und einen Fehlertext, der über `aria-describedby` erreichbar und sichtbar ist. Der Rand ist rot (`rgb(179,38,30)`), der Fokus liegt auf `#rr-kontakt-name`. Sammelhinweis und Sendefehler mit `role=alert`. Beim Senden `aria-busy="true"`, nicht `disabled`; Doppelklick ergibt 1 POST. Sendefehler: Nummer als `tel:+41717558861`, Fokus bleibt auf dem Knopf. Belege: `c08-rueckruf-390-leer.png`, `logs/runde2.json`, `logs/rueckruf.json` |
| N03 | **bestanden** | Schadenmeldung mit 200 und `{ok:false}` (390, 1440): keine Bestätigung, Sendefehler, Fokus auf «Nochmals senden». Mit `{ok:true}` erscheint die Bestätigung. `logs/schaden.json`, `schaden-390-mock-okfalse-viewport.png` |
| N04 | **bestanden** | «heute» im Fuss ist `rgb(91,95,102)` statt Linkblau. `n06-team-1440-seitenende.png` |
| N05 | **bestanden** | Der Link «Datenschutzerklärung» ist `display:inline`, 17 px hoch und unterstrichen. Der Zeilenabstand im Hilfesatz ist gleichmässig 20–21 px, auf Kontakt, Flotten, Occasionen und Schaden melden (390). `n05-kontakt-390-hilfe.png` |
| N06 | **bestanden** | Bei 1440 ist die Plakette `position:static` direkt nach `<footer>` auf Start, Schaden melden, Leistungen, Tesla, Kontakt und Team. Sie steht als dunkle Zeile unter dem Fuss und verdeckt nichts. `n06-team-1440-seitenende.png`, `n06-schaden-1440-viewport.png` |
| N07 | **bestanden** (Hinweis) | Name und Rolle stehen neben dem Porträt, die Mitte ist um 0 px versetzt. Rechts bleibt eine grosse Leerfläche. Das Kriterium ist erfüllt, die Gestaltung bleibt eine Designfrage (wie in der Übergabe genannt). `n07-team-1440-einzelperson.png` |
| N08 | **bestanden** (1 Lauf) | `npm test` 170/170 grün. Es lief **nur 1 Lauf**, wie beauftragt. Das ursprüngliche Kriterium «5 Läufe hintereinander» habe ich nicht selbst wiederholt; die 5 Läufe der Übergabe sind nicht belegt (Protokolle nicht dauerhaft). Die Ursachenerklärung (1-px-Input in der gerundeten Ecke) ist plausibel, aber nicht nachgestellt. Die Zeitwahl funktioniert nach der Änderung: Antippen wählt, zweites Antippen nimmt zurück, Leertaste und Tab gehen, die Fokus-Kontur ist 2 px. `logs/npmtest.txt`, `rueckruf-kontakt-320-zeitwahl-tastatur.png` |
| C02 | **bestanden** | 500 und Netzabbruch bei 320, 390 und 1440: Die Meldung (`role=alert`) steht direkt vor «Nochmals senden». Sie liegt ganz im Bild, unter dem Kopf (Kopf endet bei 64 px) und über dem Knopf. Werte für Meldung oben/unten, Knopf unten, Viewport-Höhe: 390: 420/537, 615, 844. 320: 348/512, 590, 700. 1440: 448/518, 596, 900. Die Nummer ist `tel:+41717558861`, `elementFromPoint` trifft den Link. Der Fokus liegt auf «Nochmals senden», die allgemeine Rückmeldung ist leer. Name und Bemerkung bleiben erhalten. «Wird gesendet …» steht an derselben Stelle. `c02-schaden-390-mock-500-viewport.png`, `c02-schaden-1440-mock-netz-viewport.png` (angesehen) |
| C04 | **bestanden** | Kontakt bei 1440×900: Die Karten Telefon, Adresse und Mail liegen bei 505–695 px. Die Nummer reicht bis 602, «Alte Landstrasse 63 / 9450 Altstätten» bis 615. Bei 1280×720 enden die Karten bei 631. Auf Team beginnt das erste Porträt bei 605. `c04-kontakt-1440-viewport.png`, `c04-kontakt-1280x720-viewport.png`, `c04-team-1440-viewport.png` |
| C05 | **bestanden** | Tesla bei 390, oben: Sichtbar ist nur «Tesla-Schaden melden». Die Leiste ist um 75 px nach unten aus dem Bild geschoben, ohne `leiste-an`. Nach dem Hero (scrollY 697) ist nur noch der Leistenknopf «Schaden melden» sichtbar, `href=/schaden-melden/?fahrzeug=tesla`. Am Seitenende ist die Leiste wieder weg. Antippen des Leistenknopfs führt zu `?fahrzeug=tesla`; in Schritt 2 ist die Checkbox `tesla` angehakt und die Modellwahl sichtbar. `c05-tesla-390-oben.png`, `c05-tesla-390-nach-hero.png`, `c05-ziel-schritt2-390.png` |
| C06 | **bestanden** | Bei 390 und 1440 sind die Chips identisch mit den 7 Radio-Werten des Formulars (Parkschaden, Unfall, Hagel, Kratzer oder Lack, Scheibe, Felge, Etwas anderes), je mit `?art=…` und 44 px hoch. Tesla ist kein Chip, sondern der eigene Link «Tesla? Hier entlang →» auf `?fahrzeug=tesla`. Kein Querscrollen. Chip «Felge» führt zu Schritt 2 mit Art «Felge». `c06-start-390-chips-ausschnitt.png`, `c06-start-1440-viewport.png` |
| C08 | **bestanden** | Name eingeben: Der Namensfehler verschwindet beim Tippen. Bei «079 12» bleibt der Telefonfehler, bei «079 123 45 67» verschwinden Fehler, `aria-invalid` und Sammelhinweis. Erfolg: grün `rgb(231,244,236)` mit Häkchen. Fehler: rot `rgb(253,236,234)` mit «!». Text-Rest siehe N09. `c08-rueckruf-390-erfolg.png`, `c08-rueckruf-390-fehler-500.png`, `c08-rueckruf-390-nach-korrektur.png` |
| C09 | **bestanden** | Die Modelle sind eine Häkchenliste: `li` ohne Rahmen, Hintergrund und Radius, nichts davon ist interaktiv. Bei 1440 stehen «Modelle» und «Gut zu wissen» nebeneinander (je 528 px breit, gleiche Oberkante). Vom letzten Inhalt bis zur FAQ-H2 sind es 112 px (390: 130 px). Kein Leerblock. `c09-tesla-1440-modelle.png`, `c09-tesla-390-modelle.png` |
| C10 | **bestanden** | Bei 1440 haben alle 6 Leistungs-H1 **2 Zeilen** (gezählt über Range-Rects), z. B. «Vom Blechschaden bis / zum Chassisschaden.» `c10-unfall-1440-viewport.png` |
| /bewerten/ | **bestanden** | Vorschau-Build: `<meta name="robots" content="noindex">`, kein canonical, `_headers` `/bewerten/*` mit `X-Robots-Tag: noindex`. Live-Testbau (nur im Scratch, `bau.vorschau=false`, `DATEN=`-Kopie, `--outDir` im Scratch, Repo unverändert): `sitemap.xml` hat 17 `<loc>`, alle öffentlichen Seiten, ohne `/bewerten/`, 404, Admin und Druck. `/bewerten/` und `/bewerten/druck/` live mit noindex. `robots.txt` sperrt `/bewerten/` nicht, das noindex bleibt also lesbar. Start live ohne noindex, mit canonical. `logs/sitemap-live.xml`, `logs/headers-live.txt`, `logs/build-live.txt` |

**Zur Übergabe F1:** Alle Messbehauptungen, die ich nachgemessen habe, stimmen: C04 «unten bei 694» (ich messe 695), C10 2 Zeilen, C06, C05, N01–N07, bewerten und 170 Tests. Nicht nachgeprüft sind die «5 Läufe 170/170»: Die Protokolle existieren nicht mehr, und ich habe 1 Lauf gemacht. Ebenfalls nicht nachgeprüft sind die Aussagen zur Linie «Lack» (53/53, Browserprüfung).

## 2. Regression

- **Seiten:** 19 Seiten (Runde-1-Liste plus `/bewerten/`) bei 320, 390 und 1440, dazu 390 und 1440 mit reduced motion, insgesamt 95 Aufrufe.
  - **Konsole:** 0 Fehler, 0 Warnungen, 0 `pageerror`.
  - **Requests:** 0 fehlgeschlagene Requests, 0 Antworten ≥ 400.
  - **Fremde Server:** 0 Anfragen.
  - **Überlauf:** `scrollWidth ≤ clientWidth` beim Laden und nach dem Durchscrollen.
  - **Titel und Beschreibungen:** Je 1 H1, Titel 44–59, Beschreibungen 101–155, JSON-LD parsebar.
  - Belege: `logs/sweep.json`, `<seite>-390-viewport.png`, `<seite>-1440-viewport.png`, `<seite>-390-ganz.png` (reduced motion).
- **Schadenmeldung Kernreise:**
  - Überlauf: Bei 320, 390 und 430 kein Überlauf in Schritt 2, weder mit Feldfehlern noch mit 2 Fotos und Ausweis.
  - Tastatur: 6× → und 1× ← gehen durch die Arten und bleiben in Schritt 1. Enter führt zu Schritt 2, der Fokus liegt auf der Legende. Zurück/Weiter per Tastatur und Leertaste auf «Hagel» funktionieren. Antippen von «Scheibe» führt weiter.
  - Leeres Senden: 2 Feldfehler, Fokus auf dem Namen.
  - Senden: Knopf `disabled` und `aria-busy`, 1 POST mit Foto und Token.
  - Erfolg: Fokus auf `article`.
  - Vorschau ohne Endpunkt: 0 POST, «Schadenmeldung (Vorschau)».
  - Belege: `logs/schaden.json`, `schaden-*.png`.
- **Rückruf Kernreise** (Kontakt 390/1440, Flotten und Occasionen 390):
  - Fälle `ok`, `okfalse`, leere Antwort, 500, Netzabbruch: korrekt, je 1 POST an `/api/rueckruf`.
  - Zeitwahl im Text der Erfolgsmeldung enthalten.
  - Die Fehlermeldung liegt sichtbar unter dem Knopf, bei 390 bei 572–666 von 844 (`logs/rr-sicht.json`).
  - Belege: `logs/rueckruf.json`, `rueckruf-*.png`.

## 3. Neue Befunde

Keine neuen P0-, P1- oder P2-Befunde.

| ID | P | Kurz |
|---|---|---|
| N09 | P3 | Rückruf: Der Feldtext ist veraltet. Nach leerem Absenden steht «Bitte geben Sie Ihre Telefonnummer an.» Beim Tippen von «079 12» bleibt dieser Text stehen, obwohl jetzt eine (zu kurze) Nummer im Feld steht. Erst beim nächsten Absenden kommt «Bitte prüfen Sie die Telefonnummer …». Kriterium: Der Fehlertext passt beim Tippen zum aktuellen Fehler, oder er wechselt erst beim Verlassen des Felds. `logs/runde2.json` C08 `telKurz` |
| N10 | P3 | Schadenmeldung bei 1440: Der Fehlerkasten über dem Knopf ist schmaler als der Knopf (er endet etwa 40 px früher). Rein optisch. `c02-schaden-1440-mock-netz-viewport.png` |
| N11 | P3 | Tesla bei 390: Die Überschrift «Gut zu wissen» folgt sehr knapp auf den gelben Lücke-Kasten der Modelle. Der Abschnitt wirkt gedrängt, das betrifft nur die Vorschau mit den Notizen. `tesla-390-ganz.png` |

## 4. Nicht geprüft

- **Testläufe:** N08 nur 1 Lauf `npm test`, nicht 5.
- **Linie «Lack»:** Nicht geprüft, obwohl `rueckruf.js`, `schaden.js` und `dateien.mjs` geteilt sind und geändert wurden. Weder `npm test` in `astro` noch die Browserprüfung.
- **Labormessung und Felddaten:** Lighthouse, LCP, CLS und INP sind nicht gemessen. Kontrast nur per Sicht.
- **Umgebungen:** Echte Mobilbrowser (iOS Safari, Android), Firefox, Screenreader (VoiceOver, auch für die flächigen unsichtbaren Inputs aus N08), 200 % Zoom, ohne JavaScript.
- **Echte Wege:** Reale Zustellung, Turnstile, echte Tokens und Zeitfalle, WhatsApp-Weg, echte Kamerafotos.
- **Hoster:** `_headers` und `X-Robots-Tag` nur als Datei geprüft, nicht auf dem echten Hoster. Echte Suchmaschinen nicht geprüft.
- **Weitere Seiten:** `/admin/` nicht geprüft. Die Tab-Folge pro Seite ist nicht vollständig geprüft. Zwischenbreiten nur 430 und 1280×720.
- **Inhalte:** C01, C03, C07, C11, K05 und K06 waren nicht Teil dieser Runde.
