import { sequelize } from "./models/index.js";
import { up } from "./migrations/20250509093904-add-image-to-courses.js";

async function runMigration() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    await up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log("Image column migration successful!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
