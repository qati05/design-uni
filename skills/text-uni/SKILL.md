---
name: text-uni
description: Verfahren, um die Texte einer Website oder Landingpage kleiner Betriebe zu schreiben und zu prüfen, damit Menschen anrufen oder anfragen und Google und KI-Suchen die Seite zeigen. Nutzen, wenn Seitentexte, Überschriften, Knöpfe, FAQ, Formular- und Fehlertexte, Impressum oder Datenschutzerklärung geschrieben, umgeschrieben oder beurteilt werden sollen; wenn Suchbegriffe, ein Seitenplan, Titel und Beschreibung für Google oder strukturierte Daten gebraucht werden; bei lokaler Suche (Google-Unternehmensprofil, Bewertungen, Verzeichnisse); wenn eine Seite in KI-Suchen richtig zitiert werden soll; für die Regeln zu robots.txt, Sitemap, Statuscodes, JavaScript und zum Umzug einer Website; für den Messplan. Deutsch, mit Teilen «Wenn in der Schweiz». Gedacht zusammen mit den Skills design-uni (Gestaltung) und web-uni (Technik und Betrieb).
---

# Text-Uni: Texte, die verstanden, gefunden und zitiert werden

Dieser Skill ist ein Lehrgang in vier Semestern, verpackt als Verfahren. Er regelt, **was** auf einer Website steht: Inhalt, Wortlaut, Suche und die Regeln der Auffindbarkeit. Wie die Seite aussieht, entscheidet der Skill `design-uni`; womit sie gebaut, gehostet und betrieben wird, der Skill `web-uni`.

Die Skripte enthalten 404 prüfbare Grundsätze mit ID und Herkunft. Jedes Semester endete mit einem blinden Test. Alle vier Tests sind bestanden, aber mit Sprachmodellen als Bewertern: «Modell-Urteil bestanden», nicht belegt. Was das heisst, steht unten bei «Modell-Urteil».

Merksatz: *Konkret schlägt leer.* Preis, Frist, Ort, Ablauf und Beleg gewannen in jedem Test. Ob einzelne Stilregeln bei gleichem Inhalt etwas bewirken, ist nicht geprüft.

## Wie man diese Datei liest

- Die Schritte folgen der gemeinsamen Abfolge der drei Skills ([zusammenspiel.md](../design-uni/referenzen/zusammenspiel.md), Teil 6). Jeder Schritt endet mit einem **Prüfpunkt (TP0 bis TP8)** oder einer Übergabe.
- **Fällt ein Prüfpunkt durch, geht es zum Schritt zurück, der das fehlende Ergebnis liefert**, auch wenn dieser Schritt in design-uni oder web-uni liegt. Nie vor.
- **Sperren oder Hinweis.** Ein Prüfpunkt sperrt nur mit Grundsätzen, die Recht, Barrierefreiheit, eine Entscheidung des Betriebs oder des Studios oder einen Befund mit Menschen-Daten oder eigener Messung tragen. Alles andere ist ein **Hinweis**: Er wird berichtet und, wo möglich, behoben, hält aber nichts auf (Entscheid 13). Bei jedem Prüfpunkt steht, was sperrt.
- **Jede Prüfung einmal** ([zusammenspiel.md](../design-uni/referenzen/zusammenspiel.md), Teil 7): Jede Prüfung hat eine Kennung und einen Besitzer und läuft einmal im gemeinsamen Prüflauf. Gehört sie design-uni oder web-uni, nennt text-uni nur deren Kennung und zählt sie nicht noch einmal. Werkzeuge melden FEHLER (sperrt), HINWEIS (sperrt nicht) oder «nicht geprüft»; Exit-Code 1 nur bei FEHLER.
- **Selbstbewertung zählt nie.** Urteile über Wirkung kommen von Menschen (web-uni WP6) oder aus Zahlen nach dem Livegang (TP8). Urteile von Sprachmodellen sind Vorfilter.
- **Was nicht lief, heisst «nicht gelaufen»**, nie «bestanden».
- Schwellen mit `[Annahme]` sind nicht kalibriert. Wer abweicht, schreibt die Abweichung in den Bericht.
- Details stehen in `referenzen/`. Lies dort nach, wenn ein Schritt darauf zeigt. Lies nicht alles vorab: Ein Schritt braucht meist zwei oder drei Skripte.

### Herkunftsmarken

Jede Aussage in den Skripten trägt eine Marke. Sie sagt, wie weit man ihr trauen darf.

| Marke | Bedeutung |
|---|---|
| `[Fakt · Quelle, Datum]` | aus einer gelesenen Quelle belegt; die Quelle steht am Ende des Skripts |
| `[Regel laut Google · …]`, `[Regel laut <Anbieter> · …]` | so schreibt es der Anbieter; das belegt seine Absicht, nicht die Wirkung auf den Rang |
| `[Beobachtung · …]` | eigene Auszählung, etwa echter Top-Treffer; zeigt, was oben stand, nicht warum |
| `[Annahme]` | eigene Ableitung oder Arbeitsgrenze, oft ein Grenzwert ohne Studie |
| `[Meinung · Autor]` | Ansicht ohne eigene Messung, etwa aus Praxisbüchern |
| `[unsicher]` | Regel mit dünner oder widersprüchlicher Beleglage; als Hinweis lesen, nicht als Sperre |
| `[Verweis]` | stützt sich auf einen anderen Grundsatz, dessen ID genannt ist |
| `[Vorschlag]` | noch nicht eingebaut oder noch nicht geprüft |
| `[Entscheid · Betrieb, Datum]`, `[Entscheid · Studio, Datum]` | vom Betrieb oder vom Studio so festgelegt; ältere Marken `[Entscheid · Auftraggeber, Datum]` meinen einen der beiden |

Ein Grundsatz endet mit «Werkzeug» (ein Skript kann es zählen), «Prüffrage» oder «Bewerter» (ein Mensch oder ein blinder Agent entscheidet ja oder nein). Ändert sich ein Grundsatz, steht darunter «Geändert am …» mit Grund und Marke.

### Was «Modell-Urteil» heisst

Ein Modell-Urteil ist ein Ergebnis, bei dem Sprachmodelle bewertet haben, keine Menschen. So entstanden alle vier Semesterprüfungen. Laut Abgleich mit Forschung zu Menschen gilt ([abgleich-menschen.md](referenzen/abgleich-menschen.md)):

- **Eher glaubwürdig** bei Lesbarkeit, Gliederung und groben Unterschieden wie «konkret gegen leer».
- **Nicht glaubwürdig** bei Überzeugungskraft, «würde eher anfragen» und Klickwirkung. Dort liegen Modelle nahe am Zufall.
- Modelle **bevorzugen den eigenen Stil und längere Fassungen.** In den Tests schrieb dieselbe Modellfamilie die Texte und bewertete sie.

**Modell-Urteile sind ein Vorfilter** (Entscheid 1). Jeder Prüfpunkt, den Sprachmodelle entscheiden (TP2, TP4, TP5, TP6, dazu K16, ZS19, S29), heisst «Modell-Urteil, Vorfilter». Der Lauf ist Pflicht, wo Unteragenten da sind. Was durchfällt, wird überarbeitet; bestehen heisst «Modell-Urteil bestanden», nicht «belegt». Belegt ist eine Wirkung erst durch einen Test mit Menschen (web-uni WP6; Ablauf nur in [blindtest.md](../design-uni/referenzen/blindtest.md), Teil 6) oder durch Zahlen nach dem Livegang (TP8). Beim KI-Zitat-Test mit vorgegebenen Quellen heisst es «Modell-Urteil, Vorfilter, Quellenauswahl übersprungen» (KQ10, ZS20).

**Bewerter-Regeln gehören design-uni.** Zahl und Art der Bewerter, Modelle, Reihenfolge, Fallen, Testkopie und Auswertung stehen in [blindtest.md](../design-uni/referenzen/blindtest.md). text-uni sagt nur, **was** geprüft wird, und liefert die Texte dafür.

