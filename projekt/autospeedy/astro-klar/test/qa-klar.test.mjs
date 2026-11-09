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
    await page.waitForFunction(() => /nicht geklappt/.test(document.querySelector("[data-sende-rueckmeldung]").textContent));
    assert.equal(await page.evaluate(() => document.activeElement && document.activeElement.dataset.senden), "website", `${art}: Fokus auf dem Knopf`);
    assert.equal(await page.inputValue("#f-name"), "Test", `${art}: Angaben bleiben`);
    // QA C02: Meldung direkt über «Nochmals senden», beide ganz im Bild (nach dem ruhigen Scrollen), Nummer als Link
    await page.waitForFunction(() => { const m = document.querySelector("[data-sende-rueckmeldung]").getBoundingClientRect(), k = document.querySelector('[data-senden="website"]').getBoundingClientRect(); return m.top >= 0 && k.bottom <= innerHeight; }, null, { timeout: 3000 });
    const c02 = await page.evaluate(() => {
      const m = document.querySelector("[data-sende-rueckmeldung]"), k = document.querySelector('[data-senden="website"]');
      return { rolle: m.getAttribute("role"), davor: m.nextElementSibling === k, knopf: k.textContent, tel: (m.querySelector('a[href^="tel:"]') || {}).textContent, allgemein: document.querySelector("[data-rueckmeldung]").hidden };
    });
    assert.equal(c02.rolle, "alert", `${art}: role=alert`);
    assert.ok(c02.davor, `${art}: Meldung direkt über dem Knopf`);
    assert.match(c02.knopf, /Nochmals senden/);
    assert.equal(c02.tel, "071 755 88 61", `${art}: Telefonnummer klickbar`);
    assert.ok(c02.allgemein, `${art}: keine zweite Meldung unter «Zurück»`);
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

