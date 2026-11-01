---
name: La visita de Lolo
description: Un mar de aula para Infantil, con Lolo el pulpo preguntando qué trabajamos hoy y 18 juegos que se lanzan en dos toques.
colors:
  mar-1: "#A6EEE6"
  mar-2: "#3DBBC9"
  mar-3: "#16698A"
  abismo: "#0F4E6E"
  arena: "#F5D596"
  arena-2: "#E7BD72"
  laton: "#E8C66A"
  laton-2: "#B98C2E"
  tinta: "#183153"
  tinta-2: "#46607F"
  blanco: "#FFFFFF"
  espuma: "#EEF8FA"
  lolo: "#FF8A3D"
  sol: "#FFC93C"
  sol-2: "#E9A514"
  c-rutinas: "#FF8A3D"
  c-lenguaje: "#9B6BFF"
  c-logica: "#3D8DF2"
  c-retos: "#FF5D8F"
  c-ciencia: "#2BB673"
  lavanda-calma: "#7E8CE0"
  calma-mar-alto: "#BFE9E6"
  calma-mar-bajo: "#7CC7CF"
typography:
  display:
    fontFamily: "Fredoka, Baloo 2, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 4.2rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Fredoka, Baloo 2, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 1.9vw, 1.9rem)"
    fontWeight: 700
    lineHeight: 1.1
  speech:
    fontFamily: "Fredoka, Baloo 2, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 2.8vw, 2.15rem)"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "Fredoka, Baloo 2, ui-rounded, system-ui, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.15
  control:
    fontFamily: "Fredoka, Baloo 2, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(1rem, 1.15vw, 1.15rem)"
    fontWeight: 700
  body:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.45
  body-small:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.38
  label:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 800
    lineHeight: 1.2
rounded:
  sm: "14px"
  md: "18px"
  lg: "26px"
  card: "30px"
  bubble: "36px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "16px"
  xl: "24px"
  gutter: "16px"
components:
  button-primary:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.tinta}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "52px"
  button-glass:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 18px 0 14px"
    height: "48px"
  button-glass-calma-on:
    backgroundColor: "{colors.lavanda-calma}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.pill}"
  chip:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "6px 20px 6px 7px"
    height: "56px"
  chip-selected:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.pill}"
  segmented-age:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    height: "46px"
  segmented-age-selected:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.pill}"
  speech-bubble:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    typography: "{typography.display}"
    rounded: "{rounded.bubble}"
    padding: "clamp(16px,2vw,26px) clamp(22px,2.6vw,38px)"
  game-card:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    typography: "{typography.title}"
    rounded: "{rounded.card}"
    padding: "14px 16px 16px"
  porthole:
    backgroundColor: "{colors.laton}"
    rounded: "{rounded.pill}"
    padding: "9px"
    width: "min(100%, 148px)"
  age-tag:
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  option-card:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    padding: "12px 10px"
  agenda-strip:
    backgroundColor: "{colors.blanco}"
    rounded: "{rounded.lg}"
    padding: "8px 10px"
  agenda-pictogram:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.sm}"
    size: "52px"
---

# Design System: La visita de Lolo

## Overview

**Creative North Star: "El mar de Lolo"**

Todo ocurre bajo el agua. La pantalla es un mar en vertical: agua clara y luminosa arriba, azul profundo abajo y arena en el fondo, con rayos de luz que respiran despacio, burbujas que suben y algas en el lecho. Lolo, un pulpo naranja con volumen, vive en ese mar y es quien habla: cada pantalla empieza con una pregunta suya en un bocadillo blanco. Sobre el agua flotan superficies blancas de vidrio con sombra azul, que son donde se toca. Los ojos de buey de latón son las ventanas a cada juego.

El sistema está pensado para una pizarra digital de 1920×1080 manejada con el dedo delante de toda la clase. Las piezas son grandes, redondas y táctiles. Ninguna zona táctil baja de 46px, y los controles principales miden entre 52 y 56px. La densidad es media: la maestra tiene que poder leer de un vistazo, y los niños, que aún no leen, se orientan por el color, el icono y el pictograma. El movimiento tiene carácter (Lolo saluda, mira, asiente y se lanza tras la tarjeta), pero el modo tranquilo y `prefers-reduced-motion` lo dejan siempre en fundidos breves.

