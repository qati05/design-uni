# Auto Speedy AG: Probe mit design-uni und text-uni

Stand: 1. November 2026 · Branch `claude/text-uni-und-probe` · **Vorschau, nicht veröffentlicht, nichts gemergt.**

## Kurz

- **Gebaut:** 12 statische Seiten ([site/](site/)), hell, mit lokalen Schriften, ohne Cookies, ohne fremde Hosts, ohne Tracking. Vorschau öffnen: `python3 -m http.server --directory site` und `http://localhost:8000/`.
- **Alles aus öffentlichen Quellen:** [QUELLEN.md](QUELLEN.md), [fakten.md](fakten.md). Erfunden ist nichts; was fehlt, steht in [luecken.md](luecken.md) (20 Lücken).
- **Kundenwunsch umgesetzt** (E6 bis E9): hell · auf **jeder** Seite fester Knopf «Schaden melden» · eigene **Tesla-Seite** mit Modellwahl und Tesla-Referenz im Formular · «sauber, informativ, simple to use»: Formular mit 2 Pflichtfeldern · **Google-Bewertungskarten** als statische Karten (kein Widget) · das Formular schreibt **nur eine E-Mail**.
- **Maschinell geprüft:** 50 Prüfungen, **0 Fehler**; das Prüfwerkzeug hat seinen Selbsttest bestanden. Floskel-Werkzeug des Skills: **0 Fehler, 2 Warnungen** (beide in einem Kundenzitat).
- **Blinder Test gelaufen (auf deinen Wunsch):** 12 Bewerter auf zwei Modellen in zwei Runden. Kandidat **6,33 und 6,50** von 10, «Agentur» 1 und 2 von 6; **P4 nicht bestanden** (Schwelle 7,5 und 4 von 6). Die Falle wurde 12 von 12 durchschaut, der Fünf-Sekunden-Test bestand 3 von 3, die Seite steht in 12 von 12 Antworten unter den ersten drei ([pruefung/blindtest.md](pruefung/blindtest.md)). Die Kritik liegt überwiegend beim **Material** (Logo als Rasterbild, Handyfoto als Hero).
- **Weiter nicht gelaufen:** P1, P5 (blinder Teil), P7 Kunden-Agenten, P8, T2, T4 bis T6, Lighthouse, echte Geräte, Menschen, Juristen. Siehe unten.
- **Nicht freigabefähig, solange:** die Einwilligung für die drei Bewertungs-Zitate fehlt (P13 sperrt) und die Zusagen im [zusagen-blatt.md](zusagen-blatt.md) nicht bestätigt sind.

## Stand nach dem Blindtest: Fassung «Runde 3» (noch nicht blind getestet)

Nach dem Bericht zum Bildtest habe ich vier Punkte umgebaut, die die Bewerter am häufigsten nannten: Firmenname als Schrift neben dem Logo (ab 1300 px), grösseres Logo, «Tesla» ohne Rahmen, Hero in zwei Feldern mit **ganz sichtbarem** Foto (Halle mit Schild und Defender statt Kabinenfoto; die Kabinenvariante liegt als Foto `hero-kabine-defender.jpg` weiter bereit). 50 maschinelle Prüfungen: 0 Fehler. **Ob die Note steigt, ist nicht gemessen.** Das Layout «Text links, Bild rechts» ist der Modell-Standard; es steht im [Register](register.md) als Ausnahme (Achse 3 gilt damit nicht mehr als anders, 6 von 8). Zurücknehmen: `git revert` dieses Commits.

## Recherche: Meinungen und Daten von Menschen

