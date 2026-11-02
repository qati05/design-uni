# Titel, Snippet, Struktur · Skript Semester 3

Stand 01.11.2026 · Text-Uni, Semester 3 «Google-Suche».

> **Worum es geht:** wie ein Treffer in Google aussieht und was der Betrieb daran steuern kann. Titel und Beschreibung, Überschriften, Links, Bilder, Adressen der Seiten, strukturierte Daten und die Regel «eine Seite je Absicht». Dazu Daten von Menschen: Wer klickt in Suchergebnissen auf was?
>
> **Gelesen am 01.11.2026, online** (Nummern wie in «Quellen» am Ende):
> S-Q1 Titel-Links (Stand 10.12.2025) · S-Q2 Blog zu Seitentiteln (24.08.2021) · S-Q3 Snippets und Meta-Beschreibung (20.04.2026) · S-Q4 Link Best Practices (10.12.2025) · S-Q5 Bild-SEO (02.03.2026) · S-Q6 URL-Struktur (21.10.2026) · S-Q7 Allgemeine Richtlinien für strukturierte Daten (10.07.2026) · S-Q8 LocalBusiness (08.09.2026) · S-Q9 Organization (08.09.2026) · S-Q10 BreadcrumbList (08.09.2026) · S-Q11 Review-Snippets (08.09.2026) · S-Q12 Blog zu HowTo und FAQ (08.08.2023) · S-Q13 Änderungsliste Search Central (bis 26.10.2026) · S-Q14 Kanonische URL (10.07.2026) · S-Q15 SEO-Starter-Guide (10.12.2025) · S-Q16 Lokalisierte Fassungen (21.09.2026) · S-Q17 Mehrsprachige und regionale Websites (10.12.2025) · S-Q18 Joachims u. a. 2005 · S-Q19 Yue, Patel, Roehrig 2010 · S-Q20 Pew Research Center 2025 · S-Q21 Advanced Web Ranking 2026 · S-Q22 Sistrix 2020 · S-Q23 Sistrix 2026 (Deutschland) · S-Q24 Backlinko 2019, aktualisiert 2025 · S-Q25 Zyppy 2022, aktualisiert 2026 · S-Q26 Ahrefs 2020 · S-Q27 SearchPilot (Fallstudie «best»).
>
> **Nicht gelesen:** Joachims u. a. im Volltext (nur Zusammenfassung von Methode und Ergebnis über einen Abrufdienst); die Zahlen der Advanced-Web-Ranking-Studie stehen nur in einem Diagramm, gelesen habe ich die Zusammenfassung und die Methodenseite. Die Studie von Sistrix zu Deutschland nennt ihre Methode nicht im Detail.
>
> **Nicht gefunden:** Klickdaten aus der Schweiz. Eine begutachtete Studie zu Zahlen oder Fragen im Titel von Suchergebnissen (nur Nachrichten-Titel, siehe Semester 2, U-Q17). Was dazu steht, ist `[Annahme]`.
>
> Herkunft: `[Fakt · Quelle, Datum]`, `[Annahme]`, `[Meinung · Autor]`. **`[Regel laut Google · Quelle, Datum]`** heisst: So steht es bei Google. Ein Fakt über Googles Absicht, kein Beleg für Rang oder Klicks.

**Boden aus Semester 1 und 2 und aus «Google-Grundlagen».** Was dort steht, gilt hier und wird nur mit der ID zitiert: Seitentitel 40 bis 60 Zeichen (U4), Titel wählt aus, nennt Leistung und Ort und ist konkret (A17 bis A19), Überschrift als Aussage (U1, V3, L6), wichtiges Wort vorn (L8), Linktext nennt das Ziel (L14), kein Eszett (CH1), Preisform (CH7, CH8, R13, R14), Bewertungsschnitt mit Anzahl, Plattform und Datum (B4, R8), Stimmen echt (R7), keine erfundene Frage (KW12), FAQ als Kundenfrage (KW11), keine Ortsliste und keine Ortsseiten ohne eigenen Inhalt (G3, G5), KI-Metadaten geprüft (G21).

**Abgrenzung.** Wie die Seite aussieht und wo Überschriften, Links und Knöpfe stehen, entscheidet der Schwester-Skill design-uni. Dieses Skript regelt die **Wörter und Auszeichnungen**, die Google liest und zeigt. Welche Seiten es überhaupt gibt, steht in «Suchabsicht und Seitenplan».

**Schreibweise der Beispiele.** Floskeln stehen mit Mittelpunkt im Wort, etwa «Will·kommen». Alle Betriebe sind erfunden. Adressen enden auf `.example`, damit keine echte Domain gemeint ist.

---

## 1. Grundbegriffe

- **Treffer:** ein Eintrag in den Suchergebnissen. Er besteht meist aus Websitename, sichtbarer Adresse, **Titel-Link** und **Snippet**. `[Regel laut Google · S-Q1; S-Q3]`
- **Titel-Link:** die verlinkte Überschrift des Treffers. Google erzeugt ihn automatisch, vor allem aus dem `<title>`-Element. `[Regel laut Google · S-Q1]`
- **Snippet:** die Beschreibung unter dem Titel. Google nimmt sie vor allem aus dem Inhalt der Seite, manchmal aus der Meta-Beschreibung. `[Regel laut Google · S-Q3]`
- **Meta-Beschreibung:** `<meta name="description">`, eine kurze Zusammenfassung der Seite für Suchmaschinen. Besucher sehen sie auf der Seite nicht. `[Regel laut Google · S-Q3]`
- **Rich Result:** ein Treffer mit Zusätzen wie Sternen, Brotkrumen oder Fragen. Grundlage sind oft **strukturierte Daten**: maschinenlesbare Angaben nach schema.org im Code der Seite. `[Regel laut Google · S-Q7]`
- **Ankertext:** der sichtbare Text eines Links. `[Regel laut Google · S-Q4]`
- **Kanonische URL:** die eine Adresse, die Google für eine Gruppe gleicher oder fast gleicher Seiten zeigt. `[Regel laut Google · S-Q14]`
- **CTR (Klickrate):** Anteil der Einblendungen eines Treffers, die zu einem Klick führen. `[Fakt · S-Q21]`

---

## 2. Titel-Links

### 2.1 Was Google sagt

**Woraus Google den Titel bildet.** Neun Quellen: `<title>`, der sichtbare Haupttitel, Überschriften wie `<h1>`, `og:title`, anderer grosser und auffälliger Text, sonstiger Text der Seite, Ankertexte auf der Seite, Ankertexte von Links, die auf die Seite zeigen, und strukturierte Daten vom Typ `WebSite`. Änderungen sieht Google erst nach erneutem Crawlen, nach einigen Tagen bis Wochen. `[Regel laut Google · S-Q1, 10.12.2025]`

**Wie oft das `<title>`-Element gewinnt.** Seit August 2021 bildet Google Titel nicht mehr je nach Suchanfrage. Das `<title>`-Element ist mit Abstand die häufigste Quelle, laut Google in über 80 % der Fälle. `[Regel laut Google · S-Q2, 24.08.2021]`

**Best Practices.** `[Regel laut Google · S-Q1]`

- Jede Seite hat ein `<title>`.
- Der Titel beschreibt die Seite knapp. Keine leeren Wörter wie «Home» oder «Profil». Keine überlangen Titel. Eine Längengrenze gibt es nicht, aber Google kürzt nach Bildschirmbreite.
- Kein Keyword-Stuffing: dasselbe Wort mehrmals hilft niemandem und wirkt nach Spam.
- Kein Titel, der auf allen Seiten gleich ist oder sich nur in einem Wort unterscheidet.
- Der Name der Website kurz, am Anfang oder am Ende, getrennt mit Bindestrich, Doppelpunkt oder senkrechtem Strich. Längere Zusätze zur Marke nur auf der Startseite.
- Ein klarer Haupttitel auf der Seite, etwa im ersten sichtbaren `<h1>`, grösser als alles andere.
- Titel in derselben Sprache und Schrift wie der Hauptinhalt.

