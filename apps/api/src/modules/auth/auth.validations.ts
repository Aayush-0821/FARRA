import { z } from "zod";
import { AUTH_LIMITS } from "./auth.constants.js";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(AUTH_LIMITS.NAME_MIN_LENGTH, "Name is required")
    .max(
      AUTH_LIMITS.NAME_MAX_LENGTH,
      `Name must be at most ${AUTH_LIMITS.NAME_MAX_LENGTH} characters`,
    ),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(
      AUTH_LIMITS.EMAIL_MAX_LENGTH,
      `Email must be at most ${AUTH_LIMITS.EMAIL_MAX_LENGTH} characters`,
    ),

  password: z
    .string()
    .min(
      AUTH_LIMITS.PASSWORD_MIN_LENGTH,
      `Password must be at least ${AUTH_LIMITS.PASSWORD_MIN_LENGTH} characters`,
    )
    .max(
      AUTH_LIMITS.PASSWORD_MAX_LENGTH,
      `Password must be at most ${AUTH_LIMITS.PASSWORD_MAX_LENGTH} characters`,
    ),

  merchantName: z
    .string()
    .trim()
    .min(1, "Merchant name is required")
    .max(200, "Merchant name must be at most 200 characters"),

  razorpayAccountId: z
    .string()
    .trim()
    .min(1, "Razorpay account ID cannot be empty")
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(
      AUTH_LIMITS.EMAIL_MAX_LENGTH,
      `Email must be at most ${AUTH_LIMITS.EMAIL_MAX_LENGTH} characters`,
    ),

  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  token: z
    .string()
    .min(1, "Verification token is required"),
});

export const resendVerificationEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(
      AUTH_LIMITS.EMAIL_MAX_LENGTH,
      `Email must be at most ${AUTH_LIMITS.EMAIL_MAX_LENGTH} characters`,
    ),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(
      AUTH_LIMITS.EMAIL_MAX_LENGTH,
      `Email must be at most ${AUTH_LIMITS.EMAIL_MAX_LENGTH} characters`,
    ),
});

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, "Reset token is required"),

  password: z
    .string()
    .min(
      AUTH_LIMITS.PASSWORD_MIN_LENGTH,
      `Password must be at least ${AUTH_LIMITS.PASSWORD_MIN_LENGTH} characters`,
    )
    .max(
      AUTH_LIMITS.PASSWORD_MAX_LENGTH,
      `Password must be at most ${AUTH_LIMITS.PASSWORD_MAX_LENGTH} characters`,
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationEmailInput = z.infer<
  typeof resendVerificationEmailSchema
>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;