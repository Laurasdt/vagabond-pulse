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
      message: "Événement créé avec succès",
      eventId: result.insertId,
    });
  });
});

module.exports = router; // 👈 très important !
