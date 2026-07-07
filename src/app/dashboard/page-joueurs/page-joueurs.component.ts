import { Component } from '@angular/core';
import {  OnInit , OnDestroy} from '@angular/core';
import { HttpEventType } from '@angular/common/http';
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
import { ChatComponent } from '../../chat/chat.component';
import { FileService } from '../../service/file.service';
import { FileModel } from '../../Models/file.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-page-joueurs',
  imports: [CommonModule, FormsModule, ChatComponent],
  templateUrl: './page-joueurs.component.html',
  styleUrl: './page-joueurs.component.css'
})
export class PageJoueursComponent implements OnInit, OnDestroy {
  section: string = 'add-exercice';

  joueurs: Joueur = { nom: '', prenoms: "", poste: '' };
  profil: ProfilJoueur = {};
  medias: Media[] = [];
  user: User = { nomUtilisateur: "", email: '', telephone: '', role: 'JOUEURS',  };
  mediaForm: Media = { type: '', url: '', description: '' };
  mesVideos: FileModel[] = [];
  mesPdfs: FileModel[] = [];

  emailUtilisateur = '';
  email: string = '';
  role: string = '';

  selectedFile: File | null = null;
  fileDescription: string = '';
  uploading: boolean = false;
  uploadProgress: number = 0;
  uploadMessage: string = '';
   uploadError: string = '';

  blobUrls: Map<number, SafeUrl> = new Map(); 
  loadingVideo: number | null = null;          
  activeVideoId: number | null = null;         
  
  

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
    private chatService: ChatService,
    private fileService: FileService,
    private sanitizer: DomSanitizer
  ) {}

  
  ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.loadJoueurById(userId);
      this.loadUser(userId); 
      
      
    } else {
      console.error("ID utilisateur non trouvé dans le token. Redirection ou gestion d'erreur.");
      
    }
    this.emailUtilisateur = JSON.parse(localStorage.getItem('email') || '""');

    this.email = localStorage.getItem('email') || '';
    this.role = localStorage.getItem('role') || '';
  }
  ngOnDestroy(): void {
    // Libérer les Blob URLs pour éviter les fuites mémoire
    this.blobUrls.forEach((url) => {
      URL.revokeObjectURL(url as any);
    });
    this.blobUrls.clear();
  }

  loadJoueurById(id: number): void {
    this.joueursService.getById(id).subscribe({
      next: (data) => {
        this.joueurs = data;
        console.log("Joueur chargé :", data);
        // Charger profil + médias si le joueur existe
        if (data.id) {
          this.loadProfil(data.id);
          this.loadMedias(data.id);
          this.loadMesVideos(data.id);  
        this.loadMesPdfs(data.id);   
        
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement du joueur (peut-être un nouveau utilisateur) :", err);
        // Pour nouveaux utilisateurs : laisser les champs vides pour remplissage manuel
        this.joueurs = { nom: '', prenoms: '',  poste: '' };
      }
    });
  }
  
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


  updateJoueur(): void {
    this.joueursService.updateJoueur(this.joueurs.id!, this.joueurs).subscribe({
      next: () => alert('Joueur mis à jour !'),
      error: (err) => console.error('Erreur MAJ joueur :', err)
    });
  }

  createProfil(): void {
    if (!this.joueurs.id) {
      alert("Impossible de créer un profil : Joueur non chargé !");
      return;
    }

    this.profil.joueur = { id: this.joueurs.id }; 

    this.profilJoueursService.createProfil(this.profil).subscribe({
      next: () => {
        alert('Profil créé avec succès !');
        this.loadProfil(this.joueurs.id!);
      },
      error: (err) => console.error('Erreur création profil :', err)
    });
  }

  updateProfil(): void {
    this.profilJoueursService.updateProfil(this.profil.id!, this.profil).subscribe({
      next: () => alert('Profil mis à jour !'),
      error: (err) => console.error('Erreur MAJ profil :', err)
    });
  }

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
        this.user = { nomUtilisateur: '', email: '', telephone: '', role: 'JOUEURS' };
      }
    });
  }


  openChat() {
  this.chatOpen = true;
}

