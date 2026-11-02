# Auto Speedy AG: Vorschau, Stand 02.11.2026

**Nichts ist live, nichts ist freigegeben, nichts ging an den Betrieb.** Die Vorschau liegt nur in diesem Branch.

## Ansehen
- **`vorschau/auto-speedy-vorschau.html`**: eine Datei, im Browser öffnen, alle Seiten klickbar (Bilder und Schriften eingebettet, keine Verbindung nach aussen). Das Formular sendet in dieser Datei nichts und sagt das.
- `vorschau/bildschirme/`: Bildschirmfotos jeder Seite, Desktop 1440×900 (`-d`) und Handy 390×844 (`-m`), Startseite auch ganz (`-voll`).
- Quellcode: `astro/` (Astro 7.4.1, statisch). `cd astro && npm install && npm run build`, dann `dist/` mit einem lokalen Server öffnen.

## Signatur: der Schadenplan
Das Auto von oben, Blech für Blech mit Spaltmass: Auf der Startseite tippt man die Stelle an und landet in der Schadenmeldung mit dieser Stelle; im Formular wählt man Stellen am Auto; nach dem Absenden entsteht ein Schadenrapport mit Auto und Stellen. Details: richtung.md. Formular-Backend gebaut und getestet, nicht deployt: technik.md.

## Dunkel lackiert
Die Website folgt dem Dunkelmodus des Geräts; der runde Knopf im Kopf lackiert für den Besuch um. Beim Wechsel zieht der neue Lack mit Sprühnebel-Kante über die Seite.

## Seiten
Start · Schaden melden · Tesla · Carrosserie · Lackiererei · Felgen und Folierung · Occasionen · Team · Kontakt · Impressum (Entwurf) · Datenschutz (Entwurf) · 404.
«Schaden melden» und Telefon stehen auf jeder Seite im Kopf, am Handy in einer Leiste unten (Wunsch 1). Tesla ist im Menü, auf dem ersten Bildschirm und als Weg «Tesla beschädigt»; der Tesla-Knopf wählt im Formular «Tesla» vor (Wunsch 2).

## Änderungen nach der Rückmeldung des Studios (02.11.2026)
- Logo des Betriebs oben links statt des gesetzten Namens (Datei von autospeedy.ch, freigestellt; Vektordatei fehlt weiter).
- Tesla Approved Body Shop belegt (Logo auf autospeedy.ch, Bestätigung des Studios); auf Teslas eigener Seite nicht nachgeprüft (F14).
- Ganze Vorschau statt nur erstem Bildschirm.
- Neue Bildwahl: 25 aktuelle Werkstattfotos aus den Galerien des Betriebs (Defender in der Lichtkabine als Startbild, Fassade für Anfahrt, Arbeit an Fahrzeugen pro Leistung); das alte Hallenfoto von 2017 nur noch auf der Seite Carrosserie.

## Lücken (in der Vorschau gelb markiert)
- Dauer einer Reparatur, Ersatzwagen; besondere Tesla-Leistungen.
- Texte zu Felgen und Folierung (bisher nur Bilder).
- Samstag, Feiertage, Betriebsferien, Notfall; Freitag 17.15 (Website) gegen 17.30 (Instagram).
- Einwilligung der Mitarbeitenden zu Namen und Fotos; Rechte an allen Fotos schriftlich.
- Impressum und Datenschutz: Entwürfe, Rechtsprüfung nötig; UID nur aus Verzeichnissen; Hoster offen.
- Gründungsjahr (2017 im Register gegen «20 Jahre»), Bewertungen mit Stand.

## Bewusst nicht übernommen
«Beste Preise garantiert», «jahrzehntelange Erfahrung», «Spenglermeister» (unbelegt), Muster-Preise in US-Dollar der Baukasten-Seite «Book Online», Markenlogos, Stockfotos.

## Zusagen-Blatt (stimmt / ändern / streichen)
| # | Aussage | Quelle |
|---|---|---|
| Z1 | Die Abwicklung mit Ihrer Versicherung übernehmen wir. | Betriebs-Website |
| Z2 | Reparatur nach Herstellervorgaben, ausschliesslich Original-Ersatzteile. | Betriebs-Website |
| Z3 | Tesla Approved Body Shop. | Betriebs-Website, Studio |
| Z4 | Öffnungszeiten Mo bis Fr. | Betriebs-Website |

## Prüfstand
| Prüfung | Ergebnis |
|---|---|
| Bau, Stufe Gerüst | 0 FEHLER, 12 HINWEIS (Beschreibungen je Seite fehlen), gelaufen |
| Kontrast aus der Kaskade, alle 11 Seiten, 1440 und 390 px | 0 unter Soll (eigenes Skript) |
| Tote interne Links und Bilder | 0 |
| Überlauf quer, genau ein `h1` je Seite | keiner, ja |
| Einzeldatei: Klickpfad Start → Tesla → Schaden melden mit Tesla vorgewählt, Formular-Rückmeldung | läuft (Playwright, Handy) |
| Schadenplan: Stelle antippen → Formular mit Stelle, Umschalten im Plan, leer absenden, Rapport (Desktop, Handy, Einzeldatei) | läuft |
| Ohne JavaScript: Plan als Links, Formular mit Kästchen über mailto | läuft |
| Formular-Backend `npm test` | 9 von 9 grün; nicht deployt |
| Bewegung: Reduced Motion 0 Animationen, nach 5 s nichts laufend | gemessen |
| Dunkel lackiert: Kontrast aller Seiten, Umlackieren per System und Knopf, Reduced Motion ohne Bewegung | gemessen, 0 Befunde |
| Navigation: Leistungen auf und zu (Klick daneben, Escape), Tesla-Abzeichen Desktop und Handy | läuft |
| Wörter im ersten Bildschirm | etwa 70, Richtwert 60 `[Annahme]`, Hinweis |
| `pruefen.cjs`, `slop-de.js`, Lighthouse, axe | **nicht gelaufen** |
| Blinde Bewerter, Kunden-Agenten, Menschentest, Safari, echte Geräte | **nicht gelaufen** |
| Rechtsprüfung | **nicht gelaufen** |

## Weitere Dateien
`fakten.md` · `rechte.md` · `entscheide.md` · `technik.md` · `richtung.md`
