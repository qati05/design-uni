# Astro-Vorlage (web-uni)

Standard-Stack des Studios `[Hausentscheid · Studio, 02.11.2026]`: **Astro, statische Ausgabe**. Die Vorlage ist **Technik, nicht Gestaltung** (zusammenspiel Entscheid 7): Datenquelle, Layout mit Kopfdaten, Bau, Prüfungen und Gerüst-Seiten. Sichtbare Bauteile sind ungestaltetes, semantisches HTML. Form kommt aus der Richtung (design-uni), Text aus text-uni.

## Was sie liefert

- **Eine Quelle** in `src/content/`:
  - `betrieb.json`: Fakten (Name, Anschrift, Telefon, E-Mail, Zeiten), jede mit Quelle in `fakten.md` (text-uni).
  - `texte.json`: Wortlaut aus text-uni (Hauptaktion, Menü, Mikrotexte, Titel, Beschreibung und `h1` je Seite).
  - `bau.json`: Technik mit dem Schalter `vorschau`.

  Alle Felder sind leer. `""` heisst Pflicht, `null` heisst freiwillig und bewusst weggelassen.
- **Prüfungen beim Bau** (`bau/daten.mjs`, `bau/dateien.mjs`) mit zwei Stufen (zusammenspiel Teil 7). FEHLER bricht den Bau ab und nennt jedes Feld; HINWEIS wird gemeldet, der Bau läuft weiter.

  | Prüfung | `stufe: geruest` (Gerüst, Vorschau) | `stufe: abgabe` und Livegang |
  |---|---|---|
  | Fakten in `betrieb.json` leer (Name, Telefon, Anschrift …), falsches Format (Telefon `+41…`, E-Mail) | FEHLER | FEHLER |
  | Wortlaut ausserhalb der Seiten leer (Hauptaktion, Menü, Mikrotexte) | FEHLER | FEHLER |
  | `titel` und `h1` je Seite leer (Entwurf aus text-uni TP2) | FEHLER | FEHLER |
  | Beschreibung leer oder ausserhalb 110 bis 155 Zeichen (S12) | HINWEIS | FEHLER |
  | Rechtsseiten Impressum und Datenschutz: Einträge leer oder Seite ohne Inhalt | HINWEIS | FEHLER |
  | Titel über 65 Zeichen (S3) oder doppelt (S1) | HINWEIS | FEHLER |
  | Titel ausserhalb 40 bis 60 Zeichen (S3) | HINWEIS | HINWEIS |
  | interne Links mit Weiterleitung oder ohne Ziel (TI24) | FEHLER | FEHLER |

  Die Stufe steht in `bau.json` (`stufe`), die Umgebungsvariable `STUFE` geht vor (`npm run bau:abgabe`). Mit `vorschau: false` prüft der Bau immer wie `abgabe`.
- **Adressen ohne Weiterleitung:** Verzeichnisformat, Datei `kontakt/index.html`, Link `/kontakt/`. Cloudflare Pages leitet `/kontakt.html` auf `/kontakt` und `/kontakt/index.html` auf `/kontakt/` um `[gelesen · Cloudflare «Serving Pages», 10.10.2026]`. Ein Link auf `/kontakt/` trifft die Datei direkt. Dass andere statische Hoster `/kontakt/` ebenso direkt ausliefern, ist `[Annahme]`; vor dem Livegang mit `curl -I` prüfen.
- **Vorschau und Livegang** (Regel bei text-uni, TP7/TI8 und TI10; zusammenspiel Entscheid 4; die Vorlage setzt sie um):
  - `vorschau: true`: `noindex` per Meta-Tag und `X-Robots-Tag` in `_headers`; `robots.txt` ohne `Disallow: /`; keine Sitemap, kein `canonical`.
  - `vorschau: false` (erst nach Freigabe, [WP9](../SKILL.md)): `robots.txt` nach text-uni TI1 bis TI6, `sitemap.xml` nach TI11 und TI12, `canonical` auf sich selbst (S28), `url` in den strukturierten Daten.