closeChat() {
  this.chatOpen = false;
}



  loadMesVideos1(joueurId: number): void {
    this.fileService.getVideosByJoueur(joueurId).subscribe({
      next: (data) => {
        this.mesVideos = data;
        console.log('Vidéos chargées:', data);
      },
      error: (err) => {
        console.error('Erreur chargement vidéos:', err);
        this.mesVideos = [];
      }
    });
  }

  loadMesPdfs1(joueurId: number): void {
    this.fileService.getFilesByJoueur(joueurId).subscribe({
      next: (data) => {
        // ← Filtrer seulement les PDFs
        this.mesPdfs = data.filter(f => this.fileService.isPdf(f.fileType));
        console.log('PDFs chargés:', this.mesPdfs);
      },
      error: () => this.mesPdfs = []
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const allowed = [
      'application/pdf',
      'video/mp4',
      'video/mpeg',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo'
    ];

    if (!allowed.includes(file.type)) {
      this.uploadError = '❌ Seuls les fichiers PDF et vidéo (MP4, WebM...) sont acceptés !';
      this.selectedFile = null;
      return;
    }

    this.uploadError = '';
    this.selectedFile = file;
  }

  upload(): void {
    if (!this.selectedFile) return;

    if (!this.joueurs.id) {
      this.uploadError = '❌ Créez d\'abord votre profil joueur avant d\'uploader !';
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.uploadMessage = '';
    this.uploadError = '';

    this.fileService.uploadFile(
      this.selectedFile,
      this.fileDescription,
      this.joueurs.id  // ← lier au joueur connecté
    ).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        }
        if (event.type === HttpEventType.Response) {
          this.uploading = false;
          this.uploadProgress = 100;
          this.uploadMessage = '✅ Fichier uploadé avec succès !';
          this.selectedFile = null;
          this.fileDescription = '';

          // ← Recharger les vidéos/PDFs après upload
          this.loadMesVideos(this.joueurs.id!);
          this.loadMesPdfs(this.joueurs.id!);

          setTimeout(() => {
            this.uploadMessage = '';
            this.uploadProgress = 0;
          }, 3000);
        }
      },
      error: (err) => {
        this.uploading = false;
        this.uploadError = '❌ Erreur upload : ' + (err.error?.message || 'Vérifiez la taille du fichier');
      }
    });
  }

  lireVideo(id: number): void {
    // Déjà chargée → toggle
    if (this.blobUrls.has(id)) {
      this.activeVideoId = this.activeVideoId === id ? null : id;
      return;
    }

    this.loadingVideo = id;

    this.fileService.streamVideo(id).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        this.blobUrls.set(id, safeUrl);
        this.activeVideoId = id;
        this.loadingVideo = null;
      },
      error: (err) => {
        console.error('Erreur streaming vidéo:', err);
        this.loadingVideo = null;
      }
    });
  }

  fermerVideo(): void {
    this.activeVideoId = null;
  }

  
  telecharger(file: FileModel): void {
    this.fileService.triggerDownload(file.id, file.originalFileName);
  }

  
  supprimerFichier(id: number): void {
    if (!confirm('Supprimer ce fichier définitivement ?')) return;

    this.fileService.deleteFile(id).subscribe({
      next: () => {
        // ← Libérer le Blob URL si chargé
        if (this.blobUrls.has(id)) {
          URL.revokeObjectURL(this.blobUrls.get(id) as any);
          this.blobUrls.delete(id);
        }
        if (this.activeVideoId === id) this.activeVideoId = null;

        // ← Recharger les listes
        this.loadMesVideos(this.joueurs.id!);
        this.loadMesPdfs(this.joueurs.id!);
      },
      error: (err) => alert('Erreur suppression : ' + (err.error?.message || 'Réessayez'))
    });
  }

  loadMesVideos(joueurId: number): void {
  console.log('📹 Chargement vidéos pour joueurId:', joueurId);
  this.fileService.getVideosByJoueur(joueurId).subscribe({
    next: (data) => {
      this.mesVideos = data;
      console.log('✅ Vidéos reçues:', data.length, data);
    },
    error: (err) => {
      console.error('❌ Erreur chargement vidéos:', err);
      this.mesVideos = [];
    }
  });
}

loadMesPdfs(joueurId: number): void {
  this.fileService.getFilesByJoueur(joueurId).subscribe({
    next: (data) => {
      this.mesPdfs = data.filter(f => this.fileService.isPdf(f.fileType));
      console.log('✅ PDFs reçus:', this.mesPdfs.length);
    },
    error: () => this.mesPdfs = []
  });
}
 

  
}