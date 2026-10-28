// Service worker — simpan fail app supaya cepat dibuka
const CACHE = 'km-v1';
const FAIL = ['./', 'index.html', 'bos.html', 'manifest-anggota.json', 'manifest-bos.json',
  'icons/anggota-192.png', 'icons/anggota-512.png', 'icons/bos-192.png', 'icons/bos-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FAIL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;  // data → terus ke Google
  if (req.mode === 'navigate') {   // halaman: cuba internet dulu (supaya sentiasa versi terkini)
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
