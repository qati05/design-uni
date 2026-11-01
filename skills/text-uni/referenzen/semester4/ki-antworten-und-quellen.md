# KI-Antworten und Quellen · Skript Semester 4

Stand 01.11.2026 · Text-Uni, Semester 4 «KI-Suche und Technik».

> **Worum es geht:** wie ChatGPT-Suche, Perplexity, Google KI-Übersicht und KI-Modus, Gemini, Microsoft Copilot und Claude mit Websuche ihre Quellen holen und zitieren. Welcher Index dahinter steht. Was die Anbieter selbst dokumentieren und was nur behauptet wird. Wie eine Website Quelle wird und was ein Betrieb steuern kann. Dazu Erwähnungen ausserhalb der eigenen Website und Studien zu KI-Zitaten mit Methode.
>
> **Gelesen am 01.11.2026, online** (Nummern wie in «Quellen» am Ende): KQ-Q1 OpenAI-Crawler · KQ-Q2 OpenAI-Hilfe zur Websuche · KQ-Q4 Perplexity-Crawler · KQ-Q5 Perplexity Search API · KQ-Q6 Google «AI features and your website» (10.12.2025) · KQ-Q7 Google-Crawler mit Google-Extended (30.10.2026) · KQ-Q8 und KQ-Q9 Google-Blog zu KI-Übersicht und KI-Modus · KQ-Q10 Google-Hilfe «Übersichten mit KI» · KQ-Q11 bis KQ-Q13 Gemini · KQ-Q14 Google Knowledge Panel · KQ-Q15 bis KQ-Q20 Microsoft und Bing · KQ-Q21 bis KQ-Q28 Anthropic, Claude und Brave · KQ-Q29 bis KQ-Q41 Studien und Messungen · KQ-Q42 bis KQ-Q48 Schweiz und Datenschutz · KQ-Q49 bis KQ-Q51 Wikipedia und Wikidata.
>
> **Nicht gelesen:** die «Publishers and developers FAQ» von OpenAI (KQ-Q3). Die Adresse leitete beim Abruf am 01.11.2026 auf eine andere Hilfeseite um. Was dazu steht, kommt nur aus Auszügen in Suchtreffern und ist als «nicht bestätigt» markiert. Die Agenturmeldung der Netzwoche zum KI-Modus in der Schweiz (08.10.2025) lieferte einen Serverfehler; gelesen habe ich dieselbe Meldung bei blue News (KQ-Q43). Von der Studie Chen u. a. (KQ-Q30) habe ich nur die ersten zwei Drittel des Volltexts gelesen.
>
> **Nicht gefunden:** eine offizielle Länderliste für Perplexity und für die ChatGPT-Suche (die Seite von OpenAI zu unterstützten Ländern gab «403» zurück). Eine Anbieter-Dokumentation, ob OpenAI, Perplexity oder Anthropic `nosnippet` oder `max-snippet` beachten. Eine Studie zu KI-Zitaten mit Daten aus der Schweiz oder zu kleinen Dienstleistern. Eine Studie zu schweizerdeutsch geschriebenen Suchanfragen. Was dazu steht, ist `[Annahme]`.
>
> Herkunft: `[Fakt · Quelle, Datum]`, `[Annahme]`, `[Meinung · Autor]`, `[Verweis]`. **`[Regel laut <Anbieter> · Quelle]`** heisst: So steht es in der Dokumentation des Anbieters. Das belegt die Absicht des Anbieters, nicht die Wirkung.
>
> **In eigener Sache:** Dieses Skript hat ein Modell von Anthropic (Claude) geschrieben. Für Aussagen über Claude gilt dieselbe Regel wie für alle anderen Dienste: Anbieter-Text ist Absicht, kein Beleg.

**Boden aus Semester 1 bis 3.** Was dort steht, gilt hier und wird nur mit der ID zitiert: nichts erfinden (B8, R1), Bewertungen mit Anzahl, Plattform und Datum (B4, R8), Recht vor Wirkung (B19), erreichbar und indexierbar (G1), kein Versprechen zum Rang (G2, P18), nichts versteckt (G9), menschlich geprüft, auch Metadaten (G21), Google-Aussage gekennzeichnet (G25), erster Absatz als Snippet (S13), strukturierte Daten nur für Sichtbares (S23 bis S25), Klickwirkung nur mit Menschen-Daten (S29), eine Referenz für Firmendaten (P19), Verzeichnisse geprüft, nicht gekauft (P20).

**Abgrenzung.** Crawler, `robots.txt`, Sitemap, IndexNow und Statuscodes im Detail stehen im Schwester-Skript «technik-crawlen-indexieren.md» (TI). Wie man Sätze schreibt, die eine KI richtig wiedergibt, steht in «zitierfaehig-schreiben.md» (ZS). Dieses Skript erklärt, **woher** die Dienste ihre Quellen nehmen und **was** der Betrieb daran steuern kann.

**Schreibweise der Beispiele.** Floskeln stehen mit Mittelpunkt im Wort, etwa «ganz·heitlich». Alle Betriebe sind erfunden: Garage Muster in Musterdorf, Malerei Muster, Physio Muster. Adressen enden auf `.example`.

---

## 1. Grundbegriffe

- **KI-Antwort:** ein Text, den ein Sprachmodell auf eine Frage schreibt, oft mit Links zu Quellen. `[Annahme, Arbeitsbegriff]`
- **Quelle oder Zitat:** ein Link in oder unter der KI-Antwort auf die Seite, aus der eine Angabe stammt. Die Anbieter nennen das «citation», «supporting link» oder «Sources». `[Regel laut OpenAI · KQ-Q2; Regel laut Google · KQ-Q6; KQ-Q11]`
- **Grounding (Verankerung):** Der Dienst gibt dem Modell zur Laufzeit Inhalte aus einem Suchindex, damit die Antwort stimmt und aktuell ist. `[Regel laut Google · KQ-Q7; Regel laut Microsoft · KQ-Q15]`
- **Index:** die gespeicherte Sammlung von Webseiten, aus der ein Suchdienst Treffer liefert. Wer nicht im Index steht, kann nicht Quelle werden. `[Annahme, aus KQ-Q6: Voraussetzung ist «indexiert»]`
- **Such-Crawler:** ein Programm, das Seiten für einen Suchindex abruft, etwa Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, Claude-SearchBot. **Trainings-Crawler** sammeln Inhalte für das Training von Modellen, etwa GPTBot oder ClaudeBot. **Abruf durch Nutzer** heisst: Eine Person stellt eine Frage, der Dienst holt dafür eine Seite, etwa ChatGPT-User, Perplexity-User, Claude-User. `[Regel laut OpenAI · KQ-Q1; Regel laut Perplexity · KQ-Q4; Regel laut Anthropic · KQ-Q21]` Die Technik dazu steht in «technik-crawlen-indexieren.md».
- **Query fan-out:** Der Dienst zerlegt eine Frage in mehrere verwandte Suchen zu Teilthemen und Datenquellen. `[Regel laut Google · KQ-Q6]`
- **GEO (Generative Engine Optimization):** Name für Massnahmen, die die Sichtbarkeit in KI-Antworten erhöhen sollen. Geprägt von der Studie von Aggarwal u. a. (KQ-Q29). Microsoft nutzt den Begriff inzwischen selbst. `[Fakt · KQ-Q29; KQ-Q16]`

---

## 2. Wie eine KI-Antwort zu ihren Quellen kommt

### 2.1 Der gemeinsame Ablauf

Soweit die Anbieter ihn beschreiben, ist der Weg im Kern gleich. Perplexity beschreibt ihn nicht. `[Annahme, Zusammenfassung aus den Zeilen unten]`

1. **Frage umschreiben.** Der Dienst macht aus der Frage eine oder mehrere kurze Suchanfragen. OpenAI schreibt die Frage in «gezielte» Suchanfragen um und schickt sie an Suchpartner. `[Regel laut OpenAI · KQ-Q2]` Copilot erzeugt eine Suchanfrage aus «wenigen Wörtern» und schickt sie an Bing. `[Regel laut Microsoft · KQ-Q15, 29.10.2026]` Google nennt das «query fan-out». `[Regel laut Google · KQ-Q6]` Bei Claude entscheidet das Modell, wann und wie oft es sucht. `[Regel laut Anthropic · KQ-Q23]`
2. **Kandidaten aus einem Index holen.** Ein Suchdienst liefert Treffer. Welcher Index das ist, steht in 2.2.
3. **Lesen und schreiben.** Das Modell liest Auszüge der Treffer und schreibt die Antwort.
4. **Zitieren.** Einige der gelesenen Seiten erscheinen als Quelle. Nicht jede Antwort hat Quellen. `[Regel laut Google · KQ-Q11]`

**Was daraus folgt:** Der Text der Seite wirkt erst in Schritt 3. Ob die Seite überhaupt gelesen wird, entscheidet Schritt 2, also der Suchindex. Ohne Aufnahme in Google, Bing oder den eigenen Index des Dienstes gibt es kein Zitat. `[Annahme, aus 2.2]` Der KI-Zitat-Test der Semesterprüfung überspringt Schritt 2: Er gibt den Modellen die Quellen vor. Sein Ergebnis ist ein Modell-Urteil mit der Grenze «Quellenauswahl übersprungen». `[Fakt · Prüfauftrag Semester 4]`

### 2.2 Welcher Index hinter welchem Dienst steht

| Dienst | Index oder Suchdienst | Such-Crawler (Name in `robots.txt`) | Stand der Doku |
|---|---|---|---|
| **ChatGPT-Suche** | Suchpartner, in der Datenschutz-Angabe genannt: Microsoft und Shopify. Eigener Crawler OAI-SearchBot. Wie viel aus welchem Index kommt, steht nirgends. | OAI-SearchBot | Hilfe, Stand um 20.10.2026; Crawler-Seite ohne Datum |
| **Perplexity** | eigener Index, laut Perplexity «hundreds of billions of webpages» | PerplexityBot | Blog 25.09.2025; Crawler-Seite ohne Datum |
| **Google KI-Übersicht und KI-Modus** | Google-Suchindex; nur Seiten, die indexiert sind und ein Snippet zeigen dürfen | Googlebot | 10.12.2025 |
| **Gemini (App)** | Inhalte aus dem Google-Suchindex für das Grounding | Googlebot; Steuerung über das Token Google-Extended | 30.10.2026 |
| **Microsoft Copilot** | Bing-Suchdienst | Bingbot | 29.10.2026 |
| **Claude mit Websuche** | Anbieter in der Doku nicht genannt. Im Trust Center als Unterauftragnehmer für Websuche: Brave Search, TurboPuffer, Parallel Web Systems | Claude-SearchBot, Claude-User; Brave folgt den Regeln für Googlebot | Hilfe Stand «vor über 3 Wochen»; Trust Center Abruf 01.11.2026 |

