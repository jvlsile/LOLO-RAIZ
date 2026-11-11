# Decisiones de la nueva versión (LOLO-RAIZ)

Documento de acuerdos con la autora. Recoge lo decidido y, al final, el estado de lo construido.
Cualquier cambio de estos acuerdos se habla antes con ella.

## Contexto de uso

- Aula de 3 años B: 22 alumnos, 3 con autismo severo, 1 con TDAH, 1 con TDL, 1 con problemas de conducta.
- También la usarán compañeras de 4 y 5 años (26 alumnos por aula).
- La pizarra digital falla: la maestra maneja todo desde el ordenador (Chrome). Botones grandes, tecla espacio para avanzar, nada que dependa de arrastrar con el dedo.
- Uso en pizarra: unos 40 minutos al día.

## Estructura general

- Dos modos: **Clase** y **Preparar**.
- Barra fija con la edad (3 · 4 · 5) y el tema del trimestre. La edad se elige una vez para toda la app y se puede subir o bajar el nivel durante un juego.
- **Preparar**: sin protección, con un botón discreto en una esquina.
- Pantalla base **HOY**: la agenda visual de la clase (pictogramas ARASAAC, horario según día de la semana, el encargado marca lo hecho, sin reloj, puede quedar visible todo el día, imprimible).
- **Agenda durante los juegos**: franja fina arriba.

## Asamblea

- Se abre como **recorrido guiado** y tiene además **menú lateral** para saltar a cualquier bloque. Cada bloque es saltable.
- Orden: saludo → fecha → agenda → trazo → palabra protagonista → número protagonista → pregunta reto → tres rincones → despedida.
- Duración: rutina de unos 25 minutos; el resto de los 40 se llena con juegos del tema.
- Anticipación (autismo): cada bloque lleva siempre el mismo pictograma, en el mismo sitio y con los mismos sonidos. Sin animaciones ni cambios bruscos.
- La app guarda la palabra, el número y el trazo de cada día para el registro semanal imprimible y la rutina de la semana siguiente.

## Contenido por edad

| | 3 años | 4 años | 5 años |
|---|---|---|---|
| Trazo | «El Tronco» (nombres del Método Raíz) | vocales y consonantes en mayúscula | vocales y consonantes en minúscula |
| Palabra | palmas de sílabas, imagen, decir las vocales (vocales en mayúscula) | nº de sílabas, letras, vocales (azul) y consonantes (rojo), mayúscula | minúscula, frase hecha entre todos, signos gramaticales |
| Número | hasta 5, en orden de calendario | hasta 15, anterior y posterior, sumas dibujadas | hasta 50, sumas y restas de una cifra sin llevadas |

- Pauta en las tres edades: copa · tronco · raíces.
- Temas: T1 el cuerpo, T2 los alimentos, T3 la calle.

## Pendiente de la autora

- Horario semanal real.
- Consonantes en mayúscula de 4 años y orden completo de letras de 5 años.
- Letras con rabillo, musicograma y guía de materiales manipulativos.

## Fases previstas

1. Edades: ajuste único de edad, tres niveles reales por juego, vocales en mayúscula en burbujas (3 años), memoria visible más tiempo (3 años), corregir la frase de «la flor huele mal».
2. Asamblea y agenda.
3. Temas por trimestre, planificación semanal, imprimibles y registros por áreas con la Orden de Andalucía.

## Estilo visual elegido: «Aula luminosa» (propuesta B)

Elegido por la autora entre tres propuestas (A «Mar sereno», B «Aula luminosa», C «Escenario») por ser la más profesional y educativa. Propuestas dibujadas en el lienzo «Lolo Raíz · propuestas de interfaz».

- **Fondo** claro y cálido (papel, `#F6F2E9`). Se abandona el mar fijo con rayos, burbujas y algas.
- **Una sola barra arriba**, blanca y fina, con filete: volver, nombre del juego y su categoría, selector de nivel y botón «⋯» con Voz, Modo tranquilo, Rincón de la calma y Guía docente.
- **Franja de retos** debajo de la barra: «Reto 2 de 5» y cinco trazos finos.
- **El juego, en una sola tarjeta blanca** con filete fino y sombra suave, lo más grande posible.
- **Lolo pequeño**, junto a la pregunta que formula, y no como columna lateral.
- **Formas más sobrias:** botones y zonas con esquinas de unos 14–26 px (ya no píldoras); filetes de 1,5 px en vez de sombras marcadas.
- **Color:** tinta marina para el texto, un solo acento por categoría (etiqueta y trazo del reto actual) y el naranja de Lolo reservado para Lolo.
- **Tipografía:** Fredoka para lo que se dice y se toca; Nunito para lo que lee la maestra.
- **Estado:** solo hay dibujos de la pantalla «Cuenta y toca»; falta dibujar HOY, asamblea, menú de juegos y Preparar en este estilo antes de tocar la app.

## Estado de lo construido (noviembre de 2026)

Todo está en ramas encadenadas (PR #4 a #12); se fusionan en orden.

| Pieza | Página | Estado |
|---|---|---|
| Aspecto «Aula luminosa» en juegos, portada, modo 3 años y fichas | `jugar.html`, `index.html`, `tres.html`, `fichas*.html` | Hecho (solo color y fondo en portada, 3 años y fichas) |
| Agenda visual del día, con marcas del encargado e imprimir | `hoy.html` | Hecho. Dibujos y horario de ejemplo |
| Preparar: agenda por día, asamblea del día y copia de seguridad | `preparar.html` | Hecho. Sin contraseña. Todo en el navegador (prefijo `raiz-`) |
| Asamblea guiada con menú lateral | `asamblea.html` | Hecho. Contenido por edad según la tabla de arriba |
| Registro semanal imprimible | `registro.html` | Hecho. Se rellena al llegar a la despedida |
| Planificación por trimestre y áreas | `planificacion.html` | Hecho. Reparto de áreas orientativo |
| Niveles reales por edad | juegos | Cuenta, parejas, series, cestas, tamaños, formas, castañas, construye, robot y hojas |
| La tinta de Lolo | `jugar.html#tinta` | 8 trazos; con 4 años, además, vocales en mayúscula |

### Pendiente
- Horario semanal real y pictogramas de ARASAAC (licencia CC BY-NC-SA) en HOY.
- Consonantes en mayúscula de 4 años; orden completo de letras y minúsculas con rabillo de 5 años (La tinta y trazo de la asamblea).
- Revisar las listas de palabras y preguntas reto por tema (las propuso la app).
- Niveles reales en el resto de juegos (cuento, caza, escape, duo, sentidos, cuerpo…): se hacen donde tengan algo que graduar.
- Aspecto «Aula luminosa» más a fondo en el modo 3 años (formas y tarjetas) y en las fichas.
- Prueba real en pizarra y en iPad; grabación de audios.
