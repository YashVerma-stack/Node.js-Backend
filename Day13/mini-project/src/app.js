import express from "express";
import morgan from "morgan";
import cors from "cors";
import requestLogger from "./middleware/requestLogger.js";
import apiKeyAuth from "./middleware/apiKeyAuth.js";
import errorHandler from "./middleware/errorHandler.js";
import taskRoutes from './routes/taskRoutes.js';

const app = express();

// Built-in middleware
app.use(express.json());

// Third-party middleware
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

// Custom middleware
app.use(requestLogger);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.get("/api/protected", apiKeyAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You accessed the protected route successfully",
  });
});

app.get("/api/error-demo", (req, res, next) => {
  const error = new Error("Something went wrong!");
  error.statusCode = 400;

  next(error);
});

app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

export default app;
