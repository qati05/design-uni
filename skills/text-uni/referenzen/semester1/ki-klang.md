# KI-Klang und Floskeln · Skript Semester 1

> **Quellen** (gelesen am 01.11.2026, online; volle Liste mit URL am Ende):
> 1. Clark u. a., «All That's 'Human' Is Not Gold», 2021 (Menschen gegen GPT-3)
> 2. Jakesch, Hancock, Naaman, «Human heuristics for AI-generated language are flawed», PNAS 2023
> 3. Russell, Karpinska, Iyyer, «People who frequently use ChatGPT for writing tasks are accurate and robust detectors of AI-generated text», ACL 2025
> 4. Fiedler, Döpke, «Do humans identify AI-generated text better than machines? Evidence based on excerpts from German theses», 2025
> 5. Doru, Maier, Busse, «Detecting AI-Generated Versus Human-Written Medical Student Essays», JMIR Medical Education 2025 (deutsche Texte)
> 6. Milička u. a., «Humans can learn to detect AI-generated texts, or at least learn when they can't», 2025
> 7. Frank u. a., «A Representative Study on Human Detection of Artificially Generated Media Across Countries», IEEE S&P 2024
> 8. Kobak u. a., «Delving into LLM-assisted writing in biomedical publications through excess vocabulary», Science Advances 2025
> 9. Liang u. a., «Mapping the Increasing Use of LLMs in Scientific Papers», 2024
> 10. Liang u. a., «Monitoring AI-Modified Content at Scale» (Gutachten an KI-Konferenzen), 2024
> 11. Reinhart u. a., «Do LLMs write like humans? Variation in grammatical and rhetorical styles», PNAS 2025
> 12. Juzek, Ward, «Why Does ChatGPT 'Delve' So Much?», COLING 2025 (nur Zusammenfassung gelesen)
> 13. Irrgang u. a., «Features and Detectability of German Texts Generated with Large Language Models», KONVENS 2024
> 14. Weber-Wulff u. a., «Testing of detection tools for AI-generated text», International Journal for Educational Integrity 2023
> 15. Liang u. a., «GPT detectors are biased against non-native English writers», Patterns 2023
> 16. Sadasivan u. a., «Can AI-Generated Text be Reliably Detected?», TMLR 2025 (Preprint 2023)
> 17. OpenAI, «New AI classifier for indicating AI-written text», Januar 2023, abgeschaltet Juli 2023 (Originalseite gesperrt, Zahlen über mehrere Berichte geprüft)
> 18. Freeburg, «The Last Fingerprint: How Markdown Training Shapes LLM Prose», 2026 (Preprint, eine Person, nicht begutachtet)
> 19. WikiProject AI Cleanup, «Wikipedia:Signs of AI writing», Stand Oktober 2026 (Ratgeber, keine Studie)
> 20. Morkes, Nielsen, «Concise, SCANNABLE, and Objective: How to Write for the Web», Nielsen Norman Group 1997
> 21. Rat für deutsche Rechtschreibung, Amtliches Regelwerk 2016, redigiert 2018, § 25 E2
>
> Nicht gefunden: eine Studie, die Floskeln auf deutschsprachigen KMU-Websites zählt; eine Studie zu Dreierlisten, Absicherungen oder gleich langen Absätzen mit Zahlen. Alles dazu steht unten als `[Annahme]` oder `[Meinung]`.
>
> Herkunft: `[Fakt · Quelle, Datum]`, `[Annahme]`, `[Meinung · Autor]`, `[Vorschlag]`.

**Schreibweise der Beispiele.** Das bestehende Floskel-Werkzeug prüft auch dieses Skript. Es kennt keine Ausnahme für zitierte Beispiele. Darum steht in jeder Floskel, die das Werkzeug melden würde, ein Mittelpunkt im Wort, etwa «ganz·heitlich». Beim Lesen den Punkt einfach überspringen. Alle Betriebe in den Beispielen sind erfunden.

---

## 1. Grundbegriffe

- **Floskel:** eine Wendung, die in vielen Texten steht und im eigenen Text nichts Prüfbares sagt. Prüffrage: Bleibt der Satz wahr, wenn man den Namen des Betriebs durch einen Mitbewerber ersetzt? Dann ist er austauschbar. `[Annahme]`
- **Nach Vorlage:** Der Text hält sich an ein Muster, das Leser schon oft gesehen haben (Begrüssung, Selbstlob, Dreierliste, höflicher Schluss). Das gibt es seit Jahrzehnten, auch ohne KI. `[Annahme]`
- **KI-Klang:** Merkmale, die in Texten von Sprachmodellen deutlich häufiger vorkommen als in Texten von Menschen. Die Forschung misst das über Wortfrequenzen, Grammatik und Satzbau, nicht über einzelne Texte. `[Fakt · Kobak u. a., 2025; Reinhart u. a., 2025]`
- **Detektor:** ein Programm, das für einen Text schätzt, ob ihn ein Modell geschrieben hat. Es gibt zwei Fehler: KI-Text als menschlich durchlassen (falsch negativ) und Menschentext als KI melden (falsch positiv). `[Fakt · Weber-Wulff u. a., 2023]`
- **Werbesprache («Marketese»):** Übertreibung, subjektive Behauptung und Eigenlob. `[Fakt · Morkes, Nielsen, 1997]`

Wichtig für den ganzen Text: Ein Merkmal ist kein Beweis. Es macht einen Text schwächer, egal wer ihn geschrieben hat. Das Ziel ist ein klarer, belegter Text, nicht ein Text, der einen Detektor täuscht. `[Meinung · WikiProject AI Cleanup, 2026: Oberflächenmerkmale allein zu entfernen löst das eigentliche Problem nicht]`

---

## 2. Wie gut erkennen Menschen KI-Text?

