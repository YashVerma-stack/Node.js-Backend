const errorHandler = (err, req, res, next) => {
    console.error({
        requestId: req.requestId,
        message: err.message,
        code: err.code,
    });

    if (res.headersSent) {
        return next(err);
    }

    if (err.code === "23505") {
        return res.status(409).json({
            success: false,
            message: "A record with this value already exists",
            requestId: req.requestId,
        });
    }

    if (err.code === "23503") {
        return res.status(409).json({
            success: false,
            message: "The operation conflicts with related records",
            requestId: req.requestId,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal server error",
        requestId: req.requestId,
    });
};

export default errorHandler;