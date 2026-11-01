# Bewegung und 3D: Leiter, Browserstand, Kostenblatt

Stand 1. November 2026. Kennzeichen: `[gebaut und gemessen]`, `[gelesen]`, `[Annahme]`, `[nicht gebaut]`.

## Browserstand

| Technik | Chrome/Edge | Firefox | Safari | Quelle |
|---|---|---|---|---|
| WebGL2 | breit verfügbar | breit verfügbar | breit verfügbar | `[Annahme]`, vor Bau je Zielgerät prüfen |
| WebGPU | 113 | 141 (teilweise) | 26 | `[gelesen · MDN, caniuse, 2026-11]` |
| CSS Scroll-driven Animations (`animation-timeline`) | 115 | 133 | 18.2 | `[gelesen]` |
| View Transitions (Seitenwechsel) | 111 | 130 | 18 | `[gelesen]` |

Folgerung: CSS-Scroll-Animationen und View Transitions sind als **Verbesserung** brauchbar (ohne Unterstützung bleibt die Seite lesbar). WebGPU nur mit WebGL-Rückfall.

## Die Leiter

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

## Regeln

1. **Zweck vor Technik.** Jede Bewegung beantwortet: Was zeigt sie, das Text und Foto nicht zeigen? Antwort «es sieht modern aus» genügt nicht.
2. **Foto zuerst.** Das LCP-Element bleibt ein Bild oder Text. Die Szene wird nach dem Laden eingesetzt, ohne das Bild zu verschieben (feste Fläche, `aspect-ratio`).
3. **Abschalter.** `prefers-reduced-motion: reduce` → keine automatische Bewegung. Kein WebGL2 → Foto bleibt. Ideal zusätzlich: Sparmodus oder schwache GPU erkennen und Szene nicht starten `[Annahme, nicht gebaut]`.
4. **Kein Inhalt hinter Bewegung.** Nichts, was gelesen werden muss, erscheint erst durch Scrollen oder Klicken auf eine Animation.
5. **Kein Scroll-Kapern.** Sanftes Scrollen (Lenis) verändert das Gefühl von Tastatur, Anker und Suche; nur mit Test auf Tastatur und Screenreader.
6. **Budget.** Zusätzliches JS vor dem LCP ≤ 100 KB, nach dem LCP in der Szene im Kostenblatt genannt ([SKILL.md](../SKILL.md) V5).
7. **Wirkung blind prüfen**, mit und ohne Bewegung.

## Muster Foto zuerst, Szene im Leerlauf `[gebaut und gemessen]`

```jsx
"use client";
const Szene = dynamic(() => import("./Szene.js"), { ssr: false });
// im useEffect: nur starten, wenn kein reduced-motion und WebGL2 da ist; dann requestIdleCallback
```

Quelle: `probe/autospeedy/stack-spikes/next-app/components/HeroSzene.js`. Ergebnis: LCP unverändert gegenüber `next` (3614 ms gegen 3619 ms), Blockierzeit danach 3,4 s im Labor (messungen.md).

## Kostenblatt für den Kunden (Vorlage)

```
Bewegung/3D: <Name>
Zweck: <was sie zeigt>
Stufe: <0 bis 6>
Zusatzgewicht: <KB JS>, <MB Medien>   [gemessen / geschätzt]
Auswirkung (Labor): LCP <ms>, TBT <ms>   [gemessen / geschätzt]
Ohne Bewegung fehlt: <was>
Rückfall: <Foto / Standbild>
Nicht getestet: <echte Geräte / Feldwerte>
Pflege: <wer ersetzt das Modell, wenn das Auto wechselt?>
Entscheid des Kunden (Datum): <ja / nein / mit Änderung>
```

## 3D-Besonderheiten (Annahmen, vor Bau prüfen)

- **Modelle:** glTF/GLB, komprimiert (Draco oder Meshopt), Texturen als KTX2 `[nicht gebaut]`.
- **Pflege:** Wer liefert das Modell, wer ersetzt es? Ein Fahrzeugmodell des Herstellers hat Lizenzbedingungen; bei Marken wie Tesla ist die Nutzung vorab zu klären (Probe: `livegang.md` L8).
- **Barrierefreiheit:** Canvas bekommt `aria-hidden`, wenn es nur Schmuck ist, sonst eine Textalternative.
- **Akku und Wärme:** Rendern pausieren, wenn die Szene nicht sichtbar ist (IntersectionObserver) `[nicht gebaut]`.
