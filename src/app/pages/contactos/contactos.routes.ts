import { Routes } from '@angular/router';
import { ContactosListComponent } from './contactos-list/contactos-list.component';
import { ContactosFormComponent } from './contactos-form/contactos-form.component';
import { canEditGuard } from '../../core/guards/can-edit.guard';

export const contactosRoutes: Routes = [
  {
    path: '',
    component: ContactosListComponent
  },
  {
    path: 'nuevo',
    component: ContactosFormComponent,
    canActivate: [canEditGuard]
  },
  {
    path: ':id/editar',
    component: ContactosFormComponent,
    canActivate: [canEditGuard]
  }
];
