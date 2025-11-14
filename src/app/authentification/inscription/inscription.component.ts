import { Component } from '@angular/core';
import {  inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../Models/User.model'; 
import { RegisterRequest } from '../../Models/register-request.model';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-inscription',
  imports: [CommonModule, ReactiveFormsModule,  FormsModule,RouterModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {

  nom = '';
  prenom = '';
  email = '';
  password = '';
  confirmPassword = '';
  telephone = '';
  dateInscription = '';
  role = 'eleve';

  constructor(private authService: AuthService) {}
  private router = inject(Router);
  message: string | null = null;
  
  //constructor(private router: Router) {}

  onRegister() {
    if (!this.nom || !this.prenom || !this.email || !this.password || !this.confirmPassword || !this.role) {
      alert('Tous les champs sont requis ');
      return;
    }
    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    /*if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }*/
  
    const user: RegisterRequest = {
      nom: this.nom,
      prenoms: this.prenom,
      email: this.email,
      password: this.password,
      telephone: this.telephone,
      dateInscription:this.dateInscription,
      role: this.role.toUpperCase()
    };
  
    

    this.authService.register(user).subscribe({
      next: () => {
        this.message = "Inscription réussie ! Vous allez être redirigé(e) vers la page de connexion.";
        setTimeout(() => {
          this.router.navigate(['/Connexion']);
        }, 2500); // attend 2.5 secondes avant de rediriger
      },
      error: (err) => {
        console.error("Erreur d'inscription", err);
        this.message = "Erreur pendant l'inscription. Veuillez réessayer.";
      }
    });
  }

}
