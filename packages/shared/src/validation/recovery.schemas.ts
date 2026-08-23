import { z } from "zod";

import {
  amountSchema,
  currencySchema,
  idSchema,
  probabilitySchema,
  timestampSchema,
} from "./common.schemas";

export const recoveryStatusSchema = z.enum([
  "DETECTED",
  "ANALYZING",
  "ELIGIBLE",
  "IN_PROGRESS",
  "RECOVERED",
  "FAILED",
  "ESCALATED",
  "STOPPED",
  "EXPIRED",
]);

export const recoveryTypeSchema = z.enum([
  "PAYMENT_RETRY",
  "CHECKOUT_RECOVERY",
  "SUBSCRIPTION_RECOVERY",
  "INVOICE_COLLECTION",
  "MANDATE_RETRY",
  "VOICE_RECOVERY",
]);

export const recoveryCaseSchema = z.object({
  id: idSchema,

  merchantId: idSchema,

  eventId: idSchema,

  type: recoveryTypeSchema,

  status: recoveryStatusSchema,

  amountAtRisk: amountSchema,

  currency: currencySchema.default("INR"),

  recoveryProbability: probabilitySchema.optional(),

  expiresAt: timestampSchema,

  createdAt: timestampSchema,

  metadata: z.record(
    z.string(),
    z.unknown(),
  ).default({}),
});

export type RecoveryCase =
  z.infer<typeof recoveryCaseSchema>;