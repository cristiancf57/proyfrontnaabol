import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivoService } from '../../../services/activos/activo.service';
import { ToastrService } from 'ngx-toastr';
import { IActivo } from '../../models/activos';

@Component({
  selector: 'app-lectorqr',
  templateUrl: './lectorqr.component.html',
  styleUrl: './lectorqr.component.css'
})
export class LectorqrComponent implements OnInit{
  
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @Output() codigoDetectado = new EventEmitter<string>();

  escaneando: boolean = false;
  codigoEncontrado: string = '';
  mensaje: string = '';
  loading: boolean = false;
  mostrarFormulario: boolean = false;
  mensajeExito = '';
  mensajeError = '';
  // Stream de video
  private stream: MediaStream | null = null;
  private animationFrameId: number | null = null;

  constructor(private router: Router, private activoService: ActivoService,  private toastr: ToastrService){}
  ngOnInit(): void {
    this.iniciarEscaneo()
  }
  // Iniciar escaneo QR
  async iniciarEscaneo(): Promise<void> {
    try {
      this.escaneando = true;
      this.mensaje = 'Iniciando cámara...';

      // Solicitar acceso a la cámara
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });

      const video = this.videoElement.nativeElement;
      video.srcObject = this.stream;
      
      await video.play();
      this.mensaje = 'Escaneando código QR...';

      // Iniciar detección de QR
      this.detectarQR();

    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      this.mensaje = 'Error al acceder a la cámara. Verifica los permisos.';
      this.escaneando = false;
    }
  }

  cancelarScaneo(): void {
    this.escaneando = false;
    
    this.mensaje = '';
    this.router.navigate(['dashboard/principal'])
  }

  // Detener escaneo
  detenerEscaneo(): void {
    this.escaneando = false;
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.mensaje = '';
  }

  // Detectar código QR
  async detectarQR(): Promise<void> {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      this.mensaje = 'Error al inicializar el canvas';
      return;
    }

    const procesarFrame = async () => {
      if (!this.escaneando) return;

      try {
        // Dibujar frame actual en canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Obtener imagen para procesar
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = await this.decodificarQR(imageData);
        
        if (code) {
          this.codigoEncontrado = code;
          this.detenerEscaneo();
          this.buscarPorCodigo(code);
          return;
        }

        // Continuar escaneo
        if (this.escaneando) {
          this.animationFrameId = requestAnimationFrame(procesarFrame);
        }
      } catch (error) {
        console.error('Error en detección QR:', error);
      }
    };

    this.animationFrameId = requestAnimationFrame(procesarFrame);
  }

  // Decodificar QR usando jsQR
  async decodificarQR(imageData: ImageData): Promise<string | null> {
    // Importación dinámica de jsQR
    try {
      const jsQR = await import('jsqr');
      const code = jsQR.default(
        imageData.data,
        imageData.width,
        imageData.height
      );
      return code ? code.data : null;
    } catch (error) {
      console.error('Error al decodificar QR:', error);
      return null;
    }
  }

  async buscarPorCodigo(datoCompleto: string): Promise<void> {
    this.loading = true;
    this.mensaje = `Buscando: ${datoCompleto}`;

    const match = datoCompleto.match(/^(\d+)/);
    const codigo = match ? match[1] : '';

    try {
      this.activoService.buscarCodigo(codigo).subscribe({
        next: (response: IActivo) => {
          this.loading = false;
          console.log('Respuesta completa:', response);
          this.mensaje = 'Código encontrado!';
          
          if (response && Array.isArray(response) && response.length > 0) {
            const activo = response[0]; 
            this.mensaje = 'Código encontrado!'
            this.toastr.success('Codigo Encontrado','Encontrado')
            
            if (activo && activo.id) {
              console.log('id encontrado',activo.id)
              this.router.navigate(['/dashboard/activos/detalle', activo.id]);
            } else {
              console.warn('ID no recibido en el activo:', activo);
              this.mensaje = 'Código encontrado, pero no tiene ID válido';
            }
          } else {
            this.mensaje = 'Código no encontrado en el sistema';
            this.router.navigate(['dashboard/buscar-activo'], {queryParams: { dato: datoCompleto }});
          }
        },
        error: (error) => {
          if (error.status === 404) {
          } else {
            this.loading = false;
            this.mensaje = 'Error al buscar el código en el sistema';
            console.error('Error en búsqueda:', error);
          }
        }
      });

    } catch (error) {
      this.loading = false;
      this.mensaje = 'Error al procesar el código';
      console.error('Error:', error);
    }
  }

}
