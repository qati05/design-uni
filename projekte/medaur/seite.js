// Medaur · Plakat. Bewegung nur mit .bewegt (Skript an, keine reduzierte Bewegung gewünscht).
// Formular und Leiste laufen immer, auch ohne GSAP.
(() => {
  const html = document.documentElement;
  const de = html.lang.startsWith('de');
  const bewegt = html.classList.contains('bewegt') && window.gsap && window.ScrollTrigger;
  if (!bewegt) html.classList.remove('bewegt'); // fehlt GSAP, steht der Hero ruhig statt 230svh leer
  const hoch = () => matchMedia('(max-aspect-ratio: 1/1)').matches;

  // Film: Quelle erst setzen, wenn er gebraucht wird; nur abspielen, solange er sichtbar ist.
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
  function spieleSichtbar(video) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { ladeFilm(video); video.play().catch(() => {}); } else video.pause();
    }, { rootMargin: '25% 0px' }).observe(video);
  }

  // Standbild passend zum Format setzen; den Sucher nur, wenn er gezeigt wird.
  const setzePoster = (v) => { if (v) v.poster = `${hoch() && v.dataset.hoch ? v.dataset.hoch : v.dataset.quer}.webp`; };
  setzePoster(document.querySelector('.messung__film'));

  // Formular: ohne Endpunkt wird nichts gesendet, das sagt die Meldung offen.
  const form = document.querySelector('.formular');
  if (form) {
    const meldung = form.querySelector('.formular__meldung');
    const tel = form.elements.telefon;
    const zettel = form.querySelector('.zettel');
    // Zettel: zeigt beim Tippen, was ankommt. Das Feld markiert sich, sobald etwas drinsteht.
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
        if (feld === 'telefon' && v) input.removeAttribute('aria-invalid');
        if (!wert) return;
        wert.textContent = v || leer;
        zeile.classList.add('ist-neu');
        clearTimeout(zeile.t);
        zeile.t = setTimeout(() => zeile.classList.remove('ist-neu'), 600);
      });
    }
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (form.elements.firma_fax.value) return;
      if (!tel.value.trim()) {
        tel.setAttribute('aria-invalid', 'true');
        meldung.textContent = meldung.dataset.fehler;
        tel.focus();
        return;
      }
      tel.removeAttribute('aria-invalid');
      const ziel = form.dataset.endpoint;
      if (!ziel) { meldung.textContent = meldung.dataset.entwurf; return; }
      const daten = Object.fromEntries(['name', 'telefon', 'zeit'].map((k) => [k, form.elements[k].value.trim()]));
      daten.sprache = form.dataset.sprache;
      try {
        const r = await fetch(ziel, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(daten) });
        meldung.textContent = r.ok ? (de ? 'Danke. Wir melden uns bei Ihnen.' : 'Thank you. We will get back to you.') : meldung.dataset.fehler;
        if (r.ok && zettel) zettel.classList.add('ist-gesendet');
      } catch { meldung.textContent = de ? 'Das hat nicht geklappt. Bitte später nochmals versuchen.' : 'That did not work. Please try again later.'; }
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

  const messFilm = document.querySelector('.messung__film');
  if (!bewegt) return; // ohne Bewegung: nur Poster, kein Film, keine Animation

  const { gsap, ScrollTrigger } = window;
  const WEICH = 1; // eine Nachlaufzeit für alle Scroll-Bewegungen, damit sich jede Stelle gleich anfühlt
  gsap.registerPlugin(ScrollTrigger);
  spieleSichtbar(messFilm);
  setzePoster(document.querySelector('.sucher__film'));

  // 1 · Wortmarke zieht sich beim Laden von schmal auf breit (wdth 62 → 125).
  const wort = document.querySelector('.wort');
  const a = document.querySelector('.wort__a');
  const buehne = document.querySelector('.buehne');
  const sucher = document.querySelector('.sucher');
  const film = document.querySelector('.sucher__film');
  const satz = document.querySelector('.sucher__satz');
  const unten = document.querySelector('.hero__unten');
  // Jeder Buchstabe hat seine Endbreite schon im Markup: nichts verschiebt sich, das A steht von Anfang an fest.
  gsap.fromTo(wort, { '--breite': 62 }, { '--breite': 125, duration: 1.6, ease: 'expo.out', delay: 0.1, onComplete: () => { if (zustand.p === 0) { miss(); zeichne(); } } });
  gsap.from(unten.children, { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.35 });

  // 2 · Signatur: das gelbe A wird zum Sucher und öffnet sich bis zur vollen Fläche.
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
      trigger: hero, start: 'top top', end: 'bottom bottom', scrub: WEICH,
      onRefresh: () => { if (zustand.p === 0) { miss(); zeichne(); } },
      onUpdate: (self) => {
        html.classList.toggle('sucher-an', self.progress > 0.002);
        if (self.progress > 0.002) ladeFilm(film);
      },
      onToggle: (self) => { if (self.isActive) { ladeFilm(film); film.play().catch(() => {}); } else film.pause(); },
    },
  });
  tl.to(zustand, { p: 1, duration: 0.62, ease: 'power3.inOut', onUpdate: zeichne }, 0)
    .to(unten, { opacity: 0, y: -48, duration: 0.22 }, 0)
    .to(wort, { opacity: 0, duration: 0.005 }, 0.3) // harter Schnitt, wenn der Film kommt: keine grauen Buchstaben auf Gelb
    .to(film, { opacity: 1, duration: 0.3 }, 0.3)
    .to(sucher, { '--film': 1, duration: 0.25 }, 0.45)
    .fromTo(satz, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.66)
    .to({}, { duration: 0.14 });
  // Film vorladen, sobald jemand zu scrollen beginnt oder die Seite ruht.
  addEventListener('scroll', () => ladeFilm(film), { once: true, passive: true });

  // 3 · Überschriften steigen Wort für Wort aus der Maske.
  const worte = (el) => {
    const teile = [];
    const gehe = (knoten) => {
      for (const k of [...knoten.childNodes]) {
        if (k.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const t of k.textContent.split(/(\s+)/)) {
            if (!t) continue;
            if (/^\s+$/.test(t)) { frag.append(t); continue; }
            const aussen = document.createElement('span'); aussen.className = 'wm';
            const innen = document.createElement('span'); innen.textContent = t;
            aussen.append(innen); frag.append(aussen); teile.push(innen);
          }
          k.replaceWith(frag);
        } else if (k.nodeType === 1 && !k.classList.contains('vh') && !k.classList.contains('roll') && !k.classList.contains('fuss__a')) gehe(k);
      }
    };
    gehe(el);
    return teile;
  };
  document.querySelectorAll('.entwurf h2, .messung h2, .preis h2, .preis__form h3, .fuss__marke').forEach((h) => {
    const teile = worte(h);
    gsap.to(teile, { y: 0, duration: 1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });

  // Linien zeichnen sich, wenn ihr Abschnitt kommt.
  document.querySelectorAll('.antwort, .werte, .preis__liste').forEach((el) => {
    gsap.to(el, { '--zug': 1, duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });

  // Texte steigen auf.
  document.querySelectorAll('.entwurf__text > :not(h2), .messung__in > :not(h2), .preis__angebot > :not(h2), .preis__form').forEach((el) => el.classList.add('zeige'));
  ScrollTrigger.batch('.zeige', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });

  // Handy: liegt schräg im Raum, richtet sich beim Scrollen auf und dreht weiter; die Beispielseite scrollt im Bildschirm.
  const koerper = document.querySelector('.handy__koerper');
  const szene = document.querySelector('.handy__szene');
  const bild = document.querySelector('.handy__bild');
  const schirm = document.querySelector('.handy__schirm');
  if (koerper) {
    const lage = { rx: 30, ry: -42, rz: 12, t: 180 };
    const setze = () => {
      koerper.style.setProperty('--rx', lage.rx.toFixed(2));
      koerper.style.setProperty('--ry', lage.ry.toFixed(2));
      koerper.style.setProperty('--rz', lage.rz.toFixed(2));
      koerper.style.setProperty('--t', lage.t.toFixed(1) + 'px');
      // Glanz und Schatten folgen dem Winkel
      const dreh = lage.ry + (parseFloat(koerper.style.getPropertyValue('--mx')) || 0);
      koerper.style.setProperty('--g', (50 - dreh * 2.2).toFixed(1));
      szene.style.setProperty('--sx', (-dreh * 1.4).toFixed(1));
      szene.style.setProperty('--ss', (1 - Math.abs(lage.rx) / 90).toFixed(3));
    };
    setze();
    gsap.to(koerper, { '--f': '-12px', duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }); // schwebt leicht, wie in der Hand
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.entwurf', start: 'top bottom', end: 'bottom top', scrub: WEICH } })
      .to(lage, { rx: 10, ry: -24, rz: 2, t: 0, duration: 0.45, ease: 'power2.out', onUpdate: setze })
      .to(lage, { rx: 4, ry: -8, rz: 0, t: -20, duration: 0.2, onUpdate: setze })
      .to(lage, { rx: -8, ry: 22, rz: -3, t: -80, duration: 0.35, onUpdate: setze });
    if (bild && schirm) {
      const seite = bild.parentElement;
      const weg = () => Math.max(0, bild.offsetHeight - seite.clientHeight);
      gsap.to(bild, { y: () => -weg(), ease: 'power1.inOut', scrollTrigger: { trigger: '.entwurf', start: 'top 25%', end: 'bottom 15%', scrub: WEICH, invalidateOnRefresh: true } });
      bild.complete || bild.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    }
    // Mit der Maus: das Handy folgt leicht dem Zeiger.
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const mx = gsap.quickTo(koerper, '--mx', { duration: 0.8, ease: 'power3.out', onUpdate: setze });
      const my = gsap.quickTo(koerper, '--my', { duration: 0.8, ease: 'power3.out' });
      const ent = document.querySelector('.entwurf');
      ent.addEventListener('pointermove', (e) => {
        const r = szene.getBoundingClientRect();
        mx(((e.clientX - (r.left + r.width / 2)) / innerWidth) * 24);
        my(((r.top + r.height / 2 - e.clientY) / innerHeight) * 16);
      });
      ent.addEventListener('pointerleave', () => { mx(0); my(0); });
    }
  }

  // Preisliste: Häkchen der Reihe nach.
  const punkte = document.querySelectorAll('.preis__liste li');
  ScrollTrigger.create({ trigger: '.preis__liste', start: 'top 80%', once: true, onEnter: () => punkte.forEach((li, i) => setTimeout(() => li.classList.add('ist-an'), 250 + i * 180)) });

  // Preis rollt wie ein Zählwerk auf seinen Wert.
  const roll = document.querySelector('.roll');
  if (roll) {
    const text = roll.textContent;
    roll.textContent = '';
    const saeulen = [];
    for (const z of text) {
      if (!/\d/.test(z)) { roll.append(z); continue; }
      const s = document.createElement('span'); s.className = 'roll__s';
      const band = document.createElement('span');
      const ziel = Number(z);
      for (let i = 0; i <= 10 + ziel; i++) { const d = document.createElement('span'); d.textContent = String(i % 10); band.append(d); }
      s.append(band); roll.append(s); saeulen.push(band);
    }
    gsap.set(saeulen, { yPercent: 0 });
    saeulen.forEach((band, i) => {
      const n = band.children.length;
      gsap.to(band, { yPercent: -100 * (n - 1) / n, duration: 1.6 + i * 0.25, ease: 'expo.out', scrollTrigger: { trigger: roll, start: 'top 85%', once: true } });
    });
  }

  // Fuss: das gelbe A dreht sich ein.
  gsap.fromTo('.fuss__a', { '--dreh': '-90deg', '--gross': 0.2 }, { '--dreh': '0deg', '--gross': 1, duration: 1.1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.fuss', start: 'top 85%', once: true } });

  // 4 · Messwerte zählen hoch, einmal, wenn sie sichtbar werden.
  document.querySelectorAll('.wert__zahl[data-wert]').forEach((el) => {
    const ziel = parseFloat(el.dataset.wert);
    if (Number.isNaN(ziel)) return;
    const stellen = (el.dataset.wert.split('.')[1] || '').length;
    const zahl = { v: 0 };
    const zeige = () => { el.textContent = zahl.v.toFixed(stellen).replace('.', de ? ',' : '.'); };
    zeige();
    gsap.to(zahl, { v: ziel, duration: 1.4, ease: 'power2.out', onUpdate: zeige, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
})();
