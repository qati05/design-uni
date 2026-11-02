---
name: web-uni
description: Verfahren, um für eine Website-Aufgabe den besten technischen Weg zu wählen, zu bauen und live zu bringen, statt den einfachsten oder den modischsten: Stack und Hoster (statisch, Astro, Next.js, Baukasten), Bewegungstechnik und 3D mit Kostenblatt, Budgets für Ladezeit, JS und Bilder, ein Prüflauf für alle maschinellen Prüfungen, Formular-Backend, Datenschutz-Technik, Hosting, Livegang, Pflege und Übergabe. Nutzen, wenn eine Website gebaut, umgebaut, technisch beurteilt oder veröffentlicht werden soll; wenn Stack, Animation oder 3D zu entscheiden sind; wenn ein Kunde «etwas Besonderes» will; wenn gemessen werden soll, ob sich eine Technik lohnt. Arbeitet mit design-uni (Gestaltung) und text-uni (Text und Suche). Jede Aussage trägt ein Kennzeichen, ob sie gebaut und gemessen, gelesen oder angenommen ist.
---

# Web-Uni: Den besten Weg bauen, nicht den einfachsten

`design-uni` entscheidet, **wie es aussieht**, `text-uni`, **was dasteht**, `web-uni`, **womit es gebaut wird, was es kostet und wie es live geht**. Der Wunsch des Betriebs gibt das Ziel vor; der Stack ist das Mittel. Gewählt wird, was den Wunsch am besten erfüllt, solange der Betrieb es tragen kann (Pflege, Kosten, Geschwindigkeit): weder die einfachste Technik, nur weil sie einfach ist, noch die auffälligste, nur weil sie möglich ist.

Merksatz: *Technik ist gut, wenn der Besucher sie nicht bemerkt, ausser sie ist der Grund, warum er bleibt.*

## Zusammenspiel

Die verbindlichen Regeln für alle drei Skills stehen in [zusammenspiel.md](../design-uni/referenzen/zusammenspiel.md): Rangfolge, Besitzer je Thema, Entscheide, eine Schwelle je Sache, Kennungen, gemeinsame Abfolge.

- **web-uni besitzt:** Stack, Hoster, Domain, HTTPS, Sicherheit, Sicherungen; Budgets (Ladezeit, Core Web Vitals, JS, Bilder) und die Lighthouse-Schwelle; fremde Hosts, Cookies, DSG-Technik; Formular-Backend, Spamschutz, Zählendpunkt; die Testumgebung für den einen Prüflauf; Livegang, Pflege, Zugänge, Übergabe; Kosten an den Kunden (nur als Entwurf).
- **web-uni verweist auf design-uni** für Eingabe und `entscheide.md`, Gestaltung, Barrierefreiheit mit Schwellen, Bewegung (ob und welche), Bewerter und Menschentests, `LIESMICH.md`.
- **web-uni verweist auf text-uni** für Fakten, jeden Wortlaut, Recht für Inhalte, Regeln für `robots.txt`, Sitemap, `canonical`, Weiterleitungen und Umzug (TI1 bis TI30, S28), Messplan.
- **Kennungen:** Prüfpunkte WP0 bis WP9, Lektionen WL. Fremde Kennungen immer voll: DP, DL, TK, LA, LP, LH (design-uni); TP und die Grundsätze von text-uni (TI, S, M, U, CL …).

## Wie man diese Datei liest

- Die Schritte folgen der gemeinsamen Abfolge (zusammenspiel Teil 6) und enden je mit einem **Prüfpunkt WP**. Fällt ein Prüfpunkt, geht es zum Schritt zurück, der das fehlende Ergebnis liefert, auch in einem anderen Skill.
- **Kennzeichen** an jeder Aussage in `referenzen/`:

| Kennzeichen | Bedeutung |
|---|---|
| `[gebaut und gemessen · Datum]` | in diesem Repo gebaut und mit einem Werkzeug gemessen; die Zahl steht mit Befehl in [messungen.md](referenzen/messungen.md) |
| `[gelesen · Quelle, Datum]` | in der genannten Quelle gelesen, nicht selbst gebaut |
| `[Annahme]` | eigene Ableitung oder Arbeitsgrenze, ungeprüft |
| `[nicht gebaut]` | genannt, aber hier noch nie gebaut; kein Urteil erlaubt |

