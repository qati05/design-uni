---
name: web-uni
description: Verfahren, um für eine Website-Aufgabe selbst den besten technischen Weg zu wählen und zu bauen, statt den einfachsten oder den modischsten: Stack (statisch, Astro oder Eleventy, Next.js und React, SvelteKit, Baukasten oder CMS), Bewegung und 3D (CSS, View Transitions, GSAP, Motion, Lenis, Video, WebGL mit three.js und React Three Fiber, WebGPU), Bilder, Formulare, Hosting, Geschwindigkeit, Barrierefreiheit, Messung. Nutzen, wenn eine Website oder Landingpage gebaut, umgebaut oder technisch beurteilt werden soll und der Stack, eine Animation oder ein 3D-Element entschieden werden muss; wenn ein Kunde «etwas Besonderes» will; wenn gemessen werden soll, ob sich eine Technik lohnt. Gedacht zusammen mit design-uni (Gestaltung) und text-uni (Text und Suche). Jede Aussage trägt ein Kennzeichen, ob sie gebaut und gemessen, gelesen oder nur angenommen ist.
---

# Web-Uni: Den besten Weg bauen, nicht den einfachsten

`design-uni` entscheidet, **wie es aussieht**, `text-uni`, **was dasteht**, `web-uni`, **womit und wie es gebaut wird**. Der Wunsch des Kunden gibt das Ziel vor; der Stack ist das Mittel. Der Skill verlangt zwei Dinge zugleich, die sich oft widersprechen: **nicht den einfachsten Weg nehmen, nur weil er einfach ist**, und **nicht die auffälligste Technik, nur weil sie möglich ist**. Gewählt wird, was den Wunsch am besten erfüllt, solange der Betrieb es tragen kann (Pflege, Kosten, Geschwindigkeit).

Merksatz: *Technik ist gut, wenn der Besucher sie nicht bemerkt, ausser sie ist der Grund, warum er bleibt.*

## Wie man diese Datei liest

- Die Schritte laufen der Reihe nach, jeder endet mit einem **Prüfpunkt (V0 bis V8)**. Fällt einer durch, geht es einen Schritt zurück.
- **Kennzeichen** an jeder Aussage in `referenzen/`:

| Kennzeichen | Bedeutung |
|---|---|
| `[gebaut und gemessen · Datum]` | in diesem Repo gebaut und mit einem Werkzeug gemessen; die Zahl steht mit Befehl in [messungen.md](referenzen/messungen.md) |
| `[gelesen · Quelle, Datum]` | in der genannten Quelle gelesen, nicht selbst gebaut |
| `[Annahme]` | eigene Ableitung oder Arbeitsgrenze, ungeprüft |
| `[nicht gebaut]` | ein Stack oder eine Technik, die hier genannt, aber noch nie gebaut wurde; kein Urteil erlaubt |

- **Versionen veralten schnell.** Vor jedem Bau: Versionen in `package.json` lesen, die **aktuelle** Dokumentation dieser Version lesen, nicht aus dem Gedächtnis arbeiten. Die Tabelle in [stacks.md](referenzen/stacks.md) ist ein Stand vom 1. November 2026.
- **Selbstbewertung zählt nicht.** Urteile über Wirkung (gefällt, wirkt hochwertig, lohnt sich) kommen aus der blinden Bewertung von `design-uni` oder aus einem Test mit Menschen; Urteile über Geschwindigkeit und Zugänglichkeit kommen aus Messungen.

## Grundregeln

