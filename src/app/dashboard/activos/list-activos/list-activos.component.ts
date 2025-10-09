import { Component, OnInit } from '@angular/core';
import { IActivo } from '../../models/activos';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-list-activos',
  templateUrl: './list-activos.component.html',
  styleUrl: './list-activos.component.css'
})
export class ListActivosComponent implements OnInit {
  actives !: IActivo[]
  constructor(private activoService: UsuarioService){}

  ngOnInit(): void {
    this.activoService.getActivos().subscribe({
      next: (responce: any) =>{
        this.actives = responce
        console.log(responce)
      },
      error: error =>{
        console.log(error)
      }
    })
  }

}
