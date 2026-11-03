const {chromium}=require('playwright'); const S='/tmp/claude-0/-home-user/ff5e4086-c01b-5a3e-ac02-6019be6adfa2/scratchpad';
const ok=(b,t)=>{ if(!b) throw new Error('FEHLER: '+t); console.log('ok  '+t); };
(async()=>{const b=await chromium.launch();
for (const [linie,B] of [['Klar','http://localhost:4344'],['Lack','http://localhost:4333']]){
 const p=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage();
 await p.goto(B+'/schaden-melden/'); await p.waitForTimeout(400);
 await p.click('label.art:has-text("Hagel")'); await p.waitForTimeout(500);
 await p.setInputFiles('[data-fotos]',[S+'/testfotos/a.jpg']); await p.waitForTimeout(900); await p.click('[data-fotoweiter]');
 ok(await p.isHidden('[data-tesla-modell]'),linie+': ohne Tesla keine Modellwahl');
 await p.check('[data-tesla]',{force:true}); await p.waitForTimeout(200);
 ok(await p.isVisible('[data-tesla-modell]'),linie+': «Es ist ein Tesla» zeigt die Modelle');
 await p.click('[data-tesla-modell] label:has-text("Model Y")'); await p.fill('#f-name','Test'); await p.fill('#f-tel','079 555 00 00');
 if(linie==='Klar') await p.screenshot({path:S+'/klar/form-tesla-m.png',fullPage:true});
 await p.click('[data-senden="website"]'); await p.waitForTimeout(500);
 ok(/Tesla Model Y/.test(await p.textContent('[data-r-art]')),linie+': Bestätigung nennt «Tesla Model Y»');
 if(linie==='Klar') await p.screenshot({path:S+'/klar/form-bestaetigung-m.png'});
 await p.goto(B+'/schaden-melden/?fahrzeug=tesla'); await p.waitForTimeout(300);
 ok(await p.isChecked('[data-tesla]') && !(await p.$eval('[data-tesla-modell]',e=>e.hidden)),linie+': von der Tesla-Seite: Tesla vorgewählt, Modelle sichtbar');
 await p.close();
}
await b.close(); console.log('ALLES GRÜN');})().catch(e=>{console.error(e.message);process.exit(1)});
