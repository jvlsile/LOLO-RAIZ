# Roadmap · Planificación semanal, asamblea y rincones (LOLO-RAIZ)

Borrador de trabajo. Lo acordado en `docs/decisiones-ui.md` se mantiene; los puntos marcados como **por confirmar** se hablan con la autora antes de implementarse.

## 0. Principios

- Una sola interfaz, la de la app que los niños ya conocen. La docente programa su semana y puede cambiar cualquier propuesta.
- Tres modos de edad (3, 4 y 5 años) que se cambian desde la barra fija. Cada juego, reto y bloque de asamblea tiene su versión para cada modo.
- Cada semana y cada día cambian las propuestas, aunque se trabajen los mismos conceptos.
- Todo se planifica con antelación y se puede lanzar en la pizarra sin buscar nada.
- Materiales fáciles de conseguir (cartón, vasos de plástico, palitos, bloques de madera, tapones, cestas, arena, plastilina, mesa de luz).

## 1. Planificación semanal (`planificacion.html`)

- Pasar de reparto por trimestre a **planificador de cinco días** (lunes a viernes).
- Cada día muestra: rincones propuestos, palabra protagonista, número protagonista, reto a elegir, secuencia de pictogramas y veo-veo fonológico.
- Los rincones se eligen por día; no tienen que aparecer todos todos los días.
- La docente puede quitar, cambiar o añadir actividades de cada día.
- Guardado en el navegador con prefijo `raiz-` (regla del proyecto).

## 2. Trimestres y situaciones de aprendizaje

- **T1 · El cuerpo**, **T2 · La alimentación**, **T3 · La calle** (decisiones-ui).
- Las propuestas de los rincones salen de las **situaciones de aprendizaje** que enviará la docente para cada trimestre. **Pendiente de recibirlas.** Hasta entonces, se usan como base las propuestas ya acordadas (ver sección 3).
- Cada trimestre tiene sus propuestas por rincón. Las actividades se reparten por día, sin repetir la misma en semanas seguidas.

### 2.1 Propuestas de rincones ya acordadas (borrador)

**Construcción (3 años)** — rota por días: encajar piezas grandes, apilar vasos de plástico, torres con bloques de madera.

**Construcción (4 años)** — puentes con cartones de huevo y palitos, torres con vasos de distintos tamaños, ciudad con bloques y figuras pequeñas.

**Construcción (vida práctica, provocaciones, mesa de luz y arena, metodologías activas):**
- T1 · El cuerpo: esqueleto con bloques de madera sobre la mesa de luz; castillo de arena con moldes.
- T2 · La alimentación: puesto de frutas con cajas de cartón; huerto con arena y semillas en la mesa de luz.
- T3 · La calle: semáforo con bloques y luces; calle de arena con cochecitos.

**Matemáticas (4 años):**
- T1 · El cuerpo: ordenar partes del cuerpo por tamaño con siluetas de papel; contar dedos con tapones de colores.
- T2 · La alimentación: clasificar frutas de plástico por tamaño; contar piezas de fruta en cestas pequeñas.
- T3 · La calle: ordenar señales de tráfico por forma y color; contar coches de juguete en un aparcamiento de cartón.

**Pendiente de completar:** rincones de juego simbólico, vida práctica, biblioteca y resto de áreas, a partir de las situaciones de aprendizaje.

## 3. Asamblea (`asamblea.html`, `js/asamblea.js`)

Orden por día (decisiones-ui, con los bloques nuevos):

1. Saludo y fecha.
2. Agenda visual (visible durante toda la sesión, ver punto 6).
3. Trazo del día.
4. **Repaso del cuerpo** (solo T1, y en otros trimestres el tema que toque). Señalar cabeza, manos, pies, etc.
5. **Palabra protagonista** (ver punto 4).
6. **Número protagonista** y **lógico-matemática** (ver punto 5).
7. **Secuencia de pictogramas** (ver punto 7).
8. **Veo-veo fonológico** (ver punto 8).
9. **Pregunta reto** y reto del día (a elegir, ver punto 9).
10. Tres rincones.
11. Despedida.

Cada bloque es saltable desde el menú lateral y mantiene siempre el mismo pictograma, el mismo sitio y los mismos sonidos (anticipación para el alumnado con autismo).

## 4. Palabra protagonista interactiva

- La palabra se escribe en la pizarra y se muestra una imagen grande que la representa. Los niños la leen juntos.
- Los niños **definen** la palabra eligiendo entre imágenes. Para 3 años, dos opciones; para 4 y 5 años, varias imágenes parecidas.
- Los niños **señalan en la pizarra** las vocales y las consonantes.
- Los niños **cuentan las sílabas** dando palmadas, con guía paso a paso.
- Progresión en 3 años: primero solo vocales, luego consonantes, al final sílabas.
- Para 4 y 5 años: nº de sílabas, letras, vocales (azul) y consonantes (rojo), y mayúscula/minúscula según la edad.
- **Por confirmar:** en `decisiones-ui.md`, la palabra de 3 años va con palmas, imagen y vocales. La versión acordada ahora es con la palabra escrita en la pizarra y la identificación de vocales y consonantes. Hay que revisar cuál se queda.
- La docente puede planificar la palabra de cada día con antelación.

