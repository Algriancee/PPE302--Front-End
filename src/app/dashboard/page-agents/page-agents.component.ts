import { Component , OnInit, signal,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { JoueursService } from '../../service/joueurs.service';
import { AgentsService } from '../../service/agents.service';
import { AuthService } from '../../service/auth.service';
import { RechercheService } from '../../service/recherche.service';
import { Agent } from '../../Models/Agents.model';
import { Joueur } from '../../Models/Joueurs.model';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-page-agents',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './page-agents.component.html',
  styleUrl: './page-agents.component.css'
})
export class PageAgentsComponent implements OnInit{

  /**joueurs: Joueur[] = [];
  filteredJoueurs: Joueur[] = [];

  agentForm!: FormGroup;

  selectedJoueur: Joueur | null = null;

  constructor(
    private joueursService: JoueursService,
    private agentsService: AgentsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadJoueurs();
    this.buildAgentForm();
  }

  /** Charger tous les joueurs 
  loadJoueurs() {
    this.joueursService.getAll().subscribe((data) => {
      this.joueurs = data;
      this.filteredJoueurs = data;
    });
  }

  /** Formulaire infos agent 
  buildAgentForm() {
    this.agentForm = this.fb.group({
      nomAgence: [''],
      licence: [''],
      adresseAgence: [''],
      paysAgence: ['']
    });
  }

  /** Recherche intelligente 
  searchJoueurs(event: any) {
    const query = event.target.value.toLowerCase().trim();

    this.filteredJoueurs = this.joueurs.filter(j =>
      j.nom.toLowerCase().includes(query) ||
      j.poste?.toLowerCase().includes(query) ||
      j.prenoms?.toString().includes(query) ||
      j.nationalite?.toString().includes(query) ||
      j.dateNaissance?.toLowerCase().includes(query) ||
      j.niveau?.toString().includes(query) 
    );
  }

  /** Voir les détails d’un joueur 
  voirDetails(joueur: Joueur) {
    this.selectedJoueur = joueur;
  }

  /** Enregistrer les informations de l’agent 
  saveAgent() {
    const agentData: Agent = this.agentForm.value;

    this.agentsService.create(agentData).subscribe(() => {
      alert('Informations de l’agent enregistrées !');
    });
  }*/

 activeSection: string = 'add-exercice';
 private router = inject(Router);
 //user: { email: string; role: string } | null = null;
    
  
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
  user: any = {};
  profil: any = {};
  medias: any[] = [];

  // Champs recherche
  searchNom = '';
  searchprenoms = '';
  searchPoste = '';
  searchnationalite = '';
  searchniveau = '';
  searchTaille = '';

  drawerOpen = signal(false);
  selectedJoueur: Joueur = { nom: '', prenoms: "", poste: '' };

  constructor(
    private joueursService: JoueursService,
    private agentService: AgentsService,
    private userService: UserService,
    private rechercheService: RechercheService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadJoueurs();
    this.loadAgentInfo(); // <--- automatique à la connexion
  }

  /**  CHARGER L’AGENT (email JWT)

  loadAgentInfo(): void {
    const email = this.authService.getUserEmail();
    if (!email) {
      console.error("Impossible d'obtenir l'email depuis le JWT");
      return;
    }

    this.agent.email = email; // stocké pour la création si nouvel agent

    this.agentService.getByAgentEmail(email).subscribe({
      next: (data) => {
        if (!data || !data.id) {
          // ➜ Première connexion : aucun profil trouvé
          this.isFirstTime = true;
          console.warn("Aucun profil agent trouvé. Mode création activé.");
        } else {
          // ➜ Agent déjà existant : remplir les données
          this.agent = data;
          this.isFirstTime = false;
        }
      },
      error: () => {
        console.warn("Profil agent introuvable. Mode création activé.");
        this.isFirstTime = true;
      }
    });
  }*/

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

  /** 🪟 DRAWER DETAILS JOUEUR

  openDrawer(joueur: Joueur) {
    this.selectedJoueur = joueur;
    this.drawerOpen.set(true);
  }*/

  openDrawer(joueur: Joueur) {
  this.selectedJoueur = joueur;
  this.drawerOpen.set(true);

  // 🔥 charger le USER lié au joueur
  this.userService.getById(joueur.id!).subscribe({
    next: (data) => this.user = data,
    error: () => console.error("User joueur introuvable")
  });

  // (optionnel) charger profil / médias si séparés
}

  closeDrawer() {
    this.drawerOpen.set(false);
    //this.selectedJoueur = null;
  }

  logout() {
    this.authService.logout();
    //this.router.navigate(['/connexion']);
  }
}


