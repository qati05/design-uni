# Suchabsicht und Seitenplan · Skript Semester 3

> **Worum es geht:** Was Menschen mit einer Suche wollen (wissen, tun, gehen, lokal), wie man ihre Suchbegriffe ohne Bezahlwerkzeug findet, wie daraus ein Antwort-Plan mit einer Seite je Absicht entsteht und wann eine Ortsseite echten Bezug hat und wann sie eine Doorway-Seite ist. Dazu eine eigene Analyse der obersten Treffer zu 10 Suchfragen aus 5 Branchen in der Deutschschweiz, nur als Kennzahlen.
>
> **Gelesen am 01.11.2026, online** (Nummern wie in «Quellen» am Ende):
> Q-Q1 Google, «So ermittelt Google das Ranking von Suchergebnissen» (How Search works), ganze Seite · Q-Q2 Search Central, «In-Depth Guide to How Google Search Works», Abschnitt «Serving search results» · Q-Q3 Search Quality Rater Guidelines, Fassung 2025, Teil 12.7, 16.1 und 22.0 im Wortlaut, übrige Teile nur im Inhaltsverzeichnis · Q-Q4 Search Central, «Spam Policies», Abschnitte «Doorway abuse» und «Scaled content abuse» · Q-Q5 Search Central, «Creating helpful content», nur die Stelle zur Wortzahl · Q-Q6 Search Central, «Consolidate duplicate URLs», Einleitung · Q-Q7 Search Central, «Localized versions», Einleitung und hreflang-Werte · Q-Q8 Google-Suche-Hilfe, «How Google autocomplete predictions work» · Q-Q9 Search-Console-Hilfe, «Performance report», Grundbegriffe · Q-Q10 Google-Unternehmensprofil-Hilfe, «Tips to improve your local ranking» · Q-Q11 Google-Trends-Hilfe, «Trends-Suchbegriffe vergleichen», Suchauszug · Q-Q12 Backlinko (Dean), «We Analyzed 4 Million Google Search Results», ganzer Artikel · Q-Q13 eigene Analyse vom 01.11.2026 (Teil 6).
>
> **Nicht gelesen:** die Rater Guidelines im Volltext (182 Seiten), die Hilfe zu «Ähnliche Fragen» und «Verwandte Suchen» (eine eigene Google-Seite dazu habe ich nicht gefunden), die vollständige Fragenliste in «Creating helpful content». Was dazu hier steht, ist als `[Annahme]` oder `[Beobachtung]` markiert.
>
> **Wie stark die Belege sind:** Was Google schreibt, ist eine Regel über Googles Absicht. Ein Beleg dafür, wie eine Seite tatsächlich rankt, ist es nicht. Die Rater Guidelines sind Anweisungen an Menschen, die Ergebnisse bewerten; Google nennt ihr Feedback als Hilfe für die Qualität der Systeme `[Fakt · Q-Q1, Abschnitt «Qualität der Inhalte»]`, nicht als Rangfaktor. Die eigene Analyse ist eine Momentaufnahme von 50 Treffern über eine Websuche, deren Suchmaschine das Werkzeug nicht nennt (Teil 6.1). Backlinko ist Verhaltensdaten aus Search Console, ohne Zufallszuteilung, von einem Anbieter mit Eigeninteresse.
>
> **Herkunft:** `[Fakt · Quelle, Stelle]` belegt; `[Beobachtung · Q-Q13]` aus der eigenen Analyse, gezählt, aber kleine Stichprobe; `[Annahme]` eigene Ableitung oder Arbeitsgrenze; `[Meinung · Autor]` Urteil einer Person.

**Schreibweise der Beispiele.** Das Floskel-Werkzeug prüft auch dieses Skript. Darum steht in jeder Floskel, die es melden würde, ein Mittelpunkt im Wort, etwa «güns·tig». Alle Musterbetriebe, Preise und Zahlen in den Beispielen sind erfunden. Echte Treffer stehen nur als Kennzahlen da; Rohdaten liegen nicht im Repo.

**Was hier nicht steht.** Titel, Beschreibung und strukturierte Daten im Einzelnen regelt `titel-snippet-struktur.md` (S…), das Unternehmensprofil und Verzeichnisse `lokal-und-profil.md` (P…), das Messen nach dem Livegang `messen-search-console.md` (M…). Kundenworte sammeln und sortieren regelt Semester 2 (KW1 bis KW5), Fachwort gegen Kundenwort KW6, den Ersetzungstest K3.

---

## 1. Grundbegriffe

| Begriff | Bedeutung hier |
|---|---|
| **Suchbegriff** | Was jemand in das Suchfeld tippt, z. B. «Maler Winterthur». |
| **Suchabsicht** | Was die Person mit der Suche erreichen will. Google nennt es «die Absicht hinter deiner Suchanfrage» `[Fakt · Q-Q1, «Bedeutung deiner Suchanfrage»]`. |
| **Begriffsgruppe** | Suchbegriffe mit derselben Absicht, die dieselbe Seite beantworten kann, z. B. «Coiffeur Basel» und «Friseur Basel». |
| **Antwort-Plan** | Tabelle: je Begriffsgruppe genau eine Seite, mit Absicht und Kernantwort. Prüfpunkt TP1 im Verfahren (SKILL.md). |
| **Kannibalisierung** | Zwei eigene Seiten zielen auf dieselbe Begriffsgruppe. Das Wort stammt aus der SEO-Praxis, nicht von Google `[Annahme]`. |
| **Ortsseite** | Seite für einen Ort, an dem der Betrieb arbeitet, aber nicht unbedingt sitzt. |
| **Doorway-Seite** | Seite, die nur gebaut ist, um für ähnliche Suchbegriffe zu ranken, und dann weiterleitet `[Fakt · Q-Q4, «Doorway abuse»]`. |

