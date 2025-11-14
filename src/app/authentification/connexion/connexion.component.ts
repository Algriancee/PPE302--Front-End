import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { User } from '../../Models/User.model';
import { AuthenticationRequest } from '../../Models/authentification-request.model';

@Component({
  selector: 'app-connexion',
  imports: [ReactiveFormsModule, RouterModule,  FormsModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {

  email = '';
  password= '';
  constructor(private authService: AuthService) {}

  onLogin() {
    const credentials = {
      email: this.email,
      password: this.password
    };
  
    this.authService.login(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.authService.redirectByRole(response.role); // ✅ c’est ici qu’on redirige
      },
      error: (err) => {
        console.error("Erreur de connexion", err);
        alert("Email ou mot de passe incorrect.");
      }
    });
  }

}
