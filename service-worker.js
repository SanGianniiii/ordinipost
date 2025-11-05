const CACHE_NAME = 'ordini-post-v2'; // Ho incrementato la versione per assicurare l'aggiornamento
const urlsToCache = [
  '/',
  '/index.html',
  '/logo.png',
  '/manifest.json',
  // Aggiungi qui altri file statici che vuoi mettere in cache
];

self.addEventListener('install', function(e) {
  console.log('[SW] Installazione Service Worker');
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Caching assets');
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting()) // Attiva il nuovo SW immediatamente
  );
});

self.addEventListener('activate', function(e) {
  console.log('[SW] Attivazione Service Worker');
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Eliminazione vecchia cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Permette al nuovo SW di prendere il controllo immediatamente
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') 
  );
});
