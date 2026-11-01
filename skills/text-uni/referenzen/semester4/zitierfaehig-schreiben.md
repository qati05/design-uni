# Zitierfähig schreiben · Skript Semester 4

Stand 01.11.2026 · Text-Uni, Semester 4 «KI-Suche und Technik».

> **Worum es geht:** Texte, die eine KI-Suche richtig wiedergibt und als Quelle nennt. Sätze, die allein stehen. Antwort zuerst. Ein eindeutiger Name und Ort. Gleiche Firmendaten überall. Stand-Datum bei Preisen und Zeiten. Zahlen als Text. Tabellen für Preise. Sichtbare Fragen mit Antwort. Keine Seite, die einer anderen widerspricht. Dazu: Was Studien belegen, was Anbieter schreiben, was nur Meinung ist und was widerlegt ist.
>
> **Gelesen am 01.11.2026, online** (Nummern wie in «Quellen» am Ende):
> ZS-Q1 Google, KI-Funktionen und Ihre Website (Stand 10.12.2025) · ZS-Q2 Google, Website für generative KI-Funktionen optimieren (Stand 10.07.2026, ganz gelesen) · ZS-Q3 Google Search Central Blog, Mueller (21.05.2025) · ZS-Q4 Google, Datumsangaben in der Suche (Stand 10.12.2025) · ZS-Q5 Microsoft Advertising, Madhavan (08.10.2025) · ZS-Q6 Aggarwal u. a., GEO, KDD 2024 (Volltext) · ZS-Q7 Puerto u. a., C-SEO Bench, NeurIPS 2025 · ZS-Q8 Liu, Zhang, Liang, 2023 (Volltext, Einleitung und Methode) · ZS-Q9 Liu u. a., «Lost in the Middle» (Zusammenfassung) · ZS-Q10 Anthropic, Contextual Retrieval (19.09.2024) · ZS-Q11 Wu, Wu, Zou, ClashEval (Zusammenfassung) · ZS-Q12 Fang u. a., 2025 (Zusammenfassung) · ZS-Q13 Tow Center, Jaźwińska, Chandrasekar (06.03.2025) · ZS-Q14 EBU und BBC (22.10.2025) · ZS-Q15 Ahrefs, Linehan (11.05.2026) · ZS-Q16 searchVIU (02.12.2025) · ZS-Q17 Chen u. a., 2025 (Zusammenfassung) · ZS-Q18 Kumar, Lakkaraju, 2024 (Zusammenfassung) · ZS-Q19 The AI Search Checklist, Contact (inboundengineer.io).
>
> **Nicht gelesen:** C-SEO Bench, ClashEval, Fang u. a. und «Lost in the Middle» im Volltext. Die Zahlen stammen aus Zusammenfassung oder HTML-Fassung. Chen u. a. nur als Zusammenfassung ohne Zahlen. Die Hilfe von OpenAI für Website-Betreiber leitete am 01.11.2026 auf eine andere Seite weiter; was OpenAI schreibt, fehlt hier.
>
> **Nicht gefunden:** eine Studie mit deutschen oder Schweizer Seiten. Eine Studie, die Wiedergabe-Fehler je Schreibweise misst (etwa Satz mit oder ohne Namen). Eine Studie zu geschriebener Mundart in Sprachmodellen. Was dazu steht, ist `[Annahme]`.
>
> Herkunft: `[Fakt · Quelle, Datum]`, `[Annahme]`, `[Meinung · Autor]`, `[Verweis]`. **`[Regel laut Google · Quelle]`** und **`[Regel laut Microsoft · Quelle]`** heissen: So schreibt es der Anbieter. Das ist ein Fakt über seine Absicht, kein Beleg für Wirkung. Studien von Anbietern eines SEO-Werkzeugs stehen mit dem Zusatz «Anbieter».

**Boden aus Semester 1 bis 3.** Was dort steht, gilt hier und wird nur mit der ID zitiert: erster Satz sagt Angebot und Ort (V1, L1), jeder Absatz beginnt mit seiner Aussage (V2, L3), Zwischentitel als Aussage (V3, U2), Fakten als Ziffern (L11), Aussage mit Ding, Ort, Zeit oder Zahl (W22), Eigenschaft mit Beleg (K2), Ersetzungstest (K3), Preis als Endpreis mit Leistung und Einheit (R13, R14), Beleg für jede Tatsache (R1), nichts erfunden (B8), genaue Zahl mit Quelle (B2), FAQ als Kundenfrage und keine erfundene Frage (KW11, KW12), Kundenwort (KW6), Schweizer Formate (CH1 bis CH16), Datum ehrlich (G19), kein Suchwort-Stapel (G4), Name wie in der echten Welt (P1), Zeiten aktuell (P6), eine Referenz für Firmendaten (P19), Preisfrage mit Preis vorne (Q7), Frage im Begriff, Antwort im ersten Satz (Q8), erster Absatz als Snippet (S13), Sprunglinks und nichts hinter Reitern (S14), strukturierte Daten nur für Sichtbares (S25), kein Versprechen von Rich Results (S26), Modell-Urteil ist kein Klickbeleg (S29).

**Abgrenzung.** Wie ChatGPT, Perplexity, Gemini, Copilot, Claude und Google ihre Quellen holen, steht im Skript «KI-Antworten und Quellen» (KQ). Ob ein Crawler die Seite überhaupt lesen darf, steht in «Technik: Crawlen und Indexieren» (TI). Dieses Skript regelt die **Wörter, Sätze und Bausteine** einer Seite, die ein Dienst schon gefunden hat. Den schwersten Schritt, die Auswahl der Quellen, kann Text allein kaum steuern. `[Fakt · ZS-Q7: Platz im Abruf wirkt stärker als jede Textmethode]`

**Schreibweise der Beispiele.** Floskeln stehen mit Mittelpunkt im Wort, etwa «Ihr Part·ner». Alle Betriebe sind erfunden: Garage Muster in Musterdorf, Treuhand Muster in Musterdorf. Adressen enden auf `.example`.

---

## 1. Grundbegriffe

- **KI-Suche:** ein Dienst, der auf eine Frage eine Antwort in Sätzen schreibt und Webseiten als Quellen verlinkt. Beispiele: KI-Übersicht und KI-Modus von Google, ChatGPT-Suche, Perplexity, Copilot. `[Fakt · ZS-Q1; ZS-Q5]`
- **Abruf und Erdung (Retrieval, Grounding):** Der Dienst holt passende Seiten aus einem Suchindex und schreibt die Antwort auf dieser Grundlage. Google nennt das «Retrieval-augmented generation» und stützt sich dafür auf seine normalen Rangsysteme. `[Regel laut Google · ZS-Q2]`
- **Fan-out:** Der Dienst zerlegt eine Frage in mehrere verwandte Suchen und holt dazu weitere Seiten. Googles Beispiel: Zur Frage nach einem Rasen voller Unkraut sucht das Modell auch nach Mitteln gegen Unkraut und nach Wegen ohne Chemie. `[Regel laut Google · ZS-Q1; ZS-Q2]`
- **Abschnitt (Chunk):** ein Stück einer Seite, das ein Abruf-System einzeln speichert und findet. Typisch sind einige hundert Wörter-Bausteine (Tokens). `[Fakt · ZS-Q10]` Microsoft beschreibt dasselbe als «Parsing» in kleinere Stücke. `[Regel laut Microsoft · ZS-Q5]`
- **Zitieren:** Die Antwort nennt eine Seite als Quelle, meist als Link oder Nummer. **Wiedergeben:** Die Antwort übernimmt eine Angabe der Seite, richtig oder falsch. Beides ist nicht dasselbe. Ein Dienst kann eine Seite nennen und die Angabe trotzdem falsch wiedergeben. `[Fakt · ZS-Q8; ZS-Q13; ZS-Q14]`
- **Stand-Datum:** sichtbares Datum, ab dem eine Angabe gilt oder an dem sie zuletzt geprüft wurde. `[Annahme, Arbeitsbegriff]`
- **GEO, AEO:** «Generative Engine Optimization» und «Answer Engine Optimization». Aus Sicht von Google ist beides SEO. `[Regel laut Google · ZS-Q2]`

