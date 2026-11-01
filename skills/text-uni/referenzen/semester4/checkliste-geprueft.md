# KI-Such-Checkliste geprüft · Skript Semester 4

Stand 01.11.2026 · Text-Uni, Semester 4 «KI-Suche und Technik».

> **Worum es geht:** die KI-Such-Checkliste (81 Punkte plus 4 Zusatzpunkte), Punkt für Punkt neben unsere Belege und Grundsätze gelegt. Je Punkt: Wie gut ist er belegt? Deckt er sich mit einem Grundsatz aus Semester 1 bis 4, fehlt er bei uns, oder widerspricht er? Und was machen wir damit? Am Ende vier vorgeschlagene Grundsätze (CL1 bis CL4) und die Punkte, bei denen wir bewusst anders entscheiden.
>
> **Gelesen am 01.11.2026** (Nummern wie in «Quellen» am Ende): die KI-Such-Checkliste in der deutschen Bearbeitung mit den englischen Titeln der Quelle (CL-Q1) · die Skripte «KI-Antworten und Quellen» (KQ), «Technik: crawlen und indexieren» (TI, Stand beim Lesen, noch in Arbeit) und «Zitierfähig schreiben» (ZS) · die Abschnitte «Prüfbare Grundsätze» aus Semester 1 bis 3 · online: CL-Q2 Eisend, 2006 (Zusammenfassung) · CL-Q3 Google, Organization (08.09.2026) · CL-Q4 YouTube-Hilfe zum Einbetten (ohne Datum) · CL-Q5 VisibilityStack (Suchauszug) · CL-Q6 OtterlyAI (Suchauszug).
>
> **Nicht gelesen:** Eisend, 2006, im Volltext; nur die Zusammenfassung der Universität Wien. Von VisibilityStack und OtterlyAI nur Auszüge in Suchtreffern, den Methodenteil nicht.
>
> **Nicht gefunden:** eine Studie mit nachvollziehbarer Methode, die für eingebettete Videos, Links zu Social-Profilen oder eine eigene benannte Methode eine Wirkung auf KI-Zitate misst. Was dazu steht, ist `[Annahme]` oder `[Meinung]`.
>
> Herkunft: `[Fakt · Quelle, Datum]`, `[Annahme]`, `[Meinung · Autor]`, `[Verweis]`. **`[Regel laut <Anbieter> · Quelle]`** heisst: So schreibt es der Anbieter. Das belegt seine Absicht, nicht die Wirkung.

**Boden aus Semester 1 bis 4.** Dieses Skript bringt keine neuen Regeln zum Schreiben. Es vergleicht. Jede Zeile nennt die ID des Grundsatzes, der den Punkt schon regelt. Die IDs stammen aus Semester 1 (V, W, L, CH, K), Semester 2 (A, KW, U, B, R), Semester 3 (G, S, P, Q, M) und Semester 4 (KQ, TI, ZS).

**Abgrenzung.** Wie KI-Dienste Quellen holen, steht in KQ. Ob ein Crawler die Seite lesen darf, steht in TI. Wie Sätze für eine KI richtig wiedergegeben werden, steht in ZS; dessen Teil 9 vergleicht die Textpunkte der Checkliste schon. Dieses Skript übernimmt jenes Ergebnis und ergänzt die übrigen Punkte.

**Schreibweise der Beispiele.** Floskeln stehen mit Mittelpunkt im Wort, etwa «das be·ste Restaurant». Alle Betriebe sind erfunden: Garage Muster in Musterdorf, Physio Muster. Adressen enden auf `.example`.

---

## 1. Was die Checkliste ist

- **Herkunft.** «The AI Search Checklist» der Agentur Contact steht auf inboundengineer.io. Sie hat 81 Punkte in sechs Teilen: Bausteine der Seite, Was nur dieser Betrieb hat, Wie der Text sich liest, Schreibhandwerk, Aktualität und Was Suchende noch fragen. `[Fakt · CL-Q1; ZS-Q19, Abruf 01.11.2026]`
- **Ohne Studien.** Die Quelle nennt keine Studie und keine Messung. `[Fakt · ZS-Q19]` Alle ihre Punkte zählen hier darum als Meinung. `[Meinung · The AI Search Checklist, inboundengineer.io]`
- **Deutsche Bearbeitung.** Eine Übersetzung für KMU in der Deutschschweiz erklärt jeden Punkt mit einem Beispiel und ergänzt vier Zusatzpunkte, die nicht in der Quelle stehen: gültiges JSON-LD (Z1), Alt-Text (Z2), `llms.txt` (Z3) und einen Markdown-Spiegel jeder Seite (Z4). Sie schreibt selbst: Die Wirksamkeit der Punkte sei von der Quelle nicht belegt. `[Fakt · CL-Q1]`
- **Wie wir sie lesen.** Als Vergleich, nicht als Beleg. Der Auftrag dazu lautet: «nicht als ultra Fakt, aber als Vergleich». `[Verweis · Prüfauftrag Semester 4]`
- **Der Prozentwert** der Bearbeitung (erfüllte Punkte geteilt durch anwendbare Punkte) misst, wie viele Punkte eine Seite erfüllt. Er misst keine Sichtbarkeit in KI-Antworten und wird nicht so verkauft (KQ9, ZS17). `[Annahme; Verweis KQ9, ZS17]`

---

## 2. So lesen wir die Tabellen

