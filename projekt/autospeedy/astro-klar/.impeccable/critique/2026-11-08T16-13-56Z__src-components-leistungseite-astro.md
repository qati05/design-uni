---
target: Klar-Website, Startseite, Leistungen, Occasionen
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:C:\\Users\\ronik\\Projekte\\design-uni\\projekt\\autospeedy\\astro-klar\\src\\components\\LeistungSeite.astro"
target_fingerprint: "sha256:b27fd33bc374f179f0a68b5507359bf507e0f6f2c7e0b290308f9c07b0286210"
target_path: "C:\\Users\\ronik\\Projekte\\design-uni\\projekt\\autospeedy\\astro-klar\\src\\components\\LeistungSeite.astro"
timestamp: 2026-11-08T16-13-56Z
slug: src-components-leistungseite-astro
---
Method: dual-agent (Design-Review und Detektor getrennt)

## Design Health Score: 21/32 (Acceptable, nahe Good)

| # | Heuristik | Score | Befund |
|---|---|---|---|
| 1 | Status | 3 | Offen-Status stark; «Wir rufen zurück» sagt nicht wann |
| 2 | Alltagssprache | 3 | «Spot-Repair», «Chassisschaden» |
| 3 | Kontrolle | 3 | Nichts hält fest |
| 4 | Einheitlichkeit | 2 | H2 von 22 bis 60 px, H2 grösser als H1 |
| 5 | Fehler vermeiden | 3 | Freitag-Zeit im Rückruf falsch |
| 6 | Erkennen | 3 | Melden und Telefon immer erreichbar |
| 7 | Flexibilität | n/a | Persuade |
| 8 | Reduktion | 2 | Gleiche Fakten 3 bis 5 Mal pro Leistungsseite |
| 9 | Fehler beheben | 2 | Occasionen-Formular zeigt beim Leer-Senden keinen Text |
| 10 | Hilfe | n/a | Persuade |

## Design Specificity
Inhaltlich eigen, im Aufbau austauschbar. Detektor: Quelltext 0; URLs 3 Warnungen (kursive Serife, Marquee, verschachtelte Karte als Platzhalter), 1 Hinweis (Straggler). Kein Text unter 4.5:1, kein Überlauf, keine Konsolenfehler. Overlay ausgelassen.

## Priority Issues
- [P1] Einstieg spricht Marke statt Schaden (Hero.astro, LeistungSeite.astro): Felder «Was ist passiert?», Empathie-Satz als H1.
- [P1] Leistungsseiten wiederholen dieselben Fakten (LeistungSeite.astro): jeder Block eine Aufgabe.
- [P1] Überschriften verkehrt (klar.css:888): eine H2-Grösse 40 bis 44 px, H1 am grössten.
- [P1] Occasionen dient Käufern nicht (occasionen.astro, Rueckruf.astro:24): AutoScout zuerst, Schaden-Beispiele aus dem Formular, Formular zweitrangig.
- [P2] Ablauf ohne Knopf, am Handy doppelte Knöpfe (LeistungSeite.astro).

## Personas
Am Strassenrand: Nichts sagt, was tun, wenn das Auto nicht fährt. Erstnutzer: Fachwörter. Prüfer: Freitag 17.30 falsch, mailto-Formular. Hilfsmittel: «Anhalten» 41 px, Slogan wird vorgelesen.

## Minor
Marquee durch feste Reihe ersetzen; Fussslogan 276 px; Felgen-Vergleich zeigt zwei verschiedene Räder; Stossfänger/Stossstangen uneinheitlich; Hero-Text 7 px versetzt.

## Vom Auftraggeber
Grund und Beige nur 1,04:1 auseinander; Richtung Weiss mit Himmelblau im Gespräch.
