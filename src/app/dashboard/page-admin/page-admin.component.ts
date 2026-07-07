import { Component , OnInit, signal,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { JoueursService } from '../../service/joueurs.service';
import { AgentsService } from '../../service/agents.service';
import { AuthService } from '../../service/auth.service';
import { MediasService } from '../../service/medias.service';
import { Agent } from '../../Models/Agents.model';
import { Joueur } from '../../Models/Joueurs.model';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../Models/User.model';
import { UserService } from '../../service/user.service';
import { FileService } from '../../service/file.service';
import { FileModel } from '../../Models/file.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-page-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './page-admin.component.html',
  styleUrl: './page-admin.component.css'
})
export class PageAdminComponent implements OnInit {

  activeSection: 'joueurs' | 'agents' | 'create' = 'joueurs';

  drawerOpen = signal(false);
  selectedUser: any = null;
  selectedJoueur: any;
  selectedAgent: any;
  selectedType: 'joueur' | 'agent' | null = null;

  allUsers: User[] = [];
  filteredUsers: User[] = [];
  filteredJoueurs: any[] = [];
  filteredAgents: any[] = [];
  medias: any[] = [];
  joueurs: any[] = [];
  agents: any[] = [];
  profil: any = {};
  user: User = { nomUtilisateur: "", email: '', telephone: '', role: 'JOUEURS' };
  selectedRole: null = null;

  searchEmail: string = '';
  searchRole: string = 'ALL';
  email: string = '';
  role: string = '';

  // ─── Vidéos ───
  videosJoueur: FileModel[] = [];
  loadingVideo: number | null = null;
  activeVideoId: number | null = null;
  activeVideoName: string = '';
  blobUrls: Map<number, SafeUrl> = new Map();
  videoPlayerVisible: boolean = false;
  isMinimized: boolean = false;
  loadingVideos: boolean = false;

  newUser: User = {
    nomUtilisateur: '',
    email: '',
    password: '',
    telephone: '',
    role: 'JOUEURS'
  };

  constructor(
    private agentsService: AgentsService,
    private joueursService: JoueursService,
    private authService: AuthService,
    private userService: UserService,
    private mediasService: MediasService,
    private fileService: FileService,     // ← ajouter
    private sanitizer: DomSanitizer       // ← ajouter
  ) {}

  ngOnInit(): void {
    this.loadAllUsers();
    this.email = localStorage.getItem('email') || '';
    this.role = localStorage.getItem('role') || '';
    this.loadJoueurs();
    this.loadAgents();
  }

  loadAllUsers() {
    this.authService.getAllUsers().subscribe(users => {
      this.allUsers = users;
      this.filteredUsers = users;
    });
  }

  loadJoueurs() {
    this.joueursService.getAll().subscribe(data => {
      this.joueurs = data;
      this.filteredJoueurs = data;
    });
  }

  loadAgents() {
    this.agentsService.getAll().subscribe(data => {
      this.agents = data;
      this.filteredAgents = data;
    });
  }

  // ─── Ouvrir drawer joueur ───
  openJoueur(joueur: any) {
    this.selectedType = 'joueur';
    this.selectedJoueur = joueur;
    this.selectedAgent = null;
    this.videosJoueur = [];
    this.activeVideoId = null;
    this.drawerOpen.set(true);
    this.loadingVideos = true;

    this.userService.getById(joueur.id).subscribe({
      next: u => this.user = u,
      error: () => console.error('User joueur introuvable')
    });

    this.mediasService.getMediasByJoueurId(joueur.id).subscribe({
      next: data => this.medias = data,
      error: () => this.medias = []
    });

    // ← Charger vidéos du joueur
    this.fileService.getVideosByJoueur(joueur.id).subscribe({
      next: videos => {
        this.videosJoueur = videos;
        this.loadingVideos = false;
        console.log('Vidéos joueur:', videos.length);
      },
      error: () => {
        this.videosJoueur = [];
        this.loadingVideos = false;
      }
    });
  }

