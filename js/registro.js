/* Registro semanal: lo trabajado cada día en la asamblea y las observaciones de la maestra. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const A = window.RAIZ_AGENDA, D = window.RAIZ_ASAMBLEA, esc = A.esc;
  const CLAVE_N = 'raiz-registro-notas';
  const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const lunesDe = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
  let lunes = lunesDe(new Date());
  const fmt = d => d.getDate() + ' de ' + MES[d.getMonth()];

  function pinta() {
    const reg = A.leer('raiz-asamblea-registro', {}), notas = A.leer(CLAVE_N, {});
    const dias = [0, 1, 2, 3, 4].map(i => { const d = new Date(lunes); d.setDate(d.getDate() + i); return d; });
    $('#semana').textContent = 'Del ' + fmt(dias[0]) + ' al ' + fmt(dias[4]) + ' de ' + dias[4].getFullYear();
    $('#pieImp').textContent = 'Semana del ' + fmt(dias[0]) + ' al ' + fmt(dias[4]) + ' de ' + dias[4].getFullYear() + ' · La visita de Lolo';
    $('#tabla').innerHTML = '<thead><tr><th>Día</th><th>Edad</th><th>Trazo o letra</th><th>Palabra</th><th>Número</th><th>Observaciones</th></tr></thead><tbody>' +
      dias.map(d => { const k = D.f2(d), r = reg[k];
        const celda = v => r ? `<td>${esc(v)}</td>` : '<td class="vacio">—</td>';
        return `<tr data-f="${k}"><td class="dia">${A.DIAS[d.getDay()]} ${d.getDate()}</td>${celda(r && r.edad + ' años')}${celda(r && r.trazo)}${celda(r && r.palabra)}${celda(r && r.numero)}<td><textarea aria-label="Observaciones del ${A.DIAS[d.getDay()]} ${d.getDate()}">${esc(notas[k] || '')}</textarea></td></tr>`; }).join('') + '</tbody>';
  }
  $('#tabla').addEventListener('input', e => {
    const tr = e.target.closest('tr[data-f]'); if (!tr || !e.target.matches('textarea')) return;
    const n = A.leer(CLAVE_N, {}); if (e.target.value.trim()) n[tr.dataset.f] = e.target.value; else delete n[tr.dataset.f]; A.guarda(CLAVE_N, n);
  });
  $('#btnAnt').addEventListener('click', () => { lunes.setDate(lunes.getDate() - 7); pinta(); });
  $('#btnSig').addEventListener('click', () => { lunes.setDate(lunes.getDate() + 7); pinta(); });
  $('#btnImprimir').addEventListener('click', () => window.print());
  pinta();
})();