## 2. Suchabsicht: wissen, tun, gehen, lokal

### Wie Google es beschreibt

- **Bedeutung zuerst.** Um relevante Ergebnisse zu liefern, müsse Google zuerst herausfinden, wonach die Person sucht. Sprachmodelle erkennen die passenden Inhalte auch bei wenigen Wörtern; ein Synonymsystem findet Inhalte, die andere Wörter verwenden (Beispiel «ändern» gegen «einstellen»). `[Fakt · Q-Q1, «Bedeutung deiner Suchanfrage»]`
- **Kontext aus der Anfrage.** Google nennt vier Hinweise: Suchbegriffe (z. B. «bilder»), Sprache der Anfrage, lokale Relevanz (Beispiel «pizza» zeigt Lieferdienste in der Nähe) und Aktualität. `[Fakt · Q-Q1, «So erkennt die Google Suche den Kontext»]`
- **Gewichtung je Anfrage.** Die Gewichtung der Faktoren hängt von der Art der Anfrage ab. `[Fakt · Q-Q1, Einleitung]`
- **Ort, Sprache, Gerät.** Die Relevanz hängt von Hunderten Faktoren ab, darunter Standort, Sprache und Gerät. «Bicycle repair shops» liefert in Paris andere Treffer als in Hongkong und zeigt eher lokale Ergebnisse als Bilder. `[Fakt · Q-Q2, «Serving search results»]`
- **Wortvorkommen.** Kommen Suchbegriffe in Überschriften oder im Text vor, ist eine Seite eher relevant. Google sucht aber nach mehr als dem Wort selbst und nutzt anonymisierte Interaktionsdaten. `[Fakt · Q-Q1, «Relevanz der Inhalte»]`

### Die Kategorien der Rater Guidelines

Die Rater Guidelines teilen Absichten in vier Gruppen. Sie sagen selbst, die Grenze sei oft unscharf und viele Anfragen passten in mehrere Gruppen. `[Fakt · Q-Q3, 12.7 und 12.7.2]`

| Rater Guidelines | Hier | Bedeutung laut Q-Q3 | Beispiel Deutschschweiz |
|---|---|---|---|
| Know (Know Simple) | **wissen** | Information zu einem Thema; Know Simple: eine kurze, klare Antwort | «Reifenwechsel Kosten», «Physiotherapie ohne Rezept» |
| Do | **tun** | ein Ziel erreichen: kaufen, herunterladen, beschaffen, buchen | «Esstisch nach Mass bestellen», «Hotel buchen» |
| Website | **gehen** | eine bestimmte Website oder Seite finden | Firmenname, «search.ch» |
| Visit-in-Person | **lokal** | etwas in der Nähe besuchen, einen bestimmten Betrieb oder eine Art von Betrieb | «Maler Winterthur», «Coiffeur Basel» |

`[Fakt · Q-Q3, 12.7, 12.7.2, 12.7.3, 12.7.4; deutsche Namen Annahme]`

- **Zwei starke Absichten.** Manche Anfragen haben zugleich «zur Website» und «vor Ort besuchen»; ein Treffer, der nur eine bedient, bekommt dort nicht die Höchstnote. `[Fakt · Q-Q3, 16.1]`
- **Wie nah ist nah.** Bei lokaler Absicht ohne Ort in der Anfrage sind Treffer nahe der Person am hilfreichsten. Für eine Tankstelle fährt man nicht weit, für eine spezialisierte Klinik weiter. `[Fakt · Q-Q3, 22.0]`
- **Lokale Rangfolge im Profil.** Für lokale Ergebnisse nennt Google Relevanz, Entfernung und Bekanntheit; Bekanntheit stützt sich u. a. auf Links und Zahl der Bewertungen. `[Fakt · Q-Q10]` Einzelheiten in `lokal-und-profil.md`.

### Was das für eine KMU-Seite heisst

- **Die meisten KMU-Suchen sind gemischt.** In allen 10 Fragen der Analyse steht ein Ort; 7 davon haben lokale Absicht, fast immer zusammen mit wissen oder tun (Teil 6.2). `[Annahme; Einteilung nach Q-Q3]`
- **Ein Preiswort zeigt «wissen».** «Kosten» oder «güns·tig» in der Anfrage heisst: zuerst eine Zahl. In den 3 Preisfragen nannten 8 von 15 Beschreibungen einen Preis, in den 7 übrigen Fragen 4 von 35. `[Beobachtung · Q-Q13]`
- **Ein Ort zeigt nicht immer Nähe.** «Hotel Luzern» meint das Reiseziel, «Esstisch nach Mass Schweiz» die Herkunft. Hier zählt Nähe zur suchenden Person kaum. `[Annahme, gestützt auf Q-Q3, 12.4 «Queries with an Explicit Location», nur Titel gelesen]`
- **Absicht ablesen statt raten.** Welche Art Treffer oben steht, zeigt, wie die Suchmaschine die Absicht deutet: Bei «Hotel Luzern güns·tig» waren alle 5 obersten Treffer Portale, Vergleicher oder die Tourismusstelle, bei «Steuererklärung ausfüllen lassen Kosten Zürich» alle 5 Betriebe. `[Beobachtung · Q-Q13; Schluss Annahme]`

## 3. Suchbegriffe finden ohne Bezahlwerkzeug

Reihenfolge nach Aufwand. Jede Quelle liefert Wörter für die Sammlung aus Semester 2 (KW1, KW4) und Begriffe für den Antwort-Plan.

