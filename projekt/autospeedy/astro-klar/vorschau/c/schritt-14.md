# Schritt 14 · Bewertungsanfrage, QR, NFC-Ziel

**Ziel (BAUPLAN 4.4, 4.5, 4.6):** ein Knopf im Editor, der GENAU EINE neutrale Bewertungsanfrage per Mail
verschickt (keine Liste, keine Datenbank, keine Erinnerung, keine Anreize); eine Bewerten-Seite im C-Stil; ein
QR-Code und eine A6-Druckvorlage; NFC-Ziel-URL. Alles ohne Datenbank; das Cockpit wurde nicht angefasst.

## Geändert / neu

**Mailtexte (`gemeinsam/mailtexte.js`, neu)**
- `bewertungsAnfrage({ vorname?, domain, betrieb })` → neutraler Text für alle: «Guten Tag <Vorname>» bzw. «Guten
  Tag», Bitte um eine kurze Bewertung, Link `https://<domain>/bewerten/?q=mail`, DSG-Satz «Wir haben Ihre Adresse
  nur für diese eine Nachricht verwendet und nicht gespeichert.», Absender Auto Speedy mit Telefonnummer.
  Kein «Wie zufrieden waren Sie?», keine Gegenleistung, keine Anreize. Text und HTML.
- `domainAus(betrieb, bau)` → Domain aus `bau.adresse` (falls gesetzt), sonst aus `betrieb.mail`, Fallback
  `autospeedy.ch`. Ergebnis hier: **autospeedy.ch** (bau.adresse ist leer, Vorschau).

**Function (`astro-klar/functions/api/admin/bewertung.js`, neu)**
- `POST /api/admin/bewertung` hinter Cloudflare Access, Reihenfolge wie in Schritt 13: Origin (403) → Access (401)
  → Body `{ mail, vorname? }` → Adresse prüfen (Länge 3–254, Format; sonst 422) → Drossel → genau eine Mail.
- Drossel ohne Datenbank: Rate-Limiting-Binding `env.DROSSEL` mit festem Schlüssel `«bewertung»` (max 30 pro Tag im
  Konto konfiguriert); ohne Binding wird übersprungen. Bei erschöpftem Kontingent 429.
- Versand über `gemeinsam/mail.js`, Weg `MAIL_WEG_KUNDE` (Vorgabe **brevo**). **Nichts wird gespeichert** (kein
  GitHub-Aufruf, keine Liste), die Adresse wird nie geloggt.

**Editor (`astro-klar/public/js/admin.js`, `src/pages/admin/index.astro`)**
- Reiter «Bewertung anfragen» wird jetzt in JS aufgebaut (vorher Platzhalter): Feld Mail, optionales Feld Vorname,
  Knopf «Anfrage senden» (Rückmeldung als Toast «Anfrage gesendet. Es ging genau eine Mail raus.»).
- Warnung im Browser, wenn dieselbe Adresse in dieser Sitzung schon gesendet wurde: nur ein **djb2-Hash** in
  `sessionStorage` (`bewertung-gesendet`), nie die Klartext-Adresse. Zweiter Klick sendet trotzdem.
- Knopf «Per WhatsApp bitten» öffnet `wa.me` mit vorbereitetem Text und demselben Link mit `?q=whatsapp`
  (Nummer aus `betrieb.whatsapp.nummer`, als `data-wa` an die Seite gereicht; kein Inline-Skript).
- Download-Link auf `qr.svg` und Link auf die Druckvorlage `/bewerten/druck/` im selben Reiter.
- `index.astro` reicht `data-domain`, `data-wa`, `data-betrieb` an `admin.js` (CSP-sicher über Datenattribute).

**Bewerten-Seite (`src/pages/bewerten/index.astro`, C-Stil; vorher `src/pages/bewerten.astro`)**
- Neu im C-Stil (Hülle «Klar», `.abschnitt.textseite`, Knöpfe `knopf--akzent`/`knopf--kontur`). Google-Link aus
  `betrieb.bewertungen.google`; fehlt er (aktuell `null`), steht `Luecke.astro`. Facebook nur, wenn vorhanden.
- **Parameter `q` (nfc, qr, mail, whatsapp):** wird **nicht** ausgewertet/weitergegeben. Ein Zählweg ohne Datenbank
  ist nicht eingerichtet — der vorhandene `functions/api/zaehl.js` nutzt Supabase (= Datenbank) und ist bewusst nicht
  deployt. Cloudflare Web Analytics (BAUPLAN 4.6) würde die URL inkl. `q` ohne Cookies erfassen, ist aber nicht Teil
  dieses Schritts. Die `q`-Werte bleiben darum reine Quell-Markierung in der URL (für NFC/QR/Mail/WhatsApp lesbar),
  ohne eigene Zählung. Siehe «Offen».

