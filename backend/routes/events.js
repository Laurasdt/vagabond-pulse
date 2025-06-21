const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware"); // appel du middleware d'authentification

// GET all events (public)
router.get("/", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  const listSql = `
    SELECT
      e.id,
      e.user_id    AS userId,
      u.pseudo,
      e.title,
      e.date,
      e.location,
      e.description
    FROM events e
    JOIN users u ON e.user_id = u.id
    ORDER BY e.date DESC
    LIMIT ? OFFSET ?
  `;
  const countSql = "SELECT COUNT(*) AS count FROM events";

  db.query(listSql, [limit, offset], (err, rows) => {
    if (err) {
      console.error("Erreur récupération events :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    db.query(countSql, (err2, countRes) => {
      if (err2) {
        console.error("Erreur calcul total :", err2);
        return res.status(500).json({ error: "Erreur serveur" });
      }
      const total = countRes[0].count;
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

// GET one event (public)
router.get("/:eventId", (req, res) => {
  db.query(
    "SELECT id, user_id AS userId, title, date, location, description FROM events WHERE id = ?",
    [req.params.eventId],
    (err, rows) => {
      if (err) {
        console.error("Erreur récupération event :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
      if (!rows.length) {
        return res.status(404).json({ error: "Événement non trouvé." });
      }
      res.json(rows[0]);
    }
  );
});

// CREATE (auth required)
router.post("/", verifyToken, (req, res) => {
  const { title, date, location, description } = req.body;
  const userId = req.user.id;
  db.query(
    "INSERT INTO events (user_id, title, date, location, description) VALUES (?, ?, ?, ?, ?)",
    [userId, title, date, location, description],
    (err, result) => {
      if (err) {
        console.error("Erreur création event :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
      res.status(201).json({ id: result.insertId, message: "Événement créé." });
    }
  );
});

// UPDATE (auth required)
router.put("/:eventId", verifyToken, (req, res) => {
  const { title, date, location, description } = req.body;
  const { id: requesterId, role } = req.user;
  const eventId = req.params.eventId;

  let sql, params;
  if (role === "admin") {
    sql =
      "UPDATE events SET title=?, date=?, location=?, description=? WHERE id=?";
    params = [title, date, location, description, eventId];
  } else {
    sql =
      "UPDATE events SET title=?, date=?, location=?, description=? WHERE id=? AND user_id=?";
    params = [title, date, location, description, eventId, requesterId];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Erreur mise à jour event :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Accès refusé ou introuvable." });
    }
    res.json({ message: "Événement mis à jour." });
  });
});

// DELETE (auth required)
router.delete("/:eventId", verifyToken, (req, res) => {
  const { id: requesterId, role } = req.user;
  const eventId = req.params.eventId;

  let sql, params;
  if (role === "admin") {
    sql = "DELETE FROM events WHERE id=?";
    params = [eventId];
  } else {
    sql = "DELETE FROM events WHERE id=? AND user_id=?";
    params = [eventId, requesterId];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Erreur suppression event :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Accès refusé ou introuvable." });
    }
    res.json({ message: "Événement supprimé avec succès !" });
  });
});

module.exports = router;