| Quelle | Was sie liefert | Grenze | Herkunft |
|---|---|---|---|
| **Fragen der Kundschaft** | echte Wörter und Fragen vor dem Kauf: Telefon, Mail, Bewertungen | ohne Suchvolumen; Personendaten nicht übernehmen | KW1 bis KW5, KW3 |
| **Autovervollständigung** | Vorschläge beim Tippen; sie spiegeln echte Suchen, berücksichtigen Sprache, Herkunft der Anfrage und Trends | keine Zahlen; Vorschläge sind keine Suchergebnisse | `[Fakt · Q-Q8]` |
| **«Ähnliche Fragen»** | Fragen, die Google zur Anfrage aufklappt | nicht bei jeder Anfrage; Inhalt wechselt | `[Annahme; keine Google-Dokumentation gelesen]` |
| **«Verwandte Suchen»** | Begriffe am Ende der Trefferseite, oft mit Ort oder Preiswort | keine Zahlen | `[Annahme]` |
| **Oberste Treffer** | Art der Treffer zeigt die Absicht; Titel zeigen, welche Wörter die Betriebe nutzen | Momentaufnahme | Teil 6 |
| **Google Trends** | Begriffe vergleichen, bis 8 Gruppen gleichzeitig; nützlich für Wortpaare wie «Velo» gegen «Fahrrad» | nur relative Werte, bei seltenen Begriffen leer | `[Fakt · Q-Q11, Suchauszug]` |
| **Search Console** | nach dem Livegang: Klicks, Impressionen, Klickrate und mittlere Position je Suchanfrage und Seite; Standard drei Monate | erst mit Daten; zeigt nur Anfragen, bei denen die Seite erschien | `[Fakt · Q-Q9]` |

### Vorgehen für einen kleinen Betrieb

1. **Kundenwörter zuerst.** Die drei häufigsten Anlässe und Fragen aus der Sammlung (KW5) sind die ersten Kandidaten. `[Annahme]`
2. **Jeden Kandidaten tippen.** Im privaten Fenster, mit Ort, und die Vorschläge notieren: Was hängt die Suche an («Kosten», «ohne Termin», «Notfall»)? Der Standort beeinflusst die Vorschläge `[Fakt · Q-Q8]`, darum am Standort des Betriebs oder mit Ort im Begriff suchen. `[Annahme]`
3. **Trefferseite lesen.** Für jeden Kandidaten die obersten 5 Treffer nach Art einteilen (Betrieb, Verzeichnis, Portal, Ratgeber, Amt), «Ähnliche Fragen» und «Verwandte Suchen» abschreiben. `[Annahme]`
4. **Wortpaare prüfen.** Bei regionalen Wörtern (Pneu, Velo, Coiffeur, Metzgerei) beide Formen suchen und die Treffer vergleichen (Teil 7). `[Annahme]`
5. **Nach dem Livegang** die Search Console lesen und den Plan nachführen (`messen-search-console.md`). `[Annahme]`

## 4. Antwort-Plan: eine Seite je Absicht

### Regel

- **Eine Begriffsgruppe, eine Seite.** Jede Begriffsgruppe hat genau eine Zielseite; jede Seite hat eine Hauptabsicht. Das ist Prüfpunkt TP1 im Verfahren (SKILL.md) («0 Begriffe auf zwei Seiten»). `[Annahme; Entscheid im Lehrplan der Text-Uni]`
- **Warum.** Google erkennt sehr ähnliche Seiten und wählt dann selbst, welche es zeigt; eine bevorzugte Seite anzugeben hilft, Signale wie Links auf eine Adresse zu bündeln. `[Fakt · Q-Q6]` Dass zwei eigene Seiten sich gegenseitig Plätze kosten, sagt Google so nicht. `[Annahme]`
- **Keine Seite nur für ein Wort.** Viele fast gleiche Seiten für ähnliche Anfragen nennt Google Doorway-Missbrauch («substantially similar pages that are closer to search results than a clearly defined, browseable hierarchy»). `[Fakt · Q-Q4]`
- **Gruppieren nach gleichen Treffern.** Zeigen zwei Begriffe fast dieselben obersten Treffer, deutet die Suchmaschine sie gleich; dann gehören sie auf eine Seite. Beispiel: «Coiffeur Basel» und «Friseur Basel» teilten 7 der obersten 8 Adressen. `[Beobachtung · Q-Q13; Regel Annahme]`

### Vorlage

| Begriffsgruppe | Hauptabsicht | Zielseite | Kernantwort im ersten Satz | Belege auf der Seite | Quelle der Begriffe |
|---|---|---|---|---|---|
| Pneuwechsel St. Gallen, Reifenwechsel St. Gallen, Radwechsel Kosten | wissen + lokal | /pneuwechsel | Preis für 4 Räder, ohne Termin, Dauer | Preisliste, Öffnungszeiten | Telefon (KW), Vorschläge, Treffer |
| Garage St. Gallen-Winkeln, Autoservice Winkeln | lokal | / (Startseite) | Was, wo, wann offen | Adresse, Karte, Bewertungen | Treffer, Profil |

Beispiel: Garage Muster AG, St. Gallen-Winkeln (erfunden). `[Annahme]`

### Ablauf

1. Begriffe aus Teil 3 in Gruppen ordnen (gleiche Absicht, ähnliche Treffer).
2. Jeder Gruppe eine bestehende oder neue Seite zuweisen. Neue Seite nur, wenn die Gruppe eine eigene Absicht hat, die keine bestehende Seite beantwortet. `[Annahme]`
3. Doppelte Zuweisung suchen: Steht ein Hauptbegriff zweimal in der Spalte «Zielseite», Seiten zusammenlegen oder Begriffe trennen.
4. Für jede Seite die Lücke der Top-Treffer notieren (Teil 6.4): Was fehlt dort, das der Betrieb belegen kann?

## 5. Ortsseiten und Doorway-Risiko

### Was Google verbietet

