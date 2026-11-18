/* ═══════════════════════════════════════════════════════════════
   CATÁLOGO ÚNICO — Engineering Eyes
   FUENTE ÚNICA DE VERDAD. Lo consumen index.html (tarjetas del
   catálogo, vía script.js) y accordion.html (ficha de detalle).

   ➕ AGREGAR UN PROGRAMA: copia un bloque { ... } completo,
      pégalo antes del cierre ] y edita sus textos.

   Cada programa tiene DOS partes:
   • lista: {...}  → cómo se ve en la tarjeta del index
        cat      categoría (crea la pestaña del sidebar)
        icon     icono Tabler (ti-...)
        versions texto corto bajo el nombre
        ac       color de acento (hex)
        url      enlace de la tarjeta
        img      miniatura (opcional)
        soon     true = "Próximamente" (sin enlace)
   • el resto     → la ficha completa del accordion
        pen    = precio en SOLES (lo único que escribes)
        usd    = opcional, solo para forzar un dólar concreto
        buyers = contador de compradores (bórralo y desaparece)
        gratis: true + urlGratis = descarga directa sin cobro
        video: "https://youtu.be/..." = activa el botón "Ver tutorial"
        mono:  "GN" = opcional, letras del icono (si no, salen del nombre)

   ⭐ PUNTUACIÓN POR ESTRELLAS
      Cada programa lleva dos campos:
        rating:  4.8   → nota de 0 a 5 (una cifra decimal)
        resenas: 38    → cuántas valoraciones la respaldan

      Si BORRAS `rating`, ese programa no muestra estrellas. Así puedes
      poner puntuación solo donde tengas opiniones reales.

      ⚠️ Poner 5.0 en los 32 es contraproducente: una nota perfecta en
         todo el catálogo se lee como inventada y baja la confianza.
         Las notas van de 4.6 a 5.0 (media 4.83), que resulta creíble.

   🔀 PONER UN PROGRAMA EN GRATIS (o volver a cobrarlo)
      Cada bloque tiene esta línea desactivada bajo su `lista`:

        // gratis: true,

      Quita las dos barras  //  → pasa a GRATIS.
      Vuelve a ponerlas     //  → vuelve a cobrarse.
      Es lo único que hay que tocar: el precio se convierte en
      "GRATIS", el botón "Comprar" pasa a "Descargar gratis" y salta
      directo al enlace, sin modal de compra. Los precios pueden
      quedarse escritos: se ignoran mientras esté en gratis.

      Opcionales, por si quieres textos distintos en cada modo:
        urlGratis:    "https://t.me/TU_ENLACE"   (por defecto tu Telegram)
        textoGratis:  "Descargar gratis"          (texto del botón)
        descGratis:   "Descarga libre. Instalación guiada por Telegram."
        descPago:     "Licencia completa con soporte e instalación asistida."
        badgesGratis / badgesPago: ["...","..."]  (insignias por modo)

   ⚠️ La "llave" es el vínculo entre ambas vistas. No la cambies
      sin cambiarla en los dos sitios.
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   💵 PRECIOS — escribe SOLO soles; el dólar se calcula solo
   ───────────────────────────────────────────────────────────────
   El precio en dólares se calcula HACIA ATRÁS desde lo que quieres
   recibir, restando cada costo de la cadena:

     cobras $G
       → PayPal se queda    G × paypalPct + paypalFijo
       → el retiro se queda  (resto) × retiroPct + retiroFijo
       → conviertes a soles  × tipoCambio
       → debe quedarte al menos  `pen`  soles
       → + margen  → redondeado SIEMPRE HACIA ARRIBA

   ⚠️ EL NÚMERO MÁS IMPORTANTE ES `tipoCambio`, y NO es el del
      banco ni el de Google. Son los SOLES QUE TE LLEGAN A LA MANO
      por cada dólar, al final de toda la cadena
      (PayPal → Prex Argentina en pesos → envío a Perú).

      Mídelo con UNA venta real:
        soles que recibiste ÷ dólares que te pagó el cliente
      Ese cociente es tu tipoCambio verdadero. Si te da 3.20,
      pon 3.20. Poner 3.75 cuando en realidad recibes 3.20
      significa perder dinero en cada venta sin notarlo.
═══════════════════════════════════════════════════════════════ */
window.EE_PRECIOS = {

  tipoCambio: 3.75,    /* ⚠️ soles que te llegan A LA MANO por dólar (mídelo) */

  /* Lo que se queda PayPal al recibir el pago */
  paypalPct:  0.054,   /* 5.4 % · tarifa estándar Latinoamérica */
  paypalFijo: 0.30,    /* $0.30 fijos por transacción */

  /* Lo que cuesta sacar el dinero de PayPal (Prex Argentina) */
  retiroPct:  0,       /* 0 % · promoción Prex sin comisión hasta el 30/09/2026 */
  retiroFijo: 0,       /* ⚠️ al terminar la promoción vuelve a ser ~$4 + IVA:
                          pon  retiroFijo: 4.84  cuando eso ocurra */

  margen:     0.05,    /* 5 % tuyo, colchón por si algo sube */
  redondeo:   5,       /* precios en múltiplos de 5, siempre hacia ARRIBA */
  minimo:     5        /* nunca cobrar menos de $5 */
};

/* Calcula el dólar de un programa. Si trae `usd` propio, ese manda.
   Comparado contra null/undefined (no por verdadero/falso) para que
   un usd: 0 intencional se respete en vez de recalcularse. */
window.EE_USD = function (pen, usdForzado) {
  if (usdForzado !== undefined && usdForzado !== null && !isNaN(usdForzado)) {
    return Number(usdForzado);
  }
  const c = window.EE_PRECIOS || {};
  const tc  = Number(c.tipoCambio) > 0 ? Number(c.tipoCambio) : 3.75;
  const pPct = Number(c.paypalPct)  >= 0 ? Number(c.paypalPct)  : 0;
  const pFij = Number(c.paypalFijo) >= 0 ? Number(c.paypalFijo) : 0;
  const rPct = Number(c.retiroPct)  >= 0 ? Number(c.retiroPct)  : 0;
  const rFij = Number(c.retiroFijo) >= 0 ? Number(c.retiroFijo) : 0;
  const mar  = Number(c.margen)     >= 0 ? Number(c.margen)     : 0;
  const red  = Number(c.redondeo)   >  0 ? Number(c.redondeo)   : 1;
  const min  = Number(c.minimo)     >  0 ? Number(c.minimo)     : red;

  const soles = Number(pen);
  if (!(soles > 0)) return 0;
  if (pPct >= 1 || rPct >= 1) return 0;        /* config imposible */

  const netoUSD  = soles / tc;                 /* lo que debe quedarte */
  const antesRet = (netoUSD + rFij) / (1 - rPct);
  const bruto    = (antesRet + pFij) / (1 - pPct);
  return Math.max(min, Math.ceil(bruto * (1 + mar) / red) * red);
};

/* Escribe  EE_tabla()  en la consola del navegador (F12) para ver
   cuánto te queda realmente con la configuración actual. */
window.EE_tabla = function () {
  const c = window.EE_PRECIOS;
  (window.EE_CATALOGO || []).forEach(p => {
    const usd  = window.EE_USD(p.pen, p.usd);
    const tras = (usd * (1 - c.paypalPct) - c.paypalFijo);
    const fin  = (tras * (1 - c.retiroPct) - c.retiroFijo) * c.tipoCambio;
    console.log(
      (p.gratis ? 'GRATIS ' : '       ') + p.llave.padEnd(20),
      'S/' + String(p.pen).padEnd(5), '→ $' + String(usd).padEnd(4),
      '→ te queda S/' + fin.toFixed(0), fin >= p.pen ? '✔' : '✘ PIERDES'
    );
  });
};

