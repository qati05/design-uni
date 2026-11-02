# design-uni, text-uni, web-uni

Drei Claude-Code-Skills, die zusammen Websites und Landingpages für kleine Betriebe bauen und prüfen: auf Agentur-Niveau, mit Texten, die verkaufen und gefunden werden, und mit der Technik, die dazu passt.

| Skill | Regelt | Besitzt (Auszug) |
|---|---|---|
| **design-uni** | wie es aussieht und ob Besucher ans Ziel kommen | Kundenangaben-Blatt und Eingangstor, Richtung, Gestaltung, Typografie, Bedienung und Barrierefreiheit mit allen Schwellen, Bewegung (ob und welche), Bilder und Rechte, alle Bewerter, Kunden-Agenten und Menschentests, Bericht |
| **text-uni** | was dasteht | Fakten, Kundenworte, Suchbegriffe, Wortlaut aller Texte, Angebot und Belege als Inhalt, Recht für Inhalte (UWG, PBV), Suche und KI-Suche, Messplan |
| **web-uni** | womit gebaut und wie es betrieben wird | Stack und Hoster (Standard: Astro, statische Ausgabe), Budgets für Ladezeit, JS und Bilder, fremde Hosts und Datenschutz-Technik, Formular-Backend, Testumgebung, Livegang, Pflege, Kosten |

Jedes Thema hat **genau einen Besitzer**; die anderen Skills verweisen nur. Rangfolge, Besitz, die Entscheide zu Widersprüchen, eine Schwelle je Sache, die Kennungen und die gemeinsame Abfolge stehen in **[skills/design-uni/referenzen/zusammenspiel.md](skills/design-uni/referenzen/zusammenspiel.md)**. Wer eine Regel ändert, ändert sie beim Besitzer.

**Kennungen:** design-uni DP0 bis DP8 (Prüfpunkte), DL (Lektionen), DGT, DGK, DGF, DGB (Grundsätze), TK1 bis TK14 (Techniken), LA, LP, LH (Prüflisten), GB1 bis GB11 (Bausteine der Galerie); text-uni TP0 bis TP8 und die Grundsätze V, W, L, CH, K, A, KW, U, B, R, G, S, P, Q, M, KQ, TI, ZS, CL; web-uni WP0 bis WP9, WL (Lektionen), WQ1 bis WQ89 (Quellen der Stack-Wahl).

## Installation (alle drei)

Die drei Ordner unter `skills/` kopieren, am besten zusammen, weil sie aufeinander verweisen:

- **für ein Projekt:** nach `.claude/skills/` im Projekt
  ```
  mkdir -p .claude/skills && cp -R pfad/zu/design-uni/skills/design-uni pfad/zu/design-uni/skills/text-uni pfad/zu/design-uni/skills/web-uni .claude/skills/
  ```
- **für alle Projekte:** nach `~/.claude/skills/`
  ```
  mkdir -p ~/.claude/skills && cp -R pfad/zu/design-uni/skills/design-uni pfad/zu/design-uni/skills/text-uni pfad/zu/design-uni/skills/web-uni ~/.claude/skills/
  ```

Claude Code findet die Skills beim nächsten Start. Aufrufen lassen sie sich auch direkt mit `/design-uni`, `/text-uni` und `/web-uni`.

**Für die Werkzeuge:** Node.js (für die Astro-Vorlage die Version aus `skills/web-uni/vorlage-astro/package.json`) und Playwright mit Chromium:

```
npm i -D playwright && npx playwright install chromium
```

**Ablauf mit einem neuen Kunden** (gemeinsame Abfolge in `zusammenspiel.md` Teil 6)

1. `skills/design-uni/eingabe/kundenangaben.md` kopieren und mit dem Betrieb ausfüllen: ein Blatt für alle drei Skills (★ = ohne die Antwort geht der Bau nicht). Logo und Fotos mit Rechten in einen Ordner.
2. Claude beauftragen: «Baue die Website aus diesen Kundenangaben, mit design-uni, text-uni und web-uni.» Es gibt ein Eingangstor (DP0 + TP0 + WP0, ein Tor mit drei Teilen), dann wechseln die Skills sich in der festen Abfolge ab.
3. Vor DP4 (erster Bildschirm) misst design-uni die Seite gegen die Vorbilder:
   ```
   node .claude/skills/design-uni/werkzeuge/vermessen.cjs site --name kunde --aus pruefung --bilder
   node .claude/skills/design-uni/werkzeuge/vergleichen.cjs pruefung/kunde.json
   ```
   Nach dem Bau aller Seiten läuft **ein** Prüflauf für alle maschinellen Prüfungen (DP6 + TP7 + WP4 + WP5; Ablauf in web-uni `pruefumgebung.md`), zum Beispiel:
   ```
   node .claude/skills/design-uni/werkzeuge/pruefen.cjs projekt.json --selbsttest
   node .claude/skills/design-uni/werkzeuge/pruefen.cjs projekt.json
   node .claude/skills/text-uni/werkzeuge/slop-de.js dist --prueflauf
   ```
   `site` und `dist` stehen für den gebauten Ordner (bei Astro `dist`, bei statischem HTML der Ordner der Seiten). Die Werkzeuge melden **FEHLER** (sperrt), **HINWEIS** (sperrt nicht) oder «nicht geprüft»; Exit-Code 1 nur bei FEHLER (`zusammenspiel.md` Teil 7). `slop-de.js --prueflauf` meldet jeden Treffer als HINWEIS, weil K1 nicht sperrt.
