import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  
  // 1. On récupère le token stocké dans le localStorage via notre service
  const token = storageService.getItem('auth_token');

  // 2. Si le token existe, on clone la requête pour lui ajouter le header Authorization
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // On envoie la requête clonée et modifiée au Backend
    return next(clonedRequest);
  }

  // Si pas de token (ex: page de login), on laisse passer la requête normale
  return next(req);
};