# Bilder: Herkunft, Verwendung, Rechte

**Regel des Auftrags:** nur Fotos von der Website des Betriebs oder sichtbar markierte Platzhalter. Hier gibt es **keine Platzhalter**: Jedes Bild stammt von `autospeedy.ch`. Kein Stockfoto, kein KI-Bild, keine Bilder von Dritten.

**Rechte:** Die Fotos sind Bilder des Betriebs von dessen eigener Website. Wer sie aufgenommen hat und ob der Betrieb sie für eine neue Website freigibt, ist **nicht geklärt** (L9). Die Vorschau zeigt sie auf Anweisung des Auftraggebers; vor einer Veröffentlichung bestätigt der Betrieb die Rechte.

**Aufbereitung:** `werkzeuge/bilder-aufbereiten.py`. Die Originale (bis 4,5 MB) liegen **nicht** im Repository. Das Skript lädt sie, dreht nach EXIF, **entfernt alle Metadaten** (GPS, Gerät, Zeit), skaliert und beschneidet nur das Hero-Bild (oben und unten, wegen der Seitenform). **Keine Farb-, Kontrast- oder Helligkeitsänderung:** bei einem Lackierbetrieb darf das Foto den Lack nicht verfälschen. Die Prüfsumme (SHA-256, 12 Zeichen) der Originale steht in der letzten Spalte.

Basis-URL der Originale: `https://static.wixstatic.com/media/<Medien-ID>`

| Datei in `site/bilder/` | Medien-ID | Original | Ausgabe | Verwendet auf | Alt-Text (Kurzform) |
|---|---|---|---|---|---|
| hero-kabine-defender.jpg | 23d933_1ddcc99b…mv2.jpeg | 1600×1200 | 1600×972 | Start (Hero) | Defender in der Lackierkabine |
| hebebuehne-audi.jpg | 23d933_1a41a5e7…s_4_2.jpg | 5184×3456 | 1400×933 | Carrosserie (Hero) | Personenwagen auf der Hebebühne |
| lack-kante-rot-weiss.jpg | 23d933_689a5981…mv2.jpeg | 1200×1600 | 900×1200 | Carrosserie | Karosseriekante mit Abdeckband |
| kabine-defender-seite.jpg | 23d933_4a006fdb…mv2.jpeg | 2048×1536 | 1200×900 | Lackiererei (Hero) | Defender in der Kabine |
| lackierer-kabine.jpg | 23d933_e0b932c4…s_4_2.jpg | 3024×4032 | 1200×1600 | Lackiererei | Lackierer von hinten, Fahrzeug abgedeckt |
| felge-bordstein.jpg | 23d933_0314f9cf…mv2.jpeg | 1600×1200 | 1200×900 | Felgen | Alufelge mit Bordsteinschaden |
| felge-markiert.jpg | 23d933_cda1a7e7…mv2.jpg | 1200×1600 | 900×1200 | Felgen | Schaden blau markiert |
| felge-blau-abgeklebt.jpg | 23d933_0ca3ea7d…mv2.jpeg | 1200×1600 | 900×1200 | Felgen | Felge mit blauem Band |
| felge-magenta.jpg | 23d933_e21da270…mv2.jpeg | 1512×2016 | 900×1200 | Felgen | Felge in Magenta |
| felge-gold-regal.jpg | 23d933_2fb7c9d0…mv2.jpeg | 1200×1600 | 900×1200 | Felgen | goldene Speichenfelge |
| felge-schwarz-detail.jpg | 23d933_30faf987…mv2.jpeg | 1600×1200 | 1200×900 | Felgen | schwarze Felge, polierte Kanten |
| folie-motorhaube.jpg | 23d933_69f57d95…mv2.jpeg | 1600×1200 | 1200×900 | Folierung, Tesla | Motorhaube mit schwarzer Folie |
| lieferwagen-rot-folie.jpg | 23d933_27e10184…mv2.jpeg | 2048×1536 | 1200×900 | Folierung | Lieferwagen mit roter Folie |
| lieferwagen-abgeklebt.jpg | 23d933_e7cfc673…mv2.jpeg | 1600×1200 | 1200×900 | Folierung | Lieferwagen teilweise abgeklebt |
| defender-schriftzug-matt.jpg | 23d933_c21fb1bc…mv2.jpeg | 1600×1200 | 1200×900 | Folierung | Defender-Schriftzug auf matter Fläche |
| matt-kante-blau.jpg | 23d933_ed89a13c…mv2.jpeg | 1200×1600 | 900×1200 | Folierung | matte Kante, blau gespiegelt |
| halle-areal.jpg | 23d933_2be29023…mv2.jpg | 3000×2250 | 1600×1200 | Occasionen (Hero) | Halle mit Fahrzeugen davor |
| halle-defender-schild.jpg | 23d933_6f8125b2…mv2.jpeg | 1600×1200 | 1200×900 | Betrieb (Hero) | Halle mit Schild, Defender davor |
| logo-wirbel-s.png | f05f45_73a3de09…mv2.png | 1447×879 | 600×364 | Kopf, Favicon | Auto Speedy AG |

Die vollständigen Medien-IDs und Prüfsummen stehen in `pruefung/bilder-lauf.txt` (Ausgabe des Skripts).

## Bewusst nicht verwendet

| Bild | Grund |
|---|---|
| Fotos mit erkennbaren Mitarbeitenden (Büro, Dellendrücken, Kabine, Lehrling, Geschäftsführer) | Einverständnis offen (L9); SLK B.7 |
| Logos von Tesla (TABS), Land Rover, AMAG, Ayvens | Marken Dritter; Nachweis offen (L8); SLK B.10 |
| Instagram-Symbol, Facebook-Symbol | Drittmarken, ohne Zweck |
| Jubiläumsgrafik «20 Jahre» | Jahreszahl nicht belegt (L1) |
| Handschlag-Stockfoto der Website | Stockfoto («Handschlag»), nach nie-liste.md nicht als Voreinstellung |
| Fahrzeug-Inserate von AutoScout24 | ändern sich, Rechte bei den Verkäufern |

## Qualität (L16)

Handyfotos, schwankend in Licht, Schärfe und Bildaufbau; das Logo ist ein Rastergrafik-PNG. Der Skill rechnet bei solchem Material mit einer Decke von etwa 6 bis 7 von 10 im blinden Test `[Annahme, aus Tests]`. Das gehört dem Auftraggeber gesagt und ist hier gesagt. Ein Fototag nach `branchen/handwerk-auto-bau.md` Teil 4 würde die Seite am meisten heben.
