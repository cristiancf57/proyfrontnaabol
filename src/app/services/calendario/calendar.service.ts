import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICalendario } from '../../dashboard/models/calendario';
import { IMantenimiento } from '../../dashboard/models/mantenimiento';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  url = 'http://localhost:8000/api/'

  constructor(private http:HttpClient) { }

  getCalendario() {
    return this.http.get<ICalendario>(this.url+'mantenimientos')
  }

  getMantenimiento(){
    return this.http.get<IMantenimiento>(this.url+'mantenimientos')
  }
}
