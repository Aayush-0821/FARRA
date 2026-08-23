import { z } from "zod";

import {
  probabilitySchema,
  idSchema,
} from "./common.schemas";

import {
  recoveryActionTypeSchema,
} from "./action.schemas";

export const riskLevelSchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
]);

export const recoveryDecisionSchema = z.object({
  recoveryCaseId: idSchema,

  riskLevel: riskLevelSchema,

  recoveryProbability: probabilitySchema,

  recommendedAction: recoveryActionTypeSchema,

  reasoning: z.string().min(1),

  confidence: probabilitySchema,

  shouldRecover: z.boolean(),

  shouldEscalate: z.boolean(),

  stoppingReason: z.string().optional(),
});

export type RecoveryDecision =
  z.infer<typeof recoveryDecisionSchema>;