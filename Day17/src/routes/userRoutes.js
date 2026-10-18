import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, created_at FROM users ORDER BY id ASC"
        );

        res.status(200).json({
            success: true,
            count: result.rowCount,
            data: result.rows,
        });
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { name, email } = req.body;

        // Validate required fields
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            !name.trim() ||
            !email.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required",
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length > 100 || cleanEmail.length > 150) {
            return res.status(400).json({
                success: false,
                message: "Name or email exceeds the maximum length",
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        const result = await pool.query(
            `INSERT INTO users (name, email)
             VALUES ($1, $2)
             RETURNING id, name, email, created_at`,
            [cleanName, cleanEmail]
        );

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result.rows[0],
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists",
            });
        }

        next(error);
    }
});


router.patch("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { name, email } = req.body;

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "ID must be a positive integer",
            });
        }

        if (
            !req.body ||
            typeof req.body !== "object" ||
            Array.isArray(req.body)
        ) {
            return res.status(400).json({
                success: false,
                message: "Request body must be a JSON object",
            });
        }

        const allowedFields = ["name", "email"];
        const fields = Object.keys(req.body);

        if (
            fields.length === 0 ||
            fields.some((field) => !allowedFields.includes(field))
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide name or email to update",
            });
        }

        const updates = [];
        const values = [];

        if (Object.hasOwn(req.body, "name")) {
            if (
                typeof name !== "string" ||
                !name.trim() ||
                name.trim().length > 100
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Name must contain 1-100 characters",
                });
            }

            values.push(name.trim());
            updates.push(`name = $${values.length}`);
        }

        if (Object.hasOwn(req.body, "email")) {
            if (
                typeof email !== "string" ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
                email.trim().length > 150
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid email address",
                });
            }

            values.push(email.trim().toLowerCase());
            updates.push(`email = $${values.length}`);
        }

        values.push(id);

        const query = `
            UPDATE users
            SET ${updates.join(", ")}
            WHERE id = $${values.length}
            RETURNING id, name, email, created_at
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "That email address is already in use",
            });
        }

        next(error);
    }
});


router.delete("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        // Validate user ID
        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "ID must be a positive integer",
            });
        }

        // Delete the user and return the deleted record
        const result = await pool.query(
            `DELETE FROM users
             WHERE id = $1
             RETURNING id, name, email`,
            [id]
        );

        // Check whether a user existed
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
});



export default router;