- **Sicherheits-Kopfzeilen** in `_headers` (Format Cloudflare Pages): siehe [betrieb.md](../referenzen/betrieb.md).
- **Öffnungsstatus** (`public/js/main.js`): Zeiten aus `betrieb.json`, Wortlaut aus `texte.json`. Ohne Skript bleibt der Satz `status.ohneSkript` stehen. Feiertage und Betriebsferien stehen in `betrieb.json` unter `ausnahmen` (freiwillig, je mit Quelle in `fakten.md`); ein Eintrag ersetzt die Wochenzeiten dieses Tages, im Status und in der Tabelle der Zeiten `[gebaut · 02.11.2026, mit Testdaten; Status bei 6 simulierten Zeitpunkten in Chromium geprüft]`.
- **Slot `idee`** im Layout: Der grosse Satz aus der Idee steht über der `h1` und ist keine Überschrift (zusammenspiel Entscheid 2). Form aus der Richtung (design-uni).
- **Zählpunkte** `data-zaehl` und `data-ort` an Hauptaktion, Telefon, E-Mail und Route (design-uni).

## Benutzen

```bash
cp -R skills/web-uni/vorlage-astro probe/<betrieb>/astro
cd probe/<betrieb>/astro && npm install
npm run build          # Gerüst und Vorschau (stufe geruest): spätere Texte als HINWEIS, Pflichtfelder als FEHLER
npm run bau:abgabe     # Prüflauf vor der Abgabe (Abfolge Schritt 13): spätere Texte als FEHLER
npm run bau:test       # Bau mit TEST-Daten aus test/, nur um die Technik zu prüfen
```

**Node und Astro:** Die Vorlage pinnt **Astro 7.4.1**, weil 7.4.1 die letzte Version ist, die Node 22.22.0 zulässt; ab 7.4.2 verlangt Astro Node 22.23.4 `[gelesen · npm-Registry, Abruf 02.11.2026]`. Gebaut am 02.11.2026 in der Cloud-Umgebung mit Node 22.22.0: `npm install && npm run bau:test` läuft ohne Umweg `[gebaut · 02.11.2026]`. Grenze und wann man die Version hebt: [stacks.md](../referenzen/stacks.md), Klasse B. Keine andere Node-Version laden; bricht der Bau mit «Node.js … is not supported by Astro» ab, steht in `package.json` eine andere Astro-Version als 7.4.1.

Dann: Fakten in `betrieb.json`, Wortlaut in `texte.json`, Seiten nach dem Antwort-Plan (text-uni TP1) in `src/pages/` mit Eintrag in `texte.json`. Gestaltung als eigene CSS-Datei aus den Tokens (design-uni DP2), in `src/layouts/Seite.astro` neben `technik.css` einbinden. `test/` gehört nie in ein Projekt.

## Was sie nicht ist

- **Keine Gestaltung und keine Texte.** `public/css/technik.css` versteckt nur Text für Bildschirmleser und zeigt den Sprunglink beim Fokus.
- **Kein Motiv eines früheren Projekts.** Gerüst-Seiten: Start, Kontakt, Impressum, Datenschutz, 404.
- **Kein CMS.** Wie Laien Inhalte ändern, ist `[nicht gebaut]` ([stacks.md](../referenzen/stacks.md)).
- **Kein Formular mit Server** `[nicht gebaut]`. Bis es gebaut ist, gilt zusammenspiel Teil 7: Hauptaktion auf `tel:` oder `mailto:`, Rückmeldung sofort im Browser mit ehrlichem Text, «gesendet» erst mit Endpunkt; Wortlaut aus text-uni ([betrieb.md](../referenzen/betrieb.md) Teil 7).
- **Keine Mehrsprachigkeit** `[nicht gebaut]`: eine Sprache aus `bau.json`, kein `hreflang`.
- **Keine Favicons und keine Social-Vorschau** (`og:`-Angaben) `[nicht gebaut]`; das Bild kommt aus design-uni, der Wortlaut aus text-uni.
- **Nicht gemessen und nicht blind geprüft.** Gebaut am 02.11.2026 mit Testdaten, mit Astro 7.4.1 und Node 22.22.0 über `npm run bau:test` (WL11, WL12). Messung und Wirkung stehen aus.
