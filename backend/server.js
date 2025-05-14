require("dotenv").config(); // lit fichier .env et charge variables d'environnement
const express = require("express");
const cors = require("cors"); // gère les CORS (Cross-Origin Resource Sharing)
const path = require("path"); // gère les chemins de fichiers

const authRouter = require("./routes/auth");
const eventRoutes = require("./routes/events");
const memoryRoutes = require("./routes/memories");

const app = express(); // crée une instance d'Express

app.use(cors());
app.use(express.json());

// Auth
app.use("/api/auth", authRouter);

// Events
app.use("/api/events", eventRoutes);

// Memories
app.use("/api/memories", memoryRoutes);

// Middleware pour gérer les fichiers statiques
// (images, vidéos, etc.) dans le dossier "uploads"
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Le serveur tourne sur http://localhost:${PORT}`)
);
