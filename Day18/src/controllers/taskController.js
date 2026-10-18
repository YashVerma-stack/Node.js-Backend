import pool from "../config/db.js";

export const createTask = async (req, res, next) => {
    try {
        const { title, description = "" } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        if (
            typeof description !== "string" ||
            description.length > 5000
        ) {
            return res.status(400).json({
                success: false,
                message: "Description must be a string of at most 5000 characters",
            });
        }

        const result = await pool.query(
            `INSERT INTO tasks (title, description)
             VALUES ($1, $2)
             RETURNING *`,
            [title.trim(), description]
        );

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

export const getAllTasks = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM tasks
             ORDER BY id ASC`
        );

        return res.status(200).json({
            success: true,
            count: result.rowCount,
            tasks: result.rows,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (
            !Number.isSafeInteger(id) ||
            id <= 0 ||
            String(id) !== req.params.id
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const { title, description, completed } = req.body;

        if (
            title === undefined &&
            description === undefined &&
            completed === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide at least one field to update",
            });
        }

        if (
            title !== undefined &&
            (typeof title !== "string" ||
                !title.trim() ||
                title.trim().length > 150)
        ) {
            return res.status(400).json({
                success: false,
                message: "Title must be a non-empty string of at most 150 characters",
            });
        }

        if (
            description !== undefined &&
            (typeof description !== "string" ||
                description.length > 5000)
        ) {
            return res.status(400).json({
                success: false,
                message: "Description must be a string of at most 5000 characters",
            });
        }

        if (
            completed !== undefined &&
            typeof completed !== "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message: "Completed must be a boolean",
            });
        }

        const result = await pool.query(
            `UPDATE tasks
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 completed = COALESCE($3, completed),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING *`,
            [
                title === undefined ? null : title.trim(),
                description === undefined ? null : description,
                completed === undefined ? null : completed,
                id,
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (
            !Number.isSafeInteger(id) ||
            id <= 0 ||
            String(id) !== req.params.id
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const result = await pool.query(
            `DELETE FROM tasks
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            task: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};