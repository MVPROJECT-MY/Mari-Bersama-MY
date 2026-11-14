/* Service worker Mari Bersama: boleh dibuka tanpa internet selepas dimuat sekali.
   Tukar nombor VERSI jika mahu paksa cache lama dibersihkan. */
const VERSI = 'mb-v8';
const SHELL = ['./', 'index.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSI).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);

  // Halaman: ambil versi terbaru dari rangkaian, guna cache jika offline
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r)
        .then(res => { const cp = res.clone(); caches.open(VERSI).then(c => c.put('index.html', cp)); return res; })
        .catch(() => caches.match('index.html'))
    );
    return;
  }

  // Fail sendiri (ikon, manifest): rangkaian dahulu, cache jika offline
  if (u.origin === location.origin) {
    e.respondWith(
      fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(VERSI).then(c => c.put(r, cp)); } return res; })
        .catch(() => caches.match(r))
    );
    return;
  }

  // Gambar bendera: simpan supaya boleh dilihat offline
  if (u.hostname === 'flagcdn.com') {
    e.respondWith(caches.open(VERSI).then(async c => {
      const h = await c.match(r.url);
      if (h) return h;
      try {
        const res = await fetch(r);
        fetch(r.url, { mode: 'cors' }).then(x => { if (x.ok) c.put(r.url, x); }).catch(() => {});
        return res;
      } catch (err) {
        return Response.error();
      }
    }));
    return;
  }

  // Pustaka Firebase: cache supaya muat lebih laju
  if (u.hostname === 'www.gstatic.com' && u.pathname.startsWith('/firebasejs/')) {
    e.respondWith(caches.open(VERSI).then(async c => {
      const h = await c.match(r);
      if (h) return h;
      const res = await fetch(r);
      if (res.ok) c.put(r, res.clone());
      return res;
    }));
  }
  // Selain itu (Firestore, Auth, dll.) tidak disentuh.
});