El mar es el único tema, a propósito. No hay modo oscuro ni cambio de tema: el modo tranquilo es la única variante, y baja estímulos sin cambiar de mundo.

**Key Characteristics:**
- Fondo de mar en degradado vertical (aguamarina, turquesa, azul profundo, abismo) con arena en el pie.
- Lolo grande, ilustrado en SVG con degradado radial, a la izquierda y como narrador.
- Superficies blancas de vidrio con sombra azul difusa sobre el agua.
- Color de categoría en cinco tonos (naranja, morado, azul, rosa, verde), siempre junto a icono y texto.
- Fredoka redondeada para lo que se dice y se toca; Nunito para lo que se lee.
- Formas de píldora y esquinas muy redondeadas: nada tiene canto vivo.
- Movimiento con curvas de salida propias y una firma, la inmersión.

## Colors

Un mar luminoso y saturado con un solo personaje cálido; el color de categoría orienta y el amarillo sol marca la acción principal.

### Primary
- **Naranja Lolo** (lolo): el cuerpo de Lolo, su marca y la categoría Rutinas y asamblea. Es el único naranja del sistema, así que en pantalla equivale a «Lolo está aquí».
- **Amarillo Sol** (sol, con sombra sol-2): el botón principal («¡Vamos!», «Ver todos los juegos»), el anillo de foco, la selección de texto y las pistas que laten. Aparece poco y siempre significa «toca aquí».

### Secondary
- **Turquesa Media Agua** (mar-2) y **Aguamarina Somera** (mar-1): la parte alta del mar y el centro de la capa de inmersión.
- **Azul Profundo** (mar-3) y **Abismo** (abismo): el fondo base del `body`, la parte baja del mar, el `theme-color` y el borde exterior de la inmersión.

### Tertiary
- **Latón Claro** (laton) y **Latón Viejo** (laton-2): exclusivos del anillo de los ojos de buey, en degradado cónico con un brillo #FFF1B8.
- **Arena** (arena) y **Arena Tostada** (arena-2): el lecho del mar en el pie; el texto sobre la arena va en marrón #7A531A.
- **Colores de categoría**: c-rutinas (naranja), c-lenguaje (morado), c-logica (azul), c-retos (rosa) y c-ciencia (verde). Rellenan el cristal del ojo de buey, el punto de categoría, la etiqueta de edad (16 % sobre blanco) y el círculo de icono del chip (22 % sobre blanco). El verde de ciencia es también el verde de acierto (`--ok`) en los juegos.
- **Colores del día** en la app: lunes sol, martes rosa (c-retos), miércoles verde (c-ciencia), jueves morado (c-lenguaje) y viernes turquesa (mar-2). Tiñen la agenda, el selector de día y la tarjeta destacada «Para hoy».

### Neutral
- **Tinta Marina** (tinta): todo el texto principal, el estado seleccionado de chips y del selector de edad, y el botón de menú. Es casi negro azulado y nunca negro puro.
- **Tinta Suave** (tinta-2): descripciones, categoría y textos secundarios sobre blanco (6:1).
- **Blanco Vidrio** (blanco) y **Espuma** (espuma): superficies tocables. El blanco va opaco en las tarjetas y translúcido (78–92 %) en chips, controles y paneles.
- **Lavanda Calma** (lavanda-calma): solo para el botón «Modo tranquilo» activado, en la portada y en la app.
- **Mar en calma** (calma-mar-alto → calma-mar-bajo): el degradado apagado que sustituye al mar cuando el modo tranquilo está activo en la app.

### Named Rules
**La Regla del Color Acompañado.** El color nunca va solo: cada color de categoría o de día aparece junto a un icono, un pictograma o una palabra. Ningún dato se comunica solo con el tono.

**La Regla del Sol Escaso.** El amarillo sol se reserva para la acción principal, el foco y las pistas. Si dos cosas amarillas compiten en la misma pantalla, una sobra.

