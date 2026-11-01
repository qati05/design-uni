# Branchenwerte: Was ist normal, was ist sehr gut, womit bauen die Grossen?

Stand 1. November 2026. Kennzeichen wie in [SKILL.md](../SKILL.md). Die Zahlen aus Studien sind `[gelesen]` mit Quelle; was ich selbst gemessen habe, ist `[gebaut und gemessen]`. **Nicht zusammenrechnen:** Studien messen echte Besucher (Feld), meine Läufe sind Labor.

## 1. Was ist «normal» (Feld, echte Chrome-Besucher)

| Kennzahl | Wert | Quelle |
|---|---|---|
| Websites, die alle drei Core Web Vitals bestehen, mobil | **48 %** (Juli 2025); 49,1 % (Mai 2026, nur Sites mit vollständigen Daten) | `[gelesen · Web Almanac 2025, Performance; PageSpeed Matters, Mai 2026]` |
| dasselbe, Desktop | 56 % (2025); 58,0 % (Mai 2026) | dito |
| Schwächste Kennzahl mobil | LCP: nur ca. 62 % gut; INP 77 %; CLS 81 % | `[gelesen · Web Almanac 2025]` |
| Die 1000 grössten Sites, mobil | 51 % bestehen; Rang 10 000 bis 100 000: 37 bis 42 % | `[gelesen · Web Almanac 2025]` |
| Schwellen «gut» (75. Perzentil der Besucher) | LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 | `[gelesen · web.dev]` |
| Median-Startseite mobil | **2,56 MB** Gesamtgewicht, davon JavaScript ca. 697 KB, Bilder ca. 1059 KB, Schriften 139 KB | `[gelesen · Web Almanac 2025, Page Weight]` |
| Barrierefreiheit | **95,9 %** der Top-Million-Startseiten haben automatisch erkennbare WCAG-Fehler, im Mittel 56 pro Seite | `[gelesen · WebAIM Million 2026]` |

**Folgerung:** «Besteht alle drei» ist nicht der Standard, sondern ungefähr die Hälfte des Webs. Bestehen heisst: besser als die Hälfte. Unsere statische Probe-Startseite lädt 320 KB gesamt (Median-Seite: 2,56 MB) `[gebaut und gemessen]`.

## 2. Was ist «nonplusultra»?

- **Lighthouse 100** ist erreichbar, aber ein Laborwert und kein Ziel an sich. Adobe wirbt bei seiner Auslieferung «Edge Delivery Services» mit einem Start-Wert von 100 `[gelesen · Herstellerangabe, nicht nachgemessen]`.
- **Feldwerte** zählen für Google und für Besucher. Dafür gilt: alle drei Kennzahlen im grünen Bereich bei 75 % der Besucher.
- **Wirkung:** Renault (Google-Fallstudie, 2021): 1 s kürzerer LCP ging mit 14 Punkten weniger Absprüngen und 13 % mehr Umsätzen einher `[gelesen · web.dev, Fallstudie eines Herstellers, korrelativ, nicht kausal belegt]`.
- Für diese Probe: alle drei Kennzahlen grün auf einem Mittelklasse-Handy und Barrierefreiheit 100 sind erreichbar und liegen **über** dem, was die meisten Konzerne haben (siehe 4).

## 3. Welche Technik erreicht das im Feld? (Studien)

Quelle für alles in dieser Tabelle: PageSpeed Matters, Mai 2026, HTTP Archive und CrUX, mobil. **Hinweis:** PageSpeed Matters verkauft Optimierung; die Daten sind öffentlich, die Auswahl und Deutung ist ihre. Andere Quellen nennen für Wix und WordPress **abweichende** Zahlen (Wix 53 bis 79 %, WordPress 38 bis 48 %), weil Stichproben und Monate verschieden sind. Ordnung ist belastbarer als einzelne Prozentwerte.

| Technik | Besteht alle drei | Gutes LCP |
|---|---|---|
| Hugo (wirklich statisch) | 50,4 % | 89,9 % |
| Jekyll (wirklich statisch) | 47,4 % | 90,2 % |
| Astro | 48,0 % | 76,7 % |
| Gatsby | 40,7 % | 68,4 % |
| Next.js | 29,3 % (App Router 31,1 %) | 54,8 % |
| Nuxt | 24,9 % | 48,4 % |

Aussage der Studie: **nicht «statisch» entscheidet, sondern wie viel JavaScript ausgeliefert wird.** Ein statisch exportiertes Next.js lädt wie eine Framework-Seite. Das deckt sich mit meiner Messung (Score 97 gegen 89, +133 KB JS) `[gebaut und gemessen]`.

Baukästen und CMS (Quellen uneinheitlich): Wix, Shopify rund 75 bis 79 %, Squarespace rund 70 %, WordPress 38 bis 48 %, Magento rund 40 % `[gelesen · mehrere Quellen, Spanne]`.

## 4. Wie schneiden die Grossen ab, und womit sind sie gebaut? (selbst gemessen)

