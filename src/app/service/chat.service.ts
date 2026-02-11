import { ChatMessage } from '../Models/ChatMessage.model';


import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
//import SockJS from 'sockjs-client/dist/sockjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {

  private stompClient!: Client;
  private messages$ = new BehaviorSubject<ChatMessage[]>([]);

  /*connect(userId: number) {

    this.stompClient = new Client({
      webSocketFactory: () =>
        new SockJS('http://localhost:8080/ws'),

      reconnectDelay: 5000,
      debug: (str) => console.log('STOMP:', str),

      onConnect: () => {
        console.log('🟢 STOMP CONNECTÉ');

        this.stompClient.subscribe(
          `/user/${userId}/queue/messages`,
          (msg: IMessage) => {
            const message: ChatMessage = JSON.parse(msg.body);
            this.messages$.next([...this.messages$.value, message]);
          }
        );
      },

      onStompError: (frame) => {
        console.error('❌ STOMP ERROR', frame);
      }
    });

    this.stompClient.activate();
  }

  sendMessage(senderId: number, recipientId: number, content: string) {
    if (!this.stompClient?.connected) return;

    const message: ChatMessage = { senderId, recipientId, content };

    this.stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message)
    });
  }

  getMessages() {
    return this.messages$.asObservable();
  }

  disconnect() {
    this.stompClient?.deactivate();
  }*/
}