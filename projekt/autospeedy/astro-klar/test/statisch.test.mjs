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

// Zweiter Bau mit eingeblendeten Notizen (NOTIZEN=an), einmal je Testlauf: belegt, dass die gelben Kästen, die Platzhalter
// und die Vorschau-Zeile weiter funktionieren, obwohl die Vorgabe (bau.json «notizen» false) sie nicht mehr zeigt.
// Derselbe Bau hat Turnstile eingeschaltet (Test-Schlüssel von Cloudflare): Nur dann verspricht die Seite eine Bestätigungsmail.
const notizDist = path.join(os.tmpdir(), `dist-notizen-${process.pid}`);
let notizGebaut = false;
function mitNotizen(p) {
  if (!notizGebaut) {
    execSync(`npx astro build --outDir ${notizDist}`, { cwd: wurzel, env: { ...process.env, NOTIZEN: "an", TURNSTILE_SITEKEY: "1x00000000000000000000AA" }, stdio: "pipe" });
    notizGebaut = true;
    process.on("exit", () => fs.rmSync(notizDist, { recursive: true, force: true }));
  }
  return lies(path.join(notizDist, p));
}

test("Ohne Notizen (Vorgabe, Roni 10.11.2026): keine Lücke, kein Entwurf, kein Platzhalter-Hinweis, keine Vorschau-Zeile, keine leere Stelle", () => {
  assert.ok(html.length >= 16, "Seiten gefunden");
  for (const p of html) {
    const s = lies(p).replace(/<script[\s\S]*?<\/script>/g, "");
    const wo = path.relative(dist, p);
    assert.doesNotMatch(s, /data-luecke|data-vorschau[ >=]|class="luecke"|<!--luecke:/, `${wo}: keine Notiz und keine Marke`);
    assert.doesNotMatch(s, /Entwurf:|Entwurf, |Nur in der Vorschau|nur in der Vorschau|wird durch ein eigenes Foto ersetzt|Name folgt|Lücke:|Hier erscheint|Vom Betrieb zu prüfen|Rechtsprüfung nötig|Platzhalter:|Platzhalter von|Platzhalter-Fotos<|hm-platz/, `${wo}: kein Notiz-Text`);
    assert.doesNotMatch(s, /Nicht veröffentlicht, nicht freigegeben/, `${wo}: keine Vorschau-Zeile`);
  }
  // Wo nur eine Notiz stand, bleibt nichts Halbes zurück: keine Überschrift ohne Text, kein leerer Kasten.
  assert.doesNotMatch(lies(path.join(dist, "team/index.html")), /Ausbildung und Stellen/, "Team: keine Überschrift ohne Text");
  assert.doesNotMatch(lies(path.join(dist, "occasionen/index.html")), /platzhalter-widget|data-fremd[ >]/, "Occasionen: kein leerer Kasten, der Knopf führt zur Liste");
  assert.match(lies(path.join(dist, "occasionen/index.html")), /Aktuelle Occasionen auf AutoScout24/, "Occasionen: Knopf zur Liste bleibt");
  assert.doesNotMatch(lies(path.join(dist, "leistungen/index.html")), /id="umwelt"/, "Leistungen: kein leerer Abschnitt Umwelt");
  assert.doesNotMatch(lies(path.join(dist, "index.html")), /bew-vorschau-titel/, "Startseite: kein Muster-Abschnitt Bewertungen");
  assert.match(lies(path.join(dist, "leistungen/felgen/index.html")), /<figcaption class="vergleich__text">/, "Felgen: normale Bildunterschrift statt Notiz");
  // Die Vorschau bleibt eine Vorschau: weiterhin noindex.
  assert.match(lies(path.join(dist, "index.html")), /<meta name="robots" content="noindex">/);
});

