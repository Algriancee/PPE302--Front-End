


import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../service/chat.service';
import { ChatMessage, ChatNotification, ChatUser } from '../Models/Chat.model';
import { UserService } from '../service/user.service';
import { User } from '../Models/User.model';



@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  /*@ViewChild('messagesContainer') messagesContainer!: ElementRef;

  // Utilisateur connecté
  currentUserId: string = '';
  currentUserEmail: string = '';
   email: string = '';
  role: string = '';
  // Chat
  user: User = { nomUtilisaeur: "", email: '', telephone: '', role: 'JOUEURS',  };
  messages: ChatMessage[] = [];
  notifications: ChatNotification[] = [];
  connectedUsers: ChatUser[] = [];
  selectedUser: ChatUser | null = null;
  newMessage: string = '';
  chatOuvert: boolean = false;
  unreadCount: number = 0;

  constructor(private chatService: ChatService,
              private userService: UserService
  ) {
    
  }

  ngOnInit(): void {
    // Récupérer l'id depuis localStorage
    const email = localStorage.getItem('email')?.replace(/"/g, '') || '';
    this.currentUserEmail = email;
    this.currentUserId = email; // on utilise email comme ID
    this.email = localStorage.getItem('email') || '';
    this.role = localStorage.getItem('role') || '';

    const token = localStorage.getItem('token');
    let userNumericId = 0;
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userNumericId = payload.id; // ← l'ID Long du token
      console.log('User numeric ID:', userNumericId);
    }

    // Connexion WebSocket
    this.chatService.connect(this.currentUserId, userNumericId );

    // Écouter les notifications
    this.chatService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.unreadCount = notifs.length;

      // Si chat ouvert avec l'expéditeur, ajouter le message directement
      if (this.selectedUser && notifs.length > 0) {
        const lastNotif = notifs[notifs.length - 1];
        if (lastNotif.senderId === this.selectedUser.email) {
          this.chatService.addMessage({
            senderId: lastNotif.senderId,
            recipientId: lastNotif.recipientId,
            content: lastNotif.content,
            timestamp: new Date()
          });
        }
      }
    });

    // Écouter les messages
    this.chatService.messages$.subscribe(msgs => {
      this.messages = msgs;
    });

    // Charger utilisateurs connectés
    this.loadUsers();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

 ngOnDestroy(): void {
  const token = localStorage.getItem('token');
  let userNumericId = 0;
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    userNumericId = payload.id;
  }
  this.chatService.disconnect(this.currentUserId, userNumericId);
  }

  // ── Charger utilisateurs ─────────────────────────────
  loadUsers(): void {
  this.chatService.getConnectedUsers().subscribe(users => {
    console.log('Users reçus:', users); // ← voir exactement les données
    this.connectedUsers = users.filter(u => u.email !== this.currentUserEmail);
  });
}

  // ── Ouvrir conversation ──────────────────────────────
  ouvrirChat(user: ChatUser): void {
    console.log('User cliqué complet:', JSON.stringify(user));
    this.selectedUser = user;
    this.chatOuvert = true;

    // Charger historique
    this.chatService.loadMessages(
      this.currentUserId,
      user.email
    );

    // Vider notifications de cet utilisateur
    const notifsFiltrees = this.notifications.filter(
      n => n.senderId !== user.email
    );
    this.chatService.clearNotifications();
    this.unreadCount = notifsFiltrees.length;
  }

  // ── Envoyer message ──────────────────────────────────
  envoyerMessage(): void {
  if (!this.newMessage.trim() || !this.selectedUser) return;

  // ← Utiliser id converti en string si email est null
  const recipientId = this.selectedUser.email 
                   || String(this.selectedUser.id);

  console.log('recipientId utilisé:', recipientId);
  console.log('selectedUser complet:', JSON.stringify(this.selectedUser));

  if (!recipientId) {
    console.error('Impossible de déterminer le recipientId');
    return;
  }

  const message: ChatMessage = {
    senderId: this.currentUserId,
    recipientId: recipientId,
    content: this.newMessage.trim(),
    timestamp: new Date()
  };

  this.chatService.sendMessage(message);
  this.chatService.addMessage(message);
  this.newMessage = '';
  }

  // ── Fermer chat ──────────────────────────────────────
  fermerChat(): void {
    this.chatOuvert = false;
    this.selectedUser = null;
  }

  // ── Scroll bas ───────────────────────────────────────
  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (e) {}
  }

  // ── Notifications d'un user ──────────────────────────
  getNotifCount(user: ChatUser): number {
    return this.notifications.filter(n => n.senderId === user.email).length;
  }

  // ── Envoyer avec Enter ───────────────────────────────
  onKeyEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.envoyerMessage();
    }
  }


   getInitial(): string {
    return this.email ? this.email.charAt(1).toUpperCase() : '?';
  }*/


      @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  currentUserId: number = 0;
  currentUserEmail: string = '';

  messages: ChatMessage[] = [];
  notifications: ChatNotification[] = [];
  connectedUsers: ChatUser[] = [];
  selectedUser: ChatUser | null = null;
  newMessage: string = '';
  chatOuvert: boolean = false;
  unreadCount: number = 0;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // ← Récupérer l'ID et email depuis le token
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = payload.id;
      this.currentUserEmail = payload.sub?.replace(/"/g, '') || '';
      console.log('User ID:', this.currentUserId);
      console.log('User Email:', this.currentUserEmail);
    }

    // ← Connexion WebSocket
    this.chatService.connect(this.currentUserEmail, this.currentUserId);

    // ← Écouter les mises à jour de présence → recharger la liste
    this.chatService.presence$.subscribe(user => {
      if (user) {
        console.log('👥 Rechargement users suite à changement présence');
        this.loadUsers();
      }
    });

    // ← Écouter les notifications
    this.chatService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.unreadCount = notifs.length;

      if (notifs.length > 0) {
        const lastNotif = notifs[notifs.length - 1];
        if (this.selectedUser &&
            Number(lastNotif.senderId) === this.selectedUser.id) {
          this.chatService.addMessage({
            senderId: Number(lastNotif.senderId),
            recipientId: Number(lastNotif.recipientId),
            content: lastNotif.content,
            timestamp: new Date()
          });
        }
      }
    });

    // ← Écouter les messages
    this.chatService.messages$.subscribe(msgs => {
      this.messages = msgs;
    });

    // ← Charger les users après que le WebSocket soit connecté
    setTimeout(() => this.loadUsers(), 1000);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.chatService.disconnect(this.currentUserId);
  }

  loadUsers(): void {
    this.chatService.getConnectedUsers().subscribe({
      next: (users) => {
        console.log('Users reçus:', users);
        // ← Exclure l'utilisateur actuel
        this.connectedUsers = users.filter(u => u.id !== this.currentUserId);
        console.log('Users filtrés:', this.connectedUsers);
      },
      error: (err) => console.error('Erreur chargement users:', err)
    });
  }

  ouvrirChat(user: ChatUser): void {
    console.log('User sélectionné:', user);
    this.selectedUser = user;
    this.chatOuvert = true;

    this.chatService.loadMessages(this.currentUserId, user.id);

    const notifsFiltrees = this.notifications.filter(
      n => Number(n.senderId) !== user.id
    );
    this.chatService.clearNotifications();
    this.unreadCount = notifsFiltrees.length;
  }

  envoyerMessage(): void {
    if (!this.newMessage.trim() || !this.selectedUser) return;

    const message: ChatMessage = {
      senderId: this.currentUserId,
      recipientId: this.selectedUser.id,
      content: this.newMessage.trim(),
      timestamp: new Date()
    };

    console.log('Message envoyé:', message);
    this.chatService.sendMessage(message);
    this.chatService.addMessage(message);
    this.newMessage = '';
  }

  fermerChat(): void {
    this.chatOuvert = false;
    this.selectedUser = null;
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (e) {}
  }

  getNotifCount(user: ChatUser): number {
    return this.notifications.filter(
      n => Number(n.senderId) === user.id
    ).length;
  }

  onKeyEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.envoyerMessage();
    }
  }
}