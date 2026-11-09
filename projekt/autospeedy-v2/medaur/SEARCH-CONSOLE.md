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
