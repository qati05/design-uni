# F1 Übergabe: Korrekturrunde 1 der Linie «Klar»

Format nach `medaur/BETRIEB-DE.md`, Abschnitt «Übergabe — vor Integration».

**Task / Agent / Arbeitsordner / Ausgangsstand:** F1 Korrekturrunde 1 · Medaur-Frontend (einziger Schreiber, Claim vom Lead bestätigt) · `/home/claude/design-uni`, Branch `claude/autospeedy-v2`, Basis HEAD `4b0112b` · keine Commits, kein Push, keine Unteragenten. Grundlage: QA-Befunde `.medaur/belege/klar-abnahme-1/QA.md` (Abschnitt 3, N01–N08) und Kritiker-Befunde C02, C04–C06, C08–C10 (vom Lead im Auftrag zusammengefasst), dazu `/bewerten/` aus der Sitemap.

**Hinweis zum Schreibbereich:** `.medaur/schreibbereiche.json` hat keinen Eintrag für F1. Schreiben ging, der Hook griff nicht. Ich habe nur im zugewiesenen Bereich geschrieben: `projekt/autospeedy/astro-klar/**`, `projekt/autospeedy/astro/public/js/{rueckruf,schaden}.js`, `projekt/autospeedy/astro/bau/dateien.mjs` und diese Datei. Bitte den Eintrag nachtragen oder diese Übergabe als Ersatz nehmen.

**Nicht angefasst (laut Auftrag):** Slogan und Einleitung, Aussagen zur Tesla-Zulassung (C03), Aufbau von Schritt 2 der Schadenmeldung (C01), Inhalte zu K05/K06, Bewegung «Feder». `package.json` und Lockfile sind unverändert. Die neuen Tests stehen in Dateien, die `npm test` schon aufruft.

## Ergebnis je ID