4. Blinde Bewerter und Kunden-Agenten laufen über Unteragenten (design-uni Schritt 9); ihr Urteil ist ein **Vorfilter**. Belegt ist eine Wirkung erst mit Menschen (Menschentest) oder Zahlen nach dem Livegang.
5. Live geht nichts ohne Freigabe; den Livegang führt web-uni (WP9).

## Was die Skills voraussetzen

- **Unteragenten** für die blinden Bewerter und die Kunden-Agenten, idealerweise auf zwei verschiedenen Modellen. Ohne sie heissen alle Bewerter-Tore «nicht gelaufen»; gebaut wird nur, wenn der Auftraggeber es will, und der Bericht sagt das oben.
- **Einen Menschen, der freigibt.** Die Skills bauen Vorschauen und Entwürfe; veröffentlicht, zugesagt und mit dem Betrieb gesprochen wird nur mit Freigabe. Kosten an den Kunden sind Entwürfe.
- **Belegte Fakten.** Was fehlt, bleibt als sichtbare Lücke stehen.

## design-uni

Ein Skill, der Websites und Landingpages auf Agentur-Niveau bauen und prüfen lässt, die zugleich Anfragen, Anrufe und Buchungen bringen. Er entstand aus einer Reihe blinder Tests (erste Bildschirme, Bewegung, ganze Websites, Kunden-Agenten am Handy) und hält fest, was sich dabei gehalten hat:

- **Eine grosse Entscheidung aus dem Betrieb** statt Branchenvorlage; alles andere hängt über einen «weil»-Satz daran.
- **Abstand zum eigenen Durchschnitt**, gemessen an acht Achsen und sieben Bauteilen, weil ein Modell ohne Verfahren auf seinen Standard zurückfällt.
- **Angebot als Inhalt, nicht als Form:** Leistung und Ort, Preis, Frist, Plan, ein Aufruf statt Badge, Countdown, Häkchen.
- **Blind prüfen, nie selbst benoten:** sechs Bewerter auf zwei Modellen als Vorfilter, eine Fassung pro Satz, fremde Referenzen und eine Falle; dazu ein Verfahren für Menschentests.
- **Kunden-Agenten am Handy** mit echten Aufgaben, und maschinelle Prüfungen für das, was eine Maschine sicher findet (Telefon-Links, Kontrast aus der Kaskade, Verdeckung, Kalender).

Stackneutral; der Standard-Stack steht in web-uni.

```
skills/design-uni/
├── SKILL.md                 Verfahren in elf Schritten mit Prüfpunkten DP0 bis DP8 und den Übergaben an text-uni und web-uni
├── eingabe/
│   ├── kundenangaben.md     das eine Blatt für die Angaben des Kunden, mit Teilen für text-uni und web-uni
│   └── projekt.beispiel.json  Vorlage für pruefen.cjs (Telefon, Hauptaktion, Formular, Kalender, Zahlen)
├── referenzen/              Wissen, nach Thema; SKILL.md verlinkt dorthin
│   ├── zusammenspiel.md     Besitz, Rangfolge, Entscheide, Schwellen, Kennungen, Abfolge der drei Skills
│   ├── techniken.md         14 Techniken statt Looks (TK1 bis TK14), aus 25 vermessenen Vorbildern
│   ├── vorbilder-gemessen.md  Band der Vorbilder, Vorlagen-Signale, Methode, Grenzen
│   ├── bausteine.md         Baukästen (motionin, beui, backgrounds.supply) eingeordnet
│   ├── geschmack.md         was premium ausmacht, 60-Sekunden-Prüfung, Billig-Muster
│   ├── richtung.md          Richtungsblatt, eine grosse Entscheidung, Komponenten aus der Idee
│   ├── abstand.md           Register, Achsen, Bauteile, Richtwerte, Modell-Standard
│   ├── typografie.md · komposition.md · farbe-bild.md · bewegung.md   Grundsätze DGT, DGK, DGF, DGB; Boden für Bewegung
│   ├── conversion.md        Angebot, Vertrauen, Formular, Prüflisten LA, LP, LH, Zählpunkte
│   ├── recht-schweiz.md     Wenn in der Schweiz: was Gestaltung und Material betrifft
│   ├── branchen/            Boden, Fototag, Vorbilder, «Nie» je Branche
│   ├── blindtest.md         Aufbau, Auftragstexte für die Bewerter, Schwellen, Menschentest
│   ├── kunden-agenten.md    Kunden-Agenten am Handy, Auftragstext, Auswertung
│   ├── lektionen.md         was die Tests gelehrt haben, mit Zahlen (DL1 ff.)
│   └── nie-liste.md         verboten · nie als Voreinstellung (Hinweis) · trotzdem erlaubt
├── galerie/
│   ├── index.html           elf Bausteine, eigener Code, ohne Bibliothek, mit Urteil und Technik
│   └── pruefen-galerie.cjs  ohne JS lesbar, still bei «Bewegung reduzieren», Pause ab 5 s, Kontrast, 44 px
└── werkzeuge/
    ├── kunde.cjs            Handy-Simulator für Kunden-Agenten (Playwright)
    ├── selbsttest/          Prüfseite mit drei eingebauten Fehlern für kunde.cjs
    ├── pruefen.cjs          maschinelle Prüfungen DP5, DP6, TP7 und WP5 (fremde Herkunft) für jedes Projekt, gesteuert über projekt.json; Stufen FEHLER, HINWEIS, «nicht geprüft»; mit Selbsttest; findet Seiten auch im Verzeichnisformat
    ├── vermessen.cjs        misst eine Website wie die Vorbilder (Schrift, Bild, Knöpfe, Raster, Bauteile, Bewegung)
    ├── vergleichen.cjs      vergleicht eine Messung mit dem Band der Vorbilder, meldet Vorlagen-Signale
    └── vorbilder-band.json  Band aus 25 Vorbildern (Stand November 2026)
```

