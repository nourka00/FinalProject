import express from "express";
import {
  createMaterial,
  getMaterialsByCourse,
} from "../controllers/materialController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createMaterial);
router.get("/course/:courseId", verifyToken, getMaterialsByCourse);

export default router;
