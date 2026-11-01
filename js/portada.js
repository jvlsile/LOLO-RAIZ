/* Portada de La visita de Lolo: elegir y lanzar juegos. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lee = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
  const guarda = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  let calma = lee('lolo-calma', '0') === '1';
  const quieto = () => reduce || calma;

  /* ---------- iconos (trazo, 24×24) ---------- */
  const IC = {
    lolo: '<circle cx="12" cy="10" r="6"/><path d="M8 15l-2 5M11 16l-1 5M13 16l1 5M16 15l2 5"/><circle cx="10" cy="9.5" r=".8" fill="currentColor"/><circle cx="14" cy="9.5" r=".8" fill="currentColor"/>',
    caja: '<rect x="3.5" y="10" width="17" height="11" rx="2"/><path d="M2.5 7h19v3h-19zM12 7v14M12 7c-2-4-6-3.5-5 0M12 7c2-4 6-3.5 5 0"/>',
    cuenta: '<rect x="3" y="4" width="18" height="16" rx="4"/><path d="M7.5 10.5l1.5-1.2V15M11.5 10q1-1.2 2.2-.6t.3 2.2L11.5 15h3M17 9.6q1.6-.6 2 .6t-1 1.6q1.6.2 1.2 1.8t-2.2.6"/>',
    series: '<circle cx="5" cy="12" r="3"/><rect x="9.5" y="9" width="5" height="6" rx="1"/><circle cx="19" cy="12" r="3"/>',
    cestas: '<path d="M3 10h18l-2 10H5z"/><path d="M8 10l3-6M16 10l-3-6M7 14.5h10"/>',
    tamanos: '<circle cx="4.5" cy="17.5" r="2"/><circle cx="10.5" cy="15.5" r="4"/><circle cx="18" cy="13" r="5.5"/>',
    parejas: '<rect x="2.5" y="5" width="9" height="14" rx="2"/><rect x="12.5" y="5" width="9" height="14" rx="2"/><circle cx="7" cy="12" r="2"/><circle cx="17" cy="12" r="2"/>',
    formas: '<circle cx="7" cy="7.5" r="3.5"/><path d="M17 3.5l4 7h-8z"/><rect x="3.5" y="14" width="7" height="7" rx="1"/><path d="M17 13.5l1.3 2.6 2.8.4-2 2 .5 2.8-2.6-1.4-2.6 1.4.5-2.8-2-2 2.8-.4z"/>',
    cuento: '<path d="M3 5h6a3 3 0 0 1 3 2 3 3 0 0 1 3-2h6v14h-6a2 2 0 0 0-3 1 2 2 0 0 0-3-1H3z"/><path d="M12 7v13"/>',
    robot: '<rect x="5" y="8" width="14" height="11" rx="4"/><circle cx="9.5" cy="13" r="1.3" fill="currentColor"/><circle cx="14.5" cy="13" r="1.3" fill="currentColor"/><path d="M12 8V4.8"/><circle cx="12" cy="3.6" r="1.3"/>',
    construye: '<rect x="5" y="15" width="14" height="6" rx="1"/><rect x="7" y="9" width="10" height="6" rx="1"/><rect x="9.5" y="3" width="5" height="6" rx="1"/>',
    jardin: '<path d="M12 21v-8"/><path d="M12 15c-4 0-6-3-6-6 4 0 6 3 6 6zM12 13c0-4 3-6 6-6 0 4-3 6-6 6z"/><path d="M4 21h16"/>',
    quepasa: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/>',
    duo: '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2.5 20c0-3 2.5-6 5.5-6 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5.5 3 5.5 6"/>',
    escape: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.4" fill="currentColor"/>',
    emociones: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5q3.5 3 7 0"/><path d="M8 9.5h2M14 9.5h2"/>',
    muevete: '<circle cx="13" cy="4" r="2"/><path d="M8 9l4-2 3 3 3 1M12 7l-1 6 4 3v5M11 13l-4 3-3-1"/>',
    caza: '<path d="M4 20L14 10"/><path d="M15 9l1.4-4 1 3.6 3.6 1-3.6 1-1 3.6-1-3.6z"/><circle cx="7" cy="6" r="1"/><circle cx="19" cy="17" r="1"/>',
    todo: '<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;

  /* ---------- catálogo ---------- */
  const CATS = {
    rutinas: { t: 'Rutinas y asamblea', c: 'var(--c-rutinas)' },
    lenguaje: { t: 'Lenguaje y emociones', c: 'var(--c-lenguaje)' },
    logica: { t: 'Lógica y matemáticas', c: 'var(--c-logica)' },
    retos: { t: 'Retos y cooperación', c: 'var(--c-retos)' },
    ciencia: { t: 'Ciencia y manipulación', c: 'var(--c-ciencia)' }
  };
  const JUEGOS = [
    { id: 'lolo', t: 'La visita de Lolo', cat: 'rutinas', e: [3, 4], obj: ['lenguaje', 'emociones', 'moverse', 'numeros'], d: 'Asamblea con Lolo: una rutina distinta para cada día de la semana.' },
    { id: 'jardin', t: 'El jardín de la clase', cat: 'rutinas', e: [3, 4, 5], obj: ['emociones'], d: 'Un jardín de toda la clase que crece con cada logro del grupo.' },
    { id: 'muevete', t: 'Muévete y responde', cat: 'rutinas', e: [3, 4, 5], obj: ['moverse', 'numeros'], d: 'Saltar números, imitar animales, señales de colores y estatuas.' },
    { id: 'caja', t: 'La caja misteriosa', cat: 'lenguaje', e: [3, 4, 5], obj: ['lenguaje', 'pensar'], d: 'Una imagen escondida y la rutina Veo, Pienso, Me pregunto.' },
    { id: 'cuento', t: 'El cuento que decidimos', cat: 'lenguaje', e: [3, 4, 5], obj: ['lenguaje', 'emociones'], d: 'Un cuento con tres decisiones que vota toda la clase.' },
    { id: 'emociones', t: 'Las emociones de Lolo', cat: 'lenguaje', e: [3, 4, 5], obj: ['emociones'], d: 'Reconocer cómo se sienten los personajes y pensar cómo ayudarles.' },
    { id: 'cuenta', t: 'Cuenta y toca', cat: 'logica', e: [3, 4], obj: ['numeros'], d: 'Contar objetos del 1 al 5 y elegir el número.' },
    { id: 'series', t: 'Series y patrones', cat: 'logica', e: [4, 5], obj: ['formas', 'pensar'], d: 'Completar series de colores, formas y tamaños.' },
    { id: 'cestas', t: 'Clasifica en cestas', cat: 'logica', e: [3, 4], obj: ['formas'], d: 'Clasificar juguetes por color, forma o tamaño.' },
    { id: 'tamanos', t: 'Grande, mediano, pequeño', cat: 'logica', e: [3, 4], obj: ['formas'], d: 'Ordenar de pequeño a grande.' },
    { id: 'parejas', t: 'Encuentra la pareja', cat: 'logica', e: [3, 4, 5], obj: ['numeros', 'formas'], d: 'Memory de colores, animales y números.' },
    { id: 'formas', t: 'Formas geométricas', cat: 'logica', e: [3, 4, 5], obj: ['formas'], d: 'Encajar cada forma en su silueta.' },
    { id: 'duo', t: 'Juego a dúo', cat: 'retos', e: [4, 5], obj: ['emociones', 'formas'], d: 'Dos niños, cada uno con su mitad de la pantalla: solo ganan juntos.' },
    { id: 'escape', t: 'Mini-escape de colores', cat: 'retos', e: [4, 5], obj: ['pensar', 'formas'], d: 'Tres candados de colores, formas y sonidos para rescatar a Paco.' },
    { id: 'robot', t: 'El robot perdido', cat: 'retos', e: [4, 5], obj: ['pensar'], d: 'Programar con flechas el camino de un robot, en pantalla y en el suelo.' },
    { id: 'quepasa', t: '¿Qué pasa si…?', cat: 'ciencia', e: [4, 5], obj: ['ciencia'], d: 'Predecir, probar y registrar: flotar y hundirse, mezclar colores.' },
    { id: 'construye', t: 'Toca, construye y comprueba', cat: 'ciencia', e: [3, 4, 5], obj: ['ciencia', 'numeros'], d: 'Copiar torres con bloques de verdad y comprobarlas en la pizarra.' },
    { id: 'caza', t: 'Caza mágica', cat: 'ciencia', e: [3, 4, 5], obj: ['ciencia', 'lenguaje'], d: 'Animales y planetas que aparecen por arte de magia y se esconden.' }
  ];
  const porId = Object.fromEntries(JUEGOS.map(j => [j.id, j]));
  const OBJETIVOS = [
    { k: 'todo', t: 'Todo', ic: 'todo', c: 'var(--tinta)', frase: '¿Qué trabajamos hoy?' },
    { k: 'numeros', t: 'Contar', ic: 'cuenta', c: 'var(--c-logica)', frase: '¡A contar! Uno, dos, tres…' },
    { k: 'formas', t: 'Formas y colores', ic: 'formas', c: '#E0870A', frase: 'Formas, colores y tamaños' },
    { k: 'lenguaje', t: 'Hablar y escuchar', ic: 'cuento', c: 'var(--c-lenguaje)', frase: '¡Hablamos y escuchamos!' },
    { k: 'emociones', t: 'Emociones', ic: 'emociones', c: 'var(--c-retos)', frase: '¿Cómo nos sentimos?' },
    { k: 'moverse', t: 'Movernos', ic: 'muevete', c: '#E8641F', frase: '¡A movernos!' },
    { k: 'pensar', t: 'Pensar y resolver', ic: 'robot', c: '#1F8FA3', frase: 'Pensamos y resolvemos' },
    { k: 'ciencia', t: 'Experimentar', ic: 'quepasa', c: 'var(--c-ciencia)', frase: '¿Qué pasará si…?' }
  ];
  const EDADES = [[0, 'Todas'], [3, '3 años'], [4, '4 años'], [5, '5 años']];
  const DIAS = [
    null,
    { n: 'Lunes', c: '#FFC93C', r: 'El tiempo y los colores' },
    { n: 'Martes', c: '#FF8FB1', r: 'Contar y grande o pequeño' },
    { n: 'Miércoles', c: '#7FD9A4', r: 'Mi cuerpo y lavarse las manos' },
    { n: 'Jueves', c: '#C3A6FF', r: 'Los animales y los instrumentos' },
    { n: 'Viernes', c: '#8FDDE8', r: 'Ayudar y lo que más nos gustó' }
  ];

  let objetivo = 'todo';
  let edad = +lee('lolo-edad', '0') || 0;
  const edadTxt = e => e.length === 1 ? `${e[0]} años` : `${e[0]}–${e[e.length - 1]} años`;
  const ojoBuey = id => `<span class="ojo-buey"><span class="cristal">${svg(id)}<i></i><i></i><i></i></span></span>`;

  /* ---------- pintar ---------- */
  function pintaChips() {
    $('#chips').innerHTML = OBJETIVOS.map(o => `<button class="chip" type="button" data-k="${o.k}" style="--c:${o.c}" aria-pressed="${o.k === objetivo}"><span class="ci">${svg(o.ic)}</span>${o.t}</button>`).join('');
    $('#edades').innerHTML = EDADES.map(([v, t]) => `<button type="button" data-e="${v}" aria-pressed="${v === edad}">${t}</button>`).join('');
  }
  function tarjeta(j, i) {
    const c = CATS[j.cat];
    return `<a class="juego" href="jugar.html#${j.id}" data-id="${j.id}" style="--c:${c.c};--i:${i}">${ojoBuey(j.id)}<h3>${j.t}</h3><p>${j.d}</p><span class="etiquetas"><span class="cat">${c.t}</span><span class="edad">${edadTxt(j.e)}</span></span></a>`;
  }
  function pintaJuegos() {
    const lista = JUEGOS.filter(j => (objetivo === 'todo' || j.obj.includes(objetivo)) && (!edad || j.e.includes(edad)));
    $('#rejilla').innerHTML = lista.map(tarjeta).join('');
    $('#vacio').hidden = lista.length > 0;
    const o = OBJETIVOS.find(x => x.k === objetivo);
    $('#tJuegos').textContent = objetivo === 'todo' ? 'Todos los juegos' : `Juegos para «${o.t.toLowerCase()}»`;
    $('#cuantos').textContent = lista.length === JUEGOS.length ? '18 juegos' : `${lista.length} de 18 juegos${edad ? ` · ${edad} años` : ''}`;
  }
  function pintaHoy() {
    const d = new Date().getDay(), dia = DIAS[d];
    let recientes = [];
    try { recientes = JSON.parse(lee('lolo-recientes', '[]')).filter(id => porId[id] && id !== 'lolo').slice(0, 3); } catch (e) {}
    const logros = +lee('lolo-jardin', '0') || 0;
    const dest = dia
      ? `<a class="destacada" href="jugar.html#lolo" data-id="lolo" style="--dia:${dia.c}"><span class="dia"><span><b>${dia.n.slice(0, 2)}</b>${dia.n}</span></span><span><strong>La visita de Lolo · ${dia.n.toLowerCase()}</strong><span class="txt">Rutina de hoy: ${dia.r}.</span></span></a>`
      : `<a class="destacada" href="jugar.html#lolo" data-id="lolo" style="--dia:#FFC93C"><span class="dia"><span><b>Lu</b>Lunes</span></span><span><strong>La visita de Lolo</strong><span class="txt">Hoy no hay clase: prepara la rutina del lunes.</span></span></a>`;
    const minis = recientes.map(id => { const j = porId[id]; return `<a class="mini" href="jugar.html#${id}" data-id="${id}" style="--c:${CATS[j.cat].c}">${ojoBuey(id)}<span><strong>${j.t}</strong><span class="txt">Jugado hace poco</span></span></a>`; });
    if (minis.length < 3) minis.push(`<a class="mini" href="jugar.html#jardin" data-id="jardin" style="--c:var(--c-rutinas)">${ojoBuey('jardin')}<span><strong>El jardín de la clase</strong><span class="txt">${logros ? `${logros} ${logros === 1 ? 'logro' : 'logros'} conseguidos entre todos` : 'Cada reto superado hace crecer el jardín'}</span></span></a>`);
    // Huecos libres: sugerencias de Lolo según la edad elegida (sin repetir lo que ya se ve).
    const vistos = new Set(['lolo', 'jardin', ...recientes]);
    const sug = JUEGOS.filter(j => !vistos.has(j.id) && (!edad || j.e.includes(edad)));
    const dia0 = Math.floor(Date.now() / 864e5);
    for (let i = 0; minis.length < 3 && sug.length; i++) { const j = sug.splice((dia0 + i * 7) % sug.length, 1)[0]; minis.push(`<a class="mini" href="jugar.html#${j.id}" data-id="${j.id}" style="--c:${CATS[j.cat].c}">${ojoBuey(j.id)}<span><strong>${j.t}</strong><span class="txt">Sugerencia de Lolo · ${edadTxt(j.e)}</span></span></a>`); }
    $('#hoy').innerHTML = dest + minis.join('');
  }

  /* ---------- Lolo ---------- */
  const lolo = $('#lolo');
  (function tentaculos() {
    const defs = [[62, 140, 30, 175, 44, 226], [88, 156, 70, 196, 78, 238], [112, 162, 108, 206, 104, 244], [136, 162, 140, 206, 150, 242], [158, 154, 178, 194, 174, 236]];
    const q = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
    $('#tentaculos').innerHTML = defs.map(([x0, y0, cx, cy, x1, y1]) => `<g class="tent"><path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" stroke="url(#gTent)" stroke-width="24" stroke-linecap="round" fill="none"/>${[.45, .7, .9].map((t, i) => `<circle cx="${q(x0, cx, x1, t).toFixed(1)}" cy="${q(y0, cy, y1, t).toFixed(1)}" r="${5 - i}" fill="#FFD7B0" stroke="#F0A070" stroke-width="1.5"/>`).join('')}</g>`).join('');
  })();
  // Lolo sigue con la mirada el dedo o el puntero (con algo de inercia).
  const pupilas = [...lolo.querySelectorAll('.pupila')];
  let objetivoMirada = { x: 0, y: 0 }, mirada = { x: 0, y: 0 }, mirando = false;
  function mira(ev) {
    if (quieto()) return;
    const r = lolo.getBoundingClientRect(), cx = r.left + r.width * .5, cy = r.top + r.height * .38;
    const dx = ev.clientX - cx, dy = ev.clientY - cy, d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 400);
    objetivoMirada = { x: dx / d * 6 * m, y: dy / d * 6 * m };
    if (!mirando) { mirando = true; requestAnimationFrame(paso); }
  }
  function paso() {
    mirada.x += (objetivoMirada.x - mirada.x) * .18; mirada.y += (objetivoMirada.y - mirada.y) * .18;
    pupilas.forEach(p => p.setAttribute('transform', `translate(${mirada.x.toFixed(2)} ${mirada.y.toFixed(2)})`));
    if (Math.abs(objetivoMirada.x - mirada.x) + Math.abs(objetivoMirada.y - mirada.y) > .05) requestAnimationFrame(paso); else mirando = false;
  }
  addEventListener('pointermove', mira, { passive: true });
  addEventListener('pointerdown', mira, { passive: true });
  function asiente() {
    if (quieto()) return;
    lolo.classList.remove('asiente'); void lolo.getBoundingClientRect(); lolo.classList.add('asiente');
    setTimeout(() => lolo.classList.remove('asiente'), 560);
  }
  function diFrase(t) {
    const f = $('#frase'); if (f.textContent === t) return;
    if (quieto()) { f.textContent = t; return; }
    f.classList.add('cambia'); setTimeout(() => { f.textContent = t; f.classList.remove('cambia'); }, 180);
  }

  /* ---------- burbujas del fondo ---------- */
  (function burbujas() {
    const c = $('#burbujas'), x = c.getContext('2d'); let w, h; const b = [];
    const tam = () => { w = c.width = innerWidth * devicePixelRatio; h = c.height = innerHeight * devicePixelRatio; };
    tam(); addEventListener('resize', tam);
    for (let i = 0; i < 26; i++) b.push({ x: Math.random(), y: Math.random(), r: 2 + Math.random() * 7, v: .0005 + Math.random() * .001, o: Math.random() * 6 });
    const dib = t => {
      if (!quieto() && !document.hidden) {
        x.clearRect(0, 0, w, h);
        b.forEach(p => {
          p.y -= p.v; if (p.y < -.05) { p.y = 1.05; p.x = Math.random(); }
          const px = (p.x + Math.sin(t / 1500 + p.o) * .008) * w, py = p.y * h, r = p.r * devicePixelRatio;
          x.beginPath(); x.arc(px, py, r, 0, 7); x.fillStyle = 'rgba(255,255,255,.16)'; x.fill();
          x.lineWidth = 1.2 * devicePixelRatio; x.strokeStyle = 'rgba(255,255,255,.5)'; x.stroke();
        });
      }
      requestAnimationFrame(dib);
    };
    requestAnimationFrame(dib);
  })();

  /* ---------- la inmersión: lanzar un juego ---------- */
  let lanzando = false;
  function lanza(a, ev) {
    if (lanzando) return; lanzando = true;
    const url = a.getAttribute('href');
    if (quieto()) { location.href = url; return; }
    const r = a.getBoundingClientRect(), x = ev && ev.clientX ? ev.clientX : r.left + r.width / 2, y = ev && ev.clientY ? ev.clientY : r.top + r.height / 2;
    a.classList.add('hunde');
    // Lolo se lanza tras la tarjeta: toma impulso y nada hacia el punto tocado.
    const lr = lolo.getBoundingClientRect(), lx = lr.left + lr.width / 2, ly = lr.top + lr.height / 2;
    lolo.animate([
      { transform: 'none' },
      { transform: 'translateY(-18px) rotate(-6deg)', offset: .3 },
      { transform: `translate(${(x - lx) * .85}px, ${(y - ly) * .85}px) rotate(12deg) scale(.45)`, opacity: .2 }
    ], { duration: 620, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' });
    for (let i = 0; i < 14; i++) {
      const s = 8 + Math.random() * 22, bub = document.createElement('span');
      bub.className = 'burbuja'; bub.style.cssText = `left:${x - s / 2 + (Math.random() - .5) * r.width * .6}px;top:${y - s / 2}px;width:${s}px;height:${s}px`;
      document.body.appendChild(bub);
      bub.animate([{ transform: 'translateY(0) scale(.6)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: `translateY(${-160 - Math.random() * 260}px) translateX(${(Math.random() - .5) * 60}px) scale(1)`, opacity: 0 }],
        { duration: 700 + Math.random() * 400, delay: Math.random() * 120, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'forwards' });
    }
    const capa = $('#inmersion');
    capa.style.setProperty('--x', x + 'px'); capa.style.setProperty('--y', y + 'px');
    $('.lolo-escena').classList.add('lanza');
    setTimeout(() => capa.classList.add('activa'), 140);
    setTimeout(() => { location.href = url; }, 700);
  }
  // Al volver con el botón «atrás», la página puede restaurarse desde la caché: deshacemos la inmersión.
  addEventListener('pageshow', () => { lanzando = false; lolo.getAnimations().forEach(an => an.cancel()); $('.lolo-escena').classList.remove('lanza'); $('#inmersion').classList.remove('activa'); document.querySelectorAll('.hunde').forEach(e => e.classList.remove('hunde')); document.querySelectorAll('.burbuja').forEach(e => e.remove()); pintaHoy(); });

  document.addEventListener('click', ev => {
    const a = ev.target.closest('a[data-id]');
    if (a && !ev.metaKey && !ev.ctrlKey && !ev.shiftKey && ev.button === 0) { ev.preventDefault(); lanza(a, ev); return; }
    const chip = ev.target.closest('.chip');
    if (chip) { objetivo = chip.dataset.k; pintaChips(); pintaJuegos(); diFrase(OBJETIVOS.find(o => o.k === objetivo).frase); asiente(); return; }
    const e = ev.target.closest('#edades button');
    if (e) { edad = +e.dataset.e; guarda('lolo-edad', String(edad)); pintaChips(); pintaJuegos(); pintaHoy(); asiente(); return; }
    if (ev.target.closest('#limpiar')) { objetivo = 'todo'; edad = 0; guarda('lolo-edad', '0'); pintaChips(); pintaJuegos(); diFrase(OBJETIVOS[0].frase); }
  });

  /* ---------- acciones ---------- */
  function aplicaCalma() { html.classList.toggle('calma', calma); $('#btnCalma').setAttribute('aria-pressed', String(calma)); }
  $('#btnCalma').addEventListener('click', () => { calma = !calma; guarda('lolo-calma', calma ? '1' : '0'); aplicaCalma(); });
  const btnP = $('#btnPantalla');
  if (!document.fullscreenEnabled) btnP.hidden = true;
  btnP.addEventListener('click', () => { (document.fullscreenElement ? document.exitFullscreen() : html.requestFullscreen()).catch(() => {}); });
  document.addEventListener('fullscreenchange', () => { const t = document.fullscreenElement ? 'Salir de pantalla completa' : 'Pantalla completa'; btnP.querySelector('span').textContent = t; btnP.setAttribute('aria-label', t); });

  aplicaCalma(); pintaChips(); pintaJuegos(); pintaHoy();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
