import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent implements OnInit {

  profileData: any = {
    name: 'Tristán Elósegui',
    username: '@tristanelosegui',
    website: 'tristanelosegui.com',
    location: 'Madrid, Spain',
    joinDate: 'Se unió en marzo de 2009',
  }
  
  profileImage: string = 'assets/img/perfiles/default.jpg';
  coverImage: string = 'assets/img/fondos/AeropuertoElAlto2025.jpg';
  isEditingProfile: boolean = false;
  isEditingCover: boolean = false;
  loading: boolean = false;
  mostrarFormulario: boolean = false;
  mostrarButton: boolean = false;

  ngOnInit(): void {
    const savedProfileImage = localStorage.getItem('profileImage');
    const savedCoverImage = localStorage.getItem('coverImage');
    
    if (savedProfileImage) {
      this.profileImage = savedProfileImage;
    }
    
    if (savedCoverImage) {
      this.coverImage = savedCoverImage;
    }
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
    if (file) {
      this.processImage(file, 'profile');
    }
  }

  // Manejar cambio de imagen de portada
  onCoverImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.processImage(file, 'cover');
    }
  }

  // Procesar la imagen seleccionada
  private processImage(file: File, type: 'profile' | 'cover'): void {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      const imageUrl = e.target.result;
      
      if (type === 'profile') {
        this.profileImage = imageUrl;
        localStorage.setItem('profileImage', imageUrl);
      } else {
        this.coverImage = imageUrl;
        localStorage.setItem('coverImage', imageUrl);
      }
    };
    
    reader.readAsDataURL(file);
  }

  // Método para eliminar imagen de perfil
  removeProfileImage(): void {
    this.profileImage = 'assets/img/perfiles/default.jpg';
    localStorage.removeItem('profileImage');
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
