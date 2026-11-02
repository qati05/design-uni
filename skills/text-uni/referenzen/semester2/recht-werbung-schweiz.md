# Recht in Werbetexten · Skript Semester 2

Stand 01.11.2026 · Text-Uni, Semester 2 «Text, der verkauft». **Dieses ganze Skript ist der Teil «Wenn in der Schweiz».** Es gilt für Werbetexte auf Websites von KMU, die sich an Kundschaft in der Schweiz richten.

> **Keine Rechtsauskunft.** Dieses Skript gibt Gesetzestext, amtliche Auslegung und Selbstregulierung wieder, so weit sie gelesen wurden. Es ist von keiner Juristin geprüft. Es ersetzt keine Beratung. Jeder Grenzfall (Preisvergleich, Garantie, Patientenstimme, Gesundheitsaussage, Vergleich mit Mitbewerbern) braucht vor der Veröffentlichung eine juristische Prüfung. Offene Fragen stehen in Teil 9 «Für die Anwältin».

Herkunft jeder Aussage: `[Fakt · Quelle, Stand oder Datum]` (aus der gelesenen Quelle), `[Zweitquelle · …]` (über eine andere Quelle gelesen, das Original nicht), `[Annahme]` (eigene Ableitung). Die Quellen stehen am Ende mit Adresse und Abrufdatum.

**Schreibweise der Beispiele.** Das Floskel-Werkzeug `slop-de.js` prüft auch dieses Skript. Darum steht in jeder Floskel, die es melden würde, ein Mittelpunkt im Wort, etwa «höchste Quali·tät». Beim Lesen den Punkt überspringen. Alle Betriebe, Namen, Preise und Zahlen in den Beispielen sind **erfunden**. Sie heissen «Muster», «Beispiel» oder «Fiktiv».

**Grenze zum Rest der Uni.** Preisformat und Schreibweise von Beträgen stehen in `semester1/schweizer-hochdeutsch.md` (CH7, CH8, CH9). Wertende Adjektive ohne Beleg behandeln W18 und K2. Hier geht es nur darum, was ein Werbetext rechtlich sagen darf. Die Design-Uni hat dasselbe Recht für die Gestaltung gelesen; dieses Skript prüft es neu an den Primärquellen und nennt, wo es abweicht. Seit 02.11.2026 gilt für Werberecht (UWG, PBV, Heilmittel, Berufsrecht) und für den Wortlaut von Impressum und Datenschutzerklärung dieses Skript in allen drei Skills (Entscheid 9 und Besitzer-Tabelle in [zusammenspiel.md](../../../design-uni/referenzen/zusammenspiel.md)). `[Entscheid · Studio, 02.11.2026]`

---

## 0. Wie die Quellen gelesen wurden

Fedlex (fedlex.admin.ch) zeigt Gesetze nur mit JavaScript an. Gelesen wurde darum die amtliche HTML-Fassung aus der Fedlex-Dateiablage («filestore»). Den Pfad dorthin liefert der öffentliche SPARQL-Endpunkt `fedlex.data.admin.ch/sparqlendpoint` (Abfrage: SR-Nummer, dann neueste konsolidierte Fassung mit Datum bis 01.11.2026). [Fakt · Fedlex, Abruf 01.11.2026]

| Erlass | SR | Stand der gelesenen Fassung | Gelesen |
|---|---|---|---|
| Bundesgesetz gegen den unlauteren Wettbewerb (UWG) | 241 | 01.01.2025 | Art. 2, 3, 3a, 9, 10, 13a, 16 bis 18, 23, 24 |
| Preisbekanntgabeverordnung (PBV) | 942.211 | 01.01.2025 | Art. 1 bis 20 |
| Heilmittelgesetz (HMG) | 812.21 | 01.01.2025 | Art. 31, 32 |
| Arzneimittel-Werbeverordnung (AWV) | 812.212.5 | 01.01.2020 | Art. 1, 2, 14 bis 22 |
| Medizinprodukteverordnung (MepV) | 812.213 | 01.07.2026 | Art. 69 |
| Medizinalberufegesetz (MedBG) | 811.11 | 01.07.2025 | Art. 2, 40, 43, 58 |
| Gesundheitsberufegesetz (GesBG) | 811.21 | 01.07.2025 | Art. 2, 16 |
| Anwaltsgesetz (BGFA) | 935.61 | 01.07.2025 | Art. 12 |
| Datenschutzgesetz (DSG) | 235.1 | 07.07.2025 | Art. 5, 6, 7, 30, 31; Art. 19 und 20 am 02.11.2026 |
| Strafgesetzbuch (StGB) | 311.0 | 01.11.2026 | Art. 321 |
| Lebensmittelgesetz (LMG) | 817.0 | 01.10.2024 | Art. 5, 18 |
| Lebensmittel- und Gebrauchsgegenständeverordnung (LGV) | 817.02 | 01.07.2025 | Art. 47 |
| Verordnung des EDI über kosmetische Mittel (VKos) | 817.023.31 | 01.01.2026 | Art. 10 |

Dazu: SECO (FAQ zur Preisbekanntgabe, Informationsblatt Selbstvergleich, Wegleitung 2025), Swissmedic (Merkblatt Botulinumtoxin), die Grundsätze der Schweizerischen Lauterkeitskommission (SLK, Stand Januar 2025) mit ihren Richtlinien für Tests (April 2001), der ICC-Werbekodex 2024 (auf den die SLK verweist), der Bericht des Bundesrates zu «Dark Patterns» vom 14.06.2024 und wenige Urteile (Teil 7).

---

## 1. Der Grundsatz: Wer wirbt, muss beweisen

- **Generalklausel:** Unlauter und widerrechtlich ist jedes täuschende oder sonst gegen Treu und Glauben verstossende Verhalten, das das Verhältnis zwischen Anbietern und Kundschaft beeinflusst. [Fakt · UWG Art. 2, Stand 01.01.2025]
- **Beweislast:** Das Gericht kann vom Werbenden den Beweis für die Richtigkeit von Tatsachenbehauptungen in der Werbung verlangen, wenn das im Einzelfall angemessen ist. [Fakt · UWG Art. 13a Abs. 1, Stand 01.01.2025]
- Die SLK sagt es knapper: «Werbende müssen die Richtigkeit ihrer Werbeaussagen beweisen können.» [Fakt · SLK-Grundsätze, Stand Januar 2025, A.5]
- **Verantwortung:** Sie liegt beim Werbenden, also beim Betrieb, nicht bei der Agentur oder dem Texter. [Fakt · SLK-Grundsätze, A.4] Ob der Texter daneben haftet, ist offen (Teil 9). [Annahme]
- **Folgen:** Wer vorsätzlich nach Art. 3 unlauter handelt, wird auf Antrag mit Freiheitsstrafe bis drei Jahre oder Geldstrafe bestraft. [Fakt · UWG Art. 23 Abs. 1] Verstösse gegen die Preisbekanntgabe kosten bis 20 000 Franken Busse. [Fakt · UWG Art. 24 Abs. 1] Klagen können Mitbewerber, Kundschaft, Verbände, Konsumentenorganisationen und unter Umständen der Bund. [Fakt · UWG Art. 9 und 10]
- **Was das für den Text heisst** [Annahme]: Jede Tatsache auf der Seite braucht einen Beleg in den Unterlagen des Betriebs. Was sich nicht belegen lässt, wird Meinung («Wir mögen schwierige Altbauten») oder fällt weg.

---

## 2. UWG: was Werbetexte nicht dürfen

Alle Buchstaben unten stammen aus UWG Art. 3 Abs. 1, Stand 01.01.2025. [Fakt · UWG Art. 3 Abs. 1]

### 2.1 Unrichtige oder irreführende Angaben (lit. b)

**Regel:** Unlauter handelt, wer über sich, seine Firma, seine Geschäftsbezeichnung, seine Waren, Werke oder Leistungen, deren Preise, die vorrätige Menge, die Art der Verkaufsveranstaltung oder seine Geschäftsverhältnisse unrichtige oder irreführende Angaben macht. [Fakt · UWG Art. 3 Abs. 1 lit. b]

- «Unrichtig» heisst: stimmt nicht. «Irreführend» kann auch eine wahre Angabe sein, die falsch verstanden wird. Massgebend ist, ob sie den Entscheid der Kundschaft beeinflussen kann. [Fakt · BGE 132 III 414 E. 4.1.2]
- **Selbstverständlichkeiten:** Wer eine Eigenschaft hervorhebt, die für die meisten solchen Produkte ohnehin zutrifft, üblich oder vorgeschrieben ist, wirbt irreführend. [Fakt · SLK-Grundsätze, B.4]
- **Menge und Verfügbarkeit:** Eine beschränkte Verfügbarkeit muss klar und gut lesbar stehen. Sonderangebote müssen in genügender Zahl da sein; Richtwert: mindestens drei Tage erhältlich. [Fakt · SLK-Grundsätze, B.2 Abs. 2 Ziff. 4]
- **Firma:** Im Geschäftsverkehr, ausdrücklich auch im Impressum, steht die Firma vollständig, wie sie im Handelsregister eingetragen ist. Kurznamen und Logos nur zusammen mit ihr. [Fakt · SLK-Grundsätze, B.10]

> **Nicht erlaubt** (Malerei Muster GmbH, erfunden): «Seit 1950 in Musterdorf.» Die GmbH gibt es seit 2019; der Grossvater führte einen anderen Betrieb.
> **Erlaubt:** «Gegründet 2019. Unser Grossvater malte schon ab 1950 in Musterdorf.»

> **Nicht erlaubt** (Garage Fiktiv AG): «Bei uns inklusive Mehrwertsteuer!» als Vorteil. Die MWST ist im Endpreis ohnehin Pflicht (Teil 3.2).
> **Erlaubt:** Den Endpreis nennen, ohne die Pflicht als Vorzug zu feiern.

