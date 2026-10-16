export const errorHandler = (err, req, res, next) => {
    console.error({
        requestId: req.requestId,
        message: err.message,
    });

    if (res.headersSent) {
        return next(err);
    }

    // malformed json
    if(err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body",
            requestId: req.requestId,
        });
    }

    // request body exceeds the configured limit
    if (err.status === 413 || err.type === "entity.too.large") {
        return res.status(413).json({
            success: false,
            message: "Request body is too large. Maximum size is 100 KB",
            requestId: req.requestId,
        });
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? "Internal Server Error"
                : err.message,
        requestId: req.requestId,
    });
};