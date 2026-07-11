import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PassagerService } from '../../../core/services/passager.service';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.scss'
})
export class ClientsList implements OnInit {
  listeClients: any[] = [];
  clientsFiltres: any[] = [];
  
  searchQuery: string = '';
  filtreStatut: string = 'Tous';
  isLoading: boolean = false;

  constructor(private passagerService: PassagerService) {}

  ngOnInit(): void {
    this.chargerTousLesClients();
  }

  chargerTousLesClients(): void {
    this.isLoading = true;
    // Remplace par la méthode correspondante de ton passagerService (ex: getAllPassagers)
    this.passagerService.getAllPassagers().subscribe({
      next: (response) => {
        // On normalise les données reçues du backend MySQL
        this.listeClients = response.data || response || [];
        this.clientsFiltres = [...this.listeClients];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur récupération clients:', err);
        this.isLoading = false;
      }
    });
  }

  filtrerClients(): void {
    let resultat = this.listeClients;

    // 1. Filtrage par barre de recherche
    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase();
      resultat = resultat.filter(c => 
        c.NOM?.toLowerCase().includes(query) ||
        c.PRENOM?.toLowerCase().includes(query) ||
        c.NUM_PIECE_IDENTITE?.toLowerCase().includes(query)
      );
    }

    // 2. Filtrage par statut (Si ton backend renvoie un indicateur de dépôt actif)
    if (this.filtreStatut === 'Actif') {
      resultat = resultat.filter(c => c.HAS_ACTIVE === true || c.HAS_ACTIVE === 1);
    }

    this.clientsFiltres = resultat;
  }

 // Déclare ces variables en haut de ta classe avec les autres
clientSelectionne: any = null;
historiqueBagages: any[] = [];
loadingHistorique: boolean = false;

ouvrirHistorique(client: any): void {
  this.clientSelectionne = client;
  this.historiqueBagages = [];
  this.loadingHistorique = true;

  // On va chercher son historique sur le serveur
  this.passagerService.getHistoriquePassager(client.IDPASSAGER).subscribe({
    next: (response) => {
      this.historiqueBagages = response.data || [];
      this.loadingHistorique = false;
      
      // Optionnel : Déclencher l'ouverture de la modale Bootstrap via JS
      // ou utiliser un drapeau structurel (*ngIf) dans le HTML
    },
    error: (err) => {
      console.error("Erreur historique :", err);
      this.loadingHistorique = false;
    }
  });
}
}