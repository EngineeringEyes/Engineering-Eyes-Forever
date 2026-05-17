/* ═══════════ CURSOR ═══════════ */
const ring = document.getElementById('cring');
const dot  = document.getElementById('cdot');
document.addEventListener('mousemove', e => {
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
  dot.style.left  = e.clientX + 'px';
  dot.style.top   = e.clientY + 'px';
});
document.querySelectorAll('a,button,.sw-cat,.sw-ver-card,.mem-card-row,.curso-item').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width='48px'; ring.style.height='48px'; ring.style.opacity='0.5'; });
  el.addEventListener('mouseleave', () => { ring.style.width='28px'; ring.style.height='28px'; ring.style.opacity='1'; });
});

/* ═══════════ HERO SLIDER ═══════════ */
let currentSlide = 0;
const totalSlides = 4;
let autoTimer;

function goSlide(n) {
  document.querySelector('.hero-slide.active')?.classList.remove('active');
  document.querySelectorAll('.sdot')[currentSlide]?.classList.remove('active');
  currentSlide = (n + totalSlides) % totalSlides;
  document.getElementById('slide-' + currentSlide)?.classList.add('active');
  document.querySelectorAll('.sdot')[currentSlide]?.classList.add('active');
  document.getElementById('snum').textContent = String(currentSlide + 1).padStart(2,'0');
  resetAuto();
}
function nextSlide() { goSlide(currentSlide + 1); }
function prevSlide() { goSlide(currentSlide - 1); }
function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 6000);
}
resetAuto();

// Swipe touch
let touchX = 0;
document.querySelector('.hero').addEventListener('touchstart', e => { touchX = e.touches[0].clientX; });
document.querySelector('.hero').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide();
});

/* ═══════════ SOFTWARE TABS ═══════════ */
function swCat(el, panelId) {
  document.querySelectorAll('.sw-cat').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.sw-panel-inner').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(panelId)?.classList.add('active');
}

/* ═══════════ GSAP ORIGINAL EE — PRESERVADO ÍNTEGRO ═══════════ */
let selectAll = e => document.querySelectorAll(e);
let split = [[],[],[]];
let splitTp = [[],[],[]];
let hasWritten = [false,false,false];

window.addEventListener('load', () => {
  init();
  revealScroll();
  setTimeout(drawConnectors,150);
});

function init() {
  let codeDivs = selectAll("code");
  codeDivs.forEach((codeDiv, i) => {
    let tp = codeDiv.querySelectorAll(".tp");
    split[i].push(tp);
    split[i].forEach(tp => {
      let st = new SplitText(tp, { type:"chars" });
      gsap.set(st.chars, { opacity:0 });
      splitTp[i].push(st);
    });
    gsap.to("body", {
      scrollTrigger: {
        trigger: codeDivs[i],
        start: "top bottom-=100",
        scrub: true,
        onEnter: () => writeText(i, 0)
      }
    });
  });

  function writeText(i, j) {
    if (!hasWritten[i] && j < 200) {
      let st = splitTp[i][j];
      gsap.timeline({ onComplete: () => {
        let next = j + 1;
        if (split[i][next]) writeText(i, next);
        else { hasWritten[i] = true; }
      }}).set(st.chars, { opacity:1, stagger:0.01 });
    }
  }
  gsap.set("main", { autoAlpha:1 });
}

/* SCROLL LINES + PARALLAX TABLET — ORIGINALES */
gsap.to("body", {
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      const tabletVerMovement = 0.65 * window.innerHeight;
      gsap.set("body", { "--strokeDashoffset": -(2400 * p) });
      gsap.set("body", { "--tabletVerticaloffset": -parseInt(tabletVerMovement * p) + "px" });
    }
  }
});

