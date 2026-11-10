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

## Beschrifteter Schadenplan (Rückmeldung Studio, 02.11.2026: «alle Kategorien aus dem Formular mit gestrichelten Pfeilen, dort steht Dach oder Felge»)
- Startseite: alle 12 Stellen aus dem Formular mit Etikett und gestricheltem Pfeil auf das Blech (Pfeilspitze in Schild-Blau). Etikett und Blech sind ein Link; beim Darüberfahren wird der Pfeil durchgezogen, das Blech blau, das Etikett unterstrichen.
- Damit die Schrift gerade lesbar bleibt, steht das beschriftete Auto flach von oben (Tiefe aus Lack, Glas, Glanz und Schatten); Formular-Plan behält die leichte Perspektive.
- Handy: Etiketten zweizeilig («Seite / links vorne», «Front- / Stossstange»), Schrift rund 16 px; Auto steht unter Titel und Einleitung. Kein seitliches Scrollen.

## Schadenmeldung «in drei Tipps» (02.11.2026)
- Startseite: Schnellstart «Was ist passiert?» mit sieben grossen Knöpfen im Lackverlauf (Parkschaden, Unfall, Hagel, Lackschaden, Scheibe, Felge, Etwas anderes) und dem Weg 1 · 2 · 3; ein Tipp öffnet die Meldung bei Schritt 2.
- Meldung: ein Schritt pro Bildschirm mit Fortschritt 1 2 3, Zurück ohne Datenverlust; Foto-Schritt mit grossem Kamera-Feld und Vorschau; Schritt 3 mit Zusammenfassung «Hagel · 2 Fotos», Kontakt, Tesla-Häkchen, drei Sende-Knöpfen in Rangfolge (Website blau, WhatsApp grün, E-Mail als Rahmen); Bestätigung mit Fotos.
- Der beschriftete Schadenplan bleibt als freiwillige Hilfe in Schritt 1; das grosse Auto ist von der Startseite entfernt. Die Wörter der Schadenarten sind `[Annahme]` (keine Kundenworte gesammelt) und gehören im Gespräch geprüft.

## UI-Durchsicht 02.11.2026 (Auftrag: clean und ästhetisch)
Befunde und Änderungen:
1. Zu viele Nummernfolgen (Fakten 1 2 3, Schnellstart 1 2 3, Formular 1 2 3, Ablauf 01 02 03): Fakten tragen jetzt Beschriftungen (Adresse, Zeiten, Versicherung), der Schnellstart eine ruhige Zeile; Nummern bleiben nur, wo es eine echte Reihenfolge gibt (Formular, Ablauf).
2. Tesla-Abzeichen: Glanzstreifen machte «Approved Body Shop» unscharf; jetzt ohne Glanz.
3. Team: Überschriften «Administration» und «Annahme» liefen zusammen; Spalten breiter.
4. Schadenmeldung: Hauptaktion auf der eigenen Seite nicht doppelt (Leiste unten nur Telefon); am Handy Einleitung knapp, Schritt 1 im ersten Bildschirm.
5. Sende-Knöpfe: Website gefüllt, WhatsApp als ruhiger grüner Rahmen; E-Mail-Weg entfernt.
6. Occasionen: Knopftext kürzer, eine Zeile am Handy.
7. Datenschutzerklärung beschreibt jetzt Website-Versand und WhatsApp (Entwurf, Lücke Mail-Dienst, Rechtsprüfung nötig).
Geprüft: Kontrast aller Seiten hell und dunkel, Handy und Desktop: 0 Befunde. Blind bewertet: nicht gelaufen.

## Lack mit Partikeln (Rückmeldung Studio, 02.11.2026: «Oberfläche wie eine Lackierung, feine Partikel»)
- Hell: Perleffekt mit feinen blau-silbernen Flocken; dunkel: Metallic mit feinen hellen Funken. Eigene Kachel `public/bilder/flocken-hell.png` und `flocken-dunkel.png` (480 px, angezeigt 240 px, je rund 75 KB), keine fremden Hintergründe (bausteine.md: backgrounds.supply nie).
- Nur auf lackierten Flächen: Hero-Hälfte, Seitenköpfe, Schadenmeldung, Ablauf-Band, Schadenarten, Foto-Feld, Rapport-Kopf, Abschluss. Nicht hinter Fliesstext auf Weiss.
- Bewegung: keine von selbst; beim Darüberfahren über eine Schadenart verschieben sich die Flocken um wenige Pixel und blitzen auf (600 ms); unter Reduced Motion ohne Übergang.
- Erste Fassung verworfen: im dunklen Lack wie ein Sternenhimmel, zu grobe Punkte hinter kleiner Schrift. Zweite Fassung: viele, sehr feine Partikel, wenige Funken, weniger Deckkraft.
- Ehrlicher wäre eine Makroaufnahme echter Metallic-Lackierung aus der Lackierkabine (Fototag); die Kachel ist eine Annäherung `[Annahme]`.
- Kontrast: das Prüfskript misst gegen die Grundfarbe, nicht gegen die Partikel; von Auge an Zoomaufnahmen geprüft, Schrift klar lesbar.

## Runde «Premium» (Linie Klar, Branch claude/autospeedy-premium)

Auftrag Reshat: Premiumgefühl, «qualitativ», Schadenmeldung und Anrufen sehr einfach, Tesla ohne Konzerngefühl, Nähe behalten, sanfte Bewegung. Idee aus dem Team: Vorher-nachher-Regler, der der Maus folgt (ohne Ziehen), am Handy wischen.

- Typografie: Titel in Instrument Serif (OFL, selbst gehostet), Kursiv als Akzent; Fliesstext bleibt Hanken Grotesk.
- Farbe: warmes Papier (#faf8f5), Tinte, ein Akzent (Blau #1566b8). Knöpfe als Pille, Druck = leichtes Einsinken.
- Startseite: Hero ruhiger (Lichtfall, langsames Einzoomen), Vertrauensreihe (Tesla Approved als Text, Versicherung, Originalteile, Adresse), Abschnitt «Vorher, nachher», Abschnitt «Aus Altstätten» vor dem Team, Bewertungen als neutrale Platzhalter (keine erfundenen Sterne oder Texte).
- Vorher-nachher (`Vergleich.astro`): Maus/Stift folgt ohne Klick, Touch wischt waagrecht (senkrecht scrollt weiter), Tastatur über einen versteckten Regler mit aria-label und aria-valuetext. Einmaliger Hinweis-Schwenk beim ersten Sichtkontakt, nicht bei «Bewegung reduzieren». Fotos sind Platzhalter (zwei verschiedene Felgen) und so beschriftet: echte Bilder braucht es vom Fototag, gleiche Felge, gleicher Standpunkt.
- Handy: feste Leiste «Anrufen» / «Schaden melden» auf allen Seiten ausser der Schadenmeldung; auf der Startseite erst nach dem Hero.
- Bewegung: Abschnitte blenden sanft ein, Seitenwechsel per View Transition (0.28 s), Schritte der Schadenmeldung gleiten ein. Alles aus unter prefers-reduced-motion. Keine Bibliothek.
- Sicherheit: kein Inline-Skript und kein onclick mehr (alles in klar.js), daher volle CSP nur für Klar (`dateien({ csp: true })`); /admin/ bleibt ausgenommen. Linie Lack unverändert.
- Tests: `npm test` in astro-klar (statisch + Browser mit playwright-core und installiertem Chrome, `CHROME=/pfad`).