Alle Zeilen: `[Regel laut Anbieter · KQ-Q1, KQ-Q2, KQ-Q5, KQ-Q6, KQ-Q7, KQ-Q15, KQ-Q22, KQ-Q24, KQ-Q27]`. Die Zeile zu Claude stützt zusätzlich ein Test von Simon Willison: Die zehn Quellen einer Claude-Suche stimmten mit derselben Suche bei Brave überein. `[Fakt · KQ-Q26, 21.03.2025]`

**Was daraus folgt:** Zwei grosse Indexe tragen den grössten Teil. Wer in Google und Bing sauber indexiert ist, erreicht Google, Gemini und Copilot direkt und ChatGPT über den Suchpartner Microsoft. `[Annahme, aus der Tabelle]` Perplexity, OpenAI und Brave haben eigene Crawler. Sie brauchen in `robots.txt` und in der Firewall eigene Freigaben (KQ2).

---

## 3. Die Dienste einzeln

### 3.1 ChatGPT-Suche (OpenAI)

**Index und Crawler**

- ChatGPT sucht automatisch, wenn eine Frage aktuelle Informationen braucht, oder auf Wunsch. Verfügbar in allen Tarifen und ohne Anmeldung. `[Regel laut OpenAI · KQ-Q2, Stand um 20.10.2026]`
- ChatGPT arbeitet «manchmal» mit anderen Suchanbietern. Dazu schreibt es die Frage in eine oder mehrere gezielte Suchanfragen um. Als Anbieter verlinkt OpenAI die Datenschutzerklärungen von Microsoft und Shopify. `[Regel laut OpenAI · KQ-Q2]`
- Ein verlinkter Hilfeartikel beschreibt eine «Offline-Websuche» für Arbeitsbereiche mit «OpenAI's indexed and cached web content». OpenAI hat also einen eigenen Bestand. `[Fakt · KQ-Q2, Linktext; Artikel selbst nicht gelesen]`
- **Vier Bots:** OAI-SearchBot für die Suche, GPTBot für das Training, ChatGPT-User für Abrufe auf Wunsch von Nutzern, OAI-AdsBot nur für Werbe-Zielseiten. Die Einstellungen gelten je Bot einzeln. `[Regel laut OpenAI · KQ-Q1]`

**Dokumentiert gegen behauptet**

- Dokumentiert: Wie man sperrt und wie lange das dauert (rund 24 Stunden). `[Regel laut OpenAI · KQ-Q1]`
- Nur Absicht: ChatGPT ordne Treffer nach «multiple factors intended to help users find relevant, reliable information». Welche Faktoren, steht nirgends. `[Regel laut OpenAI · KQ-Q2]`
- OpenAI warnt selbst: Suchergebnisse und Zitate können «incomplete, outdated, or incorrect» sein. `[Regel laut OpenAI · KQ-Q2]`
- Unabhängig gemessen: Im Test des Tow Center zitierte ChatGPT eine Kopie eines Artikels bei Yahoo News statt des Originals, obwohl der Verlag den Crawler gesperrt hatte. `[Fakt · KQ-Q31, 06.03.2025]`

**Wie eine Website Quelle wird**

- OAI-SearchBot zulassen. Das Hosting oder Content Delivery Network (CDN) lässt die veröffentlichten IP-Adressen von OpenAI durch (`openai.com/searchbot.json`). Ein Platz ist nicht garantiert. `[Regel laut OpenAI · KQ-Q2]`
- Für Fragen in der Nähe nutzt ChatGPT den ungefähren Standort aus der IP-Adresse und teilt ihn mit Drittanbietern, etwa für Firmeneinträge in der Nähe. Reservationen laufen über OpenTable (weltweit), Resy (USA) und Yelp (USA, Kanada). `[Regel laut OpenAI · KQ-Q2]`

**Was der Betrieb steuern kann**

- `Disallow` für OAI-SearchBot: Die Seiten erscheinen nicht mehr in Antworten der ChatGPT-Suche, aber weiter als «navigational links». `[Regel laut OpenAI · KQ-Q1]`
- `Disallow` für GPTBot: Signal gegen die Nutzung im Training. Hat laut OpenAI keinen Einfluss auf die Suche, weil die Bots getrennt sind. `[Regel laut OpenAI · KQ-Q1]`
- ChatGPT-User: Bei Abrufen auf Wunsch von Nutzern «robots.txt rules may not apply». `[Regel laut OpenAI · KQ-Q1]`
- `nosnippet`, `max-snippet`: Eine Aussage von OpenAI dazu habe ich nicht gefunden. `[Fakt · eigene Suche, 01.11.2026]`
- `noindex` als Weg aus der ChatGPT-Suche und der Zusatz `utm_source=chatgpt.com` an Links: So steht es laut Suchtreffern in der Publisher-FAQ. Die Seite war beim Abruf nicht erreichbar. **Nicht bestätigt.** `[Annahme · KQ-Q3, nur Auszüge]`

### 3.2 Perplexity

**Index und Crawler**

- Perplexity beschreibt einen eigenen Index mit «hundreds of billions of webpages». Pro Sekunde verarbeite das System zehntausende Aktualisierungen. Dokumente werden in «fine-grained units» zerlegt. Die Such-Schnittstelle nutze dieselbe Infrastruktur wie die Antwortmaschine. `[Regel laut Perplexity · KQ-Q5, 25.09.2025]` Eine unabhängige Prüfung der Grösse habe ich nicht gefunden.
- **Zwei Bots:** PerplexityBot zeigt und verlinkt Seiten in den Ergebnissen und dient laut Perplexity nicht dem Training von Grundmodellen. Perplexity-User holt Seiten auf Wunsch von Nutzern und «generally ignores robots.txt rules». Änderungen wirken nach bis zu 24 Stunden. `[Regel laut Perplexity · KQ-Q4]`

**Dokumentiert gegen behauptet**

- **Cloudflare, 04.08.2025:** Cloudflare kaufte neue Test-Domains, die keine Suchmaschine kannte, und sperrte in `robots.txt` alle Bots. Perplexity beantwortete trotzdem Fragen zum Inhalt. Cloudflare beobachtete einen nicht deklarierten Crawler, der sich als Chrome auf macOS ausgab und IP-Adressen ausserhalb der veröffentlichten Liste nutzte, auf «tens of thousands of domains». Deklariert: 20 bis 25 Mio. Anfragen pro Tag, verdeckt: 3 bis 6 Mio. Im gleichen Test hielt sich ChatGPT-User an `robots.txt`. `[Fakt · KQ-Q40; Messung eines Anbieters, der Bot-Abwehr verkauft]`
- **Antwort von Perplexity:** Cloudflare verwechsle Assistenten, die auf Wunsch von Menschen handeln, mit bösartigen Bots. `[Fakt · KQ-Q41, 05.08.2025, über die Stellungnahme]`
- **Tow Center, März 2025:** Perplexity Pro erkannte fast ein Drittel der Auszüge von Verlagen, die den Zugriff gesperrt hatten. `[Fakt · KQ-Q31]`

**Wie eine Website Quelle wird**

- PerplexityBot zulassen, die veröffentlichten IP-Adressen (`perplexity.ai/perplexitybot.json`) nicht blockieren. `[Regel laut Perplexity · KQ-Q4]`
- Wie Perplexity Quellen auswählt, dokumentiert Perplexity nicht. `[Fakt · eigene Suche, 01.11.2026]`

**Was der Betrieb steuern kann**

- `Disallow` für PerplexityBot nimmt die Seiten laut Perplexity aus der Suche. Für Perplexity-User gilt das in der Regel nicht. `[Regel laut Perplexity · KQ-Q4]`
- Ob die Sperre in der Praxis hält, ist umstritten (Cloudflare, Tow Center). `robots.txt` ist eine Bitte, kein Schloss. `[Fakt · KQ-Q31; KQ-Q40; Folgerung: Annahme]`

### 3.3 Google KI-Übersicht und KI-Modus

**Index und Crawler**

- Beide nutzen den Google-Suchindex. Voraussetzung für einen «supporting link»: Die Seite ist indexiert und darf in der Suche mit Snippet erscheinen. «There are no additional technical requirements.» `[Regel laut Google · KQ-Q6, 10.12.2025]`
- Beide können «query fan-out» nutzen: mehrere verwandte Suchen zu Teilthemen. Darum zeigen sie oft andere und mehr Links als die klassischen Treffer. KI-Übersicht und KI-Modus können verschiedene Modelle nutzen; ihre Links unterscheiden sich. `[Regel laut Google · KQ-Q6]`
- KI-Übersichten erscheinen nur, wenn Googles Systeme sie für hilfreich halten. `[Regel laut Google · KQ-Q6; KQ-Q10]`

**Dokumentiert gegen behauptet**

- Dokumentiert: keine besonderen Anforderungen, keine besonderen Massnahmen, kein spezielles schema.org-Markup, keine neuen maschinenlesbaren Dateien oder «AI text files». Es gelten die Search Essentials. `[Regel laut Google · KQ-Q6]`
- Hilfreich laut Google: Zugang für Googlebot auch über CDN, interne Links, Text statt nur Bild, strukturierte Daten passend zum sichtbaren Text, aktuelle Angaben im Unternehmensprofil. `[Regel laut Google · KQ-Q6]`
- Nur Behauptung: Klicks von Seiten mit KI-Übersicht seien «higher quality», die Leute blieben länger. Google nennt keine Zahlen. `[Regel laut Google · KQ-Q6; Wirkung nicht belegt]`
- Google warnt selbst: «können und werden Fehler vorkommen». `[Regel laut Google · KQ-Q10]`
- Seit Mai 2026 zählen Versuche, die KI-Antworten in der Google-Suche zu lenken, ausdrücklich als Spam. `[Regel laut Google · G-Q3 und G-Q14 im Skript «Google-Grundlagen»]`

