import { z } from "zod";

import {
  EVENT_SOURCE,
  EVENT_STATUS,
  EVENT_TYPE,
  EVENT_VERSION,
} from "./event.constants";

const EventSourceSchema = z.enum([
  EVENT_SOURCE.RAZORPAY,
  EVENT_SOURCE.API,
  EVENT_SOURCE.WORKER,
  EVENT_SOURCE.SYSTEM,
]);

const EventTypeSchema = z.enum([
  EVENT_TYPE.PAYMENT_CREATED,
  EVENT_TYPE.PAYMENT_AUTHORIZED,
  EVENT_TYPE.PAYMENT_CAPTURED,
  EVENT_TYPE.PAYMENT_FAILED,
  EVENT_TYPE.PAYMENT_REFUNDED,

  EVENT_TYPE.SUBSCRIPTION_CREATED,
  EVENT_TYPE.SUBSCRIPTION_ACTIVATED,
  EVENT_TYPE.SUBSCRIPTION_CHARGED,
  EVENT_TYPE.SUBSCRIPTION_FAILED,
  EVENT_TYPE.SUBSCRIPTION_CANCELLED,

  EVENT_TYPE.INVOICE_CREATED,
  EVENT_TYPE.INVOICE_ISSUED,
  EVENT_TYPE.INVOICE_PAID,
  EVENT_TYPE.INVOICE_OVERDUE,
  EVENT_TYPE.INVOICE_CANCELLED,

  EVENT_TYPE.WEBHOOK_RECEIVED,
]);

const EventStatusSchema = z.enum([
  EVENT_STATUS.RECEIVED,
  EVENT_STATUS.PROCESSING,
  EVENT_STATUS.PROCESSED,
  EVENT_STATUS.FAILED,
  EVENT_STATUS.IGNORED,
]);

const EventMetadataSchema = z.object({
  correlationId: z.string().optional(),
  causationId: z.string().optional(),
  retryCount: z.number().int().nonnegative().optional(),
  sourceRequestId: z.string().optional(),
});

export const PaymentEventPayloadSchema = z.object({
  razorpayPaymentId: z.string().min(1),

  amount: z.number().nonnegative(),

  currency: z.string().length(3),

  status: z.enum([
    "CREATED",
    "AUTHORIZED",
    "CAPTURED",
    "FAILED",
    "REFUNDED",
    "PARTIALLY_REFUNDED",
    "CANCELLED",
  ]),

  method: z.string().optional(),

  customerId: z.string().optional(),

  failureCode: z.string().optional(),

  failureReason: z.string().optional(),

  raw: z.record(z.string(), z.unknown()).optional(),
});

export const SubscriptionEventPayloadSchema = z.object({
  razorpaySubscriptionId: z.string().min(1),

  amount: z.number().nonnegative(),

  currency: z.string().length(3),

  status: z.enum([
    "CREATED",
    "ACTIVE",
    "PENDING",
    "HALTED",
    "CANCELLED",
    "COMPLETED",
    "EXPIRED",
  ]),

  customerId: z.string().optional(),

  nextChargeAt: z.coerce.date().optional(),

  failedAttempts: z.number().int().nonnegative().optional(),

  raw: z.record(z.string(), z.unknown()).optional(),
});

export const InvoiceEventPayloadSchema = z.object({
  razorpayInvoiceId: z.string().min(1),

  amount: z.number().nonnegative(),

  dueAmount: z.number().nonnegative(),

  currency: z.string().length(3),

  status: z.enum([
    "DRAFT",
    "ISSUED",
    "PARTIALLY_PAID",
    "PAID",
    "OVERDUE",
    "CANCELLED",
  ]),

  customerId: z.string().optional(),

  dueAt: z.coerce.date().optional(),

  paidAt: z.coerce.date().optional(),

  raw: z.record(z.string(), z.unknown()).optional(),
});

export const WebhookEventPayloadSchema = z.object({
  provider: z.literal("razorpay"),

  eventId: z.string().min(1),

  eventType: z.string().min(1),

  payload: z.record(z.string(), z.unknown()),

  signature: z.string().optional(),
});

export const EventEnvelopeSchema = z.object({
  eventId: z.string().min(1),

  eventType: EventTypeSchema,

  version: z.literal(EVENT_VERSION),

  source: EventSourceSchema,

  merchantId: z.string().min(1),

  occurredAt: z.coerce.date(),

  receivedAt: z.coerce.date(),

  correlationId: z.string().optional(),

  causationId: z.string().optional(),

  status: EventStatusSchema.optional(),

  metadata: EventMetadataSchema.optional(),

  payload: z.unknown(),
});

export const EventContextSchema = z.object({
  merchantId: z.string().min(1),

  eventId: z.string().min(1),

  eventType: EventTypeSchema,

  metadata: EventMetadataSchema.optional(),
});