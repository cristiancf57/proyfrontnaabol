import { HttpClient, HttpParams } from '@angular/common/http';
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

  // Verificar si el código ya existe
  verificarCodigoUnico(codigo: string): Observable<boolean> {
    const params = new HttpParams().set('codigo', codigo);
    return this.http.get<boolean>(`${this.baseUrl}verificar-codigo`, { params });
  }

  // Verificar si la IP ya existe
  verificarIpUnica(ip: string): Observable<boolean> {
    const params = new HttpParams().set('ip', ip);
    return this.http.get<boolean>(`${this.baseUrl}verificar-ip`, { params });
  }

  // Actualizar activo existente
  actualizarActivo(id: number, activo: any): Observable<any> {
    return this.http.put(`${this.baseUrl+'activos'}/${id}`, activo);
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
