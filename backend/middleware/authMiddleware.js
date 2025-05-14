const jwt = require("jsonwebtoken");

// Middleware pour vérifier le token JWT
// Vérifie si le token est présent dans l'en-tête Authorization
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Vérifie si l'en-tête Authorization est présent
  if (!authHeader) {
    return res.status(401).json({ error: "Token manquant." });
  }
  // Vérifie si le token commence par "Bearer "
  const token = authHeader.split(" ")[1];
  try {
    // Vérifie le token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET.replace(/"/g, ""));
    req.user = decoded; // { id, pseudo, role }
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide." });
  }
};