> **Nicht erlaubt** (Schreinerei Beispiel): «Nur noch 2 Termine im Mai frei», wenn die Agenda offen ist.
> **Erlaubt:** «Nächster freier Montagetermin: 18. Mai.» Mit Datum, das stimmt, und nur so lange es stimmt.

### 2.2 Superlative und Alleinstellung

**Rechtslage:** Ein eigenes Superlativ-Verbot gibt es weder im UWG noch in den SLK-Grundsätzen. [Fakt · UWG Art. 3; SLK-Grundsätze Stand Januar 2025, Inhaltsverzeichnis und Stichwortregister ohne Eintrag «Superlativ»]

- Das Bundesgericht: Superlativwerbung ist eine Form der vergleichenden Werbung. Der Werbende vergleicht sich mit der gesamten Konkurrenz. Enthält der Superlativ konkrete, objektiv prüfbare Angaben, gilt lit. e; die Angaben müssen stimmen. [Fakt · BGE 132 III 414 E. 4.2.1, gelesen auf bger.ch, französisch]
- Die SLK wendet das so an: «Nr. 1» bei Mineralwasser ist eine beweispflichtige Behauptung über die Marktführerschaft. «Die beliebteste Schokolade der Schweiz» war zulässig, weil unbestritten war, dass sie die meistverkaufte ist. Geschmack allein ist keine beweisbare Tatsache. [Fakt · SLK, Tätigkeitsbericht 2016, Fall Nr. 133/16 und Hinweis auf Plenum Nr. 150/07]
- Massstab ist, wie ein durchschnittlicher Adressat die Aussage versteht. [Fakt · SLK, Tätigkeitsbericht 2016, mit Verweis auf BGE 132 III 414]
- **Folge für den Text** [Annahme]: Ein Superlativ mit messbarem Kern («grösste», «schnellste», «Nr. 1», «einzige», «günstigste») braucht einen Beleg, der den ganzen Markt abdeckt, den der Text meint. Ein reines Werturteil («unser liebster Auftrag») ist keine Tatsache, verkauft aber auch nichts (K2, W18).

> **Nicht erlaubt** (Sanitär Muster AG): «Der schnellste Notfalldienst im Kanton.» Keine Messung, kein Vergleich.
> **Erlaubt:** «Notfall: Wir sind in Musterdorf im Schnitt in 45 Minuten bei Ihnen (eigene Auswertung, 212 Einsätze 2025).»

> **Nicht erlaubt** (Physiotherapie Beispiel): «Die Nr. 1 für Rücken in der Region.»
> **Erlaubt:** Die Ausbildung und das Angebot nennen, ohne Rang (dazu auch Teil 5).

### 2.3 Vergleich und Herabsetzung (lit. a, lit. e)

**Regel:** Unlauter ist, wer sich, seine Leistungen oder Preise in unrichtiger, irreführender, unnötig herabsetzender oder anlehnender Weise mit anderen vergleicht (lit. e), oder andere durch unrichtige, irreführende oder unnötig verletzende Äusserungen herabsetzt (lit. a). [Fakt · UWG Art. 3 Abs. 1 lit. a und e]

- Vergleichende Werbung ist in der Schweiz grundsätzlich erlaubt. Sie muss objektiv, wahr und realistisch sein. Auch wahre Daten können unlauter sein, wenn sie ungenau, nebensächlich oder unvollständig sind und einen nicht unerheblichen Teil des Publikums täuschen können. Verglichen wird nur Vergleichbares; Preisvergleiche nur bei gleicher Menge und Qualität. [Fakt · BGE 132 III 414 E. 4.2.1]
- Die SLK zählt auf, wann ein Vergleich unrichtig, irreführend, verletzend oder anlehnend ist. Irreführend ist etwa, wenn nur einzelne Vor- und Nachteile verglichen werden und der Rest nicht gleich ist. [Fakt · SLK-Grundsätze, B.3 Abs. 3 bis 6]
- Herabsetzung: unnötige und übermässige Verunglimpfung oder Spott über einen Berufszweig oder Mitbewerber ist unlauter. [Fakt · SLK-Grundsätze, B.1]

> **Nicht erlaubt** (Gartenbau Fiktiv): «Andere Gärtner pfuschen, wir nicht.»
> **Erlaubt:** «Wir geben auf neu gepflanzte Hecken 2 Jahre Anwachsgarantie. Bedingungen: …» Ohne Mitbewerber, mit eigener, belegter Zusage (Teil 2.9).

### 2.4 Titel und Berufsbezeichnungen (lit. c)

**Regel:** Unlauter ist, wer unzutreffende Titel oder Berufsbezeichnungen verwendet, die den Anschein besonderer Auszeichnungen oder Fähigkeiten erwecken. [Fakt · UWG Art. 3 Abs. 1 lit. c]

- Ausländische akademische Titel sind unlauter, wenn nicht nachweisbar ist, dass die Anforderungen mit den schweizerischen vergleichbar waren. [Fakt · SLK-Grundsätze, B.12]
- Für Medizinalberufe ist es zusätzlich strafbar, ein Diplom oder einen Weiterbildungstitel vorzugeben, den man nicht rechtmässig erworben hat. [Fakt · MedBG Art. 58 lit. a und b, Stand 01.07.2025]

> **Nicht erlaubt** (Elektro Muster): «Ihr Elektro-Meister», wenn niemand im Betrieb die Meisterprüfung hat.
> **Erlaubt:** «Eidg. dipl. Elektroinstallateur (Name, Jahr)», wenn die Urkunde vorliegt.

### 2.5 Lockvogel (lit. f) und Zugaben (lit. g)

- **Lockvogel:** Unlauter ist, wer ausgewählte Leistungen wiederholt unter Einstandspreis anbietet, sie in der Werbung besonders hervorhebt und so über die eigene Leistungsfähigkeit täuscht. Täuschung wird vermutet, wenn der Preis unter dem Einstandspreis vergleichbarer Bezüge liegt. [Fakt · UWG Art. 3 Abs. 1 lit. f]
- **Zugaben:** Unlauter ist, wer durch Zugaben über den tatsächlichen Wert des Angebots täuscht. [Fakt · UWG Art. 3 Abs. 1 lit. g]
- **«Gratis»:** Der ICC-Kodex, auf den die SLK für «gratis» verweist, erlaubt das Wort nur, wenn keine Pflicht besteht, nur Versandkosten anfallen oder der Preis des Hauptprodukts nicht erhöht wurde, um das Geschenk zu decken. [Fakt · ICC-Kodex 2024, Art. 10; SLK-Grundsätze, Stichwortregister «Gratis/kostenlos»]

> **Nicht erlaubt** (Velo Beispiel): «Gratis-Helm zu jedem E-Bike!», wenn der E-Bike-Preis für die Aktion um CHF 80.– erhöht wurde.
> **Erlaubt:** «Zu jedem E-Bike ein Helm im Wert von CHF 80.–. Der E-Bike-Preis bleibt CHF 3290.–.» Nur, wenn beides stimmt.

### 2.6 Aggressive Methoden (lit. h)

**Regel:** Unlauter ist, wer die Kundschaft durch besonders aggressive Verkaufsmethoden in ihrer Entscheidungsfreiheit beeinträchtigt. [Fakt · UWG Art. 3 Abs. 1 lit. h]

- Laut Bundesrat fallen darunter Druck und Zwang, etwa wiederholtes Drängen («Nagging») und «Confirmshaming» (der Nein-Knopf beschämt). Die Botschaft zum UWG nennt das Vortäuschen einmaliger Kaufgelegenheiten. Unter Umständen fallen sogar Countdowns mit korrekten Angaben darunter. [Fakt · Bundesrat, Bericht «Dark Patterns», 14.06.2024, Ziff. 6.1.2.2.2]
- Falsche oder irreführende Countdowns sind zudem nach lit. b erfasst (Täuschung über die vorrätige Menge). [Fakt · Bundesrat, Bericht «Dark Patterns», 14.06.2024, Ziff. 6.1.2.2.1 und Übersichtstabelle]

> **Nicht erlaubt** (Fitness Muster): Ein Zähler «Angebot endet in 09:59», der bei jedem Besuch neu startet. Der Ablehnen-Knopf heisst «Nein, ich bleibe lieber unfit».
> **Erlaubt:** «Jahresabo CHF 690.– bis 31. Januar 2027, danach CHF 790.–.» Der Ablehnen-Knopf heisst «Nein, danke».

### 2.7 Bewertungen und Kundenstimmen

**Rechtslage:** Das UWG hat keinen eigenen Tatbestand für gefälschte Bewertungen. [Fakt · UWG Art. 3 Abs. 1 lit. a bis x, Stand 01.01.2025] Der Bundesrat ordnet sie lit. b zu: «Social Proof» ist problematisch, wenn die Bewertungen nicht der Wahrheit entsprechen. [Fakt · Bundesrat, Bericht «Dark Patterns», 14.06.2024, Ziff. 5.3.7 und 6.1.2.2.1]

- **Testimonials** sind unlauter, wenn sie über Angaben zum Produkt hinausgehen oder Inhalt und Urheber nicht belegt werden können. [Fakt · SLK-Grundsätze, B.7 Abs. 2]
- Name, Bild, Aussage oder Stimme einer erkennbaren Person nur mit **ausdrücklicher Zustimmung**. [Fakt · SLK-Grundsätze, B.7 Abs. 1]
- **Erfundene Personen** sind in der Werbung zu unterlassen, selbst wenn klar ist, dass sie erfunden sind. [Fakt · SLK-Grundsätze, B.7 Abs. 3] Folge [Annahme]: Auf einer echten Website stehen keine Musterstimmen, auch nicht als «Beispiel» markiert. Die Musterbetriebe dieses Skripts sind Lehrstoff, keine Werbung.
- Bewertungen, Besucherzahlen oder Ranglisten mit Bots oder falschen Profilen zu fälschen, ist unlauter. [Fakt · SLK-Grundsätze, B.16]
- Datenschutz und Berufsgeheimnis: Teil 6.

