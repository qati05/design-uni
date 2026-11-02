# Bewegung

> Eigene, geprüfte Umsetzungen der erlaubten Bewegungen: [../galerie/index.html](../galerie/index.html) · Einordnung der Baukästen: [bausteine.md](bausteine.md)
> **Besitz:** design-uni entscheidet, **ob** und **welche** Bewegung es gibt, und setzt den Boden und die Richtwerte für Dauer und Pause (Teil 2). **Womit** sie gebaut wird und was sie kostet (Bibliothek, Gewicht, Ladezeit), entscheidet web-uni in WP3 ([zusammenspiel.md](zusammenspiel.md) Teil 2).

> **Quellen:** NN/g «Executing UX Animations: Duration and Motion Characteristics» und «Scrolljacking 101»; Emil Kowalski, «Great animations»; web.dev «How to create high-performance CSS animations»; MDN View Transition API und scroll-driven animations; Chrome for Developers «Cross-document view transitions»; W3C WCAG 2.2.2, 2.3.1, 2.3.3; GSAP-Doku (Eases, ScrollTrigger, matchMedia); Awwwards Sites of the Year; WebKit-Bug 219889 (Autoplay im Stromsparmodus). Eigene Bildfolgen mit Playwright.

## 1. Was der blinde Test zeigte

Sieben Entwürfe, je statisch und bewegt, als Bildfolgen; sechs Bewerter auf zwei Modellen. **Modell-Urteil, keine Menschen-Daten.** Die Regel «keine oder eine Bewegung», die daraus abgeleitet war, ist seit 02.11.2026 aufgehoben (Entscheid 12); die Beobachtungen bleiben als Hinweis.

| Bewegung | statisch → bewegt | trägt / neutral / stört |
|---|---|---|
| Hobel-Clip einmal, aus der Werkstatt | 7,00 → 8,00 (+1,0) | 6 / 0 / 0 |
| Schnur zieht sich unter das Wort «gebunden» | 6,67 → 7,83 (+1,17) | 6 / 0 / 0 |
| Zoom durchs Fenster beim Scrollen | 7,00 → 7,67 (+0,67), aber gespalten (8,7 gegen 6,7) | 4 / 0 / 2 |
| Linie zieht sich, Datum erscheint | 7,00 → 7,00 | 1 / 5 / 0 |
| Bild gleitet wie eine Schublade | 7,00 → 6,83 | 0 / 6 / 0 |
| Titel entspannt sich in der Breite | 6,50 → 6,50 | 0 / 5 / 1 |
| Schatten wächst beim Scrollen (starkes Plakat) | 7,50 → 7,17 (−0,33) | 4 / 0 / 2 |

1. **Nur echte Bewegung lohnt sich:** Werkzeug, Material, Handgriff aus dem Betrieb, rund ein ganzer Punkt, einstimmig.
2. **Allgemeine Bewegung bringt nichts** (Hereingleiten, Laufweite, gezogene Linie): «bekannter Kniff», «Vorlagen-Reveal», «wirkt wie Ladebalken».
3. **Bewegung kann ein starkes Bild schwächen.** Ein starkes statisches Plakat nicht nachträglich animieren.
4. **Inhalt nie zurückhalten.** Die Idee des Zooms wurde gelobt, aber Öffnungszeiten und Anschrift kamen erst nach drei Bildschirmen.
5. **Steuerbarkeit zählt.** Pause-Knopf und «Bewegung reduzieren» wurden ausdrücklich positiv genannt.

**Regel seit 02.11.2026 (Entscheid 12, [zusammenspiel.md](zusammenspiel.md)):** Es gibt **keine Mengenregel**. Bewegung gibt es so viel, wie die Idee des Betriebs oder der Wunsch des Kunden braucht. Es gilt nur der Boden in Teil 2. Ob eine Bewegung wirkt, zeigt der Bildtest als Vorfilter (DP5) und ein Test mit Menschen ([blindtest.md](blindtest.md) Teil 6). Ein Entscheid des Betriebs «statisch» geht vor.

## 2. Boden und Hinweise

**Boden (sperrt).** Nur diese Punkte sind Regel, weil sie Barrierefreiheit oder eine Entscheidung des Betriebs schützen (Entscheid 12 und 13):

