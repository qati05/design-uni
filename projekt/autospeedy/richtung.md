# Richtung (Entwurf, design-uni Schritt 3)

**Lage:** Das Gespräch mit dem Betrieb (Richtungsblatt) hat nicht stattgefunden. Alles hier ist aus öffentlichen Quellen und dem Auftrag abgeleitet: `[Annahme]`. Das Sieben gegen Mitbewerber im Umkreis von 20 km ist **nicht gelaufen**.

**Nomen, belegt im Foto oder auf der Website:** Hallengebäude in Grau mit Schild (blauer S-Schwung), Alte Landstrasse, Occasionen auf dem Areal, Hebebühne, Werkzeugwagen mit Schubladen, Messsystem in Gelb an der Wand, blaue Gebotszeichen an der Hallenwand, neue grössere Lackierkabinen, Lackierstand, Trauerweide neben der Halle, Original-Ersatzteile, Lehrlinge (Ausbildungsbetrieb). Das sind 12, aber ob ein Mitbewerber das Gleiche hat, ist ungeprüft.

**Idee (Entwurf):** *Die Website ist die Halle, in der man sofort weiss, wo man hingehört.* Hell wie die Halle, beschriftet wie ihre Wand: nummerierte Wegweiser in Gebotsblau (aus den Zeichen an der Halle und dem Schwung im Schild), grosse Schrift wie Beschilderung. Die Schadenmeldung ist der Ausgang, der immer offen ist.

**Eine grosse Entscheidung:** ein Foto der Halle über 58 % der Breite, plus ein System aus nummerierten Wegweisern. Kein Hero-Slider, keine Bewegung.

**Techniken, gelernt vom Vorbild greco-car.ch (nichts kopiert):**
- Der Kunde findet **Schaden melden und Telefon in jedem Bildschirm** (bei Greco: feste Leiste mit «24h Schadenmeldung» und Nummer). Bei uns: Kopf, am Handy Leiste unten.
- Ein **eigener Einstieg für Elektro-Marken** (bei Greco: Seite «Tesla Body Shop»). Bei uns: ein Knopf, der das Formular mit «Tesla» vorwählt; **Inhalt der Tesla-Seite erst, wenn der Betrieb Belege liefert (F14).**
- Leistungen als **Reihe kurzer Wörter**, eine Ansprechperson mit Foto im Chat-Stil (Greco: «Gabriel»): bei uns nicht übernommen, weil keine Person belegt ist.
- Nicht übernommen: Text, Bilder, Code, Aufbau, Farben, Chat-Knopf, Slider.

**Tokens (Namen aus dem Betrieb):** `--hallenweiss #f3f5f6`, `--blech #e2e7e9`, `--hallengrau #4a585d`, `--gebotsblau #1566b8`, `--tinte #14202a`. Schrift Barlow Semi Condensed (Titel, wie Beschilderung) und Barlow (Text). Kontrast gemessen: Text auf Grund 15,1:1; weiss auf Gebotsblau 5,8:1.

**Offen:** Ob der blaue S-Schwung des echten Logos später die Akzentfarbe bestimmt (Vektordatei fehlt). Blindtest (DP1, DP4): nicht gelaufen.

## Richtung B «Yin und Yang» (Rückmeldung des Studios, 02.11.2026: «aggressiver, mehr herausstechen, wie ein Yin und Yang»)
- **Idee:** Das S im Logo besteht aus zwei ineinandergreifenden Schwüngen, schwarz und blau. Die Website nimmt das als harten Wechsel Schwarz und Weiss mit schrägem Schnitt im Winkel des Schwungs.
- **Umsetzung:** schwarze Texthälfte gegen helles Foto im ersten Bildschirm und auf jeder Unterseite; Bänder im Wechsel Weiss und Schwarz mit schrägen Kanten; Titel kursiv wie der Schriftzug AUTO SPEEDY; kantige Knöpfe in Versalien; Blau nur als Akzent (Strich unter dem Satz, Ziffern, Knopf, Abschluss).
- **Wunsch 3 «hell und übersichtlich»:** Kopf, Wege, Partner, Anfahrt, Formular und Fuss bleiben hell; Schwarz trägt nur Einstieg, Ablauf und Galerie. Ob das für den Betrieb noch «hell» ist, entscheidet er im Gespräch.
- Kontrast gemessen: Weiss auf Nacht 19:1, Hellblau `#6fb0f2` auf Nacht über 7:1.

