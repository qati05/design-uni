# Schritt 13 · Editor `/admin/`, Cloudflare Access, Hinweis-Vorlagen

**Ziel (BAUPLAN 4.1, 4.2, 4.7):** kleiner Editor für Zeiten, Ferien, Team, Inhaber-Satz, Hinweise und den
Bewertungen-Schalter; Speichern als Commit im Repo (GitHub Contents-API) hinter Cloudflare Access; feste
Hinweis-Designs im Stil C. Keine Datenbank, keine neue Laufzeit-Bibliothek (nur Web Crypto und fetch).

## Geändert

**Schema (`gemeinsam/site.ts`)**
- Neu `hinweise: [{ art: hagel|ferien|geschlossen|aktion|info, form: banner|popup, titel ≤50, text ≤160 (ohne `<`/`>`),
  link aus HINWEIS_LINKS oder leer, von, bis }]`, höchstens 3, höchstens ein Pop-up, Pop-up nur für `hagel`/`aktion`.
- Migration per Transform: das alte Einzelfeld `hinweis` wird zu einem `info`-Banner in `hinweise` (und entfernt).
  Die bestehende `site.json` (ohne `hinweise`, `hinweis.aktiv: false`) bleibt gültig und ergibt eine leere Liste.
- Helfer `heuteZuerich()` (ISO-Datum Europe/Zurich) und `sichtbareHinweise(liste, heute)` (Filter `von ≤ heute ≤ bis`).
- `TEAMFOTO` erlaubt jetzt zusätzlich `.jpg` (der Editor legt Teamfotos als JPEG ab).
- `siteSchema` ist ein Transform; die Felder liegen zusätzlich als `siteFelder` (für den Editor-Abgleich).

**Hinweis (`src/components/Hinweis.astro`, `public/js/klar.js`, `public/css/klar.css`)**
- Je Art ein festes Design (Farben/Symbole nach 4.2): hagel = Akzentblau, ferien = Papier + Kalender,
  geschlossen = Tinte dunkel + Schloss, aktion = Papier mit Akzentlinie + Stern, info = Grund + i.
- Banner über dem Kopf, schliessbar (Merker in `sessionStorage`, ohne Personendaten); der Kopf rückt um die
  Banner-Höhe nach unten (`--hinweis-hoehe`, Fallback per `:has()` ohne JS).
- Der Build zeigt nur Hinweise im Zeitraum (Europe/Zurich); `data-von`/`data-bis` erlauben `klar.js`, ausserhalb des
  Zeitraums zusätzlich im Browser auszublenden (Fallback, falls der nächtliche Neubau ausfällt).
- Pop-up als `<dialog>`: erst nach 2 s, einmal pro Sitzung, Esc schliesst, Fokus zurück (nativ), **nie** auf
  `/schaden-melden/`. Reduced Motion ohne Weg (nur Einblenden unter «keine Vorgabe»).

**Login und Speichern (`gemeinsam/access.js`, `gemeinsam/github.js`, Functions)**
- `access.js`: prüft `Cf-Access-Jwt-Assertion` (RS256), Schlüssel als JWKS von der Team-Domain mit Zwischenspeicher
  im Function-Speicher; prüft `iss`, `aud = ACCESS_AUD`, `exp`. Fehlt etwas → `null` (Function antwortet 401).
  Gibt die Mailadresse nur für die Commit-Nachricht zurück, loggt sie nicht.
- `github.js`: `lesen`/`schreiben` über die Contents-API mit `GITHUB_TOKEN`/`GITHUB_REPO`/`GITHUB_ZWEIG`.
  Allowlist: nur `src/daten/site.json` (Pfad aus `GITHUB_SITE_PFAD`) und `public/bilder/team/<slug>.jpg`. 409/422 → `konflikt`.
- `functions/api/admin/laden.js` (GET: site + sha), `speichern.js` (POST: Origin, Access, zod, SHA-Konflikt 409,
  Commit «Editor: <Bereich> geändert durch <mail>»), `foto.js` (POST: Access, Magic Bytes, ≤ 400 KB, Slug aus dem
  Namen, EXIF/IPTC entfernt, nie der Originalname).

**Editor (`src/pages/admin/index.astro`, `public/js/admin.js`, `public/css/admin.css`)**
- `noindex`, eigene enge CSP (`script-src 'self'; connect-src 'self'; frame-ancestors 'none'`, gesetzt in `_headers`
  über `astro/bau/dateien.mjs`), `X-Robots-Tag: noindex`, `Cache-Control: no-store`; `/admin/` ist aus der Sitemap.
