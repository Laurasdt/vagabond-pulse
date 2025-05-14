require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRouter = require("./routes/auth");
const eventRoutes = require("./routes/events");
const memoryRoutes = require("./routes/memories"); // Assure-toi que ce fichier existe

const app = express();

app.use(cors());
app.use(express.json());

// Auth
app.use("/api/auth", authRouter);

// Events
app.use("/api/events", eventRoutes);

// Memories  ← DÉCOMMENTÉ pour exposer /api/memories
app.use("/api/memories", memoryRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
);