Die Skills sagen selbst, dass ihre Tests mit Sprachmodellen liefen. Darum liegt jetzt eine Recherche zu echten Menschen vor: [recherche-menschen.md](recherche-menschen.md) (10 Quellen mit Datum, Stichprobe, Land und Güte). Kurz: Menschen wollen bei Werkstätten vor allem **Preise vorab** (88 % der geprüften Handwerker-Seiten nennen keinen), **Gesichter und echte Arbeit statt Stockfotos**, **Kontakt auf mehreren Wegen** und **eine einfache Erklärung des Ablaufs**; in Deutschland ziehen 61 % den Anruf oder das Gespräch für den ersten Kontakt vor, und zwei Drittel wünschen zusätzlich einen Termin über die Website. Wir erfüllen Kontakt, Bewertungen und Aktualität; es fehlen **Preisrahmen, Menschen, Ablauf**, alle drei brauchen den Betrieb. Keine Quelle prüft Gestaltungsregeln wie Schrift oder Farbe bei Werkstätten; keine ist aus der Schweiz.

## Die Idee: Die Abdeckkante

Eine grosse Entscheidung aus dem Betrieb, nicht aus der Branche: das **Abdeckband und die blaue Abdeckfolie**, die auf den Fotos des Betriebs an Türen, Radhäusern und Stossstangen kleben. Wo das Band liegt, endet das eine und beginnt das andere. Es eröffnet jeden Abschnitt, begrenzt die Bilder an einer Seite und ist, in **Logo-Marine** (`#243145`, per Pipette aus dem Logo), die Farbe des **einzigen** Hauptknopfs. Silber (`#BEBFC1`, ebenfalls aus dem Logo) trägt die leisen Linien. Die erste Fassung war grün; der Kunde hat eine Carrosserie in hellem Grün als Beispiel gezeigt, Grün hätte nach Kopie ausgesehen (E10). Titel der Startseite: «Erst die Kante. Dann der Lack.» Ableitung, Alternativen und Risiko: [richtung.md](richtung.md).

**Ehrliches Risiko:** Die Idee stützt sich auf Fotos des Betriebs, nicht auf eine Leistung, die nur dieser Betrieb hat. Ob sie blind trägt, ist **nicht geprüft** (P1).

## Seiten

`index` · `carrosserie` (mit `#dellen`) · `lackiererei` · `felgen-folierung` · `occasionen` · `betrieb` · `kontakt` · **`tesla`** · **`schaden-melden`** · `impressum` · `datenschutz` · `404`. Antwort-Plan: [antwort-plan.md](antwort-plan.md).

Das Formular auf `schaden-melden`: Kästchen «Der Fall kommt von Tesla» (oder `?tesla=1`, `&modell=Model%20Y`) → statt «Fahrzeug» erscheinen **Auswahl-Chips** Model 3, Model Y, Model S, Model X, anderes Modell und das freiwillige Feld Tesla-Referenz. Name und Telefon sind Pflicht. Ein Tipp auf «Schaden melden und E-Mail öffnen» öffnet das E-Mail-Programm mit vorbereiteter Nachricht an `info@autospeedy.ch` (Betreff «Schadenmeldung», bei Tesla «Schadenmeldung Tesla Model Y»). **Gesendet ist erst, wenn die Person im Mail-Programm sendet**; die Seite sagt das so. Ohne JavaScript bleibt das Formular ein `mailto:`-Formular.

## Prüfpunkte

Legende: **bestanden** = Schwelle erreicht (Selbstauskunft vermerkt) · **nicht gelaufen** · **teilweise**.

### design-uni

