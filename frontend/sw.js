const CACHE_NAME = 'mel-pares-v3';
const ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/api.js',
    '/modules/inicio.js',
    '/modules/ruta.js',
    '/modules/comparador.js',
    '/modules/aprendizaje.js',
    '/modules/inclusion.js',
    '/modules/territorio.js',
    '/modules/evidencia.js',
    '/manifest.json',
    '/logos/eu-unep-partnership.png',
    '/logos/un-environment.png',
    '/logos/eu-funded.png',
    '/logos/catie.png',
];

// Install: cache shell assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: network-first for API, cache-first for assets
self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    if (url.pathname.startsWith('/api/')) {
        // Network-first for API calls
        e.respondWith(
            fetch(e.request)
                .catch(() => caches.match(e.request))
        );
    } else {
        // Cache-first for static assets
        e.respondWith(
            caches.match(e.request).then(cached => cached || fetch(e.request))
        );
    }
});
