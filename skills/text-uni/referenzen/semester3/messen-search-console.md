# Messen mit Search Console und Unternehmensprofil · Skript Semester 3

Stand 01.11.2026 · Text-Uni, Semester 3 «Google-Suche».

> **Worum es geht:** Wie man die Berichte der Google Search Console liest, was die Zahlen bedeuten und was sie nicht sagen. Welche Zahlen das Unternehmensprofil liefert. Wie ein Messplan vor dem Livegang aussieht, damit nach 8 Wochen ein Vergleich möglich ist. Und wer die Daten sehen darf.
>
> **Gelesen am 01.11.2026, online** (Nummern wie in «Quellen» am Ende):
> M-Q1 Was sind Impressionen, Position und Klicks? (ganz gelesen) · M-Q2 Leistungsbericht, Übersicht · M-Q3 Leistungsbericht, Filter und Vergleiche · M-Q4 Search Central Blog, Filter und Grenzen der Leistungsdaten, 2022 · M-Q5 Search Central Blog, 16 Monate Daten, 2018 · M-Q6 Search Central Blog, Ansicht «24 Stunden», 2024 · M-Q7 Search Console API, Abfrage · M-Q8 Bericht zur Seitenindexierung · M-Q9 Bericht Core Web Vitals · M-Q10 Sitemaps-Bericht · M-Q11 URL-Prüfung · M-Q12 Rückgänge im Suchverkehr untersuchen · M-Q13 Inhaber, Nutzer und Berechtigungen · M-Q14 Leistung des Unternehmensprofils.
>
> **Nicht gefunden:** eine Angabe von Google, wie viele Impressionen oder Klicks ein Vergleich mindestens braucht, um mehr als Zufall zu zeigen. Alle Grenzwerte für kleine Zahlen in diesem Skript sind `[Annahme]`.
>
> Herkunft: `[Fakt · Quelle, Datum]`, `[Annahme]`, `[Meinung · Autor]`, `[Vorschlag]`, `[Verweis]`. Was Google über seine Werkzeuge schreibt, ist ein Fakt über das Werkzeug. Was Google über Rangfolge schreibt, steht als **«Absicht laut Google»**.

**Boden aus Semester 1 und 2.** Zahlen genau und mit Quelle (B2). Nichts erfunden (B8). Der Messplan gehört zum Prüfpunkt T8 im Verfahren (SKILL.md). Dieses Skript misst Text nicht direkt; es misst, ob eine Seite gefunden und angeklickt wird.

**Abgrenzung.** Wie man Titel und Snippets schreibt, steht in «Titel, Snippet, Struktur». Was Google sonst verlangt, in «Google-Grundlagen». Profil und Bewertungen in «Lokal gefunden werden».

**Musterbetrieb.** Alle Beispiele nutzen die erfundene Schreinerei Muster in Musterdorf mit der Website schreinerei-muster.example.

---

## 1. Grundbegriffe

- **Property:** eine Website oder ein Teil davon in Search Console, bestätigt durch einen Nachweis (Datei, Tag, DNS-Eintrag). `[Fakt · M-Q13]`
- **Impression:** Ein Link zur Website erscheint auf der aktuellen Ergebnisseite. Er muss dafür nicht ins Bild gescrollt sein. Ausnahmen: In Karussells, aufklappbaren Bereichen und endlos scrollenden Listen zählt er erst, wenn er sichtbar wird. Zurückblättern in derselben Suche zählt nicht doppelt. `[Fakt · M-Q1]`
- **Klick:** ein Klick, der aus der Google-Suche hinaus auf eine fremde Seite führt. Klickt jemand denselben Link nochmals, zählt das als ein Klick. `[Fakt · M-Q1]`
- **CTR (Klickrate):** Klicks geteilt durch Impressionen. `[Fakt · M-Q1]`
- **Position:** 1 ist ganz oben. Jedes Element der Ergebnisseite belegt eine Position, auch wenn es viele Links enthält. Anzeigen belegen keine Position. Eine KI-Übersicht belegt eine Position, alle Links darin teilen sie. `[Fakt · M-Q1]`
- **Durchschnittliche Position:** je Suche die oberste Position eines Links zur Website, gemittelt über alle Suchen, in denen die Website erschien. Ohne Impression wird keine Position erfasst. `[Fakt · M-Q1]`

---

## 2. Der Leistungsbericht

### 2.1 Was er zeigt

