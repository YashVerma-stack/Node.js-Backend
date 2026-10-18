const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];

    if (!process.env.API_KEY) {
        return res.status(500).json({
            success: false,
            message: "API key configuration is missing",
            requestId: req.requestId,
        });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({
            success: false,
            message: "Invalid or missing API key",
            requestId: req.requestId,
        });
    }

    next();
};

export default apiKeyMiddleware;