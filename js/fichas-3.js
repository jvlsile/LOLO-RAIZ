/* Fichas para 3 años · La visita de Lolo
   Gomets, picado con punzón, flecos para recortar y colorear en grande. Dos fichas por hoja A4.
   Todo en SVG con medidas en milímetros (cada ficha mide 210 × 148,4 mm). */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const lee = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
  const guarda = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const r2 = n => Math.round(n * 100) / 100;
  const K = '#13263F', GRIS = '#8FA2B2', NARANJA = '#FF7A2F';
  let tinta = false;

  /* ---------- piezas de dibujo (mm) ---------- */
  const gomet = (x, y, r = 6.6) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="#fff" stroke="${K}" stroke-width=".55" stroke-dasharray="1.3 1"/>`;
  const L = (w = 1) => `fill="#fff" stroke="${K}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
  // Varios círculos unidos en una sola silueta (nube, copa de árbol): borde fuera, sin líneas dentro.
  const nube = (cs, w = 1) => cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${K}" stroke-width="${w * 2}"/>`).join('') + cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('');
  const estrellaD = (cx, cy, R, r) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R; d += (i ? 'L' : 'M') + r2(cx + Math.cos(a) * q) + ' ' + r2(cy + Math.sin(a) * q); } return d + 'Z'; };
  const carita = (x, y, e = 1) => `<g transform="translate(${x} ${y}) scale(${e})"><circle cx="-3.4" cy="-1.5" r="1.3" fill="${K}"/><circle cx="3.4" cy="-1.5" r="1.3" fill="${K}"/><path d="M-3 2.6q3 2.6 6 0" fill="none" stroke="${K}" stroke-width=".7" stroke-linecap="round"/></g>`;
  const TIJERA = (x, y) => `<g transform="translate(${x} ${y})" fill="none" stroke="${K}" stroke-width=".6" stroke-linecap="round"><circle cx="-2.4" cy="2.6" r="1.5"/><circle cx="2.4" cy="2.6" r="1.5"/><path d="M-1.4 1.4L1.6-4M1.4 1.4L-1.6-4"/></g>`;
  // Línea de corte desde el borde inferior de la ficha hasta «hasta».
  const corte = (x, hasta) => `<path d="M${r2(x)} 148.4V${r2(hasta)}" stroke="${K}" stroke-width=".7" stroke-dasharray="2.4 1.6"/><circle cx="${r2(x)}" cy="${r2(hasta)}" r="1.1" fill="${K}"/>`;

  const FORMA = { // siluetas en una caja de 100 × 100
    manzana: 'M50 31c-15-10-39-2.5-39 24 0 22.5 17.5 39 27.5 39 5 0 7.5-2.5 11.5-2.5s6.5 2.5 11.5 2.5c10 0 27.5-16.5 27.5-39 0-26.5-24-34-39-24Z',
    hoja: 'M50 6C82 24 90 62 66 86Q56 94 50 94Q44 94 34 86C10 62 18 24 50 6Z',
    estrella: estrellaD(50, 53, 47, 21),
    corazon: 'M50 90S8 64 8 34A21 21 0 0 1 50 24a21 21 0 0 1 42 10c0 30-42 56-42 56z',
    pez: 'M24 50C36 22 74 20 94 50C74 80 36 78 24 50ZM24 50L6 32V68Z',
    casa: 'M12 48L50 12L88 48V92H12Z'
  };
  const forma = (k, cx, cy, tam, w) => `<g transform="translate(${r2(cx - tam / 2)} ${r2(cy - tam / 2)}) scale(${tam / 100})"><path d="${FORMA[k]}" fill="#fff" stroke="${K}" stroke-width="${r2(w * 100 / tam)}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  const loloTubos = (cx, cy, e) => { // tentáculos con doble trazo: quedan huecos para colorear
    const T = [[-34, 20, -48, 44, -42, 66], [-20, 28, -28, 54, -24, 72], [-6, 30, -8, 56, -10, 76], [8, 30, 10, 56, 10, 76], [22, 28, 30, 54, 26, 72], [34, 20, 48, 44, 42, 66]];
    const d = T.map(([x0, y0, qx, qy, x1, y1]) => `M${x0} ${y0}Q${qx} ${qy} ${x1} ${y1}`).join('');
    return `<g transform="translate(${cx} ${cy}) scale(${e})"><path d="${d}" fill="none" stroke="${K}" stroke-width="12.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="10.4" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="40" ry="36" ${L(1.1)}/><ellipse cx="-14" cy="-2" rx="8" ry="9" ${L(1)}/><ellipse cx="14" cy="-2" rx="8" ry="9" ${L(1)}/><circle cx="-12.5" cy="0" r="3.6" fill="${K}"/><circle cx="15.5" cy="0" r="3.6" fill="${K}"/><path d="M-9 14q9 8 18 0" fill="none" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/></g>`;
  };

  /* ---------- tipos y diseños ---------- */
  const TIPOS = {
    gomets: { t: 'Gomets', ic: 'gomet', d: 'Gomets redondos o bolitas de papel de seda. Trabaja la pinza.', color: '#E8487F' },
    punzon: { t: 'Punzón', ic: 'punzon', d: 'Picar por la línea gruesa, sobre una almohadilla de picado y con un adulto cerca.', color: '#8B5CF6' },
    flecos: { t: 'Flecos', ic: 'tijera', d: 'Cortes cortos y rectos desde el borde: la primera ficha de tijeras.', color: '#0B7A8F' },
    colorear: { t: 'Colorear', ic: 'cera', d: 'Dibujos grandes de zonas amplias, con el color indicado.', color: '#F27A2E' }
  };
  const D = [
    // gomets
    { k: 'oruga', tipo: 'gomets', n: 'La oruga', ins: 'Pega un gomet en cada círculo: ¡la oruga crece!', dib() {
      let s = '', pts = [];
      for (let i = 0; i < 9; i++) pts.push([26 + i * 14.2, 92 + Math.sin(i * .9) * 9]);
      pts.forEach(([x, y]) => { s += `<path d="M${r2(x - 2)} ${r2(y + 6.4)}l-1.5 5M${r2(x + 2)} ${r2(y + 6.4)}l1.5 5" stroke="${K}" stroke-width=".8" stroke-linecap="round"/>`; });
      pts.forEach(([x, y]) => { s += gomet(x, y); });
      const [hx, hy] = [26 + 9 * 14.2 + 4, 92 + Math.sin(9 * .9) * 9 - 6];
      s += `<path d="M${hx - 4} ${hy - 9}l-4-10M${hx + 4} ${hy - 9}l5-9" stroke="${K}" stroke-width="1" stroke-linecap="round"/><circle cx="${hx - 8}" cy="${hy - 19.5}" r="1.8" ${L(.8)}/><circle cx="${hx + 9}" cy="${hy - 18.5}" r="1.8" ${L(.8)}/><circle cx="${r2(hx)}" cy="${r2(hy)}" r="11" ${L(1.1)}/>${carita(hx, hy, 1.3)}`;
      return s + `<path d="M14 124h182" stroke="${GRIS}" stroke-width=".6" stroke-linecap="round"/>`;
    } },
    { k: 'arbol', tipo: 'gomets', n: 'El manzano', ins: 'Pega un gomet rojo en cada círculo: son las manzanas.', dib() {
      return `<path d="M96 134V96h18v38M88 134h34" ${L(1.1)}/>` + nube([[105, 66, 32], [80, 76, 22], [130, 76, 22], [88, 50, 18], [122, 50, 18]], 1.1)
        + [[105, 48], [85, 62], [125, 62], [105, 72], [84, 84], [126, 84]].map(([x, y]) => gomet(x, y)).join('');
    } },
    { k: 'collar', tipo: 'gomets', n: 'El collar de Lolo', ins: 'Pega gomets alrededor para hacer un collar redondo.', dib() {
      let s = `<circle cx="105" cy="84" r="40" fill="none" stroke="${K}" stroke-width=".6"/><path d="M101 41.5q4-6 8 0" fill="none" stroke="${K}" stroke-width="1.2" stroke-linecap="round"/>`;
      for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + (i + .5) * Math.PI / 6; s += gomet(105 + Math.cos(a) * 40, 84 + Math.sin(a) * 40); }
      return s + loloTubos(105, 82, .38);
    } },
    { k: 'lluvia', tipo: 'gomets', n: 'La lluvia', ins: 'Pega gomets azules: son las gotas de lluvia.', dib() {
      let s = nube([[88, 50, 13], [107, 42, 17], [127, 50, 13], [96, 58, 10], [118, 58, 10]], 1.1) + carita(107, 50, 1.4);
      [70, 90, 110, 130, 150].forEach((x, c) => [80, 102, 124].forEach((y, f) => { s += gomet(x + (f % 2 ? 5 : 0) - 5, y + (c % 2 ? 6 : 0)); }));
      return s;
    } },
    { k: 'caracol', tipo: 'gomets', n: 'El caracol', ins: 'Pega gomets por la espiral, de fuera hacia dentro.', dib() {
      let s = `<path d="M50 128Q100 134 160 126Q176 120 172 106L160 106Q158 118 148 118L64 120Q50 122 50 128Z" ${L(1.1)}/><path d="M160 104l-5-16M168 105l5-16" stroke="${K}" stroke-width="1" stroke-linecap="round"/><circle cx="154.5" cy="86" r="2.2" ${L(.8)}/><circle cx="173.5" cy="87" r="2.2" ${L(.8)}/>${carita(165, 112, .9)}`;
      s += `<circle cx="100" cy="78" r="44" ${L(1.1)}/>`;
      const pts = []; let d = '';
      for (let i = 0; i <= 500; i++) { const t = i / 500, a = -Math.PI / 2 - t * 1.75 * 2 * Math.PI, r = 34 - t * 31; pts.push([100 + Math.cos(a) * r, 78 + Math.sin(a) * r]); d += (i ? 'L' : 'M') + r2(pts[i][0]) + ' ' + r2(pts[i][1]); }
      s += `<path d="${d}" fill="none" stroke="${GRIS}" stroke-width=".5"/>`;
      const puestos = [];
      pts.forEach(p => { if (puestos.every(q => Math.hypot(p[0] - q[0], p[1] - q[1]) >= 15)) puestos.push(p); });
      puestos.forEach(p => { s += gomet(...p); });
      return s;
    } },
    // punzón
    ...['manzana', 'hoja', 'pez', 'estrella', 'corazon', 'casa'].map(k => ({
      k: 'p-' + k, tipo: 'punzon', n: { manzana: 'La manzana', hoja: 'La hoja', pez: 'El pez', estrella: 'La estrella', corazon: 'El corazón', casa: 'La casa' }[k],
      ins: 'Pica con el punzón por la línea gruesa, despacito.', dib() { return forma(k, 105, 82, 96, 1.7); }
    })),
    // flecos
    { k: 'f-lolo', tipo: 'flecos', n: 'Los tentáculos de Lolo', ins: 'Corta por las líneas desde abajo: ¡a Lolo le salen tentáculos!', sinPie: true, dib() {
      let s = `<rect x="68" y="86" width="74" height="62.4" fill="${tinta ? '#fff' : '#FFE3CC'}"/>`;
      for (let i = 0; i < 7; i++) { const x = 68 + i * 74 / 7 + 74 / 14; [112, 130].forEach(y => { s += `<circle cx="${r2(x)}" cy="${y}" r="1.5" fill="#fff" stroke="${K}" stroke-width=".45"/>`; }); }
      for (let i = 1; i < 7; i++) s += corte(68 + i * 74 / 7, 96);
      s += `<path d="M68 148.4V86M142 148.4V86" stroke="${K}" stroke-width=".9"/>`;
      s += `<ellipse cx="105" cy="64" rx="38" ry="30" ${L(1.1)}/><ellipse cx="92" cy="62" rx="6" ry="7" ${L(1)}/><ellipse cx="118" cy="62" rx="6" ry="7" ${L(1)}/><circle cx="93" cy="63.5" r="2.8" fill="${K}"/><circle cx="119" cy="63.5" r="2.8" fill="${K}"/><path d="M96 78q9 8 18 0" fill="none" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/>`;
      return s + TIJERA(68 + 74 / 7, 142);
    } },
    { k: 'f-lluvia', tipo: 'flecos', n: 'La nube de lluvia', ins: 'Corta por las líneas desde abajo: son los hilos de lluvia.', sinPie: true, dib() {
      let s = '';
      for (let i = 0; i < 10; i++) { const x = 56 + i * 11; s += corte(x, 82); s += `<path d="M${x + 5.5} ${88 + (i % 2) * 14}q-2.4 4 0 5.4q2.4-1.4 0-5.4z" fill="${tinta ? '#fff' : '#6EC6F2'}" stroke="${K}" stroke-width=".5"/>`; }
      s += nube([[80, 62, 16], [104, 54, 20], [130, 62, 16], [92, 70, 12], [118, 70, 12]], 1.1) + carita(105, 62, 1.5);
      return s + TIJERA(56, 142);
    } },
    { k: 'f-hierba', tipo: 'flecos', n: 'La hierba del jardín', ins: 'Corta la hierba: líneas cortas desde abajo.', sinPie: true, dib() {
      let s = '';
      for (let i = 0; i < 17; i++) s += corte(25 + i * 10, 114);
      s += `<path d="M14 112h182" stroke="${tinta ? K : '#2BB673'}" stroke-width="1" stroke-linecap="round"/>`;
      s += `<circle cx="170" cy="56" r="13" ${L(1.1)}/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return `<path d="M${r2(170 + Math.cos(a) * 17)} ${r2(56 + Math.sin(a) * 17)}L${r2(170 + Math.cos(a) * 23)} ${r2(56 + Math.sin(a) * 23)}" stroke="${K}" stroke-width="1.1" stroke-linecap="round"/>`; }).join('')}${carita(170, 56, 1.2)}`;
      [[50, 74], [92, 82], [128, 70]].forEach(([x, y]) => { s += `<path d="M${x} ${y + 8}V112" stroke="${K}" stroke-width="1"/>${[0, 1, 2, 3, 4].map(i => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return `<circle cx="${r2(x + Math.cos(a) * 6)}" cy="${r2(y + Math.sin(a) * 6)}" r="4.2" ${L(.9)}/>`; }).join('')}<circle cx="${x}" cy="${y}" r="3.4" ${L(.9)}/>`; });
      return s + TIJERA(25, 142);
    } },
    // colorear
    { k: 'c-manzana', tipo: 'colorear', n: 'La manzana', color: ['#FF5A5F', 'Rojo'], ins: 'Colorea la manzana de rojo.', dib() { return `<path d="M105 65c0-8 2.5-15 7-20" fill="none" stroke="${K}" stroke-width="1.3" stroke-linecap="round"/><path d="M110 51c6-8 16-9 20-4-5.5 6.5-15 8-20 4Z" ${L(1.2)}/>` + forma('manzana', 105, 82, 96, 1.4); } },
    { k: 'c-sol', tipo: 'colorear', n: 'El sol', color: ['#FFC93C', 'Amarillo'], ins: 'Colorea el sol de amarillo.', dib() {
      let s = ''; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, c = Math.cos(a), sn = Math.sin(a), p = (r, da) => `${r2(105 + Math.cos(a + da) * r)} ${r2(82 + Math.sin(a + da) * r)}`; s += `<path d="M${p(32, -.2)}L${p(48, 0)}L${p(32, .2)}Z" ${L(1.2)}/>`; }
      return s + `<circle cx="105" cy="82" r="31" ${L(1.4)}/>` + carita(105, 82, 3);
    } },
    { k: 'c-pez', tipo: 'colorear', n: 'El pez', color: ['#3D8DF2', 'Azul'], ins: 'Colorea el pez de azul.', dib() { return forma('pez', 105, 82, 100, 1.4) + `<circle cx="132" cy="76" r="4" fill="${K}"/><path d="M98 66q8 16 0 32" fill="none" stroke="${K}" stroke-width="1.2" stroke-linecap="round"/>`; } },
    { k: 'c-arbol', tipo: 'colorear', n: 'El árbol', color: ['#2BB673', 'Verde'], ins: 'Colorea las hojas del árbol de verde.', dib() { return `<path d="M96 134V96h18v38M86 134h38" ${L(1.3)}/>` + nube([[105, 64, 32], [78, 74, 22], [132, 74, 22], [88, 48, 18], [122, 48, 18]], 1.3); } },
    { k: 'c-lolo', tipo: 'colorear', n: 'Lolo', color: ['#FF8A3D', 'Naranja'], ins: 'Colorea a Lolo de naranja.', dib() { return loloTubos(105, 64, .88); } }
  ];
  const porK = Object.fromEntries(D.map(d => [d.k, d]));

  /* ---------- iconos del material ---------- */
  const MAT = {
    gomet: c => `<circle r="3" fill="none" stroke="${c}" stroke-width=".8"/><circle r="1.6" fill="${c}"/>`,
    punzon: c => `<path d="M-3.4 3.4L2.2-2.2" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/><path d="M2.2-2.2L3.6-3.6" stroke="${c}" stroke-width=".6" stroke-linecap="round"/>`,
    tijera: c => `<g fill="none" stroke="${c}" stroke-width=".7" stroke-linecap="round"><circle cx="-1.8" cy="2" r="1.3"/><circle cx="1.8" cy="2" r="1.3"/><path d="M-1 1L1.4-3.6M1 1L-1.4-3.6"/></g>`,
    cera: c => `<path d="M-3 3l4.8-4.8 1.8 1.8L-1.2 4.8z" fill="${c}"/><path d="M1.8-1.8l1-2.2 1.2 1.2z" fill="${c}"/>`
  };

  /* ---------- una ficha ---------- */
  function ficha(k, o) {
    const d = porK[k], T = TIPOS[d.tipo];
    let s = '';
    s += `<g transform="translate(14 15.6)"><circle r="5" fill="${o.tinta ? '#fff' : T.color}" stroke="${o.tinta ? K : 'none'}" stroke-width=".4"/>${MAT[T.ic](o.tinta ? K : '#fff')}</g>`;
    s += `<text x="22.5" y="17.2" class="t-titulo">${d.n}</text><text x="22.5" y="23.1" class="t-sub">${d.ins}</text>`;
    if (o.nombre) s += `<text x="150" y="16.4" class="t-campo">Nombre</text><path d="M165 17H201" stroke="#9FB0BD" stroke-width=".35"/>`;
    if (d.color) s += `<g transform="translate(${o.nombre ? 150 : 172} 22)"><circle cx="3" cy="0" r="3.4" fill="${d.color[0]}" stroke="${K}" stroke-width=".35"/><text x="8.4" y="1.3" class="t-campo">${d.color[1]}</text></g>`;
    s += `<rect x="9" y="29" width="192" height="${d.sinPie ? 119.4 : 106}" rx="${d.sinPie ? 0 : 4}" fill="${o.tinta ? '#fff' : '#F7FAFB'}" stroke="${o.tinta ? '#D3DEE6' : 'none'}" stroke-width=".35"/>`;
    s += d.dib();
    if (!d.sinPie) s += `<g transform="translate(11.5 140.6)"><circle r="2.3" fill="${o.tinta ? '#fff' : NARANJA}" stroke="${o.tinta ? K : 'none'}" stroke-width=".3"/><circle cx="-.8" cy="-.3" r=".55" fill="#fff"/><circle cx=".8" cy="-.3" r=".55" fill="#fff"/><circle cx="-.75" cy="-.25" r=".28" fill="${K}"/><circle cx=".85" cy="-.25" r=".28" fill="${K}"/></g><text x="15.4" y="141.6" class="t-pie">La visita de Lolo · 3 años · ${T.t}</text>`;
    return `<svg class="ficha-trazo" viewBox="0 0 210 148.4" role="img" aria-label="Ficha de ${T.t.toLowerCase()}: ${d.n}. ${d.ins}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  }

  /* ---------- opciones ---------- */
  const DEF = { tipo: 'gomets', sel: Object.fromEntries(Object.keys(TIPOS).map(t => [t, D.filter(d => d.tipo === t).map(d => d.k)])), modo: 'iguales', nombre: true, tinta: false };
  let op = JSON.parse(JSON.stringify(DEF));
  try { const g = JSON.parse(lee('lolo-fichas-3', 'null')); if (g && typeof g === 'object') op = { ...op, ...g, sel: { ...op.sel, ...(g.sel || {}) } }; } catch (e) {}
  if (!TIPOS[op.tipo]) op.tipo = 'gomets';
  Object.keys(op.sel).forEach(t => { op.sel[t] = (op.sel[t] || []).filter(k => porK[k] && porK[k].tipo === t); });
  try { const t = new URLSearchParams(location.search).get('tipo'); if (TIPOS[t]) op.tipo = t; } catch (e) {}

  const mini = d => `<svg viewBox="9 29 192 106" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g>${d.dib()}</g></svg>`;
  function pintaControles() {
    $$('input[name="tipo"]').forEach(r => r.checked = r.value === op.tipo);
    $('#tipoDesc').textContent = TIPOS[op.tipo].d;
    $('#disenos').innerHTML = D.filter(d => d.tipo === op.tipo).map(d => `<button type="button" class="chip-trazo chip-dib" data-k="${d.k}" aria-pressed="${op.sel[op.tipo].includes(d.k)}"><span class="chip-ic">${mini(d)}</span><span class="chip-t">${d.n}</span><span class="chip-ok" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></button>`).join('');
    $$('input[name="modo"]').forEach(r => r.checked = r.value === op.modo);
    $('#opNombre').checked = !!op.nombre; $('#opTinta').checked = !!op.tinta;
  }
  function hojas() {
    const sel = D.filter(d => d.tipo === op.tipo && op.sel[op.tipo].includes(d.k)).map(d => d.k);
    if (op.modo === 'iguales') return sel.map(k => [k, k]);
    const r = []; for (let i = 0; i < sel.length; i += 2) r.push([sel[i], sel[i + 1] || sel[i]]); return r;
  }
  const CORTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/></svg>';
  function genera() {
    tinta = !!op.tinta;
    const H = hojas(), o = { nombre: op.nombre, tinta: op.tinta };
    $('#hojas').innerHTML = H.map(([a, b], i) => `<div class="hoja-marco"><p class="hoja-num">Hoja ${i + 1} de ${H.length}</p><div class="hoja-caja"><div class="hoja">${ficha(a, o)}<div class="corte" aria-hidden="true">${CORTE}</div>${ficha(b, o)}</div></div></div>`).join('');
    const n = H.length;
    $('#resumen').innerHTML = n ? `<b>${n} ${n === 1 ? 'hoja' : 'hojas'} A4</b> · ${n * 2} fichas` : 'Elige al menos una ficha';
    $('#vacio').hidden = n > 0;
    $$('.imprimir').forEach(b => { b.disabled = !n; });
    guarda('lolo-fichas-3', JSON.stringify(op));
    escala();
  }
  function escala() { const v = $('#hojas'); if (!v) return; v.style.setProperty('--esc', Math.min(1, (v.clientWidth || 1) / (210 * 96 / 25.4)).toFixed(4)); }
  if ('ResizeObserver' in window) new ResizeObserver(escala).observe($('#hojas')); else addEventListener('resize', escala);

  $('#disenos').addEventListener('click', e => {
    const b = e.target.closest('.chip-trazo'); if (!b) return;
    const k = b.dataset.k, l = op.sel[op.tipo], on = l.includes(k);
    op.sel[op.tipo] = on ? l.filter(x => x !== k) : [...l, k];
    b.setAttribute('aria-pressed', String(!on)); genera();
  });
  $('#todos').addEventListener('click', () => { op.sel[op.tipo] = D.filter(d => d.tipo === op.tipo).map(d => d.k); pintaControles(); genera(); });
  $('#ninguno').addEventListener('click', () => { op.sel[op.tipo] = []; pintaControles(); genera(); });
  $('#opciones').addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'tipo') { op.tipo = t.value; pintaControles(); }
    if (t.name === 'modo') op.modo = t.value;
    if (t.id === 'opNombre') op.nombre = t.checked;
    if (t.id === 'opTinta') op.tinta = t.checked;
    genera();
  });
  $('#opciones').addEventListener('submit', e => e.preventDefault());
  $$('.imprimir').forEach(b => b.addEventListener('click', () => { if (!b.disabled) window.print(); }));

  pintaControles();
  genera();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(escala);
})();
