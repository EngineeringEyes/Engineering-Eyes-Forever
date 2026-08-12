(function () {
  'use strict';

  /* ═══════════════════════════════════════
     CURSOR
  ═══════════════════════════════════════ */
  const ring = document.getElementById('cring');
  const dot  = document.getElementById('cdot');

  if (ring && dot) {
    document.addEventListener('mousemove', e => {
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
      dot.style.left  = e.clientX + 'px';
      dot.style.top   = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .sw-cat, .sw-ver-card, .curso-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width   = '48px';
        ring.style.height  = '48px';
        ring.style.opacity = '0.5';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width      = '28px';
        ring.style.height     = '28px';
        ring.style.opacity    = '1';
        ring.style.borderColor = 'var(--teal)';
      });
    });
  }

  /* ═══════════════════════════════════════
     HERO SLIDER
  ═══════════════════════════════════════ */
  let currentSlide = 0;
  const totalSlides = 4;
  let autoTimer = null;

  /* Aplicar background-image desde data-bg al cargar */
document.querySelectorAll('.slide-bg[data-bg]').forEach(el => {
  el.style.backgroundImage = 'url(' + el.dataset.bg + ')';
  if (el.dataset.filter) el.style.filter = el.dataset.filter;
});

  function goSlide(n) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.sdot');
    slides[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.setAttribute('aria-selected', 'false');
    currentSlide = ((n % totalSlides) + totalSlides) % totalSlides;
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
    dots[currentSlide]?.setAttribute('aria-selected', 'true');
    const snum = document.getElementById('snum');
    if (snum) snum.textContent = String(currentSlide + 1).padStart(2, '0');
    resetAuto();
  }

  function nextSlide() { goSlide(currentSlide + 1); }
  function prevSlide() { goSlide(currentSlide - 1); }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 6000);
  }
  resetAuto();

  /* Botones slider — eventos en lugar de onclick inline */
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  /* Dots */
  document.querySelectorAll('.sdot').forEach((dot, i) => {
    dot.addEventListener('click', () => goSlide(i));
  });

  /* Version chips — eventos delegados en lugar de onclick inline */
  document.querySelector('.hero')?.addEventListener('click', e => {
    const chip = e.target.closest('.vchip[data-slide]');
    if (chip) goSlide(parseInt(chip.dataset.slide));
  });

  /* Swipe táctil */
  let touchX = 0;
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    heroEl.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide();
    }, { passive: true });
  }