1. **Der Wunsch des Kunden geht vor, mit offenem Preis.** Will der Kunde Bewegung oder 3D, wird es gebaut, wenn die Kosten benannt sind: Gewicht in KB, Auswirkung auf LCP und TBT, Pflege, Geräte, die es nicht tragen. Der Kunde entscheidet mit diesem Blatt, nicht ohne.
2. **Inhalt zuerst, Bewegung danach.** Alle Inhalte, Telefon und Formular funktionieren **ohne JavaScript** und **ohne WebGL**. Bewegung und 3D sind eine Verbesserung, kein Träger (progressive Verbesserung).
3. **Foto zuerst, Szene später.** Das grösste Element im ersten Bildschirm (LCP) ist ein Bild oder Text. Szenen laden erst nach dem LCP und nur, wenn Bewegung erlaubt und die Technik da ist.
4. **`prefers-reduced-motion` und Energie.** Unter reduzierter Bewegung läuft nichts von selbst. Auf Geräten mit schwacher Grafik oder Sparmodus wird die Szene nicht gestartet.
5. **Keine fremden Hosts ohne Not.** Schriften, Skripte und Modelle liegen auf dem eigenen Server (Datenschutz, DSG, Geschwindigkeit).
6. **Messen, bevor man behauptet.** Eine Technik gilt als «gut» erst nach Messung (V5) und, wo es um Wirkung geht, nach dem blinden Test (V6).
7. **Der Betrieb muss es pflegen können.** Wer ändert Öffnungszeiten, Fotos, Team, Preise? Ist die Antwort «nur ein Entwickler», ist das ein Kostenpunkt und wird dem Kunden gesagt.
8. **Entscheide des Auftraggebers** (Stack, Hosting, Marke, Budget) gehen jeder Regel hier vor und stehen mit Quelle im Entscheidblatt.
9. **Nichts geht live ohne Freigabe.** Gebaut wird eine Vorschau (`noindex`).
10. **Geschäftswirkung vor Millisekunden, Organisation vor Technik.** Ein Besucher wird zur Anfrage durch Verständlichkeit, Vertrauen und einen kurzen Weg zum Ziel, und die Anfrage wird zum Auftrag durch das, was im Betrieb danach geschieht (wer liest sie, wie schnell kommt die Antwort, was folgt). Ladezeit ist eine **Schwelle** (Hygiene: ab «gut» im Sinne von Core Web Vitals genügt es), kein Wettbewerb: Weitere Millisekunden erzeugen nicht automatisch mehr Anfragen. Der Skill darf deshalb Technik **nicht** allein mit Tempo begründen. Jeder Stack-Entscheid braucht mindestens einen Grund aus der **Organisation** (Pflege, Abläufe, Anfragekette), siehe Schritt 0 Punkt 11 und Schritt 7.

## Schritt 0 · Brief lesen: Anforderungsblatt

Aus Gespräch, Website und Unterlagen. Jede Zeile `[Fakt · Quelle]`, `[Annahme]` oder `[Lücke]`.

1. **Ziel:** Anruf, Anfrage, Buchung, Kauf, Bild? Was ist ein Erfolg?
2. **Wunsch des Kunden** in seinen Worten («sauber, informativ, einfach», «etwas, das man nicht vergisst», «wie die Seite von X»). Vorbilder und Gegenbilder.
3. **Besucher und Geräte:** Anteil Handy, Alter der Geräte, Netz (Land, Berge), Sprachen.
4. **Inhalte:** Seiten, Fotos, Videos, 3D-Modelle (gibt es welche oder müssen sie entstehen?), Preise, Termine.
5. **Funktionen:** Formular, Terminbuchung, Anmeldung, Zahlung, Shop, Mehrsprachigkeit, Suche, Karte, Chat.
6. **Pflege:** Wer ändert was, wie oft, mit welchen Kenntnissen? (Heute Wix, WordPress, Datei?)
7. **Budget und Frist:** Bau und laufende Kosten.
8. **Recht und Daten:** Land (Schweiz: DSG, UWG), Hosting-Standort, Cookies, Anfragen speichern ja oder nein.
9. **Bestand:** alte Adressen für Weiterleitungen, bisherige Rankings, Konten.
10. **Messung:** Welche Zahlen zählen nach dem Livegang? Anfragen und Aufträge zählen mehr als Ladezeit.
11. **Organisation nach der Anfrage (Anfragekette):** Wo kommt eine Anfrage an (Postfach, Telefon, System)? Wer liest sie, zu welchen Zeiten? Wie schnell wird geantwortet (heute und gewünscht)? Was geschieht danach (Rückruf, Termin, Offerte, Besichtigung)? Wer pflegt Bewertungen, Google-Profil, Zeiten? Ohne diese Kette bringt die beste Seite nichts.