test("K09: eigenständige Links und Knöpfe auf Kontakt, Team, Occasionen mindestens 44 × 44 px (320/390)", async () => {
  for (const w of [320, 390]) for (const s of ["/kontakt/", "/team/", "/occasionen/"]) {
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

test("K17: Mailadressen brechen nicht im Wort (320/390)", async () => {
  for (const w of [320, 390]) {
    const { ctx, page } = await seite(w);
    await page.goto(basis + "/team/");
    const teile = await page.$$eval('main a[href^="mailto:"]', (l) => l.flatMap((a) => [...a.childNodes].filter((n) => n.nodeType === 3).map((n) => { const r = document.createRange(); r.selectNodeContents(n); return [n.textContent, r.getClientRects().length]; })));
    for (const [t, n] of teile) assert.equal(n, 1, `${w}: «${t}» auf einer Zeile`);
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
  for (const s of ["/", "/leistungen/", "/tesla/", "/leistungen/unfall-carrosserie/"]) {
    await page.goto(basis + s);
    const blau = await page.evaluate(() => {
      const link = "rgb(21, 102, 184)"; // --akzent, die Linkfarbe
      return [...document.querySelectorAll(".ablauf-kunde__nr, .ablauf .ziffer, .liste li, .tesla__liste li, .arbeiten__liste li, .spec dd")].filter((e) => getComputedStyle(e).color === link).map((e) => e.textContent.trim().slice(0, 20));
    });
    assert.deepEqual(blau, [], `${s}: nichts Nicht-Klickbares in Linkblau`);
  }
  await ctx.close();
});

// ---------- Korrekturrunde 1 (.medaur/belege/klar-abnahme-1/QA.md N01–N08, Kritik C02–C10) ----------

test("N03: Schadenmeldung zeigt bei 200 ohne ok:true kein «Angekommen», sondern den Sendefehler", async () => {
  for (const body of ['{"ok":false}', "<html>Fallback</html>"]) {
    const { ctx, page } = await seite(390);
    await page.route("**/api/**", (r) => (r.request().method() === "GET" ? r.fulfill({ status: 200, body: "{}" }) : r.fulfill({ status: 200, body })));
    await page.goto(basis + "/schaden-melden/?art=hagel");
    await page.evaluate(() => { document.getElementById("schaden-form").dataset.endpunkt = "/api/schaden"; });
    await page.waitForSelector('[data-schritt="2"]:not([hidden])');
    await page.fill("#f-name", "Test");
    await page.fill("#f-tel", "071 755 88 61");
    await page.locator('[data-senden="website"]').click();
    await page.waitForFunction(() => /nicht geklappt/.test(document.querySelector("[data-sende-rueckmeldung]").textContent));
    assert.ok(await page.locator("[data-rapport]").isHidden(), `${body}: keine Bestätigung`);
    await ctx.close();
  }
  // Gegenprobe: 200 mit ok:true zeigt die Bestätigung
  const { ctx, page } = await seite(390);
  await page.route("**/api/**", (r) => (r.request().method() === "GET" ? r.fulfill({ status: 200, body: "{}" }) : r.fulfill({ status: 200, body: '{"ok":true}' })));
  await page.goto(basis + "/schaden-melden/?art=hagel");
  await page.evaluate(() => { document.getElementById("schaden-form").dataset.endpunkt = "/api/schaden"; });
  await page.waitForSelector('[data-schritt="2"]:not([hidden])');
  await page.fill("#f-name", "Test");
  await page.fill("#f-tel", "071 755 88 61");
  await page.locator('[data-senden="website"]').click();
  await page.waitForSelector("[data-rapport]:not([hidden])");
  assert.match(await page.locator("[data-r-stand]").textContent(), /Angekommen/);
  await ctx.close();
});

test("N04: «heute» im Fuss trägt nicht die Linkfarbe", async () => {
  for (const w of [390, 1440]) {
    const { ctx, page } = await seite(w, 900);
    await page.goto(basis + "/kontakt/");
    const farben = await page.$$eval(".fuss-woche__heute", (l) => l.map((e) => getComputedStyle(e).color));
    for (const c of farben) assert.notEqual(c, "rgb(21, 102, 184)", `${w}: «heute» nicht in Linkblau`);
    await ctx.close();
  }
});

test("N05: Datenschutz-Link fliesst im Hilfesatz mit (Inline, normale Zeilenhöhe)", async () => {
  for (const [s, sel] of [["/kontakt/", "form[data-rueckruf] .hilfe a.textlink"], ["/schaden-melden/?art=hagel", ".senden .hilfe a.textlink"]]) {
    const { ctx, page } = await seite(390);
    await page.goto(basis + s);
    await page.waitForSelector(sel);
    const r = await page.$eval(sel, (a) => ({ display: getComputedStyle(a).display, h: a.getBoundingClientRect().height, zeile: parseFloat(getComputedStyle(a.parentElement).lineHeight) || 24 }));
    assert.equal(r.display, "inline", `${s}: inline`);
    assert.ok(r.h <= r.zeile * 2 + 2, `${s}: Höhe ${r.h} höchstens zwei Textzeilen`);
    await ctx.close();
  }
});

test("N06: Vorschau-Plakette auch bei 1440 im Fluss nach dem Fuss, verdeckt nichts", async () => {
  for (const s of ["/", "/schaden-melden/", "/leistungen/", "/tesla/"]) {
    const { ctx, page } = await seite(1440, 900);
    await page.goto(basis + s);
    const r = await page.$eval("[data-vorschau]", (v) => [getComputedStyle(v).position, v.previousElementSibling && v.previousElementSibling.tagName]);
    assert.equal(r[0], "static", `${s}: nicht schwebend`);
    assert.equal(r[1], "FOOTER", `${s}: nach dem Fuss`);
    await ctx.close();
  }
});

test("N07: Einzelperson im Team – Name mittig neben dem Porträt (1440, 1024)", async () => {
  for (const w of [1440, 1024]) {
    const { ctx, page } = await seite(w, 900);
    await page.goto(basis + "/team/");
    const r = await page.$$eval('.leute--seite[data-anzahl="1"] figure', (l) => l.map((f) => {
      const bild = f.querySelector("img, .leute__leer").getBoundingClientRect(), text = f.querySelector("figcaption").getBoundingClientRect();
      return { neben: text.left >= bild.right, mitte: Math.abs((text.top + text.bottom) / 2 - (bild.top + bild.bottom) / 2) };
    }));
    for (const x of r) { assert.ok(x.neben, `${w}: Name neben dem Porträt`); assert.ok(x.mitte <= 4, `${w}: mittig (${x.mitte}px)`); }
    await ctx.close();
  }
});

test("C04: Kontakt bei 1440 × 900 – Telefon und Adresse ganz im ersten Bild; Team zeigt erste Porträts", async () => {
  const { ctx, page } = await seite(1440, 900);
  await page.goto(basis + "/kontakt/");
  const unten = await page.$$eval(".kontakt__karte", (l) => l.slice(0, 2).map((k) => k.getBoundingClientRect().bottom));
  for (const u of unten) assert.ok(u <= 900, `Karte endet bei ${u} ≤ 900`);
  await page.goto(basis + "/team/");
  const portrait = await page.$eval(".leute--seite figure img", (i) => i.getBoundingClientRect().top);
  assert.ok(portrait < 900, `Team: erstes Porträt beginnt bei ${portrait} im ersten Bild`);
  await ctx.close();
});

test("C05: Tesla 390 – Leiste erst nach dem Hero-Knopf, Leisten-Knopf mit Tesla-Vorauswahl", async () => {
  const { ctx, page } = await seite(390);
  await page.goto(basis + "/tesla/");
  await page.waitForFunction(() => document.body.classList.contains("leiste-spaeter"));
  assert.ok(!(await page.evaluate(() => document.body.classList.contains("leiste-an"))), "oben, Hero-Knopf sichtbar: Leiste aus");
  assert.equal(await page.getAttribute(".handyleiste a.knopf--akzent", "href"), "/schaden-melden/?fahrzeug=tesla");
  await page.evaluate(() => window.scrollTo(0, document.querySelector(".tesla-infos").offsetTop));
  await page.waitForFunction(() => document.body.classList.contains("leiste-an"));
  await ctx.close();
});

test("C06: Start-Hero – Chips sind genau die Schadenarten des Formulars, Tesla als eigener Link", async () => {
  const { ctx, page } = await seite(390);
  await page.goto(basis + "/schaden-melden/");
  const arten = await page.$$eval('input[name="art"]', (l) => l.map((i) => i.value));
  await page.goto(basis + "/");
  const chips = await page.$$eval(".schnell__liste a", (l) => l.map((a) => a.textContent.trim()));
  assert.deepEqual(chips, arten);
  assert.match(await page.textContent(".schnell__tesla a"), /Tesla\? Hier entlang/);
  assert.equal(await page.getAttribute(".schnell__tesla a", "href"), "/schaden-melden/?fahrzeug=tesla");
  assert.ok(await querfrei(page), "kein Querscrollen");
  await ctx.close();
});

test("C09: Tesla – Modelle als Liste (keine Knopf-Chips), am Computer zweispaltig ohne Leerblock vor den Fragen", async () => {
  const { ctx, page } = await seite(1440, 900);
  await page.goto(basis + "/tesla/");
  assert.equal(await page.locator(".modelle span").count(), 0, "keine Chips");
  assert.equal(await page.locator(".tesla__liste--modelle li").count(), 4);
  const r = await page.evaluate(() => {
    const spalten = [...document.querySelectorAll(".tesla-infos__zwei > div")].map((d) => d.getBoundingClientRect());
    const letzte = [...document.querySelectorAll(".tesla-infos .abschnitt__innen > *, .tesla-infos__zwei > div > *")].reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0);
    const faq = document.querySelector(".faq h2").getBoundingClientRect().top;
    return { nebeneinander: spalten.length === 2 && Math.abs(spalten[0].top - spalten[1].top) < 2 && spalten[1].left > spalten[0].right, luecke: faq - letzte };
  });
  assert.ok(r.nebeneinander, "Modelle und «Gut zu wissen» nebeneinander");
  assert.ok(r.luecke <= 200, `Abstand bis zu den Fragen ${r.luecke}px ≤ 200`);
  await ctx.close();
});

test("C10: Leistungsseiten – H1 bei 1440 höchstens 3 Zeilen", async () => {
  const { ctx, page } = await seite(1440, 900);
  for (const s of ["unfall-carrosserie", "hagel-dellen", "lack", "felgen", "folierung", "scheiben"]) {
    await page.goto(basis + `/leistungen/${s}/`);
    const zeilen = await page.$eval(".leistung-kopf h1", (h) => Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight)));
    assert.ok(zeilen <= 3, `${s}: ${zeilen} Zeilen`);
  }
  await ctx.close();
});

test("bewerten: noindex (Meta und _headers), nicht in der Sitemap-Liste", () => {
  const html = fs.readFileSync(path.join(dist, "bewerten", "index.html"), "utf8");
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(html, /rel="canonical"/, "kein canonical auf einer noindex-Seite");
  assert.match(fs.readFileSync(path.join(dist, "_headers"), "utf8"), /^\/bewerten\/\*\n\s+X-Robots-Tag: noindex/m);
});

// ===== Runde 3 (09.11.2026): C03, Zähler, N09–N11, B1–B3 =====
const lesen = (...t) => fs.readFileSync(path.join(dist, ...t), "utf8");

test("C03: Tesla-Zulassung ohne «Offene Frage»; die Lücke zum genauen Ablauf bleibt", () => {
  const html = lesen("tesla", "index.html");
  assert.doesNotMatch(html, /Offene Frage/, "keine «Offene Frage» auf der Tesla-Seite");
  assert.doesNotMatch(html, /Werkstattsuche/, "kein Vorbehalt zur Werkstattsuche");
  assert.match(html, /von Tesla als Carrosseriewerkstatt zugelassen/, "Zulassung als Tatsache");
  assert.match(html, /data-luecke>Entwurf: Den genauen Ablauf für Tesla bestätigt der Betrieb noch\./, "Ablauf bleibt offen");
});

test("B2: Tesla-Seite hat nur einen Abschluss-Aufruf (Fuss mit Tesla-Vorauswahl)", () => {
  const html = lesen("tesla", "index.html");
  assert.doesNotMatch(html, /class="abschluss"/, "kein eigener Abschluss-Block");
  const fuss = html.slice(html.indexOf('<footer class="fuss"'));
  assert.match(fuss, /href="\/schaden-melden\/\?fahrzeug=tesla"[^>]*>[\s\S]*?Tesla-Schaden melden<\/a>/, "Fuss führt mit Tesla-Vorauswahl ins Formular");
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  assert.equal((main.match(/Tesla-Schaden melden/g) || []).length, 1, "im Inhalt nur der Hero-Knopf");
  assert.match(lesen("index.html").slice(lesen("index.html").indexOf('<footer class="fuss"')), /href="\/schaden-melden\/"/, "andere Seiten: Fuss ohne Vorauswahl");
});

test("Zähler entfernt: kein zaehl.js, kein /api/zaehl, Cloudflare Web Analytics in CSP und Datenschutz", () => {
  const wurzel = fileURLToPath(new URL("../", import.meta.url));
  assert.ok(!fs.existsSync(path.join(dist, "js", "zaehl.js")), "dist/js/zaehl.js");
  assert.ok(!fs.existsSync(path.join(wurzel, "functions", "api", "zaehl.js")), "functions/api/zaehl.js");
  (function lauf(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) lauf(p); else if (p.endsWith(".html")) { const h = fs.readFileSync(p, "utf8"); assert.doesNotMatch(h, /zaehl\.js|data-zaehl|\/api\/zaehl/, p); } } })(dist);
  const kopf = lesen("_headers").match(/^\s+Content-Security-Policy: (.*)$/m)[1];
  assert.match(kopf, /script-src [^;]*https:\/\/static\.cloudflareinsights\.com/);
  assert.match(kopf, /connect-src [^;]*https:\/\/cloudflareinsights\.com/);
  const ds = lesen("datenschutz", "index.html");
  assert.match(ds, /Cloudflare Web Analytics/);
  assert.match(ds, /keine Cookies/);
  assert.doesNotMatch(ds, /Supabase|Zählpunkt/);
});