## Richtung C «Logo-Kontrast» (Rückmeldung Studio, 02.11.2026: «nicht schwarz-weiss, der Kontrast soll mit den Logo-Farben sein»)
- Gegenpole aus dem Logo: **Navy `#1f2d40`** (S-Schwung, Pipette `#203040`) gegen **Silber `#dfe2e8` und Weiss** (Schatten `#b8b8c0`); Akzent **Schild-Blau** der Fassade (`#1566b8` auf hell, `#8cc2f5` auf Navy). Schwarz entfällt.
- Kontrast: Weiss auf Navy 13,9:1; Hellblau auf Navy 7,4:1; Navy auf Silber 10,7:1.

## Bewegung (DP2, Entscheid 12), aus der Galerie gewählt
| Baustein | Wo | Weil | Stand |
|---|---|---|---|
| GB6 Form öffnet das Bild (Hauptsache) | Foto im ersten Bildschirm und in jedem Seitenkopf, einmal 900 ms | Der schräge Schnitt ist der Schwung des Logos; Navy schiebt sich vom Foto weg | gebaut |
| GB1 Strich zeichnet sich | Schwung unter dem grossen Satz, einmal 700 ms | Der Schwung des S ist das eine Ding der Marke, das «gezogen» wird | gebaut |
| GB5 Liste mit aktivem Eintrag | K + L Partner, Tesla aktiv, Zeiger wählt um, 160 ms | vier echte Einträge, Tesla ist Wunsch 2 | gebaut |
| GB7 Vorher und nachher | Carrosserie, Hagel, Felgen | stärkster Beleg einer Carrosserie | **nicht gebaut**: braucht zwei Fotos vom selben Standpunkt (Fototag) |
| GB3 Fallblatt «jetzt offen» | erster Bildschirm | Schadenmeldung: Kunde will wissen, ob jemand abnimmt | **nicht gebaut**: Samstag, Feiertage, Ferien fehlen, ein falsches «offen» wäre eine falsche Zusage |
| GB11 Menü als Blatt von unten | Handy | Leiste unten ist schon da | Option |
| GB2, GB4, GB8, GB10 | – | kein Grund aus dem Betrieb (keine gepflegten Inhalte, keine Masse, keine echten Kundenfragen) | nein |
Fremde Baukästen (motionin.design, beui.dev, backgrounds.supply) nur als Anschauung, nichts übernommen (bausteine.md).
Boden gemessen: Reduced Motion 0 Animationen; nach 5 s läuft nichts; `h1` und Telefon nach 1,0 s lesbar (Text wird nicht animiert).

## Richtung D «Lackverlauf» (Rückmeldung Studio, 02.11.2026: «Farbverlauf Richtung Lackierung, Weiss und Babyblau, überlege es selber») · aktuell
- **Idee:** Die Flächen sehen aus wie frisch lackiertes Blech: Weiss läuft schräg in Babyblau (`#c4e0f8`, `#b9dbf7`), darüber ein weicher Glanzstreifen wie die Lichtleisten der Lackierkabine auf dem Lack (Startfoto: Defender in der Lichtkabine). Navy ist nur noch Schrift; Schild-Blau bleibt Akzent, als Verlauf `#0f4f94` → `#1566b8` im aktiven Partner und im Abschluss.
- Wo: linke Hälfte im ersten Bildschirm und in jedem Seitenkopf, Kopf der Schadenmeldung, Bänder «So läuft eine Reparatur» und «Aus der Werkstatt», aktive Wege beim Darüberfahren. Partner auf Weiss→Silber.
- Bleibt: schräger Schnitt (Logo-Schwung), Bewegungen GB6, GB1, GB5, kursive Titel.
- Wunsch 3 «hell und übersichtlich» ist damit wieder voll erfüllt.
- Kontrast (gerechnet, dunkelste Stelle Babyblau `#b9dbf7`): Schrift `#14202a` 11,5:1; Blau `#0f4f94` 5,7:1; Weiss auf Schild-Blau 5,8:1 bis 8,2:1. Messung aller Seiten: 0 unter Soll.

