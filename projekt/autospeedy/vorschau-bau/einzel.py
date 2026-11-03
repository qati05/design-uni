# Macht aus der Ansichten-Seite (art_bau.py) eine einzige Datei: Bilder und Schriften eingebettet.
import re, sys, os, base64
A=sys.argv[1]; out=sys.argv[2]
s=open(os.path.join(A,'index.html'),encoding='utf8').read()
def uri(p,mime):
    return f'data:{mime};base64,'+base64.b64encode(open(os.path.join(A,p),'rb').read()).decode()
B=os.listdir(os.path.join(A,'bilder'))
def best(name):
    for w in (960,480,1600):
        f=f'{name}-{w}.webp'
        if f in B: return 'bilder/'+f
cache={}
def img(m):
    tag=m.group(0)
    team=re.search(r'src="bilder/((?:team|partner)/[a-z0-9-]+\.webp)"',tag)
    if team:
        p='bilder/'+team.group(1)
        if p not in cache: cache[p]=uri(p,'image/webp')
        return tag.replace('src="'+p+'"','src="'+cache[p]+'"')
    src=re.search(r'src="bilder/([a-z-]+?)-(\d+)\.webp"',tag)
    if not src: return tag
    name=src.group(1)
    if name=='logo': p='bilder/logo-96.webp'
    else: p=best(name)
    if p not in cache: cache[p]=uri(p,'image/webp')
    tag=re.sub(r'\ssrcset="[^"]*"','',tag); tag=re.sub(r'\ssizes="[^"]*"','',tag)
    return re.sub(r'src="[^"]*"',f'src="{cache[p]}"',tag)
s=re.sub(r'<img[^>]*>',img,s)
s=re.sub(r'url\("bilder/([^"]+\.png)"\)',lambda m:'url("'+uri('bilder/'+m.group(1),'image/png')+'")',s)
s=re.sub(r'url\("fonts/([^"]+)"\)',lambda m:'url("'+uri('fonts/'+m.group(1),'font/woff2')+'")',s)
s='<!doctype html>\n<html lang="de-CH">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="robots" content="noindex">\n'+s.replace('</style>','</style>\n</head>\n<body>',1)+'\n</body>\n</html>\n'
open(out,'w',encoding='utf8').write(s); print(round(len(s)/1e6,2),'MB')