**Belegstand** sagt, worauf der Kern des Punkts steht. `[Annahme · eigene Einteilung]`

| Wert | Bedeutung |
|---|---|
| belegt | Mindestens eine Studie mit Methode stützt den Kern. In Klammern steht, für wen: «Menschen» (Lese-, Klick- und Vertrauensstudien aus Semester 1 bis 3) oder «KI» (Studien aus Semester 4). Nur «KI» heisst: auch für KI-Antworten gemessen. |
| Meinung | Keine Studie mit Methode. Steht eine Anbieter-Regel dahinter, steht sie in Klammern; sie belegt Absicht, nicht Wirkung. |
| widerlegt | Messung oder Dokumentation des Anbieters sagt das Gegenteil, für den genannten Dienst. |
| überholt | Der Punkt beruht auf etwas, das es so nicht mehr gibt. |
| Recht | Der Kern ist durch Schweizer Recht geregelt. Recht geht vor Wirkung (B19). |

**Abgleich** mit unseren Grundsätzen: «deckt sich» mit den IDs, die den Punkt regeln; «fehlt bei uns», wenn kein Grundsatz ihn regelt; «widerspricht» mit den IDs, gegen die er verstösst. Je Punkt zählt ein Wert, der erste in der Zelle.

**Entscheid:** «übernehmen» (neu, siehe Teil 5), «schon drin», «nicht übernehmen» oder «anders übernehmen», jeweils mit Grund.

Für alle Tabellen in Teil 3 gilt: Spalte «Punkt» `[Meinung · The AI Search Checklist, inboundengineer.io]`, für Z1 bis Z4 die deutsche Bearbeitung. Spalte «Belegstand» `[Fakt · Quellen beim Grundsatz der genannten ID oder in der Zelle]`. Spalten «Abgleich» und «Entscheid» `[Annahme · eigene Einordnung]`.

---

## 3. Alle 85 Punkte

### 3.1 Bausteine der Seite (B1 bis B15)

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **B1** Vergleichstabelle | Meinung (Regel laut Microsoft, ZS-Q5) | deckt sich · ZS11, R4 | schon drin: Tabelle ab 3 Preisen; Firmen nur nach R4 |
| **B2** Kernaussagen-Block | Meinung; «Antwort zuerst» ist gestützt (T2) | deckt sich · ZS4, L1 | anders übernehmen: Antwort im ersten Satz statt eigenem Block; Wiederholung nach K7 begrenzt |
| **B3** FAQ mit `FAQPage`-Daten | widerlegt (für Google, ZS Teil 4; das FAQ-Rich-Result ist seit 07.05.2026 abgeschafft, S26) | widerspricht · ZS17, S26 | anders übernehmen: Fragen sichtbar (ZS12), Daten ohne KI-Versprechen |
| **B4** Konkrete Zahlen | belegt (Menschen: Schindler, Yalch, 2006, siehe B2); für KI umstritten (GEO gegen C-SEO Bench) | deckt sich · L11, W22, B2, ZS15 | schon drin: nur belegte Zahlen (B8) |
| **B5** Datumsangaben | belegt (KI: Fang u. a., 2025, Vorabdruck, ZS-Q12) | deckt sich · ZS7, ZS8, CH10 | schon drin: Stand-Datum beim Fakt |
| **B6** Fakten | belegt (Menschen: Morkes, Nielsen, 1997, siehe L15) | deckt sich · R1, K2, L15, W22 | schon drin |
| **B7** Keine vagen Behauptungen | belegt (Menschen: wie B6) | deckt sich · K1, K2, R2, W18 | schon drin |
| **B8** Kurze Absätze, 80 Wörter | belegt (Menschen: Nielsen, 1997, siehe L4; Grenzwert Annahme) | deckt sich · L4, L5 | schon drin, strenger: 60 Wörter (L4) |
| **B9** Kundenbewertungen als Zitat | Recht (UWG Art. 3 Abs. 1 lit. b, siehe R7, R8) | deckt sich · B4, B6, B8, R7, R8 | schon drin: nur echt, mit Quelle |
| **B10** Aufzählungen | belegt (Menschen: Pernice, 2017, siehe L5; Moran, 2016, siehe L17) | deckt sich · L5, L12, L17 | schon drin |
| **B11** Eigene Bilder und Screenshots | Meinung (Regel laut Google, siehe G16, P10) | deckt sich · G16, P10, G18 | schon drin: keine Bilder aus Bilddatenbanken |
| **B12** Erfahrung aus erster Hand | Meinung (Regel laut Google, ZS-Q2: «non-commodity content») | deckt sich · G16, ZS14 | schon drin: nur, was der Betrieb belegt |
| **B13** Multimedia | Meinung (keine Studie gefunden) | fehlt bei uns | anders übernehmen: eigenes Video oder Link, fremder Player erst nach Klick (CL3) |
| **B14** Links zu Social-Profilen | Meinung (Regel laut Google, CL-Q3: `sameAs` empfohlen); die Begründung «E-E-A-T-Signal» widerspricht G26 | fehlt bei uns | übernehmen: Profile verlinkt und gleich in `sameAs` (CL2) |
| **B15** Autorenprofil | belegt (Menschen: Packard u. a., 2018, siehe B11) | deckt sich · B11, G17, G24, KQ18 | schon drin: Person nur mit Zustimmung |

