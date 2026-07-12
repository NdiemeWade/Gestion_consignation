# 🧳 Application Full-Stack : Gestion de Consigne de Bagages

## 📌 Présentation du Projet
Ce projet est une application web full-stack conçue pour automatiser, sécuriser et moderniser la gestion des flux de bagages au sein d'un terminal (transit, gare ou aéroport). Elle permet aux agents d'enregistrer les dépôts, de suivre l'état des boxes en temps réel, de gérer les fiches passagers et de contrôler les accès de sécurité du personnel.

L'application repose sur une architecture moderne séparant un **Frontend dynamique (Angular)** et un **Backend robuste (Node.js / Express)** communiquant via une API REST sécurisée.

---

## 🏗️ 1. Architecture Technique & Stack

L'application est découpée en trois couches distinctes :

### 💻 Frontend (Client)
* **Framework** : Angular (Architecture Standalone components)
* **Design & Layout** : Bootstrap 5 & Bootstrap Icons (Interface fluide et responsive)
* **Gestion Asynchrone** : `HttpClient` (Angular) & programmation réactive avec `RxJS`

### ⚙️ Backend (Serveur)
* **Environnement** : Node.js
* **Framework Web** : Express.js
* **Sécurité** : `jsonwebtoken` (JWT) pour la protection des routes par token

### 🗄️ Base de Données (Stockage)
* **Système** : MySQL
* **Driver** : `mysql2` (avec support des requêtes asynchrones par promesses)

---

## 🗃️ 2. Modélisation de la Base de Données

L'application s'appuie sur un schéma MySQL relationnel structuré autour de la traçabilité des dépôts.

### Table `agent` (Gestion du personnel)
* `IDAgent` (INT, PK, Auto-increment) : Identifiant unique interne.
* `MATRICULE` (VARCHAR, UNIQUE) : Identifiant public de l'agent (ex: `MAT-482`).
* `NOM` / `PRENOM` (VARCHAR) : Identité de l'agent.
* `EMAIL` (VARCHAR, UNIQUE) : Identifiant de connexion.
* `MOT_DE_PASSE` (VARCHAR) : Chaîne d'authentification sécurisée.
* `NUM_TELEPHONE` (VARCHAR) : Contact de l'agent.

### Table `depot_bagage` (Suivi opérationnel)
* `IDDEPOTBAGAGE` (INT, PK, Auto-increment) : Référence de consigne.
* `EMPLACEMENT` (VARCHAR) : Référence du box ou de la zone (ex: `BOX A-12`).
* `NBR_BAGAGE` (INT) : Quantité déposée.
* `FORMAT` (VARCHAR) : Gabarit (`Petit`, `Moyen`, `Grand`).
* `PRIX_UNITAIRE` (INT) : Tarif par bagage (calcul dynamique du montant total).
* `DATE_PREVU_RAMASSAGE` (DATE) : Date limite de retrait.
* `MOTIFDEPOT` / `DESCRIPTION` (TEXT) : Notes de suivi.

---

## 🚀 3. Cartographie de l'API REST (Backend)

**Préfixe global des routes** : `http://localhost:3000/api`

### 👥 Module Agents
* `POST /api/agents/login` 🔓 *Public* — Authentification et génération du Token JWT.
* `GET /api/agents` 🔐 *Protégé* — Récupération de la liste des agents opérationnels.
* `POST /api/agents/register` 🔐 *Protégé* — Enregistrement d'un nouvel agent.
* `PUT /api/agents/:matricule` 🔐 *Protégé* — Modification d'un agent via son matricule.
* `DELETE /api/agents/:id` 🔐 *Protégé* — Suppression d'accès via l'ID de l'agent.

### 💼 Module Bagages
* `GET /api/bagages` 🔐 *Protégé* — Liste de l'historique récent des dépôts.
* `POST /api/bagages` 🔐 *Protégé* — Enregistrement d'un dépôt de bagage + liaison passager.
* `PUT /api/bagages/:id` 🔐 *Protégé* — Mise à jour des détails d'un dépôt en cours.
* `DELETE /api/bagages/:id` 🔐 *Protégé* — Annulation ou purge d'une consigne.

