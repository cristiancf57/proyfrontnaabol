import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthResponse, IUser } from '../dashboard/models/users';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private baseUrl = `${environment.apiUrl}auth`;
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor( private http: HttpClient,private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // Método principal de login que acepta email o username
  login(login: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}login`, {login, password}).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        this.currentUserSubject.next(response.user);
      })
    );
  }

  // Métodos específicos si prefieres separados
  loginWithEmail(email: string, password: string): Observable<AuthResponse> {
    return this.login(email, password);
  }

  loginWithUsername(username: string, password: string): Observable<AuthResponse> {
    return this.login(username, password);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }

  getCurrentUser(): Observable<{ user: IUser }> {
    return this.http.get<{ user: IUser }>(`${this.baseUrl}/user`).pipe(
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  // Método para refrescar los datos del usuario
  refreshUser(): void {
    this.getCurrentUser().subscribe();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  // Verificar si el usuario tiene un permiso específico
  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.permissions.includes(permission) : false;
  }

  // Verificar si el usuario tiene alguno de los permisos
  hasAnyPermission(permissions: string[]): boolean {
    const user = this.currentUserSubject.value;
    return user ? permissions.some(permission => user.permissions.includes(permission)) : false;
  }

  // Limpiar datos de autenticación
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Manejar errores de autenticación (logout automático)
  handleAuthError(): void {
    this.clearAuthData();
    // this.router.navigate(['login']);
  }

}
