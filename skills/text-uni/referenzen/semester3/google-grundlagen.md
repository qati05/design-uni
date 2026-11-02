# Google-Grundlagen · Skript Semester 3

Stand 01.11.2026 · Text-Uni, Semester 3 «Google-Suche».

> **Worum es geht:** was Google von einer Website verlangt, was Google als Spam bestraft und woran Google gute Inhalte erkennen will. Dazu die Richtlinien für Quality Rater und was Google über seine Rangsysteme sagt. Das Skript ist der Boden für die anderen Skripte von Semester 3.
>
> **Gelesen am 01.11.2026, online** (Nummern wie in «Quellen» am Ende):
> G-Q1 Search Essentials (Stand 10.12.2025) · G-Q2 Technische Anforderungen (18.12.2025) · G-Q3 Spam-Richtlinien (28.08.2026) · G-Q4 «Creating helpful, reliable, people-first content» (05.10.2026) · G-Q5 Leitfaden zu Inhalten mit generativer KI (01.10.2026) · G-Q6 Blog «Google Search's guidance about AI-generated content» (08.02.2023) · G-Q7 Search Quality Rater Guidelines, Fassung vom 11.09.2025, 182 Seiten · G-Q8 «Search Quality Rater Guidelines: An Overview» (11.2023) · G-Q9 «A guide to Google Search ranking systems» (10.12.2025) · G-Q10 How Search Works, «Ranking results» · G-Q11 SEO-Starter-Guide (10.12.2025) · G-Q12 Blog zum Core-Update und den neuen Spam-Richtlinien (05.03.2024) · G-Q13 Blog «E-A-T gets an extra E» (15.12.2022) · G-Q14 Liste der Dokumentations-Änderungen von Search Central (bis 26.10.2026) · G-Q15 Mitgliedstaaten des EWR, EDA.
>
> **Nicht gelesen:** die Rater-Richtlinien ganz (gelesen: 0.1, 2.3, 2.5.3, 3.3.2, 3.3.5, 3.4, 3.4.1, 4.5.1, 4.6.5, 4.6.6, Beispiele für kleine Betriebe, Änderungsliste). Den Blogeintrag vom August 2026 zum Seitenruf im EWR habe ich nicht gelesen, nur die geänderte Richtlinie.
>
> **Nicht gefunden:** eine Studie mit Menschen, die zeigt, wie stark einzelne Punkte dieses Skripts die Rangfolge ändern. Google veröffentlicht keine Gewichte. Was dazu steht, ist `[Annahme]`.
>
> Herkunft: `[Fakt · Quelle, Datum]`, `[Annahme]`, `[Meinung · Autor]`. **`[Regel laut Google · Quelle, Datum]`** heisst: So steht es bei Google. Das ist ein Fakt über Googles Absicht und Regeln. Ein Beleg, dass eine Seite dadurch höher steht, ist es nicht.

**Boden aus Semester 1 und 2.** Was dort steht, gilt hier und wird nur mit der ID zitiert: nichts erfinden (B8, R1), keine Superlative ohne Beleg (R2), Stimmen echt und mit Zustimmung (R7), Bewertungsschnitt mit Anzahl, Plattform und Datum (B4, R8), Fachwissen bei der Person (B11), vollständige Firma (R23), Kein Heilversprechen und Gesundheitsberufe sachlich (R17, R19), Merkmale von KI-Text (K1 bis K17), keine erfundene Frage (KW12).

**Abgrenzung.** Titel, Beschreibung, Überschriften, Links, Bilder und strukturierte Daten stehen im Skript «Titel, Snippet, Struktur». Unternehmensprofil und Bewertungen auf Google stehen in «Lokal und Profil». Suchabsicht und Ortsseiten im Detail stehen in «Suchabsicht und Seitenplan». Search Console steht in «Messen». KI-Suche ist Semester 4.

**Schreibweise der Beispiele.** Das Floskel-Werkzeug prüft auch dieses Skript. Floskeln stehen darum mit Mittelpunkt im Wort, etwa «ganz·heitlich». Alle Betriebe in den Beispielen sind erfunden.

---

## 1. Grundbegriffe

- **Search Essentials:** Googles Grundregeln für alles, was in der Suche erscheinen soll. Drei Teile: technische Anforderungen, Spam-Richtlinien, wichtigste Best Practices. `[Regel laut Google · G-Q1, 10.12.2025]`
- **Rangsysteme:** automatische Systeme, die viele Faktoren und Signale auswerten und so die Reihenfolge der Treffer bestimmen. Sie arbeiten vor allem auf Ebene der einzelnen Seite. Signale für die ganze Website fliessen auch ein. `[Regel laut Google · G-Q9, 10.12.2025]`
- **Spam:** Techniken, die Menschen täuschen oder die Suche manipulieren sollen, damit ein Inhalt weiter oben steht. Seit Mai 2026 gilt das ausdrücklich auch für Versuche, die KI-Antworten in der Google-Suche zu lenken. `[Regel laut Google · G-Q3, 28.08.2026; G-Q14, Mai 2026]`
- **Manuelle Massnahme:** Ein Mensch bei Google prüft eine Website und stuft sie zurück oder entfernt sie. Die Website erfährt es in der Search Console. `[Regel laut Google · G-Q3]`
- **Quality Rater:** Menschen, die im Auftrag von Google Suchergebnisse nach festen Richtlinien bewerten. Rund 16 000 Personen, angestellt bei externen Firmen. `[Fakt · G-Q8, 11.2023]`
- **E-E-A-T:** Experience, Expertise, Authoritativeness, Trust. Auf Deutsch hier: Erfahrung, Fachwissen, Ansehen, Vertrauen. Das zweite E für Erfahrung kam am 15.12.2022 dazu. `[Fakt · G-Q13, 15.12.2022]`
- **YMYL:** «Your Money or Your Life». Themen, bei denen falsche Angaben Gesundheit, Geld, Sicherheit oder das Gemeinwesen ernsthaft schädigen können. `[Fakt · G-Q7, Abschnitt 2.3]`
- **Hauptinhalt:** jeder Teil einer Seite, der direkt ihrem Zweck dient. Dazu zählen Text, Bilder, Werkzeuge wie Rechner, Bewertungen von Kundschaft, Inhalte hinter Reitern sowie Titel und Überschriften. `[Regel laut Google · G-Q4, 05.10.2026]`

---

## 2. Wie man Google-Aussagen liest

### 2.1 Was die Quellen sagen

