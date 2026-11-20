/* Planificación por trimestre y semana: tema, palabras, retos, reparto de áreas y programación de los cinco días.
   Se guarda en el navegador con el prefijo raiz-. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const A = window.RAIZ_AGENDA, D = window.RAIZ_ASAMBLEA, esc = A.esc;
  const CLAVE = 'raiz-planificacion';
  const CLAVE_SEMANA = 'raiz-planificacion-semana';
  const CLAVE_EDAD = 'raiz-planificacion-edad';
  const CLAVE_NOMBRES = 'raiz-nombres';
  const RANGO = { 1: 'De septiembre a diciembre', 2: 'De enero a marzo', 3: 'De abril a junio' };
  const EDADES = [3, 4, 5];
  const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  // Conteo máximo de la palabra y el número protagonista por edad (decisiones-ui.md). Por confirmar con la autora.
  const NUMERO_MAX = { 3: 5, 4: 15, 5: 50 };
  // Propuestas de rincones acordadas. Lo que no está acordado queda como pendiente.
  const MAT4 = {
    1: ['Ordenar siluetas del cuerpo por tamaño', 'Contar dedos con tapones de colores'],
    2: ['Clasificar frutas de plástico por tamaño', 'Contar piezas de fruta en cestas pequeñas'],
    3: ['Ordenar señales de tráfico por forma y color', 'Contar coches de juguete en un aparcamiento de cartón']
  };
  const VIDA = {
    1: ['Esqueleto con bloques de madera sobre la mesa de luz', 'Castillo de arena con moldes'],
    2: ['Puesto de frutas con cajas de cartón', 'Huerto con arena y semillas en la mesa de luz'],
    3: ['Semáforo con bloques y luces', 'Calle de arena con cochecitos']
  };
  const PROPUESTAS = {
    3: { 'Construcción': ['Encajar piezas grandes', 'Apilar vasos de plástico', 'Torres con bloques de madera'], 'Matemáticas': ['Clasificar bloques de colores'], 'Motricidad fina': ['Ensartar cuentas gruesas'] },
    4: t => ({ 'Construcción': ['Puentes con cartones de huevo y palitos', 'Torres con vasos de plástico de distintos tamaños', 'Ciudad con bloques de madera y figuras pequeñas'], 'Matemáticas': MAT4[t], 'Construcción (vida práctica)': VIDA[t] }),
    5: () => ({})
  };
  const propuestas = (edad, t) => { const p = PROPUESTAS[edad]; return typeof p === 'function' ? p(t) : p; };

  let t = D.tema(new Date());
  let edad = Math.min(5, Math.max(3, +A.leer(CLAVE_EDAD, 3) || 3));
  const notas = () => A.leer(CLAVE, {});
  const semanas = () => { const s = A.leer(CLAVE_SEMANA, {}); return s && typeof s === 'object' ? s : {}; };
  const diaVacio = () => ({ rincones: [], palabra: '', numero: '', reto: '' });
  function dato(d) {
    const s = semanas(), k = t + '-' + edad;
    return (s[k] && s[k][d]) || diaVacio();
  }
  function guardaDia(d, valor) {
    const s = semanas(), k = t + '-' + edad;
    s[k] = s[k] || {};
    s[k][d] = valor;
    A.guarda(CLAVE_SEMANA, s);
  }

  function pintaEdades() {
    $('#edades').innerHTML = EDADES.map(n => `<button type="button" role="tab" class="dia" data-e="${n}" aria-selected="${n === edad}">${n} años</button>`).join('');
  }

  function pintaSemana() {
    const T = D.TEMAS[t];
    const prop = propuestas(edad, t);
    const hayPropuestas = Object.keys(prop).length > 0;
    const max = NUMERO_MAX[edad];
    $('#semana').innerHTML = DIAS.map((nombre, i) => {
      const d = 'd' + i, v = dato(d);
      const grupos = Object.keys(prop).map(g => `<div class="grupo">${esc(g)}</div>` + prop[g].map(r => `<label><input type="checkbox" data-d="${d}" data-k="rincones" value="${esc(r)}"${v.rincones.includes(r) ? ' checked' : ''}> ${esc(r)}</label>`).join('')).join('');
      return `<fieldset class="dia-plan" data-d="${d}">
        <legend>${nombre}</legend>
        <p class="pendiente">${hayPropuestas ? '' : 'Propuestas de rincones pendientes de las situaciones de aprendizaje para ' + edad + ' años.'}</p>
        ${grupos}
        <div class="campo"><label>Palabra protagonista
          <input type="text" list="pal-${t}" data-d="${d}" data-k="palabra" value="${esc(v.palabra)}"></label></div>
        <div class="campo"><label>Número protagonista (hasta ${max})
          <input type="number" min="1" max="${max}" data-d="${d}" data-k="numero" value="${esc(v.numero)}"></label></div>
        <div class="campo"><label>Reto del día
          <input type="text" list="ret-${t}" data-d="${d}" data-k="reto" value="${esc(v.reto)}"></label></div>
      </fieldset>`;
    }).join('') +
    `<datalist id="pal-${t}">${T.palabras.map(p => `<option value="${esc(p.replace(/-/g, ''))}">`).join('')}</datalist>` +
    `<datalist id="ret-${t}">${T.retos.map(r => `<option value="${esc(r)}">`).join('')}</datalist>`;
  }

  function pinta() {
    const T = D.TEMAS[t];
    $('#trims').innerHTML = [1, 2, 3].map(n => `<button type="button" role="tab" class="dia" data-t="${n}" aria-selected="${n === t}">Trimestre ${n}</button>`).join('');
    $('#tTema').textContent = 'Trimestre ' + t + ': ' + T.n;
    $('#rango').textContent = RANGO[t];
    $('#palabras').innerHTML = T.palabras.map(p => `<li>${esc(p.replace(/-/g, ''))}</li>`).join('');
    $('#retos').innerHTML = T.retos.map(r => `<li>${esc(r)}</li>`).join('');
    $('#sit').value = notas()[t] || '';
    $('#areas').innerHTML = AREAS.map(([n, l]) => `<div class="area"><h3>${esc(n)}</h3><ul>${l.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('');
    pintaEdades();
    pintaSemana();
  }

  const AREAS = [
    ['Crecimiento en armonía', ['Saludo y despedida de la asamblea', 'Agenda visual: rutinas y anticipación', 'Emociones y rincón de la calma', 'El cuerpo y el movimiento (Muévete, fichas del cuerpo)']],
    ['Descubrimiento y exploración del entorno', ['Número del día, cuenta, series, formas y tamaños', 'Fecha y calendario', 'Los sentidos, el otoño y los juegos de ciencia', 'Tema del trimestre y pregunta reto']],
    ['Comunicación y representación de la realidad', ['Palabra protagonista: sílabas, letras y frase', 'Trazo y letra del día (grafomotricidad)', 'Cuentos, caja misteriosa y conversación', 'Fichas imprimibles']]
  ];

  $('#trims').addEventListener('click', e => { const b = e.target.closest('.dia'); if (b) { t = +b.dataset.t; pinta(); } });
  $('#edades').addEventListener('click', e => {
    const b = e.target.closest('.dia'); if (!b) return;
    edad = +b.dataset.e; A.guarda(CLAVE_EDAD, edad); pinta();
  });
  $('#semana').addEventListener('change', e => {
    const el = e.target, d = el.dataset.d, k = el.dataset.k;
    if (!d || !k) return;
    const v = dato(d);
    if (k === 'rincones') {
      v.rincones = [...document.querySelectorAll(`#semana input[data-d="${d}"][data-k="rincones"]:checked`)].map(c => c.value);
    } else if (k === 'numero') {
      const n = Math.max(1, Math.min(NUMERO_MAX[edad], parseInt(el.value, 10) || 0));
      v.numero = n ? String(n) : '';
      el.value = v.numero;
    } else {
      v[k] = el.value.trim();
    }
    guardaDia(d, v);
  });
  $('#sit').addEventListener('input', e => { const n = notas(); if (e.target.value.trim()) n[t] = e.target.value; else delete n[t]; A.guarda(CLAVE, n); });
  $('#nombres').addEventListener('input', e => {
    const lista = e.target.value.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    A.guarda(CLAVE_NOMBRES, lista);
  });
  $('#btnImprimir').addEventListener('click', () => window.print());
  const nombres = A.leer(CLAVE_NOMBRES, []);
  $('#nombres').value = Array.isArray(nombres) ? nombres.join('\n') : '';
  pinta();
})();
