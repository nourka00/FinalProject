import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CourseRelation = sequelize.define(
  "CourseRelation",
  {
    course_id: DataTypes.INTEGER,
    related_course_id: DataTypes.INTEGER,
  },
  {
    tableName: "course_relations",
    timestamps: false,
  }
);

export default CourseRelation;
