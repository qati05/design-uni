# Auto Speedy AG: Case Study und Medaur-Starter, Stand 03.11.2026

**Nichts ist live, nichts ist deployt, nichts ging an den Betrieb.** Alles liegt nur im Branch `claude/autospeedy-bau`.

## Umbau zum Starter (03.11.2026)
Regel: **Website kaufen, Cockpit mieten.** Die Website läuft ohne Cockpit; das Cockpit ist die eine Oberfläche für den Betrieb.
- **`astro/src/daten/site.json`**: alles, was der Betrieb selbst ändert (Zeiten, Feiertage, Hinweis, Team). Eine Prüfung für Bau, Cockpit und Editor in `gemeinsam/site.ts`; ungültig = Bau bricht ab, die alte Website bleibt online. `betrieb.json` (Fakten) bleibt.
- **Cockpit «Website pflegen»** schreibt `site.json` über die GitHub-API (Konfliktschutz über die Version); der Commit baut die Website neu. **Teamfotos liegen im Bild-Speicher R2, nie im Git**; in `site.json` steht nur der Verweis, «Foto entfernen» löscht das Bild wirklich.
- **Formular ohne Cockpit:** Ohne Supabase oder wenn es scheitert, kommt die ganze Meldung mit Fotos per Mail (Brevo). Ist das Cockpit eines Betriebs aus, wird gespeichert **und** die ganze Meldung gemailt. Bestätigung an den Kunden höchstens 2-mal in 24 Stunden an dieselbe Adresse (ohne Datenbank nur mit Turnstile), Cloudflare Turnstile gegen Missbrauch (wenn eingerichtet). Regeln für Website und Cockpit in `gemeinsam/meldung.ts`. Die Linie «Klar» nutzt dieselben Funktionen.
- **Automation «Auto fertig»** (einzeln kaufbar): Link schon in der ersten Mail, läuft auch ohne gemietetes Cockpit.
- **Mehrere Betriebe in einer Datenbank** (`cockpit/supabase/migrations/20261103100000_cockpit.sql`): Tabelle `betrieb` mit `aktiv`; `aktiv = false` sperrt den Login, Website und gekaufte Automationen laufen weiter. CSV-Export pro Betrieb nur fürs Studio (`/studio`).
- **Editor nach Kündigung:** Sveltia unter `/admin/`, Standard aus (`EDITOR_AKTIV=true` beim Bau). Anleitung für den Kunden: `UEBERGABE.md`.
- Entfernt: Authenticator-Code, Pflege-Tabelle, Teamfoto-Bucket, `pflege-holen.mjs`, Deploy Hook (der Commit baut neu), Auftrags-Mail beim Status «Auftrag» (Link kommt jetzt mit der ersten Mail).
- Geprüft: Website 25 Tests, Cockpit 45 Tests, Rauchprobe 72 Regeln, Ende-zu-Ende beider Abläufe grün; Website baut ohne Supabase-Variablen. Nicht geprüft: echte Dienste (Supabase, GitHub, R2, Brevo, Turnstile), Deploy, echte Handys.
- **Offen:** zweites Gerät (Befund 3) erst gegen echtes Supabase prüfen; siehe `cockpit/LIESMICH.md`.

