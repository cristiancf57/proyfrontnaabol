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

  getUserDetalle(id:number) {
    return this.http.get<any>(this.baseUrl+`usuarios/${id}`)
  }

  createUser(usuario: IUserPost): Observable<IUserPost> {
    return this.http.post<IUserPost>(this.baseUrl+'usuarios', usuario);
  }

  getCargoIndividual(id:number){
    return this.http.get<any>(this.baseUrl+`designacioncargo/${id}`)
  }

  // Subir imagen de perfil
  uploadProfileImage(id:number, file: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}usuarios/${id}`, file);
  }

  // Eliminar imagen de perfil
  deleteProfileImage(): Observable<any> {
    return this.http.delete(`${this.baseUrl}profile/`);
  }
}
