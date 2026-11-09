# B3 Übergabe: QA-Befunde der Linie «Klar» umgesetzt

Format nach `medaur/BETRIEB-DE.md`, Abschnitt «Übergabe — vor Integration».

**Task / Agent / Arbeitsordner / Ausgangsstand:** B3 · Medaur-Frontend (einziger Schreiber) · `/home/claude/design-uni`, Branch `claude/autospeedy-v2`, Basis HEAD `163d72b` (Paket 1 Formulare und Paket 2 Cockpit sind drin) · keine Commits, kein Push, keine Unteragenten. Entscheid Roni 09.11.2026: alle Befunde aus `.medaur/belege/klar-ist/BEFUNDE.md` ausser K05 und K06.

**Hinweis zum Schreibbereich:** `.medaur/schreibbereiche.json` hat keinen Eintrag für B3. Mein Agententyp fiel nicht unter die Hook-Sperre (Schreiben ging). Ich habe trotzdem nur Dateien der Linie «Klar» und zwei geteilte Dateien angefasst (siehe unten). Bitte den Eintrag nachtragen oder diese Übergabe als Ersatz nehmen.

## Ergebnis je Befund

| K | Was geändert | Datei(en) | Wie geprüft |
|---|---|---|---|
| K01 P1 | Die versteckten Datei-Felder für Fotos und Fahrzeugausweis bekamen über `.feld input` volle Breite, Polster und 48 px Höhe und lagen ohne Bezugsrahmen. Jetzt ist das Feld `position:relative`, das Eingabefeld ist 1 px gross und hat `left/top 0`, kein Polster und keinen Rand. | `astro-klar/public/css/klar.css` | Test K01: bei 320/390/430 in Schritt 2, mit allen Feldfehlern und mit Foto ist `scrollWidth == clientWidth`. Der Menü-Knopf liegt ganz im Bild (vorher 366–410 bei 390, jetzt 326–370). |
| K02 P1 | Pfeiltasten in der Radiogruppe wählen nur noch aus und bleiben in Schritt 1. **Enter** auf einer Art oder der «Weiter»-Knopf führt mit der Wahl weiter. Er erscheint, sobald eine Art gewählt ist (bestehendes CSS). Klick, Tippen, Leertaste und `?art=` führen wie bisher sofort weiter. | `astro/public/js/schaden.js` (geteilt, wird beim Bau nach `astro-klar/public/js/` kopiert) | Test K02: alle 7 Arten per Pfeil, kein Schrittwechsel. Enter führt mit «Etwas anderes» zu Schritt 2. Zurück, dann Weiter per Tastatur. Tippen auf eine Karte führt weiter. Linie «Lack» im Browser gegengeprüft (Pfeile bleiben in Schritt 1, Enter und Klick führen weiter, 0 Fehler). |
| K03 P2 | Nach einem Sendefehler kommt der Fokus auf «Nochmals senden» zurück. Liegt der Knopf ausserhalb des Bildes, wird ruhig dorthin gescrollt. | `astro/public/js/schaden.js` | Test K03: Mock mit 500 und mit Netzabbruch, `activeElement` ist der Senden-Knopf, die Angaben bleiben erhalten. |
| K04 P2 | Ursache: `.abschnitt h2` überschrieb die Etiketten-Regel. Neu sind die Etiketten 13 px, die Angaben (Nummer, Adresse, Mail) 22 px. H1 «So erreichen Sie uns.», Unterzeile «Auto Speedy AG in Altstätten SG, im Rheintal.» Die Adresse steht im Inhalt nur noch in der Karte. Die Karten habe ich nicht zu einem Block zusammengelegt, weil das nicht nötig war. | `astro-klar/src/pages/kontakt.astro`, `klar.css` | Test K04: Etikett kleiner als die Angabe (390, 1440). Am Handy ist die Nummer im ersten Bild, über der Handyleiste (unten bei 682 px). Adresse 1× im `main`. |
| K07 P2 | Ab 961 px hat das Team-Raster 3 Spalten (die Gruppen haben je 3 Personen). Eine Gruppe mit 1 Person (`data-anzahl="1"`) steht als breite Karte: Porträt in Spaltenbreite, Name daneben. Die Einblendung der Bereichstitel habe ich nicht geändert, siehe unten. | `astro-klar/src/pages/team.astro`, `klar.css` | Test K07: bei 1440 und 1024 ist der Rest rechts ≤ Spaltenabstand (vorher 25 %). |
| K08 P2 | In Schadenmeldung (auch im `noscript`-Weg) und Rückruf (Kontakt, Flotten, Occasionen) steht «Mehr in der Datenschutzerklärung» mit Link `/datenschutz/`. Die Datenschutzerklärung ist auf den Mailweg aus B1 umgeschrieben: neuer Abschnitt «Hoster» (Cloudflare Pages, Cloudflare, Inc., USA) und «Schadenmeldung und Rückruf» (direkt als Mail, keine Datenbank, Versand an den Betrieb über Cloudflare Email, Drossel nur mit Hash der IP). Die Bestätigung an die Kundschaft läuft über Brevo (Sendinblue SAS, Frankreich). Der überholte Satz «Werkstatt-System (Datenbank in Zürich)» ist entfernt. Die Lücke-Notizen **dieser Seite** sind angepasst und als «Vom Betrieb zu prüfen» markiert (Verträge, Ort der Verarbeitung, Log-Dauer, Löschfrist im Postfach, Rechtsprüfung). Das ist ein bewusster Eingriff für K08, nicht für K06. | `astro-klar/src/pages/datenschutz.astro`, `src/components/Rueckruf.astro`, `src/pages/schaden-melden.astro` | Statischer Test K08: jedes `<form>` auf den 4 Seiten verlinkt `/datenschutz/`. Die Seite nennt alle drei Dienste mit Land, die Datenbank kommt nicht mehr vor. |
| K09 P2 | Kontakt: Mobilnummer, «Route planen» und «Schaden melden» sind eigene Tippziele mit mindestens 44 px. Team: Mail-Links 44 px hoch. Rückruf-Zeitwahl bis 560 px: «Vormittag/Nachmittag» als eigene Zeile über fünf Feldern (bei 320 je 45 px statt 30). | `klar.css`, `team.astro` | Test K09: alle eigenständigen Links, Knöpfe und Zeitfelder auf Kontakt, Team, Flotten und Occasionen sind bei 320/390 ≥ 44 × 44. Inline-Links im Fliesstext sind wie bei QA ausgenommen. Kein Querscrollen. |
| K10 P2 | Unfall: «Unfall und Carrosserie für alle Marken \| Auto Speedy» (52). Flotten: «Firmen und Flotten: Carrosserie in Altstätten \| Auto Speedy» (59), in der geteilten `texte.json`, damit auch «Lack» nicht mehr über 60 liegt. Der Bau-HINWEIS «Titel 62» ist in beiden Linien weg. | `astro-klar/src/daten/leistungen.ts`, `astro/src/content/texte.json` | Statischer Test K10: alle Titel im Bau ≤ 60. `npm test` in astro grün. |
| K11 P2 | **Kein Code nötig:** Die Sitemap entsteht schon in `astro/bau/dateien.mjs`, aber nur im Livegang. In der Vorschau fehlt sie absichtlich (Regel text-uni TI8/TI11, eigener Test «keine Sitemap in der Vorschau»). Darum keine zusätzliche Route `sitemap.xml.ts`: Sie würde diese Regel brechen und doppelt erzeugen. `geo` bleibt leer, weil `betrieb.json` `geo: null` hat; das Layout setzt es schon jetzt, sobald Koordinaten da sind. | – (Tests) | Live-Testbau (bestehender Test, ergänzt): Die Sitemap listet alle 17 öffentlichen Seiten, ohne 404, Editor und Druckseite. Neuer Test K11: kein `geo` im JSON-LD. |
| K12 P3 | Ablauf heisst jetzt «Nach Ihrer Meldung geht es so weiter.» und zählt erst nach der Meldung: 01 Wir rufen zurück · 02 **Offerte und Termin** («Was die Reparatur kostet, hängt vom Schaden ab. Die Offerte und den Termin besprechen wir persönlich mit Ihnen.») · 03 Wir reparieren. Das ist nur Belegtes: FAQ und Roni 07.11. (Offerte persönlich, keine Fixpreise), Rückruf-Hilfetext (Kosten und Termin besprechen wir). Der Ablauf steht neu auch auf `/leistungen/`. Der Tesla-Teil auf Start zeigt die Ziffern 01/02/03 nicht mehr (Entwurf-Hinweis bleibt). FAQ «Wie melde ich einen Schaden?» beschreibt die zwei Schritte konkret und nennt Offerte und Termin; an der Reihenfolge in `faq.ts` ist nichts geändert. Slogan und Einleitung des Hero sind unverändert. | `src/components/Ablauf.astro`, `TeslaTeil.astro`, `src/pages/leistungen/index.astro`, `src/daten/faq.ts` | Statischer Test K12: «Termin» und «Offerte» sichtbar auf Start und `/leistungen/`, kein `class="ziffer"`, Formular «In zwei Schritten». |
| K13 P3 | Ablauf-Ziffern und Tesla-Ziffern sind in `--leise` statt Linkblau. Flotten-Liste und Tesla-Liste (`/tesla/`) sind Häkchenlisten ohne Trennlinien. «Was wir machen» hat am Handy Absätze statt Zeilen mit Trennlinien. Die Faktentabelle `.spec` bleibt eine Tabelle (dt/dd, ohne Pfeil, ohne Linkfarbe). | `klar.css`, `DESIGN.md` (Zeile Ablauf und neue Regel «Nicht klickbare Listen») | Test K13: auf Start, Leistungen, Flotten, Tesla und Unfall trägt kein nicht klickbares Element `rgb(21,102,184)`. |
| K14 P3 | `.arten` mit `grid-auto-rows: 1fr`, «Etwas anderes» über die ganze letzte Reihe | `klar.css` | Test K14: 7 Karten bei 390 alle 120 px (vorher 95/120). |
| K15 P3 | Die Plakette steht im HTML nach dem Fuss. Am Computer bleibt sie fix unten links wie bisher. Bis 960 px ist sie eine ruhige dunkle Zeile unter dem Fuss und schwebt nicht mehr. | `src/layouts/Klar.astro`, `klar.css` | Test K15: bei 390 auf 4 Seiten `position: static`, direkt nach `<footer>`. |
| K16 P3 | Slogan (Wortlaut gleich) von 150 px auf 26–36 px, neben dem Logo als «Unterschrift» unter den Öffnungszeiten. Polster und Abstände des Fusses kleiner. | `src/components/Fuss.astro`, `klar.css` | Test K16: Fuss bei 1440 672 px hoch (vorher 1343). Slogan ≤ H1 auf Start, Team, Impressum und Schaden melden (390 und 1440). Bestehende Fuss-Tests grün. |
| K17 P3 | Mail umbricht nur nach «@» (`<wbr>`, `overflow-wrap: normal`), unter 400 px in 13 px | `team.astro`, `klar.css` | Test K17: Name und Domain je auf einer Zeile (320/390). |
| K18 P3 | `K&nbsp;+&nbsp;L` | `src/pages/flotten.astro` | Test K18: «K + L» auf einer Zeile (320/390). |
| K19 P3 | Eine Schreibweise aus `texte.json` (`mikrotexte.zeiten`): «Mo bis Fr 7.30 bis 12.00 Uhr und 13.15 bis 17.30 Uhr». Neue Hilfsdatei, die Faktenleiste, Fuss, Kontakt-Tabelle, FAQ, `llms.txt` und die Rückruf-Zeitwahl nutzen. | neu `src/daten/zeiten.ts`, `Faktenleiste.astro`, `Fuss.astro`, `Zeiten.astro`, `faq.ts`, `llms.txt.ts`, `Rueckruf.astro` | Statischer Test K19. Die Statuszeile «Jetzt offen, bis 12.00 Uhr» (klar.js) ist unverändert. |
| K20 P3 | Impressum nennt Source Serif 4, Hanken Grotesk und Archivo (SIL OFL 1.1, in den OFL-Dateien unter `/fonts/` geprüft) und verweist für Platzhalter-Fotos auf die Bildnachweise | `src/pages/impressum.astro` | Statischer Test K20 |
| K21 P3 | «Was wir machen» auf Unfall zeigt jetzt `werkstatt` (Auto mit abgebauter Front, Stossstange auf dem Werkzeugwagen; Foto des Betriebs, bisher ungenutzt) statt des teilfolierten Transporters. Neues Alt. | `src/pages/leistungen/unfall-carrosserie.astro` | Statischer Test K21, Sichtprüfung im Screenshot. Das Foto gibt es nur bis 960 px Breite, am grossen Bildschirm ist es darum etwas weicher. |
| K22 P3 | Menü-Blatt bis 560 px volle Breite. «Schaden melden» ist ein blauer Pillen-Knopf (52 px, ohne Pfeil). «Anrufen 071 755 88 61» ist ein Knopf auf Fläche 2 (48 px). Fokus, Esc und Rückkehr sind unverändert. | `src/components/Kopf.astro`, `klar.css` | Test K22: Blatt 0–390, beide Knöpfe ≥ 44 px mit Grundfarbe, Esc schliesst |

