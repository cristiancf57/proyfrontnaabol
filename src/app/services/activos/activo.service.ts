import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IActivo, IActivoPost } from '../../dashboard/models/activos';
import { IActivoChart } from '../../dashboard/models/activoChart';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivoService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getActivos() {
    return this.http.get<IActivo>(this.baseUrl+'activos')
  }

  // Para datos desde API
  getActivosChart() {
    return this.http.get<IActivoChart>(this.baseUrl+'estadisticas');
  }

  crearActivo(activo: IActivoPost): Observable<IActivoPost> {
    return this.http.post<IActivoPost>(this.baseUrl+'activos', activo);
  }

  // guardar tarjeta
  guardarActivo(activo:IActivoPost): Observable<any>{
    return this.http.post(this.baseUrl+'activos', activo);
  }
}
