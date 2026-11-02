# Technik: crawlen und indexieren · Skript Semester 4

Stand 01.11.2026 · Text-Uni, Semester 4 «KI-Suche und Technik».

> **Worum es geht:** die Technik, über die Google, Bing und KI-Dienste eine kleine Website finden und lesen. `robots.txt`, `noindex` und Snippet-Regeln, die Crawler der grossen Anbieter, Sitemap, Bing und IndexNow, Statuscodes, Weiterleitungen und der Umzug einer Website, JavaScript, Ladezeit, HTTPS, Handy und `llms.txt`. Für statische Websites von KMU mit 5 bis 30 Seiten.
>
> **Gelesen am 01.11.2026, online** (Nummern wie in «Quellen» am Ende):
> TI-Q1 robots.txt, Einführung (10.12.2025) · TI-Q2 robots.txt, Spezifikation (23.10.2026) · TI-Q3 RFC 9309 (September 2022) · TI-Q4 robots-Meta-Tag und X-Robots-Tag (24.03.2026) · TI-Q5 noindex (10.12.2025) · TI-Q6 Übersicht Google-Crawler (12.06.2026) · TI-Q7 Häufige Google-Crawler (30.10.2026) · TI-Q8 Google-Abrufe auf Nutzerwunsch (19.08.2026) · TI-Q9 KI-Funktionen und Website (10.12.2025) · TI-Q10 Google-Leitfaden zu generativen KI-Funktionen (10.07.2026) · TI-Q11 OpenAI-Crawler (ohne Datum) · TI-Q12 OpenAI-Hilfe zur ChatGPT-Suche (ohne Datum) · TI-Q13 Anthropic-Crawler (07.04.2026) · TI-Q14 Perplexity-Crawler (ohne Datum) · TI-Q15 Applebot (04.09.2026) · TI-Q16 Bing Webmaster Guidelines (ohne Datum) · TI-Q17 Bing-Hilfe zu robots.txt (ohne Datum) · TI-Q18 Bing-Hilfe Website hinzufügen (ohne Datum) · TI-Q19 Common Crawl FAQ (ohne Datum) · TI-Q20 Brown u. a. 2020 (GPT-3) · TI-Q21 IndexNow Doku und FAQ (ohne Datum) · TI-Q22 Sitemap erstellen (08.07.2026) · TI-Q23 Blog zu Sitemap-Ping und lastmod (26.06.2023) · TI-Q24 HTTP-Statuscodes (04.02.2026) · TI-Q25 Weiterleitungen (14.04.2026) · TI-Q26 Umzug mit neuen Adressen (20.08.2026) · TI-Q27 Umzug ohne neue Adressen (10.12.2025) · TI-Q28 Search Console Adressänderung (ohne Datum) · TI-Q29 JavaScript-SEO (04.03.2026) · TI-Q30 Vercel und MERJ 2024 · TI-Q31 Resoneo 2026 · TI-Q32 bis TI-Q37 web.dev zu Web Vitals, LCP, INP, CLS, CLS verbessern, Lazy Loading · TI-Q38 Page Experience (22.09.2026) · TI-Q39 Mobile-First-Indexierung (10.12.2025) · TI-Q40 Überlagerungen (10.12.2025) · TI-Q41 llmstxt.org (v2, 10.08.2026) · TI-Q42 John Mueller zu llms.txt (17.06.2025) · TI-Q43 bis TI-Q46 Cloudflare Pages: Weiterleitungen, Ausliefern, Header und Vorschau, Functions.
>
> **Nicht gelesen:** die Bing-Seite «Which crawlers does Bing use» (lädt nur per Skript, auch über einen Abrufdienst kein Text). Die Artikel von John Mueller auf Bluesky im Original; gelesen ist der Bericht von Search Engine Roundtable mit Zitat und Link.
>
> **Nicht gefunden:** ein Satz von Microsoft, dass Bingbot `robots.txt` befolgt; ein Satz von OpenAI und Perplexity mit dem Wort «befolgen» für ihre automatischen Crawler; eine aktuelle Bing-Seite zu einem Umzugs-Werkzeug; eine Angabe von OpenAI, wie viel der ChatGPT-Suche aus Bing stammt; eine begutachtete Studie, ob KI-Crawler JavaScript ausführen. Was dazu steht, ist `[Annahme]` oder als Anbieter-Messung gekennzeichnet.
>
> Herkunft: `[Fakt · Quelle, Datum]`, `[Annahme]`, `[Meinung · Autor]`, `[Vorschlag]`, `[Verweis]`. **`[Regel laut <Anbieter> · Quelle]`** heisst: So steht es beim Anbieter. Ein Fakt über seine Absicht, kein Beleg für Wirkung. Crawler-Namen und KI-Funktionen ändern sich laufend; das Datum in Klammern ist der Stand der Doku laut Anbieter, gelesen am 01.11.2026.

**Boden aus Semester 3.** Was dort steht, gilt hier und wird nur mit der ID zitiert: Erreichbar, Status 200, kein `noindex` für Seiten in der Suche (G1), kein Versprechen zum Rang (G2), keine zweite Domain als Tür (G6), Domain-Geschichte (G13), Datum ehrlich (G19), folgbare Links (S17), Alt-Text und Dateiname (S20, S21), Adresse lesbar (S22), strukturierte Daten (S23 bis S26), kanonisch auf sich selbst (S28), hreflang und keine Sprachweiche (S31 bis S33), Seitenindexierung, Sitemap-Bericht, Core Web Vitals, URL-Prüfung (M7 bis M10), 16 Monate gesichert (M12), Ursache nur mit Ausschluss (M15), Betrieb ist Inhaber (M17).

**Abgrenzung.** Wie KI-Dienste Quellen auswählen und zitieren, steht in «KI-Antworten und Quellen». Wie Text geschrieben sein muss, damit eine KI ihn richtig wiedergibt, in «Zitierfähig schreiben». Dieses Skript regelt den Weg davor: ob ein Crawler die Seite überhaupt holen, lesen und aufnehmen darf und kann.

**Musterbetrieb.** Alle Beispiele nutzen die erfundene Garage Muster in Musterdorf mit der Website `garage-muster.example`. Alle Angaben zu ihr sind erfunden.

---

## 1. Grundbegriffe

- **Crawlen:** Ein Programm (Crawler, Bot) holt eine Adresse ab. **Rendern:** Es führt das JavaScript der Seite aus, wie ein Browser. **Indexieren:** Die Suchmaschine nimmt die Seite in ihren Bestand auf. Google verarbeitet JavaScript-Seiten in diesen drei Schritten. `[Regel laut Google · TI-Q29]`
- **Token:** der Name eines Crawlers in `robots.txt`, etwa `Googlebot` oder `GPTBot`. Manche Token haben keinen eigenen Crawler und steuern nur, wofür Daten verwendet werden (`Google-Extended`, `Applebot-Extended`). `[Regel laut Google · TI-Q7; Regel laut Apple · TI-Q15]`
- **Drei Zwecke.** Dieses Skript trennt Crawler nach Zweck: **Suche** (Index für Treffer und Antworten mit Quelle), **Training** (Daten für künftige Sprachmodelle) und **Abruf auf Nutzerwunsch** (ein Mensch fragt, der Dienst holt die Seite jetzt). Die Betreiber trennen so selbst, mit eigenen Token je Zweck. `[Fakt · TI-Q7; TI-Q8; TI-Q11; TI-Q13; TI-Q14; TI-Q15]`
- **Statuscode:** die dreistellige Antwort des Servers, etwa 200 (in Ordnung), 301 (dauerhaft umgezogen), 404 (nicht gefunden). `[Regel laut Google · TI-Q24]`
- **Kanonische Adresse:** die eine Adresse einer Seite, die in der Suche erscheinen soll (S-Q14 in Semester 3). `[Verweis]`

---

## 2. robots.txt

### 2.1 Was die Regeln sagen

`[Regel laut Google · TI-Q2, 23.10.2026]`

- **Ort:** im obersten Verzeichnis, also `https://garage-muster.example/robots.txt`. Sie gilt nur für genau diesen Host, dieses Protokoll und diesen Port. Jede Subdomain braucht eine eigene.
- **Grösse:** Google liest höchstens 500 KiB, der Rest wird ignoriert. Der Standard verlangt von Crawlern, mindestens 500 KiB zu lesen. `[Fakt · TI-Q3]`
- **Felder:** Google versteht `user-agent`, `allow`, `disallow` und `sitemap`. Andere Felder wie `crawl-delay` unterstützt Google nicht.
- **Schreibweise:** Feldnamen und Token sind unabhängig von Gross- und Kleinschreibung, Pfade nicht. `*` steht für beliebig viele Zeichen, `$` für das Ende der Adresse.
- **Welche Gruppe gilt:** Google nimmt nur die genaueste Gruppe für seinen Crawler. Gibt es eine Gruppe für `Googlebot`, gilt die Gruppe `*` für ihn nicht mehr. Bing macht es gleich: Findet Bingbot eine eigene Gruppe, ignoriert er die allgemeine. `[Regel laut Bing · TI-Q17]`
- **Welche Regel gilt:** die genaueste, also mit dem längsten passenden Pfad. Bei Gleichstand die weniger strenge.
- **Zwischenspeicher:** in der Regel bis 24 Stunden. Bing schreibt «mindestens einige Stunden». `[Regel laut Bing · TI-Q17]`
- **Fehler beim Abruf der Datei:** 4xx (ausser 429) heisst für Google «keine Regeln», alles erlaubt. 5xx heisst: 12 Stunden lang crawlt Google die Website nicht, danach bis 30 Tage mit der letzten guten Fassung. Eine `robots.txt`, die mit 5xx antwortet, kann also die ganze Website aus dem Crawl nehmen.

### 2.2 Grenzen: kein Schutz und kein noindex

