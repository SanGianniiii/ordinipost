// firebase-messaging-sw.js

// (NUOVO) Logica di caching da service-worker.js
const CACHE_NAME = 'ordini-post-v1'; // Incrementa la versione se cambi i file in cache
const urlsToCache = [
  '/ordinipost/',
  '/ordinipost/index.html',
  '/ordinipost/logo.png',
  '/ordinipost/manifest.json'
  '/panetprova/jhs.mp4'
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

// (NUOVO) Gestione click notifica da service-worker.js (prima di importare gli script FCM)
// Nota: Se vuoi definire un comportamento personalizzato per il click sulla notifica
// che sovrascriva quello di FCM, è importante metterlo qui, prima degli importScript FCM.
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notifica cliccata', event.notification.tag);
  event.notification.close();

  // Puoi aprire una URL specifica
  event.waitUntil(
    clients.openWindow('/ordinipost/');
  );
});


// -------- INIZIO LOGICA FIREBASE CLOUD MESSAGING --------

// Importa gli script Firebase, usando la stessa versione che hai in index.html
// Nota: stai usando le versioni "compat" qui, che sono compatibili con il modo in cui
// inizializzi Firebase nell'index.html. Va bene così.
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");


// Inizializza Firebase con la configurazione del tuo progetto
// Assicurati che questi parametri siano corretti per ordinipost-fcc7f
firebase.initializeApp({
  messagingSenderId: "363847145933",
  apiKey: "AIzaSyAY8l_GGRWPWi5BFpirUMXd2JN0MVZZpYM",
  projectId: "ordinipost-fcc7f",
  appId: "1:363847145933:web:d1590848833eb147590c84",
  // storageBucket: "ordinipost-fcc7f.appspot.com", // Aggiungi se è parte della tua configurazione completa
});

// Ottieni l'istanza di Firebase Messaging
const messaging = firebase.messaging();

// Gestisci i messaggi FCM quando la tua app non è in primo piano (background/chiusa)
messaging.onBackgroundMessage((payload) => {
  console.log("📦 Messaggio in background:", payload);

  // Personalizza la notifica qui
  const notificationTitle = payload.notification.title || 'Nuovo Messaggio';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: payload.notification.icon || '/logo.png', // Ho cambiato in '/logo.png' per coerenza con il resto del tuo codice e assets
    data: payload.data, // Dati aggiuntivi che potresti aver inviato con il messaggio
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
