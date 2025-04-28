export async function up(queryInterface, Sequelize) {
  // This function applies changes
  await queryInterface.dropTable("skills");
  await queryInterface.dropTable("course_skills");
  await queryInterface.dropTable("course_relations");
}

export async function down(queryInterface, Sequelize) {
  // This function reverts changes (optional - here we leave it empty)
}