---

## 2. Was belegt ist: Studien

### 2.1 Die Studien

Gewichtung wie im Abgleich mit Menschen: Experiment stark, Verhaltensdaten mittel, Anbieter-Auswertung schwach bis mittel, Einzeltest schwach. `[Verweis · ../abgleich-menschen.md]`

| Studie | Methode | Ergebnis | Anbieter? | Qualität |
|---|---|---|---|---|
| **GEO,** Aggarwal u. a., KDD 2024 | 10 000 Fragen (Benchmark «GEO-bench»), 80 % Wissensfragen. Je Frage die Top 5 von Google als Text. Antwort schreibt gpt-3.5-turbo. Ein Sprachmodell schreibt eine Quelle nach 9 Methoden um. Mass: Anteil der Antwort aus dieser Quelle, gewichtet nach Platz; dazu ein Urteil von GPT-3.5 | Zitate, Statistiken und Quellenangaben einfügen: +30 bis 40 % relativ. Flüssiger oder einfacher Text: +15 bis 30 %. Suchwörter stopfen: schlechter als nichts tun. Quellen auf Platz 5 gewinnen am meisten (Quellenangabe +115,1 %), Platz 1 verliert im Schnitt 30,3 %, wenn alle Quellen umgeschrieben sind. Wirkung je Themengebiet verschieden | nein, Hochschule | Benchmark, begutachtet; kein echter Dienst, siehe 2.2 |
| **GEO bei Perplexity** (Anhang derselben Studie) | 200 Fragen; die 5 Quellen als Datei hochgeladen, Antwort nur daraus | Zitate einfügen +22 %, Statistiken bis +37 % im Urteil; Suchwörter stopfen 10 % schlechter | nein | klein, ohne echte Quellenauswahl |
| **C-SEO Bench,** Puerto u. a., NeurIPS 2025 | 4 Modelle (gpt-4o-mini, claude-3-5-haiku, o3, o4-mini), 6 Gebiete: Produktempfehlung (Handel, Spiele, Bücher) und Fragen (Web, News, Debatte). 8 GEO-Methoden plus 2 neue. Mass: Platz der Quelle in der Antwort, Test auf Zufall mit Korrektur | Bei gpt-4o-mini nur 3 von 54 Fällen signifikant besser. «Statistiken» senkte den Platz in 19 von 24 Fällen. Bei claude-3-5-haiku 26 von 30 Produktfällen signifikant schlechter. Die Quelle zuerst in den Kontext stellen: +2,77 Plätze, mehr als jede Methode. Je mehr Seiten dieselbe Methode nutzen, desto kleiner der Gewinn | nein, Hochschule und Firma | Benchmark, begutachtet, mehrere Modelle; nur Englisch |
| **Liu, Zhang, Liang,** Findings EMNLP 2023 | 1450 Fragen an Bing Chat, NeevaAI, Perplexity, YouChat; 34 Menschen prüfen jeden Satz gegen die genannte Quelle | Nur 51,5 % der Sätze waren von ihren Quellen voll gestützt; 74,5 % der Quellenangaben stützten ihren Satz. Je nützlicher eine Antwort wirkte, desto ungenauer die Quellen (r = −0,96). Die Dienste übernehmen oft fast wörtlich aus der Quelle | nein, Hochschule | Menschen-Urteil, gross; Dienste von 2023 |
| **Tow Center,** Jaźwińska, Chandrasekar, 06.03.2025 | 8 KI-Suchen, 1600 Abfragen: Ausschnitt eines Artikels, gesucht Titel, Verlag, Datum, Adresse | Über 60 % falsche Antworten; Perplexity 37 %, Grok 3 94 %. Oft zitiert: eine Kopie bei Dritten statt des Originals | nein, Journalismus-Forschung | Verhaltensdaten mit klarer Aufgabe; nur News |
| **EBU und BBC,** 22.10.2025 | 22 öffentliche Medienhäuser in 18 Ländern, darunter SRF; 14 Sprachen; über 3000 Antworten von ChatGPT, Copilot, Gemini, Perplexity, von Fachleuten bewertet | 45 % mit mindestens einem grossen Problem; 31 % mit Problemen bei den Quellen; 20 % mit groben Fehlern, darunter veraltete Angaben | nein | gross, mehrsprachig; nur News |
| **Anthropic,** Contextual Retrieval, 19.09.2024 | Abruf aus Abschnitten; jedem Abschnitt wird ein kurzer Satz zum Zusammenhang vorangestellt | Beispiel für das Problem: «Der Umsatz stieg um 3 % gegenüber dem Vorquartal» nennt weder Firma noch Zeitraum. Mit vorangestelltem Zusammenhang fielen Fehlschläge im Abruf von 5,7 auf 3,7 % (−35 %), mit Wortsuche dazu auf 2,9 % (−49 %) | ja, Modellanbieter | Messung des Anbieters, keine Begutachtung; misst Abruf, nicht Zitat |
| **ClashEval,** Wu, Wu, Zou, 2024 | über 1200 Fragen, 6 Modelle; dem Modell wird ein Text mit richtiger oder verfälschter Angabe gegeben | Die Modelle übernahmen eine falsche Angabe aus dem gegebenen Text in über 60 % der Fälle, obwohl sie die richtige kannten | nein | Vorabdruck |
| **Fang u. a.,** 2025 | Passagen aus TREC mit künstlichem Datum; 7 Modelle ordnen nach Relevanz | Alle Modelle schoben scheinbar neuere Passagen nach oben: mittleres Jahr der Top 10 bis 4,78 Jahre jünger, einzelne Passagen bis 95 Plätze. Grössere Modelle weniger, aber nie null | nein, Hochschule | Vorabdruck; nur Englisch |
| **Liu u. a.,** «Lost in the Middle», TACL | lange Eingaben mit der relevanten Stelle an verschiedenen Orten | Am besten gefunden wird, was am Anfang oder Ende steht, am schlechtesten die Mitte | nein | begutachtet; misst Lage im Kontext, nicht in einer Seite |
| **Ahrefs,** Linehan, 11.05.2026 | 1885 Seiten, die zwischen August 2025 und März 2026 strukturierte Daten (JSON-LD) erhielten, gegen rund 4000 ähnliche Seiten ohne; je 30 Tage vorher und nachher | KI-Übersicht −4,6 % (signifikant, Ursache offen), KI-Modus +2,4 % und ChatGPT +2,2 % (beide nicht von null zu unterscheiden). Kein eigenes Ergebnis für FAQ-Daten | ja, SEO-Werkzeug | sauberer Vergleich, aber nur Seiten mit schon 100 und mehr Zitaten |
| **searchVIU,** 02.12.2025 | eine Testseite, 8 Preise je an einer anderen Stelle: sichtbarer Text, Skript, nur JSON-LD, Mikrodaten, RDFa | Kein Dienst fand einen Preis, der nur in JSON-LD stand. ChatGPT fand 3 von 8, alle aus sichtbarem Text; Gemini 4; Claude 0; Perplexity nach Indexierung 1; KI-Modus von Google 2 | ja, SEO-Werkzeug | Einzeltest, eine Seite; nur Direktabruf |
| **Chen u. a.,** 2025 | Vergleich von ChatGPT, Perplexity, Gemini mit Google, mehrere Branchen und Sprachen | KI-Suchen stützen sich stark auf fremde Quellen über einen Betrieb (Presse, Verzeichnisse) statt auf die eigene Website | nein | Vorabdruck; nur Zusammenfassung gelesen |
| **Kumar, Lakkaraju,** 2024 | erfundene Kaffeemaschinen; eine gezielt erzeugte Zeichenfolge auf der Produktseite | Die Folge hob ein Produkt in der Empfehlung eines Modells nach oben | nein | Vorabdruck; zeigt Manipulierbarkeit |

