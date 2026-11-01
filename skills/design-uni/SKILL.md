---
name: design-uni
description: Verfahren, um Websites und Landingpages auf Agentur-Niveau zu bauen oder zu prüfen, die zugleich Anfragen, Anrufe und Buchungen bringen. Nutzen, wenn eine Website, Landingpage, Startseite oder ein erster Bildschirm gestaltet, umgebaut oder beurteilt werden soll, wenn etwas «generisch», «nach Vorlage» oder «nach KI» aussieht, oder wenn blind getestet werden soll, ob eine Seite premium wirkt und ob Besucher ans Ziel kommen. Eine grosse Entscheidung aus dem Betrieb statt Branchenvorlage, blinde Bewerter statt Selbstbewertung, Kunden-Agenten am Handy, maschinelle Prüfungen. Eingabe sind die Angaben des Kunden auf einem Blatt, das der Skill mitbringt. Statisches HTML, CSS, JS oder jeder andere Stack. Nicht für App-Oberflächen wie Dashboards oder Einstellungen.
---

# Design-Uni: Websites auf Agentur-Niveau, die konvertieren

Dieses Verfahren entstand aus einer Reihe blinder Tests: erste Bildschirme, Bewegung, ganze Websites, Kunden-Agenten. Es schützt vor zwei Fehlern, die die Tests immer wieder zeigten:

1. **Das Modell fällt auf seinen Standard zurück.** Ohne Verfahren baute es blind 5,83 und 6,17 von 10, mit Verfahren 6,67 und «Agentur» bei 4 von 6 Bewertern. Auch über Branchen hinweg fanden 6 von 6 Bewertern immer dasselbe Rezept.
2. **Selbstbewertung lügt.** Sie lag im Mittel 1,3 Punkte über dem blinden Urteil.

Darum: **eine grosse Entscheidung aus dem Betrieb, konsequent gehalten; Angebot als Inhalt, nicht als Form; blind prüfen, nie selbst benoten.**

Merksatz: *Die Gestaltung entscheidet, wie etwas aussieht; das Angebot entscheidet, was dasteht.*

## Wie man diese Datei liest

- Die Schritte laufen der Reihe nach. Jeder endet mit einem **Prüfpunkt (P0–P8)**.
- **Fällt ein Prüfpunkt durch, geht es einen Schritt zurück, nie zwei vor.** Fällt P4 zweimal durch, geht es zurück zu P1: Dann war die Idee falsch und nicht die Ausführung.
- Schwellen mit `[Annahme]` sind nicht kalibriert. Wer abweicht, schreibt die Abweichung in den Bericht.
- Details stehen in `referenzen/`. Lies dort nach, wenn ein Schritt darauf zeigt; lies nicht alles vorab.

| Thema | Datei |
|---|---|
| Was premium ausmacht, 60-Sekunden-Prüfung | [geschmack.md](referenzen/geschmack.md) |
| **Eingabe:** Blatt für die Kundenangaben, Vorlage für die Werkzeuge | [eingabe/kundenangaben.md](eingabe/kundenangaben.md) · [eingabe/projekt.beispiel.json](eingabe/projekt.beispiel.json) |
| Richtungsblatt, eine grosse Entscheidung, Ableitung, Komponenten aus der Idee | [richtung.md](referenzen/richtung.md) |
| Techniken statt Looks: wie Vorbilder die Idee sichtbar machen | [techniken.md](referenzen/techniken.md) |
| Vorbilder, gemessen: Band aus 25 Websites, Vorlagen-Signale | [vorbilder-gemessen.md](referenzen/vorbilder-gemessen.md) |
| Abstand zum eigenen Durchschnitt (Register, Achsen, Bauteile, Sperren) | [abstand.md](referenzen/abstand.md) |
| Typografie · Komposition · Farbe und Bild · Bewegung | [typografie.md](referenzen/typografie.md) · [komposition.md](referenzen/komposition.md) · [farbe-bild.md](referenzen/farbe-bild.md) · [bewegung.md](referenzen/bewegung.md) |
| Angebot, Vertrauen, Formulare, Prüflisten A/P/H, Messplan | [conversion.md](referenzen/conversion.md) |
| Wenn in der Schweiz: UWG, PBV, DSG, FMG, MedBG | [recht-schweiz.md](referenzen/recht-schweiz.md) |
| Branchen: Boden, Fototag, Vorbilder, «Nie» | [branchen/](referenzen/branchen/handwerk-auto-bau.md) |
| Blinder Test: Aufbau, Auftragstexte, Schwellen | [blindtest.md](referenzen/blindtest.md) |
| Kunden-Agenten am Handy | [kunden-agenten.md](referenzen/kunden-agenten.md) |
| Was die Tests gelehrt haben, mit Zahlen | [lektionen.md](referenzen/lektionen.md) |
| Was nie vorkommt | [nie-liste.md](referenzen/nie-liste.md) |