### 3.2 Was nur dieser Betrieb hat (E1 bis E10)

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **E1** Arbeit im Einsatz gezeigt | Meinung (Regel laut Google, siehe G16) | deckt sich · G16 | schon drin: eigenes Foto einer Arbeit |
| **E2** Eigene Daten | Meinung (Regel laut Google, ZS-Q2) | deckt sich · G16, ZS14, B2 | schon drin: eigene Zahl mit Quelle |
| **E3** Kundenstimmen | Recht (UWG und DSG, siehe R7, KW14) | deckt sich · B6, R7, KW14, KW16 | schon drin: echt, wörtlich, mit Einwilligung |
| **E4** Video | Meinung (keine Studie gefunden; CL-Q6 zählt Zitate von YouTube-Videos, nicht Videos auf der eigenen Seite) | fehlt bei uns | anders übernehmen: wie B13 (CL3) |
| **E5** Eigene Erhebungen | Meinung | deckt sich · G16, B2 | schon drin: eigene Zahl genügt; Umfrage ohne Personendaten (KW3) |
| **E6** Gespräche mit Fachleuten | Meinung; die benannte Person ist gestützt (B11) | deckt sich · B11, KW14 | schon drin: Fachperson spricht mit Namen, Wortlaut freigegeben |
| **E7** Fallbeispiele | Meinung (Hormozi, siehe Semester 2) | deckt sich · G16, A12 | schon drin: ohne erkennbare Kundschaft (R21, KW14) |
| **E8** Begründete Gegenposition | Meinung | fehlt bei uns | nicht übernehmen: kein Muss für KMU; bei YMYL gilt G24 |
| **E9** Werkzeuge und Ressourcen | belegt (Menschen: Strohmetz u. a., 2002, siehe B12) | deckt sich · B12 | schon drin: Nützliches ohne Formular davor |
| **E10** Eigene benannte Methode | Meinung (eine Anbieter-Auswertung, nach eigener Aussage unbestätigt, CL-Q5) | fehlt bei uns | nicht übernehmen: ein Name ohne echten Ablauf besteht K3 nicht |

### 3.3 Wie der Text sich liest (T1 bis T7)

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **T1** Fragen als Überschriften | Meinung (ZS Teil 4; bei Klicks kein Vorteil, S8) | fehlt bei uns | nicht übernehmen als Pflicht: Frage-Titel nur als echte Kundenfrage (U3, S8, ZS12) |
| **T2** Antwort zuerst | belegt (Menschen: Schade, 2018, siehe L1; KI: «Lost in the Middle», ZS-Q9, als Übertragung) | deckt sich · ZS4, V1, L1, S13 | schon drin |
| **T3** Herauslösbare Passagen | belegt (KI: Anthropic, ZS-Q10, Anbieter-Messung zum Abruf); Google: nicht nötig | deckt sich · ZS1, ZS2 | schon drin |
| **T4** Kurze, fokussierte Absätze | belegt (Menschen: wie B8) | deckt sich · L4, V5 | schon drin |
| **T5** Zitierbare Fakten mit Quelle | belegt (Menschen: Fogg, 2002, siehe B3); für KI umstritten (GEO gegen C-SEO Bench) | deckt sich · ZS16, B2, B3 | schon drin: Quelle wegen B2 und B3, nicht wegen KI |
| **T6** Jede H2 eine Insel | belegt (KI: wie T3) | deckt sich · ZS2, V4, ZS1 | schon drin |
| **T7** Namen statt Umschreibungen | belegt (KI: wie T3) | deckt sich · ZS2, ZS5, W22 | schon drin: keine Namen von Mitbewerbern (R4) |

### 3.4 Schreibhandwerk (S1 bis S5)

Die Kürzel S1 bis S5 dieser Tabelle sind Punkte der Checkliste, nicht die Grundsätze S1 bis S5 aus Semester 3. In den Spalten «Abgleich» und «Entscheid» meinen S-IDs immer Semester 3.

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **S1** Kurze Sätze | Meinung (Grenzen ohne Menschen-Daten, siehe W1, W2) | deckt sich · W1, W2 | schon drin |
| **S2** Wer macht was womit | Meinung (keine Studie) | deckt sich · W12, ZS1 | schon drin: der Begriff «semantic triples» ist entbehrlich |
| **S3** Bilder und Grafiken | Meinung (Regel laut Google, S-Q5) | deckt sich · S20, S21, ZS10 | schon drin: Fakten nie nur im Bild (ZS10) |
| **S4** Interaktive Teile | Meinung | deckt sich · U10, U14, B13 | schon drin: Formular als Anfrageweg, nicht als KI-Mittel |
| **S5** Eingebettetes YouTube-Video | Recht (DSG Art. 19, Informationspflicht) | fehlt bei uns | anders übernehmen: eigenes `<video>` oder Link (CL3) |

### 3.5 Aktualität (A1 bis A4)

Auch hier: A1 bis A4 sind Punkte der Checkliste. In den Spalten «Abgleich» und «Entscheid» meinen A-IDs Semester 2.

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **A1** Innert 30 Tagen aktualisiert | Meinung (keine Studie, ZS Teil 4) | widerspricht · G19, ZS8 | anders übernehmen: Prüfrhythmus je Inhalt, Datum nur nach Prüfung (CL4) |
| **A2** Angaben aufgefrischt | belegt (KI: ClashEval, ZS-Q11; EBU und BBC, ZS-Q14) | deckt sich · ZS6, ZS13, P6 | schon drin |
| **A3** Beispiele aufgefrischt | Meinung | fehlt bei uns | übernehmen: im Prüfrhythmus (CL4) |
| **A4** Aktuelle Zahlen | belegt (KI: wie A2) | deckt sich · B2, B4, ZS7 | schon drin |

