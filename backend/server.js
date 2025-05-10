const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/events");
const authRouter = require("./routes/auth");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // parse JSON bodies from React

// Routes
app.use("/api", authRouter);
app.use("/api/events", eventRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Le serveur backend est lancé sur : http://localhost:${PORT}`);
});
