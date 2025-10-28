// Service Worker для кэширования QR-библиотек
const CACHE_NAME = 'qr-scanner-v2';
// Не кэшируем '/' (index.html), чтобы не держать старые ссылки на хэш-ассеты
const urlsToCache = [
  '/manifest.json',
  '/images/logo.png',
  // Кэшируем основные библиотеки
  'https://telegram.org/js/telegram-web-app.js'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Кэширование ресурсов');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  // Для переходов (SPA навигация) всегда сеть: не кэшируем index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')));
    return;
  }
  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('chrome-extension') ||
    event.request.url.includes('safari-extension')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          // Проверяем, что ответ не HTML для CSS/JS
          const contentType = networkResponse.headers.get('content-type') || '';
          if (
            (event.request.destination === 'style' && !contentType.includes('text/css')) ||
            (event.request.destination === 'script' && !contentType.includes('javascript'))
          ) {
            // Возвращаем пустой ответ или 404
            return new Response('', { status: 404, statusText: 'Not Found' });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        if (event.request.destination === 'image') {
          return caches.match('/images/logo.png');
        }
      })
  );
}); 