> **Nicht erlaubt** (Coiffeur Muster): «★★★★★ ‹Beste Coiffeuse der Welt!› Anna, 34», wenn die Stimme ausgedacht oder von einer Mitarbeiterin ist.
> **Erlaubt:** «4,6 von 5 Sternen aus 87 Google-Bewertungen (Stand 1. November 2026)» mit Link, und Einzelstimmen nur mit schriftlicher Zustimmung und belegter Quelle.

### 2.8 Testergebnisse

- Ein «Test» ist das Feststellen von Eigenschaften nach einem vorgeschriebenen, geeigneten Verfahren. Kundenumfragen ohne neutrale Testanlage sind kein Test. [Fakt · SLK-Grundsätze, B.6 Abs. 1]
- Werbung mit Tests ist unlauter, wenn sie gegen Neutralität, Objektivität, Sachlichkeit und Transparenz verstösst. [Fakt · SLK-Grundsätze, B.6 Abs. 2]
- Werbung mit Tests muss Quelle und Publikationsdatum genau angeben, die getesteten Kriterien nennen und Testergebnis und Werbung trennen. Werbung mit Testergebnissen ist unzulässig, soweit der Test nicht ausdrücklich für Werbung freigegeben ist (Zitatrecht vorbehalten). Pauschal «Testsieger» ohne weitere Angaben ist unlauter. [Fakt · SLK, Richtlinien für Tests, April 2001, Teil III Ziff. 3]

> **Nicht erlaubt** (Kaffeerösterei Beispiel): «Testsieger!» Oder: «Unsere Kundschaft hat getestet: 98 % zufrieden.» Das ist eine Umfrage, kein Test.
> **Erlaubt:** «Espresso ‹Muster› Note 5,4 von 6 im Test von [Zeitschrift], Heft 3/2026, Kriterien: Geschmack, Crema, Rückstände.» Nur mit Freigabe des Testveranstalters.

### 2.9 Garantien und «Geld zurück»

- Wird eine Rückgabe ohne Bedingungen versprochen («bei Nichtgefallen zurück»), muss die unbeschädigte Ware gegen volle Rückerstattung ohne Abzug und ohne Vorbehalt zurückgenommen werden. Bedingungen müssen klar und allgemein verständlich in der Werbung stehen. Die Frist muss reichen, um eine zugesicherte Wirkung zu prüfen. [Fakt · SLK-Grundsätze, B.14]
- Für «Garantie» verweist die SLK auf den ICC-Kodex: Werbung darf nicht behaupten oder andeuten, eine Garantie gebe zusätzliche Rechte über das Gesetz hinaus, wenn das nicht stimmt. Bedingungen, Name und Adresse des Garanten müssen leicht zugänglich sein, Einschränkungen gut sichtbar. [Fakt · ICC-Kodex 2024, Art. 13; SLK-Grundsätze, Stichwortregister «Garantie/garantiert»]
- Wer die gesetzliche Gewährleistung als eigene «Garantie» feiert, hebt eine Selbstverständlichkeit hervor (SLK B.4). [Annahme, abgeleitet aus B.4 und ICC Art. 13]

> **Nicht erlaubt** (Dachdecker Fiktiv): «100 % Zufriedenheitsgarantie!» ohne Bedingungen.
> **Erlaubt:** «Wird das Dach innert 5 Jahren undicht, reparieren wir kostenlos. Ausgenommen: Sturmschäden. Bedingungen: dachdecker-fiktiv.ch/garantie.»

### 2.10 Weitere Buchstaben, kurz

- **lit. x, Klima:** Unlauter sind Angaben zur verursachten Klimabelastung, die nicht durch objektive und überprüfbare Grundlagen belegt werden können. In Kraft seit 01.01.2025. [Fakt · UWG Art. 3 Abs. 1 lit. x und Fussnote 18] Beispiel: «klimaneutral» nur mit nachvollziehbarer Berechnung. [Annahme]
- **lit. o, Massenwerbung:** E-Mail-Werbung braucht vorher die Einwilligung, den korrekten Absender und eine einfache, kostenlose Abmeldung. Ausnahme: eigene Kundschaft für ähnliche eigene Angebote, wenn beim Erheben der Adresse auf die Ablehnung hingewiesen wurde. [Fakt · UWG Art. 3 Abs. 1 lit. o]
- **lit. s, Online-Bestellung:** Wer online Verträge anbietet, nennt Identität und Kontaktadresse samt E-Mail, beschreibt die Schritte zum Vertrag, erlaubt Korrekturen und bestätigt die Bestellung sofort elektronisch. Das gilt nicht für Telefon und Verträge nur per E-Mail. [Fakt · UWG Art. 3 Abs. 1 lit. s und Abs. 2]
- **lit. i:** Unlauter ist, wer Beschaffenheit, Menge, Verwendungszweck, Nutzen oder Gefährlichkeit verschleiert. [Fakt · UWG Art. 3 Abs. 1 lit. i]
- **Art. 3a, Fernhandel:** Kein Preis- oder Zugangsunterschied nach Wohnsitz oder Nationalität ohne sachlichen Grund. Ausgenommen sind unter anderem Gesundheitsdienstleistungen. [Fakt · UWG Art. 3a] Für Texte von KMU selten relevant. [Annahme]

---

## 3. PBV: Preise im Text

Das Format von Beträgen («CHF 120.–») regelt CH8. Hier geht es darum, **welcher** Preis stehen muss und wie ein Vergleichspreis aussehen darf.

### 3.1 Wann ein Preis Pflicht ist

- Die PBV gilt für Waren an Konsumentinnen und Konsumenten, für die Dienstleistungen im Katalog von Art. 10 und **für jede Werbung an Konsumenten, für alle Waren und Dienstleistungen**. [Fakt · PBV Art. 2 Abs. 1, Stand 01.01.2025]
- **Katalog (Art. 10 Abs. 1), Auswahl für KMU-Websites:** Coiffeur; Garage für Serviceleistungen; Gastgewerbe und Hotellerie; kosmetische Institute und Körperpflege; Fitnessinstitute, Schwimmbäder und andere Sportanlagen; Taxi; Unterhaltung, Museen, Ausstellungen; Vermietung von Fahrzeugen und Geräten; Wäschereien; Parkieren; Fotobranche (standardisierte Leistungen); Kurswesen; Flug- und Pauschalreisen; Dienstleistungen bei der Abgabe von Arzneimitteln und Medizinprodukten; Tier- und Zahnärzte; Bestattungsinstitute; Notariat. Dazu Fernmelde-, Mehrwert-, Bank- und Timesharing-Dienste. [Fakt · PBV Art. 10 Abs. 1 lit. a bis v]
- **Nicht im Katalog** sind zum Beispiel Handwerk (Maler, Sanitär, Schreiner), Physiotherapie, Arztpraxen ohne Abgabe von Arzneimitteln und Anwälte. Sie müssen ihre Preise im Angebot nicht bekanntgeben. [Annahme, abgeleitet aus der abschliessenden Liste; SECO nennt den Katalog «abschliessend», FAQ PBV, Abruf 01.11.2026]
- **Werbung:** Nennt ein Text einen Preis oder einen bezifferten Preisrahmen, muss es der tatsächlich zu bezahlende Preis sein, auch für Leistungen ausserhalb des Katalogs. [Fakt · PBV Art. 13 Abs. 1; SECO, FAQ PBV]
- **Internet:** Eine allgemeine Pflicht, Preise online zu zeigen, gibt es nicht. Kann man eine Katalog-Dienstleistung oder Ware direkt online bestellen (Warenkorb), müssen die tatsächlichen Preise in CHF stehen. [Fakt · SECO, FAQ PBV, Abruf 01.11.2026]

### 3.2 Der tatsächlich zu bezahlende Preis

- Nicht frei wählbare Zuschläge (Reservation, Service, Bearbeitung) und überwälzte Abgaben gehören in den Preis. Versandkosten dürfen separat stehen, Kurtaxen bei Dienstleistungen auch. [Fakt · PBV Art. 4 Abs. 1 und Art. 10 Abs. 2]
- Aus dem Preis muss hervorgehen, für welche Art und Einheit der Leistung oder welchen Verrechnungssatz er gilt. [Fakt · PBV Art. 11 Abs. 2 und Art. 14 Abs. 1]
- Trinkgeld: inbegriffen oder beziffert. «Trinkgeld nicht inbegriffen» ohne Zahl ist unzulässig. [Fakt · PBV Art. 12]

> **Nicht erlaubt** (Taxi Muster): «Fahrt zum Flughafen CHF 75.–», wenn ein Buchungszuschlag von CHF 5.– dazukommt.
> **Erlaubt:** «Fahrt Musterdorf bis Flughafen: CHF 80.–, Buchung inbegriffen.»

### 3.3 «ab»-Preise und Preisrahmen

- Rahmen («von CHF … bis CHF …») sind zulässig, wenn die tiefste und die höchste Stufe genannt sind. Grenzen («ab CHF …») sind zulässig mit genauer Beschreibung des Angebots zu diesem Preis. [Fakt · SECO, FAQ PBV, Abruf 01.11.2026]
- «ab» muss vor jedem Preis stehen, und es muss klar sein, wann und wie das Angebot gilt. [Fakt · SECO, FAQ PBV, Frage zu Wintersportanlagen]
- **Coiffeur:** «Brushing, ab CHF 43.–» ist nicht gestattet. Erlaubt sind Stufen, etwa Kurzhaar, Mittellang, Lang mit je eigenem Preis. [Fakt · SECO, FAQ PBV]

