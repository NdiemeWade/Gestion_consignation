import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { StorageService } from './storage';
import { NotificationService } from './notification';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private notificationService: NotificationService
  ) {}

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    
    // Traduction pour correspondre aux variables attendues par le Backend
    const backendData = {
      email: credentials.username,
      mot_de_passe: credentials.password
    };

    // On force l'adresse absolue pour ignorer le préfixe /api automatique
    return this.apiService.post<AuthResponse>('agent/login', backendData).pipe(
      tap({
        next: (response) => {
          // Sauvegarde des informations de session
          this.storageService.saveItem(this.TOKEN_KEY, response.token);
          this.storageService.saveObject(this.USER_KEY, { email: credentials.username, role: 'agent' });
          
          this.notificationService.showSuccess(`Connexion réussie !`);
        },
        error: (err) => {
          this.notificationService.showError('Identifiants incorrects ou serveur injoignable.');
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return this.storageService.getItem(this.TOKEN_KEY) !== null;
  }

  getCurrentUser() {
    return this.storageService.getObject(this.USER_KEY);
  }

  logout(): void {
    this.storageService.removeItem(this.TOKEN_KEY);
    this.storageService.removeItem(this.USER_KEY);
    this.notificationService.showSuccess('Vous avez été déconnecté avec succès.');
  }
}