**Ohne Übung: kaum besser als Raten.**
- Laien unterscheiden GPT-3-Texte (Geschichten, Nachrichten, Rezepte) auf Zufallsniveau. Kurzes Training hebt die Trefferquote auf höchstens 55 %, nicht signifikant über alle drei Textsorten. Die Bewerter nannten oft widersprüchliche Gründe. `[Fakt · Clark u. a., 2021]`
- In sechs Experimenten mit 4600 Personen lagen die Teilnehmenden bei KI-Selbstdarstellungen (Beruf, Gastgewerbe, Partnersuche) in 50 bis 52 % der Fälle richtig. Geld und Rückmeldung halfen nicht. `[Fakt · Jakesch u. a., PNAS, 07.03.2023]`
- In einer Umfrage mit 3002 Personen aus den USA, Deutschland und China rieten die meisten bei Bild, Ton und Text. KI-Inhalte wurden sogar menschlicher bewertet. `[Fakt · Frank u. a., IEEE S&P 2024]`

**Die Hinweise, auf die Laien achten, sind oft falsch.** `[Fakt · Jakesch u. a., 2023]`
- Grammatikfehler hielten Leser für ein Zeichen von KI. Tatsächlich kamen sie eher von Menschen.
- Seltene Wortpaare und lange Wörter hielten Leser für KI. Sie waren eher menschlich.
- Ich-Form, Familie und Lebenserfahrung hielten Leser für menschlich. Das hing nicht mit der echten Herkunft zusammen.
- Gültig waren nur zwei Hinweise: unsinniger Inhalt und Wiederholung.
- Leser hielten den leichter lesbaren Text eher für menschlich. KI-Texte waren aber oft die lesbareren, das führte zu Fehlern. `[Fakt · Milička u. a., 2025, 255 Personen, Tschechisch]`

**Auf Deutsch: ähnlich, mit einer Ausnahme.**
- 63 Dozierende einer deutschen Fachhochschule lasen Auszüge von 200 bis 300 Wörtern. Sie ordneten 57 % der KI-Texte und 64 % der Menschentexte richtig zu. Gut geschriebene KI-Texte ordneten weniger als 20 % richtig zu. Detektoren waren nicht signifikant besser. `[Fakt · Fiedler, Döpke, 2025]`
- 35 Fachleute (Medizin und Geisteswissenschaften) verglichen je zwei Paare deutscher Texte: Studierende gegen ChatGPT 3.5. Sie fanden den KI-Text in 70 % der Runden (48 von 69). Inhaltliche Fehler halfen kaum. Den Ausschlag gaben Redundanz, Wiederholung und ein schwacher roter Faden. `[Fakt · Doru u. a., JMIR Medical Education, 2025]`

**Mit Übung: sehr gut.**
- Fünf Personen, die oft selbst mit Sprachmodellen schreiben, fanden KI-Sachtexte mit 92,7 % Trefferquote bei 4 % Fehlalarm. Ihr Mehrheitsentscheid lag bei 300 Artikeln nur einmal falsch. Laien lagen bei 56,7 % Treffern und 51,7 % Fehlalarm. Die Geübten schlugen die meisten Detektoren, auch nach Umschreiben. `[Fakt · Russell u. a., ACL 2025]`
- Ihre Begründungen: Wortschatz (53 % der Begründungen), Satzbau und vorhersehbare Satzmuster (36 %), Grammatik und Zeichensetzung (25 %), fehlende Originalität (24 %), Zitate, die wie der restliche Text klingen (22 %), Klarheit (20 %). `[Fakt · Russell u. a., 2025]`
- Rückmeldung nach jedem Urteil hob die Trefferquote von 55,5 % auf 65,1 %. `[Fakt · Milička u. a., 2025]`

**Folge für Werbetexte:** Ein Laie merkt selten, *dass* KI geschrieben hat. Er merkt aber, *dass* der Text leer, wiederholt oder austauschbar ist. Das kostet Vertrauen, unabhängig von der Herkunft. `[Annahme, abgeleitet aus Jakesch 2023 und Doru 2025]`

---

## 3. Stilmerkmale, die die Forschung misst

### 3.1 Bestimmte Wörter häufen sich

- In 15 Millionen PubMed-Zusammenfassungen (2010 bis 2024) stiegen ab 2023 einzelne Wörter sprunghaft an: «delves» 28-mal so häufig wie erwartet, «underscores» 13,8-mal, «showcasing» 10,7-mal. Mindestens 13,5 % der Zusammenfassungen von 2024 liefen durch ein Sprachmodell, in manchen Teilgruppen um 40 %. `[Fakt · Kobak u. a., Science Advances, 02.07.2025]`
- Fast alle Überschuss-Wörter von 2024 sind Stilwörter, keine Fachwörter: 379 von 454. Davon sind 66 % Verben und 14 % Adjektive. `[Fakt · Kobak u. a., 2025]`
- In Gutachten zur Konferenz ICLR 2024 kam «meticulous» 34,7-mal häufiger vor als vorher, «intricate» 11,2-mal, «commendable» 9,8-mal. 6,5 bis 16,9 % des Gutachtentexts waren stark KI-bearbeitet, mehr kurz vor der Frist. `[Fakt · Liang u. a., «Monitoring AI-Modified Content», 2024]`
- In fast einer Million Fachartikeln (2020 bis Februar 2024) stieg der KI-Anteil in der Informatik auf bis zu 17,5 %, in der Mathematik höchstens 6,3 %. `[Fakt · Liang u. a., «Mapping», 2024]`
- GPT-4o nutzt «camaraderie» 162-mal, «tapestry» 155-mal, «intricate» 119-mal und «underscore» 107-mal so oft wie Menschen. `[Fakt · Reinhart u. a., PNAS, 25.02.2025]`
- Warum: Weder Architektur noch Trainingsdaten erklären die Häufung. Die Befunde passen zum Feinschliff durch menschliche Rückmeldung (RLHF). `[Fakt · Juzek, Ward, COLING 2025, nur Zusammenfassung gelesen]`
- **Grenze:** Die Listen gelten für Englisch und für bestimmte Modellgenerationen. Sie veralten, weil Menschen die Wörter übernehmen und Schreibende sie gezielt streichen. `[Fakt · Kobak u. a., 2025; Meinung · WikiProject AI Cleanup, 2026: ordnet KI-Wörter nach Modellzeit]`

