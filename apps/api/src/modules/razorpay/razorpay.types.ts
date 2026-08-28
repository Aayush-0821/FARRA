import type { z } from "zod";

import {
  createRazorpayConnectionSchema,
  updateRazorpayConnectionSchema,
  oauthCallbackSchema,
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

export type OAuthCallbackInput = z.infer<
  typeof oauthCallbackSchema
>;

export interface RazorpayOAuthTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  public_token?: string;
  refresh_token?: string;
  razorpay_account_id: string;
}

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