### 3.6 Was Suchende noch fragen (F-A1 bis F-H5)

Die Checkliste begründet diesen Teil mit dem «query fan-out»: Eine KI zerlegt eine Frage in Teilfragen. Das beschreibt Google für seine KI-Funktionen. `[Regel laut Google · KQ-Q6]` Google schreibt im selben Zusammenhang, man brauche für Fan-out-Fragen keine eigenen Seiten (ZS18). `[Regel laut Google · ZS-Q2]`

**A Kernabsicht**

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **F-A1** Antwort in den ersten 150 Wörtern | belegt (Menschen: Nielsen, 2006; Schade, 2018, siehe L1) | deckt sich · ZS4, V1, L1, S13 | schon drin, strenger: im ersten Satz |
| **F-A2** Für wen die Seite ist | Meinung (Bundeskanzlei und Hormozi, siehe V1, A1) | deckt sich · V1, A1, A17 | schon drin |
| **F-A3** Thema in einfachen Worten | Meinung (Bundeskanzlei, siehe V6, W14) | deckt sich · V6, W14 | schon drin |
| **F-A4** «Gut» oder «empfohlen» erklärt | Recht (UWG Art. 3 Abs. 1 lit. b, siehe R2) | deckt sich · R2, K2, W18 | schon drin, strenger: kein Superlativ ohne Beleg |
| **F-A5** Zusammenfassung oder Empfehlung | Meinung | deckt sich · A15 | anders übernehmen: Ende mit nächstem Schritt (A15), kein Schluss, der nur zusammenfasst (K14) |

**B Nachbarthemen**

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **F-B1** Nachbarthemen verlinkt | Meinung (Regel laut Google, S-Q4) | deckt sich · S19, S18, L14 | schon drin |
| **F-B2** Was man vor dem Entscheid wissen muss | Meinung | deckt sich · V10, KW10 | schon drin |
| **F-B3** Begriffe und Beispiele | Meinung (Bundeskanzlei, siehe V6) | deckt sich · V6, W14 | schon drin |

**C Unausgesprochene Fragen**

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **F-C1** Kosten | Recht (PBV, siehe R12, R13) | deckt sich · Q7, R13, R14, CH9 | schon drin: Preis nur mit Freigabe |
| **F-C2** Dauer und Ablauf | Meinung (Hormozi, siehe A4) | deckt sich · A4, ZS9 | schon drin |
| **F-C3** Aufwand für die Kundschaft | Meinung (Hormozi, siehe A1, A5) | deckt sich · A1, A5 | schon drin |
| **F-C4** Risiken und Grenzen | belegt (Menschen: Eisend, 2006, Meta-Analyse, Wirkung mit Bedingungen, CL-Q2) | fehlt bei uns | übernehmen: Grenzen nennen (CL1) |
| **F-C5** Was danach passiert | belegt (Menschen: Harley, 2016, siehe U8) | deckt sich · A15, U8, U19 | schon drin |
| **F-C6** Was man vorher wissen sollte | Recht (PBV: Bedingungen beim Preis, siehe R13; Garantie, siehe R10) | deckt sich · R13, R10, ZS9, KW10 | schon drin |

**D Vergleiche**

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **F-D1** Vergleich mit Alternativen | Meinung (Christensen u. a., siehe KW9) | deckt sich · KW9, A12 | schon drin: Wege vergleichen, nicht Firmen |
| **F-D2** Vergleich als Tabelle | Meinung (Regel laut Microsoft, ZS-Q5) | deckt sich · ZS11 | schon drin |
| **F-D3** Vor- und Nachteile | belegt (Menschen: Eisend, 2006, CL-Q2) | fehlt bei uns | übernehmen: für eigene Wege und Methoden (CL1); Firmen nur nach R4 |
| **F-D4** Konkurrenz und Alternativen benannt | Recht (UWG Art. 3 Abs. 1 lit. e, siehe R4) | widerspricht · R4, A22 | anders übernehmen: Wege und Produktarten nennen, Firmen nur mit Beleg und Freigabe |
| **F-D5** Wann welche Option passt | Meinung | fehlt bei uns | übernehmen: ein Satz, wann ein anderer Weg besser ist (CL1) |
| **F-D6** Nicht «für alle das Beste» | Recht (UWG Art. 3 Abs. 1 lit. b, siehe R2) | deckt sich · R2, A3 | schon drin; Ausschlüsse dazu nach CL1 |

**E Aktualität**

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **F-E1** Sichtbares Datum «zuletzt geprüft» | Meinung (Regel laut Google, ZS-Q4) | deckt sich · ZS7, ZS8, S25 | anders übernehmen: Datum im Block mit Preisen und Zeiten (ZS7); `dateModified` nur gleich wie das sichtbare Datum (S25) |
| **F-E2** Aktuelles Jahr, wo sinnvoll | Meinung (Regel laut Google, S-Q1: veraltete Jahreszahlen im Titel) | deckt sich · ZS7, ZS9 | schon drin: Jahr im Stand-Datum, nicht im Titel nur für die Suche |
| **F-E3** Preise und Angebot aktuell | Recht (PBV, siehe R13) | deckt sich · P6, ZS6, ZS13, CH9 | schon drin |
| **F-E4** Was sich geändert hat | Meinung (Ogilvy, siehe A21) | deckt sich · A21 | schon drin |

