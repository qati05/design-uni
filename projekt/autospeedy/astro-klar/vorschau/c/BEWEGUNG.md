# Bewegung – flüssiger auf dem Handy (Plan für Claude Code)

Anlass: Reshat (iPhone): «nicht flüssig bei Buttons, z. B. Formular und Navigation auf dem Handy».
Ziel: ruhige, hochwertige Mikrobewegung (Stripe/Apple/Linear), nicht verspielt. Nur eigenes CSS + `klar.js`/`schaden.js`,
keine Bibliothek, kein Motion+, CSP ohne Inline-JS bleibt. Schweizer Schreibweise (ss).

Messung 04.11.2026 (Chrome-Emulation iPhone 390×844, Touch, DPR 3), Belege in
`/workspace/agency/autospeedy-moods/bewegung/` (`rundgang-handy.mp4`, `menu-zeitlupe-3x.mp4`, Bilder `00`–`14`).
Lange Tasks: keine. Frames Menü öffnen: 3 von 41 über 20 ms (max. 33 ms).

## Befund

Geordnet nach Wirkung. «css» = `public/css/klar.css`.

1. **Startseite wackelt seitlich (dringend, kein Motion-Thema, aber spürbar).** Layout-Breite 441 px statt 390 px.
   Ursache: `css:1106–1110` (`.karten a { grid-template-columns: 1fr 38px }`, `.karten p/.pfeil { grid-column … }`)
   steht nach `css:1065` und überschreibt das Handy-Raster der Bildkarten (`.karten--bild a: 88px 1fr 38px`).
   Titel landen in der 38-px-Pfeilspalte und ragen hinaus (Bild `00-leistungskarten-handy.png`). Folge: Seite lässt sich
   seitlich schieben, Hamburger liegt teilweise ausserhalb (x 377–421), Kopf und Leiste sind 441 px breit.
   `/flotten/` ist ebenfalls 1560 px breit (separat prüfen).
2. **Kein Tipp-Feedback auf iOS.** Nirgends `-webkit-tap-highlight-color` (Standard-Grau/Blau blitzt, im Video bei
   «Schliessen» sichtbar) und kein `touch-action: manipulation`. iOS setzt `:active` nur zuverlässig, wenn ein
   `touchstart`-Listener existiert – den gibt es nicht (`public/js/klar.js`). Ergebnis: Federknopf `css:366–367`
   (`.k:active scale(.97)`) und `css:1040` (`.knopf:active scale(.96)`) greifen am iPhone oft nicht; im Test blieb der
   Haupt-CTA beim Halten auf `transform: none`.
3. **Menü schliesst auf iOS hart.** `css:170–175` blendet das `<dialog>` über `overlay … allow-discrete` aus. Safari
   kennt `overlay` nicht: beim `close()` (`klar.js:121`) fällt das Blatt sofort aus der obersten Ebene, die
   200-ms-Ausblendung ist nicht zu sehen. Backdrop (`css:176`) springt ebenfalls.
4. **Hamburger→X ist unsichtbar.** Das Blatt (360 px) deckt den Hamburger ab (Messung: Element über dem Knopf =
   `.blatt__zu`). Die Feder-Animation `css:163–169` läuft hinter dem Blatt. Schliessen ist ein Textknopf «Schliessen»
   (`Kopf.astro:22`, `css:192`) an anderer Stelle – kein durchgehender Bewegungsfaden.
5. **Hintergrund scrollt bei offenem Menü.** Keine Scroll-Sperre (`html/body overflow: visible`, gemessen: Seite
   scrollt hinter dem Blatt). Auf iOS Gummiband-Effekt durch das Blatt hindurch.
6. **Formular springt statt gleitet.** `schaden.js:30` schaltet Schritte über `hidden` (display:none), nur der Eintritt
   animiert (`css:1127`, 240 ms). Gleichzeitig `f.scrollIntoView({ block: "start" })` ohne Glätten (`schaden.js:35`):
   gemessen 424 px Sprung beim Tippen auf eine Art. Dazu ein Layout-Sprung des Fusses (Layout-Shift 0.29, Quelle `.fuss`).
   Fehler: Fokus springt 761 px nach oben (`schaden.js:206`), Erfolg ebenso hart (`schaden.js:237`).