/* ═══════════ MEMBRESÍAS MODAL ═══════════ */
const plans = [
  { plan:'Nivel 1', title:'Plan Básico',      icon:'ti-crown',       color:'#00d4c8', bg:'linear-gradient(135deg,#003836,#00d4c8)', price:'$9 / mes',   desc:'Acceso a software básico y recursos fundamentales de la plataforma con soporte por email.', features:['1 usuario','Software básico','Soporte email','Recursos básicos'] },
  { plan:'Nivel 2', title:'Plan Estándar',    icon:'ti-rocket',      color:'#0099cc', bg:'linear-gradient(135deg,#002530,#0099cc)', price:'$19 / mes',  desc:'Más herramientas y acceso a cursos básicos de ingeniería estructural y civil.', features:['3 usuarios','Suite ampliada','Soporte 24h','Cursos básicos'] },
  { plan:'Nivel 3', title:'Plan Premium',     icon:'ti-settings',    color:'#0066aa', bg:'linear-gradient(135deg,#001525,#0066aa)', price:'$39 / mes',  desc:'Suite completa de software. Cursos avanzados de BIM, ETABS, Geo5 y más. Sin límites.', features:['10 usuarios','Suite completa','Soporte prioritario','Cursos avanzados'] },
  { plan:'Nivel 4', title:'Plan Profesional', icon:'ti-certificate', color:'#004488', bg:'linear-gradient(135deg,#001020,#004488)', price:'$59 / mes',  desc:'Acceso a maestrías y diplomados completos. Analítica y colaboración en tiempo real.', features:['25 usuarios','Maestrías','Diplomados','Analítica'] },
  { plan:'Nivel 5', title:'Plan VIP',         icon:'ti-chart-bar',   color:'#003366', bg:'linear-gradient(135deg,#000d1a,#003366)', price:'$89 / mes',  desc:'Todo incluido: gestor de cuenta dedicado, acceso anticipado a nuevas versiones de software.', features:['50 usuarios','Gestor dedicado','Betas anticipados','Webinars'] },
  { plan:'Nivel 6', title:'Plan Empresarial', icon:'ti-building',    color:'#886600', bg:'linear-gradient(135deg,#1a1000,#886600)', price:'$149 / mes', desc:'Licencias para equipos completos, API de acceso, auditoría y gestión de roles.', features:['Usuarios ilimitados','API acceso','Auditoría','Roles'] },
  { plan:'Nivel 7', title:'Plan Elite',       icon:'ti-star',        color:'#996600', bg:'linear-gradient(135deg,#1a0800,#996600)', price:'$249 / mes', desc:'SLA garantizado 99.9%, configuración personalizada, capacitación y onboarding asistido.', features:['Config. personalizada','SLA 99.9%','Capacitación','Onboarding'] },
  { plan:'Nivel 8', title:'Plan Platinum',    icon:'ti-diamond',     color:'#aa3300', bg:'linear-gradient(135deg,#1a0500,#aa3300)', price:'A medida',   desc:'Infraestructura dedicada, consultor exclusivo y contrato personalizado para tu organización.', features:['Infra. dedicada','Consultor exclusivo','Contrato','Soporte 24/7'] }
];

const overlay = document.getElementById('modal-overlay');
document.querySelectorAll('.mem-card-row').forEach(row => {
  row.addEventListener('click', () => {
    const p = plans[+row.dataset.idx];
    document.getElementById('modal-bar').style.background = p.color;
    document.getElementById('modal-icon').style.background = p.bg;
    document.getElementById('modal-icon-i').className = 'ti ' + p.icon;
    document.getElementById('modal-plan').style.color = p.color;
    document.getElementById('modal-plan').textContent = p.plan;
    document.getElementById('modal-title').textContent = p.title;
    document.getElementById('modal-desc').textContent = p.desc;
    document.getElementById('modal-price').innerHTML = p.price + '<span>por usuario</span>';
    document.getElementById('modal-features').innerHTML =
      p.features.map(f => `<div class="modal-feat"><i class="ti ti-check" style="color:${p.color}"></i>${f}</div>`).join('');
    overlay.classList.add('open');
  });
});
document.getElementById('modal-close').addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', e => { if(e.target===overlay) overlay.classList.remove('open'); });

