// Abnahme der QA-Befunde zur Linie «Klar» (.medaur/belege/klar-ist/BEFUNDE.md, Task B3, 09.11.2026) im Browser.
// Je Test die K-ID. Server auf dist/ mit der CSP aus _headers. Vorher: npm run build. Alle /api/**-Aufrufe sind gemockt.
// Läuft über einen Import in formular.test.mjs mit, solange package.json die Datei nicht selbst nennt (Lead).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const csp = fs.readFileSync(path.join(dist, "_headers"), "utf8").match(/^\s+Content-Security-Policy: (.*)$/m)[1];
const typen = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon" };
let server, basis, browser;
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==", "base64");

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

async function seite(w, h = 844, extra = {}) {
  const handy = w < 600;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", ...(handy ? { isMobile: true, hasTouch: true } : {}), ...extra });
  const page = await ctx.newPage();
  const fehler = [];
  page.on("console", (m) => { if (m.type() === "error" && !/status of (404|500)/.test(m.text()) && !/ERR_FAILED|net::/.test(m.text())) fehler.push(m.text()); });
  page.on("pageerror", (e) => fehler.push(String(e)));
  return { ctx, page, fehler };
}
const querfrei = (page) => page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth);

test("K01: Schritt 2 ohne Querscrollen bei 320/390/430, auch mit Fehlern und Foto; Menü-Knopf ganz sichtbar", async () => {
  for (const w of [320, 390, 430]) {
    const { ctx, page, fehler } = await seite(w);
    await page.goto(basis + "/schaden-melden/");
    await page.locator(".art").first().click();
    await page.waitForSelector('[data-schritt="2"]:not([hidden])');
    assert.ok(await querfrei(page), `${w}: Schritt 2`);
    await page.locator('[data-senden="website"]').click();
    await page.waitForSelector('#f-name[aria-invalid="true"]');
    assert.ok(await querfrei(page), `${w}: mit Fehlern`);
    await page.setInputFiles("[data-fotos]", { name: "a.png", mimeType: "image/png", buffer: PNG });
    await page.waitForSelector(".fotos__liste img");
    assert.ok(await querfrei(page), `${w}: mit Foto`);
    const m = await page.locator(".kopf__menu").boundingBox();
    assert.ok(m.x >= 0 && m.x + m.width <= w, `${w}: Menü-Knopf im Bild (${m.x}–${m.x + m.width})`);
    assert.deepEqual(fehler, []);
    await ctx.close();
  }
});

test("K02: Pfeiltasten gehen alle 7 Arten durch, ohne den Schritt zu wechseln; Enter führt mit der Wahl weiter; Klick unverändert", async () => {
  const { ctx, page } = await seite(1440, 900);
  await page.goto(basis + "/schaden-melden/");
  const arten = await page.$$eval('input[name="art"]', (l) => l.map((i) => i.value));
  assert.equal(arten.length, 7);
  await page.locator('input[name="art"]').first().focus();
  const gesehen = [];
  for (let i = 1; i < 7; i++) {
    await page.keyboard.press("ArrowRight");
    gesehen.push(await page.$eval('input[name="art"]:checked', (x) => x.value));
    assert.ok(await page.locator('[data-schritt="2"]').isHidden(), `nach Pfeil ${i} noch Schritt 1`);
  }
  assert.deepEqual(gesehen, arten.slice(1), "alle Arten erreichbar");
  await page.keyboard.press("Enter");
  await page.waitForSelector('[data-schritt="2"]:not([hidden])');
  assert.equal(await page.$eval('input[name="art"]:checked', (x) => x.value), arten[6], "gewählte Art bleibt");
  // Zurück, dann «Weiter»-Knopf per Tastatur
  await page.locator('[data-zurueck="1"]').click();
  await page.waitForSelector('[data-schritt="1"]:not([hidden])');
  await page.locator('[data-weiter="2"]').focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector('[data-schritt="2"]:not([hidden])');
  await ctx.close();
  // Tippen auf eine Karte führt wie bisher sofort weiter
  const t = await seite(390);
  await t.page.goto(basis + "/schaden-melden/");
  await t.page.locator(".art").nth(2).tap();
  await t.page.waitForSelector('[data-schritt="2"]:not([hidden])');
  await t.ctx.close();
});

