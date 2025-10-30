import { Component, OnInit } from '@angular/core';
import { ActivoService } from '../../../services/activos/activo.service';
import { IActivo } from '../../models/activos';
import { ActivatedRoute } from '@angular/router';
import { MantenimientoService } from '../../../services/mantenimientos/mantenimiento.service';
import { IMantenimiento } from '../../models/mantenimiento';
import { ComponenteService } from '../../../services/componentes/componente.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { IRepuestos } from '../../models/repuestos';

@Component({
  selector: 'app-detalle-activo',
  templateUrl: './detalle-activo.component.html',
  styleUrl: './detalle-activo.component.css'
})
export class DetalleActivoComponent implements OnInit{
  logoMin = '/assets/img/fondos/logo_min.png'
  logoInst = '/assets/img/fondos/logo_inst.png'
  activo!: any;
  mantenimiento: any[]=[];
  accesorios!: IRepuestos[];
  loading: boolean = false;
  mostrarFormulario: boolean = false;
  myForm: any;
  mensajeExito='';
  componentes!: any[];
  repuesto!: any[];
  repuestoSelected!: any[];
  stock: number = 0
  stockAct!:number;

  constructor(private activoService: ActivoService, private route: ActivatedRoute, private mantenimientoServ: MantenimientoService, private componenteService: ComponenteService,private toastr: ToastrService, private fb: FormBuilder){
    this.myForm = this.fb.group({
      componente_id: ['',[Validators.required,Validators.pattern(/^[1-9]\d*$/)]],
      cantidad: ['',Validators.required],
      detalle: ['',Validators.required],
    });
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarActivo(Number(id));
    }

  }

  cargarActivo(id: number) {
    this.activoService.detallesActivo(id).subscribe({
      next: (activo) => {
        this.activo = activo;
        console.log('activo cargada:', activo)
        console.log('ID del activo:', this.activo.id);
        this.cargarMantenimiento(Number(this.activo.id));
        this.cargarAccesoriosAsignados(Number(this.activo.id));
      },
      error: (error) => {
        console.error('Error al cargar activo:', error);
      }
    });
    
  }

  cargarMantenimiento(id: number) {
    this.mantenimientoServ.mantenimientoActivo(id).subscribe({
      next: (mantenimiento: any) => {
        this.mantenimiento = mantenimiento;
        console.log('mantenimiento cargada:', mantenimiento)
      },
      error: (error) => {
        console.error('Error al cargar mantenimiento:', error);
      }
    });
  }

  cargarAccesoriosAsignados(id: number) {
    this.componenteService.componenteAsignados(id).subscribe({
      next: (componenteAsignado: any) => {
        this.componentes = componenteAsignado;
        console.log('componentes cargada:', componenteAsignado)
      },
      error: (error) => {
        console.error('Error al cargar componentes:', error);
      }
    });
  }

  agregarComponente(): void {
    this.mostrarFormulario = true;
    this.cargarAccesorio()
  }

  cargarAccesorio() {
    this.componenteService.accesoiosDisponibles().subscribe({
      next: (accesorio: any) => {
        this.accesorios = accesorio;
        console.log('accesorios cargada:', accesorio)
      },
      error: (error) => {
        console.error('Error al cargar accesorios:', error);
      }
    });
  }

  cargarAccesorioSelecionada(id:number,cantidad:number) {
    this.componenteService.repuestoSeleccionada(id).subscribe({
      next: (repuestoSelet: any) => {
        this.repuestoSelected = repuestoSelet;
        console.log('repuesto cargada:', repuestoSelet)
        console.log('cantidad obtenida:', cantidad)
        this.stock = repuestoSelet.stock
        console.log('stock cargada:', this.stock)

        const nuevoStock = this.stock - cantidad
        // const resultado =[{stock:nuevoStock}]
        console.log('ID del accesorio',id) 
        console.log('Stock actual',nuevoStock) 
        this.actualizarStock(id,nuevoStock)
      },
      error: (error) => {
        console.error('Error al cargar repuesto:', error);
      }
    });
  }

  // Método para enviar el formulario
  guardarAccesorio(): void {
    if (this.myForm.valid) {
      this.loading = true;

      const datoComponente: any = {
        repuesto_id: Number(this.myForm.value.componente_id),
        activo_id: this.activo.id,
        cantidad: Number(this.myForm.value.cantidad),
        descripcion: this.myForm.value.detalle,
      };

      this.componenteService.guardarComponente(datoComponente).subscribe({
        next: (componente: any) => {
          this.loading = false;
          this.mensajeExito = 'Enviado con exito'

          this.toastr.success('Registro exitoso','Exitoso..!')
          // alert('Formulario enviado correctamente. Redirigiendo...')
          
          this.cargarAccesorioSelecionada(datoComponente.repuesto_id,datoComponente.cantidad)
          console.log('mostrar datos',this.repuestoSelected)

          this.myForm.reset({
            estado: 'Activo',
            fecha: new Date().toISOString().split('T')[0]
          });
        },
        error: (error) => {
          this.loading = false;
          this.toastr.error('','')
          alert('Por favor, complete todos los campos requeridos');
          console.error('Error:', datoComponente, error);
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

  // actualizar stock
  async actualizarStock(id: number, nuevostock: number) {
    try {
        console.log('datos', id, 'stock',nuevostock)
      
      if (id) {
        this.componenteService.actualizarStock(id, nuevostock).subscribe({
          next: (response) => {
            console.log('Stock actualizado:', response);
            this.mostrarFormulario = false;
            this.ngOnInit()
          },
          error: (error) => {
            console.error('Error al actualizar stock:', error);
            alert('Error al actualizar el stock');
          }
        });
      } else {
          alert('No se pudo encontrar el repuesto asociado');
      }
    } catch (error) {
        console.error('Error al obtener componente:', error);
    }
  }

}
