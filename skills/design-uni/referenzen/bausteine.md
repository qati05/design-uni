# Bausteine aus Baukästen

Baukästen für Bewegung und Komponenten liefern fertige Abschnitte. Für design-uni sind sie **Anschauung, keine Quelle**: Ein fertiger Baustein bringt seinen Look mit, und Bauteile, die wiederkehren, verraten das Studio (DL12). Darum gilt:

- **Muster lernen, selbst bauen.** Kein Code und keine Bilder aus Baukästen in eine Kundenseite; jede Umsetzung ist eigener Code ohne Bibliothek, mit Farben und Schrift aus den Tokens des Betriebs.
- **Jeder Baustein dient einer Technik** ([techniken.md](techniken.md)) und hat einen «weil»-Satz aus dem Betrieb. Sonst ist er Dekoration.
- **Bewegung bleibt: keine oder eine** (SKILL.md Schritt 4, [bewegung.md](bewegung.md)). Ein Baustein mit Bewegung **ist** die eine Bewegung.

Die eigenen Umsetzungen stehen in der **Galerie** [../galerie/index.html](../galerie/index.html), geprüft mit [../galerie/pruefen-galerie.cjs](../galerie/pruefen-galerie.cjs) (ohne JavaScript lesbar, still unter «Bewegung reduzieren», nach 3 s keine Animation, endlose nur mit Pause, Kontrast, 44 px am Handy).

## 1. Die Galerie: elf Bausteine

| # | Baustein | Technik | Urteil | Braucht vom Betrieb |
|---|---|---|---|---|
| B1 | Strich zeichnet sich unter ein Wort | TK5, TK6 | trägt, wenn echt | ein Ding, das wirklich gezogen wird (Schnur, Kreide, Band, Naht) |
| B2 | Titelzeile steigt aus einer Maske | TK1, TK6 | nur mit Idee | einen Grund (Schublade, Schlitz, Etikett) |
| B3 | Fallblatt zeigt, was jetzt gilt | TK3 | trägt, wenn echt | belegte Zeiten, Kalenderprüfung DP6 |
| B4 | Laufband mit Pause | TK10 | nur mit Idee | gepflegten Inhalt (Termin, Saison, Pikett) |
| B5 | Wortliste mit aktivem Eintrag | TK7 | trägt, wenn echt | 4 bis 12 echte Einträge |
| B6 | Form aus dem Betrieb öffnet das Bild | TK8 | nur mit Idee | belegte Form, Fotos in Serie |
| B7 | Vorher und nachher, von Hand verschoben | TK2, TK9 | trägt, wenn echt | zwei Fotos vom selben Stativpunkt |
| B8 | Masslinien legen sich ans Werkstück | TK9 | nur mit Idee | echte Werte, Detailfoto |
| B9 | Ablauf in drei Spalten mit Haarlinien | TK4 | trägt, wenn echt | drei Schritte mit Frist und Person |
| B10 | Fragen, die sich öffnen (`details`) | – | trägt, wenn echt | Fragen der Kundschaft |
| B11 | Handy-Menü als Blatt von unten (`dialog`) | TK14 | nur mit Idee | einen Grund (Schublade, Werkzeugwagen) |

«Trägt, wenn echt» heisst: Der Baustein zeigt einen echten Zustand, ein echtes Material oder hilft bei der Bedienung. «Nur mit Idee» heisst: ohne Grund aus dem Betrieb ist er Dekoration.

## 2. Was in den Baukästen steckt (gesichtet am 1. November 2026)

**motionin.design** (54 Abschnitte, bezahlt, verkauft «Copy Prompt → Ship it»): Fast alle sind ganze Abschnitte mit WebGL, 3D oder gekapertem Scrollen, gebaut für Portfolios und Produkte.

