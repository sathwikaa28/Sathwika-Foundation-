const pool = require("../config/db");

// =====================================================
// CREATE CONTACT
// =====================================================

const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO contacts
      (name, email, phone, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at, name, email, phone, message, is_read
      `,
      [
        name,
        email,
        phone || null,
        message,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully.",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Create contact error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit contact message",
    });
  }
};


// =====================================================
// GET ALL CONTACTS
// =====================================================

const getContacts = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        created_at,
        name,
        email,
        phone,
        message,
        is_read
      FROM contacts
      ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error("Get contacts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};


// =====================================================
// MARK CONTACT AS READ
// =====================================================

const markContactAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE contacts
      SET is_read = TRUE
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Contact marked as read",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Mark read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update contact",
    });
  }
};


// =====================================================
// DELETE CONTACT
// =====================================================

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM contacts
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });

  } catch (error) {
    console.error("Delete contact error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
    });
  }
};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  createContact,
  getContacts,
  markContactAsRead,
  deleteContact,
};