import pool from "../config/db.js";

// Get all current prices
export const getAllPrices = async () => {
  const result = await pool.query(
    `SELECT * FROM prices ORDER BY product`
  );
  return result.rows;
};

// Update price for a product
export const updatePrice = async (product, price) => {
  const result = await pool.query(
    `UPDATE prices SET price = $1 WHERE product = $2 RETURNING *`,
    [price, product]
  );
  return result.rows[0];
};

// Add new product price (if needed)
export const addPrice = async ({ product, price, unit }) => {
  const result = await pool.query(
    `INSERT INTO prices (product, price, unit) 
     VALUES ($1, $2, $3) RETURNING *`,
    [product, price, unit]
  );
  return result.rows[0];
};
