# Schritt 05 · Leistungen und Anfrage

Stand: 03.11.2026. Entwurf C, BAUPLAN 2 Zeilen 5 und 7, 3.3, 3.15.

## 1. Geaendert
- **`src/components/Leistungen.astro`** (neu): «Was wir für Sie machen.» + 4 Karten als ganz klickbare `<a>` (genau ein Link je Karte, Pfeil `aria-hidden`). Texte woertlich aus `entwurf-c.html` (.leistungen). Ziele `/leistungen/#unfall`, `#lack`, `#felgen`, `#hagel`. Zeile «Ausserdem: …» woertlich. Bewusst kein `.zeigen` (3.15).
- **`src/components/Anfrage.astro`** (neu): wiederverwendbare CTA-Box (`.anfrage`), Props `titel`/`text` mit Standardtext woertlich aus dem Entwurf. CTAs wie im Hero (`knopf--akzent` «Schaden melden», `knopf--kontur` «Anrufen», gleiche Icons).
- **`src/pages/index.astro`**: `<Leistungen />` + `<Anfrage />` direkt unter `<Partnerband />`; alte `.kacheln`-Leistungen entfernt. **Alle `.zeigen`-Klassen auf der Startseite entfernt** (nur Prosa-«zeigen» bleibt). Die `.zeigen`-Logik in `klar.js` bleibt fuer die Unterseiten.
- **`src/pages/leistungen.astro`**: Anker `#unfall` (Zeile «Unfall und Blech») und `#lack` (Zeile «Was wir lackieren») ergaenzt; `#felgen`/`#hagel` bestanden bereits.
- **`public/css/klar.css`**: `.leistungen`, `.karten`, `.pfeil`, `.ausserdem`, `.anfrage`. Bewegung nach 3.3: Karte `translateY(-3px)` `--feder-ruhig` 480 ms, Pfeil `translateX(4px)` `--feder-knopf` 420 ms mit 40 ms Verzoegerung, Hover nur `(hover:hover) and (pointer:fine)`, `:active scale(.985)` 90 ms `--aus`, Fokus zeigt die Pfeilposition ohne Transition. Reduced Motion: nur Rand- und Pfeilfarbe, kein Weg. Handy ≤ 720px: Karten als Zeilen (`:active` nur Pfeil `translateX(3px)`); ≤ 960px zwei Spalten.
- **`test/browser.test.mjs`**: drei Tests ergaenzt; ein bestehender Hero-Test auf `.hero .ctas` eingegrenzt (die CTA-Box nutzt bewusst dieselbe `.ctas`-Klasse wie der Hero).

## 2. Pruefungen
| Pruefung | Ergebnis |
|---|---|
| `npm run build` | bestanden, 13 Seiten |
| `npm test` | **gruen, 21 Tests** |
| impeccable | in dieser Sitzung nicht ausfuehrbar (Freigabe noetig); offen fuer die Durchsicht |

Neue Tests:
- «je Karte genau ein Link, Pfeil `aria-hidden`, Ziele»: 4 Karten, je ein `<a>`, Hrefs = `/leistungen/#unfall|#lack|#felgen|#hagel`.
- «Hover-Transition mit Feder»: Karte `transform` `linear(…)` 0.48 s; Pfeil `transform` `linear(…)` 0.42 s, Verzoegerung 0.04 s.
- «Handy zeigt Zeilen»: Kartenbreite = Spaltenbreite, alle linksbuendig, vier gestapelte Zeilen (390 px).

## 3. Screenshots
`vorschau/c/05-start-{desktop,desktop-ganz,handy,handy-ganz}.png` (nur `/`, Tempo-Vorgabe; Aufnahmen mit `reducedMotion: reduce`).

## 4. Offene Punkte
- Anker-Konvention: `#unfall`/`#lack` liegen (wie `#hagel`) auf Unterzeilen statt auf dem Abschnittskopf; alte IDs `#carrosserie`/`#lackiererei` bleiben erhalten.
- impeccable-Lauf steht aus (Freigabe).
