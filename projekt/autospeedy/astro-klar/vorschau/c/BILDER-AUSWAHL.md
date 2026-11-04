# Bilder-Auswahl · Autospeedy C

Designer, 04.11.2026. Ausgewählt aus dem Kontaktbogen `/workspace/vorschau-tools/bilder-set/`. Die Regeln stehen in `BILDER-SET.md`, dazu neu: **das untere Drittel bleibt ruhig** (Glas-Etikett).

**Hinweis Farbstimmung:** Reshat wählt gerade zwischen 3 Farbstimmungen (A Navy, B Petrol, C Chrom und Schwarz). Die Auswahl hier gilt für alle drei. Nur die letzte Feinabstimmung der Farbe passt sich an: bei B etwas Petrol in die Schatten, bei A und C neutral-kühl wie heute. Bitte erst nach Reshats Wahl final graden.

Flip-Regel: Nur spiegeln, wenn kein Text und kein Logo im Bild ist. Ein «prüfen» heisst: Boti schaut bei 100 % hin, wo das Hauptlicht herkommt, und spiegelt, falls es von rechts kommt.

## Startseite
| Platz | Wahl | Flip | Feintuning | Warum |
|---|---|---|---|---|
| Hero 4:5 | **S-hero-b** | prüfen | Blau −10 %, Lichter −10 | Behandschuhte Hand an dunkelblauem Lack, ruhig, das Blau passt zur Palette. a ist zu dunkel, c hat ein gelbes Pad. |
| Karte Unfall | **S-unfall-a** | nein | Sättigung −25 %, Schatten +10 | Front offen in der Werkstatt, unten ein ruhiger dunkler Boden. d fällt weg, weil das Nummernschild lesbar ist. |
| Karte Hagel | **S-hagel-a** | prüfen | Gelb/Gold −45 %, Wärme −300 K | Hand mit Werkzeug an Lack, Arbeit sichtbar. b wirkt wie ein Totalschaden, c wie Regen. |
| Karte Lack | **S-lack-b** | nein | Wärme −400 K (der Boden ist zu beige), Sättigung −20 % | Lackierpistole über grauer Haube, keine Person, ruhig. a und c zeigen Gesichter mit Maske, c ist stark türkis. |
| Karte Felgen | **S-felgen-a** | nein | Sättigung −15 % | Felge in der Maschine, hell und kühl. Zeigt Reparatur, nicht Lager. |
| Karte Folierung | **S-folierung-a** | nein | Cyan/Türkis −40 %, Blau −10 % | Rakel und Folie in Arbeit, ohne Logo. b sieht aus wie Wachsen. Fallback ist das echte `defender-folie`. |
| Karte Scheiben | **S-scheiben-b** | nein | Sättigung −20 % | Steinschlag in Nahaufnahme, grau-blau, unten ruhig. a ist verschneit und unruhig, d zeigt eine Seitenscheibe. |
| Tesla-Teil | **S-teslateil-h** (heutiges Bild) | nein (Logo und Licht stimmen) | Rechten Rand so beschneiden, dass die grünen Bäume weg sind. Grün auf −100 % falls Reste. | Der Model-S-Scheinwerfer ist eindeutig ein Tesla, a ist neutral, c hat ein Fremdschild. |
| Inhaber und Team | Platzhalter | – | – | Shooting S23/S24 |

## Tesla-Seite
| Platz | Wahl | Flip | Feintuning | Warum |
|---|---|---|---|---|
| Tesla-Hero 3:2 | **T-hero-b** | nein (symmetrisch) | Schatten +10, Lichter −10 | Model 3 frontal in dunkler Halle, ruhig, passt zur Werkstatt. Nummernschild bei 200 % prüfen, falls lesbar, unscharf machen. Nicht dasselbe Bild wie der Tesla-Teil der Startseite. |
| Original-Teile (optional) | **T-teile-a** | prüfen | Sättigung −20 % | Ein Teil im Fokus, kein Gesicht. b und c zeigen Gesichter. |

