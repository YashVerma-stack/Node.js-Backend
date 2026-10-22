
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Temporary storage for learning.
// Users will be lost when the server restarts.
const users = [];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createAccessToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
            algorithm: "HS256",
        }
    );
}

export async function register(req, res) {
    try {
        const { name, email, password } = req.body ?? {};

        // Validate required fields
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 8 and 72 characters",
            });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must not exceed 100 characters",
            });
        }

        const existingUser = users.find(
            (user) => user.email === normalizedEmail
        );

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        // Never store a plain-text password.
        const passwordHash = await bcrypt.hash(password, 12);

        const user = {
            id: users.length + 1,
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role: "user",
        };

        users.push(user);

        // Return a token after successful registration.
        const token = createAccessToken(user);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error("Registration error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body ?? {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            email.length > 254 ||
            !password ||
            password.length > 72 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password format",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        const user = users.find(
            (item) => item.email === normalizedEmail
        );

        // Use a generic response to avoid revealing which emails exist.
        if (
            !user ||
            !(await bcrypt.compare(password, user.passwordHash))
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = createAccessToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
