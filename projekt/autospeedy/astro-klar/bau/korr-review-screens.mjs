// Screenshots + Messungen fuer die Korrektur Review-Final (nur Pruefung, kein Teil des Builds).
// Startet einen kleinen Server auf dist/ (mit CSP aus _headers) und fotografiert mit installiertem Chrome.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const dist = new URL("../dist/", import.meta.url).pathname;
const ausgabe = new URL("../vorschau/c/", import.meta.url).pathname;
const csp = fs.readFileSync(path.join(dist, "_headers"), "utf8").match(/^\s+Content-Security-Policy: (.*)$/m)[1];
const typen = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon" };

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

async function schuss(datei, { width, height, pfad = "/", voll = false, warte = 700 }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, isMobile: width < 760, hasTouch: width < 760 });
  const page = await ctx.newPage();
  await page.goto(basis + pfad, { waitUntil: "load" });
  await page.waitForTimeout(warte);
  await page.screenshot({ path: path.join(ausgabe, datei), fullPage: voll });
  await ctx.close();
}

// Pflicht-Screenshots
await schuss("korr-review-desktop.png", { width: 1440, height: 900 });
await schuss("korr-review-handy.png", { width: 390, height: 844 });
await schuss("korr-review-tesla-desktop.png", { width: 1440, height: 900, pfad: "/tesla/" });

// C15-Messung: sitzen die drei Kreise (01/02/03) im Tesla-Ablauf auf derselben Linie?
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(basis + "/", { waitUntil: "load" });
await page.locator(".tesla-teil .ablauf").scrollIntoViewIfNeeded();
await page.waitForTimeout(1400);
const punkte = await page.$$eval(".tesla-teil .ablauf li", (lis) => lis.map((li) => {
  const r = li.getBoundingClientRect();
  const vor = getComputedStyle(li, "::before");
  return { liTop: Math.round(r.top * 10) / 10, punktTop: vor.top, punktHoehe: vor.height, transform: vor.transform };
}));
console.log("C15 Tesla-Ablauf Punkte (liTop sollen gleich sein):", JSON.stringify(punkte, null, 0));
await ctx.close();

await browser.close();
server.close();
console.log("Screenshots in vorschau/c/ geschrieben.");
