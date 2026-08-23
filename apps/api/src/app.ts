import express from "express";

import { errorMiddleware } from "./errors/error.middleware.js";
import {
  notFoundMiddleware,
  requestIdMiddleware,
  requestLoggerMiddleware,
} from "./middleware/index.js";

export const app = express();

app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes will be mounted here
// app.use("/api/v1/...", ...);

app.use(notFoundMiddleware);
app.use(errorMiddleware);