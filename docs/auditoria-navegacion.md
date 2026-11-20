# Auditoría de navegación y coherencia (LOLO-RAIZ)

Revisión hecha antes de mostrar la versión a la autora. Lo arreglado va en la rama `roadmap-planificacion`. Lo que cambia el diseño o la estructura queda como propuesta: el `CLAUDE.md` pide acordarlo antes.

## Arreglado

- **La planificación no llegaba a la asamblea.** Lo programado por día (palabra, número, reto y rincones) ahora se usa en la asamblea del mismo día, del mismo trimestre y de la misma edad. Lo que la docente cambia en Preparar sigue mandando por encima.
- **Dos formas de elegir la edad.** La planificación tenía su propia clave. Ahora usa la misma que el resto de la app (`raiz-edad`).

## Propuesta (necesita acuerdo con la autora)

1. **Páginas sin menú lateral.** `tres.html` y las cuatro páginas de fichas no tienen menú ni enlace a Hoy o Asamblea. Desde ellas solo se vuelve con el botón atrás del navegador. Propuesta: añadir el mismo menú lateral.
2. **La portada (`index.html`) no tiene menú.** Es la entrada principal; tiene enlaces, pero no el menú de las demás páginas.
3. **Título de Planificación.** Dice «Planificación por trimestre», pero ahora la página también planifica la semana. Propuesta: «Planificación de la semana».
4. **Tres lugares para la edad con estilos distintos.** La asamblea y Planificación usan botones de edad de estilos distintos. Propuesta: el mismo componente.
5. **Trimestre.** La asamblea calcula el trimestre por la fecha; la planificación deja elegirlo. Como las propuestas se guardan por trimestre, cada día usa el suyo, pero conviene confirmarlo con la autora.
6. **Palabra sin sílabas.** Si la docente escribe una palabra sin guiones, la asamblea la trata como una sola sílaba. Propuesta: separar sílabas automáticamente o pedirlas al escribirla.

## Pendiente de datos

- Límite de conteo por edad (5/15/50 o 5/10/20).
- Situaciones de aprendizaje de los tres trimestres.
- Imágenes ARASAAC para pictogramas y veo-veo.