> **Nicht erlaubt** (Coiffeur Beispiel): «Damenschnitt ab CHF 59.–.»
> **Erlaubt:** «Damenschnitt mit Waschen und Föhnen: kurz CHF 59.–, mittel CHF 69.–, lang CHF 79.–.»

> **Erlaubt im Handwerk** (Malerei Muster): «Zimmer streichen ab CHF 690.–, zum Beispiel: Zimmer 12 m², Wände und Decke weiss, 2 Anstriche, Material inbegriffen.» [Annahme, analog SECO-Beispiel «Olivenbäume ab CHF 59.–» mit Beispielangebot]

### 3.4 Streichpreise und Vergleichspreise (Art. 16)

Neben dem tatsächlichen Preis darf ein **Vergleichspreis** nur in drei Fällen stehen. [Fakt · PBV Art. 16 Abs. 1, Stand 01.01.2025]

| Art | Voraussetzung | Wie lange | Quelle |
|---|---|---|---|
| **Selbstvergleich, Halbierungsregel** | Der Betrieb hat bis unmittelbar vorher tatsächlich zum Vergleichspreis angeboten. | höchstens halb so lange, wie der alte Preis galt, und höchstens 2 Monate | Art. 16 Abs. 1 lit. a Ziff. 1, Abs. 3 |
| **Selbstvergleich, 30-Tage-Regel** | Der Betrieb hat mindestens 30 aufeinanderfolgende Tage zum Vergleichspreis angeboten, ohne Preisänderung. | unbegrenzt, auch für weitere Senkungen; nicht nach einer Erhöhung | Art. 16 Abs. 1 lit. a Ziff. 2, Abs. 3 und 3bis; SECO, Informationsblatt Selbstvergleich |
| **Einführungspreis** | Der Betrieb verlangt unmittelbar danach tatsächlich den höheren Preis. | Einführung höchstens halb so lange wie der spätere Preis gilt, höchstens 2 Monate | Art. 16 Abs. 1 lit. b, Abs. 3; SECO, Wegleitung 2025 |
| **Konkurrenzvergleich** | Andere Anbieter im Marktgebiet verlangen für die überwiegende Menge gleicher Leistungen tatsächlich diesen Preis. | solange das stimmt | Art. 16 Abs. 1 lit. c |

[Fakt · PBV Art. 16; SECO, Informationsblatt Selbstvergleich, Juli 2025; SECO, Wegleitung 2025, S. 18 bis 21]

- **Neu seit 01.01.2025:** die 30-Tage-Regel und die Regel für Produkte, die vorübergehend aus dem Angebot waren (Abs. 3bis). [Fakt · PBV, Fussnoten 61, 63, 64: Verordnung vom 30.10.2024, AS 2024 621] Die Design-Uni nennt nur die Halbierungsregel, weil sie eine Fassung von 2022 gelesen hat. Die SECO-FAQ beschreibt beim Selbstvergleich ebenfalls nur die Halbierungsregel; das Informationsblatt vom Juli 2025 nennt beide. [Fakt · SECO, FAQ PBV und Informationsblatt Selbstvergleich, Abruf 01.11.2026]
- **Art des Vergleichs nennen:** Beim Einführungspreis und beim Konkurrenzvergleich muss die Art aus der Ankündigung hervorgehen. Blosses Durchstreichen genügt nicht; nötig ist etwa «Einführungspreis, später» oder «unser Preis, Preis der Konkurrenz». [Fakt · PBV Art. 16 Abs. 2; SECO, Wegleitung 2025, S. 18]
- **Glaubhaft machen:** Auf Verlangen muss der Betrieb die Voraussetzungen glaubhaft machen, etwa mit Verkaufsbelegen, Lieferscheinen, Prospekten. [Fakt · PBV Art. 16 Abs. 2; SECO, Informationsblatt Selbstvergleich, Ziff. 3]
- **Mondpreise:** Katalog- und Richtpreise von Herstellern sind als Vergleichspreis nur zulässig, wenn sie echte Marktpreise sind. Sonst sind es künstlich überhöhte «Mondpreise». [Fakt · PBV Art. 16 Abs. 5; SECO, Wegleitung 2025, S. 21; SECO, FAQ PBV]

> **Nicht erlaubt** (Garage Fiktiv AG): «Klimaservice CHF 149.– statt CHF 249.–», wenn die Garage nie CHF 249.– verlangt hat.
> **Erlaubt:** «Klimaservice CHF 149.– statt CHF 189.– (unser Preis vom 1. Juli bis 31. August 2026), gültig bis 30. September 2026.» Mit Beleg im Kassensystem.

### 3.5 Rabatte

- Bezifferte Hinweise auf Rabatte, Zugaben und Geschenke werden wie Vergleichspreise beurteilt. [Fakt · PBV Art. 17 Abs. 1]
- Ein einheitlicher Satz für ganze Gruppen («20 % auf alle Herrenschuhe») braucht keine Einzelpreise. [Fakt · PBV Art. 17 Abs. 2; SECO, FAQ PBV]
- «Bis zu 30 % Rabatt» ist nur zulässig, wenn alle Angebote mit Preis und Beschreibung aufgeführt sind. In der Praxis genügt ein Beispiel für die unterste und eines für die oberste Grenze, wenn die Spanne nicht zu gross ist. [Fakt · SECO, FAQ PBV]

> **Nicht erlaubt** (Sportgeschäft Muster): «Bis zu 50 % auf alles!»
> **Erlaubt:** «20 % auf alle Skijacken bis 15. Januar 2027.»

---

## 4. Gesundheit: Heilmittel, Kosmetik, Heilversprechen

### 4.1 Arzneimittel (HMG, AWV)

- **Publikumswerbung verboten** für verschreibungspflichtige Arzneimittel und für solche, die ohne ärztliche Diagnose oder Behandlung nicht verwendet werden können. [Fakt · HMG Art. 32 Abs. 2, Stand 01.01.2025]
- Jede Arzneimittelwerbung ist unzulässig, wenn sie irreführend ist oder zu übermässigem, missbräuchlichem oder unzweckmässigem Einsatz verleiten kann. [Fakt · HMG Art. 32 Abs. 1]
- Unzulässig in der Publikumswerbung sind unter anderem: Indikationen, die eine ärztliche Diagnose brauchen; aufdringliche, marktschreierische Werbung; Werbung, die wie ein redaktioneller Beitrag aussieht. [Fakt · AWV Art. 21 Abs. 1, Stand 01.01.2020]
- Werbung darf nicht: eine **garantierte Wirkung** versprechen oder behaupten, das Mittel habe keine Nebenwirkungen; eine Untersuchung als überflüssig erscheinen lassen; Gesunden Besserung versprechen oder ohne das Mittel Verschlechterung androhen; Empfehlungen von Fachleuten, Prominenten oder Laien zitieren; Personen in Berufskleidung zeigen; mit «Naturprodukt» die Sicherheit begründen; die Zahl der Behandelten nennen; Angst erzeugen. [Fakt · AWV Art. 22 lit. a, b, d, e, g, h, k, n, o]
- **Wer das betrifft** [Annahme, abgeleitet aus AWV Art. 1 und 2]: Die AWV regelt Werbung für Arzneimittel. Sie gilt für eine Praxis, sobald deren Text ein bestimmtes Arzneimittel oder einen Wirkstoff anpreist. Allgemeine Information über Gesundheit und Krankheiten ohne Bezug auf ein bestimmtes Arzneimittel ist keine Arzneimittelwerbung. [Fakt zur Ausnahme · AWV Art. 1 Abs. 2 lit. c]

### 4.2 Ästhetische Behandlungen mit verschreibungspflichtigen Mitteln

Swissmedic hat für Botulinumtoxin (Abgabekategorie A) ein Merkblatt. [Fakt · Swissmedic, Merkblatt «Botulinumtoxin, Leitlinien», Version 2.2, gültig ab 01.03.2026]

- Bei der Werbung für eigene Behandlungen sind nur allgemeine Informationen über Gesundheit oder Krankheiten erlaubt, keine über bestimmte Arzneimittel.
- **Keine Markennamen** wie «Botox» auf Websites.
- **Keine Vorher-Nachher-Bilder**: Sie gelten als Versprechen einer garantierten Wirkung (AWV Art. 22 lit. b).
- **Keine Rabattaktionen** auf Behandlungen mit Botulinumtoxin; Swissmedic nennt das einen gravierenden Verstoss.
- Keine Werbung für nicht zugelassene Anwendungen («off-label»).
- Werbung für «Faltenunterspritzung» ohne Nennung des Mittels und rein kosmetische Behandlungen in Kosmetikinstituten leitet Swissmedic an die Kantone weiter (Kantonsarzt, Kantonsapotheker, Kantonschemiker).

[Fakt · Swissmedic, Merkblatt Botulinumtoxin, 01.03.2026, S. 2 bis 3]

> **Nicht erlaubt** (Praxis für ästhetische Medizin Muster): «Botox-Aktion im März: 20 % Rabatt! Vorher-Nachher-Galerie ansehen.»
> **Erlaubt:** «Behandlung mimischer Falten. Ablauf, Risiken und Kosten besprechen wir im Erstgespräch (30 Minuten, CHF 80.–).»

### 4.3 Kosmetik und Körperpflege

