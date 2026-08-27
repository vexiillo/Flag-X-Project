// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAlBxWNXoeMgAv4v_B6PP5Xu3KhBm5cWlg",
  authDomain: "flag-x-project.firebaseapp.com",
  projectId: "flag-x-project",
  storageBucket: "flag-x-project.firebasestorage.app",
  messagingSenderId: "757798247535",
  appId: "1:757798247535:web:0462758fe10800f88d419a"
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
