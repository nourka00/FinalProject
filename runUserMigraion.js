import { sequelize } from "./models/index.js";
import { Sequelize } from "sequelize"; // Explicit import
import { up } from "./migrations/add-image-path-to-user.js";

async function runUserMigration() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    // Pass both queryInterface AND Sequelize with proper casing
    await up(sequelize.getQueryInterface(), Sequelize);

    console.log("Image column migration successful!");
    await sequelize.close(); // Proper connection cleanup
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    await sequelize.close(); // Cleanup even on error
    process.exit(1);
  }
}

runUserMigration();