test("Mit Notizen (NOTIZEN=an): Kästen, Platzhalter und Vorschau-Zeile sind wieder da", () => {
  const start = mitNotizen("index.html");
  assert.match(start, /<\/footer>\s*<p data-vorschau>/, "Vorschau-Zeile im Fluss direkt nach dem Fuss");
  assert.match(start, /data-luecke>Entwurf: Ablauf vom Betrieb zu bestätigen\./);
  assert.match(mitNotizen("tesla/index.html"), /data-luecke>Entwurf: Den genauen Ablauf für Tesla bestätigt der Betrieb noch\./, "Tesla: Ablauf bleibt offen");
  assert.match(mitNotizen("leistungen/index.html"), /id="umwelt"[\s\S]*?data-luecke>Lücke: Was Auto Speedy für die Umwelt macht, ergänzt der Betrieb/, "Leistungen: Lücke Umwelt");
  assert.match(mitNotizen("team/index.html"), /Ausbildung und Stellen/);
  assert.match(mitNotizen("occasionen/index.html"), /platzhalter-widget/);
});

test("_headers: volle CSP ohne unsafe-inline/eval bei Skripten", () => {
  const h = lies(path.join(dist, "_headers"));
  const csp = h.match(/^\s+Content-Security-Policy: (.*)$/m)[1];
  const skript = csp.match(/script-src ([^;]*)/)[1];
  assert.match(skript, /'self'/);
  assert.doesNotMatch(skript, /unsafe-inline|unsafe-eval/);
  for (const d of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'"]) assert.ok(csp.includes(d), d);
  assert.match(h, /X-Content-Type-Options: nosniff/);
});

test("CSP: Fotos aus dem Cockpit (Bild-Speicher) sind erlaubt, fremde Adressen bei gesetztem bilderHost nicht", async () => {
  const { bildHerkuenfte, cspZeile } = await import("../../astro/bau/dateien.mjs");
  const u = "0f8fad5b-d9cb-469f-a165-70867728950e";
  const site = {
    team: [{ leute: [{ foto: "/bilder/team/a.webp" }, { foto: `https://pub-abc.r2.dev/team/${u}.webp` }, {}] }],
    bilder: { hero: { foto: `https://pub-abc.r2.dev/bild/${u}.jpg` } },
    partner: [{ logo: "/bilder/partner/x.svg" }, { logo: `https://pub-abc.r2.dev/bild/${u}.png` }],
  };
  assert.deepEqual(bildHerkuenfte(site), ["https://pub-abc.r2.dev"]);
  assert.deepEqual(bildHerkuenfte({ team: [{ leute: [{ foto: "/bilder/team/a.webp" }] }] }), [], "nur Fotos aus dem Repo: nichts Fremdes");
  assert.match(cspZeile({ bau: {}, betrieb: {}, site }), /img-src 'self' data: blob: https:\/\/pub-abc\.r2\.dev;/);
  assert.match(cspZeile({ bau: {}, betrieb: {}, site: { team: [] } }), /img-src 'self' data: blob:;/);
  assert.deepEqual(bildHerkuenfte(site, { bilderHost: "https://pub-abc.r2.dev" }), ["https://pub-abc.r2.dev"]);
  assert.throws(() => bildHerkuenfte(site, { bilderHost: "https://pub-anders.r2.dev" }), /fremder Adresse/);
  assert.throws(() => bildHerkuenfte(site, { bilderHost: "pub-abc.r2.dev" }), /keine https-Adresse/);
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
  // Roni, 10.11.2026: Die drei einzelnen Felgen-Fotos sind weg, es bleibt nur der Regler, neben dem Text statt in voller Breite.
  // Unter dem Regler steht nur der Titel (wie man ihn bedient, sagt schon die Zeile unter der Überschrift).
  assert.doesNotMatch(leist, /felge-markiert|felge-gold|felge-pink/, "Felgen: keine einzelnen Felgen-Fotos");
  assert.doesNotMatch(leist, /Maus über das Bild bewegen|Waagrecht wischen/, "Felgen: kein doppelter Bedienhinweis");
  const abschnitt = leist.match(/<div class="felgen-vergleich">[\s\S]*?<\/section>/)?.[0] || "";
  assert.match(abschnitt, /id="felgen-titel"[\s\S]*data-vergleich/, "Felgen: Text und Regler in einem Raster");
  assert.equal((abschnitt.match(/<img /g) || []).length, 2, "Felgen: nur die zwei Bilder des Reglers (vorher, nachher)");
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
  const sec = s.match(/<section class="hm hm-leist"[\s\S]*?<\/section>/)[0];
  const hrefs = [...sec.matchAll(/href="(\/leistungen\/[a-z-]+\/)"/g)].map((m) => m[1]);
  assert.deepEqual(hrefs, ["/leistungen/unfall-carrosserie/", "/leistungen/hagel-dellen/", "/leistungen/lack/", "/leistungen/felgen/", "/leistungen/folierung/", "/leistungen/scheiben/"], "6 Karten in der bestellten Reihenfolge");
  assert.match(sec, /<h3[^>]*>Felgen<\/h3>/, "Karte heisst «Felgen»");
  assert.match(sec, /Ausserdem: Occasionen und Ankauf\./, "Ausserdem-Zeile");
  // «Alufelgen» darf auf KEINER gebauten Seite vorkommen (Reshat 04.11.).
  for (const p of html) assert.ok(!lies(p).includes("Alufelgen"), `${p}: «Alufelgen» verboten`);
});

test("Roni 09.11.2026: keine Seite für Firmen und Flotten, kein Leasing (nur Verkauf und Ankauf)", () => {
  assert.ok(!fs.existsSync(path.join(dist, "flotten/index.html")), "Seite /flotten/ gibt es nicht mehr");
  for (const p of html) {
    const s = lies(p);
    assert.ok(!/Leasing/i.test(s), `${p}: «Leasing» kommt nicht mehr vor`);
    assert.ok(!/href="\/flotten\//.test(s) && !/Firmenkunden|Flotten/.test(s), `${p}: kein Hinweis auf Firmen und Flotten`);
  }
});

test("Nachtrag SEO: jede Inhaltsseite hat Title, Description (<=155), Canonical, OG- und Twitter-Bild", () => {
  const seiten = ["index", "leistungen", "leistungen/unfall-carrosserie", "leistungen/hagel-dellen", "leistungen/lack", "leistungen/felgen", "leistungen/folierung", "leistungen/scheiben", "tesla", "occasionen", "team", "kontakt", "bildnachweise", "impressum", "datenschutz", "schaden-melden"];
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
  for (const f of ["bilder/icons/favicon.ico", "bilder/icons/icon.svg", "bilder/icons/apple-touch-icon.png", "bilder/og-start.jpg"])
    assert.ok(fs.existsSync(path.join(dist, f)), f);
  const s = lies(path.join(dist, "index.html"));
  assert.match(s, /<link rel="icon" href="\/bilder\/icons\/favicon\.ico"/);
  assert.match(s, /<link rel="icon" type="image\/svg\+xml" href="\/bilder\/icons\/icon\.svg">/);
  assert.match(s, /<link rel="apple-touch-icon" href="\/bilder\/icons\/apple-touch-icon\.png">/);
});

test("Nachtrag: Hero-Bild nicht lazy, fetchpriority=high, vorgeladen (LCP)", () => {
  const s = lies(path.join(dist, "index.html"));
  const bild = s.match(/<figure class="hm-hero__bild">[\s\S]*?<\/figure>/)[0];
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
  const sec = s.match(/<section class="hm hm-faq"[\s\S]*?<\/section>/)[0];
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

test("Bewertungen ohne echte Daten: mit Notizen nur Platzhalter mit sichtbarer Lücke unter der Überschrift, keine Note, kein Zitat", () => {
  const s = mitNotizen("index.html");
  // Der echte Bewertungs-Abschnitt (mit Note aus bewertungen.json) erscheint ohne Daten gar nicht.
  assert.doesNotMatch(s, /id="bewertungen-titel"/, "kein echter Bewertungs-Abschnitt ohne Daten");
  assert.doesNotMatch(s, /–,– von 5/, "nie der Platzhalter «–,– von 5»");
  // Prüfung 10.11.2026, Befund 2: Der Abschnitt bleibt mit Notizen als Muster sichtbar, aber ohne erfundene Zahl und
  // ohne Zitate. Der Hinweis steht als Lücke direkt unter der Überschrift; live gibt es den Abschnitt ohne Daten nicht.
  const vor = s.match(/<section class="hm hm-bew" aria-labelledby="bew-vorschau-titel"[\s\S]*?<\/section>/);
  assert.ok(vor, "Muster-Abschnitt sichtbar (Vorschau mit Notizen)");
  const text = vor[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  assert.doesNotMatch(text, /\d[,.]\d|von 5|\d+ Bewertungen/, "keine Note und keine Anzahl ohne echte Daten");
  assert.doesNotMatch(vor[0], /<blockquote/, "kein Zitat ohne echte Daten");
  assert.match(vor[0], /<\/h2>\s*<p class="luecke" data-luecke>Platzhalter, nur in der Vorschau/, "Lücke direkt unter der Überschrift");
  assert.equal((vor[0].match(/class="hm-platz[ "]/g) || []).length, 4, "ein Platzhalter für die Note, drei für Zitate");
  assert.doesNotMatch(s, /4,8/, "die frühere Vorschau-Note steht nirgends auf der Startseite");
});

test("Editor /admin/: in der Vorgabe nicht im Bau (Pflege im Cockpit), auch nicht sein Skript und Stil", () => {
  // Prüfung 10.11.2026, Befund 10: nur mit EDITOR_AKTIV=true beim Bau (siehe astro.config.mjs und hinweis-browser.test.mjs).
  for (const p of ["admin", "admin/index.html", "js/admin.js", "css/admin.css"]) assert.ok(!fs.existsSync(path.join(dist, p)), `${p} fehlt im normalen Bau`);
  for (const p of html) assert.doesNotMatch(lies(p), /href="\/admin\//, `${p}: kein Link auf /admin/`);
});

test("Kundentext ohne Quellenvermerk und ohne unbelegte Aussagen (Tesla, Team, Unfall, llms.txt, FAQ)", () => {
  // Prüfung 10.11.2026, Befunde 6, 11 und 12.
  const sicht = (p) => lies(path.join(dist, p)).replace(/<script[\s\S]*?<\/script>/g, "").replace(/<p class="luecke"[\s\S]*?<\/p>/g, "").replace(/<[^>]+>/g, " ");
  for (const p of ["tesla/index.html", "team/index.html", "llms.txt"]) {
    assert.doesNotMatch(sicht(p), /steht auf der (bisherigen )?Website|\(laut |laut Website|\(Stand /, `${p}: kein Quellenvermerk`);
  }
  assert.match(sicht("tesla/index.html"), /Ja\. Auto Speedy ist Tesla Approved Body Shop und damit von Tesla als Carrosseriewerkstatt zugelassen\./, "Tesla-Frage: schlichte Aussage");
  assert.doesNotMatch(sicht("team/index.html"), /Ausbildungsbetrieb|keine Stellen offen/, "Team: Unbestätigtes steht nicht als Aussage da");
  assert.match(mitNotizen("team/index.html"), /data-luecke>Lücke: Ob Auto Speedy Ausbildungsbetrieb ist/, "Team: als Lücke geführt");
  assert.doesNotMatch(sicht("leistungen/unfall-carrosserie/index.html"), /Lieferwagen/, "Unfall: unbelegter Satz ist kein Kundentext mehr");
  assert.match(mitNotizen("leistungen/unfall-carrosserie/index.html"), /data-luecke>Lücke: Ob Auto Speedy auch Lieferwagen/, "Unfall: als Lücke geführt");
  assert.match(mitNotizen("leistungen/felgen/index.html"), /data-luecke>Lücke: Beispielbilder/, "Felgen: Beispielbilder als Lücke");
  assert.match(mitNotizen("kontakt/index.html"), /data-luecke>Lücke: Die Mobilnummer/, "Kontakt: Mobilnummer als Lücke");
  // Befund 12: «An der Alten Landstrasse 63», sichtbar, in llms.txt und im FAQ-JSON-LD
  for (const p of ["index.html", "leistungen/index.html", "llms.txt"]) {
    const s = lies(path.join(dist, p));
    assert.doesNotMatch(s, /An der Alte Landstrasse/, `${p}: nicht «An der Alte»`);
    assert.match(s, /An der Alten Landstrasse 63 in 9450 Altstätten SG/, `${p}: «An der Alten Landstrasse 63»`);
  }
  const ld = JSON.parse(lies(path.join(dist, "tesla/index.html")).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const faq = ld["@graph"].find((x) => x["@type"] === "FAQPage");
  assert.doesNotMatch(JSON.stringify(faq), /steht auf der Website/, "FAQ-JSON-LD ohne Quellenvermerk");
});

test("Teilen-Bild: eigenes Hero-Foto 1200 × 630, kein Stockbild mehr", () => {
  // Prüfung 10.11.2026, Befund 8. JPEG-Masse aus dem SOF-Abschnitt gelesen (ohne Bildbibliothek).
  const b = fs.readFileSync(path.join(dist, "bilder/og-start.jpg"));
  let i = 2, masse = null;
  while (i < b.length) { const m = b[i + 1], l = b.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xc2) { masse = [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; break; } i += 2 + l; }
  assert.deepEqual(masse, [1200, 630]);
  assert.ok(!fs.existsSync(path.join(dist, "bilder/stock/og-start.jpg")), "altes Stockbild entfernt");
  const s = lies(path.join(dist, "index.html"));
  assert.match(s, /<meta property="og:image" content="https:\/\/[^"]+\/bilder\/og-start\.jpg">/);
  assert.match(s, /"image":"https:\/\/[^"]+\/bilder\/og-start\.jpg"/, "auch im JSON-LD");
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
  bau.pagesProjekt = "autospeedy-test";
  const baue = () => execSync(`npx astro build --outDir ${outDir}`, { cwd: wurzel, env: { ...process.env, DATEN: inhalt }, stdio: "pipe" });
  try {
    // Sperre: Solange Lücken offen und nicht freigegeben sind, bricht der Live-Bau mit der Liste ab.
    bau.lueckenFreigegeben = [];
    fs.writeFileSync(bp, JSON.stringify(bau, null, 2));
    let gesperrt = "";
    try { baue(); } catch (e) { gesperrt = String(e.stderr || "") + String(e.stdout || ""); }
    assert.match(gesperrt, /Livegang gesperrt: \d+ offene Lücken/, "live mit offenen Lücken: Bau bricht ab");
    assert.match(gesperrt, /\/datenschutz\/: «/, "die Liste nennt Seite und Text der Lücke");
    // Ohne Namen des Pages-Projekts gibt es keinen Livegang (sonst steht <name>.pages.dev doppelt im Index).
    fs.writeFileSync(bp, JSON.stringify({ ...bau, pagesProjekt: null, lueckenFreigegeben: ["*"] }, null, 2));
    let ohneProjekt = "";
    try { baue(); } catch (e) { ohneProjekt = String(e.stderr || "") + String(e.stdout || ""); }
    assert.match(ohneProjekt, /pagesProjekt/, "live ohne pagesProjekt: Bau bricht ab");
    // Bewusst freigegeben: Der Bau läuft, und von den Lücken bleibt im HTML keine Spur.
    bau.lueckenFreigegeben = ["*"];
    fs.writeFileSync(bp, JSON.stringify(bau, null, 2));
    baue();
    assert.match(fs.readFileSync(path.join(outDir, "_headers"), "utf8"), /https:\/\/autospeedy-test\.pages\.dev\/\*\n  X-Robots-Tag: noindex/, "live: pages.dev bleibt ausserhalb des Index");
    const idx = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
    assert.ok(!/<meta name="robots" content="noindex">/.test(idx), "live: kein noindex-Meta");
    const robots = fs.readFileSync(path.join(outDir, "robots.txt"), "utf8");
    assert.match(robots, /Sitemap: https:\/\/www\.autospeedy\.ch\/sitemap\.xml/, "live: robots.txt mit Sitemap");
    assert.ok(fs.existsSync(path.join(outDir, "sitemap.xml")), "live: sitemap.xml vorhanden");
    // QA K11: Die Sitemap listet alle öffentlichen Seiten (ohne 404, Editor, Druckseite).
    const karte = fs.readFileSync(path.join(outDir, "sitemap.xml"), "utf8");
    for (const p of ["/", "/leistungen/", "/leistungen/unfall-carrosserie/", "/leistungen/hagel-dellen/", "/leistungen/lack/", "/leistungen/felgen/", "/leistungen/folierung/", "/leistungen/scheiben/", "/tesla/", "/occasionen/", "/team/", "/kontakt/", "/schaden-melden/", "/impressum/", "/datenschutz/", "/bildnachweise/"])
      assert.ok(karte.includes(`<loc>https://www.autospeedy.ch${p}</loc>`), `live: Sitemap mit ${p}`);
    assert.doesNotMatch(karte, /404|\/admin\/|\/druck\/|\/bewerten\//, "live: keine 404, kein Editor, keine Druckseite, keine QR-Landeseite /bewerten/");
    assert.match(fs.readFileSync(path.join(outDir, "bewerten", "index.html"), "utf8"), /<meta name="robots" content="noindex">/, "live: /bewerten/ noindex");
    // Ohne echte Bewertungen (bewertungen.json «leer») bleibt aggregateRating auch live weg.
    const ld = JSON.parse(idx.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const shop = ld["@graph"].find((x) => /AutoBody|AutoRepair/.test(x["@type"]));
    assert.ok(!("aggregateRating" in shop), "live ohne Daten: kein aggregateRating");
    // Livegang: Auf keiner Seite bleibt ein Rest der Vorschau stehen (Lücken, Entwürfe, Platzhalter-Hinweise).
    const alle = [];
    (function sammle(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) sammle(p); else if (e.name.endsWith(".html")) alle.push(p); } })(outDir);
    assert.ok(alle.length >= 16, "live: Seiten gefunden");
    for (const p of alle) {
      if (/[\\/]admin[\\/]/.test(p)) continue;
      const s = fs.readFileSync(p, "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
      const wo = path.relative(outDir, p);
      assert.doesNotMatch(s, /data-luecke|data-vorschau|<!--luecke:/, `live ${wo}: keine Lücke, keine Marke, kein Vorschau-Balken`);
      assert.doesNotMatch(s, /Entwurf:|Nur in der Vorschau|wird durch ein eigenes Foto ersetzt|Name folgt|Lücke:|Hier erscheint/, `live ${wo}: kein Vorschau-Text`);
    }
  } finally {
    fs.rmSync(inhalt, { recursive: true, force: true });
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});

test("Livegang: alte Adressen der früheren Website leiten dauerhaft auf eine Seite, die es gibt", () => {
  const zeilen = lies(path.join(dist, "_redirects")).split("\n").filter((z) => z.trim() && !z.startsWith("#")).map((z) => z.trim().split(/\s+/));
  assert.ok(zeilen.length >= 15, "Liste vorhanden");
  for (const [von, nach, code] of zeilen) {
    assert.equal(code, "301", `${von}: dauerhaft`);
    assert.match(von, /^\/[a-z0-9\-/*]+$/, `${von}: Pfad`);
    assert.ok(fs.existsSync(path.join(dist, nach, "index.html")), `${von} führt auf ${nach}, die Seite gibt es`);
    assert.ok(!fs.existsSync(path.join(dist, von.replace(/\*$/, ""), "index.html")) || von.endsWith("*"), `${von} verdeckt keine neue Seite`);
  }
  // Jede Adresse der alten Sitemap hat ein Ziel (/, /team und /kontakt bleiben bestehen).
  const alt = ["/kopie-von-spritzwerk", "/bilder-spritzwerk", "/kopie-von-folierung", "/kopie-von-alufelgen-1", "/auto-sppey-ag", "/dienstleistungen", "/bilder-carrosserie", "/book-online", "/services-4"];
  for (const a of alt) assert.ok(zeilen.some(([von]) => von === a), `${a} hat eine Weiterleitung`);
  assert.ok(zeilen.some(([von]) => von === "/service-page/*"), "Muster-Seiten des Baukastens leiten weiter");
});

test("Team: die Zahl in den Überschriften zählt mit (Cockpit ändert das Team)", () => {
  const site = JSON.parse(lies(path.join(wurzel, "../astro/src/daten/site.json")));
  const gruppen = site.team.map((g) => g.leute.filter((p) => p.einverstaendnis).length).filter((n) => n > 0);
  const leute = gruppen.reduce((a, b) => a + b, 0);
  const wort = ["null", "eine", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];
  const gross = (s) => s[0].toUpperCase() + s.slice(1);
  assert.ok(leute >= 2 && leute <= 12 && gruppen.length >= 2, "Fixture: Team wie erwartet");
  assert.ok(lies(path.join(dist, "index.html")).includes(`${gross(wort[leute])} Leute, eine Werkstatt.`), "Startseite zählt richtig");
  assert.ok(lies(path.join(dist, "team", "index.html")).includes(`${gross(wort[leute])} Leute, ${wort[gruppen.length]} Bereiche.`), "Teamseite zählt richtig");
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
  for (const rel of ["schaden-melden", "kontakt", "occasionen"]) {
    const s = seite(rel);
    for (const f of s.match(/<form[\s\S]*?<\/form>/g)) assert.match(f, /href="\/datenschutz\/"/, `${rel}: Formular mit Link zur Datenschutzerklärung`);
  }
  const d = sichtbar(seite("datenschutz"));
  assert.match(d, /Cloudflare Pages \(Cloudflare, Inc\., USA\)/, "Hoster mit Land");
  assert.match(d, /Cloudflare Email \(Cloudflare, Inc\., USA\)/, "Formular-Mail an den Betrieb");
  // Prüfung 10.11.2026: Eine Bestätigungsmail gibt es nur mit Turnstile (Server-Prüfung). Ohne verspricht die Seite keine.
  assert.doesNotMatch(d, /schicken wir Ihnen eine Bestätigung/, "ohne Turnstile kein Versprechen einer Bestätigung");
  assert.match(d, /nutzen wir sie für Rückfragen zu Ihrer Meldung/, "ohne Turnstile: Mail-Adresse nur für Rückfragen und die Bewertungs-Bitte");
  assert.doesNotMatch(seite("schaden-melden"), /Für eine Bestätigung/, "Formular ohne Turnstile: kein Versprechen einer Bestätigung");
  assert.match(d, /höchstens 20 Minuten einen Prüfwert/, "Drossel: Prüfwert mit Frist genannt");
  const dt = sichtbar(mitNotizen("datenschutz/index.html"));
  assert.match(dt, /schicken wir Ihnen eine Bestätigung/, "mit Turnstile: Bestätigung zugesagt");
  assert.match(dt, /Brevo \(Sendinblue SAS, Frankreich\)/, "mit Turnstile: Maildienst an die Kundschaft genannt");
  assert.match(dt, /prüft Cloudflare Turnstile beim Senden/, "mit Turnstile: Prüfung erklärt");
  const ft = mitNotizen("schaden-melden/index.html");
  assert.match(ft, /Für eine Bestätigung und/, "Formular mit Turnstile: Bestätigung zugesagt");
  assert.match(ft, /class="cf-turnstile" data-sitekey="1x00000000000000000000AA"/, "Formular mit Turnstile: Widget im Formular");
  assert.doesNotMatch(d, /Datenbank in Zürich|Werkstatt-System/, "kein veralteter Weg über eine Datenbank");
  assert.match(mitNotizen("datenschutz/index.html"), /data-luecke>Vom Betrieb zu prüfen/, "Ergänzungen als vom Betrieb zu prüfen markiert (mit Notizen sichtbar, sperrt den Livegang)");
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
