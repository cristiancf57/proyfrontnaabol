import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICalendario } from '../../dashboard/models/calendario';
import { IMantenimiento, IMantenimientoDetalle, IMantenimientoPrincipal } from '../../dashboard/models/mantenimiento';
import { environment } from '../../../environments/environment';
import { interval, Observable, shareReplay, startWith, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getCalendario() {
    return this.http.get<ICalendario>(this.baseUrl+'mantenimientoc')
    // return interval(3000).pipe(
    //   startWith(0),
    //   switchMap(() => this.http.get<ICalendario[]>(`${this.baseUrl}mantenimientoc`)),
    //   shareReplay(1)
    // );
  }

  getMantenimiento(){
    return this.http.get<IMantenimientoDetalle>(this.baseUrl+'mantenimientos')
  }

  // Polling para mantenimientos
  getMantenimientop() {
    return this.http.get<IMantenimientoPrincipal>(this.baseUrl+'mantenimientod')
  //   return interval(3000).pipe(
  //     startWith(0),
  //     switchMap(() => this.http.get<IMantenimientoPrincipal[]>(`${this.baseUrl}mantenimientod`)),
  //     shareReplay(1)
  //   );
  }

}
