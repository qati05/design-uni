# Schritt 11 — Bericht (Linie «Klar», Entwurf C)

## 1. Insgesamt geaenderte Punkte in Schritt 11

### Teil A — bereits committet (HEAD `68c5d3a`)
Laut `git show HEAD`:
- **Handyleiste nach den Hero-CTAs**: Die Leiste unten am Handy erscheint erst, wenn die
  Hero-CTAs (`.hero .ctas`) aus dem Bild gescrollt sind, nicht mehr der ganze Hero — damit nie
  vier CTAs gleichzeitig sichtbar sind. Aus, solange Schluss/Fuss sichtbar sind oder ein
  Eingabefeld den Fokus hat. (`public/js/klar.js`, `public/css/klar.css`)
- **Bewertungen ohne echte Daten ganz ausgeblendet** (Entscheid 22:00): kein Abschnitt, keine
  Platzhalter-Note, nie «–,– von 5» live. (`src/components/Bewertungen.astro`)
- **Bewertung in die Faktenleiste** aufgenommen. (`src/components/Faktenleiste.astro`)
- **Anrufen-Knopf gefuellt** (nicht transparent, Entscheid Reshat). (`public/css/klar.css`)
- **Kein generisches Sektions-Einblenden** mehr (BAUPLAN 3.15); es bleibt nur das gezielte
  Erscheinen fuer Fotos und den Tesla-Ablauf. (`public/js/klar.js`, `public/css/klar.css`)
- Tests an den Entscheid 22:00 angepasst. (`test/browser.test.mjs`, `test/statisch.test.mjs`)
- Bildschirmfotos `11-*` (Start/Tesla, Desktop/Handy).

