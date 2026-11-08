# Betriebsmodi: so wenig Team wie möglich, so viel wie nötig

Der Lead wählt den Modus im Fähigkeitsbericht und begründet ihn in einem Satz. Ein Wechsel nach oben braucht die Zustimmung des Entscheiders.

| Modus | Wann | Aktive Rollen | Quellcode-Schreiber | Richtungs-Gate |
| --- | --- | --- | --- | --- |
| **Schlank** (Standard) | Betriebs- oder Marketingseite bis ca. 10 Seiten, ein Techstack | Strategie, Frontend, QA; Kritiker nur bei der Abnahme | 1 | ja, ausser Bestandsprojekt |
| **Voll** | Viele Seiten oder getrennte Bereiche (z. B. Website + Buchungsstrecke), knappe Deadline | Strategie, Art Direction, Frontend A + B, QA, Kritiker (max. 3 gleichzeitig) | 2 | ja, ausser Bestandsprojekt |
| **Bestandsprojekt** | Richtung, Marke oder Designvertrag sind schon entschieden (Zusatz zu Schlank oder Voll) | wie gewählter Grundmodus, Art Direction nur als Prüfer | wie Grundmodus | **nein**: Lead verweist auf den vorhandenen Entscheid |

## Bestandsprojekt im Detail
- Vorhandene Entscheide (PRODUCT.md, DESIGN.md, frühere Design-Entscheide, Projektgedächtnis) gelten als Designvertrag. Der Lead zitiert Quelle und Datum in `vorlagen/DESIGN-ENTSCHEID.md` mit Status «ÜBERNOMMEN».
- Art Direction entwickelt keine neuen Richtungen, sondern meldet Lücken im Vertrag (z. B. fehlende Komponenten, Fotomotive).
- Neue Richtung nur auf ausdrücklichen Wunsch des Entscheiders.

## Aufwand je Modus (Richtwert, kein Versprechen)
Schlank verbraucht grob das Zwei- bis Dreifache einer Einzelsitzung, Voll das Vier- bis Sechsfache. Jeder Teammate hat sein eigenes Kontextfenster. Der Lead nennt vor dem Start den gewählten Modus und lässt bei unbekanntem Budget den Aufwandrahmen freigeben.

## Modell und Effort
Alle Rollen erben das Modell des Leads (`model: inherit`). Effort: Strategie, Frontend, QA `medium`; Art Direction und Kritiker `high`. Wer sparen will, nennt im Spawnprompt ein kleineres Modell für Strategie und QA. Nur in-process-Teammates übernehmen `effort` und `disallowedTools` aus der Definition; deshalb den Standard-Anzeigemodus «in-process» verwenden (Split-Panes laufen unter Windows Terminal ohnehin nicht).
