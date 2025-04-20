import express from "express";


import {
  getCourses,
  getCourseById,
  createCourse,
  getCourseMaterials,
  deleteCourse,
} from "../controllers/courseController.js";
import {
  verifyToken,
  protectAdmin,
  checkEnrollment,
} from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", verifyToken, protectAdmin, createCourse); // Protected: only logged-in users
router.get(
  "/:id/materials", // Matches /api/courses/123/materials
  verifyToken,
  checkEnrollment,
  getCourseMaterials
);
router.delete(
  "/:id",
  verifyToken,
  protectAdmin,
  deleteCourse
);

export default router;


