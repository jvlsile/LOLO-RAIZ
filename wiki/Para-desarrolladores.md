# Para desarrolladores

Web estática sin dependencias de ejecución: HTML, CSS y JavaScript sin frameworks. Las pruebas usan Playwright.

## Probar en local

```bash
python3 -m http.server 4173
# abre http://localhost:4173
```

## Estructura

```
index.html              Portada: elegir y lanzar juegos (css/portada.css, js/portada.js)
jugar.html              Los 32 juegos (css/estilos.css, js/app.js)
tres.html               Modo 3 años (css/tres.css, js/tres.js)
fichas.html             Fichas de trazos (css/fichas.css, js/fichas.js)
fichas-3.html           Fichas para 3 años (js/fichas-3.js)
fichas-sentidos.html    Fichas de los sentidos y registro (js/fichas-sentidos.js)
js/sentidos-dibujos.js  Dibujos de los sentidos compartidos por juegos, portada y fichas
video/                  Vídeo de cabecera de los sentidos y su imagen fija
audio/                  Guion (guion.csv) y audios grabados
fonts/, icons/          Fuentes e iconos alojados en el propio sitio
sw.js                   Modo sin conexión
manifest.webmanifest    Instalación como aplicación
tests/                  Pruebas automáticas
```

## Añadir un juego

1. Añade su id a `IDS` en `js/app.js` y su objeto en `JUEGOS` (`titulo`, `ic`, `puente` y `ronda(n, a)`).
2. Dentro de `ronda`, usa `a.z` (zona del juego), `a.ok(texto, elemento)`, `a.fallo(texto, ayuda)` y `decir(texto)`.
3. Añádelo a `CATS` e `INFO` en `js/app.js`, y a `CATS` y `JUEGOS` en `js/portada.js`.
4. Añade cómo resolverlo en `tests/juegos.spec.js` y su id en `tests/dibujos.spec.js`.

## Pruebas automáticas

```bash
npm ci
npx playwright install chromium webkit
npm test
```

Se ejecutan en cinco tamaños: **pizarra** (1920×1080), **portátil** (1366×768), **móvil** (Pixel 7), **iPad** e **iPhone** (estos dos con WebKit, el motor de Safari). Juegan cada juego de principio a fin y comprueban que no hay errores en la consola, que nada se sale a lo ancho y que ningún dibujo se sale de su tarjeta.

**Pendiente:** *El robot perdido* en iPad está marcado como pendiente (`test.fixme`): en el iPad simulado se atasca con las animaciones activas. Falta probarlo en un iPad real.

## Publicación

Cada subida a `main` ejecuta la acción **Probar y publicar**:

1. Pasa todas las pruebas (unos 45 minutos).
2. Si todo va bien, publica en GitHub Pages.
3. Añade la versión a los archivos para que las pizarras no mezclen versiones, y genera el índice de audios.

Si una prueba falla, no se publica y el informe queda en *Actions*. Si GitHub da «Internal Server Error» al subir, reintentad.

Flujo recomendado: rama nueva → *pull request* → pruebas en verde → fusionar con `main`.

## Lecciones aprendidas con Safari

En Safari (iPad e iPhone), los SVG con anchura automática calculada a partir de la altura llegaron a salirse de sus tarjetas. Dad a los dibujos **medidas explícitas** (`width` y `height`, o `aspect-ratio`), o colocadlos con posición absoluta dentro de su hueco. La prueba `tests/dibujos.spec.js` vigila este problema.

## Esta wiki

Las páginas de la wiki se editan en la carpeta [`wiki/`](https://github.com/jvlsile/VISITA-DE-LOLO-/tree/main/wiki) del repositorio. Al subir cambios a `main`, la acción **Wiki** las copia a la wiki. No editéis la wiki desde la web: los cambios se perderían en la siguiente copia.
