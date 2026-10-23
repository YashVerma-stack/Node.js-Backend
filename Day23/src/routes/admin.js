
import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = express.Router();

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRole("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome to the admin dashboard",
            admin: req.user,
        });
    }
);

export default router;