7. **Ein-/Ausklappen ohne Übergang.** Ersatzwagen-Unterfrage (`schaden.js:54`, +77 px), Tesla-Modell (`schaden.js:46`),
   Fehlertexte werden eingefügt (`schaden.js:74`), `details` «Stelle genauer» und «zur Hand» (`css:264`, `css:309`)
   klappen schlagartig. Inhalt darunter springt.
8. **Kachel-, Chip- und Schalter-Antwort ist flach.** `.art` `css:255–257` und `css:480–482` (zwei Regeln, .97/.98,
   `.15s ease-out` bzw. `--sanft`), Chips `css:237–239` (`.15s ease-out`), Schalter-Knopf `css:283` (`transform .2s`
   Standardkurve). Kein federndes Loslassen wie beim CTA; gewählte Art bekommt grossen Schatten ohne Übergang (`css:261`).
9. **Senden ohne Ladezustand.** `schaden.js:264` setzt nur `disabled` + Text «Wird gesendet …». Kein Stil für
   `[disabled]`/`[aria-busy]` in css, kein Spinner; Knopf wirkt eingefroren.
10. **Kopf animiert Höhe.** `css:143` `transition: height .26s` beim Scrollen (Layout pro Frame). Schwelle 80 px
   (`klar.js:13`), Kommentar sagt 8 px.
11. **Viel `backdrop-filter` auf grossen, fixen Flächen.** Kopf immer milchig auf Start/Tesla (`css:407`, `css:410`,
   blur 14), Handyleiste (`css:336`, blur 14), Glasknöpfe (`css:113`, `css:371`), Kacheltext (`css:811`). Zwei
   unscharfe Fixflächen gleichzeitig sind auf iPhone der häufigste Grund für ruckeliges Scrollen.
12. **Menü-Links ohne Druckzustand.** `.blatt a` (`css:193`) und `.kopf__menu` (`css:153`) haben nur Hover
   (am Handy wirkungslos), kein `:active`. Menü wird bei Link-Tipp nicht geschlossen – nach «Zurück» (bfcache) kann es
   offen wieder erscheinen.
13. **Kleinigkeiten.** Hover ohne Schutz: `css:420` (`.hinweis__zu:hover`), `css:467` (`.partnerband:hover` pausiert
   nach Tipp dauerhaft). Viele Hover nur unter `(hover: hover)` statt `(hover: hover) and (pointer: fine)`.
   Doppelte `.k`-Grundregel (`css:111` und `css:364`). Fortschrittsbalken nur Farbwechsel (`css:248`).

In Ordnung und zu behalten: Scroll-Listener sind `passive` (`klar.js:14`, `:101`), nur `transform`/`opacity` bei
Knöpfen, `prefers-reduced-motion` vorhanden (`css:1135`), Fokusring `:focus-visible` (`css:83`, `css:386`),
Felder 16 px (kein iOS-Zoom), keine `transition: all` in klar.css, Erfolgs-Häkchen zeichnet sich (`css:317`).

## Spezifikation

### 0. Zuerst reparieren (Befund 1)
- In `css` den Handy-Block `@media (max-width: 720px)` so ordnen/schärfen, dass `.karten--bild a` sein Raster
  `88px 1fr 38px` behält: Regeln ab `css:1106` auf `.karten:not(.karten--bild) a` (bzw. `p`, `.pfeil`, `h3`) begrenzen.
- Abnahme: auf `/`, `/leistungen/`, `/flotten/` gilt `document.documentElement.scrollWidth === 390` bei 390 px.

### 1. Bewegungs-Tokens (in `:root`, bestehende Federn bleiben)
```css
--dauer-tipp: 90ms;      /* Druck hinein (= --druck) */
--dauer-kurz: 140ms;     /* Farbe, Rand, kleine Zustände */
--dauer-mittel: 260ms;   /* Menü zu, Schritt hinaus, Ausklappen */
--dauer-lang: 380ms;     /* Menü auf, Schritt hinein, Erfolg */
--feder: cubic-bezier(.34, 1.56, .64, 1);  /* Loslassen, leichter Überschwinger (Fallback zu --feder-knopf) */
--sanft: cubic-bezier(.22, 1, .36, 1);     /* ersetzt das bisherige --sanft (.22,.8,.24,1) */
--hinein: cubic-bezier(.2, 0, 0, 1);       /* Druck, schnell */
--hinaus: cubic-bezier(.4, 0, 1, 1);       /* bleibt */
--druck-skala: .97;
```
Regel: `--feder-knopf` (linear()) bleibt die erste Wahl fürs Loslassen; `--feder` ist der `@supports`-Fallback (statt `--aus`).