Werkzeug für Kunden-Agenten prüfen:

```
node .claude/skills/design-uni/werkzeuge/kunde.cjs \
  .claude/skills/design-uni/werkzeuge/selbsttest '[{"tippe":"Anrufen"}]' /tmp/test.png
```

Das erwartete Protokoll steht in `skills/design-uni/referenzen/kunden-agenten.md`, Teil 2.

Nicht gedacht für App-Oberflächen (Dashboards, Einstellungen, Formular-Strecken in Anwendungen).

## text-uni

`text-uni` regelt, **was** auf der Website steht: Inhalt, Wortlaut, Suche und die Regeln für `robots.txt`, Sitemap und Umzug. Text-Uni liefert Antwort-Plan, Texte und Ziele an die Gestaltung; design-uni baut daraus die Gestaltung.

Der Skill ist ein Lehrgang in vier Semestern mit 404 prüfbaren Grundsätzen, je mit ID und Herkunft:

- **Schreiben, das man versteht:** Verständlichkeit, Satz und Wort, Lesen am Bildschirm, Schweizer Hochdeutsch, KI-Klang.
- **Text, der verkauft:** Angebot und Botschaft, Worte der Kundschaft, Überschrift und Knopf, Belege, Recht in Werbetexten.
- **Google-Suche:** Grundlagen, Suchabsicht und Antwort-Plan, Titel und Beschreibung, lokale Suche und Profil, Messen mit Search Console.
- **KI-Suche und Technik:** wie KI-Dienste Quellen wählen, zitierfähig schreiben, robots.txt, Sitemap, Statuscodes, Umzug einer Website.

```
skills/text-uni/
├── SKILL.md                 Verfahren mit Prüfpunkten TP0 bis TP8
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

`slop-de.js` liest den sichtbaren Text von HTML-Seiten und Markdown und meldet Floskeln, KI-Muster, Eszett und leere Knöpfe mit Zeile. Exit-Code 0 heisst: kein FEHLER. Mit `--streng` zählen auch Warnungen, mit `--json <pfad>` gibt es alle Treffer als Datei. Mit `--prueflauf` (für den gemeinsamen Prüflauf, TP7/K1) ist jeder Treffer ein HINWEIS und der Exit-Code 0.

## web-uni

`web-uni` regelt, **womit** gebaut wird und wie die Website betrieben wird: Klassen und Stack, Hoster, Bewegungstechnik und 3D mit Kostenblatt, Budgets für Ladezeit, JavaScript und Bilder, ein Prüflauf für alle maschinellen Prüfungen, Formular-Backend, Datenschutz-Technik, Livegang, Pflege und Übergabe. Standard des Studios ist Astro mit statischer Ausgabe; statisches HTML bleibt erlaubt, wenn nichts verloren geht.

```
skills/web-uni/
├── SKILL.md                 Verfahren mit Prüfpunkten WP0 bis WP9 (WP9 Livegang)
├── referenzen/              stack-wahl (Entscheidhilfe, Quellen WQ1 bis WQ89), stacks, animation-3d, messungen, pruefumgebung, betrieb, livegang, branchenwerte, lektionen (WL1 ff.)
└── vorlage-astro/           Gerüst mit Datenquelle, Bau und Prüfungen, ohne eigene Gestaltung und ohne fertige Texte
```

## Grenzen

- Alle Bewerter in den zugrunde liegenden Tests waren Sprachmodelle. Ihr Urteil ist ein Vorfilter; ob Menschen gleich urteilen, zeigt erst ein Menschentest.
- Schwellen mit `[Annahme]` sind nicht kalibriert. Regeln, die nur aus Modell-Urteilen oder Geschmack stammen, sind Hinweise und sperren nichts.
- Die Rechtsteile sind keine Rechtsauskunft.
- Ob die Grundsätze mehr Anfragen bringen, zeigt erst eine Messung nach dem Livegang (Messplan: text-uni).