Doorway-Missbrauch: Seiten, die für bestimmte, ähnliche Anfragen gebaut sind und zu Zwischenseiten führen, die weniger nützlich sind als das eigentliche Ziel. Zu den Beispielen gehören mehrere Domains oder Seiten für einzelne Regionen oder Städte, die alle auf eine Seite leiten, und fast gleiche Seiten, die eher Suchergebnissen gleichen als einer klaren Struktur. `[Fakt · Q-Q4, «Doorway abuse», Stand 28.08.2026]`

Dazu skalierter Inhalt: viele Seiten vor allem für die Rangfolge, auch durch Übersetzen, Synonyme oder das Zusammensetzen fremder Inhalte, egal wie erstellt. `[Fakt · Q-Q4, «Scaled content abuse»]` Eine Serie «Maler Winterthur», «Maler Frauenfeld», «Maler Uster» mit getauschtem Ortsnamen fällt unter beides. `[Annahme]`

### Wann eine Ortsseite echten Bezug hat

Eine Ortsseite hat Bezug, wenn sie für Menschen an diesem Ort etwas sagt, das auf keiner anderen Seite des Betriebs steht. `[Annahme, abgeleitet aus Q-Q4]` Prüfbare Anzeichen:

| Anzeichen | Beispiel (erfunden) | Stärke |
|---|---|---|
| Standort am Ort | Filiale mit Adresse, Öffnungszeiten, Team | stark |
| belegte Aufträge am Ort | «2025 haben wir in Uster 14 Wohnungen gestrichen», mit Bildern und Jahr | mittel |
| ortsbezogene Angaben | Anfahrt, Einsatzzeit, Zuschlag für Anfahrt, Parkregeln | mittel |
| andere Leistung am Ort | nur in Uster: Fassaden mit Denkmalpflege | mittel |
| nur Ortsname im Titel und Text | «Ihr Maler in Uster» und sonst der Text der Startseite | keiner: Doorway-Risiko |

`[Annahme]`

- **Ersetzungstest.** Bleibt fast jeder Satz wahr, wenn man den Ortsnamen durch den Nachbarort ersetzt, fehlt der Bezug. Das ist K3 aus Semester 1, angewandt auf Orte. `[Annahme]`
- **Ohne Bezug: Einzugsgebiet statt Ortsseiten.** Ein Betrieb mit einem Standort nennt die Orte, in denen er arbeitet, auf der Standort- oder Leistungsseite in einem Satz. `[Annahme]`
- **Was die Analyse zeigt.** Ortsseiten von Betrieben anderswo können oben stehen: Bei «Steuererklärung ausfüllen lassen Kosten Zürich» stand auf Platz 2 die Zürich-Seite eines Treuhandbüros, das im selben Titel Luzern nennt und bei «Treuhandbüro Luzern» auf Platz 1 stand; die Seite nennt Preise. Ob diese Seite Bezug hat, lässt sich von aussen nicht entscheiden; sie zeigt nur, dass eine Ortsseite mit eigener Antwort ranken kann. `[Beobachtung · Q-Q13]` Ein Velogeschäft nannte vier Orte im Titel. `[Beobachtung · Q-Q13]`

## 6. Analyse echter Top-Seiten

### 6.1 Methode

- **Suchfragen:** 10, je 2 aus 5 Branchen, so formuliert, wie Kundschaft in der Deutschschweiz sucht. Gewählt von mir, nicht aus Suchvolumen. `[Annahme]`
- **Suche:** Websuche über ein Werkzeug (Firecrawl), Ort «Switzerland», am 01.11.2026, je 8 Treffer. Welche Suchmaschine dahinter steht, sagt das Werkzeug nicht. Es fehlen Anzeigen, Kartenblock und «Ähnliche Fragen». Bei lokalen Anfragen zeigt Google meist zuerst lokale Ergebnisse `[Fakt · Q-Q2]`; die organischen Treffer stehen dann tiefer. `[Annahme]`
- **Ausgewertet:** die obersten 5 je Frage, also 50 Treffer. Titel und Beschreibung so, wie die Suche sie lieferte; manche sind gekürzt oder anders als der Titel der Seite. Mindestens zwei geöffnete Seiten hatten einen anderen Titel als im Treffer; systematisch geprüft habe ich das nicht. `[Beobachtung · Q-Q13]`
- **Seiten geöffnet:** 49 von 50. Wortzahl grob aus dem HTML ohne Skripte, mit Menü und Fusszeile; Inhalte, die erst per JavaScript laden, fehlen. 5 Seiten liessen sich nur über das Werkzeug lesen, dort ist die Wortzahl eine Schätzung des Werkzeugs. FAQ, Preise und Bewertungen per Suchmuster, Stichproben von Hand korrigiert.
- **Art des Treffers:** Betrieb (auch Kette oder Shop), Verzeichnis, Bewertungsportal, Buchungsportal, Vergleichsportal, Reiseanbieter, Amt, Tourismusstelle.
- **Grenze:** eine Momentaufnahme, kleine Stichprobe, kein Google-Bildschirm. Die Zahlen beschreiben, was oben stand, nicht warum. Rohdaten nur im Scratchpad.

### 6.2 Die 10 Suchfragen

| Nr | Branche | Suchfrage | Absicht |
|---|---|---|---|
| 1 | Handwerk und Auto | Maler Winterthur | lokal, tun |
| 2 | Handwerk und Auto | Reifenwechsel Kosten St. Gallen | wissen, lokal |
| 3 | Gastro und Hotel | Restaurant Mittagsmenü Aarau | lokal, wissen |
| 4 | Gastro und Hotel | Hotel Luzern güns·tig | tun, wissen |
| 5 | Gesundheit und Beauty | Physiotherapie ohne Rezept Zürich | wissen, lokal |
| 6 | Gesundheit und Beauty | Coiffeur Basel | lokal, tun |
| 7 | Handel und Manufaktur | Velogeschäft Bern | lokal, gemischt |
| 8 | Handel und Manufaktur | Esstisch nach Mass Schweiz | tun, wissen |
| 9 | Beratung | Steuererklärung ausfüllen lassen Kosten Zürich | wissen, tun |
| 10 | Beratung | Treuhandbüro Luzern | lokal, tun |

