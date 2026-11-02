#!/usr/bin/env node
// Kunden-Simulator für Kunden-Agenten (Design-Uni, Prüfpunkt DP7).
//
// Aufruf:
//   node kunde.cjs <website> '<aktionen-json>' <bild.png> [startseite]
//
//   <website>     Ordner einer statischen Website (wird lokal ausgeliefert)
//                 oder eine URL (http://… / https://…)
//   <aktionen>    JSON-Liste, wird bei jedem Aufruf von vorn abgespielt
//   <bild.png>    Pfad für das Bildschirmfoto nach der letzten Aktion
//   [startseite]  Einstieg relativ zur Website, Standard: index.html
//                 (z. B. leistungen/notfall.html für «Suchmaschine → Unterseite»)
//
// Umgebung (optional): KUNDE_BREITE (390), KUNDE_HOEHE (844)
//
// Aktionen:
//   {"tippe":"Text"}             tippt das sichtbare Bedienelement mit diesem Namen
//                                (Knopf, Link, Auswahl), nahe der Bildschirmmitte
//   {"fuelle":["Feld","Wert"]}   füllt das Feld mit dieser Beschriftung
//   {"waehle":["Feld","Option"]} wählt in einer Auswahlliste
//   {"scroll":600}               scrollt um so viele Pixel (negativ = hoch)
//   {"zurueck":true}             Browser zurück
//
// Protokoll: «ANRUF AUSGELÖST» bei tel:-Links (mit Warnung, wenn die Nummer
// nicht wählbar aussieht), «ROUTE GEÖFFNET» bei Karten-Links, «VERDECKT», wenn
// an der Mitte des Elements etwas anderes liegt (dann trifft der Tipp das, was
// obenauf liegt, wie bei einem Menschen).
// Benötigt: npm i playwright && npx playwright install chromium

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const [, , ziel, aktJson, bild, start = 'index.html'] = process.argv;
if (!ziel || !bild) {
  console.error("Aufruf: node kunde.cjs <website-ordner|url> '<aktionen-json>' <bild.png> [startseite]");
  process.exit(2);
}
let akt;
try { akt = JSON.parse(aktJson || '[]'); } catch (e) { console.error('Aktionen sind kein gültiges JSON: ' + e.message); process.exit(2); }
const BREITE = Number(process.env.KUNDE_BREITE) || 390;
const HOEHE = Number(process.env.KUNDE_HOEHE) || 844;
const istUrl = /^https?:\/\//i.test(ziel);

const typ = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8' };

function server(wurzel) {
  const basis = path.resolve(wurzel);
  return http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0].split('#')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(basis, p);
    if (!f.startsWith(basis)) { r.writeHead(403); r.end('403'); return; }
    fs.readFile(f, (e, d) => {
      if (e) { r.writeHead(404); r.end('404'); return; }
      r.writeHead(200, { 'content-type': typ[path.extname(f).toLowerCase()] || 'application/octet-stream' });
      r.end(d);
    });
  });
}

// Wählbar aussehende Nummer: + und 8–15 Ziffern, keine «(0)», keine Leerzeichen.
function telPruefen(href) {
  const n = href.replace(/^tel:/i, '');
  if (!/^\+\d{8,15}$/.test(n)) return ` · WARNUNG: Nummer «${n}» sieht nicht wählbar aus`;
  if (n.startsWith('+41') && n.length !== 12) return ` · WARNUNG: Schweizer Nummer braucht 9 Ziffern nach +41, hat ${n.length - 3}`;
  return '';
}

async function kandidat(p, name) {
  const kand = [
    p.getByRole('button', { name }), p.getByRole('link', { name }),
    p.getByRole('radio', { name }), p.getByRole('checkbox', { name }),
    p.getByRole('option', { name }), p.getByLabel(name, { exact: false }),
    p.getByText(name, { exact: false }),
  ];
  for (const k of kand) {
    const v = k.filter({ visible: true });
    const n = await v.count();
    if (!n) continue;
    let best = null, bd = Infinity;
    for (let i = 0; i < n; i++) {
      const bb = await v.nth(i).boundingBox().catch(() => null);
      if (!bb) continue;
      const d = Math.abs(bb.y + bb.height / 2 - HOEHE / 2);
      if (d < bd) { bd = d; best = v.nth(i); }
    }
    if (best) return best;
  }
  return null;
}

