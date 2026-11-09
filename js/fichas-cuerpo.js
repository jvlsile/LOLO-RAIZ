/* Fichas del cuerpo · La visita de Lolo
   Ocho fichas A4 para 3 años (una por hoja) y un registro de observación para la docente.
   Todo en SVG con medidas en milímetros (cada hoja mide 210 × 297 mm). Nico viene de js/cuerpo-dibujos.js. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const S = window.LOLO_SENTIDOS, CU = window.LOLO_CUERPO;
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
      ${txt(38, 20, 'El cuerpo · La visita de Lolo', 't-ante')}
      ${txt(38, 29.5, f.n, 't-titulo')}
      ${[].concat(f.ins || []).map((l, i) => txt(16, (conNombre ? 56 : 48) + i * 5.6, l, 't-ins')).join('')}
      ${nombre}
      ${cuerpo}
      <path d="M16 282h178" stroke="${SUAVE}" stroke-width=".35"/>
      ${txt(16, 288, f.pie || '', 't-pie')}
      ${f.docente ? '' : txt(194, 288, 'jvlsile.github.io/VISITA-DE-LOLO-', 't-pie', 'text-anchor="end"')}
    </svg>`;
  }

  /* Nico en (x, y) con altura h mm (la anchura es h × 0,625). */
  const nico = (x, y, h, o = {}) => `<svg x="${x}" y="${y}" width="${h * .625}" height="${h}" viewBox="0 0 200 320" overflow="visible">${CU.nico({ linea: lineas, ...o })}</svg>`;
  const parteD = (k, x, y, t) => { const s = CU.parte(k, { linea: lineas }).replace('<svg ', `<svg x="${x}" y="${y}" width="${t}" height="${t}" `); return s; };
  const gomet = (cx, cy, r, c) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${c || K}" stroke-width=".7" stroke-dasharray="1.4 1"/>`;
  // Convierte un punto de Nico (caja 200 × 320) a milímetros de la hoja.
  const en = (x0, y0, h) => ([px, py]) => [x0 + px * h / 320, y0 + py * h / 320];

  /* ---------- las fichas ---------- */
  const F = [
    { k: 'colorea', n: 'Colorea a Nico', ins: ['Colorea a Nico.', 'Dile a tu maestra: ¿qué partes del cuerpo has coloreado?'],
      pie: 'Evalúa: reconoce y nombra las partes del cuerpo al colorearlas.',
      cuerpo() { return nico(62, 66, 200, { linea: true }); } },
    { k: 'gomets', n: 'Gomets en las manos y los pies', ins: ['Pega un gomet rojo en cada mano', 'y un gomet azul en cada pie.'],
      pie: 'Evalúa: localiza manos y pies. Motricidad fina (pinza).',
      cuerpo() {
        const h = 196, x0 = 64, y0 = 70, p = en(x0, y0, h);
        return nico(x0, y0, h, { linea: true }) + CU.PUNTOS.manos.map(q => gomet(...p(q), 7.5, '#E5484D')).join('') + CU.PUNTOS.pies.map(q => gomet(...p(q), 7.5, '#3D8DF2')).join('')
          + `<circle cx="22" cy="80" r="4" fill="${lineas ? '#fff' : '#E5484D'}" stroke="${K}" stroke-width=".5"/>${txt(29, 81.5, 'Manos', 't-ley')}<circle cx="22" cy="92" r="4" fill="${lineas ? '#fff' : '#3D8DF2'}" stroke="${K}" stroke-width=".5"/>${txt(29, 93.5, 'Pies', 't-ley')}`;
      } },
    { k: 'cara', n: 'La cara de Nico', ins: ['Repasa los puntos: dibuja los ojos,', 'la nariz y la boca de Nico.'],
      pie: 'Evalúa: conoce las partes de la cara. Grafomotricidad (repasar).',
      cuerpo() {
        const cara = CU.nico({ linea: true, ocultar: ['ojos', 'nariz', 'boca', 'pierna-i', 'pierna-d', 'pie-i', 'pie-d', 'tronco', 'brazo-i', 'brazo-d', 'mano-i', 'mano-d', 'cuello'] }).replace(/<circle cx="(76|124)" cy="82"[^>]*\/>/g, '');
        const pt = 'fill="none" stroke="' + GRIS + '" stroke-width="2.6" stroke-dasharray="0.1 4.4" stroke-linecap="round"';
        return `<svg x="25" y="70" width="160" height="160" viewBox="40 6 120 120">${cara}<circle cx="84" cy="66" r="7.5" ${pt}/><circle cx="116" cy="66" r="7.5" ${pt}/><path d="M100 70q-7 11 2 13" ${pt}/><path d="M82 88q18 16 36 0" ${pt}/></svg>`
          + txt(105, 250, '¿Cuántos ojos tiene Nico?  ¿Y cuántas orejas?', 't-nota', 'text-anchor="middle"');
      } },
    { k: 'puzle', n: 'Monta a Nico', ins: ['Colorea las piezas. La maestra las recorta', 'y tú las pegas en su sitio.'],
      pie: 'Evalúa: compone la figura humana (cabeza, tronco, brazos y piernas).',
      cuerpo() {
        const h = 120, x0 = 20, y0 = 72;
        let s = `<rect x="${x0 - 2}" y="${y0 - 2}" width="${h * .625 + 4}" height="${h + 4}" rx="4" fill="#fff" stroke="${SUAVE}" stroke-width=".4"/><svg x="${x0}" y="${y0}" width="${h * .625}" height="${h}" viewBox="0 0 200 320" opacity=".28">${CU.nico({ linea: true })}</svg>`;
        s += txt(x0 + h * .3125, y0 + h + 8, 'Pega aquí', 't-hueco', 'text-anchor="middle"');
        const P = [['cabeza', 'cabeza'], ['tronco', 'tronco'], ['brazo', 'brazo-i'], ['brazo', 'brazo-d'], ['pierna', 'pierna-i'], ['pierna', 'pierna-d']];
        P.forEach(([t, z], i) => {
          const x = 108 + (i % 2) * 44, y = 72 + Math.floor(i / 2) * 48, [bx, by, bw, bh] = CU.CAJA[z], esc = 38 / Math.max(bw, bh), ver = { cabeza: ['cabeza', 'cuello'], tronco: ['tronco'], 'brazo-i': ['brazo-i', 'mano-i'], 'brazo-d': ['brazo-d', 'mano-d'], 'pierna-i': ['pierna-i', 'pie-i'], 'pierna-d': ['pierna-d', 'pie-d'] }[z];
          const todas = ['pierna-i', 'pierna-d', 'pie-i', 'pie-d', 'tronco', 'brazo-i', 'brazo-d', 'mano-i', 'mano-d', 'cuello', 'cabeza'];
          s += `<rect x="${x}" y="${y}" width="42" height="46" rx="2" fill="none" stroke="${K}" stroke-width=".4" stroke-dasharray="2 1.5"/>`
            + `<svg x="${x + 2}" y="${y + 2}" width="38" height="42" viewBox="${bx} ${by} ${bw} ${bh}" overflow="visible">${CU.nico({ linea: true, ocultar: todas.filter(p => !ver.includes(p)) })}</svg>`;
        });
        return s + `<g transform="translate(104 222)">${txt(0, 0, '✂  Las líneas de puntos son para recortar.', 't-hueco')}</g>`;
      } },
    { k: 'falta', n: '¿Qué le falta a Nico?', ins: ['Mira bien a cada Nico.', 'Dibuja lo que le falta.'],
      pie: 'Evalúa: observa y completa la figura humana.',
      cuerpo() {
        const R = [['brazo-i', 'mano-i'], ['boca'], ['pierna-d', 'pie-d']];
        return R.map((oc, i) => caja(16 + i * 61, 72, 56, 112, 6) + nico(21 + i * 61, 80, 96, { linea: true, ocultar: oc })).join('')
          + txt(105, 200, 'Después, señala en tu cuerpo la parte que faltaba.', 't-nota', 'text-anchor="middle"');
      } },
    { k: 'tarjetas', n: 'Tarjetas del cuerpo', ins: ['Recorta las tarjetas. Sirven para nombrar,', 'señalar y jugar a las parejas.'],
      pie: 'Para el aula: vocabulario con imagen, útil también como pictogramas.',
      cuerpo() {
        const T = [['cabeza', 'Cabeza', () => CU.parte('cabeza', { linea: lineas })], ['tronco', 'Barriga', () => CU.parte('tronco', { linea: lineas })], ['brazo', 'Brazo', () => CU.parte('brazo', { linea: lineas })], ['mano', 'Mano', () => `<svg viewBox="0 0 100 100">${S.ORGANOS.mano.svg}</svg>`],
          ['pierna', 'Pierna', () => CU.parte('pierna', { linea: lineas })], ['pie', 'Pie', () => CU.PIE], ['ojo', 'Ojos', () => `<svg viewBox="0 0 100 100">${S.ORGANOS.ojo.svg}</svg>`], ['boca', 'Boca', () => `<svg viewBox="0 0 100 100">${S.ORGANOS.boca.svg}</svg>`]];
        return T.map(([k, l, f], i) => { const x = 18 + (i % 2) * 88, y = 66 + Math.floor(i / 2) * 52;
          let svg = f(); if (lineas) svg = svg.replace(/fill="#([0-9A-Fa-f]{6})"/g, (m, h) => oscuro(h) ? m : 'fill="#fff"');
          return `<rect x="${x}" y="${y}" width="86" height="50" rx="5" fill="#fff" stroke="${K}" stroke-width=".5" stroke-dasharray="2 1.5"/>` + svg.replace('<svg ', `<svg x="${x + 4}" y="${y + 5}" width="40" height="40" `) + txt(x + 48, y + 29, l, 't-ley-g'); }).join('');
      } },
    { k: 'pasaporte', n: 'Pasaporte del cuerpo', ins: ['Pega un gomet o pon un sello cada vez', 'que terminéis un juego del cuerpo.'],
      pie: 'Para casa: así sabrán las familias qué hemos aprendido.',
      cuerpo() {
        return CU.SELLOS.map((s, i) => { const x = 18 + (i % 2) * 90, y = 72 + Math.floor(i / 2) * 66;
          return caja(x, y, 84, 58, 8) + nico(x + 6, y + 6, 46, { linea: lineas, saluda: s.id === 'toca', ropa: s.id === 'viste' ? { gorro: 1, bufanda: 1 } : {} }) + txt(x + 38, y + 14, s.t, 't-ley-g') + txt(x + 38, y + 21, s.s, 't-mini')
            + `<circle cx="${x + 58}" cy="${y + 40}" r="11" fill="#fff" stroke="${GRIS}" stroke-width=".6" stroke-dasharray="1.6 1.2"/>${txt(x + 58, y + 41.4, 'sello', 't-hueco', 'text-anchor="middle"')}`; }).join('');
      } },
    { k: 'diploma', n: 'Diploma del cuerpo', ins: '',
      pie: 'La visita de Lolo · El cuerpo',
      cuerpo() {
        return `<rect x="14" y="44" width="182" height="228" rx="10" fill="#fff" stroke="${lineas ? K : '#F2A08F'}" stroke-width="1.6"/><rect x="19" y="49" width="172" height="218" rx="7" fill="none" stroke="${lineas ? GRIS : '#F8D3C8'}" stroke-width=".6" stroke-dasharray="2 1.5"/>
          ${nico(86, 54, 62, { saluda: true, linea: lineas })}
          ${txt(105, 128, 'Diploma de', 't-dip-a', 'text-anchor="middle"')}
          ${txt(105, 144, 'Ya conozco mi cuerpo', 't-dip', 'text-anchor="middle"')}
          <path d="M44 172h122" stroke="${GRIS}" stroke-width=".5"/>${txt(105, 179, 'nombre', 't-hueco', 'text-anchor="middle"')}
          ${txt(105, 200, 'Sé dónde están mi cabeza, mi barriga, mis brazos,', 't-nota', 'text-anchor="middle"')}${txt(105, 206, 'mis manos, mis piernas y mis pies, y para qué sirven.', 't-nota', 'text-anchor="middle"')}
          ${LOLO(105, 228, 1.2)}
          <path d="M40 256h50M120 256h50" stroke="${GRIS}" stroke-width=".5"/>${txt(65, 262, 'Fecha', 't-hueco', 'text-anchor="middle"')}${txt(145, 262, 'Firma de la maestra o el maestro', 't-hueco', 'text-anchor="middle"')}`;
      } },
    { k: 'registro', n: 'Registro de observación', docente: true, ins: ['C: conseguido · EP: en proceso · I: iniciado.', 'Observad durante los juegos y en las actividades sin pantalla.'],
      pie: 'Ref.: Orden de 30 de mayo de 2023 (Andalucía), Anexo I: Crecimiento en Armonía 1.1.',
      cuerpo() {
        const IND = [['1', 'Señala cabeza, barriga, brazos, manos, piernas y pies'], ['2', 'Nombra las partes del cuerpo'], ['3', 'Señala ojos, nariz, boca y orejas'],
          ['4', 'Compone la figura humana'], ['5', 'Sabe para qué sirven manos, piernas y brazos'], ['6', 'Asocia cada prenda a su parte del cuerpo']];
        const x0 = 16, w0 = 58, cw = 20, y0 = 66, fh = 7.2, filas = 24;
        let s = `<rect x="${x0}" y="${y0}" width="${w0 + cw * 6}" height="${10 + fh * filas}" fill="#fff" stroke="${K}" stroke-width=".5"/>`;
        s += txt(x0 + 3, y0 + 6.6, 'Alumno o alumna', 't-th');
        IND.forEach(([n], i) => { s += txt(x0 + w0 + cw * i + cw / 2, y0 + 6.6, n, 't-th', 'text-anchor="middle"'); });
        s += `<path d="M${x0} ${y0 + 10}h${w0 + cw * 6}" stroke="${K}" stroke-width=".5"/>`;
        for (let r = 1; r < filas; r++) s += `<path d="M${x0} ${y0 + 10 + fh * r}h${w0 + cw * 6}" stroke="${SUAVE}" stroke-width=".3"/>`;
        for (let c = 0; c < 6; c++) s += `<path d="M${x0 + w0 + cw * c} ${y0}v${10 + fh * filas}" stroke="${c ? SUAVE : K}" stroke-width="${c ? .3 : .5}"/>`;
        const yI = y0 + 10 + fh * filas + 6;
        return s + IND.map(([n, t], i) => txt(x0 + (i % 2) * 90, yI + Math.floor(i / 2) * 5.2, `${n}. ${t}`, 't-ind')).join('');
      } }
  ];
  const porK = Object.fromEntries(F.map(f => [f.k, f]));

  /* ---------- estado ---------- */
  let op = { sel: F.map(f => f.k), nombre: true, lineas: false };
  try { const g = JSON.parse(lee('lolo-fichas-cuerpo', 'null')); if (g && Array.isArray(g.sel)) op = { ...op, ...g, sel: g.sel.filter(k => porK[k]) }; } catch (e) {}
  if (location.hash === '#diploma') op.sel = ['diploma'];

  const mini = f => {
    if (f.k === 'registro') return '<svg viewBox="0 0 24 24" aria-hidden="true" class="ic-linea"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';
    if (f.k === 'cara') return CU.parte('cabeza');
    if (f.k === 'tarjetas') return CU.parte('brazo');
    const o = { colorea: { linea: true }, gomets: {}, puzle: { ocultar: ['cabeza'] }, falta: { ocultar: ['brazo-i', 'mano-i'] }, pasaporte: { saluda: true }, diploma: { ropa: { gorro: 1 } } }[f.k] || {};
    return `<svg viewBox="0 0 200 320" aria-hidden="true">${CU.nico(o)}</svg>`;
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
    guarda('lolo-fichas-cuerpo', JSON.stringify({ sel: op.sel, nombre: op.nombre, lineas: op.lineas }));
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
