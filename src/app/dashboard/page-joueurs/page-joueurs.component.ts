import { Component } from '@angular/core';
import {  OnInit } from '@angular/core';
import { Joueur } from '../../Models/Joueurs.model';
import { ProfilJoueur } from '../../Models/ProfilJoueurs.model';
import { Media } from '../../Models/Medias.model';
import { JoueursService } from '../../service/joueurs.service';
import { AuthService } from '../../service/auth.service';
import { ProfilJoueursService } from '../../service/profil-joueurs.service';
import { MediasService } from '../../service/medias.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-page-joueurs',
  imports: [CommonModule, FormsModule],
  templateUrl: './page-joueurs.component.html',
  styleUrl: './page-joueurs.component.css'
})
export class PageJoueursComponent {
  section: string = 'add-exercice';

  
  joueurs: Joueur = {nom: '', prenoms:"", email:'', telephone:'', role:'JOUEURS', poste:''};
  profil: ProfilJoueur = {};
  medias: Media[] = [];
  mediaForm: Media = { type: '', url: '', description: '' };

  emailUtilisateur = '';

  constructor(
    private joueursService: JoueursService,
    private authService: AuthService,
    private profilJoueursService: ProfilJoueursService,
    private mediasService: MediasService,
  ) {}

  ngOnInit(): void {
    this.emailUtilisateur = JSON.parse(localStorage.getItem('email') || '""');
    if (this.emailUtilisateur) {
      this.loadJoueur();
      this.loadProfil();
      this.loadMedias();
    }
  }

  // 🔹 Charger les informations du joueur connecté
  loadJoueur(): void {
    this.joueursService.getJoueurByEmail(this.emailUtilisateur).subscribe({
      next: (data) => {
        this.joueurs = data;
        console.log('Joueur chargé :', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du joueur :', err);
      }
    });
  }

  // 🔹 Charger le profil du joueur
  loadProfil(): void {
    this.profilJoueursService.getProfilByEmail(this.emailUtilisateur).subscribe({
      next: (data) => {
        this.profil = data;
        console.log('Profil chargé :', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil :', err);
      }
    });
  }

  // 🔹 Charger les médias du joueur
  loadMedias(): void {
    this.mediasService.getMediasByEmail(this.emailUtilisateur).subscribe({
      next: (data) => {
        this.medias = data;
        console.log('Médias chargés :', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des médias :', err);
      }
    });
  }

  // 🔹 Créer un joueur
  createJoueur(): void {
    this.joueursService.createJoueur(this.joueurs).subscribe({
      next: (data) => {
        alert('Joueur créé avec succès !');
        this.loadJoueur();
      },
      error: (err) => {
        console.error('Erreur lors de la création du joueur :', err);
      }
    });
  }

  // 🔹 Mettre à jour les infos du joueur
  updateJoueur(): void {
    this.joueursService.updateJoueur(this.joueurs.id!, this.joueurs).subscribe({
      next: () => alert('Joueur mis à jour avec succès !'),
      error: (err) => console.error('Erreur de mise à jour du joueur :', err)
    });
  }

  // 🔹 Créer un profil joueur
  createProfil(): void {
    this.profil.joueur = this.joueurs;
    this.profilJoueursService.createProfil(this.profil).subscribe({
      next: () => {
        alert('Profil créé avec succès !');
        this.loadProfil();
      },
      error: (err) => console.error('Erreur lors de la création du profil :', err)
    });
  }

  // 🔹 Mettre à jour le profil
  updateProfil(): void {
    this.profilJoueursService.updateProfil(this.profil.id!, this.profil).subscribe({
      next: () => alert('Profil mis à jour !'),
      error: (err) => console.error('Erreur de mise à jour du profil :', err)
    });
  }

  // 🔹 Supprimer le profil
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

  /* 🔹 Ajouter un média
  createMedia(media: Media): void {
    media.joueur = this.joueurs;
    this.mediasService.create(media).subscribe({
      next: () => {
        alert('Média ajouté !');
        this.loadMedias();
      },
      error: (err) => console.error('Erreur ajout média :', err)
    });
  }*/

     createMedia(): void {
    const mediaToSend: Media = { ...this.mediaForm, joueur: this.joueurs };
    this.mediasService.create(mediaToSend).subscribe({
      next: () => {
        alert('Média ajouté !');
        this.mediaForm = { type: '', url: '', description: '' }; // reset form
        this.loadMedias();
      },
      error: (err) => console.error('Erreur ajout média :', err)
    });
  }

  // 🔹 Supprimer un média
  deleteMedia(id: number): void {
    if (confirm('Supprimer ce média ?')) {
      this.mediasService.delete(id).subscribe({
        next: () => {
          alert('Média supprimé.');
          this.loadMedias();
        },
        error: (err) => console.error('Erreur suppression média :', err)
      });
    }
  }

  logout() {
    this.authService.logout();
  }

}
