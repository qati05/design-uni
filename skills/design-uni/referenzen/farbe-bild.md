# Farbe und Bild

> **Quellen:** W3C WCAG 2.2 (SC 1.4.1, 1.4.3, 1.4.6, 1.4.11); Gordon, NN/g 2021 (Farbe); Albers, *Interaction of Color*; Itten (Kontraste, Sekundärquelle); Labrecque & Milne 2012 (Abstract); Reinecke u. a. 2013, Reinecke & Gajos 2014; Lindgaard u. a. 2006; Nielsen, NN/g 2010 und Paul, NN/g 2024 (Bilder); Krause, NN/g 2023 (Bildstil); «Face Presence and Gaze Direction», JAR 2018; MDN und web.dev (responsive Bilder); Getty Images 2024 und MDPI 2025 (KI-Bilder); Clarke 2019 (Art Direction).

## 1. Farbe

- **G1 · Text-Kontrast.** Text ≥ 4,5:1, grosser Text ≥ 3:1 (AAA 7:1 bzw. 4,5:1). Auch Text auf Fotos an der hellsten Stelle hinter dem Text messen.
- **G2 · Nicht-Text-Kontrast.** Feldränder, Fokusringe, Icons mit Bedeutung ≥ 3:1.
- **G3 · Farbe nie allein.** Fehler, Pflicht, Link im Fliesstext, Status haben ein zweites Merkmal. Prüfung: Bildschirmfoto in Graustufen.
- **G4 · Kleine Palette.** Höchstens drei Markenfarben plus Neutrale.
- **G5 · Flächenverhältnis.** Startwert 60 / 30 / 10; der Akzent gehört dem Wichtigsten, meist der Haupthandlung.
- **G6 · Konsistente Bedeutung.** Jedes Vorkommen der Akzentfarbe ist klickbar oder zentral.
- **G7 · Im Kontext prüfen,** auf dem echten Layout neben den echten Fotos.
- **G8 · Keine Farbpsychologie als Beweis.** Belegt ist nur, dass Ton, Sättigung und Helligkeit die wahrgenommene Persönlichkeit verschieben. Begründe mit dem gewünschten Charakter, nicht mit «Blau schafft Vertrauen».
- **G9 · Komplexität vor Buntheit.** Im ersten Eindruck wirkt Komplexität stärker als Farbigkeit; beide folgen einer umgekehrten U-Kurve. Die Optik wird in rund 50 ms beurteilt.

**Woher die Farbe kommt:** mit der Pipette aus dem eigenen Foto oder dem Material des Betriebs (Firmenauto, Arbeitsjacke, Glasur, Karton). Logo-Farben nur, wenn sie im Bild vorkommen. Signalgelb nur als Fläche mit dunkler Schrift.

**Die Palette ist blind kaum ein Hebel.** In einem Test wurden vier Paletten bei gleicher Komposition, Schrift und gleichem Text je allein im Satz geprüft: 6,67 / 6,50 / 6,50 / 6,33, alle innerhalb der Streuung (±0,5). Die Kritik betraf in allen Sätzen dasselbe: Logo und Foto. **Folge:** Farbe schnell aus dem Material entscheiden, Zeit in Bild, Komposition und Material stecken. Welche von mehreren gleich guten Paletten es wird, entscheidet der Auftraggeber, nicht der Test.

## 2. Bild

- **G10 · Echte Menschen statt generische.** Stockfotos von Menschen werden im Eyetracking übersprungen.
- **G11 · Jedes Bild trägt eine Aussage.** Text abdecken: Lässt sich am Bild erraten, wovon der Abschnitt handelt?
- **G12 · Bild nahe am Text,** auch mobil im selben Ausschnitt.
- **G13 · Wenige starke Bilder.** Pro Bildschirmhöhe ein klares Hauptbild.
- **G14 · Einheitliche Bildwelt.** Gleiche Belichtung, Helligkeit, Kontrast, Farbstimmung; Icons in Strichstärke passend zur Schrift. Prüfung: alle Bilder als Kontaktbogen.
- **G15 · Leistung im Gebrauch** zeigen, nicht freigestellt im Nichts.
- **G16 · Blickführung.** Schaut eine Person zum Titel oder zur Handlung statt in die Kamera, bekommt das Ziel mehr Aufmerksamkeit.
- **G17 · Scharf in Anzeigegrösse** bei 2× Pixeldichte; die Seite bleibt bei rund 1–2 MB.
- **G18 · Schnitt pro Format.** Mobil ein eigener, engerer Hochformat-Ausschnitt mit `<picture>` oder `object-position` mit Absicht.
- **G19 · Alternativtext** beschreibt den Inhalt.
- **G20 · Keine KI-Bilder** von echten Menschen oder Produkten als Beleg; Konsumenten werten sie als irreführend.