## Nicht gelöst und warum

- **K05** (Felgen, Vorher/Nachher): ausgenommen, braucht ein neues Foto vom Betrieb.
- **K06** (Lücke- und Entwurf-Notizen, Platzhalter-Bewertungen, «4,8 von 5»): ausgenommen, braucht Angaben vom Betrieb. Nichts entfernt, nichts geändert. Einzige Ausnahme sind die Lücke-Texte **auf der Datenschutzseite**: Die alten sprachen von «Hoster noch nicht gewählt» und «Supabase, Region Zürich» und widersprachen dem neuen Mailweg (K08).
- **K07, Teil Einblendung:** Dass 3 von 4 Bereichstiteln bei 1440 zuerst unsichtbar sind, kommt von der Bewegung «Feder» (Einblenden beim Scrollen). Laut Auftrag bleibt sie unverändert.
- **K11 `geo`:** bleibt leer, bis der Betrieb Koordinaten liefert (`betrieb.json` → `geo`).

## Schnittstelle, Assets, Abhängigkeiten

- Keine neue Abhängigkeit, kein neues Asset (das Foto `werkstatt` liegt schon in `astro/public/bilder/`), keine neue Umgebungsvariable.
- Formular-Felder, Endpunkte und Werte der Zeitwahl (`ZEITEN` in `gemeinsam/rueckruf.js`) sind unverändert. Nur die sichtbaren Zeitangaben in der Zeitwahl haben die neue Schreibweise.

