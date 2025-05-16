'use strict';
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("courses", "image", {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("courses", "image");
}
