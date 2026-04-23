require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

// Routes
const analyzeRoutes = require("./src/routes/analyze");
const patientsRoutes = require("./src/routes/patients");
const alertsRoutes = require("./src/routes/alerts");
const historyRoutes = require("./src/routes/history");
const callRoutes = require("./src/routes/call");
const authRoutes = require("./src/routes/auth");

// Middleware
const errorHandler = require("./src/middleware/errorHandler");

// ─── App Setup ────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Rate Limiter (optional, protects AI endpoint) ────────────────────────────
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,                  // 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please slow down.",
  },
});

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Apply rate limit to AI endpoint
app.use("/api/analyze", limiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "✅ Smart Triage Backend is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      analyze: "POST /api/analyze",
      patients: "GET  /api/patients",
      alerts: "POST|GET /api/alerts",
      history: "GET  /api/history",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/analyze", analyzeRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/analyze-call", callRoutes);
app.use("/api/auth", authRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
  });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║   🚑  Smart Triage Backend — v1.0.0                 ║
║   🟢  Server running on http://localhost:${PORT}       ║
║   🤖  Gemini AI: ${process.env.GEMINI_API_KEY ? "✅ Configured" : "⚠️  Not configured (set GEMINI_API_KEY in .env)"}  ║
╚══════════════════════════════════════════════════════╝

API Endpoints:
  POST   http://localhost:${PORT}/api/analyze
  GET    http://localhost:${PORT}/api/patients
  POST   http://localhost:${PORT}/api/alerts
  GET    http://localhost:${PORT}/api/alerts
  GET    http://localhost:${PORT}/api/history
  GET    http://localhost:${PORT}/api/health
  `);
});

module.exports = app;