## Geänderte Dateien

- **Geteilt mit «Lack»:**
  - `projekt/autospeedy/astro/public/js/schaden.js` (K02, K03)
  - `projekt/autospeedy/astro/src/content/texte.json` (nur Titel `flotten`, K10)
- **Linie «Klar»** (`projekt/autospeedy/astro-klar/`):
  - `public/css/klar.css`
  - `DESIGN.md`
  - `src/layouts/Klar.astro`
  - `src/components/`: `Ablauf.astro`, `Faktenleiste.astro`, `Fuss.astro`, `Kopf.astro`, `Rueckruf.astro`, `TeslaTeil.astro`, `Zeiten.astro`
  - `src/daten/`: `faq.ts`, `leistungen.ts`, `zeiten.ts` (neu)
  - `src/pages/`: `datenschutz.astro`, `flotten.astro`, `impressum.astro`, `kontakt.astro`, `leistungen/index.astro`, `leistungen/unfall-carrosserie.astro`, `llms.txt.ts`, `schaden-melden.astro`, `team.astro`
  - `test/`: `qa-klar.test.mjs` (neu, 12 Browser-Tests), `statisch.test.mjs` (+7 Tests, Sitemap-Prüfung im Live-Test), `formular.test.mjs` (1 Import-Zeile)
