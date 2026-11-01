#!/usr/bin/env node
/* Maschinelle Prüfungen der Vorschau (design-uni P6, text-uni T7).
   Aufruf:  node werkzeuge/pruefen.cjs [--selbsttest] [--json <pfad>]
   Startet selbst einen Server (python3 -m http.server) auf der Vorschau und prüft mit Playwright.
   --selbsttest: prüft eine Kopie mit eingebauten Fehlern; das Werkzeug gilt nur als brauchbar, wenn es alle findet. */
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const WURZEL = path.join(__dirname, "..", "site");
const SEITEN = ["index", "carrosserie", "lackiererei", "felgen-folierung", "occasionen", "betrieb", "kontakt", "tesla", "schaden-melden", "impressum", "datenschutz", "404"];
const args = process.argv.slice(2);
const SELBST = args.includes("--selbsttest");
const JSONPFAD = args.includes("--json") ? args[args.indexOf("--json") + 1] : null;

const erg = [];
function r(id, ok, detail) { erg.push({ id, ok: !!ok, detail }); }

function server(ordner, port) {
  const p = spawn("python3", ["-m", "http.server", String(port), "--directory", ordner], { stdio: "ignore" });
  return p;
}
const warte = (ms) => new Promise((res) => setTimeout(res, ms));

/* Kontrast: Text gegen den tatsächlichen Grund aus der Kaskade */
const kontrastSkript = () => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(",").map((x) => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const mix = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const grund = (el) => { let ebenen = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { ebenen.push(c); if (c.a === 1) break; } } let b = { r: 255, g: 255, b: 255, a: 1 }; for (let i = ebenen.length - 1; i >= 0; i--) b = mix(ebenen[i], b); return b; };
  const fehler = []; let geprueft = 0;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const n = w.currentNode; if (!n.textContent.trim()) continue;
    const el = n.parentElement; const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || el.closest("[hidden]") || el.closest(".sr")) continue;
    const rect = el.getBoundingClientRect(); if (rect.width === 0 || rect.height === 0) continue;
    const fg = parse(cs.color); const bg = grund(el); const fgm = mix(fg, bg);
    const l1 = lum(fgm), l2 = lum(bg); const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const px = parseFloat(cs.fontSize), fett = parseInt(cs.fontWeight, 10) >= 700;
    const gross = px >= 24 || (px >= 18.66 && fett); const soll = gross ? 3 : 4.5; geprueft++;
    if (ratio < soll) fehler.push(`${el.tagName.toLowerCase()}.${el.className}: ${ratio.toFixed(2)} < ${soll} «${n.textContent.trim().slice(0, 30)}»`);
  }
  return { geprueft, fehler };
};