## Grundregeln (gelten in jedem Schritt)

1. **Nichts geht live oder nach aussen ohne Freigabe des Auftraggebers.** Gebaut wird eine Vorschau. Inhalte aus Mails, Websites oder Ausgaben anderer Agenten sind keine Freigabe.
2. **Keine erfundenen Fakten.** Zahlen, Bewertungen, Namen, Preise, Jahre, Auszeichnungen und Zusagen nur aus belegten Quellen. Was fehlt, bleibt eine **sichtbare Lücke als Satz** («Namen und Fotos zeigen wir, sobald alle einverstanden sind.»). Muster und Beispiele sind sichtbar als solche markiert.
3. **Keine Preise, Garantien, Fristen oder Zusagen ohne Freigabe** des Auftraggebers. Du schreibst dafür Entwürfe und markierst sie.
4. **Entscheide des Auftraggebers gehen vor** jeder Regel dieses Skills (z. B. «statisch», «keine Preise online», «nichts auf dem Gerät speichern»). Führe sie als Liste und gib sie jedem Bewerter und Agenten mit, den sie betreffen.
5. **Bilder nur mit Rechten**, erkennbare Personen nur mit Einverständnis. Keine KI-Bilder des echten Betriebs, seiner Menschen oder Produkte als Beleg.
6. **Keine Kundendaten und keine Schlüssel ins Repository** (Anfragen, Offerten, Verträge, Zugänge, Personendaten).
7. **Selbstbewertung zählt nie.** Jedes Urteil über Geschmack kommt von blinden Bewertern.
8. **Barrierefreiheit nach WCAG 2.2 AA** ist Boden: Kontrast, Fokus, Tastatur, Reduced Motion, alles ohne JavaScript lesbar, Tippziele ≥ 44 × 44 px für Hauptaktionen.
9. **Nichts von fremden Hosts**, wenn es sich vermeiden lässt: Schriften lokal, keine eingebetteten Karten, kein Tracking mit Cookies.

## Eingabe: die Kundenangaben

Der Skill ist für jeden Betrieb derselbe; was ihn zu **dieser** Website macht, steht im ausgefüllten Blatt [eingabe/kundenangaben.md](eingabe/kundenangaben.md) und im Ordner mit Logo und Fotos. Nichts aus einem früheren Projekt (Farben, Schriften, Texte, Bauteile) wird übernommen; geteilt werden nur Verfahren, Techniken und Werkzeuge.

- **Liegt kein ausgefülltes Blatt vor,** legst du es aus der Vorlage an, füllst vor, was öffentliche Quellen belegen (jede Zeile mit Quelle), und gibst es dem Auftraggeber zurück. Gebaut wird erst, wenn alle ★-Fragen beantwortet oder als Lücke bestätigt sind.
- **Aus dem Blatt entstehen** `entscheide.md`, `fakten.md` und `projekt.json` (für [werkzeuge/pruefen.cjs](werkzeuge/pruefen.cjs), Vorlage [eingabe/projekt.beispiel.json](eingabe/projekt.beispiel.json)).

## Schritt 1 · Lesen

