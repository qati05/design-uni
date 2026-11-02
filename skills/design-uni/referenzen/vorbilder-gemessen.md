# Vorbilder, gemessen

Was Spitzen-Websites **messbar** anders machen als der Modell-Standard. Gemessen mit [../werkzeuge/vermessen.cjs](../werkzeuge/vermessen.cjs), das Band liegt in [../werkzeuge/vorbilder-band.json](../werkzeuge/vorbilder-band.json). Die Techniken, die man an den Bildschirmfotos sieht, stehen in [techniken.md](techniken.md).

**Was das hier ist:** eine Beschreibung von 25 öffentlichen Websites, keine Vorlage und kein Ziel. Nichts wurde kopiert (kein Code, keine Bilder, keine Schriften); gelernt werden Masse und Handgriffe. **Was es nicht ist:** ein blinder Test. Ob ein Mass die Note hebt, ist offen, bis ein Bau es im Bildtest zeigt.

## 1. Stichprobe und Methode

- **Quellen:** Galerien landdding.com (Automotive, Agency, Architecture) und footer.design; daraus vor allem Websites, die einem lokalen Betrieb nahe kommen. recent.design wurde gesichtet, aber noch nicht vermessen. Stand 1. November 2026.
- **Gemessen:** 31 Websites. **Ausgewertet:** 25. Ausgeschlossen, weil der erste Bildschirm nicht messbar war: 2 mit Ladebildschirm oder WebGL, das kopflos schwarz blieb; 4 mit Popup, Keks-Banner oder Intro über dem ersten Bildschirm. Nicht erreichbar: 2 (eine Domain tot, eine hinter einer Browserprüfung).
- **Ausgewertet sind:** Decimals, Eladio Dieste, Digital Metal, ESR (Carrosserie, Porsche-zertifiziert), Etched, Harvest Hall, Infinite Machine, Northeast Tomato (Konservenfabrik), Object & Archive, Onetech (Lackiertechnik), Pixelflakes, Redwood Materials, Rennsport (Restaurierungs-Werkstatt), Slantis, Storey (Architekten), Studio Ag, Tekt (Modulhäuser), Telha Clarke, This January, Turion, United Carriers, watts, Wine Diplomacy (Weinbar), WRK (Uhrmacher), Yummygum.
- **Wie:** Chromium ohne Kopf, 1440 × 900 und 390 × 844, nach dem Laden einmal durchgescrollt; Werte aus `getComputedStyle` und aus einem Punktraster von 32 × 20 Proben im ersten Bildschirm. Ein Mensch hat die Bildschirmfotos aller 25 gesehen und die Techniken gezählt.
- **Verzerrung:** Galerien wählen Marken-, Studio- und Produktseiten. Lokale Betriebe mit Telefon als Hauptaktion sind selten (ESR, Rennsport, Wine Diplomacy, Tekt, Storey kommen am nächsten). Darum gilt: **Gestaltung von den Vorbildern, Angebot und Bedienung aus conversion.md.**

## 2. Das Band (25 Vorbilder)

