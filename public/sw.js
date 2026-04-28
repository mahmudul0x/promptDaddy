// PromptLand Service Worker — handles background push notifications
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try { payload = event.data.json(); }
  catch { payload = { title: 'PromptLand', body: event.data.text() }; }

  const { title = 'PromptLand', body = '', icon, url = '/admin' } = payload;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon ?? '/favicon.svg',
      badge: '/favicon.svg',
      data: { url },
      vibrate: [200, 100, 200],
      requireInteraction: true,   // stays visible until dismissed
      tag: 'promptland-payment',  // replaces previous notification instead of stacking
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/admin';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus existing tab if open, else open new one
      const existing = clients.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus().then((c) => c.navigate(url));
      return self.clients.openWindow(url);
    })
  );
});
