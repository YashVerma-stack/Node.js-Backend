const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - startTime;

        console.log({
            requestId: req.requestId,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });
    });

    next();
};

export default requestLogger;