const pool = require('../Config/connect');

//1. CREER un passager

// 1. CRÉER un passager
exports.createPassager = async (req, res) => {
    const { Nom, Prenom, Num_piece_identite, Num_telephone, Email, Adresse, IDAgent } = req.body;

    if (!Nom || !Prenom || !Num_piece_identite || !Num_telephone || !Email || !Adresse || !IDAgent) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires, y compris l'ID de l'agent." });
    }

    try {
        // Requête écrite sur une seule ligne pour éviter les erreurs de syntaxe avec les espaces
        const sql = "INSERT INTO passager (Nom, Prenom, Num_piece_identite, Num_telephone, Email, Adresse, IDAgent) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        await pool.query(sql, [Nom, Prenom, Num_piece_identite, Num_telephone, Email, Adresse, IDAgent]);
        
        return res.status(201).json({ message: "Passager enregistré avec succès !" });
    } catch (error) {
        console.error("Erreur lors de la création du passager :", error.message);
        
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ message: "Impossible d'enregistrer : cet IDAgent n'existe pas." });
        }
        return res.status(500).json({ message: "Erreur interne du serveur lors de la création." });
    }
};

// 2. LISTER tous les passagers

exports.getAllPassagers = async (req, res) => {
    try{
        const [rows] = await pool.query(`SELECT * FROM passager`);
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des passagers :", error.message');
        return res.status(500).json({ message: "Erreur interne du serveur lors de la récupération."});
    }
};


// 3. MODIFIER un passager
exports.updatePassager = async (req, res) => {
    const { id } = req.params; // Récupère le chiffre à la fin de l'URL (/api/passagers/2)
    const { Nom, Prenom, Num_piece_identite, Num_telephone, Email, Adresse, IDAgent } = req.body;

    if (!Nom || !Prenom || !Num_piece_identite || !Num_telephone || !Email || !Adresse || !IDAgent) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    try {
        // La requête SQL bien droite
        const sql = "UPDATE passager SET Nom = ?, Prenom = ?, Num_piece_identite = ?, Num_telephone = ?, Email = ?, Adresse = ?, IDAgent = ? WHERE IDPassager = ?";
        
        // ATTENTION : "id" doit être absolument le tout dernier élément du tableau car il correspond au "WHERE IDPassager = ?"
        const [result] = await pool.query(sql, [Nom, Prenom, Num_piece_identite, Num_telephone, Email, Adresse, IDAgent, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Passager non trouvé." });
        }

        return res.status(200).json({ message: "Passager modifié avec succès !" });
    } catch (error) {
        console.error("Erreur lors de la modification du passager :", error.message);
        return res.status(500).json({ message: "Erreur interne du serveur lors de la modification." });
    }
};

// 4. SUPPRIMER un passager
exports.deletePassager = async (req, res) => {
    const { id } = req.params; // L'IDPassager passé dans l'URL

    try {
        const sql = `DELETE FROM passager WHERE IDPassager = ?`;
        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Passager non trouvé. Impossible de le supprimer." });
        }

        return res.status(200).json({ message: "Passager supprimé avec succès !" });
    } catch (error) {
        console.error(" Erreur lors de la suppression du passager :", error.message);
        return res.status(500).json({ message: "Erreur interne du serveur lors de la suppression." });
    }
};