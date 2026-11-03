---
name: Auto Speedy AG, Linie «Lack»
description: Carrosserie und Spritzwerk in Altstätten SG; Website, die Schadenmeldungen und Anrufe bringt.
colors:
  gebotsblau: "#1566b8"
  gebotsblau-dunkel: "#0f4f94"
  gebotsblau-hell: "#e8f1fb"
  babyblau: "#c4e0f8"
  babyblau-tief: "#b9dbf7"
  lackweiss: "#ffffff"
  hallenweiss: "#f3f5f6"
  blech: "#e2e7e9"
  hallengrau: "#4a585d"
  tinte: "#14202a"
  nacht: "#1f2d40"
  luecke-rand: "#b26a00"
  luecke-grund: "#fff4e0"
  whatsapp-gruen: "#1f7a4d"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(44px, 5.2vw, 82px)"
    fontWeight: 700
    lineHeight: 0.98
  headline:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(36px, 4.4vw, 64px)"
    fontWeight: 700
    lineHeight: 1.05
  title:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.05
  body:
    fontFamily: "Barlow, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Barlow, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  none: "0"
  sm: "4px"
spacing:
  rand: "clamp(16px, 4vw, 56px)"
  band: "clamp(48px, 7vw, 96px)"
  kopf: "76px"
components:
  button-primary:
    backgroundColor: "{colors.gebotsblau}"
    textColor: "{colors.lackweiss}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.gebotsblau-dunkel}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.gebotsblau-dunkel}"
    rounded: "{rounded.none}"
  button-secondary-hover:
    backgroundColor: "{colors.gebotsblau-hell}"
  input:
    backgroundColor: "{colors.lackweiss}"
    textColor: "{colors.tinte}"
    rounded: "{rounded.sm}"
    height: "48px"
  luecke:
    backgroundColor: "{colors.luecke-grund}"
    textColor: "{colors.tinte}"
---

# Design System: Auto Speedy AG, Linie «Lack»

## Overview

**Creative North Star: "Der Ausgang ist immer offen"**

Der Satz stammt aus der eigenen Richtung (`richtung.md`): Die Schadenmeldung ist der Ausgang, der auf jeder Seite offen steht. Jede Gestaltungsentscheidung dient zuerst der Konversion: Schaden melden, anrufen, Tesla-Einstieg. Die Leitidee ist ein Arbeitstitel; die visuelle Metapher ist noch nicht festgelegt [Entscheid · Roni, 03.11.2026: «spielt noch keine Rolle, die Webseite soll auf Konversion sein»].

Die Flächen sehen aus wie frisch lackiertes Blech: Weiss läuft schräg in Babyblau, mit feinen Lackpartikeln und einem Glanzstreifen wie die Lichtleisten der Lackierkabine. Der schräge Schnitt zwischen Text und Foto folgt dem S-Schwung des Logos. Titel stehen kursiv in Versalien wie der Schriftzug AUTO SPEEDY. Hell und übersichtlich ist ein Wunsch des Betriebs.

**Key Characteristics:**
- Eine Hauptaktion pro Bildschirm, «Schaden melden» in Gebotsblau; Telefon als Zweitaktion.
- Hell, Haarlinien, eine Akzentfarbe.
- Schräger Schnitt, kursive Versaltitel, kantige Knöpfe.
- Lücken bleiben als sichtbare, gelbe Hinweise stehen.

## Colors

Eine Akzentfarbe auf hellem Lack; Navy nur als Schrift und im Dunkelmodus.

