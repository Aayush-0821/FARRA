import type { RequestHandler } from "express";
import { nanoid } from "nanoid";

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const requestId = req.header("x-request-id") ?? nanoid();

  res.setHeader("x-request-id", requestId);

  res.locals.requestId = requestId;

  next();
};