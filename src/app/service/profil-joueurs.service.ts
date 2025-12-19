import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfilJoueur } from '../Models/ProfilJoueurs.model';
import { Observable , of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilJoueursService {

  private apiUrl = 'http://localhost:8080/ProfilJoueurs';

  constructor(private http: HttpClient) {}

  /** ➕ Créer un profil */
  createProfil(profil: ProfilJoueur): Observable<ProfilJoueur> {
    return this.http.post<ProfilJoueur>(this.apiUrl, profil);
  }

  /** 🔄 Modifier un profil */
  updateProfil(id: number, profil: ProfilJoueur): Observable<ProfilJoueur> {
    return this.http.put<ProfilJoueur>(`${this.apiUrl}/${id}`, profil);
  }

  /** 📋 Lister tous les profils */
  getAll(): Observable<ProfilJoueur[]> {
    return this.http.get<ProfilJoueur[]>(this.apiUrl);
  }

  /** 🔍 Trouver un profil par ID */
  getById(id: number): Observable<ProfilJoueur> {
    return this.http.get<ProfilJoueur>(`${this.apiUrl}/${id}`);
  }

  /** 🔍 Trouver un profil par joueur ID */
  getProfilByJoueurId(joueurId: number): Observable<ProfilJoueur> {
    return this.http.get<ProfilJoueur>(`${this.apiUrl}/joueur/${joueurId}`);
  }

  /** ❌ Supprimer un profil */
  deleteProfil(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProfilByEmail(email: string): Observable<ProfilJoueur> {
    return this.http.get<ProfilJoueur>(`${this.apiUrl}/ProfilJoueurs/email/${email}`);
  }
}
