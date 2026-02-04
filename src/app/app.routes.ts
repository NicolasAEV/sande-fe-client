import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppRoutes } from './enviroment/enviroment';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: AppRoutes.LOGIN,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'contactos',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/contactos/contactos.routes').then(m => m.contactosRoutes)
  }
];