- Angaben über kosmetische Mittel müssen den Tatsachen entsprechen; Werbung darf nicht täuschen, namentlich nicht über besondere Wirkungen. [Fakt · LMG Art. 18 Abs. 1 bis 3, Stand 01.10.2024; kosmetische Mittel sind Gebrauchsgegenstände nach LMG Art. 5 lit. b]
- **Hinweise jeder Art auf eine krankheitsheilende, -lindernde oder -verhütende Wirkung von Gebrauchsgegenständen sind verboten**, etwa medizinische, therapeutische, desinfizierende oder entzündungshemmende Wirkung. Ausnahme: belegte kariesverhütende Wirkung bei Zahnpflege. [Fakt · LGV Art. 47 Abs. 3 und 4, Stand 01.07.2025]
- Werbeaussagen dürfen Kosmetika keine Eigenschaften zuschreiben, die sie nicht haben. [Fakt · VKos Art. 10 Abs. 1, Stand 01.01.2026]
- **SLK D.6** für Produkte **und Methoden** der Körperpflege und des Wohlbefindens, also auch für Behandlungen im Studio: kein Anschein heilender, schmerzstillender oder schlaffördernder Wirkung; kein Eindruck, Falten, Glatzen, Pigmentflecken würden dauernd beseitigt oder die Büste gestrafft; keine dauernde Gewichtsabnahme ohne Diät und Bewegung; Vorher-Nachher-Bilder nur unter gleichen Bedingungen und ohne Nachbearbeitung. [Fakt · SLK-Grundsätze, D.6 Ziff. 1 bis 4]
- Bearbeitete Körperbilder, die ein nicht erreichbares Ergebnis versprechen, sind unlauter. [Fakt · SLK-Grundsätze, B.9]

> **Nicht erlaubt** (Kosmetikstudio Beispiel): «Unsere Gesichtsbehandlung heilt Akne und lässt Falten dauerhaft verschwinden.»
> **Erlaubt:** «Gesichtsreinigung mit Ausreinigung und Maske, 60 Minuten, CHF 120.–. Bei entzündeter Haut empfehlen wir zuerst die Hautärztin.»

### 4.4 Medizinprodukte

- Werbung darf nur Aussagen enthalten, die der Produktinformation entsprechen. Irreführende Angaben über Zweck, Sicherheit und Leistungsfähigkeit sind verboten. Publikumswerbung für Produkte, die nur Fachpersonen anwenden dürfen, ist verboten. [Fakt · MepV Art. 69, Stand 01.07.2026]

### 4.5 Was Praxen, Physiotherapie und Beauty nie versprechen

Zusammengezogen aus 4.1 bis 4.4 und Teil 5. [Annahme zur Zusammenstellung; jede Zeile mit Quelle]

| Versprechen | Warum nicht | Quelle |
|---|---|---|
| «garantiert schmerzfrei», «Heilung garantiert» | garantierte Wirkung; nicht objektiv | AWV Art. 22 lit. b; MedBG Art. 40 lit. d; GesBG Art. 16 lit. e |
| «Sie brauchen keinen Arzt mehr» | lässt Untersuchung überflüssig erscheinen | AWV Art. 22 lit. a |
| «ohne Nebenwirkungen», «100 % natürlich, darum sicher» | verboten in Heilmittelwerbung | AWV Art. 22 lit. b, k |
| «Über 5000 zufriedene Patienten» | Zahl der Behandelten; bei Ärzten Patientenempfehlung | AWV Art. 22 lit. n; FMH/SAMW-Leitfaden 2.5 |
| Patientenstimmen, Vorher-Nachher-Bilder | Empfehlung, Wirkversprechen | AWV Art. 22 lit. g; Swissmedic Merkblatt Botulinumtoxin; FMH/SAMW-Leitfaden 2.5 |
| «Falten dauerhaft weg», «10 kg in 2 Wochen» | dauernde Wirkung, Gewicht ohne Diät | SLK D.6 Ziff. 2 und 3 |
| «entzündungshemmende Pflege» für ein Kosmetikum | Heilhinweis bei Gebrauchsgegenstand | LGV Art. 47 Abs. 3 |
| Markenname eines verschreibungspflichtigen Mittels | Publikumswerbung verboten | HMG Art. 32 Abs. 2 lit. a; Swissmedic |

---

## 5. Berufsrecht, kurz

- **Medizinalberufe** (Ärztinnen, Zahnärzte, Chiropraktorinnen, Apotheker, Tierärztinnen): «Sie machen nur Werbung, die objektiv ist, dem öffentlichen Bedürfnis entspricht und weder irreführend noch aufdringlich ist.» [Fakt · MedBG Art. 2 Abs. 1 und Art. 40 lit. d, Stand 01.07.2025] Sanktionen bis Busse von 20 000 Franken und Berufsverbot. [Fakt · MedBG Art. 43 Abs. 1]
- **Werbung beginnt früh:** Werbung im Sinn von Art. 40 lit. d liegt schon vor, wenn Angaben gemacht werden, um Patientinnen und Patienten von den medizinischen Fähigkeiten zu überzeugen. [Fakt · BGer 2C_95/2021 vom 27.08.2021, E. 7.3, gelesen in der Wiedergabe der Uni Bern (DFR)]
- **Gesundheitsberufe** (Pflege, Physiotherapie, Ergotherapie, Hebammen, Ernährungsberatung, Optometrie, Osteopathie) haben wörtlich dieselbe Werbepflicht. [Fakt · GesBG Art. 2 Abs. 1 und Art. 16 lit. e, Stand 01.07.2025]
- **Was erlaubt ist:** Qualifikationen, Werdegang, Sprachen, Aufnahme neuer Patienten, Sprechstunden, Leistungsangebot, Mitgliedschaften. Patientenempfehlungen und Werbung, die unsinnige Heilungshoffnungen weckt, gelten als schädlich für das Ansehen des Berufs; Kommentare auf Bewertungsplattformen eignen sich oft nicht für ärztliche Werbung. [Zweitquelle · SAMW/FMH, Rechtlicher Leitfaden, Kap. 2.5, aktualisiert 22.06.2026; stützt sich auf MedBG Art. 40 lit. d und die FMH-Standesordnung, Anhang 2] Die Standesordnung gilt für FMH-Mitglieder und ist strenger als das Gesetz. [Zweitquelle · ebenda]
- **«Klinik»:** Das Bundesgericht hat «Zahnklinik» für eine ambulante Praxis als täuschend beurteilt. [Zweitquelle · SAMW/FMH, Leitfaden 2.5, Fussnote 8, zu BGer 2C_367/2008 vom 20.11.2008; Urteil nicht selbst gelesen]
- **Anwältinnen und Anwälte** «können Werbung machen, solange diese objektiv bleibt und solange sie dem Informationsbedürfnis der Öffentlichkeit entspricht». [Fakt · BGFA Art. 12 lit. d, Stand 01.07.2025] Sie dürfen vor Ende eines Rechtsstreits keine Beteiligung am Prozessgewinn statt Honorar vereinbaren und sich nicht verpflichten, bei Misserfolg auf das Honorar zu verzichten. [Fakt · BGFA Art. 12 lit. e] Folge [Annahme]: «Kein Erfolg, kein Honorar» gehört nicht auf eine Anwaltswebsite.

> **Nicht erlaubt** (Zahnarztpraxis Muster): «Die beste Zahnklinik der Region. Unsere Patienten sagen: ‹Endlich keine Angst mehr!›»
> **Erlaubt:** «Zahnarztpraxis Muster, Musterdorf. Dr. med. dent. Beispiel, eidg. dipl. Zahnärztin. Behandlung unter Lachgas möglich. Neue Patientinnen und Patienten willkommen.»

> **Nicht erlaubt** (Anwaltskanzlei Fiktiv): «Wir gewinnen. Kein Erfolg, kein Honorar.»
> **Erlaubt:** «Mietrecht und Arbeitsrecht. Erstberatung 45 Minuten, CHF 250.–.»

---

## 6. Datenschutz und Berufsgeheimnis beim Zitieren

- Name, Initialen mit Ort, Foto oder eine Aussage, die einer bestimmbaren Person zugeordnet werden kann, sind **Personendaten**. Daten über die Gesundheit sind **besonders schützenswert**. [Fakt · DSG Art. 5 lit. a und c Ziff. 2, Stand 07.07.2025]
- Personendaten dürfen nur zu einem erkennbaren Zweck beschafft und nur damit vereinbar bearbeitet werden. Eine Einwilligung gilt nur, wenn sie nach angemessener Information freiwillig für bestimmte Bearbeitungen erteilt wird. Für besonders schützenswerte Daten muss sie **ausdrücklich** sein. [Fakt · DSG Art. 6 Abs. 3, 6 und 7]
- Wer Dritten besonders schützenswerte Daten bekannt gibt, verletzt die Persönlichkeit, wenn kein Rechtfertigungsgrund besteht. Eine Website gibt sie allen bekannt. [Fakt · DSG Art. 30 Abs. 2 lit. c; Website als Bekanntgabe: Annahme nach DSG Art. 5 lit. e]
- Gerechtfertigt ist eine Verletzung durch Einwilligung, überwiegendes Interesse oder Gesetz. [Fakt · DSG Art. 31 Abs. 1] Hat jemand seine Daten selbst allgemein zugänglich gemacht (etwa eine öffentliche Google-Bewertung), liegt in der Regel keine Verletzung vor, solange er die Bearbeitung nicht ausdrücklich untersagt hat. [Fakt · DSG Art. 30 Abs. 3] Ob das Kopieren einer öffentlichen Bewertung auf die eigene Werbeseite davon gedeckt ist, ist offen (Teil 9). [Annahme]
- **Berufsgeheimnis:** Ärzte, Zahnärzte, Physiotherapeuten, Ergotherapeuten, Osteopathen, Hebammen, Psychologen, Anwälte und ihre Hilfspersonen machen sich strafbar, wenn sie ein anvertrautes Geheimnis offenbaren, es sei denn mit Einwilligung des Berechtigten. [Fakt · StGB Art. 321 Ziff. 1 und 2, Stand 01.11.2026] Schon die Angabe, jemand sei Patientin einer Praxis, kann ein solches Geheimnis sein. [Annahme; zu prüfen, Teil 9]
- Lauterkeitsrecht: Name, Bild oder Aussage einer erkennbaren Person nur mit ausdrücklicher Zustimmung. [Fakt · SLK-Grundsätze, B.7 Abs. 1]