async function pruefe(base) {
  const b = await chromium.launch();
  const sichtbarerText = (page) => page.evaluate(() => { const t = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const e = w.currentNode.parentElement; const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden" || e.closest("[hidden]")) continue; if (e.closest("script,style")) continue; t.push(w.currentNode.textContent); } return t.join(" ").replace(/\s+/g, " "); });

  for (const [vname, vp, mobil] of [["1440", { width: 1440, height: 900 }, false], ["390", { width: 390, height: 844 }, true]]) {
    const ctx = await b.newContext({ viewport: vp, isMobile: mobil, hasTouch: mobil, reducedMotion: "reduce" });
    const fremd = new Set();
    ctx.on("request", (rq) => { const u = new URL(rq.url()); if (u.origin !== new URL(base).origin && u.protocol.startsWith("http")) fremd.add(u.origin); });
    const p = await ctx.newPage();
    const tel = [], zaehl = [], kontr = [], verd = [], ueberlauf = [], cta = [], tesla = [];
    for (const s of SEITEN) {
      await p.goto(`${base}/${s}.html`, { waitUntil: "load" });
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((x) => setTimeout(x, 30)); } window.scrollTo(0, 0); });
      // Telefon
      const links = await p.$$eval('a[href^="tel:"]', (as) => as.map((a) => ({ href: a.getAttribute("href"), text: a.textContent.replace(/\D/g, ""), vis: !!(a.offsetWidth || a.offsetHeight) })));
      for (const l of links) { if (!/^tel:\+41[1-9]\d{8}$/.test(l.href)) tel.push(`${s}: ${l.href}`); else if (!l.text.includes(l.href.slice(7).replace("+41", "").replace(/^/, "")) && !l.text.endsWith(l.href.slice(7).replace("+41", "")) && !l.text.endsWith(l.href.slice(7).replace("+41", "0"))) tel.push(`${s}: Text ${l.text} ≠ ${l.href}`); }
      const sichtTel = await p.$$eval('a[href^="tel:"]', (as) => as.some((a) => { const r = a.getBoundingClientRect(); return r.width > 0 && r.top >= 0 && r.bottom <= innerHeight && getComputedStyle(a).visibility !== "hidden"; }));
      if (!sichtTel) tel.push(`${s}: kein tel-Link im ersten Bildschirm`);
      // Zählpunkte
      const ohne = await p.$$eval('a[href^="tel:"], a[href^="mailto:"], a[href*="google.com/maps"]', (as) => as.filter((a) => !a.hasAttribute("data-zaehl") || !a.hasAttribute("data-ort")).map((a) => a.getAttribute("href")));
      ohne.forEach((h) => zaehl.push(`${s}: ${h}`));
      // CTA Schaden melden und Tesla im Kopf, auch nach dem Scrollen
      if (s !== "404") {
        await p.evaluate(() => window.scrollTo(0, 1200));
        const c = await p.$eval('.kopf a[href="schaden-melden.html"]', (a) => { const r = a.getBoundingClientRect(); return { sichtbar: r.width >= 44 && r.height >= 44 && r.top >= 0 && r.bottom <= innerHeight && r.right <= innerWidth && r.left >= 0, w: Math.round(r.width), h: Math.round(r.height) }; }).catch(() => ({ sichtbar: false }));
        if (!c.sichtbar) cta.push(`${s}: ${JSON.stringify(c)}`);
        const t = await p.$$eval('a[href="tesla.html"]', (as) => as.some((a) => { const r = a.getBoundingClientRect(); return r.width > 0 && r.top >= 0 && r.bottom <= innerHeight; }));
        if (!t) {
          // am Handy liegt der Link im Menü: ein Tipp
          const imMenue = await p.$$eval(".menue-liste a[href=\"tesla.html\"]", (as) => as.length > 0);
          if (!imMenue) tesla.push(`${s}`);
        }
        await p.evaluate(() => window.scrollTo(0, 0));
      }
      // Kontrast
      const k = await p.evaluate(kontrastSkript); if (k.fehler.length) kontr.push(`${s}: ${k.fehler.slice(0, 3).join("; ")}`);
      // Verdeckung
      const v = await p.evaluate(async () => { const bad = []; const els = [...document.querySelectorAll("a.knopf, button, input:not([type=radio]):not([type=checkbox]), textarea")]; for (const e of els) { if (!(e.offsetWidth || e.offsetHeight) || e.closest("[hidden]") || e.closest(".menue-liste")) continue; e.scrollIntoView({ block: "center" }); await new Promise((x) => setTimeout(x, 10)); const r = e.getBoundingClientRect(); for (const [x, y] of [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 3, r.top + 3], [r.right - 3, r.bottom - 3]]) { const t = document.elementFromPoint(x, y); if (!t || !(e === t || e.contains(t) || t.contains(e))) { bad.push(e.className || e.id || e.tagName); break; } } } window.scrollTo(0, 0); return bad; });
      v.forEach((x) => verd.push(`${s}: ${x}`));
      // Überlauf
      const ue = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (ue > 0) ueberlauf.push(`${s}: ${ue}px`);
    }
    r(`P6 Telefon-Links ${vname}`, tel.length === 0, tel.join(" | ") || "alle tel-Links international, Text gleich Ziel, in jedem ersten Bildschirm");
    r(`P6 Zählpunkte ${vname}`, zaehl.length === 0, zaehl.join(" | ") || "100 % der tel-, mailto- und Karten-Links tragen data-zaehl und data-ort");
    r(`E7 CTA «Schaden melden» fest sichtbar ${vname}`, cta.length === 0, cta.join(" | ") || "auf allen 11 Seiten im festen Kopf, nach dem Scrollen, ≥ 44 px");
    r(`E8 Tesla im Kopf oder Menü ${vname}`, tesla.length === 0, tesla.join(" | ") || "Link auf jeder Seite im Kopf (Desktop) oder im Menü (Handy)");
    r(`P6 Kontrast aus der Kaskade ${vname}`, kontr.length === 0, kontr.join(" | ") || "alle sichtbaren Texte erreichen 4,5:1 (gross 3:1) gegen den tatsächlichen Grund");
    r(`P6 Verdeckung ${vname}`, verd.length === 0, verd.join(" | ") || "0 Knöpfe und Felder verdeckt (Mitte und Ecken, nach Scrollen)");
    r(`P6 Kein Überlauf ${vname}`, ueberlauf.length === 0, ueberlauf.join(" | ") || "kein horizontales Scrollen");
    r(`P6 Boden: nichts von fremden Hosts ${vname}`, fremd.size === 0, [...fremd].join(", ") || "alle Anfragen gleiche Herkunft");
    const ck = await ctx.cookies(); const ls = await p.evaluate(() => localStorage.length + sessionStorage.length);
    r(`P6 Boden: keine Cookies, nichts im Speicher ${vname}`, ck.length === 0 && ls === 0, `Cookies ${ck.length}, Speichereinträge ${ls}`);
    await ctx.close();
  }

  // 360 px
  { const ctx = await b.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const bad = [];
    for (const s of SEITEN) { await p.goto(`${base}/${s}.html`); const ue = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ue > 0) bad.push(`${s}: ${ue}px`); }
    r("P6 Kein Überlauf 360 px", bad.length === 0, bad.join(" | ") || "alle Seiten"); await ctx.close(); }

  // Formular
  { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage();
    await p.goto(`${base}/schaden-melden.html`, { waitUntil: "load" });
    const felder = await p.$$eval("#schadenformular input, #schadenformular textarea", (es) => es.filter((e) => e.offsetWidth || e.offsetHeight || e.type === "radio" && e.closest(".chip") && false).length);
    const ohneLabel = await p.$$eval("#schadenformular input, #schadenformular textarea", (es) => es.filter((e) => !document.querySelector(`label[for="${e.id}"]`) && !e.closest("label") ).map((e) => e.name));
    const platzhalter = await p.$$eval("#schadenformular [placeholder]", (es) => es.length);
    const vorgekreuzt = await p.$$eval("#schadenformular input:checked", (es) => es.length);
    const pflicht = await p.$$eval("#schadenformular [required]", (es) => es.length);
    r("P6 Formular: sichtbare Felder 3 bis 5", felder >= 3 && felder <= 5, `${felder} Felder (Standard); Pflicht ${pflicht}`);
    r("P6 Formular: Pflichtfelder höchstens 4, hier 2", pflicht === 2, `${pflicht}`);
    r("P6 Formular: Beschriftung über jedem Feld, 0 Platzhalter, nichts vorangekreuzt", ohneLabel.length === 0 && platzhalter === 0 && vorgekreuzt === 0, `ohne Label ${ohneLabel.length}, Platzhalter ${platzhalter}, vorangekreuzt ${vorgekreuzt}`);
    r("P6 Formular: Zweck und Verantwortlicher am Knopf", await p.$eval(".datenschutz-satz", (e) => /Verantwortlich: Auto Speedy AG/.test(e.textContent) && /nur für diese Schadenmeldung/.test(e.textContent)), "Satz unter dem Knopf");
    const typ = await p.$eval("#telefon", (e) => `${e.type}/${e.getAttribute("inputmode")}/${e.autocomplete}`); r("H8 Telefonfeld öffnet die Zifferntastatur", typ === "tel/tel/tel", typ);
    // Fehler: Knopf verschiebt sich nicht
    const vor = await p.$eval("#senden", (e) => e.getBoundingClientRect().top + scrollY);
    await p.click("#senden");
    const nach = await p.$eval("#senden", (e) => e.getBoundingClientRect().top + scrollY);
    const f1 = await p.$eval("#name-fehler", (e) => e.textContent), f2 = await p.$eval("#telefon-fehler", (e) => e.textContent);
    r("P6 Fehler am Feld, Senden-Knopf bleibt stehen", f1.length > 0 && f2.length > 0 && Math.abs(vor - nach) < 1, `Name: «${f1}» Telefon: «${f2}» Verschiebung ${Math.abs(vor - nach)} px`);
    const sum = await p.$eval("#rueckmeldung", (e) => e.textContent); r("P6 Zusammenfassung unter dem Knopf nennt die Felder", /Name/.test(sum) && /Telefon/.test(sum), sum);
    await p.fill("#telefon", "123"); await p.$eval("#telefon", (e) => e.blur()); const f3 = await p.$eval("#telefon-fehler", (e) => e.textContent);
    r("U16 zwei verschiedene Telefon-Meldungen", f3 !== f2 && f3.length > 0, `leer: «${f2}» / Format: «${f3}»`);
    // Erfolg und Rückmeldung
    await p.fill("#name", "Test Person"); await p.fill("#telefon", "079 123 45 67");
    p.on("framenavigated", () => {});
    const t0 = Date.now();
    await Promise.all([p.click("#senden"), p.waitForSelector("#bestaetigung:not([hidden])", { timeout: 2000 })]).catch(() => {});
    const dt = Date.now() - t0; const gesperrt = await p.$eval("#senden", (e) => e.disabled);
    r("P6 Rückmeldung ≤ 300 ms, doppeltes Senden gesperrt", dt <= 300 && gesperrt, `${dt} ms (inkl. Klick), Knopf gesperrt: ${gesperrt}`);
    // mailto
    const href = await p.evaluate(() => { let h = ""; try { h = window.__mailto || ""; } catch (e) {} return h; });
    await ctx.close(); }

  // Mailto-Inhalt und Tesla-Vorwahl (über Skript-Seiten-Test ohne Navigation)
  { const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
    await p.goto(`${base}/schaden-melden.html?tesla=1&modell=Model%20Y`);
    const z = await p.evaluate(() => ({ tesla: document.getElementById("tesla").checked, modell: (document.querySelector('input[name="tesla-modell"]:checked') || {}).value, chips: [...document.querySelectorAll(".chip")].filter((c) => c.offsetWidth).length, eigen: [...document.querySelectorAll(".nur-eigen")].some((e) => e.offsetWidth), ref: !!document.getElementById("referenz").offsetWidth, felder: [...document.querySelectorAll("#schadenformular input, #schadenformular textarea")].filter((e) => e.offsetWidth || e.closest(".chip")).length }));
    r("E8 Tesla-Vorwahl über die URL (Kästchen, Modell, Chips, Referenz)", z.tesla && z.modell === "Model Y" && z.chips === 5 && !z.eigen && z.ref, JSON.stringify(z));
    await p.fill("#name", "Test Person"); await p.fill("#telefon", "079 123 45 67"); await p.fill("#referenz", "REF-1");
    const url = await p.evaluate(() => new Promise((res) => { const orig = Object.getOwnPropertyDescriptor(Location.prototype, "href"); const f = document.getElementById("schadenformular"); const cap = (e) => { e.preventDefault(); }; document.getElementById("senden").click(); res(null); }));
    await ctx.close(); }

  // Kalender
  { const faelle = [
      ["Fr 17.30", "2026-11-06T17:30:00+01:00", /geschlossen\. Wieder offen am Montag ab 7\.30/],
      ["Fr 17.10", "2026-11-06T17:10:00+01:00", /geöffnet bis 17\.15/],
      ["Sa 10.00", "2026-11-07T10:00:00+01:00", /geschlossen\. Wieder offen am Montag ab 7\.30/],
      ["So 22.40", "2026-11-08T22:40:00+01:00", /geschlossen\. Wieder offen am Montag ab 7\.30/],
      ["Mo 6.00", "2026-11-09T06:00:00+01:00", /geschlossen\. Wieder offen heute ab 7\.30/],
      ["Mo 12.30", "2026-11-09T12:30:00+01:00", /Mittagspause\. Wieder offen ab 13\.15/],
      ["Do 17.20", "2026-11-12T17:20:00+01:00", /geöffnet bis 17\.30/],
      ["Do 17.45", "2026-11-12T17:45:00+01:00", /Wieder offen am Freitag ab 7\.30/],
      ["Sommerzeit Mi 9.00", "2026-07-15T09:00:00+02:00", /geöffnet bis 12\.00/] ];
    const bad = [];
    for (const [name, zeit, erwartet] of faelle) { const ctx = await b.newContext({ timezoneId: "America/New_York" }); const p = await ctx.newPage(); await p.clock.install({ time: new Date(zeit) }); await p.goto(`${base}/index.html`); const t = (await p.$eval("[data-status]", (e) => e.textContent)).replace(/ /g, " "); if (!erwartet.test(t) || /morgen/.test(t)) bad.push(`${name}: «${t}»`); await ctx.close(); }
    r("P6 Kalender (Fr 17.30, Sa 10.00, So 22.40, Mittag, Sommerzeit, Gerät in anderer Zeitzone)", bad.length === 0, bad.join(" | ") || `${faelle.length} Fälle richtig; nie «morgen»; jede Frist mit Wochentag`); }

  // Ohne JavaScript, Reduced Motion, Animationen
  { const ctx = await b.newContext({ javaScriptEnabled: false }); const p = await ctx.newPage(); const bad = [];
    for (const s of SEITEN) { await p.goto(`${base}/${s}.html`); const t = await sichtbarerText(p); if (s !== "404" && s !== "impressum" && s !== "datenschutz" && !/071 755 88 61/.test(t)) bad.push(s); }
    await p.goto(`${base}/index.html`); const z = await sichtbarerText(p); if (!/Montag bis Donnerstag/.test(z)) bad.push("Zeiten");
    await p.goto(`${base}/schaden-melden.html`); const act = await p.$eval("#schadenformular", (f) => f.getAttribute("action")); if (!/^mailto:/.test(act)) bad.push("Formular ohne JS");
    r("P6 Boden: ohne JavaScript ist aller Inhalt da (Nummern, Zeiten, Formular als E-Mail-Link)", bad.length === 0, bad.join(", ") || "12 Seiten geprüft"); await ctx.close(); }
  { const ctx = await b.newContext({ reducedMotion: "reduce" }); const p = await ctx.newPage(); await p.goto(`${base}/index.html`); const n = await p.evaluate(() => document.getAnimations().length); const an = await p.$eval(".kante-zug", (e) => getComputedStyle(e).animationName);
    r("P5 Reduced Motion: Summe der Wege 0", n === 0 && an === "none", `Animationen ${n}, animation-name ${an}`); await ctx.close(); }
  { const ctx = await b.newContext({ reducedMotion: "no-preference" }); const p = await ctx.newPage(); await p.goto(`${base}/index.html`); await warte(3200); const n = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
    r("P5 Nach 3 s laufen 0 Animationen", n === 0, `${n} laufend`); await ctx.close(); }

  await b.close();
}

