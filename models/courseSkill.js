import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CourseSkill = sequelize.define(
  "CourseSkill",
  {
    course_id: DataTypes.INTEGER,
    skill_id: DataTypes.INTEGER,
  },
  {
    tableName: "course_skills",
    timestamps: false,
  }
);

export default CourseSkill;
