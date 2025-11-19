import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/logins/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  logo='assets/img/fondos/logo.png'
  login = '';
  password = '';
  error = '';
  loading = false;

  constructor(private fb: FormBuilder ,private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {}

  irDashboard(): void {
    // gurdamos los datos en el formulario o hace alguna logica
    this.router.navigate(['dashboard'])
  }

  irforms(): void {
    // gurdamos los datos en el formulario o hace alguna logica
    this.router.navigate(['forms'])
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const { login, password } = this.loginForm.value;

    this.authService.login(login, password).subscribe({
      next: (response) => {
        console.log('dato obtenidos en login',response)
        console.log('Intentando redirigir a /dashboard');
        // Guarda el token o usuario
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.loading = false;
        // this.router.navigate(['/dashboard']);
        // Verifica que la ruta existe
        console.log('Redirigiendo a /dashboard...');
        this.router.navigate(['/dashboard'])
          .then(success => {
            if (success) {
              console.log('Redirección exitosa');
            } else {
              console.error('No se pudo navegar a /dashboard');
              // Fallback
              // window.location.href = '/dashboard';
            }
          });
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Error en el login. Verifique sus credenciales.';
        this.loginForm.get('password')?.reset();
      }
    });
  }

}
