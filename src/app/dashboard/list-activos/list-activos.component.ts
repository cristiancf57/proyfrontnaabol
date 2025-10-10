import { Component, OnInit } from '@angular/core';
import { IActivo } from '../models/activos';
import { ActivoService } from '../../services/activos/activo.service';

@Component({
  selector: 'app-list-activos',
  templateUrl: './list-activos.component.html',
  styleUrl: './list-activos.component.css'
})
export class ListActivosComponent implements OnInit {
  activos!: IActivo[]

  constructor(private activoService:ActivoService){}

  ngOnInit(): void {
    this.activoService.getActivos().subscribe({
      next: (respoonce: any) =>{
        this.activos = respoonce
        console.log(respoonce)
      },
      error: error =>{
        console.log(error)
      }
    })
  }

}
