import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai";
import travelRoutes from "./routes/travel";
import authRoutes from "./routes/auth";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "TravelMind Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.get("/api", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to TravelMind API",
    version: process.env.API_VERSION || "v1",
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// AI routes
app.use("/api/ai", aiRoutes);

// Travel routes
app.use("/api/travel", travelRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server - listen on all interfaces (0.0.0.0) to allow connections from emulators/devices
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 TravelMind Backend server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 Server accessible at:`);
  console.log(`   - http://localhost:${PORT}`);
  console.log(`   - http://127.0.0.1:${PORT}`);
  console.log(`   - http://0.0.0.0:${PORT}`);
});
