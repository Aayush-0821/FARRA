import type { z } from "zod";

import type {
  EventSource,
  EventType,
  EventVersion,
} from "./event.constants";

import type {
  EventEnvelopeSchema,
  PaymentEventPayloadSchema,
  SubscriptionEventPayloadSchema,
  InvoiceEventPayloadSchema,
  WebhookEventPayloadSchema,
} from "./event.schemas";

export type EventEnvelope = z.infer<typeof EventEnvelopeSchema>;

export type PaymentEventPayload = z.infer<
  typeof PaymentEventPayloadSchema
>;

export type SubscriptionEventPayload = z.infer<
  typeof SubscriptionEventPayloadSchema
>;

export type InvoiceEventPayload = z.infer<
  typeof InvoiceEventPayloadSchema
>;

export type WebhookEventPayload = z.infer<
  typeof WebhookEventPayloadSchema
>;

export interface BaseEvent {
  eventId: string;
  eventType: EventType;
  version: EventVersion;
  source: EventSource;

  merchantId: string;

  occurredAt: Date;
  receivedAt: Date;

  correlationId?: string;
  causationId?: string;
}

export interface PaymentEvent extends BaseEvent {
  eventType:
    | "PAYMENT_CREATED"
    | "PAYMENT_AUTHORIZED"
    | "PAYMENT_CAPTURED"
    | "PAYMENT_FAILED"
    | "PAYMENT_REFUNDED";

  payload: PaymentEventPayload;
}

export interface SubscriptionEvent extends BaseEvent {
  eventType:
    | "SUBSCRIPTION_CREATED"
    | "SUBSCRIPTION_ACTIVATED"
    | "SUBSCRIPTION_CHARGED"
    | "SUBSCRIPTION_FAILED"
    | "SUBSCRIPTION_CANCELLED";

  payload: SubscriptionEventPayload;
}

export interface InvoiceEvent extends BaseEvent {
  eventType:
    | "INVOICE_CREATED"
    | "INVOICE_ISSUED"
    | "INVOICE_PAID"
    | "INVOICE_OVERDUE"
    | "INVOICE_CANCELLED";

  payload: InvoiceEventPayload;
}

export interface WebhookEvent extends BaseEvent {
  eventType: "WEBHOOK_RECEIVED";

  payload: WebhookEventPayload;
}

export type DomainEvent =
  | PaymentEvent
  | SubscriptionEvent
  | InvoiceEvent
  | WebhookEvent;

export interface EventMetadata {
  correlationId?: string;
  causationId?: string;
  retryCount?: number;
  sourceRequestId?: string;
}

export interface EventContext {
  merchantId: string;
  eventId: string;
  eventType: EventType;
  metadata?: EventMetadata;
}