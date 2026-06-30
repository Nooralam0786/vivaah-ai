/**
 * Socket.IO server — initialised once by server.ts.
 * API routes access the live instance via getIO().
 */

import { Server, type Socket } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { verifyToken } from './jwt';
import { prisma } from './db';
import { setOnline, setOffline } from './presence';

// Global singleton so API routes can emit events
declare global {
  // eslint-disable-next-line no-var
  var _socketIO: Server | undefined;
}

export function getIO(): Server | null {
  return global._socketIO ?? null;
}

export function initSocketServer(httpServer: HTTPServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
      credentials: true,
    },
    path: '/api/socket',
  });

  global._socketIO = io;

  // ── Auth middleware ────────────────────────────────────────────────────────
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Authentication required'));
    const payload = verifyToken(token);
    if (!payload) return next(new Error('Invalid or expired token'));
    socket.data.userId = payload.userId;
    next();
  });

  // ── Connection ─────────────────────────────────────────────────────────────
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId as string;

    // Join personal room for direct notifications (calls, alerts)
    socket.join(`user:${userId}`);

    // Mark online — Redis presence (fast) + DB lastActiveAt (durable)
    setOnline(userId);
    prisma.profile
      .update({ where: { userId }, data: { isOnline: true, lastActiveAt: new Date() } })
      .catch(() => {});

    // Refresh Redis TTL every 60s while socket is alive
    const heartbeat = setInterval(() => setOnline(userId), 60_000);

    // Join a conversation room so we receive broadcasts
    socket.on('join_conversation', (convId: string) => {
      socket.join(`conv:${convId}`);
    });

    socket.on('leave_conversation', (convId: string) => {
      socket.leave(`conv:${convId}`);
    });

    // Typing indicators
    socket.on('typing', ({ convId }: { convId: string }) => {
      socket.to(`conv:${convId}`).emit('user_typing', { userId });
    });

    socket.on('stop_typing', ({ convId }: { convId: string }) => {
      socket.to(`conv:${convId}`).emit('user_stop_typing', { userId });
    });

    // ── WebRTC Call Signaling ──────────────────────────────────────────────
    socket.on('call:offer', ({ toUserId, offer, callType }: { toUserId: string; offer: RTCSessionDescriptionInit; callType: 'audio' | 'video' }) => {
      io.to(`user:${toUserId}`).emit('call:incoming', { fromUserId: userId, offer, callType });
    });

    socket.on('call:answer', ({ toUserId, answer }: { toUserId: string; answer: RTCSessionDescriptionInit }) => {
      io.to(`user:${toUserId}`).emit('call:answered', { fromUserId: userId, answer });
    });

    socket.on('call:reject', ({ toUserId }: { toUserId: string }) => {
      io.to(`user:${toUserId}`).emit('call:rejected', { fromUserId: userId });
    });

    socket.on('call:ice-candidate', ({ toUserId, candidate }: { toUserId: string; candidate: RTCIceCandidateInit }) => {
      io.to(`user:${toUserId}`).emit('call:ice-candidate', { fromUserId: userId, candidate });
    });

    socket.on('call:end', ({ toUserId }: { toUserId: string }) => {
      io.to(`user:${toUserId}`).emit('call:ended', { fromUserId: userId });
    });

    // Disconnect — clear Redis presence + update DB
    socket.on('disconnect', () => {
      clearInterval(heartbeat);

      // Only mark offline in DB if no other socket exists for this user
      const userSockets = io.sockets.adapter.rooms.get(`user:${userId}`);
      const stillConnected = userSockets && userSockets.size > 0;

      if (!stillConnected) {
        setOffline(userId);
        prisma.profile
          .update({ where: { userId }, data: { isOnline: false, lastActiveAt: new Date() } })
          .catch(() => {});
      }
    });
  });

  console.log('[Socket.IO] Server initialised');
  return io;
}
