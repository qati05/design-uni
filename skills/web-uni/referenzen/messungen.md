# Messungen: was in diesem Repo gebaut und gemessen wurde

Stand 1. November 2026. Quelle der Bauten: `probe/autospeedy/stack-spikes/`. Alle Zahlen: Lighthouse 13.6.0, mobil, simulierte Drosselung (Standard), **Median aus 3 Läufen**, Chromium aus dem Container, **ohne echte GPU** (`--disable-gpu`, Software-Darstellung). Auslieferung über `serve` mit gzip.

## Was gebaut wurde

| Kürzel | Was | Inhalt |
|---|---|---|
| `statisch` | Startseite der Probe Auto Speedy, handgeschriebenes HTML/CSS, 3,6 KB JS | `probe/autospeedy/site/` |
| `next` | **dieselbe** Seite in Next.js 16.4.3 (statischer Export, React 19.3.1); der Seiteninhalt wird als fertiges HTML über `dangerouslySetInnerHTML` eingesetzt, CSS und Bilder identisch | `stack-spikes/next-app`, Route `/` |
| `next3d` | wie `next`, dazu eine 3D-Szene (three 0.187.0, @react-three/fiber 9.8.2): **Foto zuerst**, Szene erst im Leerlauf und nur ohne `prefers-reduced-motion` und mit WebGL2 | Route `/dreid` |

## Ergebnis (Median)

| | Score | FCP | LCP | TBT | CLS | JS (komprimiert) | Gesamtgewicht |
|---|---|---|---|---|---|---|---|
| `statisch` | **97** | 909 ms | 2645 ms | 0 ms | 0 | **3,6 KB** | 320 KB |
| `next` | 89 | 718 ms | 3619 ms | 133 ms | 0 | 137,3 KB | 460 KB |
| `next3d` | 60 | 711 ms | 3614 ms | **3366 ms** | 0 | 377,8 KB | 700 KB |

Einzelläufe Score: statisch 97/96/97, next 89/89/89, next3d 64/60/60. LCP next3d: 3019/3614/3615 ms.

`[gebaut und gemessen · 2026-11-01]`

## Was daraus folgt, und was nicht

Gesichert (aus den Zahlen):

1. **Der Rahmen kostet.** Derselbe Inhalt in Next.js ist um 133 KB JavaScript schwerer und hat im Labor einen um 974 ms späteren LCP (3619 gegen 2645 ms); der Score fällt von 97 auf 89. Für eine Seite ohne Konten, Shop oder Zustand gibt es **keinen Gewinn** für den Kunden, der das aufwiegt.
2. **Die 3D-Szene kostet nochmals 240 KB JS** (three.js und R3F) und im Labor eine **Blockierzeit von 3,4 s**. Das Foto-zuerst-Muster hält den LCP auf dem Niveau von `next` (3614 ms): Die Szene verzögert das erste Bild nicht, sie blockiert aber danach den Hauptthread.
3. Die Verschlechterung ist **nicht** durch Komprimierung erklärt: Ein erster Lauf auf einem Server ohne Komprimierung zeigte 455 KB und 1365 KB JS; mit gzip sind es 137 KB und 378 KB. **Auslieferung ohne Komprimierung verfälscht jeden Vergleich.**

Nicht gesichert:

- **Wie viel der 3,4 s TBT auf echten Handys anfallen.** Software-Darstellung im Container übertreibt das Zeichnen der Szene; auf einer echten GPU ist die Blockierung vermutlich kleiner. Das ist eine **Annahme**, keine Messung. Zahlen von echten Geräten (iOS Safari, ein Mittelklasse-Android) fehlen.
- **Warum `next` einen späteren LCP hat** (Hydration, Reihenfolge der Ressourcen, anderes Laden des Bildes). Die Ursache wurde nicht untersucht. Dass es am Rahmen liegt, ist die naheliegende Lesart, keine bewiesene.
- **Bildrate** (FPS) der Szene: nicht gemessen.
- **Wirkung auf Besucher:** nicht gemessen. Ob eine Szene mehr Anfragen bringt, ist offen (design-uni P5/P8 oder Menschentest).
- **Eine einzige, kleine Szene** (ein Modell, ein Licht). Eine echte Fahrzeugszene mit Modell (glTF) und Texturen liegt deutlich höher.
- **Andere Stacks** (Astro, SvelteKit, Eleventy, Baukasten, GSAP, CSS Scroll-driven, WebGPU): **nicht gebaut**, also hier kein Urteil.

## Befehle zum Nachmachen

```bash
# statisch
npx serve probe/autospeedy/site -l 8201
# Next.js (Quelle: probe/autospeedy/stack-spikes/next-app; public/ aus site/ befüllen: css, js, schriften, bilder)
cd probe/autospeedy/stack-spikes/next-app && npm ci && npx next build && npx serve out -l 8202
# Lighthouse, 3 Läufe je Seite (Pfade in lh/run.sh anpassen, sie zeigen auf das Arbeitsverzeichnis der Probe)
bash lh/run.sh statisch http://localhost:8201/
bash lh/run.sh next     http://localhost:8202/
bash lh/run.sh next3d   http://localhost:8202/dreid
python3 lh/zusammenfassen.py <ordner mit den JSON-Dateien>
```

`public/` und `node_modules/` sind nicht im Repo (Kopien aus `site/`, bzw. `npm ci`). Die Rohdateien von Lighthouse (5,5 MB) sind nicht eingecheckt; die Tabelle oben ist die Auswertung.

## Messregeln, die sich bewährt haben

- Immer **mit** Komprimierung ausliefern (gzip oder Brotli).
- Mindestens 3 Läufe, Median nennen, Einzelwerte dazuschreiben.
- Gleiches Gerät, gleiche Drosselung, gleiche Reihenfolge.
- Labor-Zahlen als **Hinweis** kennzeichnen, Feldzahlen (CrUX, eigene Messung) nach dem Livegang nachliefern.
- Eine Änderung pro Vergleich (hier: nur der Rahmen, dann nur die Szene), damit die Ursache einer Zahl klar ist.
