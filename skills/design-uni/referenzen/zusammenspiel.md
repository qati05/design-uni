# Zusammenspiel: design-uni, text-uni, web-uni

Stand 2. November 2026 · gilt für alle drei Skills. Jedes Thema hat **genau einen Besitzer**. Die anderen Skills verweisen auf ihn und wiederholen seine Regeln und Schwellen nicht. Wer eine Regel ändert, ändert sie beim Besitzer.

## 1. Rangfolge

1. **Recht** (Gesetz und Verordnung). Kein Entscheid hebt es auf.
2. **Entscheide des Betriebs**: was der Kunde will, mit Datum und Person in `entscheide.md`.
3. **Hausentscheide des Studios**: Standards des Studios, das baut, zum Beispiel der Standard-Stack. Sie stehen ebenfalls in `entscheide.md`, als «Studio».
4. **Regeln der Skills.**

«Auftraggeber» heisst in allen drei Skills: der Betrieb **oder** das Studio. Wo es darauf ankommt, steht «Betrieb» oder «Studio».

## 2. Wer besitzt was

| Thema | Besitzer | Die anderen |
|---|---|---|
| Eingabe: Kundenangaben-Blatt, ein Eingangstor, `entscheide.md`, Zusagen-Blatt | design-uni | text-uni und web-uni ergänzen ihre Fragen **im selben Blatt** (eigene Teile), kein eigenes Blatt |
| Richtung, Gestaltung, Typografie, Komposition, Farbe, Bild, Abstand, Tokens | design-uni | – |
| Bedienung, Barrierefreiheit mit allen Schwellen (Kontrast, Tippziele, Fokus, Zeilenlänge) | design-uni | text-uni nennt nur Ziele («Hauptaussage ohne Scrollen sichtbar») |
| Bewegung: ob und welche | design-uni | web-uni: womit und was es kostet |
| Bilder, Logo, Rechte und Einwilligungen (Tor) | design-uni | – |
| Alle Bewerter-Regeln, Blindtests, Kunden-Agenten, Menschentests | design-uni | text-uni und web-uni nennen nur, **was** geprüft wird |
| Bericht `LIESMICH.md`, Register, Lektionen-Format | design-uni | jeder Skill führt eigene Lektionen in seiner Datei |
| Fakten (`fakten.md`), Kundenworte, Suchbegriffe, Antwort-Plan | text-uni | – |
| Wortlaut aller Texte: Titel, Knöpfe, Formular- und Fehlertexte, Mikrotexte | text-uni | design-uni bestimmt Platz und Grösse, nicht den Wortlaut |
| Angebot und Vertrauen als Inhalt, Belege | text-uni | design-uni: Prüflisten verweisen auf die Grundsätze |
| Recht für Inhalte: UWG, PBV, Heilmittel, Berufsrecht, Impressum, Datenschutzerklärung (Wortlaut) | text-uni | – |
| Suche, lokale Suche, KI-Suche; Regeln für `robots.txt`, Sitemap, `canonical`, Weiterleitungen, Umzug | text-uni | web-uni setzt sie am Hoster um |
| Messplan (ein Dokument `messplan.md`) | text-uni | design-uni liefert Zählpunkte, web-uni den Zählendpunkt |
| Stack, Hoster, Domain, HTTPS, Sicherheit, Sicherungen | web-uni | – |
| Budgets: Ladezeit, Core Web Vitals, JS, Bildgrössen | web-uni | – |
| Fremde Hosts, Cookies, Datenschutz-Technik (DSG), Schriften ausliefern (`font-display`) | web-uni | Grundregel bleibt: nichts von fremden Hosts ohne Not |
| Inhalt ohne JavaScript erreichbar | design-uni (Barrierefreiheit) | text-uni TI31 und web-uni verweisen |
| Formular-Backend, Spamschutz, Zählendpunkt | web-uni | – |
| Testumgebung für alle maschinellen Prüfungen (ein Prüflauf) | web-uni | design-uni und text-uni liefern die Prüfungen |
| Livegang, Pflege durch den Betrieb, Zugänge, Übergabe | web-uni | text-uni liefert die Regeln für Suche und Umzug |
| Kosten an den Kunden (Stunden, laufende Kosten, Kostenblatt) | web-uni | **nur als Entwurf**; an den Kunden erst nach Freigabe durch das Studio |

## 3. Entscheide zu den Widersprüchen

Getroffen am 2. November 2026 `[Entscheid · Studio]`, nach dem Abgleich der drei Skills.

