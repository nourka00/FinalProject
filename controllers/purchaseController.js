import { Purchase, Course } from "../models/index.js";
import { Op } from "sequelize";
export const createPurchase = async (req, res) => {
  try {
    const { course_id, payment_method, proof_of_payment, transaction_id } =
      req.body;
    const purchase = await Purchase.create({
      user_id: req.user.id,
      course_id,
      purchase_date: new Date(),
      payment_method,
      proof_of_payment,
      transaction_id,
      status: "pending",
    });
    res.status(201).json(purchase);
  } catch (err) {
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
