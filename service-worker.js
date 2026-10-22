self.addEventListener('install', (event) => {
    console.log('Service Worker 登録完了');
});

self.addEventListener('fetch', (event) => {
    // 通信をそのまま通すシンプルな設定
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});