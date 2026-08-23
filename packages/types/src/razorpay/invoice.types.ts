export type RazorpayInvoiceStatus =
  | "issued"
  | "partially_paid"
  | "paid"
  | "cancelled"
  | "expired";

export type RazorpayInvoiceType =
  | "invoice"
  | "receipt";

export interface RazorpayInvoice {
  id: string;

  entity?: "invoice";

  type: RazorpayInvoiceType;

  status: RazorpayInvoiceStatus;

  description?: string;

  customerId?: string;

  orderId?: string;

  subscriptionId?: string;

  amount: number;

  amountPaid: number;

  amountDue: number;

  currency: string;

  date: number;

  issuedAt?: number;

  paidAt?: number;

  expireBy?: number;

  expiredAt?: number;

  shortUrl?: string;

  billingStart?: number;

  billingEnd?: number;

  paymentAttempts?: number;

  customerNotify?: boolean;

  notes?: Record<string, string>;

  createdAt: number;
}

export interface CreateRazorpayInvoiceInput {
  type: RazorpayInvoiceType;

  description?: string;

  customerId?: string;

  subscriptionId?: string;

  amount?: number;

  currency?: string;

  date?: number;

  expireBy?: number;

  customerNotify?: boolean;

  notes?: Record<string, string>;
}

export interface RazorpayInvoiceResponse {
  entity: "collection";
  count: number;
  items: RazorpayInvoice[];
}