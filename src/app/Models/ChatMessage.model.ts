
export interface ChatMessage {
  senderId: Number;
  recipientId: Number;
  content: string;
  timestamp?: string;
}