**Messbedingungen:** Lighthouse 13.6.0, mobil, simulierte Drosselung, Median aus 3 Läufen, 1. November 2026, aus einem Rechenzentrum **ausserhalb der Schweiz** (die Netzlatenz zu den Servern steckt in den Live-Werten und hebt sie an). **Nicht vergleichbar mit meiner Probeseite**, die über `localhost` ohne Netz gemessen wurde. Nur die Kategorien Barrierefreiheit und Best Practices sind weitgehend netzunabhängig.

| Seite | Technik (aus Quelltext und Anfragen erkannt) | Perf. | Barrierefr. | Best Pr. | LCP | JS komprimiert |
|---|---|---|---|---|---|---|
| autospeedy.ch (heute) | **Wix** | 81 | 89 | 100 | 3,9 s | 599 KB |
| migros.ch | **Angular** | 35 | 97 | 73 | 16,6 s | 1589 KB |
| sbb.ch | **Next.js**, dazu Hinweise auf Adobe Experience Manager | 33 | 91 | 100 | 12,2 s | 1150 KB |
| swisscom.ch | **Adobe Experience Manager** | 42 | 89 | 92 | 14,0 s | 2310 KB |
| ubs.com | **Adobe Experience Manager**, jQuery | 82 | 100 | 100 | 3,4 s | 1189 KB |
| *Probe Auto Speedy (statisch)* | *statisches HTML, Bauskript* | *96–97* | *100* | *100* | *2,6 s (localhost)* | *3,6 KB* |

Weitere Erkennungen ohne Messung (nur Startseite geladen): bmw.ch und amag.ch **Adobe Experience Manager**; post.ch **Sitecore**; nike.com Next.js (die Seite lieferte beim Test einen Fehlerstatus 500, Aussage nur «Next.js erkannt»).

**Nicht erkannt oder nicht erreichbar:** Tesla, Mercedes, Coop, Lufthansa, New York Times blockierten den Abruf (HTTP 403); Zalando 502; VW Verbindungsfehler. Apple, IKEA, GitHub, Airbnb: **keine Signatur erkannt**, das heisst *nicht erkannt*, nicht «statisch».

**Grenzen:** Die Erkennung ist eine Stichwortsuche in Quelltext und Anfragen (einfacher als ein Werkzeug wie Wappalyzer). «Adobe Launch» im Quelltext ist Analytics, kein Beleg für das CMS. Ob ein Next.js-Seitenteil hinter AEM als Inhaltsquelle steht (SBB), ist `[Annahme]`. Es sind **eine Startseite pro Konzern und ein Tag**; Konzerne haben Hunderte Seiten mit verschiedener Technik.

## 5. Was folgt daraus für den Skill

1. **Die Vermutung «grosse Seiten sind nicht statisch» stimmt.** In der Stichprobe: Angular, Next.js, Adobe Experience Manager, Sitecore, Wix. Keine einzige erkannte Konzernseite war von Hand geschriebenes HTML.
2. **Sie sind deshalb nicht schneller.** Im Labor schnitten drei der vier gemessenen Konzernseiten (Migros 35, SBB 33, Swisscom 42) schlechter ab als die heutige Wix-Seite von Auto Speedy (81). Konzerne wählen den Stack nach **Organisation** (viele Redakteure, viele Sprachen, Freigaben, Anbindung an Datenbanken, Verträge, Teams), nicht nach der Ladezeit.
3. **Der Stack folgt dem Betrieb, nicht dem Prestige.** Das Kriterium «Wer pflegt? Wie viele Seiten? Welche Sprachen? Welche Systeme?» (SKILL.md, Schritt 0 Punkt 6) ist genau das, was die Konzerne treibt. Für Auto Speedy (12 Seiten, 1 Sprache, kaum Änderungen) fällt die Antwort anders aus.
4. **Wo die Konzerne mehr haben, was Auto Speedy nicht braucht:** Redaktionssystem mit Freigabe, Mehrsprachigkeit, Personalisierung, Konten, Shop. Das ist der Grund für die Stacks, nicht ein Qualitätsvorsprung.
5. **Wo die Messlatte liegt:** Ein UBS-Wert von 82 im Labor und Barrierefreiheit 100 zeigt, dass auch Konzerne mit Adobe Experience Manager sehr gut sein können. Die Technik setzt nur die Grundlage; Gewicht und Sorgfalt entscheiden.

## 6. Offen

- Feldwerte (CrUX) der einzelnen Konzernseiten: nicht abgerufen.
- Ob die Konzernseiten auf echten Schweizer Netzen besser abschneiden: nicht gemessen.
- Eine breitere Stichprobe (zum Beispiel 30 Carrosserie-Betriebe der Schweiz) fehlt. Sie wäre der passendere Vergleich für Auto Speedy als Konzerne.
- Probe-Seite: SEO-Wert 66 in Lighthouse ist **beabsichtigt** (Vorschau mit `noindex`); der einzige Fehler ist «Seite nicht durchsuchbar».