1. **Modell-Urteile sind ein Vorfilter.** Bewerter-Läufe mit Sprachmodellen bleiben Pflicht. Was dort durchfällt, wird überarbeitet. Bestehen heisst «**Modell-Urteil bestanden**», nicht «belegt». Als belegt gilt eine Wirkung erst durch einen Test mit Menschen oder durch Zahlen nach dem Livegang. Das gilt für jeden Prüfpunkt, der Gefallen, Vertrauen oder «würde anfragen» misst.
2. **Haupttitel: Etikett ist `h1`, die Idee ist gross.** Die `h1` nennt Leistung und Ort (Etikett, kleiner). Der Satz aus der Idee steht gross darüber oder daneben und ist keine Überschrift. Die Regel «`h1` ist die grösste Überschrift» entfällt. Es bleibt: genau eine `h1`, sichtbar, `<title>` und `h1` nennen dieselbe Leistung und denselben Ort.
3. **Erster Bildschirm: eine grosse Sache plus Faktenzeile.** Eine grosse Sache (Bild oder Idee). Dazu eine schlanke Zeile mit Leistung, Ort, Telefon und Hauptaktion. Höchstens etwa 60 Wörter `[Annahme]`. Preise, Fristen und Ablauf folgen direkt darunter. Ob das trägt, zeigt der Bildtest. Ein fester Kopf mit Telefon und Hauptaktion zählt als Teil der Faktenzeile; jede Aktion steht im ersten Bildschirm einmal (Entscheid 6).
4. **Vorschau ohne `Disallow`.** Die Vorschau trägt `noindex` (Kopfzeile `X-Robots-Tag` oder Meta) und ist, wo möglich, durch Zugang geschützt. `robots.txt` sperrt sie **nicht**, weil Google sonst das `noindex` nicht liest.
5. **Kundenworte ohne Sackgasse.** Ziel sind 30 wörtliche Aussagen. Sind sie nicht zu bekommen, wird die Lücke bestätigt und es wird weiter geschrieben; Begriffe und Formulierungen gelten dann als `[Annahme]`.
6. **Hauptaktion mehrfach.** Ein fester Kopf mit Hauptaktion und Telefon plus ein Abschluss am Seitenende ist erlaubt. Im selben Bildschirm steht jede Aktion sonst höchstens einmal. Ein Entscheid des Betriebs («Knopf überall») geht vor.
7. **Vorlage ist Technik, nicht Gestaltung.** Die Astro-Vorlage liefert Datenquelle, Bau, Prüfungen und Gerüst. Sie bringt keine sichtbaren Bauteile mit eigenem Aussehen und keine fertigen Texte. Bauteile entstehen jedes Mal aus der Richtung (design-uni), Texte aus text-uni.
8. **Stack.** Standard des Studios ist Astro mit statischer Ausgabe `[Hausentscheid · Studio]`. Statisches HTML bleibt erlaubt, wenn nichts verloren geht. design-uni ist stackneutral.
9. **Werberecht.** Für UWG und PBV gilt die Fassung in text-uni (R-Grundsätze). Superlative: keine unbelegten; im Titel und in der Beschreibung keine.
10. **Fremde Inhalte erst nach Klick** (CL3) gilt vor TI34. Fremde Skripte nur mit Grund und erst nach Einwilligung oder Klick.
11. **Messung.** Nach 8 Wochen ein Zwischenstand für die Suche, mit «zu wenig Daten» als möglichem Ergebnis. Das Urteil über Anfragen fällt nach 3 Monaten.
12. **Bewegung ohne Mengenregel** `[Entscheid · Studio, 02.11.2026]`. Die Regel «keine oder eine Bewegung» fällt weg, ebenso Voreinstellungen wie «glattes Scrollen aus». Bewegung gibt es so viel, wie die Idee des Betriebs oder der Wunsch des Kunden braucht. Es bleibt nur der Boden: `prefers-reduced-motion` wird respektiert; aller Inhalt ist ohne Bewegung und ohne JavaScript erreichbar; keine Bewegung hält Inhalt zurück; was länger als 5 s von selbst läuft, lässt sich pausieren (WCAG 2.2.2); die Kosten stehen im Kostenblatt (web-uni WP3). Ob eine Bewegung wirkt, zeigt der Bildtest als Vorfilter und ein Test mit Menschen.
13. **Weniger Regeln.** Eine Regel sperrt nur, wenn sie Recht, Barrierefreiheit, eine Entscheidung des Betriebs oder des Studios (Rangfolge, Teil 1) oder einen Befund mit Menschen-Daten oder eigener Messung schützt. Regeln, die nur aus Modell-Urteilen oder aus Geschmack stammen, werden zu Hinweisen und sperren nichts. Das betrifft **Regeln**, nicht die Bewerter-Läufe selbst: Nach Entscheid 1 ist der Lauf Pflicht, und was dort durchfällt, wird überarbeitet; Bestehen heisst nur «Modell-Urteil bestanden». Jede sperrende Prüfung läuft **einmal**, im gemeinsamen Prüflauf (Abfolge Schritt 13), beim Besitzer; die anderen Skills zählen sie nicht ein zweites Mal.