- **Kein Schutz.** Die Regeln «sind keine Form der Zugriffsberechtigung». Wer Pfade in `robots.txt` auflistet, macht sie öffentlich auffindbar. `[Fakt · TI-Q3, RFC 9309, Abschnitte 1 und 5]`
- **Nicht jeder folgt.** Nicht alle Suchmaschinen unterstützen die Regeln; der Crawler entscheidet, ob er sich daran hält. `[Regel laut Google · TI-Q1]` Abrufe auf Nutzerwunsch ignorieren `robots.txt` bei Google und Perplexity in der Regel; bei OpenAI «gelten die Regeln möglicherweise nicht». `[Regel laut Google · TI-Q8; Regel laut Perplexity · TI-Q14; Regel laut OpenAI · TI-Q11]`
- **Kein noindex.** `robots.txt` ist laut Google kein Mittel, eine Seite aus Google herauszuhalten. Eine gesperrte Seite kann trotzdem mit Adresse erscheinen, wenn andere auf sie verlinken. Dafür gibt es `noindex` oder ein Passwort. `[Regel laut Google · TI-Q1; TI-Q5]` Bing sagt dasselbe: `robots.txt` steuert das Crawlen, nicht die Aufnahme. `[Regel laut Bing · TI-Q16]`
- **Folge:** Was nicht öffentlich sein darf (Vorschau, Offerten, Kundendaten), steht hinter einem Passwort, nie nur hinter `robots.txt`. `[Annahme, aus TI-Q1 und TI-Q3]`

### 2.3 Beispiel: Garage Muster (erfunden)

```
# robots.txt für garage-muster.example (Muster, erfunden)
# Crawler-Liste geprüft: 2026-11-01
# Entscheid KI-Training: gesperrt, Betrieb am 2026-10-28 (erfunden)

User-agent: *
Allow: /

User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
Disallow: /

Sitemap: https://garage-muster.example/sitemap.xml
```

- Mehrere `User-agent`-Zeilen über einer Regel bilden eine Gruppe. `[Fakt · TI-Q3]`
- Alle Such-Crawler und Abrufe fallen unter `*` und dürfen alles. Die fünf Token für Training sind gesperrt. `[Annahme: Auslegung nach TI-Q2]`
- Ob der Betrieb Training erlaubt oder sperrt, entscheidet er selbst. Beides ist vertretbar. Eine Sperre ändert nichts an der Aufnahme in Google und Apple. `[Regel laut Google · TI-Q7; Regel laut Apple · TI-Q15; Wertung: Meinung · Text-Uni]`

---

## 3. noindex, X-Robots-Tag, nosnippet, max-snippet

`[Regel laut Google · TI-Q4, 24.03.2026; TI-Q5, 10.12.2025]`

- **`noindex`** als `<meta name="robots" content="noindex">` im HTML oder als HTTP-Kopfzeile `X-Robots-Tag: noindex`. Google entfernt die Seite, sobald es sie crawlt und die Regel sieht, auch wenn andere Seiten auf sie verlinken.
- **Die Seite muss crawlbar sein.** Ist sie in `robots.txt` gesperrt, sieht Google `noindex` nie, und die Adresse kann bleiben.
- **Dauer:** Bei weniger wichtigen Seiten kann es Monate dauern, bis Google wiederkommt. Die URL-Prüfung kann einen neuen Crawl anstossen (M10).
- **`X-Robots-Tag`** kann dieselben Regeln wie das Meta-Tag. Es ist der Weg für PDF und Bilder, die kein Meta-Tag haben.
- **`nosnippet`:** kein Textausschnitt und keine Videovorschau im Treffer. Laut Google gilt das auch für KI-Übersichten und KI-Modus: Der Inhalt wird dort nicht als direkte Eingabe verwendet.
- **`max-snippet:[Zahl]`:** begrenzt den Ausschnitt auf so viele Zeichen und damit auch, wie viel Inhalt in KI-Übersichten und KI-Modus einfliesst. `0` wirkt wie `nosnippet`, `-1` lässt Google wählen.
- **`data-nosnippet`** auf `span`, `div` oder `section` nimmt einzelne Stellen aus dem Ausschnitt.
- **Widerspruch:** Die strengere Regel gilt. `nosnippet` schlägt `max-snippet:50`.
- **Andere Suchmaschinen** lesen `noindex` teils anders. `[Regel laut Google · TI-Q5]`

Was andere Anbieter dazu schreiben:

- **Bing:** `noindex` nimmt eine Adresse aus der Bing-Suche, aus Copilot und aus Ergebnissen der Grounding-Schnittstelle. `nosnippet` und `data-nosnippet` verhindern Textausschnitte und können die Qualität der Zitate in Copilot senken. `noarchive` verhindert die Verwendung in Copilot-Antworten; `nocache` erlaubt dort nur Adresse, Titel und Ausschnitt. `[Regel laut Bing · TI-Q16]`
- **Apple:** Wer nicht will, dass Inhalte in Antworten von Siri und Apple-Suche auf allgemeine Wissensfragen einfliessen, setzt `nosnippet` auf diese Inhalte. `[Regel laut Apple · TI-Q15]`

**Was daraus folgt.** Für eine KMU-Website, die gefunden werden will, gilt: keine Snippet-Sperren auf Seiten, die in Suche und KI-Antworten erscheinen sollen. `noindex` nur für Danke-Seiten, Testseiten und Vorschau (G1). `[Annahme, aus TI-Q4 und TI-Q16]`

**Vorschau, bei jedem Hoster.** Die Vorschau trägt `noindex` per Kopfzeile `X-Robots-Tag` oder Meta-Tag und ist, wo möglich, durch einen Zugang geschützt. `robots.txt` sperrt sie nicht, sonst liest Google das `noindex` nicht (2.2, TI8, TI10). Den Hoster wählt web-uni (WP2). `[Regel laut Google · TI-Q1; TI-Q5; Entscheid · Studio, 02.11.2026]`

**Beispiel Cloudflare Pages.** Jede Vorschau-Fassung mit zufälligem Hash (`<hash>.<projekt>.pages.dev`) bekommt von Cloudflare selbst `X-Robots-Tag: noindex`. `[Fakt · TI-Q45, 12.10.2026]` Die Adresse `<projekt>.pages.dev` der Hauptfassung ist davon nicht ausdrücklich erfasst; Cloudflare zeigt als Beispiel eine Regel in der Datei `_headers`, die dort `noindex` setzt. `[Fakt · TI-Q45, 25.08.2026]` Ohne diese Regel liegt dieselbe Website unter zwei Adressen offen. `[Annahme]`

```
https://:project.pages.dev/*
  X-Robots-Tag: noindex
```

---

## 4. Crawler je Betreiber

### 4.1 Übersicht

Spalte «robots.txt»: Was der Betreiber verspricht, mit seinen Worten. Spalte «Stand»: Datum der Doku laut Anbieter, gelesen am 01.11.2026.

| Betreiber | Token | Zweck | robots.txt laut Betreiber | Quelle, Stand |
|---|---|---|---|---|
| Google | `Googlebot` | Suche, auch Discover, Bilder, Video, News | Ja: häufige Crawler befolgen `robots.txt` beim automatischen Crawlen «immer» | TI-Q6, 12.06.2026; TI-Q7, 30.10.2026 |
| Google | `Google-Extended` | Training künftiger Gemini-Modelle und Grounding in Gemini-Apps und Vertex AI; kein eigener Crawler | Token nur zur Steuerung; ändert weder Aufnahme in die Google-Suche noch Rang | TI-Q7, 30.10.2026 |
| Google | Abrufe auf Nutzerwunsch, z. B. `Google-Agent` | Abruf für einen Menschen | ignorieren `robots.txt` «in der Regel» | TI-Q8, 19.08.2026 |
| OpenAI | `OAI-SearchBot` | Suche in ChatGPT | OpenAI «nutzt» das Token, damit Websites steuern können; Änderung wirkt nach etwa 24 Stunden. Das Wort «befolgen» steht nicht. | TI-Q11, ohne Datum |
| OpenAI | `GPTBot` | Training | Sperre «zeigt an», dass Inhalte nicht für Training verwendet werden sollen | TI-Q11, ohne Datum |
| OpenAI | `ChatGPT-User` | Abruf auf Nutzerwunsch | Regeln «gelten möglicherweise nicht»; nicht für die Aufnahme in die Suche verwendet | TI-Q11, ohne Datum |
| Anthropic | `ClaudeBot` | Training | Ja: Die Bots «respektieren» Sperren und halten sich an `robots.txt`, auch an `Crawl-delay` | TI-Q13, 07.04.2026 |
| Anthropic | `Claude-SearchBot` | Suche | Ja, gleiche Aussage | TI-Q13, 07.04.2026 |
| Anthropic | `Claude-User` | Abruf auf Nutzerwunsch | Ja, gleiche Aussage; Sperre kann Sichtbarkeit bei Suchen von Nutzern senken | TI-Q13, 07.04.2026 |
| Perplexity | `PerplexityBot` | Suche; nicht für Training | Kein ausdrückliches Versprechen; Perplexity empfiehlt, ihn zu erlauben; Änderung bis 24 Stunden | TI-Q14, ohne Datum |
| Perplexity | `Perplexity-User` | Abruf auf Nutzerwunsch; nicht für Training | ignoriert `robots.txt` «in der Regel» | TI-Q14, ohne Datum |
| Apple | `Applebot` | Suche in Spotlight, Siri, Safari; kann auch Training und Kontext für KI-Antworten liefern | Ja, für Regeln an `Applebot`; ohne eigene Gruppe gelten die Regeln für `Googlebot`; kein `Crawl-delay` | TI-Q15, 04.09.2026 |
| Apple | `Applebot-Extended` | Training; crawlt selbst nicht | Token nur zur Steuerung; Sperre nimmt Seiten nicht aus der Suche | TI-Q15, 04.09.2026 |
| Microsoft | `Bingbot` | Bing-Suche, Copilot, Grounding-Schnittstelle | Kein Satz «befolgt» gefunden; Bing beschreibt, wie Bingbot die Datei liest und Gruppen wählt | TI-Q16; TI-Q17, beide ohne Datum |
| Common Crawl | `CCBot` | offenes Archiv des Webs | Ja: prüft `robots.txt` zuerst und befolgt `Crawl-delay` | TI-Q19, ohne Datum |

Alle Zeilen: `[Regel laut <Betreiber> · Quelle in der Zeile]`. Das Versprechen eines Betreibers ist kein Beleg, dass sein Crawler sich daran hält. `[Annahme]`

### 4.2 Was die Tabelle bedeutet

