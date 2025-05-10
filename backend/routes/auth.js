const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

// Inscription
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }
  try {
    // Vérifier que l'email n'existe pas
    const [existing] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }
    // Hasher le mot de passe
    const hash = await bcrypt.hash(password, 10);
    // Insérer en base
    await db
      .promise()
      .query("INSERT INTO users (email, password) VALUES (?, ?)", [
        email,
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
      .query("SELECT id, password FROM users WHERE email = ?", [email]);
    if (!rows.length) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }
    // génere un token JWT ou session
    res.json({ message: "Connexion réussie." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
