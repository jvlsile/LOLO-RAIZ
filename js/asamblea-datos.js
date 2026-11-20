/* Datos de la asamblea: propuesta del día según la edad y el tema, y lo que la maestra cambia en Preparar. */
(function () {
  'use strict';
  const CLAVE = 'raiz-asamblea-dia', CLAVE_REG = 'raiz-asamblea-registro';
  const A = window.RAIZ_AGENDA;
  const TEMAS = {
    1: { n: 'El cuerpo', palabras: ['ca-be-za', 'ma-no', 'pie', 'o-jo', 'na-riz', 'bo-ca', 'o-re-ja', 'pier-na', 'bra-zo', 'de-do', 'ba-rri-ga', 'ro-di-lla'],
      retos: ['¿Para qué sirven las manos?', '¿Qué podemos hacer con los pies?', '¿Cómo sabemos que tenemos corazón?', '¿Con qué parte del cuerpo olemos?', '¿Por qué cerramos los ojos para dormir?'], rincones: ['Construcciones', 'Plastilina', 'Cuentos'] },
    2: { n: 'Los alimentos', palabras: ['pan', 'le-che', 'man-za-na', 'pla-ta-no', 'que-so', 'hue-vo', 'za-na-ho-ria', 'pe-ra', 'na-ran-ja', 'to-ma-te', 'sal', 'a-gua'],
      retos: ['¿De dónde viene la leche?', '¿Qué comemos en el desayuno?', '¿Qué fruta te gusta más y por qué?', '¿Qué alimentos crecen bajo la tierra?', '¿Por qué hay que lavarse las manos antes de comer?'], rincones: ['Cocinita', 'Plastilina', 'Cuentos'] },
    3: { n: 'La calle', palabras: ['ca-lle', 'co-che', 'bus', 'se-má-fo-ro', 'ca-sa', 'tien-da', 'a-ce-ra', 'bi-ci', 'pa-so', 'pla-za', 'ár-bol', 'ban-co'],
      retos: ['¿Cuándo cruzamos la calle?', '¿Qué hace el semáforo?', '¿Quién trabaja en la calle?', '¿Qué hay en nuestra calle?', '¿Por qué vamos de la mano al cruzar?'], rincones: ['Construcciones', 'Coches y circuitos', 'Cuentos'] }
  };
  const TRAZOS = ['El Tronco', 'La Rama Dormida', 'La Sonrisa de la Hoja', 'El Fruto', 'El Rayo entre las Ramas', 'El Gusanito de la Tierra', 'Las Ramas que se Cruzan', 'El Caracol de la Raíz'];
  const TRAZO_SIGNO = ['|', '—', '︶', 'o', 'ᴧ', '∿', '+', '@'];
  const VOCALES_5 = ['i', 'u', 'o', 'e', 'a'];
  const AMAX = { 3: 5, 4: 15, 5: 50 };
  const f2 = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const fecha = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const tema = d => { const m = d.getMonth() + 1; return m >= 9 ? 1 : m <= 3 ? 2 : m <= 6 ? 3 : 1; };
  const diaAno = d => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
  const edad = () => { try { const e = +localStorage.getItem('raiz-edad') || 0; return e >= 3 && e <= 5 ? e : 4; } catch (e) { return 4; } };
  const ponEdad = e => { try { localStorage.setItem('raiz-edad', String(e)); } catch (x) {} };
  const todo = () => A.leer(CLAVE, {});
  const quitaAcentos = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const esVocal = c => 'aeiou'.includes(quitaAcentos(c.toLowerCase()));

  /* Listas para los bloques nuevos. Cambian cada día con el número del día del año. */
  const PARTES = ['cabeza', 'ojos', 'nariz', 'boca', 'orejas', 'manos', 'pies', 'barriga', 'rodillas', 'hombros'];
  const PICTOS = ['moto', 'coche', 'casa', 'mano', 'pie', 'cabeza', 'ojo', 'boca', 'nariz', 'sol', 'flor', 'pan'];
  const SONIDOS = { m: ['mano', 'mesa', 'moto', 'mar'], p: ['pie', 'pan', 'pelota', 'perro'], c: ['casa', 'coche', 'cola', 'cuna'], s: ['sol', 'sapo', 'silla', 'sopa'], l: ['luna', 'lobo', 'libro', 'lupa'], t: ['tren', 'taza', 'tortuga', 'tela'], d: ['dado', 'dedo', 'dulce', 'dibujo'], n: ['nariz', 'nube', 'nido', 'nata'] };
  const SONIDO_LISTA = Object.keys(SONIDOS);

  /* Propuesta para una fecha y una edad. Se puede cambiar en Preparar. */
  function propuesta(d, ed) {
    const T = TEMAS[tema(d)], n = diaAno(d), dm = d.getDate();
    const idx5 = Math.floor(n / 7);
    const npic = ed - 1, nopc = ed - 1;
    const sonido = SONIDO_LISTA[n % SONIDO_LISTA.length];
    const buenos = SONIDOS[sonido];
    const otras = Object.values(SONIDOS).flat().filter(w => w[0] !== sonido[0]);
    const correcta = buenos[n % buenos.length];
    const opciones = [correcta];
    for (let i = 0; opciones.length < nopc; i++) { const w = otras[(n * 3 + i * 5) % otras.length]; if (!opciones.includes(w)) opciones.push(w); }
    const orden = [...opciones.slice(n % opciones.length), ...opciones.slice(0, n % opciones.length)];
    const retoOpciones = [];
    const nreto = ed === 3 ? 2 : 3;
    for (let i = 0; retoOpciones.length < nreto && i < T.retos.length; i++) retoOpciones.push(T.retos[(n + i) % T.retos.length]);
    return {
      palabra: T.palabras[n % T.palabras.length],
      numero: ((dm - 1) % AMAX[ed]) + 1,
      trazo: ed === 3 ? idx5 % 8 : ed === 4 ? n % 5 : n % 5,
      reto: T.retos[n % T.retos.length],
      retoOpciones,
      rincones: T.rincones.slice(),
      cuerpo: [PARTES[n % PARTES.length], PARTES[(n + 3) % PARTES.length]],
      pictos: [...Array(npic)].map((_, i) => PICTOS[(n + i * 2) % PICTOS.length]),
      veo: { sonido, opciones: orden }
    };
  }
  /* Lo del día: la propuesta con lo que la maestra haya cambiado encima. */
  function delDia(d, ed) {
    const p = propuesta(d, ed), c = todo()[f2(d)] || {};
    const r = { ...p };
    ['palabra', 'reto'].forEach(k => { if (typeof c[k] === 'string' && c[k].trim()) r[k] = c[k].trim(); });
    if (Number.isInteger(c.numero) && c.numero >= 0 && c.numero <= AMAX[ed]) r.numero = c.numero;
    if (Number.isInteger(c.trazo) && c.trazo >= 0) r.trazo = c.trazo;
    if (Array.isArray(c.rincones)) r.rincones = [0, 1, 2].map(i => (typeof c.rincones[i] === 'string' && c.rincones[i].trim()) || p.rincones[i] || '');
    return r;
  }
  function guardaDia(d, datos) { const t = todo(); t[f2(d)] = datos; return A.guarda(CLAVE, t); }
  /* Registro semanal: qué se trabajó cada día (se guarda al llegar a la despedida). */
  function registra(d, ed, r) {
    const reg = A.leer(CLAVE_REG, {}); reg[f2(d)] = { edad: ed, palabra: r.palabra.replace(/-/g, ''), numero: r.numero, trazo: ed === 3 ? TRAZOS[r.trazo % 8] : ed === 4 ? 'AEIOU'[r.trazo % 5] : VOCALES_5[r.trazo % 5] };
    const claves = Object.keys(reg).sort(); while (claves.length > 120) delete reg[claves.shift()];
    A.guarda(CLAVE_REG, reg);
  }
  window.RAIZ_ASAMBLEA = { TEMAS, PARTES, PICTOS, SONIDOS, diaAno, TRAZOS, TRAZO_SIGNO, VOCALES_5, AMAX, f2, fecha, tema, edad, ponEdad, propuesta, delDia, guardaDia, registra, esVocal, quitaAcentos };
})();
