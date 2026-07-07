


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage, ChatNotification, ChatUser } from '../Models/Chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {





      private apiUrl = 'http://localhost:8080';
  private stompClient!: Client;
  private subscription!: StompSubscription;

  private notificationsSubject = new BehaviorSubject<ChatNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  // ← Nouveau subject pour les mises à jour de présence
  private presenceSubject = new BehaviorSubject<any>(null);
  presence$ = this.presenceSubject.asObservable();

  private currentUserId: number = 0;

  constructor(private http: HttpClient) {}

  connect(userEmail: string, userNumericId: number): void {
    this.currentUserId = userNumericId;

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${this.apiUrl}/ws`),
      reconnectDelay: 5000,
      connectHeaders: {
        userId: String(userNumericId)
      },

      onConnect: () => {
        console.log(' WebSocket connecté ID:', userNumericId);

        // ← S'abonner aux messages personnels
        this.stompClient.subscribe(
          `/user/${userNumericId}/queue/messages`,
          (message) => {
            const notification: ChatNotification = JSON.parse(message.body);
            console.log('📨 Message reçu:', notification);
            const current = this.notificationsSubject.getValue();
            this.notificationsSubject.next([...current, notification]);
          }
        );

        // ← S'abonner aux mises à jour de présence
        this.stompClient.subscribe(
          `/topic/public`,
          (message) => {
            const user = JSON.parse(message.body);
            console.log('👥 Présence mise à jour:', user);
            this.presenceSubject.next(user); // ← notifier
          }
        );

        // ← Annoncer connexion avec ID numérique
        this.stompClient.publish({
          destination: '/app/user.addUser',
          body: JSON.stringify({ id: userNumericId })
        });
      },

      onDisconnect: () => {
        console.log(' WebSocket déconnecté');
      }
    });

    this.stompClient.activate();
  }

  disconnect(userNumericId: number): void {
    if (this.stompClient?.connected) {
      this.stompClient.publish({
        destination: '/app/user.disconnectUser',
        body: JSON.stringify({ id: userNumericId })
      });
      this.stompClient.deactivate();
    }
  }

  sendMessage(message: ChatMessage): void {
    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(message)
    });
  }

  loadMessages(senderId: number, recipientId: number): void {
    this.http.get<ChatMessage[]>(
      `${this.apiUrl}/messages/${senderId}/${recipientId}`
    ).subscribe(messages => {
      this.messagesSubject.next(messages);
    });
  }

  addMessage(message: ChatMessage): void {
    const current = this.messagesSubject.getValue();
    this.messagesSubject.next([...current, message]);
  }

  getConnectedUsers(): Observable<ChatUser[]> {
    return this.http.get<ChatUser[]>(`${this.apiUrl}/user`);
  }

  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }

  getUnreadCount(): number {
    return this.notificationsSubject.getValue().length;
  }
}