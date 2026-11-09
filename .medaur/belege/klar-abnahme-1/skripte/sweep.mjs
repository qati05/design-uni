import { browser, ctx, SEITEN, B, OUT, sleep, ueberlauf } from './gemein.mjs';
const b = await browser(); const erg = [];
for (const w of [320, 390, 1440]) {
  for (const rm of [false, true]) {
    if (rm && w === 320) continue;
    const c = await ctx(b, w, { rm });
    for (const [name, pfad] of SEITEN) {
      const p = await c.newPage();
      await p.goto(B + pfad, { waitUntil: 'networkidle' });
      await sleep(rm ? 300 : 1200);
      const info = await p.evaluate(() => {
        const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { const j = JSON.parse(s.textContent); return (j['@graph'] || [j]).map(x => x['@type']).join(','); } catch (e) { return 'PARSEFEHLER ' + e.message; } });
        return { h1: document.querySelectorAll('h1').length, h1t: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).join(' | '), titel: document.title.length, titelT: document.title, besch: (document.querySelector('meta[name=description]') || {}).content?.length || 0, ld, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, luecke: document.querySelectorAll('.luecke').length };
      });
      // ganz scrollen, dann nochmal Überlauf messen
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } window.scrollTo(0, 0); });
      const u2 = await ueberlauf(p);
      erg.push({ w, rm, name, ...info, sw2: u2.sw });
      if (!rm && (w === 390 || w === 1440)) await p.screenshot({ path: `${OUT}${name}-${w}-viewport.png` });
      if (rm && w === 390) await p.screenshot({ path: `${OUT}${name}-390-ganz.png`, fullPage: true });
      if (rm && w === 1440 && ['start', 'team', 'kontakt', 'schaden', 'l-unfall', 'flotten', 'impressum', 'datenschutz', 'leistungen', 'tesla'].includes(name)) await p.screenshot({ path: `${OUT}${name}-1440-ganz.png`, fullPage: true });
      await p.close();
    }
    erg.push({ log: { w, rm, ...c.log } });
    await c.close();
  }
}
await b.close();
console.log(JSON.stringify(erg, null, 1));
