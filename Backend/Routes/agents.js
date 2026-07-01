const express = require('express');
const router = express.Router();
const agentController = require('../Controllers/agents'); 

// Route POST : http://localhost:6000/api/agents/register
router.post('/register', agentController.createAgent);

//Nouvelle Route GET : Pour récupérer laliste des agents
//L'URL complete sera : http://localhost:6000/api/agents/

router.get('/', agentController.getAllAgents);

// Nouvelle Route PUT : On utilise ':matricule' pour capter le paramètre variable dans l'URL
// L'URL complète sera : http://localhost:6000/api/agents/LE_MATRICULE
router.put('/:matricule', agentController.updateAgent);

//Nouvelle Route DELETE : On cible l'agent par son matricule
// L'URL complète sera : http://localhost:6000/api/agents/LE_MATRICULE
router.delete('/:matricule', agentController.deleteAgent);


module.exports = router;

