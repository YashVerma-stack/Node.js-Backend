import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check whether the authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            success: false,
            message: "Access token is missing or malformed",
        });
    } 

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"],
            }
        );

        // Attack verified claims to the request
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token has expired",
            });
        }
        if (error.name === "NotBeforeError") {
            return res.status(401).json({
                success: false,
                message: "Access token is not active yet",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid access token",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}