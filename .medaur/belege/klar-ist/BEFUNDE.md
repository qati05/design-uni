# QA-Befunde: Linie «Klar» heute (Ausgangslage für eine bessere Klar-Version)

- **Arbeitsstand:** Commit `569b177` (detached Worktree `/tmp/claude-0/qa-basis`), `projekt/autospeedy/astro-klar`
- **Build:** `npm ci` in `../gemeinsam` und `astro-klar`, dann `npm run build`: Exit 0, 21 Seiten
- **Auslieferung:** `python3 -m http.server 4401 -d dist`, also http://localhost:4401
- **Browser:** Chromium Headless Shell 153.0.8010.12 (Playwright 1.64.1, vorinstalliertes `/opt/pw-browsers/chromium_headless_shell-1243`)
- **Datum:** 9.11.2026, ca. 09:45–10:10 (Europe/Zurich)
- **Viewports:** 390×844 (isMobile, Touch), 1440×900, 320×700 (Überlauf), Stichprobe 1024 (Team)
- **Testbedingungen:**
  - Alle Requests zu `/api/**` sind per Playwright-Route gemockt. Es gab keine echte Sendung.
  - Das Schadenformular hat im Vorschau-Build keinen Endpunkt. Für die Tests Erfolg, Fehler und Netzfehler habe ich darum `data-endpunkt="/api/schaden"` zur Laufzeit im Browser gesetzt. Der Mock antwortet mit 200, 500 bzw. Abbruch.
  - Die Ganzseiten-Screenshots entstanden mit `reducedMotion: reduce`. Ohne diese Einstellung bleiben Einblend-Elemente in Ganzseitenaufnahmen auf `opacity:0` (z. B. Team-Bereichstitel, Fuss-Claim), und die Bilder wären irreführend.
  - Fixe Elemente (Handyleiste, Vorschau-Hinweis) erscheinen in Ganzseitenaufnahmen mitten im Bild. Das ist ein Artefakt der Aufnahme.

Belege liegen alle unter `/home/claude/design-uni/.medaur/belege/klar-ist/` (Pfade unten relativ dazu). Muster: `<seite>-<390|1440>-viewport.png`, `<seite>-<390|1440|320>-ganz.png`.

## Befundtabelle (sortiert nach Schwere)

