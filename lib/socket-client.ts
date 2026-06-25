/**
 * Client-side Socket.IO singleton.
 * Import getSocket() in client components — it always returns the same instance.
 */

import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(token: string): Socket {
  if (socket?.connected) return socket;

  if (socket) socket.disconnect();

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
    path: '/api/socket',
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
