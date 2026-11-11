/* Asamblea: recorrido guiado (Siguiente / Anterior / barra espaciadora) y menú lateral para saltar a cualquier bloque. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const A = window.RAIZ_AGENDA, D = window.RAIZ_ASAMBLEA, esc = A.esc;
  const hoy = new Date();
  const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const ICON = {
    saludo: '<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1-5.5-3L3.5 14a1.5 1.5 0 0 1 2.5-1.5L8 15"/>',
    fecha: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    agenda: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    trazo: '<path d="M4 20c4-12 8 4 12-8 1-3 2-6 4-8"/>',
    palabra: '<path d="M4 6h16M4 12h10M4 18h16"/>',
    numero: '<path d="M9 4L7 20M17 4l-2 16M4 9h17M3 15h17"/>',
    reto: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
    rincones: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/>',
    despedida: '<path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/>'
  };
  const BLOQUES = [['saludo', 'Saludo'], ['fecha', 'Fecha'], ['agenda', 'Agenda'], ['trazo', 'Trazo'], ['palabra', 'Palabra'], ['numero', 'Número'], ['reto', 'Pregunta reto'], ['rincones', 'Tres rincones'], ['despedida', 'Despedida']];
  const ico = k => '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + '</svg>';
  let ed = D.edad(), cur = Math.max(0, BLOQUES.findIndex(b => b[0] === location.hash.slice(1))), vistos = new Set();
  const dato = () => D.delDia(hoy, ed);

  const letras = (txt, may) => [...txt].map(c => `<span class="${D.esVocal(c) ? 'vocal' : 'cons'}">${esc(may ? c.toLocaleUpperCase('es') : c.toLocaleLowerCase('es'))}</span>`).join('');
  const puntos = (n, split) => '<div class="puntos" aria-hidden="true">' + [...Array(n)].map((_, i) => `<i${split && i >= split ? ' class="b"' : ''}></i>`).join('') + '</div>';

  const VISTAS = {
    saludo: () => `<h2>¡Buenos días, clase!</h2><p class="sub">Saludamos a Lolo y entre todos nos saludamos.</p><p class="gran" aria-hidden="true">👋</p>`,
    fecha: () => {
      const d = A.DIAS[hoy.getDay()];
      return `<h2>Hoy es ${esc(d)}</h2><p class="sub">${ed === 3 ? 'Miramos el calendario.' : 'Ayer fue ' + A.DIAS[(hoy.getDay() + 6) % 7] + ' y mañana será ' + A.DIAS[(hoy.getDay() + 1) % 7] + '.'}</p>
        <p class="gran">${hoy.getDate()} <span style="font-size:.45em">de ${MES[hoy.getMonth()]}</span></p>`;
    },
    agenda: () => `<h2>Nuestro día</h2><p class="sub">Lo que vamos a hacer hoy, en orden.</p>
      <div class="agenda-mini">${A.lista(A.diaAgenda(hoy.getDay())).map(a => `<div><span class="pic">${A.svg(a.i)}</span>${esc(a.t)}</div>`).join('')}</div>`,
    trazo: () => {
      const r = dato(), t = r.trazo;
      const glifo = ed === 3 ? D.TRAZO_SIGNO[t % 8] : ed === 4 ? 'AEIOU'[t % 5] : D.VOCALES_5[t % 5];
      const nombre = ed === 3 ? D.TRAZOS[t % 8] : ed === 4 ? 'Vocal ' + glifo : 'Vocal ' + glifo;
      return `<h2>${esc(nombre)}</h2><p class="sub">${ed === 3 ? 'Lo hacemos primero con el cuerpo, en el aire.' : 'La escribimos en la pauta: copa, tronco y raíces.'}</p>
        <svg class="pauta" viewBox="0 0 520 300" role="img" aria-label="Pauta con copa, tronco y raíces">
          <rect x="0" y="10" width="520" height="90" fill="#EAF6EC"/><rect x="0" y="100" width="520" height="100" fill="#FBF1E1"/><rect x="0" y="200" width="520" height="90" fill="#F1E4D6"/>
          <g stroke="#B9AC93" stroke-width="2"><path d="M0 100H520M0 200H520"/></g>
          <text x="10" y="32" font-size="18" fill="#46607F">copa</text><text x="10" y="122" font-size="18" fill="#46607F">tronco</text><text x="10" y="222" font-size="18" fill="#46607F">raíces</text>
          <text x="260" y="192" text-anchor="middle" font-size="140" font-weight="700" fill="#183153">${esc(glifo)}</text>
        </svg>`;
    },
    palabra: () => {
      const r = dato(), sil = r.palabra.split('-'), may = ed !== 5, plano = sil.join('');
      const vocs = [...new Set([...plano].filter(D.esVocal).map(c => D.quitaAcentos(c.toLowerCase())))];
      const V = vocs.map(c => `<span class="vocal">${may ? c.toUpperCase() : c}</span>`).join(', ');
      let h = `<h2>La palabra de hoy</h2><p class="sub">${ed === 3 ? 'La miramos, damos palmas y decimos sus vocales.' : ed === 4 ? 'Contamos sílabas y letras. Vocales en azul, consonantes en rojo.' : 'La leemos, hacemos una frase entre todos y buscamos qué clase de palabra es.'}</p>
        <div class="silabas">${sil.map(s => `<div class="silaba"><span class="gran">${letras(s, may)}</span><span class="palmas" aria-hidden="true"><i></i></span></div>`).join('')}</div>
        <div class="datos"><div class="dato"><small>Palmas (sílabas)</small>${sil.length}</div>`;
      if (ed >= 4) h += `<div class="dato"><small>Letras</small>${plano.length}</div>`;
      h += `<div class="dato"><small>${vocs.length === 1 ? 'Vocal' : 'Vocales'}</small>${V}</div></div>`;
      if (ed === 5) h += `<label class="signos" for="frase">Frase hecha entre todos:</label><textarea id="frase" rows="2" placeholder="Escríbela aquí al final"></textarea>
        <p class="signos">Signos: art. (artículo) · n. c. (nombre común) · n. p. (nombre propio) · v. (verbo).</p>`;
      return h;
    },
    numero: () => {
      const n = dato().numero;
      if (ed === 3) return `<h2>El número de hoy</h2><p class="sub">Lo contamos con los dedos y con objetos.</p><p class="gran">${n}</p>${puntos(n)}`;
      if (ed === 4) { const a = Math.ceil(n / 2); return `<h2>El número de hoy</h2><p class="sub">Qué número va antes y cuál va después. ${n} se puede dibujar como ${a} + ${n - a}.</p>
        <div class="serie"><span class="gran vecino">${n > 1 ? n - 1 : ''}</span><span class="gran">${n}</span><span class="gran vecino">${n < 15 ? n + 1 : ''}</span></div>${puntos(n, a)}`; }
      const y = n % 10 ? n % 10 : 5, x = n - y;
      return `<h2>El número de hoy</h2><p class="sub">Lo escribimos y hacemos sumas y restas de una cifra, sin llevadas.</p>
        <div class="serie"><span class="gran">${n}</span></div>
        <div class="datos"><div class="dato">${x} + ${y} = ${n}</div><div class="dato">${n} − ${y} = ${x}</div></div>`;
    },
    reto: () => `<h2>Pregunta reto</h2><p class="sub">Pensamos y contestamos entre todos.</p><p class="gran" style="font-size:clamp(1.8rem,4.2vw,3.4rem)">${esc(dato().reto)}</p>`,
    rincones: () => `<h2>Los tres rincones</h2><p class="sub">Cada grupo va a su rincón.</p><div class="rincones">${dato().rincones.map(r => `<div class="rincon">${esc(r)}</div>`).join('')}</div>`,
    despedida: () => `<h2>¡Hasta mañana!</h2><p class="sub">Recogemos y nos despedimos de Lolo.</p><p class="gran" aria-hidden="true">👋</p>`
  };

  function pinta(foco) {
    const [k] = BLOQUES[cur];
    $('#bloque').innerHTML = VISTAS[k]();
    $('#menu').innerHTML = BLOQUES.map(([c, n], i) => `<button type="button" data-i="${i}"${i === cur ? ' aria-current="step"' : ''}${vistos.has(i) ? ' class="visto"' : ''}><span class="ic">${ico(c)}</span><span class="t">${n}</span></button>`).join('');
    $('#cuenta').textContent = `${cur + 1} de ${BLOQUES.length} · ${BLOQUES[cur][1]}`;
    $('#btnAnt').disabled = cur === 0;
    $('#btnSig').textContent = cur === BLOQUES.length - 1 ? 'Terminar' : 'Siguiente';
    document.querySelectorAll('#edades button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.e === ed));
    $('#tema').textContent = 'Tema: ' + D.TEMAS[D.tema(hoy)].n;
    vistos.add(cur);
    if (cur === BLOQUES.length - 1) D.registra(hoy, ed, dato());
    history.replaceState(null, '', '#' + k);
    if (foco) $('#bloque').focus({ preventScroll: true });
  }
  const ir = i => { cur = Math.min(BLOQUES.length - 1, Math.max(0, i)); pinta(true); };
  $('#btnSig').addEventListener('click', () => { if (cur === BLOQUES.length - 1) location.href = 'hoy.html'; else ir(cur + 1); });
  $('#btnAnt').addEventListener('click', () => ir(cur - 1));
  $('#menu').addEventListener('click', e => { const b = e.target.closest('button'); if (b) ir(+b.dataset.i); });
  $('#edades').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; ed = +b.dataset.e; D.ponEdad(ed); pinta(false); });
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea,select') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === ' ' || e.key === 'ArrowRight') { if (e.target.closest('button') && e.key === ' ') return; e.preventDefault(); if (cur < BLOQUES.length - 1) ir(cur + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(cur - 1); }
  });
  addEventListener('hashchange', () => { const i = BLOQUES.findIndex(b => b[0] === location.hash.slice(1)); if (i >= 0 && i !== cur) { cur = i; pinta(false); } });
  pinta(false);
})();
