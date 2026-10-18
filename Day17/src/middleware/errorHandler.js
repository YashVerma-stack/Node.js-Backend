
function errorHandler(err, req, res, next) {
    console.error("Request failed:", {
        method: req.method,
        path: req.originalUrl,
        message: err.message,
        code: err.code,
    });

    if (res.headersSent) {
        return next(err);
    }

    // Invalid JSON sent by the client
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body",
        });
    }

    // PostgreSQL unique constraint violation
    if (err.code === "23505") {
        return res.status(409).json({
            success: false,
            message: "A record with this value already exists",
        });
    }

    // PostgreSQL not-null constraint violation
    if (err.code === "23502") {
        return res.status(400).json({
            success: false,
            message: "A required database field is missing",
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}

export default errorHandler;
