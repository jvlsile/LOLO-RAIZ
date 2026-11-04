# Cambios

## 1.6.0 · noviembre de 2026

- **Generador de fichas de trazos** (`fichas.html`): fichas para imprimir de los ocho trazos, dos por hoja A4 con línea de corte.
  - Cada ficha: el modelo del trazo con punto de inicio y flecha de dirección, filas de práctica y un dibujo para colorear.
  - Ayuda progresiva (repasar, unir puntos y solo inicio y final) o un solo nivel para toda la ficha.
  - Tamaño según la edad: 3, 4 o 5 filas.
  - En cada hoja, dos fichas iguales (una por niño) o dos trazos seguidos.
  - Opciones de nombre y fecha, dibujo para colorear y ahorro de tinta. Las preferencias se recuerdan en el navegador.
  - Se llega desde La tinta de Lolo (al elegir trazo y al terminar, ya con ese trazo), desde la ficha del juego en la portada y desde la guía docente. Funciona sin conexión.

## 1.5.0 · noviembre de 2026

- Nueva categoría **Trazos**, con el juego **La tinta de Lolo**: los ocho trazos de la grafomotricidad, de menor a mayor dificultad (vertical, horizontal, curva, círculo, zigzag, onda, cruz y espiral).
  - Tres pasos por trazo: Lolo lo dibuja y se repasa por un camino ancho; se siguen los puntos; solo inicio y final.
  - Se traza con el dedo y deja tinta. Cuenta el recorrido en orden, del punto verde a la estrella, con un margen amplio que crece en móvil. Solo cuenta el primer dedo.
  - Sin sonido de error: si el dedo se sale, la tinta se aclara y Lolo indica dónde seguir. Botones «Mira a Lolo» y «Borrar».
  - Al terminar, el trazo cobra vida: crece el árbol, la hoja sonríe, sale el gusanito, se posa un pajarito, el caracol saca los cuernos…
- Portada: tarjeta destacada de Trazos con los ocho trazos en miniatura, y aviso de novedad que lleva a ella.
- Guía docente: apartado sobre La tinta de Lolo.
- 25 frases nuevas en el guion de audios (765 en total).
- Pruebas automáticas que trazan con el ratón cada uno de los ocho trazos.

## 1.4.0 · noviembre de 2026

- Nueva categoría **El otoño**, con siete juegos:
  - Las hojas del otoño: clasificar hojas por color y tamaño.
  - El árbol y las estaciones: cómo cambia el árbol y qué estación viene después.
  - ¿Qué nos ponemos?: la ropa adecuada para la lluvia, los charcos, el viento y el frío.
  - Adivina el fruto del otoño: adivinanzas de castañas, granadas, uvas, calabazas, setas y bellotas.
  - Los animales en otoño: migrar, hibernar o guardar comida.
  - El puesto de castañas: contar del 1 al 5 sirviendo castañas asadas.
  - El viento de otoño: movimiento, expresión corporal y relajación.
- Aviso de novedad en la portada que lleva directamente a los juegos de otoño.
- 110 frases nuevas en el guion de audios (740 en total).

## 1.3.0 · noviembre de 2026

- Voz grabada para Lolo: si una frase tiene su audio en `audio/`, suena el audio; si no, la voz del navegador. Se pueden subir por tandas.
- Guion completo de las 630 frases (`audio/guion.csv`) con indicación de tono, y guía para generar la voz (`AUDIOS.md`), con un script opcional para ElevenLabs.
- Las frases que cambian (series, programas del robot, torres…) se encadenan a partir de palabras sueltas grabadas.
- Correcciones de concordancia: «el calcetín», «la vaca», «¿dónde están las castañuelas?».

## 1.2.0 · noviembre de 2026

- Portada rediseñada: navegación fija, portada con una acción principal (la rutina de hoy), categorías, buscador y filtros fijos, ficha de cada juego con qué se trabaja y cómo se juega, sección «Cómo funciona».
- Animaciones: entrada orquestada, Lolo con órbita de categorías, filtros con recolocación suave, ficha deslizante y lanzador que expande la tarjeta a pantalla completa.
- Adaptada a pizarra, portátil, tablet y móvil (la ficha pasa a hoja inferior en móvil).

## 1.1.0 · noviembre de 2026

- Nueva portada con Lolo como protagonista: «¿Qué trabajamos hoy?», filtros por objetivo y edad, fila «Para hoy» (rutina del día, recientes y sugerencias) y transición de inmersión al lanzar un juego.
- Los juegos pasan a `jugar.html`, con un botón «Inicio» para volver a la portada.
- PRODUCT.md y DESIGN.md con el producto y el sistema visual documentados.

## 1.0.0 · noviembre de 2026

Primera versión para producción.

- 18 juegos en 5 categorías con filtro por edad (3, 4 y 5 años).
- La visita de Lolo con rutinas distintas para cada día de la semana.
- La caja misteriosa (rutina Veo · Pienso · Me pregunto).
- Seis juegos de lógica y matemáticas, con 5 retos de dificultad creciente.
- El cuento que decidimos, El robot perdido, Toca construye y comprueba, El jardín de la clase, ¿Qué pasa si…?, Juego a dúo, Mini-escape de colores, Las emociones de Lolo, Muévete y responde y Caza mágica.
- Apoyos de accesibilidad: agenda visual, modo tranquilo, rincón de la calma, selector de voz, arrastrar o tocar.
- Fuentes propias, modo sin conexión e instalación como aplicación.
- Pruebas automáticas y publicación en GitHub Pages.