/* CONNECTORS */
function drawConnectors() {
  const svg = document.getElementById('conn-svg');
  const wrap = document.getElementById('svg-wrap');
  const rows = document.querySelectorAll('.mem-card-row');
  const wH = wrap.offsetHeight || 520;
  svg.setAttribute('viewBox', `0 0 80 ${wH}`);
  svg.innerHTML = '';
  const colors = ['#00d4c8','#0099cc','#0066aa','#004488','#003366','#886600','#996600','#aa3300'];
  const wrapRect = wrap.getBoundingClientRect();
  const cY = wH / 2;
  rows.forEach((row, i) => {
    const hex = row.querySelector('.node-mini');
    const r = hex.getBoundingClientRect();
    const yNode = r.top - wrapRect.top + r.height / 2;
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', `M 0 ${cY} C 40 ${cY} 40 ${yNode} 80 ${yNode}`);
    path.setAttribute('class','dot-path');
    path.setAttribute('stroke', colors[i]);
    svg.appendChild(path);
  });
}
window.addEventListener('load', () => setTimeout(drawConnectors, 150));
window.addEventListener('resize', drawConnectors);

/* ═══════════ SCROLL REVEAL ═══════════ */
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
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 1s ease';

    setTimeout(() => {
      preloader.remove();
    }, 1000);

  }, 800);
});
const panel =
document.getElementById("expandPanel");

const panelTitle =
document.getElementById("panelTitle");

const courseName =
document.getElementById("courseName");

const courseDescription =
document.getElementById("courseDescription");

/* ABRIR PANEL DESDE CARD */
document.querySelectorAll("cardWrapper")
.forEach((card,index)=>{

  card.addEventListener("click",()=>{

    panel.classList.add("active");

    if(index === 1){
      panelTitle.innerText =
      "CURSO ESTRUCTURAL AVANZADO";
    }

    if(index === 2){
      panelTitle.innerText =
      "GEO5 MASTERY";
    }

    if(index === 3){
      panelTitle.innerText =
      "CIVIL 3D INFRAESTRUCTURA";
    }

  });

});

/* CAMBIO DE CURSO */
function showCourse(title,description){

  courseName.innerText =
  title;

  courseDescription.innerText =
  description;
}

/* CERRAR */
function closePanel(){
  panel.classList.remove("active");
}
/* SCROLL CURSOS */
function scrollCourses(amount){

  const list =
  document.getElementById("courseList");

  list.scrollBy({
    top:amount,
    behavior:"smooth"
  });

}
/* ═══════════════════════════════════════════════════════════
   NEUMORPH LOGIN — form.js del video + GSAP + auto-open
   Variables exactas: switchCtn, switchC1, switchC2,
   switchCircle, switchBtn, aContainer, bContainer
═══════════════════════════════════════════════════════════ */

/* ── Referencias del form.js del video ── */
let switchCtn    = document.getElementById("switch-cnt");
let switchC1     = document.getElementById("switch-c1");
let switchC2     = document.getElementById("switch-c2");
let switchCircle = document.querySelectorAll(".switch-circle");
let switchBtn    = document.querySelectorAll(".switch-btn");
let aContainer   = document.getElementById("a-container");
let bContainer   = document.getElementById("b-container");
let allButtons   = document.querySelectorAll(".nm-submit");
let nmCard       = document.getElementById("nm-card");
let loginOverlay = document.getElementById("loginOverlay");
let loginOpenBtn = document.querySelector(".login-open-btn");
let nmCloseBtn = document.querySelector(".nm-close-btn");
/* ═════════════════════════════════════════
   AUTO-OPEN al cargar — aparece en inicio
═════════════════════════════════════════ */
window.addEventListener("load", () => {
  /* Espera que el preloader termine (1.8s total) */
  setTimeout(() => {
    loginOverlay.classList.add("visible");
    nmCloseBtn.classList.add("active");
    if (typeof gsap !== "undefined") {
      /* Overlay fade in */
      gsap.fromTo(loginOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power1.out" }
      );
      /* Marca cae desde arriba */
      gsap.fromTo(".nm-brand",
        { opacity: 0, y: -22 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }
      );
      /* Tarjeta sube con spring */
      gsap.fromTo(".nm-card",
        { scale: 0.80, opacity: 0, y: 70 },
        { scale: 1, opacity: 1, y: 0, duration: 0.90,
          delay: 0.15, ease: "back.out(1.6)" }
      );
    }
  }, 1850);
});