**Wann Google umschreibt.** Google ersetzt den Titel, wenn es ein Problem erkennt. Häufige Fälle: halb leere Titel («| Firmenname»), veraltete Jahreszahlen, Titel, die nicht zum Inhalt passen, gleiche Textbausteine auf vielen Seiten, kein klarer Haupttitel, andere Sprache als der Inhalt, doppelter Websitename. `[Regel laut Google · S-Q1]` Gründe für das Ersetzen laut Google: zu lang, mit Suchwörtern vollgestopft, fehlend oder Textbaustein. `[Regel laut Google · S-Q2]`

### 2.2 Was Messungen zeigen

- **Umschreiben ist häufig.** Zyppy verglich Anfang 2022 80 959 Titel von 2370 Websites mit den Desktop-Treffern. Google hatte 61,6 % umgeschrieben, viele davon nur wenig. Titel mit 1 bis 5 Zeichen wurden zu 96,6 % umgeschrieben, Titel über 70 Zeichen zu 99,9 %. Am seltensten traf es Titel mit 51 bis 60 Zeichen (39 bis 42 %). Teile in eckigen Klammern strich Google in 32,9 % der Fälle ganz, Teile in runden Klammern in 19,7 %. Senkrechte Striche ersetzte oder entfernte Google in 41,0 % der Fälle, Bindestriche in 19,7 %. `[Fakt · S-Q25; Anbieter eines Titel-Werkzeugs, eigene Datenbank, keine Begutachtung]`
- **Widerspruch zu Google?** Nicht unbedingt. Google zählt, wie oft der Titel aus dem `<title>`-Element stammt. Zyppy zählt jede Abweichung, auch kleine. `[Annahme]`
- Was ein Umschreiben für die Klicks heisst, misst keine der beiden Quellen. `[Fakt · S-Q2; S-Q25]`

### 2.3 Was daraus folgt

- **Muster für Firmenseiten:** «Leistung in Ort, prüfbares Detail | Betrieb». Leistung zuerst (L8), Ort dabei (A18), ein Detail wie Frist oder Preis (A19), der Name am Ende. `[Regel laut Google · S-Q1; S-Q15: Name, Ort und Angebot im Titel; Reihenfolge: Annahme nach L8]`
- **Länge 40 bis 60 Zeichen.** Das stützen drei schwache Quellen in dieselbe Richtung: NN/g (U4), die Umschreib-Daten von Zyppy und die Klickdaten von Backlinko (Teil 10). `[Fakt · S-Q24; S-Q25; U4; Grenze als Regel: Annahme]`
- **Titel und `<h1>` sagen dasselbe.** Nicht wörtlich gleich, aber dieselbe Leistung und denselben Ort. Weicht beides stark ab, nimmt Google eher den sichtbaren Titel. `[Regel laut Google · S-Q1; Zyppy rät ebenso, S-Q25]`
- **Trennzeichen:** senkrechter Strich oder Doppelpunkt. Keine eckigen Klammern. `[Fakt · S-Q25; Wahl: Annahme]`

### 2.4 Beispiel: Malerei Muster, Musterdorf (erfunden)

| Schwach | Besser |
|---|---|
| `Home` | `Maler in Musterdorf, Offerte in 5 Tagen \| Malerei Muster` (56 Zeichen) |
| `Leistungen \| Malerei Muster` (auf jeder Unterseite gleich) | `Wohnung streichen in Musterdorf \| Malerei Muster` (48 Zeichen) |
| `Will·kommen bei Malerei Muster [NEU 2026]` | `Fassade streichen in Musterdorf \| Malerei Muster` |

---

## 3. Meta-Beschreibung und Snippets

### 3.1 Was Google sagt

- **Snippet kommt meist vom Inhalt.** Google wählt den Text, der am besten zur Suchanfrage passt. Darum kann derselbe Treffer bei verschiedenen Suchen verschiedene Snippets zeigen. Die Meta-Beschreibung nimmt Google, wenn sie die Seite genauer beschreibt als der Inhalt. `[Regel laut Google · S-Q3, 20.04.2026]`
- **Keine Längengrenze,** aber Google kürzt nach Bildschirmbreite. `[Regel laut Google · S-Q3]`
- **Je Seite eine eigene Beschreibung.** Gleiche Beschreibungen auf allen Seiten helfen nicht. Wer keine Zeit hat, schreibt zuerst für Startseite und meistbesuchte Seiten. `[Regel laut Google · S-Q3]`
- **Fakten bündeln.** Die Beschreibung muss kein ganzer Satz sein. Sie darf Angaben bündeln, die auf der Seite verstreut sind. Googles Beispiel für ein Geschäft: was es verkauft, Öffnungszeiten, Lage. `[Regel laut Google · S-Q3]`
- **Wortlisten zeigt Google seltener.** Eine Beschreibung aus aneinandergereihten Suchwörtern sagt nichts über die Seite und wird seltener als Snippet gezeigt. `[Regel laut Google · S-Q3]`
- **Steuern und verhindern.** `nosnippet` verhindert ein Snippet, `max-snippet:[Zahl]` begrenzt die Länge, `data-nosnippet` schliesst Teile der Seite aus. `[Regel laut Google · S-Q3]`
- **Sprunglinks «Mehr lesen».** Seit April 2026 beschreibt Google Links im Snippet, die zu einem Abschnitt der Seite springen. Dafür muss der Inhalt sofort sichtbar sein, nicht hinter Reitern oder Akkordeons, und kein Skript darf die Scrollposition beim Laden erzwingen. `[Regel laut Google · S-Q3; S-Q13, 20.04.2026]`
- **Der Starter-Guide sagt:** Eine gute Meta-Beschreibung ist kurz, gilt nur für diese eine Seite und enthält das Wichtigste der Seite, typisch ein bis zwei Sätze. `[Regel laut Google · S-Q15]`

### 3.2 Was Messungen zeigen

- **Google ersetzt die Beschreibung oft.** Ahrefs verglich 2020 die hinterlegten Meta-Beschreibungen mit den Desktop-Snippets für 20 000 Suchbegriffe. Google zeigte in 62,78 % der Fälle einen anderen Text, bei häufigen Suchbegriffen 59,65 %, bei seltenen 65,62 %. 40,61 % der 192 656 untersuchten Beschreibungen waren zu lang für die Anzeige. `[Fakt · S-Q26; Anbieter eines SEO-Werkzeugs, eine Messung, keine Begutachtung]`

### 3.3 Was daraus folgt

- **Der erste Absatz ist das zweite Snippet.** Weil Google meist aus dem Inhalt zieht, muss der erste Absatz die Frage beantworten (V1, L1). Die Meta-Beschreibung ist die zweite Chance. `[Regel laut Google · S-Q3; Übertragung: Annahme]`
- **Beschreibung als Angebot mit Fakten:** Leistung, Ort, ein prüfbares Detail, was als Nächstes passiert. Keine Wortliste, keine Floskel. `[Regel laut Google · S-Q3; Inhalt: Annahme nach A1 und U8]`
- **Länge:** 110 bis 155 Zeichen, damit am Handy das Wichtige vor der Kürzung steht. Google nennt keine Zahl. `[Annahme]`

### 3.4 Beispiel: Malerei Muster, Musterdorf (erfunden)

- Schwach: «Malerei Muster, Ihr Ma·ler für alle Fälle. Qualität, die über·zeugt. Kontaktieren Sie uns noch heute.»
- Besser: «Wir streichen Wohnungen und Häuser in Musterdorf und Umgebung. 3-Zimmer-Wohnung in 3 Arbeitstagen, Offerte nach Besichtigung innert 5 Arbeitstagen.» (147 Zeichen)

---

## 4. Überschriften

### 4.1 Was Google sagt

- **Suchwörter an sichtbare Stellen,** darunter Titel und Hauptüberschrift. `[Regel laut Google · G-Q1 im Skript «Google-Grundlagen»]`
- **Ein klarer Haupttitel.** Gibt es mehrere gleich grosse Überschriften, nimmt Google womöglich die erste als Titel-Link. `[Regel laut Google · S-Q1]`
- **Reihenfolge und Anzahl zählen für Google nicht.** Für Bildschirmleser ist die richtige Reihenfolge gut. Eine ideale Zahl gibt es nicht. `[Regel laut Google · S-Q15]`
- **Überschriften gehören zum Hauptinhalt.** Sie fassen das Thema zusammen und helfen bei der Entscheidung, die Seite zu besuchen. Die Hauptüberschrift soll hilfreich zusammenfassen und nicht übertreiben. `[Regel laut Google · G-Q4 im Skript «Google-Grundlagen»]`
- **Lange Texte gliedern** mit Absätzen und Überschriften. `[Regel laut Google · S-Q15]`

