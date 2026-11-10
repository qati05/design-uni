// Browser-Test mit playwright-core und installiertem Chrome (CHROME=/pfad, sonst Kanal «chrome»).
// Startet einen kleinen Server auf dist/ und setzt die CSP aus _headers, damit Verstösse auffallen.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
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

async function seite(opt = {}) {
  const ctx = await browser.newContext(opt);
  const page = await ctx.newPage();
  const fehler = [];
  page.on("console", (m) => { if (m.type() === "error" && !/status of 404/.test(m.text())) fehler.push(m.text()); });
  page.on("response", (r) => { if (r.status() >= 400) fehler.push(`${r.status()} ${new URL(r.url()).pathname}`); });
  page.on("pageerror", (e) => fehler.push(String(e)));
  return { ctx, page, fehler };
}
const window_hoehe = (page) => page.viewportSize().height;
const pos = (page) => page.$eval("[data-vergleich] input", (i) => Number(i.value));

test("Slider folgt der Maus ohne Klick, Pfeiltasten, aria-valuetext", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await page.goto(basis + "/leistungen/felgen/");
  await page.locator("[data-vergleich] .vergleich__buehne").scrollIntoViewIfNeeded();
  const b = await page.locator("[data-vergleich] .vergleich__buehne").boundingBox();
  await page.mouse.move(b.x + b.width * 0.2, b.y + b.height / 2);
  assert.ok(Math.abs((await pos(page)) - 20) <= 2, "Maus bei 20 %");
  await page.mouse.move(b.x + b.width * 0.8, b.y + b.height / 2);
  assert.ok(Math.abs((await pos(page)) - 80) <= 2, "Maus bei 80 %");
  const regler = page.locator("[data-vergleich] input");
  await regler.focus();
  const vor = await pos(page);
  await page.keyboard.press("ArrowLeft");
  assert.ok((await pos(page)) < vor, "Pfeil links");
  assert.match(await regler.getAttribute("aria-valuetext"), /vorher/i);
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Slider: Wischen auf dem Handy", async () => {
  const { ctx, page } = await seite({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  await page.goto(basis + "/leistungen/felgen/");
  const buehne = page.locator("[data-vergleich] .vergleich__buehne");
  await buehne.scrollIntoViewIfNeeded();
  const b = await buehne.boundingBox();
  const y = b.y + b.height / 2;
  const cdp = await ctx.newCDPSession(page); // echte Touch-Ereignisse, wie ein Finger
  const x1 = b.x + b.width * 0.5, x2 = b.x + b.width * 0.15;
  const punkt = (x) => [{ x, y, id: 1 }];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: punkt(x1) });
  for (let i = 1; i <= 8; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: punkt(x1 + (x2 - x1) * i / 8) });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  assert.ok(Math.abs((await pos(page)) - 15) <= 3, `Wischen nach links: ${await pos(page)}`);
  await ctx.close();
});

test("Slider: Touch folgt 1:1 ohne Transition, data-quelle touch (BAUPLAN 3.8)", async () => {
  const { ctx, page } = await seite({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); // ohne Reduced Motion
  await page.goto(basis + "/leistungen/felgen/");
  const buehne = page.locator("[data-vergleich] .vergleich__buehne");
  await buehne.scrollIntoViewIfNeeded();
  const b = await buehne.boundingBox();
  const y = b.y + b.height / 2;
  const cdp = await ctx.newCDPSession(page);
  const x1 = b.x + b.width * 0.5, x2 = b.x + b.width * 0.25;
  const punkt = (x) => [{ x, y, id: 1 }];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: punkt(x1) });
  for (let i = 1; i <= 6; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: punkt(x1 + (x2 - x1) * i / 6) });
  await page.waitForFunction(() => document.querySelector("[data-vergleich]").dataset.quelle === "touch");
  const dur = await page.$eval("[data-vergleich]", (el) => getComputedStyle(el).transitionDuration);
  assert.equal(dur, "0s", `Touch ohne Transition, war: ${dur}`);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await ctx.close();
});

