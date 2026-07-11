// Importation d'Express pour utiliser le système de routage
const express = require("express");
// On utilise le sous-système Router d'Express pour créer des routes modulaires et isolées
const router = express.Router();    

// On importe le contrôleur associé. C'est lui qui contient la vraie logique de traitement
const recuController = require("../controllers/recu");

const auth = require("../middleware/auth");

// Route POST sur "/" (qui devient en réalité "POST /recu/" grâce au préfixe dans server.js)
// Quand cette URL est appelée, Express exécute la fonction "createRecu" du contrôleur
router.post("/", recuController.createRecu);

//liste des reçus
router.get("/", auth, recuController.getAllRecus);
//modifier les reçus
router.put("/:id", auth, recuController.updateRecu);
//supprimer un reçu
router.delete("/:id", auth, recuController.deleteRecu);

// On exporte le routeur pour que le fichier server.js puisse l'importer et l'utiliser
module.exports = router;