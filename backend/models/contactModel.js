const pool = require("../config/db");

const createContact = async ({ name, email, phone, message }) => {
  const result = await pool.query(
    `INSERT INTO public.contacts
      (name, email, phone, message)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at, name, email, phone, message`,
    [name, email, phone || null, message]
  );

  return result.rows[0];
};

module.exports = {
  createContact,
};