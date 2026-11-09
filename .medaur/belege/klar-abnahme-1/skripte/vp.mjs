import { browser, ctx, SEITEN, B, OUT, sleep } from './gemein.mjs';
const b = await browser(); const out = [];
for (const w of [390, 1440]) { const c = await ctx(b, w, {});
  for (const [name, pfad] of SEITEN) { const p = await c.newPage(); await p.goto(B + pfad, { waitUntil: 'networkidle' }); await sleep(1200);
    out.push(name + ' ' + w + ' scrollY=' + await p.evaluate(() => scrollY)); await p.screenshot({ path: `${OUT}${name}-${w}-viewport.png` }); await p.close(); }
  await c.close(); }
console.log(out.join('\n')); await b.close();
