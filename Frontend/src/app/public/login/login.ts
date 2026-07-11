import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Obligatoire pour lier les champs HTML avec ngModel
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // On active les modules nécessaires
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  // Variables pour stocker la saisie de l'agent dans le formulaire HTML
  username = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  onSubmit(): void {
    console.log('Le bouton a été cliqué !', this.username, this.password);
    if (!this.username || !this.password) return;

    this.isLoading = true;

    // Appel du service d'authentification connecté à l'API Backend
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        // 💾 SAUVEGARDE DE L'AGENT CONNECTÉ DANS LE LOCALSTORAGE
        // On vérifie que la réponse du serveur contient bien les données de l'utilisateur
        if (response && response.user) {
          const userInfo = {
            // S'adapte automatiquement selon si ton backend renvoie .id ou .idagent
            idagent: response.user.idagent || response.user.id, 
            username: response.user.username,
            nom: response.user.nom
          };
          
          // On sérialise l'objet en chaîne JSON pour pouvoir le stocker
          localStorage.setItem('user_info', JSON.stringify(userInfo));
          console.log('💾 Informations de l\'agent enregistrées avec succès :', userInfo);
        } else {
          console.warn('⚠️ Connexion réussie mais aucune information utilisateur ("user") n\'a été renvoyée par le serveur backend.');
        }

        // Connexion réussie et agent sauvegardé ! Redirection vers le tableau de bord
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        
        // Extraction du message d'erreur envoyé par l'API Node.js ou message de secours
        const errorMessage = err.error?.message || 'Identifiants incorrects ou serveur injoignable.';
        
        // Affichage d'une boîte de dialogue flash à l'écran
        alert(errorMessage);
      }
    });
  }
}