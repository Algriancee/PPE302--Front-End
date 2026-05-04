
export interface ChatMessage {
  id?: number;
  senderId: number;
  recipientId: number;
  chatId?: string;
  content: string;
  timestamp?: Date;
}

export interface ChatNotification {
  id?: number;
  senderId: number;
  recipientId: number;
  content: string;
}

export interface ChatUser {
  id: number;
  nomUtilisateur: string;
  email: string;
  status: 'ONLINE' | 'OFFLINE';
  role: string;
}