# Abstand zum eigenen Durchschnitt

Wer viele Websites baut, baut sich ohne Messung eine eigene Vorlage. In den Tests geschah das zweimal:

1. **Im Look:** Alle sechs Bewerter fanden in Entwürfen aus fünf Branchen dasselbe System: Creme-Grund, Serifentitel mit einem kursiven Wort, kleine Versal-Labels mit Werten, gefüllter Knopf plus unterstrichener Telefonlink. Einzeln sauber, zusammen austauschbar.
2. **In den Bauteilen:** Nachdem der Look verschwunden war, ordneten wieder alle sechs Bewerter drei verschiedene Websites demselben Studio zu, kenntlich an Platzhaltern in eckigen Klammern, Ziffern in Mono-Schrift, 1-px-Linienraster, umrandetem «Menü / Schliessen», fester Anrufleiste unten, roter Fehlerbox «n Felder fehlen» mit Linkliste, Spalte «Was danach passiert», Auswahl-Chips mit «Pflicht» und dem Ton «Vier Angaben genügen, wir rufen zurück».

**Regel:** Funktion darf gleich sein, ihre Gestalt nicht.

## 1. Das Register

Zu jeder gebauten Website und jedem Entwurf kommt eine Zeile in eine Datei (z. B. `register.md` im Projekt oder im Studio). Gemessen wird am gerenderten Bild mit `getComputedStyle`, nicht nach Augenmass. Wer eine Richtung wählt, trägt sie **vor dem Bau** ein (Status «im Bau»): Zwei parallele Bauten wählten in einem Test unabhängig denselben Grund (ΔE_OK 0,008).

**Gibt es noch keine eigenen Websites,** gilt der Modell-Standard (Teil 4) als die «letzten drei».

| Achse | Was gemessen wird | Typische Klassen |
|---|---|---|
| 1 Titelschrift | Familie, Klasse und Stil des grossen Titels (seit Entscheid 2 meist der Satz aus der Idee, nicht die `h1`); Anzahl kursiver Teile darin | Antiqua, Grotesk, Egyptienne, Mono, schmale Display |
| 2 Grundfarbe | Hintergrund von `body` und Hero in OKLCH | |
| 3 Hero-Aufbau | einer von neun Typen | Vollbild mit Titel im Bild · zwei Felder · nur Typografie · Fläche und Wort · Bild über Band · Mosaik · Liste als Hero · Objekt freigestellt · kein Foto im ersten Bildschirm |
| 4 Titelmuster | Satzbau des grossen Titels und der `h1` | «[Leistung], [Leistung], *[Wort]*.» · «[Leistung] in *[Ort]*» · «[Ort] seit [Jahr].» |
| 5 Primäraktion | Füllung, Radius, was daneben steht | |
| 6 Schrift der Fakten | Familie und Klasse der Zahlen und Fakten, nicht nur Versalien | Versal-Zeile, Mono-Ziffern, Tabellenziffern im Satz |
| 7 Bildschnitt | Format und Lage des Hauptbilds | randabfallend quer, hoch rechts, Mosaik, kein Bild |
| 8 Bewegung | Typ der Hauptbewegung (Menge frei nach Entscheid 12) | keine, Strich zeichnet sich, Zeile aus der Maske, Einblenden von unten |

Dazu die **sieben Bauteile:** Menü-Knopf, Leiste unten am Handy, Fehlerbox, Auswahl-Chips, Datenschrift, Linienraster, Ton der Mikrotexte.

## 2. Prüfungen als Hinweis

Die Werte stammen aus Modell-Urteilen (blinde Bewerter, keine Menschen). Nach Entscheid 13 ([zusammenspiel.md](zusammenspiel.md)) sind sie **Hinweise**: Sie sperren nichts. Weicht eine Website ab, steht der Grund im Bericht; fällt zusätzlich der Geschwister-Test (Punkt 10, Vorfilter), geht der Bau zurück zur Richtung. Alle Werte `[Annahme]`.