- **Versionen veralten schnell.** Vor jedem Bau die Versionen in `package.json` lesen und die Dokumentation genau dieser Version. Die Tabelle in [stacks.md](referenzen/stacks.md) ist ein Stand vom 1. November 2026.
- **Urteile über Wirkung** (gefällt, Vertrauen, «würde anfragen») aus Bewerter-Läufen mit Sprachmodellen heissen «**Modell-Urteil bestanden**», nicht «belegt» (zusammenspiel Entscheid 1). Belegt ist eine Wirkung erst durch Menschen (WP6) oder durch Zahlen nach dem Livegang. Urteile über Geschwindigkeit und Zugänglichkeit kommen aus Messungen.

## Grundregeln

1. **Rangfolge statt Bauchgefühl.** Recht, dann Entscheide des Betriebs, dann Hausentscheide des Studios, dann die Regeln dieses Skills (zusammenspiel Teil 1). Entscheide stehen mit Datum und Person in `entscheide.md` (design-uni).
2. **Der Wunsch des Betriebs geht vor, mit offenem Preis.** Will der Betrieb mehr Technik, als die Regeln vorsehen, wird sie gebaut, wenn die Kosten benannt sind: Gewicht in KB, Auswirkung auf LCP und TBT, Pflege, Geräte, die es nicht tragen. Der Betrieb entscheidet mit dem Kostenblatt.
3. **Kosten an den Kunden sind Entwürfe.** Kostenblatt, Stunden und laufende Kosten gehen erst nach Freigabe durch das Studio an den Betrieb.
4. **Boden für Bewegung** (zusammenspiel Entscheid 12; Barrierefreiheit): Aller Inhalt, Telefon und Anfrage funktionieren ohne Bewegung, ohne JavaScript und ohne WebGL; keine Bewegung hält Inhalt zurück; unter `prefers-reduced-motion` läuft nichts von selbst; was länger als 5 s von selbst läuft, lässt sich pausieren (WCAG 2.2.2). Darüber gibt es keine Mengenregel: Bewegung gibt es so viel, wie die Idee oder der Wunsch braucht.
5. **Foto zuerst, Szene später.** Das LCP-Element ist ein Bild oder Text; Szenen laden nach dem LCP. Grund: eigene Messung, der LCP blieb mit Szene gleich ([messungen.md](referenzen/messungen.md)).
6. **Hinweis Energie:** Bei schwacher Grafik oder Sparmodus die Szene nicht starten `[Annahme, nicht gebaut]`.
7. **Alles vom eigenen Host.** Schriften, Skripte, Bilder und Modelle liegen auf dem eigenen Server. Fremde Inhalte laden erst nach Klick (text-uni CL3); fremde Skripte nur mit Grund und erst nach Einwilligung oder Klick (zusammenspiel Entscheid 10). Keine Cookies ohne Entscheid. Einzelheiten: [betrieb.md](referenzen/betrieb.md).
8. **Messen, bevor man behauptet.** Eine Technik gilt als «gut» erst nach WP5 und, wo es um Wirkung geht, nach WP6.
9. **Organisation vor Millisekunden.** Aus einem Besucher wird eine Anfrage durch Verständlichkeit, Vertrauen und einen kurzen Weg; aus der Anfrage ein Auftrag durch das, was im Betrieb danach geschieht. Ladezeit ist eine **Schwelle** (WP5), kein Wettbewerb. Jeder Stack-Entscheid braucht mindestens einen Grund aus der Organisation (Pflege, Abläufe, Anfragekette).
10. **Der Betrieb muss es pflegen können.** Ist die Antwort auf «Wer ändert die Öffnungszeiten?» «nur ein Entwickler», ist das ein Kostenpunkt und steht im Kostenblatt.
11. **Nichts geht live ohne Freigabe.** Gebaut wird eine Vorschau: `noindex` per `X-Robots-Tag` oder Meta, wo möglich mit Zugangsschutz; `robots.txt` sperrt sie **nicht** (zusammenspiel Entscheid 4). Live geht es nur über Schritt 9.

