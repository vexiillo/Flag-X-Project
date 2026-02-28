const CACHE_NAME = 'flag-x-cache-v2'; // <-- UBAH: v1 jadi v2. Nanti kalau update web lagi, ubah ke v3, dst.
const IMAGE_CACHE_NAME = 'flag-x-images-v1';

// File utama yang harus ada agar web bisa jalan offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './flagsData.js'
];

// Install: Simpan file inti
self.addEventListener('install', (event) => {
  self.skipWaiting(); // <-- TAMBAHAN: Memaksa Service Worker baru langsung aktif tanpa nunggu tab ditutup
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate: Bersihkan cache versi lama (TAMBAHAN BARU)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Hapus cache utama yang lama (v1), tapi biarkan cache gambar tetap aman
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // <-- TAMBAHAN: Langsung ambil alih halaman web saat itu juga
  );
});

// Fetch: Strategi Cache-First untuk Gambar (TIDAK DIUTAK-ATIK SAMA SEKALI)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Jika yang direquest adalah gambar (dari wikimedia atau lokal)
  if (event.request.destination === 'image' || url.hostname.includes('wikimedia.org')) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          // Balas pakai cache kalau ada, kalau tidak baru ambil ke internet
          return response || fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // Untuk file selain gambar (script/html), ambil dari cache dulu baru network
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});
