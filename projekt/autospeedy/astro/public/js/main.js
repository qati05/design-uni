/* Öffnungsstatus aus dem Datenblock «betrieb-daten» (Zeiten aus betrieb.json, Wortlaut aus texte.json; eine Quelle).
   Ohne dieses Skript bleibt der Satz aus texte.json stehen. Keine Cookies, nichts im Speicher des Geräts, keine fremden Hosts.
   Feiertage und Betriebsferien: «ausnahmen» in betrieb.json, nach Datum in Zürich; ein Eintrag ersetzt die Wochenzeiten dieses Tages. */
(function () {
  "use strict";
  var el = document.getElementById("betrieb-daten"), daten = null;
  try { if (el) daten = JSON.parse(el.textContent); } catch (e) {}
  if (!daten || !daten.zeiten || !daten.status) return;
  var sprache = document.documentElement.lang || "de-CH", s = daten.status;
  var tagName = function (d) { return new Intl.DateTimeFormat(sprache, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 4 + d))); };
  var uhr = function (m) { var h = Math.floor(m / 60), r = m % 60; return h + "." + (r < 10 ? "0" : "") + r; };
  function zuerich(d) {
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }), t = {};
    f.formatToParts(d).forEach(function (p) { t[p.type] = p.value; });
    return { tag: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[t.weekday], min: parseInt(t.hour, 10) * 60 + parseInt(t.minute, 10),
      utc: Date.UTC(parseInt(t.year, 10), parseInt(t.month, 10) - 1, parseInt(t.day, 10)) };
  }
  var aus = daten.ausnahmen || {};
  // Fenster eines Tages j Tage nach heute: Ausnahme nach Datum vor den Wochenzeiten.
  function fenster(z, j) {
    var datum = new Date(z.utc + j * 864e5).toISOString().slice(0, 10);
    return Object.prototype.hasOwnProperty.call(aus, datum) ? aus[datum] : daten.zeiten[(z.tag + j) % 7] || [];
  }
  function status(jetzt) {
    var z = zuerich(jetzt), f = fenster(z, 0), i, j, d, g;
    for (i = 0; i < f.length; i++) if (z.min >= f[i][0] && z.min < f[i][1]) return s.offen.replace("{bis}", uhr(f[i][1]));
    for (j = 0; j <= 7; j++) { d = (z.tag + j) % 7; g = fenster(z, j);
      for (i = 0; i < g.length; i++) if (j > 0 || g[i][0] > z.min) return j === 0 ? s.zuHeute.replace("{ab}", uhr(g[i][0])) : s.zuTag.replace("{tag}", tagName(d)).replace("{ab}", uhr(g[i][0])); }
    return s.zu;
  }
  var teile = document.querySelectorAll("[data-status]"), i;
  for (i = 0; i < teile.length; i++) teile[i].textContent = status(new Date());
  window.__vorlage = { status: status };
})();
