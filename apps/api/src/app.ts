import express from "express";

import { errorMiddleware } from "./errors/error.middleware.js";
import {
  notFoundMiddleware,
  requestIdMiddleware,
  requestLoggerMiddleware,
} from "./middleware/index.js";

import { healthRouter } from "./routes/health.routes.js";
import { merchantRoutes } from "./modules/merchants/merchants.routes.js";

export const app = express();

app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes will be mounted here
// app.use("/api/v1/...", ...);

app.use("/api/v1/merchants", merchantRoutes);

app.use(healthRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