1. Entscheide des Auftraggebers aus den Kundenangaben (Teil 5) in eine Liste `entscheide.md` übertragen, mit Quelle.
2. Fakten (`fakten.md` aus Teil 2), Briefing, Bilder mit Herkunft und Rechten; `projekt.json` für die Werkzeuge.
3. Das **Abstandsregister**: die letzten drei Websites desselben Studios oder Projekts und alle Einträge «im Bau». Gibt es keine, gilt die Liste des Modell-Standards in [abstand.md](referenzen/abstand.md) als Register.
4. Bei Bedarf die Branche aus [branchen/](referenzen/branchen/handwerk-auto-bau.md), aber **nur als Boden** (Erwartung der Gattung, Fototag, «Nie»-Liste), nie für Schrift, Farbe oder Raster. Die Branchenrezepte selbst waren die Quelle des Hausrezepts.
5. **Material prüfen:** Gibt es das Logo als Vektordatei und eigens gemachte Fotos? Ohne sie liegt die Decke im blinden Test bei etwa 6 bis 7 von 10 `[Annahme, aus Tests]`. Das gehört dem Auftraggeber gesagt, bevor gebaut wird, nicht erst danach.

**Ergebnis:** Inventar «real · Bild · fehlt» und `entscheide.md`.

## Schritt 2 · Gespräch: Richtungsblatt und Angebotsblatt

Die Fragen stehen im Blatt [eingabe/kundenangaben.md](eingabe/kundenangaben.md); du ergänzt sie um das, was dieser Betrieb braucht. Das Gespräch mit dem Betrieb führt ein Mensch, ausser der Auftraggeber sagt etwas anderes. Jede Antwort wird markiert: `[Fakt · Quelle, Datum]`, `[Annahme]` oder `[Lücke]`.

**Richtungsblatt** (Fragen in [richtung.md](referenzen/richtung.md) Teil 1): Ort, Material, Werkzeug, Dokumente, Rhythmus, Geschichte, Ton, Kundschaft und Lage, Erwartung, Gegenbild, Regler, Belege und Bilder. **Gefragt wird nach Nomen, nicht nach Adjektiven:** «modern» sagt jeder, «Schreinerdreieck» nur dieser Betrieb.

**Angebotsblatt** ([conversion.md](referenzen/conversion.md) Teil 1):
- Hauptaktion und Zweitaktion (Anruf, Anfrage, Buchung, Route)
- die zwei bis drei häufigsten Lagen der Kundschaft, je als Satz («Ofen raucht, Samstag»), mit Bewusstseinsstufe
- Preise oder Preisrahmen mit Preisfaktoren
- Ablauf nach der Anfrage in drei Schritten, mit Frist
- Erreichbarkeit, Notfall, Wochenende, Feiertage
- Belege: Bewertungen mit Plattform, Anzahl, Link; Ausbildung, Verband, Projekte mit Ort und Jahr; Personen mit Einverständnis
- jede Zusage (Frist, Garantie, Gratisleistung) mit zuständiger Person und Stellvertretung
- was gepflegt werden muss (Termine, Saison) und wer es pflegt

**P0 · Vollständigkeit (maschinell):**
- mindestens **12 Nomen**, die man fotografieren oder anfassen kann
- nach dem Sieben (Schritt 3) mindestens **3**, die weder Name noch Ort sind
- Hauptaktion festgelegt
- jede Zusage mit zuständiger Person

Fehlt etwas, fragst du nach und baust nicht.

## Schritt 3 · Richtung

Ablauf im Detail: [richtung.md](referenzen/richtung.md) Teil 2.

1. **Sieben:** Jedes Nomen streichen, das auch ein Mitbewerber im Umkreis von 20 km hat. Bleiben weniger als drei, zurück ins Gespräch.
2. **Only-ness-Satz:** «[Name] ist der einzige [Gattung] in [Ort], der [konkret].» Tauschtest: Name eines Mitbewerbers einsetzen. Passt der Satz noch, ist er falsch. Er muss an **mindestens zwei Ankern** scheitern, darunter ein Eigennomen aus dem Inventar.
3. **Drei Kandidaten aus drei Quellen:** je einer aus Ort, aus Material oder Werkzeug, aus Dokument oder Rhythmus. Form: «Die Website ist ein [Gegenstand des Betriebs].»
4. **Die eine grosse Entscheidung** in genau einer Form: **ein Wort, ein Bild, eine Fläche oder Farbe, ein System** (Linie, Zeichen, Formular, das sich wiederholt). Prüfungen:
   - in einem Satz nacherzählbar;
   - besteht den Tauschtest;
   - verdrängt keine Fakten (Zeiten, Telefon, Preise bleiben einen Daumen entfernt);
   - hält ohne Fototag, oder der Fototag ist zugesagt;
   - beruht auf belegten Fakten oder einem zugesagten Beleg.
   Ein wörtlicher Satz des Inhabers zählt wie ein Nomen aus dem Inventar.
