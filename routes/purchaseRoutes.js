import express from "express";
import {
  createPurchase,
  getMyPurchases,
  updatePurchaseStatus,
  getAllPurchases,
  checkEnrollment
} from "../controllers/purchaseController.js";
import { verifyToken, protectAdmin } from "../middleware/authMiddleware.js";
import uploadImage from "../middleware/uploadImage.js";
const router = express.Router();

router.post("/", verifyToken, uploadImage.single("proof_of_payment"), createPurchase);
router.get("/my", verifyToken, getMyPurchases);
router.patch(
  "/:purchaseId/status",
  verifyToken,
  protectAdmin,
  updatePurchaseStatus
);
router.get("/", verifyToken, protectAdmin, getAllPurchases);
router.get("/courses/:id/enrollment", verifyToken, checkEnrollment);

export default router;
