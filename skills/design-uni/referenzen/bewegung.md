# Bewegung

> Eigene, geprüfte Umsetzungen der erlaubten Bewegungen: [../galerie/index.html](../galerie/index.html) · Einordnung der Baukästen: [bausteine.md](bausteine.md)

> **Quellen:** NN/g «Executing UX Animations: Duration and Motion Characteristics» und «Scrolljacking 101»; Emil Kowalski, «Great animations»; web.dev «How to create high-performance CSS animations»; MDN View Transition API und scroll-driven animations; Chrome for Developers «Cross-document view transitions»; W3C WCAG 2.2.2, 2.3.1, 2.3.3; GSAP-Doku (Eases, ScrollTrigger, matchMedia); Awwwards Sites of the Year; WebKit-Bug 219889 (Autoplay im Stromsparmodus). Eigene Bildfolgen mit Playwright.

## 1. Was der blinde Test zeigte

Sieben Entwürfe, je statisch und bewegt, als Bildfolgen; sechs Bewerter auf zwei Modellen:

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

**Regel:** keine oder eine Bewegung pro Website; nur wenn sie etwas Echtes zeigt; in unter 1 s fertig oder steuerbar; nie Inhalt verzögernd. Sonst statisch. Ein Entscheid des Auftraggebers «statisch» geht vor.

## 2. Grundsätze

- **DGB1 · Bewegung hat eine Aufgabe:** Rückmeldung, Herkunft, Orientierung oder Betonung. Sonst fliegt sie raus.
- **DGB2 · Kurz.** Interface 100–500 ms; Rückmeldung ~100 ms, Dialog 200–300 ms; ab 500 ms «a real drag» (NN/g). Keine Interface-Dauer über 400 ms.
- **DGB3 · Hinein langsamer als hinaus** (~300 ms / 200–250 ms).
- **DGB4 · Ease-out als Standard,** hinaus ease-in, nie linear für Raumbewegung; linear nur bei Kopplung an den Scrollbalken. Stärkere Abbremsung z. B. `cubic-bezier(0.05, 0.7, 0.1, 1)`.
- **DGB5 · Je häufiger, desto leiser.** Hover und Druck 120–200 ms; Tastatur-Aktionen nie animieren.
- **DGB6 · Unterbrechbar.** CSS-Transitions statt Keyframes für Interaktion. Prüfung: dreimal schnell über den Knopf, kein Springen.
- **DGB7 · Nur `transform` und `opacity`** (und Farbe). `top`/`left` liess im web.dev-Versuch 50 % der Bilder fallen, `transform` 1 %.
- **DGB8 · Kleine Wege:** 12–24 px beim Einblenden, mobil die Hälfte; Stagger 40–80 ms, höchstens 5–6 Glieder `[Annahme]`.
- **DGB9 · Ein inszenierter Moment pro Seite,** bis etwa 1,2 s; alles andere unter DGB2.
- **DGB10 · Der Inhalt ist sofort da.** Kein Ladebildschirm, kein Zähler, kein Tor. Was einfährt, ist nach spätestens 1 s lesbar.
- **DGB11 · Scrollen gehört dem Besucher.** Kein verändertes Tempo oder Richtung, wo gelesen wird; höchstens ein gepinnter Abschnitt, etwa eine Bildschirmhöhe zusätzlich. Glättendes Scrollen standardmässig aus.
- **DGB12 · Reduced Motion ist eine eigene Fassung:** keine Wege, Parallaxe, Zoom, Schwenks; Deckkraft kurz erlaubt. Video → Poster, Sequenz → Schlüsselbild.
- **DGB13 · Was von selbst läuft, lässt sich anhalten:** über 5 s automatisch → Pause (WCAG 2.2.2). Nie mehr als drei Blitze pro Sekunde.
- **DGB14 · Ohne JavaScript ist alles sichtbar.** Ausgangszustände setzt erst das Skript.
- **DGB15 · Bewegung stammt aus dem Betrieb:** eine Unterschrift zeichnen, ein Name, der sich füllt, ein Strich, der den Grundriss zieht.

