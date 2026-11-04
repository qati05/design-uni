# Schritt 02: Hülle und Knöpfe

Stand 03.11.2026. Branch `claude/autospeedy-c`. Kein push, kein merge, kein Commit (macht der Bauleiter).

## Geändert
- **Kopf.astro** nach Entwurf C: Logo-Bild, Nav Leistungen/Tesla/Team/Kontakt (Occasionen raus), Telefon als `.kopf-tel` mit Ziffern in Archivo (`betrieb.tel`), kleiner Knopf «Schaden melden» (`.knopf--akzent.knopf--klein`). Handy unverändert: Logo, Telefon-Symbol, Menü-Dialog (von rechts).
- **Fuss.astro** nach Entwurf C: Betriebszeile + Impressum, Datenschutz, neuer Link **Bildnachweise**.
- **Hinweis.astro** (neu): zeigt `site.hinweis` nur wenn aktiv und mit Text; Text von Astro escaped; Ziel nur aus `HINWEIS_LINKS` (sonst Fallback `/schaden-melden/`); ohne Animation. In Klar.astro den bisherigen Inline-Hinweis dadurch ersetzt.
- **src/pages/bildnachweise.astro** (neu) + Eintrag `bildnachweise` in `texte.json`: Credits aus `referenz-c/CREDITS.md`, nur die beiden Stockfotos mit fremder Quelle (B1 Pexels/Dextar Studio, B7 Unsplash/Philipp Mandler).
- **klar.css**: Knopf-System `.knopf` / `.knopf--akzent` / `.knopf--kontur` (+ `--klein`, `--gross`) nach BAUPLAN 3.2 in `@layer bausteine`, Federbewegung in `@layer bewegung` (Feder nur beim Loslassen, Hover `translateY(-2px)` feder-ruhig, Drücken `scale(.96)`; Reduced Motion ohne transform). Fokus nach 3.12 (`:focus:not(:focus-visible)` kein Ring; weisser Innenring auf Akzent/Foto, sofort). Handyleiste: ein 320 ms `--feder-ruhig`, aus 200 ms `--hinaus`. Alte Klassen `.k`, `.k--blau`, `.k--hell`, `.k--gross` u.a. bleiben als Aliase erhalten (Unterseiten unverändert).
- **klar.js**: `js-bewegung` nur wenn IntersectionObserver vorhanden und Reduced Motion aus. Handyleiste von Scroll-Handler auf IntersectionObserver umgestellt (an sobald Hero weg, aus bei `.schluss`/`.fuss` sichtbar, aus bei Fokus auf input/textarea/select, wieder an bei focusout). Kopf-Scrollen (3.14) unverändert. Ohne IO bleibt die Leiste sichtbar.
- **Handyleiste** (Klar.astro): Knöpfe auf `.knopf--kontur` / `.knopf--akzent` umgestellt.
- **test/browser.test.mjs**: neue Tests Federkurve am Knopf, Fokusring ohne Transition, Handyleiste (an/aus/Fokus), Reduced Motion ohne transform-Transition; `/bildnachweise/` in den Seitendurchlauf aufgenommen.

## Entscheide (Kasten BAUPLAN, 03.11.)
Berücksichtigt: Partner nur Text, Pausieren-Knopf, volles Cockpit, Bewertungen nur Note/Anzahl/Link — betreffen spätere Schritte (04/09), hier keine Aktion nötig.

## Prüfungen (grün)
- `npm run build`: 13 Seiten, 0 Fehler.
- `npm test`: 14/14 (11 bestehende + 3 neue) grün; CSP ohne unsafe-inline/eval, kein Inline-Skript, keine `on…`-Attribute, kein Eszett.
- `node bau/fotos-c.mjs 02 / /tesla/ /schaden-melden/`: je 4 Aufnahmen (desktop/handy, je ganz).

## Offen / Hinweise
- Startseite noch im Premium-Layout (Entwurf-C-Umbau folgt in Schritt 03); Hero daher noch `.buehne--start`. Der Leisten-Observer greift `.hero, .buehne--start`, damit beides funktioniert.
- `bau/pruefen-seiten.cjs` braucht das Paket `playwright` (nicht installiert, nur `playwright-core`) und einen laufenden Server — in dieser Umgebung nicht lauffähig, schon vor diesem Schritt.
- Bildnachweise listet die C-Platzhalter B1/B7; sobald sie in Schritt 03 wirklich eingebunden sind, bleibt der Nachweis korrekt.