test("Slider: Tastatur springt mit Federkurve linear() 340 ms (BAUPLAN 3.8)", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1440, height: 900 } }); // ohne Reduced Motion
  await page.goto(basis + "/leistungen/felgen/");
  await page.locator("[data-vergleich] .vergleich__buehne").scrollIntoViewIfNeeded();
  const regler = page.locator("[data-vergleich] input");
  await regler.focus();
  await page.keyboard.press("ArrowLeft");
  const q = await page.$eval("[data-vergleich]", (el) => el.dataset.quelle);
  assert.equal(q, "taste", "data-quelle=taste");
  const s = await page.$eval("[data-vergleich]", (el) => { const c = getComputedStyle(el); return { tf: c.transitionTimingFunction, dur: c.transitionDuration }; });
  assert.match(s.tf, /linear\(/, `Federkurve als linear(): ${s.tf}`);
  assert.match(s.dur, /0\.34s/, `340 ms: ${s.dur}`);
  await ctx.close();
});

test("Slider-Hinweis: laeuft einmal bei 60 % und bricht bei Eingabe ab (BAUPLAN 3.8)", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1440, height: 900 } }); // ohne Reduced Motion
  await page.goto(basis + "/leistungen/felgen/");
  await page.locator("[data-vergleich] .vergleich__buehne").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector("[data-vergleich]").classList.contains("ist-hinweis"));
  const regler = page.locator("[data-vergleich] input");
  await regler.focus();
  await page.keyboard.press("ArrowRight");
  const nochHinweis = await page.$eval("[data-vergleich]", (el) => el.classList.contains("ist-hinweis"));
  assert.ok(!nochHinweis, "Hinweis bricht bei Eingabe ab");
  await ctx.close();
});

