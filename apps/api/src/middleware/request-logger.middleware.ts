import type { RequestHandler } from "express";

import { logger } from "../lib/logger.js";

export const requestLoggerMiddleware: RequestHandler = (
  req,
  res,
  next,
) => {
  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs =
      Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    logger.info(
      {
        requestId: res.locals.requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
        userAgent: req.get("user-agent"),
      },
      "HTTP request completed",
    );
  });

  next();
};