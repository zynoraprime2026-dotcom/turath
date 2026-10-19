// Turath service worker: network-first shell so updates land immediately; cache keeps offline use.
const CACHE = 'turath-v6';
const SHELL = ['/', '/app.js', '/style.css', '/config.js', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];
const PRECACHED = ['/', '/app.js', '/style.css', '/config.js', '/manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/m/') || url.pathname.startsWith('/e/')) return;
  const isShell = PRECACHED.some(p => url.pathname === p || url.pathname === '/index.html');
  const isIcon = /\.(png|jpg|jpeg|svg|webp)$/.test(url.pathname);
  if (isIcon) {
    // icons rarely change: cache-first
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
    })));
    return;
  }
  if (!isShell) {
    // other same-origin assets: cache-first with network fill (current behaviour)
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || fetch(e.request).then(r => {
        const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
      })
    ));
    return;
  }
  // shell: network-first, fall back to cache when offline
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(hit => hit || caches.match('/')))
  );
});
