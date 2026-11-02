# Prozess

## Reihenfolge

1. Die drei SKILL.md ganz gelesen, dann die Referenzen, auf die die Schritte zeigen (richtung, techniken, abstand, conversion, nie-liste, blindtest, kunden-agenten, branchen/handwerk-auto-bau, geschmack, bewegung, typografie, farbe-bild, komposition, vorbilder-gemessen, recht-schweiz, stacks, animation-3d), dazu Vorlage und `pruefen.cjs`. Die text-uni-Skripte der Semester habe ich **nicht** gelesen (nur die SKILL.md-Regeln mit IDs); die Zählregeln kamen über `pruefen.cjs` und `slop-de.js`.
2. Eingabe gelesen, alle 22 Fotos als Kontaktbogen angesehen, Logo und foto-06 mit der Pipette gemessen.
3. Akte vor dem Bau: `entscheide.md`, `richtung.md` (Inventar, 16 Nomen, Angebotsblatt, Sieben, Only-ness, drei Kandidaten, Wahl «Der blaue Kreis», Grundsätze, Register, Ableitungskette, Techniken).
4. Lichtregel als Skript für alle Fotos, Logo zugeschnitten; Tokens als DTCG-JSON mit Generator.
5. Astro aus der Vorlage: `betrieb.json`, Komponenten, Formular (Skizze und Tesla-Modelle), 8 Seiten, CSS, Skript.
6. Bildschirmfotos angesehen und korrigiert (Kreis im Titel, Bildgrösse, Legende doppelt zur Überschrift, Pflichtfelder zuerst, Umbruch «/-in»).
7. `projekt.json`, `pruefen.cjs --selbsttest`, `pruefen.cjs` (2 Runden bis 0 Fehler), `slop-de.js`, `vermessen.cjs` + `vergleichen.cjs` (führte zu grösserem Bild), `kunde.cjs` Selbsttest und skriptierte Pfade (führte zu Scroll zum Fehlerfeld), axe, Lighthouse (führte zu leichteren Bildern und Vorladen), Bildfolge der Bewegung (führte zu neuer Technik des Kreises).
8. Collagen-Tafeln und Unschärfe-Test nachgereicht (hätten vor dem Bau stehen sollen, siehe unten).
9. Text-Akte, Stack- und Bewegungsblatt, Zusagen-Blatt, Messplan, Endlauf aller Werkzeuge, finale Bildschirmfotos, LIESMICH.

**Ehrlich zur Reihenfolge:** Die drei Element-Collagen (design-uni Schritt 3.6) habe ich erst nach dem Bau als Tafel gebaut; die Wahl fiel vorher am Text. Weil P1 ohnehin nicht laufen konnte, hätte eine frühere Tafel nichts entschieden, aber das Verfahren verlangt sie vorher. Ein Lauf wurde von einem API-Limit unterbrochen und fortgesetzt.

## Stellen in den Skills: unklar, widersprüchlich, nicht ausführbar

