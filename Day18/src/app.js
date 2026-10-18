import express from "express";

import requestId from "./middleware/requestId.js";
import requestLogger from "./middleware/requestLogger.js";
import apiKeyMiddleware from "./middleware/apiKeyMiddleware.js";
import errorHandler from "./middleware/errorHandler.js";

import taskRoutes from "./routes/taskRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

const app = express();

// Application-level middleware
app.use(express.json({ limit: "1mb" }));
app.use(requestId);
app.use(requestLogger);

// Public health endpoint
app.use("/api/health", healthRoutes);

// Protect task endpoints with the API key
app.use("/api/tasks", apiKeyMiddleware, taskRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        requestId: req.requestId,
    });
});

// Error-handling middleware must come last
app.use(errorHandler);

export default app;