- **Google-Extended steuert keine KI-Übersichten.** Google nennt für KI-Übersichten und KI-Modus nur die Mittel der Suche: `robots.txt` für Googlebot, `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex`. Google-Extended verweist Google auf «einige andere Systeme» von Google. `[Regel laut Google · TI-Q9, 10.12.2025]` Wer Google-Extended sperrt, bleibt also in KI-Übersichten sichtbar; wer dort fehlen will, muss Snippets sperren und verliert sie dann auch im normalen Treffer. `[Annahme, aus TI-Q4 und TI-Q9]`
- **Google plant ein neues Signal.** Google will Anfang 2027 das gemeinsame Signal AIPREF für Trainings-Wünsche unterstützen, mit `user-agent: __usage_ai-training`. `[Regel laut Google · TI-Q7, 30.10.2026]` Bis dahin gilt Google-Extended. Neu prüfen im Januar 2027. `[Vorschlag]`
- **OpenAI trennt sauber.** Jede Einstellung ist unabhängig: Man kann `OAI-SearchBot` erlauben und `GPTBot` sperren. Sind beide erlaubt, nutzt OpenAI eventuell einen Crawl für beides. `[Regel laut OpenAI · TI-Q11]` Für die Aufnahme in die ChatGPT-Suche verlangt OpenAI zusätzlich, dass Hoster oder CDN die veröffentlichten IP-Adressen von `OAI-SearchBot` durchlassen. `[Regel laut OpenAI · TI-Q12]`
- **Anthropic warnt vor IP-Sperren.** Eine Sperre über IP-Adressen ist laut Anthropic kein verlässlicher Ausstieg, weil der Crawler dann `robots.txt` nicht mehr lesen kann. `[Regel laut Anthropic · TI-Q13]`
- **Applebot fällt auf Googlebot zurück.** Hat `robots.txt` keine Gruppe für Applebot, aber eine für Googlebot, folgt Applebot dieser. `[Regel laut Apple · TI-Q15]` Wer Googlebot etwas verbietet, verbietet es damit oft auch Apple. `[Annahme]`
- **Bing rät von eigenen Gruppen je Bot ab.** Wer eine Gruppe für Bingbot anlegt, muss alle allgemeinen Regeln dort wiederholen; vergessene Regeln sind laut Bing oft die Ursache von Crawl-Problemen. `[Regel laut Bing · TI-Q17]`
- **Common Crawl wird für Training genutzt.** Die Seite von Common Crawl selbst nennt kein KI-Training. `[Fakt · TI-Q19]` Für GPT-3 stammten 60 % der Trainingsbeispiele aus gefiltertem Common Crawl. `[Fakt · TI-Q20, Tabelle 2.2]` Eine Sperre von `CCBot` wirkt darum auf Training durch Dritte. `[Annahme]`
- **Abrufe auf Nutzerwunsch lassen sich kaum sperren.** Drei von vier Betreibern sagen, dass `robots.txt` dafür nicht oder nicht sicher gilt. `[Fakt · TI-Q8; TI-Q11; TI-Q14]` Für KMU ist das meist erwünscht: Ein Mensch fragt nach dem Betrieb, der Dienst liest die Seite. `[Meinung · Text-Uni]`
- **Namen ändern sich.** OpenAI hat seine Doku von `platform.openai.com` auf `developers.openai.com` verlegt (Weiterleitung 301 am 01.11.2026), Google ersetzt `Google-NotebookLM` durch `Google-GeminiNotebook`. `[Fakt · eigener Abruf 01.11.2026; TI-Q8]` Die Liste gehört alle 6 Monate neu geprüft, mit Datum in `robots.txt` (TI6). `[Annahme]`

---

## 5. Sitemap

`[Regel laut Google · TI-Q22, 08.07.2026]`

- **Inhalt:** die kanonischen Adressen, die in der Suche erscheinen sollen, vollständig und absolut (`https://…`). Google crawlt sie so, wie sie dastehen.
- **Format:** XML in UTF-8. Höchstens 50 000 Adressen und 50 MB unkomprimiert je Datei.
- **Ort:** an der Wurzel. Eine Sitemap gilt sonst nur für Adressen unter ihrem Ordner, ausser sie ist in Search Console eingereicht.
- **`lastmod`:** Google nutzt es nur, wenn es «durchgehend und nachprüfbar» stimmt. Gemeint ist die letzte wesentliche Änderung: Hauptinhalt, strukturierte Daten oder Links. Ein neues Copyright-Jahr ist keine. `[Regel laut Google · TI-Q22]` Wer lastmod falsch setzt, dem glaubt Google irgendwann nicht mehr. Bei Seiten, deren Änderungsdatum unsicher ist, darf lastmod fehlen. `[Regel laut Google · TI-Q23, 26.06.2023]`
- **`priority` und `changefreq`** ignoriert Google.
- **Einreichen:** im Sitemaps-Bericht der Search Console (M8), über die Schnittstelle oder mit einer Zeile `Sitemap:` in `robots.txt`. Der frühere «Ping» an Google funktioniert seit Ende 2023 nicht mehr. `[Regel laut Google · TI-Q22; TI-Q23]`
- **Keine Garantie:** Eine Sitemap ist «nur ein Hinweis». `[Regel laut Google · TI-Q22]`
- **Bing** verlangt dasselbe: nur kanonische Adressen, gelöschte und weitergeleitete Adressen rasch entfernen, `lastmod` genau. `[Regel laut Bing · TI-Q16]`
- **Common Crawl** liest Sitemaps, die in `robots.txt` stehen. `[Fakt · TI-Q19]`

**Was daraus folgt.** Die Sitemap einer KMU-Website enthält genau die Seiten, die mit 200 antworten, kein `noindex` tragen und auf sich selbst kanonisch sind. Weder die 404-Seite noch eine Danke-Seite noch eine Adresse, die weiterleitet. `[Annahme, aus TI-Q22 und TI-Q16]` `lastmod` wechselt nur zusammen mit dem sichtbaren Datum (G19). `[Verweis]`

---

## 6. Bing Webmaster Tools und IndexNow

### 6.1 Bing Webmaster Tools

- Eine Website lässt sich mit Datei, Meta-Tag oder DNS-Eintrag bestätigen, oder durch **Import aus der Google Search Console**: Bing liest die bestätigten Websites samt Sitemaps und bestätigt sie selbst. Bis 100 Websites je Import. `[Regel laut Bing · TI-Q18]`
- Ob Bing heute noch ein eigenes Werkzeug für den Umzug hat, konnte ich nicht belegen. `[Fakt · eigene Suche, 01.11.2026, ohne aktuelle Bing-Seite]`

### 6.2 IndexNow

- Ein offenes Verfahren, mit dem eine Website neue, geänderte und gelöschte Adressen meldet. Teilnehmer laut FAQ: Amazon, Bing, Naver, Seznam.cz, Yandex, Yep. Google steht nicht auf der Liste. `[Fakt · TI-Q21]`
- **Schlüssel:** eine Textdatei `<schlüssel>.txt` an der Wurzel, Inhalt gleich dem Schlüssel, 8 bis 128 Zeichen aus Buchstaben, Ziffern und Bindestrich. `[Regel laut IndexNow · TI-Q21]`
- **Was melden:** nur, was sich geändert hat, nicht die ganze Website; nach einem Umzug alle Adressen. Dieselbe Adresse nicht mehrmals am Tag ohne echte Änderung. `[Regel laut IndexNow · TI-Q21]`
- **Antwort 200** heisst nur «empfangen», nicht «aufgenommen». `[Regel laut IndexNow · TI-Q21]`

### 6.3 Warum Bing für KI-Dienste zählt

- **Copilot beruht auf dem Bing-Index.** Bing schreibt, Bing-Suche und Copilot nutzten dieselbe Grundlage aus Crawlen, Indexieren und Rang. Die Richtlinien gelten auch für die Grounding-Schnittstelle, über die Antworten mit Quellen entstehen. Bing empfiehlt IndexNow, damit Copilot keine veralteten Adressen zitiert. `[Regel laut Bing · TI-Q16]`
- **ChatGPT nutzt Suchpartner.** OpenAI schreibt, die ChatGPT-Suche arbeite «manchmal» mit anderen Suchanbietern und schicke ihnen umformulierte Anfragen. Für deren Datenschutz verweist OpenAI auf Microsoft und Shopify. `[Fakt · TI-Q12]` Dass Treffer aus dem Bing-Index in ChatGPT-Antworten einfliessen, ist darum naheliegend, aber von OpenAI nicht beziffert. `[Annahme]`
- **Für Claude und Perplexity** nennt die gelesene Doku eigene Such-Crawler (Tabelle 4.1), keinen Index eines Dritten. `[Fakt · TI-Q13; TI-Q14]`
- **Folge:** Bing Webmaster Tools einzurichten kostet wenig und kann die Sichtbarkeit in Copilot und wohl in ChatGPT stützen. `[Annahme]`

---

## 7. Statuscodes

`[Regel laut Google · TI-Q24, 04.02.2026]`

| Code | Bedeutung | Was Google tut |
|---|---|---|
| 200 | in Ordnung | Inhalt geht weiter zur Indexierung; aufgenommen ist er damit nicht sicher |
| 301, 308 | dauerhaft weitergeleitet | starkes Signal, dass das Ziel die kanonische Adresse ist |
| 302, 303, 307 | vorübergehend weitergeleitet | schwaches Signal; die alte Adresse bleibt eher im Treffer `[Regel laut Google · TI-Q25]` |
| 404, 410 | nicht gefunden, entfernt | gleich behandelt: aus dem Index genommen, seltener gecrawlt |
| 429 | zu viele Anfragen | wie ein Serverfehler |
| 5xx | Serverfehler | Google crawlt langsamer; bleibt der Fehler, fallen die Adressen aus dem Index |

- **Weiterleitungen:** Google folgt bis 10 Sprüngen. Werkzeuge zur URL-Prüfung folgen keinem. `[Regel laut Google · TI-Q24]`
- **Bing:** 301 für dauerhafte Änderungen, 302 nur für sehr kurze, unter 2 Tagen. Weiterleiten statt nur `canonical` setzen. Gelöschte Inhalte mit 404 beantworten. `[Regel laut Bing · TI-Q16]`
- **Soft-404:** eine Seite mit Status 200, deren Inhalt nach Fehler aussieht, etwa leer oder mit Fehlermeldung. Search Console meldet sie eigens. `[Regel laut Google · TI-Q24]`
- **Die Falle bei Cloudflare Pages:** Fehlt eine Datei `404.html` an der Wurzel, nimmt Pages eine Single-Page-App an und liefert für jede unbekannte Adresse die Startseite. `[Fakt · TI-Q44, 10.10.2026]` Das erzeugt Soft-404 in grosser Zahl. `[Annahme, aus TI-Q24 und TI-Q44]`
- **Fehlerseite:** Eine gute 404-Seite antwortet mit Status 404, sagt in einem Satz, dass die Seite fehlt, und verlinkt Startseite und Kontakt. `[Annahme]`

---

