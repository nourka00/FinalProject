import { Purchase, Course } from "../models/index.js";

export const createPurchase = async (req, res) => {
  try {
    const { course_id, payment_method, proof_of_payment, transaction_id } =
      req.body;
    const purchase = await Purchase.create({
      user_id: req.userId,
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
      where: { user_id: req.userId },
      include: [Course],
    });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
