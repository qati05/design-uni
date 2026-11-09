# QA-Abnahme Runde 1: Linie «Klar» nach Commit 46b90f3

- **Arbeitsstand:** Commit `46b90f3` (Branch `claude/autospeedy-v2`), detached Worktree `/tmp/claude-0/qa-abnahme`, `projekt/autospeedy/astro-klar`
- **Build:** `npm ci` in `../gemeinsam` und `astro-klar`, `npm run build`: Exit 0, 21 Seiten, «0 FEHLER, 0 HINWEIS» (`logs/build.txt`)
- **Tests des Projekts:** `CHROME=… npm test`: 157 Tests, **156 grün, 1 rot** (siehe N08, `logs/npmtest.txt`)
- **Auslieferung:** `python3 -m http.server 4402 -d dist`, also http://localhost:4402
- **Browser:** Chromium Headless Shell aus `/opt/pw-browsers/chromium_headless_shell-1243` (executablePath gesetzt), Playwright 1.64.1
- **Datum:** 9.11.2026, ca. 11:15–12:00 (Europe/Zurich)
- **Viewports:** 320×700, 390×844, 430×932 (alle isMobile + Touch), 1024×768 (nur Team), 1440×900
- **Testbedingungen:**
  - Alle Requests zu `/api/**` sind per Playwright-Route gemockt: GET `?t=1` gibt `{t:"test-token"}`, POST je nach Test `{ok:true}`, `{ok:false}` mit 200, leere 200, 500 oder Netzabbruch, mit 500–600 ms Verzögerung. Requests an fremde Server werden abgebrochen und gezählt. Es gab keine echte Sendung.
  - Der Vorschau-Build hat leere `data-endpunkt`. Für die Sendetests habe ich das HTML in der Route umgeschrieben: `/api/schaden` und `/api/rueckruf`. So holt die Seite das Token beim Laden wie live. Gegenprobe: Ein Build mit `FORMULAR_ENDPUNKT=/api/schaden` (nur in meinen Scratch-Ordner) setzt auf Kontakt, Flotten und Occasionen tatsächlich `data-endpunkt="/api/rueckruf"`.
  - Ganzseiten-Aufnahmen entstanden mit `reducedMotion: reduce`. Fixe Elemente (Kopf, Handyleiste, Plakette am Desktop) erscheinen darin mitten im Bild. Das ist ein Artefakt der Aufnahme.
  - Synthetische Daten: «Testperson QA», 079 000 00 00, ein rotes 800×600-JPEG.
- **Skripte und Rohdaten:** `skripte/*.mjs`, `logs/*.json` (alles in diesem Ordner)
- Ein Mock-Erfolg beweist keine reale Zustellung.

## 1. Befunde K01–K22 (ohne K05, K06)