`[Absichten: Annahme nach Q-Q3, 12.7]`

### 6.3 Kennzahlen je Frage (Top 5)

| Nr | Nicht-Betriebe | Titel, Median Zeichen | Ort im Titel | Preis im Titel | Preis in Beschreibung | Wörter, Median | FAQ | Preise auf Seite | Bewertungen auf Seite |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 (Verzeichnis) | 55 | 5 | 0 | 0 | 650 | 0 | 0 | 2 |
| 2 | 1 (Vergleichsportal) | 41 | 4 | 1 | 3 | 370 | 2 | 3 | 2 |
| 3 | 1 (Bewertungsportal, Platz 1) | 40 | 5 | 0 | 2 | 930 | 0 | 1 | 3 |
| 4 | 5 (Buchung, 2 Vergleicher, Reiseanbieter, Tourismus) | 48 | 5 | 2 | 2 | 2680 | 3 | 2 | 3 |
| 5 | 0 | 54 | 5 | 0 | 0 | 1170 | 3 | 2 | 2 |
| 6 | 2 (Buchungsportale) | 64 | 5 | 0 | 0 | 590 | 1 | 3 | 2 |
| 7 | 1 (Amt, Velomiete) | 44 | 4 | 0 | 0 | 530 | 0 | 2 | 0 |
| 8 | 0 | 59 | 4 | 0 | 2 | 1830 | 1 | 5 | 2 |
| 9 | 0 | 57 | 5 | 0 | 3 | 1900 (4 geöffnet) | 3 | 3 | 1 |
| 10 | 1 (Verzeichnis) | 40 | 5 | 0 | 0 | 450 | 1 | 1 | 1 |
| **Summe** | **12 von 50** | **48** | **47 von 50** | **3 von 50** | **12 von 50** | **870** | **14 von 49** | **22 von 49** | **18 von 49** |

`[Beobachtung · Q-Q13; Wörter gerundet; «Bewertungen» heisst: Sterne, Bewertungen oder Kundenstimmen auf der Seite erwähnt]`

### 6.4 Muster

**Art der Treffer**

- 38 von 50 Treffern sind Betriebe, 12 Verzeichnisse, Portale, ein Amt oder die Tourismusstelle. `[Beobachtung · Q-Q13]`
- Auf Platz 1 stand zweimal kein Betrieb: ein Bewertungsportal (Mittagsmenü) und ein Buchungsportal (Hotel). `[Beobachtung · Q-Q13]`
- In 6 von 10 Fragen steht mindestens ein Verzeichnis oder Portal unter den obersten 5. Bei der Hotelfrage kein einziger Betrieb. Das allgemeine Verzeichnis search.ch erschien zweimal (Maler, Treuhand). `[Beobachtung · Q-Q13]`
- Bei Physiotherapie, Esstisch und Steuererklärung (Fragen 5, 8, 9) standen nur Betriebe oben, bei der Steuerfrage trotz Preiswort. `[Beobachtung · Q-Q13]`

**Titel**

- Länge: 15 bis 75 Zeichen, Median 48; 20 von 50 lagen zwischen 40 und 60 Zeichen, 16 darunter, 14 darüber. `[Beobachtung · Q-Q13]` Backlinko fand in Search-Console-Daten zu 4 Millionen Treffern die höchste Klickrate bei Titeln von 40 bis 60 Zeichen. `[Fakt · Q-Q12; Verhaltensdaten, Korrelation; der Artikel nennt zwei verschiedene Werte für den Vorsprung, 33,3 und 8,9 Prozent]` Das deckt sich mit U4 aus Semester 2. Titel mit Frage hatten dort keine signifikant andere Klickrate. `[Fakt · Q-Q12]`
- Der Ort steht in 47 von 50 Titeln. Die drei ohne Ort: ein Titel nur aus der Domain, ein Shop mit Gattungsbegriff, eine Preisseite eines Pneuhändlers, die auf Platz 5 stand. `[Beobachtung · Q-Q13]`
- Der Firmenname steht bei Betrieben meist vorne (bei Maler 4 von 5). Portale beginnen mit Zahl oder Rangliste («65 Einträge», «Top 20», «Die 10 besten»). `[Beobachtung · Q-Q13]`
- Preis im Titel nur 3 Mal, alle bei Preisfragen; 2 davon sind Vergleichsportale («ab CHF …»). `[Beobachtung · Q-Q13]`
- Ortsnamen schwanken: «St. Gallen», «St.Gallen» und «Sankt Gallen» standen in derselben Top 5. `[Beobachtung · Q-Q13]`

**Beschreibung**

- Preis in 12 von 50 Beschreibungen, davon 8 bei den drei Preisfragen. Bei «Reifenwechsel Kosten» nannten die Plätze 1 und 2 keinen Preis. `[Beobachtung · Q-Q13]`
- Viele Beschreibungen sind Leistungslisten (Maler, Treuhand) oder Adresse mit Öffnungszeiten (Velo); bei 9 standen Telefonnummern oder Mailadressen. `[Beobachtung · Q-Q13]`
- Nur einer von 5 Treffern zu «Physiotherapie ohne Rezept» beantwortete die Frage in der Beschreibung; kein Titel nahm «ohne Rezept» auf. `[Beobachtung · Q-Q13]`

**Seiten**

