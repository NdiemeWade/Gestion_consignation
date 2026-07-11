import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si l'agent est déjà connecté, on lui interdit le Login et on l'envoie sur le Dashboard
  if (authService.isLoggedIn()) {
    router.navigate(['/dashboard']);
    return false;
  }

  // Sinon (s'il n'est pas connecté), il peut voir la page de Login
  return true;
};