- **Vier Zahlen:** Klicks, Impressionen, durchschnittliche CTR, durchschnittliche Position. `[Fakt · M-Q2; M-Q6]`
- **Aufteilung nach:** Suchanfragen, Seiten, Länder, Geräte, Darstellung in der Suche, Daten. Suchtypen: Web, Bilder, Video, News. `[Fakt · M-Q2]`
- **Zeitraum:** Standard sind die letzten 3 Monate, zurück reicht der Bericht 16 Monate. Damit ist ein Vergleich mit dem Vorjahr möglich. `[Fakt · M-Q2; M-Q5]`
- **Frische Daten:** Die neuesten Werte sind vorläufig und können sich noch ändern. Die Ansicht «24 Stunden» zeigt Werte mit wenigen Stunden Verzögerung, stündlich, mit gestrichelter Linie für Unvollständiges. `[Fakt · M-Q2; M-Q6]`
- **Zeitzone:** Tage rechnet Search Console in pazifischer Zeit (Los Angeles). Die Ansicht «24 Stunden» zeigt die Ortszeit des Browsers. `[Fakt · M-Q7; M-Q6]` Ein Schweizer Tag und ein Search-Console-Tag sind also meist um 9 Stunden verschoben, in einigen Wochen um den Wechsel der Sommerzeit um 8. `[Annahme, aus der Zeitzone abgeleitet]`
- **Vergleiche:** zwei Zeiträume nebeneinander, etwa Woche gegen Vorwoche oder ein Quartal gegen dasselbe Quartal des Vorjahres. Filter nach Anfrage, Seite, Land und Gerät lassen sich kombinieren, auch mit «enthält» und regulären Ausdrücken. `[Fakt · M-Q3]`

### 2.2 Website oder Seite

- Gruppiert nach Website, zählt ein Element mit mehreren Links zur Website als eine Impression. Gruppiert nach Seite, zählt jede verlinkte Seite einzeln. Darum weichen Summen in Diagramm und Tabelle voneinander ab. `[Fakt · M-Q1; M-Q2]`

### 2.3 Lokale Treffer

- Wie Kartentreffer und das lokale Paket gezählt werden, steht in der gelesenen Hilfe nicht ausdrücklich. `[Fakt · M-Q1, geprüft auf «Maps» und «local pack», ohne Treffer]` Klicks aus dem Unternehmensprofil auf die Website erscheinen in den Statistiken des Profils (Teil 7). Ob sie zusätzlich im Leistungsbericht stehen, ist hier nicht belegt. `[Annahme]`

---

## 3. Seitenindexierung

- **Was der Bericht zeigt:** wie viele Seiten indexiert sind, wie viele nicht, und warum nicht. `[Fakt · M-Q8]`
- **Ziel laut Google:** nicht 100 Prozent. Indexiert sein soll die kanonische Fassung jeder wichtigen Seite. `[Fakt · M-Q8]`
- **Normale Gründe:** Weiterleitung, absichtliches `noindex`, gewollte Sperre in `robots.txt`, Duplikat mit gewählter Hauptfassung, 404 für eine gelöschte Seite ohne Ersatz. Ein Duplikat zeigt oft nur, dass Google die Hauptfassung gefunden hat. `[Fakt · M-Q8]`
- **Gründe, die eine Prüfung wert sind:** «Gecrawlt, zurzeit nicht indexiert» (Google hat die Seite gelesen und nicht aufgenommen; erneutes Einreichen ist nicht nötig) und «Gefunden, zurzeit nicht indexiert» (Google hat das Crawlen verschoben). `[Fakt · M-Q8]` Bei einer kleinen Website mit 10 bis 30 Seiten ist jede wichtige Seite in diesen Gruppen ein Befund. `[Annahme]`
- **Korrektur bestätigen:** nach dem Beheben «Fehlerbehebung prüfen». Das dauert laut Google meist bis etwa 2 Wochen, manchmal länger. `[Fakt · M-Q8]`

---

## 4. Core Web Vitals

- **Quelle der Daten:** echte Besuche aus dem Chrome-Nutzerbericht (CrUX), keine Labormessung. `[Fakt · M-Q9]`
- **Grenzwerte laut Google**, je am 75. Perzentil der letzten 28 Tage `[Fakt · M-Q9]`:

