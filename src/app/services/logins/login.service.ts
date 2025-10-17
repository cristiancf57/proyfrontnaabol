import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  
  getUsuarios() {
    return this.http.get<any>(this.baseUrl+'usuarios')
  }
}
