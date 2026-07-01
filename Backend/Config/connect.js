const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "gestion_consignation", // Assurez-vous d'avoir créé cette BDD dans XAMPP !
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Pour tester si la connexion fonctionne bien au lancement du script
pool.getConnection()
  .then(connection => {
    console.log(' Connecté à la base de données MySQL (MariaDB) !');
    connection.release(); // TRÈS IMPORTANT : On libère la connexion pour que le pool puisse la réutiliser
  })
  .catch(err => {
    console.error(' Erreur de connexion à la base de données :', err.message);
  });

// On exporte le pool pour pouvoir faire des requêtes dans vos autres fichiers
module.exports = pool;