import re, sys, os, shutil, html as H
# Baut aus astro/dist eine Seite mit allen Ansichten (Hash-Routing). Drittes Argument «demo»: Haken für den Demo-Bau.
D=sys.argv[1]; O=sys.argv[2]; DEMO=len(sys.argv)>3 and sys.argv[3]=='demo'
KLAR=os.environ.get('LINIE')=='klar'  # zweite Linie «Klar» (astro-klar/dist)
views=[('start','index.html'),('schaden-melden','schaden-melden/index.html'),('tesla','tesla/index.html'),('leistungen','leistungen/index.html'),('occasionen','occasionen/index.html'),('team','team/index.html'),('kontakt','kontakt/index.html'),('flotten','flotten/index.html'),('bewerten','bewerten/index.html'),('impressum','impressum/index.html'),('datenschutz','datenschutz/index.html')] if KLAR else [('start','index.html'),('schaden-melden','schaden-melden/index.html'),('tesla','tesla/index.html'),('carrosserie','carrosserie/index.html'),('lackiererei','lackiererei/index.html'),('felgen-folierung','felgen-folierung/index.html'),('occasionen','occasionen/index.html'),('team','team/index.html'),('kontakt','kontakt/index.html'),('flotten','flotten/index.html'),('bewerten','bewerten/index.html'),('impressum','impressum/index.html'),('datenschutz','datenschutz/index.html')]
def rw(s):
    s=re.sub(r'href="/schaden-melden/\?([^"]+)"',r'href="#schaden-melden" data-abfrage="\1"',s)
    s=re.sub(r'href="/([a-z-]+)/(?:#[a-z-]+)?"',r'href="#\1"',s)
    s=s.replace('href="/"','href="#start"')
    s=re.sub(r'(src|srcset)="([^"]*)"',lambda m:m.group(1)+'="'+m.group(2).replace('/bilder/','bilder/')+'"',s)
    s=re.sub(r'(<form id="schaden-form"[^>]*?) action="[^"]*"',r'\1',s)
    return s
first=open(os.path.join(D,'index.html'),encoding='utf8').read()
if KLAR:
    # alles zwischen <body> und <main> (Sprunglink, Vorschau, Kopf, Menü-Blatt) und nach </main> (Fuss), ohne Skripte
    header=rw(re.search(r'<body[^>]*>(.*?)<main',first,re.S).group(1))
    header=re.sub(r'<p data-vorschau>.*?</p>','',header,flags=re.S).replace('<a class="sprung" href="#inhalt">','<a class="sprung" href="#inhalt" data-sprung>')
    footer=rw(re.sub(r'<script.*?</script>','',re.search(r'</main>(.*?)</body>',first,re.S).group(1),flags=re.S))
    vor=re.search(r'<p data-vorschau>.*?</p>',first,re.S).group(0)
else:
    header=rw(re.search(r'<header>.*?</header>',first,re.S).group(0))
    footer=rw(re.search(r'<footer>.*?</footer>',first,re.S).group(0))
    vor=re.search(r'<p data-vorschau>.*?</p>',first,re.S).group(0)
ld=re.search(r'<script is:inline type="application/ld\+json".*?</script>|<script type="application/ld\+json">.*?</script>',first,re.S)
secs=[]; titles={}
for v,f in views:
    s=open(os.path.join(D,f),encoding='utf8').read()
    titles[v]=H.unescape(re.search(r'<title>(.*?)</title>',s).group(1))
    m=re.search(r'<main id="inhalt">(.*?)</main>',s,re.S).group(1)
    m=re.sub(r'<script.*?</script>','',m,flags=re.S)
    m=m.replace('loading="lazy"','') if v=='start' else m
    secs.append(f'<div class="ansicht" data-ansicht="{v}"{"" if v=="start" else " hidden"}>{rw(m)}</div>')
