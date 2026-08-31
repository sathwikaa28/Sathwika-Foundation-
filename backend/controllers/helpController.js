const pool = require("../config/db");

// CREATE HELP REQUEST
const createHelpRequest = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Phone number and message are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO help_requests
      (name, phone, message, is_read)
      VALUES ($1, $2, $3, false)
      RETURNING *
      `,
      [
        name || null,
        phone,
        message,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Help request submitted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create help request error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit help request",
    });
  }
};


// GET ALL HELP REQUESTS
const getHelpRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM help_requests
      ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get help requests error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch help requests",
    });
  }
};


// MARK AS READ
const markHelpRequestAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE help_requests
      SET is_read = true
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    res.json({
      success: true,
      message: "Help request marked as read",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Mark help request error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark help request as read",
    });
  }
};


// DELETE
const deleteHelpRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM help_requests
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    res.json({
      success: true,
      message: "Help request deleted successfully",
    });
  } catch (error) {
    console.error("Delete help request error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete help request",
    });
  }
};


module.exports = {
  createHelpRequest,
  getHelpRequests,
  markHelpRequestAsRead,
  deleteHelpRequest,
};