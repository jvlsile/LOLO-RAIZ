/* Portada de La visita de Lolo: explorar, conocer y lanzar los juegos. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const html = document.documentElement;
  html.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lee = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
  const guarda = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  let calma = lee('raiz-calma', '0') === '1';
  const quieto = () => reduce || calma;

  /* ---------- iconos de trazo (24×24) ---------- */
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
    hoja: '<path d="M12 21v-6"/><path d="M12 3l1.8 3.6 3.7-1.2-1 3.8 3.5 1.6-3.3 2 1.2 3.4-3.7-.6L12 15l-2.2-.4-3.7.6 1.2-3.4-3.3-2 3.5-1.6-1-3.8 3.7 1.2z"/>',
    hojas: '<path d="M12 21v-6"/><path d="M12 3l1.8 3.6 3.7-1.2-1 3.8 3.5 1.6-3.3 2 1.2 3.4-3.7-.6L12 15l-2.2-.4-3.7.6 1.2-3.4-3.3-2 3.5-1.6-1-3.8 3.7 1.2z"/>',
    arbol: '<circle cx="12" cy="9" r="6"/><path d="M12 21v-7M12 16l-3-2.5M12 15.5l3-2.5M4 21h16"/>',
    ropa: '<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v6a2 2 0 0 1-4 0M12 3V2"/>',
    frutos: '<path d="M12 4c4 2.5 6.5 7 5 10.5-1 2.5-3 3.5-5 3.5s-4-1-5-3.5C5.5 11 8 6.5 12 4z"/><path d="M7 15.5c3 1.5 7 1.5 10 0"/>',
    bosque: '<ellipse cx="12" cy="16" rx="4.5" ry="3.8"/><circle cx="6" cy="10.5" r="1.9"/><circle cx="9.5" cy="6.5" r="1.9"/><circle cx="14.5" cy="6.5" r="1.9"/><circle cx="18" cy="10.5" r="1.9"/>',
    castanas: '<path d="M5 9h14l-7 12z"/><circle cx="9" cy="6.5" r="2.2"/><circle cx="14.5" cy="6" r="2.2"/>',
    viento: '<path d="M3 9h11a3 3 0 1 0-3-3"/><path d="M3 14h15a3 3 0 1 1-3 3"/><path d="M3 19h6"/>',
    tinta: '<path d="M11 12a1 1 0 1 1 2 0a3 3 0 1 1-6 0a5 5 0 1 1 10 0a7 7 0 1 1-14 0"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };
  const SEN = window.LOLO_SENTIDOS || null;
  if (SEN) Object.assign(IC, SEN.IC);
  const CU = window.LOLO_CUERPO || null;
  if (CU) Object.assign(IC, CU.IC);
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;
  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>';

  /* ---------- catálogo ---------- */
  const CATS = [
    { k: 'rutinas', t: 'Rutinas y asamblea', corto: 'Rutinas', c: 'var(--c-rutinas)', ic: 'lolo', d: 'Para empezar el día: saludo, emociones y movimiento.' },
    { k: 'lenguaje', t: 'Lenguaje y emociones', corto: 'Lenguaje', c: 'var(--c-lenguaje)', ic: 'cuento', d: 'Cuentos, preguntas y reconocer cómo nos sentimos.' },
    { k: 'logica', t: 'Lógica y matemáticas', corto: 'Lógica', c: 'var(--c-logica)', ic: 'formas', d: 'Contar, formas, series, tamaños y memoria.' },
    { k: 'retos', t: 'Retos y cooperación', corto: 'Retos', c: 'var(--c-retos)', ic: 'duo', d: 'Resolver juntos: candados, robots y parejas.' },
    { k: 'ciencia', t: 'Ciencia y manipulación', corto: 'Ciencia', c: 'var(--c-ciencia)', ic: 'quepasa', d: 'Predecir, experimentar y construir de verdad.' },
    { k: 'otono', t: 'El otoño', corto: 'Otoño', c: 'var(--c-otono)', ic: 'hoja', d: 'Hojas, frutos, animales, ropa y tiempo de esta estación.' },
    { k: 'trazos', t: 'Trazos', corto: 'Trazos', c: 'var(--c-trazos)', ic: 'tinta', d: 'Los ocho trazos de la grafomotricidad, con la tinta de Lolo.' },
    { k: 'sentidos', t: 'Los sentidos', corto: 'Sentidos', c: 'var(--c-sentidos)', ic: 'sentidos', d: 'Oír, ver, oler, saborear y tocar: seis juegos, fichas y un pasaporte de sellos para toda la clase.' },
    { k: 'cuerpo', t: 'El cuerpo', corto: 'Cuerpo', c: 'var(--c-cuerpo)', ic: 'cuerpo', d: 'Cabeza, barriga, brazos, manos, piernas y pies con Nico: seis juegos y fichas pensados para 3 años.', nuevo: true }
  ];
  const cat = Object.fromEntries(CATS.map(c => [c.k, c]));
  // Los ocho trazos del cuaderno, en miniatura, para la tarjeta de la categoría Trazos.
  const TRAZOS_MINI = ['<path d="M12 4v16"/>', '<path d="M4 12h16"/>', '<path d="M4 8q8 13 16 0"/>', '<circle cx="12" cy="12" r="7.5"/>',
    '<path d="M3 19L7.5 5 12 16l4.5-11L21 19"/>', '<path d="M2 12q2.5-7 5 0t5 0 5 0 5 0"/>', '<path d="M12 4v16M4 12h16"/>', IC.tinta];
  const JUEGOS = [
    { id: 'lolo', t: 'La visita de Lolo', cat: 'rutinas', e: [3, 4], d: 'La asamblea con Lolo, con una rutina distinta para cada día de la semana.',
      tr: ['Emociones y autorregulación', 'Colores, números, cuerpo y música según el día', 'Anticipación con agenda visual'], como: 'Lolo saluda, pregunta cómo estáis y propone dos retos y un juego de movimiento. Al final, una actividad sin pantalla.' },
    { id: 'jardin', t: 'El jardín de la clase', cat: 'rutinas', e: [3, 4, 5], d: 'Un jardín de toda la clase que crece con cada logro del grupo.',
      tr: ['Cooperación y sentido de grupo', 'Hábitos del aula', 'Refuerzo positivo sin puntos individuales'], como: 'Cada reto superado en cualquier juego hace crecer una flor. También podéis apuntar logros de clase, como recoger o ayudarse.' },
    { id: 'muevete', t: 'Muévete y responde', cat: 'rutinas', e: [3, 4, 5], d: 'Saltar números, imitar animales, señales de colores y estatuas.',
      tr: ['Coordinación y esquema corporal', 'Atención y control de impulsos', 'Conteo con el cuerpo'], como: 'Cinco retos de movimiento delante de la pizarra. La maestra marca el ritmo con «¡Lo hemos hecho!».' },
    { id: 'caja', t: 'La caja misteriosa', cat: 'lenguaje', e: [3, 4, 5], d: 'Una imagen escondida bajo seis ventanitas y la rutina Veo, Pienso, Me pregunto.',
      tr: ['Observación y vocabulario', 'Formular hipótesis', 'Hacer preguntas'], como: 'Un niño elige qué ventanita abrir y Lolo pregunta: ¿qué veis?, ¿qué pensáis?, ¿qué os preguntáis? Las ideas se apuntan en el muro.' },
    { id: 'cuento', t: 'El cuento que decidimos', cat: 'lenguaje', e: [3, 4, 5], d: 'Un cuento con tres decisiones que vota toda la clase.',
      tr: ['Comprensión oral', 'Tomar decisiones en grupo', 'Secuencia de una historia'], como: 'Lolo cuenta la historia y, en cada cruce, los niños salen a votar. El final cambia según lo que elijáis.' },
    { id: 'emociones', t: 'Las emociones de Lolo', cat: 'lenguaje', e: [3, 4, 5], d: 'Reconocer cómo se sienten los personajes y pensar cómo ayudarles.',
      tr: ['Alegría, tristeza, enfado, miedo y sorpresa', 'Empatía', 'Proponer soluciones'], como: 'En cada situación, la clase elige la emoción y después cómo ayudar. «Tenemos otra idea» acepta las propuestas de los niños.' },
    { id: 'cuenta', t: 'Cuenta y toca', cat: 'logica', e: [3, 4, 5], d: 'Contar objetos y elegir el número: hasta 5, 10 o 20 según el nivel.',
      tr: ['Conteo uno a uno', 'Asociar cantidad y cifra', 'Números hasta 5, 10 o 20'], como: 'Los niños tocan cada objeto para contarlo y Lolo dice el número en voz alta. Después eligen la cifra.' },
    { id: 'series', t: 'Series y patrones', cat: 'logica', e: [4, 5], d: 'Completar series de colores, formas y tamaños.',
      tr: ['Patrones AB, ABC y AAB', 'Atención visual', 'Anticipación lógica'], como: 'Lolo lee la fila en voz alta y la clase elige qué pieza va después. Cinco retos de dificultad creciente.' },
    { id: 'cestas', t: 'Clasifica en cestas', cat: 'logica', e: [3, 4], d: 'Clasificar juguetes por color, forma o tamaño.',
      tr: ['Clasificación por un criterio', 'Colores y formas básicas', 'Grande y pequeño'], como: 'Se arrastra cada juguete a su cesta, o se toca el juguete y luego la cesta.' },
    { id: 'tamanos', t: 'Grande, mediano, pequeño', cat: 'logica', e: [3, 4], d: 'Ordenar de pequeño a grande.',
      tr: ['Comparar tamaños', 'Seriación de tres elementos', 'Vocabulario de medida'], como: 'Tres objetos iguales de distinto tamaño se llevan a su sitio. En los últimos retos desaparece la silueta de ayuda.' },
    { id: 'parejas', t: 'Encuentra la pareja', cat: 'logica', e: [3, 4, 5], d: 'Memory de colores, animales y números.',
      tr: ['Memoria visual', 'Turnos y espera', 'Vocabulario'], como: 'Las cartas se ven unos segundos y se dan la vuelta. Lolo nombra cada carta que se levanta.' },
    { id: 'formas', t: 'Formas geométricas', cat: 'logica', e: [3, 4, 5], d: 'Encajar cada forma en su silueta.',
      tr: ['Círculo, cuadrado, triángulo y más', 'Discriminación visual', 'Motricidad fina'], como: 'Se arrastra cada forma a su silueta, o se toca la forma y luego la silueta.' },
    { id: 'duo', t: 'Juego a dúo', cat: 'retos', e: [4, 5], d: 'Dos niños, cada uno con su mitad de la pantalla: solo ganan juntos.',
      tr: ['Cooperación e interdependencia', 'Colores y formas', 'Escucha atenta'], como: 'Uno elige el color y el otro la forma de lo que pide Lolo. Solo se consigue si aciertan los dos.' },
    { id: 'escape', t: 'Mini-escape de colores', cat: 'retos', e: [4, 5], d: 'Tres candados para rescatar al cangrejo Paco, sin tiempo límite.',
      tr: ['Secuencias de colores', 'Formas y discriminación auditiva', 'Resolución de problemas'], como: 'Cada candado es un reto distinto: una secuencia de colores, una llave con forma y un sonido. Al abrirlos, Paco queda libre.' },
    { id: 'robot', t: 'El robot perdido', cat: 'retos', e: [4, 5], d: 'Programar con flechas el camino de un robot, en pantalla y en el suelo.',
      tr: ['Pensamiento computacional', 'Orientación espacial', 'Probar, equivocarse y corregir'], como: 'La clase hace el programa con flechas y pulsa «¡Adelante!». Si el robot se choca, se arregla el programa. Después se copia en el robot de suelo.' },
    { id: 'quepasa', t: '¿Qué pasa si…?', cat: 'ciencia', e: [4, 5], d: 'Predecir, probar y registrar: flotar y hundirse, mezclar colores.',
      tr: ['Hacer predicciones', 'Experimentar con materiales reales', 'Registrar resultados'], como: 'La clase vota qué cree que pasará, lo prueba de verdad y anota el resultado en la tabla de la pizarra.' },
    { id: 'construye', t: 'Toca, construye y comprueba', cat: 'ciencia', e: [3, 4, 5], d: 'Copiar torres con bloques de verdad y comprobarlas en la pizarra.',
      tr: ['Construcción con bloques', 'Colores y orden', 'Autocomprobación'], como: 'La pizarra muestra una torre, la clase la construye con bloques reales y después la comprueba bloque a bloque.' },
    { id: 'caza', t: 'Caza mágica', cat: 'ciencia', e: [3, 4, 5], d: 'Animales y planetas que aparecen por arte de magia y se esconden.',
      tr: ['Curiosidad y vocabulario', 'Datos sencillos del mundo', 'Atención y búsqueda'], como: 'Con «¡Abracadabra!» aparece un animal o un planeta que cuenta un dato y se esconde. La clase lo busca.' },
    { id: 'hojas', t: 'Las hojas del otoño', cat: 'otono', e: [3, 4, 5], d: 'El viento tira las hojas del árbol: hacemos montones por color y por tamaño.',
      tr: ['Colores del otoño: amarillo, naranja, rojo y marrón', 'Clasificar por un criterio', 'Grande y pequeño'], como: 'Las hojas caen y la clase las arrastra a su montón, o toca la hoja y luego el montón. Cinco retos con más colores cada vez.' },
    { id: 'arbol', t: 'El árbol y las estaciones', cat: 'otono', e: [3, 4, 5], d: 'Cómo cambia un árbol en otoño, invierno, primavera y verano.',
      tr: ['Cambios de la naturaleza en otoño', 'Las cuatro estaciones', 'Secuencia temporal: qué viene después'], como: 'Lolo describe cada estación y la clase elige el árbol que corresponde. El último reto pregunta qué estación llega después del verano.' },
    { id: 'ropa', t: '¿Qué nos ponemos?', cat: 'otono', e: [3, 4, 5], d: 'Elegir la ropa según el tiempo: lluvia, charcos, viento y frío.',
      tr: ['El tiempo atmosférico en otoño', 'Vocabulario de prendas', 'Autonomía y cuidado de uno mismo'], como: 'Aparece el tiempo que hace y la clase elige la prenda adecuada. Si eligen ropa de verano, Lolo explica por qué no sirve.' },
    { id: 'frutos', t: 'Adivina el fruto del otoño', cat: 'otono', e: [3, 4, 5], d: 'Adivinanzas de castañas, granadas, uvas, calabazas, setas y bellotas.',
      tr: ['Frutos típicos del otoño en Andalucía', 'Comprensión oral y adivinanzas', 'Cuidado: las setas no se tocan'], como: 'Lolo dice una adivinanza y la clase elige entre tres dibujos. Al acertar, cuenta algo del fruto.' },
    { id: 'bosque', t: 'Los animales en otoño', cat: 'otono', e: [4, 5], d: 'Qué hacen los animales cuando llega el frío: viajar, dormir o guardar comida.',
      tr: ['Migración, hibernación y almacenar comida', 'Golondrina, erizo, oso, ardilla y hormiga', 'Relacionar causa y efecto'], como: 'Aparece un animal y la clase elige qué hace en otoño entre tres opciones con dibujo. Lolo explica cada respuesta.' },
    { id: 'castanas', t: 'El puesto de castañas', cat: 'otono', e: [3, 4, 5], d: 'Lolo vende castañas asadas: hay que contar las que pide cada cliente.',
      tr: ['Contar del 1 al 5', 'Correspondencia uno a uno', 'Tradiciones de otoño: las castañas asadas'], como: 'Lolo enseña el número que pide el cliente. Los niños tocan castañas para meterlas en el cucurucho (o sacarlas) y pulsan «¡Ya está!».' },
    { id: 'viento', t: 'El viento de otoño', cat: 'otono', e: [3, 4, 5], d: 'Somos hojas: nos mecemos, giramos con el viento, caemos y respiramos.',
      tr: ['Expresión corporal', 'Atención y control del movimiento', 'Relajación y respiración'], como: 'Cinco momentos de movimiento delante de la pizarra. En uno, Lolo sopla viento fuerte, suave o nada, y la clase se mueve así.' },
    { id: 'tinta', t: 'La tinta de Lolo', cat: 'trazos', e: [3, 4, 5], d: 'Ocho trazos con el dedo, de la raya de pie a la espiral. Lolo los dibuja primero con su tinta.',
      tr: ['Grafomotricidad: vertical, horizontal, curva, círculo, zigzag, onda, cruz y espiral', 'Dirección del trazo: del punto verde a la estrella', 'Coordinación ojo-mano y gesto amplio'], como: 'Se elige uno de los ocho trazos. Primero Lolo lo dibuja y la clase lo repasa por un camino ancho; después se siguen los puntos, y al final solo hay inicio y final. Al acabar, el trazo cobra vida: crece un árbol, sale el gusanito, el caracol saca los cuernos. Hay fichas para imprimir de cada trazo, dos por hoja A4.' },
    { id: 'sentidos', t: '¿Con qué lo notas?', cat: 'sentidos', e: [3, 4, 5], d: 'Oler una flor, oír un tambor, ver el arcoíris: ¿con qué parte del cuerpo lo notamos?',
      tr: ['Los cinco sentidos y sus órganos', 'Vocabulario: vista, oído, olfato, gusto y tacto', 'Relacionar una experiencia con su sentido'], como: 'Aparece una situación y la clase elige el órgano del sentido: primero entre tres, al final entre los cinco. Lolo nombra cada sentido al acertar.' },
    { id: 'oido', t: '¿Qué suena?', cat: 'sentidos', e: [3, 4, 5], d: 'Escuchar y adivinar: tambor, campana, silbato, maracas, pájaro o lluvia.',
      tr: ['Discriminación auditiva', 'Fuerte y flojito', 'Contar sonidos'], como: 'El sonido solo suena al tocar «Escuchar», así se anticipa. Después se elige qué ha sonado, si sonaba fuerte o flojito y cuántas veces.' },
    { id: 'vista', t: 'La linterna de Lolo', cat: 'sentidos', e: [3, 4, 5], d: 'El fondo del mar está a oscuras: movemos la linterna y buscamos lo que pide Lolo.',
      tr: ['Atención y búsqueda visual', 'Vocabulario del mar', 'Coordinación ojo-mano'], como: 'Se mueve la luz con el dedo por el fondo del mar y se toca lo que pide Lolo. Cada reto esconde más cosas; en el último hay que encontrar dos iguales.' },
    { id: 'olfato', t: 'La nariz de Lolo', cat: 'sentidos', e: [3, 4, 5], d: 'Qué huele bien, qué huele mal y qué hacemos si huele a humo.',
      tr: ['Olores agradables y desagradables', 'Clasificar por un criterio', 'Seguridad: si huele a humo, avisamos'], como: 'Se lleva cada cosa a «huele bien» o «huele mal», arrastrando o tocando. El último reto es una norma de seguridad: ¿qué hacemos si huele a humo?' },
    { id: 'gusto', t: '¿A qué sabe?', cat: 'sentidos', e: [3, 4, 5], d: 'Dulce, salado y ácido: adivinamos el sabor y ponemos la mesa.',
      tr: ['Sabores dulce, salado y ácido', 'Clasificar alimentos', 'Hábitos saludables y cuidado con las alergias'], como: 'Lolo prueba una comida y la clase elige su sabor. En los últimos retos, cada comida se lleva a su plato.' },
    { id: 'tacto', t: 'La bolsa misteriosa', cat: 'sentidos', e: [4, 5], d: 'Lolo toca algo sin verlo y da pistas: ¿es blando, áspero, frío o pincha?',
      tr: ['Texturas: suave, áspero, duro, blando, frío', 'Comprensión oral e inferencia', 'Adivinar con pocas pistas'], como: 'Lolo da una pista de tacto y la clase elige entre tres cosas. Puede pedir otra pista (hasta tres): si aciertan con menos pistas, ganan más estrellas.' },
    { id: 'cuerpo', t: '¿Dónde está?', cat: 'cuerpo', e: [3, 4], d: 'Lolo nombra una parte del cuerpo y la clase la toca en Nico.',
      tr: ['Cabeza, barriga, brazos, manos, piernas y pies', 'Señalar y nombrar', 'Del dibujo al propio cuerpo'], como: 'Lolo dice una parte y un niño la toca en Nico. Al acertar, se ilumina y Lolo pide tocarla en el propio cuerpo.' },
    { id: 'monta', t: 'Monta a Nico', cat: 'cuerpo', e: [3, 4], d: 'Llevar cada pieza a su hueco hasta montar a Nico entero.',
      tr: ['La figura humana completa', 'Arriba, en el centro, a los lados y abajo', 'Motricidad fina: arrastrar o tocar'], como: 'Se lleva la cabeza, la barriga, los brazos y las piernas a su hueco sobre la silueta. Empieza con una pieza y termina con las seis.' },
    { id: 'falta', t: '¿Qué le falta?', cat: 'cuerpo', e: [3, 4], d: 'A Nico le falta algo: un brazo, los ojos, la boca… ¿Qué es?',
      tr: ['Atención y observación', 'Partes del cuerpo y de la cara', 'Vocabulario'], como: 'Nico aparece sin una parte y la clase la elige entre dos o tres dibujos. Si cuesta, se marca el hueco.' },
    { id: 'sirve', t: '¿Para qué sirve?', cat: 'cuerpo', e: [3, 4], d: '¿Con qué aplaudimos, saltamos, abrazamos o damos una patada?',
      tr: ['Funciones de las partes del cuerpo', 'Comprensión de preguntas', 'Movimiento después de cada respuesta'], como: 'Lolo hace una pregunta y la clase elige la parte del cuerpo. Después se prueba de verdad: aplaudir, saltar, abrazar.' },
    { id: 'viste', t: 'Vestimos a Nico', cat: 'cuerpo', e: [3, 4, 5], d: 'Hace frío: gorro, bufanda, guantes y botas, cada uno en su sitio.',
      tr: ['Prendas y partes del cuerpo', 'Autonomía al vestirse', 'El tiempo frío'], como: 'Se arrastra cada prenda a su sitio en Nico (o se toca la prenda y luego el sitio) y Nico se la pone.' },
    { id: 'toca', t: 'Toca, toca', cat: 'cuerpo', e: [3, 4, 5], d: 'De pie: tocamos la cabeza, los hombros, las rodillas y los pies.',
      tr: ['Esquema corporal', 'Escuchar y seguir una orden', 'Movimiento en grupo'], como: 'La parte se ilumina en Nico y la clase la toca en su cuerpo. La maestra pasa a la siguiente cuando todos están listos.' }
  ];
  const porId = Object.fromEntries(JUEGOS.map(j => [j.id, j]));
  const DIAS = [null, 'lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
  const edadTxt = e => e.length === 1 ? `${e[0]} años` : `${e[0]}–${e[e.length - 1]} años`;
  const sinTilde = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  let filtroCat = 'todas', edad = +lee('raiz-edad', '0') || 0, busca = '';

  /* ---------- pintar ---------- */
  function pintaCategorias() {
    $('#listaCat').innerHTML = CATS.map(c => {
      const n = JUEGOS.filter(j => j.cat === c.k).length;
      const tira = c.k === 'trazos' ? `<span class="cat-trazos" aria-hidden="true">${TRAZOS_MINI.map(d => `<svg viewBox="0 0 24 24">${d}</svg>`).join('')}</span>`
        : c.k === 'sentidos' && SEN ? `<span class="cat-sentidos" aria-hidden="true">${['ojo', 'oreja', 'nariz', 'boca', 'mano'].map(k => `<span>${SEN.dib(k)}</span>`).join('')}</span>`
        : c.k === 'cuerpo' && CU ? `<span class="cat-sentidos" aria-hidden="true">${['cabeza', 'tronco', 'brazo', 'pierna'].map(k => `<span>${CU.parte(k)}</span>`).join('')}<span>${CU.PIE}</span></span>` : '';
      return `<button class="cat revela${c.k === 'trazos' ? ' cat-ancha' : ''}${c.k === 'sentidos' || c.k === 'cuerpo' ? ' cat-ancha cat-sen' : ''}" type="button" data-cat="${c.k}" style="--c:${c.c}">${c.nuevo ? '<span class="cat-nuevo">Nuevo</span>' : ''}<span class="cat-ic">${svg(c.ic)}</span><h3>${c.t}</h3><p>${c.d}</p>${tira}<span class="cat-n">${n} ${n === 1 ? 'juego' : 'juegos'} ${svg('flecha')}</span></button>`;
    }).join('');
  }
  function pintaFiltros() {
    $('#pestanas').innerHTML = [{ k: 'todas', t: 'Todas', c: 'var(--tinta)' }, ...CATS].map(c => `<button class="pestana" type="button" data-cat="${c.k}" style="--c:${c.c}" aria-pressed="${c.k === filtroCat}" title="${c.t}"><i></i>${c.corto || c.t}</button>`).join('');
    $('#edades').innerHTML = [[0, 'Todas'], [3, '3'], [4, '4'], [5, '5']].map(([v, t]) => `<button type="button" data-e="${v}" aria-pressed="${v === edad}" aria-label="${v ? v + ' años' : 'Todas las edades'}">${t}</button>`).join('');
  }
  const tarjeta = j => {
    const c = cat[j.cat];
    return `<article class="tarjeta" data-id="${j.id}" style="--c:${c.c}" tabindex="0" aria-label="${j.t}. ${c.t}, ${edadTxt(j.e)}. Abrir ficha">
      <div class="tarjeta-media"><span class="tarjeta-ic">${svg(j.id)}</span><span class="tarjeta-edad">${edadTxt(j.e)}</span></div>
      <div class="tarjeta-cuerpo"><span class="tarjeta-cat">${c.t}</span><h3>${j.t}</h3><p>${j.d}</p>
        <div class="tarjeta-pie"><button class="tarjeta-mas" type="button" tabindex="-1">Ver ficha</button><a class="jugar" href="jugar.html#${j.id}" data-id="${j.id}">${PLAY}Jugar</a></div></div></article>`;
  };
  // Las tarjetas se crean una vez; filtrar las oculta y anima las que se recolocan (FLIP).
  function montaRejilla() { $('#rejilla').innerHTML = JUEGOS.map(tarjeta).join(''); }
  function visible(j) {
    if (filtroCat !== 'todas' && j.cat !== filtroCat) return false;
    if (edad && !j.e.includes(edad)) return false;
    if (busca) { const q = sinTilde(busca); if (!sinTilde(j.t + ' ' + j.d + ' ' + cat[j.cat].t).includes(q)) return false; }
    return true;
  }
  function filtra(animar = true) {
    const tarjetas = $$('.tarjeta');
    const antes = new Map(tarjetas.filter(t => !t.hidden).map(t => [t, t.getBoundingClientRect()]));
    let n = 0, i = 0;
    tarjetas.forEach(t => { const v = visible(porId[t.dataset.id]); t.hidden = !v; if (v) n++; });
    if (animar && !quieto()) {
      tarjetas.filter(t => !t.hidden).forEach(t => {
        const a = antes.get(t), b = t.getBoundingClientRect();
        if (a) {
          const dx = a.left - b.left, dy = a.top - b.top;
          if (dx || dy) t.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.23,1,.32,1)' });
        } else { t.classList.remove('entra'); void t.offsetWidth; t.style.setProperty('--i', i++); t.classList.add('entra'); }
      });
    }
    $('#vacio').hidden = n > 0;
    const partes = [];
    if (filtroCat !== 'todas') partes.push(cat[filtroCat].t);
    if (edad) partes.push(`${edad} años`);
    if (busca) partes.push(`«${busca}»`);
    $('#cuantos').textContent = n === JUEGOS.length ? `${n} juegos` : `${n} de ${JUEGOS.length} juegos${partes.length ? ' · ' + partes.join(' · ') : ''}`;
  }
  function pintaRecientes() {
    let r = [];
    try { r = JSON.parse(lee('raiz-recientes', '[]')).filter(id => porId[id]).slice(0, 4); } catch (e) {}
    $('#recientes').hidden = !r.length;
    $('#recientesFila').innerHTML = r.map(id => { const j = porId[id]; return `<a class="reciente" href="jugar.html#${id}" data-id="${id}" style="--c:${cat[j.cat].c}"><span>${svg(id)}</span>${j.t}</a>`; }).join('');
  }
  function pintaHoy() {
    const d = DIAS[new Date().getDay()];
    $('#ctaHoyT').textContent = d ? `Empezar la rutina del ${d}` : 'Preparar la rutina del lunes';
    $('#ctaHoyS').textContent = 'La visita de Lolo · 10 minutos';
  }

  /* ---------- Lolo y su órbita ---------- */
  const lolo = $('#lolo');
  (function tentaculos() {
    const defs = [[62, 140, 30, 175, 44, 226], [88, 156, 70, 196, 78, 238], [112, 162, 108, 206, 104, 244], [136, 162, 140, 206, 150, 242], [158, 154, 178, 194, 174, 236]];
    const q = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
    $('#tentaculos').innerHTML = defs.map(([x0, y0, cx, cy, x1, y1]) => `<g class="tent"><path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" stroke="url(#gTent)" stroke-width="24" stroke-linecap="round" fill="none"/>${[.45, .7, .9].map((t, i) => `<circle cx="${q(x0, cx, x1, t).toFixed(1)}" cy="${q(y0, cy, y1, t).toFixed(1)}" r="${5 - i}" fill="#FFD7B0" stroke="#F0A070" stroke-width="1.5"/>`).join('')}</g>`).join('');
  })();
  $('#orbita').innerHTML = CATS.map((c, i) => {
    const a = (i / CATS.length) * Math.PI * 2 - Math.PI / 2, x = 50 + Math.cos(a) * 46, y = 50 + Math.sin(a) * 46;
    return `<span class="orbe" style="--c:${c.c};left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;margin:0;transform:translate(-50%,-50%)"><span class="orbe-in">${svg(c.ic)}</span></span>`;
  }).join('');
  const pupilas = [...lolo.querySelectorAll('.pupila')];
  let meta = { x: 0, y: 0 }, mir = { x: 0, y: 0 }, mirando = false;
  function mira(ev) {
    if (quieto()) return;
    const r = lolo.getBoundingClientRect(); if (r.bottom < 0) return;
    const dx = ev.clientX - (r.left + r.width * .5), dy = ev.clientY - (r.top + r.height * .38), d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 420);
    meta = { x: dx / d * 6 * m, y: dy / d * 6 * m };
    if (!mirando) { mirando = true; requestAnimationFrame(paso); }
  }
  function paso() {
    mir.x += (meta.x - mir.x) * .16; mir.y += (meta.y - mir.y) * .16;
    pupilas.forEach(p => p.setAttribute('transform', `translate(${mir.x.toFixed(2)} ${mir.y.toFixed(2)})`));
    if (Math.abs(meta.x - mir.x) + Math.abs(meta.y - mir.y) > .05) requestAnimationFrame(paso); else mirando = false;
  }
  addEventListener('pointermove', mira, { passive: true });

  /* ---------- burbujas de la cabecera ---------- */
  (function burbujas() {
    const c = $('#burbujas'), x = c.getContext('2d'), hero = $('.hero'); let w, h, ver = true; const b = [];
    const tam = () => { const r = hero.getBoundingClientRect(); w = c.width = r.width * devicePixelRatio; h = c.height = r.height * devicePixelRatio; };
    tam(); addEventListener('resize', tam);
    try { new IntersectionObserver(([e]) => { ver = e.isIntersecting; }).observe(hero); } catch (e) {}
    for (let i = 0; i < 22; i++) b.push({ x: Math.random(), y: Math.random(), r: 2 + Math.random() * 6, v: .0006 + Math.random() * .0012, o: Math.random() * 6 });
    const dib = t => {
      if (ver && !quieto() && !document.hidden) {
        x.clearRect(0, 0, w, h);
        b.forEach(p => {
          p.y -= p.v; if (p.y < -.05) { p.y = 1.05; p.x = Math.random(); }
          const px = (p.x + Math.sin(t / 1600 + p.o) * .01) * w, py = p.y * h, r = p.r * devicePixelRatio;
          x.beginPath(); x.arc(px, py, r, 0, 7); x.fillStyle = 'rgba(255,255,255,.12)'; x.fill();
          x.lineWidth = 1.2 * devicePixelRatio; x.strokeStyle = 'rgba(255,255,255,.4)'; x.stroke();
        });
      }
      requestAnimationFrame(dib);
    };
    requestAnimationFrame(dib);
  })();

  /* ---------- navegación que se vuelve sólida y barra que se pega ---------- */
  const nav = $('#nav'), barra = $('#barra');
  const alDesplazar = () => {
    nav.classList.toggle('solida', scrollY > 40);
    const top = barra.getBoundingClientRect().top, navH = nav.getBoundingClientRect().height;
    barra.classList.toggle('pegada', top <= navH + 1);
  };
  addEventListener('scroll', alDesplazar, { passive: true }); alDesplazar();

  /* ---------- aparecer al desplazarse (contenido visible si no hay soporte) ---------- */
  function revelar() {
    const els = $$('.revela, .pasos li, .apoyos, .cab');
    if (quieto() || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('visible')); return; }
    els.forEach(e => e.classList.add('revela'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e, i) => { e.style.transitionDelay = (e.classList.contains('cat') || e.closest('.pasos')) ? `${(i % 5) * 60}ms` : '0ms'; io.observe(e); });
  }

  /* ---------- «Invítame a un café»: QR y enlace a PayPal ---------- */
  const cafe = $('#cafe');
  if (cafe && cafe.showModal) {
    $$('[data-cafe]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); cafe.showModal(); }));
    $('#cafeCerrar').addEventListener('click', () => cafe.close());
    cafe.addEventListener('click', ev => { if (ev.target === cafe) cafe.close(); });
    cafe.querySelector('.cafe-ir').addEventListener('click', () => setTimeout(() => cafe.close(), 300));
  }

  /* ---------- ficha del juego ---------- */
  const ficha = $('#ficha'), fondo = $('#fichaFondo');
  let ultimoFoco = null;
  function abreFicha(id, origen) {
    const j = porId[id], c = cat[j.cat];
    ultimoFoco = origen || document.activeElement;
    ficha.style.setProperty('--c', c.c); $('#fichaCab').style.setProperty('--c', c.c);
    $('#fichaIc').innerHTML = svg(id);
    $('#fichaMeta').innerHTML = `<span>${c.t}</span><span>${edadTxt(j.e)}</span>`;
    $('#fichaT').textContent = j.t;
    $('#fichaDesc').textContent = j.d;
    $('#fichaTrabaja').innerHTML = j.tr.map(x => `<li>${x}</li>`).join('');
    $('#fichaComo').textContent = j.como;
    const btn = $('#fichaJugar'); btn.href = `jugar.html#${id}`; btn.dataset.id = id;
    const imp = $('#fichaImprimir'); imp.hidden = !(id === 'tinta' || j.cat === 'sentidos' || j.cat === 'cuerpo'); imp.href = j.cat === 'sentidos' ? 'fichas-sentidos.html' : j.cat === 'cuerpo' ? 'fichas-cuerpo.html' : 'fichas.html';
    fondo.hidden = false; ficha.hidden = false;
    const cuerpo = ficha.querySelector('.ficha-cuerpo'); cuerpo.scrollTop = 0;
    cuerpo.querySelectorAll(':scope > *').forEach(e => { e.style.animation = 'none'; void e.offsetWidth; e.style.animation = ''; });
    requestAnimationFrame(() => { fondo.classList.add('abierta'); ficha.classList.add('abierta'); });
    document.body.style.overflow = 'hidden';
    setTimeout(() => btn.focus({ preventScroll: true }), quieto() ? 0 : 200);
  }
  function cierraFicha() {
    if (ficha.hidden) return;
    fondo.classList.remove('abierta'); ficha.classList.remove('abierta');
    document.body.style.overflow = '';
    setTimeout(() => { ficha.hidden = true; fondo.hidden = true; }, quieto() ? 0 : 300);
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
  }
  $('#fichaCerrar').addEventListener('click', cierraFicha);
  fondo.addEventListener('click', cierraFicha);
  addEventListener('keydown', e => {
    if (e.key === 'Escape') cierraFicha();
    if (e.key === 'Tab' && !ficha.hidden) {
      const f = [...ficha.querySelectorAll('button, a[href]')]; const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });

  /* ---------- lanzar: el origen se expande hasta llenar la pantalla ---------- */
  let lanzando = false;
  function lanza(el, id) {
    if (lanzando) return; lanzando = true;
    const url = `jugar.html#${id}`, j = porId[id];
    if (quieto()) { location.href = url; return; }
    const box = (el.closest('.tarjeta') || (ficha.contains(el) ? ficha : el)).getBoundingClientRect();
    const L = $('#lanzador');
    L.style.setProperty('--c', cat[j.cat].c);
    L.style.setProperty('--t', Math.max(0, box.top) + 'px'); L.style.setProperty('--l', Math.max(0, box.left) + 'px');
    L.style.setProperty('--r', Math.max(0, innerWidth - box.right) + 'px'); L.style.setProperty('--b', Math.max(0, innerHeight - box.bottom) + 'px');
    $('#lanzadorIc').innerHTML = svg(id); $('#lanzadorT').textContent = j.t;
    L.classList.remove('activo'); L.style.visibility = 'visible'; void L.offsetWidth; L.style.visibility = '';
    requestAnimationFrame(() => L.classList.add('activo'));
    setTimeout(() => { location.href = url; }, 820);
  }
  addEventListener('pageshow', () => { lanzando = false; $('#lanzador').classList.remove('activo'); cierraFicha(); pintaRecientes(); });


  /* ---------- Los sentidos: vídeo de cabecera, pasaporte y juegos ---------- */
  function pintaSentidos() {
    if (!SEN || !$('#senGrid')) return;
    const v = SEN.leeSellos(), n = v.length, T = SEN.SELLOS.length;
    const DIB = { sentidos: 'arcoiris', oido: 'oreja', vista: 'ojo', olfato: 'nariz', gusto: 'boca', tacto: 'mano' };
    $('#senPasaporte').innerHTML = `<div class="sen-pas-t"><b>Pasaporte de la clase</b><span>${n === T ? '¡Completo! Ya podéis imprimir el diploma.' : n ? `${n} de ${T} sellos` : 'Cada juego terminado pone un sello'}</span></div>
      <div class="sen-sellos">${SEN.SELLOS.map(s => `<span class="sen-sello${v.includes(s.id) ? ' si' : ''}" style="--sc:${s.c}" title="${s.s}${v.includes(s.id) ? ': conseguido' : ''}"><svg viewBox="0 0 24 24" aria-hidden="true">${SEN.IC[s.id]}</svg></span>`).join('')}</div>
      <span class="sr-only">${n} de ${T} sellos conseguidos.</span>`;
    $('#senGrid').innerHTML = SEN.SELLOS.map((s, i) => {
      const j = porId[s.id], ok = v.includes(s.id);
      return `<a class="sen-card" href="jugar.html#${s.id}" data-id="${s.id}" style="--sc:${s.c};--i:${i}">
        <span class="sen-card-dib">${SEN.dib(DIB[s.id])}</span>
        <span class="sen-card-tx"><small>${s.s} · ${edadTxt(j.e)}</small><b>${j.t}</b><span>${j.d}</span></span>
        <span class="sen-card-sello${ok ? ' si' : ''}" aria-label="${ok ? 'Sello conseguido' : 'Sin sello todavía'}"><svg viewBox="0 0 24 24" aria-hidden="true">${ok ? '<path d="M6 12.5l4 4 8-9"/>' : SEN.IC[s.id]}</svg></span></a>`;
    }).join('');
  }
  (function videoSentidos() {
    const vid = $('#senVideo'), cab = $('#senCab'), bP = $('#senPausa'), bS = $('#senSonido');
    if (!vid) return;
    let quiere = !quieto(), visible = false;
    const pinta = () => {
      const play = !vid.paused;
      cab.classList.toggle('en-pausa', !play);
      bP.setAttribute('aria-label', play ? 'Pausar el vídeo' : 'Ver el vídeo');
      bP.innerHTML = play ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 5h4v14h-4zM13.5 5h4v14h-4z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
      bS.setAttribute('aria-pressed', String(!vid.muted));
      bS.querySelector('span').textContent = vid.muted ? 'Activar sonido' : 'Quitar sonido';
    };
    const intenta = () => { if (quiere && visible) { const p = vid.play(); if (p && p.catch) p.catch(() => { quiere = false; pinta(); }); } else vid.pause(); };
    vid.muted = true; vid.volume = .6;
    ['play', 'pause', 'volumechange'].forEach(e => vid.addEventListener(e, pinta));
    bP.addEventListener('click', () => { quiere = vid.paused; if (quiere) { visible = true; intenta(); } else vid.pause(); });
    bS.addEventListener('click', () => { vid.muted = !vid.muted; if (!vid.muted) { quiere = true; visible = true; intenta(); } });
    // Solo se reproduce mientras se ve (ahorra batería en tabletas y móviles).
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; intenta(); }, { threshold: .35 }).observe(vid);
    else { visible = true; intenta(); }
    $('#btnCalma').addEventListener('click', () => { if (quieto()) { quiere = false; vid.pause(); } });
    pinta();
  })();
  pintaSentidos();
  addEventListener('pageshow', pintaSentidos);


  /* ---------- El cuerpo: cabecera con Nico, pasaporte y juegos ---------- */
  function pintaCuerpo() {
    if (!CU || !$('#cueGrid')) return;
    const v = CU.leeSellos(), n = v.length, T = CU.SELLOS.length;
    const DIB = { cuerpo: () => CU.parte('cabeza'), monta: () => `<svg viewBox="0 0 200 320" aria-hidden="true">${CU.nico({ piel: CU.PIELES[2], pelo: CU.PELOS[1], camiseta: CU.CAMISETAS[3] })}</svg>`, falta: () => CU.parte('brazo'), sirve: () => SEN ? SEN.dib('mano') : CU.PIE, viste: () => `<svg viewBox="0 0 200 320" aria-hidden="true">${CU.nico({ ropa: { gorro: 1, bufanda: 1, guantes: 1, botas: 1 }, piel: CU.PIELES[1] })}</svg>`, toca: () => `<svg viewBox="0 0 200 320" aria-hidden="true">${CU.nico({ saluda: true, piel: CU.PIELES[3], camiseta: CU.CAMISETAS[2] })}</svg>` };
    $('#cuePasaporte').innerHTML = `<div class="sen-pas-t"><b>Pasaporte del cuerpo</b><span>${n === T ? '¡Completo! Ya podéis imprimir el diploma.' : n ? `${n} de ${T} sellos` : 'Cada juego terminado pone un sello'}</span></div>
      <div class="sen-sellos">${CU.SELLOS.map(s => `<span class="sen-sello${v.includes(s.id) ? ' si' : ''}" style="--sc:${s.c}" title="${s.t}${v.includes(s.id) ? ': conseguido' : ''}"><svg viewBox="0 0 24 24" aria-hidden="true">${CU.IC[s.id]}</svg></span>`).join('')}</div>
      <span class="sr-only">${n} de ${T} sellos conseguidos.</span>`;
    $('#cueGrid').innerHTML = CU.SELLOS.map((s, i) => {
      const j = porId[s.id], ok = v.includes(s.id);
      return `<a class="sen-card" href="jugar.html#${s.id}" data-id="${s.id}" style="--sc:${s.c};--i:${i}">
        <span class="sen-card-dib">${DIB[s.id]()}</span>
        <span class="sen-card-tx"><small>${s.s} · ${edadTxt(j.e)}</small><b>${j.t}</b><span>${j.d}</span></span>
        <span class="sen-card-sello${ok ? ' si' : ''}" aria-label="${ok ? 'Sello conseguido' : 'Sin sello todavía'}"><svg viewBox="0 0 24 24" aria-hidden="true">${ok ? '<path d="M6 12.5l4 4 8-9"/>' : CU.IC[s.id]}</svg></span></a>`;
    }).join('');
    const amigos = $('#cueAmigos');
    if (amigos && !amigos.innerHTML) amigos.innerHTML = [[2, 1, 2, false], [0, 0, 0, true], [3, 3, 1, false]].map(([p, h, c, sal], i) => `<svg class="cue-nico cue-nico-${i}" viewBox="0 0 200 320" aria-hidden="true">${CU.nico({ piel: CU.PIELES[p], pelo: CU.PELOS[h], camiseta: CU.CAMISETAS[c], saluda: sal })}</svg>`).join('');
  }
  pintaCuerpo();
  addEventListener('pageshow', pintaCuerpo);

  /* ---------- eventos ---------- */
  function irAJuegos() { $('#juegos').scrollIntoView({ behavior: quieto() ? 'auto' : 'smooth', block: 'start' }); }
  document.addEventListener('click', ev => {
    const lnk = ev.target.closest('a[data-id]');
    if (lnk && !ev.metaKey && !ev.ctrlKey && !ev.shiftKey && ev.button === 0) { ev.preventDefault(); lanza(lnk, lnk.dataset.id); return; }
    const card = ev.target.closest('.tarjeta');
    if (card) { abreFicha(card.dataset.id, card); return; }
    const nv = ev.target.closest('.novedad');
    if (nv && nv.dataset.cat) { ev.preventDefault(); filtroCat = nv.dataset.cat; pintaFiltros(); filtra(); irAJuegos(); return; }
    const c = ev.target.closest('.cat');
    if (c && (c.dataset.cat === 'sentidos' || c.dataset.cat === 'cuerpo') && $('#' + c.dataset.cat)) { $('#' + c.dataset.cat).scrollIntoView({ behavior: quieto() ? 'auto' : 'smooth', block: 'start' }); return; }
    if (c) { filtroCat = c.dataset.cat; pintaFiltros(); filtra(); irAJuegos(); return; }
    const p = ev.target.closest('.pestana');
    if (p) { filtroCat = p.dataset.cat; pintaFiltros(); filtra(); return; }
    const e = ev.target.closest('#edades button');
    if (e) { edad = +e.dataset.e; guarda('raiz-edad', String(edad)); pintaFiltros(); filtra(); return; }
    if (ev.target.closest('#limpiar')) { filtroCat = 'todas'; edad = 0; busca = ''; $('#buscar').value = ''; guarda('raiz-edad', '0'); pintaFiltros(); filtra(); }
  });
  document.addEventListener('keydown', ev => {
    const card = ev.target.closest && ev.target.closest('.tarjeta');
    if (card && ev.target === card && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); abreFicha(card.dataset.id, card); }
  });
  $('#buscar').addEventListener('input', ev => { busca = ev.target.value.trim(); filtra(); });

  /* ---------- acciones ---------- */
  function aplicaCalma() { html.classList.toggle('calma', calma); $('#btnCalma').setAttribute('aria-pressed', String(calma)); }
  $('#btnCalma').addEventListener('click', () => { calma = !calma; guarda('raiz-calma', calma ? '1' : '0'); aplicaCalma(); });
  const btnP = $('#btnPantalla');
  if (!document.fullscreenEnabled) btnP.hidden = true;
  btnP.addEventListener('click', () => { (document.fullscreenElement ? document.exitFullscreen() : html.requestFullscreen()).catch(() => {}); });
  document.addEventListener('fullscreenchange', () => { btnP.setAttribute('aria-label', document.fullscreenElement ? 'Salir de pantalla completa' : 'Pantalla completa'); });

  aplicaCalma(); pintaHoy(); pintaCategorias(); pintaFiltros(); montaRejilla(); filtra(false); pintaRecientes(); revelar();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
