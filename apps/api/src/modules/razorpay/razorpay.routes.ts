import { Router } from "express";

import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

import { RazorpayController } from "./razorpay.controller.js";
import { RazorpayRepository } from "./razorpay.repository.js";
import { RazorpayService } from "./razorpay.service.js";

const razorpayRouter = Router();

const razorpayRepository = new RazorpayRepository(prisma);

const razorpayService = new RazorpayService(
  razorpayRepository,
);

const razorpayController = new RazorpayController(
  razorpayService,
);

razorpayRouter.get(
  "/connection",
  requireAuth,
  razorpayController.getConnection.bind(
    razorpayController,
  ),
);

razorpayRouter.post(
  "/connection",
  requireAuth,
  razorpayController.createConnection.bind(
    razorpayController,
  ),
);

razorpayRouter.patch(
  "/connection",
  requireAuth,
  razorpayController.updateConnection.bind(
    razorpayController,
  ),
);

razorpayRouter.delete(
  "/connection",
  requireAuth,
  razorpayController.disconnect.bind(
    razorpayController,
  ),
);

export default razorpayRouter;