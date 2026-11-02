#!/usr/bin/env node
/* Maschinelle Prüfungen einer Vorschau (design-uni DP6, DP5 maschinell; text-uni TP7).
   Allgemein: Alles Projektbezogene steht in projekt.json (Vorlage: ../eingabe/projekt.beispiel.json).

   Aufruf:  node pruefen.cjs <projekt.json> [--selbsttest] [--json <ausgabe.json>]
   --selbsttest  prüft eine Kopie mit eingebauten Fehlern; das Werkzeug gilt nur als brauchbar, wenn es alle findet.

   Was fehlt in projekt.json, wird übersprungen und als «nicht geprüft» gemeldet, nie als bestanden. */
"use strict";
const { chromium } = require("playwright");
const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");

const args = process.argv.slice(2);
const PROJEKTDATEI = args.find((a) => a.endsWith(".json") && args[args.indexOf(a) - 1] !== "--json");
if (!PROJEKTDATEI) { console.error("Aufruf: node pruefen.cjs <projekt.json> [--selbsttest] [--json aus.json]"); process.exit(2); }
const SELBST = args.includes("--selbsttest");
const JSONPFAD = args.includes("--json") ? args[args.indexOf("--json") + 1] : null;
const P = JSON.parse(fs.readFileSync(PROJEKTDATEI, "utf8"));
const BASISORDNER = path.dirname(path.resolve(PROJEKTDATEI));
const WURZEL = path.resolve(BASISORDNER, P.site || "site");
const SEITEN = P.seiten || fs.readdirSync(WURZEL).filter((f) => f.endsWith(".html")).map((f) => f.replace(/\.html$/, ""));
const OHNE_KONTAKT = new Set(P.seitenOhneKontakt || ["404", "impressum", "datenschutz"]);
const TEL = (P.telefon || []).map((t) => t.replace(/\D/g, "")); // national, z. B. 0717558861
const VORWAHL = P.landesvorwahl || "+41";

const erg = [];
const r = (id, ok, detail) => erg.push({ id, ok: ok === null ? null : !!ok, detail });
const nichtGeprueft = (id, grund) => erg.push({ id, ok: null, detail: `nicht geprüft: ${grund}` });
const warte = (ms) => new Promise((res) => setTimeout(res, ms));

function server(dir) {
  const typen = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".webp": "image/webp", ".avif": "image/avif", ".txt": "text/plain" };
  const s = http.createServer((q, res) => {
    let f = path.join(dir, decodeURIComponent(q.url.split("?")[0]));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": typen[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((ok) => s.listen(0, () => ok(s)));
}

/* Kontrast: Text gegen den tatsächlichen Grund aus der Kaskade (DL24) */
const kontrastSkript = () => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(",").map((x) => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const mix = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const aufBild = (el) => { for (let e = el; e; e = e.parentElement) { const bi = getComputedStyle(e).backgroundImage; if (bi && bi !== "none") return true; } return false; };
  const grund = (el) => { const ebenen = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { ebenen.push(c); if (c.a === 1) break; } } let b = { r: 255, g: 255, b: 255, a: 1 }; for (let i = ebenen.length - 1; i >= 0; i--) b = mix(ebenen[i], b); return b; };
  const fehler = []; const ueberBild = []; let geprueft = 0;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const n = w.currentNode; if (!n.textContent.trim()) continue;
    const el = n.parentElement; const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || el.closest("[hidden]") || el.closest(".sr, .sr-only, .visually-hidden")) continue;
    const rect = el.getBoundingClientRect(); if (rect.width === 0 || rect.height === 0) continue;
    if (aufBild(el)) { ueberBild.push(n.textContent.trim().slice(0, 30)); continue; }
    const fg = parse(cs.color); const bg = grund(el); const fgm = mix(fg, bg);
    const l1 = lum(fgm), l2 = lum(bg); const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const px = parseFloat(cs.fontSize), fett = parseInt(cs.fontWeight, 10) >= 700;
    const soll = px >= 24 || (px >= 18.66 && fett) ? 3 : 4.5; geprueft++;
    if (ratio < soll) fehler.push(`${el.tagName.toLowerCase()}.${el.className}: ${ratio.toFixed(2)} < ${soll} «${n.textContent.trim().slice(0, 30)}»`);
  }
  return { geprueft, fehler, ueberBild };
};