Alle Zeilen: `[Fakt · ZS-Q6 bis ZS-Q18, Abruf 01.11.2026]`. Spalte «Qualität»: `[Annahme · eigene Einordnung nach ../abgleich-menschen.md]`.

### 2.2 Kritik an GEO

GEO ist die meistzitierte Studie zum Thema. Sie trägt weniger, als ihr Ruf vermuten lässt. `[Annahme · eigene Einordnung]`

1. **Benchmark, kein echter Dienst.** Die «Suchmaschine» der Studie ist gpt-3.5-turbo mit den Top 5 von Google als Text. Auch beim Versuch mit Perplexity wurden die Quellen als Datei hochgeladen. Welche Seiten ein echter Dienst holt, prüft die Studie nicht. `[Fakt · ZS-Q6, Teil 3.1 und Anhang C.1]`
2. **Ein Modell bewertet sich selbst.** Das «subjektive» Mass berechnet GPT-3.5, also dieselbe Modellfamilie, die die Antwort schreibt. `[Fakt · ZS-Q6, Teil 2.2]` Zur Vorliebe von Modellen für Modelltext siehe den Abgleich mit Menschen. `[Verweis · ../abgleich-menschen.md]`
3. **Effektgrössen relativ.** «Bis 40 %» heisst: Der gewichtete Anteil einer Quelle an der Antwort stieg etwa von 19,3 auf 27,2 Punkte. Bei 5 Quellen wären 20 Punkte ein gleicher Anteil. Die Methode bringt also von einem knappen Fünftel auf gut ein Viertel. `[Fakt · ZS-Q6, Tabelle 1; Umrechnung: Annahme]`
4. **Wahrheit nicht geprüft.** Die Umschreibungen erzeugte ein Sprachmodell. Die Beispiele der Studie fügen Zahlen und eine Forschungsgruppe ein, die im Text nicht belegt sind. Eine Faktenprüfung der eingefügten Angaben beschreibt die Studie nicht. `[Fakt · ZS-Q6, Tabelle 4; «nicht beschrieben»: eigene Durchsicht]`
5. **Stil wirkt ohne Inhalt.** Die Methode «Authoritative» macht Text nur überzeugender. Die Autoren schreiben selbst, ihre Beispiele steigern die Sichtbarkeit «ohne wesentliche neue Information». `[Fakt · ZS-Q6, Tabelle 4]` Für Kundenseiten ist das ein Warnsignal, keine Anleitung: Es widerspricht K2, R1 und B8. `[Annahme]`
6. **Nicht wiederholt.** C-SEO Bench prüfte dieselben Methoden mit neueren Modellen und fand fast keine Wirkung, teils Schaden. `[Fakt · ZS-Q7]`
7. **Nullsumme.** Wenn alle umschreiben, gewinnt niemand. Schon GEO zeigt Verluste für Platz 1, wenn alle Quellen umgeschrieben sind; C-SEO Bench nennt das ein «Nullsummenspiel». `[Fakt · ZS-Q6, Teil 5.2; ZS-Q7]`

### 2.3 Was die Daten zusammen sagen

1. **Die Auswahl schlägt den Wortlaut.** Was zuerst und weit oben im Abruf steht, wird eher zitiert. Kein Schreibtrick wirkt verlässlich stärker. `[Fakt · ZS-Q7; ZS-Q9]`
2. **Dienste geben oft falsch wieder.** Rund die Hälfte der Sätze ist von ihren Quellen nicht voll gedeckt, bei News haben 45 % der Antworten ein grosses Problem. `[Fakt · ZS-Q8; ZS-Q14]` Darum zählt neben «zitiert» auch «richtig wiedergegeben». `[Annahme]`
3. **Was im Text steht, wird übernommen, auch Falsches.** Modelle folgen dem gegebenen Text mehr als ihrem Wissen. `[Fakt · ZS-Q11]` Eine alte Preisliste auf der eigenen Website ist darum ein Risiko. `[Annahme]`
4. **Neuere Daten ziehen.** Modelle bevorzugen Text mit jüngerem Datum, auch wenn das Datum nichts über den Inhalt sagt. `[Fakt · ZS-Q12]` Das spricht für ein ehrliches Stand-Datum und gegen ein Datum, das nur der Frische halber wechselt (G19). `[Annahme]`
5. **Sätze ohne Bezug gehen im Abruf verloren.** Ein Abschnitt ohne Firma und Zeitraum wird schlechter gefunden. `[Fakt · ZS-Q10]` Wie stark das bei Google, ChatGPT oder Perplexity wirkt, misst keine Studie. `[Annahme]`
6. **Nur Sichtbares zählt sicher.** Preise nur in strukturierten Daten fand im Direktabruf kein Dienst. Neue strukturierte Daten hoben die Zitate nicht. `[Fakt · ZS-Q15; ZS-Q16; beide Anbieter]`
7. **Die eigene Website ist nicht alles.** KI-Suchen stützen sich oft auf fremde Seiten über einen Betrieb. `[Fakt · ZS-Q17, nur Zusammenfassung]` Darum müssen Profil und Verzeichnisse dieselben Fakten tragen (P19). `[Annahme]`

**Grenzen.** Keine Studie misst kleine Betriebe, deutsche Seiten oder Fragen wie «Was kostet ein Radwechsel in St. Gallen?». Die meisten messen Wissensfragen oder News auf Englisch. Die Übertragung auf Leistungsseiten von KMU ist `[Annahme]`.

---

## 3. Was die Anbieter schreiben

### 3.1 Google

- **Keine besondere Optimierung nötig.** «There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary.» Bedingung: Die Seite ist indexiert und darf mit Snippet erscheinen. `[Regel laut Google · ZS-Q1, Stand 10.12.2025]`
- **Keine neuen Dateien, kein besonderes Markup.** Weder `llms.txt` noch eine KI-Textdatei, noch Markdown, noch besondere schema.org-Daten. Google Search ignoriert `llms.txt`. `[Regel laut Google · ZS-Q1; ZS-Q2, Stand 10.07.2026]`
- **Wichtiges als Text.** Google nennt als bewährte Praxis, «dass wichtige Inhalte in Textform verfügbar sind», und dass strukturierte Daten zum sichtbaren Text passen. `[Regel laut Google · ZS-Q1]`
- **Kein «Chunking» nötig.** Inhalte müssen nicht in kleine Stücke zerlegt werden; Googles Systeme erkennen mehrere Themen auf einer Seite. Es gibt keine ideale Seitenlänge. `[Regel laut Google · ZS-Q2]`
- **Nicht für KI umschreiben.** Die Systeme verstehen Synonyme. Wer jede Variante einer Frage abdecken will, braucht keine langen Wortlisten. Eigene Seiten für jede Fan-out-Frage verstossen gegen die Regel zu massenhaft erzeugten Inhalten. `[Regel laut Google · ZS-Q2]`
- **Eigenes statt Allgemeinwissen.** Google rät zu «non-commodity content»: eigene Erfahrung und Einsicht statt allgemein bekannter Tipps. `[Regel laut Google · ZS-Q2; ZS-Q3, 21.05.2025]`
- **Profil aktuell.** Unternehmensprofil und Merchant Center auf dem neusten Stand halten. `[Regel laut Google · ZS-Q1; ZS-Q2; ZS-Q3]`
- **Datum sichtbar und beschriftet.** Ein sichtbares Datum mit Bezeichnung wie «zuletzt aktualisiert»; Datum im Text und in den Daten gleich. `[Regel laut Google · ZS-Q4, für das Datum im Suchtreffer]`
- **Unechte Erwähnungen** auf fremden Seiten zu suchen, hilft laut Google wenig. `[Regel laut Google · ZS-Q2]`
- **Messen:** Die Search Console hat einen eigenen Bericht für generative KI-Funktionen. `[Regel laut Google · ZS-Q2]` Details in Semester 3, «Messen mit Search Console», und im Skript KQ. `[Verweis]`

