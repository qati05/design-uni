# Supabase Auth: Einstellungen für den Mail-Code

Gehört zu `../EINRICHTEN.md`, Schritt 4. Alles im Dashboard des neuen Supabase-Projekts, Bereich «Authentication».

Die Namen der Menüpunkte stammen aus der Dokumentation von Supabase (Stand 10.11.2026). Im Dashboard können sie leicht
anders heissen. Geprüft ist davon noch nichts, weil es das Projekt noch nicht gibt.

| Was | Wo im Dashboard | Wert | Warum |
|---|---|---|---|
| Neue Konten | Sign In / Providers, «Allow new users to sign up» | aus | Nur angelegte Konten dürfen sich anmelden. |
| Anmeldung per Mail | Sign In / Providers, Email | an | Der Code kommt per Mail. |
| Länge des Codes | Sign In / Providers, Email, «Email OTP Length» | 6 | Das Cockpit nimmt genau 6 Ziffern an. Welcher Wert voreingestellt ist, ist nicht belegt. Bitte nachsehen. |
| Gültigkeit des Codes | Sign In / Providers, Email, «Email OTP Expiration» | 600 Sekunden | Voreingestellt ist 1 Stunde. Mail und Cockpit sagen «10 Minuten». |
| Mail-Vorlage | Emails, Templates, «Magic Link» | Inhalt von `mail-code-vorlage.html`. Betreff: «Ihr Anmelde-Code für das Cockpit» | Mit `{{ .Token }}` schickt Supabase den Code statt eines Links. |
| Absender | Emails, SMTP Settings, «Enable Custom SMTP» | Host, Port, Benutzer und Passwort des Mail-Dienstes. Dazu Absender-Adresse und Absender-Name | Ohne eigenen Absender schickt Supabase nur an Mitglieder der eigenen Organisation und nur 2 Mails pro Stunde. |
| Mails pro Stunde | Rate Limits, «Rate limit for sending emails» | 30 lassen | Das ist der Startwert nach dem Einschalten des eigenen Absenders. Für den Test genügt er. |
| Adresse der Anwendung | URL Configuration, «Site URL» | die Adresse des Cockpits | Für den Code wird sie nicht gebraucht. Sie soll aber nicht auf localhost zeigen. |
| Sitzungsdauer | Sessions | nichts ändern | Das Cockpit hält ein Gerät 30 Tage angemeldet und verlängert bei jeder Nutzung. |

Das Passwort des Mail-Dienstes trägt der Auftraggeber selbst ein. Es gehört nicht in den Chat und nicht ins Repo.

## Konten anlegen

Authentication → Users → «Add user» → «Create new user».

1. Mail-Adresse eintragen.
2. «Auto Confirm User» einschalten.
3. Als Passwort etwas Langes und Zufälliges eintragen. Es wird nie gebraucht: Das Cockpit kennt keine Anmeldung mit Passwort.

Danach `betrieb-anlegen.sql` ausführen.

## Was sich später ändern lässt

- Zwei Codes hintereinander gehen pro Adresse erst nach 60 Sekunden (Vorgabe von Supabase). Das Cockpit sagt dann «Zu viele Versuche».
- Eine feste Obergrenze für die Sitzung («Time-box») gibt es bei Supabase laut Dokumentation erst im Pro-Tarif.