### 2. Touch-Grundlage (einmal, global)
```css
html { -webkit-tap-highlight-color: transparent; }
a, button, label, summary, input, select, textarea, [role="button"] { touch-action: manipulation; }
```
- `klar.js`, ganz oben: `document.addEventListener("touchstart", function () {}, { passive: true });`
  (aktiviert `:active` auf iOS). Kein anderer Touch-Listener nötig.
- Alle Hover-Regeln einheitlich unter `@media (hover: hover) and (pointer: fine)`; `css:420` und `css:467` dazunehmen.
- Kein Ersatz-Feedback über Tap-Highlight: das `:active`-Drücken ist das Feedback.

### 3. Knöpfe (`.k`, `.knopf`, Handyleiste, Formularknöpfe)
- Eine Grundregel statt zwei (`css:111` in `css:364` aufgehen lassen).
- Ruhe: `transition: transform var(--feder-knopf-dauer) var(--feder-knopf), background-color var(--dauer-kurz) linear, color var(--dauer-kurz) linear;`
- `:active`: `transform: scale(var(--druck-skala)); transition-duration: var(--dauer-tipp); transition-timing-function: var(--hinein);`
  → schnell hinein, federnd hinaus (Feder nur beim Loslassen).
- Hover nur fein: Farbe + `translateY(-1px)`; Schatten nicht animieren – stattdessen zweiten Schatten auf `::after`
  legen und nur dessen `opacity` überblenden.
- `:focus-visible`: Ring sofort (ohne Transition), 2 px `--blau`, Abstand 3 px; auf Akzentflächen weisser Innenring (wie heute).
- `[disabled]`, `[aria-busy="true"]`: `cursor: default; opacity: .7; transform: none;` kein Hover/Active.
- Kleinste Trefferfläche 44×44 bleibt.

### 4. Handy-Menü (`Kopf.astro`, `css:159–200`, `klar.js:109–124`)
- **Schliessknopf im Blatt** = gleiches Hamburger-Symbol im X-Zustand, exakt an der Position des Hamburgers
  (oben rechts, 44×44, gleiche `top` wie Kopf). Text «Schliessen» nur als `aria-label`. Beim Öffnen dreht das X
  sichtbar ein (Striche: `transform` 260 ms `--feder-ruhig`, Mittelstrich `opacity` 120 ms).
- **Öffnen:** `showModal()`, Blatt `translateX(24px) → 0` + `opacity 0 → 1`, `--dauer-lang` `--feder-ruhig`;
  Backdrop `opacity 0 → 1` 200 ms linear (Farbe `rgba(22,25,29,.28)`, **ohne** `backdrop-filter`).
  Links gestaffelt 35 ms (`translateX(8px)`, `opacity`), max. 6 Stufen; Fuss (Telefon) mit letzter Stufe.
- **Schliessen (Safari-fest, ohne `overlay`):** in `klar.js` `blatt.classList.add("ist-zu")` → CSS animiert
  `translateX(24px)` + `opacity 0` in `--dauer-mittel` `--hinaus`, Backdrop mit; dann bei `animationend`
  (Fallback `setTimeout` 300 ms) `blatt.close()` und Klasse entfernen. `overlay`/`allow-discrete` aus `css:173–175` entfernen.
  Unter Reduced Motion sofort `close()`.
- **Auslöser zum Schliessen:** X-Knopf, Esc (`cancel`-Ereignis abfangen, `preventDefault()`, eigene Schliessung),
  Tipp auf Backdrop, Tipp auf Link (erst schliessen-starten, Navigation sofort zulassen), `pageshow` mit `persisted`
  → Blatt geschlossen.