test("Handy: Leiste mit Anrufen und Schaden melden erscheint nach dem Hero", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  await page.goto(basis + "/");
  await page.mouse.wheel(0, 1600);
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForFunction(() => document.body.classList.contains("leiste-an"));
  const leiste = page.locator(".handyleiste");
  assert.ok(await leiste.isVisible());
  assert.ok(await leiste.locator('a[href^="tel:"]').isVisible());
  assert.ok(await leiste.locator('a[href="/schaden-melden/"]').isVisible());
  await page.goto(basis + "/leistungen/felgen/");
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForFunction(() => document.body.classList.contains("leiste-an"));
  assert.ok(await page.locator(".handyleiste").isVisible(), "Leistungsseite: Leiste erst nach den Knöpfen im Kopf");
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Schaden melden: zwei Schritte ohne CSP-Fehler", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  await page.goto(basis + "/schaden-melden/");
  await page.locator(".art").first().click();
  const weiter = page.locator('[data-weiter="2"]');
  if (await weiter.isVisible()) await weiter.click();
  await page.locator('[data-schritt="2"]').waitFor({ state: "visible" });
  await page.locator('[data-schritt="2"]').waitFor({ state: "visible" });
  assert.ok(await page.locator('[data-schritt="2"] input[type="tel"], [data-schritt="2"] input[name*="tel" i]').count() > 0, "Schritt Kontakt mit Telefon");
  assert.deepEqual(fehler.filter((f) => /Content Security Policy/i.test(f)), []);
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Federknopf: transform mit Federkurve, nur Farbe bei Reduced Motion (BAUPLAN 3.2)", async () => {
  let { ctx, page } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/");
  const normal = await page.$eval(".knopf", (el) => { const s = getComputedStyle(el); return { prop: s.transitionProperty, timing: s.transitionTimingFunction }; });
  assert.match(normal.prop, /transform/, "transform wird animiert");
  assert.match(normal.timing, /linear\(/, "Federkurve als linear()");
  await ctx.close();
  ({ ctx, page } = await seite({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" }));
  await page.goto(basis + "/");
  const ruhig = await page.$eval(".knopf", (el) => { const s = getComputedStyle(el); return { dur: s.transitionDuration, tf: s.transform }; });
  assert.equal(ruhig.dur, "0s", "keine Transition bei Reduced Motion");
  assert.ok(ruhig.tf === "none" || ruhig.tf === "", `kein transform im Grundzustand: ${ruhig.tf}`);
  await ctx.close();
});

test("Fokusring erscheint ohne Transition (BAUPLAN 3.12)", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/");
  await page.keyboard.press("Tab"); // erster Tab: Sprunglink, per Tastatur also :focus-visible
  const r = await page.evaluate(() => { const el = document.activeElement; const s = getComputedStyle(el); return { outline: s.outlineStyle, props: s.transitionProperty }; });
  assert.match(r.outline, /solid/, "Fokusring sichtbar");
  assert.doesNotMatch(r.props, /outline/, "outline nicht in der Transition (sofort)");
  await ctx.close();
});

test("Handyleiste: an nach Hero, aus beim Fuss, aus bei Fokus (BAUPLAN 3.11)", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await page.goto(basis + "/");
  await page.waitForFunction(() => document.body.classList.contains("leiste-spaeter"));
  assert.ok(!(await page.evaluate(() => document.body.classList.contains("leiste-an"))), "oben, Hero sichtbar: aus");
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForFunction(() => document.body.classList.contains("leiste-an")); // nach dem Hero: an
  // Fokus auf ein Eingabefeld (Bildschirmtastatur): aus, danach wieder an
  await page.evaluate(() => { const i = document.createElement("input"); i.id = "pruef-feld"; document.querySelector("main").prepend(i); i.focus({ preventScroll: true }); });
  await page.waitForFunction(() => !document.body.classList.contains("leiste-an"));
  await page.evaluate(() => document.getElementById("pruef-feld").blur());
  await page.waitForFunction(() => document.body.classList.contains("leiste-an"));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); // Fuss sichtbar: aus
  await page.waitForFunction(() => !document.body.classList.contains("leiste-an"));
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Handyleiste: im Fuss aus (dort stehen dieselben Knöpfe, BAUPLAN 3.11)", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await page.goto(basis + "/");
  await page.waitForFunction(() => document.body.classList.contains("leiste-spaeter"));
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForFunction(() => document.body.classList.contains("leiste-an")); // nach dem Hero: an
  await page.locator(".fuss").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.body.classList.contains("leiste-an"));
  assert.ok(await page.locator(".fuss a[href='/schaden-melden/']").isVisible(), "Fuss hat die Knöpfe");
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Hero ohne JS: h1, Lead, CTAs und Faktenleiste nach 1000 ms mit opacity 1 (BAUPLAN 3.4/3.6)", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false });
  await page.goto(basis + "/", { waitUntil: "load" });
  await page.waitForTimeout(1000);
  const deckkraft = (sel) => page.$eval(sel, (el) => getComputedStyle(el).opacity);
  assert.equal(await deckkraft(".hm-hero__text h1"), "1", "h1 sichtbar");
  assert.equal(await deckkraft(".hm-hero__text h1 span"), "1", "h1 Zeile 2 sichtbar");
  assert.equal(await deckkraft(".hm-hero__text .lead"), "1", "Lead sichtbar");
  const ctas = await page.$$eval(".hero .ctas .btn", (els) => els.map((el) => getComputedStyle(el).opacity));
  assert.ok(ctas.length === 2 && ctas.every((o) => o === "1"), `CTAs sichtbar: ${ctas}`);
  const zellen = await page.$$eval(".hm-fakten__liste > div", (els) => els.map((el) => getComputedStyle(el).opacity));
  assert.ok(zellen.length === 4 && zellen.every((o) => o === "1"), `Faktenleiste sichtbar: ${zellen}`);
  // Ohne Skript bleibt nichts versteckt: «Einblenden beim Rollen» greift nur mit der Klasse reveal-an.
  const versteckt = await page.$$eval("[data-reveal], [data-reveal-liste] > *", (els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length);
  assert.equal(versteckt, 0, "ohne JS ist jeder Abschnitt sichtbar");
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Hero unter Reduced Motion: Kinder von .hm-hero__text ohne animation-name, nichts wartet aufs Rollen", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  await page.goto(basis + "/", { waitUntil: "load" });
  const namen = await page.$$eval(".hm-hero__text > *, .hm-hero__bild > img", (els) => els.map((el) => getComputedStyle(el).animationName));
  assert.ok(namen.length > 0, "Kinder vorhanden");
  for (const n of namen) assert.equal(n, "none", `kein animation-name, war «${n}»`);
  assert.ok(!(await page.evaluate(() => document.documentElement.classList.contains("reveal-an"))), "kein Einblenden beim Rollen");
  const versteckt = await page.$$eval("[data-reveal], [data-reveal-liste] > *", (els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length);
  assert.equal(versteckt, 0, "alles sofort sichtbar");
  await ctx.close();
});

test("Einblenden beim Rollen: jedes Element erscheint einmal und bleibt, keine Konsolenfehler (Hallmark, ein Reveal)", async () => {
  for (const vp of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    const { ctx, page, fehler } = await seite({ viewport: vp });
    await page.goto(basis + "/", { waitUntil: "load" });
    assert.ok(await page.evaluate(() => document.documentElement.classList.contains("reveal-an")), "mit Skript ist das Einblenden an");
    const hoehe = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= hoehe; y += 400) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(60); }
    await page.waitForTimeout(900);
    const offen = await page.$$eval("[data-reveal]:not(.is-in), [data-reveal-liste]:not(.is-in)", (els) => els.length);
    assert.equal(offen, 0, `nach dem Rollen ist alles eingeblendet (${vp.width})`);
    const versteckt = await page.$$eval("[data-reveal], [data-reveal-liste] > *", (els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length);
    assert.equal(versteckt, 0, `nichts bleibt durchsichtig (${vp.width})`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    assert.equal(await page.$$eval("[data-reveal]:not(.is-in)", (els) => els.length), 0, "bleibt sichtbar, auch nach dem Zurückrollen");
    assert.deepEqual(fehler, []);
    await ctx.close();
  }
});

test("Handy-Hero: H1 und «Schaden melden» stehen im ersten Bildschirm, auch am kleinen Handy (Roni 09.11.: Hallmark-Fassung, Foto zuerst)", async () => {
  for (const vp of [{ width: 390, height: 844 }, { width: 375, height: 667 }]) {
    const { ctx, page, fehler } = await seite({ viewport: vp, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    await page.goto(basis + "/", { waitUntil: "load" });
    const h1 = await page.locator(".hm-hero__text h1").boundingBox();
    const cta = await page.locator('.hero .ctas a[href="/schaden-melden/"]').boundingBox();
    const bild = await page.locator(".hm-hero__bild img").boundingBox();
    assert.ok(h1.y + h1.height <= vp.height, `H1 im ersten Bildschirm (${h1.y + h1.height} von ${vp.height})`);
    assert.ok(cta.y + cta.height <= vp.height, `Haupt-CTA «Schaden melden» im ersten Bildschirm (${cta.y + cta.height} von ${vp.height})`);
    assert.ok(bild.height <= vp.height * 0.4 + 1, `Foto nimmt höchstens 40 % der Höhe (${bild.height})`);
    assert.deepEqual(fehler, []);
    await ctx.close();
  }
});

test("Anrufen-Knopf hat eine nicht transparente Hintergrundfarbe (Entscheid Reshat)", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/", { waitUntil: "load" });
  for (const sel of ['.hero .ctas a[href^="tel:"]', '.hm-ablauf .hm-ctas a[href^="tel:"]', '.fuss .ctas a[href^="tel:"]']) {
    const bg = await page.$eval(sel, (el) => getComputedStyle(el).backgroundColor);
    const m = bg.match(/rgba?\(([^)]+)\)/);
    const teile = m ? m[1].split(",").map((s) => parseFloat(s)) : [];
    const alpha = teile.length === 4 ? teile[3] : 1;
    assert.ok(bg !== "transparent" && alpha > 0, `${sel}: Hintergrund nicht transparent, war «${bg}»`);
  }
  await ctx.close();
});

test("Handyleiste und Hero-CTAs sind beim Scrollen nie gleichzeitig sichtbar (Design-Review 22:00, 2)", async () => {
  const { ctx, page } = await seite({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(basis + "/", { waitUntil: "load" });
  await page.waitForFunction(() => document.body.classList.contains("leiste-spaeter"));
  const sichtbar = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s); if (!el) return false;
    const r = el.getBoundingClientRect();
    if (getComputedStyle(el).visibility === "hidden") return false;
    return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
  }, sel);
  const leisteAn = () => page.evaluate(() => {
    const el = document.querySelector(".handyleiste"); if (!el) return false;
    const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    // als sichtbar gilt die Leiste nur, wenn sie nicht nach unten weggeschoben ist
    return s.transform === "none" || !/matrix.*\b[1-9]\d*\)/.test("") ? (document.body.classList.contains("leiste-an")) : false;
  });
  for (let y = 0; y <= 2600; y += 200) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
    const ctas = await sichtbar(".hero .ctas");
    const leiste = await page.evaluate(() => document.body.classList.contains("leiste-an"));
    assert.ok(!(ctas && leiste), `bei y=${y}: Hero-CTAs und Handyleiste nicht gleichzeitig (ctas=${ctas}, leiste=${leiste})`);
  }
  await ctx.close();
});

