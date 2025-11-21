import { Injectable } from '@angular/core';
import { IDesignacion } from '../../dashboard/models/designacion';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesignacionService {
  private baseUrl = environment.apiUrl

  constructor(private http:HttpClient) { }
  getDesiganacion() {
    return this.http.get<IDesignacion>(this.baseUrl+'designacion')
  }
  
  detallesdesignacion(id:number) {
    return this.http.get<IDesignacion>(this.baseUrl+`designaciones/${id}`)
  }

  createDesignacion(designacion: IDesignacion): Observable<IDesignacion> {
    return this.http.post<IDesignacion>(this.baseUrl+'designaciones', designacion);
  }

  deleteDesignacion(id:number) {
    return this.http.delete<any>(this.baseUrl+`designaciones/${id}`)
  }
}
