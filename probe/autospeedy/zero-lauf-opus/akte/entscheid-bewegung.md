# Entscheid Bewegung (web-uni Schritt 3, design-uni Schritt 4/7)

## B1 · Der Kreis um «Schaden» (die eine Bewegung)

| Feld | Inhalt |
|---|---|
| Stufe | 1 (CSS-Animation; 0,4 KB Inline-Skript misst die Pfadlänge) |
| Was sie zeigt | den Handgriff aus der Werkstatt: Ein Schaden wird mit blauem Stift eingekreist (foto-06) |
| Weil | die Idee «Der blaue Kreis» aus dem Betrieb stammt und der Kreis zeigt, was zählt; Bewegung aus Material und Handgriff hob blind rund einen Punkt (bewegung.md Teil 1) |
| Dauer | 700 ms nach 250 ms Verzögerung, Kurve «filzstift» (0.05, 0.7, 0.1, 1), einmal, danach still |
| Kosten | 0 KB Bibliothek; LCP unverändert (Titel ist ab 0 ms sichtbar, gemessen); TBT Startseite 35 ms |
| Ohne sie fehlt | nichts an Inhalt; der Kreis steht dann fertig da |
| Rückfall | ohne JavaScript und unter Reduced Motion: fertiger Kreis, keine Animation (gemessen: 0 Animationen) |
| Abschalter | `prefers-reduced-motion: reduce` |
| Gemessen | `arbeit/bewegung-ausgabe.txt`, Bildfolgen `arbeit/folge-desktop.png`, `folge-mobil.png`, `folge-ruhig.png` |
| Abweichung | animiert wird `stroke-dashoffset`, nicht Transform oder Deckkraft (P5-Regel); siehe prozess.md |

## B2 · Rückmeldung bei einer Auswahl (Interface, keine «Bewegung» im Sinn von Schritt 4)

Gewählte Stelle am Auto oder gewähltes Tesla-Modell: Kreis blendet in 250 ms ein (Deckkraft). Unter Reduced Motion sofort. Weil die Rückmeldung zeigt, was gewählt ist (G1 «Rückmeldung», G2 100 bis 300 ms).

**Nicht gebaut:** View Transitions, Scroll-Animationen, Bibliotheken, Video, 3D. Weil der Wunsch des Kunden «sauber, informativ, simple» ist und kein Bewegungswunsch vorliegt.

**V3:** jede Bewegung hat ihr Blatt; keine hält Inhalt zurück; ohne JS alles da (pruefen.cjs). **Bestanden.**
