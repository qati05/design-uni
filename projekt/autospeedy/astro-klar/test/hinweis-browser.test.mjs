// Hinweis-Vorlagen und Editor im Browser (BAUPLAN 4.1/4.2, Schritt 13). Baut einmal eine Fixture-site.json mit Hinweisen
// (nur im Test) und prüft: jede Art hat ihr festes Design, abgelaufene Hinweise erscheinen nicht, Pop-up einmal pro Sitzung,
// Esc schliesst, nie auf /schaden-melden/. Dazu: Admin-Seite ohne Inline-Skripte und ohne CSP-Fehler; dist ohne Geheim-Werte.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { chromium } from "playwright-core";

const wurzel = fileURLToPath(new URL("../", import.meta.url));
const sitePfad = path.join(wurzel, "../astro/src/daten/site.json");
const typen = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon" };

const gestern = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; })();

let server, basis, browser, outDir, csp;

before(() => {
  const site = JSON.parse(fs.readFileSync(sitePfad, "utf8"));
  site.hinweise = [
    { art: "info", form: "banner", titel: "Info", text: "Allgemeine Information.", link: "", von: "2000-01-01", bis: "2999-12-31" },
    { art: "aktion", form: "popup", titel: "Aktion", text: "Reifenwechsel-Wochen.", link: "/kontakt/", von: "2000-01-01", bis: "2999-12-31" },
    { art: "ferien", form: "banner", titel: "Ferien", text: "Betriebsferien (abgelaufen).", von: "2000-01-01", bis: gestern },
  ];
  const fixture = path.join(os.tmpdir(), `site-hinweise-${process.pid}.json`);
  outDir = path.join(os.tmpdir(), `dist-hinweise-${process.pid}`);
  fs.writeFileSync(fixture, JSON.stringify(site));
  try {
    execSync(`npx astro build --outDir ${outDir}`, { cwd: wurzel, // EDITOR_AKTIV=true: Die Seite /admin/ gehört seit dem 10.11.2026 nicht mehr zum normalen Bau (Pflege im Cockpit);
      // hier wird der eigene Editor ausdrücklich mitgebaut. EDITOR_REPO leer: nicht der Sveltia-Notweg.
      env: { ...process.env, DATEN: "../astro/src/content", SITE_JSON: fixture, EDITOR_AKTIV: "true", EDITOR_REPO: "" }, stdio: "pipe" });
  } finally { fs.rmSync(fixture, { force: true }); }
  csp = fs.readFileSync(path.join(outDir, "_headers"), "utf8").match(/^\s+Content-Security-Policy: (.*)$/m)[1];
});

before(async () => {
  server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const datei = path.join(outDir, p);
    if (!datei.startsWith(outDir) || !fs.existsSync(datei)) { res.writeHead(404); return res.end(); }
    // Admin-Seite bekommt ihre eigene, enge CSP (wie in _headers für /admin/*)
    const istAdmin = p.startsWith("/admin/");
    const kopf = istAdmin ? "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'" : csp;
    res.writeHead(200, { "Content-Type": typen[path.extname(datei)] || "application/octet-stream", "Content-Security-Policy": kopf });
    fs.createReadStream(datei).pipe(res);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  basis = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : { channel: "chrome" });
});
after(async () => { await browser?.close(); server?.close(); fs.rmSync(outDir, { recursive: true, force: true }); });

async function seite(opt = {}) {
  const ctx = await browser.newContext(opt);
  const page = await ctx.newPage();
  const fehler = [];
  page.on("console", (m) => { if (m.type() === "error" && !/status of 404|Failed to load resource/.test(m.text())) fehler.push(m.text()); });
  page.on("pageerror", (e) => fehler.push(String(e)));
  return { ctx, page, fehler };
}

test("Banner: info erscheint mit festem Design (Klasse, Symbol, Text)", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/", { waitUntil: "load" });
  const banner = page.locator(".hinweis--info");
  assert.ok(await banner.count() >= 1, "info-Banner vorhanden");
  assert.ok(await banner.first().locator("svg.hinweis__symbol").count() >= 1, "Symbol");
  assert.match(await banner.first().textContent(), /Allgemeine Information/);
  assert.deepEqual(fehler.filter((f) => /Content Security Policy/i.test(f)), [], "keine CSP-Fehler");
  await ctx.close();
});

test("abgelaufener Hinweis (ferien) erscheint nicht (Build filtert nach heute)", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/", { waitUntil: "load" });
  assert.equal(await page.locator(".hinweis--ferien").count(), 0, "kein abgelaufener Banner");
  await ctx.close();
});

