import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showPassword = false;
  password = '';

  constructor(private router: Router) {}

  irDashboard(): void {
    // gurdamos los datos en el formulario o hace alguna logica
    this.router.navigate(['/dashboard'])
  }

  irforms(): void {
    // gurdamos los datos en el formulario o hace alguna logica
    this.router.navigate(['/forms'])
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