## Schritt 0 · Eingang

Ein Gespräch, ein Blatt: Die Fragen von web-uni stehen im **Kundenangaben-Blatt von design-uni**, Teil web-uni ([kundenangaben.md](../design-uni/eingabe/kundenangaben.md)). web-uni führt kein eigenes Blatt. Aus dem Blatt braucht web-uni diese Antworten, je als `[Fakt · Quelle]`, `[Annahme]` oder `[Lücke]`:

1. **Wunsch des Betriebs** in seinen Worten, mit Vorbildern und Gegenbildern; daraus die Frage, ob Bewegung oder 3D Kern des Wunsches ist.
2. **Besucher und Geräte:** Anteil Handy, Alter der Geräte, Netz, Sprachen.
3. **Funktionen:** Anfrage, Terminbuchung, Anmeldung, Zahlung, Shop, Mehrsprachigkeit, Suche, Karte, Chat.
4. **Pflege:** wer ändert was, wie oft, mit welchen Kenntnissen; heutiges System.
5. **Budget und Frist** für Bau und laufende Kosten.
6. **Daten:** Hosting-Standort, Cookies, Anfragen speichern ja oder nein, Aufbewahrung.
7. **Bestand:** alte Adressen und Sitemap (für TI19), Domain und ihr Halter, Konten (Hoster, Search Console, Unternehmensprofil, E-Mail).
8. **Anfragekette** als Entwurf: wo kommt eine Anfrage an, wer liest sie wann, wie schnell kommt die Antwort, was folgt.

**WP0 · Teil web-uni vollständig:** alle acht Antworten da oder als Lücke bestätigt; der Wunsch als Satz festgehalten. WP0 läuft einmal zusammen mit DP0 und TP0 (gemeinsames Tor, zusammenspiel Teil 6, Schritt 1).

## Schritt 1 · Fähigkeiten und Klassen

Aus den Antworten folgt, **was die Seite können muss**. Fünf Klassen (Einzelheiten: [stacks.md](referenzen/stacks.md)):

| Klasse | Gemeint | Typisch für |
|---|---|---|
| **A** statisch von Hand | HTML, CSS, wenig JS, ein Bauskript | sehr wenige Seiten, kaum wiederkehrende Werte |
| **B** statischer Generator | Astro, Eleventy | Werte an einer Stelle, Seiten aus Bauteilen, wenig JS |
| **C** React-Framework | Next.js, alternativ SvelteKit, Remix, Nuxt | Konten, Shop, Buchung, dynamische Daten |
| **D** Baukasten oder CMS | Webflow, Wix, Shopify, WordPress | der Betrieb pflegt ganz ohne Entwickler |
| **E** Erlebnis-Zuschlag | WebGL, WebGPU, grosse Animation, Video | Bewegung oder 3D ist Kern des Wunsches; **auf B oder C** |

**WP1 · Klasse begründet:** je gefordertem Merkmal steht, welche Klasse es verlangt und welche es nur erleichtert.

Danach: TP1 Antwort-Plan (text-uni) legt die Seitenliste fest; gebaut wird keine Seite ausserhalb des Plans.

## Schritt 2 · Stack und Hoster

Läuft nach TP1. **Ist Bewegung oder 3D Kern des Wunsches, läuft WP2 erst nach DP1** (Richtung), weil Klasse E an der Richtung hängt.

**Standard des Studios** `[Hausentscheid · Studio, 02.11.2026]`: **Astro mit statischer Ausgabe**, Gerüst in [vorlage-astro/](vorlage-astro/README.md). Astro ist Standard, weil Pflege und eine Datenquelle gewinnen (Organisation): Jeder Wert steht an einer Stelle (WL4), der Bau prüft Pflichtfelder und Links, Seiten entstehen aus Bauteilen. Bei statischer Ausgabe kostet Astro gegenüber handgeschriebenem HTML nichts Messbares (Score 96 gegen 97, gleiches JS, [messungen.md](referenzen/messungen.md)). Ausnahmen, je mit «Weil»-Satz:

