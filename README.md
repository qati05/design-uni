# design-uni

Ein Claude-Code-Skill, der Websites und Landingpages auf Agentur-Niveau bauen und prüfen lässt, die zugleich Anfragen, Anrufe und Buchungen bringen.

Er entstand aus einer Reihe blinder Tests (erste Bildschirme, Bewegung, ganze Websites, Kunden-Agenten am Handy) und hält fest, was sich dabei gehalten hat:

- **Eine grosse Entscheidung aus dem Betrieb** statt Branchenvorlage; alles andere hängt über einen «weil»-Satz daran.
- **Abstand zum eigenen Durchschnitt**, gemessen an acht Achsen und sieben Bauteilen, weil ein Modell ohne Verfahren auf seinen Standard zurückfällt.
- **Angebot als Inhalt, nicht als Form:** Leistung und Ort, Preis, Frist, Plan, ein Aufruf statt Badge, Countdown, Häkchen.
- **Blind prüfen, nie selbst benoten:** sechs Bewerter auf zwei Modellen, eine Fassung pro Satz, fremde Referenzen und eine Falle.
- **Kunden-Agenten am Handy** mit echten Aufgaben, und maschinelle Prüfungen für das, was eine Maschine sicher findet (Telefon-Links, Kontrast aus der Kaskade, Verdeckung, Kalender).

## Inhalt

```
skills/design-uni/
├── SKILL.md                 Verfahren in elf Schritten mit Prüfpunkten P0–P8
├── referenzen/              Wissen, nach Thema; SKILL.md verlinkt dorthin
│   ├── geschmack.md         was premium ausmacht, 60-Sekunden-Prüfung, Billig-Muster
│   ├── richtung.md          Richtungsblatt, eine grosse Entscheidung, Komponenten aus der Idee
│   ├── abstand.md           Register, Achsen, Bauteile, Sperren, Modell-Standard
│   ├── typografie.md · komposition.md · farbe-bild.md · bewegung.md
│   ├── conversion.md        Angebot, Vertrauen, Formular, Prüflisten A/P/H, Messplan
│   ├── recht-schweiz.md     Wenn in der Schweiz: UWG, PBV, DSG, FMG, MedBG
│   ├── branchen/            Boden, Fototag, Vorbilder, «Nie» je Branche
│   ├── blindtest.md         Aufbau, Auftragstexte für die Bewerter, Schwellen
│   ├── kunden-agenten.md    Kunden-Agenten am Handy, Auftragstext, Auswertung
│   ├── lektionen.md         was die Tests gelehrt haben, mit Zahlen
│   └── nie-liste.md         verboten · nie als Voreinstellung · trotzdem erlaubt
└── werkzeuge/
    ├── kunde.cjs            Handy-Simulator für Kunden-Agenten (Playwright)
    └── selbsttest/          Prüfseite mit drei eingebauten Fehlern für kunde.cjs
```

## Installation

Den Ordner `skills/design-uni/` kopieren:

- **für ein Projekt:** nach `.claude/skills/design-uni/` im Projekt
  ```
  mkdir -p .claude/skills && cp -R pfad/zu/design-uni/skills/design-uni .claude/skills/
  ```
- **für alle Projekte:** nach `~/.claude/skills/design-uni/`
  ```
  mkdir -p ~/.claude/skills && cp -R pfad/zu/design-uni/skills/design-uni ~/.claude/skills/
  ```

Claude Code findet den Skill beim nächsten Start. Aufrufen lässt er sich auch direkt mit `/design-uni`.

**Für das Werkzeug** (nur für Kunden-Agenten nötig): Node.js 18 oder neuer und Playwright.

```
npm i -D playwright && npx playwright install chromium
node .claude/skills/design-uni/werkzeuge/kunde.cjs \
  .claude/skills/design-uni/werkzeuge/selbsttest '[{"tippe":"Anrufen"}]' /tmp/test.png
```

Das erwartete Protokoll steht in `referenzen/kunden-agenten.md`, Teil 2.

## Wann der Skill greift

Claude lädt ihn, wenn eine Website, Landingpage, Startseite oder ein erster Bildschirm gestaltet, umgebaut oder beurteilt werden soll, wenn etwas «generisch», «nach Vorlage» oder «nach KI» aussieht, oder wenn blind getestet werden soll, ob eine Seite premium wirkt und Besucher ans Ziel kommen. Er passt zu jedem Stack; die Technikbeispiele sind für statisches HTML, CSS und JavaScript geschrieben.

Nicht gedacht für App-Oberflächen (Dashboards, Einstellungen, Formular-Strecken in Anwendungen).

## Was der Skill voraussetzt

- **Unteragenten** für die blinden Bewerter und die Kunden-Agenten, idealerweise auf zwei verschiedenen Modellen. Ohne sie hält das Verfahren nach der Richtung an und berichtet «nicht gelaufen».
- **Einen Menschen, der freigibt.** Der Skill baut Vorschauen und Entwürfe; veröffentlicht, zugesagt und mit dem Betrieb gesprochen wird nur mit Freigabe.
- **Belegte Fakten.** Was fehlt, bleibt als sichtbare Lücke stehen.

## Grenzen

- Alle Bewerter in den zugrunde liegenden Tests waren Sprachmodelle; ob Menschen gleich urteilen, ist offen.
- Schwellen mit `[Annahme]` sind nicht kalibriert.
- Die Rechtsteile sind keine Rechtsauskunft.
- Ob die Grundsätze mehr Anfragen bringen, zeigt erst eine Messung nach dem Livegang (Messplan in `referenzen/conversion.md`).
