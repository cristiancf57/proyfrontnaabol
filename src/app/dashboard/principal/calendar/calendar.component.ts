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
  // events: { [key: string]: string } = {}
  events: any[] = [];

  constructor(private calendarservice: CalendarService){}

  ngOnInit(): void {
    // this.datosMantenimiento();
    this.cargarCalendario();
    // this.renderCalendar(this.currentDate);
  }

  cargarCalendario() {
    this.calendarservice.getCalendario().subscribe({
      next: (data: any) => {
        this.calendary = data;
        this.mapearEventos();
        this.generateCalendar();
      },
      error: (error) => {
        console.error('Error al cargar calendario:', error);
      }
    });
  }

  mapearEventos(): void {
    this.events = [];

    this.calendary.forEach((item: ICalendario) => {
      const fecha = new Date(item.fecha + 'T00:00:00');
      // const fecha = item.fecha;
      const dia = fecha.getDate();
      
      const evento = {
        day: dia,
        type: item.activo.tipo.toLowerCase(),
        title: this.obtenerTituloEvento(item),
        estado: item.estado,
        fechaCompleta: item.fecha,
        id: item.id,
        activo: item.activo
      };

      this.events.push(evento);
    });
  }

  // Función para formatear el título del evento
  obtenerTituloEvento(item: ICalendario): string {
    return `${item.activo.detalle} - ${item.estado}`;
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    this.monthYear = this.currentDate.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    }).toUpperCase();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startingDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    this.calendarDays = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDay; i++) {
      this.calendarDays.push(0);
    }
    
    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push(i);
    }
  }
  prevMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  // Obtener eventos para un día específico
  getEvents(day: number): any[] {
    if (day === 0) return [];
    
    // Filtrar eventos por día y por mes/año actual
    return this.events.filter(event => {
      const eventDate = new Date(event.fechaCompleta);
      return event.day === day && 
             eventDate.getMonth() === this.currentDate.getMonth() &&
             eventDate.getFullYear() === this.currentDate.getFullYear();
    });
  }

  // Obtener clase CSS según el tipo
  getEventClass(type: string, estado: string): string {
    switch (type) {
      case 'computadora':
        if(estado=='completado'){
          return 'event-completado';
        }else{
          return 'event-computadora';
        }
      case 'nanoPC':
        if(estado=='completado'){
          return 'event-completado';
        }else{
          return 'event-computadora';
        }

      case 'impresora':
        if(estado=='completado'){
          return 'event-completado';
        }else{
          return 'event-impresora';
        }
        
      case 'laptop':
        if(estado=='completado'){
          return 'event-completado';
        }else{
          return 'event-computadora';
        }
        
      default:
        if(estado=='completado'){
          return 'event-completado';
        }else{
          return 'event-otro';
        }
        
    }
  }


  datosMantenimiento(): void {
    this.calendarservice.getCalendario().subscribe({
      next: (response: any) =>{
        this.calendary = response
        this.mapearEventos();
        this.renderCalendar(this.currentDate);
        // console.log('Eventos mapeados:', this.events);
      },
      error: error =>{
        console.log(error)
        this.renderCalendar(this.currentDate);
      }
    })
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
}
