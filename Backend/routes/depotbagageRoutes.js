// Importation d'Express pour utiliser le système de routage
const express = require("express");
// On utilise le sous-système Router d'Express pour créer des routes modulaires et isolées
const router = express.Router();

// On importe le contrôleur associé. C'est lui qui contient la vraie logique de traitement
const depotbagageController = require("../controllers/depotbagage");

// Route POST sur "/" (qui devient en réalité "POST /depotbagage/" grâce au préfixe dans server.js)
// Quand cette URL est appelée, Express exécute la fonction "createAllDepotsBagage" du contrôleur
router.post("/", depotbagageController.createAllDepotsBagage);

//liste des dépôts de bagages
router.get("/", depotbagageController.getAlldepotbagage);

//modifier les dépôts de bagages
router.put("/:id", depotbagageController.updateDepotBagage);

//supprimer un dépôt de bagage
router.delete("/:id", depotbagageController.deleteDepotBagage);







// On exporte le routeur pour que le fichier server.js puisse l'importer et l'utiliser
module.exports = router;