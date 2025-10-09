import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../dashboard/models/users';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url = 'http://localhost:8000/api/'

  constructor(private http: HttpClient) { }

  getUsuarios() {
    return this.http.get<IUser>(this.url+'usuarios')
  }

  createUsuario(usuario: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.url + 'usuarios', usuario)
  }

  getActivos() {
    return this.http.get<IUser>(this.url+'activos')
  }

}
