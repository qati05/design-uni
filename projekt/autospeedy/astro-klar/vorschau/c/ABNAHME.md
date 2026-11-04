# Schritt 15 · Abnahme Entwurf C (astro-klar)

Stand: 04.11.2026. Gesamtprüfung für Reshat. Worktree `autospeedy-c`, Branch `claude/autospeedy-c`.
Regeln eingehalten: kein push/merge/deploy, keine neuen Pakete, keine Geheimnisse ausgegeben.
**Den Git-Commit macht der Bauleiter** – alle Änderungen liegen ungestaged vor (Liste am Ende).

---

## 1. Tests und Prüfskripte

| Prüfung | Befehl | Ergebnis |
|---|---|---|
| Teilen | `node bau/teilen.mjs` | grün (Bilder/Skripte aus ../astro) |
| Build | `npm run build` (Stufe geruest) | grün, 15 Seiten, 0 FEHLER / 16 HINWEIS (fehlende `description` – Gerüst-Stufe, erwartet) |
| Website-Tests | `npm test` (astro-klar) | **109/109 grün** |
| Seitenprüfung | `node bau/pruefen-seiten.cjs` (mit `CHROME`) | C-Seiten sauber; 2 Restpunkte ausserhalb C-Umfang, siehe unten |
| Tesla-Formular | `node bau/pruefen-tesla-formular.cjs` (mit `CHROME`) | **ALLES GRÜN** (Klar + Lack) |
| Bewegungstest | `test/bewegung.test.mjs` | **fehlt** – nie erstellt (offener Punkt aus Schritt 11), siehe unten |
| Functions/Editor | `npm test` (astro) | **36/36 grün** |
| npm audit (Prod) | `npm audit --omit=dev` astro + astro-klar | je **0 Schwachstellen** |

**pruefen-seiten – die 3 ursprünglich gemeldeten Punkte:**
1. `/` Pausier-Knopf «Anhalten» 21 px hoch (Tippziel < 40) → **behoben** (Trefferfläche jetzt ≥ 40 px, Optik unverändert, `public/css/klar.css:424`).
2. `m /flotten/` Überlauf (scrollWidth 2660) → **ausserhalb C-Umfang.** `/flotten/` ist eine Template-Seite (nicht in BAUPLAN 2, nicht in der C-Navigation, zuletzt im Grundbau 125d700 geändert). Sie importiert das astro-Linien-Partnerband (`../../../astro/src/components/Partnerband.astro`), dessen Laufband-Spur (`width:max-content`) hier keinen `overflow:hidden`-Rahmen der klar.css erhält. Nicht korrigiert (keine C-Lieferung; Fix würde eine fremdverwendete Komponente/Fremdseite berühren). Empfehlung: Bauleiter entscheidet.
3. `m /gibtsnicht/` Überlauf (980) → **Artefakt des Prüfservers.** `python3 -m http.server` liefert bei unbekannten Pfaden seine eigene 404-Fehlerseite (ohne Viewport-Meta → 980 px Default-Viewport), nicht `dist/404.html`. Die echte Astro-404 (`dist/404.html`) hat `width=device-width`. Kein echter Mangel.

**Bewegungstest:** `test/bewegung.test.mjs` und `vorschau/c/bewegung.md` wurden in Schritt 11 **nicht erstellt** (im Schritt-11-Bericht als «offen» vermerkt). Die Bewegungsregeln sind teilweise über `test/browser.test.mjs` abgedeckt (Federkurve am Knopf, Reduced-Motion ohne transform, Partnerband-Pause, Foto-Reveal, Slider-Kurven). Der eigenständige Sammeltest fehlt weiterhin. **Nicht im Abnahmeschritt nachgebaut** (gehört zu Schritt 11; ein hastig gebauter Playwright-Sammeltest gäbe trügerische Sicherheit). Entscheid Bauleiter.

---

## 2. Lighthouse (Handy und Desktop)

