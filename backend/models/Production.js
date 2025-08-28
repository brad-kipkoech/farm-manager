import pool from "../config/db.js";

// Add new production record
export const addProduction = async ({ product, quantity, unit, date, notes, user_id }) => {
  const result = await pool.query(
    `INSERT INTO production (product, quantity, unit, date, notes, user_id) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [product, quantity, unit, date, notes, user_id]
  );
  return result.rows[0];
};

// Get all production logs (latest first)
export const getAllProduction = async () => {
  const result = await pool.query(
    `SELECT p.*, u.name as recorded_by 
     FROM production p
     JOIN users u ON p.user_id = u.id
     ORDER BY date DESC`
  );
  return result.rows;
};
