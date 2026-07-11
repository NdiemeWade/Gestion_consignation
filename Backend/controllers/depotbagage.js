// On importe l'accès à la base de données configurée précédemment
const db = require("../config/connect");

exports.createAllDepotsBagage = async (req, res) => {
    try {
        const {motifdepot, typedepot, format, description, emplacement, date_depot, date_prevu_ramassage, date_ramassage, nbr_bagage, prix_unitaire, device, taux_conversion, idagent, idpassager}= req.body;
        const sql = `
            INSERT INTO depotbagage (MOTIFDEPOT, TYPEDEPOT, FORMAT, DESCRIPTION, EMPLACEMENT, DATE_DEPOT, DATE_PREVU_RAMASSAGE, DATE_RAMASSAGE, NBR_BAGAGE, PRIX_UNITAIRE, DEVICE, TAUX_CONVERSION, IDAGENT, IDPASSAGER)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
       
        const [result] = await db.query(sql, [motifdepot, typedepot, format, description, emplacement, date_depot, date_prevu_ramassage, date_ramassage, nbr_bagage, prix_unitaire, device, taux_conversion, idagent, idpassager]);
        res.status(201).json({
            message: "Tous les dépôts de bagages ont été créés avec succès",
            count: result.affectedRows
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
};

exports.getAlldepotbagage = async (req, res) => {
    try {
        const sql = "SELECT * FROM depotbagage";
        const [rows] = await db.query(sql);
        res.status(200).json({
            message: "Liste des dépôts de bagages",
            data: rows
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
}; 

// ==========================================
// GET DEPOTS STATS (DASHBOARD) - CORRIGÉ 🛠️
// ==========================================
exports.getDepotStats = async (req, res) => {
    try {
        const sql = `
            SELECT 
                COUNT(*) as total_depots,
                IFNULL(SUM(NBR_BAGAGE), 0) as total_bagages,
                IFNULL(SUM(NBR_BAGAGE * PRIX_UNITAIRE), 0) as chiffre_affaires,
                COUNT(CASE WHEN DATE_PREVU_RAMASSAGE < NOW() AND DATE_RAMASSAGE IS NULL THEN 1 END) as alertes_depassement
            FROM depotbagage
        `;
        
        const [rows] = await db.query(sql);

        res.status(200).json({
            message: "Statistiques du tableau de bord récupérées avec succès",
            stats: rows[0]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des stats",
            error: err.message
        });
    }
};

exports.updateDepotBagage = async (req, res) => {
    try {
        const { id } = req.params;
        const {motifdepot, typedepot, format, description, emplacement, date_depot, date_prevu_ramassage, date_ramassage, nbr_bagage, prix_unitaire, device, taux_conversion, idagent, idpassager} = req.body;
        const sql = `
            UPDATE depotbagage
            SET MOTIFDEPOT = ?, TYPEDEPOT = ?, FORMAT = ?, DESCRIPTION = ?, EMPLACEMENT = ?, DATE_DEPOT = ?, DATE_PREVU_RAMASSAGE = ?, DATE_RAMASSAGE = ?, NBR_BAGAGE = ?, PRIX_UNITAIRE = ?, DEVICE = ?, TAUX_CONVERSION = ?, IDAGENT = ?, IDPASSAGER = ?
            WHERE IDDEPOTBAGAGE = ?
        `;
        const [result] = await db.query(sql, [motifdepot, typedepot, format, description, emplacement, date_depot, date_prevu_ramassage, date_ramassage, nbr_bagage, prix_unitaire, device, taux_conversion, idagent, idpassager, id]);
        res.status(200).json({
            message: "Dépôt de bagage mis à jour avec succès",
            count: result.affectedRows
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
};

exports.deleteDepotBagage = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. ÉTAPE COMMUNE : Supprimer d'abord le reçu rattaché à ce bagage
        // Cela libère la contrainte de clé étrangère (Foreign Key)
        const sqlDeleteRecu = "DELETE FROM recu WHERE IDDepotBagage = ?";
        await db.query(sqlDeleteRecu, [id]);

        // 2. ÉTAPE PRINCIPALE : Maintenant on peut supprimer le bagage en toute sécurité
        const sqlDeleteBagage = "DELETE FROM depotbagage WHERE IDDEPOTBAGAGE = ?";
        const [result] = await db.query(sqlDeleteBagage, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Dépôt de bagage non trouvé"
            });
        }

        res.status(200).json({
            message: "Dépôt de bagage et reçu associés supprimés avec succès"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
};