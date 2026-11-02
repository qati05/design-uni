# Nullstart-Lauf: Ergebnis und blinder Vergleich

Stand 2. November 2026. Ein Agent baute Auto Speedy **von Null** mit den drei Skills (design-uni nach dem Patch mit Techniken, Vorbilder-Band, Galerie und Werkzeugen; text-uni; web-uni mit Astro-Vorlage).

## Aufbau des Laufs

- **Eingabe** (`eingabe/`): ausgefülltes Kundenblatt mit den Wünschen des Kunden, Fakten und Quellen aus der ersten Probe, die 16 Kundenworte als Tabelle, die drei Bewertungszitate, 22 Fotos mit neutralen Namen (`foto-01.jpg` …), das Rasterlogo.
- **Nicht gegeben:** Richtung, Idee, Seitenplan, Texte, Farben, Schriften, Tokens, Register, Blindtests, Code und Seiten der ersten Probe. Aus den Skill-Kopien waren alle Verweise auf das frühere Projekt entfernt (`web-uni/referenzen/{messungen,branchenwerte,lektionen}.md` gelöscht, Nennungen neutralisiert).
- **Arbeitsordner** ausserhalb des Repositorys; dem Agenten war verboten, ausserhalb zu lesen. Das ist **nicht technisch erzwungen**.
- **Modell** des Bauagenten: das Standardmodell der Sitzung (Sonnet 5.5). Kein Lauf mit Opus.
- **Selbstbau, nicht blind:** Der Agent konnte keine Unteragenten starten; alle blinden Prüfpunkte standen bei ihm auf «nicht gelaufen». Die blinde Bewertung unten hat der Vorsitz (diese Sitzung) nachgeholt.

## Prüfung auf Schummeln

- Suche im Ergebnis nach Eigenarten der ersten Probe (Abdeckkante, «Erst die Kante», Logo-Marine `#243145`, Big Shoulders, Public Sans, Dateinamen der ersten Bilder): **keine Treffer.**
- Textüberschneidung: von 103 Zeilen (≥ 40 Zeichen) der ersten Probe und 75 des neuen Laufs ist **eine** identisch (der Handelsregister-Zweck, ein belegtes Zitat).
- Neue Schriften (Barlow, Barlow Condensed), neue Farben, neue Richtung («Der eingekreiste Schaden»).
- **Grenzen:** (1) Die 22 Fotos wählte die erste Probe aus; ein Foto mit blauer Schadensmarkierung, das den Kreis der neuen Idee trägt, war darunter. Das ist Material, kein Entwurf, aber eine Vorauswahl. (2) Ob der Agent trotz Verbot gelesen hat, ist nicht lückenlos belegt.

## Blinder Vergleich (nur erster Bildschirm, Desktop 1440 × 900)

Nach `design-uni/referenzen/blindtest.md` 3.1 und 3.2: **12 Bewerter in zwei getrennten Sätzen** (Satz «neu», Satz «alt»), je 6 (3 Opus, 3 Sonnet, Denkstufe hoch), ohne Projektkontext, je Bewerter andere zufällige Reihenfolge. **Dieselben 5 Referenzen** in beiden Sätzen: Lucid Motors, Rimac Technology (Cookie-Dialoge entfernt), Gschwend Garage Altstätten, Hermann Zäch AG Altstätten (beide lokale Garagen), Falle (Vorlagenseite mit Platzhaltern, Countdown, «500+»-Kreis). Der Kandidat: im Satz «neu» der erste Bildschirm des Nullstart-Laufs, im Satz «alt» die zweite Fassung der ersten Probe (`../pruefung/blind/kandidat-runde2.jpg`).