### 3.2 Microsoft

`[Regel laut Microsoft · ZS-Q5, 08.10.2025; Beitrag im Werbe-Blog, nicht in der Bing-Dokumentation]`

- Copilot zerlegt Seiten in kleinere Stücke und bewertet sie einzeln.
- **Sätze, die allein stehen:** «Sentences that make sense even when pulled out of context.»
- **Frage und Antwort:** Direkte Fragen mit klarer Antwort kann ein Assistent oft Wort für Wort übernehmen.
- **Listen und Tabellen** zerlegen Details in saubere, wiederverwendbare Stücke.
- **Nichts Wichtiges verstecken:** nicht in Reitern oder Klappmenüs, nicht nur in Bildern, nicht nur in PDF.
- **Fehler:** Textwände, Sätze mit mehreren Behauptungen, Zierzeichen wie Pfeile und Sterne, Behauptungen ohne Messgrösse.
- **Strukturierte Daten** empfiehlt Microsoft, auch für Fragen.

### 3.3 Wo sich die Anbieter widersprechen

| Thema | Google | Microsoft | Folge für uns |
|---|---|---|---|
| Abschnitte, die allein stehen | nicht nötig für Google | empfohlen | Wir schreiben Sätze, die allein stehen, wegen der Wiedergabe, nicht wegen eines Rangs (ZS1). `[Annahme]` |
| Strukturierte Daten | nicht nötig, kein besonderes Schema | empfohlen | Strukturierte Daten nach S23 bis S25, ohne Versprechen zur KI (ZS17). `[Annahme]` |

Beide Anbieter schreiben über ihre Absicht. Messungen der Wirkung liefern sie nicht. `[Fakt · ZS-Q1 bis ZS-Q5]` Googles Satz, Klicks aus KI-Übersichten seien «higher quality», steht ohne Zahlen. `[Fakt · ZS-Q3]`

---

## 4. Was nur Meinung ist, was widerlegt oder unbelegt ist

| Behauptung | Stand der Belege | Urteil |
|---|---|---|
| «FAQ-Schema hilft der KI» | Google: kein besonderes Schema nötig; das FAQ-Rich-Result ist seit 07.05.2026 abgeschafft (S26). Ahrefs: neue strukturierte Daten ohne Wirkung auf Zitate. searchVIU: Angaben nur in JSON-LD fand im Direktabruf kein Dienst. Microsoft empfiehlt Schema, ohne Messung | für Google widerlegt, sonst unbelegt |
| «`llms.txt` bringt KI-Sichtbarkeit» | Google ignoriert die Datei. In C-SEO Bench half eine vorangestellte Zusammenfassung («LLM Guidance») in 2 von 6 Gebieten bei einem Modell; das ist keine Datei im Hauptordner | für Google widerlegt, sonst unbelegt |
| «Statistiken einfügen bringt +40 %» | GEO: ja, im Benchmark. C-SEO Bench: meist kein Gewinn, oft Schaden | umstritten; erfundene Zahlen nie (B8) |
| «Suchwörter wiederholen» | GEO: schlechter als nichts tun, auch bei Perplexity | widerlegt |
| «Seite alle 30 Tage aktualisieren» | keine Studie. Modelle bevorzugen jüngere Daten (Fang u. a.), das Datum lässt sich aber fälschen. Google verlangt ehrliche Daten (G19) | Meinung; ein Datum ohne Änderung ist ein Befund |
| «Fragen als Überschriften» | Microsoft: Frage und Antwort lassen sich wörtlich übernehmen. Keine Studie zu KI-Zitaten. Bei Klicks auf Suchtreffer kein Vorteil (S8) | Meinung |
| «In Stücke schreiben (Chunking)» | Google: nicht nötig. Anthropic: Abschnitte ohne Bezug werden schlechter gefunden | teilweise gestützt, aber nicht für Google |
| «Quellen zitieren hebt die Sichtbarkeit» | GEO: +30 bis 40 %. C-SEO Bench: kein verlässlicher Gewinn | umstritten; Quellen nennen wir wegen B2, B3 |
| «Die KI liest ein Schweizer Preisformat falsch» | nicht untersucht | unbelegt |
| «Erwähnungen auf fremden Seiten kaufen» | Google: unechte Erwähnungen helfen wenig; Chen u. a.: fremde Quellen zählen | Erwähnungen nur echt (P20) |

Alle Zeilen: `[Fakt · ZS-Q1; ZS-Q2; ZS-Q5; ZS-Q6; ZS-Q7; ZS-Q12; ZS-Q15; ZS-Q16; ZS-Q17; S-Q13 in Semester 3]`. Spalte «Urteil»: `[Annahme · eigene Einordnung]`.

---

## 5. Sätze, die allein stehen

### 5.1 Warum

Ein Dienst liest selten die ganze Seite in Ruhe. Er holt Stücke, oft einzelne Absätze, und übernimmt Sätze teils fast wörtlich. `[Fakt · ZS-Q5; ZS-Q8; ZS-Q10]` Ein Satz wie «Das kostet CHF 60.–» verliert im Stück seinen Gegenstand. Ein Satz mit Betrieb, Ort und Leistung bleibt richtig, wo immer er landet. `[Annahme]` Für Menschen gilt dasselbe: Wer quer liest, liest Satzanfänge (L3). `[Verweis]`

### 5.2 Regeln

- **Gegenstand im Satz.** Jeder Satz mit Preis, Zeit oder Frist nennt die Leistung. Kein «das», «dies», «diese», «dort» als Pronomen für den Gegenstand, kein «wie oben», «siehe unten». `[Regel laut Microsoft · ZS-Q5; Fakt · ZS-Q10; Wortliste: Annahme]`
- **Name und Ort je Abschnitt.** Der erste oder zweite Satz unter jedem Zwischentitel nennt den Betrieb und den Ort. Danach darf «wir» stehen (W12). `[Annahme nach ZS-Q10]`
- **Ein Fakt, ein Satz.** Ein Satz trägt höchstens zwei Beträge oder Zeiten. Mehr gehört in eine Tabelle. `[Regel laut Microsoft · ZS-Q5: überladene Sätze; Grenze: Annahme]`
- **Bedingung im selben Satz.** «Ohne Termin», «für 4 Räder», «November bis März» stehen beim Betrag, nicht im nächsten Absatz. Sonst gibt ein Dienst den Preis ohne Bedingung wieder. `[Annahme; vgl. R13, R14]`
- **Keine Zierzeichen statt Wörter.** Kein «✓», «→», «★» als Träger einer Aussage. `[Regel laut Microsoft · ZS-Q5]`

### 5.3 Beispiel: Garage Muster, Musterdorf (erfunden)

| Schwach | Besser |
|---|---|
| «Das geht bei uns auch ohne Termin. Es dauert etwa 20 Minuten.» | «Den Radwechsel macht die Garage Muster in Musterdorf ohne Termin, Montag bis Samstag 7.30 bis 12 Uhr. Ein Radwechsel dauert rund 20 Minuten.» |
| «Preise siehe oben.» | «Ein Radwechsel für 4 Räder kostet bei der Garage Muster CHF 60.–.» |
| «Radwechsel ✓ Pneuwechsel ✓ Einlagerung ✓» | Tabelle mit Leistung, Preis und Bedingung (Teil 8) |

---

## 6. Antwort zuerst, eindeutiger Name, gleiche Daten

