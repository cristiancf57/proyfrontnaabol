import { Component, OnInit } from '@angular/core';
import { IPermission, IRole, IRoles } from '../models/users';
import { RoleService } from '../../services/roles/role.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  roles: any[] =[];
  permissions: any[] = [];
  loading = false;
  error = '';

  users: any[] = [];
  availableRoles: string[] = [];
  successMessage = '';

  selectedUser: any | null = null;
  selectedRole = '';

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.getRoles()
    this.loadData()
  }

  getRoles(): void {
    this.loading = true;
    this.error = '';
    this.roleService.getRoles().subscribe({
      next: (response: any) => {
        this.roles = response || [];
        this.permissions = response.permissions || [];
        console.log('datos de roles', response)
        console.log('Datos cargados:', {
          roles: this.roles,
          permissions: this.permissions
        });
        this.loading = false
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.error = 'Error al cargar los datos';
        this.loading = false;
        this.roles = []; 
        this.permissions = []; 
      }
    });
  }

  getPermissions(): void {
    this.loading = true;
    this.roleService.getPermissions().subscribe({
      next: (response: any) => {
        // this.permissions = response
        this.loading = false
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
        this.loading = false;
      }
    });
  }

  // Método para asignar rol a usuario
  assignRoleToUser(userId: number, roleName: string): void {
    this.roleService.assignRole(userId, roleName).subscribe({
      next: (response) => {
        console.log('Rol asignado correctamente', response);
      },
      error: (error) => {
        console.error('Error asignando rol:', error);
      }
    });
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    // Cargar usuarios y roles en paralelo
    this.roleService.getUsersWithRoles().subscribe({
      next: (response:any) => {
        this.users = response;
        console.log('usuarios', response)
        this.loadAvailableRoles();
      },
      error: (error) => {
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  loadAvailableRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (response:any) => {
        this.availableRoles = response.map((role: any) => role.name);
        console.log('desde select', this.availableRoles)
        this.loading = false;
      },
      error: (error) => {
        this.availableRoles = [];
        this.loading = false;
      }
    });
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.selectedRole = '';
    this.error = '';
    this.successMessage = '';
  }

  // assignRole(): void {
  //   if (!this.selectedUser || !this.selectedRole) {
  //     this.error = 'Selecciona un usuario y un rol';
  //     return;
  //   }

  //   console.log('Enviando datos:', {
  //     userId: this.selectedUser.id,
  //     role: this.selectedRole
  //   });

  //   this.loading = true;
  //   this.roleService.assignRole(this.selectedUser.id, this.selectedRole).subscribe({
  //     next: (response) => {
  //       this.successMessage = `Rol "${this.selectedRole}" asignado correctamente a ${this.selectedUser?.nombre}`;
  //       console.log('Respuesta del servidor:', response);

  //       this.loadData()
        
  //       // Actualizar el usuario en la lista
  //       // const userIndex = this.users.findIndex(u => u.id === this.selectedUser!.id);
  //       // if (userIndex !== -1) {
  //       //   this.users[userIndex] = response.user;
  //       // }
        
  //       this.loading = false;
  //       this.selectedRole = '';
  //     },
  //     error: (error) => {
  //       this.error = 'Error al asignar el rol';
  //       this.loading = false;
  //     }
  //   });
  // }

  // user-management.component.ts - VERSIÓN SIMPLIFICADA
  assignRole(): void {
    if (!this.selectedUser || !this.selectedRole) {
      this.error = 'Selecciona un usuario y un rol';
      return;
    }

    this.loading = true;
    this.error = '';

    this.roleService.assignRole(this.selectedUser.id, this.selectedRole).subscribe({
      next: (response: any) => {
        // Manejar diferentes estructuras de respuesta
        const userData = response.user || response.data || response;
        console.log('al guardar', response)
        
        if (userData && userData.id) {
          // Actualizar el usuario en la lista
          const index = this.users.findIndex(u => u.id === userData.id);
          if (index !== -1) {
            this.users[index] = userData;
          }
        }
        
        this.successMessage = response.message || `Rol "${this.selectedRole}" asignado correctamente`;
        this.loading = false;
        this.selectedRole = '';
      },
      error: (error: any) => {
        this.error = error.error?.message || error.message || 'Error al asignar el rol';
        this.loading = false;
      }
    });
  }

  removeRole(user: any, role: string): void {
    if (!confirm(`¿Estás seguro de remover el rol "${role}" de ${user.name}?`)) {
      return;
    }

    this.loading = true;
    this.roleService.removeRole(user.id, role).subscribe({
      next: (response) => {
        this.successMessage = `Rol "${role}" removido correctamente de ${user.name}`;
        
        // Actualizar el usuario en la lista
        const userIndex = this.users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          this.users[userIndex] = response.user;
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al remover el rol';
        this.loading = false;
      }
    });
  }

  clearMessages(): void {
    this.error = '';
    this.successMessage = '';
  }
}
