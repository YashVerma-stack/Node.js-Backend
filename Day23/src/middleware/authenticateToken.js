
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check whether the Authorization header exists.
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access token is required",
        });
    }

    // Split the header into its scheme and token.
    const [scheme, token, ...extra] = authHeader.split(" ");

    if (
        scheme !== "Bearer" ||
        !token ||
        extra.length > 0
    ) {
        return res.status(401).json({
            success: false,
            message: "Invalid Authorization header format",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET,
            { algorithms: ["HS256"] }
        );

        // Only accept access tokens, not refresh tokens.
        if (decoded.type !== "access") {
            return res.status(401).json({
                success: false,
                message: "Invalid token type",
            });
        }

        // Make the authenticated identity available to later handlers.
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message:
                error.name === "TokenExpiredError"
                    ? "Access token expired"
                    : "Invalid access token",
        });
    }
};
