// Aufnahmen von dist/ fuer die Schrittberichte (Entwurf C).
// Aufruf: node bau/fotos-c.mjs <praefix> [pfade...]   (Standard-Pfad: /)
// Je Seite vier Bilder: desktop 1440x900, desktop-ganz (fullPage),
// handy 390x844 (deviceScaleFactor 2, isMobile), handy-ganz (Handyleiste vorher auf static gesetzt).
// Ausgabe: vorschau/c/<praefix>-<seite>-<art>.png
// Playwright ueber createRequire(package.json), installiertes Google Chrome, --no-sandbox.
import { createRequire } from "node:module";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(new URL("../package.json", import.meta.url));
const { chromium } = require("playwright-core");

const hier = path.dirname(new URL(import.meta.url).pathname);
const dist = path.join(hier, "..", "dist");
const ausgabe = path.join(hier, "..", "vorschau", "c");
fs.mkdirSync(ausgabe, { recursive: true });

const [, , praefix, ...pfadeArg] = process.argv;
if (!praefix) { console.error("Aufruf: node bau/fotos-c.mjs <praefix> [pfade...]"); process.exit(1); }
const pfade = pfadeArg.length ? pfadeArg : ["/"];

const typen = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon" };

const slug = (p) => { const s = p.replace(/^\/+|\/+$/g, "").replace(/\//g, "-"); return s || "start"; };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const datei = path.join(dist, p);
  if (!datei.startsWith(dist) || !fs.existsSync(datei)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": typen[path.extname(datei)] || "application/octet-stream" });
  fs.createReadStream(datei).pipe(res);
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const basis = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });

async function schuss(ctx, url, datei, opt = {}) {
  const page = await ctx.newPage();
  await page.goto(basis + url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  if (opt.vorher) await page.addStyleTag({ content: opt.vorher });
  await page.screenshot({ path: datei, fullPage: !!opt.ganz });
  await page.close();
}

for (const pfad of pfade) {
  const s = slug(pfad);
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await schuss(desktop, pfad, path.join(ausgabe, `${praefix}-${s}-desktop.png`));
  await schuss(desktop, pfad, path.join(ausgabe, `${praefix}-${s}-desktop-ganz.png`), { ganz: true });
  await desktop.close();

  const handy = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  await schuss(handy, pfad, path.join(ausgabe, `${praefix}-${s}-handy.png`));
  await schuss(handy, pfad, path.join(ausgabe, `${praefix}-${s}-handy-ganz.png`), { ganz: true, vorher: ".handyleiste{position:static!important}" });
  await handy.close();

  console.log(`${s}: 4 Aufnahmen`);
}

await browser.close();
server.close();
