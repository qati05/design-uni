# Google Search Console für Auto Speedy (Linie Klar)

Stand 09.11.2026.

## Bestätigen, dass die Seite Auto Speedy gehört
Es gibt zwei Wege. Einer genügt.
1. **DNS (empfohlen):** In der Search Console die Domain-Property `autospeedy.ch` anlegen und den TXT-Eintrag, den Google anzeigt, bei Cloudflare unter DNS eintragen. Dafür braucht es keinen Code, und der Eintrag deckt alle Unterseiten sowie http und https ab.
2. **Meta-Tag:** In Cloudflare Pages die Umgebungsvariable `GOOGLE_SITE_VERIFICATION` auf den Wert aus Google setzen (nur der Inhalt von `content="…"`). Danach neu bauen. Das Layout `astro-klar/src/layouts/Klar.astro` schreibt dann das Tag in jede Seite. Ohne die Variable gibt es kein Tag.

## Sitemap und robots.txt
Im Livegang (`vorschau: false` in bau.json) erzeugt `astro/bau/dateien.mjs` die Datei `sitemap.xml` mit allen öffentlichen Seiten und eine `robots.txt` mit der Zeile `Sitemap: …`. In der Search Console unter «Sitemaps» die Adresse `https://<domain>/sitemap.xml` einreichen. In der Vorschau gibt es bewusst keine Sitemap, und alle Seiten stehen auf noindex.

## Was die Search Console zeigt
Suchbegriffe, Impressionen, Klicks und Position aus der Google-Suche, dazu Indexierungsfehler. Auf der Website selbst wird dafür nichts gemessen, und es braucht keine Cookies.

## Besuche zählen
Entscheid Roni, 09.11.2026: Die Besuche zählt Cloudflare Web Analytics. Es setzt keine Cookies, erfasst keine Personendaten und zeigt nur zusammengezählte Zahlen (Besuche und Seitenaufrufe je Seite, Herkunft, Gerät). Der frühere eigene Zähler (`zaehl.js` mit Supabase) ist entfernt.

So schalten Sie es ein (einmalig, kein Code nötig):
1. Im Cloudflare Dashboard **Workers & Pages** öffnen.
2. Das Projekt der Website wählen.
3. Den Reiter **Metrics** öffnen.
4. Bei **Web Analytics** auf «Enable» bzw. «Aktivieren» klicken. Ab der nächsten Auslieferung fügt Cloudflare ein kleines Skript in jede Seite ein. Die Sicherheitsregel (CSP) in `_headers` erlaubt dieses Skript bereits (`static.cloudflareinsights.com`, `cloudflareinsights.com`).

Grenzen: Klicks auf «Schaden melden» (oder «Anrufen») lassen sich dort nicht als eigenes Ereignis zählen. Als Ersatz zählen die eingehenden Mails: Jede Schadenmeldung und jede Bitte um Rückruf kommt als Mail beim Betrieb an. Die Zahl der Besuche auf `/schaden-melden/` zeigt Web Analytics als Seitenaufrufe.