**La Regla del Mar Fijo.** El fondo siempre es el mar, en degradado vertical de claro a profundo. No hay fondos planos neutros, temas alternativos ni modo oscuro.

## Typography

**Display Font:** Fredoka 500/600/700 (con Baloo 2, ui-rounded y system-ui de respaldo)
**Body Font:** Nunito 600/700/800 (con ui-rounded y system-ui de respaldo)

**Character:** Fredoka es la voz de Lolo: redonda, gruesa y amable, y se usa en todo lo que Lolo dice y en todo lo que se toca. Nunito es la voz de la maestra: redondeada pero sobria, para descripciones, guías y etiquetas. Las dos fuentes van alojadas en `fonts/` en woff2, con `font-display: swap` y precarga de Fredoka 600 y Nunito 700. No se hace ninguna petición a terceros.

### Hierarchy
- **Display** (Fredoka 700, clamp(2rem, 4.4vw, 4.2rem), 1.04, −0.01em): la pregunta de Lolo en el bocadillo de la portada. Hay una por pantalla.
- **Speech** (Fredoka 600, clamp(1.3rem, 2.8vw, 2.15rem), 1.2): lo que Lolo dice dentro del panel de juego. Usa `text-wrap: balance` y una altura mínima de dos líneas para que el panel no salte.
- **Headline** (Fredoka 700, clamp(1.4rem, 1.9vw, 1.9rem), 1.1): títulos de sección sobre el agua («Para hoy», «Todos los juegos»), en blanco con sombra de texto azul.
- **Title** (Fredoka 700, 1.3rem, 1.15): título de tarjeta de juego; en móvil baja a 1.05rem.
- **Control** (Fredoka 700, 1–1.15rem): chips, selector de edad y botones. Los botones grandes de la app llegan a clamp(1.15rem, 2.2vw, 1.55rem).
- **Body** (Nunito 600, 16px, 1.45): texto corrido. Las guías limitan la línea a 58–64ch.
- **Body small** (Nunito 600, .95rem, 1.38): descripción de tarjeta, recortada a tres líneas; se oculta en móvil.
- **Label** (Nunito 800, .78rem): categoría y edad de las tarjetas. En mayúsculas con tracking de .06–.08em solo cuando etiqueta un control o la marca («EDAD», la línea bajo el nombre del sitio) o un estado de la agenda («AHORA»).

### Named Rules
**La Regla de las Dos Voces.** Lo que Lolo dice y lo que se toca va en Fredoka; lo que la maestra lee va en Nunito. No se mezclan dentro de un mismo elemento.

**La Regla del Peso Mínimo.** No hay texto por debajo de 600. A distancia de pizarra, los pesos finos desaparecen.

## Layout

En la portada, un contenedor de 1640px como máximo, centrado, con margen lateral de `max(16px, safe-area)`. En la app, el contenedor es de 1280px. El mar es una capa fija detrás del contenido (`position: fixed; inset: 0`) y el contenido se desplaza por encima.

- **Escena de Lolo**: una rejilla de dos columnas, con Lolo a la izquierda (26 % en la portada y 30 % en la app, con mínimo de 160–200px) y la pregunta o el panel a la derecha. El separador va de clamp(16px, 3vw, 48px) en la portada a clamp(10px, 3vw, 32px) en la app. Por debajo de 760px pasa a una sola columna: Lolo encoge (190px en la portada y 150px en la app) y el pico del bocadillo gira hacia arriba.
- **Rejilla de juegos**: `auto-fill` con mínimo de 236px y separación de 16px. A partir de 1700px son 6 columnas fijas y por debajo de 760px, 2 columnas con separación de 10px. Las tarjetas entran escalonadas, con 35ms de diferencia entre una y la siguiente.
- **Fila «Para hoy»**: la tarjeta destacada ocupa 1.6 partes y van tres mini tarjetas al lado. Por debajo de 1100px son 2 columnas con la destacada a todo el ancho, y por debajo de 760px, una sola columna.
- **App**: se apila de arriba abajo en barra de juegos, agenda, escena y arrecife colectivo sobre la arena.
- **Ritmo**: separaciones de 6, 8, 10, 12, 14 y 16px dentro de los componentes y saltos de sección con clamp(22px, 4vh, 44px). Las medidas verticales usan `vh` en clamp para que todo quepa en una pizarra de 1080px de alto.

