import type { z } from "zod";

import {
  CreateRecoveryActionSchema,
  CreateRecoveryAttemptSchema,
  CreateRecoveryCaseSchema,
  CreateRecoveryDecisionSchema,
  CreateRecoveryVerificationSchema,
  CreateRevenueAttributionSchema,
  PolicyEvaluationSchema,
  UpdateRecoveryActionSchema,
  UpdateRecoveryCaseStatusSchema,
} from "./recovery.schemas";

import type {
  ActionStatus,
  AttributionType,
  AttemptStatus,
  DecisionStatus,
  PolicyResult,
  RecoveryActionType,
  RecoveryCaseStatus,
  RecoveryChannel,
  RecoveryStrategy,
  VerificationStatus,
  VerificationType,
} from "./recovery.constants";

export type CreateRecoveryDecisionInput = z.infer<
  typeof CreateRecoveryDecisionSchema
>;

export type PolicyEvaluationInput = z.infer<
  typeof PolicyEvaluationSchema
>;

export type CreateRecoveryCaseInput = z.infer<
  typeof CreateRecoveryCaseSchema
>;

export type UpdateRecoveryCaseStatusInput = z.infer<
  typeof UpdateRecoveryCaseStatusSchema
>;

export type CreateRecoveryActionInput = z.infer<
  typeof CreateRecoveryActionSchema
>;

export type UpdateRecoveryActionInput = z.infer<
  typeof UpdateRecoveryActionSchema
>;

export type CreateRecoveryAttemptInput = z.infer<
  typeof CreateRecoveryAttemptSchema
>;

export type CreateRecoveryVerificationInput = z.infer<
  typeof CreateRecoveryVerificationSchema
>;

export type CreateRevenueAttributionInput = z.infer<
  typeof CreateRevenueAttributionSchema
>;

export interface RecoveryDecision {
  id: string;
  revenueRiskId: string;

  strategy: RecoveryStrategy;

  reason?: string;

  priority: number;

  status: DecisionStatus;

  createdAt: Date;
  expiresAt?: Date;
}

export interface PolicyEvaluation {
  id: string;
  recoveryDecisionId: string;

  result: PolicyResult;

  reason?: string;

  evaluatedAt: Date;
}

export interface RecoveryCase {
  id: string;

  merchantId: string;

  revenueRiskId: string;

  decisionId?: string;

  status: RecoveryCaseStatus;

  strategy: RecoveryStrategy;

  startedAt?: Date;
  completedAt?: Date;
  stoppedAt?: Date;

  stopReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface RecoveryAction {
  id: string;

  recoveryCaseId: string;

  actionType: RecoveryActionType;

  channel: RecoveryChannel;

  status: ActionStatus;

  scheduledAt?: Date;
  executedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface RecoveryAttempt {
  id: string;

  recoveryActionId: string;

  attemptNumber: number;

  status: AttemptStatus;

  externalReference?: string;

  errorCode?: string;

  errorMessage?: string;

  executedAt: Date;
}

export interface RecoveryVerification {
  id: string;

  recoveryCaseId: string;

  paymentId?: string;

  verificationType: VerificationType;

  referenceId?: string;

  verifiedAmount?: number;

  status: VerificationStatus;

  verifiedAt?: Date;
}

export interface RevenueAttribution {
  id: string;

  merchantId: string;

  recoveryCaseId: string;

  paymentId?: string;

  amountAtRisk: number;

  amountRecovered: number;

  currency: string;

  attributionType: AttributionType;

  confidence?: number;

  recoveredAt?: Date;
}

export interface RecoveryContext {
  merchantId: string;

  recoveryCaseId: string;

  revenueRiskId: string;

  decisionId?: string;

  correlationId?: string;

  causationId?: string;
}

export interface RecoveryExecutionResult {
  recoveryCaseId: string;

  status: RecoveryCaseStatus;

  strategy: RecoveryStrategy;

  actionId?: string;

  attemptId?: string;

  recoveredAmount?: number;

  currency?: string;

  requiresVerification: boolean;
}