import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recherche } from '../Models/Recherche.model';
import { Observable , of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RechercheService {

  private apiUrl = 'http://localhost:8080/api/recherches';

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Recherche[]>(this.apiUrl); }

  getById(id: number) { return this.http.get<Recherche>(`${this.apiUrl}/${id}`); }

  create(data: Recherche) { return this.http.post<Recherche>(this.apiUrl, data); }

  update(id: number, data: Recherche) { return this.http.put<Recherche>(`${this.apiUrl}/${id}`, data); }

  delete(id: number) { return this.http.delete<void>(`${this.apiUrl}/${id}`); }

  // Recherche par critère
  searchByCritere(critere: string): Observable<Recherche[]> {
    return this.http.get<Recherche[]>(`${this.apiUrl}/search?critere=${critere}`);
  }
}
