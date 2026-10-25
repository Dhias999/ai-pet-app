const CACHE_NAME = 'ai-pet-cache-v2'; // キャッシュを更新するためバージョンを上げる

// キャッシュするローカル資産のリスト
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './face-api.min.js',
  './manifest.json',
  // --- models フォルダ内の 7 ファイル ---
  './models/tiny_face_detector_model-weights_manifest.json',
  './models/tiny_face_detector_model-shard1',
  './models/face_landmark_68_model-weights_manifest.json',
  './models/face_landmark_68_model-shard1',
  './models/face_recognition_model-weights_manifest.json',
  './models/face_recognition_model-shard1',
  './models/face_recognition_model-shard2'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker インストール中...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker 有効化・キャッシュ整理中...');
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
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // キャッシュに存在すればそれを返す（オフライン・高速読み込み対応）
                return cachedResponse;
            }
            // キャッシュに無ければネットワークから取得
            return fetch(event.request);
        })
    );
});