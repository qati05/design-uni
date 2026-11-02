# Auto Speedy AG, Altstätten: Vorschau der Website

**Stand:** 2. November 2026 · Vorschau, `noindex`, nicht veröffentlicht, nichts an den Betrieb gesendet.
**Gebaut von:** einem Modell allein (Claude Opus 5.5, `claude-opus-5-5`), ohne Gespräch mit dem Betrieb, ohne Unteragenten, ohne Menschen.

## Was liegt wo

| Pfad | Inhalt |
|---|---|
| `seite/` | Astro-Projekt (Kopie von `skills/web-uni/vorlage-astro`), `npm install && npm run build` |
| `seite/dist/` | gebaute Vorschau, 8 Seiten: `index`, `schaden`, `tesla`, `leistungen`, `kontakt`, `impressum`, `datenschutz`, `404` |
| `seite/src/content/betrieb.json` | **eine Quelle** für Name, Anschrift, Telefon, Zeiten, Menü, Links |
| `seite/tokens.json` → `seite/werkzeug/tokens.mjs` → `public/css/tokens.css` | Tokens (DTCG 2025.10), erzeugen das CSS vor jedem Bau |
| `seite/werkzeug/lichtregel.py` | eine Bildbearbeitung für die ganze Fotoserie (Entrauschen, Kurve, Körnung, Zweiton Navy) |
| `seite/werkzeug/screens.cjs` | Bildschirmfotos aller Seiten |
| `screens/` | `<seite>-desktop.png` (1440 × 900), `<seite>-mobil.png` (390 × 844), je `-ganz`; dazu Zustände (Menü offen, Fehler, Stelle gewählt, Bestätigung Tesla) |
| `projekt.json` | Eingabe für `pruefen.cjs` (mit Belegen jeder Zahl) |
| `akte/` | entscheide, richtung (Inventar, Richtungs- und Angebotsblatt, Register, Ableitung), text-akte (T0, Antwort-Plan, Ziele), entscheid-stack (Anforderungsblatt V0, Stack), entscheid-bewegung, zusagen-blatt, messplan, `collagen.png`, `unschaerfe-start.png` |
| `arbeit/` | Ausgaben der Werkzeuge, Bildfolgen der Bewegung, Klickpfade, Lighthouse-Rohdaten (`mess/`) |
| `pruefung/` | Ausgabe von `vermessen.cjs` |

## Gewählte Richtung, Technik, Bewegung (je mit «weil»)

- **Die eine grosse Entscheidung: «Der blaue Kreis»** (Form: Zeichen/System). Ein von Hand gezogener blauer Kreis markiert genau das, worauf es ankommt: den Schaden auf dem Foto, das Wort «Schaden» im Titel, die Handlung «Schaden melden», die gewählte Stelle am Auto, das gewählte Tesla-Modell. **Weil** die Werkstatt Schäden so dokumentiert (eigenes foto-06: Felgenschaden mit blauem Stift eingekreist), weil der Kreis die Hauptaktion des Kunden selbst trägt (Schaden zeigen = melden) und weil er ohne Fototag hält: Das Zeichen ist gezeichnet, die schwachen Handyfotos stützen nur.
- Verworfen: «Schild an der Alten Landstrasse 63» (hängt am Rasterlogo) und «Lichtleiste der Kabine» (unsichtbar auf hellem Grund, wäre ein 1-px-Linienraster wie der Modell-Standard). Collagen: `akte/collagen.png`.
- **Tragende Technik T6** (Aussage als grosser gesetzter Satz, hier die Aufforderung «Zeigen Sie uns den Schaden.» mit eingekreistem Wort), **weil** der Kreis an einem gesetzten Wort hängen muss, um nacherzählbar zu sein. **Stützend T7** (Tesla-Modelle als grosse Wortliste, zugleich das Auswahlfeld), **weil** der Kunde die Modelle wählbar will; **T13** (Fuss als Bühne auf der Navy-Fläche des Logos), **weil** Zeiten, Telefon und Anschrift am Ende jeder Seite stehen sollen.
- **Schrift** Mona Sans (OFL, lokal), Titel Black Italic schmal, **weil** die Wortmarke des Logos schwer und schräg ist und der Name gesetzt statt das Rasterlogo vergrössert wird. **Grund** Kabinenweiss #f4f6f8, **weil** der Kunde hell will und die Kabinenwände kühl weiss sind (nicht Creme). **Farben** Logo-Navy, -Schwarz, -Silber, dazu Marker-Blau #0737C5 aus foto-06 nur für Kreis und Hauptaktion `[Annahme, Zusagen-Blatt Nr. 10]`. **Knopf** eingekreistes Wort ohne Fläche, **weil** der Kreis die Handlung markiert. **Bildschnitt** Hochformat-Detail im Zweiton Navy, **weil** die Fotos schwach sind und das Detail den Schaden zeigt.
- **Bewegung (eine):** Der Kreis um «Schaden» zeichnet sich einmal in 0,7 s nach dem Laden, **weil** das Einkreisen ein echter Handgriff aus der Werkstatt ist. Unter Reduced Motion und ohne JavaScript steht er fertig da. Rückmeldung (keine eigene Bewegung): gewählte Stelle oder gewähltes Modell wird in 0,25 s eingekreist (Deckkraft). Blatt: `akte/entscheid-bewegung.md`.

