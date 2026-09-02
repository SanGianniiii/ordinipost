importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAY8l_GGRWPWi5BFpirUMXd2JN0MVZZpYM",
  authDomain: "ordinipost-fcc7f.firebaseapp.com",
  projectId: "ordinipost-fcc7f",
  storageBucket: "ordinipost-fcc7f.firebasestorage.app",
  messagingSenderId: "363847145933",
  appId: "1:363847145933:web:d1590848833eb147590c84"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/logo.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
