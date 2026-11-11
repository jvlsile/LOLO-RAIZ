/* HOY · agenda visual de la clase. Todo se guarda en el navegador con el prefijo raiz-. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const CLAVE_M = 'raiz-hoy-marcas';
  const leer = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } };
  const guarda = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  const A = window.RAIZ_AGENDA, DIAS = A.DIAS, svg = A.svg, esc = A.esc;
  const hoy = new Date(), nDia = hoy.getDay();
  /* Sábado y domingo se enseñan con la agenda del viernes y el lunes. */
  const diaAg = A.diaAgenda(nDia);
  const clave = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');

  const lista = () => A.lista(diaAg);
  let marcas = leer(CLAVE_M, {}); if (marcas.fecha !== clave) marcas = { fecha: clave, hechas: [] };
  const tilde = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

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

  $('#btnImprimir').addEventListener('click', () => window.print());

  $('#dia').textContent = DIAS[nDia];
  $('#fecha').textContent = hoy.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  pinta();
})();