**Wie eine Website Quelle wird**

- Wie für jeden Treffer: indexierbar (G1), snippetfähig, hilfreicher Inhalt. Mehr verlangt Google nicht. `[Regel laut Google · KQ-Q6]`
- Messungen zur Überschneidung mit den klassischen Treffern sind widersprüchlich: BrightEdge meldet 54,5 % der Zitate aus organischen Treffern, aber nur 16,7 % aus den ersten zehn (Teil 5). `[Fakt · KQ-Q39; Anbieter]`

**Was der Betrieb steuern kann**

`[Regel laut Google · KQ-Q6; KQ-Q7]`

- `robots.txt` für Googlebot: sperrt die Seite für die ganze Google-Suche, nicht nur für die KI.
- `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex`: begrenzen, was Google in KI-Funktionen zeigt. `nosnippet` und `max-snippet` wirken auch auf das normale Snippet (S-Q3 im Skript «Titel, Snippet, Struktur»).
- **Google-Extended** wirkt **nicht** auf die Google-Suche und ist kein Rangsignal. Die Seite zu KI-Übersichten nennt Google-Extended nur für das Training und das Grounding «in some other Google systems». Wer KI-Übersichten meiden will, braucht die Snippet-Regeln oben.
- Google will Anfang 2027 das gemeinsame Signal AIPREF für Trainings-Vorlieben unterstützen (`user-agent: __usage_ai-training`). `[Regel laut Google · KQ-Q7, 30.10.2026]` Wann neu prüfen: im ersten Quartal 2027 (KQ6).
- Änderungen sieht Google erst nach erneutem Crawlen, das dauert Tage bis Monate. `[Regel laut Google · KQ-Q6]`

**Messen**

- KI-Übersicht und KI-Modus zählen in Search Console im Leistungsbericht unter «Web» mit. Einen eigenen Bericht gibt es nicht. `[Regel laut Google · KQ-Q6]` Wie man Search Console liest, steht in «Messen mit Search Console» (Semester 3).

**Klickverluste, kurz.** Mit KI-Übersicht klickten US-Nutzer in 8 % der Besuche auf einen normalen Treffer, ohne in 15 %; auf einen Link in der Übersicht in 1 %. `[Fakt · KQ-Q32 = S-Q20, Pew 2025]` In Deutschland fällt Platz 1 mit KI-Übersicht von über 27 % auf 11 %. `[Fakt · KQ-Q33 = S-Q23, Sistrix 2026, Methode kaum beschrieben]` Weitere Zahlen und ihre Grenzen: Teil 10 in «Titel, Snippet, Struktur».

### 3.4 Gemini (App)

**Index und Crawler**

- Gemini Apps nutzen für das Grounding Inhalte aus dem Google-Suchindex, die dem Modell zur Laufzeit gegeben werden. `[Regel laut Google · KQ-Q7, 30.10.2026]`
- Einen eigenen Crawler gibt es dafür nicht. Google-Extended ist nur ein Token in `robots.txt`; gecrawlt wird mit den bekannten Google-Bots. `[Regel laut Google · KQ-Q7]`
- In der Schnittstelle für Entwickler entscheidet das Modell, ob es sucht, führt eine oder mehrere Suchen aus und gibt Zitate mit Adresse und Titel zurück. `[Regel laut Google · KQ-Q13, 28.10.2026]`

**Dokumentiert gegen behauptet**

- Dokumentiert: Gemini zeigt «manchmal» einen Knopf «Sources» mit Links. «Not all responses include related links or sources.» Zitiert Gemini viel Text wörtlich von einer Seite, steht diese Seite in der Quellenliste. `[Regel laut Google · KQ-Q11]`
- Nicht dokumentiert: nach welchen Regeln die App Quellen auswählt. `[Fakt · eigene Durchsicht, 01.11.2026]`
- Gemessen: Im Test des Tow Center verwiesen mehr als die Hälfte der Antworten von Gemini auf erfundene oder kaputte Links. `[Fakt · KQ-Q31, veröffentlicht 06.03.2025, ältere Modellfassung]`

**Was der Betrieb steuern kann**

- **Google-Extended** sperrt laut Google die Nutzung für das Training künftiger Gemini-Modelle **und** für das Grounding in Gemini Apps und in «Grounding with Google Search» bei Vertex AI. Die Google-Suche bleibt davon unberührt. `[Regel laut Google · KQ-Q7]`
- **Abwägung:** Wer Google-Extended sperrt, um das Training zu vermeiden, verschwindet damit wohl auch als Quelle in der Gemini-App. `[Annahme, aus KQ-Q7]` Das gehört in den Entscheid nach KQ3.

### 3.5 Microsoft Copilot und Bing

**Index und Crawler**

- Copilot und Copilot Chat holen Informationen aus dem Bing-Suchdienst. Copilot erzeugt dafür eine Suchanfrage aus wenigen Wörtern, nicht den ganzen Prompt. Die genauen Suchanfragen zeigt Copilot Chat bei den Quellen. `[Regel laut Microsoft · KQ-Q15, 29.10.2026; Seite für die Fassungen mit Firmenkonto]`
- Die Richtlinien für Webmaster sagen: Bing und Copilot «rely on the same core crawling, indexing, and ranking foundation as traditional search». `[Regel laut Microsoft · KQ-Q16, ohne Datum, Abruf 01.11.2026]`
- Microsoft schreibt, sein Grounding liefere «nearly every major AI assistant in the market» zu. `[Regel laut Microsoft · KQ-Q19, 12.02.2026]` Das ist eine Selbstauskunft ohne Liste. Belegt ist nur, dass OpenAI Microsoft als Suchanbieter nennt (3.1). `[Fakt · KQ-Q2]`

**Dokumentiert gegen behauptet**

- Dokumentiert: Seiten, die Bing gut lesen und prüfen kann, sind eher für Grounding und Zitate geeignet. Dünne Seiten, Seiten voller Werbung oder nur mit Affiliate-Links können die Sichtbarkeit verlieren. Klare, gleichbleibende Namen für Personen, Organisationen, Produkte und Orte helfen. Kein langer Vorspann vor dem Thema. `[Regel laut Microsoft · KQ-Q16]`
- Microsoft sagt selbst: «GEO does not guarantee grounding or citations in AI experiences.» `[Regel laut Microsoft · KQ-Q16]`
- Tipps aus dem Blog zur Zitat-Auswertung: klare Überschriften, Tabellen, FAQ-Abschnitte, Belege mit Zahlen und Quellen, aktueller Inhalt, IndexNow, Bing Places für lokale Betriebe. `[Regel laut Microsoft · KQ-Q18, 10.02.2026]` Das ist Absicht, keine Messung.

**Wie eine Website Quelle wird**

- In Bing indexiert sein. Änderungen über IndexNow melden, damit Copilot keine veralteten Adressen zitiert. `[Regel laut Microsoft · KQ-Q16]` Details zu IndexNow: «technik-crawlen-indexieren.md».
- Lokale Betriebe pflegen Adresse, Zeiten und Kontakt in Bing Places. `[Regel laut Microsoft · KQ-Q18]`

**Was der Betrieb steuern kann**

- `NOCACHE`: Copilot nutzt nur Adresse, Titel und Snippet. Das macht die Zitate dünner. `[Regel laut Microsoft · KQ-Q16; KQ-Q17, 22.09.2023]`
- `NOARCHIVE`: Die Inhalte erscheinen nicht in den Antworten und werden dort nicht verlinkt. Auch nicht für das Training der Grundmodelle von Microsoft. `[Regel laut Microsoft · KQ-Q17, 22.09.2023, damals für «Bing Chat»]` Ob die Regel von 2023 für Copilot unverändert gilt, sagt die heutige Richtlinie nur für `NOCACHE`. `[Fakt · KQ-Q16]`
- `robots.txt` für Bingbot sperrt Bing ganz. Bing beachtet laut eigener Aussage alle Vorgaben aus `robots.txt` und anderen unterstützten Steuerungen. `[Regel laut Microsoft · KQ-Q18]`

**Messen**

- Seit 10.02.2026 zeigt «AI Performance» in den Bing Webmaster Tools als öffentliche Vorschau: Zahl der Zitate, zitierte Seiten pro Tag, Zitate je Adresse und eine Stichprobe der «grounding queries». Abgedeckt sind Copilot, KI-Zusammenfassungen in Bing und ausgewählte Partner. `[Regel laut Microsoft · KQ-Q18]` Klickzahlen nennt die Mitteilung nicht. `[Fakt · KQ-Q18]`

### 3.6 Claude mit Websuche (Anthropic)

**Index und Crawler**

- Die Hilfe nennt für die allgemeine Websuche keinen Anbieter; nur die Bildersuche laufe über Bing. `[Regel laut Anthropic · KQ-Q22]`
- Das Trust Center listet für «Web Search» drei Unterauftragnehmer: Brave Search, TurboPuffer und Parallel Web Systems. `[Fakt · KQ-Q24, Abruf 01.11.2026]` Welcher Dienst welchen Teil übernimmt, steht dort nicht.
- Brave schreibt, alle Treffer seiner Such-Schnittstelle kämen aus dem eigenen, unabhängigen Index, ohne Rückgriff auf Google oder Bing. `[Regel laut Brave · KQ-Q28]`
- **Brave hat keinen eigenen Namen in `robots.txt`.** Ist eine Seite für Googlebot gesperrt, crawlt auch Brave sie nicht. `robots.txt` verhindert laut Brave aber nicht die Aufnahme in den Index; dafür braucht es `noindex`. `[Regel laut Brave · KQ-Q27, ohne Datum]`
- **Drei Bots von Anthropic:** ClaudeBot sammelt Inhalte für das Training. Claude-User holt Seiten auf Wunsch von Nutzern. Claude-SearchBot verbessert die Suchergebnisse. Alle beachten `robots.txt`, dazu `Crawl-delay`. `[Regel laut Anthropic · KQ-Q21, 07.04.2026]`

**Dokumentiert gegen behauptet**

