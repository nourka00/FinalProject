import express from "express";
import {
  createReview,
    getCourseReviews,
    updateReview,
    deleteReview,
} from "../controllers/reviewController.js";
import { verifyToken, checkEnrollment } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only enrolled students or admin can add a review
router.post("/:id/reviews", verifyToken, checkEnrollment, createReview);

// Anyone can see course reviews
router.get("/:id/reviews", getCourseReviews);

// Update review (by owner or admin)
router.put("/reviews/:reviewId", verifyToken, updateReview);

// Delete review (by owner or admin)
router.delete("/reviews/:reviewId", verifyToken, deleteReview);

export default router;
