/* Modo sin conexión de La visita de Lolo · versión de pruebas LOLO-RAIZ.
   Usa el prefijo «raiz-» para no tocar la caché de la app de clase, que está en el mismo dominio.
   La versión se sustituye automáticamente en cada despliegue (ver .github/workflows/publicar.yml). */
const VERSION = 'raiz-dev';
const ARCHIVOS = [
  './', 'index.html', 'jugar.html', 'fichas.html', 'tres.html', 'fichas-3.html', 'css/tres.css', 'js/tres.js', 'js/fichas-3.js', 'css/portada.css', 'js/portada.js', 'css/fichas.css', 'js/fichas.js', 'css/estilos.css',
  'css/aula-portada.css', 'css/aula.css', 'js/app.js', 'js/sentidos-dibujos.js', 'fichas-sentidos.html', 'js/fichas-sentidos.js', 'js/cuerpo-dibujos.js', 'fichas-cuerpo.html', 'js/fichas-cuerpo.js', 'video/lolo-sentidos.jpg', 'manifest.webmanifest', 'audio/frases.json',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'fonts/fredoka-latin-500-normal.woff2', 'fonts/fredoka-latin-600-normal.woff2', 'fonts/fredoka-latin-700-normal.woff2',
  'fonts/nunito-latin-600-normal.woff2', 'fonts/nunito-latin-700-normal.woff2', 'fonts/nunito-latin-800-normal.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('raiz-') && k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/* Red primero para la página (así se ven las actualizaciones), caché si no hay conexión. */
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(VERSION).then(k => k.put(r, c)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => {
    if (res.status === 200) { const c = res.clone(); caches.open(VERSION).then(k => k.put(r, c)); }
    return res;
  })));
});
