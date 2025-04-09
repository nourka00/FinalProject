import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MaterialAccessLog = sequelize.define(
  "MaterialAccessLog",
  {
    user_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    accessed_at: DataTypes.DATE,
  },
  {
    tableName: "material_access_logs",
    timestamps: false,
  }
);

export default MaterialAccessLog;
