import { Component , OnInit, signal,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { JoueursService } from '../../service/joueurs.service';
import { AgentsService } from '../../service/agents.service';
import { AuthService } from '../../service/auth.service';
import { RechercheService } from '../../service/recherche.service';
import { ProfilJoueursService } from '../../service/profil-joueurs.service';
import { MediasService } from '../../service/medias.service';
import { ChatService } from '../../service/chat.service';
import { Agent } from '../../Models/Agents.model';
import { Joueur } from '../../Models/Joueurs.model';
import { ProfilJoueur } from '../../Models/ProfilJoueurs.model';
import { Media } from '../../Models/Medias.model';
import { User } from '../../Models/User.model';
import { ChatMessage } from '../../Models/ChatMessage.model';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ChatComponent } from '../../chat/chat.component';
import { FileService } from '../../service/file.service';
import { FileModel } from '../../Models/file.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';




@Component({
  selector: 'app-page-agents',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink,ChatComponent],
  templateUrl: './page-agents.component.html',
  styleUrl: './page-agents.component.css'
})
export class PageAgentsComponent implements OnInit{

  
 activeSection: string = 'profil';
 private router = inject(Router);
  email: string = '';
  role: string = '';
  videosJoueur: FileModel[] = [];
  loadingVideo: number | null = null;
  activeVideoId: number | null = null;
  blobUrls: Map<number, SafeUrl> = new Map();
  videoPlayerVisible: boolean = false;
  activeVideoName: string = '';
  isMinimized: boolean = false;
  
 /** --- PROFIL AGENT --- **/
  agent: Agent = {
    id: null as any,
    nom:'',
    prenoms: '',
    nomAgence: '',
    licence: '',
    adresseAgence: '',
    paysAgence: '',
    //recherches: []
  };

  isFirstTime = true;  // <--- très important

  /** --- JOUEURS --- **/
  joueurs: Joueur[] = [];
  filteredJoueurs: Joueur[] = [];
  user: User = { nomUtilisateur: "", email: '', telephone: '', role: 'JOUEURS',  };

  profil: ProfilJoueur = {};
  medias: Media[] = [];
  videoRowJoueurId: number | null = null;   
  loadingVideosRow: boolean = false;         
  videoCountMap: Map<number, number> = new Map(); 

  // Champs recherche
  searchNom = '';
  searchprenoms = '';
  searchPoste = '';
  searchnationalite = '';
  searchniveau = '';
  searchTaille = '';

  drawerOpen = signal(false);
  selectedJoueur: Joueur = { nom: '', prenoms: "", poste: '' };

  messages: ChatMessage[] = [];
  messageContent = '';
  currentUserId!: string;
  selectedJoueurId!: string;


  constructor(
    private joueursService: JoueursService,
    private agentService: AgentsService,
    private userService: UserService,
    private rechercheService: RechercheService,
    private profilJoueursService: ProfilJoueursService,
    private MediasService: MediasService,
    private authService: AuthService,
    private chatService: ChatService,
    private fileService: FileService,       // ← ajouter
    private sanitizer: DomSanitizer 
  ) {}

  ngOnInit(): void {
    this.loadJoueurs();
    this.loadAgentInfo(); // <--- automatique à la connexion
    this.email = localStorage.getItem('email') || '';
    this.role = localStorage.getItem('role') || '';

    
  }

  

  loadAgentInfo(): void {
  const userId = this.authService.getUserIdFromToken();

  if (!userId) {
    console.error("ID utilisateur introuvable dans le JWT");
    return;
  }

  this.agentService.getById(userId).subscribe({
    next: (data) => {
      this.agent = data;
      this.isFirstTime = false;
    },
    error: () => {
      this.isFirstTime = true;
      console.warn("Profil agent inexistant → création requise");
    }
  });
}

  /**  CRÉER LE PROFIL AGENT*/

  createAgent() {
    this.agentService.create(this.agent).subscribe({
      next: (data) => {
        alert("Profil agent créé avec succès !");
        this.agent = data;
        this.isFirstTime = false;
      },
      error: (err) => console.error("Erreur création agent :", err)
    });
  }

  /**  METTRE À JOUR LE PROFIL */

  updateAgent() {
    if (!this.agent.id) return;

    this.agentService.update(this.agent.id, this.agent).subscribe({
      next: () => alert("Profil mis à jour !"),
      error: (err) => console.error("Erreur update agent :", err)
    });
  }

  /**  👥 CHARGER JOUEURS*/

  loadJoueurs() {
  this.joueursService.getAll().subscribe((data) => {
    this.joueurs = data;
    this.filteredJoueurs = data;

    // ← Compter les vidéos de chaque joueur
    data.forEach(j => {
      if (j.id) {
        this.fileService.getVideosByJoueur(j.id).subscribe(videos => {
          this.videoCountMap.set(j.id!, videos.length);
        });
      }
    });
  });
  }

  /** 🔍 RECHERCHE AVANCÉE*/

