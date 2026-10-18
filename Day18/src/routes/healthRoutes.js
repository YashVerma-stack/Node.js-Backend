import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const result = await pool.query(
            "SELECT NOW() AS current_time"
        );

        res.status(200).json({
            success: true,
            message: "Server and database are healthy",
            requestId: req.requestId,
            databaseTime: result.rows[0].current_time,
        });
    } catch (error) {
        next(error);
    }
});

export default router;