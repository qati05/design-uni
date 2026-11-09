// Prüft alle Seiten der Linie «Klar»: Überlauf, kleine Tippziele, Alt-Texte, kaputte Bilder, eine h1, Konsole, tote Links; macht Bildschirmfotos.
const {chromium}=require('playwright'); const B='http://localhost:4344';
const SEITEN=['/','/schaden-melden/','/tesla/','/leistungen/','/occasionen/','/team/','/kontakt/','/bewerten/','/impressum/','/datenschutz/','/gibtsnicht/'];
const start=process.env.CHROME?{executablePath:process.env.CHROME,args:['--no-sandbox']}:{};
(async()=>{const b=await chromium.launch(start); const links=new Set(); let probleme=[];
for (const [n,v,m] of [['d',{width:1440,height:900},false],['m',{width:390,height:844},true]]){
 const ctx=await b.newContext({viewport:v,isMobile:m,hasTouch:m}); const p=await ctx.newPage();
 const fe=[]; p.on('pageerror',e=>fe.push(e.message)); p.on('console',x=>{if(x.type()==='error'&&!/404/.test(x.text()))fe.push(x.text())});
 for (const s of SEITEN){ await p.goto(B+s); await p.waitForTimeout(500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30));} window.scrollTo(0,0);}); await p.waitForTimeout(400);
  const r=await p.evaluate(()=>{
    const w=document.documentElement.scrollWidth;
    const klein=[...document.querySelectorAll('a,button,summary,label.art')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&(r.height<40) && getComputedStyle(e).display!=='inline' && !e.closest('.fuss,p,small,figcaption,td,.sprung')}).map(e=>e.textContent.trim().slice(0,20)+':'+Math.round(e.getBoundingClientRect().height));
    const ohneAlt=[...document.querySelectorAll('img')].filter(i=>!i.hasAttribute('alt')).length; const kaputt=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.slice(-40));
    const l=[...document.querySelectorAll('a[href^="/"]')].map(a=>a.getAttribute('href').split('#')[0].split('?')[0]);
    return {w,klein,ohneAlt,kaputt,l,h1:document.querySelectorAll('h1').length};});
  r.l.forEach(x=>links.add(x));
  if(r.w>v.width||r.ohneAlt||r.kaputt.length||r.h1!==1||r.klein.length) probleme.push(n+' '+s+' '+JSON.stringify({w:r.w,klein:r.klein.slice(0,4),ohneAlt:r.ohneAlt,kaputt:r.kaputt,h1:r.h1}));
  const name=s==='/'?'start':s.replace(/\//g,'');
  await p.screenshot({path:`klar/s-${name}-${n}.png`,fullPage:true});
 }
 if(fe.length) probleme.push(n+' Konsole: '+fe.join(' | '));
 await ctx.close();
}
const p=await b.newPage(); for (const l of links){ const r=await p.goto(B+l); if(r.status()>=400) probleme.push('toter Link '+l+' '+r.status()); }
console.log(probleme.length?probleme.join('\n'):'keine Probleme'); console.log('Links geprüft:',links.size); await b.close();})();
