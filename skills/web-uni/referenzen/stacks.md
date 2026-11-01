# Stacks: Klassen, Entscheidbaum, Stand

Stand 1. November 2026. Versionen `[gelesen · npm-Registry, 2026-11-01]`; **vor jedem Bau neu prüfen**. Kennzeichen wie in [SKILL.md](../SKILL.md): `[gebaut und gemessen]`, `[gelesen]`, `[Annahme]`, `[nicht gebaut]`.

## Versionsstand

| Paket | Version | Anmerkung |
|---|---|---|
| Next.js | 16.4.3 | Turbopack Standard, `output: 'export'` für statischen Export `[gebaut und gemessen]`, Cache Components, React Compiler stabil `[gelesen]` |
| React | 19.3.1 | `[gebaut und gemessen]` im Next-Spike |
| three | 0.187.0 | `[gebaut und gemessen]` |
| @react-three/fiber | 9.8.2 | `[gebaut und gemessen]` |
| Astro | 7.4.4 | `[nicht gebaut]` |
| SvelteKit | 3.1.1 | `[nicht gebaut]` |
| GSAP | 3.15.0 | `[nicht gebaut]` |
| Motion | 14.9.0 | `[nicht gebaut]` |
| Lenis | 1.3.27 | `[nicht gebaut]` |
| Vite | 8.3.5 | Basis fast aller Frameworks `[gelesen]` |
| TypeScript | 7.0.2 | `[gelesen]` |
| Tailwind | 4.3.3 | `[gelesen]` |
| Lighthouse | 13.6.0 | `[gebaut und gemessen]` als Messwerkzeug |

## Die fünf Klassen im Einzelnen

### A · Statisch von Hand (HTML, CSS, wenig JS, Bauskript) `[gebaut und gemessen]`

- Gemessen: Score 97, 3,6 KB JS, LCP 2645 ms im Labor (messungen.md).
- Stärken: schnellste Messwerte, keine Abhängigkeiten, nichts, das veraltet; der Quelltext ist das Ergebnis.
- Schwächen: Inhalte stehen im Quelltext. Ohne Bauskript und Pflegehandbuch kann der Betrieb **nichts selbst ändern**. Mehrsprachigkeit, Suche, Shop: von Hand teuer.
- Wann: bis etwa 15 Seiten, seltene Änderungen durch einen Entwickler oder eine Agentur, Geschwindigkeit ist Argument.
- Wann nicht: der Betrieb will Preise, Fotos oder Texte selbst ändern, ohne Entwickler.

### B · Statischer Generator mit Inhaltsdateien (Astro, Eleventy, …) `[nicht gebaut]`

- Aussage aus Quellen `[gelesen]`: wenig bis kein JS standardmässig, Inhalte in Markdown oder CMS, Inseln für Interaktives. Ob das in diesem Repo auch so misst: **offen**. Als Nächstes zu bauen und mit `next` und `statisch` zu vergleichen.
- Wann (Annahme): mehr Seiten oder Inhalte, die wiederkehren (Occasionen, Team, Beiträge), oder ein CMS im Hintergrund.

### C · React-Framework (Next.js App Router) `[gebaut und gemessen, nur statischer Export]`

- Gemessen: gleicher Inhalt kostet +133 KB JS und rund 1 s LCP im Labor (messungen.md).
- Gebaut wurde **nur** der statische Export. Serverseitiges Rendern, Cache Components, `proxy.ts`, Server Actions, Bildoptimierung `[nicht gebaut]`.
- Wann (Annahme): Konten und Anmeldung, Shop mit Warenkorb, Vorschau für Redakteure, Daten aus mehreren Quellen, ein Team, das schon React pflegt, geteilte Bauteile mit einer App.
- Wann nicht: Seite ohne Zustand und ohne Konten. Dort kostet der Rahmen mehr, als er bringt.
- Alternativen mit ähnlicher Rolle `[nicht gebaut]`: SvelteKit, Remix, Nuxt.

### D · Baukasten oder CMS (Webflow, Wix, Shopify, WordPress) `[nicht gebaut]`

- Stärken `[Annahme]`: der Betrieb pflegt selbst, Formulare, Buchung und Zahlung als Baustein, wenig Betriebsaufwand.
- Schwächen `[Annahme]`: Gestaltungsspielraum begrenzt, Geschwindigkeit hängt vom Anbieter, Anbieterbindung, laufende Kosten, oft Fremd-Skripte.
- **Der Auftritt der Probe lag vorher auf Wix** (`probe/autospeedy/fakten.md`). Die Bewertung dieses Zustands ist nicht Teil der Messungen.

### E · Erlebnis-Zuschlag (WebGL, WebGPU, Video, grosse Animation)

- WebGL über three.js und R3F: `[gebaut und gemessen]`, +240 KB JS und 3,4 s TBT im Labor (ohne GPU). Siehe [animation-3d.md](animation-3d.md).
- WebGPU, Shader, OGL, Rive, Lottie, Video: `[nicht gebaut]`.

## Entscheidbaum (Annahme, zu prüfen mit V2)

1. **Muss der Besucher sich anmelden, bezahlen oder personenbezogene Daten bearbeiten?** Ja → Klasse C (oder D mit Shop). Nein → weiter.
2. **Will der Betrieb Inhalte ohne Entwickler ändern?** Ja → D, oder B mit CMS und Freigabe. Nein → weiter.
3. **Wie viele Seiten und wie oft ändert sich der Inhalt?** Wenige Seiten, selten → A. Viele oder wiederkehrende Inhalte → B.
4. **Ist die Bewegung oder das 3D Kern des Wunsches?** Ja → Klasse E auf B oder C aufsetzen; **Foto zuerst**, Kostenblatt, blinder Test. Nein → keine Bewegung über Stufe 2 ([animation-3d.md](animation-3d.md)).
5. **Hat ein vorhandenes Team einen Stack?** Dann ist der Stack des Teams der Ausgangspunkt, und eine Abweichung braucht einen Grund im Entscheidblatt.
6. **Gegenprobe:** Wäre Klasse A (der einfachste Weg) für den Kunden gleich gut? Wenn ja, wähle A und halte fest, warum nichts Grösseres nötig war.

## Fehler, die den Entscheid oft verderben (Annahmen, mit Quelle der Erfahrung: Probe Auto Speedy)

- **Rahmen aus Gewohnheit.** Ein React-Framework für eine Seite, die nur Text, Bilder und ein Formular hat.
- **Zweierlei Wahrheit.** Öffnungszeiten im Text und im Skript: eine Quelle ([lektionen.md](lektionen.md)).
- **3D aus Lust.** Ein Modell, das niemand bestellt hat, auf einer Seite, deren Erfolg ein Anruf ist.
- **Ungemessen übernommen.** «Next.js ist schnell» ohne Zahl: der Spike zeigt in diesem Fall das Gegenteil.