**F Je nach Lage**

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **F-F1** Für wen die Empfehlung passt | Meinung | deckt sich · A1, KW7 | schon drin |
| **F-F2** Abschnitte je Zielgruppe | Meinung | fehlt bei uns | nicht übernehmen als Pflicht: nur wenn die Sammlung verschiedene Anlässe zeigt (KW4), dann Seitenplan nach Q5 |
| **F-F3** Antwort je Budget, Ort, Dringlichkeit | Meinung | fehlt bei uns | übernehmen: in CL1, wann ein anderer Weg besser ist |
| **F-F4** Hinweise «passt für» | Meinung | fehlt bei uns | nicht übernehmen: die Zielgruppe steht im Angebotssatz (A1); ein Etikett wiederholt nur (K7) |
| **F-F5** Keine Einheitsantwort | Meinung (Wiebe, siehe KW5) | deckt sich · V10, KW5 | schon drin |

**G Nächste Schritte**

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **F-G1** Was nach dem Lesen tun | Meinung (Miller, siehe A15) | deckt sich · A15, U6 | schon drin |
| **F-G2** Klarer nächster Schritt | Meinung (Miller, siehe A15) | deckt sich · A15, L2, B13 | schon drin |
| **F-G3** Folgefragen beantwortet | Meinung (Wiebe, siehe KW5) | deckt sich · V10, KW5, KW10 | schon drin |
| **F-G4** FAQ für die Zeit nach dem Entscheid | Meinung | deckt sich · KW11, KW12 | schon drin: wenn die Frage in der Sammlung steht |
| **F-G5** Weiterführende Inhalte | belegt (Menschen: Fogg, 2002, siehe B3) | deckt sich · B3, ZS16 | schon drin |
| **F-G6** Keine zweite Suche nötig | Meinung | deckt sich · V10, KW5 | schon drin |

**H Belege und Vertrauen**

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **F-H1** Quellen genannt | belegt (Menschen: wie F-G5); für KI umstritten (GEO gegen C-SEO Bench) | deckt sich · B3, ZS16 | schon drin |
| **F-H2** Eigene Erfahrung | Meinung (Regel laut Google, siehe G16) | deckt sich · G16, ZS14 | schon drin |
| **F-H3** Belege: Fälle, Fotos, Daten, Zitate | belegt (Menschen: Harley, 2016; Spiegel, 2017, siehe B6) | deckt sich · G16, B6, R21 | schon drin |
| **F-H4** Wie Empfehlungen entstehen | Meinung | deckt sich · ZS16, K2 | schon drin |
| **F-H5** Fachwissen sichtbar | Recht (UWG Art. 3 Abs. 1 lit. c, siehe R5) | deckt sich · B9, B11, R5, G24 | schon drin |

### 3.7 Zusatzpunkte der deutschen Bearbeitung (Z1 bis Z4)

| Punkt | Belegstand | Abgleich | Entscheid |
|---|---|---|---|
| **Z1** JSON-LD gültig | Meinung (Regel laut Google, S-Q7); neue strukturierte Daten ohne messbare Wirkung auf KI-Zitate (ZS-Q15, Anbieter) | deckt sich · S23, S25, TI31 | schon drin: für Google, ohne KI-Versprechen (ZS17) |
| **Z2** Alt-Text bei Bildern | Meinung (Regel laut Google, S-Q5) | deckt sich · S20 | schon drin |
| **Z3** `llms.txt` | widerlegt (für Google: wird ignoriert, ZS-Q2, TI-Q10); für andere Dienste unbelegt | widerspricht · ZS17, KQ4 | nicht übernehmen als Pflicht: erlaubt nach TI38, ohne Versprechen |
| **Z4** Markdown-Spiegel | widerlegt (für Google: kein Markdown nötig, ZS-Q2) | widerspricht · ZS17, ZS13 | nicht übernehmen: eine zweite Fassung jeder Seite kann auseinanderlaufen |

---

## 4. Zusammenfassung in Zahlen

Gezählt aus den Tabellen in Teil 3, je Punkt der erste Wert der Zelle. `[Fakt · Teil 3, eigene Zählung]`

**Abgleich mit unseren Grundsätzen**

| Wert | 81 Punkte der Quelle | 4 Zusatzpunkte | alle 85 |
|---|---|---|---|
| deckt sich | 64 | 2 | 66 |
| fehlt bei uns | 14 | 0 | 14 |
| widerspricht | 3 | 2 | 5 |

**Belegstand**

| Wert | 81 Punkte der Quelle | 4 Zusatzpunkte | alle 85 |
|---|---|---|---|
| belegt | 23 | 0 | 23 |
| davon für Menschen gemessen | 17 | 0 | 17 |
| davon für KI gemessen | 6 | 0 | 6 |
| Meinung | 47 | 2 | 49 |
| Recht | 10 | 0 | 10 |
| widerlegt | 1 | 2 | 3 |
| überholt | 0 | 0 | 0 |

**Entscheid**

| Wert | alle 85 |
|---|---|
| schon drin | 63 |
| übernehmen (CL1 bis CL4) | 6 |
| anders übernehmen | 9 |
| nicht übernehmen | 7 |

