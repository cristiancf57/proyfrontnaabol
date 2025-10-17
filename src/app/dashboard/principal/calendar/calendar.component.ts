import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../../services/calendario/calendar.service';
import { ICalendario } from '../../models/calendario';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  calendary!: ICalendario[]
  currentDate: Date = new Date();
  monthYear: string = '';
  calendarDays: number[] = [];
  events: { [key: string]: string } = {}

  constructor(private calendarservice: CalendarService){}

  ngOnInit(): void {
    this.datosMantenimiento();
    // this.renderCalendar(this.currentDate);
  }

  datosMantenimiento(): void {
    this.calendarservice.getCalendario().subscribe({
      next: (response: any) =>{
        this.calendary = response
        this.mapearEventosDesdeAPI(); // Mapear los datos de la API
        this.renderCalendar(this.currentDate);
        // console.log('Datos del calendario:', response);
        console.log('Eventos mapeados:', this.events);
        // console.log(response)
      },
      error: error =>{
        console.log(error)
        this.renderCalendar(this.currentDate);
      }
    })
  }

  mapearEventosDesdeAPI(): void {
    // Reiniciar el objeto events
    this.events = {};

     // Mapear cada item del calendario al objeto events
    this.calendary.forEach((item: ICalendario) => {
      // Asumiendo que ICalendario tiene propiedades como fecha y descripcion
      const fecha = this.formatearFecha(item.fecha); // Ajusta según fecha
      const descripcion = item.observaciones; // Ajusta según  propiedad
      const estado = item.estado; // Ajusta según estado
      
      this.events[fecha] = descripcion;
    });
  }

  formatearFecha(fecha: string | Date): string {
    // Convierte la fecha al formato YYYY-MM-DD
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  renderCalendar(date: Date) {
    this.calendarDays = [];
    const year = date.getFullYear();
    const month = date.getMonth();

    this.monthYear = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Vacíos iniciales para alinear el primer día
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push(0);
    }

    // Días del mes
    for (let i = 1; i <= lastDate; i++) {
      this.calendarDays.push(i);
    }
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.renderCalendar(this.currentDate);
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.renderCalendar(this.currentDate);
  }

  getEvent(day: number): string {
    if (day === 0) return '';
    const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const year = this.currentDate.getFullYear();
    const fechaKey = `${year}-${month}-${dayStr}`;
    
    return this.events[fechaKey] || '';
  }
}