- **Diese Übergabe:** `projekt/autospeedy-v2/medaur/B3-UEBERGABE.md`

## Ausgeführte Prüfungen

| Befehl | vorher | nachher |
|---|---|---|
| `cd projekt/autospeedy/astro-klar && npm run build` | 21 Seiten, 1 HINWEIS (Titel flotten 62) | Exit 0, 21 Seiten, 0 FEHLER, 0 HINWEIS |
| `CHROME=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux64/chrome \| head -1) npm test` (astro-klar) | 138/138 | **157/157 grün** (+12 Browser, +7 statisch) |
| `cd projekt/autospeedy/astro && npm test` | 53/53 | **53/53 grün** |
| `npx astro build --outDir <scratch>` in `astro` (Lack) und Browser-Probe Schadenformular Lack | – | Exit 0, 0 HINWEIS. Pfeile bleiben in Schritt 1, Enter und Klick führen weiter, 0 Seitenfehler |

Belege: Die Protokolle `test-klar.txt`, `test-lack.txt`, `build.txt` und die Screenshots (`bilder1/`, `fuss-1440.png`, `kontakt-390.png`, `nav-390.png`, `zeit-320.png`) liegen im Scratchpad dieser Sitzung: `/tmp/claude-0/-home-claude-design-uni/74937679-c533-5ae7-8450-0374beafdd1e/scratchpad/`. Für die Abnahme bitte selbst neu laufen lassen.

