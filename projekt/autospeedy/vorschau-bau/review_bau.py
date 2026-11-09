# Baut aus astro-klar/dist EINE offline klickbare Datei aller Seiten (Review für den Betrieb).
# Bilder, Schriften und Skripte eingebettet; jede Seite ist eine Ansicht (Hash-Routing «#/pfad/»).
# Formulare senden nicht (kein Endpunkt, kein mailto, WhatsApp wird nur angezeigt) und sagen das.
# Aufruf: python3 vorschau-bau/review_bau.py astro-klar/dist ZIEL.html   (vorher: cd astro-klar && npm run build)
import base64, html as H, json, os, re, sys

D = sys.argv[1]; ZIEL = sys.argv[2]
BAND = 'Vorschau zum Prüfen · nichts wird gesendet'
# Alle Seiten ausser Cockpit (/admin/), 404 und dem QR-Druckblatt
SEITEN = sorted(
    os.path.relpath(os.path.join(w, f), D) for w, _, fs in os.walk(D) for f in fs
    if f == 'index.html' and not re.match(r'(admin|bewerten/druck)/', os.path.relpath(os.path.join(w, f), D)))

MIME = {'.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon'}
cache = {}
def uri(p):
    p = p.split('?')[0].lstrip('/')
    if p not in cache:
        cache[p] = f'data:{MIME[os.path.splitext(p)[1]]};base64,' + base64.b64encode(open(os.path.join(D, p), 'rb').read()).decode()
    return cache[p]

def waehle(srcset):
    # w-Angaben: grösste Variante bis 1000 px (sonst kleinste); x-Angaben: 2x
    kand = [c.strip().rsplit(' ', 1) for c in srcset.split(',') if c.strip()]
    if all(len(k) == 2 and k[1].endswith('w') for k in kand):
        kand = sorted(kand, key=lambda k: int(k[1][:-1]))
        bis = [k for k in kand if int(k[1][:-1]) <= 1000]
        return (bis[-1] if bis else kand[0])[0]
    for k in kand:
        if len(k) == 2 and k[1] == '2x': return k[0]
    return kand[-1][0]

def bild(m):
    tag = m.group(0)
    ss = re.search(r'\ssrcset="([^"]*)"', tag)
    src = waehle(H.unescape(ss.group(1))) if ss else re.search(r'\ssrc="([^"]*)"', tag).group(1)
    tag = re.sub(r'\s(srcset|sizes|loading)="[^"]*"', '', tag)  # eingebettet: lazy bringt nichts, stört Ganzseiten-Fotos
    if src.startswith('/'): tag = re.sub(r'\ssrc="[^"]*"', f' src="{uri(src)}"', tag)
    return tag

def route(pfad):
    # «/kontakt/#zeiten» -> «#/kontakt/@zeiten», «/schaden-melden/?art=x» -> «#/schaden-melden/?art=x»
    pfad = H.unescape(pfad)
    anker = ''
    if '#' in pfad: pfad, anker = pfad.split('#', 1)
    return '#' + pfad + ('@' + anker if anker else '')

def umschreiben(s):
    s = re.sub(r'<source[^>]*>', '', s)
    s = re.sub(r'<img\b[^>]*>', bild, s)
    s = re.sub(r'href="(/(?:[a-z0-9-]+/)*(?:[?#][^"]*)?)"', lambda m: 'href="' + H.escape(route(m.group(1))) + '"', s)
    s = re.sub(r'(<form\b[^>]*?)\saction="[^"]*"', r'\1', s)
    s = re.sub(r'<script\b.*?</script>', '', s, flags=re.S)
    s = re.sub(r'<p data-vorschau>.*?</p>', '', s, flags=re.S)
    return s

erste = open(os.path.join(D, 'index.html'), encoding='utf8').read()
kopf = umschreiben(re.search(r'<body[^>]*>(.*?)<main', erste, re.S).group(1))
fuss = umschreiben(re.search(r'</main>(.*?)</body>', erste, re.S).group(1))
ansichten, titel, seiten_attr = [], {}, {}
for f in SEITEN:
    s = open(os.path.join(D, f), encoding='utf8').read()
    r = '/' + os.path.dirname(f) + ('/' if os.path.dirname(f) else '')
    titel[r] = H.unescape(re.search(r'<title>(.*?)</title>', s).group(1))
    seiten_attr[r] = re.search(r'<body[^>]*data-seite="([^"]*)"', s).group(1)
    m = re.search(r'<main id="inhalt">(.*?)</main>', s, re.S).group(1)
    ansichten.append(f'<div class="pruef-ansicht" data-route="{r}" hidden>{umschreiben(m)}</div>')

