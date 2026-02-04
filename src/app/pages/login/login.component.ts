import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { AppRoutes } from '../../enviroment/enviroment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  showPassword = false;
  rememberMe = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    
    this.authService.login(this.credentials.username, this.credentials.password).subscribe({
      next: (user) => {
        if (user) {
                    this.router.navigate([AppRoutes.CONTACTOS]);
        }
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessage = error.message || 'Usuario o contraseña incorrectos';
      }
    });
  }
}
