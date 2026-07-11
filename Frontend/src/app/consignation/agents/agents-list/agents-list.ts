import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agents-list.html',
  styleUrl: './agents-list.scss'
})
export class AgentsComponent implements OnInit {
  isFormOpen: boolean = false;
  isLoading: boolean = false;

  // Tableau qui accueillera les données brutes issues de MySQL
  listeAgents: any[] = [];

  // Ajustement de la structure pour correspondre aux colonnes MySQL et au formulaire
  agentForm = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    matricule: '',
    telephone: '',
    adresse: ''
  };

  // Base URL correspondant à ton fichier de routes backend redistribué
  private apiUrl = 'http://localhost:3000/api/agents'; 

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.chargerAgents();
  }

  toggleForm(): void {
    this.isFormOpen = !this.isFormOpen;
    if (!this.isFormOpen) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.agentForm = { nom: '', prenom: '', email: '', password: '', matricule: '', telephone: '', adresse: '' };
  }

  // Récupération des jetons d'authentification requis par ton middleware "auth"
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // 1. CHARGER LA LISTE DES AGENTS DESORMAIS ACTIF
  chargerAgents(): void {
    this.http.get<any[]>(this.apiUrl, this.getAuthHeaders()).subscribe({
      next: (data) => {
        this.listeAgents = data;
      },
      error: (err) => console.error('Erreur lors du chargement des agents', err)
    });
  }

  // 2. SOUMISSION ET ENREGISTREMENT (POST)
  onSubmitAgent(): void {
    if (!this.agentForm.nom || !this.agentForm.email || !this.agentForm.password) return;

    this.isLoading = true;

    // Préparation de l'objet attendu par ton agentController.createAgent
    const bodyPayload = {
      Nom: this.agentForm.nom,
      Prenom: this.agentForm.prenom || 'Agent', // Évite un champ vide
      Email: this.agentForm.email,
      Mot_de_passe: this.agentForm.password,
      Matricule: this.agentForm.matricule || 'MAT-' + Math.floor(Math.random() * 1000),
      Num_telephone: this.agentForm.telephone,
      Adresse: this.agentForm.adresse
    };

    this.http.post(`${this.apiUrl}/register`, bodyPayload, this.getAuthHeaders()).subscribe({
      next: () => {
        this.isLoading = false;
        this.toggleForm();
        this.chargerAgents();
        alert('Compte Agent créé avec succès !');
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.error?.error || "Une erreur est survenue lors de l'enregistrement");
      }
    });
  }

  // 3. SUPPRESSION D'UN AGENT (DELETE) VIA IDAgent
  supprimerAgent(idAgent: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet agent ?')) {
      this.http.delete(`${this.apiUrl}/${idAgent}`, this.getAuthHeaders()).subscribe({
        next: () => {
          this.listeAgents = this.listeAgents.filter(agent => agent.IDAgent !== idAgent);
        },
        error: (err) => alert("Erreur lors de la suppression de l'agent")
      });
    }
  }

  // 4. LOGOUT
  onLogout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}