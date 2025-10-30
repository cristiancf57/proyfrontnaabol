import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder ,private authService: AuthService,private router: Router) {
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

  // onSubmit(): void {
  //   this.loading = true;
  //   this.error = '';

  //   this.authService.login(this.login, this.password).subscribe({
  //     next: () => {
  //       this.loading = false;
  //       this.router.navigate(['/dashboard']);
  //     },
  //     error: (error) => {
  //       this.loading = false;
  //       this.error = error.error?.message || 'Error en el login';
  //     }
  //   });
  // }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const { login, password } = this.loginForm.value;

    this.authService.login(login, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Error en el login. Verifique sus credenciales.';
        // Opcional: limpiar el formulario en caso de error
        this.loginForm.get('password')?.reset();
      }
    });
  }

}
