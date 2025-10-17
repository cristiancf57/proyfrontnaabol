import { Component, OnInit } from '@angular/core';
import { IActivo } from '../models/activos';
import { ActivoService } from '../../services/activos/activo.service';

@Component({
  selector: 'app-list-activos',
  templateUrl: './list-activos.component.html',
  styleUrl: './list-activos.component.css'
})
export class ListActivosComponent implements OnInit {
  activos: IActivo[]=[]
  activoFiltrados: IActivo[] = [];
  currentFilter: string = 'Today';
  searchTerm: string = '';

  constructor(private activoService:ActivoService){}

  ngOnInit(): void {
    this.datosActivos()
  }

  datosActivos(): void {
    this.activoFiltrados = [...this.activos];
      this.activoService.getActivos().subscribe({
      next: (data: any) => {
        this.activos = data;
        console.log('datos obtenidos', data)
        this.activoFiltrados = [...this.activos];
      },
      error: (error) => {
        console.error('Error loading maintenance:', error);
        this.activos = [];
        this.activoFiltrados = [];
      }
    });
  }

  filterByDate(filter: string) {
    this.currentFilter = filter === 'today' ? 'Today' : 
    filter === 'month' ? 'This Month' : 'This Year';
    // filtrado real
    this.activoFiltrados = [...this.activos];
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    if (this.searchTerm) {
      this.activoFiltrados = this.activos.filter(item => {
        const searchTerm = this.searchTerm;
        
        return (
          // Búsqueda en campos básicos
          item.detalle.toLowerCase().includes(searchTerm) ||
          item.codigo.toString().includes(searchTerm) ||
          item.area.toLowerCase().includes(searchTerm) ||
          item.marca.toLowerCase().includes(searchTerm) ||

          // Búsqueda por IP
          this.buscarPorIP(item.ip, searchTerm)
        );
      });
    } else {
      this.activoFiltrados = [...this.activos];
    }
  }

  buscarPorIP(ip: string | undefined, searchTerm: string): boolean {
    if (!ip) return false;
    // Múltiples formas de búsqueda
    return (
      ip.toLowerCase().includes(searchTerm) ||
      ip.split('.').some(segment =>
        segment.toLowerCase().includes(searchTerm)
      )
    );
  }

  getEstadoText(estado: string): string {
    const estados: { [key: string]: string } = {
      'activo': 'activo',
      'mantenimiento': 'mantenimiento',
      'baja': 'baja'
    };
    return estados[estado] || 'Unknown';
  }

  getEstadoBadgeClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'activo': 'bg-success',
      'mantenimiento': 'bg-warning',
      'baja': 'bg-danger'
    };
    return clases[estado] || 'bg-secondary';
  }

  detalle(activos: IActivo){
    console.log('Ver detalle:', activos);
  }
  editar(activos: IActivo){
    console.log('Editar:', activos);
  }
  eliminar(activos: IActivo){
    if (confirm(`¿Estás seguro de eliminar el mantenimiento #${activos.id}?`)) {
      console.log('Eliminar:', activos);
      // Llamar servicio para eliminar
      this.activoFiltrados = this.activoFiltrados.filter(m => m.id !== activos.id);
      this.activos = this.activos.filter(m => m.id !== activos.id);
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }


}
