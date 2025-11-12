import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IActividadesDet, IActividadPost } from '../../dashboard/models/actividades';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  detalleActividad() {
    return this.http.get<IActividadesDet>(this.baseUrl+'actividades')
  }

  detallesActividad(id:number) {
    return this.http.get<IActividadesDet>(this.baseUrl+`actividades/${id}`)
  }

  createActividad(actividad: IActividadPost): Observable<IActividadPost> {
    return this.http.post<IActividadPost>(this.baseUrl+'actividades', actividad);
  }

  deleteActividad(id:number) {
    return this.http.delete<any>(this.baseUrl+`actividades/${id}`)
  }

  actividadReciente() {
    return this.http.get<IActividadesDet>(this.baseUrl+'actividad')
  }

  getActividadEst() {
    return this.http.get<any>(this.baseUrl+'actividadesest')
  }
}
