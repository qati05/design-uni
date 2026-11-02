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
