
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

const MAX_ID = 2147483647;

function isValidId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 && id <= MAX_ID;
}

function validateItemBody(body, isUpdate = false) {
  const allowedFields = ["name", "quantity", "price", "category_id"];
  const fields = Object.keys(body);

  if (isUpdate && fields.length === 0) {
    return "Provide at least one field to update";
  }

  if (fields.some((field) => !allowedFields.includes(field))) {
    return "Only name, quantity, price, and category_id are allowed";
  }

  if (
    Object.hasOwn(body, "name") &&
    (typeof body.name !== "string" ||
      !body.name.trim() ||
      body.name.trim().length > 150)
  ) {
    return "Name must be a non-empty string of at most 150 characters";
  }

  if (
    Object.hasOwn(body, "quantity") &&
    (!Number.isSafeInteger(body.quantity) || body.quantity < 0)
  ) {
    return "Quantity must be a non-negative integer";
  }

  if (
    Object.hasOwn(body, "price") &&
    (typeof body.price !== "number" ||
      !Number.isFinite(body.price) ||
      body.price < 0 ||
      Math.round(body.price * 100) !== body.price * 100)
  ) {
    return "Price must be a non-negative number with at most two decimal places";
  }

  if (
    Object.hasOwn(body, "category_id") &&
    !isValidId(body.category_id)
  ) {
    return "Category ID must be a positive integer";
  }

  return null;
}

// CREATE item
router.post("/", async (req, res, next) => {
  try {
    const validationError = validateItemBody(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const { name, quantity, price, category_id } = req.body;

    if (
      name === undefined ||
      quantity === undefined ||
      price === undefined ||
      category_id === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "name, quantity, price, and category_id are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO items (name, quantity, price, category_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, quantity, price, category_id, created_at`,
      [name.trim(), quantity, price, category_id]
    );

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "The specified category does not exist",
      });
    }

    next(error);
  }
});

// READ all items, including category details
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         i.id,
         i.name,
         i.quantity,
         i.price,
         i.category_id,
         c.name AS category_name,
         i.created_at
       FROM items i
       JOIN categories c ON c.id = i.category_id
       ORDER BY i.id ASC`
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

// READ item by ID
router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID",
      });
    }

    const result = await pool.query(
      `SELECT
         i.id,
         i.name,
         i.quantity,
         i.price,
         i.category_id,
         c.name AS category_name,
         i.created_at
       FROM items i
       JOIN categories c ON c.id = i.category_id
       WHERE i.id = $1`,
      [Number(req.params.id)]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
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

// UPDATE item
router.patch("/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID",
      });
    }

    const validationError = validateItemBody(req.body, true);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const { name, quantity, price, category_id } = req.body;

    const result = await pool.query(
      `UPDATE items
       SET name = COALESCE($1, name),
           quantity = COALESCE($2, quantity),
           price = COALESCE($3, price),
           category_id = COALESCE($4, category_id)
       WHERE id = $5
       RETURNING id, name, quantity, price, category_id, created_at`,
      [
        name === undefined ? null : name.trim(),
        quantity ?? null,
        price ?? null,
        category_id ?? null,
        Number(req.params.id),
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "The specified category does not exist",
      });
    }

    next(error);
  }
});

// DELETE item
router.delete("/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID",
      });
    }

    const result = await pool.query(
      `DELETE FROM items
       WHERE id = $1
       RETURNING id`,
      [Number(req.params.id)]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
