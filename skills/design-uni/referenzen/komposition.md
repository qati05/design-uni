# Layout, Raster und Komposition

> **Quellen:** NN/g (Visual Hierarchy; 5 Principles of Visual Design; Common Region; Using Grids; F-Shaped Pattern; Illusion of Completeness); Boulton, «Whitespace», A List Apart 2007; Ford, «Content-out Layout», A List Apart 2014; Clarke, «Inspired Design Decisions: Pressing Matters», Smashing 2019; Rutter, «Compose to a Vertical Rhythm»; Tuch u. a., «The role of visual complexity and prototypicality…», IJHCS 2012; Pickering/Bell, *Every Layout*; Wathan/Schoger, *Refactoring UI* (nur Zusammenfassungen); IxDF, Gestaltgesetze.

## 1. Grundsätze

**Raster und Masse**
- **DGK1 · Ein Raster pro Breakpoint, nachweisbar.** Kanten liegen auf Spalten- oder Gutterlinien; im Code ein Grid, keine frei gesetzten Pixelbreiten. Richtwert rund 4 Spalten mobil, 12 am Desktop.
- **DGK2 · Das Raster sitzt bewusst im Format.** Ränder gleich oder absichtlich asymmetrisch; Rand mindestens so breit wie ein Gutter.
- **DGK3 · Rasterbruch nur mit Grund.** Höchstens ein Element pro Abschnitt verlässt das Raster, und es ist das wichtigste.
- **DGK4 · Lesezeilen nie über 80 Zeichen, am Desktop 50 bis 75** (`max-width` in `ch`), auch wenn das Raster breiter ist; über 80 sperrt, 50 bis 75 ist ein Hinweis, am Handy gilt nur «nie über 80» (Schwelle: [zusammenspiel.md](zusammenspiel.md) Teil 4).
- **DGK5 · Breakpoints entstehen am Inhalt:** dort, wo «7er» (Bild schrumpft, Text wird Turm), «Drifts» (Zusammengehöriges driftet) oder «Pinches» (Fremdes rückt zu nah) auftauchen.

**Weissraum und Abstände**
- **DGK6 · Abstände aus einer Skala** von höchstens rund 10 Stufen, Nachbarstufen ≥ 25 % auseinander. Kein 13 px, kein 37 px.
- **DGK7 · Nähe vor Rahmen.** Abstand in der Gruppe sichtbar kleiner als zur nächsten Gruppe (Faustregel Faktor 2).
- **DGK8 · Rahmen und Flächen sparsam,** nur wo Nähe nicht reicht.
- **DGK9 · Mit zu viel Raum anfangen, dann wegnehmen.** Das Wichtigste hat am meisten Raum.
- **DGK10 · Nicht die ganze Breite füllen.** Formulare und Texte in einer Spalte, auch bei 1440 px.
- **DGK11 · Vertikaler Rhythmus** aus der Zeilenhöhe oder der Abstandsskala.

**Hierarchie**
- **DGK12 · Drei Stufen, ein Star.** Höchstens drei Grössenstufen pro Ansicht, höchstens zwei wirklich grosse Elemente; das Wichtigste ist das grösste.
- **DGK13 · Höchstens drei Kontraststufen.**
- **DGK14 · Der Unschärfe-Test hält.** Mit 5–10 px Unschärfe bleiben Gruppen und Blickfang; bei 20 px dominiert kein zufälliges Element.
- **DGK15 · Wichtiges oben und links;** Zwischentitel beginnen mit dem informativsten Wort.

**Abfolge**
- **DGK16 · Kein falscher Boden.** Am unteren Rand des ersten Bildschirms ist Folgeinhalt angeschnitten. In einem NN/g-Test merkten 6 von 8 Personen sonst nicht, dass sie scrollen können.
- **DGK17 · Abschnitte wechseln das Tempo:** dicht, weit, dicht. Kleine wiederholte Module beschleunigen, grosse verlangsamen.
- **DGK18 · Asymmetrie mit benennbarem Verhältnis** (z. B. 2fr 1fr 1fr 2fr aus einem 4+6-Compound-Grid, 1:1,618).
- **DGK19 · Ähnliches sieht gleich aus:** gleiche Funktion, gleiche Masse und Abstände.

**Wirkung**
- **DGK20 · Geringe Komplexität, erkennbare Gattung.** Nach 17–50 ms gefallen am besten Seiten mit tiefer Komplexität *und* hoher Prototypikalität (Tuch u. a. 2012).
- **DGK21 · Mehr Weissraum heisst mehr Wertigkeit;** enger Satz signalisiert Discount (Boulton).