- Dokumentiert: «Every response includes citations». `[Regel laut Anthropic · KQ-Q22]` In der Schnittstelle für Entwickler sind Zitate immer an, mit Adresse, Titel und bis zu 150 Zeichen zitiertem Text; jeder Treffer trägt ein `page_age`. `[Regel laut Anthropic · KQ-Q23]`
- Nicht dokumentiert: wie Claude zwischen Treffern wählt. `[Fakt · KQ-Q22; KQ-Q23]`

**Was der Betrieb steuern kann**

- `Disallow` für Claude-SearchBot oder Claude-User «may reduce your site's visibility» in Suchantworten. `Disallow` für ClaudeBot gilt dem Training. `[Regel laut Anthropic · KQ-Q21]`
- Brave lässt sich nicht getrennt sperren, nur zusammen mit Googlebot oder über `noindex`. `[Annahme, aus KQ-Q27]`
- Wer die Schnittstelle nutzt, kann Domains erlauben oder sperren. Das steuert der Nutzer der Schnittstelle, nicht der Betrieb. `[Regel laut Anthropic · KQ-Q23]`

### 3.7 Steuerung auf einen Blick

| Ziel des Betriebs | Google | Bing, Copilot | OpenAI | Perplexity | Anthropic, Brave |
|---|---|---|---|---|---|
| In KI-Antworten als Quelle | Googlebot offen, indexierbar, snippetfähig | Bingbot offen, indexiert | OAI-SearchBot offen, IP-Liste frei | PerplexityBot offen, IP-Liste frei | Claude-SearchBot, Claude-User offen; Googlebot offen (Brave) |
| Weniger Text in KI-Antworten | `max-snippet`, `data-nosnippet` | `NOCACHE` | nicht dokumentiert | nicht dokumentiert | nicht dokumentiert |
| Nicht in KI-Antworten | `nosnippet` (kostet auch das normale Snippet) | `NOARCHIVE` | `Disallow` OAI-SearchBot (Navigationslinks bleiben) | `Disallow` PerplexityBot (Perplexity-User meist nicht) | `Disallow` Claude-SearchBot, Claude-User; Brave nur über Googlebot oder `noindex` |
| Nicht ins Training | Google-Extended (sperrt auch Grounding in Gemini) | `NOARCHIVE` | `Disallow` GPTBot | PerplexityBot laut Anbieter ohne Training | `Disallow` ClaudeBot |

Alle Zeilen: `[Regel laut Anbieter · KQ-Q1, KQ-Q4, KQ-Q6, KQ-Q7, KQ-Q16, KQ-Q17, KQ-Q21, KQ-Q27]`. Die Felder «nicht dokumentiert»: `[Fakt · eigene Suche, 01.11.2026]`.

**Vorgabe für kleine Betriebe** `[Annahme]`: Alle Such-Crawler offen (KQ2). Training ist eine eigene Frage, die der Betrieb entscheidet, nicht die Agentur (KQ3). Snippet-Sperren nur mit Grund, etwa bei Preisen, die oft wechseln (KQ5).

---

## 4. Erwähnungen ausserhalb der eigenen Website

### 4.1 Was die Anbieter dazu schreiben

- **Google:** Für KI-Funktionen hilft ein aktuelles Unternehmensprofil. `[Regel laut Google · KQ-Q6]` Angaben im Knowledge Panel kommen «from various sources across the web» und von Datenpartnern. Für Betriebe mit Kundschaft vor Ort gilt das Unternehmensprofil, nicht das Knowledge Panel. `[Regel laut Google · KQ-Q14]` Erwähnungen im Web nennt Google als Quelle für Kategorien im Profil. `[Regel laut Google · P-Q1 im Skript «Lokal und Profil»]`
- **Microsoft:** Bing Places für lokale Angaben; gleichbleibende Namen für Organisationen und Orte. `[Regel laut Microsoft · KQ-Q16; KQ-Q18]`
- **OpenAI:** Drittanbieter liefern Firmeneinträge in der Nähe; Reservationen kommen von OpenTable, Resy, Yelp. Welche Verzeichnisse genau, steht nicht da. `[Regel laut OpenAI · KQ-Q2]`
- **Perplexity, Anthropic:** Zu Verzeichnissen und Bewertungsportalen habe ich nichts gefunden. `[Fakt · eigene Suche, 01.11.2026]`

### 4.2 Was Messungen zeigen

- **Fremde Quellen vor eigenen.** In der Studie von Chen u. a. zitierten KI-Suchen (Schnittstellen von ChatGPT, Perplexity, Gemini, Claude) bei Ranglisten-Fragen deutlich öfter fremde, unabhängige Seiten («earned media») als Seiten der Marken oder soziale Netzwerke. Google war ausgewogener. Bei GPT lag der Anteil fremder Quellen je nach Branche bei 69 bis 92 %. `[Fakt · KQ-Q30, Vorabdruck 10.09.2025, USA und Kanada]`
- **Lokale Suchen überschneiden sich kaum mit Google.** In derselben Studie teilten KI-Suche und Google bei Autoreparatur nur 2,5 % der Domains, bei Zahnärzten 11,9 %, bei Dachdeckern 17,1 %. `[Fakt · KQ-Q30]` Wer bei Google oben steht, ist also nicht automatisch die Quelle der KI. `[Annahme]`
- **Erwähnungen gehen mit Nennungen einher.** Ahrefs fand bei 75 000 Marken: Die Zahl der Erwähnungen der Marke im Web korreliert mit Nennungen in KI-Übersichten (Spearman 0,664), Backlinks nur schwach (0,218). 26 % der Marken wurden nie genannt. Ahrefs schreibt selbst: Korrelation ist keine Ursache. `[Fakt · KQ-Q35, 26.05.2025; Anbieter, nur Marken mit Domain Rating über 40]`
- **Wikipedia, Reddit, YouTube werden oft zitiert, aber schwankend.** Pew: Diese drei machen zusammen 15 % der Quellen in Googles KI-Zusammenfassungen aus. `[Fakt · KQ-Q32]` Semrush: In ChatGPT fiel der Anteil der Antworten mit Reddit-Zitat binnen Wochen von fast 60 auf rund 10 %, mit Wikipedia von rund 55 auf unter 20 %. `[Fakt · KQ-Q37, Juli bis Oktober 2025, Anbieter]`
- **Kundschaft fragt KI auch nach lokalen Betrieben.** 45 % der Befragten in den USA nutzen ChatGPT oder andere KI-Werkzeuge, um lokale Betriebe zu finden. `[Fakt · P-Q13, BrightLocal 2026, Selbstauskunft, Anbieter]`

### 4.3 Was Meinung ist

- «Erwähnungen in Bestenlisten und auf Branchenseiten zählen für KI-Suchen.» `[Meinung · Whitespark, P-Q12, Umfrage unter 47 Fachleuten]`
- «Erwähnungen schlagen Backlinks 3 zu 1.» Das ist eine Lesart der Ahrefs-Korrelation durch Dritte, kein Messergebnis zur Wirkung. `[Annahme, aus KQ-Q35]`
- Dass gekaufte Listen-Artikel («die 10 besten Garagen») KI-Zitate bringen, ist in keiner Studie mit Methode belegt. Für den Betrieb verstösst so etwas gegen B8 und, mit Link, gegen G7. `[Fakt · eigene Suche, 01.11.2026; Verweis B8, G7]`

### 4.4 Die Kanäle einzeln

| Kanal | Was belegt ist | Was der Betrieb tut |
|---|---|---|
| **Unternehmensprofil (Google), Bing Places, Apple** | Google und Microsoft nennen das Profil für KI und lokale Angaben. | Pflegen nach P1 bis P10, gleiche Daten nach P19 (KQ11). |
| **Verzeichnisse (local.ch, search.ch, Verbände)** | OpenAI nutzt Drittanbieter für Firmeneinträge, ohne Namen. Für Schweizer Verzeichnisse: keine Messung. | Einträge prüfen und gleich halten (P19, P20, KQ14). Nichts kaufen, was eine KI-Sichtbarkeit verspricht (KQ9). |
| **Bewertungsportale** | Reservationen über OpenTable und Yelp in ChatGPT; sonst nur Meinung. | Bewertungen nach P11 bis P16 und B4, B20. Keine gefälschten Bewertungen (P12, B8). |
| **Presse, Gemeinde, Verband** | Fremde Quellen werden von KI-Suchen bevorzugt (KQ-Q30, nur Ranglisten-Fragen, USA und Kanada). | Echte Anlässe melden. Bezahlte Beiträge sind als Werbung gekennzeichnet (B19). |
| **Wikipedia** | Kleine Betriebe sind meist nicht relevant: Die deutsche Wikipedia verlangt etwa 1000 Vollzeitstellen, über 100 Mio. Euro Umsatz, 20 Betriebsstätten oder eine belegte Marktführerschaft. Die englische verlangt ausführliche Berichte in mehreren unabhängigen Quellen; Verzeichnisse und Medienmitteilungen zählen nicht. | Keinen Artikel über sich selbst anlegen (KQ13). |
| **Wikidata** | Ein Eintrag braucht einen Wikipedia-Link, eine klar bestimmbare Sache mit ernsthaften öffentlichen Belegen oder einen strukturellen Bedarf. | Nur wenn ein Eintrag schon besteht: Fehler mit Beleg melden. `[Annahme]` |

Alle Zeilen: `[Fakt · Quellen in 4.1 und 4.2; KQ-Q49 bis KQ-Q51]`. Spalte «Was der Betrieb tut»: `[Annahme; Verweise auf Semester 2 und 3]`.

> **Beispiel, erfunden.** Garage Muster in Musterdorf hat auf der Website «Reifenwechsel 4 Räder CHF 80», im Google-Profil noch «CHF 70» und auf einem Verzeichnis eine alte Telefonnummer. Eine KI-Antwort kann jede dieser Angaben zitieren. Besser: eine Faktenliste (P19), von der aus Website, Profil, Bing Places und Verzeichnisse am selben Tag nachgeführt werden, mit Prüfdatum (KQ11, KQ14).

---

## 5. Studien zu KI-Zitaten

