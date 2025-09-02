const CACHE_NAME = 'leen-coffee-v1';
const RUNTIME = 'runtime-cache-v1';

const PRECACHE_URLS = [
  '/', // index.html
  '/offline.html',
  '/assets/css/style.css',
  '/assets/js/app.js',
  '/assets/img/hero.jpg',
  '/assets/img/hero.jpg', // duplicate OK
  '/manifest.json'
  // أضف هنا أي ملفات ثابتة أخرى تريدها (fonts, icons, logo...)
];

// Install - pre-cache static assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

// Activate - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME && key !== RUNTIME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// Fetch - Strategie: Cache-first for precache, Network-first for API/menu json, fallback to offline.html
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't handle non-GET
  if (request.method !== 'GET') return;

  // Handle navigation requests -> return cached index or offline fallback
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Update cache with fresh page
          const copy = response.clone();
          caches.open(RUNTIME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/offline.html')))
    );
    return;
  }

  // For menu.json or API requests -> network-first then cache
  if (url.pathname.endsWith('/data/menu.json') || url.pathname.endsWith('/data/config.json')) {
    event.respondWith(
      fetch(request).then(res => {
        const copy = res.clone();
        caches.open(RUNTIME).then(cache => cache.put(request, copy));
        return res;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // For images -> cache-first
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(fetchRes => {
        caches.open(RUNTIME).then(cache => cache.put(request, fetchRes.clone()));
        return fetchRes;
      })).catch(() => caches.match('/assets/img/hero.jpg'))
    );
    return;
  }

  // Default: try cache, then network, then fallback
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(fetchRes => {
      caches.open(RUNTIME).then(cache => cache.put(request, fetchRes.clone()));
      return fetchRes;
    })).catch(() => {
      // For fonts/CSS/images maybe return fallback or nothing
      if (request.headers.get('accept').includes('text/css')) return caches.match('/assets/css/style.css');
      return caches.match('/offline.html');
    })
  );
});

// Listen for skipWaiting message to update immediately
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