| Mass | p25 | Median | p75 | so viele von 25 |
|---|---|---|---|---|
| Schriftfamilien mit ≥ 5 % der Zeichen | 2 | 2 | 2 | 20 mit 1 oder 2 |
| Mono-Schrift > 2 % der Zeichen | | | | 7 (meist Mono-Schnitt der eigenen Familie) |
| Star ÷ Fliesstext, Desktop | 2,5 | 3,5 | 5,9 | |
| Star ÷ Fliesstext, Handy | 1,4 | 2,2 | 2,8 | |
| Wortmarke ≥ 50 % der Breite im ersten Bildschirm | | | | 5 gemessen, 7 am Bild gezählt (SVG nicht immer erkannt) |
| Wörter im ersten Bildschirm, Desktop | 19 | 39 | 111 | 19 mit ≤ 120 |
| Wörter im ersten Bildschirm, Handy | 18 | 30 | 77 | 19 mit ≤ 85 |
| Bild oder Video im ersten Bildschirm, Desktop | 0,47 | 0,95 | 1,0 | 16 mit ≥ 0,9 |
| Bild oder Video im ersten Bildschirm, Handy | 0,47 | 0,91 | 1,0 | 13 mit ≥ 0,9 |
| Knopfartige Elemente im ersten Bildschirm, Desktop | 0 | 0 | 1 | 15 mit 0, 21 mit ≤ 2 |
| Knopfartige Elemente im ersten Bildschirm, Handy | 0 | 0 | 1 | 15 mit 0, 24 mit ≤ 2 |
| Karten (Fläche, Radius, Text) | 0 | 0 | 0 | 19 mit 0 |
| Elemente mit Schatten | 0 | 0 | 1 | 16 mit 0 |
| Arten von Eckenradien | 0 | 1 | 3 | 8 ganz ohne Radius |
| Kleine Icons (≤ 48 px) | 1 | 5 | 12 | 20 mit ≤ 14 |
| Seitenhöhe in Bildschirmen | 7,7 | 8,4 | 15,6 | |
| Dunkler Grund | | | | 9 |
| Glattes Scrollen (Lenis) · GSAP · Framer Motion · keine Bibliothek | | | | 16 · 5 · 3 · 3 |
| Plattform: Next.js · Webflow · Framer · Shopify · WordPress · andere | | | | 7 · 4 · 3 · 2 · 2 · 7 |

Neu messen: Teil 5.

## 3. Was daraus folgt `[Annahme, aus Vorbildern]`

1. **Wenige, grosse Dinge.** Im ersten Bildschirm stehen im Median 39 Wörter, kein knopfartiges Element und sieben Links. 19 von 25 haben keine einzige Karte, 16 keinen Schatten. Die Handlung ist ein Wort im Kopf oder eine Zeile, kein Knopfblock. → Die «Vorlagen-Signale» in [../werkzeuge/vergleichen.cjs](../werkzeuge/vergleichen.cjs) und [techniken.md](techniken.md) Teil 3.
2. **Das Material füllt den ersten Bildschirm, oder die Schrift tut es.** 16 von 25 zeigen zu ≥ 90 % Bild oder Video. Die übrigen setzen den Namen oder einen Satz so gross, dass er zum Bild wird (Telha Clarke, Pixelflakes, Decimals). Ein erster Bildschirm mit halber Leerfläche und kleinem Bild kommt bei den Vorbildern nicht vor. Wer kein starkes Foto hat, wählt die Schrift-Variante (DL10, DL11), nicht ein kleines schwaches Foto.
3. **Eine Familie, zwei Rollen.** 20 von 25 kommen mit ein oder zwei Familien aus; sieben ergänzen den Mono-Schnitt **derselben** Familie für Etiketten und Zahlen. Serifen sind selten (3 von 25). Achtung: Mono-Ziffern als Faktenform stehen im Modell-Standard (abstand.md Teil 4); die Vorbilder nutzen Mono für Etiketten, nicht für Faktenreihen.
4. **Raum.** Die Startseiten sind im Median 8,4 Bildschirme lang; Abschnitte bekommen einen Bildschirm, nicht einen Streifen. Kurze Seiten (unter 5 Bildschirmen) kommen fast nur als Einseiter vor.
5. **Bewegung.** 16 von 25 laden glattes Scrollen (Lenis), 5 GSAP. Eine Mengenregel gibt es nicht mehr (Entscheid 12): Glattes Scrollen ist erlaubt, wenn die Idee oder der Wunsch es braucht. Im Standbild sieht man es nicht, blind ist es nicht geprüft, und es kostet Bedienbarkeit (Scrollen fühlt sich fremd an, Reduced Motion muss eigens behandelt werden); darum steht es im Kostenblatt von web-uni und fällt unter Reduced Motion weg.
6. **Das Handy ist eigens gesetzt.** Median 30 Wörter, 0 knopfartige Elemente, 91 % Bild; der Name wird geteilt, gespiegelt oder gestürzt statt verkleinert (techniken.md TK14).
7. **Fakten können die Gestaltung sein.** Die einzige Website eines lokalen Betriebs mit Öffnungszeiten im ersten Bildschirm (Wine Diplomacy) setzt sie als Spaltenkopf mit Haarlinien; sie wirken wie Gestaltung, nicht wie ein Kasten (techniken.md TK3). Für KMU, deren Kundschaft anruft oder vorbeikommt, ist das der naheliegende Weg, Bedienung und Anmutung zu verbinden.

