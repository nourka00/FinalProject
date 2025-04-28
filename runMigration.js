import { sequelize } from "./models/index.js";
import { up } from "./migrations/20240428-delete-skills-courseSkills-courseRelations.js";

async function runMigration() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");
    await up(sequelize.getQueryInterface());
    console.log("Migration successful!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