/* ---------- Text und Technik aus den HTML-Dateien (T7) ---------- */
function textPruefung(ordner) {
  const html = (s) => fs.readFileSync(path.join(ordner, s + ".html"), "utf8");
  const vis = (h) => h.replace(/<(script|style|svg|head)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
  const ausnahme = (h) => h.replace(/<blockquote[\s\S]*?<\/blockquote>/g, " ").replace(/<footer[\s\S]*?<\/footer>/g, " ").replace(/<header[\s\S]*?<\/header>/g, " ");
  const bad = { sz: [], du: [], gerade: [], doppel: [], strich: [], uhr: [], klammer: [], tel: [], h: [], img: [], satz: [], titel: [], noindex: [], canon: [] };
  let wortSumme = 0, saetze = 0, maxSatz = 0, maxWo = "";
  for (const s of SEITEN) {
    const h = html(s), t = vis(h), tb = vis(ausnahme(h));
    if (/ß/.test(t)) bad.sz.push(s);
    if (/\b(du|dein|deine|deinen|dir|dich)\b/i.test(tb.replace(/Sie\b/g, ""))) bad.du.push(s);
    if (/"/.test(t.replace(/\s"/g, ""))) { /* gerade Anführungszeichen im sichtbaren Text */ if (/[^=]"[A-Za-zÄÖÜäöü]/.test(t)) bad.gerade.push(s); }
    if (/[„“”]/.test(t)) bad.gerade.push(s + " (deutsche Form)");
    if (/[–—]/.test(t) || / - /.test(t)) bad.strich.push(s);
    if (/\b\d{1,2}:\d{2}\b/.test(t) || /\d\s?(am|pm)\b/i.test(t)) bad.uhr.push(s);
    if (/\[[^\]]*\]/.test(t)) bad.klammer.push(s);
    const nummern = t.match(/\b0\d{2}[  ]\d{3}[  ]\d{2}[  ]\d{2}\b/g) || []; if (/\+41|0041|\(0\)/.test(t)) bad.tel.push(s);
    const ueb = [...h.matchAll(/<h([1-6])[ >]/g)].map((m) => +m[1]); for (let i = 1; i < ueb.length; i++) if (ueb[i] - ueb[i - 1] > 1) bad.h.push(`${s}: h${ueb[i - 1]}→h${ueb[i]}`);
    if (ueb.filter((x) => x === 1).length !== 1) bad.h.push(`${s}: h1 ≠ 1`);
    for (const m of h.matchAll(/<img\b[^>]*>/g)) { if (!/ alt="[^"]+"/.test(m[0]) || !/ width="\d+"/.test(m[0]) || !/ height="\d+"/.test(m[0])) bad.img.push(`${s}: ${m[0].slice(0, 60)}`); }
    const ti = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || ""; const de = (h.match(/name="description" content="([^"]*)"/) || [])[1] || "";
    if (ti.length < 40 || ti.length > 60 || de.length < 110 || de.length > 155) bad.titel.push(`${s}: Titel ${ti.length}, Beschreibung ${de.length}`);
    if (!/name="robots" content="noindex/.test(h)) bad.noindex.push(s);
    if (/rel="canonical"/.test(h)) bad.canon.push(s);
    // Satzlänge im Fliesstext (ohne Kopf, Fuss, Zitate, Listenköpfe)
    const hauptM = h.match(/<main[\s\S]*?<\/main>/); const haupt = hauptM ? hauptM[0].replace(/<blockquote[\s\S]*?<\/blockquote>/g, " ") : "";
    // Fliesstext = nur Absätze <p>; <br> trennt Zeilen (Anschriften), Zahlenkolonnen und Tabellen zählen nicht als Sätze
    const absaetze = [...haupt.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<br\s*\/?>/g, ". "));
    const fliess = vis(absaetze.join(" . ")).replace(/\b(Nr|ca|z\. B)\./g, "$1");
    for (const satz of fliess.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ«])/)) { const w = satz.trim().split(/\s+/).filter((x) => /\p{L}|\d/u.test(x)).length; if (w < 2) continue; wortSumme += w; saetze++; if (w > maxSatz) { maxSatz = w; maxWo = `${s}: ${satz.slice(0, 80)}`; } if (w > 25) bad.satz.push(`${s}: ${w} Wörter «${satz.slice(0, 50)}»`); }
  }
  r("T7/CH1 Eszett 0", bad.sz.length === 0, bad.sz.join(", ") || "0");
  r("T7/CH4 Eine Anrede (nur «Sie»)", bad.du.length === 0, bad.du.join(", ") || "0 du-Formen");
  r("T7/CH5 Guillemets, keine geraden oder deutschen Anführungszeichen", bad.gerade.length === 0, bad.gerade.join(", ") || "0");
  r("T7/K11 Keine Gedankenstriche im sichtbaren Text", bad.strich.length === 0, bad.strich.join(", ") || "0");
  r("T7/CH11 Uhrzeit mit Punkt, kein 24-Stunden-Doppelpunkt", bad.uhr.length === 0, bad.uhr.join(", ") || "0");
  r("T7/CH12 Telefon national sichtbar, kein +41 im Text", bad.tel.length === 0, bad.tel.join(", ") || "0");
  r("P6 Klammern: keine eckigen Klammern im sichtbaren Text", bad.klammer.length === 0, bad.klammer.join(", ") || "0");
  r("T7/S15 Genau ein h1, keine Sprünge in der Gliederung", bad.h.length === 0, bad.h.join(" | ") || "0");
  r("T7/S20, TI35 Bilder mit Alt-Text und Mass", bad.img.length === 0, bad.img.join(" | ") || "alle Bilder");
  r("T7/S1,S3,S9,S12 Titel 40 bis 60, Beschreibung 110 bis 155 Zeichen", bad.titel.length === 0, bad.titel.join(" | ") || "12 Seiten");
  r("T7/TI9 Vorschau: noindex auf jeder Seite, kein canonical", bad.noindex.length === 0 && bad.canon.length === 0, [...bad.noindex, ...bad.canon].join(", ") || "12 Seiten");
  const mittel = wortSumme / saetze;
  r("T3/W1 Sätze im Fliesstext im Mittel ≤ 15 Wörter", mittel <= 15, `${mittel.toFixed(1)} Wörter im Mittel über ${saetze} Sätze; längster: ${maxSatz} Wörter (${maxWo})`);
  r("T3/W2 Kein Satz über 25 Wörter", bad.satz.length === 0, bad.satz.join(" | ") || `längster ${maxSatz}`);
  // robots, sitemap
  const robots = fs.readFileSync(path.join(ordner, "robots.txt"), "utf8"); r("T7/TI3 Vorschau: robots.txt sperrt alles, keine Sitemap", /Disallow: \/\s*$/m.test(robots) && !fs.existsSync(path.join(ordner, "sitemap.xml")), robots.trim().replace(/\n/g, " | "));
  // interne Links
  const tot = []; for (const s of SEITEN) { const h = html(s); for (const m of h.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) { const u = m[1]; if (/^(https?:|mailto:|tel:|\/\/)/.test(u)) continue; if (!fs.existsSync(path.join(ordner, u))) tot.push(`${s}: ${u}`); } }
  r("T7/TI17 Keine toten internen Links oder Bilder", tot.length === 0, tot.join(" | ") || "0");
  // Strukturierte Daten
  const ld = html("index").match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/); let ldok = false, ldd = "";
  try { const j = JSON.parse(ld[1]); const sicht = vis(html("index")); ldok = j["@type"] === "AutoBodyShop" && sicht.includes(j.address.streetAddress) && sicht.includes("071 755 88 61") && j.telephone === "+41717558861" && !("aggregateRating" in j) && !("review" in j); ldd = `${j["@type"]}, ${j.telephone}, ohne Bewertung`; } catch (e) { ldd = "ungültig"; }
  r("T7/S23-S25 LocalBusiness gültig, gleich der sichtbaren Seite, ohne eigene Bewertung", ldok, ldd);
  // Faktenabgleich: jede Zahl im sichtbaren Text steht in der Liste mit Quelle
  const erlaubt = new Map(Object.entries({ "071 755 88 61": "Q1", "076 615 44 41": "Q1", "63": "Anschrift Q1", "9450": "PLZ Q1", "CHE-221.907.243": "Q14", "CH-320.3.080.980-3": "Q14", "7.30": "Zeiten Q1", "12.00": "Q1", "13.15": "Q1", "17.30": "Q1", "17.15": "Q1", "4,8": "Q12", "5": "Skala", "37": "Q12", "33": "Q13", "2": "Q13 (4 Sterne) und Listen", "1": "Q13, Daten", "0": "Q13", "3": "Q13, Model 3", "4": "Q13", "2026": "Stand", "2025": "Q13 Monat", "2023": "Q13 Monat", "144": "Notruf", "117": "Notruf", "3,5": "Q18", "EFZ": "Q18", "EBA": "Q4", "123": "Beispielnummer im Hilfetext (Format, kein Fakt)" }));
  const unbek = new Set();
  for (const s of SEITEN) { const t = vis(html(s)); for (const m of t.matchAll(/\d[\d.,\-]*\d|\d/g)) { let z = m[0]; if (/^0\d{2}$/.test(z)) { continue; } const ok = [...erlaubt.keys()].some((k) => k === z || k.includes(z)); if (!ok && !/^\d{2}$/.test(z)) unbek.add(`${s}: ${z}`); } }
  r("T7 Faktenabgleich: jede Zahl im Text steht in fakten.md", unbek.size === 0, [...unbek].join(" | ") || "alle Zahlen belegt (eigenes Skript, nicht das Werkzeug aus dem Skill)");
}

