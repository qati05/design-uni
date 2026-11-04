# Schritt 04 · Partnerband

Stand: 03.11.2026. Entwurf C, BAUPLAN 2 Zeile 4, 3.9.

## 1. Geaendert
- **`src/components/Partnerband.astro`** (neu): schlanke Kopie des Laufbands aus `../../../astro/src/components/Partnerband.astro` (Kommentar-Verweis). Gleiche Logik: Liste doppelt fuer die nahtlose Schleife, Dauer ueber `style="--dauer"`, Kopien `aria-hidden`. C-Zusatz: Label «Zertifizierte Partner», Text/Logo-Schalter, Pausieren-Knopf. Ein reiner Import genuegt nicht, weil die astro-Komponente diese drei Dinge nicht kennt.
- **`src/pages/index.astro`**: `<Partnerband titel="Zertifizierte Partner" />` direkt unter `<Faktenleiste />`.
- **`public/css/klar.css`**: Abschnitt `.partner` (Label links, Knopf rechts), Textvariante `.partnerband__name` (Archivo), Laufband auf C-Tokens (`--linie`, `--akzent`, `--farbe`, `--feder-ruhig`). `.partnerband.ist-pausiert .partnerband__spur { animation-play-state: paused }`. Reduced Motion: Band steht, `.partner__pause { display: none }`.
- **`public/js/klar.js`**: Pausieren-Logik (BAUPLAN 3.9): Klick toggelt `.ist-pausiert`, setzt `aria-pressed` und den Text «Anhalten»/«Weiter». Vor dem `return` der Erscheinen-Schicht eingehaengt.
- **`test/browser.test.mjs`**: zwei Tests ergaenzt.

## 2. Schalter PARTNER_LOGOS
- Vorgabe (ohne Variable): **Partnernamen als Text** in Archivo. Mit `PARTNER_LOGOS=1`: Logos aus `/bilder/partner/` wie im Entwurf.
- **`rechte.md` sagt zu den Partnerlogos «nein, nur als Text»** (Markenrechte der Inhaber). Der Konflikt mit Entwurf C wird nicht aufgeloest, nur ueber den Schalter abgebildet; Vorgabe bleibt Text.

## 3. Pruefungen
| Pruefung | Ergebnis |
|---|---|
| `npm run build` (ohne PARTNER_LOGOS) | bestanden, 13 Seiten, Text im Band |
| Build mit `PARTNER_LOGOS=1` | bestanden, 4 Partnerlogos im Band |
| `npm test` (18 Tests) | **gruen** |
| impeccable (geaenderte Dateien) | nur 1 advisory, **nicht** aus Schritt 04 (siehe 4) |

Neue Tests:
- «Partnerband: Pausieren-Knopf haelt das Laufband an»: `animationPlayState` running → nach Klick `paused` (+ `aria-pressed=true`, Text «Weiter»), zweiter Klick wieder `running`.
- «Partnerband unter Reduced Motion: Band steht, kein Knopf»: `animation-name: none`, Pausieren-Knopf nicht sichtbar.
- Kein CSP-Fehler (vorhandener Test «Alle Seiten laden ohne Konsolenfehler»). `style="--dauer"` ist durch `style-src 'unsafe-inline'` gedeckt; `script-src` bleibt ohne `'unsafe-inline'`.

## 4. impeccable
Eine advisory: `klar.css:428` «decorative grid-line background» am `.tesla::before` (Datenblatt-Raster, Schritt 02) — **ausserhalb** von Schritt 04, unveraendert. Die bekannte Laufband-Meldung kam in diesem Lauf nicht.

## 5. Screenshots
`vorschau/c/04-start-{desktop,desktop-ganz,handy,handy-ganz}.png` (nur `/`, Tempo-Vorgabe). Aufnahmen laufen wie bisher mit `reducedMotion: reduce` (`bau/fotos-c.mjs`): das Band steht, der Pausieren-Knopf ist ausgeblendet — die Reduced-Motion-Fassung.

## 6. Offene Punkte
- Partnerlogos vs. `rechte.md`: offen (BAUPLAN 6, Punkt 2), ueber den Schalter abgebildet, Vorgabe Text.
