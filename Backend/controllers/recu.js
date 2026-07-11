// On importe l'accès à la base de données configurée précédemment
const db = require ("../config/connect");

//creer un recu

exports.createRecu = async (req, res) => {
    try {
        const { prix_total,  date_genere, idagent, iddepotbagage} = req.body;
        const sql = "INSERT INTO recu (PRIX_TOTAL, DATE_GENERE, IDAGENT, IDDEPOTBAGAGE) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(sql, [prix_total, date_genere, idagent, iddepotbagage]);
        res.status(201).json({ message: "Reçu créé avec succès", recu: { ...req.body, IDRECU: result.insertId } });
    } catch (error) {
        console.error("Erreur lors de la création du reçu :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

//lister tous les reçus
exports.getAllRecus = async (req, res) => {
    try {
        const sql = "SELECT * FROM recu";
        const [result] = await db.query(sql);
        res.status(200).json({ recu: result });
    } catch (error) {
        console.error("Erreur lors de la récupération des reçus :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

//modifier les reçus
exports.updateRecu = async (req, res) => {
    try {
        const { id } = req.params;
        const { prix_total,  date_genere, idagent, iddepotbagage} = req.body;
        const sql = "UPDATE recu SET PRIX_TOTAL = ?, DATE_GENERE = ?, IDAGENT = ?, IDDEPOTBAGAGE = ? WHERE IDRECU = ?";
        const [result] = await db.query(sql, [prix_total, date_genere, idagent, iddepotbagage, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Reçu non trouvé" });
        }
        res.status(200).json({ message: "Reçu mis à jour avec succès", recu: { ...req.body, IDRECU: id } });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du reçu :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};


//supprimer les reçus
exports.deleteRecu = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM recu WHERE IDRECU = ?";
        const [result] = await db.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Reçu non trouvé" });
        }
        res.status(200).json({ message: "Reçu supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du reçu :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
