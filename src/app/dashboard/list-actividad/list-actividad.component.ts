import { Component, OnInit } from '@angular/core';
import { IActividadesDet } from '../models/actividades';
import { ActividadService } from '../../services/actividades/actividad.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-actividad',
  templateUrl: './list-actividad.component.html',
  styleUrl: './list-actividad.component.css'
})
export class ListActividadComponent implements OnInit {
  actividades: IActividadesDet[] = []
  actividadFiltrados: IActividadesDet[] = [];
  currentFilter: string = 'Todas';
  searchTerm: string = '';

  constructor(private actividadService: ActividadService, private router: Router){}
  
  ngOnInit(): void {
    this.datosActividad()
  }

  datosActividad(): void {
    this.actividadFiltrados = [...this.actividades];
      this.actividadService.detalleActividad().subscribe({
      next: (data: any) => {
        this.actividades = data;
        console.log('datos enviados', data)
        this.actividadFiltrados = [...this.actividades];
      },
      error: (error) => {
        console.error('Error loading maintenance:', error);
        this.actividades = [];
        this.actividadFiltrados = [];
      }
    });
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    if (this.searchTerm) {
      this.actividadFiltrados = this.actividades.filter(item =>
        item.mantenimiento?.observaciones.toLowerCase().includes(this.searchTerm) ||
        item.mantenimiento?.activo?.codigo.toString().includes(this.searchTerm) ||
        item.mantenimiento?.activo?.ip.toLowerCase().includes(this.searchTerm)
      );
    } else {
      this.actividadFiltrados = [...this.actividades];
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
  detalle(actividad: IActividadesDet) {
    console.log('Ver actividad:',actividad);
    this.router.navigate(['/dashboard/actividades/detalle', actividad.id])
  }
  
  editar(actividad: IActividadesDet) {
    console.log('Editar:', actividad);
    this.router.navigate(['/dashboard/actividades/editar', actividad.id])
  }
  
  eliminar(actividad: IActividadesDet) {
    if (confirm(`¿Estás seguro de eliminar el actividad #${actividad.id}?`)) {
      console.log('Eliminar:', actividad);
      // Llamar servicio para eliminar
      this.actividadFiltrados = this.actividadFiltrados.filter(m => m.id !== actividad.id);
      this.actividades = this.actividades.filter(m => m.id !== actividad.id);
    }
  }

}
