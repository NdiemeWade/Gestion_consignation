import { Routes } from '@angular/router';

// Import des Layouts
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';

// Import des Pages Publiques



// Import des Pages Admin / Consignation

import { AgentsComponent } from './consignation/agents/agents-list/agents-list';

// Import des Guards de Sécurité
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';
import { Onboarding } from './public/onboarding/onboarding';
import { Dashboard } from './consignation/dashboard/dashboard';
import { BagagesList } from './consignation/bagages/bagages-list/bagages-list';
import { ClientsList } from './consignation/clients/clients-list/clients-list';
import { Login } from './public/login/login';


export const routes: Routes = [
  // Redirection racine : renvoie automatiquement vers le login si l'URL est vide
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },

  // ==========================================
  // ROUTE 1 : Espace Public (Hors-connexion)
  // ==========================================
  {
    path: '',
    component: PublicLayoutComponent,
    canActivate: [noAuthGuard], // Bloque l'accès si l'agent est DÉJÀ connecté
    children: [
      { path: 'login', component: Login },
      { path: 'onboarding', component: Onboarding }
    ]
  },

  // ==========================================
  // ROUTE 2 : Espace Consignation (Gestion / Admin)
  // ==========================================
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard], // Bloque l'accès si l'agent N'EST PAS connecté
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'bagages', component: BagagesList },
      { path: 'clients', component: ClientsList },
      { path: 'agents', component: AgentsComponent }
    ]
  },

  // Route de secours (Wildcard) : redirige n'importe quelle URL inconnue vers le login
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];