**Was die Zahlen sagen** `[Annahme · eigene Deutung]`

1. **Drei von vier Punkten haben wir schon.** 66 von 85 Punkten decken sich mit einem Grundsatz aus Semester 1 bis 4. Die Checkliste bringt vor allem bekannte Regeln für gute Texte in eine neue Reihenfolge.
2. **Belegt heisst meist: für Menschen.** 23 Punkte sind mit einer Studie gestützt, 17 davon durch Lese-, Klick- und Vertrauensstudien mit Menschen. Bei drei davon (B4, T5, F-H1) ist die Wirkung auf KI umstritten, bei T2 nur übertragen. Für KI-Antworten gemessen sind 6 Punkte, und auch dort meist an vorgegebenen Quellen oder im Abruf, nicht an der Auswahl durch einen echten Dienst (ZS20, KQ10).
3. **Jeder achte bis neunte Punkt ist Recht.** Bei 10 Punkten entscheidet nicht die Wirkung, sondern UWG, PBV oder DSG. Die Quelle selbst nennt kein Schweizer Recht; erst die deutsche Bearbeitung weist auf UWG und PBV hin.
4. **Widersprüche sitzen dort, wo die Checkliste für Maschinen statt für Menschen schreibt:** Datum alle 30 Tage, FAQ-Daten, `llms.txt`, Markdown-Spiegel, Namen von Mitbewerbern.
5. **«Überholt» kommt nicht vor.** Das FAQ-Rich-Result, auf das B3 zielte, ist zwar seit 07.05.2026 abgeschafft (S26). B3 steht aber unter «widerlegt», wie in ZS Teil 4, weil die Checkliste FAQ-Daten als Mittel für KI-Suchen führt.

---

## 5. Was wir aus der Checkliste lernen

Vier Lücken sind es wert, geschlossen zu werden. Sie stehen hier als Vorschlag für neue Grundsätze. Jede Regel kann ein Werkzeug oder ein Bewerter ohne Vorwissen entscheiden. Grenzwerte ohne Studie sind `[Annahme]`. Neu prüfen: CL2 und CL3 alle 6 Monate, weil sich Plattformen und Player ändern. `[Annahme]`

- **CL1 Grenzen und andere Wege.** Jede Leistungsseite nennt 1 bis 3 Fälle, in denen die Leistung nicht passt oder ein anderer Weg besser ist, je als ganzen Satz mit Bedingung. Beispiel, erfunden: «Pneus über 20 Zoll wechselt die Garage Muster in Musterdorf nicht; dafür ist ein Reifenhändler mit Spezialmaschine besser.» Jeder Fall stammt aus den Fakten des Betriebs. 0 Mitbewerber mit Namen, 0 Abwertung (R4). Prüffrage für Bewerter: Finde ich einen Satz, der sagt, wann ich hier nicht richtig bin? Werkzeug: mehr als 3 solche Sätze je Seite ist eine Warnung. Aus F-C4, F-D3, F-D5, F-F3. `[Fakt · CL-Q2: zweiseitige Werbung wirkt je nach Menge und Lage der negativen Angaben, mit einem umgekehrt U-förmigen Verlauf; nur Zusammenfassung gelesen; Meinung · The AI Search Checklist; Zahl 1 bis 3: Annahme]`
- **CL2 Profile verlinkt und gleich ausgezeichnet.** Hat der Betrieb Profile auf fremden Plattformen (Unternehmensprofil, Social Media, Verband), steht jedes Profil, das die Website verlinkt, auch in `sameAs` der strukturierten Daten (S23). `sameAs` enthält 0 Adressen, die nicht sichtbar verlinkt sind (S25). Nur Links, 0 eingebettete Feeds (CL3). Ohne Profile ist die Regel nicht anwendbar; kein Profil wird nur für diese Regel angelegt. Werkzeug: Links auf Plattform-Domains gegen `sameAs` abgleichen. Aus B14. `[Regel laut Google · CL-Q3: sameAs empfohlen, 08.09.2026; Verweis S25, P19, KQ11; Wirkung auf KI: Annahme]`
- **CL3 Fremde Inhalte erst nach Klick.** Videos liegen als eigene Datei (`<video>`) auf der Website oder stehen als gewöhnlicher Link. Ein Player oder Feed eines fremden Dienstes (YouTube, Vimeo, Instagram) lädt beim Aufruf der Seite nicht, sondern erst nach einem Klick, und die Datenschutzerklärung nennt den Dienst. Werkzeug: im ausgelieferten HTML 0 `iframe`, `video` und `embed` mit fremder Domain. CL3 ergänzt TI34, das fremde Skripte nur zeitlich regelt. Aus B13, E4, S5. `[Fakt · DSG Art. 19 Abs. 2, Information über Empfänger, Quelle KW-Q8 in Semester 2; Regel laut YouTube · CL-Q4: auch der erweiterte Datenschutzmodus lädt von youtube-nocookie.com und verhindert nur die Personalisierung; Laden erst nach Klick und Einordnung der IP-Adresse als Personendatum: Annahme, keine Rechtsauskunft]`
- **CL4 Prüfrhythmus je Inhalt.** Die Text-Akte nennt je Seite den Prüfrhythmus und das Datum der letzten Prüfung. Vorschlag: Preise, Öffnungszeiten und Angebot bei jeder Änderung und mindestens alle 3 Monate; Start- und Leistungsseiten mit Beispielen und Fotos alle 6 Monate; FAQ und Ratgeber jährlich; Rechtsseiten jährlich und bei jeder Gesetzesänderung. Ein sichtbares «geprüft am» ändert sich nur mit dokumentierter Prüfung (ZS8), ein «aktualisiert am» nur mit inhaltlicher Änderung (G19). Werkzeug: Prüfdatum älter als der Rhythmus ist ein Befund. Aus A1, A3. `[Fakt · ZS-Q14: veraltete Angaben unter den häufigen groben Fehlern von KI-Assistenten; ZS-Q11: Modelle übernehmen, was sie lesen; Rhythmus: Annahme, nach der deutschen Bearbeitung der Checkliste, dort als offener Vorschlag]`