/* ═════════════════════════════════════════
   CERRAR LOGIN — hero queda limpio, botón aparece
═════════════════════════════════════════ */
function closeLogin() {
  if (typeof gsap !== "undefined") {
    gsap.to(".nm-brand", { opacity: 0, y: -14, duration: 0.25, ease: "power1.in" });
    gsap.to(".nm-card", {
      scale: 0.84, opacity: 0, y: 55, duration: 0.40, ease: "power2.in",
      onComplete: () => {
        loginOverlay.classList.remove("visible");
        nmCloseBtn.classList.remove("active");
        /* Mostrar botón de encendido con entrada suave */
        if (loginOpenBtn) {
          loginOpenBtn.classList.add("show");
          gsap.fromTo(loginOpenBtn,
            { opacity: 0, scale: 0.6, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.8)" }
          );
        }
      }
    });
  } else {
    loginOverlay.classList.remove("visible");
    nmCloseBtn.classList.remove("active");
    if (loginOpenBtn) loginOpenBtn.classList.add("show");
  }
}

/* ═════════════════════════════════════════
   REABRIR — botón de encendido/apagado
═════════════════════════════════════════ */
function openLogin() {
  /* Ocultar botón con salida */
  if (loginOpenBtn) {
    if (typeof gsap !== "undefined") {
      gsap.to(loginOpenBtn, {
        opacity: 0, scale: 0.6, y: 20, duration: 0.28, ease: "power2.in",
        onComplete: () => loginOpenBtn.classList.remove("show")
      });
    } else {
      loginOpenBtn.classList.remove("show");
    }
  }

  loginOverlay.classList.add("visible");
  nmCloseBtn.classList.add("active");
  if (typeof gsap !== "undefined") {
    gsap.fromTo(".nm-brand",
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
    gsap.fromTo(".nm-card",
      { scale: 0.82, opacity: 0, y: 55 },
      { scale: 1, opacity: 1, y: 0, duration: 0.65, ease: "back.out(1.5)" }
    );
  }
}

/* Click fuera de la tarjeta — cierra */
loginOverlay.addEventListener("click", e => {
  if (e.target === loginOverlay) closeLogin();
});

/* ESC — cierra */
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && loginOverlay.classList.contains("visible")) closeLogin();
});

/* ═════════════════════════════════════════
   SWITCH — animación principal deslizante
   (igual al video: panel azul se mueve)
═════════════════════════════════════════ */

function switchToRegistrado() {
  nmCard.classList.add("is-gx");

  if (typeof gsap !== "undefined") {
    /* Panel azul desliza a la izquierda */
    gsap.to(switchCtn, {
      left: "0%",
      borderRadius: "28px 0 0 28px",
      duration: 1.1,
      ease: "power4.inOut"
    });
    /* Círculo decorativo se mueve */
    gsap.to(".switch-circle", {
      right: "auto", left: "-140px",
      duration: 1.1, ease: "power4.inOut"
    });

    /* C1 desaparece */
    gsap.to(switchC1, {
      opacity: 0, x: -24,
      duration: 0.32, ease: "power2.in",
      onComplete: () => { switchC1.style.pointerEvents = "none"; }
    });
    /* C2 aparece */
    gsap.fromTo(switchC2,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.38, delay: 0.48, ease: "power2.out",
        onStart: () => { switchC2.style.pointerEvents = "all"; }
      }
    );

    /* Formulario A sale por la izquierda */
    gsap.to(aContainer, {
      x: -90, opacity: 0, duration: 0.45, ease: "power2.in",
      onComplete: () => { aContainer.style.pointerEvents = "none"; }
    });
    /* Formulario B entra por la derecha */
    gsap.fromTo(bContainer,
      { x: 90, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.50, delay: 0.52, ease: "power2.out",
        onStart: () => { bContainer.style.pointerEvents = "all"; }
      }
    );
  }
}