- Reiter Zeiten, Ferien, Team, Inhaber, Hinweise, Bewertungen und Platzhalter «Bewertung anfragen» (Schritt 14).
  Vanilla-JS, kein Inline-Skript. Hinweis-Vorschau in derselben C-Gestaltung. Teamfoto im Browser auf 800 px JPEG
  verkleinert (Canvas, entfernt EXIF). Speichern → Toast «Gespeichert. Die Website ist in etwa 1 bis 2 Minuten aktuell.»
  Bewegung nach 4.7 (ruhig, Reduced Motion statisch). Lokale Attrappe nur mit `ADMIN_LOKAL=1` im Dev-Modus, im Build nie.

**Doku (`EDITOR.md`)** – Einrichtung auf den Konten von Auto Speedy (GitHub-Repo, Fine-grained Token Contents r/w,
Cloudflare-Pages-Umgebungsvariablen, Access-Anwendung für `/admin/*` und `/api/admin/*` mit Einmal-Code,
Cron-Trigger 00:05 über den Deploy-Hook). Nur Namen, keine Werte.

**A-Linie (Sveltia-Fallback)** – `astro/bau/editor.mjs` kennt das neue `hinweise`-Feld; `astro/test/site.test.mjs`
prüft die Feldparität gegen `siteFelder`.

## Umgebungsvariablen (nur Namen, keine Werte)

`GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_ZWEIG` (optional `GITHUB_SITE_PFAD`), `ACCESS_TEAM`, `ACCESS_AUD`
(optional `ERLAUBTE_HERKUNFT`).

## Prüfungen

- `npm run build` (astro-klar): grün, 14 Seiten (inkl. `/admin/`).
- `npm test` (astro-klar): **97/97 grün** – inkl. neu:
  - `hinweise.test.mjs`: Schema, Migration, Zeitraum (im/vor/nach), Pop-up-Regeln, max 3.
  - `access.test.mjs`: selbst erzeugter RSA-Schlüssel – gültig, falsches `aud`, abgelaufen, falscher `iss`, manipulierte Signatur.
  - `github.test.mjs`: Allowlist, SHA, 409 als `konflikt` (fetch-Attrappe, keine echten Aufrufe).
  - `functions-admin.test.mjs`: 401 ohne Access, falsches `aud`, 403 Herkunft, 422 zod, 409 Konflikt, Foto (Magic Bytes,
    Grösse, Slug statt Originalname).
  - `hinweis-browser.test.mjs`: jede Art mit festem Design, abgelaufene Hinweise erscheinen nicht, Banner schliessbar,
    Pop-up nach 2 s / einmal pro Sitzung / Esc / nie auf `/schaden-melden/`; Admin-Seite ohne Inline-Skript und ohne
    CSP-Fehler; `dist` ohne `GITHUB_TOKEN`/`ACCESS_AUD`.
- `npm test` (astro, A-Linie): 36/36 grün.
- Kein Eszett in `src`, `public`, `functions`, `gemeinsam/*` (de-CH; «ß» in `foto.js` nur als `ß`-Escape).
- Keine echten GitHub- oder Mail-Aufrufe in Tests (fetch-Attrappe, selbst erzeugter Schlüssel).

## Screenshots (`vorschau/c/`)

- `13-hinweis-banner-desktop/-handy.png` – Banner hagel/geschlossen/info gestapelt über dem Kopf.
- `13-hinweis-popup-desktop/-handy.png` – ferien-Banner + aktion-Pop-up (`<dialog>`) nach 2 s.
- `13-admin-desktop/-handy.png` – Editor-Hülle mit allen Reitern.
- `13-admin-hinweise-desktop.png` – Reiter «Hinweise» mit Eintrag und Live-Vorschau im C-Stil.
- (Die Hero-Korrektur bleibt erhalten: h1 «Qualität, die man sieht und fährt.», Lead mit Ersatzwagen auf Anfrage,
  Faktenleiste-Zelle «Ersatzwagen», Tesla/Zulassung – unverändert.)

## Offen / Hinweise

- `node bau/pruefen-seiten.cjs` und `impeccable detect` brauchen in dieser Umgebung einen Preview-Server bzw. die
  Freigabe zum Ausführen des externen Binaries; die gleichwertige CSP-/Konsolen-Abdeckung liegt in den Browser-Tests.
  Bitte beim nächsten Durchlauf mit laufendem Preview-Server bzw. mit impeccable prüfen.
- Die lokale Attrappe (`ADMIN_LOKAL=1`) ist nur im Dev-Modus aktiv; im statisch ausgelieferten `/admin/` erscheint
  ohne Access/Server der Hinweis «Keine Verbindung zum Server. Vorschau ohne Speichern.».
