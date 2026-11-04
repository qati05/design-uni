# Review final · Autospeedy Entwurf C (Commit f6036f7)

Geprüft am 04.11.2026 von Designer. Geprüft wurden die Screenshots `final-*`, ein Live-Check auf http://127.0.0.1:4391 (390 px und 1440 px), Lighthouse und das Video `final-rundgang.mp4`.
Persona 1 ist die Unfallfahrerin am Handy, gestresst und in Eile. Persona 2 ist der Tesla-Fahrer. Persona 3 ist der Flottenkunde.

## Urteil in 5 Zeilen
- Die Struktur stimmt. Am Handy sieht man zuerst das Versprechen, danach «Schaden melden» und dann «Anrufen». Die Angst vor den Kosten beantwortet der Satz «Abwicklung mit Versicherung übernehmen wir».
- Das Formular ist stark: 3 Schritte, grosse Kacheln, «Lieber sprechen?» mit Telefon.
- Der Footer ist gelungen: Live-Status, Wochenzeiten, Kopieren-Knöpfe und der grosse blasse Slogan. Damit fühlt sich die Seite wie ein Eigenbau an.
- Drei Fehler müssen vor jedem Zeigen weg: Die Kopfleiste verdeckt die H1, die Footer-Knöpfe sind zu klein und auf der Tesla-Seite stehen interne Notizen.
- Danach ist C bereit für das Gespräch mit dem Betrieb. Für den Livegang fehlen noch Fotos, das Inhaber-Zitat und SEO.

## A · Muss vor dem Zeigen beim Kunden (Fehler)
1. **Kopfleiste verdeckt die H1 am Handy, auch live und nicht nur im Screenshot**
   - Messung bei 390 px: Die H1 beginnt bei 84 px, die fixierte Kopfleiste endet bei 108 px. Von «Qualität,» bleibt nur die untere Hälfte sichtbar.
   - Über der Kopfleiste liegt zudem ein leerer grauer Streifen von etwa 50 px, am Handy und am Desktop.
   - Am Desktop schneidet die Kopfleiste die obere Kante des Hero-Fotos ab, die runden Ecken oben fehlen.
   - Soll: Die Kopfleiste sitzt ganz oben. Der Inhalt beginnt unter ihr (padding-top gleich Kopfhöhe plus Luft). Das Foto zeigt oben sichtbar runde Ecken.
   - Warum: Die H1 ist das Erste, was Persona 1 liest.
2. **Knöpfe im Footer sind nur 32 px hoch**
   - Betroffen sind «Anrufen 071 755 88 61», «Schaden melden», «Route», «Kopieren», «Adresse kopieren», «Firmenkunden» sowie Impressum, Datenschutz, Bildnachweise und «Nach oben».
   - Soll: Der Haupt-CTA «Anrufen» bekommt die gleiche Grösse wie im Hero (mindestens 48 px, Schrift wie oben). Alle anderen Tippziele sind mindestens 44 px hoch.
   - Warum: Am Handy ist der Footer der letzte Aufruf, und dort sind die Knöpfe gerade am kleinsten.
3. **Tesla-Seite zeigt interne Notizen**
   - Der Abschnitt «Gut zu wissen» enthält den Satz «… hat das Studio den Eintrag nicht nachgeprüft.» Das ist unsere interne Sprache und gehört nicht vor Kunden. Soll: diesen Satz löschen und den Punkt in die offenen Fragen verschieben.
   - Die gelbe Box «Lücke: …» sowie alle `Luecke`-Boxen auf `/flotten/`, `/leistungen/` und `/datenschutz/` bleiben nur in der Vorschau. Soll: Sie werden mit einem Schalter ausgeblendet, sobald `noindex` wegfällt. Bitte prüfen, ob es diesen Schalter schon gibt.