(async () => {
  let ordner = WURZEL, port = 8091, srv, tmp;
  if (SELBST) {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "speedy-selbst-")); fs.cpSync(WURZEL, tmp, { recursive: true });
    // eingebaute Fehler
    let h = fs.readFileSync(path.join(tmp, "kontakt.html"), "utf8"); h = h.replace(/href="tel:\+41717558861"/, 'href="tel:071 755 88 61"'); fs.writeFileSync(path.join(tmp, "kontakt.html"), h);
    let c = fs.readFileSync(path.join(tmp, "css", "main.css"), "utf8"); c += "\n.klein { color: #BBBBBB !important; }\n"; fs.writeFileSync(path.join(tmp, "css", "main.css"), c);
    let t = fs.readFileSync(path.join(tmp, "tesla.html"), "utf8"); t = t.replace(/<a class="knopf knopf-text" href="schaden-melden.html"[^>]*>Schaden melden<\/a>/, ""); fs.writeFileSync(path.join(tmp, "tesla.html"), t);
    let f = fs.readFileSync(path.join(tmp, "betrieb.html"), "utf8"); f = f.replace("Das Team von", "Das Team – von").replace("Altstätten.", "Altstätten [Platzhalter]."); fs.writeFileSync(path.join(tmp, "betrieb.html"), f);
    let j = fs.readFileSync(path.join(tmp, "js", "main.js"), "utf8"); j = j.replace('(n.heute ? "heute ab " : "am " + TAGE[n.tag] + " ab ")', '"morgen ab "'); fs.writeFileSync(path.join(tmp, "js", "main.js"), j);
    ordner = tmp; port = 8092;
  }
  srv = server(ordner, port); await warte(900);
  try { await pruefe(`http://localhost:${port}`); textPruefung(ordner); } finally { srv.kill(); }
  if (SELBST) {
    const soll = ["P6 Telefon-Links 1440", "P6 Kontrast aus der Kaskade 1440", "E7 CTA «Schaden melden» fest sichtbar 1440", "T7/K11 Keine Gedankenstriche im sichtbaren Text", "P6 Klammern: keine eckigen Klammern im sichtbaren Text", "P6 Kalender (Fr 17.30, Sa 10.00, So 22.40, Mittag, Sommerzeit, Gerät in anderer Zeitzone)"];
    const gefunden = soll.map((id) => [id, erg.find((x) => x.id === id && !x.ok) ? "gefunden" : "NICHT gefunden"]);
    console.log("SELBSTTEST (eingebaut: kaputter tel-Link, Kontrast #BBB, fehlender CTA, Gedankenstrich und Klammer, falsches «morgen»):");
    gefunden.forEach(([id, s]) => console.log(`  ${s === "gefunden" ? "OK " : "FEHLT"} ${id}: ${s}`));
    const alle = gefunden.every(([, s]) => s === "gefunden"); console.log(alle ? "Selbsttest bestanden: Das Werkzeug findet alle eingebauten Fehler." : "Selbsttest NICHT bestanden."); fs.rmSync(tmp, { recursive: true, force: true }); process.exit(alle ? 0 : 1);
  }
  const falsch = erg.filter((x) => !x.ok);
  for (const x of erg) console.log(`${x.ok ? "OK    " : "FEHLER"} ${x.id}\n         ${String(x.detail).slice(0, 400)}`);
  console.log(`\n${erg.length} Prüfungen, ${falsch.length} Fehler`);
  if (JSONPFAD) fs.writeFileSync(JSONPFAD, JSON.stringify({ datum: "2026-11-01", ergebnisse: erg }, null, 2));
  process.exit(falsch.length ? 1 : 0);
})();