test("Partnerband: Pausieren-Knopf haelt das Laufband an (BAUPLAN 3.9)", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/");
  const spur = page.locator(".partner .partnerband__spur");
  const knopf = page.locator("[data-partner-pause]");
  const lauf = () => spur.evaluate((el) => getComputedStyle(el).animationPlayState);
  assert.equal(await lauf(), "running", "laeuft zuerst");
  await knopf.click();
  assert.equal(await lauf(), "paused", "nach Klick pausiert");
  assert.equal(await knopf.getAttribute("aria-pressed"), "true");
  assert.equal((await knopf.textContent()).trim(), "Weiter");
  await knopf.click();
  assert.equal(await lauf(), "running", "zweiter Klick: laeuft wieder");
  assert.equal(await knopf.getAttribute("aria-pressed"), "false");
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Partnerband unter Reduced Motion: Band steht, kein Knopf (BAUPLAN 3.9)", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  await page.goto(basis + "/");
  const spur = page.locator(".partner .partnerband__spur");
  assert.equal(await spur.evaluate((el) => getComputedStyle(el).animationName), "none", "kein Lauf");
  assert.ok(!(await page.locator("[data-partner-pause]").isVisible()), "kein Pausieren-Knopf");
  await ctx.close();
});

test("Handy: Leiste bleibt beim Runterscrollen stehen", async () => {
  const { ctx, page } = await seite({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  await page.goto(basis + "/");
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForFunction(() => document.body.classList.contains("leiste-an"));
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(150);
  const unten = await page.$eval(".handyleiste", (el) => el.getBoundingClientRect().bottom);
  assert.ok(unten <= window_hoehe(page), `Leiste im Bild (${unten})`);
  await ctx.close();
});

test("Leistungen: je Zeile genau ein Link mit Foto, Titel und Text, Ziele in fester Reihenfolge", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/");
  const karten = page.locator(".hm-index > li");
  assert.equal(await karten.count(), 6, "6 Leistungen (Nachtrag)");
  for (let i = 0; i < 6; i++) {
    assert.equal(await karten.nth(i).locator("a").count(), 1, "genau ein Link je Zeile");
    assert.equal(await karten.nth(i).locator("a img[alt]:not([alt=''])").count(), 1, "ein Foto mit Alt-Text");
    assert.equal(await karten.nth(i).locator("a h3").count(), 1, "ein Titel");
  }
  const hrefs = await page.$$eval(".hm-index a", (as) => as.map((a) => { const u = new URL(a.href); return u.pathname + u.hash; }));
  assert.deepEqual(hrefs, ["/leistungen/unfall-carrosserie/", "/leistungen/hagel-dellen/", "/leistungen/lack/", "/leistungen/felgen/", "/leistungen/folierung/", "/leistungen/scheiben/"]);
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Leistungen: ein Zeichen beim Überfahren (der Strich unter dem Titel wird dunkel), das Foto bleibt ruhig", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/");
  const zeile = page.locator(".hm-index a").first();
  await zeile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const lies = () => zeile.evaluate((a) => ({ strich: getComputedStyle(a.querySelector("h3")).textDecorationColor, bild: getComputedStyle(a.querySelector("img")).transform, prop: getComputedStyle(a.querySelector("h3")).transitionProperty }));
  const vor = await lies();
  await zeile.hover();
  await page.waitForTimeout(400);
  const nach = await lies();
  assert.match(vor.prop, /text-decoration-color/, "Titel animiert nur die Farbe des Strichs");
  assert.notEqual(nach.strich, vor.strich, "Strich ändert beim Überfahren die Farbe");
  assert.equal(nach.bild, vor.bild, "Foto bewegt sich nicht (Hallmark: Bilder bleiben ruhig)");
  await ctx.close();
});

