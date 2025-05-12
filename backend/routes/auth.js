/* === back-end/routes/auth.js === */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

// Inscription
router.post("/register", async (req, res) => {
  const { email, password, pseudo } = req.body;
  if (!email || !password || !pseudo) {
    return res
      .status(400)
      .json({ message: "Email, pseudo et mot de passe requis." });
  }
  try {
    // Vérifier que l'email n'existe pas
    const [existingEmail] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email]);
    if (existingEmail.length) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }
    // Vérifier que le pseudo n'existe pas
    const [existingPseudo] = await db
      .promise()
      .query("SELECT id FROM users WHERE pseudo = ?", [pseudo]);
    if (existingPseudo.length) {
      return res.status(409).json({ message: "Ce pseudo est déjà pris." });
    }
    // Hasher le mot de passe
    const hash = await bcrypt.hash(password, 10);
    // Insérer en base
    await db
      .promise()
      .query("INSERT INTO users (email, pseudo, password) VALUES (?, ?, ?)", [
        email,
        pseudo,
        hash,
      ]);
    res.status(201).json({ message: "Inscription réussie." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }
  try {
    const [rows] = await db
      .promise()
      .query("SELECT id, password, pseudo FROM users WHERE email = ?", [email]);
    if (!rows.length) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }
    // génère un token JWT ou session, inclut le pseudo si besoin
    res.json({
      message: "Connexion réussie.",
      user: { id: user.id, pseudo: user.pseudo },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
