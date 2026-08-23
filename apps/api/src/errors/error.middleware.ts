import type { ErrorRequestHandler } from "express";

import { logger } from "../lib/logger.js";
import { AppError } from "./app.errors.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
) => {
  if (error instanceof AppError) {
    logger.warn(
      {
        err: error,
        method: req.method,
        path: req.originalUrl,
        statusCode: error.statusCode,
        code: error.code,
      },
      error.message,
    );

    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });

    return;
  }

  logger.error(
    {
      err: error,
      method: req.method,
      path: req.originalUrl,
    },
    "Unhandled application error",
  );

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });
};