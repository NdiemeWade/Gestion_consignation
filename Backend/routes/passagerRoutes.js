const express = require("express");
const router = express.Router();
const passagerController = require("../controllers/passager");
const auth = require("../middleware/auth");

router.post("/", auth, passagerController.createPassager);    
router.get("/", auth, passagerController.getAllPassagers);
router.get("/recherche/:piece", auth, passagerController.getPassagerByPiece); //  Nouvelle route utile
router.get("/:id/historique", auth, passagerController.getPassagerHistorique);
router.put("/:id", auth, passagerController.updatePassager);
router.delete("/:id", auth, passagerController.deletePassager);

module.exports = router;