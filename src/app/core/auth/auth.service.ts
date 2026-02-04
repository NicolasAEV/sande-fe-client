import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '../models/user.model';
import { ApiConfig } from '../../enviroment/api-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private readonly VALID_PROFILES = [1, 2, 3];

  constructor(private readonly http: HttpClient) {
    this.restoreSession();
  }

  private restoreSession(): void {
    const savedUser = sessionStorage.getItem('currentUser');
    const savedToken = sessionStorage.getItem('authToken');

    if (savedUser && savedToken) {
      const user: User = JSON.parse(savedUser);
      if (this.isValidProfile(user.perfil)) {
        this.currentUserSubject.next(user);
      } else {
        this.logout();
      }
    }
  }

  private isValidProfile(perfil: string): boolean {
    const perfilNum = Number.parseInt(perfil, 10);
    return !Number.isNaN(perfilNum) && this.VALID_PROFILES.includes(perfilNum);
  }

  private generateToken(): string {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 15);
    return btoa(`${timestamp}-${random}`);
  }

  login(usuario: string, clave: string): Observable<User | null> {
    const loginUrl = ApiConfig.getFullUrl(ApiConfig.ENDPOINTS.LOGIN);
    const body: LoginRequest = { usuario, clave };

    return this.http.post<LoginResponse[]>(loginUrl, body).pipe(
      map(response => {
        if (!response || response.length === 0) {
          throw new Error('Usuario o contraseña incorrectos');
        }

        const user = response[0];

        if (!this.isValidProfile(user.perfil)) {
          throw new Error('Perfil de usuario no autorizado');
        }

        const token = this.generateToken();
        this.currentUserSubject.next(user);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.setItem('authToken', token);

        return user;
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const user = this.currentUserSubject.value;
    const token = this.getToken();
    return user !== null && token !== null && this.isValidProfile(user.perfil);
  }

  // Funciones segun el perfil asignado
  // guia de perfiles {"idUsuario":"77","nombre":"usuario","apellido":"admin","perfil":"1"}

  canCreate(): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    const perfil = Number.parseInt(user.perfil);
    return perfil === 1 || perfil === 2;
  }

  canEdit(): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    const perfil = Number.parseInt(user.perfil);
    return perfil === 1;
  }

  canDelete(): boolean {
    return this.canCreate();
  }

  isReadOnly(): boolean {
    const user = this.currentUserValue;
    if (!user) return true;
    const perfil = Number.parseInt(user.perfil);
    return perfil === 3;
  }
}
