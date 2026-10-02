// Minimal offline cache for the app shell. Bump CACHE_NAME when you change
// any cached file so clients pick up the new version.
const CACHE_NAME = 'calmapp-shell-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './js/app.js',
  './js/router.js',
  './js/state.js',
  './js/registry.js',
  './js/icons.js',
  './js/views/nav.js',
  './js/views/home.js',
  './js/views/toolpicker.js',
  './js/views/tool.js',
  './js/views/completion.js',
  './js/views/rewards.js',
  './js/views/parent.js',
  './js/tools/breathe.js',
  './js/tools/ground.js',
  './js/tools/focus.js',
  './js/tools/checkin.js',
  './js/tools/crosstap.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
