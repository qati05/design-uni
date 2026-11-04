# Korrektur Review-Final · Entwurf C

Umgesetzt am 04.11.2026 (Auftrag nach Freigabe Reshat 10:41: A und C freigegeben).
Grundlage: `vorschau/c/REVIEW-FINAL.md`. Umgesetzt wurden A1–A5, C13–C19 und Bewegung 20–23.
B6–B12 bleiben offen (warten auf Betrieb/Shooting); Ausnahme ist der von A3 verlangte Schalter.

Prüfungen: `npm test` (astro-klar) 116/116 grün, Build grün, keine Konsolen-/CSP-Fehler.
Screenshots: `korr-review-desktop.png`, `korr-review-handy.png` (Start, oben) und `korr-review-tesla-desktop.png`.

## A · Fehler (alle erledigt)

- **A1 — Kopfleiste verdeckte die H1 / leerer Streifen / abgeschnittenes Foto: erledigt.**
  Ursache: Der Fallback `body:has(.hinweis)` für die Höhe des Hinweis-Bands griff auch auf `.hinweis` an
  anderer Stelle (z. B. `.tesla-ende .hinweis` auf der Startseite) und schob den fixierten Kopf um 44 px nach
  unten. Jetzt auf das Band begrenzt: `body:has(.hinweise .hinweis)`. Der Kopf sitzt bei top 0, der Inhalt
  beginnt darunter (Hero-Padding = Kopfhöhe, plus Luft aus dem Hero-Text), das Foto zeigt oben wieder runde Ecken.
  Messung (Playwright, scrollY 0): H1-Oberkante > Kopf-Unterkante bei 390 px und 1440 px, Kopf-Oberkante bei 0.
  Neuer Test in `test/browser.test.mjs`.

- **A2 — Footer-Knöpfe zu klein: erledigt.** `.fuss a:not(.knopf)` und `.fuss-kopf` jetzt mindestens 44 px
  (Route, Kopieren, Adresse kopieren, Firmenkunden, Impressum, Datenschutz, Bildnachweise, Nach oben, Telefon).
  Der Haupt-CTA «Anrufen» ist als `.knopf--gross` 64 px (≥ 48 px wie im Hero); «Schaden melden» 48 px. Die alte
  Regel `.fuss a { min-height: 32px }` hatte zuvor sogar die grossen CTAs auf 32 px gezogen — mit `:not(.knopf)`
  behalten sie ihre Höhe. Neuer Test misst alle sichtbaren Tippziele im Fuss.

- **A3 — Interne Notizen / Lücke-Schalter: erledigt.**
  Der Satz «… hat das Studio den Eintrag nicht nachgeprüft.» ist aus «Gut zu wissen» entfernt und als offene
  Frage (Lücke-Box) verschoben. Den Schalter für die Lücke-Boxen gab es noch nicht: `Luecke.astro` rendert jetzt
  nur in der Vorschau (`vorschau`-Flagge aus `bau.json`) — dieselbe Flagge setzt auch `noindex`. Sobald `noindex`
  wegfällt (Livegang), verschwinden alle `Luecke`-Boxen automatisch (Tesla, /flotten/, /leistungen/, /datenschutz/
  usw.). In der Vorschau bleiben sie sichtbar (Tests bauen mit `vorschau=true`).

- **A4 — «Rückruf» auf der Tesla-Seite: erledigt.** «So wissen wir vor dem Rückruf, welches Auto kommt» →
  «So wissen wir gleich, welches Auto kommt.» Test prüft: Tesla-Seite ohne «Rückruf» und ohne «nachgeprüft».

- **A5 — Doppelter Aufruf im Footer von /schaden-melden/: erledigt.** Auf dieser Seite zeigt der Fuss nur noch
  «Anrufen», kein zweiter «Schaden melden»-Knopf (`Fuss.astro`, Bedingung `ort === "schaden-melden"`). Auf allen
  anderen Seiten bleibt «Schaden melden» im Fuss. Neuer statischer Test prüft beides.

## C · Feinschliff (alle erledigt)

- **C13 — Vorher/Nachher am Desktop zu klein: erledigt.** Zwei-Spalten-Layout: Titel und Text links, der Regler
  rechts über ~62 % der Breite (Grid 0.85fr / 1.4fr, ab ≤ 960 px einspaltig). Keine tote Fläche mehr rechts.

