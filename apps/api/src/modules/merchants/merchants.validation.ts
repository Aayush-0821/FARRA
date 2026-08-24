import { z } from "zod";

import {
  MERCHANT_DEFAULTS,
  MERCHANT_LIMITS,
  MERCHANT_CURRENCY,
  MERCHANT_POLICY,
} from "./merchants.constants.js";

export const updateMerchantSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),

  email: z
    .string()
    .trim()
    .email()
    .nullable()
    .optional(),

  currency: z
    .string()
    .trim()
    .length(3)
    .transform((value) => value.toUpperCase())
    .refine(
      (value) => value === MERCHANT_CURRENCY.INR,
      {
        message: `Unsupported currency. Supported currency: ${MERCHANT_CURRENCY.INR}`,
      },
    )
    .optional(),
});

export const createRecoveryPolicySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .default(MERCHANT_POLICY.DEFAULT_NAME),

  maxRetries: z
    .number()
    .int()
    .min(MERCHANT_LIMITS.MIN_RETRIES)
    .max(MERCHANT_LIMITS.MAX_RETRIES)
    .default(MERCHANT_DEFAULTS.MAX_RETRIES),

  retryWindowHours: z
    .number()
    .int()
    .min(MERCHANT_LIMITS.MIN_RETRY_WINDOW_HOURS)
    .max(MERCHANT_LIMITS.MAX_RETRY_WINDOW_HOURS)
    .default(MERCHANT_DEFAULTS.RETRY_WINDOW_HOURS),

  maxCommunicationAttempts: z
    .number()
    .int()
    .min(MERCHANT_LIMITS.MIN_COMMUNICATION_ATTEMPTS)
    .max(MERCHANT_LIMITS.MAX_COMMUNICATION_ATTEMPTS)
    .default(MERCHANT_DEFAULTS.MAX_COMMUNICATION_ATTEMPTS),

  allowAutoRetry: z
    .boolean()
    .default(MERCHANT_DEFAULTS.ALLOW_AUTO_RETRY),

  allowVoiceRecovery: z
    .boolean()
    .default(MERCHANT_DEFAULTS.ALLOW_VOICE_RECOVERY),

  escalationThreshold: z
    .number()
    .int()
    .min(MERCHANT_LIMITS.MIN_ESCALATION_THRESHOLD)
    .max(MERCHANT_LIMITS.MAX_ESCALATION_THRESHOLD)
    .default(MERCHANT_DEFAULTS.ESCALATION_THRESHOLD),

  active: z
    .boolean()
    .default(MERCHANT_DEFAULTS.POLICY_ACTIVE),
});

export const updateRecoveryPolicySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional(),

  maxRetries: z
    .number()
    .int()
    .min(MERCHANT_LIMITS.MIN_RETRIES)
    .max(MERCHANT_LIMITS.MAX_RETRIES)
    .optional(),

  retryWindowHours: z
    .number()
    .int()
    .min(MERCHANT_LIMITS.MIN_RETRY_WINDOW_HOURS)
    .max(MERCHANT_LIMITS.MAX_RETRY_WINDOW_HOURS)
    .optional(),

  maxCommunicationAttempts: z
    .number()
    .int()
    .min(MERCHANT_LIMITS.MIN_COMMUNICATION_ATTEMPTS)
    .max(MERCHANT_LIMITS.MAX_COMMUNICATION_ATTEMPTS)
    .optional(),

  allowAutoRetry: z
    .boolean()
    .optional(),

  allowVoiceRecovery: z
    .boolean()
    .optional(),

  escalationThreshold: z
    .number()
    .int()
    .min(MERCHANT_LIMITS.MIN_ESCALATION_THRESHOLD)
    .max(MERCHANT_LIMITS.MAX_ESCALATION_THRESHOLD)
    .optional(),

  active: z
    .boolean()
    .optional(),
});

export type UpdateMerchantInput = z.infer<
  typeof updateMerchantSchema
>;

export type CreateRecoveryPolicyInput = z.infer<
  typeof createRecoveryPolicySchema
>;

export type UpdateRecoveryPolicyInput = z.infer<
  typeof updateRecoveryPolicySchema
>;