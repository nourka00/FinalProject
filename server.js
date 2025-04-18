process.env.ESM_DISABLE_CACHE = "1";
import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/purchases", purchaseRoutes);

app.get("/", (req, res) => res.send("API running"));
// Sync DB
sequelize.sync({ alter: true, logging: false }).then(() => {
  console.log("DB synced");
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