- **ARIA:** `aria-expanded` am Hamburger wie heute über `menuStand()`; Fokus nach Schliessen zurück auf Hamburger.
- **Scroll-Sperre ohne Sprung:** `html:has(.blatt[open]) { overflow: hidden; }` + `html { scrollbar-gutter: stable; }`
  (Desktop kein Breitensprung) + `.blatt { overscroll-behavior: contain; }`. Kein `position: fixed` am body.
- **Druckzustand Links:** `.blatt a:active { background: var(--flaeche); transform: scale(.985); }` 90 ms hinein,
  Feder hinaus. Hamburger `:active` `scale(.92)`.

### 5. Formular «Schaden melden» (`schaden-melden.astro`, `schaden.js`, `css:226–320`, `css:1127`)
- **Felder:** Rand `border-color` + Ring über `box-shadow` sofort sichtbar; nur `border-color` 140 ms überblenden.
  Label bleibt stehen (kein Floating-Label).
- **Art-Kacheln** (`.art`): eine Regel statt zwei (`css:255–262` und `css:480–482` zusammenführen).
  `:active` `scale(.97)` 90 ms `--hinein`, Loslassen `--feder-knopf`. Gewählt: Hintergrund/Text 140 ms; der blaue
  Schatten auf `::after` legen und nur `opacity` blenden. Wartezeit bis Schritt 2 (`schaden.js:91`) auf 260 ms,
  damit die Wahl sichtbar «einrastet».
- **Chips:** wie Kacheln (Feder beim Loslassen), Häkchen-/Farbwechsel 140 ms.
- **Schalter:** Knopf `transform` `--feder-knopf-dauer` `--feder-knopf`; Bahn-Farbe 140 ms; beim Drücken
  Knopf leicht breiter (`scaleX(1.12)`, Ursprung je Seite), wie iOS.
- **Schrittwechsel:** alter Schritt hinaus (`opacity 0`, `translateX(-12px)`, 160 ms `--hinaus`), dann neuer hinein
  (`translateX(12px) → 0`, 260 ms `--sanft`); Zurück spiegelt die Richtung (`data-richtung="zurueck"`).
  Steuerung in `schaden.js` über Klassen + `animationend`; `hidden` erst nach dem Hinaus setzen.
  Scrollen nur wenn der Formularkopf ausserhalb des Bildes liegt, dann `scrollIntoView({ block: "start", behavior: ruhig ? "auto" : "smooth" })`.
  Formularhöhe während des Wechsels halten (Mindesthöhe = alte Höhe, danach lösen), damit der Fuss nicht springt.
- **Fortschritt:** Balken pro Schritt als `::after` mit `transform: scaleX(0→1)` (Ursprung links, 320 ms `--sanft`)
  statt reinem Farbwechsel.
- **Ausklappen** (Ersatzwagen-Tesla, Tesla-Modell, `details`): Inhalt `opacity 0→1` + `translateY(-4px)→0` 200 ms.
  Höhe nicht animieren (Safari kennt `interpolate-size` nicht) – Inhalt darunter darf einmal ruhig nachrücken.
  Für `details` `::details-content` nur dort einsetzen, wo unterstützt (`@supports selector(::details-content)`).
- **Fehler:** kein Schütteln. Fehlertext-Platz vorab reservieren nicht nötig; Text blendet 140 ms ein.
  Fokus auf erstes Fehlerfeld mit `preventScroll: true` und danach weichem `scrollIntoView({ block: "center" })`.
  Zusammenfassende Meldung bleibt `role="alert"`.
- **Senden/Ladezustand:** Knopf behält Breite (Text nicht ersetzen, sondern zweiten Span einblenden): Text `opacity .0`,
  Spinner (CSS-Ring, `rotate` 800 ms linear unendlich) `opacity 1`; `aria-busy="true"`, `disabled`.
  Upload-Balken wie heute (`scaleX`), Transition 200 ms `--sanft`.
- **Erfolg:** Formular hinaus (160 ms), Karte hinein (`translateY(8px)→0`, `opacity`, 320 ms `--sanft`),
  Häkchen-Kreis `scale(.8)→1` mit `--feder-knopf`, danach Pfad zeichnen (wie heute). Weiches Scrollen zum Kartenkopf.