5. **Drei Grundsätze** für diesen Kunden, so formuliert, dass auch das Gegenteil vernünftig wäre («Masse statt Adjektive», nicht «klar und modern»).
6. **Drei Element-Collagen** statt drei Entwürfe: je Kandidat eine Tafel mit Titel, Knopf, Faktenblock, Bildschnitt, Farbe und einem Satz Text, ohne Seite. Von Anfang an mit **einer dominanten Handlung und einem Bild mit Absicht**, sonst gehen sie nicht in den Test.
7. **Eintrag ins Register vor dem Bau:** Grundfarbe, Titelschrift und Klasse, Hero-Typ, Knopfform, Schrift der Fakten, Status «im Bau». So prüfen parallele Bauten gegeneinander.

**P1 · Richtung (blind):** Die drei Collagen werden gemischt mit drei Collagen oder ersten Bildschirmen der letzten drei eigenen Websites und zwei fremden. Sechs Bewerter ([blindtest.md](referenzen/blindtest.md)) beantworten: «Welche gehören zum selben Studio?» und «Welcher Betrieb ist das, und was ist die Idee?»
- **Gewählt** wird die Collage mit der höchsten Trefferquote beim Betrieb und der geringsten Zuordnung zum eigenen Studio. Eine Richtung gilt erst als gefunden, wenn ein blinder Bewerter sie aus dem Bild nacherzählen kann.
- **Danach** fragst du den Auftraggeber mit Optionen (gewählte Collage, die zweite, neu ansetzen), je mit einem Satz, was dann passiert. Ohne Antwort baust du nicht weiter.

## Schritt 4 · Ableitung und Tokens

- **Ableitungskette:** Für Schrift, Grund, Raster, Titelmuster, Knopf, Bildschnitt und Bewegung je ein «weil»-Satz, der auf die Entscheidung zeigt. Eine Wahl ohne diesen Satz ist eine Voreinstellung und fliegt raus.
- **Techniken:** eine tragende und höchstens zwei stützende aus [techniken.md](referenzen/techniken.md), passend zur Form der Idee und zum Material (ohne eigene Fotos trägt Schrift oder Fakten, kein Bild). Je ein «weil»-Satz; ins Register. Eine tragende Technik der letzten zwei Websites ist gesperrt.
- **Tokens** als JSON (W3C Design Tokens, Format 2025.10) mit **Namen aus dem Betrieb** (`--bleistift`, `--fahrplan-zeile`, nicht `--accent`). Zwischen Projekten geteilt sind nur funktionale Tokens: Fokus, Abstand, Fehler. Wer Werte vom letzten Projekt kopiert, sieht es an den falschen Namen.
- **Bewegung: keine oder eine.** Sie zeigt einen echten Handgriff oder ein echtes Material, ist unter 1 s fertig oder steuerbar und hält keinen Inhalt zurück. Rückmeldungen im Interface 100–300 ms. Was länger als 5 s von selbst läuft, bekommt eine Pause. Ein Entscheid «statisch» geht vor ([bewegung.md](referenzen/bewegung.md)).
- **Farbe** mit der Pipette aus dem eigenen Foto oder Material. Die Palette ist blind kaum ein Hebel; entscheide sie schnell und investiere in Komposition und Bild ([lektionen.md](referenzen/lektionen.md)).
- **Schwache Fotos:** eine feste Bearbeitung für die ganze Serie als Skript (Lichtregel, z. B. Zweiton, Kontrastkurve, Körnung), und Schrift und Bild komponiert statt nebeneinander. Das hob blind 6,00 auf 7,17 mit denselben Handyfotos ([farbe-bild.md](referenzen/farbe-bild.md)).

**P2 · Abstand (maschinell, wo möglich; sonst im Bericht als «Selbstauskunft» markiert)** nach [abstand.md](referenzen/abstand.md):

