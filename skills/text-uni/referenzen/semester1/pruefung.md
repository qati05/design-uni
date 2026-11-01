# Semester 1 · Prüfung: blinder Test «Welcher Text ist klarer?»

Stand 01.11.2026 · Der Prüfauftrag ist nicht Teil dieses Skills · Testtexte, Reihenfolgen, Schlüssel und Rohantworten liegen nur im Scratchpad der Sitzung, nicht im Repo.

> **Achtung: Modell-Urteile, kein Test mit Menschen.** Alle Ergebnisse unten stammen von Sprachmodellen als Bewertern. Laut Abgleich mit Forschung zu Menschen ist ihr Urteil zur **Lesbarkeit und Klarheit eher glaubwürdig**, denn dort stimmen Modelle gut mit Menschen überein. **Nicht glaubwürdig** ist es bei Überzeugungskraft und bei «würde eher anrufen»: Dort liegen Modelle nahe am Zufall oder korrelieren schlecht mit Menschen. Modelle bevorzugen zudem Texte im **eigenen Stil** und **längere** Fassungen; hier enthielt die bessere Fassung mehr Information, und dieselbe Modellfamilie schrieb und bewertete. Ein Test mit Menschen fehlt. `[Fakt · Trott, Rivière, 2024; Durmus u. a., 2024; Panickssery, Bowman, Feng, 2024; Dubois u. a., 2024; alle laut Abgleich; Folgerung für diesen Test: Annahme]` Einzelheiten: [../abgleich-menschen.md](../abgleich-menschen.md).

## Ergebnis zuerst

**Bestanden.** In allen 10 echten Paaren wählten alle 6 Bewerter die Fassung nach den Grundsätzen als klarer und als die, die sie eher anrufen lässt (60 von 60 Urteilen). Beide Kontrollpaare wurden von allen 6 durchschaut (12 von 12). Opus und Fable urteilten gleich.

**Aber:** Der Test war zu leicht, um einzelne Grundsätze zu prüfen. Er zeigt, dass konkrete Texte gegen Floskeltexte gewinnen. Er zeigt nicht, welche der 93 Grundsätze den Unterschied machen (Abschnitt «Grenzen»).

## Aufbau

| Teil | Wie |
|---|---|
| Texte | 12 Paare zu sichtbar erfundenen Musterbetrieben (Malerei, Garage, Restaurant, Hotel, Physiotherapie, Coiffeur, Veloladen, Schreinerei, Treuhand, Informatik, Sanitär, Bäckerei), je 43 bis 61 Wörter |
| Echte Paare | 10: eine typische KMU-Fassung (Floskeln, Nominalstil, Passiv, keine Fakten) gegen eine Fassung nach den Grundsätzen (Antwort zuerst, kurze Sätze, Aktiv mit «wir», Preis, Dauer, Zeiten, Telefon im Schweizer Format) |
| Kontrollpaare | 2: die «nachher»-Fassung ist absichtlich schlechter, einmal als KI-Werbeton (Ortsfloskel, Gegensatz-Schablone, Modewort «ganz·heitlich», siehe [ki-klang.md](ki-klang.md)), einmal als Amtsdeutsch («Die Bereitstellung von Backwaren erfolgt …») |
| Prüfung der Texte | `slop-de.js` auf alle Fassungen nach den Grundsätzen: 0 Fehler, 0 Warnungen |
| Bewerter | 6 Unteragenten ohne Projekt-Kontext und ohne die Skripte: 3 × Opus, 3 × Fable 5.1, Stufe hoch |
| Reihenfolge | je Bewerter eigene Reihenfolge der Paare und eigene Zuteilung zu A und B (Zufall mit festem Startwert) |
| Frage | je Paar: «Welcher Text ist klarer?», «Welcher würde Sie eher anrufen oder buchen lassen?», ein Satz warum |
| Schwelle | `[Annahme]` aus dem Auftrag: in mindestens 8 von 10 Paaren mindestens 5 von 6 für die Fassung nach den Grundsätzen; Kontrollpaare mehrheitlich durchschaut |

## Zahlen

| | Opus | Fable | Zusammen |
|---|---|---|---|
| Echte Paare: Fassung nach den Grundsätzen klarer | 30/30 | 30/30 | **60/60** |
| Echte Paare: eher anrufen | 30/30 | 30/30 | **60/60** |
| Paare mit mindestens 5 von 6 | 10/10 | 10/10 | **10/10** (Schwelle 8) |
| Kontrollpaare durchschaut | 6/6 | 6/6 | **12/12** |

Klarer und Anrufen fielen in jedem Urteil gleich aus.

## Was die Bewerter als Grund nannten

Fast jeder Satz nannte dieselben Dinge, in dieser Häufigkeit `[Fakt · eigene Auszählung der 72 Begründungen, 01.11.2026]`:

1. **Preis** genannt (in fast allen echten Paaren).
2. **Dauer oder Zeit** (Öffnungszeiten, «nach 30 Minuten», «acht bis zehn Wochen»).
3. **Was ich tun muss** (Nummer, Online-Buchung, was mitbringen).
4. **Mein Problem** statt Firmenlob («Drucker, WLAN, Mails», «Rückenschmerzen»).
5. Gegen die Floskelfassung: «austauschbar», «Prospektsprache», «leeres IT-Marketing», «Amtsdeutsch», «sagt nichts, was ich nicht schon weiss».

Das passt zu den Grundsätzen V1 (Hauptaussage zuerst), W18 und W22 (Behauptungen mit Beleg, konkret), K2 (Eigenschaften mit Beleg), K3 (Ersetzungstest) und L1 (Kern in den ersten Sätzen).

## Grenzen

- **Inhalt statt Stil:** Die Fassungen nach den Grundsätzen enthielten mehr Information (Preise, Zeiten, Nummern) als die Floskelfassungen. Der Test misst darum vor allem «konkret schlägt leer». Ob kurze Sätze, Aktiv oder Schweizer Zahlenformat bei **gleichem Inhalt** einen Unterschied machen, ist nicht geprüft.
- **Deckeneffekt:** 60 von 60 lässt keine Abstufung zu. Ein Test, der einzelne Grundsätze trennt, braucht Paare mit gleichen Fakten und nur einem veränderten Merkmal.
- **Bewerter sind Modelle**, keine Kundinnen und Kunden. Ob Menschen gleich urteilen, ist offen.
- **Die Kontrollpaare** waren grob schlecht. Feinere Fallen (zum Beispiel ein konkreter, aber unübersichtlicher Text) fehlen.
- **Ich habe Texte und Schlüssel selbst geschrieben.** Die Bewerter kannten weder die Skripte noch den Zweck.

## Für Semester 2 und den Bachelor `[Vorschlag]`

1. **Paare mit gleichem Inhalt:** dieselben Fakten, einmal nach W1 bis W12 (Satzlänge, Verben, Aktiv), einmal dagegen. Misst den Stil allein.
2. **Ein Merkmal je Paar:** Satzlänge allein, Zahlenformat allein, Überschrift als Aussage gegen Stichwort.
3. **Feinere Fallen:** konkret, aber in einem langen Block ohne Gliederung; korrekt, aber mit drei KI-Wörtern.
4. **Ergebnis als Rangfolge** der Grundsätze nach Wirkung, damit die Text-Uni weiss, was zuerst zählt.
