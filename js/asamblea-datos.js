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

  /* Propuesta para una fecha y una edad. Se puede cambiar en Preparar. */
  function propuesta(d, ed) {
    const T = TEMAS[tema(d)], n = diaAno(d), dm = d.getDate();
    const idx5 = Math.floor(n / 7);
    return {
      palabra: T.palabras[n % T.palabras.length],
      numero: ((dm - 1) % AMAX[ed]) + 1,
      trazo: ed === 3 ? idx5 % 8 : ed === 4 ? n % 5 : n % 5,
      reto: T.retos[n % T.retos.length],
      rincones: T.rincones.slice()
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
  window.RAIZ_ASAMBLEA = { TEMAS, TRAZOS, TRAZO_SIGNO, VOCALES_5, AMAX, f2, fecha, tema, edad, ponEdad, propuesta, delDia, guardaDia, registra, esVocal, quitaAcentos };
})();
