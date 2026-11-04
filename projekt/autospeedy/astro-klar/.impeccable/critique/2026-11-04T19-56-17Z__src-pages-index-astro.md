---
target: Startseite und Schadenmeldung Klar
total_score: 24
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 4
target_identity: "file:C:\\Users\\resha\\Projekte\\design-uni\\projekt\\autospeedy\\astro-klar\\src\\pages\\index.astro"
target_fingerprint: "sha256:4a574973b68a6792b2defe799b2bb9d720567e5050baeba163c40f694b1e3c8f"
target_path: "C:\\Users\\resha\\Projekte\\design-uni\\projekt\\autospeedy\\astro-klar\\src\\pages\\index.astro"
timestamp: 2026-11-04T19-56-17Z
slug: src-pages-index-astro
---
Method: dual-agent (Design-Review und Detektor getrennt erhoben)

# Critique: Auto Speedy, Linie «Klar», Startseite und Schadenmeldung

Stand 04.11.2026, Modus Persuade, geprüft bei 1440 px und 375 px auf dem Dev-Server. Nichts abgesendet: Bestätigungsseite, WhatsApp-Weg und Feldfehler in Schritt 3 stammen nur aus dem Code. Die Einblendanimationen liefen im verborgenen Browserfenster nicht, das Bewegungsverhalten ist also nicht beurteilt. Platzhalter (Fotos, Inhaberzitat, Google-Zitate) sind gewollt und nicht als Fehler gezählt.

## Design Health Score

| # | Heuristik | Score | Kernproblem |
|---|---|---|---|
| 1 | Systemstatus | 3 | Stepper und Live-Status gut; der Hinweis auf 6 Fotos wird sofort überschrieben |
| 2 | Sprache und Realität | 3 | Kacheln in Kundensprache; «Spot-Repair», «Anhalten» neben dem Logoband bleiben erklärungsbedürftig |
| 3 | Kontrolle und Freiheit | 2 | Neuladen leert alles; Browser-Zurück verlässt das Formular |
| 4 | Konsistenz | 2 | Hauptaktion kippt im Fuss zu «Anrufen»; Titel mit drei Kanten und drei Grössen; zwei Knopfwelten |
| 5 | Fehlervermeidung | 2 | WhatsApp-Weg verliert Angaben; «Angaben ändern» erlaubt Doppelmeldung |
| 6 | Wiedererkennen | 3 | Zusammenfassungszeile gut; Aktion am Handy beim Runterscrollen weg |
| 7 | Flexibilität | n/a | Persuade-Fläche |
| 8 | Ästhetik und Minimalismus | 3 | Ruhig, aber redundant: zwei blaue «Schaden melden» untereinander, Tesla-Zulassung mehrfach |
| 9 | Fehlerbehebung | 3 | Fehler klar am Ort; Foto-Limit-Hinweis geht verloren |
| 10 | Hilfe | 3 | Gute Hilfetexte; wichtigste Beruhigung liegt im Aufklapper |
| **Total** | | **24/36** | **67 %, Acceptable, knapp unter Good** |

## Design-Specificity-Urteil

**Beurteilung:** Inhaltlich spezifisch, kompositorisch austauschbar. Mit anderem Logo und ohne Tesla-Teil könnte fast jede Schweizer Carrosserie die Startseite so nutzen. Der Aufbau (Hero, Faktenleiste, Logoband, 6 Karten, CTA-Band, Zitat, Bewertungen, FAQ, Riesenslogan) ist Kategorie-Standard. Eigen sind die Kacheln in Kundensprache, der Live-Status und die offen gezeigten Lücken. «Messblatt» ist nur in Faktenleiste und Tesla-Tabelle spürbar, «Werkbank» hängt an Fotos, die noch fehlen.

**Grösste verpasste Chance:** Die Stellenwahl besteht aus 12 Chips. Ein Fahrzeugplan im Messblatt-Stil wäre das Erkennungszeichen der Linie.

**Detektor:** 53 Befunde in 7 Regeln, davon nur wenige echt.

| Regel | Anzahl | Urteil |
|---|---|---|
| marquee | 15 | Echt auf `/` und `/flotten/`, auf den übrigen 13 Seiten Fehlalarm |
| dark-glow | 15 | Fehlalarm, die Seite ist hell |
| cramped-padding | 12 | Fehlalarm, gemessen 40 bis 160 px Abstand; ein Befund ohne Elementangabe nicht zuzuordnen |
| hero-eyebrow-chip | 7 | Echt auf 7 Unterseiten, die Startseite ist nicht betroffen |
| italic-serif-display | 2 | Echt, nur das `<em>` ist kursiv; die Startseite hat dasselbe Muster, wird aber nicht gemeldet |
| tight-leading | 1 | Wahrscheinlich Fehlalarm |
| bounce-easing | 1 | Nur Rückfall für alte Browser |
| buried-raster (nur Overlay) | 1 | Wahrscheinlich Fehlalarm, das Einblenden war nicht live prüfbar |

Detektor und Review treffen sich beim Band und bei den Kickern. Die wichtigsten Probleme unten erkennt der Detektor nicht. Er nennt auch nicht, dass der Verlauf und der Schein von `.k--blau` gegen «fast flach» in der DESIGN.md gehen.

## Was funktioniert

1. **Schritt 1 des Formulars:** grosse Kacheln in Kundensprache, ein Tipp, und es geht weiter. Das ist der stärkste Moment der Website.
2. **Ehrlichkeit als Stil:** Live-Status, «bestätigt» nur bei Serverantwort, keine Superlative.
3. **Klare Hauptaktion oben:** ein blauer Knopf, Telefon sichtbar daneben, am Handy in Daumennähe.

