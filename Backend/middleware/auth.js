const jwt = require("jsonwebtoken");
const JWT_SECRET = "M@_cl3_S3cr3t_QU1_3st_Tr3s_S3cur1s33";

const auth = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({
            message: "Token manquant"
        });
    }

    const token = header.split(" ")[1];

    try {
        // 🚀 CORRECTION : Utilisation de la variable réelle JWT_SECRET (sans guillemets)
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Token invalide"
        });

    }
};

module.exports = auth;