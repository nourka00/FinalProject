import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Purchase = sequelize.define(
  "Purchase",
  {
    user_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER,
    purchase_date: DataTypes.DATE,
    payment_method: DataTypes.ENUM(
      "credit_card",
      "paypal",
      "bank_transfer",
      "OMT",
      "mobile_wallet"
    ),
    status: DataTypes.ENUM("pending", "completed", "failed"),
    transaction_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    proof_of_payment: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "purchases",
    timestamps: false,
  }
);

export default Purchase;
