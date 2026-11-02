# Stack-Wahl: welcher Stack in welcher Lage

Stand 2. November 2026. Entscheidhilfe für WP2 ([SKILL.md](../SKILL.md), Schritt 2). Sie sperrt nichts: Sie liefert Empfehlung, Gegenentwurf und Kosten für `technik.md` (zusammenspiel Entscheid 13).

**In 5 Minuten:** Teil 1 (drei Leitfragen), Teil 2 (Entscheidbaum), Teil 3 (Übersicht). Danach nur die eigene Situation in Teil 4 lesen.

**Rangfolge** ([zusammenspiel.md](../../design-uni/referenzen/zusammenspiel.md), Teil 1): Recht, dann Entscheid des Betriebs, dann Hausentscheid des Studios (Standard ist Astro mit statischer Ausgabe), dann diese Hinweise. Will der Betrieb einen anderen Stack, gilt sein Entscheid. Er bekommt vorher die Kosten.

**Kennzeichen** wie in [SKILL.md](../SKILL.md):

| Kennzeichen | Bedeutung hier |
|---|---|
| `[gebaut und gemessen]` | steht mit Befehl in [messungen.md](messungen.md); sonst nirgends |
| `[gelesen · Sn]` | gelesen in Quelle Sn der Liste am Ende, Abruf 02.11.2026; die Liste nennt die Art: Messung, Behörde, Anbieter, Meinung |
| `[Annahme]` | eigene Ableitung, ungeprüft |
| `[nicht gebaut]` | in diesem Repo nie gebaut; kein Urteil über Bau und Pflege |

**Lesehilfe für Zahlen:**

- **CWV** heisst: Anteil der Websites eines Stacks, die alle drei Core Web Vitals am 75. Perzentil bestehen, mobil, September 2026. «CH» heisst Besucher aus der Schweiz, nicht Websites aus der Schweiz. Das ist Korrelation, keine Ursache: Baukästen tragen oft einfachere Seiten `[gelesen · WQ5]`.
- **Preise** sind Listenpreise der Anbieter ohne MWST. An den Betrieb gehen sie nur als Entwurf, nach Freigabe durch das Studio (Schutzregel 4, [betrieb.md](betrieb.md) Teil 10).

## 1. Die drei Leitfragen

Agenturen begründen die Wahl fast immer mit zwei Fragen `[gelesen · WQ76, WQ77, WQ78, WQ80]`. Dieses Studio stellt eine dritte.

1. **Wer pflegt wie oft?** Ändert der Betrieb selbst und oft, braucht er einen Editor (Git-CMS, Headless-CMS, WordPress, Baukasten). Ändert sich die Seite selten, pflegt das Studio im Repo. Eine Agentur rät zu WordPress, wenn der Kunde «every week» selbst ändert, und zu Astro für Seiten, die sich «now and then» ändern `[gelesen · WQ78]`.
2. **Wer wartet über Jahre?** WordPress braucht Updates für Kern, PHP, Themes und Plugins. Astro hat auch Abhängigkeiten. Beim Baukasten wartet der Anbieter. Empfehlung einer Schweizer Agentur: Gesamtkosten über drei Jahre vergleichen `[gelesen · WQ76]`.
3. **Muss der Betrieb jederzeit kündigen und die Website mitnehmen können?** Für dieses Studio heisst die Antwort ja, ausser der Betrieb verzichtet ausdrücklich. Grund: Domain, Konten und Zugänge gehören dem Betrieb ([betrieb.md](betrieb.md) Teil 2 und 9; text-uni TI30). Ein Stack, der sich nicht mitnehmen lässt, braucht darum einen Entscheid des Betriebs mit den Wechselkosten in `entscheide.md` `[Annahme]`.

**Mitnahme in vier Stufen** (Spalte «Lock-in» in Teil 3):

| Stufe | Bedeutung | Beispiele |
|---|---|---|
| **offen** | Code und Inhalte gehören dem Betrieb, jeder Hoster geht | Astro, Eleventy, Next.js, WordPress, Git-CMS, Payload `[gelesen · WQ19, WQ20, WQ21, WQ22, WQ23, WQ27]` |
| **Inhalte gebunden** | Code offen; Inhalte per Export oder API, in einem Format des Anbieters | Sanity (Export als NDJSON), Storyblok (JSON über API) `[gelesen · WQ25, WQ26]` |
| **teilweise** | ein Teil geht mit, der Rest ist Neubau | Webflow, Squarespace, Shopify `[gelesen · WQ14, WQ18, WQ28, WQ29]` |
| **geschlossen** | nur Domain und Texte von Hand | Wix: «your site must run on Wix's servers» `[gelesen · WQ17]`; Framer laut FAQ, siehe Teil 9 |

## 2. Entscheidbaum

Von oben nach unten. Die erste Antwort «ja» führt zur Situation in Teil 4.

1. **Verlangt der Betrieb, selbst einen Baukasten zu bedienen?** Ja: Situation 9 (Entscheid des Betriebs, geht vor).
2. **Läuft heute WordPress, Wix oder ein anderer Baukasten?** Ja: zuerst Situation 8 (behalten, umbauen, umziehen), dann für das Ziel weiter mit Frage 3.
3. **Wird online mit Warenkorb verkauft?** Bis etwa 50 Produkte und eine Marke: Situation 6. Mehr, mehrere Märkte oder eigenes Frontend: Situation 7.
4. **Braucht es Konten, eigene Daten oder eine Buchung mit eigener Logik?** Genügt ein Buchungsdienst über Link, heisst die Antwort nein. Ja: Situation 5.
5. **Ist Bewegung oder 3D Kern des Wunsches** (nach DP1)? Ja: Situation 4.
6. **Pflegen mehrere Personen, in mehreren Sprachen oder mit vielen Seitentypen?** Ja: Situation 3.
7. **Ändert der Betrieb selbst oft, etwa jede Woche?** Ja: Situation 2.
8. **Sonst:** Situation 1.

**Gegenprobe für jeden Ast:** Leitfrage 3. Ist die Empfehlung nicht «offen», steht der Verzicht des Betriebs in `entscheide.md`.

## 3. Übersicht

