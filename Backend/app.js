//Importation du framework Express pour gérer notre serveur web
const express = require('express');
//Initialisation de l'application Express
const app = express();

// Middleware crucial : permet à Express d'analyser le corps des requêtes au format JSON (req.body)
// Sans ça, toutes nos données envoyées en POST arriveraient "undefined"
app.use(express.json());

// On importe notre routeur personnalisé qui gère la logique des routes liées aux agents
const agentRoutes = require("./routes/agentRoutes");

// On associe le préfixe d'URL "/agent" à notre routeur. 
// Toutes les requêtes qui commencent par "/agent" seront redirigées vers agentRoutes
app.use("/agent", agentRoutes);

// On importe notre routeur personnalisé qui gère la logique des routes liées aux dépôts de bagages
const depotbagageRoutes = require("./routes/depotbagageRoutes");

// On associe le préfixe d'URL "/depotbagage" à notre routeur. 
// Toutes les requêtes qui commencent par "/depotbagage" seront redirigées vers depotbagageRoutes
app.use("/depotbagage", depotbagageRoutes);


// Démarrage du serveur web sur le port 3000
app.listen(3000, () => {
   // Message de confirmation affiché dans la console du serveur
   console.log('Server is running on http://localhost:3000');

  

});