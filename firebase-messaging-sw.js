// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  messagingSenderId: "363847145933",
  apiKey: "AIzaSyAY8l_GGRWPWi5BFpirUMXd2JN0MVZZpYM",
  projectId: "ordinipost-fcc7f",
  appId: "1:363847145933:web:d1590848833eb147590c84",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📦 Messaggio in background:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