- **Statisches HTML (Klasse A):** erlaubt, wenn nichts verloren geht, das heisst: so wenige wiederkehrende Werte, dass eine Datenquelle nichts spart, und kein Bedarf an Bauprüfungen über das Prüfskript hinaus.
- **Next.js (Klasse C):** nur bei Konten, Anmeldung, Shop, Buchung oder stark dynamischen Daten; im Spike +133 KB JS und rund 1 s später LCP bei gleichem Inhalt.
- **Baukasten (Klasse D):** wenn der Betrieb ihn schon hat oder ausdrücklich verlangt, oder ganz ohne Entwickler pflegen will und das gesagt hat. Ein solcher Wunsch ist ein Entscheid des Betriebs und geht dem Hausentscheid vor.
- **Kombinationen** (Hinweis `[Annahme]`): eine Seite, ein Stack; die Grenze liegt an der Adresse ([stacks.md](referenzen/stacks.md), «Zwei Stacks zusammen»).

Die Begründung steht in `technik.md` im Projekt:

1. **Wahl:** Klasse, Stack mit Version, **Hoster**.
2. **Weil-Sätze:** drei Gründe aus dem Eingang, davon mindestens einer aus der Organisation.
3. **Gegenentwurf:** der zweitbeste Weg und warum nicht.
4. **Einfachster Weg** (meist Klasse A oder D) und was der Betrieb dabei verliert.
5. **Kosten und Pflege** (Entwurf): Stunden Bau, laufende Kosten, wer pflegt.
6. **Umkehrbarkeit:** was ein Wechsel nach Schritt 4 kostet.

Der Hoster muss können, was text-uni für Suche und Umzug verlangt: eigene 404 (TI17), Weiterleitungen mit 301 ohne Ketten (TI20, TI23), Kopfzeilen für `noindex` (TI10), Vorschau je Änderung. Kriterien und Stand: [betrieb.md](referenzen/betrieb.md). Der Entscheid selbst kommt mit Datum in `entscheide.md`.

**WP2 · Entscheid geprüft:** ein zweiter Blick (Unteragent ohne Kontext oder eine Fachperson) bekommt nur `technik.md` und den Teil web-uni des Blatts und nennt den stärksten Einwand. Der Einwand wird beantwortet oder der Entscheid geändert.

## Schritt 3 · Bewegungstechnik und Kostenblatt

**Ob und welche Bewegung** entscheidet design-uni in DP2, nach dem, was die Idee des Betriebs oder der Wunsch braucht; eine Mengenregel gibt es nicht (zusammenspiel Entscheid 12). web-uni entscheidet nur, **womit** und **was es kostet**. Übergabe **DP2 → WP3**: design-uni nennt die Bewegungen, web-uni wählt je Bewegung die Technik, die sie mit den geringsten Kosten trägt ([animation-3d.md](referenzen/animation-3d.md)). Die Leiter ordnet nach Kosten; sie begrenzt nichts:

| Stufe | Technik | Gewicht | Typisch für |
|---|---|---|---|
| 0 | keine | 0 | die Idee braucht keine |
| 1 | CSS-Übergänge, `animation-timeline` | 0 KB JS `[Annahme]` | die Bewegung geht mit CSS |
| 2 | View Transitions | 0 bis 2 KB `[Annahme]` | Seitenwechsel sollen zusammenhängen |
| 3 | GSAP, Motion, Lenis | 20 bis 90 KB JS `[Annahme]` | Abläufe, die CSS nicht kann |
| 4 | Video, Lottie, Rive | Video MB, Lottie 50 KB `[Annahme]` | etwas Reales zeigen |
| 5 | WebGL: three.js, React Three Fiber | +240 KB JS, 3,4 s TBT im Labor ohne GPU `[gebaut und gemessen]` | das Produkt ist 3D |
| 6 | WebGPU mit WebGL-Rückfall | wie 5 plus Pfade | nur bei Rechenlast |

