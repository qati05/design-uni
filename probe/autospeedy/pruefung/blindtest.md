# Blinder Test (P4 Bildtest, Geschwister-Frage, Fünf-Sekunden-Test)

Stand 1. November 2026. Aufbau nach [blindtest.md](../../../skills/design-uni/referenzen/blindtest.md) Teil 1 und 3.1/3.2/3.6. **Alle Bewerter sind Sprachmodelle**, keine Menschen.

## Aufbau

- **12 Bewerter in zwei getrennten Sätzen** (Runde 1 und Runde 2), je 6: 3 × Opus, 3 × Sonnet, Denkstufe hoch. Unteragenten ohne Projektkontext, ohne Code, ohne Skill; sie bekamen nur den Auftragstext 3.1 mit Geschwister-Frage 3.2 und den Ordner mit 6 Bildern.
- **6 Bilder je Satz**, 1440 × 900, zufällig nummeriert, **je Bewerter andere Reihenfolge**. Lösungsschlüssel nur beim Vorsitz ([blind/schluessel-runde1.json](blind/schluessel-runde1.json), [runde2](blind/schluessel-runde2.json)); die Bewerter hatten ihn nicht im Ordner.
- **1 Kandidat, 4 fremde Referenzen, 1 Falle:**
  - premium: Lucid Motors (lucidmotors.com), Rimac Technology (rimac-technology.com), beide mit entferntem Cookie-Dialog;
  - solide bis schwach: die **bisherige Website des Betriebs** (Wix, autospeedy.ch), Gschwend Garage Altstätten AG (Händlerseite);
  - **Falle:** selbst gebaute Vorlagenseite mit Countdown, «Herzlich willkommen», gelbem «500+»-Kreis, leeren Icon-Kreisen und Platzhaltern. Sie prüft, ob nach Bild oder nach Ruf geurteilt wird.
- **Runde 1:** Kandidat mit Marine-Kopf, Faktenzeile und Hero mit Querbild darunter ([blind/kandidat-runde1.jpg](blind/kandidat-runde1.jpg)).
- **Runde 2:** nach den Befunden aus Runde 1 überarbeitet: grösseres Logo, ruhigerer Kopf (nur Tesla und «Schaden melden» als Knöpfe, Telefon als schlichter Link), Hero mit Faktenkarte rechts statt leerer Fläche, ein Knopf im Hero ([blind/kandidat-runde2.jpg](blind/kandidat-runde2.jpg)).
- Fremde Referenzbilder liegen **nicht** im Repository. Notenrohdaten: [blind/antworten-runde1.json](blind/antworten-runde1.json), [runde2](blind/antworten-runde2.json).

## Ergebnis P4 Bildtest

| Bild | Runde 1 Mittel | Opus | Sonnet | «Agentur» | Runde 2 Mittel | Opus | Sonnet | «Agentur» |
|---|---|---|---|---|---|---|---|---|
| **Kandidat (Auto Speedy neu)** | **6,33** | 6,33 | 6,33 | **1 von 6** | **6,50** | 6,33 | 6,67 | **2 von 6** |
| Lucid (premium) | 8,83 | 9,00 | 8,67 | 6 von 6 | 9,00 | 9,00 | 9,00 | 6 von 6 |
| Rimac (premium) | 8,00 | 8,00 | 8,00 | 6 von 6 | 7,67 | 8,00 | 7,33 | 5 von 6 |
| Gschwend Garage (Händler) | 3,67 | 3,33 | 4,00 | 0 von 6 | 3,17 | 3,33 | 3,00 | 0 von 6 |
| Bisherige Website des Betriebs | 3,00 | 3,00 | 3,00 | 0 von 6 | 2,33 | 2,33 | 2,33 | 0 von 6 |
| Falle (Vorlage) | 1,83 | 2,00 | 1,67 | 0 von 6 | 1,33 | 1,33 | 1,33 | 0 von 6 |

