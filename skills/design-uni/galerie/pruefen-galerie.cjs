// Prüft die Galerie der Bausteine: ohne JavaScript lesbar, still unter «Bewegung reduzieren»,
// nach 3 s keine endliche Animation mehr, endlose nur mit Pause-Knopf, Kontrast aus der Kaskade, kein fremder Host.
// Aufruf: node pruefen-galerie.cjs [--bilder ordner]
"use strict";
const { chromium } = require("playwright");
const path = require("path");
const url = "file://" + path.join(__dirname, "index.html");
const bilder = process.argv.includes("--bilder") ? process.argv[process.argv.indexOf("--bilder") + 1] : null;
const erg = []; const r = (id, ok, d) => erg.push({ id, ok: !!ok, d });

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  // 1 ohne JavaScript
  { const c = await b.newContext({ javaScriptEnabled: false }); const p = await c.newPage(); await p.goto(url);
    const n = await p.$$eval("[data-baustein]", (s) => s.filter((x) => x.innerText.trim().length > 80).length);
    const alle = await p.$$eval("[data-baustein]", (s) => s.length);
    r("ohne JavaScript: jeder Baustein hat Inhalt", n === alle && alle >= 10, `${n} von ${alle}`); await c.close(); }
  // 2 Bewegung reduzieren
  { const c = await b.newContext({ reducedMotion: "reduce" }); const p = await c.newPage(); await p.goto(url);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((x) => setTimeout(x, 60)); } });
    const n = await p.evaluate(() => document.getAnimations().length);
    r("Bewegung reduzieren: 0 Animationen nach dem Durchscrollen", n === 0, `${n}`); await c.close(); }
  // 3 normale Bewegung, nach 3 s
  { const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c.newPage(); const fremd = new Set();
    p.on("request", (q) => { if (!q.url().startsWith("file:")) fremd.add(q.url()); });
    await p.goto(url);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((x) => setTimeout(x, 60)); } });
    await p.waitForTimeout(3200);
    const a = await p.evaluate(() => { const l = document.getAnimations().filter((x) => x.playState === "running"); return { endlich: l.filter((x) => x.effect.getTiming().iterations !== Infinity).length, endlos: l.filter((x) => x.effect.getTiming().iterations === Infinity).map((x) => x.effect.target.closest("[data-baustein]").dataset.baustein) }; });
    const pausen = await p.$$eval("[data-pause]", (k) => k.map((x) => x.closest("[data-baustein]").dataset.baustein));
    r("nach 3 s laufen 0 endliche Animationen", a.endlich === 0, `${a.endlich}`);
    r("endlose Animationen nur mit Pause-Knopf", a.endlos.every((x) => pausen.includes(x)), `endlos in ${a.endlos.join(",") || "keinem"}, Pause in ${pausen.join(",")}`);
    await p.click("[data-pause]"); const ps = await p.evaluate(() => document.getAnimations().filter((x) => x.playState === "running").length);
    r("Pause hält das Laufband an", ps === 0, `${ps} laufend nach Pause`);
    r("nichts von fremden Hosts", fremd.size === 0, [...fremd].join(" ") || "0");
    // Kontrast aus der Kaskade (vereinfacht: Text gegen ersten deckenden Grund)
    const k = await p.evaluate(() => { const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number); const L = ([R, G, B]) => [R, G, B].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
      const bad = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const e = w.currentNode.parentElement; if (!w.currentNode.textContent.trim() || !e.offsetWidth || e.closest("svg,dialog")) continue; let g = null; for (let x = e; x; x = x.parentElement) { const c = rgb(getComputedStyle(x).backgroundColor); if (c.length === 3 || (c.length === 4 && c[3] === 1)) { g = c; break; } } g = g || [255, 255, 255]; const f = rgb(getComputedStyle(e).color); const q = (Math.max(L(f), L(g)) + 0.05) / (Math.min(L(f), L(g)) + 0.05); const px = parseFloat(getComputedStyle(e).fontSize); if (q < (px >= 24 ? 3 : 4.5)) bad.push(`${q.toFixed(2)} «${w.currentNode.textContent.trim().slice(0, 25)}»`); } return bad; });
    r("Kontrast: alle Texte ≥ 4,5:1 (gross 3:1)", k.length === 0, k.slice(0, 5).join(" | ") || "0 unter Soll");
    if (bilder) await p.screenshot({ path: path.join(bilder, "galerie-desktop.jpg"), fullPage: true, type: "jpeg", quality: 60 });
    await c.close(); }
  // 4 Handy: kein Überlauf, Ziele ≥ 44 px
  { const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const p = await c.newPage(); await p.goto(url);
    const ue = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const klein = await p.$$eval("button, summary, input[type=range]", (k) => k.filter((x) => x.offsetWidth && x.getBoundingClientRect().height < 44).map((x) => x.textContent.trim() || x.tagName));
    r("Handy: kein Überlauf bei 390 px", ue <= 0, `${ue} px`);
    r("Handy: Knöpfe und Regler ≥ 44 px hoch", klein.length === 0, klein.join(", ") || "alle");
    if (bilder) await p.screenshot({ path: path.join(bilder, "galerie-handy.jpg"), fullPage: true, type: "jpeg", quality: 60 });
    await c.close(); }
  await b.close();
  for (const x of erg) console.log(`${x.ok ? "OK    " : "FEHLER"} ${x.id}\n         ${x.d}`);
  const f = erg.filter((x) => !x.ok).length; console.log(`\n${erg.length} Prüfungen, ${f} Fehler`); process.exit(f ? 1 : 0);
})();
