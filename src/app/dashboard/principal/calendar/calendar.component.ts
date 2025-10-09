import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  monthYear: string = '';
  calendarDays: number[] = [];
  events: { [key: string]: string } = {
    '2025-10-10': 'Mantenimiento PC1',
    '2025-10-15': 'Mantenimiento PC2',
    '2025-10-20': 'Mantenimiento Servidor'
  };

  ngOnInit(): void {
    this.renderCalendar(this.currentDate);
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
    return this.events[`${year}-${month}-${dayStr}`] || '';
  }
}
