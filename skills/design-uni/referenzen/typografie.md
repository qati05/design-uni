# Typografie im Web

> **Quellen:** Butterick, *Practical Typography*; Rutter, *The Elements of Typographic Style Applied to the Web* (Bringhurst fürs Web); Tim Brown, «More Meaningful Typography», A List Apart 2011; Gilyead, «Designing with fluid type scales» (Utopia, 2020); W3C WCAG 2.2 SC 1.4.3 und 1.4.12; web.dev «Best practices for fonts» und «Variable fonts»; MDN `text-wrap`; Lupton, *Thinking with Type* (Auszüge); Typolexikon (Guillemets). Nicht im Original gelesen: Bringhurst, Müller-Brockmann.

## 1. Grundsätze

**Grundtext**
- **G1** Grundtext 15–25 px; unter 16 px nur bei auffällig grosser x-Höhe. Auf Handwerks- und Gesundheitsseiten 18–20 px.
- **G2** Zeilenabstand 1,2–1,45 (einheitenlos), im Web meist ab 1,3; bei Gesundheit bis 1,6.
- **G3** 45–90 Zeichen pro Zeile, ideal um 66; mehrspaltig 40–50. Prüfung: 2–3 Alphabete pro Zeile.
- **G4** Textblöcke haben `max-width` in `ch` oder `em`, auf jeder Breite.
- **G5** Absätze mit Abstand *oder* Einzug, nie beides.
- **G6** Linksbündiger Flattersatz. Blocksatz nur mit Silbentrennung (`hyphens: auto`, korrektes `lang`).
- **G7** Zentriert nur Kurzes (Titel, wenige Zeilen).

**Schriftwahl und Paarung**
- **G8** Höchstens zwei Familien, jede mit fester Rolle. Kein Wechsel im Absatz.
- **G9** Paarungen klar unterscheidbar; «nur Serif mit Sans» ist keine Regel. Sicher: zwei Schriften desselben Gestalters oder einer Superfamilie.
- **G10** Keine Systemstandards als Entscheid (Arial, Times), keine Kostümschriften, keine Mono für Fliesstext.

**Skala und Hierarchie**
- **G11** Alle Grössen aus einer Skala mit 5–7 Stufen; keine Einzelwerte ausserhalb.
- **G12** Fluide Skala: klein enger (Faktor um 1,2), gross weiter (1,333 und mehr), mit `clamp()` interpoliert.
- **G13** Höchstens drei sichtbar verschiedene Überschriftenebenen, besser zwei.
- **G14** Hierarchie zuerst über Abstand und Grösse, dann Gewicht; Überschriften oben mehr Abstand als unten.
- **G15** Fett oder kursiv, nicht beides; Unterstreichung nur für Links.
- **G16** Vertikale Abstände in festen Intervallen.

**Laufweite und Display**
- **G17** Versalzeilen und Kapitälchen 0,05–0,12 em Laufweite; Kleinbuchstaben im Text keine.
- **G18** Versalien nur für weniger als eine Zeile (Labels, Kicker), nie für ganze Sätze.
- **G19** Grosse Titel in Kleinbuchstaben leicht enger (negative Laufweite), Zeilenabstand 0,9–1,1.
- **G20** Kerning immer an.
- **G21** Titel mit `text-wrap: balance`, Fliesstext mit `text-wrap: pretty`.

**Mikrotypografie**
- **G22** In der Deutschschweiz Guillemets mit Spitzen nach aussen, ohne Abstand: «…», innen ‹…›. Keine geraden " ".
- **G23** Echte Zeichen: Gedankenstrich –, Auslassung …, ×, Apostroph ’. Zahl und Einheit mit geschütztem Leerzeichen (CHF 120, 5 km).
- **G24** Tabellenziffern (`font-variant-numeric: tabular-nums`) in Preislisten, Tabellen, Telefonnummern.
- **G25** `lang` korrekt setzen (z. B. `de-CH`); Überschriften nicht trennen.

**Technik und Barrierefreiheit**
- **G26** Kontrast Text ≥ 4,5:1, gross (ab 24 px oder ca. 18,5 px fett) ≥ 3:1.
- **G27** Layout hält erzwungene Abstände aus (Zeile 1,5, Absatz 2 em, Laufweite 0,12 em, Wort 0,16 em): keine festen Höhen um Text.
- **G28** WOFF2, Teilmenge mit ä ö ü « » –, nur gebrauchte Schnitte, lokal gehostet, `font-display` bewusst gewählt, Fallback mit `size-adjust`. Lizenz (z. B. SIL OFL) vor dem Einsatz in der Lizenzdatei prüfen, auch «Reserved Font Name».
- **G29** Variable Schriften ab mehreren Schnitten; Titel dürfen mit Achsen spielen, Grundtext nicht.

## 2. Gut gegen premium