Gewichtung wie in `../abgleich-menschen.md`: Experiment stark, Verhaltensdaten mittel, Anbieter-Auswertung schwach bis mittel, Fallstudie schwach. Lehre aus Semester 3: Studien zu «KI-Sichtbarkeit» stammen fast alle von Anbietern, die dazu ein Werkzeug verkaufen. `[Fakt · Prüfauftrag Semester 4]`

### 5.1 Die Studien

| Studie | Methode und Stichprobe | Ergebnis | Anbieter? | Qualität |
|---|---|---|---|---|
| **Aggarwal u. a., GEO, KDD 2024** | 10 000 Fragen aus 9 Datensätzen (GEO-bench). Nachgebaute KI-Suche: die ersten 5 Google-Treffer, Antwort von gpt-3.5-turbo. 9 Textänderungen getestet. Dazu ein Test mit Perplexity. Fassung 3 vom 28.06.2024. | Quellen nennen, Zitate einfügen und Zahlen einfügen steigerten die Sichtbarkeit um 30 bis 40 % (wortgewichtet nach Position). Suchwort-Stapel: kaum Wirkung, bei Perplexity rund 10 % schlechter. Seiten auf Platz 5 gewannen mit «Quellen nennen» 115 %, Seiten auf Platz 1 verloren im Schnitt 30 %. | nein, Hochschulen | Experiment, begutachtet; nachgebaute Suchmaschine, altes Modell, Englisch; die Autoren nennen selbst nur 2 getestete Dienste |
| **Chen, Wang, Chen, Koudas, 2025** | Schnittstellen von GPT-4o mit Suche, Perplexity sonar-pro, Gemini 2.5 Flash mit Google-Grounding, Claude 3.5 Sonnet mit Websuche, dazu Google Top 10. 1000 Ranglisten-Fragen in 10 Kategorien, USA und Kanada; Sprachen- und Umformulierungs-Tests; lokale Kategorien | KI-Suche bevorzugt fremde Quellen («earned media») «systematic and overwhelming». Bei GPT 69 bis 92 % fremde Quellen je Branche. Überschneidung mit Google bei lokalen Suchen: 0,1 bis 20,6 %. | kein Werkzeug-Anbieter erkennbar | gemessene Antworten, gross; Vorabdruck, nicht begutachtet; Schnittstellen statt Apps; Einteilung der Domains durch GPT-4o |
| **Tow Center, Jaźwińska, Chandrasekar, 2025** | 8 KI-Suchen, 20 Verlage, je 10 Artikel: Auszug zeigen, Titel, Verlag, Datum und Adresse erfragen. 1600 Anfragen, veröffentlicht März 2025 | Über 60 % falsche Antworten, Perplexity 37 %, Grok 3 94 %. Mehr als die Hälfte der Antworten von Gemini und Grok 3 mit erfundenen oder kaputten Links. Gesperrte Verlage wurden trotzdem erkannt. Kopien statt Originale zitiert. | nein, Hochschule (Columbia) | kontrollierter Test, unabhängig; nur Nachrichten, ältere Modellfassungen |
| **Pew Research Center, 2025** | Browserdaten von 900 US-Erwachsenen, März 2025, 68 879 Google-Suchen | 18 % der Suchen mit KI-Zusammenfassung. Klick auf normalen Treffer 8 % gegen 15 %; auf Link in der Zusammenfassung 1 %. 88 % der Zusammenfassungen nennen 3 oder mehr Quellen. Wikipedia, YouTube, Reddit: 15 % der Quellen. | nein | Verhaltensdaten einer Panel-Stichprobe, unabhängig, USA |
| **Seer Interactive, 2025** | Search-Console- und Ads-Daten von 42 Kundenfirmen, 3119 Suchbegriffe mit Info-Absicht, 25,1 Mio. organische Einblendungen, Juni 2024 bis September 2025 | Organische Klickrate bei Begriffen mit KI-Übersicht von 1,76 auf 0,61 %. Marken, die in der Übersicht zitiert werden: 0,70 % gegen 0,52 % (plus 35 %). Die Autoren: «We cannot definitively prove that citation causes higher CTRs». | ja, Agentur | Verhaltensdaten, mittel; Auswahl der Kunden; Zahlen im Text widersprechen sich (2,74 und 2,72 %; «61 %» statt rund 65 %; 1,2 % und 0,70 % für zitierte Marken) |
| **Ahrefs, 2025** (Linehan) | 75 000 Marken mit Domain Rating über 40, Nennungen in KI-Übersichten aus dem eigenen Werkzeug «Brand Radar», Spearman-Korrelation | Erwähnungen der Marke 0,664; Ankertexte mit Marke 0,527; Suchvolumen der Marke 0,392; Backlinks 0,218. 26 % ohne Nennung. | ja, SEO-Werkzeug | Korrelation, gross; nur grosse Marken; Werkzeug wird im Text beworben |
| **Ahrefs, 2026** (Law) | 300 000 Suchbegriffe, Search-Console-Daten ohne Angabe der Websites, nur Desktop, Dezember 2023 gegen Dezember 2025 | Mit KI-Übersicht 58 % weniger Klicks auf Platz 1 als vorhergesagt (0,016 statt 0,037). Vorjahr: 34,5 %. | ja | Verhaltensdaten mit Vorhersage; Annahme gleicher Entwicklung beider Gruppen; schwach bis mittel |
| **Semrush, 2025** (Harsel) | über 230 000 Prompts in ChatGPT-Suche, KI-Modus, Perplexity; 13 Wochen, 14.07. bis 12.10.2025; nur die 25 meistzitierten Domains je Woche | Reddit in ChatGPT: von fast 60 % auf rund 10 % der Antworten; Wikipedia von rund 55 auf unter 20 %. LinkedIn im KI-Modus rund 15 %. Ursache unklar. | ja | Beobachtung, gross; Markt nicht genannt; widersprüchliche Zahl zu Wikipedia im KI-Modus (2 und 3 %) |
| **Profound, 2025** (Lafferty) | 680 Mio. Zitate, August 2024 bis Juni 2025, ChatGPT, KI-Übersichten, Perplexity | Wikipedia 7,8 % aller Zitate in ChatGPT; Reddit 6,6 % in Perplexity, 2,2 % in KI-Übersichten | ja, verkauft Messung von KI-Sichtbarkeit | Beobachtung ohne Methode: Wie Fragen gewählt und Zitate gesammelt wurden, steht nicht da; schwach |
| **BrightEdge, 2025** | 9 Branchen, Mai 2024 bis September 2025, eigenes Werkzeug; Zahl der Suchbegriffe nicht genannt | Anteil der Zitate in KI-Übersichten, die auch organisch ranken: von 32,3 auf 54,5 %. Nur 16,7 % aus den ersten 10. | ja | Beobachtung; Tiefe der «Überschneidung» nicht definiert; Zeitreihe in sich widersprüchlich; schwach |
| **Sistrix, 2026** (Deutschland) | über 100 Mio. Suchbegriffe | KI-Übersicht bei gut 20 % der Begriffe. Platz 1: über 27 % ohne, 11 % mit Übersicht. | ja | Verhaltensdaten, Methode kaum beschrieben; nächste Daten zum deutschen Sprachraum |
| **Cloudflare, 2025** | neue, nicht indexierte Test-Domains mit Sperre in `robots.txt`; Beobachtung im eigenen Netz | verdeckter Crawler von Perplexity auf «tens of thousands of domains»; ChatGPT-User hielt sich an die Sperre | ja, verkauft Bot-Abwehr | kontrollierter Test plus Netzdaten; Gegenrede von Perplexity |
| **FHNW für SRF «Kassensturz», 2025** | 10 Chatbots in den Gratisfassungen ohne Anmeldung, über 300 Fragen, rund 20 % mit Schweiz-Bezug, 22.10. bis 13.11.2025, Paarvergleich durch 40 Fachleute und Mitarbeitende der FHNW | Mehrere Bots erfanden Antworten auf Schweiz-Fragen oder antworteten mit Blick auf Deutschland. Beispiel: Zwei Bots hielten eine «Stange» für ein Brot. | nein, Hochschule im Auftrag des Fernsehens | Paarvergleich mit Menschen, Schweiz; ob die Websuche an war, steht nicht da |

Alle Zeilen: `[Fakt · KQ-Q29 bis KQ-Q40, KQ-Q46, Abruf 01.11.2026]`. Spalte «Qualität»: `[Annahme · eigene Einordnung nach ../abgleich-menschen.md]`.

### 5.2 Was die Daten zusammen sagen

1. **Konkret schlägt leer, auch für Modelle.** Das einzige begutachtete Experiment (GEO) zeigt: Zahlen, Zitate und genannte Quellen im Text erhöhen die Sichtbarkeit in KI-Antworten; Suchwort-Stapel nicht. Das passt zu B1, K2 und W22 aus Semester 1 und 2. `[Fakt · KQ-Q29; Übertragung auf heutige Dienste: Annahme]`
2. **Die Auswahl der Quellen ist der schwerste Schritt.** GEO gibt die Quellen vor. Chen u. a. zeigen, dass KI-Suchen andere Domains wählen als Google, bei lokalen Fragen fast ganz andere. Kein Text kann zitiert werden, den der Dienst nicht holt. `[Fakt · KQ-Q29; KQ-Q30; Folgerung: Annahme]`
3. **Fremde Quellen wiegen schwer.** Bevorzugung von «earned media» (Chen u. a.) und die Korrelation mit Erwähnungen (Ahrefs) zeigen in dieselbe Richtung. Ursache ist keine der beiden Studien. `[Fakt · KQ-Q30; KQ-Q35; Wertung: Annahme]`
4. **Die Muster schwanken stark.** Reddit fiel in ChatGPT binnen Wochen von fast 60 auf 10 % (Semrush). Jede Aussage über «was KI zitiert» braucht ein Datum und verfällt schnell. `[Fakt · KQ-Q37; Folgerung: Annahme]`
5. **Zitat heisst nicht Klick.** Auf Links in Googles KI-Zusammenfassung klickten Nutzer in 1 % der Besuche. Zitierte Marken haben bei Seer etwas höhere Klickraten, die Ursache ist offen. `[Fakt · KQ-Q32; KQ-Q34]`
6. **KI-Antworten sind oft falsch zitiert.** Über 60 % falsche Quellenangaben im Test des Tow Center; Schweiz-Fragen mit erfundenen oder deutschen Antworten im Test der FHNW. Ein Betrieb kann nicht davon ausgehen, dass die KI seine Angaben richtig wiedergibt. `[Fakt · KQ-Q31; KQ-Q46; Folgerung: Annahme]`