| Boden | Prüfung | Herkunft |
|---|---|---|
| `prefers-reduced-motion` wird respektiert: eine eigene ruhige Fassung ohne Wege, Parallaxe, Zoom, Schwenks; Video wird Poster, Sequenz wird Schlüsselbild | unter Reduced Motion laufen 0 Animationen, die Summe der Wege ist 0 px (DP5) | WCAG 2.3.3 |
| Aller Inhalt ist ohne Bewegung und ohne JavaScript erreichbar; Ausgangszustände setzt erst das Skript | JS aus: aller Inhalt sichtbar (DP5, DP6) | WCAG; Entscheid 12 |
| Keine Bewegung hält Inhalt zurück: kein Ladebildschirm, kein Tor, kein Inhalt erst nach mehreren Bildschirmen | Titel und Fakten des ersten Bildschirms nach ≤ 1,0 s lesbar `[Annahme]` | Entscheid 12 |
| Was länger als **5 s** von selbst läuft (Video-Schleife, Laufband, Szene), lässt sich pausieren | läuft nach 5 s noch etwas, gibt es einen Pause-Knopf (DP5) | WCAG 2.2.2 |
| Höchstens 3 Blitze pro Sekunde | von Auge an der Bildfolge | WCAG 2.3.1 |
| Die Kosten stehen im Kostenblatt | Kostenblatt liegt vor | web-uni WP3 |

**Hinweise (sperren nichts).** Richtwerte aus Fachquellen und Modell-Urteilen. Wer abweicht, nennt den Grund im Bericht.

| Was | Richtwert | Herkunft |
|---|---|---|
| Rückmeldung auf Tipp, Hover, Druck | 100 bis 200 ms | NN/g: Rückmeldung um 100 ms; Kowalski |
| Interface-Übergang (Menü, Dialog, Akkordeon, Seitenwechsel) | 200 bis 300 ms; hinein etwas langsamer als hinaus | NN/g: Dialog 200 bis 300 ms, ab 500 ms «a real drag» |
| Ein inszenierter Moment (Titel aus der Maske, Strich, Fallblatt) | fertig nach etwa 1 s | `[Annahme]` |
| Versatz zwischen Gliedern (Stagger) | 40 bis 80 ms, höchstens 5 bis 6 Glieder | `[Annahme]` |
| An den Scrollweg gekoppelt | folgt dem Scrollen; Glättung 0,3 bis 1 s | GSAP-Doku |
| Schnitt im Hintergrundvideo | nicht unter rund 3 s je Einstellung | `[Annahme]` |

Damit gelten die früheren Grenzen nicht mehr: «keine oder eine Bewegung», «nach 3 s läuft nichts mehr», «glättendes Scrollen standardmässig aus», «höchstens ein gepinnter Abschnitt», Interface «nie über 400 ms», ein Moment «bis etwa 1,2 s». Die Zeit vom Absenden bis zur Bestätigung ist keine Bewegung; sie steht in DP6.

**Grundsätze als Hinweise**
- **DGB1 · Bewegung hat eine Aufgabe:** Rückmeldung, Herkunft, Orientierung, Betonung, Stimmung oder der Wunsch des Kunden.
- **DGB2 · Interface kurz.** Dauer nach den Richtwerten; ab 500 ms wirkt Interface-Bewegung zäh (NN/g: «a real drag»).
- **DGB3 · Hinein langsamer als hinaus** (etwa 300 ms hinein, 200 bis 250 ms hinaus).
- **DGB4 · Ease-out als Standard,** hinaus ease-in, nie linear für Raumbewegung; linear nur bei Kopplung an den Scrollbalken. Stärkere Abbremsung z. B. `cubic-bezier(0.05, 0.7, 0.1, 1)`.
- **DGB5 · Je häufiger, desto leiser.** Hover und Druck am kurzen Ende; Tastatur-Aktionen nicht animieren.
- **DGB6 · Unterbrechbar.** Interaktion lässt sich jederzeit umkehren. Prüfung: dreimal schnell über den Knopf, kein Springen.
- **DGB7 · Nur `transform` und `opacity`** (und Farbe) animieren, wo es geht. `top`/`left` liess im web.dev-Versuch 50 % der Bilder fallen, `transform` 1 %. Die Messung gehört web-uni.
- **DGB8 · Kleine Wege:** 12 bis 24 px beim Einblenden, mobil die Hälfte `[Annahme]`.
- **DGB9 · Ein Moment trägt mehr als viele gleiche.** Wo es viele Bewegungen gibt, ist eine davon die Hauptsache.
- **DGB10 · Der Inhalt ist sofort da** (Boden).
- **DGB11 · Scrollen gehört dem Besucher, wo gelesen wird.** Verändertes Tempo, gepinnte Strecken und glättendes Scrollen sind erlaubt, wenn die Idee oder der Wunsch sie braucht; der Text bleibt lesbar, und unter Reduced Motion fällt es weg.
- **DGB12 · Reduced Motion ist eine eigene Fassung** (Boden).
- **DGB13 · Was von selbst läuft, lässt sich anhalten** (Boden: ab 5 s).
- **DGB14 · Ohne JavaScript ist alles sichtbar** (Boden).
- **DGB15 · Bewegung stammt aus dem Betrieb:** eine Unterschrift zeichnen, ein Name, der sich füllt, ein Strich, der den Grundriss zieht.

