export type RazorpayPaymentStatus =
  | "created"
  | "authorized"
  | "captured"
  | "refunded"
  | "failed";

export type RazorpayPaymentMethod =
  | "card"
  | "netbanking"
  | "wallet"
  | "emi"
  | "upi"
  | "bank_transfer"
  | "cardless_emi"
  | string;

export interface RazorpayPayment {
  id: string;

  entity?: "payment";

  amount: number;
  currency: string;

  status: RazorpayPaymentStatus;

  orderId?: string;
  invoiceId?: string;

  method?: RazorpayPaymentMethod;

  description?: string;

  email?: string;
  contact?: string;

  customerId?: string;

  bank?: string;
  wallet?: string;
  vpa?: string;

  fee?: number;
  tax?: number;

  errorCode?: string;
  errorDescription?: string;
  errorReason?: string;
  errorSource?: string;
  errorStep?: string;

  createdAt: number;
}

export interface RazorpayPaymentResponse {
  entity: "collection";
  count: number;
  items: RazorpayPayment[];
}