import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactosService } from '../../../core/contactos/contactos.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CrearContactoRequest, ModificarContactoRequest } from '../../../core/models/contacto.model';

@Component({
  selector: 'app-contactos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contactos-form.component.html',
  styleUrl: './contactos-form.component.scss'
})
export class ContactosFormComponent implements OnInit {
  contactoForm!: FormGroup;
  isEditMode = false;
  idContacto: string | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly contactosService: ContactosService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.idContacto = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.idContacto;

    if (this.isEditMode && this.idContacto) {
      this.contactoForm.get('rutContacto')?.disable();
      this.cargarContacto(this.idContacto);
    }
  }

  private initForm(): void {
    this.contactoForm = this.fb.group({
      rutContacto: ['', [Validators.required, Validators.maxLength(20)]],
      nombreContacto: ['', [Validators.required, Validators.maxLength(200)]],
      abreviacion: ['', [Validators.required, Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
    });
  }

  private cargarContacto(idContacto: string): void {
    const user = this.authService.currentUserValue;
    if (!user) {
      this.errorMessage = 'Usuario no autenticado';
      return;
    }

    this.isLoading = true;
    this.contactosService.obtenerContacto(user.idUsuario, idContacto).subscribe({
      next: (contacto) => {
        this.contactoForm.patchValue({
          rutContacto: contacto.rutContacto,
          nombreContacto: contacto.nombreContacto,
          abreviacion: contacto.abreviacion,
          telefono: contacto.telefono,
          email: contacto.email
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar contacto:', error);
        this.errorMessage = 'Error al cargar el contacto';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUserValue;
    if (!user) {
      this.errorMessage = 'Usuario no autenticado';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    if (this.isEditMode && this.idContacto) {
      this.modificarContacto(user.idUsuario);
    } else {
      this.crearContacto(user.idUsuario);
    }
  }

  private crearContacto(idUsuario: string): void {
    const formValue = this.contactoForm.value;
    const request: CrearContactoRequest = {
      idUsuario,
      idContacto: '0',
      rutContacto: formValue.rutContacto,
      nombreContacto: formValue.nombreContacto,
      abreviacion: formValue.abreviacion,
      telefono: formValue.telefono,
      email: formValue.email
    };

    this.contactosService.crearContacto(request).subscribe({
      next: () => {
        this.router.navigate(['/contactos']);
      },
      error: (error) => {
        console.error('Error al crear contacto:', error);
        this.errorMessage = 'Error al crear el contacto';
        this.isSaving = false;
      }
    });
  }

  private modificarContacto(idUsuario: string): void {
    const formValue = this.contactoForm.value;
    const request: ModificarContactoRequest = {
      idUsuario,
      idContacto: this.idContacto!,
      nombreContacto: formValue.nombreContacto,
      abreviacion: formValue.abreviacion,
      telefono: formValue.telefono,
      email: formValue.email
    };

    this.contactosService.modificarContacto(request).subscribe({
      next: () => {
        this.router.navigate(['/contactos']);
      },
      error: (error) => {
        console.error('Error al modificar contacto:', error);
        this.errorMessage = 'Error al modificar el contacto';
        this.isSaving = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/contactos']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactoForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    if (field?.hasError('maxLength')) {
      return 'Longitud máxima excedida';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
