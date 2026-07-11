
// ==========================
// IMPORT INTERNES & MODULES
// ==========================
const cors = require('cors');
const express = require("express");
const app = express();

// ==========================
// MIDDLEWARES GLOBAUX
// ==========================
app.use(cors());
app.use(express.json()); // Permet de lire req.body au format JSON

// ==========================
// IMPORTATION DES ROUTEURS
// ==========================
const agentRoutes = require("./routes/agentRoutes");
const depotbagageRoutes = require("./routes/depotbagageRoutes");
const passagerRoutes = require("./routes/passagerRoutes");
const recuRoutes = require("./routes/recuRoutes");

// ==========================
// ENREGISTREMENT DES ROUTES
// ==========================
app.use("/agent", agentRoutes);          // Exemple: /agent/login
app.use("/depotbagage", depotbagageRoutes); // Exemple: /depotbagage/stats
app.use("/passager", passagerRoutes);
app.use("/recu", recuRoutes);

// ==========================
// LANCEMENT DU SERVEUR
// ==========================
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});