/* Preparar: configuración de la agenda de la semana (sin protección). */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const A = window.RAIZ_AGENDA, esc = A.esc;
  const LAB = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
  const ENLACES = [['', 'Sin enlace'], ['jugar.html#lolo', 'La visita de Lolo (asamblea)'], ['tres.html', 'Modo 3 años'], ['jugar.html#caja', 'La caja misteriosa'], ['jugar.html#jardin', 'El jardín de la clase'], ['index.html#juegos', 'Todos los juegos']];
  const hoy = new Date().getDay();
  let dia = A.diaAgenda(hoy);

  const aviso = t => { $('#aviso').textContent = t; };
  const guarda = act => { if (!A.guardaDia(dia, act)) aviso('No se ha podido guardar en este navegador.'); };

  function pintaDias() {
    $('#dias').innerHTML = LAB.map((n, k) => `<button type="button" role="tab" class="dia" data-d="${k + 1}" aria-selected="${k + 1 === dia}">${n}</button>`).join('');
  }
  function pinta() {
    pintaDias();
    $('#diaEd').textContent = A.DIAS[dia];
    $('#listaEd').innerHTML = A.lista(dia).map((a, k) => `<li data-k="${k}">
      <span class="n">${k + 1}</span>
      <input type="text" value="${esc(a.t)}" aria-label="Nombre de la actividad ${k + 1}">
      <select data-c="i" aria-label="Dibujo de la actividad ${k + 1}">${Object.keys(A.IC).map(i => `<option value="${i}"${i === a.i ? ' selected' : ''}>${A.NOMBRES[i] || i}</option>`).join('')}</select>
      <select data-c="enlace" aria-label="Enlace de la actividad ${k + 1}">${ENLACES.map(([v, t]) => `<option value="${v}"${v === (a.enlace || '') ? ' selected' : ''}>${t}</option>`).join('')}</select>
      <button type="button" data-a="sube" aria-label="Subir">↑</button><button type="button" data-a="baja" aria-label="Bajar">↓</button><button type="button" data-a="quita" aria-label="Quitar">Quitar</button>
    </li>`).join('');
  }
  $('#dias').addEventListener('click', e => { const b = e.target.closest('.dia'); if (!b) return; dia = +b.dataset.d; aviso(''); pinta(); });
  $('#listaEd').addEventListener('input', e => {
    const li = e.target.closest('li'); if (!li) return;
    const act = A.lista(dia), a = act[+li.dataset.k];
    if (e.target.matches('input')) a.t = e.target.value;
    else if (e.target.dataset.c === 'enlace') { if (e.target.value) a.enlace = e.target.value; else delete a.enlace; }
    else a.i = e.target.value;
    guarda(act);
  });
  $('#listaEd').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const act = A.lista(dia), k = +b.closest('li').dataset.k;
    if (b.dataset.a === 'quita') act.splice(k, 1);
    else { const j = k + (b.dataset.a === 'sube' ? -1 : 1); if (j < 0 || j >= act.length) return; [act[k], act[j]] = [act[j], act[k]]; }
    guarda(act); pinta();
  });
  $('#btnNueva').addEventListener('click', () => { const act = A.lista(dia); act.push({ t: 'Actividad nueva', i: 'juego' }); guarda(act); pinta(); });
  $('#btnTodos').addEventListener('click', () => { const act = A.lista(dia), h = A.horario(); [1, 2, 3, 4, 5].forEach(d => { h[d] = act.map(a => ({ ...a })); }); A.guardaTodo(h); aviso('Agenda copiada a todos los días de la semana.'); });
  $('#btnReset').addEventListener('click', () => { A.quitaDia(dia); aviso('Agenda de ejemplo recuperada para el ' + A.DIAS[dia] + '.'); pinta(); });

  $('#btnExporta').addEventListener('click', () => {
    const datos = { app: 'lolo-raiz', version: 1, horario: A.horario() };
    const url = URL.createObjectURL(new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'lolo-raiz-agenda.json'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    aviso('Copia descargada.');
  });
  $('#archivo').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || d.app !== 'lolo-raiz' || typeof d.horario !== 'object') throw new Error('formato');
        const h = {}; Object.keys(d.horario).forEach(k => { if (/^[1-5]$/.test(k) && Array.isArray(d.horario[k])) h[k] = d.horario[k].filter(a => a && typeof a.t === 'string').map(a => ({ t: a.t.slice(0, 60), i: A.IC[a.i] ? a.i : 'juego', ...(typeof a.enlace === 'string' && ENLACES.some(x => x[0] === a.enlace) && a.enlace ? { enlace: a.enlace } : {}) })); });
        A.guardaTodo(h); aviso('Copia cargada.'); pinta();
      } catch (err) { aviso('Ese archivo no es una copia de esta agenda.'); }
      e.target.value = '';
    };
    r.readAsText(f);
  });
  pinta();
})();
