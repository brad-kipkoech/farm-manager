import pool from "../config/db.js";

// 📌 Get all prices
export const getPrices = async (req, res) => {
  try {
    if (!req.user?.farm_id) {
      return res.status(400).json({ error: "Missing farm_id in token" });
    }

    const farmId = req.user.farm_id;
    const result = await pool.query(
      "SELECT * FROM prices WHERE farm_id = $1 ORDER BY product ASC",
      [farmId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching prices:", error);
    res.status(500).json({ error: "Server error fetching prices" });
  }
};

// 📌 Update a product price
export const updatePrice = async (req, res) => {
  try {
    if (!req.user?.farm_id) {
      return res.status(400).json({ error: "Missing farm_id in token" });
    }

    const { product } = req.params;
    const { price } = req.body;
    const farmId = req.user.farm_id;

    if (!price || isNaN(price)) {
      return res.status(400).json({ error: "Valid price is required" });
    }

    const result = await pool.query(
      `UPDATE prices 
       SET price = $1, updated_at = NOW() 
       WHERE product = $2 AND farm_id = $3 
       RETURNING *`,
      [price, product, farmId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found for this farm" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating price:", error);
    res.status(500).json({ error: "Server error updating price" });
  }
};

// 📌 Get current month income
export const getCurrentMonthIncome = async (req, res) => {
  try {
    if (!req.user?.farm_id) {
      return res.status(400).json({ error: "Missing farm_id in token" });
    }

    const farmId = req.user.farm_id;
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('month', p.date)::DATE AS month,
        SUM(p.quantity * pr.price) AS income
      FROM production p
      JOIN prices pr 
        ON p.product = pr.product AND p.farm_id = pr.farm_id
      WHERE DATE_TRUNC('month', p.date) = DATE_TRUNC('month', CURRENT_DATE)
        AND p.farm_id = $1
      GROUP BY 1
    `, [farmId]);

    res.json(result.rows[0] || { month: new Date().toISOString().slice(0,7), income: 0 });
  } catch (error) {
    console.error("Error fetching current month income:", error);
    res.status(500).json({ error: "Server error" });
  }
};
