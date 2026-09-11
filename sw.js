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
  const title = payload.data?.title || 'Flag-X 🔥';
  const body  = payload.data?.body  || 'Play now to keep your streak alive!';
  const link  = payload.data?.link  || 'https://flag-x-project.pages.dev';
  self.registration.showNotification(title, {
    body,
    icon : payload.data?.icon || '/favicon-96x96.png',
    badge: '/favicon-96x96.png',
    tag  : 'flagx-streak-reminder',
    data : { url: link }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || 'https://flag-x-project.pages.dev';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      const found = clientsArr.some((wc) => { if (wc.url === url) { wc.focus(); return true; } return false; });
      if (!found) clients.openWindow(url);
    })
  );
});

const CACHE_NAME = 'flag-x-cache-final'; // Biarkan namanya tetap ini selamanya
const IMAGE_CACHE_NAME = 'flag-x-images-v1';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './flagsData.js'
];

// 1. Install: Simpan file inti
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// 2. Activate: Bersihkan sisa-sisa cache v1/v2 yang lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Hapus semua cache lama KECUALI cache final dan cache gambar
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Batas waktu tunggu network sebelum nyerah — dipakai kalau TIDAK ada cache
// sama sekali (mis. request pertama kali) sehingga tetap harus nunggu network.
const NETWORK_TIMEOUT_MS = 6000;
function fetchWithTimeout(request, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(request, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

// 3. Fetch: Strategi Campuran (Stale-While-Revalidate untuk Kode, Cache-First untuk Gambar)
self.addEventListener('fetch', (event) => {
  // PATCH 5: Cache API cuma boleh nyimpen request method GET (POST/PUT/PATCH
  // bikin cache.put() throw). Request non-GET (refresh token Firebase Auth,
  // getDoc/setDoc/getCountFromServer Firestore, dll) HARUS dilewatin langsung
  // ke network tanpa disentuh sama sekali oleh SW ini.
  if (event.request.method !== 'GET') {
    return; // biarin browser handle fetch ini secara normal, SW gak ikut campur
  }

  const url = new URL(event.request.url);

  // A. STRATEGI GAMBAR (Tetap Cache-First sesuai keinginanmu)
  if (event.request.destination === 'image' || url.hostname.includes('wikimedia.org')) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } 
  // B. STRATEGI FILE UTAMA (Stale-While-Revalidate: kasih cache LANGSUNG kalau
  // ada, update cache di belakang layar. Ini yang bikin app gak pernah nunggu
  // network pas dibuka lagi dari background — beda dari network-first sebelumnya
  // yang bisa nyangkut ~6 detik PER FILE pas radio device belum nyambung ulang.)
  else {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
          const networkFetch = fetchWithTimeout(event.request, NETWORK_TIMEOUT_MS)
            .then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
            .catch(() => cachedResponse);

          // Ada di cache? Kasih itu SEKARANG JUGA, gak usah nunggu network.
          // Network tetap jalan di belakang layar buat update cache sesi berikutnya.
          return cachedResponse || networkFetch;
        })
      )
    );
  }
});
