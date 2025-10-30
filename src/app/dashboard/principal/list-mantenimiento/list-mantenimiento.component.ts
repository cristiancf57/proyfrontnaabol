import { Component, OnInit } from '@angular/core';
import { IMantenimiento, IMantenimientoPrincipal } from '../../models/mantenimiento';
import { CalendarService } from '../../../services/calendario/calendar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-mantenimiento',
  templateUrl: './list-mantenimiento.component.html',
  styleUrl: './list-mantenimiento.component.css'
})
export class ListMantenimientoComponent implements OnInit{
  mantenimientos: IMantenimientoPrincipal[] =[]
  mantenimientosFiltrados: IMantenimientoPrincipal[] = [];
  currentFilter: string = 'siguientes pendientes';
  private subscription: Subscription = new Subscription();

  constructor(private mantenimientoService: CalendarService){}
  ngOnInit(): void {
    this.datosMantenimiento();
  }

  datosMantenimiento(): void {
    this.subscription.add(
      this.mantenimientoService.getMantenimientop().subscribe({
        next: (respoonce: any) =>{
          this.mantenimientos = respoonce
          console.log('Datos para el mantenimiento: ', respoonce)
        },
        error: error =>{
          console.log(error)
        }
      })
    )
    this.mantenimientosFiltrados = [...this.mantenimientos];
  }

  filterByDate(filter: string) {
    const today = new Date();
    
    switch(filter) {
      case 'today':
        this.currentFilter = 'Hoy';
        this.mantenimientosFiltrados = this.mantenimientos.filter(item => 
          new Date(item.fecha).toDateString() === today.toDateString()
        );
        break;
      case 'month':
        this.currentFilter = 'Este Mes';
        this.mantenimientosFiltrados = this.mantenimientos.filter(item => {
          const itemDate = new Date(item.fecha);
          return itemDate.getMonth() === today.getMonth() && 
                 itemDate.getFullYear() === today.getFullYear();
        });
        break;
      default:
        this.currentFilter = 'Todos';
        this.mantenimientosFiltrados = [...this.mantenimientos];
    }
  }

  getEstadoText(estado: string): string {
    const estados: { [key: string]: string } = {
      'completado': 'Completado',
      'pendiente': 'Pendiente',
      'cancelado': 'Cancelado',
      'en_proceso': 'En Proceso'
    };
    return estados[estado] || 'Desconocido';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