## 4. Eine Schwelle je Sache

| Sache | Schwelle | Besitzer |
|---|---|---|
| Satzlänge | über 20 Wörter und über 25 Wörter je ein HINWEIS in zwei Stufen (W2) | text-uni |
| Zeilenlänge | 50 bis 75 Zeichen, nie über 80; am Handy gilt nur «nie über 80» | design-uni |
| Messbreiten für alle Prüfungen | 1440 × 900 und 390 × 844; Überlauf zusätzlich bei 360 | design-uni |
| Titel und Beschreibung | 40 bis 60 Zeichen, über 65 deutlicher HINWEIS; Beschreibung 110 bis 155 (S3, S12); alle als HINWEIS | text-uni |
| Formular | 3 bis 5 Felder, höchstens 4 Pflicht; freiwillige Felder mit «(freiwillig)»; ein Sternchen für Pflicht nur, wenn es über dem Formular erklärt ist (U11) | design-uni (Anzahl), text-uni (Wortlaut) |
| JS, Bilder, LCP | Budgets in web-uni (WP5) | web-uni |
| Lighthouse | Schwelle 90; über der Schwelle wird nicht weiter optimiert | web-uni |
| Bewegung | keine Mengenregel; Boden: Reduced Motion, Inhalt ohne Bewegung, Pause ab 5 s (Entscheid 12), Tabelle in `bewegung.md` | design-uni |
| Ortsseiten, gleicher Text | höchstens 30 Prozent | text-uni |
| Mindestumfang einer Seite | kein Wortziel; unter 80 Wörtern nur ein Hinweis auf eine leere Seite | text-uni |

## 5. Kennungen

Jede Kennung ist in allen drei Skills eindeutig. Querverweise nennen immer die volle Kennung.

| Skill | Was | Kennung |
|---|---|---|
| design-uni | Prüfpunkte | **DP0 bis DP8** (früher P0 bis P8) |
| design-uni | Lektionen | **DL1 ff.** (früher L1 ff.) |
| design-uni | Gestaltungs-Grundsätze in typografie, komposition, farbe-bild, bewegung | **DG** mit Dateikürzel: DGT (Typografie), DGK (Komposition), DGF (Farbe und Bild), DGB (Bewegung), z. B. DGB13 (früher G…) |
| design-uni | Techniken | **TK1 bis TK14** (früher T1 bis T14) |
| design-uni | Prüflisten A, P, H | **LA1 ff., LP1 ff., LH1 ff.** (früher A 1, P 1, H 1) |
| design-uni | Bausteine der Galerie | **GB1 bis GB11** (früher B1 bis B11) |
| text-uni | Prüfpunkte | **TP0 bis TP8** (früher T0 bis T8) |
| text-uni | Lektionen | **TL1 ff.** |
| text-uni | Grundsätze | unverändert: V, W, L, CH, K, A, KW, U, B, R, G, S, P, Q, M, KQ, TI, ZS, CL |
| web-uni | Prüfpunkte | **WP0 bis WP9** (früher V0 bis V8; WP9 Livegang ist neu) |
| web-uni | Lektionen | **WL1 ff.** (früher W1 ff.) |
| web-uni | Quellen in `stack-wahl.md` und `stacks.md` | **WQ1 bis WQ89** (früher S1 bis S89) |


## 6. Gemeinsame Abfolge

Jeder Schritt nennt das Tor. Fällt ein Tor, geht es zum Schritt zurück, der das fehlende Ergebnis liefert, auch über Skillgrenzen.

