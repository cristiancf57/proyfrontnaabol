import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginService, UserLogin } from '../../services/logins/login.service';
import { Subscription } from 'rxjs';
import { IUser } from '../models/users';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ImageStateService } from '../../services/imagenes/image-state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent  implements OnInit, OnDestroy{
  
  urlIcon = 'assets/img/fondos/logo.png'
  currentUser: IUser | null = null;
  private userSubscription: Subscription = new Subscription();
  UrlImg = 'assets/img/perfiles/default.jpg'
  profileImage: string = 'assets/img/perfiles/default.jpg';
  currentUserId: number | null = null;
  Urlperfil: string | undefined;
  private imageSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router, private imageStateService: ImageStateService) {}
  
  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        // console.log('Usuario en navbar:', user);
        // this.Urlperfil =this.currentUser?.perfil
        this.userSubscription = this.authService.currentUser$.subscribe(user => {
          if (user && user.id) {
            this.currentUserId = user.id;
            // Establecer usuario actual en el servicio de imágenes
            this.imageStateService.setCurrentUser(user.id);
          } else {
            this.currentUserId = null;
            this.profileImage = 'assets/img/perfiles/default.jpg';
          }
        });

        // Suscribirse a los cambios de la imagen de perfil
        this.imageSubscription = this.imageStateService.profileImage$.subscribe(
          (imageUrl) => {
            this.profileImage = imageUrl;
          }
        );
      }
    );

  }

  get userInitials(): string {
    if (!this.currentUser) return 'U. N.';
    
    const firstInitial = this.currentUser.nombre?.charAt(0) || '';
    return `${firstInitial}. ${this.currentUser.apellido}`;
  }

  get fullName(): string {
    if (!this.currentUser) return 'Usuario';

    if (this.currentUser.nombre) {
      return `${this.currentUser.nombre} ${this.currentUser.apellido}`.trim();
    }
    
    if (this.currentUser.username) {
      const username = this.currentUser.username;
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    return `${this.currentUser.nombre} ${this.currentUser.apellido}`.trim();
  }

  get userPosition(): string {
    return this.currentUser?.cargo || '';
  }

  get userId(): number | null {
    if (!this.currentUser) return null;
    const id = this.currentUser.id
    return id ;
  }

  // logout(): void {
  //   this.authService.logout();
  // }
  logout(): void {
    // Limpiar todo el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpiar sessionStorage también por seguridad
    sessionStorage.clear();
    
    // Navegar al login y prevenir volver atrás
    this.router.navigate(['/login']);
    
    // Prevenir que el navegador cachee la página
    this.clearBrowserCache();
  }

  private clearBrowserCache(): void {
    // Eliminar del cache del navegador
    if ('caches' in window) {
      caches.keys().then(keys => {
        keys.forEach(key => caches.delete(key));
      });
    }
  }

  goToProfile(): void {
    console.log('UserId:', this.userId);
    console.log('Tipo de userId:', typeof this.userId);

    const userId = this.userId;
    
    if (userId) {
      this.router.navigate(['dashboard/perfil/', userId]);
    } else {
      console.warn('No se pudo obtener el ID del usuario:', this.currentUser);
    }
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