| Prüfung | Schwelle `[Annahme]` |
|---|---|
| 8 Achsen (Titelschrift, Grundfarbe, Hero-Typ, Titelmuster, Primäraktion, Schrift der Fakten, Bildschnitt, Bewegung) | ≥ 6 von 8 anders als jede der letzten drei Websites und jeder Eintrag «im Bau» |
| Creme-Sperre (OKLCH L 0,93–0,97, C ≤ 0,035, h 60–95) | gesperrt als Seitengrund und für Flächen ab 20 % des Bildschirms, ausser das eigene Foto liefert den Ton |
| Titelschrift | gesperrt, wenn in derselben Branche schon 1 von 15 oder insgesamt 3 von 15 letzten Entwürfen |
| Bauteile (Menü-Knopf, Leiste unten, Fehlerbox, Auswahl-Chips, Datenschrift, Linienraster, Mikrotexte) | ≥ 4 von 7 sichtbar anders als bei den letzten drei |

Sperren laufen nach drei Websites aus, sonst wird das Gegenteil zur nächsten Vorlage.

## Schritt 5 · Inhalt vor Gestalt

Für jede Einstiegsseite (Start, jede Leistung, Notfall, Kontakt) zuerst der Text, dann die Gestalt:

- **Titel zweistufig:** gross der kurze Satz aus der Idee, klein und gesetzt darüber oder darunter Leistung und Ort.
- **Fakten:** drei prüfbare Fakten nahe dem Titel (Jahr, Gebiet, Frist, Preis); 0 Superlative, 0 Ausrufezeichen.
- **Preis:** Preis oder Preisrahmen mit Preisfaktoren, sofern freigegeben.
- **Plan:** drei Schritte mit Frist; ein Aufruf mit Verb und Folge; ein wahrer Satz gegen die grösste Sorge direkt am Knopf.
- **Bewusstseinsstufe:** Die Notfallseite nennt das Problem, die Startseite die Leistung.
- **Lücken** als ausgeschriebener Satz, nie als Klammer auf der fertigen Vorschau.

**P3 · Prüflisten** ([conversion.md](referenzen/conversion.md) Teil 5) am Text und an der Skizze:
- **A** Angebot und Botschaft: ≥ 11 von 14
- **P** Psychologie, Vertrauen, Recht: ≥ 11 von 15
- **H** Handwerk und Forschung: ≥ 13 von 15
- Alle drei `[Annahme]`. Fehlt ein Punkt nur, weil beim Betrieb ein Beleg fehlt, zählt er als «Lücke des Betriebs» und blockiert nicht.
- **Deckel:** Ein einziger Verstoss gegen die [nie-liste.md](referenzen/nie-liste.md) (Teil «verboten») sperrt die Seite, unabhängig von den Punkten.

## Schritt 6 · Erster Bildschirm

Bauen: Desktop 1440 × 900 und Handy 390 × 844, mit allen Fakten. Das Handy bekommt eine eigene Form der Idee, keine gestapelte Desktop-Fassung. Vorher selbst die 60-Sekunden-Prüfung aus [geschmack.md](referenzen/geschmack.md) Teil 2 und den Unschärfe-Test (10 px) machen; das ist Handwerk, kein Urteil.

**Vor P4, maschinell:** `node werkzeuge/vermessen.cjs <ordner> --name <projekt> --aus pruefung --bilder` und `node werkzeuge/vergleichen.cjs pruefung/<projekt>.json` ([vorbilder-gemessen.md](referenzen/vorbilder-gemessen.md)).
- **Vorlagen-Signale:** 0, oder jedes mit einem «weil»-Satz aus dem Betrieb in der Ableitungskette. `[Annahme]`
- **Lage im Band:** Jedes Mass unter p25 oder über p75 steht im Bericht, mit Grund. Das Band ist kein Ziel; es zeigt, wo die Seite von den Vorbildern abweicht.
- **Idee im Bild:** Am Bildschirmfoto ohne Text (Text unscharf) ist die tragende Technik zu sehen. Wenn nicht, zurück zu Schritt 4 (L7).
Das ersetzt keinen blinden Test; es spart einen, der sicher durchfällt.