### 6.1 Antwort zuerst

- Der erste Satz unter dem Haupttitel beantwortet die Hauptfrage der Seite mit einer Zahl, einem Ja oder Nein oder dem Kern (V1, L1, Q7, Q8, S13). `[Verweis]`
- Grund für KI-Suchen: Dienste übernehmen Sätze nah am Wortlaut, und Modelle nutzen den Anfang einer Eingabe besser als die Mitte. `[Fakt · ZS-Q8; ZS-Q9; Übertragung von der Eingabe auf die Seite: Annahme]`

### 6.2 Ein Name, eine Schreibweise

- Der Betrieb heisst auf jeder Seite gleich, so wie im Handelsregister oder am Schild (P1, R23). Keine Mischung aus «Garage Muster», «Muster Garage» und «Garage Muster Musterdorf». `[Verweis; Wirkung auf KI: Annahme]`
- Der Ort steht so, wie die Kundschaft ihn kennt. Bei Ortsnamen, die es mehrmals gibt, steht das Kantonskürzel dabei: «Wil SG». `[Annahme]`
- Name und Ort stehen in Haupttitel, erstem Absatz und Kontaktblock. `[Annahme; vgl. A18, S2]`

### 6.3 Gleiche Firmendaten überall

- Name, Adresse, Telefon, Zeiten und Preise stimmen auf Website, Unternehmensprofil, Verzeichnissen und in strukturierten Daten überein (P19, P6, P16, S25). `[Verweis]`
- Grund: KI-Suchen holen auch fremde Seiten über einen Betrieb. `[Fakt · ZS-Q17, nur Zusammenfassung]` Sie zitieren oft Kopien statt des Originals. `[Fakt · ZS-Q13, bei News]` Und sie übernehmen, was im gelesenen Text steht, auch wenn es falsch ist. `[Fakt · ZS-Q11]` Ein abweichender Preis im Verzeichnis kann so in der Antwort landen. `[Annahme]`
- Google rät ausdrücklich, Unternehmensprofil und Merchant Center aktuell zu halten. `[Regel laut Google · ZS-Q1; ZS-Q2]`

---

## 7. Stand-Datum und Zahlen als Text

### 7.1 Stand-Datum

- Jeder Block mit Preisen oder Öffnungszeiten trägt ein sichtbares Stand-Datum: «Stand: Oktober 2026» oder «Preise gültig ab 1. November 2026» (CH10). `[Annahme; Regel laut Google · ZS-Q4: Datum sichtbar und beschriftet]`
- Das Datum steht im selben Absatz oder in der Tabellenüberschrift, nicht nur im Fuss der Seite. Ein Abschnitt, der allein im Abruf landet, trägt sein Datum mit. `[Annahme nach ZS-Q10]`
- Das Datum ändert sich nur mit einer echten Prüfung oder Änderung (G19). Ein frisches Datum ohne Prüfung täuscht Menschen und Modelle. `[Verweis; Fakt · ZS-Q12: Modelle bevorzugen jüngere Daten]`
- Befristete Angaben nennen den Zeitraum im selben Satz: «Doppelzimmer ab CHF 139.– pro Nacht (November bis März)». `[Annahme; vgl. R6, R14]`

### 7.2 Zahlen als Text

- Preise, Zeiten, Fristen und Adressen stehen als Text im HTML, nicht nur in einem Bild, einer Grafik, einem PDF, einem Reiter oder in strukturierten Daten. `[Regel laut Google · ZS-Q1: wichtiges in Textform; Regel laut Microsoft · ZS-Q5; Fakt · ZS-Q16, Anbieter, Einzeltest]`
- Eine Preisliste als PDF darf es zusätzlich geben. Die Preise stehen dann auch auf der Seite und stimmen mit dem PDF überein (ZS13). `[Annahme]`
- Fakten als Ziffern (L11), Preise nach CH7, CH8 und R13. `[Verweis]`

---

## 8. Tabellen, sichtbare Fragen, keine Widersprüche

### 8.1 Tabellen für Preise

- Ab drei Preisen steht eine Tabelle mit Kopfzeile: Leistung, Preis, Bedingung. `[Regel laut Microsoft · ZS-Q5; Meinung · The AI Search Checklist, ZS-Q19; Grenze 3: Annahme]`
- Jede Zeile ist allein verständlich. Kein «dito», kein leeres Feld, das «wie oben» meint. `[Annahme nach ZS1]`
- Über der Tabelle steht ein Satz mit Betrieb, Ort und Stand-Datum. `[Annahme]`

Beispiel: Garage Muster, Musterdorf (erfunden)

> Preise der Garage Muster in Musterdorf, Stand: Oktober 2026
>
> | Leistung | Preis | Bedingung |
> |---|---|---|
> | Radwechsel, 4 Räder auf Felgen | CHF 60.– | ohne Termin, Mo bis Sa 7.30 bis 12 Uhr |
> | Pneuwechsel mit Auswuchten, 4 Reifen | CHF 120.– | bis 18 Zoll, mit Online-Termin |
> | Einlagerung | CHF 80.– je Saison | inkl. Waschen der Räder |

### 8.2 Sichtbare Fragen mit Antwort

- Fragen der Kundschaft stehen sichtbar als Zwischentitel oder Liste, nicht nur zugeklappt und nicht nur in strukturierten Daten (KW11, S14). `[Verweis; Regel laut Microsoft · ZS-Q5]`
- Die Antwort beginnt mit Ja, Nein, einer Zahl oder dem Kern und wiederholt den Gegenstand (ZS1): «Ja, die Garage Muster wechselt Räder ohne Termin.» `[Verweis KW11; Annahme]`
- Nur Fragen aus der Sammlung (KW12). Eine Frage nur für die KI zu erfinden, verstösst auch gegen Googles Regel zu massenhaften Inhalten. `[Verweis; Regel laut Google · ZS-Q2]`

### 8.3 Keine widersprüchlichen Seiten, keine alten Fassungen

- Eine Leistung hat genau einen gültigen Preis auf der ganzen Website. Alte Preislisten, Aktionsseiten, PDF und Kopien unter anderer Adresse werden gelöscht oder auf die gültige Seite weitergeleitet (Technik in TI). `[Annahme; Regel laut Google · ZS-Q2: doppelte Inhalte reduzieren]`
- Grund: Modelle übernehmen, was sie lesen (ZS-Q11). Veraltete Angaben gehören zu den häufigen groben Fehlern von KI-Assistenten (ZS-Q14). Bei zwei Fassungen ist offen, welche der Dienst holt. `[Fakt · ZS-Q11; ZS-Q14; Folge: Annahme]`
- Archiv nur mit Hinweis: Soll eine alte Fassung bleiben, steht im ersten Satz «Die Preisliste der Garage Muster galt bis 31. März 2025. Die gültigen Preise der Garage Muster stehen auf der Seite Radwechsel.». `[Annahme]`

---

## 9. Vergleich mit der KI-Such-Checkliste

«The AI Search Checklist» der Agentur Contact hat 81 Punkte in 6 Teilen. Sie nennt keine Studie und keine Messung. `[Fakt · ZS-Q19, Abruf 01.11.2026]` Eine deutsche Bearbeitung ergänzt vier Punkte, darunter `llms.txt` und einen Markdown-Spiegel jeder Seite. Wir lesen sie als Vergleich, nicht als Beleg. Hier nur die Punkte zu Textbausteinen.

