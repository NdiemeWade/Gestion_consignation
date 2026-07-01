// Importation d'Express pour utiliser le système de routage
const express = require("express");
// On utilise le sous-système Router d'Express pour créer des routes modulaires et isolées
const router = express.Router();

// On importe le contrôleur associé. C'est lui qui contient la vraie logique de traitement
const agentController = require("../controllers/agent");

// Route POST sur "/" (qui devient en réalité "POST /agent/" grâce au préfixe dans server.js)
// Quand cette URL est appelée, Express exécute la fonction "createAgent" du contrôleur
router.post("/", agentController.createAgent);


//liste des agents
router.get("/", agentController.getAllAgents);

//modifier les agents
router.put("/:matricule", agentController.updateAgent);

//supprimer un agent
router.delete("/:matricule", agentController.deleteAgent);


// On exporte le routeur pour que le fichier server.js puisse l'importer et l'utiliser
module.exports = router;




