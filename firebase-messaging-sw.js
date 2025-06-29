importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyCsdhMZqfh50Ar5Izqx-klAoMV4jvcifBo",
  authDomain: "ordinipost.firebaseapp.com",
  projectId: "ordinipost",
  storageBucket: "ordinipost.appspot.com",
  messagingSenderId: "671967993881",
  appId: "1:671967993881:web:5aaa1b15139cbee6fa4a88"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/logo.png" // Assicurati che il percorso all'icona sia corretto
  });
});