| Wert | Gut | Verbesserung nötig | Schlecht |
|---|---|---|---|
| LCP (grösstes Element geladen) | bis 2,5 s | bis 4 s | über 4 s |
| INP (Reaktion auf Eingabe) | bis 200 ms | bis 500 ms | über 500 ms |
| CLS (Verschieben des Layouts) | bis 0,1 | bis 0,25 | über 0,25 |

- **Kleine Websites:** Für eine URL-Gruppe braucht es eine Mindestmenge an Daten, aus Datenschutzgründen. Reicht sie nicht, fasst Google die ganze Website zusammen; reicht auch das nicht, zeigt der Bericht nichts. `[Fakt · M-Q9]` Bei vielen KMU-Websites bleibt der Bericht darum leer. `[Annahme]` Dann gelten Labormessungen vor dem Livegang als Ersatz, gekennzeichnet als Labor. `[Vorschlag]`
- **Korrektur bestätigen:** «Tracking starten» beginnt eine Beobachtung über 28 Tage. `[Fakt · M-Q9]`

---

## 5. Sitemaps

- Eine Sitemap «einreichen» heisst, Google zu sagen, wo die Datei liegt. Das geht nur als Inhaber der Property; sonst über einen Eintrag in `robots.txt`. `[Fakt · M-Q10]`
- **Status:** «Erfolgreich», «Konnte nicht abgerufen werden», «Hat Fehler». Einreichen garantiert weder Crawlen noch Indexieren. `[Fakt · M-Q10]`
- **Grenzen:** höchstens 50 000 URLs und 50 MB unkomprimiert je Sitemap. `[Fakt · M-Q10]` Für KMU spielt das keine Rolle; wichtig ist, dass die Zahl «Gefundene Seiten» zur Zahl der echten Seiten passt. `[Annahme]`

---

## 6. URL-Prüfung

- Zeigt die indexierte Fassung einer Seite und erlaubt einen Live-Test. Zeigt die vom Betreiber angegebene und die von Google gewählte Hauptfassung (kanonische URL). `[Fakt · M-Q11]`
- **Indexierung beantragen:** mit Tageslimit je Property. Ein Antrag garantiert nichts. Meist dauert es einen Tag, manchmal eine bis zwei Wochen oder länger. Wiederholte Anträge helfen nicht. `[Fakt · M-Q11]`
- **Für den Livegang:** Startseite und jede Leistungsseite einmal prüfen und einmal beantragen, dann warten. `[Vorschlag]`

---

## 7. Statistiken des Unternehmensprofils

- **Was es gibt:** Interaktionen gesamt, Suchbegriffe, Aufrufe des Profils in Suche und Maps, Routenanfragen, Anrufe (Klicks auf den Anruf-Knopf), Klicks auf die Website, Nachrichten, Buchungen und je nach Branche Menü, Produkte, Angebote. Nur Kennzahlen, die zum Betrieb passen, erscheinen. `[Fakt · M-Q14]`
- **Wie gezählt wird:** Aufrufe zählen eindeutige Personen, höchstens einmal pro Tag; wer auf mehreren Geräten oder in Suche und Maps schaut, zählt begrenzt mehrfach. Gezählt werden Aufrufe des Profils, nicht jede Erwähnung des Betriebs. Routenanfragen zählt Google seit einer Änderung ohne Mehrfachtipps, Abbrüche und Spam. `[Fakt · M-Q14]`
- **Verzögerung:** Die Suchbegriffe werden monatlich aktualisiert, bis zu 5 Tage nach Monatsbeginn. `[Fakt · M-Q14]`
- **Nur verifiziert:** Statistiken gibt es nur für verifizierte Profile. `[Fakt · M-Q14]`
- **Was sie nicht sagen:** Ein Klick auf «Anrufen» ist kein Gespräch. Ob jemand durchkam oder einen Auftrag gab, zeigt nur die eigene Zählung des Betriebs. `[Annahme, aus der Definition «Klick auf den Anruf-Knopf»]`

---

## 8. Was die Zahlen nicht sagen

### 8.1 Seltene Suchanfragen fehlen

- Suchanfragen, die nicht mehr als einige Dutzend Personen in 2 bis 3 Monaten stellen, zeigt Search Console zum Schutz der Privatsphäre nicht. In den Summen des Diagramms sind sie enthalten, in der Tabelle nicht. Sobald ein Filter gesetzt ist, fallen sie auch aus den Summen. `[Fakt · M-Q4, 19.10.2022]`
- **Folge für KMU:** Lokale Suchen wie «Schreiner Musterdorf Einbauschrank» sind selten. Ein grosser Teil der Klicks einer kleinen Website kann darum ohne Suchanfrage erscheinen. `[Annahme, aus M-Q4]`
- **Folge für den Abgleich mit dem Antwort-Plan:** Fehlt ein Begriff in der Tabelle, heisst das nicht, dass niemand danach sucht. `[Annahme]`

