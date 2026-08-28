// Minimal service worker — required by browsers for "Install App" eligibility.
// Data itself always comes live from Supabase; this only lets the app shell
// (index.html + icons) be installed to a home screen and load instantly.
const CACHE_NAME = 'site-pmis-shell-v1';
const SHELL_FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache-serve the app shell itself; everything else (Supabase, CDNs)
  // always goes to the network so data is never stale.
  const isShellFile = SHELL_FILES.some((f) => event.request.url.endsWith(f.replace('./', '')));
  if(isShellFile){
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});
