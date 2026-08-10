(function () {
  'use strict';

  const reduced     = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTOPLAY_MS = 5000;
  const TILT_MAX    = 7;

  let current     = 0;
  let isAnimating = false;
  let autoTimer   = null;
  let isPaused    = false;

  /* Referencia al timer del failcode para limpiarlo si cambia la card */
  let failcodeTimer = null;

  const cards      = document.querySelectorAll('.cc-card-wrap');
  const dots       = document.querySelectorAll('.cc-dot');
  const total      = cards.length;
  const stage      = document.querySelector('.cc-stage');

  /* Leer datos desde data-attributes del HTML — fuente única de verdad */
  function getCardData(index) {
    const wrap = cards[index];
    if (!wrap) return { category: '', version: '', status: '' };
    return {
      category: wrap.dataset.category || '',
      version:  wrap.dataset.version  || '',
      status:   wrap.dataset.status   || ''
    };
  }

  const latLeftTop  = document.querySelector('.cc-lat-left-top');
  const latRightTop = document.querySelector('.cc-lat-right-top');
  const latRightBot = document.querySelector('.cc-lat-right-bot');

  /* ═══ SCROLL REVEAL ═══ */
  function initReveal() {
    const blocks = document.querySelectorAll('.section--reveal');
    if (!blocks.length) return;
    if (reduced) { blocks.forEach(el => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver(
      entries => entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }),
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    blocks.forEach(el => io.observe(el));
  }

  /* ═══ HERO PARALLAX ═══ */
  function initHeroParallax() {
    const hero = document.querySelector('[data-hero-motion]');
    if (!hero || reduced) return;
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      hero.style.setProperty('--hx', (x * 28).toFixed(1) + 'px');
      hero.style.setProperty('--hy', (y * 22).toFixed(1) + 'px');
    });
    hero.addEventListener('mouseleave', () => {
      hero.style.setProperty('--hx', '0px');
      hero.style.setProperty('--hy', '0px');
    });
  }

  /* ═══ TILT 3D ═══ */
  function initTilt() {
    if (reduced) return;
    let rafId = null;
    cards.forEach(wrap => {
      wrap.addEventListener('mousemove', e => {
        if (!wrap.classList.contains('active')) return;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const r  = wrap.getBoundingClientRect();
          const rx = -((e.clientY - r.top)  / r.height - 0.5) * TILT_MAX;
          const ry =  ((e.clientX - r.left) / r.width  - 0.5) * TILT_MAX;
          const card = wrap.querySelector('.cc-card');
          if (card) {
            card.style.transition = 'transform 0.1s ease';
            card.style.transform  = `rotateX(${rx}deg) rotateY(${ry}deg)`;
          }
        });
      });
      wrap.addEventListener('mouseleave', () => {
        cancelAnimationFrame(rafId);
        const card = wrap.querySelector('.cc-card');
        if (card) {
          card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease';
          card.style.transform  = 'rotateX(0) rotateY(0)';
          setTimeout(() => { if (card) card.style.transition = 'box-shadow 0.4s ease'; }, 500);
        }
      });
    });
  }

  /* ═══ ANIMACIÓN DE TEXTO ═══ */
  function animateCardText(wrap) {
    if (typeof gsap === 'undefined' || reduced) return;

    const titleMain   = wrap.querySelector('.cc-title-main');
    const titleShades = wrap.querySelectorAll('.cc-title-shadow');
    const subtitle    = wrap.querySelector('.cc-subtitle');
    const badge       = wrap.querySelector('.cc-badge');
    const desc        = wrap.querySelector('.cc-desc');
    const bigNum      = wrap.querySelector('.cc-big-number');
    const btn         = wrap.querySelector('.cc-card-btn');
    const countTitle  = wrap.querySelector('.cc-counting-title');
    const failcode    = wrap.querySelector('.cc-failcode');

    if (titleMain) {
      gsap.fromTo(titleMain,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
    if (titleShades.length) {
      gsap.fromTo(titleShades,
        { opacity: 0 },
        { opacity: 0.25, duration: 0.4, stagger: 0.08, delay: 0.12, ease: 'power1.out' }
      );
    }

    /* Failcode typewriter — limpiar timer previo */
    if (failcode) {
      if (failcodeTimer) clearInterval(failcodeTimer);
      const original = failcode.textContent;
      failcode.textContent = '';
      let i = 0;
      failcodeTimer = setInterval(() => {
        failcode.textContent = original.slice(0, ++i);
        if (i >= original.length) {
          clearInterval(failcodeTimer);
          failcodeTimer = null;
        }
      }, 22);
    }

    gsap.fromTo(
      [badge, subtitle, desc, btn].filter(Boolean),
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, delay: 0.18, ease: 'power2.out' }
    );
    if (countTitle) {
      gsap.fromTo(countTitle,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, delay: 0.3, ease: 'power1.out' }
      );
    }
    if (bigNum) {
      gsap.fromTo(bigNum,
        { opacity: 0, scale: 0.6, filter: 'blur(10px)' },
        { opacity: 0.9, scale: 1, filter: 'blur(0px)', duration: 0.7, delay: 0.1, ease: 'back.out(1.6)' }
      );
    }
  }

  /* ═══ SVG BORDER PATHS ═══ */
  function setupBorderPaths() {
    cards.forEach(wrap => {
      wrap.querySelectorAll('.cc-border-path').forEach(p => {
        try {
          const len = p.getTotalLength();
          p.style.strokeDasharray  = len;
          p.style.strokeDashoffset = len;
        } catch (e) {}
      });
      wrap.querySelectorAll('.cc-border-anim').forEach(p => {
        try {
          const len = p.getTotalLength();
          const seg = len * 0.2;
          p.style.strokeDasharray  = seg + ' ' + (len - seg);
          p.style.strokeDashoffset = '0';
        } catch (e) {}
      });
      wrap.querySelectorAll('.cc-border-trail').forEach(p => {
        try {
          const len = p.getTotalLength();
          const seg = len * 0.35;
          p.style.strokeDasharray  = seg + ' ' + (len - seg);
          p.style.strokeDashoffset = '0';
        } catch (e) {}
      });
    });
  }

  /* ═══ CAROUSEL ═══ */
  function goTo(idx, dir) {
    if (isAnimating && dir !== 'none') return;
    if (idx === current && dir !== 'none') return;
    isAnimating = true;

    const prev = current;
    current = ((idx % total) + total) % total;

    cards.forEach((c, i) => {
      c.classList.remove('active', 'exit-left', 'exit-right');
      if (i === current) {
        c.classList.add('active');
        resetBorderAnim(c);
        requestAnimationFrame(() => animateCardText(c));
      } else if (i === prev && dir !== 'none') {
        c.classList.add(dir === 'right' ? 'exit-left' : 'exit-right');
      }
    });

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });

    const data = getCardData(current);
    if (latLeftTop)  latLeftTop.textContent  = data.category;
    if (latRightTop) latRightTop.textContent = data.version;
    if (latRightBot) latRightBot.textContent = isPaused ? 'PAUSED' : data.status;

    announceSlide(current + 1, total);
    setTimeout(() => { isAnimating = false; }, 850);
  }

  function resetBorderAnim(wrap) {
    wrap.querySelectorAll('.cc-border-anim, .cc-border-trail').forEach(p => {
      p.style.animationPlayState = 'paused';
      void p.offsetHeight;
      p.style.animationPlayState = 'running';
    });
  }

  const nextCard = () => goTo(current + 1, 'right');
  const prevCard = () => goTo(current - 1, 'left');

  /* ═══ LIVE REGION ACCESIBILIDAD ═══ */
  function announceSlide(n, tot) {
    let live = document.querySelector('.cc-live-region');
    if (!live) {
      live = document.createElement('span');
      live.className = 'cc-live-region';
      live.setAttribute('aria-live', 'polite');
      live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
      document.body.appendChild(live);
    }
    live.textContent = `Card ${n} de ${tot}`;
  }

  /* ═══ AUTOPLAY ═══ */
  function startAutoplay() {
    clearInterval(autoTimer);
    if (!isPaused && !reduced) autoTimer = setInterval(nextCard, AUTOPLAY_MS);
  }
  function pauseAutoplay() {
    isPaused = true;
    clearInterval(autoTimer);
    if (latRightBot) latRightBot.textContent = 'PAUSED';
  }
  function resumeAutoplay() {
    isPaused = false;
    const data = getCardData(current);
    if (latRightBot) latRightBot.textContent = data.status;
    startAutoplay();
  }

  /* ═══ EVENTOS ═══ */
  function bindEvents() {
    /* Dots */
    dots.forEach((d, i) => {
      d.addEventListener('click', () => { goTo(i, i > current ? 'right' : 'left'); startAutoplay(); });
    });

    /* Cursor zones */
    const zL = document.querySelector('.cc-cursor-zone.left');
    const zR = document.querySelector('.cc-cursor-zone.right');
    if (zL) zL.addEventListener('click', () => { prevCard(); startAutoplay(); });
    if (zR) zR.addEventListener('click', () => { nextCard(); startAutoplay(); });

    /* Play/Pause */
    const playBtn  = document.getElementById('ccPlayBtn');
    const pauseBtn = document.getElementById('ccPauseBtn');
    if (playBtn) playBtn.addEventListener('click', () => {
      resumeAutoplay();
      playBtn.classList.add('active');
      if (pauseBtn) pauseBtn.classList.remove('active');
    });
    if (pauseBtn) pauseBtn.addEventListener('click', () => {
      pauseAutoplay();
      pauseBtn.classList.add('active');
      if (playBtn) playBtn.classList.remove('active');
    });

    /* Pausa en hover */
    cards.forEach(w => {
      w.addEventListener('mouseenter', pauseAutoplay);
      w.addEventListener('mouseleave', resumeAutoplay);
    });

/* Pointer capture — drag/swipe unificado
       FIX: capturamos el puntero SOLO cuando hay arrastre real (>8px).
       Capturar en pointerdown redirigía todos los clics al stage y
       mataba los enlaces (ACCEDER), las flechas y el play/pause. */
    if (stage) {
      let swipeData = { active: false, startX: 0, pid: null, dragging: false };

      stage.addEventListener('pointerdown', e => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        swipeData = { active: true, startX: e.clientX, pid: e.pointerId, dragging: false };
      });

      stage.addEventListener('pointermove', e => {
        if (!swipeData.active || e.pointerId !== swipeData.pid) return;
        if (!swipeData.dragging && Math.abs(e.clientX - swipeData.startX) > 8) {
          swipeData.dragging = true;
          try { stage.setPointerCapture(e.pointerId); } catch (err) {}
          stage.style.cursor = 'grabbing';
        }
      });

      stage.addEventListener('pointerup', e => {
        if (!swipeData.active || e.pointerId !== swipeData.pid) return;
        const wasDragging = swipeData.dragging;
        swipeData.active = false;
        swipeData.dragging = false;
        stage.style.cursor = '';
        if (!wasDragging) return;
        const dx = e.clientX - swipeData.startX;
        if (Math.abs(dx) < 40) return;
        dx < 0 ? nextCard() : prevCard();
        startAutoplay();
      });

      stage.addEventListener('pointercancel', () => {
        swipeData.active = false;
        swipeData.dragging = false;
        stage.style.cursor = '';
      });

      /* Touch fallback */
      let tx = 0;
      stage.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) > 44) { dx < 0 ? nextCard() : prevCard(); startAutoplay(); }
      }, { passive: true });
    }

    /* Teclado — solo cuando el stage tiene foco */
    document.addEventListener('keydown', e => {
      if (!stage?.matches(':focus, :focus-within')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); nextCard(); startAutoplay(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prevCard(); startAutoplay(); }
      if (e.key === 'Home')       { e.preventDefault(); goTo(0, 'left'); startAutoplay(); }
      if (e.key === 'End')        { e.preventDefault(); goTo(total - 1, 'right'); startAutoplay(); }
    });

    /* Focus visible */
    if (stage) {
      stage.addEventListener('focus', () => {
        stage.style.outline       = '2px solid rgba(0,212,200,0.6)';
        stage.style.outlineOffset = '4px';
      });
      stage.addEventListener('blur', () => {
        stage.style.outline       = '';
        stage.style.outlineOffset = '';
      });
    }

    /* ResizeObserver — relayout sin flash visual */
    if (typeof ResizeObserver !== 'undefined' && stage) {
      const ro = new ResizeObserver(() => {
        goTo(current, 'none');
      });
      ro.observe(stage);
    }
  }

  /* ═══ INIT ═══ */
  function init() {
    setupBorderPaths();
    goTo(0, 'none');
    startAutoplay();
    bindEvents();
    initTilt();
    initReveal();
    initHeroParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();