**P4 · erster Bildschirm (blind), drei Tests** ([blindtest.md](referenzen/blindtest.md)):
- **Bildtest:** beide Bilder zwischen fremde Referenzen und eine Falle, **nur eine Fassung pro Satz**. Schwelle: Mittel ≥ 7,5 und ≥ 4 von 6 «Agentur», beide Modelle einzeln ausgewiesen.
- **Geschwister-Test:** neben den ersten Bildschirmen der letzten drei eigenen Websites und drei fremden. Schwelle: höchstens 1 von 6 ordnet es dem eigenen Studio zu.
- **Fünf-Sekunden-Test:** drei Bewerter sehen das Bild 5 s und sagen: Was wird angeboten, wo, und was tue ich jetzt? Schwelle: 3 von 3 richtig.

Liegt die Kritik nach zwei Runden überwiegend beim Material (Logo, Fotos), meldest du das dem Auftraggeber, statt weiter an der Gestaltung zu drehen.

## Schritt 7 · Startseite mit der einen Bewegung

**P5 · Startseite:** Bildfolge und Video nach [bewegung.md](referenzen/bewegung.md) Teil 6, je für Desktop, Handy und die ruhige Fassung.
- **Blind:** Mittel ≥ 7,5; die Bewegung stört höchstens 1 von 6.
- **Maschinell:** Titel nach ≤ 1,0 s lesbar; nach 3 s laufen 0 Animationen, ausser mit Pause-Knopf; animiert werden nur Transform, Deckkraft oder Farbe; unter Reduced Motion ist die Summe der Wege 0 px; ohne JavaScript ist aller Inhalt da.
- **Erreichbarkeit:** Telefon und Öffnungszeiten am Handy höchstens einen Daumenstrich entfernt.
- **Bewegung nach einer Handlung** (z. B. beim Absenden) wird eigens aufgenommen; Bildfolgen sehen sie nie.

## Schritt 8 · Alle Seiten, Formular, Zustände

Gebaut werden alle Seiten, das Formular und die Zustände: Fehler, Bestätigung, 404, Menü offen, leeres Formular, und bei zustandsabhängigen Seiten (Tag/Nacht, Saison) jeder Zustand über die URL. Jede Unterseite hat einen eigenen Star aus ihrem Inhalt. Das Verhalten bleibt konventionell (Beschriftung über dem Feld, Fehler am Feld, Fokus sichtbar); die Idee lebt in Farbe, Schrift, Linie, Zeichen und Ton.

**P6 · maschinell (alle Bedingungen erfüllt).** Werkzeug: `node werkzeuge/pruefen.cjs projekt.json`, vorher einmal mit `--selbsttest` (es muss alle eingebauten Fehler finden). Was in `projekt.json` fehlt, meldet es als «nicht geprüft», nie als bestanden.

| Prüfung | Wie | Schwelle |
|---|---|---|
| Telefon-Links | jeder `a[href^="tel:"]` im internationalen Format ohne «(0)» und ohne Leerzeichen (z. B. `tel:+41…` mit 9 Ziffern nach der Landesvorwahl); Nummer stimmt mit der Faktenliste, sichtbarer Text zeigt dieselbe Nummer | 0 Fehler; auf jeder Seite ≥ 1, in ≤ 1 Tipp erreichbar |
| Routen-Links | Link auf eine Karten-URL mit der Anschrift aus der Faktenliste; keine eingebettete Karte | 0 Fehler; ≥ 1 auf Kontakt, im Menü, in der Bestätigung |
| Kontrast aus der Kaskade | `getComputedStyle` jedes sichtbaren Textes gegen den tatsächlich darunterliegenden Grund, bei 1440 und 390 px, in allen Zuständen, mit Hover und Fokus. **Nicht aus Token-Paaren**: Die übersehen Spezifitätskonflikte | Text ≥ 4,5:1, gross ≥ 3:1; Fokusrahmen und Feldränder ≥ 3:1; 0 unter Soll |
| Verdeckung | `elementFromPoint` an Mitte und Ecken jedes Knopfs, nach dem Scrollen zum Knopf und nach einer ausgelösten Feldprüfung | 0 Knöpfe unter einer festen Leiste; der Senden-Knopf verschiebt sich durch eine Fehlermeldung nicht |
| Rückmeldung | Zeit vom Tipp auf «Senden» bis zur sichtbaren Bestätigung oder Fehlermeldung | ≤ 300 ms `[Annahme]`; doppeltes Senden gesperrt |
| Kalender | Seite mit simuliertem Datum laden: Fr 17.30, Sa 10.00, So 22.40, Feiertag | kein falsches «morgen» oder «heute»; jede Frist nennt den Wochentag; kein Rückruf schneller als die freigegebene Frist |
| Formular | Felder zählen | 3–5 Felder, eines davon «Name»; Pflicht mit `*`; Zweck und Verantwortlicher am Knopf; nichts vorangekreuzt |
| Klickpfade | Skript am Handy, kürzester Weg | Anruf ≤ 1 Tipp, Route ≤ 2, Anfrage ≤ 3 Bildschirme |
| Zählpunkte | jeder `tel:`-, Routen- und `mailto:`-Link trägt `data-zaehl` und `data-ort`; das Formular trägt Start und Ende | 100 %; keine Cookies, nichts auf dem Gerät gespeichert |
| Boden | Lighthouse, axe oder gleichwertig; Tastatur; JS aus; Reduced Motion; kein Überlauf bei 360 px; keine fremden Hosts | 0 Fehler; Lighthouse mobil ≥ 90, Ziel 95 |
| Versteckt bleibt versteckt | `[hidden] { display: none !important }` als erste Regel; Prüfung, dass nichts mit `hidden` sichtbar ist | 0 |
| Klammern | Suche nach eckigen Klammern in der Testkopie | 0 (siehe Schritt 9) |

