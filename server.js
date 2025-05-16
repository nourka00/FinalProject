import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import supabase from "./config/supabase.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
process.env.ESM_DISABLE_CACHE = "1";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());


app.use("/api", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/upload-material", uploadRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/courses", reviewRoutes);
app.use("/api/supabase", (req, res) => {
  const { bucketName } = req.query;
  supabase.storage
    .from(bucketName)
    .list("")
    .then(({ data, error }) => {
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    });
}); 
app.get("/", (req, res) => res.send("API running"));
// Sync DB
sequelize.sync({ alter: true, logging: false }).then(() => {
  console.log("DB synced");
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
