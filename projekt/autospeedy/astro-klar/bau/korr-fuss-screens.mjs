// Einmaliges Hilfsskript (nicht Teil des Baus): Screenshots des neuen Fuss fuer vorschau/c/korr-fuss-*.png.
// Startet denselben kleinen dist-Server mit CSP wie der Browser-Test. Aufruf: node bau/korr-fuss-screens.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const dist = new URL("../dist/", import.meta.url).pathname;
const ziel = new URL("../vorschau/c/", import.meta.url).pathname;
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

for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["handy", { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, isMobile: name === "handy", hasTouch: name === "handy" });
  const page = await ctx.newPage();
  await page.goto(basis + "/", { waitUntil: "load" });
  await page.waitForFunction(() => { const p = document.querySelector(".fuss-status"); return p && p.hasAttribute("data-zustand"); });
  // Fuer eine saubere Aufnahme: den klebrigen Kopf und das Vorschau-Band nur im Bild ruhig stellen (nicht im Bau).
  await page.addStyleTag({ content: "[data-kopf]{position:static!important} [data-vorschau],.handyleiste{display:none!important}" });
  await page.locator(".fuss").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700); // einmaliges Einblenden des Slogans abwarten
  await page.locator(".fuss").screenshot({ path: path.join(ziel, `korr-fuss-${name}.png`) });
  await ctx.close();
  console.log("geschrieben:", `korr-fuss-${name}.png`);
}
await browser.close();
server.close();
