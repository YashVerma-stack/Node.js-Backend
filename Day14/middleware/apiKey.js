import { API_KEY } from "../config/env.js";

export const apiKeyMiddleware = (req, res, next) => {
    const providedKey = req.headers["x-api-key"];

    if (!API_KEY) {
        return res.status(500).json({
            success: false,
            message: "API key is not configured",
            requestId: req.requestId,
        });

    }
    if (providedKey !== API_KEY) {
        return res.status(401).json({
            success: false,
            message: "Invalid or missing API key",
            requestId: req.requestId,
        });
    }

    next();

}