async function rueckrufMock(page, pfad) {
  await page.route("**/api/**", (r) => r.request().method() === "GET" ? r.fulfill({ status: 200, contentType: "application/json", body: "{}" }) : r.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
  await page.goto(basis + pfad);
  await page.evaluate(() => { document.querySelector("[data-rueckruf]").dataset.endpunkt = "/api/rueckruf"; });
}

test("N09: Rückruf – der Telefon-Fehlertext passt sich beim Tippen dem aktuellen Fehler an", async () => {
  const { ctx, page, fehler } = await seite(390);
  await rueckrufMock(page, "/kontakt/");
  const f = page.locator("[data-rueckruf]");
  await f.locator('button[type="submit"]').click();
  const tel = f.locator('input[name="telefon"]');
  await page.waitForSelector('[data-rueckruf] input[name="telefon"][aria-invalid="true"]');
  const text = () => tel.evaluate((e) => document.getElementById(e.id + "-fehler").textContent);
  assert.match(await text(), /Bitte geben Sie Ihre Telefonnummer an/);
  await tel.fill("079 12");
  assert.match(await text(), /mindestens 9 Ziffern/, "zu kurz: passender Text");
  await tel.fill("");
  assert.match(await text(), /Bitte geben Sie Ihre Telefonnummer an/, "wieder leer");
  await tel.fill("079 123 45 67");
  assert.equal(await tel.getAttribute("aria-invalid"), null);
  assert.deepEqual(fehler, []);
  await ctx.close();
});

test("B3: Rückruf-Erfolg ohne «Anliegen: Allgemein», gewähltes Thema natürlich im Satz", async () => {
  for (const [pfad, muster] of [["/kontakt/", /^Angekommen\. Wir rufen Sie zurück\.$/], ["/occasionen/", /^Angekommen\. Wir rufen Sie zum Thema «Occasion kaufen» zurück\.$/]]) {
    const { ctx, page } = await seite(390);
    await rueckrufMock(page, pfad);
    const f = page.locator("[data-rueckruf]");
    await f.locator('input[name="name"]').fill("Testperson QA");
    await f.locator('input[name="telefon"]').fill("079 000 00 00");
    await f.locator('button[type="submit"]').click();
    await page.waitForSelector("[data-rueckruf] .rueckmeldung--ok");
    const t = (await f.locator("[data-rueckmeldung]").textContent()).trim();
    assert.match(t, muster, `${pfad}: ${t}`);
    assert.doesNotMatch(t, /Anliegen:/);
    await ctx.close();
  }
});

test("N10: Schadenmeldung bei 1440 – Fehlerkasten so breit wie der Senden-Knopf", async () => {
  const { ctx, page } = await seite(1440, 900);
  await page.route("**/api/**", (r) => (r.request().method() === "GET" ? r.fulfill({ status: 200, body: "{}" }) : r.fulfill({ status: 500, body: "{}" })));
  await page.goto(basis + "/schaden-melden/?art=hagel");
  await page.evaluate(() => { document.getElementById("schaden-form").dataset.endpunkt = "/api/schaden"; });
  await page.waitForSelector('[data-schritt="2"]:not([hidden])');
  await page.fill("#f-name", "Test");
  await page.fill("#f-tel", "071 755 88 61");
  await page.locator('[data-senden="website"]').click();
  await page.waitForFunction(() => /nicht geklappt/.test(document.querySelector("[data-sende-rueckmeldung]").textContent));
  const [m, k] = await page.evaluate(() => [document.querySelector("[data-sende-rueckmeldung]"), document.querySelector('[data-senden="website"]')].map((e) => { const b = e.getBoundingClientRect(); return [b.left, b.right]; }));
  assert.ok(Math.abs(m[0] - k[0]) <= 1 && Math.abs(m[1] - k[1]) <= 1, `Kasten ${m} / Knopf ${k}`);
  await ctx.close();
});

test("N11: Tesla bei 390 – Abstand vor «Gut zu wissen» mindestens 32 px", async () => {
  const { ctx, page } = await seite(390);
  await page.goto(basis + "/tesla/");
  const abstand = await page.evaluate(() => {
    const [a, b] = document.querySelectorAll(".tesla-infos__zwei > div");
    const ende = [...a.children].reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0);
    return b.querySelector("h2").getBoundingClientRect().top - ende;
  });
  assert.ok(abstand >= 32, `Abstand ${abstand}px`);
  await ctx.close();
});