**Arbeitsregel für Texter** [Annahme, abgeleitet aus den Punkten oben]:
1. Stimmen nur mit schriftlicher Zustimmung, die Zweck (Website), Wortlaut, Namensform und Dauer nennt.
2. Bei Praxen und Therapien: ausdrückliche schriftliche Einwilligung **und** Entbindung vom Berufsgeheimnis; besser ganz auf Patientenstimmen verzichten (Teil 5).
3. Sonst: Durchschnitt, Anzahl, Plattform, Datum und Link statt Namen.
4. Nie Diagnosen, Beschwerden oder Behandlungen einer erkennbaren Person.

> **Nicht erlaubt** (Physiotherapie Muster): «‹Nach dem Bandscheibenvorfall konnte ich wieder arbeiten.› Peter K., Musterdorf», ohne Einwilligung.
> **Erlaubt:** «4,8 von 5 Sternen aus 64 Google-Bewertungen (Stand 1. November 2026)» mit Link zur Plattform.

### 6.1 Datenschutzerklärung: was mindestens drinsteht

Nachgelesen am 02.11.2026, weil dieses Skript seit diesem Tag den Wortlaut von Impressum und Datenschutzerklärung für alle drei Skills regelt. Keine Rechtsauskunft.

- Wer Personendaten beschafft, informiert die betroffene Person angemessen darüber, auch wenn die Daten nicht bei ihr beschafft werden. [Fakt · DSG Art. 19 Abs. 1, Stand 07.07.2025, Abruf 02.11.2026]
- Mitgeteilt werden mindestens: die Identität und die Kontaktdaten des Verantwortlichen, der Bearbeitungszweck und gegebenenfalls die Empfängerinnen und Empfänger oder deren Kategorien. [Fakt · DSG Art. 19 Abs. 2, Stand 07.07.2025, Abruf 02.11.2026]
- Gehen Personendaten ins Ausland, nennt die Information auch den Staat oder das internationale Organ und gegebenenfalls die Garantien nach Art. 16 Abs. 2 oder die Ausnahme nach Art. 17. [Fakt · DSG Art. 19 Abs. 4, Stand 07.07.2025, Abruf 02.11.2026]
- Ausnahmen von der Informationspflicht nennt Art. 20. [Fakt · DSG Art. 20, Stand 07.07.2025, Abruf 02.11.2026] Ob eine davon für eine Website gilt, ist eine Frage für die Anwältin (Teil 9). [Annahme]
- **Folge für den Text** [Annahme]: Die Datenschutzerklärung sagt in einfachen Sätzen, wer verantwortlich ist und wie man ihn erreicht, welche Personendaten die Website wofür bearbeitet (etwa Formular, Zählung, Hosting) und an wen sie gehen (Hoster, fremde Dienste nach CL3), mit Land. Welche Daten tatsächlich anfallen, liefert web-uni (Hoster, Formular-Backend, Zählendpunkt); dieses Skript regelt nur den Wortlaut. Was nicht belegt ist, bleibt eine sichtbare Lücke und ist als «Rechtsprüfung nötig» markiert (R24).

---

## 7. Leitentscheide

Nur Entscheide, die gelesen oder über eine amtliche oder fachliche Quelle belegt sind.

| Entscheid | Kern für Werbetexte | Wie gelesen |
|---|---|---|
| BGE 132 III 414 (Band 2006), E. 4.1.2 und 4.2.1 | Unrichtig heisst falsch, irreführend kann auch wahr sein. Superlative sind vergleichende Werbung; konkrete prüfbare Angaben müssen stimmen. Preisvergleich nur bei gleicher Menge und Qualität. | Urteil auf bger.ch gelesen (Französisch) |
| BGer 2C_95/2021 vom 27.08.2021, E. 7.3 | Werbung nach MedBG Art. 40 lit. d liegt schon vor, wenn Angaben Patienten von den Fähigkeiten überzeugen sollen. | Wiedergabe DFR, Universität Bern |
| BGer 2C_367/2008 vom 20.11.2008 | «Zahnklinik» für ambulante Praxis täuschend. | nur über SAMW/FMH-Leitfaden |
| BGer 2A.787/2006 vom 13.06.2007; BVGer C-1795/2009 vom 17.10.2011 | Indirekte Arzneimittelwerbung, auch bei der Anpreisung ärztlicher Dienstleistungen; Gesamteindruck entscheidet. | nur über Swissmedic-Merkblatt Botulinumtoxin |
| SLK, Zweite Kammer, Fall Nr. 133/16 (2016) | «Die beliebteste Schokolade der Schweiz» zulässig, weil meistverkauft unbestritten; Superlativ als Vergleich mit der ganzen Konkurrenz. | SLK-Tätigkeitsbericht 2016 |
| SLK, Plenum Nr. 150/07 vom 31.10.2007 | «Nr. 1» bei Mineralwasser: beweispflichtige Behauptung zur Marktführerschaft. | nur über SLK-Tätigkeitsbericht 2016 |

Die SLK ist Selbstregulierung der Branche. Ihre Entscheide binden kein Gericht, zeigen aber, wie Werbung in der Schweiz beurteilt wird. [Fakt zur Rolle · SLK-Grundsätze, Einleitung; Gewicht: Annahme]

---

## 8. Zwei Fallen für die Semesterprüfung

Beide Fassungen eines Paars enthalten dieselben Fakten. Die erste Fassung enthält die Falle. Der Lösungsschlüssel (welche Fassung als A oder B erscheint) liegt nur im Scratchpad. **Alles erfunden.**

### Falle 1: erfundener Vorpreis

Fakt im Hintergrund (für den Schlüssel): Die Garage Fiktiv AG hat den kleinen Service nie für CHF 390.– angeboten. Verstoss gegen PBV Art. 16 und UWG Art. 3 Abs. 1 lit. b.

- **Fassung mit Falle (unlauter, 26 Wörter):** «Garage Fiktiv AG, Musterdorf. Kleiner Service für Kleinwagen: jetzt CHF 290.– statt CHF 390.–. Inbegriffen: Öl, Ölfilter, Bremsencheck und Ersatzwagen für den Tag. Termin online buchen.»
- **Ehrliche Gegenfassung (22 Wörter):** «Garage Fiktiv AG, Musterdorf. Kleiner Service für Kleinwagen: CHF 290.–. Inbegriffen: Öl, Ölfilter, Bremsencheck und Ersatzwagen für den Tag. Termin online buchen.»

### Falle 2: Heilversprechen

Verstoss gegen GesBG Art. 16 lit. e (nicht objektiv, irreführend) und SLK D.6 Ziff. 1; bei Bezug auf ein Arzneimittel zusätzlich AWV Art. 22 lit. b.

- **Fassung mit Falle (unlauter, 29 Wörter):** «Physiotherapie Muster, Musterdorf. Rückenschmerzen? Wir untersuchen, woher sie kommen, und üben mit Ihnen gezielt. Danach sind Sie garantiert schmerzfrei. Termine innert 3 Arbeitstagen, Montag bis Freitag bis 20 Uhr.»
- **Ehrliche Gegenfassung (24 Wörter):** «Physiotherapie Muster, Musterdorf. Rückenschmerzen? Wir untersuchen, woher sie kommen, und üben mit Ihnen gezielt. Termine innert 3 Arbeitstagen, Montag bis Freitag bis 20 Uhr.»

Die Fassungen unterscheiden sich nur im Satz mit dem Versprechen. [Annahme zum Aufbau, nach den Regeln der Semesterprüfung]

---

## 9. Für die Anwältin: offene Fragen

1. **Haftung des Texters:** Haftet neben dem Betrieb auch die Agentur oder der Texter nach UWG Art. 9 und 23, wenn ein Text unlauter ist?
2. **Öffentliche Bewertungen übernehmen:** Deckt DSG Art. 30 Abs. 3 das Kopieren einer öffentlichen Google-Bewertung mit Vorname und Initial auf die eigene Website? Braucht es zusätzlich die Zustimmung nach SLK B.7? Wie steht es mit dem Urheberrecht am Bewertungstext und den Nutzungsbedingungen der Plattform?
3. **Berufsgeheimnis:** Ist schon der Hinweis, eine erkennbare Person sei Patientin, ein Geheimnis nach StGB Art. 321? Genügt eine schriftliche Einwilligung, oder braucht es mehr?
4. **Physiotherapie und Patientenstimmen:** Gilt die strenge Praxis der FMH zu Patientenempfehlungen über GesBG Art. 16 lit. e auch für Physiotherapie, oder nur kantonal unterschiedlich?
5. **Heilversprechen ohne Heilmittel:** Welche Norm greift, wenn ein Kosmetikstudio oder eine Massagepraxis ohne Produktbezug Heilung verspricht: nur UWG Art. 3 lit. b und SLK D.6, oder auch kantonales Gesundheitsrecht (bewilligungspflichtige Heiltätigkeit)?
6. **«ab»-Preise ausserhalb des Katalogs:** Gelten die SECO-Vorgaben zu «ab»-Preisen (Beispielangebot) auch für Handwerker, die freiwillig Richtpreise nennen?
7. **Superlative ohne Zahl:** Wo verläuft die Grenze zwischen erlaubtem Werturteil («unser Lieblingsrezept») und beweispflichtiger Alleinstellung («die feinste Pizza der Stadt»)?
8. **Garantie bei Dienstleistungen:** Gilt SLK B.14 (Rückgabe von Waren) sinngemäss für «Geld zurück»-Zusagen bei Dienstleistungen?
9. **Viagogo:** Eine Zweitquelle meldet, das Handelsgericht Zürich (HG170194) habe Countdowns nicht als besonders aggressiv nach lit. h beurteilt. Das Urteil wurde nicht gelesen. Wie ist die Rechtslage nach diesem Urteil und nach dem Bundesratsbericht 2024?
10. **AWV-Fassung:** Fedlex führt als neueste Fassung den Stand 01.01.2020. Gibt es seither Änderungen, die nicht konsolidiert sind?
11. **Impressum und Datenschutzerklärung:** Welche Angaben braucht das Impressum einer Website ohne Online-Verträge, wenn UWG Art. 3 Abs. 1 lit. s nicht greift? Welche Bearbeitungen einer KMU-Website (Server-Protokolle beim Hoster, Formular, Zählung ohne Cookies) muss die Datenschutzerklärung einzeln nennen? (Ergänzt am 02.11.2026.)

