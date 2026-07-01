// On importe l'accès à la base de données configurée précédemment
const db = require("../config/connect");

// Fonction asynchrone (async) car la requête à la base de données prend du temps (opération I/O bloquante)
exports.createAgent = async(req, res) => {

    try {

        // Destructuring : on extrait proprement les variables du corps de la requête (req.body)
        // C'est l'équivalent de faire "const matricule = req.body.matricule;" pour chaque variable
       const {matricule, nom, prenom, email, num_telephone, mot_de_passe} = req.body;

       // Requête SQL d'insertion. Sécurité importante : on utilise des paramètres préparés (?)
       // pour éviter les failles par Injection SQL. Les vraies valeurs remplaceront les "?" après coup.
       const sql = `
           INSERT INTO agent (MATRICULE, NOM, PRENOM, EMAIL, NUM_TELEPHONE, MOT_DE_PASSE)
           VALUES (?, ?, ?, ?, ?, ?)
      `;
        // On attend (await) l'exécution de la requête. 
        // Le module mysql2 renvoie un tableau : le premier élément contient les données utiles.
        // On utilise la destructuration de tableau ([result]) pour récupérer directement cet objet de résultat.
       const[result] = await db.query(sql, [matricule, nom, prenom, email, num_telephone, mot_de_passe]);
       
        // Si tout s'est bien passé, on renvoie un code de succès 201 (Created) 
        // On retourne un objet JSON contenant un message et l'ID généré automatiquement par MySQL (insertId)
       res.status(201).json({
            message: "Agent créé avec succés",
            id:result.insertId
        });
    } catch (err) {
        // En cas d'échec (ex: doublon sur le matricule, erreur de syntaxe SQL), le bloc catch intercepte l'erreur
        // On log l'erreur exacte dans la console du serveur pour pouvoir débugger facilement
    console.log(err);

    // On renvoie un code 500 (Internal Server Error) pour avertir le client (frontend) que le traitement a échoué côté serveur
    res.status(500).json({
        message: "Erreur serveur",
        error: err.message
    });
}
}



//lister tous les agents

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



//modifier les agents 
exports.updateAgent = async (req, res) => {

   
        const { matricule } = req.params;

        const {
            nom,
            prenom,
            num_telephone,
            email,
            mot_de_passe
        } = req.body;

 try {

        const sql = `
            UPDATE agent
            SET  NOM = ?, PRENOM = ?, NUM_TELEPHONE = ?, EMAIL = ?, MOT_DE_PASSE = ?
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

        if (result.affectedRows === 0)
             {
    return res.status(404).json({
        message: "Aucun agent trouvé avec cette matricule"
    });
}

        res.status(200).json({
            message: "Agent modifié avec succès",
            changes: result.affectedRows
        });

        
    } catch (err) {
        res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
};



//supprimer un agent
exports.deleteAgent = async (req, res) => {
    try{

    const { matricule } = req.params;

        const sql = `
            DELETE FROM agent
            WHERE MATRICULE = ?
        `;

        const [result] = await db.query(sql, [matricule]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Aucun agent trouvé avec ce matricule"
            });
        }

        res.status(200).json({
            message: "Agent supprimé avec succès"
        });

    } catch (err) {
        res.status(500).json({
            message: "Erreur serveur",
            error: err.message
        });
    }
};