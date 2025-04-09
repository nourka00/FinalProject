import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Review = sequelize.define(
  "Review",
  {
    user_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER,
    rating: { type: DataTypes.INTEGER, defaultValue: 5 },
    comment: DataTypes.TEXT,
    created_at: DataTypes.DATE,
  },
  {
    tableName: "reviews",
    timestamps: false,
  }
);

export default Review;
