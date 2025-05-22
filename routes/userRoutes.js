import express from "express";
import {
  createUser,
  getUsers,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import uploadImage from "../middleware/uploadImage.js";
const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);

router.put("/update-password", verifyToken, updatePassword);
router.put("/update-profile", verifyToken, uploadImage.single("image"), updateProfile);
export default router;
