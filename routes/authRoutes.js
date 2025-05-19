import express from "express";
import { register, login ,getCurrentUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
  // In your authRoutes.js
router.get('/me', verifyToken, getCurrentUser);

export default router;