**Auf Deutsch.** Eine Liste mit Zahlen wie bei Kobak fehlt. Für deutsche Texte aus sechs Modellen fanden Irrgang u. a.: mehr wiederholte Grundformen (Lemmata), sehr ähnliche Sätze im selben Text, mehr Fremdwörter, mehr Diskursmarker und Adverbien. Menschentexte waren analytischer und weniger beschreibend. `[Fakt · Irrgang u. a., KONVENS 2024]`

Deutsche Entsprechungen der englischen Wörter sind **eine Übertragung, kein Messwert** `[Annahme]`: «ein·tauchen» (delve), «unter·streicht» (underscore), «zeigt eindrücklich» (showcase), «ent·scheidend» (crucial), «akribisch» (meticulous), «viel·schichtig» oder «facettenreich» (intricate), «lobenswert» (commendable), «Zeugnis für» (testament), «Geflecht» oder «Mosaik» (tapestry), «pulsierend» (vibrant), «Meilenstein» (pivotal), «Landschaft» im übertragenen Sinn (landscape), «dient als» (serves as).

### 3.2 Grammatik und Satzbau

- Anweisungsgetreue Modelle schreiben 2- bis 5-mal so viele Partizipialsätze wie Menschen, GPT-4o 5,3-mal. Nominalisierungen kommen 1,5- bis 2-mal so oft vor, Passiv ohne Handelnden nur halb so oft. Aus solchen Grammatikmerkmalen erkennt ein Klassifikator Mensch gegen ein bestimmtes Modell zu 93 bis 98 %. `[Fakt · Reinhart u. a., PNAS 2025, Englisch]`
- Im Deutschen gibt es den englischen Partizipialanschluss («..., highlighting ...») kaum. Er erscheint als angehängter Folgesatz: «, was ... macht», «, wodurch ...», «und sorgt so für ...». `[Annahme]`
- Auch Llama-Texte auf Deutsch hatten mehr einfache Sätze und mehr wiederholte Lemmata. `[Fakt · Irrgang u. a., 2024]`

### 3.3 Gleichförmigkeit

- Geübte Leser nannten vorhersehbare Satzmuster als Hinweis; menschliche Satzlängen schwanken mehr. `[Fakt · Russell u. a., 2025]`
- In deutschen Texten war die höchste Ähnlichkeit zwischen zwei Sätzen bei Menschen deutlich niedriger. Menschen wiederholen dafür Kernpunkte bewusst, ihre mittlere Satzähnlichkeit war höher. `[Fakt · Irrgang u. a., 2024]`
- Redundanz und Wiederholung waren die stärksten Hinweise der deutschen Fachleute (Chancenverhältnis 6,9 und 8,1). `[Fakt · Doru u. a., 2025]`
- Gleich lange Absätze: keine Studie mit Zahlen gefunden. Irrgang u. a. zitieren eine ältere Arbeit (Lyu u. a., 2022), die «auffällige Absätze» und «schlechte Kontrolle der Textlänge» nennt. `[Fakt · Irrgang u. a., 2024, Sekundärzitat]` Dass Absätze in Werbetexten von Modellen auffallend gleich lang sind, bleibt `[Annahme]`.

### 3.4 Gedankenstriche

- In zwölf Modellen von fünf Anbietern lag der Geviertstrich zwischen 0,0 (Llama) und 9,1 pro 1000 Wörter. Das Verbot im Auftrag entfernte ihn nicht bei allen Modellen. `[Fakt · Freeburg, 2026, Preprint]`
- Geübte Leser beschrieben eher das Gegenteil: KI-Text meide Striche und Auslassungspunkte, Menschen setzten Satzzeichen vielfältiger. `[Fakt · Russell u. a., 2025]`
- Wikipedia-Helfer führen den Geviertstrich als Merkmal der Jahre 2022 bis September 2026, also als eines, das mit neueren Modellen schwindet. `[Meinung · WikiProject AI Cleanup, 2026]`
- Folge: Der Strich ist kein verlässliches KI-Merkmal. Auf Deutsch ist der Geviertstrich aber ohnehin unüblich, und viele Leser halten Gedankenstriche inzwischen für KI-Zeichen. `[Annahme]`

### 3.5 Dreierlisten, Gegensatz-Schablonen, Absicherungen

- Dreierlisten aus Reflex, Gegensätze wie «nicht·nur X, auch Y», «dient als» statt «ist», Werbesprache im Ton eines Reiseführers, vage Quellen («Fachleute sagen»), formelhafte Schlussabschnitte. `[Meinung · WikiProject AI Cleanup, Stand Oktober 2026; Ratgeber aus der Praxis, ausdrücklich keine Regel]`
- Absicherungen («in der Regel», «kann variieren», «möglicherweise»): keine Studie mit Zahlen gefunden. Nahe dran: GPT-4o nutzt mehr abschwächende Wörter («barely», «nearly») als Menschen. `[Fakt · Reinhart u. a., 2025]` Dass Absicherungen Werbetexte schwächen, ist `[Annahme]`.
- Chatbot-Reste («Gerne erstelle ich …», «Ich hoffe, das hilft») und vergessene Platzhalter in eckigen Klammern. `[Meinung · WikiProject AI Cleanup, 2026]`

---

## 4. Grenzen der Detektoren

