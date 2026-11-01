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
├── eingabe/
│   ├── kundenangaben.md     Blatt für die Angaben des Kunden: das, woraus jede Website entsteht
│   └── projekt.beispiel.json  Vorlage für pruefen.cjs (Telefon, Hauptaktion, Formular, Kalender, Zahlen)
├── referenzen/              Wissen, nach Thema; SKILL.md verlinkt dorthin
│   ├── techniken.md         14 Techniken statt Looks, aus 25 vermessenen Vorbildern
│   ├── vorbilder-gemessen.md  Band der Vorbilder, Vorlagen-Signale, Methode, Grenzen
│   ├── bausteine.md         Baukästen (motionin, beui, backgrounds.supply) eingeordnet
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
├── galerie/
│   ├── index.html           elf Bausteine, eigener Code, ohne Bibliothek, mit Urteil und Technik
│   └── pruefen-galerie.cjs  ohne JS lesbar, still bei «Bewegung reduzieren», Pause, Kontrast, 44 px
└── werkzeuge/
    ├── kunde.cjs            Handy-Simulator für Kunden-Agenten (Playwright)
    ├── selbsttest/          Prüfseite mit drei eingebauten Fehlern für kunde.cjs
    ├── pruefen.cjs          maschinelle Prüfungen P6/T7 für jedes Projekt, gesteuert über projekt.json, mit Selbsttest
    ├── vermessen.cjs        misst eine Website wie die Vorbilder (Schrift, Bild, Knöpfe, Raster, Bauteile, Bewegung)
    ├── vergleichen.cjs      vergleicht eine Messung mit dem Band der Vorbilder, meldet Vorlagen-Signale
    └── vorbilder-band.json  Band aus 25 Vorbildern (Stand November 2026)
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

**Ablauf mit einem neuen Kunden**

1. `eingabe/kundenangaben.md` kopieren und mit dem Betrieb ausfüllen (★ = Pflicht). Logo und Fotos in einen Ordner.
2. Claude mit dem Skill beauftragen: «Baue die Website aus diesen Kundenangaben.» Der Skill liest das Blatt, sucht die Richtung, wählt Techniken und baut eine Vorschau.
3. Prüfen ohne Bewerter: `projekt.json` nach der Vorlage anlegen, dann
   ```
   node .claude/skills/design-uni/werkzeuge/pruefen.cjs projekt.json --selbsttest
   node .claude/skills/design-uni/werkzeuge/pruefen.cjs projekt.json
   node .claude/skills/design-uni/werkzeuge/vermessen.cjs site --name kunde --aus pruefung --bilder
   node .claude/skills/design-uni/werkzeuge/vergleichen.cjs pruefung/kunde.json
   ```
4. Blinde Bewerter und Kunden-Agenten laufen über Unteragenten (SKILL.md Schritt 9).

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

## Zweiter Skill: text-uni

`text-uni` regelt, **was** auf der Website steht: Inhalt, Wortlaut, Suche und Technik. `design-uni` regelt, wie es aussieht und ob Besucher ans Ziel kommen. Beide Skills sind zusammen gedacht: Text-Uni liefert Antwort-Plan, Texte und Ziele, design-uni baut daraus die Gestaltung. Bei Lesbarkeit und Recht gilt der strengere Grundsatz.

Der Skill ist ein Lehrgang in vier Semestern mit 404 prüfbaren Grundsätzen, je mit ID und Herkunft:

- **Schreiben, das man versteht:** Verständlichkeit, Satz und Wort, Lesen am Bildschirm, Schweizer Hochdeutsch, KI-Klang.
- **Text, der verkauft:** Angebot und Botschaft, Worte der Kundschaft, Überschrift und Knopf, Belege, Recht in Werbetexten.
- **Google-Suche:** Grundlagen, Suchabsicht und Antwort-Plan, Titel und Beschreibung, lokale Suche und Profil, Messen mit Search Console.
- **KI-Suche und Technik:** wie KI-Dienste Quellen wählen, zitierfähig schreiben, robots.txt, Sitemap, Statuscodes, Umzug einer Website.

### Inhalt

```
skills/text-uni/
├── SKILL.md                 Verfahren in neun Schritten mit Prüfpunkten T0 bis T8
├── referenzen/
│   ├── semester1/           V, W, L, CH, K   und die Prüfung «Welcher Text ist klarer?»
│   ├── semester2/           A, KW, U, B, R   und die Prüfung «Würden Sie hier anrufen?»
│   ├── semester3/           G, Q, S, P, M    und der Snippet-Test
│   ├── semester4/           KQ, ZS, TI, CL   und der KI-Zitat-Test mit Technik-Probe
│   └── abgleich-menschen.md Grundsätze gegen Daten von Menschen; wann Modell-Urteilen zu trauen ist
└── werkzeuge/
    ├── slop-de.js           Floskel-Werkzeug für deutsche Texte (Node, ohne Abhängigkeiten)
    └── slop-de.json         Liste mit 63 Einträgen, je mit Begründung und besserer Variante
```

### Installation

Wie bei design-uni den Ordner `skills/text-uni/` kopieren, am besten beide Skills zusammen:

- **für ein Projekt:**
  ```
  mkdir -p .claude/skills && cp -R pfad/zu/design-uni/skills/text-uni .claude/skills/
  ```
- **für alle Projekte:**
  ```
  mkdir -p ~/.claude/skills && cp -R pfad/zu/design-uni/skills/text-uni ~/.claude/skills/
  ```

Aufrufen lässt er sich auch direkt mit `/text-uni`.

### Werkzeug

`slop-de.js` braucht Node.js 18 oder neuer. Es liest den sichtbaren Text von HTML-Seiten und meldet Floskeln, KI-Muster, Eszett und leere Knöpfe mit Zeile.

```
node .claude/skills/text-uni/werkzeuge/slop-de.js pfad/zur/website
node .claude/skills/text-uni/werkzeuge/slop-de.js .claude/skills/text-uni/referenzen/semester1/ki-klang.md
```

Exit-Code 0 heisst: kein FEHLER. Mit `--streng` zählen auch Warnungen, mit `--json <pfad>` gibt es alle Treffer als Datei.

### Grenzen von text-uni

- Alle vier Semesterprüfungen sind Modell-Urteile: Sprachmodelle haben bewertet, keine Menschen.
- Klickwirkung und die Auswahl der Quellen durch KI-Dienste sind nicht geprüft.
- Ausser `slop-de.js` gibt es kein Werkzeug; Faktenabgleich, Snippet-Test und Zitat-Test laufen von Hand oder mit eigenem Skript.
- Die Rechtsteile sind keine Rechtsauskunft.
