import dotenv from 'dotenv';
dotenv.config();
import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/predict", predictionRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error"
  });
});

export default app;
