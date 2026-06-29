/**
 * Notification helpers — creates in-app DB record AND sends FCM push.
 *
 * FCM push is fire-and-forget: failures are logged but never thrown so that
 * the primary action (like, match, message) always succeeds.
 */

import { prisma } from './db';
import { sendPushNotification, StaleFCMTokenError } from './fcm';

type NotifType = 'like' | 'match' | 'message' | 'view' | 'referral' | 'boost';

interface CreateNotifParams {
  userId:      string;
  type:        NotifType;
  title:       string;
  body:        string;
  fromUserId?: string;
  fromName?:   string;
  fromPhoto?:  string;
  link?:       string;
}

// ── Core helper ───────────────────────────────────────────────────────────────

export async function createNotification(params: CreateNotifParams): Promise<void> {
  // 1. Store in-app notification
  await prisma.notification.create({ data: params });

  // 2. Send FCM push (best-effort)
  sendFCMPush(params).catch(() => {});
}

async function sendFCMPush(params: CreateNotifParams): Promise<void> {
  if (!params.userId) return;

  const user = await prisma.user.findUnique({
    where:  { id: params.userId },
    select: { fcmToken: true },
  });

  if (!user?.fcmToken) return;

  try {
    await sendPushNotification(user.fcmToken, {
      title: params.title,
      body:  params.body,
      icon:  params.fromPhoto,
      link:  params.link,
      type:  params.type,
    });
  } catch (err) {
    if (err instanceof StaleFCMTokenError) {
      // Token expired — clear it so we don't retry on every notification
      await prisma.user.update({
        where: { id: params.userId },
        data:  { fcmToken: null },
      }).catch(() => {});
    }
  }
}

// ── Domain-specific helpers ───────────────────────────────────────────────────

export async function createLikeNotification(
  toUserId: string, fromUserId: string, fromName: string, fromPhoto: string | null,
): Promise<void> {
  await createNotification({
    userId: toUserId, type: 'like',
    title: 'Someone liked your profile! ❤️',
    body:  `${fromName} liked your profile.`,
    fromUserId, fromName, fromPhoto: fromPhoto ?? undefined,
    link: `/profile/${fromUserId}`,
  });
}

export async function createMatchNotification(
  toUserId: string, fromUserId: string, fromName: string, fromPhoto: string | null,
): Promise<void> {
  await createNotification({
    userId: toUserId, type: 'match',
    title: "It's a Match! 💍",
    body:  `You and ${fromName} liked each other!`,
    fromUserId, fromName, fromPhoto: fromPhoto ?? undefined,
    link: `/messages?userId=${fromUserId}`,
  });
}

export async function createMessageNotification(
  toUserId: string, fromUserId: string, fromName: string, fromPhoto: string | null, preview: string,
): Promise<void> {
  await createNotification({
    userId: toUserId, type: 'message',
    title: `New message from ${fromName} 💬`,
    body:  preview.length > 60 ? preview.slice(0, 60) + '…' : preview,
    fromUserId, fromName, fromPhoto: fromPhoto ?? undefined,
    link: `/messages?userId=${fromUserId}`,
  });
}

export async function createViewNotification(
  toUserId: string, fromUserId: string, fromName: string, fromPhoto: string | null,
): Promise<void> {
  await createNotification({
    userId: toUserId, type: 'view',
    title: 'Someone viewed your profile 👀',
    body:  `${fromName} viewed your profile.`,
    fromUserId, fromName, fromPhoto: fromPhoto ?? undefined,
    link: `/visitors`,
  });
}

export async function createReferralNotification(
  toUserId: string, refereeName: string,
): Promise<void> {
  await createNotification({
    userId: toUserId, type: 'referral',
    title: 'Referral reward unlocked! 🎁',
    body:  `${refereeName} joined using your referral. You earned 30 days free Gold!`,
    link: `/referral`,
  });
}

export async function createBoostNotification(
  toUserId: string,
): Promise<void> {
  await createNotification({
    userId: toUserId, type: 'boost',
    title: 'Your profile boost is live! ⚡',
    body:  'Your profile is now featured at the top of search results.',
    link: `/boost`,
  });
}
