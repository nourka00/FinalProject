import sequelize from "../config/database.js";
import User from "./user.js";
import Course from "./course.js";
import Purchase from "./purchase.js";
import CourseMaterial from "./courseMaterial.js";
import Review from "./review.js";
import CourseDetail from "./courseDetail.js";
import MaterialAccessLog from "./materialAccessLog.js";


User.hasMany(Purchase, { foreignKey: "user_id" });
Purchase.belongsTo(User, { foreignKey: "user_id" });

Course.hasMany(Purchase, { foreignKey: "course_id" });
Purchase.belongsTo(Course, { foreignKey: "course_id" });

Course.hasMany(CourseMaterial, { foreignKey: "course_id" });
CourseMaterial.belongsTo(Course, { foreignKey: "course_id" });

Course.hasMany(Review, { foreignKey: "course_id" });
Review.belongsTo(Course, { foreignKey: "course_id" });
User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

Course.hasOne(CourseDetail, { foreignKey: "course_id" });
CourseDetail.belongsTo(Course, { foreignKey: "course_id" });

User.hasMany(MaterialAccessLog, { foreignKey: "user_id" });
CourseMaterial.hasMany(MaterialAccessLog, { foreignKey: "material_id" });

export {
  sequelize,
  User,
  Course,
  Purchase,
  CourseMaterial,
  Review,
  CourseDetail,
  MaterialAccessLog,
};