### 6. Karten und Links
- Leistungskarten: am Handy `:active` = Zeilenfläche kurz `--flaeche` + Pfeil `translateX(3px)` (heute nur Pfeil).
- Textlinks: Pfeil `translateX(4px)` nur fein; Unterstreichung über `text-decoration-color` 140 ms.
- Kopf: Höhe nicht animieren. Variante: Höhe fix 64 px, beim Scrollen nur Hintergrund/Linie (Deckkraft) und
  Logo `scale(.9)` per `transform`. Schwelle in `klar.js:13` und Kommentar angleichen.

### 7. Performance-Regeln (verbindlich)
- Animiert werden nur `transform` und `opacity` (Ausnahmen: Farbe/Rand ≤ 140 ms). Nie `height`, `top`, `left`,
  `width`, `box-shadow`, `filter`, `backdrop-filter`.
- Kein `transition: all` (auch künftig nicht; `rg "transition: all"` muss leer sein).
- `will-change` nur während einer Animation (per Klasse setzen und entfernen), nie global.
- `backdrop-filter` am Handy höchstens auf **einer** Fixfläche gleichzeitig: Handyleiste deckend
  (`rgba(250,248,245,.97)`, ohne Blur) oder Kopf ohne Blur – Empfehlung: beide am Handy deckend, Blur nur ab 961 px.
  Kein Blur am Menü-Backdrop.
- Keine neuen Scroll-/Touch-Listener ausser dem leeren passiven `touchstart`; Layout-Lesen nicht in Scroll-Handlern.

### 8. Reduced Motion
- Bestehenden Block `css:1135` behalten. Ergänzen: Menü öffnet/schliesst ohne Weg (nur `opacity` 0 ms = sofort),
  `klar.js`/`schaden.js` überspringen `animationend`-Warten (`ruhig`-Schalter), Scrollen `behavior: "auto"`,
  Spinner dreht nicht (stattdessen pulsierende Deckkraft aus – nur Text «Wird gesendet …»).

### 9. Ohne JavaScript
- Menü: Hamburger ohne JS bleibt nutzbar → Fallback-Link «Menü» auf `/#fuss` oder `<nav>` im Fuss (heute prüfen).
- Formular ohne JS: alle Schritte untereinander, mailto-Knopf (wie heute), keine versteckten Teile.

## Abnahme (Testkriterien)
1. 390×844, iPhone-Emulation: `scrollWidth === 390` auf allen Seiten; Hamburger vollständig im Bild.
2. Playwright-Video: Menü auf/zu, CTA, Formular 1→2→3→Fehler→Erfolg; kein sichtbarer Sprung, Schliessen sichtbar animiert.
3. Frames während Menü auf/zu und Schrittwechsel: ≥ 95 % unter 17 ms (rAF-Messung), keine Long Tasks > 50 ms.
4. CLS ohne Eingabe = 0; Schrittwechsel ohne Fuss-Sprung (Layout-Shift-Quelle `.fuss` kommt nicht mehr vor).
5. Gehaltener Touch auf CTA, Art-Kachel, Chip, Menü-Link: berechnetes `transform` ≠ `none` (Skalierung sichtbar).
6. `getComputedStyle(a).webkitTapHighlightColor` = transparent, `touchAction` = `manipulation` an Knöpfen/Links.
7. Menü: Hintergrund scrollt nicht; Esc, X, Backdrop, Link-Tipp schliessen; `aria-expanded` stimmt; Fokus zurück auf Hamburger.
8. `prefers-reduced-motion: reduce`: keine Bewegung, alle Zustände erreichbar, Formular sendbar.
9. JS aus: Navigation und Formular (mailto) funktionieren.
10. `rg "transition: all|transition: height|transition:.*box-shadow" public/css/klar.css` leer; `npm test` grün,
    CSP-Test grün (kein Inline-Script/-Style-Attribut neu).
11. Echt-Test auf iPhone (Safari) durch Reshat: Menü, Formular, CTA – «fühlt sich ruhig und federnd an».

Nicht ändern: Inhalte, Farben, Typografie, Hero-Einstieg, Vorher-nachher-Regler, Partnerband.
