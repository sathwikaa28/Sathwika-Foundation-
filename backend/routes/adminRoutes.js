const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// =====================================================
// ADMIN LOGIN
// POST /api/admin/login
// =====================================================

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    // -----------------------------------------------
    // Validate input
    // -----------------------------------------------

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // -----------------------------------------------
    // Check environment configuration
    // -----------------------------------------------

    if (
      !process.env.ADMIN_USERNAME ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.JWT_SECRET
    ) {
      console.error(
        "Admin authentication environment variables are missing."
      );

      return res.status(500).json({
        success: false,
        message: "Admin authentication is not configured.",
      });
    }

    // -----------------------------------------------
    // Verify username
    // -----------------------------------------------

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // -----------------------------------------------
    // Verify password
    // -----------------------------------------------

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // -----------------------------------------------
    // Create JWT token
    // -----------------------------------------------

    const token = jwt.sign(
      {
        username: process.env.ADMIN_USERNAME,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // -----------------------------------------------
    // Login successful
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        username: process.env.ADMIN_USERNAME,
        role: "admin",
      },
    });

  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Admin login failed.",
    });
  }
});


// =====================================================
// VERIFY ADMIN TOKEN
// GET /api/admin/verify
// =====================================================

router.get("/verify", (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // -----------------------------------------------
    // Authorization header missing
    // -----------------------------------------------

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required.",
      });
    }

    // -----------------------------------------------
    // Expected format:
    // Authorization: Bearer TOKEN
    // -----------------------------------------------

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    const token = parts[1];

    // -----------------------------------------------
    // Verify token
    // -----------------------------------------------

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT authentication is not configured.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // -----------------------------------------------
    // Token valid
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Admin token is valid.",
      admin: {
        username: decoded.username,
        role: decoded.role,
      },
    });

  } catch (error) {

    // -----------------------------------------------
    // Token expired
    // -----------------------------------------------

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Admin session expired. Please login again.",
        code: "TOKEN_EXPIRED",
      });
    }

    // -----------------------------------------------
    // Invalid token
    // -----------------------------------------------

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin session. Please login again.",
        code: "INVALID_TOKEN",
      });
    }

    console.error("Admin token verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication verification failed.",
    });
  }
});


// =====================================================
// ADMIN LOGOUT
// POST /api/admin/logout
// =====================================================

router.post("/logout", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin logout successful.",
  });
});


module.exports = router;
