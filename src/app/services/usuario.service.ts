import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, IUserPost } from '../dashboard/models/users';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsuarios() {
    return this.http.get<IUser>(this.baseUrl+'usuarios')
  }

  createUsuario(usuario: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.baseUrl + 'usuarios', usuario)
  }

  // getActivos() {
  //   return this.http.get<IUser>(this.baseUrl+'activos')
  // }

  createUser(usuario: IUserPost): Observable<IUserPost> {
    return this.http.post<IUserPost>(this.baseUrl+'usuarios', usuario);
  }

}
