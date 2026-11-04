// Aufnahmen für Schritt 13 (Bericht): /admin/ und / mit den Hinweis-Vorlagen. Baut dafür Fixture-site.json-Stände
// (nur hier, nie im echten Bau) und schiesst Bilder. Aufruf: node bau/fotos-hinweis.mjs
import { createRequire } from "node:module";
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";

const require = createRequire(new URL("../package.json", import.meta.url));
const { chromium } = require("playwright-core");
const hier = path.dirname(new URL(import.meta.url).pathname);
const wurzel = path.join(hier, "..");
const ausgabe = path.join(wurzel, "vorschau", "c");
fs.mkdirSync(ausgabe, { recursive: true });
const sitePfad = path.join(wurzel, "..", "astro", "src", "daten", "site.json");
const typen = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon" };

function baue(hinweise) {
  const site = JSON.parse(fs.readFileSync(sitePfad, "utf8"));
  site.hinweise = hinweise;
  const fixture = path.join(os.tmpdir(), `site-foto13-${process.pid}-${Math.round(performance.now())}.json`);
  const out = path.join(os.tmpdir(), `dist-foto13-${process.pid}-${Math.round(performance.now())}`);
  fs.writeFileSync(fixture, JSON.stringify(site));
  execSync(`npx astro build --outDir ${out}`, { cwd: wurzel, env: { ...process.env, DATEN: "../astro/src/content", SITE_JSON: fixture }, stdio: "pipe" });
  fs.rmSync(fixture, { force: true });
  return out;
}
function server(dir) {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const datei = path.join(dir, p);
    if (!datei.startsWith(dir) || !fs.existsSync(datei)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": typen[path.extname(datei)] || "application/octet-stream" });
    fs.createReadStream(datei).pipe(res);
  });
  return s;
}
const H = (art, extra = {}) => ({ art, form: "banner", titel: art[0].toUpperCase() + art.slice(1), text: "Beispieltext für die Vorschau.", link: "", von: "2000-01-01", bis: "2999-12-31", ...extra });

const banner = baue([H("hagel"), H("geschlossen"), H("info")]);
const popup = baue([H("ferien"), { art: "aktion", form: "popup", titel: "Aktion", text: "Reifenwechsel-Wochen (Beispiel).", link: "/kontakt/", von: "2000-01-01", bis: "2999-12-31" }]);

async function schuss(browser, dir, url, datei, opt = {}) {
  const ctx = await browser.newContext({ viewport: opt.viewport, deviceScaleFactor: opt.dsf || 1, isMobile: !!opt.mobil, hasTouch: !!opt.mobil, reducedMotion: "reduce" });
  const srv = server(dir); await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const basis = `http://127.0.0.1:${srv.address().port}`;
  const page = await ctx.newPage();
  await page.goto(basis + url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  if (opt.popup) await page.waitForFunction(() => { const d = document.querySelector("[data-hinweis-popup]"); return d && d.open; }, null, { timeout: 4000 }).catch(() => {});
  await page.screenshot({ path: datei, fullPage: !!opt.ganz });
  await page.close(); await ctx.close(); srv.close();
}

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const D = { viewport: { width: 1440, height: 900 } };
const M = { viewport: { width: 390, height: 844 }, dsf: 2, mobil: true };
await schuss(browser, banner, "/", path.join(ausgabe, "13-hinweis-banner-desktop.png"), D);
await schuss(browser, banner, "/", path.join(ausgabe, "13-hinweis-banner-handy.png"), M);
await schuss(browser, popup, "/", path.join(ausgabe, "13-hinweis-popup-desktop.png"), { ...D, popup: true });
await schuss(browser, popup, "/", path.join(ausgabe, "13-hinweis-popup-handy.png"), { ...M, popup: true });
await schuss(browser, banner, "/admin/", path.join(ausgabe, "13-admin-desktop.png"), { ...D, ganz: true });
await schuss(browser, banner, "/admin/", path.join(ausgabe, "13-admin-handy.png"), { ...M, ganz: true });

// Editor-Reiter «Hinweise» mit einem Eintrag und der Vorschau im C-Stil
async function schussHinweise(datei, viewport) {
  const ctx = await browser.newContext({ viewport, reducedMotion: "reduce" });
  const srv = server(banner); await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${srv.address().port}/admin/`, { waitUntil: "networkidle" });
  await page.click('[data-reiter="hinweise"]');
  await page.click('[data-panel="hinweise"] .admin-knopf--neu');
  await page.fill('[data-panel="hinweise"] input[maxlength="50"]', "Hagelsaison");
  await page.fill('[data-panel="hinweise"] textarea', "Wir nehmen Hagelschäden an. Melden Sie den Schaden mit Fotos.");
  await page.selectOption('[data-panel="hinweise"] select', "hagel").catch(() => {});
  await page.waitForTimeout(150);
  await page.screenshot({ path: datei, fullPage: true });
  await page.close(); await ctx.close(); srv.close();
}
await schussHinweise(path.join(ausgabe, "13-admin-hinweise-desktop.png"), { width: 1440, height: 900 });
await browser.close();
fs.rmSync(banner, { recursive: true, force: true });
fs.rmSync(popup, { recursive: true, force: true });
console.log("Schritt 13: 6 Aufnahmen in vorschau/c/ (13-hinweis-banner/-popup, 13-admin)");
