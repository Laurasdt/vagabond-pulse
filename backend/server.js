const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/events");
const app = express();

dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json()); // permet de lire JSON envoyés par React

// Routes
app.use("/api/events", eventRoutes);

// lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Le serveur backend est lancé sur : http://localhost:${PORT}`);
});