| ID | Änderung | Datei(en) | Beleg |
|---|---|---|---|
| N01 P2 | Nach Erfolg kommt der Fokus zuerst auf die Rückmeldung (`tabindex=-1`). Erst danach wird der Knopf gesperrt. `activeElement` ist nicht mehr `BODY`. | `astro/public/js/rueckruf.js` (geteilt, wird beim Bau nach `astro-klar/public/js/` kopiert) | Test `rueckruf.test.mjs` «N01/N02: … Fokus auf der Rückmeldung» |
| N02 P3 | Name und Telefon bekommen bei einem Fehler `aria-invalid="true"`, einen Fehlertext am Feld (`.feld-fehler`, verknüpft über `aria-describedby`) und eine rote Markierung (bestehendes CSS `.feld input[aria-invalid]`). Der Fokus springt auf das erste Fehlerfeld. Validierungsfehler und Sendefehler kommen mit `role=alert`. Beim Senden trägt der Knopf `aria-busy="true"`. Er wird dabei nicht `disabled`, damit der Fokus bleibt; einen zweiten Klick fängt die Sperre `sendet` ab. Die Telefonnummer im Sendefehler ist ein `tel:`-Link. Gleiches Muster wie in der Schadenmeldung. | `astro/public/js/rueckruf.js` | Tests «N02/C08 …», «N01/N02 …» und «Server antwortet 200 ohne ok:true / 502» (mit role=alert, Nummer als Link, Fokus auf dem Knopf) |
| N03 P3 | Die Schadenmeldung zeigt «Angekommen» nur noch bei 2xx **und** JSON `ok:true`. Sonst kommt der Sendefehler aus K03. | `astro/public/js/schaden.js` | Test `qa-klar.test.mjs` «N03»: 200 mit `{"ok":false}` und 200 mit HTML ergeben den Fehler ohne Bestätigung, 200 mit `{"ok":true}` ergibt «Angekommen» |
| N04 P3 | «heute» im Fuss steht in `--leise`, nicht mehr in Linkblau | `astro-klar/public/css/klar.css` | Test «N04» (390, 1440) |
| N05 P3 | In `.hilfe` ist der Link `a.textlink` inline (`display:inline`, keine 44-px-Mindesthöhe) und unterstrichen. Er fliesst im Satz mit, auf Kontakt, Flotten, Occasionen und Schaden melden. | `klar.css` | Test «N05»: `display:inline`, Höhe ≤ 2 Textzeilen. Der K09-Test (Inline-Links ausgenommen) bleibt grün. |
| N06 P3 | Die Vorschau-Plakette steht jetzt in allen Breiten im Fluss als ruhige dunkle Zeile nach dem Fuss, wie am Handy (K15). Sie schwebt nirgends mehr. | `klar.css` | Test «N06» (1440, 4 Seiten: `position:static`, direkt nach `<footer>`). Test K15 (390) bleibt grün. |
| N07 P3 | Bei einer Einzelperson (Gruppe «Aufbereitung und Finish») stehen Name und Rolle mittig neben dem Porträt (`align-items:center`), nicht mehr unten am Rand. Die breite Karte bleibt, damit K07 (keine leere Spalte) weiter gilt. | `klar.css` | Test «N07» (1440 und 1024: Text rechts vom Bild, Mitte ±4 px). K07 bleibt grün. |
| N08 P3 | **Ursache:** Die Eingaben von Karten, Chips, Zeitwahl und Schaltern waren 1 × 1 px gross und lagen oben links in der Karte. Bei der Karte ist das die gerundete Ecke (Radius 14 px). `check({ force: true })` klickt in die Mitte dieses Pixels (z. B. x 40.5 / y 565.94). Rundet der Browser den Punkt auf ganze Pixel, liegt er ausserhalb des Inputs, in der abgerundeten Ecke, und trifft das Raster `.arten` dahinter. Darum gab es nichts zu ändern («did not change its state»). Das betrifft nur die linke Spalte (Parkschaden, Hagel, Scheibe, Etwas anderes) und hängt vom Bruchteil der Position ab, also von Schrift- und Ladezeit. Nachgemessen mit `elementFromPoint`: Mitte = Input, gerundet = `.arten`. **Lösung:** Das unsichtbare Input deckt jetzt die ganze Fläche ab (`inset:0; width/height:100%; opacity:0`). Optisch ändert sich nichts. Der Test klickt ohne `force`, Playwright prüft also Sichtbarkeit, Stillstand und Trefferfläche selbst. Es gibt kein Retry. | `klar.css` (`.art`, `.chips__wahl`, `.zeitwahl__feld`, `.schalter`), `test/formular.test.mjs` | 5 volle Läufe `npm test` hintereinander, siehe unten |
| C02 P2 | Die Schadenmeldung hat direkt über dem Senden-Knopf eine eigene Stelle `[data-sende-rueckmeldung]`. Dort stehen «Wird gesendet …» und der Sendefehler, nicht mehr unter «Zurück». Die Telefonnummer ist ein `tel:`-Link. Nach dem Fehler bekommt «Nochmals senden» den Fokus, und Meldung und Knopf werden zusammen ins Bild gescrollt. Die allgemeine Rückmeldung (Schritt 1, Feldfehler) bleibt. Linie «Lack» hat diese Stelle nicht; dort bleibt alles in der allgemeinen Rückmeldung, nur mit klickbarer Nummer. | `astro-klar/src/pages/schaden-melden.astro`, `astro/public/js/schaden.js`, `klar.css` (Fehler mit «!»-Marke) | Test K03 erweitert (500 und Netzabbruch, 390): Meldung `role=alert` direkt vor dem Knopf, oben ≥ 0 und Knopf unten ≤ Bildhöhe, Nummer als Link, allgemeine Rückmeldung verborgen. Screenshot geprüft (390). |
| C04 P2 | Ab 961 px ist das Foto auf Kontakt und Team `clamp(220px, 34svh, 320px)` hoch (vorher bis 620). Die Abstände darunter sind kleiner. Auf Team ist der Bildausschnitt nach oben gesetzt, damit das Gesicht drin bleibt. Am Handy ist alles wie bisher. | `klar.css` | Test «C04»: bei 1440 × 900 enden die Karten Telefon und Adresse bei ≤ 900 (Screenshot: unten bei 694). Auf Team beginnt das erste Porträt im ersten Bild. Test K04 bleibt grün. |
| C05 P2 | Die Handyleiste auf der Tesla-Seite erscheint erst, wenn der Hero-Knopf «Tesla-Schaden melden» aus dem Bild ist (wie auf Start und den Leistungsseiten). Ihr Knopf «Schaden melden» führt auf der Tesla-Seite zu `/schaden-melden/?fahrzeug=tesla` (Zählname `anfrage-tesla`). | `astro-klar/public/js/klar.js` (Ziel der Beobachtung), `src/layouts/Klar.astro` | Test «C05» (390): oben `leiste-an` aus, Link mit Tesla-Vorauswahl, nach dem Hero an |
| C06 P3 | Die Chips «Was ist passiert?» kommen jetzt aus derselben Quelle wie Schritt 1 des Formulars (`astro/src/content/arten.json`). Das sind alle 7: Parkschaden, Unfall, Hagel, Kratzer oder Lack, Scheibe, Felge, Etwas anderes, je mit `?art=`. Tesla steht darunter als eigener Link «Tesla? Hier entlang →» auf `/schaden-melden/?fahrzeug=tesla`. | `astro-klar/src/components/Hero.astro`, `klar.css` | Test «C06»: Chips = Werte der Radios im Formular, Tesla-Link mit Ziel, kein Querscrollen (390). Screenshot geprüft. |
| C08 P3 | Der Feldfehler verschwindet während der Eingabe, sobald der Wert gilt. Ist kein Feld mehr fehlerhaft, verschwindet auch der Sammelhinweis. Erfolg und Fehler sehen verschieden aus: Erfolg grün mit Häkchen (`rueckmeldung--ok`), Fehler rot mit «!»-Marke (`rueckmeldung--fehler`). Siehe auch N01/N02. | `astro/public/js/rueckruf.js`, `klar.css` | Test «N02/C08»: «079 12» → Fehler bleibt, «079 123 45 67» → kein `aria-invalid`, kein Fehlertext, Sammelhinweis weg. Erfolg hat einen anderen Hintergrund als der Fehler. Screenshots geprüft (Erfolg, Feldfehler). |
| C09 P3 | Die Tesla-Modelle sind eine Häkchenliste (dieselbe Form wie die Tesla-Liste aus K13), keine Knopf-Chips mehr. Der Abschnitt nutzt die volle Inhaltsbreite. «Modelle» und «Gut zu wissen» stehen am Computer nebeneinander. Unten fällt das Polster weg, darum gibt es keinen Leerblock vor den Fragen. Der Wortlaut ist unverändert. | `astro-klar/src/pages/tesla.astro`, `klar.css` | Test «C09» (1440): keine `.modelle span`, 4 Listenpunkte, zwei Spalten auf gleicher Höhe, Abstand bis zur FAQ-Überschrift ≤ 200 px. K13 bleibt grün. Screenshot geprüft. |
| C10 P3 | Die H1 der Leistungsseite hat `max-width: 20ch` statt 15ch (`text-wrap: balance` bleibt). «Vom Blechschaden bis zum Chassisschaden.» steht bei 1440 auf 2 Zeilen. | `klar.css` | Test «C10»: alle 6 Leistungsseiten bei 1440 haben ≤ 3 Zeilen. Screenshot geprüft. |
| bewerten | `/bewerten/` ist auch im Livegang `noindex` (Layout-Prop `indexierbar={false}`, kein canonical). In `_headers` steht `/bewerten/*` mit `X-Robots-Tag: noindex` (deckt die Druckvorlage mit ab). Die Sitemap lässt `bewerten/` weg und dazu jede Seite mit noindex-Meta. Linie «Lack»: Ihre `/bewerten/` war schon noindex. Sie fällt jetzt ebenfalls aus der Sitemap und bekommt die Kopfzeile. Sonst bleibt ihr Bau gleich. | `astro/bau/dateien.mjs`, `astro-klar/src/layouts/Klar.astro`, `src/pages/bewerten/index.astro` | Test «bewerten» (Vorschau-Bau: Meta, kein canonical, `_headers`). Live-Testbau in `statisch.test.mjs` erweitert: Sitemap ohne `/bewerten/`, `/bewerten/` live mit noindex. `npm run build` und `npm test` in `astro` grün. |

