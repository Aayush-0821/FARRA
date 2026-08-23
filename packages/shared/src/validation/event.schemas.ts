import { z } from "zod";

import {
  amountSchema,
  currencySchema,
  idSchema,
  timestampSchema,
} from "./common.schemas";

export const revenueEventTypeSchema = z.enum([
  "CHECKOUT_ABANDONMENT",
  "PAYMENT_FAILURE",
  "PAYMENT_DEGRADATION",
  "INVOICE_OVERDUE",
  "SUBSCRIPTION_FAILURE",
]);

export const revenueEventSchema = z.object({
  id: idSchema,

  merchantId: idSchema,

  type: revenueEventTypeSchema,

  amount: amountSchema.optional(),

  currency: currencySchema.default("INR"),

  occurredAt: timestampSchema,

  source: z.literal("razorpay"),

  resourceId: idSchema.optional(),

  metadata: z.record(
    z.string(),
    z.unknown(),
  ).default({}),
});

export type RevenueEvent =
  z.infer<typeof revenueEventSchema>;