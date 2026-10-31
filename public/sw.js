/**
 * Service Worker — Arena iOS 27 Liquid Glass PWA
 * 
 * Caching strategy:
 * - App shell (HTML, CSS, JS): Cache-first
 * - Content/API mock data: Network-first with cache fallback
 * - Images/fonts: Cache-first with stale-while-revalidate
 */

const CACHE_NAME = 'ios27-liquid-glass-v1';
const SHELL_URLs = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/app.js',
  '/src/utils/router.js',
  '/src/utils/store.js',
  '/src/utils/i18n.js',
  '/src/utils/formatters.js',
  '/src/styles/tokens.css',
  '/src/styles/layout.css',
  '/src/styles/views.css',
  'https://unpkg.com/glassy-liquid@0.1.0/dist/elements.js',
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap',
];

const CONTENT_URL_PATTERNS = [
  '/src/data/',
  '/src/components/',
  '/src/views/',
];

// Install: precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_URLs).catch((err) => {
        console.warn('[SW] Some shell assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: temporarily bypass cache — always go to network
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Temporarily disabled: always fetch from network, no cache
  event.respondWith(fetch(request));
});

/**
 * Cache-first strategy: try cache, fall back to network
 */
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) return cached;
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    console.warn('[SW] cacheFirst failed:', err);
    // Return a minimal offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    throw err;
  }
}

/**
 * Network-first strategy: try network, fall back to cache
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw err;
  }
}