## 8. Weiterleitungen und Umzug der Website

Ein Betrieb kann seinen Anbieter wechseln und die Website mitnehmen. Ob die Sichtbarkeit den Umzug übersteht, hängt an den Weiterleitungen. `[Annahme]`

### 8.1 Drei Arten von Umzug

| Art | Beispiel | Was Google dazu hat |
|---|---|---|
| **Neuer Hoster, gleiche Adressen** | Website zieht von einem alten Server auf Cloudflare Pages, Adressen bleiben | eigener Leitfaden ohne Weiterleitungen, TI-Q27 |
| **Neue Adressen, gleiche Domain** | aus `/index.php?id=3` wird `/reifenwechsel` | Leitfaden für Umzug mit neuen Adressen, TI-Q26 |
| **Neue Domain** | von `garage-muster-alt.example` auf `garage-muster.example` | wie oben, dazu das Werkzeug «Adressänderung», TI-Q28 |

`[Regel laut Google · TI-Q26; TI-Q27; TI-Q28]` Oft kommt alles zusammen: neuer Hoster, neue Adressen, manchmal neue Domain. Google rät, möglichst eins nach dem anderen zu ändern, etwa zuerst die Domain, dann den Aufbau. Kleine und mittlere Websites zieht man auf einmal um. `[Regel laut Google · TI-Q26]`

### 8.2 Weiterleitungen laut Google und Bing

- **Dauerhaft heisst 301 oder 308,** auf dem Server. Danach in dieser Reihenfolge: sofortiges `meta refresh` (0 Sekunden, gilt als dauerhaft), JavaScript-Weiterleitung, als letzter Ausweg ein Link mit Hinweis. Ein verzögertes `meta refresh` gilt als vorübergehend. `[Regel laut Google · TI-Q25, 14.04.2026]`
- **Dauerhafte Weiterleitungen verlieren keinen PageRank.** `[Regel laut Google · TI-Q26]`
- **302 nur für sehr kurz,** laut Bing unter 2 Tagen. `[Regel laut Bing · TI-Q16]`
- **Achtung Standardwert:** Eine Zeile in der Cloudflare-Datei `_redirects` ohne Code liefert 302. `[Fakt · TI-Q43, 25.08.2026]` Jede Zeile trägt darum ausdrücklich `301`. `[Annahme]`

### 8.3 Die Weiterleitungsliste, 1:1

Google verlangt eine Zuordnung jeder alten Adresse zu ihrer neuen. Mehrere alte Seiten dürfen auf eine neue zeigen, wenn ihr Inhalt dort zusammengeführt ist. `[Regel laut Google · TI-Q26]`

**Woher die alten Adressen kommen** `[Vorschlag]`:

1. Alte Sitemap, als Datei gesichert vor dem Umzug.
2. Crawl der alten Website mit einem Werkzeug, das Links folgt.
3. Leistungsbericht der Search Console, 16 Monate, nach Seite (M12). Jede Seite mit Klicks oder Impressionen braucht eine Zeile.
4. Adressen, die der Betrieb selbst verteilt hat: Unternehmensprofil, Verzeichnisse, Flyer, QR-Codes, Mail-Signaturen, Anzeigen.
5. Varianten: mit und ohne `www`, `http` und `https`, mit und ohne Schrägstrich am Ende, alte Parameter wie `?id=3`.

**Spalten** `[Vorschlag]`: alte Adresse; neue Adresse; Status (301, 404 oder 410); wo umgesetzt (`_redirects`, Funktion, Regel beim Domain-Anbieter); Grund in drei Wörtern.

**Ziel passend wählen.** Viele alte Adressen auf die neue Startseite zu leiten, kann Google als Soft-404 werten. `[Regel laut Google · TI-Q26]` Inhalte ohne Nachfolger antworten mit 404 oder 410. `[Regel laut Google · TI-Q26; Regel laut Bing · TI-Q16]` Arbeitsregel: Höchstens die alte Startseite und eine alte Übersichtsseite zeigen auf die neue Startseite. `[Annahme]`

### 8.4 Keine Ketten

- Google folgt bis 10 Sprüngen, empfiehlt aber, direkt aufs Ziel zu leiten. Geht das nicht, höchstens etwa 3 Sprünge, nie 5. `[Regel laut Google · TI-Q26]`
- **Typische Ketten nach einem Relaunch** `[Annahme]`:
  - Alte Weiterleitungen eines früheren Umzugs zeigen noch auf Adressen, die jetzt selbst weiterleiten.
  - `http://www.` → `https://www.` → `https://` → neue Adresse: drei Sprünge, wo einer reicht.
  - Das Ziel ist `/kontakt.html`, der Hoster leitet aber selbst auf `/kontakt` weiter. Cloudflare Pages macht das bei jeder `.html`-Adresse. `[Fakt · TI-Q44]`
- **Regel:** Jede Zeile der Liste wird nach dem Umzug abgerufen. Ergebnis je Zeile: genau ein Sprung mit 301 oder 308, dann 200 auf dem Ziel aus der Liste. `[Annahme]`

### 8.5 Was der Hoster können muss

Bevor ein neuer Hoster feststeht, prüft man, ob er jede Art alter Adresse weiterleiten kann. `[Annahme]` Beispiel Cloudflare Pages, Datei `_redirects` `[Fakt · TI-Q43, 25.08.2026]`:

- **Keine Parameter.** Abfragen wie `?id=3` werden in der Quelle nicht ausgewertet. Alte CMS-Adressen wie `/index.php?id=3` brauchen eine kleine Funktion (Pages Functions) oder eine Regel auf Ebene der Domain.
- **Keine Domain in der Quelle.** Weiterleitungen von einer anderen Domain gehen nicht über `_redirects`.
- **Grenzen:** 2000 feste und 100 dynamische Weiterleitungen, 1000 Zeichen je Zeile. Für KMU reicht das. `[Annahme]`
- **Reihenfolge:** Bei gleicher Quelle gilt die oberste Zeile. Weiterleitungen gelten auch, wenn unter der alten Adresse noch eine Datei liegt.
- **Functions:** Für Adressen, die eine Funktion bearbeitet, gilt `_redirects` nicht. Mit `_routes.json` legt man fest, welche Adressen die Funktion überhaupt aufrufen. `[Fakt · TI-Q43; TI-Q46, 18.09.2026]`

### 8.6 Ablauf mit Fristen

`[Vorschlag, gestützt auf TI-Q26 bis TI-Q28]`

| Wann | Schritt | Beleg |
|---|---|---|
| 4 Wochen vorher | Alte Adressen sammeln (8.3), 16 Monate Search Console sichern (M12), Liste anlegen | M12; TI-Q26 |
| 2 Wochen vorher | Neue Website als Vorschau mit `noindex`; Liste gegen die Vorschau prüfen: jedes Ziel liefert 200 | TI-Q27: Testkopie mit `noindex` |
| 1 Woche vorher | Bei neuem Hoster: TTL der DNS-Einträge auf wenige Stunden senken, mindestens 1 Woche vor dem Umzug | TI-Q27 |
| 1 Woche vorher | Bei neuer Domain: alte und neue Domain in Search Console bestätigen, alle Varianten (`www`, ohne, `http`, `https`) | TI-Q26; TI-Q28 |
| Umzugstag | Weiterleitungen aktiv; `noindex` und Zugangsschutz der Vorschau entfernen (eine Sperre in `robots.txt` gibt es nach TI10 nicht); Bestätigungsdatei oder -tag der Search Console mitnehmen | TI-Q26; TI-Q27 |
| Umzugstag | Neue Sitemap einreichen; eine Sitemap mit den alten Adressen behalten, damit Google die Weiterleitungen findet | TI-Q26 |
| Umzugstag | Bei neuer Domain: Adressänderung in Search Console | TI-Q28 |
| Umzugstag | Bing: Sitemap einreichen; alle neuen Adressen über IndexNow melden | TI-Q16; TI-Q21 |
| Erste Woche | Interne Links, `canonical`, `hreflang` und strukturierte Daten zeigen auf neue Adressen; Unternehmensprofil, Verzeichnisse und Anzeigen umstellen; wichtige fremde Websites um neuen Link bitten | TI-Q26 |
| Nach 1, 4 und 12 Wochen | Jede Zeile der Liste abrufen (8.4); Seitenindexierung (M7) und Sitemap (M8) prüfen; alter Server: läuft, bis dort kein Verkehr mehr ankommt | TI-Q26; TI-Q27; Termine: Annahme |

### 8.7 Search Console: Adressänderung

`[Regel laut Google · TI-Q28]`

- **Nur bei neuer Domain oder Subdomain.** Nicht für `http` zu `https`, nicht für `www` zu ohne, nicht für neue Pfade auf derselben Domain, nicht für einen neuen Hoster mit gleichen Adressen.
- **Voraussetzung:** Inhaber beider Properties mit demselben Google-Konto; 301 von der alten auf die neue Startseite. Google prüft einige Seiten, bevor die Meldung durchgeht.
- **Alle Varianten** der alten Domain einreichen, auch ungenutzte. `[Regel laut Google · TI-Q26; TI-Q28]`
- **Wirkung:** 180 Tage lang bevorzugt Google den Crawl der neuen Website und überträgt Signale. Die Meldung lässt sich in dieser Zeit zurückziehen.

### 8.8 Wie lange behalten

- Weiterleitungen «so lange wie möglich, in der Regel mindestens 1 Jahr». `[Regel laut Google · TI-Q26, 20.08.2026]`
- Mit Adressänderung: mindestens 180 Tage, länger, solange alte Adressen noch Besuche aus der Google-Suche haben; die alte Domain mindestens 1 Jahr registriert lassen. `[Regel laut Google · TI-Q28]`
- **Arbeitsregel:** Weiterleitungen und alte Domain bleiben, solange alte Adressen Klicks, Links oder gedruckte Verweise haben, mindestens 1 Jahr. Das Datum «behalten bis» steht in der Liste. `[Annahme]`
- **Domain gehört dem Betrieb.** Ist die Domain auf den Anbieter registriert, wird jeder Wechsel des Anbieters zum Domainwechsel. Die Domain gehört darum auf den Namen des Betriebs, wie Search Console (M17). `[Annahme]`

### 8.9 Was sich nach dem Umzug zeigt