**QR (`bau/qr.mjs`, neu) + Druckvorlage (`src/pages/bewerten/druck.astro`, neu)**
- `bau/qr.mjs` nutzt das npm-Paket **qrcode (1.5.4, exakt, devDependency)** und erzeugt `public/bewerten/qr.svg`
  für `https://autospeedy.ch/bewerten/?q=qr`. Läuft im `prebuild` (nach `bewertungen.mjs`) und einzeln
  (`node bau/qr.mjs`). `public/bewerten/qr.svg` ist in `.gitignore` (Build-Erzeugnis).
- `/bewerten/druck/`: A6-Druckvorlage (`@page A6`), QR + Satz «Danke für Ihren Auftrag. Eine Bewertung hilft uns.»,
  eigenständig, **noindex**. In `astro/bau/dateien.mjs` ergänzt: `/bewerten/druck/*` erhält `X-Robots-Tag: noindex`
  (auch im Livegang) und bleibt aus der Sitemap.

**NFC (nur Doku):** Die NFC-Tags beschreibt Medaur von Hand (NTAG213/215, App «NXP TagWriter», URL-Record
`https://autospeedy.ch/bewerten/?q=nfc`, danach schreibgeschützt/gesperrt). Keine Datei, kein Code im Repo.

## Tests

- `test/bewertung.test.mjs` — **10/10 grün** (lokal gelaufen): Mail-Attrappe (genau eine Mail), 401 ohne Access,
  403 fremde Herkunft, 422 bei falscher Adresse (mehrere Fälle), 429 bei Drossel, kein GitHub-Aufruf (= kein
  Speicher), Adresse wird nicht geloggt; Mailtext neutral mit Link und DSG-Satz **ohne Gating-Wort**
  (`Wie zufrieden`, `Gutschein`, `Rabatt`, `Gewinn`, `Verlosung`, `Gegenleistung`, `Prämie`, `5 Sterne`, …);
  «Guten Tag» ohne Vorname; `domainAus`-Reihenfolge.
- `test/qr.test.mjs` (neu) — rastert die erzeugte `qr.svg` mit sharp und liest sie mit **jsQR** zurück; der
  dekodierte Text muss `https://autospeedy.ch/bewerten/?q=qr` sein. **Braucht `npm install` (qrcode, jsqr).**
- Beide Testdateien sind ins `test`-Skript aufgenommen (vor den Browser-Tests).
- Kein Eszett in allen geänderten/neuen Dateien (geprüft, ss-Regel eingehalten).
- `node --check` grün für `mailtexte.js`, `bewertung.js`, `qr.mjs`, `admin.js`, `dateien.mjs`.
- `node bau/teilen.mjs` und `node bau/bewertungen.mjs` laufen grün.

## Noch auszuführen (in dieser Sitzung durch die Berechtigung gesperrt)

In dieser Umgebung sind `npm install`, `npm run build`/`astro build` sowie die Playwright-Schritte
genehmigungspflichtig und wurden nicht ausgeführt. Vor dem Commit bitte einmal laufen lassen:
1. **`npm install`** in `astro-klar` (zieht `qrcode@1.5.4` und `jsqr@1.4.0`; Vorgabe exakt).
2. `npm run build` (prebuild erzeugt `public/bewerten/qr.svg`; Seiten `/bewerten/`, `/bewerten/druck/`, `/admin/`).
3. `npm test` (astro-klar) — inkl. `bewertung.test.mjs`, `qr.test.mjs`, Browser-Tests (`hinweis-browser` lädt
   `/admin/` und prüft CSP/kein Inline-Skript; der neue Reiter läuft über `admin.js`).
4. Screenshots «14» über `node bau/fotos-c.mjs 14 /bewerten/ /bewerten/druck/ /admin/` (Reiter Bewertung) nach
   `vorschau/c/`. (Konnten ohne Build/Playwright-Freigabe nicht erzeugt werden.)

## Offen / Hinweise

- Zählung der Quellen (`q`) bewusst weggelassen (kein Zählweg ohne Datenbank). Wenn Auto Speedy Cloudflare Web
  Analytics einschaltet, erscheinen die `q`-Werte automatisch in den Seitenaufrufen — ohne weiteren Code.
- `betrieb.bewertungen.google` ist noch `null` → auf `/bewerten/` steht die sichtbare Lücke statt des Google-Knopfs.
- `betrieb.whatsapp.nummer_bestaetigt` ist `false`; der WhatsApp-Knopf nutzt die hinterlegte Mobilnummer.
- Cockpit nicht angefasst; keine echte Mail versendet; keine Datenbank, keine Liste, kein Zeitplan, keine Erinnerung.
- Umgebungsvariablen (nur Namen): `ACCESS_TEAM`, `ACCESS_AUD`, optional `ERLAUBTE_HERKUNFT`, `DROSSEL` (Binding),
  `MAIL_WEG_KUNDE` (Vorgabe brevo), `BREVO_SCHLUESSEL`, `MAIL_ABSENDER`, `MAIL_ABSENDER_NAME`.
