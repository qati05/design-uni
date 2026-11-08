---
name: Auto Speedy Cockpit (Linie Klar)
description: Arbeits-App für das Team der Auto Speedy AG, gestaltet wie die Website-Linie «Klar»
colors:
  akzent: "#1566b8"
  akzent-tief: "#0f4f94"
  grund: "#f4f4f2"
  papier: "#ffffff"
  flaeche: "#f2efea"
  flaeche-2: "#e8e4dd"
  linie: "#dcd9d3"
  leise: "#5b5f66"
  tinte: "#1d1e20"
typography:
  headline:
    fontFamily: "Source Serif 4, Iowan Old Style, Georgia, serif"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  data:
    fontFamily: "Archivo, Hanken Grotesk, sans-serif"
    fontWeight: 400
rounded:
  feld: "10px"
  gross: "20px"
  pille: "999px"
components:
  button-primary:
    backgroundColor: "{colors.akzent}"
    textColor: "{colors.papier}"
    rounded: "{rounded.pille}"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.flaeche-2}"
    textColor: "{colors.tinte}"
    rounded: "{rounded.pille}"
    height: "48px"
  card:
    backgroundColor: "{colors.papier}"
    rounded: "{rounded.gross}"
---

# Design System: Auto Speedy Cockpit (Linie Klar)

## Overview

Dieselbe Welt wie die Website-Linie «Klar» (`../astro-klar/DESIGN.md`), ruhiger gesetzt, weil hier gearbeitet wird: warmes Papier, Titel in einer Serife, Bedienung in einer Grotesk, Zahlen in Archivo mit Tabellenziffern.

## Colors

Gefülltes Blau trägt nur die Hauptaktion. Grün und Orange stehen nur für Status. Alles andere steht auf Papier oder Fläche.

## Typography

Source Serif 4 für Titel und Schadenart, Hanken Grotesk für Text und Knöpfe, Archivo für Kennzahlen, Zeiten und Codes.

## Layout

Inhalt höchstens 1100 px. Listen und Kennzahlen sind je eine Tafel mit Haarlinien statt vieler einzelner Karten. Unter 760 px einspaltig, Bereiche unten in Daumenreichweite. Tippziele mindestens 44 px.

## Elevation & Depth

Tafeln mit dem weichen, zweistufigen Klar-Schatten. Sonst trennen Haarlinien und Flächenwechsel.

## Shapes

Knöpfe als Pille, Felder 10 px, Tafeln 20 px.

## Components

- **Knopf:** Hauptaktion blau, Nebenaktion Fläche 2, 48 px hoch.
- **Meldungszeile:** Schadenart in der Serife, Metazeile, Status als Pille.
- **Reiter:** Pillen auf Fläche 2, aktiv in Tinte.

## Do's and Don'ts

- **Do:** den nächsten Schritt zuerst zeigen.
- **Do:** Zahlen und Zeiten mit Tabellenziffern setzen.
- **Don't:** eine zweite gefüllte Akzentfarbe einführen.
- **Don't:** Bewegung, die unter «Bewegung reduzieren» weiterläuft.
