import express from "express";

import { requestId } from "./middleware/requestId.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";

import applicationRoutes from "./routes/applicationRoutes.js";

const app = express();

//  Request ID middleware
app.use(requestId);

//  Application-level logging middleware
app.use(requestLogger);

//  Built-in middleware
app.use(express.json({limit: "100kb"}));


//  Health endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Job Application API is running",
        requestId: req.requestId,
    });
});

//  Mount application router
app.use("/api/applications", applicationRoutes);

//  404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        requestId: req.requestId,
    });
});

//  Centralized error handler
app.use(errorHandler);

export default app;
