// Messung der Achsen für das Abstandsregister (design-uni abstand.md, Teil 1 und 2). node werkzeuge/register-messen.cjs
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const srv = spawn("python3", ["-m", "http.server", "8093", "--directory", path.join(__dirname, "..", "site")], { stdio: "ignore" });
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
function oklab(hex) { const n = parseInt(hex.slice(1), 16); const r = lin(n >> 16 & 255), g = lin(n >> 8 & 255), b = lin(n & 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return { L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s }; }
const lch = (o) => ({ L: o.L, C: Math.hypot(o.a, o.b), h: (Math.atan2(o.b, o.a) * 180 / Math.PI + 360) % 360 });
const dE = (x, y) => Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b);
const rgb2hex = (s) => { const m = s.match(/\d+/g).map(Number); return "#" + m.slice(0, 3).map((v) => v.toString(16).padStart(2, "0")).join(""); };
(async () => {
  await new Promise((r) => setTimeout(r, 800));
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto("http://localhost:8093/index.html"); await p.waitForTimeout(300);
  const m = await p.evaluate(() => { const g = (sel, props) => { const e = document.querySelector(sel); const c = getComputedStyle(e); return Object.fromEntries(props.map((k) => [k, c[k]])); };
    return { h1: g("h1", ["fontFamily", "fontWeight", "fontStyle", "fontSize"]), h1kursiv: document.querySelectorAll("h1 em, h1 i, h1 [style*=italic]").length, body: g("body", ["backgroundColor", "fontFamily", "fontVariantNumeric"]), knopf: g(".hero .knopf", ["backgroundColor", "borderRadius", "color"]), knopfLeise: g(".hero .knopf-leise", ["backgroundColor", "borderRadius", "borderTopWidth"]), tabelle: g("table.zeiten td", ["fontFamily", "fontVariantNumeric"]), bild: g(".hero .bild img", ["aspectRatio", "objectFit"]), animation: g(".hero .kante-zug", ["animationName", "animationDuration"]) }; });
  await b.close(); srv.kill();
  const grund = "#EEF0F0", wand = "#FFFFFF", creme = "#F5EFE6", band = "#96C734";
  const out = { gemessen: m, grund: { hex: grund, oklch: lch(oklab(grund)) }, kabinenwand: lch(oklab(wand)), band: lch(oklab(band)), deltaE: { zuCreme: dE(oklab(grund), oklab(creme)), zuWeiss: dE(oklab(grund), oklab(wand)), wandZuCreme: dE(oklab(wand), oklab(creme)) }, cremeZone: lch(oklab(creme)) };
  console.log(JSON.stringify(out, null, 2));
})();
