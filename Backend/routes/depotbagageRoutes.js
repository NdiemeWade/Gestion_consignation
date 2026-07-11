const express = require("express");
const router = express.Router();

// Importations du contrôleur et du middleware de sécurité
const depotbagageController = require("../controllers/depotbagage");
const auth = require("../middleware/auth");

//  1. ROUTES FIXES (Prioritaires)
router.get("/stats", auth, depotbagageController.getDepotStats);
router.get("/", auth, depotbagageController.getAlldepotbagage);
router.post("/", auth, depotbagageController.createAllDepotsBagage);

//  2. ROUTES DYNAMIQUES (Variables)
router.put("/:id", auth, depotbagageController.updateDepotBagage);
router.delete("/:id", auth, depotbagageController.deleteDepotBagage);

module.exports = router;