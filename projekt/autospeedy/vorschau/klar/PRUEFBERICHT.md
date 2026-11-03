# Prüfbericht Linie «Klar» (03.11.2026)

Offene Punkte zuerst.

## Offen
- **Material:** Nach zwei Runden betrifft die Kritik der Bewerter vor allem das Foto (unruhiger Hintergrund, nur 1600 px breit). Laut design-uni wird das dem Betrieb gemeldet statt weiter an der Gestaltung zu drehen: Fototag empfohlen.
- **DP6 Formular 3 bis 5 Felder:** Der Rückruf hat bewusst nur Name und Telefon (Entscheid «Rückruf in einem Schritt», wie die erste Linie). Gemeldet, nicht geändert.
- **Rückruf-Frist** («wann ruft jemand an?») fehlt in der Bestätigung: Lücke des Betriebs (Kunden-Agent und Lesetest nennen es).
- **Beschreibungen** (meta description) fehlen noch auf allen Seiten, wie in der ersten Linie (Hinweis, Gerüst).

## Blinde Tests (Modell-Urteil, Vorfilter; je 1 Bewerter statt 6, auf Wunsch des Studios, darum ohne Streuung und ohne zweites Modell)
| Test | Ergebnis | Schwelle laut Skill |
|---|---|---|
| DP4 Bildtest «Klar», Runde 1 | 6, «solide» (Weissschleier, zentrierte Standardachse, zwei gleiche Knöpfe) | Mittel ≥ 7,5, ≥ 4/6 «Agentur» |
| DP4 Bildtest «Klar», Runde 2 | **7, «solide»** (Restkritik: Foto unruhig, Pille und Knopf) | nicht erreicht |
| DP4 Bildtest Linie «Lack» (eigener Satz) | 6, «solide» | nicht erreicht |
| Referenzen in allen Sätzen | Porsche 9, Polestar 8, **greco-car.ch 4 («Vorlage»)** | stabil |
| DP4 Fünf Sekunden (Handy) | Angebot, Ort, nächster Schritt richtig | 1 von 1 |
| TP2 Lesetest nur Text | Startseite richtig; Schaden melden nannte keinen Ort → Kicker ergänzt | 1 von 1 nach Korrektur nicht nachgeprüft |
| DP7 Kunden-Agent (Tesla Model Y, Hagel, Handy, Einstieg /tesla/) | erreicht, 10 Aktionen, Modell angegeben, Vertrauen 8, würde anfragen 8 | — |

## Maschinell
- design-uni `pruefen.cjs` (DP6, DP5, TP7, WP5): 61 Prüfungen; offen nur «Formular 3 bis 5 Felder» (siehe oben) und der Kontrast des Texts über dem Foto, den das Werkzeug nicht messen kann. Von Hand gemessen (Bildpunkte hinter dem Text, 95-%-Wert): Kicker 4,73 (Soll 4,5), Titel 6,5 (Soll 3), Unterzeile 12,9; am Handy 8,7 / 13,0 / 13,8.
- text-uni `slop-de.js`: 0 Fehler, 0 Warnungen auf 12 Seiten.
- Eigene Prüfungen: 11 Seiten an Laptop und Handy ohne Überlauf, 0 tote Links, Tippziele ≥ 44 px; Tesla-Formular in beiden Linien 8/8; Demo «Klar» 16/16.
