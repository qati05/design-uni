# Semester 3 · Prüfung: Snippet-Test (TP5)

Stand 01.11.2026 · Der Prüfauftrag ist nicht Teil dieses Skills · Echte Treffer, eigene Treffer, Bewerterblätter, Schlüssel und Rohantworten liegen nur im Scratchpad der Sitzung, nicht im Repo.

> **Achtung: Modell-Urteil, kein Test mit Menschen.** Alle Zahlen unten stammen von Sprachmodellen als Such-Agenten. Bei Klickwirkung liegen Modelle laut Forschung nahe am Zufall, sie bevorzugen den eigenen Stil, und dieselbe Modellfamilie schrieb die eigenen Treffer und bewertete sie. Der Test belegt darum **keine Klickwirkung** (S29). Er zeigt, ob ein Treffer nach den Grundsätzen neben echten Treffern als hilfreich gelesen wird. `[Fakt · Ye, Yoganarasimhan, Zheng, 2025; Panickssery, Bowman, Feng, 2024; Dubois u. a., 2024; alle laut [../abgleich-menschen.md](../abgleich-menschen.md); Folgerung: Annahme]`

## Ergebnis zuerst

**Bestanden.** In allen 10 Suchen lag der eigene Treffer bei mindestens 5 von 6 Bewertern unter den ersten zwei, in 9 Suchen bei 6 von 6 (59 von 60 Urteilen). Zuerst geklickt wurde er in 52 von 60 Urteilen. Die zwei schlechten Kontroll-Treffer wählte kein Bewerter, weder zuerst noch als zweiten (0 von 12).

**Aber:** Es ist wieder ein Deckeneffekt. Und die Bewerter zeigten **keinen Vorzug für Platz 1**, den Menschen sehr stark haben. Der Test sagt darum wenig darüber, wie viele Klicks ein solcher Treffer an seinem echten Platz bekäme (Abschnitt «Grenzen»).

## Aufbau

| Teil | Wie |
|---|---|
| Suchfragen | 10 aus 5 Branchengruppen (Handwerk, Auto, Gastro und Hotel, Gesundheit und Körperpflege, Treuhand und Möbel), wie sie Kundschaft in der Deutschschweiz stellt |
| Echte Treffer | je 5, aus einer Websuche über ein Suchwerkzeug mit Standort Schweiz am 01.11.2026; Titel, sichtbare Adresse und Beschreibung wie geliefert, mit Tippfehlern. Telefonnummern, Mailadressen und eine Postadresse durch «…» ersetzt; ein Firmenname mit Personennamen durch einen anderen Nachnamen ersetzt. Reihenfolge wie geliefert. |
| Eigener Treffer | je Suche ein erfundener Musterbetrieb mit erfundenen, plausiblen Fakten; geschrieben nach S2 bis S5, S10, S11, S22 und Q7, Q8, Q11; slop-de 0 Fehler. Damit der Name ihn nicht verrät, trug er im Test einen unauffälligen erfundenen Namen statt «Muster». Die Domains lösten am 01.11.2026 im DNS nicht auf. |
| Einfügen | eigener Treffer je Bewerter und Suche an zufälliger Stelle zwischen den echten |
| Kontrollen | 2 Suchen mit einem zusätzlichen schlechten Treffer: «Maler Winterthur» vollgestopft mit Suchwörtern, «Coiffeur Basel» leer («Home», «Will·kommen auf unserer Web·site …») |
| Bewerter | 6 Unteragenten ohne Kontext und ohne die Skripte: 3 × Opus, 3 × Fable 5.1, Stufe hoch; je eigene Reihenfolge der Suchen |
| Frage | «Welchen Treffer klicken Sie zuerst, welchen als zweiten? Ein Satz warum.» |
| Schwelle `[Annahme]` | eigener Treffer unter den ersten zwei bei mindestens 4 von 6, in mindestens 7 von 10 Suchen; schlechter Treffer in beiden Kontrollen höchstens von 1 von 6 zuerst gewählt |

