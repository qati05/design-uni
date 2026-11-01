// Screenshots der Vorschau: node werkzeuge/screens.cjs <ausgabeordner> [seiten...]
const { chromium } = require("playwright");
const out = process.argv[2];
const seiten = process.argv.slice(3);
const alle = seiten.length ? seiten : ["index", "carrosserie", "lackiererei", "felgen-folierung", "occasionen", "betrieb", "kontakt", "tesla", "schaden-melden", "impressum", "datenschutz", "404"];
(async () => {
  const b = await chromium.launch();
  for (const [name, vp, mobil] of [["desktop", { width: 1440, height: 900 }, false], ["handy", { width: 390, height: 844 }, true]]) {
    const ctx = await b.newContext({ viewport: vp, isMobile: mobil, hasTouch: mobil, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    for (const s of alle) {
      await p.goto(`http://localhost:8077/${s}.html`, { waitUntil: "load" });
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await p.waitForTimeout(250);
      await p.screenshot({ path: `${out}/${s}-${name}.png`, fullPage: true });
    }
    await ctx.close();
  }
  await b.close();
})();
