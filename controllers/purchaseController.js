import { Purchase, Course } from "../models/index.js";
import supabase from "../config/supabase.js";


export const createPurchase = async (req, res) => {
  try {
    console.log("Body:", req.body); // Debug
    console.log("File:", req.file); // Debug
    const { course_id, payment_method, transaction_id } = req.body;
    const file = req.file; // Multer stores the file here

    if (!file) {
      return res.status(400).json({ error: "Proof of payment is required" });
    }

    // Upload to Supabase
    const fileName = `enrollment_${Date.now()}_${file.originalname}`;
    const { data, error: uploadError } = await supabase.storage
      .from("proofenroll") // Your bucket name
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw new Error("Failed to upload proof: " + uploadError.message);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("proofenroll").getPublicUrl(fileName);

    // Save to database
    const purchase = await Purchase.create({
      user_id: req.user.id,
      course_id,
      payment_method,
      transaction_id,
      proof_of_payment: publicUrl, // Store Supabase URL
      status: "pending",
    });

    res.status(201).json(purchase);
  } catch (err) {
    console.error("Full error:", err); // Log the full error
    res.status(500).json({ error: err.message });
  }
};
export const getMyPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      where: { user_id: req.user.id },
      include: [Course],
    });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updatePurchaseStatus = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const { status } = req.body;

    // Admin verification
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const purchase = await Purchase.findByPk(purchaseId);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    await purchase.update({ status });
    res.json({ message: "Purchase status updated", purchase });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({ include: [Course] });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET /api/courses/:id/enrollment
export const checkEnrollment = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from JWT
    const courseId = req.params.id;

    const enrollment = await Purchase.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    res.json({ enrolled: !!enrollment });
  } catch (error) {
    res.status(500).json({ message: "Enrollment check failed", error: error.message });
  }
};