## Zahlen je Suche

| Suche | Absicht | eigener Treffer zuerst | unter den ersten zwei | was sonst gewann |
|---|---|---|---|---|
| Maler Winterthur | lokal | 6/6 | 6/6 | als zweiter immer der alteingesessene Betrieb auf Platz 1 |
| Reifenwechsel Kosten St. Gallen | wissen | 6/6 | 6/6 | als zweiter der Treffer mit Preisen je Rad |
| Restaurant Mittagsmenü Aarau | lokal | 6/6 | 6/6 | als zweiter das Restaurant mit den heutigen Menüs in der Beschreibung |
| Hotel Luzern günstig | tun | **0/6** | 5/6 | zuerst das Buchungsportal (6/6) |
| Physiotherapie ohne Rezept Zürich | wissen | 6/6 | 6/6 | als zweiter der einzige echte Treffer, der «ohne Rezept» beantwortet |
| Coiffeur Basel | lokal | 6/6 | 6/6 | als zweiter das Buchungsportal mit Bewertungen |
| Velogeschäft Bern | lokal | 6/6 | 6/6 | als zweiter ein Laden mit Verkauf und Werkstatt |
| Esstisch nach Mass Schweiz | tun | 6/6 | 6/6 | als zweiter der Konfigurator |
| Steuererklärung ausfüllen lassen Kosten Zürich | wissen | **4/6** | 6/6 | 2 zuerst beim günstigeren Fixpreis |
| Treuhandbüro Luzern | lokal | 6/6 | 6/6 | als zweiter verschiedene |
| **Zusammen** | | **52/60** | **59/60** | Schwelle 7 von 10 Suchen: **10 von 10** |

| Modell | zuerst | unter den ersten zwei |
|---|---|---|
| Opus | 26/30 | 30/30 |
| Fable | 26/30 | 29/30 |

| Kontrolle | zuerst | als zweiten |
|---|---|---|
| vollgestopft, «Maler Winterthur» | 0/6 | 0/6 |
| leer, «Coiffeur Basel» | 0/6 | 0/6 |

## Was die Zahlen trotzdem zeigen

1. **Die Suchabsicht schlägt den besten Text.** Bei «Hotel Luzern günstig» klickten alle zuerst das Buchungsportal: «Bei ‹günstig› vergleiche ich zuerst.» Der eigene Treffer kam auf Platz zwei. Das stützt Q1 und Q16: Wer vergleichen will, will eine Liste, keine einzelne Seite. Steht ein Portal oben, braucht der Betrieb dort einen korrekten Eintrag; mit dem eigenen Treffer allein gewinnt ein Hotel diese Suche nicht. `[Fakt · 6 von 6 Begründungen; Folgerung: Annahme]`
2. **Ein besserer Preis schlägt den besseren Text.** Bei der Steuererklärung nannten auch echte Treffer Fixpreise, zwei davon tiefer. 2 von 6 klickten zuerst den günstigeren («deutlich günstiger, lohnt den Vergleich»). Den tiefsten Preis, der nur beim ersten Auftrag gilt, bemerkten 3 Bewerter; 2 nannten ihn ein Lockangebot. Text macht ein Angebot lesbar, ersetzt es aber nicht (A1). `[Fakt · Begründungen; Folgerung: Annahme]`
3. **Wer die Frage wörtlich beantwortet, gewinnt auch als zweiter.** Bei «Physiotherapie ohne Rezept» wählten alle als zweiten den einzigen echten Treffer, der «ohne Rezept» in der Beschreibung beantwortet, obwohl er nicht der bekannteste war. Das passt zu Q8 und S13. `[Fakt · 6 von 6]`
4. **Begründungen:** Fast jede nennt Preis, Frist, Zeiten oder «beantwortet genau meine Frage». Gegen echte Treffer stand «zählt nur Leistungen auf», «sagt gar nichts», «Keyword-Gestammel», «wirkt wie Lockangebot». Für echte Treffer als zweite Wahl stand oft Alter und Herkunft («seit Generationen», «seit 1974», «bekannter Laden in der Stadt»). `[Fakt · eigene Durchsicht der 60 Begründungen, 01.11.2026]`

