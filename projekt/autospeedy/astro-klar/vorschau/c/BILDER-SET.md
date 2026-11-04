# Bilder-Set · Autospeedy C (einheitlich bis zum Shooting)

Designer, 04.11.2026. Das ist nur ein Plan. Boti sucht die Fotos, Claude baut sie ein, und ich prüfe danach die Screenshots. Die Nummern S.. verweisen auf `SHOOTING-LISTE.md`; die Shooting-Fotos ersetzen später jeweils den gleichen Platz.

## Zuerst ein Hinweis (bitte Reshat zeigen)
- Viele Bilder auf `/leistungen/`, `/team/`, `/kontakt/` und `/flotten/` sind **echte Fotos des Betriebs**, übernommen von autospeedy.ch (siehe `rechte.md`). Echte Fotos schlagen Stock beim Vertrauen.
- Darum gilt für einige Bildplätze **«Echt behalten, aber im Set-Look nachbearbeiten»** statt Stock:
  - Die **Fassade** darf nie Stock sein. Ein fremdes Gebäude auf der Kontaktseite wäre irreführend.
  - Das **Team** darf nie Stock sein, keine fremden Menschen als «unser Team».
  - **Felgen vorher/nachher** und die **Folierungen** zeigen echte Arbeit des Betriebs. Ein Stock-Paar mit gleichem Blickwinkel gibt es kaum, und es würde fremde Arbeit als eigene zeigen.
- Alles andere wird Stock im gleichen Look.
- Falls Reshat trotzdem 100 % Stock will: Fassade, Team und Vorher/Nachher bleiben als Platzhalter-Kasten («Foto folgt vom Shooting») statt Stock.

## Look-Regeln für das ganze Set (für Stock **und** für echte Fotos)
| Regel | Vorgabe |
|---|---|
| Palette 60-30-10 | 60 % helles Grau/Weiss (`#f4f4f2`, Halle, Kabine, Licht), 30 % Graphit/Schwarz (`#1d1e20`, Lack, Reifen, Schatten), 10 % Blau (`#1566b8`, nur als kleiner Akzent: Abklebeband, Licht, Werkzeuggriff). Das Bild ist nie bunter als die Seite. |
| Farbtemperatur | Neutral bis leicht kühl, etwa 5000–5500 K. Kein gelbes Kunstlicht, kein Orange-Stich. In allen Bildern gleich. |
| Lichtrichtung | Das Hauptlicht kommt **von oben links** (Hallenlicht, Fenster). Bei Detailbildern zeigt Streiflicht den Glanz. Ist das Licht rechts, wird das Bild gespiegelt, aber nur wenn keine Schrift im Bild ist. |
| Entsättigung | Sättigung −20 bis −30 %. Blau ist minus 10 %, damit der Akzent zur Seite passt. Rot, Gelb und Orange sind minus 40 % (Schlusslichter dürfen bleiben, sind aber gedämpft). |
| Tonwerte | Lichter leicht weich (−10), Schatten leicht offen (+10), Schwarz nicht abgesoffen. Wenig Klarheit, keine HDR-Optik. Leichtes Korn ist ok. |
| Kein Grün | Keine Pflanzen, Rasen, grünen Planen oder grünen Wände. Ist es nicht vermeidbar, wird Grün im Bild auf Grau entsättigt. |
| Keine Gesichter | Nur Hände, Rücken, Personen mit Maske oder in der Unschärfe. Auch Spiegelungen prüfen. Ausnahme: Team-Seite und Inhaber, aber nur mit echten Fotos des Betriebs. |
| Keine lächelnden Stockmenschen | Stock nur ohne posierende Personen. |
| Marken | Keine grossen Markenlogos im Bild (BMW-Niere, VW, Ferrari usw.). **Einzige Ausnahme ist Tesla auf der Tesla-Seite**, und auch dort nur dezent. |
| Nummernschilder | Nicht lesbar: unscharf, abgeschnitten oder retuschiert. Vor dem Einbau bei 200 % Zoom prüfen. |
| Motiv | Echte Werkstattarbeit oder echtes Werkstattlicht. Keine Showroom-Glanzautos, kein Rennsport, keine Supersportwagen (passt nicht zur Betriebsgrösse). |
| Ordnung | Ein ruhiger Hintergrund, keine Unordnung. Kein Text im Bild ausser dem echten Firmenschild. |
| Lizenz | Nur Unsplash- oder Pexels-Lizenz. Fotograf und URL jedes Bilds in `CREDITS.md` eintragen. Nach `Bildnachweise` auf der Seite übernehmen. |
| Technik | Master mindestens in der Pixelgrösse unten. Daraus AVIF und WebP in den Breiten 480/800/960/1440/1920, wo nötig. Das Hero-Bild bekommt `fetchpriority=high`, alle anderen laden lazy. |

**Test für das ganze Set:** Alle Bilder als Kontaktbogen nebeneinander legen. Sie müssen wie **ein** Shooting aussehen. Fällt ein Bild durch Farbe, Licht oder Stimmung auf, fliegt es raus.

