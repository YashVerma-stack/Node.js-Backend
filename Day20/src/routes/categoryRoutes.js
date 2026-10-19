
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// CREATE a category
router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Name is required and must be at most 100 characters",
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, description)
       VALUES ($1, $2)
       RETURNING id, name, description, created_at`,
      [name.trim(), description?.trim() || null]
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A category with this name already exists",
      });
    }

    next(error);
  }
});

// READ all categories
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, created_at
       FROM categories
       ORDER BY id ASC`
    );

    return res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

// READ a category by ID
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      id > 2147483647
    ) {
      return res.status(400).json({
        success: false,
        message: "Category ID must be a valid positive integer",
      });
    }

    const result = await pool.query(
      `SELECT id, name, description, created_at
       FROM categories
       WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// UPDATE a category
router.patch("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;

    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      id > 2147483647
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const allowedFields = ["name", "description"];
    const suppliedFields = Object.keys(req.body);

    if (
      suppliedFields.length === 0 ||
      suppliedFields.some((field) => !allowedFields.includes(field))
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide valid fields: name and/or description",
      });
    }

    if (
      name !== undefined &&
      (typeof name !== "string" ||
        !name.trim() ||
        name.trim().length > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must be a non-empty string of at most 100 characters",
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string or null",
      });
    }

    const result = await pool.query(
      `UPDATE categories
       SET name = COALESCE($1, name),
           description = CASE
             WHEN $2::boolean THEN $3::text
             ELSE description
           END
       WHERE id = $4
       RETURNING id, name, description, created_at`,
      [
        name === undefined ? null : name.trim(),
        Object.hasOwn(req.body, "description"),
        description === undefined ? null : description?.trim() ?? null,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A category with this name already exists",
      });
    }

    next(error);
  }
});

// DELETE a category
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      id > 2147483647
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const result = await pool.query(
      `DELETE FROM categories
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(409).json({
        success: false,
        message: "Cannot delete a category that contains inventory items",
      });
    }

    next(error);
  }
});

export default router;