- **Google beschreibt Absichten, keine Gewichte.** Die Rangsysteme werten «viele Faktoren und Signale» aus. Wie stark ein Faktor zählt, hängt von der Suchanfrage ab. Bei aktuellen Themen zählt Frische mehr als bei Begriffserklärungen. Zahlen zu den Gewichten nennt Google nicht. `[Regel laut Google · G-Q10; G-Q9]`
- **Auch richtige Seiten haben kein Recht auf Aufnahme.** Wer alle Anforderungen erfüllt, wird nicht sicher gecrawlt, indexiert oder angezeigt. `[Regel laut Google · G-Q1; G-Q2]`
- **Rater ändern keine Rangfolge.** Keine einzelne Bewertung kann eine Seite direkt nach oben oder unten schieben. Die Bewertungen messen, ob die Suche gut arbeitet, und liefern Beispiele zum Verbessern. `[Fakt · G-Q7, Abschnitt 0.1]` Google vergleicht das mit Rückmeldekarten in einem Restaurant. Rater-Daten fliessen nicht direkt in die Rangalgorithmen. `[Regel laut Google · G-Q4]`
- **Die Rater-Richtlinien sind keine Anleitung zum ersten Platz.** So schreibt es Google selbst im Leitfaden zu KI-Inhalten. `[Regel laut Google · G-Q5, 01.10.2026]`

### 2.2 Was daraus folgt

- Ein Satz wie «Google belohnt Inhalte mit Erfahrung» ist eine Regel über Googles Absicht. Ob eine Seite deshalb höher steht, zeigt erst eine Messung nach dem Livegang (Doktor D3 im Lehrplan der Text-Uni). `[Annahme, nach dem Lehrplan der Text-Uni]`
- Was ein Such-Agent oder ein Sprachmodell über Rang oder Klickwirkung sagt, heisst «Modell-Urteil». Modelle liegen bei Klickwirkung nahe am Zufall. `[Fakt · ../abgleich-menschen.md, Ye, Yoganarasimhan, Zheng, 2025]`
- Die Google-Regeln sind trotzdem verbindlich, wo es um Spam geht. Wer gegen sie verstösst, riskiert eine Rückstufung oder den Ausschluss. `[Regel laut Google · G-Q3]`

---

## 3. Search Essentials

### 3.1 Technische Anforderungen

Eine Seite kann in den Index, wenn drei Dinge stimmen. `[Regel laut Google · G-Q2, 18.12.2025]`

1. Googlebot ist nicht gesperrt. Seiten hinter einem Login crawlt Google nicht.
2. Die Seite funktioniert und liefert den Status 200. Fehlerseiten kommen nicht in den Index.
3. Die Seite hat indexierbaren Inhalt: Text in einem Format, das Google liest, und kein Verstoss gegen die Spam-Richtlinien.

Dazu zwei Fallen. `[Regel laut Google · G-Q2]`

- Eine Sperre in `robots.txt` verhindert das Crawlen, aber nicht sicher die Anzeige der Adresse. Wer eine Seite aus der Suche halten will, setzt `noindex` und lässt Google die Seite crawlen.
- Die meisten Websites erfüllen diese Anforderungen, ohne es zu wissen. Eine Aufnahme in die Suche kostet nichts, egal was jemand verspricht.

### 3.2 Die wichtigsten Best Practices

Google nennt sieben Punkte. Hier gekürzt und auf Deutsch. `[Regel laut Google · G-Q1]`

1. Hilfreiche, verlässliche Inhalte für Menschen schreiben (Teil 5).
2. Die Wörter verwenden, mit denen Menschen suchen, und sie an sichtbare Stellen setzen: Titel, Hauptüberschrift, Alt-Text, Linktext.
3. Links so bauen, dass Google ihnen folgen kann.
4. Die Website bekannt machen, etwa in Gemeinschaften, in denen Gleichgesinnte sind.
5. Bilder, Videos, strukturierte Daten und JavaScript nach den eigenen Best Practices von Google einsetzen.
6. Darstellungen in der Suche nutzen, die zur Website passen.
7. Inhalte, die nicht in die Suche gehören, mit den passenden Mitteln ausschliessen.

### 3.3 Was daraus für Firmenseiten folgt

- Die Punkte 2, 3 und 5 behandelt das Skript «Titel, Snippet, Struktur».
- Für eine Firmenseite heisst Punkt 2 meist: Leistung und Ort in den Worten der Kundschaft (KW6). Nicht das Fachwort des Betriebs. `[Regel laut Google · G-Q1; Übertragung: Annahme]`
- Google versteht auch verwandte Wörter. Ein Beispiel von Google: Manche suchen «Charcuterie», andere «Käseplatte». Man muss nicht jede Variante schreiben. `[Regel laut Google · G-Q11; G-Q9 zu RankBrain und Neural Matching]`

---

## 4. Spam-Richtlinien

### 4.1 Was die Quellen sagen

Google findet Spam mit automatischen Systemen, darunter SpamBrain, und bei Bedarf durch Menschen. Folge: tiefere Position oder gar keine Anzeige. `[Regel laut Google · G-Q3; G-Q9]` Seit April 2026 kann Google auch Spam-Meldungen von Nutzern für manuelle Massnahmen verwenden. `[Fakt · G-Q14, 14.04.2026]`

Die Richtlinien, die für kleine Betriebe zählen:

| Richtlinie | Was Google darunter versteht | Typische Falle bei kleinen Betrieben |
|---|---|---|
| **Keyword-Stuffing** | Seiten mit Suchwörtern oder Zahlen füllen, oft als Liste, unnatürlich oder ohne Zusammenhang. Google nennt ausdrücklich Textblöcke mit Städten und Regionen, für die eine Seite ranken will, und Listen von Telefonnummern ohne Nutzen. | Fusszeile mit «Wir arbeiten in Ort A, Ort B, Ort C …». Dasselbe Suchwort fünfmal in einem Absatz. |
| **Doorway-Missbrauch** (Doorway abuse) | Seiten oder Websites, die für ähnliche Suchanfragen gebaut sind und Menschen auf Zwischenseiten führen. Beispiele: mehrere Domains oder Seiten je Stadt, die alle auf eine Seite leiten; viele fast gleiche Seiten statt einer klaren Gliederung. | Zwanzig Ortsseiten, die sich nur im Ortsnamen unterscheiden. Zweite Domain mit Ortsnamen, die auf die Hauptseite verweist. |
| **Link-Spam** | Links zu oder von einer Website, die vor allem die Rangfolge beeinflussen sollen. Dazu zählen gekaufte Links, Links gegen Ware oder Leistung, übermässiger Linktausch, Partnerseiten nur zum Verlinken, Links aus Verzeichnissen geringer Qualität, Links in Widgets, weit verteilte Links in Fusszeilen oder Vorlagen fremder Websites. | Linktausch mit Partnern. Bezahlter Eintrag in einem Linkverzeichnis. Ein Link mit Suchwort im Fuss jeder Kundenwebsite einer Agentur. |
| **Skalierter Inhalt** (scaled content abuse) | Viele Seiten, vor allem gemacht, um die Rangfolge zu beeinflussen, mit wenig Wert. Egal ob von Hand, mit KI oder automatisch übersetzt, umformuliert oder zusammengesetzt. | Hundert Ratgeberseiten aus einem Sprachmodell ohne Prüfung. Automatisch übersetzte Seiten ohne Durchsicht. |
| **Missbrauch abgelaufener Domains** | Eine abgelaufene Domain kaufen und mit Inhalt füllen, der vor allem dem Ruf der alten Domain folgen soll und wenig Wert hat. | Die Domain eines eingegangenen Vereins kaufen und darauf Werbeseiten stellen. |
| **Seitenruf** (site reputation policy, früher «site reputation abuse») | Inhalte Dritter auf einer angesehenen Website, vor allem wegen deren Rangsignalen. Inhalte Dritter allein sind kein Verstoss. Google prüft, ob der Gastgeber den Inhalt wirklich führt: Gestaltung, Qualität, genannte Urheberschaft, gleiche Texte auf anderen Websites. | Bezahlter Gastbeitrag eines fremden Anbieters ohne Bezug zum Betrieb auf der eigenen Website, um dessen Ruf zu nutzen. |
| **Versteckter Text und versteckte Links** | Inhalte nur für Suchmaschinen: weisse Schrift auf Weiss, Text hinter Bildern, Text ausserhalb des Bildschirms, Schriftgrösse 0. Erlaubt bleiben Akkordeons, Reiter, Slider, Tooltips und Text nur für Bildschirmleser. | Liste mit Ortsnamen in Hintergrundfarbe. |
| **Kopierter Inhalt** (Scraping) | Fremde Inhalte übernehmen, leicht umformulieren oder zusammenstellen, ohne eigenen Wert. | Texte von Mitbewerbern oder Herstellern übernehmen und Wörter tauschen. |
| **Zurück-Knopf kapern** (seit 13.04.2026) | Die Seite manipuliert den Verlauf des Browsers, sodass der Zurück-Knopf nicht mehr zur vorigen Seite führt. | Skripte, die beim Verlassen weitere Seiten einschieben. |

