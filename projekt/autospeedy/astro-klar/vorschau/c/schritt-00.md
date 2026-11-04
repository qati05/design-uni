# Schritt 00 · Ausgangsmessung

Stand: 03.11.2026. Nur gemessen, kein Code geaendert.

## 1. Pruefungen

### astro-klar
| Pruefung | Ergebnis | Hinweis |
|---|---|---|
| `node bau/teilen.mjs` | bestanden | Bilder und Skripte aus ../astro uebernommen |
| `npm ci` | nicht noetig | node_modules vorhanden, Build und Tests laufen |
| `npm run build` | bestanden | 12 Seiten in 445 ms; 15 HINWEIS (spaetere Texte, Stufe geruest), 0 FEHLER |
| `npm test` | bestanden | 10 Tests gruen (statisch + Browser: Slider, Handyleiste, Schadenmeldung, CSP, de-CH, Schriften) |
| `node bau/pruefen-seiten.cjs` | **fehlgeschlagen** | Modul `playwright` nicht gefunden (`MODULE_NOT_FOUND`). Nur `playwright-core` ist Abhaengigkeit (package.json, 1.64.1); das Skript macht `require('playwright')`. Pre-existing, nicht repariert. |

### cockpit
| Pruefung | Ergebnis | Hinweis |
|---|---|---|
| `npm ci` | nicht noetig | node_modules vorhanden |
| `npm test` | bestanden | 4 Testdateien, 67 Tests gruen (vitest) |
| `npx tsc --noEmit` | bestanden | keine Fehler |

## 2. Lighthouse Handy (gebaute Startseite, dist)

Quelle: `vorschau/c/lh-00.json` (lighthouse@12, Chrome headless=new).

| Kategorie / Metrik | Wert |
|---|---|
| Performance | 94 |
| Accessibility | 100 |
| Best Practices | 96 |
| LCP | 2.9 s |
| FCP | 2.0 s |
| Speed Index | 2.0 s |
| CLS | 0 |
| TBT | 0 ms |

## 3. Dateien, die laut BAUPLAN-C Abschnitt 5 spaeter geaendert werden

Pfade relativ zu `projekt/autospeedy/`, wo nicht anders angegeben.

**Schritt 01 – Schriften, Tokens, Screenshots**
- astro-klar/public/fonts/ (Source Serif 4, Archivo, Hanken, OFL)
- astro-klar/public/css/klar.css
- astro-klar/src/layouts/Klar.astro
- astro-klar/bau/fotos-c.mjs (neu)
- astro-klar/test/statisch.test.mjs

**Schritt 02 – Huelle und Knoepfe**
- astro-klar/src/components/Kopf.astro, Fuss.astro, Hinweis.astro (neu)
- astro-klar/src/layouts/Klar.astro
- astro-klar/public/css/klar.css, public/js/klar.js
- astro-klar/test/browser.test.mjs
- (neue Seite /bildnachweise/)

**Schritt 03 – Hero und Faktenleiste**
- astro-klar/src/pages/index.astro
- astro-klar/src/components/Hero.astro, Faktenleiste.astro (neu)
- astro-klar/public/bilder/stock/ (B1 WebP 480/960/1440)
- astro-klar/public/css/klar.css

**Schritt 04 – Partnerband**
- astro-klar/src/pages/index.astro
- astro-klar/src/components/Partnerband.astro (neu/Wrapper)
- astro-klar/public/css/klar.css, public/js/klar.js

**Schritt 05 – Leistungen und Anfrage**
- astro-klar/src/pages/index.astro
- astro-klar/src/components/Leistungen.astro, Anfrage.astro (neu)
- astro-klar/public/css/klar.css
- astro-klar/src/pages/leistungen.astro (Anker)

**Schritt 06 – Tesla und Ablauf**
- astro-klar/src/pages/index.astro
- astro-klar/src/components/TeslaTeil.astro (neu)
- astro-klar/public/bilder/stock/ (Tesla-Band)
- astro-klar/public/css/klar.css, public/js/klar.js

**Schritt 07 – Vorher/Nachher**
- astro-klar/src/components/Vergleich.astro
- astro-klar/public/css/klar.css, public/js/klar.js
- astro-klar/src/pages/index.astro
- astro-klar/test/browser.test.mjs

**Schritt 08 – Inhaber, Team, Feld stimme**
- gemeinsam/site.ts
- astro/src/daten/site.json
- astro/bau/editor.mjs
- cockpit/app/pflege/PflegeFormular.tsx, app/pflege/aktionen.ts, lib/website.server.ts, Tests
- astro-klar/src/components/Inhaber.astro (neu), src/pages/index.astro, public/css/klar.css

**Schritt 09 – Bewertungen**
- astro-klar/bau/bewertungen.mjs (neu), src/daten/bewertungen.json (neu, leer)
- astro-klar/package.json (prebuild)
- astro-klar/src/components/Bewertungen.astro
- gemeinsam/site.ts und Cockpit-Pflege (Schalter), astro/bau/editor.mjs
- astro-klar/public/css/klar.css, public/js/klar.js
- astro-klar/test/fixtures/bewertungen-beispiel.json

**Schritt 10 – Schluss und Kontakt**
- astro-klar/src/components/Abschluss.astro, Zeiten.astro
- astro-klar/src/pages/index.astro
- astro-klar/public/css/klar.css

**Schritt 11 – Bewegung geprueft**
- astro-klar/public/css/klar.css, public/js/klar.js
- astro-klar/test/bewegung.test.mjs (neu)
- vorschau/c/bewegung.md (neu)

**Schritt 12 – Formular-Rueckmeldung und Spam-Schutz**
- astro/public/js/schaden.js, astro-klar/src/pages/schaden-melden.astro, public/css/klar.css
- astro/functions/api/schaden.js, gemeinsam/meldung.ts, astro/bau/dateien.mjs (cspZeile)
- cockpit/supabase/migrations/<zeitstempel>_drossel.sql (neu)
- Tests in astro und cockpit/tests

**Schritt 13 – Cockpit Branding und Bewegung**
- cockpit/lib/demo-speicher.ts, tests/branding.test.ts, tests/db/rauchprobe.sql, LIESMICH.md
- cockpit/app/globals.css, app/layout.tsx, public/fonts/
- cockpit/app/meldung/[id], app/page.tsx

**Schritt 14 – Bewertungsanfrage, QR, NFC**
- cockpit/app/meldung/[id], lib/mailtexte.ts, lib/versand.server.ts, Pflege-Karte «Bewertungs-QR»
- astro-klar/src/pages/bewerten.astro, bau/qr.mjs (neu), public/bewerten/qr.svg, src/pages/bewerten/druck.astro

**Schritt 15 – Abnahme**
- nur vorschau/c/ABNAHME.md, Screenshots, Lighthouse-Berichte (Code nur bei eindeutigen Fehlern)

## 4. Offene Punkte dieser Messung
- `pruefen-seiten.cjs` ist vor dem Umbau rot (fehlende Abhaengigkeit `playwright`). Nicht repariert; vor einem spaeteren Schritt zu klaeren (Entscheid Reshat 03.11.: keine eigenmaechtigen Aenderungen).