## Stack-Entscheid (web-uni Schritt 2), Kurzfassung

Astro 7.4.4, statische Ausgabe, aus der Vorlage. **Weil** Name, Zeiten und Telefon auf allen 8 Seiten und im JSON-LD aus **einer** Datei kommen und der offene Freitags-Widerspruch (17.15 oder 17.30 Uhr) dann an einer Stelle geändert wird (Organisation, Pflege); **weil** das Formular nur eine E-Mail vorbereitet (kein Server nötig); **weil** die eine Bewegung mit CSS auskommt. **Gegenentwurf** Klasse A (HTML von Hand): achtfache Pflege von Kopf, Fuss, Zeiten. **Einfachster Weg** Wix (heute): Selbstpflege, aber fremde Hosts und Cookies gegen den Rahmen E11. Vollständig: `akte/entscheid-stack.md`.

## Prüfpunkte

Legende: **bestanden** = Werkzeug oder Messung erfüllt die Schwelle; **Selbstauskunft** = von mir gezählt, zählt nicht als Urteil; **nicht gelaufen** = mit Grund. Wer: «Werkzeug» oder «Modell (ich)».

**Grund für alle «nicht gelaufen» bei blinden Tests, Bewertern und Kunden-Agenten:** In dieser Sitzung gibt es kein Werkzeug, um Unteragenten zu starten (kein Task-/Agent-Werkzeug). Fernsitzungen über das Remote-Werkzeug hätten die Bilder nicht ohne Veröffentlichung gesehen, liefen auf demselben Modell und hätten den Arbeitsordner verlassen. Menschen und ein zweites Modell standen nicht zur Verfügung. Die Skills verlangen ohne Unteragenten ein Anhalten nach den Collagen (design-uni Z. 251); der Auftrag verlangt den Bau. Darum ist **keine Aussage über Geschmack, Wirkung oder «Agentur»-Niveau belegt**.

### design-uni

