import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import CourseMaterial from "./courseMaterial.js";
import supabase from "../config/supabase.js";

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
  },
  {
    hooks: {
      beforeDestroy: async (course) => {
        // 1. Find all materials for this course
        const materials = await CourseMaterial.findAll({
          where: { course_id: course.id },
        });

        // 2. Delete from Supabase
        const filePaths = materials.map(m =>
          m.file_url.split('/public/')[1]
        );

        await supabase.storage
          .from('course-materials')
          .remove(filePaths);

        // 3. Delete database records
        await CourseMaterial.destroy({
          where: { course_id: course.id },
        });
      },
    },
  });

export default Course;
