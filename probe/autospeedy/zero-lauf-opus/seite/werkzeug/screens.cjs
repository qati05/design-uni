// Bildschirmfotos jeder Seite: <seite>-desktop.png (1440×900), <seite>-mobil.png (390×844), dazu -ganz Fassungen.
// Aufruf: NODE_PATH=$(npm root -g) node screens.cjs <dist> <ziel> [seiten,komma] [--nur-oben]
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const [dist, ziel, liste] = process.argv.slice(2);
const nurOben = process.argv.includes("--nur-oben");
const seiten = (liste && !liste.startsWith("--") ? liste.split(",") : ["index", "schaden", "tesla", "leistungen", "kontakt", "impressum", "datenschutz", "404"]);
const typen = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain" };
const srv = http.createServer((q, r) => { let f = path.join(dist, decodeURIComponent(q.url.split("?")[0])); if (f.endsWith("/")) f += "index.html"; if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { "content-type": typen[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(r); });
srv.listen(0, async () => {
  const base = `http://localhost:${srv.address().port}`;
  fs.mkdirSync(ziel, { recursive: true });
  const b = await chromium.launch();
  for (const [name, vp, mobil] of [["desktop", { width: 1440, height: 900 }, false], ["mobil", { width: 390, height: 844 }, true]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mobil, hasTouch: mobil });
    const p = await ctx.newPage();
    for (const s of seiten) {
      await p.goto(`${base}/${s}.html`, { waitUntil: "load" });
      await p.evaluate(async () => { await document.fonts.ready; for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((x) => setTimeout(x, 40)); } scrollTo(0, 0); });
      await p.waitForTimeout(1500);
      await p.screenshot({ path: path.join(ziel, `${s}-${name}.png`) });
      if (!nurOben) await p.screenshot({ path: path.join(ziel, `${s}-${name}-ganz.png`), fullPage: true });
    }
    await ctx.close();
  }
  await b.close(); srv.close(); console.log("fertig", seiten.length * 2, "Seiten");
});
