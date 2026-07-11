import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // L'URL de base de ton backend (à adapter selon la configuration de ton serveur Node/Java/Python)
  private readonly baseUrl: string = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  // Générer les headers par défaut (JSON)
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Requête GET (Ex: Récupérer la liste des bagages)
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  // Requête POST (Ex: Enregistrer un nouveau client, se connecter)
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  // Requête PUT (Ex: Modifier le statut d'une consignation)
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  // Requête DELETE (Ex: Supprimer un enregistrement erroné)
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders()
    });
  }
}