| Situation | Stack | Grund | Lock-in | Kosten laufend (Entwurf) |
|---|---|---|---|---|
| 1 Visitenkarte und Anfragen | Astro statisch | Hausentscheid; kostet gegenüber HTML nichts Messbares | offen | Hosting statisch bei Cloudflare gratis laut Anbieter `[gelesen · WQ42]`; Pflege durch das Studio |
| 2 Betrieb ändert oft selbst | Astro + Git-CMS (Keystatic oder Decap) | Editor für feste Felder, Inhalte bleiben im Repo | offen | Decap und Keystatic gratis; TinaCloud 0 bis USD 24/Mt `[gelesen · WQ22, WQ23, WQ38]` |
| 3 Marke, Redaktion, mehrsprachig | Astro + Storyblok | visueller Editor, Sprachen je Feld oder Ordner | Inhalte gebunden | Storyblok 0, USD 99 oder USD 349/Mt; 2 bis 10 Sprachen je Plan `[gelesen · WQ36]` |
| 4 Kampagne, Erlebnis, 3D | Astro + GSAP, Lenis, three als Inseln; Next.js oder Nuxt bei Szene über Seitenwechsel | Foto zuerst, JS nur wo Bewegung ist | offen | GSAP gratis `[gelesen · WQ49]`; Next.js-Hosting z. B. Vercel Pro USD 20 je Sitz/Mt `[gelesen · WQ43]` |
| 5 Konto, Buchung, Kundenbereich | erst Buchungsdienst prüfen; sonst Astro + Next.js mit Supabase (Zürich) | Rahmen nur für den Teil mit Zustand | offen | Supabase 0 oder ab USD 25/Mt `[gelesen · WQ44]`; Wartung laufend |
| 6 Shop klein | Shopify Basic, Liquid-Theme, Shopify Payments mit TWINT | TWINT eingebaut, CWV CH 81 % | teilweise | CHF 21/Mt bei Jahreszahlung, Karte 2,95 % + CHF 0.30 `[gelesen · WQ45]` |
| 7 Shop gross, eigenes Frontend | Shopify Grow bis Plus mit Liquid; headless mit Astro nur mit Team; B2B: Shopware | Theme zuerst, headless erst mit Gründen | teilweise | CHF 59 bis 269/Mt; Plus ab USD 2'300/Mt `[gelesen · WQ45, WQ46]` |
| 8 Bestand WordPress oder Baukasten | je nach Pflege und Leitfrage 3: behalten, umbauen oder Astro | Umzug braucht einen Grund ausser Tempo | wie Bestand | Bestand weiter oder Neubau; Wix-Umzug ist Neubau `[gelesen · WQ17]` |
| 9 Baukasten zwingend | Webflow, wenn Mitnahme zählt; sonst Wix oder Squarespace | Entscheid des Betriebs | teilweise bis geschlossen | Webflow USD 15 bis 25/Mt plus Sitze; Wix USD 17.77 bis 39.77; Squarespace CHF 15 bis 27 `[gelesen · WQ32, WQ34, WQ35]` |

## 4. Situationen

### 1 · Visitenkarte und Anfragen

- **Typische Wünsche:** wenige Seiten, Telefon und Anfrage, Öffnungszeiten, Karte nach Klick, selten Änderungen.
- **Empfehlung:** Astro mit statischer Ausgabe, Vorlage [../vorlage-astro/](../vorlage-astro/README.md). Gleich schnell wie handgeschriebenes HTML: Score 96 gegen 97, 3,6 KB JS `[gebaut und gemessen]`. Feld: Astro 71 % CWV global, 83 % CH `[gelesen · WQ1, WQ4]`.
- **Alternative:** statisches HTML (Klasse A), wenn kaum Werte mehrfach vorkommen. Ein Baukasten nur nach Situation 9.
- **Wann wechseln:** will der Betrieb Inhalte selbst ändern, Situation 2. Next.js nie für diese Lage: +133 KB JS und rund 1 s späterer LCP bei gleichem Inhalt `[gebaut und gemessen]`.
- **Kosten laufend:** statisches Hosting bei Cloudflare gratis und unbegrenzt laut Anbieter `[gelesen · WQ42]`; Vercel Hobby ist nur für nicht kommerzielle Nutzung `[gelesen · WQ43]`. Dazu Domain und Pflegestunden des Studios.
- **Lock-in und Mitnehmen:** offen. Code und Inhalte liegen im Repo, die Ausgabe ist HTML. Astro gehört seit 16.01.2026 zu Cloudflare und bleibt unter MIT-Lizenz `[gelesen · WQ20]`.
- **Datenschutz Schweiz:** Hoster und Standort in die Liste für die Datenschutzerklärung ([betrieb.md](betrieb.md) Teil 6). Schweizer Hosting gibt es zum Beispiel bei cyon (Basel) und Infomaniak `[gelesen · WQ39, WQ40]`.
- **Belege:** Eleventy, ebenfalls statisch, besteht die CWV zu 82 %, bei nur 198 Origins `[gelesen · WQ2]`. Agenturen nennen für kleine KMU-Seiten auch Baukästen als einfachsten Weg `[gelesen · WQ81, Meinung]`. Das Studio wählt Astro wegen Pflege aus einer Datenquelle und Mitnahme (Leitfragen 2 und 3).

### 2 · Betrieb will selbst oft ändern

- **Typische Wünsche:** Zeiten, Preise, Aktionen, Fotos, Beiträge selbst ändern, ohne das Studio anzurufen.
- **Empfehlung:** Astro + Git-CMS (Keystatic oder Decap). Jede Änderung ist ein Commit im Repo des Betriebs `[gelesen · WQ22, WQ23]`. Das passt, wenn der Betrieb **Felder** ändert (Wert, Text, Bild) und keine neuen Layouts baut. Eignung für Laien: `[nicht gebaut]`.
- **Alternative:** WordPress mit Block-Theme auf Schweizer Hosting, wenn der Betrieb neue Seiten und Layouts selbst baut oder Plugins braucht. Agenturen raten dazu, wenn das Redaktionssystem «the product» ist `[gelesen · WQ76, WQ78, Meinung]`.
- **Wann wechseln:** scheitert der Betrieb beim Durchspielen des Pflegehandbuchs (WP7) am Git-CMS, auf WordPress oder Situation 3 wechseln. Mehrere Redakteure oder Sprachen: Situation 3.
- **Kosten laufend:** Decap und Keystatic sind Open Source und gratis; TinaCloud Free für 2 Nutzer, Team USD 24 je Projekt/Mt bei Jahreszahlung `[gelesen · WQ22, WQ23, WQ38]`. WordPress: Hosting ab CHF 14.90/Mt (cyon) oder EUR 5.75/Mt (Infomaniak) `[gelesen · WQ39, WQ40]`, dazu Updates.
- **Lock-in und Mitnehmen:** offen. Bei TinaCMS gibt es Visual Editing nur mit React `[gelesen · WQ24]`.
- **Datenschutz Schweiz:** Git-CMS ohne eigenen Server; der Git-Anbieter kommt in die Liste für die Datenschutzerklärung `[Annahme]`.
- **Belege:** Ohne CMS kann der Kunde bei Astro nichts selbst ändern, neue Layouts bleiben schwer `[gelesen · WQ78, Meinung, Verkäufer von Astro-Themes]`.

### 3 · Marke und Inhalte mit Redaktion, mehrsprachig

- **Typische Wünsche:** mehrere Personen pflegen, Freigabe vor Veröffentlichung, Deutsch, Französisch, Italienisch, Englisch, viele Seitentypen.
- **Empfehlung:** Astro + Storyblok. Visueller Editor, Lokalisierung je Feld oder Ordner `[gelesen · WQ80, Meinung]`. Astro liefert nur Inseln als JS aus.
- **Alternative:** Astro oder Next.js + Sanity (strukturierter Inhalt, React-Team) `[gelesen · WQ79, WQ82, Meinung]`. Payload, wenn Self-Hosting und keine Lizenzkosten zählen; Payload gehört seit 17.06.2025 zu Figma `[gelesen · WQ27]`. Webflow mit Localize, wenn ein Marketing-Team ohne Entwickler publiziert. WordPress mit WPML, wenn die Redaktion WordPress kennt.
- **Wann wechseln:** reichen die Sprachen im Plan nicht, wird Storyblok teurer (siehe Kosten); dann gegen Sanity oder Payload rechnen. Eine Agentur zieht die Grenze zwischen Framer und Webflow bei 5 bis 8 CMS-Sammlungen `[gelesen · WQ89, Meinung]`.
- **Kosten laufend:** Storyblok Starter 0 (2 Sprachen, 1 bis 2 Sitze), Growth USD 99/Mt (2 Sprachen, erweiterbar), Growth Plus USD 349/Mt (10 Sprachen) `[gelesen · WQ36]`. Sanity Free 0 bis 20 Sitze und 10'000 Dokumente, nur mit öffentlichen Datasets; Growth USD 15 je Sitz/Mt `[gelesen · WQ37]`. Webflow Localize ab USD 9/Mt, je nach Anzahl Sprachen `[gelesen · WQ32]`. WPML EUR 39 bis 199, Updates ein Jahr inbegriffen `[gelesen · WQ41]`.
- **Lock-in und Mitnehmen:** Inhalte gebunden. Sanity exportiert NDJSON mit Dateien, Storyblok JSON über API `[gelesen · WQ25, WQ26]`. Abfragesprache und Blockmodell müssen beim Wechsel neu gebaut werden `[Annahme]`. Webflow: Zusatzsprachen fehlen im Code-Export `[gelesen · WQ14]`.
- **Datenschutz Schweiz:** Standort des CMS-Anbieters für die Datenschutzerklärung prüfen `[Annahme]`; für Storyblok und Sanity liegt keine Angabe in den Quellen vor.
- **Belege:** Headless-CMS sind in Crawls kaum messbar, je unter 0,1 % Marktanteil `[gelesen · WQ8]`. Für Schweizer Sites mit vier Sprachen sind Sprachen ein Kostentreiber; Deutsch und Französisch laufen länger als Englisch `[gelesen · WQ88, Meinung, Webflow-Agentur]`.