| Prüfpunkt | Schwelle `[Annahme]` | Runde 1 | Runde 2 | Urteil |
|---|---|---|---|---|
| P4 Bildtest: Mittel | ≥ 7,5 | 6,33 | 6,50 | **nicht bestanden** |
| P4 Bildtest: «Agentur» | ≥ 4 von 6 | 1 von 6 | 2 von 6 | **nicht bestanden** |
| Modelle auseinander | > 1,5 wäre Befund | 0,00 | 0,34 | kein Befund |
| Referenzen stabil (Lucid, Rimac) | 7,3 bis 8,3 | 8,83 / 8,00 | 9,00 / 7,67 | im Rahmen, der Satz ist brauchbar |
| Falle durchschaut | mindestens 4 von 6 | 6 von 6 | 6 von 6 | **bestanden** (Vorlage oder niedrigste Note) |
| Kandidat unter den Top 3 | – | 6 von 6 | 6 von 6 | |

**Streuung:** Der Unterschied von 0,17 Punkten zwischen Runde 1 und Runde 2 liegt unter ±0,5, ist also **Rauschen**, kein Fortschritt. Die Überarbeitung hat die Note nicht angehoben.

**Einordnung nach dem Skill:** Preisgekrönte Konzernseiten lagen in den Tests bei 7,75, solide KMU-Seiten bei 5,38, Fallen bei 4,75. Der Kandidat liegt mit 6,3 bis 6,5 **über** den solide bewerteten KMU-Seiten und **weit über** der bisherigen Website und der Händlerseite, aber **unter** den Konzernseiten. Das passt zur Decke von «etwa 6 bis 7 von 10» bei Handyfotos und Rasterlogo (design-uni Schritt 1.5).

## Was die Bewerter nennen (Begründungen ausgezählt)

Je Bewerter wurde der Kandidat begründet; je Runde 6 Begründungen, zusammen 12.

| Nennung | Gestaltung oder Material | Runde 1 | Runde 2 |
|---|---|---|---|
| **Logo winzig** | Material | 5 von 6 | 3 von 6 |
| **Hero-Foto angeschnitten, schwach oder rechte Hälfte leer** | Material (Foto), Gestaltung (leere Fläche) | 4 von 6 | 3 von 6 (leere Fläche behoben; Foto angeschnitten oder schwach bleibt) |
| **Navigation überladen, drei Knopfstile** | Gestaltung | 4 von 6 | 2 von 6 (davon einer: «Tesla»-Rahmen wirkt fremd) |
| **CTAs doppeln sich in Kopf und Hero** | Gestaltung (E7-Entscheid) | 1 von 6 | 0 von 6 |
| Infokarte «schwer, tabellarisch, dicht» | Gestaltung | – | 2 von 6 |
| **Lob:** kondensierte Headline, klare Hierarchie, nützliche Fakten | Gestaltung | 6 von 6 | 6 von 6 |

**Gestaltung und Material getrennt gezählt:** In beiden Runden überwiegt das **Material** (Logo als Rastergrafik, Handyfoto als Hero). Die Gestaltungskritik der ersten Runde (leere Fläche, doppelte CTAs) ist behoben und hat die Note nicht bewegt. Nach dem Skill gilt dann: **dem Auftraggeber melden, statt weiter an der Gestaltung zu drehen** (design-uni Schritt 6).

## Geschwister-Frage («Gleiches Studio»)

- **Kein Bewerter ordnet den Kandidaten einer fremden Seite als gleiche Gestaltungssprache zu.** Die Bewerter erkennen die **bisherige Website** am Logo als denselben Betrieb («alter und neuer Auftritt»), aber ausdrücklich nicht als dasselbe Studio.
- **Zwei schwache Verknüpfungen:** In Runde 1 sah ein Bewerter beim Kandidaten und der Falle ein ähnliches Grundgerüst (dunkles Navy, Telefonnummer, kantige Knöpfe) und schrieb «eher schwach, 03 ist deutlich sorgfältiger». In Runde 2 nannte ein Bewerter «lose Ähnlichkeit (Navy-Palette, 071-Nummern, sachliche Blockstruktur) mit der Falle, reicht nicht für dasselbe Studio». Das sind 2 von 12, beide als «nicht dasselbe Studio» gewertet.
- **Schwelle** höchstens 1 von 6 gegen die eigenen früheren Seiten: **nicht anwendbar**, weil es keine früheren Seiten dieses Studios gibt. Die Aussage beschränkt sich auf: Der Kandidat wird in keiner Runde mit einer Referenz gleichgesetzt.
- Der Hinweis **«Marine mit Telefonnummer und Kanten wirkt wie ein Generator-Grundgerüst»** ist ernst zu nehmen: Er trifft auf die Kombination dunkles Blau, kantige Knöpfe und Schweizer Telefonnummer, die auch Baukasten-Seiten zeigen.