test("Leistungen: Handy zeigt Zeilen, jede so breit wie die Spalte", async () => {
  const { ctx, page } = await seite({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(basis + "/");
  const spalte = await page.$eval(".hm-index", (el) => el.getBoundingClientRect().width);
  const rects = await page.$$eval(".hm-index a", (as) => as.map((a) => { const r = a.getBoundingClientRect(); return { b: r.width, h: r.height, x: Math.round(r.x), top: Math.round(r.top) }; }));
  assert.equal(rects.length, 6, "6 Leistungen (Nachtrag)");
  for (const r of rects) assert.ok(Math.abs(r.b - spalte) <= 1, `Zeile ${r.b} ~ Spalte ${spalte}`);
  for (const r of rects) assert.ok(r.h >= 48, `Tippziel mindestens 48 px hoch, war ${r.h}`);
  assert.equal(new Set(rects.map((r) => r.x)).size, 1, "alle linksbuendig (eine Spalte)");
  assert.equal(new Set(rects.map((r) => r.top)).size, 6, "sechs gestapelte Zeilen");
  await ctx.close();
});

// Tesla-Abschnitt der Startseite: drei Schritte als Liste, Foto und Angaben. Bewegung nur über «Einblenden beim Rollen».
const teslaSichtbar = (page) => page.$$eval("#tesla [data-reveal], #tesla .hm-tesla__ablauf li, #tesla .hm-tesla__bild img", (els) => els.map((el) => getComputedStyle(el).opacity));

test("Tesla-Abschnitt: nach dem Scrollen voll sichtbar, drei Schritte, Knopf mit Tesla-Vorauswahl", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/");
  await page.locator("#tesla .hm-tesla__ablauf").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  assert.equal(await page.locator("#tesla .hm-tesla__ablauf li").count(), 3, "drei Schritte");
  for (const o of await teslaSichtbar(page)) assert.equal(o, "1", `voll sichtbar, war: ${o}`);
  assert.equal(await page.locator('#tesla a.btn[href="/schaden-melden/?tesla=1"]').count(), 1, "Knopf «Tesla-Schaden melden»");
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Tesla-Abschnitt: unter Reduced Motion sofort voll sichtbar", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  await page.goto(basis + "/");
  const deck = await teslaSichtbar(page);
  assert.ok(deck.length >= 7, "Teile vorhanden");
  for (const o of deck) assert.equal(o, "1", "ohne Rollen sichtbar");
  await ctx.close();
});

test("Tesla-Abschnitt ohne JS: Schritte, Angaben und Foto sofort sichtbar", async () => {
  const { ctx, page } = await seite({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false });
  await page.goto(basis + "/", { waitUntil: "load" });
  const deck = await teslaSichtbar(page);
  assert.ok(deck.length >= 7, "Teile vorhanden");
  for (const o of deck) assert.equal(o, "1", "sichtbar");
  await ctx.close();
});

test("Bewertungen: ohne echte Daten kein Abschnitt, nie «–,– von 5» live (Design-Review 22:00, 3)", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/", { waitUntil: "load" });
  assert.equal(await page.locator(".bewertungen-teil").count(), 0, "ohne Daten kein Bewertungs-Abschnitt");
  assert.doesNotMatch(await page.content(), /–,– von 5/, "nie der Platzhalter «–,– von 5» live");
  await ctx.close();
});

