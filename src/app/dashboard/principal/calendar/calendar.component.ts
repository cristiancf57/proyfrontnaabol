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
    // Aquí llamas a tu servicio para obtener los datos
    this.calendarservice.getCalendario().subscribe({
      next: (data: any) => {
        this.calendary = data;
        this.mapearEventosDesdeAPI();
        this.generateCalendar();
      },
      error: (error) => {
        console.error('Error al cargar calendario:', error);
      }
    });
  }

  mapearEventosDesdeAPI(): void {
    this.events = [];

    this.calendary.forEach((item: ICalendario) => {
      const fecha = new Date(item.fecha);
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
    // Puedes personalizar cómo se muestra el título
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

  mapearEventosDesdeAPIs(): void {
    // Reiniciar el objeto events
    // this.events = {};

     // Mapear cada item del calendario al objeto events
    this.calendary.forEach((item: ICalendario) => {
      // Asumiendo que ICalendario tiene propiedades como fecha y descripcion
      const fecha = this.formatearFecha(item.fecha); // Ajusta según fecha
      const descripcion = item.activo.detalle; // Ajusta según  propiedad
      const estado = item.estado; // Ajusta según estado
      const tipo = item.activo.tipo; // Ajusta según tipo
      // this.events[fecha] = descripcion;
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

  // prevMonth() {
  //   this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  //   this.renderCalendar(this.currentDate);
  // }

  // nextMonth() {
  //   this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  //   this.renderCalendar(this.currentDate);
  // }

  // getEvent(day: number): string {
  //   if (day === 0) return '';
  //   const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
  //   const dayStr = String(day).padStart(2, '0');
  //   const year = this.currentDate.getFullYear();
  //   const fechaKey = `${year}-${month}-${dayStr}`;
    
  //   return this.events[fechaKey] || '';
  // }
}
