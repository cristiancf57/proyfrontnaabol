import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.loadSript('assets/js/main.js');
  }

  private loadSript(url: string) {
    const script =document.createElement('script')
    script.src = url
    script.async = true
    document.body.appendChild(script)
  }

}