| # | Datei und Zeile | Problem |
|---|---|---|
| 1 | `design-uni/SKILL.md` Z. 251; `text-uni/SKILL.md` Z. 306; Z. 93 | Ohne Unteragenten «hältst an» bzw. «baust nicht»; P0 «fragst nach und baust nicht». Ein Auftrag «allein, ohne Rückfragen, baue trotzdem» ist nicht vorgesehen. Es fehlt ein Modus «Vorschau ohne Prüfpunkte», der festlegt, was dann Pflicht bleibt und wie das Ergebnis heisst. |
| 2 | `design-uni/SKILL.md` Z. 204, 214; `blindtest.md` Abschnitt 1 | Zwei verschiedene starke Modelle sind für P1, P4, P5, P7, P8 Pflicht. In einer Sitzung mit einem Modell und ohne Agent-Werkzeug ist kein einziger blinder Prüfpunkt ausführbar; der Skill sagt nicht, ob ein Modell allein als «halber» Test gelten darf. |
| 3 | `design-uni/SKILL.md` Z. 176 gegen `bewegung.md` Z. 81 und Abschnitt 7 («Strich zeichnet sich» für Handwerk) | P5 erlaubt nur Transform, Deckkraft, Farbe; die empfohlene Bewegung für Handwerk animiert `stroke-dashoffset`. Widerspruch; hier gemeldet als «nein» in P5. |
| 4 | `bewegung.md` Z. 81 (Muster ohne Hinweis) | `stroke-dashoffset` mit `pathLength="1"` zeichnet falsch, sobald `vector-effect: non-scaling-stroke` gesetzt ist (Striche dann in Bildschirm-Einheiten). Ein Hinweis fehlt; die Bildfolge zeigte den Fehler. |
| 5 | `design-uni/referenzen/farbe-bild.md` Z. 17 gegen Kundenentscheid | «Logo-Farben nur, wenn sie im Bild vorkommen»; der Kunde will ausdrücklich die Logo-Farben. Grundregel 4 löst es (Kunde geht vor), aber die Referenz nennt den Fall nicht. |
| 6 | `web-uni/SKILL.md` Z. 120 | «Formulare mit Server, nicht nur `mailto:`», Vorlage-README sagt «Kein Formular mit Server»; Kunde will «nur E-Mail, kein Backend». Wie ein guter `mailto:`-Weg aussieht (kein Anhang möglich, kein E-Mail-Programm eingerichtet), steht nirgends. |
| 7 | `web-uni/SKILL.md` Z. 19, 104, 131, 197 | Verweise auf `messungen.md`, `branchenwerte.md`, `lektionen.md` «(nicht in dieser Kopie)»; Befehle für die Messung fehlen dadurch. Lighthouse ist nicht installiert; ich habe es lokal nachinstalliert. |
| 8 | `web-uni/SKILL.md` Z. 143 | Browser Chromium, Firefox, WebKit verlangt; in der Umgebung ist nur Chromium installiert. |
| 9 | `eingabe/fakten.md` Z. 55 und Teil 3 | Verweise auf `bilder/INVENTAR.md` und `luecken.md` (L1 bis L9), die nicht mitgeliefert sind. |
| 10 | `design-uni/referenzen/techniken.md` Z. 15 bis 20 gegen `SKILL.md` Z. 102 | Die Form «Zeichen» steht in SKILL.md unter System, die Tabelle der Techniken hat für ein Zeichen keine passende tragende Technik (T3/T4/T5/T10 sind Fakten, Linien, Etikett, Laufband). Ich habe T6 genommen und das begründet. |
| 11 | `design-uni/referenzen/abstand.md` Z. 24 und Z. 36, 63 | «hoch rechts» ist eine Klasse für den Bildschnitt, «Text links, Bild rechts» zugleich Modell-Standard; unklar, ob ein Hochformat rechts mit Titel links immer als «zwei Felder» zählt. |
| 12 | `nie-liste.md` Z. 39 gegen Kundenwunsch «auf jeder Seite ein CTA» | «doppelte Handlungen im selben Bildschirm» ist Nie-Voreinstellung; ein klebender Kopf mit Hauptaktion plus Held mit Hauptaktion verdoppelt sie auf der Startseite zwangsläufig. Kein Hinweis, wie das zu lösen ist. |
| 13 | `design-uni/werkzeuge/pruefen.cjs` Z. 137 ff. | Prüft nur ein Formular; die Tesla-Seite mit zweitem Formular blieb ungeprüft durch das Werkzeug (von mir mit `kunde.cjs` durchgespielt). |
| 14 | `pruefen.cjs` Z. 104 | «Hauptaktion fest sichtbar» scrollt immer auf 1200 px; bei kurzen Seiten (Impressum am Desktop) prüft das nur zufällig etwas. |
| 15 | `text-uni/SKILL.md` Z. 95 | T0 heisst «maschinell», es gibt aber kein Werkzeug dafür. |
| 16 | `design-uni/referenzen/conversion.md` Z. 125 gegen `text-uni/SKILL.md` Z. 255 | Prüfliste A Nr. 8 «Mehr Sie als wir» ist laut text-uni gestrichen (A13); die Prüfliste selbst ist nicht angepasst. |
| 17 | `design-uni/SKILL.md` Z. 113 | P1 verlangt Collagen «der letzten drei eigenen Websites» zum Mischen; ohne Vorgänger ist unklar, ob Modell-Standard-Bilder gebaut werden müssen. |
| 18 | `design-uni/referenzen/vorbilder-gemessen.md` Z. 53 bis 65 | Die durchgefallene «Probe (Carrosserie, 12 Seiten, hell)» ist offenbar ein früherer Bau desselben Betriebs; damit sieht jeder Lauf eine Bewertung eines Vorgängers. Für einen unabhängigen Lauf wäre das zu kennzeichnen (es hat meine Bildgrösse beeinflusst). |
| 19 | `design-uni/werkzeuge/vermessen.cjs` (Ausgabe) | Ein eingekreistes Wort als Hauptaktion zählt als 0 «knopfartige Elemente»; das Werkzeug sieht nur Flächen und Rahmen, nicht SVG-Kreise. Der Vorlagen-Wert «0 Knöpfe» ist damit leicht zu erreichen, ohne dass sich an der Bedienung etwas ändert. |
| 20 | `text-uni/SKILL.md` Schritt 1 Punkt 4, Schritt 2 | Suchbegriffe aus Autovervollständigung und Trefferseiten verlangen Netz; der Auftrag erlaubt Netz nur für Fakten über den Betrieb und Referenzmessungen. Ob SERP-Analysen darunter fallen, ist offen; ich habe sie weggelassen. |
