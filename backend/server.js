require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const hsts = require("hsts");
const rateLimit = require("express-rate-limit");

const authRouter = require("./routes/auth.route");
const eventRoutes = require("./routes/events.route");
const memoryRoutes = require("./routes/memories.route");
const userRoutes = require("./routes/user.route");

const sequelize = require("./config/db");

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path}`);
  console.log(`   Origin: ${req.get("Origin") || "undefined"}`);
  console.log(`   Host: ${req.get("Host")}`);
  console.log(`   User-Agent: ${req.get("User-Agent")?.substring(0, 50)}...`);
  console.log("---");
  next();
});

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  hsts({
    maxAge: 31_536_000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  })
);

// ─── BODY PARSER ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Trop de tentatives, réessaie plus tard." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

app.get("/api/test", (req, res) => {
  res.json({
    message: "CORS is working!",
    origin: req.get("Origin"),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRouter);
app.use("/api/events", eventRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/users", userRoutes);

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads"), {
    index: false,
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

const buildDir = path.join(__dirname, "../client/build");
if (fs.existsSync(buildDir)) {
  app.use(express.static(buildDir, { index: false }));
  app.get("*", (req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api/")) {
      return res.sendFile(path.join(buildDir, "index.html"));
    }
    next();
  });
}

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error details:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS policy violation" });
  }

  if (err.status === 429) {
    return res
      .status(429)
      .json({ error: "Trop de tentatives, réessaie plus tard." });
  }

  res.status(500).json({ error: "Internal server error" });
});

sequelize
  .sync()
  .then(() => {
    console.log("✅ Database synced & connection OK");
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB sync error:", err);
  });
