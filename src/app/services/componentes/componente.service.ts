import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRepuestos } from '../../dashboard/models/repuestos';

@Injectable({
  providedIn: 'root'
})
export class ComponenteService {
  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getcomponentes(){
    return this.http.get<any>(this.baseUrl+'repuestos')
  }
  componenteAsignados(id:number) {
    return this.http.get<any>(this.baseUrl+`componenteas/${id}`)
  }

  accesoiosDisponibles(){
    return this.http.get<any>(this.baseUrl+'repuestosdis')
  }

  // guardar registro de componente
  guardarComponente(componente: any):Observable<any>{
    return this.http.post<any>(this.baseUrl+'componentes',componente)
  }

  // Actualizar stock
  actualizarStock(id: number, stock: number): Observable<any> {
    return this.http.patch(`${this.baseUrl+'repuestos'}/${id}`, stock);
  }

  repuestoSeleccionada(id:number) {
    return this.http.get<IRepuestos>(this.baseUrl+`repuestos/${id}`)
  }

}
