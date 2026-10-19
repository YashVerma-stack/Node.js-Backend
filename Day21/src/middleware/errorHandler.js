export default function errorHandler(err, req, res, next) {
  console.error("Request error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
