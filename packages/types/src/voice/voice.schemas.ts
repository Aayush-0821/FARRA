import { z } from "zod";

import {
  PROMISE_STATUS,
  VOICE_CALL_OUTCOME,
  VOICE_LANGUAGE,
  VOICE_RECOVERY_STATUS,
} from "./voice.constants";

export const VoiceRecoveryStatusSchema = z.enum([
  VOICE_RECOVERY_STATUS.SCHEDULED,
  VOICE_RECOVERY_STATUS.IN_PROGRESS,
  VOICE_RECOVERY_STATUS.COMPLETED,
  VOICE_RECOVERY_STATUS.FAILED,
  VOICE_RECOVERY_STATUS.NO_ANSWER,
  VOICE_RECOVERY_STATUS.DECLINED,
]);

export const PromiseStatusSchema = z.enum([
  PROMISE_STATUS.PENDING,
  PROMISE_STATUS.FULFILLED,
  PROMISE_STATUS.BROKEN,
  PROMISE_STATUS.EXPIRED,
  PROMISE_STATUS.CANCELLED,
]);

export const VoiceLanguageSchema = z.enum([
  VOICE_LANGUAGE.ENGLISH,
  VOICE_LANGUAGE.HINDI,
  VOICE_LANGUAGE.HINGLISH,
]);

export const VoiceCallOutcomeSchema = z.enum([
  VOICE_CALL_OUTCOME.PAYMENT_PROMISED,
  VOICE_CALL_OUTCOME.PAYMENT_COMPLETED,
  VOICE_CALL_OUTCOME.CALLBACK_REQUESTED,
  VOICE_CALL_OUTCOME.DECLINED,
  VOICE_CALL_OUTCOME.NO_ANSWER,
  VOICE_CALL_OUTCOME.WRONG_NUMBER,
  VOICE_CALL_OUTCOME.CUSTOMER_UNAVAILABLE,
  VOICE_CALL_OUTCOME.OTHER,
]);

export const CreateVoiceRecoverySchema = z.object({
  recoveryCaseId: z.string().min(1),

  customerId: z.string().min(1),

  language: VoiceLanguageSchema,

  phone: z
    .string()
    .min(7)
    .max(20),

  status: VoiceRecoveryStatusSchema.default(
    VOICE_RECOVERY_STATUS.SCHEDULED,
  ),
});

export const UpdateVoiceRecoverySchema = z.object({
  status: VoiceRecoveryStatusSchema,

  transcript: z.string().optional(),

  outcome: VoiceCallOutcomeSchema.optional(),

  startedAt: z.coerce.date().optional(),

  completedAt: z.coerce.date().optional(),
});

export const StartVoiceCallSchema = z.object({
  voiceRecoveryId: z.string().min(1),

  phone: z
    .string()
    .min(7)
    .max(20),

  language: VoiceLanguageSchema,
});

export const CompleteVoiceCallSchema = z.object({
  voiceRecoveryId: z.string().min(1),

  outcome: VoiceCallOutcomeSchema,

  transcript: z.string().optional(),

  completedAt: z.coerce.date().optional(),
});

export const CreatePromiseToPaySchema = z.object({
  voiceRecoveryId: z.string().min(1),

  customerId: z.string().min(1),

  amount: z.number().positive(),

  currency: z
    .string()
    .length(3)
    .default("INR"),

  promisedAt: z.coerce.date(),

  dueAt: z.coerce.date(),

  status: PromiseStatusSchema.default(
    PROMISE_STATUS.PENDING,
  ),
});

export const UpdatePromiseToPaySchema = z.object({
  status: PromiseStatusSchema,

  fulfilledAt: z.coerce.date().optional(),
});

export const VoiceRecoveryRequestSchema = z.object({
  recoveryCaseId: z.string().min(1),

  customerId: z.string().min(1),

  phone: z
    .string()
    .min(7)
    .max(20),

  language: VoiceLanguageSchema,

  amount: z.number().nonnegative(),

  currency: z
    .string()
    .length(3)
    .default("INR"),

  context: z
    .record(z.string(), z.unknown())
    .optional(),
});

export const VoiceProviderResponseSchema = z.object({
  callId: z.string().min(1),

  status: VoiceRecoveryStatusSchema,

  outcome: VoiceCallOutcomeSchema.optional(),

  transcript: z.string().optional(),

  startedAt: z.coerce.date().optional(),

  completedAt: z.coerce.date().optional(),

  metadata: z
    .record(z.string(), z.unknown())
    .optional(),
});