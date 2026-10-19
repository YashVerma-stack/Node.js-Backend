
export function apiKeyMiddleware(req, res, next) {
  const expectedKey = process.env.API_KEY;
  const providedKey = req.get("x-api-key");

  if (!expectedKey || !providedKey || providedKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: "Invalid or missing API key",
      requestId: req.requestId,
    });
  }

  next();
}
