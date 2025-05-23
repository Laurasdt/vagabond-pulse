require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit"); //limite le nombre de tentatives de connexion pour mitiger le bruteforce
const hsts = require("hsts"); //force le navigateur à ne communiquer qu’en HTTPS et protège contre les attaques de downgrade
const path = require("path");

const authRouter = require("./routes/auth");
const eventRoutes = require("./routes/events");
const memoryRoutes = require("./routes/memories");

const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
app.use(
  cors({
    origin(orig, cb) {
      if (!orig || allowedOrigins.includes(orig)) return cb(null, true);
      cb(new Error("CORS non autorisé"));
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(
  hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

// limite le nombre de requêtes : 10 requêtes en 15 minutes par IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Trop de tentatives, réessaie plus tard.",
});
app.use("/api/auth", authLimiter);

app.use(express.json());

// routes
app.use("/api/auth", authRouter);
app.use("/api/events", eventRoutes);
app.use("/api/memories", memoryRoutes);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    index: false, // désactive listing des fichiers
  })
);

if (process.env.NODE_ENV === "production") {
  app.enable("trust proxy");
  app.use((req, res, next) => {
    if (req.secure) return next();
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
