// =======================
// IMPORTS
// =======================

// Connexion base de données
const db = require("../config/connect");

// JWT pour créer des tokens de connexion
const jwt = require("jsonwebtoken");

const JWT_SECRET = "M@_cl3_S3cr3t_QU1_3st_Tr3s_S3cur1s33";


// =======================
// CREATE AGENT
// =======================
exports.createAgent = async (req, res) => {
    try {
        const { matricule, nom, prenom, email, num_telephone, mot_de_passe } = req.body;

        const sql = `
            INSERT INTO agent (MATRICULE, NOM, PRENOM, EMAIL, NUM_TELEPHONE, MOT_DE_PASSE)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            matricule,
            nom,
            prenom,
            email,
            num_telephone,
            mot_de_passe
        ]);

        res.status(201).json({
            message: "Agent créé avec succès",
            id: result.insertId
        });

    } catch (err) {
        res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
};


// =======================
// GET ALL AGENTS
// =======================
exports.getAllAgents = async (req, res) => {
    try {
        const sql = "SELECT * FROM agent";
        const [rows] = await db.query(sql);

        res.status(200).json({
            message: "Liste des agents",
            data: rows
        });

    } catch (err) {
        res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
};


// =======================
// UPDATE AGENT
// =======================
exports.updateAgent = async (req, res) => {
    try {
        const { matricule } = req.params;
        const { nom, prenom, num_telephone, email, mot_de_passe } = req.body;

        const sql = `
            UPDATE agent
            SET NOM = ?, PRENOM = ?, NUM_TELEPHONE = ?, EMAIL = ?, MOT_DE_PASSE = ?
            WHERE MATRICULE = ?
        `;

        const [result] = await db.query(sql, [
            nom,
            prenom,
            num_telephone,
            email,
            mot_de_passe,
            matricule
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Aucun agent trouvé avec cette matricule"
            });
        }

        res.status(200).json({
            message: "Agent modifié avec succès"
        });

    } catch (err) {
        res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
};


// =======================
// DELETE AGENT
// =======================
exports.deleteAgent = (req, res) => {
    // 1. On récupère l'id qui vient de la route (/:id)
    const idAgent = req.params.id; 

    // 2. On écrit la requête SQL en ciblant la bonne colonne de ta table MySQL
    const query = 'DELETE FROM agent WHERE IDAgent = ?';

    db.query(query, [idAgent], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Impossible de supprimer l'agent" });
        }
        res.status(200).json({ message: 'Agent supprimé avec succès !' });
    });

};



// =======================
// LOGIN + JWT TOKEN
// =======================
exports.loginAgent = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        const sql = `
            SELECT * FROM agent
            WHERE EMAIL = ? AND MOT_DE_PASSE = ?
        `;

        const [rows] = await db.query(sql, [email, mot_de_passe]);

        // Vérifie si utilisateur existe
        if (rows.length === 0) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }

        // 🚀 CORRECTION : Utilisation de la variable réelle JWT_SECRET (sans guillemets)
        const token = jwt.sign(
            {
                matricule: rows[0].MATRICULE,
                email: rows[0].EMAIL
            },
            JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        // Réponse finale
        res.status(200).json({
            message: "Connexion réussie",
            token
        });

    } catch (err) {
        res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
};