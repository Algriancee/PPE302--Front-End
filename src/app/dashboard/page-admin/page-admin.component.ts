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

@Component({
  selector: 'app-page-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './page-admin.component.html',
  styleUrl: './page-admin.component.css'
})
export class PageAdminComponent implements OnInit {

  activeSection: string = 'list';

  drawerOpen = signal(false);
  selectedUser: any = null;

  allUsers: (Agent | Joueur)[] = [];
  filteredUsers: (Agent | Joueur)[] = [];
  medias: any[] = [];
  selectedRole:  | null = null;

  searchEmail: string = '';
  searchRole: string = 'ALL';
  adminEmail: string = '';
  adminRole: string = '';

  newUser: User = {
  nom: '',
  prenoms: '',
  email: '',
  password: '',
  telephone: '',
  role: "JOUEURS"
  }

  constructor(
    private agentsService: AgentsService,
    private joueursService: JoueursService,
    private authService: AuthService,
    private mediasService: MediasService
  ) {}

  ngOnInit(): void {
    this.loadAllUsers();
    this.adminEmail = localStorage.getItem('email') || '';
    this.adminRole = localStorage.getItem('role') || '';
  }

  /** Charger tous les utilisateurs */
  loadAllUsers() {
    this.authService.getAllUsers().subscribe(users => {
      this.allUsers = users;
      this.filteredUsers = users;
    });
  }

  /** Filtrer */
  applyFilters() {
    this.filteredUsers = this.allUsers.filter(u =>
      (this.searchRole === 'ALL' || u.role === this.searchRole) &&
      (this.searchEmail === '' || u.email.toLowerCase().includes(this.searchEmail.toLowerCase()))
    );
  }

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

  filterRole() {
  if (this.selectedRole === "Tous") {
    this.filteredUsers = this.allUsers;
  } else {
    this.filteredUsers = this.allUsers.filter(u => u.role === this.selectedRole);
  }
 }

    createUser() {
  this.authService.createUser(this.newUser).subscribe({
    next: () => {
      alert("Utilisateur créé !");
      this.loadAllUsers();
      this.activeSection = 'list';
      this.newUser = { nom: '', prenoms: '', email: '', password: '', role: "JOUEURS" , telephone:''};
    },
    error: (err) => console.error(err)
  });
 }

  openDrawer(user: any) {
    this.selectedUser = user;
    this.drawerOpen.set(true);

   // Charger médias seulement si joueur
   if (user.role === 'JOUEURS') {
     this.loadMedias(user);
   } else {
     this.medias = [];
   }
  }

 closeDrawer() {
   this.drawerOpen.set(false);
   this.selectedUser = null;
   this.medias = [];
 }
}
 