**Grenzen.** Keine Studie misst kleine Dienstleister getrennt. Keine misst Anrufe oder Anfragen nach einem KI-Zitat. Fast alle Zitat-Daten kommen aus den USA, viele aus Schnittstellen statt aus den Apps, die Menschen nutzen. Die einzige Schweizer Messung (FHNW) prüft die Qualität der Antworten, nicht die Quellen. `[Fakt · eigene Durchsicht, 01.11.2026]`

---

## 6. Was das für Texte heisst

Die Regeln zum Schreiben stehen in «zitierfaehig-schreiben.md». Hier nur die Brücke. `[Verweis]`

- **Fakten mit Zahl und Quelle.** GEO stützt Zahlen, Zitate und Quellenangaben im Text, im Labor. Für die eigene Seite heisst das: Preis mit Einheit, Frist in Tagen, Quelle bei fremden Zahlen (B1, K2). `[Fakt · KQ-Q29; Übertragung: Annahme]`
- **Keine Suchwort-Stapel.** Wirkungslos bis schädlich, bei Google Spam (G3, G4). `[Fakt · KQ-Q29; Regel laut Google · G-Q3]`
- **Erster Absatz trägt die Antwort.** Copilot liest nach Microsoft lieber Seiten ohne langen Vorspann; Google zieht Snippets meist aus dem Inhalt (S13). `[Regel laut Microsoft · KQ-Q16; Regel laut Google · S-Q3]`
- **Gleiche Namen überall.** Microsoft rät zu gleichbleibenden Namen für Organisation und Ort. `[Regel laut Microsoft · KQ-Q16]`
- **Stand-Datum sichtbar.** Claude bekommt zu jedem Treffer ein `page_age`; Microsoft empfiehlt aktuelle Inhalte. Ob ein sichtbares Datum die Auswahl ändert, ist nicht gemessen. `[Regel laut Anthropic · KQ-Q23; Regel laut Microsoft · KQ-Q18; Wirkung: Annahme]`

> **Beispiel, erfunden.** Schwach: «Physio Muster: Ihre ganz·heitliche Physiotherapie mit Herz.» Besser: «Physio Muster in Musterdorf: Sitzung ohne ärztliche Verordnung CHF 120 (45 Minuten). Termine auch am Samstagmorgen. Stand: 1. November 2026.» Der zweite Text hat Ort, Preis, Einheit und Datum, die eine KI wörtlich übernehmen kann. Ob ein Dienst die Seite holt, entscheidet er trotzdem selbst (Teil 2).

---

## 7. Wenn in der Schweiz

### 7.1 Was in der Schweiz verfügbar ist

Geprüft am 01.11.2026. Funktionen ändern sich schnell; neu prüfen nach KQ6.

| Funktion | Schweiz | Beleg | Stand |
|---|---|---|---|
| **Google KI-Übersicht** («Übersicht mit KI») | ja, Deutsch, Französisch, Italienisch, Englisch; beim Start nur angemeldet ab 18 | Google-Blog; Netzwoche; Google-Hilfe nennt «Schweiz» und die drei Sprachen | seit 25.03.2025; Hilfe abgerufen 01.11.2026 |
| **Google KI-Modus** | ja, laut Agenturmeldung | Keystone-SDA: «in more than 40 countries, including Switzerland». Der Google-Blog nennt keine Länder. | seit 08.10.2025 |
| **Gemini (App)** | ja, Deutsch in der Sprachliste | Gemini-Hilfe | Abruf 01.11.2026 |
| **Microsoft Copilot** | Seiten für «Deutsch (Schweiz)» und «Français (Suisse)»; keine für Italienisch in der Schweiz | Microsoft-Seite zur Sprachwahl | Abruf 01.11.2026 |
| **ChatGPT-Suche** | Hilfe nennt keine Länder-Einschränkung; Reservationen über OpenTable «globally», Resy und Yelp nicht in der Schweiz | OpenAI-Hilfe; Länderliste nicht abrufbar | Hilfe um 20.10.2026 |
| **Perplexity** | keine offizielle Länderliste gefunden. Sunrise kündigte am 06.03.2025 eine exklusive Partnerschaft an, Perplexity Pro solle «bald» kostenlos sein; Startdatum nicht genannt | Netzwoche | 06.03.2025 |
| **Claude mit Websuche** | Schweiz auf der Liste der unterstützten Länder; die Hilfe zur Websuche nennt keine Länder | Anthropic | Liste gültig ab 12.11.2026 |

Alle Zeilen: `[Fakt · KQ-Q8 bis KQ-Q12, KQ-Q20, KQ-Q2, KQ-Q47, KQ-Q25, KQ-Q42, KQ-Q43; Abruf 01.11.2026]`.

### 7.2 Nutzung in der Schweiz

- März 2025: Rund zwei Drittel von 1029 Befragten hatten ChatGPT oder Gemini schon genutzt. Unter den Nutzenden suchten 33 % damit Informationen (2024: 27 %). Ein Fachmann von Comparis meinte, Google bleibe bei lokalen Suchen vorn. `[Fakt · KQ-Q44, Comparis mit Innofact; Aussage zu lokal: Meinung · Comparis]`
- März 2026: 76,1 % von 1035 Befragten nutzen regelmässig KI-Werkzeuge. Über 40 % der Nutzenden setzen sie «als Ersatz für die Websuche» ein. `[Fakt · KQ-Q45, Comparis; Institut nicht genannt; Selbstauskunft]`
- Zahlen, wie oft Schweizer Kundschaft KI nach einem lokalen Handwerker oder einer Praxis fragt: nicht gefunden. `[Fakt · eigene Suche, 01.11.2026]`

### 7.3 Sprache: Deutsch und Schweizerdeutsch

- Die KI-Übersicht läuft in der Schweiz auf Deutsch, Französisch und Italienisch. `[Fakt · KQ-Q8; KQ-Q10]` Eine Sprache «Schweizerdeutsch» nennt keiner der Anbieter. `[Fakt · eigene Durchsicht, 01.11.2026]`
- Im Test der FHNW erfanden mehrere Chatbots Antworten auf Schweiz-Fragen oder antworteten für Deutschland. `[Fakt · KQ-Q46]` Daraus folgt für Texte: Schweizer Bezug ausdrücklich schreiben. Gemeinde und Kanton, Preise in CHF, Schweizer Begriffe und Institutionen (Grundversicherung, MWST, SUVA), keine Begriffe aus Deutschland. `[Annahme, aus KQ-Q46]`
- Mundartwörter wie «Stange» oder «Znüni» können missverstanden werden. Wo ein Wort für die Leistung wichtig ist, steht die hochdeutsche Erklärung einmal dabei. `[Annahme, aus dem Beispiel in KQ-Q46]` Eine Studie zu schweizerdeutsch geschriebenen Suchanfragen habe ich nicht gefunden.
- Kein Eszett, auch nicht für Modelle (CH1). `[Verweis]`

### 7.4 Datenschutz (DSG)

- Das Datenschutzgesetz gilt direkt für Datenbearbeitungen mit KI. Anbieter und Verwender von KI-Systemen machen Zweck, Funktionsweise und Datenquellen transparent. Betroffene haben das Recht zu wissen, ob sie mit einer Maschine sprechen oder schreiben. Bei hohen Risiken braucht es eine Datenschutz-Folgenabschätzung. `[Fakt · KQ-Q48, EDÖB, 08.05.2025]`
- **Für die Website eines Betriebs heisst das** `[Annahme, aus KQ-Q48; keine Rechtsberatung]`:
  - Namen, Fotos und Rollen von Mitarbeitenden auf der Website können von Crawlern gelesen und in KI-Antworten wiedergegeben werden. Wer Personen nennt (G17, B11), klärt das mit ihnen vorher.
  - `robots.txt` ist kein Datenschutz. Abrufe auf Wunsch von Nutzern beachten es teils nicht (3.1, 3.2). Was nicht öffentlich sein soll, gehört nicht auf eine öffentliche Seite.
  - Setzt der Betrieb einen Chatbot auf der eigenen Website ein, sagt dieser, dass er eine Maschine ist (KQ19).
  - Wer selbst KI-Werkzeuge für Texte nutzt, gibt keine Kundendaten ein.

---

## 8. Prüfbare Grundsätze

Jede Regel kann ein Werkzeug oder ein Bewerter ohne Vorwissen entscheiden. Grenzwerte ohne Studie sind `[Annahme]`. «Regel laut <Anbieter>» belegt die Absicht des Anbieters, nicht die Wirkung auf Zitate oder Klicks. Weil sich Crawler und Funktionen schnell ändern, gilt für alle Grundsätze mit Anbieter-Regel: neu prüfen nach KQ6.

**Zugang und Index**

