import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Course = sequelize.define(
  "Course",
  {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    schedule: DataTypes.ENUM("month", "2 months", "3 months"),
    level: DataTypes.ENUM("Beginner", "Intermediate", "Mixed"),
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    tableName: "courses",
    timestamps: false,
  }
);

export default Course;