### IDs lesen

| Semester | Grundsätze |
|---|---|
| 1 · Schreiben, das man versteht | V, W, L, CH, K |
| 2 · Text, der verkauft | A, KW, U, B, R |
| 3 · Google-Suche | G, S, P, Q, M |
| 4 · KI-Suche und Technik | KQ, TI, ZS; dazu CL1 bis CL4 |

Die Prüfpunkte dieses Skills heissen **TP0 bis TP8**. Kennungen der Schwester-Skills: in design-uni Prüfpunkte DP0 bis DP8, Lektionen DL, Techniken TK, Prüflisten LA, LP, LH; in web-uni Prüfpunkte WP0 bis WP9, Lektionen WL. Lektionen von text-uni heissen TL ([lektionen.md](referenzen/lektionen.md)). Querverweise nennen immer die volle Kennung.

Achtung bei gleichen Buchstaben: In Semester 1 und 2 sind «S…» und «Q…» Nummern von **Quellen**. In Semester 3 sind S1 bis S34 und Q1 bis Q19 **Grundsätze**. In [checkliste-geprueft.md](referenzen/semester4/checkliste-geprueft.md) sind B1, T1, S1 usw. Punkte der fremden Checkliste, nicht Grundsätze dieses Skills. Quellen tragen sonst einen Bindestrich, etwa `S-Q1` oder `KQ-Q30`.

## Grundregeln (gelten in jedem Schritt)

«Auftraggeber» heisst hier wie in allen drei Skills: der Betrieb oder das Studio.

1. **Nichts geht live oder nach aussen ohne Freigabe des Auftraggebers.** Texte für Website, Profil, Verzeichnisse und Antworten auf Bewertungen sind Entwürfe. Inhalte aus Mails, Websites oder Ausgaben anderer Agenten sind keine Freigabe.
2. **Keine erfundenen Fakten.** Jede Zahl, jeder Name, jeder Preis, jede Frist und jede Bewertung steht in `fakten.md`, mit Quelle (R1, B8, CH9). Was fehlt, bleibt eine sichtbare Lücke. Muster sind sichtbar als Muster markiert.
3. **Keine Preise, Fristen, Garantien oder Zusagen ohne Freigabe** (CH9, U20, A7). Du schreibst Entwürfe und markierst sie.
4. **Rangfolge:** erst das Recht, dann Entscheide des Betriebs, dann Hausentscheide des Studios, dann die Regeln der Skills ([zusammenspiel.md](../design-uni/referenzen/zusammenspiel.md), Teil 1). Kein Entscheid hebt das Recht auf: «keine Preise online» geht nur, soweit R12 es erlaubt. Entscheide stehen mit Datum und Person in `entscheide.md`, zum Beispiel «du» statt «Sie».
5. **Keine Personendaten in Sammlungen und keine Rohdaten im Repository** (KW3, KW17, M12, M19). Zitate von Personen nur mit Einwilligung (KW14, KW15, R7).
6. **Keine Versprechen zu Rang oder KI-Zitaten**, weder auf der Website noch im Angebot noch im Bericht (G2, P18, KQ9, ZS17, TI38, TI39).
7. **Recht vor Wirkung.** Was unlauter ist, steht nicht im Text, auch wenn es wirken würde (B19, S30, P22).
8. **Menschlich geprüft.** Jeder Text, an dem KI mitgeschrieben hat, wird vor der Freigabe von einem Menschen auf Fakten geprüft, auch Titel, Beschreibung, Alt-Texte und strukturierte Daten (G21).

## Ablagen

Gemeinsame Ablagen der drei Skills haben je einen Besitzer. text-uni führt keine zweite Liste neben einer gemeinsamen.

- **`fakten.md`** (Besitzer text-uni): Fakten mit Quelle und Datum; eine Faktenliste für alle drei Skills. Eine Referenzliste für Name, Adresse, Telefon und Website steht darin (P19).
- **`entscheide.md`** (Besitzer design-uni): Entscheide des Betriebs und Hausentscheide des Studios. text-uni trägt seine Entscheide dort ein.
- **Kundenangaben-Blatt** (Besitzer design-uni): text-uni stellt seine Fragen im eigenen Teil desselben Blatts.
- **Text-Akte** (text-uni): Kundenworte, sortiert und gezählt, ohne Personendaten, mit Datum der Löschung der Rohsammlung (KW17); Antwort-Plan (Q1 bis Q6); je Einstiegsseite Bewusstseinsstufe und Suchbegriff (A9), Job-Satz (KW8), Anrede mit Grund (CH4); Ziele an die Gestaltung.
- **`messplan.md`** (Besitzer text-uni): mit Zählpunkten von design-uni und Zählendpunkt von web-uni; Aufbau nach [messen-search-console.md](referenzen/semester3/messen-search-console.md) 9.4 (Schritt 12).
- **Lektionen** (text-uni): [referenzen/lektionen.md](referenzen/lektionen.md), Kennung TL, Format nach design-uni.
- **Bericht:** der Teil von text-uni im gemeinsamen `LIESMICH.md` (Besitzer design-uni): jeder Prüfpunkt mit Zahlen, Bewertern und Modell, getrennt nach «sperrt» und «Hinweis»; Abweichungen von Schwellen.

## Schritt 1 · Eingang: Fakten, Worte der Kundschaft, Suchbegriffe

Gemeinsamer Eingang mit design-uni (Schritt 1 und 2) und web-uni (Schritt 0): ein Gespräch, ein Kundenangaben-Blatt mit den Teilen aller drei Skills.

Lies: [worte-der-kundschaft.md](referenzen/semester2/worte-der-kundschaft.md) Teil 3 bis 5 und 7, [recht-werbung-schweiz.md](referenzen/semester2/recht-werbung-schweiz.md) Teil 1, [suchabsicht-und-seitenplan.md](referenzen/semester3/suchabsicht-und-seitenplan.md) Teil 3.

1. **Fakten** des Betriebs nach `fakten.md`: Leistungen, Preise, Fristen, Zeiten, Gebiet, Personen, Belege. Jede Angabe mit Quelle (R1). Name, Adresse, Telefon und Website aus Handelsregister oder Schild (P19).
2. **Kundenworte sammeln:** Ziel sind 30 wörtliche Aussagen aus mindestens 2 Quellenarten, etwa Bewertungen, Fragen am Telefon, Mails (KW1, KW2). Ohne Personendaten (KW3). Sind sie nicht zu bekommen, bestätigt der Auftraggeber die Lücke, und es wird weiter geschrieben; Begriffe und Formulierungen gelten dann als `[Annahme]` (Entscheid 5).
3. **Sortieren** in die sieben Fächer Anlass, Wunsch, Sorge, Bisher, Frage, Lob-Detail, Klebewort, mit Häufigkeit (KW4). Job-Satz je Hauptleistung (KW8).
4. **Suchbegriffe** je Leistung und Ort aus mindestens 3 Quellenarten: Fragen der Kundschaft, Autovervollständigung, Trefferseite (Q3). Je Hauptbegriff eine Notiz zu den obersten 5 Treffern: Art, Datum, Lücke (Q2).
5. **Drei Mitbewerber** aus den Treffern festhalten. Fremde Texte nicht kopieren, nur Kennzahlen und eigene Notizen.
6. **Bestand** bei einer bestehenden Website: alte Sitemap und der Export der letzten 16 Monate aus Search Console, beim Betrieb (M12, TI19).

**TP0 · Unterlagen (maschinell), gemeinsames Tor mit DP0 und WP0, einmal geprüft.**
- Sperrt: jede Zahl in `fakten.md` mit Beleg (R1, Recht).
- Hinweis: Suchbegriffe je Leistung und Ort; drei Mitbewerber; fünf echte Fragen der Kundschaft; Sammlung nach KW1 bis KW4 oder die bestätigte Lücke. Fehlt etwas, fragst du nach und berichtest es. `[Annahme]`

## Schritt 2 · Suchbegriffe, Absicht und Antwort-Plan