### 8.2 Grenzen der Tabelle

- Die Oberfläche zeigt und exportiert höchstens 1000 Zeilen. Die Schnittstelle (API) liefert bis 50 000 Zeilen pro Tag, Website und Suchtyp. `[Fakt · M-Q4]` Für die meisten KMU reichen 1000 Zeilen. `[Annahme]`

### 8.3 Verzögerung

- Die jüngsten Tage sind vorläufig. `[Fakt · M-Q2; M-Q7]` Eine Auswertung endet darum mit dem letzten Tag, der nicht mehr vorläufig ist, nicht mit gestern. `[Vorschlag]`

### 8.4 Die Durchschnittsposition täuscht

- Sie mittelt die oberste Position über alle Suchen mit Impression. `[Fakt · M-Q1]`
- **Beispiel** (erfunden): Die Schreinerei steht bei «Schreiner Musterdorf» auf Position 2. Neu erscheint sie auch bei «Einbauschrank planen» auf Position 38. Die Durchschnittsposition fällt, obwohl sich bei der wichtigen Suche nichts verschlechtert hat. Mehr Sichtbarkeit sieht dann aus wie ein Rückgang. `[Annahme, Rechnung aus der Definition]`
- **Folge:** Position nur je Suchanfrage und je Seite lesen, nie als Zahl für die ganze Website. `[Vorschlag]`
- Eine KI-Übersicht belegt eine Position. Ein Link darin hat dieselbe Position wie die Übersicht, auch wenn er weit unten in ihr steht. `[Fakt · M-Q1]`

### 8.5 Kleine Zahlen

- Bei 40 Impressionen und 2 Klicks liegt die CTR bei 5 Prozent. Ein Klick mehr ergibt 7,5 Prozent. Das sieht aus wie ein Zuwachs um die Hälfte und ist ein einzelner Mensch. `[Annahme, Rechnung]`
- Google nennt keine Mindestmenge für Vergleiche. `[Fakt · M-Q2; M-Q3, nicht erwähnt]` Arbeitsregel: Veränderungen unter 100 Impressionen oder unter 20 Klicks je Zeitraum und Begriff stehen im Bericht als «zu wenig Daten». `[Annahme]`
- Längere Zeiträume und Gruppen helfen: Leistungsseiten zusammen, alle Suchen mit Ortsnamen zusammen. `[Vorschlag]`

### 8.6 Saison, Updates, Technik

- **Laut Google** haben Rückgänge meist eine von sechs Ursachen: Änderungen am Algorithmus, technische Fehler, Sicherheitsprobleme, Spam-Verstösse, Saison oder neue Interessen, Umzug der Website. `[Fakt · M-Q12]`
- **Empfehlung laut Google:** 16 Monate ansehen, um wiederkehrende Rückgänge zu erkennen. Den Zeitraum mit dem Vorjahr vergleichen. Mit Google Trends prüfen, ob die Nachfrage überall fiel. `[Fakt · M-Q12]`
- **Folge für Schreinerei, Garage, Gartenbau:** Saison prägt die Nachfrage (Winterreifen, Heckenschnitt). Ein Vergleich «nach 8 Wochen gegen vor 8 Wochen» misst oft die Saison, nicht die neue Website. `[Annahme]`
- **Ein Umzug der Website** (neue Adressen der Seiten) kann laut Google Schwankungen bringen, solange Google neu crawlt. `[Fakt · M-Q12]` Ein Relaunch braucht darum Weiterleitungen von jeder alten auf die passende neue Adresse. `[Annahme]`

### 8.7 Was Search Console gar nicht misst

- Anfragen, Anrufe, Aufträge, Umsatz. Search Console endet beim Klick. `[Fakt · M-Q1: Klick ist der Schritt aus der Suche hinaus]`
- Rangfolge in Echtzeit an einem bestimmten Ort. Search Console mittelt über alle Suchenden. `[Annahme, aus M-Q1]`

---

## 9. Messplan vor dem Livegang

