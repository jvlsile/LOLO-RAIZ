/* Modo 3 años · La visita de Lolo
   Juegos cortos para los más peques: tres retos, dos opciones, solo tocar.
   Es independiente del resto de juegos (jugar.html) y comparte con ellos la voz grabada y el modo tranquilo. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const lee = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
  const guarda = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const mezcla = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const K = '#183153';

  const reduceSO = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let calma = lee('lolo-calma', '0') === '1';
  const quieto = () => reduceSO || calma;
  let voz = lee('lolo-tres-voz', '1') !== '0';
  const texto = $('#texto'), zona = $('#zona');
  let ultimo = null;

  /* ---------- voz: audios grabados y, si falta alguno, la voz del navegador ---------- */
  let voces = [], vozEs = null;
  const esNatural = v => /natural|neural|online|premium|enhanced|mejorad|google|siri/i.test(v.name);
  const puntua = v => (/natural|neural/i.test(v.name) ? 60 : 0) + (/online/i.test(v.name) ? 20 : 0) + (/premium|enhanced|mejorad|siri/i.test(v.name) ? 50 : 0) + (/google/i.test(v.name) ? 35 : 0) + (/^es[-_]ES/i.test(v.lang) ? 10 : 0);
  function cargarVoces() {
    try {
      voces = speechSynthesis.getVoices().filter(v => /^es/i.test(v.lang)).sort((a, b) => puntua(b) - puntua(a));
      const g = lee('lolo-voz', null); vozEs = voces.find(v => v.voiceURI === g) || voces[0] || null;
    } catch (e) {}
  }
  try { cargarVoces(); speechSynthesis.onvoiceschanged = cargarVoces; } catch (e) {}
  let audios = null, sonando = null;
  try { fetch('audio/frases.json').then(r => r.ok ? r.json() : null).then(m => { if (m && m.frases) audios = m; }).catch(() => {}); } catch (e) {}
  const clipDe = t => audios && audios.frases[String(t).trim()];
  function callar() { if (sonando) { sonando.fin = true; try { sonando.el && sonando.el.pause(); } catch (e) {} sonando = null; } try { speechSynthesis.cancel(); } catch (e) {} }
  function sintetiza(t) {
    if (!('speechSynthesis' in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(t); u.lang = vozEs ? vozEs.lang : 'es-ES'; if (vozEs) u.voice = vozEs;
      const nat = vozEs && esNatural(vozEs); u.rate = calma ? .82 : (nat ? .9 : .85); u.pitch = nat ? 1.05 : 1.2; speechSynthesis.speak(u);
    } catch (e) {}
  }
  function hablar(t) {
    const partes = (Array.isArray(t) ? t : [t]).filter(Boolean);
    if (window.__frases) window.__frases.push(...partes);
    callar();
    const clips = partes.map(clipDe);
    if (partes.length && clips.every(Boolean)) {
      const r = sonando = { fin: false };
      (async () => { for (const c of clips) { if (r.fin) return; const a = new Audio((audios.base || 'audio/') + c); r.el = a; a.volume = calma ? .75 : 1;
        try { await a.play(); await new Promise((ok, mal) => { a.onended = ok; a.onerror = mal; }); } catch (e) { if (!r.fin) sintetiza(partes.slice(clips.indexOf(c)).join(' ')); return; } } })();
      return;
    }
    sintetiza(partes.join(' '));
  }
  /* decir: el texto del bocadillo y lo que suena. «partes» son frases grabadas que se encadenan. */
  function decir(t, partes) {
    ultimo = [t, partes]; texto.textContent = t;
    if (!quieto() && texto.animate) texto.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 280 });
    if (voz) hablar(partes || t);
  }

  /* ---------- sonidos suaves (nunca de error) ---------- */
  let ac = null;
  const actx = () => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); return ac; } catch (e) { return null; } };
  function tono(notas, tipo = 'sine', v = .14, sep = .1, dur = .45) {
    const a = actx(); if (!a) return;
    notas.forEach((f, i) => { const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + i * sep;
      o.type = tipo; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(calma ? v * .45 : v, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + dur);
      o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + .05); });
  }
  const acierto = () => tono(calma ? [523, 784] : [523, 659, 784, 1047]);
  const pop = k => tono([520 + k * 60, 780 + k * 60], 'sine', .1, .04, .18);

  /* ---------- Lolo ---------- */
  const TENT = [[62, 140, 30, 175, 44, 226], [88, 156, 70, 196, 78, 238], [112, 162, 108, 206, 104, 244], [136, 162, 140, 206, 150, 242], [158, 154, 178, 194, 174, 236], [180, 138, 214, 170, 204, 222]];
  const qb = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  const tentaculos = TENT.map(([x0, y0, cx, cy, x1, y1]) => `<g class="tent"><path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" stroke="url(#gTent)" stroke-width="24" stroke-linecap="round" fill="none"/>${[.45, .7, .9].map((t, i) => `<circle cx="${qb(x0, cx, x1, t).toFixed(1)}" cy="${qb(y0, cy, y1, t).toFixed(1)}" r="${5 - i}" fill="#FFD7B0" stroke="#F0A070" stroke-width="1.5"/>`).join('')}</g>`).join('');
  function lolo(cara = 'feliz', partes = false) {
    const boca = {
      feliz: '<path d="M102 126q18 20 36 0" fill="#B83A3A" stroke-linejoin="round"/>',
      triste: '<path d="M104 138q16-14 32 0"/>',
      enfadado: '<path d="M104 133q16-6 32 0"/>',
      sorpresa: '<ellipse cx="120" cy="132" rx="9" ry="12" fill="#B83A3A"/>'
    }[cara];
    const extra = (cara === 'enfadado' ? `<g stroke="${K}" stroke-width="6" stroke-linecap="round"><path d="M72 70l32 10"/><path d="M168 70l-32 10"/></g>` : '')
      + (cara === 'triste' ? `<g stroke="${K}" stroke-width="5" stroke-linecap="round"><path d="M74 78l30-8"/><path d="M166 78l-30-8"/></g><path d="M78 118q-6 12 0 16q6-4 0-16z" fill="#6FB2F2"/>` : '');
    const p = k => partes ? ` class="parte" data-parte="${k}" role="button" tabindex="0" aria-label="${{ ojos: 'Los ojos', boca: 'La boca', tentaculos: 'Los tentáculos' }[k]}"` : '';
    return `<svg class="lolo" data-cara="${cara}" viewBox="0 0 240 250" aria-hidden="${partes ? 'false' : 'true'}"><g class="cuerpo">
      <g${p('tentaculos')}>${partes ? '<path class="zona-toque" d="M30 150L220 150L215 250L25 250Z"/>' : ''}<g class="tents">${tentaculos}</g></g>
      <ellipse cx="120" cy="96" rx="80" ry="74" fill="url(#gLolo)"/>
      <g fill="#D9581A" opacity=".35"><ellipse cx="160" cy="58" rx="9" ry="6"/><ellipse cx="176" cy="80" rx="6" ry="4.5"/><ellipse cx="62" cy="70" rx="6" ry="4"/><ellipse cx="148" cy="40" rx="5" ry="3.5"/></g>
      <ellipse cx="92" cy="52" rx="26" ry="14" fill="#fff" opacity=".35" transform="rotate(-18 92 52)"/>
      <ellipse cx="72" cy="118" rx="18" ry="12" fill="url(#gMejilla)"/><ellipse cx="168" cy="118" rx="18" ry="12" fill="url(#gMejilla)"/>
      <g${p('ojos')}>${partes ? '<rect class="zona-toque" x="62" y="66" width="116" height="60" rx="26"/>' : ''}
        <g class="ojo"><ellipse cx="92" cy="96" rx="19" ry="21" fill="#fff"/><circle cx="95" cy="100" r="12" fill="url(#gIris)"/><circle cx="99" cy="94" r="4.5" fill="#fff"/><circle cx="91" cy="105" r="2" fill="#fff"/></g>
        <g class="ojo"><ellipse cx="148" cy="96" rx="19" ry="21" fill="#fff"/><circle cx="145" cy="100" r="12" fill="url(#gIris)"/><circle cx="149" cy="94" r="4.5" fill="#fff"/><circle cx="141" cy="105" r="2" fill="#fff"/></g></g>
      ${extra}
      <g${p('boca')}>${partes ? '<ellipse class="zona-toque" cx="120" cy="134" rx="30" ry="18"/>' : ''}<g stroke="${K}" stroke-width="5.5" stroke-linecap="round" fill="none">${boca}</g></g>
    </g></svg>`;
  }
  const mascota = $('#mascota');
  function cara(c) { mascota.innerHTML = lolo(c) + '<div class="sombra"></div>'; }
  function anima(cl) { if (quieto()) return; const s = mascota.querySelector('.lolo'); if (!s) return; s.classList.remove(cl); void s.getBoundingClientRect(); s.classList.add(cl); }
  function celebrar(el) {
    if (quieto() || !el) return;
    const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, cols = ['#FFC93C', '#FF5D8F', '#2BB673', '#3DBBC9', '#FF8A3D', '#ffffff'];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span'), s = 10 + Math.random() * 14, a = Math.random() * Math.PI * 2, d = 80 + Math.random() * 120;
      p.className = 'particula'; p.style.cssText = `left:${cx - s / 2}px;top:${cy - s / 2}px;width:${s}px;height:${s}px;background:${cols[i % cols.length]};${i % 3 === 0 ? 'border:2px solid #fff;background:transparent;' : ''}`;
      document.body.appendChild(p);
      p.animate([{ transform: 'translate(0,0) scale(.4)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d - 40}px) scale(1)`, opacity: 0 }], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => p.remove();
    }
  }

  /* ---------- dibujos ---------- */
  const T = `stroke="${K}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const svg = (vb, s, cl = '') => `<svg viewBox="${vb}" aria-hidden="true"${cl ? ` class="${cl}"` : ''}>${s}</svg>`;
  const ANIMAL = {
    vaca: svg('0 0 120 120', `<path d="M30 30q-14-6-16-18q12 0 20 10M90 30q14-6 16-18q-12 0-20 10" fill="#EFE4D2" ${T}/><ellipse cx="22" cy="44" rx="13" ry="7" fill="#fff" ${T} transform="rotate(-20 22 44)"/><ellipse cx="98" cy="44" rx="13" ry="7" fill="#fff" ${T} transform="rotate(20 98 44)"/><path d="M30 34q30-16 60 0q8 30-6 50H36Q22 64 30 34z" fill="#fff" ${T}/><path d="M38 34q10-4 18 2q-2 10-12 10q-8-4-6-12z" fill="${K}"/><path d="M82 48q8 2 6 12q-8 2-10-6z" fill="${K}"/><ellipse cx="60" cy="88" rx="30" ry="20" fill="#FFB8C6" ${T}/><ellipse cx="50" cy="88" rx="4" ry="6" fill="${K}"/><ellipse cx="70" cy="88" rx="4" ry="6" fill="${K}"/><circle cx="46" cy="58" r="5" fill="${K}"/><circle cx="74" cy="58" r="5" fill="${K}"/>`),
    perro: svg('0 0 120 120', `<path d="M28 30q-16 4-14 34q2 16 14 14z" fill="#8B5A2B" ${T}/><path d="M92 30q16 4 14 34q-2 16-14 14z" fill="#8B5A2B" ${T}/><path d="M30 44q0-28 30-28t30 28v22q0 30-30 34q-30-4-30-34z" fill="#D9A066" ${T}/><ellipse cx="60" cy="80" rx="20" ry="15" fill="#F5D7B0"/><circle cx="46" cy="54" r="5.5" fill="${K}"/><circle cx="74" cy="54" r="5.5" fill="${K}"/><ellipse cx="60" cy="72" rx="9" ry="6.5" fill="${K}"/><path d="M60 78v6M52 86q8 6 16 0" fill="none" ${T}/><path d="M56 88q4 10 8 0" fill="#FF8FA3" stroke="${K}" stroke-width="3"/>`),
    gato: svg('0 0 120 120', `<path d="M24 52L28 14l26 18M96 52L92 14L66 32" fill="#F6A04D" ${T}/><path d="M32 22l2 18 12-6M88 22l-2 18-12-6" fill="#FFC9D4"/><ellipse cx="60" cy="66" rx="40" ry="36" fill="#F6A04D" ${T}/><path d="M50 36l4 12M60 34v14M70 36l-4 12" stroke="#C86A1E" stroke-width="4" stroke-linecap="round"/><ellipse cx="45" cy="64" rx="5.5" ry="7" fill="${K}"/><ellipse cx="75" cy="64" rx="5.5" ry="7" fill="${K}"/><path d="M55 76h10l-5 6z" fill="#FF8FA3" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/><path d="M60 82q-6 8-12 4M60 82q6 8 12 4" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/><path d="M14 72l22 2M14 84l22-4M106 72l-22 2M106 84l-22-4" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`),
    pato: svg('0 0 120 120', `<path d="M60 14q30 0 34 30q4 24-14 38q22 4 26 18H22q2-16 20-20q-18-12-16-36q4-30 34-30z" fill="#FFD84D" ${T}/><path d="M60 20q-6-12 4-14q4 6-4 14z" fill="#FFD84D" ${T}/><path d="M64 56q26-6 38 2q-8 14-38 8z" fill="#FF9A3C" ${T}/><path d="M66 62h30" stroke="${K}" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="44" r="6" fill="${K}"/><circle cx="52" cy="42" r="2" fill="#fff"/><ellipse cx="38" cy="58" rx="8" ry="5" fill="#FFB0B0" opacity=".7"/>`),
    oveja: svg('0 0 120 120', `<g fill="#fff" ${T}><circle cx="34" cy="40" r="14"/><circle cx="54" cy="28" r="15"/><circle cx="76" cy="30" r="14"/><circle cx="90" cy="48" r="13"/><circle cx="28" cy="62" r="13"/><circle cx="94" cy="70" r="12"/><circle cx="36" cy="86" r="13"/><circle cx="84" cy="90" r="13"/><circle cx="60" cy="96" r="14"/></g><path d="M36 50l-16 6q2 10 14 6M84 50l16 6q-2 10-14 6" fill="#6E5B4E" ${T}/><ellipse cx="60" cy="64" rx="24" ry="28" fill="#7A6658" ${T}/><circle cx="50" cy="58" r="4.5" fill="#fff"/><circle cx="70" cy="58" r="4.5" fill="#fff"/><circle cx="50" cy="59" r="2.4" fill="${K}"/><circle cx="70" cy="59" r="2.4" fill="${K}"/><path d="M54 78q6 5 12 0" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><g fill="#fff" ${T}><circle cx="50" cy="38" r="9"/><circle cx="62" cy="34" r="10"/><circle cx="73" cy="40" r="8"/></g>`)
  };
  const CARA = {
    contento: svg('0 0 100 100', `<circle cx="50" cy="50" r="42" fill="url(#cFeliz)" stroke="${K}" stroke-width="4"/><circle cx="36" cy="42" r="5" fill="${K}"/><circle cx="64" cy="42" r="5" fill="${K}"/><path d="M30 58q20 22 40 0" fill="#B83A3A" ${T}/><ellipse cx="26" cy="58" rx="7" ry="4.5" fill="#FF8FA3" opacity=".6"/><ellipse cx="74" cy="58" rx="7" ry="4.5" fill="#FF8FA3" opacity=".6"/>`),
    triste: svg('0 0 100 100', `<circle cx="50" cy="50" r="42" fill="url(#cTriste)" stroke="${K}" stroke-width="4"/><path d="M26 34l14-4M74 34l-14-4" ${T}/><circle cx="36" cy="44" r="5" fill="${K}"/><circle cx="64" cy="44" r="5" fill="${K}"/><path d="M34 72q16-14 32 0" fill="none" ${T}/><path d="M30 52q-5 10 0 13q5-3 0-13z" fill="#3D8DF2"/>`),
    enfadado: svg('0 0 100 100', `<circle cx="50" cy="50" r="42" fill="url(#cEnfado)" stroke="${K}" stroke-width="4"/><path d="M24 30l18 8M76 30l-18 8" ${T}/><circle cx="36" cy="46" r="5" fill="${K}"/><circle cx="64" cy="46" r="5" fill="${K}"/><path d="M34 70q16-8 32 0" fill="none" ${T}/>`)
  };
  const MANOS = {
    mojar: svg('0 0 120 120', `<path d="M20 24h46q10 0 10 10v10h-14v-6H20z" fill="#B9C8D6" ${T}/><rect x="34" y="12" width="14" height="12" rx="3" fill="#8FA2B2" ${T}/><path d="M24 12h34" ${T}/><g fill="#6EC6F2" stroke="${K}" stroke-width="3"><path d="M69 54q-5 9 0 12q5-3 0-12z"/><path d="M62 70q-5 9 0 12q5-3 0-12z"/><path d="M76 72q-5 9 0 12q5-3 0-12z"/></g><path d="M38 100q-4-14 6-18l14-6q6-2 8 4l10 0q8 0 8 8q0 12-14 14z" fill="#FFD7B0" ${T}/><path d="M44 96h22M48 88h16" stroke="#E0A87E" stroke-width="3" stroke-linecap="round"/>`),
    jabon: svg('0 0 120 120', `<rect x="22" y="56" width="56" height="34" rx="12" fill="#FF9EC0" ${T}/><path d="M32 66h24" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/><g fill="url(#gBurbuja)" stroke="#3DBBC9" stroke-width="3"><circle cx="82" cy="40" r="13"/><circle cx="62" cy="30" r="9"/><circle cx="98" cy="62" r="8"/><circle cx="44" cy="40" r="6"/></g><circle cx="78" cy="36" r="3.5" fill="#fff"/>`),
    secar: svg('0 0 120 120', `<path d="M20 22h80" stroke="#8B5A2B" stroke-width="6" stroke-linecap="round"/><path d="M34 22h52v68q0 6-6 6H40q-6 0-6-6z" fill="#7FD3C8" ${T}/><path d="M34 76h52M34 84h52" stroke="#fff" stroke-width="4"/><path d="M48 22v30" stroke="#5FB5AA" stroke-width="4"/>`)
  };
  const GLOBO = { rojo: '#FF5A5F', azul: '#3D8DF2', amarillo: '#FFC93C' };
  const globo = c => svg('0 0 100 140', `<path d="M50 96q-6 14 4 22t-2 20" fill="none" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="50" cy="52" rx="34" ry="42" fill="${GLOBO[c]}" stroke="${K}" stroke-width="4"/><path d="M44 93h12l-6 6z" fill="${GLOBO[c]}" stroke="${K}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="38" cy="34" rx="8" ry="13" fill="#fff" opacity=".45" transform="rotate(-20 38 34)"/>`);
  const pez = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0l-14-12v24z" fill="#FF8A3D" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="0" cy="0" rx="30" ry="20" fill="url(#gPez3)" stroke="${K}" stroke-width="3.5"/><path d="M-6-18q8 4 6 12" fill="none" stroke="#FF8A3D" stroke-width="3"/><circle cx="14" cy="-5" r="4.5" fill="${K}"/><circle cx="15.5" cy="-6.5" r="1.4" fill="#fff"/><path d="M20 6q4 2 6 0" fill="none" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/></g>`;
  const plato = n => {
    const pos = { 1: [[100, 64]], 2: [[66, 64], [134, 64]], 3: [[62, 50], [138, 50], [100, 84]] }[n];
    return svg('0 0 200 120', `<ellipse cx="100" cy="72" rx="94" ry="44" fill="#E7F7FA" stroke="${K}" stroke-width="4"/><ellipse cx="100" cy="72" rx="74" ry="31" fill="none" stroke="#B5E1EA" stroke-width="3"/>${pos.map(([x, y]) => pez(x, y, .78)).join('')}`);
  };
  const OBJ = {
    pelota: svg('0 0 100 100', `<circle cx="50" cy="50" r="44" fill="#fff" stroke="${K}" stroke-width="4"/><path d="M50 6a44 44 0 0 1 38 22L50 50z" fill="#FF5A5F"/><path d="M88 72a44 44 0 0 1-38 22V50z" fill="#3D8DF2"/><path d="M12 72a44 44 0 0 1 0-44l38 22z" fill="#FFC93C"/><circle cx="50" cy="50" r="44" fill="none" stroke="${K}" stroke-width="4"/><circle cx="50" cy="50" r="7" fill="#fff" stroke="${K}" stroke-width="3"/>`),
    pez: svg('-50 -30 100 60', pez(4, 0, 1.1)),
    concha: svg('0 0 100 100', `<path d="M50 88L12 46q-4-32 38-38q42 6 38 38z" fill="#FFB3C7" stroke="${K}" stroke-width="4.5" stroke-linejoin="round"/><path d="M50 86L30 22M50 86V12M50 86L70 22M50 86L18 36M50 86L82 36" stroke="#E07A98" stroke-width="3.5"/><path d="M38 88h24l-4 8H42z" fill="#FFB3C7" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`)
  };
  const BURBUJAS_IC = svg('0 0 120 100', `<path d="M24 78L44 58L66 42L88 26" stroke="#0B7A8F" stroke-width="7" stroke-linecap="round" opacity=".35"/>${[[24, 78, 13], [44, 58, 12], [66, 42, 12], [88, 26, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gBurbuja)" stroke="#3DBBC9" stroke-width="3"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .25}" fill="#fff"/>`).join('')}`);

  /* ---------- los juegos ---------- */
  const JUEGOS = {
    burbujas: {
      t: 'Las burbujas de Lolo', c: '#0B7A8F', ic: BURBUJAS_IC, d: 'Explotar burbujas en orden: el primer paso para los trazos.',
      puente: 'Haced pompas de jabón en el patio y explotadlas con un dedo. Después, pegad gomets en fila sobre una línea.',
      rondas: [
        { k: 'vertical', q: 'Lolo ha hecho burbujas en fila, de arriba abajo. Tocad la burbuja que brilla, una detrás de otra.', ok: '¡Habéis explotado todas las burbujas! De arriba abajo, ¡muy bien!' },
        { k: 'horizontal', q: 'Ahora las burbujas van de un lado al otro. Tocad la que brilla.', ok: '¡Todas explotadas! De un lado al otro.' },
        { k: 'circulo', q: '¡Las burbujas hacen un círculo! Empezamos arriba y damos la vuelta.', ok: '¡Un círculo de burbujas! ¡Qué bien lo habéis hecho!' }
      ],
      aviso: 'Esa todavía no. Tocad la burbuja que brilla.',
      ronda(R, a) {
        const P = R.k === 'vertical' ? [26, 63, 100, 137, 174].map(y => [150, y])
          : R.k === 'horizontal' ? [40, 84, 128, 172, 216, 260].map(x => [x, 100])
          : Array.from({ length: 8 }, (_, i) => { const g = -Math.PI / 2 - i * Math.PI / 4; return [150 + Math.cos(g) * 72, 100 + Math.sin(g) * 72]; });
        a.z.innerHTML = `<div class="burbujas-caja"><svg class="burbujas-svg" viewBox="0 0 300 200" role="group" aria-label="Burbujas en fila"><g class="tinta-b"></g>${P.map(([x, y], i) => `<g class="burbuja" data-i="${i}" transform="translate(${x} ${y})" role="button" aria-label="Burbuja ${i + 1}" tabindex="-1"><circle class="aro" r="24"/><circle class="cuerpo-b" r="18"/><circle class="brillo-b" cx="-6.5" cy="-6.5" r="4.6"/></g>`).join('')}</svg></div>`;
        const bs = [...a.z.querySelectorAll('.burbuja')], tinta = a.z.querySelector('.tinta-b');
        let sig = 0, avisado = 0;
        const marca = () => bs.forEach((b, i) => { b.classList.toggle('sig', i === sig); b.setAttribute('tabindex', i === sig ? '0' : '-1'); });
        marca();
        const toca = b => {
          if (!b || a.resuelta()) return;
          const i = +b.dataset.i;
          if (i === sig) {
            b.classList.add('rota'); pop(i);
            if (i > 0) { const [x1, y1] = P[i - 1], [x2, y2] = P[i]; tinta.insertAdjacentHTML('beforeend', `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`); }
            sig++;
            if (sig === P.length) { bs.forEach(x => { x.classList.remove('sig'); x.setAttribute('tabindex', '-1'); }); if (R.k === 'circulo') { const [x1, y1] = P[P.length - 1], [x2, y2] = P[0]; tinta.insertAdjacentHTML('beforeend', `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`); } a.ok(R.ok, a.z.querySelector('.burbujas-svg')); }
            else marca();
          } else if (!b.classList.contains('rota') && Date.now() - avisado > 4000) { avisado = Date.now(); a.fallo(JUEGOS.burbujas.aviso); }
        };
        a.z.querySelector('.burbujas-svg').addEventListener('click', e => toca(e.target.closest('.burbuja')));
        a.z.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.burbuja')) { e.preventDefault(); toca(e.target.closest('.burbuja')); } });
        a.decir(R.q);
      }
    },

    cara: {
      t: 'La cara de Lolo', c: '#FF8A3D', ic: svg('0 0 240 200', `<g transform="translate(0 -18)">${lolo('feliz').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`), d: 'Ojos, boca y tentáculos: tocar y nombrar.',
      puente: 'Delante de un espejo, tocad vuestros ojos, la boca y la nariz mientras los nombráis. ¡Y moved los brazos como Lolo mueve sus tentáculos!',
      nombre: { ojos: 'Eso son los ojos.', boca: 'Eso es la boca.', tentaculos: 'Eso son los tentáculos.' },
      rondas: [
        { k: 'ojos', q: '¿Dónde están los ojos de Lolo? Tocadlos.', ok: '¡Sí! Esos son los ojos. Con los ojos miramos.' },
        { k: 'boca', q: '¿Dónde está la boca de Lolo?', ok: '¡Muy bien! Esa es la boca. Con la boca comemos y hablamos.' },
        { k: 'tentaculos', q: 'Lolo no tiene brazos: tiene tentáculos. ¿Dónde están?', ok: '¡Eso es! Lolo tiene tentáculos para nadar y para abrazar.' }
      ],
      ronda(R, a) {
        a.sinMascota();
        a.z.innerHTML = `<div class="cara-caja" data-busca="${R.k}">${lolo('feliz', true)}</div>`;
        const elige = el => {
          const p = el && el.closest('.parte'); if (!p || a.resuelta()) return;
          const k = p.dataset.parte;
          if (k === R.k) { p.classList.add('bien'); a.ok(R.ok, p); }
          else { p.classList.add('no'); setTimeout(() => p.classList.remove('no'), 600); a.fallo(`${JUEGOS.cara.nombre[k]} ${R.q}`, a.z.querySelector(`.parte[data-parte="${R.k}"]`), [JUEGOS.cara.nombre[k], R.q]); }
        };
        a.z.addEventListener('click', e => elige(e.target));
        a.z.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elige(e.target); } });
        a.decir(R.q);
      }
    },

    animales: {
      t: '¿Quién hace este ruido?', c: '#2BB673', ic: ANIMAL.vaca, d: 'Escuchar a Lolo y encontrar al animal.',
      puente: 'Jugad a imitar animales: uno hace el sonido y los demás adivinan quién es.',
      otraVez: 'Escuchad otra vez.',
      A: {
        vaca: { lbl: 'Vaca', q: '¿Quién dice «muuu»?', ok: '¡La vaca! La vaca dice muuu.', es: 'Esa es la vaca.' },
        perro: { lbl: 'Perro', q: '¿Quién dice «guau, guau»?', ok: '¡El perro! El perro dice guau, guau.', es: 'Ese es el perro.' },
        gato: { lbl: 'Gato', q: '¿Quién dice «miau»?', ok: '¡El gato! El gato dice miau.', es: 'Ese es el gato.' },
        pato: { lbl: 'Pato', q: '¿Quién dice «cuac, cuac»?', ok: '¡El pato! El pato dice cuac, cuac.', es: 'Ese es el pato.' },
        oveja: { lbl: 'Oveja', q: '¿Quién dice «beee»?', ok: '¡La oveja! La oveja dice beee.', es: 'Esa es la oveja.' }
      },
      rondas: [{ k: 'vaca', o: 'perro' }, { k: 'gato', o: 'pato' }, { k: 'oveja', o: 'vaca' }],
      ronda(R, a) {
        const A = JUEGOS.animales.A, X = A[R.k];
        a.elige([{ html: ANIMAL[R.k], lbl: A[R.k].lbl, ok: true }, { html: ANIMAL[R.o], lbl: A[R.o].lbl, k: R.o }], X.ok,
          o => [`${A[o.k].es} ${X.q}`, [A[o.k].es, X.q]]);
        const f = document.createElement('div'); f.className = 'fila centro'; a.z.appendChild(f);
        a.boton('Escuchar otra vez', () => a.decir(X.q, [JUEGOS.animales.otraVez, X.q]), f, 'sec', ICONO.oreja);
        a.decir(X.q);
      }
    },

    emociones: {
      t: '¿Cómo está Lolo?', c: '#9B6BFF', ic: svg('0 0 150 100', `<g transform="translate(0 6) scale(.52)">${CARA.contento.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><g transform="translate(48 24) scale(.52)">${CARA.triste.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><g transform="translate(96 6) scale(.52)">${CARA.enfadado.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`), d: 'Contento, triste o enfadado.',
      puente: 'Con un espejo, poned cara de contento, de triste y de enfadado. Hablad de qué nos ayuda cuando estamos tristes o enfadados.',
      E: { contento: 'Contento', triste: 'Triste', enfadado: 'Enfadado' },
      rondas: [
        { k: 'contento', o: 'triste', q: 'Mirad la cara de Lolo. ¿Cómo está Lolo?', ok: '¡Sí! Lolo está contento: está jugando con sus amigos.', f: 'Mirad su boca: está sonriendo. ¿Está contento o triste?' },
        { k: 'triste', o: 'contento', q: '¿Y ahora? ¿Cómo está Lolo?', ok: 'Lolo está triste: se le ha perdido su pelota. Le damos un abrazo.', f: 'Mirad sus ojos: tiene una lágrima. ¿Está triste o contento?' },
        { k: 'enfadado', o: 'triste', q: '¿Cómo está Lolo ahora?', ok: 'Lolo está enfadado. Respiramos juntos despacito y se le pasa.', f: 'Mirad sus cejas: están muy juntas. ¿Está enfadado o triste?' }
      ],
      ronda(R, a) {
        a.sinMascota();
        const E = JUEGOS.emociones.E;
        a.z.innerHTML = `<div class="emo-lolo">${lolo(R.k === 'contento' ? 'feliz' : R.k)}</div>`;
        a.elige([{ html: CARA[R.k], lbl: E[R.k], ok: true }, { html: CARA[R.o], lbl: E[R.o] }], R.ok, () => [R.f], 'ops-caras');
        a.decir(R.q);
      }
    },

    manos: {
      t: 'Nos lavamos las manos', c: '#3D8DF2', ic: MANOS.jabon, d: 'Agua, jabón y toalla, en orden.',
      puente: 'Id al baño y lavaos las manos de verdad, en el mismo orden: agua, jabón y toalla. Podéis cantar mientras frotáis.',
      P: { mojar: 'Agua', jabon: 'Jabón', secar: 'Toalla' },
      rondas: [
        { k: 'mojar', o: 'secar', q: 'Vamos a lavarnos las manos. Primero, ¿qué hacemos?', ok: '¡Eso es! Primero nos mojamos las manos con agua.', f: 'Todavía no podemos secarlas: están sucias. Primero, el agua.' },
        { k: 'jabon', o: 'mojar', q: 'Ya están mojadas. ¿Y ahora?', ok: '¡Muy bien! Ahora el jabón: frotamos y frotamos hasta hacer espuma.', f: 'Ya están mojadas. Ahora necesitamos el jabón.' },
        { k: 'secar', o: 'jabon', q: '¡Qué espuma! Nos aclaramos con agua. ¿Y al final?', ok: '¡Al final, nos secamos con la toalla! ¡Manos limpias!', f: 'Ya tienen jabón. Al final, nos secamos.' }
      ],
      ronda(R, a, n) {
        const P = JUEGOS.manos.P, orden = ['mojar', 'jabon', 'secar'];
        a.z.innerHTML = `<ol class="pasos" aria-label="Pasos para lavarse las manos">${orden.map((k, i) => `<li class="${i < n ? 'hecho' : ''}${i === n ? ' ahora' : ''}" data-k="${k}"><span class="pn">${i + 1}</span><span class="pd">${i < n ? MANOS[k] : '<b>?</b>'}</span></li>`).join('')}</ol>`;
        a.elige([{ html: MANOS[R.k], lbl: P[R.k], ok: true }, { html: MANOS[R.o], lbl: P[R.o] }], R.ok, () => [R.f], '', () => {
          const li = a.z.querySelector(`.pasos li[data-k="${R.k}"]`); li.classList.add('hecho'); li.querySelector('.pd').innerHTML = MANOS[R.k];
        });
        a.decir(R.q);
      }
    },

    colores: {
      t: 'Los globos de colores', c: '#FF5D8F', ic: svg('0 0 140 120', `<g transform="translate(4 8) scale(.62)">${globo('rojo').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><g transform="translate(44 0) scale(.62)">${globo('amarillo').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><g transform="translate(84 8) scale(.62)">${globo('azul').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`), d: 'Rojo, azul y amarillo.',
      puente: 'Buscad por la clase cosas rojas, azules y amarillas, y ponedlas en tres cestas.',
      N: { rojo: 'Rojo', azul: 'Azul', amarillo: 'Amarillo' },
      rondas: [
        { k: 'rojo', o: 'azul', q: 'Lolo quiere el globo rojo. ¿Cuál es?', ok: '¡El globo rojo! Rojo como una fresa.', f: 'Ese globo es azul. Lolo quiere el rojo.' },
        { k: 'azul', o: 'amarillo', q: 'Ahora Lolo quiere el globo azul.', ok: '¡Azul! Azul como el mar de Lolo.', f: 'Ese globo es amarillo. Buscamos el azul.' },
        { k: 'amarillo', o: 'rojo', q: '¿Y el globo amarillo? ¿Dónde está?', ok: '¡Amarillo, como el sol! ¡Muy bien!', f: 'Ese globo es rojo. Buscamos el amarillo.' }
      ],
      ronda(R, a) {
        const N = JUEGOS.colores.N;
        a.elige([{ html: globo(R.k), lbl: N[R.k], ok: true, color: GLOBO[R.k] }, { html: globo(R.o), lbl: N[R.o], color: GLOBO[R.o] }], R.ok, () => [R.f], 'ops-globos');
        a.decir(R.q);
      }
    },

    cuenta: {
      t: 'Uno, dos, tres', c: '#FFB21E', ic: plato(3), d: 'Contar peces hasta tres.',
      puente: 'Dad de comer a un peluche: una pieza, dos piezas y tres piezas, contando con el dedo.',
      hay: { 1: 'Ahí hay un pez.', 2: 'Ahí hay dos peces.', 3: 'Ahí hay tres peces.' },
      rondas: [
        { n: 1, o: 3, q: '¿Dónde hay un pez?', ok: '¡Un pez! Uno.' },
        { n: 2, o: 1, q: '¿Dónde hay dos peces?', ok: '¡Dos peces! Uno, dos.' },
        { n: 3, o: 2, q: '¿Dónde hay tres peces?', ok: '¡Tres peces! Uno, dos, tres.' }
      ],
      ronda(R, a) {
        const H = JUEGOS.cuenta.hay, lbl = n => ({ 1: 'Un pez', 2: 'Dos peces', 3: 'Tres peces' })[n];
        a.elige([{ html: plato(R.n), lbl: lbl(R.n), ok: true, oculto: true }, { html: plato(R.o), lbl: lbl(R.o), oculto: true }], R.ok, () => [`${H[R.o]} ${R.q}`, [H[R.o], R.q]], 'ops-platos');
        a.decir(R.q);
      }
    },

    tamanos: {
      t: 'Grande y pequeño', c: '#1FA36B', ic: svg('0 0 140 100', `<g transform="translate(6 10) scale(.8)">${OBJ.pelota.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><g transform="translate(96 54) scale(.36)">${OBJ.pelota.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`), d: 'Encontrar el grande o el pequeño.',
      puente: 'En el patio, buscad una pelota grande y una pequeña. ¿Cuál bota más alto?',
      rondas: [
        { k: 'pelota', g: 'grande', q: '¿Cuál es la pelota grande?', ok: '¡Esa es la pelota grande! ¡Qué grande!', f: 'Esa es la pelota pequeña. Buscamos la grande.' },
        { k: 'pez', g: 'pequeno', q: '¿Dónde está el pez pequeño?', ok: '¡El pez pequeño! Es chiquitito.', f: 'Ese es el pez grande. Buscamos el pequeño.' },
        { k: 'concha', g: 'grande', q: '¿Cuál es la concha grande?', ok: '¡La concha grande! ¡Muy bien!', f: 'Esa es la concha pequeña. Buscamos la grande.' }
      ],
      ronda(R, a) {
        const gr = { html: `<span class="tam tam-g">${OBJ[R.k]}</span>`, lbl: 'Grande' }, pq = { html: `<span class="tam tam-p">${OBJ[R.k]}</span>`, lbl: 'Pequeño' };
        (R.g === 'grande' ? gr : pq).ok = true;
        a.elige([gr, pq].map(o => ({ ...o, oculto: true })), R.ok, () => [R.f], 'ops-tam');
        a.decir(R.q);
      }
    }
  };
  const ORDEN = ['burbujas', 'cara', 'animales', 'emociones', 'manos', 'colores', 'cuenta', 'tamanos'];
  const ICONO = {
    oreja: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0"/><path d="M10 9a2 2 0 0 1 4 0"/></svg>',
    flecha: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    ok: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    otra: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4.5h4.5"/></svg>',
    menu: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>',
    mano: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#fff"/><path d="M22 44V24a3 3 0 0 1 6 0v12M28 34V18a3 3 0 0 1 6 0v16M34 34V20a3 3 0 0 1 6 0v16M40 36v-8a3 3 0 0 1 6 0v10c0 8-6 14-14 14h-2c-5 0-8-2-11-6l-6-8a3 3 0 0 1 5-4l4 4" fill="#FFD7B0" stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/></svg>`
  };
  const FR = {
    menu: '¡Hola, peques! ¿A qué jugamos?',
    seguimos: 'Seguimos', fin: '¡Muy bien! Se acabó el juego. Lo habéis hecho genial.'
  };

  /* ---------- motor ---------- */
  let est = null;
  const agenda = $('#agenda'), juegoEl = $('#juego'), menuEl = $('#menu');
  function pintaAgenda() {
    if (!est) return;
    const J = JUEGOS[est.id], hechos = est.fin ? 4 : est.hechas;
    const it = [0, 1, 2].map(i => ({ lbl: `Reto ${i + 1}`, ic: J.ic })).concat([{ lbl: 'Fin', fin: true }]);
    agenda.innerHTML = it.map((x, i) => `<li class="ag${i < hechos ? ' hecho' : ''}${!est.fin && i === est.ronda ? ' ahora' : ''}">${!est.fin && i === est.ronda ? '<span class="tag">Ahora</span>' : ''}<span class="ag-ic">${x.fin ? ICONO.ok : x.ic}</span><span class="ag-t">${x.lbl}</span>${i < hechos ? `<span class="ag-ok" aria-label="hecho">${ICONO.ok}</span>` : ''}</li>`).join('');
  }
  function boton(txt, fn, cont, cl = '', ic = '') {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'big ' + cl;
    b.innerHTML = (ic ? `<span class="mini">${ic}</span>` : '') + `<span>${txt}</span>` + (cl.includes('sec') ? '' : ICONO.flecha);
    b.addEventListener('click', fn); cont.appendChild(b);
    if (!quieto() && b.animate) b.animate([{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.3,1.6,.5,1)' });
    return b;
  }
  const marcar = el => { if (!el) return; el.classList.add('pista'); setTimeout(() => el.classList.remove('pista'), 3200); };
  const sacude = el => { if (!el) return; el.classList.remove('sacude'); void el.offsetWidth; el.classList.add('sacude'); };

  function api() {
    const s = est;
    const a = {
      z: zona,
      decir,
      resuelta: () => s.resuelta,
      sinMascota: () => document.body.classList.add('sin-mascota'),
      boton: (t, fn, cont, cl, ic) => boton(t, fn, cont, cl, ic),
      ok(msg, el) {
        if (s.resuelta || s !== est) return; s.resuelta = true; s.hechas = s.ronda + 1;
        acierto(); celebrar(el || zona); cara('feliz'); anima('salta'); decir(msg); pintaAgenda();
        setTimeout(() => {
          if (s !== est) return;
          const f = document.createElement('div'); f.className = 'fila centro siguiente'; zona.appendChild(f);
          const ult = s.ronda >= 2;
          boton(ult ? 'Terminar' : FR.seguimos, () => { if (ult) fin(); else { s.ronda++; ronda(); } }, f, 'pulso', ult ? ICONO.ok : JUEGOS[s.id].ic);
          const r = f.getBoundingClientRect(); if (f.scrollIntoView && (r.bottom > innerHeight || r.top < 0)) f.scrollIntoView({ block: 'nearest', behavior: quieto() ? 'auto' : 'smooth' });
        }, 650);
      },
      fallo(msg, correcto, partes) {
        if (s.resuelta) return; s.fallos++;
        cara('sorpresa'); setTimeout(() => { if (s === est && !s.resuelta) cara('feliz'); }, 1400);
        if (msg) decir(msg, partes);
        if (s.fallos >= 2) marcar(correcto);
      },
      /* Dos opciones grandes. ops: {html, lbl, ok, oculto}. fallo(o) → [texto, partes] */
      elige(ops, okMsg, fallo, cl = '', alAcertar) {
        const lista = mezcla(ops);
        const w = document.createElement('div'); w.className = 'ops ' + cl;
        w.innerHTML = lista.map((o, i) => `<button class="op" type="button" data-i="${i}"${o.ok ? ' data-ok="1"' : ''} aria-label="${o.lbl}"${o.color ? ` style="--oc:${o.color}"` : ''}><span class="op-dib">${o.html}</span>${o.oculto ? '' : `<span class="op-lbl">${o.color ? '<i></i>' : ''}${o.lbl}</span>`}</button>`).join('');
        zona.appendChild(w);
        const bs = [...w.querySelectorAll('.op')], buena = bs[lista.findIndex(o => o.ok)];
        bs.forEach((b, i) => b.addEventListener('click', () => {
          if (s.resuelta) return; const o = lista[i];
          if (o.ok) { b.classList.add('bien'); bs.forEach(x => x !== b && x.classList.add('apagada')); if (alAcertar) alAcertar(); a.ok(okMsg, b); }
          else { sacude(b); const [t, p] = fallo(o); a.fallo(t, buena, p); }
        }));
      }
    };
    return a;
  }
  function ronda() {
    const J = JUEGOS[est.id]; est.fallos = 0; est.resuelta = false;
    document.body.classList.remove('sin-mascota');
    zona.innerHTML = ''; zona.classList.remove('entra'); void zona.offsetWidth; if (!quieto()) zona.classList.add('entra');
    cara('feliz'); pintaAgenda();
    J.ronda(J.rondas[est.ronda], api(), est.ronda);
  }
  function fin() {
    const J = JUEGOS[est.id]; est.fin = true; pintaAgenda();
    document.body.classList.remove('sin-mascota');
    cara('feliz'); anima('baila'); celebrar(zona); acierto();
    zona.innerHTML = `<div class="final"><span class="final-ok">${ICONO.ok}</span><b>¡Se acabó!</b></div><div class="manos-fuera">${ICONO.mano}<div><b>Ahora, sin pantalla</b><p>${J.puente}</p></div></div><div class="fila centro" id="finAcc"></div>`;
    const f = $('#finAcc');
    boton('Jugar otra vez', () => abrir(est.id), f, 'sec', ICONO.otra);
    boton('Otro juego', () => irMenu(), f, '', ICONO.menu);
    decir(FR.fin);
  }
  function abrir(id) {
    if (!JUEGOS[id]) return;
    callar();
    est = { id, ronda: 0, hechas: 0, fallos: 0, resuelta: false, fin: false };
    menuEl.hidden = true; juegoEl.hidden = false; $('#btnJuegos').hidden = false;
    document.body.dataset.juego = id; document.documentElement.style.setProperty('--jc', JUEGOS[id].c);
    if (location.hash !== '#' + id) try { history.replaceState(null, '', '#' + id); } catch (e) {}
    ronda();
    scrollTo({ top: 0, behavior: 'auto' });
  }
  function irMenu() {
    callar(); est = null; document.body.classList.remove('sin-mascota'); delete document.body.dataset.juego;
    juegoEl.hidden = true; menuEl.hidden = false; $('#btnJuegos').hidden = true;
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    texto.textContent = ''; ultimo = [FR.menu];
  }

  /* ---------- menú ---------- */
  $('#menuLolo').innerHTML = lolo('feliz');
  $('#menuGrid').innerHTML = ORDEN.map((id, i) => { const J = JUEGOS[id]; return `<a class="tile" href="#${id}" data-id="${id}" style="--c:${J.c};--i:${i}"><span class="tile-dib">${J.ic}</span><span class="tile-t"><b>${J.t}</b><small>${J.d}</small></span></a>`; }).join('');
  $('#menuGrid').addEventListener('click', e => { const t = e.target.closest('.tile'); if (!t) return; e.preventDefault(); abrir(t.dataset.id); });
  addEventListener('hashchange', () => { const id = location.hash.slice(1); if (JUEGOS[id]) { if (!est || est.id !== id) abrir(id); } else if (est) irMenu(); });

  /* ---------- herramientas ---------- */
  function aplicaCalma() { document.documentElement.classList.toggle('calma', calma); $('#btnCalma').setAttribute('aria-pressed', String(calma)); }
  function aplicaVoz() { $('#btnVoz').setAttribute('aria-pressed', String(voz)); $('#btnVoz span').textContent = voz ? 'Voz' : 'Sin voz'; }
  $('#btnCalma').addEventListener('click', () => { calma = !calma; guarda('lolo-calma', calma ? '1' : '0'); aplicaCalma(); });
  $('#btnVoz').addEventListener('click', () => { voz = !voz; guarda('lolo-tres-voz', voz ? '1' : '0'); if (!voz) callar(); aplicaVoz(); });
  $('#btnRepetir').addEventListener('click', () => { if (!ultimo) { ultimo = [FR.menu]; } if (est) decir(ultimo[0], ultimo[1]); else hablar(FR.menu); });
  $('#btnJuegos').addEventListener('click', irMenu);
  aplicaCalma(); aplicaVoz();

  /* ---------- burbujas de fondo ---------- */
  (function () {
    const c = $('#burbujasFondo'), x = c.getContext('2d'); let w, h; const b = [];
    const size = () => { w = c.width = innerWidth * devicePixelRatio; h = c.height = innerHeight * devicePixelRatio; }; size(); addEventListener('resize', size);
    for (let i = 0; i < 22; i++) b.push({ x: Math.random(), y: Math.random(), r: 2 + Math.random() * 7, v: .0005 + Math.random() * .001, o: Math.random() * 6 });
    const dib = t => {
      x.clearRect(0, 0, w, h);
      if (!quieto()) b.forEach(p => { p.y -= p.v; if (p.y < -.05) { p.y = 1.05; p.x = Math.random(); }
        const px = (p.x + Math.sin(t / 1400 + p.o) * .008) * w, py = p.y * h, r = p.r * devicePixelRatio;
        x.beginPath(); x.arc(px, py, r, 0, 7); x.fillStyle = 'rgba(255,255,255,.16)'; x.fill(); x.lineWidth = 1.2 * devicePixelRatio; x.strokeStyle = 'rgba(255,255,255,.5)'; x.stroke(); });
      requestAnimationFrame(dib);
    };
    requestAnimationFrame(dib);
  })();

  /* Todas las frases que dice Lolo en este modo (para el guion de audios). */
  window.__frasesTres = () => {
    const f = new Set(Object.values(FR));
    Object.values(JUEGOS).forEach(J => {
      J.rondas.forEach(R => ['q', 'ok', 'f'].forEach(k => R[k] && f.add(R[k])));
      ['aviso', 'otraVez'].forEach(k => J[k] && f.add(J[k]));
      if (J.nombre) Object.values(J.nombre).forEach(v => f.add(v));
      if (J.A) Object.values(J.A).forEach(v => { f.add(v.q); f.add(v.ok); f.add(v.es); });
      if (J.hay) Object.values(J.hay).forEach(v => f.add(v));
    });
    f.delete(FR.seguimos);
    return [...f];
  };

  const id0 = location.hash.slice(1);
  if (JUEGOS[id0]) abrir(id0); else irMenu();
})();