/* ═══════════════════════════════════════
     SOFTWARE CATALOG — estilo lista UGS
     Agregar programa = un bloque nuevo en data/catalogo.js.
     lista.soon:true = "Próximamente" (sin url).
  ═══════════════════════════════════════ */
  /* Los datos viven en data/catalogo.js (fuente única de verdad).
     Cada programa aporta su bloque `lista` con lo que se ve aquí. */
  const SW_DATA = (window.EE_CATALOGO || []).map(c =>
    Object.assign({ key: c.llave, name: c.nombre }, c.lista || {})
  );
  if (!SW_DATA.length) {
    console.error('[EE] data/catalogo.js no se cargó: el catálogo de software quedó vacío.');
  }

  (function initSoftwareCatalog(){
    const listEl   = document.getElementById('swList');
    const countEl  = document.getElementById('swCount');
    const search   = document.getElementById('swSearch');
    const sideNav  = document.getElementById('swSidebarNav');
    const btnList  = document.getElementById('swViewList');
    const btnGrid  = document.getElementById('swViewGrid');
    const lblAvail = document.getElementById('swFilterAvail');
    const lblSoon  = document.getElementById('swFilterSoon');
    const lblAZ    = document.getElementById('swSortAZ');
    const lblRec   = document.getElementById('swSortRecent');
    if (!listEl) return;

    let active    = 'Todos';
    let viewMode  = 'grid';
    let showAvail = true;
    let showSoon  = false;
    let sortMode  = 'az';   /* 'az' | 'recent' */

    const esc  = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const slug = s => String(s).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

    /* ── Conteos por categoría ── */
    const catCounts = {};
    SW_DATA.forEach(d => { catCounts[d.cat] = (catCounts[d.cat] || 0) + 1; });
    const totalCount = SW_DATA.length;

    /* ── Icono representativo por categoría (primer ítem de ese cat) ── */
    const catIcon = {};
    SW_DATA.forEach(d => { if (!catIcon[d.cat]) catIcon[d.cat] = d.icon; });

    /* ── Sidebar nav ── */
    const cats = ['Todos', ...new Set(SW_DATA.map(d => d.cat))];
    sideNav.innerHTML = cats.map(c => {
      const count = c === 'Todos' ? totalCount : (catCounts[c] || 0);
      const icon  = c === 'Todos' ? 'ti-stack' : (catIcon[c] || 'ti-box');
      return `<button class="sw-nav-item${c === 'Todos' ? ' active' : ''}" role="tab" data-cat="${esc(c)}" aria-selected="${c === 'Todos' ? 'true' : 'false'}">
        <span class="sw-nav-item-left"><i class="ti ${icon}" aria-hidden="true"></i>${esc(c)}</span>
        <span class="sw-nav-badge">${count}</span>
      </button>`;
    }).join('');

    sideNav.querySelectorAll('.sw-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        active = btn.dataset.cat;
        sideNav.querySelectorAll('.sw-nav-item').forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        render();
      });
    });

    /* ── Checks de estado ── */
    function toggleCheck(lbl, key) {
      const box = lbl.querySelector('.sw-check-box');
      if (key === 'avail') {
        showAvail = !showAvail;
        box.classList.toggle('sw-check-active', showAvail);
      } else {
        showSoon = !showSoon;
        box.classList.toggle('sw-check-active', showSoon);
      }
      render();
    }
    lblAvail && lblAvail.addEventListener('click', () => toggleCheck(lblAvail, 'avail'));
    lblSoon  && lblSoon.addEventListener('click',  () => toggleCheck(lblSoon,  'soon'));

    /* ── Checks de orden ── */
    function setSort(mode) {
      sortMode = mode;
      lblAZ  && lblAZ.querySelector('.sw-check-box').classList.toggle('sw-check-active', mode === 'az');
      lblRec && lblRec.querySelector('.sw-check-box').classList.toggle('sw-check-active', mode === 'recent');
      render();
    }
    lblAZ  && lblAZ.addEventListener('click',  () => setSort('az'));
    lblRec && lblRec.addEventListener('click', () => setSort('recent'));

    /* ── Toggle vista ── */
    function setView(mode) {
      viewMode = mode;
      btnList && btnList.classList.toggle('active', mode === 'list');
      btnGrid && btnGrid.classList.toggle('active', mode === 'grid');
      render();
    }
    btnList && btnList.addEventListener('click', () => setView('list'));
    btnGrid && btnGrid.addEventListener('click', () => setView('grid'));
    btnGrid && btnGrid.classList.add('active');
    btnList && btnList.classList.remove('active');

    /* ── Render ── */
    function render(){
      const q = (search.value || '').toLowerCase().trim();

      let list = SW_DATA
        .filter(d => active === 'Todos' || d.cat === active)
        .filter(d => d.name.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q))
        .filter(d => {
          if (!d.soon && showAvail) return true;
          if ( d.soon && showSoon)  return true;
          if (!d.soon && !showAvail) return false;
          if ( d.soon && !showSoon)  return false;
          return false;
        });

      if (sortMode === 'az') {
        list = list.sort((a,b) => a.name.localeCompare(b.name));
      } else {
        /* 'recent': los que no tienen soon van primero, luego A-Z */
        list = list.sort((a,b) => {
          if (a.soon !== b.soon) return a.soon ? 1 : -1;
          return b.name.localeCompare(a.name);
        });
      }

      const avail = list.filter(d => !d.soon).length;
      countEl.innerHTML = `MOSTRANDO <b>${list.length}</b> · DISPONIBLES <b>${avail}</b> · PRÓXIMAMENTE <b>${list.length - avail}</b>`;

      if (!list.length){
        listEl.innerHTML = `<div class="sw-empty">// SIN RESULTADOS</div>`;
        return;
      }

      viewMode === 'grid' ? renderGrid(list) : renderList(list);
    }

    /* ── VISTA GRID ── */
    function renderGrid(list){
      listEl.classList.add('grid-view');
      if (active !== 'Todos' || (search.value || '').trim()) {
        listEl.innerHTML = `<div class="sw-cards">${list.map(cardHTML).join('')}</div>`;
        return;
      }
      const groups = {};
      list.forEach(d => { (groups[d.cat] = groups[d.cat] || []).push(d); });
      listEl.innerHTML = Object.keys(groups).map(cat => {
        const items = groups[cat];
        return `<div class="sw-grid-group">
          <div class="sw-group-head-cat">
            <i class="ti ${items[0].icon}" aria-hidden="true"></i>
            ${esc(cat)}
            <span class="cat-count">${items.length} ITEM${items.length !== 1 ? 'S' : ''}</span>
          </div>
          <div class="sw-cards">${items.map(cardHTML).join('')}</div>
        </div>`;
      }).join('');
    }

    function cardHTML(d){
      const badge = d.soon
        ? `<span class="sw-card-badge soon"><i class="ti ti-clock" aria-hidden="true"></i> Próximo</span>`
        : `<span class="sw-card-badge available">Disponible</span>`;
      const inner = `
        <div class="sw-card-top">
          <i class="ti ${d.icon} sw-card-ico" aria-hidden="true"></i>${badge}
        </div>
        <div class="sw-card-name">${esc(d.name)}</div>
        <div class="sw-card-vers">${esc(d.versions || '')}</div>
        <i class="ti ti-arrow-up-right sw-card-arrow" aria-hidden="true"></i>`;
      return d.soon
        ? `<div class="sw-card soon" style="--ac:${d.ac||'var(--teal)'}">${inner}</div>`
        : `<a class="sw-card" style="--ac:${d.ac||'var(--teal)'}" href="${esc(d.url)}" data-sw="${esc(d.key || slug(d.name))}" data-name="${esc(d.name)}">${inner}</a>`;
    }

    /* ── VISTA LISTA A-Z ── */
    function renderList(list){
      listEl.classList.remove('grid-view');
      const groups = {};
      list.forEach(d => { const k = d.name.charAt(0).toUpperCase(); (groups[k]=groups[k]||[]).push(d); });
      listEl.innerHTML = Object.keys(groups).sort().map(letter => {
        const rows = groups[letter].map(d => {
          const inner = `
            <i class="ti ${d.icon} sw-row-ico" aria-hidden="true"></i>
            <span class="sw-row-name">${esc(d.name)}</span>
            ${d.soon
              ? `<span class="sw-row-soon"><i class="ti ti-clock" aria-hidden="true"></i> Próximamente</span>`
              : `<span class="sw-row-vers">${esc(d.versions||'')}</span>`}`;
          return d.soon
            ? `<div class="sw-row soon" style="--ac:${d.ac||'var(--teal)'}">${inner}</div>`
            : `<a class="sw-row" style="--ac:${d.ac||'var(--teal)'}" href="${esc(d.url)}" data-sw="${esc(d.key || slug(d.name))}" data-name="${esc(d.name)}">${inner}</a>`;
        }).join('');
        return `<div class="sw-group-head">${letter}</div>${rows}`;
      }).join('');
    }

    let t;
    search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 80); });
    render();


    /* ═══ CANVAS DE PARTÍCULAS (reactivo al cursor) ═══ */
    const canvas = document.getElementById('swCanvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const mouse = { x: null, y: null };

    function resize(){
      const r = canvas.getBoundingClientRect();
      W = canvas.width  = r.width;
      H = canvas.height = r.height;
    }
    function makeParticles(){
      particles = [];
      const count = Math.min(90, Math.floor(W / 18));
      for (let i = 0; i < count; i++){
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          s: Math.random() * 1.5 + 0.5
        });
      }
    }
    function tick(){
      ctx.clearRect(0, 0, W, H);
      for (const p of particles){
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.fillStyle = 'rgba(0,212,200,0.60)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
        if (mouse.x !== null){
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150){
            ctx.strokeStyle = `rgba(0,212,200,${0.55 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }
    canvas.parentElement.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });
    window.addEventListener('resize', () => { resize(); makeParticles(); });
    resize(); makeParticles(); tick();
  })();

  /* ═══════════════════════════════════════
     GSAP — CURSOS SECTION
  ═══════════════════════════════════════ */
  const codeDivs = document.querySelectorAll('code');
  const splitData = Array.from(codeDivs, () => []);
  const hasWritten = Array.from(codeDivs, () => false);

  function splitChars(el) {
    const text = el.textContent;
    el.innerHTML = '';
    return text.split('').map(ch => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00a0' : ch;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      el.appendChild(span);
      return span;
    });
  }

  window.addEventListener('load', () => {
    initCursos();
    revealScroll();
    if (typeof drawConnectors === 'function') setTimeout(drawConnectors, 150);
  });

  function initCursos() {
    if (typeof gsap === 'undefined') {
      /* Fallback sin GSAP: mostrar todo el contenido */
      document.querySelectorAll('.tp').forEach(el => { el.style.opacity = '1'; });
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.style.visibility = 'visible';
      return;
    }

    codeDivs.forEach((codeDiv, i) => {
      const tpList = Array.from(codeDiv.querySelectorAll('.tp'));
      tpList.forEach(tp => {
        const chars = splitChars(tp);
        splitData[i].push({ chars });
      });

      gsap.to('body', {
        scrollTrigger: {
          trigger: codeDiv,
          start: 'top bottom-=100',
          scrub: true,
          onEnter: () => writeText(i, 0)
        }
      });
    });

    gsap.set('main', { autoAlpha: 1 });
  }

  function writeText(i, j) {
    if (hasWritten[i] || j >= 200) return;
    const st = splitData[i][j];
    if (!st) { hasWritten[i] = true; return; }
    gsap.timeline({
      onComplete: () => {
        const next = j + 1;
        if (splitData[i][next]) writeText(i, next);
        else hasWritten[i] = true;
      }
    }).set(st.chars, { opacity: 1, stagger: 0.01 });
  }

  /* Scroll lines + parallax tablet */
  if (typeof gsap !== 'undefined') {
    gsap.to('body', {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: self => {
          const p = self.progress;
          const tabletVerMovement = 0.65 * window.innerHeight;
          gsap.set('body', { '--strokeDashoffset': -(2400 * p) });
          gsap.set('body', { '--tabletVerticaloffset': -parseInt(tabletVerMovement * p) + 'px' });
        }
      }
    });
  }

  /* ═══════════════════════════════════════
     SCROLL REVEAL
  ═══════════════════════════════════════ */
  function revealScroll() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 100);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  /* ═══════════════════════════════════════
     PRELOADER
  ═══════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    setTimeout(() => {
      preloader.style.opacity    = '0';
      preloader.style.transition = 'opacity 1s ease';
      setTimeout(() => preloader.remove(), 1000);
    }, 800);
  });

  /* ═══════════════════════════════════════
     EXPAND PANEL CURSOS
  ═══════════════════════════════════════ */
  const panel       = document.getElementById('expandPanel');
  const panelTitle  = document.getElementById('panelTitle');
  const courseName  = document.getElementById('courseName');
  const courseDesc  = document.getElementById('courseDescription');

  /* Abrir panel desde card-wrap */
  document.querySelectorAll('.card-wrap').forEach((wrap, index) => {
    wrap.addEventListener('click', () => {
      if (!panel) return;
      panel.classList.add('active');
      if (index === 1 && panelTitle) panelTitle.textContent = 'CURSO ESTRUCTURAL AVANZADO';
      if (index === 2 && panelTitle) panelTitle.textContent = 'GEO5 MASTERY';
      if (index === 3 && panelTitle) panelTitle.textContent = 'CIVIL 3D INFRAESTRUCTURA';
    });
  });

  /* Botones de cursos — data attributes en lugar de onclick inline */
  document.querySelectorAll('.course-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (courseName) courseName.textContent = btn.dataset.title || '';
      if (courseDesc) courseDesc.textContent = btn.dataset.desc  || '';
    });
  });

  const closePanelBtn = document.getElementById('closePanelBtn');
  if (closePanelBtn) closePanelBtn.addEventListener('click', () => panel?.classList.remove('active'));

  const scrollUpBtn   = document.getElementById('scrollUpBtn');
  const scrollDownBtn = document.getElementById('scrollDownBtn');
  const courseList    = document.getElementById('courseList');
  if (scrollUpBtn   && courseList) scrollUpBtn.addEventListener('click',   () => courseList.scrollBy({ top: -220, behavior: 'smooth' }));
  if (scrollDownBtn && courseList) scrollDownBtn.addEventListener('click', () => courseList.scrollBy({ top:  220, behavior: 'smooth' }));

  /* ═══════════════════════════════════════
     HAMBURGER MENÚ MÓVIL
  ═══════════════════════════════════════ */
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('open');
    });
  }

  /* ═══════════════════════════════════════
     NEUMORPH LOGIN
  ═══════════════════════════════════════ */
  const loginOverlay = document.getElementById('loginOverlay');
  const loginOpenBtn = document.getElementById('loginOpenBtn');
  const nmCard       = document.getElementById('nm-card');
  const switchCtn    = document.getElementById('switch-cnt');
  const switchC1     = document.getElementById('switch-c1');
  const switchC2     = document.getElementById('switch-c2');
  const aContainer   = document.getElementById('a-container');
  const bContainer   = document.getElementById('b-container');

  /* Centralizar cursor — estado del ring */
  function setCursorState(size, color) {
    if (!ring) return;
    ring.style.width       = size + 'px';
    ring.style.height      = size + 'px';
    ring.style.borderColor = color || 'var(--teal)';
  }

  /* ── Memoria del visitante: quien ya dejó su correo no vuelve a ver
        el overlay. Si localStorage está bloqueado, se comporta como antes. ── */
  const EE_REG_KEY = 'ee_registrado';
  function yaRegistrado() {
    try { return localStorage.getItem(EE_REG_KEY) === '1'; } catch (e) { return false; }
  }
  function marcarRegistrado() {
    try { localStorage.setItem(EE_REG_KEY, '1'); } catch (e) { /* modo privado */ }
  }

  /* Auto-open al cargar — solo para visitantes nuevos */
  window.addEventListener('load', () => {
    if (yaRegistrado()) {
      if (loginOpenBtn) loginOpenBtn.classList.add('show');   /* queda accesible a mano */
      return;
    }
    setTimeout(() => {
      openLogin();
    }, 1850);
  });

  function openLogin() {
    if (!loginOverlay) return;
    if (loginOpenBtn) {
      if (typeof gsap !== 'undefined') {
        gsap.to(loginOpenBtn, {
          opacity: 0, scale: 0.6, y: 20, duration: 0.28, ease: 'power2.in',
          onComplete: () => loginOpenBtn.classList.remove('show')
        });
      } else {
        loginOpenBtn.classList.remove('show');
      }
    }
    loginOverlay.classList.add('visible');
    const closeBtn = document.getElementById('nmCloseBtn');
    if (closeBtn) closeBtn.classList.add('active');
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.nm-brand',
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
      gsap.fromTo('.nm-card',
        { scale: 0.82, opacity: 0, y: 55 },
        { scale: 1, opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.5)' }
      );
    }
  }

  function closeLogin() {
    if (!loginOverlay) return;
    if (typeof gsap !== 'undefined') {
      gsap.to('.nm-brand', { opacity: 0, y: -14, duration: 0.25, ease: 'power1.in' });
      gsap.to('.nm-card', {
        scale: 0.84, opacity: 0, y: 55, duration: 0.40, ease: 'power2.in',
        onComplete: () => {
          loginOverlay.classList.remove('visible');
          const closeBtn = document.getElementById('nmCloseBtn');
          if (closeBtn) closeBtn.classList.remove('active');
          if (loginOpenBtn) {
            loginOpenBtn.classList.add('show');
            gsap.fromTo(loginOpenBtn,
              { opacity: 0, scale: 0.6, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.8)' }
            );
          }
        }
      });
    } else {
      loginOverlay.classList.remove('visible');
      if (loginOpenBtn) loginOpenBtn.classList.add('show');
    }
  }

  /* Eventos login */
  const nmCloseBtn = document.getElementById('nmCloseBtn');
  if (nmCloseBtn)    nmCloseBtn.addEventListener('click', closeLogin);
  if (loginOpenBtn)  loginOpenBtn.addEventListener('click', openLogin);

  /* Botón acceder en cyber cards */
  const ccAccederBtn = document.getElementById('ccAccederBtn');
  if (ccAccederBtn) ccAccederBtn.addEventListener('click', openLogin);

  if (loginOverlay) {
    loginOverlay.addEventListener('click', e => {
      if (e.target === loginOverlay) closeLogin();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && loginOverlay?.classList.contains('visible')) closeLogin();
  });

  /* Switch animado */
  function switchToRegistrado() {
    if (!nmCard) return;
    nmCard.classList.add('is-gx');
    if (typeof gsap !== 'undefined') {
      gsap.to(switchCtn, { left: '0%', borderRadius: '28px 0 0 28px', duration: 1.1, ease: 'power4.inOut' });
      gsap.to('.switch-circle', { right: 'auto', left: '-140px', duration: 1.1, ease: 'power4.inOut' });
      gsap.to(switchC1, { opacity: 0, x: -24, duration: 0.32, ease: 'power2.in', onComplete: () => { if (switchC1) switchC1.style.pointerEvents = 'none'; } });
      gsap.fromTo(switchC2, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.38, delay: 0.48, ease: 'power2.out', onStart: () => { if (switchC2) switchC2.style.pointerEvents = 'all'; } });
      gsap.to(aContainer, { x: -90, opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: () => { if (aContainer) aContainer.style.pointerEvents = 'none'; } });
      gsap.fromTo(bContainer, { x: 90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, delay: 0.52, ease: 'power2.out', onStart: () => { if (bContainer) bContainer.style.pointerEvents = 'all'; } });
    }
  }

  function switchToRegistrar() {
    if (!nmCard) return;
    nmCard.classList.remove('is-gx');
    if (typeof gsap !== 'undefined') {
      gsap.to(switchCtn, { left: '50%', borderRadius: '0 28px 28px 0', duration: 1.1, ease: 'power4.inOut' });
      gsap.to('.switch-circle', { left: 'auto', right: '-140px', duration: 1.1, ease: 'power4.inOut' });
      gsap.to(switchC2, { opacity: 0, x: 24, duration: 0.32, ease: 'power2.in', onComplete: () => { if (switchC2) switchC2.style.pointerEvents = 'none'; } });
      gsap.fromTo(switchC1, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.38, delay: 0.48, ease: 'power2.out', onStart: () => { if (switchC1) switchC1.style.pointerEvents = 'all'; } });
      gsap.to(bContainer, { x: 90, opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: () => { if (bContainer) bContainer.style.pointerEvents = 'none'; } });
      gsap.fromTo(aContainer, { x: -90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, delay: 0.52, ease: 'power2.out', onStart: () => { if (aContainer) aContainer.style.pointerEvents = 'all'; } });
    }
  }

  const btnSwitchRegistrado = document.getElementById('btnSwitchRegistrado');
  const btnSwitchRegistrar  = document.getElementById('btnSwitchRegistrar');
  if (btnSwitchRegistrado) btnSwitchRegistrado.addEventListener('click', switchToRegistrado);
  if (btnSwitchRegistrar)  btnSwitchRegistrar.addEventListener('click', switchToRegistrar);

  /* Validación email */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* Handler registrar */
  function handleRegistrar() {
    const emailInput = document.getElementById('signin-email');
    const msgEl      = document.getElementById('nm-msg-a');
    if (!emailInput || !msgEl) return;
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      msgEl.style.color   = '#d45555';
      msgEl.textContent   = '⚠ Ingresa un correo válido';
      nmShake();
      return;
    }
    msgEl.style.color = '#4a90e2';
    msgEl.textContent = 'Enviando…';
    /* Nota: la key "ABC123" es solo un token de identificación básico del
       Google Apps Script — no es una credencial sensible de API */
    fetch('https://script.google.com/macros/s/AKfycbyFCOnYeglGWhAQpZBe2yn58ZJT81-7ffNMvXjJa1qmcHuaM3HQWoOWMXwLHcLiqnXQ/exec', {
      method: 'POST',
      body: JSON.stringify({ correo: email, key: 'ABC123' })
    })
    .then(res => {
      /* Antes se daba por exitoso cualquier respuesta. Si el Apps Script
         devuelve error, el visitante debe enterarse. */
      if (!res.ok) throw new Error('HTTP ' + res.status);
      msgEl.style.color = '#2db87e';
      msgEl.textContent = '✅ ¡Correo registrado correctamente!';
      emailInput.value  = '';
      marcarRegistrado();
      setTimeout(() => switchToRegistrado(), 1600);
    })
    .catch(() => {
      msgEl.style.color = '#d45555';
      msgEl.textContent = '❌ Error al registrar. Intenta de nuevo.';
    });
  }

  /* Handler confirmar */
  function handleConfirmar() {
    const emailInput = document.getElementById('signup-email');
    const msgEl      = document.getElementById('nm-msg-b');
    if (!emailInput || !msgEl) return;
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      msgEl.style.color = '#d45555';
      msgEl.textContent = '⚠ Ingresa un correo válido';
      return;
    }
    msgEl.style.color = '#2db87e';
    msgEl.textContent = '✅ ¡Todo listo! Eres parte de Engineering Eyes.';
    setTimeout(() => closeLogin(), 1800);
  }

  function nmShake() {
    if (typeof gsap !== 'undefined') {
      gsap.to('.nm-card', {
        x: -9, duration: 0.07, repeat: 5, yoyo: true, ease: 'power1.inOut',
        onComplete: () => gsap.set('.nm-card', { x: 0 })
      });
    }
  }

  const btnRegistrar = document.getElementById('btnRegistrar');
  const btnConfirmar = document.getElementById('btnConfirmar');
  if (btnRegistrar) btnRegistrar.addEventListener('click', handleRegistrar);
  if (btnConfirmar) btnConfirmar.addEventListener('click', handleConfirmar);

  const signinEmail = document.getElementById('signin-email');
  const signupEmail = document.getElementById('signup-email');
  if (signinEmail) signinEmail.addEventListener('keydown', e => { if (e.key === 'Enter') handleRegistrar(); });
  if (signupEmail) signupEmail.addEventListener('keydown', e => { if (e.key === 'Enter') handleConfirmar(); });

})();

/* ═══ Abrir acordeón Neon (iframe aislado) al hacer clic en un software ═══ */
(function(){
  let overlay, savedScroll = 0;

  let frame;
  function ensure(){
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'acc-overlay';
    overlay.innerHTML =
      '<button type="button" class="acc-back"><i class="ti ti-arrow-left"></i> Regresar</button>' +
      '<iframe title="Detalle"></iframe>';
    document.body.appendChild(overlay);
    frame = overlay.querySelector('iframe');
    overlay.querySelector('.acc-back').addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
  }
  function open(swKey){
    ensure();
    frame.src = 'accordion.html' + (swKey ? '?sw=' + encodeURIComponent(swKey) : '');
    savedScroll = window.scrollY || 0;
    overlay.classList.add('open');
    requestAnimationFrame(() => overlay.classList.add('visible'));
    document.body.style.overflow = 'hidden';
  }
  function close(){
    if (!overlay) return;
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.classList.remove('open'); window.scrollTo(0, savedScroll); }, 350);
  }

  const SELECTOR = '.sw-row[data-sw], a.sw-row[data-sw], .sw-card[data-sw], a.sw-card[data-sw]';
  function destino(nodo) {
    return nodo && nodo.closest ? nodo.closest(SELECTOR) : null;
  }

  /* ── Apertura por toque ────────────────────────────────────────
     Antes se escuchaba solo `click`. En móvil el navegador CANCELA
     el click si el dedo se mueve más de ~20px entre apoyar y
     levantar (lo interpreta como scroll), y en un dedo real ese
     movimiento ocurre casi siempre: de ahí que "a veces no entre".

     Aquí se atiende el toque directamente y se acepta hasta 24px de
     desplazamiento, que sigue siendo mucho menos de lo que hace
     falta para desplazar la página de verdad. Si el dedo se va más
     lejos, era scroll y no se abre nada.

     `abriendo` bloquea el click sintético que el navegador emite
     después del toque, para no abrir la ficha dos veces.
  ────────────────────────────────────────────────────────────── */
  const TOLERANCIA  = 45;    /* px que puede irse el dedo sin dejar de ser toque */
  const SCROLL_MIN  = 6;     /* px que debe moverse la PÁGINA para llamarlo scroll */
  const MAX_MS      = 1200;  /* más lento que esto = pulsación larga */
  let inicio = null, abriendo = false;

  /* El criterio decisivo no es cuánto se movió el dedo, sino si la
     PÁGINA se desplazó. Un dedo real siempre tiembla unos píxeles;
     eso no significa que quisieras hacer scroll. Si la página no se
     movió, fue un toque, y punto. */
  document.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) { inicio = null; return; }
    const el = destino(e.target);
    if (!el) { inicio = null; return; }
    const t = e.touches[0];
    inicio = { x: t.clientX, y: t.clientY, t: Date.now(), el, scroll: window.scrollY || 0 };
    el.classList.add('sw-pulsado');          /* respuesta visual inmediata */
  }, { passive: true });

  function limpiar() {
    document.querySelectorAll('.sw-pulsado').forEach(n => n.classList.remove('sw-pulsado'));
  }

  document.addEventListener('touchend', e => {
    limpiar();
    if (!inicio) return;
    const partida = inicio;
    inicio = null;
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;

    const movioPagina = Math.abs((window.scrollY || 0) - partida.scroll) > SCROLL_MIN;
    const dist = Math.hypot(t.clientX - partida.x, t.clientY - partida.y);

    if (movioPagina) return;                       /* hubo scroll de verdad */
    if (dist > TOLERANCIA) return;                 /* arrastre muy largo */
    if (Date.now() - partida.t > MAX_MS) return;   /* pulsación larga */

    /* El dedo puede levantarse sobre otra tarjeta; manda donde empezó */
    e.preventDefault();
    abriendo = true;
    setTimeout(() => { abriendo = false; }, 600);
    open(partida.el.dataset.sw);
  }, { passive: false });

  document.addEventListener('touchcancel', () => { inicio = null; limpiar(); }, { passive: true });

  /* Respaldo para navegadores que emiten eventos de puntero pero no
     los táctiles clásicos (algunos navegadores integrados de apps). */
  document.addEventListener('pointerup', e => {
    if (e.pointerType === 'mouse') return;         /* el ratón va por `click` */
    if (abriendo) return;
    const el = destino(e.target);
    if (!el) return;
    abriendo = true;
    setTimeout(() => { abriendo = false; }, 600);
    open(el.dataset.sw);
  });

  /* Ratón, teclado y navegadores sin táctil siguen por aquí */
  document.addEventListener('click', e => {
    const el = destino(e.target);
    if (!el) return;
    e.preventDefault();
    if (abriendo) return;                          /* ya lo abrió el toque */
    open(el.dataset.sw);
  });
})();