| K | Status | Beleg (Messung, Datei) |
|---|---|---|
| K01 | **bestanden** | Bei 320, 390 und 430 gilt `scrollWidth == clientWidth` in Schritt 2: nach Klick, mit leeren Pflichtfeldern, mit Tel «abc» und Mail «x@», mit 2 Fotos und Ausweis. Der Menü-Knopf liegt bei 256–300 (von 320), 326–370 (390) und 366–410 (430). Belege: `logs/schaden.json` K01, `schaden-390-schritt2-viewport.png`, `schaden-390-feldfehler-viewport.png`, `schaden-390-fotos-ganz.png`, `schaden-320-fehler-fotos-viewport.png` |
| K02 | **bestanden** | Echte Tab-Folge bis zur Gruppe (1440: 11 Tabs, 390: 5). 6× → und 1× ← gehen alle 7 Arten durch, und es bleibt immer Schritt 1. «Weiter» ist sichtbar. Enter führt mit «Etwas anderes» zu Schritt 2, der Fokus liegt auf der Legende. «Zurück» per Enter, dann 2 Tabs zu «Weiter» und Enter: Schritt 2 mit derselben Art. Leertaste auf «Hagel» führt sofort weiter. Antippen von «Scheibe» bei 390 führt weiter. Belege: `schaden-1440-tastatur-radio-fokus.png`, `-pfeil-bleibt.png`, `-enter-schritt2.png` |
| K03 | **bestanden** | Mock 500 und Netzabbruch bei 390 und 1440: `activeElement` ist der Knopf «Nochmals senden». Die Meldung hat `role=alert` und nennt die Telefonnummer. Name und Bemerkung bleiben erhalten. Belege: `schaden-390-mock-500-viewport.png`, `schaden-390-mock-netz-viewport.png`, `schaden-1440-mock-500-viewport.png` |
| K04 | **bestanden** | Die Etiketten sind 13 px, die Angaben 22 px (390 und 1440). Am Handy endet die Nummer bei y=682, die Handyleiste beginnt bei 776 (Viewport 844). «Alte Landstrasse 63» steht 1× im `main`. H1: «So erreichen Sie uns.». Belege: `kontakt-390-viewport.png`, `kontakt-390-karten.png`, `kontakt-1440-karten.png` |
| K07 | **bestanden** (Raster) | Bei 1440 hat das Raster 3×365 px mit 16 px Abstand, über 149–1277, also die ganze Inhaltsbreite, Rest 0. Bei 1024: 3×298 px über 41–968, Rest 0. Die Einblendung der Bereichstitel ist bewusst unverändert (sie war kein Teil des Kriteriums). Zur Karte mit nur 1 Person siehe N07. Belege: `team-1440-ganz-rm.png`, `team-1024-ganz-rm.png` |
| K08 | **bestanden** | Jedes `<form>` auf Schaden melden, Kontakt, Flotten und Occasionen enthält `/datenschutz/`, auch der `noscript`-Weg der Schadenmeldung. Die Datenschutzseite nennt den Hoster Cloudflare Pages (Cloudflare, Inc., USA), den Mailversand Cloudflare Email (USA) und Brevo (Frankreich). Supabase und Zürich kommen nicht mehr vor; «Datenbank» nur im Satz «speichert … nichts in einer Datenbank». Rechtlich habe ich den Text nicht geprüft. Zur Darstellung des Links siehe N05 |
| K09 | **bestanden** | Auf Kontakt, Team, Flotten und Occasionen ist bei 320 und 390 jeder sichtbare Link, Knopf, jede Chip- und Zeitwahl-Fläche ≥ 44×44. Ausnahmen sind nur der Inline-Link «Datenschutzerklärung» im Fliesstext auf Occasionen (127×17, laut Kriterium ausgenommen) und die visuell versteckten 1×1-Radios in ihren Labels. Die Zeitfelder messen bei 320 45×44 und bei 390 59×44. Belege: `logs/befunde.json` K09, `rueckruf-kontakt-320-zeitwahl.png` |
| K10 | **bestanden** | Titel ≤ 60 auf allen 18 Seiten: Unfall 52, Flotten 59, höchster Wert 59. Beschreibungen 101–155 (`logs/sweep.json`) |
| K11 | **nicht bestanden** (Teil `geo`) | Sitemap: Der Vorschau-Build hat absichtlich keine `sitemap.xml`. Ein Live-Testbau in meinen Scratch-Ordner (`bau.vorschau=false`, wie im Projekttest) erzeugt eine `sitemap.xml` mit 18 `<loc>`: alle 17 öffentlichen Seiten plus `/bewerten/`, ohne 404 und Admin. Dieser Teil ist erfüllt. `geo`: Es gibt 0 Vorkommen im JSON-LD, auch im Live-Testbau. Das ist blockiert durch fehlende Koordinaten in `betrieb.json`. Ob `/bewerten/` in die Sitemap gehört, soll der Lead entscheiden |
| K12 | **bestanden** | Auf Start und `/leistungen/` sichtbar: Überschrift «Nach Ihrer Meldung geht es so weiter.» und Schritt «02 Offerte und Termin». Die Ziffern 01–03 stehen nur noch in diesem Nach-der-Meldung-Ablauf, Tesla zeigt keine Ziffern mehr. «In zwei Schritten» stimmt mit dem Formular überein (2 Schritte). Beleg: `start-1440-ablauf-ausschnitt.png` |
| K13 | **nicht bestanden** (kleiner Rest) | Im `main` von Start, Leistungen, Flotten, Tesla und Unfall trägt bei 390 und 1440 kein nicht klickbares Textelement `rgb(21,102,184)`. Die Listen sind Häkchenlisten oder Absätze (`flotten-390-liste-ausschnitt.png`, `tesla-390-liste-ausschnitt.png`, `l-unfall-390-was-wir-machen.png`). Es bleibt aber das Fuss-Etikett «heute» (`span.fuss-woche__heute`, 12 px, `--akzent` = Linkblau) auf jeder Seite. Das widerspricht dem Wortlaut des Kriteriums. Es bestand schon vor dem Commit, siehe N04 und `fuss-1440-heute-ausschnitt.png` |
| K14 | **bestanden** | Bei 390 sind alle 7 Karten 120 px hoch, «Etwas anderes» ist 310 px breit über die ganze Reihe. Beleg: `schaden-390-arten.png` |
| K15 | **bestanden** (390) | Auf allen 18 Seiten bei 390 ist die Plakette `position: static` und steht direkt nach `<footer>`. Am Seitenende liegt sie über der Handyleiste (`body` padding-bottom 70 px), und die Knöpfe der Handyleiste sind frei (`elementFromPoint`). Belege: `start-390-seitenende-plakette.png`, `schaden-390-seitenende-plakette.png`. Am Desktop siehe N06 |
| K16 | **bestanden** | Der Fuss ist bei 1440 auf allen Seiten 672 px hoch. Claim `p.fuss-slogan`: 36 px bei 1440 (H1 48–62), 26 px bei 390 (H1 32–38). Belege: `fuss-1440.png`, `fuss-390.png` |
| K17 | **bestanden** | Zeilenumbrüche pro Zeichen gemessen: Bei 320 bricht jede Mail nur nach «@», bei 390 nur «martyna.skweres@» und ebenfalls nach «@». Beleg: `team-390-mail-ausschnitt.png` |
| K18 | **bestanden** | Bei 320 und 390 liegt der Umbruch vor «K». «K + L Partner von» steht auf einer Zeile. Beleg: `flotten-390-kl-ueberschrift.png`, `flotten-320-kl-ueberschrift.png` |
| K19 | **bestanden** (Hinweis) | Die Uhrzeiten stehen auf allen Seiten gleich: «7.30 bis 12.00 Uhr und 13.15 bis 17.30 Uhr». Hinweis: Die Tage heissen in der Faktenleiste und in der FAQ «Mo bis Fr», im Fuss und auf Kontakt «Montag bis Freitag» |
| K20 | **bestanden** | Das Impressum nennt «Source Serif 4, Hanken Grotesk und Archivo, alle unter der SIL Open Font License 1.1». Das passt zu den 3 OFL-Dateien in `/fonts/` |
| K21 | **bestanden** | Das Bild ist `werkstatt-*.webp` und zeigt ein Auto mit abgebauter Front und offener Haube, die Stossstange liegt auf dem Werkzeugwagen. Das ist ein Carrosserie-Motiv. Bei 1440 wird die 960er-Quelle auf 1128 px gestreckt und ist leicht weich (vom Entwickler genannt). Belege: `l-unfall-390-was-wir-machen.png`, `l-unfall-1440-was-wir-machen.png` |
| K22 | **bestanden** | Bei 390 und 320 deckt das Blatt 0–390 bzw. 0–320 ab. «Schaden melden» ist ein Knopf 358×52 (blau, weisse Schrift), «Anrufen 071 755 88 61» ein Knopf 326×48 auf Fläche. Siehe auch unten «Handy-Menü». Belege: `nav-390-offen.png`, `nav-320-offen.png` |