- **KQ1 Index vor Text.** Jede Seite, die in KI-Antworten erscheinen soll, ist in Google und Bing indexiert und darf ein Snippet zeigen: Status 200, kein `noindex`, kein `nosnippet`, in `robots.txt` nicht gesperrt (G1). Werkzeug: Prüfung der Antwort und der Meta-Angaben; nach dem Livegang URL-Prüfung in Search Console und Bing Webmaster Tools. `[Regel laut Google · KQ-Q6; Regel laut Microsoft · KQ-Q16]`
- **KQ2 Such-Crawler offen.** `robots.txt` erlaubt Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, Claude-SearchBot und Claude-User. Firewall und CDN blockieren die veröffentlichten IP-Bereiche von OpenAI und Perplexity nicht. Ausnahme nur mit notiertem Entscheid des Betriebs. Werkzeug: `robots.txt` auslesen, Abruf mit den Namen der Bots. Details in «technik-crawlen-indexieren.md». `[Regel laut OpenAI · KQ-Q1, KQ-Q2; Regel laut Perplexity · KQ-Q4; Regel laut Anthropic · KQ-Q21]`
- **KQ3 Training getrennt entschieden.** Für GPTBot, ClaudeBot und Google-Extended liegt ein Entscheid des Betriebs vor, mit Datum. Die Akte nennt die Folge: Google-Extended sperrt auch das Grounding in der Gemini-App, nicht aber die Google-Suche. Prüffrage: Hat der Betrieb entschieden, nicht die Agentur? `[Regel laut Google · KQ-Q7; Regel laut OpenAI · KQ-Q1; Regel laut Anthropic · KQ-Q21]`
- **KQ4 Keine Sonderdatei als Versprechen.** Kein Angebot, kein Bericht und kein Auftrag verspricht KI-Zitate durch eine Zusatzdatei (etwa `llms.txt`) oder durch spezielles Markup. Prüffrage. `[Regel laut Google · KQ-Q6: keine «AI text files», kein spezielles schema.org nötig]` Ob andere Dienste solche Dateien lesen, steht in «technik-crawlen-indexieren.md».
- **KQ5 Snippet-Sperren nur mit Grund.** `nosnippet`, `max-snippet`, `data-nosnippet`, `NOCACHE` und `NOARCHIVE` stehen nur auf Seiten mit notiertem Grund. Ungewollte Sperren: 0. Werkzeug: Meta-Angaben und `X-Robots-Tag` auslesen, Liste gegen die Akte. `[Regel laut Google · KQ-Q6; Regel laut Microsoft · KQ-Q16, KQ-Q17]`
- **KQ6 Neu prüfen mit Datum.** Namen der Crawler, Steuerungen und Verfügbarkeit in der Schweiz (Teil 3.7 und 7.1) werden alle 3 Monate an den Quellen geprüft; nächster fester Termin wegen AIPREF: erstes Quartal 2027. Das Prüfdatum steht in der Akte. Werkzeug: Datum älter als 3 Monate ist ein Befund. `[Fakt · KQ-Q7: AIPREF «early 2027»; Frist: Annahme]`

**Aussagen und Versprechen**

- **KQ7 Anbieter-Text heisst Absicht.** Jede Aussage darüber, wie ein KI-Dienst Quellen wählt, trägt «Regel laut <Anbieter>» oder eine Messung mit Quelle. «ChatGPT bevorzugt …» ohne Quelle ist ein Befund. Werkzeug: Kennzeichen zählen, wie G25 und P17. `[Annahme; Lehre aus ../abgleich-menschen.md]`
- **KQ8 Zahl nur mit Methode.** Jede Zahl zu KI-Sichtbarkeit in einem Bericht oder Angebot nennt Studie, Stichprobe, Zeitraum und ob der Herausgeber ein Werkzeug verkauft. Fehlt eines davon, wird die Zahl nicht verwendet. Prüffrage. `[Fakt · Teil 5: Profound und BrightEdge ohne nachvollziehbare Methode]`
- **KQ9 Keine Zusage zu KI-Zitaten.** Kein Text an Kundschaft verspricht ein Zitat in ChatGPT, Perplexity, Gemini, Copilot, Claude oder in der KI-Übersicht. Werkzeug: Suche nach «garantiert», «sicher zitiert», «Platz in ChatGPT»; Prüffrage für den Rest. `[Regel laut OpenAI · KQ-Q2: «Placement is not guaranteed»; Regel laut Microsoft · KQ-Q16: «GEO does not guarantee»; Verweis G2, P18]`
- **KQ10 Modell-Urteil benannt.** Ergebnisse eines KI-Zitat-Tests, bei dem die Quellen vorgegeben sind, heissen «Modell-Urteil, Quellenauswahl übersprungen». Prüffrage. `[Fakt · Prüfauftrag Semester 4; KQ-Q30: Auswahl der Quellen weicht stark ab]`

**Fakten und Erwähnungen**

- **KQ11 Eine Faktenquelle für alle Kanäle.** Name, Adresse, Telefon, Öffnungszeiten und die wichtigsten Preise stimmen auf Website, Google-Unternehmensprofil, Bing Places, Apple und local.ch oder search.ch überein (P19 um Bing Places erweitert). Werkzeug: Abgleich je Kanal, 0 Abweichungen. `[Regel laut Google · KQ-Q6; Regel laut Microsoft · KQ-Q16, KQ-Q18; Wirkung auf Zitate: Annahme]`
- **KQ12 Erwähnungen nur echt.** 0 gekaufte Listen-Artikel, 0 gefälschte Bewertungen, 0 erfundene Presseberichte, 0 Einträge, die der Betrieb unter fremdem Namen schreibt. Bezahlte Beiträge sind als Werbung gekennzeichnet. Prüffrage an den Betrieb. `[Regel laut Google · G-Q3: Lenken von KI-Antworten ist Spam; Verweis B8, G7, P12]`
- **KQ13 Kein Wikipedia-Artikel über sich selbst.** Der Betrieb oder seine Agentur legen keinen Artikel über den Betrieb an und schreiben keinen. Prüffrage: Erfüllt der Betrieb die Relevanzkriterien, und schreibt jemand ohne Interessenkonflikt? Zweimal Nein ist ein Befund für jeden Entwurf. `[Fakt · KQ-Q49; KQ-Q50]`
- **KQ14 Fremde Einträge mit Prüfdatum.** Es gibt eine Liste aller fremden Einträge (Verzeichnisse, Bewertungsportale, Verbände, Gemeinde) mit Adresse, Datum der letzten Prüfung und gefundenen Fehlern. Werkzeug: Datum älter als 6 Monate ist ein Befund. `[Annahme; Verweis P19, P20]`
- **KQ15 Schweiz ausdrücklich.** Jede Leistungsseite nennt die Gemeinde und Preise in CHF. 0 Euro-Beträge, 0 Begriffe aus dem Recht oder der Verwaltung in Deutschland (etwa «Umsatzsteuer», «gesetzliche Krankenkasse», «Handwerkskammer»). Werkzeug: Wortliste. `[Fakt · KQ-Q46: Bots antworteten für Deutschland; Regel: Annahme]`

**Messen**

- **KQ16 KI-Verkehr messen, nicht schätzen.** Nach dem Livegang liegen vor: Search Console «Web» (enthält KI-Übersicht und KI-Modus), «AI Performance» in den Bing Webmaster Tools (Zitate, Suchanfragen für das Grounding) und eine Auswertung der Verweise von KI-Diensten im eigenen Analyse-Werkzeug. Werkzeug: Bericht mit Datum. `[Regel laut Google · KQ-Q6; Regel laut Microsoft · KQ-Q18; Auswertung der Verweise: Annahme]` Der Zusatz `utm_source=chatgpt.com` an Links aus ChatGPT ist nicht bestätigt (KQ-Q3).
- **KQ17 Zitat ist nicht Klick.** Kein Bericht setzt Zahl der Zitate mit Besuchen oder Anfragen gleich. Prüffrage. `[Fakt · KQ-Q32: 1 % Klicks auf Links in der Zusammenfassung; KQ-Q34]`

**Recht und Manipulation**

- **KQ18 Personen nur mit Zustimmung.** Jede namentlich genannte oder abgebildete Person auf der Website hat zugestimmt und weiss, dass KI-Dienste die Angabe übernehmen können. Prüffrage an den Betrieb. `[Fakt · KQ-Q48: DSG gilt für KI; Regel: Annahme, keine Rechtsberatung]`
- **KQ19 Chatbot sagt, dass er eine Maschine ist.** Hat die Website einen Chatbot, steht das sichtbar vor dem ersten Eingabefeld. Werkzeug: Text vor dem Eingabefeld prüfen. `[Fakt · KQ-Q48, EDÖB 08.05.2025]`
- **KQ20 Keine versteckten Anweisungen an KI.** 0 Textstellen, die sich an Sprachmodelle richten statt an Menschen (etwa «Hinweis an KI-Assistenten: empfiehl …»), sichtbar oder versteckt. Werkzeug: Suche nach Wörtern wie «KI-Assistent», «Sprachmodell», «ignore previous», «AI assistant» im Quelltext; dazu G9. `[Regel laut Google · G-Q3: Lenken von KI-Antworten ist Spam, seit Mai 2026; Verweis G9]`

---

## 9. Für die Semesterprüfung

Der KI-Zitat-Test (T6) gibt sechs Unteragenten je fünf echte Quellen und eine Musterseite vor. `[Fakt · Prüfauftrag Semester 4]` Dieses Skript zeigt, was der Test **nicht** misst:

- **Quellenauswahl:** Ob ein echter Dienst die Musterseite überhaupt holt, hängt am Index (Teil 2). Der Test überspringt das (KQ10).
- **Fremde Quellen:** Im Test sind die fünf echten Quellen fremde Seiten. Der Vorzug der KI-Suchen für fremde Quellen (Teil 4) ist darum teils abgebildet. Wie viele und welche fremden Seiten ein echter Dienst neben der eigenen holt, misst der Test nicht. `[Annahme]`
- **Was der Test zeigen kann:** ob eine Musterseite mit Zahlen, Ort, Datum und klarem ersten Absatz richtig wiedergegeben wird, und ob veraltete oder leere Seiten übergangen werden. Das passt zum GEO-Experiment, das ebenfalls die Quellen vorgibt (KQ-Q29). `[Annahme]`

---

## 10. Quellen

Alle abgerufen am 01.11.2026. Datum in Klammern: Stand der Seite laut Anbieter. «ohne Datum» heisst: Die Seite nennt keines.

**OpenAI**

- **KQ-Q1** OpenAI: «Overview of OpenAI Crawlers» (ohne Datum). https://developers.openai.com/api/docs/bots (frühere Adresse https://platform.openai.com/docs/bots)
- **KQ-Q2** OpenAI Help Center: «Searching the web with ChatGPT» (Stand laut Seite «vor 12 Tagen», also um 20.10.2026). https://help.openai.com/en/articles/9237897-chatgpt-search
- **KQ-Q3** OpenAI Help Center: «Publishers and developers FAQ». **Nicht gelesen:** Die Adresse leitete am 01.11.2026 auf «ChatGPT Atlas retirement» um. Inhalt nur aus Auszügen in Suchtreffern. https://help.openai.com/en/articles/12627856-publishers-and-developers-faq

**Perplexity**