## Bildplätze

### Startseite `/`
| Platz | Datei / Komponente | Format, Pixel (Desktop / Handy) | Bildidee | Suchbegriffe (Unsplash, Pexels) | Quelle |
|---|---|---|---|---|---|
| Hero | `Hero.astro` · `stock/b1-hero` | 4:5 hoch, Master 1440×1800. Dargestellt 856×1070 am Desktop, am Handy volle Breite | Eine behandschuhte Hand poliert dunklen Lack, ein Lichtband spiegelt sich (S01). | `car polishing machine black paint`, `detailing polisher close up`, `hand polishing car paint reflection`, `paint correction dark car` | Stock (das heutige Pexels-Bild ist ok, falls es nach dem Look-Check durchkommt) |
| Karte 1 Unfall und Carrosserie | `Leistungen.astro` → `unfall` | 3:2, Master 1600×1067. Dargestellt etwa 380×253 am Desktop, am Handy volle Breite | Hände richten ein Blechteil, oder eine Front ist abgebaut, in einer hellen Halle (S03). | `auto body repair hands`, `car bodywork dent repair workshop`, `collision repair car body shop`, `car bumper removed workshop` | Stock |
| Karte 2 Hagel und Dellen | → `hagel` | 3:2, 1600×1067 | Ausbeulwerkzeug am Blech, Reflexlinien sichtbar (S04). | `paintless dent repair`, `dent removal tool car`, `hail damage car repair`, `PDR light board` | Stock |
| Karte 3 Lack | → `lack` | 3:2, 1600×1067 | Lackierer von hinten oder mit Maske in einer weissen Kabine, Sprühnebel (S05). | `car spray painting booth`, `automotive painter spray gun white booth`, `car paint booth mask` | Stock (das heutige Bild mit grünem Grund **ersetzen**) |
| Karte 4 Felgen | → `felgen` | 3:2, 1600×1067 | Eine einzelne Alufelge in Arbeit auf der Werkbank, Schleifen oder Polieren (S06). | `alloy wheel repair`, `rim refurbishment workshop`, `wheel polishing hands`, `alloy wheel sanding` | Stock (das heutige Bild mit dem Regal **ersetzen**). Alternative: das echte `felge-fertig`, gradiert |
| Karte 5 Folierung | → `folierung` | 3:2, 1600×1067 | Hände mit Rakel ziehen Folie über eine Kante (S07). | `car wrap squeegee`, `vinyl wrap installation hands`, `car wrapping heat gun`, `ppf installation` | Stock (das heutige BMW-Bild **ersetzen**, das Logo ist zu gross). Alternative: das echte `defender-folie`, gradiert |
| Karte 6 Scheiben | → `scheiben` | 3:2, 1600×1067 | Steinschlag in der Frontscheibe in Nahaufnahme, oder eine Scheibe mit Saughebern (S08). | `windshield chip repair`, `windscreen replacement suction cups`, `cracked windshield close up` | Stock (das heutige ist ok, falls es den Look-Check besteht) |
| Tesla-Teil | `TeslaTeil.astro` · `stock/b7-tesla` | 3:2 quer, Master 1920×1280. Am Handy 4:5, 1080×1350 | Dunkler Tesla, Scheinwerfer-Detail oder 3/4-Ansicht, Werkstattlicht (S16). | `tesla model 3 headlight`, `tesla model y workshop`, `black tesla garage` | Stock (heute Unsplash Philipp Mandler, ok) |
| Inhaber und Team | `Inhaber.astro` | 4:5 und 3:1 | – | – | **Kein Stock.** Platzhalter bleibt bis zum Shooting (S23/S24) |

### Tesla-Seite `/tesla/`
| Platz | Datei / Komponente | Format, Pixel | Bildidee | Suchbegriffe | Quelle |
|---|---|---|---|---|---|
| Tesla-Hero (neu, ersetzt Raster und Glow) | `tesla.astro`, gerahmtes Foto im Hero | 3:2, 1920×1280. Am Handy 4:5, 1080×1350 | Ein Tesla in heller Halle oder auf der Hebebühne, ruhig, das Tesla-Logo darf dezent sichtbar sein (S16). | `tesla service center`, `tesla on car lift`, `tesla model 3 repair workshop`, `tesla model y front garage` | Stock, nicht dasselbe Bild wie im Tesla-Teil der Startseite |
| Original-Teile (optional) | Abschnitt Ablauf | 1:1, 1200×1200 | Ein Ersatzteil oder eine Kiste, Hände (S17). | `car parts box workshop`, `oem car part hands` | Stock, nur ohne Fremdmarke |