| Punkt | Ergebnis | Zahlen, Bewerter, Bemerkung |
|---|---|---|
| P0 Vollständigkeit | teilweise | 21 Nomen, 6 nach dem Sieben; Hauptaktion festgelegt (E7). **Kein Gespräch** mit dem Betrieb; Zusagen ohne zuständige Person ([zusagen-blatt.md](zusagen-blatt.md)). |
| P1 Richtung (blind) | **nicht gelaufen** | Die Collagen-Wahl wurde nicht blind getestet; die Wahl der Richtung ist meine Vorwahl. Der Skill hält an dieser Stelle an; ich habe gebaut, weil der Auftrag es verlangt ([AUFTRAG.md](AUFTRAG.md)). Der Bildtest P4 bewertet die gebaute Seite. |
| P2 Abstand | teilweise | **7 von 8** Achsen anders, 1 teilweise; **5 von 7** Bauteile anders (Selbstauskunft gegen den beschriebenen Standard, an der eigenen Seite gemessen). Creme-Sperre: bestanden (Farbton 255°). **ΔE_OK zu Creme 0,023, Schwelle 0,06: durchgefallen**; Ausnahme mit Entscheid E6 und Foto-Beleg ([register.md](register.md)). Geschwister-Frage: im blinden Test 0 Gleichsetzungen mit einer Referenz, Schwelle mangels früherer Seiten nicht anwendbar. |
| P3 Prüflisten A, P, H | Selbstauskunft, nicht blind | **A:** 7 Ja, 4 «Lücke des Betriebs» (Frist, Preis, Angebotsname, «allein entscheiden»), 3 Nein (Titel der Startseite allein, 5-Sekunden-Test nicht gelaufen, Zusagen nicht freigegeben). **Schwelle 11 nur mit den Lücken erreicht.** **P:** 12 Ja, **P13 Nein** (Zitate ohne Einwilligung): **Deckel, Seite gesperrt**. **H:** 13 Ja, 1 Lücke, 1 nicht gemessen (LCP): Schwelle 13 knapp erreicht. |
| P4 Erster Bildschirm (blind) | **nicht bestanden** | **Bildtest:** Runde 1 Mittel **6,33** (Opus 6,33, Sonnet 6,33), 1 von 6 «Agentur»; Runde 2 nach Überarbeitung **6,50** (Opus 6,33, Sonnet 6,67), 2 von 6. Schwelle 7,5 und 4 von 6. Unterschied innerhalb der Streuung. Referenzen: Lucid 8,8 und 9,0; Rimac 8,0 und 7,7; Händlerseite 3,7 und 3,2; bisherige Website des Betriebs 3,0 und 2,3; Falle 1,8 und 1,3 (12 von 12 durchschaut). **Fünf-Sekunden-Test: 3 von 3 richtig.** Details und Begründungen: [pruefung/blindtest.md](pruefung/blindtest.md). |
| P5 Startseite mit der einen Bewegung | teilweise | **maschinell bestanden:** Reduced Motion 0 Animationen; nach 3 s laufen 0 Animationen; nur `transform`. Nicht gemessen: Titel ≤ 1,0 s lesbar. **Blind nicht gelaufen.** |
| P6 Alle Seiten, Formular, Zustände | **bestanden** (maschinell) | **50 Prüfungen, 0 Fehler** ([pruefung/p6-t7.json](pruefung/p6-t7.json)): Telefon-Links, Zählpunkte, CTA fest sichtbar bei 1440 und 390 px, Kontrast aus der Kaskade (alle sichtbaren Texte), Verdeckung, Überlauf bei 360/390/1440, keine fremden Hosts, 0 Cookies, 0 Speichereinträge, ohne JavaScript lesbar, Formular (2 Pflichtfelder, 5 Felder), Fehler am Feld ohne Verschiebung des Knopfs, Rückmeldung 85 ms, Doppelsenden gesperrt, Kalender 9 Fälle. **Nicht gelaufen:** Lighthouse, axe, Tastaturdurchgang von Hand, Klickpfad-Skript (Anruf und CTA sind in jedem ersten Bildschirm), Route im Menü. |
| P7 Kunden-Agenten | **nicht gelaufen** | Keine Unteragenten; das Werkzeug `kunde.cjs` wurde nicht gebraucht. |
| P8 Ganze Website (blind) | **nicht gelaufen** | |

Was der Selbsttest zeigt: [pruefung/selbsttest.txt](pruefung/selbsttest.txt). Das Prüfskript fand alle 6 eingebauten Fehler (kaputter `tel:`-Link, Kontrast `#BBB`, fehlender CTA, Gedankenstrich, eckige Klammer, falsches «morgen»). Es hatte beim ersten Lauf **drei eigene Fehler** (erlaubte Guillemets, das Wort «am», Listen als Sätze gezählt); sie sind behoben. Zwei Funde waren echt und sind in der Seite behoben: die Fehlermeldung am Telefonfeld verschob den Senden-Knopf um 22 px, und ein Satz hatte 28 Wörter.

