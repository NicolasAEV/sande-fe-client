import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContactosService } from '../../../core/contactos/contactos.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Contacto } from '../../../core/models/contacto.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contactos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contactos-list.component.html',
  styleUrl: './contactos-list.component.scss'
})
export class ContactosListComponent implements OnInit {
  contactos: Contacto[] = [];
  contactosFiltrados: Contacto[] = [];
  searchTerm = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly contactosService: ContactosService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.cargarContactos();
  }

  cargarContactos(): void {
    const user = this.authService.currentUserValue;
    if (!user) {
      this.errorMessage = 'Usuario no autenticado';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.contactosService.listarContactos(user.idUsuario).subscribe({
      next: (contactos) => {
        this.contactos = contactos;
        this.contactosFiltrados = contactos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar contactos:', error);
        this.errorMessage = 'Error al cargar los contactos';
        this.isLoading = false;
      }
    });
  }

  filtrarContactos(): void {
    if (!this.searchTerm.trim()) {
      this.contactosFiltrados = this.contactos;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.contactosFiltrados = this.contactos.filter(contacto =>
      contacto.nombreContacto.toLowerCase().includes(term) ||
      contacto.rutContacto.toLowerCase().includes(term) ||
      contacto.email.toLowerCase().includes(term) ||
      contacto.telefono.includes(term)
    );
  }

  nuevoContacto(): void {
    this.router.navigate(['/contactos/nuevo']);
  }

  editarContacto(idContacto: string): void {
    this.router.navigate(['/contactos', idContacto, 'editar']);
  }

  eliminarContacto(contacto: Contacto): void {
    if (!confirm(`¿Está seguro de eliminar el contacto ${contacto.nombreContacto}?`)) {
      return;
    }

    const user = this.authService.currentUserValue;
    if (!user) return;

    this.contactosService.eliminarContacto({
      idUsuario: user.idUsuario,
      idContacto: contacto.idContacto
    }).subscribe({
      next: () => {
        this.cargarContactos();
      },
      error: (error) => {
        console.error('Error al eliminar contacto:', error);
        alert('Error al eliminar el contacto');
      }
    });
  }

  canEdit(): boolean {
    return this.authService.canEdit();
  }

  canDelete(): boolean {
    return this.authService.canDelete();
  }

  canCreate(): boolean {
    return this.authService.canCreate();
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
