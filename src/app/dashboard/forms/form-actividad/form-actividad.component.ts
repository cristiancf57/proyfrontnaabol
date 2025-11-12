import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MantenimientoService } from '../../../services/mantenimientos/mantenimiento.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMantenimiento } from '../../models/mantenimiento';
import { IActividadesDet, IActividadPost } from '../../models/actividades';
import { ActividadService } from '../../../services/actividades/actividad.service';
import { ActivoService } from '../../../services/activos/activo.service';

@Component({
  selector: 'app-form-actividad',
  templateUrl: './form-actividad.component.html',
  styleUrl: './form-actividad.component.css'
})
export class FormActividadComponent implements OnInit{
  mantenimiento: any;
  activo: any;
  tipoActivo = ''
  tipoMantenimiento: string = 'preventivo';
  // Variables individuales
  limpiezaAct: string ='no'
  sistemaAct: string ='no'
  archivosAct: string ='no'
  hardwareAct: string ='no'
  softwareAct: string ='no'

  myForm: FormGroup
  loading = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(private fb: FormBuilder, private _mantenimientoService: MantenimientoService, private _actividadService: ActividadService, private route: ActivatedRoute, private router: Router, private activoService : ActivoService){
    this.myForm = this.fb.group({
      tipo: ['', Validators.required],
      encargado: ['',Validators.required],
      tecnico: ['', Validators.required],
      supervisor: ['', Validators.required],
      limpieza: [false],
      sistema: [false],
      archivos: [false],
      hardware: [false],
      software: [false],
      observaciones: [''],
    })
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarActividad(Number(id));
    }
  }

  cargarActividad(id: number) {
    this._mantenimientoService.detallesMantenimiento(id).subscribe({
      next: (data) => {
        this.mantenimiento = data;
        console.log('Actividad cargada:', data)
        this.cargarActivo(this.mantenimiento.activo_id)
      },
      error: (error) => {
        console.error('Error al cargar actividad:', error);
      }
    });
  }

  cargarActivo(id: number) {
    this.activoService.detallesActivo(id).subscribe({
      next: (data) => {
        this.activo = data;
        this.tipoActivo = this.activo.tipo
        console.log('Activo cargada:', data)
      },
      error: (error) => {
        console.error('Error al cargar activo:', error);
      }
    });
  }

  // Método para enviar el formulario
  onGuardar(): void {
    if (this.myForm.valid) {
      this.loading = true;
      this.mensajeExito = '';
      this.mensajeError = '';
      if(this.myForm.value.limpieza === true){
        this.limpiezaAct = 'si'
      }
      if(this.myForm.value.sistema === true){
        this.sistemaAct = 'si'
      }
      if(this.myForm.value.archivos === true){
        this.archivosAct = 'si'
      }
      if(this.myForm.value.hardware === true){
        this.hardwareAct = 'si'
      }
      if(this.myForm.value.software === true){
        this.softwareAct = 'si'
      }
      // Preparar datos según la interface
      const dataActividad: IActividadPost = {
        tipo_mantenimiento: this.myForm.value.tipo,
        encargado: this.myForm.value.encargado,
        tecnico: this.myForm.value.tecnico,
        supervisor: this.myForm.value.supervisor,
        observaciones: this.myForm.value.observaciones,
        limpieza: this.limpiezaAct,
        sistema_operativo: this.sistemaAct,
        archivos: this.archivosAct,
        hardware: this.hardwareAct,
        software: this.softwareAct,
        mantenimiento_id: this.mantenimiento.id,
        tipo_activo: this.activo.tipo
      };

      // Preparar datos según la interface
      const datosForm: IActividadPost = this.myForm.value;
      console.log('datos antes de enviar a back',dataActividad)

      this._actividadService.createActividad(dataActividad).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.mensajeExito = 'Enviado con exito';
          console.log('Datos del form para crear:', response);
          // console.log('Tiene propiedad id?:', response.actividad.id);
          // const nuevoId = response.id;
          this.cambiarEstado(Number(this.mantenimiento.id),this.tipoActivo);
          alert('Formulario enviado correctamente. Redirigiendo...');
          if (response && response.actividad.id !== undefined && response.actividad.id !== null) {
            this.router.navigate(['/dashboard/actividades/detalle', response.actividad.id]);
          } else {
            // Navegar sin parámetro o a otra ruta
            this.router.navigate(['/dashboard/actividades']);
          }
          this.myForm.reset({
            estado: 'Activo',
            fecha: new Date().toISOString().split('T')[0]
          });
        },
        error: (error) => {
          this.loading = false;
          this.mensajeError = 'Error al crear: ' + error.message;
          alert('Por favor, complete todos los campos requeridos');
          console.error('Error:', dataActividad, error);
        }
      });
    } else {
      this.marcarTocados();
    }
  }

  // Marcar campos como tocados para mostrar errores
  marcarTocados(): void {
    Object.keys(this.myForm.controls).forEach(key => {
      const control = this.myForm.get(key);
      control?.markAsTouched();
    });
  }
  // actualizar estado
  cambiarEstado(id: number, detalle: string) {
    this._mantenimientoService.actualizarMantenimiento(id,detalle).subscribe({
      next: (response) => {
        console.log('Estado actualizado a CULMINADO:', response);
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);
        alert('Error al actualizar el estado');
      }
    });
  }

  // Método para obtener el valor como booleano
  TipoMantenimiento() {
    const tipo = this.myForm.get('tipo')?.value;
    return {
      esPreventivo: tipo === 'preventivo',
      esCorrectivo: tipo === 'correctivo',
      valor: tipo
    };
  }
  
}