const sichtbarerText = (page) => page.evaluate(() => { const t = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const e = w.currentNode.parentElement; const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden" || e.closest("[hidden]") || e.closest("script,style")) continue; t.push(w.currentNode.textContent); } return t.join(" ").replace(/\s+/g, " "); });
const enthaeltTelefon = (text) => { const ziffern = text.replace(/\D/g, ""); return TEL.length === 0 || TEL.some((t) => ziffern.includes(t)); };

async function pruefe(base) {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const HA = P.hauptaktion || null;

  for (const [vname, vp, mobil] of [["1440", { width: 1440, height: 900 }, false], ["390", { width: 390, height: 844 }, true]]) {
    const ctx = await b.newContext({ viewport: vp, isMobile: mobil, hasTouch: mobil, reducedMotion: "reduce" });
    const fremd = new Set();
    ctx.on("request", (rq) => { const u = new URL(rq.url()); if (u.origin !== new URL(base).origin && u.protocol.startsWith("http")) fremd.add(u.origin); });
    const p = await ctx.newPage();
    const tel = [], zaehl = [], kontr = [], verd = [], ueberlauf = [], cta = [], textUeberBild = [];
    for (const s of SEITEN) {
      await p.goto(`${base}/${s}.html`, { waitUntil: "load" });
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((x) => setTimeout(x, 30)); } scrollTo(0, 0); });
      // Telefon: international, ohne (0), Text zeigt dieselbe Nummer, im ersten Bildschirm
      const links = await p.$$eval('a[href^="tel:"]', (as) => as.map((a) => ({ href: a.getAttribute("href"), text: a.textContent.replace(/\D/g, "") })));
      const muster = new RegExp(`^tel:\\${VORWAHL}[1-9]\\d{8}$`);
      for (const l of links) {
        if (!muster.test(l.href)) { tel.push(`${s}: ${l.href}`); continue; }
        const national = "0" + l.href.slice(4 + VORWAHL.length);
        if (l.text && !l.text.endsWith(national.slice(1))) tel.push(`${s}: Text ${l.text} ≠ ${l.href}`);
        if (TEL.length && !TEL.includes(national)) tel.push(`${s}: ${national} steht nicht in projekt.json`);
      }
      if (TEL.length && !OHNE_KONTAKT.has(s)) {
        const sichtTel = await p.$$eval('a[href^="tel:"]', (as) => as.some((a) => { const q = a.getBoundingClientRect(); return q.width > 0 && q.top >= 0 && q.bottom <= innerHeight && getComputedStyle(a).visibility !== "hidden"; }));
        if (!sichtTel && !(P.telefonImMenueReicht && mobil)) tel.push(`${s}: kein tel-Link im ersten Bildschirm`);
      }
      // Zählpunkte
      const ohne = await p.$$eval('a[href^="tel:"], a[href^="mailto:"], a[href*="maps"]', (as) => as.filter((a) => !a.hasAttribute("data-zaehl") || !a.hasAttribute("data-ort")).map((a) => a.getAttribute("href")));
      ohne.forEach((h) => zaehl.push(`${s}: ${h}`));
      // Hauptaktion fest sichtbar, auch nach dem Scrollen
      if (HA && HA.selektor && HA.fest && !(HA.ausnahmen || ["404"]).includes(s)) {
        await p.evaluate(() => scrollTo(0, 1200));
        const c = await p.$eval(HA.selektor, (a) => { const q = a.getBoundingClientRect(); return { sichtbar: q.width >= 44 && q.height >= 44 && q.top >= 0 && q.bottom <= innerHeight && q.right <= innerWidth && q.left >= 0, w: Math.round(q.width), h: Math.round(q.height) }; }).catch(() => ({ sichtbar: false, fehlt: true }));
        if (!c.sichtbar) cta.push(`${s}: ${JSON.stringify(c)}`);
        await p.evaluate(() => scrollTo(0, 0));
      }
      const k = await p.evaluate(kontrastSkript);
      if (k.fehler.length) kontr.push(`${s}: ${k.fehler.slice(0, 3).join("; ")}`);
      if (k.ueberBild.length) textUeberBild.push(`${s}: ${k.ueberBild.length}`);
      // Verdeckung: Mitte und Ecken jedes Knopfs und Felds nach dem Scrollen
      const knopfSel = P.knopfSelektor || "a.knopf, button, input:not([type=radio]):not([type=checkbox]):not([type=hidden]), textarea, select";
      const v = await p.evaluate(async (sel) => { const bad = []; for (const e of document.querySelectorAll(sel)) { if (!(e.offsetWidth || e.offsetHeight) || e.closest("[hidden]")) continue; e.scrollIntoView({ block: "center" }); await new Promise((x) => setTimeout(x, 10)); const q = e.getBoundingClientRect(); for (const [x, y] of [[q.left + q.width / 2, q.top + q.height / 2], [q.left + 3, q.top + 3], [q.right - 3, q.bottom - 3]]) { const t = document.elementFromPoint(x, y); if (!t || !(e === t || e.contains(t) || t.contains(e))) { bad.push(e.className || e.id || e.tagName); break; } } } scrollTo(0, 0); return bad; }, knopfSel);
      v.forEach((x) => verd.push(`${s}: ${x}`));
      const ue = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ue > 0) ueberlauf.push(`${s}: ${ue}px`);
    }
    if (TEL.length) r(`DP6 Telefon-Links ${vname}`, tel.length === 0, tel.join(" | ") || "alle tel-Links international, Text gleich Ziel, Nummer aus projekt.json, im ersten Bildschirm");
    else nichtGeprueft(`DP6 Telefon-Links ${vname}`, "keine Nummer in projekt.json");
    r(`DP6 Zählpunkte ${vname}`, zaehl.length === 0, zaehl.join(" | ") || "100 % der tel-, mailto- und Karten-Links tragen data-zaehl und data-ort");
    if (HA && HA.fest) r(`DP6 Hauptaktion fest sichtbar ${vname}`, cta.length === 0, cta.join(" | ") || `«${HA.text || HA.selektor}» auf allen Seiten nach dem Scrollen, ≥ 44 px`);
    r(`DP6 Kontrast aus der Kaskade ${vname}`, kontr.length === 0, (kontr.join(" | ") || "alle sichtbaren Texte erreichen 4,5:1 (gross 3:1)") + (textUeberBild.length ? ` · Text über Bild nicht gemessen (von Auge prüfen): ${textUeberBild.join(", ")}` : ""));
    r(`DP6 Verdeckung ${vname}`, verd.length === 0, verd.join(" | ") || "0 Knöpfe und Felder verdeckt");
    r(`DP6 Kein Überlauf ${vname}`, ueberlauf.length === 0, ueberlauf.join(" | ") || "kein horizontales Scrollen");
    r(`DP6 Boden: nichts von fremden Hosts ${vname}`, fremd.size === 0, [...fremd].join(", ") || "alle Anfragen gleiche Herkunft");
    const ck = await ctx.cookies(); const ls = await p.evaluate(() => localStorage.length + sessionStorage.length);
    r(`DP6 Boden: keine Cookies, nichts im Speicher ${vname}`, ck.length === 0 && ls === 0, `Cookies ${ck.length}, Speichereinträge ${ls}`);
    await ctx.close();
  }

  { const ctx = await b.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const bad = [];
    for (const s of SEITEN) { await p.goto(`${base}/${s}.html`); const ue = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ue > 0) bad.push(`${s}: ${ue}px`); }
    r("DP6 Kein Überlauf 360 px", bad.length === 0, bad.join(" | ") || `${SEITEN.length} Seiten`); await ctx.close(); }

  // Formular
  const F = P.formular;
  if (F && F.seite && F.selektor) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage();
    await p.goto(`${base}/${F.seite}`, { waitUntil: "load" });
    const sel = `${F.selektor} input:not([type=hidden]):not([type=radio]):not([type=checkbox]), ${F.selektor} textarea, ${F.selektor} select`;
    const felder = await p.$$eval(sel, (es) => es.filter((e) => e.offsetWidth || e.offsetHeight).length);
    const ohneLabel = await p.$$eval(sel, (es) => es.filter((e) => (e.offsetWidth || e.offsetHeight) && !(e.id && document.querySelector(`label[for="${e.id}"]`)) && !e.closest("label")).map((e) => e.name || e.id));
    const platzhalter = await p.$$eval(`${F.selektor} [placeholder]`, (es) => es.length);
    const vorgekreuzt = await p.$$eval(`${F.selektor} input[type=checkbox]:checked`, (es) => es.length);
    const pflicht = await p.$$eval(`${F.selektor} [required]`, (es) => es.length);
    const [fmin, fmax] = F.felder || [3, 5];
    r(`DP6 Formular: sichtbare Felder ${fmin} bis ${fmax}`, felder >= fmin && felder <= fmax, `${felder} Felder; Pflicht ${pflicht}`);
    if (F.pflicht != null) r(`DP6 Formular: Pflichtfelder ${F.pflicht}`, pflicht === F.pflicht, `${pflicht}`);
    r("DP6 Formular: Beschriftung an jedem Feld, 0 Platzhalter, nichts vorangekreuzt", ohneLabel.length === 0 && platzhalter === 0 && vorgekreuzt === 0, `ohne Label ${ohneLabel.join(",") || 0}, Platzhalter ${platzhalter}, vorangekreuzt ${vorgekreuzt}`);
    if (F.verantwortlich) { const t = await sichtbarerText(p); r("DP6 Formular: Verantwortlicher am Knopf genannt", t.includes(F.verantwortlich), F.verantwortlich); }
    const tf = await p.$(`${F.selektor} input[type=tel]`); r("LH8 Telefonfeld öffnet die Zifferntastatur", !!tf || !(F.fuellen && Object.values(F.fuellen).some((v) => /^0\d/.test(v))), tf ? "type=tel" : "kein Feld type=tel");
    if (F.senden) {
      const vor = await p.$eval(F.senden, (e) => e.getBoundingClientRect().top + scrollY);
      await p.click(F.senden); await warte(150);
      const nach = await p.$eval(F.senden, (e) => e.getBoundingClientRect().top + scrollY);
      const meldungen = await p.$$eval(`${F.selektor} [aria-invalid=true], ${F.selektor} :invalid`, (es) => es.length);
      r("DP6 Leeres Senden: Fehler am Feld, Senden-Knopf bleibt stehen", meldungen > 0 && Math.abs(vor - nach) < 1, `${meldungen} Felder markiert, Verschiebung ${Math.abs(vor - nach).toFixed(0)} px`);
      if (F.fuellen && F.bestaetigung) {
        for (const [s, v] of Object.entries(F.fuellen)) await p.fill(s, v);
        await p.evaluate(() => { window.open = () => null; }); // mailto und neue Fenster nicht öffnen
        const t0 = Date.now();
        await Promise.all([p.click(F.senden), p.waitForSelector(F.bestaetigung, { timeout: 2000 })]).catch(() => {});
        const dt = Date.now() - t0; const da = await p.$(F.bestaetigung); const gesperrt = await p.$eval(F.senden, (e) => e.disabled || e.getAttribute("aria-disabled") === "true").catch(() => true);
        r("DP6 Rückmeldung ≤ 300 ms, doppeltes Senden gesperrt", !!da && dt <= 300 && gesperrt, `${da ? dt + " ms" : "keine Bestätigung"} (inkl. Klick), Knopf gesperrt: ${gesperrt}`);
      } else nichtGeprueft("DP6 Rückmeldung ≤ 300 ms", "formular.fuellen oder formular.bestaetigung fehlt");
    }
    await ctx.close();
  } else nichtGeprueft("DP6 Formular", "kein formular in projekt.json");

  // Kalender: Zustand nach simuliertem Datum, Gerät in fremder Zeitzone
  const K = P.kalender;
  if (K && K.selektor && K.faelle && K.faelle.length) {
    const bad = [];
    for (const [name, zeit, erwartet] of K.faelle) {
      const ctx = await b.newContext({ timezoneId: "America/New_York" }); const p = await ctx.newPage();
      await p.clock.install({ time: new Date(zeit) }); await p.goto(`${base}/${K.seite || "index.html"}`);
      const t = (await p.$eval(K.selektor, (e) => e.textContent).catch(() => "")).replace(/\u00a0/g, " ").replace(/\s+/g, " ");
      if (!new RegExp(erwartet).test(t) || /\bmorgen\b/.test(t)) bad.push(`${name}: «${t.trim()}»`);
      await ctx.close();
    }
    r(`DP6 Kalender (${K.faelle.map((f) => f[0]).join(", ")}; Gerät in anderer Zeitzone)`, bad.length === 0, bad.join(" | ") || `${K.faelle.length} Fälle richtig; nie «morgen»`);
  } else nichtGeprueft("DP6 Kalender", "kein kalender in projekt.json (nur nötig, wenn die Seite Zustände nach Uhrzeit zeigt)");

  // Ohne JavaScript, Reduced Motion, Bewegung nach 3 s
  { const ctx = await b.newContext({ javaScriptEnabled: false }); const p = await ctx.newPage(); const bad = [];
    for (const s of SEITEN) { await p.goto(`${base}/${s}.html`); const t = await sichtbarerText(p); if (!OHNE_KONTAKT.has(s) && !enthaeltTelefon(t)) bad.push(s); if (t.length < 80) bad.push(`${s}: fast leer`); }
    r("DP6 Boden: ohne JavaScript ist der Inhalt da (Text, Telefon)", bad.length === 0, bad.join(", ") || `${SEITEN.length} Seiten`); await ctx.close(); }
  { const ctx = await b.newContext({ reducedMotion: "reduce" }); const p = await ctx.newPage(); await p.goto(`${base}/index.html`); await warte(500); const n = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
    r("DP5 Reduced Motion: keine laufende Animation", n === 0, `${n} laufend`); await ctx.close(); }
  { const ctx = await b.newContext({ reducedMotion: "no-preference" }); const p = await ctx.newPage(); await p.goto(`${base}/index.html`); await warte(3200);
    const n = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && a.effect && a.effect.getTiming().iterations !== Infinity).length);
    const endlos = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && a.effect && a.effect.getTiming().iterations === Infinity).length);
    const pause = await p.$('[data-pause], button[aria-label*="ause" i]');
    r("DP5 Nach 3 s laufen 0 Animationen (endlose nur mit Pause-Knopf)", n === 0 && (endlos === 0 || !!pause), `${n} laufend, ${endlos} endlos, Pause-Knopf: ${!!pause}`); await ctx.close(); }

  await b.close();
}

