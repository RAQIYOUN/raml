// هر بار که آپدیت جدیدی منتشر می‌کنید، فقط همین عدد را زیاد کنید
const CACHE_VERSION = 'v6.0.0';
const CACHE_NAME = `niyat-ramal-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// نصب: نسخه‌ی جدید فوراً منتظر نمی‌ماند، فایل‌های پایه را کش می‌کند
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// فعال‌سازی: تمام کش‌های نسخه‌ی قبلی پاک می‌شوند و کنترل صفحه فوراً گرفته می‌شود
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// درخواست‌ها: همیشه اول از شبکه بگیر (network-first)؛ فقط وقتی آفلاین بود از کش بده
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