### 4.2 Was daraus folgt

- Pro Seite ein `<h1>` mit Leistung und Ort (A18). Zwischentitel als Aussage (U1, V3, L6). Die Reihenfolge `h1`, `h2`, `h3` ohne Sprünge, wegen der Bildschirmleser, nicht wegen Google. `[Regel laut Google · S-Q1; S-Q15; Übertragung: Annahme]`
- Passage Ranking erkennt einzelne Abschnitte. Ein Zwischentitel, der eine echte Kundenfrage aufnimmt, hilft Leser und Abschnitt (KW11). Ob er den Rang hebt, ist nicht belegt. `[Regel laut Google · G-Q9 im Skript «Google-Grundlagen»; Wirkung: Annahme]`

---

## 5. Interne Links und Ankertext

### 5.1 Was Google sagt

`[Regel laut Google · S-Q4, 10.12.2025]`

- **Folgbare Links:** Google folgt sicher nur `<a>`-Elementen mit `href`. Links nur über Skript-Ereignisse liest Google nicht zuverlässig.
- **Guter Ankertext** ist beschreibend, eher knapp und passt zur Seite und zum Ziel. Googles Probe: den Linktext allein lesen. Weiss man dann nicht, worum es geht, ist er zu allgemein. Beispiele für zu allgemein: «Website», «Artikel».
- **Nicht zu lang** und nicht mit Suchwörtern gefüllt. Frage: Braucht die Leserin diese Wörter, um die nächste Seite zu verstehen?
- **Zusammenhang zählt.** Die Wörter vor und nach dem Link wirken mit. Keine Ketten aus Links direkt nebeneinander.
- **Bild als Link:** Google nimmt den Alt-Text als Ankertext.
- **Jede wichtige Seite** bekommt mindestens einen Link von einer anderen Seite der eigenen Website, im Zusammenhang. Eine ideale Zahl von Links gibt es nicht.
- **Externe Links** sind erwünscht, etwa um Quellen zu belegen. `nofollow` nur bei Quellen, denen man nicht traut; bezahlte Links mit `sponsored` oder `nofollow`.

### 5.2 Was daraus folgt

- Linktext nennt das Ziel (L14), mit dem Wort der Kundschaft (KW6). «Preise für Fassaden» statt «hier». Das Floskel-Werkzeug meldet «hier klicken» als Fehler. `[Regel laut Google · S-Q4; Werkzeug: slop-de.js]`
- Jede Leistungsseite ist von der Startseite oder einer Übersicht aus mit einem Link erreichbar, und jede Leistungsseite verlinkt die Seite für die Anfrage. `[Regel laut Google · S-Q4; Ziel der Anfrage: Annahme]`
- Externe Links auf Belege (Verband, Prüfstelle, Bewertungsplattform) stützen das Vertrauen, ohne `nofollow` (B3). `[Regel laut Google · S-Q4]`

---

## 6. Bilder und Alt-Text

### 6.1 Was Google sagt

`[Regel laut Google · S-Q5, 02.03.2026]`

- **Bilder neben passenden Text** und auf Seiten, die zum Bild passen. Google liest Bildunterschriften und Titel mit.
- **Dateinamen kurz und beschreibend.** Googles Beispiel: `my-new-black-kitten.jpg` statt `IMG00023.JPG`. Bei übersetzten Seiten auch die Dateinamen übersetzen.
- **Alt-Text ist das wichtigste Attribut.** Er hilft Menschen mit Bildschirmlesern und langsamer Verbindung. Google nutzt ihn zusammen mit Bilderkennung und dem Seiteninhalt.
- **Kein Keyword-Stuffing im Alt-Text.** Googles schlechtes Beispiel ist eine lange Liste von Hundewörtern; das gute ist ein kurzer Satz, der das Bild beschreibt.
- **Vorschaubild festlegen:** über schema.org (`primaryImageOfPage` oder `image`) oder `og:image`. Google nutzt beides. `[Regel laut Google · S-Q5; S-Q13, März 2026]`
- **Formate:** BMP, GIF, JPEG, PNG, WebP, SVG und AVIF; die Dateiendung passt zum Format.
- **Alt-Texte aus KI** gehören in die menschliche Prüfung. `[Regel laut Google · G-Q5 im Skript «Google-Grundlagen»]`

### 6.2 Was daraus folgt

- Alt-Text beschreibt, was zu sehen ist, mit Ort und Gegenstand, in einem Satz: «Frisch gestrichene Fassade eines Einfamilienhauses in Musterdorf». Nicht «Maler Musterdorf Fassade Maler günstig». `[Regel laut Google · S-Q5; Beispiel: Annahme]`
- Reine Schmuckbilder bekommen ein leeres `alt=""`, damit Bildschirmleser sie überspringen. `[Annahme; Google verweist für Zugänglichkeit auf die W3C-Richtlinien, S-Q5]`
- Dateiname wie der Alt-Text, kurz, mit Bindestrichen: `fassade-einfamilienhaus-musterdorf.jpg`. `[Regel laut Google · S-Q5; S-Q6]`

---

## 7. URL-Struktur

### 7.1 Was Google sagt

`[Regel laut Google · S-Q6, 21.10.2026]`

- **Lesbare Wörter statt langer Nummern.**
- **Wörter in der Sprache der Zielgruppe.** Googles Beispiel für Deutsch: `/lebensmittel/pfefferminz`.
- **Zeichen ausserhalb von ASCII prozentkodiert** in Links, etwa `gem%C3%BCse` statt `gemüse`.
- **Bindestriche statt Unterstriche** zwischen Wörtern. Zusammengeschriebene Wörter trennt Google schlechter. Klargestellt im Oktober 2026.
- **Wenige Parameter.** Parameter, die den Inhalt nicht ändern, weglassen.
- **Gross- und Kleinschreibung zählt.**
- **Kein Inhalt hinter `#`.** Google unterstützt Fragmente meist nicht.
- Suchwörter im Pfad haben allein kaum Wirkung auf den Rang, ausser in den Brotkrumen. `[Regel laut Google · S-Q15]`

### 7.2 Was Messungen zeigen

- Backlinko fand eine um 45 % höhere Klickrate bei Adressen, die dem Suchbegriff ähneln. Nur 6,3 % der Adressen waren sehr ähnlich. Das ist ein Zusammenhang, keine Ursache. `[Fakt · S-Q24; Anbieter, Korrelation]`

### 7.3 Was daraus folgt

- Kurze, lesbare Pfade in der Sprache der Kundschaft, klein geschrieben, mit Bindestrich: `/fassade-streichen`. Keine Jahreszahl, keine Nummer, kein Ortsstapel. `[Regel laut Google · S-Q6; Länge: Annahme]`
- Eine Adresse ändert man nach dem Livegang nur mit Weiterleitung (Teil 9). `[Regel laut Google · S-Q14; Annahme]`

---

## 8. Strukturierte Daten

### 8.1 Allgemeine Regeln laut Google

`[Regel laut Google · S-Q7, 10.07.2026]`

- **Keine Garantie.** Auch korrekte Daten führen nicht sicher zu einem Rich Result.
- **Nur sichtbarer Inhalt.** Was in den Daten steht, steht auch für Besucher auf der Seite.
- **Wahr, aktuell, nicht irreführend.** Keine gefälschten Bewertungen, nichts, was nicht zum Thema der Seite gehört, keine falsche Identität.
- **Vollständig.** Ohne Pflichtfelder kein Rich Result. Mehr empfohlene Felder machen den Treffer besser.
- **Möglichst genauer Typ** nach schema.org.
- **Folge eines Verstosses:** Eine manuelle Massnahme für strukturierte Daten nimmt das Rich Result weg, ändert aber nicht den Rang in der Websuche.

### 8.2 Typen für kleine Betriebe

