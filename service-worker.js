// Eknomix ERP Lite — service worker
// Bump CACHE_VERSION whenever index.html changes so installed devices pick up the update instead
// of being stuck on a stale cached copy — this is the one line to change on every deploy.
const CACHE_VERSION = 'eknomix-erp-v1';
const APP_SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for the app shell itself — an actively-developed app should show the latest
// version whenever the device is online, not a stale install; falls back to the cached copy the
// moment there's no connection, which is what actually makes "installed" mean "works offline."
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});

// Lets the page ask the service worker to nudge a sync retry once connectivity returns —
// the app's own sync engine listens for this via navigator.serviceWorker's message event.
self.addEventListener('sync', (event) => {
  if (event.tag === 'flush-sync-queue') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage({ type: 'FLUSH_SYNC_QUEUE' }));
      })
    );
  }
});