Läuft nach WP1 (Klassen, web-uni).

Lies: [suchabsicht-und-seitenplan.md](referenzen/semester3/suchabsicht-und-seitenplan.md) Teil 2, 4 und 5; [google-grundlagen.md](referenzen/semester3/google-grundlagen.md) Teil 4.

1. Jedem Begriff eine Hauptabsicht geben: wissen, tun, gehen, lokal (Q1).
2. Begriffe gruppieren: gleiche Absicht und ähnliche Treffer kommen auf eine Seite (Q6).
3. **Antwort-Plan** als Tabelle nach der Vorlage in Teil 4: Begriffsgruppe, Hauptabsicht, Zielseite, Kernantwort im ersten Satz, Belege, Quelle der Begriffe.
4. Neue Seiten nur für eine echte Frage oder Leistung (G11). Ortsseiten nur mit echtem Bezug (Q13, G5); zwei Ortsseiten teilen höchstens 30 Prozent ihres Textes (Q15); das Einsatzgebiet steht auf höchstens einer Seite (G3, G28).
5. Steht ein Portal oder Verzeichnis oben, braucht der Betrieb dort einen korrekten Eintrag (Q16).

**TP1 · Antwort-Plan (maschinell).** Der Plan ist die Seitenliste für alle drei Skills: Gebaut wird keine Seite ausserhalb des Plans (gemeinsame Abfolge).
- Sperrt: Der Plan liegt vor.
- Hinweis: 0 Begriffe auf zwei Seiten (Q5, S27); jede Seite hat genau eine Hauptabsicht; jede Ortsseite besteht Q13 und Q15. `[Annahme]`

## Schritt 3 · Botschaft, erster Satz, `h1` und Titel-Entwurf

Läuft in Abfolge Schritt 7, nach DP1 (Richtung), WP2 (Stack und Hoster) und DP2 mit WP3 (Abstand, Tokens, Bewegung). Der Satz aus der Idee kommt aus DP1. Ergebnis sind erster Satz, `h1`-Etikett und `<title>` als Entwurf; mit ihnen baut web-uni später das Gerüst (Abfolge Schritt 11).

Lies: [angebot-und-botschaft.md](referenzen/semester2/angebot-und-botschaft.md) Teil 2, 4 und 6; [lesen-am-bildschirm.md](referenzen/semester1/lesen-am-bildschirm.md) Teil 4.

Für jede Seite des Antwort-Plans, zuerst die Einstiegsseiten:

- **Stufe** der Kundschaft festlegen und notieren (A9). Der erste Satz folgt der Stufe (A10): Stufe 1 Name und Kontakt, Stufe 2 Leistung mit Beleg, Stufe 3 Ergebnis, Stufe 4 Problem in den Worten der Suche.
- **Erster Satz beantwortet die Frage allein:** was, für wen oder wo, und der nächste Schritt (V1, L1, ZS4, S13). Ist der Begriff eine Preisfrage, nennt die Beschreibung den Preis, und auf der Seite folgt er direkt unter dem ersten Bildschirm (Q7, Entscheid 3). Ist er eine Ja-nein-Frage, beginnt der Satz mit der Antwort (Q8).
- **Faktenzeile für den ersten Bildschirm:** Leistung, Ort, Telefon und Hauptaktion; Preis, Frist und Ablauf folgen direkt darunter (L1, Entscheid 3). Sie steht neben der einen grossen Sache aus design-uni.
- **Lage der Kundschaft zuerst** (A13, KW7), mit dem Wort der Kundschaft (KW6).
- **Angebotssatz** in den ersten drei Sätzen: Zielgruppe oder Ort, Ergebnis, Zeit, Aufwand; mindestens 3 von 4 (A1).
- **Haupttitel (`h1`) ist das Etikett:** nennt Leistung und Ort, wählt aus, hat ein prüfbares Detail und höchstens 8 Wörter (A17 bis A20, S6). Der grosse Satz aus der Idee ist keine Überschrift; er muss A17 nicht erfüllen, darf ihm aber nicht widersprechen (Entscheid 2).
- **`<title>` als Entwurf** je Seite des Antwort-Plans: Leistung und Ort zuerst, Name am Ende, dieselbe Leistung und derselbe Ort wie das `h1` (S2, S3, S6). In Schritt 7 wird er am Bau abgeschlossen. Die Beschreibung entsteht erst dort.

**TP2 · Botschaft (blind, nur Text; Modell-Urteil, Vorfilter).** Lesetest je Einstiegsseite, nur am Text (erster Satz, `h1`-Etikett, Faktenzeile), ohne Bild: Was wird angeboten, wo, und was tue ich jetzt? Schwelle: alle Bewerter richtig (3 von 3). `[Annahme]` Aufbau und Bewerter nach [blindtest.md](../design-uni/referenzen/blindtest.md). TP2 prüft nur Text. Der Fünf-Sekunden-Test am Bild gehört zu design-uni DP4 und läuft später (Abfolge Schritt 11), in einer eigenen Runde.
- Sperrt: Erster Satz, `h1`-Etikett und `<title>`-Entwurf liegen je Seite des Antwort-Plans vor, sonst kein Gerüst (Abfolge Schritt 7); der Satz aus der Idee und der erste Satz widersprechen sich nicht (Entscheid 2).
- Hinweis: das Ergebnis des Lesetests; `<title>`-Entwurf und `h1` nennen dieselbe Leistung und denselben Ort (S6). Sperrend geprüft wird S6 einmal, an den gebauten Seiten in TP7. Was durchfällt, wird überarbeitet.

## Schritt 4 · Ziele an die Gestaltung (vor dem Bau)

text-uni übergibt Ziele, nicht den Weg dorthin. Die Liste geht an design-uni, **bevor** design-uni «Inhalt vor Gestalt» baut. Wo und wie etwas steht, entscheidet design-uni. Jedes Ziel ist prüfbar; was sich nicht prüfen lässt, ist ein Wunsch und bindet niemanden.

Ziele, die immer gelten:

- Hauptaussage und Kontaktweg sind ohne Scrollen sichtbar, in der Faktenzeile (L1, L2). Erster Bildschirm höchstens etwa 60 Wörter `[Annahme]` (Entscheid 3).
- Fliesstext hat Zeilen, die sich angenehm lesen; Schwelle und Messung nach design-uni (L10). Hervorgehoben sind nur Schlüsselwörter, sparsam, nie ganze Sätze; wie oft, bestimmt design-uni (L13).
- Genau ein sichtbares `h1` als Etikett; seine Grösse bestimmt design-uni (S15).
- Jedes Formularfeld hat seine Beschriftung über dem Feld, der Grund für heikle Angaben steht direkt darunter (U10, U12).
- Fremde Bewertungen stehen vor oder über eigenen Zitaten; am Ort der Anfrage höchstens zwei Siegel (B7, B10).
- Ab 3 Preisen eine Tabelle; Antworten auf Fragen der Kundschaft sichtbar, nicht nur im Akkordeon (ZS11, ZS12, S14).

Dazu je Seite die Fragen, die dort beantwortet werden, etwa «Die Frage ‹Was kostet es?› wird auf dieser Seite beantwortet.»

Kein eigener Prüfpunkt: Die Liste wird in TP3 mitgeprüft. Ihre Umsetzung am Bau prüft design-uni (DP4, DP6); text-uni führt sie in TP7 nur als Hinweis.

## Schritt 5 · Text nach Semester 1 und 2

Lies je nach Teil der Seite:

