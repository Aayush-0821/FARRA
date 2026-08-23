export type RazorpaySubscriptionStatus =
  | "created"
  | "authenticated"
  | "active"
  | "pending"
  | "halted"
  | "cancelled"
  | "completed";

export type RazorpaySubscriptionInterval =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export interface RazorpaySubscription {
  id: string;

  entity?: "subscription";

  planId: string;

  customerId?: string;

  status: RazorpaySubscriptionStatus;

  currentStart?: number;
  currentEnd?: number;

  chargeAt?: number;

  startAt?: number;
  endAt?: number;

  endedAt?: number;

  quantity: number;

  totalCount?: number;
  paidCount: number;
  remainingCount?: number;

  shortUrl?: string;

  hasScheduledChanges?: boolean;

  changeScheduledAt?: number;

  notes?: Record<string, string>;

  createdAt: number;
}

export interface CreateRazorpaySubscriptionInput {
  planId: string;
  customerId?: string;

  quantity?: number;

  totalCount?: number;

  startAt?: number;

  expireBy?: number;

  customerNotify?: boolean;

  notes?: Record<string, string>;
}

export interface RazorpaySubscriptionResponse {
  entity: "collection";
  count: number;
  items: RazorpaySubscription[];
}