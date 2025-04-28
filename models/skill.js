import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Skill = sequelize.define(
  "Skill",
  {
    skill_name: DataTypes.STRING,
  },
  {
    tableName: "skills",
    timestamps: false,
  }
);

export default Skill;
