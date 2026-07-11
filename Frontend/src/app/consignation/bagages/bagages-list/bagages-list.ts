import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BagageService } from '../../../core/services/bagage.service';
import { PassagerService } from '../../../core/services/passager.service';

@Component({
  selector: 'app-bagages-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bagages-list.html',
  styleUrl: './bagages-list.scss',
})
export class BagagesList implements OnInit {
  // Liste des dépôts à afficher dans le tableau HTML
  listeDepots: any[] = [];
  
  // États de l'interface
  isFormOpen: boolean = false;
  isLoading: boolean = false;
  
  // Objet contenant le dépôt sélectionné pour afficher le ticket/reçu
  recuSelectionne: any = null;

  // 1. Modèle pour les informations du Passager
  passagerForm = {
    nom: '',
    prenom: '',
    num_piece_identite: '',
    num_telephone: '',
    email: '',
    adresse: ''
  };

  // 2. Modèle pour le Dépôt de Bagage
  bagageForm = {
    motifdepot: '',
    typedepot: 'Classique', 
    format: 'Moyen',       
    description: '',
    emplacement: '',
    date_depot: '',
    date_prevu_ramassage: '',
    nbr_bagage: 1,
    prix_unitaire: 0,
    device: 'XOF',
    taux_conversion: 1.0
  };

  constructor(
    private bagageService: BagageService,
    private passagerService: PassagerService
  ) {}

  ngOnInit(): void {
    this.chargerTousLesDepots();
  }

  //  Charge l'historique complet depuis la base de données
  chargerTousLesDepots(): void {
    this.isLoading = true;
    this.bagageService.getAlldepots().subscribe({
      next: (response) => {
        this.listeDepots = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des bagages :', err);
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.isFormOpen = !this.isFormOpen;
  }

  //  Soumission séquentielle du formulaire (Passager puis Bagage)
  onSubmitDepot(): void {
    if (!this.passagerForm.nom || !this.passagerForm.num_piece_identite) {
      alert('Veuillez remplir les informations obligatoires du passager.');
      return;
    }

    this.isLoading = true;

    //  Récupération de l'ID de l'agent connecté depuis le stockage local
    const agentConnecte = JSON.parse(localStorage.getItem('user_info') || '{}');
    const currentAgentId = agentConnecte.idagent || 1; 

    // Construction de l'objet passager complet avec l'idagent attendu par Node.js
    const donneesPassager = {
      ...this.passagerForm,
      idagent: currentAgentId
    }

    // Étape 1 : Création du passager sur le Backend
    this.passagerService.createPassager(donneesPassager).subscribe({
      next: (resPassager) => {
        console.log('👤 Passager enregistré avec succès !', resPassager);
        
        const newPassagerId = resPassager.idpassager;

        // On lie l'ID passager ET l'ID agent aux informations du bagage
        const donneesCompletesDepot = {
          ...this.bagageForm,
          idagent: currentAgentId,
          idpassager: newPassagerId
        };

        // Étape 2 : Création du dépôt de bagage lié à ce passager
        this.bagageService.createDepot(donneesCompletesDepot).subscribe({
          next: (resBagage) => {
            console.log('🧳 Dépôt enregistré avec succès !');
            this.isLoading = false;
            
            //  Préparation et ouverture du reçu suite au succès de la transaction
            this.recuSelectionne = {
              id: resBagage.iddepotbagage || resBagage.id || 'Nouveau',
              nom: this.passagerForm.nom,
              prenom: this.passagerForm.prenom,
              telephone: this.passagerForm.num_telephone,
              piece: this.passagerForm.num_piece_identite,
              emplacement: this.bagageForm.emplacement,
              nbr_bagage: this.bagageForm.nbr_bagage,
              prix_unitaire: this.bagageForm.prix_unitaire,
              format: this.bagageForm.format,
              date_depot: new Date(),
              date_retrait: this.bagageForm.date_prevu_ramassage
            };

            alert(' Enregistrement réussi et dépôt créé !');
            this.toggleForm();             // On ferme le formulaire de saisie
            this.chargerTousLesDepots();   // On rafraîchit le tableau de l'historique
            this.reinitialiserFormulaires();
          },
          error: (errBagage) => {
            this.isLoading = false;
            console.error('Erreur lors du dépôt du bagage', errBagage);
            alert('Le passager a été créé, mais une erreur est survenue lors du dépôt du bagage.');
          }
        });
      },
      error: (errPassager) => {
        this.isLoading = false;
        console.error('Erreur lors de l\'enregistrement du passager', errPassager);
        alert('Erreur lors de la création du passager.');
      }
    });
  }

  //  Permet d'ouvrir le reçu d'un bagage existant depuis la liste
  voirRecu(depot: any): void {
    this.recuSelectionne = {
      id: depot.IDDEPOTBAGAGE,
      nom: depot.NOM || 'Inconnu',
      prenom: depot.PRENOM || '',
      telephone: depot.NUM_TELEPHONE || 'N/A',
      piece: depot.NUM_PIECE_IDENTITE || 'N/A',
      emplacement: depot.EMPLACEMENT,
      nbr_bagage: depot.NBR_BAGAGE,
      prix_unitaire: depot.PRIX_UNITAIRE,
      format: depot.FORMAT,
      date_depot: depot.DATE_DEPOT,
      date_retrait: depot.DATE_PREVU_RAMASSAGE
    };
  }

  imprimerRecu(): void {
    window.print();
  }

  fermerRecu(): void {
    this.recuSelectionne = null;
  }

// 🗑️ Supprime un dépôt de bagage à partir de son ID
  supprimerConsigne(idDepot: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce dépôt de bagages ?")) {
      this.bagageService.deleteDepot(idDepot).subscribe({
        next: (response) => {
          alert('Dépôt supprimé avec succès !');
          this.chargerTousLesDepots(); // Recharge le tableau automatiquement
        },
        error: (err) => {
          console.error("Erreur lors de la suppression :", err);
          alert("Une erreur est survenue lors de la suppression.");
        }
      });
    }
  }

  reinitialiserFormulaires(): void {
    this.passagerForm = { nom: '', prenom: '', num_piece_identite: '', num_telephone: '', email: '', adresse: '' };
    this.bagageForm = { motifdepot: '', typedepot: 'Classique', format: 'Moyen', description: '', emplacement: '', date_depot: '', date_prevu_ramassage: '', nbr_bagage: 1, prix_unitaire: 0, device: 'XOF', taux_conversion: 1.0 };
  }
}