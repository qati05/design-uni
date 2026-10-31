// Medaur · Plakat. Eine Bewegung: die Wortmarke zieht sich auf, und das gelbe A öffnet sich beim Scrollen zum Sucher.
// Alles andere steht still und ist sofort lesbar. Formular und Leiste laufen immer, auch ohne GSAP.
(() => {
  const html = document.documentElement;
  const de = html.lang.startsWith('de');
  const bewegt = html.classList.contains('bewegt') && window.gsap && window.ScrollTrigger;
  if (!bewegt) html.classList.remove('bewegt'); // fehlt GSAP, steht der Hero ruhig
  const hoch = () => matchMedia('(max-aspect-ratio: 1/1)').matches;

  // Film: Quelle erst setzen, wenn er gebraucht wird.
  function ladeFilm(video) {
    if (!video || video.dataset.geladen) return;
    const basis = hoch() && video.dataset.hoch ? video.dataset.hoch : video.dataset.quer;
    for (const [endung, typ] of [['webm', 'video/webm'], ['mp4', 'video/mp4']]) {
      const s = document.createElement('source');
      s.src = `${basis}.${endung}`;
      s.type = typ;
      video.append(s);
    }
    video.dataset.geladen = '1';
    video.load();
  }
  // Standbild passend zum Format. Der Film der Messung bleibt ein Standbild: nichts läuft von selbst weiter.
  const setzePoster = (v) => { if (v) v.poster = `${hoch() && v.dataset.hoch ? v.dataset.hoch : v.dataset.quer}.webp`; };
  setzePoster(document.querySelector('.messung__film'));

  // Formular. Ohne Endpunkt geht die Anfrage per SMS direkt an die Ansprechperson, statt ins Leere.
  const form = document.querySelector('.formular');
  if (form) {
    const meldung = form.querySelector('.formular__meldung');
    const knopf = form.querySelector('button[type="submit"]');
    const tel = form.elements.telefon;
    const zettel = form.querySelector('.zettel');
    for (const feld of ['name', 'telefon', 'zeit']) {
      const input = form.elements[feld];
      const zeile = zettel && zettel.querySelector(`[data-feld="${feld}"]`);
      const wert = zeile && zeile.lastElementChild;
      const leer = wert ? wert.textContent : '';
      // Feld wächst mit dem Text, damit der Satz ein Satz bleibt.
      const breite = () => { input.style.width = `${Math.max(input.value.length, input.placeholder.length) * 0.9 + 1}ch`; };
      breite();
      input.addEventListener('input', () => {
        breite();
        const v = input.value.trim();
        input.classList.toggle('ist-voll', !!v);
        if (feld === 'telefon' && v) { input.removeAttribute('aria-invalid'); if (meldung.dataset.art === 'fehler') { meldung.textContent = ''; meldung.dataset.art = ''; } }
        if (!wert) return;
        wert.textContent = v || leer;
      });
    }
    // Am Handy öffnet der Knopf die SMS-App gleich selbst; am Computer bleibt es beim Angebot.
    const handy = matchMedia('(pointer: coarse)').matches;
    const zeigeSms = (daten, direkt) => {
      const nummer = form.dataset.sms;
      const text = `${meldung.dataset.smsGruss}: ${[daten.name, daten.telefon, daten.zeit].filter(Boolean).join(', ')}`;
      meldung.textContent = '';
      meldung.dataset.art = 'sms';
      const satz = document.createElement('span');
      satz.textContent = (direkt ? meldung.dataset.smsOffen : meldung.dataset.smsText) + ' ';
      const sms = document.createElement('a');
      sms.className = 'knopf formular__sms';
      sms.href = `sms:${nummer}?&body=${encodeURIComponent(text)}`;
      sms.dataset.zaehl = 'sms';
      sms.dataset.ort = 'formular';
      sms.textContent = meldung.dataset.smsKnopf;
      const oder = document.createElement('span');
      oder.className = 'formular__oder';
      const anruf = document.createElement('a');
      anruf.href = `tel:${nummer}`;
      anruf.dataset.zaehl = 'anruf';
      anruf.dataset.ort = 'formular-meldung';
      anruf.textContent = (document.querySelector('.person__tel') || {}).textContent || nummer;
      oder.append(meldung.dataset.smsOder + ' ', anruf);
      meldung.append(satz, sms, oder);
      sms.focus(); // rückt den nächsten Schritt ins Bild, auch am Handy
      if (direkt) sms.click(); // öffnet die SMS-App wie ein Tipp auf den Link
    };
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (form.elements.firma_fax.value || form.dataset.laeuft) return;
      if (!tel.value.trim()) {
        tel.setAttribute('aria-invalid', 'true');
        meldung.textContent = meldung.dataset.fehler;
        meldung.dataset.art = 'fehler';
        tel.focus();
        return;
      }
      tel.removeAttribute('aria-invalid');
      const daten = Object.fromEntries(['name', 'telefon', 'zeit'].map((k) => [k, form.elements[k].value.trim()]));
      const ziel = form.dataset.endpoint;
      if (!ziel) { zeigeSms(daten, handy); return; }
      daten.sprache = form.dataset.sprache;
      form.dataset.laeuft = '1';
      const knopfText = knopf.textContent;
      knopf.disabled = true;
      knopf.textContent = de ? 'Wird gesendet …' : 'Sending …';
      try {
        const r = await fetch(ziel, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(daten) });
        if (!r.ok) throw new Error(String(r.status));
        meldung.textContent = de ? 'Danke. Wir rufen Sie am gleichen Werktag zurück.' : 'Thank you. We will call you back the same working day.';
        meldung.dataset.art = 'ok';
        if (zettel) zettel.classList.add('ist-gesendet');
        knopf.textContent = de ? 'Gesendet' : 'Sent';
      } catch {
        delete form.dataset.laeuft;
        knopf.disabled = false;
        knopf.textContent = knopfText;
        zeigeSms(daten);
      }
    });
  }

  // Leiste auf dem Handy: nach dem Hero sichtbar, beim Formular wieder weg.
  const leiste = document.querySelector('.leiste');
  const hero = document.querySelector('.hero');
  const preisForm = document.querySelector('#rueckruf');
  if (leiste && hero && preisForm && matchMedia('(max-width: 900px)').matches) {
    leiste.hidden = false;
    let nachHero = false, beimForm = false;
    const setze = () => leiste.classList.toggle('ist-sichtbar', nachHero && !beimForm);
    new IntersectionObserver(([e]) => { nachHero = !e.isIntersecting && e.boundingClientRect.top < 0; setze(); }).observe(hero);
    new IntersectionObserver(([e]) => { beimForm = e.isIntersecting || e.boundingClientRect.top < 0; setze(); }).observe(preisForm);
  }

  if (!bewegt) return; // ohne Bewegung: Wortmarke breit, A gelb, kein Film

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  setzePoster(document.querySelector('.sucher__film'));

  // Die eine Bewegung, Teil 1: Wortmarke zieht sich beim Laden von schmal auf breit (wdth 62 → 125), in unter einer Sekunde.
  const wort = document.querySelector('.wort');
  const a = document.querySelector('.wort__a');
  const buehne = document.querySelector('.buehne');
  const sucher = document.querySelector('.sucher');
  const film = document.querySelector('.sucher__film');
  const satz = document.querySelector('.sucher__satz');
  const unten = document.querySelector('.hero__unten');
  gsap.fromTo(wort, { '--breite': 62 }, { '--breite': 125, duration: 0.9, ease: 'expo.out', onComplete: () => { if (zustand.p === 0) { miss(); zeichne(); } } });

  // Teil 2: das gelbe A wird zum Sucher und öffnet sich beim Scrollen bis zur vollen Fläche.
  let start = { o: 0, r: 0, u: 0, l: 0 };
  const miss = () => {
    const b = buehne.getBoundingClientRect();
    const r = a.getBoundingClientRect();
    start = { o: r.top - b.top, r: b.right - r.right, u: b.bottom - r.bottom, l: r.left - b.left };
  };
  const zustand = { p: 0 };
  const zeichne = () => {
    const k = 1 - zustand.p;
    sucher.style.setProperty('--o', `${start.o * k}px`);
    sucher.style.setProperty('--r', `${start.r * k}px`);
    sucher.style.setProperty('--u', `${start.u * k}px`);
    sucher.style.setProperty('--l', `${start.l * k}px`);
  };
  miss(); zeichne();
  document.fonts && document.fonts.ready.then(() => { miss(); zeichne(); });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 1,
      onRefresh: () => { if (zustand.p === 0) { miss(); zeichne(); } },
      onUpdate: (self) => {
        html.classList.toggle('sucher-an', self.progress > 0.002);
        if (self.progress > 0.002) ladeFilm(film);
      },
      // Der Film spielt einmal, solange der Sucher offen ist, und hält dann auf dem letzten Bild.
      onToggle: (self) => { if (self.isActive) { ladeFilm(film); film.play().catch(() => {}); } else film.pause(); },
    },
  });
  tl.to(zustand, { p: 1, duration: 0.62, ease: 'power3.inOut', onUpdate: zeichne }, 0)
    .to(unten, { opacity: 0, y: -48, duration: 0.22 }, 0)
    .to(wort, { opacity: 0, duration: 0.005 }, 0.3) // harter Schnitt, wenn der Film kommt
    .to(film, { opacity: 1, duration: 0.3 }, 0.3)
    .to(sucher, { '--film': 1, duration: 0.25 }, 0.45)
    .fromTo(satz, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.66)
    .to({}, { duration: 0.14 });
  addEventListener('scroll', () => ladeFilm(film), { once: true, passive: true });
})();
