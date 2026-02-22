const CACHE_NAME = 'ordinipost-v3'; 
const urlsToCache = [
  '/ordinipost/',
  '/ordinipost/index.html',
  '/ordinipost/logo.png',
  '/ordinipost/manifest.json'
];

self.addEventListener('install', function(e) {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(names => Promise.all(
      names.map(n => { if (n !== CACHE_NAME) return caches.delete(n); })
    ))
  );
  return self.clients.claim(); 
});

self.addEventListener('fetch', function(e) {
  if (e.request.mode === 'navigate' || e.request.url.includes('script.google.com')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cachedResponse => {
        const fetchPromise = fetch(e.request).then(networkResponse => {
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, networkResponse.clone()));
          return networkResponse;
        }).catch(() => {}); 
        
        return cachedResponse || fetchPromise;
      })
    );
  }
});
