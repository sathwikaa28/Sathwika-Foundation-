const express = require("express");

const {
  createContact,
  getContacts,
  markContactAsRead,
  deleteContact,
} = require("../controllers/contactController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// ==========================================
// PUBLIC — Website Contact / Help Form
// ==========================================

router.post("/", createContact);

// ==========================================
// PROTECTED — Admin Only
// ==========================================

router.get("/", adminAuth, getContacts);

router.patch(
  "/:id/read",
  adminAuth,
  markContactAsRead
);

router.delete(
  "/:id",
  adminAuth,
  deleteContact
);

module.exports = router;