## Neuen Kunden anlegen
1. **Website:** Repo aus diesem Starter, `betrieb.json` (Fakten), `texte.json`, `src/daten/site.json` (Startwerte) füllen. Cloudflare Pages mit dem Repo verbinden (Bau bei jedem Commit).
2. **Formular per Mail (immer):** in Cloudflare Pages `BREVO_SCHLUESSEL`, `MAIL_ABSENDER`, `MAIL_BETRIEB`, `ERLAUBTE_HERKUNFT`; gegen Missbrauch `TURNSTILE_SITEKEY` (Bau) und `TURNSTILE_SECRET`.
3. **Cockpit (wenn gemietet):** in Supabase `insert into betrieb (id, name, website_url, github_repo, github_pfad, automation_bewertung) values (…)`; Konten in `betrieb_mitglied`. Im Cockpit-Hosting `GITHUB_TOKEN_<ID>` (fein abgestuft, nur dieses Repo). In Cloudflare Pages `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `BETRIEB_ID`, `COCKPIT_URL`.
4. **Kündigung:** `update betrieb set aktiv = false`, CSV unter `/studio` an den Kunden. Teamfotos aus R2 in die Website-Dateien des Kunden (`public/bilder/team/`) legen und die Verweise in `site.json` auf `/bilder/team/…` umstellen; nach dem erfolgreichen Bau löscht Medaur die R2-Kopie [Entscheid · Roni, 03.11.2026]. Editor mit `EDITOR_AKTIV=true`, `EDITOR_REPO`, `EDITOR_PFAD` einschalten, `UEBERGABE.md` übergeben.

**Hinweise**
- **Start-Teamfotos:** Die Porträts unter `astro/public/bilder/team/` stammen von der alten, öffentlichen Website des Betriebs. Beim Einrichten ziehen sie nach R2 um (Verweise in `site.json` anpassen, Dateien aus dem Ordner löschen). Die Git-Historie wird nicht umgeschrieben, weil die Fotos ohnehin öffentlich waren [Entscheid · Roni, 03.11.2026].
- **Bestätigungsmail ohne Datenbank** nur mit Turnstile, sonst keine [Entscheid · Roni, 03.11.2026].
- **Dienstschlüssel von Supabase** (`SUPABASE_SERVICE_KEY`) nur serverseitig: in der Website-Funktion und im Cockpit nur für die Löschfrist der Fotos [Entscheid · Roni, 03.11.2026].
- **Offen:** Sveltia lädt Schriften und Symbole von jsdelivr (betrifft nur den Editor, nicht die Besucher). Später selbst ausliefern.

## Was gebaut ist (Überblick)
| Teil | Wo | Stand |
|---|---|---|
| Website (Astro, statisch), 14 Seiten inkl. Tesla, Flotten, Bewerten | `astro/` | gebaut, Prüfläufe grün |
| Schadenmeldung in 3 Tipps, Rückruf in einem Schritt, Senden über Website oder WhatsApp | `astro/src/pages/schaden-melden.astro`, `components/Rueckruf.astro` | gebaut, Ende-zu-Ende grün |
| Serverfunktionen: Meldung + Fotos ins Cockpit (Supabase), Hinweis-Mail ohne Personendaten, Zählung ohne Cookies | `astro/functions/api/schaden.js`, `zaehl.js` | gebaut, 18 Tests grün, **nicht deployt** |
| Werkstatt-Cockpit (Next.js, Muster qati05/medaur), **eine App für Handy und Computer** (installierbar): Mail-Code, Meldungen, Status bis Auftrag, Notizen, «Bewertung erbitten», Zahlen, **Website pflegen** (Zeiten, Feiertage, Hinweis, Team mit Fotos), Geräte | `cockpit/` | gebaut, 32 Tests, Rauchprobe 31 Regeln gegen Postgres 16, Ende-zu-Ende 28/28 grün, **nicht deployt**, Demo-Modus |
| Pflege: `site.json` im Repo, geändert im Cockpit (GitHub-API) oder nach Kündigung im Editor | `astro/src/daten/site.json`, `gemeinsam/site.ts`, `astro/bau/editor.mjs` | gebaut, getestet |
| AutoScout24-Widget, lädt erst nach Klick | `astro/src/components/FremdInhalt.astro` | gebaut, Widget-Code fehlt (Lücke) |
| Skizze für das Gespräch | Excalidraw im Chat; Video und Bilder in `vorschau/` | fertig |

## Zwei Gestaltungslinien
- **Lack** (`astro/`): Babyblau, Lackpartikel, kursive Titel. Vorschau `vorschau/auto-speedy-vorschau.html`, Demo `vorschau/auto-speedy-demo.html`.
- **Klar** (`astro-klar/`): ruhig, Vollbild-Foto, dunkle Lichtregel, eine Akzentfarbe. Vorschau `vorschau/auto-speedy-vorschau-klar.html`, Demo `vorschau/auto-speedy-demo-klar.html`, Prüfbericht `vorschau/klar/PRUEFBERICHT.md`.

## Noch vom Betrieb nötig
WhatsApp-Nummer (dass der Betrieb WhatsApp nutzt, ist laut Studio bestätigt) · wer im Team ein Cockpit-Konto bekommt · Rückruf-Zeit und wer Meldungen liest · Google-Link «Rezension schreiben» · AutoScout24-Widget-Code · Logo als Vektordatei · Rechte an Fotos und Einwilligung des Teams · Samstag, Feiertage, Ferien · Löschfrist für Meldungen · Konditionen für Firmenkunden, Ersatzwagen.

## Vor dem echten Betrieb (Freigabe des Studios)
Supabase-Projekt (Region Zürich) und Migration · Mail-Dienst mit SPF/DKIM/DMARC · Hoster und Domain · Datenschutzerklärung nachführen (Supabase, Mail-Dienst, AutoScout24) und Rechtsprüfung · WebAuthn-MFA (Supabase Beta) mit echten Handys prüfen · Bild-Speicher R2 und GitHub-Tokens je Betrieb einrichten. Details: `cockpit/LIESMICH.md`, `technik.md`, `PFLEGE.md`.

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
- Samstag, Feiertage, Betriebsferien, Notfall.
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
