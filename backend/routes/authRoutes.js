// src/routes/authRoutes.js
import express from "express";
import { signup, login, getCurrentUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // 👈 if you already have JWT check middleware

const router = express.Router();

// Auth endpoints
router.post("/signup", signup);
router.post("/login", login);

// Example protected route to get logged-in user
router.get("/me", authMiddleware, getCurrentUser);

export default router;