- **C14 — Tesla-Hero wirkte wie eine Vorlage: erledigt.** Dunkles Raster und Glow entfernt (`.tesla::before` weg,
  Pill-Punkt ohne Leuchtring, Knopf ohne Glow-Schatten). Rechts jetzt ein gerahmtes Tesla-Foto wie auf der
  Startseite; der dunkle Grund bleibt. Die Liste 01–04 ist eine einfache Liste ohne Nummern (keine Navigations-
  Optik mehr, kein Hover-Versatz). Am Seitenende ein CTA «Tesla-Schaden melden» vor dem Footer.

- **C15 — Kreis bei «01» sass tiefer: erledigt.** Der Tesla-Ablauf (Startseite) richtet die Schritte jetzt oben aus
  (`align-items: start`); zuvor sass der kürzere erste Schritt 12 px tiefer. Messung: alle drei Kreise top 415.3 px,
  sitzen auf einer Linie.

- **C16 — Eyebrow auf der Formularseite: erledigt.** «SCHADEN MELDEN · AUTO SPEEDY, ALTSTÄTTEN SG» gestrichen,
  die H1 reicht.

- **C17 — «heute» in den Wochenzeiten: erledigt.** «heute» steht nicht mehr in derselben Zeile wie «Montag bis
  Donnerstag», sondern als kleines Label darunter (`.fuss-woche__heute` block, 12 px, Akzentfarbe).

- **C18 — Text «Unfall und Carrosserie»: erledigt.** Neu: «Unfallschäden reparieren wir für alle Marken. Die
  Versicherung regeln wir.» (kein «Chassisschaden» mehr).

- **C19 — senkrechte Trennlinie über dem Hero-Foto: erledigt.** `border-right` am `.hero-text` entfernt; das Foto
  trägt allein.

## Bewegung (alle erledigt)

- **20 — Kopf beim Scrollen: erledigt.** Der Kopf schrumpft (64 → 52 px) und wird ab ca. 80 px Scroll milchig mit
  `backdrop-filter: blur` (Fallback deckend ohne Blur). Nur die Höhe läuft über die Transition; Hintergrund/Blur/
  Schatten sind ein Zustand (nicht animiert) — die Transition des Kopfs ist auf `height` begrenzt.

- **21 — Fotos und Regler blenden ein: erledigt.** Hero-Foto, Tesla-Foto und der Vorher/Nachher-Regler erscheinen
  mit opacity + translateY 8 px (≤ 450 ms, hier 420 ms, Kurve `--aus`), nur unter `prefers-reduced-motion:
  no-preference`. Der Regler-Reveal liegt am Wrapper `.vorher-nachher__slider`, damit die eigene `--pos`-Transition
  der Figur (Maus/Tastatur/Tippen) unberührt bleibt.

- **22 — Erfolgs-Haken zeichnet sich: erledigt (bestätigt).** Das SVG-Häkchen im Formular zeichnet sich über
  `stroke-dashoffset` (Keyframe `haken-ein`, 400 ms) und ist unter Reduced Motion statisch vollständig
  (`stroke-dashoffset: 0`). Mechanik war vorhanden und ist erhalten.

- **23 — Fehlende Clips (Handy-Rundgang): offen.** Kurzer Handy-Rundgang (Menü, Anrufleiste, Federknopf) ist noch
  aufzunehmen; die beteiligten Verhaltensweisen sind durch die Browser-Tests abgedeckt. Als Video nachzuliefern.

## B · Bewusst NICHT umgesetzt (warten auf Betrieb/Shooting)

B6 (Fotos/Platzhalter-Nummerierung), B7 (Inhaber-Zitat), B8 (SEO/Meta/Favicon/noindex), B9 (LCP/AVIF),
B10 (Kontrast span.nr), B11 (Partner-Logos), B12 (Admin): unverändert gelassen. Einzige Ausnahme: der von A3
verlangte Lücke-Schalter (siehe A3), der an `noindex` hängt (B8).

## Erhalten

Hero-Korrektur (H1 «Qualität, / die man sieht und fährt.», Lead, Faktenleiste-Zelle «Ersatzwagen», Tesla-Spec
«Ersatzwagen: Tesla auf Anfrage»), Footer-Korrektur (f6036f7) und Motion-Korrektur bleiben erhalten; Schritte
11–15 (Formular, Editor, Hinweise, Bewertung) funktionieren weiter (Tests grün).

## Neue/geänderte Tests

- `test/browser.test.mjs`: «Kopfleiste verdeckt die H1 nicht (A1)» und «Fuss: Tippziele ≥ 44 px, Anrufen ≥ 48 px (A2)».
- `test/statisch.test.mjs`: «Tesla-Seite ohne Rückruf/nachgeprüft (A3/A4)» und «Fuss auf /schaden-melden/ ohne Selbstlink (A5)».