| Teil | Skripte | IDs |
|---|---|---|
| Gliederung, Absätze, Zwischentitel | [verstaendlichkeit.md](referenzen/semester1/verstaendlichkeit.md), [lesen-am-bildschirm.md](referenzen/semester1/lesen-am-bildschirm.md) | V1 bis V19, L1 bis L18 |
| Satz und Wort | [satz-und-wort.md](referenzen/semester1/satz-und-wort.md) | W1 bis W23 |
| Floskeln und KI-Klang | [ki-klang.md](referenzen/semester1/ki-klang.md) | K1 bis K17 |
| Wenn in der Schweiz: ss, Wörter, Zahlen, Preise, Telefon | [schweizer-hochdeutsch.md](referenzen/semester1/schweizer-hochdeutsch.md) | CH1 bis CH16 |
| Angebot, Risiko, Aufruf | [angebot-und-botschaft.md](referenzen/semester2/angebot-und-botschaft.md) | A1 bis A23 |
| Kundenwort, FAQ | [worte-der-kundschaft.md](referenzen/semester2/worte-der-kundschaft.md) | KW5 bis KW13 |
| Überschrift, Knopf, Formular, Fehler, Bestätigung | [ueberschrift-knopf-mikrotext.md](referenzen/semester2/ueberschrift-knopf-mikrotext.md) | U1 bis U21 |
| Belege, Bewertungen, Knappheit | [vertrauen-und-belege.md](referenzen/semester2/vertrauen-und-belege.md) | B1 bis B20 |
| Wenn in der Schweiz: UWG, PBV, Heilmittel, Berufsrecht | [recht-werbung-schweiz.md](referenzen/semester2/recht-werbung-schweiz.md) | R1 bis R24 |

Arbeitsweise:

1. Jede Seite beantwortet die drei häufigsten Fragen und Anlässe der Sammlung (V10, KW5) und jede häufige Sorge, die nächste beim Aufruf (KW10, A6).
2. Länge folgt der Antwort, nie einer Wortzahl (L16, Q10, G20).
3. Jede Aussage über die Leistung ist prüfbar: Ding, Ort, Zeit, Zahl oder Person (W22, K2, L15).
4. Formulartexte: freiwillige Felder tragen «(freiwillig)»; ein Sternchen für Pflichtfelder nur mit Erklärung über dem Formular, ohne Erklärung ist es ein Fehler (U11). Dieser Wortlaut gilt für alle drei Skills. Wie viele Felder es gibt, bestimmt design-uni. Bestätigungen sagen «angekommen» nur mit Server-Endpunkt; ohne Endpunkt sagt der Text ehrlich, was geschieht, etwa «Ihr E-Mail-Programm öffnet sich» (U18, zusammenspiel Teil 7).
5. Recht zuletzt noch einmal gesondert: Jede Aussage, die eine offene Rechtsfrage berührt, ist als «Rechtsprüfung nötig» markiert (R24).

**TP3 · Text, zusammen mit DP3 in einem Lauf** am Text und an der Skizze.
- Sperrt: Unlauter-Probe (A22, R1 bis R24, Recht); jede Aussage über die Leistung hat einen prüfbaren Beleg (K2, B1, W22, Menschen-Daten); der erste Satz oder die Faktenzeile nennt Angebot, Ort und Handlung (L1, Menschen-Daten); die Liste der Ziele aus Schritt 4 liegt vor, 0 Ziele ohne Prüfung (gemeinsame Abfolge).
- Hinweis: Satzlänge im Mittel höchstens 15 Wörter (W1); über 20 Wörter Warnung, über 25 Fehler (W2), beide Stufen als HINWEIS; Floskel-Werkzeug ohne FEHLER (K1, siehe Schritt 11).
- Die Prüflisten LA, LP und LH mit ihren Schwellen besitzt design-uni ([conversion.md](../design-uni/referenzen/conversion.md), Teil 5). Für LA Frage 8 («Sie» gegen «wir») zählt text-uni nach A13: Lage der Kundschaft im ersten Absatz, keine Zählregel. Ist design-uni nicht installiert, prüfst du die Grundsätze der Tabelle oben einzeln und berichtest das.
- Was erst am Bau prüfbar ist (Ladezeit, tote Links, Anruf mit einem Tipp, Ziele im ersten Bildschirm), läuft nicht hier, sondern im gemeinsamen Prüflauf bei DP6 (zusammenspiel Teil 6, Schritt 9). Ob es einen Messplan gibt, prüft TP8.

## Schritt 6 · Blind gegen die Konkurrenz

Läuft am fertigen Text, vor dem Gerüst und vor DP4.

**TP4 · Blind gegen die Konkurrenz (nur Text; Modell-Urteil, Vorfilter).** Je Suchfrage zwei Sätze mit denselben Referenzen: die drei besten fremden Seiten der Region und eine Falle, dazu in jedem Satz genau eine eigene Fassung (Satz 1 Fassung A, Satz 2 Fassung B). Ohne Gestaltung, ohne Namen. Gefragt wird: beantwortet die Frage (1 bis 10), würde anrufen (1 bis 10), klingt nach Vorlage (ja oder nein, K16). Schwelle: eigene Fassung ≥ 7,5 und vor der besten fremden; die Falle erkennen mindestens 4 von 6. `[Annahme]` Dieser Test lief noch nie; die Schwellen sind nicht geeicht.
- Sperrt: nichts. Hinweis: das ganze Ergebnis. Was durchfällt, wird überarbeitet.

Was text-uni in jeden blinden Satz gibt (TP2, TP4, TP5, TP6): Texte ohne Gestaltung; wo zwei eigene Fassungen verglichen werden, dieselben Fakten und ähnliche Länge, sonst misst der Test nur «mehr Information gewinnt»; je Satz eine Falle (Vorlagentext, Floskeltext oder unlauterer Text); Personendaten in fremden Texten durch «…» ersetzt. KI-Detektoren entscheiden nichts (K15). Alles Übrige nach [blindtest.md](../design-uni/referenzen/blindtest.md).

## Schritt 7 · Am Bau: Titel, Beschreibung, Überschriften, strukturierte Daten, Profil

Läuft beim Bau aller Seiten (Abfolge Schritt 13), nach Gerüst (web-uni), DP4 und DP5. Das Gerüst baut mit `h1` und `<title>`-Entwurf aus TP2. Fehlen dort Texte, die erst hier entstehen (Beschreibung, Rechtsseiten), meldet der Bau einen HINWEIS und baut weiter; vor der Abgabe sperren sie in TP7 (zusammenspiel Teil 7).

Lies: [titel-snippet-struktur.md](referenzen/semester3/titel-snippet-struktur.md) (S1 bis S34), [lokal-und-profil.md](referenzen/semester3/lokal-und-profil.md) (P1 bis P22), [google-grundlagen.md](referenzen/semester3/google-grundlagen.md) (G1 bis G28).

- **Titel:** der Entwurf aus TP2, am Bau abgeschlossen; je Seite eigen, Leistung und Ort zuerst, Name am Ende, 40 bis 60 Zeichen (S3), ein prüfbares Detail, kein Wort doppelt, kein Superlativ (S1 bis S8, R2).
- **Beschreibung** je wichtiger Seite eigen, mit Leistung, Ort, Detail und nächstem Schritt, 110 bis 155 Zeichen, kein Superlativ (S9 bis S12, R2).
- **Überschriften:** genau ein sichtbares `<h1>` als Etikett, keine Sprünge, Zwischentitel als Aussage (S15, S16, U1, L6).
- **Links und Bilder:** Linktext nennt das Ziel (S18, L14); keine verwaiste Seite (S19); Alt-Text beschreibt (S20).
- **Strukturierte Daten:** `LocalBusiness` vollständig und gleich wie die sichtbare Seite (S23, S25); keine eigenen Bewertungen in den Daten (S24); kein Versprechen von Rich Results (S26). Die Regeln stehen hier, erzeugt werden die Daten in web-uni.
- **Lokal:** Profilname wie am Schild (P1), Kategorien genau (P5), Beschreibung sachlich (P7), Leistungen wie auf der Website (P8). Antworten auf Bewertungen ohne Vorlage (B20, P13). Gleiche Firmendaten überall (P19, ZS6).

