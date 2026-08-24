import { Router } from "express";

import { prisma } from "../lib/prisma.js";
import { redis } from "../lib/redis.js";

const router = Router();

router.get("/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();

    res.status(200).json({
      success: true,
      data: {
        status: "ok",
        database: "up",
        redis: "up",
      },
    });
  } catch (error) {
    next(error);
  }
});

export { router as healthRouter };