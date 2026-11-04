# Schritt 08: Inhaber, Team, Feld `stimme`

## Geändert
- **gemeinsam/site.ts**: neues optionales Objekt `stimme { text ≤240 ohne < >, name ≤60, rolle ≤40, freigegeben:bool (Vorgabe false) }`. Jede Person in `team.leute` bekommt `einverstaendnis: boolean` (Vorgabe false). Beides über `default`/`optional`, daher bleibt die bestehende site.json gültig (Migration).
- **astro/src/daten/site.json**: `stimme` mit leeren Werten und `freigegeben: false` ergänzt (nichts ausgefüllt). Team unverändert; `einverstaendnis` füllt der Schema-Default.
- **astro/bau/editor.mjs** (Sveltia, kein Cockpit): Abschnitt «Satz vom Inhaber» (Text max. 240 ohne `< >`, Name, Rolle, Schalter «Auf der Website zeigen» mit Hinweis «Nur mit Zustimmung des Inhabers») und beim Team das Feld `einverstaendnis` («Auf der Website zeigen», Hinweis «Nur mit Zustimmung der Person»).
- **astro-klar/src/components/Inhaber.astro** (neu): Entwurf C. Porträt-Platzhalter 4:5 («B8 · Porträt Inhaber in der Halle, 4:5 · Platzhalter · Foto folgt vom Shooting»), Zitat in Source Serif kursiv, Teamband-Platzhalter 3:1 + Satz «Zehn Leute, eine Werkstatt an der Alten Landstrasse.» + Link «Ganzes Team» → /team/. Mit `stimme.freigegeben: true` echte Werte (Name, Rolle), sonst der Platzhaltertext wörtlich. Platzhalter sind `.platz` ohne `.foto-ein` → kein Foto-Reveal (3.5 gilt nur für echte Fotos).
- **astro-klar/src/pages/index.astro**: alte Team-Sektion (naehe/leute) durch `<Inhaber />` ersetzt; ungenutzte Importe (`Bild`, `leute`) entfernt.
- **astro-klar/src/pages/team.astro**: zeigt nur Personen mit `einverstaendnis: true`; Lücke-Text an die Zustimmung angepasst. Da noch niemand zugestimmt hat, steht aktuell kein Name auf der Website.
- **astro-klar/public/css/klar.css**: Stile `.inhaber`, `.platz(.hoch)`, `.team-bild`, `blockquote` (kursiv nur hier) inkl. Handy-Fassung.
- **Tests**: `test/validierung.test.mjs` (node --test, prüft dasselbe zod-Schema wie der Bau), `test/fixtures/site-ungueltig.json`, neuer Static-Test in `statisch.test.mjs`; `package.json` test-Skript erweitert.

## Prüfungen (grün)
- `node --test test/validierung.test.mjs` → 5/5. Prüft: echte site.json gültig; `einverstaendnis`-Default; `stimme` optional + Default `freigegeben:false`; `< >` verboten; Länge 240; ungültige Fixture lässt die Prüfung scheitern. Das ist genau die Prüfung aus `daten.mjs`, also bricht der Bau mit dieser site.json ab.
- `npm run build` → 13 Seiten, 0 Fehler.
- `node --test test/statisch.test.mjs` → 7/7 (CSP ohne unsafe-inline, kein Inline-JS/on…, kein ß; Inhaber-Platzhalter sichtbar, kein erfundener Name/Zitat).
- `node --test test/browser.test.mjs` → 21/21 (u. a. «Alle Seiten laden ohne Konsolenfehler» mit /team/).

## Offen / Hinweise
- Porträt, Zitat, Name und das Teamband bleiben Platzhalter bis Gespräch, Fotoshooting und Einverständnis (BAUPLAN 2 Zeile 9).
- Den «ungültige site.json → Build bricht ab»-Fall habe ich nicht per echtem Swap der getrackten site.json gezeigt (hätte die Datei überschrieben); der Unit-Test ruft dieselbe `siteSchema.safeParse`-Prüfung auf und belegt den Abbruch deterministisch.
- Screenshots nur `/` (Präfix `08-start-*`).

## Nicht committet
Änderungen bleiben ungestaged. Commit macht der Bauleiter: «Schritt 08: Inhaber, Team, Feld stimme».
