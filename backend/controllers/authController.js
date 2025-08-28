import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

/**
 * 📌 Generate JWT Token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, farm_id: user.farm_id }, // ✅ include farm_id
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/**
 * 📌 Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔑 Login attempt:", { email, password });

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: "No account found with that email" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        farm_id: user.farm_id, // ✅ included here too
      },
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

/**
 * 📌 Signup
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, farm_id } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Fields name, email, password, and role are required",
      });
    }

    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let assignedFarmId = farm_id;

    // ✅ If role is owner, create a new farm and assign its ID
    if (role === "owner") {
      const newFarmResult = await pool.query(
        `INSERT INTO farms (name) VALUES ($1) RETURNING id`,
        [name]
      );
      assignedFarmId = newFarmResult.rows[0].id;
    }

    // ✅ If role is manager, ensure farm_id is provided
    if (role === "manager" && !farm_id) {
      return res.status(400).json({ message: "Farm ID is required for managers." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserResult = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, farm_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, username, email, role, farm_id`,
      [name, email, hashedPassword, role, assignedFarmId]
    );

    const newUser = newUserResult.rows[0];
    const token = generateToken(newUser);

    return res.json({
      token,
      user: {
        id: newUser.id,
        name: newUser.username,
        email: newUser.email,
        role: newUser.role,
        farm_id: newUser.farm_id,
      },
    });
  } catch (err) {
    console.error("🔥 Signup error:", err);

    if (err.code === "23505") {
      return res.status(400).json({ message: "Email already registered" });
    }

    res.status(500).json({ message: "Server error during signup" });
  }
};

/**
 * 📌 Get Current User
 */
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userResult = await pool.query(
      "SELECT id, username, email, role, farm_id FROM users WHERE id = $1",
      [userId]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("🔥 Error fetching current user:", err);
    res.status(500).json({ message: "Server error fetching user" });
  }
};
