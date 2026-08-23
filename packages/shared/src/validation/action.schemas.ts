import { z } from "zod";

import {
  amountSchema,
  idSchema,
  timestampSchema,
} from "./common.schemas";

export const recoveryActionTypeSchema = z.enum([
  "RETRY_PAYMENT",
  "SEND_PAYMENT_LINK",
  "SEND_REMINDER",
  "RETRY_MANDATE",
  "SEND_CHECKOUT_REMINDER",
  "INITIATE_VOICE_CALL",
  "ESCALATE_TO_MERCHANT",
  "STOP_RECOVERY",
]);

export const recoveryActionSchema = z.object({
  id: idSchema,

  recoveryCaseId: idSchema,

  type: recoveryActionTypeSchema,

  attemptNumber: z
    .number()
    .int()
    .positive(),

  scheduledAt: timestampSchema.optional(),

  amount: amountSchema.optional(),

  reason: z.string().min(1),

  metadata: z.record(
    z.string(),
    z.unknown(),
  ).default({}),
});

export type RecoveryAction =
  z.infer<typeof recoveryActionSchema>;