### text-uni

| Punkt | Ergebnis | Zahlen, Bemerkung |
|---|---|---|
| T0 Unterlagen | **nicht erfüllt** | 16 Kundenworte statt 30; keine Autovervollständigung, keine Fragen am Telefon; nur Google und local.ch ([kundenworte.md](kundenworte.md)). Drei Mitbewerber notiert. |
| T1 Antwort-Plan | bestanden (von Hand) | 10 Seiten mit je einer Hauptabsicht, kein Begriff auf zwei Seiten, keine Ortsseiten. **Alle Begriffe `[Annahme]`.** |
| T2 Botschaft (blind) | **nicht gelaufen** | |
| T3 Text | teilweise | Satzlänge im Fliesstext im Mittel **7,5 Wörter**, längster 20 (Grenzen 15 und 25: bestanden). Floskel-Werkzeug **0 Fehler**, 2 Warnungen (`professionell`, `faire Preise`), beide im wörtlichen Kundenzitat Januar 2026, nicht im Text des Betriebs. Listen A, P, H: siehe P3. **Unlauter-Probe:** Die Karten ohne Einwilligung verletzen SLK B.7; sonst nach eigener Prüfung keine Verstösse (keine Superlative, keine Preise, keine Knappheit). |
| T4 Blind gegen die Konkurrenz | **nicht gelaufen** | (lief auch im Skill noch nie) |
| T5 Snippet-Test | **nicht gelaufen** | |
| T6 KI-Zitat-Test | **nicht gelaufen** | |
| T7 Technik und Text (maschinell) | **bestanden** | 0 Fehler: Eszett, eine Anrede, Guillemets, keine Gedankenstriche, Uhrzeit mit Punkt, Telefonform, Titel 40 bis 60 und Beschreibung 110 bis 155 Zeichen auf allen 12 Seiten, ein `h1`, keine Sprünge, Alt-Text und Mass an allen Bildern, `noindex`, `robots.txt`, keine toten Links, `LocalBusiness` gleich der sichtbaren Seite und ohne Bewertung, **Faktenabgleich** (jede Zahl im Text steht in [fakten.md](fakten.md); eigenes Skript, nicht das Werkzeug des Skills). **Nicht prüfbar offline:** TI14, TI15, TI32, Index in Google und Bing, Weiterleitungen ([livegang.md](livegang.md)). |
| T8 Ziele und Messplan | **nicht bestanden** | Ziele Z1 bis Z8 sind prüfbar (6 davon vom Skript geprüft). Der Messplan fehlt in einem Punkt von M11: **Ausgangswerte** (nur der Betrieb hat sie). [messplan.md](messplan.md). |

## Befunde an den Skills (Nebenertrag der Probe)