## 5. Número protagonista y lógico-matemática

- Número del día y relación cantidad-grafía: el número se escribe en la pizarra y los niños lo relacionan con su cantidad (dedos, tarjetas, objetos).
- **Conteo por edad (por confirmar):**
  - 3 años: hasta 5 (con dedos y tarjetas grandes).
  - 4 años: hasta 10 en la conversación; `decisiones-ui.md` dice hasta 15 (anterior y posterior, sumas dibujadas).
  - 5 años: hasta 20 en la conversación; `decisiones-ui.md` dice hasta 50 (sumas y restas de una cifra sin llevadas).
- Lógico-matemática: series, cantidad, tamaño, forma. Como actividad aparte de la cuenta, dentro de la asamblea.

## 6. Agenda visual

- La agenda visual (HOY) se ve mientras la docente trabaja con los niños: franja fina arriba, con «Ahora» y «Después».
- Los pictogramas siguen ARASAAC y se marcan lo hecho sin reloj.
- Se puede imprimir.

## 7. Secuencia de pictogramas (lo que antes se llamó «movimientos acádicos»)

- La pizarra muestra una **secuencia de pictogramas** que los niños leen o dicen en voz alta, a su ritmo.
- No tienen que ser movimientos: pueden ser palabras («moto», «coche», «casa») o partes del cuerpo («mano», «pie», «cabeza»). Si son movimientos, también válidos (brazos arriba, sentarse, palmas).
- 3 años: 2 o 3 pictogramas.
- 4 años: 3 pictogramas, con palabras y frases cortas.
- 5 años: 4 o más pictogramas, con frases más largas.

## 8. Veo-veo fonológico (conciencia fonológica)

- Cada día se propone un veo-veo sobre una palabra que empieza por un sonido concreto (p. ej. /m/, /p/, /c/, /s/, /l/).
- Los niños tienen varias imágenes y tienen que identificar cuál empieza por ese sonido.
- 3 años: 2 imágenes. 4 años: 3 imágenes. 5 años: 4 imágenes, con sonidos más difíciles.
- Progresión de sonidos por semana (no repetir un sonido en semanas seguidas).

## 9. Retos diarios a elegir

- Cada día hay **varias opciones de reto**, todas con los mismos conceptos del día pero con juegos distintos. La docente elige una.
- Ejemplos del lunes (T1, 3 años): encontrar objetos que empiecen por la misma letra, o un juego de palmadas con sílabas.
- 4 y 5 años: opciones similares con más dificultad.
- Cada semana tiene retos nuevos; no se repiten en semanas seguidas.

## 10. Nombres de la clase (solo 3 años)

- La docente sube la lista de nombres de la clase a la app desde la planificación.
- La app crea un repaso en el que los niños buscan su nombre o su inicial en la pizarra, juntos y de forma guiada.
- Función aparte, no obligatoria.

## 11. Cronograma sugerido

| Fase | Contenido | Dependencias |
|---|---|---|
| 1 | Planificador semanal (sección 1) con datos de ejemplo para la semana 1 | Confirmar roadmap y límites de conteo |
| 2 | Asamblea: repaso del cuerpo, palabra interactiva, número y lógico-matemática (secciones 3 a 5) | Situaciones de aprendizaje; confirmar 4.4 |
| 3 | Pictogramas y veo-veo fonológico (secciones 7 y 8) | Lista de palabras y sonidos por semana |
| 4 | Retos a elegir por día y por semana (sección 9) | Propuestas de retos de la semana 1 |
| 5 | Nombres de la clase en 3 años (sección 10) | Ninguna |
| 6 | Propuestas de rincones para todos los trimestres y modos (sección 2) | Situaciones de aprendizaje |

## 12. Pruebas y publicación

- Cada fase se prueba con Playwright en pizarra, portátil, móvil, iPad e iPhone (`tests/`).
- Se trabaja en una rama y se abre PR. Nada se sube a `main` sin revisión de la autora.
- Safari: los SVG llevan medidas explícitas.

## 13. Preguntas abiertas

1. ¿Qué límites de conteo se usan por edad (5/10/20 o 5/15/50)?
2. ¿Qué versión de la palabra protagonista de 3 años se queda (palmas e imagen, o palabra escrita y vocales/consonantes)?
3. ¿Quién confirma los cambios respecto a `decisiones-ui.md`? (La autora, según el `CLAUDE.md`.)
4. Situaciones de aprendizaje de los tres trimestres: pendientes de recibir.