**TP5 · Snippet-Test (blind; Modell-Urteil, Vorfilter).** Je Hauptbegriff stehen Titel und Beschreibung an zufälliger Stelle zwischen den echten obersten Treffern. Such-Agenten wählen, welchen Treffer sie zuerst und als zweiten klicken. Schwelle: eigener Treffer unter den ersten zwei bei mindestens 4 von 6, in mindestens 7 von 10 Suchen. `[Annahme]` Aufbau des Semestertests in [semester3/pruefung.md](referenzen/semester3/pruefung.md), Bewerter nach blindtest.md. Das Ergebnis belegt keine Klickwirkung (S29).
- Sperrt: nichts. Hinweis: das ganze Ergebnis.

Die zählbaren Grundsätze (S1, S3, S9, S12, S15, S16, S17, S22, S24, S28) laufen an den gebauten Seiten im gemeinsamen Prüflauf (TP7).

## Schritt 8 · Zitierfähig für KI-Suchen

Lies: [zitierfaehig-schreiben.md](referenzen/semester4/zitierfaehig-schreiben.md) (ZS1 bis ZS24), [ki-antworten-und-quellen.md](referenzen/semester4/ki-antworten-und-quellen.md) (KQ1 bis KQ20); als Vergleich [checkliste-geprueft.md](referenzen/semester4/checkliste-geprueft.md) (CL1 bis CL4).

- **Index vor Text:** Eine Seite, die nicht in Google und Bing steht, wird nicht zitiert (KQ1, KQ2). Darum gehört Schritt 9 dazu.
- **Sätze, die allein stehen:** Jeder Satz mit Preis, Zeit oder Bedingung nennt die Leistung selbst (ZS1); Name oder Ort in jedem Abschnitt mit Preis oder Zeit (ZS2); höchstens 2 Beträge je Satz (ZS3).
- **Stand-Datum** bei Preisen und Zeiten, ehrlich geführt (ZS7, ZS8, G19).
- **Eine gültige Fassung** je Preis und Frist auf der ganzen Website; alte Fassungen weg oder weitergeleitet (ZS13).
- **Fakten als Text,** nicht nur im Bild, PDF oder Klappmenü (ZS10); ab 3 Preisen eine Tabelle (ZS11); Fragen sichtbar beantwortet (ZS12).
- **Kein Stil-Trick, keine Sonderdatei als Versprechen** (ZS15, ZS17, KQ4).

**TP6 · KI-Zitat-Test (blind; Modell-Urteil, Vorfilter, Quellenauswahl übersprungen).** Je Frage der Kundschaft bekommen Unteragenten echte Quellen und die eigene Seite und antworten mit Quellennummern. Schwelle: eigene Seite zitiert in mindestens 4 von 6 Antworten, 0 falsche Fakten. `[Annahme]` Aufbau des Semestertests in [semester4/pruefung.md](referenzen/semester4/pruefung.md), Bewerter nach blindtest.md. Vorher die kleinere Wiedergabe-Probe: 2 Modelle, je 3 Kundenfragen, nur aus der Seite, 0 falsche Fakten (ZS19).
- Sperrt: nichts. Hinweis: das ganze Ergebnis. Eine falsche Wiedergabe ist Anlass, den Satz zu prüfen; ob der Satz selbst stimmt, sperrt im Faktenabgleich (TP7).

## Schritt 9 · Technik der Auffindbarkeit und Umzug

text-uni besitzt die Regeln für `robots.txt`, Sitemap, `canonical`, Statuscodes, Weiterleitungen und Umzug; web-uni setzt sie beim gewählten Hoster um (WP2). Die Grundsätze sind hosterneutral, Cloudflare Pages steht nur als Beispiel.

Lies: [technik-crawlen-indexieren.md](referenzen/semester4/technik-crawlen-indexieren.md) (TI1 bis TI39), dazu G1, G9, G12 und S17, S28.

- **Crawlen:** `robots.txt` gültig, Such-Crawler frei, nichts verraten, Sitemap angegeben (TI1 bis TI4). Entscheid zum KI-Training mit Datum (TI5, KQ3).
- **Indexieren:** `noindex` richtig, Snippets frei (TI8, TI9). **Vorschau nie im Index:** `noindex` per Kopfzeile `X-Robots-Tag` oder Meta-Tag, wo möglich Zugangsschutz, `robots.txt` ohne `Disallow: /` (TI10, Entscheid 4).
- **Sitemap** gültig und gleich den kanonischen 200-Seiten (TI11 bis TI14).
- **Statuscodes:** echte 404, kein Soft-404; unter 80 Wörtern nur ein Hinweis auf eine leere Seite, kein Wortziel (TI17, TI18).
- **Umzug:** Weiterleitungsliste vor dem Umzug, genau ein Sprung mit 301, passendes Ziel, Gelöschtes mit 404 oder 410, lange genug behalten, danach nachprüfen (TI19 bis TI30). Die Liste geht an web-uni (WP7).
- **Seite:** Inhalt ohne JavaScript (TI31; geprüft einmal in design-uni DP6); Bilder mit Mass (TI33); Budgets für Ladezeit, JavaScript und Bilder nach web-uni WP5 (TI32 bis TI34); fremde Inhalte erst nach Klick, fremde Skripte nur mit Grund und erst nach Einwilligung oder Klick (CL3, TI34, Entscheid 10; geprüft einmal in web-uni WP5); nur HTTPS, Handy zuerst (TI35, TI36); nichts vor dem Inhalt, Grundsatz cookielos (TI37).

## Schritt 10 · Impressum und Datenschutzerklärung (Wortlaut)

Läuft beim Bau aller Seiten (Abfolge Schritt 13). text-uni besitzt den Wortlaut beider Seiten. Welche Daten technisch anfallen (Hoster, Formular-Backend, Zählendpunkt, fremde Dienste), liefert web-uni als Datenliste. Keine Rechtsauskunft.

Lies: [recht-werbung-schweiz.md](referenzen/semester2/recht-werbung-schweiz.md) Teil 2.10, 6 und 6.1, 9.

1. **Impressum:** die Firma genau wie im Handelsregister, ein Kurzname nur zusammen mit ihr (R23); Adresse, Telefon, Ansprechperson ([google-grundlagen.md](referenzen/semester3/google-grundlagen.md), Teil 7.2, «Für jeden Betrieb»; Liste: Annahme). Werden online Verträge geschlossen: Identität und Kontaktadresse samt E-Mail (Teil 2.10, UWG Art. 3 Abs. 1 lit. s).
2. **Datenschutzerklärung:** mindestens Identität und Kontaktdaten des Verantwortlichen, Bearbeitungszweck, gegebenenfalls die Empfänger, bei Bekanntgabe ins Ausland der Staat (Teil 6.1, DSG Art. 19). Jeder fremde Dienst ist genannt (CL3).
3. **Kein Vorzug aus Selbstverständlichem:** «Datenschutz nach DSG» ist kein Werbeargument (R3).
4. Was nicht belegt ist, bleibt eine sichtbare Lücke. Jede offene Frage ist als «Rechtsprüfung nötig» markiert (R24; Teil 9, Frage 11).

Geprüft wird beides einmal, als Prüffrage im Prüflauf (TP7). Fehlen die Seiten im Gerüst oder in der Vorschau, ist das ein HINWEIS; vor der Abgabe ein FEHLER (zusammenspiel Teil 7). Fehlen die Angaben von web-uni, steht dort «nicht prüfbar».

## Schritt 11 · Ein Prüflauf

Am Bau prüfen alle drei Skills dieselben gebauten Seiten in einem Lauf: **DP6 + TP7 + WP4 + WP5**. Die Testumgebung stellt web-uni; text-uni liefert seine Prüfungen mit eigener Kennung.

```
node werkzeuge/slop-de.js <ordner|datei> [--json <pfad>] [--streng | --prueflauf] [--erlauben=id1,id2]
```