| Punkt der Checkliste | Was Belege sagen | Bei uns |
|---|---|---|
| «Key takeaways» (Kernaussagen-Block) | keine Studie; Antwort zuerst ist gestützt (ZS-Q8, ZS-Q9, als Übertragung) | ersetzt durch ZS4: Antwort im ersten Satz, kein eigener Block nötig |
| «FAQ section» mit FAQ-Daten | sichtbare Fragen: Microsoft dafür; FAQ-Daten: für Google ohne Wirkung (Teil 4) | sichtbare Fragen ja (ZS12); FAQ-Daten als KI-Mittel **widerspricht** ZS17 |
| «Specific numbers» | Konkretes ist bei Menschen gestützt (K2, W22); GEO «Statistiken» umstritten | gestützt, nur belegte Zahlen (ZS15, B8) |
| «Dates» | Modelle bevorzugen jüngere Daten (ZS-Q12); Google: Datum sichtbar (ZS-Q4) | gestützt als Stand-Datum (ZS7, ZS8) |
| «Comparison tables» | Microsoft dafür; keine Studie | gestützt für Preise (ZS11); Firmenvergleich nur nach R4 |
| «Bottom-line-up-front» | ZS-Q8, ZS-Q9 als Übertragung | gestützt (ZS4) |
| «Extractable passages» | Microsoft dafür; Anthropic: Abschnitt ohne Bezug wird schlechter gefunden; Google: nicht nötig | gestützt (ZS1, ZS2) |
| «Every H2 is a self-contained island» | wie oben | gestützt (ZS2) |
| «Question-based headers» | keine Studie zu KI; bei Klicks kein Vorteil (S8) | **fehlt bei uns** als Pflicht; Frage-Titel nur als echte Kundenfrage (U3, KW12) |
| «Citable facts with sources» | GEO dafür, C-SEO Bench ohne Gewinn | teilweise; Quelle nennen wegen B2, B3 (ZS16) |
| «Entity-rich writing» | Anthropic: Name und Zeitraum im Abschnitt helfen dem Abruf | gestützt (ZS2, ZS5) |
| «Content uses semantic triples» | keine Studie | deckt sich mit W12 und ZS1; als Begriff entbehrlich |
| «Updated within the last 30 days» | keine Studie; Datum lässt sich fälschen (ZS-Q12) | **widerspricht** G19 und ZS8 |
| Zusatz `llms.txt`, Markdown-Spiegel | Google ignoriert beides (ZS-Q2) | **widerspricht** ZS17, soweit damit KI-Wirkung versprochen wird |

Alle Punkte der Checkliste: `[Meinung · The AI Search Checklist, inboundengineer.io]`. Spalte «Was Belege sagen»: `[Fakt · Quellen in der Zeile]`. Spalte «Bei uns»: `[Annahme · eigene Einordnung]`.

---

## 10. Wenn in der Schweiz

- **Hochdeutsch auf der Seite.** Die Seite ist in Schweizer Hochdeutsch geschrieben, ohne Eszett (CH1). Mundart nur in Namen und Zitaten (CH3). Ob Sprachmodelle geschriebene Mundart schlechter wiedergeben, hat keine gefundene Studie gemessen. `[Fakt · eigene Suche, 01.11.2026, ohne Treffer; Regel: Annahme]`
- **Wörter der Kundschaft.** Helvetismen wie «Pneu», «Velo», «Coiffeur», «Offerte» sind Schweizer Hochdeutsch und stehen als Hauptwort (CH2, KW6). Zwei Wörter für Verschiedenes werden unterschieden und erklärt: «Radwechsel (Räder auf Felgen)» und «Pneuwechsel (Reifen von der Felge)». `[Verweis; Annahme]`
- **Varianten nicht stapeln.** Sucht die Kundschaft «Reifenwechsel», «Pneuwechsel» und «Radwechsel», steht jede Variante höchstens einmal, und nur, wo sie etwas unterscheidet. Google versteht Synonyme und rät von Wortlisten ab. `[Regel laut Google · ZS-Q2; G4]`
- **Schweizer Formate** für Geld, Datum, Zeit und Telefon: CH7, CH8, CH10, CH11, CH12. Ob «CHF 60.–» von allen Diensten gleich gelesen wird, ist nicht untersucht. Wichtig ist, dass die Form überall gleich ist. `[Verweis; Annahme]`
- **Ortsnamen eindeutig.** Gemeinde mit Kantonskürzel bei Doppelnamen, Ortsteil bei grossen Städten («Zürich-Oerlikon»), Postleitzahl in der Adresse. `[Annahme]`
- **Eine Sprache je Seite** (S31), Name nicht übersetzt (P21). Für französische und italienische Fassungen gelten dieselben ZS-Grundsätze in der jeweiligen Sprache. `[Verweis; Annahme]`
- **Schweizer Daten:** Die EBU-Studie bezog SRF ein und prüfte 14 Sprachen. Eine Auswertung nur für die Schweiz oder nur für Deutsch fand ich nicht. `[Fakt · ZS-Q14]`

---

## 11. Prüfbare Grundsätze

Jede Regel kann ein Werkzeug oder ein Bewerter ohne Vorwissen entscheiden. Grenzwerte ohne Studie sind `[Annahme]`. «Regel laut Google» oder «Regel laut Microsoft» belegt die Absicht des Anbieters, nicht die Wirkung. Neu prüfen: Anbieter-Dokumentation alle 6 Monate, weil sich KI-Funktionen laufend ändern. `[Annahme]`

**Sätze und Abschnitte**

- **ZS1 Satz steht allein.** Jeder Satz mit Preis, Zeit, Frist oder Bedingung nennt die Leistung selbst. 0 Sätze, die mit «Das», «Dies», «Diese», «Dort», «Hier» als Pronomen beginnen, also ohne Nomen danach; 0 «wie oben», «siehe oben», «siehe unten», «wie erwähnt». Werkzeug: Wortliste am Satzanfang und im Satz; Bewerter für Grenzfälle. `[Regel laut Microsoft · ZS-Q5; Fakt · ZS-Q10; Wortliste: Annahme]`
- **ZS2 Name und Ort je Abschnitt.** Unter jedem Zwischentitel nennen die ersten 2 Sätze den Betriebsnamen oder den Ort, auf Leistungsseiten beides mindestens einmal je Abschnitt mit Preis oder Zeit. Werkzeug. `[Fakt · ZS-Q10: Abschnitt ohne Firma und Zeitraum wird schlechter gefunden; Regel: Annahme]`
- **ZS3 Ein Fakt, ein Satz.** Kein Satz im Fliesstext trägt mehr als 2 Beträge oder mehr als 2 Zeitangaben. Mehr gehört in eine Tabelle (ZS11). Werkzeug. `[Regel laut Microsoft · ZS-Q5; Grenze: Annahme]`
- **ZS4 Antwort zuerst.** Der erste Satz nach dem Haupttitel beantwortet die Hauptfrage der Seite: Er enthält einen Betrag, eine Zeit, ein Ja oder Nein oder die Leistung mit Ort. Werkzeug: Betrag, Ziffer mit Zeiteinheit oder Ja/Nein im ersten Satz; Bewerter. `[Verweis V1, Q7, Q8, S13; Fakt · ZS-Q9, Übertragung: Annahme]`

**Name, Ort, Firmendaten**

- **ZS5 Eine Schreibweise des Namens.** Der Betriebsname steht auf jeder Seite mindestens einmal im Fliesstext, immer gleich geschrieben wie in der Referenzliste (P19). 0 Varianten. Werkzeug: Varianten zählen. `[Verweis P1, P19, R23; Wirkung auf KI: Annahme]`
- **ZS6 Gleiche Daten überall.** Name, Adresse, Telefon, Zeiten und Preise auf jeder Seite, im Profil, in Verzeichnissen und in strukturierten Daten stimmen mit der Referenzliste überein. Werkzeug: Abgleich je Feld; 0 Abweichungen. `[Fakt · ZS-Q11; ZS-Q13; Regel laut Google · ZS-Q1: Profil aktuell; Verweis P19, S25]`

**Datum und Zahlen**

