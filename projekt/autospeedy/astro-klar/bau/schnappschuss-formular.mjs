// Schnappschuesse der Formular-Zustaende (Handy 390) nach vorschau/c/12-formular-<zustand>.png (NACHTRAG Schritt 12, Punkt 5).
// Vorher: npm run build. Start: node bau/schnappschuss-formular.mjs  (CHROME=/pfad oder Kanal «chrome»).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const dist = new URL("../dist/", import.meta.url).pathname;
const aus = new URL("../vorschau/c/", import.meta.url).pathname;
const csp = fs.readFileSync(path.join(dist, "_headers"), "utf8").match(/^\s+Content-Security-Policy: (.*)$/m)[1];
const typen = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon" };

const LANG_NAME = "Maximiliane Alexandra von Hohenberg-Schwarzenbach-Wüthrich";
const LANG_MAIL = "maximiliane.alexandra.von.hohenberg@sehr-lange-mailadresse-beispiel.example";

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const datei = path.join(dist, p);
  if (!datei.startsWith(dist) || !fs.existsSync(datei)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": typen[path.extname(datei)] || "application/octet-stream", "Content-Security-Policy": csp });
  fs.createReadStream(datei).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const basis = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : { channel: "chrome" });

async function neu(antwort = null, verzoegern = 0) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  // Endpunkt und Zeitfalle-Token abfangen (ohne echtes Netz)
  await page.route("**/api/schaden*", async (route) => {
    const u = route.request().url();
    if (u.includes("t=1")) return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ t: "" }) });
    if (verzoegern) await new Promise((r) => setTimeout(r, verzoegern));
    if (antwort === 502) return route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ ok: false, fehler: ["senden"], telefon: "071 755 88 61" }) });
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.goto(basis + "/schaden-melden/");
  return { ctx, page };
}
const schuss = (page, name) => page.screenshot({ path: path.join(aus, name), fullPage: true });
async function zuSchritt3(page, lang) {
  await page.locator('input[name="art"][data-art="hagel"]').check();
  await page.locator('[data-fotoweiter]').click();
  if (lang) { await page.fill("#f-name", LANG_NAME); await page.fill("#f-tel", "071 755 88 61"); await page.fill("#f-mail", LANG_MAIL); }
}
async function endpunktSetzen(page) { await page.evaluate(() => document.getElementById("schaden-form").dataset.endpunkt = "/api/schaden"); }

// 1. Ruhe (Schritt 1)
let { ctx, page } = await neu();
await schuss(page, "12-formular-ruhe.png");
await ctx.close();

// 2. Fehler pro Feld (leeres Pflichtfeld, aria-invalid + Text)
({ ctx, page } = await neu());
await zuSchritt3(page, false);
await page.locator('[data-senden="website"]').click();
await page.waitForSelector('[aria-invalid="true"]');
await schuss(page, "12-formular-fehler.png");
await ctx.close();

// 3. Senden/laedt (Knopf disabled, aria-busy, Balken) — langer Name/Mail
({ ctx, page } = await neu(200, 1500));
await endpunktSetzen(page);
await zuSchritt3(page, true);
await page.locator('[data-senden="website"]').click();
await page.waitForSelector('[data-senden="website"][aria-busy="true"]');
await schuss(page, "12-formular-laedt.png");
await ctx.close();

// 4. Serverfehler (Meldung mit Telefonnummer, «Nochmals senden»)
({ ctx, page } = await neu(502));
await endpunktSetzen(page);
await zuSchritt3(page, true);
await page.locator('[data-senden="website"]').click();
await page.waitForSelector(".rueckmeldung--fehler");
await schuss(page, "12-formular-serverfehler.png");
await ctx.close();

// 5. Erfolg (Bestaetigung, Fokus auf die Meldung) — langer Name/Mail
({ ctx, page } = await neu(200));
await endpunktSetzen(page);
await zuSchritt3(page, true);
await page.locator('[data-senden="website"]').click();
await page.waitForSelector("[data-rapport]:not([hidden])");
await schuss(page, "12-formular-erfolg.png");
await ctx.close();

// 6. Ersatzwagen angehakt (Tesla-Unterfrage sichtbar)
({ ctx, page } = await neu());
await zuSchritt3(page, false);
await page.locator("[data-ersatzwagen]").check({ force: true });
await page.waitForSelector("[data-ersatzwagen-tesla-feld]:not([hidden])");
await schuss(page, "12-formular-ersatzwagen.png");
await ctx.close();

await browser.close();
server.close();
console.log("Schnappschuesse geschrieben nach", aus);