1. **Abstand gesamt:** In mindestens **6 von 8 Achsen** anders als *jede* der letzten drei Websites und jeder Eintrag «im Bau». (3 von 6 reichten in den Tests nicht.)
2. **Schrift:** Eine Familie, die in 3 oder mehr der letzten 15 Entwürfe vorkam, kommt für die Titelrolle nicht in Frage; in derselben Branche schon ab 1 von 15. Ein kursives Wort im Titel besser drei Websites lang nicht. Die Titelschrift unterscheidet sich von der letzten in Klasse oder Breite.
3. **Grundfarbe:** Die Creme-Zone (OKLCH L 0,93–0,97, C ≤ 0,035, h 60–95) nicht als Seitengrund und nicht für Flächen ab 20 % des Bildschirms. Abstand zum Grund jeder der letzten drei Websites mindestens ΔE_OK 0,06 (drei Wahrnehmungsschwellen nach CSS Color 4). Fast-Weiss und blasse Töne (Rosa, Mint) bestehen formal leicht; dort die anderen Achsen strenger nehmen. Liefert die Pipette am eigenen Foto Creme, ist das Foto der Beleg.
4. **Raster:** Hero-Typ anders als bei den letzten drei. «Zwei Felder» (Text links, Bild rechts) gilt als Modell-Standard und braucht einen Grund.
5. **Titel:** keine der Formeln aus Achse 4. Der Titel enthält ein Nomen aus dem Inventar, das nicht der Gattungsname ist (oder einen wörtlichen Satz des Inhabers).
6. **Primäraktion:** «gefüllter Knopf plus unterstrichener Telefonlink» nicht als Grundeinstellung. Die Form kommt aus der Idee (Billett, Register, Stempel) und unterscheidet sich in Radius oder Füllung von der letzten Website. Funktion bleibt Pflicht: ein Verb, ≥ 44 × 44 px, sichtbarer Fokus.
7. **Fakten:** Die Versal-Zeile «LABEL Wert · LABEL Wert» im ersten Bildschirm drei Websites lang nicht; ebenso Mono-Ziffern als Faktenform, wenn sie zuletzt vorkamen. Fakten erscheinen in der Form der Idee: als Fahrplan, Rapport, Etikett, Satz oder Tabelle.
8. **Bildschnitt und Bewegung:** beide in der Klasse anders als bei der letzten Website. Bewegung zeigt am besten etwas Echtes aus dem Betrieb; eine Mengenregel gibt es nicht (Entscheid 12).
9. **Bauteile und Techniken:** mindestens 4 von 7 Bauteilen sichtbar anders als bei den letzten drei. Die tragende Technik ([techniken.md](techniken.md)) ist nicht die tragende einer der letzten zwei Websites. Auch eine Technik wird zum Hausstil, wenn sie immer trägt (DL12).
10. **Geschwister-Test (blind; Modell-Urteil, Vorfilter):** höchstens 1 von 6 Bewertern ordnet die neue Website dem eigenen Studio zu ([blindtest.md](blindtest.md)).

**Die Richtwerte laufen nach drei Websites aus**, sonst wird das Gegenteil zur nächsten Vorlage.

## 3. Registerzeile (Vorschlag)

```
| Datum | Projekt | Status | Titelschrift (Klasse) | Grund OKLCH | Hero-Typ | Titelmuster | Aktion (Füllung/Radius) | Faktenschrift | Bildschnitt | Bewegung | Bauteile (7 Stichworte) | Techniken (tragend; stützend) |
```

Messen mit einem kleinen Playwright-Skript: `getComputedStyle` des grossen Titels, der `h1`, `body`, Hero-Container und Hauptknopf auslesen, Farben nach OKLCH umrechnen, ΔE_OK gegen die letzten drei Zeilen. Solange kein Skript läuft, steht im Bericht «Selbstauskunft».

## 4. Der Modell-Standard (beobachtet)

Was ein Sprachmodell ohne Verfahren immer wieder baut. Gilt als Register, wenn es keine eigenen Websites gibt, und als Warnliste immer.

**Im Look**
- Creme- oder Off-White-Grund; Rost oder Terrakotta als Akzent.
- Serifentitel mit einem kursiven Wort; oder «Grotesk plus ein kursives Serifenwort» (drei Bewerter nannten es einen bekannten Kunstgriff).
- Kleine Versal-Labels mit Werten («SEIT 1987 · GEBIET … · ANTWORT …»).
- Gefüllter Knopf mit Radius 0 plus Telefon als unterstrichener Textlink.
- Text links, Bild rechts («zwei Felder»).
- Dunkelblau mit Gelb, blaue Kastenknöpfe, Zierlinien («KI-typisch» bei fast allen Bewertern).
- Wiederkehrende Schriften: Newsreader (in 5 von 15 Entwürfen), Archivo (4 von 15; ein Modell ohne Vorgaben wählte sie erneut).

**In den Bauteilen**
- Mono-Ziffern als Datenschrift, 1-px-Linienraster, Platzhalter in eckigen Klammern.
- Umrandeter Knopf «Menü / Schliessen», feste Anrufleiste unten.
- Rote Fehlerbox «n Felder fehlen» mit Linkliste; Auswahl-Chips mit «Pflicht».
- Spalte «Was danach passiert»; Ton «Vier Angaben genügen, wir rufen zurück».
- Abschlussblock «Ihr nächster Schritt», dieselbe Rahmenkachel am Ende jeder Seite.

**In der Bewegung**
- Jeder Abschnitt gleitet 30–50 px von unten mit Einblenden herein, gleiche Dauer, gleiche Kurve.

Keines davon ist verboten. Als Voreinstellung ohne Grund aus dem Betrieb ist es ein Befund im Bericht (Hinweis, Entscheid 13).
