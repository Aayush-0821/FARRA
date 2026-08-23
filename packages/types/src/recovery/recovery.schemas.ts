import { z } from "zod";

import {
  ACTION_STATUS,
  ATTRIBUTION_TYPE,
  ATTEMPT_STATUS,
  DECISION_STATUS,
  POLICY_RESULT,
  RECOVERY_ACTION_TYPE,
  RECOVERY_CASE_STATUS,
  RECOVERY_CHANNEL,
  RECOVERY_STRATEGY,
  VERIFICATION_STATUS,
  VERIFICATION_TYPE,
} from "./recovery.constants";

export const RecoveryStrategySchema = z.enum([
  RECOVERY_STRATEGY.RETRY_PAYMENT,
  RECOVERY_STRATEGY.RETRY_MANDATE,
  RECOVERY_STRATEGY.SEND_PAYMENT_LINK,
  RECOVERY_STRATEGY.SEND_EMAIL,
  RECOVERY_STRATEGY.SEND_WHATSAPP,
  RECOVERY_STRATEGY.VOICE_RECOVERY,
  RECOVERY_STRATEGY.SUBSCRIPTION_RETRY,
  RECOVERY_STRATEGY.PAYMENT_REMINDER,
  RECOVERY_STRATEGY.B2B_CHASER,
  RECOVERY_STRATEGY.PROMISE_TO_PAY,
  RECOVERY_STRATEGY.ESCALATE,
  RECOVERY_STRATEGY.NO_ACTION,
]);

export const RecoveryCaseStatusSchema = z.enum([
  RECOVERY_CASE_STATUS.PENDING,
  RECOVERY_CASE_STATUS.ACTIVE,
  RECOVERY_CASE_STATUS.RECOVERED,
  RECOVERY_CASE_STATUS.PARTIALLY_RECOVERED,
  RECOVERY_CASE_STATUS.FAILED,
  RECOVERY_CASE_STATUS.STOPPED,
  RECOVERY_CASE_STATUS.EXPIRED,
]);

export const RecoveryActionTypeSchema = z.enum([
  RECOVERY_ACTION_TYPE.RETRY_PAYMENT,
  RECOVERY_ACTION_TYPE.RETRY_MANDATE,
  RECOVERY_ACTION_TYPE.SEND_EMAIL,
  RECOVERY_ACTION_TYPE.SEND_WHATSAPP,
  RECOVERY_ACTION_TYPE.SEND_SMS,
  RECOVERY_ACTION_TYPE.VOICE_CALL,
  RECOVERY_ACTION_TYPE.SEND_PAYMENT_LINK,
  RECOVERY_ACTION_TYPE.SUBSCRIPTION_RETRY,
  RECOVERY_ACTION_TYPE.PAYMENT_REMINDER,
  RECOVERY_ACTION_TYPE.ESCALATE,
]);

export const RecoveryChannelSchema = z.enum([
  RECOVERY_CHANNEL.PAYMENT_API,
  RECOVERY_CHANNEL.EMAIL,
  RECOVERY_CHANNEL.WHATSAPP,
  RECOVERY_CHANNEL.SMS,
  RECOVERY_CHANNEL.VOICE,
  RECOVERY_CHANNEL.DASHBOARD,
]);

export const ActionStatusSchema = z.enum([
  ACTION_STATUS.SCHEDULED,
  ACTION_STATUS.EXECUTING,
  ACTION_STATUS.SUCCESS,
  ACTION_STATUS.FAILED,
  ACTION_STATUS.SKIPPED,
  ACTION_STATUS.CANCELLED,
]);

export const AttemptStatusSchema = z.enum([
  ATTEMPT_STATUS.STARTED,
  ATTEMPT_STATUS.SUCCESS,
  ATTEMPT_STATUS.FAILED,
  ATTEMPT_STATUS.TIMEOUT,
  ATTEMPT_STATUS.CANCELLED,
]);