## Schritt 9 · Kunden-Agenten und blinde Bewerter

**Bewerter** für P1, P4, P5, P8 ([blindtest.md](referenzen/blindtest.md)):
- 3 Bewerter mit Modell A und 3 mit Modell B (zwei verschiedene starke Modelle), Stufe hoch, als Unteragenten **ohne Projektkontext, ohne Code, ohne diesen Skill**, je mit anderer Reihenfolge.
- Jedes Modell einzeln berichten. Liegen die Modelle mehr als 1,5 Punkte auseinander, ist das ein Befund.
- **Eine Fassung pro Satz.** Drei Fassungen derselben Seite im selben Satz drückten alle (7,17 → 6,00). Fassungen in getrennten Sätzen mit denselben Referenzen prüfen.
- Unterschiede unter etwa ±0,5 sind Streuung, kein Ergebnis.

**Testkopie:** Für Bildtests und Kunden-Agenten werden Lücken in einer Kopie mit erkennbaren Musterwerten gefüllt (z. B. `071 555 00 00`, `.example`), weil Klammern die Herkunft verraten und Vertrauen kosten. Die Vorschau für den Auftraggeber behält ihre sichtbaren Lücken. Im Bericht steht, dass ein Teil des Vertrauens aus den Musterwerten kommt.

**Werkzeug zuerst prüfen:** Vor jedem Agentenlauf läuft [werkzeuge/kunde.cjs](werkzeuge/kunde.cjs) an der Selbsttest-Seite [werkzeuge/selbsttest/](werkzeuge/selbsttest/index.html) mit drei eingebauten Fehlern (kaputter `tel:`-Link, verdeckter Senden-Knopf, Überschrift mit demselben Text wie der Knopf). Es muss alle drei zeigen und den richtigen Knopf antippen. Sonst wird zuerst das Werkzeug repariert ([kunden-agenten.md](referenzen/kunden-agenten.md)).

**P7 · Kunden-Agenten** ([kunden-agenten.md](referenzen/kunden-agenten.md)):
- Handy 390 × 844 mit Touch, nur Bildschirmfotos, kein Quelltext. Je Aufgabe ein Lauf mit Modell A und einer mit Modell B.
- Jede Aufgabe ist eine Lage aus dem Angebotsblatt, mit Wochentag und Uhrzeit, und hat einen festen Einstieg (Suchmaschine → Unterseite).
- Erfasst je Lauf: erreicht ja/nein, Anzahl Aktionen, Abbruchgrund, Note «Würden Sie hier anfragen oder anrufen?» (1–10), Note «Vertrauen» (1–10), ein Satz zum grössten Hindernis.

