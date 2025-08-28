import express from "express";
import { getProduction,  getTodayProductsCount, addProduction, getMonthlyIncome, getCurrentMonthIncome, getIncomeByProductMonthly,  getTodayIncome   } from "../controllers/productionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProduction);
router.post("/", authMiddleware, addProduction);
router.get("/income/monthly", authMiddleware, getMonthlyIncome);
router.get("/income/current", authMiddleware, getCurrentMonthIncome);
router.get("/income/by-product", authMiddleware, getIncomeByProductMonthly);
router.get("/income/today", authMiddleware, getTodayIncome);
router.get("/today-products-count",authMiddleware, getTodayProductsCount);

export default router;
