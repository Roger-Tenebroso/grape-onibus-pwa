const CACHE_NAME = 'grape-cache-v1';
const urlsToCache = [
  '/',
  '/Pagina-inicial.html',
  '/Página para edição de valores.html',
  '/Página inicial.css',
  '/Página para edição de valores.css',
  '/Página inicial.js',
  '/Página para edição de valores.js',
  '/Icones/LogoApp.png',
  '/Icones/LogoApp2.png',
  '/Icones/IconeCalendario.svg',
  '/Icones/IconeRelogio.svg',
  '/Icones/IconeVoltar.svg',
  '/Icones/Menos Icone.svg',
  '/Icones/Piracicabana Icone.svg',
  '/Icones/Sou Americana Icone.svg',
  '/Icones/Sou Limeira Icone.svg',
  '/manifest.json',
  '/Fontes/static/Sen-Regular.woff2',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim(); 
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
