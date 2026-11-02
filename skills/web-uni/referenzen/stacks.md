# Stacks: Klassen, Stand

Stand 1. November 2026. Versionen `[gelesen · npm-Registry, 2026-11-01]`; **vor jedem Bau neu prüfen**. Kennzeichen wie in [SKILL.md](../SKILL.md): `[gebaut und gemessen]`, `[gelesen]`, `[Annahme]`, `[nicht gebaut]`.

## Versionsstand

| Paket | Version | Anmerkung |
|---|---|---|
| Next.js | 16.4.3 | Turbopack Standard, `output: 'export'` für statischen Export `[gebaut und gemessen]`, Cache Components, React Compiler stabil `[gelesen]` |
| React | 19.3.1 | `[gebaut und gemessen]` im Next-Spike |
| three | 0.187.0 | `[gebaut und gemessen]` |
| @react-three/fiber | 9.8.2 | `[gebaut und gemessen]` |
| Astro | 7.4.4 | `[gebaut und gemessen]` nur als 1:1-Übernahme der Startseite, ohne Komponenten und CMS |
| Astro in der Vorlage | 7.4.1 (gepinnt) | letzte Version für Node 22.22.0, siehe Klasse B `[gebaut · 02.11.2026]` |
| SvelteKit | 3.1.1 | `[nicht gebaut]` |
| GSAP | 3.15.0 | `[nicht gebaut]` |
| Motion | 14.9.0 | `[nicht gebaut]` |
| Lenis | 1.3.27 | `[nicht gebaut]` |
| Vite | 8.3.5 | Basis fast aller Frameworks `[gelesen]` |
| TypeScript | 7.0.2 | `[gelesen]` |
| Tailwind | 4.3.3 | `[gelesen]` |
| Lighthouse | 13.6.0 | `[gebaut und gemessen]` als Messwerkzeug |

## Standard `[Hausentscheid · Studio, 02.11.2026]`

**Astro mit statischer Ausgabe**, weil Pflege und eine Datenquelle gewinnen (Organisation) und Astro bei statischer Ausgabe nichts Messbares kostet ([messungen.md](messungen.md)). Ausnahmen mit «Weil»-Satz in `technik.md`: statisches HTML, wenn nichts verloren geht; Next.js bei Konten, Shop, Buchung, dynamischen Daten; Baukasten, wenn der Betrieb ihn hat oder verlangt (dann Entscheid des Betriebs, geht nach der Rangfolge vor). Gerüst: [../vorlage-astro/](../vorlage-astro/README.md). Welcher Stack in welcher Lage, mit Entscheidbaum, Kosten und Lock-in: [stack-wahl.md](stack-wahl.md). Sie hilft bei der Frage, **ob man vom Standard abweicht**, und beim Gegenentwurf.

## Zwei Stacks zusammen (Kombinationen) `[nicht gebaut]`

Sinnvoll, wenn ein Wunsch zwei Arten von Seiten verlangt. Alle Muster sind `[Annahme]`, bis ein Spike sie misst.

| Muster | Wann | Preis |
|---|---|---|
| **Astro mit React-Inseln** (einzelne Bauteile hydrieren, der Rest bleibt HTML) | eine Seite hat einen echten interaktiven Teil: Konfigurator, Rechner, Terminwahl | JavaScript nur für diese Insel; Insel erst bei Sichtbarkeit laden |
| **Astro für Firmenseite + Next.js für Portal oder Shop** auf einer Subdomain | Kunde will schnelle Marken-Seite und ein Kundenkonto oder eine Buchung | zwei Bauten und zwei Hostings; Tokens, Kopf und Fuss müssen geteilt werden, sonst driftet die Marke auseinander |
| **Astro + Headless- oder Git-CMS** | Betrieb will Zeiten, Fotos, Texte selbst ändern | Konto und Schulung; Eignung für Laien ist `[nicht gebaut]` (Keystatic, Decap, Tina nur gelesen) |
| **Astro + Baukasten-Shop** (zum Beispiel Shopify) | kleiner Shop, Marke eigenständig | Anbieterbindung für den Shop, Fremd-Skripte im Warenkorb |

