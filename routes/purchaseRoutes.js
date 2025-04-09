import express from "express";
import {
  createPurchase,
  getMyPurchases,
} from "../controllers/purchaseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createPurchase);
router.get("/my", verifyToken, getMyPurchases);

export default router;
