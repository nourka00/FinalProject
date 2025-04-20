import { Review, Course, User } from "../models/index.js";

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course_id = req.params.id;

    const newReview = await Review.create({
      user_id: req.user.id,
      course_id,
      rating,
      comment,
      created_at: new Date(),
    });

    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Failed to add review" });
  }
};

export const getCourseReviews = async (req, res) => {
  try {
    const course_id = req.params.id;

    const reviews = await Review.findAll({
      where: { course_id },
      include: [
        {
          model: User,
          attributes: ["display_name"], // display name of student
        },
      ],
    });

    res.json(reviews);
  } catch (error) {
    console.error("Fetch reviews error:", error);
    res.status(500).json({ message: "Failed to get reviews" });
  }
};
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.reviewId;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Allow only the owner or admin
    if (review.user_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this review" });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    res.json({ message: "Review updated", review });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ message: "Failed to update review" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this review" });
    }

    await review.destroy();

    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
};
