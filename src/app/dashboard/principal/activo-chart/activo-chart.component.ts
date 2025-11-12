import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IActivoChart } from '../../models/activoChart';
import { ActivoService } from '../../../services/activos/activo.service';
import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-activo-chart',
  templateUrl: './activo-chart.component.html',
  styleUrl: './activo-chart.component.css'
})
export class ActivoChartComponent implements OnInit, OnDestroy {
  @ViewChild('barChart', { static: true }) barChart!: ElementRef<HTMLCanvasElement>; 
  private chart: Chart | undefined;
  loading: boolean = true;
  error: string = '';

  constructor(private activoService: ActivoService){}
  
  ngOnInit(): void {
    this.cargarDatosGrafico();
  }

  cargarDatosGrafico(): void {
    this.loading = true;
    
    this.activoService.getActivosChart().subscribe({
      next: (datos: any) => {
        this.inicializarGrafico(datos);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos del gráfico:', error);
        this.error = 'Error al cargar los datos';
        this.loading = false;
      }
    });
  }

  inicializarGrafico(datos: any): void {
    // Destruir gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Procesar datos de la API según tu estructura
    const labels = this.obtenerLabels(datos);
    const dataValues = this.obtenerValores(datos);

    this.chart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Todo los activos',
          data: dataValues,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 205, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(201, 203, 207, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 205, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(54, 162, 235, 0.7)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)'
          ],
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'ACTIVOS REGISTRADOS'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'CANTIDAD DE ACTIVOS'
            }
          },
          x: {
            title: {
              display: true,
              text: 'TIPO DE ACTIVOS'
            }
          }
        }
      }
    });
  }

  // Métodos para procesar datos de la API
  private obtenerLabels(datos: any): string[] {
    // Ejemplo: si tus datos vienen como array de objetos con propiedad 'mes'
    if (Array.isArray(datos) && datos.length > 0) {
      return datos.map(item => item.mes || item.month || item.categoria);
    }
    
    // Si no hay datos, usar meses por defecto
    return ['Computadoras', 'Impresoras', 'Mini PC', 'Switch', 'ZKTeco', 'Cámaras'];
  }

  private obtenerValores(datos: any): number[] {
    // Ejemplo: si tus datos vienen como array de objetos con propiedad 'cantidad'
    if (Array.isArray(datos) && datos.length > 0) {
      return datos.map(item => item.cantidad || item.count || item.total || 0);
    }
    
    // Datos de ejemplo si la API falla
    return [65, 59, 80, 81, 56, 55];
  }

  actualizarGrafico(): void {
    this.cargarDatosGrafico();
  }

  ngOnDestroy(): void {
    // Limpiar el gráfico al destruir el componente
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