| Typ | Was Google dazu schreibt | Stand |
|---|---|---|
| **LocalBusiness** | Pflicht: `name`, `address`. Empfohlen u. a.: `telephone`, `url`, `openingHoursSpecification`, `priceRange`, `image`, `department`. Den genauesten Untertyp wählen (z. B. `Restaurant`, `Plumber`); mehrere Typen als Liste. Weil LocalBusiness ein Untertyp von Organization ist, empfiehlt Google auch deren Felder. `aggregateRating` nur für Websites, die Bewertungen über **andere** Betriebe sammeln. | S-Q8, 08.09.2026 |
| **Organization** | Auf der Startseite. Keine Pflichtfelder; so viele passende Felder wie möglich. Hilft Google, die Organisation zu erkennen, und kann etwa das gezeigte Logo beeinflussen. | S-Q9, 08.09.2026 |
| **BreadcrumbList** | Zeigt die Lage der Seite in der Gliederung. Seit Januar 2025 nur noch in Treffern am Desktop, nicht am Handy. | S-Q10; S-Q13, Januar 2025 |
| **FAQPage** | Seit 08.08.2023 nur noch für bekannte, massgebliche Websites von Behörden und Gesundheit. Seit 07.05.2026 zeigt Google das FAQ-Rich-Result gar nicht mehr; die Dokumentation ist seit Juni 2026 entfernt. Ungenutzte strukturierte Daten schaden laut Google nicht, bringen aber keine sichtbare Wirkung. | S-Q12; S-Q13, 08.05.2026 und Juni 2026 |
| **HowTo** | Seit 13.09.2023 nicht mehr angezeigt. | S-Q12 |
| **Review, AggregateRating** | Siehe 8.3. | S-Q11 |

Alle Zeilen: `[Regel laut Google · Quelle in der Zeile]`.

### 8.3 Bewertungen in strukturierten Daten

`[Regel laut Google · S-Q11, 08.09.2026; S-Q13]`

- **Keine Selbstbewertung mit Sternen.** Kontrolliert ein Betrieb die Bewertungen über sich selbst, sind seine Seiten mit LocalBusiness oder Organization nicht berechtigt für Sterne in den Treffern. Das gilt auch für eingebettete Widgets fremder Plattformen, etwa Google- oder Facebook-Bewertungen auf der eigenen Website.
- **Bewertungen kommen von Nutzern.** Keine Redaktion, die Bewertungen für lokale Betriebe erstellt oder zusammenstellt.
- **Keine Bewertungen anderer Websites zusammenfassen.**
- **Keine gefälschten oder versteckt belohnten Bewertungen** (neu seit 24.07.2026): keine Bewertung ohne echte Erfahrung, keine Bewertung gegen Geld, Rabatt, Gutschein oder Gratisware ohne klaren Hinweis.
- **Empfehlung seit 15.01.2025:** nur Bewertungen mit Kommentar und Namen annehmen.
- **Sichtbar:** Was ausgezeichnet ist, sehen Besucher auf der Seite.

### 8.4 Was daraus folgt

- Für einen lokalen Betrieb reicht meist: `LocalBusiness` mit dem genauesten Untertyp auf Startseite und Kontaktseite, `Organization`-Felder wie Logo, dazu `BreadcrumbList` bei mehr als zwei Ebenen. `[Regel laut Google · S-Q8; S-Q9; S-Q10; Auswahl: Annahme]`
- **Keine Sterne in eigenen Daten.** `aggregateRating` und `review` für den eigenen Betrieb sind für Sterne wirkungslos und widersprechen der Richtlinie, wenn die Bewertungen aus einem eigenen Widget stammen. Bewertungen zeigt man sichtbar nach B4 und R8. `[Regel laut Google · S-Q8; S-Q11]`
- **FAQ für Menschen, nicht für Google.** Fragen der Kundschaft beantwortet man weiter (KW10, KW11). Ein Rich Result gibt es dafür nicht mehr. `FAQPage`-Daten darf man stehen lassen, sie bringen nichts. `[Regel laut Google · S-Q12; S-Q13]`
- **Jede Angabe in den Daten** steht auch sichtbar und stimmt mit den Fakten des Betriebs überein: Name, Adresse, Telefon, Öffnungszeiten (B8, G21). `[Regel laut Google · S-Q7]`

---

## 9. Eine Seite je Absicht, kanonische URL

### 9.1 Was Google sagt

- **Doppelter Inhalt ist kein Spam,** aber eine schlechte Erfahrung und eine Verschwendung beim Crawlen. Jeder Inhalt soll über genau eine Adresse erreichbar sein. Zwei Seiten mit denselben Angaben verwirren. `[Regel laut Google · S-Q15]`
- **Wie man die kanonische URL angibt,** nach Stärke: Weiterleitung (stark), `rel="canonical"` (stark), Eintrag in der Sitemap (schwach). Mehrere Wege zusammen wirken stärker. Ohne Angabe wählt Google selbst. `[Regel laut Google · S-Q14, 10.07.2026]`
- **Best Practices:** kein `robots.txt` und kein Entfernungs-Werkzeug für die Kanonisierung; keine widersprüchlichen Angaben; kein Fragment als kanonische URL; auf der kanonischen Seite selbst ein `rel="canonical"` auf sich; `noindex` nicht für die Wahl innerhalb einer Website. `[Regel laut Google · S-Q14]`
- **Google zeigt meist höchstens zwei Treffer derselben Website** und blendet sehr ähnliche Seiten aus. `[Regel laut Google · G-Q9 im Skript «Google-Grundlagen»]`

### 9.2 Was daraus folgt

- **Jeder Suchbegriff hat genau eine Seite** (TP1 im Plan). Zwei Seiten zur selben Absicht teilen Links und Klicks und verdrängen sich gegenseitig. `[Regel laut Google · S-Q15; G-Q9; Folge: Annahme]`
- Jede Seite trägt ein `rel="canonical"` auf sich selbst. Varianten mit Parametern (`?utm_…`) zeigen auf die Hauptadresse. `[Regel laut Google · S-Q14]`
- `www` und ohne `www`, `http` und `https`: eine Variante, die anderen leiten weiter. `[Regel laut Google · S-Q14; Annahme]`
- Ortsseiten nur nach G5. `[Verweis]`

---

## 10. Menschen-Daten zu Klickraten

Lehre aus dem Abgleich mit Menschen: Modelle sagen Klickwirkung kaum besser voraus als der Zufall. `[Fakt · ../abgleich-menschen.md, Ye, Yoganarasimhan, Zheng, 2025]` Darum stehen hier Daten von Menschen. Gewichtung wie dort: Experiment stark, Verhaltensdaten mittel, Anbieter-Auswertung schwach bis mittel, Fallstudie schwach.

### 10.1 Die Studien

