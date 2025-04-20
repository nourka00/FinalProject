import express from "express";
import {
  createPurchase,
  getMyPurchases,
  updatePurchaseStatus,
} from "../controllers/purchaseController.js";
import { verifyToken, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createPurchase);
router.get("/my", verifyToken, getMyPurchases);
router.patch(
  "/:purchaseId/status",
  verifyToken,
  protectAdmin,
  updatePurchaseStatus
);
export default router;