- Bei mittleren Websites kann es «einige Wochen oder länger» dauern, bis Google die neuen Adressen zeigt. Die Sichtbarkeit kann schwanken und sollte sich dann setzen. `[Regel laut Google · TI-Q26]`
- Nach einem Hosterwechsel kann die Crawl-Rate kurz sinken und in den folgenden Tagen wieder steigen. `[Regel laut Google · TI-Q27]`
- Warnungen zu Weiterleitungen in der alten Sitemap sind erwartet. `[Regel laut Google · TI-Q26]`
- Ein Rückgang nach dem Umzug ist zuerst ein Fall für M15: Saison, Updates und Technik ausschliessen. `[Verweis M15]`

### 8.10 Beispiel: Garage Muster zieht um (erfunden)

Alte Website auf einem PHP-System, neue statisch auf Cloudflare Pages, gleiche Domain.

| Alte Adresse | Neue Adresse | Status | Umgesetzt mit | Grund |
|---|---|---|---|---|
| `/index.php` | `/` | 301 | Funktion | alte Startseite |
| `/index.php?id=3` | `/reifenwechsel` | 301 | Funktion | gleiche Leistung |
| `/index.php?id=4` | `/service-und-reparatur` | 301 | Funktion | gleiche Leistung |
| `/leistungen.html` | `/` | 301 | `_redirects` | Übersicht steht neu auf der Startseite |
| `/kontakt.html` | `/kontakt` | 301 | `_redirects` | gleiche Seite |
| `/anfahrt.html` | `/kontakt` | 301 | `_redirects` | Anfahrt steht neu auf der Kontaktseite |

Die drei Adressen mit `index.php` laufen über eine Funktion, weil `_redirects` Parameter nicht auswertet. `[Fakt · TI-Q43; Umsetzung mit Funktion: Annahme]` Die Zeile `/kontakt.html` steht ausdrücklich in `_redirects`, damit der Code sicher 301 ist; welchen Code Pages bei der eigenen `.html`-Weiterleitung sendet, nennt die Doku nicht. `[Fakt · TI-Q44, nicht erwähnt]`

---

## 9. JavaScript und Rendern

- **Google rendert.** Seiten mit Status 200 kommen in eine Warteschlange zum Rendern, wenn kein `noindex` sie ausschliesst. Das dauert Sekunden oder länger. `[Regel laut Google · TI-Q29, 04.03.2026]`
- **Google rät trotzdem zu fertigem HTML.** Rendern auf dem Server oder vorab sei «weiterhin eine gute Idee», weil die Website schneller wird «und nicht alle Bots JavaScript ausführen können». `[Regel laut Google · TI-Q29]` Im Leitfaden zu KI-Funktionen: Google kann Inhalt in JavaScript verarbeiten, solange er nicht gesperrt ist. `[Regel laut Google · TI-Q10]`
- **Links nur als `<a href>`.** Andere Links findet Google nicht (S17). `noindex` nicht per Skript entfernen wollen: Sieht Google `noindex` im HTML, rendert es eventuell gar nicht. `[Regel laut Google · TI-Q29]`
- **Bing** rät, wichtigen Inhalt nicht hinter Rendern im Browser zu verstecken. Was Bing nicht verlässlich rendern kann, wird eventuell nicht aufgenommen und nicht für Grounding gewählt. `[Regel laut Bing · TI-Q16]`
- **Apple rendert.** Applebot kann die Seite in einem Browser darstellen; dafür dürfen JavaScript und CSS nicht gesperrt sein. `[Regel laut Apple · TI-Q15]`
- **KI-Crawler rendern nach Messungen meist nicht.**
  - Vercel und MERJ werteten Ende 2024 Abrufe im Netz von Vercel aus (ein Monat: 569 Mio. von GPTBot, 370 Mio. von Claude, 24,4 Mio. von PerplexityBot). GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot und PerplexityBot führten kein JavaScript aus. ChatGPT holte in 11,5 % der Abrufe JavaScript-Dateien, Claude in 23,8 %, ohne sie auszuführen. Applebot und Gemini (über Googlebot) renderten. `[Fakt · TI-Q30, 17.12.2024; Anbieter einer Hosting-Plattform, eigene Daten, vor allem eine Website, keine Begutachtung]`
  - Resoneo prüfte im Januar 2026 Abrufe auf Nutzerwunsch mit einer Testseite. ChatGPT-User, Claude-User und Gemini führten kein JavaScript aus; Bing Copilot, Grok und DeepSeek schon. Die Zahl der Versuche nennt die Studie nicht. `[Fakt · TI-Q31; Anbieter, Methode knapp]`
  - **Unsicher:** Beide Messungen stammen von Anbietern, eine ist fast zwei Jahre alt. Es gibt Berichte, OpenAI habe 2026 mit Rendern begonnen; belegen konnte ich das nicht. `[Annahme]` Neu prüfen alle 6 Monate. `[Vorschlag]`
- **Folge für KMU:** Titel, Beschreibung, `canonical`, Haupttitel, Hauptinhalt, Preise, Öffnungszeiten, Kontakt und strukturierte Daten stehen im HTML, das der Server liefert. Eine statische Website erfüllt das von selbst. `[Annahme, aus TI-Q29 bis TI-Q31]`

---

## 10. Ladezeit, Core Web Vitals, HTTPS, Handy, Bilder

### 10.1 Core Web Vitals

Grenzwerte laut web.dev, je am **75. Perzentil** der echten Besuche, getrennt nach Handy und Desktop `[Fakt · TI-Q32, 31.10.2024; TI-Q33, 04.09.2025; TI-Q34, 02.09.2025; TI-Q35, 12.04.2023]`:

| Wert | misst | gut | verbessern | schlecht |
|---|---|---|---|---|
| LCP | wann das grösste sichtbare Element (Bild, Textblock, Video) fertig ist | bis 2,5 s | bis 4,0 s | über 4,0 s |
| INP | wie schnell die Seite auf Klick, Tippen, Taste reagiert | bis 200 ms | bis 500 ms | über 500 ms |
| CLS | wie stark sich das Layout unerwartet verschiebt | bis 0,1 | bis 0,25 | über 0,25 |

- Dieselben Grenzwerte nutzt der Bericht der Search Console (M9). `[Verweis M9]`
- INP hat 2024 FID abgelöst. `[Fakt · TI-Q32]` Lighthouse misst INP nicht und zeigt ersatzweise die Total Blocking Time. Felddaten sind der beste Weg. `[Fakt · TI-Q32; TI-Q34]`
- **Was Google zum Rang sagt:** Core Web Vitals «werden von unseren Ranking-Systemen genutzt». Gute Werte garantieren keinen Platz oben; Relevanz geht vor. Es gibt kein einzelnes Signal «Page Experience». `[Regel laut Google · TI-Q38, 22.09.2026]`

### 10.2 Bilder

- `width` und `height` an jedem `<img>` und `<video>`, oder Platz mit CSS `aspect-ratio` reservieren. Sonst verschiebt sich das Layout (CLS). `[Regel laut web.dev · TI-Q36, 07.02.2025]`
- `loading="lazy"` nur für Bilder ausserhalb des ersten Bildschirms. Bilder im ersten Bildschirm, vor allem das LCP-Bild, laden normal. `[Regel laut web.dev · TI-Q37, 13.08.2024]`
- Dateiname und Alt-Text nach S20, S21. Bing will Bilder als Ergänzung zum Text, nicht als einzige Quelle einer Information. `[Verweis; Regel laut Bing · TI-Q16]`
- Grenzwert für Dateigrösse: Google und web.dev nennen in den gelesenen Seiten keinen. Das Budget für Bilder legt web-uni fest (WP5); die frühere eigene Arbeitsregel von 200 KB je Bild ist am 02.11.2026 gestrichen. `[Annahme]`

### 10.3 HTTPS

- Google fragt in der Selbstprüfung zur Page Experience, ob die Seiten sicher über HTTPS ausgeliefert werden; Search Console hat dafür einen Bericht. `[Regel laut Google · TI-Q38]`
- Für den Umzug braucht die neue Website ein gültiges Zertifikat; `http` zu `https` ist keine Adressänderung (8.7). `[Regel laut Google · TI-Q26; TI-Q28]`
- Eine Hostvariante: `https://` und entweder mit oder ohne `www`, die andere leitet in einem Sprung weiter (S-Q14 in Semester 3). `[Verweis]`

### 10.4 Handy zuerst

- Google indexiert und bewertet die Fassung für das Handy, gecrawlt mit dem Smartphone-Crawler. Eine eigene Handy-Fassung ist nicht Pflicht; Google empfiehlt responsives Design. `[Regel laut Google · TI-Q39, 10.12.2025]`
- Gleicher Hauptinhalt, gleiche Überschriften, gleiche strukturierte Daten, gleiche `robots`-Regeln, gleiche Titel und Beschreibungen auf Handy und Desktop. Hauptinhalt nicht erst nach Wischen oder Klicken laden; Google klickt nicht. Ressourcen für das Handy nicht in `robots.txt` sperren. `[Regel laut Google · TI-Q39]`
- **Überlagerungen:** Werbung oder Hinweise, die den Inhalt verdecken, erschweren es Suchmaschinen, die Seite zu verstehen. Pflicht-Hinweise (z. B. Altersprüfung) sind ausgenommen; sie sollen den Inhalt überlagern, nicht auf eine eigene Seite umleiten. `[Regel laut Google · TI-Q40, 10.12.2025]`

---

## 11. llms.txt

- **Was es ist:** ein Vorschlag von Jeremy Howard vom 03.09.2024, kein Standard. Eine Markdown-Datei `/llms.txt` mit Titel, kurzer Zusammenfassung und Linklisten, damit Sprachmodelle eine Website bei der Nutzung schneller verstehen. Fassung 2, zuletzt geändert am 10.08.2026. `[Fakt · TI-Q41]`
- **Wer es liest:** Die Seite nennt Anbieter, die eigene `llms.txt` für ihre Entwickler-Doku veröffentlichen, aber keinen Dienst, der fremde `llms.txt` beim Suchen oder Antworten liest. `[Fakt · TI-Q41]`
- **Google:** «Sie müssen keine neuen maschinenlesbaren Dateien, KI-Textdateien, Auszeichnungen oder Markdown erstellen, um in der Google-Suche zu erscheinen (auch in ihren generativen KI-Funktionen), da die Google-Suche selbst sie nicht verwendet.» Im selben Leitfaden steht `llms.txt` ausdrücklich bei den Taktiken, die man für die Google-Suche ignorieren kann. `[Regel laut Google · TI-Q10, 10.07.2026, eigene Übersetzung]`
- **John Mueller (Google)** schrieb am 17.06.2025: «no AI system currently uses llms.txt». `[Fakt · TI-Q42, Zitat laut Search Engine Roundtable]`
- **Folge:** `llms.txt` ist erlaubt und kostet wenig. Kein Angebot und kein Bericht verspricht damit Sichtbarkeit (G2). Wer eine anlegt, schreibt nur hinein, was auch auf der Website steht, und pflegt sie mit, sonst entstehen widersprüchliche Angaben. `[Annahme; Verweis G2]` Neu prüfen alle 6 Monate. `[Vorschlag]`

