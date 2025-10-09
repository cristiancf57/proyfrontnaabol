import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { IUser } from '../models/users';

@Component({
  selector: 'app-list-usuarios',
  templateUrl: './list-usuarios.component.html',
  styleUrl: './list-usuarios.component.css'
})
export class ListUsuariosComponent implements OnInit {
  usuarios!: IUser[]
  imgUrl = '/assets/img/perfiles/'
  
  constructor(private usuarioService: UsuarioService) { }
  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (respoonce: any) =>{
        this.usuarios = respoonce
        console.log(respoonce)
      },
      error: error =>{
        console.log(error)
      }
    })
  }

}