## Elevation & Depth

La profundidad es la del agua: lo cercano flota y lo lejano se pierde en el azul. Las superficies tocables proyectan una sombra azul difusa (nunca gris ni negra), y el mar aporta su propia profundidad con el degradado, los rayos desenfocados y las burbujas.

### Shadow Vocabulary
- **Flotación** (`0 14px 30px rgba(10,58,88,.18), 0 2px 6px rgba(10,58,88,.10)`, token `--sombra`): tarjetas de juego, «Para hoy» y el bocadillo.
- **Flotación alta** (`0 22px 40px rgba(10,58,88,.24), 0 2px 6px rgba(10,58,88,.1)`): tarjeta bajo el puntero (solo con puntero fino), que además sube 4px.
- **Vidrio** (`0 6px 14px rgba(10,58,88,.13)` a `0 8px 24px rgba(10,60,90,.18)`): chips, botones de cabecera, agenda y barra de juego.
- **Panel** (`0 24px 60px rgba(8,50,80,.25)`): el panel de juego de la app, la superficie más alta.
- **Personaje** (`drop-shadow(0 22px 22px rgba(8,50,80,.28))`): Lolo, con una sombra elíptica bajo él que se estrecha cuando sube.
- **Ojo de buey** (`0 8px 14px rgba(8,50,80,.2)` por fuera y `inset 0 6px 14px rgba(0,0,0,.25)` en el cristal): ventana hundida en un anillo de latón.

### Named Rules
**La Regla de la Sombra Azul.** Toda sombra está teñida del azul del mar (rgba(8–10, 50–60, 80–90, …)). No se usan sombras grises ni negras.

**La Regla de la Repisa Heredada.** Algunos botones y tarjetas de la app (botón amarillo, tarjetas de opción, números, cartas de memoria, flechas) llevan una repisa dura sin desenfoque (`0 8px 0 …`) que desaparece al pulsar. Es una herencia de la app y no se extiende a superficies nuevas: en ellas, la pulsación se expresa con la sombra azul difusa y una escala de .97.

## Shapes

Todo es redondo. Los controles son píldoras (999px) y las superficies tienen esquinas muy suaves: 14px en los pictogramas pequeños y el foco, 18px en los elementos de la agenda, 26–28px en las tiras y tarjetas de opción, 30px en las tarjetas de juego y 34–36px en el panel y el bocadillo. Los círculos perfectos se reservan para Lolo, los ojos de buey, los iconos de chip y las burbujas. Los bordes son blancos y gruesos (3–4px), como cantos de vidrio, y en los estados vacíos o de «hueco por rellenar» pasan a discontinuos. El bocadillo lleva un pico triangular hecho con `clip-path`, que apunta a Lolo.

## Components

### Bocadillo de Lolo
Es la voz del producto: un globo blanco, sin borde, con esquinas de 36px, sombra de flotación y pico triangular hacia Lolo. Contiene una sola pregunta en tipografía display. Al cambiar de objetivo, la frase se funde (opacidad, desenfoque de 3px y 6px de desplazamiento, en 180ms) y se sustituye. Aparece con escala desde .92 y un desenfoque que se aclara en 520ms, 450ms después de cargar. En la app, el bocadillo va dentro del panel, con una etiqueta naranja en píldora («Lolo») que dice quién habla.

