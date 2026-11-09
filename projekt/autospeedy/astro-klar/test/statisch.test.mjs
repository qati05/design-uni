// Prüft den Bau (dist/) ohne Browser: CSP, keine Inline-Skripte, Schreibweise, Bausteine der Runde «Premium».
// Vorher: npm run build.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const wurzel = fileURLToPath(new URL("../", import.meta.url));
const html = [];
(function lauf(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) lauf(p); else if (p.endsWith(".html")) html.push(p); } })(dist);
const lies = (p) => fs.readFileSync(p, "utf8");

test("_headers: volle CSP ohne unsafe-inline/eval bei Skripten", () => {
  const h = lies(path.join(dist, "_headers"));
  const csp = h.match(/^\s+Content-Security-Policy: (.*)$/m)[1];
  const skript = csp.match(/script-src ([^;]*)/)[1];
  assert.match(skript, /'self'/);
  assert.doesNotMatch(skript, /unsafe-inline|unsafe-eval/);
  for (const d of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'"]) assert.ok(csp.includes(d), d);
  assert.match(h, /X-Content-Type-Options: nosniff/);
});

test("kein ausführbares Inline-Skript, keine on…-Attribute", () => {
  for (const p of html) {
    const s = lies(p);
    for (const m of s.matchAll(/<script(\s[^>]*)?>/g)) {
      const a = m[1] || "";
      assert.ok(/\ssrc=/.test(a) || /type="application\/ld\+json"/.test(a), `${p}: Inline-Skript ${m[0]}`);
    }
    assert.doesNotMatch(s, /\son[a-z]+="/, `${p}: on…-Attribut`);
  }
});

test("de-CH: kein ß in Seiten, CSS und JS", () => {
  const dateien = [...html, path.join(dist, "css/klar.css"), path.join(dist, "js/klar.js")];
  for (const p of dateien) assert.ok(!lies(p).includes("ß"), p);
});

test("Vergleich zugänglich auf /leistungen/felgen/ (nicht auf der Startseite), Handyleiste komplett", () => {
  // Der Felgen-Vorher/Nachher-Regler steht auf der eigenen Seite der Felgen.
  const start = lies(path.join(dist, "index.html"));
  assert.doesNotMatch(start, /data-vergleich/, "kein Felgen-Regler mehr auf der Startseite");
  const leist = lies(path.join(dist, "leistungen", "felgen", "index.html"));
  assert.match(leist, /data-vergleich/, "Regler auf /leistungen/felgen/");
  assert.match(leist, /<input[^>]*type="range"[^>]*aria-label="[^"]+"/, "zugänglicher Range-Regler");
  const leiste = start.match(/<nav class="handyleiste"[\s\S]*?<\/nav>/)[0];
  assert.match(leiste, /href="tel:/);
  assert.match(leiste, /href="\/schaden-melden\/"/);
});

test("Tesla-Seite: kein «Rückruf»-Versprechen und keine interne Notiz «nachgeprüft» (A3/A4)", () => {
  const s = lies(path.join(dist, "tesla", "index.html"));
  assert.ok(!s.includes("Rückruf"), "kein «Rückruf» auf der Tesla-Seite");
  assert.ok(!s.includes("nachgeprüft"), "keine interne Notiz «nachgeprüft»");
  assert.match(s, /So wissen wir gleich, welches Auto kommt\./, "neutraler Satz statt Rückruf (A4)");
});

test("Fuss auf /schaden-melden/ ohne Selbstlink «Schaden melden» (A5)", () => {
  const html = lies(path.join(dist, "schaden-melden", "index.html"));
  const fuss = html.match(/<footer class="fuss"[\s\S]*?<\/footer>/)[0];
  assert.ok(!fuss.includes('href="/schaden-melden/"'), "kein Schaden-melden-Selbstlink im Fuss der Formularseite");
  assert.match(fuss, /href="tel:/, "aber «Anrufen» bleibt im Fuss");
  // Gegenprobe: auf der Startseite steht der Knopf weiterhin.
  const fussIndex = lies(path.join(dist, "index.html")).match(/<footer class="fuss"[\s\S]*?<\/footer>/)[0];
  assert.ok(fussIndex.includes('href="/schaden-melden/"'), "Startseite: Schaden melden bleibt im Fuss");
});

test("Inhaber und Team: echte Porträts, keine B8-Platzhalter, kein erfundenes Zitat (Review 07.11.2026)", () => {
  const s = lies(path.join(dist, "index.html"));
  const teil = s.match(/<section id="team"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(teil, /Platzhalter|B8|Hier steht ein Satz vom Inhaber|\[Name\]/, "keine Platzhalter im Teamteil");
  assert.equal((teil.match(/<img [^>]*alt="Porträt /g) || []).length, 4, "vier echte Porträts");
  assert.doesNotMatch(teil, /<blockquote/, "ohne freigegebene Stimme kein Zitat");
  assert.match(teil, /href="\/team\/"[^>]*>\s*Ganzes Team/, "Link Ganzes Team");
});

test("Bewertungen ohne Daten: Abschnitt fehlt ganz (Entscheid 22:00), keine Platzhalter-Note, keine Karten", () => {
  const s = lies(path.join(dist, "index.html"));
  assert.doesNotMatch(s, /–,– von 5/, "keine Platzhalter-Note live");
  assert.doesNotMatch(s, /id="bewertungen-titel"/, "Abschnitt nicht gerendert");
  assert.doesNotMatch(s, /class="bew-reihe"|class="bew"[\s>]|Bewertungskarte/, "keine Bewertungskarten");
});

test("dist enthält keinen Schlüssel und nicht den Header «X-Goog-Api-Key»", () => {
  for (const p of [...html, path.join(dist, "css/klar.css"), path.join(dist, "js/klar.js")]) {
    const s = lies(p);
    assert.ok(!s.includes("X-Goog-Api-Key"), `${p}: Header-Name darf nicht in dist stehen`);
    assert.ok(!s.includes("GOOGLE_PLACES_SCHLUESSEL"), `${p}: Schlüssel-Name`);
    assert.doesNotMatch(s, /AIza[0-9A-Za-z_-]{10,}/, `${p}: sieht aus wie ein Google-API-Schlüssel`);
  }
});

test("src/daten/bewertungen.json: keine Bewertungstexte (reviews) und keine erfundene Note", () => {
  const d = JSON.parse(fs.readFileSync(new URL("../src/daten/bewertungen.json", import.meta.url), "utf8"));
  assert.ok(!("reviews" in d), "kein Feld reviews");
  assert.ok(!("autor" in d) && !("text" in d), "keine Autoren oder Texte");
  assert.ok(d.status === "leer" || d.status === "ok" || d.status === "fehler", "status gesetzt");
  if (d.status !== "ok") assert.ok(!("note" in d), "ohne Daten keine Note in der echten Datei");
});

test("Schriften liegen selbst gehostet vor, kein Google-CDN", () => {
  for (const p of html) assert.doesNotMatch(lies(p), /fonts\.(googleapis|gstatic)\.com/, p);
  for (const f of [
    "source-serif-4-latin-opsz-normal.woff2",
    "source-serif-4-latin-opsz-italic.woff2",
    "archivo-latin-wdth-normal.woff2",
    "hanken-grotesk-latin-400-normal.woff2",
    "hanken-grotesk-latin-500-normal.woff2",
    "hanken-grotesk-latin-600-normal.woff2",
  ]) assert.ok(fs.existsSync(path.join(dist, "fonts", f)), f);
  assert.ok(!fs.existsSync(path.join(dist, "fonts/instrument-serif-latin-400-normal.woff2")), "Instrument Serif entfernt");
});

test("keine Schriftdatei groesser als 60 KB", () => {
  const dir = path.join(dist, "fonts");
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".woff2")) continue;
    const kb = fs.statSync(path.join(dir, f)).size / 1024;
    assert.ok(kb <= 60, `${f}: ${kb.toFixed(1)} KB`);
  }
});

// --- Nachtrag 04.11.2026: Startseite (6 Leistungen), Partner, Bewertungen, SEO und AEO ---

test("Nachtrag: 6 Leistungskarten in fester Reihenfolge, Titel «Felgen» (nie «Alufelgen»)", () => {
  const s = lies(path.join(dist, "index.html"));
  const sec = s.match(/<section class="leistungen"[\s\S]*?<\/section>/)[0];
  const hrefs = [...sec.matchAll(/href="(\/leistungen\/[a-z-]+\/)"/g)].map((m) => m[1]);
  assert.deepEqual(hrefs, ["/leistungen/unfall-carrosserie/", "/leistungen/hagel-dellen/", "/leistungen/lack/", "/leistungen/felgen/", "/leistungen/folierung/", "/leistungen/scheiben/"], "6 Karten in der bestellten Reihenfolge");
  assert.match(sec, /<h3>Felgen<\/h3>/, "Karte heisst «Felgen»");
  assert.match(sec, /Ausserdem: Occasionen, Ankauf und Leasing\./, "Ausserdem-Zeile");
  // «Alufelgen» darf auf KEINER gebauten Seite vorkommen (Reshat 04.11.).
  for (const p of html) assert.ok(!lies(p).includes("Alufelgen"), `${p}: «Alufelgen» verboten`);
});

test("Nachtrag SEO: jede Inhaltsseite hat Title, Description (<=155), Canonical, OG- und Twitter-Bild", () => {
  const seiten = ["index", "leistungen", "leistungen/unfall-carrosserie", "leistungen/hagel-dellen", "leistungen/lack", "leistungen/felgen", "leistungen/folierung", "leistungen/scheiben", "tesla", "occasionen", "team", "kontakt", "flotten", "bildnachweise", "impressum", "datenschutz", "schaden-melden"];
  const titel = new Set();
  for (const name of seiten) {
    const s = lies(path.join(dist, name === "index" ? "index.html" : path.join(name, "index.html")));
    const t = (s.match(/<title>([^<]+)<\/title>/) || [])[1];
    assert.ok(t && t.trim().length > 0, `${name}: Title vorhanden`);
    assert.ok(!titel.has(t), `${name}: Title eindeutig («${t}»)`);
    titel.add(t);
    const d = (s.match(/<meta name="description" content="([^"]+)"/) || [])[1];
    assert.ok(d && d.length > 0, `${name}: Meta-Description vorhanden`);
    assert.ok(d.length <= 155, `${name}: Description ${d ? d.length : 0} <= 155`);
    assert.match(s, /<link rel="canonical" href="https:\/\/[^"]+">/, `${name}: Canonical`);
    assert.match(s, /<meta property="og:image" content="https:\/\/[^"]+">/, `${name}: Open-Graph-Bild`);
    assert.match(s, /<meta name="twitter:card" content="summary_large_image">/, `${name}: Twitter Card`);
    assert.match(s, /<meta name="twitter:image" content="https:\/\/[^"]+">/, `${name}: Twitter-Bild`);
    assert.ok(!s.includes("ß"), `${name}: kein Eszett`);
  }
});

test("Nachtrag Icons/OG: favicon.ico, SVG-Icon, apple-touch-icon und og-Bild liegen im Bau", () => {
  for (const f of ["bilder/icons/favicon.ico", "bilder/icons/icon.svg", "bilder/icons/apple-touch-icon.png", "bilder/stock/og-start.jpg"])
    assert.ok(fs.existsSync(path.join(dist, f)), f);
  const s = lies(path.join(dist, "index.html"));
  assert.match(s, /<link rel="icon" href="\/bilder\/icons\/favicon\.ico"/);
  assert.match(s, /<link rel="icon" type="image\/svg\+xml" href="\/bilder\/icons\/icon\.svg">/);
  assert.match(s, /<link rel="apple-touch-icon" href="\/bilder\/icons\/apple-touch-icon\.png">/);
});

test("Nachtrag: Hero-Bild nicht lazy, fetchpriority=high, vorgeladen (LCP)", () => {
  const s = lies(path.join(dist, "index.html"));
  const bild = s.match(/<figure class="hero-bild">[\s\S]*?<\/figure>/)[0];
  assert.match(bild, /<img[^>]*fetchpriority="high"/, "Hero-img fetchpriority=high");
  assert.ok(!/<img[^>]*loading="lazy"/.test(bild), "Hero-img nicht lazy");
  assert.match(bild, /defender-kabine-960\.webp/, "eigenes Foto im Hero");
  assert.match(s, /<link rel="preload" as="image"[^>]*defender-kabine[^>]*fetchpriority="high">/, "Hero-Bild vorgeladen");
});

test("Nachtrag AEO: JSON-LD je Seite parsebar; AutoBodyShop mit Adresse/Telefon/Zeiten/6 Services; FAQPage; kein aggregateRating in der Vorschau", () => {
  for (const name of ["index", "leistungen", "tesla"]) {
    const s = lies(path.join(dist, name === "index" ? "index.html" : path.join(name, "index.html")));
    const roh = s.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(roh, `${name}: JSON-LD vorhanden`);
    const ld = JSON.parse(roh[1]); // wirft, wenn nicht parsebar
    assert.equal(ld["@context"], "https://schema.org", `${name}: @context`);
    assert.ok(Array.isArray(ld["@graph"]), `${name}: @graph`);
    const shop = ld["@graph"].find((x) => /AutoBody|AutoRepair/.test(x["@type"]));
    assert.ok(shop, `${name}: AutoBodyShop-Knoten`);
    assert.ok(shop.name && shop.telephone && shop.address && shop.address.addressLocality, `${name}: Name/Telefon/Adresse`);
    assert.ok(Array.isArray(shop.openingHoursSpecification) && shop.openingHoursSpecification.length > 0, `${name}: Öffnungszeiten`);
    assert.ok(Array.isArray(shop.areaServed) && shop.areaServed.some((a) => a.name === "Altstätten") && shop.areaServed.some((a) => a.name === "Rheintal"), `${name}: areaServed Altstätten/Rheintal`);
    assert.equal(shop.makesOffer.length, 6, `${name}: 6 Service-Einträge`);
    assert.ok(!("aggregateRating" in shop), `${name}: kein aggregateRating in der Vorschau`);
    const faq = ld["@graph"].find((x) => x["@type"] === "FAQPage");
    // Startseite/Leistungen: 5-6 Fragen (Auftrag); Tesla: kurze FAQ (>= 4).
    const minFragen = name === "tesla" ? 4 : 5;
    assert.ok(faq && faq.mainEntity.length >= minFragen, `${name}: FAQPage mit >= ${minFragen} Fragen`);
    for (const q of faq.mainEntity) assert.ok(q.name && q.acceptedAnswer && q.acceptedAnswer.text, `${name}: Frage/Antwort vollstaendig`);
  }
  // BreadcrumbList auf Unterseiten, nicht auf der Startseite.
  const ldTesla = JSON.parse(lies(path.join(dist, "tesla", "index.html")).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.ok(ldTesla["@graph"].some((x) => x["@type"] === "BreadcrumbList"), "Tesla: BreadcrumbList");
  const ldStart = JSON.parse(lies(path.join(dist, "index.html")).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.ok(!ldStart["@graph"].some((x) => x["@type"] === "BreadcrumbList"), "Startseite: keine BreadcrumbList");
});

test("Nachtrag AEO: die FAQ-Antworten stehen als sichtbarer Text auf der Seite (nicht nur im JSON-LD)", () => {
  const s = lies(path.join(dist, "index.html"));
  const sec = s.match(/<section class="faq abschnitt"[\s\S]*?<\/section>/)[0];
  for (const frage of ["Wer zahlt die Reparatur?", "Bekomme ich einen Ersatzwagen?", "Reparieren Sie auch Tesla?"])
    assert.ok(sec.includes(frage), `sichtbare Frage: ${frage}`);
  assert.match(sec, /Auf Anfrage\. Wir haben sechs Ersatzautos, darunter einen Tesla\./, "Ersatzwagen-Antwort als Text");
});

test("Nachtrag llms.txt vorhanden, mit Kurzbeschreibung und Seiten-Links", () => {
  const s = lies(path.join(dist, "llms.txt"));
  assert.match(s, /# Auto Speedy/);
  for (const l of ["/leistungen/", "/tesla/", "/schaden-melden/"]) assert.ok(s.includes(l), `Link ${l}`);
  assert.ok(!s.includes("ß"), "kein Eszett in llms.txt");
});

test("Nachtrag Bewertungen: in der Vorschau 3 Zitate (Note 4,8, «Name folgt», Hinweis), kein echter Abschnitt ohne Daten", () => {
  const s = lies(path.join(dist, "index.html"));
  // Der echte Bewertungs-Abschnitt (mit Note aus bewertungen.json) erscheint ohne Daten gar nicht.
  assert.doesNotMatch(s, /id="bewertungen-titel"/, "kein echter Bewertungs-Abschnitt ohne Daten");
  assert.doesNotMatch(s, /–,– von 5/, "nie der Platzhalter «–,– von 5»");
  // Die Vorschau-Zitate sind sichtbar, als Vorschau markiert und live ausgeblendet (gleicher Schalter wie Lücke-Boxen).
  const vor = s.match(/<section class="abschnitt abschnitt--rand bewertungen-vorschau[\s\S]*?<\/section>/);
  assert.ok(vor, "Vorschau-Bewertungen sichtbar (noindex-Vorschau)");
  assert.match(vor[0], /4,8 von 5 auf Google/, "Note 4,8");
  assert.match(vor[0], /Name folgt/, "Namen stehen auf «Name folgt»");
  assert.match(vor[0], /Nur in der Vorschau/, "Hinweis, dass der Block live noch aus ist");
});

test("Nachtrag Schalter Vorschau: noindex-Meta und robots.txt ohne Sperre, keine Sitemap", () => {
  assert.match(lies(path.join(dist, "index.html")), /<meta name="robots" content="noindex">/, "noindex in der Vorschau");
  const robots = lies(path.join(dist, "robots.txt"));
  assert.match(robots, /Disallow:\s*$/m, "robots.txt sperrt nichts (noindex steht im Meta/Header)");
  assert.ok(!/Sitemap:/.test(robots), "keine Sitemap in der Vorschau");
  assert.ok(!fs.existsSync(path.join(dist, "sitemap.xml")), "keine sitemap.xml in der Vorschau");
});

test("Nachtrag Schalter Live (Testbuild): index + Sitemap, kein noindex, sitemap.xml vorhanden, weiterhin kein aggregateRating ohne echte Bewertungen", () => {
  const quelle = path.join(wurzel, "../astro/src/content");
  const inhalt = path.join(os.tmpdir(), `content-live-${process.pid}`);
  const outDir = path.join(os.tmpdir(), `dist-live-${process.pid}`);
  fs.mkdirSync(inhalt, { recursive: true });
  for (const f of fs.readdirSync(quelle)) fs.copyFileSync(path.join(quelle, f), path.join(inhalt, f));
  const bp = path.join(inhalt, "bau.json");
  const bau = JSON.parse(fs.readFileSync(bp, "utf8"));
  bau.vorschau = false;
  bau.adresse = "https://www.autospeedy.ch";
  bau.kiTraining = { entscheid: "erlaubt", datum: "2026-11-04" };
  bau.crawlerListeGeprueft = "2026-11-04";
  fs.writeFileSync(bp, JSON.stringify(bau, null, 2));
  try {
    execSync(`npx astro build --outDir ${outDir}`, { cwd: wurzel, env: { ...process.env, DATEN: inhalt }, stdio: "pipe" });
    const idx = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
    assert.ok(!/<meta name="robots" content="noindex">/.test(idx), "live: kein noindex-Meta");
    const robots = fs.readFileSync(path.join(outDir, "robots.txt"), "utf8");
    assert.match(robots, /Sitemap: https:\/\/www\.autospeedy\.ch\/sitemap\.xml/, "live: robots.txt mit Sitemap");
    assert.ok(fs.existsSync(path.join(outDir, "sitemap.xml")), "live: sitemap.xml vorhanden");
    // QA K11: Die Sitemap listet alle öffentlichen Seiten (ohne 404, Editor, Druckseite).
    const karte = fs.readFileSync(path.join(outDir, "sitemap.xml"), "utf8");
    for (const p of ["/", "/leistungen/", "/leistungen/unfall-carrosserie/", "/leistungen/hagel-dellen/", "/leistungen/lack/", "/leistungen/felgen/", "/leistungen/folierung/", "/leistungen/scheiben/", "/tesla/", "/flotten/", "/occasionen/", "/team/", "/kontakt/", "/schaden-melden/", "/impressum/", "/datenschutz/", "/bildnachweise/"])
      assert.ok(karte.includes(`<loc>https://www.autospeedy.ch${p}</loc>`), `live: Sitemap mit ${p}`);
    assert.doesNotMatch(karte, /404|\/admin\/|\/druck\/|\/bewerten\//, "live: keine 404, kein Editor, keine Druckseite, keine QR-Landeseite /bewerten/");
    assert.match(fs.readFileSync(path.join(outDir, "bewerten", "index.html"), "utf8"), /<meta name="robots" content="noindex">/, "live: /bewerten/ noindex");
    // Ohne echte Bewertungen (bewertungen.json «leer») bleibt aggregateRating auch live weg.
    const ld = JSON.parse(idx.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const shop = ld["@graph"].find((x) => /AutoBody|AutoRepair/.test(x["@type"]));
    assert.ok(!("aggregateRating" in shop), "live ohne Daten: kein aggregateRating");
  } finally {
    fs.rmSync(inhalt, { recursive: true, force: true });
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});

test("Nachtrag SEO/AEO 08.11.: Service je Leistungsseite, WebSite/WebPage, Brotkrumen auf Kontakt/Team, keine JSON-LD auf 404, llms.txt mit Zeiten", () => {
  const ldVon = (rel) => { const m = lies(path.join(dist, rel)).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/); return m ? JSON.parse(m[1])["@graph"] : null; };
  const lack = ldVon("leistungen/lack/index.html");
  assert.ok(lack.some((x) => x["@type"] === "Service" && x.provider && x.areaServed), "Lack: Service mit Anbieter und Gebiet");
  assert.ok(lack.some((x) => x["@type"] === "WebSite") && lack.some((x) => x["@type"] === "WebPage"), "Lack: WebSite und WebPage");
  for (const s of ["kontakt", "team"]) assert.ok(ldVon(`${s}/index.html`).some((x) => x["@type"] === "BreadcrumbList"), `${s}: BreadcrumbList`);
  assert.ok(ldVon("team/index.html").some((x) => x["@type"] === "Person" && x.jobTitle), "Team: Personen mit Rolle");
  assert.equal(ldVon("404.html"), null, "404: kein JSON-LD");
  assert.doesNotMatch(lies(path.join(dist, "404.html")), /rel="canonical"/, "404: kein canonical");
  const llms = lies(path.join(dist, "llms.txt"));
  assert.match(llms, /Öffnungszeiten: Mo bis Fr/, "llms.txt: Zeiten aus den Daten");
  assert.match(llms, /keine festen Preise/, "llms.txt: keine Fixpreise");
});

// QA-Befunde Linie «Klar» (B3, 09.11.2026), Teil ohne Browser.
const seite = (rel) => lies(path.join(dist, rel === "" ? "index.html" : path.join(rel, "index.html")));
const sichtbar = (s) => s.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;| /g, " ").replace(/\s+/g, " ");

test("K08: Schaden- und Rückruf-Formulare verweisen auf /datenschutz/; Datenschutz nennt Hoster, Formular- und Maildienst mit Land", () => {
  for (const rel of ["schaden-melden", "kontakt", "flotten", "occasionen"]) {
    const s = seite(rel);
    for (const f of s.match(/<form[\s\S]*?<\/form>/g)) assert.match(f, /href="\/datenschutz\/"/, `${rel}: Formular mit Link zur Datenschutzerklärung`);
  }
  const d = sichtbar(seite("datenschutz"));
  assert.match(d, /Cloudflare Pages \(Cloudflare, Inc\., USA\)/, "Hoster mit Land");
  assert.match(d, /Cloudflare Email \(Cloudflare, Inc\., USA\)/, "Formular-Mail an den Betrieb");
  assert.match(d, /Brevo \(Sendinblue SAS, Frankreich\)/, "Maildienst an die Kundschaft");
  assert.doesNotMatch(d, /Datenbank in Zürich|Werkstatt-System/, "kein veralteter Weg über eine Datenbank");
  assert.match(d, /Vom Betrieb zu prüfen/, "Ergänzungen als vom Betrieb zu prüfen markiert");
});

test("K10: alle Titel höchstens 60 Zeichen", () => {
  for (const p of html) {
    const t = (lies(p).match(/<title>([^<]+)<\/title>/) || [])[1];
    if (t) assert.ok(t.length <= 60, `${path.relative(dist, p)}: ${t.length} Zeichen («${t}»)`);
  }
});

test("K11: JSON-LD ohne erfundene Koordinaten (geo erst mit Daten des Betriebs)", () => {
  const ld = JSON.parse(seite("").match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const shop = ld["@graph"].find((x) => /AutoBody|AutoRepair/.test(x["@type"]));
  assert.ok(!("geo" in shop), "kein geo, solange betrieb.json geo: null hat");
});

test("K12: «Termin» und «Offerte» sichtbar auf Start und Leistungen; keine Schrittzählung vor der Meldung", () => {
  for (const rel of ["", "leistungen"]) {
    const t = sichtbar(seite(rel));
    assert.match(t, /Termin/, `${rel || "Start"}: Termin`);
    assert.match(t, /Offerte/, `${rel || "Start"}: Offerte`);
    assert.match(t, /Nach Ihrer Meldung geht es so weiter/, `${rel || "Start"}: Ablauf beginnt nach der Meldung`);
  }
  assert.doesNotMatch(seite(""), /class="ziffer"/, "Tesla-Teil ohne 01/02/03");
  assert.match(sichtbar(seite("schaden-melden")), /In zwei Schritten/, "Formular: zwei Schritte");
});

test("K19: Öffnungszeiten überall in einer Schreibweise", () => {
  const start = sichtbar(seite(""));
  assert.match(start, /Mo bis Fr 7\.30 bis 12\.00 Uhr und 13\.15 bis 17\.30 Uhr/, "Faktenleiste wie der Fuss");
  assert.doesNotMatch(start, /7\.30–12/, "keine Kurzform mit Gedankenstrich");
  assert.doesNotMatch(sichtbar(seite("kontakt")), /7\.30–12/, "Rückruf-Zeitwahl ohne Kurzform");
});

test("K20: Impressum nennt alle geladenen Schriften", () => {
  const t = sichtbar(seite("impressum"));
  for (const s of ["Source Serif 4", "Hanken Grotesk", "Archivo"]) assert.ok(t.includes(s), s);
});

test("K21: «Was wir machen» bei Unfall zeigt eine Carrosseriereparatur, nicht die Folierung", () => {
  const s = seite("leistungen/unfall-carrosserie");
  const block = s.match(/<section class="abschnitt abschnitt--flaeche arbeiten"[\s\S]*?<\/section>/)[0];
  assert.match(block, /\/bilder\/werkstatt-/, "Werkstatt-Foto");
  assert.doesNotMatch(block, /abgeklebt-/, "nicht der teilfolierte Transporter");
});
