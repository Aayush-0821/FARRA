import type { RazorpayInvoice } from "./invoice.types";
import type { RazorpayPayment } from "./payment.types";
import type { RazorpaySubscription } from "./subscription.types";

export type RazorpayWebhookEvent =
  | "payment.authorized"
  | "payment.captured"
  | "payment.failed"
  | "payment.refunded"
  | "subscription.activated"
  | "subscription.charged"
  | "subscription.completed"
  | "subscription.cancelled"
  | "subscription.halted"
  | "subscription.paused"
  | "subscription.resumed"
  | "invoice.issued"
  | "invoice.paid"
  | "invoice.partially_paid"
  | "invoice.expired"
  | "invoice.cancelled"
  | string;

export interface RazorpayWebhookRequest {
  event: RazorpayWebhookEvent;

  accountId?: string;

  contains: string[];

  payload: RazorpayWebhookPayload;

  createdAt: number;
}

export interface RazorpayWebhookPayload {
  payment?: {
    entity: RazorpayPayment;
  };

  subscription?: {
    entity: RazorpaySubscription;
  };

  invoice?: {
    entity: RazorpayInvoice;
  };
}

export interface RazorpayWebhookHeaders {
  signature: string;
  eventId?: string;
}

export interface RazorpayWebhookContext {
  event: RazorpayWebhookRequest;
  headers: RazorpayWebhookHeaders;
  receivedAt: Date;
}