Alle Zeilen: `[Regel laut Google · G-Q3, 28.08.2026; G-Q12, 05.03.2024; G-Q14]`. Spalte «Typische Falle»: `[Annahme · eigene Übertragung]`.

**Weitere Punkte aus den Richtlinien:**

- Gekaufte oder gesponserte Links sind erlaubt, wenn sie `rel="sponsored"` oder `rel="nofollow"` tragen. `[Regel laut Google · G-Q3]`
- Doppelter Inhalt auf der eigenen Website ist kein Spam. Er ist nur ineffizient. Fremde Inhalte kopieren ist etwas anderes. `[Regel laut Google · G-Q11]`
- Die drei Richtlinien «abgelaufene Domains», «skalierter Inhalt» und «Seitenruf» hat Google am 05.03.2024 angekündigt. `[Fakt · G-Q12]`
- Für Suchende im EWR behandelt Google Verstösse gegen die Seitenruf-Richtlinie seit August 2026 anders: Die betroffenen Teile werden getrennt von der Hauptdomain eingestuft, ohne manuelle Massnahme. Ausserhalb des EWR bleibt die manuelle Massnahme möglich. `[Regel laut Google · G-Q3; G-Q14, 28.08.2026]`

### 4.2 Was daraus folgt

- **Ortsseiten nur mit echtem Bezug.** Eine Seite je Ort ist kein Verstoss an sich. Verdächtig wird sie, wenn sich die Seiten nur im Ortsnamen unterscheiden und alle zur selben Anfrage führen. Eine Ortsseite braucht Inhalt, den es nur für diesen Ort gibt: Adresse, Team vor Ort, Arbeiten dort, Anfahrt, Öffnungszeiten. Das stimmt mit TP1 im Verfahren (SKILL.md) überein. `[Regel laut Google · G-Q3; Liste der Inhalte: Annahme]` Details im Skript «Suchabsicht und Seitenplan».
- **Einsatzgebiet als Satz, nicht als Liste.** «Wir arbeiten im Bezirk Musterland und in den Nachbargemeinden» ist eine Auskunft. Dreissig Ortsnamen im Fuss sind laut Google ein Beispiel für Keyword-Stuffing. Eine Karte oder eine kurze Liste der Gemeinden auf einer eigenen Seite «Einsatzgebiet» dient der Kundschaft. `[Regel laut Google · G-Q3; Form: Annahme]`
- **Keine Links kaufen, keinen Linktausch.** Verzeichnisse und Partner nur, wenn Menschen den Eintrag nutzen. Bezahlte Einträge tragen `sponsored`. `[Regel laut Google · G-Q3; Abgrenzung: Annahme]`
- **Hinweis auf die Gestalter im Fuss.** Google nennt weit verteilte Links in Fusszeilen fremder Websites als Beispiel für Link-Spam. Ein Hinweis «Website: Studio Muster» ohne Suchwort im Linktext und mit `nofollow` vermeidet das Risiko. `[Regel laut Google · G-Q3; Abhilfe: Annahme]`
- **KI-Texte nur mit Prüfung und eigenem Wert.** Siehe Teil 6.

---

## 5. Hilfreiche Inhalte zuerst für Menschen

### 5.1 Die Selbstprüf-Fragen

Google bietet Fragen an, mit denen man den eigenen Inhalt prüfen kann. Hier zusammengefasst, nicht wörtlich. `[Regel laut Google · G-Q4, 05.10.2026]` Google rät, auch Menschen ohne Bezug zur Website ehrlich urteilen zu lassen.

**Inhalt und Qualität**

1. Bietet der Inhalt eigene Information, Recherche oder Analyse?
2. Beschreibt er das Thema gründlich und vollständig?
3. Geht er über das Offensichtliche hinaus?
4. Wenn er auf anderen Quellen aufbaut: Fügt er deutlich Eigenes hinzu, statt nur umzuschreiben?
5. Fasst die Hauptüberschrift oder der Seitentitel den Inhalt hilfreich zusammen?
6. Verzichtet sie auf Übertreibung und Schock?
7. Würde man die Seite speichern, weiterempfehlen oder teilen?
8. Würde man so etwas in einem gedruckten Magazin oder Buch erwarten?
9. Bietet die Seite mehr als andere Seiten in den Suchergebnissen?
10. Gibt es Fehler in Rechtschreibung oder Stil?
11. Wirkt die Seite sorgfältig oder hastig gemacht?
12. Ist der Inhalt in Masse produziert oder über viele Websites verteilt, sodass die einzelne Seite wenig Sorgfalt bekommt?

**Fachwissen**

13. Macht die Darstellung Vertrauen: klare Quellen, sichtbares Fachwissen, Angaben zur Autorin oder zur Website?
14. Würde jemand, der die Website prüft, sie als vertrauenswürdig oder bekannt einschätzen?
15. Hat eine Fachperson oder eine kundige Person den Inhalt geschrieben oder geprüft?
16. Gibt es leicht prüfbare Fehler in den Fakten?