---

## 12. Wenn in der Schweiz

- **Hosting-Standort:** Google nennt den Standort des Servers als ein Signal für das Zielpublikum, wegen CDNs aber «kein eindeutiges». Stärker zählen Länder-Domain, `hreflang`, Adressen und Telefonnummern, Sprache, Währung, Links aus dem Land und das Unternehmensprofil (S-Q17 in Semester 3). `[Regel laut Google · S-Q17, 10.12.2025]` Ein Hosting in der Schweiz ist darum eine Frage von Datenschutz und Vertrag, kein Hebel für den Rang. `[Annahme]`
- **Länder-Domain:** `.ch` ist als Länder-Domain ein Signal für die Schweiz. Google nennt `.ch` nicht ausdrücklich, nur Länder-Domains allgemein. `[Regel laut Google · S-Q17]`
- **Mehrsprachig:** S31 bis S33 gelten. Beim Umzug zeigen auch die `hreflang`-Angaben auf die neuen Adressen. `[Verweis; Regel laut Google · TI-Q26]`
- **Cookie-Hinweis:** Google nimmt Pflicht-Hinweise von der Regel zu Überlagerungen aus, nennt Cookie-Hinweise aber nicht ausdrücklich. Ein Hinweis, der überlagert und nicht auf eine eigene Seite umleitet, ist nach dieser Regel unbedenklich. `[Regel laut Google · TI-Q40; Übertragung auf Cookie-Hinweise: Annahme]`
- **Personendaten:** `noindex` und `robots.txt` schützen keine Personendaten, weil manche Abrufe sie ignorieren (4.1). Was nicht öffentlich sein soll, gehört nicht auf die Website. Dieses Skript ist keine Rechtsauskunft. `[Annahme]`

---

## 13. Prüfbare Grundsätze

Jede Regel entscheidet ein Werkzeug oder ein Bewerter ohne Vorwissen. «Werkzeug» heisst: lässt sich maschinell prüfen, an Dateien oder online. Grenzwerte ohne Beleg sind `[Annahme]`. Neu prüfen: Grundsätze zu Crawlern (TI5 bis TI7) und zu JavaScript und `llms.txt` (TI31, TI38) alle 6 Monate.

**robots.txt**

- **TI1 robots.txt gültig.** Datei unter `/robots.txt`, UTF-8, unter 500 KiB. Jede Zeile ist leer, Kommentar oder eines der Felder `user-agent`, `allow`, `disallow`, `sitemap`; jede Regel steht in einer Gruppe nach `user-agent`. Andere Felder: 0. Werkzeug. `[Regel laut Google · TI-Q2; Fakt · TI-Q3; Verzicht auf crawl-delay: Annahme]`
- **TI2 Such-Crawler frei.** Für `Googlebot`, `Bingbot`, `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` und `Applebot` ist jede Adresse der Sitemap und jede eingebundene CSS-, JS- und Bilddatei erlaubt, ausgewertet nach den Regeln von Google (genaueste Gruppe, längste Regel; Applebot ohne eigene Gruppe wie Googlebot). Gesperrt: 0. Werkzeug. `[Regel laut Google · TI-Q2; TI-Q39; Regel laut Apple · TI-Q15; Auswahl der Crawler: Annahme]`
- **TI3 robots.txt verrät nichts.** 0 `disallow`-Pfade mit Wörtern wie `admin`, `intern`, `privat`, `kunde`, `login`, `vorschau`, `test`, `staging`, `backup`, `offerte`. Was nicht öffentlich sein darf, liegt hinter einem Passwort. Werkzeug mit Wortliste. `[Fakt · TI-Q3; Regel laut Google · TI-Q1; Wortliste: Annahme]`
- **TI4 Sitemap angegeben.** Genau eine Zeile `Sitemap:` mit absoluter `https`-Adresse der eigenen Domain, und die Datei liegt dort. Werkzeug. `[Regel laut Google · TI-Q22]`
- **TI5 KI-Entscheid je Zweck, mit Datum.** `robots.txt` enthält die Zeile `# Entscheid KI-Training: erlaubt` oder `gesperrt`, mit Datum. Bei «gesperrt» tragen `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended` und `CCBot` `Disallow: /`; die Such-Crawler bleiben frei (TI2). Werkzeug für die Datei; Prüffrage an den Betrieb, ob er so entschieden hat. `[Regel laut Google · TI-Q7; Regel laut OpenAI · TI-Q11; Regel laut Anthropic · TI-Q13; Regel laut Apple · TI-Q15; Fakt · TI-Q19; TI-Q20; Form: Annahme]`
- **TI6 Crawler-Liste aktuell.** `robots.txt` enthält `# Crawler-Liste geprüft: JJJJ-MM-TT`, nicht älter als 183 Tage. Werkzeug. `[Annahme; Anlass: Namen ändern sich, TI-Q8; TI-Q11]`
- **TI7 Kein falsches Versprechen zur Sperre.** Kein Angebot und kein Bericht sagt, `robots.txt` schütze Inhalte, nehme Seiten aus Google oder sperre jeden KI-Abruf, oder Google-Extended nehme die Website aus KI-Übersichten. Prüffrage. `[Fakt · TI-Q3; Regel laut Google · TI-Q1; TI-Q8; TI-Q9; Regel laut OpenAI · TI-Q11; Regel laut Perplexity · TI-Q14]`

**Index und Snippet**

- **TI8 noindex richtig gesetzt.** Jede Seite mit `noindex` (Meta-Tag oder Kopfzeile `X-Robots-Tag`, bei Cloudflare Pages etwa in `_headers`) ist nicht in `robots.txt` gesperrt und steht nicht in der Sitemap. Das gilt auch für die Vorschau (TI10). Jede Seite der Sitemap trägt kein `noindex`. Werkzeug. `[Regel laut Google · TI-Q5; TI-Q22; Verweis G1]`
  Geändert am 02.11.2026: hosterneutral gefasst; ausdrücklich auch für die Vorschau (Entscheid 4 in [zusammenspiel.md](../../../design-uni/referenzen/zusammenspiel.md)). `[Entscheid · Studio, 02.11.2026]`
- **TI9 Snippets frei.** Auf indexierbaren Seiten 0 `nosnippet`, 0 `max-snippet` unter 160 Zeichen ausser `-1`, 0 `data-nosnippet`, 0 `noarchive`, 0 `nocache`, ausser der Betrieb hat es schriftlich entschieden. Werkzeug. `[Regel laut Google · TI-Q4; Regel laut Bing · TI-Q16; Regel laut Apple · TI-Q15; 160: Annahme]`
- **TI10 Vorschau nie im Index.** Jede Vorschau-Adresse trägt `noindex` per Kopfzeile `X-Robots-Tag` oder Meta-Tag und ist, wo möglich, durch einen Zugang geschützt. Ihre `robots.txt` enthält kein `Disallow: /`, sonst liest Google das `noindex` nicht (TI8). Beispiel Cloudflare Pages: Regel in `_headers` für die Adresse `*.pages.dev` des Projekts; bei anderen Hostern nach deren Doku (Hoster: web-uni, WP2). Online: `curl -I` auf die Vorschau zeigt `noindex`. Werkzeug. `[Fakt · TI-Q45; Regel: Annahme; kein Disallow: Entscheid · Studio, 02.11.2026]`
  Geändert am 02.11.2026: hosterneutral gefasst; Vorschau ohne `Disallow` und, wo möglich, mit Zugangsschutz (Entscheid 4). `[Entscheid · Studio, 02.11.2026]`

**Sitemap**

- **TI11 Sitemap gültig.** XML in UTF-8 mit dem Namensraum von sitemaps.org; nur absolute `https`-Adressen der Hauptdomain; höchstens 50 000 Adressen und 50 MB. Werkzeug. `[Regel laut Google · TI-Q22]`
- **TI12 Sitemap gleich kanonische 200-Seiten.** Jede Adresse der Sitemap liefert 200 ohne Weiterleitung, trägt kein `noindex` und hat `canonical` auf sich selbst. Jede indexierbare HTML-Seite steht in der Sitemap. Abweichungen: 0. Werkzeug. `[Regel laut Google · TI-Q22; Regel laut Bing · TI-Q16; Verweis S28, M8]`
- **TI13 lastmod ehrlich.** `lastmod` im Format `JJJJ-MM-TT` (oder mit Zeit nach W3C), nicht in der Zukunft. Prüffrage: Änderte sich an diesem Tag Hauptinhalt, Daten oder Links (G19)? Werkzeug für Format und Zukunft. `[Regel laut Google · TI-Q22; TI-Q23]`
- **TI14 Bei Google und Bing eingereicht.** Sitemap in Search Console mit Status «Erfolgreich» (M8) und in Bing Webmaster Tools eingereicht. Prüffrage, online. `[Regel laut Google · TI-Q22; Regel laut Bing · TI-Q16]`

**Bing und IndexNow**

- **TI15 Bing eingerichtet.** Website in Bing Webmaster Tools bestätigt, etwa per Import aus Search Console; der Betrieb ist Inhaber (M17). Prüffrage. `[Regel laut Bing · TI-Q18; Nutzen: Annahme, 6.3]`
- **TI16 IndexNow-Schlüssel gültig.** Wird IndexNow genutzt: Datei `<schlüssel>.txt` an der Wurzel, Inhalt gleich dem Dateinamen, 8 bis 128 Zeichen aus `a-z`, `A-Z`, `0-9`, `-`. Gemeldet werden nur neue, geänderte und gelöschte Adressen. Werkzeug für die Datei, Prüffrage für das Melden. `[Regel laut IndexNow · TI-Q21]`

**Statuscodes**