- **ZS7 Stand-Datum beim Fakt.** Jeder Absatz, jede Liste und jede Tabelle mit Preisen oder Öffnungszeiten trägt im selben Block ein sichtbares Datum («Stand: Oktober 2026»), nach CH10. Werkzeug. `[Regel laut Google · ZS-Q4; Fakt · ZS-Q12; ZS-Q14: veraltete Angaben häufig; Ort im Block: Annahme]`
- **ZS8 Datum ehrlich.** Das Stand-Datum ändert sich nur mit einer dokumentierten Prüfung oder Änderung (G19). Kein Datum jünger als die letzte Prüfung. Prüfung: Fassungen vergleichen. `[Fakt · ZS-Q12: jüngeres Datum verschiebt Modellurteile; Verweis G19]`
- **ZS9 Frist bei befristeten Angaben.** Saisonpreise, Aktionen und Sonderzeiten nennen Beginn und Ende im selben Satz. Werkzeug: Wörter wie «Saison», «Aktion», «Winter» ohne Datum oder Monatsspanne. `[Annahme; vgl. R6]`
- **ZS10 Zahlen als Text.** Jeder Wert aus der Faktenliste (Preis, Zeit, Frist, Telefon, Adresse) steht im sichtbaren HTML-Text der Seite. 0 Werte nur in Bild, PDF, Reiter, Klappmenü oder strukturierten Daten. Werkzeug: Faktenliste gegen sichtbaren Text. `[Regel laut Google · ZS-Q1; Regel laut Microsoft · ZS-Q5; Fakt · ZS-Q16, Anbieter]`

**Bausteine**

- **ZS11 Tabelle für Preise.** Ab 3 Preisen auf einer Seite steht eine HTML-Tabelle mit Kopfzeile (Leistung, Preis, Bedingung). Jede Zeile ist allein verständlich. Werkzeug: Beträge zählen, `<table>` mit `<th>` suchen. `[Regel laut Microsoft · ZS-Q5; Grenze: Annahme]`
- **ZS12 Fragen sichtbar beantwortet.** Jede Frage der Kundschaft steht als sichtbarer Text mit Antwort darunter. Die Antwort beginnt mit Ja, Nein, einer Zahl oder dem Kern und nennt den Gegenstand (ZS1). Werkzeug: Fragezeichen am Zwischentitel, Antwort im ersten Satz; 0 Antworten nur in zugeklappten Elementen. `[Verweis KW11, KW12, S14; Regel laut Microsoft · ZS-Q5]`
- **ZS13 Eine gültige Fassung.** Je Leistung gibt es auf der ganzen Website genau einen Preis und eine Frist. Alte Preislisten, PDF und Kopien sind gelöscht oder weitergeleitet, oder sie tragen im ersten Satz «galt bis» mit Datum und einen Link auf die gültige Seite. Werkzeug: alle Seiten und PDF durchsuchen, Beträge je Leistung sammeln; mehr als ein Wert ist ein Befund. `[Fakt · ZS-Q11; ZS-Q14; Regel laut Google · ZS-Q2; Regel: Annahme]`

**Inhalt statt Trick**

- **ZS14 Eigenes vor Allgemeinem.** Jede Leistungsseite nennt mindestens 3 Fakten, die nur dieser Betrieb hat: Preis, Frist, Zeit, Ort, Ablauf. Prüffrage nach dem Ersetzungstest (K3). `[Regel laut Google · ZS-Q2: «non-commodity content»; Zahl: Annahme]`
- **ZS15 Kein Stil-Trick, keine erfundene Zahl.** Kein Text wird umgeschrieben, nur um «autoritativer» zu klingen. Zahlen, Zitate und Statistiken nur aus der Faktenliste des Betriebs (B8, R1). Prüffrage je Zahl: Wo steht der Beleg? `[Fakt · ZS-Q6: Stil wirkt ohne Information; ZS-Q7: kein verlässlicher Gewinn; Verweis B8, R1]`
- **ZS16 Fremde Fakten mit Quelle.** Eine Regel, die nicht vom Betrieb stammt (Krankenkasse, Gesetz, Hersteller), nennt ihre Quelle im selben Satz und verlinkt sie (B2, B3). Prüffrage. `[Verweis; Fakt · ZS-Q6 dafür, ZS-Q7 ohne Gewinn: Wirkung auf KI umstritten]`
- **ZS17 Keine KI-Versprechen.** Kein Angebot, kein Bericht und keine Prüfliste verspricht Zitate in KI-Suchen oder schreibt FAQ-Daten, `llms.txt`, Markdown-Spiegeln oder strukturierten Daten eine KI-Wirkung zu. Strukturierte Daten nur nach S23 bis S25. Prüffrage. `[Regel laut Google · ZS-Q1; ZS-Q2; Fakt · ZS-Q15; ZS-Q16; Verweis G2, S26]`
- **ZS18 Keine Seiten für Varianten.** Keine eigene Seite und keine Wortliste für jede Variante einer Frage. Jede Variante höchstens einmal je Seite (G4). Werkzeug wie G4; Seitenplan nach S27. `[Regel laut Google · ZS-Q2; Fakt · ZS-Q6: Suchwörter stopfen schadet]`

**Prüfen**

- **ZS19 Wiedergabe-Probe.** Vor der Freigabe beantworten mindestens 2 Modelle ohne Vorwissen je 3 Kundenfragen nur aus der Seite. Jede Angabe der Antworten wird mit der Faktenliste verglichen. Schwelle: 0 falsche Fakten. Das Ergebnis heisst «Modell-Urteil» (S29). Werkzeug: maschineller Abgleich mit einer Prüfliste der Fakten. `[Fakt · ZS-Q8; ZS-Q14: falsche Wiedergabe ist häufig; Schwelle: Annahme]`
- **ZS20 Quellenauswahl benannt.** Jeder Bericht über einen KI-Test sagt, ob der Dienst die Quellen selbst gesucht hat oder ob sie vorgegeben waren. Vorgegebene Quellen belegen nur die Wiedergabe, nicht die Auswahl. Prüffrage. `[Fakt · ZS-Q6: Quellen vorgegeben; ZS-Q7: Platz im Abruf entscheidet]`

**Wenn in der Schweiz**

- **ZS21 Hochdeutsch, Mundart nur bewusst.** Fliesstext in Schweizer Hochdeutsch, 0 Eszett (CH1), Mundart nur in Namen und Zitaten (CH3). Werkzeug: `slop-de.js`; Bewerter für Mundart. `[Verweis; Annahme: keine Studie zu Mundart in Sprachmodellen gefunden]`
- **ZS22 Kundenwort führt, Varianten unterschieden.** Das Wort der Kundschaft in der Deutschschweiz steht als Hauptwort (CH2, KW6). Zwei Wörter für verschiedene Leistungen («Radwechsel», «Pneuwechsel») werden beim ersten Vorkommen in Klammern unterschieden. Prüffrage. `[Verweis; Annahme]`
- **ZS23 Schweizer Formate einheitlich.** Geld, Datum, Uhrzeit und Telefon nach CH7, CH8, CH10, CH11, CH12, auf allen Seiten und im Profil in derselben Form. Werkzeug wie dort. `[Verweis; Einheitlichkeit für KI: Annahme]`
- **ZS24 Ort eindeutig.** Gemeindename wie im amtlichen Verzeichnis; bei Doppelnamen mit Kantonskürzel, bei grossen Städten mit Ortsteil, wenn der Betrieb dort liegt. Werkzeug: Abgleich mit Ortsliste. `[Annahme]`

---

## 12. Für die Semesterprüfung

Der KI-Zitat-Test (T6) gibt KI-Such-Agenten 5 echte Quellen und eine eigene Musterseite je Frage. Die Agenten beantworten die Frage nur aus diesen Quellen und nennen bei jeder Angabe die Quelle. Ergebnis ist ein **Modell-Urteil** (S29). Der Test überspringt die Quellenauswahl (ZS20).

