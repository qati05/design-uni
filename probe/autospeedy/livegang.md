# Vor dem Livegang (nichts davon ist umgesetzt)

Die Vorschau geht **nicht** live (E4). Dieses Blatt hält fest, was vorher geschehen muss. text-uni Schritt 7 (TI1 bis TI37).

## 1. Vorschau-Sperren wieder entfernen

- Auf jeder Seite `<meta name="robots" content="noindex, nofollow">` entfernen (Bauskript `werkzeuge/bauen.cjs`).
- `robots.txt` ersetzen:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://www.autospeedy.ch/sitemap.xml
  ```
  Entscheid zum Training von KI-Modellen mit Datum (TI5): offen, beim Betrieb.
- `sitemap.xml` mit den 10 kanonischen Seiten (nicht `404.html`), Statuscode 200, ohne `noindex`-Seiten (TI8, TI11).
- `canonical` je Seite auf die endgültige Adresse; Weiterleitung `http` auf `https`, mit und ohne `www` genau eine Form (TI31 bis TI37).
- `LocalBusiness` (`index.html`, `kontakt.html`): `url` und `sameAs` ergänzen; **keine** `aggregateRating` und keine `review` (S24).

## 2. Weiterleitungen vom alten Wix-Auftritt (TI19 bis TI30)

Ein Sprung, Statuscode 301, passendes Ziel. Die alte Struktur hat 10 Seiten; Vorschlag `[Annahme]`:

| Alt (Wix) | Neu |
|---|---|
| `/` | `/` |
| `/dienstleistungen` | `/carrosserie` |
| `/auto-sppey-ag` | `/betrieb` |
| `/team` | `/betrieb` |
| `/services-4` (Stellenangebote) | `/betrieb` |
| `/kontakt` | `/kontakt` |
| `/kopie-von-spritzwerk` (Alufelgen) | `/felgen-folierung#felgen` |
| `/kopie-von-alufelgen-1` (Folierung) | `/felgen-folierung#folierung` |
| `/kopie-von-folierung` (Occasionen) | `/occasionen` |
| `/bilder-carrosserie` | `/carrosserie` |
| `/bilder-spritzwerk` | `/lackiererei` |

Dazu die Adresse, die **Tesla** bei seinen Weiterleitungen verwendet (Z10): Sie muss weiter funktionieren, am besten als 301 auf `/tesla` oder `/schaden-melden?tesla=1`. Alte Adressen mindestens ein Jahr behalten (TI28).

Auf dem Server: Adressen ohne `.html` anbieten (`/carrosserie` statt `/carrosserie.html`) und die Links der Seiten darauf umstellen.

## 3. Aufgaben, die nur der Betrieb oder Konten erledigen

- Google-Unternehmensprofil: Name wie am Schild und im Handelsregister (**Auto Speedy AG**), Kategorien (heute: Fahrzeughändler, Fahrzeuglackiererei, Autohändler, Autowerkstatt; **Carrosserie fehlt als Kategorie**, P5), Beschreibung sachlich, Leistungen wie auf der Website, **Antworten auf Bewertungen** (keine der 37 ist beantwortet, auch nicht die 1-Stern-Bewertung von 2017).
- local.ch: Eintrag ist «nicht beansprucht»; beanspruchen und Freitagszeit (17.15 oder 17.30 Uhr) angleichen. search.ch (Swisscom Directories) gleich.
- Eintrag bei Carrosserie Suisse prüfen (Website-Adresse, Fotos).
- Gleiche Firmendaten überall (P19, ZS6): Firma, Anschrift, Telefon, Zeiten.
- Bing-Webmaster und Search Console einrichten; Besitzer sind der Betrieb (M18).
- Hosting wählen, dann Datenschutzerklärung ergänzen (L17); Rechtsprüfung für Impressum und Datenschutz.
- **Tesla-Partnerstatus belegen** und klären, ob und wie das Tesla-Zeichen verwendet werden darf (L8).
- **Einwilligung** der Verfasser der drei Zitate oder Karten streichen (Z18 bis Z20).
- Formularweg: heute `mailto:`; besser ein Formular-Endpunkt mit Bestätigung und Anhang für Fotos. Entscheid beim Betrieb.

## 4. Was nach dem Livegang online geprüft wird (offline nicht prüfbar)

TI14, TI15, TI32 (Core Web Vitals im Feld), Index-Stand in Google und Bing, Weiterleitungsprobe der alten Adressen, Rich-Result-Test, Lighthouse und axe auf der echten Adresse, Test mit echten Geräten (iOS Safari, Android).