Gebaut aus `dist`, lokal ausgeliefert, `lighthouse@12`, Chrome `/usr/bin/google-chrome --headless=new --no-sandbox`.
Ziel: Performance ≥ 95, Accessibility 100, Best Practices ≥ 95. Berichte: `vorschau/c/lh-15-*.json`.

| Seite | Form | Performance | Accessibility | Best Practices | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | Handy | 92 | 100 | 96 | 3.2 s | 0.02 | 0 ms |
| `/schaden-melden/` | Handy | 94 | 100 | 96 | 2.9 s | 0 | 0 ms |
| `/tesla/` | Handy | 96 | 100 | 96 | 2.5 s | 0 | 0 ms |
| `/` | Desktop | 100 | 100 | 96 | 0.7 s | 0 | 0 ms |
| `/schaden-melden/` | Desktop | 100 | 100 | 96 | 0.6 s | 0.04 | 0 ms |
| `/tesla/` | Desktop | 100 | 100 | 96 | 0.6 s | 0 | 0 ms |

**Accessibility (Desktop) war zunächst 96–97** (`color-contrast`): Der Kopf-Knopf «Schaden melden» (`.knopf--akzent.kopf__aktion`) bekam auf Desktop dunklen Text (#1d1e20 auf Akzentblau, Kontrast 2.87) statt Weiss, weil `.kopf__rechts a:not(.k)` (für Navlinks) höhere Spezifität als `.knopf--akzent` hat und der Knopf die neue Klasse `.knopf` (nicht `.k`) nutzt. **Behoben:** Ausnahme `:not(.knopf)` ergänzt (`public/css/klar.css:148,149,359`). Jetzt überall 100. Auf Handy fiel es nicht auf, weil der Knopf dort ausgeblendet ist.

**Handy-Performance 92–96 (< 95 bei `/` und `/schaden-melden/`):** Rein LCP-bedingt (3.2/2.9 s) unter simulierter 4G/4×-CPU-Drossel auf einer gleichzeitig belasteten Box (zwei Server + Chrome). CLS ≈ 0 und TBT = 0 ms sind optimal; Hero-`preload`, `fetchpriority="high"`, `srcset/sizes`, `width/height` sind vorhanden (`dist/index.html`). Schritt 03 mass auf ruhiger Box 98 / LCP 2.3 s. **Kein Code-Defekt** – keine spekulative Optimierung im Abnahmeschritt; Watchpoint für den Livegang (echte Hero-Fotos statt Platzhalter-WebP).

---

## 3. Sicherheitsreview (jede Frage mit Beleg)

### CSP
- **script-src ohne `unsafe-inline`/`eval`:** `dist/_headers:5` → `script-src 'self'`; generiert in `astro/bau/dateien.mjs:38`. Test: `_headers: volle CSP ohne unsafe-inline/eval bei Skripten` (schluss.test.mjs).
- **Keine Inline-Skripte / keine `on…` / kein `javascript:`:** Test `kein ausführbares Inline-Skript, keine on…-Attribute` (statisch.test.mjs) und Admin: `Admin-HTML: Skript nur mit src, keine on…-Attribute` (hinweise/admin-Test). Einziges `is:inline` ist der JSON-LD-Datenblock (`src/layouts/Klar.astro:29`, laut BAUPLAN 0.2 erlaubt).
- **Fremdherkünfte nur aus Konfiguration:** `dateien.mjs:31–43` – Turnstile/Widget/Endpunkte stammen aus `env`/`betrieb.json`/`bau.json`, nichts fest verdrahtet.
- **Turnstile nur mit Sitekey:** `dateien.mjs:31` (`challenges.cloudflare.com` nur bei `TURNSTILE_SITEKEY`). Test in astro: CSP-Zeile ohne Sitekey enthält kein `challenges.cloudflare.com`.
- **Admin-CSP enger:** `dist/admin/.../_headers`-Block → `script-src 'self'; connect-src 'self'; frame-ancestors 'none'`, `noindex` (`dateien.mjs:99`, `dist/_headers:10`).

### Formular (`astro/functions/api/schaden.js`, in astro-klar re-exportiert)
- **Origin:** Z. 67–69 (403 bei fremder Herkunft).
- **Grösse:** Z. 71 (415 Nicht-multipart), Z. 73 (413 > `GRENZEN.gesamt` = 16e6).
- **Honeypot:** Z. 78 (Feld `website` gefüllt → still 200).
- **Zeitfalle:** Z. 45–55, 80–83 (HMAC `FORMULAR_HMAC`; < 4 s still 200, > 2 h → 422, kaputt → 422).
- **Drossel:** Z. 57–64, 86 (Workers-Binding `DROSSEL`, Schlüssel = SHA-256 der IP, nicht gespeichert; 429).
- **Magic Bytes:** Z. 105 `istJpeg(roh)` (→ 422); `gemeinsam/jpeg.js`.
- **EXIF entfernt:** Z. 106 `ohneMetadaten(roh)` (APP1/APP13 inkl. GPS raus). Test astro: `EXIF/GPS wird aus den Anhängen entfernt`.
- **Dateinamen verworfen:** Z. 106 (`foto-${i+1}.jpg`), Z. 111 (`fahrzeugausweis.jpg`). Test: `eine Mail mit 2 Fotos als Anhang (foto-1.jpg …)`.
- **Links begrenzt:** `pruefe()` in `gemeinsam/meldung.ts` (≤ 2 Links). Test astro: `… >2 Links in Bemerkung: 422`.

### Schlüssel und Zugriffe
- **Keine Datenbank / keine Speicherung:** `rg supabase|createClient|postgres functions ../astro/functions ../gemeinsam` → **nichts.** schaden.js speichert nichts (nur Mailversand).
- **Service-Key/Logs:** Keine Personendaten im Log (schaden.js loggt nur «Zeitfalle aus»); Betreff ohne Namen (`meldung.ts:67–69`).
- **`/api/admin/*` nur mit gültigem Access-JWT:** `gemeinsam/access.js:54–76` (RS256, `iss`, `aud=ACCESS_AUD`, `exp`); speichern.js Z. 20–21 → 401 ohne JWT. Tests: `access.js` (gültig / falsches aud / abgelaufen), `ohne Access → 401`.
- **GITHUB_TOKEN serverseitig + Pfad-Allowlist:** `gemeinsam/github.js:16–18` (`erlaubt()`: nur `site.json` + `public/bilder/team/<slug>.jpg`, kein `..`), Token nur in `env`. Tests: `Allowlist …`, `schreiben an einen nicht erlaubten Pfad wirft, ohne fetch`, `dist enthält keine Geheim-Werte (GITHUB_TOKEN, ACCESS_AUD)`.

### Pflege und Ausgabe
- **Editor schreibt nur site.json + Teamfotos, zod-geprüft:** `speichern.js:25` (`siteSchema.safeParse` → 422), Z. 31 (`schreiben(env, sitePfad(env), …)`); `foto.js` Allowlist + Magic Bytes + ≤ 400 KB + Slug statt Originalname. Tests: `foto: … unter <slug>.jpg … nicht unter dem Originalnamen`, `Editor: nur gültiges Repo und ein Pfad ohne «..»`.
- **Hinweis-Text und Zitat escaped:** Astro-Auto-Escaping über `{h.titel}`/`{h.text}` (`src/components/Hinweis.astro:42–44,66`) und `{stimme.text}` (`Inhaber.astro:18`); Schema verbietet zusätzlich `<`/`>` (`gemeinsam/site.ts`). `set:html` nur für festen SVG-Symbolsatz und JSON-LD, nie für Nutzertext.

### Google
- **Bewertungs-Schlüssel nicht in dist:** `bau/bewertungen.mjs:31–32` (Schlüssel nur in Build-Umgebung; FieldMask `rating,userRatingCount,googleMapsUri`, **ohne reviews**). Test: `dist enthält keinen Schlüssel und nicht den Header «X-Goog-Api-Key»`.
- **Keine Google-Anfrage ohne Klick:** Test `Bewertungen: ohne Klick keine Anfrage an *.google*` (browser.test.mjs:404).

### Mails
- **An den Betrieb ohne Personendaten (Betreff/Logs):** Betreff `meldung.ts:67–69` («Neue Schadenmeldung: <Art>», ohne Namen); Body als HTML vollständig escaped (`meldung.ts:118`); kein Personendaten-Log.
- **Bewertungsmail ohne Gating, eine pro Klick, keine Liste/Erinnerung:** `functions/api/admin/bewertung.js:2–4,22` (genau eine Mail, Drossel `DROSSEL` Schlüssel «bewertung», nichts gespeichert/geloggt). Tests: `gültige Adresse → 200 und genau EINE Mail (… kein Speicher)`, `Mailtext: neutral, mit Link und DSG-Satz, ohne Gating-Wort`, `ohne Access → 401`, `falsche Adresse → 422`.

### Abhängigkeiten
- `npm audit --omit=dev`: astro-klar **0**, astro **0** Schwachstellen.

---

## 4. Screenshots und Abweichungsliste

`node bau/fotos-c.mjs 15 / /tesla/ /admin/` → `vorschau/c/15-{start,tesla,admin}-{desktop,desktop-ganz,handy,handy-ganz}.png`.
- **`/admin/`** zeigt die statische Fassung ohne Daten (Reiter sichtbar, Banner «Keine Verbindung zum Server. Vorschau ohne Speichern.»); ohne `ADMIN_LOKAL`/Functions ist das korrekt.

**Startseite neben `referenz-c/entwurf-c-desktop.png` – Abweichungen (alle gewollt, Hero-Korrektur Bauleiter 04.11.):**
| Stelle | Entwurf C | Gebaut (gewollt) |
|---|---|---|
| h1 | «Carrosserie und Lack / *aus Altstätten.*» | «Qualität, / *die man sieht und fährt.*» |
| Lead | «Wir reparieren Unfallschäden … seit Oktober …» | «Carrosserie und Lack in Altstätten … Die Abwicklung mit Ihrer Versicherung übernehmen wir. Einen Ersatzwagen erhalten Sie auf Anfrage.» |
| Faktenleiste, 3. Zelle | «Team · 10 Leute, eine Werkstatt» | «Ersatzwagen · 6 Ersatzautos auf Anfrage, auch ein Tesla» (aus `betrieb.json`) |
| Bildunterschrift Hero | «B1 · Hand mit Poliermaschine …» | «Platzhalter von Pexels, wird durch ein eigenes Foto ersetzt.» |

Keine **ungewollten** Abweichungen im Layout (Kopf, Hero 7fr/5fr, Rahmen 4:5, Faktenleiste 4 Spalten, Knöpfe) festgestellt. Der Kopf-CTA ist nach dem Kontrast-Fix korrekt weiss auf Blau.

---

## 5. Eszett

`rg "ß" src public functions ../gemeinsam/*.ts ../gemeinsam/*.js dist/_headers` → **nichts gefunden** (de-CH ohne Eszett eingehalten).

---

## 6. Offene Punkte (BAUPLAN 6), Stand je Punkt

| # | Punkt | Stand |
|---|---|---|
| 1 | Fotos B1–B10, Shooting, Rechte | **offen.** B1 (Pexels) und B7 (Unsplash) als Platzhalter mit Credit unter `/bildnachweise/`; übrige als `.platz`-Platzhalter. |
| 2 | Partnerlogos (rechte.md: nur Text) | **abgebildet.** Schalter `PARTNER_LOGOS`, Vorgabe Text; Konflikt nicht eigenmächtig aufgelöst. |
| 3 | Pausier-Knopf Partnerband (WCAG 2.2.2) | **umgesetzt.** «Anhalten»/«Weiter», `aria-pressed`; Tippziel in Schritt 15 auf ≥ 40 px vergrössert. |
| 4 | «seit Oktober» / Tesla-Datum | **entschärft.** Neuer Lead ohne «seit Oktober» (Bauleiter-Korrektur); offen bleibt ein genaues Datum, falls gewünscht. |
| 5 | Tesla-Ablauf 01–03 bestätigen | **offen.** Vermerk «Entwurf: Ablauf vom Betrieb zu bestätigen.» sichtbar. |
| 6 | Google Place ID / Link | **offen.** Ohne Daten «–,– von 5»/Abschnitt entfällt; Link «Bewertung schreiben» aus `betrieb.bewertungen.google`, sonst Lücke. |
| 7 | Google-Nutzungsbedingungen | **offen (Medaur).** Umsetzung hält sich an «nur Note, Anzahl, Link». |
| 8 | Name/Satz Inhaber + Freigabe | **offen.** `stimme.freigegeben=false`, Platzhaltertext wörtlich aus dem Entwurf. |
| 9 | Einverständnis Teamfotos | **offen.** Nur Einträge mit `einverstaendnis=true` erscheinen; Teamband als Platzhalter. |
| 10 | Felgen-Fotos gleicher Winkel (B6) | **offen.** Repo-Bilder `felge-schaden`/`felge-fertig` mit Hinweis-Bildunterschrift. |
| 11 | Vektorlogo (SVG) | **offen.** PNG/WebP 144 px im Einsatz. |
| 12 | Cockpit vs. Editor | **entschieden 03.11.:** kein Cockpit, Git-Editor `/admin/` mit Cloudflare Access; Mail Betrieb über Cloudflare Email, Kundschaft über Brevo. Umgesetzt (Schritte 12–14). |
| 13 | Turnstile nur bei Spam | **aus.** Kommt nur mit `TURNSTILE_SITEKEY` in die CSP. |
| 14 | WhatsApp-Nummer bestätigen | **offen** (`nummer_bestaetigt:false`). WhatsApp-Weg im Editor vorbereitet. |
| 15 | Service-Key / RPC für Formular-Empfang | **gegenstandslos** ohne Datenbank; Mailversand serverseitig, Schlüssel nur in `env`. |
| 16 | «10 Leute» aktuell? | **bleibt** (fakten.md); auf der Startseite steht die Zahl im Teamband-Satz. |

---

## 7. Hinweise des Bauleiters / Umgebung

- **Cockpit:** `projekt/autospeedy/cockpit` unverändert gelassen; wird nicht gebaut/geprüft (Entscheid 03.11., 21:29). Darf im Status «rot» sein.
- **Browser für Prüfskripte:** `bau/pruefen-seiten.cjs` und `pruefen-tesla-formular.cjs` nutzen jetzt die Umgebungsvariable `CHROME` (z. B. `/usr/bin/google-chrome`, mit `--no-sandbox`), weil `chromium.launch()` ohne heruntergeladenen Playwright-Browser scheitert. Kein Browser-Download. `pruefen-tesla-formular.cjs` nimmt den Testfoto-Pfad zusätzlich aus `SCRATCH` (zuvor fest verdrahtet auf einen veralteten Pfad).
- **Keine neuen Pakete.** `package.json` unverändert.

## 8. Geänderte Dateien (ungestaged, Commit durch Bauleiter)
- `bau/pruefen-seiten.cjs` – `CHROME`-Env für den Browserstart.
- `bau/pruefen-tesla-formular.cjs` – `CHROME`-Env + `SCRATCH`-Pfad.
- `public/css/klar.css` – (a) Tippziel «Anhalten» ≥ 40 px (Z. 424); (b) Kopf-CTA-Kontrast: `.kopf__rechts a:not(.k):not(.knopf)` (Z. 148,149,359).
- Neu: `vorschau/c/ABNAHME.md`, `vorschau/c/15-*.png`, `vorschau/c/lh-15-*.json`.
