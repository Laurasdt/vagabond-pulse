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

// Pagination
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1; // page 1 par défaut
  const limit = parseInt(req.query.limit) || 10; // Limite par défaut 10 événements/page
  const offset = (page - 1) * limit;

  const sql = "SELECT * FROM events LIMIT ? OFFSET ?";

  db.query(sql, [limit, offset], (err, result) => {
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

// Mettre un event à jour
router.put("/:eventId", (req, res) => {
  const { eventId } = req.params; // récup ID event
  const { title, date, location, description } = req.body; // récup les données à mettre à jour

  const sql =
    "UPDATE events SET title = ?, date = ?, location = ?, description = ? WHERE id = ?";

  db.query(
    sql,
    [title, date, location, description, eventId],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de la mise à jour de l'événement :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Événement non trouvé" });
      }

      res.status(200).json({ message: "Événement mis à jour avec succès" });
    }
  );
});
