# Nachtrag Startseite + Tesla + SEO/AEO · Bericht

Umgesetzt am 04.11.2026 (Auftrag «Reshat-Ja», 12:09). Grundlage: `REVIEW-NACHTRAG.md`, `WEG-ZU-10.md`,
`korr-review.md` und die abgenommene Vorschau `leistungen-vorschau/site/` (nur gelesen, als Astro-Komponenten
nachgebaut, Inline-`<style>` nach `klar.css`). Nichts erfunden; keine Datenbank, keine neuen Bibliotheken.
Ein Teil war aus dem unterbrochenen Lauf schon im Worktree; er wurde geprüft, übernommen und fertiggestellt.

Prüfungen am Ende grün:
- `astro-klar`: `npm test` **126/126**, `npm run build` grün (0 FEHLER, 1 HINWEIS: Titel /flotten/ 62 Zeichen — nur Hinweis, wie bisher).
- `astro` (erste Linie): `npm test` **36/36**, `npm run build` grün (texte.json-Änderungen tragen die neuen Titel/Beschreibungen).
- Volle CSP ohne `unsafe-inline` bei Skripten; JSON-LD als `type="application/ld+json"` ist erlaubt und geprüft; kein Inline-JS, keine `on…`-Attribute; de-CH ohne Eszett.

Screenshots: `nachtrag-start-desktop.png`, `nachtrag-start-handy.png`, `nachtrag-tesla-desktop.png`, `nachtrag-tesla-handy.png`.

---

## 1 · Startseite: 6 Leistungskarten
- `Leistungen.astro`: 6 Karten in fester Reihenfolge **Unfall und Carrosserie · Hagel und Dellen · Lack · Felgen · Folierung · Scheiben**. Titel heisst **«Felgen»**, nie «Alufelgen» (im ganzen Bau geprüft).
- Jede Karte ist genau ein Link und zeigt auf `/leistungen/#unfall · #hagel · #lack · #felgen · #folierung · #scheiben`. Alle Anker existieren auf `/leistungen/` (Abschnitte mit belegten Fakten; fehlende Texte bleiben sichtbare Lücken, nichts erfunden).
- Bild je Karte **3:2**: Desktop Bild oben, Handy **88-px-Quadrat links** (`.karten--bild` in `klar.css`). AVIF + WebP mit `width/height`, `loading="lazy"`. Quelle sind betriebseigene WebP (`bau/bilder-c.mjs` leitet 400/800 px ab); später 1:1 durch das Shooting (S03–S08) ersetzbar, gleiche Dateinamen → keine Bildnachweis-Pflicht für diese Karten (betriebseigen).
- Darunter gefüllter CTA **«Schaden melden»** und die Zeile **«Ausserdem: Occasionen, Ankauf und Leasing.»** mit Link auf `/occasionen/`.

## 2 · Felgen-Vorher/Nachher nicht auf der Startseite
- Der Regler steht **nur** auf `/leistungen/#felgen` (`leistungen.astro`, `<Vergleich>`). Auf `/` kommt `data-vergleich` nicht mehr vor (Test). Die betroffenen Slider-Browser-Tests laufen jetzt gegen `/leistungen/`.

## 3 · Partnerband (echte Logos)
- `Partnerband.astro` + `klar.css`: echte Logos in **Graustufen** (`grayscale(1)`, opacity .72), automatisches Laufband **links→rechts** (`@keyframes partnerband` nur auf `transform`, `animation-direction: reverse`), nahtlos (Spur doppelt, Maske an den Rändern).
- **Pause bei Hover und Fokus** (`:hover`, `:focus-within`) und per Knopf «Anhalten/Weiter»; bei **`prefers-reduced-motion` statisch** (Band steht, Kopien ausgeblendet, kein Knopf) — durch Browser-Test abgedeckt.
- **Land Rover** als Wortmarke im gleichen Grau. **Tesla** optisch gleich schwer gemacht (`--tesla` kleinere Kappenhöhe). Logos vom Betrieb freigegeben (Reshat 04.11.).

## 4 · Google-Bewertungen
- `Bewertungen.astro`: 3 Zitate wörtlich aus der Vorschau, **Note 4,8**. Sichtbar **nur in der Vorschau** (gleicher Schalter wie die Lücke-Boxen: `vorschau && !hatDaten`), klar mit **«Name folgt»** und Hinweis «Nur in der Vorschau …» — **live ausgeblendet**, bis Namen, Datum, Anzahl und Profil-Link aus dem Google-Profil vorliegen.
- Daten pflegbar in `src/daten/bewertungen-zitate.json` (Editor/Betrieb). Der echte Note-Abschnitt (`bewertungen-teil`) erscheint weiterhin nur mit echten Live-Daten.

