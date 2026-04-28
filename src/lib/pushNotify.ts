// Browser push notification helpers for the admin panel.
// Uses the Notifications API (no VAPID needed — simple local SW notification).

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return reg;
  } catch (e) {
    console.error('SW registration failed:', e);
    return null;
  }
}

export async function showAdminNotification(title: string, body: string, url = '/admin') {
  // Ensure SW is registered
  const reg = await registerServiceWorker();
  const granted = await requestNotificationPermission();
  if (!granted) return;

  if (reg) {
    // Use SW notification — works even when tab is in background
    await reg.showNotification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: { url },
      vibrate: [200, 100, 200],
      requireInteraction: true,
      tag: 'promptland-payment',
    });
  } else {
    // Fallback: plain Notification API
    new Notification(title, { body, icon: '/favicon.svg' });
  }
}