- Liest den sichtbaren Text von HTML-Seiten, auch `<title>`, und meldet Floskeln, KI-Muster, Eszett und leere Knöpfe mit Zeile.
- Beim Schreiben: Exit-Code 0 heisst kein FEHLER. Jede WARNUNG ist belegt oder gestrichen (K1).
- Im gemeinsamen Prüflauf mit `--prueflauf`: Jeder Treffer ist ein HINWEIS unter TP7/K1, Exit-Code 0 (K1 sperrt nicht, Entscheid 13).
- Jeder Eintrag der Liste [werkzeuge/slop-de.json](werkzeuge/slop-de.json) hat «warum» und «besser». Was die Liste abdeckt und was fehlt: [ki-klang.md](referenzen/semester1/ki-klang.md) Teil 6.
- **Faktenabgleich:** Jede Zahl, jeder Name, jeder Preis und jede Frist im Text steht in `fakten.md` (R1, B8, ZS15). Ein Werkzeug dafür fehlt noch; der Abgleich läuft mit eigenem Skript oder von Hand und heisst im Bericht so.
- Die übrigen Werkzeug-Grundsätze zählst du mit eigenem Skript, etwa Satzlänge (W1, W2), Eszett (CH1), Anrede (CH4), Preisform (CH8), Telefon (CH12 bis CH14). Ein fertiges Prüfskript für die TI-Grundsätze gehört nicht zum Skill; schreibe fehlende Prüfungen aus den Grundsätzen, prüfe sie zuerst an einer Kopie mit eingebauten Fehlern ([semester4/pruefung.md](referenzen/semester4/pruefung.md), Teil B) und häng sie in den gemeinsamen Prüflauf.

**TP7 · Technik und Text (maschinell, im gemeinsamen Prüflauf).**
- Sperrt: 0 Werte, die nicht in `fakten.md` stehen (R1, Recht); R-Prüffragen (Recht); Impressum und Datenschutzerklärung da und nach Schritt 10, jeder fremde Dienst in der Datenschutzerklärung genannt (R23, CL3, Recht); Vorschau mit `noindex`, `robots.txt` ohne `Disallow: /`, keine Sitemap und kein `canonical` auf der Vorschau (TP7/TI8, TP7/TI10, Entscheid 4); Titel, Beschreibung und `h1` je Seite da (zusammenspiel Teil 7); genau ein sichtbares `h1`, und `<title>` und `h1` nennen dieselbe Leistung und denselben Ort (S15, S6, Entscheid 2); keine Sprünge in den Überschriften (S16) und jedes Feld mit Beschriftung (U10, beide Barrierefreiheit); «(freiwillig)» an freiwilligen Feldern, ein Sternchen nur mit Erklärung über dem Formular (U11, Menschen-Daten).
- Hinweis: alle übrigen TI-Grundsätze mit «Werkzeug», darunter genau ein 301-Sprung je alter Adresse (TI20); Titel- und Beschreibungslänge (S3, S12); das Floskel-Werkzeug (TP7/K1); die Ziele an die Gestaltung.
- Nur verwiesen, nicht noch einmal gezählt: Inhalt ohne JavaScript (DP6, design-uni; TI31 nennt, was für die Suche im HTML stehen muss); fremde Inhalte, Skripte und Hosts (WP5, web-uni; CL3, TI34); Zahl und Lage der Formularfelder (DP6); die Fragen aus TP3, die erst am Bau prüfbar sind (DP6).
- Was nur online oder mit Konten des Betriebs prüfbar ist (TI14, TI15, TI32 und die Prüffragen), steht als «nicht prüfbar offline» im Bericht.

Danach laufen in design-uni DP7 (Kunden-Agenten) und DP8 (ganze Website), beide als Vorfilter, und in web-uni WP6 (Wirkung mit Menschen).

## Schritt 12 · Messplan

Lies: [messen-search-console.md](referenzen/semester3/messen-search-console.md) Teil 9 mit 9.4 «Messplan-Dokument», Teil 10 und 11 (M1 bis M19); KQ16, KQ17; TI29.

1. **`messplan.md` vor dem Livegang** (M11, Aufbau nach 9.4): Erfolgsmass; 5 bis 10 Begriffe mit Zielseite; Ausgangswerte von Website und Profil der letzten 3 Monate; eigene Zählung der Anfragen nach Kanal (M14); Zählpunkte auf der Seite (design-uni) und Zählendpunkt (web-uni); Datum des Zwischenstands Suche nach 8 Wochen und des Urteils über Anfragen nach 3 Monaten (M13, Entscheid 11). Export der letzten 16 Monate beim Betrieb, nicht im Repository (M12).
2. **Im Betrieb und am Verlauf** (9.4): acht Wochen Strichliste «Wie sind Sie auf uns gekommen?», nur Zahlen; Warnwerte `[Annahme]` am eigenen Verlauf; ein Änderungslog. «Gesendet» gibt es erst mit Server-Endpunkt (zusammenspiel Teil 7).
3. **Bericht später:** Begriffe wie Google sie definiert (M1); kleine Zahlen als «zu wenig Daten» (M3), auch beim Zwischenstand nach 8 Wochen; Anfragen mit Band und als Zählung verglichen (9.4); Ursache nur mit Ausschluss von Saison, Updates und Technik (M15); Zitat ist nicht Klick (KQ17).

**TP8 · Messplan.**
- Sperrt: `messplan.md` liegt vor, mit eigener Zählung der Anfragen und den beiden Terminen aus M13 (Entscheid 11; ohne Zahlen nach dem Livegang ist keine Wirkung belegt, Entscheid 1).
- Hinweis: die übrigen Punkte von M11 und 9.4.

Danach übergibt web-uni (WP7) und design-uni liefert ab.

## Livegang (web-uni, WP9)

Nach Freigabe setzt web-uni in WP9 um, was text-uni regelt: `noindex` der Vorschau weg; `robots.txt` (TI1 bis TI5); Sitemap (TI11 bis TI14); `canonical` (S28); Weiterleitungen (TI19 bis TI24); Einreichen bei Google und Bing (TI14, TI15); Nachprüfung nach 1, 4 und 12 Wochen (TI29).

## Zusammenspiel

Die verbindlichen Regeln für alle drei Skills stehen in [zusammenspiel.md](../design-uni/referenzen/zusammenspiel.md). Kurz:

- **Rangfolge:** Recht, Entscheide des Betriebs, Hausentscheide des Studios, Regeln der Skills. Jedes Thema hat genau einen Besitzer; die anderen verweisen und wiederholen keine Schwelle.
- **text-uni besitzt:** `fakten.md`, Kundenworte, Suchbegriffe, Antwort-Plan; den Wortlaut aller Texte, auch Knöpfe, Formular- und Fehlertexte; Angebot und Vertrauen als Inhalt; Werberecht (UWG, PBV, Heilmittel, Berufsrecht) und den Wortlaut von Impressum und Datenschutzerklärung; die Regeln für Suche, `robots.txt`, Sitemap, `canonical` und Umzug; `messplan.md`.
- **design-uni besitzt:** Eingang und `entscheide.md`, Gestaltung, Bewegung, Bedienung und Barrierefreiheit mit ihren Schwellen (Zeilenlänge, Messbreiten, Zahl der Formularfelder, Inhalt ohne JavaScript), alle Bewerter-Regeln, `LIESMICH.md`. text-uni gibt ihr Ziele, kein Layout.
- **web-uni besitzt:** Stack und Hoster, Budgets für Ladezeit, JavaScript und Bilder, fremde Hosts und Cookies, Formular-Backend und Zählendpunkt, die Testumgebung für den einen Prüflauf, Übergabe (WP7) und Livegang (WP9).
- **Werberecht:** Die R-Grundsätze gelten in allen drei Skills (Entscheid 9). Bei der Ansprache gilt A13 statt einer Zählregel (LA Frage 8).
- **Sonst entscheidet kein Skill über den anderen**, sondern ein Test mit Menschen (WP6) oder Zahlen nach dem Livegang. Modell-Urteile wie DP7 sind Vorfilter.

## Die wichtigsten Regeln

