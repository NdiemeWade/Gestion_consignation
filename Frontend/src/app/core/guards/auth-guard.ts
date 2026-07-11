import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si l'agent est bien connecté, on le laisse passer
  if (authService.isLoggedIn()) {
    return true;
  }

  // Sinon, on le redirige gentiment vers la page de login
  router.navigate(['/login']);
  return false;
};