// Service worker: makes the app installable AND lets it boot with zero
// connectivity after the first successful visit.
//
// Strategy:
//  - App shell (index.html, manifest, icons): cache-first, always available offline.
//  - CDN libraries (React, Babel, Chart.js, Supabase client): cache the first
//    time they're fetched successfully, then serve from cache on every
//    subsequent load — including fully offline cold starts.
//  - Supabase API calls (*.supabase.co): NEVER intercepted or cached here.
//    The app's own JS layer (local cache + offline mutation queue) handles
//    those — this service worker only concerns itself with the app's code,
//    not its data.
const SHELL_CACHE = 'site-pmis-shell-v2';
const RUNTIME_CACHE = 'site-pmis-runtime-v2';
const SHELL_FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
const CDN_HOSTS = ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_FILES)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never touch Supabase requests — always live, never cached here.
  if(url.hostname.endsWith('.supabase.co')) return;

  const isShellFile = SHELL_FILES.some((f) => event.request.url.endsWith(f.replace('./', '')));
  if(isShellFile){
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
    return;
  }

  const isCDN = CDN_HOSTS.includes(url.hostname);
  if(isCDN){
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if(cached) return cached;
        try{
          const resp = await fetch(event.request);
          if(resp && resp.status === 200) cache.put(event.request, resp.clone());
          return resp;
        }catch(e){
          return cached || Response.error();
        }
      })
    );
  }
});
