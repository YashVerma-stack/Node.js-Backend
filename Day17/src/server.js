
import "dotenv/config";
import express from "express";
import pool from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Application-level middleware
app.use(express.json());

// Health check: server status
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "OK",
        message: "Server is running",
    });
});

// Health check: PostgreSQL connection
app.get("/db-health", async (req, res, next) => {
    try {
        const result = await pool.query(
            "SELECT NOW() AS current_time"
        );

        res.status(200).json({
            success: true,
            status: "OK",
            database: "connected",
            time: result.rows[0].current_time,
        });
    } catch (error) {
        next(error);
    }
});

// User CRUD routes
app.use("/api/users", userRoutes);

// Handle unknown routes (must be after valid routes)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Centralized error handler (must be last)
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

let server;

async function startServer() {
    try {
        // Verify PostgreSQL connection before starting
        await pool.query("SELECT 1");

        server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to PostgreSQL:", error.message);
        await pool.end();
        process.exitCode = 1;
    }
}

async function shutdown() {
    console.log("\nShutting down server...");

    if (server) {
        server.close(async () => {
            try {
                await pool.end();
                console.log("PostgreSQL connection pool closed.");
                process.exitCode = 0;
            } catch (error) {
                console.error("Error closing database pool:", error.message);
                process.exitCode = 1;
            }
        });
    } else {
        await pool.end();
        process.exitCode = 0;
    }
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

startServer();