**V0 · Anforderungsblatt vollständig:** alle elf Punkte beantwortet oder als Lücke geführt; **Wunsch des Kunden** als Satz festgehalten.

## Schritt 1 · Fähigkeiten und Klassen

Aus dem Blatt wird abgeleitet, **was die Seite können muss**. Fünf Klassen (Einzelheiten und Stand: [stacks.md](referenzen/stacks.md)):

| Klasse | Gemeint | Typisch für |
|---|---|---|
| **A** statisch von Hand | HTML, CSS, wenig JS, ein Bauskript | wenige Seiten, selten Änderungen, ein Entwickler pflegt |
| **B** statischer Generator mit Inhaltsdateien | Astro, Eleventy und ähnliche | viele Seiten, Inhalte in Dateien oder CMS, schnell, wenig JS |
| **C** React-Framework | Next.js (App Router), alternativ SvelteKit, Remix, Nuxt | Konten, Shop, Vorschau für Redakteure, viel Zustand, dynamische Daten, grosse Teams |
| **D** Baukasten oder CMS | Webflow, Wix, Shopify, WordPress | der Betrieb pflegt selbst, Standardfunktionen reichen |
| **E** Erlebnis-Zuschlag | WebGL, WebGPU, grosse Animation, Video | wenn Bewegung oder 3D der Kern des Wunsches ist; wird **auf B oder C aufgesetzt** |

**V1 · Klasse begründet:** je gefordertem Merkmal steht, welche Klasse es verlangt und welche es nur erleichtert.

## Schritt 2 · Stack-Entscheid mit Gegenentwurf

Der Entscheid steht als Blatt `entscheid-stack.md`:

1. **Wahl** (Klasse und konkreter Stack mit Version).
2. **Weil-Sätze:** drei Gründe aus dem Anforderungsblatt, jeder mit Zeilenverweis, **davon mindestens einer aus der Organisation** (Pflege, Anfragekette, Team), nicht nur aus Technik oder Tempo.
3. **Gegenentwurf:** der zweitbeste Weg und **warum nicht**.
4. **Der einfachste Weg** (meist Klasse A oder D) und was der Kunde dabei **verliert**. Wenn nichts verloren geht, ist der einfachste Weg der beste.
5. **Kosten und Pflege:** Stunden Bau (Schätzung), laufende Kosten, wer pflegt.
6. **Umkehrbarkeit:** Was kostet ein Wechsel nach Schritt 4?

**Standard-Stack (Entscheid des Auftraggebers, 2. November 2026): Astro mit statischer Ausgabe**, Inhalte in Dateien, Gerüst in [vorlage-astro/](vorlage-astro/README.md). Dazu gilt: *ein Standard, zwei benannte Ausnahmen, kein Wechsel nach Laune.*
- **Ausnahme 1, Next.js:** nur bei Konten, Anmeldung, Shop, Buchung oder stark dynamischen Daten. Begründung: im Spike +133 KB JS und rund 1 s LCP bei gleichem Inhalt (messungen.md).
- **Ausnahme 2, Baukasten (Webflow, Wix, Framer):** nur wenn der Kunde ihn schon hat oder ausdrücklich verlangt, oder wenn er **ganz ohne Entwickler** pflegen will und das gesagt hat.
- **Jede Abweichung** steht mit einem «Weil»-Satz im Entscheidblatt. Ohne diesen Satz gilt Astro.
- **Die anderen Stacks bleiben im Werkzeugkasten** und werden nach dem gewählt, was der Kunde braucht oder erwartet (stacks.md, Klassen A bis E). Der Standard ist der Ausgangspunkt, kein Verbot.
- **Kombinationen** sind erlaubt, wenn der Wunsch zwei Dinge verlangt (zum Beispiel ruhige Firmenseite plus Kundenportal): [stacks.md](referenzen/stacks.md), Abschnitt «Zwei Stacks zusammen». Regel: **eine Seite, ein Stack**; die Grenze liegt an der Adresse (Unterseite oder Subdomain), nie mitten in einer Seite.
- **Gesichert** ist: Astro kostet bei statischer Ausgabe nichts gegenüber von Hand geschriebenem HTML und trägt ein echtes Projekt (12 Seiten, 50 Maschinenprüfungen bestanden). **Nicht gebaut** ist: das Bearbeiten durch Laien (Git-CMS) und Formulare mit Server.

