# Mutiger werden · Autospeedy C

Designer, 04.11.2026. Das ist nur ein Plan. Antwort auf Reshats iPhone-Test: Leistungen am Handy, Glascards, Formular-Text und «zu brav».

## Meine ehrliche Meinung
Reshat hat recht. Die Seite ist sauber, aber sie hat keinen Moment, der hängen bleibt: alles gleich gross, gleich hell, gleich ruhig. Mutig heisst für einen Carrosserie-Betrieb mit 10 Leuten nicht mehr Effekte. Es heisst **mehr Kontrast**: eine grosse Schrift, ein dunkler Abschnitt, Fotos, die man fühlt. Ruhe entsteht durch wenige Elemente, nicht durch kleine Elemente.

Was bleibt: Der blaue Haupt-CTA steht immer zuerst, der Weg zum Anrufen bleibt kurz, der Kontrast erfüllt AA, und es gibt keine Show-Animation.

## Glascards: ja, aber nur mit Bild dahinter
| Frage | Antwort |
|---|---|
| Passen sie zur Palette? | **Auf dem hellen Grund `#f4f4f2` nicht.** Glas braucht etwas Farbiges oder Unruhiges dahinter. Auf Hellgrau sieht es aus wie eine weisse Karte mit Unschärfe, also wie nichts, und es wirkt wie eine Vorlage von 2021. |
| Wo passen sie? | **Über einem Foto oder auf dem dunklen Grund `#1d1e20`.** Dort ist Glas echt: Man sieht das Foto durch und den Lack darin. Das passt zum Handwerk (Lack, Glanz, Folie). |
| Wie bleiben sie am Handy lesbar? | Das Glas ist nur ein **Etikett unten im Foto** (Titel und Pfeil), keine ganze Karte voll Text. Hintergrund `rgba(29,30,32,.62)` plus `backdrop-filter: blur(14px) saturate(1.2)`, Schrift weiss. Der Kontrast liegt auch bei hellem Foto über 4.5:1, weil die Abdunkelung allein schon reicht. Ohne `@supports (backdrop-filter)` kommt eine volle Fläche `rgba(29,30,32,.86)`. Dazu ein feiner Rand `1px rgba(255,255,255,.14)`, oben eine Lichtkante `inset 0 1px 0 rgba(255,255,255,.12)`. |
| Was passiert mit den Fotos dahinter? | Die Fotos müssen im unteren Drittel ruhig sein, also kein Schild und kein Logo dort. Das kommt als Regel ins Bilder-Set. Ein leichter Verlauf von unten (`linear-gradient(to top, rgba(0,0,0,.35), transparent 45%)`) gibt Sicherheit. |
| Tempo und Akku | 6 Blur-Flächen sind auf dem iPhone kein Problem. Kein Blur auf scrollenden Flächen, die grösser als die Karte sind. Kein Blur im Laufband. |

**Fazit:** Glascards als Foto-Karten mit Glas-Etikett, nicht als milchige Kästen auf Grau. Das löst gleichzeitig A1 (Karten am Handy kaputt).

## Drei Mut-Hebel mit je einem Vorschlag

### 1 · Hero: Schrift gross, Foto grösser
- **H1 deutlich grösser:** Desktop `clamp(3.4rem, 6.2vw, 6.4rem)`, Handy `2.9rem`, Zeilenabstand 0.98. Die zweite, kursive Zeile «die man sieht und fährt.» bleibt Tinte. Nur der Punkt am Ende wird Akzentblau (kleines Markenzeichen, 10 %).
- **Das Foto bricht aus dem Raster aus:** Desktop rechts bis an den Fensterrand (nur links gerundet). Höher als der Textblock, Schnitt eng auf Hand, Maschine und Lichtband. Es bleibt ein gerahmtes Foto, kein Vollbild-Hero.
- Am Handy: H1, Lead, CTA, dann das Foto **randlos über die volle Breite** in 4:5. Danach die Faktenleiste.
- **Motion:** Die H1 erscheint einmal beim Laden Zeile für Zeile (Maske, 8 px Weg, 500 ms, `cubic-bezier(.2,.8,.2,1)`, 80 ms Versatz). Bei reduzierter Bewegung steht sie sofort da.

