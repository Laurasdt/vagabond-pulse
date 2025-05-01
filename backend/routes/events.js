const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { title, date, location, description } = req.body;

  const sql =
    "INSERT INTO events (title, date, location, description) VALUES (?, ?, ?, ?)";

  db.query(sql, [title, date, location, description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ err });
    }

    res.status(201).json({
      message: "l'évènement a bien été crée",
      eventId: result.insertId,
    });
  });
});

router.get("/", (req, res) => {
  const sql = "SELECT * FROM events";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des événements :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    res.json(result); // renvoie les événements en réponse
  });
});

// récup un événement spécifique
router.get("/:eventId", (req, res) => {
  const { eventId } = req.params;

  const sql = "SELECT * FROM events WHERE id = ?";

  db.query(sql, [eventId], (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'événement :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Événement non trouvé" });
    }

    res.json(result[0]); // renvoie l'événement
  });
});

// supp un évent
router.delete("/:eventId", (req, res) => {
  const { eventId } = req.params;

  const sql = "DELETE FROM events WHERE id = ?";

  db.query(sql, [eventId], (err, result) => {
    if (err) {
      console.error("Une erreur est survenue :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Événement non trouvé." });
    }

    res.status(200).json({ message: "Événement supprimé avec succès !" });
  });
});

module.exports = router;
