import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IActivo } from '../../dashboard/models/activos';
import { IActivoChart } from '../../dashboard/models/activoChart';

@Injectable({
  providedIn: 'root'
})
export class ActivoService {

  url = 'http://localhost:8000/api/'

  constructor(private http: HttpClient) { }

  getActivos() {
    return this.http.get<IActivo>(this.url+'activos')
  }

  // Para datos desde API
  getActivosChart() {
    return this.http.get<IActivoChart>(this.url+'estadisticas');
  }
}