test("Bewertungen: ohne Klick keine Anfrage an *.google* (BAUPLAN 4.3)", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1280, height: 800 } });
  const google = [];
  page.on("request", (r) => { if (/(^|\.)google|googleapis|gstatic/i.test(new URL(r.url()).hostname)) google.push(r.url()); });
  await page.goto(basis + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  assert.deepEqual(google, [], `keine Anfrage an Google: ${google.join(", ")}`);
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Fuss-Status: reine Funktion liefert offen, Mittag, Abend, Sonntag, Feiertag (feste Uhrzeiten, Europe/Zurich)", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1280, height: 800 } });
  await page.goto(basis + "/", { waitUntil: "load" });
  await page.waitForFunction(() => window.__klar && window.__klar.daten);
  // Status aus den echten Betriebsdaten (Mo–Fr 7.30–12.00/13.15–17.30). Winter = CET (UTC+1).
  const s = (isoUtc, aus) => page.evaluate(([iso, a]) => {
    const d = a ? { zeiten: window.__klar.daten.zeiten, ausnahmen: a, status: window.__klar.daten.status } : window.__klar.daten;
    return window.__klar.status(d, new Date(iso));
  }, [isoUtc, aus || null]);
  assert.equal((await s("2026-01-05T09:00:00Z")).text, "Jetzt offen, bis 12.00 Uhr.", "Mo 10:00 offen");
  assert.equal((await s("2026-01-05T09:00:00Z")).offen, true, "offen = true");
  assert.equal((await s("2026-01-05T11:30:00Z")).text, "Jetzt geschlossen, heute ab 13.15 Uhr offen.", "Mittagspause");
  assert.equal((await s("2026-01-05T17:00:00Z")).text, "Jetzt geschlossen, Dienstag ab 7.30 Uhr offen.", "Mo Abend → öffnet morgen");
  assert.equal((await s("2026-01-09T18:00:00Z")).text, "Jetzt geschlossen, Montag ab 7.30 Uhr offen.", "Fr Abend → öffnet Mo");
  assert.equal((await s("2026-01-04T10:00:00Z")).text, "Jetzt geschlossen, Montag ab 7.30 Uhr offen.", "Sonntag → öffnet Mo");
  // Feiertag: geschlossener Tag (leeres Fenster) → nächster offener Tag.
  assert.equal((await s("2026-01-06T09:00:00Z", { "2026-01-06": [] })).text, "Jetzt geschlossen, Mittwoch ab 7.30 Uhr offen.", "Feiertag Di geschlossen");
  // Feiertag mit Sonderzeiten 9.00–12.00: zur Zeit offen.
  assert.equal((await s("2026-01-06T09:00:00Z", { "2026-01-06": [[540, 720]] })).text, "Jetzt offen, bis 12.00 Uhr.", "Feiertag mit Sonderzeiten");
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Fuss: Status wird live gesetzt, Kopieren-Knopf erscheint und meldet «Kopiert»", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1280, height: 800 }, permissions: ["clipboard-read", "clipboard-write"] });
  await page.goto(basis + "/", { waitUntil: "load" });
  await page.waitForFunction(() => { const p = document.querySelector(".fuss-status"); return p && p.hasAttribute("data-zustand"); });
  const zustand = await page.$eval(".fuss-status", (p) => p.getAttribute("data-zustand"));
  assert.ok(zustand === "offen" || zustand === "zu", `Status-Zustand gesetzt, war «${zustand}»`);
  const text = await page.$eval(".fuss-status", (p) => p.textContent);
  assert.ok(/Jetzt (offen|geschlossen)/.test(text), `Status-Text aus texte.json, war «${text}»`);
  // Kopieren: ohne JS versteckt, mit Clipboard-API sichtbar; Bestätigung über aria-live.
  const knopf = page.locator(".fuss-ort__tel .fuss-kopf");
  assert.ok(await knopf.isVisible(), "Kopieren-Knopf sichtbar");
  const vorher = (await knopf.textContent()).trim(), breite = (await knopf.boundingBox()).width;
  await knopf.click();
  await page.waitForFunction(() => /kopiert/i.test(document.querySelector("[data-kopiert-ziel]").textContent));
  // Prüfung 10.11.2026, Befund 19: sichtbare Rückmeldung im Knopf («Kopiert»), hörbar über role=status; danach wieder wie vorher.
  assert.equal((await knopf.textContent()).trim(), "Kopiert", "Knopf zeigt «Kopiert»");
  assert.ok((await knopf.boundingBox()).width >= breite - 0.5, "Knopf wird beim Wechsel nicht schmaler");
  assert.equal(await page.getAttribute("[data-kopiert-ziel]", "role"), "status");
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), "071 755 88 61", "Nummer liegt in der Zwischenablage");
  await page.waitForFunction((t) => document.querySelector(".fuss-ort__tel .fuss-kopf").textContent.trim() === t && !document.querySelector("[data-kopiert-ziel]").textContent, vorher, { timeout: 5000 });
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Kopfleiste verdeckt die H1 nicht (A1): H1-Oberkante unter der Kopf-Unterkante, auf Start- und Unterseiten bei 390 und 1440", async () => {
  for (const breite of [390, 1440]) for (const pfad of ["/", "/team/", "/kontakt/", "/leistungen/lack/", "/schaden-melden/"]) {
    const { ctx, page, fehler } = await seite({ viewport: { width: breite, height: 900 }, reducedMotion: "reduce" });
    await page.goto(basis + pfad, { waitUntil: "load" });
    await page.evaluate(() => window.scrollTo(0, 0));
    const kopf = await page.locator(".kopf").boundingBox();
    const h1 = await page.locator("main h1").first().boundingBox();
    assert.ok(h1.y >= kopf.y + kopf.height, `${breite}px ${pfad}: H1-top ${h1.y} >= Kopf-bottom ${kopf.y + kopf.height}`);
    // Die Kopfleiste schwebt (Hallmark-Fassung): höchstens ein schmaler Abstand zum oberen Rand, kein leerer Streifen.
    assert.ok(kopf.y <= 24, `${breite}px ${pfad}: Kopf sitzt oben (top ${kopf.y})`);
    assert.deepEqual(fehler, []);
    await ctx.close();
  }
});

