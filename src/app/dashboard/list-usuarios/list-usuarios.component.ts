import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { IUser } from '../models/users';

@Component({
  selector: 'app-list-usuarios',
  templateUrl: './list-usuarios.component.html',
  styleUrl: './list-usuarios.component.css'
})
export class ListUsuariosComponent implements OnInit {
  usuarios: IUser[] = []
  imgUrl = '/assets/img/perfiles/'
  userFiltrados: IUser[] = [];
  currentFilter: string = 'Today';
  searchTerm: string = '';
  
  constructor(private usuarioService: UsuarioService) { }
  ngOnInit(): void {
    this.datosUsers()
  }

  datosUsers(): void {
    this.userFiltrados = [...this.usuarios];
      this.usuarioService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data;
        console.log('datos obtenidos', data)
        this.userFiltrados = [...this.usuarios];
      },
      error: (error) => {
        console.error('Error loading maintenance:', error);
        this.usuarios = [];
        this.userFiltrados = [];
      }
    });
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    if (this.searchTerm) {
      this.userFiltrados = this.usuarios.filter(item => {
        const searchTerm = this.searchTerm;
        
        return (
          // Búsqueda en campos básicos
          item.nombre.toLowerCase().includes(searchTerm) ||
          item.telefono.toString().includes(searchTerm) ||
          item.username.toLowerCase().includes(searchTerm)
        );
      });
    } else {
      this.userFiltrados = [...this.usuarios];
    }
  }

  detalle(users: IUser){
    console.log('Ver detalle:', users);
  }

  editar(users: IUser){
    console.log('Editar:', users);
  }
  eliminar(users: IUser){
  if (confirm(`¿Estás seguro de eliminar el mantenimiento #${users.id}?`)) {
      console.log('Eliminar:', users);
      // Llamar servicio para eliminar
      this.userFiltrados = this.userFiltrados.filter(m => m.id !== users.id);
      this.usuarios = this.usuarios.filter(m => m.id !== users.id);
    }
  }

}
