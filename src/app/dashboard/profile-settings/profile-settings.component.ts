import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { IUser } from '../models/users';
import { IcargoIndividual, IDesignacionCargo } from '../models/cargos';
import { ImageStateService } from '../../services/imagenes/image-state.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent implements OnInit {
  
  profileImage: string = 'assets/img/perfiles/default.jpf';
  coverImage: string = 'assets/img/fondos/AeropuertoElAlto2025.jpg';
  currentUserId: number | null = null;
  isEditingProfile: boolean = false;
  isEditingCover: boolean = false;
  loading: boolean = false;
  mostrarFormulario: boolean = false;
  mostrarButton: boolean = false;
  user: IUser | null = null
  userCargo: IDesignacionCargo | null = null
  error: string = '';

  constructor(private route: ActivatedRoute, private usuarioService: UsuarioService, private imageStateService: ImageStateService,private authService: AuthService){}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUserData(Number(id));
    }

    this.authService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.currentUserId = user.id;
        this.imageStateService.setCurrentUser(user.id);
      }
    });

    // Suscribirse a los cambios de imagen
    this.imageStateService.profileImage$.subscribe(image => {
      this.profileImage = image;
    });

    this.imageStateService.coverImage$.subscribe(image => {
      this.coverImage = image;
    });
  }

  private loadUserData(id: number): void {
    this.usuarioService.getUserDetalle(id).subscribe({
      next: (userGet: IUser) => {
        this.user = userGet;
        console.log('usuario cargada:', userGet)
        console.log('ID del usuario:', this.user.id);
        this.loadCargo(Number(this.user.id));
      },
      error: (error) => {
        console.error('Error al cargar activo:', error);
      }
    });
  }

  private loadCargo(id:number){
    this.usuarioService.getCargoIndividual(id).subscribe({
      next: (response)=>{
        this.userCargo = response
        console.log('cargos obtenidos', this.userCargo)
      }
    })
  }

  // Método para abrir el selector de archivos para imagen de perfil
  cambiarPerfil(): void {
    const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
    fileInput.click();
  }

  // Método para abrir el selector de archivos para imagen de portada
  triggerCoverImageChange(): void {
    const fileInput = document.getElementById('coverImageInput') as HTMLInputElement;
    fileInput.click();
  }

  // Manejar cambio de imagen de perfil
  onProfileImageChange(event: any): void {
    const file = event.target.files[0];
    if (file && this.currentUserId) {
      this.processImage(file, 'profile');
    }
  }

  // Manejar cambio de imagen de portada
  onCoverImageChange(event: any): void {
    const file = event.target.files[0];
    if (file && this.currentUserId) {
      this.processImage(file, 'cover');
    }
  }

  // Procesar la imagen seleccionada
  private processImage(file: File, type: 'profile' | 'cover'): void {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      const imageUrl = e.target.result;
      
      if (type === 'profile') {
        this.imageStateService.setProfileImage(imageUrl);
      } else {
        this.imageStateService.setCoverImage(imageUrl);
      }
    };
    
    reader.readAsDataURL(file);
  }

  // Método para eliminar imagen de perfil
  removeProfileImage(): void {
    this.imageStateService.removeProfileImage();
  }

   // Método para eliminar imagen de portada
  removeCoverImage(): void {
    this.imageStateService.removeCoverImage();
  }

  editPerfil(){
    this.mostrarFormulario = true;
    this.mostrarFormulario = true;
  }
  canelEdit(){
    this.mostrarFormulario = false;
    this.mostrarFormulario = false;
  }

}
