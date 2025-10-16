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
  datoComputadora: IActivoChart[] = [];
  datoImpresora: IActivoChart[] = [];
  datoCamara: IActivoChart[] = [];

  constructor(private activoService: ActivoService){}

  ngOnInit(): void {
    this.activoService.getActivosChart().subscribe({
      next: (response: any) =>{
        this.activoData = response
        this.procesarCategorias(response);
      },
      error: error =>{
        console.log(error)
      }
    })

  }

  procesarCategorias(datos: IActivoChart[]): void {
    this.datoComputadora = this.obtenerComputadoras(datos);
    this.datoImpresora = this.obtenerImpresoras(datos);
    this.datoCamara = this.obtenerCamaras(datos);

    // this.mostrarResumenCategorias();
  }

  obtenerComputadoras(datos: IActivoChart[]): IActivoChart[] {
    return datos.filter(item => 
      item.categoria.toLowerCase().includes('computadora') ||
      item.categoria.toLowerCase().includes('pc') ||
      item.categoria.toLowerCase().includes('laptop') ||
      item.categoria.toLowerCase().includes('servidor') ||
      item.categoria.toLowerCase().includes('enrutador') ||
      item.categoria.toLowerCase().includes('desktop')
    );
  }

  obtenerImpresoras(datos: IActivoChart[]): IActivoChart[] {
    return datos.filter(item => 
      item.categoria.toLowerCase().includes('impresora') ||
      item.categoria.toLowerCase().includes('printer')
    );
  }

  obtenerCamaras(datos: IActivoChart[]): IActivoChart[] {
    return datos.filter(item => 
      item.categoria.toLowerCase().includes('camara') ||
      item.categoria.toLowerCase().includes('cámara') ||
      item.categoria.toLowerCase().includes('camera')
    );
  }

  mostrarResumenCategorias(): void {
    console.log('=== RESUMEN POR CATEGORÍA ===');
    console.log('Computadoras:', this.datoComputadora);
    console.log('Impresoras:', this.datoImpresora);
    console.log('Cámaras:', this.datoCamara);
  }

  getTotalComputadoras(): number {
    return this.datoComputadora.reduce((total, item) => total + item.cantidad, 0);
  }

  getTotalImpresoras(): number {
    return this.datoImpresora.reduce((total, item) => total + item.cantidad, 0);
  }

  getTotalCamaras(): number {
    return this.datoCamara.reduce((total, item) => total + item.cantidad, 0);
  }

  getTotalGeneral(): number {
    if (!this.activoData || this.activoData.length === 0) {
      return 0;
    }
    return this.activoData.reduce((total, item) => total + item.cantidad, 0);
  }

}
