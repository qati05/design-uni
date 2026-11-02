#!/usr/bin/env node
/* Maschinelle Prüfungen einer Vorschau (design-uni DP6 und DP5 maschinell; text-uni TP7; web-uni WP5 fremde Herkunft).
   Ein Teil des gemeinsamen Prüflaufs DP6 + TP7 + WP4 + WP5 (skills/design-uni/referenzen/zusammenspiel.md Teil 6 und 7).
   Kennungen: Jede Prüfung trägt genau eine Kennung, die ihres Besitzers (zusammenspiel.md Teil 7):
   DPn = design-uni, TP7/<Grundsatz> = text-uni (z. B. TP7/S3), WP5 = web-uni.
   Stufen (zusammenspiel.md Teil 7, Entscheid 13):
     FEHLER         sperrt: Recht, Barrierefreiheit, Entscheid des Betriebs oder des Studios, Menschen-Daten, eigene Messung
     HINWEIS        wird gemeldet, sperrt nicht (Annahmen, Geschmack, text-uni-Grundsätze, die dort «Hinweis» sind)
     nicht geprüft  Angabe fehlt in projekt.json; nie als bestanden gezählt
   Exit-Code 1 nur bei FEHLER.
   Allgemein: Alles Projektbezogene steht in projekt.json (Vorlage: ../eingabe/projekt.beispiel.json).

   Aufruf:  node pruefen.cjs <projekt.json> [--selbsttest] [--json <ausgabe.json>]
   --selbsttest  prüft zuerst die Seite, dann eine Kopie mit eingebauten Fehlern; ein Fehler gilt nur als gefunden, wenn sich
                 das Ergebnis gegenüber dem ersten Lauf ändert und die Stufe stimmt (FEHLER oder HINWEIS).
                 Das Werkzeug gilt nur als brauchbar, wenn es alle findet.

   Was fehlt in projekt.json, wird übersprungen und als «nicht geprüft» gemeldet, nie als bestanden.
   Seiten: «seiten» in projekt.json, sonst alle *.html im Ordner, auch in Unterordnern. Eine Seite «kontakt» ist
   kontakt.html oder kontakt/index.html (Verzeichnisformat, z. B. aus Astro); Links wie «/kontakt/» werden aufgelöst. */
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
// Seiten finden: flach (kontakt.html) oder im Verzeichnisformat (kontakt/index.html); Kennung ohne «.html» und ohne «/index»
function findeSeiten(dir) {
  const aus = [];
  const geh = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.name.startsWith(".") || e.name === "node_modules") continue; const f = path.join(d, e.name); if (e.isDirectory()) geh(f); else if (e.name.endsWith(".html")) aus.push(path.relative(dir, f).split(path.sep).join("/")); } };
  geh(dir);
  return aus.map((r) => (r === "index.html" ? "index" : r.replace(/\/index\.html$/, "").replace(/\.html$/, ""))).sort();
}
const datei = (ordner, s) => { const flach = path.join(ordner, s + ".html"); if (fs.existsSync(flach)) return flach; const verz = path.join(ordner, s, "index.html"); return fs.existsSync(verz) ? verz : flach; };
const seitenPfad = (s) => { const f = datei(WURZEL, s); return path.relative(WURZEL, f).split(path.sep).join("/").replace(/(^|\/)index\.html$/, (m, a) => (a ? "/" : "index.html")); };
// Link → Datei: «/a/», «a/», «/a», «a.html», relativ zur Seite oder zur Wurzel
const ziel = (ordner, seitenDatei, u) => { const basis = u.startsWith("/") ? ordner : path.dirname(seitenDatei); let f = path.join(basis, decodeURIComponent(u.replace(/^\//, ""))); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html"); else if (!fs.existsSync(f) && !path.extname(f) && fs.existsSync(f + ".html")) f += ".html"; return f; };
const SEITEN = P.seiten || findeSeiten(WURZEL);
const OHNE_KONTAKT = new Set(P.seitenOhneKontakt || ["404", "impressum", "datenschutz"]);
const TEL = (P.telefon || []).map((t) => t.replace(/\D/g, "")); // national, z. B. 0717558861
const VORWAHL = P.landesvorwahl || "+41";

const erg = [];
// r: sperrende Prüfung (FEHLER), h: Hinweis (HINWEIS, sperrt nicht)
const r = (id, ok, detail, stufe = "FEHLER") => erg.push({ id, ok: ok === null ? null : !!ok, stufe, detail });
const h = (id, ok, detail) => r(id, ok, detail, "HINWEIS");
const nichtGeprueft = (id, grund) => erg.push({ id, ok: null, stufe: "nicht geprüft", detail: `nicht geprüft: ${grund}` });
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

/* Zeilenlänge im Fliesstext (DGT3): Zeichen je gerenderter Zeile in main p und main li */
const zeilenSkript = () => {
  const absaetze = [];
  const rg = document.createRange();
  for (const el of document.querySelectorAll("main p, main li")) {
    if (el.closest("[hidden], nav, form, .sr, .sr-only, .visually-hidden")) continue;
    const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue;
    if (el.querySelector("p, li")) continue; // nur innerste Blöcke
    const zeilen = []; let oben = null, hoehe = 0;
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode, t = n.textContent;
      for (let i = 0; i < t.length; i++) {
        rg.setStart(n, i); rg.setEnd(n, i + 1); const q = rg.getBoundingClientRect();
        if (!q.width) continue; // zusammengefallene Leerzeichen
        if (oben === null || q.top > oben + Math.max(hoehe, q.height) * 0.5) { zeilen.push(0); oben = q.top; hoehe = q.height; }
        zeilen[zeilen.length - 1]++;
      }
    }
    if (zeilen.length) absaetze.push({ zeilen, text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 40) });
  }
  return absaetze;
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
    const tel = [], telFormat = [], zaehl = [], kontr = [], verd = [], ueberlauf = [], cta = [], textUeberBild = [], doppel = [], zuLang = [], ausserBand = [];
    for (const s of SEITEN) {
      await p.goto(`${base}/${seitenPfad(s)}`, { waitUntil: "load" });
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((x) => setTimeout(x, 30)); } scrollTo(0, 0); });
      // Telefon-Links (DP6): wählbar (nur Ziffern, ohne «(0)» und Leerzeichen), Nummer aus projekt.json, Text zeigt dieselbe Nummer,
      // im ersten Bildschirm. Das Format «tel:+41 mit 9 Ziffern» ist text-uni CH14 (Hinweis).
      const links = await p.$$eval('a[href^="tel:"]', (as) => as.map((a) => ({ href: a.getAttribute("href"), text: a.textContent.replace(/\D/g, "") })));
      const muster = new RegExp(`^tel:\\${VORWAHL}[1-9]\\d{8}$`);
      for (const l of links) {
        if (!muster.test(l.href)) telFormat.push(`${s}: ${l.href}`);
        if (!/^tel:(\+\d{6,15}|0\d{6,14})$/.test(l.href)) { tel.push(`${s}: ${l.href} nicht wählbar`); continue; }
        const ziffern = l.href.slice(4);
        const national = ziffern.startsWith(VORWAHL) ? "0" + ziffern.slice(VORWAHL.length) : ziffern;
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
      // Hauptaktion höchstens einmal im ersten Bildschirm (Entscheid 6); «mehrfach: true» nur mit Entscheid des Betriebs
      if (HA && HA.href && !HA.mehrfach && !(HA.ausnahmen || ["404"]).includes(s)) {
        await p.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; scrollTo(0, 0); });
        const n = await p.$$eval(`a[href="${HA.href}"]`, (as) => as.filter((a) => { const q = a.getBoundingClientRect(); return q.width > 0 && q.height > 0 && q.bottom > 0 && q.top < innerHeight && getComputedStyle(a).visibility !== "hidden" && !a.closest("[hidden]"); }).length);
        if (n > 1) doppel.push(`${s}: ${n}×`);
      }
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
      // Zeilenlänge: nie über 80 (Desktop und Handy, sperrt); 50 bis 75 nur am Desktop, als Hinweis
      for (const a of await p.evaluate(zeilenSkript)) {
        const max = Math.max(...a.zeilen); if (max > 80) zuLang.push(`${s}: ${max} Zeichen «${a.text}»`);
        const voll = a.zeilen.slice(0, -1).sort((x, y) => x - y);
        if (!mobil && voll.length >= 2) { const median = voll[Math.floor(voll.length / 2)]; if (median < 50 || median > 75) ausserBand.push(`${s}: ${median} «${a.text}»`); }
      }
    }
    if (TEL.length) r(`DP6 Telefon-Links ${vname}`, tel.length === 0, tel.join(" | ") || "alle tel-Links wählbar, Text gleich Ziel, Nummer aus projekt.json, im ersten Bildschirm");
    else nichtGeprueft(`DP6 Telefon-Links ${vname}`, "keine Nummer in projekt.json");
    if (vname === "1440") h("TP7/CH14 tel-Links als «tel:+41» mit 9 Ziffern", telFormat.length === 0, telFormat.join(" | ") || "alle tel-Links im internationalen Format");
    h(`DP6 Zählpunkte ${vname}`, zaehl.length === 0, zaehl.join(" | ") || "100 % der tel-, mailto- und Karten-Links tragen data-zaehl und data-ort");
    if (HA && HA.href && !HA.mehrfach) r(`DP6 Hauptaktion höchstens einmal im ersten Bildschirm ${vname}`, doppel.length === 0, doppel.join(" | ") || "fester Kopf und Faktenzeile tragen sie zusammen einmal (Entscheid 6)");
    if (HA && HA.fest) r(`DP6 Hauptaktion fest sichtbar ${vname}`, cta.length === 0, cta.join(" | ") || `«${HA.text || HA.selektor}» auf allen Seiten nach dem Scrollen, ≥ 44 px`);
    r(`DP6 Kontrast aus der Kaskade ${vname}`, kontr.length === 0, (kontr.join(" | ") || "alle sichtbaren Texte erreichen 4,5:1 (gross 3:1)") + (textUeberBild.length ? ` · Text über Bild nicht gemessen (von Auge prüfen): ${textUeberBild.join(", ")}` : ""));
    r(`DP6 Verdeckung ${vname}`, verd.length === 0, verd.join(" | ") || "0 Knöpfe und Felder verdeckt");
    r(`DP6 Kein Überlauf ${vname}`, ueberlauf.length === 0, ueberlauf.join(" | ") || "kein horizontales Scrollen");
    r(`DP6 Zeilenlänge im Fliesstext nie über 80 Zeichen ${vname}`, zuLang.length === 0, zuLang.slice(0, 8).join(" | ") || "keine Zeile über 80 Zeichen");
    if (!mobil) h(`DP6 Zeilenlänge im Fliesstext 50 bis 75 Zeichen ${vname}`, ausserBand.length === 0, ausserBand.slice(0, 8).join(" | ") || "Median je Absatz (ab 3 Zeilen) im Band");
    r(`WP5 Fremde Herkunft: nichts von fremden Hosts ${vname}`, fremd.size === 0, [...fremd].join(", ") || "alle Anfragen gleiche Herkunft");
    const ck = await ctx.cookies(); const ls = await p.evaluate(() => localStorage.length + sessionStorage.length);
    r(`WP5 Keine Cookies, nichts im Speicher ${vname}`, ck.length === 0 && ls === 0, `Cookies ${ck.length}, Speichereinträge ${ls}`);
    await ctx.close();
  }

  { const ctx = await b.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const bad = [];
    for (const s of SEITEN) { await p.goto(`${base}/${seitenPfad(s)}`); const ue = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ue > 0) bad.push(`${s}: ${ue}px`); }
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
    // Anzahl: design-uni (Hausentscheid, zusammenspiel.md Teil 4); Wortlaut «(freiwillig)», Sternchen, Beschriftung: text-uni U10, U11
    r(`DP6 Formular: sichtbare Felder ${fmin} bis ${fmax}`, felder >= fmin && felder <= fmax, `${felder} Felder; Pflicht ${pflicht}`);
    r("DP6 Formular: höchstens 4 Pflichtfelder", pflicht <= 4, `${pflicht} Pflicht`);
    if (F.pflicht != null) h(`DP6 Formular: Pflichtfelder wie geplant (${F.pflicht})`, pflicht === F.pflicht, `${pflicht}`);
    const marken = await p.$$eval(sel, (es) => es.filter((e) => e.offsetWidth || e.offsetHeight).map((e) => { const l = (e.id && document.querySelector(`label[for="${e.id}"]`)) || e.closest("label"); const t = l ? l.textContent : ""; return { pflicht: e.required || e.getAttribute("aria-required") === "true", stern: /\*/.test(t), frei: /\(freiwillig\)/.test(t), name: e.name || e.id }; }));
    // Sternchen ist erlaubt, wenn über dem Formular erklärt (U11): Text vor dem ersten Feld (ausserhalb der Beschriftungen) oder direkt vor dem Formular nennt «*» und «Pflicht»
    const sternErklaert = await p.evaluate((fs) => { const f = document.querySelector(fs); if (!f) return false; const erstes = f.querySelector("input:not([type=hidden]), textarea, select"); const texte = []; let v = f.previousElementSibling; for (let i = 0; v && i < 3; i++, v = v.previousElementSibling) texte.push(v.textContent); const w = document.createTreeWalker(f, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const n = w.currentNode; if (erstes && erstes.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING) break; if (n.parentElement.closest("label")) continue; texte.push(n.textContent); } return texte.some((t) => /\*/.test(t) && /pflicht/i.test(t)); }, F.selektor);
    const ohneFrei = marken.filter((m) => !m.pflicht && !m.frei).map((m) => m.name), mitStern = marken.filter((m) => m.stern).map((m) => m.name);
    r("TP7/U11 Formular: freiwillige Felder mit «(freiwillig)», Sternchen nur mit Erklärung über dem Formular", ohneFrei.length === 0 && (mitStern.length === 0 || sternErklaert), `freiwillig ohne «(freiwillig)»: ${ohneFrei.join(",") || 0}; mit Sternchen: ${mitStern.join(",") || 0}${mitStern.length ? (sternErklaert ? " (erklärt)" : " (nicht über dem Formular erklärt)") : ""}`);
    r("TP7/U10 Formular: Beschriftung an jedem Feld, 0 Platzhalter", ohneLabel.length === 0 && platzhalter === 0, `ohne Label ${ohneLabel.join(",") || 0}, Platzhalter ${platzhalter}`);
    r("DP6 Formular: nichts vorangekreuzt", vorgekreuzt === 0, `vorangekreuzt ${vorgekreuzt}`);
    if (F.verantwortlich) { const t = await sichtbarerText(p); r("DP6 Formular: Verantwortlicher am Knopf genannt", t.includes(F.verantwortlich), F.verantwortlich); }
    const tf = await p.$(`${F.selektor} input[type=tel]`); h("DP6 Formular: Telefonfeld öffnet die Zifferntastatur (LH8)", !!tf || !(F.fuellen && Object.values(F.fuellen).some((v) => /^0\d/.test(v))), tf ? "type=tel" : "kein Feld type=tel");
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
        // zusammenspiel.md Teil 7: sichtbare Rückmeldung im Browser sofort (sperrt); ≤ 300 ms ist eine Annahme (Hinweis)
        r("DP6 Formular: sichtbare Rückmeldung nach dem Senden", !!da, da ? "Bestätigung sichtbar" : "keine Bestätigung innert 2 s");
        h("DP6 Formular: Rückmeldung ≤ 300 ms, doppeltes Senden gesperrt [Annahme]", !!da && dt <= 300 && gesperrt, `${da ? dt + " ms" : "keine Bestätigung"} (inkl. Klick), Knopf gesperrt: ${gesperrt}`);
        // Ohne Server-Endpunkt heisst es nicht «gesendet» (zusammenspiel.md Teil 7); Wortlaut: text-uni
        if (!F.endpunkt) { const bt = da ? (await p.$eval(F.bestaetigung, (e) => e.textContent)).replace(/\s+/g, " ") : ""; const behauptet = /\b(ist|wurde|wurden|sind)\s+(erfolgreich\s+)?(gesendet|versandt|versendet|übermittelt|eingegangen)\b|haben\s+(Ihre|deine|eure)\s+\w+\s+erhalten|Danke für (Ihre|deine) (Anfrage|Nachricht)/i.test(bt);
          r("DP6 Formular ohne Endpunkt: Bestätigung sagt nicht «gesendet»", !behauptet, behauptet ? `«${bt.trim().slice(0, 120)}»` : "kein formular.endpunkt; Bestätigung behauptet keinen Versand"); }
      } else nichtGeprueft("DP6 Formular: Rückmeldung nach dem Senden", "formular.fuellen oder formular.bestaetigung fehlt");
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

  // Ohne JavaScript, Reduced Motion, Pause ab 5 s (Entscheid 12; keine Mengenregel)
  { const ctx = await b.newContext({ javaScriptEnabled: false }); const p = await ctx.newPage(); const bad = [];
    for (const s of SEITEN) { await p.goto(`${base}/${seitenPfad(s)}`); const t = await sichtbarerText(p); if (!OHNE_KONTAKT.has(s) && !enthaeltTelefon(t)) bad.push(s); if (t.length < 80) bad.push(`${s}: fast leer`); }
    r("DP6 Boden: ohne JavaScript ist der Inhalt da (Text, Telefon)", bad.length === 0, bad.join(", ") || `${SEITEN.length} Seiten`); await ctx.close(); }
  // DP5: Titel und Telefon des ersten Bildschirms nach 1,0 s lesbar (keine Bewegung hält Inhalt zurück, Entscheid 12; 1,0 s [Annahme])
  { const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" }); const p = await ctx.newPage(); await p.goto(`${base}/index.html`, { waitUntil: "domcontentloaded" }); await warte(1000);
    const bad = await p.evaluate(() => { const aus = []; for (const e of [...document.querySelectorAll("h1"), ...document.querySelectorAll('a[href^="tel:"]')].slice(0, 6)) { const q = e.getBoundingClientRect(); if (q.top >= innerHeight || q.bottom <= 0 || e.closest("[hidden]")) continue; let op = 1, sicht = true; for (let x = e; x; x = x.parentElement) { const cs = getComputedStyle(x); op *= parseFloat(cs.opacity); if (cs.visibility === "hidden" || cs.display === "none") sicht = false; } if (!sicht || op < 0.9 || q.right <= 0 || q.left >= innerWidth) aus.push(`${e.tagName.toLowerCase()} Deckkraft ${op.toFixed(2)}`); } return aus; });
    r("DP5 Titel und Telefon nach 1,0 s lesbar", bad.length === 0, bad.join(" | ") || "h1 und tel-Links im ersten Bildschirm sichtbar"); await ctx.close(); }
  { const ctx = await b.newContext({ reducedMotion: "reduce" }); const p = await ctx.newPage(); await p.goto(`${base}/index.html`); await warte(500); const n = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
    r("DP5 Reduced Motion: keine laufende Animation", n === 0, `${n} laufend`); await ctx.close(); }
  { const ctx = await b.newContext({ reducedMotion: "no-preference" }); const p = await ctx.newPage(); await p.goto(`${base}/index.html`); await warte(5200);
    const n = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
    const video = await p.evaluate(() => [...document.querySelectorAll("video")].filter((v) => !v.paused).length);
    const pause = await p.$('[data-pause], button[aria-label*="ause" i]');
    r("DP5 Was nach 5 s noch von selbst läuft, hat einen Pause-Knopf (WCAG 2.2.2)", (n === 0 && video === 0) || !!pause, `${n} Animationen, ${video} Videos laufend, Pause-Knopf: ${!!pause}`); await ctx.close(); }

  await b.close();
}