| ID | P | Seite/Viewport/Zustand | Beobachtung | Nutzerfolge | Beleg | Vorschlag | Abnahmekriterium |
|---|---|---|---|---|---|---|---|
| K01 | P1 | Schaden melden, 390 und 320, nach Wahl der Schadenart (Schritt 2) | Horizontaler Überlauf um +40 px: `scrollWidth` 430 bei 390 bzw. 360 bei 320. Auslöser sind die versteckten, absolut positionierten `input.fotos__eingabe` (rechte Kante 430). Der fixe Kopf wird 430 breit, der Menü-Knopf liegt bei x=366–410 und ist rechts angeschnitten. Beim Laden (Schritt 1) gibt es keinen Überlauf. | Mitten in der Kernreise wackelt die Seite seitlich, der Menü-Knopf ist halb ausserhalb. Wirkt kaputt. | `schaden-390-schritt2-ganz.png` (Bild 430 px breit), `schaden-390-fehler.png` (Hamburger abgeschnitten) | Datei-Inputs im Feld einschliessen (`position:relative; overflow:hidden` am Container oder `inset:0; width:100%` statt fester Breite) | Bei 320/390/430 ist in Schritt 2, mit allen Fehlerzuständen und mit Fotos `documentElement.scrollWidth == clientWidth`, und der Menü-Knopf liegt vollständig im Viewport |
| K02 | P1 | Schaden melden, Tastatur, Schritt 1 | Fokus auf «Parkschaden» und dann `ArrowRight` wählt sofort «Unfall» und springt in Schritt 2 (Fokus auf Legende «Wie erreichen wir Sie?»). Der Grund: Jedes `change` der Radiogruppe ruft `zeige(2)` auf. Der «Weiter»-Knopf ist per CSS `display:none`. | Tastatur- und Screenreader-Nutzer können die Optionen nicht durchgehen. Sie landen mit falscher Schadenart in Schritt 2 und müssen jedes Mal zurück. | `fokus-1440-schaden-radio.png`, `fokus-1440-schaden-pfeiltaste.png` | Automatisch nur bei Zeiger- oder Touch-Klick weiter. Bei Tastaturwahl erst mit Enter/Leertaste oder mit einem sichtbaren «Weiter»-Knopf | Mit Pfeiltasten lassen sich alle 7 Arten durchgehen, ohne den Schritt zu wechseln. Enter oder «Weiter» führt mit der gewählten Art zu Schritt 2. Klick und Tippen funktionieren unverändert |
| K03 | P2 | Schaden melden, 390, Sendefehler (Mock 500 und Netzabbruch) | Die Meldung «Das Senden hat nicht geklappt … 071 755 88 61» erscheint mit role=alert, und die Daten bleiben erhalten. Der Fokus fällt danach aber auf `BODY`, weil der Knopf während des Ladens disabled war. | Tastatur- und Screenreader-Nutzer verlieren die Position und müssen vom Seitenanfang neu navigieren. | `schaden-390-fehler.png`, `schaden-390-netz.png` | Nach dem Fehler Fokus auf «Nochmals senden» oder auf die Fehlermeldung (tabindex=-1) setzen | Nach einem 500 und nach einem Netzfehler ist `document.activeElement` der Senden-Knopf oder die Fehlermeldung |
| K04 | P2 | Kontakt, 390 und 1440 | Die Kartentitel TELEFON / ADRESSE / MAIL stehen in Archivo, gesperrt, 30 px am Handy und 42 px am Desktop. Sie sind grösser als die eigentlichen Angaben (16–18 px). Die Adresse steht 4× auf der Seite (H1, Unterzeile, Karte, Fuss), das Telefon 4× (Karte, Fuss, Handyleiste, Kopf). Die H1 ist «Alte Landstrasse 63.» statt einer Aussage zum Kontakt. Am Handy liegt im ersten Viewport nur «TELEFON» ohne Nummer. | Die Etiketten schreien, die Information tritt zurück. Viel Scrollen durch Wiederholungen, bis Öffnungszeiten und Rückruf kommen. | `kontakt-390-viewport.png`, `kontakt-390-karten.png`, `kontakt-1440-ganz.png` | Kleine Etiketten (Grösse wie Hilfetext). Nummer, Adresse und Mail als grösster Text. Adresse oben nur einmal. Karten zu einem Block mit Zeiten zusammenlegen | Kartentitel kleiner als die Angabe darunter. Am Handy ist die Telefonnummer im ersten Viewport. Die Adresse steht im `main` höchstens 1× (plus Fuss) |
| K05 | P2 | Felgen, 1440 und 390, Vorher/Nachher-Regler | Das «Nachher»-Bild zeigt am unteren Felgenrand deutlich sichtbare Randsteinkratzer. Ausserdem ist es eine andere Felge und ein anderer Blickwinkel als «Vorher». Die Beschriftung «Beispielbilder …» ist klein. | Der Vergleich widerlegt das Leistungsversprechen. Das schadet der Glaubwürdigkeit genau auf der Verkaufsseite. | `l-felgen-1440-nachher-ausschnitt.png`, `l-felgen-1440-ganz.png` | Echtes Vorher/Nachher-Paar derselben Felge verwenden. Bis dahin ein makelloses Nachher-Bild oder den Regler ausblenden | Das Nachher-Bild zeigt keine sichtbaren Schäden. Vorher und Nachher zeigen dieselbe Felge oder sind klar als zwei Beispiele getrennt |
| K06 | P2 (Release-Blocker) | Kontakt, Tesla (3), Datenschutz (3), Flotten (2), Impressum, Occasionen, Schaden melden; Start (Bewertungen) | Interne «Lücke:»/«Entwurf:»-Notizen sind für Besucher sichtbar, z. B. auf Kontakt: «Lücke: Zu Samstag, Feiertagen … fand das Studio keine Angabe des Betriebs». Auf der Startseite stehen Platzhalter-Bewertungen («Zitat aus dem Google-Profil …», «Name folgt») mit 5 Sternen und «4,8 von 5 auf Google» (Wert nicht verifiziert). | Für eine Vorschau sinnvoll, live wäre es unprofessionell. Eine nicht belegte Kennzahl wäre ein Vertrauenstrick. | `kontakt-1440-ganz.png`, `start-1440-bewertungen-ausschnitt.png` | Notizen an einen Vorschau-Schalter koppeln. Bewertungsblock erst mit echten, wörtlichen Daten zeigen | Im Release-Build gibt es 0 `.luecke`-Elemente. Bewertungen und Wert stammen nachweisbar aus dem Google-Profil, sonst ist der Block aus |
| K07 | P2 | Team, 1440 (auch 1024) | Das Personenraster hat 3 Spalten à 270 px und spannt 149–991 px, bei 1128 px Inhaltsbreite (149–1277). Rechts bleiben rund 25 % leer, bei 1024 sind es 691 von 927 px. Bei 1440 sind 3 der 4 Bereichstitel per Einblendung zuerst unsichtbar. | Die Seite wirkt linkslastig und unfertig, das Team kleiner als nötig. | `team-1440-ganz.png` | Raster an Inhaltsbreite koppeln (4 Spalten ab ca. 1200 px oder `auto-fill`, min. ca. 240 px) | Bei 1440 füllt das Raster die Inhaltsbreite bis auf höchstens einen Spaltenabstand. Bei 1024 bleibt kein leerer Rest über einer Spaltenbreite |
| K08 | P2 | Schaden melden und Kontakt-Rückruf, alle Viewports | Beide Formulare nennen nur «Verantwortlich: Auto Speedy AG …» und verlinken nicht auf die Datenschutzerklärung. Occasionen hat den Link. Die Datenschutzerklärung selbst nennt Hoster, Datenbank und Mail-Dienst noch nicht (Lücke). | Pflichtpunkt revDSG «Formulare verweisen auf die Erklärung» ist nicht erfüllt. Vor Livegang ist das ein Blocker. | `schaden-390-schritt2-ganz.png`, `kontakt-1440-ganz.png`, `datenschutz-1440-ganz.png` | Satz mit Link «Mehr in der Datenschutzerklärung» unter beide Senden-Knöpfe. Anbieter ergänzen, sobald gewählt | Jedes Formular enthält einen Link `/datenschutz/`. Die Datenschutzseite nennt Hoster, Formular- und Maildienst mit Land |
| K09 | P2 | Tippziele, 390 und 320 (Stichprobe) | Unter 44 px liegen: Kontakt «076 615 44 41» 89×18, «Route planen →» 100×18, «Schaden melden» 104×18; Team-Mailadressen 167×22. Die Rückruf-Zeitfelder auf Kontakt, Flotten und Occasionen sind bei 320 nur 30 px breit. Inline-Links im Fliesstext sind nicht gewertet. | Fehltipps am Handy, gerade bei Telefonnummer und Route. | `kontakt-390-karten.png`, `team-390-mail-ausschnitt.png`, `kontakt-390-ganz.png` | Kontaktlinks als Block mit min-height 44 px. Zeitfelder bei schmalen Breiten in 2 Zeilen oder Tagesauswahl umbauen | Alle eigenständigen Links und Knöpfe auf den genannten Seiten messen bei 320/390 mindestens 44×44 px (Inline-Links im Fliesstext ausgenommen) |
| K10 | P2 | SEO: Unfall & Carrosserie, Flotten | Die Titel sind zu lang: 63 Zeichen auf `/leistungen/unfall-carrosserie/` und 62 auf `/flotten/`. Alle anderen Titel liegen bei ≤ 60, alle Beschreibungen bei ≤ 155 (Bildnachweise genau 155). | Abgeschnittener Titel in Suchergebnissen | `result`: siehe Messliste unten | Titel kürzen | Alle Titel ≤ 60 Zeichen |
| K11 | P2 | SEO, alle Seiten | `sitemap.xml` fehlt in `dist/`. Im JSON-LD (AutoBodyShop) fehlt `geo` (Koordinaten). `robots.txt` ist vorhanden, die Seiten haben `noindex` (für die Vorschau korrekt). | Lokales SEO ist unvollständig laut Prüfliste. | `dist/` | Sitemap erzeugen. `geo` aus derselben Datenquelle ergänzen | `/sitemap.xml` listet alle öffentlichen Seiten. Das JSON-LD enthält `geo.latitude/longitude` |
| K12 | P3 | Texte: Start, Leistungen, Unterseiten, Schaden melden | «Termin» kommt nur im Rückruf-Hilfetext und auf Flotten vor. «Offerte» steht nur in einer FAQ-Antwort, in keiner Überschrift und an keinem CTA. FAQ und H1 sagen «in zwei Schritten». Der sichtbare Ablauf «So geht es nach dem Melden weiter» zeigt aber 01/02/03, und Tesla zeigt «01 Melden 02 Begutachten 03 Reparieren». Das Formular hat tatsächlich 2 Schritte. «3 Tipps» habe ich im Build nicht gefunden. | Wer «Termin» oder «Offerte» sucht, findet den Einstieg nicht. Die Schrittzahl wirkt widersprüchlich. | `start-1440-ablauf-ausschnitt.png`, `start-1440-tesla-ausschnitt.png`, `schaden-1440-viewport.png` | Termin/Offerte in Hero-Unterzeile oder CTA-Hilfe aufnehmen. Ablauf-Nummern klar vom Formular trennen («Nach Ihrer Meldung: 1 … 2 …») | «Termin» und «Offerte» stehen sichtbar auf Start und Leistungen. Keine sichtbare Schrittzählung widerspricht «zwei Schritten» |
| K13 | P3 | Flotten, Unfall & Carrosserie, Tesla, Start | Nicht klickbare Listen (Flotten-Leistungen, «Was wir machen», Tesla-Tabelle) haben dasselbe Zeilenmuster mit Trennlinien und grosser Serife wie die klickbaren Listen «Weitere Leistungen» und Leistungen-Übersicht. Die Ziffern 01/02/03 stehen in Linkblau (rgb 21,102,184). | Nutzer tippen auf Zeilen, die nichts tun, und das Vertrauen in die Bedienung sinkt. | `flotten-390-liste-ausschnitt.png`, `l-unfall-390-liste-ausschnitt.png`, `start-1440-ablauf-ausschnitt.png` | Klickbare Zeilen konsequent mit Pfeil und Hover. Nicht klickbare Listen ohne Linkfarbe und mit anderer Form (z. B. Häkchenliste) | Kein nicht klickbares Element trägt die Linkfarbe oder das Pfeil-Zeilenmuster |
| K14 | P3 | Schaden melden, 390, Schritt 1 | Die Schadenart-Karten sind je nach Reihe unterschiedlich hoch: Parkschaden/Unfall 95 px, Hagel/Kratzer 120 px, Scheibe/Felge 95 px. «Etwas anderes» steht allein in der letzten Reihe. | Unruhiges Raster am wichtigsten Einstieg | `schaden-390-ganz.png` | Gleiche Mindesthöhe für alle Karten, Hilfetexte kürzen oder einspaltig auf schmalen Breiten | Alle 7 Karten bei 390 gleich hoch (±2 px) |
| K15 | P3 | Alle Seiten, 390 | Die Vorschau-Plakette (fix, unten links) überdeckt Inhalt, z. B. die Karte «Etwas anderes», die Telefonkarte auf Kontakt und Teamfotos. Am Handy stapelt sie sich über der Handyleiste. | Inhalt nicht lesbar und nicht antippbar (nur Vorschau) | `schaden-390-ganz.png`, `kontakt-390-viewport.png` | Plakette schliessbar machen oder oben in den Kopf legen | Die Plakette verdeckt bei 390 keinen interaktiven Inhalt |
| K16 | P3 | Fuss, alle Seiten | Der Fuss wiederholt den Start-Claim «Qualität, die man sieht und fährt.» riesig (ca. 130 px Serife) plus Logo. Dazu kommen ein CTA-Block und ein Kontaktblock, rund 1340 px Fusshöhe bei 1440. | Lange Seiten. Der Claim konkurriert mit der H1 und wirkt dekorativ. | `team-1440-ende-viewport.png` | Claim kleiner oder weglassen, Fuss straffen | Fuss bei 1440 ≤ ca. 700 px hoch, Claim nicht grösser als die H1 |
| K17 | P3 | Team, 390 | Mailadressen brechen mitten im Wort um («martyna.skweres@autosp / eedy.ch»). | Schlecht lesbar, wirkt wie ein Fehler | `team-390-mail-ausschnitt.png` | Umbruch nur nach `@` (`<wbr>`) oder kleinere Schrift | Keine Mailadresse bricht innerhalb von Domain oder Name |
| K18 | P3 | Flotten, 390 | Die Überschrift «Zertifizierte K + L Partner von» bricht zwischen «K» und «+ L». | Holprig, «K + L» unverständlich | `flotten-390-liste-ausschnitt.png` | `K&nbsp;+&nbsp;L` oder Text ausschreiben | «K + L» bleibt bei 320/390 auf einer Zeile |
| K19 | P3 | Start (Hero-Leiste) vs. Fuss | Die Öffnungszeiten sind unterschiedlich geschrieben: «Mo bis Fr 7.30–12.00, 13.15–17.30» gegenüber «7.30 bis 12.00 Uhr und 13.15 bis 17.30 Uhr». | Kleine Inkonsistenz | `start-1440-viewport.png` | Eine Schreibweise aus der Datenquelle | Gleiche Schreibweise überall |
| K20 | P3 | Impressum / Bildnachweise | Genannt ist nur «Hanken Grotesk, SIL OFL». Source Serif 4 und Archivo werden ebenfalls geladen (die OFL-Dateien liegen in `/fonts/`), sind aber nirgends genannt. | Unvollständige Rechteangabe | `impressum-1440-ganz.png` | Alle drei Schriften nennen | Impressum oder Bildnachweise nennen alle geladenen Schriften |
| K21 | P3 | Unfall & Carrosserie, 390/1440 | Das Bild zu «Was wir machen» zeigt einen teilweise rot folierten Transporter, also ein Folierungs-Motiv und keinen Unfallschaden. | Bild passt nicht zur Leistung | `l-unfall-390-liste-ausschnitt.png` | Unfall- oder Richtbank-Foto verwenden | Das Bild zeigt eine Carrosserie- oder Unfallreparatur |
| K22 | P3 | Mobiles Menü, 390 | Das Menü deckt nicht die volle Breite ab (links ca. 30 px Seite sichtbar). «Schaden melden» ist eine normale Zeile ohne CTA-Gewicht, die Telefonnummer ist eingerückt und grau. Die Funktion stimmt: Fokus auf «Schliessen», Esc schliesst, der Fokus kehrt zurück. | Der wichtigste Schritt geht im Menü unter. | `nav-390-offen.png` | «Schaden melden» als blauer Knopf, Telefonnummer als Knopf | Im offenen Menü sind «Schaden melden» und «Anrufen» als Knöpfe ≥ 44 px sichtbar |