## Leistungen
| Platz | Wahl | Flip | Feintuning | Warum |
|---|---|---|---|---|
| Kopfbild | **E-hebebuehne** (echt) | nein | wie im Set | Echt, hell, ruhig |
| Carrosserie, Unfall | **L-unfall-b** | prüfen | Sättigung −25 % | Auto auf der Hebebühne, Motorraum. a ist schwarz-weiss und bricht das Set. |
| Carrosserie, zweites Bild | **echtes `transporter`** | nein | Rot −45 %, Sättigung −20 % | Beide Stock-Bilder sind schwach (a ist eine Baustelle, b schwarz-weiss). Echte Arbeit am Nutzfahrzeug schlägt beides. |
| Hagel und Dellen | **L-dellen-b** | prüfen | Sättigung −15 % | Delle im grauen Kotflügel, klar lesbar, ruhig |
| Lackiererei 1 | **E-lackierkabine** (echt) | nein | Blau −10 % | Echt, das Blau passt |
| Lackiererei 2 | **L-kabine-a** | nein (symmetrisch) | Gelb −40 % (die Abdeckung) | Lackierkabine frontal mit Lichtbändern, ersetzt den Ferrari |
| Felgen vorher/nachher | **E-felge-vorher / E-felge-nachher** (echt) | nein | Beide identisch graden | Echte Arbeit des Betriebs |
| Felgen-Galerie | **E-felge-gold / E-felge-pink** (echt) | nein | Sättigung nur −15 %. Breite höchstens 480 CSS-px (nur 960 px vorhanden) | Die Farbe ist hier die Leistung |
| Folierung | **E-defender-folie / E-defender-seite** (echt) | nein | wie im Set | Passt schon |
| Scheiben (neu) | **L-scheiben-b** | nein | Blau −10 % | Hände setzen die Scheibe ein, kein Gesicht, nicht dasselbe wie Karte 6 |
| Werkstatt | **L-werkstatt-c** | nein | Nummernschilder unscharf machen (beide lesbar), Wärme −300 K | Ruhige Halle mit Lichtbändern. a hat rote Hebebühnen, b einen Oldtimer (nicht in den Fakten). Ist die Retusche zu aufwendig: das Bild weglassen. |

## Weitere Seiten
| Platz | Wahl | Flip | Feintuning | Warum |
|---|---|---|---|---|
| `/kontakt/` und `/occasionen/` | **E-fassade** (echt) | **nie** (Schrift) | Himmel −10 % Sättigung | Immer echt. Nummernschilder auf dem Areal bei 200 % prüfen |
| `/team/` | **E-team-kabine** (echt) | **nie** | Gelb-Grün an der Tür −40 % | Echt, Einwilligung beim Betrieb bestätigen lassen |
| `/flotten/` | **W-flotten-b** | nein | Sättigung −15 % | Weisser Van vor grauer Fassade, ruhig, kein Logo. a ist dasselbe Bild wie L-transporter-a (Baustelle). |
| `/schaden-melden/` Erfolg (optional) | **W-schaden-a** | prüfen | Sättigung −20 % | Schlüssel in der Hand vor dunklem Auto, kein Gesicht |
| OG 1200×630 | **Ausschnitt aus S-hero-b** plus Logo | – | – | Kein Extra-Bild |

## Prüfliste vor dem Einbau (Boti)
- [ ] Bei T-hero-b, L-werkstatt-c und E-fassade die Nummernschilder bei 200 % prüfen.
- [ ] Die Masters sind mindestens 1600 px breit (Hero mindestens 1440×1800). Das löst die Unschärfe aus dem Review (Punkt 2).
- [ ] Alle Kartenbilder 4:5 und 3:2 beschneiden und prüfen, dass das untere Drittel ruhig bleibt.
- [ ] Credits für alle Stock-Bilder in `CREDITS.md` und unter `/bildnachweise/` eintragen.
- [ ] Danach einen Kontaktbogen der finalen Auswahl in einer Reihe machen. Ich prüfe, ob das wie ein Shooting aussieht.
