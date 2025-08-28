// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productionRoutes from "./routes/productionRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import pool from "./config/db.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Public routes
app.use("/api/auth", authRoutes);

// ✅ Protected routes
app.use("/api/production", authMiddleware, productionRoutes);
app.use("/api/prices", authMiddleware, priceRoutes);

// ✅ Test DB connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("DB connection error:", err));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