## Geprüft und in Ordnung (Messwerte)

- **Konsole:** 0 Fehler und 0 Warnungen auf allen 18 Seiten × 3 Viewports.
- **Requests:** 0 fehlgeschlagene Requests, 0 Antworten ≥ 400. Der Python-Server kennt kein 404-Mapping; ich habe `/404.html` direkt geprüft.
- **Fremde Server:** Beim Laden gibt es 0 Anfragen an fremde Server. Die Schriften liegen selbst gehostet unter `/fonts/`.
- **Seitenstruktur:** Auf jeder Seite genau eine H1. `lang="de-CH"`, Canonical vorhanden, `noindex` (Vorschau).
- **Titel und Beschreibungen:** Siehe K10. Die Beschreibungen sind 101–155 Zeichen lang, die 404-Seite hat Titel 48 und Beschreibung 150.
- **JSON-LD:**
  - Auf allen Seiten parsebar. Typen: AutoBodyShop, PostalAddress, OpeningHoursSpecification, Offer/Service, WebSite, WebPage, BreadcrumbList (Unterseiten), Service pro Leistung, FAQPage.
  - Die FAQPage-Fragen stimmen 1:1 mit der sichtbaren FAQ überein (9/9, 5/5, 4/4, 3/3).
  - `sameAs` verweist auf Facebook und AutoScout24 statt auf das Google-Profil. Das ist ein Hinweis, kein eigener Befund.
