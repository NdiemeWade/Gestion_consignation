import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

export interface DashboardStats {
  total_depots: number;
  total_bagages: number;
  chiffre_affaires: number;
  alertes_depassement: number;
}

interface StatsResponse {
  message: string;
  stats: DashboardStats;
}

@Injectable({
  providedIn: 'root'
})
export class BagageService {
  constructor(private apiService: ApiService) {}

  // Récupérer les statistiques du Dashboard
  getStats(): Observable<StatsResponse> {
    return this.apiService.get<StatsResponse>('depotbagage/stats');
  }

  // Enregistrer un nouveau dépôt de bagage
  createDepot(depotData: any): Observable<any> {
    return this.apiService.post<any>('depotbagage', depotData);
  }

  // Récupérer tous les dépôts de bagages enregistrés
  getAlldepots(): Observable<any> {
    return this.apiService.get<any>('depotbagage');
  }

  //  Supprimer un dépôt de bagage par son ID
  deleteDepot(idDepot: number): Observable<any> {
    return this.apiService.delete<any>(`depotbagage/${idDepot}`);
  }

}