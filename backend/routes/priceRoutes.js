import express from "express";
import { getPrices, updatePrice } from "../controllers/priceController.js";

const router = express.Router();

router.get("/", getPrices);
router.put("/:product", updatePrice);

export default router;
