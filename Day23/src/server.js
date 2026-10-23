
import express from "express";
import dotenv from "dotenv";

import publicRoutes from "./routes/public.js";
import profileRoutes from "./routes/profile.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Public endpoint
app.use("/api/public", publicRoutes);

// Authenticated profile endpoint
app.use("/api/profile", profileRoutes);

// Admin-only endpoints
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