- OpenAI meldete für den eigenen Detektor 26 % gefundene KI-Texte bei 9 % Fehlalarm und schaltete ihn im Juli 2023 wegen geringer Genauigkeit ab. `[Fakt · OpenAI, 31.01.2023, nachgetragen 20.07.2023; Originalseite gesperrt, Zahlen aus mehreren Berichten]`
- 14 Werkzeuge an 54 Testfällen: keines erreichte 80 % Genauigkeit, nur fünf mindestens 70 %. Menschentext ordneten sie zu 96 % richtig ein. Maschinell übersetzter Menschentext fiel um 20 Prozentpunkte. Von Hand nachbearbeiteter KI-Text: 42 %. Mit einem Umschreibe-Werkzeug bearbeiteter KI-Text: 26 %. Die Werkzeuge neigen dazu, «menschlich» zu sagen. `[Fakt · Weber-Wulff u. a., 2023]`
- Sieben Detektoren meldeten 61 % von 91 Aufsätzen von Nicht-Muttersprachlern als KI, obwohl Menschen sie geschrieben hatten. Nach einer Wortschatz-Aufwertung durch ChatGPT sank der Fehlalarm auf 12 %. Einfacher Wortschatz wird also bestraft. `[Fakt · Liang u. a., Patterns, 2023]`
- Wiederholtes Umschreiben senkt die Erkennung bei allen Detektor-Arten stark. Je besser die Modelle, desto näher liegt der beste mögliche Detektor am Raten. `[Fakt · Sadasivan u. a., 2023/2025]`
- Ein deutscher Detektor (bester F1-Wert 0,95) fand Texte des Modells gut, mit dem er trainiert war, andere Modelle schlecht. `[Fakt · Irrgang u. a., 2024]`

**Folge:** Ein Werkzeug meldet Muster. Es urteilt nie «KI ja oder nein». Ein Detektor-Ergebnis belegt nichts über einen Text oder eine Person. `[Annahme, gestützt auf Weber-Wulff 2023 und Liang 2023]`

---

## 5. Woran Leser «nach Vorlage» erkennen: Werbe- und KMU-Floskeln

**Was belegt ist.** Eine Testseite ohne Werbesprache (keine Übertreibung, kein Eigenlob) war 27 % besser bedienbar als die werbliche Fassung. Knapp: 58 % besser. Gut überfliegbar: 47 %. Alles zusammen: 124 %. Methode: 51 erfahrene Webnutzer, fünf Fassungen derselben Seite, Zeit, Fehler, Erinnerung und Zufriedenheit gemessen. `[Fakt · Morkes, Nielsen, 1997]`

**Was nicht belegt ist.** Eine Zählung typischer Floskeln auf deutschsprachigen KMU-Websites wurde nicht gefunden. Die folgenden Gruppen sind `[Annahme]` aus der Arbeit mit Werbetexten. Sie decken sich mit den Einträgen des bestehenden Floskel-Werkzeugs, das ebenfalls auf Praxislisten beruht, nicht auf Studien.

| Gruppe | Typische Wendungen (Mittelpunkt = Werkzeug würde melden) | Warum schwach |
|---|---|---|
| Begrüssung statt Inhalt | «Herzlich will·kommen auf unserer Website», «Will·kommen bei» | verschenkt den ersten Satz |
| Eigenlob ohne Beleg | «kom·petent», «pro·fessionell», «zuver·lässig», «hoch·wertig», «höchste Quali·tät» | Leser kann es nicht prüfen |
| Leere Versprechen | «mass·geschneidert», «ganz·heitlich», «indi·viduell», «alles aus einer·Hand» | sagt nicht, was angepasst oder enthalten ist |
| Beziehungsfloskeln | «Ihr kom·petenter Partner», «auf Augen·höhe», «Ihre Zufrieden·heit ist unser Ziel» | steht bei jedem Mitbewerber |
| Gefühl statt Leistung | «mit Leiden·schaft», «wir sind·stolz» | Gefühl ist nicht prüfbar |
| Zeitgeist-Einstieg | «In der heutigen schnell·lebigen Zeit», «heut·zutage» | Aufsatzbeginn |
| Aufforderung ohne Grund | «Zö·gern Sie nicht», «Ver·trauen Sie uns», «Profi·tieren Sie von» | Übersetzung aus dem Englischen oder Druck ohne Grund |
| Modewörter | «nach·haltig», «inno·vativ», «Syn·ergie», «Mehr·wert», «Lö·sungen» | Beraterwort ohne Inhalt |
| Höfliche Schlussformel | «Wir freuen·uns auf Ihren Anruf» | kein nächster Schritt |
| Reiseführer-Ton (Gastro, Hotel) | «im Herzen von», «eingebettet in», «atemberaubend», «malerisch», «kulinarische Reise» | austauschbar, Ort ohne Inhalt |

**Beispiel: Malerei Fiktiv AG, erfundener Musterbetrieb**

- *Vorher (nach Vorlage):* «Will·kommen bei der Malerei Fiktiv AG. Seit vielen Jahren sind wir Ihr zuver·lässiger Partner für Malerarbeiten aller Art. Mit Leiden·schaft und höchster Quali·tät setzen wir Ihre Wünsche um, ganz·heitlich und indi·viduell.»
- *Nachher (nach den Grundsätzen):* «Wir streichen Wohnungen in Musterstadt, meist in zwei Tagen pro Wohnung. Vor dem Streichen decken wir Böden und Möbel ab. Sie bekommen eine schriftliche Offerte mit Fixpreis.»
- Die Zahlen im «Nachher» sind ebenfalls erfunden. Auf einer echten Seite stehen nur belegte Zahlen. `[Annahme]`

**Wann ein Text «nach KI» klingt, obwohl er keine Floskel enthält** `[Annahme]`:
- Jeder Absatz hat dieselbe Form: Behauptung, Dreierliste, Folgesatz mit «, was …».
- Alle Absätze sind fast gleich lang, alle Sätze 15 bis 20 Wörter.
- Jeder Abschnitt endet mit einem Satz, der den Abschnitt zusammenfasst.
- Kein einziger Name, Ort, Preis oder Zeitpunkt, der nur zu diesem Betrieb passt.