### 12.1 Checkliste für eine eigene Musterseite

- [ ] Erster Satz beantwortet die Testfrage mit Betrag, Zeit oder Ja/Nein (ZS4).
- [ ] Betrieb und Ort in jedem Abschnitt (ZS2), Name immer gleich (ZS5).
- [ ] Kein Satz mit «das», «dies», «dort» als Gegenstand, kein «wie oben» (ZS1).
- [ ] Höchstens 2 Beträge je Satz; ab 3 Preisen eine Tabelle (ZS3, ZS11).
- [ ] Stand-Datum im Block mit Preisen und Zeiten (ZS7).
- [ ] Bedingungen und Fristen beim Betrag (ZS9).
- [ ] Sichtbare Fragen mit Antwort, nur Fragen, die zur Testfrage passen (ZS12).
- [ ] Nur Fakten aus der Faktenliste; nichts dazu erfunden (ZS15, B8).
- [ ] 250 bis 350 Wörter, ähnlich lang wie die echten Quellen (Längen-Verzerrung, siehe Abgleich mit Menschen).
- [ ] `slop-de.js` mit 0 Fehlern (K1).

### 12.2 Kontrollen

- **Veraltete Fassung:** dieselbe Seite mit älterem Stand-Datum und tieferem Preis. Erwartet: Die Antwort nennt den aktuellen Preis. Prüft ZS7, ZS8 und ZS13 von der anderen Seite: Was passiert, wenn eine alte Fassung erreichbar bleibt? `[Annahme]`
- **Leere Seite:** viele Suchwörter, keine Fakten. Erwartet: wird nicht zitiert. Prüft ZS14 und ZS18. `[Fakt · ZS-Q6: Suchwörter stopfen schadet; Erwartung: Annahme]`

### 12.3 Beispiel: Garage Muster, Musterdorf (erfunden, gekürzt)

> **Radwechsel und Pneuwechsel in Musterdorf**
>
> Ein Radwechsel für 4 Räder kostet bei der Garage Muster in Musterdorf CHF 60.–, ohne Termin. Die Garage Muster wechselt Räder Montag bis Samstag von 7.30 bis 12 Uhr. Ein Radwechsel dauert rund 20 Minuten.
>
> **Ohne Termin zum Radwechsel**
>
> Für den Radwechsel bei der Garage Muster braucht es keinen Termin. Der Radwechsel gilt für Räder, die schon auf Felgen montiert sind.
>
> **Preise, Stand: Oktober 2026** (Tabelle wie in Teil 8.1)

Schwach wäre: «Will·kommen bei Ihrer Garage des Ver·trauens! Dies und vieles mehr bieten wir Ihnen. Preise siehe Preisliste (PDF).»

---

## 13. Quellen

Alle abgerufen am 01.11.2026. Datum in Klammern: Stand der Seite laut Anbieter.

**Anbieter**

- **ZS-Q1** Google Search Central: «AI features and your website» (10.12.2025). https://developers.google.com/search/docs/appearance/ai-features
- **ZS-Q2** Google Search Central: «Optimizing your website for generative AI features on Google Search» (10.07.2026). https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- **ZS-Q3** John Mueller: «Top ways to ensure your content performs well in Google's AI experiences on Search». Google Search Central Blog, 21.05.2025. https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search
- **ZS-Q4** Google Search Central: «Influence your byline dates in Google Search» (10.12.2025). https://developers.google.com/search/docs/appearance/publication-dates
- **ZS-Q5** Krishna Madhavan: «Optimizing Your Content for Inclusion in AI Search Answers». Microsoft Advertising Blog, 08.10.2025. https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers

**Studien**

- **ZS-Q6** Pranjal Aggarwal, Vishvak Murahari, Tanmay Rajpurohit, Ashwin Kalyan, Karthik Narasimhan, Ameet Deshpande: «GEO: Generative Engine Optimization». KDD 2024; arXiv 2311.09735, Fassung 3 vom 28.06.2024. https://arxiv.org/abs/2311.09735
- **ZS-Q7** Haritz Puerto, Martin Gubri, Tommaso Green, Seong Joon Oh, Sangdoo Yun: «C-SEO Bench: Does Conversational SEO Work?». NeurIPS 2025, Datasets and Benchmarks; arXiv 2506.11097, Fassung 3. https://arxiv.org/abs/2506.11097
- **ZS-Q8** Nelson F. Liu, Tianyi Zhang, Percy Liang: «Evaluating Verifiability in Generative Search Engines». Findings of EMNLP 2023; arXiv 2304.09848. https://arxiv.org/abs/2304.09848
- **ZS-Q9** Nelson F. Liu, Kevin Lin, John Hewitt, Ashwin Paranjape, Michele Bevilacqua, Fabio Petroni, Percy Liang: «Lost in the Middle: How Language Models Use Long Contexts». Angenommen bei Transactions of the ACL; arXiv 2307.03172, Vorabdruck 2023. https://arxiv.org/abs/2307.03172
- **ZS-Q10** Anthropic: «Introducing Contextual Retrieval», 19.09.2024. Anbieter. https://www.anthropic.com/news/contextual-retrieval
- **ZS-Q11** Kevin Wu, Eric Wu, James Zou: «ClashEval: Quantifying the tug-of-war between an LLM's internal prior and external evidence». arXiv 2404.10198, Fassung 3 vom 07.02.2025, Vorabdruck. https://arxiv.org/abs/2404.10198
- **ZS-Q12** Hanpei Fang, Sijie Tao, Nuo Chen, Kai-Xin Chang, Tetsuya Sakai: «Do Large Language Models Favor Recent Content? A Study on Recency Bias in LLM-Based Reranking». arXiv 2509.11353, Fassung 1 vom 14.09.2025, Vorabdruck. https://arxiv.org/abs/2509.11353
- **ZS-Q13** Klaudia Jaźwińska, Aisvarya Chandrasekar: «AI Search Has a Citation Problem». Columbia Journalism Review, Tow Center, 06.03.2025. https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php
- **ZS-Q14** European Broadcasting Union und BBC: «News Integrity in AI Assistants», Medienmitteilung 22.10.2025, Bericht 21.10.2025. https://www.ebu.ch/news/2025/10/ai-s-systemic-distortion-of-news-is-consistent-across-languages-and-territories-international-study-by-public-service-broadcaste · Bericht: https://www.ebu.ch/research/open/report/news-integrity-in-ai-assistants
- **ZS-Q15** Louise Linehan: «We Tracked 1,885 Pages Adding Schema. AI Citations Barely Moved.» Ahrefs, 11.05.2026. Anbieter. https://ahrefs.com/blog/schema-ai-citations/
- **ZS-Q16** searchVIU (Autor «Michael»): «Schema Markup and AI in 2025: What ChatGPT, Claude, Perplexity & Gemini Really See», 02.12.2025. Anbieter. https://www.searchviu.com/en/schema-markup-and-ai-in-2025-what-chatgpt-claude-perplexity-gemini-really-see/
- **ZS-Q17** Mahe Chen, Xiaoxuan Wang, Kaiwen Chen, Nick Koudas: «Generative Engine Optimization: How to Dominate AI Search». arXiv 2509.08919, 10.09.2025, Vorabdruck, nur Zusammenfassung. https://arxiv.org/abs/2509.08919
- **ZS-Q18** Aounon Kumar, Himabindu Lakkaraju: «Manipulating Large Language Models to Increase Product Visibility». arXiv 2404.07981, Fassung 2 vom 02.09.2024, Vorabdruck. https://arxiv.org/abs/2404.07981

**Vergleich, kein Beleg**

- **ZS-Q19** Contact: «The AI Search Checklist», 81 Punkte, ohne Datum. Meinung, keine Studie. https://www.inboundengineer.io/ai-search-checklist/checklist