**Wunsch des Betriebs:** Will der Betrieb eine Bewegung, die DP2 nicht vorsieht, ist das ein Entscheid des Betriebs und geht nach der Rangfolge vor. Reisst eine Bewegung die Schwellen in WP5, entscheidet der Betrieb mit dem Kostenblatt, nachdem das Studio es freigegeben hat; der Entscheid steht in `entscheide.md`.

Je Bewegung im Abschnitt «Bewegung» von `technik.md`: Stufe, was sie zeigt, Kosten (KB, LCP, TBT), Rückfall, Abschalter, Pause.

**WP3 · Technik und Kosten benannt:** jede Bewegung aus DP2 und aus Entscheiden des Betriebs hat Stufe, Kostenblatt (Entwurf) und Rückfall; der Boden aus Grundregel 4 ist erfüllt.

## Schritt 4 · Gerüst und Bau

Zwei Teile, getrennt durch Schritte von design-uni und text-uni (zusammenspiel Teil 6, Schritte 11 und 13):

1. **Gerüst** vor DP4: Vorlage kopieren, Fakten und Wortlaut eintragen, Bau läuft. Übergabe **Gerüst → DP4** (erster Bildschirm).
2. **Bau aller Seiten** nach DP5, mit Titel, Beschreibung, strukturierten Daten und Technik aus text-uni.

Regeln, unabhängig vom Stack:

- **Eine Quelle.** Fakten, Wortlaut und Tokens stehen je an einer Stelle; der Bau erzeugt den Rest (WL4). `tokens.json` (design-uni) erzeugt das CSS.
- **Adressen ohne Weiterleitung** (text-uni TI24): Links zeigen auf die Adresse, die der Hoster direkt ausliefert. In der Vorlage: Verzeichnisformat, Link `/kontakt/`.
- **Bilder:** Varianten (`srcset`, `sizes`), moderne Formate, `width` und `height`, das LCP-Bild mit `fetchpriority="high"`, sonst `loading="lazy"`; Metadaten entfernen; Grösse je Variante nach WP5.
- **Schriften** lokal und als Teilmenge; `font-display` nach design-uni; die Hauptschrift vorladen.
- **Anfrage:** Formular-Backend ist `[nicht gebaut]`. Bis es gebaut ist, führt die Hauptaktion auf `tel:` oder `mailto:`, Wortlaut aus text-uni ([betrieb.md](referenzen/betrieb.md)).
- **Barrierefreiheit:** Schwellen und Prüfungen bei design-uni; web-uni stellt die Werkzeuge im Prüflauf.

Stackspezifisch: [stacks.md](referenzen/stacks.md).

**WP4 · Bau:** Vorschau läuft mit `noindex`; Bau ohne Fehler; Fakten, Wortlaut und Tokens aus je einer Quelle; 0 interne Links mit Weiterleitung.

## Schritt 5 · Ein Prüflauf und Budgets

Alle maschinellen Prüfungen laufen **einmal am selben Stand**: DP6 (design-uni, `pruefen.cjs`), TP7 (text-uni, `slop-de.js` und Technik), WP4 und WP5 (Bau und Messung); dazu TP5 und TP6. Ablauf und Befehle: [pruefumgebung.md](referenzen/pruefumgebung.md).

**Budgets** (web-uni ist Besitzer; die anderen Skills verweisen hierher). Gemessen mobil, mit Komprimierung, drei Läufe, Median. **Schwellen** sperren: Was darüber liegt, wird behoben oder vom Betrieb mit Kostenblatt entschieden. **Richtwerte** sind Hinweise ohne eigenen Beleg (zusammenspiel Entscheid 13): Sie helfen, die Schwellen zu halten, und eine Überschreitung steht nur mit Grund im Bericht.

