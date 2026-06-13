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
     Agregar programa = una línea en SW_DATA.
     soon:true = "Próximamente" (sin url).
  ═══════════════════════════════════════ */
  const SW_DATA = [
    // ── Geotecnia ──
    { name:"GEO5 2025",     cat:"Geotecnia",     icon:"ti-world",            versions:"v25 · Estable",     ac:"#2ecc71", url:"https://engineeringeyes.github.io/Engineering_Eyes_2.0/redirect/geo5.html", img:"https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/geo5.png" },
    { name:"GEO5 2026",     cat:"Geotecnia",     icon:"ti-world",            versions:"v26 · Nuevo",       ac:"#2ecc71", url:"https://engineeringeyes.github.io/Engineering_Eyes_2.0/redirect/geo52026.html", img:"https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/geo5.png" },
    // ── Estructural (CSI) ──
    { name:"ETABS 22",      cat:"Estructural",   icon:"ti-building",         versions:"Edificios · Sísmico",     ac:"#3498db", url:"https://t.me/+xT9picqsAUI5MDAx", img:"https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/etabs.png" },
    { name:"ETABS 23",      cat:"Estructural",   icon:"ti-building",         versions:"Edificios · Actualizado", ac:"#3498db", url:"https://t.me/+xT9picqsAUI5MDAx", img:"https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/etabs.png" },
    { name:"SAFE 22",       cat:"Estructural",   icon:"ti-layout-grid",      versions:"Losas · Cimentaciones",   ac:"#3498db", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"SAP2000 v25",   cat:"Estructural",   icon:"ti-building-bridge",  versions:"General · Puentes",       ac:"#3498db", url:"https://t.me/+xT9picqsAUI5MDAx" },
    // ── Estructural (CYPE) ──
    { name:"Cypecad 2019",  cat:"Estructural",   icon:"ti-box",              versions:"Estructuras",             ac:"#e67e22", url:"https://t.me/+xT9picqsAUI5MDAx", img:"https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/cypecad.png" },
    { name:"Cypecad 2026.c",cat:"Estructural",   icon:"ti-box",              versions:"Estructuras · Nuevo",     ac:"#e67e22", url:"https://engineeringeyes.github.io/Engineering_Eyes_2.0/redirect/cypecad2026.html", img:"https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/cypecad.png" },
    // ── BIM & CAD (Autodesk) ──
    { name:"Revit 2025",    cat:"BIM & CAD",     icon:"ti-3d-cube-sphere",   versions:"BIM · Arquitectura",      ac:"#e74c3c", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"Revit 2026",    cat:"BIM & CAD",     icon:"ti-3d-cube-sphere",   versions:"BIM · Nuevo",             ac:"#e74c3c", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"Revit 2027",    cat:"BIM & CAD",     icon:"ti-3d-cube-sphere",   versions:"BIM · Beta",              ac:"#e74c3c", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"AutoCAD 2023",  cat:"BIM & CAD",     icon:"ti-ruler-2",          versions:"CAD · 2D/3D",             ac:"#e74c3c", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"AutoCAD 2024",  cat:"BIM & CAD",     icon:"ti-ruler-2",          versions:"CAD · Estable",           ac:"#e74c3c", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"AutoCAD 2025",  cat:"BIM & CAD",     icon:"ti-ruler-2",          versions:"CAD · Nuevo",             ac:"#e74c3c", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"Civil 3D 2023", cat:"BIM & CAD",     icon:"ti-road",             versions:"Infraestructura",         ac:"#e74c3c", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"Civil 3D 2024", cat:"BIM & CAD",     icon:"ti-road",             versions:"Infraestructura",         ac:"#e74c3c", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"Civil 3D 2025", cat:"BIM & CAD",     icon:"ti-road",             versions:"Infraestructura",         ac:"#e74c3c", url:"https://t.me/+xT9picqsAUI5MDAx" },
    // ── Productividad ──
    { name:"Office 2019",   cat:"Productividad", icon:"ti-file-spreadsheet", versions:"Suite · Completa",        ac:"#f7d152", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"Office 2021",   cat:"Productividad", icon:"ti-file-spreadsheet", versions:"Suite · Estable",         ac:"#f7d152", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"Office 365",    cat:"Productividad", icon:"ti-file-spreadsheet", versions:"Suite · Cloud",           ac:"#f7d152", url:"https://t.me/+xT9picqsAUI5MDAx" },
    // ── Recursos (Plantillas) ──
    { name:"Plantillas Excel",   cat:"Recursos", icon:"ti-clipboard",        versions:"Cálculos · Presupuestos", ac:"#9b59b6", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"Plantillas AutoCAD", cat:"Recursos", icon:"ti-clipboard",        versions:"Bloques · Cajetines",     ac:"#9b59b6", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"Plantillas Revit",   cat:"Recursos", icon:"ti-clipboard",        versions:"Familias · Proyectos",    ac:"#9b59b6", url:"https://t.me/+xT9picqsAUI5MDAx" },
    // ── Estructural (nuevos) ──
    { name:"Cypecad 2027.a", cat:"Estructural",   icon:"ti-box",             versions:"Estructuras · Reciente",  ac:"#f6b73c", url:"https://t.me/+xT9picqsAUI5MDAx", img:"https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/cypecad.png" },
    { name:"CSiBridge",      cat:"Estructural",   icon:"ti-building-bridge", versions:"Puentes · CSI",           ac:"#62d9c8", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"RISA Suite",     cat:"Estructural",   icon:"ti-building",        versions:"3D · Floor · Foundation", ac:"#7cffb2", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"ADAPT-Builder",  cat:"Estructural",   icon:"ti-layout-grid",     versions:"Postensado",              ac:"#ff7da3", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"IDEA StatiCa",   cat:"Estructural",   icon:"ti-link",            versions:"Conexiones · CBFEM",      ac:"#6fb8ff", url:"https://t.me/+xT9picqsAUI5MDAx" },
    // ── BIM & CAD (nuevos) ──
    { name:"ARCHICAD 28",    cat:"BIM & CAD",     icon:"ti-3d-cube-sphere",  versions:"BIM · Graphisoft",        ac:"#5ad1ff", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"Bluebeam Revu",  cat:"BIM & CAD",     icon:"ti-file-text",       versions:"PDF · Planos",            ac:"#4f8df9", url:"https://t.me/+xT9picqsAUI5MDAx" },
    // ── GIS ──
    { name:"Global Mapper",  cat:"GIS",           icon:"ti-map",             versions:"Terreno · LiDAR",         ac:"#ffd36a", url:"https://t.me/+xT9picqsAUI5MDAx" },
    { name:"ArcGIS Pro 3.4.2", cat:"GIS",         icon:"ti-map-2",           versions:"SIG · Esri",              ac:"#6fd3ff", url:"https://t.me/+xT9picqsAUI5MDAx" },
    // ↓↓↓ Agrega los próximos aquí. soon:true para "Próximamente". ↓↓↓
    // { name:"Plaxis 2D", cat:"Geotecnia", icon:"ti-topology-ring", soon:true, ac:"#2ecc71" },
  ];

  (function initSoftwareCatalog(){
    const listEl  = document.getElementById('swList');
    const filters = document.getElementById('swFilters');
    const countEl = document.getElementById('swCount');
    const search  = document.getElementById('swSearch');
    if (!listEl) return;

    let active = 'Todos';

    /* Chips de categoría */
    const cats = ['Todos', ...new Set(SW_DATA.map(d => d.cat))];
    filters.innerHTML = cats.map(c =>
      `<button class="sw-chip${c === 'Todos' ? ' active' : ''}" role="tab" data-cat="${c}">${c}</button>`
    ).join('');
    filters.querySelectorAll('.sw-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        active = btn.dataset.cat;
        filters.querySelectorAll('.sw-chip').forEach(b => b.classList.toggle('active', b === btn));
        render();
      });
    });

    const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const slug = s => String(s).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

    function render(){
      const q = (search.value || '').toLowerCase().trim();
      const list = SW_DATA
        .filter(d => (active === 'Todos' || d.cat === active))
        .filter(d => d.name.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q))
        .sort((a,b) => a.name.localeCompare(b.name));

      const avail = list.filter(d => !d.soon).length;
      countEl.innerHTML = `MOSTRANDO <b>${list.length}</b> · DISPONIBLES <b>${avail}</b> · PRÓXIMAMENTE <b>${list.length - avail}</b>`;

      if (!list.length){
        listEl.innerHTML = `<div class="sw-empty">// SIN RESULTADOS PARA "${esc(q)}"</div>`;
        return;
      }

      /* Agrupar por inicial (estilo UGS A–Z) */
      const groups = {};
      list.forEach(d => {
        const k = d.name.charAt(0).toUpperCase();
        (groups[k] = groups[k] || []).push(d);
      });

      listEl.innerHTML = Object.keys(groups).sort().map(letter => {
        const rows = groups[letter].map(d => {
          const inner = `
            <i class="ti ${d.icon} sw-row-ico" aria-hidden="true"></i>
            <span class="sw-row-name">${esc(d.name)}</span>
            ${d.soon
              ? `<span class="sw-row-soon"><i class="ti ti-clock" aria-hidden="true"></i> Próximamente</span>`
              : `<span class="sw-row-vers">${esc(d.versions || '')}</span>`}
          `;
          return d.soon
            ? `<div class="sw-row soon" style="--ac:${d.ac || 'var(--teal)'}">${inner}</div>`
            : `<a class="sw-row" style="--ac:${d.ac || 'var(--teal)'}" href="${esc(d.url)}" data-sw="${esc(slug(d.name))}" data-name="${esc(d.name)}">${inner}</a>`;
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

  /* Auto-open al cargar */
  window.addEventListener('load', () => {
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
    .then(() => {
      msgEl.style.color = '#2db87e';
      msgEl.textContent = '✅ ¡Correo registrado correctamente!';
      emailInput.value  = '';
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

  document.addEventListener('click', e => {
    const row = e.target.closest('.sw-row[data-sw], a.sw-row[data-sw]');
    if (!row) return;
    e.preventDefault();
    open(row.dataset.sw);
  });
})();
