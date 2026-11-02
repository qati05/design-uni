# Auto Speedy AG: Case Study, Stand 02.11.2026

**Nichts ist live, nichts ist deployt, nichts ging an den Betrieb.** Alles liegt nur im Branch `claude/autospeedy-bau`.

## Was gebaut ist (Überblick)
| Teil | Wo | Stand |
|---|---|---|
| Website (Astro, statisch), 14 Seiten inkl. Tesla, Flotten, Bewerten | `astro/` | gebaut, Prüfläufe grün |
| Schadenmeldung in 3 Tipps, Rückruf in einem Schritt, Senden über Website oder WhatsApp | `astro/src/pages/schaden-melden.astro`, `components/Rueckruf.astro` | gebaut, Ende-zu-Ende grün |
| Serverfunktionen: Meldung + Fotos ins Cockpit (Supabase), Hinweis-Mail ohne Personendaten, Zählung ohne Cookies | `astro/functions/api/schaden.js`, `zaehl.js` | gebaut, 18 Tests grün, **nicht deployt** |
| Werkstatt-Cockpit (Next.js, Muster qati05/medaur), **eine App für Handy und Computer** (installierbar): Mail-Code + Fingerabdruck/Gesicht, Meldungen, Status bis Auftrag, Notizen, «Bewertung erbitten», Zahlen, **Website pflegen** (Zeiten, Feiertage, Hinweis, Team), Geräte | `cockpit/` | gebaut, 30 Tests, Rauchprobe 27 Regeln gegen Postgres 16, Ende-zu-Ende 24/24 grün, **nicht deployt**, Demo-Modus |
| Pflege: vom Git-Editor (Decap) ins Cockpit verlegt; der Website-Bau holt sie | `astro/bau/pflege-holen.mjs`, `PFLEGE.md` | gebaut, 3 Tests |
| AutoScout24-Widget, lädt erst nach Klick | `astro/src/components/FremdInhalt.astro` | gebaut, Widget-Code fehlt (Lücke) |
| Skizze für das Gespräch | Excalidraw im Chat; Video und Bilder in `vorschau/` | fertig |

## Noch vom Betrieb nötig
WhatsApp-Nummer (dass der Betrieb WhatsApp nutzt, ist laut Studio bestätigt) · wer im Team ein Cockpit-Konto bekommt · Rückruf-Zeit und wer Meldungen liest · Google-Link «Rezension schreiben» · AutoScout24-Widget-Code · Logo als Vektordatei · Rechte an Fotos und Einwilligung des Teams · Samstag, Feiertage, Ferien · Löschfrist für Meldungen · Konditionen für Firmenkunden, Ersatzwagen.

## Vor dem echten Betrieb (Freigabe des Studios)
Supabase-Projekt (Region Zürich) und Migration · Mail-Dienst mit SPF/DKIM/DMARC · Hoster und Domain · Datenschutzerklärung nachführen (Supabase, Mail-Dienst, AutoScout24) und Rechtsprüfung · WebAuthn-MFA (Supabase Beta) mit echten Handys prüfen · Website-Neubau per Deploy Hook verbinden. Details: `cockpit/LIESMICH.md`, `technik.md`, `PFLEGE.md`.

---

# Auto Speedy AG: Vorschau, Stand 02.11.2026

**Nichts ist live, nichts ist freigegeben, nichts ging an den Betrieb.** Die Vorschau liegt nur in diesem Branch.

## Ansehen
- **`vorschau/auto-speedy-vorschau.html`**: eine Datei, im Browser öffnen, alle Seiten klickbar (Bilder und Schriften eingebettet, keine Verbindung nach aussen). Das Formular sendet in dieser Datei nichts und sagt das.
- `vorschau/bildschirme/`: Bildschirmfotos jeder Seite, Desktop 1440×900 (`-d`) und Handy 390×844 (`-m`), Startseite auch ganz (`-voll`).
- Quellcode: `astro/` (Astro 7.4.1, statisch). `cd astro && npm install && npm run build`, dann `dist/` mit einem lokalen Server öffnen.

## Schadenmeldung «in drei Tipps» (aktuell)
1 Was ist passiert (sieben Knöpfe) · 2 Fotos · 3 Kontakt, dann senden auf zwei Wegen: Website (mit Fotos; Serverfunktion gebaut und getestet, nicht deployt, in der Vorschau nur vorgeführt) oder WhatsApp (Nummer vom Betrieb zu bestätigen). Der E-Mail-Weg ist entfernt (Website-Versand geht ohnehin als E-Mail); mailto bleibt nur ohne JavaScript. Details: technik.md. Der Schadenplan ist jetzt eine freiwillige Hilfe in Schritt 1.

## Signatur: der Schadenplan (bisher)
Das Auto von oben, Blech für Blech mit Spaltmass: Auf der Startseite tippt man die Stelle an und landet in der Schadenmeldung mit dieser Stelle; im Formular wählt man Stellen am Auto; nach dem Absenden entsteht ein Schadenrapport mit Auto und Stellen. Details: richtung.md. Formular-Backend gebaut und getestet, nicht deployt: technik.md.

