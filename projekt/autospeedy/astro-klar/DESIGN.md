---
name: Auto Speedy AG, Linie «Klar» (Entwurf C)
description: Carrosserie und Spritzwerk in Altstätten SG; ruhige, helle Website, die Schadenmeldungen und Anrufe bringt.
colors:
  akzent: "#1566b8"
  akzent-tief: "#0f4f94"
  grund: "#fbfaf8"
  papier: "#ffffff"
  flaeche: "#ebe6de"
  flaeche-2: "#e2dbcf"
  linie: "#dcd9d3"
  leise: "#5b5f66"
  tinte: "#1d1e20"
  nacht: "#101215"
typography:
  display:
    fontFamily: "Source Serif 4, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(42px, 4.4vw, 62px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Source Serif 4, Iowan Old Style, Georgia, serif"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1
  data:
    fontFamily: "Archivo, Hanken Grotesk, sans-serif"
    fontWeight: 400
    fontFeature: "\"tnum\""
rounded:
  feld: "10px"
  gross: "20px"
  pille: "999px"
spacing:
  rand: "clamp(20px, 4vw, 56px)"
  breit: "1240px"
  kopf: "64px"
components:
  button-primary:
    backgroundColor: "{colors.akzent}"
    textColor: "{colors.papier}"
    typography: "{typography.label}"
    rounded: "{rounded.pille}"
    padding: "0 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.akzent-tief}"
  button-secondary:
    backgroundColor: "{colors.flaeche-2}"
    textColor: "{colors.tinte}"
    rounded: "{rounded.pille}"
    height: "48px"
  input:
    backgroundColor: "{colors.papier}"
    textColor: "{colors.tinte}"
    rounded: "{rounded.feld}"
    height: "48px"
  card:
    backgroundColor: "{colors.papier}"
    rounded: "{rounded.gross}"
---

# Design System: Auto Speedy AG, Linie «Klar»

## Overview

**Creative North Star: "Werkbank x Messblatt"**

Der Name stammt aus dem Entwurf C selbst (`public/css/klar.css`). Die Werkbank steht für echte Fotos aus der Halle und ruhige, warme Flächen. Das Messblatt steht für Fakten in Tabellenziffern, Haarlinien und eine klare Ordnung. Ziel ist Konversion: Wer einen Schaden hat, findet «Schaden melden» und das Telefon ohne Suchen [Entscheid · Roni, 03.11.2026].

Ruhig, hell, grosse Fotos, wenig Text, eine Akzentfarbe aus dem Logo. Titel in einer Serifenschrift geben Gewicht ohne Lautstärke. Fliesstext und Knöpfe in einer neutralen Grotesk.

**Key Characteristics:**
- Eine Akzentfarbe, das Logo-Blau, für die Hauptaktion und aktive Zustände.
- Warme, gebrochene Weisstöne statt reinem Weiss als Grund.
- Pillenförmige Knöpfe, weich gerundete Karten.
- Fakten und Zeiten in Tabellenziffern.
- Bewegung mit Federn, immer abschaltbar unter «Bewegung reduzieren».

## Colors

Ein Blau auf warmem Papier; Tinte fast schwarz.

### Primary
- **Logo-Blau** (#1566b8): Hauptaktion «Schaden melden», Links, aktive Zustände. Weiss darauf 5,2:1.
- **Tiefblau** (#0f4f94): Hover der Hauptaktion.

### Neutral
- **Grund** (#fbfaf8): Seitengrund.
- **Papier** (#ffffff): Karten, Formulare, Felder.
- **Fläche** (#ebe6de, #e2dbcf): ruhige Bänder und Zweitknöpfe.
- **Linie** (#dcd9d3): Haarlinien.
- **Leise** (#5b5f66): Nebentext.
- **Tinte** (#1d1e20): Text und Titel.
- **Nacht** (#101215): dunkle Bänder, sparsam.

### Named Rules
**The One Blue Rule.** Gefülltes Blau trägt nur die Hauptaktion. Alles andere steht auf Fläche oder als Link.

## Typography

**Display Font:** Source Serif 4 (mit Iowan Old Style, Georgia)
**Body Font:** Hanken Grotesk (mit system-ui)
**Data Font:** Archivo, mit Tabellenziffern

**Character:** Eine ruhige Serife für Titel, eine sachliche Grotesk für Text und Bedienung, Archivo für Zahlen wie auf einem Messblatt. Alle drei liegen lokal und sind subsettet.

### Hierarchy
- **Display** (400, clamp 42 bis 62 px, 1,04): Hero-Titel, am Handy 35 px.
- **Headline** (400, 1,02): Abschnittstitel, Serife.
- **Title** (600): Kartentitel und kleine Überschriften.
- **Body** (400, 16 px, 1,55): Fliesstext.
- **Label** (500, 15 px): Knöpfe.

## Layout

Inhalt bis 1240 px breit, Seitenrand `clamp(20px, 4vw, 56px)`, Kopf 64 px. Grosse Fotos tragen die Abschnitte. Am Handy hält eine feste Leiste unten Telefon und «Schaden melden»; der Körper bekommt dafür Platz nach unten.

## Elevation & Depth

Fast flach. Karten heben sich mit einem weichen, zweistufigen Schatten ab: `0 1px 2px rgba(21,24,28,.05), 0 10px 30px rgba(21,24,28,.07)`. Sonst trennen Flächenwechsel und Haarlinien.

## Shapes

Knöpfe als Pille (999 px), Felder und kleine Karten 10 px, grosse Karten 20 px.

## Components

- **Knopf akzent:** Logo-Blau, weisse Schrift, Pille, 48 px hoch; gross 64 px.
- **Knopf kontur:** Fläche 2, Tinte, Pille.
- **Hero:** Serifentitel, kurzer Satz, Hauptaktion und Telefon, grosses Foto.
- **Leistungen:** Karten 3:2 mit Foto.
- **Bewertungen, FAQ, Faktenleiste, Tesla-Teil:** eigene Bausteine unter `src/components/`.
- **Ablauf «So geht es nach dem Melden weiter»:** drei nummerierte Schritte (Archivo-Ziffern in Blau, Haarlinie in Tinte), direkt vor dem Aufruf.
- **Hero-Status:** Öffnungsstatus mit Punkt unter den Hero-Knöpfen; geschlossen mit dem Satz, dass Melden jederzeit geht.
- **Bewegung «Feder»:** Inhalt sinkt beim Hereinscrollen 14 px von oben ein (1,1 s, ohne Überschwingen), Seitenwechsel sinkt 10 px ein, Mausrad rollt weich aus; alles aus unter «Bewegung reduzieren» (vorschau/c/KUNDENWEG.md).

## Do's and Don'ts

- **Do:** «Schaden melden» und Telefon auf jeder Seite in Reichweite halten.
- **Do:** Zahlen und Zeiten in Archivo mit Tabellenziffern setzen.
- **Don't:** eine zweite gefüllte Akzentfarbe einführen.
- **Don't:** Preise, Fristen, Garantien oder Superlative ohne Freigabe zeigen.
- **Don't:** Bewegung, die unter «Bewegung reduzieren» weiterläuft.