### Wenn in der Schweiz

- In der Schweiz kann man immer ss schreiben. `[Fakt · Rat für deutsche Rechtschreibung, Amtliches Regelwerk § 25 E2, 2018]` Ein Eszett auf einer Schweizer Seite verrät eine Vorlage aus Deutschland oder ein Modell mit deutschem Standard. `[Annahme]`
- Modelle schreiben ohne Anweisung oft bundesdeutsch: «Fahrrad» statt «Velo», „…“ statt «…», «Angebot» statt «Offerte». Das wirkt in der Deutschschweiz wie eine fremde Vorlage. `[Annahme]`
- Zurückhaltung im Ton passt hier besser als Superlative. `[Annahme, deckt sich mit der Begründung im bestehenden Floskel-Werkzeug]`

---

## 6. Abgleich mit dem bestehenden Floskel-Werkzeug

Geprüft: [`werkzeuge/slop-de.js`](../../werkzeuge/slop-de.js) und [`werkzeuge/slop-de.json`](../../werkzeuge/slop-de.json) (Liste Version 1, Stand 17.10.2026).

### 6.1 Was es abdeckt

| Art | Anzahl | Inhalt |
|---|---|---|
| Floskel, Stufe FEHLER | 21 | Leere Versprechen, Superlative ohne Massstab, Zeitgeist-Einstieg, Begrüssung, Platzhalter («lo·rem ipsum»), einige KI-Wörter («ein·tauchen», «naht·los») |
| Floskel, Stufe WARNUNG | 27 | Eigenlob, Modewörter, Schlussformeln, KI-Überleitungen («es ist wichtig zu …», «zusammen·fassend lässt sich sagen»), einige KI-Wörter («unter·streicht», «ent·scheidend», «viel·schichtig») |
| Muster | 9 | «nicht·nur … sondern», Gedankenstrich-Kette, Geviertstrich, Ausrufezeichen, Eszett, rhetorische Frage als Einstieg, Dreierkette aus 45 leeren Adjektiven, «mehr·als nur», «wir sind·stolz» |
| Knopf und Link | 6 | «mehr erfahren», «hier klicken», englische Reste, nur «Kontakt» ohne Telefon-Link |

Mechanik:
- Prüft in HTML nur sichtbaren Text, ohne `code`, `pre`, `script` und Kommentare.
- Andere Dateien (auch Markdown) prüft es roh, Zeile für Zeile. Dort gibt es **keine Ausnahme** für Code, Zitate oder Kommentare.
- Der Schalter `--erlauben=id` schaltet nur ganze Einträge ab, nicht einzelne Stellen.
- `belegbar`: Steht eine Zahl im selben Satz, wird ein FEHLER zur WARNUNG.

### 6.2 Was mit der Forschung übereinstimmt

- KI-Wörter: «ein·tauchen», «unter·streicht», «ent·scheidend», «viel·schichtig» entsprechen den englischen Spitzenreitern «delve», «underscore», «crucial», «intricate». `[Fakt · Kobak 2025; Reinhart 2025; Übertragung ins Deutsche Annahme]`
- Werbesprache ohne Beleg ist schwächer. `[Fakt · Morkes, Nielsen, 1997]`
- Geviertstrich und Gegensatz-Schablone. `[Fakt · Freeburg 2026; Meinung · WikiProject AI Cleanup, 2026]`
- Eszett als Vorlagen-Zeichen in der Schweiz. `[Fakt · Regelwerk § 25 E2]`

### 6.3 Was fehlt

1. **Weitere KI-Wörter auf Deutsch** (Zeugnis für, akribisch, Geflecht, pulsierend, Meilenstein, dient als, spielt eine … Rolle). Nur ein Teil der englischen Spitzenwörter hat einen Eintrag.
2. **Gleichförmigkeit:** Das Werkzeug zählt keine Satzlängen und keine Absatzlängen. Nach Russell 2025 und Irrgang 2024 ist das ein starkes Merkmal.
3. **Wiederholung:** keine Prüfung auf wiederholte Lemmata oder fast gleiche Sätze im selben Text (Irrgang 2024, Doru 2025).
4. **Diskursmarker-Häufung** am Satzanfang (Irrgang 2024).
5. **Angehängte Folgesätze** als deutsches Gegenstück zum Partizipialsatz (Reinhart 2025).
6. **Chatbot-Reste und Platzhalter in eckigen Klammern** (WikiProject AI Cleanup 2026). Nur «lo·rem ipsum» und Ähnliches sind erfasst.
7. **Reiseführer-Ton** für Gastro und Hotel.
8. **Einzelner Gedankenstrich** mit Leerzeichen: Das Werkzeug meldet erst zwei in einem Satz. Der Halbgeviertstrich allein bleibt stumm.
9. **Gegensatz-Schablonen** ausser «nicht·nur … sondern» und «mehr·als nur»: etwa «Es geht nicht um X, sondern um Y».
10. **Absicherungen** in Werbetext.
11. **Ausnahmen für Beispiele:** In Markdown fehlt ein Weg, zitierte Floskeln auszunehmen. Dieses Skript musste darum mit Mittelpunkten arbeiten.

### 6.4 Vorschläge für neue Einträge `[Vorschlag]`

Regex wie im Werkzeug (Flags i und u). Wo ein Muster selbst eine gemeldete Floskel enthält, ist ein Buchstabe in eckige Klammern gesetzt, z. B. `entscheid[e]nd`. Das ist gleichwertige Regex-Schreibweise und verhindert, dass dieses Skript anschlägt. Stufen und Grenzwerte sind `[Annahme]`.

