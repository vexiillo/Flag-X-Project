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

// 3. Fetch: Strategi Campuran (Network-First untuk Kode, Cache-First untuk Gambar)
self.addEventListener('fetch', (event) => {
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
  // B. STRATEGI FILE UTAMA (Network-First: Cek Internet dulu baru Cache)
  else {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Jika internet ok, simpan hasil terbaru ke cache
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Jika internet mati (offline), baru ambil dari memori
          return caches.match(event.request);
        })
    );
  }
});
