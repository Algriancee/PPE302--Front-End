import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agent } from '../Models/Agents.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  private apiUrl = 'http://localhost:8080/api/agents';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.apiUrl);
  }

  getById(id: number): Observable<Agent> {
    return this.http.get<Agent>(`${this.apiUrl}/${id}`);
  }

  create(agent: Agent): Observable<Agent> {
    return this.http.post<Agent>(this.apiUrl, agent);
  }

  update(id: number, agent: Agent): Observable<Agent> {
    return this.http.put<Agent>(`${this.apiUrl}/${id}`, agent);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchBy(param: string, value: string): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/search?${param}=${value}`);
  }
}
