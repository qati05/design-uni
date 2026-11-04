# Kundenweg – vom frischen Schaden zur Meldung (Linie «Klar»)

Auftrag Roni, 04.11.2026: die Logik des Kunden nachbauen und den Weg zur Meldung so einfach wie möglich machen;
dazu Bewegung, die sich bedacht und hochwertig anfühlt, Scrollen «wie eine Feder, die von oben nach unten fällt».
Grundlage: PRODUCT.md (Nutzer, Prinzipien), DESIGN.md, BEWEGUNG.md, Rundgang 390 × 844 und 1440 × 900.

## Wer kommt, mit welcher Frage

Jemand hat gerade einen Schaden (Parkschaden, Unfall, Hagel, Kratzer, Scheibe, Felge), meist am Handy, oft
unterwegs. Im Kopf laufen der Reihe nach fünf Fragen:

| # | Frage im Kopf | Wo die Seite antwortet | Stand |
|---|---|---|---|
| 1 | Bin ich hier richtig? (Carrosserie, in der Nähe, meine Marke) | Hero-Titel und Lead, Faktenleiste (Ort) | gut |
| 2 | Muss ich mich um die Versicherung kümmern? | Lead im Hero, FAQ «Wer zahlt?» | gut |
| 3 | Was passiert, wenn ich melde? Wie viel Aufwand ist das? | fehlte; nur im Formular selbst | **neu: «So geht es nach dem Melden weiter»** |
| 4 | Anrufen oder schreiben? Ist gerade jemand da? | Status nur in Faktenleiste und Fuss | **neu: Status direkt unter den Hero-Knöpfen** |
| 5 | Wie schnell bin ich durch? | Formular: 2 Schritte, nur Art, Name, Telefon Pflicht | gut (anderer Thread) |

## Was schon stimmt (nicht anfassen)

- «Schaden melden» ist auf jeder Seite in Reichweite: Kopf, Hero, Aufruf, Fuss, am Handy die Leiste unten,
  die erst erscheint, wenn die Hero-Knöpfe weg sind (nie vier Knöpfe gleichzeitig).
- Leistungs- und Tesla-Seiten springen mit Vorwahl ins Formular (`?art=hagel`, `?fahrzeug=tesla`): ein Tipp gespart.
- Formular: Art wählen schaltet von selbst weiter, Pflicht nur Name und Telefon, Rest freiwillig und offen sichtbar.

## Umgesetzt (04.11.2026)

1. **Öffnungsstatus im Hero.** Unter «Schaden melden / Anrufen» steht «Jetzt offen bis 17.30 Uhr» oder
   «Jetzt geschlossen, Donnerstag ab 7.30 Uhr offen.» und dann «Online melden geht jederzeit, wir rufen Sie zurück.»
   Wer abends nach dem Parkschaden anruft, landet sonst im Leeren und geht. Quelle ist dieselbe wie im Fuss
   (Betriebszeiten und Ausnahmen aus dem Cockpit). Die Faktenleiste zeigt dann die Wochenzeiten statt den Status
   doppelt. Ohne JavaScript bleibt die Zeile weg.
2. **«So geht es nach dem Melden weiter.»** Drei Schritte direkt vor dem Aufruf: Sie melden (Art, Name, Telefon;
   Rest freiwillig) · Wir rufen zurück (in der Regel in den Öffnungszeiten) · Wir reparieren (Versicherung
   übernehmen wir, Ersatzwagen auf Anfrage). Nur Sätze, die schon auf der Seite oder im Formular stehen; keine
   Fristen, keine Dauer. Nimmt die Angst «das wird kompliziert» unmittelbar vor dem Knopf.
3. **Bewegung «Feder».**
   - Titel, Aufrufe und Listen (Leistungen, Ablauf, FAQ, weitere Leistungen, Bewertungen) sinken beim
     Hereinscrollen 14 px von oben an ihren Platz, Glied für Glied (90 ms), Feder ohne Überschwingen, 1,1 s.
     Was beim Laden schon im Bild ist, steht sofort.
   - Seitenwechsel: alte Seite blendet in 160 ms aus, neue sinkt 10 px von oben ein; der Kopf bleibt stehen.
     (View Transitions: Chrome, Edge, Safari ab 18.2; sonst normaler Wechsel.)
   - Mausrad am Desktop rollt weich aus (gedämpfte Annäherung, kein Überschwingen). Trackpad, Touch, Tastatur,
     Zoom, Dialoge und eigene Scrollbereiche bleiben nativ. Anker und «Nach oben» gleiten.
   - Leistungsfotos zoomen beim Zeigen kaum merklich nach (3,5 %, 900 ms).
   - Unter «Bewegung reduzieren» läuft nichts davon.

## Offen, braucht den Betrieb

- Rückrufzeit («innert einer Stunde» o. ä.) wäre der stärkste Hebel in Schritt 2, ist aber nicht belegt (F4, PRODUCT.md).
- WhatsApp-Nummer bestätigen: dann könnte «Per WhatsApp» als dritter Weg auch in den Hero.
- Echte Google-Bewertungen live schalten: Vertrauen direkt über dem Aufruf.
- Nach dem Livegang mit den Zählpunkten messen: Anteil `anfrage` aus `hero`, `ablauf`/`anfrage`, `leiste`;
  Abbruch zwischen Schritt 1 und 2 (`schaden-start` gegen gesendete Meldungen).