4. **«Rückruf» auf der Tesla-Seite**
   - Der Satz «So wissen wir vor dem Rückruf, welches Auto kommt» verspricht einen Rückruf. Ob der Betrieb immer zurückruft, ist nicht bestätigt.
   - Soll: «So wissen wir gleich, welches Auto kommt.» Oder den Satz als offene Frage markieren.
5. **Formularseite: doppelter Aufruf im Footer**
   - Auf `/schaden-melden/` zeigt der Footer nochmals «Schaden melden» und verweist damit auf die Seite selbst.
   - Soll: Auf dieser Seite steht im Footer nur «Anrufen».

## B · Vor dem Livegang
6. Fotos B1 bis B8 kommen vom Shooting nach der Bildliste.
   - Zwei Platzhalter sind beide mit «B8» beschriftet (Porträt und Team). Soll: das Teamporträt neu nummerieren, im Plan steht es als 3:2.
   - Am Handy ist der Porträt-Platzhalter nur halb so breit wie der Bildschirm, daneben bleibt eine tote Fläche. Soll: volle Breite oder zentriert.
7. Inhaber-Zitat und «[Name], Inhaber» kommen aus dem Gespräch mit dem Betrieb. Den Satz «Zehn Leute …» muss der Betrieb bestätigen.
8. Für SEO 58 (beim Livegang) braucht es:
   - eine Meta-Description pro Seite,
   - `noindex` weg,
   - `favicon.ico` und `apple-touch-icon` aus dem Logo.
9. LCP 3.3 s am Handy wegen des Hero-Bilds.
   - Soll: AVIF, eine Grösse von etwa 800 px für Handys, `fetchpriority=high`, kein Lazy-Loading.
   - Ziel: LCP unter 2.5 s und Performance über 90. Mit dem echten Foto nochmals messen.
10. Kontrast: Zwei `span`-Elemente liegen unter AA (Lighthouse `span.nr`). Ich vermute die blauen Schrittnummern «01 02 03» auf Grau. Soll: mindestens 4.5:1.
11. Partnerband
   - Es zeigt nur Namen in Kästchen und keine Logos. «AMAG» erscheint doppelt nebeneinander, weil die Schleife zu kurz ist. «Tesla Approved Body Shop» ist als einziges Kästchen unterstrichen.
   - Soll: echte Logos in Graustufen, sobald die Nutzung bestätigt ist. Die Schleife darf keine sichtbare Wiederholung haben, und alle Kästchen sehen gleich aus.
12. Admin
   - «Speichern und veröffentlichen» ist auch ohne Verbindung klickbar. Soll: deaktiviert mit kurzem Grund.
   - Der Tab «Zeiten» ist leer. Soll: ein leerer Zustand mit einem Satz und einem Beispiel.

## C · Feinschliff (empfohlen)
13. **Vorher/Nachher am Desktop zu klein**
   - Der Slider ist etwa 420 px breit, rechts davon bleibt eine grosse leere Fläche. Titel und Text stehen weit auseinander.
   - Soll: Titel und Text links, der Slider rechts über etwa 60 % der Breite. Oder der Slider auf voller Inhaltsbreite.
   - Warum: Das ist der stärkste Beweis für die Qualität («Qualität, die man sieht»).
14. **Tesla-Hero wirkt wie eine Vorlage**
   - Dunkles Raster im Hintergrund, Pill-Badge mit Punkt und leuchtender Knopf: Das sieht man so auf vielen KI-Seiten, und es passt nicht zur ruhigen Startseite.
   - Soll: Raster und Glow weg, dafür ein gerahmtes Tesla-Foto wie auf der Startseite. Der dunkle Grund darf bleiben, als Hinweis auf Tesla.
   - Die Liste 01–04 rechts ist nicht klickbar und wirkt wie eine Navigation. Soll: als einfache Liste ohne Nummern, oder mit Links auf die Leistungen.
   - Am Seitenende vor dem Footer fehlt ein CTA «Tesla-Schaden melden».
