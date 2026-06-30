export interface Conversation {
  id: string;
  userId: string;
  name: string;
  photo: string | null;
  isOnline: boolean;
  lastMsg: string;
  time: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

export interface SocketMessage {
  id: string;
  conversationId: string;
  text: string;
  senderId: string;
  time: string;
}

/** Either a real Conversation, or the synthetic "pending" partner before a conversation exists. */
export interface ChatPartner {
  id: string;
  userId: string;
  name: string;
  photo: string | null;
  isOnline: boolean;
  lastMsg: string;
  time: string;
  unread: number;
}
