/**
 * Firebase Cloud Messaging — server-side (Firebase Admin SDK)
 *
 * Sends push notifications to users' devices even when the app is closed.
 * Gracefully skips if FIREBASE_SERVICE_ACCOUNT_JSON env var is not set.
 *
 * Setup: Create a Firebase project → Project Settings → Service Accounts
 *        → Generate new private key → paste JSON as FIREBASE_SERVICE_ACCOUNT_JSON
 */

import type { App } from 'firebase-admin/app';

let firebaseApp: App | null = null;
let initAttempted = false;

function getFirebaseApp(): App | null {
  if (initAttempted) return firebaseApp;
  initAttempted = true;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) return null;

  try {
    // Dynamic import to avoid loading firebase-admin at build time on client bundles
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const admin = require('firebase-admin');
    if (admin.apps.length > 0) {
      firebaseApp = admin.apps[0];
      return firebaseApp;
    }
    const serviceAccount = JSON.parse(serviceAccountJson);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return firebaseApp;
  } catch (err) {
    console.error('[FCM] Failed to initialise Firebase Admin:', err);
    return null;
  }
}

export interface FCMPayload {
  title: string;
  body:  string;
  icon?: string;
  link?: string;
  type?: string;
}

/**
 * Send a push notification to a single FCM registration token.
 * Silently no-ops if Firebase is not configured or the token is invalid.
 */
export async function sendPushNotification(
  fcmToken: string,
  payload: FCMPayload,
): Promise<void> {
  const app = getFirebaseApp();
  if (!app) return; // Firebase not configured — skip silently

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getMessaging } = require('firebase-admin/messaging');
    await getMessaging(app).send({
      token: fcmToken,
      notification: {
        title: payload.title,
        body:  payload.body,
        ...(payload.icon ? { imageUrl: payload.icon } : {}),
      },
      webpush: {
        notification: {
          title: payload.title,
          body:  payload.body,
          icon:  payload.icon ?? '/icons/icon-192.png',
          badge: '/icons/badge-72.png',
          click_action: payload.link ?? '/',
          data: { link: payload.link ?? '/' },
        },
        fcmOptions: { link: payload.link ?? '/' },
      },
      data: {
        type: payload.type ?? 'general',
        link: payload.link ?? '/',
      },
    });
  } catch (err: unknown) {
    // Invalid token or unregistered device — log but don't throw
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.includes('registration-token-not-registered') ||
      msg.includes('invalid-registration-token')
    ) {
      // Token is stale — caller should delete it from DB
      throw new StaleFCMTokenError(fcmToken);
    }
    console.error('[FCM] sendPushNotification error:', msg);
  }
}

export class StaleFCMTokenError extends Error {
  constructor(public readonly token: string) {
    super('FCM token is stale or invalid');
  }
}

/** Returns true if Firebase Admin is configured and ready. */
export function isFCMEnabled(): boolean {
  return !!getFirebaseApp();
}
