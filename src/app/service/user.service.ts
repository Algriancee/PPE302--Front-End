import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  

   private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/user/${id}`);
  }
}
