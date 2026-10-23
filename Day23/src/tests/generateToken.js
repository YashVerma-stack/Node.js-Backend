
import "dotenv/config";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_ACCESS_SECRET;

if (!secret || secret.length < 32) {
    throw new Error("Set a strong JWT_ACCESS_SECRET in .env");
}

const userToken = jwt.sign(
    { id: "user123", role: "user", type: "access" },
    secret,
    { algorithm: "HS256", expiresIn: "15m" }
);

const adminToken = jwt.sign(
    { id: "admin123", role: "admin", type: "access" },
    secret,
    { algorithm: "HS256", expiresIn: "15m" }
);

console.log("USER TOKEN:\n", userToken);
console.log("\nADMIN TOKEN:\n", adminToken);
