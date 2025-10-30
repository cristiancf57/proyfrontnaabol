import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private authService: AuthService) { }

  // Observables reactivos para permisos y roles
  hasPermission(permission: string): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => user?.permissions.includes(permission) || false)
    );
  }

   hasAnyPermission(permissions: string[]): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => 
        user ? permissions.some(permission => 
          user.permissions.includes(permission)
        ) : false
      )
    );
  }

  hasAllPermissions(permissions: string[]): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => 
        user ? permissions.every(permission => 
          user.permissions.includes(permission)
        ) : false
      )
    );
  }

  hasRole(role: string): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => user?.roles.includes(role) || false)
    );
  }

  hasAnyRole(roles: string[]): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => 
        user ? roles.some(role => user.roles.includes(role)) : false
      )
    );
  }

  getCurrentUserPermissions(): Observable<string[]> {
    return this.authService.currentUser$.pipe(
      map(user => user?.permissions || [])
    );
  }

  getCurrentUserRoles(): Observable<string[]> {
    return this.authService.currentUser$.pipe(
      map(user => user?.roles || [])
    );
  }
}