Hinweise `[Annahme]`: (1) **eine Adresse, ein Stack**; die Grenze liegt an der Adresse, nicht mitten in einer Seite. Ein CMS, eine Shop-API oder ein Buchungsdienst ist eine Datenquelle, kein zweiter Stack ([stack-wahl.md](stack-wahl.md), Teil 5). (2) Gemeinsame **Tokens** aus einer Quelle (design-uni DP2). (3) Gemeinsame **Prüfungen**: dieselben Budgets und Prüfwerkzeuge für beide Teile. (4) Für den zweiten Stack gibt es ein **Kostenblatt** wie für jede Bewegung (Pflege, Hosting, Wechselkosten), als Entwurf, an den Betrieb erst nach Freigabe durch das Studio.

## Die fünf Klassen im Einzelnen

### A · Statisch von Hand (HTML, CSS, wenig JS, Bauskript) `[gebaut und gemessen]`

- Gemessen: Score 97, 3,6 KB JS, LCP 2645 ms im Labor (messungen.md).
- Stärken: keine Abhängigkeiten, nichts, das veraltet; der Quelltext ist das Ergebnis. Gleich schnell wie Astro mit statischer Ausgabe (97 gegen 96).
- Schwächen: Inhalte stehen im Quelltext. Ohne Bauskript und Pflegehandbuch kann der Betrieb **nichts selbst ändern**. Mehrsprachigkeit, Suche, Shop: von Hand teuer.
- Wann (Hinweis): sehr wenige Seiten, kaum Werte, die an mehreren Stellen stehen; dann geht gegenüber Astro nichts verloren. Geschwindigkeit ist kein Argument, sie ist gleich.
- Wann nicht: der Betrieb will Preise, Fotos oder Texte selbst ändern, ohne Entwickler.

### B · Statischer Generator mit Inhaltsdateien (Astro, Eleventy, …) `[Astro: gebaut und gemessen als 1:1-Übernahme; Vorlage gebaut, nicht gemessen]`

- Aussage aus Quellen `[gelesen]`: wenig bis kein JS standardmässig, Inhalte in Markdown oder CMS, Inseln für Interaktives. In diesem Repo gemessen: bei statischer Ausgabe gleich schnell wie handgeschriebenes HTML (Score 96, 3,6 KB JS, messungen.md). Die Vorlage ([../vorlage-astro/](../vorlage-astro/README.md)) hält Fakten und Wortlaut in je einer Datei und bricht den Bau bei leeren Pflichtfeldern ab; Texte, die erst später entstehen, meldet sie im Gerüst als HINWEIS `[gebaut · 02.11.2026, mit Testdaten]`. **Offen:** Nutzen für Laien (Git-CMS wie Keystatic, Decap, Tina) und Verhalten mit interaktiven Inseln.
- Wann (Annahme): mehr Seiten oder Inhalte, die wiederkehren (Occasionen, Team, Beiträge), oder ein CMS im Hintergrund.
- **Version der Vorlage: Astro 7.4.1, gepinnt.** Astro 7.4.1 verlangt Node ≥ 22.22.0, ab 7.4.2 verlangt Astro Node ≥ 22.23.4 `[gelesen · npm-Registry, «engines» der Versionen 7.4.0 bis 7.4.4, Abruf 02.11.2026]`. Die Cloud-Umgebung hat Node 22.22.0 und lädt keine neue Version. Mit 7.4.1 laufen dort `npm install && npm run build` und `npm run bau:test` ohne Umweg `[gebaut · 02.11.2026, Node 22.22.0, npm 10.9.4, Testdaten]`.
- **Grenze:** 7.4.2 hebt die Mindestversion an, weil die Node-Sicherheitsausgaben vom Oktober 2026 Fehler beheben, die Astro betreffen `[gelesen · Astro CHANGELOG 7.4.2, Abruf 02.11.2026]`. Die Vorlage läuft Node nur beim Bau und für den lokalen Entwicklungsserver; ausgeliefert werden statische Dateien. Dass die Lücken die statische Ausgabe nicht treffen, ist `[Annahme]`. Deshalb: `astro dev` nur lokal, nie mit `--host` in einem fremden Netz; sobald die Umgebung Node ≥ 22.23.4 hat, Astro auf die aktuelle Version heben und `engines` anpassen (WL12).

