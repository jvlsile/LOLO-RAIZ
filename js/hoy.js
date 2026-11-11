/* HOY · agenda visual de la clase. Todo se guarda en el navegador con el prefijo raiz-. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const CLAVE_H = 'raiz-hoy-horario', CLAVE_M = 'raiz-hoy-marcas';
  const leer = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } };
  const guarda = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

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
    { t: 'Entrada', i: 'entrada' }, { t: 'Asamblea', i: 'asamblea', enlace: 'jugar.html#lolo' },
    { t: 'Fruta', i: 'fruta' }, { t: 'Rincones', i: 'rincones' }, { t: 'Patio', i: 'patio' },
    { t: 'Aseo', i: 'aseo' }, { t: 'Cuento', i: 'cuento' }, { t: 'Salida', i: 'salida' }
  ];
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const hoy = new Date(), nDia = hoy.getDay();
  /* Sábado y domingo se enseñan con la agenda del viernes y el lunes. */
  const diaAg = nDia === 0 ? 1 : nDia === 6 ? 5 : nDia;
  const clave = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');

  let horario = leer(CLAVE_H, null) || {};
  const lista = () => horario[diaAg] || EJEMPLO.map(a => ({ ...a }));
  let marcas = leer(CLAVE_M, {}); if (marcas.fecha !== clave) marcas = { fecha: clave, hechas: [] };
  const svg = i => '<svg viewBox="0 0 24 24" aria-hidden="true">' + (IC[i] || IC.juego) + '</svg>';
  const tilde = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function pinta() {
    const act = lista(), hechas = marcas.hechas;
    const ahora = act.findIndex((_, k) => !hechas.includes(k));
    $('#agenda').innerHTML = act.map((a, k) => {
      const ok = hechas.includes(k);
      return `<li class="act${ok ? ' listo' : ''}${k === ahora ? ' ahora' : ''}" data-k="${k}">
        <span class="num" aria-hidden="true">${k + 1}</span>
        <span class="pic">${svg(a.i)}</span>
        <span class="nom">${esc(a.t)}</span>
        <button class="hecho" type="button" aria-pressed="${ok}" aria-label="${ok ? 'Hecho: ' : 'Marcar como hecho: '}${esc(a.t)}">${tilde}<span>${ok ? 'Hecho' : 'Hecho'}</span></button>
        ${a.enlace && !ok ? `<a class="ir" href="${a.enlace}">Abrir</a>` : ''}
      </li>`;
    }).join('');
    $('#estado').textContent = ahora < 0 ? '¡Hemos terminado todo lo de hoy!' : 'Ahora: ' + act[ahora].t;
  }

  $('#agenda').addEventListener('click', e => {
    const b = e.target.closest('.hecho'); if (!b) return;
    const k = +b.closest('.act').dataset.k, i = marcas.hechas.indexOf(k);
    if (i < 0) marcas.hechas.push(k); else marcas.hechas.splice(i, 1);
    guarda(CLAVE_M, marcas); pinta();
  });

  /* Preparar: sin protección, botón discreto en la esquina. */
  const ed = $('#editor');
  function pintaEditor() {
    const act = lista();
    $('#diaEd').textContent = DIAS[diaAg];
    $('#listaEd').innerHTML = act.map((a, k) => `<li data-k="${k}">
      <input type="text" value="${esc(a.t)}" aria-label="Nombre de la actividad ${k + 1}">
      <select aria-label="Dibujo de la actividad ${k + 1}">${Object.keys(IC).map(i => `<option value="${i}"${i === a.i ? ' selected' : ''}>${NOMBRES[i] || i}</option>`).join('')}</select>
      <button type="button" data-a="sube" aria-label="Subir">↑</button><button type="button" data-a="baja" aria-label="Bajar">↓</button><button type="button" data-a="quita" aria-label="Quitar">Quitar</button>
    </li>`).join('');
  }
  const cambia = act => { horario[diaAg] = act; guarda(CLAVE_H, horario); marcas.hechas = []; guarda(CLAVE_M, marcas); pinta(); pintaEditor(); };
  $('#btnPreparar').addEventListener('click', e => {
    const on = ed.hidden; ed.hidden = !on; e.currentTarget.setAttribute('aria-pressed', on);
    if (on) { pintaEditor(); ed.scrollIntoView({ block: 'nearest' }); }
  });
  $('#listaEd').addEventListener('input', e => {
    const li = e.target.closest('li'); if (!li) return;
    const act = lista(), a = act[+li.dataset.k];
    if (e.target.matches('input')) a.t = e.target.value; else a.i = e.target.value;
    horario[diaAg] = act; guarda(CLAVE_H, horario); pinta();
  });
  $('#listaEd').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const act = lista(), k = +b.closest('li').dataset.k;
    if (b.dataset.a === 'quita') act.splice(k, 1);
    else { const j = k + (b.dataset.a === 'sube' ? -1 : 1); if (j < 0 || j >= act.length) return; [act[k], act[j]] = [act[j], act[k]]; }
    cambia(act);
  });
  $('#btnNueva').addEventListener('click', () => { const act = lista(); act.push({ t: 'Actividad nueva', i: 'juego' }); cambia(act); });
  $('#btnTodos').addEventListener('click', () => { const act = lista(); [1, 2, 3, 4, 5].forEach(d => { horario[d] = act.map(a => ({ ...a })); }); guarda(CLAVE_H, horario); $('#estado').textContent = 'Agenda copiada a todos los días de la semana.'; });
  $('#btnReset').addEventListener('click', () => { delete horario[diaAg]; guarda(CLAVE_H, horario); marcas.hechas = []; guarda(CLAVE_M, marcas); pinta(); pintaEditor(); });
  $('#btnImprimir').addEventListener('click', () => window.print());

  $('#dia').textContent = DIAS[nDia];
  $('#fecha').textContent = hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  pinta();
})();
