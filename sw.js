// Keeps the game playable offline. Change VERSION whenever the game files change.
const VERSION = 'naseer-crew-2026-11-12-2';
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./apple-touch-icon.png", "./fredoka-latin-400-normal.woff2", "./fredoka-latin-500-normal.woff2", "./fredoka-latin-600-normal.woff2", "./fredoka-latin-700-normal.woff2", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./lilita-one-latin-400-normal.woff2"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') { // newest page when online, saved copy when offline
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put('./index.html', copy)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
