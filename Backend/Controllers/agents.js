// controllers/agent.js
const pool = require('../Config/connect'); 

// Fonction pour créer un nouvel agent
exports.createAgent = async (req, res) => {
    try {
        // 1. Récupérer les données de Postman (en minuscules pour le code)
        const { matricule, nom, prenom, email, mot_de_passe, num_telephone, adresse } = req.body;

        // Validation (en minuscules)
        if (!matricule || !nom || !prenom || !email || !mot_de_passe || !num_telephone) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires." });
        }

        // 2. Requête SQL : Vos colonnes avec MAJUSCULES sont bien respectées ici !
        const sql = `INSERT INTO agent (Matricule, Nom, Prenom, Email, Mot_de_passe, Num_telephone, Adresse) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        // On associe les valeurs récupérées aux colonnes dans le bon ordre
        const values = [matricule, nom, prenom, email, mot_de_passe, num_telephone, adresse];

        // 3. Exécution
        const [result] = await pool.query(sql, values);

        // 4. Succès
        res.status(201).json({
            message: "Agent créé avec succès !",
            agentId: result.insertId 
        });

    } catch (error) {
        console.error("Erreur lors de la création de l'agent :", error.message);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Le matricule ou l'email est déjà utilisé." });
        }

        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

//Fonction pour récupérer la liste de tous les agents
exports.getAllAgents = async (req, res) =>{
    try{
        //Requete SQL pour selectionner tous les agents de la table agent
        const sql = 'SELECT Matricule, Nom, Prenom, Email, Adresse, Num_telephone FROM agent';

        //Execution de la requete
        const [rows] = await pool.query(sql);

        //On renvoie la liste des agents sous forme de tableau JSON
        return res.status(200).json(rows);
    
    } catch (error){
        console.error("Erreur lors de la récupération des agents:", error.message);
        return res.status(500).json({message: "Erreur interne du serveur lors de la récupération des agents. "});
    }
}

//Fonction pour modifier un agent existant
exports.updateAgent = async (req, res) =>{
    // 1. On récupère le matricule depuis l'URL
    const { matricule } = req.params;

    // 2. On recupere les nouvelles donnees depuis le body de Postman
    const {nom, prenom, email, adresse, num_telephone } = req.body;

    //Verification rapide que les champs principaux ne sont pas vides
    if (!nom || !prenom || !email || !num_telephone) {
        return res.status(400).json({message: "Le nom, le prénom, l'email et le numéro de telephone sont obligatoires. "});
    }


    try{
        // 3. Requete SQL pour mettre a jour l'agent correspondant au matricule
        const sql = `UPDATE Agent 
                     SET Nom = ?, Prenom = ?, Email = ?, Adresse = ?, Num_telephone = ? 
                     WHERE Matricule = ?`;

        const [result] = await pool.query(sql, [nom, prenom, email, adresse, num_telephone, matricule] );

        // Si la base de donnee n'a modifie aucune ligne, c'est que le matricule n'existe pas

        if (result.affectedRows === 0){
            return res.status(404).json({message: "Agent non trouvé."});
        }

        return res.status(200).json({message: "Agent modifié avec succès !"});
    } catch (error){
        console.error("Erreur lors de la modification de l'agent :", error.message);
        return res.status(500).json({ message: "Erreur interne du serveur lors de la modification." });
    }
    };

//Fonction pour supprimer un agent
exports.deleteAgent = async (req, res) => {
    //On recupere le matricule de l'agent a supprimer depuis l'URL

    const { matricule } = req.params;
    try {
        //Requete SQL pour supprimer l'agent correspondant au matricule
        const sql = `DELETE FROM Agent WHERE Matricule = ?`;

        const [result] = await pool.query(sql, [matricule]);

        //Si affectedrOWS vaut 0, cela signifie qu'aucun agent n'avait ce matricule
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Agent non trouvé. Impossible de le supprimer."});
        }

        //Si tout s'est bien passe
        return res.status(200).json({ message: "Agent supprimé avec succès !"});

     } catch (error) {
        console.error(" Erreur lors de la suppression de l'agent :", error.message);
        return res.status(500).json({ message: "Erreur interne du serveur lors de la suppression." });
    }   
    };
