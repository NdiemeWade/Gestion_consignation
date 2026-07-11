import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BagageService } from '../../core/services/bagage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  stats = {
    totalBagages: 0,
    bagagesActuels: 0,
    revenusJour: 0,
    alertesDepassement: 0
  };

  isLoading = true;

  constructor(private bagageService: BagageService) {}

  ngOnInit(): void {
    this.chargerStatistiques();
  }

  chargerStatistiques(): void {
    this.bagageService.getStats().subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Liaison parfaite avec les résultats de notre nouvelle requête SQL
        this.stats.totalBagages = response.stats.total_depots;
        this.stats.bagagesActuels = response.stats.total_bagages;
        this.stats.revenusJour = response.stats.chiffre_affaires;
        this.stats.alertesDepassement = response.stats.alertes_depassement;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Impossible de charger les statistiques', err);
      }
    });
  }
}