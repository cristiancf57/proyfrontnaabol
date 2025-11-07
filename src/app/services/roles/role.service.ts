import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPermissions, IRole, IRoles } from '../../dashboard/models/users';

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface AssignRoleRequest {
  role: string;
}

export interface SyncRolesRequest {
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios con sus roles
  getUsersWithRoles(): Observable<{ success: boolean; users: User[] }> {
    return this.http.get<{ success: boolean; users: User[] }>(this.baseUrl+'usuarios');
  }

  // Asignar un rol a un usuario
  assignRole(userId: number, role: string): Observable<any> {
    return this.http.post(`${this.baseUrl+'usuarios'}/${userId}/assign-role`, { role });
  }

  // Sincronizar múltiples roles
  syncRoles(userId: number, roles: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl+'usuarios'}/${userId}/sync-roles`, { roles });
  }

  // Remover un rol
  removeRole(userId: number, role: string): Observable<any> {
    return this.http.post(`${this.baseUrl+'usuarios'}/${userId}/remove-role`, { role });
  }

  getRoles(){
    return this.http.get<IRole>(this.baseUrl+'roles')
  }
  getPermissions(){
    return this.http.get<IPermissions>(this.baseUrl+'permissions')
  }
  
}