test("K03: Nach Sendefehler (500 und Netzabbruch) liegt der Fokus auf dem Senden-Knopf", async () => {
  for (const art of ["500", "abbruch"]) {
    const { ctx, page } = await seite(390);
    await page.route("**/api/**", (r) => (r.request().method() === "GET" ? r.fulfill({ status: 200, body: "{}" }) : art === "500" ? r.fulfill({ status: 500, body: "{}" }) : r.abort()));
    await page.goto(basis + "/schaden-melden/?art=hagel");
    await page.evaluate(() => { document.getElementById("schaden-form").dataset.endpunkt = "/api/schaden"; });
    await page.waitForSelector('[data-schritt="2"]:not([hidden])');
    await page.fill("#f-name", "Test");
    await page.fill("#f-tel", "071 755 88 61");
    await page.locator('[data-senden="website"]').click();
    await page.waitForFunction(() => /nicht geklappt/.test(document.querySelector("[data-rueckmeldung]").textContent));
    assert.equal(await page.evaluate(() => document.activeElement && document.activeElement.dataset.senden), "website", `${art}: Fokus auf dem Knopf`);
    assert.equal(await page.inputValue("#f-name"), "Test", `${art}: Angaben bleiben`);
    await ctx.close();
  }
});

test("K04: Kontakt – Etiketten kleiner als die Angabe, Telefonnummer im ersten Bild am Handy, Adresse im Inhalt einmal", async () => {
  for (const w of [390, 1440]) {
    const { ctx, page } = await seite(w, w < 600 ? 844 : 900);
    await page.goto(basis + "/kontakt/");
    const r = await page.evaluate(() => {
      const karten = [...document.querySelectorAll(".kontakt__karte")].map((k) => [parseFloat(getComputedStyle(k.querySelector("h2")).fontSize), parseFloat(getComputedStyle(k.querySelector(".kontakt__wert")).fontSize)]);
      const nr = document.querySelector(".kontakt__karte a.kontakt__wert[href^='tel:']").getBoundingClientRect();
      const leiste = document.querySelector(".handyleiste");
      const unten = leiste && getComputedStyle(leiste).display !== "none" ? leiste.getBoundingClientRect().top : innerHeight;
      return { karten, nrUnten: nr.bottom, unten, adresse: (document.querySelector("main").innerText.match(/Alte Landstrasse 63/g) || []).length, h1: document.querySelector("h1").textContent };
    });
    for (const [titel, wert] of r.karten) assert.ok(titel < wert, `${w}: Etikett ${titel}px < Angabe ${wert}px`);
    if (w < 600) assert.ok(r.nrUnten <= r.unten, `390: Nummer im ersten Bild (${r.nrUnten} ≤ ${r.unten})`);
    assert.ok(r.adresse <= 1, `${w}: Adresse ${r.adresse}× im Inhalt`);
    assert.doesNotMatch(r.h1, /Landstrasse/, "H1 ist eine Aussage, nicht die Adresse");
    await ctx.close();
  }
});

test("K07: Team-Raster füllt die Inhaltsbreite bei 1440 und 1024", async () => {
  for (const w of [1440, 1024]) {
    const { ctx, page } = await seite(w, 900);
    await page.goto(basis + "/team/");
    const r = await page.$$eval(".leute--seite", (l) => l.map((g) => { const b = g.getBoundingClientRect(); const rechts = Math.max(...[...g.children].map((c) => c.getBoundingClientRect().right)); return [b.right - rechts, parseFloat(getComputedStyle(g).columnGap)]; }));
    for (const [rest, abstand] of r) assert.ok(rest <= abstand + 1, `${w}: Rest ${rest}px ≤ Spaltenabstand ${abstand}px`);
    await ctx.close();
  }
});

test("K09: eigenständige Links und Knöpfe auf Kontakt, Team, Flotten, Occasionen mindestens 44 × 44 px (320/390)", async () => {
  for (const w of [320, 390]) for (const s of ["/kontakt/", "/team/", "/flotten/", "/occasionen/"]) {
    const { ctx, page } = await seite(w);
    await page.goto(basis + s);
    const klein = await page.evaluate(() => [...document.querySelectorAll("main a, main button, main label.zeitwahl__feld, main .chips__wahl label")].filter((e) => {
      const p = e.closest("p"); if (e.tagName === "A" && p && p.textContent.trim() !== e.textContent.trim() && !p.closest(".kontakt__karte")) return false; // Inline-Link im Fliesstext
      if (e.closest("[hidden]") || getComputedStyle(e).visibility === "hidden") return false;
      const b = e.getBoundingClientRect(); return b.width > 0 && (b.width < 44 || b.height < 43.5);
    }).map((e) => { const b = e.getBoundingClientRect(); return `${e.textContent.trim().slice(0, 24)} ${Math.round(b.width)}×${Math.round(b.height)}`; }));
    assert.deepEqual(klein, [], `${w} ${s}`);
    assert.ok(await querfrei(page), `${w} ${s}: kein Querscrollen`);
    await ctx.close();
  }
});

test("K14: alle 7 Schadenart-Karten bei 390 gleich hoch", async () => {
  const { ctx, page } = await seite(390);
  await page.goto(basis + "/schaden-melden/");
  const h = await page.$$eval(".art", (a) => a.map((x) => x.getBoundingClientRect().height));
  assert.equal(h.length, 7);
  assert.ok(Math.max(...h) - Math.min(...h) <= 2, `Höhen ${h.join(", ")}`);
  await ctx.close();
});

