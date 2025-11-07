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

  imprimirFormulario() {
    const contenido = document.getElementById('contenidoImprimir');
    
    if (!contenido) {
      alert('No se puede encontrar el contenido para imprimir');
      return;
    }

    const ventanaImpresion = window.open('', '_blank', 'width=800,height=600');
    
    if (!ventanaImpresion) {
      alert('No se pudo abrir la ventana de impresión. Por favor, permite ventanas emergentes.');
      return;
    }
    
    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Formulario de Mantenimiento </title>
        <meta charset="utf-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 30px;
            background: white;
            color: black;
            font-size: 12px;
          }
          .container { 
            width: 100% !important;
            max-width: 100% !important;
            padding: 20px;
          }
          table { 
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          td, th { 
            border: 1px solid #000; 
            padding: 6px 8px; 
            vertical-align: top;
            font-size: 11px;
          }
          .section-title { 
            background-color: #d7efffff !important; 
            font-weight: bold; 
            text-align: center; 
            color: #070925ff;
          }
          .subtitle { 
            font-weight: bold; 
            background-color: #f8f9fa;
          }
          .header { 
            background-color: #082542ff !important; 
            color: white !important;
            padding: 10px;
            margin-bottom: 15px;
            text-align: center;
          }
          .header h1 {
            margin: 3px 0;
            font-size: 14px;
            color: white !important;
          }
          .date-table {
            width: 100%;
          }
          .date-table td {
            border: none;
            text-align: center;
          }
          .checkbox-cell { 
            width: 50px; 
            text-align: center; 
          }
          .text-success { color: #015a16ff !important; }
          .text-danger { color: #af0516ff !important; }
          .bi { font-size: 1em; }
          img { 
            max-width: auto; 
            height: 60px;
          }
          
          /* Asegurar que los colores se impriman */
          @media print {
            * { -webkit-print-color-adjust: exact; }
            .header { background-color: #1e3b58ff !important; }
            .section-title { background-color: #d7e1eeff !important; }
          }
        </style>
      </head>
      <body>
        ${contenido.innerHTML}
        <div style="text-align: center; margin-top: 10px; font-size: 10px; color: #2f2f30ff;">
          <p>Navegación Aérea y Aeropuertos Bolivianos (NAABOL) naabol@naabol.gob.bo ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
        </div>
      </body>
      </html>
    `);

    ventanaImpresion.document.close();
    
    setTimeout(() => {
      ventanaImpresion.focus();
      ventanaImpresion.print();
    }, 500);
  }

}
