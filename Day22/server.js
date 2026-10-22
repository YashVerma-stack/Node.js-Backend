
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/authRoutes.js";
import { authenticateToken } from "./middleware/authenticateToken.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Day 22 Auth API is running",
  });
});

// Registration and login endpoints
app.use("/api/auth", authRoutes);

// Demo endpoint from Step 3
app.get("/api/auth/token", (req, res) => {
  const token = jwt.sign(
    { userId: 101, role: "user" },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      algorithm: "HS256",
    }
  );

  res.status(200).json({
    success: true,
    message: "Demo JWT generated",
    token,
  });
});

// Protected endpoint from Step 4
app.get(
  "/api/auth/profile",
  authenticateToken,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Protected profile accessed successfully",
      user: req.user,
    });
  }
);

// Handle malformed JSON requests
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
  }

  next(err);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