test("K15: Vorschau-Plakette verdeckt bei 390 keinen Inhalt (steht nach dem Fuss, nicht fix)", async () => {
  for (const s of ["/", "/schaden-melden/", "/kontakt/", "/team/"]) {
    const { ctx, page } = await seite(390);
    await page.goto(basis + s);
    const r = await page.$eval("[data-vorschau]", (v) => [getComputedStyle(v).position, v.previousElementSibling && v.previousElementSibling.tagName]);
    assert.equal(r[0], "static", `${s}: nicht schwebend`);
    assert.equal(r[1], "FOOTER", `${s}: nach dem Fuss`);
    await ctx.close();
  }
});

test("K16: Fuss bei 1440 höchstens 700 px hoch, Slogan nie grösser als das H1", async () => {
  for (const w of [390, 1440]) for (const s of ["/", "/team/", "/impressum/", "/schaden-melden/"]) {
    const { ctx, page } = await seite(w, 900);
    await page.goto(basis + s);
    const r = await page.evaluate(() => [document.querySelector("footer").getBoundingClientRect().height, parseFloat(getComputedStyle(document.querySelector("h1")).fontSize), parseFloat(getComputedStyle(document.querySelector(".fuss-slogan")).fontSize)]);
    if (w === 1440) assert.ok(r[0] <= 700, `${s}: Fuss ${r[0]} px`);
    assert.ok(r[2] <= r[1], `${w} ${s}: Slogan ${r[2]} ≤ H1 ${r[1]}`);
    await ctx.close();
  }
});

test("K17 und K18: Mailadressen brechen nicht im Wort, «K + L» bleibt auf einer Zeile (320/390)", async () => {
  for (const w of [320, 390]) {
    const { ctx, page } = await seite(w);
    await page.goto(basis + "/team/");
    const teile = await page.$$eval('main a[href^="mailto:"]', (l) => l.flatMap((a) => [...a.childNodes].filter((n) => n.nodeType === 3).map((n) => { const r = document.createRange(); r.selectNodeContents(n); return [n.textContent, r.getClientRects().length]; })));
    for (const [t, n] of teile) assert.equal(n, 1, `${w}: «${t}» auf einer Zeile`);
    await page.goto(basis + "/flotten/");
    const kl = await page.evaluate(() => { const h = [...document.querySelectorAll("main h2")].find((x) => /K \+ L/.test(x.textContent)); const n = [...h.childNodes].find((c) => c.nodeType === 3 && /K \+ L/.test(c.textContent)); const i = n.textContent.indexOf("K +"); const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 5); return r.getClientRects().length; });
    assert.equal(kl, 1, `${w}: K + L auf einer Zeile`);
    await ctx.close();
  }
});

test("K22: offenes Menü am Handy volle Breite, «Schaden melden» und «Anrufen» als Knöpfe ≥ 44 px", async () => {
  const { ctx, page } = await seite(390);
  await page.goto(basis + "/");
  await page.click(".kopf__menu");
  await page.waitForSelector(".blatt.ist-auf");
  const r = await page.evaluate(() => {
    const innen = document.querySelector(".blatt__innen").getBoundingClientRect();
    const k = (sel) => { const e = document.querySelector(sel); const b = e.getBoundingClientRect(); return { h: b.height, bg: getComputedStyle(e).backgroundColor, text: e.textContent }; };
    return { links: innen.left, breite: innen.width, aktion: k(".blatt__aktion"), tel: k(".blatt__tel") };
  });
  assert.ok(r.links <= 0.5 && r.breite >= 389, `volle Breite (${r.links}, ${r.breite})`);
  assert.ok(r.aktion.h >= 44 && r.aktion.bg !== "rgba(0, 0, 0, 0)", "Schaden melden als Knopf");
  assert.ok(r.tel.h >= 44 && r.tel.bg !== "rgba(0, 0, 0, 0)" && /Anrufen/.test(r.tel.text), "Anrufen als Knopf");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector(".blatt").open);
  await ctx.close();
});

test("K13: Ablauf-Ziffern und nicht klickbare Listen tragen nicht die Linkfarbe", async () => {
  const { ctx, page } = await seite(1440, 900);
  for (const s of ["/", "/leistungen/", "/flotten/", "/tesla/", "/leistungen/unfall-carrosserie/"]) {
    await page.goto(basis + s);
    const blau = await page.evaluate(() => {
      const link = "rgb(21, 102, 184)"; // --akzent, die Linkfarbe
      return [...document.querySelectorAll(".ablauf-kunde__nr, .ablauf .ziffer, .liste li, .tesla__liste li, .arbeiten__liste li, .spec dd")].filter((e) => getComputedStyle(e).color === link).map((e) => e.textContent.trim().slice(0, 20));
    });
    assert.deepEqual(blau, [], `${s}: nichts Nicht-Klickbares in Linkblau`);
  }
  await ctx.close();
});
