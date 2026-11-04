# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** maestras y maestros de Educación Infantil (3–5 años) en Andalucía que eligen y lanzan los juegos desde la pizarra digital, delante de toda la clase. Los niños miran, participan saliendo a tocar y responden en voz alta.
- **Secondary:** niños y niñas de 3 a 5 años que tocan la pantalla por turnos; muchos aún no leen.
- En el aula hay al menos un alumno con autismo.

## Product Purpose

La visita de Lolo reúne 26 juegos educativos breves para la asamblea y los rincones de Infantil. Cada juego dura unos 10 minutos, se juega en grupo y termina con una actividad manipulativa sin pantalla. El éxito es que la maestra encuentre y lance el juego adecuado para su grupo en segundos, y que la clase juegue sin barreras.

## Positioning

Un único personaje, Lolo el pulpo, guía todos los juegos con voz y pictogramas. Las rutinas se basan en el currículo andaluz de Infantil. El progreso es siempre colectivo (el jardín de la clase): no hay puntos, rankings ni tiempo límite, y los apoyos para alumnado con autismo funcionan para toda la clase.

## Operating Context

- Pizarra digital de aula, normalmente de 1920×1080, manejada con el dedo o con un lápiz. También tablet y móvil.
- Uso colectivo en asamblea, con la maestra como guía. Las sesiones son breves.
- La voz depende del sintetizador del navegador. En Edge hay voces naturales.
- Funciona sin conexión después de la primera visita.

## Capabilities and Constraints

- Web estática (HTML, CSS y JS sin framework), publicada en GitHub Pages desde `jvlsile/VISITA-DE-LOLO-`. La aplicación de juegos admite enlaces directos por hash (`#formas`, `#robot`…).
- Hay 26 juegos en 7 categorías (Rutinas y asamblea; Lenguaje, cuentos y emociones; Lógica y matemáticas; Retos y cooperación; Ciencia y manipulación; El otoño; Trazos), cada uno con su rango de edad.
- La portada es la entrada principal del sitio y lanza los juegos.
- `fichas.html` genera fichas de trazos para imprimir, dos por hoja A4.
- No recoge datos personales. Solo guarda preferencias en el navegador.
- Fuentes alojadas en el propio sitio: no se hacen peticiones a terceros.
- Pruebas de extremo a extremo con Playwright en CI.

## Brand Commitments

- Nombre: «La visita de Lolo». Protagonista: Lolo, un pulpo naranja que vive en el mar. Otros personajes: el cangrejo Paco y Robi el robot.
- Por ahora no aparece autoría ni centro.
- Tono de voz: cercano, en segunda persona del plural («¿Jugamos?»), frases cortas, sin infantilizar a la maestra.

## Evidence on Hand

- Los 26 juegos en funcionamiento (`jugar.html`, `js/app.js`) y la guía docente integrada.
- No hay testimonios, centros usuarios ni datos de uso. No se deben inventar.

## Product Principles

1. La maestra lanza cualquier juego en dos toques como máximo.
2. Todo se entiende sin leer: pictograma, color e icono acompañan siempre al texto.
3. Calma antes que estímulo: siempre hay opciones de menos movimiento y menos sonido.
4. Juego colectivo y cooperativo: nada señala ni compara a un niño concreto.
5. Pantalla breve, manos después: cada juego remite al mundo real.

## Accessibility & Inclusion

- Alumnado con autismo: anticipación (agenda visual), estructura predecible, modo de baja estimulación, rincón de la calma.
- Se respeta `prefers-reduced-motion`. Hay alternativa de tocar en lugar de arrastrar. Las zonas táctiles son grandes para dedos pequeños y para el lápiz de la pizarra.
- Contraste AA en los textos.
