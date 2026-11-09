# Demo zur Linie «Klar» auf dem reduzierten Stand (09.11.2026): Das Cockpit kann nur noch «Website pflegen».
# Formulare der Website gehen per Mail an den Betrieb; im Cockpit gibt es keine Meldungen, keine Zahlen, kein WhatsApp.
# Links die Website (Review-Datei aus review_bau.py), rechts der Ablauf im Demo-Cockpit als Video und Bildstrecke
# (aufgenommen am laufenden Demo-Cockpit, COCKPIT_DEMO=1). Alles eingebettet, eine Datei, nichts wird gesendet.
# Aufruf: python3 vorschau-bau/demo_klar_bau.py COCKPIT_ORDNER ZIEL.html [WEBSITE.html]
#   ohne WEBSITE.html entsteht nur die Cockpit-Seite (Video und Bilder).
import base64, html as H, json, os, sys

ORDNER, ZIEL = sys.argv[1], sys.argv[2]
WEBSITE = sys.argv[3] if len(sys.argv) > 3 else None
SCHRITTE = [
    ('01-anmelden.jpg', 'Anmelden', 'Mail-Adresse eingeben. Es gibt kein Passwort.'),
    ('02-code.jpg', 'Code aus der Mail', 'Der 6-stellige Code kommt per Mail. Danach bleibt das Gerät 30 Tage angemeldet.'),
    ('03-website-pflegen.jpg', 'Website pflegen', 'Alles auf einer Seite: Hinweise, Öffnungszeiten, Feiertage und Ferien, Team, Satz vom Inhaber, Bewertungen.'),
    ('04-oeffnungszeit.jpg', 'Öffnungszeit ändern', 'Zeit überschreiben, zum Beispiel abends bis 17.00.'),
    ('05-ferien.jpg', 'Ferien eintragen', 'Tag, Anlass und «geschlossen» wählen.'),
    ('06-hinweis.jpg', 'Hinweis setzen', 'Kurzer Text oben auf der Website, nur im gewählten Zeitraum.'),
    ('07-team.jpg', 'Teammitglied bearbeiten', 'Name, Aufgabe oder Foto ändern. Nur Personen mit Häkchen erscheinen.'),
    ('08-gespeichert.jpg', 'Speichern', 'Nach dem Speichern baut sich die Website neu. In der Demo bleibt alles nur im Speicher.'),
]
def uri(name, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(os.path.join(ORDNER, name), 'rb').read()).decode()

video = uri('cockpit-ablauf.mp4', 'video/mp4')
karten = ''.join(
    f'<li><figure><img src="{uri(f, "image/jpeg")}" alt="{H.escape(t)}" loading="lazy" width="1280" height="800"><figcaption><b>{i + 1}. {H.escape(t)}</b> {H.escape(x)}</figcaption></figure></li>'
    for i, (f, t, x) in enumerate(SCHRITTE))
website = ''
if WEBSITE:
    daten = json.dumps(open(WEBSITE, encoding='utf8').read()).replace('</', '<\\/')
    website = f'''<section class="kunde" aria-labelledby="t-kunde"><h2 id="t-kunde">Website · Handy</h2>
<div class="handy"><iframe id="website" title="Website auf dem Handy"></iframe></div>
<p class="leise">Formulare senden in dieser Demo nichts. Auf der fertigen Website gehen Schadenmeldung und Rückruf-Bitte per Mail direkt an den Betrieb.</p></section>
<script type="application/json" id="website-html">{daten}</script>
<script>(function(){{var s=document.getElementById("website-html").textContent;var u=URL.createObjectURL(new Blob([JSON.parse(s)],{{type:"text/html"}}));document.getElementById("website").src=u;}})();</script>'''

seite = f'''<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Auto Speedy Cockpit Demo</title>
<style>
:root {{ --tinte:#1d1e20; --leise:#5b5f66; --linie:#dcd9d3; --grund:#fbfaf8; --akzent:#1566b8; color-scheme: light; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; background: var(--grund); color: var(--tinte); font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }}
.band {{ position: sticky; top: 0; z-index: 5; margin: 0; padding: 6px 16px; background: #6b4300; color: #fff; font-size: 13px; font-weight: 600; text-align: center; }}
.buehne {{ display: grid; grid-template-columns: {"minmax(0, 420px) minmax(0, 1fr)" if WEBSITE else "minmax(0, 1fr)"}; gap: 32px; max-width: 1400px; margin: 0 auto; padding: 24px 16px 64px; }}
h1 {{ font-size: 28px; line-height: 1.2; margin: 0 0 8px; }}
h2 {{ font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: var(--leise); margin: 0 0 12px; }}
.leise {{ color: var(--leise); font-size: 14px; }}
.handy {{ width: 100%; max-width: 400px; aspect-ratio: 390 / 844; border: 10px solid #111; border-radius: 36px; overflow: hidden; background: #fff; }}
.handy iframe {{ width: 100%; height: 100%; border: 0; }}
.kunde {{ position: sticky; top: 48px; align-self: start; }}
video {{ width: 100%; height: auto; border: 1px solid var(--linie); border-radius: 12px; background: #000; }}
.schritte {{ list-style: none; margin: 24px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 20px; }}
.schritte img {{ width: 100%; height: auto; display: block; border: 1px solid var(--linie); border-radius: 10px; }}
figure {{ margin: 0; }} figcaption {{ font-size: 14px; margin-top: 8px; }}
@media (max-width: 900px) {{ .buehne {{ grid-template-columns: minmax(0, 1fr); }} .kunde {{ position: static; }} .handy {{ margin: 0 auto; }} }}
</style>
</head>
<body>
<p class="band" role="note">Demo zum Prüfen · nichts wird gesendet, nichts ist live</p>
<div class="buehne">
{website}
<section aria-labelledby="t-cockpit">
<h2 id="t-cockpit">Cockpit · Website pflegen</h2>
<h1>So ändern Sie Ihre Website selbst.</h1>
<p class="leise">Das Cockpit macht nur eines: Was Sie an Ihrer Website selbst ändern können. Aufgenommen im Demo-Modus ohne echtes Login; die Beispiel-Eingaben sind keine echten Angaben des Betriebs.</p>
<video src="{video}" poster="{uri("03-website-pflegen.jpg", "image/jpeg")}" controls muted playsinline preload="metadata" width="1280" height="800"></video>
<ol class="schritte">{karten}</ol>
</section>
</div>
</body>
</html>
'''
open(ZIEL, 'w', encoding='utf8').write(seite)
print(ZIEL, round(len(seite.encode()) / 1e6, 2), 'MB')