---

## 10. Was Texte nie sagen, auf einen Blick

[Annahme zur Liste; Quellen in den Teilen 2 bis 6]

- Tatsachen ohne Beleg: Jahre, Zahlen, Kundenzahlen, Fristen, Mengen.
- Superlative und «Nr. 1» ohne Marktbeleg.
- Vorpreise, die nie verlangt wurden; «bis zu %» ohne Liste.
- Knappheit, die es nicht gibt; Countdowns, die neu starten.
- Stimmen ohne Zustimmung, erfundene Personen, gekaufte oder eigene Bewertungen.
- «Testsieger» ohne Quelle und Datum.
- «Garantie» ohne Bedingungen; die gesetzliche Gewährleistung als Extra.
- Heilversprechen, «schmerzfrei garantiert», «ohne Nebenwirkungen», Markennamen verschreibungspflichtiger Mittel.
- Titel, die niemand im Betrieb hat; «Klinik» für eine ambulante Praxis.
- «Kein Erfolg, kein Honorar» bei Anwälten.

---

## Prüfbare Grundsätze

Jede Regel nennt eine Prüffrage, die ein Bewerter oder ein Werkzeug entscheiden kann. Ein Befund heisst: umschreiben oder der Anwältin vorlegen.

- **R1 Beleg für jede Tatsache.** Prüffrage: Ist für jede Zahl, Jahresangabe, Frist, Menge und Eigenschaft im Text ein Beleg des Betriebs notiert (Dokument, Datum, Quelle)? Fehlt einer, ist es ein Befund. [Fakt · UWG Art. 3 Abs. 1 lit. b und Art. 13a; SLK A.5]
- **R2 Kein Superlativ ohne Beleg.** Prüffrage: Steht ein Superlativ oder eine Alleinstellung («beste», «grösste», «schnellste», «günstigste», «einzige», «Nr. 1», «führend») ohne Beleg im selben oder nächsten Satz? Im Titel (`<title>` und `h1`) und in der Beschreibung steht kein Superlativ, auch kein belegter (A19, S5, S30). Werkzeug: Wortliste plus Suche nach Endungen auf «-ste» und «-sten». [Fakt · BGE 132 III 414 E. 4.2.1; SLK-Tätigkeitsbericht 2016; Wortliste: Annahme; Titel und Beschreibung: Entscheid · Studio, 02.11.2026]
  Geändert am 02.11.2026: Titel und Beschreibung ohne Superlativ ergänzt; diese Fassung gilt für alle drei Skills (Entscheid 9). `[Entscheid · Studio, 02.11.2026]`
- **R3 Keine Selbstverständlichkeit als Vorzug.** Prüffrage: Hebt der Text etwas hervor, das Gesetz oder Branche ohnehin verlangen («inkl. MWST», «versichert», «gesetzliche Garantie», «Datenschutz nach DSG»)? [Fakt · SLK B.4]
- **R4 Vergleich nur sachlich und vollständig.** Prüffrage: Nennt oder meint der Text Mitbewerber («andere», «die Konkurrenz»)? Wenn ja: gleiche Leistung, gleiche Menge, belegte Zahl, keine Abwertung? [Fakt · UWG Art. 3 Abs. 1 lit. a und e; SLK B.1, B.3; BGE 132 III 414 E. 4.2.1]
- **R5 Titel nur echt.** Prüffrage: Ist jeder Titel, jede Berufsbezeichnung und jede Mitgliedschaft mit Urkunde oder Register belegt, ein ausländischer Titel mit Anerkennung? [Fakt · UWG Art. 3 Abs. 1 lit. c; SLK B.12; MedBG Art. 58]
- **R6 Knappheit und Frist nur echt.** Prüffrage: Ist jede Mengen- oder Zeitangabe belegt, gilt ein Sonderangebot mindestens 3 Tage, startet kein Zähler neu, und hat der Ablehnen-Knopf einen neutralen Text? [Fakt · UWG Art. 3 Abs. 1 lit. b und h; SLK B.2 Abs. 2 Ziff. 4; Bundesrat, Bericht Dark Patterns, 14.06.2024]
- **R7 Stimmen echt, belegt, mit Zustimmung.** Prüffrage: Gibt es zu jeder Stimme Quelle, Datum, Urheber und eine schriftliche Zustimmung, und bleibt sie bei Angaben zur Leistung? Erfundene, gekaufte oder eigene Stimmen sind immer ein Befund. [Fakt · SLK B.7 Abs. 1 bis 3, B.16; Bundesrat, Bericht Dark Patterns, Ziff. 5.3.7]
- **R8 Bewertungsschnitt mit Anzahl, Plattform und Datum.** Prüffrage: Steht neben jedem Sterneschnitt die Anzahl der Bewertungen, die Plattform und das Stand-Datum? [Annahme, abgeleitet aus UWG Art. 3 Abs. 1 lit. b und SLK B.7 Abs. 2]
- **R9 Tests nur mit Quelle.** Prüffrage: Nennt jede Testaussage Testveranstalter, Datum oder Heft und Kriterien, und liegt eine Freigabe für Werbung vor? «Testsieger» allein ist ein Befund. Eine Kundenumfrage heisst nicht «Test». [Fakt · SLK B.6; SLK, Richtlinien für Tests, 2001, Teil III Ziff. 3]
- **R10 Garantie mit Bedingungen.** Prüffrage: Steht bei jedem «Garantie», «Geld zurück» oder «bei Nichtgefallen» im selben Abschnitt oder einen Klick entfernt, was gilt, wie lange, was ausgenommen ist und wer garantiert? [Fakt · SLK B.14; ICC-Kodex 2024, Art. 13]
- **R11 «Gratis» ohne Haken.** Prüffrage: Ist «gratis» oder «kostenlos» ohne Kaufpflicht und ohne Aufschlag auf das Hauptangebot? [Fakt · ICC-Kodex 2024, Art. 10; UWG Art. 3 Abs. 1 lit. g]
- **R12 Katalog-Branche nennt Endpreise.** Prüffrage: Steht der Betrieb im Katalog von PBV Art. 10 (Coiffeur, Kosmetik, Garage-Service, Gastgewerbe, Fitness, Kurse, Taxi, Vermietung, Zahn- und Tierärzte usw.)? Wenn ja und online buchbar: Endpreis in CHF je Leistung, Zuschläge inbegriffen, Stufen statt «ab». [Fakt · PBV Art. 10 und 11; SECO, FAQ PBV]
- **R13 Jeder genannte Preis ist der Endpreis, mit Leistung und Einheit.** Prüffrage: Sagt der Satz mit dem Betrag, wofür er gilt (Leistung, Einheit, Umfang), und sind alle nicht frei wählbaren Zuschläge drin? Format nach CH8. [Fakt · PBV Art. 4, 13, 14]
- **R14 «ab» nur mit Beispiel, Rahmen mit beiden Enden.** Prüffrage: Steht bei jedem «ab CHF» ein konkretes Angebot zu genau diesem Preis, und bei jedem Rahmen der tiefste und der höchste Preis? [Fakt · SECO, FAQ PBV]
- **R15 Streichpreis nur nach Art. 16.** Prüffrage: Ist für jeden Vergleichs- oder Streichpreis die Art notiert (Selbstvergleich, Einführung, Konkurrenz), ein Beleg vorhanden (Kasse, Prospekt) und die Frist eingehalten (halbe Dauer und höchstens 2 Monate, oder 30 Tage gleicher Preis vorher)? Steht bei Einführungs- und Konkurrenzpreis die Art im Text? [Fakt · PBV Art. 16; SECO, Informationsblatt Selbstvergleich, 2025; SECO, Wegleitung 2025]
- **R16 Rabatt nur bezifferbar.** Prüffrage: Gilt ein Prozentsatz einheitlich für eine Gruppe, oder sind bei «bis zu» alle Angebote oder beide Grenzen mit Preis genannt? [Fakt · PBV Art. 17; SECO, FAQ PBV]
- **R17 Kein Heilversprechen.** Prüffrage: Verspricht der Text eine Heilung, Schmerzfreiheit, Wirkung ohne Nebenwirkung, dauerhafte Schönheitswirkung oder Gewichtsverlust ohne Diät, oder steht «garantiert» neben einer Wirkung am Körper? Werkzeug: Wortliste («heilt», «garantiert», «schmerzfrei», «dauerhaft», «ohne Nebenwirkungen», «entzündungshemmend»). [Fakt · AWV Art. 22 lit. b; LGV Art. 47 Abs. 3; VKos Art. 10; SLK D.6; MedBG Art. 40 lit. d; GesBG Art. 16 lit. e; Wortliste: Annahme]
- **R18 Keine Werbung für verschreibungspflichtige Mittel.** Prüffrage: Nennt der Text den Markennamen oder werbend den Wirkstoff eines verschreibungspflichtigen Arzneimittels, zeigt er Vorher-Nachher-Bilder oder bietet er Rabatt auf eine Behandlung damit? [Fakt · HMG Art. 32 Abs. 2 lit. a; Swissmedic, Merkblatt Botulinumtoxin, 01.03.2026]
- **R19 Gesundheitsberufe sachlich.** Prüffrage (Medizinal- und Gesundheitsberufe): Ist jede Aussage objektiv und nützlich für die Wahl (Qualifikation, Angebot, Zeiten, Sprachen), und fehlen Superlative, Patientenempfehlungen, Rabattaktionen und «Klinik» für eine ambulante Praxis? [Fakt · MedBG Art. 40 lit. d; GesBG Art. 16 lit. e; BGer 2C_95/2021 E. 7.3; Zweitquelle · SAMW/FMH-Leitfaden 2.5]
- **R20 Anwälte objektiv, ohne Erfolgshonorar.** Prüffrage: Ist der Text informativ und objektiv, und fehlt jede Zusage wie «kein Erfolg, kein Honorar»? [Fakt · BGFA Art. 12 lit. d und e]
- **R21 Keine Gesundheitsdaten erkennbarer Personen.** Prüffrage: Lässt eine Stimme, ein Bild oder ein Fallbeispiel erkennen, wer behandelt wurde oder woran jemand leidet? Dann braucht es eine ausdrückliche schriftliche Einwilligung und, bei Berufsgeheimnis, die Entbindung; sonst ist es ein Befund. [Fakt · DSG Art. 5 lit. c, Art. 6 Abs. 7, Art. 30 Abs. 2 lit. c; StGB Art. 321]
- **R22 Klimaaussage nur mit Grundlage.** Prüffrage: Hat jede Aussage wie «klimaneutral», «CO₂-frei» oder «klimafreundlich» eine objektive, überprüfbare Grundlage, die verlinkt oder auf Anfrage erhältlich ist? [Fakt · UWG Art. 3 Abs. 1 lit. x]
- **R23 Vollständige Firma.** Prüffrage: Steht im Impressum die Firma genau wie im Handelsregister, und erscheint ein Kurzname nur zusammen mit ihr? [Fakt · SLK B.10]
- **R24 Grenzfall markieren.** Prüffrage: Ist jede Aussage, die eine der Fragen in Teil 9 berührt, im Entwurf als «Rechtsprüfung nötig» markiert? [Annahme]

