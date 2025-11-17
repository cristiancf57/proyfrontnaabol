import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivoService } from '../../../services/activos/activo.service';
import { ToastrService } from 'ngx-toastr';
import { IActivo } from '../../models/activos';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.css'
})
export class ManualComponent implements OnInit{
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  
  codigoEncontrado: string = ''
  mensaje: string = ''
  loading: boolean = false
  mostrarFormulario: boolean = false
  mensajeExito = ''
  mensajeError = ''
  codigoManual: string = ''
  searchControl = new FormControl('')
  
  constructor(private router: Router, private activoService: ActivoService,  private toastr: ToastrService, ){
    this.setupAutoSearch()
  }
  
  ngOnInit(): void {

  }

  private setupAutoSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.trim()) {
          this.buscarPorCodigo(value.trim());
        }
      });
  }

  async buscarPorCodigo(datoCompleto: string): Promise<void> {
    this.loading = true;
    this.mensaje = `Buscando: ${datoCompleto}`;

    const match = datoCompleto.match(/^(\d+)/);
    const codigo = match ? match[1] : '';

    try {
      this.activoService.buscarCodigo(codigo).subscribe({
        next: (response: IActivo) => {
          this.loading = false;
          console.log('Respuesta completa:', response);
          
          if (response && Array.isArray(response) && response.length > 0) {
            const activo = response[0];
            this.mensaje = 'Código encontrado!'
            this.siguienteBusqueda();
            
            if (activo && activo.id) {
              console.log('id encontrado',activo.id)
              this.router.navigate(['/dashboard/activos/detalle', activo.id]);
            } else {
              console.warn('ID no recibido en el activo:', activo);
              this.mensaje = 'Código encontrado, pero no tiene ID válido';
            }
          } else {
            this.mensaje = 'Código no encontrado en el sistema';
            this.router.navigate(['dashboard/buscar-activo'], {queryParams: { dato: datoCompleto }});
            this.siguienteBusqueda();
          }
        },
        error: (error) => {
          if (error.status === 404) {
          } else {
            this.loading = false;
            this.mensaje = 'Error al buscar el código en el sistema';
            console.error('Error en búsqueda:', error);
          }
        }
      });

    } catch (error) {
      this.loading = false;
      this.mensaje = 'Error al procesar el código';
      console.error('Error:', error);
    }
  }

  private siguienteBusqueda(): void {
    this.searchControl.setValue('', { emitEvent: false });
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }
}