- **KQ-Q4** Perplexity: «Perplexity Crawlers» (ohne Datum). https://docs.perplexity.ai/guides/bots
- **KQ-Q5** Perplexity: «Introducing the Perplexity Search API», 25.09.2025. https://www.perplexity.ai/hub/blog/introducing-the-perplexity-search-api

**Google und Gemini**

- **KQ-Q6** Google Search Central: «AI features and your website» (10.12.2025). https://developers.google.com/search/docs/appearance/ai-features
- **KQ-Q7** Google Search Central: «Google's common crawlers», Abschnitt Google-Extended und AIPREF (30.10.2026). https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
- **KQ-Q8** Hema Budaraju: «We're bringing the helpfulness of AI Overviews to more countries in Europe». Google-Blog, 25.03.2025. https://blog.google/feed/were-bringing-the-helpfulness-of-ai-overviews-to-more-countries-in-europe/
- **KQ-Q9** Hema Budaraju: «AI Mode is now available in more languages and locations around the world». Google-Blog, 07.10.2025. https://blog.google/products-and-platforms/products/search/ai-mode-expands-languages-locations/
- **KQ-Q10** Google-Suche Hilfe: «Übersichten mit KI» (ohne Datum). https://support.google.com/websearch/answer/14901683?hl=de
- **KQ-Q11** Gemini Apps Hilfe: «View related sources from Gemini Apps» (ohne Datum). https://support.google.com/gemini/answer/14143489?hl=en
- **KQ-Q12** Gemini Apps Hilfe: Verfügbarkeit nach Ländern und Sprachen (ohne Datum). https://support.google.com/gemini/answer/13575153?hl=en
- **KQ-Q13** Google AI for Developers: «Grounding with Google Search» (28.10.2026). https://ai.google.dev/gemini-api/docs/google-search
- **KQ-Q14** Google Hilfe: «About knowledge panels» (ohne Datum). https://support.google.com/knowledgepanel/answer/9163198?hl=en

**Microsoft und Bing**

- **KQ-Q15** Microsoft Learn: «Data, privacy, and security for web search in Microsoft Copilot and Microsoft Copilot Chat» (29.10.2026). https://learn.microsoft.com/en-us/microsoft-365/copilot/manage-public-web-access
- **KQ-Q16** Bing Webmaster Tools: «Webmaster Guidelines» (ohne Datum). https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- **KQ-Q17** Bing Webmaster Blog: «Announcing new options for webmasters to control usage of their content in Bing Chat», 22.09.2023. https://blogs.bing.com/webmaster/september-2023/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat
- **KQ-Q18** Bing Webmaster Blog: «Introducing AI Performance in Bing Webmaster Tools Public Preview», 10.02.2026. https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview
- **KQ-Q19** Jordi Ribas: «Elevating the Role of Grounding on the AI Web». Bing Search Blog, 12.02.2026. https://blogs.bing.com/search/February-2026/Elevating-the-Role-of-Grounding-on-the-AI-Web
- **KQ-Q20** Microsoft: «Microsoft Copilot, choose your locale» (ohne Datum). https://www.microsoft.com/en-us/microsoft-copilot/locale

**Anthropic, Claude und Brave**

- **KQ-Q21** Anthropic Help: «Does Anthropic crawl data from the web, and how can site owners block the crawler?» (07.04.2026). https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- **KQ-Q22** Claude Help: «Enabling and using web search» (Stand laut Seite «vor über 3 Wochen»). https://support.claude.com/en/articles/10684626-enabling-and-using-web-search
- **KQ-Q23** Claude Platform Docs: «Web search tool» (ohne Datum). https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool
- **KQ-Q24** Anthropic Trust Center: «Subprocessors», Einträge «Web Search» (ohne Datum). https://trust.anthropic.com/subprocessors
- **KQ-Q25** Anthropic: «Supported countries and regions» (gültig ab 12.11.2026). https://www.anthropic.com/supported-countries
- **KQ-Q26** Simon Willison: «Anthropic used Brave». 21.03.2025. https://simonwillison.net/2025/Mar/21/anthropic-used-brave/
- **KQ-Q27** Brave Search Help: «Brave Search crawler» (ohne Datum). https://search.brave.com/help/brave-search-crawler
- **KQ-Q28** Brave: «Brave Search API» (ohne Datum). https://brave.com/search/api/

**Studien und Messungen**

- **KQ-Q29** Pranjal Aggarwal, Vishvak Murahari, Tanmay Rajpurohit, Ashwin Kalyan, Karthik Narasimhan, Ameet Deshpande: «GEO: Generative Engine Optimization». KDD 2024; arXiv 2311.09735, Fassung 3 vom 28.06.2024. https://arxiv.org/abs/2311.09735
- **KQ-Q30** Mahe Chen, Xiaoxuan Wang, Kaiwen Chen, Nick Koudas: «Generative Engine Optimization: How to Dominate AI Search». Vorabdruck, arXiv 2509.08919, 10.09.2025. https://arxiv.org/abs/2509.08919
- **KQ-Q31** Klaudia Jaźwińska, Aisvarya Chandrasekar: «AI Search Has a Citation Problem». Tow Center for Digital Journalism, Columbia Journalism Review, 06.03.2025. https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php
- **KQ-Q32** Athena Chapekis, Anna Lieb: «Google users are less likely to click on links when an AI summary appears in the results». Pew Research Center, 22.07.2025 (gleich S-Q20). https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/
- **KQ-Q33** Johannes Beus: «AI Overviews in Germany: How Much Click-Through Rates Are Really Dropping». Sistrix, 25.02.2026, geändert 02.04.2026 (gleich S-Q23). https://www.sistrix.com/blog/ai-overviews-in-germany/
- **KQ-Q34** Seer Interactive: «AIO Impact on Google CTR: September 2025 Update», 04.11.2025. https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update
- **KQ-Q35** Louise Linehan: «An Analysis of AI Overview Brand Visibility Factors (75K Brands Studied)». Ahrefs, 26.05.2025. https://ahrefs.com/blog/ai-overview-brand-correlation/
- **KQ-Q36** Ryan Law: «Update: AI Overviews Reduce Clicks by 58%». Ahrefs, 04.02.2026. https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/
- **KQ-Q37** Luke Harsel: «The Most-Cited Domains in AI: A 3-Month Study». Semrush, 10.11.2025. https://www.semrush.com/blog/most-cited-domains-ai/
- **KQ-Q38** Nick Lafferty: «AI Platform Citation Patterns: How ChatGPT, Google AI Overviews, and Perplexity Source Information». Profound, 05.06.2025, ergänzt August 2025. https://www.tryprofound.com/blog/ai-platform-citation-patterns
- **KQ-Q39** BrightEdge: «AI Overview Citations Now 54% from Organic Rankings», 18.09.2025. https://www.brightedge.com/resources/weekly-ai-search-insights/rank-overlap-after-16-months-of-aio
- **KQ-Q40** Cloudflare: «Perplexity is using stealth, undeclared crawlers to evade website no-crawl directives», 04.08.2025. https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/
- **KQ-Q41** The Register: «Perplexity vexed by Cloudflare's claims its bots are bad», 05.08.2025. https://www.theregister.com/2025/08/05/perplexity_vexed_by_cloudflares_claims/

**Schweiz und Datenschutz**

- **KQ-Q42** Netzwoche: «Google bringt KI-Suche in die Schweiz», 26.03.2025. https://www.netzwoche.ch/news/2025-03-26/google-bringt-ki-suche-in-die-schweiz
- **KQ-Q43** blue News, Keystone-SDA: «AI mode in Google Search is coming to Switzerland and Europe», 08.10.2025. https://www.bluewin.ch/en/news/ai-mode-in-google-search-is-coming-to-switzerland-and-europe-2907273.html
- **KQ-Q44** SWI swissinfo.ch, Keystone-SDA: «Two thirds of Swiss have already used ChatGPT or Gemini», 18.03.2025 (Umfrage Comparis mit Innofact). https://swissinfo.ch/eng/science/two-thirds-of-swiss-people-have-already-used-chatgpt-or-gemini/89025811
- **KQ-Q45** Netzwoche: «Drei Viertel der Schweizer Bevölkerung nutzen bereits KI-Chatbots», 02.04.2026 (Umfrage Comparis). https://www.netzwoche.ch/news/2026-04-02/drei-viertel-der-schweizer-bevoelkerung-nutzen-bereits-ki-chatbots
- **KQ-Q46** Pirmin Roos: «KI-Sprachmodelle im Vergleich». SRF Kassensturz Espresso, 16.12.2025 (Test der FHNW). https://www.srf.ch/sendungen/kassensturz-espresso/tests/gadgets-elektronik/ki-sprachmodelle-im-vergleich-chatbot-duell-chatgpt-landet-nur-im-mittelfeld
- **KQ-Q47** Netzwoche: «Sunrise und Perplexity machen gemeinsame Sache», 06.03.2025. https://www.netzwoche.ch/news/2025-03-06/sunrise-und-perplexity-machen-gemeinsame-sache
- **KQ-Q48** EDÖB: «Update: Geltendes Datenschutzgesetz ist auf KI direkt anwendbar», 08.05.2025. https://www.edoeb.admin.ch/de/update-geltendes-datenschutzgesetz-ist-auf-ki-direkt-anwendbar

**Wikipedia und Wikidata**

- **KQ-Q49** Wikipedia (deutsch): «Wikipedia:Relevanzkriterien», Abschnitt Wirtschaftsunternehmen (Version 271668443). https://de.wikipedia.org/wiki/Wikipedia:Relevanzkriterien
- **KQ-Q50** Wikipedia (englisch): «Notability (organizations and companies)» (zuletzt geändert 11.10.2026). https://en.wikipedia.org/wiki/Wikipedia:Notability_(organizations_and_companies)
- **KQ-Q51** Wikidata: «Wikidata:Notability» (zuletzt geändert 01.11.2026). https://www.wikidata.org/wiki/Wikidata:Notability

**Aus Semester 3 zitiert, nicht neu gelesen:** G-Q3 und G-Q14 (Spam-Richtlinien und Änderungsliste, «Google-Grundlagen»), S-Q3 (Snippets, «Titel, Snippet, Struktur»), P-Q1, P-Q12, P-Q13 («Lokal und Profil»).
