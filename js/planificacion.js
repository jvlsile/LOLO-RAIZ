/* Planificación por trimestre: tema, palabras, retos y reparto orientativo de las tres áreas. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const A = window.RAIZ_AGENDA, D = window.RAIZ_ASAMBLEA, esc = A.esc;
  const CLAVE = 'raiz-planificacion';
  const RANGO = { 1: 'De septiembre a diciembre', 2: 'De enero a marzo', 3: 'De abril a junio' };
  const AREAS = [
    ['Crecimiento en armonía', ['Saludo y despedida de la asamblea', 'Agenda visual: rutinas y anticipación', 'Emociones y rincón de la calma', 'El cuerpo y el movimiento (Muévete, fichas del cuerpo)']],
    ['Descubrimiento y exploración del entorno', ['Número del día, cuenta, series, formas y tamaños', 'Fecha y calendario', 'Los sentidos, el otoño y los juegos de ciencia', 'Tema del trimestre y pregunta reto']],
    ['Comunicación y representación de la realidad', ['Palabra protagonista: sílabas, letras y frase', 'Trazo y letra del día (grafomotricidad)', 'Cuentos, caja misteriosa y conversación', 'Fichas imprimibles']]
  ];
  let t = D.tema(new Date());
  const notas = () => A.leer(CLAVE, {});
  function pinta() {
    const T = D.TEMAS[t];
    $('#trims').innerHTML = [1, 2, 3].map(n => `<button type="button" role="tab" class="dia" data-t="${n}" aria-selected="${n === t}">Trimestre ${n}</button>`).join('');
    $('#tTema').textContent = 'Trimestre ' + t + ': ' + T.n;
    $('#rango').textContent = RANGO[t];
    $('#palabras').innerHTML = T.palabras.map(p => `<li>${esc(p.replace(/-/g, ''))}</li>`).join('');
    $('#retos').innerHTML = T.retos.map(r => `<li>${esc(r)}</li>`).join('');
    $('#sit').value = notas()[t] || '';
    $('#areas').innerHTML = AREAS.map(([n, l]) => `<div class="area"><h3>${esc(n)}</h3><ul>${l.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('');
  }
  $('#trims').addEventListener('click', e => { const b = e.target.closest('.dia'); if (b) { t = +b.dataset.t; pinta(); } });
  $('#sit').addEventListener('input', e => { const n = notas(); if (e.target.value.trim()) n[t] = e.target.value; else delete n[t]; A.guarda(CLAVE, n); });
  $('#btnImprimir').addEventListener('click', () => window.print());
  pinta();
})();