function switchToRegistrar() {
  nmCard.classList.remove("is-gx");

  if (typeof gsap !== "undefined") {
    /* Panel azul vuelve a la derecha */
    gsap.to(switchCtn, {
      left: "50%",
      borderRadius: "0 28px 28px 0",
      duration: 1.1,
      ease: "power4.inOut"
    });
    /* Círculo vuelve */
    gsap.to(".switch-circle", {
      left: "auto", right: "-140px",
      duration: 1.1, ease: "power4.inOut"
    });

    /* C2 desaparece */
    gsap.to(switchC2, {
      opacity: 0, x: 24,
      duration: 0.32, ease: "power2.in",
      onComplete: () => { switchC2.style.pointerEvents = "none"; }
    });
    /* C1 aparece */
    gsap.fromTo(switchC1,
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, duration: 0.38, delay: 0.48, ease: "power2.out",
        onStart: () => { switchC1.style.pointerEvents = "all"; }
      }
    );

    /* Formulario B sale por la derecha */
    gsap.to(bContainer, {
      x: 90, opacity: 0, duration: 0.45, ease: "power2.in",
      onComplete: () => { bContainer.style.pointerEvents = "none"; }
    });
    /* Formulario A entra por la izquierda */
    gsap.fromTo(aContainer,
      { x: -90, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.50, delay: 0.52, ease: "power2.out",
        onStart: () => { aContainer.style.pointerEvents = "all"; }
      }
    );
  }
}

/* ═════════════════════════════════════════
   HANDLERS — formulario
═════════════════════════════════════════ */

function handleRegistrar() {
  const email = document.getElementById("signin-email").value.trim();
  const msgEl = document.getElementById("nm-msg-a");

  if (!email || !email.includes("@")) {
    msgEl.style.color = "#d45555";
    msgEl.textContent = "⚠ Ingresa un correo válido";
    nmShake();
    return;
  }

  msgEl.style.color = "#4a90e2";
  msgEl.textContent = "Enviando…";

  fetch("https://script.google.com/macros/s/AKfycbyFCOnYeglGWhAQpZBe2yn58ZJT81-7ffNMvXjJa1qmcHuaM3HQWoOWMXwLHcLiqnXQ/exec", {
    method: "POST",
    body: JSON.stringify({ correo: email, key: "ABC123" })
  })
  .then(() => {
    msgEl.style.color = "#2db87e";
    msgEl.textContent = "✅ ¡Correo registrado correctamente!";
    document.getElementById("signin-email").value = "";
    setTimeout(() => switchToRegistrado(), 1600);
  })
  .catch(() => {
    msgEl.style.color = "#d45555";
    msgEl.textContent = "❌ Error al registrar. Intenta de nuevo.";
  });
}

function handleConfirmar() {
  const email = document.getElementById("signup-email").value.trim();
  const msgEl = document.getElementById("nm-msg-b");

  if (!email) {
    msgEl.style.color = "#8899aa";
    msgEl.textContent = "Ingresa tu correo para confirmar";
    return;
  }
  msgEl.style.color = "#2db87e";
  msgEl.textContent = "✅ ¡Todo listo! Eres parte de Engineering Eyes.";
  setTimeout(() => closeLogin(), 1800);
}

/* Shake de error */
function nmShake() {
  if (typeof gsap !== "undefined") {
    gsap.to(".nm-card", {
      x: -9, duration: 0.07, repeat: 5, yoyo: true, ease: "power1.inOut",
      onComplete: () => gsap.set(".nm-card", { x: 0 })
    });
  }
}

/* Enter en inputs dispara el submit correspondiente */
document.getElementById("signin-email").addEventListener("keydown", e => {
  if (e.key === "Enter") handleRegistrar();
});
document.getElementById("signup-email").addEventListener("keydown", e => {
  if (e.key === "Enter") handleConfirmar();
});