### Botones
- **Primario amarillo**: una píldora con degradado de #FFDA6A a sol y texto en tinta Fredoka 700. Mide 52px en la portada y tiene padding de 14px 30px en la app. Al pulsar baja 4–6px. En la app puede llevar un pulso de halo amarillo para invitar a tocar, que se desactiva en modo tranquilo.
- **Vidrio** (cabecera: «Modo tranquilo», «Pantalla completa»): una píldora de 46–48px, blanca al 82–92 % con borde blanco de 3px, icono de trazo de 20px y Nunito 800. Activada, pasa a lavanda calma con texto blanco. En móvil se queda solo el icono y el texto pasa a ser accesible para lectores de pantalla.
- **Menú**: una píldora tinta con texto blanco, de 54px.
- **Pulsación**: `scale(.97)` en 160ms con la curva de salida. El hover solo actúa con puntero fino.

### Chips de objetivo
- **Estilo**: píldora de 56px de alto (48px en móvil), blanca al 88 % con borde blanco de 3px, un círculo de icono de 40px tintado con el color del objetivo al 22 % e icono de trazo del color pleno, y texto en Fredoka.
- **Estado**: seleccionado se marca con `aria-pressed`, sombra tintada con su color y el icono en blanco sobre un círculo translúcido. El relleno canónico es tinta con texto blanco (13:1), como en «Todo». El build rellena además cada chip con su color de objetivo y texto blanco, pero en naranja, rosa y verde eso queda por debajo de 3:1, así que no es regla: una superficie nueva usa tinta, o el color de objetivo con texto tinta. Es un único grupo de filtro, no son pestañas.

### Selector de edad
Una cápsula blanca translúcida con la etiqueta «EDAD» y segmentos en píldora de 46px de alto y 78px de ancho mínimo («Todas · 3 años · 4 años · 5 años»). El segmento activo va en tinta con texto blanco, con `aria-pressed`. La elección se guarda en el navegador.

### Tarjetas de juego
- **Corner Style**: 30px (22px en móvil).
- **Background**: blanco opaco, sombra de flotación y sin borde.
- **Contenido**: ojo de buey centrado, título, descripción en tres líneas, punto y nombre de categoría, y etiqueta de edad en píldora tintada con la categoría. No se muestra duración porque no hay datos reales.
- **Estados**: con puntero fino, la tarjeta sube 4px y el icono gira −8° y crece a 1.08. Al pulsar, escala .97. Al lanzar, se hunde (ver inmersión).
- **Internal Padding**: 14px 16px 16px; 10px en móvil.