/* ---------- Text und Technik aus den HTML-Dateien (TP7) ---------- */
function textPruefung(ordner) {
  const html = (s) => fs.readFileSync(datei(ordner, s), "utf8");
  const vis = (h) => h.replace(/<(script|style|svg|head)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
  const ohneZitat = (h) => h.replace(/<blockquote[\s\S]*?<\/blockquote>/g, " ");
  const T = P.text || {};
  const bad = { sz: [], anrede: [], gerade: [], strich: [], uhr: [], klammer: [], tel: [], h1: [], sprung: [], alt: [], mass: [], satz: [], titel: [], beschr: [], noindex: [], canon: [] };
  const kopfzeilen = fs.existsSync(path.join(ordner, "_headers")) ? fs.readFileSync(path.join(ordner, "_headers"), "utf8") : "";
  const noindexKopf = /X-Robots-Tag:\s*noindex/i.test(kopfzeilen);
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
    // CH12 national «071 555 00 00» oder CH13 international «+41 71 555 00 00»; nie «0041», nie «(0)»
    if (/0041|\(0\)/.test(t) || [...t.matchAll(/\+41[\d\s]*/g)].some((m) => !/^\+41 \d{2} \d{3} \d{2} \d{2}\s*$/.test(m[0]))) bad.tel.push(s);
    const ueb = [...h.matchAll(/<h([1-6])[ >]/g)].map((m) => +m[1]); for (let i = 1; i < ueb.length; i++) if (ueb[i] - ueb[i - 1] > 1) bad.sprung.push(`${s}: h${ueb[i - 1]}→h${ueb[i]}`);
    if (ueb.filter((x) => x === 1).length !== 1) bad.h1.push(`${s}: ${ueb.filter((x) => x === 1).length} × h1`);
    for (const m of h.matchAll(/<img\b[^>]*>/g)) { if (!/ alt="[^"]*"/.test(m[0])) bad.alt.push(`${s}: ${m[0].slice(0, 60)}`); if (!/ width="\d+"/.test(m[0]) || !/ height="\d+"/.test(m[0])) bad.mass.push(`${s}: ${m[0].slice(0, 60)}`); }
    const ti = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || ""; const de = (h.match(/name="description" content="([^"]*)"/) || [])[1] || "";
    // S3: Ziel 40 bis 60, über 65 ein Fehler im Sinn von text-uni; S12: Beschreibung 110 bis 155. Beide sind in text-uni Hinweise.
    if (ti.length > 65 || ti.length < 40 || ti.length > 60) bad.titel.push(`${s}: ${ti.length}${ti.length > 65 ? " (über 65)" : ""}`);
    if (de.length < 110 || de.length > 155) bad.beschr.push(`${s}: ${de.length}`);
    if (P.vorschau !== false && !noindexKopf && !/name="robots" content="noindex/.test(h)) bad.noindex.push(s);
    if (P.vorschau !== false && /rel="canonical"/.test(h)) bad.canon.push(s);
    const hauptM = h.match(/<main[\s\S]*?<\/main>/); const haupt = hauptM ? ohneZitat(hauptM[0]) : "";
    const absaetze = [...haupt.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<br\s*\/?>/g, ". "));
    const fliess = vis(absaetze.join(" . ")).replace(/\b(Nr|ca|z\. B|bzw|inkl|evtl)\./g, "$1");
    for (const satz of fliess.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ«])/)) { const w = satz.trim().split(/\s+/).filter((x) => /\p{L}|\d/u.test(x)).length; if (w < 2) continue; wortSumme += w; saetze++; if (w > maxSatz) { maxSatz = w; maxWo = `${s}: ${satz.slice(0, 80)}`; } if (w > 25) bad.satz.push(`${s}: ${w} Wörter «${satz.slice(0, 50)}»`); }
  }
  // Hinweise nach text-uni SKILL.md (Grundsätze-Tabelle): CH1, CH4, CH5, CH11, CH13, CH14, K11, W1, W2, S3, S12, S23, TI33; kein canonical in der Vorschau (TI10) ebenfalls als Hinweis
  if (T.eszett === false) h("TP7/CH1 Eszett 0", bad.sz.length === 0, bad.sz.join(", ") || "0");
  if (T.anrede) h(`TP7/CH4 Eine Anrede (nur «${T.anrede}»)`, bad.anrede.length === 0, bad.anrede.join(", ") || "0");
  if (T.guillemets !== false) h("TP7/CH5 Guillemets, keine geraden oder deutschen Anführungszeichen", bad.gerade.length === 0, bad.gerade.join(", ") || "0");
  if (T.gedankenstriche === false) h("TP7/K11 Keine Gedankenstriche im sichtbaren Text", bad.strich.length === 0, bad.strich.join(", ") || "0");
  if (T.uhrzeitMitPunkt !== false) h("TP7/CH11 Uhrzeit mit Punkt", bad.uhr.length === 0, bad.uhr.join(", ") || "0");
  h("TP7/CH13 Telefon sichtbar: kein 0041, kein (0), international nur «+41 xx xxx xx xx»", bad.tel.length === 0, bad.tel.join(", ") || "0");
  r("DP6 Klammern: keine eckigen Klammern im sichtbaren Text", bad.klammer.length === 0, bad.klammer.join(", ") || "0");
  r("TP7/S15 Genau ein sichtbares h1", bad.h1.length === 0, bad.h1.join(" | ") || "0");
  r("TP7/S16 Keine Sprünge in der Gliederung", bad.sprung.length === 0, bad.sprung.join(" | ") || "0");
  r("DP6 Bilder mit alt-Attribut (WCAG 1.1.1)", bad.alt.length === 0, bad.alt.join(" | ") || "alle Bilder");
  h("TP7/TI33 Bilder mit width und height", bad.mass.length === 0, bad.mass.join(" | ") || "alle Bilder");
  h("TP7/S3 Titel 40 bis 60 Zeichen (über 65 ein Fehler im Sinn von S3)", bad.titel.length === 0, bad.titel.join(" | ") || `${SEITEN.length} Seiten`);
  h("TP7/S12 Beschreibung 110 bis 155 Zeichen", bad.beschr.length === 0, bad.beschr.join(" | ") || `${SEITEN.length} Seiten`);
  if (saetze) {
    h("TP7/W1 Sätze im Fliesstext im Mittel ≤ 15 Wörter", wortSumme / saetze <= 15, `${(wortSumme / saetze).toFixed(1)} im Mittel über ${saetze} Sätze; längster ${maxSatz} (${maxWo})`);
    h("TP7/W2 Kein Satz über 25 Wörter", bad.satz.length === 0, bad.satz.join(" | ") || `längster ${maxSatz}`);
  }
  // Vorschau (Entscheid 4): eine sperrende Prüfung mit der Kennung des Besitzers text-uni (TI8, mit TI10)
  const rob = path.join(ordner, "robots.txt");
  if (P.vorschau !== false) { const rt = fs.existsSync(rob) ? fs.readFileSync(rob, "utf8") : ""; const sperrt = /^\s*Disallow:\s*\/\s*$/m.test(rt); const sitemap = fs.existsSync(path.join(ordner, "sitemap.xml"));
    const teile = []; if (bad.noindex.length) teile.push(`ohne noindex: ${bad.noindex.join(", ")}`); if (sperrt) teile.push("robots.txt: «Disallow: /»"); if (sitemap) teile.push("sitemap.xml vorhanden");
    r("TP7/TI8 Vorschau: noindex per Meta oder X-Robots-Tag, robots.txt ohne «Disallow: /», keine Sitemap (Entscheid 4)", teile.length === 0, teile.join(" · ") || `${noindexKopf ? "X-Robots-Tag in _headers" : `Meta auf ${SEITEN.length} Seiten`}; ${rt ? rt.trim().replace(/\n/g, " | ") : "keine robots.txt"}`);
    h("TP7/TI10 Vorschau: kein canonical", bad.canon.length === 0, bad.canon.join(", ") || `${SEITEN.length} Seiten`); }
  const tot = []; for (const s of SEITEN) { for (const m of html(s).matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) { const u = m[1]; if (/^(https?:|mailto:|tel:|\/\/|data:)/.test(u)) continue; if (!fs.existsSync(ziel(ordner, datei(ordner, s), u))) tot.push(`${s}: ${u}`); } }
  r("DP6 Keine toten internen Links oder Bilder", tot.length === 0, tot.join(" | ") || "0");
  // Strukturierte Daten: Typ, Telefon und Strasse gleich der sichtbaren Seite, keine eigene Bewertung
  if (P.jsonld && P.jsonld.typ) {
    const ld = html("index").match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/); let ok = false, d = "fehlt";
    let gleich = null, dg = "";
    try { const j = JSON.parse(ld[1]); const sicht = vis(html("index")); const telOk = !TEL.length || (j.telephone || "").replace(/\D/g, "").endsWith(TEL[0].slice(1)); const strOk = !j.address || sicht.includes(j.address.streetAddress); gleich = telOk && strOk; dg = `Telefon ${telOk ? "gleich" : "anders"}, Strasse ${strOk ? "gleich" : "anders"}`; ok = j["@type"] === P.jsonld.typ && !("aggregateRating" in j) && !("review" in j); d = `${j["@type"]}, ${j.telephone}, ${"aggregateRating" in j ? "mit" : "ohne"} Bewertung`; } catch (e) { d = "ungültig oder fehlt"; }
    h("TP7/S23 LocalBusiness gültig, Typ wie geplant, ohne eigene Bewertung", ok, d);
    // falsche Werte in den Daten sperren nach R1 (text-uni SKILL.md, Zeile zu S23)
    if (gleich !== null) r("TP7/R1 Strukturierte Daten: Telefon und Strasse gleich der sichtbaren Seite", gleich, dg); else nichtGeprueft("TP7/R1 Strukturierte Daten", "kein gültiges JSON-LD auf index");
  }
  // Faktenabgleich: jede mehrstellige Zahl im sichtbaren Text steht in projekt.json → zahlen (mit Quelle).
  // Quelle der Werte ist fakten.md (text-uni); «zahlen» ist ihre Abschrift für das Werkzeug.
  if (P.zahlen) {
    const erlaubt = Object.keys(P.zahlen).concat(P.telefon || []);
    const unbek = new Set();
    for (const s of SEITEN) { const t = vis(html(s)); for (const m of t.matchAll(/\d[\d.,'’]*\d|\d/g)) { const z = m[0]; if (/^\d{1,2}$/.test(z) || /^0\d{2}$/.test(z)) continue; /* ein- und zweistellig, Vorwahlen */ if (!erlaubt.some((k) => k === z || k.includes(z))) unbek.add(`${s}: ${z}`); } }
    r("TP7/R1 Faktenabgleich: jede Zahl (ab 3 Stellen) steht mit Quelle in projekt.json (aus fakten.md)", unbek.size === 0, [...unbek].slice(0, 30).join(" | ") || "alle belegt");
  } else nichtGeprueft("TP7/R1 Faktenabgleich", "keine zahlen in projekt.json");
}

/* ---------- Selbsttest: allgemeine eingebaute Fehler ---------- */
// Jeder eingebaute Fehler nennt die Prüfung und die erwartete Stufe; ein HINWEIS darf nicht als FEHLER kommen und umgekehrt.
function baueFehlerEin(tmp) {
  const eingebaut = [];
  const soll = (id, stufe = "FEHLER") => eingebaut.push({ id, stufe });
  const seiten = SEITEN.filter((s) => s !== "404");
  const lies = (s) => fs.readFileSync(datei(tmp, s), "utf8"), schreib = (s, x) => fs.writeFileSync(datei(tmp, s), x);
  // 1 tel-Link, der eine falsche Nummer wählt und nicht im Format «tel:+41» steht
  const sTel = seiten.find((s) => /href="tel:\+/.test(lies(s)));
  if (sTel) { schreib(sTel, lies(sTel).replace(/href="tel:\+(\d+)"/, 'href="tel:0$1"')); soll("DP6 Telefon-Links 1440"); soll("TP7/CH14 tel-Links als «tel:+41» mit 9 Ziffern", "HINWEIS"); }
  // 2 Kontrast: erster Absatz in main hellgrau auf dem Grund
  const sK = seiten[0]; schreib(sK, lies(sK).replace("</head>", '<style>main p { color: #c8c8c8 !important; }</style></head>')); soll("DP6 Kontrast aus der Kaskade 1440");
  // 3 Gedankenstrich (Hinweis) und Klammer (Fehler) im ersten Absatz einer zweiten Seite
  const sT = seiten[1] || seiten[0]; schreib(sT, lies(sT).replace(/(<main[\s\S]*?<p\b[^>]*>)/, "$1Muster – [Platzhalter] ")); soll("DP6 Klammern: keine eckigen Klammern im sichtbaren Text");
  if (P.text && P.text.gedankenstriche === false) soll("TP7/K11 Keine Gedankenstriche im sichtbaren Text", "HINWEIS");
  // 4 Hauptaktion auf einer Seite entfernen
  if (P.hauptaktion && P.hauptaktion.fest && P.hauptaktion.href) {
    const sH = seiten[seiten.length - 1]; const re = new RegExp(`<a\\b[^>]*href="${P.hauptaktion.href.replace(/[.?*+^$()[\]{}|\\]/g, "\\$&")}"[^>]*>[\\s\\S]*?<\\/a>`, "g");
    schreib(sH, lies(sH).replace(re, "")); soll("DP6 Hauptaktion fest sichtbar 1440");
  }
  // 5 Bild ohne alt (Fehler, WCAG) und ohne Mass (Hinweis, TI33)
  schreib(sK, lies(sK).replace(/<\/main>/, '<img src="fehlt-absichtlich.jpg"></main>')); soll("DP6 Bilder mit alt-Attribut (WCAG 1.1.1)"); soll("TP7/TI33 Bilder mit width und height", "HINWEIS");
  // 6 Vorschau mit «Disallow: /» und Sitemap (Entscheid 4: falsch)
  if (P.vorschau !== false) { fs.writeFileSync(path.join(tmp, "robots.txt"), "User-agent: *\nDisallow: /\n"); fs.writeFileSync(path.join(tmp, "sitemap.xml"), "<urlset></urlset>"); soll("TP7/TI8 Vorschau: noindex per Meta oder X-Robots-Tag, robots.txt ohne «Disallow: /», keine Sitemap (Entscheid 4)"); }
  // 7 Telefon mit 0041 im sichtbaren Text (CH13, Hinweis)
  schreib(sT, lies(sT).replace(/<\/main>/, "<p>Telefon 0041 71 555 00 00</p></main>")); soll("TP7/CH13 Telefon sichtbar: kein 0041, kein (0), international nur «+41 xx xxx xx xx»", "HINWEIS");
  // 8 Hauptaktion doppelt im ersten Bildschirm (Entscheid 6)
  if (P.hauptaktion && P.hauptaktion.href && !P.hauptaktion.mehrfach) { schreib(sK, lies(sK).replace(/(<body\b[^>]*>)/, `$1<a href="${P.hauptaktion.href}" style="display:block;padding:12px">${P.hauptaktion.text || "Hauptaktion"}</a>`)); soll("DP6 Hauptaktion höchstens einmal im ersten Bildschirm 1440"); }
  // 9 Pflichtfeld mit Sternchen, nicht über dem Formular erklärt (U11: falsch)
  const F = P.formular;
  const fSeite = F && F.seite ? ziel(tmp, path.join(tmp, "index.html"), F.seite) : null;
  if (F && F.selektor && fSeite && fs.existsSync(fSeite)) { const fp = fSeite, fh = fs.readFileSync(fp, "utf8"); const kand = [...fh.matchAll(/<label\b[^>]*for="([^"]+)"[^>]*>((?:(?!<\/label>)[\s\S])*?)<\/label>/g)].filter((x) => !x[2].includes("*") && new RegExp(`<(textarea|select)\\b[^>]*id="${x[1]}"|<input(?![^>]*type="(checkbox|radio|hidden)")[^>]*id="${x[1]}"`).test(fh)).pop(); const neu = kand ? fh.replace(kand[0], kand[0].replace("</label>", " *</label>")) : fh; if (neu !== fh) { fs.writeFileSync(fp, neu); soll("TP7/U11 Formular: freiwillige Felder mit «(freiwillig)», Sternchen nur mit Erklärung über dem Formular"); } }
  // 10 Verzeichnisformat: Link auf eine echte Ordnerseite gilt nicht als tot, Link auf einen fehlenden Ordner schon
  fs.mkdirSync(path.join(tmp, "selbsttest-ordner"), { recursive: true });
  fs.writeFileSync(path.join(tmp, "selbsttest-ordner", "index.html"), "<!doctype html><title>Selbsttest</title><main><p>Selbsttest</p></main>");
  schreib(sT, lies(sT).replace(/<\/main>/, '<p><a href="/selbsttest-ordner/">Ordner</a> <a href="selbsttest-ordner/">Ordner relativ</a> <a href="/fehlt-ordner/">fehlt</a></p></main>'));
  soll("DP6 Keine toten internen Links oder Bilder");
  // 11 HINWEIS gegen FEHLER: ein breiter Absatz mit einem Satz über 25 Wörter. Zeile über 80 Zeichen sperrt, der lange Satz ist nur ein Hinweis (W2).
  const lang = "Dieser Absatz ist absichtlich viel zu breit gesetzt und enthält einen einzigen langen Satz ohne Punkt damit das Werkzeug zeigt dass eine zu lange Zeile sperrt und ein zu langer Satz nur als Hinweis gemeldet wird wie es das Zusammenspiel der drei Skills verlangt.";
  schreib(sT, lies(sT).replace(/<\/main>/, `<p style="max-width:none;width:min(1200px,100vw);font-size:11px">${lang}</p></main>`));
  soll("DP6 Zeilenlänge im Fliesstext nie über 80 Zeichen 1440"); soll("TP7/W2 Kein Satz über 25 Wörter", "HINWEIS");
  // 12 Titel blendet über 3 s ein (hält Inhalt zurück, Entscheid 12)
  if (SEITEN.includes("index")) { schreib("index", lies("index").replace("</head>", "<style>h1 { animation: selbsttest-ein 3s both; } @keyframes selbsttest-ein { from { opacity: 0; } }</style></head>")); soll("DP5 Titel und Telefon nach 1,0 s lesbar"); }
  return eingebaut;
}

(async () => {
  let ordner = WURZEL, tmp, soll = [], sauber = [];
  if (SELBST) {
    const srv0 = await server(WURZEL);
    try { await pruefe(`http://localhost:${srv0.address().port}`); textPruefung(WURZEL); } finally { srv0.close(); }
    sauber = erg.splice(0, erg.length); tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pruefen-selbst-")); fs.cpSync(WURZEL, tmp, { recursive: true }); soll = baueFehlerEin(tmp); ordner = tmp; }
  const srv = await server(ordner);
  try { await pruefe(`http://localhost:${srv.address().port}`); textPruefung(ordner); } finally { srv.close(); }
  if (SELBST) {
    console.log("SELBSTTEST, eingebaute Fehler:");
    let alle = true;
    for (const { id, stufe } of soll) {
      const f = erg.find((x) => x.id === id && x.ok === false), v = sauber.find((x) => x.id === id);
      const neu = !!f && (!v || v.ok !== false || String(v.detail) !== String(f.detail));
      const stufeOk = !!f && f.stufe === stufe;
      alle = alle && neu && stufeOk;
      console.log(`  ${neu && stufeOk ? "OK   " : "FEHLT"} [${stufe}] ${id}${f && !neu ? " (fiel schon ohne eingebauten Fehler gleich aus)" : ""}${f && !stufeOk ? ` (gemeldet als ${f.stufe}, erwartet ${stufe})` : ""}`);
    }
    const hinweise = soll.filter((x) => x.stufe === "HINWEIS");
    const hinweisOk = hinweise.length > 0 && hinweise.every(({ id }) => erg.some((x) => x.id === id && x.ok === false && x.stufe === "HINWEIS")) && !erg.some((x) => x.ok === false && x.stufe !== "FEHLER" && x.stufe !== "HINWEIS");
    alle = alle && hinweisOk; console.log(`  ${hinweisOk ? "OK   " : "FEHLT"} Stufen: ${hinweise.length} eingebaute Hinweise kommen als HINWEIS, nicht als FEHLER; der Exit-Code zählt nur FEHLER`);
    const tl = erg.find((x) => x.id === "DP6 Keine toten internen Links oder Bilder");
    const ordnerOk = findeSeiten(tmp).includes("selbsttest-ordner") && tl && /fehlt-ordner/.test(tl.detail) && !/selbsttest-ordner/.test(tl.detail);
    alle = alle && ordnerOk; console.log(`  ${ordnerOk ? "OK   " : "FEHLT"} Verzeichnisformat: Seite selbsttest-ordner/index.html gefunden, «/selbsttest-ordner/» aufgelöst, «/fehlt-ordner/» als tot gemeldet`);
    console.log(alle ? "Selbsttest bestanden: Das Werkzeug findet alle eingebauten Fehler." : "Selbsttest NICHT bestanden: zuerst das Werkzeug reparieren.");
    fs.rmSync(tmp, { recursive: true, force: true }); process.exit(alle ? 0 : 1);
  }
  const marke = (x) => (x.ok === null ? "nicht geprüft" : x.ok ? "OK" : x.stufe).padEnd(13);
  for (const x of erg) console.log(`${marke(x)} ${x.id}\n              ${String(x.detail).slice(0, 400)}`);
  const falsch = erg.filter((x) => x.ok === false && x.stufe === "FEHLER").length, hinweis = erg.filter((x) => x.ok === false && x.stufe === "HINWEIS").length, offen = erg.filter((x) => x.ok === null).length;
  console.log(`\n${erg.length} Prüfungen: ${falsch} FEHLER (sperren), ${hinweis} HINWEIS (sperren nicht), ${offen} nicht geprüft`);
  if (JSONPFAD) fs.writeFileSync(JSONPFAD, JSON.stringify({ datum: new Date().toISOString().slice(0, 10), ergebnisse: erg }, null, 2));
  process.exit(falsch ? 1 : 0);
})();