### Primary
- **Gebotsblau** (#1566b8): Hauptaktion, aktive Navigation, Strich unter dem grossen Satz, Ziffern. Weiss darauf 5,8:1.
- **Gebotsblau dunkel** (#0f4f94): Hover der Hauptaktion, Links, Text-Akzente auf Babyblau (5,7:1).

### Neutral
- **Lackweiss** (#ffffff) und **Babyblau** (#c4e0f8, tief #b9dbf7): der Lackverlauf auf Seitenköpfen, Bändern und Schadenarten.
- **Hallenweiss** (#f3f5f6): Seitengrund, Kopf, Fuss.
- **Blech** (#e2e7e9): Haarlinien und Fugen.
- **Hallengrau** (#4a585d): leiser Text, Feldrahmen.
- **Tinte** (#14202a): Fliesstext und Titel.

### Named Rules
**The One Exit Rule.** Gebotsblau gefüllt trägt nur die Hauptaktion. Zweitaktionen stehen als Rahmen oder Link.
**The Visible Gap Rule.** Fehlende Fakten stehen als gelbe Lücke (#fff4e0, Rand #b26a00), nie als erfundener Inhalt.

## Typography

**Display Font:** Barlow Semi Condensed (mit Arial Narrow)
**Body Font:** Barlow (mit Arial)

**Character:** Beschilderung einer Werkhalle: schmal, kräftig, kursiv in den Titeln; ruhiger, gut lesbarer Text darunter. Beide Schriften liegen lokal.

### Hierarchy
- **Display** (700, clamp 44 bis 82 px, 0,98): der grosse Satz im ersten Bildschirm, kursiv, Versalien.
- **Headline** (700, clamp 36 bis 64 px, 1,05): Bandtitel, kursiv, Versalien.
- **Title** (700, 24 px): Schadenarten, Wege, Fusstitel.
- **Body** (400, 18 px, 1,5): Fliesstext, höchstens 64ch.
- **Label** (700, 16 px, 0,04em, Versalien): Knöpfe.

## Layout

Erster Bildschirm und Seitenköpfe: Text links, Foto rechts, getrennt durch den schrägen Schnitt (7vw). Bänder mit `padding: clamp(48px, 7vw, 96px)` und Seitenrand `clamp(16px, 4vw, 56px)`. Unter 860 px stapelt alles, das Foto steht oben, und eine feste Leiste unten trägt Telefon und «Schaden melden». Kopf 76 px, klebend.

## Elevation & Depth

Flach. Tiefe entsteht durch den Lackverlauf und den Glanzstreifen, nicht durch weiche Schatten. Formulare tragen einen harten Versatz als Lackschicht: `box-shadow: 0 0 0 2px #1566b8, 12px 12px 0 #b9dbf7`.

## Shapes

Kanten statt Rundungen: Knöpfe, Formulare, Karten mit Radius 0; Eingabefelder 4 px. Schräge Schnitte (clip-path) an Seitenköpfen, Bändern und Abschluss im Winkel des Logo-Schwungs.

## Components

- **Knopf:** gefüllt Gebotsblau, Versalien, mindestens 48 px hoch; Hover dunkler. Im blauen Abschluss weiss mit blauer Schrift.
- **Knopf zweit:** Rahmen 2 px Gebotsblau, transparent.
- **Schadenarten:** grosse Kacheln im Lackverlauf, Titel kursiv, Unterzeile leise; ein Tipp öffnet die Meldung.
- **Schadenmeldung:** drei Schritte mit Fortschritt, ein Schritt pro Bildschirm, «Weiter» klebt am Handy über der Leiste.
- **Partnerband:** gleich grosse weisse Karten, langsam laufend, hält beim Darüberfahren, still bei «Bewegung reduzieren».
- **Lücke:** gelber Hinweis mit Rand links, nur in der Vorschau.

## Do's and Don'ts

- **Do:** «Schaden melden» und Telefon in jedem Bildschirm erreichbar halten.
- **Do:** Kontrast in beiden Lacken messen, hell und dunkel.
- **Don't:** Preise, Fristen, Garantien oder Superlative ohne Freigabe zeigen.
- **Don't:** eine zweite gefüllte Akzentfläche neben die Hauptaktion stellen.
- **Don't:** Bewegung, die unter «Bewegung reduzieren» weiterläuft.
