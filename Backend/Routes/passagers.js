const express = require('express');
const router = express.Router();
const passagerController = require('../Controllers/passagers');

// Route pour CREER un passager

router.post('/register', passagerController.createPassager);

// Route pour LISTER tous les passagers

router.get('/', passagerController.getAllPassagers);

// Route pour MODFIER un passager

router.put('/:id', passagerController.updatePassager);

// Route pour SUPPRIMER un passager

router.delete('/:id', passagerController.deletePassager);
module.exports = router;