**Zu den Behauptungen in B3-UEBERGABE.md:** Alle Messwerte, die ich nachgemessen habe, stimmen: K01 326–370, K14 120 px, K16 672 px, K10 52/59. Nicht zutreffend ist «157/157 grün»: Ein Test ist instabil, siehe N08. Die Übergabe nannte das Schliessen-Symbol unter reduced motion noch als offen. Im Commit ist es behoben und von mir bestätigt (siehe unten).

## 2. Regressionen

- **Seiten:** 18 Seiten (Start, Leistungen, 6 Leistungsseiten, Tesla, Flotten, Occasionen, Team, Kontakt, Schaden melden, Impressum, Datenschutz, Bildnachweise, 404) bei 320, 390 und 1440, dazu 390 und 1440 mit reduced motion.
  - **Konsole:** 0 Fehler, 0 Warnungen, 0 `pageerror`.
  - **Requests:** 0 fehlgeschlagene Requests, 0 Antworten ≥ 400.
  - **Fremde Server:** 0 Anfragen.
  - **Überlauf:** Beim Laden und nach komplettem Durchscrollen ist `scrollWidth ≤ clientWidth` überall.
  - **H1:** Genau 1 H1 pro Seite.
  - **Titel und Beschreibungen:** Titel 44–59, Beschreibungen 101–155.
  - **JSON-LD:** Parsebar auf allen 17 Seiten mit JSON-LD; die 404-Seite hat absichtlich keines. Rohdaten: `logs/sweep.json`.
