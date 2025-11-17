import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivoService } from '../../services/activos/activo.service';
import { IActivo, IActivoPost1 } from '../models/activos';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-buscador-activo',
  templateUrl: './buscador-activo.component.html',
  styleUrl: './buscador-activo.component.css'
})
export class BuscadorActivoComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  // Estados del componente
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

  // Formulario para nuevo registro
  myForm: FormGroup;

  constructor( private router: Router, private fb: FormBuilder, private activoService: ActivoService,private route: ActivatedRoute, private toastr: ToastrService) {
    this.myForm = this.fb.group({
      codigo: ['',Validators.required],
      detalle: ['',Validators.required],
      tipo: ['',Validators.required],
      marca: ['',Validators.required],
      modelo: ['',Validators.required],
      serie: ['',Validators.required],
      area: ['',Validators.required],
      ip: ['',Validators.required],
      ubicacion: ['',Validators.required],
      color: ['',Validators.required],
      descripcion: [''],
      estado: [''],
      fecha: ['']
    });
  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.route.queryParams.subscribe(params => {
      const datoRecibido = params['dato'];
      if (datoRecibido) {
        this.procesarCodigo(datoRecibido);
      }
    });
  }

  inicializarFormulario(): void {
    this.myForm = this.fb.group({
      codigo: [''],
      detalle: [''],
      tipo: ['computadora'],
      marca: [''],
      modelo: [''],
      serie: [''],
      area: ['Sistemas'],
      ip: [''],
      ubicacion: [''],
      color: [''],
      descripcion: [''],
      estado: ['activo'],
      fecha: ['']
    });
  }

  // Iniciar escaneo QR
  async iniciarEscaneo(): Promise<void> {
    try {
      this.escaneando = true;
      this.mensaje = 'Iniciando cámara...';

      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });

      const video = this.videoElement.nativeElement;
      video.srcObject = this.stream;
      
      await video.play();
      this.mensaje = 'Escaneando código QR...';

      this.detectarQR();

    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      this.mensaje = 'Error al acceder a la cámara. Verifica los permisos.';
      this.escaneando = false;
    }
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
          this.buscarCodigo(code);
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

  // ========== BÚSQUEDA EN API ==========
  async buscarCodigo(datoCompleto: string): Promise<void> {
    this.loading = true;
    this.mensaje = `Buscando: ${datoCompleto}`;

    const match = datoCompleto.match(/^(\d+)/);
    const codigo = match ? match[1] : '';

    try {
      // Buscar en la API real
      this.activoService.buscarCodigo(codigo).subscribe({
        next: (response: IActivo) => {
          this.loading = false;
          console.log('Respuesta completa:', response);
          this.mensaje = 'Código encontrado!';
          this.toastr.success('Codigo Encontrado','Encontrado')
          
          if (response && Array.isArray(response) && response.length > 0) {
            const activo = response[0]; // Obtener el primer elemento del array
            this.mensaje = 'Código encontrado!';
            
            // Redirigir a detalles del activo encontrado
            if (activo && activo.id) {
              setTimeout(() => {
                // console.log('id encontrado',activo.id)
                this.router.navigate(['/dashboard/activos/detalle', activo.id]);
              }, 1500);
            } else {
              // console.warn('ID no recibido en el activo:', activo);
              this.mensaje = 'Código encontrado, pero no tiene ID válido';
              this.reiniciar();
            }
          } else {
            this.mensaje = 'Código no encontrado en el sistema';
            this.procesarCodigo(datoCompleto);
          }
        },
        error: (error) => {
          // Si no existe (error 404), procesar datos del QR
          if (error.status === 404) {
            this.procesarCodigo(datoCompleto);
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

  private procesarCodigo(codigo: string): void {
    const datosQR = this.procesarDatosQR(codigo);
    
    if (datosQR) {
      this.mensaje = 'Código no encontrado. Complete el formulario con los datos del QR.';
      this.mostrarFormulario = true;
      this.myForm.patchValue(datosQR);
    } else {
      this.mensaje = 'Código no encontrado. Formato QR no reconocido.';
    }
    this.loading = false;
  }

  // Búsqueda manual por código
  buscarManual(): void {
    const codigoManual = prompt('Ingrese el código a buscar:');
    if (codigoManual && codigoManual.trim()) {
      this.buscarCodigo(codigoManual.trim());
    }
  }

 // ========== PROCESAMIENTO DE DATOS QR ==========
  procesarDatosQR(datosQR: string): any {
    try {
      const datosDecodificados = decodeURIComponent(datosQR);
      console.log('Datos QR decodificados:', datosDecodificados);

      const [codigo, ...descripcionParts] = datosDecodificados.split('|');
      const descripcionCompleta = descripcionParts.join('|');

      const datosProcesados = this.procesarDescripcion(descripcionCompleta);
      // const datosProcesados = extraerDatos(descripcionCompleta)
      datosProcesados.codigo = codigo.trim();

      console.log('Datos procesados:', datosProcesados);
      return datosProcesados;

    } catch (error) {
      console.error('Error al procesar datos QR:', error);
      return null;
    }
  }

  private procesarDescripcion(descripcion: string): any {
    const datos: any = {};
    
    const patrones = [
      { regex: /(MINI\s*PC|LAPTOP|COMPUTADORA|IMPRESORA|MONITOR|UPS|ACCESS+POINT)?\s*([^,|]+)/i, campo: 'detalle', transform: (val: string) => val.trim().substring(0, 17) },
      { regex: /MARCA\s*([^,]+)/i, campo: 'marca', transform: (val: string) => val.replace('MARCA', '').trim().substring(0, 15) },
      { regex: /MOD\s*([^,|]+)/i, campo: 'modelo', transform: (val: string) => val.replace('MOD', '').trim().substring(0, 15) },
      { regex: /MODEL.\s*([^,|]+)/i, campo: 'modelo', transform: (val: string) => val.replace('MOD', '').trim().substring(0, 15) },
      { regex: /MODELO\s*([^,|]+)/i, campo: 'modelo', transform: (val: string) => val.replace('MOD', '').trim().substring(0, 15) },
      { regex: /SERIE\s*([^,]+)/i, campo: 'serie', transform: (val: string) => val.replace('SERIE', '').trim().substring(0, 20) },
      { regex: /COLOR\s*([^,]+)/i, campo: 'color', transform: (val: string) => val.replace('COLOR', '').trim().substring(0, 25) }
    ];

    patrones.forEach(patron => {
      const match = descripcion.match(patron.regex);
      if (match) {
        const valor = patron.transform(match[1] || match[0]);
        console.log(`${patron.campo}:`, valor);datos[patron.campo] = valor;
      }
    });

    // Determinar tipo basado en el detalle
    if (datos.detalle) {
      const detalleUpper = datos.detalle.toUpperCase();
      if (detalleUpper.includes('MINI PC')) datos.tipo = 'mini-pc';
      else if (detalleUpper.includes('LAPTOP')) datos.tipo = 'laptop';
      else if (detalleUpper.includes('COMPUTADORA')) datos.tipo = 'computadora';
      else if (detalleUpper.includes('IMPRESORA')) datos.tipo = 'impresora';
      else if (detalleUpper.includes('MONITOR')) datos.tipo = 'monitor';
      else datos.tipo = 'otro';
    }

    return datos;
  }


  // ========== REGISTRO DE NUEVO ACTIVO ==========
  registrarNuevo(): void {
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

      this.activoService.crearActivo(activoData).subscribe({
        next: (response: any) => {
          console.log('respuesta', response)
          this.loading = false;
          alert('registro exitoso...')
          this.toastr.success('Activo Registrado exitosamente','Activo creado')
          console.log('Activo creado',response);
          this.myForm.reset({
            estado: 'Activo',
            fecha: new Date().toISOString().split('T')[0]
          });
          // this.router.navigate(['/dashboard/activos', response.id]);
          if (response && response.activo.id !== undefined && response.activo.id !== null) {
            this.router.navigate(['/dashboard/activos/detalle', response.activo.id]);
          } else {
            // Navegar sin parámetro o a otra ruta
            this.router.navigate(['/dashboard/activos']);
          }
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

  // Reiniciar buscador
  reiniciar(): void {
    this.mostrarFormulario = false;
    this.codigoEncontrado = '';
    this.mensaje = '';
    this.myForm.reset({
      estado: 'activo',
    });
  }

  ngOnDestroy(): void {
    this.detenerEscaneo();
  }

}