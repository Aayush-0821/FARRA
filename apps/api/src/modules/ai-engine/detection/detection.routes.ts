import { Router } from "express";

import { DetectionRepository } from "./detection.repository.js";
import { DetectionService } from "./detection.service.js";
import { DetectionController } from "./detection.controller.js";
import { DetectionEngine } from "./detection.engine.js";

import { prisma } from "../../../lib/prisma.js";
import { requireAuth } from "../../../middleware/auth.middleware.js";

const router = Router();

const detectionRepository =
  new DetectionRepository(prisma);

const detectionEngine =
  new DetectionEngine();

const detectionService =
  new DetectionService(
    detectionRepository,
    detectionEngine,
  );

const detectionController =
  new DetectionController(
    detectionService,
  );

router.use(requireAuth);

router.post(
  "/process",
  detectionController.processPendingEvents.bind(
    detectionController,
  ),
);

router.post(
  "/events/:revenueEventId/process",
  detectionController.processEvent.bind(
    detectionController,
  ),
);

export default router;