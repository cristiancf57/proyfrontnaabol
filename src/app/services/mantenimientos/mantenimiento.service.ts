import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IMantenimiento } from '../../dashboard/models/mantenimiento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

  private baseUrl = environment.apiUrl;
  
  constructor(private http:HttpClient) { }

  detallesMantenimiento(id:number) {
    return this.http.get<IMantenimiento>(this.baseUrl+`mantenimientos/${id}`)
  }

  actualizarMantenimiento(id: number) {
    const updateEstado = {estado: 'completado'}
    return this.http.patch<IMantenimiento>(`${this.baseUrl}mantenimientos/${id}`,updateEstado);
  }

  mantenimientoActivo(id:number) {
    return this.http.get<IMantenimiento>(this.baseUrl+`mantenimientoac/${id}`)
  }
}
