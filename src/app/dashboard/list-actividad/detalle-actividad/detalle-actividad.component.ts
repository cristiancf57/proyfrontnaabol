import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActividadService } from '../../../services/actividades/actividad.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detalle-actividad',
  templateUrl: './detalle-actividad.component.html',
  styleUrl: './detalle-actividad.component.css'
})
export class DetalleActividadComponent implements OnInit {
  actividad: any;
  logoMin = environment.logoMinisterio
  logoInst = environment.logoInstitucional
  dia: string = '';
  mes: string = '';
  anio: string = '';

  constructor(private actividadService: ActividadService, private route: ActivatedRoute){}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarActividad(Number(id));
    }
 
  }

  cargarActividad(id: number) {
    this.actividadService.detallesActividad(id).subscribe({
      next: (actividad) => {
        this.actividad = actividad;
        console.log('Actividad cargada:', actividad)
        this.separarFecha(this.actividad.fecha);
      },
      error: (error) => {
        console.error('Error al cargar actividad:', error);
      }
    });
  }

  separarFecha(fecha: string) {
    const date = new Date(fecha);
    this.dia = date.getDate().toString().padStart(2, '0');
    this.mes = (date.getMonth() + 1).toString().padStart(2, '0');
    this.anio = date.getFullYear().toString();
  }

  imprimirFormulario() {
    const contenido = document.getElementById('contenidoImprimir');
    
    if (!contenido) {
      alert('No se puede encontrar el contenido para imprimir');
      return;
    }

    const ventanaImpresion = window.open('', '_blank', 'width=800,height=700');
    
    if (!ventanaImpresion) {
      alert('No se pudo abrir la ventana de impresión. Por favor, permite ventanas emergentes.');
      return;
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Formulario de Mantenimiento - ${this.actividad.mantenimiento.activo.tipo}</title>
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
            background-color: #e0e0e0 !important; 
            font-weight: bold; 
            text-align: center; 
            color: #070925ff;
          }
          .subtitle { 
            font-weight: bold; 
            background-color: #f8f9fa;
          }
          .header { 
            background-color: #343a40 !important; 
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

          .footer {
            display: none;
          }
          
          @media print {
            @page {
              margin-bottom: 50px;
              @bottom-center {
                content: "Navegación Aérea y Aeropuertos Bolivianos (NAABOL) naabol@naabol.gob.bo ${new Date().toLocaleDateString('es-ES')} - ${new Date().toLocaleTimeString('es-ES')} - Pág. " counter(page);
                font-size: 10px;
                color: #666;
              }
            }
            
            .page-break {
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body>
        ${contenido.innerHTML}

        <script>
          window.onload = function() {
            window.print();
          };
          
          window.onafterprint = function() {
            setTimeout(function() {
              window.close();
            }, 100);
          };
        </script>

      </body>
      </html>
    `;

    ventanaImpresion.document.write(htmlContent);
    ventanaImpresion.document.close();
  }

}