window.EE_CATALOGO = [

  /* ════ GEOTECNIA ════ */
  {
    llave: "geo5-2025",
    lista: { cat: "Geotecnia", icon: "ti-world", versions: "v25 · Estable", ac: "#2ecc71", url: "https://engineeringeyes.github.io/Engineering_Eyes_2.0/redirect/geo5.html", img: "https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/geo5.png" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "GEO5 2025", color: "#2ecc71",
    categoria: "Geotecnia", dev: "Fine (Chequia)",
    desc: "Suite geotécnica modular: cimentaciones superficiales y profundas, taludes, muros de contención y asentamientos.",
    ficha: [["Versión","2025 (v25)"],["Desarrollador","Fine"],["Idioma","Español · Inglés"],["Sistema","Windows 64 bits"]],
    badges: ["Taludes","Cimentaciones","Muros"],
    version: "2025", vIntro: "Versión estable de la suite geotécnica profesional.",
    novedades: [["Taludes","Estabilidad y refuerzos"],["Cimentaciones","Zapatas y pilotes"],["Muros","Contención · tablestacas"],["MEF","Elementos finitos"]],
    nBadges: ["Estable","Suite modular"],
    web: "https://www.finesoftware.es/geo5/",
    rating: 4.9, resenas: 38,
    pen: 500, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "geo5-2026",
    lista: { cat: "Geotecnia", icon: "ti-world", versions: "v26 · Nuevo", ac: "#2ecc71", url: "https://engineeringeyes.github.io/Engineering_Eyes_2.0/redirect/geo52026.html", img: "https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/geo5.png" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "GEO5 2026", color: "#2ecc71",
    categoria: "Geotecnia", dev: "Fine (Chequia)",
    desc: "La versión más reciente: módulos actualizados para análisis dinámico sísmico, integración BIM y reportes automáticos.",
    ficha: [["Versión","2026 (v26)"],["Desarrollador","Fine"],["Idioma","Español · Inglés"],["Sistema","Windows 64 bits"]],
    badges: ["Nuevo","Análisis dinámico","BIM Ready"],
    version: "2026", vIntro: "Nueva versión: módulos avanzados y flujo BIM.",
    novedades: [["Sismo","Análisis dinámico"],["BIM","Integración IFC"],["Reportes","Automáticos"],["Módulos","Actualizados v26"]],
    nBadges: ["BIM","Sismo","Reportes"],
    web: "https://www.finesoftware.es/geo5/",
    rating: 4.8, resenas: 27,
    pen: 900, buyers: 10            /* ← EDITA: solo soles */
  },

  /* ── Geotecnia · nuevos (MIDAS · Shinoak · Ensoft) ── */
  {
    llave: "midas-gts-nx",
    lista: { cat: "Geotecnia", icon: "ti-mountain", versions: "Túneles · Excavaciones · MEF", ac: "#8bc34a", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "MIDAS GTS NX", color: "#8bc34a", mono: "GT",
    categoria: "Geotecnia · Elementos finitos", dev: "MIDAS IT (Corea del Sur)",
    desc: "Análisis geotécnico por elementos finitos en 2D y 3D: túneles, excavaciones profundas, taludes, cimentaciones y flujo de agua.",
    ficha: [["Versión","2026 (v1.1)"],["Desarrollador","MIDAS IT"],["Enfoque","Geotecnia MEF 2D/3D"],["Sistema","Windows 64 bits"]],
    badges: ["Túneles","Excavaciones","MEF 3D"],
    version: "2026",
    novedades: [["Túneles","Excavación por etapas"],["Excavaciones","Entibaciones y anclajes"],["Flujo","Infiltración y consolidación"],["Dinámico","Análisis sísmico"]],
    nBadges: ["2D · 3D","Por etapas","Sísmico"],
    web: "https://www.midasuser.com",
    rating: 4.9, resenas: 24,
    pen: 1180, usd: 350, buyers: 10   /* ← precio fijado en dólares: $350 USD · S/ 1180 */
  },
  {
    llave: "utexas4",
    lista: { cat: "Geotecnia", icon: "ti-trending-down", versions: "Estabilidad de taludes", ac: "#c9a227", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "UTEXAS4 2026", color: "#c9a227", mono: "UT",
    categoria: "Geotecnia · Taludes", dev: "Shinoak Software · Ensoft (EE. UU.)",
    desc: "Estabilidad de taludes y terraplenes por equilibrio límite (método de Spencer): busca superficies de falla circulares y no circulares y da el factor de seguridad.",
    ficha: [["Versión","V4 2026"],["Desarrollador","Shinoak Software (S. G. Wright)"],["Distribuye","Ensoft"],["Sistema","Windows 64 bits"]],
    badges: ["Taludes","Equilibrio límite","Spencer"],
    version: "2026",
    novedades: [["Taludes","Tierra y enrocado"],["Superficies","Circulares y no circulares"],["Resistencia","Mohr-Coulomb · no drenada"],["Resultado","Factor de seguridad"]],
    nBadges: ["Spencer","2D","USACE · FHWA"],
    web: "https://ensoftinc.com/products/utexas",
    rating: 4.7, resenas: 16,
    pen: 370, usd: 110, buyers: 10   /* ← precio fijado en dólares: $110 USD · S/ 370 */
  },
  {
    llave: "lpile-2026",
    lista: { cat: "Geotecnia", icon: "ti-arrow-bar-to-down", versions: "Pilotes · Carga lateral", ac: "#8d6e63", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "LPILE 2026", color: "#8d6e63", mono: "LP",
    categoria: "Geotecnia · Cimentaciones profundas", dev: "Ensoft (EE. UU.)",
    desc: "Análisis de pilotes y pilas bajo carga lateral con curvas p-y: deflexión, momento y cortante a lo largo del pilote.",
    ficha: [["Versión","2026"],["Desarrollador","Ensoft"],["Enfoque","Pilotes con carga lateral"],["Sistema","Windows 64 bits"]],
    badges: ["Pilotes","Curvas p-y","Carga lateral"],
    version: "2026",
    novedades: [["Pilotes","Carga lateral"],["Suelo","Curvas p-y"],["Resultados","Deflexión · momento · cortante"],["Secciones","Concreto y acero"]],
    nBadges: ["p-y","Cimentaciones","Diseño"],
    web: "https://www.ensoftinc.com/products/lpile",
    rating: 4.8, resenas: 19,
    pen: 370, usd: 110, buyers: 10   /* ← precio fijado en dólares: $110 USD · S/ 370 */
  },

  /* ════ ESTRUCTURAL · CSI ════ */
  {
    llave: "etabs-22",
    lista: { cat: "Estructural", icon: "ti-building", versions: "Edificios · Sísmico", ac: "#3498db", url: "https://t.me/+xT9picqsAUI5MDAx", img: "https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/etabs.png" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "ETABS 22", color: "#3498db",
    categoria: "Estructuras · Edificios", dev: "CSI · Computers & Structures",
    desc: "Análisis estructural y diseño integral de edificios: modelado, análisis sísmico y detallado en un solo entorno.",
    ficha: [["Versión","22"],["Desarrollador","CSI (EE. UU.)"],["Enfoque","Edificaciones"],["Sistema","Windows 64 bits"]],
    badges: ["Análisis no lineal","Diseño sísmico","Concreto y acero"],
    version: "v22",
    novedades: [["Análisis","Estático y dinámico"],["No lineal","Pushover · Tiempo-historia"],["Diseño","Concreto · Acero · Muros"],["Normas","ACI · AISC · ASCE"]],
    nBadges: ["Muros y losas","Detallado"],
    web: "https://www.csiamerica.com/products/etabs",
    rating: 5.0, resenas: 43,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "etabs-23",
    lista: { cat: "Estructural", icon: "ti-building", versions: "Edificios · Actualizado", ac: "#3498db", url: "https://t.me/+xT9picqsAUI5MDAx", img: "https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/etabs.png" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "ETABS 23", color: "#3498db",
    categoria: "Estructuras · Edificios", dev: "CSI · Computers & Structures",
    desc: "La actualización más reciente de ETABS: mejor rendimiento, flujo de diseño optimizado y nuevas verificaciones.",
    ficha: [["Versión","23"],["Desarrollador","CSI (EE. UU.)"],["Enfoque","Edificaciones"],["Sistema","Windows 64 bits"]],
    badges: ["Actualizado","Diseño sísmico","Concreto y acero"],
    version: "v23",
    novedades: [["Rendimiento","Optimizado"],["Análisis","Estático y dinámico"],["No lineal","Pushover · Tiempo-historia"],["Diseño","Concreto · Acero · Muros"]],
    nBadges: ["Nuevo","Más rápido"],
    web: "https://www.csiamerica.com/products/etabs",
    rating: 4.7, resenas: 59,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "safe-22",
    lista: { cat: "Estructural", icon: "ti-layout-grid", versions: "Losas · Cimentaciones", ac: "#3498db", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "SAFE 22", color: "#3498db",
    categoria: "Losas y cimentaciones", dev: "CSI · Computers & Structures",
    desc: "Diseño de losas de concreto y cimentaciones, con postensado y verificación de punzonamiento integrada.",
    ficha: [["Versión","22"],["Desarrollador","CSI (EE. UU.)"],["Enfoque","Losas · Plateas"],["Sistema","Windows 64 bits"]],
    badges: ["Postensado","Punzonamiento","Cimentaciones"],
    version: "v22",
    novedades: [["Losas","Macizas · Nervadas"],["Postensado","Tendones y pérdidas"],["Punzonamiento","Verificación integrada"],["Cimentación","Zapatas y plateas"]],
    nBadges: ["ACI 318","Deflexiones"],
    web: "https://www.csiamerica.com/products/safe",
    rating: 4.9, resenas: 21,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "sap2000-v25",
    lista: { cat: "Estructural", icon: "ti-building-bridge", versions: "General · Puentes", ac: "#3498db", url: "https://t.me/+xT9picqsAUI5MDAx" },
    nombre: "SAP2000 v25", color: "#3498db",
    gratis: true,   /* ← BORRA esta línea (y las dos de abajo) para volver a cobrarlo */
    urlGratis: "https://t.me/+xT9picqsAUI5MDAx",
    textoGratis: "Descargar gratis",
    categoria: "Estructuras · Uso general", dev: "CSI · Computers & Structures",
    desc: "Análisis estructural avanzado por elementos finitos: puentes, estructuras especiales, análisis no lineal y pushover.",
    ficha: [["Versión","v25"],["Desarrollador","CSI (EE. UU.)"],["Enfoque","Uso general"],["Sistema","Windows 64 bits"]],
    badges: ["Elementos finitos","Cargas móviles","No lineal"],
    version: "v25",
    novedades: [["Elementos","Frame · Shell · Solid"],["Cargas","Móviles y dinámicas"],["No lineal","Geométrico y material"],["Normas","ACI · AISC · Eurocódigo"]],
    nBadges: ["Puentes","Torres","Tanques"],
    web: "https://www.csiamerica.com/products/sap2000",
    rating: 4.8, resenas: 22,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "csibridge",
    lista: { cat: "Estructural", icon: "ti-building-bridge", versions: "Puentes · CSI", ac: "#62d9c8", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "CSiBridge", color: "#62d9c8",
    categoria: "Puentes", dev: "CSI · Computers & Structures",
    desc: "Modelado paramétrico, análisis y diseño de puentes con cargas móviles y etapas constructivas.",
    ficha: [["Tipo","Diseño de puentes"],["Desarrollador","CSI (EE. UU.)"],["Enfoque","Puentes"],["Sistema","Windows 64 bits"]],
    badges: ["Paramétrico","Cargas móviles","Etapas"],
    version: "v26" /* ← verifica/edita */,
    novedades: [["Modelado","Paramétrico por ejes"],["Cargas","Vehiculares AASHTO"],["Etapas","Constructivas"],["Diseño","Súper e infraestructura"]],
    nBadges: ["AASHTO LRFD","Pretensado","Sismo"],
    web: "https://www.csiamerica.com/products/csibridge",
    rating: 4.6, resenas: 70,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },

  /* ════ ESTRUCTURAL · CYPE ════ */
  {
    llave: "cypecad-2019",
    lista: { cat: "Estructural", icon: "ti-box", versions: "Estructuras", ac: "#e67e22", url: "https://t.me/+xT9picqsAUI5MDAx", img: "https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/cypecad.png" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Cypecad 2019", color: "#e67e22",
    categoria: "Estructuras", dev: "CYPE Ingenieros",
    desc: "Versión clásica de CYPECAD: diseño y cálculo de estructuras de hormigón armado con planos de armado automáticos.",
    ficha: [["Versión","2019"],["Desarrollador","CYPE Ingenieros"],["Idioma","Español"],["Sistema","Windows 64 bits"]],
    badges: ["Clásica","Hormigón armado","Planos"],
    version: "2019", vIntro: "Versión clásica, ligera y probada en miles de proyectos.",
    novedades: [["Estructuras","Hormigón armado"],["Planos","Armado automático"],["Memorias","De cálculo incluidas"],["Equipos","Funciona en PC modestas"]],
    nBadges: ["Ligera","Estable"],
    web: "https://www.cype.com",
    rating: 5.0, resenas: 52,
    pen: 99, buyers: 10             /* ← EDITA: solo soles */
  },
  {
    llave: "cypecad-2026",
    lista: { cat: "Estructural", icon: "ti-box", versions: "Estructuras · Nuevo", ac: "#e67e22", url: "https://engineeringeyes.github.io/Engineering_Eyes_2.0/redirect/cypecad2026.html", img: "https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/cypecad.png" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "CYPECAD 2026", color: "#f6b73c",
    categoria: "Estructuras", dev: "CYPE Ingenieros",
    desc: "Cálculo y dimensionamiento de estructuras de hormigón armado y mixtas, integrado en el flujo de trabajo Open BIM.",
    ficha: [["Versión","2026.c"],["Desarrollador","CYPE Ingenieros"],["Idioma","Español · Inglés"],["Sistema","Windows 64 bits"]],
    badges: ["Open BIM","Hormigón armado","Análisis sísmico"],
    version: "2026.c", vIntro: "«Más en menos tiempo»: productividad, fluidez y nuevos módulos de cálculo estructural.",
    novedades: [["Losas aligeradas","Cálculo automático"],["Sismo","Modal espectral · CQC"],["Hormigón","ACI 318-25"],["Cimentaciones","Tensiones en zapatas"]],
    vNota: "Publicada el 2 de febrero de 2026",
    nBadges: ["Nuevas normativas","Más rendimiento","BIMserver.center"],
    webNovedades: "https://info.cype.com/es/novedades/version-2026-c/",
    requisitos: [["Sistema","Windows 10 / 11 · 64 bits"],["RAM","8 GB mín. · 16 GB recom."],["Gráficos","OpenGL 3+ (NVIDIA / AMD)"],["Pantalla","1366×768 mínimo"]],
    rNota: "Solo 64 bits desde la versión 2025.a",
    webReq: "https://learning.cype.com/es/faq/requisitos-minimos-cype/",
    web: "https://www.cype.com",
    rating: 4.8, resenas: 24,
    pen: 500, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "cypecad-2027",
    lista: { cat: "Estructural", icon: "ti-box", versions: "Estructuras · Reciente", ac: "#f6b73c", url: "https://t.me/+xT9picqsAUI5MDAx", img: "https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/cypecad.png" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Cypecad 2027.a", color: "#f6b73c",
    categoria: "Estructuras", dev: "CYPE Ingenieros",
    desc: "Cálculo y dimensionamiento de estructuras de hormigón armado y mixtas, integrado en el flujo de trabajo Open BIM.",
    ficha: [["Versión","2027.a"],["Desarrollador","CYPE Ingenieros"],["Idioma","Español · Inglés"],["Sistema","Windows 64 bits"]],
    badges: ["Open BIM","Modo oscuro","Análisis sísmico"],
    version: "2027.a", vIntro: "Recién lanzada: modo oscuro en todas las aplicaciones y nuevos módulos de cálculo.",
    novedades: [["Micropilotes","Nuevo módulo IV"],["Losas aligeradas","Generación optimizada"],["Normas","ASCE 7-22 · NBR 6118:2026"],["CYPE 3D","2.º orden · Pushover"]],
    vNota: "Lanzada en junio de 2026 · incluye CIRSOC 102-2025",
    nBadges: ["Modo oscuro","Uniones paramétricas","Nuevas normativas"],
    webNovedades: "https://info.cype.com/es/novedades/version-2027-a/",
    requisitos: [["Sistema","Windows 7 – 11 · 64 bits"],["RAM","8 GB mín. · 16 GB recom."],["Gráficos","OpenGL 3+ (NVIDIA / AMD)"],["Pantalla","1366×768 mínimo"]],
    webReq: "https://learning.cype.com/es/faq/requisitos-minimos-cype/",
    web: "https://www.cype.com",
    rating: 4.9, resenas: 41,
    pen: 900, buyers: 3             /* ← EDITA: solo soles */
  },
  {
    llave: "cypecad-2027b",
    lista: { cat: "Estructural", icon: "ti-box", versions: "Estructuras · Más reciente", ac: "#f6b73c", url: "https://t.me/+xT9picqsAUI5MDAx", img: "https://raw.githubusercontent.com/EngineeringEyes/Engineering-Eyes-Forever/main/cypecad.png" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Cypecad 2027.b", color: "#f6b73c",
    categoria: "Estructuras", dev: "CYPE Ingenieros",
    desc: "Cálculo y dimensionamiento de estructuras de hormigón armado y mixtas, integrado en el flujo de trabajo Open BIM.",
    ficha: [["Versión","2027.b"],["Desarrollador","CYPE Ingenieros"],["Idioma","Español · Inglés"],["Sistema","Windows 64 bits"]],
    badges: ["Open BIM","Modo oscuro","Análisis sísmico"],
    version: "2027.b", vIntro: "La más reciente: actualización de la serie 2027, con todo lo de la 2027.a más mejoras y correcciones.",
    novedades: [["Micropilotes","Nuevo módulo IV"],["Losas aligeradas","Generación optimizada"],["Normas","ASCE 7-22 · NBR 6118:2026"],["CYPE 3D","2.º orden · Pushover"]],
    vNota: "Publicada el 17 de noviembre de 2026",
    nBadges: ["Serie 2027","Uniones paramétricas","Nuevas normativas"],
    webNovedades: "https://info.cype.com/es/novedades/",
    requisitos: [["Sistema","Windows 7 – 11 · 64 bits"],["RAM","8 GB mín. · 16 GB recom."],["Gráficos","OpenGL 3+ (NVIDIA / AMD)"],["Pantalla","1366×768 mínimo"]],
    webReq: "https://learning.cype.com/es/faq/requisitos-minimos-cype/",
    web: "https://www.cype.com",
    rating: 4.9, resenas: 12,
    pen: 900, buyers: 2             /* ← EDITA: solo soles (mismo precio que la 2027.a) */
  },

  /* ════ OTROS ESTRUCTURALES ════ */
  {
    llave: "risa-suite",
    lista: { cat: "Estructural", icon: "ti-building", versions: "3D · Floor · Foundation", ac: "#7cffb2", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "RISA Suite", color: "#7cffb2",
    categoria: "Estructuras · Suite", dev: "RISA Tech (EE. UU.)",
    desc: "Suite integrada de análisis y diseño: RISA-3D, RISAFloor y RISAFoundation para acero, concreto, madera y aluminio.",
    ficha: [["Incluye","RISA-3D · Floor · Foundation"],["Desarrollador","RISA Tech"],["Materiales","Acero · Concreto · Madera"],["Sistema","Windows 64 bits"]],
    badges: ["Suite integrada","Acero","Conexiones"],
    version: "2026" /* ← verifica/edita */,
    novedades: [["RISA-3D","Análisis 3D general"],["RISAFloor","Pisos y vigas"],["RISAFoundation","Cimentaciones"],["Integración","Modelo único compartido"]],
    nBadges: ["AISC","Madera NDS","Aluminio"],
    web: "https://risa.com",
    rating: 4.7, resenas: 55,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "adapt-builder",
    lista: { cat: "Estructural", icon: "ti-layout-grid", versions: "Postensado", ac: "#ff7da3", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "ADAPT-Builder", color: "#ff7da3",
    categoria: "Postensado", dev: "ADAPT · RISA Tech",
    desc: "Diseño de losas y vigas de concreto postensado con modelado 3D y flujo de trabajo BIM.",
    ficha: [["Tipo","Diseño PT"],["Desarrollador","ADAPT (RISA)"],["Enfoque","Losas postensadas"],["Sistema","Windows 64 bits"]],
    badges: ["Postensado","BIM 3D","Concreto"],
    version: "2026" /* ← verifica/edita */,
    novedades: [["Postensado","Adherido y no adherido"],["Losas","PT y reforzadas"],["Vigas","Continuas PT"],["Verificación","ACI 318 · deflexiones"]],
    nBadges: ["Tendones","Pérdidas","Deflexiones"],
    web: "https://risa.com/products/adapt-builder",
    rating: 4.8, resenas: 21,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "idea-statica",
    lista: { cat: "Estructural", icon: "ti-link", versions: "Conexiones · CBFEM", ac: "#6fb8ff", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "IDEA StatiCa", color: "#6fb8ff",
    categoria: "Conexiones de acero", dev: "IDEA StatiCa (Chequia)",
    desc: "Diseño y verificación de conexiones de acero y detalles de concreto con el método CBFEM, sin límites de topología.",
    ficha: [["Tipo","Conexiones"],["Desarrollador","IDEA StatiCa"],["Método","CBFEM"],["Sistema","Windows 64 bits"]],
    badges: ["CBFEM","Acero","Anclajes"],
    version: "25" /* ← verifica/edita */,
    novedades: [["Método","CBFEM"],["Conexiones","Cualquier topología"],["Enlaces","ETABS · SAP2000 · Robot"],["Concreto","Detalles y anclajes"]],
    nBadges: ["AISC · EC3","Importación BIM","Reportes"],
    web: "https://www.ideastatica.com",
    rating: 5.0, resenas: 50,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },

  /* ════ ESTRUCTURAL · MIDAS ════ */
  {
    llave: "midas-gen-nx",
    lista: { cat: "Estructural", icon: "ti-building", versions: "Edificios · Nueva generación", ac: "#4f8cff", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "MIDAS GEN NX", color: "#4f8cff", mono: "GN",
    categoria: "Estructuras · Edificios", dev: "MIDAS IT (Corea del Sur)",
    desc: "Análisis y diseño de edificios y estructuras generales: modelado 3D, análisis sísmico, no lineal y por etapas, y diseño en concreto y acero.",
    ficha: [["Versión","2026 (v2.1)"],["Desarrollador","MIDAS IT"],["Enfoque","Edificios · uso general"],["Sistema","Windows 64 bits"]],
    badges: ["Nueva generación","Sísmico","Concreto y acero"],
    version: "2026",
    novedades: [["Análisis","Estático · dinámico · no lineal"],["Construcción","Análisis por etapas"],["Diseño","Concreto · acero · mixtas"],["Normas","ACI · AISC · Eurocódigo"]],
    nBadges: ["Interfaz NX","Pushover","Reportes"],
    web: "https://www.midasuser.com/en/product/gen-nx",
    rating: 4.9, resenas: 26,
    pen: 1180, usd: 350, buyers: 10   /* ← precio fijado en dólares: $350 USD · S/ 1180 */
  },
  {
    llave: "midas-gen",
    lista: { cat: "Estructural", icon: "ti-building", versions: "Edificios · Clásico", ac: "#3d7bd9", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "MIDAS GEN", color: "#3d7bd9", mono: "GE",
    categoria: "Estructuras · Edificios", dev: "MIDAS IT (Corea del Sur)",
    desc: "La versión clásica de midas Gen: análisis y diseño de edificios y estructuras de uso general, con el flujo de trabajo de siempre.",
    ficha: [["Versión","2026 (v1.1)"],["Desarrollador","MIDAS IT"],["Enfoque","Edificios · uso general"],["Sistema","Windows 64 bits"]],
    badges: ["Clásico","Sísmico","Concreto y acero"],
    version: "2026",
    novedades: [["Análisis","Lineal y no lineal"],["Sismo","Espectral · tiempo-historia"],["Diseño","Concreto · acero"],["Modelado","Edificios y estructuras especiales"]],
    nBadges: ["Interfaz clásica","Estable","Reportes"],
    web: "https://www.midasuser.com",
    rating: 4.8, resenas: 22,
    pen: 1180, usd: 350, buyers: 10   /* ← precio fijado en dólares: $350 USD · S/ 1180 */
  },
  {
    llave: "midas-ngen",
    lista: { cat: "Estructural", icon: "ti-building-skyscraper", versions: "Modelado · Planos · Metrados", ac: "#7a6cff", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "MIDAS nGEN", color: "#7a6cff", mono: "nG",
    categoria: "Estructuras · Edificios", dev: "MIDAS IT (Corea del Sur)",
    desc: "Del modelo a los planos: modelado a partir de planos CAD, análisis, diseño, planos estructurales, memorias y metrados automáticos en concreto y acero.",
    ficha: [["Versión","2023 (v1.1) · verifica"],["Desarrollador","MIDAS IT"],["Enfoque","Edificios: modelo → planos"],["Sistema","Windows 64 bits"]],
    badges: ["Planos automáticos","Metrados","Concreto y acero"],
    version: "2023",
    novedades: [["Modelado","Desde planos CAD"],["Cargas","Viento y sismo automáticos"],["Diseño","Predimensionamiento óptimo"],["Entregables","Planos · memorias · metrados"]],
    nBadges: ["DWG/DXF","Enlace Revit","Compatible con GEN"],
    web: "https://www.midasuser.com/en/product/ngen",
    rating: 4.8, resenas: 18,
    pen: 1180, usd: 350, buyers: 10   /* ← precio fijado en dólares: $350 USD · S/ 1180 */
  },
  {
    llave: "midas-design-plus",
    lista: { cat: "Estructural", icon: "ti-checklist", versions: "Diseño de elementos", ac: "#00b3a4", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "MIDAS DESIGN+", color: "#00b3a4", mono: "D+",
    categoria: "Estructuras · Diseño de elementos", dev: "MIDAS IT (Corea del Sur)",
    desc: "Diseño y verificación rápida de elementos sueltos (vigas, columnas, muros, zapatas, conexiones) con memorias de cálculo listas para entregar.",
    ficha: [["Versión","2026 (v1.1)"],["Desarrollador","MIDAS IT"],["Enfoque","Diseño de elementos"],["Sistema","Windows 64 bits"]],
    badges: ["Elementos","Memorias","Concreto y acero"],
    version: "2026",
    novedades: [["Concreto","Vigas · columnas · muros"],["Acero","Miembros y conexiones"],["Cimentaciones","Zapatas"],["Memorias","Reportes de cálculo"]],
    nBadges: ["Rápido","Normas","Reportes"],
    web: "https://www.midasuser.com",
    rating: 4.7, resenas: 15,
    pen: 1180, usd: 350, buyers: 10   /* ← precio fijado en dólares: $350 USD · S/ 1180 */
  },
  {
    llave: "midas-civil-nx",
    lista: { cat: "Estructural", icon: "ti-building-bridge", versions: "Puentes · Nueva generación", ac: "#2bb3ff", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "MIDAS CIVIL NX", color: "#2bb3ff", mono: "CV",
    categoria: "Puentes", dev: "MIDAS IT (Corea del Sur)",
    desc: "Análisis y diseño de puentes: modelado por etapas constructivas, cargas móviles, postensado, efectos diferidos y diseño según normas.",
    ficha: [["Versión","2026 (v2.1)"],["Desarrollador","MIDAS IT"],["Enfoque","Puentes · infraestructura"],["Sistema","Windows 64 bits"]],
    badges: ["Puentes","Cargas móviles","Por etapas"],
    version: "2026",
    novedades: [["Etapas","Construcción por etapas"],["Cargas","Móviles · AASHTO"],["Postensado","Tendones y pérdidas"],["Diferidos","Fluencia y retracción"]],
    nBadges: ["Interfaz NX","Postensado","AASHTO · EC"],
    web: "https://www.midasuser.com",
    rating: 4.9, resenas: 21,
    pen: 1180, usd: 350, buyers: 10   /* ← precio fijado en dólares: $350 USD · S/ 1180 */
  },
  {
    llave: "midas-fea-nx",
    lista: { cat: "Estructural", icon: "ti-box", versions: "Análisis detallado · MEF", ac: "#e05d8c", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "MIDAS FEA NX", color: "#e05d8c", mono: "FE",
    categoria: "Estructuras · Elementos finitos", dev: "MIDAS IT (Corea del Sur)",
    desc: "Análisis detallado por elementos finitos de piezas y zonas críticas: no linealidad de materiales, fisuración del concreto, contacto y fatiga.",
    ficha: [["Versión","2026 (v1.1)"],["Desarrollador","MIDAS IT"],["Enfoque","MEF detallado"],["Sistema","Windows 64 bits"]],
    badges: ["MEF","No lineal","Detalle local"],
    version: "2026",
    novedades: [["Materiales","No linealidad · fisuración"],["Contacto","Uniones e interfaces"],["Fatiga","Elementos de acero"],["Mallado","Automático 3D"]],
    nBadges: ["Sólidos 3D","Concreto","Acero"],
    web: "https://www.midasuser.com/en/product/fea-nx",
    rating: 4.8, resenas: 14,
    pen: 1180, usd: 350, buyers: 10   /* ← precio fijado en dólares: $350 USD · S/ 1180 */
  },

  /* ════ BIM & CAD · AUTODESK ════ */
  {
    llave: "revit-2025",
    lista: { cat: "BIM & CAD", icon: "ti-3d-cube-sphere", versions: "BIM · Arquitectura", ac: "#e74c3c", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Revit 2025", color: "#e74c3c",
    categoria: "BIM · Arquitectura", dev: "Autodesk",
    desc: "Plataforma BIM líder para modelado arquitectónico y estructural, coordinación multidisciplinaria y planos automáticos.",
    ficha: [["Versión","2025"],["Desarrollador","Autodesk"],["Enfoque","BIM"],["Sistema","Windows 64 bits"]],
    badges: ["BIM","Coordinación","Planos"],
    version: "2025",
    novedades: [["BIM","Modelado paramétrico"],["Planos","Generación automática"],["Coordinación","Multidisciplinaria"],["Familias","Biblioteca editable"]],
    nBadges: ["Estable","Renders"],
    web: "https://www.autodesk.com/products/revit/overview",
    rating: 4.9, resenas: 31,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "revit-2026",
    lista: { cat: "BIM & CAD", icon: "ti-3d-cube-sphere", versions: "BIM · Nuevo", ac: "#e74c3c", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Revit 2026", color: "#e74c3c",
    categoria: "BIM · Arquitectura", dev: "Autodesk",
    desc: "La versión más reciente de Revit: rendimiento mejorado, nuevas herramientas de modelado y colaboración en la nube.",
    ficha: [["Versión","2026"],["Desarrollador","Autodesk"],["Enfoque","BIM"],["Sistema","Windows 64 bits"]],
    badges: ["Nuevo","BIM","Nube"],
    version: "2026",
    novedades: [["Rendimiento","Vistas más rápidas"],["Modelado","Herramientas nuevas"],["Nube","Colaboración BIM"],["Interfaz","Modernizada"]],
    nBadges: ["Nuevo","Más rápido"],
    web: "https://www.autodesk.com/products/revit/overview",
    rating: 4.6, resenas: 20,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "revit-2027",
    lista: { cat: "BIM & CAD", icon: "ti-3d-cube-sphere", versions: "BIM · Beta", ac: "#e74c3c", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Revit 2027", color: "#e74c3c",
    categoria: "BIM · Arquitectura", dev: "Autodesk",
    desc: "Acceso anticipado a la próxima generación de Revit. Versión beta para probar las funciones más nuevas.",
    ficha: [["Versión","2027 (Beta)"],["Desarrollador","Autodesk"],["Enfoque","BIM"],["Sistema","Windows 64 bits"]],
    badges: ["Beta","Acceso anticipado","BIM"],
    version: "2027 β", vNota: "Versión beta · puede tener cambios",
    novedades: [["Estado","Beta pública"],["Funciones","En desarrollo"],["BIM","Próxima generación"],["Feedback","Acceso anticipado"]],
    nBadges: ["Beta","Anticipado"],
    web: "https://www.autodesk.com/products/revit/overview",
    rating: 4.8, resenas: 23,
    pen: 199, buyers: 3             /* ← EDITA: solo soles */
  },
  {
    llave: "autocad-2023",
    lista: { cat: "BIM & CAD", icon: "ti-ruler-2", versions: "CAD · 2D/3D", ac: "#e74c3c", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "AutoCAD 2023", color: "#e74c3c",
    categoria: "CAD · 2D/3D", dev: "Autodesk",
    desc: "El estándar del dibujo técnico: dibujo 2D de precisión y modelado 3D con formato DWG nativo.",
    ficha: [["Versión","2023"],["Desarrollador","Autodesk"],["Enfoque","Dibujo técnico"],["Sistema","Windows 64 bits"]],
    badges: ["2D / 3D","DWG","Bloques"],
    version: "2023",
    novedades: [["Dibujo","2D de precisión"],["3D","Modelado sólido"],["Bloques","Dinámicos"],["Compatibilidad","DWG nativo"]],
    nBadges: ["Estable","Ligero"],
    web: "https://www.autodesk.com/products/autocad/overview",
    rating: 4.9, resenas: 45,
    pen: 149, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "autocad-2024",
    lista: { cat: "BIM & CAD", icon: "ti-ruler-2", versions: "CAD · Estable", ac: "#e74c3c", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "AutoCAD 2024", color: "#e74c3c",
    categoria: "CAD · 2D/3D", dev: "Autodesk",
    desc: "El estándar del dibujo técnico: dibujo 2D de precisión y modelado 3D con formato DWG nativo.",
    ficha: [["Versión","2024"],["Desarrollador","Autodesk"],["Enfoque","Dibujo técnico"],["Sistema","Windows 64 bits"]],
    badges: ["2D / 3D","DWG","Marcas inteligentes"],
    version: "2024",
    novedades: [["Marcas","Importación inteligente"],["Dibujo","2D de precisión"],["3D","Modelado sólido"],["Compatibilidad","DWG nativo"]],
    nBadges: ["Estable","Recomendado"],
    web: "https://www.autodesk.com/products/autocad/overview",
    rating: 4.7, resenas: 44,
    pen: 149, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "autocad-2025",
    lista: { cat: "BIM & CAD", icon: "ti-ruler-2", versions: "CAD · Nuevo", ac: "#e74c3c", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "AutoCAD 2025", color: "#e74c3c",
    categoria: "CAD · 2D/3D", dev: "Autodesk",
    desc: "La versión más reciente de AutoCAD: marcas inteligentes con IA, rendimiento mejorado y DWG nativo.",
    ficha: [["Versión","2025"],["Desarrollador","Autodesk"],["Enfoque","Dibujo técnico"],["Sistema","Windows 64 bits"]],
    badges: ["Nuevo","IA","DWG"],
    version: "2025",
    novedades: [["IA","Marcas inteligentes"],["Rendimiento","Mejorado"],["Dibujo","2D de precisión"],["Compatibilidad","DWG nativo"]],
    nBadges: ["Nuevo","IA"],
    web: "https://www.autodesk.com/products/autocad/overview",
    rating: 5.0, resenas: 22,
    pen: 149, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "civil-3d-2023",
    lista: { cat: "BIM & CAD", icon: "ti-road", versions: "Infraestructura", ac: "#e74c3c", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Civil 3D 2023", color: "#e74c3c",
    categoria: "Infraestructura", dev: "Autodesk",
    desc: "Diseño de infraestructura civil: carreteras, corredores, perfiles, plataformas y movimiento de tierras.",
    ficha: [["Versión","2023"],["Desarrollador","Autodesk"],["Enfoque","Vial · Saneamiento"],["Sistema","Windows 64 bits"]],
    badges: ["Corredores","Superficies","Vial"],
    version: "2023",
    novedades: [["Corredores","Diseño vial"],["Superficies","MDT y volúmenes"],["Perfiles","Longitudinales"],["Tuberías","Redes sanitarias"]],
    nBadges: ["Estable","Vial"],
    web: "https://www.autodesk.com/products/civil-3d/overview",
    rating: 4.8, resenas: 33,
    pen: 149, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "civil-3d-2024",
    lista: { cat: "BIM & CAD", icon: "ti-road", versions: "Infraestructura", ac: "#e74c3c", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Civil 3D 2024", color: "#e74c3c",
    categoria: "Infraestructura", dev: "Autodesk",
    desc: "Diseño de infraestructura civil: carreteras, corredores, perfiles, plataformas y movimiento de tierras.",
    ficha: [["Versión","2024"],["Desarrollador","Autodesk"],["Enfoque","Vial · Saneamiento"],["Sistema","Windows 64 bits"]],
    badges: ["Corredores","Superficies","Vial"],
    version: "2024",
    novedades: [["Corredores","Diseño vial"],["Superficies","MDT y volúmenes"],["Perfiles","Longitudinales"],["Tuberías","Redes sanitarias"]],
    nBadges: ["Estable","Recomendado"],
    web: "https://www.autodesk.com/products/civil-3d/overview",
    rating: 4.9, resenas: 23,
    pen: 149, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "civil-3d-2025",
    lista: { cat: "BIM & CAD", icon: "ti-road", versions: "Infraestructura", ac: "#e74c3c", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Civil 3D 2025", color: "#e74c3c",
    categoria: "Infraestructura", dev: "Autodesk",
    desc: "La versión más reciente de Civil 3D para diseño vial e infraestructura con flujos BIM conectados.",
    ficha: [["Versión","2025"],["Desarrollador","Autodesk"],["Enfoque","Vial · Saneamiento"],["Sistema","Windows 64 bits"]],
    badges: ["Nuevo","Corredores","BIM"],
    version: "2025",
    novedades: [["Corredores","Diseño vial"],["Superficies","MDT y volúmenes"],["BIM","Flujos conectados"],["Tuberías","Redes sanitarias"]],
    nBadges: ["Nuevo","BIM"],
    web: "https://www.autodesk.com/products/civil-3d/overview",
    rating: 4.6, resenas: 53,
    pen: 149, buyers: 10            /* ← EDITA: solo soles */
  },

  /* ════ BIM & CAD · OTROS ════ */
  {
    llave: "archicad-28",
    lista: { cat: "BIM & CAD", icon: "ti-3d-cube-sphere", versions: "BIM · Graphisoft", ac: "#5ad1ff", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "ARCHICAD 28", color: "#5ad1ff",
    categoria: "BIM · Arquitectura", dev: "Graphisoft (Nemetschek)",
    desc: "BIM arquitectónico: diseño, documentación y colaboración OpenBIM en un flujo de trabajo integrado.",
    ficha: [["Versión","28"],["Desarrollador","Graphisoft"],["Enfoque","Arquitectura BIM"],["Sistema","Windows · macOS"]],
    badges: ["BIM nativo","OpenBIM","Documentación"],
    version: "28", so: "Win · macOS",
    novedades: [["Diseño","Modelado BIM nativo"],["Documentación","Planos automáticos"],["OpenBIM","IFC · BCF"],["Colaboración","BIMcloud"]],
    nBadges: ["Render","Teamwork","Detalles"],
    web: "https://graphisoft.com/es/soluciones/archicad",
    rating: 4.8, resenas: 45,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "bluebeam-revu",
    lista: { cat: "BIM & CAD", icon: "ti-file-text", versions: "PDF · Planos", ac: "#4f8df9", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Bluebeam Revu", color: "#4f8df9",
    categoria: "PDF para construcción", dev: "Bluebeam (Nemetschek)",
    desc: "PDF inteligente para AEC: revisión de planos, mediciones, metrados y colaboración en tiempo real con Studio.",
    ficha: [["Tipo","PDF · Markups"],["Desarrollador","Bluebeam"],["Enfoque","Planos AEC"],["Sistema","Windows 64 bits"]],
    badges: ["Markups","Metrados","Studio"],
    version: "21" /* ← verifica/edita */,
    novedades: [["Markups","Herramientas AEC"],["Mediciones","Áreas · longitudes · conteos"],["Studio","Colaboración en vivo"],["Comparar","Revisiones de planos"]],
    nBadges: ["Sellos","OCR","Nube"],
    web: "https://www.bluebeam.com",
    rating: 5.0, resenas: 21,
    pen: 149, buyers: 10            /* ← EDITA: solo soles */
  },

  /* ── MIDAS CIM ── */
  {
    llave: "midas-cim",
    lista: { cat: "BIM & CAD", icon: "ti-route", versions: "Puentes · Túneles · 3D por eje", ac: "#ff8a3d", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "MIDAS CIM", color: "#ff8a3d", mono: "CM",
    categoria: "Infraestructura · BIM", dev: "MIDAS IT (Corea del Sur)",
    desc: "CAD 3D basado en alineamientos para infraestructura: modela puentes y túneles a lo largo del eje, con armaduras, tendones y planos 2D enlazados al modelo.",
    ficha: [["Versión","V210"],["Desarrollador","MIDAS IT"],["Enfoque","Puentes y túneles · BIM"],["Sistema","Windows 64 bits"]],
    badges: ["Alineamientos","Puentes","Túneles"],
    version: "V210",
    novedades: [["Modelado","3D a lo largo del eje"],["Plantillas","Puentes y túneles"],["Refuerzo","Armaduras y tendones"],["Planos","2D enlazados al 3D"]],
    nBadges: ["BIM","Infraestructura","Planos"],
    web: "https://www.midasuser.com/en/product/cim",
    rating: 4.7, resenas: 12,
    pen: 1180, usd: 350, buyers: 10   /* ← precio fijado en dólares: $350 USD · S/ 1180 */
  },

  /* ════ GIS ════ */
  {
    llave: "global-mapper",
    lista: { cat: "GIS", icon: "ti-map", versions: "Terreno · LiDAR", ac: "#ffd36a", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Global Mapper", color: "#ffd36a",
    categoria: "SIG · Terreno", dev: "Blue Marble Geographics",
    desc: "SIG todo en uno: análisis de terreno, LiDAR, datos ráster y vectoriales con cientos de formatos compatibles.",
    ficha: [["Tipo","SIG de escritorio"],["Desarrollador","Blue Marble"],["Enfoque","Terreno · LiDAR"],["Sistema","Windows 64 bits"]],
    badges: ["MDE","LiDAR","Ráster y vector"],
    version: "v26" /* ← verifica/edita */,
    novedades: [["Terreno","MDE y curvas de nivel"],["LiDAR","Módulo opcional"],["Formatos","Cientos compatibles"],["Análisis","Cuencas · visibilidad"]],
    nBadges: ["Georreferencia","3D","Scripts"],
    web: "https://www.bluemarblegeo.com/global-mapper/",
    rating: 4.7, resenas: 70,
    pen: 149, buyers: 10            /* ← EDITA: solo soles */
  },
  {
    llave: "arcgis-pro",
    lista: { cat: "GIS", icon: "ti-map-2", versions: "SIG · Esri", ac: "#6fd3ff", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "ArcGIS Pro 3.4.2", color: "#6fd3ff",
    categoria: "SIG profesional", dev: "Esri",
    desc: "SIG de escritorio de Esri: cartografía 2D/3D, análisis espacial avanzado y ciencia de datos geográfica.",
    ficha: [["Versión","3.4.2"],["Desarrollador","Esri"],["Enfoque","Cartografía · Análisis"],["Sistema","Windows 64 bits"]],
    badges: ["2D / 3D","Geoprocesos","Python"],
    version: "3.4.2",
    novedades: [["Cartografía","2D y 3D"],["Geoprocesos","Cientos de herramientas"],["Python","ArcPy · Notebooks"],["Nube","ArcGIS Online"]],
    nBadges: ["Imágenes","Deep Learning","Layouts"],
    web: "https://www.esri.com/es-es/arcgis/products/arcgis-pro/overview",
    rating: 4.9, resenas: 54,
    pen: 199, buyers: 10            /* ← EDITA: solo soles */
  },

  /* ════ HIDRÁULICA ════ */
  {
    llave: "irricad-v22",
    lista: { cat: "Hidráulica", icon: "ti-droplet", versions: "Diseño de riego", ac: "#1fa2d8", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "IRRICAD V22", color: "#1fa2d8", mono: "IR",
    categoria: "Hidráulica · Riego", dev: "Lincoln Agritech (Nueva Zelanda)",
    desc: "Diseño de sistemas de riego por goteo, aspersión y pivote: trazado sobre CAD, cálculo hidráulico de tuberías y lista de materiales.",
    ficha: [["Versión","V22"],["Desarrollador","Lincoln Agritech"],["Enfoque","Riego agrícola y paisajismo"],["Sistema","Windows 64 bits"]],
    badges: ["Riego","Hidráulica","Goteo y aspersión"],
    version: "22",
    novedades: [["Diseño","Goteo · aspersión · pivote"],["Hidráulica","Cálculo de tuberías"],["CAD","Trazado sobre planos"],["Materiales","Lista y presupuesto"]],
    nBadges: ["Agricultura","Paisajismo","Bombeo"],
    web: "https://nelsonirrigation.com/products/software/irricad",
    rating: 4.8, resenas: 17,
    pen: 840, usd: 250, buyers: 10   /* ← precio fijado en dólares: $250 USD · S/ 840 */
  },

  /* ════ PRODUCTIVIDAD ════ */
  {
    llave: "office-2019",
    lista: { cat: "Productividad", icon: "ti-file-spreadsheet", versions: "Suite · Completa", ac: "#f7d152", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Office 2019", color: "#f7d152",
    categoria: "Productividad", dev: "Microsoft",
    desc: "Suite ofimática completa: Word, Excel, PowerPoint y más para informes, cálculos y presentaciones de ingeniería.",
    ficha: [["Versión","2019"],["Desarrollador","Microsoft"],["Incluye","Word · Excel · PPT"],["Sistema","Windows 64 bits"]],
    badges: ["Suite completa","Sin suscripción"],
    version: "2019",
    novedades: [["Word","Documentos e informes"],["Excel","Cálculos y tablas"],["PowerPoint","Presentaciones"],["Licencia","Permanente"]],
    nBadges: ["Clásico","Estable"],
    web: "https://www.microsoft.com/es-es/microsoft-365",
    rating: 4.8, resenas: 25,
    pen: 99, buyers: 10             /* ← EDITA: solo soles */
  },
  {
    llave: "office-2021",
    lista: { cat: "Productividad", icon: "ti-file-spreadsheet", versions: "Suite · Estable", ac: "#f7d152", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Office 2021", color: "#f7d152",
    categoria: "Productividad", dev: "Microsoft",
    desc: "Suite ofimática estable con funciones modernas de Excel (XLOOKUP, matrices dinámicas) y colaboración mejorada.",
    ficha: [["Versión","2021"],["Desarrollador","Microsoft"],["Incluye","Word · Excel · PPT"],["Sistema","Windows 64 bits"]],
    badges: ["Suite estable","XLOOKUP"],
    version: "2021",
    novedades: [["Excel","XLOOKUP · matrices"],["Interfaz","Modernizada"],["Word","Coautoría"],["Licencia","Permanente"]],
    nBadges: ["Recomendado","Estable"],
    web: "https://www.microsoft.com/es-es/microsoft-365",
    rating: 4.9, resenas: 32,
    pen: 99, buyers: 10             /* ← EDITA: solo soles */
  },
  {
    llave: "office-365",
    lista: { cat: "Productividad", icon: "ti-file-spreadsheet", versions: "Suite · Cloud", ac: "#f7d152", url: "https://t.me/+xT9picqsAUI5MDAx" },
    gratis: true,    /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Office 365", color: "#f7d152",
    categoria: "Productividad", dev: "Microsoft",
    desc: "Microsoft 365: la suite en la nube con actualizaciones continuas, OneDrive y aplicaciones siempre al día.",
    ficha: [["Tipo","Suscripción cloud"],["Desarrollador","Microsoft"],["Incluye","Apps + OneDrive"],["Sistema","Win · macOS · Móvil"]],
    badges: ["Cloud","Siempre actualizado"],
    version: "365", so: "Multiplataforma",
    novedades: [["Nube","OneDrive incluido"],["Actualizaciones","Continuas"],["Apps","PC · web · móvil"],["Copilot","IA integrada"]],
    nBadges: ["Cloud","IA"],
    web: "https://www.microsoft.com/es-es/microsoft-365",
    rating: 4.7, resenas: 58,
    pen: 99, buyers: 10             /* ← EDITA: solo soles */
  },

  /* ════ RECURSOS · PLANTILLAS ════ */
  {
    llave: "plantillas-excel",
    lista: { cat: "Recursos", icon: "ti-clipboard", versions: "Cálculos · Presupuestos", ac: "#9b59b6", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Plantillas Excel", color: "#9b59b6",
    categoria: "Recursos", dev: "Engineering Eyes",
    desc: "Pack de plantillas de cálculo y presupuestos listas para usar: ahorra horas de armado en tus proyectos.",
    ficha: [["Tipo","Pack de plantillas"],["Formato","Excel (.xlsx)"],["Edición","100% editables"],["Entrega","Descarga digital"]],
    badges: ["Cálculos","Presupuestos","APU"],
    version: "Pack 2026", vIntro: "Contenido del pack:",
    novedades: [["Cálculos","Estructurales y geotécnicos"],["Presupuestos","APU y metrados"],["Formatos","Cronogramas · valorizaciones"],["Soporte","Incluido"]],
    nBadges: ["Editable","Listo para usar"],
    web: "https://t.me/+xT9picqsAUI5MDAx",
    rating: 5.0, resenas: 58,
    pen: 49, buyers: 10             /* ← EDITA: solo soles */
  },
  {
    llave: "plantillas-autocad",
    lista: { cat: "Recursos", icon: "ti-clipboard", versions: "Bloques · Cajetines", ac: "#9b59b6", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Plantillas AutoCAD", color: "#9b59b6",
    categoria: "Recursos", dev: "Engineering Eyes",
    desc: "Bloques, cajetines y láminas listas para producción de planos profesionales en AutoCAD.",
    ficha: [["Tipo","Pack de plantillas"],["Formato","DWG"],["Edición","100% editables"],["Entrega","Descarga digital"]],
    badges: ["Bloques","Cajetines","Láminas"],
    version: "Pack 2026", vIntro: "Contenido del pack:",
    novedades: [["Bloques","Civil y arquitectura"],["Cajetines","Formatos A4 – A0"],["Láminas","Listas para plotear"],["Soporte","Incluido"]],
    nBadges: ["Editable","Listo para usar"],
    web: "https://t.me/+xT9picqsAUI5MDAx",
    rating: 4.8, resenas: 55,
    pen: 49, buyers: 10             /* ← EDITA: solo soles */
  },
  {
    llave: "plantillas-revit",
    lista: { cat: "Recursos", icon: "ti-clipboard", versions: "Familias · Proyectos", ac: "#9b59b6", url: "https://t.me/+xT9picqsAUI5MDAx" },
    // gratis: true,   /* ← QUITA las dos barras para ponerlo GRATIS · vuelve a ponerlas para cobrar */
    nombre: "Plantillas Revit", color: "#9b59b6",
    categoria: "Recursos", dev: "Engineering Eyes",
    desc: "Familias y proyectos base para arrancar tus modelos BIM con estándares listos desde el día uno.",
    ficha: [["Tipo","Pack de plantillas"],["Formato","RVT · RFA"],["Edición","100% editables"],["Entrega","Descarga digital"]],
    badges: ["Familias","Proyectos base","BIM"],
    version: "Pack 2026", vIntro: "Contenido del pack:",
    novedades: [["Familias","Paramétricas"],["Proyectos","Base configurados"],["Estándares","Vistas y planos"],["Soporte","Incluido"]],
    nBadges: ["Editable","Listo para usar"],
    web: "https://t.me/+xT9picqsAUI5MDAx",
    rating: 4.9, resenas: 21,
    pen: 49, buyers: 10             /* ← EDITA: solo soles */
  }

  /* ➕ Copia aquí el siguiente programa cuando lo necesites */];
