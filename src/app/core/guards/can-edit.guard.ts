import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AppRoutes } from '../../enviroment/enviroment';

export const canEditGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.canEdit()) {
    return true;
  }

  router.navigate([AppRoutes.CONTACTOS]);
  return false;
};