| Studie | Methode und Stichprobe | Ergebnis | Anbieter? | Qualität |
|---|---|---|---|---|
| **Joachims, Granka, Pan, Hembrooke, Gay, 2005** (SIGIR) | Blickverfolgung im Labor, 22 Studierende, Daten von 16 auswertbar; Google-Ergebnisse normal, mit vertauschten ersten zwei Treffern oder umgekehrt | Treffer 1 und 2 werden fast gleich oft angeschaut, aber Treffer 1 viel öfter geklickt. Auch wenn der zweite Treffer besser passt, bleibt der Vorzug für Platz 1 («Vertrauens-Verzerrung»). | nein, Hochschule | Experiment mit zufälliger Bedingung, sehr klein, 2005, USA |
| **Yue, Patel, Roehrig, 2010** (WWW) | Feldexperiment in der Google-Suche, 01. bis 20.08.2009: Paare benachbarter Treffer zufällig vertauscht, 439 246 Klicks; dazu 1150 Paare von je 5 Menschen bewertet | Je zusätzlichem Suchwort, das im Titel fett erscheint, steigt die Chance auf einen Klick um den Faktor 1,16, bereinigt um Platz und Qualität. In der Beschreibung um 1,04. | Google selbst | Feldexperiment, gross, begutachtet; alt, USA, Englisch |
| **Pew Research Center, 2025** | Browserdaten von 900 US-Erwachsenen im März 2025, 68 879 Google-Suchen, davon 12 593 mit KI-Zusammenfassung | Mit KI-Zusammenfassung klickten Nutzer in 8 % der Besuche auf einen normalen Treffer, ohne in 15 %. Auf einen Link in der Zusammenfassung in 1 %. Etwa zwei Drittel aller Suchen endeten ohne Klick auf einen Treffer. | nein | Verhaltensdaten einer Panel-Stichprobe, unabhängig, USA |
| **Advanced Web Ranking, 2026** | Search-Console-Daten zu über 1,75 Mio. US-Ergebnisseiten im Monat, Platz 1 bis 20, monatlich seit 2015 | Juli 2026, Desktop: Platz 1 erhält 20,02 % der Klicks, mit KI-Übersicht 9,69 %. September 2026: 19,35 % gegen 14,78 %. Am Handy liegt Platz 1 im Mittel 8,1 Punkte höher. | ja, Ranking-Werkzeug | Verhaltensdaten, sehr gross, laufend; USA; Werte schwanken stark von Monat zu Monat; der Anbieter nennt die Werte einmal «gemessen», einmal «geschätzt» |
| **Sistrix, 2020** (Beus) | Search-Console-Daten von Partnern, über 80 Mio. Suchbegriffe, nur Handy, nach Aufbau der Ergebnisseite getrennt | Platz 1: 28,5 %, Platz 2: 15,7 %, Platz 3: 11 %, Platz 10: 2,5 %. Nur Website-Treffer: Platz 1 34,2 %. Mit Sitelinks: 46,9 %. Mit Google Shopping: 13,7 %. Anzeigen senken Platz 1 um rund 10 Punkte. Kästen mit Orten, Bildern, News und Rezepten senken die Klicks auf Website-Treffer. | ja, SEO-Werkzeug | Verhaltensdaten, gross; Bereinigung nicht offengelegt |
| **Sistrix, 2026** (Deutschland) | über 100 Mio. Suchbegriffe in Deutschland | KI-Übersichten bei rund 20 % der Suchbegriffe. Platz 1 sinkt mit KI-Übersicht von 27 % auf 11 %. Ein Klick auf irgendeinen Website-Treffer: 57 % gegen 33 %. Stark betroffen sind Fragen zu Gesundheit und Familie, kaum Rezepte, Buchungen, Shopping. | ja | Verhaltensdaten, Methode kaum beschrieben; nächste Daten zum deutschen Sprachraum |
| **Backlinko, 2019, aktualisiert 2025** (Dean, mit Semrush) | Search-Console-Daten mehrerer Konten: 1 312 881 Seiten, 12 166 560 Suchanfragen | Platz 1: 27,6 %, 10-mal mehr als Platz 10. Titel mit 40 bis 60 Zeichen: höhere Klickrate. Titel mit Frage: 15,5 % gegen 16,3 %, kein signifikanter Unterschied. Positiv gestimmte Titel: 4,1 Punkte mehr als negativ gestimmte. | ja, gehört zu einem SEO-Werkzeug | Korrelation; widersprüchliche Zahlen im selben Text (Titellänge «33,3 %» und «8,9 %» höher; lange Suchbegriffe «2,62-mal» und «1,76-mal»); schwach |
| **Zyppy, 2022** | 80 959 Titel, 2370 Websites, Desktop | 61,6 % der Titel umgeschrieben; am seltensten bei 51 bis 60 Zeichen | ja | Beobachtung, keine Klickdaten |
| **Ahrefs, 2020** | 20 000 Suchbegriffe, Desktop | 62,78 % der Meta-Beschreibungen ersetzt | ja | Beobachtung, keine Klickdaten |
| **SearchPilot** (Fallstudie) | geteilter SEO-Test auf einer Website, Wirkung auf organische Sitzungen | «best» im Titel: rund 11 % mehr organische Sitzungen, signifikant bei 95 % | ja, Test-Anbieter | Fallstudie; ausgewählte Erfolge, misst Rang und Klicks zusammen |

Alle Zeilen: `[Fakt · S-Q18 bis S-Q27, Abruf 01.11.2026]`. Spalte «Qualität»: `[Annahme · eigene Einordnung nach ../abgleich-menschen.md]`.

### 10.2 Was die Daten zusammen sagen

1. **Platz und Aufbau der Ergebnisseite schlagen den Wortlaut.** Alle Klickstudien zeigen einen steilen Abfall nach Platz 1. Kästen, Anzeigen, Karten und KI-Übersichten nehmen den Website-Treffern Klicks weg. Menschen vertrauen der Reihenfolge, auch wenn der zweite Treffer besser passt. `[Fakt · S-Q18; S-Q20 bis S-Q24]`
2. **Die Suchwörter im Titel wirken.** Das einzige grosse Feldexperiment zum Titel zeigt: Je mehr Wörter der Anfrage im Titel stehen, desto eher wird geklickt, bei gleichem Platz und gleicher Qualität. `[Fakt · S-Q19]` Für Firmenseiten heisst das: Leistung und Ort, wie die Kundschaft sie sucht. `[Annahme]`
3. **Länge 40 bis 60 Zeichen** ist schwach gestützt, aber aus drei Richtungen gleich (Klicks bei Backlinko, Umschreiben bei Zyppy, Empfehlung von NN/g). `[Fakt · S-Q24; S-Q25; Wertung: Annahme]`
4. **Frage im Titel:** kein Vorteil in Suchergebnissen. `[Fakt · S-Q24]` Das passt zu den widersprüchlichen Daten aus Semester 2 (U3).
5. **Zahlen im Titel:** Für Suchergebnisse habe ich keine Messung mit Methode gefunden. Gemessen ist nur bei Nachrichten-Titeln, dort helfen Zahlen und Konkretes (U-Q17 in Semester 2). `[Fakt · Banerjee, Urminsky, 2021, laut semester2/ueberschrift-knopf-mikrotext.md; Übertragung: Annahme]`
6. **Wertende Wörter wie «best»** brachten in einer Anbieter-Fallstudie mehr Sitzungen. In der Schweiz verbietet das Lauterkeitsrecht unbelegte Superlative für den eigenen Betrieb (R2). Recht geht vor Wirkung (B19). `[Fakt · S-Q27; Regel: R2, B19]`
7. **Lokale Kästen und KI-Übersichten** nehmen Klicks. Für lokale Suchen zählt darum das Unternehmensprofil mindestens so viel wie der Treffer der Website. `[Fakt · S-Q22; S-Q23; Folge: Annahme, Details in «Lokal und Profil»]`

**Grenzen.** Alle Klickdaten mit Methode stammen aus den USA oder Deutschland. Keine Studie misst Anrufe oder Anfragen nach dem Klick. Keine misst kleine Dienstleister getrennt. `[Fakt · eigene Durchsicht, 01.11.2026]`

---

## 11. Wenn in der Schweiz

- **Ortsname im Titel.** Der Ort steht so, wie die Kundschaft ihn sucht: in der Regel der Gemeindename, bei bekannten Ortsteilen der Ortsteil («Zürich Oerlikon»). Keine Postleitzahl im Titel, ausser die Kundschaft sucht so. `[Annahme, nach S-Q19: Suchwörter im Titel]`
- **Umlaute.** Im Titel und in der Beschreibung stehen Umlaute normal («Zürich»). In der Adresse sind Umlaute prozentkodiert erlaubt (Googles Beispiel `gem%C3%BCse`). Wer «zuerich» schreibt, bleibt auf der ganzen Website dabei. `[Regel laut Google · S-Q6; Wahl: Annahme]`
- **Kein Eszett,** auch nicht in Titel, Beschreibung, Alt-Text und Adresse (CH1).
- **Preise im Snippet** nach CH7, CH8 und R13: «Reifenwechsel 4 Räder CHF 80.–», mit Leistung und Einheit. «ab» nur nach R14. `[Verweis auf CH8, R13, R14]`
- **Telefon in strukturierten Daten** international (CH13): `+41 52 000 00 00`. Sichtbar national (CH12). `[Verweis; Wahl des Formats in den Daten: Annahme]`
- **Mehrsprachigkeit.** `[Regel laut Google · S-Q16, 21.09.2026; S-Q17, 10.12.2025]`
  - Je Sprache eine eigene Adresse, etwa `/de/` und `/fr/`, nicht Inhalte per Cookie oder Browser-Einstellung tauschen.
  - `hreflang` für jede Fassung, gegenseitig: Jede Fassung nennt sich selbst und alle anderen. Fehlt der Rückverweis, ignoriert Google die Angabe. Vollständige Adressen mit `https://`. Für Regionen zum Beispiel `de-CH`, `fr-CH`, `it-CH`, dazu `x-default` für die Sprachwahl.
  - Google erkennt die Sprache am sichtbaren Inhalt, nicht am `lang`-Attribut und nicht an der Adresse. Eine Sprache je Seite; keine Übersetzung daneben auf derselben Seite.
  - Nicht automatisch nach vermuteter Sprache oder Standort weiterleiten. Googlebot crawlt meist aus den USA und ohne Spracheinstellung. Stattdessen Links zu den anderen Sprachen.
  - Übersetzte Seiten gelten nicht als doppelter Inhalt. Nur Vorlage übersetzt, Hauptinhalt nicht: dann schon.
  - Titel, Beschreibung, Alt-Texte, Dateinamen und Wörter in der Adresse werden mitübersetzt, nicht nur der Fliesstext. `[Regel laut Google · S-Q1; S-Q5; S-Q6]`
  - Zweisprachige Ortsnamen wie «Biel/Bienne» stehen in der Sprache der Seite, die Kundschaft sucht beide. Ob beide in einen Titel gehören, ist nicht gemessen. `[Annahme]`