**Menschen zuerst: Ja ist gut**

17. Gibt es eine Kundschaft, die den Inhalt nützlich fände, wenn sie direkt auf die Website käme?
18. Zeigt der Inhalt Erfahrung aus erster Hand, etwa weil man die Leistung selbst erbracht oder den Ort besucht hat?
19. Hat die Website einen klaren Zweck?
20. Weiss man nach dem Lesen genug, um sein Ziel zu erreichen?
21. Geht man zufrieden weg?

**Warnzeichen: Ja ist schlecht**

22. Ist der Inhalt vor allem für Besuche aus Suchmaschinen gemacht?
23. Entstehen viele Inhalte zu vielen Themen in der Hoffnung, dass einige gut laufen?
24. Wird viel automatisiert, um Inhalte zu vielen Themen zu erzeugen?
25. Fasst man vor allem zusammen, was andere sagen?
26. Schreibt man über Trends, nur weil sie Trends sind?
27. Muss man nach dem Lesen noch einmal suchen?
28. Schreibt man auf eine bestimmte Wortzahl hin? Google sagt dazu: Eine bevorzugte Wortzahl gibt es nicht.
29. Ist man in ein Thema eingestiegen ohne echtes Fachwissen, nur wegen der Besuche?
30. Verspricht der Inhalt eine Antwort, die es nicht gibt?
31. Ändert man das Datum, ohne den Inhalt wesentlich zu ändern?
32. Fügt man viel Neues hinzu oder löscht Altes, damit die Website «frisch» wirkt? Google sagt: Das hilft nicht.

### 5.2 Hauptinhalt: vier Eigenschaften

Rater prüfen am Hauptinhalt vier Dinge. `[Regel laut Google · G-Q4]`

- **Aufwand:** wie viel menschliche Arbeit drinsteckt. Seiten aus Feeds oder grosse Mengen KI-Text ohne Durchsicht gelten als ohne Aufwand. Quellenangaben ersetzen den eigenen Aufwand nicht.
- **Eigenständigkeit:** Information oder Sicht, die es anderswo nicht gibt.
- **Können:** klare Sprache, gute Bilder, funktionierende Werkzeuge. Nicht jedes Thema braucht Fachwissen.
- **Genauigkeit:** Informationsseiten stimmen. Bei YMYL-Themen müssen sie sehr genau sein und dem Stand der Fachwelt entsprechen.

### 5.3 Wer, wie, warum

Google schlägt drei Fragen vor: «Who, How, Why». `[Regel laut Google · G-Q4]`

- **Wer** hat den Inhalt gemacht? Ist es für Besucher klar? Gibt es dort einen Namen, wo man ihn erwartet, und führt er zu mehr Angaben über die Person? Erfundene Autorenprofile, KI-Porträts, falsche Namen oder Titel sind Täuschung und ein Zeichen für eine Seite geringer Qualität.
- **Wie** ist der Inhalt entstanden? Bei Tests zum Beispiel: wie viel getestet wurde, mit welchem Ergebnis, mit Fotos als Beleg. Wurde viel automatisiert, hilft eine Angabe dazu, wo Leser sie erwarten.
- **Warum** gibt es den Inhalt? Die richtige Antwort: um Menschen zu helfen, die direkt auf die Website kommen. Wer vor allem für Suchbesuche schreibt, liegt nicht auf der Linie der Rangsysteme. Wer dazu Automatisierung einsetzt, verstösst gegen die Spam-Richtlinien.

### 5.4 Was daraus für Firmenseiten folgt

- **Eigenes zeigt Erfahrung.** Ein kleiner Betrieb hat, was kein Ratgeber hat: eigene Arbeiten, eigene Preise, eigene Abläufe, Fragen der eigenen Kundschaft. Das ist die Erfahrung aus erster Hand, nach der Frage 18 fragt. Belege nach B1 bis B3. `[Regel laut Google · G-Q4; Übertragung: Annahme]`
- **Person sichtbar.** Wer berät, behandelt oder arbeitet, steht mit Namen und Rolle auf der Seite (B11). Keine KI-Porträts, keine erfundenen Namen (B8). `[Regel laut Google · G-Q4]`
- **Keine Wortzahl als Ziel.** Länge folgt der Frage der Kundschaft (L16). `[Regel laut Google · G-Q4; G-Q11]`
- **Datum nur bei echter Änderung.** «Aktualisiert am» ändert sich nur, wenn sich der Inhalt geändert hat. `[Regel laut Google · G-Q4]`
- **Die Fragen sind eine Prüfliste, keine Rangformel.** Wer alle mit dem richtigen Ja oder Nein beantwortet, hat gute Inhalte nach Googles Absicht. Ob die Seite höher steht, ist damit nicht belegt. `[Annahme]`

---

## 6. Inhalte mit KI

### 6.1 Was die Quellen sagen

- **Qualität zählt, nicht die Herstellung.** Google will eigenständige, gute Inhalte belohnen, egal wie sie entstanden sind. Automatisierung an sich ist kein Spam. `[Regel laut Google · G-Q6, 08.02.2023]`
- **Zweck entscheidet.** Wer Automatisierung, auch KI, vor allem einsetzt, um die Rangfolge zu manipulieren, verstösst gegen die Spam-Richtlinien. `[Regel laut Google · G-Q6; G-Q4]`
- **Viele Seiten ohne Wert sind skalierter Inhalt.** Mit KI viele Seiten ohne Wert für Nutzer zu erzeugen, kann gegen die Richtlinie zu skaliertem Inhalt verstossen. `[Regel laut Google · G-Q5, 01.10.2026; G-Q3]`
- **Alles prüfen, auch die Metadaten.** Sprachmodelle rufen keine Fakten ab, sie sagen wahrscheinliche Wortfolgen voraus und können Falsches erfinden. Google verlangt eine Prüfung von Hand vor dem Veröffentlichen. Das gilt auch für Titel, Meta-Beschreibung, strukturierte Daten und Alt-Texte, denn sie können in der Suche erscheinen. `[Regel laut Google · G-Q5]`
- **Herkunft angeben, wo man es erwartet.** Hinweise auf KI helfen bei Inhalten, bei denen Leser fragen würden: «Wie ist das entstanden?» `[Regel laut Google · G-Q4]`
- **Rater bewerten mit «Lowest»,** wenn fast der ganze Hauptinhalt kopiert, umformuliert, eingebettet, automatisch oder mit KI erzeugt ist, mit wenig Aufwand, wenig Eigenem und wenig Nutzen. Das gilt auch, wenn die Quelle genannt ist. `[Fakt · G-Q7, Abschnitt 4.6.6]` Bei Verdacht auf skalierten Inhalt vergeben Rater «Lowest», auch wenn unklar ist, ob KI im Spiel war. `[Fakt · G-Q7, Abschnitt 4.6.5]`

### 6.2 Was daraus folgt

