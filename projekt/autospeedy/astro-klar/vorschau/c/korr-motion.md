# Korrektur Motion – Entwurf C (Bericht)

Vorbild: Stripe – ruhig, kurz, federnd. Alle Bewegung nur über `transform`/`opacity`
(Ausnahme Foto-Zoom 600 ms), jede Bewegung ≤ 450 ms, pro Bildschirm bewegt sich eine Sache,
`prefers-reduced-motion: reduce` = keine Bewegung (Zustände springen). Kein Inline-JS (CSP ohne
`unsafe-inline`), de-CH ohne Eszett. Keine neue Bibliothek, keine Datenbank. Die Hero-Korrektur und
die Ergebnisse der Schritte 11–15 bleiben unberührt.

Geänderte Dateien: `public/css/klar.css`, `public/js/klar.js`, `src/components/Kopf.astro`.

## Umgesetzt

1. **Handy-Menü (Hamburger).** Der Knopf «Menü» ist jetzt ein Hamburger-Symbol (drei Striche),
   Trefferfläche 44×44 px, `aria-label` «Menü öffnen»/«Menü schliessen» und `aria-expanded`
   (in `klar.js` gespiegelt). Beim Öffnen federn die Striche zu einem X (`--feder-ruhig`, nur
   `transform`/`opacity`). Das Blatt kommt ruhig von rechts; die Links erscheinen leicht gestaffelt
   (30 ms Abstand, 8 px Versatz) über `@starting-style`. Öffnen 320 ms (`--feder-ruhig`), Schliessen
   kürzer 200 ms (`--hinaus`). Fokusfalle und Esc liefert das `<dialog>` selbst; das `close`-Ereignis
   setzt `aria-expanded` auch bei Esc/Backdrop zurück.
2. **Federknöpfe.** Die CTA-Klasse `.k` gibt beim Drücken nach (`scale .97`, `--druck`) und federt
   beim Loslassen zurück (`--feder-knopf`). `.knopf`/`.karten` hatten das bereits. Der Pfeil («Schaden
   melden →» im Menü, `.k--pfeil`) rutscht bei Hover 4 px nach rechts, nur bei feinem Zeiger. Haupt-CTA
   bleibt gefüllt (nie Ghost).
3. **Anrufleiste Handy.** Zusätzlich zur bestehenden Logik (nach dem Hero an, im Schluss/Fuss aus, bei
   Feldfokus aus) versteckt sie sich jetzt beim Runterscrollen ab 200 px (`translateY(110%)`, 200 ms
   `--hinaus`) und kommt beim Hochscrollen sofort zurück (`--feder-ruhig`). Bei Feldfokus wird nie
   versteckt (`klar.js` setzt `body.leiste-ab`).
4. **Kopfleiste.** Ab 8 px Scroll (vorher 24 px) wird sie schmaler (Höhe 64→52 px; `--kopf` bleibt
   konstant, dadurch kein Layoutsprung, da fix positioniert) und leicht milchig (`backdrop-filter`,
   Fallback deckend über `@supports`). Nav-Kontrast bleibt AA.
5. **Einblenden.** Unverändert: nur Fotos (`.foto-ein`) und der Tesla-Ablauf blenden ein; Texte/Sektionen
   nicht. (BAUPLAN 3.15, bereits umgesetzt.)
6. **Zahlen.** Kein Hochzählen; Faktenleisten-Werte blenden beim ersten Sichtbarwerden einmal weich ein
   (`leiste-ein`, bereits vorhanden).
7. **Formular.** Fokus = feiner Rand in `--akzent` (150 ms), Erfolgs-Häkchen zeichnet sich
   (`stroke-dashoffset`, 400 ms), Fehler ohne Wackeln. (Schritt 12, unverändert.)
8. **Fotos.** Zoom im Rahmen (`overflow: hidden`) nur mit Maus; bestehende Kachel-/Team-Behandlung
   beibehalten. Nicht am Vergleich-Regler.
9. **Vorher-nachher-Regler.** Die Linie folgt der Maus jetzt mit weichem Nachlauf: Lerp pro Frame via
   `requestAnimationFrame` (0.18/Frame), nur `transform`/clip, kein Layout-Lesen pro Frame. Beim
   Verlassen des Bildes bleibt die Linie stehen (`pointerleave` stoppt den Lauf). Touch 1:1 ohne
   Nachlauf, Tastatur/Tippen springen mit `--feder-regler`, unter Reduced Motion springt auch die Maus.
   Der Griff vergrössert sich bei Hover/Fokus auf `scale(1.1)` (vorher 1.08), Hover nur bei feinem Zeiger.

## Reduced Motion

Der bestehende Block `@media (prefers-reduced-motion: reduce)` schaltet alle Transitions/Animationen ab;
ergänzt um `.k`/Pfeile/Hamburger (`transform: none`, X-Zustand springt). Menü-Stagger und Regler-Nachlauf
sind an `no-preference` bzw. den `ruhig`-Schalter in `klar.js` gebunden.

## CLS / Layoutstabilität

Es werden nur `transform`/`opacity` animiert (Ausnahme Foto-Zoom). Die Kopf-Höhe schrumpft an einem
`position: fixed`-Element; der Inhalt referenziert das konstante `--kopf`, daher kein Umbruch und kein CLS.

## Prüfungen (grün)

- `npm run build` (astro-klar): 15 Seiten gebaut, ohne Fehler.
- `npm test` (astro-klar): 109/109 grün, inkl. Browser-Tests (Slider, Federknopf, Handyleiste,
  Kopf/Fokus, Reduced Motion, CSP auf allen Seiten).
- `npm test` (astro): 36/36 grün.
- Statisch: CSP ohne `unsafe-inline`/`unsafe-eval`, kein Inline-Skript, keine `on…`-Attribute, kein ß
  in Seiten/CSS/JS.

## Screenshots

- `korr-motion-menu-zu-handy.png` – Handy, Menü zu (Hamburger).
- `korr-motion-menu-auf-handy.png` – Handy, Menü auf (gestaffelte Links).
- `korr-motion-kopf-gescrollt-desktop.png` – Desktop, Kopf gescrollt (schmaler, milchig).
