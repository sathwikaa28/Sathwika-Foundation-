const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const contactRoutes = require("./routes/contactRoutes");
const helpRoutes = require("./routes/helpRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bloodRoutes = require("./routes/bloodRoutes");
const contentRoutes = require("./routes/contentRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// =====================================================
// ROUTES
// =====================================================

// Contact API
app.use("/api/contact", contactRoutes);

// Help Request API
app.use("/api/help", helpRoutes);

// Admin API
app.use("/api/admin", adminRoutes);

// Blood Donor API
app.use("/api/blood", bloodRoutes);

// Website Content API
app.use("/api/content", contentRoutes);

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sathwika Foundation Backend is running 🚀",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "Sathwika Foundation API",
  });
});

// =====================================================
// DATABASE CONNECTION TEST
// =====================================================

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Database connected successfully 🚀",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});