import { Component, OnInit } from '@angular/core';
import { IMantenimientoDetalle } from '../models/mantenimiento';
import { CalendarService } from '../../services/calendario/calendar.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private mantenimientoService: CalendarService, private router: Router, private route:ActivatedRoute){}
  
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

  // onSearch(event: any) {
  //   this.searchTerm = event.target.value.toLowerCase();
  //   if (this.searchTerm) {
  //     this.mantenimientosFiltrados = this.mantenimientos.filter(item =>
  //       item.activo?.detalle.toLowerCase().includes(this.searchTerm) ||
  //       item.activo?.codigo.toString().includes(this.searchTerm) ||
  //       item.activo?.area.toLowerCase().includes(this.searchTerm)
  //     );
  //   } else {
  //     this.mantenimientosFiltrados = [...this.mantenimientos];
  //   }
  // }

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
    this.router.navigate(['../form-Actividad', mantenimiento.id],{relativeTo: this.route })
  }

  editar(mantenimiento: IMantenimientoDetalle) {
    console.log('Editar:', mantenimiento);
    // Aquí puedes abrir el formulario de edición
  }

  eliminar(mantenimiento: IMantenimientoDetalle) {
    if (confirm(`¿Estás seguro de eliminar el mantenimiento #${mantenimiento.id}?`)) {
      console.log('Eliminar:', mantenimiento);
      // Llamar servicio para eliminar
      this.mantenimientosFiltrados = this.mantenimientosFiltrados.filter(m => m.id !== mantenimiento.id);
      this.mantenimientos = this.mantenimientos.filter(m => m.id !== mantenimiento.id);
    }
  }

  // Método para formatear fecha
  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

}