## 4. Gegenprobe an einer Probe

Eine Probe (Carrosserie, 12 Seiten, hell) fiel im Bildtest zweimal durch: 6,33 und 6,50, 1 und 2 von 6 «Agentur». Dieselbe Messung zeigt, wo sie ausserhalb des Bands liegt:

| Mass | Probe | Vorbilder (Median) |
|---|---|---|
| Bild im ersten Bildschirm, Desktop · Handy | 0,26 · 0,29 | 0,95 · 0,91 |
| Leerfläche im ersten Bildschirm | 0,56 | 0,03 |
| Wörter im ersten Bildschirm, Desktop · Handy | 97 · 59 | 39 · 30 |
| Knopfartige Elemente im ersten Bildschirm, Desktop · Handy | 2 · 2 (derselbe Knopf in Kopf und Hero) | 0 · 0 |
| Kleine Icons | 22 | 5 |
| Seitenhöhe in Bildschirmen | 4,4 | 8,4 |
| Star ÷ Fliesstext am Handy | 3,1 | 2,2 |

Die Bewerter nannten Material (Rasterlogo, Handyfoto) und «Text links, Bild rechts». Die Messung passt dazu: kleines Bild, viel Leerfläche, viel Text, viele Icons. **Ursache ist das nicht bewiesen**: Ein randloses Handyfoto hätte die Schwäche grösser gezeigt (techniken.md TK2, Gefahr). Der Weg wäre eine Schrift- oder Fakten-Technik als Träger, und der Fototag.

## 5. Neu messen

```
# eine Website (URL oder Ordner)
node werkzeuge/vermessen.cjs https://beispiel.ch --name beispiel --aus messungen --bilder
# Vergleich mit dem Band
node werkzeuge/vergleichen.cjs messungen/beispiel.json
# Band aus einem Ordner neu rechnen (Ausschlüsse mit Grund in dieser Datei nachtragen)
node werkzeuge/vergleichen.cjs --band-neu messungen --ohne name1,name2 > werkzeuge/vorbilder-band.json
```

- Seiten mit Ladebildschirm: `--warten 9000`. Keks-Banner klickt das Werkzeug weg, wenn ein Knopf «Akzeptieren» heisst; sonst ausschliessen.
- Das Band alle sechs Monate oder nach 20 neuen Vorbildern neu rechnen; Quellen wechseln (Galerien folgen Moden).
- Eigene Websites **nie** ins Band: Es soll beschreiben, was andere tun.

## 6. Grenzen

- Eine Messung sieht nicht, ob ein Bild gut ist, ob ein Satz stimmt oder ob die Idee trägt. Sie zeigt nur, wo eine Seite von den Vorbildern abweicht.
- Wortmarken als SVG oder Bild erkennt das Werkzeug nur, wenn sie breit und flach sind; Kontrast über Bildern misst es nicht.
- 25 Websites, eine Person hat gezählt; keine zweite Zählung.
- Werkzeuge der Analyse: Playwright (Masse, Bibliotheken zur Laufzeit), REA `analyze-web-bundle` (Skript- und Routeninventar einzelner Seiten, z. B. bei ESR: Next.js mit einer Sammelroute für ein CMS). Ghidra blieb ungenutzt: Websites liefern keine Binärdateien.