- Wortzahl stark gestreut: rund 110 bis 6850 Wörter, Median 870. Betriebsseiten Median 800, Portale 1870. `[Beobachtung · Q-Q13]` Google sagt, es habe keine bevorzugte Wortzahl. `[Fakt · Q-Q5]`
- FAQ auf 14 von 49 Seiten, davon 9 mit FAQ-Auszeichnung im Code; gehäuft bei Preisfragen und Hotel. `[Beobachtung · Q-Q13]`
- Preise auf 22 von 49 Seiten; bei Maler und Treuhand fast keine. Bewertungen auf 18 von 49, vor allem bei Portalen. `[Beobachtung · Q-Q13]`
- Auszeichnung als Betrieb oder Organisation (schema.org, z. B. LocalBusiness) im Code bei 21 von 49. `[Beobachtung · Q-Q13]`

**Lücken der Top-Treffer.** In fast jeder Frage fehlte oben etwas, das Kundschaft wissen will: Offerte und Frist (Maler), Preis auf den Plätzen 1 und 2 (Reifen), Dauer der Bearbeitung (Steuern), Preis für Selbstzahlende (Physio), Lieferfrist (Esstisch). `[Beobachtung · Q-Q13]` Ob eine Seite, die diese Lücke füllt, besser rankt oder öfter geklickt wird, zeigt diese Analyse nicht. `[Annahme]`

## 7. Wenn in der Schweiz

### Mehrsprachigkeit

- Hat eine Seite Fassungen für mehrere Sprachen oder Regionen, soll man Google diese Fassungen nennen; der hreflang-Wert besteht aus Sprachcode und optional Regionscode, z. B. `de-CH`, `fr-CH`. `[Fakt · Q-Q7]`
- Automatisch übersetzte Seiten mit wenig Nutzen für Lesende in grosser Zahl zählt Google zum skalierten Inhalt. `[Fakt · Q-Q4, Beispiel «translating»]`
- Eine zweite Sprache lohnt sich nur, wenn der Betrieb in dieser Sprache bedient (Biel/Bienne, Freiburg, Wallis, Graubünden). Sonst genügt Deutsch. `[Annahme]`
- Die Sprache der Anfrage bestimmt, welche Ergebnisse man hauptsächlich sieht. `[Fakt · Q-Q1, «Sprache»]`

### Ortsnamen

- Gemeinde, Ortsteil und Quartier sind verschiedene Begriffe: «Winterthur-Seen», «Zürich-Oerlikon», «Kleinbasel». Im Titel steht der Ort, den die Kundschaft tippt, meist die Stadt; der Ortsteil steht im Text und in der Adresse. `[Annahme]`
- Schreibvarianten wie «St. Gallen» und «St.Gallen» standen nebeneinander oben `[Beobachtung · Q-Q13]`; Google erkennt Schreibfehler und Synonyme `[Fakt · Q-Q1]`. Varianten nicht im Titel stapeln. `[Annahme]`
- Zweisprachige Orte (Biel/Bienne) und Kantonskürzel (SG, LU) in Vorschlägen prüfen. `[Annahme]`

### Dialekt und Schweizer Wörter

- **Coiffeur gegen Friseur.** «Coiffeur Basel» und «Friseur Basel» lieferten 7 gleiche Adressen unter den obersten 8. Die Treffer selbst nutzten fast alle «Coiffeur», einer schrieb «Dein Friseur» im Titel. `[Beobachtung · Q-Q13]` Schluss: eine Seite, Kundenwort «Coiffeur» im Titel, «Friseur» höchstens einmal im Text. `[Annahme; vgl. KW6]`
- **Pneu gegen Reifen.** Auf «Reifenwechsel» kamen Titel mit «Reifenwechsel», «Pneuwechsel» und «Reifenmontage». `[Beobachtung · Q-Q13]` Welches Wort in der Region häufiger gesucht wird, zeigt Google Trends oder die Strichliste am Telefon. `[Annahme]`
- **Velo gegen Fahrrad.** Ein Treffer stapelte «Velo Bike Fahrrad» im Titel. `[Beobachtung · Q-Q13]` Stapeln ist kein Ersatz für die Wahl eines Kundenworts. `[Annahme; vgl. KW6]`
- **Eszett.** Bei der Hotelfrage stand ein Treffer mit Eszett in der Beschreibung unter den obersten 5, weiter unten Treffer mit Euro-Preisen und deutscher Domain. `[Beobachtung · Q-Q13]` Schweizer Seiten schreiben «ss» (CH1) und Franken (CH8); Schweizer Wörter regelt CH2.

## 8. Beispiele

**Antwort-Plan, gut und schlecht.** Physiotherapie Muster, Zürich-Oerlikon (erfunden).

- Mit Plan: Eine Seite «/ohne-verordnung» beantwortet «Physiotherapie ohne Rezept», «Physio selber zahlen» und «Physiotherapie Kosten ohne Krankenkasse». Erster Satz: «Ja, Sie können ohne ärztliche Verordnung kommen und zahlen dann selbst: CHF 120.– für 45 Minuten.»
- Ohne Plan: Drei Seiten «/physio-ohne-rezept», «/selbstzahler» und «/preise» mit fast gleichem Text. Keine beantwortet die Frage im ersten Satz.

**Ortsseite, mit und ohne Bezug.** Malerei Muster GmbH, Winterthur-Seen (erfunden).

- Mit Bezug: «/uster»: Seit 2019 eigenes Lager in Uster, 2 Maler fest dort, Anfahrt ohne Zuschlag, 3 Projekte aus 2025 mit Bildern und Jahr.
- Ohne Bezug: «/maler-uster», «/maler-wetzikon», «/maler-pfaeffikon», je derselbe Text mit getauschtem Ortsnamen. Fällt im Ersetzungstest durch.

**Preisfrage.** Garage Muster AG, St. Gallen-Winkeln (erfunden).

