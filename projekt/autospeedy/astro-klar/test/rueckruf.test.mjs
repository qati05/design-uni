// Browser-Test der Rückruf-Bitte (Linie Klar) gegen die ECHTE Funktion functions/api/rueckruf.js: ohne Cockpit, ohne
// Datenbank, Mailversand nur als Attrappe (env.EMAIL.send), kein Netzaufruf nach aussen. Server auf dist/ mit der CSP aus
// _headers; der Formular-Endpunkt wird beim Ausliefern auf /api/rueckruf gesetzt (wie im Bau mit FORMULAR_ENDPUNKT).
// Vorher: npm run build. Läuft in `npm test` über den Import in formular.test.mjs.
import { describe, test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { onRequestGet, onRequestPost } from "../functions/api/rueckruf.js";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const typen = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon" };

describe("Rückruf direkt per Mail (POST /api/rueckruf)", () => {
  let server, basis, browser, csp, alteFetch;
  const mails = [];
  const aufrufe = [];
  let modus = "echt"; // "echt" | "ok-falsch" (200 ohne ok:true) | "kaputt" (502)

  before(async () => {
    csp = fs.readFileSync(path.join(dist, "_headers"), "utf8").match(/^\s+Content-Security-Policy: (.*)$/m)[1];
    alteFetch = globalThis.fetch;
    globalThis.fetch = async (u) => { throw new Error("Netzaufruf im Test: " + u); }; // die Funktion darf ohne Mail-Adresse nichts holen
    server = http.createServer(async (req, res) => {
      const url = new URL(req.url, basis);
      if (url.pathname === "/api/rueckruf") {
        const teile = []; for await (const s of req) teile.push(s);
        const anfrage = new Request(url, { method: req.method, headers: req.headers, body: req.method === "POST" ? Buffer.concat(teile) : undefined });
        aufrufe.push(req.method);
        const env = { SCHADEN_AN: "info@autospeedy.ch", MAIL_ABSENDER: "formular@autospeedy.ch", ERLAUBTE_HERKUNFT: basis, FORMULAR_HMAC: "test-schluessel", EMAIL: { send: async (m) => { mails.push(m); } } };
        let r;
        if (req.method === "POST" && modus === "ok-falsch") r = new Response(JSON.stringify({ ok: false }), { status: 200 });
        else if (req.method === "POST" && modus === "kaputt") r = new Response(JSON.stringify({ ok: false, fehler: ["senden"] }), { status: 502 });
        else r = req.method === "GET" ? await onRequestGet({ request: anfrage, env }) : await onRequestPost({ request: anfrage, env });
        res.writeHead(r.status, Object.fromEntries(r.headers)); return res.end(Buffer.from(await r.arrayBuffer()));
      }
      let p = decodeURIComponent(url.pathname);
      if (p.endsWith("/")) p += "index.html";
      const datei = path.join(dist, p);
      if (!datei.startsWith(dist) || !fs.existsSync(datei)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "Content-Type": typen[path.extname(datei)] || "application/octet-stream", "Content-Security-Policy": csp });
      if (datei.endsWith(".html")) {
        // Bau ohne Server lässt den Endpunkt leer; hier wie im Bau mit FORMULAR_ENDPUNKT=/api/schaden setzen
        return res.end(fs.readFileSync(datei, "utf8").replace(/(<form[^>]*data-rueckruf[^>]*?)data-endpunkt(="[^"]*")?/g, '$1data-endpunkt="/api/rueckruf"'));
      }
      fs.createReadStream(datei).pipe(res);
    });
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    basis = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : { channel: "chrome" });
  });
  after(async () => { globalThis.fetch = alteFetch; await browser?.close(); server?.close(); });
  beforeEach(() => { mails.length = 0; aufrufe.length = 0; modus = "echt"; });

  async function seite(pfad) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const fehler = [];
    page.on("console", (m) => { if (m.type() === "error" && !/status of (404|422|502)/.test(m.text())) fehler.push(m.text()); });
    page.on("pageerror", (e) => fehler.push(String(e)));
    await page.goto(basis + pfad);
    return { ctx, page, fehler, form: page.locator("form[data-rueckruf]").first() };
  }
  const klartext = (m) => (m.raw.match(/\r\n\r\n([A-Za-z0-9+/=]+)\r\n/g) || []).map((s) => Buffer.from(s.trim(), "base64").toString("utf8")).join("\n");

  test("Kontakt, Zeitfalle an, sofort gesendet: automatischer Neuversand, «Angekommen» erst nach Server-OK, genau 1 Mail", async () => {
    const { ctx, page, fehler, form } = await seite("/kontakt/");
    assert.equal(await form.getAttribute("data-endpunkt"), "/api/rueckruf");
    assert.match(await form.getAttribute("action"), /^mailto:/, "Rückfall ohne JavaScript bleibt");
    await form.getByLabel("Name (Pflicht)").fill("Test Person");
    await form.getByLabel("Telefon (Pflicht)").fill("071 755 88 61");
    await form.getByLabel("Ihre Nachricht (freiwillig)").fill("Delle an der Tür");
    await form.getByRole("checkbox", { name: "Dienstag Vormittag" }).check({ force: true });
    await form.getByRole("button", { name: "Rückruf anfordern" }).click();
    const meldung = form.locator("[data-rueckmeldung]");
    await page.waitForFunction(() => /Angekommen/.test(document.querySelector("form[data-rueckruf] [data-rueckmeldung]").textContent), null, { timeout: 15000 });
    assert.match(await meldung.textContent(), /Dienstag Vormittag/);
    assert.equal(mails.length, 1, "genau eine Mail an den Betrieb");
    assert.equal(mails[0].to, "info@autospeedy.ch");
    const t = klartext(mails[0]);
    assert.match(t, /Anliegen: Allgemein/); assert.match(t, /Name: Test Person/); assert.match(t, /Wann anrufen: Dienstag Vormittag/);
    assert.match(t, /Nachricht: Delle an der Tür/); assert.match(t, /Formular: kontakt/);
    assert.ok(aufrufe.filter((x) => x === "POST").length >= 2, "erst «zu schnell», dann Neuversand");
    assert.ok(await form.getByRole("button", { name: "Rückruf anfordern" }).isDisabled());
    assert.deepEqual(fehler, []);
    await ctx.close();
  });

  test("Occasionen: gewähltes Anliegen geht mit", async () => {
    const { ctx, page, form } = await seite("/occasionen/");
    await form.getByRole("radio", { name: "Mein Auto verkaufen" }).check({ force: true });
    await form.getByLabel("Name (Pflicht)").fill("Test Person");
    await form.getByLabel("Telefon (Pflicht)").fill("+41 71 755 88 61");
    await page.waitForTimeout(4200); // nach der Zeitfalle: ohne Neuversand
    await form.getByRole("button", { name: "Rückruf anfordern" }).click();
    await page.waitForFunction(() => /Angekommen/.test(document.querySelector("form[data-rueckruf] [data-rueckmeldung]").textContent), null, { timeout: 10000 });
    assert.equal(mails.length, 1); assert.match(klartext(mails[0]), /Anliegen: Mein Auto verkaufen/);
    await ctx.close();
  });

  test("Telefon zu kurz: Hinweis am Formular, nichts gesendet", async () => {
    const { ctx, form } = await seite("/kontakt/");
    await form.getByLabel("Name (Pflicht)").fill("Test");
    await form.getByLabel("Telefon (Pflicht)").fill("079 12");
    await form.getByRole("button", { name: "Rückruf anfordern" }).click();
    assert.match(await form.locator("[data-rueckmeldung]").textContent(), /mindestens 9 Ziffern/);
    assert.equal(aufrufe.filter((x) => x === "POST").length, 0); assert.equal(mails.length, 0);
    await ctx.close();
  });

  test("N02/C08: Pflichtfelder mit aria-invalid, Text am Feld und role=alert; Fehler verschwindet bei gültiger Eingabe", async () => {
    const { ctx, page, form } = await seite("/kontakt/");
    const tel = form.getByLabel("Telefon (Pflicht)"), name = form.getByLabel("Name (Pflicht)");
    await form.getByRole("button", { name: "Rückruf anfordern" }).click();
    assert.equal(await name.getAttribute("aria-invalid"), "true");
    assert.equal(await tel.getAttribute("aria-invalid"), "true");
    const beschr = await tel.getAttribute("aria-describedby");
    assert.ok(beschr && /Telefonnummer/.test(await page.locator("#" + beschr.split(" ").pop()).textContent()), "Text am Feld per aria-describedby");
    assert.equal(await form.locator("[data-rueckmeldung]").getAttribute("role"), "alert");
    assert.ok(await form.locator("[data-rueckmeldung]").evaluate((e) => e.classList.contains("rueckmeldung--fehler")), "Fehler-Aussehen");
    assert.equal(await page.evaluate(() => document.activeElement.name), "name", "Fokus aufs erste Fehlerfeld");
    await name.fill("Test");
    assert.equal(await name.getAttribute("aria-invalid"), null, "Name gültig: Fehler weg");
    await tel.fill("079 12");
    assert.equal(await tel.getAttribute("aria-invalid"), "true", "noch zu kurz: Fehler bleibt");
    await tel.fill("079 123 45 67");
    assert.equal(await tel.getAttribute("aria-invalid"), null, "gültig: Feldfehler weg");
    assert.equal(await form.locator(".feld-fehler").count(), 0, "kein Fehlertext mehr");
    assert.ok(await form.locator("[data-rueckmeldung]").isHidden(), "Sammelhinweis weg");
    await ctx.close();
  });

  test("N01/N02: Beim Senden aria-busy, nach Erfolg Fokus auf der Rückmeldung (nicht BODY), Erfolg sieht anders aus als Fehler", async () => {
    const { ctx, page, form } = await seite("/kontakt/");
    await form.getByLabel("Name (Pflicht)").fill("Test");
    await form.getByLabel("Telefon (Pflicht)").fill("071 755 88 61");
    const knopf = form.getByRole("button", { name: "Rückruf anfordern" });
    await knopf.click();
    await page.waitForFunction(() => document.querySelector("form[data-rueckruf] button[type=submit]").getAttribute("aria-busy") === "true");
    assert.ok(await knopf.isEnabled(), "während des Sendens bleibt der Knopf fokussierbar");
    await page.waitForFunction(() => /Angekommen/.test(document.querySelector("form[data-rueckruf] [data-rueckmeldung]").textContent), null, { timeout: 15000 });
    const r = await page.evaluate(() => { const m = document.querySelector("form[data-rueckruf] [data-rueckmeldung]"); return { fokus: document.activeElement === m, tag: document.activeElement.tagName, ok: m.classList.contains("rueckmeldung--ok"), bg: getComputedStyle(m).backgroundColor, busy: document.querySelector("form[data-rueckruf] button[type=submit]").getAttribute("aria-busy") }; });
    assert.ok(r.fokus, `Fokus auf der Rückmeldung (ist ${r.tag})`);
    assert.ok(r.ok, "Erfolgs-Klasse");
    assert.notEqual(r.bg, "rgb(253, 236, 234)", "nicht wie der Fehler");
    assert.equal(r.busy, null);
    await ctx.close();
  });

  for (const [m, wie] of [["ok-falsch", "200 ohne ok:true"], ["kaputt", "502"]]) {
    test(`Server antwortet ${wie}: kein «Angekommen», Hinweis mit Telefonnummer, Knopf bleibt aktiv`, async () => {
      modus = m;
      const { ctx, page, form } = await seite("/kontakt/");
      await form.getByLabel("Name (Pflicht)").fill("Test");
      await form.getByLabel("Telefon (Pflicht)").fill("071 755 88 61");
      await form.getByRole("button", { name: "Rückruf anfordern" }).click();
      await page.waitForFunction(() => /nicht geklappt/.test(document.querySelector("form[data-rueckruf] [data-rueckmeldung]").textContent), null, { timeout: 10000 });
      assert.doesNotMatch(await form.locator("[data-rueckmeldung]").textContent(), /Angekommen/);
      assert.ok(await form.getByRole("button", { name: "Rückruf anfordern" }).isEnabled());
      // N02: Sendefehler als role=alert, Nummer klickbar, Fokus bleibt auf dem Knopf
      assert.equal(await form.locator("[data-rueckmeldung]").getAttribute("role"), "alert");
      assert.equal(await form.locator('[data-rueckmeldung] a[href^="tel:"]').textContent(), "071 755 88 61");
      assert.equal(await page.evaluate(() => document.activeElement.type), "submit");
      await ctx.close();
    });
  }
});