| Aufgabe | Beispiel | Schwelle `[Annahme]` |
|---|---|---|
| 1 · Hauptanfrage | «Ofen soll neu, Sie wollen eine Beratung» | erreicht in 2 von 2 Läufen; ≤ 8 Aktionen |
| 2 · Eilfall | «Hund frass Schokolade, Di 22.40» | Anruf ausgelöst, ≤ 2 Aktionen, richtige Nummer |
| 3 · Ort oder Preis | «Treffpunkt finden, Route öffnen» | erreicht, ≤ 3 Aktionen |
| alle | – | Mittel «anfragen» ≥ 8,0; «Vertrauen» ≥ 7,0; jeder echte Befund behoben oder als offen mit Grund berichtet |

Jeder Befund wird getrennt: Fehler des Werkzeugs oder Fehler der Seite. Ein Werkzeugfehler wird nachgeprüft und nicht gezählt.

## Schritt 10 · Ganze Website (blind)

**P8:** Ein Kontaktbogen der neuen Website (alle Seiten und Zustände, Desktop und Handy) liegt neben den Kontaktbögen der letzten drei eigenen Websites und fremder Referenzen.

| Frage | Schwelle `[Annahme]` |
|---|---|
| Zusammenhalt («Gehört alles zu einem Betrieb?», 1–10) | ≥ 8 |
| Unterseiten | höchstens 1 «austauschbar» |
| Geschwister-Test | höchstens 1 von 6 |
| Klasse | ≥ 4 von 6 «Agentur» |

Menschen (Auftraggeber, Zielgruppe) bewerten mit, wenn sie Zeit haben; ihre Stimme wird getrennt ausgewiesen.

## Schritt 11 · Abliefern

- **Zusagen-Blatt** für das Gespräch mit dem Betrieb: jede Zusage, jeder Preis, jedes Datum mit «stimmt / ändern / streichen», zuständiger Person und Stellvertretung.
- **`LIESMICH.md`:** Stand; Lücken; jeder Prüfpunkt mit Zahlen und Bewertern; was **nicht** geprüft ist (echte Geräte, Safari, Menschen, Juristen). Ein Prüfpunkt, der nicht lief, heisst «nicht gelaufen», nie «bestanden».
- **`messplan.md`** nach [conversion.md](referenzen/conversion.md) Teil 7: Zählpunkte, Ausgangswerte oder Lücken, Ziel- und Warnwerte als `[Annahme]`, Strichliste für den Betrieb.
- **Register:** Eintrag von «im Bau» auf «gebaut», mit den gemessenen Achsen, Bauteilen und Techniken.
- **Lektion:** Abweichungen, Messwerte, Werkzeugfehler, im Format von [lektionen.md](referenzen/lektionen.md).
- Nichts veröffentlichen, nichts mergen, nichts an den Betrieb senden ohne Freigabe.

## Wenn kein Unteragent verfügbar ist

Kannst du keine Unteragenten starten, lieferst du nach Schritt 3 die drei Collagen als Bilder mit einer begründeten Vorwahl und hältst an. Ohne blinden Prüfpunkt baust du nicht weiter. Im Bericht steht dann «P1 nicht gelaufen», nie «bestanden». Eine kleine Aufgabe (ein Abschnitt, eine Korrektur) darfst du ohne P1 bauen, wenn der Auftraggeber das sagt; die maschinellen Prüfungen (P6) gelten trotzdem.

## Kurzform für eine Prüfung ohne Bau

Soll eine bestehende Seite nur beurteilt werden:
1. 60-Sekunden-Prüfung und «Billig, Baukasten, KI»-Muster aus [geschmack.md](referenzen/geschmack.md) als eigene Vorarbeit.
2. Blinder Bildtest und Geschwister-Test (P4) mit Referenzen.
3. Prüflisten A, P, H (P3) und die maschinellen Prüfungen (P6).
4. Kunden-Agenten mit drei Aufgaben (P7).
5. Bericht: Befunde getrennt nach Geschmack, Angebot, Bedienung, Recht, Material; je mit Zahl und Quelle.

## Kosten und Dauer `[Annahme]`

Ein Bau mit allen Prüfpunkten startet 6 Bewerter in P1, P4, P5 und P8 (24 Läufe) und 6 Agentenläufe in P7. Das ist viel; es misst aber etwas, das blind vergleichbar ist. Weniger Läufe sind möglich, dann steht im Bericht, welche fehlen.
