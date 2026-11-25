(() => {
  /* Anti-clickjacking: se alguém tentar exibir o site dentro de um iframe de outro domínio, sai do quadro */
  if (window.top !== window.self) {
    let same = false;
    try { same = window.top.location.origin === window.location.origin; } catch (e) {}
    if (!same) {
      try { window.top.location.replace(window.location.href); }
      catch (e) { document.documentElement.style.display = 'none'; }
    }
  }

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* Fotos de clientes: sem arrastar / menu de "salvar imagem" (inibe cópia casual) */
  $$('img').forEach(img => { img.draggable = false; });
  document.addEventListener('contextmenu', e => { if (e.target.tagName === 'IMG') e.preventDefault(); });

  /* Títulos: quebra em palavras para o efeito de máscara */
  $$('.split').forEach(h => {
    const walk = (node, out) => {
      node.childNodes.forEach(n => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { out.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = part; w.appendChild(s);
            out.appendChild(w);
          });
        } else {
          const clone = n.cloneNode(false); walk(n, clone); out.appendChild(clone);
        }
      });
    };
    const frag = document.createDocumentFragment(); walk(h, frag);
    h.textContent = ''; h.appendChild(frag);
    $$('.w > span', h).forEach((s, i) => s.style.setProperty('--i', i));
    h.removeAttribute('data-reveal'); h.dataset.split = '';
  });

  /* Hero entra no load; o resto ao chegar na tela */
  const revealables = [];
  $$('[data-reveal], .split').forEach(el => {
    if (el.closest('.hero')) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    else revealables.push(el);
  });

  /* Elementos ligados ao scroll */
  const heroBg = $('.hero-bg'), heroImg = $('.hero-bg img'), heroVeil = $('.hero-veil'), heroText = $('.hero-text'), cue = $('.scroll-cue');
  const svc = $('.svc'), track = $('.svc-track'), slides = $$('.slide:not([hidden])'); // "hidden" = serviço oculto
  const figs = slides.map(s => $('figure', s)), imgs = slides.map(s => $('figure img', s)), infos = slides.map(s => $('.info', s));
  const dirs = slides.map(s => +getComputedStyle(s).getPropertyValue('--dir') || 1);
  const barFill = $('.svc-bar i'), cur = $('.cur'), mobileName = $('.mobile-name'), dots = $$('.dots button:not([hidden])');
  const names = slides.map(s => s.dataset.nome);
  svc.style.setProperty('--n', slides.length);
  svc.classList.toggle('solo', slides.length < 2);
  $('.tot').textContent = String(slides.length).padStart(2, '0');
  slides.forEach((s, i) => { $('.num', s).textContent = slides.length < 2 ? '' : String(i + 1).padStart(2, '0'); });
  mobileName.textContent = names[0];
  dots.forEach((d, i) => d.classList.toggle('on', i === 0));
  const aboutImg = $('.about-photo img'), about = $('.about-photo'), studio = $('.studio-card'), studioImg = $('.studio-card img');
  const cta = $('.cta'), fab = $('.fab'), progress = $('.progress i');

  /* Medidas guardadas: o loop de scroll só lê a posição, nunca o layout */
  let M = {}, pending = [];
  const absTop = el => el.getBoundingClientRect().top + scrollY;
  function measure() {
    M = {
      vh: innerHeight,
      docH: document.documentElement.scrollHeight - innerHeight,
      svcTop: absTop(svc), svcTotal: svc.offsetHeight - innerHeight,
      aboutTop: absTop(about), aboutH: about.offsetHeight,
      studioTop: absTop(studio),
      ctaTop: absTop(cta),
    };
    pending = revealables.filter(el => !el.classList.contains('in')).map(el => ({ el, top: absTop(el) }));
  }

  // progresso horizontal com "pausa" em cada imagem
  const stepped = p => {
    if (slides.length < 2) return 0;
    const n = slides.length - 1, raw = p * n, i = Math.min(Math.floor(raw), n - 1), f = raw - i;
    return i + ease(clamp((f - .18) / .64));
  };

  let active = 0, fabOn = null, lastY = -1;
  function setActive(idx) {
    if (idx === active) return;
    active = idx;
    cur.textContent = String(idx + 1).padStart(2, '0');
    mobileName.classList.remove('swap'); void mobileName.offsetWidth;
    mobileName.textContent = names[idx]; mobileName.classList.add('swap');
    dots.forEach((d, i) => { d.classList.toggle('on', i === idx); d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
  }

  function frame(y) {
    if (y === lastY) return; lastY = y;
    const vh = M.vh;

    // barra de leitura no topo
    if (progress) progress.style.transform = `scaleX(${clamp(y / (M.docH || 1))})`;

    // reveal
    if (pending.length) {
      const limit = y + vh * .98;
      pending = pending.filter(o => (o.top < limit ? (o.el.classList.add('in'), false) : true));
    }

    if (!reduce) {
      // hero: a foto desce mais devagar que a página (parallax), aproxima,
      // e vai se recolhendo num quadro arredondado enquanto o texto sobe
      if (y < vh * 1.4) {
        const hp = clamp(y / (vh * .95)), e = ease(hp);
        heroBg.style.transform = `translate3d(0,${hp * 38}%,0)`;
        heroBg.style.clipPath = `inset(${e * 5}% ${e * 6}% 0% ${e * 6}% round ${e * 36}px)`;
        heroImg.style.transform = `scale(${1.1 + hp * .12})`;
        heroVeil.style.opacity = e * .55;
        heroText.style.transform = `translate3d(0,${hp * -70}px,0)`;
        heroText.style.opacity = 1 - hp * 1.25;
        cue.style.opacity = 1 - hp * 3;
      }

      // serviços (vertical -> horizontal)
      const p = M.svcTotal > 0 ? clamp((y - M.svcTop) / M.svcTotal) : 0;
      if (y > M.svcTop - vh && y < M.svcTop + M.svcTotal + vh) {
        const x = stepped(p);
        track.style.transform = `translate3d(${-x * 100 / slides.length}%,0,0)`;
        barFill.style.transform = `scaleX(${p})`;
        for (let i = 0; i < slides.length; i++) {
          const d = Math.min(Math.abs(x - i), 1);
          figs[i].style.transform = `scale(${1 - d * .14}) rotate(${dirs[i] * d * 3}deg)`;
          figs[i].style.opacity = 1 - d * .7;
          imgs[i].style.transform = `scale(${1 + d * .12})`;
          infos[i].style.transform = `translate3d(${d * 40}px,0,0)`;
          infos[i].style.opacity = 1 - d * 1.6;
        }
        setActive(Math.round(x));
      }

      // sobre (parallax)
      const ap = clamp((y + vh - M.aboutTop) / (vh + M.aboutH));
      aboutImg.style.transform = `translate3d(0,${ap * -16}%,0)`;

      // studio (abre ao entrar)
      const sp = clamp((y + vh - M.studioTop) / (vh * .75));
      studio.style.transform = `scale(${.86 + sp * .14})`;
      studioImg.style.transform = `scale(${1.25 - sp * .25})`;
    }

    const inSvc = y + vh * .5 > M.svcTop && y + vh * .5 < M.svcTop + M.svcTotal + vh;
    const on = y > vh * .8 && !inSvc && M.ctaTop - y > vh * .7;
    if (on !== fabOn) { fabOn = on; fab.classList.toggle('show', on); }
  }

  /* Scroll suave (Lenis, servido do próprio site) com fallback para o scroll nativo */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: .14, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ({ scroll }) => frame(scroll));
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  } else {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { frame(scrollY); ticking = false; });
    }, { passive: true });
  }

  const refresh = () => { measure(); lastY = -1; frame(lenis ? lenis.scroll : scrollY); };
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(refresh, 120); });
  addEventListener('load', refresh);
  if (document.fonts) document.fonts.ready.then(refresh);
  refresh();

  const goTo = top => lenis ? lenis.scrollTo(top, { duration: .9 }) : scrollTo({ top, behavior: 'smooth' });
  const goSlide = i => slides.length > 1 && goTo(M.svcTop + M.svcTotal * (clamp(i, 0, slides.length - 1) / (slides.length - 1)));

  /* Âncoras internas também com scroll suave */
  $$('a[href^="#"]:not([data-open-catalogo])').forEach(a => a.addEventListener('click', e => {
    const t = $(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); goTo(absTop(t));
  }));

  /* ---------- Catálogo (pop-up) ---------- */
  const cat = $('#catalogo');
  if (cat && typeof cat.showModal === 'function') {
    const sheet = $('.sheet', cat), grab = $('.sheet-grab', cat), body = $('.sheet-body', cat);
    let opener = null, closing = 0;

    // cada "Agendar" manda o nome do serviço na mensagem
    $$('.cat-go', cat).forEach(a => {
      a.href = 'https://wa.me/5511911078055?text=' + encodeURIComponent(`Olá Joyce! Vi o catálogo e quero agendar ${a.dataset.servico}.`);
    });

    const lock = on => {
      if (lenis) on ? lenis.stop() : lenis.start();
      document.documentElement.style.overflow = on ? 'hidden' : '';
    };
    const open = e => {
      if (e) e.preventDefault();
      if (cat.open) return;
      clearTimeout(closing);
      opener = document.activeElement;
      sheet.style.transform = '';
      body.scrollTop = 0;
      cat.showModal(); lock(true);
      requestAnimationFrame(() => requestAnimationFrame(() => cat.classList.add('open')));
      if (location.hash !== '#catalogo') history.pushState({ cat: 1 }, '', '#catalogo');
    };
    const finish = () => { if (cat.open) cat.close(); lock(false); if (opener) opener.focus({ preventScroll: true }); };
    const close = (fromHistory) => {
      if (!cat.open || !cat.classList.contains('open')) return;
      cat.classList.remove('open');
      sheet.style.transform = '';
      closing = setTimeout(finish, reduce ? 0 : 480);
      // botão "voltar" do celular fecha o catálogo em vez de sair da página
      if (!fromHistory && history.state && history.state.cat) history.back();
    };

    $$('[data-open-catalogo]').forEach(a => a.addEventListener('click', open));

    // fotos do catálogo carregam com o navegador ocioso, para o pop-up abrir já pronto
    const warm = () => $$('.cat-item:not([hidden]) img', cat).forEach(i => { i.loading = 'eager'; });
    ('requestIdleCallback' in window) ? requestIdleCallback(warm, { timeout: 3000 }) : setTimeout(warm, 2000);
    $$('[data-close-catalogo]', cat).forEach(b => b.addEventListener('click', () => close()));
    cat.addEventListener('cancel', e => { e.preventDefault(); close(); }); // tecla Esc
    addEventListener('popstate', () => { if (cat.open) close(true); });
    if (location.hash === '#catalogo') history.replaceState(null, '', location.pathname + location.search);

    // celular: arrastar a gaveta para baixo fecha
    let y0 = 0, dy = 0, t0 = 0, drag = false;
    grab.addEventListener('pointerdown', e => {
      if (e.target.closest('button') || innerWidth >= 880) return;
      drag = true; y0 = e.clientY; dy = 0; t0 = performance.now();
      sheet.classList.add('dragging');
      try { grab.setPointerCapture(e.pointerId); } catch (err) {}
    });
    grab.addEventListener('pointermove', e => {
      if (!drag) return;
      dy = Math.max(0, e.clientY - y0);
      sheet.style.transform = `translateY(${dy}px)`;
    });
    const release = () => {
      if (!drag) return; drag = false;
      sheet.classList.remove('dragging');
      const fast = dy / Math.max(1, performance.now() - t0) > .6;
      if (dy > 110 || (fast && dy > 30)) close();
      else sheet.style.transform = '';
    };
    grab.addEventListener('pointerup', release);
    grab.addEventListener('pointercancel', release);
  }

  /* Botões de navegação dos serviços */
  dots.forEach((d, i) => d.addEventListener('click', () => goSlide(i)));

  /* Celular: deslizar o dedo para o lado troca de serviço */
  if (track && !reduce) {
    let sx = 0, sy = 0, st = 0, on = false;
    track.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') return; on = true; sx = e.clientX; sy = e.clientY; st = performance.now(); });
    track.addEventListener('pointerup', e => {
      if (!on) return; on = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4 && performance.now() - st < 700) goSlide(active + (dx < 0 ? 1 : -1));
    });
    track.addEventListener('pointercancel', () => { on = false; });
  }

  /* Antes e depois: arrastar (mouse/toque), clicar ou usar as setas */
  const ba = $('.ba-slider');
  if (ba) {
    const tagL = $('.ba-tag--l', ba), tagR = $('.ba-tag--r', ba);
    let pos = 50, dragging = false, touched = false, startX = 0, startY = 0, intro = 0;
    const setPos = v => {
      pos = clamp(v, 0, 100);
      ba.style.setProperty('--pos', pos + '%');
      ba.setAttribute('aria-valuenow', Math.round(pos));
      ba.setAttribute('aria-valuetext', Math.round(pos) + '% antes');
      tagL.style.opacity = pos < 22 ? 0 : 1;
      tagR.style.opacity = pos > 78 ? 0 : 1;
    };
    const fromX = x => { const r = ba.getBoundingClientRect(); return (x - r.left) / r.width * 100; };
    const stopIntro = () => { touched = true; cancelAnimationFrame(intro); };

    ba.addEventListener('pointerdown', e => {
      stopIntro();
      startX = e.clientX; startY = e.clientY;
      // no mouse move na hora; no toque espera o gesto ser horizontal (deixa a rolagem vertical livre)
      if (e.pointerType === 'mouse') { dragging = true; ba.setPointerCapture(e.pointerId); ba.classList.add('drag'); setPos(fromX(e.clientX)); }
      else dragging = 'maybe';
    });
    ba.addEventListener('pointermove', e => {
      if (dragging === 'maybe') {
        const dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx > 6 && dx > dy) { dragging = true; ba.setPointerCapture(e.pointerId); ba.classList.add('drag'); }
        else if (dy > 8) { dragging = false; }
      }
      if (dragging === true) setPos(fromX(e.clientX));
    });
    const end = e => {
      if (dragging === 'maybe' && e.type === 'pointerup') setPos(fromX(e.clientX)); // toque rápido = posiciona
      dragging = false; ba.classList.remove('drag');
    };
    ba.addEventListener('pointerup', end);
    ba.addEventListener('pointercancel', end);
    ba.addEventListener('keydown', e => {
      const step = e.shiftKey ? 20 : 5;
      const map = { ArrowLeft: pos - step, ArrowDown: pos - step, ArrowRight: pos + step, ArrowUp: pos + step, Home: 0, End: 100 };
      if (e.key in map) { e.preventDefault(); stopIntro(); setPos(map[e.key]); }
    });
    setPos(50);

    // dica de movimento: a linha "varre" a foto uma vez quando ela aparece
    if (!reduce && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting || touched) return;
        io.disconnect();
        const keys = [50, 80, 22, 50], dur = 2200, t0 = performance.now() + 500;
        const run = now => {
          if (touched) return;
          const t = clamp((now - t0) / dur), seg = Math.min(Math.floor(t * 3), 2), f = ease(t * 3 - seg);
          setPos(keys[seg] + (keys[seg + 1] - keys[seg]) * f);
          if (t < 1) intro = requestAnimationFrame(run);
        };
        intro = requestAnimationFrame(run);
      }, { threshold: .6 });
      io.observe(ba);
    }
  }
})();