## Grenzen

- **Kein Platz-Effekt bei Modellen.** Die erste Wahl verteilte sich über alle Plätze (Platz 1: 13-mal, Platz 6: 12-mal, Platz 3: 11-mal). Menschen klicken Platz 1 viel öfter, auch wenn Platz 2 besser passt; auf Platz 1 entfallen je nach Studie rund 20 bis 28 % der Klicks, auf Platz 10 rund 2,5 %. Der Test misst darum nur den Wortlaut bei gleicher Sichtbarkeit. Eine neue Website steht anfangs selten unter den ersten fünf. `[Fakt · Joachims u. a., 2005; Sistrix, 2020; Advanced Web Ranking, 2026; alle laut [titel-snippet-struktur.md](titel-snippet-struktur.md), Teil 10]`
- **Inhalt statt Wortlaut.** Die eigenen Treffer hatten oft als einzige Preis und Frist. Wie in Semester 1 misst der Test vor allem «konkret schlägt leer». Wo echte Treffer auch Preise zeigten (Reifen, Mittagsmenü, Steuern), gewann der eigene Treffer trotzdem meist; das ist ein schwacher Hinweis, dass die Ordnung im Titel (S2, S5) zählt. `[Annahme]`
- **Echte Ergebnisseite fehlt.** Keine Anzeigen, keine Karte mit Unternehmensprofilen, keine KI-Übersicht, keine Sterne. Genau diese Kästen nehmen Website-Treffern laut Klickdaten viele Klicks, bei lokalen Suchen vor allem die Karte. Welche Suchmaschine hinter dem Werkzeug steht, ist nicht angegeben. `[Fakt · Sistrix, 2020 und 2026; Pew Research Center, 2025; laut titel-snippet-struktur.md]`
- **Google schreibt um.** Laut Anbieter-Messungen ersetzt Google rund 6 von 10 Titeln oder Beschreibungen. Ob der geschriebene Treffer so erscheint, zeigt erst die Search Console nach dem Livegang (M-Grundsätze). `[Fakt · Zyppy, 2022; Ahrefs, 2020; laut titel-snippet-struktur.md]`
- **Kleine Abweichungen von den eigenen Regeln:** 3 Beschreibungen haben 157 bis 159 Zeichen statt höchstens 155 (S12); 2 Titel enthalten keine Zahl, nur einen Gegenstand (S5).
- **Erfundene Fakten.** Preise und Fristen der Musterbetriebe sind erfunden. Auf einer echten Kundenseite gilt nur, was belegt ist (Grundregel «keine erfundenen Fakten», R14).
- **Ich habe Treffer, Kontrollen und Schlüssel selbst geschrieben.** Die Bewerter kannten weder die Skripte noch den Zweck.

## Für Semester 4 und den Bachelor `[Vorschlag]`

1. **Echte Ergebnisseite nachbauen:** mit Kartenblock, Sternen und einer KI-Übersicht, und den eigenen Treffer auf realistischen Plätzen (6 bis 10). Dann misst der Test, ob der Text gegen Platz und Kästen ankommt.
2. **Zwei gute Treffer gegeneinander**, gleiche Fakten, nur der Titel anders (Preis vorne gegen Frist vorne, mit und ohne Ort), damit eine Rangfolge entsteht.
3. **Ein Test mit Menschen**, wenigstens 10 Personen, dieselben Ergebnisseiten, um die Modell-Bewerter zu eichen.
4. **Nach dem ersten Livegang** Klickrate je Seite aus der Search Console mit dem Testurteil vergleichen (M-Grundsätze).
