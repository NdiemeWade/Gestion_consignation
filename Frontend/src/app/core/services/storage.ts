import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Rend le service disponible dans toute l'application
})
export class StorageService {

  constructor() { }

  // Sauvegarder une chaîne de caractères (ex: le Token JWT)
  saveItem(key: string, value: string): void {
    localStorage.removeItem(key);
    localStorage.setItem(key, value);
  }

  // Récupérer une chaîne de caractères
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Sauvegarder un objet complexe (ex: les infos de l'utilisateur connecté)
  saveObject(key: string, obj: any): void {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(obj));
  }

  // Récupérer un objet complexe
  getObject(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Supprimer un élément spécifique (ex: au moment du Logout)
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Tout vider d'un coup
  clear(): void {
    localStorage.clear();
  }
}