---

## Quellen

Alle abgerufen am 01.11.2026.

**Gesetze und Verordnungen** (amtliche HTML-Fassung aus dem Fedlex-Filestore; Weg über den SPARQL-Endpunkt https://fedlex.data.admin.ch/sparqlendpoint; die Fedlex-Seiten selbst laden nur mit JavaScript)

1. Bundesgesetz gegen den unlauteren Wettbewerb (UWG), SR 241, Stand 01.01.2025. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1988/223_223_223/20250101/de/html/fedlex-data-admin-ch-eli-cc-1988-223_223_223-20250101-de-html-5.html · Fedlex-Seite: https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/de
2. Preisbekanntgabeverordnung (PBV), SR 942.211, Stand 01.01.2025. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1978/2081_2081_2081/20250101/de/html/fedlex-data-admin-ch-eli-cc-1978-2081_2081_2081-20250101-de-html-3.html
3. Heilmittelgesetz (HMG), SR 812.21, Stand 01.01.2025. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2001/422/20250101/de/html/fedlex-data-admin-ch-eli-cc-2001-422-20250101-de-html-7.html
4. Arzneimittel-Werbeverordnung (AWV), SR 812.212.5, Stand 01.01.2020. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2001/519/20200101/de/html/fedlex-data-admin-ch-eli-cc-2001-519-20200101-de-html-6.html
5. Medizinprodukteverordnung (MepV), SR 812.213, Stand 01.07.2026. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2020/552/20260701/de/html/fedlex-data-admin-ch-eli-cc-2020-552-20260701-de-html-2.html
6. Medizinalberufegesetz (MedBG), SR 811.11, Stand 01.07.2025. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2007/537/20250701/de/html/fedlex-data-admin-ch-eli-cc-2007-537-20250701-de-html-4.html
7. Gesundheitsberufegesetz (GesBG), SR 811.21, Stand 01.07.2025. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2020/16/20250701/de/html/fedlex-data-admin-ch-eli-cc-2020-16-20250701-de-html.html
8. Anwaltsgesetz (BGFA), SR 935.61, Stand 01.07.2025. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2002/153/20250701/de/html/fedlex-data-admin-ch-eli-cc-2002-153-20250701-de-html-1.html
9. Datenschutzgesetz (DSG), SR 235.1, Stand 07.07.2025. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2022/491/20250707/de/html/fedlex-data-admin-ch-eli-cc-2022-491-20250707-de-html-1.html
10. Strafgesetzbuch (StGB), SR 311.0, Stand 01.11.2026, Art. 321. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/54/757_781_799/20261101/de/html/fedlex-data-admin-ch-eli-cc-54-757_781_799-20261101-de-html-1.html
11. Lebensmittelgesetz (LMG), SR 817.0, Stand 01.10.2024. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2017/62/20241001/de/html/fedlex-data-admin-ch-eli-cc-2017-62-20241001-de-html-5.html
12. Lebensmittel- und Gebrauchsgegenständeverordnung (LGV), SR 817.02, Stand 01.07.2025. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2017/63/20250701/de/html/fedlex-data-admin-ch-eli-cc-2017-63-20250701-de-html-1.html
13. Verordnung des EDI über kosmetische Mittel (VKos), SR 817.023.31, Stand 01.01.2026. https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2017/165/20260101/de/html/fedlex-data-admin-ch-eli-cc-2017-165-20260101-de-html.html

**Behörden**

14. SECO, «FAQ zur Preisbekanntgabe». https://www.seco.admin.ch/de/faq-pbv
15. SECO, «Informationsblatt Preisbekanntgabeverordnung, Selbstvergleich» (PDF erstellt Juli 2025, auf der FAQ-Seite datiert 30.10.2025). https://www.seco.admin.ch/dam/de/sd-web/qUkp9ZMpFVfF/PBV-Brosch%C3%BCren-Selbstvergleich-DE.pdf
16. SECO, «Preisbekanntgabe, Wegleitung für die Praxis 2025» (PDF erstellt 02.09.2025). https://www.seco.admin.ch/dam/de/sd-web/37az5I4TCZV7/PBV-Brosch%C3%BCren-Wegleitung-SECO-2025-DE.pdf
17. Swissmedic, Merkblatt «Botulinumtoxin, Leitlinien», MU105_00_002, Version 2.2, gültig ab 01.03.2026. https://www.swissmedic.ch/dam/swissmedic/de/dokumente/marktueberwachung/mu/mu105_00_002d_mbbotulinumtoxin-leitlinien.pdf.download.pdf/mu105_00_002d_mbbotulinumtoxin-leitlinien-rev.pdf · Übersicht Publikumswerbung: https://www.swissmedic.ch/swissmedic/de/home/humanarzneimittel/marktueberwachung/arzneimittelwerbung/publikumswerbung.html
18. Der Bundesrat, «Dark Patterns. Das Unbekannte dokumentieren», Bericht in Erfüllung des Postulates 22.3190, 14.06.2024. https://www.newsd.admin.ch/newsd/message/attachments/88176.pdf

**Selbstregulierung**

19. Schweizerische Lauterkeitskommission, «Grundsätze Lauterkeit in der kommerziellen Kommunikation», Stand Januar 2025. https://www.faire-werbung.ch/wp-content/uploads/2025/01/SLK-Grundsaetze_DE-1.1.2025.pdf
20. Schweizerische Lauterkeitskommission, «Richtlinien für Tests», April 2001. https://www.faire-werbung.ch/wp-content/uploads/2021/11/richtlinie_tests_de.pdf
21. Schweizerische Lauterkeitskommission, Tätigkeitsbericht 2016 (Fall Nr. 133/16 «Superlativwerbung»). https://www.faire-werbung.ch/wp-content/uploads/2021/09/TB_2016.pdf
22. ICC, «Advertising and Marketing Communications Code», 2024, Art. 10 und 13. https://iccwbo.org/wp-content/uploads/sites/3/2024/09/ICC_2024_MarketingCode_2024.pdf

**Rechtsprechung und Fachquellen**

23. BGE 132 III 414, I. zivilrechtliche Abteilung (Französisch). https://www.bger.ch/ext/eurospider/live/de/php/clir/http/index.php?highlight_docid=atf%3A%2F%2F132-III-414%3Ade&lang=de&type=show_document
24. BGer 2C_95/2021 vom 27.08.2021, Wiedergabe DFR, Universität Bern. https://www.servat.unibe.ch/dfr/bger/2021/210827_2C_95-2021.html
25. SAMW und FMH, «Rechtliche Grundlagen im medizinischen Alltag», Kapitel 2.5 «Information, Werbung und Verwendung von Berufsbezeichnungen», aktualisiert 22.06.2026. https://leitfaden.samw.fmh.ch/rechtlicher-leitfaden/2-rahmenbedingungen-des-arztes/25-verwendung-von-arzttiteln.cfm

**Nicht gelesen oder nicht erreichbar:** die Urteile BGer 2C_367/2008, BGer 2A.787/2006 und BVGer C-1795/2009 (nur über Quellen 17 und 25); das Viagogo-Urteil HG170194 des Handelsgerichts Zürich; die FMH-Standesordnung mit Anhang 2; die Botschaft zum UWG; DSG Art. 19 (Informationspflicht; am 02.11.2026 nachgelesen, Teil 6.1); kantonales Gesundheitsrecht zu Heiltätigkeit und Praxiswerbung; die Website faire-werbung.ch selbst (antwortet direkten Abrufen mit 403; die PDF-Dateien waren erreichbar); bger.ch direkt (Zertifikatsfehler; gelesen über einen Abrufdienst).
