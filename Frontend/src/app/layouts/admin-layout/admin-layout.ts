import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // 👈 Ajout de Router ici

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayoutComponent {

  // On injecte le service Router pour gérer la redirection
  constructor(private router: Router) {}

  // La fonction de déconnexion
  onLogout(): void {
    // 1. On nettoie les jetons d'accès
    localStorage.clear();
    sessionStorage.clear();

    // 2. On redirige vers la page de connexion
    this.router.navigate(['/login']);
  }
}