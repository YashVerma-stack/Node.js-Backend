import express from "express";
import bcrypt from "bcrypt";
import { email, z } from "zod";
import pool from "../config/db.js";

const router = express.Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),

  email: z.string().trim().email().max(255),

  password: z
    .string()
    .min(8)
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "Password must not exceed 72 UTF-8 bytes"
    ),
});


router.get("/users", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, created_at
       FROM users
       ORDER BY id ASC`
    );

    return res.status(200).json({
      success: true,
      count: result.rowCount,
      users: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/users/:id
router.get("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const result = await pool.query(
      `SELECT id, name, email, created_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});


router.post("/register", async (req, res, next) => {
  try {
    // 1. Validate request data
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration data",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { name, email, password } = validation.data;
    const normalizedEmail = email.toLowerCase();

    // 2. Check whether the email already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // 3. Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Save the user using a parameterized query
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, normalizedEmail, passwordHash]
    );

    // 5. Return safe user data
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    // Handle duplicate email if simultaneous requests race
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    next(error);
  }
});

router.post('/login', async(req, res, next) => {
    try {
        // validate the request body
        const loginSchema = z.object({
            email: z.string().trim().email().max(255),
            password: z.string().min(1).refine(
                (password) => Buffer.byteLength(password, "utf8") <= 72,
                "Invalid credentials"
            ),
        });

        const validation = loginSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid login data",
            });
        }

        const {email, password} = validation.data;
        const normalizedEmail = email.toLowerCase();

        // find the user by email
        const result = await pool.query(
            `SELECT id, name, email, password_hash
            FROM users
            WHERE email = $1`,
            [normalizedEmail]
        );

        // use the same response for unknown email and wrong password
        if(result.rowCount === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const user = result.rows[0];

        // compare the submitted password with the stores hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(40).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // return safe user information
        return res.status(200).json({
            success: true,
            message: "Password verification successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch(error) {
        next(error);
    }
})

router.put("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const updateSchema = z
      .object({
        name: z.string().trim().min(2).max(100),
        email: z.string().trim().email().max(255),
      })
      .strict();

    const validation = updateSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { name, email } = validation.data;
    const normalizedEmail = email.toLowerCase();

    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2
       WHERE id = $3
       RETURNING id, name, email, created_at`,
      [name, normalizedEmail, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    next(error);
  }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const result = await pool.query(
      `DELETE FROM users
       WHERE id = $1
       RETURNING id, name, email`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
