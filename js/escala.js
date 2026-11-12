/* LOLO-RAIZ · el juego ocupa la pantalla: se agranda la zona de juego según el espacio libre
   (ancho y alto). En móvil no se toca. Se recalcula al girar, redimensionar o cambiar de reto. */
(function(){
  var st = document.querySelector('main.stage');
  if (!st || !('zoom' in document.documentElement.style)) return;
  var BASE = 980, MAX = 2, z = 1, pendiente = false, libre0 = true;
  function fija(v){ z = v; st.style.zoom = v === 1 ? '' : String(v); }
  function ajusta(){
    pendiente = false;
    if (window.innerWidth <= 760) { if (z !== 1) fija(1); return; }
    var padre = st.parentElement, ancho = padre.clientWidth;
    var r = st.getBoundingClientRect();
    var abajo = 0;
    for (var i = 0; i < st.children.length; i++) { var c = st.children[i].getBoundingClientRect(); if (c.height) abajo = Math.max(abajo, c.bottom); }
    var cs = getComputedStyle(st);
    var natural = (abajo - r.top) / z + (parseFloat(cs.paddingBottom) || 0);
    var libre = window.innerHeight - r.top - 20;
    var porAncho = ancho / BASE;
    var porAlto = natural > 0 ? libre / natural : MAX;
    var n = Math.max(1, Math.min(MAX, porAncho, porAlto));
    n = Math.round(n * 20) / 20;
    // durante un juego solo se encoge (nunca crece de golpe): así nada se mueve bajo el dedo.
    // Vuelve a poder crecer al cambiar de juego o de tamaño de pantalla.
    if (!libre0 && n > z) return;
    libre0 = false;
    if (Math.abs(n - z) >= 0.03) fija(n);
  }
  function pide(){
    if (!pendiente) { pendiente = true; requestAnimationFrame(ajusta); }
  }
  function reinicia(){ libre0 = true; pide(); }
  window.addEventListener('resize', reinicia);
  window.addEventListener('orientationchange', reinicia);
  window.addEventListener('hashchange', reinicia);
  if ('ResizeObserver' in window) new ResizeObserver(pide).observe(st);
  // al cambiar el contenido se mide en el mismo instante, para que nada se mueva después bajo el dedo
  new MutationObserver(ajusta).observe(st, { childList: true, subtree: true });
  pide();
})();
