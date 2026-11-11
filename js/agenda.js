/* Datos compartidos de la agenda (HOY y Preparar). Se guardan en el navegador con el prefijo raiz-. */
(function () {
  'use strict';
  const CLAVE_H = 'raiz-hoy-horario';
  const leer = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } };
  const guarda = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  /* Dibujos de ejemplo (hasta tener pictogramas de ARASAAC). */
  const IC = {
    entrada: '<path d="M5 21V4h9v17M14 8h5v13M10 13h.01"/>',
    asamblea: '<circle cx="12" cy="9" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/>',
    fruta: '<path d="M12 7c-4-3-9 0-7 6 1.5 5 5 8 7 8s5.5-3 7-8c2-6-3-9-7-6zM12 7c0-2 1-4 3-5"/>',
    rincones: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
    patio: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    aseo: '<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>',
    comida: '<path d="M6 3v8a3 3 0 0 0 3 3v7M9 3v6M12 3v8a3 3 0 0 1-3 3M17 3c-2 2-3 5-3 8h3v10"/>',
    juego: '<path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.4l6-.8z"/>',
    cuento: '<path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z"/>',
    musica: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    salida: '<path d="M9 21H4V3h5M16 7l5 5-5 5M21 12H9"/>'
  };
  const NOMBRES = { entrada: 'Entrada', asamblea: 'Asamblea', fruta: 'Fruta', rincones: 'Rincones', patio: 'Patio', aseo: 'Aseo', comida: 'Comida', juego: 'Juego', cuento: 'Cuento', musica: 'Música', salida: 'Salida' };
  const EJEMPLO = [
    { t: 'Entrada', i: 'entrada' }, { t: 'Asamblea', i: 'asamblea', enlace: 'asamblea.html' },
    { t: 'Fruta', i: 'fruta' }, { t: 'Rincones', i: 'rincones' }, { t: 'Patio', i: 'patio' },
    { t: 'Aseo', i: 'aseo' }, { t: 'Cuento', i: 'cuento' }, { t: 'Salida', i: 'salida' }
  ];
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const horario = () => { const h = leer(CLAVE_H, {}); return h && typeof h === 'object' ? h : {}; };
  window.RAIZ_AGENDA = {
    IC, NOMBRES, EJEMPLO, DIAS, leer, guarda,
    svg: i => '<svg viewBox="0 0 24 24" aria-hidden="true">' + (IC[i] || IC.juego) + '</svg>',
    esc: s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])),
    horario,
    lista: d => { const a = horario()[d]; return Array.isArray(a) ? a.map(x => ({ ...x })) : EJEMPLO.map(x => ({ ...x })); },
    guardaDia: (d, act) => { const h = horario(); h[d] = act; return guarda(CLAVE_H, h); },
    guardaTodo: h => guarda(CLAVE_H, h),
    quitaDia: d => { const h = horario(); delete h[d]; guarda(CLAVE_H, h); },
    /* Sábado y domingo se enseñan con la agenda del viernes y del lunes. */
    diaAgenda: n => n === 0 ? 1 : n === 6 ? 5 : n
  };
})();
