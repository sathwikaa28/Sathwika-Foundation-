const pool = require("../config/db");

/* =====================================================
   WEBSITE STATISTICS
===================================================== */

// GET /api/content/stats
const getStats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM site_stats WHERE id = 1`
    );

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Get stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load statistics",
    });
  }
};


// PATCH /api/content/stats
const updateStats = async (req, res) => {
  try {
    const {
      people_helped,
      programs_completed,
      volunteers,
      communities_reached,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE site_stats
      SET
        people_helped = $1,
        programs_completed = $2,
        volunteers = $3,
        communities_reached = $4,
        updated_at = NOW()
      WHERE id = 1
      RETURNING *
      `,
      [
        Number(people_helped) || 0,
        Number(programs_completed) || 0,
        Number(volunteers) || 0,
        Number(communities_reached) || 0,
      ]
    );

    res.json({
      success: true,
      message: "Statistics updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Update stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update statistics",
    });
  }
};


/* =====================================================
   PROGRAMS
===================================================== */

// GET /api/content/programs
const getPrograms = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM programs
      ORDER BY program_date DESC NULLS LAST, created_at DESC
      `
    );

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error("Get programs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load programs",
    });
  }
};


// POST /api/content/programs
const createProgram = async (req, res) => {
  try {
    const {
      title,
      program_date,
      location,
      description,
      people_helped,
      image_url,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Program title is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO programs (
        title,
        program_date,
        location,
        description,
        people_helped,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        title.trim(),
        program_date || null,
        location || null,
        description || null,
        Number(people_helped) || 0,
        image_url || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Program created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Create program error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create program",
    });
  }
};


// PATCH /api/content/programs/:id
const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      program_date,
      location,
      description,
      people_helped,
      image_url,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Program title is required",
      });
    }

    const result = await pool.query(
      `
      UPDATE programs
      SET
        title = $1,
        program_date = $2,
        location = $3,
        description = $4,
        people_helped = $5,
        image_url = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
      `,
      [
        title.trim(),
        program_date || null,
        location || null,
        description || null,
        Number(people_helped) || 0,
        image_url || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    res.json({
      success: true,
      message: "Program updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Update program error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update program",
    });
  }
};


// DELETE /api/content/programs/:id
const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM programs
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    res.json({
      success: true,
      message: "Program deleted successfully",
    });

  } catch (error) {
    console.error("Delete program error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete program",
    });
  }
};


module.exports = {
  getStats,
  updateStats,
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
};