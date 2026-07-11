import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

export interface Passager {
  IDPassager?: number;
  Nom: string;
  Prenom: string;
  Num_piece_identite: string;
  Num_telephone: string;
  Email: string;
  Adresse: string;
  IDAgent: number;
}

@Injectable({
  providedIn: 'root'
})
export class PassagerService {
  constructor(private apiService: ApiService) {}

  // 👤 Créer un nouveau passager (Le Token est injecté automatiquement par l'intercepteur)
  createPassager(passagerData: any): Observable<any> {
    return this.apiService.post<any>('passager', passagerData);
  }

  // 🔍 Rechercher un passager existant par sa pièce d'identité
  getPassagerByPiece(piece: string): Observable<any> {
    return this.apiService.get<any>(`passager/recherche/${piece}`);
  }

// 📋 Récupérer tous les passagers
getAllPassagers(): Observable<any> {
  return this.apiService.get<any>('passager');
}

// 📜 Récupérer l'historique des dépôts d'un passager
getHistoriquePassager(idPassager: number): Observable<any> {
  return this.apiService.get<any>(`passager/${idPassager}/historique`);
}

}