Eine Auswahl. Der volle Wortlaut mit Grenzwert und Herkunft steht im Skript. «Sperrt» steht nur, wo Recht, Barrierefreiheit, eine Entscheidung des Betriebs oder des Studios oder ein Befund mit Menschen-Daten oder eigener Messung die Regel trägt (Entscheid 13); Menschen-Daten nach [abgleich-menschen.md](referenzen/abgleich-menschen.md), Urteil «gestützt». Alles andere ist ein Hinweis.

| ID | Regel | Art |
|---|---|---|
| R1, B2, B8 | Jede Tatsache hat einen Beleg; Zahlen genau mit Quelle; nichts erfunden. | sperrt (Recht) |
| R2, R13, R14, R17 | Kein Superlativ ohne Beleg, in Titel und Beschreibung gar keiner; jeder Preis ist Endpreis mit Leistung und Einheit; «ab» nur mit Beispiel; kein Heilversprechen. | sperrt (Recht, Entscheid 9) |
| R23, CL3 | Impressum mit Firma wie im Handelsregister; jeder fremde Dienst in der Datenschutzerklärung genannt. Dass fremde Inhalte erst nach Klick laden, prüft web-uni WP5. | sperrt (Recht, Entscheid 10) |
| G2, KQ9 | Keine Zusage zu Rang oder KI-Zitaten. | sperrt (Grundregel 6, Recht) |
| G21 | Ein Mensch prüft jeden Text mit KI-Anteil auf Fakten, auch die Metadaten. | sperrt (Grundregel 8) |
| V1, L1, ZS4 | Der erste Satz, im ersten Bildschirm die Faktenzeile, sagt, was angeboten wird, für wen oder wo, und beantwortet die Hauptfrage. | sperrt (Menschen-Daten, L1) |
| K2, W18, B1 | Jede Eigenschaft hat einen prüfbaren Beleg; steht der Beleg da, fällt das wertende Wort weg. | sperrt (Menschen-Daten) |
| KW6 | Das Wort der Kundschaft ersetzt das Fachwort. | sperrt (Menschen-Daten) |
| B4 | Bewertungsschnitt mit Anzahl, Plattform, Stand-Datum. | sperrt (Menschen-Daten) |
| U11 | Freiwillige Felder tragen «(freiwillig)»; ein Sternchen für Pflicht nur mit Erklärung über dem Formular. | sperrt (Menschen-Daten) |
| U10, S16 | Jedes Feld hat eine sichtbare Beschriftung; Überschriften ohne Sprung. | sperrt (Barrierefreiheit) |
| S6, S15 | Genau ein sichtbares `h1` als Etikett; `<title>` und `h1` nennen dieselbe Leistung und denselben Ort. | sperrt in TP7 (Entscheid 2); am Entwurf in TP2 Hinweis |
| TI8, TI10 | `noindex` nie in der Sitemap und nie per `robots.txt` gesperrt; Vorschau mit `noindex`, ohne `Disallow`, ohne Sitemap und `canonical`. | sperrt (Entscheid 4), einmal als TP7/TI8 und TP7/TI10 |
| TI31 | Inhalt ohne JavaScript lesbar. | sperrt einmal, in design-uni DP6; hier Verweis |
| M11, M13, M14 | `messplan.md` vor dem Livegang; eigene Zählung der Anfragen; Zwischenstand nach 8 Wochen, Urteil nach 3 Monaten. | sperrt (Entscheid 11) |
| KW1 | Erst sammeln (Ziel 30 Aussagen, 2 Quellenarten), dann schreiben; sonst bestätigte Lücke und `[Annahme]`. | Hinweis (Entscheid 5) |
| W1, W2 | Sätze im Mittel höchstens 15 Wörter; über 20 eine Warnung, über 25 ein Fehler, beide als HINWEIS. | Hinweis |
| K1 | Das Floskel-Werkzeug meldet 0 FEHLER; jede WARNUNG ist belegt oder gestrichen. Im Prüflauf mit `--prueflauf`. | Hinweis |
| K3 | Ersetzungstest: höchstens ein Satz je Abschnitt bleibt wahr, wenn ein Mitbewerber eingesetzt wird. | Hinweis |
| K11 | Keine Gedankenstriche als Satzzeichen im Fliesstext. | Hinweis |
| CH1, CH4 | 0 Eszett. Eine Anrede auf der ganzen Website, Vorgabe «Sie». | Hinweis |
| CH8, CH11, CH12, CH14 | Wenn in der Schweiz: Preise «CHF 120.–», Uhrzeit «14.30 Uhr», Telefon im Muster «0xx xxx xx xx», `tel:+41` mit 9 Ziffern. | Hinweis |
| A1, A15 | Angebotssatz in den ersten drei Sätzen; jede Einstiegsseite endet mit einem Aufruf, der sagt, was danach passiert. | Hinweis |
| A13 | Die Lage der Kundschaft steht im ersten Absatz, mit welchem Pronomen auch immer. | Hinweis |
| KW11, KW12 | FAQ als ganze Kundenfrage, Antwort beginnt mit Ja, Nein, Zahl oder Kern; keine erfundene Frage. | Hinweis; die erfundene Frage sperrt nach Grundregel 2 |
| U1, U6 | Überschrift als Aussage; Knopf mit Verb und Ergebnis. | Hinweis |
| Q5, S27 | Ein Suchbegriff, eine Seite. | Hinweis |
| Q7, Q8 | Preisfrage: Preis in der Beschreibung und direkt unter dem ersten Bildschirm. Ja-nein-Frage: Antwort im ersten Satz. | Hinweis |
| S2, S3, S12 | Titel mit Leistung und Ort zuerst, 40 bis 60 Zeichen; Beschreibung 110 bis 155 Zeichen. | Hinweis |
| S23, S24, S25 | `LocalBusiness` vollständig; keine Selbstbewertung in Daten; Daten nur für Sichtbares. | Hinweis; falsche Werte sperren nach R1 |
| ZS1, ZS7, ZS13 | Sätze stehen allein; Stand-Datum beim Fakt; je Leistung genau eine gültige Fassung. | Hinweis |
| TI20 | Umzug mit genau einem 301-Sprung je alter Adresse. | Hinweis |
| M15 | Ursache nur mit Ausschluss von Saison, Updates und Technik. | Hinweis |

## Was der Skill nicht kann

- **Kein Test mit Menschen in diesem Skill.** Alle vier Semesterprüfungen sind Modell-Urteile. Ob Kundinnen und Kunden gleich urteilen, zeigt erst web-uni WP6 oder die Messung.
- **Deckeneffekte.** Die Tests endeten bei 60 von 60, 72 von 72, 59 von 60 und 60 von 60. Eine Rangfolge der Grundsätze nach Wirkung gibt es darum nicht. Gemessen ist vor allem «konkret schlägt leer», nicht einzelne Stilregeln bei gleichem Inhalt.
- **Keine Klickwirkung belegt.** Im Snippet-Test zeigten die Modelle keinen Vorzug für Platz 1, es gab keine Karte, keine Anzeigen und keine KI-Übersicht. Google schreibt zudem laut Anbieter-Messungen rund 6 von 10 Titeln oder Beschreibungen um.
- **Quellenauswahl der KI-Dienste nicht geprüft.** Im KI-Zitat-Test lag die eigene Seite immer bei den Quellen. Ob ChatGPT-Suche, Perplexity, Gemini oder Google sie finden, ist offen. Eine veraltete Fassung wurde in 4 von 12 Antworten noch erwähnt.
- **Technik nur offline geprüft.** In der Technik-Probe waren 10 Punkte offline nicht prüfbar; sie brauchen die Website online, Konten des Betriebs oder Menschen. Das Prüfskript der Probe gehört nicht zum Skill.
- **Nur ein Werkzeug.** Mitgeliefert ist `slop-de.js`. Faktenabgleich, Lesbarkeit, Antwort-Plan, Text-Register gegen gleiche Formulierungen, Snippet-Test und Zitat-Test gibt es nicht als Werkzeug; sie laufen von Hand oder mit eigenem Skript.
- **TP4 lief noch nie.**
- **Menschen-Daten meist aus den USA.** Für die Deutschschweiz sind nur wenige Punkte belegt.
- **Keine Branchenteile.** Typische Suchfragen, Pflichtangaben und «Nie»-Listen je Branche fehlen.
- **Keine Rechtsauskunft.** Die Rechtsteile, auch Impressum und Datenschutzerklärung, sind von keiner Juristin geprüft.
- **Wirkung auf Anfragen** zeigt erst die Messung nach dem Livegang (Schritt 12).

