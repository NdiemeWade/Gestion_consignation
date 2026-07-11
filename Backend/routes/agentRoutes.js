// ==========================
// IMPORT EXPRESS + ROUTER
// ==========================
const express = require("express");
const router = express.Router();


// ==========================
// IMPORT CONTROLLER
// ==========================
const agentController = require("../controllers/agent");


// ==========================
// IMPORT MIDDLEWARE JWT
// ==========================
// Sert à protéger certaines routes (accès uniquement avec token valide)
const auth = require("../middleware/auth");


// ==========================
// ROUTES PUBLIQUES
// ==========================
// Login doit être PUBLIC (sinon impossible de se connecter)
router.post("/login", agentController.loginAgent);


// ==========================
// ROUTES PROTÉGÉES (JWT REQUIRED)
// ==========================

// Créer un agent 
router.post("/register", auth, agentController.createAgent);

// Liste des agents
router.get("/", auth, agentController.getAllAgents);

// Modifier un agent
router.put("/:matricule", auth, agentController.updateAgent);

// Supprimer un agent
router.delete("/:id", auth, agentController.deleteAgent);


// ==========================
// EXPORT ROUTER
// ==========================
module.exports = router;