**Video und filmische Momente**
- Das Standbild trägt allein: Auf iOS im Stromsparmodus startet kein Autoplay. Poster ist das LCP-Element, mit `<link rel="preload" fetchpriority="high">`.
- Hintergrundvideo kurz, stumm, `playsinline`, eigener Handy-Schnitt, Pause-Knopf. Schnitte nicht unter rund 3 s. Ton nur auf Knopfdruck.
- Scroll-Erzählung als Bildsequenz auf `<canvas>`, nicht als Video-Scrubbing: 60–120 Bilder Desktop, die Hälfte mobil, ≤ 3 MB mobil `[Annahme]`. Eine Szene 100–250 vh Scrollweg.
- WebGL und 3D nur, wenn das Objekt der Inhalt ist; eine fotografierte Drehsequenz (36–72 Bilder) ersetzt es meist.

## 3. Spitzenniveau, solide, Effekthascherei

| | Effekthascherei | Solide | Spitzenniveau |
|---|---|---|---|
| Anzahl | alles bewegt sich | jeder Abschnitt gleich (fade-up) | fast nichts, eine Stelle sehr gut |
| Herkunft | Bibliothekseffekt (Partikel, Glitch) | neutral, austauschbar | aus Marke oder Material |
| Kurve | Federn überall oder linear | ease-in-out überall | starke Abbremsung; zwei bis drei Kurven als System |
| Dauer | Sekunden für Interface | 300–600 ms für alles | 150–300 ms Interface, ein Moment bis gut 1 s |
| Typografie | Buchstaben fliegen | Zeile blendet ein | Zeilen steigen aus einer Maske, immer lesbar |
| Handy | gekürzt, ruckelt | aus | eigens gewichtet, gleiche Idee |
| Barrierefreiheit | Reduced Motion fehlt | schaltet hart ab | eigene ruhige Fassung |

Der sichtbare Unterschied: **Spitzenseiten haben eine Bewegung, die man nacherzählen kann.**

## 4. Öffentliche Referenzen

- **Lando Norris** (OFF+BRAND, Awwwards Site of the Year 2025): Unterschrift zeichnet sich Strich für Strich, an den Scrollweg gekoppelt; eine Farbe trägt Ladebild, Akzentwörter, Knopf. Für kleine Betriebe zu schwer (Ladebild, WebGL), aber die Logik «Bewegung aus der Person» ist übertragbar.
- **UND NY** (Awwwards SOTD 2024, Bäckerei): Zwischen «UN» und «D» schieben sich beim Scrollen Wörter ein; der Name in Bewegung ist die Signatur. Abzug: Intro, kein Reduced Motion gefunden.
- **Pangram Pangram:** kein Intro; Schriftkarten stapeln sich beim Scrollen (Stapel = Sammlung).
- **Muster:** Fünf von sechs erfassten Jahressiegern starten mit Ladebild, Zähler oder Tor. Das ist Galerie-Logik, nicht die Logik eines Besuchers, der einen Termin will.

## 5. Technik für statisches HTML, CSS, JS

1. **CSS-Transitions** für Hover, Fokus, Druck, Menü. Dauer und Kurve als Tokens (`--t-schnell: 150ms`, `--k-aus: cubic-bezier(.2,.8,.2,1)`). Druck: `:active` mit leichter Skalierung.
2. **CSS scroll-driven animations** (`animation-timeline: view()`), immer in `@supports` gekapselt; ohne Unterstützung steht der Inhalt fertig da.
3. **View Transitions** zwischen Seiten (`@view-transition { navigation: auto; }`), 200–400 ms, ein benanntes Element wandert; unter Reduced Motion nur Überblendung.
4. **GSAP lokal** nur für Choreografie, Scrub mit Glättung (0,3–1 s), einen gepinnten Abschnitt; Einstieg über `gsap.matchMedia()` mit Desktop, Handy, Reduced Motion.
5. **Muster «Zeile aus der Maske»:** Titel in Zeilen, `overflow: clip`, Start `translateY(100%)`, 600–800 ms, Stagger 60–80 ms; Bildschirmleser lesen den ungeteilten Text. Nur für den einen Hero-Titel.
6. **Muster «Strich zeichnet sich»:** SVG-Pfad, `stroke-dashoffset` an den Scrollweg gekoppelt (Grundriss, Naht, Schnitt).
7. Hover-Effekte nur unter `@media (hover: hover) and (pointer: fine)`; Hero mit `svh`/`dvh`.