## 2. Gut gegen premium

| | Gut | Premium |
|---|---|---|
| Raster | 12 Spalten sauber | aus Inhalt oder Verhältnis abgeleitet, oft Compound Grid; Kanten stimmen über Abschnitte |
| Weissraum | ausreichend, gleichmässig | gezielt ungleich; Leere wird zur Form |
| Hierarchie | klare H1–H3 | ein mutiger Blickfang mit grossem Massstabssprung |
| Rhythmus | gleiche Abschnitte | Tempo wechselt; jeder Abschnitt eigene Komposition |
| Asymmetrie | zentriert oder 50/50 | benennbares Verhältnis, Gegengewicht durch Weissraum |
| Responsiv | Spalten stapeln sich | pro Breite neu gedacht |
| Details | meist konsistent | jeder Abstand aus der Skala; optische Korrekturen |

**Bild und Schrift komponieren, nicht nebeneinanderstellen.** Ein Titel, der mit Absicht ins Bild greift, ein Bildschnitt, der für den Titel gewählt ist, und eine Handlung, die zur Typografie gehört, wirkten blind deutlich besser als «Text links, Bild rechts» mit Kastenknöpfen. Zufälliger Bildschnitt, gleich gewichtete Knöpfe und Blöcke und ein Loch im Raster waren die häufigsten Kritikpunkte an durchgefallenen Skizzen.

## 3. Typische Fehler

- Alles gleich gross, alles gleich wichtig.
- Kartenflut: jede Gruppe in einer Box mit Rahmen, Schatten, runden Ecken.
- Mehrdeutige Abstände; Zufallswerte.
- Der ewige 12-Spalten-Mittelstreifen mit drei gleichen Karten.
- Gleiches Raster und gleicher Abstand in jedem Abschnitt.
- Vollbild-Hero mit zentriertem Text und Knopf, nichts angeschnitten.
- Mobil = Desktop gestapelt.
- **KI-Signatur:** Hero links Text / rechts Bild, darunter drei Feature-Karten mit Icon, Logo-Leiste, Testimonial-Karussell, CTA-Band mit Verlauf; alle Abschnitte gleich hoch und zentriert.

## 4. Wie es je Branche ausschlägt `[Annahme]`

- **Handwerk:** kräftiges Raster mit grossen Bildflächen der Arbeit, Kontakt früh und gross; robuste Asymmetrie (breite Bild-, schmale Textspalte). Zu viel Luxus-Weissraum wirkt abgehoben.
- **Gesundheit:** niedrige Komplexität ist Pflicht, passiver Weissraum, wenig Tempowechsel, klare Gruppen für Angebote und Termine.
- **Gastronomie:** grosse randabfallende Bilder, starke Tempowechsel, Überlappung erlaubt; die Karte selbst als klares Listenraster.
- **Recht, Finanzen:** strenges sichtbares Raster, viel Makro-Weissraum, wenige Stufen, saubere Lesespalte; Ordnung ist die Botschaft.
- **Bau, Immobilien:** grosse Bilder, Modulraster für Objekte, deutliche Achsen.
- **Handel:** Übersicht vor Inszenierung; gleichförmige Produktmodule, Inszenierung nur im Kopf und in Kategorie-Einstiegen.

## 5. Prüffragen an ein Bildschirmfoto

1. Lässt sich ein Raster einzeichnen, auf dem fast alle Kanten liegen?
2. Genau ein Blickfang, und ist er das Wichtigste?
3. Bleiben bei 5–10 px Unschärfe die Gruppen?
4. Abstände in Gruppen kleiner als zwischen Gruppen?
5. Rahmen und Flächen nur, wo Nähe nicht reicht?
6. Höchstens drei Grössen- und drei Kontraststufen?
7. Fliesstext nie über 80 Zeichen, am Desktop 50 bis 75?
8. Folgeinhalt unten angeschnitten?
9. Wechseln Abschnitte Dichte oder Komposition?
10. Hat jeder Rasterbruch einen Grund?
11. Sehen gleichartige Elemente exakt gleich aus?
12. Ruhig und als Gattung erkennbar?
13. Mobil neu gewichtet, ohne «7er», «Drifts», «Pinches»?
14. Weissraum passend zur Marktposition?
15. Gleicht der Aufbau «Hero, drei Karten, Logos, Testimonials, CTA-Band»? Wenn ja: Fehler.