- **Klickdaten aus der Schweiz:** nicht gefunden. Die Daten von Sistrix für Deutschland (S-Q23) sind die nächsten. `[Fakt · eigene Suche, 01.11.2026]`

---

## 12. Prüfbare Grundsätze

Jede Regel kann ein Werkzeug oder ein Bewerter ohne Vorwissen entscheiden. Grenzwerte ohne Studie sind `[Annahme]`. «Regel laut Google» belegt Googles Absicht, nicht die Wirkung auf Rang oder Klicks.

**Titel**

- **S1 Jede Seite hat einen eigenen Titel.** 0 Seiten ohne `<title>`, 0 gleiche Titel auf zwei Seiten, 0 Titel aus nur einem Wort wie «Home», «Startseite», «Leistungen». Werkzeug. `[Regel laut Google · S-Q1]`
- **S2 Leistung und Ort zuerst.** Jeder Titel einer Leistungs- oder Startseite beginnt mit der Leistung in den Worten der Kundschaft und enthält den Ort aus den Fakten. Der Name des Betriebs steht am Ende. Werkzeug: erstes Wort ist nicht der Betriebsname; Ortsname vorhanden. `[Fakt · S-Q19: Suchwörter im Titel erhöhen Klicks; Regel laut Google · S-Q1; S-Q15; Reihenfolge: Annahme nach L8]`
- **S3 Titellänge 40 bis 60 Zeichen.** Unter 40 und 61 bis 65 Zeichen sind eine Warnung, über 65 ein Fehler. Diese Schwelle gilt für alle drei Skills und ihre Werkzeuge ([zusammenspiel.md](../../../design-uni/referenzen/zusammenspiel.md), Teil 4). Werkzeug. `[Fakt · S-Q24, S-Q25, beide Anbieter; U4; Grenzwerte: Annahme]`
  Geändert am 02.11.2026: Staffel ausgeschrieben (vorher: über 65 Fehler, unter 30 Warnung; 30 bis 39 und 61 bis 65 Zeichen waren offen); eine Schwelle je Sache. `[Entscheid · Studio, 02.11.2026]`
  Geändert am 02.11.2026: «Warnung» und «Fehler» sind hier zwei Stufen eines Hinweises (Entscheid 13, Grenzwerte sind Annahme). Im gemeinsamen Prüflauf meldet das Werkzeug beide als HINWEIS; S3 sperrt nicht (zusammenspiel.md Teil 7). Ein fehlender Titel sperrt vor der Abgabe in TP7. `[Entscheid · Studio, 02.11.2026]`
- **S4 Kein Wort doppelt.** Kein Inhaltswort steht zweimal im Titel; der Betriebsname zählt nicht mit, wenn er die Leistung enthält. Werkzeug. `[Regel laut Google · S-Q1, Keyword-Stuffing]`
- **S5 Ein prüfbares Detail.** Jeder Titel einer Leistungsseite enthält eine Zahl, eine Frist, einen Preis oder einen Gegenstand aus den Fakten. 0 Superlative (R2). Werkzeug: Ziffer oder Eintrag aus der Faktenliste; Superlativ-Liste. `[Meinung · A19; Fakt · Zahlen wirken bei Nachrichten-Titeln, U-Q17; Übertragung auf Suchergebnisse: Annahme]` `[unsicher]` Für Suchergebnisse fehlt eine Messung.
- **S6 Titel passt zum Haupttitel.** `<title>` und `<h1>` nennen dieselbe Leistung und denselben Ort. Gemeint ist das `h1` als Etikett; der grosse Satz aus der Idee ist keine Überschrift und zählt hier nicht. Prüffrage. `[Regel laut Google · S-Q1]`
  Geändert am 02.11.2026: klargestellt, dass S6 für das `h1` gilt, nicht für den grossen Satz aus der Idee (Entscheid 2). `[Entscheid · Studio, 02.11.2026]`
- **S7 Trennzeichen schlicht.** Trennzeichen sind `|` oder `:`, höchstens zwei je Titel. Eckige Klammern: 0. Werkzeug. `[Fakt · S-Q25; Wahl: Annahme]`
- **S8 Keine Frage nur als Form.** Ein Titel in Frageform steht nur, wenn die Frage wörtlich aus der Sammlung der Kundschaft stammt (KW1, U3). `[Fakt · S-Q24: kein Vorteil für Fragen; Regel: Annahme]`

**Beschreibung und Snippet**

- **S9 Eigene Beschreibung je wichtiger Seite.** Startseite und jede Leistungsseite haben eine Meta-Beschreibung; 0 gleiche Beschreibungen. Werkzeug. `[Regel laut Google · S-Q3]`
- **S10 Beschreibung mit Fakten.** Die Beschreibung nennt Leistung, Ort und mindestens ein prüfbares Detail und sagt, was als Nächstes passiert oder für wen das Angebot ist. 0 Floskeln (K1). Prüffrage. `[Regel laut Google · S-Q3; Inhalt: Annahme nach A1, U8]`
- **S11 Keine Wortliste.** Die Beschreibung besteht aus Sätzen oder klar getrennten Angaben. Mehr als 3 Suchwörter hintereinander nur durch Komma getrennt: Befund. Werkzeug. `[Regel laut Google · S-Q3]`
- **S12 Beschreibungslänge 110 bis 155 Zeichen.** Diese Schwelle gilt für alle drei Skills. Werkzeug. `[Annahme; Google nennt keine Zahl, S-Q3]`
- **S13 Erster Absatz als Snippet.** Der erste Absatz jeder Seite beantwortet die Hauptfrage allein (V1, L1). Prüffrage: Wäre er als Snippet allein verständlich? `[Regel laut Google · S-Q3: Snippet meist aus dem Inhalt]`
- **S14 Sprunglinks möglich.** Antworten auf Hauptfragen stehen sichtbar, nicht nur hinter Akkordeon oder Reiter; kein Skript setzt die Scrollposition beim Laden. Werkzeug. `[Regel laut Google · S-Q3, seit 20.04.2026]`

**Überschriften und Links**

- **S15 Ein Haupttitel.** Genau ein `<h1>` je Seite, sichtbar. Es nennt Leistung und Ort (A17, S6) und darf kleiner gesetzt sein als der grosse Satz aus der Idee; die Grösse entscheidet design-uni. Werkzeug. `[Regel laut Google · S-Q1]` `[Entscheid · Studio, 02.11.2026]`
  Geändert am 02.11.2026: «grösser als alle anderen Überschriften» gestrichen (Entscheid 2: Etikett ist `h1`, die Idee ist gross). Google nennt als gute Praxis einen klaren Haupttitel, «grösser als alles andere» (Teil 2.1). Ob Google einen anderen Text als Titel wählt, wenn der grösste Text kein `h1` ist, ist nicht geprüft. `[unsicher]`
