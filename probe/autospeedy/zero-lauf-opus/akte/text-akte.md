# Text-Akte (text-uni)

Fakten: `eingabe/fakten.md` (unverändert übernommen, eine Faktenliste mit design-uni). Entscheide: `akte/entscheide.md`.

## T0 · Unterlagen (Schritt 1)

| Verlangt | Stand | Ergebnis |
|---|---|---|
| ≥ 30 wörtliche Kundenaussagen aus ≥ 2 Quellenarten (KW1, KW2) | 16 Texte, 2 Quellen (Google, local.ch), Rohtexte nicht geliefert | **nicht erfüllt** (Lücke des Betriebs) |
| Sortiert in 7 Fächer (KW4) | `eingabe/kundenworte-tabelle.md` | erfüllt (aus der Eingabe) |
| Suchbegriffe je Leistung und Ort aus ≥ 3 Quellenarten (Q3) | nur aus Kundenworten und Leistungsliste abgeleitet; Autovervollständigung, Trefferseiten nicht abgerufen | **nicht erfüllt** |
| Notiz zu den obersten 5 Treffern je Hauptbegriff (Q2) | nicht abgerufen | **nicht erfüllt** |
| Drei Mitbewerber | Hermann Zäch AG (Altstätten), Gschwend Garage Altstätten AG, Carrosserie Batliner GmbH (Tübach) [Q24] | erfüllt |
| Fünf echte Fragen der Kundschaft | keine Telefon- oder Mailfragen geliefert | **nicht erfüllt** |
| Jede Zahl mit Beleg | `projekt.json` → `zahlen`, Faktenabgleich maschinell 0 Fehler | erfüllt |

**T0: nicht bestanden.** Laut Skill «fragst du nach und schreibst nicht». Geschrieben wurde trotzdem, weil der Auftrag ausdrücklich verlangt, mit sichtbaren Lücken zu bauen. Folge: Suchbegriffe unten sind `[Annahme]`.

**Job-Sätze (KW8) `[Annahme]`:** Carrosserie: «Wenn mein Auto nach einem Unfall verbeult ist, will ich es ohne Ärger mit der Versicherung wieder wie neu haben.» Tesla: «Wenn Tesla mich weiterschickt, will ich ohne Suchen dort melden, wo Tesla mich hinschickt.» Lack/Felge: «Wenn ich einen Kratzer oder Randsteinschaden sehe, will ich wissen, ob es sich lohnt, und es schnell erledigen.»

## Antwort-Plan (Schritt 2, T1)

| Begriffsgruppe `[Annahme]` | Absicht | Zielseite | Kernantwort im ersten Satz | Belege | Stufe (A9) |
|---|---|---|---|---|---|
| Carrosserie Altstätten, Autolackiererei Altstätten, Spritzwerk Rheintal | lokal | `index.html` | «Die Auto Speedy AG repariert Unfall-, Hagel- und Lackschäden … an der Alten Landstrasse 63 in Altstätten.» | Q1, Q2, Q14, Q12 | 2 (Leistung mit Beleg) |
| Karosserieschaden melden, Unfallschaden Auto Reparatur Versicherung | tun | `schaden.html` | «Tippen Sie die Stelle am Auto an und geben Sie Name und Telefon an.» | Q2 (Versicherungsabwicklung) | 4 (Problem) |
| Tesla Carrosserie, Tesla Body Shop St. Gallen Rheintal, Tesla Model Y Unfall Reparatur | tun / lokal | `tesla.html` | «Hat Tesla Sie an die Auto Speedy AG verwiesen, sind Sie hier richtig.» | Kunde (E3), Q1; extern nicht belegt (Q25) | 1 (kennt den Betrieb) |
| Hagelschaden, Dellen drücken, Felgen reparieren, Auto folieren, Occasion Altstätten | wissen / tun | `leistungen.html` (Anker je Leistung) | «Carrosserie und Spritzwerk unter einem Dach, dazu Alufelgen, Folierung und Occasionen.» | Q2, Q4, Q9, Q18 | 3 |
| Auto Speedy Telefon, Öffnungszeiten, Adresse | gehen | `kontakt.html` | Telefonnummer als Star, dann Status und Zeiten | Q1, Q5, Q17 | 1 |

**T1 (Selbstauskunft, kein Werkzeug):** 0 Begriffe auf zwei Seiten; je Seite eine Hauptabsicht; keine Ortsseiten (Gebiet ist Lücke). Bestanden mit dem Vorbehalt, dass die Begriffe angenommen sind.

## Anrede (CH4)

«Sie» auf der ganzen Website, weil die bisherige Website siezt (Kundenangaben Teil 3, `[Annahme]`). Maschinell geprüft: 0 Du-Formen.

## Ziele an die Gestaltung (Schritt 9, T8 Teil 1)

| # | Ziel | Prüfung | Ergebnis |
|---|---|---|---|
| Z1 | Auf jeder Seite ist «Schaden melden» ohne Scrollen erreichbar. | pruefen.cjs «Hauptaktion fest sichtbar» 1440 und 390 | erfüllt |
| Z2 | Telefon in einem Tipp von jeder Seite. | pruefen.cjs Telefon-Links; kunde.cjs anruf-leistungen: 1 Tipp | erfüllt |
| Z3 | Die Frage «Was passiert nach der Meldung?» wird auf Start und Schaden beantwortet. | Text vorhanden (Startseite «So geht es weiter», Bestätigung) | erfüllt, Frist als Lücke |
| Z4 | Die Frage «Was kostet es?» wird beantwortet. | – | **nicht erfüllbar**: keine Preise freigegeben (E9) |
| Z5 | Tesla-Besucher sehen im ersten Bildschirm die Modelle. | Bildschirmfoto tesla-desktop.png | erfüllt am Desktop; am Handy direkt unter dem Lead (screens/tesla-mobil.png) |
| Z6 | Bewertungsschnitt mit Anzahl, Plattform, Stand und Link. | Startseite | erfüllt |
| Z7 | Alle Fakten als Text, nicht im Bild (ZS10). | Ohne-JS-Prüfung, Bilder ohne Text | erfüllt |
