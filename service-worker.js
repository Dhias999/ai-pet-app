const CACHE_NAME = 'ai-pet-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './face-api.min.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker インストール完了');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // 外部CDNやHTTP(S)以外のスキームはSWで割り込まない
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});