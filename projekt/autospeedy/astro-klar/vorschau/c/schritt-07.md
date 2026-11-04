# Schritt 07: Vorher/Nachher

## Geändert
- **`src/pages/index.astro`**: Abschnitt «Vorher, nachher.» im C-Stil neu, direkt **nach `<Leistungen />`** (vor `<Anfrage />`, BAUPLAN 2 Zeile 6). Alte, im alten `.abschnitt`-Stil eingebettete Vorher/Nachher-Sektion (nach Tesla) entfernt. Bilder `felge-schaden` (vorher) / `felge-fertig` (nachher) aus `bilder.json`, figcaption «Beispielbilder, gleicher Blickwinkel folgt vom Shooting».
- **`src/components/Vergleich.astro`**: neue Prop `caption` (C-Rahmen mit Bildunterschrift). Ohne `caption` bleibt die bestehende Hilfe-Zeile (Unterseite `/leistungen/` unverändert). `input type=range`, `data-vergleich`, `aria-valuetext` beibehalten.
- **`public/css/klar.css`**:
  - `.vorher-nachher`: C-Abschnitt mit Haarlinie (`border-bottom`), Titel `.titel`, kurzer Satz, Rahmen **3:2 (Desktop) / 1:1 (≤560px)**, `object-fit: cover`, ohne Schatten, figcaption 13 px `--leise`.
  - Regler nach BAUPLAN 3.8: `--pos` von Prozent auf **Zahl** (`@property <number>`, clip-path `* 1%`), Linie und Griff über **`transform: translateX(calc(var(--pos) * 1cqi))`** statt `left` (`container-type: inline-size` an der Bühne, kein Layout-Lesen pro Frame).
  - Nachführen je Eingabe: `data-quelle="maus"` → `--pos 120ms var(--aus)`; `"touch"` → `transition: none`; `"taste"`/`"tipp"` → `var(--feder-regler-dauer) var(--feder-regler)`. Hinweis-Keyframe 50→42→56→50, 1.6 s `--feder-weich`. Griff 44×44, Hover/Fokus `scale(1.08)`, Ziehen (`.ist-zieht`) `scale(.94)`. Reduced Motion: `.vergleich[data-quelle] { transition: none }`.
- **`public/js/klar.js`** (Regler-Block): Pointer-Updates per `requestAnimationFrame` gebündelt (mit Flush bei `pointerup`). Touch folgt 1:1, Tippen springt (`"tipp"`). Tastatur: Pfeil ±5, Bild auf/ab ±10, Pos1/Ende 0/100 (`keydown`, `preventDefault`, `"taste"`). `setPointerCapture`/`touch-action: pan-y` beibehalten. Hinweis: einmal bei 60 % Sichtbarkeit, nur solange unberührt; jede Eingabe bricht ihn ab (`hinweisWeg`), kein Hinweis bei Reduced Motion.
- **`test/browser.test.mjs`**: 3 neue Tests (Touch ohne Transition + `data-quelle=touch`; Tastatur mit `linear()`-Kurve 340 ms + `data-quelle=taste`; Hinweis läuft bei 60 % und bricht bei Eingabe ab).

## Prüfungen (grün)
- `npm run build`: 13 Seiten, keine Fehler.
- `node --test test/statisch.test.mjs`: 6/6.
- `node --test test/browser.test.mjs`: **21/21** (18 bestehende weiter grün + 3 neue).

## Offen
- Echte Vorher/Nachher-Fotos derselben Felge vom selben Standpunkt (Fototag); bis dahin Platzhalter-Bilder, figcaption weist darauf hin.

## Screenshots
`vorschau/c/07-start-{desktop,desktop-ganz,handy,handy-ganz}.png`

## Hinweis
Nicht committet (ungestaged); Commit macht der Bauleiter nach der Durchsicht.
