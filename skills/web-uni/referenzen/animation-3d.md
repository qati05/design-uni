# Bewegung und 3D: Leiter, Browserstand, Kostenblatt

Stand 2. November 2026. Kennzeichen: `[gebaut und gemessen]`, `[gelesen]`, `[Annahme]`, `[nicht gebaut]`.

## Browserstand

| Technik | Chrome/Edge | Firefox | Safari | Quelle |
|---|---|---|---|---|
| WebGL2 | breit verfügbar | breit verfügbar | breit verfügbar | `[Annahme]`, vor Bau je Zielgerät prüfen |
| WebGPU | 113 | 141 (teilweise) | 26 | `[gelesen · MDN, caniuse, 2026-11]` |
| CSS Scroll-driven Animations (`animation-timeline`) | 115 | 133 | 18.2 | `[gelesen]` |
| View Transitions (Seitenwechsel) | 111 | 130 | 18 | `[gelesen]` |

Folgerung: CSS-Scroll-Animationen und View Transitions sind als **Verbesserung** brauchbar (ohne Unterstützung bleibt die Seite lesbar). WebGPU nur mit WebGL-Rückfall.

## Wer was entscheidet

- **Ob und welche Bewegung:** design-uni in DP2, so viel, wie die Idee des Betriebs oder der Wunsch braucht. Eine Mengenregel gibt es nicht, auch keine Stufengrenze je Klasse (zusammenspiel Entscheid 12).
- **Womit und was es kostet:** web-uni in WP3, mit Kostenblatt und den Budgets aus WP5.
- **Wunsch des Betriebs** nach einer Bewegung, die DP2 nicht vorsieht: Entscheid des Betriebs, geht nach der Rangfolge vor ([SKILL.md](../SKILL.md), Schritt 3).

## Die Leiter

Die Leiter ordnet Techniken nach Kosten. Sie sagt, was eine Bewegung kostet, nicht, ob sie erlaubt ist. Gewählt wird je Bewegung die Technik, die sie mit den geringsten Kosten trägt.

| Stufe | Technik | Was es kostet | Status |
|---|---|---|---|
| 0 | keine Bewegung | 0 | |
| 1 | CSS-Übergänge, `animation-timeline`, `scroll-timeline` | 0 KB JS | `[nicht gebaut]` |
| 2 | View Transitions | 0 bis 2 KB | `[nicht gebaut]` |
| 3 | GSAP, Motion, Lenis | 20 bis 90 KB JS `[Annahme]` | `[nicht gebaut]` |
| 4 | Video, Lottie, Rive | MB oder 50 KB `[Annahme]` | `[nicht gebaut]` |
| 5 | WebGL: three, R3F | **+240 KB JS gegenüber `next`, +3,4 s TBT im Labor ohne GPU** | `[gebaut und gemessen]` |
| 6 | WebGPU | wie 5 plus Rückfallweg | `[nicht gebaut]` |

Die Gewichte von Stufe 1 bis 4 und 6 sind Schätzungen aus Erfahrung und **nicht** in diesem Repo gemessen. Wer sie braucht, baut vorher den Spike und trägt die Messung in [messungen.md](messungen.md) ein.

## Boden (zusammenspiel Entscheid 12)

Diese Regeln schützen Barrierefreiheit und gelten für jede Bewegung:

1. **`prefers-reduced-motion: reduce`** → nichts läuft von selbst.
2. **Inhalt ohne Bewegung und ohne JavaScript.** Ohne WebGL2 bleibt das Foto.
3. **Kein Inhalt hinter Bewegung.** Nichts, was gelesen werden muss, erscheint erst durch Scrollen oder Klicken auf eine Animation.
4. **Pause ab 5 s.** Was länger als 5 s von selbst läuft, lässt sich anhalten (WCAG 2.2.2).
5. **Sanftes Scrollen** (Lenis) ist erlaubt, wenn Tastatur, Anker und Suche im Browser weiter funktionieren und es unter reduzierter Bewegung aus ist; Test mit Tastatur und Bildschirmleser.

## Regeln aus eigener Messung

6. **Foto zuerst.** Das LCP-Element bleibt ein Bild oder Text. Die Szene wird nach dem Laden eingesetzt, ohne das Bild zu verschieben (feste Fläche, `aspect-ratio`). Gemessen: LCP mit Szene gleich wie ohne (Muster unten).
7. **Budget.** Schwellen und Richtwerte in [SKILL.md](../SKILL.md), WP5; Zusatz-JS einer Szene steht im Kostenblatt.

## Hinweise

- **Zweck nennen.** Jede Bewegung sagt im Kostenblatt, was sie zeigt. Das hilft beim Entscheid des Betriebs; es sperrt nichts.
- **Energie:** Sparmodus oder schwache GPU erkennen und die Szene nicht starten `[Annahme, nicht gebaut]`.
- **Wirkung:** Bildtest als Vorfilter, dann Test mit Menschen (WP6), je mit und ohne Bewegung.

## Muster Foto zuerst, Szene im Leerlauf `[gebaut und gemessen]`

```jsx
"use client";
const Szene = dynamic(() => import("./Szene.js"), { ssr: false });
// im useEffect: nur starten, wenn kein reduced-motion und WebGL2 da ist; dann requestIdleCallback
```

Quelle: `probe/autospeedy/stack-spikes/next-app/components/HeroSzene.js`. Ergebnis: LCP unverändert gegenüber `next` (3614 ms gegen 3619 ms), Blockierzeit danach 3,4 s im Labor (messungen.md).

## Kostenblatt (Vorlage)

Ein Entwurf. Er geht erst an den Betrieb, wenn das Studio ihn freigegeben hat ([betrieb.md](betrieb.md), Teil 10).

```
ENTWURF, nicht an den Kunden
Bewegung/3D: <Name>
Zweck: <was sie zeigt>
Stufe: <0 bis 6>
Zusatzgewicht: <KB JS>, <MB Medien>   [gemessen / geschätzt]
Auswirkung (Labor): LCP <ms>, TBT <ms>   [gemessen / geschätzt]
Ohne Bewegung fehlt: <was>
Rückfall: <Foto / Standbild>
Nicht getestet: <echte Geräte / Feldwerte>
Pflege: <wer ersetzt das Modell, wenn das Auto wechselt?>
Freigabe Studio (Person, Datum): <…>
Entscheid des Betriebs (Person, Datum): <ja / nein / mit Änderung>
```

## 3D-Besonderheiten (Annahmen, vor Bau prüfen)

- **Modelle:** glTF/GLB, komprimiert (Draco oder Meshopt), Texturen als KTX2 `[nicht gebaut]`.
- **Pflege:** Wer liefert das Modell, wer ersetzt es? Ein Fahrzeugmodell des Herstellers hat Lizenzbedingungen; bei Marken wie Tesla ist die Nutzung vorab zu klären (Probe: `probe/autospeedy/livegang.md`).
- **Barrierefreiheit:** Canvas bekommt `aria-hidden`, wenn es nur Schmuck ist, sonst eine Textalternative.
- **Akku und Wärme:** Rendern pausieren, wenn die Szene nicht sichtbar ist (IntersectionObserver) `[nicht gebaut]`.
