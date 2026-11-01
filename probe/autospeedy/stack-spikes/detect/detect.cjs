const { chromium } = require("playwright");
const sites = ["https://www.autospeedy.ch/","https://www.migros.ch/de","https://www.coop.ch/de","https://www.swisscom.ch/de/privatkunden.html","https://www.sbb.ch/de","https://www.ubs.com/ch/de.html","https://www.tesla.com/de_ch","https://www.apple.com/chde/","https://www.bmw.ch/de/index.html","https://www.amag.ch/","https://www.post.ch/de","https://www.nike.com/ch/de","https://www.ikea.com/ch/de/","https://www.nytimes.com/","https://github.com/","https://www.airbnb.ch/","https://www.zalando.ch/","https://www.vw.ch/","https://www.mercedes-benz.ch/passengercars.html","https://www.lufthansa.com/ch/de/homepage"];
const sigs = [
 ["Next.js", h=>/\/_next\/|__NEXT_DATA__|next-route-announcer/.test(h)],
 ["Nuxt", h=>/\/_nuxt\/|__NUXT__/.test(h)],
 ["Gatsby", h=>/___gatsby|\/page-data\//.test(h)],
 ["Astro", h=>/\/_astro\/|astro-island/.test(h)],
 ["Angular", h=>/ng-version=|<app-root/.test(h)],
 ["Vue", h=>/data-v-[0-9a-f]{6}|data-server-rendered|vue/i.test(h)&&false],
 ["Adobe Experience Manager", h=>/\/etc\.clientlibs\/|\/content\/dam\/|clientlib-/.test(h)],
 ["Sitecore", h=>/sitecore|\/-\/media\//i.test(h)],
 ["WordPress", h=>/wp-content|wp-includes/.test(h)],
 ["Drupal", h=>/drupal-settings-json|\/sites\/default\/files/.test(h)],
 ["Wix", h=>/wixstatic\.com|static\.parastorage\.com/.test(h)],
 ["Shopify", h=>/cdn\.shopify\.com/.test(h)],
 ["Salesforce Commerce", h=>/demandware|\/on\/demandware\.static/.test(h)],
 ["Contentful/Sanity/Storyblok (Bild-CDN)", h=>/ctfassets\.net|cdn\.sanity\.io|storyblok\.com/.test(h)],
 ["Adobe Launch/Analytics", h=>/assets\.adobedtm\.com|omtrdc\.net/.test(h)],
 ["Google Tag Manager", h=>/googletagmanager\.com/.test(h)],
 ["React (data-reactroot/ __reactFiber)", h=>/data-reactroot|__reactContainer|data-react-helmet/.test(h)],
];
(async()=>{
  const b = await chromium.launch({args:["--no-sandbox"]});
  for (const url of sites) {
    const ctx = await b.newContext({ userAgent:"Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36", viewport:{width:412,height:915}, locale:"de-CH", ignoreHTTPSErrors:true });
    const p = await ctx.newPage(); const urls=[]; p.on("request",r=>urls.push(r.url()));
    let status="?";
    try { const r = await p.goto(url,{waitUntil:"load",timeout:35000}); status=r?r.status():"-"; await p.waitForTimeout(2500); } catch(e){ status="Fehler:"+String(e.message).split("\n")[0].slice(0,40); }
    let html=""; try{ html=await p.content(); }catch(e){}
    const g = await p.evaluate(()=>({next:!!window.__NEXT_DATA__||!!window.next, nuxt:!!window.__NUXT__, ng:!!document.querySelector("[ng-version]"), jq:!!window.jQuery, react:!!document.querySelector("[data-reactroot]")||Object.keys(document.body||{}).some(k=>k.startsWith("__reactContainer")), vue:!!window.__VUE__||!!document.querySelector("[data-v-app]"), title:document.title.slice(0,50)})).catch(()=>({}));
    const all = html+"\n"+urls.join("\n");
    const hit = sigs.filter(([n,f])=>f(all)).map(s=>s[0]);
    if(g.next && !hit.includes("Next.js")) hit.push("Next.js");
    if(g.nuxt && !hit.includes("Nuxt")) hit.push("Nuxt");
    if(g.vue) hit.push("Vue");
    if(g.jq) hit.push("jQuery");
    console.log(JSON.stringify({url,status,titel:g.title,bytesHtml:html.length,anfragen:urls.length,tech:hit}));
    await ctx.close();
  }
  await b.close();
})();
