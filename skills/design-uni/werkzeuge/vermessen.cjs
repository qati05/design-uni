// Vermisst eine Website wie die Vorbilder: Schrift, Farbe, erster Bildschirm, Raster, Bauteile, Bewegung.
// Aufruf:
//   node vermessen.cjs <url|ordner> [--name kurz] [--aus ordner] [--bilder]
// Ein Ordner wird über einen lokalen Server geöffnet (index.html).
// Ausgabe: JSON auf stdout und, mit --aus, <name>.json plus Bildschirmfotos (--bilder).
// Vergleich mit dem Band der Vorbilder: node vergleichen.cjs <name>.json
"use strict";
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const http = require("http");

const args = process.argv.slice(2);
const ziel = args[0];
if (!ziel) { console.error("Aufruf: node vermessen.cjs <url|ordner> [--name kurz] [--aus ordner] [--bilder]"); process.exit(2); }
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const name = opt("--name", ziel.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/-+$/, ""));
const aus = opt("--aus", null);
const bilder = args.includes("--bilder");
const warten = +opt("--warten", 2500); // ms nach dem Laden, für Seiten mit Ladebildschirm

function statischerServer(dir) {
  const typen = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".webp": "image/webp", ".avif": "image/avif" };
  const s = http.createServer((q, r) => {
    let f = path.join(dir, decodeURIComponent(q.url.split("?")[0]));
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { "content-type": typen[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(r);
  });
  return new Promise((ok) => s.listen(0, () => ok(s)));
}

// Läuft im Browser. Gibt Rohmasse für einen Bildschirm zurück.
function messeImBrowser() {
  const vw = innerWidth, vh = innerHeight;
  const sichtbar = (e) => { const c = getComputedStyle(e); if (c.visibility === "hidden" || c.display === "none" || +c.opacity === 0) return false; const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  const fam = (s) => s.split(",")[0].replace(/["']/g, "").trim();
  const hex = (s) => { const m = (s || "").match(/[\d.]+/g); if (!m) return null; if (m.length > 3 && +m[3] === 0) return null; return "#" + m.slice(0, 3).map((v) => (+v | 0).toString(16).padStart(2, "0")).join(""); };

  // Textknoten mit Zeichenzahl
  const texte = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    const t = n.textContent.replace(/\s+/g, " ").trim();
    if (t.length < 1) continue;
    const e = n.parentElement; if (!e || !sichtbar(e)) continue;
    if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(e.tagName)) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); const r = rg.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const c = getComputedStyle(e);
    texte.push({ t, len: t.length, e, r: { x: r.x, y: r.y + scrollY, w: r.width, h: r.height }, fs: parseFloat(c.fontSize), fw: +c.fontWeight || 400, fam: fam(c.fontFamily), it: c.fontStyle === "italic", up: c.textTransform === "uppercase" || (t.length > 3 && t === t.toUpperCase() && /[A-ZÄÖÜ]/.test(t)), ls: parseFloat(c.letterSpacing) || 0, lh: parseFloat(c.lineHeight) || parseFloat(c.fontSize) * 1.2, col: hex(c.color) });
  }
  const total = texte.reduce((a, x) => a + x.len, 0) || 1;
  const nachSchl = (key) => { const m = {}; for (const x of texte) m[key(x)] = (m[key(x)] || 0) + x.len; return Object.entries(m).map(([k, v]) => [k, +(v / total).toFixed(3)]).sort((a, b) => b[1] - a[1]); };
  const familien = nachSchl((x) => x.fam);
  const groessen = nachSchl((x) => Math.round(x.fs));
  const fliess = +groessen.filter(([k]) => +k >= 12 && +k <= 22)[0]?.[0] || 16;
  const imErsten = texte.filter((x) => x.r.y < vh && x.r.y + x.r.h > 0);
  const star = imErsten.slice().sort((a, b) => b.fs - a.fs)[0] || null;
  const h1 = document.querySelector("h1");
  const starInfo = star ? { text: star.t.slice(0, 120), px: Math.round(star.fs), gewicht: star.fw, familie: star.fam, versal: star.up, kursiv: star.it, laufweiteEm: +(star.ls / star.fs).toFixed(3), zeilenhoehe: +(star.lh / star.fs).toFixed(2), anteilBreite: +(star.r.w / vw).toFixed(2), mitteX: +((star.r.x + star.r.w / 2) / vw).toFixed(2), obenY: +(star.r.y / vh).toFixed(2) } : null;
  // Wortmarke als Bild oder SVG (zählt als Star, wenn grösser als jeder Text)
  const marken = [...document.querySelectorAll("svg, img")].filter((e) => { const q = e.getBoundingClientRect(); return sichtbar(e) && q.top < vh && q.bottom > 0 && q.width >= vw * 0.35 && q.width / Math.max(q.height, 1) >= 3; }).map((e) => { const q = e.getBoundingClientRect(); return { anteilBreite: +(q.width / vw).toFixed(2), hoehePx: Math.round(q.height), obenY: +(q.top / vh).toFixed(2) }; });
  const wortmarke = marken.sort((a, b) => b.anteilBreite - a.anteilBreite)[0] || null;
  // Wörter im ersten Bildschirm
  const woerterErster = imErsten.reduce((a, x) => a + x.t.split(" ").length, 0);
  const versalAnteil = +(texte.filter((x) => x.up).reduce((a, x) => a + x.len, 0) / total).toFixed(3);
  const monoAnteil = +(texte.filter((x) => /mono|code|courier|jetbrains|ibm plex mono|space mono|dm mono|geist mono/i.test(x.fam)).reduce((a, x) => a + x.len, 0) / total).toFixed(3);
  const kursivTitel = texte.filter((x) => x.it && x.fs >= fliess * 1.8).length;
  const stufen = groessen.filter(([, v]) => v >= 0.01).length;
  const groesste = Math.max(...texte.map((x) => x.fs), 0);

  // Farben: Text (nach Zeichen), Flächen (nach sichtbarer Fläche, Rasterproben)
  const textfarben = nachSchl((x) => x.col || "?");
  const proben = []; const SX = 32, SY = 20;
  let medien = 0, textAufMedien = 0, leer = 0;
  const flaeche = {};
  const istMedium = (e) => { if (!e) return false; if (/^(IMG|VIDEO|CANVAS|PICTURE|IFRAME)$/.test(e.tagName)) return true; if (e.tagName === "svg" || e.tagName === "SVG") { const r = e.getBoundingClientRect(); return r.width * r.height > vw * vh * 0.05; } const bi = getComputedStyle(e).backgroundImage; return bi && bi !== "none" && /url\(/.test(bi); };
  for (let i = 0; i < SX; i++) for (let j = 0; j < SY; j++) {
    const x = (i + 0.5) * vw / SX, y = (j + 0.5) * vh / SY;
    const stapel = document.elementsFromPoint(x, y);
    const oben = stapel[0];
    const med = stapel.some(istMedium);
    if (med) medien++;
    const textHier = oben && imErsten.some((t) => t.e === oben || oben.contains(t.e)) && imErsten.some((t) => x >= t.r.x && x <= t.r.x + t.r.w && y + scrollY >= t.r.y && y + scrollY <= t.r.y + t.r.h);
    if (med && textHier) textAufMedien++;
    // Grundfarbe an dieser Stelle: erste Fläche mit Farbe im Stapel
    let farbe = null;
    for (const e of stapel) { if (istMedium(e)) { farbe = "medium"; break; } const bg = hex(getComputedStyle(e).backgroundColor); if (bg) { farbe = bg; break; } }
    farbe = farbe || hex(getComputedStyle(document.documentElement).backgroundColor) || "#ffffff";
    flaeche[farbe] = (flaeche[farbe] || 0) + 1;
    if (!med && !textHier) leer++;
  }
  const P = SX * SY;
  const flaechen = Object.entries(flaeche).map(([k, v]) => [k, +(v / P).toFixed(3)]).sort((a, b) => b[1] - a[1]);

  // Handlungen im ersten Bildschirm: Links und Knöpfe, die wie Knöpfe aussehen
  const knopfartig = (e) => { const c = getComputedStyle(e); const bg = hex(c.backgroundColor); const rand = parseFloat(c.borderTopWidth) > 0 && hex(c.borderTopColor); const r = e.getBoundingClientRect(); return (bg || rand) && r.height >= 28 && r.height <= 90 && r.width <= 420 && (e.textContent || "").trim().length > 1; };
  // nur, was wirklich zu sehen ist: im Bildschirm und an der Mitte nicht verdeckt (versteckte Menüs zählen nicht)
  const wirklichDa = (e) => { const q = e.getBoundingClientRect(); if (q.bottom <= 0 || q.top >= vh || q.right <= 0 || q.left >= vw) return false; const x = Math.min(Math.max(q.left + q.width / 2, 1), vw - 1), y = Math.min(Math.max(q.top + q.height / 2, 1), vh - 1); const t = document.elementFromPoint(x, y); return !!t && (t === e || e.contains(t) || t.contains(e)); };
  const handlungen = [...document.querySelectorAll("a, button, [role=button], input[type=submit]")].filter((e) => sichtbar(e) && wirklichDa(e));
  const knoepfe = handlungen.filter(knopfartig);
  const kopf = document.querySelector("header, nav, [role=banner]");
  const navLinks = kopf ? [...kopf.querySelectorAll("a, button")].filter(sichtbar).length : null;

  // Radien und Schatten über die ganze Seite
  const radien = {}, schatten = { n: 0 };
  let karten = 0, kleineIcons = 0;
  const alle = [...document.body.querySelectorAll("*")].slice(0, 6000);
  for (const e of alle) {
    const c = getComputedStyle(e); if (c.display === "none") continue;
    const r = e.getBoundingClientRect(); if (r.width < 8 || r.height < 8) continue;
    const rad = parseFloat(c.borderTopLeftRadius) || 0;
    if (rad > 0 && (hex(c.backgroundColor) || parseFloat(c.borderTopWidth) > 0 || /^(IMG|VIDEO|BUTTON|A|INPUT)$/.test(e.tagName))) { const k = rad >= Math.min(r.width, r.height) / 2 - 1 ? "pille" : String(Math.round(rad)); radien[k] = (radien[k] || 0) + 1; }
    if (c.boxShadow && c.boxShadow !== "none") schatten.n++;
    if ((hex(c.backgroundColor) || parseFloat(c.borderTopWidth) > 0 || c.boxShadow !== "none") && rad > 0 && r.width > 180 && r.width < vw * 0.5 && r.height > 120 && e.querySelector("h2,h3,h4,p")) karten++;
    if ((e.tagName === "svg" || e.tagName === "IMG") && r.width <= 48 && r.height <= 48 && r.width >= 12) kleineIcons++;
  }

  // Raster: linke Kanten von Textblöcken (Desktop) gerundet auf 8 px
  const kanten = {};
  for (const x of texte) { if (x.len < 12) continue; const k = Math.round(x.r.x / 8) * 8; kanten[k] = (kanten[k] || 0) + x.len; }
  const kantenListe = Object.entries(kanten).sort((a, b) => b[1] - a[1]);
  const kantenSumme = kantenListe.reduce((a, [, v]) => a + v, 0) || 1;
  const disziplin = +(kantenListe.slice(0, 4).reduce((a, [, v]) => a + v, 0) / kantenSumme).toFixed(2);

  // Bilder
  const imgs = [...document.querySelectorAll("img, video, picture")].filter(sichtbar).map((e) => e.getBoundingClientRect()).filter((r) => r.width > 120 && r.height > 80);
  const randlos = imgs.filter((r) => r.width >= vw * 0.98).length;
  const formate = {}; for (const r of imgs) { const q = r.width / r.height; const k = q > 2.1 ? "band" : q > 1.55 ? "quer-16:9" : q > 1.2 ? "quer-4:3" : q > 0.85 ? "quadrat" : "hoch"; formate[k] = (formate[k] || 0) + 1; }

  // Bewegung und Herkunft
  const html = document.documentElement;
  const skripte = [...document.scripts].map((s) => s.src).join(" ");
  const bib = {
    gsap: !!window.gsap || /gsap/i.test(skripte), scrollTrigger: !!window.ScrollTrigger || /ScrollTrigger/i.test(skripte),
    lenis: !!window.lenis || !!window.Lenis || html.classList.contains("lenis") || /lenis/i.test(skripte),
    locomotive: html.classList.contains("has-scroll-smooth") || /locomotive/i.test(skripte),
    framerMotion: !!document.querySelector("[data-framer-appear-id], [data-projection-id]"),
    three: !!window.THREE || /three(\.module)?(\.min)?\.js/i.test(skripte) || !!document.querySelector("canvas[data-engine]"),
    lottie: !!window.lottie || !!document.querySelector("lottie-player, dotlottie-player") || /lottie/i.test(skripte),
    rive: /rive/i.test(skripte) || !!document.querySelector("canvas[data-rive], rive-canvas"),
    swiper: !!document.querySelector(".swiper, .swiper-container"), splide: !!document.querySelector(".splide"),
    barba: !!document.querySelector("[data-barba]") || /barba/i.test(skripte),
    splitText: !!document.querySelector(".split-line, .line-mask, [data-split], .char, .word") ,
  };
  const plattform = html.hasAttribute("data-wf-page") || html.hasAttribute("data-wf-site") ? "webflow" : document.querySelector("[data-framer-hydrate-v2], #__framer-badge-container, meta[name=generator][content*=Framer]") ? "framer" : document.getElementById("__next") || /_next\//.test(skripte) ? "next" : /wp-content/.test(document.documentElement.innerHTML.slice(0, 200000)) ? "wordpress" : /cdn\.shopify/.test(skripte) ? "shopify" : /squarespace/.test(skripte) ? "squarespace" : document.querySelector("[data-astro-cid], astro-island") ? "astro" : "anderes";
  const videos = [...document.querySelectorAll("video")].filter((v) => v.autoplay || !v.paused).length;
  const grundSeite = hex(getComputedStyle(document.body).backgroundColor) || hex(getComputedStyle(html).backgroundColor) || "#ffffff";

  return {
    viewport: [vw, vh], seitenhoeheBildschirme: +(document.documentElement.scrollHeight / vh).toFixed(1),
    schrift: { familien: familien.slice(0, 6), familienAb5Prozent: familien.filter(([, v]) => v >= 0.05).length, fliesstextPx: fliess, groesstePx: Math.round(groesste), stufenAb1Prozent: stufen, versalAnteil, monoAnteil, kursivTitel },
    star: starInfo, wortmarke, starZuFliess: starInfo ? +(starInfo.px / fliess).toFixed(1) : null,
    h1: h1 ? { text: h1.textContent.replace(/\s+/g, " ").trim().slice(0, 140), px: Math.round(parseFloat(getComputedStyle(h1).fontSize)) } : null,
    erster: { woerter: woerterErster, medienAnteil: +(medien / P).toFixed(2), textAufMedien: +(textAufMedien / P).toFixed(2), leerAnteil: +(leer / P).toFixed(2), flaechen: flaechen.slice(0, 5), handlungen: handlungen.length, knoepfe: knoepfe.length, knopfTexte: knoepfe.slice(0, 6).map((e) => e.textContent.replace(/\s+/g, " ").trim().slice(0, 40)), navLinks },
    farbe: { grundSeite, textfarben: textfarben.slice(0, 6) },
    bauteile: { radien, schattenElemente: schatten.n, karten, kleineIcons },
    raster: { kantenTop: kantenListe.slice(0, 6).map(([k, v]) => [+k, +(v / kantenSumme).toFixed(2)]), disziplinTop4: disziplin },
    bilder: { anzahl: imgs.length, randlos, formate },
    bewegung: { bibliotheken: Object.keys(bib).filter((k) => bib[k]), laufendeAnimationen: document.getAnimations().filter((a) => a.playState === "running").length, autoplayVideos: videos },
    plattform,
  };
}

async function kekseWeg(p) {
  const woerter = /^(accept|accept all|allow all|agree|i agree|got it|ok|okay|alle akzeptieren|akzeptieren|zustimmen|einverstanden|accepter|tout accepter|allow|continue)$/i;
  for (const e of await p.$$("button, a, [role=button]")) {
    try { const t = ((await e.innerText()) || "").trim(); if (woerter.test(t) && (await e.isVisible())) { await e.click({ timeout: 800 }); await p.waitForTimeout(400); return t; } } catch (_) { /* weiter */ }
  }
  return null;
}

async function durchscrollen(p) {
  await p.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < Math.min(h, 30000); y += innerHeight * 0.8) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
  await p.waitForTimeout(1200);
}

(async () => {
  let url = ziel, server = null;
  if (!/^https?:/.test(ziel)) { server = await statischerServer(path.resolve(ziel)); url = `http://localhost:${server.address().port}/`; }
  const exe = process.env.CHROME || undefined;
  const b = await chromium.launch({ executablePath: exe, args: ["--ignore-certificate-errors"] });
  const ergebnis = { name, url: ziel, gemessenAm: new Date().toISOString().slice(0, 10) };
  try {
    for (const [art, vp, mobil] of [["desktop", { width: 1440, height: 900 }, false], ["handy", { width: 390, height: 844 }, true]]) {
      const ctx = await b.newContext({ viewport: vp, isMobile: mobil, hasTouch: mobil, deviceScaleFactor: 1, ignoreHTTPSErrors: true, locale: "de-CH", userAgent: mobil ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" : undefined });
      const p = await ctx.newPage();
      try { await p.goto(url, { waitUntil: "networkidle", timeout: 45000 }); } catch (_) { try { await p.waitForLoadState("domcontentloaded", { timeout: 5000 }); } catch (__) { /* weiter */ } }
      await p.waitForTimeout(warten);
      const keks = await kekseWeg(p);
      await durchscrollen(p);
      await p.waitForTimeout(800);
      if (bilder && aus) {
        fs.mkdirSync(aus, { recursive: true });
        await p.screenshot({ path: path.join(aus, `${name}-${art}.jpg`), type: "jpeg", quality: 70 });
        if (art === "desktop") {
          const h = await p.evaluate(() => document.documentElement.scrollHeight);
          await p.screenshot({ path: path.join(aus, `${name}-ganz.jpg`), type: "jpeg", quality: 45, fullPage: h < 16000 });
        }
      }
      const m = await p.evaluate(messeImBrowser);
      // Bewegung nach 4 s ohne Zutun
      await p.waitForTimeout(1500);
      m.bewegung.laufendNach4s = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
      m.kekse = keks;
      ergebnis[art] = m;
      await ctx.close();
    }
  } catch (e) { ergebnis.fehler = String(e).slice(0, 300); }
  await b.close(); if (server) server.close();
  const json = JSON.stringify(ergebnis, null, 1);
  if (aus) { fs.mkdirSync(aus, { recursive: true }); fs.writeFileSync(path.join(aus, `${name}.json`), json); }
  console.log(json);
})();
