# Astro-Vorlage (web-uni)

Standard-Stack des Studios `[Hausentscheid · Studio, 02.11.2026]`: **Astro, statische Ausgabe**. Die Vorlage ist **Technik, nicht Gestaltung** (zusammenspiel Entscheid 7): Datenquelle, Layout mit Kopfdaten, Bau, Prüfungen und Gerüst-Seiten. Sichtbare Bauteile sind ungestaltetes, semantisches HTML. Form kommt aus der Richtung (design-uni), Text aus text-uni.

## Was sie liefert

- **Eine Quelle** in `src/content/`:
  - `betrieb.json`: Fakten (Name, Anschrift, Telefon, E-Mail, Zeiten), jede mit Quelle in `fakten.md` (text-uni).
  - `texte.json`: Wortlaut aus text-uni (Hauptaktion, Menü, Mikrotexte, Titel, Beschreibung und `h1` je Seite).
  - `bau.json`: Technik mit dem Schalter `vorschau`.

  Alle Felder sind leer. `""` heisst Pflicht: Der Bau bricht ab und nennt jedes leere Feld. `null` heisst freiwillig und bewusst weggelassen.
- **Prüfungen beim Bau** (`bau/daten.mjs`, `bau/dateien.mjs`): leere Pflichtfelder; Telefon im Format `+41…`; Titel nach text-uni S1 und S3 (über 65 Zeichen Fehler, ausserhalb 40 bis 60 Warnung); Beschreibung 110 bis 155 (S12); interne Links ohne Weiterleitung (TI24).
- **Adressen ohne Weiterleitung:** Verzeichnisformat, Datei `kontakt/index.html`, Link `/kontakt/`. Cloudflare Pages leitet `/kontakt.html` auf `/kontakt` und `/kontakt/index.html` auf `/kontakt/` um `[gelesen · Cloudflare «Serving Pages», 10.10.2026]`. Ein Link auf `/kontakt/` trifft die Datei direkt. Dass andere statische Hoster `/kontakt/` ebenso direkt ausliefern, ist `[Annahme]`; vor dem Livegang mit `curl -I` prüfen.
- **Vorschau und Livegang** (zusammenspiel Entscheid 4):
  - `vorschau: true`: `noindex` per Meta-Tag und `X-Robots-Tag` in `_headers`; `robots.txt` ohne `Disallow: /`; keine Sitemap, kein `canonical`.
  - `vorschau: false` (erst nach Freigabe, [WP9](../SKILL.md)): `robots.txt` nach text-uni TI1 bis TI6, `sitemap.xml` nach TI11 und TI12, `canonical` auf sich selbst (S28), `url` in den strukturierten Daten.
- **Sicherheits-Kopfzeilen** in `_headers` (Format Cloudflare Pages): siehe [betrieb.md](../referenzen/betrieb.md).
- **Öffnungsstatus** (`public/js/main.js`): Zeiten aus `betrieb.json`, Wortlaut aus `texte.json`. Ohne Skript bleibt der Satz `status.ohneSkript` stehen.
- **Zählpunkte** `data-zaehl` und `data-ort` an Hauptaktion, Telefon, E-Mail und Route (design-uni).

## Benutzen

```bash
cp -R skills/web-uni/vorlage-astro probe/<betrieb>/astro
cd probe/<betrieb>/astro && npm install
npm run build          # bricht ab, bis alle Pflichtfelder gefüllt sind
npm run bau:test       # Bau mit TEST-Daten aus test/, nur um die Technik zu prüfen
```

Astro 7.4.4 verlangt Node 22.23.4 oder neuer `[gelesen · node_modules/astro/bin/astro.mjs]`.

Dann: Fakten in `betrieb.json`, Wortlaut in `texte.json`, Seiten nach dem Antwort-Plan (text-uni TP1) in `src/pages/` mit Eintrag in `texte.json`. Gestaltung als eigene CSS-Datei aus den Tokens (design-uni DP2), in `src/layouts/Seite.astro` neben `technik.css` einbinden. `test/` gehört nie in ein Projekt.

## Was sie nicht ist

- **Keine Gestaltung und keine Texte.** `public/css/technik.css` versteckt nur Text für Bildschirmleser und zeigt den Sprunglink beim Fokus.
- **Kein Motiv eines früheren Projekts.** Gerüst-Seiten: Start, Kontakt, Impressum, Datenschutz, 404.
- **Kein CMS.** Wie Laien Inhalte ändern, ist `[nicht gebaut]` ([stacks.md](../referenzen/stacks.md)).
- **Kein Formular mit Server** `[nicht gebaut]`. Bis es gebaut ist, führt die Hauptaktion auf `tel:` oder `mailto:`, Wortlaut aus text-uni ([betrieb.md](../referenzen/betrieb.md)).
- **Keine Mehrsprachigkeit** `[nicht gebaut]`: eine Sprache aus `bau.json`, kein `hreflang`.
- **Keine Feiertage** im Öffnungsstatus `[nicht gebaut]`.
- **Nicht gemessen und nicht blind geprüft.** Gebaut am 02.11.2026 mit Testdaten, über die Programmschnittstelle von Astro, weil der Container Node 22.22.0 hatte (WL11). Messung und Wirkung stehen aus.