## Schnittstelle, Assets, Abhängigkeiten

- Neues optionales Element für `schaden.js`: `[data-sende-rueckmeldung]` im Formular. Fehlt es (Linie «Lack»), geht alles wie bisher in `[data-rueckmeldung]`.
- `rueckruf.js` braucht kein neues Markup. Die Fehlertexte am Feld legt es selbst an, in `.feld` oder sonst im Elternelement (in «Lack» `.rueckruf__felder > div`). «Lack» hat dafür kein eigenes CSS; dort ist der Text sichtbar, aber nicht rot.
- `Klar.astro` hat die neue Prop `indexierbar` (Standard `true`).
- Keine neuen Assets, keine neuen Abhängigkeiten.

## Ausgeführte Prüfungen

- `npm run build` in `astro-klar`: ohne Fehler, 21 Seiten.
- `CHROME=… npm test` in `astro-klar`, **5 Läufe hintereinander** mit demselben Bau: Ergebnis siehe Tabelle unten. Vorher 157 Tests, jetzt 170 (neue Tests: N02/C08, N01/N02 im Rückruf; N03, N04, N05, N06, N07, C04, C05, C06, C09, C10, bewerten in `qa-klar.test.mjs`).
- `npm run build` und `npm test` in `astro` (Linie «Lack»): 53/53 grün.
- «Lack» im Browser (dist): Rückruf leer absenden → Sammelhinweis, 2 × `aria-invalid`, Fokus auf Name, keine Skriptfehler. Schadenmeldung mit 500 → Fehler mit `tel:+41717558861`-Link in der allgemeinen Rückmeldung.
- Ursache N08 belegt: `elementFromPoint` an der Mitte des 1-px-Inputs gibt das Input, am gerundeten Punkt gibt es `.arten` (linke Kartenspalte). Vorher in 8 Einzelläufen nicht nachgestellt, weil es von der Rundung abhängt.

