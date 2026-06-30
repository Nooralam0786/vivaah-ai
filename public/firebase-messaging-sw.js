/**
 * Firebase Messaging Service Worker
 * Handles background push notifications when VivaahAI is not in the foreground.
 *
 * This file MUST be at /public/firebase-messaging-sw.js so it is served from
 * the root scope (/) of the site.
 */

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Firebase config is sent from the main app via postMessage after SW registration.
// Store it here so initializeApp can use it.
self.__FIREBASE_CONFIG = self.__FIREBASE_CONFIG || null;

self.addEventListener('message', (event) => {
  if (event.data?.type === '__FIREBASE_CONFIG__' && event.data.config?.apiKey) {
    self.__FIREBASE_CONFIG = event.data.config;
    if (firebase.apps.length === 0) {
      firebase.initializeApp(self.__FIREBASE_CONFIG);
    }
  }
});

// Initialise immediately if config was already injected (e.g., SW update)
if (self.__FIREBASE_CONFIG?.apiKey && firebase.apps.length === 0) {
  firebase.initializeApp(self.__FIREBASE_CONFIG);
}

const messaging = firebase.messaging();

// Background message handler — shown when app is in background / closed
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification ?? {};
  if (!title) return;

  const link = payload.data?.link ?? '/';

  self.registration.showNotification(title, {
    body:    body    ?? '',
    icon:    icon    ?? '/icons/icon-192.png',
    badge:        '/icons/badge-72.png',
    data:    { link },
    actions: [{ action: 'open', title: 'Open VivaahAI' }],
    tag:     payload.data?.type ?? 'general',
    renotify: true,
  });
});

// Handle notification click — open the relevant page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = event.notification.data?.link ?? '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(link);
          return;
        }
      }
      return clients.openWindow(link);
    }),
  );
});