## 5 · Tesla-Seite
- `tesla.astro` (C14/C15): **kein Raster, kein Glow, keine Pill mit Punkt**. Marke als ruhiger Eyebrow, **gerahmtes Foto** wie auf der Startseite (AVIF + WebP, Platzhalter ohne Gesicht, Credit Unsplash/Philipp Mandler unter `/bildnachweise/`).
- Liste ohne Pseudo-Navigation; die Schritte **Melden · Begutachten · Reparieren** auf einer Linie. Am Ende CTA **«Tesla-Schaden melden»** → `/schaden-melden/?fahrzeug=tesla` (vom Formular unterstützt, `schaden.js` wählt die Tesla-Kachel vor).
- Nur belegte Aussagen (Tesla Approved Body Shop, Original-Ersatzteile, Ersatzwagen Tesla auf Anfrage). Kurze **Tesla-FAQ** (4 Fragen) aus vorhandenen Fakten.

## 6 · SEO
- Pro Seite eigener `<title>` und **Meta-Description (de-CH, ≤ 155 Zeichen)**, **Canonical**, **Open Graph + Twitter Card mit Bild** (`Klar.astro`). Geprüft für 11 Inhaltsseiten (Titel eindeutig, Description 140–155 Zeichen).
- **favicon.ico, SVG-Icon, apple-touch-icon** aus dem Logo + OG-Bild 1200×630 (`bau/bilder-c.mjs`).
- **robots.txt / sitemap.xml folgen dem Schalter** (`astro/bau/dateien.mjs`): Vorschau = `noindex`-Meta + `X-Robots-Tag` + robots.txt ohne Sperre, keine Sitemap. Live = robots.txt mit `Sitemap:` und sitemap.xml, kein `noindex`. Beide Seiten durch Tests belegt (der Live-Fall als eigener Testbuild mit `vorschau:false`).
- Saubere Überschriften-Hierarchie, Alt-Texte, **Hero-Bild `fetchpriority="high"`, nicht lazy, AVIF, Handy-Grösse ~800 px**, vorgeladen (LCP-Ziel < 2,5 s).

## 7 · AEO
- **JSON-LD** als `@graph` (`Klar.astro`), parsebar und valide geprüft: **AutoBodyShop** mit Name, Adresse, Telefon, Öffnungszeiten (aus Betriebsdaten), `areaServed` (Altstätten, Rheintal), `sameAs` (nur vorhandene Links: Facebook, AutoScout24), **6 Service-Einträge**. `geo` nur wenn in den Betriebsdaten gesetzt — aktuell nicht vorhanden, daher bewusst weggelassen (nichts erfunden).
- **`aggregateRating` nur live und nur mit echten Daten** — in der Vorschau weggelassen (Test), auch im Live-Testbuild ohne echte Bewertungen weg.
- **FAQPage** auf Startseite/Leistungen mit **6 echten Fragen** (Versicherung, Ersatzwagen auf Anfrage, Tesla, Marken, Standort — keine Dauer, da nicht belegt); kurze FAQPage auf Tesla. **BreadcrumbList** auf Unterseiten, nicht auf der Startseite.
- Antworten stehen **als sichtbarer Text** auf der Seite (`Faq.astro`), nicht nur im JSON-LD (Test).
- **`public/llms.txt`** mit Kurzbeschreibung und Seiten-Links.

---

## Tests (ergänzt)
In `test/statisch.test.mjs` neu: 6 Karten in Reihenfolge + kein «Alufelgen»; SEO je Seite (Title/Description ≤155/Canonical/OG/Twitter); Icons/OG im Bau; Hero nicht-lazy + fetchpriority + AVIF 800px; AEO-JSON-LD valide Felder + kein aggregateRating in der Vorschau; FAQ als sichtbarer Text; llms.txt; Bewertungen nur in der Vorschau; Schalter Vorschau (noindex, robots ohne Sperre, keine Sitemap); **Schalter Live (Testbuild)**: index + Sitemap, kein noindex, sitemap.xml, weiterhin kein aggregateRating.
Angepasst (geänderte Vorgaben): `statisch.test.mjs` «Vergleich» prüft jetzt `/leistungen/` statt `/`; `schluss.test.mjs` JSON-LD liest aus `@graph`; `browser.test.mjs` 5 Slider-Tests gegen `/leistungen/`, Leistungskarten 4→6 mit neuen Zielen.

## Lighthouse
Lighthouse ist in dieser Umgebung nicht installiert, und neue Bibliotheken sind nicht erlaubt — es wurden **keine Zahlen erfunden**. Ein Live-Testbuild (`vorschau:false`) wurde erstellt und geprüft. Die wirkenden Faktoren sind umgesetzt: eigener Title/Description/Canonical, OG/Twitter, JSON-LD, saubere Hierarchie, Alt-Texte (SEO) sowie Hero als AVIF ~800 px, `fetchpriority=high`, nicht lazy, vorgeladen, selbst gehostete Schriften, kein Render-Blocking-JS (LCP/Performance). Die Lighthouse-Messung mobil für `/` und `/tesla/` ist auf einer Umgebung mit Lighthouse/Chrome nachzuholen.

## Erhalten
Hero-Korrektur (H1, Lead, Faktenleiste-Zelle «Ersatzwagen», Tesla-Spec «Ersatzwagen: Tesla auf Anfrage»),
Footer-/Motion-/Review-Korrektur (7c018fe u. a.) und die Ergebnisse der Schritte 11–15 (Formular, Editor /admin/,
Hinweise, Bewertung anfragen) bleiben erhalten und funktionieren (Tests grün). `cockpit/` unverändert.
