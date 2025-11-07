import { Component, OnInit } from '@angular/core';
import { IActivo } from '../models/activos';
import { ActivoService } from '../../services/activos/activo.service';
import { Router } from '@angular/router';

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

  constructor(private activoService:ActivoService, private router: Router){}

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

  // onSearch(event: any) {
  //   this.searchTerm = event.target.value.toLowerCase();
    
  //   if (this.searchTerm) {
  //     this.activoFiltrados = this.activos.filter(item => {
  //       const searchTerm = this.searchTerm;
        
  //       return (
  //         // Búsqueda en campos básicos con optional chaining
  //         item.detalle?.toLowerCase().includes(searchTerm) ||
  //         item.codigo?.toString().includes(searchTerm) ||
  //         // Búsqueda por IP
  //         this.buscarPorIP(item.ip, searchTerm)
  //       );
  //     });
  //   } else {
  //     this.activoFiltrados = [...this.activos];
  //   }
  // }

  onSearch(event: any) {
  // Verificación adicional del event
    if (!event || !event.target) {
      this.activoFiltrados = [...this.activos];
      return;
    }
    
    const searchValue = event.target.value;
    
    // Si no hay término de búsqueda, mostrar todos
    if (!searchValue || searchValue.trim() === '') {
      this.activoFiltrados = [...this.activos];
      return;
    }
    
    this.searchTerm = searchValue.toLowerCase().trim();
    
    this.activoFiltrados = this.activos.filter(item => {
      if (!item) return false;
      
      const searchTerm = this.searchTerm;
      
      return (
        item.detalle?.toLowerCase().includes(searchTerm) ||
        item.codigo?.toString().includes(searchTerm) ||
        this.buscarPorIP(item.ip, searchTerm)
      );
    });
  }

  private buscarPorIP(ip: any, searchTerm: string): boolean {
    if (!ip) return false;
    
    try {
      if (Array.isArray(ip)) {
        return ip.some(ipItem => 
          ipItem?.toString().toLowerCase().includes(searchTerm)
        );
      }
      
      return ip.toString().toLowerCase().includes(searchTerm);
    } catch (error) {
      console.warn('Error al buscar por IP:', error);
      return false;
    }
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
    this.router.navigate(['/dashboard/activos/detalle', activos.id]);
  }

  editar(activos: IActivo){
    console.log('Editar:', activos);
    this.router.navigate(['/dashboard/activos/edit', activos.id]);
  }
  eliminar(activos: IActivo){
    if (confirm(`¿Estás seguro de eliminar el mantenimiento #${activos.id}?`)) {
      console.log('Eliminar:', activos);
       
      this.activoFiltrados = this.activoFiltrados.filter(m => m.id !== activos.id);
      this.activos = this.activos.filter(m => m.id !== activos.id);
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }


}
