
import express from "express";
import dotenv from "dotenv";

import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

import { requestMiddleware } from "./middleware/requestMiddleware.js";
import { apiKeyMiddleware } from "./middleware/apiKeyMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// 1. Parse JSON request bodies
app.use(express.json({ limit: "1mb" }));

// 2. Assign request IDs and log requests
app.use(requestMiddleware);

// 3. Public health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Day 20 Inventory API is running",
    requestId: req.requestId,
  });
});

// 4. Protect inventory routes
app.use("/api/categories", apiKeyMiddleware, categoryRoutes);
app.use("/api/items", apiKeyMiddleware, itemRoutes);

// 5. Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    requestId: req.requestId,
  });
});

// 6. Centralized error handler — must be last
app.use(errorMiddleware);

export default app;