| Kennzahl | Wert | Art und Herkunft |
|---|---|---|
| Lighthouse Leistung (mobil, simuliert) | ≥ 90; darüber wird nicht weiter optimiert | Schwelle, zusammenspiel Teil 4 |
| LCP | ≤ 2,5 s | Schwelle `[gelesen · web.dev, «gut» am 75. Perzentil]`; im Labor nur Hinweis |
| INP (Feld) | ≤ 200 ms | Schwelle `[gelesen · web.dev]` |
| CLS | ≤ 0,1 | Schwelle `[gelesen · web.dev]` |
| Fremde Herkunft, Cookies | 0 | Schwelle, Grundregel 7 (DSG, Entscheid 10); geprüft in DP6 |
| TBT im Labor (Ersatz für INP) | ≤ 200 ms | Richtwert `[Annahme]` |
| JavaScript vor dem LCP, komprimiert | ≤ 100 KB | Richtwert `[Annahme]` |
| JavaScript gesamt, komprimiert, normale Seite | ≤ 170 KB | Richtwert `[Annahme]`; im Spike lag Next.js bei 137 KB und 3619 ms LCP `[gebaut und gemessen]` |
| Zusatz-JS einer 3D-Szene nach dem LCP | im Kostenblatt, ≤ 600 KB | Richtwert `[Annahme]` |
| HTML je Seite | ≤ 100 KB | Richtwert `[Annahme, bisher in text-uni TI34]` |
| Bild, je ausgelieferte Variante | ≤ 200 KB | Richtwert `[Annahme, bisher in text-uni TI33]` |
| randloses oder LCP-Bild, grösste Variante (ab 1440 px bei 2×) | ≤ 400 KB | Richtwert `[Annahme]` |
| Bilder beim ersten Aufruf, mobil | ≤ 1 MB | Richtwert `[Annahme]`; Median-Startseite lädt 1059 KB Bilder `[gelesen · Web Almanac 2025]` |
| Schriften gesamt | ≤ 100 KB | Richtwert `[Annahme]`; Median 139 KB `[gelesen · Web Almanac 2025]` |

- **Score ersetzt die Einzelwerte nicht.** Die gemessene Probe hatte Score 97 und LCP 2645 ms im Labor. Liegt ein Laborwert über der Schwelle, steht er mit Grund im Bericht; den Ausschlag geben Feldwerte nach dem Livegang.
- **Tempo ist Schwelle, nicht Ziel.** Liegt alles innerhalb der Schwellen, geht Aufwand in Verständlichkeit, Vertrauen und die Anfragekette. Die Belege für Ladezeit und Umsatz sind Fallstudien von Herstellern und korrelativ ([branchenwerte.md](referenzen/branchenwerte.md)).
- **Labor ist nicht Feld.** Software-Grafik im Container zeigt Gewicht und Blockierung, nicht Bildrate.

**WP5 · Gemessen:** jede Kennzahl mit Wert, Befehl und Datum; jede Überschreitung mit Grund; alle Prüfungen des Prüflaufs mit Ergebnis oder «nicht gelaufen».

## Schritt 6 · Wirkung mit Menschen

Läuft nach DP7 und DP8 (Kunden-Agenten und ganze Website, Modell-Urteile als Vorfilter). Ablauf, Auswahl, Einwilligung und Auswertung von Menschentests regelt design-uni ([blindtest.md](../design-uni/referenzen/blindtest.md)). web-uni nennt nur, **was** geprüft wird:

- Dieselbe Seite **mit und ohne** die teure Technik (ab Stufe 3 oder Klasse E).
- Zwei Aufgaben: die Hauptaufgabe und das Auffinden einer Leistung; danach die Fünf-Sekunden-Frage.

Regel: Eine Technik, die in WP5 teuer und im Menschentest nicht besser ist, fliegt raus, auch wenn der Betrieb sie mochte. Er bekommt die Zahlen, und der Entscheid wird neu getroffen. Ohne Menschentest steht im Bericht «Modell-Urteil bestanden, Wirkung nicht belegt».

**WP6 · Wirkung mit Menschen:** für jede teure Technik ein Menschentest mit Ergebnis, oder der Satz «Wirkung nicht belegt» im Bericht und ein Entscheid des Betriebs, sie trotzdem zu behalten.

## Schritt 7 · Betrieb und Übergabe

**Anfragekette zuerst:** Für jeden Eingang (Anfrage, Telefon, E-Mail, Unternehmensprofil) steht schriftlich: wer, wann, wie schnell, was danach. Die Seite verspricht nur, was die Kette hält. Studien aus dem US-Vertrieb verbinden kurze Antwortzeit mit mehr Erfolg (MIT/InsideSales 2007, Harvard Business Review 2011) `[gelesen · Übertragbarkeit: Annahme]`.