## Nicht geprüft / offene Risiken

- **Gefunden, nicht behoben** (ausserhalb der Befunde; betrifft den reduced-motion-Block, der unverändert bleiben sollte): Unter «Bewegung reduzieren» zeigt der Schliessen-Knopf im Handy-Menü «=» statt «×». Grund: `klar.css` im Layer `bewegung`, `.kopf__menu-icon span { transform: none }` gilt auch für `.blatt__zu`. Behebung: dort `.blatt.ist-auf .blatt__zu .kopf__menu-icon span:nth-child(1|3)` wie bei `.kopf__menu[aria-expanded="true"]` ergänzen. Das ist ein statischer Zustand, keine Bewegung. Bitte entscheiden.
- Am Computer liegt die fixe Plakette weiter unten links und kann dort den Fuss überdecken. K15 verlangte nur 390.
- Lighthouse, echte Mobilbrowser, Screenreader und 200 % Zoom habe ich nicht geprüft. Die Fokusreihenfolge habe ich nur per Test geprüft, keine eigene Tab-Stichprobe.
- Die Linie «Lack» habe ich nur auf das geteilte `schaden.js` im Browser geprüft. Ihr Datenschutz und ihre Formulare haben noch keinen Link zur Datenschutzerklärung und nennen noch den alten Weg. Das liegt nicht in diesem Auftrag.
- Die Datenschutz-Texte zu Cloudflare und Brevo stammen aus dem technischen Stand (`gemeinsam/mail.js`, `schutz.js`, PRODUCT.md «Cloudflare Pages"). Rechtlich geprüft sind sie nicht. Sie sind als «vom Betrieb zu prüfen» markiert und werden im Livegang mit den Lücken ausgeblendet. Die Sätze selbst bleiben.
- Das Bild `werkstatt` gibt es nur bis 960 w. Wird es scharf gebraucht, braucht es eine grössere Quelle.

## Integrationshinweis

Lokale Dateien im Arbeitsbaum von `claude/autospeedy-v2`, nicht committet. Bitte nur die Pfade oben übernehmen. `astro-klar/public/js/schaden.js` und `dist/` sind Bau-Ausgaben.

Wünsche an den Lead:

1. `astro-klar/package.json`: `test/qa-klar.test.mjs` ins `test`-Skript aufnehmen und danach die Import-Zeile in `formular.test.mjs` entfernen.
2. B3 in `.medaur/schreibbereiche.json` nachtragen oder schliessen.
3. Über die Fehlerbehebung beim Schliessen-Symbol unter reduced motion entscheiden (siehe oben).

**Bereit für unabhängige Abnahme:** ja. Alle Abnahmekriterien ausser K05 und K06 sind durch Tests belegt, alle bisherigen Tests sind grün. K11 ist durch die bestehende Live-Sitemap erfüllt, nicht durch neuen Code. `geo` bleibt bewusst leer.
