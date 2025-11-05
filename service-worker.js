self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('ordini-post').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/logo.png',
        '/manifest.json'
      ]);
    })
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
    clients.openWindow('/') // oppure pagina specifica
  );
});