Dazu Hosting, Domain, HTTPS, Sicherheits-Kopfzeilen, Sicherungen, E-Mail-Zustellung, Zugänge, Pflegehandbuch und Weiterleitungsliste: [betrieb.md](referenzen/betrieb.md).

**WP7 · Betrieb:** Anfragekette vom Betrieb bestätigt; der Betrieb hat alle Zugänge und ist Inhaber (text-uni M17, TI30); Pflegehandbuch von einer Person des Betriebs durchgespielt; Weiterleitungsliste nach TI19; Kostenblatt freigegeben oder als Entwurf markiert.

## Schritt 8 · Abliefern

Ein `LIESMICH.md` für das ganze Projekt (Besitz: design-uni). web-uni liefert den Teil Technik: Stack und Hoster aus `technik.md`, Bewegungen mit Kosten, Ergebnis des Prüflaufs, WP0 bis WP7 mit Zahlen, Lektion in [lektionen.md](referenzen/lektionen.md). **Was nicht lief, heisst «nicht gelaufen»**, nie «bestanden».

**WP8 · Teil Technik vollständig.**

## Schritt 9 · Livegang

Erst nach Freigabe durch den Betrieb oder das Studio, mit Datum in `entscheide.md`. Ablauf: [livegang.md](referenzen/livegang.md): Schalter `vorschau` aus, `noindex` weg, `robots.txt`, Sitemap und `canonical` nach text-uni (TI1 bis TI14, S28), Weiterleitungen am Hoster (TI19 bis TI30), Einreichen, Nachprüfung nach 1, 4 und 12 Wochen.

**WP9 · Livegang:** jede Zeile der Liste in [livegang.md](referenzen/livegang.md) mit Datum und Ergebnis; die Termine für die Nachprüfungen stehen im Kalender des Betriebs.

## Was der Skill nicht kann

- **Keine Meisterschaft durch Text.** `[gebaut und gemessen]` sind statisches HTML (Klasse A), Astro als 1:1-Übernahme und Next.js 16 als statischer Export mit und ohne 3D-Szene. Die Astro-Vorlage ist gebaut, aber nicht gemessen. Alles andere ist `[nicht gebaut]`.
- **Labor ist nicht Feld.** Alle Messungen liefen in einem Container mit Software-Grafik.
- **Keine Rechtsauskunft.** Wortlaut und Recht für Inhalte: text-uni.
- **Ohne Unteragenten** heissen alle Bewerter-Tore «nicht gelaufen». Gebaut wird trotzdem, wenn der Auftraggeber es will; der Bericht sagt das oben.

## Übersicht der Referenzen

| Datei | Inhalt |
|---|---|
| [vorlage-astro/](vorlage-astro/README.md) | Gerüst: Datenquelle, Layout, Bau mit Prüfungen, Vorschau und Livegang per Schalter |
| [stacks.md](referenzen/stacks.md) | Klassen A bis E, Entscheidbaum, Versionsstand |
| [animation-3d.md](referenzen/animation-3d.md) | Leiter der Bewegung, Browserstand, Rückfälle, Kostenblatt |
| [betrieb.md](referenzen/betrieb.md) | Hoster, Domain, HTTPS, Kopfzeilen, Sicherungen, E-Mail, Datenschutz-Technik, Formular, Mehrsprachigkeit, Pflege, Zugänge, Kosten |
| [pruefumgebung.md](referenzen/pruefumgebung.md) | der eine Prüflauf: Bau, `pruefen.cjs`, `slop-de.js`, Messung |
| [livegang.md](referenzen/livegang.md) | Schritte und Prüfliste für WP9 |
| [messungen.md](referenzen/messungen.md) | gebaute Spikes mit Zahlen, Befehle, Grenzen |
| [branchenwerte.md](referenzen/branchenwerte.md) | was im Web normal ist und womit die Grossen bauen |
| [lektionen.md](referenzen/lektionen.md) | was Bau und Messung gelehrt haben (WL) |