test("Kopf, Inhalt und Fuss stehen auf denselben Kanten (Start- und Unterseiten, 390 bis 1920)", async () => {
  for (const breite of [390, 768, 1024, 1280, 1440, 1920]) {
    const { ctx, page } = await seite({ viewport: { width: breite, height: 900 }, reducedMotion: "reduce" });
    for (const pfad of ["/", "/leistungen/lack/", "/kontakt/", "/team/", "/tesla/", "/impressum/"]) {
      await page.goto(basis + pfad, { waitUntil: "load" });
      const r = await page.evaluate(() => {
        const x = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [b.left, b.right]; };
        return { kopf: x(".kopf"), inhalt: x("main .abschnitt__innen") || x("main .hm-fakten__liste"), fuss: x(".fuss-raster") };
      });
      for (const [name, k] of [["Inhalt", r.inhalt], ["Fuss", r.fuss]]) {
        assert.ok(k, `${breite} ${pfad}: ${name} gefunden`);
        assert.ok(Math.abs(k[0] - r.kopf[0]) <= 1 && Math.abs(k[1] - r.kopf[1]) <= 1, `${breite} ${pfad}: ${name} ${k.map(Math.round)} auf den Kanten des Kopfs ${r.kopf.map(Math.round)}`);
      }
    }
    await ctx.close();
  }
});

