self.addEventListener('install', (event) => {
    console.log('Service Worker インストール完了');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (event) => {
    // 外部CDN（unpkgなど）へのリクエストはService Workerで処理せず、そのままブラウザに任せる
    if (event.request.url.includes('unpkg.com')) {
        return; 
    }

    // その他のリクエスト
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});