## Dunkel lackiert
Die Website folgt dem Dunkelmodus des Geräts; der runde Knopf im Kopf lackiert für den Besuch um. Beim Wechsel zieht der neue Lack mit Sprühnebel-Kante über die Seite.

## Seiten
Start · Schaden melden · Tesla · Carrosserie · Lackiererei · Felgen und Folierung · Occasionen · Team · Kontakt · Impressum (Entwurf) · Datenschutz (Entwurf) · 404.
«Schaden melden» und Telefon stehen auf jeder Seite im Kopf, am Handy in einer Leiste unten (Wunsch 1). Tesla ist im Menü, auf dem ersten Bildschirm und als Weg «Tesla beschädigt»; der Tesla-Knopf wählt im Formular «Tesla» vor (Wunsch 2).

## Änderungen nach der Rückmeldung des Studios (02.11.2026)
- Logo des Betriebs oben links statt des gesetzten Namens (Datei von autospeedy.ch, freigestellt; Vektordatei fehlt weiter).
- Tesla Approved Body Shop belegt (Logo auf autospeedy.ch, Bestätigung des Studios); auf Teslas eigener Seite nicht nachgeprüft (F14).
- Ganze Vorschau statt nur erstem Bildschirm.
- Neue Bildwahl: 25 aktuelle Werkstattfotos aus den Galerien des Betriebs (Defender in der Lichtkabine als Startbild, Fassade für Anfahrt, Arbeit an Fahrzeugen pro Leistung); das alte Hallenfoto von 2017 nur noch auf der Seite Carrosserie.

## Lücken (in der Vorschau gelb markiert)
- Dauer einer Reparatur, Ersatzwagen; besondere Tesla-Leistungen.
- Texte zu Felgen und Folierung (bisher nur Bilder).
- Samstag, Feiertage, Betriebsferien, Notfall; Freitag 17.15 (Website) gegen 17.30 (Instagram).
- Einwilligung der Mitarbeitenden zu Namen und Fotos; Rechte an allen Fotos schriftlich.
- Impressum und Datenschutz: Entwürfe, Rechtsprüfung nötig; UID nur aus Verzeichnissen; Hoster offen.
- Gründungsjahr (2017 im Register gegen «20 Jahre»), Bewertungen mit Stand.

## Bewusst nicht übernommen
«Beste Preise garantiert», «jahrzehntelange Erfahrung», «Spenglermeister» (unbelegt), Muster-Preise in US-Dollar der Baukasten-Seite «Book Online», Markenlogos, Stockfotos.

## Zusagen-Blatt (stimmt / ändern / streichen)
| # | Aussage | Quelle |
|---|---|---|
| Z1 | Die Abwicklung mit Ihrer Versicherung übernehmen wir. | Betriebs-Website |
| Z2 | Reparatur nach Herstellervorgaben, ausschliesslich Original-Ersatzteile. | Betriebs-Website |
| Z3 | Tesla Approved Body Shop. | Betriebs-Website, Studio |
| Z4 | Öffnungszeiten Mo bis Fr. | Betriebs-Website |

## Prüfstand
| Prüfung | Ergebnis |
|---|---|
| Bau, Stufe Gerüst | 0 FEHLER, 12 HINWEIS (Beschreibungen je Seite fehlen), gelaufen |
| Kontrast aus der Kaskade, alle 11 Seiten, 1440 und 390 px | 0 unter Soll (eigenes Skript) |
| Tote interne Links und Bilder | 0 |
| Überlauf quer, genau ein `h1` je Seite | keiner, ja |
| Einzeldatei: Klickpfad Start → Tesla → Schaden melden mit Tesla vorgewählt, Formular-Rückmeldung | läuft (Playwright, Handy) |
| Schadenplan: Stelle antippen → Formular mit Stelle, Umschalten im Plan, leer absenden, Rapport (Desktop, Handy, Einzeldatei) | läuft |
| Ohne JavaScript: Plan als Links, Formular mit Kästchen über mailto | läuft |
| Formular-Backend `npm test` | 10 von 10 grün; Ende-zu-Ende mit echter Browser-Anfrage: 200, Mail mit 2 Foto-Anhängen; nicht deployt |
| Meldung in drei Tipps: Startseite → Art → 2 Fotos → Kontakt → Website / WhatsApp, Fehlerfall Server, Handy und Desktop, Einzeldatei, ohne JavaScript | läuft |
| Bewegung: Reduced Motion 0 Animationen, nach 5 s nichts laufend | gemessen |
| Dunkel lackiert: Kontrast aller Seiten, Umlackieren per System und Knopf, Reduced Motion ohne Bewegung | gemessen, 0 Befunde |
| Navigation: Leistungen auf und zu (Klick daneben, Escape), Tesla-Abzeichen Desktop und Handy | läuft |
| Wörter im ersten Bildschirm | etwa 70, Richtwert 60 `[Annahme]`, Hinweis |
| `pruefen.cjs`, `slop-de.js`, Lighthouse, axe | **nicht gelaufen** |
| Blinde Bewerter, Kunden-Agenten, Menschentest, Safari, echte Geräte | **nicht gelaufen** |
| Rechtsprüfung | **nicht gelaufen** |

## Weitere Dateien
`fakten.md` · `rechte.md` · `entscheide.md` · `technik.md` · `richtung.md`
