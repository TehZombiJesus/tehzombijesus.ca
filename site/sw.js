/* Service worker: makes the site installable and readable offline.
   Pages always come from the network first, so a new version shows up right away.
   The cache is only a fallback for when there is no connection. Live data (/api/) is never cached. */
const CACHE = 'tzj-v2';
const CORE = ['/', '/offline.html', '/styles.css', '/site.js', '/extras.js', '/assets/favicon.svg', '/assets/avatar.webp', '/assets/wordmark.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/') || url.pathname.startsWith('/guestbook-admin')) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('/offline.html') : Response.error())))
  );
});
