import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'danger' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Un flux de données pour suivre les notifications en temps réel
  private notification$ = new BehaviorSubject<Notification | null>(null);

  constructor() {}

  // Permet aux composants d'écouter les nouvelles notifications
  getNotifications() {
    return this.notification$.asObservable();
  }

  // Afficher une alerte de succès (Verte)
  showSuccess(message: string): void {
    this.notification$.next({ message, type: 'success' });
    this.autoHide();
  }

  // Afficher une alerte d'erreur (Rouge)
  showError(message: string): void {
    this.notification$.next({ message, type: 'danger' });
    this.autoHide();
  }

  // Effacer la notification en cours
  clear(): void {
    this.notification$.next(null);
  }

  // Masquer automatiquement l'alerte après 4 secondes
  private autoHide(): void {
    setTimeout(() => {
      this.clear();
    }, 4000);
  }
}