| Lauf `npm test` (astro-klar) | Tests | grün | rot |
|---|---|---|---|
| 1 | 170 | 170 | 0 |
| 2 | 170 | 170 | 0 |
| 3 | 170 | 170 | 0 |
| 4 | 170 | 170 | 0 |
| 5 | 170 | 170 | 0 |

Die Läufe hatten je ein eigenes Protokoll in der Sitzungsablage (`scratchpad/laeufe/lauf-1.txt` bis `lauf-5.txt`); sie sind nicht dauerhaft. QA sollte die 5 Läufe für ihre Abnahme selbst wiederholen.

## Nicht geprüft / offene Risiken

- Die Screenshots meiner Sichtprüfung liegen nur in der Sitzungsablage, nicht unter `.medaur/belege/` (das ist der Bereich der QA). Die unabhängige QA sollte die Seiten neu aufnehmen.
- Safari/iOS und Firefox habe ich nicht geprüft, nur Chromium. Das Input über der ganzen Fläche ist ein übliches Muster, VoiceOver habe ich aber nicht getestet.
- Rückruf-Fehlertexte in der Linie «Lack» haben kein rotes Aussehen, weil das CSS von «Lack» nicht in meinem Bereich liegt. Die Funktion ist da (aria-invalid, Text, role=alert).
- N07: Die breite Karte mit 1 Person bleibt rechts offen. Das erfüllt das QA-Kriterium «mittig neben dem Porträt». Ob eine schmale Karte (Name darunter) besser wirkt, ist eine Designfrage; sie würde K07 brechen.
- C06: «Tesla? Hier entlang» führt wie der bisherige Chip ins Formular mit Tesla-Vorauswahl, nicht auf `/tesla/`. Falls die Seite gemeint war: eine Zeile in `Hero.astro`.

## Integrationshinweis

Lokale Dateien im Arbeitsbaum auf `claude/autospeedy-v2` (Basis `4b0112b`), nicht committet. Geänderte Dateien:

- `projekt/autospeedy/astro/public/js/rueckruf.js`, `projekt/autospeedy/astro/public/js/schaden.js`, `projekt/autospeedy/astro/bau/dateien.mjs` (geteilt mit «Lack»)
- `projekt/autospeedy/astro-klar/public/css/klar.css`, `public/js/klar.js`
- `projekt/autospeedy/astro-klar/src/components/Hero.astro`, `src/layouts/Klar.astro`, `src/pages/{schaden-melden,tesla}.astro`, `src/pages/bewerten/index.astro`
- `projekt/autospeedy/astro-klar/test/{formular,qa-klar,rueckruf,statisch}.test.mjs`
- diese Datei

`.medaur/belege/klar-abnahme-1/` (untracked) stammt von der QA und ist unverändert.

**Bereit für unabhängige Abnahme:** ja. Alle Befunde N01–N08, C02, C04–C06, C08–C10 und `/bewerten/` sind umgesetzt und mit Tests belegt. Beide Linien bauen, und ihre Tests sind grün. Eigene Tests ersetzen keine unabhängige QA, vor allem nicht die Sichtprüfung von C04, C06, C09 und N07.