css = open(os.path.join(D, 'css', 'klar.css'), encoding='utf8').read()
css = re.sub(r'url\("(/(?:fonts|bilder)/[^"]+)"\)', lambda m: f'url("{uri(m.group(1))}")', css)
css += '''
/* Review-Datei: festes Prüfband oben, Kopf rückt darunter */
:root { --pruef-hoehe: 28px; color-scheme: light; }
body { padding-top: var(--pruef-hoehe); }
.pruef-band { position: fixed; inset: 0 0 auto; z-index: 60; height: var(--pruef-hoehe); display: flex; align-items: center; justify-content: center; margin: 0; padding: 0 12px; background: #6b4300; color: #fff; font: 600 12px/1 var(--schrift); letter-spacing: .02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.kopf { top: calc(var(--hinweis-hoehe, 0px) + var(--pruef-hoehe)); }
.pruef-meldung { position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 70; max-width: min(92vw, 520px); padding: 12px 16px; border-radius: 12px; background: var(--tinte); color: #fff; font-size: 14px; box-shadow: 0 10px 30px rgba(0,0,0,.25); }
'''
js = '\n'.join(open(os.path.join(D, 'js', f), encoding='utf8').read() for f in ('klar.js', 'schaden.js', 'rueckruf.js'))
# WhatsApp öffnet in der Review-Datei nichts, sondern sagt, was passieren würde
alt = 'window.open(wa, "_blank", "noopener");'
assert alt in js, 'schaden.js: WhatsApp-Aufruf nicht gefunden'
js = js.replace(alt, 'window.__pruefMeldung("Vorschau: Hier würde WhatsApp mit Ihrer Meldung öffnen. Es wird nichts gesendet.");')
js = js.replace('window.__schaden = {', 'window.__schaden = window.__schaden || {', 1)

router = '''
(function () {
  var T = %s, S = %s, ans = [].slice.call(document.querySelectorAll("[data-route]"));
  var meldung;
  window.__pruefMeldung = function (text) {
    if (!meldung) { meldung = document.createElement("p"); meldung.className = "pruef-meldung"; meldung.setAttribute("role", "status"); document.body.appendChild(meldung); }
    meldung.textContent = text; meldung.hidden = false; clearTimeout(meldung._t); meldung._t = setTimeout(function () { meldung.hidden = true; }, 6000);
  };
  // Formulare: nie abschicken (falls ein Skript ausfällt, greift das hier)
  document.addEventListener("submit", function (e) { e.preventDefault(); }, false);
  var aktuell = null;
  function zeig() {
    var h = location.hash || "#/";
    if (h.charAt(1) !== "/") { return; } // Sprungmarke innerhalb der Seite
    var rest = h.slice(1), anker = "", abfrage = "";
    if (rest.indexOf("@") !== -1) { anker = rest.split("@")[1]; rest = rest.split("@")[0]; }
    if (rest.indexOf("?") !== -1) { abfrage = rest.split("?")[1]; rest = rest.split("?")[0]; }
    if (!T[rest]) rest = "/";
    ans.forEach(function (a) { a.hidden = a.getAttribute("data-route") !== rest; });
    document.title = T[rest];
    document.body.setAttribute("data-seite", S[rest]);
    [].forEach.call(document.querySelectorAll(".kopf__nav a, .blatt a"), function (a) {
      var z = (a.getAttribute("href") || "").slice(1);
      if (rest !== "/" && z.length > 1 && rest.indexOf(z) === 0) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    var blatt = document.querySelector("dialog[data-menu]"); if (blatt && blatt.open) blatt.close();
    if (abfrage && window.__schaden && window.__schaden.anwenden) setTimeout(function () { window.__schaden.anwenden(new URLSearchParams(abfrage)); }, 30);
    var ziel = anker && document.querySelector('[data-route="' + rest + '"] [id="' + anker + '"]');
    if (ziel) setTimeout(function () { ziel.scrollIntoView(); }, 30); else if (aktuell !== h) window.scrollTo(0, 0);
    aktuell = h;
    window.dispatchEvent(new Event("scroll"));
  }
  window.addEventListener("hashchange", zeig); zeig();
})();
''' % (json.dumps(titel, ensure_ascii=False), json.dumps(seiten_attr))

seite = f'''<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>{H.escape(titel["/"])}</title>
<link rel="icon" href="{uri('/bilder/icons/icon.svg')}">
<script>document.documentElement.classList.add("js")</script>
<style>{css}</style>
</head>
<body data-seite="index">
<p class="pruef-band" role="note">{BAND}</p>
{kopf}
<main id="inhalt">{''.join(ansichten)}</main>
{fuss}
<script>{router.replace('</', '<\\/')}
{js}</script>
</body>
</html>
'''
open(ZIEL, 'w', encoding='utf8').write(seite)
print(ZIEL, len(SEITEN), 'Seiten', round(len(seite.encode()) / 1e6, 2), 'MB')
