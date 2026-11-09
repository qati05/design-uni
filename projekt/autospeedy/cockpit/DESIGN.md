---
name: Auto Speedy Cockpit
description: Arbeits-App für das Team der Auto Speedy AG. Sieht aus und bedient sich wie die Einstellungen auf dem iPhone oder Mac, damit sie vertraut wirkt.
colors:
  akzent: "#1566b8"
  akzent-tief: "#0f4f94"
  akzent-hell: "#e6effa"
  grund: "#f2f2f7"
  karte: "#ffffff"
  leiste: "#e9e9ef"
  linie: "#dcdce1"
  fuell: "#e9e9ee"
  leise: "#636368"
  tinte: "#1c1c1e"
  gruen: "#248a3d"
  rot: "#c5221f"
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Segoe UI Variable Text, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.4
  headline:
    fontFamily: "wie body"
    fontSize: "28px"
    fontWeight: 700
    letterSpacing: "-0.02em"
  gruppentitel:
    fontSize: "13px"
    textTransform: "uppercase"
    letterSpacing: "0.02em"
rounded:
  gruppe: "12px"
  knopf: "12px"
  blatt: "16px"
components:
  button-primary:
    backgroundColor: "{colors.akzent}"
    textColor: "{colors.karte}"
    rounded: "{rounded.knopf}"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.fuell}"
    textColor: "{colors.akzent-tief}"
    rounded: "{rounded.knopf}"
    height: "44px"
  gruppe:
    backgroundColor: "{colors.karte}"
    rounded: "{rounded.gruppe}"
---

# Design System: Auto Speedy Cockpit

## Overview

Entscheid Roni, 09.11.2026: Das Cockpit soll sich anfühlen und aussehen wie Apple oder andere vertraute Software, damit Auto Speedy ganz einfach ändern kann. Vorbild sind die Einstellungen auf dem iPhone und die Systemeinstellungen auf dem Mac. Wer ein Handy bedienen kann, findet sich zurecht, ohne etwas zu lernen. Von Auto Speedy bleiben das Logo und das Blau als Akzent. Die Website (Linie «Klar») behält ihre eigene Gestaltung.

## Colors

Hellgrauer Grund, weisse Gruppen. Blau trägt Aktionen (Knöpfe, antippbare Zeilen, der gewählte Bereich). Grün steht für «an» beim Schalter und für «veröffentlicht». Rot steht nur für Entfernen und Fehler. Die farbigen Felder vor den Bereichen dienen dem Wiederfinden und tragen keine Bedeutung.

## Typography

Die Schrift des Geräts: San Francisco auf iPhone und Mac, Segoe UI auf Windows, Roboto auf Android. Keine eigene Schrift wird geladen. Titel 28 px fett, Text 16 px, Gruppentitel 13 px in Grossbuchstaben, Erklärungen unter einer Gruppe 13 px in Grau. Zahlen mit Tabellenziffern.

## Layout

Computer (ab 860 px): Seitenleiste links mit den Bereichen, rechts der gewählte Bereich, höchstens 720 px breit. Handy: zuerst die Liste der Bereiche, Antippen führt auf die Unterseite, oben links «Übersicht» zum Zurückgehen. Tippziele mindestens 44 px.

Jeder Bereich besteht aus Gruppen: ein kleiner Titel, eine weisse Fläche mit Zeilen, darunter bei Bedarf ein erklärender Satz. In einer Zeile steht links der Name und rechts der Wert oder die Eingabe.

## Elevation & Depth

Flach. Schatten haben nur, was über der Seite schwebt: die Leiste «Prüfen und veröffentlichen», Meldungen unten und das Blatt.

## Shapes

Gruppen 12 px, Knöpfe 12 px, Blatt 16 px, Porträts rund.

## Components

- **Zeile:** Name links, Wert oder Eingabe rechts. Die ganze Zeile zeigt den Fokus.
- **Schalter:** wie auf dem iPhone, grün ist an.
- **Eintrag:** Zeile einer Liste (Person, Frage, Partner, Feiertag). Antippen öffnet das Blatt.
- **Bearbeiten:** oben rechts. Dann zeigt jeder Eintrag links ein rotes Minus (entfernen) und rechts Pfeile (verschieben).
- **Blatt:** kommt auf dem Handy von unten, steht am Computer in der Mitte. Oben rechts «Fertig».
- **Leiste unten:** erscheint, sobald etwas geändert ist: Zahl der Änderungen, «Verwerfen», «Prüfen und veröffentlichen».
- **Meldung unten:** dunkel, nach dem Entfernen mit «Rückgängig».
- **Besucher:** eine grosse Zahl, darunter Säulen pro Tag in einer Farbe, dazu dieselben Werte als Tabelle.

## Do's and Don'ts

- **Do:** Jede Änderung zuerst als Entwurf. Auf die Website kommt sie erst nach «Prüfen und veröffentlichen».
- **Do:** Entfernen ohne Rückfrage, dafür immer mit «Rückgängig».
- **Do:** Wörter aus dem Alltag: «veröffentlichen», «zurücknehmen», «Stand». Kein «Commit», kein «Deploy».
- **Don't:** style-Attribute im Markup. Die CSP des Cockpits erlaubt nur das Stylesheet.
- **Don't:** eine zweite gefüllte Akzentfarbe für Aktionen.
- **Don't:** Bewegung, die unter «Bewegung reduzieren» weiterläuft.
