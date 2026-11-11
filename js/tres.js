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
  const may = t => t[0].toUpperCase() + t.slice(1);
  const K = '#183153';

  const reduceSO = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let calma = lee('raiz-calma', '0') === '1';
  const quieto = () => reduceSO || calma;
  let voz = lee('raiz-tres-voz', '1') !== '0';
  const texto = $('#texto'), zona = $('#zona');
  let ultimo = null;

  /* ---------- voz: audios grabados y, si falta alguno, la voz del navegador ---------- */
  let voces = [], vozEs = null;
  const esNatural = v => /natural|neural|online|premium|enhanced|mejorad|google|siri/i.test(v.name);
  const puntua = v => (/natural|neural/i.test(v.name) ? 60 : 0) + (/online/i.test(v.name) ? 20 : 0) + (/premium|enhanced|mejorad|siri/i.test(v.name) ? 50 : 0) + (/google/i.test(v.name) ? 35 : 0) + (/^es[-_]ES/i.test(v.lang) ? 10 : 0);
  function cargarVoces() {
    try {
      voces = speechSynthesis.getVoices().filter(v => /^es/i.test(v.lang)).sort((a, b) => puntua(b) - puntua(a));
      const g = lee('raiz-voz', null); vozEs = voces.find(v => v.voiceURI === g) || voces[0] || null;
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
  function ruido(t0, dur, v, frec) {
    const a = actx(); if (!a) return;
    const n = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = buf; f.type = 'bandpass'; f.frequency.value = frec; f.Q.value = .8; g.gain.value = calma ? v * .45 : v;
    s.connect(f).connect(g).connect(a.destination); s.start(a.currentTime + t0);
  }
  function golpe(t0) {
    const a = actx(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + t0;
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(55, t + .25);
    g.gain.setValueAtTime(calma ? .25 : .55, t); g.gain.exponentialRampToValueAtTime(.001, t + .35);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + .4); ruido(t0, .07, .3, 400);
  }
  const tocaTambor = n => { for (let i = 0; i < n; i++) golpe(i * .3); };
  const cancion = () => tono([523, 659, 784, 659, 523, 784], 'triangle', .1, .2, .35);

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
  /* ================= Comunicar, anticipar, calmarse y esperar turno =================
     Pensados para alumnado con autismo y útiles para toda la clase. Cada opción lleva dibujo, palabra y voz,
     así sirve igual si el niño toca, señala, mira o lo dice. */
  const PIC = {
    lavar: MANOS.jabon,
    comer: svg('0 0 120 120', `<path d="M18 30v48M12 30v12q6 6 12 0V30" fill="none" ${T}/><path d="M102 30c-8 0-10 14-10 24h10v24" fill="#B9C8D6" ${T}/><ellipse cx="60" cy="74" rx="34" ry="16" fill="#fff" ${T}/><ellipse cx="60" cy="70" rx="22" ry="8" fill="#FFE3A6" stroke="${K}" stroke-width="3"/><circle cx="52" cy="66" r="5.5" fill="#2BB673" stroke="${K}" stroke-width="2.5"/><circle cx="66" cy="65" r="5.5" fill="#FF5A5F" stroke="${K}" stroke-width="2.5"/>`),
    recoger: svg('0 0 120 120', `<circle cx="46" cy="44" r="14" fill="#FF5A5F" ${T}/><rect x="62" y="30" width="24" height="24" rx="4" fill="#3D8DF2" ${T}/><path d="M16 54h88l-9 46H25z" fill="#FFB84D" ${T}/><path d="M30 70h60" stroke="#E09A2A" stroke-width="4" stroke-linecap="round"/>`),
    patio: svg('0 0 120 120', `<path d="M24 100V30M44 100V30M24 50h20M24 70h20M24 90h20" fill="none" ${T}/><path d="M44 30q40 6 56 70" fill="none" stroke="${K}" stroke-width="12" stroke-linecap="round"/><path d="M44 30q40 6 56 70" fill="none" stroke="#FF8A3D" stroke-width="7" stroke-linecap="round"/><path d="M14 100h96" ${T}/><circle cx="96" cy="26" r="10" fill="#FFC93C" ${T}/>`),
    abrigo: svg('0 0 120 120', `<path d="M44 18h32l26 16-8 24-10-6v50H36V52l-10 6-8-24z" fill="#2BB673" ${T}/><path d="M60 26v76" stroke="${K}" stroke-width="3"/><circle cx="66" cy="50" r="3" fill="${K}"/><circle cx="66" cy="66" r="3" fill="${K}"/><circle cx="66" cy="82" r="3" fill="${K}"/><path d="M44 18q16 14 32 0" fill="#1C8C5B" ${T}/>`),
    casa: svg('0 0 120 120', `<path d="M16 58L60 20l44 38" fill="none" ${T}/><path d="M26 50v52h68V50L60 22z" fill="#FFD27F" ${T}/><path d="M16 58L60 20l44 38" fill="#FF5A5F" ${T}/><rect x="50" y="70" width="20" height="32" rx="3" fill="#8B5A2B" ${T}/><rect x="74" y="62" width="14" height="14" rx="2" fill="#BFE6F5" ${T}/>`)
  };
  const VEH = {
    tren: svg('0 0 140 100', `<rect x="18" y="38" width="62" height="38" rx="6" fill="#FF5A5F" ${T}/><rect x="80" y="22" width="40" height="54" rx="6" fill="#3D8DF2" ${T}/><rect x="88" y="30" width="24" height="18" rx="3" fill="#BFE6F5" ${T}/><rect x="28" y="20" width="14" height="18" rx="2" fill="#555F6E" ${T}/><path d="M6 76h126" ${T}/><g fill="#555F6E" ${T}><circle cx="34" cy="80" r="10"/><circle cx="64" cy="80" r="10"/><circle cx="100" cy="80" r="10"/></g><g class="humo" fill="#E3EDF2"><circle cx="34" cy="12" r="6"/><circle cx="22" cy="6" r="4"/></g>`),
    coche: svg('0 0 140 100', `<path d="M14 66V52q0-8 8-10l16-4 14-16h40l18 18 14 4q8 2 8 10v12z" fill="#FFC93C" ${T}/><path d="M56 26h32l14 16H44z" fill="#BFE6F5" ${T}/><path d="M72 26v16" stroke="${K}" stroke-width="3"/><g fill="#555F6E" ${T}><circle cx="40" cy="68" r="12"/><circle cx="106" cy="68" r="12"/></g><circle cx="40" cy="68" r="4" fill="#fff"/><circle cx="106" cy="68" r="4" fill="#fff"/><path d="M124 54h6" ${T}/>`)
  };
  const INS = {
    tambor: svg('0 0 120 120', `<path d="M24 48v34q36 20 72 0V48" fill="#FF5A5F" ${T}/><ellipse cx="60" cy="48" rx="36" ry="12" fill="#FFF3E3" ${T}/><path d="M24 64q36 20 72 0M36 82l6-22M60 88V64M84 82l-6-22" fill="none" stroke="${K}" stroke-width="3"/><path d="M32 14l22 26M92 12L70 40" stroke="#8B5A2B" stroke-width="6" stroke-linecap="round"/><circle cx="32" cy="14" r="5" fill="#FFC93C" ${T}/><circle cx="92" cy="12" r="5" fill="#FFC93C" ${T}/>`),
    maracas: svg('0 0 120 120', `<g transform="rotate(-18 40 60)"><ellipse cx="40" cy="40" rx="18" ry="22" fill="#2BB673" ${T}/><path d="M40 62v38" stroke="#8B5A2B" stroke-width="8" stroke-linecap="round"/><path d="M28 36h24M30 46h20" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></g><g transform="rotate(18 80 60)"><ellipse cx="80" cy="40" rx="18" ry="22" fill="#9B6BFF" ${T}/><path d="M80 62v38" stroke="#8B5A2B" stroke-width="8" stroke-linecap="round"/><path d="M68 36h24M70 46h20" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>`)
  };
  const SINO = {
    si: svg('0 0 100 100', `<circle cx="50" cy="50" r="42" fill="#2BB673" stroke="${K}" stroke-width="4"/><path d="M30 52l13 13 27-30" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`),
    no: svg('0 0 100 100', `<circle cx="50" cy="50" r="42" fill="#FF5A5F" stroke="${K}" stroke-width="4"/><path d="M34 34l32 32M66 34L34 66" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`)
  };
  CARA.asustado = svg('0 0 100 100', `<circle cx="50" cy="50" r="42" fill="#C9B5FF" stroke="${K}" stroke-width="4"/><path d="M26 30q8-6 16-2M74 30q-8-6-16-2" fill="none" ${T}/><circle cx="36" cy="44" r="7" fill="#fff" stroke="${K}" stroke-width="3"/><circle cx="64" cy="44" r="7" fill="#fff" stroke="${K}" stroke-width="3"/><circle cx="36" cy="44" r="3" fill="${K}"/><circle cx="64" cy="44" r="3" fill="${K}"/><ellipse cx="50" cy="70" rx="8" ry="10" fill="#B83A3A" ${T}/>`);
  const AYUDA = {
    abrazo: svg('0 0 120 120', `<path d="M60 100S18 74 18 46a20 20 0 0 1 42-8a20 20 0 0 1 42 8c0 28-42 54-42 54z" fill="#FF8FA3" ${T}/><path d="M30 60q30 22 60 0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`),
    respirar: svg('0 0 120 120', `<path d="M60 92q-4 10 2 20" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/><ellipse cx="60" cy="52" rx="30" ry="38" fill="#6EC6F2" ${T}/><path d="M55 89h10l-5 5z" fill="#6EC6F2" stroke="${K}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="48" cy="36" rx="7" ry="12" fill="#fff" opacity=".5" transform="rotate(-20 48 36)"/><path d="M98 40h14M100 54h16M98 68h12" stroke="#8FA2B2" stroke-width="4" stroke-linecap="round"/>`),
    contar: svg('0 0 120 120', `<g font-family="Fredoka, sans-serif" font-weight="700" font-size="40" text-anchor="middle" stroke="${K}" stroke-width="2" paint-order="stroke"><text x="26" y="74" fill="#FF5A5F">1</text><text x="60" y="74" fill="#FFC93C">2</text><text x="94" y="74" fill="#3D8DF2">3</text></g><path d="M18 90q42 18 84 0" fill="none" stroke="#8FA2B2" stroke-width="4" stroke-linecap="round"/>`),
    ayuda: svg('0 0 120 120', `<circle cx="52" cy="40" r="16" fill="#FFD7B0" ${T}/><path d="M44 36h3M57 36h3M46 46q6 4 12 0" stroke="${K}" stroke-width="3" stroke-linecap="round"/><path d="M24 108q2-40 28-40t28 40z" fill="#9B6BFF" ${T}/><path d="M76 78L92 24" stroke="#FFD7B0" stroke-width="12" stroke-linecap="round"/><path d="M76 78L92 24" stroke="${K}" stroke-width="16" stroke-linecap="round" opacity=".001"/><circle cx="93" cy="20" r="9" fill="#FFD7B0" ${T}/>`),
    oidos: svg('0 0 120 120', `<circle cx="60" cy="56" r="30" fill="#FFD7B0" ${T}/><circle cx="50" cy="52" r="3.5" fill="${K}"/><circle cx="70" cy="52" r="3.5" fill="${K}"/><path d="M52 68q8 5 16 0" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round"/><rect x="18" y="42" width="18" height="30" rx="8" fill="#FFD7B0" ${T}/><rect x="84" y="42" width="18" height="30" rx="8" fill="#FFD7B0" ${T}/><path d="M20 14q-10 10 0 20M100 14q10 10 0 20" fill="none" stroke="#8FA2B2" stroke-width="4" stroke-linecap="round"/>`),
    rincon: svg('0 0 120 120', `<path d="M60 16L14 100h92z" fill="#B5E1EA" ${T}/><path d="M60 16v84M46 100q14-30 28 0" fill="#7FB8D8" ${T}/><path d="M60 52s-9-6-9-12a5 5 0 0 1 9-2a5 5 0 0 1 9 2c0 6-9 12-9 12z" fill="#FF8FA3" stroke="${K}" stroke-width="2.5"/>`)
  };
  const EQUIPO = [{ n: 'amarillo', c: '#FFC93C', o: '#F0A817', ic: `<circle cx="20" cy="20" r="10" fill="#FFC93C" stroke="${K}" stroke-width="3"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return `<path d="M${20 + Math.cos(a) * 13} ${20 + Math.sin(a) * 13}L${20 + Math.cos(a) * 18} ${20 + Math.sin(a) * 18}" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`; }).join('')}` },
    { n: 'azul', c: '#3D8DF2', o: '#1E6FD9', ic: `<path d="M8 20l-6-7v14z" fill="#3D8DF2" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="21" cy="20" rx="14" ry="10" fill="#3D8DF2" stroke="${K}" stroke-width="3"/><circle cx="28" cy="17" r="2.4" fill="${K}"/>` }];

  Object.assign(JUEGOS, {
    primero: {
      t: 'Primero y después', c: '#16698A', ic: svg('0 0 140 100', `<rect x="6" y="14" width="58" height="72" rx="10" fill="#fff" ${T}/><rect x="76" y="14" width="58" height="72" rx="10" fill="#fff" ${T}/><g transform="translate(8 22) scale(.45)">${MANOS.jabon.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><g transform="translate(78 22) scale(.45)">${PIC.comer.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><path d="M66 50h8" stroke="${K}" stroke-width="4" stroke-linecap="round"/>`), d: 'Anticipar: qué va primero y qué después.',
      puente: 'Haced un tablero de «primero y después» con dos pictogramas y usadlo de verdad en clase: primero recogemos, después patio.',
      L: { lavar: 'Lavarnos las manos', comer: 'Comer', recoger: 'Recoger', patio: 'Patio', abrigo: 'Abrigo', casa: 'A casa' },
      rondas: [
        { k: 'lavar', o: 'comer', q: 'Primero nos lavamos las manos y después comemos. ¿Qué hacemos primero?', ok: '¡Eso es! Primero, lavarnos las manos. Después, a comer.', f: 'Comer va después. Primero, lavarnos las manos.' },
        { k: 'recoger', o: 'patio', q: 'Primero recogemos los juguetes y después salimos al patio. ¿Qué hacemos primero?', ok: '¡Muy bien! Primero recogemos. Después, al patio.', f: 'El patio va después. Primero, recoger los juguetes.' },
        { k: 'abrigo', o: 'casa', q: 'Primero nos ponemos el abrigo y después nos vamos a casa. ¿Qué hacemos primero?', ok: '¡Sí! Primero el abrigo. Después, a casa.', f: 'A casa vamos después. Primero, el abrigo.' }
      ],
      ronda(R, a) {
        const Lb = JUEGOS.primero.L;
        a.z.innerHTML = `<div class="pd-tablero" aria-label="Tablero primero y después"><div class="pd-c"><span class="pd-t">Primero</span><span class="pd-hueco" data-pd="1"><b>?</b></span></div><span class="pd-flecha" aria-hidden="true">${ICONO.flecha}</span><div class="pd-c"><span class="pd-t">Después</span><span class="pd-hueco" data-pd="2"><b>?</b></span></div></div>`;
        a.elige([{ html: PIC[R.k], lbl: Lb[R.k], ok: true }, { html: PIC[R.o], lbl: Lb[R.o] }], R.ok, () => [R.f], 'ops-pd', () => {
          const h1 = a.z.querySelector('[data-pd="1"]'), h2 = a.z.querySelector('[data-pd="2"]');
          h1.innerHTML = PIC[R.k] + `<small>${Lb[R.k]}</small>`; h2.innerHTML = PIC[R.o] + `<small>${Lb[R.o]}</small>`;
          h1.classList.add('lleno'); setTimeout(() => h2.classList.add('lleno'), 350);
        });
        a.decir(R.q);
      }
    },

    quiero: {
      t: 'Quiero…', c: '#E8487F', ic: svg('0 0 140 100', `<g transform="translate(2 18) scale(.5)">${VEH.tren.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><g transform="translate(72 6) scale(.5)">${INS.tambor.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><g transform="translate(90 58) scale(.36)">${SINO.si.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`), d: 'Elegir y pedir. Aquí todas las respuestas valen.',
      puente: 'Durante el día, ofreced dos opciones reales (dos juguetes, dos canciones) y esperad a que elija tocando, señalando, mirando o diciendo «quiero».',
      rondas: [
        { tipo: 'veh', q: '¿Qué quieres: el tren o el coche? Elige uno.', oks: { tren: '«Quiero el tren». ¡Aquí tienes el tren! ¡Chu, chu!', coche: '«Quiero el coche». ¡Aquí tienes el coche! ¡Pi, pi!' } },
        { tipo: 'ins', q: '¿Qué quieres tocar: el tambor o las maracas?', oks: { tambor: '«Quiero el tambor». ¡Pom, pom, pom!', maracas: '«Quiero las maracas». ¡Chiqui, chiqui, chiqui!' } },
        { tipo: 'sino', q: '¿Quieres más música? Sí o no.', oks: { si: 'Sí: «quiero más». ¡Más música!', no: 'No: «no quiero más». Vale, paramos. Decir que no también está muy bien.' } }
      ],
      ronda(R, a) {
        const ops = R.tipo === 'veh' ? [{ k: 'tren', html: VEH.tren, lbl: 'Tren' }, { k: 'coche', html: VEH.coche, lbl: 'Coche' }]
          : R.tipo === 'ins' ? [{ k: 'tambor', html: INS.tambor, lbl: 'Tambor' }, { k: 'maracas', html: INS.maracas, lbl: 'Maracas' }]
          : [{ k: 'si', html: SINO.si, lbl: 'Sí' }, { k: 'no', html: SINO.no, lbl: 'No' }];
        a.elige(ops.map(o => ({ ...o, ok: true })), o => R.oks[o.k], () => [''], 'ops-quiero ' + (R.tipo === 'sino' ? 'ops-sino' : ''), (o, b) => {
          if (o.k === 'tren') { b.classList.add('arranca'); tono([196, 196, 262], 'square', .05, .22, .3); }
          if (o.k === 'coche') { b.classList.add('arranca'); tono([523, 523], 'square', .05, .2, .14); }
          if (o.k === 'tambor') tocaTambor(3);
          if (o.k === 'maracas') [0, .22, .44].forEach(t => ruido(t, .16, .5, 6500));
          if (o.k === 'si') cancion();
        }, { fijo: true });
        a.decir(R.q);
      }
    },

    calma: {
      t: 'La calma de Lolo', c: '#7C6BD6', ic: AYUDA.respirar, d: 'Cómo se siente Lolo y qué le ayuda a calmarse.',
      puente: 'Preparad un rincón de la calma con un cojín, un peluche y los pictogramas de «respirar», «abrazo» y «pedir ayuda». Practicad la respiración del globo cuando todos estén tranquilos.',
      E: { triste: 'Triste', enfadado: 'Enfadado', asustado: 'Asustado', contento: 'Contento' },
      A: { abrazo: 'Un abrazo', respirar: 'Respirar', contar: 'Contar hasta tres', ayuda: 'Pedir ayuda', oidos: 'Taparse los oídos', rincon: 'Rincón de la calma' },
      rondas: [
        { k: 'triste', o: 'contento', cara: 'triste', q: 'A Lolo se le ha caído el helado al suelo. ¿Cómo se siente Lolo?', ok: 'Sí, Lolo está triste. ¿Qué le puede ayudar?', f: 'Mirad su cara: tiene una lágrima. ¿Está triste o contento?', ay: ['abrazo', 'respirar'] },
        { k: 'enfadado', o: 'contento', cara: 'enfadado', q: 'Un amigo le ha quitado el tren a Lolo. ¿Cómo se siente?', ok: 'Sí, Lolo está enfadado. ¿Qué le puede ayudar?', f: 'Mirad sus cejas: están muy juntas. ¿Está enfadado o contento?', ay: ['contar', 'ayuda'] },
        { k: 'asustado', o: 'contento', cara: 'sorpresa', q: 'Hay un ruido muy fuerte. ¿Cómo se siente Lolo?', ok: 'Sí, Lolo está asustado. ¿Qué le puede ayudar?', f: 'Mirad sus ojos y su boca: está asustado. ¿Asustado o contento?', ay: ['oidos', 'rincon'] }
      ],
      hecho: {
        abrazo: 'Un abrazo grande. Lolo ya está mejor.',
        respirar: 'Respiramos con Lolo como un globo. Cogemos aire… y lo soltamos despacito.',
        contar: 'Contamos despacito con Lolo: uno… dos… tres. Ya está más tranquilo.',
        ayuda: 'Lolo pide ayuda a la maestra: «Me han quitado el tren». ¡Muy bien pedir ayuda!',
        oidos: 'Lolo se tapa los oídos y el ruido ya no molesta tanto.',
        rincon: 'Lolo va al rincón de la calma, se sienta en el cojín y descansa un poquito.'
      },
      listo: 'Ya estamos tranquilos',
      ronda(R, a) {
        a.sinMascota();
        const C = JUEGOS.calma;
        a.z.innerHTML = `<div class="emo-lolo">${lolo(R.cara)}</div>`;
        a.elige([{ html: CARA[R.k], lbl: C.E[R.k], ok: true }, { html: CARA[R.o], lbl: C.E[R.o] }], R.ok, () => [R.f], 'ops-caras', () => {
          setTimeout(() => {
            if (a.resuelta()) return;
            a.z.querySelector('.ops').remove();
            a.elige(R.ay.map(k => ({ k, html: AYUDA[k], lbl: C.A[k], ok: true })), o => C.hecho[o.k], () => [''], 'ops-ayuda', o => {
              const w = a.z.querySelector('.ops-ayuda'); w.remove();
              const emo = a.z.querySelector('.emo-lolo');
              if (o.k === 'respirar') { a.z.insertAdjacentHTML('beforeend', `<div class="respira" aria-hidden="true"><span class="globo-r"></span></div>`); }
              emo.innerHTML = lolo(o.k === 'respirar' || o.k === 'contar' ? 'feliz' : 'feliz');
              const f = document.createElement('div'); f.className = 'fila centro'; a.z.appendChild(f);
              a.boton(C.listo, () => { f.remove(); a.ok('', emo); }, f, 'pulso', ICONO.ok);
            }, { paso: true });
          }, 1800);
        }, { paso: true });
        a.decir(R.q);
      }
    },

    turnos: {
      t: 'Ahora tú, ahora yo', c: '#F27A2E', ic: svg('0 0 140 100', `<g transform="translate(14 30) scale(1.3)">${EQUIPO[0].ic}</g><g transform="translate(76 30) scale(1.3)">${EQUIPO[1].ic}</g>`), d: 'Esperar el turno entre dos: amarillo y azul.',
      puente: 'Jugad por parejas con un juguete real (un tambor, una torre de bloques): «ahora tú, ahora yo». Una tarjeta de «espera» ayuda a saber de quién es el turno.',
      toca: ['Le toca al amarillo.', 'Le toca al azul.'],
      espera: ['Espera un poquito. Ahora le toca al amarillo.', 'Espera un poquito. Ahora le toca al azul.'],
      rondas: [
        { k: 'tren', n: 6, q: 'Vamos a hacer un tren entre dos. Un vagón cada uno. Empieza el amarillo.', ok: '¡Qué tren tan largo! Lo habéis hecho por turnos. ¡Chu, chu!' },
        { k: 'torre', n: 6, q: 'Ahora, una torre. Un bloque cada uno. Empieza el amarillo.', ok: '¡Una torre muy alta! ¡Muy bien esperado!' },
        { k: 'musica', n: 8, q: 'Ahora hacemos música por turnos: el amarillo toca el tambor y el azul, la campana.', ok: '¡Qué canción tan bonita! Por turnos suena mejor.' }
      ],
      ronda(R, a) {
        const J = JUEGOS.turnos;
        a.z.innerHTML = `<div class="turnos t-${R.k}"><div class="t-pista" aria-label="Lo que vamos haciendo">${R.k === 'tren' ? `<span class="t-loco">${VEH.tren}</span>` : ''}</div><div class="jugadores">${EQUIPO.map((e, i) => `<button class="jug" type="button" data-j="${i}" style="--jc1:${e.c};--jc2:${e.o}" aria-label="Equipo ${e.n}"><svg viewBox="0 0 40 40" aria-hidden="true">${e.ic}</svg><span>${may(e.n)}</span><em class="espera-t">Espera</em></button>`).join('')}</div></div>`;
        const pista = a.z.querySelector('.t-pista'), bs = [...a.z.querySelectorAll('.jug')];
        let turno = 0, hechos = 0, avisado = 0;
        const marca = () => bs.forEach((b, i) => { b.classList.toggle('toca', i === turno); b.classList.toggle('espera', i !== turno); b.setAttribute('aria-pressed', String(i === turno)); });
        marca();
        bs.forEach((b, i) => b.addEventListener('click', () => {
          if (a.resuelta()) return;
          if (i !== turno) { if (Date.now() - avisado > 2500) { avisado = Date.now(); a.decir(J.espera[turno]); } sacude(b); return; }
          const e = EQUIPO[i];
          if (R.k === 'tren') { pista.insertAdjacentHTML('beforeend', `<span class="t-vagon" style="--vc:${e.c}"><svg viewBox="0 0 60 44" aria-hidden="true"><rect x="4" y="4" width="52" height="28" rx="5" fill="${e.c}" stroke="${K}" stroke-width="3"/><circle cx="16" cy="36" r="6" fill="#555F6E" stroke="${K}" stroke-width="3"/><circle cx="44" cy="36" r="6" fill="#555F6E" stroke="${K}" stroke-width="3"/></svg></span>`); tono([392 + hechos * 30], 'triangle', .08, .1, .2); }
          if (R.k === 'torre') { pista.insertAdjacentHTML('beforeend', `<span class="t-bloque" style="--vc:${e.c}"></span>`); tono([330 + hechos * 40], 'sine', .08, .1, .2); }
          if (R.k === 'musica') { pista.insertAdjacentHTML('beforeend', `<span class="t-nota" style="--vc:${e.c}">♪</span>`); if (i === 0) tocaTambor(1); else tono([1047 + hechos * 20, 1568], 'sine', .12, .02, .7); }
          hechos++;
          if (hechos >= R.n) { bs.forEach(x => x.classList.remove('toca', 'espera')); a.ok(R.ok, pista); return; }
          turno = 1 - turno; marca(); a.decir(J.toca[turno]);
        }));
        a.decir(R.q);
      }
    },

    numeros: {
      t: 'El tren de los números', c: '#2F80ED', ic: svg('0 0 140 100', `<g transform="translate(0 26) scale(.5)">${VEH.tren.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>${[1, 2].map(i => `<g transform="translate(${64 + (i - 1) * 38} 40)"><rect width="34" height="26" rx="5" fill="#FFC93C" stroke="${K}" stroke-width="3"/><text x="17" y="21" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="20" fill="${K}">${i}</text><circle cx="8" cy="30" r="5" fill="#555F6E"/><circle cx="26" cy="30" r="5" fill="#555F6E"/></g>`).join('')}`), d: 'Los números en orden, vagón a vagón.',
      puente: 'Haced un tren con cajas o sillas y poned un número en cada vagón. Los niños se sientan en orden: uno, dos, tres…',
      PAL: ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco'],
      ese: ['', 'Ese es el uno.', 'Ese es el dos.', 'Ese es el tres.', 'Ese es el cuatro.', 'Ese es el cinco.'],
      busca: ['', 'Buscamos el uno.', 'Buscamos el dos.', 'Buscamos el tres.', 'Buscamos el cuatro.', 'Buscamos el cinco.'],
      rondas: [
        { n: 3, q: 'El tren necesita sus vagones en orden. Tocad el uno, luego el dos y luego el tres.', ok: '¡Uno, dos, tres! ¡El tren está listo! ¡Chu, chu!' },
        { n: 4, q: 'Ahora hasta el cuatro. Empezamos por el uno.', ok: '¡Uno, dos, tres, cuatro! ¡Qué tren tan largo!' },
        { n: 5, q: '¡Hasta el cinco! Empezamos por el uno.', ok: '¡Uno, dos, tres, cuatro, cinco! ¡Lo habéis conseguido!' }
      ],
      ronda(R, a) {
        const J = JUEGOS.numeros, COLS = ['#FF5A5F', '#FFC93C', '#2BB673', '#3D8DF2', '#9B6BFF'];
        const nums = mezcla(Array.from({ length: R.n }, (_, i) => i + 1));
        a.z.innerHTML = `<div class="tren-n"><div class="tn-via"><span class="tn-loco">${VEH.tren}</span>${Array.from({ length: R.n }, (_, i) => `<span class="tn-hueco" data-p="${i + 1}"></span>`).join('')}</div><div class="tn-nums">${nums.map(n => `<button class="tn-num" type="button" data-n="${n}" style="--vc:${COLS[n - 1]}" aria-label="${J.PAL[n]}"><b>${n}</b><span class="pts">${'<i></i>'.repeat(n)}</span></button>`).join('')}</div></div>`;
        let sig = 1;
        a.z.querySelectorAll('.tn-num').forEach(b => b.addEventListener('click', () => {
          if (a.resuelta() || b.disabled) return;
          const n = +b.dataset.n;
          if (n === sig) {
            b.disabled = true; b.classList.add('puesto');
            const h = a.z.querySelector(`.tn-hueco[data-p="${n}"]`); h.innerHTML = `<b>${n}</b>`; h.style.setProperty('--vc', COLS[n - 1]); h.classList.add('lleno');
            hablar(J.PAL[n]); tono([392 + n * 50], 'triangle', .08, .1, .25);
            sig++;
            if (sig > R.n) { a.z.querySelector('.tn-via').classList.add('sale'); setTimeout(() => a.ok(R.ok, a.z.querySelector('.tn-via')), 400); }
          } else { sacude(b); a.fallo(`${J.ese[n]} ${J.busca[sig]}`, a.z.querySelector(`.tn-num[data-n="${sig}"]`), [J.ese[n], J.busca[sig]]); }
        }));
        a.decir(R.q);
      }
    },

    banda: {
      t: 'La banda de Lolo', c: '#D9483B', ic: INS.tambor, d: 'Escuchar a Lolo y tocar igual: primero Lolo, luego tú.',
      puente: 'Con un tambor de verdad (o una caja), haced turnos: el adulto da golpes y el niño repite. Después, que el niño invente y el adulto copie.',
      escucha: 'Escuchad a Lolo.',
      ahora: '¡Ahora vosotros! Tocad el tambor igual que Lolo.',
      demas: '¡Uy! Uno de más. Escuchad otra vez a Lolo.',
      rondas: [
        { n: 1, ok: '¡Un golpe, igual que Lolo! ¡Pom!' },
        { n: 2, ok: '¡Dos golpes, igual que Lolo! ¡Pom, pom!' },
        { n: 3, ok: '¡Tres golpes! ¡Sois una banda estupenda!' }
      ],
      ronda(R, a) {
        const J = JUEGOS.banda;
        a.z.innerHTML = `<div class="banda"><div class="banda-lolo"><span class="bl-t">Lolo</span><span class="tambor-l">${INS.tambor}</span><span class="golpes">${'<i></i>'.repeat(R.n)}</span></div><button class="tambor-n" type="button" aria-label="Vuestro tambor" disabled>${INS.tambor}<span>Vuestro tambor</span><span class="golpes">${'<i></i>'.repeat(R.n)}</span></button></div>`;
        const tl = a.z.querySelector('.tambor-l'), gl = [...a.z.querySelectorAll('.banda-lolo .golpes i')], tn = a.z.querySelector('.tambor-n'), gn = [...tn.querySelectorAll('.golpes i')];
        let cuenta = 0, toca = 0;
        const suena = async () => {
          const yo = ++toca; tn.disabled = true; cuenta = 0; gn.forEach(i => i.classList.remove('on')); gl.forEach(i => i.classList.remove('on'));
          a.decir(J.escucha); await espera(1300);
          for (let i = 0; i < R.n; i++) { if (yo !== toca || !tl.isConnected) return; tocaTambor(1); gl[i].classList.add('on'); tl.classList.remove('golpe'); void tl.offsetWidth; tl.classList.add('golpe'); await espera(650); }
          if (yo !== toca) return;
          tn.disabled = false; tn.classList.add('turno'); a.decir(J.ahora);
        };
        tn.addEventListener('click', () => {
          if (a.resuelta() || tn.disabled) return;
          tocaTambor(1); tn.classList.remove('golpe'); void tn.offsetWidth; tn.classList.add('golpe');
          cuenta++;
          if (cuenta <= R.n) gn[cuenta - 1].classList.add('on');
          if (cuenta === R.n) { setTimeout(() => { if (cuenta === R.n && !a.resuelta()) { tn.classList.remove('turno'); tn.disabled = true; a.ok(R.ok, tn); } }, 900); }
          if (cuenta > R.n) { tn.classList.remove('turno'); a.decir(J.demas); setTimeout(suena, 1800); }
        });
        const f = document.createElement('div'); f.className = 'fila centro'; a.z.appendChild(f);
        a.boton('Escuchar otra vez', () => suena(), f, 'sec', ICONO.oreja);
        suena();
      }
    }
  });

  const SECCIONES = [
    { t: 'Comunicar, esperar y estar tranquilos', d: 'Pensados para alumnado con autismo y buenos para toda la clase. En «Quiero…» no hay respuestas malas.', nuevo: true, ids: ['primero', 'quiero', 'calma', 'turnos'] },
    { t: 'Aprender jugando', d: 'Colores, números, tamaños, el cuerpo, los animales y la música.', ids: ['burbujas', 'cara', 'animales', 'emociones', 'manos', 'colores', 'cuenta', 'tamanos', 'numeros', 'banda'] }
  ];
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
        acierto(); celebrar(el || zona); cara('feliz'); anima('salta'); if (msg) decir(msg); pintaAgenda();
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
      elige(ops, okMsg, fallo, cl = '', alAcertar, opc = {}) {
        const lista = opc.fijo ? ops : mezcla(ops);
        let elegido = false;
        const w = document.createElement('div'); w.className = 'ops ' + cl;
        w.innerHTML = lista.map((o, i) => `<button class="op" type="button" data-i="${i}"${o.ok ? ' data-ok="1"' : ''} aria-label="${o.lbl}"${o.color ? ` style="--oc:${o.color}"` : ''}><span class="op-dib">${o.html}</span>${o.oculto ? '' : `<span class="op-lbl">${o.color ? '<i></i>' : ''}${o.lbl}</span>`}</button>`).join('');
        zona.appendChild(w);
        const bs = [...w.querySelectorAll('.op')], buena = bs[lista.findIndex(o => o.ok)];
        bs.forEach((b, i) => b.addEventListener('click', () => {
          if (s.resuelta || elegido) return; const o = lista[i];
          if (o.ok) {
            elegido = true; const msg = typeof okMsg === 'function' ? okMsg(o) : okMsg;
            b.classList.add('bien'); bs.forEach(x => x !== b && x.classList.add('apagada'));
            if (alAcertar) alAcertar(o, b);
            if (opc.paso) { s.fallos = 0; acierto(); celebrar(b); cara('feliz'); decir(msg); } else a.ok(msg, b);
          }
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
  let nTile = 0;
  $('#menuSecs').innerHTML = SECCIONES.map(S => `<section class="menu-sec"><div class="sec-cab"><h2>${S.t}${S.nuevo ? ' <span class="sec-nuevo">Nuevo</span>' : ''}</h2><p>${S.d}</p></div><div class="menu-grid">${S.ids.map(id => { const J = JUEGOS[id]; return `<a class="tile" href="#${id}" data-id="${id}" style="--c:${J.c};--i:${nTile++}"><span class="tile-dib">${J.ic}</span><span class="tile-t"><b>${J.t}</b><small>${J.d}</small></span></a>`; }).join('')}</div></section>`).join('');
  $('#menuSecs').addEventListener('click', e => { const t = e.target.closest('.tile'); if (!t) return; e.preventDefault(); abrir(t.dataset.id); });
  addEventListener('hashchange', () => { const id = location.hash.slice(1); if (JUEGOS[id]) { if (!est || est.id !== id) abrir(id); } else if (est) irMenu(); });

  /* ---------- herramientas ---------- */
  function aplicaCalma() { document.documentElement.classList.toggle('calma', calma); $('#btnCalma').setAttribute('aria-pressed', String(calma)); }
  function aplicaVoz() { $('#btnVoz').setAttribute('aria-pressed', String(voz)); $('#btnVoz span').textContent = voz ? 'Voz' : 'Sin voz'; }
  $('#btnCalma').addEventListener('click', () => { calma = !calma; guarda('raiz-calma', calma ? '1' : '0'); aplicaCalma(); });
  $('#btnVoz').addEventListener('click', () => { voz = !voz; guarda('raiz-tres-voz', voz ? '1' : '0'); if (!voz) callar(); aplicaVoz(); });
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
    const f = new Set(), add = v => { if (typeof v === 'string' && v.trim()) f.add(v); };
    add(FR.menu); add(FR.fin);
    Object.values(JUEGOS).forEach(J => {
      J.rondas.forEach(R => { ['q', 'ok', 'f'].forEach(k => add(R[k])); if (R.oks) Object.values(R.oks).forEach(add); });
      ['aviso', 'otraVez', 'escucha', 'ahora', 'demas'].forEach(k => add(J[k]));
      [J.nombre, J.hay, J.hecho].forEach(o => o && Object.values(o).forEach(add));
      if (J.A && J.A.vaca) Object.values(J.A).forEach(v => { add(v.q); add(v.ok); add(v.es); });
      [J.toca, J.espera, J.ese, J.busca].forEach(l => l && l.forEach(add));
    });
    return [...f];
  };


  const id0 = location.hash.slice(1);
  if (JUEGOS[id0]) abrir(id0); else irMenu();
})();
