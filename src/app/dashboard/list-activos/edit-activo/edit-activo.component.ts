import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivoService } from '../../../services/activos/activo.service';
import { IActivoPost1 } from '../../models/activos';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-activo',
  templateUrl: './edit-activo.component.html',
  styleUrl: './edit-activo.component.css'
})
export class EditActivoComponent implements OnInit{
  myForm: FormGroup
  loading = false;
  mensajeExito = '';
  mensajeError = '';
  isEditMode = false;
  activoId!: number 
  originalCodigo: string = '';
  originalIp: string = '';
  activo!: any;
     
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private _activoService: ActivoService,private router: Router){
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
      descripcion: [''],
      fecha: [''],
      estado: ['']
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadActivo(Number(id));
    }
  }

  private loadActivo(id: number): void {
    this._activoService.detallesActivo(id).subscribe({
      next: (activoGet: any) => {
        this.activo = activoGet;
        this.activoId = activoGet.id;
        console.log('activo cargada:', activoGet)
        // Establecer el valor en el formulario
        this.myForm.patchValue({
          tipo: this.activo.tipo,
          detalle: this.activo.detalle,
          codigo: this.activo.codigo,
          marca: this.activo.marca,
          modelo: this.activo.modelo,
          serie: this.activo.serie,
          color: this.activo.color,
          area: this.activo.area,
          ip: this.activo.ip,
          ubicacion: this.activo.ubicacion,
          descripcion: this.activo.descripcion,
          fecha: this.activo.fecha,
          estado: this.activo.estado,
        }); 
      },
      error: (error) => {
        console.error('Error al cargar activo:', error);
      }
    });
  }
  

  onActualizar(): void {
    if (this.myForm.valid) {
      this.loading = true;
      this.mensajeExito = '';
      this.mensajeError = '';

      // Preparar datos según la interface
      const activoData: IActivoPost1 = {
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
        tipo: this.myForm.value.tipo,
        fecha: this.myForm.value.fecha,
        estado: this.myForm.value.estado
      };

      // console.log('ID del activo', this.activoId);

      this._activoService.actualizarActivo(this.activoId,activoData).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.mensajeExito = 'Activo modificado exitosamente','Activo moodificado';
          // console.log('Activo modificado', response);
          this.router.navigate(['/dashboard/activo']);
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

  goBack(): void {
    this.router.navigate(['/dashboard/activo']) //routerLink="/dashboard/activo"
  }

}
