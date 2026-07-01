// On importe la version de mysql2 qui gère les Promesses.
// Indispensable pour pouvoir utiliser la syntaxe moderne async/await dans nos contrôleurs
const mysql = require ('mysql2/promise');

// Création d'un "pool" de connexions. Plutôt que d'ouvrir/fermer une connexion à chaque requête,
// le pool maintient des connexions ouvertes réutilisables, ce qui est beaucoup plus performant.
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database:"gestion_consignation",
     waitForConnections: true,
    connectionLimit: 10

});

// On exporte le pool pour exécuter nos requêtes SQL directement dans nos contrôleurs
module.exports=pool ; 