### 4 · Kampagne und Erlebnis mit starker Bewegung oder 3D

- **Typische Wünsche:** Scroll-Erzählung, Seitenübergänge, 3D-Produkt, «etwas Besonderes». Wie viel Bewegung, entscheidet design-uni in DP2 ohne Mengenregel (zusammenspiel Entscheid 12); hier geht es nur um das Womit.
- **Empfehlung:** Astro mit Inseln für GSAP, Lenis und three.js; Foto zuerst, Szene nach dem LCP (Grundregel 5). Kosten einer kleinen Szene: +240 KB JS und 3,4 s TBT im Labor ohne GPU `[gebaut und gemessen]`. Astro mit Bewegungsinseln selbst: `[nicht gebaut]`.
- **Alternative:** Next.js oder Nuxt, wenn eine WebGL-Szene über Seitenwechsel weiterläuft; das braucht Routing im Browser `[Annahme, abgeleitet aus WQ83]`. Webflow + GSAP und Lenis als eigener Code `[gelesen · WQ13, WQ83]`, wenn ein Marketing-Team das Layout selbst ändert `[Annahme]`.
- **Wann wechseln:** auf Next.js, wenn Astro-Seitenübergänge die Szene nicht halten (Spike vor dem Entscheid) `[Annahme]`. Zurück zu Situation 1, wenn der Menschentest (WP6) keinen Gewinn zeigt.
- **Kosten laufend:** GSAP mit allen Plugins seit 29.04.2025 gratis, auch kommerziell, finanziert von Webflow `[gelesen · WQ49]`. Next.js mit Server: Vercel Pro USD 20 je Sitz/Mt; seit Next.js 16.2 gibt es eine stabile Adapter-Schnittstelle für Netlify, Cloudflare und andere `[gelesen · WQ43, WQ21]`. Kostenblatt nach WP3.
- **Lock-in und Mitnehmen:** Astro, Next.js, Nuxt offen. Webflow teilweise: Interaktionen und CMS gehen nicht mit `[gelesen · WQ14]`.
- **Datenschutz Schweiz:** Bibliotheken und Modelle vom eigenen Host (Grundregel 7).
- **Belege:** Stichprobe von 61 Awwwards-Sites des Tages: Next.js 26 %, Webflow 23 %, Nuxt 20 %, eigener Vite-Bau 7 %, Astro 3 %, Framer 2 %, WordPress 2 %; Lenis in 46 %, GSAP in mindestens 36 %, three.js in mindestens 20 % `[gelesen · WQ13]`. Kleine Stichprobe, Auswahl durch eine Jury. Feld: Next.js 36 % CWV, Nuxt 29 % `[gelesen · WQ1]`. Das Erlebnis kostet Tempo; der Preis steht im Kostenblatt.

### 5 · Anwendung mit Konto, Buchung, Bereich für Kunden

- **Typische Wünsche:** Termin online, Kundenkonto, Dokumente für Kunden, Mitgliederbereich.
- **Empfehlung:** zuerst prüfen, ob ein Buchungsdienst genügt, zum Beispiel Schweizer Anbieter wie Calenso oder KLARA `[gelesen · WQ74, WQ75]`. Er wird verlinkt oder lädt erst nach Klick (text-uni CL3); die Website bleibt Situation 1. Braucht es eigene Logik: Firmenseite in Astro, Anwendung in Next.js auf einer Subdomain, Daten in Supabase mit Region Zürich `[gelesen · WQ56]`, Zahlung über Stripe.
- **Alternative:** WordPress mit Buchungs- oder Mitglieder-Plugin, wenn die Redaktion WordPress kennt `[gelesen · WQ76, WQ77, Meinung]`.
- **Wann wechseln:** auf eigene Anwendung erst, wenn der Dienst einen Ablauf des Betriebs nicht abbildet. Die Anforderung steht vorher schriftlich `[Annahme]`.
- **Kosten laufend:** Supabase Free 0 (Pause nach einer Woche ohne Nutzung), Pro ab USD 25/Mt `[gelesen · WQ44]`; Hosting für Next.js; Wartung über Jahre (Leitfrage 2). Höchste Wartungslast aller Situationen `[Annahme]`.
- **Lock-in und Mitnehmen:** Code offen; Next.js läuft über die Adapter-Schnittstelle bei mehreren Hostern `[gelesen · WQ21]`. Daten in Postgres lassen sich mitnehmen `[Annahme]`. Buchungsdienste: Export nicht geprüft.
- **Datenschutz Schweiz:** Personendaten. Information nach DSG Art. 19, Bekanntgabe ins Ausland nach Art. 16 `[gelesen · WQ57]`. Standort der Buchungsdienste ist nicht geprüft. Wortlaut: text-uni.
- **Belege:** Next.js für Anwendungen, weil Ökosystem und Vorlagen am grössten sind `[gelesen · WQ84, Meinung, Verkäufer von Starter-Kits]`. Der Rahmen kostet bei gleichem Inhalt +133 KB JS `[gebaut und gemessen]`, darum nur für den Teil mit Zustand.

### 6 · E-Commerce klein (bis etwa 50 Produkte, eine Marke)

Grenze «etwa 50 Produkte» ist eine Arbeitsgrenze des Studios `[Annahme]`.

