import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-graffic-chart',
  templateUrl: './graffic-chart.component.html',
  styleUrl: './graffic-chart.component.css'
})
export class GrafficChartComponent implements OnInit, AfterViewInit {
  @ViewChild('grafficChart') chartDiv!: ElementRef;
  chart!: echarts.ECharts;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChart();
    window.addEventListener('resize', () => this.chart.resize());
  }

  initChart() {
    this.chart = echarts.init(this.chartDiv.nativeElement);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    };

    this.chart.setOption(option);
  }
}
