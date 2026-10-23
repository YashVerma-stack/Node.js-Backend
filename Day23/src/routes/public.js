
import express from "express";

const router = express.Router();

// Public route: no token required.
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome! This is a public route.",
    });
});

export default router;
