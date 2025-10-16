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
  activoData: IActivoChart[] =[];
  chartOptions: EChartsOption = {}
  loading = true;

  otrosDatos: any[] = [];

  // Variables para los datos separados
  chartLabels: string[] = [];
  chartValues: number[] = [];
  totalActivos: number = 0;

  constructor(private activoService: ActivoService){}
  
  ngOnInit(): void {
    this.activoService.getActivosChart().subscribe({
      next: (respoonce: any) =>{
        this.activoData = respoonce // extrare datos
        //separar datos
        console.log(respoonce)
      },
      error: error =>{
        console.log(error)
      }
    })

  }

  cargarDatos(): void {
    this.activoService.getActivosChart().subscribe({
      next: (response: any) => {
        this.activoData = response;
        this.procesarDatos();
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.loading = false;
      }
    });

    this.cargarDatos()
  }

  private procesarDatos(): void {
    // Extraer labels y valores
    this.chartLabels = this.activoData.map(item => 
      this.formatearLabel(item.categoria)
    );
    
    this.chartValues = this.activoData.map(item => item.cantidad);
    
    // Calcular total
    this.totalActivos = this.chartValues.reduce((sum, value) => sum + value, 0);
    
    // Actualizar gráfico
    this.actualizarGrafico();
  }

  private actualizarGrafico(): void {
    this.chartOptions = {
      title: {
        text: 'Distribución de Activos',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} unidades ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: '0%',
        data: this.chartLabels
      },
      series: [
        {
          name: 'Activos',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['50%', '45%'],
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c}',
            fontSize: 12
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          data: this.activoData.map((item, index) => ({
            value: item.cantidad,
            name: this.formatearLabel(item.categoria),
            itemStyle: {
              color: this.getColor(index)
            }
          }))
        }
      ]
    };
  }

  // Métodos auxiliares para el HTML
  formatearLabel(categoria: string): string {
    return categoria.charAt(0).toUpperCase() + categoria.slice(1);
  }

  calcularPorcentaje(cantidad: number): number {
    if (this.totalActivos === 0) return 0;
    return Math.round((cantidad / this.totalActivos) * 100);
  }

  getColor(index: number): string {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#C9CBCF', '#7CFFB2', '#F8FF7C', '#FF7C7C'
    ];
    return colors[index % colors.length];
  }

  
}