- Mit Q7: Titel «Pneuwechsel St. Gallen: CHF 60.– für 4 Räder, ohne Termin»; Beschreibung nennt Rad- und Pneuwechsel getrennt.
- Ohne Q7: Titel «Garage Muster AG · Home»; Preis erst auf einer Unterseite.

## 9. Prüfbare Grundsätze

Jede Regel nennt einen Grenzwert oder eine Prüffrage. «Werkzeug» heisst: Ein Skript kann es zählen. «Bewerter» heisst: Ein Mensch oder ein blinder Agent entscheidet. Grenzwerte ohne Studie sind `[Annahme]`. Beobachtungen aus Teil 6 sind kein Beleg für Rangfolge oder Klicks.

**Absicht und Begriffe**

- **Q1 Absicht je Begriff.** Jeder Begriff im Antwort-Plan hat eine Hauptabsicht (wissen, tun, gehen, lokal) und höchstens eine Nebenabsicht. Werkzeug: Spalte gefüllt. `[Fakt · Q-Q3, 12.7 zu den Kategorien; Regel Annahme]`
- **Q2 Treffer gelesen.** Für jeden Hauptbegriff liegt eine Notiz zu den obersten 5 Treffern vor: Art je Treffer, Datum, Lücke. Prüffrage: Ist die Notiz da und höchstens 3 Monate alt? `[Annahme; Methode Teil 6]`
- **Q3 Drei Quellen.** Die Begriffe stammen aus mindestens 3 Quellenarten: Fragen der Kundschaft (KW1), Autovervollständigung, Trefferseite («Ähnliche Fragen», «Verwandte Suchen»); nach dem Livegang dazu Search Console. Werkzeug: Quellenspalte zählen. `[Fakt · Q-Q8, Q-Q9 zu den Quellen; Grenzwert Annahme]`
- **Q4 Kundenwort vor Suchvariante.** Gibt es regionale Wortpaare (Coiffeur/Friseur, Pneu/Reifen, Velo/Fahrrad), steht im Titel nur ein Wort, das der Kundschaft (nach KW6); die Variante höchstens einmal im Text. Werkzeug: Wortpaarliste gegen Titel. `[Beobachtung · Q-Q13; Fakt · Q-Q1 zu Synonymen; Regel Annahme]`

**Antwort-Plan**

- **Q5 Eine Seite je Begriffsgruppe.** 0 Hauptbegriffe sind zwei Seiten zugewiesen; jede Seite hat genau eine Hauptabsicht. Werkzeug: Duplikate in der Spalte «Zielseite» und im Titel-Hauptbegriff. `[Fakt · Q-Q6 zu ähnlichen Seiten; Regel Annahme; Prüfpunkt TP1]`
- **Q6 Gruppieren nach Treffern.** Zwei Begriffe kommen auf dieselbe Seite, wenn mindestens 6 der obersten 10 Treffer gleich sind; bei höchstens 3 gleichen Treffern bekommen sie eigene Seiten, wenn beide eine eigene Absicht haben. Dazwischen entscheidet die Absicht. Werkzeug: Adressen vergleichen. `[Beobachtung · Q-Q13: Coiffeur/Friseur 7 von 8; Grenzwerte Annahme]`
- **Q7 Preisfrage, Preis vorne.** Enthält der Hauptbegriff «Kosten», «Preis» oder «güns·tig», nennt die Beschreibung einen Preis oder Richtpreis mit Bedingung (wofür, ab wann), und er steht auf der Seite direkt unter dem ersten Bildschirm, im ersten Abschnitt nach der Faktenzeile. Im ersten Bildschirm darf er stehen, muss aber nicht (Entscheid 3). Werkzeug: Betrag mit CHF in der Beschreibung und im ersten Abschnitt nach der Faktenzeile. `[Beobachtung · Q-Q13: 8 von 15 Beschreibungen bei Preisfragen; Regel Annahme; vgl. A19, CH8, CH9]`
  Geändert am 02.11.2026: «erster Bildschirm» durch «direkt unter dem ersten Bildschirm» ersetzt; der erste Bildschirm trägt eine grosse Sache und die Faktenzeile, Preise folgen direkt darunter (Entscheid 3 in [zusammenspiel.md](../../../design-uni/referenzen/zusammenspiel.md)). `[Entscheid · Studio, 02.11.2026]`
- **Q8 Frage im Begriff, Antwort im ersten Satz.** Ist der Begriff eine Ja-nein-Frage oder Bedingung («ohne Rezept», «ohne Termin», «am Sonntag»), beginnt der erste Satz der Seite mit der Antwort, und die Beschreibung enthält sie. Bewerter. `[Beobachtung · Q-Q13: 1 von 5; Regel Annahme; vgl. TP2, KW11]`
- **Q9 Lücke gefüllt.** Jede Seite beantwortet mindestens eine Lücke aus der Notiz zu Q2 mit einem belegten Fakt (Zahl, Frist, Preis, Ablauf). Bewerter mit der Notiz. `[Annahme]`
- **Q10 Umfang nach Antwort, nicht nach Wortzahl.** Keine Seite hat ein Wortziel. Prüffrage: Beantwortet die Seite die Fragen aus KW5 und die Lücke aus Q9? Unter 80 Wörtern ist nur ein Hinweis auf eine leere Seite (TI18): Ein Bewerter prüft sie auf fehlende Antworten. `[Fakt · Q-Q5; Beobachtung · Q-Q13: 110 bis 6800 Wörter oben; Grenzwert Annahme]`
  Geändert am 02.11.2026: Prüfgrenze 150 durch 80 Wörter ersetzt, damit für den Mindestumfang eine Schwelle gilt (TI18, TI31, G20). `[Entscheid · Studio, 02.11.2026]`

**Lokal und Ortsseiten**