- KI darf beim Schreiben helfen. Jede Zahl, jeder Name, jeder Preis und jede Zusage kommt aus den Fakten des Betriebs und ist von einem Menschen geprüft (B8, R1). `[Regel laut Google · G-Q5; Prüfregel: Annahme]`
- Titel, Beschreibung, Alt-Texte und strukturierte Daten gehören in dieselbe Prüfung wie der Fliesstext. `[Regel laut Google · G-Q5]`
- Ob ein Leser Text als KI-Text erkennt, regelt Semester 1 (K1 bis K17). Google bestraft laut eigener Aussage nicht die Herkunft, sondern fehlenden Wert. `[Regel laut Google · G-Q6]`
- Ob ein Hinweis «mit KI erstellt» auf einer Firmenseite nötig ist, sagt Google nicht verbindlich. Für normale Leistungsseiten erwartet ihn die Kundschaft kaum. Bei Ratgebern, Tests oder Gesundheitsinhalten eher. `[Annahme]`

---

## 7. Richtlinien für Quality Rater

### 7.1 Was die Quellen sagen

**Fassung.** Die aktuelle Fassung ist vom 11.09.2025 und hat 182 Seiten. Neu darin: die YMYL-Begriffe wurden überarbeitet, Beispiele kamen dazu. Im Januar 2025 wurden die Teile zu «Lowest» und «Low» an die Spam-Richtlinien angeglichen. `[Fakt · G-Q7, Anhang 2]`

**Rolle der Rater.** Rater vertreten die Suchenden ihres Landes und ihrer Sprache und müssen beides sehr gut kennen. Sie urteilen nach den Richtlinien, nicht nach eigener Meinung. `[Fakt · G-Q7, Abschnitte 0.1 und 0.2]` Sie bewerten zum Beispiel Paare von Ergebnislisten mit und ohne geplante Änderung. `[Fakt · G-Q8]` Ihre Bewertungen ändern keine einzelne Rangfolge (siehe 2.1).

**E-E-A-T.** `[Fakt · G-Q7, Abschnitt 3.4]`

- **Vertrauen** steht im Zentrum. Eine Seite, der man nicht trauen kann, hat schwaches E-E-A-T, egal wie erfahren sie wirkt.
- **Erfahrung:** Hat die Person das Thema selbst erlebt oder die Leistung selbst genutzt?
- **Fachwissen:** Hat die Person das nötige Wissen oder Können? Beispiel aus den Richtlinien: Rat zur Elektroinstallation von einer gelernten Fachperson statt von einem Liebhaber alter Häuser.
- **Ansehen:** Gilt die Person oder Website als erste Adresse für das Thema? Beispiel aus den Richtlinien: Für die aktuellen Angebote eines lokalen Geschäfts kann sein eigenes Profil die massgebliche Quelle sein.
- Rater stützen sich auf drei Dinge: was die Website über sich sagt, was andere über sie sagen und was auf der Seite sichtbar ist. Interessenkonflikte senken das Vertrauen, etwa «Bewertungen» vom Hersteller selbst.

**YMYL.** `[Fakt · G-Q7, Abschnitte 2.3 und 3.4.1]`

- Vier Arten: Gesundheit oder Sicherheit; finanzielle Sicherheit; Staat, Bürgerrechte und Gesellschaft; Übriges.
- YMYL ist eine Skala. Viele Themen sind es nicht. Klare YMYL-Seiten werden am strengsten geprüft.
- Bei Information und Rat zu klaren YMYL-Themen braucht es oft hohes Fachwissen. Erfahrungsberichte können auch bei YMYL gut sein, solange sie sicher sind und dem Stand der Fachwelt entsprechen. Beispiele aus den Richtlinien: welche Schlafmittel in der Schwangerschaft sicher sind, gehört zu Fachleuten; wie man fürs Alter anlegt, ebenfalls.

**Was Rater bei Firmen-Websites prüfen.**

- **Wer verantwortlich ist und wie man ihn erreicht.** Die meisten Websites sollen zeigen, wer dahintersteht, und Kontaktangaben haben. Websites mit Geld oder sensiblen Daten brauchen ausführliche Kontaktangaben. Eine YMYL-Website ohne jede Angabe zum Betreiber bekommt «Lowest». `[Fakt · G-Q7, Abschnitte 2.5.3 und 4.5.1]`
- **Bewertungen mit Vorsicht.** Viele ausführliche, glaubwürdige, positive Bewertungen sprechen für einen guten Ruf. Aber: Jeder kann Bewertungen schreiben, auch der Betrieb selbst. Ein paar negative sind normal. Der Inhalt zählt, nicht nur die Sterne. `[Fakt · G-Q7, Abschnitt 3.3.2]`
- **Kleine Betriebe ohne Ruf im Netz sind nicht schlechter.** Viele kleine lokale Betriebe sind kaum im Netz und leben von Empfehlungen. Fehlende Information über den Ruf ist weder gut noch schlecht. `[Fakt · G-Q7, Abschnitt 3.3.5]`
- **Beispiel für «High»:** Die Neuigkeiten eines kleinen Hofladens mit eigenem Inhalt bekommen «High». `[Fakt · G-Q7, Beispiele «High: Small business»]`

**Was Google über E-E-A-T und Rangfolge sagt.**

- E-E-A-T selbst ist kein bestimmter Rangfaktor. Die Systeme nutzen eine Mischung von Faktoren, die gutes E-E-A-T erkennen sollen. Bei YMYL-Themen geben sie solchen Inhalten noch mehr Gewicht. `[Regel laut Google · G-Q4]`
- In der Liste der Irrtümer schreibt Google knapp: E-E-A-T für einen Rangfaktor zu halten, ist falsch. `[Regel laut Google · G-Q11]`

### 7.2 Was daraus folgt

- Die Rater-Richtlinien sind eine gute Prüfliste dafür, was Google unter Qualität versteht. Sie sind kein Messgerät für Rang. `[Regel laut Google · G-Q5; G-Q7, 0.1]`
- **Für jeden Betrieb:** Impressum mit vollständiger Firma (R23), Adresse, Telefon, Ansprechperson. Die Seite «Über uns» sagt, wer arbeitet und seit wann. `[Fakt · G-Q7, 2.5.3; Liste: Annahme]`
- **Für YMYL-Betriebe** (Praxis, Therapie, Apotheke, Treuhand, Versicherung, Finanzberatung): Wer schreibt oder prüft, steht mit Ausbildung auf der Seite. Aussagen folgen dem Stand der Fachwelt. Heil- und Erfolgsversprechen bleiben verboten (R17, R19). `[Fakt · G-Q7, 2.3 und 3.4.1; Übertragung: Annahme]`
- **Bewertungen** zeigt man nach B4, B5 und R8. Rater lesen Inhalt und Anzahl. Ein Schnitt von 5,0 aus 3 Bewertungen sagt wenig. `[Fakt · G-Q7, 3.3.2; Übertragung: Annahme]`