**Nicht als neuer Grundsatz nötig:** Alle anderen Punkte, die bei uns fehlen, lassen wir bewusst weg (Teil 6), oder sie gehen in CL1 bis CL4 auf. `[Annahme]`

---

## 6. Wo wir bewusst anders entscheiden

| Punkt der Checkliste | Was sie will | Unser Entscheid | Grund |
|---|---|---|---|
| **A1** «Updated within the last 30 days» | Seite höchstens 30 Tage alt | Prüfrhythmus je Inhalt (CL4); Datum nur nach Prüfung (G19, ZS8) | Keine Studie zur Frist. Modelle bevorzugen Text mit jüngerem Datum, auch wenn das Datum nichts über den Inhalt sagt; ein Datum ohne Änderung täuscht Menschen und Modelle. `[Fakt · ZS-Q12; Regel laut Google · G19]` |
| **B3** FAQ mit `FAQPage` | FAQ-Daten als Mittel für KI-Suchen | Fragen sichtbar beantwortet (ZS12); `FAQPage` darf stehen, ohne Versprechen (ZS17, S26) | FAQ-Rich-Result seit 07.05.2026 abgeschafft. Neue strukturierte Daten hoben die KI-Zitate nicht; Angaben nur in JSON-LD fand im Direktabruf kein Dienst. `[Regel laut Google · S-Q13; Fakt · ZS-Q15; ZS-Q16, beide Anbieter]` |
| **Z3** `llms.txt` | Datei in jedem Hauptordner | erlaubt nach TI38, kein Pflichtpunkt, kein Versprechen (KQ4) | Google Search ignoriert die Datei; John Mueller schrieb, kein KI-System nutze sie. Der Vorschlag nennt keinen Dienst, der fremde `llms.txt` beim Antworten liest. `[Regel laut Google · TI-Q10; Fakt · TI-Q41; TI-Q42]` |
| **Z4** Markdown-Spiegel | jede Seite zusätzlich als Markdown | nicht übernehmen | Google braucht kein Markdown. Eine zweite Fassung jeder Seite verstösst gegen «eine gültige Fassung» (ZS13), sobald ein Preis nur an einer Stelle geändert wird. `[Regel laut Google · ZS-Q2; Verweis ZS13]` |
| **F-D4**, auch F-D3, F-D5, B1 | Mitbewerber beim Namen nennen und vergleichen | Wege, Methoden und Produktarten vergleichen; Firmen nur mit belegten Zahlen, gleicher Leistung und Freigabe (R4, A22) | Vergleichende Werbung ist unlauter, wenn sie unrichtig, irreführend, unnötig herabsetzend oder anlehnend ist. `[Fakt · UWG Art. 3 Abs. 1 lit. e, siehe R4]` |
| **S5**, auch E4, B13 | eingebettetes YouTube-Video | eigenes `<video>` oder Link; fremder Player erst nach Klick (CL3) | Der Player lädt beim Aufruf von Servern von Google, auch im erweiterten Datenschutzmodus. Die Datenschutzerklärung muss Empfänger von Personendaten nennen. `[Regel laut YouTube · CL-Q4; Fakt · DSG Art. 19 Abs. 2; Einordnung: Annahme]` |
| **B2** Kernaussagen-Block | eigener Block «Das Wichtigste» | Antwort im ersten Satz (ZS4, L1) | Ein Block oben, der Text darunter und der Abschluss sagen denselben Kern dreimal; K7 erlaubt zweimal. `[Verweis K7; ZS Teil 9]` |
| **T1** Fragen als Überschriften | Zwischentitel als Fragen | nur echte Kundenfragen aus der Sammlung (U3, S8, ZS12) | Keine Studie zu KI-Zitaten; bei Klicks kein Vorteil für Frage-Titel; Studien zu Frage-Titeln widersprechen sich. `[Fakt · S-Q24 in Semester 3; Verweis U3; ZS Teil 4]` |
| **B14, B15** «Signals E-E-A-T» | Profile und Autor als Rangsignal | Profile und Personen ja (CL2, B11), aber für die Kundschaft, nicht als Signal | E-E-A-T ist laut Google kein Rangfaktor (G26). `[Regel laut Google · G-Q11 in Semester 3]` |
| **E10** Eigene benannte Methode | einen Ablauf mit Markennamen prägen | nur, wenn es den Ablauf gibt; kein Name als Trick (K3) | Eine Anbieter-Auswertung meldet einen Zusammenhang mit Nennungen, nach eigener Aussage nur im zusammengelegten Datensatz und unbestätigt. Zeitraum und Methode nicht gelesen, darum hier ohne Zahl (KQ8). `[Fakt · CL-Q5, Anbieter, Suchauszug]` |
| **F-A5** Zusammenfassung am Ende | Fazit zum Schluss | Ende mit nächstem Schritt (A15) | Ein Schluss, der nur zusammenfasst, gilt als formelhaft (K14). `[Verweis K14; Meinung · WikiProject AI Cleanup, 2026, dort zitiert]` |
| **F-E1** Datum «zuletzt geprüft» im Fuss | ein Datum je Seite | Datum im Block mit Preisen und Zeiten (ZS7), Seitendatum freiwillig | Ein Abschnitt, der allein im Abruf landet, trägt sein Datum mit. Die Bearbeitung der Checkliste zählt ein «Stand» bei einer einzelnen Angabe ausdrücklich nicht. `[Fakt · ZS-Q10; CL-Q1; Ort im Block: Annahme]` |

