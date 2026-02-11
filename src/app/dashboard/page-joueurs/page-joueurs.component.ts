import { Component } from '@angular/core';
import {  OnInit } from '@angular/core';
import { Joueur } from '../../Models/Joueurs.model';
import { ProfilJoueur } from '../../Models/ProfilJoueurs.model';
import { Media } from '../../Models/Medias.model';
import { User } from '../../Models/User.model';
import { ChatMessage } from '../../Models/ChatMessage.model';
import { JoueursService } from '../../service/joueurs.service';
import { AuthService } from '../../service/auth.service';
import { ProfilJoueursService } from '../../service/profil-joueurs.service';
import { MediasService } from '../../service/medias.service';
import { UserService } from '../../service/user.service';
import { ChatService } from '../../service/chat.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-page-joueurs',
  imports: [CommonModule, FormsModule],
  templateUrl: './page-joueurs.component.html',
  styleUrl: './page-joueurs.component.css'
})
export class PageJoueursComponent implements OnInit{
  section: string = 'add-exercice';

  joueurs: Joueur = { nom: '', prenoms: "", poste: '' };
  profil: ProfilJoueur = {};
  medias: Media[] = [];
  user: User = { nomUtilisaeur: "", email: '', telephone: '', role: 'JOUEURS',  };
  mediaForm: Media = { type: '', url: '', description: '' };

  emailUtilisateur = '';
  //emailUtilisateur = JSON.parse(localStorage.getItem('email') || '""');
  email: string = '';
  role: string = '';
  
  

  // 🔥 CHAT
  messages: ChatMessage[] = [];
  messageContent = '';
  currentUserId!: string;
  selectedAgentId!: string;
  chatOpen = false;
  
  newMessage = '';

  constructor(
    private joueursService: JoueursService,
    private authService: AuthService,
    private profilJoueursService: ProfilJoueursService,
    private userService: UserService,
    private mediasService: MediasService,
    private chatService: ChatService
  ) {}

