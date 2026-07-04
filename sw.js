const CACHE_NAME = 'portfolio-cache-v3';
// Keep a minimal set of core static assets only. Avoid precaching `index.html` so
// the service worker won't serve a stale HTML that references removed hashed
// chunks after a deploy. `index.html` will be cached when fetched from the
// network (navigation handler) to support offline, but not during install.
const CORE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/vite.svg',
];

// Ensure the new service worker takes control ASAP
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  // Claim clients immediately so the updated SW is used without a reload
  event.waitUntil(
    (async () => {
      await clients.claim();
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));

      // Notify all controlled clients that a new service worker is active so
      // they can reload and pick up fresh assets (prevents serving a cached
      // index.html that references chunks that no longer exist on the server).
      const allClients = await clients.matchAll({ type: 'window' });
      for (const client of allClients) {
        try {
          client.postMessage({ type: 'SW_UPDATED' });
        } catch (e) {
          // ignore
        }
      }
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // For navigations (SPA) and index.html, use network-first so we always
  // attempt to get the latest HTML that references current chunk names.
  if (request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update the cache with the fresh index.html
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Cache-first for same-origin static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // Cache successful GET responses for offline use
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