---

## 8. Was Google über die Rangsysteme sagt

### 8.1 Was die Quellen sagen

**Fünf Gruppen von Signalen.** Google nennt: Bedeutung der Anfrage, Relevanz, Qualität, Nutzbarkeit, Kontext. `[Regel laut Google · G-Q10]`

- **Bedeutung:** Sprachmodelle erkennen die Absicht und Synonyme.
- **Relevanz:** Das einfachste Signal sind die Suchwörter im Text, etwa in Überschriften oder im Fliesstext. Dazu kommen gesammelte, anonymisierte Daten über die Interaktion mit Ergebnissen.
- **Qualität:** Signale für Fachwissen, Ansehen und Vertrauen. Ein Beispiel: Andere angesehene Websites verlinken oder nennen den Inhalt.
- **Nutzbarkeit:** Wenn sonst alles ähnlich ist, kann eine leichter zugängliche Seite besser abschneiden, etwa schnell und gut am Handy.
- **Kontext:** Ort, Suchverlauf, Einstellungen. Bei «Pizza» zeigt Google Betriebe in der Nähe.

**Einzelne Systeme, die Google nennt.** `[Regel laut Google · G-Q9, 10.12.2025]`

| System | Was es tut laut Google | Bedeutung für kleine Betriebe `[Annahme]` |
|---|---|---|
| BERT, RankBrain, Neural Matching | verstehen Wortbedeutung und Zusammenhang, auch ohne exakte Suchwörter | Natürlich schreiben; keine Wortlisten. |
| Passage Ranking | erkennt einzelne Abschnitte einer Seite | Klare Abschnitte mit eigener Aussage (V2, V4). |
| Deduplizierung | zeigt bei sehr ähnlichen Seiten nur die passendsten | Fast gleiche Seiten bringen nichts. |
| Exact Match Domain | gibt Domains, die genau einer Anfrage entsprechen, nicht zu viel Gewicht | Keine Domain wie «maler-musterdorf-guenstig.ch» kaufen, um zu ranken. |
| Frische | zeigt bei manchen Anfragen neuere Inhalte | Bei Öffnungszeiten, Aktionen, Ferien aktuell sein. |
| Linkanalyse und PageRank | versteht über Links, worum es geht und was hilfreich ist | Echte Erwähnungen statt gekaufter Links. |
| Eigenständiger Inhalt | zeigt Originale vor Seiten, die nur zitieren | Eigene Texte, eigene Fotos. |
| Verlässliche Information | hebt angesehene Seiten, senkt schwache | Belege und Fachpersonen zeigen. |
| Bewertungssystem | belohnt gründliche Tests und Bewertungen von Kundigen | Nur relevant, wer Produkte testet. |
| Vielfalt der Websites | meist höchstens zwei Treffer derselben Website oben | Zwei Seiten zur selben Absicht konkurrieren miteinander. |
| Spam-Erkennung (SpamBrain) | findet Verstösse gegen die Spam-Richtlinien | Teil 4. |

- Das frühere System für hilfreiche Inhalte («Helpful Content Update», 2022) ist seit März 2024 Teil der Kernsysteme. `[Regel laut Google · G-Q9; G-Q12]`
- Google verbessert laufend, auch mit kleineren Kern-Updates. Wer Inhalte verbessert, kann steigen, ohne auf das nächste grosse Update zu warten. `[Regel laut Google · G-Q14, Dezember 2025]`
- Gute Signale für die ganze Website heissen nicht, dass jede Seite gut rankt. Schwache heissen nicht, dass jede Seite schlecht rankt. `[Regel laut Google · G-Q9]`

**Was laut Google nicht zählt oder kaum zählt.** `[Regel laut Google · G-Q11, 10.12.2025]`

- Das Meta-Tag `keywords` nutzt Google nicht.
- Suchwörter im Domainnamen oder im Pfad der Adresse haben allein kaum Wirkung, ausser in der Brotkrumen-Anzeige.
- Die Länge eines Inhalts allein zählt nicht. Es gibt keine Mindest- oder Höchstzahl an Wörtern.
- Reihenfolge und Zahl der Überschriften zählen für Google nicht. Für Bildschirmleser ist die richtige Reihenfolge trotzdem wichtig.
- Doppelter Inhalt auf der eigenen Website führt zu keiner Strafe.
- PageRank ist eines von vielen Signalen.

### 8.2 Was daraus folgt

- Für kleine Betriebe zählen nach Googles Darstellung vor allem drei Dinge: der passende Inhalt zur Anfrage, Vertrauen in den Betrieb und eine Seite, die am Handy gut funktioniert. Wie stark jedes zählt, ist nicht belegt. `[Regel laut Google · G-Q10; Gewichtung: Annahme]`
- Bei lokalen Anfragen spielt der Ort der Suchenden mit. Das Unternehmensprofil behandelt «Lokal und Profil». `[Regel laut Google · G-Q10]`
- Wer Ratschläge zur Rangfolge liest, prüft sie gegen Teil 8.1. Behauptet jemand eine ideale Wortzahl, eine Pflicht zur Überschriften-Reihenfolge für Google oder einen Rangfaktor «E-E-A-T», widerspricht das Google selbst. `[Regel laut Google · G-Q11; G-Q4]`

---

## 9. Wenn in der Schweiz

- **Seitenruf und EWR.** Die Schweiz ist nicht Mitglied des EWR. `[Fakt · G-Q15]` Für Suchende in der Schweiz gilt darum vermutlich die Regel «ausserhalb des EWR»: Ein Verstoss gegen die Seitenruf-Richtlinie kann eine manuelle Massnahme auslösen. Google nennt die Schweiz nicht ausdrücklich. `[Annahme, aus G-Q3 abgeleitet]`
- **Raters vertreten ihr Land.** Ob es Rater für die Deutschschweiz gibt, sagt Google nicht. Die Richtlinien verlangen, dass Rater Sprache und Ort ihrer Aufgabe sehr gut kennen. `[Fakt · G-Q7, 0.2; Lücke: nicht gefunden]`
- **YMYL im Schweizer Alltag.** Zu den klaren YMYL-Themen zählen bei kleinen Betrieben in der Schweiz vor allem Arzt- und Therapiepraxen, Apotheken, Drogerien, Treuhand, Steuerberatung, Versicherungs- und Vorsorgeberatung. Hier gelten zusätzlich die Regeln aus R17 bis R21. `[Annahme, nach G-Q7, 2.3]`
- **Einsatzgebiet in Gemeinden.** In der Schweiz arbeiten Betriebe oft in vielen kleinen Gemeinden. Die Versuchung zur Ortsliste ist gross. Die Liste der Gemeinden gehört höchstens einmal auf eine Seite «Einsatzgebiet», nicht in jede Fusszeile. `[Regel laut Google · G-Q3, Keyword-Stuffing; Form: Annahme]`
- **Mehrsprachige Seiten.** Automatisch übersetzte Seiten ohne Durchsicht können unter «skalierter Inhalt» fallen; Google nennt Übersetzen ausdrücklich als Mittel, um aus fremden Inhalten viele Seiten zu machen. Eigene Seiten in Französisch oder Italienisch braucht jemand, der die Sprache kann und sie prüft. `[Regel laut Google · G-Q3; Prüfregel: Annahme]` Technik dazu im Skript «Titel, Snippet, Struktur».
- **Verzeichnisse.** Google nennt «Verzeichnisse geringer Qualität» als Link-Spam. Ein Eintrag in einem Schweizer Verzeichnis, das Menschen zum Suchen nutzen, ist nach dem Wortlaut nicht gemeint. Details in «Lokal und Profil». `[Regel laut Google · G-Q3; Abgrenzung: Annahme]`

