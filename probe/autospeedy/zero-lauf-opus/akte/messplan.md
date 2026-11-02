# Messplan (design-uni conversion.md Teil 7, text-uni M11)

**Ziel:** mehr gemeldete Schäden und Anrufe über die Website, ohne Cookies gezählt.

## Zählpunkte auf der Seite (gebaut)
Jeder `tel:`-, `mailto:`- und Karten-Link trägt `data-zaehl` (anruf, mail, route, bewertungen, anfrage) und `data-ort` (kopf, start, fuss, menue, kontakt, schaden-neben, tesla-neben, bestaetigung …); geprüft: 100 % (pruefen.cjs). Die Formulare tragen `data-zaehl-start="anfrage-begonnen"` und `data-zaehl-ende="anfrage-vorbereitet"`. **Kein Versand:** Ein eigener Endpunkt für `sendBeacon` fehlt (kein Backend, E6) [Lücke]. Bis dahin zählt nur der Betrieb.

## Begriffe mit Zielseite `[Annahme, siehe text-akte.md]`
Carrosserie Altstätten → index · Spritzwerk Altstätten → index · Karosserieschaden melden → schaden · Tesla Carrosserie Rheintal → tesla · Hagelschaden Altstätten → leistungen#carrosserie · Felgen reparieren Rheintal → leistungen#felgen · Auto Speedy Öffnungszeiten → kontakt

## Ausgangswerte
Website und Google-Profil der letzten 3 Monate: [Lücke] (Zugang zur Search Console und zum Profil beim Betrieb). Export der letzten 16 Monate beim Betrieb, nicht im Repository (M12).

## Eigene Zählung im Betrieb (M14)
Acht Wochen Strichliste am Telefon und bei jeder Schadenmail: «Wie sind Sie auf uns gekommen?» Website · Google-Suche · Tesla · Versicherung · Empfehlung · Stammkunde. Nur Zahlen, keine Namen.

## Ziel- und Warnwerte `[Annahme]`
| Kennzahl | Warnwert |
|---|---|
| Schadenmails mit Betreff «Schadenmeldung» je Woche | 0 in 14 Tagen nach dem Livegang |
| Testsendung über das Formular | kommt nicht an (monatlich prüfen) |
| `tel:`-Nummer | ≠ 071 755 88 61 (pruefen.cjs vor jeder Änderung) |

## Erste Auswertung
8 Wochen nach dem Livegang (Datum offen, M13); kleine Zahlen als «zu wenig Daten» (M3); Ursache nur mit Ausschluss von Saison (Hagel!), Updates und Technik (M15).

**T8:** Ziele liegen vor (text-akte.md), Messplan enthält Ziel, Begriffe, Ausgangswerte (als Lücke), eigene Zählung, Datum der Auswertung (als Regel, kein Datum). **Teilweise:** Ausgangswerte und Datum fehlen, darum nach Skill «nicht bestanden».
