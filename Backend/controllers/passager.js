const db = require("../config/connect");

// Enregistrer un nouveau passager
exports.createPassager = async (req, res) => {
    try {
        const { nom, prenom, num_piece_identite, num_telephone, email, adresse, idagent } = req.body;

        const sql = `
            INSERT INTO passager (Nom, Prenom, Num_piece_identite, Num_telephone, Email, Adresse, IDAgent)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;  

        const [result] = await db.query(sql, [nom, prenom, num_piece_identite, num_telephone, email, adresse, idagent]);

        res.status(201).json({ 
            message: "Passager créé avec succès", 
            idpassager: result.insertId 
        });
    } catch (error) {
        console.error("Erreur lors de la création du passager :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Rechercher un passager par sa pièce d'identité (Crucial pour le guichet !)
exports.getPassagerByPiece = async (req, res) => {
    try {
        const { piece } = req.params;
        const sql = "SELECT * FROM passager WHERE Num_piece_identite = ?";
        const [rows] = await db.query(sql, [piece]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Passager non trouvé" });
        }
        res.status(200).json({ passager: rows[0] });
    } catch (error) {
        console.error("Erreur lors de la recherche du passager :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Lister tous les passagers (Amélioré avec statut de dépôt actif)
exports.getAllPassagers = async (req, res) => {
    try {
        // Cette requête SQL récupère le passager et vérifie s'il a un dépôt lié
        const sql = `
            SELECT p.*, 
            CASE WHEN COUNT(d.IDDEPOTBAGAGE) > 0 THEN 1 ELSE 0 END AS HAS_ACTIVE
            FROM passager p
            LEFT JOIN depotbagage d ON p.IDPassager = d.IDPassager
            GROUP BY p.IDPassager
            ORDER BY p.Nom ASC
        `;
        const [result] = await db.query(sql);
        
        // On renvoie une clé "data" pour correspondre parfaitement à ton composant Angular
        res.status(200).json({ 
            success: true,
            data: result 
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des passagers :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Obtenir l'historique complet des dépôts d'un passager
exports.getPassagerHistorique = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Requête alignée sur la structure réelle de ta table depotbagage
        const sql = `
            SELECT IDDEPOTBAGAGE, DATE_DEPOT, DATE_PREVU_RAMASSAGE, NBR_BAGAGE, PRIX_UNITAIRE, EMPLACEMENT
            FROM depotbagage
            WHERE IDPASSAGER = ?
            ORDER BY IDDEPOTBAGAGE DESC
        `;
        
        const [rows] = await db.query(sql, [id]);
        
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Erreur historique passager :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Modifier un passager
exports.updatePassager = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, num_piece_identite, num_telephone, email, adresse, idagent } = req.body;
        const sql = "UPDATE passager SET Nom = ?, Prenom = ?, Num_piece_identite = ?, Num_telephone = ?, Email = ?, Adresse = ?, IDAgent = ? WHERE IDPassager = ?";
        await db.query(sql, [nom, prenom, num_piece_identite, num_telephone, email, adresse, idagent, id]);
        res.status(200).json({ message: "Passager mis à jour avec succès" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du passager :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Supprimer un passager
exports.deletePassager = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM passager WHERE IDPassager = ?";
        const [result] = await db.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Passager non trouvé" });
        }
        res.status(200).json({ message: "Passager supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du passager :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};