// Remove "use strict" - not needed in ESM
import { Sequelize } from "sequelize";

// Named exports only (remove default export)
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("users", "image_path", {
    type: Sequelize.STRING, // Note: STRING in uppercase
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("users", "image_path");
}

// Remove this line - it's causing conflicts
// export default { up, down };