test("Banner schliessbar: Klick entfernt ihn und merkt es in der Sitzung", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/", { waitUntil: "load" });
  await page.locator(".hinweis--info [data-hinweis-zu]").click();
  await page.waitForFunction(() => !document.querySelector(".hinweis--info"));
  const zu = await page.evaluate(() => sessionStorage.getItem("hinweis-zu"));
  assert.match(zu || "", /info/);
  await ctx.close();
});

test("Pop-up: erscheint nach 2 s, nur einmal pro Sitzung, Esc schliesst", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/", { waitUntil: "load" });
  const dialog = page.locator("[data-hinweis-popup]");
  assert.ok(await dialog.count() >= 1, "Pop-up im HTML");
  assert.ok(await page.evaluate(() => !document.querySelector("[data-hinweis-popup]").open), "zuerst zu");
  await page.waitForFunction(() => document.querySelector("[data-hinweis-popup]").open, null, { timeout: 4000 });
  assert.ok(await page.evaluate(() => document.querySelector("[data-hinweis-popup]").classList.contains("hinweis--aktion")), "festes Design (aktion)");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("[data-hinweis-popup]").open);
  // zweiter Aufruf in derselben Sitzung: kein erneutes Öffnen
  await page.goto(basis + "/", { waitUntil: "load" });
  await page.waitForTimeout(2500);
  assert.ok(await page.evaluate(() => !document.querySelector("[data-hinweis-popup]").open), "einmal pro Sitzung");
  await ctx.close();
});

test("Pop-up nie auf /schaden-melden/", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/schaden-melden/", { waitUntil: "load" });
  await page.waitForTimeout(2500);
  assert.equal(await page.locator("[data-hinweis-popup]").count(), 0, "kein Pop-up auf der Schaden-Seite");
  await ctx.close();
});

test("Admin-Seite: lädt ohne Inline-Skript und ohne CSP-Fehler, Reiter sind da", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/admin/", { waitUntil: "networkidle" });
  assert.ok(await page.locator('[data-reiter="hinweise"]').count() === 1, "Reiter Hinweise");
  assert.ok(await page.locator('[data-reiter="bewerten"]').count() === 1, "Reiter Bewertung anfragen");
  assert.deepEqual(fehler.filter((f) => /Content Security Policy/i.test(f)), [], "keine CSP-Fehler auf /admin/");
  await ctx.close();
});

test("Admin-Reiter Hinweise: Vorschau nutzt dieselbe Hinweis-Gestaltung", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/admin/", { waitUntil: "networkidle" });
  await page.locator('[data-reiter="hinweise"]').click();
  await page.locator('[data-panel="hinweise"] .admin-knopf--neu').click();
  assert.ok(await page.locator('[data-panel="hinweise"] .admin-vorschau .hinweis').count() >= 1, "Vorschau-Banner mit .hinweis");
  await ctx.close();
});

// Statische Prüfungen am Fixture-Bau (kein Browser nötig)
test("dist enthält keine Geheim-Werte (GITHUB_TOKEN, ACCESS_AUD)", () => {
  const dateien = [];
  (function lauf(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) lauf(p); else if (/\.(html|js|css|json|txt|xml)$/.test(e.name)) dateien.push(p); } })(outDir);
  for (const p of dateien) {
    const s = fs.readFileSync(p, "utf8");
    assert.ok(!s.includes("GITHUB_TOKEN"), `${p}: GITHUB_TOKEN`);
    assert.ok(!s.includes("ACCESS_AUD"), `${p}: ACCESS_AUD`);
  }
});

test("klar.css definiert für jede Hinweis-Art ein Design", () => {
  const css = fs.readFileSync(path.join(outDir, "css/klar.css"), "utf8");
  for (const art of ["hagel", "ferien", "geschlossen", "aktion", "info"]) assert.match(css, new RegExp(`\\.hinweis--${art}`), art);
});

test("Admin-HTML: Skript nur mit src, keine on…-Attribute", () => {
  const html = fs.readFileSync(path.join(outDir, "admin/index.html"), "utf8");
  for (const m of html.matchAll(/<script(\s[^>]*)?>/g)) assert.ok(/\ssrc=/.test(m[1] || ""), `Inline-Skript: ${m[0]}`);
  assert.doesNotMatch(html, /\son[a-z]+="/, "on…-Attribut");
  assert.match(html, /<meta name="robots" content="noindex">/, "noindex");
});
