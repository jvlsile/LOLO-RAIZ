/* Fichas de los sentidos · La visita de Lolo
   Ocho fichas A4 (una por hoja) y un registro de observación para la docente.
   Todo en SVG con medidas en milímetros (cada hoja mide 210 × 297 mm). Los dibujos vienen de js/sentidos-dibujos.js. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const S = window.LOLO_SENTIDOS;
  const lee = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
  const guarda = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const K = '#13263F', GRIS = '#8FA2B2', SUAVE = '#C9D6DF';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  let lineas = false; // ahorro de tinta: dibujos solo con línea

  // Los colores muy oscuros (ojos, pepitas) se conservan en las fichas para colorear.
  const oscuro = h => { const n = parseInt(h, 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (.2126 * r + .7152 * g + .0722 * b) / 255 < .3; };
  /* Un dibujo de 100 × 100 colocado en (x, y) con lado t mm. En modo línea, los rellenos de color pasan a blanco. */
  const dib = (k, x, y, t, linea = lineas) => {
    const d = S.ORGANOS[k] || S.C[k] || S.SABORES[k];
    let svg = d.svg;
    if (linea) svg = svg.replace(/fill="#([0-9A-Fa-f]{6})"/g, (m, h) => oscuro(h) ? m : 'fill="#fff"').replace(/stroke="#(?!183153)[0-9A-Fa-f]{3,6}"/g, `stroke="${K}"`);
    return `<svg x="${x}" y="${y}" width="${t}" height="${t}" viewBox="-4 -4 108 108" overflow="visible">${svg}</svg>`;
  };
  const txt = (x, y, t, cl, extra = '') => `<text x="${x}" y="${y}" class="${cl}" ${extra}>${esc(t)}</text>`;
  const caja = (x, y, w, h, r = 4, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#fff" stroke="${K}" stroke-width=".5" ${extra}/>`;
  const LOLO = (x, y, e = 1) => `<g transform="translate(${x} ${y}) scale(${e})"><g stroke="#F06A22" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M-7 4q-4 7-1 12"/><path d="M-2 6q-1 7-3 12"/><path d="M3 6q1 7 3 12"/><path d="M8 4q4 7 1 12"/></g><circle cx="0" cy="-2" r="9" fill="#FF8A3D" stroke="${K}" stroke-width=".7"/><circle cx="-3.2" cy="-3" r="2" fill="#fff"/><circle cx="3.2" cy="-3" r="2" fill="#fff"/><circle cx="-3" cy="-2.8" r="1" fill="${K}"/><circle cx="3.4" cy="-2.8" r="1" fill="${K}"/><path d="M-2.6 1.6q2.6 2.4 5.2 0" fill="none" stroke="${K}" stroke-width=".7" stroke-linecap="round"/></g>`;

  /* Cabecera, nombre y pie comunes. */
  function marco(f, o, cuerpo) {
    const conNombre = o.nombre && !f.docente && f.k !== 'diploma';
    const nombre = conNombre ? `${txt(16, 46, 'Nombre', 't-campo')}<path d="M31 46.5h95" stroke="${GRIS}" stroke-width=".4"/>${txt(134, 46, 'Fecha', 't-campo')}<path d="M145 46.5h49" stroke="${GRIS}" stroke-width=".4"/>` : '';
    return `<svg class="ficha-sen" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(f.n)}">
      <rect width="210" height="297" fill="#fff"/>
      ${LOLO(24, 22, 1.05)}
      ${txt(38, 20, 'Los sentidos · La visita de Lolo', 't-ante')}
      ${txt(38, 29.5, f.n, 't-titulo')}
      ${[].concat(f.ins || []).map((l, i) => txt(16, (conNombre ? 56 : 48) + i * 5.6, l, 't-ins')).join('')}
      ${nombre}
      ${cuerpo}
      <path d="M16 282h178" stroke="${SUAVE}" stroke-width=".35"/>
      ${txt(16, 288, f.pie || '', 't-pie')}
      ${f.docente ? '' : txt(194, 288, 'jvlsile.github.io/VISITA-DE-LOLO-', 't-pie', 'text-anchor="end"')}
    </svg>`;
  }

  /* ---------- las fichas ---------- */
  const F = [
    { k: 'une', n: 'Une cada cosa con su sentido', ins: ['Une cada dibujo con la parte del cuerpo', 'con la que lo notamos.'],
      pie: 'Evalúa: relaciona experiencias con los órganos de los sentidos.',
      cuerpo() {
        const izq = ['flor', 'tambor', 'arcoiris', 'helado', 'osito'], der = ['ojo', 'boca', 'mano', 'nariz', 'oreja'];
        return izq.map((k, i) => { const y = 72 + i * 41;
          return caja(26, y, 44, 36, 6) + dib(k, 30, y + 2, 32) + `<circle cx="78" cy="${y + 18}" r="2.2" fill="${K}"/>`; }).join('')
          + der.map((k, i) => { const y = 72 + i * 41;
          return caja(140, y, 44, 36, 6) + dib(k, 144, y + 2, 32) + `<circle cx="132" cy="${y + 18}" r="2.2" fill="${K}"/>`; }).join('');
      } },
    { k: 'olores', n: '¿Huele bien o huele mal?', ins: ['Colorea lo que huele bien.', 'Tacha con una cruz lo que huele mal.'],
      pie: 'Evalúa: distingue olores agradables y desagradables.',
      cuerpo() {
        const it = ['flor', 'basura', 'pan', 'calcetin', 'naranja', 'caca', 'jabon', 'pescado', 'galleta'];
        return it.map((k, i) => { const x = 22 + (i % 3) * 58, y = 74 + Math.floor(i / 3) * 66; return caja(x, y, 50, 58, 6) + dib(k, x + 5, y + 4, 40, true); }).join('')
          + `<g transform="translate(22 274)">${txt(0, 0, '¿Qué hacemos si huele a humo?  Lo decimos en voz alta: ¡avisamos a una persona mayor!', 't-nota')}</g>`;
      } },
    { k: 'sabores', n: '¿A qué sabe?', ins: ['Rodea con rosa lo dulce, con azul lo salado', 'y con amarillo lo ácido.'],
      pie: 'Evalúa: clasifica alimentos por su sabor (dulce, salado, ácido).',
      cuerpo() {
        const ley = [['dulce', 'Dulce', '#FF5D8F'], ['salado', 'Salado', '#3D8DF2'], ['acido', 'Ácido', '#F2C200']];
        const it = ['helado', 'patatas', 'limon', 'piruleta', 'aceitunas', 'lima', 'miel', 'palomitas', 'fresa'];
        return ley.map(([k, l, c], i) => { const x = 22 + i * 58; return `<rect x="${x}" y="68" width="50" height="22" rx="11" fill="#fff" stroke="${c}" stroke-width="1.4"/>` + dib(k, x + 3, 69, 20) + txt(x + 26, 82.5, l, 't-ley'); }).join('')
          + it.map((k, i) => { const x = 22 + (i % 3) * 58, y = 98 + Math.floor(i / 3) * 60; return caja(x, y, 50, 52, 6) + dib(k, x + 7, y + 4, 36); }).join('');
      } },
    { k: 'sonidos', n: '¿Qué suena?', ins: ['Rodea las cosas que hacen ruido.', '¿Cuáles suenan fuerte? Imítalas con la voz.'],
      pie: 'Evalúa: identifica objetos sonoros del entorno.',
      cuerpo() {
        const it = ['tambor', 'piedra', 'campana', 'osito', 'pajaro', 'esponja', 'maracas', 'flor', 'silbato'];
        return it.map((k, i) => { const x = 22 + (i % 3) * 58, y = 72 + Math.floor(i / 3) * 66; return caja(x, y, 50, 58, 6) + dib(k, x + 5, y + 5, 40); }).join('');
      } },
    { k: 'tacto', n: 'Mi bolsa de tacto', ins: 'Pega un trocito de cada cosa: algodón, lija, un botón, esponja…',
      pie: 'Evalúa: describe texturas (suave, áspero, duro, blando).',
      cuerpo() {
        const T = [['Suave', 'osito'], ['Áspero', 'pina'], ['Duro', 'piedra'], ['Blando', 'esponja']];
        return T.map(([l, k], i) => { const x = 18 + (i % 2) * 90, y = 72 + Math.floor(i / 2) * 102;
          return caja(x, y, 84, 94, 8) + `<rect x="${x + 6}" y="${y + 26}" width="72" height="62" rx="5" fill="none" stroke="${GRIS}" stroke-width=".5" stroke-dasharray="2 1.6"/>` + dib(k, x + 6, y + 4, 18) + txt(x + 28, y + 17, l, 't-ley-g') + txt(x + 42, y + 60, 'Pega aquí', 't-hueco', 'text-anchor="middle"'); }).join('');
      } },
    { k: 'veoveo', n: 'Veo, veo en el fondo del mar', ins: ['Busca y cuenta.', 'Colorea un círculo por cada uno que encuentres.'],
      pie: 'Evalúa: atención visual, búsqueda y conteo hasta 4.',
      cuerpo() {
        const pos = [['pez', 30, 74, 22, -10], ['estrella', 150, 78, 20, 15], ['pez', 96, 92, 18, 8], ['concha', 46, 156, 18, -20], ['cangrejo', 120, 150, 24, 0], ['estrella', 70, 120, 16, -25],
          ['pez', 156, 118, 20, 12], ['concha', 168, 160, 16, 10], ['estrella', 24, 124, 18, 5], ['pez', 112, 120, 16, -6], ['caracola', 86, 160, 18, 0]];
        const escena = `<rect x="16" y="66" width="178" height="124" rx="8" fill="#fff" stroke="${K}" stroke-width=".5"/><path d="M16.3 172q30-6 60 0t60 0 57.4 0V181.5q0 8-8 8H24.3q-8 0-8-8z" fill="#fff" stroke="${K}" stroke-width=".4"/>`
          + pos.map(([k, x, y, t, r]) => `<g transform="rotate(${r} ${x + t / 2} ${y + t / 2})">${dib(k, x, y, t, true)}</g>`).join('');
        const cuenta = [['pez', 4], ['estrella', 3], ['concha', 2], ['cangrejo', 1]].map(([k, n], i) => { const y = 198 + i * 20;
          return dib(k, 26, y, 16, true) + Array.from({ length: 4 }, (_, j) => `<circle cx="${60 + j * 16}" cy="${y + 8}" r="6" fill="#fff" stroke="${K}" stroke-width=".5"/>`).join('') + `<rect x="138" y="${y + 1}" width="16" height="14" rx="3" fill="#fff" stroke="${GRIS}" stroke-width=".5"/>`; }).join('');
        return escena + cuenta + txt(162, 210, '← ¿cuántos?', 't-hueco');
      } },
    { k: 'pasaporte', n: 'Pasaporte de los sentidos', ins: ['Pega un gomet o pon un sello cada vez', 'que terminéis un juego de los sentidos.'],
      pie: 'Para casa: así sabrán las familias qué hemos aprendido.',
      cuerpo() {
        return S.SELLOS.map((s, i) => { const x = 18 + (i % 2) * 90, y = 72 + Math.floor(i / 2) * 66;
          const k = { sentidos: 'arcoiris', oido: 'oreja', vista: 'ojo', olfato: 'nariz', gusto: 'boca', tacto: 'mano' }[s.id];
          return caja(x, y, 84, 58, 8) + dib(k, x + 5, y + 6, 22) + txt(x + 31, y + 14, s.s, 't-ley-g') + txt(x + 31, y + 21, s.t, 't-mini')
            + `<circle cx="${x + 42}" cy="${y + 42}" r="11" fill="#fff" stroke="${GRIS}" stroke-width=".6" stroke-dasharray="1.6 1.2"/>${txt(x + 42, y + 43.4, 'sello', 't-hueco', 'text-anchor="middle"')}`; }).join('');
      } },
    { k: 'diploma', n: 'Diploma de los sentidos', ins: '',
      pie: 'La visita de Lolo · Los sentidos',
      cuerpo() {
        const org = ['ojo', 'oreja', 'nariz', 'boca', 'mano'];
        return `<rect x="14" y="44" width="182" height="228" rx="10" fill="#fff" stroke="${lineas ? K : '#E2C576'}" stroke-width="1.6"/><rect x="19" y="49" width="172" height="218" rx="7" fill="none" stroke="${lineas ? GRIS : '#F3E2AE'}" stroke-width=".6" stroke-dasharray="2 1.5"/>
          ${LOLO(105, 78, 1.9)}
          ${txt(105, 124, 'Diploma de', 't-dip-a', 'text-anchor="middle"')}
          ${txt(105, 140, 'Explorador o exploradora', 't-dip', 'text-anchor="middle"')}
          ${txt(105, 154, 'de los cinco sentidos', 't-dip', 'text-anchor="middle"')}
          <path d="M44 178h122" stroke="${GRIS}" stroke-width=".5"/>${txt(105, 185, 'nombre', 't-hueco', 'text-anchor="middle"')}
          ${org.map((k, i) => dib(k, 34 + i * 30, 196, 22)).join('')}
          ${txt(105, 234, 'Ya sé ver, oír, oler, saborear y tocar, y cuidar mis sentidos.', 't-nota', 'text-anchor="middle"')}
          <path d="M40 256h50M120 256h50" stroke="${GRIS}" stroke-width=".5"/>${txt(65, 262, 'Fecha', 't-hueco', 'text-anchor="middle"')}${txt(145, 262, 'Firma de la maestra o el maestro', 't-hueco', 'text-anchor="middle"')}`;
      } },
    { k: 'registro', n: 'Registro de observación', docente: true, ins: ['C: conseguido · EP: en proceso · I: iniciado.', 'Observad durante los juegos y en las actividades sin pantalla.'],
      pie: 'Ref.: Orden de 30 de mayo de 2023 (Andalucía), Anexo I: Crecimiento en Armonía 1.1 y Descubrimiento y Exploración del Entorno 1.1.',
      cuerpo() {
        const IND = [['1', 'Relaciona cada sentido con su órgano'], ['2', 'Discrimina sonidos: qué suena, fuerte o flojo'], ['3', 'Busca y encuentra con atención visual'],
          ['4', 'Distingue olores y sabe qué hacer si huele a humo'], ['5', 'Clasifica alimentos: dulce, salado, ácido'], ['6', 'Describe texturas: suave, áspero, duro, blando']];
        const x0 = 16, w0 = 58, cw = 20, y0 = 66, fh = 7.2, filas = 24;
        let s = `<rect x="${x0}" y="${y0}" width="${w0 + cw * 6}" height="${10 + fh * filas}" fill="#fff" stroke="${K}" stroke-width=".5"/>`;
        s += txt(x0 + 3, y0 + 6.6, 'Alumno o alumna', 't-th');
        IND.forEach(([n], i) => { s += txt(x0 + w0 + cw * i + cw / 2, y0 + 6.6, n, 't-th', 'text-anchor="middle"'); });
        s += `<path d="M${x0} ${y0 + 10}h${w0 + cw * 6}" stroke="${K}" stroke-width=".5"/>`;
        for (let r = 1; r < filas; r++) s += `<path d="M${x0} ${y0 + 10 + fh * r}h${w0 + cw * 6}" stroke="${SUAVE}" stroke-width=".3"/>`;
        for (let c = 0; c < 6; c++) s += `<path d="M${x0 + w0 + cw * c} ${y0}v${10 + fh * filas}" stroke="${c ? SUAVE : K}" stroke-width="${c ? .3 : .5}"/>`;
        const yI = y0 + 10 + fh * filas + 6;
        s += IND.map(([n, t], i) => txt(x0 + (i % 2) * 90, yI + Math.floor(i / 2) * 5.2, `${n}. ${t}`, 't-ind')).join('');
        return s;
      } }
  ];
  const porK = Object.fromEntries(F.map(f => [f.k, f]));

  /* ---------- estado ---------- */
  let op = { sel: F.map(f => f.k), nombre: true, lineas: false };
  try { const g = JSON.parse(lee('lolo-fichas-sentidos', 'null')); if (g && Array.isArray(g.sel)) op = { ...op, ...g, sel: g.sel.filter(k => porK[k]) }; } catch (e) {}
  if (location.hash === '#diploma') op.sel = ['diploma'];

  const mini = f => {
    const k = { une: 'mano', olores: 'nariz', sabores: 'boca', sonidos: 'oreja', tacto: 'osito', veoveo: 'ojo', pasaporte: 'arcoiris', diploma: 'estrella', registro: null }[f.k];
    return k ? `<svg viewBox="0 0 100 100" aria-hidden="true">${(S.ORGANOS[k] || S.C[k]).svg}</svg>` : '<svg viewBox="0 0 24 24" aria-hidden="true" class="ic-linea"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';
  };
  function pintaControles() {
    $('#disenos').innerHTML = F.map(f => `<button type="button" class="chip-trazo chip-dib" data-k="${f.k}" aria-pressed="${op.sel.includes(f.k)}"><span class="chip-ic">${mini(f)}</span><span class="chip-t"><b>${f.n}</b><br>${f.docente ? 'Para la docente' : f.k === 'diploma' ? 'Al completar el pasaporte' : f.pie.replace(/^Evalúa: /, '').replace(/^Para casa: .*/, 'Para llevar a casa')}</span><span class="chip-ok" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span></button>`).join('');
    $('#opNombre').checked = op.nombre; $('#opTinta').checked = op.lineas;
  }
  function genera() {
    lineas = !!op.lineas;
    const sel = F.filter(f => op.sel.includes(f.k)), o = { nombre: op.nombre };
    $('#hojas').innerHTML = sel.map((f, i) => `<div class="hoja-marco"><p class="hoja-num">Hoja ${i + 1} de ${sel.length} · ${esc(f.n)}</p><div class="hoja-caja"><div class="hoja">${marco(f, o, f.cuerpo())}</div></div></div>`).join('');
    const n = sel.length;
    $('#resumen').innerHTML = n ? `<b>${n} ${n === 1 ? 'hoja' : 'hojas'} A4</b> · una ficha por hoja` : 'Elige al menos una ficha';
    $('#vacio').hidden = n > 0;
    $$('.imprimir').forEach(b => { b.disabled = !n; });
    guarda('lolo-fichas-sentidos', JSON.stringify({ sel: op.sel, nombre: op.nombre, lineas: op.lineas }));
    escala();
  }
  function escala() { const v = $('#hojas'); if (!v) return; v.style.setProperty('--esc', Math.min(1, (v.clientWidth || 1) / (210 * 96 / 25.4)).toFixed(4)); }
  if ('ResizeObserver' in window) new ResizeObserver(escala).observe($('#hojas')); else addEventListener('resize', escala);

  $('#disenos').addEventListener('click', e => {
    const b = e.target.closest('.chip-trazo'); if (!b) return;
    const k = b.dataset.k, on = op.sel.includes(k);
    op.sel = on ? op.sel.filter(x => x !== k) : F.map(f => f.k).filter(x => x === k || op.sel.includes(x));
    b.setAttribute('aria-pressed', String(!on)); genera();
  });
  $('#todos').addEventListener('click', () => { op.sel = F.map(f => f.k); pintaControles(); genera(); });
  $('#ninguno').addEventListener('click', () => { op.sel = []; pintaControles(); genera(); });
  $('#opciones').addEventListener('change', e => {
    if (e.target.id === 'opNombre') op.nombre = e.target.checked;
    if (e.target.id === 'opTinta') op.lineas = e.target.checked;
    genera();
  });
  $('#opciones').addEventListener('submit', e => e.preventDefault());
  $$('.imprimir').forEach(b => b.addEventListener('click', () => { if (!b.disabled) window.print(); }));

  pintaControles();
  genera();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(escala);
})();