  // ─── Ouvrir drawer agent ───
  openAgent(agent: any) {
    this.selectedType = 'agent';
    this.selectedAgent = agent;
    this.selectedJoueur = null;
    this.videosJoueur = [];
    this.drawerOpen.set(true);

    this.userService.getById(agent.id).subscribe({
      next: u => this.user = u,
      error: () => console.error('User agent introuvable')
    });
  }

  // ─── Lire une vidéo ───
  lireVideoJoueur(id: number, fileName: string): void {
    if (this.blobUrls.has(id)) {
      if (this.activeVideoId === id) {
        this.videoPlayerVisible = false;
        this.activeVideoId = null;
      } else {
        this.activeVideoId = id;
        this.activeVideoName = fileName;
        this.videoPlayerVisible = true;
        this.isMinimized = false;
      }
      return;
    }

    this.loadingVideo = id;

    this.fileService.streamVideo(id).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        this.blobUrls.set(id, safeUrl);
        this.activeVideoId = id;
        this.activeVideoName = fileName;
        this.loadingVideo = null;
        this.videoPlayerVisible = true;
        this.isMinimized = false;
      },
      error: (err) => {
        console.error('Erreur streaming:', err);
        this.loadingVideo = null;
      }
    });
  }

  fermerVideo(): void {
    this.videoPlayerVisible = false;
    this.activeVideoId = null;
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
  }

  // ─── Télécharger vidéo ───
  telechargerVideo(video: FileModel): void {
    this.fileService.triggerDownload(video.id, video.originalFileName);
  }

  // ─── Supprimer vidéo (admin uniquement) ───
  supprimerVideoAdmin(id: number): void {
    if (!confirm('Supprimer cette vidéo définitivement ?')) return;

    this.fileService.deleteFile(id).subscribe({
      next: () => {
        // Libérer blob si chargé
        if (this.blobUrls.has(id)) {
          URL.revokeObjectURL(this.blobUrls.get(id) as any);
          this.blobUrls.delete(id);
        }
        if (this.activeVideoId === id) {
          this.videoPlayerVisible = false;
          this.activeVideoId = null;
        }
        // Retirer de la liste
        this.videosJoueur = this.videosJoueur.filter(v => v.id !== id);
      },
      error: err => alert('Erreur suppression : ' + (err.error?.message || 'Réessayez'))
    });
  }

  // ─── Fermer drawer ───
  closeDrawer() {
    this.drawerOpen.set(false);
    this.selectedUser = null;
    this.medias = [];
    this.videosJoueur = [];
    this.activeVideoId = null;
    this.videoPlayerVisible = false;
    this.blobUrls.forEach(url => URL.revokeObjectURL(url as any));
    this.blobUrls.clear();
  }

  // ─── Supprimer joueur/agent ───
  deleteJoueur(id: number) {
    if (!confirm('Supprimer ce joueur ?')) return;
    this.joueursService.deleteJoueur(id).subscribe(() => this.loadJoueurs());
  }

  deleteAgent(id: number) {
    if (!confirm('Supprimer cet agent ?')) return;
    this.agentsService.delete(id).subscribe(() => this.loadAgents());
  }

  // ─── Créer user (admin) ───
  createUser2(): void {
    if (!this.newUser.nomUtilisateur || !this.newUser.email ||
        !this.newUser.password || !this.newUser.telephone) {
      alert('Tous les champs sont requis');
      return;
    }
    this.authService.createUserByAdmin(this.newUser).subscribe({
      next: () => {
        alert('✅ Utilisateur créé avec succès !');
        this.loadAllUsers();
        this.newUser = { nomUtilisateur: '', email: '', password: '', telephone: '', role: 'JOUEURS' };
      },
      error: (err) => alert(err.error?.message || 'Erreur création')
    });
  }

  logout() { this.authService.logout(); }
  getInitial(): string { return this.email ? this.email.charAt(1).toUpperCase() : '?'; }
}