async function lauf(startUrl) {
  const log = [];
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: BREITE, height: HOEHE }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(startUrl);
  await p.waitForTimeout(600);

  for (const a of akt) {
    try {
      if (a.tippe) {
        const el = await kandidat(p, a.tippe);
        if (!el) throw new Error('nichts mit diesem Text sichtbar');
        const info = await el.evaluate(n => ({
          tag: n.tagName.toLowerCase(),
          wahl: n.type === 'radio' || n.type === 'checkbox',
          href: (n.closest('a') || {}).href || '',
        })).catch(() => ({ tag: '?', wahl: false, href: '' }));
        if (info.wahl) { await el.check({ force: true }); await p.waitForTimeout(300); log.push(`gewählt: ${a.tippe}`); continue; }

        await el.scrollIntoViewIfNeeded().catch(() => {});
        await p.waitForTimeout(150);
        const bb = await el.boundingBox();
        const x = bb.x + bb.width / 2, y = bb.y + bb.height / 2;
        const oben = await el.evaluate((n, [px, py]) => {
          const t = document.elementFromPoint(px, py);
          if (!t || t === n || n.contains(t) || t.contains(n)) return null;
          const a = t.closest('a, button, [role=button]');
          return { name: (t.closest('[class]') || t).tagName.toLowerCase() + (t.className && typeof t.className === 'string' ? '.' + t.className.split(/\s+/)[0] : ''), text: (t.innerText || '').trim().slice(0, 40), href: a && a.href ? a.href : '' };
        }, [x, y]);

        if (oben) {
          log.push(`VERDECKT: «${a.tippe}» liegt unter ${oben.name} «${oben.text}»; der Tipp trifft das obere Element`);
          if (oben.href.startsWith('tel:')) { log.push(`ANRUF AUSGELÖST: ${oben.href}${telPruefen(oben.href)}`); continue; }
          await p.touchscreen.tap(x, y); await p.waitForTimeout(500);
          continue;
        }
        if (info.href.startsWith('tel:')) { log.push(`ANRUF AUSGELÖST: ${info.href}${telPruefen(info.href)}`); continue; }
        if (/maps|route|google\.[a-z.]+\/maps|apple\.com\/maps|openstreetmap|map\.search\.ch/i.test(info.href)) { log.push(`ROUTE GEÖFFNET: ${info.href}`); continue; }
        await el.click({ timeout: 4000 });
        await p.waitForTimeout(500);
        log.push(`getippt: ${a.tippe} (${info.tag})`);
      } else if (a.fuelle) {
        await p.getByLabel(a.fuelle[0], { exact: false }).first().fill(String(a.fuelle[1]));
        log.push(`gefüllt: ${a.fuelle[0]}`);
      } else if (a.waehle) {
        const f = p.getByLabel(a.waehle[0], { exact: false }).first();
        await f.selectOption({ label: a.waehle[1] }).catch(() => f.selectOption(a.waehle[1]));
        log.push(`gewählt: ${a.waehle[0]}`);
      } else if (a.scroll) {
        await p.mouse.wheel(0, a.scroll); await p.waitForTimeout(400);
        log.push(`gescrollt ${a.scroll}`);
      } else if (a.zurueck) {
        await p.goBack(); await p.waitForTimeout(500);
        log.push('zurück');
      } else {
        log.push(`unbekannte Aktion: ${JSON.stringify(a)}`);
      }
    } catch (e) {
      log.push(`FEHLER bei ${JSON.stringify(a)}: ${String(e.message).split('\n')[0]}`);
    }
  }

  fs.mkdirSync(path.dirname(path.resolve(bild)), { recursive: true });
  await p.screenshot({ path: bild });
  const els = await p.evaluate(() => {
    const out = [];
    for (const n of document.querySelectorAll('a,button,input,select,textarea,label,summary,[role=button]')) {
      const r = n.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight) continue;
      const s = getComputedStyle(n);
      if (s.visibility === 'hidden' || s.display === 'none') continue;
      const t = (n.innerText || n.value || n.getAttribute('aria-label') || n.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 60);
      if (t) out.push(`${n.tagName.toLowerCase()}: ${t}`);
    }
    return [...new Set(out)].slice(0, 40);
  });
  console.log(`Seite: ${new URL(p.url()).pathname}\nProtokoll:\n  ${log.join('\n  ') || '(keine Aktion)'}\nSichtbar jetzt:\n  ${els.join('\n  ')}\nBild: ${bild}`);
  await b.close();
}

if (istUrl) {
  lauf(new URL(start, ziel.endsWith('/') ? ziel : ziel + '/').href).catch(e => { console.error(e); process.exit(1); });
} else {
  if (!fs.existsSync(ziel)) { console.error(`Ordner nicht gefunden: ${ziel}`); process.exit(2); }
  const srv = server(ziel);
  srv.listen(0, '127.0.0.1', () => {
    const port = srv.address().port;
    lauf(`http://127.0.0.1:${port}/${start.replace(/^\//, '')}`)
      .catch(e => { console.error(e); process.exitCode = 1; })
      .finally(() => srv.close());
  });
}
