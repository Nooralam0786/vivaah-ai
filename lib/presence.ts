/**
 * Redis-backed user presence (online/offline status).
 *
 * Uses SETEX with a 90-second TTL. Socket.IO refreshes the key every 60s on
 * heartbeat; on disconnect the key either expires or is deleted explicitly.
 * When Redis is unavailable, all functions are no-ops and isOnline() returns false.
 *
 * Key format: `presence:{userId}`
 */

import { getRedis } from './redis';

const PRESENCE_TTL = 90; // seconds

/** Mark a user as online (or refresh their TTL). */
export async function setOnline(userId: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.setex(`presence:${userId}`, PRESENCE_TTL, '1');
  } catch {
    // ignore
  }
}

/** Mark a user as offline immediately. */
export async function setOffline(userId: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.del(`presence:${userId}`);
  } catch {
    // ignore
  }
}

/** Check whether a single user is online. */
export async function isOnline(userId: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  try {
    return (await redis.exists(`presence:${userId}`)) === 1;
  } catch {
    return false;
  }
}

/**
 * Bulk-check which user IDs are online.
 * Returns a Set of online user IDs.
 */
export async function getOnlineUsers(userIds: string[]): Promise<Set<string>> {
  if (!userIds.length) return new Set();
  const redis = getRedis();
  if (!redis) return new Set();

  try {
    const keys    = userIds.map((id) => `presence:${id}`);
    const results = await redis.mget(...keys);
    const online  = new Set<string>();
    results.forEach((val, i) => {
      if (val !== null) online.add(userIds[i]);
    });
    return online;
  } catch {
    return new Set();
  }
}