## Signatur «Schadenplan» (Auftrag Studio, 02.11.2026: «eine spezielle Art, die es als die Auto-Speedy-Website macht»)
- **Die eine grosse Entscheidung (System):** Das Auto von oben, Blech für Blech, mit Spaltmassen in Navy wie am echten Fahrzeug. Jedes Blech ist im Lackverlauf lackiert; die Stelle unter dem Finger wird Schild-Blau. Der Plan ist zugleich die Hauptaktion (Wunsch 1: Schadenmeldung immer möglich) und das Erkennungszeichen.
- **Wo:** Startseite «Wo hat es Ihr Auto erwischt?» (jede Stelle ist ein Link zur Meldung mit dieser Stelle; Feld daneben zeigt Stelle und passende Leistung aus fakten.md); Schadenmeldung Schritt 2 (Stellen an- und abwählen, synchron mit Kästchen); Schadenrapport nach dem Absenden mit dem Auto und den markierten Stellen.
- **Tauschtest:** Ein Coiffeur oder Schreiner kann ihn nicht haben; eine andere Carrosserie könnte ihn bauen, aber die Farben, der Lackverlauf und der Schwung gehören Auto Speedy. Blind nicht geprüft.
- **Zwölf Stellen** mit Leistungen nur aus fakten.md (F5, F6, F16). Keine Fristen, keine Preise.
- **Boden:** ohne JavaScript sind die Stellen Links und die Kästchen ein normales Formular; Tastatur: jede Stelle mit Fokus erreichbar; Bildschirmleser lesen «Motorhaube: Schaden hier melden»; Reduced Motion ohne Übergänge.

## Ausbau 02.11.2026 (Rückmeldung Studio: mehr 2D/3D, kompaktere Navigation mit Tesla, Dunkelmodus «dunkel lackiert»)
- **Schadenplan plastisch:** jedes Blech mit eigenem Lackverlauf, Scheiben als dunkles Glas, Reifen mit silbernen Felgen, Spiegel, Scheinwerfer, rote Rückleuchten, ein Glanzstreifen quer über das Auto; Schatten darunter; Perspektive wie auf einer Drehbühne (CSS `rotateX`/`rotateZ`, fest, folgt nicht der Maus: Tilt nach Maus steht in der Nie-Liste). Im Formular flacher, im Rapport flach.
- **Navigation:** Carrosserie, Lackiererei, Felgen und Folierung unter «Leistungen» (`details`, geht ohne JavaScript; schliesst bei Klick daneben und mit Escape). **Tesla als eigenes Abzeichen** im Schild-Blau-Verlauf mit «Approved Body Shop», schräg geschnitten wie der Schwung; auch im Handy-Menü.
- **Dunkel lackiert:** folgt der Einstellung des Geräts; Knopf im Kopf (Muster halb hell, halb dunkel lackiert) wählt für den Besuch um, speichert nichts. Dunkler Lack = Metallic-Navy-Verlauf mit bläulichem Glanz; das Logo erscheint hell wie das beleuchtete Fassadenschild (Filter auf dem Rasterlogo; mit einer Vektordatei sauberer).
- **Umlackieren als Bewegung:** Beim Wechsel zieht der neue Lack schräg mit weicher Sprühnebel-Kante über die Seite (View Transitions mit Maske, 1,1 s, einmal). Ohne Unterstützung oder unter «Bewegung reduzieren» sofort.
- Kontrast in beiden Lacken an allen 11 Seiten gemessen: 0 unter Soll.