### Teil B — dieser Durchgang
- **Menue-Dialog (3.12)**: Von `@keyframes blattRein` auf CSS-Transition umgestellt.
- **Schriftpruefung** (tnum) durchgefuehrt, Ergebnis unten — Archivo bleibt.
- **Logo**, **Kopf /tesla/** und **Fotoregel (Gesichter)** geprueft, Ergebnis unten.
- Bildschirmfotos `11b-*`.

## 2. Schriftpruefung tnum (fonttools, GSUB)

Mit `fontTools 4.65.0` die GSUB-FeatureTags gelesen:

| Datei | tnum vorhanden? |
|---|---|
| `hanken-grotesk-latin-400-normal.woff2` | **nein** (ccmp, dnom, frac, liga, locl, numr) |
| `hanken-grotesk-latin-500-normal.woff2` | **nein** |
| `hanken-grotesk-latin-600-normal.woff2` | **nein** |
| `archivo-latin-wdth-normal.woff2` | **ja** (…, pnum, **tnum**) |

**Ergebnis: Hanken Grotesk kann keine tabular-nums (kein `tnum`-Feature im GSUB).**
Darum wird **Archivo behalten**. Die Umstellung der Zahlen-Klassen auf Hanken haette die
gleichmaessige Ziffernbreite (Telefon, Fakten, Specs) verloren. Keine Datei, keine `@font-face`,
keine `OFL-archivo.txt`, keine Verweise entfernt; keine Tests angepasst (kein Archivo-Abbau).

## 3. Logo-Befund (kein weisser Rand/Flaeche/Rahmen/Kasten)

- Die Logo-Dateien sind **transparent** (PIL: `logo-48/96/144.png` und `.webp` haben 0 % opakes
  Weiss und 60–66 % voll transparente Flaeche, alle Ecken transparent). Die Bilddatei hat also
  **keinen** weissen Rand und keine weisse Flaeche — kein Beschneiden/Ersetzen noetig.
- Verwendung: Das Logo kommt **nur** im Kopf (`src/components/Kopf.astro`) vor. `Fuss.astro`
  fuehrt kein Logo (nur Text). Es gibt **kein** `/admin/` (weder `src/pages` noch `public/admin`).
- CSS: `.kopf__marke img` hat **keinen** Hintergrund, keinen Rahmen, kein Kaestchen.
- Bildschirmfotos bestaetigen: Logo liegt direkt auf heller Kopf-/Papierflaeche, kein weisser
  Kasten — auf `/` (`11b-logo-kopf-desktop.png`, `11b-logo-kopf-handy.png`) und auf `/tesla/`
  (`11b-tesla-kopf-*.png`). Fuss ohne Logo: `11b-logo-fuss-desktop.png`.

## 4. Kopf auf /tesla/ (dunkle Unterseite) — Lesbarkeit

- `body[data-seite="tesla"] .kopf:not(.ist-unten)` traegt von Anfang an eine helle
  Papierflaeche (`rgba(250,248,245,.9)` + Blur + 1px-Linie). Dadurch stehen das **dunkle Logo**,
  die **Navigation in Tinte** und der **blaue Knopf «Schaden melden»** (weisse Schrift,
  Blau `#1566b8`, ~5.2:1, AA) auf hellem Grund.
- Pruefung per Bildschirmfoto (Desktop `11b-tesla-kopf-desktop.png`, Handy
  `11b-tesla-kopf-handy.png`): Navigation, Logo und Knopf gut lesbar, Kontrast AA erfuellt.
- **Keine Aenderung noetig.**

## 5. Fotoregel — geprueft, Gesichter nur /team/ + Team-/Inhaber-Bereich

Jedes verwendete Bild angesehen (Montage + Zoom, PIL). «verwendet» = tatsaechlich in
`src/pages`/`src/components` referenziert. `bilder.json` existiert nicht in dieser Linie.

| Bild | wo verwendet | Gesicht erkennbar? | Massnahme |
|---|---|---|---|
| `stock/b1-hero` | Hero (Start) | nein (Haende in Handschuhen) | keine |
| `stock/b7-tesla` | Tesla-Teil (Start) | nein (Scheinwerfer) | keine |
| `felge-schaden`, `felge-fertig` | Vergleich (Start), Leistungen | nein | keine |
| `hebebuehne` | Leistungen (Kopfbild) | nein | keine |
| `abgeklebt` | Leistungen (Unfall) | nein (roter Transporter) | keine |
| `dellen` | Leistungen (Hagel) | **nein** — Person **von hinten** (Hinterkopf/Kappe), kein erkennbares Gesicht | keine (siehe Hinweis) |
| `werkstatt` | Leistungen (Scheiben) | nein | keine |
| `transporter` | Leistungen, Flotten | nein | keine |
| `lackierkabine` | Leistungen (Lack) | nein (Vollschutz + Atemmaske, abgewandt) | keine |
| `ferrari-streifen` | Leistungen (Folie) | nein | keine |
| `felge-gold`, `felge-pink` | Leistungen (Felgen) | nein | keine |
| `defender-folie`, `defender-seite` | Leistungen (Folie) | nein | keine |
| `fassade` | Kontakt, Occasionen (Kopfbild) | nein (Gebaeude) | keine |
| `team-kabine` | **/team/** (Kopfbild) | ja | erlaubt (Team-Bereich) |
| Portraets `bilder/team/*.webp` | **/team/** | ja | erlaubt (nur mit Einverstaendnis) |

**Nicht verwendet** (liegen nur im Ordner, in keiner Seite referenziert): `defender-kabine`,
`dellen-zug` (klares Gesicht), `felge-markiert`, `kaefer`, `lackkante`, `maserati`, `politur`,
`team-buero`, `team-lack`, `team-politur`, `team-rad` (letztere vier mit Gesicht). Da nicht
eingebunden, keine Massnahme noetig; sie erscheinen nirgends ausserhalb des Team-Bereichs.

**Platzhalter mit Personen ausserhalb des Team-Bereichs:** keine gefunden. Die einzigen
Personen-Platzhalter (`Inhaber.astro`, B8 Portraet/Teamband) liegen im Inhaber-/Team-Bereich
der Startseite — dort sind Gesichter erlaubt, der Hinweis «ohne Gesicht» ist nicht anzubringen.
Der Occasionen-Platzhalter zeigt eine Liste, keine Person.

**Ergebnis: kein erkennbares Gesicht ausserhalb /team/ und des Team-/Inhaber-Bereichs.**
`dellen` zeigt eine Person von hinten (kein erkennbares Gesicht) und bleibt; keine Ersetzung
noetig, es wurde nichts aus dem Internet geladen.

## 6. Menue-Dialog — Keyframes → Transition (3.12)

- `@keyframes blattRein` entfernt. Stattdessen Transition auf **transform + opacity** mit
  **gleicher Dauer (0.3 s) und Kurve (`cubic-bezier(.2,.7,.2,1)`)** wie der fruehere Zeiger.
  Umgesetzt mit `@starting-style` (Eintritt) und `.blatt:not([open])` sowie
  `transition: … , overlay .3s allow-discrete, display .3s allow-discrete` fuer den
  `<dialog>`-Top-Layer. **Kein** Animieren von Schatten oder Blur.
- **Reduced Motion:** Die globale Regel `*{…transition:none!important}` schaltet den Weg ab —
  der Dialog erscheint/verschwindet ohne Bewegung.
- **Hover nur in `@media (hover: hover)`**: `.blatt__zu:hover` und `.blatt a:hover` dorthin
  verschoben.
- **Tastatur/Escape** funktionieren weiter: nativer `<dialog>` mit `showModal()`/`close()` in
  `klar.js` (unveraendert), Escape schliesst, Fokusfalle durch `showModal()`.

## 7. Pruefergebnisse

- `npm run build`: **gruen** (13 Seiten gebaut).
- `npm test`: **gruen**, 47/47 (inkl. CSP ohne unsafe-inline, kein Inline-Skript/`on…`,
  de-CH ohne ß, alle Seiten ohne Konsolenfehler). Keine Tests mussten wegen Archivo angepasst
  werden (Archivo bleibt).

## Offene Punkte
- **`/tmp/schritt-11.txt` war in dieser Umgebung nicht lesbar** (Sandbox erlaubt nur das
  Arbeitsverzeichnis). Die dort vermuteten offenen Punkte daher nach der Aufgabenstellung:
  - **`bewegung.test.mjs`** — nicht erstellt/angefasst (existiert nicht im `test/`-Ordner). **offen.**
  - **Lighthouse `lh-11`** — nicht erzeugt (nur `lh-00.json`, `lh-03.json` vorhanden). **offen.**
  - **`bewegung.md`** — nicht erstellt. **offen.**
- Inhaltliche Platzhalter aus frueheren Schritten (Hero «seit Oktober», Inhaber-Zitat,
  Tesla-Ablauf als Entwurf, Shooting-Fotos) bleiben wie markiert — ausserhalb dieses Schritts.