- **Schadenmeldung:**
  - Schritt 1 funktioniert per Klick, per Tippen und per Tastatur (siehe K02).
  - Schritt 2: Leeres Senden zeigt 2 Feldfehler, der Fokus liegt auf `#f-name`. Bei Tel «abc» und Mail «x@» erscheinen die passenden Texte.
  - Fotos und Ausweis werden übernommen (2 Fotos + 1 Ausweis).
  - Laden: Knopf `disabled` und `aria-busy=true`. Ein zweiter Klick löst keinen zweiten POST aus (1 POST).
  - Der POST geht an `/api/schaden` und enthält `schaden-1.jpg` und das Token.
  - Erfolg (Mock `{ok:true}`): Bestätigung «Danke, Ihre Meldung ist bei uns.», der Fokus liegt auf dem `article`. Belege: `schaden-390-mock-ok-viewport.png`, `schaden-1440-mock-ok-viewport.png`.
  - Fehler und Fokus: siehe K03.
  - Vorschau ohne Endpunkt: 0 POST, «Schadenmeldung (Vorschau)» (`schaden-390-vorschau-ohne-endpunkt-viewport.png`).
  - Mock 200 mit `{ok:false}`: Es erscheint trotzdem «Angekommen», siehe N03.
- **Rückruf an `/api/rueckruf`** (Kontakt 390/1440, Flotten 390, Occasionen 390):
  - Erfolg nur bei `{ok:true}`: Es erscheint «Angekommen. Wir rufen Sie zurück, wenn möglich Montag Vormittag, Mittwoch Nachmittag. Anliegen: …», und der Knopf wird gesperrt.
  - `{ok:false}` mit 200, leere 200, 500 und Netzabbruch zeigen alle «Das hat nicht geklappt. Bitte rufen Sie uns an: 071 755 88 61.». Der Knopf bleibt aktiv und behält den Fokus.
  - 1 POST trotz Doppelklick. Der Inhalt ist korrekt: `anliegen`, `name`, `telefon`, `zeit`×2, `ort`, `t=test-token`.
  - Zeitwahl: Antippen wählt. Zweimaliges Antippen von «Freitag Nachmittag» nimmt die Wahl wieder zurück. Per Tastatur wählen Leertaste und Tab Felder aus, der Fokus ist sichtbar (2 px Kontur).
  - Validierung: «Bitte geben Sie Name und Telefon an.» mit Fokus auf Name; die Telefonregel greift. Lücken siehe N01 und N02.
  - Belege: `rueckruf-<seite>-<w>-mock-<fall>.png`, `rueckruf-kontakt-390-leer-fehler.png`, `rueckruf-kontakt-390-zeitwahl.png`, `rueckruf-kontakt-320-zeitwahl(-tastatur).png`.
- **Handy-Menü** (390 und 320, je mit und ohne reduced motion):
  - Das Menü ist ein modaler `dialog`. Nach dem Öffnen per Klick oder per Enter liegt der Fokus auf «Schliessen».
  - Tab bleibt in der Dialog-Schleife (mit dem Browser-Rahmen dazwischen, wie bei modalen Dialogen üblich).
  - Esc und der Knopf schliessen das Menü, der Fokus kehrt zu `.kopf__menu` zurück. Danach kein Überlauf.
  - **Schliessen-Symbol unter reduced motion ist «×»:** Die Striche 1 und 3 haben `matrix(0.707,±0.707,…)`, Strich 2 hat `opacity 0`. Belege: `nav-390-schliessen-symbol-rm.png`, `nav-320-schliessen-symbol-rm.png` (angesehen), `nav-390-offen-rm.png`.

