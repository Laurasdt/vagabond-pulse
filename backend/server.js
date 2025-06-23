require("dotenv").config();
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hsts = require("hsts"); // indique aux navigateurs de toujours utiliser HTTPS
const path = require("path");
const authRouter = require("./routes/auth");
const eventRoutes = require("./routes/events");
const memoryRoutes = require("./routes/memories");
const connexion = require("./config/db");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://vagabond-pulse-client-li5n4arre-lauras-projects-e43a85df.vercel.app",
  "https://vagabond-pulse-client.vercel.app",
];

app.use(
  cors({
    origin(orig, cb) {
      if (!orig || allowedOrigins.includes(orig)) return cb(null, true);
      cb(new Error("CORS non autorisé"));
    },
    credentials: true,
  })
);

// Sécurité des en-têtes HTTP, attaques XSS, etc.
app.use(helmet());
app.use(
  hsts({
    maxAge: 31536000, // pendant 1 an le navigateur doit utiliser HTTPS
    includeSubDomains: true,
    preload: true,
  })
);

// Limiteur d'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Trop de tentatives, réessaie plus tard.",
});
app.use("/api/auth", authLimiter);

app.use(express.json());

// routes API
app.use("/api/auth", authRouter);
app.use("/api/events", eventRoutes);
app.use("/api/memories", memoryRoutes);

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads"), { index: false })
);

const buildPath = path.join(__dirname, "../client/build");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath, { index: false }));
}

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.join(buildPath, "index.html"));
  }
  next();
});

if (process.env.NODE_ENV === "production") {
  app.enable("trust proxy");
  app.use((req, res, next) => {
    if (req.secure) return next();
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  });
}
connexion
  .sync()
  .then(() => {
    console.log("Connexion à la base de données réussie");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données :", err);
  });