/* ---------- Text und Technik aus den HTML-Dateien (T7) ---------- */
function textPruefung(ordner) {
  const html = (s) => fs.readFileSync(path.join(ordner, s + ".html"), "utf8");
  const vis = (h) => h.replace(/<(script|style|svg|head)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
  const ohneZitat = (h) => h.replace(/<blockquote[\s\S]*?<\/blockquote>/g, " ");
  const T = P.text || {};
  const bad = { sz: [], anrede: [], gerade: [], strich: [], uhr: [], klammer: [], tel: [], h: [], img: [], satz: [], titel: [], noindex: [], canon: [] };
  let wortSumme = 0, saetze = 0, maxSatz = 0, maxWo = "";
  for (const s of SEITEN) {
    const h = html(s), t = vis(h), tb = vis(ohneZitat(h));
    if (T.eszett === false && /ß/.test(t)) bad.sz.push(s);
    if (T.anrede === "Sie" && /\b(du|dein|deine|deinen|dir|dich)\b/i.test(tb)) bad.anrede.push(s);
    if (T.anrede === "du" && /\b(Sie|Ihr|Ihre|Ihnen)\b/.test(tb.replace(/(^|[.!?»]\s+)(Sie|Ihr|Ihre)\b/g, ""))) bad.anrede.push(s);
    if (T.guillemets !== false && (/[^=]"[A-Za-zÄÖÜäöü]/.test(t) || /[„“”]/.test(t))) bad.gerade.push(s);
    if (T.gedankenstriche === false && (/[–—]/.test(t) || / - /.test(t))) bad.strich.push(s);
    if (T.uhrzeitMitPunkt !== false && (/\b\d{1,2}:\d{2}\b/.test(t) || /\d\s?(am|pm)\b/i.test(t))) bad.uhr.push(s);
    if (/\[[^\]]*\]/.test(t)) bad.klammer.push(s);
    if (/\+41|0041|\(0\)/.test(t)) bad.tel.push(s);
    const ueb = [...h.matchAll(/<h([1-6])[ >]/g)].map((m) => +m[1]); for (let i = 1; i < ueb.length; i++) if (ueb[i] - ueb[i - 1] > 1) bad.h.push(`${s}: h${ueb[i - 1]}→h${ueb[i]}`);
    if (ueb.filter((x) => x === 1).length !== 1) bad.h.push(`${s}: h1 ≠ 1`);
    for (const m of h.matchAll(/<img\b[^>]*>/g)) { if (!/ alt="[^"]*"/.test(m[0]) || !/ width="\d+"/.test(m[0]) || !/ height="\d+"/.test(m[0])) bad.img.push(`${s}: ${m[0].slice(0, 60)}`); }
    const ti = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || ""; const de = (h.match(/name="description" content="([^"]*)"/) || [])[1] || "";
    if (ti.length < 40 || ti.length > 60 || de.length < 110 || de.length > 155) bad.titel.push(`${s}: Titel ${ti.length}, Beschreibung ${de.length}`);
    if (P.vorschau !== false && !/name="robots" content="noindex/.test(h)) bad.noindex.push(s);
    if (P.vorschau !== false && /rel="canonical"/.test(h)) bad.canon.push(s);
    const hauptM = h.match(/<main[\s\S]*?<\/main>/); const haupt = hauptM ? ohneZitat(hauptM[0]) : "";
    const absaetze = [...haupt.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<br\s*\/?>/g, ". "));
    const fliess = vis(absaetze.join(" . ")).replace(/\b(Nr|ca|z\. B|bzw|inkl|evtl)\./g, "$1");
    for (const satz of fliess.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ«])/)) { const w = satz.trim().split(/\s+/).filter((x) => /\p{L}|\d/u.test(x)).length; if (w < 2) continue; wortSumme += w; saetze++; if (w > maxSatz) { maxSatz = w; maxWo = `${s}: ${satz.slice(0, 80)}`; } if (w > 25) bad.satz.push(`${s}: ${w} Wörter «${satz.slice(0, 50)}»`); }
  }
  if (T.eszett === false) r("TP7/CH1 Eszett 0", bad.sz.length === 0, bad.sz.join(", ") || "0");
  if (T.anrede) r(`TP7/CH4 Eine Anrede (nur «${T.anrede}»)`, bad.anrede.length === 0, bad.anrede.join(", ") || "0");
  if (T.guillemets !== false) r("TP7/CH5 Guillemets, keine geraden oder deutschen Anführungszeichen", bad.gerade.length === 0, bad.gerade.join(", ") || "0");
  if (T.gedankenstriche === false) r("TP7/K11 Keine Gedankenstriche im sichtbaren Text", bad.strich.length === 0, bad.strich.join(", ") || "0");
  if (T.uhrzeitMitPunkt !== false) r("TP7/CH11 Uhrzeit mit Punkt", bad.uhr.length === 0, bad.uhr.join(", ") || "0");
  r("TP7/CH12 Telefon national sichtbar, kein +41 im Text", bad.tel.length === 0, bad.tel.join(", ") || "0");
  r("DP6 Klammern: keine eckigen Klammern im sichtbaren Text", bad.klammer.length === 0, bad.klammer.join(", ") || "0");
  r("TP7/S15 Genau ein h1, keine Sprünge in der Gliederung", bad.h.length === 0, bad.h.join(" | ") || "0");
  r("TP7/S20 Bilder mit Alt-Attribut und Mass", bad.img.length === 0, bad.img.join(" | ") || "alle Bilder");
  r("TP7/S1 Titel 40 bis 60, Beschreibung 110 bis 155 Zeichen", bad.titel.length === 0, bad.titel.join(" | ") || `${SEITEN.length} Seiten`);
  if (P.vorschau !== false) r("TP7/TI9 Vorschau: noindex, kein canonical", bad.noindex.length === 0 && bad.canon.length === 0, [...bad.noindex, ...bad.canon].join(", ") || `${SEITEN.length} Seiten`);
  if (saetze) {
    r("TP3/W1 Sätze im Fliesstext im Mittel ≤ 15 Wörter", wortSumme / saetze <= 15, `${(wortSumme / saetze).toFixed(1)} im Mittel über ${saetze} Sätze; längster ${maxSatz} (${maxWo})`);
    r("TP3/W2 Kein Satz über 25 Wörter", bad.satz.length === 0, bad.satz.join(" | ") || `längster ${maxSatz}`);
  }
  const rob = path.join(ordner, "robots.txt");
  if (P.vorschau !== false) r("TP7/TI3 Vorschau: robots.txt sperrt alles, keine Sitemap", fs.existsSync(rob) && /Disallow: \/\s*$/m.test(fs.readFileSync(rob, "utf8")) && !fs.existsSync(path.join(ordner, "sitemap.xml")), fs.existsSync(rob) ? fs.readFileSync(rob, "utf8").trim().replace(/\n/g, " | ") : "robots.txt fehlt");
  const tot = []; for (const s of SEITEN) { for (const m of html(s).matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) { const u = m[1]; if (/^(https?:|mailto:|tel:|\/\/|data:)/.test(u)) continue; if (!fs.existsSync(path.join(ordner, u.replace(/^\//, "")))) tot.push(`${s}: ${u}`); } }
  r("TP7/TI17 Keine toten internen Links oder Bilder", tot.length === 0, tot.join(" | ") || "0");
  // Strukturierte Daten: Typ, Telefon und Strasse gleich der sichtbaren Seite, keine eigene Bewertung
  if (P.jsonld && P.jsonld.typ) {
    const ld = html("index").match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/); let ok = false, d = "fehlt";
    try { const j = JSON.parse(ld[1]); const sicht = vis(html("index")); const telOk = !TEL.length || (j.telephone || "").replace(/\D/g, "").endsWith(TEL[0].slice(1)); ok = j["@type"] === P.jsonld.typ && telOk && (!j.address || sicht.includes(j.address.streetAddress)) && !("aggregateRating" in j) && !("review" in j); d = `${j["@type"]}, ${j.telephone}, ${"aggregateRating" in j ? "mit" : "ohne"} Bewertung`; } catch (e) { d = "ungültig oder fehlt"; }
    r("TP7/S23 LocalBusiness gültig, gleich der sichtbaren Seite, ohne eigene Bewertung", ok, d);
  }
  // Faktenabgleich: jede mehrstellige Zahl im sichtbaren Text steht in projekt.json → zahlen (mit Quelle)
  if (P.zahlen) {
    const erlaubt = Object.keys(P.zahlen).concat(P.telefon || []);
    const unbek = new Set();
    for (const s of SEITEN) { const t = vis(html(s)); for (const m of t.matchAll(/\d[\d.,'’]*\d|\d/g)) { const z = m[0]; if (/^\d{1,2}$/.test(z) || /^0\d{2}$/.test(z)) continue; /* ein- und zweistellig, Vorwahlen */ if (!erlaubt.some((k) => k === z || k.includes(z))) unbek.add(`${s}: ${z}`); } }
    r("T7 Faktenabgleich: jede Zahl (ab 3 Stellen) steht mit Quelle in projekt.json", unbek.size === 0, [...unbek].slice(0, 30).join(" | ") || "alle belegt");
  } else nichtGeprueft("T7 Faktenabgleich", "keine zahlen in projekt.json");
}

/* ---------- Selbsttest: allgemeine eingebaute Fehler ---------- */
function baueFehlerEin(tmp) {
  const eingebaut = [];
  const seiten = SEITEN.filter((s) => s !== "404");
  const lies = (s) => fs.readFileSync(path.join(tmp, s + ".html"), "utf8"), schreib = (s, h) => fs.writeFileSync(path.join(tmp, s + ".html"), h);
  // 1 kaputter tel-Link
  const sTel = seiten.find((s) => /href="tel:\+/.test(lies(s)));
  if (sTel) { schreib(sTel, lies(sTel).replace(/href="tel:\+(\d+)"/, 'href="tel:0$1"')); eingebaut.push("DP6 Telefon-Links 1440"); }
  // 2 Kontrast: erster Absatz in main hellgrau auf dem Grund
  const sK = seiten[0]; schreib(sK, lies(sK).replace("</head>", '<style>main p { color: #c8c8c8 !important; }</style></head>')); eingebaut.push("DP6 Kontrast aus der Kaskade 1440");
  // 3 Gedankenstrich und Klammer im ersten Absatz einer zweiten Seite
  const sT = seiten[1] || seiten[0]; schreib(sT, lies(sT).replace(/(<main[\s\S]*?<p\b[^>]*>)/, "$1Muster – [Platzhalter] ")); eingebaut.push("DP6 Klammern: keine eckigen Klammern im sichtbaren Text");
  if (P.text && P.text.gedankenstriche === false) eingebaut.push("TP7/K11 Keine Gedankenstriche im sichtbaren Text");
  // 4 Hauptaktion auf einer Seite entfernen
  if (P.hauptaktion && P.hauptaktion.fest && P.hauptaktion.href) {
    const sH = seiten[seiten.length - 1]; const re = new RegExp(`<a\\b[^>]*href="${P.hauptaktion.href.replace(/[.?*+^$()[\]{}|\\]/g, "\\$&")}"[^>]*>[\\s\\S]*?<\\/a>`, "g");
    schreib(sH, lies(sH).replace(re, "")); eingebaut.push("DP6 Hauptaktion fest sichtbar 1440");
  }
  // 5 Bild ohne Mass
  schreib(sK, lies(sK).replace(/<\/main>/, '<img src="fehlt-absichtlich.jpg" alt=""></main>')); eingebaut.push("TP7/S20 Bilder mit Alt-Attribut und Mass");
  return eingebaut;
}

(async () => {
  let ordner = WURZEL, tmp, soll = [];
  if (SELBST) { tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pruefen-selbst-")); fs.cpSync(WURZEL, tmp, { recursive: true }); soll = baueFehlerEin(tmp); ordner = tmp; }
  const srv = await server(ordner);
  try { await pruefe(`http://localhost:${srv.address().port}`); textPruefung(ordner); } finally { srv.close(); }
  if (SELBST) {
    console.log("SELBSTTEST, eingebaute Fehler:");
    let alle = true;
    for (const id of soll) { const f = erg.find((x) => x.id === id && x.ok === false); alle = alle && !!f; console.log(`  ${f ? "OK   " : "FEHLT"} ${id}`); }
    console.log(alle ? "Selbsttest bestanden: Das Werkzeug findet alle eingebauten Fehler." : "Selbsttest NICHT bestanden: zuerst das Werkzeug reparieren.");
    fs.rmSync(tmp, { recursive: true, force: true }); process.exit(alle ? 0 : 1);
  }
  for (const x of erg) console.log(`${x.ok === null ? "OFFEN " : x.ok ? "OK    " : "FEHLER"} ${x.id}\n         ${String(x.detail).slice(0, 400)}`);
  const falsch = erg.filter((x) => x.ok === false).length, offen = erg.filter((x) => x.ok === null).length;
  console.log(`\n${erg.length} Prüfungen, ${falsch} Fehler, ${offen} nicht geprüft`);
  if (JSONPFAD) fs.writeFileSync(JSONPFAD, JSON.stringify({ datum: new Date().toISOString().slice(0, 10), ergebnisse: erg }, null, 2));
  process.exit(falsch ? 1 : 0);
})();
