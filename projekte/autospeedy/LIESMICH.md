# Auto Speedy AG · Testlauf mit design-uni

Stand 31. Oktober 2026. Vorschau einer neuen Website für die Auto Speedy AG, Altstätten SG, gebaut nach `skills/design-uni/SKILL.md`.
**Nicht veröffentlicht, nicht an den Betrieb geschickt.** Mit dem Betrieb wurde nicht gesprochen.

## Ansehen

```bash
cd projekte/autospeedy && ./werkzeug/bilder-holen.sh
```

```bash
python3 -I werkzeug/bilder-bearbeiten.py . && python3 -I werkzeug/bauen.py .
```

```bash
cd site && python3 -m http.server 8000
```

Dann http://localhost:8000 öffnen. Die Fotos gehören der Auto Speedy AG und liegen nicht im Repository.

## Die eine grosse Entscheidung

**Die Website ist die Schadenskizze.** Ein Auto von oben als Strichzeichnung auf einer Blaupause. Wer einen Schaden hat, tippt die Stelle an; sie wird rot markiert und geht mit der Meldung mit. Telefon, Anschrift mit Route und Zeiten stehen im Schriftfeld der Zeichnung. Herleitung in [richtung.md](richtung.md).

## Prüfpunkte

| Prüfpunkt | Ergebnis | Schwelle | Stand |
|---|---|---|---|
| P0 Vollständigkeit | 16 Nomen, 4 nach dem Sieben, Hauptaktion fest | 12 / 3 | bestanden, Zusagen ohne zuständige Person |
| P1 Richtung (6 blind) | Schadenskizze 8,33, Idee 6 von 6 nacherzählt | höchste Trefferquote | bestanden, Freigabe übersprungen |
| P2 Abstand zu Medaur | 8 von 8 Achsen anders, ΔE_OK Grund 0,075 | 6 von 8, 0,06 | Selbstauskunft |
| P3 Prüflisten A/P/H | siehe unten | 11 / 11 / 13 | Selbstauskunft |
| P4 Bildtest Runde 1 | 7,67 · 6 von 6 «Agentur» · Opus 7,33 / Sonnet 8,0 | 7,5 · 4 von 6 | bestanden |
| P4 Geschwister Runde 1 | 3–4 von 6 mit Medaur | höchstens 1 | **nicht bestanden** |
| P4 Bildtest Runde 2 (Blaupause) | **8,00** · 6 von 6 «Agentur» · Opus 7,67 / Sonnet 8,33 · dreimal Platz 1 | 7,5 · 4 von 6 | bestanden |
| P4 Geschwister Runde 2 | 3 von 6, alle Opus | höchstens 1 | **nicht bestanden**, siehe Lektion |
| P4 Fünf Sekunden | 3 von 3 | 3 von 3 | bestanden |
| P5 Bewegung | – | – | nicht gelaufen |
| P6 maschinell | 0 Fehler auf 9 Seiten, Lighthouse mobil 100 / 100, LCP 1,6 s | 0 · ≥ 90 | bestanden |
| P7 Kunden-Agenten | 6 von 6 erreicht · anfragen 8,33 · Vertrauen 7,5 | 6 von 6 · 8,0 · 7,0 | bestanden |
| P8 ganze Website | – | – | nicht gelaufen |

**Referenzen im Bildtest:** emi-architekten.ch, bloomen.ch, qwstion.com, fabo.ch, furrer-itx.ch, netify.ch, Falle bloqlabs.ch, dazu Medaur als frühere eigene Website. Die heutige autospeedy.ch kam nicht in den Satz (eine Fassung je Betrieb).

**P7 im Einzelnen** (letzter Lauf je Aufgabe):

| Aufgabe | Opus | Sonnet |
|---|---|---|
| Parkschaden am Samstag melden, mit Fotos | Mail offen, 8 Aktionen, 8 / 7 | Mail offen, 6 Aktionen, 8 / 7 |
| Hagel, Dienstag 16.50, sofort anrufen (Einstieg Carrosserie) | Anruf, 1 Aktion, 9 / 8 | Anruf, 1 Aktion, 9 / 7 |
| Donnerstag 07.15, Route öffnen | Route, 1 Aktion, 8 / 8 | Route, 1 Aktion, 8 / 8 |

Zahlen: «würden anfragen» / «Vertrauen». Erste Runde vor dem Umbau: Anruf und Route je 3 Aktionen; Route nur über Menü und Kontakt.

## Was die Prüfungen verändert haben
- P1 zeigte, dass zwei Bauteile von Medaur stammten (Kopfzeile «Betrieb · Branche · Ort», Fakten klein neben dem Knopf): beide ersetzt.
- P4 Geschwister Runde 1: Telefon fett im Kopf, Titel links mit Satz «Leistung in Ort», grauer Grund. Umbau zur Blaupause mit Schriftfeld; danach nannte niemand mehr diese Bauteile.
- P7: Route und Anschrift auf die Startseite, «Hagel» und Zeiten in den ersten Bildschirm der Carrosserie, Kopf der Unterseiten bleibt beim Scrollen oben, Foto-Hinweis vor das Formular, Route als Pille.

## Lektion für den Skill
Nach dem Umbau sahen 3 von 6 Bewertern (alle Opus) Medaur und Auto Speedy als dasselbe Studio, begründet mit dem, was der Skill selbst verlangt: Telefon im ersten Bildschirm, nüchterner Text mit Fakten, ein Knopf. Die Schwelle «höchstens 1 von 6» lässt sich mit dem Boden des Skills allein kaum erreichen. Eingetragen als L26 in `skills/design-uni/referenzen/lektionen.md`.

## Offen, braucht den Betrieb
- **Freigabe der Fotos** und Einverständnis der Mitarbeitenden für Namen und Bilder.
- **Vektorlogo.** Die Vorschau setzt den Namen in der Hausschrift.
- **Formular-Eingang.** Ohne Eingang öffnet sich die Mail mit allen Angaben; Fotos hängt man dort an.
- **Samstag, Notfall, Abschleppdienst, Ersatzwagen**: steht nirgends.
- **Fristen:** Offerte und Dauer der Reparatur.
- **Bewertungen** direkt bei Google prüfen (Zahl stammt von Yably).
- **Impressum:** MWST-Nummer, Handelsregisteramt. **Datenschutz:** Hosting, Aufbewahrung.

## Zusagen-Blatt (stimmt / ändern / streichen)

| Satz auf der Vorschau | Quelle |
|---|---|
| «Mit Ihrer Versicherung rechnen wir direkt ab.» | Website: «Auch die Schadensabwicklung mit der Versicherung erledigen wir für Sie.» |
| «ausschliesslich mit Original-Ersatzteilen» | Website, wörtlich |
| «Sie erhalten eine Offerte.» | Annahme, nicht belegt |
| «Wir melden uns zu unseren Öffnungszeiten, Mo–Fr.» | Annahme, nicht belegt |
| «Tesla Approved Body Shop», Partner Ayvens, Land Rover, AMAG | Logos auf der Website; Umfang offen |
| «Qualität, die man sieht und fährt.» | Bild «20 Jahre» auf der Website |
| «Aktiengesellschaft seit 2016, 10 Leute, davon 2 in Ausbildung» | Handelsregister, Teamseite |

## Nicht geprüft
Echte Geräte und Safari, `mailto:` mit langem Text auf allen Telefonen, Menschen aus der Zielgruppe, Bewegung (P5), ganze Website (P8), Recht durch eine Fachperson.