| ID (Vorschlag) | Muster | Stufe | Grund | Quelle |
|---|---|---|---|---|
| `ki-zeugnis` | `(ist\|steht als\|bleibt) (ein )?(eindrückliches )?Zeugnis (für\|von)` | WARNUNG | Gegenstück zu «testament», von geübten Lesern als KI-Wort genannt | Russell u. a. 2025; Übertragung Annahme |
| `ki-akribisch` | `akribisch\p{L}*` | WARNUNG | Gegenstück zu «meticulous», 34,7-mal häufiger in Gutachten | Liang u. a. 2024 («Monitoring») |
| `ki-geflecht` | `(vielfältige\p{L}*\|reiche\p{L}*\|buntes?) (Geflecht\|Mosaik\|Tapisserie)` | WARNUNG | Gegenstück zu «tapestry», 155-mal häufiger bei GPT-4o | Reinhart u. a. 2025 |
| `ki-pulsierend` | `pulsierend\p{L}*` | WARNUNG | Gegenstück zu «vibrant» | Russell u. a. 2025 |
| `ki-rolle` | `spiel\p{L}* eine (entscheid[e]nde\|zentrale\|wichtige\|wesentliche\|tragende) Rolle` | WARNUNG | Bedeutung behaupten statt zeigen | Meinung WikiProject AI Cleanup 2026 |
| `ki-dient-als` | `dien\p{L}* als` | WARNUNG (nur Hinweis) | «serves as» statt «ist»; viele Fehlalarme möglich | Meinung WikiProject AI Cleanup 2026 |
| `ki-meilenstein` | `Meilenstein\p{L}*\|Wendepunkt\p{L}*` | WARNUNG | Gegenstück zu «pivotal»; aufgeblasene Bedeutung | Meinung WikiProject AI Cleanup 2026 |
| `folgesatz-was` | `, (was\|wodurch\|womit) [^.?\x21]{0,80}(macht\|ermöglicht\|sorgt\|garantiert\|schafft)` | WARNUNG ab 2 je Seite | deutsches Gegenstück zum Partizipialanschluss, 5,3-mal häufiger bei GPT-4o | Reinhart u. a. 2025; Übertragung Annahme |
| `sorgt-so-fuer` | `und sorg\p{L}* (so\|damit\|dafür) für` | WARNUNG | angehängter Nutzen-Nachsatz | wie oben |
| `diskursmarker-anfang` | Satzanfang mit `(Zudem\|Darüber hinaus\|Des Weiteren\|Insgesamt\|Letztlich\|Abschliessend\|Kurzum)`; neue Prüfung: mehr als 1 je 5 Sätze | WARNUNG | Diskursmarker trennen KI- von Menschentext auf Deutsch | Irrgang u. a. 2024 |
| `gegensatz-schablone` | `(?:^|[^\p{L}])es geht (nicht\|nie) (nur \|bloss )?um[^.?\x21]{1,80}sondern` | WARNUNG | Gegensatz-Schablone wie «nicht·nur … sondern» | Meinung WikiProject AI Cleanup 2026 |
| `chatbot-rest` | `gerne (erstelle\|helfe\|schreibe) ich\|ich hoffe, (das\|dies) hilft\|als (KI\|Sprachmodell)\|hier ist (ein\|eine\|der\|die) (Entwurf\|Text\|Vorschlag)` | FEHLER | Rest aus dem Chat, gehört nie auf eine Seite | Meinung WikiProject AI Cleanup 2026 |
| `platzhalter-klammer` | `\[(Name\|Ort\|Firma\|Betrieb\|Telefon\|Adresse\|Datum\|Preis\|Jahr)[^\]]{0,30}\]` | FEHLER | vergessener Platzhalter | Meinung WikiProject AI Cleanup 2026 |
| `reisefuehrer-ton` | `im Herzen (von\|der\|des)\|eingebettet in\|atemberaubend\p{L}*\|malerisch\p{L}*\|kulinarische\p{L}* Reise` | WARNUNG | Werbesprache; objektive Fassung 27 % besser | Morkes, Nielsen 1997; Meinung WikiProject AI Cleanup 2026 |
| `halbgeviert-einzeln` | `\p{L}\s–\s\p{L}` | WARNUNG | einzelner Gedankenstrich als Satzzeichen; Evidenz gemischt, Leser lesen ihn als KI-Zeichen | Freeburg 2026; Russell u. a. 2025 widerspricht teilweise |
| `absicherung` | `in der Regel\|kann (je nach [^.?\x21]{1,30} )?variieren\|möglicherweise\|unter Umständen\|gegebenenfalls` | WARNUNG ab 1 je 100 Wörter | Absicherung statt Beleg; GPT-4o nutzt mehr Abschwächer | Reinhart u. a. 2025 (Abschwächer); Rest Annahme |
| `satzlaenge-gleich` | neue Prüfung: Variationskoeffizient der Satzlänge je Abschnitt mit mindestens 8 Sätzen | WARNUNG unter 0,35 | vorhersehbare, gleich lange Sätze | Russell u. a. 2025; Grenzwert Annahme |
| `absatzlaenge-gleich` | neue Prüfung: alle Absätze eines Abschnitts (mindestens 4) innerhalb ±20 % der mittleren Länge | WARNUNG | gleich lange Absätze | Annahme; Sekundärzitat Lyu 2022 in Irrgang 2024 |
| `wiederholung-satz` | neue Prüfung: zwei Sätze im selben Text mit mehr als 70 % gleichen Lemmata | WARNUNG | hohe maximale Satzähnlichkeit, Redundanz | Irrgang u. a. 2024; Doru u. a. 2025; Grenzwert Annahme |
| `ausnahme-beispiel` | Werkzeug: Zeilen in Markdown-Codeblöcken und Inline-Code überspringen, oder ein HTML-Kommentar mit dem Text `slop-de: beispiel` vor einer Zeile | (Mechanik) | Lehrtexte müssen Floskeln zeigen können | Annahme |

---

## 7. Prüfbare Grundsätze

