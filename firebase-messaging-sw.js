// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA-f-B0RH9CJDsfxytIIdyBWwAxNJ4vDik",
  authDomain: "flag-x-3439d.firebaseapp.com",
  projectId: "flag-x-3439d",
  storageBucket: "flag-x-3439d.firebasestorage.app",
  messagingSenderId: "576734845240",
  appId: "1:576734845240:web:620dfc7ee7f9e7ad0149cd"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Flag-X 🔥';
  const body  = payload.notification?.body  || 'Play now to keep your streak alive!';
  self.registration.showNotification(title, {
    body,
    icon : '/favicon-96x96.png',
    badge: '/favicon-96x96.png',
    tag  : 'flagx-streak-reminder'
  });
});