**Video und filmische Momente**
- Das Standbild trägt allein: Auf iOS im Stromsparmodus startet kein Autoplay. Das Poster ist gestaltet wie ein Bild der Seite; wie es geladen wird, regelt web-uni.
- Hintergrundvideo kurz, stumm, `playsinline`, eigener Handy-Schnitt, Pause-Knopf. Schnitte nach der Tabelle. Ton nur auf Knopfdruck.
- Scroll-Erzählung als Bildsequenz, nicht als Video-Scrubbing: 60 bis 120 Bilder Desktop, die Hälfte mobil. Eine Szene 100 bis 250 vh Scrollweg `[Annahme]`. Gewicht und Technik: Budgets in web-uni (WP5).
- WebGL und 3D, wenn die Idee oder der Wunsch es braucht; oft ersetzt eine fotografierte Drehsequenz (36 bis 72 Bilder) es mit weniger Kosten (Kostenblatt: web-uni WP3).

## 3. Spitzenniveau, solide, Effekthascherei (Hinweis, aus Quellen und Modell-Urteilen)

| | Effekthascherei | Solide | Spitzenniveau |
|---|---|---|---|
| Anzahl | alles bewegt sich ohne Grund | jeder Abschnitt gleich (fade-up) | so viel, wie die Idee braucht; eine Hauptsache, die man nacherzählen kann |
| Herkunft | Bibliothekseffekt (Partikel, Glitch) | neutral, austauschbar | aus Marke oder Material |
| Kurve | Federn überall oder linear | ease-in-out überall | starke Abbremsung; zwei bis drei Kurven als System |
| Dauer | Sekunden für Interface | 300–600 ms für alles | kurzes Interface, ein Moment um 1 s (Richtwerte in Teil 2) |
| Typografie | Buchstaben fliegen | Zeile blendet ein | Zeilen steigen aus einer Maske, immer lesbar |
| Handy | gekürzt, ruckelt | aus | eigens gewichtet, gleiche Idee |
| Barrierefreiheit | Reduced Motion fehlt | schaltet hart ab | eigene ruhige Fassung |

Der sichtbare Unterschied in den Bewerter-Tests: **Spitzenseiten haben eine Bewegung, die man nacherzählen kann.** Das ist ein Modell-Urteil, keine Mengenregel (Entscheid 12).

## 4. Öffentliche Referenzen

- **Lando Norris** (OFF+BRAND, Awwwards Site of the Year 2025): Unterschrift zeichnet sich Strich für Strich, an den Scrollweg gekoppelt; eine Farbe trägt Ladebild, Akzentwörter, Knopf. Für kleine Betriebe zu schwer (Ladebild, WebGL), aber die Logik «Bewegung aus der Person» ist übertragbar.
- **UND NY** (Awwwards SOTD 2024, Bäckerei): Zwischen «UN» und «D» schieben sich beim Scrollen Wörter ein; der Name in Bewegung ist die Signatur. Abzug: Intro, kein Reduced Motion gefunden.
- **Pangram Pangram:** kein Intro; Schriftkarten stapeln sich beim Scrollen (Stapel = Sammlung).
- **Muster:** Fünf von sechs erfassten Jahressiegern starten mit Ladebild, Zähler oder Tor. Das ist Galerie-Logik, nicht die Logik eines Besuchers, der einen Termin will.

## 5. Muster und Technik

**Womit** eine Bewegung gebaut wird (CSS-Übergänge, an den Scrollweg gekoppelte CSS-Animation, View Transitions, eine Bibliothek, 3D), welche Stufe erlaubt ist und was sie kostet, entscheidet web-uni in WP3 ([../../web-uni/referenzen/animation-3d.md](../../web-uni/referenzen/animation-3d.md)). Hier steht nur, **wie** die erlaubten Muster aussehen und sich verhalten:

