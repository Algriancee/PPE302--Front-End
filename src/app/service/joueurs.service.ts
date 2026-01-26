import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Joueur } from '../Models/Joueurs.model';
import { Observable , of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JoueursService {

  private apiUrl = 'http://localhost:8080/joueurs';

  constructor(private http: HttpClient) {}

  /** ➕ Créer un joueur */
  createJoueur(joueur: Joueur): Observable<Joueur> {
    return this.http.post<Joueur>(this.apiUrl, joueur);
  }

  /** 🔄 Modifier un joueur */
  updateJoueur(id: number, joueur: Joueur): Observable<Joueur> {
    return this.http.put<Joueur>(`${this.apiUrl}/${id}`, joueur);
  }

  /** 📋 Lister tous les joueurs */
  getAll(): Observable<Joueur[]> {
    return this.http.get<Joueur[]>(this.apiUrl);
  }

  /** 🔍 Trouver un joueur par ID */
  getById(id: number): Observable<Joueur> {
    return this.http.get<Joueur>(`${this.apiUrl}/${id}`);
  }

  /** 🔍 Rechercher par nationalité */
  searchByNationalite(nationalite: string): Observable<Joueur[]> {
    return this.http.get<Joueur[]>(`${this.apiUrl}/nationalite/${nationalite}`);
  }

  /** 🔍 Rechercher par poste */
  searchByPoste(poste: string): Observable<Joueur[]> {
    return this.http.get<Joueur[]>(`${this.apiUrl}/poste/${poste}`);
  }

  /** 🔍 Rechercher par taille */
  searchByTaille(taille: number): Observable<Joueur[]> {
    return this.http.get<Joueur[]>(`${this.apiUrl}/taille/${taille}`);
  }

  /** 🔍 Rechercher par pied fort */
  searchByPiedFort(piedFort: string): Observable<Joueur[]> {
    return this.http.get<Joueur[]>(`${this.apiUrl}/piedFort/${piedFort}`);
  }

  /** 🔍 Rechercher par date de naissance (format: YYYY-MM-DD) */
  searchByDateNaissance(dateNaissance: string): Observable<Joueur[]> {
    return this.http.get<Joueur[]>(`${this.apiUrl}/dateNaissance/${dateNaissance}`);
  }

  /** ❌ Supprimer un joueur */
  deleteJoueur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getJoueurByEmail(email: string): Observable<Joueur> {
  return this.http.get<Joueur>(`${this.apiUrl}/by-email`, {
  params: { email }
});
}


}