**Beispiel, erfunden.** Physio Muster in Musterdorf will «KI-tauglich» werden. Nach der Checkliste allein hätte die Seite einen Block «Das Wichtigste», sechs Fragen als Überschriften, `FAQPage`-Daten, ein eingebettetes YouTube-Video, `llms.txt`, einen Markdown-Spiegel und jeden Monat ein neues Datum. Nach diesem Skript steht die Antwort im ersten Satz (ZS4), die Fragen der Kundschaft stehen sichtbar (ZS12), das Übungsvideo liegt als eigene Datei auf der Seite (CL3), ein Satz sagt, wann die Physio Muster nicht die richtige Stelle ist: «Nach einem frischen Unfall gehen Sie zuerst in den Notfall.» (CL1), und das Datum ändert sich nur nach einer Prüfung (CL4). Ob ein KI-Dienst die Seite dann zitiert, entscheidet der Dienst (KQ1, KQ9).

---

## 7. Quellen

Alle abgerufen am 01.11.2026. Datum in Klammern: Stand der Seite laut Anbieter.

**Die Checkliste (Vergleich, kein Beleg)**

- **CL-Q1** Contact: «The AI Search Checklist», 81 Punkte in sechs Teilen, ohne Datum. Meinung, keine Studie. https://www.inboundengineer.io/ai-search-checklist/checklist · Verglichen anhand einer deutschen Bearbeitung mit den englischen Titeln je Punkt und vier Zusatzpunkten (Stand 31.10.2026). Das Original las das Skript «Zitierfähig schreiben» (ZS-Q19).

**Neu für dieses Skript**

- **CL-Q2** Martin Eisend: «Two-sided advertising: A meta-analysis». International Journal of Research in Marketing 23 (2), 187 bis 198, Juni 2006. doi:10.1016/j.ijresmar.2005.11.001. Nur Zusammenfassung gelesen. https://ucrisportal.univie.ac.at/en/publications/two-sided-advertising-a-meta-analysis/
- **CL-Q3** Google Search Central: «Organization (Organization) structured data» (08.09.2026), Tabelle «Recommended properties» mit `sameAs`. Gleich S-Q9 in Semester 3, hier neu gelesen. https://developers.google.com/search/docs/appearance/structured-data/organization
- **CL-Q4** YouTube-Hilfe: «Embed videos & playlists», Abschnitt «Privacy Enhanced Mode» (ohne Datum). https://support.google.com/youtube/answer/171780?hl=en
- **CL-Q5** VisibilityStack: «AI Names Your Brand in Just 43% of Its Own Citations» (ohne Datum gelesen). Anbieter von Messungen zur KI-Sichtbarkeit; nur Suchauszug. https://www.visibilitystack.ai/academy/geo/ai-citation-vs-brand-mention-gap-research
- **CL-Q6** OtterlyAI: «YouTube AI Citation Study 2026». Anbieter; zählt Zitate von YouTube-Videos in KI-Antworten, nicht die Wirkung eines Videos auf einer eigenen Seite; nur Suchauszug. https://otterly.ai/blog/youtube-ai-citation-study-2026/

**Aus den Skripten zitiert, nicht neu gelesen**

- Semester 4: ZS-Q2, ZS-Q4, ZS-Q5, ZS-Q9 bis ZS-Q12, ZS-Q14 bis ZS-Q16, ZS-Q19 («Zitierfähig schreiben»); KQ-Q6 («KI-Antworten und Quellen»); TI-Q10, TI-Q41, TI-Q42 («Technik: crawlen und indexieren»).
- Semester 3: S-Q1, S-Q4, S-Q5, S-Q7, S-Q13, S-Q24 («Titel, Snippet, Struktur»); G-Q11 («Google-Grundlagen»).
- Semester 2: KW-Q8, Datenschutzgesetz (DSG), SR 235.1, Art. 19 («Worte der Kundschaft»); UWG und PBV wie in «Recht und Werbung in der Schweiz».
- Studien zu Menschen, wie bei den Grundsätzen zitiert: Morkes, Nielsen, 1997 (L15); Nielsen, 1997 und 2006 (L4, L1); Schade, 2018 (L1); Pernice, 2017 (L5); Moran, 2016 (L17); Fogg, 2002 (B3); Harley, 2016 (U8, B6); Spiegel, 2017 (B6); Schindler, Yalch, 2006 (B2); Strohmetz u. a., 2002 (B12); Packard, Moore, McFerran, 2018 (B11).