- **Typische Wünsche:** wenige Produkte oder Gutscheine, TWINT, Versand in der Schweiz, Betrieb pflegt Produkte selbst.
- **Empfehlung:** Shopify Basic mit Liquid-Theme und Shopify Payments; TWINT ist für Schweizer Konten eingebaut `[gelesen · WQ58]`. Ist der Shop Nebensache, bleibt die Website in Astro und der Shop läuft auf einer Subdomain `[Annahme]`.
- **Alternative:** WooCommerce, wenn WordPress schon läuft, mit Schweizer Zahlungsanbieter oder dem Plugin von TWINT `[gelesen · WQ61, WQ63]`. Wix nur, wenn der Betrieb Wix schon nutzt. Squarespace nur, wenn TWINT verzichtbar ist (Teil 6).
- **Wann wechseln:** mehr Produkte, mehrere Märkte, B2B oder eigenes Frontend: Situation 7.
- **Kosten laufend:** Shopify Basic CHF 21/Mt bei Jahreszahlung, CHF 29 monatlich; Karte online 2,95 % + CHF 0.30; Zusatzgebühr 2 % bei fremdem Zahlungsanbieter `[gelesen · WQ45]`. Apps je nach Bedarf.
- **Lock-in und Mitnehmen:** teilweise. Produkte und Kunden als CSV, Bilder nur als Verweis, Kundenpasswörter nicht `[gelesen · WQ28, WQ29]`. Das Theme läuft nur auf Shopify `[Annahme]`. Shop, Domain und Zahlungsvertrag laufen von Anfang an auf den Betrieb; Shopify kennt dafür Client Transfer Stores `[gelesen · WQ31]`.
- **Datenschutz Schweiz:** Standort und Garantien von Shopify für die Datenschutzerklärung sind in den Quellen nicht geprüft; vor dem Bau lesen.
- **Belege:** Shopify führt bei Schweizer Besuchern mit 4'646 Origins vor WooCommerce mit 2'918 `[gelesen · WQ6]`. CWV: Shopify 76 % global und 81 % CH, WooCommerce 39 % und 59 % `[gelesen · WQ5, WQ6]`. **Interessenkonflikt:** Teil 8.

### 7 · E-Commerce gross oder Marke mit eigenem Frontend