- **Q11 Ort im Titel bei lokaler Absicht.** Hat der Hauptbegriff lokale Absicht, steht der Ort genau einmal im Titel, in der Schreibweise der Gemeinde (für die Überschrift gilt A18). Werkzeug. `[Beobachtung · Q-Q13: 47 von 50 Titeln mit Ort; Regel Annahme]`
- **Q12 Keine Ortsliste im Titel.** Höchstens ein Ort im Titel, zwei nur bei zwei Standorten. Werkzeug: Ortsnamen im Titel zählen. `[Annahme; Fakt · Q-Q4 zu Seiten für Städte]`
- **Q13 Ortsseite nur mit Bezug.** Eine Ortsseite ohne Standort am Ort hat mindestens 2 der Anzeichen aus Teil 5 (belegte Aufträge mit Jahr, ortsbezogene Angaben, andere Leistung). Prüffrage für Bewerter mit der Tabelle aus Teil 5. `[Fakt · Q-Q4; Grenzwert Annahme]`
- **Q14 Ersetzungstest für Orte.** Tauscht man den Ortsnamen gegen einen Nachbarort, bleibt höchstens ein Satz je Abschnitt wahr (K3). Bewerter markiert die austauschbaren Sätze. `[Annahme; nach K3]`
- **Q15 Keine Serie gleicher Ortsseiten.** Zwei Ortsseiten desselben Betriebs teilen höchstens 30 Prozent ihres Textes. Werkzeug: Textvergleich ohne Menü und Fusszeile. Diese Schwelle gilt auch für G5. `[Fakt · Q-Q4, «substantially similar pages»; Grenzwert Annahme]`
- **Q16 Portale oben, Eintrag korrekt.** Steht unter den obersten 5 Treffern eines Hauptbegriffs ein Verzeichnis oder Portal, hat der Betrieb dort einen Eintrag mit denselben Firmendaten wie auf der Website. Prüffrage. `[Beobachtung · Q-Q13: 6 von 10 Fragen; Regel Annahme; Einzelheiten P…]`

**Schweiz und Messen**

- **Q17 Sprachfassungen nur mit Bedienung.** Eine zweite Sprachfassung gibt es nur, wenn der Betrieb in dieser Sprache bedient; jede Fassung hat eigene Adresse, hreflang (`de-CH`, `fr-CH`) und wurde von einem Menschen geprüft. Werkzeug für hreflang, Prüffrage für den Rest. `[Fakt · Q-Q7; Fakt · Q-Q4 zu Übersetzungen; Regel Annahme]`
- **Q18 Schweizer Schreibung in Titel und Beschreibung.** 0 Eszett, Preise in Franken. Werkzeug. `[Beobachtung · Q-Q13; nach CH1 und CH8]`
- **Q19 Plan nachführen.** Drei Monate nach dem Livegang wird geprüft, ob eine Suchanfrage Impressionen auf zwei eigenen Seiten hat; dann gilt Q5 erneut. Prüffrage: Ist das Datum eingetragen? `[Fakt · Q-Q9 zu Suchanfragen je Seite; Frist Annahme; Einzelheiten M…]`

---

## Quellen

Alle abgerufen am 01.11.2026.

- **Q-Q1** Google: «So ermittelt Google das Ranking von Suchergebnissen», How Search works, deutsche Fassung. https://www.google.com/search/howsearchworks/how-search-works/ranking-results/
- **Q-Q2** Google Search Central: «In-Depth Guide to How Google Search Works», Abschnitt «Serving search results», zuletzt geändert 18.12.2025. https://developers.google.com/search/docs/fundamentals/how-search-works
- **Q-Q3** Google: «Search Quality Rater Guidelines» (General Guidelines), Fassung mit Copyright 2025, 182 Seiten; gelesen im Wortlaut: 12.7, 12.7.2, 12.7.3, 12.7.4, 16.1, 22.0; übrige Teile nur Inhaltsverzeichnis. https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf
- **Q-Q4** Google Search Central: «Spam Policies for Google Web Search», Abschnitte «Doorway abuse» und «Scaled content abuse», zuletzt geändert 28.08.2026. https://developers.google.com/search/docs/essentials/spam-policies
- **Q-Q5** Google Search Central: «Creating Helpful, Reliable, People-First Content», Stelle zur Wortzahl. https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- **Q-Q6** Google Search Central: «How to Specify a Canonical with rel="canonical" and Other Methods», Einleitung, zuletzt geändert 10.07.2026. https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- **Q-Q7** Google Search Central: «Localized Versions of your Pages», zuletzt geändert 21.09.2026. https://developers.google.com/search/docs/specialty/international/localized-versions
- **Q-Q8** Google-Suche-Hilfe: «How Google autocomplete predictions work». https://support.google.com/websearch/answer/7368877
- **Q-Q9** Search-Console-Hilfe: «Performance report (Search results): Overview and basic setup». https://support.google.com/webmasters/answer/7576553
- **Q-Q10** Google-Unternehmensprofil-Hilfe: «Tips to improve your local ranking on Google». https://support.google.com/business/answer/7091
- **Q-Q11** Google-Trends-Hilfe: «Trends-Suchbegriffe vergleichen», gelesen im Suchauszug. https://support.google.com/trends/answer/4359550?hl=de
- **Q-Q12** Brian Dean, Backlinko: «We Analyzed 4 Million Google Search Results. Here's What We Learned About Organic CTR», Daten von Semrush aus Search-Console-Konten, Erstfassung 2019, Bilder von 2022. Backlinko gehört zu Semrush. https://backlinko.com/google-ctr-stats
- **Q-Q13** Eigene Analyse, 01.11.2026: 10 Suchfragen, Websuche über Firecrawl mit Ort Schweiz, je 5 Treffer ausgewertet, 49 Seiten geöffnet. Rohdaten und Auswertungsskripte nur im Scratchpad der Sitzung, nicht im Repo.