Jede Regel kann ein Werkzeug oder ein Bewerter ohne Vorwissen entscheiden. Grenzwerte ohne Studie sind `[Annahme]`.

- **K1** Das bestehende Floskel-Werkzeug meldet 0 FEHLER. Jede WARNUNG ist entweder belegt (Zahl, Name, Norm im selben Satz) oder gestrichen. `[Annahme; Liste beruht auf Praxis, nicht auf Studien]`
- **K2** Jede Eigenschaft, die der Betrieb sich zuschreibt, hat im selben oder nächsten Satz einen prüfbaren Beleg: Zahl, Name, Ort, Norm, Zeitpunkt oder Preis. Prüffrage je Adjektiv: «Woran sieht der Leser, dass das stimmt?» Ohne Antwort: streichen. `[Fakt · Morkes, Nielsen, 1997: objektive Fassung 27 % besser; Regel Annahme]`
- **K3** Ersetzungstest: Pro Abschnitt höchstens ein Satz, der wahr bleibt, wenn man Name und Ort durch einen Mitbewerber der Branche ersetzt. Prüffrage für den Bewerter: Markiere jeden austauschbaren Satz. `[Annahme]`
- **K4** KI-Wörter (Liste in 3.1 und Vorschläge in 6.4): höchstens eines je 300 Wörter, nie im ersten Satz einer Seite. `[Fakt · Kobak u. a., 2025; Liang u. a., 2024; Reinhart u. a., 2025 für Englisch; deutsche Liste und Grenzwert Annahme]` `[unsicher, siehe Hinweis unter K10]`
- **K5** Satzlängen schwanken: In jedem Abschnitt mit mindestens 8 Sätzen liegt der Variationskoeffizient der Satzlänge (Standardabweichung durch Mittelwert, in Wörtern) bei mindestens 0,35. `[Fakt · Russell u. a., 2025: Satzmuster als Hinweis; Grenzwert Annahme]` `[unsicher, siehe Hinweis unter K10]`
- **K6** Absätze sind nicht gleich lang: In Abschnitten mit mindestens 4 Absätzen liegt mindestens einer ausserhalb von ±20 % der mittleren Absatzlänge. `[Annahme]` `[unsicher, siehe Hinweis unter K10]`
- **K7** Keine Wiederholung: Kein Satzpaar im selben Text teilt mehr als 70 % seiner Inhaltswörter (Lemmata). Jeder Kernpunkt steht auf einer Seite höchstens zweimal, einmal davon im Abschluss oder Knopf. `[Fakt · Irrgang u. a., 2024; Doru u. a., 2025; Grenzwerte Annahme]` `[unsicher, siehe Hinweis unter K10]`
- **K8** Dreierlisten: höchstens eine Aufzählung mit genau drei Gliedern je Abschnitt. Keine Dreierkette aus Eigenschaftswörtern. `[Meinung · WikiProject AI Cleanup, 2026; Grenzwert Annahme]` `[unsicher, siehe Hinweis unter K10]`
- **K9** Gegensatz-Schablonen («nicht·nur … sondern», «es geht nicht um … sondern», «mehr·als nur»): 0 im Werbetext. `[Meinung · WikiProject AI Cleanup, 2026; Regel Annahme]` `[unsicher, siehe Hinweis unter K10]`
- **K10** Angehängte Folgesätze («, was … ermöglicht», «, wodurch …», «und sorgt so für …»): höchstens einer je 10 Sätze. Diskursmarker am Satzanfang («Zudem», «Darüber hinaus», «Insgesamt»): höchstens einer je 5 Sätze. `[Fakt · Reinhart u. a., 2025 für Englisch; Irrgang u. a., 2024 für Deutsch; Grenzwerte Annahme]` `[unsicher, siehe Hinweis unter K10]`

  **Hinweis zu K4 bis K10** `[unsicher]`: Geübte erkennen diese Muster, Laien kaum, und blind gefiel Laien glatter KI-Werbetext sogar besser; die Regeln schützen vor Austauschbarkeit, ein Verlust von Kundschaft durch diese Muster ist nicht belegt. `[Fakt · Zhang, Gosline, 2023; Russell u. a., 2025; beide laut ../abgleich-menschen.md, Zeile K4]`

- **K11** Keine Gedankenstriche als Satzzeichen im Fliesstext: 0 Geviertstriche, 0 Halbgeviertstriche mit Leerzeichen zwischen Wörtern. Bis-Striche in Zahlen (8–12 Uhr) sind erlaubt. `[Fakt · Freeburg, 2026; Evidenz gemischt laut Russell u. a., 2025; Regel Annahme]`
- **K12** Absicherungen («in der Regel», «möglicherweise», «kann variieren»): höchstens eine je 100 Wörter. Wo eine Zahl unsicher ist, steht eine Spanne mit Quelle, keine Absicherung. `[Fakt · Reinhart u. a., 2025: mehr Abschwächer bei GPT-4o; Regel Annahme]`
- **K13** Kein Chatbot-Rest und kein Platzhalter in eckigen Klammern: 0. `[Meinung · WikiProject AI Cleanup, 2026]`
- **K14** Kein Abschnitt endet mit einem Satz, der nur den Abschnitt zusammenfasst. Prüffrage: «Sagt der letzte Satz etwas Neues oder einen nächsten Schritt?» `[Meinung · WikiProject AI Cleanup, 2026: formelhafte Schlüsse; Regel Annahme]`
- **K15** Detektoren entscheiden nichts. Kein Text gilt als gut oder schlecht, weil ein KI-Detektor ihn als menschlich oder als KI einstuft. Gemessen werden nur die Muster K1 bis K14. `[Fakt · Weber-Wulff u. a., 2023; Liang u. a., 2023; OpenAI, 2023]`
- **K16** Geprüft wird blind, ob ein Text «nach Vorlage klingt». Urteilen Sprachmodelle, ist das ein **Modell-Urteil, Vorfilter**: Was durchfällt, wird überarbeitet; bestehen heisst «Modell-Urteil bestanden». Als Beleg gilt erst die Mehrheit von mindestens fünf Menschen, die oft mit Sprachmodellen schreiben. Laien-Urteile allein gelten nicht als Beleg. Aufbau und Bewerter: [blindtest.md](../../../design-uni/referenzen/blindtest.md). `[Fakt · Russell u. a., 2025: Mehrheit von 5 Geübten 1 Fehler in 300; Clark 2021 und Jakesch 2023: Laien nahe Zufall; Übertragung auf deutsche Werbetexte Annahme]`
  Geändert am 02.11.2026: Modell-Urteile über «klingt nach Vorlage» heissen Vorfilter; die Regeln für Aufbau und Bewerter stehen in design-uni (Entscheid 1). `[Entscheid · Studio, 02.11.2026]`