## Fünf-Sekunden-Test (3 Bewerter, 2 × Sonnet, 1 × Opus)

Das Bild (erster Bildschirm der Runde-1-Fassung) wurde einmal angesehen, danach aus dem Gedächtnis beantwortet.

| Bewerter | Angebot | Ort | Nächster Schritt | Richtig? |
|---|---|---|---|---|
| 1 (Sonnet) | Carrosserie und Lackiererei, auch Felgen, Folierung, Occasionen, Tesla | Altstätten, Alte Landstrasse 63 | «Schaden melden» tippen oder 071 755 88 61 anrufen | ja |
| 2 (Opus) | Autowerkstatt mit Carrosserie, Lackiererei, Felgen, Folierung | Altstätten | «Schaden melden» oder anrufen | ja |
| 3 (Sonnet) | Carrosserie und Lackiererei, auch Felgen und Folierung | Altstätten | «Schaden melden» oder anrufen | ja |

**3 von 3 richtig gegen den Lösungsschlüssel** (Schwelle 3 von 3): **bestanden**. Zusatz: Ein Bewerter fand die Überschrift allein wenig aussagekräftig («erst der Text darunter macht es klar»); ein anderer konnte den Firmennamen wegen des kleinen Logos nicht lesen und behielt nur «Altstätten». Das deckt sich mit der Kritik am Logo.

## Grenzen

- **Sprachmodelle als Bewerter.** Das [Modell-Urteil](../../../skills/text-uni/referenzen/abgleich-menschen.md) gilt bei «grobe Qualität» als eher glaubwürdig, bei «würde anfragen» nicht. Die Noten sind darum Hinweise, kein Beleg für Kundenverhalten.
- **Referenzen aus anderen Branchen** (Lucid, Rimac) heben die Skala; die Händlerseite und die Wix-Seite sind realistische Gegenstücke aus der Region.
- **Nur erster Bildschirm, nur Desktop.** P5 (Bewegung), P8 (ganze Website) und das Handy sind **nicht getestet**; die Handy-Ansicht ging nur in den Fünf-Sekunden-Test ein (als Datei, nicht als Aufgabe).
- **Fassungen in getrennten Sätzen** (Regel des Skills): eingehalten, die Referenzen blieben stabil.
- **Der Vorsitz (ich) hat die Runde 2 gestaltet, nachdem er die Kritik aus Runde 1 kannte.** Deshalb ist Runde 2 keine unabhängige Wiederholung, sondern Test der Änderung.
- Der Kandidat hatte **keine** Musterwerte und keine Platzhalter; echte Nummer und Anschrift stützen das Vertrauen (vermutlich leicht).

## Schluss nach dem Skill

«Fällt P4 zweimal durch, geht es zurück zu P1: Dann war die Idee falsch und nicht die Ausführung» (design-uni SKILL.md). **Das trifft hier nur eingeschränkt zu:**

1. Die Bewerter loben die **Idee und Typografie** («Haltung», «eigenständig», «Hierarchie») in 12 von 12 Antworten und stören sich überwiegend an **Material**: Logo als Rasterbild, Handyfoto als Hero.
2. Die Seite steht in 12 von 12 Antworten **unter den ersten drei** und klar über allen Referenzen aus der Region.
3. Deshalb empfehle ich **nicht**, die Idee zu wechseln, sondern **das Material zu liefern**: das **Logo als Vektordatei** und einen **Fototag** (Hallendurchblick, Hände am Werkstück, Makro; `branchen/handwerk-auto-bau.md` Teil 4), danach P4 wiederholen.
4. Offen bleibt, ob die Idee auch mit gutem Material 7,5 erreicht. Das weiss man erst nach dem Fototag.
