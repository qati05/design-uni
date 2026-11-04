// Browser-Test des Schadenformulars (BAUPLAN 3.13, Schritt 12): Schrittwechsel mit Fokus, Fehler pro Feld
// (aria-invalid + role=alert, ohne Schütteln), Ersatzwagen-Unterfrage, lange Eingaben laufen nicht aus dem Feld.
// Server auf dist/ mit der CSP aus _headers, damit Verstösse auffallen. Vorher: npm run build.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const dist = new URL("../dist/", import.meta.url).pathname;
const csp = fs.readFileSync(path.join(dist, "_headers"), "utf8").match(/^\s+Content-Security-Policy: (.*)$/m)[1];
const typen = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon" };
let server, basis, browser;

before(async () => {
  server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const datei = path.join(dist, p);
    if (!datei.startsWith(dist) || !fs.existsSync(datei)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": typen[path.extname(datei)] || "application/octet-stream", "Content-Security-Policy": csp });
    fs.createReadStream(datei).pipe(res);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  basis = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : { channel: "chrome" });
});
after(async () => { await browser?.close(); server?.close(); });

async function form(viewport) {
  const ctx = await browser.newContext({ viewport: viewport || { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const fehler = [];
  page.on("console", (m) => { if (m.type() === "error" && !/status of 404/.test(m.text())) fehler.push(m.text()); });
  page.on("pageerror", (e) => fehler.push(String(e)));
  await page.goto(basis + "/schaden-melden/");
  return { ctx, page, fehler };
}

test("Schrittwechsel: Art wählen führt weiter, Fokus auf die Schritt-Überschrift, Fortschrittstext", async () => {
  const { ctx, page, fehler } = await form();
  await page.locator('input[name="art"][data-art="hagel"]').check({ force: true });
  await page.waitForSelector('[data-schritt="2"]:not([hidden])');
  assert.match(await page.locator("[data-fortschritt-text]").textContent(), /Schritt 2 von 3/);
  const fokus = await page.evaluate(() => document.activeElement && document.activeElement.tagName.toLowerCase());
  assert.equal(fokus, "legend", "Fokus auf der Schritt-Überschrift");
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Fehler pro Feld: aria-invalid, Text, Sammelhinweis als role=alert, kein Schütteln (keine @keyframes)", async () => {
  const { ctx, page } = await form();
  await page.goto(basis + "/schaden-melden/?art=hagel");
  await page.locator("[data-fotoweiter]").click();
  await page.locator('[data-senden="website"]').click();
  await page.waitForSelector('#f-name[aria-invalid="true"]');
  assert.equal(await page.locator("#f-tel").getAttribute("aria-invalid"), "true");
  assert.ok(await page.locator("#f-name").getAttribute("aria-describedby"));
  assert.ok(await page.locator(".feld-fehler").first().isVisible(), "Fehlertext sichtbar");
  assert.equal(await page.locator("[data-rueckmeldung]").getAttribute("role"), "alert");
  // kein Schütteln: die Rückmeldung nutzt keine Animation
  const anim = await page.locator("[data-rueckmeldung]").evaluate((e) => getComputedStyle(e).animationName);
  assert.equal(anim, "none");
  await ctx.close();
});

test("Ersatzwagen: Tesla-Unterfrage erscheint nur bei Haken; ?tesla=1 belegt sie vor", async () => {
  const { ctx, page } = await form();
  await page.goto(basis + "/schaden-melden/?art=hagel");
  await page.locator("[data-fotoweiter]").click();
  await page.waitForSelector('[data-schritt="3"]:not([hidden])'); // Schritt gleitet herein (BEWEGUNG.md 5)
  assert.ok(await page.locator("[data-ersatzwagen-tesla-feld]").isHidden(), "zuerst verborgen");
  await page.locator("[data-ersatzwagen]").check({ force: true });
  await page.waitForSelector("[data-ersatzwagen-tesla-feld]:not([hidden])");
  await ctx.close();

  const { ctx: c2, page: p2 } = await form();
  await p2.goto(basis + "/schaden-melden/?tesla=1&art=hagel");
  await p2.locator("[data-fotoweiter]").click();
  await p2.waitForSelector('[data-schritt="3"]:not([hidden])');
  await p2.locator("[data-ersatzwagen]").check({ force: true });
  await p2.waitForSelector("[data-ersatzwagen-tesla-feld]:not([hidden])");
  assert.equal(await p2.locator("[data-ersatzwagen-tesla]").isChecked(), true, "Tesla-Wunsch vorbelegt");
  await c2.close();
});

test("lange Eingaben laufen nicht aus dem Feld oder aus der Erfolgsmeldung", async () => {
  const { ctx, page } = await form();
  const langerName = "Maximiliane Alexandra von Hohenberg-Schwarzenbach-Wüthrich";
  await page.goto(basis + "/schaden-melden/?art=hagel");
  await page.locator("[data-fotoweiter]").click();
  await page.fill("#f-name", langerName);
  await page.fill("#f-mail", "maximiliane.alexandra.von.hohenberg@sehr-lange-mailadresse-beispiel.example");
  assert.ok(await page.locator("#f-name").evaluate((e) => e.getBoundingClientRect().right <= window.innerWidth + 1), "Feld nicht breiter als der Bildschirm");
  // Erfolgsmeldung füllen (ohne echten Versand, über die interne Funktion)
  await page.fill("#f-tel", "071 755 88 61");
  await page.evaluate(() => document.getElementById("schaden-form").dataset.endpunkt = "");
  await page.locator('[data-senden="website"]').click();
  await page.waitForSelector("[data-rapport]:not([hidden])");
  const kontaktBreit = await page.locator("[data-r-kontakt]").evaluate((e) => e.getBoundingClientRect().right <= window.innerWidth + 1);
  assert.ok(kontaktBreit, "Kontakt in der Erfolgsmeldung läuft nicht aus dem Bildschirm");
  await ctx.close();
});
