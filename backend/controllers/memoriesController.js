const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const db = require("../config/db");
const router = express.Router();

//  Prépare le dossier uploads/memories
const uploadsBase = path.join(__dirname, "..", "uploads");
const memoriesDir = path.join(uploadsBase, "memories");
if (!fs.existsSync(memoriesDir)) {
  fs.mkdirSync(memoriesDir, { recursive: true });
  console.log("Création du dossier :", memoriesDir);
}

// Promisify pour async/await
const query = util.promisify(db.query).bind(db);

//  Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, memoriesDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `mem_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// POST /api/memories
router.post("/", upload.single("file"), async (req, res) => {
  console.log("==== POST /api/memories reçu ====");
  console.log("req.file =", req.file);
  console.log("req.body =", req.body);

  try {
    const { userId, description } = req.body;

    // vérifie userId
    if (!userId || userId === "undefined") {
      return res
        .status(400)
        .json({ error: "Identifiant utilisateur manquant" });
    }

    // vérifie le fichier
    if (!req.file) {
      return res.status(400).json({ error: "Pas de fichier reçu" });
    }

    const filename = req.file.filename;
    const photoUrl = `/uploads/memories/${filename}`;

    // insère en BDD user_id, photo_url, description
    const sql =
      "INSERT INTO memories (user_id, photo_url, description) VALUES (?,?,?)";
    const result = await query(sql, [userId, photoUrl, description]);

    // renvoie l'objet inséré
    return res.status(201).json({
      id: result.insertId,
      userId: parseInt(userId, 10),
      photoUrl,
      description,
      // createdAt sera ajouté côté front si besoin du timestamp
    });
  } catch (err) {
    console.error("Erreur interne POST /api/memories :", err);
    return res.status(500).json({ error: "Erreur serveur interne" });
  }
});

// **GET /api/memories** → toutes les photos de tous les users
router.get("/", async (req, res) => {
  console.log("==== GET /api/memories reçu ====");
  try {
    const sql = `
      SELECT
        m.id,
        m.photo_url   AS photoUrl,
        m.description,
        m.created_at  AS createdAt,
        u.pseudo      AS owner
      FROM memories m
      JOIN users u ON u.id = m.user_id
      ORDER BY m.created_at DESC
    `;
    const rows = await query(sql);
    return res.json(rows);
  } catch (err) {
    console.error("Erreur GET /api/memories :", err);
    return res
      .status(500)
      .json({ error: "Erreur serveur lors du fetch global" });
  }
});

// GET /api/memories/:userId
// Récupère toutes les photos d'un utilisateur
router.get("/:userId", async (req, res) => {
  console.log("==== GET /api/memories/:userId reçu ====");
  console.log("req.params.userId =", req.params.userId);

  try {
    const { userId } = req.params;

    if (!userId || userId === "undefined") {
      return res
        .status(400)
        .json({ error: "Identifiant utilisateur manquant" });
    }

    // Récupère photo_url AS photoUrl, description, created_at
    const sql = `
      SELECT 
        id,
        photo_url   AS photoUrl,
        description,
        created_at  AS createdAt
      FROM memories
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const rows = await query(sql, [userId]);
    return res.json(rows);
  } catch (err) {
    console.error("Erreur interne GET /api/memories/:userId :", err);
    return res.status(500).json({ error: "Erreur serveur lors du fetch" });
  }
});

module.exports = router;