test("Fuss: Tippziele mindestens 44 px, beide Aufruf-Knöpfe mindestens 48 px", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, permissions: ["clipboard-read", "clipboard-write"] });
  await page.goto(basis + "/", { waitUntil: "load" });
  await page.locator(".fuss").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => { const b = document.querySelector(".fuss-ort__tel .fuss-kopf"); return b && !b.hidden; });
  // Aufruf-Knöpfe im Fuss: >= 48 px wie im Hero.
  const anruf = await page.locator('.fuss .ctas a[href^="tel:"]').boundingBox();
  assert.ok(anruf.height >= 48, `Anrufen ${anruf.height} >= 48`);
  // Alle uebrigen sichtbaren Tippziele (Links und Knoepfe) im Fuss: >= 44 px.
  const hoehen = await page.$$eval(".fuss a, .fuss button", (els) => els
    .filter((el) => el.offsetParent !== null)
    .map((el) => ({ t: (el.textContent || "").trim().slice(0, 24), h: Math.round(el.getBoundingClientRect().height) })));
  assert.ok(hoehen.length >= 8, `genug Tippziele gemessen: ${hoehen.length}`);
  for (const z of hoehen) assert.ok(z.h >= 44, `Tippziel «${z.t}» ${z.h} >= 44`);
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Alle Seiten laden ohne Konsolenfehler (CSP)", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 1280, height: 800 } });
  for (const p of ["/", "/leistungen/", "/leistungen/unfall-carrosserie/", "/leistungen/hagel-dellen/", "/leistungen/lack/", "/leistungen/felgen/", "/leistungen/folierung/", "/leistungen/scheiben/", "/tesla/", "/occasionen/", "/team/", "/kontakt/", "/bildnachweise/", "/schaden-melden/"]) {
    await page.goto(basis + p, { waitUntil: "load" });
  }
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("Leistungsseiten: Aufruf ohne Scrollen sichtbar, passende Schadenart, keine Sprungleiste", async () => {
  const { ctx, page, fehler } = await seite({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await page.goto(basis + "/leistungen/");
  assert.equal(await page.locator(".sprungleiste").count(), 0);
  await page.goto(basis + "/leistungen/felgen/");
  const knopf = page.locator(".leistung-kopf .knopf--akzent");
  assert.equal(await knopf.getAttribute("href"), "/schaden-melden/?art=felge");
  const box = await knopf.boundingBox();
  assert.ok(box.y + box.height <= 844, `Knopf im ersten Bild (${box.y + box.height})`);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, "kein Querscrollen");
  assert.equal(await page.locator(".weitere__liste a").count(), 5); // die fünf anderen Leistungen; «Firmenkunden» entfällt (Roni 09.11.2026)
  assert.deepEqual(fehler, []);
  await ctx.close();
});