Ohne Ausgangswerte gibt es keinen Vergleich. Der Messplan entsteht **vor** dem Livegang und ist Teil von T8. `[Annahme; Verweis SKILL.md, Prüfpunkt T8]`

### 9.1 Was hinein gehört

| Punkt | Inhalt | Beispiel Schreinerei Muster |
|---|---|---|
| Ziel | eine Zahl, die der Betrieb wirklich will | Anfragen für Einbauschränke |
| Begriffe | 5 bis 10 Suchbegriffe aus dem Antwort-Plan, je mit Zielseite | «Schreiner Musterdorf» → Startseite; «Einbauschrank nach Mass» → /einbauschrank |
| Ausgangswerte Website | je Begriff und Seite Impressionen, Klicks, CTR, Position der letzten 3 Monate; 16 Monate als Datei sichern | aus dem Export, Datei mit Datum |
| Ausgangswerte Profil | Aufrufe, Anrufe, Routen, Website-Klicks der letzten 3 Monate | aus der Profil-Statistik |
| Eigene Zählung | Anfragen pro Woche nach Kanal (Telefon, Mail, Formular), vom Betrieb gezählt | Strichliste oder Tabelle beim Betrieb |
| Vorjahr | dieselben 8 Wochen im Vorjahr, für die Saison | Nov./Dez. Vorjahr |
| Technik | Indexierung der wichtigen Seiten, Sitemap «Erfolgreich», Core Web Vitals oder Labormessung | Liste mit Datum |
| Datum erste Auswertung | 8 Wochen nach Livegang, fest im Kalender | Livegang 12.01., Auswertung 09.03. |
| Wer liest | eine Person, die Zugriff hat und den Bericht schreibt | benannt, mit Rolle |

`[Annahme; 8 Wochen: Entscheid im Lehrplan der Text-Uni, Doktor D3; 16 Monate: Fakt · M-Q5]`

### 9.2 Warum 8 Wochen, und warum das wenig ist

- Indexieren dauert laut Google einen Tag bis zwei Wochen oder länger; Korrekturen zu bestätigen bis etwa zwei Wochen; Core Web Vitals laufen über 28 Tage. `[Fakt · M-Q11; M-Q8; M-Q9]` Nach 8 Wochen sind die ersten Effekte darum frühestens 4 bis 6 Wochen alt. `[Annahme, Rechnung]`
- Bei kleinen Zahlen zeigt eine erste Auswertung nach 8 Wochen eine Richtung, keinen Beweis. Eine zweite Auswertung nach 6 und nach 12 Monaten gegen das Vorjahr ist aussagekräftiger. `[Annahme]`

### 9.3 Wie der Bericht schreibt

- Jede Zahl mit Zeitraum, Quelle und Datum des Abrufs (B2). `[Verweis B2]`
- Vergleich immer zweifach: gegen den Zeitraum davor und gegen dasselbe Zeitfenster im Vorjahr. `[Fakt · M-Q12 empfiehlt Vorjahr; Regel: Annahme]`
- Wörter wie «Erfolg» oder «Durchbruch» nur mit Zahl; «zu wenig Daten», wo es so ist. `[Annahme; Verweis B1]`
- Ursache und Zusammenhang getrennt: «Klicks stiegen um 18 nach dem Livegang» ist ein Fakt; «wegen der neuen Texte» ist eine Annahme, solange Saison und Updates nicht ausgeschlossen sind. `[Annahme]`

---

## 10. Datenschutz und Zugriffsrechte