### Leistungen `/leistungen/`
| Platz | Heute | Format, Pixel | Bildidee | Suchbegriffe | Quelle |
|---|---|---|---|---|---|
| Kopfbild | `hebebuehne` (echt) | 3:2, Master 2400×1600 | Auto auf der Hebebühne in heller Halle (S02). | – | **Echt behalten**, gradieren (sehr gut, hell und ruhig) |
| Carrosserie, Unfall | `abgeklebt` (echt, roter Transporter) | 4:3 wie heute, 1600×1200 | Front abgebaut oder abgeklebt (S03). | `car front end removed repair`, `body shop masking car` | Stock. Das Rot dominiert zu stark, darum wäre gradiertes Echt nur die zweite Wahl |
| Carrosserie, zweites Bild | `transporter` (echt, rot-weiss) | 4:3, 1600×1200 | Nutzfahrzeug in Arbeit (S21). | `van repair workshop`, `commercial van body shop` | Stock, oder echt mit Rot −40 % |
| Hagel und Dellen | `dellen` (echt, Person mit Mütze im Profil) | 4:3, 1600×1200 | Ausbeulen (S04). | wie Karte 2, anderes Bild | Stock, **weil das Gesicht halb erkennbar ist** |
| Lackiererei 1 | `lackierkabine` (echt, hoch) | 3:4 hoch, 1200×1600 | Lackierer in der Kabine, blau abgeklebt (S05). | – | **Echt behalten** (blau passt zur Palette), gradieren |
| Lackiererei 2 | `ferrari-streifen` (echt, Ferrari gelb-schwarz) | 16:9, 1600×900 | Auto frontal in der Kabine unter Lichtbändern (S13). | `car in paint booth lights symmetrical`, `paint booth car front` | Stock (Supersportwagen und Gelb passen nicht zum Set) |
| Felgen vorher / nachher | `felge-schaden`, `felge-fertig` (echt) | 4:3, 1600×1200, beide exakt gleich zugeschnitten | Gleiche Felge vorher und nachher (S09/S10). | – | **Echt behalten**. Stock ist hier nicht sinnvoll. Beide gleich gradieren |
| Felgen-Galerie | `felge-gold`, `felge-pink` (echt) | 3:4, 1200×1600 | Besondere fertige Felgen (S11). | – | Echt behalten, Sättigung nur −15 % (die Farbe ist hier die Leistung). Kommt dem Set nicht nach, dann raus und nur vorher/nachher zeigen |
| Folierung | `defender-folie`, `defender-seite` (echt, grau) | 4:3, 1600×1200 | Fertig folierter Defender (S12). | – | **Echt behalten**, passt schon gut zur Palette |
| Scheiben (neu) | – | 4:3, 1600×1200 | Scheibe wird eingesetzt (S08). | `windshield installation workshop` | Stock, nicht dasselbe wie Karte 6 |
| Werkstatt | `werkstatt` (echt, gelbes Gerät) | 4:3, 1600×1200 | Hallenübersicht (S15). | `clean auto body shop interior`, `bright car workshop interior` | Stock (das echte Bild ist klein mit 1024 px, unruhig und gelb) |

### Weitere Seiten
| Platz | Heute | Format, Pixel | Bildidee | Suchbegriffe | Quelle |
|---|---|---|---|---|---|
| `/kontakt/` Kopfbild | `fassade` (echt) | 4:3, 1600×1200 | Gebäude mit Schild (S19). | – | **Immer echt.** Gradieren, Himmel etwas ruhiger |
| `/occasionen/` Kopfbild | `fassade` (echt) | 4:3, 1600×1200 | Areal mit Fahrzeugen (S26). | – | Echt behalten. Nummernschilder prüfen, die Defender-Front ist im Bild |
| `/flotten/` Kopfbild | `transporter` (echt) | 3:2, 2400×1600 | Firmenfahrzeuge oder Transporter in der Halle (S21). | `fleet vans workshop`, `white van garage service` | Stock (weisser Van, ohne Logo) |
| `/team/` Kopfbild | `team-kabine` (echt, Gesicht) | 4:3 | Mitarbeiter in der Kabine. | – | **Echt behalten** (Team-Bereich, Gesicht erlaubt, Einwilligung prüfen). Gradieren |
| `/schaden-melden/` Erfolg (optional) | – | 4:5, 1080×1350 | Schlüsselübergabe, nur Hände (S18). | `car key handover hands`, `handing over car keys workshop` | Stock, ohne Gesicht |
| OG-Bild | `stock/og-start.jpg` | 1200×630 | Ausschnitt aus dem Hero oder der Fassade, mit Logo, ohne viel Text. | – | Aus dem Set-Hero schneiden (nicht extra suchen) |

## Auftrag an Boti (Suche) · kurz
1. Pro Stock-Platz **3 Kandidaten** suchen, mit URL, Fotograf und Lizenz.
2. Kandidaten aussortieren, die Gesichter zeigen, ein lesbares Schild, ein grosses Markenlogo (ausser Tesla auf `/tesla/`), Grün oder Supersportwagen.
3. Einen **Kontaktbogen** aller Kandidaten machen, roh und gradiert. Dabei die echten Fotos, die bleiben, mit hineinnehmen.
4. Ich wähle aus dem Kontaktbogen, erst dann baut Claude ein.
5. Das Graden geschieht beim Build (sharp: Sättigung, Weissabgleich), nicht per CSS-Filter, damit das Bild selbst stimmt.