- **S16 Reihenfolge ohne Sprung.** Keine Überschrift springt eine Ebene (`h2` auf `h4`). Werkzeug. `[Regel laut Google · S-Q15: wichtig für Bildschirmleser, nicht für Google]`
- **S17 Folgbare Links.** Jeder interne Link ist ein `<a>` mit `href` auf eine echte Adresse. 0 Links nur per Skript. Werkzeug. `[Regel laut Google · S-Q4]`
- **S18 Linktext allein verständlich.** Jeder Linktext nennt das Ziel und ist ohne Umgebung verständlich, 2 bis 8 Wörter. 0 «hier», «mehr», «Website», «Artikel» allein. Werkzeug mit Liste und `slop-de.js`. `[Regel laut Google · S-Q4; L14; Wortzahl: Annahme]`
- **S19 Keine verwaiste Seite.** Jede indexierbare Seite hat mindestens einen internen Link aus dem Text einer anderen Seite, nicht nur aus Menü oder Sitemap. Werkzeug. `[Regel laut Google · S-Q4; «aus dem Text»: Annahme]`

**Bilder und Adressen**

- **S20 Alt-Text beschreibt.** Jedes Inhaltsbild hat einen Alt-Text von 5 bis 15 Wörtern, der zeigt, was zu sehen ist. Schmuckbilder `alt=""`. 0 Alt-Texte mit einem Suchwort doppelt oder mit Kommaliste. Werkzeug. `[Regel laut Google · S-Q5; Wortzahl: Annahme]`
- **S21 Dateiname beschreibt.** 0 Bilddateien mit Namen wie `IMG_`, `DSC`, `bild1`, `image`. Kleinbuchstaben, Bindestriche. Werkzeug. `[Regel laut Google · S-Q5]`
- **S22 Adresse lesbar.** Pfade aus Wörtern der Kundschaft, klein, mit Bindestrich, ohne Unterstrich, ohne Nummern-ID, ohne `#` für Inhalte, höchstens 3 Ebenen. Werkzeug. `[Regel laut Google · S-Q6; Ebenen: Annahme]`

**Strukturierte Daten**

- **S23 LocalBusiness vollständig.** Startseite trägt `LocalBusiness` mit genauestem Untertyp, `name`, `address`, `telephone`, `url`, `openingHoursSpecification`. Jeder Wert stimmt mit der sichtbaren Seite und den Fakten überein. Werkzeug: Rich Results Test plus Abgleich. `[Regel laut Google · S-Q8; S-Q7]`
- **S24 Keine Selbstbewertung in Daten.** 0 `aggregateRating` und 0 `review` für den eigenen Betrieb in den eigenen strukturierten Daten. Werkzeug. `[Regel laut Google · S-Q11; S-Q8]`
- **S25 Daten nur für Sichtbares.** Jede Angabe in strukturierten Daten steht auch sichtbar auf derselben Seite. Werkzeug: Werte aus JSON-LD im sichtbaren Text suchen. `[Regel laut Google · S-Q7]`
- **S26 Kein Versprechen von Rich Results.** Kein Angebot und kein Bericht verspricht Sterne, FAQ-Anzeige oder andere Rich Results. FAQ-Daten gelten als ohne Wirkung. Prüffrage. `[Regel laut Google · S-Q7: keine Garantie; S-Q13: FAQ seit 07.05.2026 nicht mehr angezeigt]`

**Eine Seite je Absicht**

- **S27 Ein Begriff, eine Seite.** Im Seitenplan hat jeder Suchbegriff genau eine Zielseite; 0 Begriffe auf zwei Seiten. Werkzeug: Seitenplan auswerten (TP1). `[Regel laut Google · S-Q15; G-Q9: höchstens zwei Treffer je Website, Deduplizierung]`
- **S28 Kanonisch auf sich selbst.** Jede indexierbare Seite trägt `rel="canonical"` auf ihre eigene vollständige Adresse. Varianten leiten weiter oder zeigen kanonisch auf die Hauptadresse. Sitemap und `canonical` widersprechen sich nicht. Werkzeug. `[Regel laut Google · S-Q14]`

**Lesen der Klickdaten**

- **S29 Klickwirkung nur mit Menschen-Daten.** Aussagen wie «dieser Titel bringt mehr Klicks» stützen sich auf Messungen mit Menschen (Teil 10 oder eigene Search-Console-Daten nach dem Livegang). Ein Urteil von Such-Agenten heisst «Modell-Urteil», ist als Tor ein Vorfilter (TP5) und belegt keine Klickwirkung. Prüffrage. `[Fakt · ../abgleich-menschen.md; S-Q18 bis S-Q24]`
  Geändert am 02.11.2026: «Vorfilter» ergänzt (Entscheid 1). `[Entscheid · Studio, 02.11.2026]`
- **S30 Recht vor Klick.** Kein Wort im Titel oder in der Beschreibung, das R2, R5, R6 oder R17 verletzt, auch wenn ein Test mehr Klicks verspricht. Werkzeug für Superlative, Prüffrage für den Rest. `[Verweis auf R2, B19; S-Q27 als Gegenbeispiel]`

**Wenn in der Schweiz**

- **S31 Sprache je Seite und Treffer.** Titel, Beschreibung, Alt-Texte und Adresswörter sind in der Sprache der Seite. 0 deutsche Titel auf französischen Seiten. Werkzeug: Spracherkennung je Feld. `[Regel laut Google · S-Q1; S-Q16; S-Q17]`
- **S32 hreflang gegenseitig.** Jede Sprachfassung nennt sich selbst und alle anderen mit vollständiger Adresse; dazu `x-default`. Fehlende Rückverweise: 0. Werkzeug. `[Regel laut Google · S-Q16]`
- **S33 Keine Sprachweiche.** 0 automatische Weiterleitungen nach Browsersprache oder Standort. Auf jeder Seite Links zu den anderen Sprachen. Werkzeug: Seite mit anderer Spracheinstellung laden. `[Regel laut Google · S-Q17]`
- **S34 Schweizer Formate im Treffer.** Titel und Beschreibung folgen CH1, CH7, CH8, CH12. Werkzeug wie dort. `[Verweis]`

---

## 13. Für die Semesterprüfung

Der Snippet-Test (TP5) zeigt Such-Agenten echte Treffer und einen eigenen Treffer eines erfundenen Betriebs. Ein Treffer hat drei Teile: Titel, sichtbare Adresse, Beschreibung. Ergebnis ist ein **Modell-Urteil, Vorfilter** (S29).

### 13.1 Checkliste für einen guten Treffer

**Titel**

- [ ] Beginnt mit der Leistung in den Worten der Suchfrage (S2).
- [ ] Enthält den Ort aus der Suchfrage, falls sie einen nennt (S2, A18).
- [ ] Enthält ein prüfbares Detail aus den Fakten: Frist, Preis, Zahl, Gegenstand (S5).
- [ ] 40 bis 60 Zeichen (S3).
- [ ] Kein Wort doppelt, keine eckigen Klammern, höchstens zwei Trennzeichen (S4, S7).
- [ ] Betriebsname am Ende (S2).
- [ ] Kein Superlativ, kein Ausrufezeichen, keine Floskel (S30, K1).

**Sichtbare Adresse**

- [ ] Domain plus kurzer, lesbarer Pfad mit Wörtern der Kundschaft (S22).
- [ ] Domain erfunden und nicht registriert; im Skript auf `.example`. Für den Test eine Domain wählen, die echt aussieht, und vorher prüfen, dass sie nicht vergeben ist. `[Annahme]`

**Beschreibung**

- [ ] 110 bis 155 Zeichen (S12).
- [ ] Erster Satz: was, wo, für wen (S10, V1).
- [ ] Mindestens ein prüfbares Detail, das nicht schon im Titel steht (S10).
- [ ] Was als Nächstes passiert oder was die Kundschaft tun kann (S10, U8).
- [ ] Keine Wortliste, keine Floskel, kein Superlativ (S11, K1, R2).
- [ ] Preise nach CH8 und R13, Telefon nach CH12 (S34).

**Für den Test**