1. **Dauer und Kurve als Tokens** mit Namen aus dem Betrieb, Werte nach den Richtwerten in Teil 2. Druck: leichte Skalierung.
2. **Ohne Unterstützung steht der Inhalt fertig da.** Jede Bewegung ist eine Zugabe; der Ausgangszustand ohne sie ist die lesbare Seite.
3. **Seitenübergang:** ein benanntes Element wandert; unter Reduced Motion nur Überblendung.
4. **Choreografie** mit eigenen Fassungen für Desktop, Handy und Reduced Motion; gepinnte Abschnitte und glättendes Scrollen nur, wenn die Idee oder der Wunsch sie braucht.
5. **Muster «Zeile aus der Maske»:** Titel in Zeilen, Start unterhalb der Maske, Dauer und Stagger nach den Richtwerten; Bildschirmleser lesen den ungeteilten Text.
6. **Muster «Strich zeichnet sich»:** ein Pfad, an den Scrollweg gekoppelt (Grundriss, Naht, Schnitt).
7. Hover-Effekte nur auf Geräten mit Maus; der erste Bildschirm passt sich der sichtbaren Höhe des Handys an.

**Typische Fehler** (Hinweis; Ladebildschirm, Laufband ohne Pause und fehlendes Reduced Motion verletzen den Boden): Ladebildschirm, Zähler 000–100; Partikel, Cursor-Kreis, magnetische Knöpfe; Laufband ohne Pause; Animationen bei jedem Hoch- und Runterscrollen; Einblendungen so spät, dass man auf leere Flächen scrollt; Karten heben sich beim Hover mit Schatten; Bilder zoomen auf 105–110 %; Reduced Motion lässt Inhalt unsichtbar.

## 6. Bewegung blind prüfbar machen

**Ebene A · Bildfolgen.** Playwright, 1440 × 900 und 390 × 844. Ladephase alle 100 ms von 0 bis 2 s mit fester Uhr (`page.clock` oder `document.getAnimations()` anhalten), Scrollphase 6 Schritte zu je 60 % Bildschirmhöhe, je ein Bild sofort und nach 400 ms. Als Kontaktbogen mit Zeitstempeln.

**Ebene B · Videos.** `recordVideo` mit 25 Bildern/s, je 8 s: 2 s Laden, 4 s Scrollen in festem Tempo, 2 s Hover und Klick. Je Entwurf drei: Desktop, Handy, Reduced Motion (`page.emulateMedia({ reducedMotion: 'reduce' })`). Gemischt mit Referenz-Videos.

**Ebene C · Messwerte (maschinell).**
- Zeit bis Titel und Fakten lesbar: ≤ 1,0 s (Boden «hält nichts zurück»).
- Was nach 5 s noch läuft (`document.getAnimations()` plus Bibliothek): nur mit Pause-Knopf (Boden).
- Animierte Eigenschaften (Hinweis): möglichst `transform`, `opacity`, Farbe.
- Ruckeln und Verschiebung während der Einblendungen (lange Animationsbilder, CLS): Messung in web-uni (WP5).
- Reduced Motion: Summe der Transform-Wege 0 px.
- JavaScript aus: aller Inhalt sichtbar.

**Bewertungsfragen** (je Folge oder Video, dazu Note 1–10, Klasse, «trägt / neutral / stört»):
1. Kann ich die wichtigste Bewegung in einem Satz nacherzählen?
2. Passt sie zum Betrieb, oder könnte sie überall stehen?
3. Stand der Inhalt sofort da?
4. Wirkte sie entschieden oder weich und zögernd?
5. Hat sich etwas bewegt, ohne dass ich es brauchte?
6. Hat etwas geruckelt?
7. Erzählt die ruhige Fassung dasselbe?
8. Erinnert sie an andere Entwürfe dieser Reihe?

**Grenze:** Bildfolgen zeigen keine Bewegung nach einer Handlung (z. B. beim Absenden) und kein Gefühl am eigenen Daumen. Beides eigens aufnehmen und auf echten Geräten ansehen, auch iPhone im Stromsparmodus; was dort nicht lief, steht als «nicht geprüft».

## 7. Je Branche (Hinweis) `[Annahme]`

| Branche | Regler still–bewegt | Ein möglicher Hauptmoment | Eher nicht |
|---|---|---|---|
| Handwerk, Bau, Auto | 2 von 5 | Strich oder Schnitt zeichnet sich (Grundriss, Naht); Vorher/Nachher per Tippen | Ladebildschirm, Parallaxe über Baustellenfotos |
| Gesundheit, Beauty | 1 von 5 | Titel steigt einmal aus der Maske, danach Ruhe | Intro-Paneele, atmende Blobs, Zoom auf Menschen |
| Gastro, Hotel | 4 von 5 | Stimmung: Dampf, Einschenken, Feuer; Hero-Loop mit Pause | Spruch-Loader, Tor vor der Karte |
| Beratung, Recht, Finanzen | 1 von 5 | Seitenübergang von Team zu Person, sonst nichts | Zähler, Logo-Laufband |
| Handel, Manufaktur | 3 von 5 | Produkt in Herstellung oder Gebrauch, scroll-gekoppelt | Slider mit Autoplay, 3D ohne Grund |
