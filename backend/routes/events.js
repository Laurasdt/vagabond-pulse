const express = require("express");
const router = express.Router();
const db = require("../db");

// création nouvel event
router.post("/", (req, res) => {
  const { title, date: dateIso, location, description } = req.body;

  const jsDate = new Date(dateIso);
  if (isNaN(jsDate.getTime())) {
    return res.status(400).json({ error: "Date invalide" });
  }
  // formate la date
  const mysqlDateTime = jsDate.toISOString().slice(0, 19).replace("T", " ");

  const sql =
    "INSERT INTO events (title, date, location, description) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [title, mysqlDateTime, location, description],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
      res.status(201).json({
        message: "Événement créé avec succès",
        eventId: result.insertId,
      });
    }
  );
});

// Pagination
router.get("/", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  const listSql =
    "SELECT id, title, date, location, description FROM events ORDER BY date LIMIT ? OFFSET ?";
  const countSql = "SELECT COUNT(*) AS count FROM events";

  db.query(listSql, [limit, offset], (err, rows) => {
    if (err) {
      console.error("Erreur lors de la récupération des événements :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    db.query(countSql, (err2, countResult) => {
      if (err2) {
        console.error("Erreur lors du calcul total :", err2);
        return res.status(500).json({ error: "Erreur serveur" });
      }
      const total = countResult[0].count;
      res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        events: rows,
      });
    });
  });
});

// Récupération d'un event en particulier pour afficher les détails
router.get("/:eventId", (req, res) => {
  const { eventId } = req.params;
  const sql =
    "SELECT id, title, date, location, description FROM events WHERE id = ?";
  db.query(sql, [eventId], (err, rows) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'événement :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "Événement non trouvé" });
    }
    res.json(rows[0]);
  });
});

// Suppression
router.delete("/:eventId", (req, res) => {
  const { eventId } = req.params;
  const sql = "DELETE FROM events WHERE id = ?";
  db.query(sql, [eventId], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Événement non trouvé." });
    }
    res.status(200).json({ message: "Événement supprimé avec succès !" });
  });
});

// Mettre un événement à jour
router.put("/:eventId", (req, res) => {
  const { eventId } = req.params;
  const { title, date: dateIso, location, description } = req.body;

  const jsDate = new Date(dateIso);
  if (isNaN(jsDate.getTime())) {
    return res.status(400).json({ error: "Date invalide" });
  }
  const mysqlDateTime = jsDate.toISOString().slice(0, 19).replace("T", " ");

  const sql =
    "UPDATE events SET title = ?, date = ?, location = ?, description = ? WHERE id = ?";
  db.query(
    sql,
    [title, mysqlDateTime, location, description, eventId],
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

module.exports = router;