### 2 · Leistungen: dunkler Abschnitt mit Foto-Glascards
- Der ganze Abschnitt wird **dunkel (`#1d1e20`)**. Das ist der eine starke Farbwechsel auf der Seite (60-30-10: die 30 % Tinte bekommen endlich eine Fläche). Die Tesla-Fläche danach wird dann hell, damit nicht zwei dunkle Blöcke aufeinander folgen.
- **Desktop:** Raster 3×2, Karten 4:5 hoch, Foto füllt die Karte, unten ein Glas-Etikett mit Titel (Serif, 1.5rem) und einem Kreis-Pfeil. Ein Satz Beschreibung erscheint bei Hover im Etikett (Höhe sanft, 280 ms). Bei Touch ist er immer sichtbar.
- **Handy:** **horizontal wischbare Reihe**, Karten 78 % breit, 4:5, `scroll-snap`, die nächste Karte schaut rechts sichtbar heraus. Darunter ein «1 / 6» und kleine Punkte. Titel und ein Satz stehen im Glas-Etikett. Das ersetzt die kaputte 88-px-Liste.
  - Alternative, falls Wischen zu versteckt ist: Karten untereinander in voller Breite 3:2, gleiches Glas-Etikett. **Ich empfehle das Wischen** (bekannt aus App Stores, spart Höhe), mit dem Hinweis «Wischen» beim ersten Laden als kurzer Ruck der Reihe um 24 px.
- **Motion:** Die Karten kommen beim Scrollen gestaffelt (Weg 16 px, 60 ms Versatz). Das Foto zoomt bei Hover langsam von 1.0 auf 1.04 (600 ms). Der Pfeil federt.
- Darunter bleiben auf dem dunklen Grund der blaue CTA «Schaden melden» und die Occasionen-Zeile.

### 3 · Formular: weniger Text, grössere Entscheidungen
- **Grosse Kacheln** für «Was ist passiert?» (Unfall, Hagel, Kratzer/Lack, Felge, Scheibe, Anderes), 2 Spalten am Handy, Icon plus ein Wort, gewählt mit blauem Rand und einem federnden Haken.
- **Fortschritt** oben als dünner blauer Balken, der weich wächst, plus «Schritt 2 von 3» in gross. Die Schrittzahl wird zur Zahl im Serif, 3rem.
- Der Sende-Schritt bekommt nur noch zwei Knöpfe und einen Satz (Wortlaut unten). Erklärungen über Vorschau und Lücken kommen **raus aus der Ansicht des Besuchers**.

### Was wir bewusst nicht machen
- Kein Vollbild-Video, kein Parallax-Gewitter, keine Cursor-Effekte, kein Neon und keine Verläufe als Hintergrund.
- Kein Glas auf hellem Grund, keine zweite Akzentfarbe.

## Formular · Schritt «Senden» · exakter Wortlaut
Titel:
> **Meldung senden**

Knopf 1 (blau, gefüllt):
> **Jetzt senden**
> *klein:* Mit Ihren Fotos.

Knopf 2 (hell):
> **Lieber per WhatsApp**
> *klein:* Fotos hängen Sie im Chat an.

Satz darunter (klein):
> Ihre Angaben verwenden wir nur für diese Meldung. Verantwortlich: Auto Speedy AG.

Was wegfällt oder verschoben wird:
- Die Lücke-Box zur WhatsApp-Nummer wird im Formular nicht mehr gezeigt. Sie geht in die Liste offener Fragen an den Betrieb (`WEG-ZU-10.md`). **Live** erscheint der WhatsApp-Knopf erst, wenn die Nummer bestätigt ist, wie schon im Footer.
- Den Hilfetext «In der Vorschau nur vorgeführt …» unter Knopf 1 streichen. Der Vorschau-Hinweis steht nur noch **nach** dem Klick in der Bestätigung (gibt es schon).
- Der Satz auf der Bestätigung bleibt kurz: «Vorschau: Auf der fertigen Website käme die Meldung jetzt mit 2 Fotos bei Auto Speedy an.» Ohne den zweiten Satz.

## Reihenfolge für den Claude-Lauf
1. Leistungen dunkel mit Foto-Glascards (Desktop-Raster, Handy wischen). Das ersetzt den A1-Fix.
2. Formular-Text wie oben.
3. Fixes B3–B6 und C8 aus dem Review.
4. Hero-Typo und Hero-Foto.
5. Formular-Kacheln und Fortschritt.
6. Screenshots bei 360/390/430/1440 plus ein kurzes Handy-Video vom Leistungen-Wischen und vom Formular. Ich prüfe danach.

Alles mit eigenem CSS, ohne Motion+, ohne neue Bibliothek, kein Inline-JS (CSP). Bei `prefers-reduced-motion` stehen alle Bewegungen still.
