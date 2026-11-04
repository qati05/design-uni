# Korrektur Hero: Slogan + Ersatzwagen (Linie C)

Freigabe Reshat 03.11.2026 (23:36 Slogan, 23:40 Ersatzwagen-Fakt, 23:43 «nur auf Anfrage»).
Nur Worktree `autospeedy-c`, Branch `claude/autospeedy-c`. Nicht committet, Änderungen ungestaged.

## Geändert

- **Hero (`src/components/Hero.astro`)**
  - h1 neu: `<h1><span>Qualität,</span><br><em>die man sieht und fährt.</em></h1>` – zweite Zeile in Source Serif kursiv (`.hero-text h1 em`), wie bisher.
  - Lead neu, wörtlich (Endfassung Punkt 7): «Carrosserie und Lack in Altstätten, für alle Marken und als Tesla Approved Body Shop. Die Abwicklung mit Ihrer Versicherung übernehmen wir. Einen Ersatzwagen erhalten Sie auf Anfrage.»
  - «seit Oktober» entfällt im Lead (bleibt im Tesla-Abschnitt, Ablauf 02).
- **Fakt (`astro/src/content/betrieb.json`)** – neu `ersatzwagen: { anzahl: 6, tesla: true }` plus `_ersatzwagen` (Quelle Reshat 03.11.2026, nur auf Anfrage, keine Verfügbarkeitsgarantie). Gemeinsame Datenquelle, von `daten.mjs` gelesen; `leere()`-Prüfung ok.
- **Faktenleiste (`src/components/Faktenleiste.astro`)** – Zelle «Team» → «Ersatzwagen»: «<span class="zahl">6</span> Ersatzautos auf Anfrage, auch ein Tesla». Wert aus `b.ersatzwagen`, Zahl in bestehender Klasse `.zahl` (Archivo, `tabular-nums`; `.leiste-fakten dd` ist ohnehin Archivo).
- **Tesla-Abschnitt (`src/components/TeslaTeil.astro`)** – `.spec` um eine Zeile ergänzt: «Ersatzwagen: Tesla auf Anfrage». Keine Aussage zu Kosten oder Verfügbarkeit.
- **Start-Titel (`astro/src/content/texte.json`, `seiten.index.titel`)** – «Carrosserie und Spritzwerk …» → «Carrosserie und Lack in Altstätten SG | Auto Speedy», damit Ort + Leistung (SEO) trotz neuem h1 erhalten bleiben und der freigegebene Wortlaut «Carrosserie und Lack in Altstätten» im Titel steht (51 Zeichen, im Ziel 40–60). `beschreibung` bleibt leer (später, text-uni S12). `h1`-Feld der Linie A unverändert.
- **Tesla-Seite (`src/pages/tesla.astro`)** – in der Lücke «Ersatzwagen» aus der Beispielliste entfernt, da nun bekannt (Punkt 9, Widerspruch zum neuen `.spec`-Eintrag vermieden). Rest der Lücke bleibt.

## Punkt 9 – Prüfung «nur auf Anfrage», keine Automatik-Versprechen

Durchsucht: `astro-klar/src`, `astro/src`, `astro/src/content` (Meta/Titel), JSON-LD (`Klar.astro`).
- Nirgends steht, dass jeder/automatisch einen Ersatzwagen erhält. Überall «auf Anfrage».
- JSON-LD enthält keine Ersatzwagen-Aussage.
- `flotten.astro` nennt «Ersatzwagen» weiter als offene Firmenkunden-Kondition (Rahmenkonditionen/Rückgabe) – anderer Kontext (B2B), kein Widerspruch, unverändert.

## Nicht angefasst (laut Vorgabe)
Formular und `functions/` (Ersatzwagen-Checkbox folgt Schritt 12, Punkt 10), `cockpit`. Kein push/merge/deploy.

## Prüfungen grün
- `npm run build` (Linie C): 13 Seiten, ok.
- `npm test`: 47/47 pass (inkl. CSP, kein Inline-JS, de-CH ohne ß, JSON-LD, Handyleiste/Hero-CTAs).
- Kein bestehender Test prüfte den alten h1-Text, daher keine Testanpassung nötig (Struktur `h1 span` + `h1 em` bleibt, Browser-Test weiter grün).

## Aufnahmen
`korr-hero-start-{desktop,desktop-ganz,handy,handy-ganz}.png`
Desktop: zweite h1-Zeile «die man sieht und fährt.» einzeilig, kein Ein-Wort-Umbruch (`text-wrap: balance` ok). Faktenleiste zeigt «Ersatzwagen · 6 Ersatzautos auf Anfrage, auch ein Tesla».