- [ ] Alle Fakten sind erfunden, aber plausibel und als Muster markiert in der Prüfungsakte (Grundregel «keine erfundenen Fakten»).
- [ ] Länge ähnlich wie die echten Treffer daneben, damit die Längen-Verzerrung der Modelle nicht hilft. `[Fakt · Dubois u. a., 2024, laut ../abgleich-menschen.md; Regel: Annahme]`

### 13.2 Beispiel guter Treffer: Malerei Muster, Musterdorf (erfunden)

Suchfrage: «Maler Musterdorf»

- **Titel:** `Maler in Musterdorf, Offerte in 5 Tagen | Malerei Muster` (56 Zeichen)
- **Adresse:** `malerei-muster.example › malerarbeiten-musterdorf`
- **Beschreibung:** «Wir streichen Wohnungen und Häuser in Musterdorf und Umgebung. 3-Zimmer-Wohnung in 3 Arbeitstagen, Offerte nach Besichtigung innert 5 Arbeitstagen.» (147 Zeichen)

### 13.3 Beispiel guter Treffer: Garage Muster, Musterdorf (erfunden)

Suchfrage: «Reifenwechsel Kosten»

- **Titel:** `Reifenwechsel Musterdorf, 4 Räder CHF 80.– | Garage Muster` (58 Zeichen)
- **Adresse:** `garage-muster.example › reifenwechsel`
- **Beschreibung:** «Reifenwechsel für 4 Räder CHF 80.–, Auswuchten inbegriffen. Termin am selben Tag möglich, Einlagerung der Reifen für CHF 40.– pro Saison.»

### 13.4 Beispiel schlechter Treffer: Keyword-Stuffing (Kontrolle)

Absichtlich schlecht. Er verletzt S2 bis S5, S10 und S11 und ist laut Google ein Beispiel für Keyword-Stuffing (G-Q3). Er soll im Test nicht zuerst gewählt werden.

Suchfrage: «Maler Musterdorf»

- **Titel:** `Maler Musterdorf | Maler Musterdorf günstig | Malerei Musterdorf | Malergeschäft Musterdorf | Maler Musterland` (110 Zeichen)
- **Adresse:** `maler-musterdorf-guenstig.example › maler_musterdorf_maler_guenstig_2026`
- **Beschreibung:** «Maler Musterdorf, Malerarbeiten Musterdorf, Maler günstig, Malergeschäft, Maler Musterland, Fassade streichen, Wohnung streichen, Maler Offerte, bester Maler.»

### 13.5 Beispiel schlechter Treffer: leer (zweite Kontrolle)

Suchfrage: «Physiotherapie ohne Rezept»

- **Titel:** `Home | Physio Muster`
- **Adresse:** `physio-muster.example › index.php?id=12`
- **Beschreibung:** «Will·kommen auf unserer Web·site. Wir freu·en uns auf Ihren Besuch. Ihr Team von Physio Muster.»

Erwartung `[Annahme]`: Der gute Treffer liegt bei mindestens 4 von 6 Bewertern unter den ersten zwei, wenn er die Suchfrage im Titel aufnimmt. Die Kontrollen wählt höchstens 1 von 6 zuerst. Der Vorteil durch Platz und Aufmachung echter Treffer fehlt im Test; echte Klickraten hängen vor allem am Platz (Teil 10).

---

## 14. Quellen

Alle abgerufen am 01.11.2026. Datum in Klammern: Stand der Seite laut Anbieter.

**Google Search Central**

- **S-Q1** «Influencing your title links in search results» (10.12.2025). https://developers.google.com/search/docs/appearance/title-link
- **S-Q2** Danny Sullivan: «An update to how we generate web page titles». Google Search Central Blog, 24.08.2021. https://developers.google.com/search/blog/2021/08/update-to-generating-page-titles
- **S-Q3** «Control your snippets in search results» (20.04.2026). https://developers.google.com/search/docs/appearance/snippet
- **S-Q4** «Link best practices for Google» (10.12.2025). https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- **S-Q5** «Image SEO best practices» (02.03.2026). https://developers.google.com/search/docs/appearance/google-images
- **S-Q6** «URL structure best practices for Google Search» (21.10.2026). https://developers.google.com/search/docs/crawling-indexing/url-structure
- **S-Q7** «General structured data guidelines» (10.07.2026). https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- **S-Q8** «Local business (LocalBusiness) structured data» (08.09.2026). https://developers.google.com/search/docs/appearance/structured-data/local-business
- **S-Q9** «Organization (Organization) structured data» (08.09.2026). https://developers.google.com/search/docs/appearance/structured-data/organization
- **S-Q10** «Breadcrumb (BreadcrumbList) structured data» (08.09.2026). https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- **S-Q11** «Review snippet (Review, AggregateRating) structured data» (08.09.2026). https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- **S-Q12** «Changes to HowTo and FAQ rich results». Google Search Central Blog, 08.08.2023, Nachtrag 14.09.2023. https://developers.google.com/search/blog/2023/08/howto-faq-changes
- **S-Q13** «Latest documentation updates» (Einträge bis 26.10.2026), darin: FAQ-Rich-Result eingestellt (08.05.2026), FAQ-Dokumentation entfernt (Juni 2026), Breadcrumb nur Desktop (Januar 2025), Review-Empfehlung (15.01.2025), neue Review-Regel (24.07.2026), Sprunglinks (20.04.2026). https://developers.google.com/search/updates
- **S-Q14** «How to specify a canonical URL with rel="canonical" and other methods» (10.07.2026). https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- **S-Q15** «SEO Starter Guide» (10.12.2025). https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- **S-Q16** «Tell Google about localized versions of your page» (21.09.2026). https://developers.google.com/search/docs/specialty/international/localized-versions
- **S-Q17** «Managing multi-regional and multilingual sites» (10.12.2025). https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites

**Studien zu Klicks**

- **S-Q18** Thorsten Joachims, Laura Granka, Bing Pan, Helene Hembrooke, Geri Gay: «Accurately Interpreting Clickthrough Data as Implicit Feedback». SIGIR 2005. https://www.cs.cornell.edu/~tj/publications/joachims_etal_05a.pdf
- **S-Q19** Yisong Yue, Rajan Patel, Hein Roehrig: «Beyond Position Bias: Examining Result Attractiveness as a Source of Presentation Bias in Clickthrough Data». WWW 2010. https://research.google.com/pubs/archive/36363.pdf
- **S-Q20** Athena Chapekis, Anna Lieb: «Google users are less likely to click on links when an AI summary appears in the results». Pew Research Center, 22.07.2025. https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/
- **S-Q21** Advanced Web Ranking: «Google Organic CTR by Position: 2026 Study + AI Overviews» (Daten Juli 2026) und Werkzeug «Google Organic CTR» (Daten September 2026). https://www.advancedwebranking.com/seo/organic-ctr · https://www.advancedwebranking.com/free-seo-tools/google-organic-ctr
- **S-Q22** Johannes Beus: «Why (almost) everything you knew about Google CTR is no longer valid». Sistrix, 14.07.2020, geändert 07.07.2025. https://www.sistrix.com/blog/why-almost-everything-you-knew-about-google-ctr-is-no-longer-valid/
- **S-Q23** Johannes Beus: «AI Overviews in Germany: How Much Click-Through Rates Are Really Dropping». Sistrix, 25.02.2026, geändert 02.04.2026. https://www.sistrix.com/blog/ai-overviews-in-germany/
- **S-Q24** Brian Dean: «We Analyzed 4 Million Google Search Results. Here's What We Learned About Organic Click Through Rate». Backlinko, 2019, aktualisiert 16.04.2025. https://backlinko.com/google-ctr-stats
- **S-Q25** Cyrus Shepard: «Google Rewrites 61% of Page Title Tags [SEO Study]». Zyppy, Daten Anfang 2022, aktualisiert 06.10.2026. https://zyppy.com/seo/google-title-rewrite-study/
- **S-Q26** Michal Pecánek: «How Often Does Google Rewrite Meta Descriptions? (New Data Study)». Ahrefs, 25.03.2020. https://ahrefs.com/blog/meta-description-study/
- **S-Q27** SearchPilot: «How does adding 'best' to title tags impact SEO performance?» https://www.searchpilot.com/resources/case-studies/adding-best-to-title-tags
