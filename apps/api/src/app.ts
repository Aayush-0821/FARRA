import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";

import { errorMiddleware } from "./errors/error.middleware.js";

import {
  notFoundMiddleware,
  requestIdMiddleware,
  requestLoggerMiddleware,
} from "./middleware/index.js";

import { healthRouter } from "./routes/health.routes.js";
import { merchantRoutes } from "./modules/merchants/merchants.routes.js";
import authRouter from "./modules/auth/auth.routes.js";

export const app = express();

app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);

app.use(
  cors({
    origin: env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/v1/merchants", merchantRoutes);
app.use("/api/v1/auth", authRouter);

app.use(healthRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);