## 3. Neue Befunde

| ID | P | Seite/Viewport | Beobachtung | Nutzerfolge | Beleg | Abnahmekriterium |
|---|---|---|---|---|---|---|
| N01 | P2 | Rückruf auf Kontakt, Flotten, Occasionen; 390 und 1440; nach Erfolg | Nach `{ok:true}` wird der Senden-Knopf `disabled`, solange er den Fokus hat. `document.activeElement` ist danach `BODY`. Das ist dasselbe Muster wie K03, nur im Erfolgsfall | Tastatur- und Screenreader-Nutzer verlieren die Position. Die Bestätigung wird zwar über `role=status` angesagt, aber man muss vom Seitenanfang neu navigieren | `logs/rueckruf.json` (Feld `aktiv`), `rueckruf-kontakt-390-mock-ok.png` | Nach Erfolg ist `activeElement` die Rückmeldung (`tabindex=-1`) oder ein Element im Formular, nicht `BODY` |
| N02 | P3 | Rückruf, alle Viewports, Validierung und Sendefehler | Fehlende oder ungültige Pflichtfelder zeigen nur eine Sammelmeldung mit `role=status`. Kein `aria-invalid`, kein feldbezogener Fehlertext, keine rote Markierung. Auch der Sendefehler kommt nur als `role=status`. Während des Sendens ist der Knopf weder `disabled` noch `aria-busy`; ein interner Schutz verhindert den zweiten POST trotzdem. Die Schadenmeldung macht all das richtig | Fehler werden leiser angesagt und lassen sich schlechter dem Feld zuordnen. Das Verhalten ist uneinheitlich zur Schadenmeldung | `rueckruf-kontakt-390-leer-fehler.png`, `logs/rueckruf.json` (`leer.role`, `ariaInvalid: 0`, `ladenKnopfDisabled: false`) | Pflichtfeldfehler setzen `aria-invalid` und einen Text per `aria-describedby`. Sende- und Validierungsfehler haben `role=alert`. Beim Senden ist der Knopf `aria-busy` |
| N03 | P3 | Schadenmeldung, alle Viewports, Server antwortet 200 ohne `ok:true` | `schaden.js` zeigt «Danke, Ihre Meldung ist bei uns. Angekommen …» bei jeder 2xx-Antwort, auch bei `{ok:false}`. Der Rückruf prüft dagegen `ok === true`. Der heutige Server (`astro/functions/api/schaden.js`) sendet nie 200 mit `ok:false`. Das Risiko besteht nur bei Fehlkonfiguration, etwa wenn ein Proxy oder Fallback mit 200 antwortet | Bei einem Deploy-Fehler sähe die Kundschaft «Angekommen», obwohl nichts angekommen ist | `schaden-390-mock-okfalse-viewport.png`, `logs/schaden.json` (m=okfalse) | Die Schadenmeldung zeigt «Angekommen» nur bei 2xx **und** JSON `ok:true`, sonst den Fehlerzustand aus K03 |
| N04 | P3 | Fuss, alle Seiten, 390 und 1440 | Das Etikett «heute» unter «Montag bis Freitag» steht in Linkblau `rgb(21,102,184)` (12 px, `--akzent`) und ist nicht klickbar. Das ist der Rest zu K13 und bestand schon vor dem Commit | Es sieht aus wie ein Link (klein, geringe Folge) | `fuss-1440-heute-ausschnitt.png`, `fuss-1440.png` | Kein nicht klickbares Element trägt die Linkfarbe (z. B. «heute» in `--tinte` oder `--leise`, oder als Punkt-Markierung wie beim Status) |
| N05 | P3 | Hilfetext unter Schadenmeldung und Rückruf (K08-Satz), 390, auch 1440 | Der neue Link «Datenschutzerklärung» nutzt `.textlink` (`display:inline-flex; min-height:44px`). Im Fliesstext rutscht er dadurch auf eine eigene Zeile, mit deutlich grösserem Zeilenabstand («… Mehr in der ⏎ ⏎ Datenschutzerklärung.») | Der Satz wirkt kaputt gesetzt, gerade am Ende des Formulars | `rueckruf-kontakt-390-mock-ok.png`, `schaden-390-mock-500-viewport.png` | Der Link fliesst im Satz mit normaler Zeilenhöhe (Inline-Link, wie im K09-Kriterium ausgenommen) |
| N06 | P3 (nur Vorschau) | Alle Seiten, 1440 | Die fixe Plakette unten links überdeckt beim Scrollen interaktive Elemente und Text, z. B. FAQ-`summary`, die Links «Unfall und Carrosserie» und «Felgen», den Fuss-CTA «Schaden melden» und «Anrufen», und im ersten Viewport von Schaden melden die H2 «Lieber sprechen? Rufen Sie an.» K15 verlangte das nur für 390 | Am Desktop teils verdeckte Bedienelemente während der Vorschau-Gespräche | `schaden-1440-viewport.png`, `logs/befunde.json` K15 (1440) | Bei 1440 verdeckt die Plakette keinen interaktiven Inhalt (z. B. schliessbar oder im Fluss nach dem Fuss wie am Handy) |
| N07 | P3 | Team, 1440 (und 1024), Gruppe «Aufbereitung und Finish» | Die Karte mit 1 Person zeigt das Porträt in Spaltenbreite. Name und Rolle stehen unten am Porträtrand rechts daneben, darüber und rechts bleibt eine grosse Leerfläche. Das sieht nach Fehler aus, nicht nach Absicht | Das Raster wirkt am Ende der Seite unfertig | `team-1440-ganz-rm.png`, `team-1024-ganz-rm.png` | Name und Rolle stehen bei einer Einzelperson oben oder mittig neben dem Porträt, oder die Karte entspricht den anderen (Name unter dem Bild) |
| N08 | P3 | Test-Suite astro-klar | `test/formular.test.mjs` Test «Schrittwechsel: Art wählen führt weiter …» schlägt sporadisch fehl: `locator.check: Clicking the checkbox did not change its state`. Rot im vollen `npm test` (156/157) und in 1 von 3 Einzelläufen. Die Übergabe meldet 157/157 grün. Im echten Browserablauf habe ich keinen Fehler gesehen (Klick, Tippen, Tastatur). Die Ursache ist nicht geklärt: Test-Timing oder ein Klick sehr früh nach dem Laden | Ein unzuverlässiger Test verdeckt künftige echte Fehler | `logs/npmtest.txt` (Zeile «not ok 51») | `npm test` ist in 5 Läufen hintereinander 157/157 grün |

