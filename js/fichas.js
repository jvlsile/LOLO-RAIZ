/* Fichas de trazos para imprimir · La visita de Lolo
   Genera fichas de los ocho trazos, dos por hoja A4 (cada una de 210 × 148,5 mm, en vertical se corta por la mitad).
   Todo se dibuja en SVG con medidas en milímetros, así se imprime nítido y a tamaño real. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const lee = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
  const guarda = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const r2 = n => Math.round(n * 100) / 100;

  const K = '#13263F', GRIS = '#4F6379', TEAL = '#0B7A8F', VERDE = '#2BB673', SOL = '#FFC93C', NARANJA = '#FF7A2F';

  /* ---------- los ocho trazos (caja unidad: x e y de 0 a 1, y hacia abajo) ---------- */
  const espiral = t => { const a = -Math.PI / 2 - t * 2.5 * 2 * Math.PI, r = .5 - t * .44; return [.5 + Math.cos(a) * r, .5 + Math.sin(a) * r]; };
  const TRAZOS = [
    { k: 'tronco', n: 'El Tronco', tipo: 'vertical', como: 'De arriba abajo.', a: .22, g: .55, tr: [t => [.5, t]] },
    { k: 'rama', n: 'La Rama Dormida', tipo: 'horizontal', como: 'De izquierda a derecha.', a: 1.9, g: .4, tr: [t => [t, .5]] },
    { k: 'sonrisa', n: 'La Sonrisa de la Hoja', tipo: 'curva', como: 'Bajamos… y subimos.', a: 1.35, g: .4,
      tr: [t => { const u = 1 - t; return [t, u * u * .05 + 2 * u * t * 1.85 + t * t * .05]; }] },
    { k: 'fruto', n: 'El Fruto', tipo: 'círculo', como: 'Empezamos arriba y damos la vuelta.', a: 1, g: .4,
      tr: [t => { const a = -Math.PI / 2 - t * 2 * Math.PI; return [.5 + Math.cos(a) * .5, .5 + Math.sin(a) * .5]; }] },
    { k: 'rayo', n: 'El Rayo entre las Ramas', tipo: 'zigzag', como: 'Arriba, abajo, arriba, abajo.', cont: 'zig' },
    { k: 'gusano', n: 'El Gusanito de la Tierra', tipo: 'onda', como: 'Sube y baja, despacito.', cont: 'onda' },
    { k: 'cruz', n: 'Las Ramas que se Cruzan', tipo: 'cruz', como: 'Primero de arriba abajo; luego, de lado a lado.', a: 1, g: .45, tr: [t => [.5, t], t => [t, .5]] },
    { k: 'caracol', n: 'El Caracol de la Raíz', tipo: 'espiral', como: 'De fuera hacia dentro.', a: 1, g: .35, tr: [espiral], muestras: 180 }
  ];
  const porK = Object.fromEntries(TRAZOS.map((t, i) => [t.k, { ...t, num: i + 1 }]));

  const NIVELES = {
    prog: { t: 'Progresiva', d: 'Cada fila con menos ayuda: repasar, puntos y solo inicio.' },
    rep: { t: 'Repasar', d: 'El trazo entero en gris claro para pasar por encima.' },
    pun: { t: 'Puntos', d: 'Puntos que se unen siguiendo el camino.' },
    ini: { t: 'Inicio y final', d: 'Solo el punto verde y la estrella.' }
  };
  const FILAS = { 3: 3, 4: 4, 5: 5 };

  /* ---------- geometría ---------- */
  // Trazos (listas de puntos en mm) dentro de una caja x, y, w, h.
  function trazosEn(T, x, y, w, h) {
    if (T.cont === 'zig') {
      const k = Math.max(4, 2 * Math.round(w / h / 1.1));
      return [Array.from({ length: k + 1 }, (_, i) => [x + w * i / k, y + (i % 2 ? 0 : h)])];
    }
    if (T.cont === 'onda') {
      const p = Math.max(2, Math.round(w / h / 1.4)), N = 48 * p;
      return [Array.from({ length: N + 1 }, (_, i) => { const t = i / N; return [x + w * t, y + h * (.5 - .46 * Math.sin(2 * Math.PI * p * t))]; })];
    }
    const N = T.muestras || 72;
    return T.tr.map(fn => Array.from({ length: N + 1 }, (_, i) => { const [u, v] = fn(i / N); return [x + u * w, y + v * h]; }));
  }
  const camino = pts => pts.map((p, i) => (i ? 'L' : 'M') + r2(p[0]) + ' ' + r2(p[1])).join('');
  const largo = pts => pts.reduce((s, p, i) => i ? s + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0, 0);
  // Punto y dirección a una distancia d del inicio, recorriendo la línea.
  function enLargo(pts, d) {
    let s = 0;
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], l = Math.hypot(bx - ax, by - ay);
      if (s + l >= d && l > 0) { const f = (d - s) / l; return { x: ax + (bx - ax) * f, y: ay + (by - ay) * f, dx: (bx - ax) / l, dy: (by - ay) / l }; }
      s += l;
    }
    const a = pts[pts.length - 2], b = pts[pts.length - 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return { x: b[0], y: b[1], dx: (b[0] - a[0]) / l, dy: (b[1] - a[1]) / l };
  }
  function puntosCada(pts, paso) {
    const L = largo(pts), n = Math.max(2, Math.round(L / paso));
    return Array.from({ length: n + 1 }, (_, i) => enLargo(pts, L * i / n));
  }
  const estrella = (cx, cy, r, relleno, borde, gr) => {
    let d = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + r2(cx + Math.cos(a) * rr) + ' ' + r2(cy + Math.sin(a) * rr); }
    return `<path d="${d}Z" fill="${relleno}" stroke="${borde}" stroke-width="${gr}" stroke-linejoin="round"/>`;
  };
  const cerrado = pts => { const a = pts[0], b = pts[pts.length - 1]; return Math.hypot(a[0] - b[0], a[1] - b[1]) < 1; };

  /* Un trazo con su nivel de ayuda. */
  function pinta(trazos, nivel, ch, o) {
    const banda = Math.max(1.7, Math.min(3.2, ch * .1)), paso = Math.max(2.5, Math.min(4.4, ch * .12));
    const rIni = ch > 24 ? 1.55 : 1.3, rFin = ch > 24 ? 2 : 1.7;
    let s = '';
    trazos.forEach(pts => {
      const d = camino(pts);
      if (nivel === 'rep') s += `<path d="${d}" fill="none" stroke="${o.tinta ? '#DDE4EA' : '#D2E3EA'}" stroke-width="${r2(banda)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#8FA2B2" stroke-width=".42" stroke-dasharray="1.3 1.1" stroke-linecap="round" stroke-linejoin="round"/>`;
      else if (nivel === 'pun') s += puntosCada(pts, paso).map(p => `<circle cx="${r2(p.x)}" cy="${r2(p.y)}" r=".62" fill="#6E8196"/>`).join('');
      else if (o.sombra) s += `<path d="${d}" fill="none" stroke="#EBF1F4" stroke-width="${r2(banda * .65)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    });
    // inicio y final, encima de todo
    trazos.forEach(pts => {
      const a = pts[0], b = pts[pts.length - 1];
      if (!cerrado(pts)) s += estrella(b[0], b[1], rFin, o.tinta ? '#fff' : SOL, K, .3);
      s += `<circle cx="${r2(a[0])}" cy="${r2(a[1])}" r="${rIni}" fill="${VERDE}" stroke="#fff" stroke-width=".4"/>`;
    });
    return s;
  }

  /* El modelo: el trazo entero en color, con el punto de inicio y una flecha de dirección. */
  function modelo(T, x, y, w, h, o) {
    const a = T.cont ? 2.1 : T.a;
    let uh = Math.min(h, w / a), uw = uh * a;
    if (T.k === 'tronco') { uh = h; uw = 6; }
    if (T.k === 'rama') { uw = w; uh = 6; }
    const ux = x + (w - uw) / 2, uy = y + (h - uh) / 2;
    const trs = T.cont ? trazosEn(T, ux, uy, uw, uh) : trazosEn(T, ux, uy, uw, uh);
    let s = trs.map(pts => `<path d="${camino(pts)}" fill="none" stroke="${o.tinta ? K : TEAL}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
    trs.forEach((pts, i) => {
      const L = largo(pts), p = enLargo(pts, trs.length > 1 ? L * .26 : Math.min(L * .42, 14 + L * .1)), z = 2.4;
      const nx = -p.dy, ny = p.dx;
      s += `<path d="M${r2(p.x + p.dx * z)} ${r2(p.y + p.dy * z)}L${r2(p.x - p.dx * z * .6 + nx * z * .9)} ${r2(p.y - p.dy * z * .6 + ny * z * .9)}L${r2(p.x - p.dx * z * .6 - nx * z * .9)} ${r2(p.y - p.dy * z * .6 - ny * z * .9)}Z" fill="${o.tinta ? K : NARANJA}" stroke="#fff" stroke-width=".35" stroke-linejoin="round"/>`;
    });
    trs.forEach((pts, i) => {
      const [sx, sy] = pts[0], b = pts[pts.length - 1];
      if (!cerrado(pts)) s += estrella(b[0], b[1], 2.1, o.tinta ? '#fff' : SOL, K, .3);
      s += `<circle cx="${r2(sx)}" cy="${r2(sy)}" r="2.2" fill="${VERDE}" stroke="#fff" stroke-width=".5"/>`;
      if (trs.length > 1) s += `<text x="${r2(sx)}" y="${r2(sy + 1.05)}" text-anchor="middle" class="t-num-mini">${i + 1}</text>`;
    });
    return s;
  }

  /* ---------- dibujos para colorear (caja de 40 × 40) ---------- */
  const hojaD = (x, y, g, e = 1) => `<g transform="translate(${x} ${y}) rotate(${g}) scale(${e})"><path d="M0 0C3-3.4 8.6-3.4 12 0C8.6 3.4 3 3.4 0 0Z"/><path d="M1.5 0H10"/></g>`;
  const DIBUJOS = {
    tronco: `<path d="M5 37.5h30"/><path d="M17 37.5V22h6v15.5"/><circle cx="12.5" cy="18" r="7.5"/><circle cx="27.5" cy="18" r="7.5"/><circle cx="20" cy="11.5" r="9"/>`,
    rama: `<path d="M2.5 23Q20 19 37.5 21.5V24.5Q20 22 2.5 26Z"/>${hojaD(9, 22, -60, .95)}${hojaD(19, 21, -110, .95)}${hojaD(27, 22.5, 60, .95)}${hojaD(33, 22.5, -50, .95)}<circle cx="31" cy="8" r="4"/><path d="M31 1.5v1.8M31 12.7v1.8M24.5 8h1.8M35.7 8h1.8M26.4 3.4l1.3 1.3M34.3 11.3l1.3 1.3M35.6 3.4l-1.3 1.3"/>`,
    sonrisa: `<path d="M20 3.5C33 10.5 36 25.5 26.5 34.5Q22.5 37.5 20 37.5Q17.5 37.5 13.5 34.5C4 25.5 7 10.5 20 3.5Z"/><path d="M20 37.5v2"/><circle cx="15" cy="19" r="1.5" fill="${K}"/><circle cx="25" cy="19" r="1.5" fill="${K}"/><path d="M14 25q6 6 12 0"/>`,
    fruto: `<path d="M20 12.5c-6-4-15.5-1-15.5 9.5 0 9 7 15.5 11 15.5 2 0 3-1 4.5-1s2.5 1 4.5 1c4 0 11-6.5 11-15.5 0-10.5-9.5-13.5-15.5-9.5Z"/><path d="M20 12.5c0-3 1-6 3-8"/><path d="M22.5 8.5c3-4 8-4.5 10.5-2.5-3 3.2-7.5 4.4-10.5 2.5Z"/><path d="M11 18q-2 3-1 6"/>`,
    rayo: `<path d="M9.5 22.5a6 6 0 0 1 .5-12 8.5 8.5 0 0 1 16-3 7 7 0 0 1 5.5 15Z"/><path d="M20 22.5l-4.5 8.5h5l-3 8 9.5-11h-5.5l3-5.5"/><path d="M8 27l-1.5 4M31 27l-1.5 4"/>`,
    gusano: `<path d="M2.5 36.5h35"/><circle cx="7" cy="30" r="3.4"/><circle cx="12" cy="27" r="3.4"/><circle cx="17" cy="29" r="3.4"/><circle cx="22" cy="31" r="3.4"/><circle cx="27" cy="28.5" r="3.4"/><circle cx="32" cy="23.5" r="4.8"/><circle cx="30.4" cy="22.6" r=".8" fill="${K}"/><circle cx="33.8" cy="22.6" r=".8" fill="${K}"/><path d="M30.6 25.4q1.6 1.3 3.2 0"/><path d="M5 36.5q-1-5 1-8M9 36.5q1-4 3-6M36 36.5q1-5-1-8"/><circle cx="9" cy="9" r="2.4"/><circle cx="9" cy="4.6" r="2.2"/><circle cx="13.2" cy="9" r="2.2"/><circle cx="9" cy="13.4" r="2.2"/><circle cx="4.8" cy="9" r="2.2"/><circle cx="9" cy="9" r="1.6"/><path d="M9 15.6V22"/>`,
    cruz: `<path d="M20 2.5v35M3 25h34"/><ellipse cx="22.5" cy="17.5" rx="7" ry="5.4"/><circle cx="29" cy="11.5" r="3.6"/><path d="M32.4 10.6l3 1-3 1.2"/><circle cx="29.8" cy="10.8" r=".7" fill="${K}"/><path d="M18.5 16q4 5 9 1"/><path d="M15.5 15.5l-4.5-3v6.5z"/><path d="M21 22.6v2.4M25 22.4v2.6"/>`,
    caracol: `<circle cx="17" cy="21" r="11"/><path d="${(() => { let d = ''; for (let i = 0; i <= 60; i++) { const t = i / 60, a = -Math.PI / 2 - t * 2 * 2 * Math.PI, r = 9 - t * 8; d += (i ? 'L' : 'M') + r2(17 + Math.cos(a) * r) + ' ' + r2(21 + Math.sin(a) * r); } return d; })()}"/><path d="M4 35Q20 37 33 33.5Q37.5 31.5 36.5 26.5L31.5 26.5Q30.5 31 27 31.5L9 32Q4.5 32.5 4 35Z"/><path d="M33 27l-2-7.5M35.6 27l2.2-7"/><circle cx="30.8" cy="18.6" r="1.2"/><circle cx="38" cy="19.2" r="1.2"/>`
  };

  /* ---------- una ficha (210 × 148,4 mm) ---------- */
  function partir(txt, max) {
    const l = []; let a = '';
    txt.split(' ').forEach(w => { if ((a + ' ' + w).trim().length > max && a) { l.push(a); a = w; } else a = (a + ' ' + w).trim(); });
    if (a) l.push(a); return l;
  }
  function ficha(k, nivel, edad, o) {
    const T = porK[k], R = FILAS[edad];
    let s = '';
    // cabecera
    s += `<circle cx="14" cy="15.6" r="4.6" fill="${o.tinta ? '#fff' : TEAL}" stroke="${o.tinta ? K : 'none'}" stroke-width=".4"/><text x="14" y="17.55" text-anchor="middle" class="t-num" fill="${o.tinta ? K : '#fff'}">${T.num}</text>`;
    s += `<text x="21.5" y="17.1" class="t-titulo">${T.n}</text><text x="21.5" y="23" class="t-sub">${T.tipo} · ${T.como.replace(/\.$/, '')}</text>`;
    if (o.nombre) s += `<text x="122" y="16.4" class="t-campo">Nombre</text><path d="M137 17H201"/><text x="122" y="24.2" class="t-campo">Fecha</text><path d="M137 24.8H172"/>`.replace(/<path /g, '<path stroke="#9FB0BD" stroke-width=".35" ');
    else s += `<text x="201" y="17.1" text-anchor="end" class="t-campo">${NIVELES[nivel].t}</text>`;
    // columna del modelo y del dibujo
    const Y0 = 30, Y1 = 134, colX = 9, colW = 46, dib = o.colorear;
    const mY1 = dib ? 82 : Y1;
    s += `<rect x="${colX}" y="${Y0}" width="${colW}" height="${mY1 - Y0}" rx="4" fill="${o.tinta ? '#fff' : '#E8F5F7'}" stroke="${o.tinta ? '#C9D6DF' : 'none'}" stroke-width=".35"/>`;
    s += `<text x="${colX + 4}" y="${Y0 + 5.6}" class="t-eti" fill="${o.tinta ? GRIS : TEAL}">MIRA</text>`;
    const lineas = partir(T.como, 21), altoTxt = lineas.length * 3.9 + 2;
    s += modelo(T, colX + 5.5, Y0 + 11, colW - 11, mY1 - Y0 - 15 - altoTxt, o);
    lineas.forEach((l, i) => { s += `<text x="${colX + colW / 2}" y="${r2(mY1 - altoTxt + 2.6 + i * 3.9)}" text-anchor="middle" class="t-como">${l}</text>`; });
    if (dib) {
      s += `<rect x="${colX}" y="86" width="${colW}" height="${Y1 - 86}" rx="4" fill="#fff" stroke="#C9D6DF" stroke-width=".35" stroke-dasharray="1.4 1"/>`;
      s += `<text x="${colX + 4}" y="91.6" class="t-eti" fill="${GRIS}">COLOREA</text>`;
      s += `<g transform="translate(${colX + 5.5} 94) scale(.875)" fill="#fff" stroke="${K}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">${DIBUJOS[k]}</g>`;
    }
    // filas de práctica
    const RX = 60, RW = 201 - RX, gapF = 3, rh = (Y1 - Y0 - gapF * (R - 1)) / R, px = 4.5, py = 2.6, ch = rh - py * 2;
    for (let i = 0; i < R; i++) {
      const ry = Y0 + i * (rh + gapF), nv = nivel === 'prog' ? ['rep', 'pun', 'ini'][Math.floor(i * 3 / R)] : nivel;
      s += `<rect x="${RX}" y="${r2(ry)}" width="${RW}" height="${r2(rh)}" rx="3" fill="${o.tinta ? '#fff' : '#F6FAFB'}" stroke="${o.tinta ? '#D3DEE6' : '#E3ECF1'}" stroke-width=".35"/>`;
      const W = RW - px * 2, x0 = RX + px, y0 = ry + py;
      let trs = [];
      if (T.cont) trs = trazosEn(T, x0 + 1.5, y0, W - 3, ch);
      else {
        let uw = ch * T.a, gap = ch * T.g;
        if (T.k === 'tronco') { uw = 4; gap = Math.max(8, ch * .42); }
        if (T.k === 'rama') { uw = Math.min(W, Math.max(30, ch * 2.1)); gap = 9; }
        const n = Math.max(1, Math.floor((W + gap) / (uw + gap))), tot = n * uw + (n - 1) * gap, sx = x0 + (W - tot) / 2;
        for (let j = 0; j < n; j++) trs.push(...trazosEn(T, sx + j * (uw + gap), y0, uw, ch));
        if (T.k === 'rama') { // líneas tumbadas: varias por fila, apiladas
          trs = []; const filas = ch > 22 ? 3 : 2, dy = ch / filas;
          const n2 = Math.max(1, Math.floor((W + gap) / (uw + gap))), tot2 = n2 * uw + (n2 - 1) * gap, sx2 = x0 + (W - tot2) / 2;
          for (let f = 0; f < filas; f++) for (let j = 0; j < n2; j++) trs.push(...trazosEn(T, sx2 + j * (uw + gap), y0 + dy * f, uw, dy));
        }
      }
      s += pinta(trs, nv, ch, { ...o, sombra: !['tronco', 'rama', 'cruz'].includes(T.k) });
    }
    // pie
    s += `<g transform="translate(11.5 139.1)"><circle r="2.3" fill="${o.tinta ? '#fff' : NARANJA}" stroke="${o.tinta ? K : 'none'}" stroke-width=".3"/><circle cx="-.8" cy="-.3" r=".55" fill="#fff"/><circle cx=".8" cy="-.3" r=".55" fill="#fff"/><circle cx="-.75" cy="-.25" r=".28" fill="${K}"/><circle cx=".85" cy="-.25" r=".28" fill="${K}"/></g>`;
    s += `<text x="15.4" y="140.1" class="t-pie">La visita de Lolo · Trazos · ${T.num} de 8</text>`;
    s += `<text x="201" y="140.1" text-anchor="end" class="t-pie">${nivel === 'prog' ? 'Repasa · Une los puntos · Solo' : NIVELES[nivel].t}</text>`;
    return `<svg class="ficha-trazo" viewBox="0 0 210 148.4" role="img" aria-label="Ficha ${T.num}: ${T.n}, trazo ${T.tipo}. Ayuda: ${NIVELES[nivel].t}." xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  }

  /* ---------- estado y opciones ---------- */
  const DEF = { trazos: TRAZOS.map(t => t.k), nivel: 'prog', edad: '4', modo: 'iguales', nombre: true, colorear: true, tinta: false };
  let op = { ...DEF };
  try { const g = JSON.parse(lee('raiz-fichas', 'null')); if (g && typeof g === 'object') op = { ...DEF, ...g }; } catch (e) {}
  op.trazos = (op.trazos || []).filter(k => porK[k]);
  // Enlace directo: fichas.html?t=caracol (o varios: ?t=tronco,rama)
  try {
    const t = new URLSearchParams(location.search).get('t');
    if (t) { const ks = t.split(',').filter(k => porK[k]); if (ks.length) op.trazos = ks; }
  } catch (e) {}

  const mini = T => `<svg viewBox="0 0 24 24" aria-hidden="true">${(() => {
    const trs = T.cont ? trazosEn(T, 2, 5, 20, 14) : trazosEn(T, ...(T.k === 'tronco' ? [12, 3, 0, 18] : T.k === 'rama' ? [3, 12, 18, 0] : (() => { const h = Math.min(18, 18 / T.a); return [12 - h * T.a / 2, 12 - h / 2, h * T.a, h]; })()));
    return trs.map(p => `<path d="${camino(p)}"/>`).join('');
  })()}</svg>`;

  function pintaControles() {
    $('#trazos').innerHTML = TRAZOS.map((T, i) => `<button type="button" class="chip-trazo" data-k="${T.k}" aria-pressed="${op.trazos.includes(T.k)}"><span class="chip-ic">${mini(T)}</span><span class="chip-t"><b>${i + 1}</b> ${T.n}</span><span class="chip-ok" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></button>`).join('');
    $$('input[name="nivel"]').forEach(r => r.checked = r.value === op.nivel);
    $$('input[name="edad"]').forEach(r => r.checked = r.value === String(op.edad));
    $$('input[name="modo"]').forEach(r => r.checked = r.value === op.modo);
    $('#opNombre').checked = !!op.nombre; $('#opColorear').checked = !!op.colorear; $('#opTinta').checked = !!op.tinta;
  }

  function hojas() {
    const sel = TRAZOS.map(t => t.k).filter(k => op.trazos.includes(k));
    if (op.modo === 'iguales') return sel.map(k => [k, k]);
    const r = [];
    for (let i = 0; i < sel.length; i += 2) r.push([sel[i], sel[i + 1] || sel[i]]);
    return r;
  }

  const TIJERA = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/></svg>';
  function genera() {
    const H = hojas(), o = { nombre: op.nombre, colorear: op.colorear, tinta: op.tinta };
    $('#hojas').innerHTML = H.map(([a, b], i) => `<div class="hoja-marco"><p class="hoja-num">Hoja ${i + 1} de ${H.length}</p><div class="hoja-caja"><div class="hoja${op.tinta ? ' tinta' : ''}">${ficha(a, op.nivel, op.edad, o)}<div class="corte" aria-hidden="true">${TIJERA}</div>${ficha(b, op.nivel, op.edad, o)}</div></div></div>`).join('');
    const n = H.length;
    $('#resumen').innerHTML = n ? `<b>${n} ${n === 1 ? 'hoja' : 'hojas'} A4</b> · ${n * 2} fichas` : 'Elige al menos un trazo';
    $('#vacio').hidden = n > 0;
    $$('.imprimir').forEach(b => { b.disabled = !n; b.setAttribute('aria-disabled', String(!n)); });
    $('#nivelDesc').textContent = NIVELES[op.nivel].d;
    guarda('raiz-fichas', JSON.stringify(op));
    escala();
  }

  /* Vista previa: las hojas a tamaño real, reducidas para caber en pantalla. */
  function escala() {
    const v = $('#hojas'); if (!v) return;
    const mm = 96 / 25.4, ancho = v.clientWidth || 1, e = Math.min(1, ancho / (210 * mm));
    v.style.setProperty('--esc', e.toFixed(4));
  }
  if ('ResizeObserver' in window) new ResizeObserver(escala).observe($('#hojas')); else addEventListener('resize', escala);

  /* ---------- eventos ---------- */
  $('#trazos').addEventListener('click', e => {
    const b = e.target.closest('.chip-trazo'); if (!b) return;
    const k = b.dataset.k, on = op.trazos.includes(k);
    op.trazos = on ? op.trazos.filter(x => x !== k) : [...op.trazos, k];
    b.setAttribute('aria-pressed', String(!on)); genera();
  });
  $('#todos').addEventListener('click', () => { op.trazos = TRAZOS.map(t => t.k); pintaControles(); genera(); });
  $('#ninguno').addEventListener('click', () => { op.trazos = []; pintaControles(); genera(); });
  $('#opciones').addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'nivel' || t.name === 'edad' || t.name === 'modo') op[t.name] = t.value;
    if (t.id === 'opNombre') op.nombre = t.checked;
    if (t.id === 'opColorear') op.colorear = t.checked;
    if (t.id === 'opTinta') op.tinta = t.checked;
    genera();
  });
  $('#opciones').addEventListener('submit', e => e.preventDefault());
  $$('.imprimir').forEach(b => b.addEventListener('click', () => { if (!b.disabled) window.print(); }));

  pintaControles();
  genera();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(escala);
})();