15. Tesla-Schritte am Desktop: Der Kreis bei «01» sitzt tiefer als bei 02 und 03. Soll: alle auf derselben Linie.
16. Formularseite: Die Eyebrow «SCHADEN MELDEN · AUTO SPEEDY, ALTSTÄTTEN SG» verstösst gegen unsere Regel «keine Eyebrows». Soll: streichen, die H1 reicht.
17. Wochenzeiten im Footer: «Montag bis Donnerstag heute» liest sich holprig. Soll: «heute» als kleines Label vor oder unter der Zeile, oder die heutige Zeile nur fett ohne Wort.
18. Bei «Unfall und Carrosserie» steht «Vom Kratzer bis zum Chassisschaden.». Das ist sehr nah am Titel, den Reshat nicht mag («Vom Kratzer bis zum Blechschaden»). Vorschlag: «Unfallschäden reparieren wir für alle Marken. Die Versicherung regeln wir.»
19. Über dem Hero-Foto am Desktop steht eine senkrechte Trennlinie ohne Funktion. Soll: weg, das Foto trägt allein.

## Bewegung (Video)
Das Video zeigt nur den Desktop. Hamburger-Menü und Anrufleiste am Handy sind darin nicht zu sehen und deshalb noch nicht geprüft.
- **Gut:** Der Vorher/Nachher-Regler folgt der Maus ohne Klick, ruhig und ohne Ruckeln. Beim Scrollen gibt es keine Sprünge, kein Flackern und keine Layout-Verschiebungen.
- **20. Die Kopfleiste wird beim Scrollen nicht schmaler** (Motion-Auftrag Punkt 4). Soll: Ab etwa 80 px Scroll wird sie schmaler und milchig (Höhe 72 auf 56 px, Hintergrund halbtransparent mit Blur, 300 ms). Prüfen, ob das nur an der Video-Aufnahme liegt.
- **21. Fotos blenden nicht sichtbar ein** (Punkt 5). Bei den Platzhaltern ist das in Ordnung. Prüfen, ob das Hero-Foto, das Tesla-Foto und der Slider sanft erscheinen (opacity und translateY 8 px, höchstens 450 ms).
- **22. Formular:** Der Fokus-Rahmen ist da. Den Haken, der sich selbst zeichnet (Punkt 7), zeigt das Video nicht, weil es vor dem Absenden endet. Bitte einen Screenshot des Erfolgszustands nachliefern.
- **23. Fehlende Clips:** Bitte einen zweiten kurzen Rundgang am Handy (390 px) aufnehmen. Er soll das Öffnen und Schliessen des Menüs zeigen, die Anrufleiste, die beim Scrollen verschwindet und wiederkommt, und den Druck auf einen Federknopf.

## Was gut ist (nicht anfassen)
- Die Hierarchie am Handy: H1, «Schaden melden» gefüllt in Blau, «Anrufen» gefüllt in Beige und kein Ghost-Button als Haupt-CTA.
- Die Faktenleiste mit Ort, Offen, Ersatzwagen und Zulassung beantwortet die 5-Sekunden-Fragen.
- Den Ersatzwagen gibt es «auf Anfrage». Das ist korrekt und überall gleich formuliert.
- Das Hamburger-Menü ist clean, und die Anrufleiste am Handy hat zwei klare Knöpfe.
- Der Footer hat den Live-Status «Jetzt offen, bis 12.00 Uhr», die Wochenzeiten, die Kopieren-Knöpfe und den Slogan gross und blass. Den Kontrast habe ich mit 3.35:1 gemessen, Pflicht ist mindestens 3:1.
- Die Platzhalter sind ehrlich beschriftet, und es gibt keine erfundenen Fakten.

## Nächster Schritt
- Reshat gibt A und C frei. Ein Auftrag an Claude Code (Opus, effort medium) umfasst A, C13 bis C19 und die Punkte 20 bis 23.
- B wartet auf das Gespräch mit dem Betrieb und das Shooting.
