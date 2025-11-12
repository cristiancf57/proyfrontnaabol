import { Component, OnInit } from '@angular/core';
import { IMantenimientoDetalle } from '../models/mantenimiento';
import { CalendarService } from '../../services/calendario/calendar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MantenimientoService } from '../../services/mantenimientos/mantenimiento.service';

@Component({
  selector: 'app-list-mant-detalle',
  templateUrl: './list-mant-detalle.component.html',
  styleUrl: './list-mant-detalle.component.css'
})
export class ListMantDetalleComponent implements OnInit{
  mantenimientos: IMantenimientoDetalle[] = []
  mantenimientosFiltrados: IMantenimientoDetalle[] = [];
  currentFilter: string = 'Today';
  searchTerm: string = '';

  constructor(private mantenimientoService: CalendarService, private router: Router, private route: ActivatedRoute,  private _mantenimientoService: MantenimientoService){}
  
  ngOnInit(): void {
    this.datosMantenimiento()
  }

  datosMantenimiento(): void {
    this.mantenimientosFiltrados = [...this.mantenimientos];
      this.mantenimientoService.getMantenimiento().subscribe({
      next: (data: any) => {
        this.mantenimientos = data;
        console.log('datos enviados', data)
        this.mantenimientosFiltrados = [...this.mantenimientos];
      },
      error: (error) => {
        console.error('Error loading maintenance:', error);
        this.mantenimientos = [];
        this.mantenimientosFiltrados = [];
      }
    });
  }

  filterByDate(filter: string) {
    this.currentFilter = filter === 'today' ? 'Today' : 
    filter === 'month' ? 'This Month' : 'This Year';
    // Aquí implementarías la lógica de filtrado real
    this.mantenimientosFiltrados = [...this.mantenimientos];
  }

  onSearch(event: any) {
  // Verificar que el event y target existan
    if (!event?.target) {
      this.mantenimientosFiltrados = [...this.mantenimientos];
      return;
    }
    
    this.searchTerm = event.target.value.toLowerCase();
    
    if (this.searchTerm) {
      this.mantenimientosFiltrados = this.mantenimientos.filter(item => {
        // Verificar que item y item.activo existan
        if (!item?.activo) return false;
        
        return (
          item.activo.detalle?.toLowerCase().includes(this.searchTerm) ||
          item.activo.codigo?.toString().includes(this.searchTerm) ||
          item.activo.area?.toLowerCase().includes(this.searchTerm)
        );
      });
    } else {
      this.mantenimientosFiltrados = [...this.mantenimientos];
    }
  }

  getEstadoClass(estado: string | undefined | null): string {
  const clases: { [key: string]: string } = {
    'activo': 'bg-success',
    'mantenimiento': 'bg-warning',
    'baja': 'bg-danger',
    'desconocido': 'bg-secondary'
  };
  
  return clases[estado?.toLowerCase() || 'desconocido'] || 'bg-secondary';
}

  getEstadoBadgeClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'completado': 'bg-success',
      'pendiente': 'bg-warning',
      'cancelado': 'bg-danger'
    };
    return clases[estado] || 'bg-secondary';
  }

  // Acciones
  verDetalle(mantenimiento: IMantenimientoDetalle) {
    console.log('Ver detalle:', mantenimiento);
    // Aquí puedes navegar a la página de detalle o abrir un modal
  }

  realizarMnatenimiento(mantenimiento: IMantenimientoDetalle) {
    console.log('realizar mantenimiento:', mantenimiento);
    this.router.navigate(['/dashboard/form-Actividad', mantenimiento.id],{relativeTo: this.route })
  }

  cancelar(mantenimiento: IMantenimientoDetalle) {
    console.log('Editar:', mantenimiento);
    const estado ='cancelado'
    this.cambiarEstado(mantenimiento.id, estado);
    // Aquí puedes abrir el formulario de edición
  }

  cambiarEstado(id: number, estado: string) {
    this._mantenimientoService.cancelarMantenimiento(id,estado).subscribe({
      next: (response) => {
        console.log('Estado actualizado a cancelado:', response);
        alert('se cancelo el mantenimiento')
        this.ngOnInit()
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);
        alert('Error al actualizar el estado');
      }
    });
  }

  eliminar(mantenimiento: IMantenimientoDetalle) {
    if (confirm(`¿Estás seguro de eliminar el mantenimiento #${mantenimiento.id}?`)) {
      this._mantenimientoService.deleteMantenimiento(mantenimiento.id).subscribe({
        next:(response)=>{
          console.log('mantenimiento eliminado', response)
          // this.ngOnInit()
          this.mantenimientosFiltrados = this.mantenimientosFiltrados.filter(m => m.id !== mantenimiento.id);
          this.mantenimientos = this.mantenimientos.filter(m => m.id !== mantenimiento.id);
        }
      })

    }

  }

  // Método para formatear fecha
  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

}