1. **Eingang** (design-uni Schritt 1 und 2, text-uni Schritt 1, web-uni Schritt 0): ein Kundenangaben-Blatt mit den Teilen aller drei Skills; `entscheide.md`, `fakten.md`, Kundenworte, Suchbegriffe, Anforderungen, Anfragekette als Entwurf, Bestand (alte Adressen). **Tor: DP0 + TP0 + WP0**, einmal geprüft. Das Sieben der Nomen gehört zu DP1.
2. **WP1 Klassen** (web-uni).
3. **TP1 Antwort-Plan** (text-uni): Seitenliste. Gebaut wird keine Seite ausserhalb des Plans.
4. **DP1 Richtung** (design-uni), blind als Vorfilter, mit Register.
5. **WP2 Stack und Hoster** (web-uni). Ist Bewegung oder 3D Kern des Wunsches, läuft WP2 nach DP1.
6. **DP2 Abstand, Tokens, welche Bewegung die Idee braucht** (design-uni) → **WP3 Bewegungstechnik und Kostenblatt** (web-uni).
7. **TP2 Botschaft** (text-uni), blind, nur Text: erster Satz, `h1`-Etikett und `<title>` als Entwurf. Dazu der Abgleich: Satz aus der Idee und erster Satz widersprechen sich nicht (Entscheid 2). Der Fünf-Sekunden-Test am Bild gehört zu DP4.
8. **Ziele an die Gestaltung** (text-uni) → design-uni, **vor** dem Bau.
9. **Text und Inhalt vor Gestalt** → **DP3 = TP3** in einem Lauf. Fragen, die erst am Bau prüfbar sind (Ladezeit, tote Links) wandern zu DP6, der Messplan zu TP8.
10. **TP4 blind gegen die Konkurrenz** (text-uni), zwei Sätze mit denselben Referenzen, je eine eigene Fassung.
11. **Gerüst** (web-uni) → **DP4 erster Bildschirm** (design-uni), vorher `vermessen.cjs` und `vergleichen.cjs`.
12. **DP5 Startseite mit Bewegung** (design-uni, braucht WP3).
13. **Bau aller Seiten** mit Titel, Beschreibung, strukturierten Daten, Zitierfähigkeit, Technik, dazu **Impressum und Datenschutzerklärung** (text-uni) → **ein Prüflauf**: DP6 + TP7 + WP4 + WP5; dazu TP5 und TP6.
14. **DP7 Kunden-Agenten**, **DP8 ganze Website** (design-uni), als Vorfilter.
15. **WP6 Wirkung mit Menschen**, wo es um Wirkung geht (Entscheid 1).
16. **TP8 Messplan** (text-uni, ein Dokument).
17. **WP7 Betrieb und Übergabe** (web-uni): Anfragekette bestätigt, Zugänge, Pflegehandbuch, Weiterleitungsliste.
18. **Abliefern** (design-uni Schritt 11, WP8): ein `LIESMICH.md`, Zusagen-Blatt, Register, Lektionen.
19. **WP9 Livegang nach Freigabe** (web-uni): `noindex` weg, `robots.txt`, Sitemap, `canonical`, Weiterleitungen, Einreichen, Nachprüfung nach 1, 4 und 12 Wochen.

**Ohne Unteragenten:** Alle Bewerter-Tore heissen «nicht gelaufen». Gebaut wird trotzdem, wenn der Auftraggeber es will, und der Bericht sagt das oben.

## 7. Prüfen: sperren oder Hinweis

- **Jede Prüfung hat eine Kennung und einen Besitzer.** Sie läuft einmal im gemeinsamen Prüflauf. Die anderen Skills nennen sie mit dieser Kennung und zählen sie nicht noch einmal.
- **Werkzeuge kennen drei Stufen:** FEHLER (sperrt, nach Entscheid 13), HINWEIS (wird gemeldet, sperrt nicht) und «nicht geprüft». Exit-Code 1 nur bei FEHLER.
- **Gerüst und Vorschau:** Fehlen Texte, die erst später geschrieben werden (Beschreibung, Rechtsseiten), meldet der Bau einen HINWEIS und baut weiter. Vor der Abgabe (DP6, TP7) sind sie FEHLER.
- **Formular ohne Backend:** Solange kein Server-Endpunkt gebaut ist, gilt: sichtbare Rückmeldung im Browser sofort; der Text sagt ehrlich, was geschieht (z. B. «Ihr E-Mail-Programm öffnet sich»). «Gesendet» heisst es erst mit Endpunkt.
- **Menschentest:** Ablauf nur in `blindtest.md` (design-uni). web-uni und text-uni verweisen darauf.
