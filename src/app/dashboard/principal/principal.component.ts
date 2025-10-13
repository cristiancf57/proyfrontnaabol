import { Component, OnInit } from '@angular/core';
import { ActivoService } from '../../services/activos/activo.service';
import { IActivoChart } from '../models/activoChart';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {
    activoData!: IActivoChart[]

  constructor(private activoService: ActivoService){}

  ngOnInit(): void {
    this.activoService.getActivosChart().subscribe({
      next: (respoonce: any) =>{
        this.activoData = respoonce
        console.log(respoonce)
      },
      error: error =>{
        console.log(error)
      }
    })
  }

}