test("Umwelt: Abschnitt auf Startseite und /leistungen/, Lücke sichtbar solange keine Punkte", async () => {
  const { umwelt } = await import("../src/daten/umwelt.ts").catch(() => ({ umwelt: null }));
  const leer = !umwelt || umwelt.punkte.length === 0;
  for (const pfad of ["/", "/leistungen/"]) {
    const { ctx, page, fehler } = await seite(390);
    await page.goto(basis + pfad);
    const teil = page.locator("section#umwelt");
    assert.equal(await teil.count(), 1, `${pfad}: Abschnitt da`);
    assert.match(await teil.locator("h2").textContent(), /Umwelt/);
    if (leer) {
      const l = teil.locator("[data-luecke]");
      assert.ok(await l.isVisible(), `${pfad}: Lücke sichtbar`);
      assert.match(await l.textContent(), /Was Auto Speedy für die Umwelt macht, ergänzt der Betrieb/);
      assert.equal(await teil.locator(".umwelt__liste li").count(), 0, `${pfad}: keine erfundenen Punkte`);
    }
    const ld = await page.$$eval('script[type="application/ld+json"]', (l) => l.map((s) => s.textContent).join(""));
    assert.doesNotMatch(ld, /Umwelt/i, `${pfad}: kein JSON-LD-Claim`);
    assert.deepEqual(fehler, []);
    await ctx.close();
  }
});
