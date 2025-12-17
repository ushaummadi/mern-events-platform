import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());
app.use(cookieParser());

// CORS: allow local dev + Vercel
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-events-platform.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// static for uploaded images (if you use uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// simple root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// connect DB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
  });
