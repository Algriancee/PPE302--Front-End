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

@Component({
  selector: 'app-page-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './page-admin.component.html',
  styleUrl: './page-admin.component.css'
})
export class PageAdminComponent implements OnInit {

  //activeSection: string = 'list';
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
  user: User = { nomUtilisaeur: "", email: '', telephone: '', role: 'JOUEURS',  };
  selectedRole:  | null = null;

  searchEmail: string = '';
  searchRole: string = 'ALL';
  adminEmail: string = '';
  adminRole: string = '';
  
  email: string = '';
  role: string = '';

  newUser: User = {
  nomUtilisaeur: '',
  //prenoms: '',
  email: '',
  password: '',
  telephone: '',
  role: "JOUEURS"
  }

  constructor(
    private agentsService: AgentsService,
    private joueursService: JoueursService,
    private authService: AuthService,
    private userService: UserService,
    private mediasService: MediasService
  ) {}

  ngOnInit(): void {
    this.loadAllUsers();
    this.email = localStorage.getItem('email') || '';
    this.role = localStorage.getItem('role') || '';
    this.loadJoueurs();
    this.loadAgents();

  }

  /** Charger tous les utilisateurs */
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

  /** Filtrer 
  applyFilters() {
    this.filteredUsers = this.allUsers.filter(u =>
      (this.searchRole === 'ALL' || u.role === this.searchRole) &&
      (this.searchEmail === '' || u.email.toLowerCase().includes(this.searchEmail.toLowerCase()))
    );
  }*/

  /** Supprimer */
  deleteUser(user: any) {
    if (!confirm(`Supprimer ${user.nom} ${user.prenoms} ?`)) return;

    if (user.role === 'AGENTS') {
      this.agentsService.delete(user.id).subscribe(() => this.loadAllUsers());
    } else if (user.role === 'JOUEURS') {
      this.joueursService.deleteJoueur(user.id).subscribe(() => this.loadAllUsers());
    }
  }

  /** Voir les médias du joueur */
  loadMedias(user: any) {
    if (user.role !== 'JOUEURS') {
      this.medias = [];
      return;
    }

    this.mediasService.getMediasByJoueurId(user.id).subscribe(data => {
      this.medias = data;
    });
  }

  /*filterRole() {
  if (this.selectedRole === "Tous") {
    this.filteredUsers = this.allUsers;
  } else {
    this.filteredUsers = this.allUsers.filter(u => u.role === this.selectedRole);
  }
 }*/

  /*createUser() {
  this.authService.createUser(this.newUser).subscribe({
    next: () => {
      alert("Utilisateur créé !");
      this.loadAllUsers();
      this.activeSection = 'list';
      this.newUser = { nom: '', prenoms: '', email: '', password: '', role: "JOUEURS" , telephone:''};
    },
    error: (err) => console.error(err)
  });
 }*/

  

 closeDrawer() {
   this.drawerOpen.set(false);
   this.selectedUser = null;
   this.medias = [];
 }
 
  logout() {
    this.authService.logout();
  }
  getInitial(): string {
    return this.email ? this.email.charAt(1).toUpperCase() : '?';
  }

  deleteJoueur(id: number) {
    if (!confirm('Supprimer ce joueur ?')) return;
    this.joueursService.deleteJoueur(id).subscribe(() => this.loadJoueurs());
  }

  deleteAgent(id: number) {
    if (!confirm('Supprimer cet agent ?')) return;
    this.agentsService.delete(id).subscribe(() => this.loadAgents());
  }

  createUser1() {
  this.authService.createUser(this.newUser).subscribe({
    next: () => {
      alert('Utilisateur créé avec succès');
      this.newUser = {
        nomUtilisaeur: '',
        email: '',
        password: '',
        telephone: '',
        role: 'USER'
      };
    },
    error: err => console.error('Erreur création user', err)
  });
}

  createUser() {
  // Vérifications
  if (!this.newUser.nomUtilisaeur || !this.newUser.email || 
      !this.newUser.password || !this.newUser.telephone) {
    alert('Tous les champs sont requis');
    return;
  }

  this.authService.createUser(this.newUser).subscribe({
    next: () => {
      alert('✅ Utilisateur créé avec succès');
      this.loadAllUsers(); // ← recharger la liste
      // Réinitialiser le formulaire
      this.newUser = {
        nomUtilisaeur: '',
        email: '',
        password: '',
        telephone: '',
        role: 'JOUEURS'
      };
    },
    error: (err) => {
      alert(err.error?.message || 'Erreur lors de la création');
      console.error('Erreur création user', err);
    }
  });
}

/*openJoueur(joueur: any) {
  this.selectedType = 'joueur';
  this.selectedJoueur = joueur;
  this.selectedAgent = null;
  this.drawerOpen.set(true);

  this.userService.getById(joueur.id).subscribe(u => this.user = u);
  this.loadMedias(joueur);
}*/

/*openAgent(agent: any) {
  this.selectedType = 'agent';
  this.selectedAgent = agent;
  this.selectedJoueur = null;
  this.drawerOpen.set(true);

  this.userService.getById(agent.id).subscribe(u => this.user = u);
}*/

openJoueur(joueur: Joueur) {
  this.selectedType = 'joueur';
  this.selectedJoueur = joueur;
  this.selectedAgent = null;

  this.drawerOpen.set(true);

  // Charger le user lié
  this.userService.getById(joueur.id!).subscribe({
    next: u => this.user = u,
    error: () => console.error('User joueur introuvable')
  });

  // Charger médias
  this.mediasService.getMediasByJoueurId(joueur.id!).subscribe({
    next: data => this.medias = data,
    error: () => this.medias = []
  });
}

openAgent(agent: Agent) {
  this.selectedType = 'agent';
  this.selectedAgent = agent;
  this.selectedJoueur = null;

  this.drawerOpen.set(true);

  this.userService.getById(agent.id!).subscribe({
    next: u => this.user = u,
    error: () => console.error('User agent introuvable')
  });
}
}
 