  /*ngOnInit(): void {
    this.emailUtilisateur = JSON.parse(localStorage.getItem('email') || '""');
    if (this.emailUtilisateur) this.loadJoueur();
  }*/

  ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.loadJoueurById(userId);
      this.loadUser(userId); 
      //this.chatService.connect(userId);   
    } else {
      console.error("ID utilisateur non trouvé dans le token. Redirection ou gestion d'erreur.");
      // Optionnel : Rediriger vers connexion si token invalide
    }
    this.emailUtilisateur = JSON.parse(localStorage.getItem('email') || '""');
    
  
  /*if (userId) {
    this.chatService.connect(userId);
  }
    
    const userIdStr = String(userId);
    this.chatService.connect(userIdStr);

      this.email = localStorage.getItem('email') || '';
      this.role = localStorage.getItem('role') || '';

       // 🔌 STOMP
    this.chatService.connect(this.currentUserId);

    this.chatService.getMessages().subscribe(msgs => {
      this.messages = msgs.filter(
        m =>
          m.senderId === this.selectedAgentId ||
          m.recipientId === this.selectedAgentId
      );
    });*/
  }

  /** 🔹 Charger le joueur connecté 
  loadJoueur(): void {
    this.joueursService.getJoueurByEmail(this.emailUtilisateur).subscribe({
      next: (data) => {
        this.joueurs = data;
        console.log("Joueur chargé :", data);

        // Charger profil + médias du joueur existant
        if (data.id) {
          this.loadProfil(data.id);
          this.loadMedias(data.id);
        }
      },
      error: (err) => console.error("Erreur joueur :", err)
    });
  }*/
  loadJoueurById(id: number): void {
    this.joueursService.getById(id).subscribe({
      next: (data) => {
        this.joueurs = data;
        console.log("Joueur chargé :", data);
        // Charger profil + médias si le joueur existe
        if (data.id) {
          this.loadProfil(data.id);
          this.loadMedias(data.id);
        
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement du joueur (peut-être un nouveau utilisateur) :", err);
        // Pour nouveaux utilisateurs : laisser les champs vides pour remplissage manuel
        this.joueurs = { nom: '', prenoms: '',  poste: '' };
      }
    });
  }
  /** 🔹 Charger profil par joueurId */
  loadProfil(joueurId: number): void {
    this.profilJoueursService.getProfilByJoueurId(joueurId).subscribe({
      next: (data) => {
        this.profil = data;
        console.log("Profil chargé :", data);
      },
      error: () => {
        this.profil = {}; // aucun profil
      }
    });
  }

  /** 🔹 Charger médias par joueurId */
  loadMedias(joueurId: number): void {
    this.mediasService.getMediasByJoueurId(joueurId).subscribe({
      next: (data) => {
        this.medias = data;
        console.log("Médias chargés :", data);
      },
      error: () => {
        this.medias = []; // aucun média
      }
    });
  }

  /** 🔹 Créer un joueur 
  createJoueur(): void {
    this.joueursService.createJoueur(this.joueurs).subscribe({
      next: (data) => {
        alert('Joueur créé avec succès !');
        this.joueurs = data;
        this.loadJoueurById(0);
      },
      error: (err) => console.error('Erreur création joueur :', err)
    });
  }  */

         /** 🔹 Créer un joueur */
createJoueur(): void {
  this.joueursService.createJoueur(this.joueurs).subscribe({
    next: (data) => {
      alert('Joueur créé avec succès !');
      this.joueurs = data;
      // Correction : Utiliser data.id au lieu de 0 pour recharger le joueur créé
      if (data.id) {
        this.loadJoueurById(data.id);
      } else {
        console.error("ID du joueur créé non trouvé. Vérifiez le backend.");
      }
    },
    error: (err) => console.error('Erreur création joueur :', err)
  });
}       


  /** 🔹 Mettre à jour joueur */
  updateJoueur(): void {
    this.joueursService.updateJoueur(this.joueurs.id!, this.joueurs).subscribe({
      next: () => alert('Joueur mis à jour !'),
      error: (err) => console.error('Erreur MAJ joueur :', err)
    });
  }

  /** 🔹 Créer un profil lié AU BON joueur */
  createProfil(): void {
    if (!this.joueurs.id) {
      alert("Impossible de créer un profil : Joueur non chargé !");
      return;
    }

    this.profil.joueur = { id: this.joueurs.id }; // 🔥 IMPORTANT

    this.profilJoueursService.createProfil(this.profil).subscribe({
      next: () => {
        alert('Profil créé avec succès !');
        this.loadProfil(this.joueurs.id!);
      },
      error: (err) => console.error('Erreur création profil :', err)
    });
  }

  /** 🔹 Mettre à jour profil */
  updateProfil(): void {
    this.profilJoueursService.updateProfil(this.profil.id!, this.profil).subscribe({
      next: () => alert('Profil mis à jour !'),
      error: (err) => console.error('Erreur MAJ profil :', err)
    });
  }

  /** 🔹 Supprimer profil */
  deleteProfil(): void {
    if (this.profil.id && confirm('Supprimer votre profil ?')) {
      this.profilJoueursService.deleteProfil(this.profil.id).subscribe({
        next: () => {
          alert('Profil supprimé.');
          this.profil = {};
        },
        error: (err) => console.error('Erreur suppression profil :', err)
      });
    }
  }

  /** 🔹 Ajouter un média lié AU BON joueur */
  createMedia(): void {
    if (!this.joueurs.id) {
      alert("Impossible d'ajouter un média : Joueur non chargé !");
      return;
    }

    const mediaToSend: Media = {
      ...this.mediaForm,
      joueur: { id: this.joueurs.id } // 🔥 IMPORTANT
    };

    this.mediasService.create(mediaToSend).subscribe({
      next: () => {
        alert('Média ajouté !');
        this.mediaForm = { type: '', url: '', description: '' };
        this.loadMedias(this.joueurs.id!);
      },
      error: (err) => console.error('Erreur ajout média :', err)
    });
  }

  /** 🔹 Supprimer média */
  deleteMedia(id: number): void {
    if (confirm('Supprimer ce média ?')) {
      this.mediasService.delete(id).subscribe({
        next: () => {
          alert('Média supprimé.');
          this.loadMedias(this.joueurs.id!);
        },
        error: (err) => console.error('Erreur suppression média :', err)
      });
    }
  }

  logout() {
    this.authService.logout();
  }


  getInitial(): string {
    return this.email ? this.email.charAt(1).toUpperCase() : '?';
  }

  /** 🔹 Charger le USER connecté */
  loadUser(userId: number): void {
    this.userService.getById(userId).subscribe({
      next: (data) => {
        this.user = data;
        console.log('User chargé :', data);
      },
      error: (err) => {
        console.error('Erreur chargement user :', err);
        this.user = { nomUtilisaeur: '', email: '', telephone: '', role: 'JOUEURS' };
      }
    });
  }

  /*sendMessage() {
    if (!this.messageContent || !this.selectedAgentId) return;

    this.chatService.sendMessage({
      senderId: this.currentUserId,
      recipientId: this.selectedAgentId,
      content: this.messageContent
    });

    this.messageContent = '';
  }*/

  openChat() {
  this.chatOpen = true;
}

closeChat() {
  this.chatOpen = false;
}



 

  
}