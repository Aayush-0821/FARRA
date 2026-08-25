import type { z } from "zod";

import {
  createRazorpayConnectionSchema,
  updateRazorpayConnectionSchema,
} from "./razorpay.validation.js";

export type RazorpayConnectionStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "REVOKED"
  | "DISCONNECTED";

export type CreateRazorpayConnectionInput = z.infer<
  typeof createRazorpayConnectionSchema
>;

export type UpdateRazorpayConnectionInput = z.infer<
  typeof updateRazorpayConnectionSchema
>;

export interface RazorpayConnectionResponse {
  id: string;
  merchantId: string;
  provider: string;
  expiresAt: Date | null;
  scope: string | null;
  status: RazorpayConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}