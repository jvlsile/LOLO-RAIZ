/* El cuerpo · Nico y las partes del cuerpo, compartidos por los juegos (jugar.html), las fichas (fichas-cuerpo.html) y la portada.
   Nico se dibuja en una caja de 200 × 320. Cada parte va en su grupo (class="p-…") para poder señalarla, esconderla o recortarla. */
(() => {
  'use strict';
  const K = '#183153';
  const PIELES = ['#F6C9A0', '#E2A97E', '#B97A52', '#7E4E33'];
  const PELOS = ['#4A2C1A', '#1F1A17', '#C98A3A', '#8A4A22'];
  const CAMISETAS = ['#3DBBC9', '#FF8A3D', '#2BB673', '#9B6BFF'];
  const azar = a => a[Math.floor(Math.random() * a.length)];

  /* Puntos de referencia (para señalar hombros, rodillas…). */
  const PUNTOS = { hombros: [[74, 120], [126, 120]], rodillas: [[85, 242], [115, 242]], barriga: [[100, 168]], cabeza: [[100, 50]], manos: [[44, 199], [156, 199]], pies: [[80, 290], [120, 290]], brazos: [[60, 150], [140, 150]], piernas: [[85, 225], [115, 225]] };

  /* Recuadro de cada parte (x, y, ancho, alto) en la caja de 200 × 320. */
  const CAJA = {
    cabeza: [46, 8, 108, 112], tronco: [62, 106, 76, 104], 'brazo-i': [28, 108, 56, 106], 'brazo-d': [116, 108, 56, 106],
    'pierna-i': [58, 192, 50, 112], 'pierna-d': [92, 192, 50, 112], mano: [30, 184, 30, 30], pie: [60, 276, 42, 26],
    ojos: [74, 56, 52, 24], nariz: [88, 64, 24, 26], boca: [82, 80, 36, 20], orejas: [44, 54, 112, 32], pelo: [52, 14, 96, 54], cuello: [84, 96, 32, 26]
  };

  /* Vocabulario de las partes. */
  const PARTES = {
    cabeza: { n: 'la cabeza', lbl: 'Cabeza', ver: ['cabeza'] },
    tronco: { n: 'la barriga', lbl: 'Barriga', ver: ['tronco'] },
    brazos: { n: 'los brazos', lbl: 'Brazos', ver: ['brazo-i', 'brazo-d', 'mano-i', 'mano-d'] },
    manos: { n: 'las manos', lbl: 'Manos', ver: ['mano-i', 'mano-d'] },
    piernas: { n: 'las piernas', lbl: 'Piernas', ver: ['pierna-i', 'pierna-d', 'pie-i', 'pie-d'] },
    pies: { n: 'los pies', lbl: 'Pies', ver: ['pie-i', 'pie-d'] },
    ojos: { n: 'los ojos', lbl: 'Ojos' }, nariz: { n: 'la nariz', lbl: 'Nariz' }, boca: { n: 'la boca', lbl: 'Boca' },
    orejas: { n: 'las orejas', lbl: 'Orejas' }, pelo: { n: 'el pelo', lbl: 'Pelo' }, cuello: { n: 'el cuello', lbl: 'Cuello' }
  };

  const linea = (d, w, c) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const tubo = (d, w, c) => linea(d, w + 5, K) + linea(d, w, c);

  /* Nico entero. o: { piel, pelo, camiseta, pantalon, zapato, ocultar:[partes], ropa:{gorro,bufanda,guantes,botas}, saluda, linea } */
  function nico(o = {}) {
    const L = o.linea, B = '#fff';
    const piel = L ? B : (o.piel || PIELES[0]), pelo = L ? B : (o.pelo || PELOS[0]), cam = L ? B : (o.camiseta || CAMISETAS[0]),
      pan = L ? B : (o.pantalon || '#3E5C9A'), zap = L ? B : (o.zapato || '#E5484D'), mej = L ? 'none' : '#FF8FA8';
    const oc = new Set(o.ocultar || []), R = o.ropa || {};
    const g = (p, s) => oc.has(p) ? '' : `<g class="p-${p}" data-parte="${p}">${s}</g>`;
    const brazoD = o.saluda ? 'M128 124L174 86' : 'M128 124L154 190', manoD = o.saluda ? [179, 78] : [156, 199];
    const piernas = g('pierna-i', tubo('M86 202L84 276', 22, pan)) + g('pierna-d', tubo('M114 202L116 276', 22, pan));
    const pies = g('pie-i', `<path d="M64 290q0-12 16-13h6q12 0 12 13z" fill="${zap}" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/>`)
      + g('pie-d', `<path d="M136 290q0-12-16-13h-6q-12 0-12 13z" fill="${zap}" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/>`);
    const tronco = g('tronco', `<path d="M66 128Q66 112 82 112H118Q134 112 134 128V196Q134 206 124 206H76Q66 206 66 196z" fill="${cam}" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/><path d="M90 112q10 9 20 0" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`);
    const brazos = g('brazo-i', tubo('M72 124L46 190', 16, piel) + tubo('M72 124L64 146', 20, cam))
      + g('brazo-d', tubo(brazoD, 16, piel) + tubo(o.saluda ? 'M128 124L146 110' : 'M128 124L136 146', 20, cam));
    const mano = (x, y, lado) => `<ellipse cx="${x + lado * 9}" cy="${y - 5}" rx="4.5" ry="6.5" fill="${piel}" stroke="${K}" stroke-width="3" transform="rotate(${lado * 30} ${x + lado * 9} ${y - 5})"/><circle cx="${x}" cy="${y}" r="11" fill="${piel}" stroke="${K}" stroke-width="3.5"/>`;
    const manos = g('mano-i', mano(44, 199, 1)) + g('mano-d', mano(manoD[0], manoD[1], -1));
    const cuello = g('cuello', `<rect x="90" y="98" width="20" height="18" rx="4" fill="${piel}" stroke="${K}" stroke-width="3.5"/>`);
    const orejas = g('orejas', `<ellipse cx="60" cy="70" rx="9" ry="12" fill="${piel}" stroke="${K}" stroke-width="3.5"/><ellipse cx="140" cy="70" rx="9" ry="12" fill="${piel}" stroke="${K}" stroke-width="3.5"/>`);
    const cara = `<circle cx="100" cy="66" r="40" fill="${piel}" stroke="${K}" stroke-width="3.5"/>`;
    const pelo_ = g('pelo', `<path d="M60 64Q56 20 100 20Q144 20 140 64Q136 46 118 42Q108 50 92 44Q72 44 60 64z" fill="${pelo}" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/>`);
    const ojos = g('ojos', `<circle cx="85" cy="68" r="5.5" fill="${K}"/><circle cx="115" cy="68" r="5.5" fill="${K}"/><circle cx="87" cy="66" r="1.8" fill="#fff"/><circle cx="117" cy="66" r="1.8" fill="#fff"/>`);
    const nariz = g('nariz', `<path d="M100 72q-6 9 1 11" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`);
    const boca = g('boca', `<path d="M88 88q12 11 24 0" fill="${L ? B : '#C2384F'}" stroke="${K}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`);
    const mejillas = oc.has('cabeza') ? '' : `<circle cx="76" cy="82" r="6" fill="${mej}" opacity=".45"/><circle cx="124" cy="82" r="6" fill="${mej}" opacity=".45"/>`;
    const cabeza = oc.has('cabeza') ? '' : `<g class="p-cabeza" data-parte="cabeza">${orejas}${cara}${pelo_}${ojos}${nariz}${boca}${mejillas}</g>`;
    // Ropa puesta
    const gorro = R.gorro ? `<g class="ropa r-gorro"><path d="M58 58Q58 12 100 12Q142 12 142 58z" fill="${L ? B : '#8E5BE8'}" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/><rect x="54" y="48" width="92" height="15" rx="7.5" fill="${L ? B : '#B79CFF'}" stroke="${K}" stroke-width="3.5"/><circle cx="100" cy="10" r="9" fill="${L ? B : '#FF5D8F'}" stroke="${K}" stroke-width="3.5"/></g>` : '';
    const bufanda = R.bufanda ? `<g class="ropa r-bufanda"><rect x="106" y="108" width="14" height="38" rx="5" fill="${L ? B : '#E5484D'}" stroke="${K}" stroke-width="3.5"/><rect x="80" y="100" width="40" height="17" rx="8.5" fill="${L ? B : '#E5484D'}" stroke="${K}" stroke-width="3.5"/><path d="M90 102v13M100 102v13M110 102v13" stroke="${L ? K : '#FFB3B8'}" stroke-width="2.5"/></g>` : '';
    const guantes = R.guantes ? `<g class="ropa r-guantes">${[[44, 199], manoD].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="${L ? B : '#FFC93C'}" stroke="${K}" stroke-width="3.5"/><path d="M${x - 9} ${y - 3}l-6-6" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`).join('')}</g>` : '';
    const botas = R.botas ? `<g class="ropa r-botas">${[[70, 256, 'M62 291q0-13 16-14h8V256'], [108, 256, 'M138 291q0-13-16-14h-8V256']].map(([x, y]) => `<rect x="${x}" y="${y}" width="22" height="30" rx="4" fill="${L ? B : '#2BB673'}" stroke="${K}" stroke-width="3.5"/>`).join('')}<path d="M62 292q0-14 16-15h14v15z" fill="${L ? B : '#2BB673'}" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/><path d="M138 292q0-14-16-15h-14v15z" fill="${L ? B : '#2BB673'}" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/></g>` : '';
    return piernas + pies + botas + tronco + brazos + manos + guantes + cuello + bufanda + cabeza + gorro;
  }

  /* Solo una parte, recortada a su tamaño (para opciones y tarjetas). */
  const QUE = { cabeza: ['cabeza'], tronco: ['tronco'], brazo: ['brazo-i', 'mano-i'], mano: ['mano-i'], pierna: ['pierna-i', 'pie-i'], pie: ['pie-i'], ojos: ['ojos'], nariz: ['nariz'], boca: ['boca'], orejas: ['orejas'], pelo: ['pelo'], cuello: ['cuello'] };
  const TODAS = ['pierna-i', 'pierna-d', 'pie-i', 'pie-d', 'tronco', 'brazo-i', 'brazo-d', 'mano-i', 'mano-d', 'cuello', 'orejas', 'pelo', 'ojos', 'nariz', 'boca'];
  function parte(k, o = {}) {
    const caja = { brazo: CAJA['brazo-i'], pierna: CAJA['pierna-i'], ojos: [70, 54, 60, 28], nariz: [86, 62, 28, 28], boca: [80, 78, 40, 22], orejas: [44, 54, 112, 32] }[k] || CAJA[k];
    const ver = QUE[k] || [k], deCara = ['cabeza', 'ojos', 'nariz', 'boca', 'orejas', 'pelo'].includes(k);
    // Los rasgos de la cara se ven sobre la piel de la cara (el resto de la cabeza se oculta).
    const ocultar = k === 'cabeza' ? TODAS.filter(p => !['orejas', 'pelo', 'ojos', 'nariz', 'boca', 'cuello'].includes(p))
      : TODAS.filter(p => !ver.includes(p)).concat(deCara ? [] : ['cabeza']);
    const html = nico({ ...o, ocultar });
    const [x, y, w, h] = caja, m = Math.max(w, h), cx = x + w / 2, cy = y + h / 2;
    return `<svg viewBox="${cx - m / 2 - 4} ${cy - m / 2 - 4} ${m + 8} ${m + 8}" aria-hidden="true">${html}</svg>`;
  }

  /* Un pie descalzo, para las opciones. */
  const PIE = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 92Q16 88 18 70Q22 50 26 34Q30 16 46 16Q62 18 62 36Q60 52 64 62Q72 78 66 88Q60 96 30 92z" fill="#F6C9A0" stroke="${K}" stroke-width="4.5" stroke-linejoin="round"/>${[[70, 30, 8], [78, 44, 6.5], [82, 56, 5.5], [82, 67, 5], [78, 77, 4.5]].map(([x, y, r]) => `<circle cx="${x - 8}" cy="${y - 20}" r="${r}" fill="#F6C9A0" stroke="${K}" stroke-width="3.5" transform="rotate(-8 50 50)"/>`).join('')}</svg>`;

  const IC = {
    cuerpo: '<circle cx="12" cy="4.5" r="2.5"/><path d="M12 7.5v7M7 10h10M12 14.5l-3 6.5M12 14.5l3 6.5"/>',
    monta: '<circle cx="12" cy="4.5" r="2.5"/><rect x="9" y="8.5" width="6" height="7" rx="1.5"/><path d="M8.5 9.5L5 14M15.5 9.5L19 14M10.5 16v5M13.5 16v5" stroke-dasharray="2 1.6"/>',
    falta: '<circle cx="12" cy="4.5" r="2.5"/><path d="M12 7.5v7M12 10h5M12 14.5l-3 6.5M12 14.5l3 6.5"/><path d="M5 9.5h2.5" stroke-dasharray="1.5 1.5"/><path d="M4 14.5a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6.9"/>',
    sirve: '<path d="M7 12.5V6.5a1.5 1.5 0 0 1 3 0V11V5a1.5 1.5 0 0 1 3 0v6V6.5a1.5 1.5 0 0 1 3 0V13c0 4-2.5 7-6 7-2.6 0-4-1.2-5.3-3.5L3.6 13a1.4 1.4 0 0 1 2.4-1.4z"/>',
    viste: '<path d="M8 4l-4.5 3 2 4 2-1V20h9V10l2 1 2-4L16 4q-1.5 2-4 2T8 4z"/>',
    toca: '<circle cx="12" cy="4.5" r="2.5"/><path d="M12 7.5v6.5M12 9L7 5M12 9l5-4M12 14l-3 7M12 14l3 7"/>'
  };

  const SELLOS = [
    { id: 'cuerpo', t: '¿Dónde está?', s: 'Señalar', c: '#E8487F' },
    { id: 'monta', t: 'Monta a Nico', s: 'Montar', c: '#3D8DF2' },
    { id: 'falta', t: '¿Qué le falta?', s: 'Observar', c: '#9B6BFF' },
    { id: 'sirve', t: '¿Para qué sirve?', s: 'Para qué sirve', c: '#2BB673' },
    { id: 'viste', t: 'Vestimos a Nico', s: 'Vestirse', c: '#FF8A3D' },
    { id: 'toca', t: 'Toca, toca', s: 'Moverse', c: '#0B7A8F' }
  ];
  const CLAVE = 'lolo-sellos-cuerpo';
  const leeSellos = () => { try { const v = JSON.parse(localStorage.getItem(CLAVE) || '[]'); return Array.isArray(v) ? v.filter(x => SELLOS.some(s => s.id === x)) : []; } catch (e) { return []; } };
  const ponSello = id => { const v = leeSellos(); if (!v.includes(id)) v.push(id); try { localStorage.setItem(CLAVE, JSON.stringify(v)); } catch (e) {} return v; };
  const aspecto = () => ({ piel: azar(PIELES), pelo: azar(PELOS), camiseta: azar(CAMISETAS) });

  window.LOLO_CUERPO = { K, PIE, PIELES, PELOS, CAMISETAS, PUNTOS, CAJA, PARTES, nico, parte, IC, SELLOS, leeSellos, ponSello, aspecto };
})();
