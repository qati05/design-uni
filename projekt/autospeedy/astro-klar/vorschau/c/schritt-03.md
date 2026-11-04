# Schritt 03 · Hero und Faktenleiste

Stand: 03.11.2026. Entwurf C, Abschnitte 2.2 und 2.3.

## 1. Geaendert
- **`src/components/Hero.astro`** (neu): 7fr Text | Spaltenlinie | 5fr Rahmen 4:5 mit Bild und figcaption. Texte woertlich aus `entwurf-c.html` (.hero). CTAs «Schaden melden» (→ `/schaden-melden/`) und «Anrufen 071 755 88 61» (`tel:` aus `betrieb.tel.e164`), mit `data-zaehl`. Bild als `<img>` mit `srcset` (480/960/1440 WebP), `sizes`, `width/height`, `fetchpriority="high"`, nicht lazy. Figcaption als Platzhalter.
- **`src/components/Faktenleiste.astro`** (neu): `<dl>` mit 4 Gruppen Ort · Offen · Team · Zulassung. «Offen» als Kurzform aus der gepflegten `site.zeiten` (ueber `betrieb.zeiten`, dieselbe Quelle wie `Zeiten.astro`); keine fest geschriebenen Zeiten. Ort aus `betrieb.json`.
- **`src/pages/index.astro`**: alte Buehne (`maserati`, `.buehne__kicker`, Kopfbild) und die alte Vertrauenszeile durch `<Hero />` + `<Faktenleiste />` ersetzt. Uebrige Abschnitte unveraendert. Layout bekommt `bildVorladen` fuer das LCP-Bild.
- **`src/layouts/Klar.astro`**: optionale Prop `bildVorladen` → `<link rel="preload" as="image" imagesrcset imagesizes fetchpriority="high">` fuer das Hero-Bild.
- **`public/css/klar.css`**: Baustile `.hero`, `.hero-text`, `.hero-bild`, `.leiste-fakten` (Desktop und Handy ≤760px nach Entwurf). Bewegung: Hero-Einstieg (3.4, h1 Zeile 1/2 und Lead, 0/60/120 ms, 520 ms `--feder-weich`, Handy 6 px), Hero-Bild (3.5, scale 1.035→1, ohne opacity, 900 ms), Faktenleiste (3.6, 4 Zellen, 50 ms Staffel ab 180 ms, 420 ms). Alles unter `@media (prefers-reduced-motion: no-preference)`. CTAs nicht animiert.
- **`bau/stock-c.mjs`** (schon vorhanden, uebernommen): erzeugt B1 als WebP 480/960/1440 nach `public/bilder/stock/`. **`bau/teilen.mjs`**: ruft `stock-c.mjs` nach dem Kopieren auf. Lauf geprueft, Bilder liegen vor. (`public/bilder/` ist gitignored; die Ableitungen entstehen beim `prebuild`.)
- **`test/browser.test.mjs`**: zwei Tests ergaenzt (siehe unten).
- Credit fuer das Pexels-Foto steht bereits unter `/bildnachweise/` (B1, Dextar Studio, Pexels-Lizenz).

## 2. Pruefungen
| Pruefung | Ergebnis |
|---|---|
| `node bau/teilen.mjs` | bestanden (Bilder + B1-WebP erzeugt) |
| `npm run build` | bestanden, 13 Seiten, 0 FEHLER |
| `npm test` (16 Tests) | **gruen** |

Neue Tests:
- «Hero ohne JS: h1, Lead, CTAs und Faktenleiste nach 800 ms mit opacity 1» (`javaScriptEnabled:false`).
- «Hero unter Reduced Motion: Kinder von `.hero-text` ohne animation-name».

## 3. Lighthouse Handy (`vorschau/c/lh-03.json`)
Gemessen wie Schritt 00 (lighthouse@12.8.2, Chrome headless, Form-Factor mobile), gegen einen statischen Server, der Textdateien wie die Produktion (Cloudflare Pages) **gzip**-komprimiert.

| Kategorie / Metrik | Wert | Schritt 00 |
|---|---|---|
| Performance | **98** | 94 |
| Accessibility | **100** | 100 |
| Best Practices | 96 | 96 |
| LCP | 2.3 s | 2.9 s |
| FCP | 1.4 s | 2.0 s |
| Speed Index | 1.4 s | 2.0 s |
| TBT / CLS | 0 ms / 0 | 0 / 0 |

LCP-Element ist das Hero-Bild mit `fetchpriority="high"` (vorgeladen). Zur Transparenz: ohne Textkompression (nackter Dateiserver) sind es Performance 93 / LCP 3.1 s; die Produktion liefert komprimiert, darum ist 98 der realistische Wert.

## 4. Vergleich mit dem Entwurf
- **`entwurf-c-desktop.png`** vs. `03-start-desktop.png`: gleiche Aufteilung 7fr Text | Spaltenlinie | 5fr Bild 4:5, h1 zweizeilig mit kursiver zweiter Zeile, Lead, zwei CTAs (Akzent/Kontur), darunter die vierspaltige Faktenleiste mit Haarlinien. Deckt sich.
- **`entwurf-c-handy.png`** vs. `03-start-handy.png`: Bild oben (16:10), darunter Text, CTAs volle Breite, Faktenleiste 2×2. Deckt sich.

## 5. Offene Punkte
- **«seit Oktober»** im Lead ist woertlich aus dem Entwurf uebernommen und **unbestaetigt** (Datum der Tesla-Zulassung). Bleibt unveraendert, bis der Betrieb es bestaetigt.
- **LCP 2.3 s** liegt knapp ueber dem Abnahmeziel ≤ 2.0 s. Performance ≥ 95 ist erfuellt. Weitere Reserve: ein art-direktierter 16:10-Mobil-Ausschnitt des Hero-Bilds (Lighthouse meldet noch ~150 ms aus «uses-responsive-images», weil das 4:5-Bild auf dem Handy beschnitten wird).
- Figcaption und Bild sind Platzhalter (Pexels), bis das eigene Foto vom Shooting da ist.
