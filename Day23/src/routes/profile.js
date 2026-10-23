
import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/", authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Profile accessed successfully",
        user: req.user,
    });
});

export default router;