export const DecisionStatusSchema = z.enum([
  DECISION_STATUS.PENDING,
  DECISION_STATUS.APPROVED,
  DECISION_STATUS.BLOCKED,
  DECISION_STATUS.EXECUTED,
  DECISION_STATUS.FAILED,
  DECISION_STATUS.EXPIRED,
]);

export const PolicyResultSchema = z.enum([
  POLICY_RESULT.ALLOWED,
  POLICY_RESULT.BLOCKED,
  POLICY_RESULT.ESCALATED,
]);

export const VerificationTypeSchema = z.enum([
  VERIFICATION_TYPE.PAYMENT_STATUS,
  VERIFICATION_TYPE.RAZORPAY_WEBHOOK,
  VERIFICATION_TYPE.TRANSACTION_LOOKUP,
  VERIFICATION_TYPE.MANUAL,
]);

export const VerificationStatusSchema = z.enum([
  VERIFICATION_STATUS.PENDING,
  VERIFICATION_STATUS.VERIFIED,
  VERIFICATION_STATUS.FAILED,
]);

export const AttributionTypeSchema = z.enum([
  ATTRIBUTION_TYPE.DIRECT,
  ATTRIBUTION_TYPE.ASSISTED,
  ATTRIBUTION_TYPE.PROBABILISTIC,
]);

export const CreateRecoveryDecisionSchema = z.object({
  revenueRiskId: z.string().min(1),

  strategy: RecoveryStrategySchema,

  reason: z.string().max(2000).optional(),

  priority: z.number().int().min(0).max(100).default(0),

  expiresAt: z.coerce.date().optional(),
});

export const PolicyEvaluationSchema = z.object({
  recoveryDecisionId: z.string().min(1),

  result: PolicyResultSchema,

  reason: z.string().max(2000).optional(),
});

export const CreateRecoveryCaseSchema = z.object({
  merchantId: z.string().min(1),

  revenueRiskId: z.string().min(1),

  decisionId: z.string().min(1).optional(),

  strategy: RecoveryStrategySchema,
});

export const UpdateRecoveryCaseStatusSchema = z.object({
  status: RecoveryCaseStatusSchema,

  stopReason: z.string().max(2000).optional(),
});

export const CreateRecoveryActionSchema = z.object({
  recoveryCaseId: z.string().min(1),

  actionType: RecoveryActionTypeSchema,

  channel: RecoveryChannelSchema,

  scheduledAt: z.coerce.date().optional(),
});

export const UpdateRecoveryActionSchema = z.object({
  status: ActionStatusSchema,

  executedAt: z.coerce.date().optional(),
});

export const CreateRecoveryAttemptSchema = z.object({
  recoveryActionId: z.string().min(1),

  attemptNumber: z.number().int().positive(),

  status: AttemptStatusSchema,

  externalReference: z.string().optional(),

  errorCode: z.string().optional(),

  errorMessage: z.string().optional(),

  executedAt: z.coerce.date().optional(),
});

export const CreateRecoveryVerificationSchema = z.object({
  recoveryCaseId: z.string().min(1),

  paymentId: z.string().min(1).optional(),

  verificationType: VerificationTypeSchema,

  referenceId: z.string().optional(),

  verifiedAmount: z.number().nonnegative().optional(),

  status: VerificationStatusSchema.default(
    VERIFICATION_STATUS.PENDING,
  ),

  verifiedAt: z.coerce.date().optional(),
});

export const CreateRevenueAttributionSchema = z.object({
  merchantId: z.string().min(1),

  recoveryCaseId: z.string().min(1),

  paymentId: z.string().min(1).optional(),

  amountAtRisk: z.number().nonnegative(),

  amountRecovered: z.number().nonnegative(),

  currency: z.string().length(3).default("INR"),

  attributionType: AttributionTypeSchema,

  confidence: z.number().min(0).max(1).optional(),

  recoveredAt: z.coerce.date().optional(),
});