const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, pseudo } = req.body;
    const [exists] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) {
      return res.status(400).json({ error: "Email déjà utilisé." });
    }
    const hash = await bcrypt.hash(password, 10);
    await db
      .promise()
      .query(
        "INSERT INTO users (email, pseudo, password, role) VALUES (?, ?, ?, 'user')",
        [email, pseudo, hash]
      );
    res.status(201).json({ message: "Inscription réussie." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db
      .promise()
      .query("SELECT id, password, pseudo, role FROM users WHERE email = ?", [
        email,
      ]);
    if (!rows.length) {
      return res.status(400).json({ error: "Email introuvable." });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Mot de passe incorrect." });
    }
    const token = jwt.sign(
      { id: user.id, pseudo: user.pseudo, role: user.role },
      process.env.JWT_SECRET.replace(/"/g, ""),
      { expiresIn: "2h" }
    );
    res.json({
      message: "Connexion réussie.",
      token,
      user: { id: user.id, pseudo: user.pseudo, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;

// kebabcase: nom-prenom;
// snakecase: nom_prenom;
// camelcase: nomPrenom;
// pascalcase : NomPrenom;
