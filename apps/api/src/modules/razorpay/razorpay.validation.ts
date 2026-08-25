import { z } from "zod";

export const createRazorpayConnectionSchema = z.object({
  merchantId: z.string().uuid(),

  accessToken: z
    .string()
    .min(1, "Access token is required"),

  refreshToken: z
    .string()
    .min(1)
    .optional(),

  expiresAt: z
    .coerce
    .date()
    .optional(),

  scope: z
    .string()
    .trim()
    .min(1)
    .optional(),
});

export const updateRazorpayConnectionSchema = z.object({
  accessToken: z
    .string()
    .min(1)
    .optional(),

  refreshToken: z
    .string()
    .min(1)
    .optional(),

  expiresAt: z
    .coerce
    .date()
    .optional(),

  scope: z
    .string()
    .trim()
    .min(1)
    .optional(),

  status: z
    .string()
    .min(1)
    .optional(),
});

export type CreateRazorpayConnectionInput = z.infer<
  typeof createRazorpayConnectionSchema
>;

export type UpdateRazorpayConnectionInput = z.infer<
  typeof updateRazorpayConnectionSchema
>;