
export function errorMiddleware(err, req, res, next) {
  console.error({
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    error: err.message,
  });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode < 600
      ? err.statusCode
      : 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message,
    requestId: req.requestId,
  });
}