- **TI17 Echte 404.** Unbekannte Adressen liefern 404 mit einer eigenen Fehlerseite. Wie der Hoster sie findet, steht in seiner Doku; Beispiel Cloudflare Pages: `404.html` an der Wurzel, sonst liefert Pages für jede unbekannte Adresse die Startseite (Teil 7). Die Fehlerseite hat kein `canonical`, verlinkt Startseite und Kontakt und steht nicht in der Sitemap. Werkzeug (Datei offline, Status online). `[Regel laut Google · TI-Q24; Fakt · TI-Q44; Inhalt der Seite: Annahme]`
  Geändert am 02.11.2026: hosterneutral gefasst, Cloudflare Pages nur als Beispiel; den Hoster entscheidet web-uni (WP2). `[Entscheid · Studio, 02.11.2026]`
- **TI18 Kein Soft-404.** Keine Seite der Sitemap zeigt einen Fehlersatz wie «nicht gefunden» oder «existiert nicht». Werkzeug. Unter 80 Wörtern sichtbaren Texts ist nur ein Hinweis auf eine leere Seite, kein Wortziel (G20, Q10): Ein Bewerter prüft, ob die Seite leer wirkt. `[Regel laut Google · TI-Q24; 80 Wörter: Annahme]`
  Geändert am 02.11.2026: 80 Wörter sind keine Mindestzahl mehr, nur ein Hinweis (Teil 4 in [zusammenspiel.md](../../../design-uni/referenzen/zusammenspiel.md)). `[Entscheid · Studio, 02.11.2026]`

**Weiterleitungen und Umzug**

- **TI19 Weiterleitungsliste vor dem Umzug.** Eine Liste (alt; neu; Status; umgesetzt mit; Grund) enthält jede Adresse der alten Sitemap und jede Seite mit Klicks oder Impressionen aus 16 Monaten Search Console (M12). Fehlende alte Adressen: 0. Werkzeug gegen die gesicherte alte Sitemap, Prüffrage für den Export. `[Regel laut Google · TI-Q26; Quellen der Liste: Vorschlag]`
- **TI20 Genau ein Sprung mit 301.** Jede alte Adresse der Liste antwortet mit 301 oder 308 und landet nach genau einem Sprung mit 200 auf dem Ziel aus der Liste. Ketten: 0. 302, 303, 307: 0. Schleifen: 0. Werkzeug (offline als Nachbildung des Hosters, online mit `curl`). `[Regel laut Google · TI-Q25; TI-Q26; Regel laut Bing · TI-Q16; «genau ein»: Annahme]`
- **TI21 Passendes Ziel.** Höchstens 2 alte Adressen zeigen auf die Startseite (alte Startseite und eine Übersicht). Prüffrage je Zeile: Deckt das Ziel denselben Inhalt? Werkzeug für die Zahl. `[Regel laut Google · TI-Q26: Soft-404; Grenzwert: Annahme]`
- **TI22 Gelöscht heisst 404 oder 410.** Zeilen ohne Nachfolger tragen Status 404 oder 410 und stehen nicht als Weiterleitung im Hoster. Werkzeug. `[Regel laut Google · TI-Q26; Regel laut Bing · TI-Q16]`
- **TI23 Der Hoster kann jede alte Adresse.** Jede alte Adresse der Liste (TI19) ist beim gewählten Hoster (web-uni, WP2) als Weiterleitung umsetzbar, auch mit Abfrage-Parametern, und jede Regel nennt den Code ausdrücklich. Beispiel Cloudflare Pages: In `_redirects` 0 Quellen mit `?` oder mit Domain, jede Zeile mit Code (ohne Code gilt 302); Adressen mit Parametern laufen über eine Funktion oder eine Regel auf Domain-Ebene. Werkzeug. `[Fakt · TI-Q43; allgemeine Fassung: Annahme]`
  Geändert am 02.11.2026: hosterneutral gefasst, Cloudflare Pages nur als Beispiel (Hoster: web-uni). `[Entscheid · Studio, 02.11.2026]`
- **TI24 Neue Adressen überall.** 0 interne Links, `canonical`, Sitemap-Einträge und Adressen in strukturierten Daten, die auf eine alte Adresse oder auf eine Adresse mit Weiterleitung zeigen (auch `/kontakt.html` statt `/kontakt`, wenn der Hoster wie Cloudflare Pages auf die Adresse ohne Endung weiterleitet). Werkzeug. `[Regel laut Google · TI-Q26; Fakt · TI-Q44]`
- **TI25 Eine Hostvariante.** `canonical`, Sitemap, strukturierte Daten und absolute interne Links nutzen dieselbe Variante (`https://` und gleicher Host). Online: `http://` und die andere `www`-Variante leiten mit einem Sprung weiter. Werkzeug. `[Regel laut Google · S-Q14; TI-Q26]`
- **TI26 Adressänderung bei neuer Domain.** Bei neuer Domain sind alle Varianten der alten und neuen Domain in Search Console bestätigt und die Adressänderung ist eingereicht; bei allen anderen Umzügen nicht. Prüffrage. `[Regel laut Google · TI-Q28]`
- **TI27 Lange genug behalten.** Die Liste nennt Umzugsdatum und «behalten bis»; Abstand mindestens 365 Tage. Die alte Domain bleibt mindestens 1 Jahr registriert. Werkzeug für die Daten, Prüffrage für die Domain. `[Regel laut Google · TI-Q26; TI-Q28]`
- **TI28 Hosterwechsel vorbereitet.** TTL mindestens 1 Woche vorher gesenkt; Bestätigung der Search Console mitgenommen; alter Server läuft, bis dort kein Verkehr mehr ankommt. Prüffrage. `[Regel laut Google · TI-Q27]`
- **TI29 Nach dem Umzug nachgeprüft.** Nach 1, 4 und 12 Wochen: TI20 online für jede Zeile, M7, M8; Rückgänge nach M15 gedeutet. Prüffrage mit Datum. `[Regel laut Google · TI-Q26; Termine: Annahme]`
- **TI30 Domain gehört dem Betrieb.** Halter der Domain ist der Betrieb, nicht der Anbieter. Prüffrage; geprüft mit den übrigen Zugängen in web-uni WP7. `[Annahme, aus 8.8]`

**JavaScript**

- **TI31 Inhalt ohne JavaScript.** Auf jeder indexierbaren Seite stehen Titel, Beschreibung, `canonical`, ein `<h1>`, der Hauptinhalt, Links als `<a href>` und strukturierte Daten im HTML ohne Ausführung von Skripten. 0 Seiten mit leerem Wurzel-Element einer App (`<div id="app"></div>`, `<div id="root"></div>`). Werkzeug. `[Regel laut Google · TI-Q29; Regel laut Bing · TI-Q16; Fakt · TI-Q30; TI-Q31; 80 Wörter: Annahme]` Unter 80 Wörtern im HTML ohne Skript ist ein Hinweis auf eine leere Seite (TI18), kein Wortziel.
  Geändert am 02.11.2026: «mindestens 80 Wörter» gestrichen; 80 Wörter sind nur noch ein Hinweis (eine Schwelle je Sache, G20, Q10). `[Entscheid · Studio, 02.11.2026]`

**Leistung, HTTPS, Handy**

- **TI32 Core Web Vitals gut.** Schwellen, Budgets und Messregeln für Ladezeit und Core Web Vitals besitzt web-uni (WP5). text-uni liest die Felddaten in Search Console für den Messplan (M9). Google nennt als «gut»: LCP bis 2,5 s, INP bis 200 ms, CLS bis 0,1 am 75. Perzentil, Handy und Desktop getrennt (10.1). Werkzeug online (PageSpeed Insights, Search Console). `[Fakt · TI-Q32 bis TI-Q35; Verweis M9, WP5]`
  Geändert am 02.11.2026: Schwelle und Budget liegen bei web-uni; hier nur Verweis und Googles Definition. `[Entscheid · Studio, 02.11.2026]`
- **TI33 Bilder mit Mass.** Jedes `<img>` hat `width` und `height`. Das erste Bild einer Seite lädt ohne `loading="lazy"`, jedes weitere mit. Das Gewicht der Bilder regelt das Budget von web-uni (WP5). Werkzeug. `[Regel laut web.dev · TI-Q36; TI-Q37; Reihenfolge als Ersatz für «im ersten Bildschirm»: Annahme]`
  Geändert am 02.11.2026: eigene Grenze von 200 KB je Bild gestrichen; Budgets gehören web-uni. `[Entscheid · Studio, 02.11.2026]`
- **TI34 Leichte Seite, nichts Fremdes.** Budgets für HTML, CSS, JavaScript und Bilder besitzt web-uni (WP5); text-uni wiederholt sie nicht. Fremde Inhalte (Player, Feeds) laden erst nach Klick (CL3, gilt vor TI34). Fremde Skripte nur mit Grund und erst nach Einwilligung oder Klick; fremde Hosts regelt web-uni. Werkzeug: im ausgelieferten HTML 0 Skripte und 0 eingebettete Inhalte von fremden Domains, die beim Aufruf laden. `[Verweis WP5, CL3; Entscheid · Studio, 02.11.2026]`
  Geändert am 02.11.2026: eigene Budgets (HTML 100 KB; CSS und JS zusammen 100 KB; Annahme) gestrichen, sie gehören web-uni; ein fremdes Skript mit `async` oder `defer` besteht nicht mehr (Entscheid 10). `[Entscheid · Studio, 02.11.2026]`
- **TI35 Nur HTTPS.** 0 Verweise mit `http://` in `href`, `src`, `canonical`, Sitemap und strukturierten Daten (ausgenommen XML-Namensräume). Online: gültiges Zertifikat (HTTPS am Hoster: web-uni). Werkzeug. `[Regel laut Google · TI-Q38; TI-Q26]`
- **TI36 Handy zuerst.** Jede Seite hat `<meta name="viewport" content="width=device-width, initial-scale=1">`; eine Fassung für alle Geräte, keine `m.`-Adresse. Werkzeug für das Tag. `[Regel laut Google · TI-Q39; Tag als Nachweis für responsiv: Annahme]`
- **TI37 Nichts vor dem Inhalt.** 0 Werbe-Überlagerungen. Grundsatz ist eine Website ohne Cookies (Technik: web-uni). Falls ein Pflicht- oder Cookie-Hinweis nötig ist, überlagert er nur und leitet nicht auf eine eigene Seite um. Prüffrage. `[Regel laut Google · TI-Q40]`
  Geändert am 02.11.2026: Cookie-Hinweis nur noch, «falls ein Hinweis nötig ist»; der Grundsatz ist cookielos (Abgleich der drei Skills). `[Entscheid · Studio, 02.11.2026]`

**llms.txt und Schweiz**