- **Typische Wünsche:** grosser Katalog, mehrere Länder, eigene Gestaltung über das Theme hinaus, B2B-Preise, Anbindung an ein ERP.
- **Empfehlung:** Shopify Grow oder Advanced mit Liquid-Theme; Plus bei hohem Umsatz und Anpassung am Checkout `[gelesen · WQ45, WQ46]`. Headless mit Astro über die Storefront API erst, wenn Gründe über die Gestaltung hinaus vorliegen und ein Frontend-Team bleibt. Rein statische Bauten gehen mit Hydrogen nicht; Astro braucht Server-Ausgabe `[gelesen · WQ73]`. Shopify headless: `[nicht gebaut]`.
- **Alternative:** Shopware 6 bei B2B, ERP und Datenhoheit, mit einem PHP-Partner. Kern unter MIT, Community Edition gratis bis EUR 1 Mio. Umsatz (GMV) im Jahr `[gelesen · WQ47, WQ48]`. Eine Agentur: «Ohne Entwickler ist Shopify die sichere Wahl», Shopware bei komplexem B2B mit eigener IT `[gelesen · WQ87, Meinung]`. CWV 84 % global, 85 % CH, bei nur 523 Origins in CH `[gelesen · WQ5, WQ6]`.
- **Wann wechseln:** auf headless erst, wenn mindestens fünf von sieben Kriterien zutreffen, darunter eine zweite Oberfläche, eine belegte Grenze von Liquid, ein fest angestellter Frontend-Entwickler und Budget für 3 bis 6 Monate Bau `[gelesen · WQ85, Meinung, Anbieter eines Werkzeugs für Liquid]`.
- **Kosten laufend:** Shopify Grow CHF 59/Mt, Advanced CHF 269/Mt bei Jahreszahlung; Plus ab USD 2'300/Mt, 1 oder 3 Jahre Laufzeit `[gelesen · WQ45, WQ46]`. Bau Liquid meist unter USD 10'000, headless oft USD 50'000 bis 250'000 und mehr `[gelesen · WQ85, Meinung]`. Shopware Rise ab EUR 600/Mt; Hosting EUR 800 bis 3'000/Mt nach einer Shopify-Partneragentur `[gelesen · WQ47, WQ86, Meinung]`.
- **Lock-in und Mitnehmen:** Shopify teilweise (wie Situation 6). Headless: Frontend offen, Daten bei Shopify. Shopware: Code und Datenbank beim Betreiber `[Annahme]`.
- **Datenschutz Schweiz:** wie Situation 6; bei Shopware wählt der Betrieb den Hoster.
- **Belege:** Hydrogen-Shops bestehen die CWV zu 50 % (n = 1'534), Shopify mit Liquid zu 76 % `[gelesen · WQ5, WQ7]`. Ein eigenes Frontend ist also kein Tempogewinn von selbst. Theme-Erweiterungen (Bewertungen, Bundles) laufen headless nicht automatisch, der Theme-Editor fällt weg `[gelesen · WQ85, Meinung]`.

### 8 · Betrieb hat schon WordPress, Wix oder einen anderen Baukasten

- **Typische Wünsche:** «neu und schöner», «schneller», «günstiger», oder nur ein Teil soll neu.
- **Empfehlung:** zuerst den Bestand lesen: Feldwerte der Domain, wer heute pflegt, was das System kostet, welche Adressen es gibt (text-uni TI19). Dann eine der drei Wege:
  1. **Behalten und verbessern**, wenn der Betrieb aktiv pflegt und zufrieden ist.
  2. **Im gleichen System umbauen**, zum Beispiel WordPress mit Block-Theme statt Page Builder.
  3. **Umziehen auf Astro**, wenn Leitfrage 3 zählt, die Wartung schmerzt oder die Gestaltung im System nicht geht.
- **Alternative:** bei WordPress mit aktiver Redaktion bleibt WordPress oft richtig. Eine langjährige WordPress-Anbieterin zog die eigene Seite auf Astro um (weniger Updates, kleinere Angriffsfläche) und empfiehlt WordPress weiter für Shops und aktive Redaktionen `[gelesen · WQ77, Meinung]`.
- **Wann wechseln:** Tempo allein ist kein Grund. Wix besteht die CWV bei Schweizer Besuchern zu 93 %, WordPress zu 70 % `[gelesen · WQ4]`. Gründe für den Umzug kommen aus Pflege, Kosten, Gestaltung und Mitnahme (Grundregel 9, WL10).
- **Kosten laufend:** Bestand weiter, oder Hosting nach Situation 1 bis 3. Dazu einmal der Umzug.
- **Lock-in und Mitnehmen:**
  - **Wix:** kein Export, Umzug ist Neubau; Texte und Bilder von Hand `[gelesen · WQ17]`.
  - **Squarespace:** nur Teilexport als WordPress-XML; Shop, Stile und eigenes CSS fehlen `[gelesen · WQ18]`.
  - **Webflow:** Code-Export nur mit bezahltem Workspace, ohne CMS-Funktion, Formulare, Suche und Zusatzsprachen; CMS je Sammlung als CSV `[gelesen · WQ14]`.
  - **WordPress:** WXR-Export für Beiträge, Seiten, Felder, Menüs; Layouts aus Page Buildern bleiben am Plugin `[gelesen · WQ19]`, `[Annahme]` für die Bindung. Rund 60 % der WordPress-Sites nutzen einen Page Builder, Elementor 43 % `[gelesen · WQ11]`.
- **Datenschutz Schweiz:** beim Umzug fällt der alte Anbieter aus der Datenschutzerklärung; Weiterleitungen nach text-uni TI19 bis TI30.
- **Belege:** WordPress läuft auf 50,8 % der .ch-Sites mit erkanntem CMS, Wix auf 9,1 %, Shopify auf 4,1 % `[gelesen · WQ9]`. Wix ist unter .ch fast doppelt so häufig wie im Weltschnitt `[gelesen · WQ10]`. Diese Lage ist also der Normalfall.

### 9 · Betrieb will zwingend einen Baukasten selbst bedienen

- **Typische Wünsche:** alles selbst ändern, ohne Studio, mit Vorlagen und eingebauten Formularen, Buchung oder Shop.
- **Empfehlung:** der Wunsch ist ein Entscheid des Betriebs und geht dem Hausentscheid vor. Das Studio richtet ein und übergibt das Konto. Zählt die Mitnahme etwas: **Webflow** (Teilexport, CMS als CSV). Sonst **Wix** (in CH stark verbreitet `[gelesen · WQ10]`) oder **Squarespace** (Preise in CHF `[gelesen · WQ35]`).
- **Alternative:** Framer für designgeführte Seiten mit wenig strukturiertem Inhalt `[gelesen · WQ89, Meinung]`; Export unklar (Teil 9). Jimdo: 99 % CWV bei 707 Origins in CH, sonst keine Daten `[gelesen · WQ4]`.
- **Wann wechseln:** wenn Sprachen, Sitze oder Apps die Kosten über das eines eigenen Stacks heben. Eine Agentur rechnet bei Framer Pro mit zwei Editoren und einer Zusatzsprache mit dem Drei- bis Vierfachen des Grundpreises `[gelesen · WQ89, Meinung]`.
- **Kosten laufend:** Webflow Basic USD 15, CMS USD 25/Mt bei Jahreszahlung; Full-Sitz USD 39; Restlaufzeit wird bei Kündigung fällig `[gelesen · WQ32]`. Wix USD 17.77 bis 39.77/Mt, Preise je Land verschieden, CHF nicht abrufbar `[gelesen · WQ34]`. Squarespace CHF 15 bis 27/Mt jährlich, CHF 21 bis 39 monatlich `[gelesen · WQ35]`. Framer USD 10 oder 30/Mt, USD 20 je Sprache und je weiterem Editor `[gelesen · WQ33]`.
- **Lock-in und Mitnehmen:** Webflow teilweise, Squarespace teilweise, Wix geschlossen, Framer unklar. Der Verzicht auf Mitnahme steht mit Wechselkosten in `entscheide.md` (Leitfrage 3).
- **Datenschutz Schweiz:** die grossen Baukästen hosten in den USA: Webflow (AWS, kein EU-Hosting, Wunsch offen seit 2020), Framer (AWS USA, Europa, Asien-Pazifik), Squarespace (USA), Wix (USA und Irland) `[gelesen · WQ50, WQ51, WQ52, WQ53, WQ54]`. Seit 15.09.2024 deckt das Swiss-U.S. Data Privacy Framework die Bekanntgabe ab, wenn der Anbieter zertifiziert ist `[gelesen · WQ55]`; Webflow ist zertifiziert `[gelesen · WQ50]`. Die anderen: vor dem Bau prüfen.
- **Belege:** Baukästen haben einen hohen Boden im Feld: Wix 81 %, Webflow 71 %, Framer 71 %, Squarespace 71 % CWV global, WordPress 48 % `[gelesen · WQ3, WQ1]`.

## 5. Kombinationen

**Regel, präzisiert:** **eine Adresse, ein Stack.** Ein Stack erzeugt die Seiten unter einer Adresse; die Grenze zu einem zweiten Stack liegt an der Adresse (Subdomain oder Pfad), nicht mitten in einer Seite. Ein CMS, eine Shop-API oder ein Buchungsdienst ist **kein zweiter Stack**, sondern eine Datenquelle oder ein Dienst. Das ändert die bisherige Regel in [stacks.md](stacks.md) nicht, es klärt sie `[Annahme]`.

**Passt gut** (alle `[nicht gebaut]`):

| Kombination | Wofür | Preis | Beleg |
|---|---|---|---|
| Astro + Git-CMS (Keystatic, Decap) | Situation 2 | Schulung, Eignung für Laien offen | `[gelesen · WQ22, WQ23, WQ78]` |
| Astro + Storyblok oder Sanity | Situation 3 | Abo, Inhalte gebunden | `[gelesen · WQ36, WQ37, WQ80]` |
| Next.js + Sanity oder Payload | React-Team, Anwendung mit Redaktion | Rahmen-JS; Sanity nach Nutzung | `[gelesen · WQ79, WQ82]` |
| Astro mit Bewegungsinseln (GSAP, Lenis, three) | Situation 4 | JS nur auf der Seite mit Bewegung | `[gelesen · WQ13, WQ49]`, Szene `[gebaut und gemessen]` |
| Webflow + eigener Code mit GSAP, Lenis | Erlebnis, Layout pflegt ein Marketing-Team | Interaktionen nicht exportierbar | `[gelesen · WQ13, WQ83, WQ14]` |
| Shopify headless mit Astro (Storefront API) | Situation 7, Marke mit Team | Server-Ausgabe nötig; Theme-Editor und Theme-Apps fehlen | `[gelesen · WQ73, WQ85]` |
| Astro-Website + Shopify-Shop auf Subdomain | Situation 6, Shop ist Nebensache | zwei Kopf- und Fussbereiche, Tokens teilen | `[Annahme]` |
| Astro-Website + Next.js-Anwendung auf Subdomain | Situation 5 | zwei Bauten und Hostings | [stacks.md](stacks.md) `[Annahme]` |
| statische Website + Buchungsdienst nach Klick | Situation 5, einfache Termine | Standort des Dienstes prüfen | `[gelesen · WQ74, WQ75]` |

**Passt nicht:**

| Kombination | Warum |
|---|---|
| Next.js für eine Visitenkarte | +133 KB JS, rund 1 s späterer LCP ohne Gewinn `[gebaut und gemessen]` |
| Headless-CMS mit Abo für eine einsprachige Seite mit seltenen Änderungen | Abo und Sitze ohne Nutzen; für einfache Seiten nennt sogar eine Sanity-Agentur WordPress vernünftig `[gelesen · WQ79, Meinung]` |
| Page Builder für einen Neubau | Layouts bleiben am Plugin `[Annahme]`; WordPress 48 % CWV global `[gelesen · WQ1]` |
| Framer, wenn der Betrieb die Website mitnehmen muss | Export laut FAQ nicht möglich, laut zweiter Hilfeseite doch `[gelesen · WQ15, WQ16]` |
| Webflow oder Framer mit vielen Sprachen | Sprachen kosten je Monat; Webflow exportiert Zusatzsprachen nicht `[gelesen · WQ32, WQ33, WQ14]` |
| Shopify headless ohne festes Frontend-Team | dauerhaft ein Teil eines Entwicklers `[gelesen · WQ85, Meinung]` |
| Hydrogen mit rein statischem Bau | geht nicht laut Anbieter `[gelesen · WQ73]` |
| WooCommerce mit dem offiziellen Stripe-Plugin und TWINT als Pflicht | TWINT fehlt im Plugin `[gelesen · WQ62]` |
| zwei Stacks auf derselben Adresse | Regel oben |

## 6. E-Commerce Schweiz, kurz

Technische Anforderungen an den Shop. **Wortlaut und Rechtsprüfung: text-uni**, R-Grundsätze in [recht-werbung-schweiz.md](../../text-uni/referenzen/semester2/recht-werbung-schweiz.md) (unter anderem R13 Endpreis, R24 Grenzfall markieren). Alles hier ist «laut Gesetz oder Behörde, zu prüfen».

- **TWINT je Plattform:**

| Plattform | TWINT | Beleg |
|---|---|---|
| Shopify | in Shopify Payments für CH-Konten, in CHF, nicht für Abos | `[gelesen · WQ58]` |
| Stripe | ja, 1,9 % + CHF 0.30, nur B2C | `[gelesen · WQ59, WQ60]` |
| WooCommerce | nicht im offiziellen Stripe-Plugin; über das Plugin von TWINT oder Payrexx | `[gelesen · WQ62, WQ63, WQ61]` |
| Shopware | Plugin von TWINT ab 6.5; Payrexx | `[gelesen · WQ64, WQ61]` |
| Wix | über TFTW als Zahlungsanbieter | `[gelesen · WQ65]` |
| Squarespace | laut einer Forumsantwort nicht möglich; keine offizielle Aussage gefunden | `[gelesen · WQ66, Meinung]` |

- **MWST** seit 1. Januar 2024: 8,1 % Normalsatz, 2,6 % reduziert, 3,8 % Beherbergung `[gelesen · WQ67]`.
- **PBV im Shop:** Detailpreis in CHF inklusive MWST und nicht frei wählbarer Zuschläge; Versandkosten dürfen separat stehen `[gelesen · WQ70]`. Laut SECO: Preis und Zusatzkosten nahe beim Produkt, Versandkosten mit einem Klick sichtbar, mindestens eine kostenlose, in der Schweiz übliche Zahlungsart `[gelesen · WQ71]`. Das Merkblatt ist von 2021; eine neuere Fassung wurde nicht gefunden.
- **UWG Art. 3 Abs. 1 lit. s:** Identität und Kontakt mit E-Mail, Hinweis auf die Schritte zum Vertrag, Korrektur von Eingabefehlern vor der Bestellung, sofortige Bestätigung per E-Mail `[gelesen · WQ68]`.
- **Widerruf:** Art. 40b OR nennt Arbeitsplatz und Wohnräume, öffentliche Verkehrsmittel und Plätze, Werbefahrten und Telefon `[gelesen · WQ69]`. Ein allgemeines gesetzliches Widerrufsrecht für Online-Käufe steht dort nicht: laut Gesetz, zu prüfen. Ein freiwilliges Rückgaberecht gehört klar in die AGB. Für Kundschaft in der EU gilt deren Recht `[Annahme]`.
- **Versand und Zoll:** Wer aus dem Ausland liefert, nennt Schweizer MWST und Verzollung entweder im Preis oder beziffert vor dem Abschluss `[gelesen · WQ71]`. Ab CHF 100'000 Umsatz im Jahr mit Kleinsendungen wird ein ausländischer Händler MWST-pflichtig `[gelesen · WQ72]`. Gebühren von Post und Kurieren: nicht geprüft.

## 7. Was das Studio beherrschen muss

Vorschlag in drei Stufen. Geprüft gegen die Recherche; zwei Änderungen am ersten Entwurf sind markiert.

| Stufe | Stacks | Warum |
|---|---|---|
| **Kern** (in jedem Projekt sicher; Ziel: gebaut und gemessen) | Astro statisch; Astro mit **einem** Git-CMS (Keystatic oder Decap) und **einem** Headless-CMS (Storyblok); **Umzug** aus Wix und WordPress (Export, Weiterleitungen); Bewegungsleiter bis Stufe 3 (GSAP, Lenis) auf Astro | Hausentscheid; Situationen 1 bis 4 und 8 decken die meisten Aufträge. Astro hat unter den Frameworks die besten Feldwerte (71 %) und 94 % würden es wieder nutzen `[gelesen · WQ1, WQ12]`. Umzug ist der Normalfall: 50,8 % WordPress, 9,1 % Wix unter .ch `[gelesen · WQ9]` **(neu)**. Lenis und GSAP stehen in 46 % und 36 % der Erlebnis-Sites `[gelesen · WQ13]` **(neu)** |
| **Zweite Reihe** (sicher bauen und warten, nicht in jedem Projekt) | WordPress mit Block-Theme; Next.js mit Server-Teil; Shopify mit Liquid-Theme | WordPress ist der häufigste Bestand; Next.js trägt Konten und Szenen über Seitenwechsel, 59 % Nutzung `[gelesen · WQ12]`; Shopify ist bei Schweizer Besuchern der häufigste Shop und hat TWINT eingebaut `[gelesen · WQ6, WQ58]` |
| **Nur nach Recherche** (je Auftrag lesen, mit Partner oder Spike) | Webflow, Shopware, Nuxt, SvelteKit; dazu WooCommerce, Shopify headless, Wix, Squarespace, Framer | selten oder ausserhalb des Kerns: Webflow und Nuxt vor allem bei Erlebnis-Sites, Shopware für B2B mit PHP-Partner; SvelteKit 17 % Nutzung, 48 % CWV `[gelesen · WQ12, WQ1]` |

Hinweise `[Annahme]`:

- **Gebaut und gemessen ist heute nur** statisches HTML, Astro als 1:1-Übernahme und Next.js als statischer Export ([messungen.md](messungen.md)). Der Kern ist also erst ein Ziel. Nächste Spikes: Astro mit Git-CMS, von einer Person ohne Entwicklerwissen gepflegt; Astro mit Storyblok; Shopify Liquid gegen Shopify headless mit Astro.
- **Webflow** rückt in die zweite Reihe, sobald Aufträge nach Situation 9 regelmässig kommen; unter den Baukästen hat es den einzigen Code-Export.
- **Ein Headless-CMS, nicht drei.** Storyblok wegen Editor und Sprachen; Sanity und Payload nur nach Recherche.

## 8. Interessenkonflikte

- **Shopify-Partner** verdienen nach der Übergabe einen Anteil am Abo und am Umsatz des Shops `[gelesen · WQ30]`. Empfiehlt das Studio Shopify, steht das offen im Entwurf der Offerte (Schutzregel 4) `[Annahme]`.
- **Das Studio selbst:** Pflegt nur das Studio die Seite, verdient es an jeder Änderung. Darum ist Leitfrage 1 ehrlich zu beantworten, und die Pflegekosten stehen im Kostenblatt (Grundregel 10).
- **Astro und Hoster:** Astro gehört seit 2026 zu Cloudflare `[gelesen · WQ20]`. Wer beides von Cloudflare nimmt, hängt doppelt an einer Firma `[Annahme]`. Astro bleibt MIT, der Hoster ist wechselbar.
- **GSAP** wird von Webflow finanziert `[gelesen · WQ49]`.
- **Quellen mit eigenem Interesse:** Verkäufer von Astro-Themes (WQ78), Sanity-Agentur (WQ79), Webflow-Agentur (WQ88), Verkäufer von Starter-Kits für Next.js (WQ84), Anbieter eines Werkzeugs für Liquid-Themes (WQ85), Shopify-Partneragentur (WQ86). Ihre Aussagen sind als Meinung markiert und tragen keine Empfehlung allein.

## 9. Was unsicher bleibt

- **Keine Umfrage zur Stack-Wahl von Agenturen je Auftragsart.** Belegt sind Marktanteile, Feldwerte, Entwicklerumfragen und Meinungen.
- **Feldwerte nach Stack sind Korrelation.** Baukästen tragen oft einfachere Seiten; CH-Werte messen Besucher aus der Schweiz, nicht Schweizer Websites.
- **Framer-Export:** die FAQ (aktualisiert 15.09.2026) sagt «Framer does not offer HTML export for self-hosting» `[gelesen · WQ15]`, eine zweite Hilfeseite beschreibt herunterladbare Dateien `[gelesen · WQ16]`. Vor einer Empfehlung praktisch testen.
- **Git-CMS für Laien** und **Astro mit CMS**: `[nicht gebaut]`. Pflegezustand von Decap und Preise von Keystatic Cloud: nicht geprüft.
- **Shopify headless mit Astro, Shopware, WooCommerce:** `[nicht gebaut]`; TWINT im Testmodus von Shopify Payments nicht geprüft.
- **Datenschutz:** Standorte von Shopify, Storyblok, Sanity, Calenso und KLARA sind in den Quellen nicht geprüft. Keine Rechtsauskunft.
- **Preise in CHF** für Wix nicht abrufbar; die meisten Preise sind in USD oder EUR.
- **Bauzeit:** nur eine Angabe (Sanity mit Next.js 4 bis 10 Wochen `[gelesen · WQ79, Meinung]`); für Astro, Webflow, WordPress keine.
- **Awwwards-Stichprobe** klein (n = 61), Bibliotheken nur im HTML gezählt, also Untergrenzen.

## Quellen

Kennung **WQ1 bis WQ89** (Quelle web-uni; nicht zu verwechseln mit den Grundsätzen S1 bis S34 von text-uni, zusammenspiel Teil 5). Alle abgerufen am 02.11.2026. Art: Messung (Crawl, Feld, Umfrage mit Methode), Behörde, Anbieter (über das eigene Produkt), Meinung (Agentur oder Person, oft mit eigenem Interesse).

**Messdaten und Marktanteile**

- WQ1 · Messung · HTTP Archive Tech Report, Astro, WordPress, Next.js, Nuxt, SvelteKit, mobil, global, Daten September 2026. https://httparchive.org/reports/techreport/tech?client=mobile&tech=Astro,WordPress,Next.js,Nuxt.js,SvelteKit&geo=ALL&rank=ALL&page=1
- WQ2 · Messung · HTTP Archive Tech Report, Framer Sites, Gatsby, Remix, React Router, Eleventy, global. https://httparchive.org/reports/techreport/tech?client=mobile&tech=Framer%20Sites,Gatsby,Remix,React%20Router,Eleventy&geo=ALL&rank=ALL&page=1
- WQ3 · Messung · HTTP Archive Tech Report, Webflow, Wix, Squarespace, Framer, Duda, global. https://httparchive.org/reports/techreport/tech?client=mobile&tech=Webflow,Wix,Squarespace,Framer,Duda&geo=ALL&rank=ALL&page=1
- WQ4 · Messung · HTTP Archive Tech Report, Besucher aus der Schweiz. https://httparchive.org/reports/techreport/tech?client=mobile&tech=WordPress,Wix,Webflow,Next.js,Astro&geo=Switzerland&rank=ALL&page=1 und https://httparchive.org/reports/techreport/tech?client=mobile&tech=Squarespace,Framer%20Sites,Jimdo,TYPO3%20CMS,Drupal&geo=Switzerland&rank=ALL&page=1
- WQ5 · Messung · HTTP Archive Tech Report, Shopsysteme, global. https://httparchive.org/reports/techreport/tech?tech=Shopify,WooCommerce,Wix%20eCommerce,Squarespace%20Commerce,Magento,Shopware,PrestaShop,BigCommerce
- WQ6 · Messung · HTTP Archive Tech Report, Shopsysteme, Schweiz. https://httparchive.org/reports/techreport/tech?tech=Shopify,WooCommerce,Wix%20eCommerce,Squarespace%20Commerce,Magento,Shopware,PrestaShop,BigCommerce&geo=Switzerland&rank=ALL
- WQ7 · Messung · HTTP Archive Tech Report, Hydrogen und Headless. https://httparchive.org/reports/techreport/tech?tech=Hydrogen,Next.js,Nuxt.js,Astro,Medusa,Saleor&geo=ALL&rank=ALL
- WQ8 · Messung · W3Techs, CMS-Übersicht. https://w3techs.com/technologies/overview/content_management
- WQ9 · Messung · W3Techs, CMS unter .ch. https://w3techs.com/technologies/segmentation/tld-ch-/content_management
- WQ10 · Messung · W3Techs, Anteil .ch je CMS. https://w3techs.com/technologies/breakdown/tld-ch-/content_management
- WQ11 · Messung · HTTP Archive, Web Almanac 2025, CMS (Crawl Juli 2025). https://almanac.httparchive.org/en/2025/cms
- WQ12 · Messung · State of JavaScript 2025, Meta-Frameworks (Umfrage mit Selbstauswahl). https://2025.stateofjs.com/en-US/libraries/meta-frameworks/
- WQ13 · Messung · Stichprobe der Recherche: 61 jüngste Awwwards-Sites des Tages, Startseiten-HTML nach Markern durchsucht. Liste: https://www.awwwards.com/websites/sites_of_the_day/

**Export und Lock-in**

- WQ14 · Anbieter · Webflow, Code exportieren. https://help.webflow.com/hc/en-us/articles/33961386739347-How-do-I-export-my-Webflow-site-code
- WQ15 · Anbieter · Framer, «Can I export my website to HTML and self-host it?». https://www.framer.com/help/articles/can-i-export-my-website-to-html-and-self-host-it/
- WQ16 · Anbieter · Framer, «Porting your data from Framer». https://www.framer.com/help/articles/porting-your-data-from-framer/
- WQ17 · Anbieter · Wix, Website exportieren oder einbetten. https://support.wix.com/en/article/exporting-or-embedding-your-wix-site-elsewhere
- WQ18 · Anbieter · Squarespace, Inhalte exportieren. https://support.squarespace.com/hc/en-us/articles/206566687-Export-your-site-content
- WQ19 · Anbieter · WordPress, Werkzeug Export. https://wordpress.org/documentation/article/tools-export-screen/
- WQ20 · Anbieter · Cloudflare, «Astro joins Cloudflare» (16.01.2026). https://blog.cloudflare.com/astro-joins-cloudflare
- WQ21 · Anbieter · Next.js, Adapter API (16.2). https://nextjs.org/blog/nextjs-across-platforms
- WQ22 · Anbieter · Decap CMS. https://decapcms.org/docs/intro/
- WQ23 · Anbieter · Keystatic. https://keystatic.com/docs/introduction
- WQ24 · Anbieter · TinaCMS. https://tina.io/docs
- WQ25 · Anbieter · Sanity, Dataset exportieren. https://www.sanity.io/docs/content-lake/exporting-data
- WQ26 · Anbieter · Storyblok, CMS-Migration. https://www.storyblok.com/docs/concepts/cms-migration
- WQ27 · Anbieter · Payload, «Payload is joining Figma» (17.06.2025). https://payloadcms.com/posts/blog/payload-is-joining-figma
- WQ28 · Anbieter · Shopify, Produkte exportieren. https://help.shopify.com/en/manual/products/import-export/export-products
- WQ29 · Anbieter · Shopify, Kunden importieren und exportieren. https://help.shopify.com/en/manual/customers/import-export-customers
- WQ30 · Anbieter · Shopify Partners, Kunden und Shops verwalten. https://help.shopify.com/en/partners/manage-clients-stores
- WQ31 · Anbieter · Shopify Partners, Client Transfer Stores. https://help.shopify.com/en/partners/manage-clients-stores/client-transfer-stores

**Preise**

- WQ32 · Anbieter · Webflow, Preise und FAQ. https://webflow.com/pricing
- WQ33 · Anbieter · Framer, Preise. https://www.framer.com/pricing
- WQ34 · Anbieter · Wix, Pläne. https://www.wix.com/plans
- WQ35 · Anbieter · Squarespace, Preise CH. https://de.squarespace.com/preise
- WQ36 · Anbieter · Storyblok, Preise. https://www.storyblok.com/pricing
- WQ37 · Anbieter · Sanity, Preise. https://www.sanity.io/pricing
- WQ38 · Anbieter · TinaCloud, Preise. https://tina.io/pricing
- WQ39 · Anbieter · cyon, Webhosting und Rechenzentrum. https://www.cyon.ch/hosting/webhosting
- WQ40 · Anbieter · Infomaniak, Tarife. https://www.infomaniak.com/de/hosting/tarife-und-merkmale
- WQ41 · Anbieter · WPML, Preise. https://app.wpml.org/purchase
- WQ42 · Anbieter · Cloudflare, Static Assets, Abrechnung. https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- WQ43 · Anbieter · Vercel, Preise. https://vercel.com/pricing
- WQ44 · Anbieter · Supabase, Preise. https://supabase.com/pricing
- WQ45 · Anbieter · Shopify, Preise Schweiz. https://www.shopify.com/ch/preise
- WQ46 · Anbieter · Shopify Plus, Preise. https://www.shopify.com/plus/pricing
- WQ47 · Anbieter · Shopware, Preise. https://www.shopware.com/en/pricing/
- WQ48 · Anbieter · Shopware, Fair Usage Policy Community Edition. https://www.shopware.com/en/news/fair-usage-policy-community-edition/
- WQ49 · Anbieter · GSAP 3.13, «GSAP is now 100% FREE» (29.04.2025). https://gsap.com/blog/3-13/

**Datenschutz und Standort**

- WQ50 · Anbieter · Webflow, DPA und EU & Swiss Privacy Policy. https://webflow.com/legal/dpa und https://webflow.com/legal/eu-privacy-policy
- WQ51 · Anbieter · Webflow Wishlist, EU-Hosting. https://wishlist.webflow.com/ideas/WEBFLOW-I-3429
- WQ52 · Anbieter · Framer, Security. https://www.framer.com/legal/security
- WQ53 · Anbieter · Wix, Trust Center FAQ. https://www.wix.com/trust-center/faq
- WQ54 · Anbieter · Squarespace, Datenspeicherort. https://support.squarespace.com/hc/en-us/articles/115012540827-Where-does-Squarespace-store-my-data
- WQ55 · Behörde · EDÖB, Swiss-U.S. Data Privacy Framework (15.08.2024). https://www.edoeb.admin.ch/en/15082024-new-swiss-us-data-privacy-framework
- WQ56 · Anbieter · Supabase, Regionen. https://supabase.com/docs/guides/platform/regions
- WQ57 · Behörde · Fedlex, DSG (SR 235.1). https://www.fedlex.admin.ch/eli/cc/2022/491/de#art_19

**Zahlung und Recht**

- WQ58 · Anbieter · Shopify, TWINT. https://help.shopify.com/en/manual/payments/shopify-payments/local-payment-methods/twint
- WQ59 · Anbieter · Stripe, TWINT. https://docs.stripe.com/payments/twint
- WQ60 · Anbieter · Stripe, Preise lokaler Zahlarten CH. https://stripe.com/en-ch/pricing/local-payment-methods
- WQ61 · Anbieter · Payrexx, Preise. https://payrexx.com/en-ch/pricing
- WQ62 · Anbieter · WooCommerce, Stripe, weitere Zahlarten. https://woocommerce.com/document/stripe/setup-and-configuration/additional-payment-methods/
- WQ63 · Anbieter · TWINT, Express Checkout für WooCommerce (PDF). https://www.twint.ch/content/uploads/2026/05/TWINT_Express_Checkout_WooCommerce_EN_NEU.pdf
- WQ64 · Anbieter · Shopware Store, TWINT-Plugin. https://store.shopware.com/en/twint19939477623f/twint-checkout-standard-and-express-plugin-for-shopware.html
- WQ65 · Anbieter · Wix, TWINT über TFTW. https://support.wix.com/en/article/connecting-twint-provided-by-tftw-as-a-payment-provider
- WQ66 · Meinung · Squarespace-Forum, Antwort eines Nutzers. https://forum.squarespace.com/topic/239694-no-plug-in-that-works-in-my-country-is-there-another-solution/
- WQ67 · Behörde · ESTV, MWST-Sätze. https://www.estv.admin.ch/estv/de/home/mehrwertsteuer/mwst-steuersaetze.html
- WQ68 · Behörde · Fedlex, UWG (SR 241) Art. 3. https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/de#art_3
- WQ69 · Behörde · Fedlex, OR (SR 220) Art. 40a und 40b. https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_40_a
- WQ70 · Behörde · Fedlex, PBV (SR 942.211). https://www.fedlex.admin.ch/eli/cc/1978/2081_2081_2081/de
- WQ71 · Behörde · SECO, Informationsblatt Onlinehandel mit Waren (01.10.2021). https://www.seco.admin.ch/dam/de/sd-web/6SGen1K7YQ7J/PBV-Brosch%C3%BCren-Onlinehandel-mit-Waren-SECO-DE.pdf
- WQ72 · Behörde · ESTV, Versandhandel und Plattformbesteuerung. https://www.estv.admin.ch/de/mwst-versandhandel-und-plattformbesteuerung

**Headless und Dienste**

- WQ73 · Anbieter · Shopify, Hydrogen, Einstieg. https://shopify.dev/docs/storefronts/hydrogen/getting-started
- WQ74 · Anbieter · Calenso. https://calenso.com/
- WQ75 · Anbieter · KLARA, Terminbuchung. https://www.klara.ch/online-terminbuchung

**Meinungen**

- WQ76 · Meinung · AetherDigital (CH), WordPress vs Astro (13.08.2026). https://aetherdigital.ch/blog/wordpress-vs-astro-small-business-website
- WQ77 · Meinung · NuStart Solutions, Umzug von WordPress auf Astro (30.09.2026). https://nustart.solutions/astro/why-i-moved-my-own-site-from-wordpress-to-astro/
- WQ78 · Meinung · getastrothemes.com, Astro vs WordPress für Kundenseiten (16.10.2026). https://getastrothemes.com/blog/astro-vs-wordpress-client-websites/
- WQ79 · Meinung · FocusReactive, Sanity- und Next.js-Agentur. https://focusreactive.com/services/sanity-nextjs-agency/
- WQ80 · Meinung · Makers' Den, Storyblok und Astro (15.08.2025). https://makersden.io/blog/building-high-perf-marketing-website-with-storyblok-and-astrojs
- WQ81 · Meinung · Noevu (CH), WordPress-Alternativen 2026. https://noevu.ch/en/tips/cms/best-wordpress-alternative
- WQ82 · Meinung · Pantheon, Headless-CMS für Next.js. https://pantheon.io/learning-center/headless/best-cms-nextjs
- WQ83 · Meinung · Codrops, Webflow, GSAP und Three.js (18.03.2026). https://tympanus.net/codrops/2026/03/18/building-seamless-3d-transitions-with-webflow-gsap-and-three-js/
- WQ84 · Meinung · MakerKit, SaaS-Stack 2026. https://makerkit.dev/blog/saas/saas-stack-2026
- WQ85 · Meinung · Fudge, Headless Shopify mit Hydrogen (aktualisiert 27.10.2026). https://www.fudge.ai/de/blog/headless-shopify-hydrogen/
- WQ86 · Meinung · Flatline Agency, Shopware vs. Shopify (2026). https://www.flatlineagency.com/de/blog/shopware-vs-shopify-vergleich
- WQ87 · Meinung · Ostend Digital, Shopware vs. Shopify (26.02.2026). https://ostend.digital/shopify-vs-shopware/
- WQ88 · Meinung · ActiveSet, Kosten der Lokalisierung in Webflow. https://www.activeset.co/blog/webflow-localization-cost
- WQ89 · Meinung · We-Optimizz, Framer vs Webflow vs WordPress vs Wix Studio. https://www.we-optimizz.com/post/framer-vs-webflow-wordpress-wix