**V2 · Entscheid geprüft:** ein zweiter Blick (Unteragent ohne Kontext oder eine Fachperson) bekommt nur das Blatt und das Anforderungsblatt und nennt den stärksten Einwand. Der Einwand wird beantwortet oder der Entscheid geändert.

## Schritt 3 · Bewegung und 3D: Leiter statt Schalter

Jede Bewegung steigt eine Leiter. Ein Schritt höher kostet Gewicht, Pflege und Geräte ([animation-3d.md](referenzen/animation-3d.md)):

| Stufe | Technik | Gewicht (Annahme) | Wann |
|---|---|---|---|
| 0 | keine | 0 | Fakten und Dringendes (Notfall, Preis, Formular) sind der Star |
| 1 | CSS-Übergänge, `scroll-timeline` und `animation-timeline` | 0 KB JS | ein echter Handgriff, ein Strich, der gezeichnet wird |
| 2 | View Transitions zwischen Seiten | 0 bis 2 KB | Seitenwechsel sollen zusammenhängen |
| 3 | Bibliothek: GSAP, Motion, Lenis | 20 bis 90 KB JS | gebündelte Abläufe, die CSS nicht kann |
| 4 | Video, Lottie, Rive | Video MB, Lottie 50 KB | etwas Reales (Arbeit im Betrieb) oder eine Marke zeigen |
| 5 | WebGL: three.js, React Three Fiber, OGL, Shader | gemessen: kleine Szene +240 KB JS komprimiert und 3,4 s Blockierzeit im Labor ohne GPU ([messungen.md](referenzen/messungen.md)); echte Fahrzeugszene mehr | das Produkt ist 3D (Fahrzeug, Möbel, Gerät) oder die Seite soll «erleben» |
| 6 | WebGPU (mit WebGL-Rückfall) | wie 5 plus Pfade | nur wenn Rechenlast es verlangt (Partikel, Simulation); nicht für Optik allein |

**Entscheid je Bewegung** (Blatt `entscheid-bewegung.md`): Stufe, **was sie zeigt** (etwas Echtes aus dem Betrieb, sonst Wunsch des Kunden), **was sie kostet** (KB, LCP, TBT aus der Messung), **was ohne sie fehlt**, **Rückfall** (Foto statt Szene), **Abschalter** (reduzierte Bewegung, Energiesparmodus, schwache GPU).

**Aufstieg nur mit Beleg:** Von Stufe 4 aufwärts muss der Kunde das Kostenblatt unterschrieben haben, und die Wirkung wird blind geprüft (design-uni P5).

**V3 · Bewegung entschieden:** jede Bewegung hat ihr Blatt; keine Bewegung hält Inhalt zurück; ohne JS und ohne WebGL ist alles da.

## Schritt 4 · Bau

Gemeinsame Regeln, unabhängig vom Stack:

- **Tokens aus einer Quelle.** `tokens.json` (W3C DTCG) erzeugt das CSS; Farben, Abstände und Schriften werden **nicht** von Hand an zwei Stellen gepflegt (Lektion aus der Probe Auto Speedy, [lektionen.md](referenzen/lektionen.md)).
- **Bilder:** mehrere Breiten (`srcset`, `sizes`), moderne Formate, `width` und `height`, das LCP-Bild mit `fetchpriority="high"`, alles andere `loading="lazy"`; Metadaten entfernen.
- **Schriften lokal**, Teilmenge, `font-display: swap`, die Hauptschrift vorladen.
- **Formulare mit Server**, nicht nur `mailto:`: Prüfung am Server, Spamschutz ohne Fremd-Skript, Bestätigung, Anhänge bei Schadensmeldungen, Rückfall ohne JS.
- **Barrierefreiheit** (WCAG 2.2 AA): Tastatur, Fokus, Kontrast aus der Kaskade, Sprunglink, Zielgrösse, Reduced Motion.
- **Pflege:** Inhalte, die der Betrieb ändert (Zeiten, Team, Preise, Fotos), liegen in **einer** Quelle (Datei oder CMS), nie doppelt im Code.
- **Tests im Repo:** Playwright für Pfade, axe für Zugänglichkeit, Lighthouse CI für Budgets.

