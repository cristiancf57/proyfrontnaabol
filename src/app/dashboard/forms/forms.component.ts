import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  IUserPost } from '../models/users';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent implements OnInit {
  showPassword = false
  password = ''
  form: FormGroup
  loading = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(private fb: FormBuilder, private _usuarioservice: UsuarioService){
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['',[ Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void {
  }

  // Método para enviar el formulario
  onGuardar(): void {
    if (this.form.valid) {
      this.loading = true;
      this.mensajeExito = '';
      this.mensajeError = '';

      // Preparar datos según la interface
      const userData: IUserPost = this.form.value;

      this._usuarioservice.createUser(userData).subscribe({
        next: (response: IUserPost) => {
          this.loading = false;
          this.mensajeExito = 'Usuario creado exitosamente con Nombre: ${response.nombre}','Usuario creado';
          console.log('Usuario creado', response);
          this.form.reset({
            estado: 'Activo',
            fecha: new Date().toISOString().split('T')[0]
          });
        },
        error: (error) => {
          this.loading = false;
          this.mensajeError = 'Error al crear el Usuario: ' + error.message;
          console.error('Error:', error);
        }
      });
    } else {
      this.marcarTocados();
    }
  }

  // Marcar campos como tocados para mostrar errores
  marcarTocados(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  crearUsuario(){
    console.log(this.form)
  }
}
