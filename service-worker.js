// Eknomix ERP Lite — minimal service worker.
//
// Deliberately does NOT cache or serve the app's HTML/data offline. For an accounting app,
// silently serving a stale cached copy of the page (with outdated logic, or worse, stale-looking
// numbers) is more dangerous than just requiring a network connection to load. Its only job is
// to exist and register cleanly — that's what lets mobile browsers (Android Chrome in particular)
// recognize the app as a genuine installable PWA and offer a real "Install App" / "Add to Home
// Screen" experience, instead of just a plain bookmark shortcut.
//
// If true offline support is ever wanted later, this is the place to add a cache-first strategy
// for the static shell — but that's a deliberate future decision, not a default.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Pass every request straight through to the network — no caching, no offline fallback.
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