- **NAP:** Name, Adresse und Telefon (Auto Speedy AG, Alte Landstrasse 63, 9450 Altstätten SG, 071 755 88 61 / +41717558861) sind in allen Fusszeilen und im JSON-LD identisch. Der Fuss ist auf allen Seiten gleich; nur Schaden melden hat einen anderen CTA-Satz.
- **Pflichtlinks:** Impressum und Datenschutz stehen in der Fusszeile jeder Seite, auch auf der 404-Seite.
- **Überlauf:** Beim Laden gibt es bei 320, 390 und 1440 keinen horizontalen Überlauf. Die einzige Ausnahme ist K01 nach der Interaktion. Der Skip-Link `a.sprung` liegt absichtlich ausserhalb.
- **Tastatur-Fokus:** Stichprobe auf Start, Schaden melden und Kontakt, je 14 Tabs. Der Fokus ist überall sichtbar (2 px durchgezogene Kontur in rgb 21,102,184). Die Reihenfolge ist logisch, der Skip-Link kommt zuerst.
- **Schadenformular:**
  - Beim Senden mit leeren Pflichtfeldern erscheinen Fehler pro Feld («Bitte geben Sie Ihren Namen an.» usw.), `aria-invalid` ist gesetzt und der Fokus springt auf das erste Fehlerfeld.
  - Bei «abc» als Telefonnummer kommt «… mindestens 9 Ziffern».
  - Während des Ladens sind `disabled` und `aria-busy` gesetzt. Ein zweiter Klick löst keinen zweiten POST aus (nur 1 Request, Doppelklickschutz wirkt).
  - Der Erfolg zeigt eine Zusammenfassung, und der Fokus liegt auf der Bestätigung.
  - Bei einem Fehler bleiben die Daten erhalten und «Nochmals senden» erscheint (aber K03).
  - Ein Erfolg mit dem Mock beweist keine reale Zustellung.
