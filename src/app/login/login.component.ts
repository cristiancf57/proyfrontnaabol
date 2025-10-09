import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) {}

  irDashboard(): void {
    // gurdamos los datos en el formulario o hace alguna logica
    this.router.navigate(['/dashboard'])
  }
}