  applySearch() {
    this.filteredJoueurs = this.joueurs.filter(j =>
      j.nom?.toLowerCase().includes(this.searchNom.toLowerCase()) &&
      j.prenoms?.toLowerCase().includes(this.searchprenoms.toLowerCase()) &&
      j.poste?.toLowerCase().includes(this.searchPoste.toLowerCase()) &&
      j.nationalite?.toLowerCase().includes(this.searchnationalite.toLowerCase()) &&
      j.niveau?.toLowerCase().includes(this.searchniveau.toLowerCase()) &&
      (this.searchTaille ? j.taille?.toString().includes(this.searchTaille) : true)
    );
  }

 

  openDrawer1(joueur: Joueur) {
    this.selectedJoueur = joueur;
    this.drawerOpen.set(true);
  

    // 🔥 charger le USER lié au joueur
    this.userService.getById(joueur.id!).subscribe({
      next: (data) => this.user = data,
      error: () => console.error("User joueur introuvable")
    });

  // (optionnel) charger profil / médias si séparés
    this.profilJoueursService.getProfilByJoueurId(joueur.id!).subscribe({
    next: (data) => this.profil = data
    });

    this.MediasService.getMediasByJoueurId(joueur.id!).subscribe({
    next: (data) => this.medias = data
    });
  }

    closeDrawer1() {
      this.drawerOpen.set(false);
      //this.selectedJoueur = null;
    }

  logout() {
    this.authService.logout();
    //this.router.navigate(['/connexion']);
  }
 
  getInitial(): string {
    return this.email ? this.email.charAt(1).toUpperCase() : '?';
  }

  

  exportPdf() {
  const element = document.getElementById('playerCardPdf');
  if (!element) return;

  html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');

    // Logo
    const logo = new Image();
    logo.src = 'assets/logo.png';

    logo.onload = () => {
      pdf.addImage(logo, 'PNG', 95, 10, 30, 30);
      pdf.addImage(imgData, 'PNG', 10, 45, 190, 0);
      pdf.save(`joueur-${this.selectedJoueur.nom}.pdf`);
    };
  });
  }

  
  contactByEmail() {
  if (!this.user?.email) return;

  const subject = encodeURIComponent("Intérêt pour votre profil joueur");
  const body = encodeURIComponent(
    `Bonjour ${this.selectedJoueur?.prenoms || ''},

     J’ai consulté votre profil sur RelatFoot et je souhaiterais échanger avec vous.

    Cordialement,
    ${this.agent.nomAgence}`
     );

    window.location.href = `mailto:${this.user.email}?subject=${subject}&body=${body}`;
  }

    openChatWithJoueur(joueurId: number) {
    this.selectedJoueurId = String(joueurId);
  }

  // ← Modifier openDrawer() pour charger aussi les vidéos
openDrawer(joueur: Joueur) {
  this.selectedJoueur = joueur;
  this.drawerOpen.set(true);
  this.videosJoueur = [];
  this.activeVideoId = null;

  this.userService.getById(joueur.id!).subscribe({
    next: (data) => this.user = data,
    error: () => console.error("User joueur introuvable")
  });

  this.profilJoueursService.getProfilByJoueurId(joueur.id!).subscribe({
    next: (data) => this.profil = data
  });

  this.MediasService.getMediasByJoueurId(joueur.id!).subscribe({
    next: (data) => this.medias = data
  });

  // ← Charger les vidéos du joueur
  this.fileService.getVideosByJoueur(joueur.id!).subscribe({
    next: (videos) => {
      this.videosJoueur = videos;
      console.log('Vidéos du joueur:', videos);
    },
    error: (err) => console.error('Erreur chargement vidéos:', err)
  });
}

     
// ← Lire une vidéo
lireVideoJoueur(id: number, fileName: string): void {
  // Si déjà chargée → juste afficher/cacher
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




// ← Télécharger la vidéo
telechargerVideo(video: FileModel): void {
  this.fileService.triggerDownload(video.id, video.originalFileName);
}

// ← Modifier closeDrawer pour libérer les blobs
closeDrawer() {
  this.drawerOpen.set(false);
  this.activeVideoId = null;
  this.blobUrls.forEach((url) => URL.revokeObjectURL(url as any));
  this.blobUrls.clear();
}

toggleVideosJoueur(joueur: Joueur): void {
  // Déjà ouvert pour ce joueur → fermer
  if (this.videoRowJoueurId === joueur.id) {
    this.videoRowJoueurId = null;
    this.videosJoueur = [];
    return;
  }

  // Ouvrir pour ce joueur
  this.videoRowJoueurId = joueur.id!;
  this.videosJoueur = [];
  this.loadingVideosRow = true;

  this.fileService.getVideosByJoueur(joueur.id!).subscribe({
    next: (videos) => {
      this.videosJoueur = videos;
      this.loadingVideosRow = false;
      console.log('Vidéos joueur', joueur.id, ':', videos.length);
    },
    error: (err) => {
      console.error('Erreur vidéos:', err);
      this.videosJoueur = [];
      this.loadingVideosRow = false;
    }
  });
}

}


