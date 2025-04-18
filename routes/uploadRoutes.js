import express from "express";
import upload from "../middleware/multer.js";
import { uploadCourseMaterial } from "../controllers/uploadController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

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