**Art Direction**
- **G21 · Erst das Gefühl, dann die Mittel.** Ein Satz: «Der Besucher soll sich … fühlen.» Jede Wahl wird daran gemessen.
- **G22 · Bildwelt-Probe.** Allen Text entfernen; die Grundstimmung muss stimmen.

## 3. Lichtregel für den Fototag

Ein Licht für die ganze Serie ist am Bild der stärkste gemeinsame Nenner der besten Referenzen.

- **Ein Zeitfenster** (z. B. Vormittag), Tageslicht von einer Seite (Fenster, Tor), keine Mittagssonne.
- **Eine Farbtemperatur:** Deckenlicht aus; sonst fixer Weissabgleich (Graukarte). Kein direkter Blitz. Tages- und Kunstlicht nie in einer Serie mischen; Abendlicht ist eine eigene Serie.
- **Eine Voreinstellung** für die Nachbearbeitung; kein Bild einzeln «schöner» machen.
- **Menschen** schauen auf die Arbeit, nicht in die Kamera; ausgenommen Porträts der Fachpersonen. Nur mit Einverständnis; Kundinnen, Patienten und Akten nie erkennbar.
- **Jedes Hauptmotiv quer und hoch** (3:2 oder 16:9 für Desktop, 4:5 näher für das Handy). Ruhige Zone für den Titel einplanen: Das Bild wird *für* den Titel ausgesucht, dann braucht es weder Schatten noch Kasten.
- **Abends Kontaktbogen:** Was aus der Reihe fällt, kommt nicht auf die Seite.

Motivlisten je Branche: [branchen/](branchen/handwerk-auto-bau.md).

## 4. Wenn nur schwache Fotos da sind

Handyfotos, Gebäude-Schnappschüsse, ein pixeliges Logo: Das begrenzt das Ergebnis. In den Tests nannten die Bewerter bei solchem Material fast immer «pixelig», «körnig», «Clipart», während alle Referenzen eigens gemachte Bilder trugen.

**Was trotzdem hilft (Standardweg, bis ein Fototag möglich ist):**
1. **Lichtregel als Skript:** eine feste, wiederholbare Bearbeitung für die ganze Serie, z. B. Zweiton in einer Hausfarbe, Kontrastkurve, leichte Körnung. Jedes Bild gleich, kein Einzelbild «gerettet».
2. **Bild und Schrift komponieren:** Der Titel greift ins Bild, statt daneben zu stehen; der Bildschnitt ist für den Titel gewählt.
3. **Handlung als Typografie:** der Aufruf als gesetztes Element der Titelzeile, nicht als Knopfkasten.

Mit denselben Handyfotos stieg so der beste Entwurf blind von 6,00 auf 7,17, einstimmig «Agentur». Die Bewerter lobten die Komposition, nicht das Foto.

**Grenze:** Ohne Vektorlogo und eigens gemachte Fotos lag die Decke in den Tests bei etwa 6,7 bis 7,2. Nach mehreren Runden betrafen 9 von 15 Kritikpunkten das Material. Dann gilt: **dem Auftraggeber melden, dass es jetzt am Material liegt** (Fototag, Logo als Vektordatei, quer mindestens 3000 px), statt weiter an der Gestaltung zu drehen. Ohne eigene Fotos weichen Bauten fast immer auf typografische Heroes aus; das ist ehrlich, aber im Bericht als Schwäche zu nennen.

## 5. Typische Fehler

**Billig:** lächelnde Stock-Teams, Handschläge, Headset-Damen; Bilder ohne Bezug; unscharf, überkomprimiert; Bilder verschiedener Herkunft gemischt; jede Sektion eine eigene Hintergrundfarbe; graue Knöpfe, die deaktiviert wirken; flimmernde Komplementärfarben; Text auf unruhigem Foto unter 4,5:1; mobil reisst das Bild vom Text.

**KI-Look:** violett-blaue Verläufe, Leuchtkanten, Glas-Karten; glatte KI-Personen; jede Sektion gleich gebaut; Palette ohne Bezug zu Ort oder Material; Icon-Sets, deren Strich nicht zur Schrift passt.