### Ojo de buey
La pieza característica. Es un anillo de latón de 9px hecho con un degradado cónico (laton, #FFF1B8, laton, laton-2) y una sombra interior inferior. Dentro va un cristal circular con degradado radial del color de categoría (claro arriba a la izquierda y oscurecido hacia #0B2A44 en el borde), un reflejo elíptico blanco al 45 %, tres burbujitas con borde blanco y un icono de trazo blanco al 54 % del ancho con sombra dura de 3px. Mide como máximo 148px en la tarjeta, 96px en móvil y 74px en las mini tarjetas.

### Tarjetas «Para hoy»
Son tarjetas horizontales blancas de 118px de alto y 28px de radio. La destacada lleva una losa de 92px con el color del día y la abreviatura del día en grande, y un degradado hacia ese color en la esquina. Las mini llevan un ojo de buey de 74px. El hueco vacío es un borde blanco discontinuo de 3px con texto blanco.

### Agenda visual (app)
Una tira de vidrio con 26px de radio y elementos de 82px de ancho mínimo. Cada paso es un pictograma de 52px con 16px de radio y borde #DCE8EE, con una etiqueta Nunito 800 debajo. El paso actual se tiñe con el color del día, recibe un halo de 4px y una etiqueta tinta «AHORA». Los pasos hechos bajan al 45 % de opacidad y llevan una marca verde de acierto. Así la clase sabe siempre qué viene después.

### Tarjetas de opción (app)
Son las respuestas táctiles de los juegos: rejilla `auto-fit` con mínimo de 140px y altura de clamp(130px, 21vh, 210px). Llevan un degradado de blanco a espuma, borde blanco de 4px, 28px de radio, el dibujo centrado y una etiqueta en píldora #E6F3F6. En acierto, el borde y el fondo pasan a verde y aparece una insignia circular verde con una marca, que entra con un rebote. En pista, el borde es amarillo con un latido de 1.1s. En error, un leve tembleque de .45s, sin rojo ni sonido de castigo.

### Movimiento (Lolo, inmersión y fondo)

Las curvas son propias: `--ease-out: cubic-bezier(.23,1,.32,1)` para entradas, pulsaciones y respuestas, y `--ease-in-out: cubic-bezier(.77,0,.175,1)` para el saludo y la inmersión. Las respuestas a un toque duran entre 160 y 200ms y las entradas, entre 420 y 520ms.

- **Lolo en reposo**: entra asomando (desde 60px más abajo, a escala .94, en 900ms) y después flota ±10px en 3.4s. Los tentáculos se balancean ±4° en 2.8s, en dos fases alternas, parpadea cada 5s y su sombra se estrecha al subir. El brazo saluda dos veces al llegar.
- **Lolo atento**: sigue con las pupilas el dedo o el puntero (hasta 6px, con inercia de .18 por fotograma) y asiente (salto de 14px con giro de −4°, en 520ms) cuando la maestra elige un objetivo o una edad.
- **La inmersión** (firma): al tocar un juego, la tarjeta se hunde (24px hacia abajo, escala .94, desenfoque de 2px y opacidad .6, en 420ms) y suben 14 burbujas desde el punto tocado. Lolo toma impulso y nada hacia ese punto, encogiendo (620ms). A los 140ms, una capa de mar se abre en círculo desde el dedo (`clip-path`, 620ms) y a los 700ms se abre el juego. Al volver atrás, todo se deshace.
- **Fondo**: tres rayos de luz que respiran en 9–10s y 26 burbujas en un canvas que se pausa cuando la pestaña está oculta.

### Named Rules
**La Regla del Modo Tranquilo.** El modo tranquilo (preferencia `lolo-calma`, compartida por la portada y la app) apaga los rayos, las burbujas, la flotación, los tentáculos, el saludo, los pulsos y los latidos. Deja solo fundidos de 160ms, lanza el juego sin inmersión, baja el volumen al 45 % y hace la voz más lenta. Es una variante del mismo mar, no otro mundo.

**La Regla del Movimiento Reducido.** Con `prefers-reduced-motion: reduce` se aplica lo mismo que en el modo tranquilo, y además se quitan el parpadeo y la entrada del bocadillo. La mirada, el asentimiento y el cambio de frase con fundido no se ejecutan. La información nunca depende de una animación.

## Do's and Don'ts

### Do:
- **Do** empezar cada pantalla con Lolo y una pregunta suya en el bocadillo blanco, en segunda persona del plural («¿Qué trabajamos hoy?»).
- **Do** acompañar cada color de categoría o de día con su icono o pictograma y su texto.
- **Do** mantener las zonas táctiles en 46px como mínimo y en 52–56px para los controles principales.
- **Do** usar la sombra azul de flotación (`--sombra`) en toda superficie blanca que flote sobre el mar.
- **Do** usar `--ease-out` en entradas y respuestas, en 160–200ms al tocar, y `scale(.97)` como respuesta de pulsación.
- **Do** dar a cada animación su versión para el modo tranquilo y para `prefers-reduced-motion` en el mismo cambio.
- **Do** usar el anillo de foco amarillo sol de 4px con separación de 3px en todo elemento interactivo.
- **Do** cargar Fredoka y Nunito desde `fonts/`, en el propio sitio.

### Don't:
- **Don't** convertir la portada en un catálogo con buscador y categorías como pestañas; se filtra con chips de objetivo y el selector de edad.
- **Don't** mostrar puntos, rankings, tiempos límite ni nada que señale o compare a un niño concreto.
- **Don't** usar rojo ni sonidos de castigo para el error; el error es un tembleque breve y una nueva oportunidad.
- **Don't** usar sombras grises o negras, ni fondos planos neutros en lugar del mar.
- **Don't** inventar datos (duración, número de usos, testimonios) para rellenar tarjetas.
- **Don't** extender a superficies nuevas la repisa dura heredada ni las etiquetas en mayúsculas sobre los títulos de las capas.
