import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CourseMaterial = sequelize.define(
  "CourseMaterial",
  {
    course_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    material_type: DataTypes.ENUM("pdf", "document"),
    file_url: DataTypes.STRING,
    uploaded_at: DataTypes.DATE,
  },
  {
    tableName: "course_materials",
    timestamps: false,
  }
);

export default CourseMaterial;