---

## 10. Prüfbare Grundsätze

Jede Regel kann ein Werkzeug oder ein Bewerter ohne Vorwissen entscheiden. Grenzwerte ohne Studie sind `[Annahme]`. Wo «Regel laut Google» steht, ist die Regel über Googles Absicht belegt, die Wirkung auf den Rang nicht.

**Technik und Aufnahme**

- **G1 Erreichbar.** Jede Seite, die in die Suche soll, liefert Status 200, ist nicht durch `robots.txt` gesperrt und trägt kein `noindex`. Seiten, die nicht in die Suche sollen (Danke-Seite, Testseiten), tragen `noindex` und sind nicht in `robots.txt` gesperrt. Werkzeug. `[Regel laut Google · G-Q2]`
- **G2 Kein Versprechen zum Rang.** Kein Text an Kundschaft verspricht einen Platz in Google oder einen Termin für die Aufnahme. Prüffrage: Steht irgendwo «Platz 1», «garantiert gefunden» oder eine Frist? Ja ist ein Befund. `[Regel laut Google · G-Q1: Aufnahme nicht garantiert]`

**Spam**

- **G3 Keine Ortsliste.** Kein Textblock mit mehr als 5 Orts- oder Gemeindenamen hintereinander ausserhalb einer eigenen Seite «Einsatzgebiet». In Fusszeile und Kopf: 0 solche Listen. Werkzeug: Folge von mehr als 5 Ortsnamen, nur durch Komma, «und» oder Zeilenumbruch getrennt. `[Regel laut Google · G-Q3, Keyword-Stuffing; Zahl 5: Annahme]`
- **G4 Kein Suchwort-Stapel.** Dasselbe Suchwort (Leistung plus Ort) steht in einem Absatz höchstens 2-mal. Werkzeug. `[Regel laut Google · G-Q3; Grenzwert: Annahme]`
- **G5 Ortsseite mit eigenem Inhalt.** Jede Ortsseite hat mindestens 3 Angaben, die es nur für diesen Ort gibt (Adresse, Team, Arbeiten vor Ort, Anfahrt, Öffnungszeiten, Ansprechperson). Zwei Ortsseiten teilen höchstens 50 % ihrer Sätze. Werkzeug für den Satzvergleich, Prüffrage für die Angaben. `[Regel laut Google · G-Q3, Doorway-Missbrauch; Zahlen: Annahme]`
- **G6 Keine zweite Domain als Tür.** Keine weitere Domain, die nur auf die Hauptseite weiterleitet oder sie fast gleich wiederholt. Prüffrage an den Betrieb. `[Regel laut Google · G-Q3, Doorway-Missbrauch; G-Q9, Exact Match Domain]`
- **G7 Keine gekauften Links.** Kein Link gegen Geld, Ware, Rabatt oder Gegenlink. Bezahlte oder gesponserte Links tragen `rel="sponsored"` oder `rel="nofollow"`. Werkzeug für Attribute, Prüffrage an den Betrieb. `[Regel laut Google · G-Q3]`
- **G8 Gestalter-Hinweis ohne Suchwort.** Ein Hinweis auf die Gestalter im Fuss nennt nur den Namen, trägt `nofollow` und kein Suchwort im Linktext. Werkzeug. `[Regel laut Google · G-Q3: Fusszeilen-Links als Beispiel für Link-Spam; Abhilfe: Annahme]`
- **G9 Nichts versteckt.** 0 Textstellen mit Schriftgrösse 0, Deckkraft 0, Farbe gleich Hintergrund oder Platz ausserhalb des Bildschirms, ausser Text nur für Bildschirmleser. Werkzeug. `[Regel laut Google · G-Q3]`
- **G10 Kein kopierter Text.** Kein Absatz stimmt zu mehr als 50 % mit einem Text von Mitbewerbern, Herstellern oder Verzeichnissen überein. Herstellerangaben stehen nur als Zitat mit Quelle und mit eigenem Text dazu. Werkzeug: Abgleich mit den Seiten aus TP0. `[Regel laut Google · G-Q3, Scraping; Grenzwert: Annahme]`
- **G11 Keine Masse ohne Wert.** Neue Seiten entstehen nur, wenn eine echte Frage der Kundschaft oder eine echte Leistung dahintersteht (TP1). Prüffrage je Seite: Welche Frage aus der Sammlung (KW1) beantwortet sie? Keine Antwort ist ein Befund. `[Regel laut Google · G-Q3, skalierter Inhalt; G-Q4, Fragen 22 bis 24]`
- **G12 Zurück-Knopf frei.** Kein Skript verändert den Browser-Verlauf so, dass «Zurück» nicht zur vorigen Seite führt. Werkzeug: Seite laden, einmal zurück. `[Regel laut Google · G-Q3, seit 13.04.2026]`
- **G13 Domain-Geschichte geprüft.** Bei einer neu gekauften, früher genutzten Domain ist dokumentiert, was vorher darauf war, und der neue Inhalt hat Bezug zum Betrieb. Prüffrage. `[Regel laut Google · G-Q3, abgelaufene Domains]`
- **G14 Fremde Beiträge nur geführt.** Gastbeiträge Dritter stehen nur, wenn der Betrieb sie redigiert, als solche kennzeichnet und sie zu seinem Angebot passen. Prüffrage: Würde der Beitrag auch ohne den Ruf der Website erscheinen? `[Regel laut Google · G-Q3, Seitenruf]`

**Hilfreicher Inhalt**

