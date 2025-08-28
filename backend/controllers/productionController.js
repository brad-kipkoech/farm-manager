import pool from "../config/db.js";

/**
 * 📌 Get all production records for this farm
 */
export const getProduction = async (req, res) => {
  try {
    const farmId = req.user.farm_id;

    const result = await pool.query(`
      SELECT 
        p.id,
        p.product,
        p.quantity,
        p.unit,
        p.date,
        p.notes,
        p.user_id,
        pr.price,
        (p.quantity * pr.price) AS income
      FROM production p
      LEFT JOIN prices pr 
        ON pr.product = p.product AND pr.farm_id = p.farm_id
      WHERE p.farm_id = $1
      ORDER BY p.date DESC
    `, [farmId]);

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching production:", error);
    res.status(500).json({ message: "Server error fetching production" });
  }
};


/**
 * 📌 Add new production record
 */
export const addProduction = async (req, res) => {
  try {
    const { product, quantity, unit, date, notes } = req.body;
    const farmId = req.user.farm_id;
    const userId = req.user.id;

    const result = await pool.query(
      `INSERT INTO production (product, quantity, unit, date, notes, user_id, farm_id) 
       VALUES ($1, $2, $3, $4::date, $5, $6, $7) 
       RETURNING *`,
      [product, quantity, unit, date || new Date().toISOString().slice(0, 10), notes, userId, farmId]
    );

    const priceRes = await pool.query(
      `SELECT price FROM prices WHERE product = $1 AND farm_id = $2`,
      [product, farmId]
    );
    const price = priceRes.rows[0]?.price || 0;

    const newRecord = {
      ...result.rows[0],
      price,
      income: result.rows[0].quantity * price,
    };

    res.status(201).json(newRecord);
  } catch (error) {
    console.error("❌ Error adding production:", error);
    res.status(500).json({ message: "Server error adding production" });
  }
};


/**
 * 📌 Monthly income summary (per farm)
 */
export const getMonthlyIncome = async (req, res) => {
  try {
    const farmId = req.user.farm_id;

    const result = await pool.query(`
      SELECT 
        TO_CHAR(p.date, 'YYYY-MM') AS month,
        p.product,
        SUM(p.quantity * pr.price) AS income
      FROM production p
      JOIN prices pr 
        ON pr.product = p.product AND pr.farm_id = p.farm_id
      WHERE p.farm_id = $1
      GROUP BY month, p.product
      ORDER BY month ASC
    `, [farmId]);

    const rows = result.rows;
    const monthlyData = {};

    rows.forEach(({ month, product, income }) => {
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          milk: 0,
          tea: 0,
          honey: 0,
          macadamia: 0,
          apples: 0,
          total: 0,
        };
      }
      monthlyData[month][product.toLowerCase()] = Number(income);
      monthlyData[month].total += Number(income);
    });

    res.json(Object.values(monthlyData));
  } catch (err) {
    console.error("❌ Error fetching monthly income:", err);
    res.status(500).json({ message: "Server error fetching monthly income" });
  }
};


/**
 * 📌 Current month income (total for farm)
 */
export const getCurrentMonthIncome = async (req, res) => {
  try {
    const farmId = req.user.farm_id;

    const result = await pool.query(`
      SELECT COALESCE(SUM(p.quantity * pr.price), 0) AS total
      FROM production p
      JOIN prices pr 
        ON pr.product = p.product AND pr.farm_id = p.farm_id
      WHERE p.farm_id = $1
      AND DATE_TRUNC('month', p.date) = DATE_TRUNC('month', CURRENT_DATE)
    `, [farmId]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching current month income:", err);
    res.status(500).json({ message: "Server error fetching current month income" });
  }
};


/**
 * 📌 Income by product grouped monthly
 */
export const getIncomeByProductMonthly = async (req, res) => {
  try {
    const farmId = req.user.farm_id;

    const result = await pool.query(`
      SELECT 
        TO_CHAR(p.date, 'YYYY-MM') AS month,
        p.product,
        SUM(p.quantity * pr.price) AS total
      FROM production p
      JOIN prices pr 
        ON pr.product = p.product AND pr.farm_id = p.farm_id
      WHERE p.farm_id = $1
      GROUP BY month, p.product
      ORDER BY month ASC, p.product ASC
    `, [farmId]);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching income by product monthly:", err);
    res.status(500).json({ message: "Server error fetching income by product monthly" });
  }
};


/**
 * 📌 Today's income (total for farm)
 */
export const getTodayIncome = async (req, res) => {
  try {
    const farmId = req.user.farm_id;

    const result = await pool.query(`
      SELECT COALESCE(SUM(p.quantity * pr.price), 0) AS total
      FROM production p
      JOIN prices pr 
        ON pr.product = p.product AND pr.farm_id = p.farm_id
      WHERE p.farm_id = $1
      AND DATE(p.date) = CURRENT_DATE
    `, [farmId]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching today's income:", err);
    res.status(500).json({ message: "Server error fetching today's income" });
  }
};


/**
 * 📌 Count distinct products recorded today (per farm)
 */
export const getTodayProductsCount = async (req, res) => {
  try {
    const farmId = req.user.farm_id;

    const result = await pool.query(`
      SELECT COUNT(DISTINCT product) AS count
      FROM production
      WHERE farm_id = $1
      AND date = CURRENT_DATE
    `, [farmId]);

    res.json(result.rows[0]); // { count: N }
  } catch (err) {
    console.error("❌ Error fetching today's product count:", err);
    res.status(500).json({ message: "Server error fetching today's product count" });
  }
};