js_dateien=['js/schaden.js','js/rueckruf.js','js/klar.js'] if KLAR else ['js/schaden.js','js/lack.js','js/rueckruf.js']
extra='\n'.join(open(os.path.join(D,f),encoding='utf8').read() for f in js_dateien)
if DEMO:
    haken=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'demo-haken.js'),encoding='utf8').read()
    def ersetze(a,b):
        global extra
        assert a in extra, a
        extra=extra.replace(a,b,1)
    ersetze('if (weg === "whatsapp") {','if (weg === "whatsapp" && window.__demo) { window.__demo("whatsapp", { text: text, art: art(), fotos: fotos.map(function (x) { return x.blob; }) }); bestaetige("Meldung per WhatsApp", "Demo: WhatsApp hätte sich geöffnet. Nach Senden erscheint die Nachricht auf dem WhatsApp von Auto Speedy (rechts).", null); return; }\n      if (weg === "whatsapp") {')
    ersetze('if (!ep) {\n        bestaetige(','if (!ep && window.__demo) { window.__demo("meldung", { art: art(), tesla: tesla(), stellen: gewaehlt(), bemerkung: wert("bemerkung"), name: wert("name"), telefon: wert("telefon"), email: wert("email"), fotos: fotos.map(function (x) { return x.blob; }) }); bestaetige("Schadenmeldung angekommen", "Angekommen bei Auto Speedy. Wir melden uns bei Ihnen.", null); return; }\n      if (!ep) {\n        bestaetige(')
    ersetze('if (!ep) { melde(f.dataset.istVorschau','if (!ep && window.__demo) { window.__demo("rueckruf", { name: wert("name"), telefon: wert("telefon"), anliegen: anliegen() }); melde("Angekommen. Wir rufen Sie zurück. Anliegen: " + anliegen() + "."); f.querySelector(\'button[type="submit"]\').disabled = true; return; }\n      if (!ep) { melde(f.dataset.istVorschau')
    extra=haken+'\n'+extra
    vor=''
hs=re.search(r'<script>\s*\(function \(\) \{\s*var info = .*?</script>',first,re.S)
if hs: extra+='\n'+re.sub(r'</?script>','',hs.group(0))
css=''.join(open(os.path.join(D,f),encoding='utf8').read() for f in (['css/klar.css'] if KLAR else ['css/technik.css','css/autospeedy.css']))
css=css.replace('url("/fonts/','url("fonts/').replace('url("/bilder/','url("bilder/')
css+='''
header{top:env(safe-area-inset-top,0px)}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:25;background:#f3f5f6}
:root{color-scheme:light}
@media (max-width:860px){header .aktionen{padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))}}
'''
js='''<script>
(function(){
var T=%s, ans=[].slice.call(document.querySelectorAll('[data-ansicht]'));
function zeig(){var h=(location.hash||'#start').slice(1); if(!T[h]) h='start';
 ans.forEach(function(a){a.hidden=a.getAttribute('data-ansicht')!==h});
 document.title=T[h]; document.body.setAttribute('data-seite', h==='start'?'index':h);
 [].forEach.call(document.querySelectorAll('header a[href^="#"]'),function(a){var p=a.getAttribute('href').slice(1); if(p===h&&h!=='start') a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');});
 [].forEach.call(document.querySelectorAll('details.menue,[data-leistungen]'),function(d){d.open=false;}); window.scrollTo(0,0);}
window.addEventListener('hashchange',zeig); zeig();
document.addEventListener('click',function(e){var z=e.target.closest('[data-abfrage]'); if(z){var q=new URLSearchParams(z.getAttribute('data-abfrage').replace(/&amp;/g,'&')); setTimeout(function(){ if(window.__schaden) window.__schaden.anwenden(q); },60);}});

})();
</script>''' % (repr(titles).replace("'",'"'))
if DEMO:
    # In der Datei auf dem Laptop (file://) darf das eingebettete Handy nicht über location.hash navigieren: eigene Navigation.
    js=js.replace("function zeig(){var h=(location.hash||'#start').slice(1);","var AKT='#start'; window.__gehe=function(x){AKT=x; zeig();}; function zeig(){var h=(AKT||'#start').slice(1);")
    js=js.replace("window.addEventListener('hashchange',zeig);","document.addEventListener('click',function(e){var a=e.target.closest('a[href^=\"#\"]'); if(!a) return; var z=a.getAttribute('href'); e.preventDefault(); if(T[z.slice(1)]) window.__gehe(z); else { var el=document.getElementById(z.slice(1)); if(el) el.scrollIntoView(); }});")
    assert 'window.__gehe' in js and 'hashchange' not in js
js=js.replace('</script>', extra+'\n</script>')
titel='Auto Speedy Demo' if DEMO else 'Auto Speedy Vorschau'
kopfskript='<script>document.documentElement.classList.add("js")</script>' if KLAR else '<script>try{{document.documentElement.setAttribute("data-lack",matchMedia("(prefers-color-scheme: dark)").matches?"dunkel":"hell")}}catch(e){{}}</script>'.replace('{{','{').replace('}}','}')
out=f'''<title>{titel}</title>
{kopfskript}
<style>{css}</style>
<a class="sprung" href="#inhalt">Zum Inhalt springen</a>
{vor}
{header}
<main id="inhalt">{''.join(secs)}</main>
{footer}
{js}
'''
os.makedirs(O,exist_ok=True)
open(os.path.join(O,'index.html'),'w',encoding='utf8').write(out)
for d in ('bilder','fonts'):
    shutil.rmtree(os.path.join(O,d),ignore_errors=True); shutil.copytree(os.path.join(D,d),os.path.join(O,d))
print(len(out), len(os.listdir(os.path.join(O,'bilder'))))
