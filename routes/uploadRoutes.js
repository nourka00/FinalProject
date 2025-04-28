import express from "express";
import upload from "../middleware/multer.js";
import {
  uploadCourseMaterial,
  deleteMaterial,
} from "../controllers/uploadController.js";
import { verifyToken, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/upload-material",
  protectAdmin,
  upload.single("file"),
  uploadCourseMaterial
);
router.get("/admin-test", protectAdmin, (req, res) => {
  res.json({ message: `Hello Admin ${req.user.name}` });
});
export default router;
router.delete(
  "/:id",
  verifyToken,
  protectAdmin, 
  deleteMaterial
);