1. **ΔE-Schwelle bei hellen Seiten** (design-uni, abstand.md Teil 2, Prüfung 3): Jede helle Seite liegt unter 0,06 zum Creme-Standard. Die Prüfung müsste für helle Gründe an Farbton und Sättigung gehen.
2. **Konflikt zwischen Kundenwunsch und Nie-Liste:** «Telefon und Hauptaktion je zweimal im selben Bildschirm» ist in der Nie-Liste unter «nie als Voreinstellung»; der Kunde verlangt aber einen CTA auf jeder Seite. Die Seite hat einen festen Kopf (CTA und Telefon) und im Hero beides nochmals. Ausnahme durch E7.
3. **Fehlermeldungen und Knopf** (conversion.md Teil 4 verlangt eine Fehlerzusammenfassung oben und zugleich, dass der Senden-Knopf nicht wandert): Beides geht nur, wenn die Zusammenfassung **unter** dem Knopf steht oder Platz reserviert ist. Die Probe löst es mit einer reservierten Zeile je Feld und der Zusammenfassung unter dem Knopf.
4. **T0 (30 Kundenworte)** ist bei einem Betrieb mit 15 Bewertungstexten ohne Gespräch nicht zu erfüllen. Der Skill sagt nicht, was dann gilt; die Probe baute weiter und markierte alles `[Annahme]`.
5. **Skill-Halt ohne Unteragenten** (P1) und Auftrag «baue die Website» widersprachen sich, solange der Auftrag keine Unteragenten nannte. Ich habe gebaut und das offen gesagt. Mit E10 liefen die Bewerter; der Skill-Ablauf «blind prüfen, zurück, neu prüfen» hat getragen: Er fand Logo, leere Fläche und doppelte CTAs und zeigte, dass die Überarbeitung die Note nicht hebt, sondern das Material fehlt.
7. **ΔE-Prüfung und Abstand nach dem Farbwechsel:** Der Wechsel von Grün auf Marine liess die Achse «Primäraktion» in Richtung des Standards rücken (Knopf plus Telefonlink); das Register weist 7 von 8 Achsen aus, nicht mehr 8 von 8.
6. **Der Betrieb verletzt auf der eigenen Website** nach der Rechtsbasis der Skills mehrere Grundsätze («Beste Preise garantiert!», Superlative, «jahrzehntelange Erfahrung» gegen Handelsregister 2016). Sie wurden **nicht** übernommen ([fakten.md](fakten.md), Teil 8).

## Was nicht geprüft ist

Echte Geräte (iOS Safari, Android); Menschen als Besucher; Juristinnen und Juristen (Impressum, Datenschutz, UWG, SLK B.7, FMG 45c sind offen); Lighthouse und axe; Tastatur- und Screenreader-Durchgang von Hand; Ladezeit im Feld; ob `mailto:` auf allen Geräten des Kunden das richtige Programm öffnet (auf Handys ohne Mail-Konto öffnet sich nichts: Das Formular nennt dafür die Adresse und die Nummer); ob Tesla-Weiterleitungen auf die richtige Adresse zeigen; **ob der Betrieb Tesla-Partner ist** (Aussage des Auftraggebers, kein Nachweis).

## Offene Entscheide (Auftraggeber oder Betrieb)

1. Zitate: Einwilligung einholen oder streichen (Z18 bis Z20).
2. Zusagen Z1 bis Z17 bestätigen ([zusagen-blatt.md](zusagen-blatt.md)).
3. Weitere blinde Tests: P1 (Collagen), P5 (Bewegung), P8 (ganze Website, Handy), P7 Kunden-Agenten und T2, T4 bis T6 sind **nicht gelaufen**. Der Bildtest P4 lief in zwei Runden und fiel durch (6,33 und 6,50). Vorschlag: zuerst **Logo als Vektor und Fototag** (L16), dann P4 wiederholen.
4. Fototag nach `branchen/handwerk-auto-bau.md` Teil 4 und Logo als Vektor (L16): Das ist nach dem blinden Test der wichtigste Hebel (Logo winzig und Hero-Foto schwach nennen 12 von 12 Begründungen).
5. Formularweg: `mailto:` oder Endpunkt mit Foto-Anhang.

## Wiederholen

```bash
node werkzeuge/bauen.cjs                      # Seiten neu erzeugen
node werkzeuge/pruefen.cjs --json pruefung/p6-t7.json   # 50 maschinelle Prüfungen
node werkzeuge/pruefen.cjs --selbsttest       # Prüfwerkzeug an Kopie mit Fehlern
node werkzeuge/register-messen.cjs            # Achsen und OKLCH
node ../../skills/text-uni/werkzeuge/slop-de.js site   # Floskel-Werkzeug des Skills
python3 -I werkzeuge/bilder-aufbereiten.py <arbeitsordner> site/bilder   # Bilder neu aufbereiten
```

Playwright (`require("playwright")`) wird vorausgesetzt.