| Gruppe | Beispiele | Urteil für KMU |
|---|---|---|
| Bildwände und Karussells in 3D | Boutique, Dimension, Burst, Frieze, Rotunda, Momentum Slider, Riffle, Revolver, Cardwall, Hardback, Pantheon | nie als Voreinstellung: halten Inhalt zurück, brauchen viele starke Bilder |
| Galerien mit gekapertem Scrollen | Aperture, Moments, Morph, Reverie, Lens Bloom, Folio, Cinema Reel, Emulsion, Iris, Assembly | nie als Voreinstellung: Scrollen fühlt sich fremd an, Reduced Motion schwer |
| Felder und Partikel | Filament, Fathom, Helix, Aurora, Membrane, Fluid Gallery, Shape Trail | nie: Dekoration ohne Bezug zum Betrieb |
| Spiele und Nostalgie | Cabinet, Desk 95, Console, Overworld, Rooster Rush, Atelier, Isle | nie für KMU |
| Werbe-Heros | Spring, Aster, Benchmark, Crema, Marathon | nie: Vorlage für App-Werbung |
| Brauchbare **Gedanken** | Loupe (ein einziges Bild, ein Kopf), Cutout (Schneidematte von oben, wie eine Werkbank-Collage), Formation (Werkverzeichnis als Raster), Liquid Type und Alive (Schrift als Bild) | als Anregung für TK1, TK2, TK6; ohne die Bewegung |

**beui.dev** (56 Komponenten für React mit Motion und Tailwind, Open Source): überwiegend Bedienelemente für Anwendungen (Auswahl, Kalender, Farbwähler, Tabelle, Seitenleiste, Dock).

| Gruppe | Beispiele | Urteil |
|---|---|---|
| Rückmeldung (Dauer nach [bewegung.md](bewegung.md) Teil 2) | Akkordeon, Tabs, Tooltip, Schalter, Drawer, Bottom Sheet | als Verhalten erlaubt; selbst gebaut mit `details`, `dialog`, CSS (B10, B11) |
| Inhalt mit echtem Bezug | Timeline, Marquee, Image Viewer | als B9, B4, B7 in eigener Form |
| Nie als Voreinstellung | Zahl, die hochzählt; Tilt-Card; Shader-Hintergrund; Dock; Loader; Text-Animation pro Buchstabe | Zähler «500+» und Loader stehen schon in der Nie-Liste; Tilt und Shader sind Dekoration |
| Für Websites unnötig | Pagination, Combobox, Datumsbereich, Farbwähler, Dateibaum, Sortierstapel | App-Oberflächen, nicht Gegenstand des Skills |

Technik: React plus Framer Motion. Eine statische KMU-Seite braucht dafür kein Framework; die Muster lassen sich in CSS und wenigen Zeilen JavaScript bauen (siehe Galerie).

**backgrounds.supply** (1 273 Hintergründe in 29 Sammlungen, bezahlt, ausdrücklich auch KI-erzeugt: Verläufe, Schlieren, Aurora, Portale, ASCII): **nie** auf einer Kundenseite. Ein fremder Hintergrund ersetzt das Material des Betriebs, die Palette ist blind kaum ein Hebel (DL8), und KI-Bilder stehen als Beleg unter Grundregel 5. Wer eine Fläche braucht, nimmt eine Textur aus dem eigenen Material (Fototag, Motiv 12).

## 3. Prüfen, bevor ein Baustein in ein Projekt geht

1. Welche Technik trägt er, und wie lautet der «weil»-Satz aus dem Betrieb?
2. Ist er die eine Bewegung der Website? Wenn es schon eine gibt: weglassen.
3. Ohne JavaScript lesbar, unter «Bewegung reduzieren» still, fertig nach der Tabelle in [bewegung.md](bewegung.md) Teil 2 oder mit Pause?
4. Sieht er anders aus als bei den letzten drei Websites (Bauteile im Register)?
5. Läuft `pruefen.cjs` des Projekts danach weiter ohne Fehler?
