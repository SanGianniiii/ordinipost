// firebase-messaging-sw.js

const CACHE_NAME = 'ordini-post-v1'; 
const urlsToCache = [
  'index.html',     // Rimosso lo slash iniziale (/)
  'logo.png',       // Rimosso lo slash iniziale (/)
  'manifest.json'   // Rimosso lo slash iniziale (/)
  // Rimosso il percorso radice '/' che è problematico
];

self.addEventListener('install', function(e) {
  console.log('[SW] Installazione Service Worker');
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Caching assets');
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting()) 
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
    }).then(() => self.clients.claim()) 
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
  console.log('[SW] Notifica cliccata', event.notification.tag);
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/') 
  );
});


// -------- INIZIO LOGICA FIREBASE CLOUD MESSAGING --------

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");


// Inizializza Firebase con la configurazione del tuo progetto
firebase.initializeApp({
  messagingSenderId: "363847145933",
  apiKey: "AIzaSyAY8l_GGRWPWi5BFpirUMXd2JN0MVZZpYM",
  projectId: "ordinipost-fcc7f",
  appId: "1:363847145933:web:d1590848833eb147590c84",
});

const messaging = firebase.messaging();

// Gestisci i messaggi FCM quando la tua app non è in primo piano (background/chiusa)
messaging.onBackgroundMessage((payload) => {
  console.log("📦 Messaggio in background:", payload);

  const notificationTitle = payload.notification.title || 'Nuovo Messaggio';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: payload.notification.icon || '/logo.png',
    data: payload.data, 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