### C · React-Framework (Next.js App Router) `[gebaut und gemessen, nur statischer Export]`

- Gemessen: gleicher Inhalt kostet +133 KB JS und rund 1 s LCP im Labor (messungen.md).
- Gebaut wurde **nur** der statische Export. Serverseitiges Rendern, Cache Components, `proxy.ts`, Server Actions, Bildoptimierung `[nicht gebaut]`.
- Wann (Annahme): Konten und Anmeldung, Shop mit Warenkorb, Vorschau für Redakteure, Daten aus mehreren Quellen, ein Team, das schon React pflegt, geteilte Bauteile mit einer App.
- Wann nicht: Seite ohne Zustand und ohne Konten. Dort kostet der Rahmen mehr, als er bringt.
- Alternativen mit ähnlicher Rolle `[nicht gebaut]`: SvelteKit, Remix, Nuxt.

### D · Baukasten oder CMS (Webflow, Wix, Squarespace, Framer, WordPress, Shopify) `[nicht gebaut]`

Zahlen `[gelesen]` aus der Recherche vom 02.11.2026; Quellen WQ1 bis WQ89 in [stack-wahl.md](stack-wahl.md), Liste am Ende.

- **Marktanteile:** WordPress 39,5 % aller Websites und 58,2 % der Sites mit erkanntem CMS (WQ8). Unter .ch-Sites mit erkanntem CMS: WordPress 50,8 %, Wix 9,1 %, Shopify 4,1 % (WQ9); Wix ist unter .ch fast doppelt so häufig wie im Weltschnitt (WQ10). Headless-CMS je unter 0,1 % (WQ8), weil sie im HTML kaum Spuren hinterlassen `[Annahme]`. Rund 60 % der WordPress-Sites nutzen einen Page Builder, Elementor 43 % (WQ11).
- **Feldwerte (CrUX, mobil, September 2026), Anteil mit allen drei CWV gut:**

| Stack | global | Besucher aus CH | Lighthouse Median global | Quelle |
|---|---|---|---|---|
| Wix | 81 % | 93 % | 61 | WQ3, WQ4 |
| Webflow | 71 % | 83 % | 63 | WQ3, WQ4 |
| Framer | 71 % | 74 % | 67 | WQ2, WQ4 |
| Squarespace | 71 % | 86 % | 30 | WQ3, WQ4 |
| WordPress | 48 % | 70 % | 43 | WQ1, WQ4 |
| zum Vergleich: Astro | 71 % | 83 % | 70 | WQ1, WQ4 |
| zum Vergleich: Next.js | 36 % | 55 % | 53 | WQ1, WQ4 |

Korrelation, keine Ursache: Baukästen tragen oft einfachere Seiten, und der Anbieter optimiert Bilder und Caching zentral `[Annahme]`. Die CH-Werte messen Besucher, nicht Schweizer Websites.