**Typische Fehler:** Ladebildschirm, Zähler 000–100; Partikel, Cursor-Kreis, magnetische Knöpfe; Laufband ohne Pause; Animationen bei jedem Hoch- und Runterscrollen; Einblendungen so spät, dass man auf leere Flächen scrollt; Karten heben sich beim Hover mit Schatten; Bilder zoomen auf 105–110 %; Reduced Motion lässt Inhalt unsichtbar.

## 6. Bewegung blind prüfbar machen

**Ebene A · Bildfolgen.** Playwright, 1440 × 900 und 390 × 844. Ladephase alle 100 ms von 0 bis 2 s mit fester Uhr (`page.clock` oder `document.getAnimations()` anhalten), Scrollphase 6 Schritte zu je 60 % Bildschirmhöhe, je ein Bild sofort und nach 400 ms. Als Kontaktbogen mit Zeitstempeln.

**Ebene B · Videos.** `recordVideo` mit 25 Bildern/s, je 8 s: 2 s Laden, 4 s Scrollen in festem Tempo, 2 s Hover und Klick. Je Entwurf drei: Desktop, Handy, Reduced Motion (`page.emulateMedia({ reducedMotion: 'reduce' })`). Gemischt mit Referenz-Videos.

**Ebene C · Messwerte (maschinell).**
- Zeit bis Titel lesbar ≤ 1,0 s.
- Laufende Animationen nach 3 s (`document.getAnimations().length` plus GSAP): 0, ausser mit Pause-Knopf.
- Animierte Eigenschaften nur `transform`, `opacity`, Farbe.
- Lange Animationsbilder im Leistungsmitschnitt mit 4-facher CPU-Drosselung.
- CLS während der Einblendungen.
- Reduced Motion: Summe der Transform-Wege 0 px.
- JavaScript aus: aller Inhalt sichtbar.

**Bewertungsfragen** (je Folge oder Video, dazu Note 1–10, Klasse, «trägt / neutral / stört»):
1. Kann ich die eine Bewegung in einem Satz nacherzählen?
2. Passt sie zum Betrieb, oder könnte sie überall stehen?
3. Stand der Inhalt sofort da?
4. Wirkte sie entschieden oder weich und zögernd?
5. Hat sich etwas bewegt, ohne dass ich es brauchte?
6. Hat etwas geruckelt?
7. Erzählt die ruhige Fassung dasselbe?
8. Erinnert sie an andere Entwürfe dieser Reihe?

**Grenze:** Bildfolgen zeigen keine Bewegung nach einer Handlung (z. B. beim Absenden) und kein Gefühl am eigenen Daumen. Beides eigens aufnehmen und auf echten Geräten ansehen, auch iPhone im Stromsparmodus; was dort nicht lief, steht als «nicht geprüft».

## 7. Je Branche `[Annahme]`

| Branche | Regler still–bewegt | Der eine Moment | Nie |
|---|---|---|---|
| Handwerk, Bau, Auto | 2 von 5 | Strich oder Schnitt zeichnet sich (Grundriss, Naht); Vorher/Nachher per Tippen | Ladebildschirm, Parallaxe über Baustellenfotos |
| Gesundheit, Beauty | 1 von 5 | Titel steigt einmal aus der Maske, danach Ruhe | Intro-Paneele, atmende Blobs, Zoom auf Menschen |
| Gastro, Hotel | 4 von 5 | Stimmung: Dampf, Einschenken, Feuer; Hero-Loop mit Pause | Spruch-Loader, Tor vor der Karte |
| Beratung, Recht, Finanzen | 1 von 5 | Seitenübergang von Team zu Person, sonst nichts | Zähler, Logo-Laufband |
| Handel, Manufaktur | 3 von 5 | Produkt in Herstellung oder Gebrauch, scroll-gekoppelt | Slider mit Autoplay, 3D ohne Grund |
