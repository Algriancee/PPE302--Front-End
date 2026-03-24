import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';



@Component({
  selector: 'app-validation',
  imports: [ReactiveFormsModule, RouterModule,  FormsModule,CommonModule],
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.css'
})
export class ValidationComponent {

   code: string = '';
  message: string = '';
  erreur: string = '';
  chargement: boolean = false;
  codeInputs: string[] = ['', '', '', '', '', ''];



  constructor(private authService: AuthService, private router: Router) {}

  onKey(index: number, event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;
  const key = event.key;

  console.log('Key pressed:', key, 'at index:', index);

  // Backspace — effacer et reculer
  if (key === 'Backspace') {
    this.codeInputs[index] = '';
    input.value = '';
    if (index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
    return;
  }

  // Accepter seulement les chiffres
  if (!/^\d$/.test(key)) {
    input.value = '';
    return;
  }

  // Enregistrer le chiffre
  this.codeInputs[index] = key;
  input.value = key;

  console.log('codeInputs:', this.codeInputs);

  // Avancer à la case suivante
  if (index < 5) {
    const next = document.getElementById(`code-${index + 1}`);
    if (next) (next as HTMLInputElement).focus();
  }
  }


  onValider() {
  this.code = this.codeInputs.join('');
  console.log('Code final:', this.code);
  console.log('Longueur:', this.code.length);

  if (this.code.length !== 6) {
    this.erreur = 'Veuillez entrer les 6 chiffres du code';
    return;
  }

  this.chargement = true;
  this.erreur = '';
  this.message = '';

  this.authService.validerCode(this.code).subscribe({
    next: () => {
        this.chargement = false;
        this.message = '✅ Compte activé ! Redirection en cours...';
        
        setTimeout(() => this.router.navigate(['/Connexion']), 2000);
      },
      error: (err) => {
        this.chargement = false;
        
        this.codeInputs = ['', '', '', '', '', ''];
        document.querySelectorAll('.code-box').forEach((input) => {
          (input as HTMLInputElement).value = '';
        });
        
        const first = document.getElementById('code-0');
        if (first) (first as HTMLInputElement).focus();

        this.erreur = err.error?.message || 'Code invalide ou expiré';
      }
  });
  }


  // Gestion des 6 cases séparées
  onInput1(index: number, event: any) {
    const value = event.target.value;
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
    this.code = this.codeInputs.join('');
  }

  onInput(index: number, event: any) {
  const input = event.target as HTMLInputElement;
  
  // Garder seulement un chiffre
  const digit = input.value.replace(/\D/g, '').slice(-1);
  
  // Mettre à jour le tableau ET l'input
  this.codeInputs[index] = digit;
  input.value = digit; // ← forcer la valeur affichée

  if (!digit) return;

  
  }

  onKeydown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this.codeInputs[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  }

  onValider1() {
    this.code = this.codeInputs.join('');

    if (this.code.length !== 6) {
      this.erreur = 'Veuillez entrer les 6 chiffres du code';
      return;
    }

    this.chargement = true;
    this.erreur = '';
    this.message = '';

    this.authService.validerCode(this.code).subscribe({
      next: (res) => {
        this.chargement = false;
        this.message = '✅ Compte activé avec succès !';
        setTimeout(() => this.router.navigate(['/Connexion']), 2000);
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.error?.message || 'Code invalide ou expiré';
      }
    });
  }

  onValider2() {
  this.code = this.codeInputs.join('');
  
  console.log('Code saisi :', this.code);           // ← voir le code
  console.log('Longueur :', this.code.length);      // ← voir la longueur

  if (this.code.length !== 6) {
    this.erreur = 'Veuillez entrer les 6 chiffres du code';
    console.log('Erreur longueur !');
    return;
  }

  this.chargement = true;
  console.log('Appel API en cours...');             // ← voir si l'API est appelée

  this.authService.validerCode(this.code).subscribe({
    next: () => {
      console.log('Succès !');
      this.chargement = false;
      this.message = '✅ Compte activé avec succès !';
      setTimeout(() => this.router.navigate(['/connexion']), 2000);
    },
    error: (err) => {
      console.log('Erreur API :', err);
      this.chargement = false;
      this.erreur = err.error?.message || 'Code invalide ou expiré';
    }
  });
}

}
