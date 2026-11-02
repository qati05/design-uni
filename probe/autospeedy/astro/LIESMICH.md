# Auto Speedy in Astro

Gleiche Vorschau wie `../site/`, aufgebaut mit dem Standard-Stack von web-uni (Astro 7.4.4, statische Ausgabe).

```bash
cd probe/autospeedy/astro && npm install && npx astro build     # Ausgabe in dist/
python3 ../werkzeuge/vergleichen-dom.py ../site dist            # Vergleich mit der bisherigen Vorschau
SITE_DIR=astro/dist node ../werkzeuge/pruefen.cjs               # 50 Maschinenprüfungen (aus probe/autospeedy)
```

- **Eine Quelle:** `src/content/betrieb.json` (Anschrift, Nummern, Zeiten, Menü, Links) und `src/content/bewertungen.json`. Kopf, Fuss, Zeitentabelle, Strukturdaten und das Skript für den Öffnungsstatus lesen daraus. Vorher standen Zeiten und Mail in `main.js` und im Bauskript doppelt.
- **Ergebnis des Vergleichs:** 11 von 12 Seiten Token für Token gleich. Eine bewusste Abweichung: `betrieb.html` (die Lücke «Welche Stellen offen sind» steckte vorher in einem `<p>` im `<p>`, was ungültiges HTML war).
- **Prüfungen:** 50 von 50 bestanden, wie bei `site/`.
- **Nachweis «eine Quelle»:** Eine geänderte Schlusszeit nur im Datenblock änderte die Statusaussage des Skripts (Freitag 16.50 Uhr: «geschlossen» statt «offen bis 17.15»).
- **Geschwindigkeit (Lighthouse mobil, Median aus 3, localhost):** Astro-Fassung Score 96, Barrierefreiheit 100, Best Practices 100, LCP 2708 ms, TBT 0, JS 3,8 KB, 321 KB gesamt; bisherige Vorschau Score 97, 100, 100, LCP 2644 ms, JS 3,6 KB, 320 KB. Praktisch gleich. `[gebaut und gemessen · 2026-11-02]`
- **Nicht gemacht:** CMS für Laien, Formular mit Server, blinde Bewertung dieser Fassung (Inhalt und Gestaltung sind unverändert, also gilt der Stand von `../pruefung/blindtest.md`).