- **Was Google schützt:** Seltene Suchanfragen werden weggelassen, um die Privatsphäre der Suchenden zu schützen. Core Web Vitals erscheinen aus demselben Grund erst ab einer Mindestmenge. `[Fakt · M-Q4; M-Q9]`
- **Was der Bericht enthält:** zusammengefasste Werte nach Anfrage, Seite, Land, Gerät und Datum, keine einzelnen Besucher. `[Fakt · M-Q2 zu den Dimensionen; «keine einzelnen Besucher»: Annahme, aus den Dimensionen abgeleitet]`
- **Was trotzdem schützenswert ist:** Suchbegriffe, Zahlen und Fehler einer Website sind Geschäftsdaten des Betriebs. Wer sie sieht, bestimmt der Betrieb. `[Annahme]`
- **Rollen laut Google:** Inhaber (bestätigt mit eigenem Nachweis oder delegiert), Voller Nutzer (sieht alle Daten, kann einiges tun), Eingeschränkter Nutzer (sieht die meisten Daten), Verknüpfung (handelt für die Website, sieht die Daten nicht). Nur Inhaber vergeben Rechte. `[Fakt · M-Q13]`
- **Aufräumen laut Google:** Wer geht, verliert den Zugang. Bei einem bestätigten Inhaber zusätzlich den Nachweis löschen (Datei, Tag, DNS-Eintrag), sonst kann er sich wieder bestätigen. Ein unbekannter Inhaber kann ein Zeichen für einen Angriff sein. `[Fakt · M-Q13]`
- **Unternehmensprofil:** Statistiken sieht, wer Zugriff auf das Profil hat. `[Annahme, aus M-Q14 «verifiziert»]` Dieselbe Ordnung wie bei Search Console: der Betrieb ist Inhaber, Helfer bekommen die kleinste Rolle, die reicht. `[Vorschlag]`
- **Wenn in der Schweiz:** Wer Search Console mit anderen Werkzeugen verknüpft (etwa Analyse-Werkzeugen auf der Website), prüft deren Datenschutz eigens. Dieses Skript ist keine Rechtsauskunft. `[Annahme]`

---

## 11. Prüfbare Grundsätze

Jede Regel kann ein Werkzeug oder ein Bewerter ohne Vorwissen entscheiden. Grenzwerte ohne Studie sind `[Annahme]`.

**Lesen**

- **M1 Begriffe richtig verwendet.** Impression, Klick, CTR und Position stehen im Bericht so, wie Google sie definiert. Prüffrage: Steht irgendwo «Besucher» für Impressionen oder «Anrufe» für Klicks auf den Anruf-Knopf? Ja ist ein Befund. `[Fakt · M-Q1; M-Q14]`
- **M2 Position nur je Begriff.** Die durchschnittliche Position steht nie als eine Zahl für die ganze Website, nur je Suchanfrage und Seite. `[Fakt · M-Q1, Definition; Regel: Annahme]`
- **M3 Kleine Zahlen gekennzeichnet.** Unter 100 Impressionen oder unter 20 Klicks je Begriff und Zeitraum steht «zu wenig Daten» statt einer Prozentveränderung. `[Annahme]`
- **M4 Lücke ist kein Nein.** Fehlt ein Begriff in der Tabelle, schreibt der Bericht «nicht sichtbar, möglicherweise anonymisiert», nicht «niemand sucht danach». `[Fakt · M-Q4]`
- **M5 Vorläufige Tage ausgeschlossen.** Jede Auswertung endet am letzten nicht mehr vorläufigen Tag und nennt die Zeitzone (pazifische Zeit). `[Fakt · M-Q2; M-Q7; Regel: Annahme]`
- **M6 Website oder Seite genannt.** Jede Summe sagt, ob sie nach Website oder nach Seite gruppiert ist. `[Fakt · M-Q1]`

**Technik**

- **M7 Wichtige Seiten indexiert.** Startseite und jede Seite aus dem Antwort-Plan stehen als indexiert. Jede davon unter «Gecrawlt» oder «Gefunden, zurzeit nicht indexiert» ist ein Befund. Nicht-indexierte Weiterleitungen, Duplikate und `noindex` sind kein Befund. `[Fakt · M-Q8; Auswahl: Annahme]`
- **M8 Sitemap erfolgreich.** Status «Erfolgreich», und «Gefundene Seiten» weicht um höchstens 10 Prozent von der Zahl der echten Seiten ab. `[Fakt · M-Q10 zum Status; 10 %: Annahme]`
- **M9 Core Web Vitals gut oder Labor genannt.** LCP bis 2,5 s, INP bis 200 ms, CLS bis 0,1 am 75. Perzentil. Ohne Felddaten steht der Labor-Wert, gekennzeichnet als Labor. `[Fakt · M-Q9; Ersatz: Vorschlag]`
- **M10 Indexierung einmal beantragen.** Je Seite höchstens ein Antrag pro Änderung. `[Fakt · M-Q11: Wiederholen hilft nicht]`

**Messplan**

