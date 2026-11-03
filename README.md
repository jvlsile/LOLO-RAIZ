# La visita de Lolo

Juegos educativos de **Educación Infantil (3–5 años)** para pizarra digital, tablet y móvil. Lolo, un pulpo, guía a la clase con voz, pictogramas y sin necesidad de leer.

- **26 juegos** en siete categorías (entre ellas, siete juegos de otoño y los ocho trazos de grafomotricidad), con filtro por edad.
- **Rutinas para ciclos de 5 días** basadas en el currículo de Infantil de Andalucía (Decreto 100/2023 y Orden de 30 de mayo de 2023).
- **Apoyos para alumnado con autismo**, útiles para toda la clase: agenda visual con «Ahora» y «Después», final anunciado, modo tranquilo, rincón de la calma, y la opción de arrastrar o tocar.
- Sin puntos ni rankings: el progreso es colectivo y se ve en **el jardín de la clase**.
- Cada juego termina con una actividad manipulativa, sin pantalla.

## Juegos

| Categoría | Juegos |
|---|---|
| Rutinas y asamblea | La visita de Lolo · El jardín de la clase · Muévete y responde |
| Lenguaje, cuentos y emociones | La caja misteriosa · El cuento que decidimos · Las emociones de Lolo |
| Lógica y matemáticas | Cuenta y toca · Series y patrones · Clasifica en cestas · Grande, mediano, pequeño · Encuentra la pareja · Formas geométricas |
| Retos y cooperación | Juego a dúo · Mini-escape de colores · El robot perdido |
| Ciencia y manipulación | ¿Qué pasa si…? · Toca, construye y comprueba · Caza mágica |
| El otoño | Las hojas del otoño · El árbol y las estaciones · ¿Qué nos ponemos? · Adivina el fruto del otoño · Los animales en otoño · El puesto de castañas · El viento de otoño |
| Trazos | La tinta de Lolo (vertical, horizontal, curva, círculo, zigzag, onda, cruz y espiral) |

Dentro de la aplicación, el botón **Guía docente** explica cada juego, la normativa y los apoyos.

Se puede abrir un juego concreto directamente, por ejemplo `…/jugar.html#formas`, `…/jugar.html#robot`, `…/jugar.html#caja` o `…/jugar.html#tinta`.

## Portada

La dirección principal abre la **portada**. Lolo pregunta «¿Qué trabajamos hoy?», la maestra elige un objetivo (contar, emociones, movernos…) y la edad del grupo, y toca un juego. La tarjeta «se sumerge», Lolo se lanza tras ella y se abre el juego en `jugar.html#<juego>`. La fila «Para hoy» muestra la rutina del día, los últimos juegos y sugerencias de Lolo. Dentro de cada juego, el botón **Inicio** vuelve a la portada.

## Voz de Lolo

Lolo puede hablar con audios grabados. Todo lo que dice está en `audio/guion.csv`, y cómo generar y subir los audios está en [AUDIOS.md](AUDIOS.md). Mientras falte un audio, se usa la voz del navegador.

## Probarlo en tu ordenador

Hace falta Python 3 (viene instalado en Mac y Linux).

```bash
python3 -m http.server 4173
```

Después abre <http://localhost:4173>. Abrir `index.html` con doble clic también funciona, pero sin modo sin conexión.

## Pruebas automáticas

Las pruebas recorren la portada (filtros, lanzar un juego, recientes) y juegan los 26 juegos de principio a fin (en La tinta de Lolo, trazando con el ratón de verdad) en tres tamaños de pantalla (pizarra 1920×1080, portátil 1366×768 y móvil). También comprueban que no hay errores en la consola, que nada se sale de la pantalla y que se puede arrastrar.

```bash
npm ci
npx playwright install chromium
npm test
```

## Publicación

Cada `push` a la rama `main` lanza el flujo **Probar y publicar** (`.github/workflows/publicar.yml`):

1. Pasa todas las pruebas.
2. Si todo va bien, publica la web en GitHub Pages.

Si alguna prueba falla, no se publica nada y el informe queda en la pestaña *Actions*.

**Solo la primera vez:** en el repositorio, ve a *Settings → Pages → Build and deployment → Source* y elige **GitHub Actions**.

La dirección es <https://jvlsile.github.io/VISITA-DE-LOLO-/>.

## Estructura

```
index.html              Portada: elegir y lanzar juegos
css/portada.css         Estilos de la portada
js/portada.js           Lógica de la portada
jugar.html              Los 26 juegos
css/estilos.css         Estilos de los juegos
js/app.js               Toda la lógica de los juegos
fonts/                  Fuentes Fredoka y Nunito alojadas en el propio sitio
icons/                  Iconos de la aplicación
manifest.webmanifest    Permite instalarla como aplicación en tablets
sw.js                   Modo sin conexión
tests/                  Pruebas automáticas (portada y juegos)
PRODUCT.md, DESIGN.md   Producto y sistema visual documentados
```

## Privacidad

- La web **no recoge ningún dato** y no usa cookies, analítica ni servicios de terceros (las fuentes van incluidas).
- Solo guarda en el propio navegador algunas preferencias: la voz elegida, el modo tranquilo, el filtro de edad y los logros del jardín.
- La voz la genera el navegador del dispositivo. En Microsoft Edge, las voces naturales (Elvira, Álvaro) se procesan en los servidores de Microsoft.

## Antes de usarlo con alumnos

Consulta [PRODUCCION.md](PRODUCCION.md).
