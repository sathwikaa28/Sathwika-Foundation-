const express = require("express");

const router = express.Router();

const pool = require("../config/db");
const adminAuth = require("../middleware/adminAuth");

// =====================================================
// SUBMIT HELP REQUEST
// POST /api/help
// PUBLIC
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      message,
    } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Phone number and message are required.",
      });
    }

    const cleanName =
      typeof name === "string"
        ? name.trim()
        : "";

    const cleanPhone =
      typeof phone === "string"
        ? phone.trim()
        : "";

    const cleanMessage =
      typeof message === "string"
        ? message.trim()
        : "";

    if (!cleanPhone || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "Please provide the required information.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO help_requests
      (
        name,
        phone,
        message,
        status
      )
      VALUES
      ($1, $2, $3, $4)
      RETURNING
        id,
        name,
        phone,
        message,
        status,
        created_at
      `,
      [
        cleanName || null,
        cleanPhone,
        cleanMessage,
        "new",
      ]
    );

    return res.status(201).json({
      success: true,
      message:
        "Your help request has been received successfully.",
      request: result.rows[0],
    });

  } catch (error) {

    console.error(
      "Help request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit your request right now. Please try again.",
    });
  }
});


// =====================================================
// GET HELP REQUESTS
// GET /api/help
// ADMIN ONLY
// =====================================================

router.get("/", adminAuth, async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        phone,
        message,
        status,
        created_at
      FROM help_requests
      ORDER BY created_at DESC
      `
    );

    return res.json({
      success: true,
      count: result.rows.length,
      requests: result.rows,
    });

  } catch (error) {

    console.error(
      "Get help requests error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch help requests.",
    });
  }
});


module.exports = router;
