import express from "express";
import {
  createMaterial,
  getMaterialsByCourse,
  getAllAccessibleMaterials,
} from "../controllers/materialController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createMaterial);
router.get("/course/:courseId", verifyToken, getMaterialsByCourse);
router.get("/materials", verifyToken, getAllAccessibleMaterials);

export default router;