## Priority Issues

**[P1] Schritt 3 bricht das Versprechen «in drei Tipps».**
Nur Name und Telefon sind Pflicht, trotzdem liegt Senden am Handy rund 1040 px unter dem Formularkopf, mit offenen Optionen rund 1600 px. Das Formular beginnt erst bei 488 px.
Fix: Schritt 3 zeigt Name, Telefon und Senden, der Rest kommt in «Noch etwas ergänzen (freiwillig)». «Fehlt etwas? Kein Problem» steht sichtbar am Knopf, WhatsApp wird Textlink, die Einleitung am Handy wird gekürzt.
Befehl: `/impeccable distill`

**[P1] Schritt 2 lenkt von den Fotos weg.**
Erfolg heisst laut PRODUCT.md «mit Fotos». Das einzige gefüllte Blau ist aber «Ohne Foto weiter», der Fotoknopf ist grau und gestrichelt (im Code bestätigt).
Fix: Fotoknopf wird blauer Hauptknopf, «Ohne Foto weiter» wird Textlink, «Weiter» wird erst nach dem ersten Foto blau.
Befehl: `/impeccable bolder`

**[P1] Die Hauptaktion ist am Handy nicht immer erreichbar, und im Fuss kippt die Rangfolge.**
Entscheid 1 verlangt den Knopf jederzeit. Die Leiste verschwindet aber beim Runterscrollen. Das ist laut Code-Kommentar eine bewusste Korrektur («Motion 3») und widerspricht Entscheid 1. Im Fuss steht «Schaden? Rufen Sie an.» direkt über «Jetzt geschlossen», auch unter dem Formular.
Fix: Leiste nach dem Hero stehen lassen, im Fuss blau «Schaden melden», Text je nach Status (Wortlaut und Rückrufzeit vom Betrieb bestätigen lassen).
Befehl: `/impeccable clarify`

**[P1] Der WhatsApp-Weg verliert Angaben still (aus dem Code, nicht gesendet).**
`nachricht()` übernimmt weder Mail noch Kontrollschild, Versicherung oder Schadennummer (im Code bestätigt). Fotos gehen nicht mit, die Bestätigung zeigt sie laut Review trotzdem. «Höchstens 6 Fotos» wird überschrieben. «Angaben ändern» nach echtem Versand erlaubt eine zweite Meldung.
Fix: alle Felder in den Text, in der Bestätigung «Bitte diese X Fotos in WhatsApp anhängen», Limit-Hinweis stehen lassen, nach Versand «Ergänzung senden» oder Telefon.
Befehl: `/impeccable harden`

**[P2] Die Startseite spricht nicht zuerst zu jemandem mit Schaden.**
«Muss ich zuerst zur Versicherung? Nein.» ist die beste Antwort der Seite, aber FAQ Nummer 5, zugeklappt, am Handy bei rund 6000 px. Unter den Leistungen steht dieselbe Aufforderung doppelt.
Fix: Versicherungsantwort neben die Hero-Knöpfe, doppelten Knopf streichen, Band zum Ablauf für alle Marken ausbauen (Melden, Begutachten, Reparieren; Ablauf vom Betrieb zu bestätigen), Stellenwahl als Fahrzeugplan.
Befehl: `/impeccable shape`

## Persona-Red-Flags

**Jordan (Erstnutzer):** «Anhalten» neben dem Logoband liest sich auf einer Autoseite seltsam. «Spot-Repair» bleibt unerklärt. Am Sendeblock zwei Wege ohne Empfehlung.

**Riley (Stresstester):** Neuladen in Schritt 3 setzt alles zurück. Fotos erscheinen in der WhatsApp-Bestätigung, ohne gesendet zu sein. Doppelversand über «Angaben ändern». «Weiter zu den Fotos» löst ohne Wahl nur den Fehler aus.

**Casey (abgelenkt am Handy):** Dauerknopf weg beim Runterscrollen. Formular erst ab 488 px. Keine Sicherung bei Unterbrechung. Tippziele fast überall gut, nur «Anhalten» (41 px) und «Occasionen ansehen» (21 px) liegen darunter.

**Frischer Parkschaden, abends, eine Hand:** Der Kachel-Tipp beruhigt sofort. Dann ist «Ohne Foto weiter» die stärkste Option, Schritt 3 wirkt nach Name und Telefon nicht fertig, die Bitte um eine Bewertung passt nicht zum Moment. Unter dem Formular steht «Rufen Sie an», aber es ist geschlossen. Offen bleibt: Wann meldet sich jemand?

## Kleinere Beobachtungen

- Öffnungszeiten brechen in der Faktenleiste mitten im Zeitfenster.
- Formulartitel kleben an den Kacheln, die Sterne am Google-Titel.
- «Etwas anderes» bleibt als Waise allein in der letzten Kachelreihe.
- Der Riesenslogan wiederholt den Hero ohne neuen Inhalt, der Fuss ist bei 1440 px rund 1000 px hoch.
- «Zulassung: Tesla Approved Body Shop» wiederholt den Titel direkt darüber.
- PRODUCT.md verspricht Dunkelmodus samt Knopf, `klar.css` hat ihn laut Review nicht. Doku-Abweichung oder Lücke, noch offen.
- Das Fremdmarkenlogo auf der Maschine im Stockbild stört leicht.

## Fragen zum Weiterdenken

- Wem dient das Verstecken der Leiste beim Scrollen, dem Besucher oder dem ruhigen Look?
- Was wäre, wenn die Startseite am Handy mit «Was ist passiert?» begänne?
- Wie sähe die Seite um 22 Uhr aus, wenn sie wüsste, dass niemand abnimmt?
