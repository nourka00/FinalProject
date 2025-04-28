import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CourseDetail = sequelize.define(
  "CourseDetail",
  {
    course_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    media_url: DataTypes.STRING,
  },
  {
    tableName: "course_details",
    timestamps: false,
  }
);

export default CourseDetail;
