const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {
  getStats,
  updateStats,
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} = require("../controllers/contentController");


/* =====================================================
   PUBLIC ROUTES

   Website can read stats and programs.
===================================================== */

router.get("/stats", getStats);

router.get("/programs", getPrograms);


/* =====================================================
   ADMIN ROUTES

   Only logged-in admin can modify data.
===================================================== */

router.patch(
  "/stats",
  adminAuth,
  updateStats
);

router.post(
  "/programs",
  adminAuth,
  createProgram
);

router.patch(
  "/programs/:id",
  adminAuth,
  updateProgram
);

router.delete(
  "/programs/:id",
  adminAuth,
  deleteProgram
);


module.exports = router;