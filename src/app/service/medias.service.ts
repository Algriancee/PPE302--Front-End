import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Media } from '../Models/Medias.model';
import { Observable , of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediasService {

  private apiUrl = 'http://localhost:8080/medias';

  constructor(private http: HttpClient) {}

  /** ➕ Ajouter un média */
  create(medias: Media): Observable<Media> {
    return this.http.post<Media>(this.apiUrl, medias);
  }

  /** 🔄 Modifier un média */
  update(id: number, medias: Media): Observable<Media> {
    return this.http.put<Media>(`${this.apiUrl}/${id}`, medias);
  }

  /** 📋 Lister tous les médias */
  getAll(): Observable<Media[]> {
    return this.http.get<Media[]>(this.apiUrl);
  }

  /** 🔍 Trouver un média par ID */
  getById(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.apiUrl}/${id}`);
  }

  /** 🔍 Trouver tous les médias d’un joueur */
  getMediasByJoueurId(joueurId: number): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/joueur/${joueurId}`);
  }

  /** 🔍 Trouver par type (ex: photo, vidéo, etc.) */
  getByType(type: string): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/type/${type}`);
  }

  /** ❌ Supprimer un média */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMediasByEmail(email: string): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/Medias/email/${email}`);
  }
  
}
