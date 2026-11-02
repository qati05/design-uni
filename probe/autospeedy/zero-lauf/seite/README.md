# Astro-Vorlage (web-uni)

Standard-Stack von web-uni (Entscheid des Auftraggebers, 2. November 2026): **Astro, statische Ausgabe**. Diese Vorlage ist das Gerüst für einen neuen Betrieb.

## Was sie tut
- **Eine Quelle:** Name, Anschrift, Telefon, Zeiten, Hauptaktion und Menü stehen in `src/content/betrieb.json`. Kopf, Fuss, Zeitentabelle, Strukturdaten (JSON-LD) und das Skript für den Öffnungsstatus lesen daraus. Ändert sich eine Nummer oder Zeit, ändert man **eine** Stelle (Lektion W4).
- **Bausteine als Komponenten** (`src/components/`): Kopf, Fuss, Abschluss (Schluss-Handlung auf jeder Seite), Tel, Mail, Route, Hauptaktion, Zeiten, Status, Bild (Pflicht: Alt-Text, Breite, Höhe), Luecke (sichtbare Lücke statt erfundener Fakten), Bewertungen (leer = nichts), Zeile.
- **Prüfungen beim Bau:** Titel 40 bis 60 und Beschreibung 110 bis 155 Zeichen; sonst bricht der Bau ab.
- **Ausgabe:** statisches HTML, `name.html`, kein Framework-JavaScript. Gemessen am Beispiel ein früheres Projekt: gleich schnell wie handgeschriebenes HTML (`../referenzen/messungen.md`).

## Benutzen
```bash
cp -R skills/web-uni/vorlage-astro probe/<betrieb>/astro
cd probe/<betrieb>/astro && npm install && npx astro build
```
Dann: `betrieb.json` mit belegten Angaben füllen, `public/css/main.css` durch die Gestaltung aus den Tokens ersetzen (design-uni Schritt 4), Seiten in `src/pages/` nach dem Antwort-Plan (text-uni) schreiben.

## Was sie nicht ist
- **Keine Gestaltung.** Das CSS ist neutral und gehört keinem Projekt.
- **Kein CMS.** Wie Laien Inhalte ändern (Keystatic, Decap, Tina), ist `[nicht gebaut]` (siehe `../referenzen/stacks.md`).
- **Kein Formular mit Server.** Das Beispiel (ein früheres Projekt) nutzt `mailto:`; ein Endpunkt mit Fotoanhang ist offen.
- **Nicht blind getestet.** Gebaut und auf Fehler im Skript geprüft; die Wirkung einer Seite aus dieser Vorlage ist nicht bewertet.

## Vorbild
`(früheres Projekt)` ist dieselbe Struktur mit allen 12 Seiten von ein früheres Projekt; `werkzeuge/vergleichen-dom.py` zeigt, dass die Ausgabe der bisherigen Vorschau Token für Token entspricht.