- **TI38 llms.txt ohne Versprechen.** Kein Angebot und kein Bericht verspricht Wirkung durch `llms.txt` (G2). Liegt eine vor: erste Zeile `# Name`, jeder Link zeigt auf eine eigene Seite mit 200 und steht in der Sitemap. Werkzeug für die Datei, Prüffrage für das Versprechen. `[Regel laut Google · TI-Q10; Fakt · TI-Q41; TI-Q42]`
- **TI39 Standort ist kein Rang-Versprechen.** Kein Angebot verspricht besseren Rang durch Hosting in der Schweiz. Prüffrage. `[Regel laut Google · S-Q17]`

**Aus Semester 3, ebenfalls maschinell geprüft in der Technik-Probe:** S1, S15, S23, S24, S25, S28.

---

## 14. Für die Semesterprüfung: Technik-Probe (Teil B)

Die Probe baut die Garage Muster als statische Website für Cloudflare Pages und prüft sie mit einem Skript ohne Abhängigkeiten. Schwelle: 0 Fehler; jede alte Adresse leitet mit 301 genau einmal auf die passende neue Seite (TI20). `[Annahme; Verweis Prüfauftrag Semester 4]`

Bestandteile `[Fakt · eigene Probe]`:

- **Website:** Startseite, `/reifenwechsel`, `/service-und-reparatur`, `/kontakt`, `404.html`, `robots.txt` (wie 2.3), `sitemap.xml`, `_headers` (TI10), `_redirects` für drei alte Adressen, eine Funktion mit `_routes.json` für die drei Adressen mit `index.php` (8.10), JSON-LD `AutoRepair` auf Start und Kontakt, `llms.txt`, IndexNow-Schlüssel. Jede Seite trägt sichtbar den Hinweis, dass Betrieb und Angaben erfunden sind.
- **Umzugsliste:** alte Sitemap und Liste aus 8.10 mit Umzugsdatum und «behalten bis».
- **Prüfskript:** liest die Dateien, bildet das Ausliefern von Cloudflare Pages nach (Weiterleitungen, Funktion, `.html` ohne Endung, 404) und gibt je Grundsatz OK, FEHLER oder «nicht prüfbar offline» mit Grund aus. Prüffragen erscheinen als «nicht prüfbar offline».
- **Gegenprobe:** eine absichtlich kaputte Kopie mit Kette in der Weiterleitung, fehlendem `canonical` und einer `noindex`-Seite in der Sitemap. Erwartet: das Skript meldet alle drei.
- **Ergebnis am 01.11.2026:** 45 Grundsätze ausgegeben, davon 35 maschinell geprüft (29 TI, 6 aus Semester 3) und 10 «nicht prüfbar offline». Sauberer Lauf: 0 Fehler; alle 6 alten Adressen mit genau einem Sprung 301. Gegenprobe: 6 Grundsätze mit FEHLER, 7 Befunde; alle drei eingebauten Fehler gefunden (Kette in TI20; fehlendes `canonical` in TI12, TI31, S28; `noindex` in der Sitemap in TI8, TI12, Folgebefund TI18). `[Fakt · eigene Probe, 01.11.2026]`
- **Grenze:** Die Nachbildung folgt der Doku von Cloudflare. Wo die Doku schweigt (Code der `.html`-Weiterleitung, Ordner ohne Schrägstrich), rechnet das Skript mit einer Annahme und sagt das. Echte Antworten des Servers zeigt erst ein Test auf der Vorschau mit `curl`. `[Annahme]`

---

## 15. Quellen

Alle abgerufen am 01.11.2026. Datum in Klammern: Stand der Seite laut Anbieter. Englische Seiten; Übersetzungen sind eigene.

**Google**

- **TI-Q1** Google Search Central: «Introduction to robots.txt» (10.12.2025). https://developers.google.com/search/docs/crawling-indexing/robots/intro
- **TI-Q2** Google Search Central: «How Google interprets the robots.txt specification» (23.10.2026). https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
- **TI-Q4** Google Search Central: «Robots meta tag, data-nosnippet, and X-Robots-Tag specifications» (24.03.2026). https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- **TI-Q5** Google Search Central: «Block Search indexing with noindex» (10.12.2025). https://developers.google.com/search/docs/crawling-indexing/block-indexing
- **TI-Q6** Google: «Overview of Google crawlers and fetchers» (12.06.2026). https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers
- **TI-Q7** Google: «List of Google's common crawlers», darin Google-Extended und AIPREF (30.10.2026). https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
- **TI-Q8** Google: «Google's user-triggered fetchers» (19.08.2026). https://developers.google.com/search/docs/crawling-indexing/google-user-triggered-fetchers
- **TI-Q9** Google Search Central: «AI features and your website» (10.12.2025). https://developers.google.com/search/docs/appearance/ai-features
- **TI-Q10** Google Search Central: «Optimizing your website for generative AI features on Google Search» (10.07.2026). https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- **TI-Q22** Google Search Central: «Build and submit a sitemap» (08.07.2026). https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- **TI-Q23** Google Search Central Blog: «Sitemaps ping endpoint is going away», 26.06.2023. https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping
- **TI-Q24** Google Search Central: «How HTTP status codes, and network and DNS errors affect Google Search» (04.02.2026). https://developers.google.com/search/docs/crawling-indexing/http-network-errors
- **TI-Q25** Google Search Central: «Redirects and Google Search» (14.04.2026). https://developers.google.com/search/docs/crawling-indexing/301-redirects
- **TI-Q26** Google Search Central: «Site moves with URL changes» (20.08.2026). https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- **TI-Q27** Google Search Central: «Site moves without URL changes» (10.12.2025). https://developers.google.com/search/docs/crawling-indexing/site-move-no-url-changes
- **TI-Q28** Search Console Help: «Change of Address tool». https://support.google.com/webmasters/answer/9370220
- **TI-Q29** Google Search Central: «Understand the JavaScript SEO basics» (04.03.2026). https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- **TI-Q38** Google Search Central: «Understanding page experience in Google Search results» (22.09.2026). https://developers.google.com/search/docs/appearance/page-experience
- **TI-Q39** Google Search Central: «Mobile site and mobile-first indexing best practices» (10.12.2025). https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
- **TI-Q40** Google Search Central: «Avoid intrusive interstitials and dialogs» (10.12.2025). https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials

**Standard**

- **TI-Q3** M. Koster, G. Illyes, H. Zeller, L. Sassman: «RFC 9309: Robots Exclusion Protocol», IETF, September 2022. https://www.rfc-editor.org/rfc/rfc9309.html

**Betreiber von Crawlern**

- **TI-Q11** OpenAI: «Overview of OpenAI Crawlers», ohne Datum; die frühere Adresse platform.openai.com/docs/bots leitet mit 301 hierher. https://developers.openai.com/api/docs/bots
- **TI-Q12** OpenAI Help Center: «Searching the web with ChatGPT», ohne Datum. https://help.openai.com/en/articles/9237897-chatgpt-search
- **TI-Q13** Anthropic: «Does Anthropic crawl data from the web, and how can site owners block the crawler?» (07.04.2026). https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- **TI-Q14** Perplexity: «Perplexity Crawlers», ohne Datum. https://docs.perplexity.ai/guides/bots
- **TI-Q15** Apple Support: «About Applebot» (04.09.2026). https://support.apple.com/en-us/119829
- **TI-Q16** Microsoft Bing: «Bing Webmaster Guidelines», ohne Datum. https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- **TI-Q17** Microsoft Bing: «How to Create a robots.txt File», ohne Datum. https://www.bing.com/webmasters/help/how-to-create-a-robots-txt-file-cb7c31ec
- **TI-Q18** Microsoft Bing: «Add and Verify site», ohne Datum. https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b
- **TI-Q19** Common Crawl: «Frequently Asked Questions» und «CCBot», ohne Datum. https://commoncrawl.org/faq · https://commoncrawl.org/ccbot
- **TI-Q20** Tom B. Brown u. a.: «Language Models are Few-Shot Learners», arXiv 2005.14165, 2020, Tabelle 2.2. https://arxiv.org/abs/2005.14165
- **TI-Q21** IndexNow: «Documentation» und «FAQ», ohne Datum. https://www.indexnow.org/documentation · https://www.indexnow.org/faq

**Messungen zu JavaScript**

- **TI-Q30** Giacomo Zecchini, Alice Alexandra Moore, Malte Ubl, Ryan Siddle: «The rise of the AI crawler». Vercel, mit MERJ, 17.12.2024. https://vercel.com/blog/the-rise-of-the-ai-crawler
- **TI-Q31** Resoneo: «GEO LLM crawler report», Januar 2026. https://think.resoneo.com/sentinel/geo-llm-crawler-report.html

**web.dev**

- **TI-Q32** «Web Vitals» (31.10.2024). https://web.dev/articles/vitals
- **TI-Q33** «Largest Contentful Paint (LCP)» (04.09.2025). https://web.dev/articles/lcp
- **TI-Q34** «Interaction to Next Paint (INP)» (02.09.2025). https://web.dev/articles/inp
- **TI-Q35** «Cumulative Layout Shift (CLS)» (12.04.2023). https://web.dev/articles/cls
- **TI-Q36** «Optimize Cumulative Layout Shift» (07.02.2025). https://web.dev/articles/optimize-cls
- **TI-Q37** «Browser-level image lazy loading for the web» (13.08.2024). https://web.dev/articles/browser-level-image-lazy-loading

**llms.txt**

- **TI-Q41** Jeremy Howard: «The /llms.txt file», llmstxt.org, Vorschlag vom 03.09.2024, Fassung 2, geändert 10.08.2026. https://llmstxt.org/
- **TI-Q42** Barry Schwartz: «Google: No AI System Currently Uses LLMs.txt». Search Engine Roundtable, 18.06.2025, mit Zitat und Link auf den Beitrag von John Mueller vom 17.06.2025. https://seroundtable.com/google-ai-llms-txt-39607.html · https://bsky.app/profile/johnmu.com/post/3lrshm4gggs2v

**Cloudflare Pages**

- **TI-Q43** «Redirects» (25.08.2026). https://developers.cloudflare.com/pages/configuration/redirects/
- **TI-Q44** «Serving Pages» (10.10.2026). https://developers.cloudflare.com/pages/configuration/serving-pages/
- **TI-Q45** «Headers» (25.08.2026) und «Preview deployments» (12.10.2026). https://developers.cloudflare.com/pages/configuration/headers/ · https://developers.cloudflare.com/pages/configuration/preview-deployments/
- **TI-Q46** «Functions: Routing» (18.09.2026). https://developers.cloudflare.com/pages/functions/routing/