| Bild | Satz «neu» Mittel | Opus | Sonnet | «Agentur» | Satz «alt» Mittel | Opus | Sonnet | «Agentur» |
|---|---|---|---|---|---|---|---|---|
| **Kandidat** | **7,33** | 7,33 | 7,33 | **5 von 6** | **6,33** | 6,33 | 6,33 | **2 von 6** |
| Lucid (premium) | 8,67 | 9,00 | 8,33 | 6 von 6 | 9,00 | 9,00 | 9,00 | 6 von 6 |
| Rimac (premium) | 6,50 | 6,67 | 6,33 | 4 von 6 | 7,00 | 7,67 | 6,33 | 5 von 6 |
| Hermann Zäch (lokale Garage) | 3,33 | 3,00 | 3,67 | 0 von 6 | 3,17 | 2,67 | 3,67 | 0 von 6 |
| Gschwend (lokale Garage) | 3,00 | 3,00 | 3,00 | 0 von 6 | 3,00 | 3,00 | 3,00 | 0 von 6 |
| Falle (Vorlage) | 1,00 | 1,00 | 1,00 | 0 von 6 | 1,00 | 1,00 | 1,00 | 0 von 6 |

Einzelnoten des Kandidaten: neu 7, 8, 7, 8, 7, 7; alt 7, 6, 6, 6, 6, 7. Rohdaten: `blind/antworten.json`, Schlüssel: `blind/schluessel-neu.json`, `blind/schluessel-alt.json`.

| Prüfpunkt P4 | Schwelle `[Annahme]` | neu | alt | Urteil neu |
|---|---|---|---|---|
| Bildtest, Mittel | ≥ 7,5 | 7,33 | 6,33 | **knapp nicht bestanden** |
| «Agentur» | ≥ 4 von 6 | 5 von 6 | 2 von 6 | **bestanden** |
| Modelle auseinander | > 1,5 wäre Befund | 0,00 | 0,00 | kein Befund |
| Falle durchschaut | ≥ 4 von 6 | 6 von 6 | 6 von 6 | bestanden |
| Satz brauchbar (Lucid und Falle stabil) | – | Lucid 8,67 gegen 9,00; Falle 1,00 | | ja |
| Geschwister-Test | ≤ 1 von 6 gleicht den Kandidaten einer fremden Seite | 0 von 6 | 0 von 6 | bestanden |

## Was das zeigt, und was nicht

- **Besser als die erste Probe:** +1,0 Punkte bei gleichen Referenzen, über dem Rauschen von ±0,5, und von 2 auf 5 von 6 bei «Agentur». Rimac schwankt um 0,5 zwischen den Sätzen, Lucid um 0,33; der Abstand des Kandidaten ist grösser.
- **Was die Bewerter loben (neu):** «mutige, enge Grotesk», **eine durchgehende Idee** (handgezogener Kreis um «Schaden» kehrt im Foto als eingekreister Felgenschaden wieder), klare Hierarchie, konkrete Fakten (Telefon, Öffnungszeit, Bewertung). Tadel: Logo klein, doppelt umrandete Knöpfe, leere untere Fläche.
- **Was die Bewerter an der alten Fassung nannten:** Gebrauchsseite mit Haltung, aber «winziges Logo», das Hero ist eine Faktenbox statt Bild.
- **Warum es besser wurde, ist nicht belegt.** Mögliche Gründe: die Techniken (eine tragende Idee), das Vorbilder-Band, ein anderes Foto im Hero, schlicht ein zweiter Versuch mit der Erfahrung aus dem ersten Foto-Material. Ein Lauf kann das nicht trennen.
- **Nicht gemessen:** Handy, ganze Website (P8), Bewegung (P5), Kunden-Agenten (P7), Menschen. Alle Bewerter sind Sprachmodelle; Urteile zu «gefällt» und «würde anfragen» sind nicht belegt.
- **Der Lauf hat auch Mängel:** Zitate ohne Einwilligung der Verfasser, `T0` und `T8` nicht bestanden, Tesla-Partnerschaft nicht belegt, Seitengrund unter der ΔE-Schwelle, 8 statt 12 Seiten (siehe `LIESMICH.md`).
- **Ein Lauf, ein Modell, keine Wiederholung.** Mit Opus oder einem zweiten Lauf könnte das Ergebnis abweichen.

## Mängelliste der Skills

Der Bauagent hat 29 unklare oder widersprüchliche Stellen in den Skills gemeldet: `prozess.md`. Sie sind teils echt (zum Beispiel ΔE-Schwelle bei hellen Gründen, `stroke-dashoffset` gegen «nur transform», Formular mit Server gegen Auftraggeber-Entscheid, `robots.txt` gegen `noindex`), teils Folge der Kopie (gelöschte Referenzen).
