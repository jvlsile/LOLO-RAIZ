# Lista de comprobación para pasar a producción

## Hecho

- [x] Los 18 juegos se completan de principio a fin en pruebas automáticas (pizarra, portátil y móvil).
- [x] No hay errores en la consola.
- [x] Nada se sale de la pantalla a lo ancho en ningún juego.
- [x] Fuentes alojadas en el propio sitio: no hay peticiones a Google ni a otros terceros.
- [x] Modo sin conexión: después de la primera visita, funciona sin internet.
- [x] Se puede instalar como aplicación en tablets (manifiesto e iconos).
- [x] Publicación automática solo si pasan las pruebas.

## Por probar en el aula (no se puede automatizar)

- [ ] **Pizarra digital real**: que tocar y arrastrar con el dedo o el lápiz funcione bien en la marca del centro.
- [ ] **Voz**: en la pizarra, abrir el botón Voz y elegir una voz natural (★). Si no hay ninguna, usar Microsoft Edge.
- [ ] **Sonidos**: los instrumentos del Mini-escape y del jueves suenan por los altavoces del aula.
- [ ] **Tablet** (iPad o Android): instalar con «Añadir a pantalla de inicio» y probar sin wifi.
- [ ] **Robot de suelo**: comprobar con el Bee-Bot que los programas de los 5 mapas se pueden reproducir en el tapete.
- [ ] **Experimentos**: preparar el barreño y los objetos (piedra, corcho, llave, hoja, moneda, esponja) y las pinturas.

## Revisión docente

- [ ] Revisar los textos de Lolo, las situaciones de Las emociones de Lolo y el cuento.
- [ ] Acordar con el EOE, PT/AL y la familia los apoyos concretos para el alumno con autismo, y preparar la agenda en papel con los mismos pictogramas.
- [ ] Confirmar que las referencias normativas de la guía docente siguen vigentes.

## Decisiones pendientes

- [ ] **Licencia**: decidir si se comparte como recurso abierto (por ejemplo, CC BY-NC-SA) o se reservan los derechos, y añadir un archivo `LICENSE`.
- [ ] **Dominio propio** (opcional): GitHub Pages permite usar una dirección del centro.
- [ ] **Voz grabada** (opcional): sustituir la voz del navegador por audios grabados con voz humana.

## Cómo publicar una versión nueva

1. Haz los cambios y súbelos a una rama nueva.
2. Abre una *pull request*. Las pruebas se ejecutan solas.
3. Si están en verde, fusiona con `main`. La web se publica sola en unos minutos.
4. Las pizarras que ya tenían la web reciben la versión nueva la próxima vez que la abran con conexión.