- **M11 Messplan vor dem Livegang.** Er liegt vor dem Livegang vor und enthält: Ziel, 5 bis 10 Begriffe mit Zielseite, Ausgangswerte Website und Profil der letzten 3 Monate, eigene Zählung der Anfragen, Datum der ersten Auswertung. Fehlt ein Punkt, ist T8 nicht bestanden. `[Annahme; Verweis SKILL.md, Prüfpunkt T8]`
- **M12 16 Monate gesichert.** Vor dem Livegang ist ein Export der letzten 16 Monate mit Datum gespeichert, beim Betrieb, nicht im Repo. `[Fakt · M-Q5: 16 Monate; Rest: Annahme]`
- **M13 Erste Auswertung nach 8 Wochen, fest.** Das Datum steht im Plan. Der Bericht vergleicht gegen den Zeitraum davor und gegen dasselbe Fenster im Vorjahr. `[Fakt · M-Q12 empfiehlt Vorjahr; 8 Wochen: Lehrplan der Text-Uni, D3]`
- **M14 Eigene Zählung neben Google.** Anfragen nach Kanal zählt der Betrieb selbst, ab dem Ausgangszeitraum. Ohne sie gilt keine Aussage über Wirkung auf Aufträge. `[Annahme, aus 8.7]`
- **M15 Ursache nur mit Ausschluss.** «Wegen der neuen Texte» steht nur, wenn Saison (Vorjahr), Updates und technische Fehler geprüft und genannt sind. Sonst «zeitgleich mit». `[Fakt · M-Q12, sechs Ursachen; Regel: Annahme]`
- **M16 Profil-Zahlen mit Zählweise.** Aufrufe heissen «eindeutige Personen pro Tag», Anrufe heissen «Klicks auf Anrufen». Suchbegriffe des Profils erst nach dem 5. des Folgemonats auswerten. `[Fakt · M-Q14]`

**Zugriff**

- **M17 Betrieb ist Inhaber.** Der Betrieb selbst ist bestätigter Inhaber von Search Console und Unternehmensprofil. Helfer haben die kleinste nötige Rolle. `[Fakt · M-Q13 zu den Rollen; Regel: Vorschlag]`
- **M18 Zugänge aufgeräumt.** Mindestens einmal pro Jahr und bei jedem Wechsel: 0 Nutzer ohne Aufgabe, 0 verwaiste Nachweise von früheren Inhabern. `[Fakt · M-Q13; Rhythmus: Annahme]`
- **M19 Keine Rohdaten im Repo.** Exporte aus Search Console und Profil liegen beim Betrieb. Im Repo stehen höchstens zusammengefasste Kennzahlen. `[Annahme]`

---

## Quellen

Alle abgerufen am 01.11.2026. Google-Hilfeseiten auf Englisch gelesen; Übersetzungen der Begriffe sind eigene und können von der deutschen Oberfläche abweichen.

- **M-Q1** Search Console Help: «What are impressions, position, and clicks?» https://support.google.com/webmasters/answer/7042828
- **M-Q2** Search Console Help: «Performance report (Search results): Overview and basic setup». https://support.google.com/webmasters/answer/7576553
- **M-Q3** Search Console Help: «Performance report (Search results): Advanced filtering and comparison». https://support.google.com/webmasters/answer/17011165
- **M-Q4** Daniel Waisberg, Google Search Central Blog: «A deep dive into Search Console performance data filtering and limits», 19.10.2022. https://developers.google.com/search/blog/2022/10/performance-data-deep-dive
- **M-Q5** Google Search Central Blog: «Introducing the new Search Console», Januar 2018 (16 Monate Daten). https://developers.google.com/search/blog/2018/01/introducing-new-search-console
- **M-Q6** Google Search Central Blog: «An improved way to view your recent performance data in Search Console», Dezember 2024. https://developers.google.com/search/blog/2024/12/recent-data-search-console
- **M-Q7** Google for Developers: «Search Analytics: query», Search Console API (Zeitzone, vorläufige Daten). https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- **M-Q8** Search Console Help: «Page indexing report». https://support.google.com/webmasters/answer/7440203
- **M-Q9** Search Console Help: «Core Web Vitals report». https://support.google.com/webmasters/answer/9205520
- **M-Q10** Search Console Help: «Sitemaps report». https://support.google.com/webmasters/answer/7451001
- **M-Q11** Search Console Help: «URL Inspection tool». https://support.google.com/webmasters/answer/9012289
- **M-Q12** Google Search Central: «Debugging drops in Google Search traffic». https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops
- **M-Q13** Search Console Help: «Managing owners, users, and permissions». https://support.google.com/webmasters/answer/2453966
- **M-Q14** Google Business Profile Help: «Understand your Business Profile performance & insights». https://support.google.com/business/answer/9918094