> 🛠️ **Sécurité des requêtes** : Toutes les routes marquées 🔐 imposent l'injection du token dans les en-têtes HTTP via la clé : `Authorization: Bearer <token_jwt>`.

---

## 🧠 4. Rétrospective : Problèmes rencontrés & Solutions apportées

Cette section détaille les défis techniques survenus durant le cycle de développement et les choix d'ingénierie appliqués pour les résoudre.

### ❌ Problème 1 : Désynchronisation de la casse des propriétés (Object Mapping)
* **Symptôme** : Lors du chargement de la liste des agents, les champs restaient désespérément vides à l'écran, bien que le réseau affiche un code `200 OK`.
* **Analyse** : Le backend Express extrait et renvoie les lignes MySQL brutes en conservant la casse stricte de la base de données (`agent.NOM`, `agent.EMAIL`). Côté Angular, le formulaire et le template utilisaient des propriétés en minuscules (`agent.nom`, `agent.email`). L'application tentait de lire des propriétés indéfinies.
* **Solution Pédagogique** : Alignement rigoureux des modèles de données. Réécriture complète du mapping dans le composant Angular (`agents-list.ts`) pour capturer explicitement la casse majuscule renvoyée par MySQL lors de la phase de lecture, tout en conservant une structure de payload claire en minuscules lors du destructuring dans `req.body` côté backend.

### ❌ Problème 2 : Conflit de clés d'identification d'URL (ID vs Matricule)
* **Symptôme** : L'action de mise à jour d'un agent renvoyait systématiquement une erreur `404 Not Found` ou échouait silencieusement.
* **Analyse** : Le contrôleur backend Express avait été conçu pour cibler la modification d'un agent via son identifiant métier unique : le `MATRICULE` (`PUT /api/agents/:matricule`). À l'inverse, le frontend Angular envoyait l'identifiant technique de la base (`IDAgent`). L'URL générée ne correspondait à aucun pattern de route connu.
* **Solution Pédagogique** : Implémentation d'un état d'édition hybride côté client. Sauvegarde du `agent.MATRICULE` dans une variable contextuelle `matriculeAgentEnCours` dès le clic sur le bouton d'édition. Angular construit désormais l'URL dynamique correcte attendue par le routeur Express.

### ❌ Problème 3 : Erreur d'incompatibilité asynchrone MySQL (Destructuring Crash)
* **Symptôme** : Crash ou blocage intermittent lors de l'enregistrement des formulaires avec l'alerte générique `"Une erreur est survenue lors de l'enregistrement"`.
* **Analyse** : Utilisation de la syntaxe asynchrone moderne `const [result] = await db.query(sql)` dans le contrôleur backend, alors que le pool de connexion initial n'exécutait pas des promesses mais des fonctions de callback standard (`mysql2` non configuré en mode promise). Le mot-clé `await` échouait à résoudre l'objet.
* **Solution Pédagogique** : Standardisation de la couche d'accès aux données. Utilisation stricte du wrapper de promesses de `mysql2` ou réécriture homogène des appels en mode callback (comme sur la route `DELETE`), garantissant une libération propre des connexions au pool MySQL sans bloquer le thread Node.js.

### ❌ Problème 4 : Validation stricte des données à l'entrée
* **Symptôme** : Rejet de requêtes d'enregistrement valides côté code avec des blocages de type `400 Bad Request`.
* **Analyse** : Saisie de chaînes de caractères arbitraires ou erronées dans les champs d'emails (ex: oubli de l'arobase `@` ou du domaine). La base de données ou le validateur backend rejetait l'insertion pour non-respect des contraintes d'intégrité.
* **Solution Pédagogique** : Ajout de garde-fous visuels (attributs HTML5 `required` et `type="email"`) combinés à des messages d'erreur explicites interceptés dans le bloc `.subscribe({ error: (err) => ... })` d'Angular, permettant d'afficher à l'utilisateur la raison exacte du rejet serveur au lieu d'une erreur générique.

---

## 🛠️ 5. Procédure d'Installation & Démarrage

### Déploiement du Serveur (Backend)
1. Ouvrez un terminal dans le dossier `backend/`.
2. Installez les packages Node requis :
   ```bash
   npm install