- **Lock-in:** Wix geschlossen, die Website muss auf Wix laufen (WQ17). Squarespace nur Teilexport als WordPress-XML, ohne Shop, Stile, eigenes CSS (WQ18). Webflow: Code-Export nur mit bezahltem Workspace, ohne CMS-Funktion, Formulare, Suche und Zusatzsprachen (WQ14). Framer: zwei Hilfeseiten widersprechen sich (WQ15, WQ16). WordPress offen (WXR-Export), Layouts aus Page Buildern bleiben am Plugin (WQ19, `[Annahme]` für die Bindung).
- **Standort:** Webflow, Framer, Squarespace und Wix hosten in den USA, Framer auch in Europa und Asien-Pazifik, Wix auch in Irland (WQ50 bis WQ54); Swiss-U.S. Data Privacy Framework seit 15.09.2024 für zertifizierte Anbieter (WQ55).
- Stärken `[Annahme]`: der Betrieb pflegt selbst, Formulare, Buchung und Zahlung als Baustein, wenig Betriebsaufwand, hoher Boden im Feld (Tabelle oben).
- Schwächen `[Annahme]`: Gestaltungsspielraum begrenzt, Anbieterbindung, laufende Kosten je Sitz und Sprache (stack-wahl.md, Situation 9), oft Fremd-Skripte.
- **Der Auftritt der Probe lag vorher auf Wix** (`probe/autospeedy/fakten.md`). Die Bewertung dieses Zustands ist nicht Teil der Messungen.

#### Shops in Klasse D `[nicht gebaut]`

- **Verbreitung bei Besuchern aus der Schweiz** (Origins im Tech Report): Shopify 4'646, WooCommerce 2'918, Wix eCommerce 1'332, Magento 787, PrestaShop 570, Shopware 523, Squarespace Commerce 467 (WQ6).
- **Feldwerte, alle drei CWV gut, global und CH:** Shopware 84 % und 85 %, Wix eCommerce 79 % und 93 %, Shopify 76 % und 81 %, Squarespace Commerce 71 % und 86 %, PrestaShop 61 % und 79 %, Magento 45 % und 58 %, WooCommerce 39 % und 59 % (WQ5, WQ6). Shopify headless mit Hydrogen 50 % bei 1'534 Origins (WQ7).
- **Lock-in:** Shopify teilweise: Produkte und Kunden als CSV, Kundenpasswörter nicht, das Theme läuft nur auf Shopify (WQ28, WQ29; Theme `[Annahme]`). Wix: kein Umzug zu einem anderen Hoster (WQ17). WooCommerce und Shopware: Code und Datenbank beim Betreiber `[Annahme]`.
- **TWINT, MWST, PBV, UWG lit. s, Widerruf, Versand:** [stack-wahl.md](stack-wahl.md), Teil 6; Wortlaut und Recht bei text-uni.

### E · Erlebnis-Zuschlag (WebGL, WebGPU, Video, grosse Animation)

- WebGL über three.js und R3F: `[gebaut und gemessen]`, +240 KB JS und 3,4 s TBT im Labor (ohne GPU). Siehe [animation-3d.md](animation-3d.md).
- WebGPU, Shader, OGL, Rive, Lottie, Video: `[nicht gebaut]`.

## Entscheidbaum

Steht in [stack-wahl.md](stack-wahl.md), Teil 2, zusammen mit den drei Leitfragen, der Übersicht und den neun Situationen. Er sperrt nichts; er hilft bei Wahl und Gegenentwurf in WP2.

## Fehler, die den Entscheid oft verderben (Hinweise, Quelle der Erfahrung: Probe Auto Speedy)

- **Rahmen aus Gewohnheit.** Ein React-Framework für eine Seite, die nur Text, Bilder und ein Formular hat.
- **Zweierlei Wahrheit.** Öffnungszeiten im Text und im Skript: eine Quelle ([lektionen.md](lektionen.md), WL4).
- **3D ohne Auftrag.** Ein Modell, das weder die Idee noch der Wunsch des Betriebs verlangt, auf einer Seite, deren Erfolg ein Anruf ist.
- **Ungemessen übernommen.** «Next.js ist schnell» ohne Zahl: der Spike zeigt in diesem Fall das Gegenteil.