- **G15 Selbstprüfung mit Fragen.** Jede Hauptseite ist vor der Freigabe an den Fragen 1 bis 32 aus 5.1 geprüft, von jemandem, der den Text nicht geschrieben hat. Befund: eine Frage aus 22 bis 32 mit Ja, oder eine aus 1 bis 21 mit Nein, ohne Begründung. `[Regel laut Google · G-Q4; Verfahren: Annahme]`
- **G16 Erfahrung aus erster Hand.** Jede Leistungsseite hat mindestens eine Angabe, die nur der Betrieb machen kann: eigenes Foto einer Arbeit, eigener Ablauf, eigene Zahl, eigene Kundenfrage. Prüffrage: Könnte ein Mitbewerber den Abschnitt unverändert übernehmen? Ja ist ein Befund (vgl. K3). `[Regel laut Google · G-Q4, Frage 18 und «Aufwand», «Eigenständigkeit»]`
- **G17 Wer steht dahinter.** Jede Website nennt den Betrieb mit vollständiger Firma, Adresse und Kontakt (R23), und mindestens eine verantwortliche Person mit Name und Rolle. Werkzeug für das Vorhandensein, Prüffrage für die Echtheit. `[Fakt · G-Q7, 2.5.3 und 4.5.1; Regel laut Google · G-Q4, «Who»]`
- **G18 Keine erfundenen Personen.** 0 erfundene Namen, 0 KI-Porträts von Personen, 0 Titel ohne Beleg. Prüffrage an den Betrieb. `[Regel laut Google · G-Q4: Täuschung]`
- **G19 Datum ehrlich.** «Aktualisiert am» ändert sich nur mit einer inhaltlichen Änderung. Prüfung: Unterschied zwischen zwei Fassungen bei geändertem Datum. Nur Datum oder Kleinigkeit ist ein Befund. `[Regel laut Google · G-Q4, Frage 31]`
- **G20 Keine Wortzahl als Ziel.** Kein Auftrag und keine Prüfliste verlangt eine Mindestzahl an Wörtern für die Suche. Länge folgt L16 und V10. `[Regel laut Google · G-Q4; G-Q11]`

**KI**

- **G21 Menschlich geprüft, auch Metadaten.** Jeder Text, an dem KI mitgeschrieben hat, ist vor der Freigabe von einem Menschen auf Fakten geprüft: Fliesstext, Titel, Beschreibung, Alt-Texte, strukturierte Daten. Nachweis: Prüfvermerk mit Datum. `[Regel laut Google · G-Q5]`
- **G22 Herkunft offen, wo erwartet.** Ratgeber, Tests und Gesundheitsinhalte, die zum grossen Teil automatisch entstanden sind, sagen das in einem Satz. `[Regel laut Google · G-Q4, «How»; Auswahl der Seitenarten: Annahme]`

**YMYL**

- **G23 YMYL bestimmt.** Für jede Website ist notiert, ob sie klar YMYL, teilweise oder nicht YMYL ist (Gesundheit oder Sicherheit, Geld, Staat und Gesellschaft). Prüffrage. `[Fakt · G-Q7, 2.3]`
- **G24 Fachperson bei YMYL.** Bei klaren YMYL-Inhalten mit Rat oder Information steht beim Inhalt, wer ihn mit welcher Ausbildung geschrieben oder geprüft hat. Aussagen widersprechen nicht dem Stand der Fachwelt. Prüffrage. `[Fakt · G-Q7, 3.4.1; Regel laut Google · G-Q4, «Genauigkeit»]`

**Lesen und Urteilen**

- **G25 Google-Aussage richtig gekennzeichnet.** Jede Aussage über Google in Skripten, Prüfungen und Berichten trägt «Regel laut Google» oder eine Messung. Aussagen über Rangwirkung ohne Messung tragen `[Annahme]`. Urteile von Such-Agenten heissen «Modell-Urteil». Werkzeug: Kennzeichen zählen. `[Fakt · G-Q7, 0.1; G-Q5; ../abgleich-menschen.md]`
- **G26 Mythen-Probe.** Kein Text, keine Prüfliste und keine Empfehlung stützt sich auf: Meta-Keywords, Suchwort in der Domain als Rangfaktor, ideale Wortzahl, Überschriften-Reihenfolge als Rangfaktor, E-E-A-T als Rangfaktor, Strafe für doppelten Inhalt auf der eigenen Website. Prüffrage. `[Regel laut Google · G-Q11]`

**Wenn in der Schweiz**

- **G27 Übersetzung geprüft.** Jede Seite in einer zweiten Landessprache ist von einer Person geprüft, die diese Sprache sicher beherrscht. Rein automatisch übersetzte Seiten: 0. Nachweis: Prüfvermerk. `[Regel laut Google · G-Q3, Übersetzen als Beispiel für skalierten Inhalt; Prüfregel: Annahme]`
- **G28 Einsatzgebiet einmal.** Die Liste der Gemeinden steht auf höchstens einer Seite. Werkzeug wie G3. `[Regel laut Google · G-Q3; Annahme]`

---

## 11. Quellen

Alle abgerufen am 01.11.2026. Datum in Klammern: Stand der Seite laut Google.

- **G-Q1** Google Search Central: «Google Search Essentials» (10.12.2025). https://developers.google.com/search/docs/essentials
- **G-Q2** Google Search Central: «Google Search technical requirements» (18.12.2025). https://developers.google.com/search/docs/essentials/technical
- **G-Q3** Google Search Central: «Spam policies for Google web search» (28.08.2026). https://developers.google.com/search/docs/essentials/spam-policies
- **G-Q4** Google Search Central: «Creating helpful, reliable, people-first content» (05.10.2026). https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- **G-Q5** Google Search Central: «Google Search's guidance on using generative AI content on your website» (01.10.2026). https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- **G-Q6** Danny Sullivan, Chris Nelson: «Google Search's guidance about AI-generated content». Google Search Central Blog, 08.02.2023. https://developers.google.com/search/blog/2023/02/google-search-and-ai-content
- **G-Q7** Google: «Search Quality Rater Guidelines» (General Guidelines), Fassung vom 11.09.2025, 182 Seiten. https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf
- **G-Q8** Google: «Search Quality Rater Guidelines: An Overview», November 2023. https://services.google.com/fh/files/misc/hsw-sqrg.pdf
- **G-Q9** Google Search Central: «A guide to Google Search ranking systems» (10.12.2025). https://developers.google.com/search/docs/appearance/ranking-systems-guide
- **G-Q10** Google: «How Search Works: Automatically generating and ranking results». https://www.google.com/search/howsearchworks/how-search-works/ranking-results/
- **G-Q11** Google Search Central: «SEO Starter Guide» (10.12.2025). https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- **G-Q12** Google Search Central Blog: «What web creators should know about our March 2024 core update and new spam policies», 05.03.2024. https://developers.google.com/search/blog/2024/03/core-update-spam-policies
- **G-Q13** Google Search Central Blog: «Our latest update to the quality rater guidelines: E-A-T gets an extra E for Experience», 15.12.2022. https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t
- **G-Q14** Google Search Central: «Latest documentation updates» (Einträge bis 26.10.2026). https://developers.google.com/search/updates
- **G-Q15** EDA, Schweizerische Europapolitik: «Mitgliedstaaten». https://www.europa.eda.admin.ch/de/mitgliedstaaten
