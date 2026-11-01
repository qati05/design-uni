# Register und Abstand (P2)

design-uni Schritt 4. Gemessen am gerenderten Bild mit `getComputedStyle` und OKLCH-Umrechnung: `werkzeuge/register-messen.cjs`, Rohdaten in [pruefung/register-messung.json](pruefung/register-messung.json) (1. November 2026, Chromium, 1440 px).

**Es gibt keine früheren Websites dieses Studios in diesem Repository** (ein früherer Lauf auf `claude/epic-pascal-akk7h1` wurde nicht gelesen). Darum gilt der **Modell-Standard** ([abstand.md](../../skills/design-uni/referenzen/abstand.md) Teil 4) als «die letzten drei». Die Messung der eigenen Seite ist gemessen, der Vergleich mit dem Standard ist eine **Selbstauskunft**: Ob der Standard so aussieht, wie die Skills ihn beschreiben, habe ich nicht geprüft.

## Registerzeile

| Datum | Projekt | Status | Titelschrift (Klasse) | Grund OKLCH | Hero-Typ | Titelmuster | Aktion (Füllung/Radius) | Faktenschrift | Bildschnitt | Bewegung | Bauteile |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1. 11. 2026 | Auto Speedy AG | gebaut (Vorschau) | Big Shoulders Display 800, schmale Display-Grotesk, 0 kursive Teile | L 0,966 · C 0,006 · h 255° (`#F1F4F8`) | Titel links, Faktenkarte rechts, darunter randabfallendes Querbild mit Kante oben | zwei kurze Sätze: «Erst die Kante. Dann der Lack.» | Logo-Marine gefüllt (`#243145`), Radius 0, silberne Kante unten; Telefon als schlichter Link im Kopf | Public Sans, Tabellenziffern im Satz und in der Tabelle; Etikett | Querformat 16:7, randabfallend rechts | eine: Kante wird gelegt (420 ms, `transform`) | siehe unten |

## 8 Achsen gegen den Modell-Standard

Schwelle `[Annahme]`: mindestens 6 von 8 anders.

| Achse | Modell-Standard | Auto Speedy | anders? |
|---|---|---|---|
| 1 Titelschrift | Serif (Newsreader) mit kursivem Wort; oder Grotesk plus kursives Serifenwort | schmale Grotesk, 0 kursiv | ja |
| 2 Grundfarbe | Creme, Rost oder Terrakotta | helles Blaugrau `#F1F4F8`, Weiss, Logo-Marine | ja (Farbton), **aber ΔE 0,023** (siehe unten) |
| 3 Hero-Aufbau | zwei Felder: Text links, Bild rechts | Text links, **Faktenkarte** rechts, Querbild darunter, randabfallend | ja (Bild nicht im Feld rechts) |
| 4 Titelmuster | «[Leistung], [Leistung], *[Wort]*.» | zwei kurze Sätze | ja |
| 5 Primäraktion | gefüllter Knopf (Radius 0) plus unterstrichener Telefonlink | Marine-Block, Telefon als Link mit Symbol im Kopf und in der Karte | **teilweise gleich** (Knopf plus Telefonlink); die Füllung in Logo-Marine mit silberner Kante ist anders |
| 6 Schrift der Fakten | Versal-Zeile, Mono-Ziffern | Tabelle und Etikett, Tabellenziffern | ja |
| 7 Bildschnitt | hoch rechts | quer, randabfallend rechts | ja |
| 8 Bewegung | jeder Abschnitt gleitet von unten | eine: Strich wird gelegt | ja |

**7 von 8 anders, 1 teilweise** (Achse 5) (Selbstauskunft gegen den beschriebenen Standard).

## Creme-Sperre und Abstand zum Grund

| Prüfung | Messwert | Ergebnis |
|---|---|---|
| Creme-Zone (L 0,93 bis 0,97, C ≤ 0,035, **h 60 bis 95**) | L 0,966, C 0,006, **h 255°** | **ausserhalb:** der Farbton ist kühl, nicht warm |
| ΔE_OK Grund zu Creme (`#F5EFE6`, L 0,954 · C 0,014 · h 78°) | **0,023** | **durchgefallen** (Schwelle 0,06) |
| ΔE_OK Weiss zu Creme | 0,048 | durchgefallen |

**Ausnahme (abstand.md Teil 2: «braucht einen Beleg aus dem Betrieb und einen Entscheid des Auftraggebers»):**
- **Entscheid:** E6, der Kunde will «eine helle Seite, helle Farben» (Auftraggeber, 1. 11. 2026).
- **Beleg aus dem Betrieb:** Der Grund ist das aufgehellte Grau der grundierten Tür auf dem Foto der Lackiererei (Pipette ≈ `#B0B1B1`); die Wand der Lackierkabine ist weiss.
- **Warum nicht lösbar:** Eine helle Seite (L ≥ 0,95) liegt zu jeder hellen Referenz unter 0,06. Die Schwelle 0,06 ist `[Annahme]` und bei hellen Seiten kaum erfüllbar. Das ist ein Befund an den Skill: Die Prüfung müsste für helle Gründe an Farbton und Sättigung gehen, nicht an ΔE allein.
- **Ausgleich:** die übrigen Achsen sind anders (7 von 8) (abstand.md: «Fast-Weiss … die anderen Achsen strenger nehmen»).

## Titelschrift

Keine Familie aus der Sperrliste (Newsreader, Archivo). Es gibt keine «letzten 15 Entwürfe» zum Zählen; **nicht geprüft**.

## 7 Bauteile gegen den Modell-Standard

Schwelle `[Annahme]`: mindestens 4 von 7 sichtbar anders.

| Bauteil | Standard | Auto Speedy | anders? |
|---|---|---|---|
| Menü-Knopf | umrandet «Menü / Schliessen» | Marine-Etikett «Menü», `details` ohne Schliessen-Knopf | ja |
| Leiste unten am Handy | feste Anrufleiste unten | feste Kopfleiste **oben** mit Schadenmeldung (E7) | ja |
| Fehlerbox | rote Box «n Felder fehlen» mit Linkliste | Zeile am Feld mit Kante links, Zusammenfassung unter dem Knopf | ja |
| Auswahl-Chips | Chips mit «Pflicht» | Chips nur bei Tesla-Modellen, ohne «Pflicht», Marine bei Wahl | teilweise (Funktion gleich, Gestalt anders) |
| Datenschrift | Mono-Ziffern | Tabellenziffern der Textschrift | ja |
| Linienraster | 1-px-Linienraster | keines; die Kante ist die einzige Linie | ja |
| Ton der Mikrotexte | «Vier Angaben genügen, wir rufen zurück» | «Name und Telefon genügen. Alles andere ist freiwillig.» | **nein**, ähnlich |

**5 von 7 anders** (einer teilweise, einer gleich); Schwelle erfüllt, Selbstauskunft.

## Geschwister-Test

**Nicht gelaufen.** Er braucht sechs Bewerter als Unteragenten (P4, P8).

## Sperren, die auslaufen

Eintrag für künftige Websites des Studios: Titelschrift **Big Shoulders Display** und Grundfarbe **helles Blaugrau (h 250 bis 260, L 0,96)** sind für die nächsten drei Websites gesperrt.
