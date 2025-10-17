import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule , FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ActivoService } from '../../../services/activos/activo.service';
import { IActivoPost } from '../../models/activos';

@Component({
  selector: 'app-form-activo',
  templateUrl: './form-activo.component.html',
  styleUrl: './form-activo.component.css',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, CommonModule, ReactiveFormsModule, FormsModule]
})
export class FormActivoComponent implements OnInit {
  myForm: FormGroup
  loading = false;
  mensajeExito = '';
  mensajeError = '';
  isEditMode = false;
  activoId: number | null = null;
  originalCodigo: string = '';
  originalIp: string = '';
   
  constructor(private fb: FormBuilder, private _activoService: ActivoService){
    this.myForm = this.fb.group({
      detalle: ['', Validators.required],
      codigo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      serie: ['', Validators.required],
      color: ['', Validators.required],
      area: ['', Validators.required],
      ip: ['', Validators.required],
      ubicacion: ['', Validators.required],
      tipo: ['', Validators.required],
      descripcion: ['']
    })
  }
  
  ngOnInit(): void {
    
  }

  // Método para enviar el formulario
  onGuardar(): void {
    if (this.myForm.valid) {
      this.loading = true;
      this.mensajeExito = '';
      this.mensajeError = '';

      // Preparar datos según la interface
      const activoData: IActivoPost = {
        detalle: this.myForm.value.detalle,
        codigo: this.myForm.value.codigo,
        marca: this.myForm.value.marca,
        modelo: this.myForm.value.modelo,
        serie: this.myForm.value.serie,
        color: this.myForm.value.color,
        area: this.myForm.value.area,
        ip: this.myForm.value.ip,
        ubicacion: this.myForm.value.ubicacion,
        descripcion: this.myForm.value.descripcion,
        tipo: this.myForm.value.tipo
      };

      this._activoService.crearActivo(activoData).subscribe({
        next: (response: IActivoPost) => {
          this.loading = false;
          this.mensajeExito = 'Activo creado exitosamente con Codigo: ${response.codigo}','Activo creado';
          console.log('Activo creado');
          this.myForm.reset({
            estado: 'Activo',
            fecha: new Date().toISOString().split('T')[0]
          });
        },
        error: (error) => {
          this.loading = false;
          this.mensajeError = 'Error al crear el activo: ' + error.message;
          console.error('Error:', error);
        }
      });
    } else {
      this.marcarCamposComoTocados();
    }
  }

  // Marcar campos como tocados para mostrar errores
  marcarCamposComoTocados(): void {
    Object.keys(this.myForm.controls).forEach(key => {
      const control = this.myForm.get(key);
      control?.markAsTouched();
    });
  }

}