Stackspezifisches Vorgehen: [stacks.md](referenzen/stacks.md). Nur Stacks mit Kennzeichen `[gebaut und gemessen]` bekommen ein Rezept, die übrigen eine Warnliste.

**V4 · Bau:** Vorschau läuft, alle Pflichtpfade bestehen, Inhalte aus **einer** Quelle, Tokens erzeugen das CSS.

## Schritt 5 · Messung

Auf der gebauten Seite, mobil, drei Läufe, Median ([messungen.md](referenzen/messungen.md) zeigt Befehle):

| Kennzahl | Ziel `[Annahme]` | Werkzeug |
|---|---|---|
| Lighthouse Leistung (mobil, simuliert) | ≥ 90 | Lighthouse |
| LCP | ≤ 2,5 s | Lighthouse, später Feldmessung |
| TBT (Ersatz für INP im Labor) | ≤ 200 ms | Lighthouse |
| CLS | ≤ 0,1 | Lighthouse |
| JavaScript, komprimiert, vor dem LCP | ≤ 100 KB | Netzwerkprotokoll |
| JavaScript gesamt, komprimiert, normale Seite | ≤ 170 KB | Netzwerkprotokoll |
| Zusatz-JavaScript einer 3D-Szene, nach dem LCP, komprimiert | im Kostenblatt genannt, ≤ 600 KB `[Annahme]` | Netzwerkprotokoll |
| Zugänglichkeit | 0 Verstösse in axe, Tastatur-Durchgang | axe, Playwright |
| Browser | Chromium, Firefox, WebKit | Playwright |

**Tempo ist Schwelle, nicht Ziel.** Ist alles im Zielbereich, wird nicht weiter optimiert. Millisekunden darüber hinaus kosten Bauzeit und Pflege und erzeugen **keine nachgewiesenen** zusätzlichen Anfragen; die Belege für Ladezeit und Umsatz sind Fallstudien von Herstellern und korrelativ ([branchenwerte.md](referenzen/branchenwerte.md)). Aufwand geht dann in Verständlichkeit, Vertrauen und die Anfragekette (Schritt 7).

**Ehrlichkeit:** Messungen im Labor (simulierte Drosselung, Software-Grafik) sind **Hinweise**, keine Feldwerte. Ein 3D-Test ohne echte GPU zeigt Gewicht und Blockierung, nicht Bildrate.

**V5 · Gemessen:** jede Kennzahl hat Wert, Befehl und Datum; Abweichungen von den Zielen stehen im Bericht mit Grund.

## Schritt 6 · Wirkung: blind und mit Menschen

- **Blind** nach [design-uni/blindtest.md](../design-uni/referenzen/blindtest.md): erster Bildschirm, Bewegung (P5), ganze Website (P8). Dieselbe Seite **mit und ohne** die teure Technik, in getrennten Sätzen.
- **Mit Menschen:** fünf Personen, zwei Aufgaben (Hauptaufgabe, Auffinden einer Leistung), danach Fünf-Sekunden-Frage. Modell-Urteile gelten bei «gefällt» und «würde anfragen» nicht ([text-uni/abgleich-menschen.md](../text-uni/referenzen/abgleich-menschen.md)).
- **Regel:** Eine Technik, die in V5 teuer und in V6 nicht besser ist, fliegt raus, auch wenn der Kunde sie mochte. Er bekommt die Zahlen, und der Entscheid wird neu getroffen.

**V6 · Wirkung belegt oder Technik gestrichen.**

## Schritt 7 · Betrieb und Übergabe

