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

  actualizarMantenimiento(id: number, detalle: string) {
    const updateEstado = {estado: 'completado', observaciones: detalle}
    return this.http.patch<IMantenimiento>(`${this.baseUrl}mantenimientos/${id}`,updateEstado);
  }

  cancelarMantenimiento(id: number, detalle: string) {
    const updateEstado = {estado: 'cancelado', observaciones: detalle}
    return this.http.patch<IMantenimiento>(`${this.baseUrl}mantenimientos/${id}`,updateEstado);
  }

  deleteMantenimiento(id:number) {
    return this.http.delete<IMantenimiento>(this.baseUrl+`mantenimientos/${id}`)
  }

  mantenimientoActivo(id:number) {
    return this.http.get<IMantenimiento>(this.baseUrl+`mantenimientoac/${id}`)
  }
}
