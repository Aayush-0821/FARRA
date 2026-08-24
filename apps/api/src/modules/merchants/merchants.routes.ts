import { Router } from "express";

import { prisma } from "database";

import { MerchantController } from "./merchants.controller.js";
import { MerchantRepository } from "./merchants.repository.js";
import { MerchantService } from "./merchants.service.js";

const merchantRepository = new MerchantRepository(prisma);

const merchantService = new MerchantService(
  merchantRepository,
);

const merchantController = new MerchantController(
  merchantService,
);

export const merchantRoutes = Router();

merchantRoutes.get(
  "/:merchantId",
  merchantController.getMerchant,
);

merchantRoutes.patch(
  "/:merchantId",
  merchantController.updateMerchant,
);

merchantRoutes.get(
  "/:merchantId/connection",
  merchantController.getRazorpayConnection,
);

merchantRoutes.get(
  "/:merchantId/recovery-policies",
  merchantController.getRecoveryPolicies,
);

merchantRoutes.get(
  "/:merchantId/recovery-policies/active",
  merchantController.getActiveRecoveryPolicy,
);

merchantRoutes.get(
  "/:merchantId/recovery-policies/:policyId",
  merchantController.getRecoveryPolicy,
);

merchantRoutes.post(
  "/:merchantId/recovery-policies",
  merchantController.createRecoveryPolicy,
);

merchantRoutes.patch(
  "/:merchantId/recovery-policies/:policyId",
  merchantController.updateRecoveryPolicy,
);

merchantRoutes.delete(
  "/:merchantId/recovery-policies/:policyId",
  merchantController.deactivateRecoveryPolicy,
);