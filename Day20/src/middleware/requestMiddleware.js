
import { randomUUID } from "node:crypto";

export function requestMiddleware(req, res, next) {
  req.requestId = randomUUID();

  res.setHeader("X-Request-ID", req.requestId);

  const startTime = Date.now();

  res.on("finish", () => {
    console.log({
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${Date.now() - startTime}ms`,
    });
  });

  next();
}
