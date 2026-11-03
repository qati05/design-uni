# Baut den Demo-Bau als eine Datei: vorschau/auto-speedy-demo.html
# Links das Kundenhandy (echte Website aus astro/dist, mit Demo-Haken), rechts Auto Speedy (Postfach, WhatsApp, Cockpit-Nachbau).
# Aufruf: python3 vorschau-bau/demo_bau.py   (vorher: cd astro && npx astro build)
import base64, json, os, re, subprocess, sys, tempfile

HIER = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HIER)
KLAR = '--linie' in sys.argv and sys.argv[sys.argv.index('--linie') + 1] == 'klar'
DIST = os.path.join(PROJ, 'astro-klar' if KLAR else 'astro', 'dist')
ZIEL = os.path.join(PROJ, 'vorschau', 'auto-speedy-demo-klar.html' if KLAR else 'auto-speedy-demo.html')

tmp = tempfile.mkdtemp()
subprocess.run([sys.executable, os.path.join(HIER, 'art_bau.py'), DIST, tmp, 'demo'], check=True, env={**os.environ, 'LINIE': 'klar' if KLAR else 'lack'})
subprocess.run([sys.executable, os.path.join(HIER, 'einzel.py'), tmp, os.path.join(tmp, 'website.html')], check=True)
website = open(os.path.join(tmp, 'website.html'), encoding='utf8').read()

def uri(pfad, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(pfad, 'rb').read()).decode()

cockpit = os.path.join(PROJ, 'cockpit')
css = open(os.path.join(cockpit, 'app', 'globals.css'), encoding='utf8').read()
css = re.sub(r'url\("/fonts/([^"]+)"\)', lambda m: 'url("' + uri(os.path.join(cockpit, 'public', 'fonts', m.group(1)), 'font/woff2') + '")', css)
css += '\n' + open(os.path.join(HIER, 'demo.css'), encoding='utf8').read()
if KLAR: css += '\nbody { background: #f4f5f7; } .d-band { background: #fff; border-bottom-color: #e1e4e8; }'
js = open(os.path.join(HIER, 'demo.js'), encoding='utf8').read()
logo = uri(os.path.join(cockpit, 'public', 'bilder', 'logo-96.webp'), 'image/webp')
# JSON in <script>: «</» maskieren, damit der Website-Text das Skript nicht beendet
daten = json.dumps(website).replace('</', '<\\/')

FINGER = '<svg id="d-finger-symbol" hidden aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 11v3m-4-3a4 4 0 1 1 8 0v2a8 8 0 0 1-1 4M6.5 8.5A6.5 6.5 0 0 1 18.5 11v1M5 13.5c.3 2 1 3.6 2 5M9 21c-.6-1-1-2.4-1-4v-6"/></svg>'

seite = f'''<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Auto Speedy Demo{' (Linie Klar)' if KLAR else ''}</title>
<style>{css}</style>
</head>
<body>
<div class="d-band"><b>Demo</b><span>So funktioniert Ihr neues System. Nichts wird gesendet, alles bleibt in diesem Browser. Beispiel-Meldungen sind markiert.</span><span class="d-uhrzeit">Demo-Uhr: <b id="d-uhr"></b></span><button type="button" class="knopf leise" id="d-vorspulen">24 Std. vorspulen</button><button type="button" class="knopf leise" id="d-neu">Neu starten</button></div>
<nav id="d-rundgang" aria-label="Rundgang"><ol></ol></nav>
<div class="d-buehne">
  <section class="d-kunde" aria-label="Kunde"><h2 class="d-titel">Kunde · Handy</h2><div class="d-handy"><iframe id="d-website" title="Website auf dem Handy des Kunden"></iframe></div></section>
  <section class="d-betrieb" aria-label="Auto Speedy"><h2 class="d-titel">Auto Speedy · Laptop</h2>
    <div class="d-betrieb__rahmen">
      <div class="d-reiter" role="tablist">
        <button type="button" role="tab" data-reiter="postfach">Postfach <span class="d-zahl" hidden></span></button>
        <button type="button" role="tab" data-reiter="whatsapp">WhatsApp <span class="d-zahl" hidden></span></button>
        <button type="button" role="tab" data-reiter="cockpit">Cockpit <span class="d-zahl" hidden></span></button>
        <button type="button" role="tab" data-reiter="ablauf" class="d-reiter__ablauf">Ablauf im Hintergrund <span class="d-zahl" hidden></span></button>
      </div>
      <div id="d-fenster" role="tabpanel"></div>
    </div>
  </section>
</div>
<div id="d-toast" role="status" aria-live="polite"></div>
<div id="d-finger" hidden><div class="d-finger__karte">{FINGER.replace('id="d-finger-symbol" hidden ', '')}<b>Touch ID</b><span class="d-finger__text">Auto Speedy Cockpit: Finger auflegen</span><span class="unterzeile">Demo: nachgestellt</span></div></div>
{FINGER}
<img id="d-logo" src="{logo}" alt="" hidden>
<script type="application/json" id="d-website-html">{daten}</script>
<script>{js}</script>
</body>
</html>
'''
open(ZIEL, 'w', encoding='utf8').write(seite)
print(ZIEL, round(len(seite) / 1e6, 2), 'MB')
