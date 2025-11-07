import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageStateService {

  private profileImageSubject = new BehaviorSubject<string>('assets/img/perfiles/default.jpg');
  private coverImageSubject = new BehaviorSubject<string>('assets/img/fondos/AeropuertoElAlto2025.jpg');
  private currentUserId: number | null = null;

  // Observables para suscribirse
  public profileImage$: Observable<string> = this.profileImageSubject.asObservable();
  public coverImage$: Observable<string> = this.coverImageSubject.asObservable();

  constructor() { }

  // Establecer usuario actual
  setCurrentUser(userId: number): void {
    this.currentUserId = userId;
    this.loadUserImages(userId);
  }

  // Cargar imágenes del usuario específico
  private loadUserImages(userId: number): void {
    const savedProfileImage = localStorage.getItem(`profileImage_${userId}`);
    const savedCoverImage = localStorage.getItem(`coverImage_${userId}`);

    if (savedProfileImage) {
      this.profileImageSubject.next(savedProfileImage);
    } else {
      this.profileImageSubject.next('assets/img/perfiles/default.jpg');
    }

    if (savedCoverImage) {
      this.coverImageSubject.next(savedCoverImage);
    } else {
      this.coverImageSubject.next('assets/img/fondos/AeropuertoElAlto2025.jpg');
    }
  }

  // Actualizar imagen de perfil para el usuario actual
  setProfileImage(imageUrl: string): void {
    if (this.currentUserId) {
      localStorage.setItem(`profileImage_${this.currentUserId}`, imageUrl);
      this.profileImageSubject.next(imageUrl);
    }
  }

  // Actualizar imagen de portada para el usuario actual
  setCoverImage(imageUrl: string): void {
    if (this.currentUserId) {
      localStorage.setItem(`coverImage_${this.currentUserId}`, imageUrl);
      this.coverImageSubject.next(imageUrl);
    }
  }

  // Obtener imagen específica de un usuario
  getUserProfileImage(userId: number): string {
    return localStorage.getItem(`profileImage_${userId}`) || 'assets/img/perfiles/default.jpg';
  }

  // Eliminar imagen de perfil del usuario actual
  removeProfileImage(): void {
    if (this.currentUserId) {
      localStorage.removeItem(`profileImage_${this.currentUserId}`);
      this.profileImageSubject.next('assets/img/perfiles/default.jpg');
    }
  }

  // Eliminar imagen de portada del usuario actual
  removeCoverImage(): void {
    if (this.currentUserId) {
      localStorage.removeItem(`coverImage_${this.currentUserId}`);
      this.coverImageSubject.next('assets/img/portadas/default.jpg');
    }
  }

  // Limpiar cuando cierres sesión
  clearUser(): void {
    this.currentUserId = null;
    this.profileImageSubject.next('assets/img/perfiles/default.jpg');
    this.coverImageSubject.next('assets/img/portadas/AeropuertoElAlto2025.jpg');
  }
}