- **K17** Wenn in der Schweiz: 0 Eszett, immer ss, Anführungszeichen «…», Schweizer Wörter wo üblich (Velo, Offerte). `[Fakt · Regelwerk § 25 E2 für ss; Rest Annahme, Einzelheiten im Skript zu Schweizer Hochdeutsch]`

---

## 8. Quellen

Alle abgerufen am 01.11.2026.

1. Clark, E.; August, T.; Serrano, S.; Haduong, N.; Gururangan, S.; Smith, N. A. (2021): All That's 'Human' Is Not Gold: Evaluating Human Evaluation of Generated Text. https://arxiv.org/abs/2107.00061
2. Jakesch, M.; Hancock, J. T.; Naaman, M. (2023): Human heuristics for AI-generated language are flawed. PNAS 120(11). https://pmc.ncbi.nlm.nih.gov/articles/PMC10089155 und https://arxiv.org/abs/2206.07271
3. Russell, J.; Karpinska, M.; Iyyer, M. (2025): People who frequently use ChatGPT for writing tasks are accurate and robust detectors of AI-generated text. ACL 2025. https://arxiv.org/abs/2501.15654
4. Fiedler, A.; Döpke, J. (2025): Do humans identify AI-generated text better than machines? Evidence based on excerpts from German theses. International Review of Economics Education 49. https://ideas.repec.org/a/eee/ireced/v49y2025ics1477388025000131.html
5. Doru, B.; Maier, C.; Busse, J. (2025): Detecting Artificial Intelligence–Generated Versus Human-Written Medical Student Essays: Semirandomized Controlled Study. JMIR Medical Education 11, e62779. https://mededu.jmir.org/2025/1/e62779
6. Milička, J.; Marklová, A.; Drobil, O.; Pospíšilová, E. (2025): Humans can learn to detect AI-generated texts, or at least learn when they can't. https://arxiv.org/abs/2505.01877
7. Frank, J. u. a. (2024): A Representative Study on Human Detection of Artificially Generated Media Across Countries. IEEE S&P 2024. https://arxiv.org/abs/2312.05976
8. Kobak, D.; González-Márquez, R.; Horvát, E.-Á.; Lause, J. (2025): Delving into LLM-assisted writing in biomedical publications through excess vocabulary. Science Advances 11(27). https://arxiv.org/abs/2406.07016
9. Liang, W. u. a. (2024): Mapping the Increasing Use of LLMs in Scientific Papers. https://arxiv.org/abs/2404.01268
10. Liang, W. u. a. (2024): Monitoring AI-Modified Content at Scale: A Case Study on the Impact of ChatGPT on AI Conference Peer Reviews. https://arxiv.org/abs/2403.07183
11. Reinhart, A. u. a. (2025): Do LLMs write like humans? Variation in grammatical and rhetorical styles. PNAS 122(8). https://arxiv.org/abs/2410.16107
12. Juzek, T. S.; Ward, Z. B. (2025): Why Does ChatGPT "Delve" So Much? Exploring the Sources of Lexical Overrepresentation in Large Language Models. COLING 2025. https://arxiv.org/abs/2412.11385
13. Irrgang, V.; Solopova, V.; Zeiler, S.; Nickel, R. M.; Kolossa, D. (2024): Features and Detectability of German Texts Generated with Large Language Models. KONVENS 2024, S. 264–280. https://aclanthology.org/2024.konvens-main.27
14. Weber-Wulff, D. u. a. (2023): Testing of detection tools for AI-generated text. International Journal for Educational Integrity 19, 26. https://arxiv.org/abs/2306.15666
15. Liang, W.; Yuksekgonul, M.; Mao, Y.; Wu, E.; Zou, J. (2023): GPT detectors are biased against non-native English writers. Patterns. https://arxiv.org/abs/2304.02819
16. Sadasivan, V. S. u. a. (2023, TMLR 2025): Can AI-Generated Text be Reliably Detected? https://arxiv.org/abs/2303.11156
17. OpenAI (31.01.2023, Nachtrag Juli 2023): New AI classifier for indicating AI-written text. https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/ (Seite beim Abruf gesperrt; Zahlen geprüft über https://www.thefpsreview.com/2023/07/25/openai-shelves-ai-classifier-for-low-rate-of-accuracy und https://niemanlab.org/reading/chatgpt-actually-cant-tell-if-something-was-written-by-chatgpt-it-turns-out)
18. Freeburg, E. M. (2026): The Last Fingerprint: How Markdown Training Shapes LLM Prose. https://arxiv.org/abs/2603.27006
19. WikiProject AI Cleanup (Stand Oktober 2026): Wikipedia:Signs of AI writing. https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
20. Morkes, J.; Nielsen, J. (1997): Concise, SCANNABLE, and Objective: How to Write for the Web. Nielsen Norman Group. https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/
21. Rat für deutsche Rechtschreibung (2018): Deutsche Rechtschreibung. Regeln und Wörterverzeichnis, § 25 E2. https://www.rechtschreibrat.com/DOX/rfdr_Regeln_2016_redigiert_2018.pdf