- **Performance:** Das JavaScript für Schaden melden ist rund 21.6 kB gzip (klar, zaehl, schaden, rueckruf), CSS 31 kB gzip.

## Nicht geprüft / BLOCKED

- **Lighthouse und Feldwerte:** Ich habe keine Labormessung gemacht. LCP, CLS und INP sind **nicht gemessen**, Felddaten gibt es keine.
- **Kontrast:** Nicht systematisch gemessen, nur Sichtprüfung.
- **Vorschau-Build:** Turnstile und Zeitfalle sind im Build nicht aktiv. Die reale Zustellung, den WhatsApp-Weg (öffnet `wa.me`) und den Foto- und Fahrzeugausweis-Upload habe ich nicht geprüft.
- **Rückruf-Formular:** Kontakt, Flotten und Occasionen habe ich nur visuell und auf Tippziele geprüft. Fehler-, Erfolgs- und Ladezustände sind nicht getestet.
- **Weitere Umgebungen:** Echte Mobilbrowser (iOS Safari, Android Chrome), Screenreader, 200 % Zoom und der Betrieb ohne JavaScript sind nicht geprüft.
- **Weitere Seiten:** Die Seiten `/admin/` und `/bewerten/` gehörten nicht zum Auftrag.
- **404:** Das 404-Verhalten auf dem echten Hoster ist nicht geprüft; ich habe nur `/404.html` direkt aufgerufen.
- **Zwischenbreiten:** Nur 1024 (Team) als Stichprobe. Eine systematische Prüfung zwischen den Breakpoints fehlt.

## Messliste Titel / Beschreibung (Zeichen)

| Seite | Titel | Beschreibung |
|---|---|---|
| Start | 51 | 152 |
| Leistungen | 57 | 148 |
| Unfall & Carrosserie | **63** | 148 |
| Hagel & Dellen | 45 | 134 |
| Lack | 49 | 150 |
| Scheiben | 46 | 134 |
| Felgen | 52 | 124 |
| Folierung | 44 | 101 |
| Tesla | 55 | 152 |
| Flotten | **62** | 143 |
| Occasionen | 58 | 150 |
| Team | 49 | 146 |
| Kontakt | 57 | 154 |
| Schaden melden | 48 | 151 |
| Impressum | 53 | 140 |
| Datenschutz | 55 | 148 |
| Bildnachweise | 57 | 155 |
| 404 | 48 | 150 |
