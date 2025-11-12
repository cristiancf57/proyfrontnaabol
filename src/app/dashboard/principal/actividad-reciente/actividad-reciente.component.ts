import { Component, OnInit } from '@angular/core';
import { IActividadesDet } from '../../models/actividades';
import { ActividadService } from '../../../services/actividades/actividad.service';

@Component({
  selector: 'app-actividad-reciente',
  templateUrl: './actividad-reciente.component.html',
  styleUrl: './actividad-reciente.component.css'
})
export class ActividadRecienteComponent implements OnInit{
  actividad: IActividadesDet[] = [] 
  searchTerm: string = '';

  constructor(private actividadService: ActividadService){}

  ngOnInit(): void {
    this.datosActividad()
  }

  datosActividad(): void {
      this.actividadService.actividadReciente().subscribe({
      next: (data: any) => {
        this.actividad = data;
        console.log('datos enviados', data)
      },
      error: (error) => {
        console.error('Error loading maintenance:', error);
        this.actividad = [];
      }
    });
  }

  // Método para determinar el color del badge según el estado/tipo
  getBadgeColor(tipo: string): string {
    const colores: {[key: string]: string} = {
      'laptop': 'text-success',
      'miniPC': 'text-success',
      'impresora': 'text-danger',
      'Monitor': 'text-danger',
      'camara': 'text-primary',
      'switch': 'text-warning',
      'router': 'text-info',
      'enrutador': 'text-info',
      'otro': 'text-muted'
    };
      
    return colores[tipo?.toLowerCase()] || colores['default'];
  }

  // Método para calcular días transcurridos
  calcularDias(fechaString: Date): string {
    if (!fechaString) return 'Fecha no válida';
  
    // Extraer solo año, mes, día sin importar la hora
    const fecha = new Date(fechaString);
    
    const ahora = new Date();
    const hoySolo = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    
    const diferenciaMs = hoySolo.getTime() - fecha.getTime();
    const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    
    if (diferenciaDias === 0) return 'Hoy';
    if (diferenciaDias === 1) return '1 día';
    if (diferenciaDias < 30) return `${diferenciaDias} días`;
    
    const meses = Math.floor(diferenciaDias / 30);
    return `${meses} mes${meses > 1 ? 'es' : ''}`;
  }

}