Keine neuen P0- oder P1-Befunde.

## 4. Nicht geprüft / BLOCKED

- **Nicht Teil dieser Runde:** K05 und K06 (bewusst offen). Lücke- und Entwurf-Notizen sowie Platzhalter-Bewertungen sind weiterhin sichtbar.
- **Labormessung und Felddaten:** Lighthouse, LCP, CLS und INP sind **nicht gemessen**. Felddaten gibt es keine.
- **Kontrast:** Nicht systematisch gemessen, nur Sichtprüfung.
- **Umgebungen:** Echte Mobilbrowser (iOS Safari, Android Chrome), Screenreader, 200 % Zoom und der Betrieb ohne JavaScript sind nicht geprüft.
- **Echte Wege:** Die reale Zustellung (Cloudflare Email, Brevo), Turnstile, die Zeitfalle mit echtem Token, die 422-Wiederholung, der WhatsApp-Weg (`wa.me`) und echte Kamerafotos sind nicht geprüft.
- **Datenschutztext:** Rechtlich nicht geprüft. Die Angaben zu Cloudflare und Brevo sind vom Betrieb zu bestätigen.
- **Hoster:** Das 404-Verhalten auf dem echten Hoster ist nicht geprüft. Ich habe nur `/404.html` direkt aufgerufen.
- **Breiten:** Zwischenbreiten nur 430 (Schaden) und 1024 (Team). Eine systematische Prüfung zwischen den Breakpoints fehlt.
- **Weitere Seiten und Linie «Lack»:** `/admin/`, `/bewerten/` und die Linie «Lack» sind nicht geprüft, auch nicht deren Nutzung des geteilten `schaden.js`.
- **Tastatur:** Die Fokusreihenfolge habe ich nur auf Schaden melden (bis zur Gruppe) und im Menü stichprobenartig geprüft, keine vollständige Tab-Folge pro Seite.
