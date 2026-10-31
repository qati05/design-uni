// Auto Speedy · Die Schadenskizze. Eine Bewegung: der Markierungskreis zeichnet sich beim Antippen (CSS, 300 ms).
// Ohne Skript: Formular und Telefon funktionieren, die Skizze ist ein Bild, die Stellen sind normale Kästchen.
(() => {
  const formular = document.querySelector('#melden');
  const skizze = document.querySelector('[data-skizze]');

  // Skizze und Kästchen zeigen dieselbe Auswahl.
  const kaestchen = (id) => formular && formular.querySelector(`input[data-stelle="${id}"]`);
  const zeige = (id, an) => {
    const m = skizze && skizze.querySelector(`[data-marke="${id}"]`);
    if (m) m.classList.toggle('ist-an', an);
  };
  if (skizze) {
    skizze.addEventListener('click', (e) => {
      const z = e.target.closest('[data-stelle]');
      if (!z) return;
      const k = kaestchen(z.dataset.stelle);
      if (!k) return;
      k.checked = !k.checked;
      skizze.classList.add('ist-benutzt');
      zeige(z.dataset.stelle, k.checked);
    });
  }
  if (formular) {
    formular.querySelectorAll('input[data-stelle]').forEach((k) => k.addEventListener('change', () => zeige(k.dataset.stelle, k.checked)));

    const meldung = formular.querySelector('.meldung');
    const pflicht = [...formular.querySelectorAll('[required]')];
    const fehler = (feld, an) => {
      const f = formular.querySelector(`#${feld.id}-f`);
      feld.toggleAttribute('aria-invalid', an);
      if (an) feld.setAttribute('aria-describedby', `${feld.id}-f`); else feld.removeAttribute('aria-describedby');
      if (f) f.classList.toggle('ist-an', an);
    };
    pflicht.forEach((feld) => {
      feld.addEventListener('blur', () => { if (feld.value.trim()) fehler(feld, false); });
      feld.addEventListener('input', () => { if (feld.value.trim()) fehler(feld, false); });
    });

    formular.addEventListener('submit', async (e) => {
      e.preventDefault();
      const leer = pflicht.filter((f) => !f.value.trim());
      pflicht.forEach((f) => fehler(f, leer.includes(f)));
      if (leer.length) { leer[0].focus(); return; }
      const d = new FormData(formular);
      const stellen = d.getAll('stelle');
      const text = [
        `Name: ${d.get('name')}`, `Telefon: ${d.get('telefon')}`,
        d.get('auto') ? `Auto: ${d.get('auto')}` : '', stellen.length ? `Stellen: ${stellen.join(', ')}` : '',
        d.get('text') ? `Was passiert ist: ${d.get('text')}` : '', '', 'Fotos hänge ich an.',
      ].filter((z, i, a) => z || a[i - 1]).join('\n');
      const ziel = formular.dataset.ziel;
      if (ziel) {
        const knopf = formular.querySelector('button[type="submit"]');
        knopf.disabled = true; knopf.textContent = 'Wird gesendet …';
        try {
          const r = await fetch(ziel, { method: 'POST', body: d });
          if (!r.ok) throw new Error(r.status);
          meldung.textContent = 'Danke. Ihre Meldung ist bei uns. Wir rufen Sie zurück.';
          knopf.textContent = 'Gemeldet';
          return;
        } catch { knopf.disabled = false; knopf.textContent = 'Schaden melden'; }
      }
      // Ohne Eingang: die Mail öffnet sich mit allen Angaben; Fotos hängt man dort an.
      const mail = `mailto:${formular.dataset.mail}?subject=${encodeURIComponent('Schadenmeldung')}&body=${encodeURIComponent(text)}`;
      meldung.textContent = '';
      const satz = document.createElement('p');
      satz.textContent = 'Ihr Mailprogramm ist offen, mit Ihren Angaben an info@autospeedy.ch. Hängen Sie zwei Fotos an und tippen Sie auf Senden.';
      const a = document.createElement('a');
      a.className = 'knopf knopf--leise'; a.href = mail; a.textContent = 'Mail nochmals öffnen';
      a.dataset.zaehl = 'mail'; a.dataset.ort = 'meldung';
      const t = document.createElement('p');
      t.append('Lieber reden? ');
      const tel = document.createElement('a');
      tel.href = 'tel:+41717558861'; tel.textContent = '071 755 88 61'; tel.dataset.zaehl = 'anruf'; tel.dataset.ort = 'meldung';
      t.append(tel);
      meldung.append(satz, a, t);
      a.focus();
      a.click();
    });
  }
})();
