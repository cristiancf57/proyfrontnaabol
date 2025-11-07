import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface UserLogin {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cargo: string;
  perfil?: string;
  // otros campos que devuelva tu API
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserLogin | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) { }
  
  getUsuarios() {
    return this.http.get<any>(this.baseUrl+'usuarios')
  }
  
  // login(login: string, password: string): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}login`, { login, password }).pipe(
  //     tap(response => {
  //       if (response.user) {
  //         this.setCurrentUser(response.user);
  //       }
  //     })
  //   );
  // }

  // setCurrentUser(user: UserLogin): void {
  //   this.currentUserSubject.next(user);
  //   // Opcional: guardar en localStorage para persistencia
  //   localStorage.setItem('currentUser', JSON.stringify(user));
  // }

  // getCurrentUser(): UserLogin | null {
  //   return this.currentUserSubject.value;
  // }

  // logout(): void {
  //   this.currentUserSubject.next(null);
  //   localStorage.removeItem('currentUser');
  // }

  // // Para cargar el usuario al recargar la página
  // loadStoredUser(): void {
  //   const storedUser = localStorage.getItem('currentUser');
  //   if (storedUser) {
  //     this.currentUserSubject.next(JSON.parse(storedUser));
  //   }
  // }
}