**Anfragekette zuerst:** Für jeden Eingang (Formular, Telefon, E-Mail, Google-Profil) steht schriftlich: wer, wann, wie schnell, was danach. Die Seite verspricht nur, was die Kette hält (keine «Rückruf in 30 Minuten», wenn niemand abends liest). Untersuchungen zu Anfragen im Vertrieb zeigen, dass die **Antwortzeit** stark mit dem Erfolg zusammenhängt (MIT/InsideSales 2007, Harvard Business Review 2011), allerdings aus dem US-Vertrieb mit Herstellerdaten und nicht auf Carrosserien übertragen `[gelesen · Annahme der Übertragbarkeit]`. Bewertungen und Google-Profil pflegen gehört dazu.

Hosting (Standort, Kosten, Vorschau je Änderung), Domain, `https`, Weiterleitungen aus dem Umzugsblatt ([text-uni Schritt 7](../text-uni/SKILL.md)), Sicherungen, Zugänge (Konten gehören dem Betrieb), Pflegehandbuch mit Bildern («So ändern Sie die Öffnungszeiten»), Messplan.

**V7 · Betrieb:** Anfragekette schriftlich und vom Betrieb bestätigt; Vorschau und Livegang getrennt; der Betrieb hat alle Zugänge; ein Pflegehandbuch existiert und wurde von einer Person des Betriebs durchgespielt.

## Schritt 8 · Abliefern

`LIESMICH.md` mit Stack-Entscheid, Bewegungsblättern, Messprotokoll, Prüfpunkten V0 bis V7 mit Zahlen, Lektion. **Was nicht lief, heisst «nicht gelaufen»**, nie «bestanden».

**V8 · Bericht vollständig.**

## Was der Skill nicht kann

- **Keine Meisterschaft durch Text.** Dieser Skill ist ein Verfahren und ein Wissensstand, der mit jedem Bau und jeder Messung wächst. Stand heute: `[gebaut und gemessen]` sind nur statisches HTML (Klasse A) und Next.js 16 als statischer Export mit und ohne React-Three-Fiber-Szene (Klasse C und E). Alle anderen Stacks sind `[nicht gebaut]`.
- **Labor ist nicht Feld.** Alle Messungen laufen in einem Container mit Software-Grafik.
- **Wirkungsurteile von Modellen** sind Hinweise, keine Beweise.
- **Keine Rechtsauskunft.**

## Zusammenarbeit mit den anderen Skills

| | design-uni | text-uni | web-uni |
|---|---|---|---|
| Frage | Wie sieht es aus, kommt man ans Ziel? | Was steht da, wird es gefunden und zitiert? | Womit und wie wird es gebaut, was kostet es, hält es? |
| Entscheidet | Richtung, Form, Bewegung (ob und was) | Inhalt, Titel, Suche, Technik der Auffindbarkeit | Stack, Bewegungstechnik, Budgets, Betrieb |
| Darf nicht | Stack und Budgets erzwingen | Layout bestimmen | Gestaltung oder Inhalt ändern |

**Konflikt Bewegung:** design-uni sagt «keine oder eine Bewegung»; der Wunsch des Kunden darf mehr verlangen (Grundregel 4 von design-uni: Entscheide des Auftraggebers gehen vor). Dann entscheidet `web-uni` die **Technik**, `design-uni` bewertet die **Wirkung** blind. Kostet die Bewegung mehr, als sie bringt, gilt das Ergebnis aus V6.

## Übersicht der Referenzen

| Datei | Inhalt |
|---|---|
| [vorlage-astro/](vorlage-astro/README.md) | Gerüst für einen neuen Betrieb (Astro, eine Quelle für Angaben, Komponenten) |
| [stacks.md](referenzen/stacks.md) | Klassen A bis E, Entscheidbaum, Versionsstand, Status je Stack |
| [animation-3d.md](referenzen/animation-3d.md) | Leiter der Bewegung, Browser-Unterstützung, Rückfälle, Kostenblatt |
| [messungen.md](referenzen/messungen.md) | gebaute Spikes mit Zahlen, Befehle, Grenzen |
| [branchenwerte.md](referenzen/branchenwerte.md) | was im Web normal ist, was Konzerne einsetzen und wie sie messen |
| [lektionen.md](referenzen/lektionen.md) | was Bau und Messung gelehrt haben |