| Prüfpunkt | Ergebnis | Wer |
|---|---|---|
| P0 Vollständigkeit | **teilweise**: 16 Nomen (≥ 12), nach Sieben 3, Hauptaktion fest; «jede Zusage mit zuständiger Person» nicht erfüllbar (kein Gespräch, keine Zusage freigegeben). Gebaut trotz «baust nicht», weil der Auftrag es verlangt | Modell (ich) |
| P1 Richtung (blind) | **nicht gelaufen** (keine Unteragenten). Collagen gebaut: `akte/collagen.png`; Vorwahl C mit Begründung in `akte/richtung.md` | – |
| P2 Abstand | **Selbstauskunft** (kein Register-Skript; Register = Modell-Standard, keine eigenen Vorgänger): 6 von 8 Achsen anders (gleich: Hero-Typ und Bildschnitt sind «Titel links, Bild rechts / hoch rechts», begründet mit dem Reim der zwei Kreise); Creme-Sperre bestanden (#f4f6f8 ≈ OKLCH 0,97 / 0,003 / 248); Titelschrift nicht gesperrt; Bauteile 5 von 7 anders (gleich: Haarlinien in Listen, Ton der Mikrotexte) | Modell (ich) |
| P3 Prüflisten | **Selbstauskunft**: A 8 ja, 3 Lücke des Betriebs (Frist, Preis ×2), 3 nein (Beleg je Leistung im selben Bildschirm, Zusagen freigegeben, Angebot mit Namen) → 11 mit Lücken (Schwelle 11); P 11 ja, 2 Lücke (Frist, Preis), 2 nein (Nr. 9 «etwas Nützliches ohne Gegenleistung»; **Nr. 13 Recht: Tesla-Partnerschaft extern nicht belegt, Einwilligung der Bewertungen offen → sperrt den Livegang, nicht die Vorschau**); H 13 ja, 1 Lücke (Frist), 1 nein (LCP Start 2,86 s im Labor) → 13 (Schwelle 13). Nie-Liste «verboten»: 0 Treffer gefunden | Modell (ich) |
| Vor P4 maschinell | `vermessen.cjs` + `vergleichen.cjs`: **Vorlagen-Signale 0**; ausserhalb des Bands 8 Masse, je mit «weil» (unten); Idee im Bild bei 10 px Unschärfe sichtbar: drei blaue Ellipsen (Titel, Handlung, Foto), `akte/unschaerfe-start.png` | Werkzeug; Unschärfe von mir angesehen |
| P4 Bildtest, Geschwister, Fünf-Sekunden | **nicht gelaufen** | – |
| P5 Startseite maschinell | Titel ab 0 ms sichtbar (≤ 1,0 s): ja; nach 3 s 0 Animationen: ja; Reduced Motion 0 Animationen, Weg 0 px: ja; ohne JS Inhalt da: ja; **animiert nur Transform/Deckkraft/Farbe: nein** (`stroke-dashoffset`, siehe prozess.md); Telefon am Handy im Kopf (0 Striche), Zeiten 1 Daumenstrich (Statuszeile im Held, Tabelle im Fuss) | Werkzeug (`pruefen.cjs`, `arbeit/mess/bewegung.cjs`) |
| P5 blind (Bildfolge) | **nicht gelaufen**; Bildfolgen liegen bereit: `arbeit/folge-desktop.png`, `folge-mobil.png`, `folge-ruhig.png` | – |
| P6 maschinell | **bestanden: 45 Prüfungen, 0 Fehler, 0 nicht geprüft**; Selbsttest des Werkzeugs vorher bestanden (6/6 eingebaute Fehler gefunden). Dazu axe-core 4 (WCAG 2.0 bis 2.2 AA + best practice): **0 Verstösse** auf 8 Seiten × 2 Breiten; Tastatur: Sprunglink → Marke → Menü → Telefon → Schaden melden; Lighthouse mobil ≥ 90 (95 bis 100); Klickpfade am Handy: Anruf 1 Tipp, Route 1 Tipp (Kontakt) bzw. 2 (Start über Menü), Anfrage von Start: 2 Bildschirme (Start → Schaden, dort Stelle, Name, Telefon, Senden) | Werkzeug |
| P7 Kunden-Agenten | **nicht gelaufen**. Werkzeug-Selbsttest `kunde.cjs` **bestanden** (kaputter `tel:`, verdeckter Knopf, Überschrift statt Link: alle drei gezeigt). Skriptierte kürzeste Pfade (kein Agent): `arbeit/pfade/` | Werkzeug |
| P8 ganze Website (blind) | **nicht gelaufen** | – |
| Schritt 11 | Zusagen-Blatt `akte/zusagen-blatt.md` (16 Zeilen); Messplan `akte/messplan.md`; Register `akte/richtung.md` Teil 5 (Status «gebaut (Vorschau)», Achsen Selbstauskunft) | Modell (ich) |

**Lage im Band, je mit «weil»:** 1 Schriftfamilie (unter p25), weil eine Familie mit zwei Rollen reicht · Star ÷ Fliesstext 6,4 Desktop / 2,9 Handy (über p75), weil der Titel der Star ist und den Kreis tragen muss · Versalien 0 (unter p25), weil kein Versal-Etikett (Modell-Standard) · Fliesstext 18 px (über p75), weil Handwerksseiten 18 bis 20 px brauchen (typografie.md G1) · Bild im ersten Bildschirm 0,38 Desktop (unter p25), weil die Handyfotos randlos ihre Schwäche grösser zeigen würden (techniken.md T2, Gefahr); am Handy 0,46 im Band · Seitenhöhe 5,1 Bildschirme (unter p25), weil ohne Fototag, Preise und Fristen nichts Belegtes zum Füllen da ist · 0 Bewegungs-Bibliotheken, weil die eine Bewegung CSS ist.

### text-uni

| Prüfpunkt | Ergebnis | Wer |
|---|---|---|
| T0 Unterlagen | **nicht bestanden**: 16 statt 30 Kundenaussagen, keine Suchbegriffe aus 3 Quellenarten, keine 5 echten Kundenfragen (`akte/text-akte.md`) | Modell (ich) |
| T1 Antwort-Plan | **Selbstauskunft bestanden** (0 Doppelbegriffe, je Seite eine Absicht, keine Ortsseiten); Begriffe angenommen | Modell (ich) |
| T2 Fünf-Sekunden-Lesetest | **nicht gelaufen** (Skill: ohne T2 keine Einstiegsseite «fertig») | – |
| T3 Text | W1 Mittel **9,0 Wörter** (≤ 15), W2 längster Satz **21** (≤ 25), Floskel-Werkzeug **0 Fehler**, 2 Warnungen («professionell», «faire Preise», beide im wörtlichen Zitat einer Google-Bewertung, Beleg `eingabe/bewertungen.json`); Prüflisten A/P/H wie P3 | Werkzeug; Prüflisten Selbstauskunft |
| T4 blind gegen Konkurrenz | **nicht gelaufen** | – |
| T5 Snippet-Test | **nicht gelaufen**; maschinell S1/S3/S9/S12 (Titel 40 bis 60, Beschreibung 110 bis 155), S15/S16 (ein h1, keine Sprünge), S20 (Alt, Mass), S23/S24 (LocalBusiness = `AutoBodyShop`, gleich der Seite, ohne Bewertung): **bestanden** | Werkzeug |
| T6 KI-Zitat-Test und Wiedergabe-Probe | **nicht gelaufen** | – |
| T7 Technik und Text maschinell | **bestanden**: CH1 0 Eszett, CH4 nur «Sie», CH5 Guillemets, K11 0 Gedankenstriche, CH11 Uhrzeit mit Punkt, CH12 kein +41 im Text, 0 Klammern, TI9 noindex ohne canonical, TI3 robots.txt sperrt alles, keine Sitemap, TI17 0 tote Links, **Faktenabgleich: jede Zahl ab 3 Stellen belegt**. **Nicht prüfbar offline:** echte 404-Statuscodes (Hosting), HTTPS, Core Web Vitals im Feld, Bing/Google-Index. **Weiterleitungsliste (TI19 ff.) nicht erstellt**: alte Adressen stehen in `eingabe/QUELLEN.md` Q1 bis Q10, Zuordnung offen | Werkzeug |
| T8 Ziele und Messplan | **teilweise**: 7 Ziele mit Prüfung (Z4 «Was kostet es?» nicht erfüllbar); Messplan ohne Ausgangswerte und Datum → nach Skill nicht bestanden | Modell (ich) |

### web-uni

| Prüfpunkt | Ergebnis | Wer |
|---|---|---|
| V0 Anforderungsblatt | **bestanden** (11 Punkte, 4 als Lücke; Wunsch als Satz) | Modell (ich) |
| V1 Klasse | **bestanden** (Klasse B; Tabelle in `akte/entscheid-stack.md`) | Modell (ich) |
| V2 zweiter Blick | **nicht gelaufen** (kein Unteragent, keine Fachperson) | – |
| V3 Bewegung | **bestanden** (Blatt je Bewegung, nichts zurückgehalten, ohne JS alles da) | Werkzeug + Blatt |
| V4 Bau | **bestanden**: Vorschau läuft, Pflichtpfade bestehen, Angaben aus `betrieb.json` (Zeiten auch im Status-Satz abgeleitet), Tokens erzeugen `tokens.css`. Abweichung: Formular ohne Server (Entscheid E6 statt web-uni Z. 120) | Werkzeug |
| V5 Messung | siehe Tabelle unten; **Firefox und WebKit nicht gelaufen** (Browser nicht installiert) | Werkzeug |
| V6 Wirkung | **nicht gelaufen** (weder blind noch Menschen) | – |
| V7 Betrieb | **nicht gelaufen**: Anfragekette, Zugänge, Pflegehandbuch brauchen den Betrieb | – |
| V8 Bericht | dieses Dokument | Modell (ich) |

**V5 · Lighthouse 13.6.0, mobil, simulierte Drosselung, Median aus 3 Läufen, 2. November 2026, lokaler `http-server` ohne Kompression** (`arbeit/lighthouse-ausgabe.txt`, Rohdaten `arbeit/mess/lh-*.json`):

| Seite | Leistung | LCP | TBT | CLS | JS | gesamt |
|---|---|---|---|---|---|---|
| index | 95 | **2856 ms** (Ziel 2500) | 35 ms | 0,000 | 6,2 KB | 357 KB |
| schaden | 100 | 1232 ms | 73 ms | 0,001 | 6,2 KB | 256 KB |
| tesla | 100 | 1080 ms | 77 ms | 0,001 | 6,2 KB | 254 KB |
| leistungen | 100 | 1206 ms | 6 ms | 0,002 | 6,2 KB | 343 KB |
| kontakt | 100 | 1055 ms | 0 ms | 0,001 | 6,2 KB | 284 KB |

Zugänglichkeit 100, Praxis 100 auf allen; SEO 66 allein wegen `noindex` (gewollt). Abweichung LCP Start: Bild (66 KB) und zwei Schriftdateien (zusammen ~200 KB) teilen sich die gedrosselte Leitung; Teilmengen der Schrift hätten die OFL-Schrift mit reserviertem Namen «Mona» verändert, darum nicht gemacht. Labor, kein Feldwert.

## Ausgabe der Prüfwerkzeuge (Endstand)

```
pruefen.cjs --selbsttest   → Selbsttest bestanden: Das Werkzeug findet alle eingebauten Fehler.
pruefen.cjs projekt.json   → 45 Prüfungen, 0 Fehler, 0 nicht geprüft        (arbeit/pruefen-ausgabe.txt, .json)
slop-de.js seite/dist      → Dateien 8, Fehler 0, Warnungen 2 (Zitat)       (arbeit/slop-ausgabe.txt)
vergleichen.cjs            → Vorlagen-Signale: keine; 8 Masse ausserhalb    (arbeit/vergleichen-ausgabe.txt)
kunde.cjs selbsttest       → alle 3 eingebauten Fehler gezeigt              (arbeit/kunde-selbsttest.txt)
axe-core 4 (eigenes Skript)→ Summe Verstösse: 0                             (arbeit/axe-ausgabe.txt)
bewegung.cjs (eigenes)     → 1 Animation (strokeDashoffset, 700 ms), ruhig 0 (arbeit/bewegung-ausgabe.txt)
```

Unterwegs gefundene und behobene Fehler: Fehlermeldung verschob den Senden-Knopf (27 px, dann 4 px durch dickeren Rand) · Fokus sprang am Handy unsichtbar auf das erste Fehlerfeld · Kreis-Animation mit `pathLength` und `non-scaling-stroke` zeichnete falsch (Bildfolge) · Bild im ersten Bildschirm zu klein, Leerfläche über p75 (Messung) · LCP Start 3,6 s → 2,86 s · Zeiten an zwei Stellen von Hand statt aus `betrieb.json`.

## Lücken (sichtbar als Satz auf der Vorschau oder im Zusagen-Blatt)

Antwortfrist nach der Meldung · Preise · Wochenende, Feiertage, Betriebsferien · Nachweis Tesla Approved Body Shop · Einwilligung der drei Bewertungsverfasser · Bildrechte · Umfang Alufelgen und Folierung · Freitag 17.15 oder 17.30 Uhr · Pflege nach dem Livegang · Hosting und Datenschutzerklärung · Logo als Vektordatei · Fototag · Endpunkt für die cookielose Zählung.

## Was nicht geprüft ist

Echte Geräte, Safari/iOS (auch `mailto:` mit Anhängen am iPhone), Firefox, WebKit; Verhalten, wenn kein E-Mail-Programm eingerichtet ist (Rückfall: Text kopieren, Telefon); Menschen (Betrieb, Kundschaft); Juristin (UWG zur Tesla-Angabe, DSG); Geschmack und Wirkung (alle blinden Tests). **Ein Teil der Vorschau ist ohne Freigabe nicht livefähig** (P3 Nr. 13).

## Lektion (Format lektionen.md, knapp)

Ein Bau ohne Unteragenten erfüllt alle maschinellen Schwellen (45/45, axe 0, Lighthouse 95 bis 100) und sagt trotzdem nichts über die Note. Die Messung (`vergleichen.cjs`) fand vor jedem Blick von aussen das gleiche Muster wie bei der früher durchgefallenen Carrosserie-Probe (kleines Bild, viel Leerfläche); die Bildfolge fand einen Fehler, den das Bildschirmfoto nicht zeigte (Kreis zu früh sichtbar).