| Merkmal | Gut | Premium |
|---|---|---|
| Schriftwahl | solide Gratis-Grotesk, sauber | eine Schrift mit Charakter und Grund (historisch, regional, aus Technik oder Material des Betriebs) |
| Grössenkontrast | Titel ca. 2 × Text | grosser Sprung (Desktop oft 4–8 ×), wenige Stufen dazwischen |
| Display-Satz | Standard-Laufweite, geerbter Zeilenabstand | eng, Zeilenabstand um 1, ausgewogen, optischer Randausgleich |
| Gewicht | Regular und Bold | feine Abstufungen bei variablen Schriften |
| Mikrotypografie | korrekte Zeichen | Kapitälchen, passende Ziffern je Ort, hängende Satzzeichen |
| Zurückhaltung | – | eine Familie mit vielen Rollen statt vieler Schriften |

Kurzformel: leise im Grundtext, laut in genau einem Element pro Bildschirm.

**Schrift greift ins Bild.** In einem Test hob es den ersten Bildschirm deutlich, als der Titel ins Foto griff (Überlagerung mit Absicht), statt daneben zu stehen, und die Handlung als Teil der Typografie gesetzt war, nicht als Knopfkasten ([lektionen.md](lektionen.md)). Eine Tangente (Titel berührt die Bildkante knapp) wirkt dagegen ungenau.

## 3. Typische Fehler

**Billig:** Zeilen über 120 Zeichen; drei und mehr Schriften (Script plus Grotesk plus Serif); zentrierter Fliesstext; Versaltitel ohne Laufweite oder über zwei Zeilen; Fett plus kursiv plus unterstrichen; gerade Anführungszeichen oder „deutsche“ auf einer Schweizer Seite; Hellgrau auf Weiss unter 4,5:1; Blocksatz mit Löchern.

**KI oder Baukasten:** dieselbe Standardgrotesk ohne Grund (Inter, Poppins, Montserrat, Roboto); Skala aus Framework-Werten (16/20/24/32/48); jede Sektion mit Versal-Kicker, Titel, grauem Zweizeiler, alles zentriert; Verlaufstext; fünf gleich wichtige Grössen; gleiche Laufweite und gleicher Zeilenabstand für 72-px-Titel und 16-px-Text.

**Modell-Standard:** Serifentitel mit kursivem Wort; Mono-Ziffern als Faktenform; dieselben wenigen Schriften wieder und wieder ([abstand.md](abstand.md)).

## 4. Wie es je Branche ausschlägt `[Annahme]`

Teil 1 gilt überall. Die Branche verschiebt Charakter, Grössenkontrast und Ton, nicht die Lesbarkeit. Die Schrift selbst kommt aus der Idee des Betriebs ([richtung.md](richtung.md)), nicht aus dieser Liste.

- **Handwerk:** robuste Grotesk oder Slab mit Herkunft (Technik, Beschilderung); grosse kurze Titel; Telefon und Masse in Tabellenziffern. Gefahr: Stencil- oder Werkstatt-Kostüm.
- **Gesundheit:** ruhige humanistische Grotesk, Text 18–20 px, Zeilenabstand 1,45–1,6, hoher Kontrast, wenig Versalien.
- **Gastronomie:** mehr Spielraum im Display (Serif mit Persönlichkeit, Schreibschrift nur als Einzelelement); Preise rechtsbündig in Tabellenziffern.
- **Recht und Finanzen:** Text-Serif oder disziplinierte Grotesk, geringer Grössenkontrast, exakte Mikrotypografie (§ mit geschütztem Leerzeichen). Fehler im Satz wirken wie Fehler in der Sache.
- **Bau und Immobilien:** Grotesk, linksbündig, Raster, grosse Zahlen (Flächen, Jahrgänge) als Element.
- **Handel:** kompakter Text, starke Preis-Hierarchie, Varianten über Gewicht statt Farbe.

## 5. Prüffragen an ein Bildschirmfoto

1. 45–90 Zeichen pro Zeile, Desktop und Handy?
2. Text ≥ 16 px, Zeilenabstand weder eng noch zerfallend?
3. Mehr als zwei Familien? (Befund)
4. Wirken die Grössen wie Stufen einer Reihe?
5. Genau ein dominantes Element?
6. Mehr als drei Überschriftenebenen? (Befund)
7. Fliesstext zentriert oder im Blocksatz mit Löchern?
8. Versalzeilen gesperrt und kürzer als eine Zeile?
9. Grosse Titel enger als der Grundtext?
10. Titel ausgewogen umbrochen, ohne Einzelwort?
11. Guillemets, Gedankenstriche, Apostrophe korrekt?
12. Grauer Text noch klar lesbar (im Code messen)?
13. Fett plus kursiv, oder Unterstreichung ohne Link?
14. Zahlen in Preisen und Tabellen bündig?
15. Hat die Schrift einen erkennbaren Grund, oder ist sie die übliche Standardgrotesk?
