'use client';

/**
 * useFCM — requests notification permission, gets FCM token, registers it
 * with the server. Runs once per session after the user is authenticated.
 *
 * No-ops silently if:
 *   - Firebase env vars are not set
 *   - Browser does not support notifications
 *   - User denies permission
 */

import { useEffect } from 'react';
import { getFirebaseApp } from '@/lib/firebase-client';

export function useFCM(accessToken: string | null) {
  useEffect(() => {
    if (!accessToken) return;
    if (typeof window === 'undefined') return;
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

    registerFCM(accessToken).catch(() => {});
  }, [accessToken]);
}

async function registerFCM(accessToken: string): Promise<void> {
  const app = getFirebaseApp();
  if (!app) return; // Firebase not configured

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) return;

  // Request permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  // Inject Firebase config into the service worker scope so it can initialise
  const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
    scope: '/',
  });
  await navigator.serviceWorker.ready;
  // Pass config to SW once it's active
  if (swReg.active) {
    swReg.active.postMessage({
      type: '__FIREBASE_CONFIG__',
      config: {
        apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      },
    });
  }

  // Lazy-import Messaging to avoid SSR issues
  const { getMessaging, getToken } = await import('firebase/messaging');
  const messaging = getMessaging(app);

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: swReg,
  });

  if (!token) return;

  // Save token to server
  await fetch('/api/users/fcm-token', {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ token }),
  });

  // Handle foreground messages (app is open)
  const { onMessage } = await import('firebase/messaging');
  onMessage(messaging, (payload) => {
    const { title, body } = payload.notification ?? {};
    if (!title) return;
    new Notification(title, {
      body:  body ?? '',
      icon:  '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      data:  payload.data,
    });
  });
}
