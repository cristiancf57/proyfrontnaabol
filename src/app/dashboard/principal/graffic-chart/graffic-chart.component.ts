import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { ActividadService } from '../../../services/actividades/actividad.service';

@Component({
  selector: 'app-graffic-chart',
  templateUrl: './graffic-chart.component.html',
  styleUrl: './graffic-chart.component.css'
})
export class GrafficChartComponent implements OnInit, AfterViewInit {
  @ViewChild('grafficChart') chartDiv!: ElementRef;
  chart!: echarts.ECharts;
  loading: boolean = true;
  error: string = '';

  constructor(private actividadService: ActividadService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cargarDatosGrafico()
    window.addEventListener('resize', () => this.chart.resize());
  }

  cargarDatosGrafico(): void {
    this.loading = true;
    
    this.actividadService.getActividadEst().subscribe({
      next: (datos: any) => {
        this.initChart(datos);
        this.loading = false;
        console.log('datos de chart',datos)
      },
      error: (error) => {
        console.error('Error al cargar datos del gráfico:', error);
        this.error = 'Error al cargar los datos';
        this.loading = false;
      }
    });
  }

  initChart(datos: any) {
    this.chart = echarts.init(this.chartDiv.nativeElement);

    // Transformar datos
    const chartData = datos.map((item: any) => ({
      value: item.cantidad,
      name: item.categoria
    }));

    const option: echarts.EChartsOption = {
      title: {
        text: 'mantenimientos por Tipo de Activo',
        left: 'center',
        top: '0%'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${params.name}<br/>Cantidad: ${params.value} (${params.percent}%)`;
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: '15%'
      },
      series: [
        {
          name: 'Actividades',
          type: 'pie',
          radius: '70%',
          center: ['60%', '50%'],
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{b}: {c} ({d}%)'
          }
        }
      ]
    };

    this.chart.setOption(option);
  }
}
