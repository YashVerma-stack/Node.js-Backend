import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import pool from "./config/db.js";


const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
    try {
        await pool.query("SELECT 1");

        const server = app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
            console.log("PostgreSQL connection verified");
        });

        const shutdown = (signal) => {
            console.log(`${signal} received. Shutting down...`);

            server.close(async () => {
                try {
                    await pool.end();
                    console.log("HTTP server and database pool closed");
                    process.exitCode = 0;
                } catch (error) {
                    console.error("Shutdown error:", error.message);
                    process.exitCode = 1;
                }
            });
        };

        process.once("SIGINT", () => shutdown("SIGINT"));
        process.once("SIGTERM", () => shutdown("SIGTERM"));
    } catch (error) {
        console.error("Failed to start server:", error.message);
        await pool.end();
        process.exitCode = 1;
    }
};

startServer();