## Wenn kein Unteragent verfügbar ist

Ohne Unteragenten heissen alle Bewerter-Tore «nicht gelaufen»: TP2, TP4, TP5 und TP6. Gebaut wird trotzdem, wenn der Auftraggeber es will, und der Bericht sagt das oben. Du lieferst die Texte mit den maschinellen Prüfungen (TP0, TP1, TP3 soweit zählbar, TP7) und schreibst «TP2 nicht gelaufen» usw. in den Bericht, nie «bestanden». Eine Einstiegsseite ohne TP2 heisst «nicht blind geprüft».

## Kurzform für eine Prüfung ohne Neubau

Soll eine bestehende Seite nur beurteilt werden:

1. `slop-de.js` und die zählbaren Grundsätze aus Schritt 5 und 7 (TP7, Teil Text).
2. Erster Satz und Titel jeder Einstiegsseite gegen V1, A1, A10, Q7, Q8, S2 bis S5.
3. Recht: R1 bis R24, Impressum und Datenschutzerklärung nach Schritt 10, Befunde mit ID.
4. Technik: TI-Grundsätze mit «Werkzeug», dazu S1, S15, S23 bis S25, S28.
5. Blind, wenn Unteragenten da sind: TP2 und TP5, als Vorfilter.
6. Bericht: Befunde getrennt nach Verständlichkeit, Angebot, Recht, Suche, KI-Suche, Technik; je mit ID, Stelle, Vorschlag und «sperrt» oder «Hinweis».

## Übersicht der Referenzen

| Datei | Inhalt | IDs |
|---|---|---|
| [semester1/verstaendlichkeit.md](referenzen/semester1/verstaendlichkeit.md) | Hamburger Modell, Lesbarkeitsformeln für Deutsch | V1 bis V19 |
| [semester1/satz-und-wort.md](referenzen/semester1/satz-und-wort.md) | Satzlänge, Verben statt Nomen, Passiv, Fremdwort, Zahl | W1 bis W23 |
| [semester1/lesen-am-bildschirm.md](referenzen/semester1/lesen-am-bildschirm.md) | Scannen, erste Bildschirmhöhe, Handy, Zeilenlänge, Zwischentitel | L1 bis L18 |
| [semester1/schweizer-hochdeutsch.md](referenzen/semester1/schweizer-hochdeutsch.md) | ss, Helvetismen, Anrede, Zahlen, Preise, Datum, Telefon | CH1 bis CH16 |
| [semester1/ki-klang.md](referenzen/semester1/ki-klang.md) | KI-Klang, Floskeln, Abgleich mit dem Floskel-Werkzeug | K1 bis K17 |
| [semester1/pruefung.md](referenzen/semester1/pruefung.md) | Prüfung «Welcher Text ist klarer?» | Ergebnis, Grenzen |
| [semester2/angebot-und-botschaft.md](referenzen/semester2/angebot-und-botschaft.md) | Wert-Gleichung, Risiko, Bewusstseinsstufen, Überschrift | A1 bis A23 |
| [semester2/worte-der-kundschaft.md](referenzen/semester2/worte-der-kundschaft.md) | Sammeln, Sortieren, Jobs to be done, FAQ, Datenschutz | KW1 bis KW18 |
| [semester2/ueberschrift-knopf-mikrotext.md](referenzen/semester2/ueberschrift-knopf-mikrotext.md) | Überschrift, Knopf, Formular, Fehlermeldung, Bestätigung | U1 bis U21 |
| [semester2/vertrauen-und-belege.md](referenzen/semester2/vertrauen-und-belege.md) | Belege, Bewertungen, Cialdini ehrlich, Knappheit | B1 bis B20 |
| [semester2/recht-werbung-schweiz.md](referenzen/semester2/recht-werbung-schweiz.md) | Wenn in der Schweiz: UWG, PBV, Heilmittel, Berufsrecht, DSG, Datenschutzerklärung | R1 bis R24 |
| [semester2/pruefung.md](referenzen/semester2/pruefung.md) | Prüfung «Würden Sie hier anrufen?» | Ergebnis je Prinzip |
| [semester3/google-grundlagen.md](referenzen/semester3/google-grundlagen.md) | Search Essentials, Spam, hilfreiche Inhalte, Quality Rater, KI-Inhalte | G1 bis G28 |
| [semester3/suchabsicht-und-seitenplan.md](referenzen/semester3/suchabsicht-und-seitenplan.md) | Suchabsicht, Suchbegriffe, Antwort-Plan, Ortsseiten, Top-Seiten-Analyse | Q1 bis Q19 |
| [semester3/titel-snippet-struktur.md](referenzen/semester3/titel-snippet-struktur.md) | Titel, Beschreibung, Überschriften, Links, Bilder, Adressen, strukturierte Daten, Klickdaten | S1 bis S34 |
| [semester3/lokal-und-profil.md](referenzen/semester3/lokal-und-profil.md) | Unternehmensprofil, lokale Rangfolge, Bewertungen, Verzeichnisse | P1 bis P22 |
| [semester3/messen-search-console.md](referenzen/semester3/messen-search-console.md) | Search Console, Profil-Statistik, Messplan und Messplan-Dokument (Strichliste, Warnwerte, kleine Zahlen), Zugriffsrechte | M1 bis M19 |
| [semester3/pruefung.md](referenzen/semester3/pruefung.md) | Snippet-Test (TP5) | Ergebnis je Suche |
| [semester4/ki-antworten-und-quellen.md](referenzen/semester4/ki-antworten-und-quellen.md) | Wie KI-Dienste Quellen holen, Crawler, Erwähnungen, Studien | KQ1 bis KQ20 |
| [semester4/zitierfaehig-schreiben.md](referenzen/semester4/zitierfaehig-schreiben.md) | Sätze, die allein stehen, Stand-Datum, Tabellen, eine gültige Fassung | ZS1 bis ZS24 |
| [semester4/technik-crawlen-indexieren.md](referenzen/semester4/technik-crawlen-indexieren.md) | robots.txt, noindex, Vorschau, Sitemap, Bing, Statuscodes, Umzug, JavaScript | TI1 bis TI39 |
| [semester4/checkliste-geprueft.md](referenzen/semester4/checkliste-geprueft.md) | Fremde KI-Such-Checkliste neben die Grundsätze gelegt | CL1 bis CL4 |
| [semester4/pruefung.md](referenzen/semester4/pruefung.md) | KI-Zitat-Test (TP6) und Technik-Probe | Ergebnis, Grenzen |
| [abgleich-menschen.md](referenzen/abgleich-menschen.md) | Grundsätze gegen Daten von Menschen; wann Modell-Urteilen zu trauen ist | Zeilen je ID |
| [lektionen.md](referenzen/lektionen.md) | Lektionen aus Läufen mit text-uni, im Format von design-uni | TL1 ff. |
| [werkzeuge/slop-de.js](werkzeuge/slop-de.js), [slop-de.json](werkzeuge/slop-de.json) | Floskel-Werkzeug mit 63 Einträgen | K1, CH1, U6, S18 |

## Kosten und Dauer `[Annahme]`

Ein voller Lauf startet 3 Bewerter in TP2, je 6 in den zwei Sätzen von TP4 und je 6 in TP5 und TP6, also 27 Läufe je Durchgang, dazu die Werkzeuge. Die Zahl der Bewerter richtet sich nach [blindtest.md](../design-uni/referenzen/blindtest.md). Weniger Läufe sind möglich; dann steht im Bericht, welche fehlen. Ohne zweites Modell gilt «nur ein Modell» als Befund.
