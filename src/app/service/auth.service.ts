import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/User.model'; 
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterRequest } from '../Models/register-request.model'
import { AuthenticationResponse } from '../Models/authentification -response.model'
import { AuthenticationRequest } from '../Models/authentification-request.model'


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = 'http://localhost:8080/api/v1/auth'; // modifie si besoin
  private tokenKey = 'jwtToken';
  private userRole = new BehaviorSubject<string | null>(null);
  private currentUserSubject = new BehaviorSubject<{ email: string, role: string } | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient, private router: Router ) {
    const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');
  if (email && role) {
    this.currentUserSubject.next({
      email: JSON.parse(email),
      role: JSON.parse(role),
    });
    }
  }


  login(credentials: AuthenticationRequest): Observable<AuthenticationResponse> {
      return this.http.post<AuthenticationResponse>(`${this.apiUrl}/authenticate`, credentials).pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
    
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          localStorage.setItem('email', JSON.stringify(payload.sub));
          localStorage.setItem('role', JSON.stringify(payload.role));
    
          const role = payload.role;
          const email = payload.sub;
          this.userRole.next(role);
          this.currentUserSubject.next({ email, role });
          this.redirectByRole(role);
        })
      );
    }
    

  register(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.clear();
    this.userRole.next(null);
    this.router.navigate(['/connexion']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  getUserRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }
  setUserRole(role: string) {
    this.userRole.next(role);
  }
  
  decodeRole(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload du token :', payload); // Ajout utile pour debug
      return payload.role;
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
      return '';
    }
  }
  login1(response: any) {
    localStorage.setItem('token', response.token);
    
    // Décoder le JWT pour extraire email et rôle
    const payload = JSON.parse(atob(response.token.split('.')[1]));
    localStorage.setItem('email', JSON.stringify(payload.sub));
    localStorage.setItem('role', JSON.stringify(payload.role));
  }


  redirectByRole(role: string) {
    if (!role) {
      console.error('Rôle non défini ou invalide.');
      this.router.navigate(['/']);
      return;
    }
    
  
    switch (role.toUpperCase()) { // Important : ton JWT contient sûrement le rôle en MAJUSCULE
      case 'JOUEURS':
        this.router.navigate(['/Page-joueurs']);
        break;
      case 'AGENTS':
        this.router.navigate(['/page-Agents']);
        break;
      case 'ADMIN':
        this.router.navigate(['/Page-Admins']);
        break;
      /*case 'USERS':
        this.router.navigate(['/user']);
        break;*/
      default:
        this.router.navigate(['/']);
        break;
    }
  }
  
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/eleves, data`);
  }
    
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }


  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user); // Crée un endpoint PUT côté backend
  }
}


