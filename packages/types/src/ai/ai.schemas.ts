import { z } from "zod";

import {
  AI_ANALYSIS_STATUS,
  AI_MODEL_PROVIDER,
  AI_RECOMMENDATION_CONFIDENCE,
  AI_TASK_TYPE,
} from "./ai.constants";

export const AIModelProviderSchema = z.enum([
  AI_MODEL_PROVIDER.OPENAI,
  AI_MODEL_PROVIDER.ANTHROPIC,
  AI_MODEL_PROVIDER.GOOGLE,
  AI_MODEL_PROVIDER.LOCAL,
]);

export const AITaskTypeSchema = z.enum([
  AI_TASK_TYPE.RISK_ANALYSIS,
  AI_TASK_TYPE.RECOVERY_RECOMMENDATION,
  AI_TASK_TYPE.CUSTOMER_ANALYSIS,
  AI_TASK_TYPE.PAYMENT_ANALYSIS,
  AI_TASK_TYPE.MESSAGE_GENERATION,
  AI_TASK_TYPE.VOICE_ANALYSIS,
]);

export const AIAnalysisStatusSchema = z.enum([
  AI_ANALYSIS_STATUS.PENDING,
  AI_ANALYSIS_STATUS.PROCESSING,
  AI_ANALYSIS_STATUS.COMPLETED,
  AI_ANALYSIS_STATUS.FAILED,
]);

export const AIRecommendationConfidenceSchema = z.enum([
  AI_RECOMMENDATION_CONFIDENCE.LOW,
  AI_RECOMMENDATION_CONFIDENCE.MEDIUM,
  AI_RECOMMENDATION_CONFIDENCE.HIGH,
]);

export const CreateAIAnalysisSchema = z.object({
  revenueRiskId: z.string().min(1),

  model: z.string().min(1),

  promptVersion: z.string().optional(),

  input: z.record(z.string(), z.unknown()).optional(),

  analysis: z.record(z.string(), z.unknown()),

  confidence: z.number().min(0).max(1).optional(),
});

export const AIRequestSchema = z.object({
  taskType: AITaskTypeSchema,

  model: z.string().min(1),

  input: z.record(z.string(), z.unknown()),

  promptVersion: z.string().optional(),

  correlationId: z.string().optional(),

  timeoutMs: z.number().int().positive().max(120_000).optional(),
});

export const RiskAnalysisRequestSchema = z.object({
  revenueRiskId: z.string().min(1),

  merchantId: z.string().min(1),

  customerId: z.string().min(1).optional(),

  riskType: z.string().min(1),

  riskScore: z.number().min(0).max(1),

  probability: z.number().min(0).max(1),

  amountAtRisk: z.number().nonnegative(),

  expectedLoss: z.number().nonnegative(),

  signals: z.array(
    z.object({
      signalType: z.string().min(1),
      value: z.string().optional(),
      weight: z.number().optional(),
      source: z.string().optional(),
    }),
  ),
});

export const RecoveryRecommendationSchema = z.object({
  strategy: z.string().min(1),

  reason: z.string().min(1),

  confidence: z.number().min(0).max(1),

  priority: z.number().int().min(0).max(100),

  expectedRecoveryProbability: z
    .number()
    .min(0)
    .max(1),

  estimatedRecoveryAmount: z.number().nonnegative().optional(),

  alternatives: z
    .array(
      z.object({
        strategy: z.string().min(1),
        reason: z.string().min(1),
        confidence: z.number().min(0).max(1),
      }),
    )
    .optional(),
});

export const AIResponseSchema = z.object({
  taskType: AITaskTypeSchema,

  model: z.string().min(1),

  status: AIAnalysisStatusSchema,

  result: z.record(z.string(), z.unknown()).optional(),

  confidence: z.number().min(0).max(1).optional(),

  tokensUsed: z.number().int().nonnegative().optional(),

  latencyMs: z.number().int().nonnegative().optional(),

  error: z.string().optional(),
});