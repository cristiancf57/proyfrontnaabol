import { Component, OnInit } from '@angular/core';
import { IActivoChart } from '../../models/activoChart';
import { ActivoService } from '../../../services/activos/activo.service';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-activo-chart',
  templateUrl: './activo-chart.component.html',
  styleUrl: './activo-chart.component.css'
})
export class ActivoChartComponent implements OnInit {
  activoData!: IActivoChart[]
  chartOptions: EChartsOption = {}
  loading = true;

  // Datos para el gráfico
  // loading = false;

  otrosDatos: any[] = [];

  constructor(private activoService: ActivoService){}
  
  ngOnInit(): void {
    this.activoService.getActivosChart().subscribe({
      next: (respoonce: any) =>{
        this.activoData = respoonce
        console.log(respoonce)
      },
      error: error =>{
        console.log(error)
      }
    })

    this.cargarOtrosDatos();
  }

  cargarDatosActivos(): void {
    this.loading = true;
    
    this.activoService.getActivosChart().subscribe({
      next: (response:any) => {
        if (response) {
          this.actualizarGraficoConDatos(response.data);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    })
  }

  private actualizarGraficoConDatos(datos: any[]): void {
    const chartData = datos.map(item => ({
      value: item.cantidad,
      name: this.formatearNombre(item.categoria)
    }));

    this.chartOptions = {
      // ... opciones del gráfico
      series: [{
        type: 'pie',
        data: chartData
      }]
    };
  }

  private formatearNombre(categoria: string): string {
    return categoria.charAt(0).toUpperCase() + categoria.slice(1);
  }

  private cargarOtrosDatos(): void {
    // Aquí cargas otros datos de tu componente
    this.otrosDatos = [
      { nombre: 'Total Activos', valor: 177 },
      { nombre: 'En Mantenimiento', valor: 12 },
      { nombre: 'Disponibles', valor: 165 }
    ];
  }

  // Evento cuando el chart se inicializa
  onChartInit(ec: any): void {
    console.log('Gráfico inicializado', ec);
  }

  chartData = {
  labels: ['Computadoras', 'Cámaras', 'Impresoras', 'Switches', 'Laptops'],
  datasets: [
    {
      data: [44, 55, 13, 43, 22],
      backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d']
    }
  ]
}
}
